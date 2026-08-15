#!/usr/bin/env node
/* Testy warstwy strategicznej SALT/PLATE — adwersaryjne + próby na sucho.
 * Uruchomienie: node r352-os/genome/proposals/test/run-strategy-tests.js
 * Zero zapisu do Genome. Zero LLM. */
'use strict';
const path = require('path');
const fs = require('fs');
const S = require('../lib/strategy-frameworks.js');

let pass = 0, fail = 0;
const ok = (name, cond, info = '') => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${info ? '\n      → ' + info : ''}`); }
};
const TODAY = '2026-08-09';

console.log('\n═══ ROZPOZNAWANIE: kiedy SALT, kiedy PLATE, kiedy oba, kiedy żaden ═══\n');

/* 1. Projekt techniczny — MUSI odrzucić oba (wymóg 9d) */
const tech = S.assessStrategyNeed({
  is_technical: true, has_external_audience: false,
  positioning_consequences: false, needs_communication_plan: false,
}, TODAY);
ok('1. projekt techniczny bez odbiorcy → NONE (oba odrzucone)',
  tech.mode === 'NONE' && !tech.needs.salt && !tech.needs.plate, JSON.stringify(tech.reasons));

/* 2. Pojedynczy artefakt bez konsekwencji — odrzucenie */
const oneOff = S.assessStrategyNeed({
  single_artifact: true, positioning_consequences: false, has_external_audience: true,
}, TODAY);
ok('2. jednorazowy baner → NONE', oneOff.mode === 'NONE');

/* 3. Tylko SALT: diagnoza potrzebna, planu komunikacji nikt nie zamawia (wymóg 9b) */
const saltOnly = S.assessStrategyNeed({
  has_external_audience: true, can_state_positioning: false,
  positioning_consequences: true, needs_communication_plan: false,
  continuity_horizon_days: 0, dominant_problem: 'nieznany',
}, TODAY);
ok('3. rebranding bez planu komunikacji → SALT',
  saltOnly.mode === 'SALT' && saltOnly.needs.salt && !saltOnly.needs.plate, JSON.stringify(saltOnly.reasons));

/* 4. SALT + PLATE (wymóg 9c) */
const both = S.assessStrategyNeed({
  has_external_audience: true, can_state_positioning: false, positioning_consequences: true,
  needs_communication_plan: true, continuity_horizon_days: 90,
  dominant_problem: 'nieznany', production_capacity_known: true,
}, TODAY);
ok('4. rebranding + komunikacja 90 dni → SALT_THEN_PLATE',
  both.mode === 'SALT_THEN_PLATE' && both.needs.salt && both.needs.plate);
ok('4b. kolejność wymuszona bramką (SEQUENCED, nie zalecenie)',
  both.gates.some(g => g.gate === 'PLATE_REQUIRES_FOUNDATION' && g.status === 'SEQUENCED'),
  JSON.stringify(both.gates));

/* 5. Sam PLATE na świeżej strategii klienta */
const plateOnly = S.assessStrategyNeed({
  has_external_audience: true, can_state_positioning: true, positioning_consequences: false,
  needs_communication_plan: true, production_capacity_known: true,
  existing_strategy: { source: 'strategia klienta 2026-03', approved_at: '2026-03-01', challenged_by_brief: false },
}, TODAY);
ok('5. świeża strategia + potrzeba planu → PLATE bez SALT',
  plateOnly.mode === 'PLATE' && !plateOnly.needs.salt && plateOnly.needs.plate, JSON.stringify(plateOnly.reasons));
ok('5b. bramka fundamentu OK (istniejąca strategia)',
  plateOnly.gates.some(g => g.gate === 'PLATE_REQUIRES_FOUNDATION' && g.status === 'OK'));

/* 6. ADWERSARYJNY: PLATE bez fundamentu i bez przesłanek do SALT → BLOCKED (wymóg 5) */
const plateNoFoundation = S.assessStrategyNeed({
  has_external_audience: true, can_state_positioning: true, positioning_consequences: false,
  needs_communication_plan: true, dominant_problem: 'percepcyjny',
}, TODAY);
ok('6. PLATE bez fundamentu → BLOCKED (nie wymyśla strategii sam)',
  plateNoFoundation.blocked === true
  && plateNoFoundation.gates.some(g => g.gate === 'PLATE_REQUIRES_FOUNDATION' && g.status === 'BLOCKED'),
  JSON.stringify(plateNoFoundation.gates));

/* 7. Przeterminowana strategia nie jest fundamentem */
const stale = S.assessStrategyNeed({
  has_external_audience: true, can_state_positioning: false, positioning_consequences: true,
  needs_communication_plan: true, dominant_problem: 'nieznany',
  existing_strategy: { source: 'strategia 2024', approved_at: '2024-01-01', challenged_by_brief: false },
}, TODAY);
ok('7. strategia sprzed >12 mies. → SALT wraca na stół',
  stale.needs.salt === true && /starsza niż/.test(stale.reasons.join(' ')));

/* 8. Brief kwestionujący strategię */
const challenged = S.assessStrategyNeed({
  has_external_audience: true, can_state_positioning: false, positioning_consequences: true,
  existing_strategy: { source: 'x', approved_at: '2026-06-01', challenged_by_brief: true },
}, TODAY);
ok('8. brief kwestionuje strategię → SALT mimo świeżości', challenged.needs.salt === true);

/* 9. Bramka uczciwości: problem nie-percepcyjny */
const productProblem = S.assessStrategyNeed({
  has_external_audience: true, can_state_positioning: false, positioning_consequences: true,
  dominant_problem: 'produktowy',
}, TODAY);
ok('9. problem produktowy → ostrzeżenie "branding tego nie naprawi"',
  productProblem.gates.some(g => g.gate === 'HONESTY_PROBLEM_TYPE' && /nie naprawi/.test(g.detail)));

/* 10. Nieznana pojemność produkcyjna → LIMIT na kalendarzu */
const noCapacity = S.assessStrategyNeed({
  has_external_audience: true, can_state_positioning: true, needs_communication_plan: true,
  production_capacity_known: false,
  existing_strategy: { source: 's', approved_at: '2026-05-01', challenged_by_brief: false },
}, TODAY);
ok('10. nieznana pojemność → LIMIT (kalendarz jako lista życzeń)',
  noCapacity.gates.some(g => g.gate === 'PLATE_CAPACITY' && g.status === 'LIMIT'));

console.log('\n═══ JEDNO ŹRÓDŁO PRAWDY: moduł nie kopiuje treści frameworków ═══\n');

const libSrc = fs.readFileSync(path.join(__dirname, '..', 'lib', 'strategy-frameworks.js'), 'utf8');
ok('11. moduł NIE zawiera treści warstw (S/A/L/T ani P/L/A/T/E)',
  !/SYTUACJA|ODBIORCY|PRZEWAGA|ZNAJDŹ BLOKADY|kalendarz 90 dni \(szkielet\)/.test(libSrc));
ok('12. moduł wskazuje karty jako źródło treści',
  /content_source/.test(libSrc) && both.content_source.includes('workflows'));

console.log('\n═══ ROZLICZENIE: czy framework realnie coś zmienił ═══\n');

/* 13. ADWERSARYJNY: dokumenty powstały, decyzje nie — to NIE jest sukces (wymóg 10) */
const noPayoff = S.assessFrameworkPayoff({
  decisions_changed: [],
  findings: [{ status: 'ZWALIDOWANE' }],
});
ok('13. 0 zmienionych decyzji → payoff NONE (dokument ≠ sukces)',
  noPayoff.payoff === 'NONE' && /kosztem bez zwrotu/.test(noPayoff.issues.join(' ')));

/* 14. Zmiana decyzji + odkrycia ze statusem → CONFIRMED */
const good = S.assessFrameworkPayoff({
  decisions_changed: ['zakres: wypada kampania, wchodzi porządkowanie oferty', 'odbiorca: z użytkownika na decydenta'],
  findings: [{ status: 'ZWALIDOWANE' }, { status: 'HIPOTEZA', validation_plan: 'wywiady n=8 do 30.09' }],
});
ok('14. decyzje zmienione + statusy + plany walidacji → CONFIRMED', good.payoff === 'CONFIRMED', JSON.stringify(good.issues));

/* 15. ADWERSARYJNY: hipoteza bez planu walidacji */
const noPlan = S.assessFrameworkPayoff({
  decisions_changed: ['zakres: X'],
  findings: [{ status: 'HIPOTEZA' }],
});
ok('15. hipoteza bez planu walidacji → PARTIAL + issue', noPlan.payoff === 'PARTIAL' && noPlan.issues.length > 0);

/* 16. ADWERSARYJNY: odkrycie bez statusu = hipoteza podana jako fakt */
const noStatus = S.assessFrameworkPayoff({ decisions_changed: ['x'], findings: [{ note: 'coś tam' }] });
ok('16. odkrycie bez statusu → wykryte jako naruszenie extract-never-invent',
  /prin:extract-never-invent/.test(noStatus.issues.join(' ')));

console.log('\n═══ PRÓBY NA SUCHO (wymóg 9) ═══\n');

const dryRuns = [
  {
    name: 'BetterWorkplace / TeamBudget',
    brief: {
      has_external_audience: true, can_state_positioning: false, positioning_consequences: true,
      needs_communication_plan: true, continuity_horizon_days: 90,
      dominant_problem: 'nieznany', production_capacity_known: false,
    },
    expect: 'SALT_THEN_PLATE',
  },
  {
    name: 'Marka tłumacza (Trial #002) — tylko diagnoza, plan dopiero po wycenie',
    brief: {
      has_external_audience: true, can_state_positioning: false, positioning_consequences: true,
      needs_communication_plan: false, continuity_horizon_days: 0, dominant_problem: 'nieznany',
    },
    expect: 'SALT',
  },
  {
    name: 'Kampania na istniejącej, świeżej strategii klienta',
    brief: {
      has_external_audience: true, can_state_positioning: true, positioning_consequences: false,
      needs_communication_plan: true, production_capacity_known: true,
      existing_strategy: { source: 'strategia klienta', approved_at: '2026-04-01', challenged_by_brief: false },
    },
    expect: 'PLATE',
  },
  {
    name: 'Migracja WP→statyczny (projekt techniczny)',
    brief: { is_technical: true, has_external_audience: false, positioning_consequences: false },
    expect: 'NONE',
  },
];

for (const dr of dryRuns) {
  const r = S.assessStrategyNeed(dr.brief, TODAY);
  ok(`17.${dryRuns.indexOf(dr) + 1} ${dr.name} → ${dr.expect}`, r.mode === dr.expect,
    `otrzymano ${r.mode}; powody: ${r.reasons.join(' | ')}`);
  console.log(`        karty: ${r.cards.join(', ') || '—'} · bramki: ${r.gates.map(g => g.gate + ':' + g.status).join(', ') || '—'}`);
}

console.log('\n═══ KARTY: kontrakt pól (wymóg 6) ═══\n');

const CARD_DIR = path.join(__dirname, '..', 'genome');
const REQUIRED_FM = ['trigger', 'inputs', 'outputs', 'success_conditions', 'failure_conditions',
  'anti_context', 'guards', 'provenance', 'next_use', 'postmortem_settlement'];
for (const f of ['workflows/salt.md', 'workflows/plate.md']) {
  const src = fs.readFileSync(path.join(CARD_DIR, f), 'utf8');
  const missing = REQUIRED_FM.filter(k => !new RegExp('^' + k + ':', 'm').test(src));
  ok(`18. ${f} ma wszystkie 10 wymaganych pól`, missing.length === 0, 'brakuje: ' + missing.join(', '));
}

/* 19. Kierunkowość relacji Research → SALT → PLATE */
const saltSrc = fs.readFileSync(path.join(CARD_DIR, 'workflows/salt.md'), 'utf8');
const plateSrc = fs.readFileSync(path.join(CARD_DIR, 'workflows/plate.md'), 'utf8');
ok('19. relacja kierunkowa: salt uses benchmark, plate derives salt',
  /"uses":\s*\["mech:competitive-benchmarking"\]/.test(saltSrc) && /"derives":\s*\["wf:salt"\]/.test(plateSrc));

/* 20. Status dowodowy: bez validated, evidence typu backtest (wymóg 7) */
const claimSrc = fs.readFileSync(path.join(CARD_DIR, 'mechanisms/strategy-before-execution.md'), 'utf8');
ok('20. mechanizm-claim: status emerging, evidence wyłącznie backtest, zero validated',
  /^status: "emerging"$/m.test(claimSrc)
  && !/"type": "(measurement|postmortem)"/.test(claimSrc)
  && (claimSrc.match(/"type": "backtest"/g) || []).length === 2
  && !/validated/.test(claimSrc.split('## Status dowodowy')[0].replace(/"value": "emerging"/, '')));

console.log(`\n  ${pass} PASS · ${fail} FAIL\n`);
process.exit(fail ? 1 : 0);
