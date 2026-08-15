---
id: "exp:numeric-gates-test"
type: "experiment"
title: "Test: Numeric Gates"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:numeric-gates"]}
on_note: "Benefit/Zdrofit (Narzędzie do briefowania)"
tags: []
---

## Projekt testu

Back-test alignment score na nieużytym korpusie 39 realnych briefów z 8 tablic briefsync: policzyć score dla każdego historycznego briefu i zestawić z faktycznym przebiegiem (ile rund feedbacku w Trello, czy był odsyłany, lead time do akceptu). Policzyć korelację score ↔ liczba rund poprawek; próg skalibrować tak, by bramka 'wymaga poprawy' łapała briefy, które realnie wróciły.

## Czego się dowiemy

Dowiemy się, czy alignment score przewiduje realny koszt obsługi briefu ZANIM walidator go zobaczy (twardy dowód sprzedażowy dla pilota 20 lokalizacji i pricingu 50–100k PLN: 'score poniżej X = średnio N dodatkowych rund'), czy tylko dubluje intuicję walidatora. W obu wypadkach kończy się stan 'próg na niezwalidowanej skali' i dostajemy skalibrowany próg zamiast wymyślonego.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
