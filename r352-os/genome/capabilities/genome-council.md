---
id: "cap:genome-council"
type: "capability"
title: "Skill /genome-council"
status: "available"
created: "2026-08-15"
updated: "2026-08-15"
version: 1
owner: "przemek"
relations: {"related":["wf:council"],"implements":["prin:reduce-subjectivity"]}
tags: ["strategy","genome"]
---

Wykonawca procedury `wf:council`. Pięć niezależnych modeli jednej decyzji, peer critique,
synteza Chairmana, scorecard 10×5 i obowiązkowa predykcja.

Każdy advisor leci jako osobny subagent — izolacja nie jest optymalizacją, tylko warunkiem
sensu: advisor widzący cztery poprzednie analizy produkuje wariant tamtych, nie piąty model.

**Nie podejmuje decyzji.** Produkuje `council:<slug>` w statusie `analyzed` i Decision
w statusie `open` z pustym polem decyzji właściciela.

Status: ręczna próba na 5 decyzjach (`dec:2026-08-14-council-proba`).
