---
id: "mech:static-i18n-mirror"
type: "mechanism"
title: "Lustro językowe na statycznym generatorze"
status: "hypothesis"
created: "2026-08-14"
updated: "2026-08-14"
version: 1
owner: "session"
confidence: {"value":"hypothesis","evidence_strength":{"n":0,"projects":0,"independent_sources":0,"types":{},"last_confirmed":null},"recommendation":"test-first"}
category: "Production Scaling"
relations: {"implements":["prin:single-source-of-truth"],"related":["mech:single-source-compiler","mech:seo-aeo-foundation","mech:split-url-architecture","mech:working-artifact-extraction"]}
trigger: "Serwis statyczny na własnym generatorze (build.py / SSG) ma dostać drugą wersję językową bez przepisywania architektury i bez wprowadzania CMS-a. Sygnał w briefie: \"potrzebujemy tego po angielsku\", \"wchodzimy na rynek X\", przy stronie, której treść siedzi już w plikach danych."
context: "Projekty ze statycznym buildem i treścią trzymaną w plikach (JSON/MD), gdzie publikacja przechodzi przez repo. Im więcej stron, tym większa dźwignia — koszt infrastruktury jest stały, koszt tłumaczenia liniowy i zrównoleglalny."
anti_context: "Nie stosować przy treści szybkozmiennej bez pipeline'u publikacji per język — lustro rozjedzie się natychmiast, a koszt ×2 wraca przy każdej publikacji. Nie stosować, gdy klient oczekuje lokalizacji kulturowej (inne przykłady, inne case studies) zamiast tłumaczenia — to inny zakres. Nie stosować, gdy treść jest wklejona w HTML zamiast w plikach danych: nakładka nie ma na czym usiąść i robota zamienia się w ręczne tłumaczenie szablonów."
inputs: ["Działający generator statyczny z treścią w plikach danych","Decyzja o strategii adresacji: prefiks języka vs tłumaczone slugi","Glosariusz terminów kanonicznych z rozstrzygniętą odmianą nazw własnych","Decyzja, co NIE podlega tłumaczeniu (treści okresowe, cytaty źródłowe, nazwy własne)","Lista stron poza główną pętlą render(): 404, wstęgi, strony indeksowe"]
ai_tasks: ["Rozszerzenie generatora o parametr lang: rama per język, słownik UI[lang], prefiksowanie linków wewnętrznych","Warstwa SEO w jednym miejscu: hreflang, per-język canonical, og:locale, JSON-LD inLanguage, sitemap, llms.txt","Napisanie SPEC tłumaczeniowej (głos, glosariusz, zasady HTML) i fan-out agentów partiami po 4-8 stron","Walidacja json.load po każdym pliku i normalizacja terminologii zgłoszonej przez agentów","Przegląd stron spoza pętli render() pod kątem literałów zamiast parametru lang"]
human_tasks: ["Przemek-decyzja: prefiks vs tłumaczone slugi (utrzymanie kontra long-tail SEO)","Przemek-decyzja: rozstrzygnięcie spornych terminów w glosariuszu przed pierwszą partią","Klient: akceptacja, że publikacja nowej strony obejmuje oba języki w jednym commicie"]
expected_outcome: "Druga wersja językowa całego serwisu powstaje w jednej sesji zamiast w projekcie, bez zmiany architektury i bez CMS-a, z kompletną warstwą hreflang/canonical od pierwszego builda. Koszt utrzymania rośnie o stałą (publikacja ×2), nie o drugi serwis."
evidence: []
tags: ["frontend","copy","seo"]
---

## Problem

Serwis statyczny ma dostać drugą wersję językową. Domyślne wyjścia są dwa i oba są złe:
skopiować cały katalog i tłumaczyć w miejscu (lustro rozjeżdża się przy pierwszej zmianie),
albo wstawić CMS z wtyczką wielojęzyczną (przebudowa architektury dla jednej funkcji).
Osobno dochodzi warstwa, o której łatwo zapomnieć aż do audytu SEO: bez hreflang i per-język
canonical wyszukiwarka traktuje obie wersje jak duplikat i sama wybiera, którą pokazać.

## Mechanizm działania

Drugi język jest NAKŁADKĄ na istniejący generator, nie drugim serwisem.

1. Rama per język, treść per plik. Rama (header/footer/nav) ma jedno źródło prawdy na język.
   Treść: katalog `content-<lang>/` z JSON-ami o tych samych kluczach co strony bazowe.
   Tłumaczenie nadpisuje pola, nie kopiuje systemu.
2. Słownik UI w generatorze. Etykiety renderera (Key facts, FAQ, Sources, TL;DR, podpisy,
   wstęgi CTA) w jednym dict UI[lang]. Bez tego rozjazd wchodzi bokiem, przez f-stringi.
3. Adresacja prefiksem (`/pl/...`), slugi nietłumaczone. Linki wewnętrzne dostają prefiks
   mechanicznie, co eliminuje mapę slugów i martwe linki. Wariant z tłumaczonymi slugami
   (DiMedical) daje lepszy long-tail, ale kosztuje utrzymanie mapy — wybór zależy od tego,
   czy klient będzie sam dodawał strony.
4. SEO od pierwszego builda, nie po fakcie: hreflang en/pl/x-default na KAŻDEJ parze,
   per-język canonical, og:locale, JSON-LD inLanguage, obie wersje w sitemap, nota w llms.txt.
5. Tłumaczenie jako fan-out agentów ze SPEC: jeden dokument (głos, glosariusz terminów
   kanonicznych, zasady HTML — nie ruszać tagów, encji i URL-i zewnętrznych, prefiksować
   wewnętrzne), partie po 4-8 stron, `json.load` po każdym pliku, wątpliwości terminologiczne
   raportowane jednolinijkowo do integratora.

## Warunki sukcesu

- Generator już istnieje i jest utrzymywany — mechanizm dokłada warstwę, nie zakłada projektu
- Treść jest w plikach danych, nie wklejona w HTML (inaczej nakładka nie ma na czym usiąść)
- Glosariusz przesądza odmianę nazw własnych PRZED pierwszą partią tłumaczeń
- Publikacja nowej strony obejmuje oba języki w tym samym commicie

## Warunki porażki

- Treść szybkozmienna bez pipeline'u publikacji per język — lustro rozjeżdża się natychmiast,
  a koszt stały ×2 płaci się przy każdej publikacji
- Klient oczekuje lokalizacji kulturowej (inne case studies, inne przykłady), nie tłumaczenia
  — to jest inna robota i inny mechanizm, nie ten
- Sekcje generowane f-stringiem z literałami zamiast parametru `lang` — cicha dziura,
  widoczna dopiero na wyrywkowym przeglądzie stron

## Znane pułapki

(a) Strony poza główną pętlą `render()` — 404, wstęgi CTA, strony indeksowe — najłatwiej
przeoczyć, bo nie ma ich w listingu.
(b) Treści okresowe (newsletter, aktualności): uczciwiej dopisać notę o języku oryginału
niż udawać pełną lokalizację.
(c) Glosariusz bez rozstrzygniętej odmiany nazw własnych rozjeżdża partie tłumaczone równolegle.

## Status dowodowy

Karta powstaje jako HYPOTHESIS z zerowym Evidence i to jest stan faktyczny, nie formalność.
Dwa wdrożenia istnieją (thehermeticum EN→PL, 45 stron pod `/pl/`; DiMedical PL→EN w wariancie
z tłumaczonymi slugami), ale żadne nie zostało rozliczone postmortemem ani pomiarem. Nie wiadomo,
czy lustro utrzymało się po pierwszej rundzie zmian treści — a to jest jedyne pytanie, które
w tym mechanizmie naprawdę rozstrzyga. Pierwsze Evidence ma wejść z postmortemu thehermeticum
po pierwszej publikacji treści następującej po uruchomieniu lustra.
