---
id: "comp:svg-atlas-map"
type: "component"
title: "Mapa SVG sterowana danymi (punkty, warstwy, opisy)"
status: "extracted"
created: "2026-08-14"
updated: "2026-08-14"
version: 1
owner: "przemek"
relations: {"born_from":["proj:caterelo"],"used_by":["proj:caterelo","proj:thehermeticum"]}
tags: ["ui","dane","reuse"]
---

## Co to jest

Mapa jako grafika wektorowa sterowana danymi, nie osadzony kafelkowy widget: punkty i warstwy
generowane ze źródła, opisy przy punktach, brak zależności od zewnętrznego dostawcy map.

## Skąd pochodzi

`proj:caterelo` — silnik relokacyjny z Deal Radarem, gdzie mapa jest sposobem czytania danych,
a nie ozdobą.

## Gdzie został użyty ponownie

`proj:thehermeticum` — Atlas tradycji, od Hermopolis po Amsterdam. Inline SVG 1000×560
z etykietami miejsc.

## Zastrzeżenie do prowieniencji

Powiązanie zadeklarował właściciel. **Nie zweryfikowałem współdzielonego kodu** — sprawdziłem
wyłącznie, że w Hermeticum mapa jest inline SVG, a nie biblioteką kafelkową. Jeśli reuse dotyczy
podejścia, a nie plików, to jest reuse wzorca, nie komponentu, i tę kartę należy przerobić na
adnotację w `mech:working-artifact-extraction`.
