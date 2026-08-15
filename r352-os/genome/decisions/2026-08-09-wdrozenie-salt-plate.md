---
id: "dec:2026-08-09-wdrozenie-salt-plate"
type: "decision"
title: "Wdrożenie warstwy strategicznej SALT/PLATE i kontraktów Research/Measurement"
status: "decided"
owner: "przemek"
relations: {}
tags: ["strategia","wdrozenie"]
created: "2026-08-09"
updated: "2026-08-09"
version: 1
---

## Kontekst

Genome pamiętało, że strategia powstała, ale nie potrafiło odtworzyć rozumowania, które ją stworzyło. Katalog workflows/ był pusty — warstwa procesu nie miała reprezentacji.

## Opcje

1. **Nic nie robić** — wiedza operacyjna zostaje w HTML-u klienta i w głowie właściciela.
2. **SALT/PLATE jako mechanizmy** — wymagałoby udawania pojedynczego expected_outcome i Evidence-per-użycie.
3. **Trzy obiekty: 2 workflow + 1 mechanizm-claim** — procedury jako Workflow, falsyfikowalny claim z confidence jako Mechanism. ← WYBRANE

## Uzasadnienie

Ontologia F0 definiuje Workflow jako nazwaną sekwencję kroków z bramkami orkiestrującą mechanizmy — to dosłownie SALT i PLATE. Confidence i Evidence żyją wyłącznie na mech:strategy-before-execution, bo build waliduje je tylko dla typu mechanism; na karcie workflow byłyby niekontrolowanym drugim stanem wiedzy.

Próby na sucho na 5 projektach historycznych: 2 razy odmowa z zapisanym powodem, 3 razy realna zmiana decyzji zakresowej. 176 testów zielonych, kanon nietknięty.

## Czego decyzja NIE obejmuje

- awansu mechanizmu na validated (zostaje emerging, wyłącznie backtesty o kierunkach neutral i limits),
- zmiany słownika RELATION_KEYS (krawędź requires → wf:salt fałszowałaby alternatywę fundamentu),
- recovery incydentu 09.08 — osobna transakcja, wykonywana PRZED tym wdrożeniem.
