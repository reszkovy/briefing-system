#!/usr/bin/env node
/* ═══ GENOME INGEST — jedyna droga zapisu do Genome (rule:zero-manual-admin) ═══
 * AI/sesja produkuje JSON → ingest waliduje, nadaje ID, liczy hash-chain, aktualizuje liczniki,
 * pilnuje dedupe per projekt → build --check. Zero ręcznego YAML/JSONL/frontmatter.
 *
 * Użycie:
 *   node ingest.js plik.json            zapis (po walidacji + build --check)
 *   node ingest.js plik.json --dry-run  plan zmian bez zapisu
 *   cat x.json | node ingest.js -       ze stdin
 *
 * Format wejścia (wszystkie klucze opcjonalne):
 * {
 *   "events":   [{ "kind":"evidence.observed", "on":"mech:x", "note":"...", "actor":"session" , ...}],
 *   "evidence": [{ "mechanism":"mech:x", "project":"proj:y", "type":"postmortem",
 *                  "observation":"...", "proof":"...", "impact":"...", "proposed_change":"..." }],
 *   "objects":  [{ "type":"mechanism", "id":"mech:x", "title":"...", "body":"...", ...frontmatter }]
 * }
 * Zasady wymuszane maszynowo (nie przez dyscyplinę człowieka):
 *  - prev_hash liczony automatycznie (łańcuch nigdy nie pęka),
 *  - id eventów nadawane sekwencyjnie z datą,
 *  - evidence: dedupe per (karta × projekt) — niezmiennik 10 (no confidence double-counting),
 *  - liczniki evidence_strength przeliczane, nigdy wpisywane ręcznie,
 *  - confidence.value NIE jest zmieniane przez ingest — wyłącznie przez jawny event confidence.changed,
 *  - rollback: jeśli build --check zwróci błąd, wszystkie zmiany są cofane.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const G = __dirname;
const LEDGER_DIR = path.join(G, 'ledger');
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const src = args.find(a => a !== '--dry-run');
if (!src) { console.error('użycie: node ingest.js <plik.json|-> [--dry-run]'); process.exit(2); }

const raw = src === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(src, 'utf8');
let input;
try { input = JSON.parse(raw); } catch (e) { console.error('✗ wejście nie jest poprawnym JSON:', e.message); process.exit(2); }

const EVENT_KINDS = /^(project|decision|prediction|evidence|experiment|guard|recommendation|object|signal)\.[a-z_]+$|^confidence\.changed$|^knowledge\.(corrected|reclassified)$|^ontology\.changed$/;
const EVIDENCE_TYPES = ['measurement', 'postmortem', 'narracja'];
const TYPE_DIR = { mechanism: 'mechanisms', principle: 'principles', axiom: 'axioms', project: 'projects', decision: 'decisions', experiment: 'experiments', record: 'records', rule: 'rules', guard: 'guards', benchmark: 'benchmarks', capability: 'capabilities', agent: 'agents', component: 'components', client: 'clients', signal: 'signals', sop: 'sops', workflow: 'workflows', recommendation: 'recommendations' };

const errors = [];
const plan = [];          // [{file, before|null, after}]
const backups = new Map();

/* ── helpers ── */
const today = () => new Date().toISOString().slice(0, 10);
const ledgerFile = () => path.join(LEDGER_DIR, `events-${today().slice(0, 7)}.jsonl`);

function readLedger() {
  const f = ledgerFile();
  if (!fs.existsSync(f)) return { file: f, lines: [] };
  return { file: f, lines: fs.readFileSync(f, 'utf8').split('\n').filter(l => l.trim()) };
}
function hash16(s) { return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16); }

function findCard(id) {
  const type = id.split(':')[0];
  const map = { mech: 'mechanisms', prin: 'principles', ax: 'axioms', proj: 'projects', dec: 'decisions', exp: 'experiments', rec: 'records', rule: 'rules', guard: 'guards', bench: 'benchmarks', cap: 'capabilities', agent: 'agents', comp: 'components', cli: 'clients', sig: 'signals' };
  const dir = path.join(G, map[type] || '');
  if (!fs.existsSync(dir)) return null;
  const walk = d => fs.readdirSync(d).flatMap(f => {
    const p = path.join(d, f);
    return fs.statSync(p).isDirectory() ? walk(p) : [p];
  });
  for (const p of walk(dir)) {
    if (!p.endsWith('.md')) continue;
    const s = fs.readFileSync(p, 'utf8');
    if (new RegExp(`^id: "${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"$`, 'm').test(s)) return p;
  }
  return null;
}

/* ── 1. EVIDENCE → karty (z dedupe i przeliczeniem liczników) ── */
const evidenceEvents = [];
for (const ev of (input.evidence || [])) {
  const target = ev.mechanism || ev.on;
  if (!target) { errors.push('evidence bez pola mechanism/on'); continue; }
  const type = ev.type || 'postmortem';
  if (!EVIDENCE_TYPES.includes(type)) { errors.push(`evidence: typ "${type}" spoza słownika ${EVIDENCE_TYPES}`); continue; }
  if (!ev.proof) { errors.push(`evidence dla ${target}: brak pola proof (niezmiennik 8: no evidence without provenance)`); continue; }
  const file = findCard(target);
  if (!file) { errors.push(`evidence: karta ${target} nie istnieje`); continue; }

  // stan roboczy: wersja z planu jeśli karta była już w tym przebiegu zmieniana, inaczej z dysku.
  // (backups może istnieć bez wpisu w planie — np. gdy poprzednie evidence dla tej karty odpadło na dedupe)
  const pending = plan.find(p => p.file === file);
  let s = pending ? pending.after : fs.readFileSync(file, 'utf8');
  if (!backups.has(file)) backups.set(file, fs.readFileSync(file, 'utf8'));

  const mEv = /^evidence: (\[.*\])$/m.exec(s);
  const mConf = /^confidence: (\{.*\})$/m.exec(s);
  if (!mEv || !mConf) { errors.push(`karta ${target}: brak pól evidence/confidence`); continue; }
  const entries = JSON.parse(mEv[1]);
  const conf = JSON.parse(mConf[1]);

  const projectKey = (ev.project || ev.source || '').replace(/^proj:/, '').replace(/^rec:backtests\//, '');
  if (projectKey && JSON.stringify(entries).includes(projectKey)) {
    console.log(`  ~ dedupe: ${target} zna już projekt ${projectKey} — pomijam (niezmiennik 10)`);
    continue;
  }
  const slug = target.split(':')[1];
  const note = ev.note || [ev.observation, ev.proposed_change && ('Zmiana: ' + ev.proposed_change)].filter(Boolean).join(' | ');
  entries.push({ id: `ev:${slug}-${projectKey || entries.length + 1}`, type, date: ev.date || today(), source: ev.source || (ev.project || 'session'), note: `${note} [dowód: ${ev.proof}]` });

  // liczniki: LICZONE, nigdy wpisywane
  const types = { measurement: 0, postmortem: 0, narracja: 0 };
  for (const e of entries) types[e.type] = (types[e.type] || 0) + 1;
  conf.evidence_strength = {
    n: entries.length,
    projects: new Set(entries.map(e => String(e.source))).size,
    types,
    last_confirmed: today()
  };
  s = s.replace(/^evidence: \[.*\]$/m, 'evidence: ' + JSON.stringify(entries));
  s = s.replace(/^confidence: \{.*\}$/m, 'confidence: ' + JSON.stringify(conf));
  s = s.replace(/^updated: ".*"$/m, `updated: "${today()}"`);

  const existing = plan.find(p => p.file === file);
  if (existing) existing.after = s; else plan.push({ file, after: s });
  evidenceEvents.push({ kind: 'evidence.observed', on: target, actor: ev.actor || 'session:ingest', provenance: ev.source || ev.project || 'session', note: (note || '').slice(0, 400) });
}

/* ── 2. OBJECTS → nowe/zmienione karty ── */
for (const o of (input.objects || [])) {
  if (!o.id || !o.type) { errors.push('object bez id/type'); continue; }
  const dir = TYPE_DIR[o.type];
  if (!dir) { errors.push(`object ${o.id}: nieznany typ ${o.type}`); continue; }
  const body = o.body || '';
  const fm = { ...o }; delete fm.body;
  fm.created = fm.created || today();
  fm.updated = today();
  fm.version = fm.version || 1;
  fm.owner = fm.owner || 'przemek';
  fm.relations = fm.relations || {};
  fm.tags = fm.tags || [];
  const order = ['id', 'type', 'title', 'status', 'created', 'updated', 'version', 'owner'];
  const keys = [...order.filter(k => k in fm), ...Object.keys(fm).filter(k => !order.includes(k))];
  const text = '---\n' + keys.map(k => `${k}: ${JSON.stringify(fm[k])}`).join('\n') + '\n---\n\n' + body.trim() + '\n';
  const file = findCard(o.id) || path.join(G, dir, o.id.split(':')[1].replace(/\//g, '-') + '.md');
  if (!backups.has(file)) backups.set(file, fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
  const existing = plan.find(p => p.file === file);
  if (existing) existing.after = text; else plan.push({ file, after: text });
  evidenceEvents.push({ kind: fs.existsSync(file) ? 'object.updated' : 'object.created', on: o.id, actor: 'session:ingest', provenance: 'record', note: o.ingest_note || `Obiekt ${fs.existsSync(file) ? 'zaktualizowany' : 'utworzony'} przez ingest.` });
}

/* ── 3. EVENTS → Ledger (hash-chain liczony maszynowo) ── */
const allEvents = [...(input.events || []), ...evidenceEvents];
const led = readLedger();
let prev = led.lines.length ? hash16(led.lines[led.lines.length - 1]) : null;
let seq = 1;
for (const l of led.lines) {
  const m = /"id": "evt:(\d{4}-\d{2}-\d{2})-(\d{4})"/.exec(l);
  if (m && m[1] === today()) seq = Math.max(seq, parseInt(m[2], 10) + 1);
}
const newLines = [];
for (const e of allEvents) {
  if (!e.kind || !EVENT_KINDS.test(e.kind)) { errors.push(`event: kind "${e.kind}" spoza słownika`); continue; }
  if (!e.on) { errors.push(`event ${e.kind}: brak pola on`); continue; }
  // niezmiennik: zdarzenie musi wskazywać istniejący obiekt (albo tworzony w tym samym ingeście)
  const willExist = (input.objects || []).some(o => o.id === e.on) || plan.some(p => new RegExp(`^id: "${e.on.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"$`, 'm').test(p.after));
  if (!willExist && !findCard(e.on)) { errors.push(`event ${e.kind}: obiekt ${e.on} nie istnieje`); continue; }
  const rec = {
    id: `evt:${today()}-${String(seq++).padStart(4, '0')}`,
    ts: new Date().toISOString().replace('Z', '+00:00'),
    kind: e.kind, on: e.on,
    actor: e.actor || 'session:ingest',
    ...(e.cause ? { cause: e.cause } : {}),
    provenance: e.provenance || 'record',
    ...(e.prediction_id ? { prediction_id: e.prediction_id, p: e.p, claim: e.claim, deadline: e.deadline, criterion: e.criterion } : {}),
    note: e.note || '',
    prev_hash: prev
  };
  const line = JSON.stringify(rec);
  newLines.push(line);
  prev = hash16(line);
}

/* ── RAPORT + ZAPIS ── */
console.log(`\n═══ INGEST ${DRY ? '(dry-run)' : ''} ═══`);
console.log(`karty do zmiany: ${plan.length}`);
for (const p of plan) console.log(`  • ${path.relative(G, p.file)}${backups.get(p.file) === null ? '  [NOWA]' : ''}`);
console.log(`zdarzenia do dopisania: ${newLines.length}`);
for (const l of newLines) { const e = JSON.parse(l); console.log(`  • ${e.id} ${e.kind} → ${e.on}`); }
if (errors.length) {
  console.error(`\n✗ ${errors.length} błędów walidacji — NIC nie zapisano:`);
  errors.forEach(e => console.error('  ✗ ' + e));
  process.exit(1);
}
if (DRY) { console.log('\n(dry-run — brak zapisu)'); process.exit(0); }
if (!plan.length && !newLines.length) { console.log('\nBrak zmian.'); process.exit(0); }

for (const p of plan) fs.writeFileSync(p.file, p.after);
if (newLines.length) fs.appendFileSync(led.file, newLines.join('\n') + '\n');

/* ── build --check z rollbackiem ── */
try {
  execFileSync('node', [path.join(G, 'build.js'), '--check'], { stdio: 'pipe' });
} catch (e) {
  console.error('\n✗ build --check ODRZUCIŁ zmiany — ROLLBACK:\n' + (e.stdout || '').toString());
  for (const [file, before] of backups) { if (before === null) fs.unlinkSync(file); else fs.writeFileSync(file, before); }
  if (newLines.length) fs.writeFileSync(led.file, led.lines.join('\n') + '\n');
  process.exit(1);
}
execFileSync('node', [path.join(G, 'build.js')], { stdio: 'inherit' });
console.log('✓ ingest zakończony — Genome i widoki zaktualizowane.');
