---
id: "mech:machine-narrows-human-picks"
type: "mechanism"
title: "Machine Narrows, Human Picks"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-08"
version: 2
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":7,"projects":3,"types":{"measurement":0,"postmortem":2,"narracja":5},"last_confirmed":"2026-08-08"},"recommendation":"use-with-care"}
category: "Human-AI Decision Systems"
relations: {"implements": ["prin:reduce-subjectivity"], "related": ["mech:numeric-gates", "mech:deterministic-spine", "mech:sandbox-promotion", "mech:incident-to-guard"]}
trigger: "Klient mówi 'nie mamy kiedy tego wszystkiego przejrzeć', 'decyzja wisi od tygodni, bo kandydatów są setki' albo 'nie oddamy wyboru maszynie, to kwestia gustu'. Sygnał: decyzja wyboru o dużym wolumenie (setki zdjęć, ~100 briefów/mies., dziesiątki leadów), gdzie 90% to oczywisty odsiew, a finał wymaga kontekstu."
context: "Każda organizacja z wolumenowym strumieniem obiektów do selekcji/klasyfikacji i jednym decydentem o ograniczonej przepustowości — domena obojętna (zdjęcia, briefy, leady, benchmarki). Idealne jako pierwszy tani dowód wartości automatyzacji: nie zastępuje decydentów, kompresuje ich czas."
anti_context: "Nie stosować, gdy kryteria zawężania nie są uzgodnione z decydentem — praca roju idzie do kosza (case galerii IK). Szkodzi przy wyszukiwaniu semantycznym bez twardego progu — system podstawia przekonujące śmieci zamiast pustki. Nie opłaca się przy małych wolumenach, gdzie człowiek i tak widzi wszystko na raz."
inputs: ["Strumień/korpus obiektów do zawężenia (karty, zdjęcia, leady) z dostępem programowym", "Kryteria odsiwu uzgodnione z decydentem (listy słów, progi, reguły licencyjne/biznesowe)", "Definicja artefaktu decyzyjnego pod JEDNĄ decyzję (galeria, posortowany inbox, scoreboard)", "Słownik/taksonomia klas (np. SLOWNIK_FORMATOW.md)", "Kanał zbierania decyzji człowieka (do przyszłej pętli uczenia)"]
ai_tasks: ["Harvest równoległym rojem tanich agentów z wielu źródeł", "Deterministyczny scoring/klasyfikacja z confidence i uzasadnieniem per obiekt", "Odsiew oczywistych odrzutów PRZED pokazaniem człowiekowi (twarde reguły, progi)", "Budowa jednoekranowego, porównawczego widoku decyzyjnego", "Kierowanie przypadków nietypowych/niskiego confidence do ręcznej ścieżki"]
human_tasks: ["Przemek-decyzja lub klient-decydent: finalny wybór z zawężonej listy (celowo ręczny)", "Klient: uzgodnienie i akcept kryteriów zawężania przed startem", "Przemek-decyzja: korekta reguł klasyfikatora na podstawie odrzuceń (pętla uczenia)"]
expected_outcome: "Czas ludzkiej decyzji spada ~10× (decyzja w jednym posiedzeniu zamiast tygodni), przy zachowanej kontroli: człowiek widzi 100% przestrzeni w formie porównywalnej, a zgodność maszynowej klasyfikacji z decyzją człowieka jest mierzona (% accuracy na realnym strumieniu)."
evidence: [{"id":"ev:machine-narrows-human-picks-001","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"stocki-miasta — harvest_free.py z 4 źródeł → dane.json (428 KB) → final_pick.py (reguły licencyjne + listy TRESC_DOBRA/SLABA) → finalna-lista.html: 1 ujęcie per miasto do zatwierdzenia zamiast ręcznego przeglądania setek"},{"id":"ev:machine-narrows-human-picks-002","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"briefsync — klasyfikator create/feedback/skip/remove na ~100 kartach/mies. z 8 tablic; człowiek widzi tylko gotowe karty-briefy w Figmie i notatkę dnia z priorytetyzacją, nie surowe Trello."},{"id":"ev:machine-narrows-human-picks-003","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"beesknees-site — 10 agentów sklasyfikowało 109 zdjęć galerii (pinsy/opakowania/breloki/patyna) z confidence i uzasadnieniem; człowiek tylko zatwierdzał kategorie w panelu."},{"id":"ev:machine-narrows-human-picks-004","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"r3loop-app — triage zimnych leadów po MACS: NO-GO→odmowa w 24h, HOLD→Diagnostic €2k; Reszek decyduje tylko o przypadkach GO."},{"id":"ev:machine-narrows-human-picks-005","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"human-commons — 4 agenty researchu skompresowały plan 90 dni do kilku decyzji GO/STOP; artoffnia-demo — audyt 5 person z punktacją ścieżek; fitstyle-platform — 3 agenty benchmarku globalnego przed decyzjami o silniku LP."},{"id":"ev:machine-narrows-human-picks-bt-osada-orle-deck-morisson","type":"postmortem","date":"2026-08-09","source":"rec:backtests/osada-orle-deck-morisson","note":"(bt#T2) Mechanizm wykonany połówkowo: zawężenie maszynowe pełne (6 strumieni WS1–WS6, duplikaty C18=C37/C19=C38, ekstrakcja pełnych treści komentarzy), ale akt ludzkiego rozstrzygnięcia (dyspozycje per komentarz, bramka 2 Routera) bez żadnego śladu | Zmiana: failure_condition w karcie: 'zawężenie bez zaplanowanego aktu rozstrzygnięcia = mechanizm niedokończony'; bez zmiany confidence"},{"id":"ev:machine-narrows-human-picks-fotra-panel","type":"postmortem","date":"2026-08-08","source":"rec:backtests/fotra-panel","note":"W erze AI-dev koszt budowy przestał hamować zakres, więc limity muszą liczyć koszt uwagi użytkownika, nie koszt wytworzenia. | Zmiana: Nowa karta mech:attention-budget-gate (twardy limit powierzchni, nowy element wypycha stary, koszt w sekundach uwagi dziennie). [dowód: Audyt 07.08.2026, sekcja 'Meta-ochrona działa': 'koszt godzinowy zniknął, więc stary argument 900 PLN/h opportunity cost przestał hamować feature creep'; 12 zakładek, ~2,4 MB parsowane przy każdym otwarciu, 3 225 linii modułu Delegation na pustym zbiorze danych]"}]
tags: []
---

## Problem

Decyzje wyboru o dużym wolumenie (zdjęcie z 400 kandydatów, klasyfikacja ~100 kart briefów/mies., 109 zdjęć galerii, triage leadów, dziesiątki benchmarków) blokują się na ludzkiej przepustowości: 90% pracy to odsiew oczywistych odrzutów, a pełna automatyzacja wyboru jest nieakceptowalna, bo ostatnie 10% wymaga gustu i kontekstu — więc decyzja albo nie zapada, albo zapada losowo.

## Mechanizm działania

Podział decyzji na dwie fazy o różnej naturze: rój tanich, równoległych agentów + deterministyczny scoring (twarde reguły licencyjne, słowa-klucze, confidence, jawne wagi) wykonuje harvest i klasyfikację i zawęża przestrzeń z setek do kilku-kilkunastu kandydatów, a człowiek dostaje skompresowany, porównywalny, jednoekranowy artefakt decyzyjny (statyczna galeria HTML, posortowany inbox, karty w Figmie, scoreboard) i podejmuje wyłącznie finalny wybór. Koszt ludzkiej decyzji spada ~10× bez utraty kontroli, maszynowy odsiew jest audytowalny (confidence + uzasadnienie per obiekt), a człowiek widzi 100% przestrzeni w formie porównywalnej zamiast próbki. Kluczowy element to artefakt pośredni zbudowany pod JEDNĄ decyzję, nie sam rój.

## Warunki sukcesu

- Reguły odsiwu są jawne i audytowalne (listy słów, progi, reguły licencyjne w kodzie), klasyfikacja niesie confidence/uzasadnienie per obiekt — inaczej człowiek i tak musi wszystko sprawdzić
- Warstwa deterministycznego odsiewu działa PRZED pokazaniem człowiekowi — rój bez filtra przenosi śmieci dalej
- Widok decyzyjny jest porównawczy i jednoekranowy (galeria, posortowany inbox) — decyzja możliwa w jednym posiedzeniu
- Wyszukiwarki semantyczne filtrowane twardą regułą (nazwa w tytule) — bez tego podstawiają 'podobne' zamiast pustki; kryteria zawężania uzgodnione z decydentem

## Warunki porażki

- Brak pętli uczenia: decyzje walidacyjne Reszka nigdzie nie wracają do klasyfikatora (jawnie w missed_opportunities zdrofit-hourly) — maszyna zawęża tak samo źle za każdym razem
- Pipeline ginie w scratchpadzie zamiast stać się narzędziem — stocki-miasta trzeba będzie adaptować ręcznie przy następnym zadaniu
- Zawężenie bez progu jakości podstawia przekonujące śmieci zamiast pustki — Adobe Stock zwracał INNE miasta
- Kuratorska propozycja roju odrzucona przez klienta (galeria modułowa IK) — jeśli kryteria nie są uzgodnione z decydentem, praca idzie do kosza

## Potencjał automatyzacji

Faza 'narrow' w pełni automatyzowalna i już działa bezobsługowo (briefsync przez launchd 8:00). Największa dźwignia: dopisanie pętli uczenia (decyzje człowieka → korekta reguł/przykładów klasyfikatora) oraz spakowanie wzorca harvest→score→gallery jako jednego kanonicznego 'triage-tool' zamiast przepisywania per projekt. Decyzja człowieka celowo pozostaje ręczna.

## Transfer

Bardzo wysoki — mechanizm agnostyczny wobec domeny (zdjęcia, briefy, benchmarki, persony, leady). Dla klientów wolumenowych (Benefit ~100 briefów/mies.) bezpośrednio sprzedawalny jako pierwszy tani dowód wartości: automat nie zastępuje ich decydentów, tylko kompresuje czas decyzji (triage briefów, audyt asset library, selekcja UGC, shortlisty).

## Eksperyment · Benefit/Zdrofit

Wziąć 1 miesiąc realnych briefów z tablicy 'Przemek NOWY' (korpus briefsync), puścić rój 8–10 agentów klasyfikujących każdy brief do rodziny formatów wg SLOWNIK_FORMATOW.md z confidence i uzasadnieniem, wygenerować galerię triage i dać Reszkowi/Natalii do walidacji. Zmierzyć: (a) zgodność klasyfikacji roju z decyzją człowieka (%), (b) czas walidacji miesiąca briefów przez galerię vs dotychczasowy przegląd Trello, (c) odsetek briefów 'nietypowych' odsianych do ręcznej ścieżki, (d) czas decyzji człowieka per karta.

**Czego się dowiemy:** Trzy liczby, których dziś nie ma: accuracy klasyfikatora na realnym strumieniu, realny poziom automatyzowalności wolumenu Zdrofit i czas decyzji per karta — razem policzalny business case automatyzacji do sprzedania klientowi 49% przychodu oraz brakująca bramka wejściowa hourly pipeline.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
