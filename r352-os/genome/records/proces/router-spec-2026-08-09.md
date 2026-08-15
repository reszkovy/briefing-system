---
id: "rec:proces/router-spec-2026-08-09"
type: "record"
title: "Specyfikacja procesu Routera — wersja z bramkami fazowymi (10 sekcji)"
status: "created"
owner: "przemek"
relations: {}
tags: ["proces","router","spec"]
created: "2026-08-09"
updated: "2026-08-09"
version: 1
---

# Specyfikacja procesu Routera — 2026-08-09

Record istnieje, bo zmiana `ROUTER.md` musi mieć **własny** obiekt w Genome. Wcześniejsza wersja pakietu wdrożeniowego rejestrowała ją jako `object.updated` na `rec:F0-SEED-FREEZE` — karta granicy seeda nie ma nic wspólnego z procesem Routera i była fikcyjnym targetem.

## Co ta wersja ustala

- kolejność: Brief → Research → SALT → PLATE → mechanizmy → Doublecheck → Measurement → Project Contract → podpisane GO,
- **bramki fazowe**: `researchGate()` przed SALT, `foundationGate()` przed PLATE, `contractGate()` dopiero przed GO — wymaganie kontraktu przed diagnozą było cyrkularne,
- szablon raportu: 9 → **10 sekcji** (nowa sekcja 5 „Warstwa strategiczna" z tabelą briefu strukturalnego, łącznie z polami `null`),
- fundament dla PLATE to **alternatywa**: podpisany wynik `wf:salt` albo świeże (≤12 mies.) sprawdzalne odniesienie do istniejącej strategii — dlatego w grafie nie ma krawędzi `requires → wf:salt`,
- zgoda = podpis Ed25519 obejmujący fazę, nonce, termin ważności, pełny Project Contract i `payload_hash`; weryfikuje ją warstwa zapisu pod blokadą.

## Czego NIE ustala

Treści domenowej frameworków (żyje w `workflows/salt.md` i `workflows/plate.md`) ani reguł routingu (żyją w `lib/strategy-frameworks.js`).
