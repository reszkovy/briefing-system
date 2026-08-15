#!/usr/bin/env node
/* Próba na sucho warstwy SALT/PLATE na projektach historycznych. Zero zapisu do Genome. */
'use strict';
const F = require('../lib/framework-router.js');

const CASES = [
  {
    id: 'proj:teambudget (BetterWorkplace)', kind: 'produkt + GTM w ekosystemie marek',
    old: 'Router v9: mechanizmy + benchmark. Warstwa strategiczna nie istniała jako obiekt — SALT/PLATE żyły w HTML-u klienckim i w głowie właściciela.',
    brief: {
      audience_is_market: true, audience_defined: false, positioning_documented: false,
      perception_change_named: false, strategy_approved_ref: null,
      needs_ongoing_communication: true, scope_is_single_format: false,
      execution_capacity_days: 60, known_problem_class: 'nieznany',
    },
    changes: [
      'S wymusza klasyfikację problemu: BW = percepcyjny/kategorialny → praca produktowa i cenowa WYPADAJĄ z zakresu',
      'A wymusza liczbę przy odbiorcy: Office Manager (x1) → HR Director (x10) — to przepisuje całą komunikację na inny budżet',
      'L rozdziela przewagę strukturalną (jedyny łączący wellbeing + zaopatrzenie + platformę) od kopiowalnej → strategia zmienia się z „wymyśl przewagę" na „przejmij Owocowe Czwartki"',
      'PLATE nie startuje przed zatwierdzeniem SALT — kalendarz 90 dni powstaje po tezie, nie równolegle',
    ],
  },
  {
    id: 'proj:marka-tlumacz', kind: 'strona / marka osobista',
    old: 'Router v9: 4 mechanizmy, benchmark po fakcie, brak warstwy strategicznej. Pozycjonowanie powstało w trakcie projektowania.',
    brief: {
      audience_is_market: true, audience_defined: false, positioning_documented: false,
      perception_change_named: false, strategy_approved_ref: null,
      needs_ongoing_communication: false, scope_is_single_format: false,
      execution_capacity_days: null, known_problem_class: 'nieznany',
    },
    changes: [
      'A wymusza rozstrzygnięcie, czy klientem jest agencja eventowa czy zamawiający końcowy — to zmienia całą hierarchię treści strony',
      'T wymusza nazwanie zmiany percepcji („wykonawca zleceń" → „partner odpowiedzialny za przebieg wydarzenia") przed pisaniem copy',
      'PLATE odrzucony: jednorazowa strona bez ciągłości komunikacyjnej — kalendarz 90 dni byłby narzutem, nie wartością',
    ],
  },
  {
    id: 'proj:osada-orle-deck-morisson', kind: 'deck sponsorski na istniejącej marce',
    old: 'Router v9: mechanizmy prezentacyjne. Fundament (brand essence + design system Izerskiej osady) istniał, ale nie był wejściem formalnym.',
    brief: {
      audience_is_market: true, audience_defined: true, positioning_documented: true,
      perception_change_named: true, strategy_approved_ref: 'osada-orle brand essence + design system (Figma tXqtp37NOWPGchjsKCvf8d)',
      needs_ongoing_communication: true, scope_is_single_format: false,
      execution_capacity_days: 25, known_problem_class: 'percepcyjny',
    },
    changes: [
      'SALT odrzucony z powodem — fundament istnieje; oszczędza pełny przebieg diagnozy',
      'PLATE wymusza dowód blokady: „sponsor nie widzi zwrotu" musi mieć dowód, nie domysł — inaczej trzy wersje decku (ogólna/Pilsner/Castorama) są zgadywaniem',
      'Bramka zdolności (25 dni < 30) ostrzega: pełny kalendarz sponsorski będzie fikcją, zejdź do quick winów',
    ],
  },
  {
    id: 'proj:zdrofit-cwicz-w-zieleni', kind: 'kampania eventowa w istniejącym systemie marki',
    old: 'Router v9: 3 mechanizmy (format-dictionary, design-as-code), zero warstwy strategicznej.',
    brief: {
      audience_is_market: true, audience_defined: true, positioning_documented: true,
      perception_change_named: true, strategy_approved_ref: 'system marki Zdrofit (brand assets Benefit Systems)',
      needs_ongoing_communication: false, scope_is_single_format: true,
      execution_capacity_days: null, known_problem_class: 'percepcyjny',
    },
    changes: [
      'Obie karty odrzucone z powodem — 10 formatów jednego eventu w istniejącym systemie marki nie potrzebuje diagnozy strategicznej',
      'Wartość jest w ODMOWIE: bez tej reguły warstwa strategiczna doklejałaby się do każdego zlecenia produkcyjnego',
    ],
  },
  {
    id: 'proj:briefsync', kind: 'automatyzacja wewnętrzna',
    old: 'Router v9: 5 mechanizmów technicznych. Brak warstwy strategicznej — i słusznie, ale bez zapisanego powodu.',
    brief: {
      audience_is_market: false, audience_defined: false, positioning_documented: false,
      perception_change_named: false, strategy_approved_ref: null,
      needs_ongoing_communication: false, scope_is_single_format: false,
      execution_capacity_days: null, known_problem_class: 'nieznany',
    },
    changes: [
      'Odrzucenie jest teraz JAWNE i zapisane („odbiorcą wyniku jest system, nie rynek") zamiast być milczącym pominięciem',
    ],
  },
];

for (const c of CASES) {
  const r = F.routeFrameworks(c.brief);
  console.log(`\n══════ ${c.id} · ${c.kind} ══════`);
  console.log(`  PRZED: ${c.old}`);
  console.log(`  PO:    ${r.decision}${r.order.length ? ' → ' + r.order.join(' → ') : ''}`);
  r.reasons.forEach(x => console.log(`         • ${x}`));
  r.warnings.forEach(x => console.log(`         ⚠ ${x}`));
  r.blockers.forEach(x => console.log(`         ✗ ${x}`));
  console.log('  CO SIĘ REALNIE ZMIENIA W DECYZJACH:');
  c.changes.forEach(x => console.log(`         → ${x}`));
}
console.log('');
