---
id: "exp:negative-knowledge-ledger-test"
type: "experiment"
title: "Test: Negative Knowledge Ledger"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:negative-knowledge-ledger"]}
on_note: "BetterWorkplace/DailyFruits"
tags: []
---

## Projekt testu

Założyć jawny ledger negatywny dla ekosystemu DailyFruits/betterguide (znane pułapki: Vercel scope, GTM/Usercentrics, drift klonów repo, limity formularzy) jako plik w repo + wpis pamięci. Przez 6 tygodni logować każdy przypadek, gdy diagnoza problemu zaczęła się od trafienia w ledger vs od ponownego odkrywania. Metryka: hit-rate ledgera i szacowany czas zaoszczędzony per trafienie; dodatkowo test transferu — czy wpis w repo (nie w auto-memory) zostaje znaleziony przez świeżą sesję.

## Czego się dowiemy

Dowiemy się, jaki odsetek incydentów na dojrzałym kliencie to recydywa znanych problemów oraz czy ledger w repo (dostępny podwykonawcom) działa równie dobrze jak auto-memory — to rozstrzyga, gdzie powinna mieszkać wiedza negatywna sprzedawana klientom.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
