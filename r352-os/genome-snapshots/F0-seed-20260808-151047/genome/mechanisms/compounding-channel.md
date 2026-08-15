---
id: "mech:compounding-channel"
type: "mechanism"
title: "Compounding Channel"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-08"
version: 2
owner: "session"
confidence: {"value": "emerging", "evidence_strength": {"n": 5, "projects": 5, "types": {"measurement": 0, "postmortem": 1, "narracja": 4}, "last_confirmed": "2026-08-09"}, "recommendation": "test-first"}
category: "Knowledge Compounding"
relations: {"implements": ["prin:pay-for-every-lesson-once"], "related": ["mech:session-to-sop", "mech:working-artifact-extraction", "mech:single-source-compiler", "mech:negative-knowledge-ledger"]}
trigger: "Sygnały wewnętrzne lub u klienta: 'przecież to już kiedyś robiliśmy', 'gdzie jest ten szablon z tamtej kampanii?', te same wzorce przepisywane od zera w kolejnych projektach, wiedza i assety żyjące na dyskach/w skrzynkach pojedynczych osób. Brief typu: 'chcemy przestać wymyślać koło na nowo przy każdej kampanii'."
context: "Organizacje prowadzące wiele podobnych projektów sekwencyjnie (agencje, działy marketingu z powtarzalnymi kampaniami, firmy budujące rodzinę narzędzi). Działa, gdy wzorzec wystąpił już ≥3 razy i istnieje kanał, którym zespół naturalnie zaczyna pracę (repo, biblioteka, pamięć systemowa)."
anti_context: "Nie stosować przy pierwszym lub drugim wystąpieniu wzorca (przedwczesna generalizacja = utrzymanie frameworku bez użytkowników), ani w organizacjach bez żadnego naturalnego kanału startu pracy — sam komponent bez kanału dystrybucji nie skompounduje. Nie budować rejestru dla zespołu, który go nie otworzy."
inputs: ["Inwentarz powtórzonych wzorców (co przepisywano ≥3 razy i gdzie leżą kopie)", "Jedno kanoniczne miejsce na komponenty (repo/biblioteka) lub decyzja o jego utworzeniu", "Mechanizm ładowania kontekstu do przyszłej pracy (auto-memory, onboarding doc, szablon startowy)", "Definition-of-done projektów do rozszerzenia o krok ekstrakcji"]
ai_tasks: ["Skan projektów/scratchpadów pod kątem komponentów-kandydatów do ekstrakcji", "Ekstrakcja komponentu z minimalnym interfejsem i README", "Utrzymanie rejestru komponentów i wpisów pamięci wskazujących ścieżki", "Pomiar reuse-rate (ile projektów użyło komponentu vs przepisało od zera)"]
human_tasks: ["Przemek-decyzja: co jest kanonicznym komponentem i kiedy wzorzec dojrzał do ekstrakcji", "Przemek/podwykonawca: przegląd interfejsu komponentu (czy koszt użycia < koszt przepisania)", "Klient (w wariancie doradczym): wskazanie kanału, którym zespół realnie zaczyna pracę"]
expected_outcome: "Test binarny: następny projekt z rodziny wzorców sam znajduje i używa komponentu zamiast przepisywać od zera; czas do pierwszego działającego buildu spada wielokrotnie vs mediana historycznych przepisań. Rosnący reuse-rate w kolejnych projektach."
evidence: [{"id": "ev:compounding-channel-001", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "lemf-deck-figma — renderery pipeline'u PPTX→Figma (2 pełne udane przebiegi) zostały w scratchpadzie sesji; kolejny deck będzie wymagał odbudowy narzędzia mimo zapisanej wiedzy JAK."}, {"id": "ev:compounding-channel-002", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "dailyfruits + dimedical + kubota + teambudget + umowy + stocki — rodzina mini-generatorów statycznych przepisana ~7 razy od zera (build.js/build.py); wzorzec zidentyfikowany w DNA jako 'kandydat nr 1 na jeden kanoniczny "}, {"id": "ev:compounding-channel-003", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "r3loop-app + narzedzie-do-briefowania — dwa osobne silniki oceny briefów, które się nie widzą, plus 39 realnych briefów z briefsync jako nieużyty korpus testowy — brak kanału powoduje, że nawet DANE nie kompoundują."}, {"id": "ev:compounding-channel-004", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "kontrprzykład: beesknees-site — CMS skompoundował, bo miał kanał; port na drugą markę zajął ułamek kosztu budowy."}, {"id": "ev:compounding-channel-bt-betterguide-hub", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/betterguide-hub", "note": "(bt#T2) Hub zbudowany ręcznie bez żadnego silnika i bez reużycia komponentu; bramka hasłowa = kolejna (≥4.) niezależna implementacja client-side (hash JS -1422286391, sessionStorage); jednocześnie połowa 'kanał' karty zadziałała — hub zasilany nowymi deliverables kwie | Zmiana: Podział karty: channel-discipline vs canonical-component-reuse; flaga too-broad, bez podbicia confidence"}]
tags: []
---

## Problem

Mimo zasady 'Every Project Compounds' kod nie kompounduje: ten sam wzorzec (mini-SSG ~7 razy, bramka hasłowa 4 razy, dwa silniki oceny briefów, które się nie widzą) jest przepisywany od zera, a działające pipeline'y (renderery LEMF, pipeline Wayback, harness testowy CMS) giną w scratchpadach sesji — kolejna sesja 'wie JAK, ale musi zbudować CZYM'.

## Mechanizm działania

Diagnoza-mechanizm z jasną receptą: kompounduje wyłącznie to, co ma AUTOMATYCZNY kanał dystrybucji do przyszłej pracy. Wiedza tekstowa kompounduje, bo auto-memory ładuje się do każdej sesji; kod nie kompounduje, bo nie ma analogicznego kanału. Compounding podąża za kanałem dystrybucji, nie za wartością artefaktu — chcesz, żeby kod kompoundował, daj mu kanał o sile auto-memory: jedno kanoniczne repo komponentów + wpis pamięci wskazujący ścieżkę + ekstrakcja jako element definition-of-done. Kontrprzykład potwierdzający regułę: CMS bees-knees skompoundował, bo miał kanał (kanoniczne repo DailyFruits + wpis pamięci) — port zajął ułamek kosztu budowy.

## Warunki sukcesu

- Istnieje jedno kanoniczne miejsce komponentów (repo) + wpis w auto-memory wskazujący ścieżkę — kod dostaje kanał dystrybucji o sile pamięci
- Ekstrakcja do repo jest częścią definition-of-done projektu, nie osobnym zadaniem 'kiedyś'
- Komponent ma minimalny interfejs i README — koszt użycia niższy niż koszt przepisania

## Warunki porażki

- Scratchpad sesji jako domyślne miejsce pracy — wszystko w nim ginie z końcem sesji (realne straty: renderery LEMF, pipeline Wayback, harness CMS)
- Komponent wyjęty, ale bez wpisu pamięci — kolejna sesja go nie znajdzie, bo szuka tylko tam, gdzie ładuje się kontekst
- Zbyt wczesna generalizacja: kanoniczny komponent budowany zanim wzorzec wystąpił ≥3 razy zamienia się w utrzymanie frameworku bez użytkowników

## Potencjał automatyzacji

Wysoki: skaner końca sesji wykrywający skrypty-kandydatów w scratchpadzie ('ten plik działał ≥1 raz i pasuje do znanej rodziny wzorców — wyekstrahować?'); rejestr komponentów jako plik pamięci generowany z repo; miernik reuse-rate (ile projektów użyło komponentu vs przepisało).

## Transfer

Wysoki, z twistem: dla klientów to lekcja o asset management w marketingu (szablony kampanii giną w skrzynkach i na dyskach osób — kompounduje tylko to, co jest w kanale, którym zespół naturalnie zaczyna pracę). Dla samego r352 to warunek skalowalności frameworku Brand Hub.

## Eksperyment · BetterWorkplace/DailyFruits

Wyekstrahować jeden kanoniczny mini-SSG (najczęściej przepisywany wzorzec: źródło danych → wiele widoków HTML) do repo r352-framework + wpis w auto-memory ze ścieżką i minimalnym README. Następny projekt generatywny w ekosystemie BW (np. kolejne narzędzie sprzedażowe typu katalog/kalkulator) prowadzić bez podpowiedzi wprost — test binarny: czy sesja sama znalazła i użyła komponentu, czy przepisała od zera; dodatkowo czas do pierwszego działającego buildu vs mediana z 7 historycznych przepisań.

**Czego się dowiemy:** Dowiemy się, czy wpis pamięci + kanoniczne repo wystarczą jako kanał dystrybucji kodu (czy compounding wykonywalny da się uruchomić tym samym mechanizmem, który napędza compounding tekstowy) oraz jaki jest realny mnożnik czasowy — to rozstrzyga, czy budować rejestr komponentów jako organ systemu na równi z auto-memory.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
