---
id: "proj:dailyfruits-relaunch"
type: "project"
title: "Relaunch dailyfruits.pl (WordPress → statyczny + Vercel)"
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

Stary WordPress był wolny i nieelastyczny, a migracja groziła utratą SEO — 291 starych URL-i wymagało obsłużenia; ~95 stron HTML bez systemu współdzielenia komponentów groziło rozjazdem treści.

## Cel

Zastąpienie starej strony nginx/WordPress szybką stroną statyczną z pełną kontrolą nad kodem, SEO i deployem, bez utraty ruchu organicznego przy migracji.

## Status przy imporcie

LIVE — cutover wykonany 03.07.2026, każdy push na main = produkcja; odłożone: a11y na życzenie, odchudzenie repo 2.4 GB

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
