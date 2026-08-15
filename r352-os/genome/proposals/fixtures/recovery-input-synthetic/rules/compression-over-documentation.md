---
id: "rule:compression-over-documentation"
type: "rule"
title: "Kompresja ponad dokumentację — maks. 3 lekcje na projekt"
status: "active"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"related":["rule:zero-manual-admin"]}
tags: ["governance","meta-rule"]
ingest_note: "META-RULE CEO: limit 3 lekcje / 1-2 mechanizmy na projekt; zero lekcji = poprawny wynik."
---

Dyrektywa CEO 09.08.2026 (META-RULE Rule 6 + brief MVP Rule 5): Genome nie jest archiwum ani pamiętnikiem. Pełny projekt zostaje w źródłach; do aktywnego Genome wchodzi maksymalnie:

- **3 lekcje** na projekt,
- **1–2 nowe mechanizmy** na projekt.

**Test wejścia (pytanie kontrolne):** „Czy ta informacja zmieni zachowanie systemu przy kolejnym podobnym projekcie?" Jeśli nie — nie wchodzi. Lekcja kwalifikuje się wyłącznie, gdy zmienia: decyzję, trigger, anti-context, failure_condition, wycenę, workflow, bramkę, Rule, Guard, SOP, sposób pomiaru lub resolution contract.

**Odrzucane wprost:** wnioski generyczne („komunikacja mogła być lepsza", „trzeba lepiej planować", „projekt był trudniejszy niż zakładaliśmy") — to nie są lekcje, to jest szum.

**Konsekwencja dla postmortemu:** Learning Engine generuje 0–3 lekcje. ZERO lekcji jest poprawnym wynikiem (werdykt NO_GENOME_DELTA) — wymuszanie lekcji przy słabym evidence psuje Genome szybciej niż jej brak.

## Version
- v1 · 2026-08-09 — z META-RULE; limit egzekwowany w skillu /project-postmortem.
