---
id: "rec:backtests/lemf-deck-figma"
type: "record"
title: "Backtest — lemf-deck-figma"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — lemf-deck-figma

Data: 2026-08-09 · Protokół: PROTOKOL.md · Przebieg B (audyt porównawczy, cel = falsyfikacja)
T0 ≈ 21.07.2026 (źródło `LEMF210726.pptx`). FINAL 23.07.2026. Źródła przebiegu: memory/lemf-deck-figma.md (modified 22.07.2026, wpis FINAL 23.07), karta proj:lemf-deck-figma (import CKO 07.08), folder lemf-assety/ (31 PNG, 06.08).

## Pakiet T0 (skrót)

Deck LEMF dla Miasta Łodzi istnieje tylko jako PPTX; w Figmie 13 płaskich PNG. Cel: w pełni edytowalny deck w Figmie (natywne obiekty), by zespół iterował przed złożeniem propozycji. Stan r352: wzorce pracy w plikach Figma klientów, znana klasa blokerów fontowych, brak gotowego narzędzia PPTX→Figma.

## Raport Routera T0 (skrót)

Rekomendowane: working-artifact-extraction, single-source-compiler, sandbox-promotion, design-as-code (zawężony: mapa fontów PRZED renderem), session-to-sop (drugorzędnie). Odrzucone: numeric-gates, deterministic-spine, format-dictionary, seo-aeo-foundation. Workflow z 3 bramkami (mapa fontów → pilot side-by-side → weryfikacja per slajd na finale). Ryzyka top-5: fonty, bitmapy, drift render↔źródło, cicha utrata treści, ruchomy cel. Predykcje SYGNAŁ bt-01…06.

## Przebieg rzeczywisty (fakty)

1. Pipeline: python czyta PPTX XML → `elements.json` (per-slajd: rects, runy tekstu, style, pt→px) → `batch{1..4}.js` → `use_figma`. Maszynowy format pośredni — dokładnie wzorzec compiler.
2. Render v1 na NOWEJ stronie „LEMF 2027 — edycja robocza" (23:2); stare PNG na Page 1 zostawione jako archiwum. Fonty Georgia/Arial niedostępne → jawna mapa substytutów w rendererze (PT Serif/Inter). Zdjęcia w v1 świadomie NIE przeniesione (tylko tekst+geometria+karty).
3. 23.07: klient dostarcza NOWE źródło `LEMF 230726 (1).pptx` = pełny redesign (WER 2.0): nowe fonty Anton/Space Mono/Archivo (wszystkie natywne w Figmie — substytuty zbędne), nowa paleta, 7 zdjęć. Pipeline przemielił nowe źródło → pełny re-render 21 slajdów na stronie „LEMF 2027 — FINAL (23.07)" (70:2).
4. W TRAKCIE renderu FINAL ktoś edytował plik ręcznie na żywo (restyle slajdu 1, usunięte placeholdery zdjęć na 1/6/7/20) → zdjęcia wgrane do storage Figmy, ale NIE podpięte; domknięcie odłożone „po ustaleniu z Reszkiem".
5. Pipeline został w scratchpadzie sesji (batchF1-4.js, media2/); wnioski w pamięci AI, zero SOP w repo. Karta projektu 08.08: status archived, zdjęcia nadal niepodpięte; produkcja assetów trwa (31 grafik 06.08).

## Porównanie predykcji SYGNAŁ

| ID | p | Werdykt | Uzasadnienie |
|---|---|---|---|
| bt-01 | 0.85 | **MISS (litera) / hit klasy** | Bloker fontowy wystąpił (Georgia/Arial → PT Serif/Inter w v1), ALE claim mówił „w finalnym decku zostanie użyta jawna mapa substytutów" — FINAL 23.07 używa fontów natywnych (Anton/Space Mono/Archivo), bo klient wymienił fonty w redesignie. Problem rozwiązał się przez zmianę źródła, nie przez substytuty. Predykcja skleiła „pierwszy render" z „finałem". |
| bt-02 | 0.70 | **HIT** | PPTX→elements.json→batch.js→use_figma; zero ręcznego przerysowywania. |
| bt-03 | 0.75 | **HIT** | Dwie nowe, jawnie nazwane strony (23:2, 70:2); 13 PNG na Page 1 nietknięte, zostawione jako archiwum. |
| bt-04 | 0.60 | **HIT (mocny, niemal dosłowny)** | Deck tekstowo kompletny 23.07; zdjęcia wgrane do storage, ale NIE podpięte; domknięcie = osobny ręczny krok, do 08.08 niewykonany. |
| bt-05 | 0.55 | **HIT (z korektą klasy)** | Ręczne edycje wystąpiły — ale W TRAKCIE renderu (kolizja równoległa: usunięte placeholdery = zerwane bindowanie zdjęć), nie jako powolny post-render drift zespołu. Skutek zgodny z claimem (czysty re-render niemożliwy bez utraty poprawek), mechanizm inny niż zakładany. |
| bt-06 | 0.65 | **PARTIAL** | Wszystkie 21 slajdów = natywne edytowalne frame'y w jednym przebiegu FINAL (batchF1-4) — ale 4 slajdy (1/6/7/20) bez zdjęć, więc „odtworzone w 100%" broni się tylko dla warstwy tekst+geometria. Do tego przebiegi były DWA pełne (v1 + FINAL po redesignie). |

Wynik SYGNAŁ: 3 HIT, 1 mocny HIT, 1 PARTIAL, 1 MISS na literze claimu. bt-02 i bt-03 oznaczam jako **słabe/generyczne** trafienia — przewidują dominujący odruch r352, nie specyfikę LEMF (wartość dowodowa niska, choć formalnie rozstrzygalne).

## Ryzyka Routera vs rzeczywistość

- **Fonty** — HIT (bloker wystąpił w v1), ale rozwiązanie przyszło z zewnątrz (redesign klienta), nie z bramki 1; brak śladu, że mapa substytutów była zatwierdzona przez Reszka PRZED renderem.
- **Bitmapy** — HIT, najcięższy realny problem, dokładnie w wariancie „częściowy transfer" (storage tak, binding nie).
- **Drift render↔źródło** — HIT jako skutek, inna klasa jako mechanizm: kolizja RÓWNOLEGŁA podczas renderu, nie edycje po nim.
- **Cicha utrata treści** — NIEROZSTRZYGNIĘTE: brak śladu weryfikacji per slajd (bramka 3 nie wykonana), więc nie wiemy, czy parser nic nie zgubił. Brak dowodu straty ≠ dowód braku straty.
- **Ruchomy cel** — HIT o NAJWYŻSZYM wpływie: pełna podmiana źródła 23.07 = podwójna praca (dwa pełne rendery). Router wymienił to jako ryzyko nr 5 i NIE wystawił na nie predykcji bt:; freeze wersji nigdy nie wyegzekwowano.

## 10 sekcji CEO

### 1. Accuracy Routera
Ryzyka: 4/5 hit (w tym 1 z korektą klasy mechanizmu), 1 nierozstrzygnięte. Predykcje SYGNAŁ: 4/6 hit (2 z nich generyczne-słabe), 1 partial, 1 miss na literze. Największa słabość: to, co Router zdegradował do ryzyka nr 5 bez predykcji (ruchomy cel), okazało się zdarzeniem o największym koszcie. Zastrzeżenie hindsight jak w pilocie: wykonawca zna wynik; realna wartość = struktura pudeł.

### 2. Accuracy Mechanism Selection
- **working-artifact-extraction** — FULL HIT: PPTX XML jako jedyne źródło prawdy, ekstrakcja do elements.json.
- **single-source-compiler** — FULL HIT z bonusem: kompilator zamortyzował się dokładnie w momencie pełnej podmiany źródła (redesign 23.07 → re-render 21 slajdów zamiast ręcznej przeróbki). Najmocniejsze potwierdzenie karty w tym backteście.
- **mech:sandbox-promotion** — FULL HIT: dwie jawne strony robocze, archiwum nietknięte.
- **design-as-code (zawężony)** — PARTIAL: mapa fontów RAZ w rendererze = hit; ale drugi człon importu („weryfikacja na finalnym wyrenderowanym slajdzie") nie ma śladu wykonania — bramka 3 nie zaszła, luka zdjęć wisi do dziś.
- **session-to-sop** — NIEUŻYTY (wrong w sensie protokołu): pipeline został w scratchpadzie, wnioski w pamięci AI, SOP nie powstał — mimo że deck Osady czeka jako druga instancja tej samej klasy. Uwaga metodologiczna: Router sam w base-rate przewidział, że SOP nie powstanie — rekomendowanie mechanizmu, którego niewykonanie się jednocześnie przewiduje, to podwójna księgowość bez wartości decyzyjnej.
- Odrzucenia (numeric-gates, deterministic-spine, format-dictionary, seo-aeo) — wszystkie zasadne, nic z odrzuconych nie okazało się potrzebne.
- Missed-used: brak — nie znalazłem mechanizmu użytego a nierekomendowanego.
Fit: 3 full / 1 partial / 1 nieużyty z 5 rekomendowanych ≈ 70–80%.

### 3. Największe błędy
1. **Ruchomy cel bez predykcji i bez egzekucji freeze'u** — jedyne ryzyko, które realnie podwoiło pracę, dostało najniższy priorytet i żadnego mechanizmu egzekwującego (bramka „freeze wersji" istniała tylko jako zdanie w ryzykach, nie w workflow).
2. **bt-01 skonstruowany nierozstrzygalnie-po-myśli**: skleił dwa zdarzenia (bloker fontowy = prawie pewny; „substytuty w finale" = zależne od klienta). Przy p=0.85 predykcja i tak padła na literze — lekcja o pisaniu claimów jednoznacznie.
3. **Zła klasa driftu**: Router znał tylko „drift po renderze" (failure condition single-source-compiler). Rzeczywistość = kolizja równoległa człowiek-vs-API podczas renderu, która zrywa binding assetów w locie. Genome nie ma klasy „render-time collision".
4. **Bramki ludzkie nie zaszły** (mapa fontów przed renderem — brak śladu akceptu; pilot side-by-side — brak śladu; checklist per slajd — na pewno nie, skoro 4 slajdy bez zdjęć wiszą 2 tygodnie). Router projektuje workflow z bramkami, ale Genome nie ma mechanizmu, który by bramki EGZEKWOWAŁ w sesji jednoosobowej pod presją czasu.

### 4. Największe sukcesy
1. **bt-04 niemal dosłowny**: „deck tekstowo kompletny wcześniej niż obrazowo, zdjęcia wymagają osobnego ręcznego kroku" — dokładnie stan FINAL i stan na 08.08. Warstwa mediów jako najsłabsze ogniwo pipeline'ów to potwierdzona klasa.
2. **single-source-compiler potwierdzony w najtrudniejszym teście**: pełna podmiana źródła (redesign) obsłużona re-renderem — to jest dokładnie wartość, dla której karta istnieje.
3. Selekcja mechanizmów bez fałszywych alarmów po stronie odrzuceń.

### 5. Nowe mechanizmy (hipotezy)
- **mech:render-lock (hipoteza, raczej guard)**: podczas programowego renderu do współdzielonego pliku — jawne okno renderu zakomunikowane zespołowi / praca na stronie, której nikt nie dotyka, / detekcja mutacji przed bindowaniem. Klasa: kolizja równoległa człowiek-vs-API.
- **guard: source-freeze-gate**: „freeze wersji źródła" jako twarda bramka w workflow (z datą i hashem pliku), nie zdanie w sekcji ryzyk. Wejście do każdej konwersji/migracji.

### 6. Mechanizmy do usunięcia
Brak kandydatów do usunięcia z tego backtestu. Flaga (nie usunięcie): session-to-sop — patrz sekcja 7.

### 7. Confidence Changes (PROPOZYCJE — zapisy robi sesja główna)
- **mech:single-source-compiler**: +evidence typu postmortem (re-render po pełnej podmianie źródła; dowód: memory 23.07). Proponuję podbicie confidence.
- **mech:working-artifact-extraction**: +evidence postmortem (ekstrakcja XML→JSON jako źródło prawdy). Podbicie zasadne.
- **mech:sandbox-promotion**: +evidence postmortem (dwie strony, archiwum nietknięte). Podbicie zasadne.
- **mech:design-as-code**: evidence mieszany — font-map-first potwierdzony, „weryfikacja na finale" niewykonana; BEZ podbicia, dopisać do karty, że człon weryfikacyjny wymaga egzekwującej bramki.
- **mech:session-to-sop**: evidence NEGATYWNY (rekomendowany, niewykonany, mimo że rodzina zadań się powtarza — deck Osady). Flaga **wrong-trigger**: rekomendacja bez mechanizmu egzekucji pokrywa się z base-rate i nie zmienia zachowania. BEZ zmiany confidence w górę.
- Dedupe: karta proj: powstała z importu CKO 07.08 z tych samych faktów pamięci — evidence z tego backtestu NIE sumować z ewentualną narracją skanu CKO (niezmiennik 10).

### 8. Nowe hipotezy
- render-lock i source-freeze-gate (sekcja 5).
- Hipoteza o Routerze: rekomendacje typu „drugorzędnie, jako hipoteza wartości" (session-to-sop tu) mają bliską zeru moc sprawczą — jeśli mechanizm ma zajść, musi mieć bramkę w workflow; jeśli nie ma bramki, powinien iść do base-rate, nie do rekomendacji.
- Hipoteza pomiarowa: czy „deck Osady" (druga instancja klasy PPTX→Figma) zapłaci koszt braku SOP z LEMF — rozstrzygalne przy następnym podejściu.

### 9. Czego Genome nie wiedziało w T0
- Że klient dostarczy PEŁNY redesign źródła w trakcie projektu (WER 2.0) — i że to rozpuści problem fontów (nowe fonty natywne), zamieniając bloker techniczny w koszt podwójnego renderu.
- Klasa „render-time collision": człowiek edytujący plik na żywo RÓWNOLEGLE z renderem API (nie po nim) — zrywa bindowanie assetów w najgorszym możliwym momencie.
- Że „FINAL" nie kończy projektu: produkcja assetów trwa (31 grafik 06.08), a luka zdjęć w decku wisi bez właściciela — brak w Genome pojęcia „ogon po FINAL z jawnym właścicielem".

### 10. Jak następny projekt będzie lepszy
Każda konwersja/migracja artefaktu dostaje z automatu: (a) source-freeze-gate z hashem i datą przed pełnym przebiegiem — a przy podmianie źródła jawną decyzję „re-render vs kontynuacja"; (b) render-lock / komunikat okna renderu przy pracy w pliku współdzielonym; (c) bramkę końcową „media podpięte i zweryfikowane per slajd" z jawnym właścicielem ogona — deck nie jest FINAL, dopóki checklist nie przejdzie; (d) predykcje bt:/pred: pisane tak, by jeden claim = jedno zdarzenie rozstrzygalne (lekcja bt-01).

## Evidence (do zapisania przez sesję główną)

- E1 {observation: pełna podmiana źródła (redesign 23.07) obsłużona re-renderem 21 slajdów przez pipeline elements.json→batch.js zamiast ręcznej przeróbki; proof: memory/lemf-deck-figma.md wpis FINAL 23.07.2026 (strona 70:2, batchF1-4.js); impact: potwierdzenie rdzenia karty w najtrudniejszym wariancie (podmiana całości źródła); proposed_change: +postmortem evidence, podbicie confidence; mechanisms: [single-source-compiler, working-artifact-extraction]}
- E2 {observation: ręczna edycja pliku NA ŻYWO podczas renderu API (restyle slajdu 1, usunięcie placeholderów 1/6/7/20) zerwała bindowanie zdjęć — wgrane do storage, niepodpięte do 08.08; proof: memory/lemf-deck-figma.md 23.07.2026 + karta proj:lemf-deck-figma 08.08.2026 („zdjęcia wgrane, ale niepodpięte"); impact: Genome zna tylko drift PO renderze, nie kolizję RÓWNOLEGŁĄ — luka klasy; proposed_change: failure_condition „render-time collision" w single-source-compiler + hipoteza render-lock; mechanisms: [single-source-compiler, sandbox-promotion]}
- E3 {observation: ryzyko „ruchomy cel" (nr 5, bez predykcji, freeze niewyegzekwowany) było zdarzeniem o najwyższym koszcie (dwa pełne rendery); proof: memory/lemf-deck-figma.md — źródło v1 LEMF210726 (wpis 22.07) vs nowe źródło LEMF 230726 (wpis 23.07.2026); impact: priorytetyzacja ryzyk Routera rozjechana z kosztem rzeczywistym; proposed_change: guard source-freeze-gate jako obowiązkowa bramka klasy konwersja/migracja; mechanisms: [working-artifact-extraction]}
- E4 {observation: session-to-sop rekomendowany „drugorzędnie" nie zaszedł — pipeline w scratchpadzie sesji, wnioski tylko w pamięci AI, mimo drugiej instancji klasy (deck Osady); proof: memory/lemf-deck-figma.md 23.07.2026 („batch-skrypty: scratchpad batchF1-4.js") + brak SOP w repo na 09.08.2026; impact: rekomendacja bez bramki egzekwującej = base-rate w przebraniu; proposed_change: flaga wrong-trigger na karcie; reguła Routera: mechanizm bez bramki w workflow → base-rate; mechanisms: [session-to-sop]}
- E5 {observation: człon „weryfikacja na finalnym artefakcie" (design-as-code, bramka 3) bez śladu wykonania — 4 slajdy bez zdjęć wiszą ≥2 tygodnie po FINAL; proof: karta proj:lemf-deck-figma 08.08.2026 (status archived, zdjęcia niepodpięte) + lemf-assety/ 31 PNG z 06.08; impact: bramki ludzkie w workflow jednoosobowym nie samo-egzekwują się; proposed_change: dopisek w design-as-code: weryfikacja finału wymaga jawnego właściciela i definicji DONE; mechanisms: [design-as-code]}
