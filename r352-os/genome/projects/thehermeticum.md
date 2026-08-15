---
id: "proj:thehermeticum"
type: "project"
title: "The Hermeticum — serwis wiedzy hermetycznej (prywatny side-project, rynek EN)"
status: "routed"
created: "2026-08-14"
updated: "2026-08-14"
version: 4
owner: "przemek"
client_note: "projekt wlasny Reszka, poza portfelem klienckim r352; domena thehermeticum.com kupiona 14.08.2026"
domain: "wlasne"
relations: {"uses":["mech:working-artifact-extraction","mech:single-source-compiler","mech:seo-aeo-foundation","mech:static-i18n-mirror","comp:site-header-megamenu","comp:svg-atlas-map"]}
tags: ["side-project","trial-003-kandydat"]
---

## Problem

Zamówienie brzmi „zbudujmy serwis", ale realny problem jest inny: **czy istnieje możliwa do zdobycia
pozycja w niszy ezoterycznej dla nowego, anonimowego na starcie głosu — i która to pozycja.**
Teza „wiedza hermetyczna to przyszłość" jest przeczuciem założyciela, sklasyfikowanym w raporcie
routera jako opinia, nie fakt. Projekt ma ją sfalsyfikować tanio, zanim powstanie produkt.

Wtórny problem, nazwany wprost w raporcie: side-project konkuruje o czas z celem kwartału
(Benefit 2x). Koszt alternatywny jest realnym ryzykiem, nie formalnością.

## Stan na 14.08.2026, wieczór

Przebieg Routera wykonany rano. Werdykt `routeFrameworks`: **BOTH, w kolejności SALT → PLATE**.
Doublecheck PASS na pięciu rekordach researchu (dwa `supports`, dwa `contradicts`, jeden `neutral`).
SALT wykonany, status **PROPOSED**. PLATE draft v1, Project Contract przeszedł walidację bez błędów.

**Serwis jest publiczny od 14.08.** `thehermeticum.com` wdrożony na Vercel, przekierowanie z www
skonfigurowane, ostatni build tego samego dnia wieczorem. Własny generator
statyczny (`build.py`), warstwa AEO (`llms.txt`, sitemap, RSS, robots), trzy skrzydła treści
(Texts, Figures, Ideas), ścieżka dwunastu kroków z trzema otwartymi i dziewięcioma zamkniętymi
za zapisem na newsletter.

## Warstwa językowa, 14.08.2026

Serwis dostał pełne lustro polskie. **45 adresów EN i 45 adresów PL** pod prefiksem `/pl/`,
44 pliki treści w `content-pl/`, hreflang `en`/`pl`/`x-default` na każdej parze,
per-język canonical i `<html lang>`, obie wersje w sitemap, nota o lustrze w `llms.txt`.
Zweryfikowane w plikach wyjściowych, nie na deklaracji.

To jest pierwsze pełne wdrożenie mechanizmu `mech:static-i18n-mirror`, założonego tego samego
dnia. Projekt jest jego nośnikiem dowodowym: karta stoi na `hypothesis` z zerowym Evidence,
bo nie wiadomo jeszcze, czy lustro przetrwa pierwszą rundę zmian treści. Koszt publikacji jest
teraz podwójny i płaci się przy każdym wpisie, nie raz przy wdrożeniu.

**Otwarte pytanie do rozstrzygnięcia, nie do zapomnienia:** rynek docelowy z SALT to EN.
Polska wersja albo obsługuje inny, nienazwany jeszcze segment, albo jest kosztem bez odbiorcy.
SALT tego nie przewidywał, więc karta tego nie zamyka.

## Rozbieżność, którą ta karta zapisuje świadomie

Raport routera kończył się zdaniem: realizacja wstrzymana do podpisanego SALT i decyzji GO.
**Produkcja wyprzedziła bramkę.** W dniu, w którym powstał raport, serwis został zbudowany
i opublikowany, a fundament nadal nie jest podpisany.

To nie jest zarzut ani powód do cofania czegokolwiek — projekt jest prywatny i decyzja należy
do właściciela. To jest fakt, który Genome ma prawo znać, bo od niego zależy odpowiedź na
pytanie, czy predykcje z kontraktu mierzą jeszcze cokolwiek. Predykcje zapisane po starcie
nie testują decyzji, tylko opisują przebieg.

Konsekwencja praktyczna: karta zostaje w statusie `routed`, mimo że serwis żyje. Invariant 11
nie pozwala na `active` bez podpisanego kontraktu, `outcome_owner`, `measurement_date`
i decyzji GO. Żeby to uporządkować, trzeba albo podpisać fundament i kontrakt, albo jawnie
zapisać decyzję, że ten projekt prowadzimy poza kontraktem.

## Rozstrzygnięcia z SALT

Problem dominujący: **dystrybucyjny** — kanał przed brandingiem.
Odbiorca: ciekawy początkujący, rynek EN.
Sygnatura: postać redakcyjna, bez twarzy. Oznaczone jako hipoteza do rewizji 31.10.
Zdolność wykonawcza: 5–8 godzin tygodniowo, więc PLATE wyłącznie w trybie quick-win.

Sekwencja: newsletter „As Above" → baza wiedzy przyrostowo → społeczność po masie krytycznej.

## Czego research wykluczył

**Nie archiwum tekstów** — arena zajęta przez sacred-texts i hermetic.com.
**Nie klasyczny portal SEO** — zero-click i AI Overviews zjadają ten model.

Silnik: newsletter plus AEO. Luka rynkowa: nikt nie łączy darmowej ścieżki wejścia, rygoru,
nowoczesnego UX i czytelności maszynowej.

## Dlaczego ta karta powstaje ze statusem `routed`

Bo kontrakt nie jest podpisany. Invariant 11 nie pozwala na `active` bez decyzji GO, i słusznie:
projekt bez zamrożonych predykcji nie ma czego mierzyć, a bez pomiaru nie odróżni się od hobby.

Przejście na `active` wymaga: podpisu fundamentu SALT, decyzji GO na kontrakcie i rejestracji
trzech do pięciu predykcji.
