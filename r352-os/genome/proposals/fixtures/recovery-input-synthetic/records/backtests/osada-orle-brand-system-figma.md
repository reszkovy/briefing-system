---
id: "rec:backtests/osada-orle-brand-system-figma"
type: "record"
title: "Backtest — osada-orle-brand-system-figma"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:osada-orle-brand-system-figma"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — osada-orle-brand-system-figma

Data: 2026-08-09 · Protokół: PROTOKOL.md · Przebieg B (audyt falsyfikacyjny)
T0 ≈ koniec 06.2026 (pamięć osada-orle-brand.md ma ~44 dni na 2026-08-08 → sesja źródłowa ~25.06.2026).
Źródła przebiegu rzeczywistego: memory/osada-orle-brand.md (~25.06.2026), memory/osada-orle-deck-sponsorski.md (modified 2026-08-02), karty proj:osada-orle-brand-system-figma i proj:osada-orle-deck-morisson (import CKO 07–08.08.2026), inspekcja dysku 2026-08-08 (brak folderu "OSADA ORLE" na Desktopie, brak katalogu kodu/tokens.json projektu).

## Pakiet T0 (skrót)

Osada Orle / Izera Sp. z o.o. — strategia marki wyłącznie w dokumentach (esencja "Karmimy ciało i duszę na izerskim szlaku", Opiekun 65%/Twórca 35%), zero systemu wizualnego. Zlecenie: operacyjny design system w Figmie z trybami Dzień/Noc; pierwszy konsument = deck sponsorski. Stan r352: praktyka tokens-first znana (Archicom, FitStyle, Lumo); projekt pre-Router.

## Skrót raportu Routera T0 (przebieg A — nie poprawiany)

Rekomendowane: single-source-compiler, competitive-benchmarking, numeric-gates (Brand Lock G4: 3 slajdy tylko z systemu), design-as-code (wariant lekki variables-first), session-to-sop. Odrzucone: working-artifact-extraction, format-dictionary, proof-first-demo-pitch, deterministic-spine/machine-narrows. Workflow G1–G4 (mapa znaczeń → benchmark → tokeny/mody → komponenty pull-em od decka → Brand Lock). Ryzyka: system bez konsumenta; Noc jako inwersja; nieprzetłumaczalność strategii; wejścia poza trwałym zasobem; dryf system↔deck. Predykcje SYGNAŁ: bt-01…bt-06 (niżej).

## Przebieg rzeczywisty (rekonstrukcja z dowodów)

System powstał w Figmie (file key tXqtp37NOWPGchjsKCvf8d, zespół "reszek"): Fraunces (serif, nagłówki/logotyp) + Work Sans (grotesk, UI/treść); paleta jako PRYMITYWY 50–900 (Granat #2E4565, Mosiądz #B0863B, Las #5E7547, Papier #FBF8F1) + TRYBY SEMANTYCZNE Dzień/Noc, gdzie Noc = zaprojektowane nawiązanie do Parku Ciemnego Nieba (nie inwersja). Strony: 01 Okładka, 02 Fundamenty, 03 Komponenty (Button, Tag, Card), 04 Przykład użycia. Karta projektu: "Zakończony jako działający system referencyjny — aktywnie zasila deck sponsorski Morisson". Deck żyje w OSOBNYM pliku "Morisson" (mRIPaIu7UzaQSKMqmtVR14) + kopia robocza; slajdy draftu używają fontów systemu (Fraunces+Work Sans OK) i nazw kolorów systemu (granat+mosiądz, papier+las), ale tło slajdów zapisane lokalnym hexem "#C4A35A" ≠ core Mosiądz #B0863B (możliwy prymityw 400, ale wartość żyje w slajdzie, nie w bibliotece). Brak śladu: benchmarku, tokens.json/repo, SOP, formalnych bramek, korekty zwrotnej deck→system. Dokumenty źródłowe wskazane w pamięci na /Users/reszek/Desktop/OSADA ORLE — folder na 2026-08-08 NIE istnieje na Desktopie.

## Porównanie predykcji SYGNAŁ

| ID | p | Werdykt | Dowód |
|---|---|---|---|
| bt-01 (Dzień/Noc jako systemowa para, osobno zaprojektowane, oba kompletne) | 0.70 | **HIT (częściowy)** | Tryby semantyczne Dzień/Noc na prymitywach; Noc = motyw Parku Ciemnego Nieba, nie inwersja (memory ~25.06). ALE kompletność OBU trybów nieweryfikowalna z dostępnych źródeł — druga część claimu nierozstrzygnięta. |
| bt-02 (deck pierwszym konsumentem + ≥1 zwrotna korekta systemu) | 0.70 | **PARTIAL** | Pierwsza część HIT: karta projektu 07.08 "aktywnie zasila deck sponsorski Morisson"; deck używa fontów/palety systemu. Druga część BEZ ŚLADU: zero dowodu na korektę zwrotną; zamiast tego jednokierunkowy zasil + lokalne wartości w decku (#C4A35A). Koniunkcja nie trafiona. |
| bt-03 (typografia dwubiegunowa serif display + sans operacyjny) | 0.65 | **HIT** | Fraunces (serif, nagłówki/logotyp) + Work Sans (grotesk, UI/treść) — dokładnie przewidziana struktura. Najczystszy hit; zauważ jednak, że to też standard niszy (generyczność częściowo osłabia wartość dowodową). |
| bt-04 (żaden benchmark przed decyzjami wizualnymi) | 0.60 | **HIT (słaby — absencja)** | Zero śladu benchmarku w pamięci, kartach i na dysku. Dowód z nieobecności — zgodny z wzorcem epoki (r352-website, marka-tlumacz v1), ale nie twardy. |
| bt-05 (brak eksportu maszynowego; system żyje tylko jako plik Figma) | 0.60 | **HIT (słaby — absencja)** | Brak tokens.json/repo/biblioteki publikowanej gdziekolwiek na dysku i w pamięci; jedyny nośnik = file key Figma + notatka pamięci. |
| bt-06 (dokumenty źródłowe niezarchiwizowane; jedyne operacyjne źródło = Figma) | 0.55 | **HIT (częściowy)** | Folder /Users/reszek/Desktop/OSADA ORLE (1-pager, strategia 15 str., warsztat, logo) NIE istnieje na 2026-08-08 — wejścia przepadły z jedynej znanej lokalizacji. ALE: druga część claimu nieścisła — obok Figmy przetrwał destylat w pamięci sesyjnej (osada-orle-brand.md), więc "jedynym źródłem Figma" to za mocno. |

Wynik predykcji: 2 HIT (w tym 1 generyczny), 2 HIT częściowe, 2 PARTIAL/słabe, 0 czystych pudeł. Zastrzeżenie hindsight jak w pilocie: wykonawca zna wynik; realna wartość = struktura pudeł.

## Porównanie mechanizmów

- **mech:design-as-code (wariant variables-first) — PEŁNY HIT.** Jedyny mechanizm realnie użyty i nośny: prymitywy 50–900 + mody semantyczne Dzień/Noc to dokładnie "jedna definicja semantyczna, dwa mody". Rdzeń sukcesu projektu.
- **mech:numeric-gates (Brand Lock G4) — PARTIAL.** Wynik bramki zaszedł BEZ bramki: deck realnie skonsumował system (test G4 de facto zdany), ale żadna formalna bramka/checklist nie istniała i drobny dryf (hex lokalny) przeszedł niewykryty — czyli bramka nie była potrzebna do sukcesu, byłaby potrzebna do wychwycenia dryfu.
- **mech:single-source-compiler — WRONG (rekomendowany, nieużyty i nieaplikowalny).** Brak kompilatora, brak maszynowego źródła, brak konsumenta kodowego i nikogo do utrzymania generatora — własny anti-context karty ("nie ma nikogo, kto utrzyma generator") pasował do T0. Router pomylił "wiele przyszłych widoków" (hipotetyczne) z realnym stanem: w horyzoncie projektu istniał JEDEN konsument (deck) w tym samym narzędziu (Figma). Wystarczyła biblioteka Figmy, nie kompilator.
- **mech:competitive-benchmarking — WRONG jako egzekucja (rekomendowany, niewykonany).** Trzeci backtest z rzędu (po r352-website, r352-case-studies) z wzorcem "rekomendacja z twardą bramką → zero wykonania". Sama rekomendacja była zasadna (nowa nisza), ale karta nie ma mechanizmu egzekucji — rekomendacja bez wykonania to koszt zerowy i wartość zerowa.
- **mech:session-to-sop — WRONG (rekomendowany, nieużyty).** Żaden SOP "strategia→system→materiał" nie powstał; procedura żyje implicite w pamięci sesyjnej. Wzorzec: SOP nie powstaje bez natychmiastowego drugiego klienta tej samej klasy.
- **Odrzucenia — wszystkie trafne.** WAE (brak artefaktu), format-dictionary (brak wolumenu), proof-first (klient pozyskany), deterministic-spine (brak strumienia) — żaden nie okazał się potrzebny. Odrzucenie WAE z komentarzem "projekt sam wytworzy artefakt-źródło przyszłej ekstrakcji" potwierdzone: system stał się artefaktem referencyjnym dla decka.
- **Missed-used: brak.** Nie znaleziono mechanizmu użytego a nierekomendowanego (obsługa komentarzy przez API Figmy należy do projektu deck-morisson, nie do tego).

**Fit: 1/5 pełny + 1/5 częściowy + 3/5 wrong (nieużyte) ≈ 30%.** Wyraźnie gorzej niż briefsync (80–90%).

## Porównanie ryzyk

- R5 dryf system↔deck: **HIT** (lokalny hex #C4A35A w slajdach, deck w osobnym pliku + kopii roboczej bez wymuszenia stylów biblioteki).
- R4 wejścia poza trwałym zasobem: **HIT** (folder Desktop przepadł; mitygacja z workflow pkt 6 nigdy nie wykonana).
- R2 Noc jako inwersja: nie zmaterializowało się — ale kierunek mitygacji (osobne wartości semantyczne) pokrywa się z tym, co faktycznie zrobiono; ryzyko dobrze nazwane, choć nie wiemy, czy karta/praktyka to wymusiła, czy intuicja.
- R1 system bez konsumenta: **MISS** (nie zaszło — deck skonsumował system; słuszna była mitygacja, nie ryzyko).
- R3 negocjacja gustu bez mapy znaczeń: **nierozstrzygnięte** (46 komentarzy klienta dotyczy decka/treści, nie systemu; brak śladu G1, brak śladu kosztu jego braku).

## Raport 10 sekcji (CEO)

1. **Accuracy Routera:** predykcje: 0 czystych pudeł, ale tylko 1–2 czyste hity, reszta częściowa; ryzyka 2/5 hit, 1 miss, 2 nierozstrzygnięte. Router dobrze przewidział KSZTAŁT artefaktu (typografia, mody, konsument), źle przewidział PROCES (bramki, benchmark, SOP, kompilator — nic z tego nie zaistniało). Wzorzec: Router T0 projektuje proces idealny, rzeczywistość pre-Genome wykonała 20% procesu i osiągnęła wynik.
2. **Accuracy Mechanism Selection: ≈30%** (1 pełny, 1 częściowy, 3 nieużyte z 5). Odrzucenia 4/4 trafne — Router lepiej odrzuca niż rekomenduje. Główna wada: over-prescription ciężkiej maszynerii procesowej dla jednosesyjnego projektu z jednym konsumentem w jednym narzędziu.
3. **Największe błędy:** (a) rekomendacja single-source-compiler wbrew własnemu anti-context karty — brak konsumenta kodowego i utrzymującego; mylenie "kiedyś będzie wiele widoków" z "dziś są ≥2 widoki"; (b) druga część bt-02 (zwrotna korekta deck→system) — projekcja wzorca WAE/"drugie użycie koryguje rdzeń" na sytuację, gdzie konsument po prostu dryfuje lokalnie zamiast korygować źródło; (c) benchmark po raz trzeci rekomendowany i po raz trzeci niewykonany — karta bez mechanizmu egzekucji jest dekoracją.
4. **Największe sukcesy:** (a) bt-01/bt-03 — struktura systemu (para typograficzna, mody semantyczne zamiast inwersji) przewidziana trafnie z samej esencji marki + praktyki tokens-first; (b) ryzyka R4/R5 (wejścia przepadną, deck będzie dryfował lokalnie) trafione co do joty — to są przewidywalne klasy, nie przypadki; (c) komplet trafnych odrzuceń.
5. **Nowe mechanizmy (hipotezy):** (a) **mech:figma-variables-as-tokens** — wariant design-as-code, w którym zmienne Figmy SĄ źródłem tokenów bez eksportu maszynowego; wystarczający, dopóki nie istnieje konsument kodowy; tańszy niż SSC o rząd wielkości; (b) **mech:reference-example-page** — strona "Przykład użycia" w systemie jako lekki substytut Brand Locka: żywy dowód, że system produkuje materiał, bez formalnej bramki; (c) kandydat na guard (nie mechanizm): **library-enforcement** — konsument w Figmie musi używać stylów/zmiennych biblioteki, nie surowych hexów; dryf #C4A35A jest niewykrywalny bez tego.
6. **Mechanizmy do usunięcia:** żaden do usunięcia. Ale single-source-compiler wymaga w karcie twardego warunku wejścia "istnieją DZIŚ ≥2 realnie utrzymywane widoki LUB konsument kodowy" (kolejna flaga po dailyfruits-seo-oferta i beesknees).
7. **Confidence Changes (PROPOZYCJE — zapis robi sesja główna):** design-as-code: +evidence typu postmortem (wariant variables-first zrealizowany i nośny) — kandydat na podbicie w stronę emerging-mocne; single-source-compiler: BEZ zmiany confidence, kolejna flaga too-broad (rekomendacja wbrew anti-context); competitive-benchmarking: BEZ zmiany, flaga execution-gap/wrong-trigger (3× rekomendowany, 0× wykonany — karta hypothesis pozostaje niesfalsyfikowana, bo nigdy nie przetestowana); numeric-gates: BEZ zmiany, adnotacja anti-context "jednosesyjny projekt z jednym konsumentem — bramkę zastępuje strona przykładu użycia"; session-to-sop: BEZ zmiany, flaga "SOP wymaga drugiego klienta tej samej klasy w horyzoncie".
8. **Nowe hipotezy:** patrz sekcja 5; dodatkowo: "konsument w tym samym narzędziu co źródło (Figma→Figma) NIE koryguje źródła — dryfuje lokalnie; korektę zwrotną wymusza dopiero konsument w INNYM medium" (falsyfikowalne na następnym projekcie brand→deck/strona).
9. **Czego Genome nie wiedziało w T0:** że deck będzie żył w osobnym, ciężkim pliku Figma odpornym na narzędzia (timeouty przy 61 dzieciach, komentarze tylko przez wewnętrzne API) — więc każda idea "deck jako widok kompilowany z systemu" była technicznie martwa; że destylat marki przetrwa w pamięci sesyjnej mimo utraty dokumentów źródłowych (pamięć sesyjna jako przypadkowy, nieprojektowany backup); że pojedynczy projektant w jednej sesji osiąga wynik bez żadnej bramki formalnej — bramki adresują koordynację, nie jakość solo.
10. **Jak następny projekt będzie lepszy:** projekt klasy "brand od zera, konsument = 1 artefakt w tym samym narzędziu" dostaje z automatu: variables-first + stronę przykładu użycia + guard library-enforcement + archiwizację wejść jako PIERWSZY krok (kopiowanie dokumentów do zasobu projektu przed jakąkolwiek grafiką — bo Desktop znika); SSC i SOP dopiero przy drugim konsumencie/kliencie; benchmark z bramką wykonawczą "delta-lista istnieje jako plik przed otwarciem Figmy" albo wcale.

## Evidence (do zapisu w kartach + Ledger przez sesję główną)

- E1 {observation: single-source-compiler rekomendowany wbrew własnemu anti-context — w horyzoncie projektu 1 konsument (deck) w tym samym narzędziu, zero konsumenta kodowego, zero utrzymującego; system zrealizowany biblioteką Figmy bez kompilatora; proof: memory/osada-orle-brand.md (~25.06.2026, tylko file key Figma, brak repo/tokens.json) + inspekcja dysku 2026-08-08 (brak katalogu projektu); impact: Router zawyża koszt wejścia projektów brandowych; proposed_change: warunek wejścia w karcie "DZIŚ ≥2 utrzymywane widoki LUB konsument kodowy", flaga too-broad; mech: single-source-compiler}
- E2 {observation: wariant variables-first zrealizowany dokładnie wg karty — prymitywy 50–900 + mody semantyczne Dzień/Noc (Noc jako motyw Parku Ciemnego Nieba, nie inwersja); proof: memory/osada-orle-brand.md (~25.06.2026); impact: potwierdzenie nośności design-as-code w wariancie lekkim dla brand-from-zero; proposed_change: +evidence postmortem, opis wariantu figma-variables-as-tokens w karcie; mech: design-as-code}
- E3 {observation: benchmark trzeci raz z rzędu rekomendowany i niewykonany (po r352-website, r352-case-studies-work); proof: brak jakiegokolwiek śladu benchmarku w memory/osada-orle-brand.md, kartach proj: i na dysku (sprawdzone 2026-08-08); impact: karta generuje rekomendacje bez egzekucji = zero wartości testowej, hipoteza nietestowalna; proposed_change: bramka wykonawcza "delta-lista jako plik przed pierwszym szkicem" albo zwężenie triggera; mech: competitive-benchmarking}
- E4 {observation: dryf system→deck zmaterializowany dokładnie wg ryzyka R5 — deck w osobnym pliku + kopii roboczej, tło slajdów lokalnym hexem #C4A35A zamiast wartości biblioteki (core Mosiądz #B0863B), bez śladu korekty zwrotnej do systemu; proof: memory/osada-orle-deck-sponsorski.md (modified 2026-08-02: "tło mosiądz #C4A35A/biel", plik Copy gxAepLF92YHvCe5Od8PXJt); impact: konsument w tym samym narzędziu dryfuje zamiast korygować źródło; proposed_change: guard library-enforcement (konsument używa stylów biblioteki, nie hexów) jako standard pary system+konsument w Figmie; mech: design-as-code, numeric-gates}
- E5 {observation: wejścia klienckie przepadły — folder /Users/reszek/Desktop/OSADA ORLE (1-pager, strategia 15 str., warsztat, logo) nie istnieje; jedyne przetrwałe źródła = plik Figma + destylat w pamięci sesyjnej; proof: memory/osada-orle-brand.md (~25.06.2026, ścieżka Desktop) vs ls Desktop 2026-08-08 (brak folderu); impact: przy powrocie do marki nie da się zweryfikować decyzji względem strategii źródłowej; proposed_change: krok "archiwizacja wejść do zasobu projektu" jako G0 (pierwszy, nie ostatni) w workflow Routera; mech: (workflow Routera, nie karta)}
