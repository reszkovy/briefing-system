---
id: "rec:backtests/dimedical-redesign"
type: "record"
title: "Backtest — dimedical-redesign"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:dimedical-redesign"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — dimedical-redesign (PRZEBIEG B)

Data: 2026-08-09 · Protokół: PROTOKOL.md · T0 ≈ 31.07.2026 (przed sesją buildu 01.08).
Źródła przebiegu: memory/dimedical-redesign.md (stan 01–02.08), karta proj:dimedical-redesign (07–08.08),
katalog `Narzedzie do briefowania/dimedical-redesign/` (SPRINT.md, OFERTA-DIMEDICAL.md, build.py, i18n.py, 50 stron PL + 46 EN).
Zastrzeżenie hindsight jak w briefsync: wykonawca zna wynik — wartość dowodowa leży w strukturze pudeł, nie w % trafień.

## Pakiet T0 (skrót)

Serwis DiMedical ciężki (867 KB CSS+JS, ~11 MB assetów), przestarzały; Reszek projektował oryginał.
Projekt spekulacyjny bez zlecenia — cel: namacalny dowód jakości (case) do sprzedaży usługi redesignu
serwisów medycznych; ścieżka: publikacja jako własny koncept → pitch do DiMedical. r352 ma własne
silniki taniej produkcji (generatory statyczne, ekstrakcja treści).

## Skrót raportu Routera T0 (przebieg A — nieedytowany)

Rekomendowane: proof-first-demo-pitch (rdzeń), working-artifact-extraction, numeric-gates,
single-source-compiler, seo-aeo-foundation, competitive-benchmarking.
Odrzucone: design-as-code, split-url-architecture, deterministic-spine, compounding-channel.
Top ryzyka: (1) demo bez ścieżki do decyzji, (2) relacyjno-prawne ryzyko publikacji bez zgody,
(3) spec work poza proporcją, (4) braki danych/placeholdery, (5) one-off zamiast systemu.
Predykcje-SYGNAŁ bt:01–06 (p=0.85/0.75/0.60/0.70/0.65/0.55).

## Porównanie predykcji-SYGNAŁ z rzeczywistością

- **bt-01 (p=0.85) HIT.** Kompletny publiczny serwis PL+EN LIVE na dimedical.vercel.app zanim DiMedical
  cokolwiek zobaczył: 50 plików PL + 46 EN w repo (stan 08.08), Lighthouse zmierzony 02.08, OFERTA to
  wciąż draft niewysłany. Dowód: memory 01–02.08, `ls *.html`.
- **bt-02 (p=0.75) HIT (mocny).** Narracja sprzedażowa = wyłącznie liczby zewnętrzne: Lighthouse desktop
  100/100/100/100 (mobile 95/100/96/100), waga 1022→125 KB, load 1190→404 ms, H1 25/46→46/46, opisy
  2/46→46/46, pokrycie 356/357 bloków — cała tabela w OFERTA-DIMEDICAL.md. Zero argumentów estetycznych
  w pitchu.
- **bt-03 (p=0.60) HIT, z twistem.** Pitch niedomknięty w horyzoncie budowy: karta projektu 08.08 =
  `archived` z listą "zostało" (backend formularza, strona case przed/po, podmiana zdjęć); mail = draft;
  daty pokazu brak; strona case (SPRINT #5, "to ona sprzedaje") nie powstała. Twist: WYCENA nie brakuje
  przez dryf — została ŚWIADOMIE zastąpiona modelem "oddaję za darmo za prawo do case'u"
  (OFERTA-DIMEDICAL.md). Claim spełniony literalnie, ale mechanizm inny niż zakładany.
- **bt-04 (p=0.70) HIT.** `build.py` skleja partiale (_head/_nav/_foot) z `pages/*`, minifikuje, generuje
  sitemap/robots; `i18n.py` trzyma słownik UI + mapę slugów; EN kompilowany z tego samego źródła
  (treść EN wzięta z własnych tłumaczeń dimedical.pl, nie ręczna kopia stron).
- **bt-05 (p=0.65) HIT (mocny).** Zdjęcia laboratorium generowane (Higgsfield) na moment publikacji
  i jawnie zidentyfikowane jako pozycja remanentu: OFERTA "Do naprawienia przed wysłaniem" #2,
  SPRINT "Poza sprintem: podmiana zdjęć", memory "przed pokazaniem klientowi podmienić albo oznaczyć".
- **bt-06 (p=0.55) HIT.** Zero śladów formalnego benchmarku 3–5 serwisów medycznych (repo, SPRINT,
  pamięć); struktura = "architektura 1:1 z oryginałem" (SPRINT.md) + intuicja wizualna. Trafienie
  specyficzne — Router sam przewidział niewykonanie własnej rekomendacji.

**Wynik: 6/6 HIT** (bt-03 z odmiennym mechanizmem niż w uzasadnieniu). Uwaga falsyfikacyjna: bt-01/04
mają wysoki prior przy znanych silnikach r352 (słabsze dowodowo); bt-05/06 są rozstrzygalne i nietrywialne.

## Porównanie ryzyk

- **R1 (demo bez ścieżki do decyzji) HIT** — patrz bt-03.
- **R2 (relacyjno-prawne publikacji) HIT z ESKALACJĄ.** Rzeczywistość gorsza niż predykcja: 02.08
  oznaczenie konceptu ZDJĘTE na prośbę Reszka (plakietka, komentarz w head, X-Robots-Tag),
  `INDEKSOWANIE=True` — serwis "nieodróżnialny od oficjalnego DiMedical" i indeksowalny. Powód: blokada
  indeksowania = trzy osobno punktowane sygnały Lighthouse SEO. Warunek uczciwości ze SPRINT.md
  ("materiał musi jednoznacznie mówić, że to koncept") złamany przez własną bramkę liczbową.
- **R3 (spec work poza proporcją) częściowy.** Zakres urósł do pełnego mirroru 46 adresów × 2 języki
  (EN w SPRINT był P2, a i tak powstał w całości) — ale koszt zaabsorbowały silniki (build w ~2 sesje),
  więc ekonomia się nie zawaliła. Predykcja kierunkowo trafna, skutek zneutralizowany.
- **R4 (placeholdery niszczące wiarygodność) HIT** — patrz bt-05; obsłużone dokładnie wg warunku karty.
- **R5 (one-off zamiast systemu) MISS/mitygowany.** SPRINT jawnie sprzęga projekt z dry-runem Brand Hub
  OS (P1: scaffold, tokens.json, test ≥85) — intencja systemowa wpisana, choć P1 niewykonane na 08.08.

## Mechanism fit

- **Pełne trafienia (5/6):** proof-first-demo-pitch (rdzeń przebiegu; flaga karty niżej),
  working-artifact-extraction (treść 1:1, 356/357 bloków, EN z własnych tłumaczeń oryginału),
  numeric-gates (Lighthouse + tabela delt jako jedyna narracja; flaga karty niżej),
  single-source-compiler (build.py+i18n.py+partiale), seo-aeo-foundation (hreflang pl/en/x-default na
  każdej stronie, canonical z regułą trailing-slash, sitemap z SLUGI, JSON-LD MedicalOrganization
  w build.py:278/308 — warstwa w v1, nie dorabiana).
- **Rekomendowany-nieużyty (1/6):** competitive-benchmarking — bez widocznej szkody z pominięcia;
  standard dostarczył zaakceptowany artefakt-wzorzec (oryginał).
- **Użyty-nierekomendowany:** mech:incident-to-guard — incydent minifikatora JS (skasowana linia
  komentarza → przezroczysta strona) → guard `node --check` z auto-przywróceniem źródła w build.py;
  plus guardy QA panelu podglądu. Router nie sparował incident-to-guard z własnym pipeline'em build.
- **Odrzucenia:** wszystkie 4 słuszne (żaden z odrzuconych mechanizmów nie okazał się potrzebny).

## Raport 10 sekcji CEO

1. **Accuracy Routera.** Predykcje-SYGNAŁ 6/6 (dwie mocne i specyficzne: bt-05, bt-06; bt-03 trafiony
   innym mechanizmem). Ryzyka: 3 HIT / 1 częściowy / 1 mitygowany; R2 zmaterializowane MOCNIEJ niż
   przewidziano. Największa dziura: Router nie zobaczył, że sprawcą złamania warunku uczciwości będzie
   jego własna bramka liczbowa (konflikt numeric-gates ↔ oznaczenie konceptu).
2. **Accuracy Mechanism Selection.** 5/6 pełne, 1/6 nieużyty (competitive-benchmarking), 1 missed
   (incident-to-guard). Fit ≈ 83% rekomendacji skonsumowanych jako realny szkielet projektu; odrzucenia 4/4.
3. **Największe błędy.** (a) Goodhart niedostrzeżony: pogoń za Lighthouse SEO 100 zdemontowała noindex
   + plakietkę konceptu — metryka zjadła bezpiecznik; (b) założenie WYCENY jako warunku proof-first,
   podczas gdy realny model = barter "wdrożenie za prawa do case'u"; (c) bramka "% pokrycia PRZED
   buildem" bez zdefiniowanego mianownika — pomiar próbką 4 stron dał 87%, pełna sitemapa (46 adresów)
   ujawniła 28%, po dobudowie 86%; (d) brak rekomendacji incident-to-guard dla własnego pipeline'u.
4. **Największe sukcesy.** Kwartet proof-first × working-artifact-extraction × single-source-compiler ×
   numeric-gates okazał się dokładnym szkieletem przebiegu; bt-06 (benchmark nie powstanie) i bt-05
   (AI-zdjęcia jako remanent) to trafienia specyficzne, nie generyczne; hipoteza T0 "publish-then-pitch"
   zmaterializowała się jako decyzja ścieżki C z 01.08.
5. **Nowe mechanizmy (hipotezy).** (a) wariant/karta "free-for-case barter" — cena dowodu = przekazanie
   wdrożenia za prawa do publikacji case'u (odrębna ekonomia niż WYCENA); (b) guard "metric-integrity" —
   bramka liczbowa nie może wymuszać zdjęcia oznaczeń/bezpieczników (noindex, plakietka, disclaimery);
   konflikt metryka↔uczciwość eskalowany do decyzji człowieka, jawnie; (c) doprecyzowanie (nie nowy mech):
   pokrycie ekstrakcji liczone wobec PEŁNEGO inwentarza źródła (sitemapa), nigdy próbki + log
   sprzeczności źródła (posiew kału PL vs EN przeniesiony wiernie z błędem oryginału).
6. **Mechanizmy do usunięcia.** Brak. competitive-benchmarking do ZAWĘŻENIA triggera, nie usunięcia
   (drugi z rzędu projekt — po marka-tlumacz — gdzie benchmark nie wszedł przed v1; tu bez szkody).
7. **Confidence Changes (PROPOZYCJE — zapis robi sesja główna).**
   - proof-first-demo-pitch: +evidence postmortem (pełny modelowy przebieg) ORAZ flaga too-narrow
     (warunek WYCENA nie obejmuje barteru; wariant publish-then-pitch potwierdzony) — bez podbicia
     confidence do czasu rozstrzygnięcia, czy pitch zadziała (projekt niedomknięty!).
   - numeric-gates: +evidence postmortem, ale DOPISAĆ failure_condition Goodharta (E2) — flaga too-broad.
   - single-source-compiler, working-artifact-extraction, seo-aeo-foundation: +evidence postmortem
     (working-artifact-extraction z doprecyzowaniem metodyki pomiaru).
   - incident-to-guard: +evidence postmortem z projektu spoza rekomendacji (wzmacnia tezę briefsync,
     że to para obowiązkowa dla każdego własnego pipeline'u).
   - competitive-benchmarking: flaga wrong-trigger, bez zmiany confidence.
   - Dedupe: karta proj:dimedical-redesign weszła skanem CKO 07.08 — evidence z backtestu NIE sumować
     z narracją skanu tego samego projektu (niezmiennik 10).
8. **Nowe hipotezy.** (a) czy "free-for-case barter" konwertuje lepiej niż WYCENA przy zimnej/letniej
   relacji (rozstrzygnie wynik pitchu DiMedical); (b) czy trigger benchmarkingu powinien brzmieć
   "brak artefaktu-wzorca" zamiast "nieznana nisza"; (c) metric-integrity guard jako klasa (czy
   wystąpi w innych projektach z bramkami liczbowymi); (d) case-as-category-proof (a z T0) — wciąż
   nierozstrzygnięte, żaden drugi podmiot medyczny nie widział demo.
9. **Czego Genome nie wiedziało w T0.** (a) Historia oryginału szła przez podmiot (letsgobold, dawny
   wspólnik), z którym Reszek nie chce być kojarzony — to warunkuje FORMĘ pitchu (wersja neutralna
   w OFERTA-DIMEDICAL.md), czego żadna karta nie modeluje (relacja "ciepła" bywa obciążona); (b) że
   blokada indeksowania to trzy osobno punktowane sygnały Lighthouse SEO — techniczne źródło konfliktu
   Goodharta; (c) pełny inwentarz oryginału = 46 adresów sitemapy (mianownik pokrycia); (d) że EN
   istnieje na dimedical.pl jako ich własne tłumaczenia — radykalnie obniża koszt wersji EN;
   (e) że oryginał zawiera wewnętrzne sprzeczności, które wierna ekstrakcja przenosi dalej.
10. **Jak następny projekt będzie lepszy.** Każdy projekt z bramkami liczbowymi dostaje z automatu
    metric-integrity guard (lista bezpieczników, których metryka nie może ruszyć bez jawnej decyzji);
    każda ekstrakcja startuje od pełnego inwentarza źródła (sitemapa/crawl) jako mianownika pokrycia
    + log sprzeczności; Router pyta o MODEL CENY dowodu (wycena / barter za case / darmo) zamiast
    zakładać WYCENĘ; incident-to-guard rekomendowany domyślnie przy każdym własnym pipeline build.

## Evidence

- **E1** {observation: warunek karty proof-first "WYCENA na moment pokazu" zastąpiony świadomie modelem
  barterowym (wdrożenie za darmo w zamian za prawa do case'u); proof: OFERTA-DIMEDICAL.md (stan repo
  08.08, sekcja "Warunki"); impact: karta za wąska — Router błędnie przewidziałby artefakt WYCENA;
  proposed_change: rozszerzyć proof-first o wariant "free-for-case barter" (hipoteza publish-then-pitch);
  mechanisms: [proof-first-demo-pitch]}
- **E2** {observation: bramka Lighthouse SEO 100 wymusiła zdjęcie plakietki konceptu, komentarza w head,
  X-Robots-Tag i włączenie indeksowania — złamanie warunku uczciwości ze SPRINT.md; proof:
  memory/dimedical-redesign.md wpis 02.08 ("Oznaczenie konceptu ZDJĘTE… było potrzebne, żeby Lighthouse
  dał SEO 100") + build.py:26 `INDEKSOWANIE = True` + grep "koncept" w repo = 0 trafień (08.08);
  impact: numeric-gates bez failure_condition potrafi skonsumować bezpieczniki innych mechanizmów/ryzyk;
  proposed_change: failure_condition Goodharta w karcie numeric-gates + guard metric-integrity;
  mechanisms: [numeric-gates]}
- **E3** {observation: pomiar pokrycia merytoryki na próbce 4 stron dał 87% i był mylący — wobec pełnej
  sitemapy oryginału (46 adresów) realne pokrycie = 28%, po dobudowie 86%; proof:
  memory/dimedical-redesign.md, sekcja "Merytoryka: uwaga na sposób mierzenia" (01.08); impact: bramka
  Routera "% pokrycia policzony przed buildem" bez mianownika przepuszcza fałszywy sygnał;
  proposed_change: karta working-artifact-extraction: pokrycie liczone wyłącznie wobec pełnego
  inwentarza źródła + normalizacja diakrytyków obu stron; mechanisms: [working-artifact-extraction]}
- **E4** {observation: incydent minifikatora JS (uszkodzony site.js → przezroczysta strona) →
  guard `node --check` z przywróceniem źródła, nierekomendowany przez Router; proof:
  memory/dimedical-redesign.md 01–02.08 + build.py (kontrola obecna, stan 08.08); impact: miss
  selekcji — incident-to-guard należy się każdemu własnemu pipeline'owi build;
  proposed_change: reguła parowania w ROUTER.md: własny generator ⇒ incident-to-guard w pakiecie;
  mechanisms: [incident-to-guard, single-source-compiler]}
- **E5** {observation: rekomendowany competitive-benchmarking nie został wykonany (struktura z ekstrakcji
  oryginału 1:1), bez widocznej szkody; proof: brak artefaktów benchmarku w repo/SPRINT.md/pamięci
  (stan 08.08), SPRINT.md "architektura 1:1 z oryginałem"; impact: trigger karty za szeroki — obecność
  zaakceptowanego artefaktu-wzorca znosi potrzebę benchmarku wejściowego; proposed_change: zawęzić
  trigger do "brak artefaktu-wzorca akceptowanego przez rynek"; mechanisms: [competitive-benchmarking]}
- **E6** {observation: failure mode "demo bez ścieżki do decyzji" zmaterializowany — serwis LIVE
  i zarchiwizowany, a pitch niewysłany, strony case brak, daty pokazu brak; proof: karta
  proj:dimedical-redesign (status archived, "zostało…", 08.08) + SPRINT.md #5 niewykonane +
  OFERTA-DIMEDICAL.md jako draft; impact: potwierdzenie (drugi projekt, po campnou) głównego failure
  mode proof-first; proposed_change: +postmortem evidence w karcie proof-first, bramka wyjścia
  "data/kanał pokazu" jako twarda; mechanisms: [proof-first-demo-pitch]}
