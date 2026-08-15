#!/usr/bin/env node
/* ═══ GENOME INGEST v2 — deterministyczny writer (jedyna droga zapisu do Genome) ═══
 * Kontrakt: ANALYZE → PROPOSE → HUMAN APPROVAL → DETERMINISTIC INGEST → BUILD → AUDIT
 * Learning Engine NIE zapisuje. Ten plik zapisuje wyłącznie zatwierdzone pakiety.
 *
 *   node ingest.js pakiet.json --dry-run   plan zmian, zero zapisu, approval NIEwymagany
 *   node ingest.js pakiet.json             zapis; wymaga poprawnego bloku approval
 *
 * Pakiet:
 * {
 *   "approval": { "status":"approved", "approved_by":"...", "approved_at":"ISO8601",
 *                 "proposal_hash":"sha256 kanonicznego {events,evidence,objects}" },
 *   "events":   [ { "kind":"...", "on":"...", ...payload wg EVENT_SCHEMA } ],
 *   "evidence": [ { "mechanism","project","type","source","observation","direction", ... } ],
 *   "objects":  [ { "op":"object.create|object.patch|object.replace", "id", ... } ]
 * }
 *
 * Gwarancje: bramka approval · blokada współbieżności · zapis atomowy (tmp+rename) ·
 * rollback bajtowy przy każdym błędzie · pełny payload zdarzeń · ID/hash liczone maszynowo ·
 * dedupe strukturalna Evidence · Ledger tylko append (zakaz edycji historii).
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const G = process.env.GENOME_DIR || __dirname;
const TZ = process.env.GENOME_TZ || 'Europe/Madrid';
const LEDGER_DIR = path.join(G, 'ledger');
const { withGenomeWriteLock } = require('./lib/genome-common.js');
const RC = require('./lib/research-contract.js');
const APPROVAL = require('./lib/approval.js');
const EW = require('./lib/evidence-writer.js');
/* Rejestr zużytych nonce — POZA katalogiem ledger/, bo build.js czyta stamtąd każdy .jsonl
   jako strumień zdarzeń. To rejestr approval, nie Ledger. */
const NONCE_REGISTRY = path.join(G, '.approval-nonces.jsonl');

/* ── ZAMKNIĘTY słownik zdarzeń + wymagany payload ── */
const EVENT_SCHEMA = {
  'prediction.registered':    ['prediction_id', 'p', 'claim', 'deadline', 'criterion', 'measurement_source', 'resolution_owner'],
  'prediction.resolved':      ['prediction_id', 'result', 'cause', 'resolution_source'],
  'prediction.voided':        ['prediction_id', 'cause'],
  'confidence.changed':       ['from', 'to', 'cause', 'supporting_evidence'],
  'evidence.added':           ['evidence_id', 'project', 'evidence_type', 'source', 'direction'],
  'evidence.retracted':       ['evidence_id', 'cause'],
  'knowledge.corrected':      ['from', 'to', 'cause'],
  'knowledge.reclassified':   ['from', 'to', 'cause'],
  'project.closed':           ['cause', 'postmortem'],
  'project.routed':           [], 'project.activated': [], 'project.status_changed': [],
  'project.iteration':        [], 'project.artifact_created': [],
  'decision.recorded':        [], 'decision.opened': [], 'decision.decided': [],
  'experiment.started':       [], 'experiment.concluded': [],
  'evidence.observed':        [], 'signal.observed': [],
  'object.created':           [], 'object.patched': [], 'object.replaced': [], 'object.updated': [],
  'guard.armed':              [], 'ontology.changed': [],
};
const EVIDENCE_TYPES = ['measurement', 'postmortem', 'narrative', 'backtest', 'intention'];
const DIRECTIONS = ['supports', 'contradicts', 'limits', 'neutral'];
const OBJECT_OPS = ['object.create', 'object.patch', 'object.replace'];
const TYPE_DIR = { mechanism: 'mechanisms', principle: 'principles', axiom: 'axioms', project: 'projects', decision: 'decisions', experiment: 'experiments', record: 'records', rule: 'rules', guard: 'guards', benchmark: 'benchmarks', capability: 'capabilities', agent: 'agents', component: 'components', client: 'clients', signal: 'signals', sop: 'sops', workflow: 'workflows' };
const PREFIX_DIR = { mech: 'mechanisms', prin: 'principles', ax: 'axioms', proj: 'projects', dec: 'decisions', exp: 'experiments', rec: 'records', rule: 'rules', guard: 'guards', bench: 'benchmarks', cap: 'capabilities', agent: 'agents', comp: 'components', cli: 'clients', sig: 'signals', sop: 'sops', wf: 'workflows' };
/* typy, których powstanie musi być jawnie zatwierdzone (nie powstają "przy okazji") */
const GUARDED_TYPES = ['rule', 'guard', 'sop', 'mechanism'];

const errors = [];
const fail = m => errors.push(m);
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const hash16 = s => sha(s).slice(0, 16);

function localParts(d = new Date()) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const p = Object.fromEntries(f.formatToParts(d).map(x => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  const offMin = Math.round((asUTC - d.getTime()) / 60000);
  const sign = offMin >= 0 ? '+' : '-';
  const off = `${sign}${String(Math.floor(Math.abs(offMin) / 60)).padStart(2, '0')}:${String(Math.abs(offMin) % 60).padStart(2, '0')}`;
  return { date: `${p.year}-${p.month}-${p.day}`, ts: `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${off}` };
}
function canonical(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
}
function findCard(id) {
  const dir = path.join(G, PREFIX_DIR[String(id).split(':')[0]] || '');
  if (!fs.existsSync(dir)) return null;
  const walk = d => fs.readdirSync(d).flatMap(f => {
    const p = path.join(d, f);
    return fs.statSync(p).isDirectory() ? walk(p) : [p];
  });
  const needle = `id: ${JSON.stringify(id)}`;
  for (const p of walk(dir)) {
    if (!p.endsWith('.md')) continue;
    if (fs.readFileSync(p, 'utf8').split('\n').some(l => l.trim() === needle)) return p;
  }
  return null;
}
function parseFM(raw) {
  const end = raw.indexOf('\n---', 4);
  const fm = {};
  for (const line of raw.slice(4, end).split('\n')) {
    if (!line.trim()) continue;
    const i = line.indexOf(': ');
    if (i < 0) continue;
    try { fm[line.slice(0, i)] = JSON.parse(line.slice(i + 2)); } catch { fm[line.slice(0, i)] = line.slice(i + 2); }
  }
  return { fm, body: raw.slice(end + 4) };
}
function renderCard(fm, body) {
  const order = ['id', 'type', 'title', 'status', 'created', 'updated', 'version', 'owner'];
  const keys = [...order.filter(k => k in fm), ...Object.keys(fm).filter(k => !order.includes(k))];
  return '---\n' + keys.map(k => `${k}: ${JSON.stringify(fm[k])}`).join('\n') + '\n---\n\n' + String(body).trim() + '\n';
}

/* ═══ 0. WEJŚCIE ═══ */
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const src = args.find(a => !a.startsWith('--'));
/* ZERO override zaufania — klucz publiczny wyłącznie z kotwicy (lib/approval.js). */
if (!src) { console.error('użycie: node ingest.js <pakiet.json|-> [--dry-run]'); process.exit(2); }
let input;
try { input = JSON.parse(src === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(src, 'utf8')); }
catch (e) { console.error('✗ pakiet nie jest poprawnym JSON: ' + e.message); process.exit(2); }

/* ═══ 1. BRAMKA APPROVAL ═══ */
const proposalHash = sha(canonical({ events: input.events || [], evidence: input.evidence || [], objects: input.objects || [] }));
/* Odcisk RZECZYWISTEGO payloadu zapisu, liczony tą samą funkcją co u wystawiającego zgodę.
   To on jest podpisany — `proposal_hash` powyżej zostaje wyłącznie jako czytelna metadana. */
const PAYLOAD_HASH = APPROVAL.payloadHash(input);
const APPROVED = !!(input.approval && input.approval.status === 'approved');
if (!DRY) {
  const a = input.approval;
  if (!APPROVED) fail('BRAK APPROVAL — pakiet bez {approval.status:"approved"} nie może zostać zapisany (użyj --dry-run do podglądu)');
  else {
    if (!a.approved_by) fail('approval.approved_by wymagane');
    if (!a.approved_at || isNaN(Date.parse(a.approved_at))) fail('approval.approved_at musi być poprawną datą ISO 8601');
    if (!a.proposal_hash) fail('approval.proposal_hash wymagane');
    else if (a.proposal_hash !== proposalHash) fail(`approval.proposal_hash NIEZGODNY z treścią pakietu — zatwierdzono inną propozycję\n      oczekiwano: ${proposalHash}\n      otrzymano:  ${a.proposal_hash}`);
    /* ── ZGODA CZŁOWIEKA: status+approved_by+proposal_hash to POLA, które agent umie wpisać sam.
       Wiążący jest podpis HMAC pełnego pakietu decyzyjnego kluczem spoza repo. ── */
    if (a.package && a.package.payload_hash !== PAYLOAD_HASH)
      fail(`approval.package.payload_hash NIE ZGADZA SIĘ z rzeczywistym payloadem {events, evidence, objects}\n      podpisano:  ${a.package.payload_hash}\n      w pakiecie: ${PAYLOAD_HASH}`);
    if (a.package && !a.package.payload_hash)
      fail('approval.package.payload_hash wymagane — bez niego podpis nie obejmuje tego, co zostanie zapisane');
    if (!a.package) fail('approval.package wymagane — pełny pakiet decyzyjny podlegający podpisowi (patrz lib/research-contract.js: buildApprovalPackage)');
    if (!a.signature) fail('approval.signature wymagane — podpis HMAC pakietu; sam status "approved" nie jest zgodą człowieka');
    if (!a.nonce) fail('approval.nonce wymagane — bez jednorazowego nonce ten sam podpis dałoby się użyć ponownie');
    if (a.package && a.package.project_contract) {
      const v = APPROVAL.validateProjectContract(a.package.project_contract);
      if (!v.ok) fail(`Project Contract niekompletny: ${v.errors.join(' · ')}`);
    }
  }
}

/* ═══ 2. LEDGER: wczytanie, ID, chronologia (tylko odczyt) ═══ */
const perMonth = new Map();
const allIds = new Set();
let lastTs = '';
if (fs.existsSync(LEDGER_DIR)) {
  for (const f of fs.readdirSync(LEDGER_DIR).filter(x => x.endsWith('.jsonl')).sort()) {
    const file = path.join(LEDGER_DIR, f);
    const raw = fs.readFileSync(file, 'utf8');
    const lines = raw.split('\n').filter(l => l.trim());
    perMonth.set(f.replace(/^events-|\.jsonl$/g, ''), { file, lines, raw });
    for (const l of lines) {
      let e; try { e = JSON.parse(l); } catch { fail(`ledger/${f}: niepoprawna linia JSON — napraw przed ingestem`); continue; }
      if (allIds.has(e.id)) fail(`ledger/${f}: zduplikowany Event ID ${e.id} już w historii`);
      allIds.add(e.id);
      if (e.ts > lastTs) lastTs = e.ts;
    }
  }
}

/* ═══ 3. EVIDENCE → karty (dedupe strukturalna) ═══ */
const plan = new Map();
const backups = new Map();
const stage = (file, after) => {
  if (!backups.has(file)) backups.set(file, fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
  plan.set(file, { before: backups.get(file), after });
};
const currentRaw = file => (plan.has(file) ? plan.get(file).after : (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null));

const autoEvents = [];
const dedupeReport = [];
for (const ev of (input.evidence || [])) {
  /* JEDNA implementacja writera Evidence — lib/evidence-writer.js. Wcześniej ta logika istniała
     tutaj i (uproszczona) w deploy.js: dwie semantyki zapisu tego samego obiektu. */
  const v = EW.validateEvidenceInput(ev);
  if (!v.ok) { for (const e of v.errors) fail(e); continue; }
  const target = v.target;
  const file = findCard(target);
  if (!file) { fail(`evidence: karta ${target} nie istnieje`); continue; }
  const { fm, body } = parseFM(currentRaw(file));
  const r = EW.applyEvidence(fm, ev, { today: localParts().date, actor: 'session:ingest' });
  if (r.status === 'error') { for (const e of r.errors) fail(e); continue; }
  if (r.status === 'skipped') { dedupeReport.push(`${target}: POMINIĘTO — ${r.reason} (${r.id})`); continue; }
  if (r.note) dedupeReport.push(r.note);
  stage(file, renderCard(r.fm, body));
  autoEvents.push(r.event);
}

/* ═══ 4. OBIEKTY: create / patch / replace ═══ */
for (const o of (input.objects || [])) {
  if (!OBJECT_OPS.includes(o.op)) { fail(`obiekt ${o.id || '?'}: wymagane pole op ∈ [${OBJECT_OPS}]`); continue; }
  if (!o.id) { fail('obiekt bez id'); continue; }
  const existing = findCard(o.id);

  if (o.op === 'object.create') {
    if (existing) { fail(`object.create: ${o.id} JUŻ ISTNIEJE (użyj object.patch)`); continue; }
    if (!o.type || !TYPE_DIR[o.type]) { fail(`object.create ${o.id}: brak lub nieznany type`); continue; }
    if (GUARDED_TYPES.includes(o.type) && !APPROVED) { fail(`object.create ${o.id}: typ "${o.type}" wymaga jawnego approval`); continue; }
    if (!o.owner) { fail(`object.create ${o.id}: brak pola owner (writer NIE ustawia właściciela domyślnie)`); continue; }
    const d = localParts().date;
    const fm = { ...o }; delete fm.op; delete fm.body; delete fm.ingest_note; delete fm.cause; delete fm.actor;
    fm.created = fm.created || d; fm.updated = d; fm.version = 1;
    fm.relations = fm.relations || {}; fm.tags = fm.tags || [];
    /* DEFEKT ZNALEZIONY 09.08: ingest spłaszczał "rec:backtests/x" do "records/backtests-x.md",
       podczas gdy CAŁE repo trzyma je w podkatalogach ("records/backtests/briefsync.md" = rec:backtests/briefsync).
       Wdrożenie rozsypałoby Recordy po dwóch konwencjach. Zachowujemy podkatalogi; segmenty są sanitowane. */
    const slug = o.id.split(':').slice(1).join(':');
    const segs = slug.split('/').map(s => s.replace(/[^a-zA-Z0-9._-]/g, '-')).filter(s => s && s !== '.' && s !== '..');
    if (!segs.length) { fail(`object.create ${o.id}: identyfikator nie daje bezpiecznej ścieżki pliku`); continue; }
    stage(path.join(G, TYPE_DIR[o.type], ...segs.slice(0, -1), segs[segs.length - 1] + '.md'), renderCard(fm, o.body || ''));
    autoEvents.push({ kind: 'object.created', on: o.id, actor: o.actor || 'session:ingest', provenance: 'record', cause: o.cause, version_to: 1, note: o.ingest_note || `Utworzono ${o.type} ${o.id}.` });
    continue;
  }
  if (!existing) { fail(`${o.op}: ${o.id} nie istnieje`); continue; }
  const { fm, body } = parseFM(currentRaw(existing));

  if (o.op === 'object.replace') {
    if (!o.confirm_replace) { fail(`object.replace ${o.id}: wymaga jawnego "confirm_replace": true (operacja destrukcyjna)`); continue; }
    const nfm = { ...o }; delete nfm.op; delete nfm.body; delete nfm.confirm_replace; delete nfm.ingest_note; delete nfm.cause; delete nfm.actor;
    nfm.owner = o.owner || fm.owner; nfm.created = fm.created;
    nfm.updated = localParts().date; nfm.version = (fm.version || 1) + 1;
    stage(existing, renderCard(nfm, o.body != null ? o.body : body));
    autoEvents.push({ kind: 'object.replaced', on: o.id, actor: o.actor || 'session:ingest', provenance: 'record', cause: o.cause, version_to: nfm.version, note: o.ingest_note || 'Karta zastąpiona w całości.' });
    continue;
  }
  const patch = { ...o };
  for (const k of ['op', 'body', 'ingest_note', 'actor', 'cause']) delete patch[k];
  if ('owner' in patch && patch.owner !== fm.owner) { fail(`object.patch ${o.id}: zmiana owner wymaga object.replace z confirm_replace`); continue; }
  if ('status' in patch && fm.type === 'mechanism') {
    const cv = (patch.confidence && patch.confidence.value) || (fm.confidence && fm.confidence.value);
    if (cv !== patch.status) { fail(`object.patch ${o.id}: status "${patch.status}" ≠ confidence.value "${cv}"`); continue; }
    if (patch.status === 'validated') { fail(`object.patch ${o.id}: awans na "validated" tylko przez confidence.changed po weryfikacji progu przez build`); continue; }
  }
  const nfm = { ...fm, ...patch, updated: localParts().date, version: (fm.version || 1) + 1 };
  stage(existing, renderCard(nfm, o.body != null ? o.body : body));
  autoEvents.push({ kind: 'object.patched', on: o.id, actor: o.actor || 'session:ingest', provenance: 'record', cause: o.cause, version_to: nfm.version, note: o.ingest_note || `Zmieniono pola: ${Object.keys(patch).filter(k => k !== 'id').join(', ')}.` });
}

/* ═══ 5. ZDARZENIA: schemat → ID → chronologia → hash-chain per miesiąc ═══ */
const staged = [];
{
  const seqByDate = new Map();
  for (const id of allIds) {
    const m = /^evt:(\d{4}-\d{2}-\d{2})-(\d+)$/.exec(id);
    if (m) seqByDate.set(m[1], Math.max(seqByDate.get(m[1]) || 0, +m[2]));
  }
  const chain = new Map();
  let prevTs = lastTs;
  for (const e of [...(input.events || []), ...autoEvents]) {
    if (!EVENT_SCHEMA[e.kind]) { fail(`event: kind "${e.kind}" spoza ZAMKNIĘTEGO słownika`); continue; }
    if (!e.on) { fail(`event ${e.kind}: brak pola on`); continue; }
    const created = (input.objects || []).some(o => o.id === e.on && o.op === 'object.create');
    if (!created && !findCard(e.on)) { fail(`event ${e.kind}: obiekt ${e.on} nie istnieje`); continue; }
    let missing = false;
    for (const f of EVENT_SCHEMA[e.kind]) if (e[f] === undefined || e[f] === null || e[f] === '') { fail(`event ${e.kind} → ${e.on}: brak wymaganego pola "${f}"`); missing = true; }
    if (missing) continue;
    if (e.cause && /^(rec|dec):/.test(e.cause) && !findCard(e.cause) && !(input.objects || []).some(o => o.id === e.cause)) { fail(`event ${e.kind}: cause → nieistniejący obiekt ${e.cause}`); continue; }
    if (e.kind === 'confidence.changed' && e.to === 'validated') { fail(`confidence.changed → validated (${e.on}): próg musi najpierw przejść build; ingest nie awansuje automatycznie`); continue; }

    const lp = localParts();
    if (e.local_date && e.ts && e.local_date !== String(e.ts).slice(0, 10)) { fail(`event ${e.kind} → ${e.on}: local_date ${e.local_date} ≠ data timestampu ${String(e.ts).slice(0, 10)}`); continue; }
    const date = e.local_date || (e.ts ? String(e.ts).slice(0, 10) : lp.date);
    const month = date.slice(0, 7);
    const seq = (seqByDate.get(date) || 0) + 1;
    seqByDate.set(date, seq);
    const id = `evt:${date}-${String(seq).padStart(4, '0')}`;
    if (allIds.has(id)) { fail(`event: wygenerowany ID ${id} już istnieje`); continue; }
    allIds.add(id);
    const ts = e.ts || lp.ts;
    /* porównanie po WARTOŚCI czasu (Date.parse), nie leksykograficznie — Ledger miesza offsety
       (+00:00 / +02:00), a "12:54+00:00" < "14:40+02:00" jako string mimo późniejszej chwili */
    if (prevTs && Date.parse(ts) < Date.parse(prevTs)) { fail(`event ${id}: ts ${ts} wcześniejszy niż ostatnie zdarzenie ${prevTs} (zakaz zapisu wstecz — korekty jako nowe zdarzenia)`); continue; }
    prevTs = ts;
    if (!chain.has(month)) {
      const m = perMonth.get(month);
      chain.set(month, m && m.lines.length ? hash16(m.lines[m.lines.length - 1]) : 'genesis');
    }
    const rest = { ...e }; delete rest.local_date; delete rest.ts; delete rest.kind; delete rest.on;
    const rec = { id, ts, kind: e.kind, on: e.on, ...rest, actor: e.actor || 'session:ingest', provenance: e.provenance || 'record', prev_hash: chain.get(month) };
    const line = JSON.stringify(rec);
    chain.set(month, hash16(line));
    staged.push({ month, line, rec });
  }
}

/* ═══ 6. RAPORT ═══ */
console.log(`\n═══ GENOME INGEST v2 ${DRY ? '· DRY-RUN (zero zapisu)' : '· ZAPIS'} ═══`);
console.log(`genome: ${G}\nstrefa: ${TZ}\nproposal_hash: ${proposalHash}`);
console.log(`\nKARTY (${plan.size}):`);
for (const [file, p] of plan) console.log(`  • ${path.relative(G, file)}${p.before === null ? '  [NOWA]' : ''}`);
console.log(`ZDARZENIA (${staged.length}):`);
for (const s of staged) console.log(`  • ${s.rec.id} ${s.rec.kind} → ${s.rec.on}  [${s.month}]`);
if (dedupeReport.length) { console.log(`DEDUPLIKACJA (${dedupeReport.length}):`); dedupeReport.forEach(d => console.log('  ~ ' + d)); }

if (errors.length) {
  console.error(`\n✗ ODRZUCONO — ${errors.length} błędów, nic nie zapisano:`);
  errors.forEach(e => console.error('  ✗ ' + e));
  process.exit(1);
}
if (DRY) { console.log('\n✓ DRY-RUN OK — pakiet przeszedłby walidację. Zero zmian na dysku.'); process.exit(0); }
if (!plan.size && !staged.length) { console.log('\nBrak zmian.'); process.exit(0); }

/* ═══ 7. BLOKADA (WSPÓLNA z migracją: .genome-write.lock) → ZAPIS ATOMOWY → BUILD → ROLLBACK ═══ */
/* hak testowy: wymusza okno wyścigu plan→blokada (dwa realne procesy w testach) */
if (process.env.GENOME_TEST_PLAN_DELAY_MS) execFileSync('sleep', [String((+process.env.GENOME_TEST_PLAN_DELAY_MS) / 1000)]);

let NONCE_TO_CONSUME = null;
const lockRes = withGenomeWriteLock(G, () => {
/* ══ ZGODA CZŁOWIEKA — WERYFIKACJA POD BLOKADĄ, PRZED PIERWSZYM ZAPISEM ══
   Świadomie TUTAJ, nie w sekcji 1: między planowaniem a zapisem nie może być okna, w którym
   podpis jest zweryfikowany, a nonce jeszcze wolny. Blokada serializuje sprawdzenie i zużycie. */
if (!DRY) {
  const a = input.approval || {};

  /* 1. PONOWNE policzenie odcisku payloadu POD BLOKADĄ i porównanie z podpisanym.
     Kolejność jest istotna: najpierw wiążemy podpis z tym, co realnie zapiszemy. */
  const payloadNow = APPROVAL.payloadHash(input);
  if (!a.package || a.package.payload_hash !== payloadNow) {
    console.error(`\n✗ PAYLOAD NIE ODPOWIADA ZGODZIE — podpisano ${(a.package || {}).payload_hash}, do zapisu idzie ${payloadNow}`);
    console.error('   Podpisany pakiet obejmuje {events, evidence, objects}. Podmiana payloadu unieważnia zgodę,');
    console.error('   nawet jeśli zewnętrzny proposal_hash został przeliczony.');
    return { ok: false, approval_rejected: true, payload_mismatch: true };
  }

  /* 2. WERYFIKACJA PODPISU Ed25519 całego pakietu (payload_hash jest jego częścią) */
  const rev = APPROVAL.verifyApproval(a, input, {});
  if (rev.state !== 'verified') {
    console.error(`\n✗ APPROVAL / ZGODA WŁAŚCICIELA ODRZUCONA (${rev.state}): ${rev.why}`);
    console.error('   Sam blok approval.status/approved_by/proposal_hash NIE jest zgodą — wymagany podpis Ed25519');
    console.error(`   kluczem prywatnym właściciela (${APPROVAL.PRIVKEY_HINT}); writer ma wyłącznie klucz publiczny.`);
    return { ok: false, approval_rejected: true };
  }
  /* 3. REPLAY: nonce zużywany atomowo pod tą samą blokadą */
  let used = [];
  if (fs.existsSync(NONCE_REGISTRY))
    used = fs.readFileSync(NONCE_REGISTRY, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } });
  const clash = used.find(u => u.nonce === a.nonce);
  if (clash) {
    console.error(`\n✗ REPLAY ODRZUCONY — nonce "${a.nonce}" został już zużyty ${clash.consumed_at} przez ${clash.approved_by}`);
    console.error(`   odcisk poprzedniego pakietu: ${clash.fingerprint}`);
    return { ok: false, replay_rejected: true };
  }
  NONCE_TO_CONSUME = { nonce: a.nonce, fingerprint: rev.fingerprint, approved_by: a.approved_by,
    consumed_at: new Date().toISOString(), phase: (a.package || {}).phase || null };
}

/* ── RE-WERYFIKACJA POD BLOKADĄ: plan powstał PRZED blokadą, więc zanim cokolwiek
   zapiszemy, każde wejście musi być bajtowo identyczne ze stanem z chwili planowania.
   Różnica = ABORT przed pierwszym zapisem (nie rollback do starego backupu). ── */
const driftBeforeWrite = [];
for (const [file, pl] of plan) {
  const now = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (now !== pl.before) driftBeforeWrite.push(path.relative(G, file));
  else backups.set(file, now);   /* backup odświeżony ze zweryfikowanego stanu pod blokadą */
}
const monthsTouched = new Set(staged.map(x => x.month));
for (const month of monthsTouched) {
  const m = perMonth.get(month);
  const file = m ? m.file : path.join(LEDGER_DIR, `events-${month}.jsonl`);
  const now = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  const plannedRaw = m ? m.raw : null;
  if (now !== plannedRaw) driftBeforeWrite.push(`ledger/events-${month}.jsonl`);
}
if (driftBeforeWrite.length) {
  console.error('\n✗ WEJŚCIA ZMIENIONE między planowaniem a blokadą — ABORT przed jakimkolwiek zapisem (zaplanuj ponownie na świeżym stanie):');
  for (const f of driftBeforeWrite) console.error('   • ' + f);
  return { ok: false, aborted_before_write: true };
}
const ledgerBackup = new Map();
const written = [];
const rollback = () => {
  for (const f of written) {
    const b = backups.has(f) ? backups.get(f) : (ledgerBackup.has(f) ? ledgerBackup.get(f) : null);
    if (b === null || b === undefined) { if (fs.existsSync(f)) fs.unlinkSync(f); } else fs.writeFileSync(f, b);
  }
};
const atomicWrite = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.ingest.tmp';
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
  if (!written.includes(file)) written.push(file);
};

try {
  for (const [file, p] of plan) atomicWrite(file, p.after);
  const byMonth = new Map();
  for (const s of staged) { if (!byMonth.has(s.month)) byMonth.set(s.month, []); byMonth.get(s.month).push(s.line); }
  for (const [month, lines] of byMonth) {
    const file = path.join(LEDGER_DIR, `events-${month}.jsonl`);
    if (!ledgerBackup.has(file)) ledgerBackup.set(file, fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
    const prev = ledgerBackup.get(file);
    atomicWrite(file, (prev ? prev.replace(/\n*$/, '\n') : '') + lines.join('\n') + '\n');
  }
  if (NONCE_TO_CONSUME) {
    if (!ledgerBackup.has(NONCE_REGISTRY)) ledgerBackup.set(NONCE_REGISTRY, fs.existsSync(NONCE_REGISTRY) ? fs.readFileSync(NONCE_REGISTRY, 'utf8') : null);
    const prevN = ledgerBackup.get(NONCE_REGISTRY);
    atomicWrite(NONCE_REGISTRY, (prevN ? prevN.replace(/\n*$/, '\n') : '') + JSON.stringify(NONCE_TO_CONSUME) + '\n');
  }
  execFileSync('node', [path.join(G, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: G }, stdio: 'pipe' });
} catch (e) {
  const out = ((e.stdout || '') + (e.stderr || '')).toString() || e.message;
  console.error('\n✗ WALIDACJA/ZAPIS ODRZUCONY — ROLLBACK:\n' + out);
  rollback();
  console.error(`↩ ROLLBACK wykonany: przywrócono ${written.length} plików do stanu sprzed ingestu`);
  return { ok: false };
}
try { execFileSync('node', [path.join(G, 'build.js')], { env: { ...process.env, GENOME_DIR: G }, stdio: 'inherit' }); } catch { /* emit best-effort */ }
console.log(`\n✓ INGEST ZAPISANY — karty: ${plan.size}, zdarzenia: ${staged.length}, zatwierdził: ${input.approval.approved_by}`);
return { ok: true };
});
if (!lockRes || lockRes.ok === false) { if (lockRes && lockRes.error) console.error('✗ ' + lockRes.error); process.exit(1); }
