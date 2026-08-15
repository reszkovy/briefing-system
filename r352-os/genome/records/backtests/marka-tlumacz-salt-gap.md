---
id: "rec:backtests/marka-tlumacz-salt-gap"
type: "record"
title: "Backtest — koszt pominięcia warstwy diagnostycznej (Trial #002)"
status: "created"
owner: "przemek"
relations: {"attached_to":["proj:marka-tlumacz"],"related":["wf:salt","mech:strategy-before-execution","mech:competitive-benchmarking"]}
tags: ["walidacja","strategia"]
created: "2026-08-09"
updated: "2026-08-09"
version: 1
---


# Backtest — koszt pominięcia warstwy diagnostycznej (Trial #002)

**Typ dowodu: `backtest`.** Dowód NEGATYWNY: pokazuje koszt braku procedury, nie korzyść z jej użycia.

## Co się wydarzyło

W Trialu #002 (marka osobista tłumacza konferencyjnego) v1 strony powstało bezpośrednio z faktów mailowych i inspiracji klientki, **bez warstwy diagnostycznej**. Benchmark rynkowy wykonany dopiero PO v1 — na pytanie CEO — ujawnił braki, które są dokładnie zawartością warstw SALT:

| Brak wykryty po fakcie | Warstwa SALT, która by go złapała |
|---|---|
| Pary językowe niepodane | A — odbiorcy (pierwsze pytanie klienta) |
| Brak liczb doświadczenia | L — przewaga (potwierdzona, nie deklarowana) |
| Brak akredytacji/stowarzyszeń | L — przewaga strukturalna vs kopiowalna |
| Brak referencji | L — „potwierdzone przez jego klientów, nie przez niego" |
| Brak FAQ / ścieżki zakupu | T + wejście do PLATE |

**Koszt:** pełna runda poprawek v1 → v1.1 (sekcja referencji, FAQ, nota o parach językowych, warstwa SEO/AEO).

## Czego NIE da się z tego wywnioskować

1. Nie wiemy, czy SALT **rzeczywiście** wychwyciłby te braki — to rekonstrukcja kontrfaktyczna, nie eksperyment.
2. Braki wykrył benchmark (`mech:competitive-benchmarking`), nie SALT — możliwe, że sam benchmark wystarczy, a warstwa diagnostyczna jest nadmiarowa. **To jest realna alternatywna hipoteza i nie została odrzucona.**
3. Projekt nie jest zamknięty — nie znamy wyniku sprzedażowego.

## Wniosek dowodowy

Kierunek: `limits` — pokazuje granicę „egzekucji z briefu" przy projektach pozycjonujących, ale nie rozstrzyga, czy lekarstwem jest SALT, czy sam benchmark. Ta niepewność ma zostać rozstrzygnięta pierwszym żywym użyciem.
