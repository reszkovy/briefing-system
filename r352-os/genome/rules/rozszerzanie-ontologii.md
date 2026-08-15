---
id: "rule:rozszerzanie-ontologii"
type: "rule"
title: "Ontologia jest rozszerzalna — przez bramkę, nie przez zakaz"
status: "active"
created: "2026-08-15"
updated: "2026-08-15"
version: 1
owner: "przemek"
category: "Ontology"
relations: {"related":["prin:single-source-of-truth","prin:reduce-subjectivity"],"enforces":["ax:uczenie-przez-decyzje"]}
tags: ["genome","ontology"]
---

## Zasada

**Ontologia jest rozszerzalna.** Blokowanie elementu, który jest zdecydowanym ulepszeniem,
jest błędem — system ma rosnąć mądrze, a nie stać w miejscu, bo tak jest bezpieczniej.

Poprzednia reguła brzmiała „ontologii nie rozszerzasz" i była zła z dwóch powodów.
Po pierwsze, zamrażała listę wymyśloną w jeden dzień na podstawie tego, co wtedy było znane.
Po drugie — i ważniejsze — **maskowała prawdziwy problem**, którym nie było rozszerzanie,
tylko duplikacja: rejestr typów istniał w trzech ręcznie utrzymywanych kopiach
(`build.js`, `ingest.js`, widok Grafu). To dlatego dodanie typu wyglądało na ryzykowne.
Rejestr jest teraz jeden (`ontology/types.json`) i dodanie typu to jeden wpis.

## Bramka: cztery pytania, na piśmie

Nowy typ przechodzi, jeśli da się odpowiedzieć na wszystkie cztery. Odpowiedzi lądują
w polu `added[]` w `ontology/types.json` i w Decision — żeby za rok dało się zrozumieć,
czemu ten typ istnieje.

**1. Który istniejący typ tego nie unosi i co konkretnie traci?**
Trzeba wskazać typ po nazwie i nazwać stratę. „Byłoby czyściej" nie jest stratą.
Przykład dobrej odpowiedzi: narada Councilu zapisana jako Record ma cykl
`created → superseded`, więc nie ma stanu „rozstrzygnięta" i track record Councilu
staje się niepoliczalny.

**2. Czy ma własny cykl życia?**
Jeśli proponowane statusy są takie same jak statusy istniejącego typu, to nie jest nowy typ,
tylko kategoria w starym. Wtedy odpowiedzią jest pole, nie typ.

**3. Jakie pytanie o system będzie można zadać po dodaniu, którego dziś zadać się nie da?**
Pytanie musi być policzalne. Jeśli nie da się go zapisać jako zapytania do danych,
typ nie zarabia na swoje utrzymanie.

**4. Kto tworzy obiekty tego typu i kto je zamyka?**
Typ bez nazwanego zamykającego produkuje obiekty, które żyją wiecznie w stanie otwartym.

## Prawo do cofnięcia

Po **90 dniach** typ z zerem albo jednym obiektem wraca pod pytanie, czy nie był przedwczesny.
Wycofanie typu jest normalną operacją, nie porażką — rozszerzalność bez odwracalności
to tylko wolniejsze zamrażanie.

## Czego bramka NIE robi

Nie wymaga zgody, narady ani czekania. Jedna osoba odpowiada na cztery pytania i dodaje wpis.
Bramka istnieje po to, żeby po roku nie było czterdziestu typów, z czego połowa to synonimy —
to jest udokumentowane ryzyko z historii tego systemu (nota CEO: „nie tworzymy dwóch nazw
na to samo"), nie hipotetyczne.

## Jak dodać typ

1. Wpis w `ontology/types.json`: `dir`, `prefix`, `statuses`, `graph`, `label`.
2. Wpis w `added[]`: data, ID decyzji, odpowiedź na pytanie 1.
3. Katalog `<dir>/`.
4. Decision z odpowiedziami na cztery pytania.
5. `node build.js --check` — zero błędów.
6. `node test/run-canon-tests.js` — zero FAIL.

Kroki 5 i 6 nie są formalnością: rejestr czytają trzy różne miejsca i test jest jedynym
dowodem, że nadal czytają to samo.
