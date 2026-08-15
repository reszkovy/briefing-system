#!/usr/bin/env node
/* ═══ TESTY FINALNEJ PROPOZYCJI (scalenie SALT/PLATE + Research/Measurement) ═══
 * Sekcje: S integralność podpisu · R research/direction · F routing · W karty i ID
 *         B build na kopii realnego Genome · G graf · N brak regresji · D dry-runy historyczne
 * Zero zapisu do kanonicznego Genome. Kopie robocze w katalogu tymczasowym, usuwane po teście.
 */
'use strict';
const path = require('path');
const fs = require('fs');
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
const FINAL = __moduleHome(HERE, GENOME);
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
const REPO = path.resolve(GENOME, '..', '..');
const R = require(path.join(FINAL, 'lib', 'research-contract.js'));
const F = require(path.join(FINAL, 'lib', 'strategy-frameworks.js'));
const AP_PROD = require(path.join(FINAL, 'lib', 'approval.js'));
/* Kopia `lib/approval.js` z przepisanym `trustDir()`. Produkcyjny moduł nie przyjmuje już
   żadnego argumentu z kluczem — jedynym sposobem na inne zaufanie jest inny plik modułu. */
function approvalWithAnchor(tmpBase, pubPem) {
  const dir = fs.mkdtempSync(path.join(tmpBase, 'ap-'));
  for (const f of fs.readdirSync(path.join(FINAL, 'lib'))) fs.copyFileSync(path.join(FINAL, 'lib', f), path.join(dir, f));
  const anchor = path.join(dir, 'anchor'); fs.mkdirSync(anchor);
  fs.writeFileSync(path.join(anchor, 'approval-pubkey.pem'), pubPem);
  const ap = path.join(dir, 'approval.js');
  let src = fs.readFileSync(ap, 'utf8').replace(/function trustDir\(\) \{[\s\S]*?\n\}/,
    `function trustDir() { return ${JSON.stringify(anchor)}; }   /* KOPIA TESTOWA */`);
  if (!src.includes('KOPIA TESTOWA')) throw new Error('nie udało się przepisać trustDir()');
  fs.writeFileSync(ap, src);
  return require(ap);
}

let AP;   /* ustawiane niżej: kopia z kotwicą testową */

let pass = 0, fail = 0; const res = [];
const ok = (n, c, d) => { c ? pass++ : fail++; res.push({ n, c, d: c ? '' : String(d || '').slice(0, 240) }); };
const TODAY = '2026-08-09';
const { publicKey: T_PUB, privateKey: T_PRIV } = crypto.generateKeyPairSync('ed25519');
const T_PUB_PEM = T_PUB.export({ type: 'spki', format: 'pem' });
/* Kopia robocza pochodzi z ZAMROŻONEGO fixture'u, nie z żywego kanonu — patrz
   node proposals/fixtures/fixture-recovery-input.js --regenerate. Hash kanonu zostaje jako strażnik. */
const FIXTURE_PRE_RECOVERY = path.join(GENOME, 'proposals', 'fixtures', 'recovery-input-synthetic');
const AP_TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-ap-'));
AP = approvalWithAnchor(AP_TMP, T_PUB_PEM);
process.on('exit', () => { try { fs.rmSync(AP_TMP, { recursive: true, force: true }); } catch {} });

const sign = pkg => crypto.sign(null, AP.signingBytes(pkg), T_PRIV).toString('hex');

const REC = (over = {}) => ({
  claim: 'Konkurent podaje pary językowe wprost na stronie',
  source_url: 'https://olgatlumaczy.pl/en/', source_title: 'Olga Skorupka',
  publisher: 'olgatlumaczy.pl', published_at: 'n/d', accessed_at: '2026-08-08',
  source_type: 'strona-firmy', primary_or_secondary: 'primary',
  observation: 'Sekcja "working languages: English, French, Spanish" w nagłówku',
  interpretation: 'Pary językowe są standardem niszy',
  confidence: 'high', contradicting_sources: [], limitations: 'jedna strona, nie próba',
  direction: 'supports',
  decision_impact: { changes: ['scope'], targets: ['zakres: sekcja "pary językowe"'] },
  ...over,
});
const METRIC = (over = {}) => ({
  decision_supported: 'czy rozszerzać zakres o kampanię płatną', metric: 'zapytania ofertowe/mies.',
  baseline: '3', target: '≥8', measurement_source: 'skrzynka kontakt@',
  measurement_method: 'zliczanie wątków z etykietą lead', measurement_date: '2026-11-01',
  resolution_owner: 'przemek', known_limitations: 'n/d', data_quality: 'verified',
  fallback_if_unavailable: 'liczenie ręczne z Gmaila', ...over,
});
const PKG = (over = {}) => ({
  claims: [{ kind: 'fact', text: REC().claim }],
  research: [REC()],
  routing: { decision: 'SALT', reasons: ['brak fundamentu'], gates: [], unresolved: [] },
  recommended_mechanisms: ['mech:competitive-benchmarking'],
  recommended_frameworks: ['wf:salt'],
  evidence_backed: ['mech:competitive-benchmarking', 'wf:salt'],
  metrics: [METRIC()],
  project_contract: { scope: 'strona + FAQ', non_scope: 'kampania płatna', baseline: 'n/d', outcome_owner: 'przemek', measurement_date: '2026-11-01' },
  predictions: [{ id: 'pred:1', claim: '≥5 zapytań/mies.', p: 0.6, deadline: '2026-11-01' }],
  approval_nonce: 'nonce-abc-123', approval_expires_at: '2026-09-09', payload_hash: 'PH-test',
  author: 'session:router', reviewer: 'przemek', ...over,
});
const CONTRACT = (over = {}) => ({
  client: 'cli:x', business_problem: 'problem', project_start: '2026-08-10', scope: 's', non_scope: 'ns',
  baseline: 'n/d', mechanisms: ['mech:a'], frameworks: ['wf:salt'], validation_plan: 'plan',
  outcome_owner: 'przemek', measurement_date: '2026-11-10', go_decision: 'GO', go_rationale: 'bo',
  prepared_by: 'session:router', decided_by: 'przemek', report_version: 'v1', contract_version: 'v1', ...over,
});
const BRIEF = (over = {}) => ({
  audience_is_market: true, positioning_stated: false, positioning_consequences: true,
  needs_ongoing_communication: false, single_artifact: false, existing_strategy: null,
  continuity_horizon_days: null, execution_capacity_days: null,
  dominant_problem: 'nieznany', salt_approved: false, ...over,
});


const OPT = { today: TODAY };

try {
  /* ═══ S. INTEGRALNOŚĆ PODPISU Ed25519 (blokery 1–2 rundy 4) ═══ */
  {
    const PAYLOAD = { events: [{ kind: 'signal.observed', on: 'proj:x', actor: 't' }], evidence: [], objects: [] };
    const basePkg = () => ({
      schema_version: AP.SCHEMA_VERSION, phase: 'contract',
      claims: [{ kind: 'fact', text: 'teza' }], research: [REC()],
      routing: { decision: 'SALT', reasons: ['brak fundamentu'], gates: [], unresolved: [] },
      recommended_mechanisms: ['mech:a'], recommended_frameworks: ['wf:salt'],
      metrics: [METRIC()], predictions: [{ id: 'pred:1', p: 0.6 }],
      project_contract: CONTRACT(), payload_hash: AP.payloadHash(PAYLOAD),
      nonce: 'n-1', expires_at: '2027-01-01',
    });
    const pkg = basePkg();
    const approvalOf = (p, sig) => ({ package: p, nonce: p.nonce, signature: sig !== undefined ? sig : sign(p), approved_by: 'przemek' });

    ok('S0. poprawny podpis Ed25519 daje verified',
      AP.verifyApproval(approvalOf(pkg), PAYLOAD, OPT).state === 'verified', JSON.stringify(AP.verifyApproval(approvalOf(pkg), PAYLOAD, OPT)));

    const sig = sign(pkg);
    const MUT = {
      'interpretacja rekordu': p => ({ ...p, research: [REC({ interpretation: 'inny wniosek' })] }),
      'ograniczenia': p => ({ ...p, research: [REC({ limitations: 'brak' })] }),
      'confidence rekordu': p => ({ ...p, research: [REC({ confidence: 'low' })] }),
      'decision_impact': p => ({ ...p, research: [REC({ decision_impact: { changes: ['none'] } })] }),
      'direction': p => ({ ...p, research: [REC({ direction: 'neutral' })] }),
      'claims': p => ({ ...p, claims: [{ kind: 'fact', text: 'inne' }] }),
      'decyzja routingu': p => ({ ...p, routing: { ...p.routing, decision: 'NONE' } }),
      'powody routingu': p => ({ ...p, routing: { ...p.routing, reasons: ['inny'] } }),
      'mechanizmy': p => ({ ...p, recommended_mechanisms: ['mech:a', 'mech:dopisany'] }),
      'frameworki': p => ({ ...p, recommended_frameworks: ['wf:salt', 'wf:plate'] }),
      'target metryki': p => ({ ...p, metrics: [METRIC({ target: '≥2' })] }),
      'nazwa metryki': p => ({ ...p, metrics: [METRIC({ metric: 'wyświetlenia' })] }),
      'predykcja': p => ({ ...p, predictions: [{ id: 'pred:1', p: 0.9 }] }),
      'faza': p => ({ ...p, phase: 'research' }),
      'nonce': p => ({ ...p, nonce: 'n-2' }),
      'termin ważności': p => ({ ...p, expires_at: '2028-01-01' }),
      'payload_hash': p => ({ ...p, payload_hash: 'PODMIENIONY' }),
      'wersja schematu': p => ({ ...p, schema_version: 'inna/1' }),
    };
    for (const f of AP_PROD.CONTRACT_FIELDS)
      MUT['kontrakt.' + f] = p => ({ ...p, project_contract: { ...p.project_contract, [f]: Array.isArray(CONTRACT()[f]) ? ['x'] : (f === 'go_decision' ? 'STOP' : 'PODMIENIONE') } });

    const survived = Object.entries(MUT).filter(([, mut]) => {
      const m = mut(pkg);
      return AP.verifyApproval({ package: m, nonce: m.nonce, signature: sig, approved_by: 'przemek' }, PAYLOAD, OPT).state === 'verified';
    }).map(([n]) => n);
    ok(`S1. mutacja KAŻDEGO z ${Object.keys(MUT).length} pól pakietu (w tym ${AP_PROD.CONTRACT_FIELDS.length} pól kontraktu) unieważnia podpis`,
      survived.length === 0, 'przetrwały: ' + survived.join(', '));

    ok('S2. kolejność kluczy nie wpływa na podpis (kanonizacja)',
      AP.fingerprint(pkg) === AP.fingerprint(Object.fromEntries(Object.entries(pkg).reverse())));
    ok('S3. zgoda wygasła jest odrzucana',
      AP.verifyApproval(approvalOf({ ...pkg, expires_at: '2026-08-01' }), PAYLOAD, OPT).state === 'expired');
    ok('S4. brak nonce / niezgodny nonce jest odrzucany',
      AP.verifyApproval(approvalOf({ ...pkg, nonce: '' }), PAYLOAD, OPT).state === 'invalid'
      && AP.verifyApproval({ package: pkg, nonce: 'inny', signature: sig }, PAYLOAD, OPT).state === 'invalid');
    ok('S5. podmiana payloadu przy ważnym podpisie → payload_mismatch',
      AP.verifyApproval(approvalOf(pkg), { events: [], evidence: [], objects: [{ id: 'x' }] }, OPT).state === 'payload_mismatch');
    ok('S6. podpis obcym kluczem odrzucony',
      AP.verifyApproval(approvalOf(pkg, crypto.sign(null, AP.signingBytes(pkg), crypto.generateKeyPairSync('ed25519').privateKey).toString('hex')), PAYLOAD, OPT).state === 'invalid');
    const apSrc = fs.readFileSync(path.join(FINAL, 'lib', 'approval.js'), 'utf8');
    const code = apSrc.split('\n').filter(l => !/^\s*(\*|\/\*|\/\/)/.test(l)).join('\n');
    ok('S7. moduł zgody: zero crypto.sign, zero klucza prywatnego, zero override ścieżki klucza',
      !/crypto\.sign\(/.test(code) && !/createPrivateKey/.test(code)
      && !/process\.env/.test(code) && !/writeFileSync|appendFileSync/.test(code)
      && !/publicKeyPem/.test(code),   /* ZERO punktu wstrzyknięcia — także argumentem */
      code.split('\n').filter(l => /crypto\.sign|PrivateKey|GENOME_APPROVAL_KEY|writeFileSync/.test(l)).join(' | ').slice(0, 200));
    ok('S8. payload_hash jest polem podpisywanym', AP_PROD.SIGNED_FIELDS.includes('payload_hash') && AP_PROD.SIGNED_FIELDS.includes('project_contract'));
    ok('S9. payloadHash deterministyczny, niezależny od kolejności kluczy',
      AP.payloadHash({ objects: [{ a: 1, b: 2 }] }) === AP.payloadHash({ objects: [{ b: 2, a: 1 }] })
      && AP.payloadHash({ objects: [{ a: 1 }] }) !== AP.payloadHash({ objects: [{ a: 2 }] }));
  }

  /* ═══ R. RESEARCH I KIERUNEK DOWODOWY (wymóg 6.5) ═══ */
  {
    const contra = REC({
      claim: 'Nisza NIE używa liczb doświadczenia', direction: 'contradicts',
      interpretation: 'nasza teza o liczbach jest wątpliwa', confidence: 'medium',
      decision_impact: { changes: ['scope', 'decision'], targets: ['zakres: usunąć sekcję liczb', 'decyzja: nie obiecywać stażu'] },
    });
    const dcMixed = R.doublecheck(PKG({
      claims: [{ kind: 'fact', text: REC().claim }, { kind: 'fact', text: contra.claim }],
      research: [REC(), contra],
    }), OPT);
    ok('R1. research contradicts, który zmienia decyzję, NIE jest traktowany jak potwierdzenie tezy',
      !dcMixed.findings.some(f => /dobierany pod tezę/.test(f.what))
      && dcMixed.research_summary.directions.contradicts === 1
      && dcMixed.research_summary.impactful === 2,
      JSON.stringify(dcMixed.research_summary));

    const allSupports = R.doublecheck(PKG({
      claims: [1, 2, 3].map(i => ({ kind: 'fact', text: 'claim ' + i })),
      research: [1, 2, 3].map(i => REC({ claim: 'claim ' + i, direction: 'supports', decision_impact: { changes: ['scope'], targets: ['z' + i] } })),
    }), OPT);
    ok('R2. wszystkie rekordy supports i zero contradicts/neutral → alarm jednostronności',
      allSupports.findings.some(f => /dobierany pod tezę/.test(f.what)), JSON.stringify(allSupports.research_summary));

    const withNeutral = R.doublecheck(PKG({
      claims: [1, 2, 3].map(i => ({ kind: 'fact', text: 'claim ' + i })),
      research: [REC({ claim: 'claim 1', direction: 'supports', decision_impact: { changes: ['scope'], targets: ['z1'] } }),
        REC({ claim: 'claim 2', direction: 'supports', decision_impact: { changes: ['scope'], targets: ['z2'] } }),
        REC({ claim: 'claim 3', direction: 'neutral', decision_impact: { changes: ['scope'], targets: ['z3'] } })],
    }), OPT);
    ok('R3. jeden rekord neutral gasi alarm jednostronności',
      !withNeutral.findings.some(f => /dobierany pod tezę/.test(f.what)), JSON.stringify(withNeutral.research_summary.directions));

    ok('R4. brak pola direction odrzuca rekord', !R.validateResearchRecord(REC({ direction: undefined }), OPT).ok);
    ok('R5. direction spoza słownika odrzuca rekord', !R.validateResearchRecord(REC({ direction: 'positive' }), OPT).ok);
    ok('R6. pusty zestaw metryk daje BLOCKED', R.measurementReadiness([]).measurement_readiness === 'BLOCKED');
    ok('R7. nieważny rekord nie liczy się jako impactful',
      (() => { const s = R.summarizeResearch([REC(), REC({ source_url: '' })], OPT); return s.valid === 1 && s.impactful === 1 && s.invalid === 1; })());
  }

  /* ═══ F. ROUTING (wymóg 6.3, 6.4, 6.12) ═══ */
  {
    const unres = F.routeFrameworks(BRIEF({ needs_ongoing_communication: null }), OPT);
    ok('F1. needs_ongoing_communication:null → UNRESOLVED, nie ciche pominięcie PLATE',
      unres.decision === 'UNRESOLVED' && unres.needs.plate === false && unres.blocked === true
      && unres.unresolved.some(u => /needs_ongoing_communication/.test(u)), JSON.stringify(unres));
    ok('F2. UNRESOLVED blokuje kontrakt',
      R.contractGate({ doublecheck: { verdict: 'PASS', blocks_contract: false, independent_review: 'verified' }, measurement: R.measurementReadiness([METRIC()]), routing: unres }).can_freeze === false);

    for (const f of F.CRITICAL_FIELDS)
      ok(`F3.${f} — null w polu krytycznym daje UNRESOLVED`, F.routeFrameworks(BRIEF({ [f]: null }), OPT).decision === 'UNRESOLVED');

    const fake = F.routeFrameworks(BRIEF({ existing_strategy: { ref: 'mamy strategię', source: 'mail', approved_at: '2026-01-01' }, needs_ongoing_communication: true }), OPT);
    const noDate = F.routeFrameworks(BRIEF({ existing_strategy: { ref: 'rec:strategia/x', source: 'repo' }, needs_ongoing_communication: true }), OPT);
    const stale = F.routeFrameworks(BRIEF({ existing_strategy: { ref: 'rec:strategia/x', source: 'repo', approved_at: '2024-01-01' }, needs_ongoing_communication: true }), OPT);
    const challenged = F.routeFrameworks(BRIEF({ existing_strategy: { ref: 'rec:strategia/x', source: 'repo', approved_at: '2026-05-01', challenged_by_brief: true }, needs_ongoing_communication: true }), OPT);
    const real = F.routeFrameworks(BRIEF({ positioning_stated: true, positioning_consequences: false, dominant_problem: 'percepcyjny', existing_strategy: { ref: 'rec:strategia/bw-2026', source: 'records/strategie', approved_at: '2026-05-01' }, needs_ongoing_communication: true, execution_capacity_days: 45 }), OPT);
    ok('F4. fałszywy strategy ref nie daje fundamentu', fake.decision === 'BOTH' && fake.reasons.some(r => /nie jest sprawdzalnym odniesieniem/.test(r)), JSON.stringify(fake.decision));
    ok('F5. brak daty zatwierdzenia nie daje fundamentu', noDate.decision === 'BOTH' && noDate.reasons.some(r => /approved_at nie jest realną datą/.test(r)));
    ok('F6. strategia starsza niż 12 mies. nie jest fundamentem', stale.decision === 'BOTH' && stale.reasons.some(r => /wymaga odświeżenia/.test(r)));
    ok('F7. strategia zakwestionowana przez brief nie jest fundamentem', challenged.decision === 'BOTH' && challenged.reasons.some(r => /kwestionuje/.test(r)));
    ok('F8. świeże, sprawdzalne odniesienie daje PLATE bez SALT', real.decision === 'PLATE' && real.gates.some(g => g.gate === 'PLATE_REQUIRES_FOUNDATION' && g.status === 'OK'), JSON.stringify(real.decision));

    const both = F.routeFrameworks(BRIEF({ needs_ongoing_communication: true, execution_capacity_days: 60 }), OPT);
    ok('F9. BOTH wymusza kolejność SALT → PLATE',
      both.decision === 'BOTH' && both.order[0] === F.SALT && both.order[1] === F.PLATE
      && both.gates.some(g => g.status === 'SEQUENCED'), JSON.stringify(both.order));

    const orphanPlate = F.routeFrameworks(BRIEF({ positioning_stated: true, positioning_consequences: false, dominant_problem: 'percepcyjny', needs_ongoing_communication: true }), OPT);
    ok('F10. PLATE bez fundamentu i bez przesłanek do SALT jest zablokowany',
      orphanPlate.blocked === true && orphanPlate.gates.some(g => g.status === 'BLOCKED'), JSON.stringify(orphanPlate.gates));

    ok('F11. horyzont ≥90 dni włącza PLATE mimo braku deklaracji w briefie',
      F.routeFrameworks(BRIEF({ continuity_horizon_days: 120 }), OPT).needs.plate === true);
    ok('F12. brief z pominiętym polem jest odrzucany, nie zgadywany',
      F.routeFrameworks({ audience_is_market: true }, OPT).decision === 'INVALID_BRIEF');
    ok('F13. zdolność < 30 dni daje bramkę LIMIT',
      F.routeFrameworks(BRIEF({ needs_ongoing_communication: true, execution_capacity_days: 10 }), OPT).gates.some(g => g.gate === 'PLATE_CAPACITY' && /fikcją/.test(g.detail)));
    ok('F14. problem nie-percepcyjny daje bramkę uczciwości',
      F.routeFrameworks(BRIEF({ dominant_problem: 'produktowy' }), OPT).gates.some(g => g.gate === 'HONESTY_PROBLEM_TYPE'));
    ok('F15. moduł nie zawiera treści domenowej frameworków (jedno źródło prawdy)',
      !/Sytuacja[\s\S]{0,200}Odbiorcy[\s\S]{0,200}Przewaga/.test(fs.readFileSync(path.join(FINAL, 'lib', 'strategy-frameworks.js'), 'utf8'))
      && F.CONTENT_SOURCE.includes('workflows'));

    /* rozliczenie po fakcie */
    ok('F16. framework bez zmiany decyzji dostaje payoff NONE',
      F.assessFrameworkPayoff({ decisions_changed: [], findings: [] }).payoff === 'NONE'
      && F.assessFrameworkPayoff({ decisions_changed: ['zakres: usunięto kampanię'], findings: [{ status: 'ZWALIDOWANE' }] }).payoff === 'CONFIRMED');
  }

  /* ═══ W. KARTY, ID, BRAK DUPLIKATÓW (wymóg 6.6, 6.7, 6.8) ═══ */
  {
    const wfDir = path.join(SRC, 'workflows');
    const files = fs.readdirSync(wfDir).filter(f => f.endsWith('.md'));
    const texts = files.map(f => ({ f, t: fs.readFileSync(path.join(wfDir, f), 'utf8') }));
    ok('W1. karty workflow NIE zawierają confidence ani evidence',
      texts.every(x => !/^confidence:/m.test(x.t) && !/^evidence:/m.test(x.t)),
      texts.filter(x => /^(confidence|evidence):/m.test(x.t)).map(x => x.f).join(','));

    /* Skanujemy SCALONĄ propozycję, nie cały korzeń. Uruchomiony z kanonu `FINAL` to całe
       Genome, więc skan wchodził w `proposals/` z historycznymi zestawami wejściowymi, gdzie
       długie ID występują legalnie — i dawał fałszywy FAIL. */
    const MERGED = __firstExisting(path.join(GENOME, 'proposals', 'final-salt-plate'), FINAL);
    const allFinal = [];
    (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : allFinal.push(p); } })(MERGED);
    const longIds = allFinal.filter(p => /\.(md|js)$/.test(p) && !/INPUT-HASHES|RAPORT|run-final-tests/.test(p))
      .filter(p => /wf:(salt-strategic-diagnosis|plate-communication-plan)/.test(fs.readFileSync(p, 'utf8')));
    ok('W2. nigdzie nie ma długich ID wf:salt-strategic-diagnosis / wf:plate-communication-plan',
      longIds.length === 0, longIds.map(p => path.relative(MERGED, p)).join(', '));

    const ids = texts.map(x => (x.t.match(/^id:\s*"([^"]+)"/m) || [])[1]);
    ok('W3. dokładnie jedna karta SALT i jedna PLATE, ID krótkie',
      ids.length === 2 && ids.includes('wf:salt') && ids.includes('wf:plate'), ids.join(','));

    const mech = fs.readFileSync(path.join(SRC, 'mechanisms', 'strategy-before-execution.md'), 'utf8');
    ok('W4. karta mechanizmu: emerging, BEZ zaszytego evidence (wchodzi przez writer Evidence)',
      /^status: "emerging"/m.test(mech) && !/^evidence: \[\{/m.test(mech)
      && /"evidence_strength": \{"n": 0/.test(mech) && !/validated/.test(mech.split('---')[1] || ''),
      'karta mechanizmu');

    const plate = texts.find(x => x.f === 'plate.md').t;
    ok('W5a. PLATE NIE deklaruje relacji requires → wf:salt', !/"requires"/.test(plate));
    ok('W5b. PLATE ma pole requires_input opisujące ALTERNATYWĘ fundamentu',
      /^requires_input:/m.test(plate) && /alternatywa, nie jedno źródło/i.test(plate) && /wf:salt/.test(plate));
    ok('W5c. karty i router mówią to samo: SALT jest producentem fundamentu, nie warunkiem koniecznym',
      /nie jest warunkiem koniecznym/.test(texts.find(x => x.f === 'salt.md').t));
    const saltSrc = texts.find(x => x.f === 'salt.md').t;
    ok('W5d. guard SALT żąda researchGate, nie contractGate (usunięta cyrkularność)',
      /G1 — Research gate: researchGate\(\) musi zwrócić can_proceed/.test(saltSrc)
      && /to NIE jest contractGate/.test(saltSrc), 'guard G1 karty SALT');
    const mechSrc = fs.readFileSync(path.join(SRC, 'mechanisms', 'strategy-before-execution.md'), 'utf8');
    /* Pakiet wdrożeniowy jest artefaktem PROPOZYCJI — po wdrożeniu zostaje w `proposals/`,
       a nie w korzeniu Genome. Szukamy go w obu miejscach. */
    const depPath = __firstExisting(path.join(FINAL, 'deploy-bundle.json'),
      path.join(GENOME, 'proposals', 'final-salt-plate', 'deploy-bundle.json'));
    const dep = JSON.parse(fs.readFileSync(depPath, 'utf8'));
    ok('W5e. Evidence w pakiecie wdrożeniowym: 2 wpisy, każdy z jawnym direction, BW=neutral, tłumacz=limits',
      dep.evidence.length === 2 && dep.evidence.every(e => !!e.direction)
      && dep.evidence.find(e => /bw$/.test(e.id)).direction === 'neutral'
      && dep.evidence.find(e => /tlumacz$/.test(e.id)).direction === 'limits',
      JSON.stringify(dep.evidence.map(e => e.id + ':' + e.direction)));
    ok('W5f. Evidence NIE jest zaszyte w karcie mechanizmu (przechodzi przez input.evidence)',
      !/^evidence: \[\{/m.test(mech));

    for (const need of ['trigger', 'context', 'anti_context', 'inputs', 'outputs', 'guards', 'failure_conditions', 'success_conditions', 'provenance', 'next_use', 'postmortem_accounting'])
      ok(`W6.${need} — obie karty mają pole`, texts.every(x => new RegExp('^' + need + ':', 'm').test(x.t)),
        texts.filter(x => !new RegExp('^' + need + ':', 'm').test(x.t)).map(x => x.f).join(','));
  }

  /* ═══ B/G/N. BUILD NA KOPII REALNEGO GENOME + GRAF + BRAK REGRESJI (wymóg 6.9–6.11) ═══ */
  {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'genome-final-'));
    const probe = path.join(tmp, 'genome');
    fs.cpSync(FIXTURE_PRE_RECOVERY, probe, { recursive: true });
    /* baseline PRZED */
    const before = execFileSync('node', [path.join(probe, 'build.js'), '--check'], { cwd: probe, encoding: 'utf8' });
    const numBefore = (before.match(/(\d+) obiektów · (\d+) zdarzeń · (\d+) błędów · (\d+) ostrzeżeń/) || []).slice(1).map(Number);

    /* wgraj propozycję */
    for (const f of fs.readdirSync(path.join(SRC, 'workflows'))) fs.copyFileSync(path.join(SRC, 'workflows', f), path.join(probe, 'workflows', f));
    for (const f of fs.readdirSync(path.join(SRC, 'mechanisms'))) fs.copyFileSync(path.join(SRC, 'mechanisms', f), path.join(probe, 'mechanisms', f));
    for (const f of fs.readdirSync(path.join(SRC, 'records', 'backtests'))) fs.copyFileSync(path.join(SRC, 'records', 'backtests', f), path.join(probe, 'records', 'backtests', f));
    const bjs = path.join(probe, 'build.js');
    let after = '', code = 0;
    try { after = execFileSync('node', [bjs, '--check'], { cwd: probe, encoding: 'utf8' }); } catch (e) { after = (e.stdout || '') + (e.stderr || ''); code = e.status; }
    const numAfter = (after.match(/(\d+) obiektów · (\d+) zdarzeń · (\d+) błędów · (\d+) ostrzeżeń/) || []).slice(1).map(Number);
    ok('B1. build na kopii realnego Genome: zero nowych błędów',
      code === 0 && numAfter[2] === 0 && numAfter[2] === numBefore[2], `przed ${numBefore.join('/')} po ${numAfter.join('/')} code=${code}`);
    ok('B2. zero nowych ostrzeżeń', numAfter[3] === numBefore[3], `przed ${numBefore[3]} po ${numAfter[3]}`);
    ok('B3. przybyło dokładnie 5 obiektów (2 workflow + 1 mechanizm + 2 Recordy)',
      numAfter[0] - numBefore[0] === 5, `${numBefore[0]} → ${numAfter[0]}`);

    ok('B4. propozycja NIE wymaga zmiany słownika relacji (brak fałszywej krawędzi requires)',
      code === 0 && !/relacja spoza słownika/.test(after), after.split('\n').filter(l => /✗/.test(l))[0]);

    /* graf */
    execFileSync('node', [bjs], { cwd: probe, encoding: 'utf8' });
    const g = JSON.parse(fs.readFileSync(path.join(probe, 'dist', 'graph.json'), 'utf8'));
    const wfNodes = g.nodes.filter(n => String(n.id).startsWith('wf:')).map(n => n.id).sort();
    const badEdge = g.edges.find(e => e.source === 'wf:plate' && e.target === 'wf:salt' && e.relation === 'requires');
    const relEdge = g.edges.find(e => e.source === 'wf:plate' && e.target === 'wf:salt' && e.relation === 'related');
    ok('G1. graf zawiera dokładnie wf:plate i wf:salt', JSON.stringify(wfNodes) === JSON.stringify(['wf:plate', 'wf:salt']), wfNodes.join(','));
    ok('G2. graf NIE zawiera fałszywej krawędzi wf:plate --requires--> wf:salt (SALT to jedna z DWÓCH dróg do fundamentu)',
      !badEdge && Boolean(relEdge), badEdge ? 'krawędź requires istnieje — fałszuje alternatywę' : 'brak krawędzi related');
    const recEdges = g.edges.filter(e => /^rec:backtests\/(betterworkplace-salt-plate|marka-tlumacz-salt-gap)/.test(e.source) && e.relation === 'attached_to');
    ok('G3. Recordy backtestów mają krawędź attached_to → Project',
      recEdges.length === 2 && recEdges.every(e => e.target.startsWith('proj:')), JSON.stringify(recEdges.map(e => e.source + '→' + e.target)));
    /* Krawędzie Project→Mechanism powstają dopiero PO dodaniu Evidence przez writer,
       więc sprawdza je PRÓBA B (run-deploy-tests.js: B1c, B1d, B1j) na realnym wdrożeniu.
       Tutaj sprawdzamy tylko, że wgranie samych kart nie tworzy ich przedwcześnie. */
    ok('G4. same karty (bez Evidence) NIE tworzą krawędzi Project→Mechanism — powstają z Evidence',
      (g.project_mechanism || []).filter(x => x.target === 'mech:strategy-before-execution').length === 0,
      JSON.stringify((g.project_mechanism || []).filter(x => x.target === 'mech:strategy-before-execution')));

    /* brak regresji istniejących zestawów */
    /* ZERO tolerancji: każdy test potomny musi zwrócić exit 0, zero FAIL i PUSTY stderr.
       Testy migracji uruchamiamy z propozycji (zamrożony fixture sprzed migracji). */
    const CHILDREN = [
      ['N1. graf', path.join(probe, 'test', 'run-graph-tests.js'), probe],
      ['N2. writer', path.join(FINAL, 'test', 'run-tests.js'), FINAL],
      ['N3. bramka Project Contract', path.join(FINAL, 'test', 'run-gate-tests.js'), FINAL],
      ['N4. migracja (zamrożony fixture sprzed migracji)', path.join(FINAL, 'test', 'run-migration-tests.js'), FINAL],
      ['N5. end-to-end warstwy zapisu', path.join(FINAL, 'test', 'run-e2e-tests.js'), FINAL],
    ];
    for (const [n, p, cwd] of CHILDREN) {
      if (!fs.existsSync(p)) { ok(n, false, 'brak pliku testu'); continue; }
      const r = require('child_process').spawnSync('node', [p], { cwd, encoding: 'utf8' });
      const m = (r.stdout || '').match(/(\d+) PASS · (\d+) FAIL/);
      const cond = r.status === 0 && m && Number(m[2]) === 0 && (r.stderr || '').trim() === '';
      ok(n, cond, `exit=${r.status} · ${m ? m[0] : 'brak podsumowania'} · stderr=${(r.stderr || '').trim().slice(0, 120) || 'pusty'}`);
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  /* ═══ K. PEŁNY PROJECT CONTRACT I FAZY ═══ */
  {
    const FULL = {
      client: 'cli:x', business_problem: 'problem', project_start: '2026-08-10', scope: 's', non_scope: 'ns',
      baseline: 'n/d', mechanisms: ['mech:a'], frameworks: ['wf:salt'], validation_plan: 'plan',
      outcome_owner: 'przemek', measurement_date: '2026-11-10', go_decision: 'GO', go_rationale: 'bo',
      prepared_by: 'session:router', decided_by: 'przemek', report_version: 'v1', contract_version: 'v1',
    };
    ok('K1. kompletny Project Contract przechodzi', AP.validateProjectContract(FULL).ok, JSON.stringify(AP.validateProjectContract(FULL).errors));
    const missing = AP_PROD.CONTRACT_FIELDS.filter(f => { const c = { ...FULL }; delete c[f]; return AP.validateProjectContract(c).ok; });
    ok(`K2. brak któregokolwiek z ${AP_PROD.CONTRACT_FIELDS.length} pól kontraktu jest wykrywany`, missing.length === 0, 'niewykryte braki: ' + missing.join(', '));
    ok('K3. agent nie może być decided_by', !AP.validateProjectContract({ ...FULL, decided_by: 'session:router', prepared_by: 'przemek' }).ok);
    ok('K4. prepared_by ≠ decided_by', !AP.validateProjectContract({ ...FULL, decided_by: 'przemek', prepared_by: 'przemek' }).ok);
    ok('K5. go_decision tylko GO|REVISE|STOP', !AP.validateProjectContract({ ...FULL, go_decision: 'MOŻE' }).ok);
    ok('K6. contractGate wykrywa niekompletny kontrakt',
      R.contractGate({ doublecheck: { blocks_contract: false, independent_review: 'verified' }, measurement: R.measurementReadiness([METRIC()]), project_contract: { client: 'cli:x' } }).can_freeze === false);
    ok('K7. fazy: researchGate przed SALT, contractGate dopiero na końcu',
      F.PROCESS_PHASES.map(p => p.phase).join('>') === 'research>salt_draft>foundation>plate>contract>go');
  }

  /* ═══ D. DRY-RUNY HISTORYCZNE (wymóg 6.12) ═══ */
  {
    const CASES = [
      ['proj:teambudget (BetterWorkplace)', BRIEF({ needs_ongoing_communication: true, execution_capacity_days: 60 }), 'BOTH'],
      ['proj:marka-tlumacz', BRIEF(), 'SALT'],
      ['proj:osada-orle-deck-morisson', BRIEF({ positioning_stated: true, positioning_consequences: false, dominant_problem: 'percepcyjny', existing_strategy: { ref: 'cli:osada-orle', source: 'Figma tXqtp37NOWPGchjsKCvf8d + brand essence', approved_at: '2026-03-01' }, needs_ongoing_communication: true, execution_capacity_days: 25 }), 'PLATE'],
      ['proj:zdrofit-cwicz-w-zieleni', BRIEF({ positioning_stated: true, positioning_consequences: false, dominant_problem: 'percepcyjny', single_artifact: true, existing_strategy: { ref: 'cli:benefit-zdrofit', source: 'system marki Zdrofit', approved_at: '2026-01-15' } }), 'NONE'],
      ['proj:briefsync', BRIEF({ audience_is_market: false }), 'NONE'],
    ];
    for (const [name, brief, expect] of CASES) {
      const r = F.routeFrameworks(brief, OPT);
      ok(`D. ${name} → ${expect}`, r.decision === expect, `dostałem ${r.decision}: ${JSON.stringify(r.reasons)}`);
    }
  }

  /* ═══ H. OCHRONA PRZED KOLIZJĄ ═══ */
  {
    /* Artefakt PROPOZYCJI (kontrola kolizji przy scalaniu) — po wdrożeniu zostaje w `proposals/`. */
    const hashFile = __firstExisting(path.join(FINAL, 'INPUT-HASHES.txt'),
      path.join(GENOME, 'proposals', 'final-salt-plate', 'INPUT-HASHES.txt'));
    ok('H1. zapisane hashe zestawów wejściowych istnieją', fs.existsSync(hashFile) && fs.readFileSync(hashFile, 'utf8').split('\n').filter(Boolean).length >= 20);
    let drift = [];
    for (const line of fs.readFileSync(hashFile, 'utf8').split('\n').filter(Boolean)) {
      const [h, rel] = line.trim().split(/\s+/);
      const abs = path.resolve(GENOME, 'proposals', rel.replace(/^\.\//, ''));
      if (!fs.existsSync(abs)) { drift.push(rel + ' (USUNIĘTY)'); continue; }
      const now = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
      if (now !== h) drift.push(rel + ' (ZMIENIONY)');
    }
    ok('H2. żaden zestaw wejściowy nie zmienił się w trakcie scalania', drift.length === 0, drift.join(', '));
  }

  /* ═══ P. ŚCIEŻKI PRODUKCYJNE ═══ */
  {
    /* Skille w propozycji leżą w `<propozycja>/skills`; po wdrożeniu w `<repo>/.claude/skills`.
       ROUTER.md w obu układach jest w katalogu modułów. */
    const skillsDir = __firstExisting(path.join(FINAL, 'skills'),
      path.join(REPO, '.claude', 'skills'),
      path.join(GENOME, 'proposals', 'final-salt-plate', 'skills'));
    const docs = [path.join(skillsDir, 'mechanism-router', 'SKILL.md'),
      path.join(skillsDir, 'research-benchmark', 'SKILL.md'),
      path.join(FINAL, 'ROUTER.md')];
    const bad = docs.filter(f => /proposals\//.test(fs.readFileSync(f, 'utf8')));
    ok('P1. Router, ROUTER.md i research-benchmark wskazują wyłącznie lokalizacje produkcyjne',
      bad.length === 0, bad.map(f => path.basename(f)).join(', '));
    const rt = fs.readFileSync(path.join(skillsDir, 'mechanism-router', 'SKILL.md'), 'utf8');
    ok('P2. skill Routera nie duplikuje logiki SALT/PLATE (woła moduł)',
      /routeFrameworks\(\)/.test(rt) && /Nie odtwarzaj tych reguł/.test(rt) && !/positioning_consequences === true/.test(rt));
  }
  /* ═══ Z. STRAŻNIK KANONU ═══ */
  ok('Z1. kanoniczne Genome bajtowo nietknięte przez cały zestaw', treeHash(GENOME) === CANON_BEFORE,
    `przed ${CANON_BEFORE.slice(0, 16)} · po ${treeHash(GENOME).slice(0, 16)}`);
} finally { /* brak klucza do sprzątania — Ed25519, klucz prywatny tylko w pamięci testu */ }

console.log('\n═══ TESTY FINALNEJ PROPOZYCJI ═══\n');
for (const r of res) console.log(`  ${r.c ? '✓' : '✗'} ${r.n}${r.d ? '\n      → ' + r.d : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
