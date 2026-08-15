---
id: "mech:presale-demand-ledger"
type: "mechanism"
title: "Presale Demand Ledger"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-08"
version: 2
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":4,"projects":3,"types":{"measurement":0,"postmortem":2,"narracja":2},"last_confirmed":"2026-08-08"},"recommendation":"test-first"}
category: "Funnel Mechanics"
relations: {"implements": ["prin:proof-before-promise"], "related": ["mech:location-as-data-funnels", "mech:storefront-qr-bridge", "mech:dated-commitment-gates", "mech:numeric-gates"]}
trigger: "Klient mówi: 'otwieramy nowy klub/lokalizację za X miesięcy', 'produkt będzie gotowy na jesień', 'marketing odpalimy na otwarcie'. Cechy problemu: produkt/lokalizacja jeszcze nie istnieje, a lokalny popyt przepada; decyzje o kolejności otwarć/skali premiery podejmowane bez danych."
context: "Firmy z fizyczną ekspansją (sieci fitness, deweloperzy, retail) lub premierami produktowymi, gdzie między decyzją a otwarciem mija kilka miesięcy. Najlepiej przy powtarzalnym produkcie (kolejne lokalizacje tego samego konceptu) i istniejącym silniku landingów per lokalizacja."
anti_context: "Nie stosować, gdy data otwarcia jest wysoce niepewna (obietnica pierwszeństwa bez daty pali zaufanie), gdy nie ma backendu do zbierania zapisów (formularz bez endpointu = front bez księgi), ani gdy klient chce mieszać CTA nieistniejącego produktu z istniejącym — uczciwość obietnicy jest sednem mechanizmu."
inputs: ["Lista lokalizacji/premier w pipeline z datami otwarcia", "Definicja obietnicy pierwszeństwa (np. okno 48h, tiery founding members) — nie rabatu", "Backend zbierania zapisów (endpoint, CRM/ESP) działający przed startem", "Dane lokalizacji do landingu (miasto z fleksją, adres, data, zdjęcia)", "Plan domknięcia: co dostaje lista w dniu startu"]
ai_tasks: ["Generacja landingu przedsprzedażowego per lokalizacja z silnika danych (nowe miasto = nowy plik JSON)", "Implementacja formularza, tierów founding i countdownu", "Raportowanie zapisy/sesje per lokalizacja jako dane decyzyjne", "Przygotowanie sekwencji domknięcia listy w oknie pierwszeństwa"]
human_tasks: ["Klient: potwierdzenie dat otwarcia i treści obietnicy (odpowiada za jej dotrzymanie)", "Przemek-decyzja: kształt obietnicy pierwszeństwa i granica 'nie obiecujemy niczego, czego nie ma'", "Klient: decyzje sterowane księgą (kolejność otwarć, skala premiery)"]
expected_outcome: "Mierzalna księga popytu per lokalizacja (zapisy/sesje) przed otwarciem oraz konwersja listy na płacących w oknie pierwszeństwa w dniu startu — czyli znana wartość jednej pozycji na liście i dane do decyzji o kolejnych otwarciach."
evidence: [{"id":"ev:presale-demand-ledger-001","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"fitstyle-platform: lejek 4 — landing /przedsprzedaz/{miasto} + pigułka w cenniku dla miast bez klubu, formularz inline, prototyp Rybnika działa end-to-end; zaplanowana faza B: tiery founding + countdown"},{"id":"ev:presale-demand-ledger-002","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"teambudget-gtm-hub: premiera na Better Minds HR X.2026 zbramkowana liczbą pilotaży (bramka 15.09: ≥12 / 6–11 / <6 = trzy scenariusze premiery) — popyt przedpremierowy jako dane decyzyjne, nie tylko leady"},{"id":"ev:presale-demand-ledger-bt-zdrofit-lodygowa-witryny","type":"postmortem","date":"2026-08-09","source":"rec:backtests/zdrofit-lodygowa-witryny","note":"(bt#T2) QR prowadzi na dedykowaną podstronę klubu, ale bez parametru źródła; landing i analityka po stronie klienta — księga popytu per witryna niemierzalna | Zmiana: Precondition w karcie: kontrola nad landingiem/analityką LUB parametr źródła uzgodniony z klientem w bramce briefu"},{"id":"ev:presale-demand-ledger-caterelo","type":"postmortem","date":"2026-08-08","source":"rec:backtests/caterelo","note":"Plan zdobycia liczby popytowej istnial, byl precyzyjny i mial date werdyktu — i nie wystartowal, bo jego jedyny prerekwizyt byl aktem u zewnetrznego gatekeepera; rownolegle przedmiot testu byl darmowy. | Zmiana: Rozszerzyc trigger karty: data startu to rowniez 'konczy sie darmowy dostep', nie tylko 'otwieramy X za kilka miesiecy'. Nowe hipotezy mech:gatekeeper-lead-time i mech:one-price-one-test. [dowód: caterelo-sprint2-extension-wedge.md (05-18.07.2026): 'Definicja sukcesu wedge'a: >=3 placace osoby z src=ext/reddit/hn/fb ORAZ >=80 installs ORAZ >=1 click-to-Stripe', zaleznosc P0 'CWS go-live verification'. Rownolegle src/hooks/use-premium.js: OPEN_BETA od 11.06 do 31.08 zwraca isPremium=true dla wszystkich. memory 07.08: 'zero przychodu w historii projektu'.]"}]
tags: []
---

## Problem

Produkt lub lokalizacja jeszcze nie istnieje (klub w budowie, produkt przed premierą), a popyt w tym czasie przepada — marketing rusza dopiero na otwarcie, gdy koszt pozyskania jest najwyższy, a pierwszeństwo nie ma już wartości.

## Mechanizm działania

Zanim istnieje produkt, stawiasz dedykowany landing przechwytujący popyt na obietnicę pierwszeństwa, nie zniżki (motywacja persony Marcin z FitStyle: '48 godzin przed resztą miasta', data otwarcia, nazwa miasta w nagłówku). Lista zapisów staje się księgą popytu: mierzalnym dowodem zainteresowania per lokalizacja, który steruje decyzjami (kolejność otwarć, skala premiery). Kluczowa uczciwość mechanizmu: nie obiecywać niczego, czego nie ma (na landingu przedsprzedażowym FitStyle celowo NIE ma CTA darmowej wizyty, bo klubu jeszcze nie ma). Domknięcie = tiery founding members i countdown otwierające okno sprzedaży przed otwarciem fizycznym.

## Warunki sukcesu

- Obietnica oparta o pierwszeństwo i konkret (data, nazwa miasta w H1), nie o rabat
- Landing nie obiecuje niczego, co nie istnieje — brak CTA produktowych z 'normalnego' lejka
- Zapisy/sesje mierzone per lokalizacja i traktowane jako dane decyzyjne (gdzie otwierać, jak skalować premierę)
- Zdefiniowane domknięcie: co dostaje lista, gdy produkt startuje (okno 48h, tier founding)

## Warunki porażki

- Formularz bez wpiętego endpointu — front gotowy, ale zapisy nie trafiają nigdzie (stan FitStyle przed wpięciem backendu: ENDPOINT pusty = tryb prototypu)
- Mieszanie CTA nieistniejącego produktu z istniejącym (obiecanie darmowej wizyty w klubie, którego nie ma) — pali zaufanie na starcie relacji
- Lista zebrana, ale brak zaprojektowanego momentu konwersji listy → sprzedaż; zapis zostaje martwym kontaktem jak leady z gated contentu

## Potencjał automatyzacji

Wysoki: nowe miasto = nowy plik JSON w silniku location-as-data; countdown i tiery jako komponenty szablonu; automatyczne raportowanie zapisy/sesje per miasto do decyzji o otwarciach.

## Transfer

Każdy klient z fizyczną ekspansją lub premierą produktu: sieci fitness na GymManagerze (produkt powtarzalny), Archicom (przedsprzedaż inwestycji deweloperskiej to ten sam mechanizm), premiery produktowe BetterWorkplace.

## Eksperyment · FitStyle

Wpiąć backend leadów (GetResponse) i uruchomić fazę B na Rybniku: dwa warianty landingu — A: sama lista zapisów, B: lista + tiery founding z countdownem do otwarcia. Ruch z lokalnej reklamy dzielony 50/50, po otwarciu klubu mierzymy konwersję listy na karnet w oknie 48h pierwszeństwa.

**Czego się dowiemy:** Czy pierwszeństwo (tier + countdown) realnie podnosi zapisy/sesje i — ważniejsze — konwersję listy na płacących w dniu otwarcia; jaki procent księgi popytu monetyzuje się w karnety, czyli ile naprawdę warta jest jedna pozycja na liście.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
