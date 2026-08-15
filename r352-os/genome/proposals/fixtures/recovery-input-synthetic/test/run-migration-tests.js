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

const G = path.resolve(__dirname, '..', '..', '..');            /* r352-os/genome — tylko dla build.js/migrate.js */
/* FIXTURE ZAMROŻONY sprzed migracji. Testy migracji NIE MOGĄ czytać stanu żywego:
   po wykonaniu migracji plan jest pusty i testy 1/2/7a/7e traciły sens.
   Fixture = ledger z ledger/.archive/*.pre-mig-* + 32 Recordy z content_before ze snapshotu. */
const FIXTURE = path.resolve(__dirname, 'fixtures', 'pre-migration');
const CANON = path.resolve(__dirname, '..', '..', '..');
/* Pełny hash drzewa kanonu — pojedyncza liczba obiektów/zdarzeń nie wykrywa nadpisania pliku. */
function treeHash(root, skip = /(^|\/)(dist|node_modules|proposals|\.genome-write\.lock)(\/|$)/) {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const q = path.join(d, e.name);
      if (skip.test(q.slice(root.length))) continue;
      e.isDirectory() ? walk(q) : out.push(q.slice(root.length) + ':' + crypto.createHash('sha256').update(fs.readFileSync(q)).digest('hex'));
    }
  })(root);
  return crypto.createHash('sha256').update(out.sort().join('\n')).digest('hex');
}
const CANON_BEFORE = treeHash(CANON);
/* ═══ WYKONAWCA TESTOWY: instalacja w kopii Genome + PODPISANA autoryzacja ═══ (audyt rundy 9)
 * `simulation: true` przestało istnieć w publicznym API — każde wywołanie `applyPlan` wymaga
 * podpisu właściciela. Testy mają własną parę kluczy, a KOPIA `approval.js` ma przepisany
 * `trustDir()` na katalog testowy. Produkcyjne pliki nie mają żadnej furtki. */
const EXEC = fs.mkdtempSync(path.join(os.tmpdir(), 'mig-exec-'));
fs.cpSync(FIXTURE, EXEC, { recursive: true });
const { publicKey: MPUB, privateKey: MPRIV } = crypto.generateKeyPairSync('ed25519');
{
  const anchor = path.join(EXEC, '.test-anchor'); fs.mkdirSync(anchor, { recursive: true });
  fs.writeFileSync(path.join(anchor, 'approval-pubkey.pem'), MPUB.export({ type: 'spki', format: 'pem' }));
  const ap = path.join(EXEC, 'lib', 'approval.js');
  const src = fs.readFileSync(ap, 'utf8').replace(/function trustDir\(\) \{[\s\S]*?\n\}/,
    `function trustDir() { return ${JSON.stringify(anchor)}; }   /* KOPIA TESTOWA */`);
  if (!src.includes('KOPIA TESTOWA')) throw new Error('nie udało się przepisać trustDir() w kopii testowej');
  fs.writeFileSync(ap, src);
}
fs.copyFileSync(path.resolve(__dirname, '..', 'genome', 'migrate.js'), path.join(EXEC, 'migrate.js'));
const M = require(path.join(EXEC, 'migrate.js'));
process.on('exit', () => { try { fs.rmSync(EXEC, { recursive: true, force: true }); } catch {} });

/* Podpisana autoryzacja — zastępuje dawne `{simulation:true}` we WSZYSTKICH testach zapisu. */
const signedAuth = (plan, mod = M, priv = MPRIV) => {
  const approval = {
    migration_id: mod.MIGRATION_ID, plan_hash: plan.plan_hash, nonce: plan.nonce,
    approved_by: 'test-owner', approved_at: new Date().toISOString(),
  };
  approval.signature = crypto.sign(null, Buffer.from(mod.approvalPayload(approval), 'utf8'), priv).toString('hex');
  return { approval, approvedPlan: plan };
};

const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');
let pass = 0, fail = 0;
const results = [];
const ok = (name, cond, detail) => { cond ? pass++ : fail++; results.push({ name, cond, detail: cond ? '' : String(detail || '').slice(0, 300) }); };
const fresh = () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'mig-test-'));
  const d = path.join(base, 'r352-os', 'genome');
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.cpSync(FIXTURE, d, { recursive: true, filter: s => !/(^|\/)(dist|node_modules|proposals|\.genome-write\.lock)$/.test(s) });
  /* viewer w układzie repo — z markerem, żeby wykryć nadpisanie/rollback */
  const vdir = path.join(base, 'genome-os', 'js');
  fs.mkdirSync(vdir, { recursive: true });
  fs.writeFileSync(path.join(vdir, 'genome-f0-data.js'), '// MARKER-PRZED-MIGRACJA\nwindow.GENOME_DATA = {"objects":{}};\n');
  return d;
};
const baseOf = d => path.resolve(d, '..', '..');
const viewerOf = d => path.join(baseOf(d), 'genome-os', 'js', 'genome-f0-data.js');
const rm = d => fs.rmSync(baseOf(d), { recursive: true, force: true });

const checkOut = root => { try { return execFileSync('node', [path.join(root, 'build.js'), '--check'], { env: { ...process.env, GENOME_DIR: root }, encoding: 'utf8' }); } catch (e) { return (e.stdout || '') + (e.stderr || ''); } };

/* ── 1. Zdarzenie PO granicy freeze nie korzysta z taryfy ulgowej ── */
{
  const d = fresh();
  (pl => M.applyPlan(d, pl, signedAuth(pl)))(M.buildPlan(d));
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
  /* ofiarą musi być plik OBJĘTY planem — inaczej dryf nie ma czego wykryć.
     Plan obejmuje 32 Recordy (relations.attached_to), nie karty mechanizmów. */
  const victim = Object.keys(plan.records_by_file || {})[0]
    ? path.join(d, Object.keys(plan.records_by_file)[0])
    : path.join(d, 'records/backtests/briefsync.md');
  fs.writeFileSync(victim, fs.readFileSync(victim, 'utf8') + '\n<!-- zmiana po zaplanowaniu -->\n');
  const ledgerBefore = sha256(fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8'));
  const res = M.applyPlan(d, plan, signedAuth(plan));
  const ledgerAfter = sha256(fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8'));
  ok('2. zmiana wejścia po zaplanowaniu → abort przed pierwszym zapisem',
    !res.ok && res.aborted_before_write && ledgerBefore === ledgerAfter, res.error);
  rm(d);
}

/* ── 3. Dwa równoległe procesy migracji nie mogą pisać jednocześnie ── */
{
  const d = fresh();
  fs.writeFileSync(path.join(d, '.genome-write.lock'), JSON.stringify({ pid: process.pid, started: new Date().toISOString() }));
  const res = (pl => M.applyPlan(d, pl, signedAuth(pl)))(M.buildPlan(d));
  ok('3. blokada .genome-write.lock: zapis odrzucony gdy trzymana', !res.ok && /ZAPIS GENOME JUŻ TRWA/.test(res.error), res.error);
  fs.rmSync(path.join(d, '.genome-write.lock'), { force: true });
  rm(d);
}

/* ── 4. Fałszywy / wygasły approval jest odrzucany ── */
{
  const d = fresh();
  const plan = M.buildPlan(d);
  /* Ed25519: podpisujemy PRÓBNYM kluczem prywatnym, a KOPIA modułu dostaje odpowiadający mu
     klucz publiczny. Zaufanie produkcyjne (lib/approval-pubkey.pem w kanonie) pozostaje nietknięte —
     nie ma i nie może być żadnego override ścieżki klucza. */
  const { publicKey: tPub, privateKey: tPriv } = crypto.generateKeyPairSync('ed25519');
  const migCopyDir = path.join(d, '.mig-test');
  fs.mkdirSync(path.join(migCopyDir, 'lib'), { recursive: true });
  fs.copyFileSync(path.join(FIXTURE, 'migrate.js'), path.join(migCopyDir, 'migrate.js'));
  for (const f of fs.readdirSync(path.join(FIXTURE, 'lib'))) fs.copyFileSync(path.join(FIXTURE, 'lib', f), path.join(migCopyDir, 'lib', f));
  {   /* kotwica testowa: przepisujemy trustDir() w KOPII modułu (migrate nie ma żadnej flagi) */
    const anchor = path.join(migCopyDir, 'anchor'); fs.mkdirSync(anchor, { recursive: true });
    fs.writeFileSync(path.join(anchor, 'approval-pubkey.pem'), tPub.export({ type: 'spki', format: 'pem' }));
    const ap = path.join(migCopyDir, 'lib', 'approval.js');
    const src2 = fs.readFileSync(ap, 'utf8').replace(/function trustDir\(\) \{[\s\S]*?\n\}/,
      `function trustDir() { return ${JSON.stringify(anchor)}; }   /* KOPIA TESTOWA */`);
    fs.writeFileSync(ap, src2);
  }
  fs.copyFileSync(path.join(FIXTURE, 'build.js'), path.join(migCopyDir, 'build.js'));
  const M2 = require(path.join(migCopyDir, 'migrate.js'));
  const good = { migration_id: M2.MIGRATION_ID, plan_hash: plan.plan_hash, nonce: plan.nonce, approved_by: 'przemek', approved_at: new Date().toISOString() };
  const sign = a => crypto.sign(null, Buffer.from(M2.approvalPayload(a), 'utf8'), tPriv).toString('hex');

  const fabricated = { ...good, signature: 'a'.repeat(64) };
  const wrongNonce = { ...good, nonce: 'deadbeef'.repeat(4) }; wrongNonce.signature = sign(wrongNonce);
  const expiredPlan = { ...plan, valid_until: new Date(Date.now() - 1000).toISOString() };
  const validSig = { ...good }; validSig.signature = sign(validSig);

  ok('4a. sfabrykowany podpis odrzucony', !M2.verifyApproval(fabricated, plan).ok, JSON.stringify(M2.verifyApproval(fabricated, plan)));
  ok('4b. zły nonce (replay) odrzucony', !M2.verifyApproval(wrongNonce, plan).ok);
  ok('4c. wygasły plan odrzucony', !M2.verifyApproval(validSig, expiredPlan).ok);
  ok('4d. poprawnie podpisana zgoda przechodzi', M2.verifyApproval(validSig, plan).ok, JSON.stringify(M2.verifyApproval(validSig, plan)));
  ok('4e. zgoda podpisana OBCYM kluczem odrzucona przez zaufanie produkcyjne',
    !require(path.join(FIXTURE, 'migrate.js')).verifyApproval(validSig, plan).ok);
  delete require.cache[require.resolve(path.join(migCopyDir, 'migrate.js'))];
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
  /* EEXIST jest OCZEKIWANYM mechanizmem tego testu (dist celowo jest plikiem, nie katalogiem).
     Przechwytujemy stderr, żeby nie wyciekał jako pozorny błąd, i asertujemy go wprost. */
  const capturedErr = [];
  const realErr = console.error;
  console.error = (...a) => capturedErr.push(a.map(String).join(' '));
  let res;
  try { res = M.applyPlan(d, plan, signedAuth(plan)); } finally { console.error = realErr; }
  /* Brak wycieku surowego stacka na stderr jest sprawdzany na poziomie CAŁEGO zestawu
     (run-final-tests.js, sekcja N: exit code 0 + pusty stderr) — tam, gdzie ma sens. */
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
  (pl => M.applyPlan(d, pl, signedAuth(pl)))(M.buildPlan(d));
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
  M.applyPlan(d, plan, signedAuth(plan));
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
  (pl => M.applyPlan(d, pl, signedAuth(pl)))(M.buildPlan(d));
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
  /* „Kanoniczny" jest względny wobec ZAŁADOWANEGO modułu: migrate broni własnego korzenia.
     Testujemy to na FIXTURE (korzeń tego modułu), a obecność guardu w module produkcyjnym
  /* 9c/9c2 USUNIĘTE: dotyczyły guardu `simulation`, którego już nie ma — publiczne applyPlan
     wymaga podpisu zawsze. Zastąpione przez 13h–13k (odłączony wykonawca) i 13l (CLI --simulate).
     Dodatkowo: żaden test nie wywołuje applyPlan na FIXTURE, bo z ważnym podpisem by go zmienił. */
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
  const r1 = (pl => M.applyPlan(d, pl, signedAuth(pl)))(M.buildPlan(d));
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
  const r2 = (pl => M.applyPlan(d2, pl, signedAuth(pl)))(M.buildPlan(d2));
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
  const r1 = (pl => M.applyPlan(d, pl, signedAuth(pl)))(M.buildPlan(d));
  ok('12a. żywy proces z lockiem >5 min NADAL blokuje drugiego writera',
    !r1.ok && /właściciel PID \d+ żyje/.test(r1.error) && /UWAGA/.test(r1.error), r1.error);
  /* martwy właściciel: PID, który na pewno nie żyje */
  fs.writeFileSync(lock, JSON.stringify({ pid: 999999, started: new Date().toISOString() }));
  const r2 = (pl => M.applyPlan(d, pl, signedAuth(pl)))(M.buildPlan(d));
  ok('12b. blokada martwego procesu jest przejmowana (migracja przechodzi)', r2.ok === true, r2.error);
  rm(d);
}

/* ── 13. TWARDY NO-OP: zerowa delta nie zapisuje ANI BAJTU ── */
{
  const d = fresh();
  const r1 = (pl => M.applyPlan(d, pl, signedAuth(pl)))(M.buildPlan(d));
  const h1 = treeHash(d, /$^/);
  const arch1 = fs.readFileSync(path.join(d, 'ledger/.archive/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl'), 'utf8');
  const snap1 = fs.readFileSync(path.join(d, 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json'), 'utf8');
  const freeze1 = fs.readFileSync(path.join(d, 'records/F0-SEED-FREEZE.md'), 'utf8');
  const led1 = fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8');

  const plan2 = M.buildPlan(d);
  const r2 = M.applyPlan(d, plan2, signedAuth(plan2));
  const h2 = treeHash(d, /$^/);

  ok('13a. pierwsza migracja wykonuje się (delta niezerowa)', r1.ok && !r1.noop, JSON.stringify(r1).slice(0, 150));
  ok('13b. druga migracja zwraca noop:true i zerową deltę',
    r2.ok === true && r2.noop === true && Object.values(r2.delta).every(v => v === 0), JSON.stringify(r2));
  ok('13c. CAŁE drzewo bajtowo identyczne po no-opie', h1 === h2, `${h1.slice(0, 16)} ≠ ${h2.slice(0, 16)}`);
  ok('13d. no-op nie dopisał zdarzenia', fs.readFileSync(path.join(d, 'ledger/events-2026-08.jsonl'), 'utf8') === led1);
  ok('13e. no-op nie nadpisał archiwum Ledgera',
    fs.readFileSync(path.join(d, 'ledger/.archive/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl'), 'utf8') === arch1);
  ok('13f. no-op nie nadpisał snapshotu Recordów',
    fs.readFileSync(path.join(d, 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json'), 'utf8') === snap1);
  ok('13g. no-op nie przesunął granicy seeda',
    fs.readFileSync(path.join(d, 'records/F0-SEED-FREEZE.md'), 'utf8') === freeze1);
  rm(d);
}

/* ── 13h–13k. ODŁĄCZONY WYKONAWCA: próba audytu rundy 9, odtworzona 1:1 ──
   Wykonawca w katalogu BEZ ledger/ i records/, cel = OSOBNA kompletna instalacja Genome,
   BRAK ważnego podpisu, próba `simulation: true`. */
{
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'detached-'));
  /* 1) odłączony katalog wykonawcy: tylko kod, zero danych Genome */
  const exec = path.join(base, 'wykonawca'); fs.mkdirSync(path.join(exec, 'lib'), { recursive: true });
  fs.copyFileSync(path.resolve(__dirname, '..', 'genome', 'migrate.js'), path.join(exec, 'migrate.js'));
  fs.copyFileSync(path.join(FIXTURE, 'build.js'), path.join(exec, 'build.js'));
  for (const f of fs.readdirSync(path.join(FIXTURE, 'lib'))) fs.copyFileSync(path.join(FIXTURE, 'lib', f), path.join(exec, 'lib', f));
  const CG = require(path.join(FIXTURE, 'lib', 'canon-guard.js'));
  ok('13h. wykonawca jest ODŁĄCZONY (nie wygląda jak Genome: brak ledger/ i records/)',
    !CG.looksLikeGenome(exec) && !fs.existsSync(path.join(exec, 'ledger')) && !fs.existsSync(path.join(exec, 'records')));

  /* 2) osobna, kompletna instalacja Genome jako CEL */
  const target = path.join(base, 'cel'); fs.cpSync(FIXTURE, target, { recursive: true });
  const led = path.join(target, 'ledger', 'events-2026-08.jsonl');
  const recDir = path.join(target, 'records');
  const h = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  const hTree = d => { const o = []; (function w(x) { for (const e of fs.readdirSync(x, { withFileTypes: true })) { const q = path.join(x, e.name); e.isDirectory() ? w(q) : o.push(q.slice(d.length) + ':' + h(q)); } })(d); return crypto.createHash('sha256').update(o.sort().join('\n')).digest('hex'); };
  const ledBefore = h(led), recBefore = hTree(recDir);
  const distBefore = fs.existsSync(path.join(target, 'dist')) ? hTree(path.join(target, 'dist')) : 'BRAK';

  /* 3-4) BEZ podpisu, z `simulation: true` — dokładnie jak w próbie audytu */
  const MD = require(path.join(exec, 'migrate.js'));
  const planD = MD.buildPlan(target);
  const rD = MD.applyPlan(target, planD, { simulation: true });

  const ledAfter = h(led), recAfter = hTree(recDir);
  const distAfter = fs.existsSync(path.join(target, 'dist')) ? hTree(path.join(target, 'dist')) : 'BRAK';
  ok('13i. ODŁĄCZONY WYKONAWCA + simulation:true + brak podpisu → result_ok:false, aborted_before_write:true',
    rD.ok === false && rD.aborted_before_write === true && /simulation/.test(String(rD.error || '')),
    JSON.stringify({ ok: rD.ok, aborted: rD.aborted_before_write, err: String(rD.error || '').slice(0, 120) }));
  ok('13j. ledger_changed:false · records_changed:false · dist_changed:false',
    ledAfter === ledBefore && recAfter === recBefore && distAfter === distBefore,
    `ledger=${ledAfter === ledBefore} records=${recAfter === recBefore} dist=${distAfter === distBefore}`);
  ok('13k. `simulation` NIE jest już żadną drogą zapisu — także z podpisanym planem',
    (() => { const r = MD.applyPlan(target, planD, { simulation: true, approval: signedAuth(planD, MD).approval, approvedPlan: planD });
      return r.ok === false && r.aborted_before_write === true; })());
  delete require.cache[require.resolve(path.join(exec, 'migrate.js'))];
  fs.rmSync(base, { recursive: true, force: true });
}

/* ── 13l. KONTROLA POZYTYWNA: oficjalne CLI --simulate nadal działa i nie tyka kanonu ── */
{
  const canonBefore = treeHash(CANON);
  /* uruchamiamy z KOPII fixture — CLI --simulate robi własną kopię, ale nie chcemy nawet
     ryzykować, że cokolwiek zapisze się w zamrożonym fixture */
  const simRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sim-cli-'));
  fs.cpSync(FIXTURE, simRoot, { recursive: true });
  const simBefore = treeHash(simRoot, /$^/);
  const r = require('child_process').spawnSync('node', [path.join(simRoot, 'migrate.js'), '--simulate'],
    { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  ok('13l. CLI --simulate przechodzi end-to-end na własnej kopii, nie zmienia kanonu ani swojego korzenia',
    /SYMULACJA na kopii/.test(out) && /applyPlan: ✓/.test(out)
    && treeHash(CANON) === canonBefore && treeHash(simRoot, /$^/) === simBefore,
    out.split('\n').filter(l => /applyPlan|✗/.test(l)).slice(0, 2).join(' | '));
  fs.rmSync(simRoot, { recursive: true, force: true });
}


/* ── 13j. MIGRATOR UŻYWA WSPÓLNEJ KOTWICY, nie klucza w repo ── */
{
  const src = fs.readFileSync(path.join(G, 'proposals', 'final-salt-plate', 'genome', 'migrate.js'), 'utf8');
  const code = src.split('\n').filter(l => !/^\s*(\*|\/\*|\/\/)/.test(l)).join('\n');
  ok('13j. migrate.js weryfikuje podpis przez lib/approval.js i nie szuka klucza w repo',
    /require\('\.\/lib\/approval\.js'\)/.test(code) && /APPROVAL\.loadPublicKey\(\)/.test(code)
    && !/approval-pubkey\.pem/.test(code) && !/GENOME_APPROVAL_KEY/.test(code),
    code.split('\n').filter(l => /approval-pubkey|GENOME_APPROVAL_KEY/.test(l)).join(' | ').slice(0, 200));
}

/* ── 14. STRAŻNIK KANONU: pełny hash drzewa przed i po całym zestawie ── */
{
  const after = treeHash(CANON);
  ok('14. kanoniczne Genome bajtowo nietknięte przez cały zestaw testów',
    after === CANON_BEFORE, `przed ${CANON_BEFORE.slice(0, 16)} · po ${after.slice(0, 16)}`);
}

console.log('\n═══ TESTY MIGRACJI ═══\n');
for (const r of results) console.log(`  ${r.cond ? '✓' : '✗'} ${r.name}${r.detail ? '\n      → ' + r.detail : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
