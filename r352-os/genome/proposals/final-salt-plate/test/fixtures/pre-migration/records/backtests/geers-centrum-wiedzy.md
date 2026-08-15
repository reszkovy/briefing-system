---
id: "rec:backtests/geers-centrum-wiedzy"
type: "record"
title: "Backtest — geers-centrum-wiedzy"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — geers-centrum-wiedzy (proj:geers-centrum-wiedzy)

Data: 2026-08-09 · Protokół: PROTOKOL.md · T0 ≈ 27.05.2026.
Źródła przebiegu rzeczywistego: karta proj:geers-centrum-wiedzy (v2, 08.08), memory/sonova-geers-landings.md, foldery `/Users/reszek/SONOVA_BRAND_LANDINGS/` (README.md z logiem iteracji, `geers-DEPLOY/` z datami plików; brak gita — datowanie po mtime).

## Pakiet T0 (skrót)

Geers PL (Sonova) — 2 LP per intencja (refundacja NFZ 1050 zł vs Virto P Titanium premium) + brand voice/visual guide + flow aplikacji protetyka, spięte hubem. Reżim: 98-stronowy AudioNova Branding Guidelines Feb 2025 + „Geers nowy kierunek komunikacji" + żywy geers.pl. Stack: standalone HTML/CSS, TWK Lausanne, Vercel.

## Skrót raportu Routera (przebieg A — nienaruszony)

Rekomendowane (5): working-artifact-extraction (rdzeń), single-source-compiler, competitive-benchmarking (test-first), session-to-sop, proof-first-demo-pitch (pomocniczy). Odrzucone (4): seo-aeo-foundation, format-dictionary, deterministic-spine, split-url-architecture. Predykcje SYGNAŁ bt-01…bt-07 (poniżej). Workflow z 4 bramkami (kanon, benchmark, self-check compliance, akcept guide'a).

## Przebieg B — Porównanie z rzeczywistością

### Predykcje SYGNAŁ

- **bt-01 (p=0.85) HIT.** Guide powstał z destylacji brand booka SKONFRONTOWANEJ z audytem live: README.md loguje wprost „v2 (27 maja) — fix po deep audit geers.pl live (logo, kolory, weights)" — rozbieżności deklaracje-vs-live nazwane w iteracjach. Najmocniejszy hit backtestu.
- **bt-02 (p=0.75) HIT słaby.** ≥2 rundy iteracji z PUNKTOWYCH wymogów brand booka zaszły (v1→v2→v3 27–30.05: „8 priorytetów: −2% body tracking, max 3 circular forms, line texture, 2 shades of white, 4 gradienty"; potem landing1-v2/landing2-v2 31.05). ALE mechanizm inny niż w uzasadnieniu: iteracje były SAMONARZUCONE (self-check przed pokazem — czyli dokładnie Bramka 3 routera), nie wymuszone przez korporacyjny ping-pong po fakcie. Litera claima trafiona, przyczynowość z uzasadnienia — nie. Brak śladu rund uwag klienta w źródłach.
- **bt-03 (p=0.60) MISS.** Font NIE okazał się osobnym problemem: zwykłe `@font-face` z lokalnych ttf/otf (300/350/500), zero base64/subsetu, zero mapy substytutów, zero śladu walki. Jedyny „ślad" to kopiowanie folderu `fonts/` per landing — czyli rutyna, nie bloker. Router przeniósł failure mode fontów z innych projektów na projekt, w którym pliki fontów po prostu były na dysku (od 12.2025).
- **bt-04 (p=0.65) PARTIAL — litera tak, duch nie.** Fakt: tokens.json nie powstał, CSS `:root` jest DUPLIKOWANY per plik (identyczne bloki zmiennych w validator/index.html i biblioteka/index.html), landingi v2 to pełne kopie folderów. ALE predykcja „destylat pozostanie HTML-owym guide'em / umrze jako notatka" jest jakościowo błędna: destylat SFORMALIZOWANO dalej niż ktokolwiek przewidział — `.geers-brand/` (16.06) = Brand Operating System: BRAND.md + AGENT.md (uniwersalny kontekst dla AI agentów) + CLAUDE.md + PROMPTS.md, do tego walidator compliance i biblioteka promptów. Maszynowym źródłem stały się pliki .md dla agentów, nie tokeny dla kompilatora.
- **bt-05 (p=0.55) HIT.** Hub pozostał na vercel.app (geers.vercel.app / geers-brand.vercel.app), LP z placeholderami (voivodeship picker, formularz, social), WCAG w toku — nie weszły do produkcyjnych kampanii w tym cyklu.
- **bt-06 (p=0.60) HIT słaby.** Zakres rozszerzył się masywnie: landing3 (03.06), protetyk app flow (09.06), validator + biblioteka + `.geers-brand/` (16.06), video-rebrand SCENARIUSZ+SHOTLIST (07.2026), mailing drybox (29.07), PROMPTY-AI-ZDJECIA (30.05). Claim trafiony z nadwyżką, ALE część „zainicjowany przez klienta po zobaczeniu huba" jest nieweryfikowalna ze źródeł (brak maili/logów decyzji) — hit na zdarzeniu, nie na przyczynowości.
- **bt-07 (p=0.75) HIT.** Zero śladu formalnego benchmarku niszy przed v1 (żadnego pliku/notatki benchmarkowej w folderach); LP1 refundacyjny NIE ma kalkulatora refundacji (grep „kalkulator" = 0 trafień w geers-landing-1050-nfz/index.html) — przewidziany brak standardu niszy zmaterializował się w wariancie „albo wcale".

**Bilans SYGNAŁ: 5 HIT (2 słabe) / 1 PARTIAL / 1 MISS z 7.** Zastrzeżenie hindsight jak w pilocie: wykonawca zna wynik; wartość = struktura pudeł.

### Mechanizmy

- **working-artifact-extraction — FULL HIT.** Deep audit live + destylacja z dwóch źródeł, rozbieżności nazwane, destylat nie umarł jako notatka. Wzorcowa realizacja karty (i to PRZED jej istnieniem — projekt pre-genome).
- **session-to-sop — FULL HIT z nadwyżką.** Kodyfikacja przekroczyła rekomendację „checklisty compliance": powstał cały `.geers-brand/` + interaktywny walidator + biblioteka 12 promptów ze Skills Builderem.
- **proof-first-demo-pitch — PARTIAL.** Hub zdeployowany, ekspansja zakresu nastąpiła (bt-06), ale przyczynowość „hub jako dowód → kolejne zlecenia" nieudokumentowana. Dodatkowo router dał temu mechanizmowi „rolę pomocniczą", a hub ewoluował w quasi-produkt (brand stack) — waga zaniżona.
- **single-source-compiler — WRONG (rekomendowany, nieużyty).** Rzeczywistość to anty-wzorzec z karty: `:root` kopiowany per plik, fonty kopiowane per folder, landingi v2 jako pełne duplikaty. Diagnoza kosztu była słuszna, ale mechanizm nie miał żadnej ścieżki adopcji — rekomendacja bez enforcementu. Router sam to hedgował w bt-04 (przewidział porażkę własnej rekomendacji).
- **competitive-benchmarking — WRONG (rekomendowany test-first, nieużyty).** Zgodnie z bt-07. Uwaga metodologiczna: router jednocześnie rekomenduje mechanizm i przewiduje p=0.75, że nie zostanie użyty — w backteście retrodykcyjnym to sprzeczność wewnętrzna raportu (normatywne vs opisowe niesplecione).
- **Odrzucenia:** seo-aeo-foundation, deterministic-spine — słusznie (zero śladu potrzeby). split-url-architecture — odrzucenie OK mimo że kuracja 08.08 nazywa LP per intencja „zalążkiem split-url"; to luźna analogia, nie architektura dwóch systemów URL. **format-dictionary — BŁĘDNE ODRZUCENIE (missed-used).** Projekt zbudował dokładnie słownik formatów: /biblioteka z composable Skills Builder „Voice × Audience × Channel × Format = 1350 kombinacji" + PROMPTS.md z 12 szablonami per kanał. Router odrzucił kartę argumentem „wolumen ≥kilkadziesiąt/mies. po stronie r352" — a amortyzacja przyszła PO STRONIE KLIENTA (zespół Geers generuje wolumen, r352 dostarcza słownik). Trigger karty ma złą perspektywę: liczy się wolumen użytkownika słownika, nie wolumen produkcji r352.

**Fit:** 2/5 full, 1/5 partial, 2/5 wrong (nieużyte) ≈ 50–60%; miss rate: 1 (format-dictionary użyty-a-odrzucony). Wyraźnie słabiej niż pilot briefsync.

## Raport 10 sekcji

1. **Accuracy Routera:** predykcje 5/7 hit (w tym 2 słabe), 1 partial, 1 miss ≈ 70–75% nominalnie; po zdjęciu słabych/nieweryfikowalnych ~50–60% twardych. Problem biznesowy i klasa projektu („brand system w miniaturze") zdiagnozowane trafnie — projekt faktycznie stał się systemem brandowym, bardziej niż kampanią.
2. **Accuracy Mechanism Selection:** 2 full (WAE, session-to-sop), 1 partial (proof-first — zaniżona waga), 2 wrong-nieużyte (single-source-compiler, competitive-benchmarking), 1 missed-used (format-dictionary). Najgorszy wynik selekcji dotąd — ale asymetryczny: to, co trafione, trafione 1:1.
3. **Największe błędy:** (a) odrzucenie format-dictionary przy projekcie, który zbudował bibliotekę 1350 kombinacji formatów — trigger karty patrzy na wolumen produkcji r352 zamiast wolumen UŻYTKOWNIKA słownika; (b) bt-03: mechaniczne przenoszenie failure mode fontów bez sprawdzenia warunków brzegowych (pliki fontów istniały od miesięcy); (c) rekomendowanie single-source-compiler bez ścieżki adopcji + jednoczesne przewidywanie jego porażki (bt-04) — raport wewnętrznie niespójny; (d) niedoszacowanie proof-first: „rola pomocnicza" vs rzeczywisty motor ekspansji w quasi-produkt.
4. **Największe sukcesy:** (a) bt-01 — wzorzec WAE potwierdzony na projekcie PRE-genome (destylacja+audyt live to zachowanie systemowe r352, nie artefakt kart); (b) bt-05/bt-07 — trzeźwe przewidzenie, że hub nie wejdzie do produkcji i benchmarku nie będzie; (c) session-to-sop — jedyna karta, której realizacja PRZEKROCZYŁA rekomendację; (d) bt-02: przewidziane punktowe wymogi brand booka jako oś iteracji (choć z innym mechanizmem sprawczym).
5. **Nowe mechanizmy (hipotezy):** **mech:brand-os-for-agents** — destylat brandu pakowany jako pliki kontekstowe dla AI agentów (BRAND/AGENT/CLAUDE/PROMPTS.md) + walidator + biblioteka promptów; klient dostaje nie guide, tylko operacyjny system, w którym KAŻDE narzędzie AI klienta pisze on-brand. To nie jest ani WAE (ekstrakcja), ani session-to-sop (SOP wewnętrzny) — to produktyzacja destylatu po stronie klienta. Geers zrobił to w 06.2026, zanim Genome istniało.
6. **Mechanizmy do usunięcia:** brak. format-dictionary do KOREKTY TRIGGERA (perspektywa: czyj wolumen), nie do usunięcia; single-source-compiler wymaga dopisania failure mode „rekomendacja bez bramki adopcji = duplikacja per plik".
7. **Confidence Changes (PROPOZYCJE — zapis robi sesja główna):** WAE: +evidence typu postmortem (retro, bt-01, projekt spoza dotychczasowej puli evidence karty — wzmacnia bez double-countingu, o ile kuracja 08.08 nie wpisała już tego faktu jako evidence). session-to-sop: +evidence postmortem (`.geers-brand/` + validator). format-dictionary: flaga wrong-trigger + evidence korygujące (bez podbicia). single-source-compiler: evidence negatywne do failure_condition (adopcja), bez zmiany confidence. competitive-benchmarking: słabe evidence wspierające genezę karty (brak benchmarku → brak kalkulatora refundacji), pozostaje hypothesis. proof-first-demo-pitch: bez zmiany (przyczynowość nieudokumentowana).
8. **Nowe hipotezy:** (a) trigger format-dictionary przepisać na „istnieje strona generująca wolumen komunikatów (klient LUB r352) ≥kilkadziesiąt/mies."; (b) router powinien mieć regułę spójności: mechanizm rekomendowany, którego nieużycie przewiduje z p≥0.7, musi dostać bramkę wymuszającą albo spaść do „opcjonalny"; (c) predykcje o failure mode technicznym (fonty/CSP) wymagają sprawdzenia warunku brzegowego w T0 (czy zasób już jest rozwiązany), nie samego pattern-matchingu.
9. **Czego Genome nie wiedziało w T0:** że destylat brandu może stać się produktem dla agentów AI klienta (klasa brand-os-for-agents nie istnieje w kartach); że iteracje compliance mogą być samonarzucone przed pokazem (self-check jako zachowanie naturalne, nie bramka do wymuszenia); że fonty TWK Lausanne były już fizycznie w zasobach (12.2025); że projekt będzie niewidzialny dla skanu CKO przez brak pliku pamięci (luka systemowa wykryta dopiero 08.08).
10. **Jak następny projekt będzie lepszy:** przy każdym kliencie z brand bookiem pytanie bramkowe „kto po naszej stronie zlecenia będzie GENEROWAŁ komunikaty i czym" (→ format-dictionary/brand-os zamiast samego guide'a); rekomendacja single-source dostaje z automatu konkretny artefakt-nośnik (jeden plik CSS/tokens importowany, nie kopiowany) jako bramkę wejściową buildów; predykcje techniczne walidowane inwentarzem zasobów w T0.

## Evidence (do zapisania w kartach + Ledger przez sesję główną)

- E1 {observation: router odrzucił format-dictionary, a projekt zbudował słownik formatów po stronie klienta (biblioteka 1350 kombinacji + 12 promptów); proof: `geers-DEPLOY/biblioteka/index.html` (mtime 16.06.2026) + `.geers-brand/PROMPTS.md` („Voice × Audience × Channel × Format = 1350 kombinacji", 16.06.2026); impact: trigger karty patrzy na złą stronę wolumenu → błędne odrzucenia u klientów wolumenowych; proposed_change: przepisać trigger na wolumen użytkownika słownika + flaga wrong-trigger; mech: format-dictionary}
- E2 {observation: destylacja brand booka skonfrontowana z audytem żywego geers.pl, rozbieżności nazwane w logu iteracji; proof: `SONOVA_BRAND_LANDINGS/README.md` — „v2 (27 maja 2026) — fix po deep audit geers.pl live (logo, kolory, weights)"; impact: WAE potwierdzone jako zachowanie systemowe r352 na projekcie pre-genome; proposed_change: +evidence postmortem w karcie WAE (po sprawdzeniu dedupe z kuracją 08.08); mech: working-artifact-extraction}
- E3 {observation: kodyfikacja sesji przekroczyła SOP — powstał kompletny Brand OS dla agentów AI + walidator compliance; proof: `geers-DEPLOY/.geers-brand/` (BRAND.md, AGENT.md, CLAUDE.md, PROMPTS.md, README.md — 16.06.2026) + `geers-DEPLOY/validator/index.html` (16.06.2026); impact: nowa klasa mechanizmu (brand-os-for-agents) niepokryta kartami; proposed_change: +evidence postmortem session-to-sop + nowa karta-hipoteza; mech: session-to-sop}
- E4 {observation: single-source-compiler rekomendowany, nieużyty — identyczne bloki `:root` duplikowane per plik, fonty kopiowane per folder, landingi v2 jako pełne kopie; proof: porównanie `:root` w `geers-DEPLOY/validator/index.html` i `geers-DEPLOY/biblioteka/index.html` (16.06.2026), foldery `landing1-v2/`, `landing2-v2/` (31.05.2026); impact: rekomendacja bez ścieżki adopcji nie zmienia zachowania; proposed_change: failure_condition „brak bramki adopcji = duplikacja" w karcie; mech: single-source-compiler}
- E5 {observation: brak jakiegokolwiek benchmarku niszy przed v1; LP refundacyjny bez kalkulatora refundacji; proof: brak plików benchmarkowych w `SONOVA_BRAND_LANDINGS/` + grep „kalkulator"=0 w `geers-landing-1050-nfz/index.html` (build 05.2026); impact: potwierdza genezę karty competitive-benchmarking (luka procesu przed 08.2026); proposed_change: słabe evidence wspierające, karta zostaje hypothesis; mech: competitive-benchmarking}
- E6 {observation: zakres rozszerzył się o ≥4 formaty po zbudowaniu huba (landing3, protetyk, mailing, video-rebrand, prompty AI-zdjęcia), przyczynowość pitchowa nieudokumentowana; proof: mtime folderów `landing3/` 03.06, `protetyk/` 09.06, `geers-video-rebrand/` 23.07, `geers-mailing/` 29.07.2026; impact: wzorzec ekspansji przez działający artefakt prawdopodobny, ale bez dowodu przyczyny; proposed_change: bez zmiany confidence proof-first; mech: proof-first-demo-pitch}
