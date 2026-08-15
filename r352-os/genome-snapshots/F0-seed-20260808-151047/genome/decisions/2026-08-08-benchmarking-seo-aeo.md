---
id: "dec:2026-08-08-benchmarking-seo-aeo"
type: "decision"
title: "Benchmarking i SEO/AEO jako stałe etapy procesu Genome"
status: "decided"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "przemek"
question: "Czy Router ma wymuszać etap benchmarkingu rynkowego oraz warstwę SEO/AEO dla artefaktów publicznych?"
options: ["zostawić jako opcjonalne dobre praktyki", "wpisać jako obowiązkowe etapy: benchmark przed pierwszym szkicem, SEO/AEO w definicji ukończenia artefaktu publicznego"]
choice: "wpisać jako obowiązkowe etapy: benchmark przed pierwszym szkicem, SEO/AEO w definicji ukończenia artefaktu publicznego"
decided: "2026-08-08"
relations: {"related": ["mech:competitive-benchmarking", "mech:seo-aeo-foundation"]}
tags: ["governance", "trial-002"]
---

## Kontekst

Trial #002 (marka tłumacza): v1 artefaktu powstało bez przeglądu niszy. CEO wykrył lukę pytaniem "czy przeszedłeś przez etap benchmarkingu?" — benchmark wykonany po fakcie natychmiast wykazał braki standardu niszy (pary językowe, liczby, akredytacje, referencje, FAQ). Dyspozycja CEO: "musimy dodać do naszego genome benchmarking oraz etap SEO i AEO".

## Skutek

1. Nowe karty: `mech:competitive-benchmarking` (hypothesis) i `mech:seo-aeo-foundation` (emerging).
2. ROUTER.md: raport routera rozszerzony do 9 sekcji — nowa sekcja 4 "Benchmark rynkowy" (3–5 realizacji, delta-lista) przed doborem mechanizmów.
3. Bramka workflow: publiczny artefakt akwizycyjny nie jest "done" bez warstwy SEO/AEO (semantyka, JSON-LD, FAQ pod pytania frazowe).
4. Retrofit Trial #002: benchmark + warstwa SEO/AEO dołożone do v1 marki tłumacza.
