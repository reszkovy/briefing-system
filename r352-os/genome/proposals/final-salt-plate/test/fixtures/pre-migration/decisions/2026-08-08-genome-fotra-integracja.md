---
id: "dec:2026-08-08-genome-fotra-integracja"
type: "decision"
title: "Integracja Genome×FOTRA: dane tak, interfejsy nie"
status: "decided"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "przemek"
question: "Czy i jak integrować Genome z FOTRA?"
options: ["scalić interfejsy", "integracja na poziomie danych (3 szwy)", "nie integrować"]
choice: "integracja na poziomie danych; fuzja interfejsów bez sensu"
decided: "2026-08-08"
relations: {}
tags: ["architecture", "f1-backlog"]
---

## Uzasadnienie

FOTRA = kokpit dnia, Genome OS = mózg firmy — różne pytania, różne rytmy. Fuzja UI odtworzyłaby chorobę „magazynu widoków" (audyt FOTRA). Zasada 10 lat: interfejsy tanieją, dane drożeją.

## Zakres (pierwsze pozycje F1, wejście PO werdykcie z 3 triali)

1. **Jedno źródło danych:** build.js emituje jedno `genome-data.js`; FOTRA System czyta graf z niego; w `fotra-kg-data.js` zostaje tylko warstwa operacyjna (radar, azymut). Likwiduje 3. i 4. kopię prawdy (aksjomat 5).
2. **Tablica 4 wskaźników w FOTRA Daily** (build już liczy — `dist/METRICS.md`).
3. **Most nawigacyjny:** zakładka System = podgląd (azymut+radar+tablica) + przycisk „otwórz Genome OS".

## Warunek

Freeze obowiązuje — realizacja po 3 trialach, chyba że CEO jawnie wyjmie pojedynczy szew (najtańszy: tablica w Daily).
