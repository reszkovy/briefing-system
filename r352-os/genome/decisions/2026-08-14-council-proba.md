---
id: "dec:2026-08-14-council-proba"
type: "decision"
title: "Council wchodzi jako ręczna próba na 5 decyzjach, z warunkiem wyjścia"
status: "decided"
created: "2026-08-14"
updated: "2026-08-15"
version: 1
owner: "przemek"
relations: {"related":["wf:council"]}
tags: ["genome","decision"]
---

## Decyzja

Council wchodzi do Genome jako `wf:council` w statusie `draft` i przechodzi **ręczną próbę
na pięciu prawdziwych decyzjach**. Bez automatyzacji, bez widoku w tablicy, bez skilla
uruchamianego odruchowo.

## Warunek wyjścia — zapisany, żeby nie dało się go przemilczeć

Po piątej decyzji rozstrzygnięcie jest obowiązkowe i ma trzy możliwe wyniki:

- **`active`** — jeśli co najmniej trzy z pięciu Councilów wskazały rzecz, której właściciel
  nie miał w głowie przed naradą, ORAZ co najmniej dwie predykcje zostały rozliczone jako
  HIT albo MISS.
- **przerobienie** — jeśli Council daje wartość, ale format jest za drogi względem tej wartości.
- **`deprecated`** — jeśli żadna predykcja z Councilu nie została rozliczona. Wtedy mechanizm
  nie ma jak się uczyć i jest kosztownym rytuałem.

## Dlaczego warunek jest właśnie taki

Cała przewaga Councilu nad dobrym promptem siedzi w dwóch ostatnich członach sekwencji:
outcome i kalibracja. Reszta — pięć ról, scorecard, peer critique — jest wykonalna w każdym
czacie w dziesięć minut.

Stan faktyczny na dziś: **9 predykcji zarejestrowanych, 3 zamknięte, zero rozstrzygniętych
jako HIT albo MISS**, jedna dwa dni po terminie. To nie jest przewidywanie problemu, tylko
odczyt z Ledgera. Council dokłada predykcje do systemu, który jeszcze ani razu nie zamknął
żadnej z nich rzeczywistością.

Dlatego warunkiem życia mechanizmu jest nie jakość analiz, tylko to, czy ktokolwiek wraca
do zakładów po terminie.
