---
id: "proj:dailyfruits-consent-gtm"
type: "project"
title: "Consent / GTM — architektura zgód i analityki"
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

Strona miała zdublowany consent (własny banner + Usercentrics przez GTM), DWA kontenery GTM, trackery (LinkedIn, Amplitude, Matomo) strzelające przed zgodą i niejasną architekturę GA4 w rodzinie marek BW; baner consent psuł też lab LCP.

## Cel

Zgodny z RODO mechanizm zgód spójny z resztą marek Better Workplace oraz uporządkowana, niezdublowana analityka — bez zabijania wyników Core Web Vitals.

## Status przy imporcie

Wdrożone po stronie kodu (custom banner usunięty, lazy-start analytics, UC-early loader); otwarte po stronie klienta: decyzja o kontenerze GTM-5B7HN67B, allowlist domen w Usercentrics, consent-gating tagów FB/LinkedIn w GTM

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
