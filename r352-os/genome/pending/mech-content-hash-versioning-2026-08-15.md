---
id: "mech:content-hash-versioning"
type: "mechanism"
title: "Wersja zasobu z sumy kontrolnej, nie z ręki"
status: "proposed"
created: "2026-08-15"
updated: "2026-08-15"
version: 1
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":2,"projects":1,"independent_sources":1,"types":{"narrative":2},"last_confirmed":"2026-08-15"},"recommendation":"use"}
category: "Delivery"
relations: {"implements":["mech:incident-to-guard"],"related":["mech:single-source-compiler","mech:deterministic-spine"]}
trigger: "Statyczny serwis z ręcznym `?v=N` przy arkuszu stylów lub skrypcie, wdrażany częściej niż raz dziennie. Sygnał w rozmowie: 'poprawiłeś to, a ja dalej widzę stare', 'u mnie wygląda inaczej niż u ciebie'."
context: "Strony budowane przez kilka generatorów naraz, gdzie ten sam numer wersji trzeba wpisać w wielu miejscach. Im więcej generatorów, tym większa pewność, że kiedyś się rozjadą."
anti_context: "Nieistotne przy jednym pliku szablonu i wdrożeniach raz na tydzień. Nie rozwiązuje problemu cache po stronie CDN, jeśli ten ignoruje query string — wtedy potrzebna nazwa pliku z hashem."
inputs: ["Lista zasobów wersjonowanych (css, js)", "Generatory/szablony, które je referencują"]
ai_tasks: ["Wyliczenie skrótu z zawartości pliku przy buildzie i podstawienie go we wszystkich referencjach", "Kontrola po buildzie: wszystkie typy stron raportują ten sam numer"]
human_tasks: ["Przemek-decyzja: przejście z numeracji ręcznej na wyliczaną"]
expected_outcome: "Wersja zmienia się dokładnie wtedy, gdy zmienia się plik, i nigdy nie może rozjechać się między typami stron. Znika cała klasa zgłoszeń 'poprawka nie działa'."
evidence: [{"id":"ev:content-hash-versioning-001","type":"narrative","date":"2026-08-15","source":"proj:thehermeticum","note":"Przy nagłówku Cache-Control: max-age=31536000, immutable na /assets/*, ręczne podbijanie ?v=N zawiodło trzykrotnie w jednej sesji: stepper bez stylów, niewidoczny przycisk (tekst w kolorze tła), obraz hero w starej wersji. Za każdym razem diagnoza kosztowała osobną rundę.","mechanism":"mech:content-hash-versioning","project":"proj:thehermeticum","independence_key":"proj:thehermeticum::sesja-2026-08-15-a"},{"id":"ev:content-hash-versioning-002","type":"narrative","date":"2026-08-15","source":"proj:thehermeticum","note":"Wariant cichszy i droższy: strony treściowe zatrzymały się na site.css?v=86, podczas gdy home ładował v92 — bo podbicie wersji trafiało tylko w część generatorów. Skutek: dwie poprawki zgłoszone przez klienta jako 'dalej nie działa' były w kodzie już od kilku wdrożeń. Wykryte dopiero przez odczyt document.styleSheets, nie przez przegląd kodu.","mechanism":"mech:content-hash-versioning","project":"proj:thehermeticum","independence_key":"proj:thehermeticum::sesja-2026-08-15-b"}]
tags: ["frontend","ops","quality"]
---

## Problem

`Cache-Control: immutable` jest właściwym ustawieniem dla zasobów statycznych i jednocześnie ładunkiem wybuchowym: przeglądarka nigdy nie sprawdzi, czy plik się zmienił. Jedyną informacją o zmianie jest numer w adresie — a ten wpisuje człowiek, w kilku miejscach naraz.

Objaw nie wygląda na problem z cache. Wygląda na to, że poprawka nie działa. Diagnoza idzie więc w kod, którego nie trzeba naprawiać, i kosztuje pełną rundę z klientem.

## Mechanizm działania

Numer wersji przestaje być decyzją. Build liczy skrót z zawartości pliku (kilka pierwszych znaków SHA) i podstawia go we wszystkich referencjach naraz. Plik się nie zmienił — numer ten sam, cache działa. Plik się zmienił — numer inny, przeglądarka pobiera nowy.

Dwie własności, których nie da się osiągnąć ręcznie: numer **nie może** się rozjechać między generatorami, bo pochodzi z jednego wyliczenia, i **nie da się** go zapomnieć podbić.

## Sygnał, że mechanizm jest potrzebny

Zdanie „u mnie dalej stara wersja" wypowiedziane więcej niż raz w projekcie. To nie jest zgłoszenie o cache — to zgłoszenie o wersjonowaniu.

## Warunki porażki

Nie pomaga, gdy CDN ignoruje query string przy cache'owaniu — wtedy potrzebna jest nazwa pliku z hashem (`site.a1b2c3.css`), co pociąga zmianę w każdej referencji i sprzątanie starych plików. Nie pomaga też przy zasobach wstrzykiwanych przez third-party.

**Pułapka wdrożeniowa:** jeśli hash liczy się z pliku źródłowego, a wdrażana jest wersja przetworzona (minifikacja, autoprefixer), numer może nie zmienić się mimo zmiany treści. Hash musi pochodzić z artefaktu, który faktycznie trafia na serwer.

## Jak zmierzyć, że działa

Jedno sprawdzenie po każdym wdrożeniu: wszystkie typy stron (home, treść, generowane podstrony) raportują ten sam numer wersji zasobu. Rozjazd wykrywa się jedną komendą, a nie zgłoszeniem klienta.
