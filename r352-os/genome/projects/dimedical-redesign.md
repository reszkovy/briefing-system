---
id: "proj:dimedical-redesign"
type: "project"
title: "DiMedical — redesign serwisu (case sprzedażowy)"
status: "archived"
created: "2026-08-07"
updated: "2026-08-14"
version: 2
owner: "przemek"
client_note: "DiMedical / Centrum Medycyny Klinicznej, Łódź (projekt spekulacyjny, bez zlecenia — Reszek projektował oryginał, więc ma"
domain: "sales-cases"
relations: {"uses":["mech:static-i18n-mirror"]}
source_path: "Narzedzie do briefowania/dimedical-redesign (UWAGA: ~/Dimedical jest PUSTY — nie używać)"
tags: ["pre-genome"]
---

## Problem

Oryginalny serwis ciężki (867 KB CSS+JS vs ~110 KB w redesignie, assety 11 MB vs 1,4 MB) i przestarzały wizualnie; potrzebny namacalny dowód jakości zamiast slajdów ofertowych.

## Cel

Case do sprzedaży podobnej usługi redesignu serwisów medycznych — ścieżka: publikacja jako własny koncept, potem pitch do DiMedical.

## Status przy imporcie

LIVE na dimedical.vercel.app (Lighthouse desktop 100/100/100/100, mobile 95/100/96/100); 38 stron (19 PL + 19 EN), pokrycie merytoryki 86%; zostało: backend formularza, strona case przed/po, podmiana zdjęć AI na realne.

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
