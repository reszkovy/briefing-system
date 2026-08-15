#!/usr/bin/env node
/* Genome build.js — deterministyczny kompilator (F0, Część D spec).
   Zero AI. Zero sieci. Zero logiki biznesowej. Identyczne wejście → identyczne wyjście.
   Tryby: node build.js            (walidacja + emit dist/)
          node build.js --check    (tylko walidacja; exit 1 przy błędach)
          node build.js --find "fraza"  (wyszukiwarka pełnotekstowa po całym Genome) */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const G = __dirname;
const TYPES = {
  axiom:      { dir: 'axioms',      prefix: 'ax',    statuses: ['draft','accepted','deprecated'] },
  principle:  { dir: 'principles',  prefix: 'prin',  statuses: ['draft','active','deprecated'] },
  mechanism:  { dir: 'mechanisms',  prefix: 'mech',  statuses: ['hypothesis','emerging','validated','disproven','deprecated'] },
  workflow:   { dir: 'workflows',   prefix: 'wf',    statuses: ['draft','active','deprecated'] },
  sop:        { dir: 'sops',        prefix: 'sop',   statuses: ['draft','active','superseded'] },
  rule:       { dir: 'rules',       prefix: 'rule',  statuses: ['active','retired'] },
  guard:      { dir: 'guards',      prefix: 'guard', statuses: ['proposed','armed','retired'] },
  benchmark:  { dir: 'benchmarks',  prefix: 'bench', statuses: ['draft','calibrated','active','deprecated'] },
  capability: { dir: 'capabilities',prefix: 'cap',   statuses: ['available','degraded','retired'] },
  agent:      { dir: 'agents',      prefix: 'agent', statuses: ['defined','active','retired'] },
  component:  { dir: 'components',  prefix: 'comp',  statuses: ['proposed','extracted','active','superseded'] },
  client:     { dir: 'clients',     prefix: 'cli',   statuses: ['prospect','active','dormant','archived'] },
  project:    { dir: 'projects',    prefix: 'proj',  statuses: ['proposed','routed','active','closed','archived'] },
  experiment: { dir: 'experiments', prefix: 'exp',   statuses: ['proposed','running','resolved','folded'] },
  decision:   { dir: 'decisions',   prefix: 'dec',   statuses: ['open','decided','reviewed'] },
  signal:     { dir: 'signals',     prefix: 'sig',   statuses: ['observed','investigated','linked','dismissed'] },
  record:     { dir: 'records',     prefix: 'rec',   statuses: ['created','superseded'] },
};
const RELATION_KEYS = ['derives','implements','related','tests','uses','enforces','for','attached_to','supersedes','born_from','used_by'];
const REQUIRED = ['id','type','title','status','created','updated','version','owner'];
const EVENT_KINDS = /^(project|decision|prediction|evidence|experiment|guard|recommendation|object|signal)\.[a-z_]+$|^confidence\.changed$|^knowledge\.(corrected|reclassified)$|^ontology\.changed$/;

const errors = [], warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

/* ── frontmatter parser: klucz: wartość-JSON (spec B.2 — każda wartość to poprawny JSON/skalar) ── */
function parseFrontmatter(raw, file) {
  if (!raw.startsWith('---\n')) { err(file, 'brak frontmatter'); return [null, raw]; }
  const end = raw.indexOf('\n---', 4);
  if (end < 0) { err(file, 'niedomknięty frontmatter'); return [null, raw]; }
  const block = raw.slice(4, end);
  const body = raw.slice(end + 4);
  const fm = {};
  for (const line of block.split('\n')) {
    if (!line.trim()) continue;
    const i = line.indexOf(': ');
    if (i < 0) { err(file, `frontmatter: zła linia "${line.slice(0, 40)}"`); continue; }
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 2).trim();
    try { fm[key] = JSON.parse(val); }
    catch { fm[key] = val; }
  }
  return [fm, body];
}

/* ── READ ── */
const objects = new Map(); // id -> {fm, body, file}
function readDir(dir, expectType) {
  const full = path.join(G, dir);
  if (!fs.existsSync(full)) return;
  for (const f of fs.readdirSync(full).sort()) {
    const p = path.join(full, f);
    if (fs.statSync(p).isDirectory()) { readDir(path.join(dir, f), expectType); continue; }
    if (!f.endsWith('.md') || f === 'INDEX.md') continue;
    const rel = path.join(dir, f);
    const [fm, body] = parseFrontmatter(fs.readFileSync(p, 'utf8'), rel);
    if (!fm) continue;
    if (!fm.id) { err(rel, 'brak id'); continue; }
    if (objects.has(fm.id)) err(rel, `duplikat id ${fm.id}`);
    objects.set(fm.id, { fm, body, file: rel });
  }
}
for (const t of Object.values(TYPES)) readDir(t.dir, t);

/* ── LEDGER read + hash chain ── */
const events = [];
const ledgerDir = path.join(G, 'ledger');
if (fs.existsSync(ledgerDir)) {
  for (const f of fs.readdirSync(ledgerDir).sort()) {
    if (!f.endsWith('.jsonl')) continue;
    let prev = 'genesis';
    const lines = fs.readFileSync(path.join(ledgerDir, f), 'utf8').split('\n').filter(Boolean);
    lines.forEach((line, i) => {
      let e;
      try { e = JSON.parse(line); } catch { err(`ledger/${f}:${i + 1}`, 'niepoprawny JSON'); return; }
      if (e.prev_hash !== prev) err(`ledger/${f}:${i + 1}`, `zerwany hash-łańcuch (oczekiwano ${prev}, jest ${e.prev_hash}) — możliwa edycja historii`);
      prev = crypto.createHash('sha256').update(line).digest('hex').slice(0, 16);
      if (!EVENT_KINDS.test(e.kind)) err(`ledger/${f}:${i + 1}`, `kind spoza słownika: ${e.kind}`);
      if (!e.ts || !e.id || !e.on) err(`ledger/${f}:${i + 1}`, 'brak ts/id/on');
      events.push(e);
    });
  }
}

/* ── VALIDATE objects ── */
const evidenceIds = new Map(); // globalna unikalność Evidence ID (invariant 10)
for (const [id, o] of objects) {
  const { fm, file } = o;
  for (const k of REQUIRED) if (fm[k] === undefined) err(file, `brak pola ${k}`);
  const tdef = TYPES[fm.type];
  if (!tdef) { err(file, `nieznany typ ${fm.type}`); continue; }
  if (!id.startsWith(tdef.prefix + ':')) err(file, `id ${id} nie pasuje do prefiksu ${tdef.prefix}:`);
  if (!tdef.statuses.includes(fm.status)) err(file, `status "${fm.status}" spoza słownika typu ${fm.type}`);
  const rels = fm.relations || {};
  for (const [rk, targets] of Object.entries(rels)) {
    if (!RELATION_KEYS.includes(rk)) err(file, `relacja spoza słownika: ${rk}`);
    for (const t of [].concat(targets)) {
      if (!objects.has(t)) err(file, `relacja ${rk} → nieistniejący obiekt ${t}`);
    }
  }
  if (fm.type === 'mechanism') {
    if (!rels.implements || rels.implements.length !== 1) err(file, 'mechanizm musi wskazywać dokładnie 1 principle (invariant 1)');
    const c = fm.confidence || {};
    if (c.value !== fm.status) err(file, `confidence.value (${c.value}) ≠ status (${fm.status})`);
    const ev = fm.evidence || [];
    const strength = (c.evidence_strength || {});
    if ((strength.n || 0) !== ev.length) err(file, `evidence_strength.n=${strength.n} ≠ liczba wpisów evidence=${ev.length} (liczniki są liczone)`);
    for (const e of ev) {
      if (!e.id || !e.type || !e.date || !e.source) err(file, `evidence bez pełnej prowieniencji: ${JSON.stringify(e).slice(0, 60)}`);
      if (e.source === 'analysis') err(file, 'evidence source:"analysis" jest NIELEGALNE (invariant 8)');
      if (e.source && e.source.startsWith('rec:') && !objects.has(e.source)) warn(file, `evidence source ${e.source} nie istnieje jako Record`);
      if (evidenceIds.has(e.id) && evidenceIds.get(e.id) !== id) err(file, `Evidence ID ${e.id} użyty w ≥2 mechanizmach (invariant 10: no double-counting)`);
      evidenceIds.set(e.id, id);
      if (!['measurement','postmortem','narracja'].includes(e.type)) err(file, `evidence.type spoza słownika: ${e.type}`);
    }
    if (fm.status === 'validated') {
      const projects = new Set(ev.map(e => e.project || e.note));
      const strong = ev.filter(e => e.type === 'measurement' || e.type === 'postmortem').length;
      if (ev.length < 3 || projects.size < 2 || strong < 1)
        err(file, `validated bez pokrycia (invariant 2): n=${ev.length}, projekty=${projects.size}, measurement/postmortem=${strong}`);
    }
  }
  if (fm.type === 'project') {
    if (fm.status === 'active' && !(rels.attached_to || fm.routing)) err(file, 'project active bez raportu routera (invariant 4)');
    if (fm.status === 'closed' && !fm.postmortem) err(file, 'project closed bez postmortem (invariant 4)');
  }
}

/* confidence ↔ ledger (invariant 3): ostatni confidence.changed musi zgadzać się ze stanem karty */
const lastConf = new Map();
for (const e of events) if (e.kind === 'confidence.changed') lastConf.set(e.on, e.to);
for (const [onId, to] of lastConf) {
  const o = objects.get(onId);
  if (!o) { warn('ledger', `confidence.changed dla nieistniejącego ${onId}`); continue; }
  if (o.fm.status !== to) err(o.file, `status ${o.fm.status} ≠ ostatni event confidence.changed→${to} (invariant 3)`);
}

/* ── modes ── */
const args = process.argv.slice(2);
if (args[0] === '--find') {
  const q = (args[1] || '').toLowerCase();
  if (!q) { console.log('użycie: node build.js --find "fraza"'); process.exit(1); }
  let hits = 0;
  for (const [id, o] of objects) {
    const hay = (JSON.stringify(o.fm) + o.body).toLowerCase();
    if (hay.includes(q)) {
      hits++;
      const line = o.body.split('\n').find(l => l.toLowerCase().includes(q));
      console.log(`${id}  [${o.fm.type}/${o.fm.status}]  ${o.fm.title}`);
      if (line) console.log(`    …${line.trim().slice(0, 110)}…`);
    }
  }
  for (const e of events) {
    if (JSON.stringify(e).toLowerCase().includes(q)) { hits++; console.log(`${e.id}  [event/${e.kind}]  ${e.note || ''}`.slice(0, 130)); }
  }
  console.log(`\n${hits} trafień dla "${args[1]}"`);
  process.exit(0);
}

const report = () => {
  for (const w of warnings) console.log('⚠ ' + w);
  for (const e of errors) console.log('✗ ' + e);
  console.log(`\n${objects.size} obiektów · ${events.length} zdarzeń · ${errors.length} błędów · ${warnings.length} ostrzeżeń`);
};
if (args[0] === '--check') { report(); process.exit(errors.length ? 1 : 0); }
if (errors.length) { report(); process.exit(1); }

/* ── EMIT (deterministyczny; "data stanu" = ts ostatniego eventu) ── */
const stateTs = events.length ? events[events.length - 1].ts : 'brak-zdarzeń';
const byType = {};
for (const [, o] of objects) (byType[o.fm.type] = byType[o.fm.type] || []).push(o.fm);
for (const k of Object.keys(byType)) byType[k].sort((a, b) => a.id.localeCompare(b.id));

let idx = `# Genome INDEX (GENEROWANY — nie edytować)\n\nStan: ${stateTs} · obiektów: ${objects.size} · zdarzeń: ${events.length}\n\n`;
for (const [t, list] of Object.entries(byType).sort()) {
  const counts = {};
  for (const f of list) counts[f.status] = (counts[f.status] || 0) + 1;
  idx += `## ${t} (${list.length}) — ${Object.entries(counts).sort().map(([s, n]) => `${s}: ${n}`).join(' · ')}\n\n`;
  for (const f of list) idx += `- \`${f.id}\` ${f.title} [${f.status}]\n`;
  idx += '\n';
}
fs.mkdirSync(path.join(G, 'dist'), { recursive: true });
fs.writeFileSync(path.join(G, 'dist/INDEX.md'), idx);

const nodes = [], edges = [];
for (const [id, o] of objects) {
  nodes.push({ id, label: o.fm.title, type: o.fm.type, status: o.fm.status });
  for (const [rk, targets] of Object.entries(o.fm.relations || {}))
    for (const t of [].concat(targets)) if (objects.has(t)) edges.push({ source: id, target: t, relation: rk });
}
fs.writeFileSync(path.join(G, 'dist/graph.json'), JSON.stringify({ state: stateTs, nodes, edges }, null, 1));

/* body kart wchodzi do danych — UI renderuje kanoniczną treść, nie kopię */
const data = { state: stateTs, counts: Object.fromEntries(Object.entries(byType).map(([t, l]) => [t, l.length])), objects: Object.fromEntries([...objects].map(([id, o]) => [id, { ...o.fm, body: (o.body || '').trim() }])), events_count: events.length };

/* predykcje: zarejestrowane minus rozstrzygnięte/unieważnione (wyłącznie z Ledgera) */
const resolved = new Set(events.filter(e => /^prediction\.(resolved|voided)$/.test(e.kind)).map(e => e.prediction_id));
data.predictions = events.filter(e => e.kind === 'prediction.registered' && !resolved.has(e.prediction_id))
  .map(e => ({ id: e.prediction_id, on: e.on, p: e.p, claim: e.claim, deadline: e.deadline, criterion: e.criterion, registered: e.ts }));

/* ostatnie zdarzenia — surowy stan pętli uczenia dla UI */
data.recent_events = events.slice(-30).reverse().map(e => ({ ts: e.ts, kind: e.kind, on: e.on, note: String(e.note || '').slice(0, 240) }));
fs.writeFileSync(path.join(G, 'dist/genome-data.js'), '// GENEROWANE przez build.js — nie edytować\nwindow.GENOME_DATA = ' + JSON.stringify(data) + ';\n');

/* ── METRICS (tablica 4 wskaźników — dec:2026-08-08-plan-90-dni; wyłącznie liczone) ── */
const trialsClosed = events.filter(e => e.kind === 'project.closed' && String(e.note || '').toLowerCase().includes('trial')).length;
/* UCZCIWOŚĆ (rule: reality over narrative): retro-backtest ≠ żywy dowód.
   Zweryfikowane LIVE = evidence measurement/postmortem NIE pochodzące z rec:backtests/. */
const isBacktest = ev2 => String(ev2.source || '').startsWith('rec:backtests/');
const mechVerified = [...objects.values()].filter(o => o.fm.type === 'mechanism' &&
  (o.fm.evidence || []).some(ev2 => (ev2.type === 'measurement' || ev2.type === 'postmortem') && !isBacktest(ev2))).length;
const mechBacktested = [...objects.values()].filter(o => o.fm.type === 'mechanism' &&
  (o.fm.evidence || []).some(ev2 => isBacktest(ev2))).length;
const routedTs = {}, decidedTs = {};
for (const e of events) {
  if (e.kind === 'project.routed') routedTs[e.on] = e.ts;
  if (e.kind === 'decision.decided' && e.on && e.project) decidedTs[e.project] = e.ts;
}
const iterEvents = events.filter(e => e.kind === 'project.iteration').length; // pomiar od Trial #001
let metricsMd = `# Genome — tablica 4 wskaźników (GENEROWANE)\n\nStan: ${stateTs} · źródło: Ledger (${events.length} zdarzeń). Definicje: dec:2026-08-08-plan-90-dni.\n\n`;
metricsMd += `| Wskaźnik | Wartość | Cel |\n|---|---|---|\n`;
metricsMd += `| Triale zakończone | **${trialsClosed}** / 3 | 3 |\n`;
metricsMd += `| Mechanizmy zweryfikowane ŻYWYM dowodem (measurement/postmortem spoza backtestów) | **${mechVerified}** / ${(byType.mechanism||[]).length} | rośnie |\n`;
metricsMd += `| Mechanizmy dotknięte retro-backtestem (nie liczy się jako żywy dowód) | ${mechBacktested} / ${(byType.mechanism||[]).length} | kontekst |\n`;
metricsMd += `| Śr. iteracji na projekt | **n/d** (pomiar od Trial #001: eventy project.iteration) | maleje |\n`;
metricsMd += `| Czas brief→decyzja | **n/d** (pomiar: ts routed → ts decyzji klienta per trial) | maleje |\n`;
metricsMd += `\nUczciwość: n/d znaczy n/d — wartości pojawią się wyłącznie z realnych zdarzeń, nigdy z ręki.\n`;
fs.writeFileSync(path.join(G, 'dist/METRICS.md'), metricsMd);
data.metrics = { trials_closed: trialsClosed, trials_target: 3, mech_verified: mechVerified, mech_backtested: mechBacktested, mech_total: (byType.mechanism||[]).length, iterations_avg: null, brief_to_decision: null };
const genomeDataJs = '// GENEROWANE przez build.js — nie edytować\nwindow.GENOME_DATA = ' + JSON.stringify(data) + ';\n';
fs.writeFileSync(path.join(G, 'dist/genome-data.js'), genomeDataJs);

/* ── auto-sync viewera: każdy build nadpisuje dane Genome OS (żadnego ręcznego kopiowania) ── */
const viewerData = path.join(G, '..', '..', 'genome-os', 'js', 'genome-f0-data.js');
if (fs.existsSync(path.dirname(viewerData))) fs.writeFileSync(viewerData, genomeDataJs);

report();
console.log('✓ dist/INDEX.md · dist/graph.json · dist/genome-data.js · dist/METRICS.md · genome-os/js/genome-f0-data.js');
