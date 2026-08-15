---
id: "rec:backtests/r352-website"
type: "record"
title: "Backtest — r352-website"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — r352-website

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
T0 ≈ 08.04.2026 (initial commit z Figma Make). Źródła przebiegu rzeczywistego: git log repo `/Users/reszek/Desktop/R352 WEBSITE` (485 commitów, 04–08.2026), memory/r352-website.md (audyt SEO 02.07 + roadmapa 03.07), karta proj:r352-website (status archived), pliki `.brand/`, `scripts/`, `lighthouserc.json`, `public/llms.txt`.

## Pakiet T0 (skrót)

Solo-operator, własna witryna firmowa: SEO od zera (kolizja "r352" z Monitor Audio), SPA z potrzebą prerenderu, brand electro-breakdance x futuryzm, cel = ruch ICP do płatnego Diagnostic, kategoria-of-one "operating layer".

## Przebieg A — Router T0 (skrót)

**Rekomendowane:** seo-aeo-foundation, competitive-benchmarking, working-artifact-extraction, single-source-compiler, numeric-gates (wariant lekki), proof-first-demo-pitch. **Hipoteza:** agent-facing-distribution. **Odrzucone:** design-as-code, format-dictionary, split-url-architecture, deterministic-spine. Predykcje bt:r352-website-01…07 (pełne brzmienia w raporcie Routera).

## Przebieg B — Porównanie z rzeczywistością

### Predykcje

- **bt-01 (cykl naprawczy prerenderu, p=0.75) — HIT (mocny).** Nie jeden, a CZTERY cykle: `ea3c944` "skip on Vercel/CI until serverless Chromium setup" (prerender wyłączony na prodzie!), potem 3 fixy jednego dnia 02.07 (`83d8fd9` self-heal, `8898a73` @sparticuz/chromium, `4c1e852` AL2023 lib extraction), potem bug wtórny 07.07 (`052d19a` loader nigdy się nie pokazał — prerender zapiekł ukryty stan splasha) i 10.07 (`fe8878e` strip React portals z prerenderowanego HTML). Prerender miał własne bugi dokładnie wg claimu.
- **bt-02 (brand query nie zdominowane, organic <50/mies., p=0.70) — HIT słaby / nierozstrzygnięty liczbowo.** Memory (02–03.07): kolizja z Monitor Audio potwierdzona, GSC zweryfikowane dopiero 03.07, indeksacja "rozpędza się od ~10.07"; karta projektu (08.08): "indeksacja rozpędza się od 07.2026". Kierunkowo zgodne (brak dominacji, organic śladowy), ale brak twardych danych klikowych w źródłach — nie liczyć jako pełny hit.
- **bt-03 (≥3 przepisania narracji; copy > layout, p=0.60) — PARTIAL.** Część pierwsza HIT: hero H1 iterowany ≥3× (`260c6ab` "Design operations partner for high-volume marketing teams" → `67cc4b5` drop 'partner' → `6e0e7d6` "for brands and agencies delivering at scale"), plus `d287e1c` revert Philosophy naming, `7cc44f9` "P1 (de-solo) + P3 (old-category cleanup)", `df5cad8` copy audit T1+T2. Część druga MISS: iteracji layoutu/estetyki było WIĘCEJ — sam WebGL to 33 commity (presety Aurora/Liquid/Pixels/Warp/Vinyl/Peak/Cymatics), do tego console nav v1–v3 (~15 commitów), page transitions, hero glyph field. Router nie docenił apetytu estetycznego właściciela na własnym brandzie.
- **bt-04 (LIVE technicznie, cel Diagnostic nieosiągnięty, p=0.70) — HIT słaby / nierozstrzygnięty.** Strona LIVE, 35/35 tras prerenderowanych, GSC zweryfikowane (karta projektu). Funnel dopiero okablowany 18.07 (`ee5049a` GTM + CTA→/brief); intake przekierowany do r3loop (`014fa73`). Brak jakiegokolwiek śladu strumienia ICP→Diagnostic w źródłach; projekt zarchiwizowany z roadmapą "w toku". Zgodne z claimem, ale bez pomiaru celu — słaby hit.
- **bt-05 (zdublowana warstwa brandowa, jawny dryf, p=0.65) — PARTIAL, mechanizm przewidziany na odwrót.** Dublowanie NASTĄPIŁO: `.brand/design-system.md` + `brand-centre.html` + `tokens.json` obok kodu strony (`53b0312`, 12.07). ALE dryf nie jest "jawny": `scripts/brand-check.mjs` to guard CI (cytaty plik:linia istnieją, hexy z guide'a występują w kodzie, tokens.json parsuje) — exit 1 przy dryfie. Rationale predykcji ("guard u klientów, dyscyplina u siebie") sfalsyfikowane: Reszek dał guard u siebie.
- **bt-06 (warstwa maszynowa, p=0.55) — HIT (mocny, niedoszacowany).** Nie eksperyment, a pełny workstream: `129c84e` llms.txt + AI crawler allowlist + Person/WebSite/FAQ schemas, `7f115f2` /glossary + HowTo, `ea10545` CreativeWork + FAQPage + IndexNow, `e91b41d` GEO playbook z pomiarem "LLM baseline 2026-07-12", `4040f07` number canon w llms.txt. p=0.55 to było niedoszacowanie o klasę — to powinno być ~0.9 przy aksjomacie design-for-machine-readers.
- **bt-07 (proof niepełny na start, dosztukowywany po LIVE, p=0.60) — HIT.** Testimonials dodane iteracyjnie (`5d30bb7`), case'y NDA za hasłem (`4699532`), scaffolding "TBD" w outcome case'u regional.fit usuwany dopiero 11.07 (`4633f29`), prawdziwe długości partnerstw poprawiane 11.07 (`3f7ff92`), a "outcome numbers in 1-2 case studies" to wciąż przyrost 3 roadmapy (memory 03.07) — czyli proof liczbowy NADAL niedomknięty przy archiwizacji.

### Selekcja mechanizmów vs rzeczywistość

**Pełne trafienia:**
- **mech:seo-aeo-foundation** — trafiony podwójnie: użyty (per-route meta SEO.tsx, JSON-LD, sitemapa ~40 URL, audyt 02.07 "code-level SEO excellent") ORAZ jego failure condition "warstwa po designie" dosłownie się wydarzyła — strona urodziła się z Figma Make design-first (commit #1), SEO doklejane falami (`2472bd8` overhaul, `45f88e8` audit round 2, saga prerenderu do lipca). Karta opisuje rzeczywisty koszt tego projektu.
- **mech:numeric-gates** — użyty realnie: `lighthouserc.json` z asercjami (a11y ≥0.90 error, SEO ≥0.95 error, perf ≥0.80 warn), `post-deploy-check.mjs` (canonical www, Content-Type assetów, sitemap/robots/llms.txt, exit 1), `check-asset-budget.mjs`. Uwaga: bramki są PRAGMATYCZNE (warn/error z progami), nie "Lighthouse 100×4 niedyskutowalne" jak chciał Router — maksymalizm Routera > rzeczywista, działająca kalibracja.
- **mech:proof-first-demo-pitch** — case'y są rdzeniem IA (/work, per-case JSON-LD CreativeWork, testimonials z autorami, stats w hero `ee5049a`), Diagnostic/brief jako CTA treści. Kierunek trafiony, z zastrzeżeniem bt-07 (proof liczbowy spóźniony).

**Częściowe:**
- **mech:single-source-compiler** — kierunek ODWROTNY niż karta: nie tokens→widoki, tylko kod strony = źródło, a `.brand/` = widoki pilnowane guardem (brand-check.mjs weryfikuje guide PRZECIW kodowi). Rzeczywistość wybrała wzorzec "extract-then-guard", nie kompilator. Karta ma złą granicę dla projektów, gdzie artefakt istnieje przed systemem brandu.
- **mech:working-artifact-extraction** — połowicznie: proof/liczby faktycznie wyekstrahowane z realizacji (Kubota 5+ lat, Podsiadło 6+, Geers), ale brand r352 NIE powstał z destylatu realizacji klienckich — powstał generatywnie (Figma Make) i dopiero POTEM został zdestylowany do .brand. Rekomendacja "brand nie może powstać na sucho" sfalsyfikowana: powstał na sucho i się przyjął.

**Rekomendowane-a-nieużyte (wrong rate):**
- **mech:competitive-benchmarking** — ZERO śladu benchmarku konkurencji w repo/pamięci (są tylko self-audyty AUDIT-R352 i 56-agent UX audit — introspekcja, nie rynek). Bramka Routera "benchmark przed pierwszym szkicem" nie miała szans — pierwszy szkic istniał w T0. Przewidziany koszt (churn narracji) się zmaterializował, więc karta kierunkowo obroniona, ale jako rekomendacja proceduralna — nietrafiona w wykonanie.

**Użyte-a-nierekomendowane (miss rate):**
- **mech:incident-to-guard** — projekt wyprodukował ≥3 guardy z incydentów: post-deploy-check.mjs (po sadze prerenderu — "curl musi zawierać pełny tekst case'u, nie 5.9 kB shell"), brand-check.mjs (guard dryfu), check-asset-budget.mjs. Router w ogóle nie rozważył tej karty. Ewidentne pudło selekcji.
- **mech:agent-facing-distribution** — zdegradowany do "taniej hipotezy", a był pełnoprawnym workstreamem z playbookiem i pomiarem baseline. Niedoszacowanie rangi = miss klasyfikacyjny (słabszy niż incident-to-guard, bo mechanizm był wymieniony).

**Odrzucenia — weryfikacja:** design-as-code, format-dictionary, split-url, deterministic-spine — żaden nie okazał się potrzebny. Odrzucenie design-as-code z uzasadnieniem "dominująca eksploracja estetyczna" okazało się wręcz prorocze (33 commity WebGL). 4/4 poprawne.

### Ryzyka

- R1 SPA vs SEO — HIT (saga prerenderu). R2 kolizja brandu — HIT kierunkowy (memory 02.07). R3 kategoria-of-one bez benchmarku — HIT (churn H1/narracji bez delty rynkowej). R4 brak klienta-terminu → erozja roadmapy — PARTIAL (roadmapa dowieziona w częściach, przyrost /pl i proof liczbowy niedomknięte przy archiwizacji). R5 dryf brand-widoków — MISS (guard istnieje i działa; przewidziano problem, którego właściciel sam upilnował).
- **Ryzyko nieprzewidziane #1: pivot pozycjonowania solo→team.** T0 ramował problem jako "solo musi wyglądać jak system"; rzeczywistość rozwiązała go inaczej — udawaniem/rozbudową zespołu: `a27edac` /careers "Positions r352 as a growing operator team, not a solo shop", `7cc44f9` "P1 (de-solo)", `4633f29` usunięcie frazy solo-operator z case'ów. Genome nie ma mechanizmu dla decyzji "solo vs team" w pozycjonowaniu.
- **Ryzyko nieprzewidziane #2: nieograniczony budżet eksploracji estetycznej na własnym brandzie** (WebGL playground jako de facto R&D). Zaobserwowana dobra praktyka mitygująca: flagi trialowe z łatwym revertem (HERO_WEBGL, `41456f0`→`004eb07`).

## Raport 10 sekcji

1. **Accuracy Routera:** predykcje: 3 mocne HIT (bt-01, bt-06, bt-07), 2 PARTIAL (bt-03, bt-05), 2 słabe/nierozstrzygnięte kierunkowo zgodne (bt-02, bt-04). Ryzyka 3/5 HIT, 1 PARTIAL, 1 MISS + 2 nieprzewidziane. Zastrzeżenie hindsight jak w pilocie: wartość = struktura pudeł, nie %.
2. **Accuracy Mechanism Selection:** 3/6 pełne (seo-aeo-foundation, numeric-gates, proof-first-demo-pitch), 2/6 częściowe (single-source-compiler — odwrócony kierunek; working-artifact-extraction — brand powstał na sucho), 1/6 nieużyty (competitive-benchmarking). Miss: incident-to-guard (pełny), agent-facing-distribution (rangowy). Odrzucenia 4/4. Fit ≈ 65–70% — wyraźnie niżej niż briefsync.
3. **Największe błędy:** (a) brak incident-to-guard w rekomendacjach mimo że projekt jest fabryką guardów; (b) single-source-compiler rekomendowany w złym kierunku — rzeczywisty wzorzec to extract-then-guard (kod=źródło, dokumenty=widoki z CI-checkiem); (c) niedocenienie eksploracji estetycznej właściciela (bt-03 część porównawcza); (d) benchmark rekomendowany jako bramka "przed pierwszym szkicem" w projekcie, w którym szkic istniał przed T0 — bramka nieaplikowalna proceduralnie; (e) T0 nie modelował pivotu tożsamości solo→team.
4. **Największe sukcesy:** (a) bt-01 — saga prerenderu przewidziana co do mechanizmu i charakteru (bugi wtórne); (b) failure condition seo-aeo-foundation ("warstwa po designie") potwierdzone całą historią repo; (c) odrzucenie design-as-code z trafnym uzasadnieniem; (d) bt-07 proof-lag przewidziany precyzyjnie (TBD scaffolding, outcome numbers w przyszłym przyroście).
5. **Nowe mechanizmy (hipotezy):** mech:extract-then-guard (wariant/rozszczepienie single-source-compiler: gdy artefakt poprzedza system, źródłem jest artefakt, a dokumenty są widokami pilnowanymi guardem — dowód: brand-check.mjs); Category Naming Loop (z T0, wzmocniona: H1 iterowany 3× bez pomiaru frazy); mech:aesthetic-timebox (eksploracja estetyczna na własnym brandzie za flagą trialową z revertem — wzorzec HERO_WEBGL).
6. **Mechanizmy do usunięcia:** brak. single-source-compiler do ROZSZERZENIA (nie usunięcia); working-artifact-extraction do zawężenia claimu ("brand nie może powstać na sucho" — kontrprzykład istnieje).
7. **Confidence Changes (PROPOZYCJE — zapisy robi sesja główna):** seo-aeo-foundation: +evidence typu postmortem (failure condition potwierdzone retro, wynik rzeczywisty). numeric-gates: +postmortem z adnotacją kalibracyjną (progi pragmatyczne > maksymalizm "100×4"). single-source-compiler: BEZ podbicia + flaga "too-narrow" (odwrócony kierunek nieobjęty kartą). working-artifact-extraction: BEZ podbicia + flaga "too-broad" (kontrprzykład brandu z Figma Make). incident-to-guard: +postmortem (użyty spontanicznie, nierekomendowany — evidence siły mechanizmu niezależnej od Routera). competitive-benchmarking: bez zmian confidence; adnotacja "trigger musi sprawdzać, czy istnieje już artefakt" (dedupe per projekt — niezmiennik 10).
8. **Nowe hipotezy:** patrz 5; dodatkowo do pomiaru na żywo: bt-02/bt-04 rozstrzygalne z GSC + GTM po ≥8 tyg. od funnel sprintu (18.07) — dane będą we wrześniu 2026.
9. **Czego Genome nie wiedziało w T0:** że projekt startuje z GOTOWYM szkicem (Figma Make) — Router zakładał greenfield, a to zmienia aplikowalność bramek "przed pierwszym szkicem"; że pozycjonowanie może pivotować solo→team; że warstwa maszynowa (GEO/AEO) urośnie do workstreamu z własnym playbookiem i pomiarem; że guardy powstaną u siebie (falsyfikacja wzorca "dyscyplina tylko u klientów"); że prerender będzie się psuł wielokrotnie PO naprawieniu (bugi wtórne: loader, portals).
10. **Jak następny projekt będzie lepszy:** (a) Router pyta w T0 "czy artefakt już istnieje?" — jeśli tak, bramki 'przed szkicem' zamieniają się w bramki 'przed następną iteracją' (benchmark wciąż wykonalny, inaczej wpięty); (b) incident-to-guard rekomendowany z automatu dla każdego projektu z deploy pipeline; (c) single-source-compiler dostaje dwa tryby: compile (źródło→widoki) i extract+guard (artefakt→widoki+CI check); (d) każda predykcja porównawcza ("X > Y iteracji") musi mieć zdefiniowany licznik, inaczej nierozstrzygalna; (e) własny brand = ryzyko nieograniczonej eksploracji → time-box + flaga trialowa jako standard.

## Evidence (do zapisania w kartach + Ledger przez sesję główną)

- E1 {obserwacja: failure condition seo-aeo-foundation "warstwa po designie" zmaterializowane w pełnym cyklu; dowód: commit `4f48ddf` 08.04 (site z Figma Make) → `2472bd8` SEO overhaul → `ea3c944` prerender wyłączony na Vercel → 3 fixy 02.07 (`83d8fd9`,`8898a73`,`4c1e852`) → bugi wtórne `052d19a` 07.07, `fe8878e` 10.07; wpływ: potwierdzenie kosztu retrofitu SEO w SPA; zmiana: +postmortem evidence w karcie; mech: seo-aeo-foundation}
- E2 {obserwacja: projekt spontanicznie wyprodukował ≥3 guardy z incydentów bez rekomendacji Routera; dowód: scripts/post-deploy-check.mjs (weryfikacja prerenderu/canonical/llms.txt, exit 1), scripts/brand-check.mjs (guard dryfu .brand, 12.07 `53b0312`), scripts/check-asset-budget.mjs; wpływ: pudło selekcji Routera — incident-to-guard aplikowalny do każdego projektu z deployem; zmiana: rozszerzyć trigger karty; mech: incident-to-guard}
- E3 {obserwacja: single-source zrealizowany w ODWROTNYM kierunku niż karta — kod strony jest źródłem, .brand/ to widoki weryfikowane guardem przeciw kodowi; dowód: brand-check.mjs nagłówek "drift guard for .brand/design-system.md — verifies that what the brand guide cites still exists in the codebase" (12.07); wpływ: karta nie obejmuje wzorca extract-then-guard; zmiana: flaga too-narrow + hipoteza wariantu; mech: single-source-compiler}
- E4 {obserwacja: brand premium powstał generatywnie (Figma Make) bez destylatu z realizacji i osiągnął akceptację właściciela; dowód: commit `4f48ddf` "Initial commit: R352 website from Figma Make" 08.04 + późniejsza destylacja do .brand dopiero 12.07; wpływ: claim "brand nie może powstać na sucho" ma kontrprzykład; zmiana: zawęzić claim karty do kontekstów klienckich z istniejącym legacy; mech: working-artifact-extraction}
- E5 {obserwacja: bramki liczbowe działają jako progi pragmatyczne, nie maksima; dowód: lighthouserc.json (a11y ≥0.90 error, SEO ≥0.95 error, perf ≥0.80 warn) — vs "Lighthouse 100×4" z raportu Routera; wpływ: kalibracja bramek to część mechanizmu, maksymalizm zniechęca do konsumpcji; zmiana: adnotacja w karcie o doborze progów; mech: numeric-gates}
- E6 {obserwacja: warstwa agent-facing to pełny workstream z pomiarem, nie tani eksperyment; dowód: commity `129c84e` (llms.txt+allowlist), `7f115f2` (/glossary+HowTo), `ea10545` (IndexNow), `e91b41d` "GEO playbook, LLM baseline 2026-07-12", `4040f07` (number canon); wpływ: mechanizm dojrzalszy niż status hipotezy sugerował; zmiana: +evidence (uwaga: to własny projekt r352 — evidence wewnętrzne, oznaczyć); mech: agent-facing-distribution}
- E7 {obserwacja: benchmark konkurencji nigdy nie wykonany mimo rekomendacji z bramką, a przewidziany koszt (churn narracji) wystąpił; dowód: brak śladu benchmarku w repo/pamięci + iteracje H1 `260c6ab`→`67cc4b5`→`6e0e7d6` i de-solo `7cc44f9` (07.2026); wpływ: bramka "przed pierwszym szkicem" nieaplikowalna, gdy szkic poprzedza T0; zmiana: trigger karty uwzględnia projekty z istniejącym artefaktem; mech: competitive-benchmarking}
