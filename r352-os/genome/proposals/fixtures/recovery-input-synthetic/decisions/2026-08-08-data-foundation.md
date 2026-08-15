---
id: "dec:2026-08-08-data-foundation"
type: "decision"
title: "Akceptacja ontologii Data Foundation (z 4 korektami) + downgrade proven"
status: "decided"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "przemek"
question: "Czy przyjąć ontologię 19 obiektów i zapłacić koszt epistemiczny downgrade'u wszystkich proven?"
options: ["przyjąć bez zmian", "przyjąć z korektami", "odrzucić i przeprojektować"]
choice: "przyjąć z korektami"
decided: "2026-08-08"
relations: {}
tags: ["ontology"]
---

## Uzasadnienie (CEO)

„To jest właściwy koszt epistemiczny. Nie chronimy wcześniejszych ocen systemu.”

## Korekty

1. `proven` → `validated` (proven sugeruje prawdę zamkniętą; przy decay nic nie jest udowodnione na zawsze).
2. Fakt obejmuje zdarzenia wewnętrzne: `knowledge.corrected` / `knowledge.reclassified` / `ontology.changed` — nikt nie poprawia rzeczywistości po cichu.
3. Signal first-class tylko z cyklem życia observed→investigated→linked|dismissed; powiadomienie = Event.
4. +3 niezmienniki: no evidence without provenance · no prediction without resolution · no confidence double-counting.

## Konsekwencja

Downgrade 16 kart proven→emerging (cały Evidence = narracja ze skanu; brak measurement/postmortem). Freeze obowiązuje: żadnych nowych obiektów ani silników bez potrzeby wykazanej danymi.

## Następny test systemu

Pierwszy realny przebieg: Decision → Event → Evidence → Knowledge Update.
