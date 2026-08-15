---
id: "rec:F0-SEED-FREEZE"
type: "record"
title: "Granica seeda F0 — wersjonowana walidacja historii"
status: "created"
created: "2026-08-09"
updated: "2026-08-10"
version: 3
owner: "przemek"
relations: {}
tags: ["governance","migracja"]
seed_ledger_file: "events-2026-08.jsonl"
seed_event_count: 179
seed_tail_hash: "4f96034058f4c5fa"
last_seed_event_id: "evt:2026-08-08-0126"
migration: "mig:2026-08-evidence-contract-v1"
---

## Po co ta granica

Pierwsze **179** zdarzeń Ledgera (ostatnie: `evt:2026-08-08-0126`) powstało przed zaostrzeniem
kontraktu payloadu i przed wprowadzeniem walidacji chronologii. Historia Ledgera jest niezmienna,
więc braki NIE są uzupełniane wstecz — są raportowane jako ostrzeżenia. Kontrakt obowiązuje
bezwzględnie od pierwszego zdarzenia PO tej granicy.

## Dlaczego granica wróciła z 205 na 179

09.08 warstwa testowa wywołała migrację na kanonicznym korzeniu i przesunęła granicę na 205.
Recovery tego samego dnia przywróciło 179 / `4f96034058f4c5fa` ze zamrożonego fixture'u.
Szczegóły: `rec:incydenty/2026-08-09-test-zapisal-do-kanonu`. Do 10.08 treść tej karty nadal
mówiła o 205 zdarzeniach i haszu `3eafbaef9cb6e223`, czyli o stanie, który już nie istniał.

## Znane defekty seeda

Liczby defektów raportuje `build.js` przy każdym przebiegu (ostrzeżenia: braki wymaganych pól
payloadu, naruszenia chronologii). Karta ich **nie duplikuje** — duplikat rozjeżdża się przy
pierwszej zmianie granicy i to jest dokładnie to, co się tu wydarzyło. Jedno źródło prawdy:
raport buildu.

## Czego ta karta NIE robi

Nie zwalnia z kontraktu zdarzeń nowych: zdarzenie nr **180** i każde kolejne podlega pełnemu
kontraktowi niezależnie od daty w ID. Granica jest POZYCYJNA (liczba zdarzeń + hash linii
`4f96034058f4c5fa`), nie leksykograficzna — dopisanie lub podmiana czegokolwiek w oknie seeda
unieważnia ulgę i cały Ledger wraca pod pełny kontrakt. Nie legalizuje duplikatów Event ID —
te są korygowane jawnie (`corrected_from_id`).
