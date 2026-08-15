---
id: "mech:seo-aeo-foundation"
type: "mechanism"
title: "SEO/AEO Foundation Layer"
status: "emerging"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":9,"projects":9,"types":{"measurement":0,"postmortem":7,"narracja":2},"last_confirmed":"2026-08-08"},"recommendation":"test-first"}
category: "Distribution"
relations: {"implements": ["prin:design-for-machine-readers"], "related": ["mech:competitive-benchmarking", "mech:agent-facing-distribution", "mech:split-url-architecture"]}
trigger: "Powstaje publiczny artefakt webowy, który ma POZYSKIWAĆ ruch/klientów (strona ekspercka, LP, katalog, centrum wiedzy) — a w planie nie ma jawnej warstwy: struktura semantyczna, meta, dane strukturalne, treść pod pytania."
context: "Każda publiczna strona kliencka lub własna r352 z celem akwizycyjnym. AEO (Answer Engine Optimization) rośnie na znaczeniu: coraz większa część odkrywania przechodzi przez LLM-y i answer engines, które czytają dane strukturalne, FAQ i klarowną semantykę — nie layout."
anti_context: "Nie stosować dla artefaktów niepublicznych (demo w szufladzie, narzędzia wewnętrzne, strony za hasłem) ani dla stron czysto wizerunkowych bez celu akwizycyjnego — wtedy tylko minimalna higiena (title/meta/charset). Nie mylić z pełną kampanią SEO (content plan, linki) — to warstwa FUNDAMENTU wbudowana w artefakt."
inputs: ["Lista pytań frazowych, które zadaje klient docelowy (z briefu/benchmarku)", "Fakty i liczby możliwe do użycia w odpowiedziach (tylko prawdziwe)", "Docelowe frazy PL/EN + nazwy własne (osoba, usługa, lokalizacja)"]
ai_tasks: ["Semantyka: hierarchia h1–h3 pod frazy, title/meta description, OG", "Dane strukturalne JSON-LD: Person/Organization + Service + FAQPage (+ hreflang przy wersjach językowych)", "Sekcja FAQ pisana jako bezpośrednie odpowiedzi (format pod answer engines)", "Audit: czy strona odpowiada na pytania frazowe TREŚCIĄ, nie tylko słowami-kluczami"]
human_tasks: ["Przemek/klient: walidacja faktów użytych w odpowiedziach (zero wymyślonych liczb)", "Klient: wizytówka Google i sygnały zewnętrzne (poza artefaktem)"]
expected_outcome: "Artefakt od dnia publikacji jest czytelny dla wyszukiwarek I answer engines: indeksowalna semantyka, poprawne dane strukturalne (walidator schema.org bez błędów), FAQ odpowiadające na realne pytania frazowe. Miara docelowa: obecność w odpowiedziach LLM/AI Overviews na pytania z niszy."
evidence: [{"id":"ev:seo-aeo-foundation-001","type":"narracja","date":"2026-07-15","source":"proj:dailyfruits-relaunch","note":"DailyFruits: architektura /oferta z 11 stronami standalone SEO oddzielonymi od 9 deep-linków UX (canonical), sitemap zarządzany świadomie + fix www/non-www — warstwa SEO zaprojektowana jako struktura, nie dodatek."},{"id":"ev:seo-aeo-foundation-002","type":"narracja","date":"2026-07-20","source":"proj:r352-website","note":"r352.com: prerender Chromium dla SPA pod crawlery + praca na GSC — koszt dorabiania warstwy SEO po fakcie zamiast wbudowania od startu."},{"id":"ev:seo-aeo-foundation-bt-beesknees-site","type":"postmortem","date":"2026-08-09","source":"rec:backtests/beesknees-site","note":"(bt#T1) SEO weszło jako jednorazowy batch sterowany wytycznymi zewnętrznej agencji klienta (docx z frazami i [H1]), nie jako stała bramka na każdej promocji; noindex na draftach zadziałał | Zmiana: Flaga w karcie: w utrzymaniu SEO bywa dostarczane przez agencję klienta jako wsad — mechanizm ogranicza się do dyscypliny noindex/meta przy promocji"},{"id":"ev:seo-aeo-foundation-bt-r352-case-studies-work","type":"postmortem","date":"2026-08-09","source":"rec:backtests/r352-case-studies-work","note":"(bt#T1) Rekomendacja redundantna: warstwa SEO/AEO kompletna od 10.06.2026, na 2 miesiące przed T0 iteracji; dla nowego jawnego case'u sitemap+prerender dodane w tej samej sesji | Zmiana: Warunek wejścia w karcie: 'sprawdź, czy warstwa już nie istnieje'; krok zero 'inwentarz artefaktu' w ROUTER.md"},{"id":"ev:seo-aeo-foundation-artoffnia-demo","type":"postmortem","date":"2026-08-08","source":"rec:backtests/artoffnia-demo","note":"Na artefakcie niepublicznym powstała pełna warstwa migracyjna SEO i była to praca sprzedażowo najsilniejsza — mimo anti-contextu karty odradzającego ją dla artefaktów niepublicznych. | Zmiana: Zmienić anti-context na 'nie dla artefaktów bez następcy produkcyjnego'; rozdzielić kartę na trzon migracyjny (301/sitemap/canonical — zawsze gdy istnieje stary serwis w indeksie) i warstwę AEO (JSON-LD/FAQ — dopiero na produkcji). [dowód: PRZEKIEROWANIA-301.md: 'Źródło: znacznik canonical z 197 stron zarchiwizowanej wersji artoffnia.pl... Zmapowane: 197/197', wdrożone w _redirects + vercel.json (33 KB) + redirects.htaccess; sitemap.xml z 201 <loc> (w tym 52 zajecie.html?id=); canonical na 21 stronach; jednocześnie zero application/ld+json i brak FAQ w 19 stronach demo]"},{"id":"ev:seo-aeo-foundation-caterelo","type":"postmortem","date":"2026-08-08","source":"rec:backtests/caterelo","note":"Rekomendacja 'hreflang x6 obowiazkowo' wynikla z pomylenia liczby rynkow z liczba jezykow tresci. | Zmiana: Kryterium hreflang = liczba jezykow tresci, nigdy liczba rynkow/krajow. Reszta bramki (JSON-LD, FAQPage, metodologia, zrodla) potwierdzona jako trafna i juz istniejaca przed T0. [dowód: Wszystkie 144 pliki public/**/index.html maja lang=\"en\"; jedyny hreflang w public/regions/algarve/index.html to self-referencing <link rel=\"alternate\" hreflang=\"en\">. public/llms.txt deklaruje produkt anglojezyczny obslugujacy 6 krajow.]"},{"id":"ev:seo-aeo-foundation-wegobold-site","type":"postmortem","date":"2026-08-08","source":"rec:backtests/wegobold-site","note":"Gotowa, produkcyjna warstwa SEO istnieje w bratnim repo tej samej rodziny stacku i nie zostala przeniesiona - rekomendacja 'zbuduj' zamiast 'przenies' wykonala sie jako zero. | Zmiana: +1 evidence typu postmortem, confidence w gore. Dodac do workflow krok 'inwentarz rodzenstwa' w G0 (czy ktores repo rodziny ma te warstwe rozwiazana) + nowa karta-kandydat mech:sibling-solution-transfer. [dowód: 2026-08-09: memory/r352-website.md (prerender.mjs na 35 tras z fixem @sparticuz/chromium + AWS_LAMBDA_JS_RUNTIME, SEO.tsx per route, sitemap ~40 URL, robots + llms.txt) vs wegobold-site: brak sitemap.xml i robots.txt (find = 0 trafien), brak meta per route (grep 'document.title|helmet' w src/ = 0), JSON-LD wylacznie Organization w index.html, FAQ tylko jako akordeon Reacta (Services.tsx:231).]"},{"id":"ev:seo-aeo-foundation-kubota-stand-3d","type":"postmortem","date":"2026-08-08","source":"rec:backtests/kubota-stand-3d","note":"Bramka warunkowa bez właściciela i daty nie uruchamia się sama — warunek 'artefakt trafia na publiczny URL r352.com' spełnił się 17.07, a deliverable klientowski stoi w stanie pośrednim: publiczny i indeksowalny, ale osierocony. | Zmiana: Bramka stała w ROUTER.md: decyzja o statusie deliverable'u (prywatny z noindex / hasło / publiczny case z SEO) podejmowana PRZY PIERWSZEJ PUBLIKACJI, nigdy warunkowo 'kiedyś'. Confidence: n/d — obserwacja procesowa do Ledgera, nie do karty. [dowód: 2026-08-09: plik R352 WEBSITE/public/kubotabaltona/index.html (identyczny bajt w bajt z index.html projektu — diff czysty), LIVE jako r352.com/kubotabaltona od 17.07.2026; `grep -c 'noindex|robots' index.html` = 0; `grep -rl kubotabaltona` w całym repo strony = brak trafień (brak linku, brak wpisu w sitemapie, brak reguły w robots.txt).]"},{"id":"ev:seo-aeo-foundation-penya-saas","type":"postmortem","date":"2026-08-08","source":"rec:backtests/penya-saas","note":"Router zredukowal karte do minimalnej higieny ('rdzen za logowaniem, dystrybucja przez FCB i social'), a rzeczywistosc wymagala pelnej warstwy z parytetem URL, bo publiczny landing zastepuje zaindeksowany serwis penyalodz.pl | Zmiana: Warunek wejscia w karcie: 'podmiana istniejacego, zaindeksowanego serwisu ⇒ pelna warstwa + parytet URL i plan cutoveru, nie minimalna higiena' [dowód: 6 artykulow pod ORYGINALNYMI slugami root-level w src/content/blog.ts + literalne trasy w App.tsx (commit adcd4d4, 26.07.2026); index.html l.16-17 'noindex until DNS cutover to penyalodz.pl'; DoD w SPRINT.md: 'stare URL-e dzialaja, noindex zdjety' + sitemap + GSC]"}]
tags: []
---

## Problem

Strony projektowane "od wyglądu" są niewidzialne dla maszyn, które dziś decydują o odkrywalności: crawlerów wyszukiwarek i answer engines (LLM-y, AI Overviews). Dorabianie tej warstwy po fakcie (przypadek r352.com: prerender dla SPA) kosztuje wielokrotnie więcej niż wbudowanie jej od startu.

## Mechanizm działania

Każdy publiczny artefakt akwizycyjny dostaje w v1 warstwę fundamentu w trzech pasmach: (1) **semantyka** — hierarchia nagłówków pod realne frazy, title/meta/OG; (2) **dane strukturalne** — JSON-LD (Person/Organization, Service, FAQPage), hreflang przy wersjach językowych; (3) **treść pod pytania (AEO)** — sekcja FAQ pisana jako bezpośrednie, samowystarczalne odpowiedzi na pytania frazowe klienta docelowego, bo answer engines cytują odpowiedzi, nie slogany. Warstwa jest częścią definicji ukończenia artefaktu — nie osobnym etapem "potem".

## Warunki sukcesu

- Pytania frazowe zebrane z briefu/benchmarku PRZED pisaniem treści
- Wszystkie liczby i fakty w odpowiedziach prawdziwe i zwalidowane przez klienta
- JSON-LD przechodzi walidator bez błędów; FAQ ma treściową wartość, nie keyword stuffing

## Warunki porażki

- Warstwa dodana "po designie" — semantyka kłóci się z layoutem, FAQ doklejone bez związku z resztą
- AEO mylone z kampanią SEO — fundament nie zastępuje contentu, linków i wizytówki Google
- Keyword stuffing zamiast odpowiedzi — answer engines premiują treść, kary za sztuczność

## Potencjał automatyzacji

Bardzo wysoki — semantyka, JSON-LD i szkielet FAQ są w pełni generowalne w sesji; walidacja faktów zostaje u człowieka. Kandydat na stały checkpoint w bramkach workflow.

## Transfer

Każdy publiczny artefakt webowy r352 i klientów. Sprzężenie z mech:agent-facing-distribution (AEO to jego podzbiór dla stron) i mech:competitive-benchmarking (benchmark dostarcza frazy i praktyki niszy).

## Version
- v1 · 2026-08-08 — karta z dyspozycji CEO (Trial #002): benchmarking + SEO/AEO jako etapy Genome; evidence wsteczne z DailyFruits i r352.com.
