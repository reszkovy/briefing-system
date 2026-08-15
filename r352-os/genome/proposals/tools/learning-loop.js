#!/usr/bin/env node
/* ═══ PĘTLA UCZENIA — co z projektu wróciło do wiedzy, a co utknęło ═══
 *
 * PO CO. 10.08 okazało się, że backtesty z 08–09.08 wygenerowały wnioski, zapisały je jako
 * Evidence i propozycje zmian — a te zmiany nigdy nie doszły do kart. Router czyta karty,
 * nie Evidence, więc przez kilka dni rekomendował mechanizm, o którym system miał zapisany
 * dowód, że w tej postaci szkodzi. Nikt tego nie zauważył, bo NIE BYŁO WIDOKU: dane leżały
 * w Ledgerze i w Recordach, tylko nigdzie nie stały obok siebie.
 *
 * Ten skrypt kładzie je obok siebie. Dla każdego projektu pokazuje łańcuch:
 *
 *     projekt → backtest/postmortem → zdarzenia, które z niego wynikły → zmienione karty
 *
 * i zapala flagę tam, gdzie łańcuch się urywa: jest backtest, nie ma ani jednego zdarzenia,
 * które by się na niego powoływało. To jest sygnatura wniosku, który przepadł.
 *
 * TYLKO ODCZYT. Nie zapisuje niczego, nie tworzy propozycji, nie dotyka kanonu.
 *
 *   node proposals/tools/learning-loop.js            wszystkie projekty z materiałem
 *   node proposals/tools/learning-loop.js --gaps     wyłącznie urwane łańcuchy
 *   node proposals/tools/learning-loop.js --preds    stan predykcji
 */
'use strict';
const fs = require('fs');
const path = require('path');

function genomeRoot(start) {
  let d = start;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(d, 'build.js')) && fs.existsSync(path.join(d, 'ledger'))) return d;
    const up = path.dirname(d); if (up === d) break; d = up;
  }
  throw new Error('nie znaleziono korzenia Genome');
}
const G = genomeRoot(__dirname);
const ONLY_GAPS = process.argv.includes('--gaps');
const ONLY_PREDS = process.argv.includes('--preds');

/* ── Ledger ── */
const events = fs.readdirSync(path.join(G, 'ledger')).filter(f => f.endsWith('.jsonl')).sort()
  .flatMap(f => fs.readFileSync(path.join(G, 'ledger', f), 'utf8').trim().split('\n')
    .filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean));

/* ── karty: id → {type, title, relations} ── */
const cards = new Map();
(function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!e.name.endsWith('.md')) continue;
    const raw = fs.readFileSync(p, 'utf8');
    const fm = raw.split('---')[1]; if (!fm) continue;
    const g = k => { const m = fm.match(new RegExp('^' + k + ': (.*)$', 'm')); if (!m) return null;
      try { return JSON.parse(m[1]); } catch { return m[1].replace(/^"|"$/g, ''); } };
    const id = g('id'); if (!id) return cards;
    cards.set(id, { id, type: g('type'), title: g('title'), relations: g('relations') || {}, file: path.relative(G, p) });
  }
})(path.join(G, 'records'));
for (const d of ['projects', 'mechanisms', 'decisions', 'workflows']) {
  const dir = path.join(G, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const fm = raw.split('---')[1]; if (!fm) continue;
    const g = k => { const m = fm.match(new RegExp('^' + k + ': (.*)$', 'm')); if (!m) return null;
      try { return JSON.parse(m[1]); } catch { return m[1].replace(/^"|"$/g, ''); } };
    const id = g('id'); if (id) cards.set(id, { id, type: g('type'), title: g('title'), relations: g('relations') || {}, file: path.join(d, f) });
  }
}

const title = id => (cards.get(id) || {}).title || id;
const short = s => String(s || '').replace(/\s+/g, ' ').slice(0, 74);

/* ── Recordy analityczne (backtest/postmortem) przypięte do projektów ── */
const analyses = [...cards.values()].filter(c =>
  c.type === 'record' && /\/(backtests|postmortems)\//.test(c.file));

const byProject = new Map();
for (const a of analyses) {
  const to = [].concat((a.relations || {}).attached_to || []);
  const projs = to.filter(x => String(x).startsWith('proj:'));
  for (const p of (projs.length ? projs : ['(bez przypisania)'])) {
    if (!byProject.has(p)) byProject.set(p, []);
    byProject.get(p).push(a);
  }
}

/* ── zdarzenia powołujące się na dany Record ── */
const caused = new Map();
for (const e of events) {
  if (!e.cause) continue;
  if (!caused.has(e.cause)) caused.set(e.cause, []);
  caused.get(e.cause).push(e);
}

/* ═══ PREDYKCJE ═══ */
function predictions() {
  const reg = events.filter(e => e.kind === 'prediction.registered');
  const res = events.filter(e => e.kind === 'prediction.resolved' || e.kind === 'prediction.voided');
  const done = new Map(res.map(e => [e.prediction_id, e]));
  const now = new Date();

  console.log('\n═══ PREDYKCJE ═══\n');
  const open = [], closed = [];
  for (const r of reg) (done.has(r.prediction_id) ? closed : open).push(r);

  for (const r of open.sort((a, b) => String(a.deadline).localeCompare(String(b.deadline)))) {
    const d = new Date(r.deadline);
    const days = Math.round((d - now) / 86400000);
    const late = days < 0;
    console.log(`  ${late ? '‼' : '·'} ${r.prediction_id}  p=${r.p}  ${late ? `${-days} DNI PO TERMINIE` : `za ${days} dni`}`);
    console.log(`      ${short(r.claim)}`);
    if (late) console.log(`      → rozlicz: HIT / MISS / VOID · źródło: ${short(r.measurement_source) || 'nie podano'}`);
  }
  if (!open.length) console.log('  brak otwartych');

  const real = closed.filter(r => { const e = done.get(r.prediction_id); return e && e.result && e.result !== 'void'; });
  console.log(`\n  zarejestrowane ${reg.length} · zamknięte ${closed.length} · z tego skonfrontowane z rzeczywistością: ${real.length}`);
  if (!real.length) console.log('  ⚠ ani jedna predykcja nie została jeszcze rozstrzygnięta jako HIT albo MISS —');
  console.log('    unieważnienie (void) nie jest testem, tylko wycofaniem zakładu.');
}

/* ═══ ŁAŃCUCHY ═══
 * UWAGA METODOLOGICZNA. Pierwsza wersja tego skryptu liczyla wylacznie zdarzenia z polem
 * `cause` wskazujacym na analize — i wyszlo 38 urwanych lancuchow z 38. To byl blad pomiaru,
 * nie odkrycie: ZERO zdarzen w calym Ledgerze uzywa backtestu jako `cause`. Absorpcja idzie
 * innym kanalem — wpis Evidence w karcie ma `source` wskazujacy na backtest (134 wpisy,
 * 34 rozne analizy). Dlatego mierzymy DWA kanaly osobno, bo znacza co innego:
 *
 *   DOWÓD    — Evidence z tej analizy trafil do karty. Karta wie, ze cos sie wydarzylo.
 *   ZMIANA   — karta zmienila trigger, anti_context albo confidence z powodu tej analizy.
 *              To jest to, co realnie zmienia przyszla rekomendacje Routera.
 *
 * Trzecia kolumna to propozycje zapisane w backtescie jako proza ("Zmiana: ..."). Ich NIE DA
 * SIE zweryfikowac maszynowo — nie sa polem, tylko zdaniem. To jest wlasciwa dziura
 * strukturalna: system produkuje propozycje w formacie, ktorego sam nie potrafi odczytac. */
const evidenceBySource = new Map();
for (const dir of ['mechanisms', 'workflows']) {
  const d = path.join(G, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(d, f), 'utf8');
    const idm = raw.match(/^id: "(.*)"$/m); if (!idm) continue;
    for (const m of raw.matchAll(/"source":"(rec:(?:backtests|postmortems)\/[^"]+)"/g)) {
      if (!evidenceBySource.has(m[1])) evidenceBySource.set(m[1], new Set());
      evidenceBySource.get(m[1]).add(idm[1]);
    }
  }
}
/* propozycje zapisane proza w tresci analizy */
function proposalsIn(file) {
  try {
    const raw = fs.readFileSync(path.join(G, file), 'utf8');
    return (raw.match(/\|\s*Zmiana:/g) || []).length + (raw.match(/^\s*[-*]\s*\*\*Zmiana/gm) || []).length;
  } catch { return 0; }
}

function chains() {
  console.log('\n═══ PĘTLA UCZENIA: analiza → dowód w karcie → zmiana karty ═══');
  let withEvidence = 0, withChange = 0, dead = 0, proposalsTotal = 0;

  for (const [proj, list] of [...byProject.entries()].sort()) {
    const blocks = list.map(a => {
      const evs = caused.get(a.id) || [];
      const changed = evs.filter(e => /^(knowledge\.|confidence\.|object\.patched)/.test(e.kind));
      const cardsWithEvidence = [...(evidenceBySource.get(a.id) || [])];
      return { a, changed, cardsWithEvidence, proposals: proposalsIn(a.file) };
    });
    const anyGap = blocks.some(b => !b.changed.length);
    if (ONLY_GAPS && !anyGap) continue;

    console.log(`\n▸ ${title(proj)}`);
    for (const b of blocks) {
      proposalsTotal += b.proposals;
      const dowod = b.cardsWithEvidence.length;
      const zmiana = b.changed.length;
      if (dowod) withEvidence++; if (zmiana) withChange++; if (!dowod && !zmiana) dead++;

      const mark = zmiana ? '✓' : dowod ? '◐' : '✕';
      console.log(`  ${mark} ${b.a.file}`);
      console.log(`      dowód w kartach: ${dowod ? b.cardsWithEvidence.map(x => x.replace('mech:', '')).join(', ') : 'brak'}`);
      console.log(`      zmiana karty:    ${zmiana ? b.changed.map(e => `${e.kind} → ${title(e.on)} (${e.actor})`).join('; ') : 'BRAK'}`);
      if (b.proposals) console.log(`      propozycje w prozie: ${b.proposals} — niemożliwe do zweryfikowania maszynowo`);
    }
  }

  console.log(`\n  analiz: ${analyses.length}`);
  console.log(`  z dowodem w kartach:  ${withEvidence}   (Evidence dotarlo — karta wie, ze cos sie wydarzylo)`);
  console.log(`  ze zmiana karty:      ${withChange}   (trigger/anti_context/confidence zmienione z tego powodu)`);
  console.log(`  bez jednego i drugiego: ${dead}`);
  console.log(`  propozycji zapisanych proza: ${proposalsTotal} — system nie potrafi ich odczytac ani policzyc jako otwarte`);
  if (withChange < withEvidence) console.log(
    '\n  Wniosek: dowody wracaja, decyzje nie. Karta dostaje Evidence, ale trigger i anti_context\n' +
    '  zostaja te same — a to one steruja Routerem przy nastepnym projekcie.');
}

console.log(`Genome: ${G}`);
console.log(`Ledger: ${events.length} zdarzeń · analiz (backtest/postmortem): ${analyses.length}`);
if (!ONLY_PREDS) chains();
if (!ONLY_GAPS) predictions();
console.log('');
