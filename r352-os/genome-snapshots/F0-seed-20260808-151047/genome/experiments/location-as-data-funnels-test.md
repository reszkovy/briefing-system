---
id: "exp:location-as-data-funnels-test"
type: "experiment"
title: "Test: Location-as-Data Funnels"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:location-as-data-funnels"]}
on_note: "FitStyle"
tags: []
---

## Projekt testu

Uruchomić kampanię lokalną w 3 miastach z listy przedsprzedażowej jednocześnie, wyłącznie kosztem dodania plików JSON (bez pracy projektowej). Zmierzyć: czas uruchomienia miasta (cel: <1 dzień), rozrzut konwersji zapisy/sesje między miastami przy identycznym szablonie, oraz które pola danych (data otwarcia vs adres vs zdjęcie lokalizacji) różnicują wynik.

## Czego się dowiemy

Czy konwersja jest własnością szablonu (mała wariancja między miastami = mechanizm skalowalny jako produkt), czy lokalnego kontekstu (duża wariancja = silnik potrzebuje warstwy lokalnych dowodów); to rozstrzyga model cenowy silnika jako produktu dla sieci.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
