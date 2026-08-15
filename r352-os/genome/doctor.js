#!/usr/bin/env node
/* ═══ GENOME DOCTOR — deterministyczny doradca (ZERO LLM, ZERO tokenów) ═══
 * Robi to, co dotąd robiła sesja Claude: szuka luk, proponuje mechanizmy, pilnuje terminów,
 * opróżnia kolejkę. Sesja zostaje tylko tam, gdzie potrzebna jest semantyka albo decyzja.
 *
 *   node doctor.js                    pełny przegląd (health + luki + terminy + kolejka)
 *   node doctor.js --suggest "brief"  kandydaci na mechanizmy do briefu (scoring, bez LLM)
 *   node doctor.js --gaps             luki inwentarza: foldery robocze vs projekty w Genome
 *   node doctor.js --pending [--apply] oczekujące pakiety z pending/ (podgląd / wykonanie)
 *   node doctor.js --json             wynik maszynowo (dla crona, taska, viewera)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const G = process.env.GENOME_DIR || __dirname;
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const out = { generated: new Date().toISOString(), health: [], gaps: [], deadlines: [], pending: [], suggestions: [] };
const say = (...a) => { if (!JSON_OUT) console.log(...a); };

/* ── dane z ostatniego builda (bez ponownego parsowania kart) ── */
function loadData() {
  const f = path.join(G, 'dist', 'genome-data.js');
  if (!fs.existsSync(f)) { say('✗ brak dist/genome-data.js — uruchom `node build.js`'); process.exit(2); }
  const s = fs.readFileSync(f, 'utf8');
  return JSON.parse(s.slice(s.indexOf('=') + 1).trim().replace(/;\s*$/, ''));
}
const D = loadData();
const objs = Object.values(D.objects);
const byType = t => objs.filter(o => o.type === t);

/* ═══ 1. HEALTH — co wymaga uwagi CZŁOWIEKA ═══ */
function health() {
  const h = [];
  /* projekty aktywne bez świeżego ruchu */
  const active = byType('project').filter(p => p.status === 'active');
  for (const p of active) {
    const evs = (D.recent_events || []).filter(e => e.on === p.id);
    if (!evs.length) h.push({ level: 'info', what: `${p.id}: brak zdarzeń w ostatnich 30 — projekt stoi`, action: 'domknąć etap albo zarejestrować iterację' });
  }
  /* projekty zamknięte bez postmortemu */
  for (const p of byType('project').filter(p => p.status === 'closed' && !p.postmortem))
    h.push({ level: 'error', what: `${p.id}: closed bez postmortemu`, action: '/project-postmortem' });
  /* mechanizmy bez żywego dowodu, ale rekomendowane wysoko */
  const mech = byType('mechanism');
  const noLive = mech.filter(m => !(m.evidence || []).some(e => (e.type === 'measurement' || e.type === 'postmortem') && !String(e.source || '').startsWith('rec:backtests/')));
  if (noLive.length === mech.length) h.push({ level: 'warn', what: `0/${mech.length} mechanizmów ma ŻYWY dowód (wszystko z retro-backtestów)`, action: 'domknąć pierwszy trial' });
  /* karty oflagowane w evidence jako too-broad / wrong-trigger */
  const flagged = {};
  for (const m of mech) for (const e of (m.evidence || [])) {
    const f = /too-broad/i.test(e.note) ? 'too-broad' : /wrong-trigger/i.test(e.note) ? 'wrong-trigger' : /too-narrow/i.test(e.note) ? 'too-narrow' : null;
    if (f) { flagged[m.id] = flagged[m.id] || {}; flagged[m.id][f] = (flagged[m.id][f] || 0) + 1; }
  }
  for (const [id, f] of Object.entries(flagged)) {
    const total = Object.values(f).reduce((a, b) => a + b, 0);
    if (total >= 3) h.push({ level: 'warn', what: `${id}: ${total} flag (${Object.entries(f).map(([k, v]) => k + '×' + v).join(', ')})`, action: 'kandydat do podziału/przepisania triggera' });
  }
  /* zdarzenia z przyszłości = zamrożony zapis */
  const ledger = path.join(G, 'ledger');
  if (fs.existsSync(ledger)) {
    let maxTs = 0, count = 0;
    for (const f of fs.readdirSync(ledger).filter(x => x.endsWith('.jsonl')))
      for (const l of fs.readFileSync(path.join(ledger, f), 'utf8').split('\n').filter(Boolean)) {
        const t = Date.parse(JSON.parse(l).ts);
        if (t > Date.now()) { count++; maxTs = Math.max(maxTs, t); }
      }
    if (count) h.push({ level: 'error', what: `${count} zdarzeń z datą w przyszłości — zapis do Ledgera zablokowany do ${new Date(maxTs).toLocaleString('pl-PL')}`, action: 'poczekać albo użyć pending/' });
  }
  return h;
}

/* ═══ 2. LUKI INWENTARZA — foldery robocze vs projekty ═══ */
const IGNORE_DIRS = /^(node_modules|\.git|dist|\.next|build|Figma|Obsydian|Ksiazki|Dane do aplikacji|RAPORTY NOWE)$/i;
const KNOWN = {  /* ręczne mapowania: folder → projekt (nazwy się nie pokrywają) */
  'Fruityyyy': 'proj:dailyfruits-relaunch', 'FrameWorkProdukty': 'proj:r352-framework-brand-hub-os',
  'BetterWorkplace': 'proj:betterguide-hub', 'BENEFITSYSTEMS_ZDROFIT': 'proj:zdrofit-hourly-pipeline',
  'OTWARCIA_SYSTEM': 'proj:zdrofit-lodygowa-witryny', 'BRIEFER': 'proj:briefsync',
  'FOTRA': 'proj:fotra-panel', 'FOTRA_02': 'proj:fotra-panel', 'r3loop-os': 'proj:r3loop-app',
  'dowodowka_lipeic': 'proj:fitstyle-platform', 'dsadsa': 'proj:instytut-kawy',
  'R352 WEBSITE': 'proj:r352-website', 'ARToffNIA': 'proj:artoffnia-oferta',
};
function gaps() {
  const roots = [path.join(process.env.HOME, 'Desktop', 'Claude_zadania'), path.join(process.env.HOME, 'Desktop')];
  const projectIds = new Set(byType('project').map(p => p.id));
  const found = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const d of fs.readdirSync(root)) {
      const full = path.join(root, d);
      let st; try { st = fs.statSync(full); } catch { continue; }
      if (!st.isDirectory() || IGNORE_DIRS.test(d) || d.startsWith('.')) continue;
      const mtimeMonths = (Date.now() - st.mtimeMs) / (1000 * 60 * 60 * 24 * 30);
      if (mtimeMonths > 6) continue;                       // starsze niż pół roku — poza radarem
      if (KNOWN[d] && projectIds.has(KNOWN[d])) continue;   // znane mapowanie
      /* dopasowanie po słowach ≥4 znaki */
      const words = d.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(w => w.length >= 4);
      const hit = [...projectIds].some(p => words.some(w => p.includes(w)));
      if (hit) continue;
      let files = 0; try { files = execFileSync('bash', ['-c', `find ${JSON.stringify(full)} -type f -not -path '*/.git/*' -not -path '*/node_modules/*' 2>/dev/null | head -500 | wc -l`], { encoding: 'utf8' }).trim(); } catch { }
      found.push({ folder: d, root: path.basename(root), files: +files, months_idle: Math.round(mtimeMonths * 10) / 10 });
    }
  }
  return found.filter(f => f.files >= 3).sort((a, b) => a.months_idle - b.months_idle);
}

/* ═══ 3. TERMINY — predykcje i daty pomiaru ═══ */
function deadlines() {
  const d = [];
  for (const p of (D.predictions || [])) {
    const due = Date.parse(p.deadline);
    if (!due) continue;
    const days = Math.round((due - Date.now()) / 86400000);
    d.push({ id: p.id, on: p.on, p: p.p, days, claim: String(p.claim || '').slice(0, 90), overdue: days < 0 });
  }
  for (const pr of byType('project').filter(x => x.measurement_date)) {
    const days = Math.round((Date.parse(pr.measurement_date) - Date.now()) / 86400000);
    if (days <= 14) d.push({ id: pr.id, on: pr.id, days, claim: 'termin pomiaru wyniku projektu', overdue: days < 0 });
  }
  return d.sort((a, b) => a.days - b.days);
}

/* ═══ 4. SUGESTIE MECHANIZMÓW — scoring bez LLM ═══ */
const STOP = new Set('i oraz w na do dla z ze że to jest są być ma mieć nie o a od po przy przez jak co się tego tym ten ta te już bardzo tylko może można gdzie kiedy który która które'.split(' '));
function suggest(brief) {
  const q = brief.toLowerCase().replace(/[^a-ząćęłńóśźż0-9\s]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !STOP.has(w));
  const scored = byType('mechanism').map(m => {
    const trig = String(m.trigger || '').toLowerCase();
    const ctx = String(m.context || '').toLowerCase();
    const anti = String(m.anti_context || '').toLowerCase();
    let score = 0, why = [], against = [];
    for (const w of q) {
      if (trig.includes(w)) { score += 3; why.push(w); }
      else if (ctx.includes(w)) { score += 2; why.push(w); }
      if (anti.includes(w)) { score -= 2; against.push(w); }
    }
    /* premia za dowody, kara za flagi jakości karty */
    const ev = m.evidence || [];
    const live = ev.filter(e => (e.type === 'measurement' || e.type === 'postmortem') && !String(e.source || '').startsWith('rec:backtests/')).length;
    const flags = ev.filter(e => /too-broad|wrong-trigger/i.test(e.note)).length;
    score += live * 2 - Math.min(flags, 4);
    return { id: m.id, title: m.title, status: m.status, score, why: [...new Set(why)].slice(0, 5), against: [...new Set(against)].slice(0, 3), evidence: ev.length, live, flags };
  }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);
  return scored;
}

/* ═══ 5. KOLEJKA pending/ ═══ */
function pending(apply) {
  const dir = path.join(G, 'pending');
  if (!fs.existsSync(dir)) return [];
  const items = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const res = [];
  for (const f of items) {
    const p = path.join(dir, f);
    let r = { file: f, status: 'oczekuje' };
    if (apply) {
      try {
        execFileSync('node', [path.join(G, 'ingest.js'), p], { encoding: 'utf8', env: process.env });
        fs.mkdirSync(path.join(dir, 'done'), { recursive: true });
        fs.renameSync(p, path.join(dir, 'done', f));
        r.status = 'zapisane';
      } catch (e) { r.status = 'odrzucone'; r.error = String((e.stdout || '') + (e.message || '')).split('\n').filter(l => l.includes('✗')).slice(0, 2).join(' | '); }
    }
    res.push(r);
  }
  return res;
}


/* ═══ 6. UMIEJĘTNOŚCI — dwie osie: klasa problemu × dyscyplina ═══ */
function skills() {
  const M = byType('mechanism');
  const DISC = ['strategia', 'design', 'copy', 'performance', 'frontend', 'backend', 'ops'];
  const byCat = {}, byDisc = Object.fromEntries(DISC.map(d => [d, []]));
  for (const m of M) {
    (byCat[m.category] = byCat[m.category] || []).push(m);
    for (const t of (m.tags || [])) if (byDisc[t]) byDisc[t].push(m);
  }
  return { byCat, byDisc, DISC, total: M.length };
}

/* ═══ CLI ═══ */

if (args.includes('--skills')) {
  const { byCat, byDisc, DISC, total } = skills();
  if (JSON_OUT) { console.log(JSON.stringify({ byCat: Object.fromEntries(Object.entries(byCat).map(([k, v]) => [k, v.map(m => m.id)])), byDisc: Object.fromEntries(Object.entries(byDisc).map(([k, v]) => [k, v.map(m => m.id)])) }, null, 1)); process.exit(0); }
  say(`\n═══ UMIEJĘTNOŚCI (${total} mechanizmów, dwie osie) ═══\n`);
  say('── OŚ 1: klasa problemu (co rozwiązujemy) ──');
  for (const [c, list] of Object.entries(byCat).sort((a, b) => b[1].length - a[1].length))
    say(`  ${String(list.length).padStart(2)} · ${c}\n       ${list.map(m => m.id.replace('mech:', '')).join(', ')}`);
  say('\n── OŚ 2: dyscyplina (czego dotyka) ──');
  const max = Math.max(...DISC.map(d => byDisc[d].length));
  for (const dsc of DISC) {
    const n = byDisc[dsc].length;
    const bar = '█'.repeat(Math.round(n / max * 22)) || '·';
    const live = byDisc[dsc].filter(m => (m.evidence || []).some(e => (e.type === 'measurement' || e.type === 'postmortem') && !String(e.source || '').startsWith('rec:backtests/'))).length;
    say(`  ${dsc.padEnd(12)} ${String(n).padStart(2)}  ${bar}${n <= 2 ? '   ⚠ cienka półka' : ''}`);
  }
  const thin = DISC.filter(d => byDisc[d].length <= 2);
  if (thin.length) say(`\n  ⚠ Dziury kompetencyjne: ${thin.join(', ')} — mało zmechanizowane mimo że realnie sprzedawane.`);
  say(`  → to jest materiał na ofertę i na decyzję "w co inwestuję następny kwartał".\n`);
  process.exit(0);
}

const idx = args.indexOf('--suggest');
if (idx >= 0) {
  const brief = args[idx + 1] || '';
  if (!brief) { console.error('użycie: node doctor.js --suggest "opis problemu klienta"'); process.exit(2); }
  out.suggestions = suggest(brief);
  if (JSON_OUT) { console.log(JSON.stringify(out.suggestions, null, 1)); process.exit(0); }
  say(`\n═══ KANDYDACI NA MECHANIZMY (scoring deterministyczny, zero LLM) ═══\n`);
  if (!out.suggestions.length) say('  Brak trafień — to sygnał wartości: Genome nie zna tej klasy problemu.\n  → projekt dostaje sekcję Hipotezy i obowiązek nowej karty po postmortemie.\n');
  out.suggestions.slice(0, 8).forEach((m, i) => {
    say(`${String(i + 1).padStart(2)}. ${m.id}  [${m.status}]  score ${m.score}`);
    say(`    ${m.title}`);
    if (m.why.length) say(`    trafienia: ${m.why.join(', ')}`);
    if (m.against.length) say(`    ⚠ anti-context: ${m.against.join(', ')}`);
    say(`    evidence: ${m.evidence} (żywe: ${m.live}${m.flags ? `, flagi jakości: ${m.flags}` : ''})`);
  });
  say(`\n  To NIE zastępuje raportu Routera — daje krótką listę do weryfikacji semantycznej.\n  Pełny raport 9 sekcji: /mechanism-router <brief>\n`);
  process.exit(0);
}

if (args.includes('--gaps')) { out.gaps = gaps(); }
else if (args.includes('--pending')) { out.pending = pending(args.includes('--apply')); }
else { out.health = health(); out.gaps = gaps(); out.deadlines = deadlines(); out.pending = pending(false); }

if (JSON_OUT) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }

const ICON = { error: '✗', warn: '⚠', info: '·' };
say(`\n═══ GENOME DOCTOR ═══  stan: ${String(D.state || '').slice(0, 16)} · ${objs.length} obiektów · ${D.events_count} zdarzeń\n`);
if (out.health.length) {
  say('── Wymaga uwagi ──');
  for (const h of out.health) say(`  ${ICON[h.level]} ${h.what}\n      → ${h.action}`);
  say('');
}
if (out.deadlines.length) {
  say('── Terminy ──');
  for (const d of out.deadlines) say(`  ${d.overdue ? '✗ PO TERMINIE' : d.days <= 3 ? '⚠ za ' + d.days + ' dni' : '· za ' + d.days + ' dni'}  ${d.id} (${d.on})\n      ${d.claim}`);
  say('');
}
if (out.gaps.length) {
  say('── Luki inwentarza (folder bez karty w Genome) ──');
  for (const g of out.gaps.slice(0, 12)) say(`  · ${g.folder}  [${g.root}, ${g.files} plików, ${g.months_idle} mies. temu]`);
  say(`  → realny projekt? dodaj kartę. eksperyment/prywatne? dopisz do IGNORE w doctor.js\n`);
}
if (out.pending.length) {
  say('── Kolejka pending/ ──');
  for (const p of out.pending) say(`  · ${p.file} — ${p.status}`);
  say('  → wykonaj: node doctor.js --pending --apply\n');
}
if (!out.health.length && !out.deadlines.length && !out.gaps.length && !out.pending.length) say('  ✓ Nic nie wymaga uwagi.\n');
