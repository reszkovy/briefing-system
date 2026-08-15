---
id: "mech:price-anchor-before-proof"
type: "mechanism"
title: "Price Anchor Before Proof"
status: "hypothesis"
created: "2026-08-10"
updated: "2026-08-14"
version: 2
owner: "przemek"
confidence: {"value":"hypothesis","evidence_strength":{"n":1,"projects":1,"independent_sources":1,"types":{"backtest":1},"last_confirmed":"2026-08-14","directions":{"supports":1}},"recommendation":"test-first"}
category: "Funnel Mechanics"
relations: {"implements":["prin:proof-before-promise"],"related":["mech:proof-first-demo-pitch","mech:dated-commitment-gates"]}
trigger: "Masz gotowy albo prawie gotowy artefakt dowodowy (demo, prototyp, makieta) i zbliża się moment pokazania go klientowi, a kotwica cenowa NIE jest jeszcze ustalona. Sygnał ostrzegawczy: „pokażę im to, a wycenę zrobimy po rozmowie\"."
context: "Sprzedaż systemów i mechanizmów organizacjom, które nie mają własnej kotwicy dla tej klasy pracy (fundacje, sieci lokalne, firmy kupujące dotąd pojedyncze materiały u freelancera). Im tańsza ich dotychczasowa kotwica, tym mocniej działa ten mechanizm."
anti_context: "Nie stosować, gdy kotwica cenowa już istnieje i jest zaakceptowana — wtedy zwłoka w pokazaniu dowodu tylko wydłuża cykl. Nie stosować jako pretekstu do niepokazywania niczego: mechanizm reguluje KOLEJNOŚĆ, nie istnienie dowodu. Nie mylić z ukrywaniem pracy — praca ujawniona etapami nadal w całości wchodzi do wyceny."
inputs: ["Gotowy lub prawie gotowy artefakt dowodowy","Rozpoznana kotwica cenowa klienta (choćby zasłyszana: „lokalny grafik 50-250 zl/material\")","Podział pracy na etapy, z których każdy da się wycenić osobno","Wersja kierunkowa artefaktu: pokazuje KIERUNEK, nie gotowość"]
ai_tasks: ["Złożenie wersji kierunkowej z istniejącego artefaktu (co pokazać, co wyciąć)","Rozpisanie etapów tak, żeby każdy dał się wycenić niezależnie","Wyłapanie w materiałach klienta sygnałów o jego kotwicy cenowej"]
human_tasks: ["Przemek: ustalenie kwot — modelu cenowego nie deleguje się","Przemek: decyzja, który etap i kiedy zostaje ujawniony","Klient: reakcja na kierunek przed zobaczeniem kompletu"]
expected_outcome: "Rozmowa zaczyna się od wartości i etapów, a nie od domykania czegoś, co klient uznał za skończone. Mierzalne: czy pierwsza kwota pada z naszej strony czy z ich, oraz czy finalna wycena jest wyższa od ich pierwotnej kotwicy."
tags: ["strategia","sprzedaz","hipoteza"]
evidence: [{"id":"ev:price-anchor-before-proof-artoffnia-demo-6e26aa","mechanism":"mech:price-anchor-before-proof","project":"proj:artoffnia-demo","type":"backtest","date":"2026-08-08","source":"rec:backtests/artoffnia-demo","observation":"Kompletny dowod gotowy przed ustaleniem kotwicy cenowej dzialal przeciw wycenie — wlasciciel wycofal demo z publikacji (commit cbc4535) i zastapil je teaserem kierunkowym, zeby odzyskac kontrole nad kolejnoscia rozmowy.","direction":"supports","independence_key":"proj:artoffnia-demo::rec:backtests/artoffnia-demo","fingerprint":"6e26aa7fce152ac6"}]
---

## Problem

Kompletny artefakt dowodowy pokazany przed ustaleniem kotwicy cenowej **obniża wycenę**. Klient,
który widzi rzecz gotową, wycenia jej domknięcie, a nie wartość, którą dostaje. Im lepszy dowód,
tym silniejszy efekt — mechanizm `mech:proof-first-demo-pitch` obraca się wtedy przeciwko sobie.

## Kiedy to widać

Sprzedający ma przewagę szybkości i chce ją pokazać. Pokazuje wszystko naraz. Rozmowa o cenie
zaczyna się od pytania „ile jeszcze zostało do zrobienia", zamiast od „ile to jest warte".

## Mechanizm

Kolejność, nie treść. Najpierw kotwica cenowa i podział na etapy, potem ujawnianie dowodu —
etapami, w tempie, które kontroluje sprzedający. Wersja kierunkowa artefaktu (kierunek, nie
gotowość) pełni rolę dowodu kompetencji, nie dowodu ukończenia.

Praca wykonana przed umową nie znika z wyceny. Ujawnianie etapami służy kolejności rozmowy,
nigdy obniżeniu wartości pracy.

## Skąd to wiemy

Jeden przebieg: ARToffNIA, sierpień 2026. Kompletny 19-stronowy serwis demo powstał przed
ustaleniem kotwicy. Właściciel wycofał demo z publikacji (commit `cbc4535`) i zastąpił je
teaserem kierunkowym, żeby odzyskać kontrolę nad kolejnością rozmowy. Szczegóły:
`rec:backtests/artoffnia-demo`.

**To jest jedna obserwacja z jednego projektu.** Confidence `hypothesis`, rekomendacja
`test-first`. Awans do `emerging` wymaga drugiego, niezależnego projektu — nie drugiego
spojrzenia na ten sam.

## Test do wykonania

Najbliższa okazja: rozmowa z ARToffNIĄ po powrocie Moniki. Mierzalne: czy pierwsza kwota pada
z naszej strony, i czy finalna wycena przekracza ich pierwotną kotwicę (lokalny grafik
50-250 zł za materiał).
