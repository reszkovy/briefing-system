---
id: "cap:project-postmortem"
type: "capability"
title: "Skill /project-postmortem — Learning Engine v2 (analityk, nie writer)"
status: "available"
created: "2026-08-08"
updated: "2026-08-08"
version: 2
owner: "przemek"
relations: {"related": ["cap:mechanism-router"]}
tags: []
---

## Kontrakt

Learning Engine **analizuje i proponuje**. Nie zapisuje.

```
ANALYZE → PROPOSE → HUMAN APPROVAL → DETERMINISTIC INGEST → BUILD → AUDIT
```

Skill (`/project-postmortem`) produkuje wyłącznie: analizę, Draft Postmortem (`status: proposed`), Proposed Genome Delta i Proposed Event Bundle (bez `id`, `ts`, `prev_hash`). Każda pozycja oznaczona `PROPOSED — REQUIRES HUMAN APPROVAL`.

Zapis wykonuje deterministyczny writer `node r352-os/genome/ingest.js <pakiet.json>` po zatwierdzeniu przez człowieka. Writer nadaje ID i timestampy, liczy hash-chain, przelicza `evidence_strength`, robi dedupe strukturalną, waliduje i **cofa całość (rollback) przy dowolnym błędzie**.

## Czego skill NIE robi (zmiana względem v1)

Wersja 1 instruowała: „ZAKTUALIZUJ Genome — karty mechanizmów, confidence, INDEX, graf, pamięć". To było **niebezpieczne**: analityk z prawem zapisu może w jednym ruchu podnieść confidence na podstawie własnej narracji. Od v2 zabronione jest:
- zapisywanie kart i Ledgera,
- nadawanie finalnych ID / `prev_hash`,
- zmiana `confidence` i statusów,
- oznaczanie `validated` / `disproven` / `deprecated`,
- tworzenie aktywnych Rule / Guard / SOP / Mechanism,
- zamykanie projektu,
- ręczna aktualizacja grafu (graf kompiluje build.js).

## Progi i limity (egzekwowane maszynowo)

- `validated` wymaga ≥3 Evidence, z ≥2 różnych `project`, w tym ≥1 **żywego** `measurement`/`postmortem`. Retro-`backtest`, `narrative` i `intention` progu NIE spełniają.
- Maksymalnie **3 lekcje** na projekt (rule:compression-over-documentation). Zero lekcji = poprawny wynik (`NO_GENOME_DELTA`).
- Słownik Evidence: `measurement | postmortem | narrative | backtest | intention`.

## Version

- v2 · 2026-08-08 — rozdzielenie analityka od writera; skill = Learning Engine v2, zapis wyłącznie przez `ingest.js` z bramką approval. Powód: v1 pozwalał aktualizować Genome bez zatwierdzenia i bez progu dowodowego.
- v1 · 2026-08-08 — pierwsza wersja (skill aktualizował Genome bezpośrednio).
