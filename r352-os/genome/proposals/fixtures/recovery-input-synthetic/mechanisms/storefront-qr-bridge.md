---
id: "mech:storefront-qr-bridge"
type: "mechanism"
title: "Storefront QR Bridge"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-09"
version: 4
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":3,"projects":1,"independent_sources":2,"types":{"narrative":2,"backtest":1},"last_confirmed":"2026-08-08"},"recommendation":"test-first"}
category: "Funnel Mechanics"
relations: {"implements":["prin:proof-before-promise"],"related":["mech:presale-demand-ledger","mech:location-as-data-funnels","mech:incident-to-guard","mech:design-as-code"]}
trigger: "Klient mówi: 'oklejamy witrynę nowego klubu', 'robimy event w mieście', 'ludzie przechodzą obok, ale nic z tego nie mamy'. Cechy problemu: fizyczny punkt styku generujący lokalną uwagę (witryna w budowie, event, biuro sprzedaży) bez żadnego śladu mierzalnego."
context: "Sieci otwierające fizyczne lokalizacje (fitness, deweloperzy, retail) i marki robiące eventy miejskie. Najlepiej, gdy istnieje już dedykowany landing per lokalizacja (silnik location-as-data), na który QR może celować, oraz kontrola nad produkcją i montażem nośnika."
anti_context: "Nie stosować, gdy QR miałby prowadzić na ogólną stronę główną bez kontekstu lokalizacji (skan niemierzalny i nietrafiony), gdy nie ma wpływu na finalny wydruk i montaż (fizyka skanowania: wysokość, bryty — offline nie wybacza błędów), ani gdy nośnik nie może obiecać niczego spójnego z tym, co landing daje."
inputs: ["Rysunek techniczny nośnika (wymiary z rysunku, nie z wiadomości klienta)","Docelowy landing z parametrem źródła (?src=witryna)","Treść obietnicy (zapowiedź + pierwszeństwo) spójna z landingiem","Brand assets i wymagane logotypy","Harmonogram produkcji i montażu (weryfikacja przed drukiem)"]
ai_tasks: ["Generacja artboardów z danych (HTML→PNG 1:1, skala, cięcie na bryty)","Generacja QR z korekcją H i skryptowa weryfikacja moduł po module na finalnym renderze","Kontrola zasad fizyki skanowania (środek kodu 110-120 cm, kod nigdy na styku brytów)","Pomiar: skany (wejścia z parametrem), konwersja skan→zapis, udział witryny w księdze popytu vs reklama online"]
human_tasks: ["Klient: dostarczenie rysunków technicznych i akceptacja projektu","Podwykonawca (drukarnia/montaż): produkcja i montaż wg specyfikacji","Przemek-decyzja: weryfikacja finalnego renderu przed drukiem (offline nieodwracalny)"]
expected_outcome: "Mierzalny strumień offline→online: znana liczba skanów i konwersja skan→zapis per lokalizacja, plus znany udział darmowego medium (witryna, którą i tak trzeba zakleić) w całej liście przedsprzedażowej vs płatna reklama lokalna."
evidence: [{"id":"ev:storefront-qr-bridge-001","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"zdrofit-lodygowa-witryny: oklejenie witryn nowego klubu CH Łodygowa — 'tu powstaje nowy klub fitness' + QR; wariant sprawdzonego wcześniej wzorca z Poznania (drugi kontekst tej samej mechaniki); zasady wysokości i weryfi","mechanism":"mech:storefront-qr-bridge","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:storefront-qr-bridge-002","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"zdrofit-cwicz-w-zieleni: event Pilates o zachodzie na Kopcu Krakusa — 10 formatów kreacji prowadzących ruch eventowy (offline'owa obecność marki w zieleni miejskiej) do zapisów online","mechanism":"mech:storefront-qr-bridge","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:storefront-qr-bridge-lumo-brand","type":"backtest","date":"2026-08-08","source":"rec:backtests/lumo-brand","note":"Projekt zatrzymal sie na dwoch wejsciach zewnetrznych tej samej klasy (realny URL formularza opinii Google + logo w wektorze). Cale twarde rzemioslo karty — dedykowany cel, korekcja H, weryfikacja modul po module, spojnosc po skanie, pomiar — nigdy nie zostalo uruchomione, bo projekt umarl pietro wyzej. W plikach pozostal QR-placeholder z 3 finder patterns, wizualnie nieodroznialny od dzialajacego kodu. Router dal bramke blokujaca tylko jednemu z dwoch wejsc (logo, G0b), drugie umiescil po projektowaniu (G3). | Zmiana: Nowy failure_condition: 'wejscia zewnetrzne (realny URL celu, ID, logo wektorowe) pozyskane jako bramka STARTU produkcji — bez kompletu wejsc artefakt nie wchodzi do projektowania'. Plus zasada: kazdy swiadomy placeholder w pliku produkcyjnym dostaje marker NIE DRUKOWAC w nazwie node'a/warstwy. Bez zmiany confidence. [dowód: proj:lumo-brand: 'do dokonczenia: realny link do opinii Google (prawdziwy QR) i logo SVG od Reszka', status archived, 2026-08-08; memory/lumo-brand.md ~20.07.2026 (opis wzoru modulow QR)]","mechanism":"mech:storefront-qr-bridge","project":"proj:lumo-brand","independence_key":"proj:lumo-brand::rec:backtests/lumo-brand"}]
tags: ["performance","design"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---

## Problem

Fizyczne punkty styku (witryna klubu w budowie, event w parku) generują realną lokalną uwagę, ale ta uwaga nie zostawia śladu — przechodzień zobaczył i poszedł, popyt jest niemierzalny i nieprzechwycony.

## Mechanizm działania

Nośnik offline dostaje jedno zadanie konwersyjne: przenieść przechodnia do mierzalnego lejka online przez QR prowadzący do dedykowanej strony (nie home). Mechanizm ma twarde rzemiosło wykonania, bo offline nie wybacza błędów: QR generowany z korekcją H i weryfikowany moduł po module na finalnym renderze, środek kodu ~110–120 cm nad podłogą (70 cm = za nisko do skanowania), kod nigdy na styku brytów wydruku. Komunikat na nośniku = zapowiedź + pierwszeństwo ('tu powstaje nowy klub'), czyli offline'owa wersja przedsprzedaży.

## Warunki sukcesu

- QR celuje w dedykowany landing z parametrem źródła, nie w stronę główną — inaczej skan jest niemierzalny i nietrafiony
- Fizyka skanowania sprawdzona na finalnym wydruku (wysokość, rozmiar, ciągłość kodu), nie w makiecie
- Treść nośnika obiecuje pierwszeństwo/zapowiedź spójną z tym, co landing faktycznie daje

## Warunki porażki

- QR umieszczony za nisko (pierwsza wersja Łodygowej: 70 cm — poniżej wygodnej wysokości skanowania) lub przecięty na styku brytów — zero skanów mimo poprawnego projektu
- Wymiary z wiadomości klienta różne od rysunku technicznego (na Łodygowej ~2 mm na dwóch szybach) — projekt bez weryfikacji z rysunkiem nie domyka się na montażu
- QR prowadzi do ogólnej strony bez kontekstu lokalizacji — przechodzień z Targówka ląduje na home sieci i wypada

## Potencjał automatyzacji

Średnio-wysoki: artboardy generowane z HTML (obiekt COPY + BOARDS, skala 1 cm = 10 px, render.sh → PNG 1:1, potnij.py na bryty) — nowa lokalizacja to podmiana danych; generacja i weryfikacja QR skryptowa (segno + porównanie moduł po module).

## Transfer

Sieci otwierające fizyczne lokalizacje: FitStyle (6 klubów w pipeline = 6 witryn do oklejenia z QR→/przedsprzedaz/{miasto}), Zdrofit/Benefit (wzorzec już powtórzony Poznań→Warszawa), Archicom (biura sprzedaży inwestycji).

## Eksperyment · FitStyle

Przy najbliższym klubie z pipeline'u: oklejenie witryny wg zasad Zdrofit (QR z korekcją H, środek 110–120 cm, weryfikacja na renderze) prowadzące do /przedsprzedaz/{miasto}?src=witryna. Mierzymy skany (wejścia z parametrem), konwersję skan→zapis oraz udział witryny w całej liście przedsprzedażowej vs reklama online w tym samym mieście.

**Czego się dowiemy:** Jaki procent księgi popytu przedsprzedażowego generuje sama witryna (medium darmowe, bo i tak trzeba ją zakleić) vs płatna reklama lokalna — czyli czy most offline→online powinien być standardowym elementem pakietu otwarcia każdej lokalizacji.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
