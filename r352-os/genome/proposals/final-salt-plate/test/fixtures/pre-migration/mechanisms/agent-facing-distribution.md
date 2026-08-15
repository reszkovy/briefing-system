---
id: "mech:agent-facing-distribution"
type: "mechanism"
title: "Agent-Facing Distribution"
status: "hypothesis"
created: "2026-08-07"
updated: "2026-08-09"
version: 4
owner: "session"
confidence: {"value":"hypothesis","evidence_strength":{"n":3,"projects":1,"independent_sources":2,"types":{"narrative":2,"backtest":1},"last_confirmed":"2026-08-08"},"recommendation":"test-first"}
category: "Distribution"
relations: {"implements":["prin:design-for-machine-readers"],"related":["mech:single-source-compiler","mech:open-tool-exchange","mech:split-url-architecture","mech:dated-commitment-gates"]}
trigger: "Klient pyta: 'jak nas znajdzie ChatGPT/AI?', 'czemu asystenci AI polecają konkurencję?', albo brief dotyczy widoczności przy rosnącym udziale odkrywania ofert przez agentów AI. Sygnał: klient ma katalog oferty/produktów w danych strukturalnych (lub da się go wygenerować) i zatłoczone klasyczne kanały (SEO, ads) z rosnącym CAC."
context: "Marki z ustrukturyzowanym katalogiem oferty (produkty, usługi, cennik) i istniejącym buildem generującym stronę z jednego źródła danych — wtedy llms.txt/manifest MCP to tani dodatkowy widok. Najlepiej dla firm B2B/B2C, których klienci już używają asystentów AI do researchu zakupowego."
anti_context: "Nie stosować, gdy oferta nie ma jednego źródła prawdy (rozjazd cen maszynowych vs ludzkich to najdroższa klasa błędów), gdy klient oczekuje szybkich, gwarantowanych efektów (kanał na poziomie hipotezy, bez danych o efekcie), ani jako substytutu podstaw SEO/oferty — to warstwa dodatkowa, nie fundament."
inputs: ["Kanoniczne źródło danych oferty (katalog, cennik) w formacie strukturalnym","Dostęp do buildu strony (żeby generować treść maszynową z tego samego źródła)","Dostęp do logów serwera/hostingu (pomiar ruchu agentowego po user-agentach)","Lista zapytań, na które marka chce być cytowana przez asystentów","Decyzja o jawności cen dla maszyn"]
ai_tasks: ["Generacja llms.txt i maszynowego indeksu oferty z tego samego źródła co strona (zero duplikacji)","Rejestracja kanału tam, gdzie agenci szukają (katalogi MCP, konwencje llms.txt)","Monitoring ruchu agentowego w logach (GPTBot, ClaudeBot, PerplexityBot) na maszynowych ścieżkach","Cykliczny sondaż odpowiedzi głównych asystentów AI na zapytania docelowe (przed/po publikacji)","Pilnowanie detali protokołu (trailing slash, redirecty) ubijających dostępność"]
human_tasks: ["Przemek-decyzja: zakres jawności danych dla maszyn (ceny, warunki) i wybór katalogów rejestracji","Klient: zatwierdzenie treści maszynowej oferty (to oficjalna komunikacja cenowa)"]
expected_outcome: "Po 6-8 tygodniach twarda liczba zamiast intuicji: mierzalny ruch agentowy na maszynowych ścieżkach i/lub cytowania marki z poprawnymi danymi oferty w odpowiedziach asystentów AI na docelowe zapytania. Negatywny wynik też jest wynikiem (tanie, odwracalne wdrożenie)."
evidence: [{"id":"ev:agent-facing-distribution-001","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"caterelo — serwer MCP na produkcji jako kanał dostępu do danych relokacyjnych; nauczka techniczna: kanoniczny URL MCP wymaga końcowego slasha (klienci nie podążają za 308).","mechanism":"mech:agent-facing-distribution","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:agent-facing-distribution-002","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"r352-website — llms.txt z publicznymi cenami jako maszynowy kanał oferty (przy cenach ukrytych w UI dla ludzi).","mechanism":"mech:agent-facing-distribution","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:agent-facing-distribution-r352-brand-centre","type":"backtest","date":"2026-08-08","source":"rec:backtests/r352-brand-centre","note":"Bramkowane zrodlo marki zasililo publiczny kanal maszynowy w 6 dni — mimo ze Router odrzucil mechanizm wlasnie z powodu gatingu. | Zmiana: Rozszerzyc trigger karty o wariant 'gated zrodlo -> publiczny feed maszynowy'; confidence +1 evidence typu postmortem. [dowód: .brand/tokens.json voice.numberCanon ('300+ clubs','250+ locations','3x faster approvals','10k+ assets/year','5+ yrs','80%+ briefs first-round') vs public/llms.txt sekcje 'Proof (verified numbers)' i 'Canonical descriptions' — commit 4040f07 z 2026-07-18]","mechanism":"mech:agent-facing-distribution","project":"proj:r352-brand-centre","independence_key":"proj:r352-brand-centre::rec:backtests/r352-brand-centre"}]
tags: ["performance","copy","backend"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---

## Problem

Klasyczne kanały dotarcia (SEO, ads, cold outreach) są zatłoczone i drogie, a rosnąca część odkrywania ofert dzieje się przez agentów AI, które czytają maszynowe źródła, nie landing page'e. Nikt w segmencie r352 nie publikuje jeszcze oferty w formatach natywnych dla agentów.

## Mechanizm działania

Oferta i dane produktu są wystawiane w kanałach, których pierwszym czytelnikiem jest agent AI, nie człowiek: llms.txt z ofertą i cenami na r352.com (ceny jawne dla maszyn, ukryte na kartach usług dla ludzi — nieprzypadkowa asymetria), serwer MCP Caterelo na produkcji jako maszynowy kanał dostępu do danych produktu. Hipoteza: agent, który potrafi odpytać ofertę wprost, cytuje ją i rekomenduje częściej niż stronę wymagającą scrapowania, a bycie pierwszym w niszowym katalogu MCP daje nieproporcjonalną widoczność przy zerowej konkurencji. Komplementarny do zwalidowanego wzorca 'treść otwarta + narzędzia' — dla agentów 'otwartość' oznacza format maszynowy. Generacja treści maszynowej z tego samego źródła co strona (wzorzec single-source) jest warunkiem spójności.

## Warunki sukcesu

- Kanał jest zarejestrowany tam, gdzie agenci szukają (katalogi MCP, konwencje llms.txt) — sama obecność endpointu bez rejestracji = zero widoczności
- Treść maszynowa jest spójna ze stroną ludzką (jedno źródło prawdy) — niespójność cen llms.txt vs karty usług już odnotowana jako problem
- Istnieje pomiar ruchu agentowego (logi endpointu, atrybucja zapytań) — bez tego kanał nie przejdzie testu 'czy wiemy więcej'

## Warunki porażki

- Kanał zbudowany, niedystrybuowany: MCP Caterelo 'niezarejestrowany w żadnym katalogu — unikalny kanał bez żadnej widoczności' (klasyczny błąd ostatniej mili)
- Detale protokołu cicho ubijają dostępność: redirect 308 bez trailing slash odcinał klientów MCP zanim ktokolwiek to zauważył
- Rozjazd dwóch prawd (ceny w llms.txt vs strona) — najdroższa klasa błędów systemu przeniesiona na nowy kanał

## Potencjał automatyzacji

Wysoki: generacja llms.txt i manifestów MCP z tego samego źródła danych co strona (wzorzec 'jedno źródło → wiele widoków' pasuje 1:1), monitoring ruchu agentowego w logach, auto-rejestracja w katalogach.

## Transfer

Wysoki i wcześnie: usługa 'przygotujemy Twoją markę na odkrywanie przez agentów AI' (llms.txt, dane strukturalne, MCP dla katalogu produktów) to naturalne rozszerzenie Brand Hub OS i potencjalny wyróżnik ofertowy, zanim rynek to skopiuje. Pasuje do klientów z katalogami ofert (DailyFruits, Zdrofit, FitStyle).

## Eksperyment · BetterWorkplace/DailyFruits

Opublikować na dailyfruits.pl llms.txt + maszynowy indeks oferty (katalog CATS/programy w JSON, generowany przez istniejący build.js z tego samego źródła co strona — zero duplikacji danych). Przez 6–8 tygodni mierzyć w logach Vercela ruch po user-agentach AI (GPTBot, ClaudeBot, PerplexityBot itd.) na tych ścieżkach vs reszta serwisu, oraz cotygodniowy sondaż odpowiedzi 3 głównych asystentów AI na zapytania typu 'owoce do biura Warszawa' przed i po publikacji (czy cytują DailyFruits i czy podają poprawne dane oferty).

**Czego się dowiemy:** Dowiemy się, czy kanał agentowy w ogóle generuje mierzalny ruch/cytowania dla polskiej marki B2B w 2026 — tanie, odwracalne wdrożenie da pierwszą twardą liczbę zamiast intuicji i rozstrzygnie, czy 'AI-readiness marki' dodać jako moduł Brand Hub OS oraz czy warto dokończyć rejestrację MCP Caterelo.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
