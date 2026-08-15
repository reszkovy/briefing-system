#!/usr/bin/env node
/* ═══ TESTY WRITERA I WALIDATORA GENOME ═══
 * Każdy test dostaje świeżą kopię fixture-template w katalogu tymczasowym.
 * Nic nie dotyka kanonicznego Genome.
 *   node test/run-tests.js            wszystkie
 *   node test/run-tests.js 7          pojedynczy numer
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

/* ── KORZEŃ GENOME I KATALOG MODUŁÓW: rozpoznawane po cechach katalogu, nie po liczbie „..".
   Ten sam plik uruchamia się z `proposals/final-salt-plate/test` ORAZ z `<genome>/test`
   po wdrożeniu. Wersja licząca „.." działała tylko z pierwszej z tych lokalizacji: po
   wdrożeniu szukała `<genome>/genome/...` i cały zestaw wywalał się na ENOENT. */
function __genomeRoot(start) {
  let d = start;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(d, 'build.js')) && fs.existsSync(path.join(d, 'ledger')) && fs.existsSync(path.join(d, 'records'))) return d;
    const up = path.dirname(d); if (up === d) break; d = up;
  }
  throw new Error('nie znaleziono korzenia Genome od: ' + start);
}
function __moduleHome(here, genome) {
  for (const c of [path.resolve(here, '..'), genome, path.join(genome, 'proposals', 'final-salt-plate')])
    if (fs.existsSync(path.join(c, 'lib', 'approval.js'))) return c;
  throw new Error('nie znaleziono lib/approval.js ani w kopii roboczej, ani w kanonie');
}
function __sourceDir(home, genome) {
  /* MATERIAŁ AUTORSKI propozycji: `<propozycja>/genome/...`. Ten zestaw sprawdza właśnie ten
     materiał (np. „karta mechanizmu nie ma zaszytego Evidence"), a nie stan po wdrożeniu —
     po zapisie writer DOKŁADA Evidence do karty, więc czytanie kanonu dawałoby 4 fałszywe FAIL.
     Uruchomiony z kanonu sięga więc do `proposals/final-salt-plate/genome`, jeśli ono istnieje.
     Zgodność samej INSTALACJI z kanonem sprawdza osobny zestaw `run-canon-tests.js`. */
  for (const c of [path.join(home, 'genome'), path.join(genome, 'proposals', 'final-salt-plate', 'genome')])
    if (fs.existsSync(path.join(c, 'ingest.js')) || fs.existsSync(path.join(c, 'migrate.js'))) return c;
  return genome;
}
function __firstExisting(...cands) { for (const c of cands) if (fs.existsSync(c)) return c; return cands[cands.length - 1]; }

const HERE = __dirname;
const GENOME = __genomeRoot(HERE);
const PROPOSAL = __moduleHome(HERE, GENOME);
const SRC = __sourceDir(PROPOSAL, GENOME);
const TEMPLATE = path.join(GENOME, 'test', 'fixture-template');
const TZ = 'Europe/Madrid';

let pass = 0, failCount = 0;
const results = [];

function sandbox() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-test-'));
  const cp = (src, dst) => {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) {
      const s = path.join(src, f), d = path.join(dst, f);
      if (fs.statSync(s).isDirectory()) cp(s, d); else fs.copyFileSync(s, d);
    }
  };
  cp(TEMPLATE, dir);
  fs.copyFileSync(path.join(GENOME, 'build.js'), path.join(dir, 'build.js'));
  fs.copyFileSync(path.join(SRC, 'ingest.js'), path.join(dir, 'ingest.js'));
  fs.cpSync(path.join(GENOME, 'lib'), path.join(dir, 'lib'), { recursive: true });   // wspólne prymitywy zapisu
  /* moduły z propozycji: ingest v3 wymaga research-contract.js z pełnym pakietem zgody */
  for (const m of ['research-contract.js', 'strategy-frameworks.js', 'approval.js', 'genome-txn.js', 'evidence-writer.js', 'genome-common.js'])
    fs.copyFileSync(path.join(PROPOSAL, 'lib', m), path.join(dir, 'lib', m));

  anchorSandbox(dir, TEST_PUB_PEM);
  return dir;
}
function run(dir, pkg, extra = []) {
  // pakiet POZA piaskownicą — inaczej zmieniałby jej snapshot i fałszował testy rollbacku
  const f = path.join(os.tmpdir(), `genome-pkg-${crypto.randomBytes(6).toString('hex')}.json`);
  fs.writeFileSync(f, JSON.stringify(pkg));
  try {
    const out = execFileSync('node', [path.join(dir, 'ingest.js'), f, ...extra],
      { env: { ...process.env, GENOME_DIR: dir, GENOME_TZ: TZ }, encoding: 'utf8', stdio: 'pipe' });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}
function check(dir) {
  try {
    const out = execFileSync('node', [path.join(dir, 'build.js'), '--check'],
      { env: { ...process.env, GENOME_DIR: dir, GENOME_TZ: TZ }, encoding: 'utf8', stdio: 'pipe' });
    return { code: 0, out };
  } catch (e) { return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') }; }
}
let APPROVE_SEQ = 0;
/* Ed25519: podpisujemy PRÓBNYM kluczem prywatnym; piaskownica dostaje odpowiadający mu klucz
   publiczny. Zaufanie produkcyjne (lib/approval-pubkey.pem) nietknięte, zero override ścieżek. */
const { publicKey: TEST_PUB, privateKey: TEST_PRIV } = crypto.generateKeyPairSync('ed25519');
const TEST_PUB_PEM = TEST_PUB.export({ type: 'spki', format: 'pem' });
/* Kotwica zaufania leży POZA repo (~/.genome). Testy izolują HOME procesu potomnego —
   izolacja środowiska, nie override w kodzie. */
/* Kotwica w KOPII biblioteki wewnątrz piaskownicy — produkcyjny ingest.js nie ma już żadnej flagi
   ani zmiennej, którą dałoby się podstawić zaufanie. */
function anchorSandbox(dir, pubPem) {
  const anchor = path.join(dir, '.test-anchor');
  fs.mkdirSync(anchor, { recursive: true });
  fs.writeFileSync(path.join(anchor, 'approval-pubkey.pem'), pubPem);
  const ap = path.join(dir, 'lib', 'approval.js');
  let src = fs.readFileSync(ap, 'utf8');
  src = src.replace(/function trustDir\(\) \{[\s\S]*?\n\}/,
    `function trustDir() { return ${JSON.stringify(anchor)}; }   /* KOPIA TESTOWA */`);
  if (!src.includes('KOPIA TESTOWA')) throw new Error('nie udało się podmienić trustDir()');
  fs.writeFileSync(ap, src);
}
const TEST_CONTRACT = {
  client: 'cli:test', business_problem: 'test warstwy zapisu', project_start: '2026-08-10',
  scope: 'test', non_scope: 'produkcja', baseline: 'n/d', mechanisms: [], frameworks: [],
  validation_plan: 'n/d — pakiet testowy', outcome_owner: 'test', measurement_date: '2026-12-01',
  go_decision: 'GO', go_rationale: 'pakiet testowy warstwy zapisu',
  prepared_by: 'session:test', decided_by: 'test', report_version: 'v1', contract_version: 'v1',
};
const approve = pkg => {
  const canonical = v => v === null || typeof v !== 'object' ? JSON.stringify(v)
    : Array.isArray(v) ? '[' + v.map(canonical).join(',') + ']'
    : '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
  const payload = { events: pkg.events || [], evidence: pkg.evidence || [], objects: pkg.objects || [] };
  /* ingest v3 wymaga PODPISANEGO pakietu decyzyjnego — sam status "approved" to za mało. */
  const AP = require(path.resolve(__dirname, '..', 'lib', 'approval.js'));
  const nonce = 'writer-test-' + (++APPROVE_SEQ) + '-' + process.pid;
  const approvalPkg = {
    schema_version: AP.SCHEMA_VERSION, phase: 'contract',
    claims: [], research: [], routing: null, recommended_mechanisms: [], recommended_frameworks: [],
    metrics: [], project_contract: TEST_CONTRACT, predictions: [],
    payload_hash: AP.payloadHash(pkg),
    nonce, expires_at: '2030-01-01',
  };
  const signature = crypto.sign(null, AP.signingBytes(approvalPkg), TEST_PRIV).toString('hex');
  return { ...pkg, approval: {
    status: 'approved', approved_by: 'test', approved_at: new Date().toISOString(),
    proposal_hash: crypto.createHash('sha256').update(canonical(payload)).digest('hex'),
    package: approvalPkg, signature, nonce,
  } };
};
const card = (dir, rel) => fs.readFileSync(path.join(dir, rel), 'utf8');
const fm = (dir, rel) => {
  const raw = card(dir, rel), end = raw.indexOf('\n---', 4), o = {};
  for (const l of raw.slice(4, end).split('\n')) { const i = l.indexOf(': '); if (i > 0) { try { o[l.slice(0, i)] = JSON.parse(l.slice(i + 2)); } catch { o[l.slice(0, i)] = l.slice(i + 2); } } }
  return o;
};
const ledger = dir => {
  const d = path.join(dir, 'ledger');
  return fs.readdirSync(d).filter(f => f.endsWith('.jsonl')).sort()
    .flatMap(f => fs.readFileSync(path.join(d, f), 'utf8').split('\n').filter(Boolean).map(l => ({ file: f, ...JSON.parse(l) })));
};
const snapshot = dir => {
  const walk = d => fs.readdirSync(d).flatMap(f => {
    const p = path.join(d, f);
    return fs.statSync(p).isDirectory() ? (f === 'dist' ? [] : walk(p)) : [[path.relative(dir, p), crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')]];
  });
  return JSON.stringify(walk(dir).sort());
};

function test(n, name, fn) {
  if (process.argv[2] && +process.argv[2] !== n) return;
  const dir = sandbox();
  try {
    fn(dir);
    pass++; results.push(`  ✓ ${String(n).padStart(2)}. ${name}`);
  } catch (e) {
    failCount++; results.push(`  ✗ ${String(n).padStart(2)}. ${name}\n       ${e.message.split('\n')[0]}`);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
const assert = (c, m) => { if (!c) throw new Error(m); };

/* ════════ TESTY ════════ */

test(1, 'prediction.registered + rozliczenia HIT/MISS/VOID/UNRESOLVED', dir => {
  const reg = approve({ events: [
    { kind: 'prediction.registered', on: 'proj:test-one', prediction_id: 'pred:a', p: 0.7, claim: 'A', deadline: '2026-12-01', criterion: 'k', measurement_source: 'mail klienta', resolution_owner: 'przemek' },
    { kind: 'prediction.registered', on: 'proj:test-one', prediction_id: 'pred:b', p: 0.4, claim: 'B', deadline: '2026-12-01', criterion: 'k', measurement_source: 'mail klienta', resolution_owner: 'przemek' },
    { kind: 'prediction.registered', on: 'proj:test-one', prediction_id: 'pred:c', p: 0.5, claim: 'C', deadline: '2026-12-01', criterion: 'k', measurement_source: 'mail klienta', resolution_owner: 'przemek' },
  ] });
  assert(run(dir, reg).code === 0, 'rejestracja predykcji odrzucona');
  const res = approve({ events: [
    { kind: 'prediction.resolved', on: 'proj:test-one', prediction_id: 'pred:a', result: 'hit', cause: 'rec:test/pm', resolution_source: 'mail 01.12' },
    { kind: 'prediction.resolved', on: 'proj:test-one', prediction_id: 'pred:b', result: 'miss', cause: 'rec:test/pm', resolution_source: 'brak odpowiedzi' },
    { kind: 'prediction.voided', on: 'proj:test-one', prediction_id: 'pred:c', cause: 'rec:test/pm', note: 'zakres usunięty' },
  ] });
  assert(run(dir, res).code === 0, 'rozliczenie odrzucone');
  const L = ledger(dir);
  const a = L.find(e => e.prediction_id === 'pred:a' && e.kind === 'prediction.resolved');
  assert(a.result === 'hit', 'result nie zachowany');
  assert(L.filter(e => e.kind === 'prediction.voided').length === 1, 'brak voided');
  // UNRESOLVED nie generuje zdarzenia: pred bez rozliczenia zostaje otwarta
  assert(!L.some(e => e.prediction_id === 'pred:d'), 'UNRESOLVED nie może tworzyć zdarzenia');
});

test(2, 'prediction.resolved zachowuje pełny payload (result, cause, źródło)', dir => {
  run(dir, approve({ events: [{ kind: 'prediction.registered', on: 'proj:test-one', prediction_id: 'pred:x', p: 0.6, claim: 'C', deadline: '2026-12-01', criterion: 'k', measurement_source: 'mail klienta', resolution_owner: 'przemek' }] }));
  run(dir, approve({ events: [{ kind: 'prediction.resolved', on: 'proj:test-one', prediction_id: 'pred:x', result: 'miss', cause: 'rec:test/pm', resolution_source: 'log' }] }));
  const e = ledger(dir).find(x => x.kind === 'prediction.resolved');
  for (const f of ['prediction_id', 'result', 'cause', 'resolution_source']) assert(e[f], `zgubione pole ${f}`);
});

test(3, 'confidence.changed zachowuje from/to i wymaga payloadu', dir => {
  const bad = run(dir, approve({ events: [{ kind: 'confidence.changed', on: 'mech:alpha', to: 'emerging' }] }));
  assert(bad.code !== 0, 'confidence.changed bez from/cause/supporting_evidence powinien odpaść');
  const ok = run(dir, approve({ events: [{ kind: 'confidence.changed', on: 'mech:alpha', from: 'emerging', to: 'emerging', cause: 'rec:test/pm', supporting_evidence: ['ev:x'] }] }));
  assert(ok.code === 0, 'poprawny confidence.changed odrzucony:\n' + ok.out);
  const e = ledger(dir).find(x => x.kind === 'confidence.changed');
  assert(e.from === 'emerging' && e.to === 'emerging', 'from/to zgubione');
});

test(4, 'brak approval → zapis niemożliwy', dir => {
  const before = snapshot(dir);
  const r = run(dir, { events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'x' }] });
  assert(r.code !== 0, 'zapis bez approval przeszedł!');
  assert(/APPROVAL/i.test(r.out), 'brak komunikatu o approval');
  assert(snapshot(dir) === before, 'pliki zmienione mimo braku approval');
});

test(5, 'niepoprawny approval (zły hash / zły status) → odrzucenie', dir => {
  const pkg = approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'x' }] });
  const tampered = { ...pkg, events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'PODMIENIONE PO AKCEPTACJI' }] };
  const r = run(dir, tampered);
  assert(r.code !== 0, 'pakiet zmieniony po akceptacji przeszedł!');
  assert(/proposal_hash/i.test(r.out), 'brak informacji o niezgodności hasha');
  const r2 = run(dir, { ...pkg, approval: { ...pkg.approval, status: 'pending' } });
  assert(r2.code !== 0, 'status "pending" przeszedł');
});

test(6, 'zduplikowany Event ID niemożliwy (kolizja sekwencji)', dir => {
  run(dir, approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'a' }] }));
  run(dir, approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'b' }] }));
  const ids = ledger(dir).map(e => e.id);
  assert(new Set(ids).size === ids.length, 'wygenerowano duplikat ID: ' + ids.join(','));
  assert(check(dir).code === 0, 'build --check nie przechodzi po dwóch ingestach');
});

test(7, 'sekwencja ID odporna na formatowanie JSONL (ze spacjami i bez)', dir => {
  const lf = path.join(dir, 'ledger', 'events-2026-08.jsonl');
  const e1 = { id: 'evt:2026-08-01-0001', ts: '2026-08-01T10:00:00+02:00', kind: 'project.iteration', on: 'proj:test-one', actor: 'test', provenance: 'record', note: 'kompaktowy', prev_hash: 'genesis' };
  const l1 = JSON.stringify(e1);
  const h1 = crypto.createHash('sha256').update(l1).digest('hex').slice(0, 16);
  const e2 = { id: 'evt:2026-08-01-0002', ts: '2026-08-01T11:00:00+02:00', kind: 'project.iteration', on: 'proj:test-one', actor: 'test', provenance: 'record', note: 'ze spacjami', prev_hash: h1 };
  // druga linia sformatowana ze spacjami po dwukropkach — parser NIE MOŻE opierać się na regexie
  const l2 = JSON.stringify(e2).replace(/","/g, '", "').replace(/":"/g, '": "');
  fs.writeFileSync(lf, l1 + '\n' + l2 + '\n');
  const r = run(dir, approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'nowy', local_date: '2026-08-01', ts: '2026-08-01T12:00:00+02:00' }] }));
  assert(r.code === 0, 'ingest odrzucił poprawny ledger ze spacjami:\n' + r.out);
  const ids = ledger(dir).map(e => e.id);
  assert(new Set(ids).size === ids.length, 'duplikat ID przy sformatowanym JSONL: ' + ids.join(','));
  assert(ids.includes('evt:2026-08-01-0003'), 'sekwencja nie kontynuowana: ' + ids.join(','));
});

test(8, 'pierwsze zdarzenie nowego miesiąca ma prev_hash "genesis"', dir => {
  run(dir, approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'lipiec', local_date: '2026-07-15', ts: '2026-07-15T10:00:00+02:00' }] }));
  run(dir, approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'sierpień', local_date: '2026-08-02', ts: '2026-08-02T10:00:00+02:00' }] }));
  const L = ledger(dir);
  const jul = L.filter(e => e.file.includes('2026-07')), aug = L.filter(e => e.file.includes('2026-08'));
  assert(jul.length === 1 && aug.length === 1, 'zdarzenia nie trafiły do osobnych plików miesięcznych');
  assert(jul[0].prev_hash === 'genesis', 'lipiec: pierwszy prev_hash ≠ genesis');
  assert(aug[0].prev_hash === 'genesis', 'sierpień: pierwszy prev_hash w NOWYM miesiącu ≠ genesis');
  assert(check(dir).code === 0, 'build --check odrzuca poprawne przejście miesiąca:\n' + check(dir).out);
});

test(9, 'data lokalna w strefie Europe/Madrid (23:30 lokalnie = ten sam dzień)', dir => {
  // 2026-08-02T21:30Z = 2026-08-02T23:30 w Madrycie → ID musi mieć datę 08-02, nie 08-03
  const r = run(dir, approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'noc', ts: '2026-08-02T23:30:00+02:00', local_date: '2026-08-02' }] }));
  assert(r.code === 0, r.out);
  const e = ledger(dir)[0];
  assert(e.id.startsWith('evt:2026-08-02-'), 'ID nie używa daty lokalnej: ' + e.id);
  assert(/[+-]\d{2}:\d{2}$/.test(e.ts), 'timestamp bez offsetu strefy: ' + e.ts);
});

test(10, 'deduplikacja: ten sam fakt dwa razy → jeden Evidence', dir => {
  const ev = { mechanism: 'mech:alpha', project: 'proj:test-one', type: 'backtest', source: 'rec:test/pm', observation: 'Ten sam fakt', direction: 'supports' };
  run(dir, approve({ evidence: [ev] }));
  run(dir, approve({ evidence: [{ ...ev, source: 'rec:test/pm' }] }));
  const e = fm(dir, 'mechanisms/m1.md').evidence;
  assert(e.length === 1, `dedupe nie zadziałał: ${e.length} wpisów`);
});

test(11, 'dwa NIEZALEŻNE Evidence z jednego projektu: zapisane, ale projects=1', dir => {
  run(dir, approve({ evidence: [
    { mechanism: 'mech:alpha', project: 'proj:test-one', type: 'backtest', source: 'rec:test/pm', observation: 'Fakt A', direction: 'supports' },
    { mechanism: 'mech:alpha', project: 'proj:test-one', type: 'narrative', source: 'proj:test-one', observation: 'Zupełnie inny fakt B', direction: 'limits' },
  ] }));
  const f = fm(dir, 'mechanisms/m1.md');
  assert(f.evidence.length === 2, `oba niezależne fakty powinny zostać zapisane, jest ${f.evidence.length}`);
  assert(f.confidence.evidence_strength.projects === 1, `projects=${f.confidence.evidence_strength.projects}, powinno 1 (ten sam projekt)`);
});

test(12, 'validated wyłącznie z backtestów → build --check ODRZUCA', dir => {
  run(dir, approve({ evidence: [
    { mechanism: 'mech:alpha', project: 'proj:test-one', type: 'backtest', source: 'rec:test/pm', observation: 'bt1', direction: 'supports' },
    { mechanism: 'mech:alpha', project: 'proj:test-two', type: 'backtest', source: 'rec:test/pm', observation: 'bt2', direction: 'supports' },
    { mechanism: 'mech:alpha', project: 'proj:test-two', type: 'narrative', source: 'proj:test-two', observation: 'bt3 inny fakt', direction: 'supports' },
  ] }));
  // ręczna podmiana statusu na validated (symulacja obejścia) → walidator musi to złapać
  const p = path.join(dir, 'mechanisms/m1.md');
  fs.writeFileSync(p, card(dir, 'mechanisms/m1.md').replace('status: "emerging"', 'status: "validated"').replace('"value":"emerging"', '"value":"validated"'));
  const c = check(dir);
  assert(c.code !== 0, 'validated na samych backtestach/narracji przeszło!');
  assert(/validated/i.test(c.out), 'brak komunikatu o progu validated');
});

test(13, 'object.patch zmienia tylko wskazane pola (reszta karty nietknięta)', dir => {
  const before = fm(dir, 'mechanisms/m1.md');
  const r = run(dir, approve({ objects: [{ op: 'object.patch', id: 'mech:alpha', trigger: 'NOWY trigger' }] }));
  assert(r.code === 0, r.out);
  const after = fm(dir, 'mechanisms/m1.md');
  assert(after.trigger === 'NOWY trigger', 'patch nie zmienił pola');
  assert(after.context === before.context && after.title === before.title, 'patch nadpisał inne pola');
  assert(card(dir, 'mechanisms/m1.md').includes('## Problem'), 'patch skasował body karty');
  assert(after.owner === before.owner, 'patch zmienił ownera');
});

test(14, 'każda zmiana wiedzy podnosi version i aktualizuje updated', dir => {
  const v0 = fm(dir, 'mechanisms/m1.md').version;
  run(dir, approve({ objects: [{ op: 'object.patch', id: 'mech:alpha', trigger: 'x' }] }));
  const v1 = fm(dir, 'mechanisms/m1.md').version;
  assert(v1 === v0 + 1, `version ${v0}→${v1}`);
  run(dir, approve({ evidence: [{ mechanism: 'mech:alpha', project: 'proj:test-one', type: 'narrative', source: 'proj:test-one', observation: 'f', direction: 'neutral' }] }));
  assert(fm(dir, 'mechanisms/m1.md').version === v1 + 1, 'dodanie evidence nie podniosło version');
  assert(fm(dir, 'mechanisms/m1.md').updated !== '2026-01-01', 'updated nie zaktualizowane');
});

test(15, 'rollback po błędzie builda zostawia stan BAJTOWO identyczny', dir => {
  const before = snapshot(dir);
  // pakiet poprawny formalnie, ale łamiący niezmiennik semantyczny (relacja do nieistniejącego principle)
  const r = run(dir, approve({ objects: [{ op: 'object.create', id: 'mech:gamma', type: 'mechanism', title: 'Gamma', status: 'emerging', owner: 'test',
    confidence: { value: 'emerging', evidence_strength: { n: 0, projects: 0, types: {}, last_confirmed: '2026-01-01' } },
    relations: { implements: ['prin:NIE-ISTNIEJE'] }, evidence: [], body: '## Problem\n\nx' }] }));
  assert(r.code !== 0, 'build nie odrzucił niezmiennika');
  assert(/ROLLBACK/i.test(r.out), 'brak informacji o rollbacku');
  assert(snapshot(dir) === before, 'stan po rollbacku różni się od stanu sprzed ingestu');
});

test(16, 'wspólna blokada .genome-write.lock: ingest odrzucony, gdy trzyma ją inny ŻYWY proces', dir => {
  /* blokada wskazuje żywy proces (nasz własny PID) — stale-lock nie może jej przejąć */
  fs.writeFileSync(path.join(dir, '.genome-write.lock'), JSON.stringify({ pid: process.pid, started: new Date().toISOString() }));
  const r = run(dir, approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note: 'x' }] }));
  fs.rmSync(path.join(dir, '.genome-write.lock'), { force: true });
  assert(r.code !== 0, 'ingest zignorował blokadę');
  assert(/ZAPIS GENOME JUŻ TRWA/i.test(r.out), 'brak komunikatu wspólnej blokady:\n' + r.out.slice(0, 300));
});

test(17, 'utworzenie aktywnej Rule bez approval niemożliwe', dir => {
  const before = snapshot(dir);
  const r = run(dir, { objects: [{ op: 'object.create', id: 'rule:sneaky', type: 'rule', title: 'Reguła', status: 'active', owner: 'test', body: 'x' }] });
  assert(r.code !== 0, 'Rule utworzona bez approval!');
  assert(snapshot(dir) === before, 'pliki zmienione');
});

test(19, 'wyścig dwóch REALNYCH ingestów: drugi (stary plan) odrzucony przed zapisem, stan pierwszego bajtowo zachowany', dir => {
  const { spawn } = require('child_process');
  const pkt = (note) => approve({ events: [{ kind: 'project.iteration', on: 'proj:test-one', note }] });
  const fA = path.join(dir, 'pakietA.json'), fB = path.join(dir, 'pakietB.json');
  fs.writeFileSync(fA, JSON.stringify(pkt('pierwszy — wygrywa wyscig')));
  fs.writeFileSync(fB, JSON.stringify(pkt('drugi — planowal na starym stanie')));
  /* B startuje PIERWSZY: planuje na stanie S0, potem śpi 1.5 s PRZED blokadą (hak testowy).
     Wyjście B do pliku — sync-poll nie blokuje wtedy zbierania outputu. */
  /* marker EXITED w pliku zamiast pollingu PID — zablokowany event loop nie reapuje dzieci (zombie) */
  const bOutFile = path.join(dir, 'b.out');
  const B = spawn('bash', ['-c', `node ${JSON.stringify(path.join(dir, 'ingest.js'))} ${JSON.stringify(fB)}  > ${JSON.stringify(bOutFile)} 2>&1; echo "EXITED:$?" >> ${JSON.stringify(bOutFile)}`], {
    env: { ...process.env, GENOME_DIR: dir, GENOME_TZ: TZ, GENOME_TEST_PLAN_DELAY_MS: '1500' },
    detached: true, stdio: 'ignore'
  });
  B.unref();
  execFileSync('sleep', ['0.4']);            /* B zdążył zaplanować na S0 i śpi przed blokadą */
  const rA = run(dir, JSON.parse(fs.readFileSync(fA, 'utf8')));   /* A pisze: S0 → S1 */
  assert(rA.code === 0, 'ingest A powinien przejść: ' + rA.out.slice(0, 200));
  const ledgerFile = () => path.join(dir, 'ledger', fs.readdirSync(path.join(dir, 'ledger')).find(x => x.endsWith('.jsonl')));
  const ledgerAfterA = fs.readFileSync(ledgerFile(), 'utf8');
  /* czekaj na marker EXITED w pliku wyjściowym B */
  const t0 = Date.now();
  let bOut = '';
  while (Date.now() - t0 < 10000) {
    bOut = fs.existsSync(bOutFile) ? fs.readFileSync(bOutFile, 'utf8') : '';
    if (/EXITED:\d+/.test(bOut)) break;
    execFileSync('sleep', ['0.1']);
  }
  const ledgerAfterB = fs.readFileSync(ledgerFile(), 'utf8');
  const exitCode = (bOut.match(/EXITED:(\d+)/) || [])[1];
  assert(exitCode !== undefined, 'B nie zakończył się w 10 s');
  assert(exitCode !== '0', 'B powinien wyjść z błędem, wyszedł z 0');
  assert(/WEJŚCIA ZMIENIONE/.test(bOut), 'B ma abort z re-weryfikacji pod blokadą, out: ' + bOut.slice(0, 300));
  assert(ledgerAfterA === ledgerAfterB, 'stan zapisany przez A musi pozostać bajtowo nietknięty po odrzuceniu B');
  assert(ledgerAfterB.includes('pierwszy — wygrywa wyscig') && !ledgerAfterB.includes('drugi — planowal'), 'w Ledgerze tylko zapis A');
});

test(18, 'postmortem bez lekcji i bez delty: zero zmian, ale record zapisany', dir => {
  const r = run(dir, approve({ objects: [{ op: 'object.create', id: 'rec:postmortems/test-one-2026-08-08', type: 'record',
    title: 'Postmortem: test-one', status: 'created', owner: 'test',
    relations: { attached_to: ['proj:test-one'] }, tags: ['postmortem'],
    body: '## Lessons\n\nBrak — projekt nie dostarczył wystarczającego Evidence.\n\n## Proposed Genome delta\n\nNO_GENOME_DELTA' }] }));
  assert(r.code === 0, 'postmortem bez lekcji odrzucony:\n' + r.out);
  const f = fm(dir, 'records/postmortems/test-one-2026-08-08.md');
  assert(f.id === 'rec:postmortems/test-one-2026-08-08', 'record nie zapisany');
  const mechs = fm(dir, 'mechanisms/m1.md');
  assert(mechs.evidence.length === 0 && mechs.version === 1, 'karty zmienione mimo braku delty');
  assert(check(dir).code === 0, 'build nie przechodzi po postmortemie bez delty');
});

/* ── raport ── */
console.log('\n═══ TESTY GENOME WRITER/VALIDATOR ═══\n');
results.forEach(r => console.log(r));
console.log(`\n${pass} PASS · ${failCount} FAIL\n`);
process.exit(failCount ? 1 : 0);
