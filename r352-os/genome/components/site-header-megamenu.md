---
id: "comp:site-header-megamenu"
type: "component"
title: "Nagłówek z mega menu i ATF (sticky, wyśrodkowane, akordeon mobile)"
status: "extracted"
created: "2026-08-14"
updated: "2026-08-14"
version: 1
owner: "przemek"
relations: {"born_from":["proj:fitstyle-platform"],"used_by":["proj:fitstyle-platform","proj:thehermeticum"]}
tags: ["ui","reuse"]
---

## Co to jest

Nagłówek serwisu z mega menu i sekcją ATF: przyklejony pasek, wyśrodkowany panel z kolumnami
i aside, otwieranie hoverem i klikiem, zasłona pod panelem, akordeon na mobile, hero z drugą
linią wyróżnioną.

## Skąd pochodzi

Powstał w `proj:fitstyle-platform` jako `SiteHeader` i `HeroPresale`. Rozwiązywał problem
sieci z wieloma lokalizacjami: jedna nawigacja, wiele wejść, dwie warstwy hierarchii.

## Gdzie został użyty ponownie

`proj:thehermeticum`, 14.08.2026 — mechanika przeniesiona, estetyka wymieniona w całości
(pergamin, atrament, cynober, Cinzel plus EB Garamond zamiast czerni i złota FitStyle).

**To jest przypadek, dla którego w ontologii istnieje typ Component**: artefakt, który urodził
się w jednym projekcie i pracuje w drugim. Do dziś żaden komponent w Genome nie miał dwóch
różnych projektów w `used_by`.

## Czego to NIE dowodzi

Że mechanizm zadziałał u odbiorcy. Przeniesienie kodu jest faktem technicznym; dowód wartości
wymaga pomiaru na żywym ruchu i pojawi się dopiero w postmortemie.
