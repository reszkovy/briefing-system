---
id: "proj:zdrofit-hourly-pipeline"
type: "project"
title: "Hourly pipeline Trello→Figma (automatyzacja briefów Benefit/Zdrofit)"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "Benefit Systems / Zdrofit"
domain: "zdrofit-benefit"
relations: {}
tags: ["pre-genome"]
---

## Problem

12–15 osób briefujących, mediana lead time 1 dzień; ręczne przenoszenie briefów z Trello i odtwarzanie layoutów od zera przy każdym zadaniu to główny pożeracz czasu produkcji.

## Cel

Zdjąć z Reszka główny koszt operacyjny obsługi ~100 briefów/mies.: automat co godzinę czyta nowe karty Trello, klasyfikuje i generuje wstępne kreacje on-brand w Figmie, a Reszek tylko waliduje spójność przed dalszą produkcją.

## Status przy imporcie

Cel zdefiniowany 04.07.2026, przed uruchomieniem — prerekwizyty (biblioteka masterów, walidacja) w toku, pętla cron dopiero po pilotażu wakacyjnym i akcepcie Reszka.

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
