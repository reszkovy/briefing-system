---
id: "proj:stock-photo-sources"
type: "project"
title: "Wiedza o źródłach stockowych (komponent infrastruktury researchu obrazów)"
status: "archived"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
client_note: "wewnętrzny (komponent wielokrotnego użytku; pierwszy case: zdjęcia 33 polskich miast w stocki-miasta/)"
domain: "automation-infra"
relations: {}
tags: ["pre-genome"]
---

## Problem

Automatyczny research zdjęć rozbija się o niejawne ograniczenia źródeł: semantyczne wyszukiwarki zwracają złe miasta zamiast pustki, CDN-y blokują hotlinki (403), popularne API odrzucają ruch ze środowiska agenta (401/307), a limity i niestabilne endpointy timeoutują — bez tej wiedzy każdy projekt odkrywa to od zera.

## Cel

Jednorazowo zmapować, które stocki da się przeszukiwać automatycznie z Claude Code i jak, żeby każdy kolejny projekt wymagający zdjęć (landingi, decki, case studies) korzystał z gotowej ścieżki zamiast ręcznego przeklikiwania stocków.

## Status przy imporcie

Zmapowane i zweryfikowane 08.2026, zapisane jako pamięć referencyjna + działający pipeline harvest→scoring→galeria w stocki-miasta/

_Import ze skanu CKO 07.08 — projekty historyczne wchodzą jako `archived` (nie przechodziły przez Router). Nowe prace = świeże obiekty przez Router._
