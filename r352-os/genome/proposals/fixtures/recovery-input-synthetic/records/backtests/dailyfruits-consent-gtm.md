---
id: "rec:backtests/dailyfruits-consent-gtm"
type: "record"
title: "Backtest — dailyfruits-consent-gtm"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:dailyfruits-consent-gtm"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — dailyfruits-consent-gtm (PRZEBIEG B)

Data: 2026-08-09 · Protokół: PROTOKOL.md · T0 ≈ 30.06.2026 (commit beabe12 otwiera prace consent).
Źródła przebiegu rzeczywistego: memory/dailyfruits-consent-gtm.md (zapis 30.06), karta proj:dailyfruits-consent-gtm (08.08), git log ~/Fruityyyy (beabe12, dc5b7c6, ecbb055, 1acbbc2, d091b8d, b20c7b3), .github/workflows/ci.yml.

## Pakiet T0 (skrót)

Zdublowany consent (custom banner + Usercentrics przez GTM), DWA kontenery GTM (FVTBKWW współdzielony z betterworkplace.pl + 5B7HN67B), trackery (LinkedIn, Amplitude, Matomo) przed zgodą, niejasna architektura GA4 w rodzinie BW, baner psuje lab LCP. Cel: jeden RODO-zgodny mechanizm zgód spójny z rodziną BW, niezdublowana analityka, bez regresji CWV. Część konfiguracji w panelach klienta (GTM, Usercentrics), nie w repo.

## Skrót raportu Routera T0 (przebieg A — nie poprawiany)

Rekomendowane: single-source-compiler, incident-to-guard, numeric-gates, negative-knowledge-ledger, dated-commitment-gates. Workflow 5 kroków z bramkami (inwentarz → decyzja kanoniczna → implementacja z bramką LCP → blokujący guard CI "zero requestów przed zgodą" → domknięcie klienckie z datą). Top ryzyka: podzielona własność bez końca; gating tnie dane marketingu; blast radius współdzielonego kontenera; trade-off zgoda↔LCP; klasa błędu wraca kanałem panelowym. Predykcje SYGNAŁ bt-01…06 (niżej).

## Porównanie z rzeczywistością

### Predykcje SYGNAŁ

- **bt-01 (p=0.85, konsolidacja → Usercentrics jako jedyny CMP, custom banner usunięty): HIT — mocny.** Commit beabe12 (30.06): "Usercentrics jako jedyny CMP (jak na betterworkplace.pl)", #cookieBanner + df_consent usunięte z ~95 stron przez _includes. Trafiony też kierunek uzasadnienia (spójność z rodziną BW).
- **bt-02 (p=0.70, ≥1 działanie panelowe klienta niewykonane na zamknięciu etapu kodu): HIT — mocny.** Karta projektu (08.08, status archived): otwarte WSZYSTKIE TRZY — decyzja o GTM-5B7HN67B, allowlist domen UC, consent-gating tagów FB/LinkedIn. 39 dni po wdrożeniu kodu; projekt zarchiwizowany z otwartymi itemami. Predykcja mówiła "≥1", rzeczywistość dała 3/3.
- **bt-03 (p=0.65, LCP rozwiązane architektonicznie przez kolejność/odroczenie, CMP wcześnie + analityka lazy): HIT — mocny, niemal dosłowny.** 1acbbc2 (30.07): "lazy-start GTM x2 + GA4 (pierwsza interakcja lub max 2.5s)" + d091b8d (30.07): "Usercentrics laduje sie natychmiast, niezaleznie od lazy-GTM" + b20c7b3 preconnect/fetchpriority. To dokładnie wzorzec "UC-early + analytics-late" z sekcji benchmark. Zero odchudzania samego banera.
- **bt-04 (p=0.60, NIE powstanie blokujący guard CI "zero requestów przed zgodą"): HIT.** ci.yml: blokują validate-structure i htmlhint; Lighthouse jest "informacyjnie" z continue-on-error: true; żadnego skryptu skanującego requesty przed zgodą w scripts/ ani workflow. Weryfikacja consent pozostała sesyjna (dc5b7c6 — ręczne bramkowanie Clarity po fakcie). Trafiony także przewidziany powód: tagi żyją w panelu GTM poza rurą CI.
- **bt-05 (p=0.60, konsolidacja GA4 rodziny BW nierozstrzygnięta, zakres zawężony do dailyfruits.pl): HIT — słabszy (absence-based).** Brak jakiegokolwiek śladu prac cross-brand; przeciwnie — 13.07 ecbb055 dodaje GA4 gtag.js bezpośrednio na dailyfruits (G-G9SCYSFC36), a 30.07 "lazy-start GTM x2" potwierdza, że OBA kontenery nadal żyją. Zakres faktycznie = sam dailyfruits.pl; cel "niezdublowana analityka" osiągnięty tylko częściowo (dublet przetrwał, dołożono trzecią ścieżkę gtag).
- **bt-06 (p=0.55, ≥1 warunkowy limit stacku zapisany jako "nie działa bo X → rób Y"): HIT — słaby/generyczny.** Dwa zapisy: (1) memory 30.06 — UC allowlist: bez dodania domeny CMP rzuca "domain not on allow list" i się nie pokazuje → dodać dailyfruits.pl + vercel.app; (2) commit d091b8d — UC iniekowany przez lazy-GTM = baner po 2.5s+ = późny kandydat LCP (21s, flaky 93↔64 przez bot-detection UC) → ładować UC bezpośrednio z guardem id. Merytorycznie HIT, ale claim graniczy z base-rate'em, który router SAM wypisał ("wpis auto-memory z gotchas") — kwarantanna sygnał/base-rate przeciekła; liczone jako słabe trafienie.

Bilans SYGNAŁ: 6/6 HIT (4 mocne, 2 słabe). Zastrzeżenie hindsight jak w briefsync: wykonawca przebiegu A znał domenę; wartość dowodowa = struktura trafień/pudeł, nie procent.

### Ryzyka

- R1 podzielona własność = projekt bez końca: **HIT** (3 itemy panelowe otwarte, projekt archived z nimi).
- R2 gating tnie dane marketingu → konflikt z klientem: **NIEROZSTRZYGNIĘTE** — gating tagów w panelu nigdy nie nastąpił, więc spadek wolumenu nie mógł wystąpić. Nie liczyć jako pudło ani hit.
- R3 blast radius współdzielonego kontenera: **NIEROZSTRZYGNIĘTE/uniknięte** — zmiany szły wyłącznie po stronie kodu dailyfruits, kontenera nie ruszono (co samo w sobie potwierdza, że koszt ruchu cross-brand blokuje decyzje — mechanizm R3 zadziałał jako hamulec, nie jako incydent).
- R4 trade-off zgoda↔LCP nierozstrzygalny bez progu liczbowego: **PÓŁ-HIT / PÓŁ-PUDŁO.** Konflikt wystąpił realnie i to w ostrzejszej formie niż przewidziano: pierwszy ruch perf (lazy-GTM) opóźnił SAM CMP (zgody po 2.5s+ = gorzej dla RODO i gorzej dla LCP naraz). Ale rozstrzygnięcie przyszło architektonicznie (UC-direct + GTM-lazy), BEZ bramki liczbowej — teza "bez progu skończy się cichą regresją" sfalsyfikowana w tym przebiegu.
- R5 klasa błędu wraca kanałem panelowym: **HIT strukturalny** — 6.07 dodano nowy tag (Clarity, 9105db5) i trzeba go było łatać osobnym commitem (dc5b7c6, bramkowanie przez UC po fakcie). Dokładnie przewidziany wektor: każdy nowy tag = nowa szansa na strzał przed zgodą, brak guarda = naprawa jednorazowa.

### Mechanizmy — fit

- **mech:single-source-compiler — PEŁNY HIT.** Konsolidacja do UC jako jedynego źródła zgody wykonana; propagacja przez _includes/build.js (dosłownie ten mechanizm w tym repo); "How to apply" w pamięci = edytuj gtm-head.html → node scripts/build.js → 95 stron.
- **mech:negative-knowledge-ledger — PARTIAL (z flagą).** Zapisy powstały (allowlist, lazy-GTM↔CMP), ale to zachowanie base-rate'owe r352, które router sam wpisał do base-rate — rekomendacja niemal niefalsyfikowalna w tym systemie.
- **mech:numeric-gates — PARTIAL/WRONG.** Liczby były używane diagnostycznie (LCP 21s, 93↔64), ale żadna bramka liczbowa nie powstała (Lighthouse w CI celowo informacyjny, continue-on-error). Cel CWV osiągnięto bez bramki.
- **mech:incident-to-guard — WRONG (rekomendowany, nieużyty).** Guard "zero requestów przed zgodą" nie powstał; incydent Clarity naprawiono punktowo. Warunek porażki z karty ("kodyfikacja kończy w pamięci gdy bramka niewymuszona") wystąpił literalnie — karta dobrze opisuje klasę, ale router zarekomendował ją prescriptywnie tam, gdzie wektor (tagi w panelu klienta) NIE przechodzi przez rurę, którą kontrolujemy.
- **mech:dated-commitment-gates — WRONG jako selekcja (nieużyty), HIT jako diagnoza.** Żadna datowana bramka nie powstała — i dokładnie przewidziany skutek nastąpił (3 itemy panelowe dryfują ≥39 dni, projekt archived otwarty). Negatywny wynik = evidence wspierające trigger karty (counterfactual).

**Missed-used:** brak — nie zidentyfikowano istotnego mechanizmu użytego a nierekomendowanego. Kandydat spoza katalogu: "parity-with-sibling" (patrz Nowe mechanizmy) — realny ruch konsolidacyjny, którego żadna karta nie nazywa.

Fit: 1/5 pełny, 2/5 partial, 2/5 rekomendowane-nieużyte. Mechanism-fit ≈ 40–50% (licząc partial za pół). Kontrast z briefsync (80–90%) — projekt o podzielonej własności obniża wykonalność rekomendacji, nie ich trafność diagnostyczną.

## Raport 10 sekcji (CEO)

1. **Accuracy Routera:** predykcje SYGNAŁ 6/6 (4 mocne: bt-01/02/03/04; 2 słabe: bt-05 absence-based, bt-06 quasi-base-rate). Ryzyka: 2 hity (R1, R5), 1 pół (R4), 2 nierozstrzygnięte (R2, R3). Najcenniejsze trafienie: bt-04 — router poprawnie przewidział niewykonanie własnej rekomendacji.
2. **Accuracy Mechanism Selection:** ≈40–50%. Diagnozy trafne, selekcja przestrzelona wykonalnościowo: 2 z 5 mechanizmów wymagały zasobów/decyzji, których projekt utrzymaniowy o podzielonej własności nigdy nie dostał.
3. **Największe błędy:** (a) NIESPÓJNOŚĆ WEWNĘTRZNA — router rekomenduje incident-to-guard i numeric-gates jako bramki workflow, jednocześnie przewidując (bt-04, p=0.60), że guard nie powstanie; nie zaproponował taniego wariantu (np. jednorazowy skrypt har-scan zamiast pełnego CI-guarda). (b) Przeciek base-rate→sygnał: bt-06 i rekomendacja negative-knowledge-ledger to ten sam fenomen co linia base-rate "wpis auto-memory z gotchas". (c) Workflow przewymiarowany: realna konsolidacja = "skopiuj wzorzec siostrzanej marki" (betterworkplace już niosła UC przez WSPÓLNY kontener FVTBKWW) — 5-krokowy proces z podpisaną tabelą decyzyjną nie odpowiadał najtańszej realnej ścieżce. (d) Nieprzewidziana INTERAKCJA celów: lazy-loading analityki opóźnił sam CMP (bo CMP jechał przez GTM) — router widział trade-off, nie widział sprzężenia "optymalizacja celu B psuje cel A tym samym ruchem".
4. **Największe sukcesy:** bt-03 przewidział architekturę rozwiązania niemal co do commita (UC-early + analytics-lazy po interakcji/timeout); R1+bt-02 przewidziały dokładny stan końcowy projektu (kod domknięty, 3 itemy panelowe otwarte, archiwizacja z długiem); R5 przewidział wektor powrotu klasy błędu (nowy tag Clarity 6.07 → łatka po fakcie).
5. **Nowe mechanizmy (hipotezy):** (a) **mech:third-party-panel-handoff** — ustrukturyzowane przekazanie działań poza naszym repo (checklist + właściciel + data + konsekwencja); najsilniej wsparta hipoteza tego backtestu (3/3 itemy panelowe dryfują). (b) **mech:parity-with-sibling** — gdy istnieje działająca konfiguracja siostrzanej właściwości (marka/domena tej samej rodziny), najtańsza konsolidacja = wyrównanie do niej zamiast projektowania od zera; użyte de facto w beabe12. (c) **guard-klasa "coupled-goals"** — gdy dwa cele (compliance, perf) działają na tej samej rurze ładowania, każdy ruch optymalizacyjny wymaga sprawdzenia obu celów naraz.
6. **Mechanizmy do usunięcia:** żaden. Flagi: incident-to-guard i numeric-gates wymagają warunku stosowalności ("bramka tylko na wektorze przechodzącym przez rurę, którą kontrolujesz / którą projekt realnie utrzyma"), negative-knowledge-ledger — flaga dedupe z base-rate.
7. **Confidence Changes (PROPOZYCJE — zapisy robi sesja główna):** single-source-compiler: +evidence postmortem (beabe12 + build.js). dated-commitment-gates: +evidence postmortem typu counterfactual (brak bramki → przewidziany dryf 39 dni, 3/3 itemy otwarte przy archiwizacji). incident-to-guard: bez zmiany confidence + dopisać failure/applicability condition (potwierdzony warunek porażki: wektor poza rurą CI). numeric-gates: bez zmiany + flaga too-broad (cel liczbowy osiągnięty bez bramki). negative-knowledge-ledger: bez zmiany + flaga near-base-rate.
8. **Nowe hipotezy:** "Consent-Order Guard" z przebiegu A pozostaje niezbudowany i potwierdzony jako luka (incydent Clarity by go złapał) — kandydat na reużywalny moduł oferty compliance, ale w wariancie TANIM (skrypt na żądanie, nie CI). Do zmierzenia: czy itemy panelowe DailyFruits kiedykolwiek się domkną bez datowanej bramki (żywy test dated-commitment-gates).
9. **Czego Genome nie wiedziało w T0:** że GTM-FVTBKWW to DOSŁOWNIE ten sam kontener i konfig UC co betterworkplace.pl (konsolidacja = usunięcie + parity, nie budowa); twardy wymóg allowlisty domen UC (CMP cicho się nie pokaże); bot-detection UC destabilizuje lab-Lighthouse (93↔64 — metryka laboratoryjna nierzetelna na stronach z CMP, co podważa sensowność bramki Lighthouse dla tej klasy stron); że CMP wpięty przez GTM dziedziczy KAŻDE opóźnienie GTM (sprzężenie celów).
10. **Jak następny projekt będzie lepszy:** projekt o podzielonej własności dostaje z automatu artefakt handoff (właściciel+data+konsekwencja) jako deliverable równorzędny z kodem; przed projektowaniem konsolidacji Router pyta "czy istnieje działający sibling do wyrównania?"; rekomendacja guarda zawsze w dwóch wariantach kosztowych (blokujący CI vs skrypt na żądanie) z jawnym wskazaniem, który jest realistyczny; przy celach sprzężonych na jednej rurze — jawna predykcja incydentu interakcji, nie tylko "trade-off".

## Evidence (do zapisania w kartach + Ledger przez sesję główną)

- E1 {observation: konsolidacja consent wykonana jako single-source (UC jedyny CMP, custom banner out, propagacja _includes/build.js na ~95 stron); proof: commit beabe12 30.06.2026 + memory/dailyfruits-consent-gtm.md (30.06); impact: potwierdzenie triggera i wykonania karty w projekcie compliance; proposed_change: +evidence postmortem; mech: single-source-compiler}
- E2 {observation: brak datowanej bramki na działania panelowe klienta → 3/3 itemy (kontener 5B7HN67B, allowlist UC, gating tagów) otwarte ≥39 dni, projekt zarchiwizowany z nimi; proof: karta proj:dailyfruits-consent-gtm (updated 08.08.2026, "Status przy imporcie") vs memory 30.06; impact: counterfactual wspierający trigger karty; proposed_change: +evidence postmortem (negative-outcome) dla dated-commitment-gates + promocja hipotezy third-party-panel-handoff; mech: dated-commitment-gates}
- E3 {observation: rekomendowany blokujący guard "zero requestów przed zgodą" nie powstał, a klasa błędu wróciła kanałem panelowym (nowy tag Clarity 6.07 → łatka po fakcie); proof: ci.yml (Lighthouse continue-on-error, brak skryptu consent) + commity 9105db5 (feat Clarity) i dc5b7c6 (fix bramkowanie), oba 06.07.2026; impact: potwierdzony failure condition karty + brak warunku stosowalności (wektor poza rurą CI); proposed_change: dopisać applicability condition do incident-to-guard; mech: incident-to-guard}
- E4 {observation: konflikt zgoda↔LCP rozwiązany architektonicznie bez bramki liczbowej, a próba lazy-loadingu opóźniła sam CMP (sprzężenie celów na jednej rurze ładowania); proof: commity 1acbbc2 + d091b8d + b20c7b3 (30.07.2026, opis: LCP 21s, flaky 93↔64 przez bot-detection UC); impact: falsyfikacja tezy "bez progu = cicha regresja" w tym przebiegu + nowa klasa "coupled-goals"; proposed_change: flaga too-broad dla numeric-gates + hipoteza guarda coupled-goals; mech: numeric-gates}
