---
id: "mech:design-as-code"
type: "mechanism"
title: "Design-as-Code"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-09"
version: 4
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":10,"projects":6,"independent_sources":7,"types":{"narrative":4,"backtest":6},"last_confirmed":"2026-08-08"},"recommendation":"use-with-care"}
category: "Production Scaling"
relations: {"implements":["prin:single-source-of-truth"],"related":["mech:single-source-compiler","mech:location-as-data","mech:incident-to-guard","mech:storefront-qr-bridge"]}
trigger: "Klient mówi 'każda zmiana wymiaru to przerysowanie od nowa', 'drukarnia odesłała pliki z błędami' albo brief dotyczy powtarzalnej produkcji fizycznej (oklejenia kolejnych lokali, standy, boardy) z twardymi wymogami (wymiary, linie cięcia, działające QR)."
context: "Klienci sieciowi i produktowi z powtarzalnym formatem fizycznym (retail, fitness, deweloperzy, eventy) — tam, gdzie rodzina artefaktów wraca (kolejne kluby, kolejne standy) i zwraca koszt setupu. Wymaga procesu, w którym pliki produkcyjne mogą iść z renderu, nie z DTP."
anti_context: "Nie stosować do one-off kreacji wizerunkowej, gdzie dominuje eksploracja estetyczna — setup parametryczny się nie zwróci, a kod spowalnia iterację stylu. Ryzyko przy assetach żyjących poza repo (drift plików źródłowych) i przy braku kroku weryfikacji finalnego pliku — narzędzia potrafią cicho psuć output ('wygląda ok')."
inputs: ["Wymiary fizyczne i specyfikacja drukarni (spady, linie cięcia, format plików)","Jawna skala jednostkowa zadeklarowana na starcie (np. 1 cm = 10 px)","Assety brandu w repo (logo, fonty z rozwiązanym embedowaniem, kolory)","Treści per artefakt/lokalizacja jako config (COPY, BOARDS)","Elementy do weryfikacji programowej (QR z docelowymi URL-ami, kolory)"]
ai_tasks: ["Zbudowanie artefaktu jako HTML+CSS z parametrycznym configiem","Render headless Chrome do plików produkcyjnych we właściwej skali","Programowa weryfikacja finalnego pliku (QR czytany segno, linie cięcia, wymiary)","Przeliczenie całego projektu przy zmianie configu (nowe wymiary, nowa lokalizacja)","Rozwiązanie fontów raz (mapa substytutów + base64) jako komponent reużywalny"]
human_tasks: ["Przemek-decyzja: akcept wizualny wyrenderowanych plików przed wysyłką do drukarni","Klient: dostarczenie wymiarów witryn/nośników i akcept projektu","Podwykonawca/drukarnia: weryfikacja techniczna pierwszego kompletu (kalibracja procesu)"]
expected_outcome: "Nowy artefakt z rodziny (kolejny klub, kolejny stand) powstaje przez zmianę configu bez otwierania narzędzia graficznego — mierzalnie: czas od wymiarów do plików produkcyjnych w godzinach, zero poprawek drukarni z tytułu błędów technicznych, QR zweryfikowany programowo na finalnym pliku."
evidence: [{"id":"ev:design-as-code-001","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"zdrofit-lodygowa-witryny — artboardy.html + render.sh + potnij.py: oklejenie 3 witryn klubu z liniami cięcia i programową weryfikacją QR","mechanism":"mech:design-as-code","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:design-as-code-002","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"kubota-stand-3d — build.py składający stand 3D z dielinów w CSS, ?plate= do renderów; zero bibliotek","mechanism":"mech:design-as-code","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:design-as-code-003","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"twojemenu-case-study — boardy portfolio 1440×1080 składane CSS-em zamiast w Figmie","mechanism":"mech:design-as-code","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:design-as-code-004","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"umowy-podwykonawcy — dokumenty prawne jako kod z build pipeline (ten sam mechanizm na innym typie artefaktu)","mechanism":"mech:design-as-code","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:design-as-code-bt-osada-orle-brand-system-figma","type":"backtest","date":"2026-08-09","source":"rec:backtests/osada-orle-brand-system-figma","note":"(bt#T2) Wariant variables-first zrealizowany dokładnie wg karty: prymitywy 50–900 (Granat/Mosiądz/Las/Papier) + mody semantyczne Dzień/Noc, Noc jako osobny motyw a nie inwersja — rdzeń sukcesu projektu | Zmiana: +evidence typu postmortem; opisać w karcie wariant figma-variables-as-tokens (zmienne Figmy jako źródło tokenów bez eksportu)","mechanism":"mech:design-as-code","project":"proj:osada-orle-brand-system-figma","independence_key":"proj:osada-orle-brand-system-figma::rec:backtests/osada-orle-brand-system-figma"},{"id":"ev:design-as-code-bt-archicom-tokeny-rebrand-atrium","type":"backtest","date":"2026-08-09","source":"rec:backtests/archicom-tokeny-rebrand-atrium","note":"(bt#T2) Programowy restyle cicho zepsuł output dwiema klasami nieznanymi Genome: dublowanie glifów (tekst istnieje równolegle jako TEXT i wektory z eksportu PDF/InDesign) oraz cichy fallback niedostępnego fontu Pretty Var→Inter (loadFontAsync fail); bt-05 trafiło klai | Zmiana: +failure_condition w karcie: (1) pliki z importu formatów niosą zdublowany tekst-jako-wektor — sweep przed restylem; (2) parytet środowiska fontów — check dostępności fontu docelowego przed masową sub","mechanism":"mech:design-as-code","project":"proj:archicom-tokeny-rebrand-atrium","independence_key":"proj:archicom-tokeny-rebrand-atrium::rec:backtests/archicom-tokeny-rebrand-atrium"},{"id":"ev:design-as-code-bt-archicom-prezenter-reymonta","type":"backtest","date":"2026-08-09","source":"rec:backtests/archicom-prezenter-reymonta","note":"(bt#T2) Produkcja w Figmie (okładka + 4 rozkładówki 2×A3), zero HTML/build/katalogu kodu — bt-03 miss | Zmiana: Anti-context w karcie: replika/kontynuacja artefaktu print (A3, rozkładówki, rodzina DTP) → narzędzie wizualne; design-as-code dla digital-first i generacji wolumenowej","mechanism":"mech:design-as-code","project":"proj:archicom-prezenter-reymonta","independence_key":"proj:archicom-prezenter-reymonta::rec:backtests/archicom-prezenter-reymonta"},{"id":"ev:design-as-code-bt-zdrofit-cwicz-w-zieleni","type":"backtest","date":"2026-08-09","source":"rec:backtests/zdrofit-cwicz-w-zieleni","note":"(bt#T2) Mechanizm użyty punktowo (render fontu z kodu, arc.py) ale nie w zakresie rekomendacji — A4 300 dpi wykonany tą samą ścieżką clone+rescale co digital, bez renderu z kodu i programowej weryfikacji | Zmiana: Dopisać do karty rozróżnienie 'design-as-code jako obejście punktowe vs jako pipeline'; follow-up jakości druku po 21.08","mechanism":"mech:design-as-code","project":"proj:zdrofit-cwicz-w-zieleni","independence_key":"proj:zdrofit-cwicz-w-zieleni::rec:backtests/zdrofit-cwicz-w-zieleni"},{"id":"ev:design-as-code-bt-lemf-deck-figma","type":"backtest","date":"2026-08-09","source":"rec:backtests/lemf-deck-figma","note":"(bt#T2) Człon 'weryfikacja na finalnym wyrenderowanym artefakcie' bez śladu wykonania — 4 slajdy (1/6/7/20) bez zdjęć wiszą ≥2 tygodnie po FINAL; font-map-first wykonany poprawnie | Zmiana: Dopisek: weryfikacja finału wymaga jawnego właściciela i definicji DONE; bez podbicia confidence","mechanism":"mech:design-as-code","project":"proj:lemf-deck-figma","independence_key":"proj:lemf-deck-figma::rec:backtests/lemf-deck-figma"},{"id":"ev:design-as-code-lumo-brand","type":"backtest","date":"2026-08-08","source":"rec:backtests/lumo-brand","note":"Cala estetyka zbudowana programowo w Figma plugin API (mesh-gradient z 5 rozmytych plam radialnych z LAYER_BLUR ~100, createStar, corner ticks, redakcyjny grid 58px, deterministyczny wzor modulow QR (i*j+i*5+j*3)%4 jawnie bez Math.random) — wbrew zawezeniu Routera 'estetyka NIE w kodzie' i wbrew anti_context karty; jednoczesnie jedyny czlon przepisany przez Router (programowa weryfikacja QR na finalnym eksporcie) nie powstal wcale. | Zmiana: Dopisac tryb scripted-canvas (plugin API narzedzia projektowego = pelnoprawny design-as-code) i skorygowac Warunki sukcesu: kryterium oplacalnosci to deterministycznosc konstrukcji, nie wolumen artefaktow. Flaga wrong-boundary w anti_context, evidence typu postmortem, bez zmiany confidence. [dowód: memory/lumo-brand.md, sesja ~20.07.2026 (spec konstrukcji per node) + proj:lumo-brand, update 2026-08-08 (status archived, brak pliku produkcyjnego)]","mechanism":"mech:design-as-code","project":"proj:lumo-brand","independence_key":"proj:lumo-brand::rec:backtests/lumo-brand"}]
tags: ["design","frontend","ops"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---

## Problem

Produkcja graficzna w narzędziach DTP nie skaluje się i nie jest weryfikowalna: zmiana wymiaru witryny lub treści oznacza ręczne przerysowanie, a błędy (niedziałający QR, złe linie cięcia) wykrywa dopiero drukarnia albo klient.

## Mechanizm działania

Projekt graficzny jest programem: HTML+CSS z jawną, zadeklarowaną skalą jednostkową (1 cm = 10 px; 10 j. = 1 cm) renderowanym headless Chrome do plików produkcyjnych. Bo artefakt jest kodem, dostaje trzy własności niedostępne w DTP: parametryczność (zmiana configu przelicza cały projekt), weryfikację programową (QR czytany moduł po module przez segno na FINALNYM pliku) i diffowalność w gicie. Rezultat: produkcja wielkoformatowa/3D z gwarancjami jakości zamiast czujności.

## Warunki sukcesu

- Jawna skala jednostkowa zadeklarowana raz, na początku — bez niej render do druku jest loterią
- Weryfikacja odbywa się na finalnym wyrenderowanym pliku, nie na źródle (lekcja QR)
- Rodzina artefaktów jest powtarzalna (kolejne kluby, kolejne standy) — jednorazowy artefakt nie zwraca kosztu setupu

## Warunki porażki

- Fonty niedostępne w środowisku renderu — bloker rozwiązywany za każdym razem inaczej (Aptly→fontTools→SVG, base64 przeciw CSP, mapy substytutów) zamiast raz
- Drift plików źródłowych: przeterminowany tyl.svg na Desktopie w kubota — 'projekt jako kod' nie chroni, gdy assety żyją poza repo
- Narzędzia cicho psujące output (PIL zabija alpha, minifikator psuje JS) — bez kroku weryfikacji failure mode to 'wygląda ok'

## Potencjał automatyzacji

Wysoki: wspólny toolkit render (headless Chrome + skala + linie cięcia + weryfikator QR/kolorów) jako pakiet; pipeline 'config nowej lokalizacji → komplet plików do drukarni' bez sesji projektowej; font-resolver (mapa substytutów + base64) jako jednorazowo rozwiązany komponent.

## Transfer

Wysoki dla klientów sieciowych i produktowych (retail, fitness, deweloperzy — każdy z powtarzalnym formatem fizycznym); definiuje produkt 'oklejenia sieciowe jako usługa parametryczna'. Słaby dla one-off kreacji wizerunkowej, gdzie dominuje eksploracja.

## Eksperyment · Benefit/Zdrofit

Przy najbliższym otwarciu klubu wykonać oklejenie witryn WYŁĄCZNIE przez zmianę configu (BOARDS + COPY + wymiary witryn nowej lokalizacji) w kodzie z Łodygowej, bez otwierania narzędzia graficznego. Zmierzyć: czas od otrzymania wymiarów do plików produkcyjnych, liczbę poprawek drukarni, wynik programowej weryfikacji QR.

**Czego się dowiemy:** Dowiemy się, czy 'nowy klub w godzinę' jest realny na drugiej lokalizacji (pierwsza replikacja = prawdziwy test parametryczności) i co w configu było jednak przybite do Łodygowej — to wprost definiuje produkt parametrycznych oklejeń sieciowych.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
