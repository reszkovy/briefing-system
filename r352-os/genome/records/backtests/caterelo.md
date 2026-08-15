---
id: "rec:backtests/caterelo"
type: "record"
title: "Backtest — caterelo"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:caterelo"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — caterelo (relocation engine + Deal Radar)

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji · Cel: **falsyfikacja**
T0 ≈ 25.04.2026 (pierwszy commit `b0cb15a` „PropTren v2 — Croatia, 90 regions, 6 countries"). Horyzont: 25.04 → 08.08.2026 (archiwizacja przy imporcie CKO).

**Źródła przebiegu rzeczywistego:**
- repo `/Users/reszek/Desktop/porządek_foldery/Aplikacja nieruchomosci/proptrend-deploy` (git, 31 commitów, 2 branche wypchnięte)
- wtyczka `/Users/reszek/Desktop/porządek_foldery/Aplikacja nieruchomosci/caterelo-deal-radar-v1.1-perf/`
- plany: `caterelo-sprint-plan-wave-turyn-2026-10.md` (v1.0, 02.07), `caterelo-sprint2-extension-wedge.md` (05–18.07), `caterelo-b2b-first-10-leads.md`, `caterelo-data-integrity-patch.md`, `SUBMIT-KIT-deal-radar.txt`
- benchmark: `proptren-competitive-intelligence-2026.html` (30.04.2026)
- pamięć: `memory/caterelo-product.md` (audyt 07.08.2026), karta `proj:caterelo`

---

## Pakiet T0 (co Router widział)

Produkt własny r352. Zleceniodawca = wykonawca = walidator. Cel: silnik decyzji relokacyjnych Płd. Europa (90 regionów, 6 krajów) z warstwą premium, wtyczka Chrome „Deal Radar", narracja „data/AI infrastructure" z **jawnie dopuszczonym wariantem „traction bez przychodu"** na Wave by Vento (Turyn, 7–9.10.2026). Jedna data zewnętrzna, jeden zewnętrzny odbiorca, dwa kanały dystrybucji (web własny + sklep z gatekeeperem), wiele zewnętrznych źródeł danych o różnych licencjach.

## Skrót Routera T0 (przebieg A)

**Rekomendowane (6 + 2 przekrojowe):** dated-commitment-gates (#1), machine-narrows-human-picks, deterministic-spine, location-as-data-funnels (+ location-as-data), agent-facing-distribution, open-tool-exchange; bramka stała seo-aeo-foundation (ze wzmocnieniem „hreflang ×6 obowiązkowo"), guard przekrojowy incident-to-guard.
**Odrzucone (4):** proof-first-demo-pitch (warunkowo — wraca przy ścieżce B2B), working-artifact-extraction, presale-demand-ledger (warunkowo — wraca, gdy premium dostanie datę startu; router nazwał go „najmocniejszym warunkowym kandydatem"), numeric-gates (wchłonięty przez deterministic-spine, uzasadnienie: ryzyko dwóch niewidzących się silników scoringu).
**Ryzyka:** R1 budowa zamiast walidacji · R2 ostatnia mila dystrybucji · R3 cicha nietrafność danych w 6 krajach · R4 zero mierzalnego popytu do pitchu · R5 asymetria „u klientów guardy, u siebie dyscyplina".
**Predykcje SYGNAŁ:** bt:caterelo-01…09.

---

## Przebieg B — porównanie z rzeczywistością

### Predykcje (9; base-rate B1–B6 nie oceniane)

| ID | p | Werdykt | Dowód |
|---|---|---|---|
| bt-01 | 0.75 | **MISS (compound)** — połowa trafiona | Bramka w kodzie: **HIT** — `src/hooks/use-premium.js`: `BETA_DEADLINE = 2026-08-31`, komentarz „Date-aware: flips to paid automatically after the deadline — no redeploy needed". Bramka na dystrybucję: **FALSYFIKOWANA** — `caterelo-sprint-plan-wave-turyn-2026-10.md` ma tabelę **Key Dates**: 18.07 werdykt wedge, **01.08 „MCP live w katalogach"**, 28.08 pilot B2B, 19.09 freeze liczb, 25.09 Index. Dystrybucja wtyczki ma osobny sprint S2 (05–18.07). Daty istniały, były precyzyjne — i **wszystkie ludzko-zależne zostały przekroczone** (stan 07.08: MCP niezarejestrowany, wtyczki nie ma w CWS). |
| bt-02 | 0.70 | **HIT (dokładny)** | Wtyczki nie ma w Chrome Web Store (audyt 07.08). Kod gotowy: paczki `v0.7/v0.8/v0.9/v1.0-store.zip` z 12.06, `v1.2-store.zip` z 07.08. `SUBMIT-KIT-deal-radar.txt` = gotowe do wklejenia pola formularza CWS. Blokada nazwana wprost w pamięci: **„zrzuty 1280×800 brakują"** — asset, nie kod. ≥8 tygodni „gotowa, niezłożona". |
| bt-03 | 0.80 | **HIT (dokładny)** | `src/constants/core-data.js` — 90 rekordów `{id, name, slug}` w 6 tablicach krajowych; `scripts/build-seo-regions.js` generuje 90 stron `public/regions/*`; łącznie **144 strony `index.html`** z jednego źródła (regiony + compare + visa + vs/alternatives). Ten sam zbiór zasila wtyczkę (`benchmarks-*.js`) i MCP. |
| bt-04 | 0.55 | **HIT (dokładny, obie połowy)** | Kanał TAK: `public/llms.txt`, `llms-full.txt`, `public/server.json` (schema MCP), `api/mcp.js` (531 linii, 5 narzędzi), robots.txt z jawnym Allow dla GPTBot/ClaudeBot/PerplexityBot/16 innych. Dystrybucja kanału NIE: „Nie jest zarejestrowany w żadnym katalogu" (07.08), termin 01.08 przekroczony. Pomiar NIE: zero licznika/analityki w `api/mcp.js` (plan wymagał „licznik wywołań bije od lipca"). Dodatkowo `/mcp/` zwracało **404 do 07.08** — „nie było czego zgłosić do rejestrów" (commit `d638c85`). |
| bt-05 | 0.70 | **HIT (dokładny)** | `src/utils/life-trend.js`: jawne wagi w kodzie (safety 18, cost 15, healthcare 11, digital 9, climate 12…), `_minmax` na jawnych zakresach. `caterelo-deal-radar/score.js`: model regułowy (condition/floor/size factors, `CDR_RENO_COST_PER_M2 = 950`), zwraca `null` przy brakach. Commit `646a32a` (07.08): **„usun wlasnego AI Advisora, oddaj to MCP"** — LLM wypchnięty poza ścieżkę wyliczania wyniku. |
| bt-06 | 0.65 | **HIT na wyniku / uzasadnienie FALSYFIKOWANE** | Wynik: zero przychodu w historii projektu; `public/pitchen/` (Validation Brief v17, maj) opisuje **status produktu** („Live / Beta / Not active yet / Hypothesis"), nie popyt; sekcja „Math — validation revenue, not ARR theatre… This is pre-PMF". Uzasadnienie routera („brak planu zdobycia liczby popytowej") **nieprawdziwe**: S2 miał twardy próg — „≥3 płacące osoby z src=ext/reddit/hn/fb ORAZ ≥80 installs ORAZ ≥1 click-to-Stripe", z datą werdyktu 18.07 i konsekwencją (wariant A traction / B data play). Plan był wzorcowy — **nigdy nie wystartował, bo jego prerekwizyt „CWS go-live verification" nie zaszedł**. |
| bt-07 | 0.60 | **PARTIAL** | „Bez blokującego guarda": **HIT** — `scripts/check-data-consistency.js` ma w nagłówku „**report-only, NOT part of the build chain**… usable as a CI gate", a jedyny workflow w `.github/workflows/` to `lighthouse.yml`. Zewnętrzne zachowania: MCP wymaga końcowego slasha, bez niego 308 „za którym wielu klientów MCP nie podąża"; limit Vercela 12/12 funkcji wymusił usunięcie endpointu (`d786fa8`); OMI „danych nie ma (next data cycle)" po zabudżetowaniu 14 h na swap. Ale klasy **„pomylone z bugiem własnego kodu"** nie udokumentowano — wystąpiła klasa **odwrotna** (niżej, E4). |
| bt-08 | 0.50 | **HIT — i gorzej niż przewidziano** | Brak realnej transakcji do archiwizacji. Ścieżka płatności nie tylko nieukończona, ale **zepsuta na produkcji**: commit `6f40af6` (07.08) — „/premium/success/ wydawal dzialajacy kod TREN7 **kazdemu**, kto wszedl na ten adres — bez zadnej weryfikacji platnosci"; „GA4 liczylo zakup przy **kazdym zaladowaniu** strony sukcesu… wliczajac odswiezenia i testy wewnetrzne". Czyli ani transakcji, ani wiarygodnego pomiaru. |
| bt-09 | 0.45 | **MISS (falsyfikacja)** | Formalny benchmark **istnieje i jest obszerny**: `proptren-competitive-intelligence-2026.html`, 30.04.2026 — 12 konkurentów w 4 kategoriach (Nomad List, Numbeo, Global Property Guide, CASAFARI, AirDNA, Mashvisor, Teleport, Idealista/data, ERI, BiggerPockets, Relocate Handbook, Globihome), **feature matrix vs top 6**, lekcje per gracz, roadmapa monetyzacji. Co więcej — obrócony w aktywa: `public/caterelo-vs-nomad-list/`, `/caterelo-vs-numbeo/`, `/best-numbeo-alternatives-for-families/`, `/best-teleport-alternatives/` i 7 dalszych stron. |

**Bilans:** pełne trafienia **5/9** (02, 03, 04, 05, 08), częściowe **3/9** (01, 06, 07), pudło **1/9** (09).
Ważniejsze od procentu: **dwie predykcje trafiły w wynik z błędnego powodu** (01, 06) — Router zakładał, że wąskim gardłem jest brak zapisanej bramki. Rzeczywistość: **wszystko było zapisane** — benchmark, daty, progi liczbowe, kryteria GO/STOP, sprint dystrybucyjny, gotowy kit do sklepu. Nie wykonał się **akt**.

### Ryzyka

- **R1 (budowa zamiast walidacji) — HIT.** 31 commitów, 144 strony, 5 narzędzi MCP, warstwa sejsmiczna dla 90 regionów, Community Fabric Index, 18 ścieżek wizowych — przy zerowej liczbie użytkowników płacących i zerowej dystrybucji wtyczki.
- **R2 (ostatnia mila) — HIT, najsilniejszy w całym backteście.** Dwa kanały z zewnętrznym gatekeeperem, oba niedoręczone: CWS (kit gotowy, brak zrzutów) i rejestry MCP (server.json gotowy 07.08, zgłoszenia brak).
- **R3 (cicha nietrafność danych) — HIT, ale w innej klasie niż przewidziano.** Router bał się dopasowania „podobnego zamiast pustki" (precedens Adobe Stock). Wystąpiły natomiast **sprzeczności między polami wyliczanymi z tego samego rekordu, publikowane na skalę**: `94bb178` — „sprzecznosc widoczna dla uzytkownika na **72 z 90** stron regionow" (ten sam czynsz podany dwiema kwotami, obie trafiały do schema.org FAQPage); rentowność zawyżona o ~7 % (regionów >8 % brutto: 38 → 28); `d454f53` — 19 stron twierdziło jednocześnie „0 international schools" i „significant clustering", 25 stron „less developed" obok deklaracji o coworkingach; `c66e5c6` — **wymiar kosztu życia liczony odwrotnie w API/MCP**: „sredni koszt zycia w pierwszej dziesiatce rankingu MCP wynosil 1950 EUR, w ostatniej 894 EUR. Kazdy asystent AI odpytujacy Caterelo o najlepsze miejsce do przeprowadzki dostawal ranking premiujacy najdrozsze regiony."
- **R4 (zero mierzalnego popytu) — HIT.** Zero przychodu, zero instalacji, pomiar konwersji zepsuty do 07.08.
- **R5 (asymetria higieny) — HIT, w cięższej formie.** Guard istniał i **cicho przestał guardować**: `7a9cb4a` — „check-data-consistency.js wskazywal sciezke sprzed przeniesienia katalogu, wiec **od miesiecy po cichu pomijal kontrole i konczyl sie PASS**". Po naprawie: „12 twardych bledow i 42 ostrzezenia — to NIE sa regresje, tylko istniejace problemy danych, ktore wreszcie widac". Do tego samo-zadana regresja: `d454f53` — „REGRESJA Z POPRZEDNIEGO COMMITA: zmienilem mianownik… tylko w jednej z dwoch sekcji".

---

## Raport 10 sekcji (CEO)

### 1. Accuracy Routera
Ryzyka **5/5 HIT** — ale dwa z nich (R3, R5) trafiły w cel z **niewłaściwym mechanizmem materializacji**, więc zaproponowana mitygacja by ich nie złapała. Predykcje: 5 pełnych / 3 częściowe / 1 pudło. Przewidywany rezultat („zbudowane, niedystrybuowane, bez przychodu") = trafiony w całości.
**Systemowy błąd Routera:** diagnoza „brak zapisanej bramki / brak planu" jest tu fałszywa w każdym punkcie, w którym została postawiona. Caterelo ma najlepszą dokumentację planistyczną w całym korpusie r352 (benchmark 12 graczy, sprint plany z capacity i buforem 25 %, progi liczbowe, tabela Key Dates, Definition of Done, tabela ryzyk z mitygacjami) — i mimo to **nie wykonał ani jednego aktu dystrybucji**. Router mierzył artefakty planistyczne tam, gdzie należało mierzyć akty.

### 2. Accuracy Mechanism Selection
**Pełne trafienia (5):** deterministic-spine, location-as-data-funnels (+location-as-data), machine-narrows-human-picks, agent-facing-distribution, incident-to-guard.
**Częściowe (2):** dated-commitment-gates (mechanizm właściwy, **prescription za słaba** — karta mówi „na piśmie", a projekt dowodzi, że pismo jest bezwartościowe), seo-aeo-foundation (warstwa trafiona i już istniejąca; wzmocnienie **hreflang ×6 błędne** — produkt jest świadomie jednojęzyczny, `lang="en"` na wszystkich 144 stronach, jeden `hreflang="en"` self-referencing).
**Błędnie odrzucone (2):** presale-demand-ledger (trigger BYŁ spełniony — premium ma twardą datę startu `BETA_DEADLINE` 31.08 wpisaną w kod; router sam nazwał go „najmocniejszym warunkowym kandydatem" i mimo to nie zarekomendował), proof-first-demo-pitch (ścieżka B2B istniała w planach projektu: pilot 12 000 PLN, ciepłe leady Benefit/Sonova/Archicom — czyli dokładnie warunek powrotu, który router opisał).
**Najlepsza decyzja Routera:** wchłonięcie numeric-gates w deterministic-spine z uzasadnieniem „ryzyko dwóch niewidzących się silników scoringu". To **zmaterializowało się co do joty**: `src/utils/life-trend.js` (wagi 18/15/11, zakres kosztu 400–2000) vs `api/lifetrend.js` (wagi 22/18/13, zakres 400–2000 → po fixie 950–2500) — dwie implementacje `_rawLifeTrend`, z których **API przez miesiące zwracało odwrotny ranking kosztu życia**. Fix `c66e5c6` musiał jawnie „wyrównać zakres do src/app.js, żeby API i aplikacja liczyły ten wymiar tak samo".
Fit ≈ **70 %** (5 pełnych + 2 częściowe z 8 zarekomendowanych; 2 mechanizmy potrzebne, a odrzucone).

### 3. Największe błędy
1. **Router zdiagnozował brak planu tam, gdzie był brak aktu.** Wszystkie rekomendacje typu „spisz bramkę / zrób delta-listę / ustal próg" były już wykonane przed T0+1 tydzień. Router nie ma mechanizmu odróżniającego „dokument istnieje" od „akt zaszedł".
2. **hreflang ×6** — rekomendacja z pomylenia liczby rynków z liczbą języków. Kosztowna, bo brzmi jak twarda bramka SEO, a jest sprzeczna z produktem.
3. **Odrzucenie presale-demand-ledger przy jednoczesnym nazwaniu go najmocniejszym kandydatem** — router zna właściwą odpowiedź i jej nie rekomenduje, bo trzyma się literalnego triggera karty („otwieramy X za kilka miesięcy"). Trigger jest za wąski: datą startu jest **każde wygaśnięcie darmowego dostępu**, nie tylko premiera.
4. **R3 zmitygowane niewłaściwie.** Router proponował próg dopasowania i datę ważności per rekord. Rzeczywiste błędy to **wewnętrzne sprzeczności między polami wyliczanymi z tego samego rekordu** (czynsz 850 vs 1462 dla Toskanii na jednej stronie) i **zdania generowane bez bramki na dane, które twierdzą** („0 szkół" + „znaczące skupisko"). Żadna karta Genome tej klasy nie zna.
5. **Nikt nie zauważył sprzeczności premium ↔ open beta.** S2 miał udowodnić popyt sprzedażą €7 w oknie 05–18.07, podczas gdy `OPEN_BETA` (11.06 → 31.08) dawał całe web-premium za darmo. Test woli zapłaty biegł równolegle do rozdawania przedmiotu testu.

### 4. Największe sukcesy
1. **deterministic-spine + wchłonięcie numeric-gates** — jedyna rekomendacja, która przewidziała konkretny, kosztowny, cichy błąd produkcyjny **z nazwy**.
2. **agent-facing-distribution** — trafiony podwójnie: i „kanał zbudowany, niedystrybuowany", i drugi failure karty, **„rozjazd dwóch prawd"** (API liczyło inaczej niż strona — dosłownie ten failure).
3. **location-as-data** — 90 rekordów → 144 strony + wtyczka + MCP z jednego źródła; koszt kolejnego regionu ≈ koszt wpisu. Mechanizm potwierdzony po raz szósty u tego wykonawcy.
4. **R2 jako ryzyko #1 po R1** — trafione co do kanału, co do blokady (asset, nie kod) i co do skali opóźnienia.

### 5. Nowe mechanizmy (hipotezy)
- **mech:gatekeeper-lead-time** — kanał, którego publikację kontroluje zewnętrzny recenzent (CWS, App Store, rejestr MCP), musi mieć **datę ZŁOŻENIA** (nie „gotowości") i **osobną pozycję na assety zgłoszeniowe** (zrzuty, ikony, polityka prywatności, formularz), bo to one, a nie kod, są blokadą. Definition of done kanału = „zgłoszone", nie „spakowane".
- **mech:act-not-artifact-gate** (rewizja dated-commitment-gates) — bramka liczy się wyłącznie wtedy, gdy jej konsekwencję egzekwuje **kod albo strona trzecia**. Bramka egzekwowana pamięcią właściciela nie jest bramką, choćby stała w tabeli Key Dates z datą dzienną. **Dowód wewnątrzprojektowy jest czysty:** jedyna bramka w kodzie (`BETA_DEADLINE`) zadziałała bez udziału człowieka; wszystkie ludzko-zależne (18.07, 01.08) przepadły w tym samym projekcie, u tego samego właściciela, w tym samym tygodniu.
- **mech:generated-copy-assertions** — przy generowaniu N stron z danych każde twierdzenie w copy musi być bramkowane na polu, które opisuje, a każda wielkość pojawiająca się dwa razy musi pochodzić z jednego wyliczenia. Klasa błędu: 72/90 stron ze sprzecznym czynszem, 19 stron z „0 szkół + znaczące skupisko", 25 stron „less developed" obok coworkingów.
- **mech:loud-guard** — guard, który nie może wykonać kontroli (brak pliku, zmieniona ścieżka, brak klucza), musi **krzyczeć**, nigdy nie zwracać PASS. Dowód: `check-data-consistency.js` przez miesiące kończył PASS, pomijając kontrolę po przeniesieniu katalogu.
- **mech:one-price-one-test** — w oknie testu popytu obowiązuje jedna cena i jeden przedmiot testu. Caterelo miało równolegle €7 / €29 / €79 / €14.90 / €4.90 / 12 000 PLN, a przedmiot testu (premium) był w tym czasie darmowy. Własny dokument B2B formułuje to jako rozkaz: „trzymaj JEDNĄ cenę — koniec z €7/€29/€79/€7900 naraz".

### 6. Mechanizmy do usunięcia
Brak kandydatów do usunięcia. **Do rewizji granic:** `mech:dated-commitment-gates` (rozdzielić egzekutora: kod / strona trzecia / pamięć — dziś karta traktuje je jednakowo, a różnica jest binarna), `mech:presale-demand-ledger` (rozszerzyć trigger o „kończy się darmowy dostęp"), `mech:seo-aeo-foundation` (usunąć automatyzm „N krajów ⇒ hreflang"; kryterium to liczba **języków treści**).

### 7. Confidence Changes — **PROPOZYCJE** (zapisy robi sesja główna)
- `mech:deterministic-spine` — **+1 postmortem** (retro, wynik rzeczywisty). Failure „duplikacja silników" potwierdzony dowodem produkcyjnym z pomiarem skutku.
- `mech:agent-facing-distribution` — **+1 postmortem**. Oba failure z karty potwierdzone w jednym projekcie; propozycja podniesienia z `hypothesis` przy n≥2 (r352-website + caterelo).
- `mech:location-as-data` / `location-as-data-funnels` — **+1 postmortem**, plus dopisanie do anti-context klasy „sprzeczności wewnątrz rekordu", obok istniejącej „dane rozjeżdżają się z rzeczywistością".
- `mech:incident-to-guard` — **+1 postmortem**, plus nowy failure_condition: „guard, który cicho przestał sprawdzać".
- `mech:dated-commitment-gates` — **bez podbicia confidence**, flaga `too-broad` + evidence rozstrzygające spór z bt:osada-orle-deck-morisson (patrz sekcja 8).
- `mech:competitive-benchmarking` — **evidence przeciwny dotychczasowemu wzorcowi**: pierwszy udokumentowany przypadek pełnego wykonania (12 graczy + macierz + obrócenie w 11 stron SEO). Wzorzec „rekomendowany → zero wykonania" (3 backtesty) wymaga zawężenia: nie wykonuje się przy **zleceniach klienckich**, wykonuje się przy **produkcie własnym w niszy z ustalonymi liderami**. Bez zmiany confidence, z korektą triggera.
- `mech:open-tool-exchange` — **bez zmian**, flaga `too-narrow`: karta rozstrzyga granicę darmowe/płatne, ale milczy o dyscyplinie testu cenowego, która była tu realnym wąskim gardłem.
- `mech:machine-narrows-human-picks` — **+1 postmortem** (zawężenie zrealizowane: quiz → top5, Deal Score → werdykt), z zastrzeżeniem, że „akt rozstrzygnięcia + jego pomiar" nie powstał.

### 8. Nowe hipotezy
- **H1 — spór o forcing function rozstrzygnięty na korzyść kodu.** bt:narzedzie-do-briefowania sugerował, że zewnętrzny odbiorca egzekwuje bramkę; bt:osada-orle-deck-morisson to sfalsyfikował. Caterelo daje **czysty test wewnątrz jednego projektu**: Wave (odbiorca zewnętrzny, data, brak umowy) **nie wyegzekwował** ani S2, ani terminu 01.08; `BETA_DEADLINE` w kodzie **wyegzekwował się sam**. Hipoteza do zapisu: *egzekwuje wyłącznie automat albo kontrahent z umową; publiczność bez zobowiązania nie egzekwuje niczego*.
- **H2 — kanał AI wymaga własnej telemetrii, bo GA4 go nie widzi.** Wywołania MCP i wizyty GPTBot/ClaudeBot nie pojawiają się w analityce frontowej; bez licznika po stronie API „traction AI" jest niemierzalny z definicji. (Plan wymagał licznika, kod go nie ma.)
- **H3 — ryzyko reputacyjne kanału agentowego jest wyższe niż kanału ludzkiego.** Błąd w API jest niewidoczny dla właściciela (nikt nie ogląda odpowiedzi) i jednocześnie propagowany z autorytetem asystenta. Odwrócony koszt życia żył w produkcji miesiące, bo **żaden człowiek nie czytał wyjścia**.
- **H4 — „pełny użyteczny wynik za darmo" ma anti-context: okno testu woli zapłaty.** Darmowa beta i test €7 nie mogą biec równolegle.
- **H5 (do zmierzenia)** — czy „gotowe, niezłożone" ma u tego właściciela stałą sygnaturę: artefakt gotowy → brakuje **jednego assetu prezentacyjnego** (zrzuty, zdjęcie foundera, strona /mcp/) → stop. Trzy niezależne wystąpienia w jednym projekcie.

### 9. Czego Genome nie wiedział w T0
1. Że ten wykonawca **planuje wybitnie i nie doręcza** — Genome nie miał kategorii „dług dystrybucyjny przy zerowym długu planistycznym".
2. Że **guard może cicho umrzeć** i przez miesiące raportować PASS — karta incident-to-guard zakładała, że guard albo jest, albo go nie ma.
3. Że **generowanie N stron z danych produkuje nową klasę błędów**: sprzeczności wewnątrz jednej strony, indeksowane jako dane strukturalne.
4. Że **kanał maszynowy potrzebuje własnej strony/manifestu jako warunku zgłoszenia** — `/mcp/` 404 blokowało rejestrację bardziej niż brak decyzji.
5. Że zewnętrzne źródło może po prostu **nie mieć danych** („OMI: next data cycle") po zabudżetowaniu 14 h na integrację — ryzyko dostępności ≠ ryzyko jakości.
6. Że przy jednym walidatorze **audyt własnego produktu znajduje kilkanaście błędów naraz dopiero, gdy zostanie zaplanowany jako osobne zadanie** (07.08: 11 commitów naprawczych w jeden dzień, po ~3 miesiącach ciszy).

### 10. Jak następny projekt będzie lepszy
- Każda bramka dostaje pole **egzekutor: kod | strona trzecia | pamięć**. Bramki z egzekutorem „pamięć" nie są liczone jako bramki i nie mogą być jedynym zabezpieczeniem kroku krytycznego.
- Kanał z gatekeeperem wchodzi do planu jako **data złożenia + lista assetów zgłoszeniowych**, wyceniona osobno od kodu.
- Każdy projekt generujący ≥10 stron z danych dostaje z automatu bramkę **cross-field assertions** w łańcuchu builda (twardy exit code), a nie skrypt „report-only".
- Każdy guard musi mieć test „co robisz, gdy nie możesz sprawdzić" — brak pliku/ścieżki = błąd, nigdy PASS.
- Okno testu popytu: jedna cena, jeden przedmiot, żadnego darmowego dostępu do przedmiotu testu w tym oknie.
- Kanał maszynowy: licznik wywołań i log user-agentów **w tym samym commicie**, w którym powstaje endpoint.

---

## Evidence (do zapisu w kartach + Ledger)

**E1** {obserwacja: bramka datowa egzekwowana kodem zadziałała bez człowieka, bramki datowe egzekwowane pamięcią przepadły — w tym samym projekcie, u tego samego właściciela, w tym samym miesiącu; dowód: `src/hooks/use-premium.js` `BETA_DEADLINE = 2026-08-31` z komentarzem „flips to paid automatically… no redeploy needed" vs `caterelo-sprint-plan-wave-turyn-2026-10.md` Key Dates „01.08 MCP live w katalogach" + sprint S2 05–18.07 „dystrybucja wtyczki" — oba niewykonane wg audytu 07.08.2026; wpływ: prescription karty („bramka na piśmie") jest niewystarczająca i myląca; zmiana: pole `egzekutor` w karcie + reguła „bramka bez automatycznej konsekwencji nie jest bramką"; confidence: bez podbicia, flaga too-broad; mech: dated-commitment-gates}

**E2** {obserwacja: dwie niewidzące się implementacje tego samego scoringu, z których jedna miała odwrócony wymiar i obsługiwała kanał AI; dowód: commit `c66e5c6` 2026-08-07 — „_minmax przyjmuje trzy argumenty, a wywolanie podawalo czwarty (true), ktory mial odwrocic skale i byl po cichu ignorowany… sredni koszt zycia w pierwszej dziesiatce rankingu MCP wynosil 1950 EUR, w ostatniej 894 EUR"; pliki `src/utils/life-trend.js` vs `api/lifetrend.js`; wpływ: failure_condition karty potwierdzony dowodem produkcyjnym z pomiarem skutku; zmiana: reguła „jeden silnik scoringu, N konfiguracji" + test równoważności app↔API jako bramka builda; confidence: +postmortem; mech: deterministic-spine, numeric-gates, agent-facing-distribution}

**E3** {obserwacja: kanał agentowy zbudowany kompletnie i niezarejestrowany; warunek zgłoszenia (strona /mcp/) powstał 6 dni PO deadlinie rejestracji; brak jakiegokolwiek pomiaru ruchu agentowego; dowód: `public/server.json`, `api/mcp.js` (531 linii, 5 narzędzi), `public/llms.txt`, robots.txt z Allow dla 16 botów AI; commit `d638c85` 2026-08-07 „/mcp/ zwracalo 404, wiec nie bylo czego zglosic do rejestrow MCP"; memory/caterelo-product.md 07.08: „Nie jest zarejestrowany w żadnym katalogu"; zero licznika w api/mcp.js; wpływ: potwierdza oba failure karty (niedystrybuowany kanał + rozjazd dwóch prawd); zmiana: definition of done kanału = „zgłoszone w ≥1 rejestrze + licznik wywołań w tym samym commicie"; confidence: +postmortem, kandydat hypothesis→emerging przy n=2; mech: agent-facing-distribution}

**E4** {obserwacja: guard danych przez miesiące zwracał PASS, bo nie mógł znaleźć pliku po przeniesieniu katalogu — a po naprawie ujawnił 12 twardych błędów i 42 ostrzeżenia istniejące od dawna; dodatkowo skrypt jest jawnie poza łańcuchem builda przy jedynym workflow CI = lighthouse.yml; dowód: commit `7a9cb4a` 2026-08-07 „check-data-consistency.js wskazywal sciezke sprzed przeniesienia katalogu, wiec od miesiecy po cichu pomijal kontrole i konczyl sie PASS… Zglasza teraz 12 twardych bledow i 42 ostrzezenia"; nagłówek `scripts/check-data-consistency.js`: „report-only, NOT part of the build chain"; wpływ: nowa klasa failure — guard żywy formalnie, martwy funkcjonalnie; zmiana: failure_condition „guard nie może zwrócić PASS, gdy nie wykonał kontroli" + reguła „u siebie też blokujące, nie report-only"; confidence: +postmortem; mech: incident-to-guard, deterministic-spine}

**E5** {obserwacja: generowanie 144 stron z jednego źródła wyprodukowało sprzeczności wewnątrz pojedynczej strony, publikowane też jako dane strukturalne; dowód: commit `94bb178` — „sprzecznosc widoczna dla uzytkownika na 72 z 90 stron regionow… Toskania 850 vs 1462 EUR… Obie trafialy tez do schema.org FAQPage"; commit `d454f53` — „19 stron twierdzilo jednoczesnie, ze szkol nie ma i ze jest ich znaczace skupisko", „25 stron less developed obok deklaracji o coworkingach", plus samo-zadana regresja mianownika w jednej z dwóch sekcji; wpływ: anti-context karty location-as-data zna tylko „dane rozjeżdżają się z rzeczywistością", nie zna sprzeczności wewnętrznych; zmiana: nowa hipoteza mech:generated-copy-assertions + dopisanie klasy do anti-context; confidence: +postmortem dla location-as-data; mech: location-as-data, location-as-data-funnels}

**E6** {obserwacja: plan zdobycia liczby popytowej istniał, był precyzyjny i miał datę werdyktu — i nie wystartował, bo jego jedyny prerekwizyt był aktem u zewnętrznego gatekeepera; równolegle przedmiot testu był darmowy; dowód: `caterelo-sprint2-extension-wedge.md` — „Definicja sukcesu wedge'a: ≥3 płacące osoby… ORAZ ≥80 installs ORAZ ≥1 click-to-Stripe", zależność P0 „CWS go-live verification"; `use-premium.js` OPEN_BETA 11.06→31.08 (całe web-premium darmowe w oknie S2); memory 07.08 „zero przychodu w historii projektu"; wpływ: falsyfikuje uzasadnienie „brak planu" i wskazuje realne wąskie gardło (akt u gatekeepera + kolizja beta/test ceny); zmiana: hipotezy mech:gatekeeper-lead-time i mech:one-price-one-test; przywrócenie presale-demand-ledger z szerszym triggerem („kończy się darmowy dostęp" = data startu); confidence: bez zmian, flagi; mech: presale-demand-ledger, open-tool-exchange, dated-commitment-gates}

**E7** {obserwacja: pierwszy w korpusie udokumentowany przypadek PEŁNEGO wykonania benchmarku konkurencji — wbrew wzorcowi z trzech poprzednich backtestów; dowód: `proptren-competitive-intelligence-2026.html` z 30.04.2026 (12 konkurentów w 4 kategoriach, feature matrix vs top 6, lekcja per gracz, roadmapa monetyzacji), obrócony w 11 stron SEO (`public/caterelo-vs-nomad-list/`, `/best-numbeo-alternatives-for-families/`, `/best-teleport-alternatives/` i in.); wpływ: falsyfikuje regułę „rekomendowany z twardą bramką → zero wykonania" jako uniwersalną; zmiana: zawężenie triggera — wzorzec braku wykonania dotyczy zleceń klienckich, nie produktu własnego w niszy z ustalonymi liderami; confidence: bez zmian, korekta triggera; mech: competitive-benchmarking}

**E8** {obserwacja: rekomendacja „hreflang ×6" wynikła z pomylenia liczby rynków z liczbą języków treści; dowód: wszystkie 144 strony `public/**/index.html` mają `lang="en"`, jedyny hreflang to self-referencing `hreflang="en"`; llms.txt deklaruje produkt anglojęzyczny dla 6 krajów; wpływ: fałszywa twarda bramka w raporcie Routera; zmiana: kryterium hreflang = liczba języków treści, nigdy liczba rynków; confidence: bez zmian; mech: seo-aeo-foundation}
