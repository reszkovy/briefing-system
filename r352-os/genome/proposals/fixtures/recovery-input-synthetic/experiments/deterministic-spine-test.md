---
id: "exp:deterministic-spine-test"
type: "experiment"
title: "Test: Deterministic Spine"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:deterministic-spine"]}
on_note: "Benefit/Zdrofit (Narzędzie do briefowania)"
tags: []
---

## Projekt testu

Wykorzystać nieużyty korpus 39 realnych briefów z briefsync: przepuścić każdy brief przez trzy konfiguracje (sam policy-engine / +Haiku reasoning / +Sonnet semantic alignment), a wyniki ocenić w ślepym teście przez Reszka i Natalię (użyteczność dla walidatora, skala 1–5). Zmierzyć deltę jakości między warstwami oraz realny koszt per brief w każdej konfiguracji vs cap.

## Czego się dowiemy

Dowiemy się, gdzie leży punkt nasycenia jakości (czy Haiku wystarcza do reasoning; ile realnej wartości decyzyjnej dokłada warstwa semantyczna ponad darmowe reguły — czyli czy $0.05/brief kupuje mierzalnie lepsze decyzje). To ustawia pricing pilotażu 20 lokalizacji na twardych kosztach jednostkowych i rozstrzyga architekturę przed skalowaniem; przy okazji pierwsza walidacja alignment score na realnych danych.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
