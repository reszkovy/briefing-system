#!/usr/bin/env node
/* ═══ PRÓBA B — DEPLOY: sukces oraz rollback po awarii każdego kroku ═══
 * Każdy przebieg na świeżej kopii repo, PO wykonaniu recovery na tej kopii. Kanon nietknięty.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');

const HERE = __dirname;
const FINAL = path.resolve(HERE, '..');
const PROPOSALS = path.resolve(FINAL, '..');
const CANON = path.resolve(PROPOSALS, '..');
const CANON_REPO = path.resolve(CANON, '..', '..');
const LIB = path.join(FINAL, 'lib');
const A = require(path.join(LIB, 'approval.js'));
const { treeHash } = require(path.join(LIB, 'genome-txn.js'));

let pass = 0, fail = 0; const res = [];
const ok = (n, c, d) => { c ? pass++ : fail++; res.push({ n, c, d: c ? '' : String(d || '').slice(0, 300) }); };
const sha = f => fs.existsSync(f) ? crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') : null;

const STEPS = ['brama-recovery', 'manifest', 'skille', 'obiekty', 'evidence', 'ledger', 'build', 'viewer'];
const CANON_BEFORE = treeHash(CANON);
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-deploy-test-'));

/* Cel testów: ZAMROŻONY fixture stanu sprzed recovery, nie żywy kanon. Hash kanonu wyżej
   zostaje — ale jako STRAŻNIK („nic nie wyciekło"), nie jako źródło danych wejściowych. */
const FIXTURE = path.resolve(PROPOSALS, 'fixtures', 'recovery-input-synthetic');
if (!fs.existsSync(FIXTURE)) {
  console.error('✗ brak fixture\'u ' + FIXTURE + '\n  odbuduj świadomie: node proposals/fixtures/fixture-recovery-input.js --regenerate');
  process.exit(2);
}

const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
const testPub = publicKey.export({ type: 'spki', format: 'pem' });


/* ── KOTWICA ZAUFANIA: pochodzi z bazy użytkowników (os.userInfo().homedir), NIE ze zmiennej HOME.
   Testy podają własne zaufanie jawnym `--trust`, dozwolonym wyłącznie dla celu w katalogu
   tymczasowym. Na kanonie flaga jest twardo odrzucana (test B9c). ── */

const DEPLOY = path.join(PROPOSALS, 'final-salt-plate', 'deploy.js');
const RECOVER = path.join(PROPOSALS, 'recovery-incydent', 'recover.js');
const D_MANIFEST = ['lib/approval.js', 'lib/genome-txn.js', 'lib/evidence-writer.js', 'lib/genome-common.js',
  'lib/canon-guard.js', 'lib/research-contract.js', 'lib/strategy-frameworks.js', 'genome/ingest.js', 'genome/migrate.js', 'ROUTER.md',
  'skills/mechanism-router/SKILL.md', 'skills/research-benchmark/SKILL.md', 'test/run-final-tests.js',
  'test/run-e2e-tests.js', 'test/run-migration-tests.js', 'test/run-gate-tests.js', 'test/run-tests.js', 'deploy.js'];
/* pełne domknięcie runtime recovery — to samo, co RECOVERY_MANIFEST w recover.js */
const R_MANIFEST = ['recover.js',
  '../final-salt-plate/lib/approval.js', '../final-salt-plate/lib/genome-txn.js',
  '../final-salt-plate/lib/genome-common.js', '../final-salt-plate/lib/canon-guard.js',
  'przywracane/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl',
  'przywracane/mig-2026-08-evidence-contract-v1-records.json'];
const artifactHashes = (base, files) => Object.fromEntries(files.map(f =>
  [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(base, f))).digest('hex')]));

const signBundle = (srcPath, nonce, artBase) => {
  const b = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const isDeploy = /deploy-bundle/.test(srcPath);
  b.approval.package.schema_version = A.SCHEMA_VERSION;
  b.approval.package.nonce = nonce; b.approval.nonce = nonce;
  b.approval.package.expires_at = b.approval.package.expires_at || '2027-01-01';
  b.approval.package.artifact_hashes = isDeploy
    ? artifactHashes(artBase || path.join(PROPOSALS, 'final-salt-plate'), D_MANIFEST)
    : artifactHashes(artBase || path.join(PROPOSALS, 'recovery-incydent'), R_MANIFEST);
  b.approval.package.payload_hash = A.payloadHash({ events: b.events, evidence: b.evidence, objects: b.objects });
  b.approval.status = 'approved'; b.approval.approved_by = b.approval.approved_by || 'przemek';
  b.approval.signature = crypto.sign(null, A.signingBytes(b.approval.package), privateKey).toString('hex');
  const out = path.join(tmpRoot, `bundle-${nonce}.json`);
  fs.writeFileSync(out, JSON.stringify(b, null, 1));
  return out;
};

function stateOf(repo) {
  const g = path.join(repo, 'r352-os', 'genome');
  const skills = d => fs.existsSync(d) ? fs.readdirSync(d).map(n => n + ':' + sha(path.join(d, n, 'SKILL.md'))).sort().join('|') : 'BRAK';
  return {
    tree: treeHash(g),
    ledger: sha(path.join(g, 'ledger', 'events-2026-08.jsonl')),
    nonces: sha(path.join(g, '.approval-nonces.jsonl')),
    archive: sha(path.join(g, 'ledger/.archive/events-2026-08.pre-mig-2026-08-evidence-contract-v1.jsonl')),
    snapshot: sha(path.join(g, 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json')),
    claude: skills(path.join(repo, '.claude', 'skills')),
    agents: skills(path.join(repo, '.agents', 'skills')),
  };
}

let seq = 0;
function baseRepo() {
  const d = fs.mkdtempSync(path.join(tmpRoot, 'repo-'));
  const g = path.join(d, 'r352-os', 'genome');
  fs.mkdirSync(path.dirname(g), { recursive: true });
  fs.cpSync(FIXTURE, g, { recursive: true });
  fs.rmSync(path.join(g, 'proposals'), { recursive: true, force: true });
  fs.rmSync(path.join(g, 'dist'), { recursive: true, force: true });
  fs.mkdirSync(path.join(d, '.claude'), { recursive: true });
  execFileSync('cp', ['-R', path.join(CANON_REPO, '.claude', 'skills'), path.join(d, '.claude', 'skills')]);
  if (fs.existsSync(path.join(CANON_REPO, '.agents', 'skills'))) {
    fs.mkdirSync(path.join(d, '.agents'), { recursive: true });
    execFileSync('cp', ['-R', path.join(CANON_REPO, '.agents', 'skills'), path.join(d, '.agents', 'skills')]);
  }
  return d;
}
function recoveredRepo() {
  const d = baseRepo();
  const g = path.join(d, 'r352-os', 'genome');
  const inst = installInto(d, testPub);
  const bp = signBundle(path.join(PROPOSALS, 'recovery-incydent', 'recovery-bundle.json'), 'rec-' + (++seq),
    path.join(inst.dir, 'recovery-incydent'));
  const r = spawnSync('node', [inst.recover, '--apply', '--bundle', bp], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('recovery w przygotowaniu kopii nie przeszło:\n' + (r.stdout || '') + (r.stderr || ''));
  return d;
}

/* ═══ TESTOWY WYKONAWCA — kopia modułów z podmienioną KOTWICĄ ═══
 * Produkcyjne wykonawce nie mają już ŻADNEGO sposobu podstawienia zaufania (`--trust` usunięte:
 * był omijalny przez TMPDIR i przez symlink `r352-os/genome` → kanon). Testy budują własną kopię
 * drzewa i w NIEJ przepisują `trustDir()`. Kopia nie jest w manifeście produkcyjnym. */
/* Wykonawca instalowany DO kopii repo: `--apply` bez `--target` pisze w tej kopii,
   dokładnie jak w produkcji pisze do kanonu. `--target` działa już tylko z `--dry-run`. */
function installInto(repoCopy, pubPem) {
  const dir = path.join(repoCopy, 'r352-os', 'genome', 'proposals');
  const CG = require(path.join(LIB, 'canon-guard.js'));
  if (!CG.checkTargetsEscapeRoot([dir], repoCopy).ok) throw new Error('instalacja wyszłaby poza repo (symlink)');
  fs.cpSync(PROPOSALS, dir, { recursive: true });
  const anchor = path.join(dir, '.test-anchor');
  fs.mkdirSync(anchor, { recursive: true });
  fs.writeFileSync(path.join(anchor, 'approval-pubkey.pem'), pubPem);
  const ap = path.join(dir, 'final-salt-plate', 'lib', 'approval.js');
  let src = fs.readFileSync(ap, 'utf8');
  src = src.replace(/function trustDir\(\) \{[\s\S]*?\n\}/,
    `function trustDir() { return ${JSON.stringify(anchor)}; }   /* KOPIA TESTOWA */`);
  if (!src.includes('KOPIA TESTOWA')) throw new Error('nie udało się podmienić trustDir() w kopii testowej');
  fs.writeFileSync(ap, src);
  return { dir, anchor, recover: path.join(dir, 'recovery-incydent', 'recover.js'), deploy: path.join(dir, 'final-salt-plate', 'deploy.js') };
}
const FOREIGN_PUB = crypto.generateKeyPairSync('ed25519').publicKey.export({ type: 'spki', format: 'pem' });
/* deploy uruchamiany „u siebie": instalujemy wykonawcę w kopii repo i wołamy bez --target */
/* Pakiet podpisujemy PO instalacji, bo instalacja zawiera przepisany `approval.js` (kotwica
   testowa) — a `artifact_hashes` muszą odpowiadać plikom, które realnie zostaną wdrożone.
   `bundle` może być ścieżką (użyj jak jest) albo funkcją (nonce → ścieżka, hashe z instalacji). */
const runDeploy = (repo, bundle, extra = [], pubPem = testPub) => {
  const inst = installInto(repo, pubPem);
  const bp = typeof bundle === 'function' ? bundle(path.join(inst.dir, 'final-salt-plate')) : bundle;
  const r = spawnSync('node', [inst.deploy, '--apply', '--bundle', bp, ...extra], { encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || ''), signal: r.signal, exe: inst.deploy, tree: inst.dir };
};
const B = (nonce) => (base) => signBundle(DBUNDLE, nonce, base);
const DBUNDLE = path.join(PROPOSALS, 'final-salt-plate', 'deploy-bundle.json');
const CARDS = ['workflows/salt.md', 'workflows/plate.md', 'mechanisms/strategy-before-execution.md',
  'records/backtests/betterworkplace-salt-plate.md', 'records/backtests/marka-tlumacz-salt-gap.md',
  'decisions/2026-08-09-wdrozenie-salt-plate.md', 'records/proces/router-spec-2026-08-09.md'];

try {
  ok('B0a. w repo NIE MA klucza publicznego — kotwica zaufania jest poza repozytorium',
    !fs.existsSync(path.join(LIB, 'approval-pubkey.pem')) && /\.genome[\\/]approval-pubkey\.pem$/.test(A.PUBKEY_FILE), A.PUBKEY_FILE);
  {
    const d = recoveredRepo(); const before = stateOf(d);
    const r = runDeploy(d, B('foreign-anchor'), [], FOREIGN_PUB);
    ok('B0a2. podpis odrzucony, gdy kotwica ma inny klucz publiczny', r.code === 3 && /brak ważnego podpisu/.test(r.out), r.out.slice(-220));
    ok('B0a3. odrzucenie nie zmieniło ani bajtu', JSON.stringify(stateOf(d)) === JSON.stringify(before));
  }

  /* ── B0. bramka recovery na stanie NIEODZYSKANYM ── */
  {
    const d = baseRepo(); const before = stateOf(d);
    const r = runDeploy(d, B('gate-1'));
    ok('B0b. bramka recovery blokuje wdrożenie na stanie nieodzyskanym',
      r.code !== 0 && /brama-recovery/.test(r.out) && /archiwum sha256/.test(r.out) && /snapshot/.test(r.out), r.out.slice(-320));
    ok('B0c. zablokowane wdrożenie nie zmieniło ani bajtu', JSON.stringify(stateOf(d)) === JSON.stringify(before));
  }

  /* ── B0'. brak podpisu ── */
  {
    const d = recoveredRepo(); const before = stateOf(d);
    const raw = path.join(tmpRoot, 'unsigned-deploy.json');
    const b = JSON.parse(fs.readFileSync(DBUNDLE, 'utf8'));
    b.approval.signature = null; fs.writeFileSync(raw, JSON.stringify(b));
    const r = runDeploy(d, raw);
    ok('B0d. --apply bez podpisu Ed25519 → odmowa', r.code === 3 && /brak ważnego podpisu/.test(r.out), r.out.slice(-260));
    ok('B0e. odmowa nie zmieniła ani bajtu', JSON.stringify(stateOf(d)) === JSON.stringify(before));
  }

  /* ── B1. SUKCES ── */
  {
    const d = recoveredRepo();
    const r = runDeploy(d, B('deploy-ok-1'));
    const g = path.join(d, 'r352-os', 'genome');
    ok('B1a. WDROŻENIE SUKCES: 8 kroków, build 0 błędów',
      r.code === 0 && /WDROŻENIE WYKONANE/.test(r.out) && /0 błędów/.test(r.out), r.out.slice(-600));
    const missing = CARDS.filter(f => !fs.existsSync(path.join(g, f)));
    ok('B1b. 7 kart powstało (2 workflow, mechanizm, 2 Recordy, Decision, spec Routera)', missing.length === 0, missing.join(', '));

    const mech = fs.readFileSync(path.join(g, 'mechanisms/strategy-before-execution.md'), 'utf8');
    const fmEv = JSON.parse((mech.match(/^evidence: (.*)$/m) || [])[1] || '[]');
    const conf = JSON.parse((mech.match(/^confidence: (.*)$/m) || [])[1] || '{}');
    ok('B1c. Evidence weszło przez writer: 2 wpisy, kierunki neutral + limits',
      fmEv.length === 2 && fmEv.some(e => e.direction === 'neutral') && fmEv.some(e => e.direction === 'limits'),
      JSON.stringify(fmEv.map(e => e.id + ':' + e.direction)));
    ok('B1d. confidence PRZELICZONE (n=2, projects=2, emerging, zero validated)',
      conf.value === 'emerging' && conf.evidence_strength.n === 2 && conf.evidence_strength.projects === 2
      && conf.evidence_strength.types.backtest === 2, JSON.stringify(conf.evidence_strength));

    const led = fs.readFileSync(path.join(g, 'ledger/events-2026-08.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
    const iCre = led.findIndex(e => e.kind === 'object.created' && e.on === 'mech:strategy-before-execution');
    const iEv = led.findIndex(e => e.kind === 'evidence.added');
    ok('B1e. object.created PRZED evidence.added', iCre >= 0 && iEv > iCre, `created@${iCre} evidence@${iEv}`);
    ok('B1f. każde evidence.added ma jawne direction',
      led.filter(e => e.kind === 'evidence.added').length === 2
      && led.filter(e => e.kind === 'evidence.added').every(e => ['neutral', 'limits'].includes(e.direction)),
      JSON.stringify(led.filter(e => e.kind === 'evidence.added').map(e => e.direction)));
    ok('B1g. ZERO object.updated na rec:F0-SEED-FREEZE dla zmiany Routera (fałszywy target usunięty)',
      !led.some(e => e.kind === 'object.updated' && e.on === 'rec:F0-SEED-FREEZE'));
    ok('B1h. nonce zużyty', fs.readFileSync(path.join(g, '.approval-nonces.jsonl'), 'utf8').includes('deploy-ok-1'));
    ok('B1i. skille zsynchronizowane', spawnSync('node', [path.join(g, 'sync-skills.js'), '--check'], { encoding: 'utf8' }).status === 0);
    const graph = JSON.parse(fs.readFileSync(path.join(g, 'dist', 'graph.json'), 'utf8'));
    const pm = graph.project_mechanism.filter(x => x.target === 'mech:strategy-before-execution');
    ok('B1j. graf: 2 workflow, zero fałszywej krawędzi requires, krawędzie Project→Mechanism z Recordów',
      graph.nodes.filter(n => String(n.id).startsWith('wf:')).length === 2
      && !graph.edges.some(e => e.source === 'wf:plate' && e.target === 'wf:salt' && e.relation === 'requires')
      && pm.length >= 2, JSON.stringify(pm.map(x => x.source + ':' + x.relation)));
    const r2 = runDeploy(d, B('deploy-ok-1'));
    ok('B1k. powtórka z tym samym nonce odrzucona', r2.code !== 0, r2.out.slice(-200));
  }

  /* ── B2. ROLLBACK po awarii KAŻDEGO kroku ── */
  for (const step of STEPS) {
    const d = recoveredRepo();
    const before = stateOf(d);
    const r = runDeploy(d, B('rollback-' + step), ['--fail-after', step]);
    const after = stateOf(d);
    const identical = JSON.stringify(before) === JSON.stringify(after);
    ok(`B2.${step} — awaria po "${step}" → pełny rollback (drzewo, Ledger, nonce, skille, archiwum, snapshot)`,
      r.code !== 0 && identical,
      identical ? `exit=${r.code} (oczekiwano ≠0)` : Object.keys(before).filter(k => before[k] !== after[k]).map(k => k + ' ZMIENIONE').join(', '));
  }


  /* ── B4. ARTEFAKTY: mutacja KAŻDEGO pliku manifestu po podpisie odrzucona PRZED zapisem ── */
  {
    const proposalCopyBase = path.join(tmpRoot, 'prop-mut');
    /* wariant z ZMUTOWANYM plikiem: instalujemy kopię propozycji jako wykonawcę i mutujemy w niej */
    const runDeployFromTree = (repo, mutatedFile, propCopy) => {
      const dst = path.join(repo, 'r352-os', 'genome', 'proposals');
      fs.rmSync(dst, { recursive: true, force: true });
      fs.cpSync(propCopy, dst, { recursive: true });
      const anchor = path.join(dst, '.test-anchor'); fs.mkdirSync(anchor, { recursive: true });
      fs.writeFileSync(path.join(anchor, 'approval-pubkey.pem'), testPub);
      const ap = path.join(dst, 'final-salt-plate', 'lib', 'approval.js');
      fs.writeFileSync(ap, fs.readFileSync(ap, 'utf8').replace(/function trustDir\(\) \{[\s\S]*?\n\}/,
        `function trustDir() { return ${JSON.stringify(anchor)}; }   /* KOPIA TESTOWA */`));
      /* hashe z instalacji PRZED mutacją, potem mutujemy jeden plik */
      const bp2 = signBundle(DBUNDLE, 'art-' + mutatedFile.replace(/[^a-z0-9]/gi, '-'), path.join(dst, 'final-salt-plate'));
      fs.appendFileSync(path.join(dst, 'final-salt-plate', mutatedFile),
        /\.js$/.test(mutatedFile) ? '\n// DOPISANE PO PODPISIE\n' : '\nDOPISANE PO PODPISIE\n');
      const r = spawnSync('node', [path.join(dst, 'final-salt-plate', 'deploy.js'), '--apply', '--bundle', bp2], { encoding: 'utf8' });
      return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
    };
    for (const f of D_MANIFEST) {
      const d = recoveredRepo(); const before = stateOf(d);
      const pc = fs.mkdtempSync(proposalCopyBase);
      fs.cpSync(PROPOSALS, pc, { recursive: true });
      const bp = null;   /* hashe policzone niżej, z NIEZMUTOWANEJ instalacji */
      const r = runDeployFromTree(d, f, pc);
      ok(`B4.${f} — mutacja po podpisie odrzucona przed zapisem`,
        r.code !== 0 && /sha256|artifact/i.test(r.out) && JSON.stringify(stateOf(d)) === JSON.stringify(before),
        r.out.slice(-200));
    }
  }

  /* ── B5. SIGKILL po każdym kroku → dziennik i brak stanu pośredniego po restarcie ── */
  for (const step of STEPS) {
    const d = recoveredRepo();
    const before = stateOf(d);
    const killed = runDeploy(d, B('kill-' + step), ['--kill-after', step]);
    const journal = fs.existsSync(path.join(d, 'r352-os', 'genome', '.genome-txn', 'manifest.json'));
    const rerun = runDeploy(d, B('kill2-' + step));
    const after = stateOf(d);
    const okState = rerun.code === 0 || JSON.stringify(after) === JSON.stringify(before);
    ok(`B5.${step} — SIGKILL po "${step}": dziennik${journal ? ' zapisany' : ' (brak zmian)'}, restart nie zostawia stanu pośredniego`,
      killed.signal === 'SIGKILL' && okState && !fs.existsSync(path.join(d, 'r352-os', 'genome', '.genome-txn')),
      `signal=${killed.signal} rerun=${rerun.code} journal=${journal} pozostał=${fs.existsSync(path.join(d, 'r352-os', 'genome', '.genome-txn'))}`);
  }

  /* ── B6. BLOKADA: dokładnie JEDEN writer w sekcji krytycznej, niezależnie od zwłoki ── */
  {
    const d = recoveredRepo();
    const instLock = installInto(d, testPub);
    const bpA = signBundle(DBUNDLE, 'lock-a', path.join(instLock.dir, 'final-salt-plate'));
    const pA = require('child_process').spawn('node', [instLock.deploy, '--apply', '--bundle', bpA],
      { env: { ...process.env, GENOME_TEST_LOCK_PID_DELAY_MS: '1500' }, stdio: 'pipe' });
    let outA = ''; pA.stdout.on('data', x => outA += x); pA.stderr.on('data', x => outA += x);
    const t0 = Date.now(); while (Date.now() - t0 < 400) { /* B startuje W ŚRODKU zwłoki A */ }
    const rB = runDeploy(d, B('lock-b'));
    const doneA = new Promise(res => pA.on('exit', c => res(c)));
    const codeA = require('child_process').spawnSync('node', ['-e', 'setTimeout(()=>{},1)'], {}) && null;
    /* czekamy na A synchronicznie przez plik-marker: wystarczy sprawdzić, ilu zakończyło się sukcesem */
    const waitStart = Date.now();
    while (pA.exitCode === null && Date.now() - waitStart < 30000) { /* busy-wait na zakończenie A */ }
    const aOk = /WDROŻENIE WYKONANE/.test(outA);
    const bOk = rB.code === 0;
    ok('B6. dokładnie JEDEN z dwóch równoległych writerów wchodzi pod blokadę (okno wyścigu zamknięte)',
      (aOk ? 1 : 0) + (bOk ? 1 : 0) === 1, `A=${aOk} B=${bOk} · ${(aOk ? rB.out : outA).slice(-200)}`);
    try { process.kill(pA.pid, 'SIGKILL'); } catch { /* skończył */ }
  }

  /* ── B7. TA SAMA SEMANTYKA EVIDENCE co ingest ── */
  {
    const EW = require(path.join(LIB, 'evidence-writer.js'));
    const dsrc = fs.readFileSync(DEPLOY, 'utf8');
    const isrc = fs.readFileSync(path.join(FINAL, 'genome', 'ingest.js'), 'utf8');
    ok('B7a. deploy i ingest wołają TEN SAM writer Evidence, żaden nie ma własnej kopii',
      /EW\.applyEvidence\(/.test(dsrc) && /EW\.applyEvidence\(/.test(isrc)
      && !/independence_key:\s*`\$\{/.test(dsrc) && !/evidence_strength\s*=\s*\{/.test(dsrc),
      'deploy nadal ma własną implementację');
    /* dowód semantyczny: ta sama karta + to samo Evidence → identyczny wynik obu drogami */
    const fm = { id: 'mech:t', type: 'mechanism', version: 1, confidence: { value: 'hypothesis' } };
    const ev = { mechanism: 'mech:t', project: 'proj:a', type: 'backtest', date: '2026-08-09', source: 'rec:backtests/a', direction: 'limits', observation: 'x' };
    const r1 = EW.applyEvidence(fm, ev, { today: '2026-08-09' });
    const r2 = EW.applyEvidence(fm, ev, { today: '2026-08-09' });
    ok('B7b. writer jest deterministyczny (ten sam wynik, ten sam fingerprint i independence_key)',
      JSON.stringify(r1.fm.evidence) === JSON.stringify(r2.fm.evidence)
      && r1.fm.evidence[0].independence_key === 'proj:a::rec:backtests/a' && !!r1.fm.evidence[0].fingerprint);
    const dup = EW.applyEvidence(r1.fm, { ...ev, id: 'ev:inne-id' }, { today: '2026-08-09' });
    ok('B7c. deduplikacja po fingerprint/independence_key działa też przy innym ID',
      dup.status === 'skipped' && /fingerprint|independence_key/.test(dup.reason), JSON.stringify(dup));
    ok('B7d. evidence_strength zawiera independent_sources i rozkład kierunków',
      r1.fm.confidence.evidence_strength.independent_sources === 1
      && r1.fm.confidence.evidence_strength.directions.limits === 1);
  }


  /* ── B8. BRAMKA RECOVERY: dokładny hash snapshotu, JEDNA linia zdarzenia, hash-chain ── */
  {
    const reChain = (g) => {   /* przelicza hash-chain po edycji, żeby test nie wygrywał „przez przypadek" */
      const f = path.join(g, 'ledger', 'events-2026-08.jsonl');
      const lines = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
      let prev = 'genesis'; const out = [];
      for (const ev of lines) { ev.prev_hash = prev; const s = JSON.stringify(ev); out.push(s); prev = crypto.createHash('sha256').update(s).digest('hex').slice(0, 16); }
      fs.writeFileSync(f, out.join('\n') + '\n');
    };
    /* B8a: jeden bajt w snapshocie */
    {
      const d = recoveredRepo(); const g = path.join(d, 'r352-os', 'genome');
      const sp = path.join(g, 'records/.snapshots/mig-2026-08-evidence-contract-v1-records.json');
      const s = JSON.parse(fs.readFileSync(sp, 'utf8'));
      s.records[0].content_before += 'X';   /* jeden bajt więcej; kształt (recovered/32) bez zmian */
      fs.writeFileSync(sp, JSON.stringify(s, null, 1));
      const before = stateOf(d);
      const r = runDeploy(d, B('gate-snap'));
      ok('B8a. zmieniony bajt snapshotu (kształt zachowany) zatrzymuje deploy przed pierwszym zapisem',
        r.code !== 0 && /snapshot sha256/.test(r.out) && JSON.stringify(stateOf(d)) === JSON.stringify(before), r.out.slice(-240));
    }
    /* B8b: pole zdarzenia recovery + PRZELICZONY hash-chain */
    {
      const d = recoveredRepo(); const g = path.join(d, 'r352-os', 'genome');
      const f = path.join(g, 'ledger', 'events-2026-08.jsonl');
      const lines = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
      const idx = lines.findIndex(e => e.kind === 'knowledge.corrected' && e.on === 'rec:F0-SEED-FREEZE'
        && e.cause === 'rec:incydenty/2026-08-09-test-zapisal-do-kanonu');
      lines[idx].cause = 'rec:cos-innego';        /* zdarzenie recovery przestaje pasować */
      fs.writeFileSync(f, lines.map(e => JSON.stringify(e)).join('\n') + '\n');
      reChain(g);                                  /* chain policzony od nowa — musi zadziałać inna kontrola */
      const before = stateOf(d);
      const r = runDeploy(d, B('gate-event'));
      ok('B8b. podmienione pole zdarzenia recovery (przy poprawnym hash-chain) zatrzymuje deploy',
        r.code !== 0 && /zdarzenie recovery/.test(r.out) && /znaleziono 0/.test(r.out)
        && JSON.stringify(stateOf(d)) === JSON.stringify(before), r.out.slice(-260));
    }
    /* B8c: zerwany hash-chain */
    {
      const d = recoveredRepo(); const g = path.join(d, 'r352-os', 'genome');
      const f = path.join(g, 'ledger', 'events-2026-08.jsonl');
      const lines = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
      lines[lines.length - 1].prev_hash = '0'.repeat(16);
      fs.writeFileSync(f, lines.map(e => JSON.stringify(e)).join('\n') + '\n');
      const before = stateOf(d);
      const r = runDeploy(d, B('gate-chain'));
      ok('B8c. zerwany hash-chain Ledgera zatrzymuje deploy',
        r.code !== 0 && /hash-chain/.test(r.out) && JSON.stringify(stateOf(d)) === JSON.stringify(before), r.out.slice(-240));
    }
    /* B8d: bramka nie używa includes() po całym Ledgerze */
    {
      const src = fs.readFileSync(DEPLOY, 'utf8');
      ok('B8d. bramka parsuje linie JSONL, nie robi includes() po całym Ledgerze',
        !/led\.includes\(/.test(src) && /JSON\.parse\(line\)/.test(src) && /recEvents !== 1/.test(src));
    }
  }

  /* ── B9. KOTWICA NIEZALEŻNA OD HOME ── */
  {
    const d = recoveredRepo(); const before = stateOf(d);
    const fakeHome = fs.mkdtempSync(path.join(tmpRoot, 'fake-home-'));
    fs.mkdirSync(path.join(fakeHome, '.genome'), { recursive: true });
    fs.writeFileSync(path.join(fakeHome, '.genome', 'approval-pubkey.pem'), testPub);
    const r = (() => { const i = installInto(d, testPub);
      fs.copyFileSync(path.join(LIB, 'approval.js'), path.join(i.dir, 'final-salt-plate', 'lib', 'approval.js'));
      const x = spawnSync('node', [i.deploy, '--apply', '--bundle', signBundle(DBUNDLE, 'home-attack-b', path.join(i.dir, 'final-salt-plate'))],
        { encoding: 'utf8', env: { ...process.env, HOME: fakeHome } });
      return { status: x.status, stdout: x.stdout, stderr: x.stderr }; })();
    const out = (r.stdout || '') + (r.stderr || '');
    ok('B9a. podmiana HOME z własnym kluczem NIE autoryzuje wdrożenia',
      r.status === 3 && /kotwica zaufania odrzucona|brak ważnego podpisu/.test(out), out.slice(-240));
    ok('B9b. atak przez HOME nie zmienił ani bajtu', JSON.stringify(stateOf(d)) === JSON.stringify(before));
    /* --trust USUNIĘTE: dowód, że produkcyjne pliki go nie znają i nie przyjmują publicKeyPem */
    const codeOnly = s => s.split('\n').filter(l => !/^\s*(\*|\/\*|\/\/)/.test(l)).join('\n');
    const prod = [DEPLOY, RECOVER, path.join(FINAL, 'genome', 'ingest.js'), path.join(FINAL, 'genome', 'migrate.js')];
    ok('B9c. produkcyjne wykonawce i writer nie mają --trust ani wstrzykiwania publicKeyPem',
      prod.every(f => !/--trust|publicKeyPem\s*:/.test(codeOnly(fs.readFileSync(f, 'utf8')))),
      prod.filter(f => /--trust|publicKeyPem\s*:/.test(codeOnly(fs.readFileSync(f, 'utf8')))).map(f => path.basename(f)).join(', '));
    /* ── ATAKI Z WAŻNYM PODPISEM ──
       Po usunięciu `--target` z `--apply` wywołujący nie wybiera już korzenia zapisu: celem jest
       instalacja wykonawcy. Znika cała klasa „podstaw korzeń" (TMPDIR, symlink) dla apply.
       Zostaje `--dry-run --target`, który w celu NICZEGO nie zapisuje — i to sprawdzamy. */
    const okRepo = recoveredRepo();
    const instC = installInto(okRepo, testPub);
    const rOk = spawnSync('node', [instC.deploy, '--apply', '--bundle',
      signBundle(DBUNDLE, 'sig-control', path.join(instC.dir, 'final-salt-plate'))], { encoding: 'utf8' });
    ok('B9d. KONTROLA: ważny podpis przechodzi na zwykłej kopii (ataki docierają do guardu, nie do podpisu)',
      rOk.status === 0 && /WDROŻENIE WYKONANE/.test(rOk.stdout || ''), (rOk.stdout || '').slice(-200));

    const d2 = recoveredRepo();
    const inst2 = installInto(d2, testPub);
    const canonB1 = treeHash(CANON);
    const rTgt = spawnSync('node', [inst2.deploy, '--apply', '--target', CANON_REPO, '--bundle',
      signBundle(DBUNDLE, 'target-with-apply', path.join(inst2.dir, 'final-salt-plate'))], { encoding: 'utf8' });
    const outT = (rTgt.stdout || '') + (rTgt.stderr || '');
    ok('B9e. --apply z --target ODRZUCONE mimo WAŻNEGO podpisu (wywołujący nie wybiera korzenia zapisu)',
      rTgt.status === 3 && /WYŁĄCZNIE z --dry-run/.test(outT) && treeHash(CANON) === canonB1, outT.slice(-240));

    const symRepo = fs.mkdtempSync(path.join(tmpRoot, 'symrepo-'));
    fs.mkdirSync(path.join(symRepo, 'r352-os'), { recursive: true });
    fs.symlinkSync(CANON, path.join(symRepo, 'r352-os', 'genome'));
    const canonB2 = treeHash(CANON);
    const rSym = spawnSync('node', [DEPLOY, '--dry-run', '--target', symRepo, '--bundle', DBUNDLE], { encoding: 'utf8' });
    const outS = (rSym.stdout || '') + (rSym.stderr || '');
    ok('B9f. --dry-run --target z symlinkiem r352-os/genome → kanon: guard odrzuca, kanon nietknięty',
      rSym.status === 3 && /dotyka KANONICZNEGO Genome|WYCHODZI poza/.test(outS) && treeHash(CANON) === canonB2, outS.slice(-260));

    const canonB3 = treeHash(CANON);
    const rTmp = spawnSync('node', [DEPLOY, '--dry-run', '--target', CANON_REPO, '--bundle', DBUNDLE],
      { encoding: 'utf8', env: { ...process.env, TMPDIR: path.resolve(CANON_REPO) } });
    const outTm = (rTmp.stdout || '') + (rTmp.stderr || '');
    ok('B9g. TMPDIR=kanon nie czyni z kanonu „piaskownicy" — dry-run na kanon odrzucony',
      rTmp.status === 3 && /dotyka KANONICZNEGO Genome/.test(outTm) && treeHash(CANON) === canonB3, outTm.slice(-240));
  }

  ok('B3. kanoniczne Genome bajtowo nietknięte przez cały zestaw', treeHash(CANON) === CANON_BEFORE,
    `przed ${CANON_BEFORE.slice(0, 16)} · po ${treeHash(CANON).slice(0, 16)}`);
} finally {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
}

console.log('\n═══ PRÓBA B — DEPLOY ═══\n');
for (const r of res) console.log(`  ${r.c ? '✓' : '✗'} ${r.n}${r.d ? '\n      → ' + r.d : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
