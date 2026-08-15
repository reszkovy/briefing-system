---
id: "rec:backtests/r352-brand-centre"
type: "record"
title: "Backtest — r352-brand-centre"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:r352-brand-centre"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — r352-brand-centre (PRZEBIEG B, falsyfikacja)

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
T0 ≈ 10-11.07.2026 (dzień przed commitem 53b0312 z 12.07.2026 12:35 +0200).

**Źródła przebiegu rzeczywistego:**
- repo `/Users/reszek/Desktop/R352 WEBSITE` — commit `53b0312` (2026-07-12) „Add brand system: design-system.md v1.1, brand centre, tokens, drift guard"; `.brand/{design-system.md, brand-centre.html, tokens.json, geo-visibility.md}`; `scripts/brand-check.mjs`; `CLAUDE.md`; `package.json`; `public/brand/index.html`; `public/llms.txt` (commit `4040f07`, 2026-07-18); commity `e91b41d` (2026-07-18), `fdb56d6` (2026-07-20)
- repo `/Users/reszek/Klienci/pilot-nazwa` — commit `407d09d` (2026-07-10) „scaffold: Brand Hub pilot-nazwa (r352-framework)"; `.brand/{AGENT.md,BRAND.md,CLAUDE.md,PROMPTS.md,PROMPTS-IMAGES.md,README.md}`, `system/*.json`, `generate-tokens.mjs`, `tokens.yaml`
- repo `/Users/reszek/Desktop/Claude_zadania/FrameWorkProdukty/r352-framework` — `bramki/GATE-F2-brand-lock.md` (2026-07-08), `bin/nowy-klient.sh` (2026-07-10), `playbook/PILOT-NOTES-malapalarnia.md`
- pamięć: `memory/r352-brand-centre.md`; karta `proj:r352-brand-centre`
- pomiar wykonany 2026-08-09: `node scripts/brand-check.mjs` → **9 findings, exit 1**

---

## Pakiet T0 (jak go zrekonstruował Przebieg A) — z korektą faktograficzną

Przebieg A przyjął, że brand centre jest **pilotem** wzorca `.brand/`, czyli że r352 najpierw robi u siebie, a potem sprzedaje klientom (dogfooding). To założenie pochodzi wprost z pola „Cel" karty projektu.

**Fakty przeczą tej kolejności.** Bramka `GATE-F2-brand-lock.md` (08.07), scaffold `bin/nowy-klient.sh` i pełne repo klienckie `pilot-nazwa` z kompletnym `.brand/` + `generate-tokens.mjs` (10.07) istniały **przed** commitem brand centre (12.07). Wzorzec sprzedawany klientom był gotowy i wdrożony na pilocie klienckim (Mała Palarnia) dwa dni wcześniej. Brand centre nie było pilotem tego wzorca — było **osobną, strukturalnie różną implementacją u siebie**.

To jest błąd pakietu T0, nie Routera: karta projektu zawiera narrację retrospektywną („brand centre jest pilotem"), a nie stan wiedzy z T0. Router rozumował poprawnie na fałszywej przesłance.

## Skrót Przebiegu A (Router T0)

**Rekomendowane (6):** working-artifact-extraction (P1), single-source-compiler (P1 warunkowo, bramka G2), numeric-gates (P2), incident-to-guard (P2), session-to-sop (P3), proof-first-demo-pitch (P3, wariant dogfooding).
**Odrzucone (4):** seo-aeo-foundation, competitive-benchmarking, design-as-code, agent-facing-distribution.
**Ryzyka:** R1 dwie reprezentacje · R2 asymetria klient/własne · R3 Brand Lock zostanie promptem · R4 kodyfikacja wieloznaczności · R5 gated artefakt bez odbiorcy.
**Predykcje SYGNAŁ:** bt-01…bt-08 (base-rate wyłączony z oceny zgodnie z PROTOKOL pkt „poprawka po transzy 1").

---

## Przebieg B — porównanie predykcji z rzeczywistością

| ID | p | Werdykt | Dowód |
|---|---|---|---|
| bt-01 | 0.78 | **HIT** | `.brand/tokens.json` w repo; `design-system.md` nagłówek: „read directly from source code", każda wartość z cytatem `path:line`; reguła „when this file and the code disagree, **the code wins**". Destylat wyprowadzony z żywej r352.com, nie z warsztatu. |
| bt-02 | 0.70 | **HIT (silniejszy niż claim)** | Zero generatorów. Brak `tokens.css` w repo. Ręcznie utrzymywane są **trzy** widoki, nie dwa: `design-system.md` (103 KB), `brand-centre.html` (163 KB, 55 twardo wpisanych wystąpień limonki), `tokens.json` (3,6 KB). `package.json` nie ma skryptu kompilacji tokenów. |
| bt-03 | 0.65 | **HIT (z korektą lokalizacji)** | Widok dla AI istnieje: `tokens.json` („machine-readable mirror") w `.brand/` + `CLAUDE.md` w roocie (ten sam commit) kierujący każdą sesję AI do `.brand/` przed pracą nad UI/copy + sekcja „AI agents" w `design-system.md`. Claim mówił „wewnątrz `.brand/` typu AGENT.md" — plik instrukcji wylądował w roocie, tokeny w `.brand/`. |
| bt-04 | 0.28 | **claim FAŁSZ — kalibracja trafna** | Zero śladu Brand Locka dla brand centre. Wynik **90/100 należy do Małej Palarni** (`playbook/PILOT-NOTES-malapalarnia.md`), nie do r352. `asset_evaluation_checklist.json` istnieje wyłącznie w repo klienckim. |
| bt-05 | 0.30 | **MISS na claimie, błąd w OBIE strony** | Guard powstał **tego samego dnia** (`scripts/brand-check.mjs`, commit 53b0312) — dużo szybciej niż router zakładał. Ale **nie jest blokujący**: `npm run build` = `vite build && inject-meta && prerender`; `brand:check` to samodzielny skrypt, brak CI, brak git-hooka. Pomiar 2026-08-09: **9 findings, exit 1** — guard świeci na czerwono od nieznanej daty i nikt tego nie zobaczył. |
| bt-06 | 0.45 | **MISS — fałszywa alternatywa Routera** | Konflikt trzech limonek rozstrzygnięto **trzecią drogą**: przypisaniem zakresów. `tokens.json` → `accent.lime #D4FF00` (UI), `accent.limeLogo #DAFF45` (tylko artwork logo), `accent.limeMascotVisor #c8f13a` + reguła maszynowa `"limeScopes"` i `"noThirdLimeInUI": true`, plus `HEX_ALLOWLIST` w guardzie. To nie jest ani „jedna wartość kanoniczna", ani „archiwum trzech wariantów" — to rozstrzygnięcie normatywne przez zakresy, egzekwowalne maszynowo. |
| bt-07 | 0.72 | **HIT** | staticrypt (client-side AES) → `public/brand/index.html` (361 KB), `.staticrypt.json` z solą w repo, meta noindex wstrzykiwany ręcznie w flow z `CLAUDE.md`, `/brand` poza sitemapą. Zero autoryzacji serwerowej. |
| bt-08 | 0.33 | **MISS na claimie (kolejność odwrócona)** | Scaffold **istnieje** (`bin/nowy-klient.sh`, `szablony/brand/.brand/`, `generate-tokens.mjs`), ale powstał 10.07 — **przed** brand centre, i nie jest jego produktem. `grep -ri "brand.?cent\|r352.com/brand"` w całym repo frameworku: **0 trafień**. Drugi człon celu nie domknął się przez ten projekt. |

**Bilans SYGNAŁU:** 4/8 HIT na claimie (bt-01, 02, 03, 07), 1 poprawna kalibracja niskiego p (bt-04), 3 MISS-y (bt-05, 06, 08) — wszystkie trzy o wysokiej wartości poznawczej, bo pokazują nie „nie zgadliśmy", tylko „mieliśmy złą ramę".

### Ryzyka

- **R1 (dwie reprezentacje) — HIT, gorzej niż przewidziano.** Trzy widoki ręczne. Dryf zmierzony: 9 findings (7× STALE LINE po `Home.tsx` i `PageTransition.tsx`, 2× ORPHAN `#363636`).
- **R2 (asymetria klient/własne) — HIT, ale o odwróconym kształcie.** Router zakładał „u klientów CI blokujące, u siebie dyscyplina sesyjna". Rzeczywistość: **kompilator jest u klienta** (`generate-tokens.mjs`: `tokens.json → www/tokens.css + tokens.yaml do AGENT.md`), **a u siebie go nie ma**; za to **guard jest u siebie**, tylko nikt go nie wpiął. Asymetria jest realna, ale przebiega po innej osi niż nazywa karta.
- **R3 (Brand Lock zostanie promptem) — HIT.** Dla brand centre nie odpalono go w ogóle.
- **R4 (kodyfikacja wieloznaczności) — MISS.** Wyszło lepiej niż router zakładał: zakresy + reguła maszynowa + allowlista w guardzie.
- **R5 (gated artefakt bez odbiorcy) — HIT.** Brak daty i nazwiska pokazu; framework nigdy nie odwołuje się do brand centre; dowodem sprzedażowym został pilot kliencki, nie własny artefakt.

---

## Raport 10 sekcji (CEO)

**1. Accuracy Routera.** Rdzeń diagnozy trafiony: problem nie jest dokumentem, tylko brakiem kompilacji i guarda (R1+R2 potwierdzone twardym pomiarem). Trafność ryzyk 4/5. Największa słabość: Router odziedziczył z karty projektu narrację „dogfooding pilot" i nie sprawdził jej datami — cała sekcja 1 (człon B: „wiarygodność oferty") opisuje motywację, która historycznie już była zaspokojona przez pilota klienckiego.

**2. Accuracy Mechanism Selection.** Pełne trafienia 2/6 (`working-artifact-extraction`, `session-to-sop`). Częściowe 2/6 (`single-source-compiler` — diagnoza słuszna, adopcja zerowa; `incident-to-guard` — guard powstał, ale poza ścieżką blokującą). Chybione 2/6 (`numeric-gates` — nieużyty w tym projekcie; `proof-first-demo-pitch` — dowód sprzedażowy powstał gdzie indziej). Odrzucenia: **2 z 4 odrzuceń falsyfikowane** — `competitive-benchmarking` i `agent-facing-distribution` zmaterializowały się w tym samym folderze `.brand/` w ciągu 6 dni. Fit ≈ 45-50% — najsłabszy wynik w dotychczasowej transzy.

**3. Największe błędy.**
- **Odrzucenie `agent-facing-distribution` na podstawie gatingu artefaktu.** Rozumowanie „artefakt za hasłem ⇒ brak dystrybucji" jest błędem poziomu: bramkowane jest **źródło**, nie jego produkty. 18.07 (6 dni po v1) `public/llms.txt` dostał sekcje „Proof (verified numbers)" i „Canonical descriptions" — treść 1:1 z `tokens.json → voice.numberCanon` („300+ clubs", „250+ locations", „3× faster approvals", „10k+ assets/year", „5+ yrs", „80%+ briefs first-round"). Kanon marki zasilił kanał maszynowy dokładnie tak, jak opisuje odrzucona karta.
- **Odrzucenie `competitive-benchmarking` jako „czwartej instancji tego samego błędu".** Router odrzucił mechanizm, bo trzy poprzednie backtesty pokazały „rekomendowany → zero wykonania". Tymczasem **tutaj benchmark realnie się wykonał**: `.brand/geo-visibility.md` (start 2026-07-12, ten sam dzień co v1) zawiera zmierzony baseline widoczności LLM z pełną listą encji konkurencyjnych (Accenture Song, Landor, Interbrand, Frontify, Manyone, Deloitte Digital…) i tezę kategorii. Router odrzucił mechanizm w jedynym projekcie, w którym ten mechanizm w końcu zadziałał — bo trigger karty („wchodzę w niszę, której standardu nie znam") opisuje złą sytuację.
- **Fałszywa alternatywa w bramce G1.** „Jedna wartość kanoniczna ALBO archiwum wariantów" pominęło rozwiązanie faktycznie zastosowane i lepsze: rozstrzygnięcie przez zakresy z regułą maszynową.
- **Model asymetrii klient/własne opisany po złej osi** (patrz R2).

**4. Największe sukcesy.**
- `working-artifact-extraction` jako P1 — pełne trafienie, łącznie z warunkiem wejścia „destylat musi wylądować w repo w formacie maszynowym". Wylądował.
- Bramka G2 przewidziała dokładnie to, co się stało po jej pominięciu: trzy ręczne widoki i mierzalny dryf. Predykcja bt-02 to najlepiej udokumentowany hit transzy — potwierdzony uruchomieniem guarda, nie opinią.
- `session-to-sop` — SOP powstał i działa: `CLAUDE.md` zawiera pełną procedurę redeployu `/brand` (staticrypt → rename → re-inject noindex → `vercel --prod`), a nie streszczenie sesji.
- Rozpoznanie, że problem jest podwójny i żaden człon nie jest dokumentem — mimo błędnej przesłanki o dogfoodingu, diagnoza „to nie jest projekt brandbookowy" była trafna.

**5. Nowe mechanizmy (hipotezy).**
- `mech:guard-without-trigger` (kandydat na rozszerzenie `incident-to-guard`, nie osobną kartę): **guard nie jest guardem, dopóki nie leży na ścieżce blokującej.** Dowód: `brand:check` istnieje od dnia zero, zwraca 9 findings i exit 1, i przez ~4 tygodnie nikt tego nie zobaczył, bo nie odpala go build ani hook.
- `mech:guard-direction` — guard sprawdza **dokument przeciw kodowi**, ale nie **kod przeciw regułom dokumentu**. Skutek mierzalny: twarda reguła #1 („no long dashes, ever") jest egzekwowana wyłącznie wewnątrz `design-system.md` i `tokens.json`; `public/llms.txt` ma 20 długich myślników, `src/app/pages/Estymacja907.tsx` ma „800–1 500 PLN", 7 plików w `src/` łamie regułę — a `brand:check` na tym wymiarze świeci na zielono. Publiczny artefakt agentowy łamie regułę #1 marki.
- `mech:scope-resolution` — konflikt N wariantów rozstrzygany przez przypisanie zakresów + regułę maszynową + allowlistę, zamiast wyboru jednej wartości. Wzorzec sprawdzony (trzy limonki).
- `mech:gated-source-public-feed` — bramkowane źródło marki zasila publiczne kanały maszynowe. Rozszerza trigger `agent-facing-distribution`: gating źródła nie wyłącza dystrybucji, tylko przenosi ją o poziom niżej.
- `mech:llm-visibility-baseline` — pomiar „kto jest wymieniany w odpowiedziach LLM w mojej kategorii" jako operacyjny wariant benchmarkingu. Wykonany, z datą i tabelą, w `.brand/geo-visibility.md`.

**6. Mechanizmy do usunięcia.** Żaden do usunięcia. Do przeniesienia z „rekomenduj" do „nazwij koszt": `single-source-compiler` w projektach wewnętrznych bez konsumenta bramki — to **siódmy** backtest klasy „rekomendowany, nieużyty". Karta z siedmioma niewykonaniami nie jest rekomendacją, tylko przewidywaniem porażki; powinna albo wymagać istniejącego generatora jako warunku wejścia, albo być raportowana jako ryzyko, nie jako zalecenie.

**7. Confidence Changes (PROPOZYCJE — zapisu dokonuje sesja główna).**
- `mech:working-artifact-extraction` — +1 evidence typu postmortem (E1). Wzorzec potwierdzony w projekcie, w którym artefaktem źródłowym był własny kod produkcyjny, nie materiał klienta. Rozszerza zakres karty.
- `mech:incident-to-guard` — **bez podbicia**, dopisanie `failure_condition`: „guard poza ścieżką blokującą = dokumentacja; guard sprawdzający dokument przeciw kodowi nie chroni kodu przed dokumentem" (E2, E3).
- `mech:single-source-compiler` — **bez podbicia**, flaga `wrong-trigger` + policzenie siódmej instancji „rekomendowany, nieużyty" (E4).
- `mech:agent-facing-distribution` — +1 evidence, rozszerzenie triggera o wariant „gated źródło → publiczny kanał maszynowy" (E5).
- `mech:competitive-benchmarking` — +1 evidence **wykonania** (pierwsze w korpusie) + zmiana triggera na „chcę być cytowany przez maszyny w kategorii bez incumbenta" (E6).
- `mech:proof-first-demo-pitch` — bez zmian, flaga `wrong-trigger` dla projektów wewnętrznej kodyfikacji (E7).

**8. Nowe hipotezy.**
- **„Dogfooding deklarowany retrospektywnie".** Karta projektu twierdzi, że brand centre jest pilotem wzorca sprzedawanego klientom. Struktura przeczy: klient dostaje `.brand/{BRAND.md, AGENT.md, CLAUDE.md, PROMPTS.md, PROMPTS-IMAGES.md, README.md}` + `system/` 6 JSON-ów + `generate-tokens.mjs`; r352 ma u siebie `.brand/{design-system.md, brand-centre.html, tokens.json, geo-visibility.md}` i zero generatora. Test operacyjny hipotezy: **tożsamość strukturalna (te same nazwy plików i ten sam generator), nie narracja.**
- **Kolejność jest odwrotna do intuicji Genome:** produkt dla klienta powstał pierwszy, wersja własna była pochodną i zdegradowaną. Jeśli to wzorzec, a nie wypadek, `proof-first-demo-pitch` w wariancie „dogfooding" jest w r352 mechanizmem martwym.
- **Guard-bez-wyzwalacza jako główna klasa długu r352** (do zmierzenia na innych repo: ile skryptów `*:check` istnieje i ile z nich leży w ścieżce blokującej).
- bt-04 przy p=0.28 i bt-05 przy p=0.30 — obie predykcje „u siebie tego nie zrobimy" były niedostatecznie ostre: jedna trafiła, druga chybiła w nieoczekiwaną stronę. Hipoteza: r352 **buduje** narzędzia dyscypliny u siebie sprawnie, a nie **podłącza** ich. To inna diagnoza niż „brak dyscypliny".

**9. Czego Genome nie wiedział w T0.**
- Że wzorzec `.brand/`, kompilator tokenów i bramka Brand Lock **już istniały** i miały pilota klienckiego — cała motywacja „walidacja wzorca" była już zaspokojona gdzie indziej.
- Że `.brand/` stanie się folderem szerszym niż marka (GEO/LLM-visibility playbook wjechał tam 6 dni po v1) — czyli że kodyfikacja marki u r352 rozlewa się w „brand operations", a nie zatrzymuje na systemie wizualnym.
- Że gated artefakt może w tydzień wyprodukować publiczny kanał maszynowy — a więc że „gated" nie jest właściwością projektu, tylko jednego pliku w nim.
- Że najgroźniejszy tryb awarii to nie „guard nie powstanie", tylko „guard powstanie i nie zostanie podłączony" — tryb, którego żadna karta nie nazywa.
- Że konflikt wielu wariantów bywa rozstrzygany zakresowo i że to rozwiązanie jest lepsze od wyboru jednej wartości (zachowuje logo i render bez wprowadzania trzeciej limonki do UI).

**10. Jak następny projekt byłby lepszy.**
- **Bramka pakietu T0:** każde zdanie o kolejności („to jest pilot X", „to pierwsze wdrożenie") weryfikowane datami z gita, zanim wejdzie do przesłanek Routera. Karta projektu to narracja, nie fakt.
- **Bramka guarda przepisana:** nie „czy guard powstał w ≤N dni", tylko „**czy jego niepowodzenie coś zatrzymuje** — który build, który commit, który deploy". Dowodem jest wpis w `package.json`/CI, nie istnienie pliku.
- **Guard dwukierunkowy z automatu:** reguły dokumentu egzekwowane na korpusie kodu i na artefaktach publicznych (`public/**`), nie tylko wewnątrz dokumentu.
- **Odrzucenia mechanizmów opisują artefakt, nie projekt:** „gated" wyłącza SEO dla jednego pliku, a nie warstwę dystrybucji dla całego projektu. Router ma odrzucać per-artefakt, nie per-projekt.
- **Konflikty wariantów:** bramka pyta „jaki jest zakres każdej wartości i która reguła to egzekwuje", zamiast „którą wybieramy".
- Gdyby G2 była twarda, r352 miałoby dziś `generate-tokens.mjs` u siebie — kod już istnieje w `pilot-nazwa` i przyjmuje dwa schematy wejścia. Koszt niewykonania: trzy ręczne widoki i 9 findings dryfu po 4 tygodniach.

---

## Evidence (propozycje do kart + Ledger)

- **E1** {observation: destylat marki wyprowadzony z żywego kodu produkcyjnego własnej strony, z cytatami `path:line` i regułą pierwszeństwa kodu; proof: `.brand/design-system.md` nagłówek + `.brand/tokens.json` `$meta.note`, commit `53b0312` (2026-07-12); impact: potwierdza kartę poza kontekstem klienckim — źródłem może być własny kod, nie tylko zaakceptowany artefakt klienta; proposed_change: rozszerzyć `context` karty o „własny artefakt produkcyjny"; confidence_effect: +postmortem; mechanisms: [mech:working-artifact-extraction]}
- **E2** {observation: guard powstał tego samego dnia co v1, ale nie leży na żadnej ścieżce blokującej; 2026-08-09 zwraca 9 findings i exit 1, niezauważony; proof: `package.json` build = `vite build && inject-meta && prerender`, `brand:check` jako osobny skrypt; uruchomienie `node scripts/brand-check.mjs` 2026-08-09; impact: „guard istnieje" ≠ „guard chroni" — najkosztowniejszy tryb awarii tego projektu; proposed_change: `failure_condition` w karcie: guard poza ścieżką blokującą = dokumentacja; bramka mierzy podłączenie, nie istnienie; confidence_effect: bez zmian + flaga; mechanisms: [mech:incident-to-guard]}
- **E3** {observation: guard sprawdza dokument przeciw kodowi, ale nie kod przeciw regułom dokumentu — twarda reguła #1 łamana w publicznym artefakcie; proof: `scripts/brand-check.mjs` sekcja 3 skanuje wyłącznie `design-system.md` i `tokens.json`; `public/llms.txt` = 20 długich myślników; `src/app/pages/Estymacja907.tsx` „800–1 500 PLN"; 7 plików w `src/` z długim myślnikiem; impact: reguła marki żyje tylko tam, gdzie jest zapisana; proposed_change: kierunek guarda dwustronny (reguły → korpus kodu i `public/**`); confidence_effect: bez zmian; mechanisms: [mech:incident-to-guard, mech:single-source-compiler]}
- **E4** {observation: siódmy przypadek „single-source-compiler rekomendowany, nieużyty"; kompilator istnieje w repo klienckim i nie został przeniesiony do własnego; proof: `/Users/reszek/Klienci/pilot-nazwa/generate-tokens.mjs` (2026-07-10, `tokens.json → www/tokens.css + tokens.yaml`) vs brak `tokens.css` i braku generatora w `R352 WEBSITE`; impact: rekomendacja z siedmioma niewykonaniami przewiduje porażkę zamiast jej zapobiegać; proposed_change: warunek wejścia „generator już istnieje albo powstaje w tej iteracji", inaczej raportować jako ryzyko; confidence_effect: bez zmian + flaga wrong-trigger; mechanisms: [mech:single-source-compiler]}
- **E5** {observation: bramkowane źródło marki zasiliło publiczny kanał maszynowy w 6 dni; proof: `tokens.json` `voice.numberCanon` vs `public/llms.txt` sekcje „Proof (verified numbers)" i „Canonical descriptions", commit `4040f07` (2026-07-18) — te same sześć liczb; impact: odrzucanie dystrybucji na podstawie gatingu źródła jest błędem poziomu; proposed_change: trigger karty o wariant „gated źródło → publiczny feed maszynowy"; confidence_effect: +postmortem; mechanisms: [mech:agent-facing-distribution]}
- **E6** {observation: pierwsze w korpusie realne wykonanie benchmarkingu — w formie pomiaru widoczności w odpowiedziach LLM, z datą, listą encji konkurencyjnych i tezą kategorii; proof: `.brand/geo-visibility.md`, baseline 2026-07-12, commit `e91b41d` (2026-07-18); impact: karta była odrzucana czterokrotnie z powodu złego triggera, nie braku wartości; proposed_change: trigger „chcę być cytowany przez maszyny w kategorii bez incumbenta" + notatka metodologiczna (incognito — personalizacja skaziła 2/3 odpowiedzi w baseline); confidence_effect: +postmortem; mechanisms: [mech:competitive-benchmarking]}
- **E7** {observation: dowód sprzedażowy dla Brand Hub powstał z pilota klienckiego (Mała Palarnia, test AI 90/100), nie z własnego brand centre; repo frameworku nie odwołuje się do brand centre ani razu; proof: `playbook/PILOT-NOTES-malapalarnia.md`, `bramki/GATE-F2-brand-lock.md`; `grep -ri "brand.?cent|r352.com/brand"` w `r352-framework` = 0 trafień; impact: wariant „dogfooding" tej karty nie zadziałał — proof-first zadziałał na kliencie; proposed_change: flaga wrong-trigger dla projektów wewnętrznej kodyfikacji; confidence_effect: bez zmian; mechanisms: [mech:proof-first-demo-pitch]}
- **E8** {observation: konflikt trzech wartości rozstrzygnięty przez przypisanie zakresów + regułę maszynową + allowlistę w guardzie, nie przez wybór jednej wartości; proof: `tokens.json` `color.$rules.limeScopes` i `noThirdLimeInUI: true`; `HEX_ALLOWLIST` w `brand-check.mjs`; impact: bramka „wybierz jedną" narzucałaby gorsze rozwiązanie (utrata koloru logo lub wprowadzenie trzeciej limonki do UI); proposed_change: hipoteza `mech:scope-resolution`; confidence_effect: n/d (nowa hipoteza); mechanisms: [mech:single-source-compiler]}
- **E9** {observation metodologiczna: pole „Cel" karty projektu zawierało narrację retrospektywną, która stała się przesłanką Routera i przekrzywiła dwa z sześciu doborów; proof: daty — `GATE-F2-brand-lock.md` 2026-07-08, scaffold `407d09d` 2026-07-10, brand centre `53b0312` 2026-07-12; impact: pakiet T0 musi być datowany gitem, nie prozą karty; proposed_change: krok „weryfikacja kolejności datami" w PROTOKOL, przebieg A; confidence_effect: n/d; mechanisms: [wszystkie]}
