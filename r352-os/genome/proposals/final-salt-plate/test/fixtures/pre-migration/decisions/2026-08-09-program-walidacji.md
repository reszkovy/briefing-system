---
id: "dec:2026-08-09-program-walidacji"
type: "decision"
title: "Program walidacji Genome: min. 30 backtestów historycznych projektów"
status: "decided"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
question: "Czy zatrzymać rozwój architektury i przeznaczyć najbliższe tygodnie na falsyfikację Genome na projektach historycznych?"
options: ["kontynuować triale na żywo i czekać na dowody", "program walidacji: 30+ backtestów T0 → predykcje → porównanie → Evidence → aktualizacje Genome"]
choice: "program walidacji: 30+ backtestów T0 → predykcje → porównanie → Evidence → aktualizacje Genome"
decided: "2026-08-09"
relations: {"related": ["dec:2026-08-08-plan-90-dni"]}
tags: ["governance", "walidacja"]
---

## Dyspozycja CEO (08/09.08.2026, pełny tekst w sesji)

Stop dla architektury. Cel: znaleźć miejsca, w których Genome się myli — „celem programu jest zbudowanie Genome, któremu można ufać". Sukces = jakość wiedzy, nie liczba dokumentów; usunięcie połowy mechanizmów też jest sukcesem.

## Zastrzeżenia CTO wpisane do programu (obowiązek roli: kwestionować)

1. **Hindsight:** wykonawca zna wyniki projektów historycznych → backtesty NIE liczą Briera i nie mieszają się z żywymi predykcjami (pred: tylko dla przyszłości). Metryka backtestu = mechanism-fit accuracy + listy miss/wrong + „czego Genome nie wiedział".
2. **Cyrkularność:** karty destylowano z tych projektów → leave-one-out: przy backteście projektu X pomija się evidence karty pochodzące z X.
3. **Spójność z v2:** „symulacja" odrzucona w GENOME-OS-V2 dotyczyła symulowania PRZYSZŁOŚCI; retro-postmortem na rzeczywistych wynikach jest źródłem Evidence typu postmortem — nie łamie tamtej decyzji ani bramki dokumentów architektury (to egzekucja, nie architektura).

## Skutek

Protokół: `records/backtests/PROTOKOL.md`. Wyniki per projekt: `records/backtests/<projekt>.md` + eventy w Ledgerze. Zmiany kart WYŁĄCZNIE przez Evidence. Po ≥30: analiza całościowa (7 pytań CEO) + werdykty VALIDATED/do usunięcia.
