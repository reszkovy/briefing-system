---
id: "proj:medium-publishing-pipeline"
type: "project"
title: "Pipeline publikacji Medium (r352 Journal → Medium)"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "wewnętrzny (content marketing r352)"
domain: "automation-infra"
relations: {}
tags: ["pre-genome"]
---

## Problem

Ręczne wklejanie artykułów na Medium gubi canonical (kara SEO za duplicate content), importer Medium psuje tekst (145 samowolnych em-dashy w jednym artykule, doklejany sufiks tytułu), a tagowanie i cover przez UI są zawodne przy klikaniu syntetycznym.

## Cel

Syndykacja artykułów z r352.com/journal na Medium bez utraty SEO (canonical) i bez ręcznej, błędogennej roboty formatowania — budowa zasięgu treści przy minimalnym udziale Przemka (jego klik = tylko Publish).

## Status przy imporcie

DZIAŁA — sprawdzony na 2 draftach (07.2026); sezon publikacji zaplanowany w PUBLISHING-PLAN.md, kadencja środa 9:00 CET + LinkedIn companion

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
