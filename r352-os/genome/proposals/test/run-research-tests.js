#!/usr/bin/env node
/* ═══ TESTY: Research · Measurement · Doublecheck · SALT/PLATE ═══
 * Sekcja A: kontrakty z pierwszej dyrektywy.
 * Sekcja B: testy ADWERSARYJNE — po jednym na każdy bloker audytu 09.08.
 * Sekcja C: pełny przebieg Router → Research → Measurement → Doublecheck → Project Contract.
 * Sekcja D: routing SALT/PLATE.
 * Zero wpływu na kanoniczne Genome.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const R = require('../lib/research-contract.js');
const F = require('../lib/framework-router.js');

let pass = 0, fail = 0; const res = [];
const ok = (n, c, d) => { c ? pass++ : fail++; res.push({ n, c, d: c ? '' : String(d || '').slice(0, 220) }); };

const REC = (over = {}) => ({
  claim: 'Konkurent podaje pary językowe wprost na stronie',
  source_url: 'https://olgatlumaczy.pl/en/', source_title: 'Olga Skorupka — Conference Interpreter',
  publisher: 'olgatlumaczy.pl', published_at: 'n/d', accessed_at: '2026-08-08',
  source_type: 'strona-firmy', primary_or_secondary: 'primary',
  observation: 'Sekcja "working languages: English, French, Spanish" widoczna w nagłówku',
  interpretation: 'Pary językowe są standardem niszy, brak = brak kwalifikacji dla klienta',
  confidence: 'high', contradicting_sources: [], limitations: 'jedna strona, nie próba',
  decision_impact: { changes: ['scope'], targets: ['zakres: sekcja "pary językowe"'], note: 'do kontraktu i do wywiadu' },
  ...over,
});
const METRIC = (over = {}) => ({
  decision_supported: 'czy rozszerzać zakres o kampanię płatną', metric: 'zapytania ofertowe/mies.',
  baseline: '3', target: '≥8', measurement_source: 'skrzynka kontakt@ + formularz',
  measurement_method: 'zliczanie wątków oznaczonych etykietą "lead"', measurement_date: '2026-11-01',
  resolution_owner: 'przemek', known_limitations: 'n/d', data_quality: 'partial',
  fallback_if_unavailable: 'liczenie ręczne z Gmaila', ...over,
});
const BRIEF = (over = {}) => ({
  audience_is_market: true, audience_defined: false, positioning_documented: false,
  perception_change_named: false, strategy_approved_ref: null, needs_ongoing_communication: false,
  scope_is_single_format: false, execution_capacity_days: null, known_problem_class: 'nieznany', ...over,
});
const TODAY = { today: '2026-08-09' };

/* ═══════════ A. KONTRAKTY BAZOWE ═══════════ */
{
  let out = '', code = 0;
  try { out = execFileSync('node', [path.resolve(__dirname, '../../sync-skills.js'), '--check'], { encoding: 'utf8' }); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); code = e.status; }
  ok('A1. .claude/skills i .agents/skills bez rozjazdu', code === 0 && /spójne/.test(out), out.slice(0, 150));
}
{
  const v = R.validateResearchRecord(REC({ source_url: '' }), TODAY);
  const d = R.doublecheck({ claims: [{ kind: 'fact', text: 'X rośnie' }], research: [], recommended_mechanisms: [] }, TODAY);
  ok('A2. research bez źródła nie przechodzi Doublecheck', !v.ok && d.verdict === 'REVISE' && d.blocks_contract, JSON.stringify(d.findings[0]));
}
{
  const v = R.validateResearchRecord(REC({ observation: 'to samo', interpretation: 'to samo' }), TODAY);
  ok('A3. fakt i interpretacja są osobnymi polami', !v.ok && v.errors.some(e => /rozdzielone/.test(e)));
}
{
  const bad = R.validateResearchRecord(REC({ contradicting_sources: ['https://inne.pl/r'], confidence: 'high', limitations: 'n/d' }), TODAY);
  const good = R.validateResearchRecord(REC({ contradicting_sources: ['https://inne.pl/r'], confidence: 'medium', limitations: 'sprzeczność z raportem X' }), TODAY);
  ok('A4. źródło przeciwne wymusza ograniczenie i obniża pewność', !bad.ok && good.ok, bad.errors.concat(good.errors).join('|'));
}
{
  const a = R.assessMetric(METRIC({ decision_supported: '' }));
  ok('A5. metryka bez wspieranej decyzji nie przechodzi', a.state === 'BLOCKED' && a.blockers.some(b => /wszelki wypadek/.test(b)));
}
{
  const s = R.assessMetric(METRIC({ measurement_source: '' }));
  const t = R.assessMetric(METRIC({ measurement_date: '' }));
  const o = R.assessMetric(METRIC({ resolution_owner: '' }));
  ok('A6. brak źródła, terminu lub właściciela blokuje predykcję', [s, t, o].every(x => x.state === 'BLOCKED'), [s, t, o].map(x => x.state).join(','));
}
{
  const d = R.doublecheck({ claims: [{ kind: 'opinion', text: 'A' }], research: [], recommended_mechanisms: [], author: 'session:router', reviewer: 'session:router' }, TODAY);
  ok('A7. agent nie może zatwierdzić własnego raportu', d.verdict === 'REVISE' && d.findings.some(f => /własnego raportu/.test(f.what)));
}
for (const [n, f] of [['A8. bramka Project Contract 14/14', 'run-gate-tests.js'], ['A9. graf', 'run-graph-tests.js'], ['A10. writer', 'run-tests.js']]) {
  let out = '', code = 0;
  try { out = execFileSync('node', [path.resolve(__dirname, '../../test/', f)], { encoding: 'utf8' }); } catch (e) { out = (e.stdout || ''); code = e.status; }
  ok(n, code === 0 && /0 FAIL/.test(out), out.split('\n').filter(l => /FAIL|PASS ·/.test(l)).slice(-1)[0]);
}
{
  const src = fs.readFileSync(path.resolve(__dirname, '../lib/research-contract.js'), 'utf8')
    + fs.readFileSync(path.resolve(__dirname, '../lib/framework-router.js'), 'utf8');
  const writes = /writeFileSync|appendFileSync|rmSync|unlinkSync|renameSync|mkdirSync|execFileSync|require\(['"]child_process/.test(src);
  ok('A11. żaden moduł nie ma prawa zapisu ani wykonania', !writes, 'moduł zawiera operację zapisu/wykonania!');
}

/* ═══════════ B. TESTY ADWERSARYJNE — jeden na bloker ═══════════ */

/* B1 (bloker 1) — pusty zestaw metryk to NIE jest gotowość */
{
  const m = R.measurementReadiness([]);
  const m2 = R.measurementReadiness(undefined);
  ok('B1. brak jakiejkolwiek metryki daje BLOCKED, nie READY',
    m.measurement_readiness === 'BLOCKED' && m2.measurement_readiness === 'BLOCKED' && /ŻADNEJ metryki/.test(m.blockers[0]),
    m.measurement_readiness + '/' + m2.measurement_readiness);
}

/* B2 (bloker 2) — agent wpisuje reviewer tekstem i NIE dostaje potwierdzonej niezależności */
{
  const rep = {
    claims: [{ kind: 'fact', text: REC().claim }], research: [REC()],
    recommended_mechanisms: [], author: 'session:router', reviewer: 'przemek',   /* ← tekst, nie dowód */
  };
  const d = R.doublecheck(rep, { ...TODAY, keyPath: '/nieistniejacy/klucz' });
  const gate = R.contractGate({ doublecheck: d, measurement: R.measurementReadiness([METRIC()]) });
  ok('B2a. sam napis reviewer:"przemek" NIE daje potwierdzonej niezależności',
    d.independent_review !== 'verified' && d.findings.some(f => /niezależność review NIE jest potwierdzona/.test(f.what)),
    d.independent_review);
  ok('B2b. bez podpisanego śladu kontrakt nie może zamrozić predykcji',
    gate.can_freeze === false && gate.blockers.some(b => /podpisu akceptacji/.test(b)), JSON.stringify(gate.blockers));

  /* podpis prawdziwy — kluczem, którego agent nie tworzy w tym przebiegu (tu: tymczasowy, na potrzeby testu) */
  const keyPath = path.join(os.tmpdir(), `genome-test-key-${process.pid}`);
  fs.writeFileSync(keyPath, 'TEST-KEY-NIE-JEST-KLUCZEM-PRODUKCYJNYM');
  try {
    const fp = R.reportFingerprint(rep);
    const sig = crypto.createHmac('sha256', 'TEST-KEY-NIE-JEST-KLUCZEM-PRODUKCYJNYM').update(fp).digest('hex');
    const signed = R.doublecheck({ ...rep, review_signature: sig }, { ...TODAY, keyPath });
    /* ta sama sygnatura po podmianie treści raportu musi przestać pasować */
    const tampered = R.doublecheck({ ...rep, review_signature: sig, recommended_mechanisms: ['mech:dopisany-po-akceptacji'] }, { ...TODAY, keyPath });
    ok('B2c. poprawny podpis daje verified, a podmiana treści po akceptacji go unieważnia',
      signed.independent_review === 'verified' && tampered.independent_review === 'invalid' && tampered.verdict === 'REVISE',
      signed.independent_review + '/' + tampered.independent_review);
  } finally { fs.unlinkSync(keyPath); }
}

/* B3 (bloker 3) — research zmieniający ZAKRES nie jest ozdobnikiem */
{
  const scopeOnly = REC({ decision_impact: { changes: ['scope', 'metric'], targets: ['zakres: kalkulator refundacji', 'metryka: zapytania/mies.'] } });
  const d = R.doublecheck({
    claims: [{ kind: 'fact', text: scopeOnly.claim }], research: [scopeOnly],
    recommended_mechanisms: ['mech:seo-aeo-foundation'], evidence_backed: ['mech:seo-aeo-foundation'],
    author: 'router', reviewer: 'przemek',
  }, TODAY);
  const decorative = R.doublecheck({
    claims: [{ kind: 'fact', text: REC().claim }], research: [REC({ decision_impact: { changes: ['none'] } })],
    recommended_mechanisms: ['mech:seo-aeo-foundation'], evidence_backed: ['mech:seo-aeo-foundation'],
    author: 'router', reviewer: 'przemek',
  }, TODAY);
  ok('B3. research zmieniający zakres/metrykę nie jest ozdobnikiem, a niczego niezmieniający — jest',
    !d.findings.some(f => /ozdoba/.test(f.what)) && decorative.findings.some(f => /ozdoba/.test(f.what)),
    JSON.stringify(d.findings.map(f => f.what)));
}

/* B4 (bloker 4) — rekord nieważny nie podnosi żadnej pozytywnej metryki */
{
  const invalidButImpactful = REC({ source_url: '', decision_impact: { changes: ['mechanism'], targets: ['mech:x'] } });
  const s = R.summarizeResearch([REC(), invalidButImpactful], TODAY);
  ok('B4. nieważny rekord nie liczy się jako impactful',
    s.total === 2 && s.valid === 1 && s.invalid === 1 && s.impactful === 1,
    `total=${s.total} valid=${s.valid} invalid=${s.invalid} impactful=${s.impactful}`);
}

/* B5 (bloker 5) — proponowany SKILL.md Routera istnieje i różni się od obecnego */
{
  const proposed = path.resolve(__dirname, '../skills/mechanism-router/SKILL.md');
  const current = path.resolve(__dirname, '../../../../.claude/skills/mechanism-router/SKILL.md');
  const p = fs.existsSync(proposed) ? fs.readFileSync(proposed, 'utf8') : '';
  const c = fs.existsSync(current) ? fs.readFileSync(current, 'utf8') : '';
  ok('B5. istnieje rzeczywisty proponowany SKILL.md Routera (audytowalny diff)',
    p.length > 0 && c.length > 0 && p !== c && /routeFrameworks/.test(p) && /contractGate/.test(p),
    `proposed=${p.length}B current=${c.length}B`);
}

/* B6 (bloker 6) — model źródeł */
{
  const rozmowa = R.validateResearchRecord(REC({
    source_type: 'rozmowa', source_url: undefined, primary_or_secondary: 'primary',
    source_ref: 'rozmowa z M. Kowalską (HR Director), 2026-08-05',
    verification_path: 'notatka w Obsidian AI Context/rozmowy/2026-08-05.md; można dopytać M.K. przez klienta',
    publisher: 'klient', published_at: 'n/d', accessed_at: '2026-08-05',
  }), TODAY);
  const rozmowaBezSladu = R.validateResearchRecord(REC({ source_type: 'rozmowa', source_url: undefined }), TODAY);
  const raportPierwotny = R.validateResearchRecord(REC({
    source_type: 'raport-branzowy', primary_or_secondary: 'primary',
    primary_basis: 'raport zawiera badanie własne wydawcy (n=412), a claim dotyczy wyniku TEGO badania',
    source_url: 'https://example.org/raport-2026', published_at: '2026-03-01',
  }), TODAY);
  const raportBezPodstawy = R.validateResearchRecord(REC({
    source_type: 'raport-branzowy', primary_or_secondary: 'primary',
    source_url: 'https://example.org/raport-2026', published_at: '2026-03-01',
  }), TODAY);
  const socialDeklaracja = R.validateResearchRecord(REC({
    source_type: 'social', primary_or_secondary: 'primary',
    primary_basis: 'wpis jest oświadczeniem samej firmy, a claim dotyczy treści tego oświadczenia',
    source_url: 'https://linkedin.com/posts/xyz', published_at: '2026-07-20',
  }), TODAY);
  ok('B6a. rozmowa bez URL przechodzi, gdy ma source_ref i verification_path', rozmowa.ok, rozmowa.errors.join('|'));
  ok('B6b. rozmowa bez śladu weryfikacji NIE przechodzi',
    !rozmowaBezSladu.ok && rozmowaBezSladu.errors.some(e => /source_ref/.test(e)) && rozmowaBezSladu.errors.some(e => /verification_path/.test(e)),
    rozmowaBezSladu.errors.join('|'));
  ok('B6c. raport branżowy z własnym badaniem może być pierwotny (z uzasadnieniem), bez niego nie',
    raportPierwotny.ok && !raportBezPodstawy.ok && raportBezPodstawy.errors.some(e => /primary_basis/.test(e)),
    raportPierwotny.errors.join('|'));
  ok('B6d. wpis social jest pierwotny dla deklaracji autora', socialDeklaracja.ok, socialDeklaracja.errors.join('|'));
}

/* B7 (bloker 7) — treść, typy, realność dat */
{
  const puste = R.validateResearchRecord(REC({ publisher: '   ' }), TODAY);
  const zlyTyp = R.validateResearchRecord(REC({ observation: 42 }), TODAY);
  const tablicaZamiastTekstu = R.validateResearchRecord(REC({ claim: ['a', 'b'] }), TODAY);
  const nierealnaData = R.validateResearchRecord(REC({ accessed_at: '2026-02-30' }), TODAY);
  const przyszlosc = R.validateResearchRecord(REC({ accessed_at: '2027-01-01' }), TODAY);
  const odwrocone = R.validateResearchRecord(REC({ published_at: '2026-08-08', accessed_at: '2026-08-01' }), TODAY);
  const contraNieTablica = R.validateResearchRecord(REC({ contradicting_sources: 'https://x.pl' }), TODAY);
  const metrykaZlaData = R.assessMetric(METRIC({ measurement_date: '2026-13-01' }));
  ok('B7a. puste pole nie przechodzi mimo obecności klucza', !puste.ok && puste.errors.some(e => /jest puste/.test(e)), puste.errors.join('|'));
  ok('B7b. zły typ pola jest wykrywany', !zlyTyp.ok && !tablicaZamiastTekstu.ok, zlyTyp.errors.concat(tablicaZamiastTekstu.errors).join('|'));
  ok('B7c. data nieistniejąca w kalendarzu odpada (2026-02-30)', !nierealnaData.ok && nierealnaData.errors.some(e => /realną datą/.test(e)), nierealnaData.errors.join('|'));
  ok('B7d. data dostępu z przyszłości odpada', !przyszlosc.ok && przyszlosc.errors.some(e => /przyszłości/.test(e)), przyszlosc.errors.join('|'));
  ok('B7e. publikacja późniejsza niż dostęp odpada', !odwrocone.ok && odwrocone.errors.some(e => /późniejsze niż accessed_at/.test(e)), odwrocone.errors.join('|'));
  ok('B7f. contradicting_sources musi być tablicą', !contraNieTablica.ok && contraNieTablica.errors.some(e => /tablicą/.test(e)), contraNieTablica.errors.join('|'));
  ok('B7g. measurement_date musi być realną datą', metrykaZlaData.state === 'BLOCKED' && metrykaZlaData.blockers.some(b => /realną datą/.test(b)), JSON.stringify(metrykaZlaData.blockers));
}

/* B8 (bloker 8) — skille nie wskazują ścieżek z proposals/ */
{
  const files = ['../skills/mechanism-router/SKILL.md', '../skills/research-benchmark/SKILL.md']
    .map(f => path.resolve(__dirname, f));
  const bad = files.filter(f => /proposals\/lib|proposals\/test|proposals\/skills/.test(fs.readFileSync(f, 'utf8')));
  ok('B8. żaden skill nie wskazuje ścieżki roboczej proposals/', bad.length === 0, bad.join(', '));
}

/* dodatkowe: struktura decision_impact */
{
  const wolnyTekst = R.validateResearchRecord(REC({ decision_impact: 'zmienia copy hero' }), TODAY);
  const bezTargets = R.validateResearchRecord(REC({ decision_impact: { changes: ['scope'], targets: [] } }), TODAY);
  const noneZInnym = R.validateResearchRecord(REC({ decision_impact: { changes: ['none', 'scope'], targets: ['x'] } }), TODAY);
  const spozaSlownika = R.validateResearchRecord(REC({ decision_impact: { changes: ['vibe'], targets: ['x'] } }), TODAY);
  ok('B9. decision_impact: wolny tekst, brak targets, "none"+inne i słowo spoza słownika odpadają',
    !wolnyTekst.ok && !bezTargets.ok && !noneZInnym.ok && !spozaSlownika.ok,
    [wolnyTekst, bezTargets, noneZInnym, spozaSlownika].map(x => x.ok).join(','));
}

/* ═══════════ C. PEŁNY PRZEBIEG ═══════════ */
{
  /* Router → Research → Measurement → Doublecheck → Project Contract, na jednym komplecie danych */
  const brief = BRIEF({ audience_defined: true, positioning_documented: true, perception_change_named: true, strategy_approved_ref: 'rec:strategia/klient-2026' });
  const route = F.routeFrameworks(brief);

  const research = [
    REC({ decision_impact: { changes: ['scope'], targets: ['zakres: sekcja "pary językowe"'] } }),
    REC({
      claim: 'Nisza podaje liczbę lat doświadczenia', source_url: 'https://katarzynagluchowska.pl/',
      source_title: 'Katarzyna Głuchowska', publisher: 'katarzynagluchowska.pl',
      observation: '"13+ lat doświadczenia" w nagłówku sekcji O mnie',
      interpretation: 'liczby budują zaufanie w tej niszy', confidence: 'medium',
      decision_impact: { changes: ['guard'], targets: ['guard: zero liczb bez potwierdzenia w wywiadzie'] },
      limitations: 'deklaracja własna, niezweryfikowana',
    }),
    REC({
      claim: 'Estetyka niszy jest przeciętna', source_url: 'https://bireta.pl/', source_title: 'Bireta',
      publisher: 'bireta.pl', observation: 'układ usługowy, brak marki osobistej', confidence: 'low',
      interpretation: 'przewaga wizualna możliwa', limitations: 'ocena subiektywna, brak metryki',
      decision_impact: { changes: ['none'] },
    }),
  ];
  const metrics = [METRIC(), METRIC({ metric: 'czas do pierwszej odpowiedzi', decision_supported: 'czy automatyzować odpowiedzi', target: '<24h', baseline: 'n/d', measurement_source: 'Gmail', measurement_method: 'różnica timestampów', measurement_date: '2026-11-01', data_quality: 'partial' })];
  const measurement = R.measurementReadiness(metrics);

  const rep = {
    claims: [
      { kind: 'fact', text: research[0].claim },
      { kind: 'fact', text: research[1].claim },
      { kind: 'fact', text: research[2].claim },
      { kind: 'recommendation', text: 'dodać sekcję pary językowe i FAQ' },
    ],
    research,
    recommended_mechanisms: ['mech:competitive-benchmarking', 'mech:seo-aeo-foundation'],
    recommended_frameworks: route.frameworks,
    evidence_backed: ['mech:competitive-benchmarking', 'mech:seo-aeo-foundation'],
    author: 'session:router', reviewer: 'przemek',
  };

  const keyPath = path.join(os.tmpdir(), `genome-e2e-key-${process.pid}`);
  fs.writeFileSync(keyPath, 'E2E-KEY');
  try {
    const dcBefore = R.doublecheck(rep, { ...TODAY, keyPath });
    const gateBefore = R.contractGate({ doublecheck: dcBefore, measurement });
    const sig = crypto.createHmac('sha256', 'E2E-KEY').update(R.reportFingerprint(rep)).digest('hex');
    const dcAfter = R.doublecheck({ ...rep, review_signature: sig }, { ...TODAY, keyPath });
    const gateAfter = R.contractGate({ doublecheck: dcAfter, measurement });

    ok('C1. router rozstrzyga warstwę strategiczną przed mechanizmami', route.decision === 'NONE' && route.reasons.length > 0, JSON.stringify(route));
    ok('C2. Doublecheck przechodzi na poprawnym researchu (bez blokera treści)', !dcAfter.blocks_contract, JSON.stringify(dcAfter.findings.map(f => f.level + ':' + f.what)));
    ok('C3. Measurement PARTIAL nie blokuje kontraktu, BLOCKED blokuje',
      measurement.measurement_readiness === 'PARTIAL'
      && R.contractGate({ doublecheck: dcAfter, measurement: R.measurementReadiness([]) }).can_freeze === false,
      measurement.measurement_readiness);
    ok('C4. kontrakt NIE zamraża się przed podpisem i zamraża po podpisie',
      gateBefore.can_freeze === false && gateAfter.can_freeze === true,
      `before=${JSON.stringify(gateBefore.blockers)} after=${JSON.stringify(gateAfter.blockers)}`);
    ok('C5. podsumowanie researchu przechodzi przez cały pipeline',
      dcAfter.research_summary.total === 3 && dcAfter.research_summary.valid === 3 && dcAfter.research_summary.impactful === 2,
      JSON.stringify(dcAfter.research_summary));
  } finally { fs.unlinkSync(keyPath); }
}

/* ═══════════ D. ROUTING SALT / PLATE ═══════════ */
{
  const brakFundamentu = F.routeFrameworks(BRIEF());
  const zFundamentem = F.routeFrameworks(BRIEF({ strategy_approved_ref: 'rec:strategia/bw-2026', needs_ongoing_communication: true, execution_capacity_days: 45 }));
  const oba = F.routeFrameworks(BRIEF({ needs_ongoing_communication: true, execution_capacity_days: 60 }));
  const techniczny = F.routeFrameworks(BRIEF({ audience_is_market: false }));
  const jedenFormat = F.routeFrameworks(BRIEF({ scope_is_single_format: true, strategy_approved_ref: 'rec:x' }));
  const zlyBrief = F.routeFrameworks({ audience_is_market: true });

  ok('D1. brak fundamentu → SALT', brakFundamentu.decision === 'SALT', JSON.stringify(brakFundamentu));
  ok('D2. fundament + ciągłość komunikacji → PLATE', zFundamentem.decision === 'PLATE' && zFundamentem.order[0] === F.PLATE, JSON.stringify(zFundamentem.decision));
  ok('D3. brak fundamentu + ciągłość → BOTH w kolejności SALT→PLATE',
    oba.decision === 'BOTH' && oba.order[0] === F.SALT && oba.order[1] === F.PLATE && oba.reasons.some(r => /kalendarz bez tezy/.test(r)), JSON.stringify(oba.order));
  ok('D4. projekt techniczny odrzuca obie karty', techniczny.decision === 'NONE' && techniczny.reasons.some(r => /odbiorcą wyniku jest system/.test(r)), JSON.stringify(techniczny));
  ok('D5. pojedynczy format w istniejącym systemie odrzuca obie karty', jedenFormat.decision === 'NONE', JSON.stringify(jedenFormat));
  ok('D6. brief z brakującymi polami jest odrzucany, nie zgadywany', zlyBrief.decision === 'INVALID_BRIEF' && zlyBrief.reasons.length >= 5, JSON.stringify(zlyBrief.reasons.slice(0, 2)));
  const maloCzasu = F.routeFrameworks(BRIEF({ needs_ongoing_communication: true, execution_capacity_days: 10 }));
  ok('D7. zdolność wykonawcza < 30 dni daje ostrzeżenie o fikcyjnym kalendarzu',
    maloCzasu.warnings.some(w => /fikcją/.test(w)), JSON.stringify(maloCzasu.warnings));
  const produktowy = F.routeFrameworks(BRIEF({ known_problem_class: 'produktowy' }));
  ok('D8. dominujący problem produktowy ostrzega, że branding tego nie naprawi',
    produktowy.decision === 'SALT' && produktowy.warnings.some(w => /branding tego nie naprawi/.test(w)), JSON.stringify(produktowy.warnings));
}

console.log('\n═══ TESTY: RESEARCH · MEASUREMENT · DOUBLECHECK · SALT/PLATE ═══\n');
for (const r of res) console.log(`  ${r.c ? '✓' : '✗'} ${r.n}${r.d ? '\n      → ' + r.d : ''}`);
console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
