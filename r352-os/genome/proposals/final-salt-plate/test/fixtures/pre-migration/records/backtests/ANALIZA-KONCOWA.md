---
id: "rec:backtests/ANALIZA-KONCOWA"
type: "record"
title: "Program walidacji Genome — analiza końcowa (32/32 backtesty)"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Analiza końcowa programu walidacji (32/32)

Dane: 32 backtesty (pilot briefsync + 31 przez workflow, 3 transze). Protokół: kwarantanna predykcji `bt:`, leave-one-out, dedupe evidence per projekt, base-rate oddzielony od sygnału (od transzy 2). Wyniki są ograniczone hindsightem — patrz PROTOKOL §1: wartość leży w strukturze pudeł i flag, nie w procentach.

## Wynik zbiorczy Routera

**175 rekomendacji → 73 pełne trafienia (41%), 64 częściowe (37%), 41 błędnych (23%), 32 mechanizmy użyte-a-nierekomendowane.**

Interpretacja: Router jest przyzwoitym radarem *rdzenia technicznego* i słabym prognostykiem *zakresu*. Co czwarta rekomendacja była błędna dla kontekstu, a w co drugim projekcie coś istotnego zostało pominięte.

## 1. Które mechanizmy są najtrafniejsze

| Mechanizm | rek. | pełne | błędne |
|---|---:|---:|---:|
| agent-as-runtime | 3 | 3 (100%) | 0 |
| working-artifact-extraction | 19 | 15 (**78%**) | 1 |
| location-as-data | 4 | 3 (75%) | 0 |
| deterministic-spine | 7 | 5 (71%) | 1 |
| machine-narrows-human-picks | 7 | 4 (57%) | 1 |
| numeric-gates | 9 | 5 (55%) | 1 |

**working-artifact-extraction to najsilniejszy mechanizm w Genome** — 19 rekomendacji, 78% pełnych trafień, 1 błąd, zero przeoczeń. Jest opisem rzeczywistego, powtarzalnego zachowania firmy, nie postulatem.

## 2. Które nigdy nie działają (jako rekomendacja)

- **competitive-benchmarking: 9 rekomendacji, 0 trafień, 9 błędnych, 8× flaga wrong-trigger.** Najgorszy wynik w całym programie. Karta powstała 08.08 z luki procesu i została natychmiast sfalsyfikowana: bramka „przed pierwszym szkicem" jest nieaplikowalna, gdy artefakt już istnieje, a w niszach o znanym standardzie benchmark nie zmienia decyzji. **Decyzja: zawęzić trigger do „wchodzę w niszę, której standardu nie znam" albo obniżyć do statusu przypisu w Routerze.** Nie usuwać — Trial #002 pokazał realny koszt jej braku.
- **dated-commitment-gates: 10 rekomendacji, 0 pełnych trafień, 6× too-narrow.** Paradoks: mechanizm jest *trafny co do diagnozy* (ARToffNIA: przepadła wycena przed 31.07 = najdroższy pojedynczy koszt w korpusie), ale jako rekomendacja nie zmienia zachowania — bo bramka wiązana z datą własną, nie z kalendarzem kontrahenta.
- **format-dictionary: 4 rekomendacje, 0 pełnych trafień.**

## 3. Które są zbyt ogólne (too-broad)

`single-source-compiler` ×8, `numeric-gates` ×5, `format-dictionary` ×4, `proof-first-demo-pitch` ×4, `incident-to-guard` ×4.

**single-space-compiler jest najgorzej zdefiniowaną kartą w Genome**: 21 rekomendacji, 23% trafień, 8 błędów, 8× too-broad + 4× too-narrow + 3× wrong-trigger jednocześnie. Karta zlepia trzy różne byty: (a) współdzielone fragmenty + check spójności, (b) pełną kompilację źródło→widoki, (c) dialekt runtime (jeden plik danych renderowany w kliencie, bez kroku buildu — artoffnia-demo).

## 4. Które są zbyt szczegółowe (too-narrow)

`dated-commitment-gates` ×6, `incident-to-guard` ×4, `single-source-compiler` ×4, `working-artifact-extraction` ×3, `design-as-code` ×3.

Wzorzec: karty opisują *powstanie* mechanizmu, nie jego *podtrzymanie*. incident-to-guard opisuje, jak guard powstaje po wpadce, ale nie zna klasy „przyrost guardów ustaje po wdrożeniu" (DailyFruits, beesknees: ≥4 incydenty produkcyjne, 0 nowych guardów).

## 5. Które połączyć

`negative-knowledge-ledger` ×2 candidate-merge — jedyny jawny kandydat do scalenia (z incident-to-guard: obie karty opisują zamianę porażki w trwałą obronę, różnią się nośnikiem).

## 6. Które usunąć

**Żadnej.** Zero kart zebrało flagę `candidate-remove`. To ważny wynik negatywny: wiedza w Genome jest prawdziwa, problemem są granice i triggery, nie treść. Program nie potwierdził hipotezy CEO „może połowę trzeba usunąć".

## 7. Nowe klasy mechanizmów, które wyłoniły się naturalnie

Ze 172 surowych hipotez, po klastrowaniu, 6 klas z n≥2 niezależnymi projektami:

1. **price-anchor-before-proof** (n=5) — kotwica cenowa i podział na etapy PRZED ujawnieniem kompletnego artefaktu. Wyłonione z ARToffNII (demo wycofane, teaser w zamian), potwierdzone przez Trial #002 (strona w szufladzie). Nadrzędny wobec proof-first-demo-pitch.
2. **client-edit-layer** (n=5) — gdy właścicielem treści jest klient bez IT, a deploy = git, warstwa edycji jest przewidywalnym workstreamem, nie dodatkiem (DailyFruits CMS v6: 58 commitów, drugi największy workstream projektu; linia beesknees→betterguide).
3. **intake-gate-before-router** (n=10) — bramka wejścia przed Routerem: pełny wątek mailowy, zakres i kalendarz klienta czytane W CAŁOŚCI zanim powstanie raport. ARToffNIA: kluczowy mail z terminem „przeoczony w snippetach" → przepadła wycena.
4. **source-decommission-sweep** (n=3) — przed wyłączeniem starego origin pełny sweep zależności + lokalna kopia (DailyFruits: 4 incydenty martwych hotlinków naprawiane do 4 tygodni po cutoverze, odzysk przez Wayback).
5. **brand-os-for-agents** (n=3) — destylat brandu pakowany jako pliki kontekstowe dla narzędzi AI klienta + walidator + biblioteka promptów (Geers zrobił to 06.2026, zanim Genome istniało).
6. **external-gate-counterparty** (n=4) — bramka datowa wiąże się z kalendarzem KONTRAHENTA (termin, powrót z urlopu, zamknięcie budżetu), nie z datą własną. Bezpośrednia korekta dated-commitment-gates.

## Werdykt wobec 5 pytań z definicji sukcesu

1. **Czy Router podejmuje dobre decyzje?** Częściowo. Rdzeń techniczny — tak (78% na WAE, 71% deterministic-spine). Zakres, decydent i ekonomia projektu — nie (ARToffNIA: rozjazd wyceny o dwa rzędy wielkości wobec kotwicy rynkowej).
2. **Czy Mechanisms opisują rzeczywistość?** Tak co do treści, nie co do granic. 0 kandydatów do usunięcia, ale 5 kart wymaga podziału lub przepisania triggera.
3. **Czy Genome zwiększa jakość kolejnych projektów?** **Niezmierzone i niemierzalne backtestami** — wymaga żywych trialów. To jest granica tego programu.
4. **Czy są mechanizmy do usunięcia?** Nie. Są do podziału (5) i do przepisania triggera (3).
5. **Czy któryś zasługuje na VALIDATED?** **Nie — i to jest uczciwa odpowiedź.** working-artifact-extraction spełnia próg liczbowy (n≥3, ≥2 projekty, evidence typu postmortem), ale wszystkie te postmortemy pochodzą z retro-backtestów wykonanych przez tego samego wykonawcę, który zna wyniki. Zgodnie z PROTOKOL §1 to nie jest dowód klasy „measurement". **VALIDATED czeka na pierwszy rozliczony żywy trial.**

## Co program zmienił w Genome (twarde)

- 32 raporty backtestów w `records/backtests/`
- ~150 wpisów evidence typu postmortem dopisanych przez ingest (dedupe per projekt odrzucił kilkadziesiąt duplikatów)
- 19/24 mechanizmów ma teraz evidence mocniejsze niż narracja (przed programem: 0)
- 178 zdarzeń w Ledgerze
- Zero zmian confidence bez evidence; zero statusów zmienionych ręcznie
