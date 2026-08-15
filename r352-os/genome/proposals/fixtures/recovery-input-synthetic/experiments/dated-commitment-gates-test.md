---
id: "exp:dated-commitment-gates-test"
type: "experiment"
title: "Test: Dated Commitment Gates"
status: "proposed"
created: "2026-08-07"
updated: "2026-08-08"
version: 1
owner: "przemek"
relations: {"tests": ["mech:dated-commitment-gates"]}
on_note: "BetterWorkplace (TeamBudget)"
tags: []
---

## Projekt testu

Domknąć pętlę, której dziś brakuje: MVP istnieje, ale nie ma bramki popytowej. Ustawić na najbliższym kroku sprzedażowym pełną bramkę datową na piśmie: data + liczbowy warunek wykonania (np. wysyłka do 30 decydentów; GO = ≥5 umówionych demo, STOP = archiwizacja) + automatyczna konsekwencja w kodzie huba (po dacie hub sam przełącza banner na 'wersja archiwalna — projekt wstrzymany' i wysyła powiadomienie) + z góry napisany wpis 'Abandoned'. Równolegle zostawić drugi otwarty wątek (np. case Sonova) bez bramki jako kontrolę. Zmierzyć: czy akt kontaktu nastąpił przed datą, ile dni przed, vs wątek kontrolny.

## Czego się dowiemy

Dwie rzeczy naraz: (1) czy istnieje popyt na wdrożenie TeamBudget (twarda liczba demo zamiast przeczucia), (2) czy automatyczna konsekwencja datowa realnie wypycha akty odwagi u tego konkretnego założyciela (n=1, ale właściwe n — cały system ma jedno gardło), czy tylko przesuwa prokrastynację na obchodzenie bramki. Wynik decyduje, czy bramki datowe wpisać na stałe do CKO/FOTRA i playbooka F1–F5 oraz czy Dated Commitment Gates można sprzedawać jako mechanizm.

## Kryterium

_Do uzupełnienia przy uruchomieniu: Prediction (wartość, deadline, kryterium sukcesu/porażki) — invariant 9._
