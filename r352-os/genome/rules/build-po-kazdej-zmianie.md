---
id: "rule:build-po-kazdej-zmianie"
type: "rule"
title: "Po każdej zmianie w genome/ ZAWSZE node build.js — widoki aktualizują się same"
status: "active"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"related": ["rule:knowledge-via-events"]}
tags: ["governance"]
---

Dyspozycja Przemka 08.08.2026 („to się musi automatycznie nadpisywać" / „zapisz, żeby te rzeczy działy się automatycznie"): żadnego ręcznego kopiowania danych do widoków.

**Mechanika (wbudowana w build.js):** każdy `node r352-os/genome/build.js` nadpisuje `dist/` ORAZ `genome-os/js/genome-f0-data.js` (dane viewera). Dane niosą frontmatter + `body` kart + otwarte predykcje + ostatnie zdarzenia Ledgera.

**WSZYSTKIE zakładki są kanoniczne (stabilizacja MVP 09.08):** Dziś, Router, Genome, Projekty, Graf, Eksperymenty, Klienci, CTO czytają wyłącznie `window.GENOME_DATA`. Dodanie kontekstu (nowa karta, evidence, event, predykcja) + build = wszystkie ekrany aktualne, bez dotykania kodu. `genomeos-data.js` zawiera WYŁĄCZNIE dane operacyjne (radar / azymut / priorytety / bottlenecks) — nigdy kopii mechanizmów, projektów, confidence, relacji ani liczników.

**Obowiązek sesji:** każda sesja, która dotknęła `genome/` (nowy obiekt, event w ledgerze, edycja karty), kończy pracę wywołaniem `node build.js` i sprawdzeniem „0 błędów". Zmiana bez builda = wiedza niewidoczna w systemie = wykonana źle.

**Podgląd (gotcha sandboxa):** preview server nie czyta ~/Desktop — kopia serwująca genome-os żyje w scratchpadzie sesji; po buildzie `rsync -a --delete genome-os/ <scratchpad>/genome-os-serve/`. Task dzienny r352-cko-daily też wykonuje build po swoich appendach do ledgera.

**Jawny dług (F1, po werdykcie z triali):** ekran „Dziś" viewera nadal schodzi z legacy `genomeos-data.js` (stan 07.08) — docelowo ma schodzić z ledgera F0 jak projekty i graf.

## Version
- v1 · 2026-08-08 — z dyspozycji CEO po wykryciu, że Trial #002 nie pojawił się na macierzy.
