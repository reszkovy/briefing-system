---
id: "rule:zero-manual-admin"
type: "rule"
title: "Zero ręcznej administracji danymi — człowiek decyduje, maszyna zapisuje"
status: "active"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"related":["rule:build-po-kazdej-zmianie","rule:knowledge-via-events"]}
tags: ["governance","meta-rule"]
ingest_note: "META-RULE CEO: Genome nie moze wymagac administracji przez zalozyciela. Egzekucja: ingest.js."
---

Dyrektywa CEO 09.08.2026 (META-RULE): największym ryzykiem Genome nie jest brak funkcji, lecz to, że stanie się kolejnym obowiązkiem operacyjnym założyciela. System, który wymaga heroicznej dyscypliny, umiera po trzech miesiącach.

**Podział ról (nienegocjowalny):**
- CZŁOWIEK: kierunek strategiczny, ważne decyzje, ocena jakości, zatwierdzenie zmian wiedzy, finalny osąd.
- AI/SYSTEM: ekstrakcja, formatowanie, tworzenie obiektów, relacje, walidacja struktury, drafty, wykrywanie wzorców.

**Zakaz ręcznej administracji:** Przemek NIE tworzy ręcznie YAML, JSONL, frontmatter, ID, relacji, eventów ani wpisów evidence. Jeśli system tego wymaga — to defekt projektowy, nie zadanie dla człowieka. Dotyczy TAKŻE sesji Claude: od 09.08 zapis do Genome idzie wyłącznie przez `node ingest.js` (hash-chain, ID, liczniki, dedupe liczone maszynowo), nigdy przez ręczne sklejanie plików.

**Przepływ:** naturalne wejście (nota, mail, rozmowa, Slack) → agent-skryba → draft obiektów → walidacja → akceptacja człowieka → ingest → build → wiedza.

**Kryterium jakości:** nie „ile mamy wiedzy", lecz „czy koszt dodania kolejnej lekcji jest na tyle niski, że system przetrwa 100 projektów".

## Version
- v1 · 2026-08-09 — META-RULE od CEO; egzekucja: ingest.js jako jedyna droga zapisu.
