---
id: "rec:backtests/zdrofit-cwicz-w-zieleni"
type: "record"
title: "Backtest — zdrofit-cwicz-w-zieleni"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:zdrofit-cwicz-w-zieleni"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — zdrofit-cwicz-w-zieleni

Data: 2026-08-09 · Protokół: PROTOKOL.md · Przebieg B (audyt falsyfikacyjny)
T0 ≈ przełom 07/08.2026 (zadanie z Trello „Przemek NOWY"). Źródła przebiegu rzeczywistego: memory/zdrofit-cwicz-w-zieleni.md (zapis 02.08.2026), karta proj:zdrofit-cwicz-w-zieleni (import CKO 07.08), SLOWNIK_FORMATOW.md (BENEFITSYSTEMS_ZDROFIT, v1 04.07), folder brand-hub/fonts (Aptly-*.otf).

**Zastrzeżenie horyzontu dowodowego:** znany przebieg kończy się na 02–07.08 — event 21.08 jeszcze się nie odbył, finalizacja (logotypy Krakowa, druk A4, akcept klienta) NIEZWERYFIKOWANA. Predykcje o „ostatniej mili" oceniane na stanie znanym; część werdyktów warunkowa.

## Pakiet T0 (skrót)

Master FB 1080×1320 zaakceptowany → 10 formatów o różnych proporcjach i regułach per format (część bez logo, część bez napisów, newsletter zaokrąglone rogi, plakat A4 300 dpi); bloker: font Aptly niedostępny w chmurowym środowisku Figma MCP (loadFontAsync błąd); co-brand z miastem Kraków (logotypy zewnętrzne); deadline eventowy 21.08.

## Skrót raportu Routera (przebieg A — nie poprawiany)

Rekomendowane: single-source-compiler, format-dictionary (wariant słownika reguł), design-as-code, sandbox-promotion, negative-knowledge-ledger. Odrzucone: numeric-gates, deterministic-spine, machine-narrows-human-picks, dated-commitment-gates, seo-aeo-foundation. Ryzyka top-5: font-substytut, logotypy Krakowa jako ostatnia mila, reguły w głowie zamiast specu, A4 z rastra, praca w zasobie klienta bez sandboxu. Predykcje SYGNAŁ: bt-01…bt-06 (poniżej).

## Przebieg rzeczywisty (rekonstrukcja ze źródeł)

- Plik Figma **własny r352** („team reszek", key tmBVy2Co1BlQtnJ9iuilDC) — NIE plik produkcyjny klienta. 10 ramek w rzędzie z podpisami-regułami.
- Reformaty: pionowe (FB/IG/A4) przez **clone+rescale+center-crop** mastera; poziome + Stories + Newsletter **zbudowane od zera z komponentów mastera** (zdjęcie na tło + scrim + sklonowane logo/headline/data per format); www 360 i 832×416 = samo zdjęcie. Ręczna robota w Figmie, żadnego kompilatora/skryptu reformatów.
- Font Aptly: obejście przez **fontTools → SVGPathPen glify → createNodeFromSvg** (arc.py w scratchpadzie), efekt = prawdziwy Aptly jako wektor 1:1; limit + wzorzec zapisany w auto-memory jako para „co nie działa → co robić zamiast".
- A4 2480×3508 wykonany **tą samą ścieżką co formaty digital** (clone+rescale), bez osobnej ścieżki render/wektor.
- Stan 02–07.08: wszystkie 10 formatów wykonane, projekt **czeka na logotypy miasta Kraków**.
- SLOWNIK_FORMATOW.md (istniał przed T0) — zero wpisu rodziny „event FB → komplet formatów" (grep: brak „zieleni/krakus").

## Predykcje SYGNAŁ — werdykty

| ID | p | Werdykt | Uzasadnienie |
|---|---|---|---|
| bt-01 (font: obejście po stronie r352, nie naprawa środowiska) | 0.85 | **HIT (mocny)** | Wektoryzacja glifów fontTools→SVG→createNodeFromSvg; loadFontAsync nadal nie działa. Trafiony nawet wymieniony wariant („wektoryzacja/wstawienie tekstu jako grafiki"). |
| bt-02 (wszystkie 10 z reformatu mastera, różnice jako reguły) | 0.80 | **PARTIAL (słaby hit)** | Żaden format nie dostał niezależnej kreacji (wspólne KV/zdjęcie/klonowane elementy) i reguły per format zrealizowane — ALE ~6 formatów memory opisuje wprost „zbudowane od zera" z komponentów; to ręczny rebuild per format, nie reformat parametryczny. Litera claimu na granicy. |
| bt-03 (logotypy Krakowa = ostatnia mila, produkcja skończona zanim dotrą) | 0.65 | **HIT (warunkowy)** | Stan 02–07.08 dokładnie taki: komplet wykonany, „czeka m.in. na logotypy miasta Kraków" — rozjazd produkcja/finalizacja już widoczny. Warunkowy, bo domknięcia (kiedy dotarły) nie znamy. |
| bt-04 (A4 300 dpi = osobna ścieżka techniczna) | 0.70 | **MISS** | A4 zrobiony tym samym clone+rescale co posty, w tym samym pliku Figma. Przewidywana osobna ścieżka (render z kodu / eksport wektorowy) nie powstała. (Ryzyko jakości druku z upscalowanego rastra 1080-px zdjęcia pozostaje nieweryfikowane — możliwy „cichy" koszt, ale zdarzenie z claimu NIE zaszło.) |
| bt-05 (jawny artefakt-spec reguł per format + doprecyzowanie reguły z klientem) | 0.60 | **MISS** | Reguły żyją jako podpisy ramek w Figmie i proza w auto-memory — brak tabeli/configu jako deliverable'u pośredniego; brak śladu doprecyzowywania reguły z klientem po starcie. |
| bt-06 (font NIE podniesiony do reużywalnego komponentu) | 0.55 | **HIT (słaby/generyczny)** | arc.py został w scratchpadzie, wzorzec w auto-memory, zero komponentu w repo. ALE to w praktyce ta sama klasa co base-rate „rozwiązanie zostanie w sesji/scratchpadzie" — wartość sygnałowa niska; werdykt też warunkowy (następna kreacja Zdrofit jeszcze nie nastąpiła). |

**SYGNAŁ: 2 mocne hity + 1 słaby + 1 partial na 6 (≈ 42–58% zależnie od liczenia partial/weak).** Base-rate (4 pozycje) poza oceną — na marginesie: wszystkie 4 na stan 07.08 wyglądają na trafione, co potwierdza, że to quasi-pewniki, słusznie wyjęte z fitu.

## Mechanism fit

- **mech:negative-knowledge-ledger — FULL HIT.** Wpis w auto-memory to wzorcowa para limit→wzorzec zastępczy („Font Aptly (WAŻNE): … OBEJŚCIE (działa): …"), z parametrami operacyjnymi (SVG <50KB, zaokrąglanie współrzędnych). Forma = memory, nie ledger (zgodnie z base-rate), ale TREŚĆ mechanizmu wykonana w całości.
- **mech:design-as-code — PARTIAL.** Trigger karty zadziałał trafnie dla FONTU (render glifów z kodu, jawna geometria łuku) — ale mechanizm objął wyłącznie headline'y; produkcja formatów i A4 poszły ręcznie w GUI, wbrew zakresowi rekomendacji (render z kodu + programowa weryfikacja finalnego pliku — brak śladu).
- **mech:single-source-compiler — PARTIAL/WRONG.** Kształt „1 master → N widoków" się zgadza, ale kompilator nie powstał: koszt poprawki klienta pozostał O(10) ręcznych ramek, dokładnie to, co karta miała wyeliminować. Rekomendacja pomyliła KSZTAŁT problemu z NARZĘDZIEM: w artefakcie żyjącym natywnie w Figmie (klonowanie, imageHash, komponenty) wzorzec realny to „clone+rules", nie kompilacja ze źródła.
- **mech:format-dictionary — PARTIAL/MISS.** Słownik reguł powstał tylko implicite (podpisy ramek); SLOWNIK_FORMATOW.md istniał przed T0 i NIE został zasilony rodziną „event FB → komplet”, wbrew wprost zapisanej tezie Routera. Druga z rzędu (po briefsync) rekomendacja tej karty, która realizuje się co najwyżej połowicznie.
- **mech:sandbox-promotion — WRONG (fałszywy trigger).** Router założył pracę „w pliku/przestrzeni klienta"; w rzeczywistości plik Figma jest własny r352 (team reszek) — granica sandbox była bezprzedmiotowa, a ryzyko #5 (incydent w zasobie klienta) fałszywym alarmem. T0-pack nie zawierał informacji o właścicielu pliku; Router uzupełnił lukę założeniem w stronę bardziej dramatyczną.
- **Missed-used:** brak — nie znaleziono mechanizmu użytego w przebiegu, którego Router nie zarekomendował (obejście fontu mieści się w design-as-code + NKL).
- **Odrzucenia:** wszystkie 5 odrzuconych słusznie (żaden nie okazał się potrzebny).

**Fit: 1 full / 3 partial / 1 wrong z 5 rekomendowanych; miss rate 0.**

## Ryzyka — werdykty

R1 font: HIT (zmaterializowane i zmitygowane — wektor 1:1). R2 logotypy Krakowa: HIT (potwierdzone oczekiwanie). R3 reguły w głowie: NIEROZSTRZYGNIĘTE (spec nie powstał, ale błędu wykrytego przez klienta brak w śladzie). R4 A4 z rastra: NIEROZSTRZYGNIĘTE-niepokojące (dokładnie ta ścieżka, przed którą ryzyko ostrzegało, została użyta; wynik druku nieznany). R5 sandbox: FALSE ALARM (plik własny). **Ryzyka: 2 hit / 1 false alarm / 2 nierozstrzygnięte.**

## 10 sekcji CEO

1. **Accuracy Routera.** Predykcje SYGNAŁ ≈ 50% (2 mocne + 1 słaby + 1 partial / 6) — wyraźnie słabiej niż briefsync (80%). Diagnoza problemu biznesowego trafna w połowie: „multiplikacja + bloker fontu" tak, ale teza o parametryzacji (koszt O(10)→O(1)) nie zrealizowała się i nie zabolała — poprawek klienta w śladzie brak. Trafność wysoka tam, gdzie predykcja opierała się o twardy fakt środowiskowy (font) lub zewnętrzną zależność (miasto); niska tam, gdzie Router projektował własną kulturę inżynierską (spec-artefakt, osobna ścieżka A4, kompilator) na zadanie wykonane natywnie w GUI.
2. **Accuracy Mechanism Selection.** 1 full + 3 partial + 1 wrong / 5; odrzucenia 5/5 poprawne; miss 0. Fit liczony ostro ≈ 20% pełny, liberalnie (partial=0.5) ≈ 50%. Najlepszy wybór: negative-knowledge-ledger (wykonany co do joty). Najgorszy: sandbox-promotion (rekomendacja z założenia, nie z danych T0).
3. **Największe błędy.** (a) **Projekcja code-pipeline na zadanie Figma-natywne**: single-source-compiler + „osobna ścieżka A4" + „spec jako artefakt" — trzy przejawy tego samego błędu; realny przebieg to ręczny clone+rules w GUI i było to wystarczające. (b) **Sandbox-promotion z fałszywego założenia** o własności pliku — Router nie oznaczył luki „czyj plik?" jako niewiadomej, tylko ją domyślił. (c) format-dictionary drugi raz z rzędu rekomendowany i drugi raz niezrealizowany w formie kartowej — karta ma problem z granicą i z realizmem (por. briefsync E1).
4. **Największe sukcesy.** (a) bt-01: predykcja fontu trafiona łącznie z techniką (wektoryzacja) — para design-as-code×NKL zadziałała dokładnie w miejscu twardego limitu środowiska. (b) bt-03/R2: ostatnia mila zewnętrznego assetu przewidziana z T0 i potwierdzona stanem projektu. (c) Bramka „rozwiązać font RAZ przed produkcją" odpowiada realnej kolejności zdarzeń (obejście działało na etapie budowy formatów).
5. **Nowe mechanizmy (hipotezy).** (a) **mech:native-tool-fit** (roboczo): przed rekomendacją mechanizmu produkcyjnego sprawdź, w jakim medium artefakt natywnie żyje; dla artefaktów GUI-natywnych (Figma) przy N≤~10 widoków jednorazowo wzorzec = „clone+rules w narzędziu", a kompilator dopiero przy powtarzalności rodziny lub poprawkach wielokrotnych. Alternatywnie: nie nowa karta, lecz anti-context w single-source-compiler. (b) **Guard „czyj to zasób?"**: pole obowiązkowe T0 (właściciel pliku/przestrzeni) zanim Router dobierze sandbox-promotion — kandydat na checklist-item, nie mechanizm.
6. **Mechanizmy do usunięcia.** Brak kandydatur do usunięcia. Do korekty granic: single-source-compiler (anti-context GUI-natywny), sandbox-promotion (trigger warunkowy od własności zasobu), format-dictionary (patrz flaga z briefsync — ten backtest ją wzmacnia).
7. **Confidence Changes (PROPOZYCJE — zapisy robi sesja główna).** (a) negative-knowledge-ledger: +evidence typu postmortem (pełna realizacja treści mechanizmu, projekt #2 po stock-photo-sources) — propozycja: podtrzymać/podbić. (b) design-as-code: evidence mieszany (trafny trigger fontowy, niezrealizowany zakres render+weryfikacja) — propozycja: bez zmiany confidence, dopisać do karty rozróżnienie „design-as-code jako obejście punktowe vs jako pipeline". (c) single-source-compiler: flaga too-broad/wrong-trigger + anti-context — bez podbicia. (d) sandbox-promotion: flaga wrong-trigger (rekomendacja z niezweryfikowanego założenia) — bez zmiany confidence, dodać warunek wejścia. (e) format-dictionary: druga obserwacja niedowiezienia — podtrzymać flagę too-broad z briefsync, rozważyć podział karty (dedupe: to NOWY projekt, więc liczy się jako osobne evidence, ale bez sumowania z tym samym faktem ze skanu CKO).
8. **Nowe hipotezy.** (a) Router systematycznie przeszacowuje formalizację procesu w projektach mikro-wolumenowych (1 master, 1 tydzień) — do sprawdzenia w kolejnych backtestach klasy „mała kreacja": czy misses skupiają się w predykcjach o artefaktach procesowych (spec, kompilator, osobne ścieżki)? (b) Hipoteza Routera „font-resolver jako komponent" pozostaje otwarta i testowalna: następna kreacja Zdrofit z Aptly rozstrzygnie bt-06 ostatecznie (arc.py = gotowy kandydat do podniesienia). (c) Ryzyko A4-z-rastra jest żywe: jeśli druk 21.08 ujawni miękki plakat, to będzie spóźnione potwierdzenie R4 — sprawdzić po evencie.
9. **Czego Genome nie wiedziało w T0.** (a) Właściciel pliku produkcyjnego (własny vs klienta) — informacja krytyczna dla sandbox-promotion, nieobecna w T0-packu i nieoznaczona jako luka. (b) Że master zawiera już komplet logotypów partnerskich, a „czekanie na logotypy Krakowa" dotyczy elementu domykającego, nie blokera startu — natura zależności zewnętrznej była inna niż domyślona. (c) Ograniczenie plugin API „font niestandardowy = tylko klonowanie istniejących node'ów" — drugi, obok loadFontAsync, wymiar limitu środowiska. (d) Że praktyka r352 w Figmie (klonowanie, imageHash, komponenty) czyni ręczny reformat 10 ramek tańszym niż budowa kompilatora — brak w Genome wiedzy o progu opłacalności parametryzacji.
10. **Jak następny projekt będzie lepszy.** (a) T0-pack klasy „praca w narzędziu projektowym" MUSI zawierać pole „właściciel zasobu" i „medium natywne artefaktu"; brak = jawna niewiadoma, nie założenie. (b) Rekomendacja single-source-compiler tylko przy spełnionym progu: przewidywane ≥2 rundy poprawek na komplecie LUB powtarzalna rodzina — inaczej „clone+rules". (c) Obejścia limitów środowiska od razu z pytaniem bramkowym „czy to trzeci raz ta klasa? → podnieś do komponentu" (Aptly: raz = memory OK; następny raz = arc.py do repo).

## Evidence (do zapisu w kartach przez sesję główną)

- E1 {observation: rekomendacja single-source-compiler nie zrealizowana — 10 formatów wykonane ręcznym clone+rescale/rebuild w Figmie, bez artefaktu-źródła; koszt poprawki pozostał O(10); proof: memory/zdrofit-cwicz-w-zieleni.md (02.08.2026) — opis techniki per format; impact: karta rekomenduje kompilator tam, gdzie GUI-natywny wzorzec wystarcza; proposed_change: anti-context „artefakt żyje natywnie w narzędziu GUI i N widoków ≤ ~10 jednorazowo bez przewidywanych rund poprawek"; confidence_effect: flaga, bez zmiany; mechanisms: [mech:single-source-compiler]}
- E2 {observation: sandbox-promotion rekomendowany na podstawie założenia „praca w pliku klienta", które okazało się fałszywe (plik własny team reszek); proof: memory/zdrofit-cwicz-w-zieleni.md (02.08.2026) — key tmBVy2Co1BlQtnJ9iuilDC, team reszek; impact: fałszywy trigger + fałszywy alarm ryzyka #5; proposed_change: warunek wejścia karty „potwierdzona własność/współdzielenie zasobu z klientem"; confidence_effect: bez zmiany, flaga wrong-trigger; mechanisms: [mech:sandbox-promotion]}
- E3 {observation: bloker Aptly rozwiązany dokładnie wg pary NKL (limit loadFontAsync → wzorzec fontTools→SVG→createNodeFromSvg, z parametrami operacyjnymi) i zapisany jako para w auto-memory; proof: memory/zdrofit-cwicz-w-zieleni.md sekcja „Font Aptly (WAŻNE)" (02.08.2026); impact: treść mechanizmu wykonana w pełni mimo braku formalnego ledgera; proposed_change: +evidence postmortem dla NKL; confidence_effect: propozycja podbicia (retro-postmortem); mechanisms: [mech:negative-knowledge-ledger, mech:design-as-code]}
- E4 {observation: SLOWNIK_FORMATOW.md (istniejący od 04.07) nie został zasilony rodziną „event FB → komplet 10 formatów" mimo wprost zapisanej tezy Routera; reguły per format istnieją tylko jako podpisy ramek Figma i proza w memory; proof: grep „zieleni/krakus" w SLOWNIK_FORMATOW.md = 0 trafień (stan 09.08.2026) + memory 02.08; impact: druga z rzędu (po briefsync) częściowa realizacja format-dictionary; proposed_change: podtrzymanie flagi too-broad, rozważyć podział karty; confidence_effect: bez zmiany; mechanisms: [mech:format-dictionary]}
- E5 {observation: A4 300 dpi wykonany tą samą ścieżką clone+rescale co digital — predykcja osobnej ścieżki (bt-04) i częściowo ryzyko R4 chybione co do zdarzenia, ale jakość druku z upscalowanego rastra pozostaje niezweryfikowana do 21.08; proof: memory 02.08 („pionowe (FB/IG/A4) przez clone+rescale+center-crop"); impact: Router przeszacowuje potrzebę osobnych ścieżek print w mikro-projektach; proposed_change: follow-up po evencie 21.08 (czy plakat wydrukował się poprawnie); confidence_effect: n/d; mechanisms: [mech:design-as-code]}
