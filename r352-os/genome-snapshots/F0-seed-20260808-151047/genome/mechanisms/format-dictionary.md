---
id: "mech:format-dictionary"
type: "mechanism"
title: "Format Dictionary"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-08"
version: 2
owner: "session"
confidence: {"value": "emerging", "evidence_strength": {"n": 6, "projects": 6, "types": {"measurement": 0, "postmortem": 4, "narracja": 2}, "last_confirmed": "2026-08-09"}, "recommendation": "test-first"}
category: "Brief Compression"
relations: {"implements": ["prin:extract-never-invent"], "related": ["mech:single-source-compiler", "mech:sandbox-promotion", "mech:dated-commitment-gates"]}
trigger: "Klient mówi: 'mamy dziesiątki briefów miesięcznie', 'każdy grafik robi to po swojemu', 'większość zadań to w sumie te same formaty'. Cechy problemu: wolumen ≥kilkadziesiąt zadań/mies. od wielu osób briefujących, powtarzalny miks formatów (posty, plakaty, rollupy), ręczne przenoszenie między narzędziami jako główny koszt."
context: "Organizacje wolumenowe: sieci multi-location, działy marketingu obsługujące wiele marek/lokalizacji, agencje in-house z 10+ osobami briefującymi. Wymaga istniejącego strumienia historycznych briefów do wyprowadzenia słownika i gotowości do ustandaryzowania wejścia (wizard zamiast maila)."
anti_context: "Nie stosować przy niskim wolumenie (kilka unikalnych projektów/mies. — słownik się nie zamortyzuje), przy pracy czysto koncepcyjnej/kampanijnej, gdzie każdy projekt jest naprawdę inny, ani zanim istnieje zwalidowana biblioteka masterów — automat bez masterów produkuje śmieci do poprawiania."
inputs: ["Korpus historycznych briefów (min. 1-3 miesiące) do zmierzenia rozkładu typów", "Dostęp do źródła briefów (Trello/mail/formularz) i docelowych narzędzi produkcji", "Biblioteka masterów/szablonów per rodzina formatów (lub materiały do jej zbudowania)", "Lista osób briefujących i obecny format briefu", "Brand assets i specyfikacje formatów (wymiary, kanały)"]
ai_tasks: ["Analiza korpusu i wyprowadzenie słownika typów (które rodziny pokrywają 80% wolumenu)", "Klasyfikacja przychodzących briefów (create/feedback/skip/remove) w trybie ciągłym", "Generacja wstępnych kreacji z masterów dla rodzin szablonowych", "Przyrostowy sync między źródłem a produkcją z izolacją stanu per tablica/marka", "Aktualizacja słownika na podstawie decyzji walidatora (pętla uczenia)"]
human_tasks: ["Przemek-decyzja: zatwierdzenie słownika i jawnej granicy automatu (co dostaje tylko klasyfikację)", "Przemek/podwykonawca: walidacja sklasyfikowanych rekordów i wygenerowanych kreacji", "Klient: przejście na ustrukturyzowane briefowanie (wizard) i akceptacja masterów"]
expected_outcome: "Zmierzony % briefów klasyfikujących się do skończonych rodzin (cel: mała liczba rodzin pokrywa ~80% wolumenu) i spadek czasu obsługi briefu — człowiek przestaje czytać briefy, a walidacja zastępuje produkcję od zera. Lead time per brief mierzalny i malejący."
evidence: [{"id": "ev:format-dictionary-001", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/briefsync", "note": "briefsync (retro-postmortem bt#001): klasyfikator create/feedback/skip/helper/remove produkcyjnie na 8 tablicach pod launchd. UWAGA TOO-BROAD: briefsync używał WYŁĄCZNIE trybu triage strumienia — słownik FORMATÓW z masterami to osobny byt (zdrofit-hourly); karta zlepia dwa mechanizmy, kandydat do podziału (hipoteza mech:stream-triage)."}, {"id": "ev:format-dictionary-002", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "zdrofit-hourly-pipeline — słownik formatów + rodziny szablonowe (wydarzenia FB, plakat stoiska, rollup, potykacz B1, KV belkowe, LP przedsprzedaży) z masterami w 'BS Fitness — Biblioteka Produkcyjna v1'; jawne zawężenie "}, {"id": "ev:format-dictionary-003", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "narzedzie-do-briefowania — kompresja od strony wejścia: wizard wymusza strukturę briefu u źródła, statusy i audit log domykają obieg."}, {"id": "ev:format-dictionary-bt-r3loop-app", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/r3loop-app", "note": "(bt#T1) Wizard = structured intake (engagement_type routing, section matrix, typed budget), nie słownik formatów z masterami — druga niezależna instancja złej granicy karty | Zmiana: Podział karty (structured-intake / stream-triage / słownik formatów); flaga too-broad #2, bez podbicia"}, {"id": "ev:format-dictionary-bt-geers-centrum-wiedzy", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/geers-centrum-wiedzy", "note": "(bt#T2) Router odrzucił format-dictionary ('wolumen się nie zamortyzuje'), a projekt zbudował dokładnie słownik formatów po stronie klienta: biblioteka promptów z composable Skills Builder 1350 kombinacji + 12 szablonów per kanał | Zmiana: Przepisać trigger na 'istnieje strona generująca wolumen komunikatów (klient LUB r352)' + flaga wrong-trigger; bez zmiany confidence"}, {"id": "ev:format-dictionary-bt-zdrofit-cwicz-w-zieleni", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/zdrofit-cwicz-w-zieleni", "note": "(bt#T2) SLOWNIK_FORMATOW.md (istniejący od 04.07) nie zasilony rodziną 'event FB → komplet 10 formatów'; reguły per format tylko jako podpisy ramek Figma i proza w memory | Zmiana: Podtrzymać flagę too-broad, rozważyć podział karty (triage vs słownik szablonów vs słownik reguł)"}]
tags: []
---

## Problem

Przy wolumenie ~100 briefów/mies. od 12–15 osób briefujących każdy brief jest traktowany jak unikalny projekt: ręczne przenoszenie między narzędziami i odtwarzanie layoutów od zera to główny pożeracz czasu produkcji, a wiedza 'co to za typ zadania' żyje tylko w głowie wykonawcy.

## Mechanizm działania

Strumień briefów jest kompresowany przez słownik: brief = rekord danych, klasyfikator mapuje go na skończony słownik typów (marka/typ/formaty; create/feedback/skip/remove), a rodziny szablonowe mają przygotowane mastery, z których automat generuje wstępne kreacje. Kompresja działa, bo w wolumenowej produkcji rozkład typów jest gruboogonowy — mała liczba rodzin pokrywa większość wolumenu; wszystko spoza słownika świadomie dostaje TYLKO klasyfikację, nie obietnicę automatu. Człowiek przestaje czytać briefy, a zaczyna walidować sklasyfikowane rekordy. Od strony wejścia ta sama kompresja: wizard wymusza strukturę briefu u źródła (brief rodzi się jako rekord, nie mail).

## Warunki sukcesu

- Słownik jest wyprowadzony z realnego korpusu briefów (rozkład typów zmierzony, nie założony)
- Kolejność wdrożenia: najpierw zwalidowana biblioteka masterów, dopiero potem pętla — 'inaczej automat produkuje śmieci do poprawiania'
- Granica słownika jest jawna: nietypowe zadania dostają klasyfikację + ramkę, nigdy udawaną automatyzację

## Warunki porażki

- Klasyfikator bez pętli uczenia — słownik zamrożony w dniu startu dryfuje od realnego strumienia
- Zgromadzone dane nieobrócone w wartość — 39 briefów i metryki lead time z briefsync nie zasilają ani korpusu testowego alignment score, ani raportu sprzedającego automatyzację klientowi
- Multi-source bez izolacji stanu — tablice nawzajem oznaczały sobie briefy jako done, dopóki nie wprowadzono BOARD_TAG

## Potencjał automatyzacji

Bardzo wysoki — klasyfikacja już działa autonomicznie (Python+launchd), generacja z masterów zaprojektowana. Otwarte: przejście gałęzi Figma na REST API oraz pętla uczenia słownika z decyzji walidatora. Docelowo człowiek zostaje tylko w walidacji (sprzężenie z Sandbox Promotion).

## Transfer

Przenośny na każdego klienta wolumenowego z powtarzalnym miksem formatów — briefsync już obsługuje 8 tablic różnych klientów tym samym kodem z deklaratywnym boards.json. Rdzeń wartości produktu 'Narzędzie do briefowania' (pilot 20 lokalizacji, pricing 50–100k PLN); test transferu słownika FORMATÓW na drugą markę to naturalny następny krok.

## Eksperyment · Sonova/Geers

Test transferu słownika na drugiego klienta wolumenowego: wziąć historyczne karty z tablicy Geers/Sonova w briefsync (dane już zebrane), zbudować z nich słownik formatów metodą ze Zdrofitu i zmierzyć: (a) jaki % briefów Geers klasyfikuje się do skończonych rodzin szablonowych, (b) ile rodzin pokrywa 80% wolumenu, (c) które rodziny pokrywają się ze słownikiem Zdrofit (część wspólna = kandydat na słownik bazowy produktu).

**Czego się dowiemy:** Dowiemy się, czy kompresja przez słownik jest własnością KLIENTA (Zdrofit ma nietypowo szablonowy miks) czy MECHANIZMU (rozkład gruboogonowy powtarza się u drugiego klienta wolumenowego). Jeśli drugie — mamy zmierzony argument, że Narzędzie do briefowania z rodzinami szablonowymi jest produktem multi-klienckim, i wiemy, jaki % słownika jest uniwersalny vs per-brand, zanim zbudujemy multi-tenant.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
