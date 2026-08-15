---
id: "mech:prototype-mode-guard"
type: "mechanism"
title: "Prototype Mode Guard"
status: "hypothesis"
created: "2026-08-10"
updated: "2026-08-14"
version: 1
owner: "przemek"
confidence: {"value":"hypothesis","evidence_strength":{"n":0,"projects":0,"independent_sources":0,"types":{},"last_confirmed":null},"recommendation":"test-first"}
category: "Delivery Guards"
relations: {"implements":["prin:proof-before-promise"],"related":["mech:incident-to-guard","mech:sandbox-promotion"]}
trigger: "Budujesz artefakt, ktory wyglada na gotowy, a nie jest: prototyp bez backendu, serwis przed premiera, dane z placeholderami. Sygnal ostrzegawczy: \"to jest tylko demo, pamietajmy, zeby tego nie wypuscic\"."
context: "Prototypy i wersje roboczne pokazywane klientom albo zdeployowane pod publicznym adresem, gdzie pomylka miedzy trybem roboczym a produkcja kosztuje zaufanie."
anti_context: "Nie stosowac w artefaktach jednorazowych, ktore nigdy nie zobacza swiatla dziennego. Nie mylic z incident-to-guard: tamten powstaje PO incydencie, ten dziala prewencyjnie. Guard ma krzyczec do wykonawcy, nie do uzytkownika koncowego."
inputs: ["Miejsca, w ktorych artefakt jest niekompletny (pusty endpoint, brak danych, placeholdery)","Definicja stanu \"gotowy do produkcji\" dla tego artefaktu"]
ai_tasks: ["Wstawienie ostrzezen w miejscach niekompletnych","Globalny noindex w trybie roboczym","Oznaczenie danych placeholderowych jako TBC w zrodle, nie w widoku"]
human_tasks: ["Przemek: decyzja o zdjeciu guardow, czyli o przejsciu w tryb produkcyjny"]
expected_outcome: "Zaden prototypowy brak nie moze udawac produkcji. Artefakt niekompletny deklaruje to sam, bez polegania na pamieci wykonawcy."
tags: ["guard","delivery","hipoteza"]
---

## Problem

Prototyp wygląda jak produkcja. Pusty endpoint formularza nie różni się z zewnątrz od
działającego, dane testowe od prawdziwych, wersja robocza od premiery. Kosztem pomyłki jest
zaufanie klienta, a mechanizmem obronnym zwykle bywa pamięć wykonawcy — czyli nic.

## Mechanizm

Kod deklaruje własną niekompletność w miejscu, w którym jest niekompletny. Pusty endpoint
wypisuje ostrzeżenie w konsoli. Serwis w trybie roboczym ma globalny `noindex`. Dane
placeholderowe są oznaczone `TBC` w źródle, nie w widoku.

Guard krzyczy do wykonawcy, nie do użytkownika. Zdjęcie guardów jest jawną decyzją człowieka
i to ono, a nie deploy, oznacza wejście w tryb produkcyjny.

## Skad to wiemy

Jeden projekt: fitstyle-platform, sierpień 2026. Trzy niezależne wystąpienia tego wzorca,
żadne nierekomendowane przez Router — organizacja zrobiła to sama. Backtest 09.08 nazwał to
klasą „użyte, a nierekomendowane" i wskazał brak karty.

**Jedna obserwacja z jednego projektu.** Confidence `hypothesis`. Awans wymaga drugiego,
niezależnego projektu.

## Predykcja — swiadomie brak przy wejsciu

W oknie pomiarowym nie ma zaplanowanego nowego prototypu, więc rejestrowanie predykcji teraz
byłoby pozorem testu. Zostanie zarejestrowana przy pierwszym uruchomieniu nowego prototypu.
Kryterium: czy artefakt deklaruje własną niekompletność bez przypominania przez człowieka.
