---
id: "mech:deterministic-spine"
type: "mechanism"
title: "Deterministic Spine"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-09"
version: 4
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":9,"projects":5,"independent_sources":6,"types":{"narrative":4,"backtest":5},"last_confirmed":"2026-08-08"},"recommendation":"use-with-care"}
category: "Decision Quality"
relations: {"implements":["prin:reduce-subjectivity"],"related":["mech:numeric-gates","mech:machine-narrows-human-picks","mech:incident-to-guard","mech:agent-as-runtime"]}
trigger: "Klient pyta 'ile to będzie kosztować per operacja?', 'co się stanie, jak API padnie?' albo procurement/IT wymaga audytowalności i SLA. Sygnał: planowany system decyzyjny 'wszystko przez LLM' przy dużym wolumenie, albo odwrotnie — czysto regułowy system ślepy na semantykę treści."
context: "Organizacje z procurementem/IT i wolumenowym przepływem treści (ok. 100+ operacji/mies.), kupujące automatyzację z policzonym kosztem jednostkowym; każdy produkt sprzedawany z SLA cenowym. Wymaga domeny, w której część decyzji jest policzalna regułami."
anti_context: "Nie stosować tam, gdzie zadanie jest w całości kreatywno-semantyczne i nie da się wydzielić pełnowartościowej ścieżki zero-LLM — kręgosłup deterministyczny byłby atrapą. Nie zaczynać od warstwy LLM 'bo łatwiej' — kolejność musi iść od reguł; unikać też budowy drugiego silnika scoringu obok istniejącego (duplikacja to znany failure mode)."
inputs: ["Katalog decyzji w procesie z podziałem: policzalne regułami vs wymagające semantyki","Twarde kryteria/wagi dla warstwy regułowej (readiness, checklisty)","Budżet jednostkowy i zgoda na cost cap w kodzie (np. $0.05/operacja)","Zdefiniowane zachowanie degradacji przy padzie API (fallback do reguł, 'n/d nigdy crash')","Korpus realnych przypadków do zmierzenia delty jakości między warstwami"]
ai_tasks: ["Implementacja deterministycznego kręgosłupa (rule engine, jawne wagi) jako warstwy domyślnej","Przypisanie modeli do warstw wg wymaganej inteligencji (Haiku uzasadnienia, Sonnet generacja/ekstrakcja, najdroższy krytyka)","Wpisanie cost capów i fallbacków w kod przed włączeniem warstw LLM","Cache wyników z recompute tylko przy zmianie wejścia","Test A/B/C warstw na korpusie (sam rule engine / +tani model / +semantyka) z kosztem per operacja"]
human_tasks: ["Przemek-decyzja: gdzie leży punkt nasycenia jakości (którą warstwę realnie kupować)","Klient: akcept kosztów jednostkowych i zachowania degradacji (co się dzieje przy padzie)","Przemek-decyzja: konsolidacja do jednego silnika, gdy istnieją duplikaty"]
expected_outcome: "System działa przy wyłączonym LLM (degraduje się do reguł zamiast umierać), a koszt per operacja jest znany z góry i trzymany capem w kodzie — mierzalnie: zero awarii produktu przy padach API, rachunek per brief/operacja zgodny z założeniem, każda decyzja z audytowalną ścieżką."
evidence: [{"id":"ev:deterministic-spine-001","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"narzedzie-do-briefowania — trójwarstwowy audyt: policy-engine (reguły, zero cost fallback) → ai-auditor (completeness) → llm-auditor (RAG na pgvector); Haiku pisze po polsku 'dlaczego to problem dla tej marki'; hard cap ","mechanism":"mech:deterministic-spine","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:deterministic-spine-002","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"r3loop-app — Readiness Score (12 deterministycznych kryteriów) i MACS auto-suggest liczone bez LLM; generator strategii Sonnet okolony deterministycznym Criticiem (10 checków) z progiem 750; 845–930/1000 w 1 iteracji prz","mechanism":"mech:deterministic-spine","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:deterministic-spine-003","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"r352-framework-brand-hub-os — subagenty Sonnet do ekstrakcji szablonów P0 jako celowa decyzja modelowa przy limicie Fable 5.","mechanism":"mech:deterministic-spine","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:deterministic-spine-004","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"btc-sentiment-tracker — regułowy klasyfikator sentymentu z jawnymi wagami zamiast czarnej skrzynki; Promise.allSettled z fallbackiem 'n/d nigdy crash' przy padzie źródeł.","mechanism":"mech:deterministic-spine","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:deterministic-spine-005","type":"backtest","date":"2026-08-09","source":"rec:backtests/briefsync","note":"briefsync (retro-postmortem bt#001): deterministyczny kręgosłup syncu (stan JSON, idempotencja po lastActionId, anty-duplikacja) był warunkiem działania 8 tablic; wszystkie 3 realne awarie to naruszenia tej zasady (wspólny stan bez izolacji) — mechanizm potwierdzony przez swoje negatywy.","mechanism":"mech:deterministic-spine","project":"proj:briefsync","independence_key":"proj:briefsync::rec:backtests/briefsync"},{"id":"ev:deterministic-spine-bt-dailyfruits-cms-v6","type":"backtest","date":"2026-08-09","source":"rec:backtests/dailyfruits-cms-v6","note":"(bt#T1) Użyty a nierekomendowany: weryfikacja sha+old (optimistic locking), atomowy multi-file commit przez Git Data API, idempotentne kanoniczne buildery | Zmiana: Rozszerzyć trigger karty o klasę concurrent-write na wspólnym źródle","mechanism":"mech:deterministic-spine","project":"proj:dailyfruits-cms-v6","independence_key":"proj:dailyfruits-cms-v6::rec:backtests/dailyfruits-cms-v6"},{"id":"ev:deterministic-spine-bt-dailyfruits-katalog-handlowy","type":"backtest","date":"2026-08-09","source":"rec:backtests/dailyfruits-katalog-handlowy","note":"(bt#T2) Kalkulator = czysty regułowy JS (CATS + tiery eko/std/prem, ×4.33, ±15%), zero LLM — trafienie poprawne ale mało dyskryminujące (statyczny hosting wymuszał ten wynik); zarazem Bramka 1 (potwierdzenie cen przez klienta) bez śladu wykonania | Zmiana: Evidence postmortem BEZ podbicia confidence (niska śmiałość trafienia); akcja operacyjna: potwierdzić z klientem aktualność cen CATS","mechanism":"mech:deterministic-spine","project":"proj:dailyfruits-katalog-handlowy","independence_key":"proj:dailyfruits-katalog-handlowy::rec:backtests/dailyfruits-katalog-handlowy"},{"id":"ev:deterministic-spine-caterelo","type":"backtest","date":"2026-08-08","source":"rec:backtests/caterelo","note":"Dwie niewidzace sie implementacje tego samego scoringu, z ktorych jedna miala odwrocony wymiar i obslugiwala kanal AI przez miesiace. | Zmiana: +1 evidence typu postmortem. Dopisac regule wykonawcza: jeden silnik scoringu, N konfiguracji; test rownowaznosci app<->API jako bramka builda. [dowód: Commit c66e5c6 (2026-08-07, proptrend-deploy): '_minmax przyjmuje trzy argumenty, a wywolanie podawalo czwarty (true), ktory mial odwrocic skale i byl po cichu ignorowany... sredni koszt zycia w pierwszej dziesiatce rankingu MCP wynosil 1950 EUR, w ostatniej 894 EUR'. Pliki: src/utils/life-trend.js (wagi 18/15/11) vs api/lifetrend.js (wagi 22/18/13).]","mechanism":"mech:deterministic-spine","project":"proj:caterelo","independence_key":"proj:caterelo::rec:backtests/caterelo"},{"id":"ev:deterministic-spine-penya-saas","type":"backtest","date":"2026-08-08","source":"rec:backtests/penya-saas","note":"Migracja zacommitowana w repo i nigdy niewykonana na bazie, przy trwale zamknietej sciezce CLI — dwie prawdy (schemat w repo vs schemat live) rozjezdzaja sie cicho, bo akt 'apply' lezy poza pipeline'em | Zmiana: Guard repo<->live schema drift jako rozszerzenie karty + nowy input: 'poswiadczenie kanalu CLI zapisane przed pierwsza migracja (inaczej konsola dostawcy jest jedyna droga i nie ma jej kto pilnowac)' [dowód: supabase/migrations/0004_admin_delete_applications.sql (commit ce57383, 31.07.2026) + memory penya-saas.md (31.07.2026): 'DO WYKONANIA na bazie gdy SQL editor wstanie' oraz 'haslo DB wygenerowane i NIEZAPISANE']","mechanism":"mech:deterministic-spine","project":"proj:penya-saas","independence_key":"proj:penya-saas::rec:backtests/penya-saas"}]
tags: ["backend","ops","strategia"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---

## Problem

Systemy decyzyjne zbudowane w całości na LLM są drogie, niedeterministyczne i padają razem z API (a najmocniejszy model do wszystkiego wyczerpuje limity i budżet) — a systemy czysto regułowe nie rozumieją semantyki. Organizacje wybierają jedno albo drugie i płacą albo kosztem/awariami, albo ślepotą na treść; w korpusie realne awarie środowiska (pauza free-tier Supabase, 429 CoinGecko, ucięty JSON przy max_tokens) były wielokrotnie mylone z bugami własnego kodu.

## Mechanizm działania

Architektura warstwowa wg wymaganej inteligencji: deterministyczny kręgosłup (rule engine, jawne wagi, twarde kryteria) podejmuje wszystkie decyzje policzalne bez modelu — za darmo, natychmiast, odtwarzalnie — i działa bez LLM; tani model (Haiku) robi uzasadnienia i klasyfikacje wolumenowe; średni (Sonnet) generuje i ekstrahuje; najdroższy ocenia i krytykuje. Każda warstwa LLM ma twardy cost cap wpisany w kod ($0.05/brief hard stop) i zdefiniowany deterministyczny fallback. Skutek: produkt działa przy padzie API (degraduje się do reguł zamiast umierać), koszt jednostkowy jest policzony z góry, każda decyzja ma audytowalną ścieżkę, a LLM jest wymienialnym komponentem, nie fundamentem — warunek sprzedaży organizacjom z procurementem.

## Warunki sukcesu

- Ścieżka zero-LLM istnieje NAJPIERW i jest domyślna oraz pełnowartościowa — model dokłada wartość, nie warunkuje działania
- Cost cap i fallback zdefiniowane w kodzie PRZED włączeniem warstwy LLM, nie po pierwszym rachunku; koszt per operacja znany przed sprzedażą
- Cache wyników z recompute tylko przy zmianie wejścia — inaczej koszty i latencja rosną bez wartości
- Kryteria oceny liczbowe (Critic 750/1000, Brand Lock 85/100) — inaczej tańszy model nie ma jak być rozliczony z jakości; kolejność implementacji wg user value, nie łatwości technicznej

## Warunki porażki

- Duplikacja silników zamiast jednego komponentu: readiness.ts+MACS vs policy-engine+llm-auditor — dwie implementacje scoringu briefów, które się nie widzą
- Limity infrastruktury mylone z bugami kodu (pauza Supabase jako 'awaria auth', max_tokens 8k ucinający JSON) — bez zaprojektowanej degradacji każdy limit wygląda jak awaria produktu
- Brak monitoringu cichych failów generacji — pierwszy pilot kliencki r3loop może paść bez alertu; fallback bez alertowania maskuje degradację
- Automatyzacja tylko w komentarzach: UI miesiącami odsyłał do przycisku 'Generuj strategię', który nie istniał — warstwa deklarowana, nie zbudowana

## Potencjał automatyzacji

To JEST wzorzec architektury automatyzacji — rdzeń działa pod cronem/launchd bez agenta. Największa dźwignia: konsolidacja w jeden 'brief scoring engine' wystawiony obu produktom (r3loop + Narzędzie), monitoring failów generacji, zamiana walidatorów-promptów w walidatory-skrypty. Wzorzec spisany jako reużywalny spec (LLM_INTEGRATION_SPEC.md).

## Transfer

Wysoki i bezpośrednio ofertowy: 'wasza automatyzacja nie umrze razem z API i ma policzony koszt per decyzja' to argument, którego agencje nie składają — warunek każdej oferty produktowej z SLA cenowym (Narzędzie 50–100k PLN) i przepustka przez procurement/IT u klientów typu Benefit czy Sonova. Przenosi się na każdy system oceny treści.

## Eksperyment · Benefit/Zdrofit (Narzędzie do briefowania)

Wykorzystać nieużyty korpus 39 realnych briefów z briefsync: przepuścić każdy brief przez trzy konfiguracje (sam policy-engine / +Haiku reasoning / +Sonnet semantic alignment), a wyniki ocenić w ślepym teście przez Reszka i Natalię (użyteczność dla walidatora, skala 1–5). Zmierzyć deltę jakości między warstwami oraz realny koszt per brief w każdej konfiguracji vs cap.

**Czego się dowiemy:** Dowiemy się, gdzie leży punkt nasycenia jakości (czy Haiku wystarcza do reasoning; ile realnej wartości decyzyjnej dokłada warstwa semantyczna ponad darmowe reguły — czyli czy $0.05/brief kupuje mierzalnie lepsze decyzje). To ustawia pricing pilotażu 20 lokalizacji na twardych kosztach jednostkowych i rozstrzyga architekturę przed skalowaniem; przy okazji pierwsza walidacja alignment score na realnych danych.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
