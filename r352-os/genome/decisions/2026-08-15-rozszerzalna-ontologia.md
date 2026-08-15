---
id: "dec:2026-08-15-rozszerzalna-ontologia"
type: "decision"
title: "Zniesienie zakazu rozszerzania ontologii; rejestr typów jako jedno źródło; typ council"
status: "decided"
created: "2026-08-15"
updated: "2026-08-15"
version: 1
owner: "przemek"
relations: {"related":["rule:rozszerzanie-ontologii","wf:council"]}
tags: ["genome","ontology","decision"]
---

## Decyzja

**Zakaz rozszerzania ontologii zostaje zdjęty.** W jego miejsce wchodzi bramka wejścia
(`rule:rozszerzanie-ontologii`): cztery pytania na piśmie, bez zgody i bez czekania.

Wraz z tym:

- rejestr typów przeniesiony do `ontology/types.json` jako **jedyne źródło prawdy**;
- dodany typ `council:` (katalog `council/`, cykl `analyzed → decided → resolved | void`);
- `wf:council` przemapowany z Recordów na własny typ.

## Dlaczego zakaz był błędny

Nie dlatego, że był zbyt ostrożny. Dlatego, że **leczył nie tę chorobę**.

Ryzykiem nie było rozszerzanie ontologii, tylko duplikacja rejestru: lista typów istniała
w trzech ręcznie utrzymywanych kopiach — `TYPES` w `build.js`, `TYPE_DIR` i `PREFIX_DIR`
w `ingest.js`, oraz zaszyty zbiór `SHOW` w widoku Grafu. Rozjazd między nimi nie dawał
żadnego sygnału aż do błędu zapisu, a dodanie typu wymagało znalezienia wszystkich trzech.
Zakaz był obejściem tego długu, przebranym za zasadę epistemiczną.

Po scaleniu rejestru koszt dodania typu spadł do jednego wpisu w JSON-ie, a widok Grafu
uczy się typów z danych zamiast je znać. Wtedy zakaz przestaje mieć jakiekolwiek uzasadnienie.

## Co zostaje z dawnej ostrożności

Jedna rzecz, warta zachowania: **nie tworzymy dwóch nazw na to samo**. To nie jest teoria,
tylko nota z historii tego systemu. Dlatego pierwsze pytanie bramki brzmi „który istniejący
typ tego nie unosi i co konkretnie traci" — i wymaga wskazania typu po nazwie.

Oraz prawo do cofnięcia: typ, który po 90 dniach ma zero albo jeden obiekt, wraca pod pytanie.

## Odpowiedzi bramki dla typu `council`

**1. Który typ tego nie unosi?** `record`. Cykl `created → superseded` nie ma stanu
„rozstrzygnięta", więc narada nie wie, czym się skończyła.

**2. Własny cykl życia?** Tak: `analyzed → decided → resolved | void`. Trzy różne momenty,
trzech różnych właścicieli — analityk, właściciel decyzji, rozliczający predykcję.

**3. Jakie pytanie stanie się możliwe?** „Ile narad doczekało się rozstrzygnięcia predykcji
i jak wypadła kalibracja Councilu w podziale na role." Na Recordach niepoliczalne.
To jest jedyna rzecz odróżniająca Council od dobrego promptu.

**4. Kto tworzy, kto zamyka?** Tworzy sesja prowadząca naradę (`/genome-council`).
Zamyka `resolution_owner` predykcji, wskazany z imienia przy rejestracji zakładu.
