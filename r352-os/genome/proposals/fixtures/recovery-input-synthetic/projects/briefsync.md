---
id: "proj:briefsync"
type: "project"
title: "briefsync — router feedbacku Trello↔Figma↔Dropbox + most do Obsidiana"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "wewnętrzny (obsługa podwykonawczyni Natalii Baranieckiej i 8 tablic klienckich: Benefit/Zdrofit, Geers/Sonova, Archicom,"
domain: "automation-infra"
relations: {}
tags: ["pre-genome"]
---

## Problem

Feedback klientów żyje w komentarzach Trello, produkcja w Figmie, gotowe pliki na Dropboxie — ręczne przenoszenie briefów, komentarzy i załączników między trzema narzędziami pochłaniało czas i gubiło kontekst (co nowe, co zaktualizowane, co zamknięte).

## Cel

Zdjąć z Przemka rolę dyspozytora feedbacku między klientami (Trello), podwykonawcami (Figma) i plikami (Dropbox) — zadania i komentarze mają same trafiać tam, gdzie pracuje wykonawca, a stan projektów sam lądować w 'Personal OS' w Obsidianie.

## Status przy imporcie

DZIAŁA produkcyjnie: codzienny sync launchd 8:00 (daily.log żywy do 07.08), tryb wielotablicowy 8 tablic → 39+ briefów w Obsidianie; gałąź Dropbox→Trello niedokończona (brak access/refresh tokena)

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
