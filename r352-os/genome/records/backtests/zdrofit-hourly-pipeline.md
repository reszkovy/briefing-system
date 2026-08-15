---
id: "rec:backtests/zdrofit-hourly-pipeline"
type: "record"
title: "Backtest — zdrofit-hourly-pipeline"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:zdrofit-hourly-pipeline"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — zdrofit-hourly-pipeline (PRZEBIEG B)

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
T0 = 04.07.2026. Okno obserwacji: 04.07–08.08.2026 (bt-07 sięga do 31.08 — formalnie otwarte).
Źródła przebiegu rzeczywistego: karta proj:zdrofit-hourly-pipeline (status archived, import CKO 07.08), memory/zdrofit-hourly-pipeline-goal.md (04.07), memory/briefing-tool-system.md, RAPORT-SYSTEMOWY-2026-08-07.md (sekcja Benefit/Zdrofit + Missed opportunities), GENOME-OS-SNAPSHOT-2026-08-08.md, /Users/reszek/Desktop/Claude_zadania/BENEFITSYSTEMS_ZDROFIT/ (SLOWNIK_FORMATOW.md i NOTATKI_SYNTEZA.md, mtime 04.07 14:24/14:29), briefsync/ (mtimes plików, daily.log do 07.08).

## Pakiet T0 (skrót)

Klient strategiczny (~49% przychodu, `rule:trello-read-only`), ~100 briefów/mies., mediana lead time 1 dzień; cel = automat co godzinę: Trello (read-only) → klasyfikacja → wstępne kreacje on-brand w Figmie z masterów → walidacja Reszka. Prerekwizyty: biblioteka masterów + proces walidacji (w toku), cron dopiero po pilotażu wakacyjnym. Genome zna: briefsync (klasyfikator 8 tablic pod launchd, incydenty izolacji stanu 26–28.06), ograniczenie `use_figma` (żywa sesja desktop), wzorzec "zbudowane, niewypuszczone".

## Raport Routera T0 (skrót)

**Rekomendowane:** format-dictionary, machine-narrows-human-picks, sandbox-promotion, deterministic-spine, agent-as-runtime, incident-to-guard. **Odrzucone:** design-as-code, numeric-gates, single-source-compiler, seo-aeo-foundation. **Workflow:** 6 bramek (korpus→słownik → mastery PRZED pętlą → klasyfikator deterministyczny → sandbox → pilot batch → pętla odrzuceń). **Top ryzyka:** (1) "zbudowane, niewypuszczone", (2) gałąź Figma niezgodna z "hourly", (3) generacja przed masterami, (4) brak pętli uczenia, (5) izolacja stanu multi-board. 7 predykcji bt:.

## Przebieg rzeczywisty (fakty)

- **Pipeline NIGDY nie wystartował.** RAPORT-SYSTEMOWY 07.08 (Missed opportunities + sekcja diagnoz, w. 157): "miesiąc po zdefiniowaniu celu (04.07) pętla nie wystartowała nawet jako ręczny batch dzienny". Zero cronów, zero batchy, zero wygenerowanych kreacji, zero rundy walidacji. Karta projektu: status `archived` przy imporcie CKO 07.08.
- **Słownik formatów i analiza korpusu istniały już W DNIU T0**: SLOWNIK_FORMATOW.md (v1, mtime 04.07 14:24) + NOTATKI_SYNTEZA.md (04.07 14:29) — zmierzony korpus 2843 kart Przemek NOWY + 421 PRZEDSPRZEDAŻE, rdzeń digital = 7 formatów potwierdzony na 5 klubach, 6 rodzin MASTER TASK, anatomia layoutu, stałe/zmienne per klub.
- **Biblioteka masterów "BS Fitness — Biblioteka Produkcyjna v1"**: na 04.07 "agent buduje... czeka na raport" (NOTATKI_SYNTEZA, status prac); brak jakiegokolwiek śladu ukończenia, walidacji ani iteracji po T0.
- **Klasyfikacja (briefsync) działała cały czas obok**: launchd daily od 19.07 (daily_note.py/daily.sh mtime 19.07), daily.log żywy do 07.08 (93 zmiany, 114 aktywnych briefów). Ale to briefsync (triage strumienia), nie klasyfikator formatów tego projektu — kod briefsync nie był modyfikowany pod hourly (briefsync.py mtime 27.06).
- **Zero incydentów na zasobach klienta** — trywialnie: nic nie zostało uruchomione, więc nic nie mogło niczego dotknąć.
- **Produkcja Zdrofit szła dalej ręcznie** w oknie obserwacji (zdrofit-lodygowa witryny, "Ćwicz w zieleni") — wolumen nie przeszedł przez żaden element pipeline'u.

## Porównanie predykcji

| ID | p | Werdykt | Uzasadnienie |
|---|---|---|---|
| bt-01 (cron nie ruszy do 04.08) | 0.80 | **HIT (mocny)** | Potwierdzone wprost w RAPORT-SYSTEMOWY 07.08; nawet batch ręczny nie wystartował. |
| bt-02 (bottleneck = gałąź Figma, klasyfikacja wcześniej/stabilniej) | 0.70 | **HIT (słaby)** | Kierunek trafiony: klasyfikacja (briefsync) żyje pod launchd, generacja nie istnieje. ALE mechanizm nietrafiony: nikt nawet nie PRÓBOWAŁ gałęzi Figma — realny korek to akt uruchomienia/priorytet, nie techniczna trudność Figmy. Trafienie po wyniku, nie po ścieżce przyczynowej. |
| bt-03 (mastery = główne miejsce iteracji/konfliktu) | 0.65 | **NIEROZSTRZYGNIĘTE** | Claim zakładał ITERACJĘ, która trwa dłużej niż planowano. W rzeczywistości brak śladu jakiejkolwiek iteracji po T0 — biblioteka po prostu zamarła w stanie "agent buduje". Opóźnienie tak, konflikt/iteracja — brak dowodu. Nie liczyć jako hit. |
| bt-04 (zero incydentów na zasobach klienta) | 0.90 | **HIT PUSTY (vacuous)** | Prawda, ale trywialna: zero zapisów, bo zero uruchomień. Predykcja nie odróżnia "governance działa" od "nic się nie wydarzyło". Nie kredytować sandbox-promotion tym trafieniem. |
| bt-05 (brak pętli uczenia w v1) | 0.70 | **HIT PUSTY (vacuous)** | Nie ma v1, więc nie ma pętli. Claim zakładał istnienie pierwszej wersji bez pętli — antecedent niespełniony. |
| bt-06 (≤8 rodzin pokryje ≥70%, jeśli zmierzone) | 0.60 | **NIEROZSTRZYGNIĘTE + błąd T0** | Po T0 pomiaru nie było. Ale pomiar w dużej mierze istniał JUŻ NA T0 (NOTATKI_SYNTEZA: 7 formatów rdzenia na 5 klubach, 6 rodzin MASTER TASK) — Router sformułował jako przyszły krok coś częściowo zrobionego. |
| bt-07 (do końca sierpnia zero zaakceptowanej partii) | 0.60 | **HIT-w-toku** | Na 08.08: zero partii, zero pilotażu, projekt zarchiwizowany jako cel niezrealizowany. Formalnie otwarte do 31.08, kierunek jednoznaczny. Uzasadnienie (korek = akt woli jedynego człowieka) zgodne z obserwacją lepiej niż bt-02. |

**Bilans uczciwy: 2 mocne trafienia (bt-01, bt-07-w-toku), 1 słabe (bt-02), 2 puste (bt-04, bt-05), 2 nierozstrzygnięte (bt-03, bt-06).** Struktura pudeł ważniejsza niż %: predykcje "governance" (04, 05) samopotwierdzają się przy niewykonaniu — zestaw nie zawierał claimów rozróżniających.

## Porównanie selekcji mechanizmów

- **agent-as-runtime — PEŁNY HIT (diagnoza).** Router nazwał strukturalną sprzeczność "hourly vs żywa sesja desktop" i przewidział nierealizowalność bez Figma REST. RAPORT-SYSTEMOWY 07.08 (w. 157–159) stawia identyczną diagnozę i identyczny fix (migracja na Figma REST z PAT). Jedyny mechanizm, którego zastosowanie (jako soczewka diagnostyczna) da się zweryfikować na tym przebiegu.
- **format-dictionary — CZĘŚCIOWY.** Słownik istnieje i jest jedynym żywym artefaktem projektu — ALE powstał w dniu T0, przed/równolegle z Routerem, i po T0 nie skonsumował go żaden przebieg. Bramka 1 workflow ("analiza min. 1 mies. realnych kart") rekomendowała pracę już wykonaną (2843 kart przeanalizowanych). Potwierdza flagę too-broad z bt#001: triage (briefsync, działa) i słownik formatów z masterami (zdrofit, zamarł) to osobne byty o zupełnie różnym losie.
- **sandbox-promotion — CZĘŚCIOWY (design-only).** Zasada "DO WALIDACJI" istnieje wyłącznie jako zapis intencji w memory/planie. Żadna generacja nie miała miejsca, więc sandbox nigdy nie był użyty ani przetestowany. UWAGA: ev:sandbox-promotion-001 w karcie cytuje ten projekt jako evidence — to inflacja dowodowa (intencja policzona jako wykonanie).
- **machine-narrows-human-picks — NIEUŻYTY.** Architektura decyzyjna zaprojektowana, nigdy nie uruchomiona. Rekomendacja niefalsyfikowalna na tym przebiegu.
- **deterministic-spine — NIEUŻYTY.** Klasyfikator formatów dla tego projektu nigdy nie powstał (briefsync.py nietknięty od 27.06). Rekomendacja słuszna a priori, zero danych z przebiegu.
- **incident-to-guard — NIEUŻYTY + zły trigger.** Pętla incydent→guard wymaga działającej rury produkującej incydenty; rekomendowanie jej projektowi w fazie prerekwizytów to rekomendacja bez powierzchni styku.
- **Odrzucenia (design-as-code, numeric-gates, single-source-compiler, seo-aeo)** — wszystkie zasadne; single-source-compiler jako "kandydat na etap 2" okazał się wręcz optymistyczny (etap 1 nie wystartował).
- **BRAK W REKOMENDACJACH: mech:dated-commitment-gates jako mechanizm PIERWSZOPLANOWY.** Router nazwał "zbudowane, niewypuszczone" ryzykiem #1, po czym zaprojektował 6-bramkowy łańcuch prerekwizytów bez żadnej forcing function — dated-commitment-gates zdegradowany do guarda wewnątrz bramki 5 (pilot), do której projekt nigdy nie doszedł. Workflow strukturalnie pogłębił ryzyko, które sam flagował. To największy błąd selekcji.

## Raport 10 sekcji

1. **Accuracy Routera:** wynik końcowy (nie-start) przewidziany wprost i z prawidłową przyczyną w bt-07 (akt woli jedynego człowieka), z przyczyną częściową w bt-01/02 (agent-as-runtime + wzorzec organizacyjny). Ale 2/7 predykcji to trafienia puste, a 2/7 nierozstrzygalne — realna moc predykcyjna: 3/7. Zastrzeżenie hindsight jak w bt#001 (wykonawca zna wynik): wartość = struktura pudeł.
2. **Accuracy Mechanism Selection:** 1/6 pełny hit (agent-as-runtime, jako diagnoza), 2/6 częściowe (format-dictionary, sandbox-promotion — artefakt/intencja bez przebiegu), 3/6 nieużyte (machine-narrows, deterministic-spine, incident-to-guard). Fit mierzalny ≈ 17–50% zależnie od liczenia design-only. Kluczowa obserwacja: przy projekcie, który nie wszedł w egzekucję, większość rekomendacji jest NIEFALSYFIKOWALNA — Router nie rozpoznał, że projekt o profilu "prerekwizyty + jedyny walidator + brak daty" potrzebuje najpierw mechanizmu wymuszającego start, a dopiero potem mechanizmów wykonawczych.
3. **Największe błędy:** (a) dated-commitment-gates nie w rekomendacjach głównych mimo ryzyka #1 — workflow dodał bramek zamiast forcing function; (b) bramka 1 (korpus→słownik) rekomendowała pracę wykonaną w dniu T0 — luka rekonstrukcji pakietu T0 (SLOWNIK + NOTATKI z 04.07 14:24 były wiedzą dostępną na T0); (c) predykcje bt-04/05 skonstruowane tak, że niewykonanie projektu je potwierdza — brak claimów rozróżniających; (d) inflacja dowodowa w kartach: ev:sandbox-promotion-001 i ev:format-dictionary-002 (mastery "w bibliotece", która nigdy nie została potwierdzona) liczą intencję/plan jako narracyjne evidence wykonania.
4. **Największe sukcesy:** (a) bt-01 i bt-07 — centralny wynik + prawidłowa przyczyna (przepustowość/odwaga jedynego człowieka w pętli), potwierdzone niezależnie przez CKO 07.08; (b) agent-as-runtime jako diagnoza strukturalna — raport systemowy doszedł do tego samego fixu (Figma REST) niezależnie; (c) wszystkie 4 odrzucenia mechanizmów zasadne; (d) ryzyko #1 nazwane bezbłędnie — problemem było niewyciągnięcie z niego konsekwencji projektowych.
5. **Nowe mechanizmy (hipotezy):** (a) mech:launch-forcing-batch — dla projektów o profilu "zbudowane, niewypuszczone" (prerekwizyty otwarte + jedyny walidator + brak daty startu) pierwszą bramką jest ZAWSZE datowany, minimalny pierwszy batch (np. 5 briefów ręcznie w tydzień 1), a prerekwizyty doskonalone NA batchu, nie przed nim; alternatywnie rozszerzenie mech:dated-commitment-gates o twardy trigger profilowy; (b) reguła protokolarna "vacuous-hit": predykcja backtestowa liczona jako HIT tylko, gdy zaobserwowano ścieżkę przyczynową claimu, nie sam wynik.
6. **Mechanizmy do usunięcia:** brak. Format-dictionary — podtrzymać podział z bt#001 (stream-triage vs słownik formatów): ten backtest to drugi niezależny dowód (dwa byty, dwa losy: triage żyje, słownik zamarł).
7. **Confidence Changes (WYŁĄCZNIE PROPOZYCJE — zapisy robi sesja główna):** (a) agent-as-runtime: PROPOZYCJA dodania evidence typu postmortem z tego backtestu (ograniczenie okazało się decydujące dla losu projektu; diagnoza Routera = diagnoza CKO) — kandydat na podbicie; (b) sandbox-promotion: PROPOZYCJA przeklasyfikowania ev-001 narracja→intencja (zero wykonania, zero wkładu do confidence) + reguła, że evidence z planów/memory bez przebiegu nie wspiera confidence; (c) format-dictionary: PROPOZYCJA flagi na ev-002 (mastery w "BS Fitness v1" niepotwierdzone — biblioteka w stanie "agent buduje" od 04.07); (d) machine-narrows, deterministic-spine, incident-to-guard: ZERO zmian z tego projektu (nietestowane — dedupe i uczciwość, niezmiennik 10).
8. **Nowe hipotezy:** (a) launch-forcing-batch (pkt 5); (b) hipoteza profilowa: prawdopodobieństwo nie-startu rośnie z liczbą bramek-prerekwizytów PRZED pierwszym kontaktem z realnym wolumenem — do zmierzenia na pozostałych backtestach (framework, Caterelo, ARToffNIA vs projekty, które wystartowały); (c) bt-06 (gruboogonowość rozkładu formatów) pozostaje żywą, testowalną hipotezą — dane są na dysku (korpus 2843 kart + słownik), test możliwy bez uruchamiania pipeline'u.
9. **Czego Genome nie wiedziało w T0:** (a) że korpus i słownik będą gotowe w dniu T0 (rekonstrukcja pakietu zaniżyła stan wiedzy — "prerekwizyty w toku" obejmowało rzeczy zrobione); (b) że briefsync będzie dalej rozwijany (daily 19.07) podczas gdy hourly zamarnie — automatyzacja zatrzymuje się dokładnie na granicy triage→generacja, nie gdziekolwiek; (c) że projekt zostanie zarchiwizowany bez ani jednej sesji roboczej na gałęzi generacji — żaden mechanizm wykonawczy nie dostał nawet próby; (d) że klasa "projekt bez daty startu z jedynym walidatorem" jest silniejszym predyktorem niż jakakolwiek własność techniczna stacku.
10. **Jak następny projekt będzie lepszy:** (a) Router przy profilu "zbudowane, niewypuszczone" MUSI dać forcing function jako mechanizm #1 (datowany minimalny batch przed doskonaleniem prerekwizytów); (b) rekonstrukcja T0 sprawdza mtime artefaktów na dysku, nie tylko deklaracje "w toku"; (c) zestaw predykcji musi zawierać ≥1 claim rozróżniający wykonanie od niewykonania (inaczej governance-predykcje są nietestowalne); (d) evidence w kartach z projektów bez egzekucji dostaje typ "intencja" i zerową wagę.

## Evidence (propozycje do zapisu przez sesję główną)

- E1 {obserwacja: diagnoza agent-as-runtime (hourly strukturalnie sprzeczny z żywą sesją desktop) okazała się decydująca — pipeline nie wystartował, a niezależna diagnoza CKO wskazała ten sam fix (Figma REST); dowód: RAPORT-SYSTEMOWY-2026-08-07.md w. 157–159 + karta proj (archived 07.08); wpływ: agent-as-runtime działa jako soczewka diagnostyczna przed budową, nie tylko jako wzorzec wykonawczy; zmiana: dodać failure-condition "hourly/bezobsługowe + desktop-only API = nierealizowalne bez migracji"; confidence: kandydat +postmortem; mech: agent-as-runtime}
- E2 {obserwacja: ev:sandbox-promotion-001 cytuje zdrofit-hourly jako evidence, choć żadna generacja nigdy nie zaszła — intencja z memory policzona jako wykonanie; dowód: karta sandbox-promotion.md (ev-001, source skan-cko 07.08) vs RAPORT-SYSTEMOWY 07.08 "pętla nie wystartowała nawet jako ręczny batch"; wpływ: inflacja dowodowa zawyża pewność mechanizmu; zmiana: przeklasyfikować ev-001 na typ "intencja" bez wkładu do confidence + reguła protokolarna; confidence: korekta w dół wkładu, nie karty; mech: sandbox-promotion}
- E3 {obserwacja: bramka 1 workflow (korpus→słownik, "analiza min. 1 mies.") rekomendowała pracę ukończoną w dniu T0 — SLOWNIK_FORMATOW.md v1 i NOTATKI_SYNTEZA (2843 kart) mają mtime 04.07 14:24/14:29; dowód: stat plików w /Users/reszek/Desktop/Claude_zadania/BENEFITSYSTEMS_ZDROFIT/; wpływ: Router marnuje bramki na zrobione kroki, gdy rekonstrukcja T0 opiera się na deklaracjach zamiast artefaktach; zmiana: krok "inwentaryzacja artefaktów na dysku" w budowie pakietu T0; confidence: n/d; mech: format-dictionary}
- E4 {obserwacja: drugi niezależny dowód podziału format-dictionary — triage strumienia (briefsync) żył i był rozwijany (daily.sh 19.07, log do 07.08), słownik formatów z masterami zamarł tego samego lata u tego samego klienta; dowód: mtimes briefsync/ + status archived karty proj + NOTATKI_SYNTEZA (biblioteka "agent buduje", nigdy niepotwierdzona); wpływ: dwa mechanizmy o różnych profilach ryzyka sklejone w jednej karcie; zmiana: wydzielić mech:stream-triage (hipoteza z bt#001, potwierdzona drugim projektem); confidence: bez zmian + podtrzymana flaga too-broad; mech: format-dictionary}
- E5 {obserwacja: Router nazwał "zbudowane, niewypuszczone" ryzykiem #1 i jednocześnie zaprojektował 6 bramek-prerekwizytów bez forcing function — dated-commitment-gates tylko jako guard bramki 5, do której nie doszło; dowód: raport Routera T0 (sekcje Workflow i Ryzyka) vs wynik (archived, zero batchy); wpływ: selekcja mechanizmów niespójna z własną analizą ryzyka — klasa błędu Routera, nie karty; zmiana: twardy trigger — profil "prerekwizyty + jedyny walidator + brak daty" ⇒ dated-commitment-gates/launch-forcing-batch jako mechanizm #1; confidence: n/d; mech: dated-commitment-gates}
