---
id: "mech:agent-as-runtime"
type: "mechanism"
title: "Agent-as-Runtime"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-08"
version: 2
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":6,"projects":3,"types":{"measurement":0,"postmortem":2,"narracja":4},"last_confirmed":"2026-08-08"},"recommendation":"use-with-care"}
category: "AI Collaboration"
relations: {"implements": ["prin:trust-through-boundaries"], "related": ["mech:session-to-sop", "mech:deterministic-spine", "mech:incident-to-guard", "mech:negative-knowledge-ledger"]}
trigger: "Klient mówi: 'tego systemu nie da się zautomatyzować, nie ma API', 'wszystko robimy ręcznie w panelu', albo brief opisuje pipeline, który urywa się na ostatniej mili (publikacja w CMS bez API, legacy panel, system rezerwacyjny, narzędzie SaaS bez integracji). Sygnał w rozmowie: 'ktoś u nas musi to codziennie wyklikać'."
context: "Organizacje z powtarzalnym procesem wolumenowym opartym o narzędzia bez API lub z niepełnym API (legacy CMS-y, panele sieci fitness, systemy rezerwacyjne, platformy typu Medium/Figma). Najlepiej tam, gdzie deterministyczna część procesu już działa lub da się zbudować, a agent domyka tylko ostatnią milę."
anti_context: "Nie stosować, gdy istnieje oficjalne API pokrywające cały proces (wtedy klasyczna automatyzacja jest tańsza i trwalsza), gdy klient oczekuje bezobsługowej automatyzacji 24/7 bez okna żywej sesji, albo gdy proces jest krytyczny czasowo i nie toleruje niedeterministycznych błędów timingu. Nie sprzedawać jako 'automatyzacji' tego, co jest usługą asystowaną."
inputs: ["Mapa procesu klienta z zaznaczeniem, gdzie kończy się API a zaczyna klikanie ręczne", "Dostęp do zalogowanej sesji / środowiska (przeglądarka, desktop z otwartym narzędziem)", "Lista operacji do wykonania i ich oczekiwane rezultaty (do weryfikacji po każdej operacji)", "Informacja o trwałości autoryzacji (refresh tokeny vs tokeny krótkożyciowe)", "Zgoda klienta na operowanie w jego panelach"]
ai_tasks: ["Rozpoznanie i sterowanie DOM/panelami (contenteditable, formularze, wewnętrzne API z zalogowanej sesji)", "Wykonanie operacji wsadowych (import rekordów, czystka treści, tagowanie, budowa elementów w narzędziu)", "Weryfikacja po każdej operacji (reload, sprawdzenie stanu DOM/danych) — dobudowanie brakujących kodów błędów", "Utrwalenie procedury jako SOP/runbook z gotchas (timing, pułapki UI)", "Wytyczenie granicy: co przenieść na oficjalne API/cron, a co zostaje agentowe"]
human_tasks: ["Przemek-decyzja: akceptacja granicy automatyzacja vs usługa asystowana i tego, co wolno robić w panelach klienta", "Klient: dostarczenie dostępów i zalogowanych sesji", "Przemek lub klient: finalny klik nieodwracalny (Publish, wysyłka) po weryfikacji agenta"]
expected_outcome: "Proces bez API wykonywany end-to-end w sesji z człowiekiem tylko przy finalnym kliku; procedura utrwalona jako SOP odtwarzalny w kolejnych sesjach bez ponownego odkrywania timingu (np. pełny cykl publikacji/importu wykonany w <30 min zamiast godzin ręcznej pracy, z zerem błędów po weryfikacji)."
evidence: [{"id":"ev:agent-as-runtime-001","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"medium-publishing-pipeline — cały import+czystka 145 em-dashy+tagowanie+cover wykonywane przez agenta w DOM; człowiek klika tylko Publish."},{"id":"ev:agent-as-runtime-002","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"osada-orle-deck-morisson — odczyt i inwentaryzacja 46 komentarzy klienta przez wewnętrzne API Figmy z zalogowanej sesji (obejście braku czytnika komentarzy w MCP), potem programowa budowa 11 slajdów draft."},{"id":"ev:agent-as-runtime-003","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"briefsync — agent-dyspozytor PRZENIEŚ: pobiera załączniki z Trello, buduje karty w Figmie przez use_figma (działa tylko z żywym desktopem — cloud świadomie odrzucony)."},{"id":"ev:agent-as-runtime-004","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"penya-saas — import 165 rekordów przez REST anon + PATCH z admin JWT, gdy SQL editor nie działał; sterowanie Chrome Reszka do paneli Supabase."},{"id":"ev:agent-as-runtime-bt-zdrofit-hourly-pipeline","type":"postmortem","date":"2026-08-09","source":"rec:backtests/zdrofit-hourly-pipeline","note":"(bt#T1) Diagnoza Routera (hourly strukturalnie sprzeczny z żywą sesją desktop use_figma) okazała się decydująca dla losu projektu; niezależna diagnoza CKO wskazała ten sam fix (Figma REST z PAT) | Zmiana: Dodać failure-condition: 'wymóg bezobsługowy/hourly + desktop-only API = nierealizowalne bez migracji na REST'; kandydat na evidence typu postmortem (+confidence, decyzja sesji głównej)"},{"id":"ev:agent-as-runtime-fotra-panel","type":"postmortem","date":"2026-08-08","source":"rec:backtests/fotra-panel","note":"Nośną architekturą narzędzia wewnętrznego okazał się wzorzec 'sesja/agent generuje plik danych window.*, statyczny front tylko czyta' — Router zna kartę wyłącznie od strony ryzyka. | Zmiana: Dopisać do karty wariant pozytywny (file-injection: pole generated + empty-state + badge staleness) albo wydzielić mech:session-injected-data-file; +1 evidence typu postmortem (pozytywne) oraz warunek 'OAuth interaktywny nie przechodzi przez runtime bezobsługowy'. [dowód: trello-sync.js nagłówek 'Generated: 2026-08-01'; js/fotra-kg-data.js 'generated': '2026-08-07'; js/fotra-mail-signals.js (scaffold 07.08); task ~/.claude/scheduled-tasks/r352-cko-daily; audyt 07.08.2026: 'Wzorzec zwycięski: file-injection przez sesje Claude (window.*)… to jest kręgosłup ultratoola']"}]
tags: []
---

## Problem

Krytyczne systemy nie mają API tam, gdzie kończy się pipeline: Medium nie ma API publikacji, oficjalny MCP Figmy nie czyta komentarzy, use_figma pisze tylko do aktywnego pliku desktop, SQL editor Supabase leżał w kluczowym momencie. Klasyczna automatyzacja urywa się na ostatniej mili.

## Mechanizm działania

Agent AI w żywej sesji staje się brakującym runtime'em API: steruje DOM (TreeWalker+InputEvent w contenteditable Medium), woła wewnętrzne API z zalogowanej sesji Chrome (fetch komentarzy Figmy), operuje panelami przez przeglądarkę użytkownika (import 165 rekordów do Supabase przez REST+admin JWT). Działa, bo agent ma to, czego nie ma skrypt: kontekst zalogowanej sesji, adaptację do zmiennego UI i tolerancję na timing. Dojrzała wersja (briefsync) świadomie dzieli: Python+launchd tam, gdzie jest API; agent WYŁĄCZNIE na ostatnią milę. To trzecia noga modelu 'AI = mózg, podwykonawcy = ręce'.

## Warunki sukcesu

- Procedura utrwalona jako SOP w pamięci (5 kroków Medium, gotchas submit-URL Figmy) — inaczej każda sesja odkrywa timing i pułapki od nowa
- Weryfikacja po każdej operacji (reload i sprawdzenie DOM po czystce) — runtime bez API nie zwraca kodów błędów, więc weryfikację trzeba dobudować samemu
- Świadoma granica: deterministyczna część pipeline'u poza sesją (launchd/cron), agent tylko tam, gdzie API naprawdę nie ma

## Warunki porażki

- Pipeline żyje wyłącznie w oknie żywej sesji — kadencja Medium i reformaty Zdrofit zależą od pamięci Przemka, bo nie są odpalanym narzędziem
- Tokeny krótkożyciowe zabijają gałęzie: Dropbox→Trello martwe od czerwca (token 4h zamiast refresh tokena) — runtime agentowy maskował brak trwałej autoryzacji
- Syntetyczne kliki i za krótkie czekanie na dropdown = niedeterministyczne błędy; timing jest częścią niezawodności i łatwo go zgubić
- use_figma pisze do AKTYWNEGO pliku desktop, nie do fileKey — realny bug budowania na wczorajszej stronie Figmy

## Potencjał automatyzacji

Średni z natury: sedno mechanizmu to obsługa tego, czego NIE da się w pełni zautomatyzować. Realny kierunek: (1) migracja deterministycznych odcinków na oficjalne API (Figma REST z PAT dla briefsync — nazwana, niewykonana szansa), (2) pakowanie procedur agentowych w skille/runbooki odpalane komendą zamiast rekonstruowane z pamięci.

## Transfer

Wysoki jako kompetencja sprzedażowa: 'zautomatyzujemy także to, co nie ma API' to oferta, której klasyczne software house'y nie składają. Przenośne na każdego klienta z legacy panelami (CMS-y, systemy rezerwacyjne, panele sieci fitness).

## Eksperyment · Benefit/Zdrofit

Rozciąć pipeline briefsync Trello→Figma na dwie warstwy i zmierzyć granicę: przenieść wszystko, co się da, na Figma REST API z PAT (tworzenie plików/stron, upload obrazów), zostawiając agenta wyłącznie dla operacji niedostępnych w REST. Przez 2 tygodnie logować: ile operacji/tydzień wykonała warstwa bez sesji vs agentowa, ile transferów przepadło, bo sesja nie żyła, czas odtworzenia po uśpieniu.

**Czego się dowiemy:** Dowiemy się, jaki procent 'trzeciej nogi' jest nią naprawdę, a jaki jest tylko długiem migracyjnym — czyli czy hourly pipeline Zdrofit może działać bezobsługowo, czy strukturalnie wymaga okna żywej sesji. To określa, czy mechanizm wolno sprzedawać jako 'automatyzację', czy jako 'usługę asystowaną'.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
