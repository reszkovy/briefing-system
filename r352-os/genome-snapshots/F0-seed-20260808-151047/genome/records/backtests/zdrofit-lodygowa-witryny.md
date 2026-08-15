---
id: "rec:backtests/zdrofit-lodygowa-witryny"
type: "record"
title: "Backtest — zdrofit-lodygowa-witryny"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — zdrofit-lodygowa-witryny

Data: 2026-08-09 · Protokół: PROTOKOL.md · Przebieg B (porównanie; przebieg A nie był poprawiany).
T0 ≈ przed 29.07.2026 (projekt wykonany i zamknięty 29.07.2026). Źródła przebiegu rzeczywistego: memory/zdrofit-lodygowa-witryny.md (29.07.2026), karta proj:zdrofit-lodygowa-witryny (import CKO 07.08), katalog kodu `zdrofit-lodygowa/` (README.md, artboardy.html, render.sh, potnij.py, out/ — pliki z 29.07.2026; katalog poza gitem, brak historii commitów).

## Pakiet T0 (skrót)

Benefit/Zdrofit, nowy klub CH Łodygowa (Targówek): oklejenie 3 ciągów witryn (~12,3 m), komunikat „tu powstaje nowy klub fitness Zdrofit" + QR do formularza leadowego przedsprzedaży. Powtórka wzorca z Poznania. Twarde ograniczenia: cięcie na bryty wg podziału szyb (QR ani kluczowe elementy nie na styku), QR skanowalny z ~110–120 cm, konflikt wymiarów wiadomość-vs-rysunek ~2 mm znany na starcie. Offline nieodwracalny.

## Skrót raportu Routera T0 (przebieg A)

Mechanizmy rekomendowane: storefront-qr-bridge, design-as-code, location-as-data, presale-demand-ledger, incident-to-guard. Workflow z 4 bramkami (m.in. „rozstrzygnięcie wymiarów NA KORZYŚĆ rysunku technicznego", „kontrola skryptowa środka QR 110–120 cm", „programowy odczyt QR z finalnego pliku"). Top ryzyka: konflikt 2 mm (nr 1), QR nieczytelny, QR bez parametru źródła, fonty headless, łańcuch drukarnia+montaż. 6 predykcji SYGNAŁ (bt-01…06) + 4 base-rate (poza fitem).

## Porównanie predykcji SYGNAŁ z rzeczywistością

| ID | p | Claim (skrót) | Werdykt | Dowód |
|---|---|---|---|---|
| bt-01 | 0.85 | Pliki produkcyjne jako kod (HTML/config + render headless + skryptowe cięcie), nie DTP | **HIT (pełny)** | `artboardy.html` (COPY/BOARDS, stała CM=10), `render.sh` (Chrome headless → out/*.png 1:1), `potnij.py` (cięcie z zakładką) — pliki 29.07.2026 |
| bt-02 | 0.75 | Programowa weryfikacja QR na finalnym renderze + dedykowany artefakt/warstwa kontrolna | **HIT (z zastrzeżeniem)** | README: „Zweryfikowany moduł po module na wyrenderowanych plikach — zero różnic wobec wzorca"; memory: segno, korekcja H, weryfikacja moduł-po-module na PNG. ALE: w katalogu nie ma trwałego skryptu-weryfikatora (tylko render.sh + potnij.py) — weryfikacja była dyscypliną sesyjną, nie artefaktem. Połowa claimu (weryfikacja) tak, połowa (dedykowany artefakt) nie |
| bt-03 | 0.70 | Konflikt 2 mm rozstrzygnięty NA KORZYŚĆ rysunku + wymusi ponowny render | **MISS (czysty)** | README sekcja „Uwaga do wymiarów": „Zbudowane na wymiarach z Twojej wiadomości" — wybrano WIADOMOŚĆ, różnice uznano za „w praktyce bez znaczenia przy zakładce", a przełączenie na rysunek zostawiono jako tanią ścieżkę (zmiana BOARDS w 2 plikach). Zero wymuszonego re-renderu |
| bt-04 | 0.60 | ≥1 iteracja poprawkowa pozycji/rozmiaru/wysokości QR — fizyka nie trafiona w v1 | **HIT** | memory: „pierwsza wersja miała go 70 cm — za nisko do skanowania" + wymuszenie „nie na styku brytów". Dokładnie przewidziana klasa iteracji |
| bt-05 | 0.60 | Bryty z zakładką + osobne warstwy/pliki kontrolne — delivery > „3 plansze" | **HIT** | `potnij.py 2` (2 cm zakładki, out/bryty/), `out/*-bryty.png` (linie cięcia, wymiary szyb, strefa bezpieczna 8 cm). Zastrzeżenie: warstwy kontrolne opisane „do sprawdzenia, nie do druku" — adresat to raczej Reszek niż drukarnia |
| bt-06 | 0.55 | Pętla pomiarowa NIE domknięta — koniec na plikach produkcyjnych | **HIT (słaby — blisko base-rate)** | Brak jakiegokolwiek śladu raportowania skanów; URL QR `…/warszawa-targowek-ch-lodygowa/lead` BEZ parametru źródła — pomiar per witryna niemożliwy nawet potencjalnie |

**Bilans SYGNAŁ: 5/6 HIT (w tym 1 z zastrzeżeniem, 1 słaby), 1 czysty MISS.** Miss (bt-03) jest wartościowszy niż hity: falsyfikuje kierunek „guardu geometrii" z hipotez Routera.

## Porównanie ryzyk

- R1 konflikt 2 mm (nr 1) — **przeszacowany**: różnica realnie istniała (tabela w README, 4 wymiary), ale nie eksplodowała — została pochłonięta przez zakładkę 2 cm i jawnie udokumentowana z tanią ścieżką zmiany. Ryzyko realne, ranga zawyżona.
- R2 QR nieczytelny — **HIT**: v1 środek na 70 cm, za nisko; złapane przed drukiem.
- R3 QR bez parametru źródła — **HIT**: URL prowadzi na dedykowaną podstronę klubu (nie home — pół sukcesu), ale bez żadnego parametru źródła; skan nieodróżnialny od ruchu organicznego. Router przewidział to ryzyko, a mimo to rekomendował presale-demand-ledger bez warunku wstępnego.
- R4 fonty headless — **nierozstrzygnięte**: fonty Aptly lokalnie jako woff2 w assets/, brak śladu incydentu.
- R5 łańcuch drukarnia+montaż — **nierozstrzygnięte**: warstwy kontrolne powstały, ale brak śladu specyfikacji montażowej ani feedbacku z montażu.

Znalezisko poza predykcjami: **plansza C ma środek QR na 107 cm** (README, tabela QR) — poniżej specyfikacji 110–120 cm z briefu. Bramka 2 Routera („kontrola skryptowa, nie okiem") w rzeczywistości nie istniała jako blokada: odstępstwo poszło do druku bez zapisanej decyzji. Guardy były deklaracją, nie egzekucją.

## Mechanism fit

- **mech:storefront-qr-bridge — PEŁNY HIT z jedną falsyfikacją rzemiosła.** Cała fizyka karty zagrała (korekcja H, weryfikacja moduł-po-module na renderze, QR nie na styku, wysokość skanowania jako realny problem v1). ALE input karty „wymiary z rysunku, nie z wiadomości" został w rzeczywistości odwrócony — świadomie wybrano wiadomość + tolerancję konstrukcyjną.
- **mech:design-as-code — PEŁNY HIT.** Wzorzec 1:1: HTML+config (COPY/BOARDS/CM), render headless, cięcie skryptem, wszystko przeliczalne po zmianie configu.
- **mech:location-as-data — CZĘŚCIOWY.** Parametryzacja WEWNĄTRZ projektu tak (BOARDS/COPY = dane), ale druga lokalizacja NIE wywołała silnika: zdrofit-lodygowa/ to osobny, samodzielny katalog, zero śladu reuse artefaktów z Poznania jako wspólnego kodu. „Klub jako rekord danych" nie zaszedł między lokalizacjami — trigger karty odpala za wcześnie przy n=2.
- **mech:presale-demand-ledger — CZĘŚCIOWY (słaby).** Most QR→formularz leadowy istnieje, ale „księga popytu per lokalizacja" nie: landing i analityka po stronie klienta, URL bez parametru źródła. Mechanizm rekomendowany bez sprawdzenia warunku wykonalności (kontrola nad landingiem), który Router sam wypisał jako ryzyko 3.
- **mech:incident-to-guard — CZĘŚCIOWY.** Weryfikacje istniały (QR moduł-po-module, potnij.py ma kontrolę sumy szyb vs szerokość planszy — ale jako print „UWAGA", nieblokujący). Incydent 70 cm wszedł do pamięci jako zasada. Guardy = dyscyplina sesyjna; przypadek C=107 cm pokazuje, że nie blokowały. (Uwaga: to graniczy z base-rate „guardy sesyjne, nie CI" — dlatego liczone jako częściowy, nie miss.)

**Fit: 2/5 pełne, 3/5 częściowe, 0 wrong, 0 missed-used.** Mechanizmów użytych a nierekomendowanych nie znaleziono.

## Raport 10 sekcji (CEO)

1. **Accuracy Routera:** predykcje SYGNAŁ 5/6 (83%), ale z korektą jakościową: bt-02 połowiczny, bt-06 blisko base-rate → „twarde" hity to bt-01, bt-04, bt-05. Ryzyka: 2 hity (R2, R3), 1 przeszacowanie (R1 jako nr 1), 2 nierozstrzygnięte. Workflow: bramka 1 (rysunek > wiadomość) FALSYFIKOWANA, bramka 2 (kontrola skryptowa wysokości) nie istniała jako blokada (C=107). Zastrzeżenie hindsight jak w pilocie: wykonawca zna wynik, wartość = struktura pudeł.
2. **Accuracy Mechanism Selection:** 2/5 pełne (storefront-qr-bridge, design-as-code — obie karty realnie niosły projekt), 3/5 częściowe (location-as-data za wczesny trigger, presale-demand-ledger bez warunku wykonalności, incident-to-guard deklaratywny). Fit ≈ 70%. Odrzucenia (rój agentów, generatywne graficzne, automaty Trello) — wszystkie słuszne, nic z tego nie było potrzebne.
3. **Największe błędy:** (a) bt-03/bramka 1 — Router narzucił „lepsze źródło prawdy" (rysunek), rzeczywistość rozwiązała konflikt KONSTRUKCYJNIE: tolerancja pochłonięta zakładką + tania ścieżka przełączenia w configu; hipoteza „guard geometrii" miała zły kierunek; (b) rekomendacja presale-demand-ledger sprzeczna z własnym ryzykiem 3 (brak kontroli landingu) — Router nie propagował ryzyka do warunków wstępnych mechanizmu; (c) bramki opisane jako „kontrola skryptowa" bez mechanizmu egzekucji — C=107 cm poszło do druku jako niezapisana decyzja.
4. **Największe sukcesy:** (a) design-as-code przewidziany z p=0.85 co do FORMY (HTML+config+headless+skrypt cięcia — dokładnie artboardy.html/render.sh/potnij.py); (b) klasa „fizyka QR nie trafiona w v1" przewidziana (70 cm); (c) kształt delivery (bryty z zakładką + warstwy kontrolne) przewidziany zanim zajrzano do katalogu; (d) niedomknięcie pętli pomiarowej przewidziane wraz z przyczyną (landing klienta).
5. **Nowe mechanizmy (hipotezy):** **mech:tolerance-by-design** — przy konflikcie źródeł wymiarów w produkcji fizycznej odpowiedzią nie jest wybór „lepszego źródła", lecz konstrukcja pochłaniająca różnicę (zakładka/spad) + parametryzacja czyniąca przełączenie tanim + jawna dokumentacja rozbieżności dla klienta (wzorzec z README sekcja „Uwaga do wymiarów"). Kandydat na kartę lub na input storefront-qr-bridge/design-as-code.
6. **Mechanizmy do usunięcia:** brak kandydatów do usunięcia. location-as-data — do zawężenia triggera (n≥3 lub jawne zlecenie seryjne), nie do usunięcia. presale-demand-ledger — dopisać warunek wstępny „kontrola nad landingiem/analityką lub uzgodniony parametr źródła", inaczej karta rekomenduje niewykonalne.
7. **Confidence Changes (PROPOZYCJE — zapisy robi sesja główna):** design-as-code: +evidence typu postmortem (retro, wynik rzeczywisty) — trzeci projekt potwierdzający, kandydat do podbicia; storefront-qr-bridge: +evidence postmortem na fizykę QR, ale z korektą inputu (wymiary) — evidence tak, podbicie ostrożne; location-as-data: flaga too-broad (trigger), bez podbicia; presale-demand-ledger: flaga too-broad (brak warunku wykonalności), bez podbicia; incident-to-guard: bez zmian (obserwacja graniczy z base-rate, dedupe z briefsync). Dedupe per projekt: żadne z powyższych nie sumuje się ze skanem CKO 07.08 tego samego projektu.
8. **Nowe hipotezy:** (a) tolerance-by-design (sekcja 5); (b) „decyzja o odstępstwie" jako klasa guardu: każde odstępstwo od liczbowej specyfikacji briefu (C=107 vs 110–120) musi istnieć jako zapisana decyzja z uzasadnieniem, nie jako cicha wartość w tabeli; (c) miara skuteczności mostu offline→online wymaga negocjacji parametru źródła Z KLIENTEM na etapie briefu — to punkt do checklisty briefu, nie do delivery.
9. **Czego Genome nie wiedziało w T0:** że zakładka montażowa (2 cm) o rząd wielkości przewyższa sporne 2 mm — fizyka montażu unieważnia spór o źródło prawdy; że klient poda URL leadowy bez możliwości parametryzacji (granica kontroli r352 nad lejkiem); że geometria planszy C może wymusić odstępstwo od strefy 110–120 cm (albo że nikt go nie zauważy); że weryfikator QR pozostanie w sesji zamiast w repo (kolejny przypadek klasy „pipeline bez ekstrakcji" — base-rate potwierdzony, poza fitem).
10. **Jak następny projekt będzie lepszy:** każdy projekt produkcji fizycznej dostaje: (1) przy konflikcie źródeł wymiarów — najpierw pytanie „czy konstrukcja pochłania różnicę?", dopiero potem wybór źródła; (2) blokujący (nie „UWAGA-print") check specyfikacji liczbowych z briefu na finalnym renderze, z jawnym plikiem decyzji dla odstępstw; (3) weryfikator QR jako trwały skrypt w repo projektu, nie kod sesyjny; (4) w bramce briefu pytanie o kontrolę nad landingiem/parametrem źródła ZANIM zarekomenduje się mechanizm pomiarowy.

## Evidence (do zapisania w kartach + Ledger przez sesję główną)

- E1 {observation: pełne potwierdzenie wzorca design-as-code w produkcji fizycznej — HTML+COPY/BOARDS+CM, render headless, skryptowe cięcie z zakładką; proof: zdrofit-lodygowa/artboardy.html, render.sh, potnij.py, README.md (pliki 29.07.2026); impact: trzeci niezależny projekt klasy (po kubota, twojemenu) z wynikiem rzeczywistym; proposed_change: evidence typu postmortem do karty, kandydat na podbicie confidence; mechanisms: [mech:design-as-code]}
- E2 {observation: input karty „wymiary z rysunku technicznego, nie z wiadomości" sfalsyfikowany — projekt świadomie zbudowany na wymiarach z wiadomości, rozbieżność 2 mm pochłonięta zakładką 2 cm i udokumentowana z tanią ścieżką przełączenia; proof: README.md sekcja „Uwaga do wymiarów" (29.07.2026): „Zbudowane na wymiarach z Twojej wiadomości […] Różnice 2 mm, w praktyce bez znaczenia przy zakładce"; impact: twarda reguła źródła prawdy w karcie daje złe rekomendacje; proposed_change: zamienić regułę na „jawne rozstrzygnięcie konfliktu + konstrukcyjna tolerancja + parametryzacja przełączenia" (hipoteza mech:tolerance-by-design); mechanisms: [mech:storefront-qr-bridge]}
- E3 {observation: fizyka QR faktycznie nie trafiona w v1 (środek 70 cm, za nisko) i naprawiona przed drukiem; jednocześnie plansza C wydrukowana z środkiem QR 107 cm — poniżej strefy 110–120 z briefu, bez zapisanej decyzji o odstępstwie; proof: memory/zdrofit-lodygowa-witryny.md (29.07.2026, „pierwsza wersja miała go 70 cm") + README.md tabela QR (C: 107 cm); impact: rzemiosło karty potwierdzone, ale guard wysokości był deklaracją, nie blokadą; proposed_change: failure_condition „guard bez mechanizmu egzekucji przepuszcza ciche odstępstwa" + klasa guardu „decyzja o odstępstwie"; mechanisms: [mech:storefront-qr-bridge, mech:incident-to-guard]}
- E4 {observation: QR prowadzi na dedykowaną podstronę klubu, ale bez parametru źródła — księga popytu per witryna niemierzalna, bo landing i analityka po stronie klienta; proof: README.md — URL `https://zdrofit.pl/kluby-fitness/warszawa-targowek-ch-lodygowa/lead` (29.07.2026), brak utm/source; impact: mechanizm rekomendowany bez spełnialnego warunku wykonalności; proposed_change: precondition w karcie „kontrola nad landingiem/analityką lub uzgodniony parametr źródła w bramce briefu"; mechanisms: [mech:presale-demand-ledger]}
- E5 {observation: druga lokalizacja tego samego wzorca (Poznań→Łodygowa) NIE wywołała wspólnego silnika — powstał samodzielny katalog z własnym configiem, bez reuse kodu z Poznania; proof: zdrofit-lodygowa/ jako standalone (29.07.2026), poza gitem, brak referencji do artefaktów poznańskich w README/kodzie; impact: trigger karty „≥2 lokalizacje = silnik" odpala za wcześnie; proposed_change: zawęzić trigger do n≥3 lub jawnego zlecenia seryjnego; parametryzacja per projekt ≠ location-as-data; mechanisms: [mech:location-as-data]}
