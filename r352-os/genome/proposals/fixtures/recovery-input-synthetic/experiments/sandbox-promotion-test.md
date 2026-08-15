---
id: "exp:sandbox-promotion-test"
type: "experiment"
title: "Test: Sandbox Promotion"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:sandbox-promotion"]}
on_note: "Benefit/Zdrofit (hourly pipeline)"
tags: []
---

## Projekt testu

Uruchomić pipeline w trybie pilotażu ręcznego (batch 1×/dzień — świadomie poniżej ambicji 'hourly', bo pętla miesiąc po definicji nie wystartowała): przez 10 dni roboczych automat klasyfikuje nowe karty i generuje wstępne kreacje WYŁĄCZNIE dla rodzin szablonowych w pliku 'DO WALIDACJI'. Mierzyć dziennie: % briefów zaklasyfikowanych do rodzin, % kreacji zaakceptowanych bez zmian / z drobnymi zmianami / odrzuconych, czas walidacji per kreacja, liczbę prób dotknięcia produkcji (musi być 0).

## Czego się dowiemy

Dowiemy się, jaki realny odsetek wolumenu ~100 briefów/mies. automat obsługuje na akceptowalnym poziomie (dziś czysta hipoteza — pętla nigdy nie wystartowała), czy wąskim gardłem staje się przepustowość walidacji człowieka, i czy bramka strukturalna wytrzymuje realny wolumen — to wprost wycenia wartość automatyzacji przed rozmową o skalowaniu.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
