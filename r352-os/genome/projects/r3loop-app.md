---
id: "proj:r3loop-app"
type: "project"
title: "r3loop.app (Briefly) — automatyzacja strategia + proposal"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "wewnętrzny (r352/Inleadia; pierwszy realny case: TeamBudget/BetterWorkplace, umówiony pilot kliencki)"
domain: "automation-infra"
relations: {}
tags: ["pre-genome"]
---

## Problem

3 z 7 etapów lejka (Strategy v1, Strategy v2, Proposal) wymagały ręcznego pisania i wstrzykiwania JSON-ów do bazy przez REST; brak automatycznego generatora oznaczał, że każdy nowy lead kosztował godziny pracy stratega.

## Cel

Internal operating system agencji: klient sam wypełnia brief, maszyna generuje strategię i wycenę, a Przemek zostaje tylko jako QA i decydent — skrócenie cyklu ofertowego z dni do godzin i zdjęcie z niego pisania strategii ręcznie.

## Status przy imporcie

LIVE na produkcji od 12.07.2026; ocena własna ~8050/10000; przed pilotem do domknięcia: weryfikacja domeny w Resend, kasowanie testowych briefów, przejście pełnej ścieżki

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
