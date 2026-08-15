#!/usr/bin/env node
/* ═══ TESTY END-TO-END: warstwa zapisu · zgoda · replay · fazy ═══
 * Uruchamiają PRAWDZIWY ingest.js na kopii realnego Genome w katalogu tymczasowym.
 * Kanon nietknięty; żaden test nie pisze poza katalogiem tymczasowym.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');

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

const GENOME = __genomeRoot(__dirname);
const FINAL = __moduleHome(__dirname, GENOME);
const SRC = __sourceDir(FINAL, GENOME);
function treeHash(root, skip = /(^|\/)(dist|node_modules|proposals|\.genome-write\.lock)(\/|$)/) {
  const out = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const q = path.join(d, e.name); if (skip.test(q.slice(root.length))) continue;
    e.isDirectory() ? walk(q) : out.push(q.slice(root.length) + ':' + crypto.createHash('sha256').update(fs.readFileSync(q)).digest('hex'));
  } })(root);
  return crypto.createHash('sha256').update(out.sort().join('\n')).digest('hex');
}
const CANON_BEFORE = treeHash(GENOME);
const R = require(path.join(FINAL, 'lib', 'research-contract.js'));
const AP = require(path.join(FINAL, 'lib', 'approval.js'));
const F = require(path.join(FINAL, 'lib', 'strategy-frameworks.js'));

let pass = 0, fail = 0; const res = [];
const ok = (n, c, d) => { c ? pass++ : fail++; res.push({ n, c, d: c ? '' : String(d || '').slice(0, 300) }); };

const { publicKey: E2E_PUB, privateKey: E2E_PRIV } = crypto.generateKeyPairSync('ed25519');
const E2E_PUB_PEM = E2E_PUB.export({ type: 'spki', format: 'pem' });
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
const TODAY = new Date().toISOString().slice(0, 10);
/* Kopia robocza pochodzi z ZAMROŻONEGO fixture'u, nie z żywego kanonu — patrz
   node proposals/fixtures/fixture-recovery-input.js --regenerate. Hash kanonu zostaje jako strażnik. */
const FIXTURE_PRE_RECOVERY = path.join(GENOME, 'proposals', 'fixtures', 'recovery-input-synthetic');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-e2e-'));
const G = path.join(tmp, 'genome');


/* ── przygotowanie kopii z propozycją wgraną ── */
fs.cpSync(FIXTURE_PRE_RECOVERY, G, { recursive: true });
fs.rmSync(path.join(G, 'proposals'), { recursive: true, force: true });
fs.rmSync(path.join(G, 'dist'), { recursive: true, force: true });
fs.copyFileSync(path.join(SRC, 'ingest.js'), path.join(G, 'ingest.js'));
for (const f of ['research-contract.js', 'strategy-frameworks.js', 'approval.js', 'genome-txn.js', 'evidence-writer.js', 'genome-common.js']) fs.copyFileSync(path.join(FINAL, 'lib', f), path.join(G, 'lib', f));
anchorSandbox(G, E2E_PUB_PEM);

for (const f of fs.readdirSync(path.join(SRC, 'workflows'))) fs.copyFileSync(path.join(SRC, 'workflows', f), path.join(G, 'workflows', f));
for (const f of fs.readdirSync(path.join(SRC, 'mechanisms'))) fs.copyFileSync(path.join(SRC, 'mechanisms', f), path.join(G, 'mechanisms', f));
for (const f of fs.readdirSync(path.join(SRC, 'records', 'backtests'))) fs.copyFileSync(path.join(SRC, 'records', 'backtests', f), path.join(G, 'records', 'backtests', f));


const CONTRACT = {
  client: 'cli:betterworkplace', business_problem: 'rynek widzi dostawcę, nie partnera benefitowego',
  project_start: '2026-08-10', scope: 'diagnoza + plan komunikacji', non_scope: 'produkcja wideo, media płatne',
  baseline: 'n/d', mechanisms: ['mech:strategy-before-execution'], frameworks: ['wf:salt', 'wf:plate'],
  validation_plan: 'pomiar zapytań od HR po 90 dniach', outcome_owner: 'przemek', measurement_date: '2026-11-10',
  go_decision: 'GO', go_rationale: 'fundament zatwierdzony, metryka rozliczalna',
  prepared_by: 'session:router', decided_by: 'przemek', report_version: 'v1', contract_version: 'v1',
};
const pkgFor = (nonce, over = {}) => ({
  schema_version: AP.SCHEMA_VERSION, phase: 'contract',
  claims: [{ kind: 'fact', text: 'ekosystem jest niewidoczny dla kupującego' }],
  research: [], routing: { decision: 'BOTH', reasons: ['brak fundamentu'], gates: [], unresolved: [] },
  recommended_mechanisms: ['mech:strategy-before-execution'], recommended_frameworks: ['wf:salt', 'wf:plate'],
  metrics: [], project_contract: { ...CONTRACT, ...(over.contract || {}) }, predictions: [],
  payload_hash: over.payload_hash || null,
  nonce, expires_at: '2027-01-01', ...(over.pkg || {}),
});
const sign = pkg => crypto.sign(null, AP.signingBytes(pkg), E2E_PRIV).toString('hex');

let seq = 0;
const objectsFor = (id, n) => [{
  op: 'object.create', id, type: 'record', title: `E2E probe ${n}`, status: 'created',
  owner: 'przemek', relations: {}, tags: ['e2e'],
  body: '\n# Sonda E2E\n\nRekord wytworzony przez test end-to-end warstwy zapisu.\n',
}];
const bundle = (nonce, opts = {}) => {
  const id = opts.recordId || `rec:e2e/probe-${++seq}`;
  const objects = opts.objects || objectsFor(id, seq);
  /* payload_hash liczony z TEGO, co realnie zostanie zapisane — i wchodzi DO podpisu */
  const pkg = pkgFor(nonce, { ...opts, payload_hash: AP.payloadHash({ objects }) });
  return {
    objects,
    approval: {
      status: 'approved', approved_by: 'przemek', approved_at: new Date().toISOString(),
      package: pkg, signature: opts.signature !== undefined ? opts.signature : sign(pkg), nonce,
    },
  };
};
const runIngest = (obj, extraEnv = {}) => {
  const file = path.join(tmp, `pkg-${Math.abs(JSON.stringify(obj).length)}-${++seq}.json`);
  /* proposal_hash liczony tak jak w ingest.js */
  const canonical = v => JSON.stringify(v, (k, val) => (val && typeof val === 'object' && !Array.isArray(val))
    ? Object.keys(val).sort().reduce((a, kk) => (a[kk] = val[kk], a), {}) : val);
  obj.approval.proposal_hash = crypto.createHash('sha256')
    .update(canonical({ events: obj.events || [], evidence: obj.evidence || [], objects: obj.objects || [] })).digest('hex');
  fs.writeFileSync(file, JSON.stringify(obj, null, 1));
  const r = spawnSync('node', [path.join(G, 'ingest.js'), file], {
    encoding: 'utf8', env: { ...process.env, GENOME_DIR: G, ...extraEnv },
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
};

try {
  /* ═══ E1. agent nie zapisze pakietu bez prawidłowego HMAC ═══ */
  {
    const noSig = bundle('nonce-e1a', { signature: '' });
    delete noSig.approval.signature;
    const r1 = runIngest(noSig);
    const r2 = runIngest(bundle('nonce-e1b', { signature: 'f'.repeat(64) }));
    ok('E1a. pakiet bez podpisu jest odrzucony', r1.code !== 0 && /signature wymagane|ZGODA CZŁOWIEKA ODRZUCONA/.test(r1.out), r1.out.slice(0, 200));
    ok('E1b. sfabrykowany podpis jest odrzucony', r2.code !== 0 && /ZGODA WŁAŚCICIELA ODRZUCONA/.test(r2.out), r2.out.slice(0, 200));
    ok('E1c. odmowa następuje PRZED zapisem — Genome bez zmian',
      !fs.existsSync(path.join(G, 'records', 'e2e')), 'powstała karta e2e mimo odmowy');
  }

  /* ═══ E2. zmiana dowolnego pola kontraktu po podpisie jest odrzucona ═══ */
  {
    const survived = [];
    for (const field of AP.CONTRACT_FIELDS) {
      const pkg = pkgFor('nonce-e2-' + field);
      const sig = sign(pkg);
      const mutated = Array.isArray(CONTRACT[field]) ? ['mech:podmieniony'] : (field === 'go_decision' ? 'STOP' : 'PODMIENIONE-PO-PODPISIE');
      const b = bundle('nonce-e2-' + field, { contract: { [field]: mutated }, signature: sig });
      const r = runIngest(b);
      if (r.code === 0) survived.push(field);
    }
    ok(`E2. mutacja każdego z ${AP.CONTRACT_FIELDS.length} pól Project Contract po podpisie jest odrzucona`,
      survived.length === 0, 'przeszły mimo mutacji: ' + survived.join(', '));
  }

  /* ═══ E6 (najpierw): pełny, poprawny ingest kończy się kodem 0 ═══ */
  let goodNonce = 'nonce-ok-' + Date.now();
  {
    const r = runIngest(bundle(goodNonce, { recordId: 'rec:e2e/ingest-ok' }));
    ok('E6. pełny ingest z poprawną zgodą na kopii realnego Genome kończy się kodem 0',
      r.code === 0 && /INGEST ZAPISANY/.test(r.out), r.out.slice(-400));
    ok('E6b. karta powstała i nonce trafił do rejestru',
      fs.existsSync(path.join(G, 'records', 'e2e', 'ingest-ok.md'))
      && fs.existsSync(path.join(G, '.approval-nonces.jsonl'))
      && fs.readFileSync(path.join(G, '.approval-nonces.jsonl'), 'utf8').includes(goodNonce),
      fs.existsSync(path.join(G, '.approval-nonces.jsonl')) ? fs.readFileSync(path.join(G, '.approval-nonces.jsonl'), 'utf8').slice(0, 200) : 'brak rejestru');
  }

  /* ═══ E3. drugi zapis z tym samym nonce jest odrzucony ═══ */
  {
    const r = runIngest(bundle(goodNonce, { recordId: 'rec:e2e/replay-probe' }));
    ok('E3. powtórne użycie tego samego nonce jest odrzucone (replay)',
      r.code !== 0 && /REPLAY ODRZUCONY/.test(r.out), r.out.slice(0, 300));
    ok('E3b. odrzucenie replay nie zostawia śladu w Genome',
      !fs.existsSync(path.join(G, 'records', 'e2e', 'replay-probe.md')));
  }

  /* ═══ E4. PLATE legalnie na świeżej strategii, BEZ SALT ═══ */
  {
    const brief = {
      audience_is_market: true, positioning_stated: true, positioning_consequences: false,
      needs_ongoing_communication: true, single_artifact: false,
      existing_strategy: { ref: 'rec:backtests/betterworkplace-salt-plate', source: 'records/backtests', approved_at: '2026-05-01' },
      continuity_horizon_days: 90, execution_capacity_days: 45, dominant_problem: 'percepcyjny', salt_approved: false,
    };
    const route = F.routeFrameworks(brief, { today: '2026-08-09' });
    const fg = R.foundationGate({ routing: route, salt_approval: null });
    ok('E4. PLATE działa legalnie na świeżej strategii bez SALT',
      route.decision === 'PLATE' && route.needs.salt === false && route.foundation === 'existing_strategy'
      && fg.can_proceed === true, JSON.stringify({ d: route.decision, f: route.foundation, g: fg.blockers }));
  }

  /* ═══ E5. BOTH wymaga akceptacji SALT przed PLATE ═══ */
  {
    const brief = {
      audience_is_market: true, positioning_stated: false, positioning_consequences: true,
      needs_ongoing_communication: true, single_artifact: false, existing_strategy: null,
      continuity_horizon_days: 90, execution_capacity_days: 60, dominant_problem: 'nieznany', salt_approved: false,
    };
    const route = F.routeFrameworks(brief, { today: '2026-08-09' });
    const before = R.foundationGate({ routing: route, salt_approval: null });
    const after = R.foundationGate({ routing: route, salt_approval: { state: 'verified' } });
    ok('E5a. BOTH: bez zatwierdzonego SALT bramka fundamentu nie przepuszcza PLATE',
      route.decision === 'BOTH' && route.order[0] === F.SALT && before.can_proceed === false
      && before.blockers.some(b => /zatwierdzonego fundamentu/.test(b)), JSON.stringify(before));
    ok('E5b. po podpisanej akceptacji SALT bramka przepuszcza', after.can_proceed === true, JSON.stringify(after));
    ok('E5c. bramka kontraktu NIE jest wymagana przed SALT (usunięta cyrkularność)',
      R.researchGate({ doublecheck: { verdict: 'PASS', blocks_contract: false } }).can_proceed === true
      && F.PROCESS_PHASES[0].phase === 'research' && F.PROCESS_PHASES[0].gate === 'researchGate'
      && F.PROCESS_PHASES.find(p => p.gate === 'contractGate').phase === 'contract',
      JSON.stringify(F.PROCESS_PHASES.map(p => p.phase + ':' + p.gate)));
  }

  /* ═══ E8. podmiana payloadu przy zachowanym podpisie i przeliczonym proposal_hash ═══ */
  {
    const nonce = 'nonce-e8-' + Date.now();
    const legit = bundle(nonce, { recordId: 'rec:e2e/payload-legit' });
    /* ten sam, PRAWIDŁOWY podpis; podmieniamy tylko to, co zostanie zapisane.
       runIngest przelicza zewnętrzny proposal_hash, więc stara bramka by to przepuściła. */
    const swapped = {
      ...legit,
      objects: objectsFor('rec:e2e/payload-PODMIENIONY', 999),
    };
    const r = runIngest(swapped);
    ok('E8a. podmiana object przy legalnym podpisie i przeliczonym proposal_hash → odmowa',
      r.code !== 0 && /PAYLOAD NIE ODPOWIADA ZGODZIE|payload_hash NIE ZGADZA/.test(r.out), r.out.slice(0, 300));
    ok('E8b. podmieniony payload nie zostawił śladu',
      !fs.existsSync(path.join(G, 'records', 'e2e', 'payload-PODMIENIONY.md')));

    /* to samo dla evidence i events */
    const withEv = { ...legit, evidence: [{ mechanism: 'mech:deterministic-spine', id: 'ev:e2e-x', type: 'backtest', date: '2026-08-09', source: 'rec:backtests/briefsync', direction: 'neutral', observation: 'dopisane po podpisie' }] };
    const withEvt = { ...legit, events: [{ kind: 'signal.observed', on: 'proj:briefsync', actor: 'test', note: 'dopisane po podpisie' }] };
    const r2 = runIngest(withEv), r3 = runIngest(withEvt);
    ok('E8c. dopisanie evidence po podpisie → odmowa', r2.code !== 0 && /PAYLOAD NIE ODPOWIADA ZGODZIE|payload_hash NIE ZGADZA/.test(r2.out), r2.out.slice(0, 200));
    ok('E8d. dopisanie eventu po podpisie → odmowa', r3.code !== 0 && /PAYLOAD NIE ODPOWIADA ZGODZIE|payload_hash NIE ZGADZA/.test(r3.out), r3.out.slice(0, 200));
    /* kontrola pozytywna: nietknięty payload z tym samym podpisem przechodzi */
    ok('E8e. nietknięty payload z tym samym podpisem przechodzi', runIngest(legit).code === 0);
  }

  /* ═══ E9. ZERO override klucza na ścieżce produkcyjnej ═══ */
  {
    const codeOnly = s => s.split('\n').filter(l => !/^\s*(\*|\/\*|\/\/)/.test(l)).join('\n');
    const src = codeOnly(fs.readFileSync(path.join(FINAL, 'lib', 'approval.js'), 'utf8'))
      + codeOnly(fs.readFileSync(path.join(SRC, 'ingest.js'), 'utf8'));
    ok('E9a. kod modułu zgody i writera nie zna GENOME_APPROVAL_KEY ani opts.keyPath',
      !/process\.env\.GENOME_APPROVAL_KEY/.test(src) && !/opts\.keyPath/.test(src),
      src.split('\n').filter(l => /GENOME_APPROVAL_KEY|opts\.keyPath/.test(l)).join(' | ').slice(0, 200));
    ok('E9b. kotwica zaufania jest POZA repo (~/.genome), a repo nie zawiera klucza publicznego',
      /os\.userInfo\(\)\.homedir/.test(fs.readFileSync(path.join(FINAL, 'lib', 'approval.js'), 'utf8'))
      && /PUBKEY_FILE = TRUST_DIR \? path\.join\(TRUST_DIR, 'approval-pubkey\.pem'\)/.test(fs.readFileSync(path.join(FINAL, 'lib', 'approval.js'), 'utf8'))
      && !fs.existsSync(path.join(FINAL, 'lib', 'approval-pubkey.pem')));
    ok('E9c. moduł nie potrafi podpisać — brak crypto.sign i brak odczytu klucza prywatnego',
      !/crypto\.sign\(/.test(fs.readFileSync(path.join(FINAL, 'lib', 'approval.js'), 'utf8'))
      && !/createPrivateKey/.test(fs.readFileSync(path.join(FINAL, 'lib', 'approval.js'), 'utf8')));
    /* podpis obcym kluczem — weryfikowany przez KOPIĘ modułu z kotwicą testową */
    const apDir = fs.mkdtempSync(path.join(tmp, 'ap-'));
    for (const f of fs.readdirSync(path.join(FINAL, 'lib'))) fs.copyFileSync(path.join(FINAL, 'lib', f), path.join(apDir, f));
    const anch = path.join(apDir, 'anchor'); fs.mkdirSync(anch);
    fs.writeFileSync(path.join(anch, 'approval-pubkey.pem'), E2E_PUB_PEM);
    const apSrc2 = fs.readFileSync(path.join(apDir, 'approval.js'), 'utf8')
      .replace(/function trustDir\(\) \{[\s\S]*?\n\}/, `function trustDir() { return ${JSON.stringify(anch)}; }   /* KOPIA TESTOWA */`);
    fs.writeFileSync(path.join(apDir, 'approval.js'), apSrc2);
    const APT = require(path.join(apDir, 'approval.js'));
    const foreign = crypto.generateKeyPairSync('ed25519');
    const pkg = pkgFor('e9-foreign', { payload_hash: AP.payloadHash({ objects: [] }) });
    const bad = { package: pkg, nonce: pkg.nonce, signature: crypto.sign(null, AP.signingBytes(pkg), foreign.privateKey).toString('hex') };
    ok('E9d. podpis obcym kluczem odrzucony przez kotwicę (kopia modułu, zero argumentu z kluczem)',
      APT.verifyApproval(bad, { objects: [] }, {}).state === 'invalid'
      && APT.loadPublicKey.length === 0, JSON.stringify(APT.verifyApproval(bad, { objects: [] }, {})).slice(0, 160));
    ok('E9e. rotacja klucza wymaga podpisu POPRZEDNIM kluczem',
      APT.verifyKeyRotation({ new_public_key_pem: E2E_PUB_PEM, signature: 'ab'.repeat(32), valid_from: '2026-09-01' }).ok === false);
  }

  /* ═══ E7. build na kopii po pełnym ingeście dalej przechodzi ═══ */
  {
    const r = spawnSync('node', [path.join(G, 'build.js'), '--check'], { encoding: 'utf8', env: { ...process.env, GENOME_DIR: G } });
    ok('E7. build --check na kopii po ingeście: exit 0', r.status === 0, (r.stdout || '').split('\n').slice(-3).join(' '));
  }
  /* E11 usunięte: realny deploy-bundle.json jest wykonywany przez PRAWDZIWY deploy.js
     w PRÓBIE B (test/run-deploy-tests.js, B1a–B1k) — razem z Evidence, przeliczeniem confidence
     i kolejnością zdarzeń. Duplikowanie tego przez ingest.js testowałoby niewłaściwego wykonawcę. */

  /* ═══ E10. STRAŻNIK KANONU ═══ */
  ok('E10. kanoniczne Genome bajtowo nietknięte przez cały zestaw', treeHash(GENOME) === CANON_BEFORE,
    `przed ${CANON_BEFORE.slice(0, 16)} · po ${treeHash(GENOME).slice(0, 16)}`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });

}

console.log('\n═══ TESTY END-TO-END ═══\n');
for (const r of res) console.log(`  ${r.c ? '✓' : '✗'} ${r.n}${r.d ? '\n      → ' + r.d : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
