---
id: "exp:single-source-compiler-test"
type: "experiment"
title: "Test: Single-Source Compiler"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:single-source-compiler"]}
on_note: "Benefit/Zdrofit"
tags: []
---

## Projekt testu

Wziąć jedną rodzinę szablonową briefów z wolumenu ~100/mies. (np. grafiki otwarcia klubu / oferty lokalne), zbudować jedno źródło danych kampanii (JSON: klub, daty, ceny, CTA) i compiler generujący komplet formatów ze słownika formatów briefsync. Zmierzyć na 10 kolejnych realnych briefach: czas brief→komplet kreacji do walidacji oraz liczbę błędów spójności (data/cena/nazwa klubu) vs baseline ręczny. Równolegle: brand-check na 'BS Fitness — Biblioteka Produkcyjna v1' raportujący wartości spoza brand.json (baseline dryfu).

## Czego się dowiemy

Dowiemy się, jaki procent wolumenu Benefit jest 'kompilowany' (szablonowy) vs wymaga kreacji, ile realnego dryfu jest w produkcji ręcznej, i czy compiler redukuje czas o rząd wielkości — twarde dane do wyceny pilotażu narzędzia do briefowania i decyzji o budowie kanonicznego mini-SSG.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
