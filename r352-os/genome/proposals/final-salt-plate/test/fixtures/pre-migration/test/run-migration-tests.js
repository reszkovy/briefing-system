#!/usr/bin/env node
/* ═══ TESTY MIGRACJI (7 kontraktów z audytu 3) ═══
 * Każdy test działa na świeżej kopii realnego Genome i używa WYŁĄCZNIE produkcyjnych funkcji
 * z migrate.js. Kanoniczne dane nietknięte.
 *   node test/run-migration-tests.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const M = require('../migrate.js');

const G = path.resolve(__dirname, '..');
const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');
let pass = 0, fail = 0;
const results = [];
const ok = (name, cond, detail) => { cond ? pass++ : fail++; results.push({ name, cond, detail: cond ? '' : String(detail || '').slice(0, 300) }); };
const fresh = () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'mig-test-'));
  const d = path.join(base, 'r352-os', 'genome');
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.cpSync(G, d, { recursive: true, filter: s => !/(^|\/)(dist|node_modules|\.genome-write\.lock)$/.test(s) });
  /* viewer w układzie repo — z markerem, żeby wykryć nadpisanie/rollback */
  const vdir = path.join(base, 'genome-os', 'js');
  fs.mkdirSync(vdir, { recursive: true });
  fs.writeFileSync(path.join(vdir, 'genome-f0-data.js'), '// MARKER-PRZED-MIGRACJA\nwindow.GENOME_DATA = {"objects":{}};\n');
  return d;
};
const baseOf = d => path.resolve(d, '..', '..');
const viewerOf = d => path.join(baseOf(d), 'genome-os', 'js', 'genome-f0-data.js');
const rm = d => fs.rmSync(baseOf(d), { recursive: true, force: true });
const SIMAUTH = { simulation: true };
const checkOut = root => { try { return execFileSync('node', [path.join(G, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: root }, encoding: 'utf8' }); } catch (e) { return (e.stdout || '') + (e.stderr || ''); } };

/* ── 1. Zdarzenie PO granicy freeze nie korzysta z taryfy ulgowej ── */
{
  const d = fresh();
  M.applyPlan(d, M.buildPlan(d), SIMAUTH);
  const lf = path.join(d, 'ledger/events-2026-08.jsonl');
  const lines = fs.readFileSync(lf, 'utf8').split('\n').filter(Boolean);
  const prevHash = crypto.createHash('sha256').update(lines[lines.length - 1]).digest('hex').slice(0, 16);
  /* nowe, WADLIWE zdarzenie z datą 8 sierpnia (leksykograficznie "w seedzie") — musi być błędem */
  const bad = { id: 'evt:2026-08-08-0999', ts: new Date().toISOString(), kind: 'confidence.changed', on: 'mech:numeric-gates', actor: 'test', from: 'emerging', to: 'validated', prev_hash: prevHash };
  fs.appendFileSync(lf, JSON.stringify(bad) + '\n');
  const out = checkOut(d);
  ok('1. nowy Event po granicy freeze NIE dostaje taryfy ulgowej',
    /0999.*brak wymaganego pola|brak wymaganego pola "supporting_evidence"/.test(out.split('\n').filter(l => l.includes('0999') || l.includes(':181:')).join(' ')) || out.includes(':181:'),
    out.split('\n').filter(l => l.startsWith('✗')).slice(0, 3).join(' | '));
  rm(d);
}

/* ── 2. Zmiana wejścia między planem a apply jest odrzucana PRZED zapisem ── */
{
  const d = fresh();
  const plan = M.buildPlan(d);
  const victim = path.join(d, 'mechanisms/numeric-gates.md');
  fs.writeFileSync(victim, fs.readFileSync(victim, 'utf8') + '\n<!-- zmiana po zaplanowaniu -->\n');
  const ledgerBefore = sha256(fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8'));
  const res = M.applyPlan(d, plan, SIMAUTH);
  const ledgerAfter = sha256(fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8'));
  ok('2. zmiana wejścia po zaplanowaniu → abort przed pierwszym zapisem',
    !res.ok && res.aborted_before_write && ledgerBefore === ledgerAfter, res.error);
  rm(d);
}

/* ── 3. Dwa równoległe procesy migracji nie mogą pisać jednocześnie ── */
{
  const d = fresh();
  fs.writeFileSync(path.join(d, '.genome-write.lock'), JSON.stringify({ pid: process.pid, started: new Date().toISOString() }));
  const res = M.applyPlan(d, M.buildPlan(d), SIMAUTH);
  ok('3. blokada .genome-write.lock: zapis odrzucony gdy trzymana', !res.ok && /ZAPIS GENOME JUŻ TRWA/.test(res.error), res.error);
  fs.rmSync(path.join(d, '.genome-write.lock'), { force: true });
  rm(d);
}

/* ── 4. Fałszywy / wygasły approval jest odrzucany ── */
{
  const d = fresh();
  const plan = M.buildPlan(d);
  const keyFile = path.join(d, 'test-approval.key');
  fs.writeFileSync(keyFile, 'klucz-testowy-poza-repo');
  process.env.GENOME_APPROVAL_KEY_FILE = keyFile;
  delete require.cache[require.resolve('../migrate.js')];
  const M2 = require('../migrate.js');
  const good = { migration_id: M2.MIGRATION_ID, plan_hash: plan.plan_hash, nonce: plan.nonce, approved_by: 'przemek', approved_at: new Date().toISOString() };
  const sign = a => crypto.createHmac('sha256', 'klucz-testowy-poza-repo').update(M2.approvalPayload(a)).digest('hex');

  const fabricated = { ...good, signature: 'a'.repeat(64) };
  const wrongNonce = { ...good, nonce: 'deadbeef'.repeat(4) }; wrongNonce.signature = sign(wrongNonce);
  const expiredPlan = { ...plan, valid_until: new Date(Date.now() - 1000).toISOString() };
  const validSig = { ...good }; validSig.signature = sign(validSig);

  ok('4a. sfabrykowany podpis odrzucony', !M2.verifyApproval(fabricated, plan).ok, JSON.stringify(M2.verifyApproval(fabricated, plan)));
  ok('4b. zły nonce (replay) odrzucony', !M2.verifyApproval(wrongNonce, plan).ok);
  ok('4c. wygasły plan odrzucony', !M2.verifyApproval(validSig, expiredPlan).ok);
  ok('4d. poprawnie podpisana zgoda przechodzi', M2.verifyApproval(validSig, plan).ok, JSON.stringify(M2.verifyApproval(validSig, plan)));
  delete process.env.GENOME_APPROVAL_KEY_FILE;
  delete require.cache[require.resolve('../migrate.js')];
  rm(d);
}

/* ── 5. Błąd emisji dist przywraca cały stan ── */
{
  const d = fresh();
  const plan = M.buildPlan(d);
  /* psujemy build tak, by emisja się nie powiodła — po --check, na etapie pełnego builda */
  const distDir = path.join(d, 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.writeFileSync(distDir, 'to jest PLIK, nie katalog — emisja dist musi paść');
  const ledgerBefore = sha256(fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8'));
  const recBefore = sha256(fs.readFileSync(path.join(d, 'records/backtests/briefsync.md'), 'utf8'));
  const res = M.applyPlan(d, plan, SIMAUTH);
  const ledgerAfter = sha256(fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8'));
  const recAfter = sha256(fs.readFileSync(path.join(d, 'records/backtests/briefsync.md'), 'utf8'));
  ok('5. błąd emisji dist → rollback całości (Ledger i karty bez zmian)',
    !res.ok && ledgerBefore === ledgerAfter && recBefore === recAfter,
    `ok=${res.ok} ledger=${ledgerBefore === ledgerAfter} record=${recBefore === recAfter}`);
  rm(d);
}

/* ── 6. Ponowne uruchomienie migracji = bezpieczny no-op ── */
{
  const d = fresh();
  M.applyPlan(d, M.buildPlan(d), SIMAUTH);
  const plan2 = M.buildPlan(d);
  const noop = plan2.records.length === 0 && plan2.mechanisms.length === 0 && plan2.ledger.id_renames.length === 0;
  ok('6. druga migracja jest no-op (0 Recordów, 0 mechanizmów, 0 korekt ID)', noop,
    `records=${plan2.records.length} mechs=${plan2.mechanisms.length} renames=${plan2.ledger.id_renames.length}`);
  rm(d);
}

/* ── 7. Dokładnie 3 ID zmienione, 0 Eventów zmienia kolejność ── */
{
  const d = fresh();
  const plan = M.buildPlan(d);
  const before = fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  M.applyPlan(d, plan, SIMAUTH);
  const after = fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const changedIds = before.filter((e, i) => e.id !== after[i].id).length;
  /* kolejność: porównujemy sekwencję (ts, kind, on) — zmiana ID nie jest zmianą pozycji */
  const seq = a => a.map(e => `${e.ts}|${e.kind}|${e.on}`).join('\n');
  const orderKept = seq(before) === seq(after.slice(0, before.length));
  ok('7a. dokładnie 3 Eventy zmieniają ID', changedIds === 3, `zmienionych: ${changedIds}`);
  ok('7b. 0 Eventów zmienia kolejność', orderKept, 'sekwencja (ts,kind,on) musi być identyczna');
  ok('7c. dopisany wyłącznie 1 Event migracji', after.length === before.length + 1, `${before.length} → ${after.length}`);
  ok('7d. hash-chain spójny po migracji', (() => {
    let prev = 'genesis';
    for (const line of fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8').split('\n').filter(Boolean)) {
      if (JSON.parse(line).prev_hash !== prev) return false;
      prev = crypto.createHash('sha256').update(line).digest('hex').slice(0, 16);
    }
    return true;
  })());
  ok('7e. snapshot 32 Recordów z hashami before/after', (() => {
    const f = path.join(d, 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json');
    if (!fs.existsSync(f)) return false;
    const s = JSON.parse(fs.readFileSync(f, 'utf8'));
    return s.records.length === 32 && s.records.every(r => r.sha256_before && r.sha256_after && r.content_before);
  })());
  ok('7f. oryginalny Ledger zarchiwizowany z hashem zgodnym z planem', (() => {
    const arch = path.join(d, 'ledger/.archive/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl');
    return fs.existsSync(arch) && sha256(fs.readFileSync(arch, 'utf8')) === plan.ledger.original_sha256;
  })());
  rm(d);
}

/* ── 8. Drugi miesięczny plik Ledgera przechodzi po migracji ── */
{
  const d = fresh();
  M.applyPlan(d, M.buildPlan(d), SIMAUTH);
  const lf = path.join(d, 'ledger/events-2026-09.jsonl');
  const e = { id: 'evt:2026-09-01-0001', ts: '2026-09-01T08:00:00+02:00', kind: 'signal.observed', on: 'proj:briefsync', actor: 'test', provenance: 'record', note: 'nowy miesiac', prev_hash: 'genesis' };
  fs.writeFileSync(lf, JSON.stringify(e) + '\n');
  const out = checkOut(d);
  const sepErrors = out.split('\n').filter(l => l.startsWith('✗') && l.includes('2026-09'));
  ok('8. nowy miesięczny plik Ledgera NIE psuje builda (freeze per-partycja)', sepErrors.length === 0, sepErrors.join(' | '));
  rm(d);
}

/* ── 9. Bez autoryzacji nie da się wywołać warstwy zapisu bezpośrednio ── */
{
  const d = fresh();
  const before = sha256(fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8'));
  const r1 = M.applyPlan(d, M.buildPlan(d));                       // bez auth
  const r2 = M.applyPlan(d, M.buildPlan(d), { approval: { migration_id: M.MIGRATION_ID, plan_hash: 'x', nonce: 'x', approved_by: 'agent', approved_at: new Date().toISOString(), signature: 'f'.repeat(64) } });
  const after = sha256(fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8'));
  ok('9a. bezpośrednie applyPlan bez auth → odmowa na warstwie zapisu', !r1.ok && /AUTORYZACJA ODRZUCONA/.test(r1.error), r1.error);
  ok('9b. fałszywy approval w bezpośrednim wywołaniu → odmowa', !r2.ok && /AUTORYZACJA ODRZUCONA/.test(r2.error), r2.error);
  ok('9c. tryb symulacji nie działa na kanonicznym Genome', !M.applyPlan(G, M.buildPlan(G), SIMAUTH).ok, 'symulacja na kanonie musi być odrzucona');
  ok('9d. dane nietknięte po odmowach', before === after);
  rm(d);
}

/* ── 10. Dwa RZECZYWISTE procesy: wzajemna blokada ── */
{
  const d = fresh();
  const holder = `
    const { withGenomeWriteLock } = require(${JSON.stringify(path.join(G, 'lib/genome-common.js'))});
    withGenomeWriteLock(${JSON.stringify(d)}, () => { console.log('LOCKED'); require('child_process').execFileSync('sleep', ['1.5']); return { ok: true }; });
  `;
  const { spawn, execFileSync: ef } = require('child_process');
  const A = spawn('node', ['-e', holder]);
  const t0 = Date.now();
  let aOut = '';
  A.stdout.on('data', c => aOut += c);
  /* czekaj aż A trzyma blokadę */
  while (!fs.existsSync(path.join(d, '.genome-write.lock')) && Date.now() - t0 < 3000) ef('sleep', ['0.05']);
  const bTry = () => { try { return ef('node', ['-e', `
    const { withGenomeWriteLock } = require(${JSON.stringify(path.join(G, 'lib/genome-common.js'))});
    const r = withGenomeWriteLock(${JSON.stringify(d)}, () => ({ ok: true }));
    console.log(JSON.stringify(r));
  `], { encoding: 'utf8' }); } catch (e) { return (e.stdout || '') + (e.stderr || ''); } };
  const bRes = bTry();
  ok('10. dwa realne procesy: drugi proces odbija się od blokady pierwszego',
    /ZAPIS GENOME JUŻ TRWA/.test(bRes), bRes.slice(0, 200));
  A.kill();
  fs.rmSync(path.join(d, '.genome-write.lock'), { force: true });
  rm(d);
}

/* ── 11. Rollback przywraca realny plik viewera w układzie repo ── */
{
  const d = fresh();
  const vf = viewerOf(d);
  const markerBefore = fs.readFileSync(vf, 'utf8');
  /* najpierw udana migracja: viewer MA zostać nadpisany świeżym datasetem */
  const r1 = M.applyPlan(d, M.buildPlan(d), SIMAUTH);
  const afterOk = fs.readFileSync(vf, 'utf8');
  ok('11a. udana migracja aktualizuje realny plik viewera (project_mechanism w danych)',
    r1.ok && afterOk !== markerBefore && afterOk.includes('project_mechanism'), r1.error);
  rm(d);

  /* teraz wariant z wymuszonym błędem: viewer wraca do markera */
  const d2 = fresh();
  const vf2 = viewerOf(d2);
  const distDir = path.join(d2, 'dist');
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.writeFileSync(distDir, 'plik zamiast katalogu — emisja padnie');
  const r2 = M.applyPlan(d2, M.buildPlan(d2), SIMAUTH);
  const afterFail = fs.readFileSync(vf2, 'utf8');
  ok('11b. rollback przywraca realny plik viewera do stanu sprzed migracji',
    !r2.ok && afterFail.includes('MARKER-PRZED-MIGRACJA'), `ok=${r2.ok} viewer=${afterFail.slice(0, 40)}`);
  rm(d2);
}

/* ── 12. Żywa blokada starsza niż 5 minut NADAL blokuje; martwy PID = przejęcie ── */
{
  const d = fresh();
  const lock = path.join(d, '.genome-write.lock');
  /* żywy właściciel (nasz PID), mtime 10 minut wstecz */
  fs.writeFileSync(lock, JSON.stringify({ pid: process.pid, started: new Date(Date.now() - 600000).toISOString() }));
  const old = new Date(Date.now() - 600000);
  fs.utimesSync(lock, old, old);
  const r1 = M.applyPlan(d, M.buildPlan(d), SIMAUTH);
  ok('12a. żywy proces z lockiem >5 min NADAL blokuje drugiego writera',
    !r1.ok && /właściciel żyje/.test(r1.error) && /UWAGA/.test(r1.error), r1.error);
  /* martwy właściciel: PID, który na pewno nie żyje */
  fs.writeFileSync(lock, JSON.stringify({ pid: 999999, started: new Date().toISOString() }));
  const r2 = M.applyPlan(d, M.buildPlan(d), SIMAUTH);
  ok('12b. blokada martwego procesu jest przejmowana (migracja przechodzi)', r2.ok === true, r2.error);
  rm(d);
}

console.log('\n═══ TESTY MIGRACJI ═══\n');
for (const r of results) console.log(`  ${r.cond ? '✓' : '✗'} ${r.name}${r.detail ? '\n      → ' + r.detail : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
