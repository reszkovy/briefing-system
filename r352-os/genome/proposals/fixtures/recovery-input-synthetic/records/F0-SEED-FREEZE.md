---
id: "rec:F0-SEED-FREEZE"
type: "record"
title: "Granica seeda F0 — wersjonowana walidacja historii"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["governance","migracja"]
seed_ledger_file: "events-2026-08.jsonl"
seed_event_count: 205
seed_tail_hash: "3eafbaef9cb6e223"
last_seed_event_id: "evt:2026-08-09-0226"
migration: "mig:2026-08-evidence-contract-v1"
---

## Po co ta granica

Pierwsze **205** zdarzeń Ledgera (ostatnie: `evt:2026-08-09-0226`) powstało przed zaostrzeniem kontraktu payloadu i przed wprowadzeniem walidacji chronologii. Historia Ledgera jest niezmienna, więc braki NIE są uzupełniane wstecz — są raportowane jako ostrzeżenia. Kontrakt obowiązuje bezwzględnie od pierwszego zdarzenia PO tej granicy.

## Znane defekty seeda (zaraportowane, nienaprawiane)

- Braki wymaganych pól payloadu: **38**
- Naruszenia chronologii: **2** — zdarzenia zapisane z ręcznym timestampem wyprzedzającym czas systemowy; kolejność w pliku NIE jest zmieniana.

## Czego ta karta NIE robi

Nie zwalnia z kontraktu zdarzeń nowych: zdarzenie nr **206** i każde kolejne podlega pełnemu kontraktowi niezależnie od daty w ID. Granica jest POZYCYJNA (liczba zdarzeń + hash linii `3eafbaef9cb6e223`), nie leksykograficzna — dopisanie lub podmiana czegokolwiek w oknie seeda unieważnia ulgę i cały Ledger wraca pod pełny kontrakt. Nie legalizuje duplikatów Event ID — te są korygowane jawnie (`corrected_from_id`).
