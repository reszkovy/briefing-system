---
id: "proj:narzedzie-do-briefowania"
type: "project"
title: "Narzędzie do briefowania (regional.fit / Club Manager Briefing System)"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "produkt pod Benefit Systems (buyer: Group Marketing Manager; pilot 20 lokalizacji, pricing 50-100k PLN)"
domain: "automation-infra"
relations: {}
tags: ["pre-genome"]
---

## Problem

W sieciach typu Benefit/Zdrofit briefy z klubów są niekompletne, niezgodne ze strategią marki i przechodzą przez chaotyczny mailowy obieg akceptacji; walidator nie ma narzędzia do oceny jakości i zgodności briefu na skalę 20+ lokalizacji.

## Cel

SaaS-owe narzędzie briefowania dla sieci fitness multi-location: club manager składa brief, walidator ocenia zgodność ze strategią marki, produkcja dostaje kolejkę zadań — sprzedawane jako pilot 50-100k PLN.

## Status przy imporcie

MVP zbudowany (kod z pełną strukturą wg BUILD_SPEC, w src/lib są już pliki llm-auditor/embeddings/llm-config); plan 10-tygodniowy do pilot-ready spisany; ostatnie commity dot. approvals, delay costs i compact mode — projekt aktywny

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
