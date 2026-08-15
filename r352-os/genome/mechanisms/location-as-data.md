---
id: "mech:location-as-data"
type: "mechanism"
title: "Location-as-Data"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-14"
version: 5
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":6,"projects":1,"independent_sources":2,"types":{"narrative":5,"backtest":1},"last_confirmed":"2026-08-08"},"recommendation":"use-with-care"}
category: "Production Scaling"
relations: {"implements":["prin:single-source-of-truth"],"related":["mech:single-source-compiler","mech:design-as-code","mech:location-as-data-funnels","mech:format-dictionary"]}
trigger: "Klient sieciowy mówi 'każdy klub/lokal robimy osobno', 'otwieramy nowe lokalizacje i marketing nie nadąża' albo w briefie widać, że duża część wolumenu to warianty tej samej kreacji per lokalizacja (adres, godziny, nazwa miasta — z odmianą 'w Rybniku')."
context: "Klienci wielolokalizacyjni (sieci fitness, gastro, retail, franczyzy) z powtarzalnymi rodzinami artefaktów per lokalizacja i planem ekspansji — im więcej lokalizacji w pipeline, tym większa dźwignia. Rynki fleksyjne (PL) to naturalna przewaga: fleksja w configu jest barierą dla zachodnich narzędzi."
anti_context: "Nie stosować przy 1-2 lokalizacjach bez planu skali — silnik się nie zwróci. Nie obiecywać skali przed walidacją na ≥2 lokalizacjach (pierwsza replikacja ujawnia, co było przybite). Czerwona flaga: 'dorobię ręcznie po generacji' — niekompletny config łamie mechanizm; podobnie współdzielony stan między tenantami (znany bug). ROZROZNIENIE, KTOREGO KARTA NIE MIALA (backtest fitstyle-platform 09.08): replikacja TECHNICZNA przy danych-first jest darmowa i nie jest zadnym dowodem — FitStyle zbudowal 6 miast z 13 rekordow bez wysilku. Waskim gardlem jest walidacja RYNKOWA i to ona, nie liczba zbudowanych lokalizacji, jest warunkiem uznania mechanizmu za dzialajacy. Warunek \">=2 lokalizacje\" mierzyl niewlasciwa rzecz."
inputs: ["Kompletny schemat rekordu lokalizacji: nazwa+fleksja (cityGen/cityLoc), adres, godziny, brand assety, kanały","Rejestr lokalizacji jako dane (JSON/py), nie jako projekty","Wspólny silnik/szablony rodzin artefaktów (LP, oklejenia, kreacje)","Mechanizm izolacji stanu per tenant (BOARD_TAG, TenantProvider, RLS)","Realny cykl kampanii do walidacji schematu na ≥2 lokalizacjach"]
ai_tasks: ["Zaprojektowanie i walidacja schematu 'lokalizacja-as-data' na realnych briefach (wykrycie brakujących pól)","Generacja kompletu artefaktów per lokalizacja z configu (LP, kreacje, oklejenia)","Walidacja configu + smoke-test per lokalizacja przy scaffoldzie 'nowa lokalizacja'","Obsługa fleksji i wariantów językowych z pól configu","Egzekwowanie izolacji stanu per konsument/tenant"]
human_tasks: ["Klient: dostarczenie i potwierdzenie danych lokalizacji (godziny, adresy, lokalne oferty)","Przemek-decyzja: co jest polem configu, a co pozostaje kreacją ręczną (granica automatyzacji)","Klient: akcept artefaktów pierwszej i drugiej lokalizacji (test parametryczności)"]
expected_outcome: "Nowa lokalizacja = nowy rekord, nie nowy projekt: czas na lokalizację spada z dni do godzin, a mierzymy odsetek briefów wolumenu w pełni zasilanych configiem i kompletność schematu (ile pól trzeba było dorobić na realnym cyklu)."
evidence: [{"id":"ev:location-as-data-001","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"fitstyle-platform — location-as-data z polską fleksją; silnik LP przedsprzedażowych dla 6 klubów + 6 w pipeline","mechanism":"mech:location-as-data","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:location-as-data-002","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"briefsync — deklaratywny boards.json mapujący 8 tablic klienckich na jeden router; osobny stan per konsument (sync_state.json vs obsidian_index.json + BOARD_TAG)","mechanism":"mech:location-as-data","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:location-as-data-003","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"penya-saas — TenantProvider z tokenami brand-* per penya (?penya=mallorca), RLS w schemacie Supabase","mechanism":"mech:location-as-data","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:location-as-data-004","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"zdrofit-lodygowa-witryny — BOARDS jako config lokalizacji dla silnika oklejeń","mechanism":"mech:location-as-data","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:location-as-data-005","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"stocki-miasta — cities.py: 33 miasta jako rekordy ze słowami-kluczami walidacji","mechanism":"mech:location-as-data","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:location-as-data-caterelo","type":"backtest","date":"2026-08-08","source":"rec:backtests/caterelo","note":"Generowanie 144 stron z jednego zrodla wyprodukowalo sprzecznosci wewnatrz pojedynczej strony, publikowane rowniez jako dane strukturalne. | Zmiana: +1 evidence postmortem dla location-as-data i location-as-data-funnels; dopisac klase 'sprzecznosci wewnatrz rekordu' do anti-context; nowa hipoteza mech:generated-copy-assertions jako bramka builda. [dowód: Commit 94bb178 (07.08.2026): 'sprzecznosc widoczna dla uzytkownika na 72 z 90 stron regionow... Toskania 850 vs 1462 EUR, Attyka 700 vs 1238. Obie trafialy tez do schema.org FAQPage'; rentownosc zawyzona o ~7% (regionow >8% brutto: 38->28). Commit d454f53: '19 stron twierdzilo jednoczesnie, ze szkol nie ma i ze jest ich znaczace skupisko', '25 stron less developed obok deklaracji o wielu przestrzeniach coworkingowych' + samo-zadana regresja mianownika w jednej z dwoch sekcji.]","mechanism":"mech:location-as-data","project":"proj:caterelo","independence_key":"proj:caterelo::rec:backtests/caterelo"}]
tags: ["backend","frontend","performance"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---

## Problem

Klienci wielolokalizacyjni (sieci klubów, penye, sieci fitness) potrzebują artefaktów per lokalizacja; robienie ich ręcznie oznacza koszt liniowy i chaos wersji, a w językach fleksyjnych dodatkowo błędy gramatyczne ('w Rybnik').

## Mechanizm działania

Lokalizacja/tenant jest rekordem danych, nie projektem: deklaratywny config (JSON/py) z KOMPLETNYM opisem lokalizacji — łącznie z polską fleksją (cityGen/cityLoc) i brandem — zasila wspólny silnik, a stan każdego konsumenta jest twardo izolowany (BOARD_TAG, TenantProvider, RLS). Nowa lokalizacja = nowy rekord, nie nowy projekt: koszt krańcowy spada do godzin, bo cała praca projektowa została wykonana raz na poziomie silnika. Izolacja stanu per tenant jest częścią mechanizmu, wykutą na realnym bugu.

## Warunki sukcesu

- Config opisuje lokalizację KOMPLETNIE, łącznie z językiem (fleksja) i brandem — każde 'dorobię ręcznie po generacji' łamie mechanizm
- Stan per tenant/konsument fizycznie odizolowany od pierwszego dnia
- Silnik zwalidowany na ≥2 lokalizacjach zanim obieca się skalę — pierwsza replikacja ujawnia, co było przybite

## Warunki porażki

- Współdzielony stan między konsumentami — bug briefsync (tablice oznaczały sobie nawzajem briefy jako done) kosztował realną naprawę
- Semantyczne wyszukiwanie bez progu pewności podstawia INNE miasta zamiast pustki — dane per lokalizacja wymagają walidacji per lokalizacja
- Infrastruktura multi-tenant czeka na konta/sekrety właściciela (Penya: Supabase+Stripe na kontach Reszka) — mechanizm techniczny gotowy, blokada operacyjna

## Potencjał automatyzacji

Bardzo wysoki: scaffold 'nowa lokalizacja' (walidacja configu + generacja + smoke-test per lokalizacja); docelowo panel, w którym klient sam dodaje lokalizację. To wprost architektura produktu 'Narzędzie do briefowania' (pilot 20 lokalizacji).

## Transfer

Rdzeń oferty dla całego segmentu klientów sieciowych (Benefit ~100 briefów/mies. to w dużej mierze warianty per klub). Przenosi się na każdy rynek fleksyjny — fleksja w configu to realna bariera wejścia dla zachodnich narzędzi, czyli przewaga lokalna r352.

## Eksperyment · Benefit/Zdrofit (pilot Narzędzia do briefowania, 20 lokalizacji)

Zbudować rejestr 20 klubów pilotażowych jako klub-config (nazwa+fleksja, adres, godziny, brand assety, kanały) i przepuścić przez niego jeden realny cykl kampanii lokalnej. Zmierzyć: ile pól configu wystarczyło (kompletność schematu), ile briefów z cyklu dało się w pełni zasilić configiem, czas na klub vs obecny proces.

**Czego się dowiemy:** Dostaniemy zwalidowany schemat 'club-as-data' — brakujące pola wykryte na realnych briefach zamiast zgadywane — oraz twardy procent wolumenu obsługiwalny per-lokalizacyjnie, co jest bezpośrednim inputem do pricingu pilotu 50–100k PLN.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
