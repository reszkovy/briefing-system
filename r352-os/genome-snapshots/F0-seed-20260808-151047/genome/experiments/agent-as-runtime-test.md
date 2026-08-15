---
id: "exp:agent-as-runtime-test"
type: "experiment"
title: "Test: Agent-as-Runtime"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:agent-as-runtime"]}
on_note: "Benefit/Zdrofit"
tags: []
---

## Projekt testu

Rozciąć pipeline briefsync Trello→Figma na dwie warstwy i zmierzyć granicę: przenieść wszystko, co się da, na Figma REST API z PAT (tworzenie plików/stron, upload obrazów), zostawiając agenta wyłącznie dla operacji niedostępnych w REST. Przez 2 tygodnie logować: ile operacji/tydzień wykonała warstwa bez sesji vs agentowa, ile transferów przepadło, bo sesja nie żyła, czas odtworzenia po uśpieniu.

## Czego się dowiemy

Dowiemy się, jaki procent 'trzeciej nogi' jest nią naprawdę, a jaki jest tylko długiem migracyjnym — czyli czy hourly pipeline Zdrofit może działać bezobsługowo, czy strukturalnie wymaga okna żywej sesji. To określa, czy mechanizm wolno sprzedawać jako 'automatyzację', czy jako 'usługę asystowaną'.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
