---
id: "mech:location-as-data-funnels"
type: "mechanism"
title: "Location-as-Data Funnels"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-09"
version: 4
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":3,"projects":0,"independent_sources":1,"types":{"narrative":3},"last_confirmed":"2026-08-07"},"recommendation":"use-with-care"}
category: "Funnel Mechanics"
relations: {"implements":["prin:single-source-of-truth"],"related":["mech:location-as-data","mech:single-source-compiler","mech:split-url-architecture","mech:presale-demand-ledger"]}
trigger: "Klient mówi: 'mamy 30 lokalizacji i jedną stronę', 'każde miasto/zajęcia wymagałoby osobnego landingu, ale nie mamy na to budżetu', 'reklamy prowadzą na stronę główną'. Cechy problemu: kampanie lokalne/segmentowe, dziesiątki potrzebnych wariantów, ruch płatny lądujący na jednej ogólnej stronie."
context: "Klienci multi-location (30-300+ lokalizacji: fitness, hearing-care, deweloperzy) oraz katalogi usług/kategorii ofertowych. Wymaga możliwości zamknięcia zmienności w danych (JSON per segment) i znajomości twardych ograniczeń platformy sprzedażowej z góry (np. system bez API = tylko redirect)."
anti_context: "Nie stosować przy kilku segmentach, które taniej zrobić ręcznie, gdy dane klienta są nieuporządkowane i nikt nie utrzyma ich zgodności z rzeczywistością (landing z błędnymi godzinami/cenami pali kampanię), ani gdy klient będzie ręcznie poprawiał wygenerowane widoki zamiast źródła danych."
inputs: ["Kompletne, zweryfikowane dane segmentów 1:1 z rzeczywistością (lokalizacje, zajęcia, ceny, godziny)","Dane językowe: fleksja polskich nazw miast (cityGen/cityLoc), copy per insight grupy","Szablon/szablony landingu i tokeny brandowe","Ograniczenia platformy sprzedażowej (API, redirecty, buy-pass)","Plan kampanii: które kreacje celują w które segmenty"]
ai_tasks: ["Budowa silnika: jedno źródło danych → generowane landingi per segment","Generacja plików danych per miasto/zajęcia/grupa i walidacja zgodności z cennikiem klienta","Wygenerowanie deep-linków per kreacja z eventami analitycznymi per krok","Pomiar konwersji per segment i raport rozrzutu między lokalizacjami","Dodawanie nowych segmentów (nowe miasto = nowy plik JSON, <1 dzień)"]
human_tasks: ["Klient: dostarczenie i potwierdzenie danych źródłowych (godziny, ceny, braki w katalogu)","Przemek-decyzja: architektura danych i granica szablon vs lokalny kontekst","Podwykonawca/klient: podpięcie kampanii reklamowych do deep-linków"]
expected_outcome: "Koszt uruchomienia kolejnego landingu spada do kosztu wpisu w danych (nowe miasto <1 dzień, bez pracy projektowej); każda kreacja trafia 1:1 w intencję, a ścieżka kampanii jest mierzalna per krok i per segment."
evidence: [{"id":"ev:location-as-data-funnels-001","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"fitstyle-platform: silnik LP — src/data/locations/*.json (13 miast) + szablon przedsprzedaz/[slug].astro; nowe miasto = nowy plik JSON; usługi punktowe sterowane z strony.json naraz w 3 miejscach interfejsu","mechanism":"mech:location-as-data-funnels","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:location-as-data-funnels-002","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"artoffnia-oferta: zajecia.js = jedyne źródło danych → 43 kampanijne landingi zajecie.html?id= + 4 landingi grup grupa.html?g= z copy per insight grupy; ścieżka kreacja→grupa→zajęcie→rezerwacja mierzalna per krok","mechanism":"mech:location-as-data-funnels","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"},{"id":"ev:location-as-data-funnels-003","type":"narrative","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"dailyfruits-oferta-seo-architecture: 11 stron standalone kategorii generowanych w build systemie z jednego szablonu (scripts/build.js), każda z własnym title/H1/canonical","mechanism":"mech:location-as-data-funnels","independence_key":"multi::rec:reviews/skan-cko-2026-08-07"}]
tags: ["performance","frontend","copy"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---

## Problem

Kampanie lokalne i segmentowe potrzebują dziesiątek trafnych landingów (per miasto, per zajęcia, per grupa docelowa), a ręczna produkcja każdego z nich jest za droga — więc ruch z reklam ląduje na jednej ogólnej stronie i konwersja przepada.

## Mechanizm działania

Cała zmienność lejka zamknięta w danych, nie w stronach: jeden szablon + plik danych per segment (JSON per miasto z polami fleksji cityGen/cityLoc, baza zajęć jako jedyne źródło) generuje kompletny landing pod każdą kreację. Każda reklama dostaje URL trafiający 1:1 w intencję (miasto, konkretne zajęcia, grupa wiekowa), a koszt kolejnego landingu spada do kosztu wpisu w danych. Ścieżka kampanii jest mierzalna per krok, bo każdy segment ma własny adres.

## Warunki sukcesu

- Jedno źródło danych — widoki wyłącznie generowane (reguła frameworku r352: jedno źródło → generowane widoki)
- Dane obejmują też język (fleksja polskich nazw miast: pola cityGen/cityLoc), nie tylko liczby
- Każda kreacja reklamowa ma swój deep-link w segment, z eventem analitycznym per krok
- Twarde ograniczenia platformy sprzedażowej znane z góry (GymManager bez API = tylko link/redirect do buy-pass)

## Warunki porażki

- Dane rozjeżdżają się z rzeczywistością klienta — katalog ARToffNIA wymagał dosypania 9 brakujących grup Pryzmatu, zanim był 1:1 z cennikiem; landing z błędnymi godzinami/cenami pali kampanię
- Segmentowe URL-e bez konsolidacji canonical zaczynają kanibalizować strony SEO (przerabiane na DailyFruits)
- Ręczne poprawki w wygenerowanych widokach zamiast w źródle danych — po pierwszym rebuildzie znikają

## Potencjał automatyzacji

Bardzo wysoki — to wprost produkt: silnik FitStyle ma być powtarzalnym produktem dla sieci na GymManagerze; generacja landingu z pliku danych jest już zautomatyzowana, do domknięcia automatyczne spinanie z kampanią (UTM/eventy per segment).

## Transfer

Każdy klient multi-location z ICP r352 (30–300+ lokalizacji: fitness, hearing-care, deweloperzy) — to jest dokładnie beachhead z operating strategy; także katalogi usług (ARToffNIA) i kategorie ofertowe (DailyFruits).

## Eksperyment · FitStyle

Uruchomić kampanię lokalną w 3 miastach z listy przedsprzedażowej jednocześnie, wyłącznie kosztem dodania plików JSON (bez pracy projektowej). Zmierzyć: czas uruchomienia miasta (cel: <1 dzień), rozrzut konwersji zapisy/sesje między miastami przy identycznym szablonie, oraz które pola danych (data otwarcia vs adres vs zdjęcie lokalizacji) różnicują wynik.

**Czego się dowiemy:** Czy konwersja jest własnością szablonu (mała wariancja między miastami = mechanizm skalowalny jako produkt), czy lokalnego kontekstu (duża wariancja = silnik potrzebuje warstwy lokalnych dowodów); to rozstrzyga model cenowy silnika jako produktu dla sieci.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
