---
id: "proj:dailyfruits-cms-v6"
type: "project"
title: "CMS v6 — panel /admin (git jako backend)"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "DailyFruits / Better Workplace"
domain: "dailyfruits"
relations: {}
tags: ["pre-genome"]
---

## Problem

Strona statyczna nie miała żadnego CMS, a stary panel parsował strukturę HTML sprzed ~389 commitów i pokazywał puste treści; klient potrzebował edycji tekstów, zdjęć, 53 kart produktów, menu i bloga.

## Cel

Umożliwić nietechnicznej osobie u klienta samodzielną publikację wpisów i edycję treści strony statycznej — bez developera, bez tradycyjnego CMS i bez ryzyka rozjechania strony.

## Status przy imporcie

LIVE na dailyfruits.pl/admin (v6 kompletny: Blog/Strony/Produkty/Menu/Kosz/Historia); pipeline docx→AI→blog świadomie odłożony na wyraźną prośbę klienta

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
