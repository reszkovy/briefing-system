---
id: "mech:strategy-before-execution"
type: "mechanism"
title: "Strategy Before Execution — diagnoza przed produkcją"
status: "emerging"
owner: "przemek"
confidence: {"value":"emerging","evidence_strength":{"n":2,"projects":2,"independent_sources":2,"types":{"backtest":2},"last_confirmed":"2026-08-09","directions":{"neutral":1,"limits":1}},"recommendation":"test-first"}
category: "Decision Quality"
relations: {"implements":["prin:extract-never-invent"],"related":["mech:competitive-benchmarking","mech:working-artifact-extraction"]}
trigger: "Brief zamawia EGZEKUCJĘ (strona, kampania, materiały, rebranding), ale zespół nie potrafi jednym zdaniem odpowiedzieć: komu ta firma sprzedaje, czym wygrywa i co ma się zmienić w głowie odbiorcy. Sygnał ostrzegawczy: pierwszy artefakt powstaje, zanim ktokolwiek nazwał dominujący typ problemu."
context: "Projekty z konsekwencjami pozycjonującymi i ciągłością: rebrandingi, wejścia w nową kategorię, marki osobiste ekspertów, architektury wielu marek, kampanie o horyzoncie ≥90 dni. Klient ma odbiorcę zewnętrznego i realny problem rynkowy."
anti_context: "Nie stosować przy: projektach czysto technicznych i infrastrukturalnych bez odbiorcy zewnętrznego; pojedynczych artefaktach bez ciągłości (jeden baner, jedna poprawka); projektach ze świeżą, zaakceptowaną strategią (<12 mies.), której brief nie kwestionuje — tam diagnoza od zera to podatek, nie wartość. Nie stosować jako wymówki do opóźnienia egzekucji, gdy problem jest jawnie produktowy lub cenowy — wtedy uczciwą odpowiedzią jest 'branding tego nie naprawi', a nie kolejny warsztat."
inputs: ["Brief klienta + to, czego brief NIE mówi (kto decyduje, co spada, kto realnie kupuje)","Dostęp do liczb (sprzedaż, konwersja, retencja) albo jawna deklaracja ich braku","Benchmark kategorii (mech:competitive-benchmarking) jako wejście do warstwy L"]
ai_tasks: ["Rekonstrukcja pakietu wejściowego: co wiadomo, czego brakuje, co jest hipotezą podaną jako fakt","Przeprowadzenie wf:salt warstwami z wymuszeniem jednozdaniowych wniosków","Klasyfikacja dominującego typu problemu i wyprowadzenie konsekwencji zakresowych","Po zatwierdzeniu SALT: przeprowadzenie wf:plate i konfrontacja kalendarza z pojemnością"]
human_tasks: ["Przemek/klient: zatwierdzenie wniosku każdej warstwy (SALT bez akceptacji nie jest fundamentem dla PLATE)","Klient: dostęp do swoich klientów na wywiady albo świadoma zgoda, że odkrycia zostaną hipotezami","Przemek-decyzja: powiedzieć klientowi, gdy dominujący problem nie jest percepcyjny — nawet kosztem mniejszego zlecenia"]
expected_outcome: "Zakres projektu zostaje wyprowadzony z diagnozy, nie z zamówienia: mierzalnie — co najmniej jedna decyzja zakresowa/pozycjonująca zmienia się względem pierwotnego briefu, a odkrycia mają jawny status ZWALIDOWANE|HIPOTEZA. Kontr-test: jeśli po SALT/PLATE żadna decyzja się nie zmieniła, mechanizm w tym projekcie NIE zadziałał (koszt bez zwrotu)."
tags: ["strategia","bw-origin"]
created: "2026-08-09"
updated: "2026-08-09"
version: 3
evidence: [{"id":"ev:strategy-before-execution-bw","mechanism":"mech:strategy-before-execution","project":"proj:betterguide-hub","type":"backtest","date":"2026-08-09","source":"rec:backtests/betterworkplace-salt-plate","observation":"BetterWorkplace Faza 1+2 (kwiecień-maj 2026): SALT wyprodukował 6 deliverables (architektura marek, karty ról, narracja, matryca komunikacji, mapa ścieżek, plan wdrożenia), PLATE dołożył plan komunikacji. REKONSTRUKCJA HISTORYCZNA, nie żywy pomiar — nie znamy delty wskaźników klienta ani tego, które odkrycia były hipotezami. Wartość dowodowa: pokazuje, że procedura jest wykonalna end-to-end, NIE że poprawia wynik. KIERUNEK: neutral — wobec claimu o poprawie wyniku ten backtest nie jest dowodem ani za, ani przeciw; dowodzi wyłącznie wykonalności.","direction":"neutral","independence_key":"proj:betterguide-hub::rec:backtests/betterworkplace-salt-plate","fingerprint":"689cb57f3930798e"},{"id":"ev:strategy-before-execution-tlumacz","mechanism":"mech:strategy-before-execution","project":"proj:marka-tlumacz","type":"backtest","date":"2026-08-09","source":"rec:backtests/marka-tlumacz-salt-gap","observation":"Trial #002 (marka tłumacza): v1 strony powstało BEZ warstwy diagnostycznej — dopiero benchmark po fakcie ujawnił brak par językowych, liczb, akredytacji i referencji, czyli braki warstwy A (odbiorca) i L (przewaga) SALT. Koszt: pełna runda poprawek v1→v1.1. KIERUNEK: limits — nie potwierdza claimu, lecz wyznacza jego granicę: pokazuje koszt pominięcia warstwy w JEDNYM projekcie o małej skali, bez dowodu, że przy większej skali koszt rośnie.","direction":"limits","independence_key":"proj:marka-tlumacz::rec:backtests/marka-tlumacz-salt-gap","fingerprint":"8fbfecc54358bd99"}]
---



## Problem

Egzekucja zamówiona przez klienta jest odpowiedzią na problem, który klient SAM zdiagnozował — a to najsłabsze ogniwo. Firma prosi o stronę, gdy problemem jest niejasna oferta; prosi o kampanię, gdy problemem jest cena; prosi o rebranding, gdy problemem jest produkt. Bez warstwy diagnostycznej agencja realizuje zamówienie, nie rozwiązuje problemu — i obie strony dowiadują się o tym po fakcie.

## Mechanizm działania

Między briefem a produkcją wchodzi para procedur o kierunkowej zależności: **Research/Benchmark → SALT → PLATE → egzekucja**. SALT (`wf:salt`) diagnozuje: sytuację, odbiorcę, przewagę i zmianę percepcji, kończąc się jawną klasyfikacją dominującego typu problemu. PLATE (`wf:plate`) — wyłącznie na zatwierdzonym fundamencie — zamienia to w ścieżkę klienta, blokady, cele z metrykami, tematy i kalendarz. Kluczowa nie jest produkcja dokumentów, lecz to, że **klasyfikacja problemu ma prawo zmienić zakres zlecenia albo je zakwestionować**.

## Warunki sukcesu

- Co najmniej jedna decyzja zakresowa/pozycjonująca zmienia się względem pierwotnego briefu
- Odkrycia mają jawny status ZWALIDOWANE/HIPOTEZA i plan walidacji
- PLATE startuje wyłącznie na zatwierdzonym fundamencie
- Gdy problem nie jest percepcyjny — zostaje to powiedziane klientowi przed wydaniem budżetu

## Warunki porażki

- SALT/PLATE produkują dokumenty, ale żadna decyzja się nie zmienia — to koszt bez zwrotu, nie „porządkowanie wiedzy"
- Diagnoza dopasowana do zakupionego zakresu (racjonalizacja zamówienia zamiast diagnozy)
- PLATE bez fundamentu — plan komunikacji dla niezatwierdzonego pozycjonowania
- Odkrycia-hipotezy prezentowane jako ustalenia
- Framework użyty przy problemie produktowym/cenowym jako sposób na utrzymanie zlecenia

## Potencjał automatyzacji

Wysoki dla struktury i kompletności (sesja prowadzi warstwami, wymusza jednozdaniowe wnioski, sprawdza statusy odkryć), zerowy dla osądu: klasyfikacja dominującego problemu i decyzja „powiedzieć klientowi, że branding nie pomoże" zostają u człowieka.

## Transfer

Każdy klient z konsekwencjami pozycjonującymi. Sprzężenie: `mech:competitive-benchmarking` zasila warstwę L, `mech:format-dictionary` przejmuje po warstwie E przy wolumenie.

## Status dowodowy — uczciwie

Oba wpisy Evidence to **backtesty** (rekonstrukcja historyczna), nie żywe pomiary. Pokazują wykonalność procedury i koszt jej pominięcia — **nie** dowodzą, że projekty z SALT/PLATE wypadają lepiej. Do `validated` brakuje: ≥1 żywego measurement/postmortem z rozliczonymi predykcjami i deltą wskaźnika klienta, z ≥2 różnych projektów. Dlatego `emerging` / `test-first`.

## Version
- v1 · 2026-08-09 — karta-propozycja z ekstrakcji BetterWorkplace + r352-framework. NIE w kanonie.
