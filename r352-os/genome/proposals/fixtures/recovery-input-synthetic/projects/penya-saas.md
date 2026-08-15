---
id: "proj:penya-saas"
type: "project"
title: "Penya SaaS — onboarding penyi FC Barcelona"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "Pilot: Penya Blaugrana de Łódź #2327 (realny klient, kontakt przez właściciela 9campnou); docelowo SaaS dla penyi na świ"
domain: "produkty"
relations: {}
source_path: "~/Desktop/penya Public Landing Page (repo: README/SETUP/SPRINT/guidelines + dist)"
tags: ["pre-genome"]
---

## Problem

Stara rekrutacja penyi = mail z danymi osobowymi (w tym numerem dowodu) + ręczny przelew i ręczna księgowość zarządu; brak samoobsługi, automatyki statusów, panelu członka i zgodnego z RODO przepływu danych.

## Cel

Produkt SaaS do onboardingu członków fanklubów FC Barcelona: samoobsługowa rekrutacja, płatności i panel członka; pilot Łódź jako case study „before/after" i podstawa sprzedaży innym penyom (architektura multi-tenant od pierwszego dnia).

## Status przy imporcie

LIVE na penyalodz.vercel.app; Supabase podłączony, realne dane 165 rekordów sezonu 25/26 zaimportowane, panel admina produkcyjny; Sprint B (płatności online) zakodowany — czeka na dane konta P24/KYC od zarządu penyi; cutover DNS po UAT.

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
