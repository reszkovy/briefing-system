---
id: "exp:incident-to-guard-test"
type: "experiment"
title: "Test: Incident-to-Guard Codification"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:incident-to-guard"]}
on_note: "Benefit/Zdrofit"
tags: []
---

## Projekt testu

W przygotowywanym hourly pipeline wprowadzić pętlę: każda kreacja odrzucona przez Reszka w walidacji dostaje przyczynę z zamkniętej listy, a każda przyczyna występująca ≥2 razy MUSI zostać zamieniona w regułę klasyfikatora/pre-check przed generacją (guard). Mierzyć tygodniowo: odsetek odrzuceń per przyczyna, liczbę dodanych reguł, oraz czy odrzucenia z przyczyn 'zguardowanych' spadają do ~0 i nie wracają.

## Czego się dowiemy

Dowiemy się, jaka część feedbacku walidatora w ogóle daje się skompilować do reguł (granica automatyzowalności uczenia się na wolumenie ~100 briefów/mies.) i jak szybko pipeline osiąga plateau jakości — to wprost krzywa uczenia się organizacji, którą można pokazać buyerowi Benefit jako produkt. Bonus: to jest jednocześnie brakująca w całym systemie pętla feedbacku człowiek→maszyna.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
