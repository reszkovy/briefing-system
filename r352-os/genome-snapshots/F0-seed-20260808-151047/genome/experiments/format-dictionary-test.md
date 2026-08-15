---
id: "exp:format-dictionary-test"
type: "experiment"
title: "Test: Format Dictionary"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:format-dictionary"]}
on_note: "Sonova/Geers"
tags: []
---

## Projekt testu

Test transferu słownika na drugiego klienta wolumenowego: wziąć historyczne karty z tablicy Geers/Sonova w briefsync (dane już zebrane), zbudować z nich słownik formatów metodą ze Zdrofitu i zmierzyć: (a) jaki % briefów Geers klasyfikuje się do skończonych rodzin szablonowych, (b) ile rodzin pokrywa 80% wolumenu, (c) które rodziny pokrywają się ze słownikiem Zdrofit (część wspólna = kandydat na słownik bazowy produktu).

## Czego się dowiemy

Dowiemy się, czy kompresja przez słownik jest własnością KLIENTA (Zdrofit ma nietypowo szablonowy miks) czy MECHANIZMU (rozkład gruboogonowy powtarza się u drugiego klienta wolumenowego). Jeśli drugie — mamy zmierzony argument, że Narzędzie do briefowania z rodzinami szablonowymi jest produktem multi-klienckim, i wiemy, jaki % słownika jest uniwersalny vs per-brand, zanim zbudujemy multi-tenant.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
