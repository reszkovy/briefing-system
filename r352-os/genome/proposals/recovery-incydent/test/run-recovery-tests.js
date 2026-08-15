#!/usr/bin/env node
/* ═══ PRÓBA A — RECOVERY: sukces oraz rollback po awarii KAŻDEGO kroku ═══
 * Każdy przebieg na świeżej kopii kanonu w katalogu tymczasowym. Kanon nietknięty.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');

const HERE = __dirname;
const REC = path.resolve(HERE, '..');
const LIB = path.resolve(REC, '..', 'final-salt-plate', 'lib');
const CANON = path.resolve(REC, '..', '..');
const A = require(path.join(LIB, 'approval.js'));
const { treeHash } = require(path.join(LIB, 'genome-txn.js'));

let pass = 0, fail = 0; const res = [];
const ok = (n, c, d) => { c ? pass++ : fail++; res.push({ n, c, d: c ? '' : String(d || '').slice(0, 260) }); };
const sha = f => fs.existsSync(f) ? crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') : null;

const STEPS = ['preconditions', 'artefakty', 'archiwum', 'snapshot', 'freeze', 'record', 'ledger', 'build'];
const REL = {
  archive: 'ledger/.archive/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl',
  snapshot: 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json',
  freeze: 'records/F0-SEED-FREEZE.md',
  ledger: 'ledger/events-2026-08.jsonl',
  nonces: '.approval-nonces.jsonl',
};

/* ── KOTWICA ZAUFANIA W TESTACH ──
   Wykonawcy czytają klucz publiczny WYŁĄCZNIE z ~/.genome/approval-pubkey.pem i nie mają żadnego
   override na poziomie aplikacji. Testy izolują więc HOME procesu potomnego (standardowa izolacja
   środowiska, nie furtka w kodzie): proces z innym HOME to po prostu inny „właściciel".
   Kto potrafi ustawić HOME writerowi, ten i tak kontroluje konto — to ta sama granica zaufania. ── */
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-recovery-test-'));
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
const testPub = publicKey.export({ type: 'spki', format: 'pem' });


const bundleRaw = JSON.parse(fs.readFileSync(path.join(REC, 'recovery-bundle.json'), 'utf8'));
/* PEŁNE domknięcie runtime — to samo, co RECOVERY_MANIFEST w recover.js */
const R_MANIFEST = ['recover.js',
  '../final-salt-plate/lib/approval.js', '../final-salt-plate/lib/genome-txn.js',
  '../final-salt-plate/lib/genome-common.js', '../final-salt-plate/lib/canon-guard.js',
  'przywracane/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl',
  'przywracane/mig-2026-08-evidence-contract-v1-records.json'];
function artifactHashes(base, files) {
  const h = {};
  for (const f of files) h[f] = crypto.createHash('sha256').update(fs.readFileSync(path.join(base, f))).digest('hex');
  return h;
}
function signedBundleFor(nonce, artOverride) {
  const b = JSON.parse(JSON.stringify(bundleRaw));
  b.approval.package.schema_version = A.SCHEMA_VERSION;
  b.approval.package.nonce = nonce;
  b.approval.nonce = nonce;
  b.approval.package.artifact_hashes = artOverride || artifactHashes(path.dirname(REC_OK), R_MANIFEST);
  b.approval.package.payload_hash = A.payloadHash({ events: b.events, evidence: b.evidence, objects: b.objects });
  b.approval.signature = crypto.sign(null, A.signingBytes(b.approval.package), privateKey).toString('hex');
  return b;
}

function snapshotState(root) {
  return {
    tree: treeHash(root),
    archive: sha(path.join(root, REL.archive)),
    snapshot: sha(path.join(root, REL.snapshot)),
    freeze: sha(path.join(root, REL.freeze)),
    ledger: sha(path.join(root, REL.ledger)),
    nonces: sha(path.join(root, REL.nonces)),
    skills: fs.existsSync(path.join(root, '..', '..', '.claude', 'skills')) ? 'n/d' : 'n/d',
  };
}
/* Cel testów pochodzi z ZAMROŻONEGO fixture'u stanu sprzed recovery, nie z żywego kanonu.
   Poprzednia wersja robiła `cp -R <kanon>`; działało tylko dopóki kanon czekał na naprawę.
   W chwili wykonania recovery preconditions przestały pasować i zestaw spadł na 56/12 —
   kod był w porządku, testy pytały świat o stan, który już minął.
   Fixture jest SYNTETYCZNY: dane sprzed recovery + kod i karty w wersji dzisiejszej.
   Weryfikacja: `node proposals/fixtures/fixture-recovery-input.js` (domyślnie --check). */
const FIXTURE = path.resolve(__dirname, '..', '..', 'fixtures', 'recovery-input-synthetic');
if (!fs.existsSync(FIXTURE)) {
  console.error('✗ brak fixture\'u ' + FIXTURE + '\n  odbuduj świadomie: node proposals/fixtures/fixture-recovery-input.js --regenerate');
  process.exit(2);
}
function freshCopy() {
  const d = fs.mkdtempSync(path.join(tmpRoot, 'g-'));
  const g = path.join(d, 'genome');
  fs.cpSync(FIXTURE, g, { recursive: true });
  fs.rmSync(path.join(g, 'proposals'), { recursive: true, force: true });
  fs.rmSync(path.join(g, 'dist'), { recursive: true, force: true });
  return g;
}


/* ═══ TESTOWY WYKONAWCA — kopia modułów z podmienioną KOTWICĄ ═══
 * Produkcyjne `recover.js`, `deploy.js`, `ingest.js` i `migrate.js` nie mają już ŻADNEJ flagi
 * ani zmiennej, którą dałoby się podstawić zaufanie (`--trust` usunięte: był omijalny przez
 * TMPDIR i przez symlink `r352-os/genome` → kanon). Testy budują więc WŁASNĄ kopię drzewa
 * modułów i w NIEJ przepisują `trustDir()` na katalog testowy. Kopia nie jest w manifeście
 * produkcyjnym — nic z niej nie trafia do kanonu. */
/* Wykonawca kopiowany DO kopii Genome: jego instalacją staje się ta kopia, więc `--apply`
   bez `--target` pisze dokładnie tam — tak jak w produkcji pisze do kanonu. */
function installInto(genomeCopy, pubPem, srcProposals) {
  const dir = path.join(genomeCopy, 'proposals');
  fs.cpSync(srcProposals, dir, { recursive: true });
  const anchor = path.join(dir, '.test-anchor');
  fs.mkdirSync(anchor, { recursive: true });
  fs.writeFileSync(path.join(anchor, 'approval-pubkey.pem'), pubPem);
  const ap = path.join(dir, 'final-salt-plate', 'lib', 'approval.js');
  let src = fs.readFileSync(ap, 'utf8');
  src = src.replace(
    /function trustDir\(\) \{[\s\S]*?\n\}/,
    `function trustDir() { return ${JSON.stringify(anchor)}; }   /* KOPIA TESTOWA */`);
  if (!src.includes('KOPIA TESTOWA')) throw new Error('nie udało się podmienić trustDir() w kopii testowej');
  fs.writeFileSync(ap, src);
  return { dir, anchor, recover: path.join(dir, 'recovery-incydent', 'recover.js'), deploy: path.join(dir, 'final-salt-plate', 'deploy.js') };
}
function makeTestTree(tmpBase, pubPem, srcProposals) {
  const genomeCopy = freshCopy();
  return { ...installInto(genomeCopy, pubPem, srcProposals), genome: genomeCopy };
}
const PROPOSALS_SRC = path.resolve(REC, '..');
const TREE_OK = makeTestTree(tmpRoot, testPub, PROPOSALS_SRC);
const TREE_FOREIGN = makeTestTree(tmpRoot, crypto.generateKeyPairSync('ed25519').publicKey.export({ type: 'spki', format: 'pem' }), PROPOSALS_SRC);
const REC_OK = TREE_OK.recover;

/* `--apply` NIE przyjmuje `--target`: wykonawcę instalujemy w kopii i uruchamiamy „u siebie". */
/* Pakiet podpisujemy PO instalacji: instalacja ma przepisany `approval.js` (kotwica testowa),
   a `artifact_hashes` muszą odpowiadać RUNTIME, który realnie się wykona. */
function runRecoverInstalled(genomeCopy, bundle, extra = [], pubPem = testPub) {
  const inst = installInto(genomeCopy, pubPem, PROPOSALS_SRC);
  const recDir = path.dirname(inst.recover);
  const bp = typeof bundle === 'function' ? bundle(recDir)
    : (() => { const f = path.join(tmpRoot, `b-${Math.random().toString(36).slice(2)}.json`);
        const b = JSON.parse(fs.readFileSync(bundle, 'utf8'));
        b.approval.package.artifact_hashes = artifactHashes(recDir, R_MANIFEST);
        b.approval.package.payload_hash = A.payloadHash({ events: b.events, evidence: b.evidence, objects: b.objects });
        b.approval.signature = crypto.sign(null, A.signingBytes(b.approval.package), privateKey).toString('hex');
        fs.writeFileSync(f, JSON.stringify(b)); return f; })();
  const r = spawnSync('node', [inst.recover, '--apply', '--bundle', bp, ...extra], { encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || ''), signal: r.signal, exe: inst.recover, tree: inst.dir };
}
function runRecover(target, bundlePath, extra = [], exe = null) {
  return runRecoverInstalled(target, bundlePath, extra);
}

const CANON_BEFORE = treeHash(CANON);
fs.writeFileSync(path.join(tmpRoot, 'pub.pem'), testPub);


try {
  /* ── A0. bez podpisu --apply jest odrzucone ── */
  {
    const g = freshCopy(); const s0 = snapshotState(g);
    const bp = path.join(tmpRoot, 'unsigned.json');
    const b = JSON.parse(JSON.stringify(bundleRaw)); b.approval.signature = null;
    fs.writeFileSync(bp, JSON.stringify(b));
    const r = runRecoverInstalled(g, () => bp);   /* factory: pakiet idzie DOKŁADNIE taki, jaki jest */
    ok('A0a. --apply bez podpisu Ed25519 → odmowa', r.code === 3 && /nie ma ważnego podpisu/.test(r.out), r.out.slice(-300));
    ok('A0b. odmowa nie zmieniła ani bajtu', JSON.stringify(snapshotState(g)) === JSON.stringify(s0));
  }

  /* ── A0'. podpis obcym kluczem (klucz produkcyjny ≠ testowy) ── */
  {
    const g = freshCopy(); const s0 = snapshotState(g);
    const bp = path.join(tmpRoot, 'foreign.json');
    fs.writeFileSync(bp, JSON.stringify(signedBundleFor('foreign-1')));
    /* kotwica ma OBCY klucz publiczny — podpis naszym kluczem próbnym musi odpaść */
    const r = runRecoverInstalled(g, bp, [], crypto.generateKeyPairSync('ed25519').publicKey.export({ type: 'spki', format: 'pem' }));
    ok('A0c. podpis odrzucony, gdy kotwica zaufania ma inny klucz publiczny',
      r.code === 3 && /nie pasuje do pakietu|nie ma ważnego podpisu/.test(r.out), r.out.slice(-260));
    ok('A0d. odrzucenie nie zmieniło ani bajtu', JSON.stringify(snapshotState(g)) === JSON.stringify(s0));
  }

  /* ── A1. SUKCES ── */
  const runRecoverTestKey = (target, bundlePath, extra = []) => runRecover(target, bundlePath, extra);
  ok('A1a. w repo NIE MA klucza publicznego — kotwica zaufania leży poza repozytorium',
    !fs.existsSync(path.join(LIB, 'approval-pubkey.pem')) && /\.genome[\\/]approval-pubkey\.pem$/.test(A.PUBKEY_FILE),
    A.PUBKEY_FILE);

  {
    const g = freshCopy();
    const bp = path.join(tmpRoot, 'signed-ok.json');
    fs.writeFileSync(bp, JSON.stringify(signedBundleFor('recovery-success-1')));
    const r = runRecoverTestKey(g, bp);
    const st = snapshotState(g);
    ok('A1b. RECOVERY SUKCES: wszystkie 8 kroków + build 0 błędów',
      r.code === 0 && /RECOVERY WYKONANE/.test(r.out) && /0 błędów/.test(r.out), r.out.slice(-400));
    ok('A1c. archiwum przywrócone (179 linii, wymagany sha256)',
      st.archive === '4806dd3da1a8b4d3c54fa60d3b93e8785fb8f17c587e6973b55ab3f5295281c3'
      && fs.readFileSync(path.join(g, REL.archive), 'utf8').split('\n').filter(Boolean).length === 179, st.archive);
    const snap = JSON.parse(fs.readFileSync(path.join(g, REL.snapshot), 'utf8'));
    ok('A1d. snapshot: 32 Recordy, recovered: true, źródła zapisane',
      snap.records.length === 32 && snap.recovered === true && !!snap.recovery_sources, `records=${snap.records.length}`);
    const fz = fs.readFileSync(path.join(g, REL.freeze), 'utf8');
    ok('A1e. freeze: 179 / 4f96034058f4c5fa',
      /seed_event_count: 179/.test(fz) && /seed_tail_hash: "4f96034058f4c5fa"/.test(fz));
    ok('A1f. Record incydentu utworzony', fs.existsSync(path.join(g, 'records/incydenty/2026-08-09-test-zapisal-do-kanonu.md')));
    ok('A1g. artefakty uszkodzone zachowane z hashami',
      ['USZKODZONE-archiwum-ledgera.jsonl', 'USZKODZONY-snapshot-recordow.json', 'USZKODZONA-karta-freeze.md.txt', 'HASHE.json']
        .every(f => fs.existsSync(path.join(g, 'records/incydenty/2026-08-09-artefakty', f))));
    const led = fs.readFileSync(path.join(g, REL.ledger), 'utf8').split('\n').filter(Boolean);
    ok('A1h. zdarzenia 0226/0227 POZOSTAŁY (append-only), dopisano 2 nowe',
      led.length === 208 && led.some(l => l.includes('evt:2026-08-09-0226')) && led.some(l => l.includes('evt:2026-08-09-0227')), `linii=${led.length}`);
    ok('A1i. nonce zużyty w rejestrze', fs.existsSync(path.join(g, REL.nonces)) && fs.readFileSync(path.join(g, REL.nonces), 'utf8').includes('recovery-success-1'));
    /* powtórzenie recovery: preconditions już nie zachodzą (archiwum przywrócone), więc abort
       następuje WCZEŚNIEJ niż bramka nonce — i to jest poprawne. Sprawdzamy oba fakty osobno. */
    const stAfter = snapshotState(g);
    const r2 = runRecoverTestKey(g, bp);
    ok('A1j. powtórzenie recovery odrzucone (preconditions już nie zachodzą) i nic nie zmienia',
      r2.code !== 0 && /preconditions/.test(r2.out) && JSON.stringify(snapshotState(g)) === JSON.stringify(stAfter), r2.out.slice(-260));
    /* bramka replay sprawdzona osobno: świeża kopia + nonce już zużyty w rejestrze */
    const g3 = freshCopy();
    fs.writeFileSync(path.join(g3, REL.nonces), JSON.stringify({ nonce: 'replay-probe-1', consumed_at: '2026-08-09T00:00:00Z', approved_by: 'przemek' }) + '\n');
    const st3 = snapshotState(g3);
    const bp3 = path.join(tmpRoot, 'replay.json');
    fs.writeFileSync(bp3, JSON.stringify(signedBundleFor('replay-probe-1')));
    const r3 = runRecoverTestKey(g3, bp3);
    ok('A1k. ten sam nonce użyty drugi raz → odmowa i pełny rollback',
      r3.code !== 0 && /nonce/i.test(r3.out) && JSON.stringify(snapshotState(g3)) === JSON.stringify(st3), r3.out.slice(-260));
  }

  /* ── A2. ROLLBACK po awarii KAŻDEGO kroku ── */
  for (const step of STEPS) {
    const g = freshCopy();
    const before = snapshotState(g);
    const bp = path.join(tmpRoot, `fail-${step}.json`);
    fs.writeFileSync(bp, JSON.stringify(signedBundleFor('rollback-' + step)));
    const r = runRecoverTestKey(g, bp, ['--fail-after', step]);
    const after = snapshotState(g);
    const identical = JSON.stringify(before) === JSON.stringify(after);
    ok(`A2.${step} — awaria po kroku "${step}" → pełny rollback, drzewo bajtowo identyczne`,
      r.code !== 0 && identical,
      identical ? `exit=${r.code} (oczekiwano ≠0)` : Object.keys(before).filter(k => before[k] !== after[k]).map(k => `${k} ZMIENIONE`).join(', '));
  }

  /* ── A3. dryf preconditions = abort przed zapisem ── */
  {
    const g = freshCopy();
    fs.appendFileSync(path.join(g, REL.archive), '{"podmienione":true}\n');
    const before = snapshotState(g);
    const bp = path.join(tmpRoot, 'drift.json');
    fs.writeFileSync(bp, JSON.stringify(signedBundleFor('drift-1')));
    const r = runRecoverTestKey(g, bp);
    ok('A3. dryf hashu wejściowego → abort przed jakimkolwiek zapisem',
      r.code !== 0 && /preconditions/.test(r.out) && JSON.stringify(snapshotState(g)) === JSON.stringify(before), r.out.slice(-260));
  }


  /* ── A5. ARTEFAKTY: mutacja pliku po podpisie odrzucona PRZED zapisem ── */
  for (const f of R_MANIFEST) {
    const g = freshCopy(); const before = snapshotState(g);
    const journalBefore = fs.existsSync(path.join(g, '.genome-txn'));
    const inst = installInto(g, testPub, PROPOSALS_SRC);
    const recCopy = path.dirname(inst.recover);
    const bp = path.join(tmpRoot, `art-${path.basename(f)}.json`);
    fs.writeFileSync(bp, JSON.stringify(signedBundleFor('art-' + path.basename(f), artifactHashes(recCopy, R_MANIFEST))));
    fs.appendFileSync(path.join(recCopy, f),
      /\.js$/.test(f) ? '\n// DOPISANE PO PODPISIE\n' : '\nDOPISANE PO PODPISIE\n');   /* mutacja po podpisie */
    const r = spawnSync('node', [inst.recover, '--apply', '--bundle', bp], { encoding: 'utf8' });
    const out5 = (r.stdout || '') + (r.stderr || '');
    ok(`A5.${f} — mutacja runtime po podpisie: odmowa, zero zapisu, zero dziennika`,
      r.status !== 0 && /NIEZGODNE|sha256|ODRZUCONE/.test(out5)
      && !/RECOVERY WYKONANE|preconditions:/.test(out5)                    /* write_started: false */
      && JSON.stringify(snapshotState(g)) === JSON.stringify(before)       /* ledger/snapshot/archive bez zmian */
      && fs.existsSync(path.join(g, '.genome-txn')) === journalBefore,     /* journal_created: false */
      out5.slice(-220));
  }

  /* ── A6. PODMIENIONY SNAPSHOT (kształt zachowany) odrzucony ── */
  {
    const g = freshCopy(); const before = snapshotState(g);
    const inst = installInto(g, testPub, PROPOSALS_SRC);
    const recCopy = path.dirname(inst.recover);
    const snapPath = path.join(recCopy, 'przywracane', 'mig-2026-08-evidence-contract-v1-records.json');
    const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
    snap.records[0].content_before += '\nOBCA ZAWARTOSC\n';     /* kształt bez zmian: recovered:true, 32 rekordy */
    fs.writeFileSync(snapPath, JSON.stringify(snap, null, 1));
    const bp = path.join(tmpRoot, 'snap-mut.json');
    fs.writeFileSync(bp, JSON.stringify(signedBundleFor('snap-mut', artifactHashes(REC, R_MANIFEST))));   /* hashe z ORYGINAŁU */
    const r = spawnSync('node', [inst.recover, '--apply', '--bundle', bp], { encoding: 'utf8' });
    const out = (r.stdout || '') + (r.stderr || '');
    ok('A6a. podmieniony snapshot (kształt zachowany) odrzucony przez hash', r.status !== 0 && /sha256|NIEZGODNE/.test(out), out.slice(-240));
    ok('A6b. odrzucenie nie zmieniło ani bajtu', JSON.stringify(snapshotState(g)) === JSON.stringify(before));
    ok('A6c. wymagany hash snapshotu jest wpisany w preconditions',
      fs.readFileSync(path.join(REC, 'recover.js'), 'utf8').includes('3ae31e669984fc8746a7498ff770cdc0d382ff615a69e7d495d1053fcb146a91'));
  }

  /* ── A7. SIGKILL po każdym kroku → dziennik + automatyczne dokończenie ── */
  for (const step of STEPS) {
    const g = freshCopy();
    const before = snapshotState(g);
    const bp = path.join(tmpRoot, `kill-${step}.json`);
    fs.writeFileSync(bp, JSON.stringify(signedBundleFor('kill-' + step)));
    const killed = runRecoverInstalled(g, bp, ['--kill-after', step]);
    const midState = snapshotState(g);
    /* po SIGKILL stan MOŻE być pośredni — od tego jest dziennik */
    const journalExists = fs.existsSync(path.join(g, '.genome-txn', 'manifest.json'));
    /* kolejne uruchomienie MUSI dokończyć: cofnąć transakcję i dopiero potem działać */
    const p2 = path.join(tmpRoot, `kill2-${step}.json`);
    fs.writeFileSync(p2, JSON.stringify(signedBundleFor('kill2-' + step)));
    const rerun = runRecoverInstalled(g, p2);
    const after = snapshotState(g);
    /* po ponownym uruchomieniu: albo recovery przeszło w całości, albo stan wrócił do wyjściowego */
    const okState = rerun.code === 0 || JSON.stringify(after) === JSON.stringify(before);
    ok(`A7.${step} — SIGKILL po "${step}": dziennik${journalExists ? ' zapisany' : ' (brak zmian do cofnięcia)'}, ponowne uruchomienie nie zostawia stanu pośredniego`,
      killed.signal === 'SIGKILL' && okState && !fs.existsSync(path.join(g, '.genome-txn')),
      `signal=${killed.signal} rerun=${rerun.code} journal=${journalExists} pozostał=${fs.existsSync(path.join(g, '.genome-txn'))}`);
  }

  /* ── A8. BLOKADA: przy DOWOLNEJ zwłoce dokładnie JEDEN proces wchodzi do sekcji ──
     Audyt odtworzył: writer A zwleka 6 s z publikacją, B startuje po 5,2 s i OBAJ wchodzą.
     Testujemy cztery zwłoki wymagane przez audyt: 1 ms, 5 s, 30 s, 10 min. ── */
  {
    const worker = path.join(tmpRoot, 'lock-worker.js');
    fs.writeFileSync(worker, `
      const { withGenomeWriteLock } = require(${JSON.stringify(path.join(LIB, 'genome-common.js'))});
      const fs = require('fs');
      const r = withGenomeWriteLock(process.argv[2], () => {
        fs.appendFileSync(process.argv[3], 'WSZEDL:' + process.pid + '\\n');
        const t = Date.now(); while (Date.now() - t < 900) {}
        return { ok: true };
      });
      console.log(JSON.stringify({ ok: r.ok, orphan: !!r.orphan }));
    `);
    for (const delay of [1, 5000, 30000, 600000]) {
      const root = fs.mkdtempSync(path.join(tmpRoot, 'race-'));
      const marker = path.join(root, 'weszli.txt'); fs.writeFileSync(marker, '');
      const A2 = require('child_process').spawn('node', [worker, root, marker],
        { env: { ...process.env, GENOME_TEST_LOCK_PID_DELAY_MS: String(delay) }, stdio: 'pipe' });
      let outA = ''; A2.stdout.on('data', x => outA += x);
      const t0 = Date.now(); const wait = Math.min(delay * 0.6 + 200, 2500);
      while (Date.now() - t0 < wait) { /* B startuje W ŚRODKU zwłoki A */ }
      const B2 = spawnSync('node', [worker, root, marker], { encoding: 'utf8' });
      const entered = fs.readFileSync(marker, 'utf8').split('\n').filter(Boolean).length;
      ok(`A8.${delay}ms — zwłoka ${delay} ms przed publikacją: dokładnie JEDEN writer w sekcji krytycznej`,
        entered === 1, `weszło: ${entered} · B=${(B2.stdout || '').trim()}`);
      try { process.kill(A2.pid, 'SIGKILL'); } catch { /* skończył */ }
      fs.rmSync(root, { recursive: true, force: true });
    }
    /* sierota bez właściciela NIE jest przejmowana automatycznie, niezależnie od wieku */
    const { withGenomeWriteLock } = require(path.join(LIB, 'genome-common.js'));
    const orphanRoot = fs.mkdtempSync(path.join(tmpRoot, 'orphan-'));
    fs.writeFileSync(path.join(orphanRoot, '.genome-write.lock'), 'SMIECI BEZ WLASCICIELA');
    const ro = withGenomeWriteLock(orphanRoot, () => ({ ok: true }));
    ok('A8.sierota — blokada bez czytelnego właściciela NIE jest przejmowana automatycznie (wymaga człowieka)',
      ro.ok === false && ro.orphan === true && /usuń ją świadomie/.test(ro.error), JSON.stringify(ro).slice(0, 200));
    /* jedyne automatyczne przejęcie: udokumentowany właściciel, który NIE ŻYJE */
    fs.writeFileSync(path.join(orphanRoot, '.genome-write.lock'), JSON.stringify({ pid: 999999, started: 'x' }));
    ok('A8.martwy — blokada z PID martwego procesu jest przejmowana',
      withGenomeWriteLock(orphanRoot, () => ({ ok: true })).ok === true);
    fs.rmSync(orphanRoot, { recursive: true, force: true });
  }

  /* ── A9. DZIENNIK: błąd odtwarzania NIE kasuje danych ── */
  {
    const { recoverPendingTransaction } = require(path.join(LIB, 'genome-txn.js'));
    const mk = (mutate) => {
      const d = fs.mkdtempSync(path.join(tmpRoot, 'jrn-'));
      const j = path.join(d, '.genome-txn'); fs.mkdirSync(j);
      fs.writeFileSync(path.join(d, 'plik.txt'), 'PO ZMIANIE');
      const orig = Buffer.from('ORYGINAL');
      fs.writeFileSync(path.join(j, 'blob-0001'), orig);
      const man = { state: 'PREPARED', pid: 999999, entries: [{ rel: 'plik.txt', existed: true, blob: 'blob-0001', sha: crypto.createHash('sha256').update(orig).digest('hex') }], dirs: [] };
      fs.writeFileSync(path.join(j, 'manifest.json'), JSON.stringify(man));
      mutate(d, j, man);
      return { d, j };
    };
    { const { d, j } = mk((d2, j2) => fs.unlinkSync(path.join(j2, 'blob-0001')));
      const r = recoverPendingTransaction(d);
      ok('A9a. BRAKUJĄCY blob → ok:false, dziennik NIETKNIĘTY, plik niezmieniony',
        r.ok === false && fs.existsSync(path.join(j, 'manifest.json'))
        && fs.readFileSync(path.join(d, 'plik.txt'), 'utf8') === 'PO ZMIANIE', JSON.stringify(r).slice(0, 200)); }
    { const { d, j } = mk((d2, j2) => fs.writeFileSync(path.join(j2, 'blob-0001'), 'USZKODZONY'));
      const r = recoverPendingTransaction(d);
      ok('A9b. USZKODZONY blob (zły hash) → ok:false, dziennik i blob zostają',
        r.ok === false && /USZKODZONY|sha256/i.test(JSON.stringify(r)) && fs.existsSync(path.join(j, 'blob-0001')), JSON.stringify(r).slice(0, 200)); }
    { const { d, j } = mk(() => {});
      fs.chmodSync(path.join(d, 'plik.txt'), 0o444);
      const dirMode = fs.statSync(d).mode; fs.chmodSync(d, 0o555);
      const r = recoverPendingTransaction(d);
      fs.chmodSync(d, dirMode);
      ok('A9c. BRAK UPRAWNIEŃ do zapisu → ok:false albo poprawne odtworzenie; dziennik nigdy nie znika po błędzie',
        r.ok === true || (r.ok === false && fs.existsSync(path.join(j, 'manifest.json'))), JSON.stringify(r).slice(0, 200)); }
    { const { d, j } = mk((d2, j2, man) => { man.state = 'COMMITTED'; fs.writeFileSync(path.join(j2, 'manifest.json'), JSON.stringify(man)); });
      const r = recoverPendingTransaction(d);
      ok('A9d. dziennik COMMITTED jest TYLKO sprzątany, nigdy rollbackowany (praca zostaje)',
        r.ok === true && r.committed === true
        && fs.readFileSync(path.join(d, 'plik.txt'), 'utf8') === 'PO ZMIANIE' && !fs.existsSync(j), JSON.stringify(r).slice(0, 200)); }
    { const { d } = mk((d2, j2, man) => { man.pid = process.pid; fs.writeFileSync(path.join(j2, 'manifest.json'), JSON.stringify(man)); });
      const r = recoverPendingTransaction(d);
      ok('A9e. dziennik ŻYJĄCEGO procesu jest nietykalny', r.ok === false && r.alive === true); }
    { const { d, j } = mk(() => {});
      fs.writeFileSync(path.join(j, 'manifest.json'), 'to nie jest JSON');
      const r = recoverPendingTransaction(d);
      ok('A9f. NIECZYTELNY dziennik → ok:false, nic nie usunięte',
        r.ok === false && fs.existsSync(path.join(j, 'manifest.json')) && fs.existsSync(path.join(j, 'blob-0001'))); }
    { const { d, j } = mk(() => {});
      const r = recoverPendingTransaction(d);
      ok('A9g. poprawny rollback: plik odtworzony i ZWERYFIKOWANY hashem, dziennik sprzątnięty',
        r.ok === true && fs.readFileSync(path.join(d, 'plik.txt'), 'utf8') === 'ORYGINAL' && !fs.existsSync(j)); }
  }

  /* ── A11. NIEUDANY ROLLBACK SYNCHRONICZNY: dziennik ZOSTAJE, następny writer odmawia ── */
  {
    const { runTransaction, recoverPendingTransaction } = require(path.join(LIB, 'genome-txn.js'));
    const d = fs.mkdtempSync(path.join(tmpRoot, 'rbfail-'));
    fs.writeFileSync(path.join(d, 'a.txt'), 'ORYGINAL');
    const r = runTransaction(d, (txn) => {
      txn.write('a.txt', 'ZMIENIONE');
      fs.chmodSync(path.join(d, 'a.txt'), 0o444);
      fs.chmodSync(d, 0o555);                       /* uniemożliwia przywrócenie */
      throw new Error('wymuszona awaria po modyfikacji');
    });
    fs.chmodSync(d, 0o755);
    const jman = path.join(d, '.genome-txn', 'manifest.json');
    const blobs = fs.existsSync(path.join(d, '.genome-txn')) ? fs.readdirSync(path.join(d, '.genome-txn')).filter(f => f.startsWith('blob')).length : 0;
    ok('A11a. nieudany rollback → rollback_failed, NIE „rolled_back"',
      r.ok === false && r.rollback_failed === true && Array.isArray(r.rollback_problems) && r.rollback_problems.length > 0,
      JSON.stringify(r).slice(0, 240));
    ok('A11b. dziennik i bloby ZOSTAJĄ kompletne', fs.existsSync(jman) && blobs === 1, `manifest=${fs.existsSync(jman)} blobów=${blobs}`);
    ok('A11c. stan pośredni może zostać — i zostaje jawnie zgłoszony',
      fs.readFileSync(path.join(d, 'a.txt'), 'utf8') === 'ZMIENIONE' && /ROLLBACK NIEPEŁNY/.test(r.error), r.error);
    /* następny writer nie rusza, dopóki problem trwa: usuwamy blob, żeby odtworzenie było niemożliwe */
    fs.rmSync(path.join(d, '.genome-write.lock'), { force: true });
    fs.unlinkSync(path.join(d, '.genome-txn', 'blob-0001'));
    const nxt = runTransaction(d, () => ({ ok: true }));
    ok('A11d. następny writer ODMAWIA pracy przy nierozstrzygniętym dzienniku',
      nxt.ok === false && /NIEDOKOŃCZONA TRANSAKCJA/.test(nxt.error || ''), JSON.stringify(nxt).slice(0, 200));
    ok('A11e. dziennik po odmowie nadal istnieje (nic nie skasowane)', fs.existsSync(jman));
    fs.rmSync(d, { recursive: true, force: true });
  }

  /* ── A10. KOTWICA NIEZALEŻNA OD HOME ── */
  {
    const g = freshCopy(); const before = snapshotState(g);
    const bp = path.join(tmpRoot, 'home-attack.json');
    fs.writeFileSync(bp, JSON.stringify(signedBundleFor('home-attack')));
    const fakeHome = fs.mkdtempSync(path.join(tmpRoot, 'fake-home-'));
    fs.mkdirSync(path.join(fakeHome, '.genome'), { recursive: true });
    fs.writeFileSync(path.join(fakeHome, '.genome', 'approval-pubkey.pem'), testPub);
    /* agent: własna para kluczy + HOME na katalog tymczasowy + BEZ --trust */
    const instH = installInto(g, testPub, PROPOSALS_SRC);
    /* PRODUKCYJNY moduł approval (bez podmiany kotwicy) — atak ma iść przez HOME */
    fs.copyFileSync(path.join(LIB, 'approval.js'), path.join(instH.dir, 'final-salt-plate', 'lib', 'approval.js'));
    const r = spawnSync('node', [instH.recover, '--apply', '--bundle', bp], { encoding: 'utf8', env: { ...process.env, HOME: fakeHome } });
    const out = (r.stdout || '') + (r.stderr || '');
    ok('A10a. podmiana HOME na katalog z własnym kluczem NIE autoryzuje zapisu',
      r.status === 3 && /kotwica zaufania odrzucona|nie ma ważnego podpisu/.test(out), out.slice(-260));
    ok('A10b. atak przez HOME nie zmienił ani bajtu', JSON.stringify(snapshotState(g)) === JSON.stringify(before));
    ok('A10c. TRUST_DIR pochodzi z bazy użytkowników, nie ze zmiennej HOME',
      /os\.userInfo\(\)\.homedir/.test(fs.readFileSync(path.join(LIB, 'approval.js'), 'utf8')));
    /* --trust USUNIĘTE z produkcji: był omijalny przez TMPDIR i przez symlink r352-os/genome→kanon */
    const prodFiles = [path.join(REC, 'recover.js'), path.join(LIB, '..', 'deploy.js'),
      path.join(LIB, '..', 'genome', 'ingest.js'), path.join(LIB, '..', 'genome', 'migrate.js'), path.join(LIB, 'approval.js')];
    const codeOnly = s => s.split('\n').filter(l => !/^\s*(\*|\/\*|\/\/)/.test(l)).join('\n');
    const withFlag = prodFiles.filter(f => /--trust|publicKeyPem\s*:/.test(codeOnly(fs.readFileSync(f, 'utf8'))));
    ok('A10d. produkcyjne wykonawce i writer NIE MAJĄ flagi --trust ani wstrzykiwania publicKeyPem',
      withFlag.length === 0, withFlag.map(f => path.basename(f)).join(', '));
    /* WARSTWA ZAUFANIA (lib/approval.js) nie może zależeć od NICZEGO ze środowiska:
       ani od process.env, ani od os.tmpdir(), ani od os.homedir() (respektuje $HOME). */
    const apCode = codeOnly(fs.readFileSync(path.join(LIB, 'approval.js'), 'utf8'));
    ok('A10e. warstwa zaufania nie zależy od process.env, os.tmpdir() ani os.homedir()',
      !/process\.env/.test(apCode) && !/os\.tmpdir\(\)/.test(apCode) && !/os\.homedir\(\)/.test(apCode)
      && /os\.userInfo\(\)\.homedir/.test(apCode),
      apCode.split('\n').filter(l => /process\.env|os\.tmpdir|os\.homedir/.test(l)).join(' | ').slice(0, 200));
    /* TMPDIR nie ma już czego przestawić — sprawdzamy wprost */
    const gT = freshCopy();
    const instT = installInto(gT, testPub, PROPOSALS_SRC);
    fs.copyFileSync(path.join(LIB, 'approval.js'), path.join(instT.dir, 'final-salt-plate', 'lib', 'approval.js'));
    const rTmp = spawnSync('node', [instT.recover, '--apply', '--bundle', bp],
      { encoding: 'utf8', env: { ...process.env, TMPDIR: path.resolve(CANON, '..') } });
    ok('A10f. TMPDIR wskazujący na katalog kanonu niczego nie autoryzuje (kotwica produkcyjna → odmowa)',
      rTmp.status === 3, ((rTmp.stdout || '') + (rTmp.stderr || '')).slice(-200));
    const gA = freshCopy();
    const rTgt = spawnSync('node', [installInto(gA, testPub, PROPOSALS_SRC).recover, '--apply', '--target', gA, '--bundle', bp], { encoding: 'utf8' });
    ok('A10g. --apply z --target jest ODRZUCONE (cel to zawsze instalacja wykonawcy)',
      rTgt.status === 3 && /WYŁĄCZNIE z --dry-run/.test((rTgt.stdout || '') + (rTgt.stderr || '')),
      ((rTgt.stdout || '') + (rTgt.stderr || '')).slice(-200));
  }

  /* ── A4. strażnik kanonu ── */
  ok('A4. kanoniczne Genome bajtowo nietknięte przez cały zestaw', treeHash(CANON) === CANON_BEFORE,
    `przed ${CANON_BEFORE.slice(0, 16)} · po ${treeHash(CANON).slice(0, 16)}`);
} finally {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
}

console.log('\n═══ PRÓBA A — RECOVERY ═══\n');
for (const r of res) console.log(`  ${r.c ? '✓' : '✗'} ${r.n}${r.d ? '\n      → ' + r.d : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
