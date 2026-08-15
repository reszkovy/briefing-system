---
id: "cap:triage-signal"
type: "capability"
title: "Skill /triage-signal"
status: "available"
created: "2026-08-15"
updated: "2026-08-15"
version: 1
owner: "przemek"
relations: {"related":["cap:mechanism-router"],"enforces":["rule:rozszerzanie-ontologii"]}
tags: ["genome"]
---

Bramka wejściowa Genome: klasyfikuje surowy sygnał z `inbox/` i decyduje, czy zasługuje
na wejście do kanonu.

Produkuje raport i przy werdykcie `PROPOSE` pakiet w `pending/`. **Nigdy nie zapisuje
do kanonu** i nigdy nie tworzy Evidence — Evidence wchodzi wyłącznie przez backtest albo
postmortem, gdzie ma kontekst całego przebiegu i człowieka nad sobą.

Cztery werdykty: `PROPOSE` · `ARCHIVE` · `ASK_OWNER` · `REJECT`.

Mierzy dystans wnioskowania (0 cytat → 3 spekulacja); `≥2` nie może dać klasy `fact`.
