---
id: "rec:backtests/archicom-prezenter-reymonta"
type: "record"
title: "Backtest — archicom-prezenter-reymonta"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — archicom-prezenter-reymonta

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
T0 (wg pakietu) ≈ 07.08.2026. Źródła przebiegu rzeczywistego: memory/archicom-prezenter-reymonta.md (modified 07.08 07:10), karta proj:archicom-prezenter-reymonta, GENOME-OS-SNAPSHOT-2026-08-08.md, karta mech:working-artifact-extraction (sekcja Eksperyment · Archicom), pliki lokalne (~/Downloads/Reymonta_2026-08-03/ — 17 plików, ~/Downloads/transfer-019fb7bc/), brak katalogu kodu w repo.

**ZASTRZEŻENIE GRANICZNE:** ostatni ślad rzeczywisty = 08.08.2026, deadline = 10.08. Wynik końcowy (dowiezienie, rundy uwag, liczba stron, płatność) jest NIEZNANY. 4 z 6 predykcji SYGNAŁ są nierozstrzygalne z dostępnych źródeł — liczy się to jako ograniczenie backtestu, nie jako trafienia.

## Pakiet T0 (skrót)

Archicom (Marta Niwińska) zamawia prezenter Przystań Reymonta "dokładnie taki sam jak Bulwar" (minimalistyczny, 100% brand, motyw 3 linii z KV); 100–200 PLN/strona; deadline pon 10.08 (~3 dni); klient powracający z polecenia. Krytyczne ryzyko wg pakietu: materiały (mapa, wizki, plan, karty mieszkań) nie dotarły. Artefakt referencyjny: prezenter Bulwaru + KV.

## Skrót raportu Routera (przebieg A — nienaruszalny)

Rekomendowane: working-artifact-extraction (rdzeń), design-as-code, single-source-compiler (wersja minimalna), dated-commitment-gates (wariant materiałowy). Odrzucone: competitive-benchmarking, seo-aeo-foundation, proof-first-demo-pitch, format-dictionary/machine-narrows/deterministic-spine. Workflow 5 kroków z bramkami (kanoniczny artefakt → bramka materiałowa → akcept 1 strony wzorcowej → komplet → szablon rodziny). Top ryzyka: (R1) materiały nie dotrą, (R2) ekstrakcja z niewłaściwego wzorca, (R3) jedna runda przeglądu, (R4) fonty/render, (R5) scope creep kart mieszkań. Predykcje SYGNAŁ bt-01…bt-06.

## Przebieg B — Porównanie z rzeczywistością

### Rozstrzygnięcia predykcji SYGNAŁ

- **bt-01 (p=0.75, materiały nie dotrą przed produkcją → placeholdery/tura uzupełnień):** RDZEŃ SFALSYFIKOWANY / reszta nierozstrzygalna. Marta dosłała główną masę materiałów już **03.08** (stary prezenter, wizki WR1-3/WR2, rzuty pięter, 14 kart kondygnacji) — mimo własnego urlopu, przez zastępstwo (Ewelina Woźniak). Paczki pobrane 07.08 PRZED startem produkcji szkicu. Realnie brakowało mniejszości (mapa, wizka wnętrza "jeśli będzie", komplet WR4). Czy finał miał placeholdery/turę uzupełnień — nieznane (brak śladu po 08.08). Ocena: co najwyżej SŁABE, a przesłanka ("dostarczenie zależy od osób trzecich poza kontrolą") okazała się odwrócona — to klientka pchała materiały, a po stronie r352 wisiało niewysłane potwierdzenie odbioru ("wciąż do wysłania", 07.08).
- **bt-02 (p=0.70, styl z ekstrakcji zaakceptowanego artefaktu, nie z formalnych wytycznych):** **HIT (mocny, specyficzny).** Memory 07.08: kolory **zmierzone z PDF starego prezentera** (`#222B43`, `#30374D`, `#2E3E90`, `#8FA5CB`…), "**ZERO różu w brandzie inwestycji**", motyw 3 linii zdekodowany z KV (diagonalne pasy + 4 prążki nad rzutami). Formalne tokeny archicom-brand (Klein Blue #0626A9) NIE były źródłem stylu — dokładnie wzorzec atrium. Co więcej: snapshot CKO 08.08 rekomendował budowę "na tokenach archicom-brand", co pomiar z PDF de facto skorygował — ekstrakcja uchroniła przed błędem, który system sam podpowiadał.
- **bt-03 (p=0.60, artefakt kodowy HTML/CSS, nie DTP/Figma):** **MISS.** Produkcja poszła w **Figmie** (szkic 07.08, fileKey `l84CdSPbukoyR3qql8Vtu2`: okładka + 4 rozkładówki 2×A3). Zero katalogu kodu w repo, zero śladu HTML/build. Router przeniósł swój dominujący tryb (boardy digital) na replikę drukowanego artefaktu A3 — deliverable z rodziny print/InDesign naturalnie wylądował w narzędziu wizualnym.
- **bt-04 (p=0.55, ≤2 rundy uwag brandowych):** NIEROZSTRZYGNIĘTE — do 08.08 nie było żadnej rundy przeglądu (Marta na urlopie do 8.08).
- **bt-05 (p=0.55, ≥8 stron / ≥800 PLN):** NIEROZSTRZYGNIĘTE, lean-hit strukturalnie (struktura 8 slajdów od Marty, rozkładówki per budynek, 14 kart kondygnacji; zakres urósł do 3 prezenterów) — ale finalna liczba stron i faktura nieznane; dodatkowo "Brak formalnej akceptacji i brak ustalonej liczby stron" (memory) podważa pewność rozliczenia.
- **bt-06 (p=0.60, deadline 10.08 dotrzymany):** NIEROZSTRZYGNIĘTE — ostatni ślad 08.08 (szkic okładki + 4 rozkładówek), 2 dni przed terminem, stan zaawansowania umiarkowany.

**Bilans rozstrzygalnych: 1 HIT (bt-02), 1 MISS (bt-03), bt-01 rdzeń sfalsyfikowany; 3 nierozstrzygnięte.**

### Selekcja mechanizmów vs rzeczywistość

- **working-artifact-extraction — PEŁNY HIT.** Realnie użyty i nośny (pomiar kolorów z PDF, dekodowanie motywu z KV). Zastrzeżenie: wykonany "z ręki" (notatka w memory), NIE wg projektu eksperymentu z karty (mini-tokens.json jako biblioteka w Figmie — kryterium eksperymentu wciąż "Do uzupełnienia").
- **dated-commitment-gates (wariant materiałowy) — CZĘŚCIOWO/NIE UŻYTY.** Bramka materiałowa na piśmie nie została zakomunikowana (snapshot 08.08 dopiero ją REKOMENDUJE: "do piątku 17:00, inaczej placeholdery"); materiały przyszły bez bramki, z inicjatywy klientki. Kierunek ryzyka odwrócony: zawiodło potwierdzenie odbioru po stronie r352, nie dosyłka po stronie korporacji.
- **design-as-code — WRONG (nieużyty, zła rekomendacja dla tej klasy).** Figma zamiast HTML; cały krok 3 workflow (build parametryczny, config, render 1:1, fonty w godzinie 1) nie wydarzył się i nie był potrzebny w tej formie.
- **single-source-compiler — WRONG (nieużyty).** Zero śladu configu/jednego źródła danych; karty kondygnacji to PDF-y od klienta osadzane ręcznie. Nawet "wersja minimalna" nie powstała — przy 3 dniach i pracy w Figmie nie miała nośnika.
- **Odrzucenia Routera:** trafne co do mechanizmów (żaden odrzucony nie był używany), ALE uzasadnienie odrzucenia proof-first ("sprzedaż już domknięta") jest częściowo fałszywe — brak formalnej akceptacji wyceny i liczby stron (memory). Odrzucenie słuszne, przesłanka nadmiernie pewna.

**Fit: 1/4 pełny, 1/4 częściowy, 2/4 wrong ≈ 25–37%.** Missed-used: brak (nic istotnego użytego nie było poza rekomendacjami) — ale patrz "czego Genome nie wiedziało": realny przebieg zależał głównie od wiedzy, której pakiet T0 nie zawierał.

### Ryzyka vs rzeczywistość

- **R2 (ekstrakcja z niewłaściwego wzorca) — HIT, jedyne w pełni potwierdzone:** formalne tokeny ≠ brand inwestycji (zero różu); pomiar z PDF był konieczny; nawet snapshot CKO podpowiadał zły wzorzec.
- **R1 (materiały nie dotrą) — MISS w rdzeniu:** masa krytyczna dotarła 03.08, przed T0; ryzyko było już w większości skonsumowane w chwili raportu.
- **R5 (scope creep kart mieszkań) — NIEDOSZACOWANE o rząd wielkości:** realny scope-jump to nie "kilka kart więcej", tylko **3 prezentery (WR1-3, WR2, WR4) + rozdzielenie łączonych pięter** — i był ZNANY od maila 31.07, czyli przed T0. To nie było ryzyko przyszłe, to był fakt nieobecny w pakiecie.
- **R3 (jedna runda przeglądu), R4 (fonty/render)** — nierozstrzygnięte; R4 prawdopodobnie bezprzedmiotowe przy produkcji w Figmie.

## Raport 10 sekcji (CEO)

1. **Accuracy Routera:** Na rozstrzygalnych: predykcje 1/3 (bt-02 hit, bt-03 miss, bt-01 rdzeń sfalsyfikowany); ryzyka 1 hit (R2) / 1 miss (R1) / 1 poważnie niedoszacowane (R5) / 2 nierozstrzygnięte. Największa słabość NIE leży w logice Routera, tylko w świeżości pakietu T0 — Router poprawnie rozumował na danych, które były przeterminowane o 4–7 dni względem memory.
2. **Accuracy Mechanism Selection:** ≈25–37% (1 pełny + 1 częściowy na 4). Rdzeń (working-artifact-extraction) trafiony bezbłędnie i to on niósł projekt; dwie rekomendacje "produkcyjne" (design-as-code, single-source-compiler) to przeniesienie domyślnego trybu r352 na klasę deliverable'u (replika print A3), w której nie obowiązuje. Odrzucenia: 100% trafne co do wyniku.
3. **Największe błędy:** (a) pakiet T0 zbudowany na stanie karty projektu, nie na stanie memory — pominął mail 31.07 (scope ×3, rozdzielone piętra, struktura 8 slajdów od Marty) i dosyłkę 03.08; Router optymalizował pod wąskie gardło, które już nie istniało; (b) design-as-code rekomendowany bez warunku brzegowego "digital vs replika print" — bt-03 miss; (c) single-source-compiler "w wersji minimalnej" — rekomendacja bez nośnika przy pracy w Figmie; (d) przesłanka "sprzedaż domknięta" fałszywa (brak akceptacji wyceny); (e) kierunek ryzyka materiałowego odwrócony — zawodzi własne potwierdzenie odbioru, nie korporacyjna dosyłka.
4. **Największe sukcesy:** (a) bt-02/working-artifact-extraction — podręcznikowe potwierdzenie na DRUGIM projekcie tego samego klienta (po atrium): realny brand mierzy się z zaakceptowanego artefaktu, formalne tokeny mylą (zero różu vs Klein Blue); (b) R2 przewidziane precyzyjnie — i rzeczywistość pokazała, że nawet własny snapshot CKO podpowiadał zły wzorzec ("na tokenach archicom-brand"), więc to ryzyko było realne, nie teoretyczne; (c) komplet odrzuconych mechanizmów — czysty.
5. **Nowe mechanizmy (hipotezy):** (a) **guard:t0-freshness** — pakiet wejściowy Routera musi być diffowany z timestampami memory/maili; raport na przeterminowanych danych = błędna alokacja ryzyk (to guard procesu Routera, nie mechanizm projektowy); (b) **hipoteza: client-pushed-inputs** — u powracającego klienta korporacyjnego z relacją, wejścia potrafią przyjść z inicjatywy klienta (nawet z urlopu, przez zastępstwo); słabym ogniwem jest wtedy własna pętla potwierdzeń odbioru — kandydat na korektę założeń w dated-commitment-gates, nie osobna karta; (c) **warunek brzegowy dla design-as-code:** replika istniejącego artefaktu drukowanego (A3, rozkładówki, rodzina InDesign) → narzędzie wizualne (Figma/DTP); design-as-code dla artefaktów digital-first i generowanych wolumenowo.
6. **Mechanizmy do usunięcia:** żaden. Korekty granic: design-as-code (anti-context print-replika), single-source-compiler (anti-context: <5 dni + deliverable w narzędziu wizualnym), dated-commitment-gates (failure-mode: bramka na wejścia zbędna, gdy klient sam pcha; dodać "bramkę potwierdzeń odbioru" po własnej stronie).
7. **Confidence Changes (PROPOZYCJE — zapis robi sesja główna):** working-artifact-extraction: +evidence typu postmortem-retro (drugi projekt, ten sam klient, wynik rzeczywisty — pomiar z PDF); UWAGA dedupe: sekcja "Eksperyment · Archicom" w karcie dotyczy TEGO projektu — nie sumować z niniejszym backtestem. design-as-code: bez zmiany confidence, flaga too-broad + proponowany anti-context. single-source-compiler: bez zmiany, flaga wrong-trigger dla krótkich deliverable'i wizualnych. dated-commitment-gates: bez podbicia (wariant materiałowy nieprzetestowany — niewykonany), dopisać failure-mode "odwrócony kierunek".
8. **Nowe hipotezy:** patrz sekcja 5; dodatkowo bt-04/bt-05/bt-06 przechodzą w tryb "do rozstrzygnięcia po 10.08" — jeśli projekt dostanie postmortem, dopiąć wynik do tego rekordu (wersja 2), bo eksperyment working-artifact-extraction-test ma niewypełnione Kryterium (invariant 9) i ten projekt jest jego nośnikiem.
9. **Czego Genome nie wiedziało w T0:** (a) że scope to od 31.07 trzy prezentery per etap z rozdzielonymi piętrami; (b) że materiały w większości dotarły 03.08; (c) że struktura slajdów jest podyktowana przez klientkę 1:1 (8 pozycji) — praca strukturalna ≈ 0, co unieważnia część workflow; (d) że deadline ustalono telefonicznie (nie ma go w mailach) — kanał ustny jako źródło zobowiązań to luka radaru; (e) że wycena nie ma formalnej akceptacji; (f) że brand INWESTYCJI ≠ tokeny korporacyjne (to akurat Router przewidział przez analogię atrium — ale wiedza weszła do systemu dopiero pomiarem 07.08).
10. **Jak następny projekt będzie lepszy:** (a) Router dostaje T0-pack budowany z memory + skrzynki wg timestampów, z jawnym "stan na dzień X, ostatnia zmiana Y"; (b) przy repliku istniejącego artefaktu print pierwsze pytanie workflow: "w jakim narzędziu żyje oryginał i finał?" — dopiero potem tryb produkcji; (c) dla klientów korporacyjnych z relacją: zamiast bramki na ICH wejścia — checklist własnych potwierdzeń odbioru i faktur (to wisiało); (d) każdy projekt będący nośnikiem eksperymentu karty ma wypełnione Kryterium PRZED startem, inaczej eksperyment nie istnieje.

## Evidence (do zapisania w kartach + Ledger przez sesję główną)

- E1 {observation: styl prezentera odtworzony pomiarem kolorów z PDF zaakceptowanego starego prezentera + dekodowaniem motywu 3 linii z KV; formalne tokeny (Klein Blue, róż) NIE były źródłem — "ZERO różu w brandzie inwestycji"; proof: memory/archicom-prezenter-reymonta.md (modified 2026-08-07), sekcja "Szkic w Figmie (07.08)", fileKey l84CdSPbukoyR3qql8Vtu2; impact: drugi rzeczywisty przypadek u tego samego klienta (po atrium) — mechanizm nośny dla deliverable'i brandowych korporacji; proposed_change: evidence typu postmortem-retro + doprecyzowanie: "brand inwestycji/subbrandu ≠ tokeny korporacyjne — mierz z artefaktu instancji, nie marki-matki"; mechanisms: [mech:working-artifact-extraction]}
- E2 {observation: produkcja w Figmie (okładka + 4 rozkładówki 2×A3), zero HTML/build/katalogu kodu; proof: memory 2026-08-07 (fileKey), brak katalogu projektu w repo (git status / ls 2026-08-09); impact: rekomendacja design-as-code dla repliki drukowanego artefaktu = przeniesienie domyślnego trybu poza jego kontekst (bt-03 miss); proposed_change: anti-context w karcie: "replika/kontynuacja artefaktu print (A3, rozkładówki, rodzina DTP) → narzędzie wizualne; design-as-code dla digital-first i generacji wolumenowej"; mechanisms: [mech:design-as-code]}
- E3 {observation: żadne jedno źródło danych/config nie powstało — treść (karty kondygnacji, wizki) to PDF-y/JPG od klienta osadzane ręcznie; proof: memory 2026-08-07 (lista plików ~/Downloads/Reymonta_2026-08-03/, 17 plików zweryfikowanych), brak plików configu w repo (2026-08-09); impact: "wersja minimalna" kompilatora nie miała nośnika przy pracy w Figmie i 3 dniach; proposed_change: anti-context: "deliverable <5 dni produkowany w narzędziu wizualnym z assetów klienckich → compiler się nie amortyzuje"; mechanisms: [mech:single-source-compiler]}
- E4 {observation: materiały przyszły 03.08 z inicjatywy klientki (z urlopu, przez zastępstwo Ewelina Woźniak) BEZ żadnej bramki; bramka materiałowa na piśmie nie została zakomunikowana do 08.08, a po stronie r352 wisiało niewysłane potwierdzenie odbioru; proof: memory 2026-08-07 ("Materiały DOSŁANE 03.08", "Marta prosiła o potwierdzenie… wciąż do wysłania") + GENOME-OS-SNAPSHOT-2026-08-08 (priorytet 1 dopiero rekomenduje mail z cutoffem); impact: kierunek ryzyka odwrócony — u klienta z relacją słabe ogniwo to własna pętla potwierdzeń, nie korporacyjna dosyłka; proposed_change: failure-mode w karcie: "bramka na wejścia klienta bez weryfikacji, czy wejścia już nie przyszły = teatr; checklist potwierdzeń odbioru po własnej stronie"; mechanisms: [mech:dated-commitment-gates]}
- E5 {observation (metodologiczna): pakiet T0 był przeterminowany względem memory — mail 31.07 (scope ×3: WR1-3/WR2/WR4, rozdzielone piętra, struktura 8 slajdów od Marty) i dosyłka 03.08 istniały PRZED T0, a nie weszły do pakietu; Router poprawnie rozumował na złych danych (R1 skonsumowane, R5 niedoszacowane); proof: memory/archicom-prezenter-reymonta.md modified 2026-08-07T07:10 (sekcje "Zakres rozszerzony (mail 31.07.2026)" i "Materiały DOSŁANE 03.08.2026") vs treść pakietu T0 z przebiegu A (2026-08-09); impact: błędna alokacja ryzyk niezależna od jakości kart; proposed_change: reguła w PROTOKOL/ROUTER: T0-pack budowany z diffem timestampów memory+maili, z adnotacją "stan na dzień, ostatnia zmiana"; mechanisms: [wszystkie — proces Routera]}

## Status rozstrzygnięć odroczonych

bt-04, bt-05, bt-06 + finalny los bt-01 (placeholdery/tura uzupełnień) — do domknięcia po 10.08.2026, gdy pojawi się ślad wysyłki/feedbacku (mail, memory, postmortem). Rekord do podbicia do wersji 2.
