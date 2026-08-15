---
id: "proj:wegobold-site"
type: "project"
title: "wegobold.com — marka produktowa (repositioning + restyle)"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "Własny (wegobold = siostrzana marka produktowa r352 dla MŚP)"
domain: "sales-cases"
relations: {}
tags: ["pre-genome"]
---

## Problem

Dwie marki o celowo podobnych usługach trzeba rozdzielić po grupie docelowej i problemie (JTBD), nie po liście usług — tak, by właściwy kupujący sam się selekcjonował.

## Cel

Druga brama modelu hub-and-spoke: wegobold = produkty i wdrożenia dla MŚP (projekty od ~30k), r352 = proces i retainery korpo (od ~20k); spoki (inleadia, hanoi) dowożą leady z atrybucją per źródło.

## Status przy imporcie

Repositioning i restyle 'benchmark' zrobione (index produktu ~6850/10000 vs r352 ~8030); PROD wegobold.com wciąż przekierowuje do r352 do czasu vercel deploy --prod; najsłabsze: social proof, SEO (SPA bez SSR).

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
