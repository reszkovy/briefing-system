---
id: "rec:backtests/betterworkplace-salt-plate"
type: "record"
title: "Backtest — SALT/PLATE w BetterWorkplace (rekonstrukcja Fazy 1+2)"
status: "created"
owner: "przemek"
relations: {"attached_to":["proj:betterguide-hub"],"related":["wf:salt","wf:plate","mech:strategy-before-execution"]}
tags: ["walidacja","strategia","bw-origin"]
created: "2026-08-09"
updated: "2026-08-09"
version: 1
---


# Backtest — SALT/PLATE w BetterWorkplace

**Typ dowodu: `backtest` (rekonstrukcja historyczna).** Nie jest to żywy pomiar ani rozliczony postmortem. Zgodnie z protokołem walidacji: nie liczy się do progu `validated` i nie wchodzi do metryki „zweryfikowane żywym dowodem".

## Co ustalono ze źródeł

Źródło pierwotne: `~/Desktop/Claude_zadania/BetterWorkplace/BW_Strategia_Klient.html` (dokument klienta, Faza 1 i 2, kwiecień–maj 2026) oraz szablony operacyjne w `FrameWorkProdukty/r352-framework/szablony/{strategia/SALT.md, brand/PLATE.md}`.

- Faza 1 prowadzona **metodologią SALT**, 6 deliverables: architektura marek, karty ról, narracja i przekaz, matryca komunikacji, mapa ścieżek, plan wdrożenia.
- Faza 2 zawiera jawną sekcję **P.L.A.T.E. Framework** — plan komunikacji na zatwierdzonym fundamencie z Fazy 1.
- Kolejność w dokumencie jest kierunkowa: diagnoza → deliverables strategiczne → dopiero komunikacja. Zgodne z bramką wejścia `wf:plate`.
- Dokument formułuje tezę operacyjną: „strategia to nie plan, to sposób myślenia" — czyli zestaw reguł decyzyjnych, nie artefakt na półkę.

## Czego NIE da się z tego wywnioskować (ograniczenia)

1. **Brak delty wskaźników klienta.** Dokument opisuje proces i deliverables, nie zawiera pomiaru przed/po. Nie wiemy, czy pozycja rynkowa BW się zmieniła.
2. **Nie wiadomo, które odkrycia były hipotezami.** Szablon SALT wymaga statusu ZWALIDOWANE/HIPOTEZA — w materiale nie ma śladu, czy ta bramka była egzekwowana.
3. **Nie wiadomo, ile decyzji zakresowych zmieniła diagnoza.** To jest właśnie `expected_outcome` mechanizmu — i jest nierozstrzygnięte.
4. **Ryzyko potwierdzenia:** rekonstrukcję robi ta sama firma, która framework stosowała.

## Wniosek dowodowy

Wykazana jest **wykonalność procedury end-to-end** na realnym kliencie — nie jej skuteczność. Kierunek dowodu: `supports` dla istnienia i kompletności procedury, `neutral` dla claimu o poprawie wyników.
