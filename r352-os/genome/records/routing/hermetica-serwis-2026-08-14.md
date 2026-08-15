---
id: "rec:routing/hermetica-serwis-2026-08-14"
type: "record"
title: "Raport routera — The Hermeticum (serwis wiedzy hermetycznej)"
status: "created"
created: "2026-08-14"
updated: "2026-08-14"
version: 1
owner: "przemek"
relations: {"attached_to":["proj:thehermeticum"]}
tags: ["routing","side-project"]
---

# Raport routera: serwis wiedzy hermetycznej (roboczo „Hermetica")

Data: 2026-08-14 · prepared_by: session:claude-fable-5 · decided_by: przemek (OCZEKUJE)
Status: **wersja 1 — po fazie research; SALT niewykonany; kontrakt NIEZAMROŻONY**

Brief wejściowy: nowy serwis o wiedzy hermetycznej („myślę, że to przyszłość"). Doprecyzowane 14.08 z Przemkiem:
format = portal treściowy/kompendium + newsletter/społeczność (z otwartością na korektę po diagnozie),
monetyzacja odroczona (najpierw audiencja), rynek globalny (EN), status: **prywatny side-project** (poza portfelem klienckim r352, ale pełny proces routera).

---

## 1. Problem biznesowy

Zamówienie brzmi „zbudujmy serwis", ale realny problem to: **czy istnieje możliwa do zdobycia pozycja w niszy ezoterycznej dla nowego, anonimowego na starcie głosu — i która to pozycja.** Teza „wiedza hermetyczna to przyszłość" jest przeczuciem założyciela (klasyfikacja: opinia, nie fakt) — projekt ma ją sfalsyfikować tanio, zanim powstanie produkt. Wtórny problem: side-project konkuruje o czas z celem kwartału (Benefit 2x) — koszt alternatywny jest realnym ryzykiem.

## 2. Typ organizacji

Jednoosobowy założyciel (Przemek), decydent = wykonawca, zdolność produkcyjna nieznana ale strukturalnie mała (side-project przy pełnym portfelu klienckim). Brak marki osobistej w niszy na start. Pełna swoboda decyzyjna, zero interesariuszy zewnętrznych.

## 3. Typ projektu

**Wejście w istniejącą niszę treściową od zera na rynku globalnym (EN)**: klasa „audience-first content venture" — pokrewna z proj:human-commons (strona-manifest tezy) i proj:btc-cyclicality (kompendium tematyczne), ale pierwsza z jawnym celem budowy audiencji własnej.

## 4. Research i benchmark

5 rekordów, wszystkie przeszły `validateResearchRecord()` (5/5 valid, 5/5 z wpływem na decyzję; kierunki: 2 supports / 2 contradicts / 1 neutral). Pełne rekordy: załącznik A na końcu pliku.

| # | Claim (skrót) | Kierunek | Wpływ |
|---|---|---|---|
| R1 | Rynek „spiritual products & services" ~186 mld USD (2025) → ~255 mld (2034) | supports | decyzja: makro-popyt istnieje |
| R2 | Kanał Esoterica (akademickie wykłady o ezoteryce): 100k subów 2020 → 1 mln koniec 2025 | supports | zakres: rygor + autorytet osobowy działa; skok wzrostu przyszedł z tematu przyległego |
| R3 | Zero-click 56%→69%, AI Overviews przy 48% zapytań, mediana wydawców -10% ruchu r/r | **contradicts** | zakres: silnik wzrostu = kanał własny + AEO, NIE klasyczny SEO-portal |
| R4 | Darmowe, kompletne biblioteki tekstów hermetycznych istnieją od dekad (sacred-texts.com, hermetic.com) | **contradicts** | zakres: WYCIĄĆ „archiwum tekstów" jako oś przewagi |
| R5 | Mainstreamowy popyt „occulture" wchodzi przez praktykę (tarot/astrologia/rytuały), nie doktrynę | neutral | zakres: pytanie o odbiorcę (praktyk vs badacz) → do SALT |

**Delta-lista:**
- *Standardy do przyjęcia:* rygor merytoryczny jako różnicownik (R2); kanał własny od dnia 1 (R3); treść projektowana pod czytelników maszynowych — AEO (R3).
- *Świadome odstępstwa:* NIE budujemy kolejnego archiwum tekstów źródłowych (R4 — pozycja zajęta przez darmowych incumbentów); NIE gramy o masowy ruch SEO jako główny silnik (R3).
- *Słabości rynku = szanse:* incumbenci (sacred-texts, hermetic.com) mają archaiczny UX i zero warstwy przewodnika/kuracji; nisza między „akademickim YouTube" a „TikTokowym tarotem" — ustrukturyzowana, rzetelna ścieżka wejścia w hermetyzm — wygląda na słabo obsadzoną (hipoteza do walidacji w SALT).

## 5. Warstwa strategiczna

Werdykt `routeFrameworks()` (2026-08-14): **`BOTH` — kolejność `wf:salt` → `wf:plate`**, blocked: false, fundament: brak.

Powody (cytowane z modułu): brak wskazanej strategii · zespół nie potrafi jednym zdaniem powiedzieć, komu i czym wygrywa (trigger wf:salt) · projekt ma konsekwencje pozycjonujące · dominujący typ problemu nieustalony · brief wymaga planu komunikacji (zakres wf:plate).

Bramki: `PLATE_REQUIRES_FOUNDATION: SEQUENCED` (PLATE nie startuje przed podpisanym wynikiem SALT) · `PLATE_CAPACITY: LIMIT` (nieznana pojemność produkcyjna — kalendarz 90 dni grozi listą życzeń).

Brief strukturalny (stan, na którym stanęła decyzja):

| Pole | Wartość | Źródło |
|---|---|---|
| audience_is_market | true | odbiorcą jest rynek czytelników, nie system |
| positioning_stated | false | brak jednozdaniowego „komu i czym wygrywamy" |
| positioning_consequences | true | nowa marka od zera — wszystko jest pozycjonowaniem |
| needs_ongoing_communication | true | portal + newsletter = ciągła komunikacja (potwierdzone przez Przemka 14.08) |
| single_artifact | false | serwis, nie jednorazowy artefakt |
| existing_strategy | null | brak jakiejkolwiek strategii |
| continuity_horizon_days | 365 | zamiar ciągły |
| execution_capacity_days | **null** | NIEZNANE — do ustalenia przed PLATE |
| dominant_problem | nieznany | legalne przed SALT; bramka uczciwości nazwie go w diagnozie |
| salt_approved | false | SALT niewykonany |

Pierwszy przebieg (przed dopytaniem) dał `UNRESOLVED/blocked` na `needs_ongoing_communication: null` — rozstrzygnięte odpowiedzią Przemka (format portal+newsletter), nie założeniem sesji.

## 6. Rekomendowane mechanizmy

1. **`mech:strategy-before-execution`** (emerging) — dlaczego: brief zaczyna się od artefaktu („serwis"), nie od problemu; klasyczny trigger wf:salt. Evidence: backtesty 32 projektów (rec:backtests/ANALIZA-KONCOWA), rec:backtests/marka-tlumacz-salt-gap (koszt pominięcia diagnozy).
2. **`mech:compounding-channel`** (emerging) — dlaczego: R3 przesuwa silnik wzrostu na kanał własny; newsletter jest jedynym aktywem odpornym na zero-click. Wsparcie w researchu (target R3).
3. **`mech:seo-aeo-foundation`** (emerging) — dlaczego: bramka stała procesu (publiczny artefakt akwizycyjny bez warstwy SEO/AEO nie jest „done") + R3: widoczność w odpowiedziach AI to gra, w której incumbenci z lat 90. nie grają.
4. **`mech:agent-facing-distribution`** (hypothesis) — dlaczego: jeśli „przyszłość" tezy Przemka ma sens operacyjny, to taki: treść hermetyczna ustrukturyzowana pod czytelników maszynowych (asystenci AI cytują serwis). Projekt = laboratorium dla tej hipotezy (exp:agent-facing-distribution-test).
5. **`mech:competitive-benchmarking`** (hypothesis) — wykonany w sekcji 4; dalsze użycie w SALT (warstwa L — areny konkurencji).

**Jawnie odrzucone:**
- `mech:proof-first-demo-pitch`, `mech:storefront-qr-bridge`, `mech:location-as-data*` — anti-context: brak klienta do przekonania, brak lokalizacji fizycznych.
- `mech:presale-demand-ledger` — na razie odrzucony (monetyzacja świadomie odroczona), ale wraca na stół, jeśli SALT wskaże produkt płatny jako walidator popytu.
- Wzorzec **gated content** — disproven w praktyce r352 (pamięć: bramkowane raporty nie działają); treść otwarta + kontakt za personalizację.

## 7. Rekomendowani agenci

- **Sesje Claude (research + SALT + później produkcja treści)** — AI Tasks z kart: skontraktowany research, prowadzenie warstw S/A/L/T z alternatywami wniosków, struktura treści pod AEO.
- **`/research-benchmark`** — użyty (ta sekcja 4); ponownie w SALT warstwa L.
- **NIE:** `agent:r352-cko-daily` (projekt prywatny, poza radarem CKO — chyba że Przemek zdecyduje inaczej); automatyzacje wysyłkowe (rule:comms-read-only — wysyła zawsze Przemek); `/ux-wireframing` — jeszcze nie, dopiero po PLATE (projektowanie przed diagnozą = błąd procesu).

## 8. Workflow realizacji

1. **Faza SALT** (sesja 2–4 h + wywiady/walidacja): S — sytuacja niszy i klasyfikacja dominującego problemu · A — wybór odbiorcy (badacz vs praktyk vs początkujący; R5 czyni to pytaniem centralnym) · L — areny i wolna pozycja (na bazie sekcji 4 + pogłębienie) · T — transformacja percepcji + zachowanie-dowód. Wyjście: 2–4 odkrycia ze statusem, ≥1 decyzja zakresowa zmieniona.
2. **Bramka foundation** — podpis Przemka pod wynikiem SALT (Ed25519, lib/approval.js).
3. **Faza PLATE** — ścieżka, blokady z dowodami, cele-zachowania (metryki przez `assessMetric`), tematy, kalendarz 90 dni **skrojony pod realną zdolność** (bramka G4: przy < 30 dniach produkcyjnych → quick winy: sam newsletter, bez portalu).
4. **Project Contract + podpis GO** → dopiero potem pierwsza linia serwisu.
5. **Bramka stała:** każdy publiczny artefakt przechodzi warstwę SEO/AEO przed „done".

## 9. Ryzyka

- **Zdolność wykonawcza (największe):** `PLATE_CAPACITY: LIMIT` + failure_condition wf:plate „kalendarz na 90 dni przy zdolności na 20 umiera w tygodniu 3". Side-project przy celu Benefit 2x (VIII–X) = strukturalny konflikt czasu.
- **Kalendarz bez tezy:** start produkcji treści przed SALT — dokładnie błąd z rec:backtests/marka-tlumacz-salt-gap.
- **Ruch znikąd:** R3 — portal bez kanału własnego i AEO nie ma silnika wzrostu.
- **Zajęta pozycja:** R4 — gra w „archiwum" jest przegrana na starcie.
- **Teza-przeczucie:** „to przyszłość" bez falsyfikowalnej formy stanie się sunk-cost narracją; kontrakt wymusza predykcje z datami.
- **Anonimowość:** R2 sugeruje, że w niszy wygrywa autorytet osobowy — serwis bez twarzy może nie mieć mechanizmu zaufania (do rozstrzygnięcia w SALT).

## 10. Hipotezy (projekt jako laboratorium)

- **H1 (= exp:agent-facing-distribution-test):** treść niszowa ustrukturyzowana pod asystentów AI zdobywa cytowania szybciej niż klasyczne SEO zdobywa pozycje. Metryka: obecność w odpowiedziach AI (patrz metryki niżej).
- **H2:** w niszy ezoterycznej istnieje niedoobsadzona pozycja „ustrukturyzowana ścieżka wejścia" (między akademickim wykładem a TikTokowym tarotem). Falsyfikacja: SALT warstwa L + test popytu (opt-in na „learning path").
- **H3 (kandydat na nową kartę):** side-project bez klienta może służyć jako czysty poligon mechanizmów audience-first — wynik (sukces LUB porażka) wraca do Genome jako Evidence dla mech:compounding-channel i mech:agent-facing-distribution.

---

## Bramki — stan na 2026-08-14

| Bramka | Wynik |
|---|---|
| `routeFrameworks()` | BOTH (SALT→PLATE), blocked: false |
| `doublecheck()` | **PASS** (5/5 rekordów valid, 5 z wpływem; kierunki 2/2/1; INFO: independent_review = unverified) |
| `researchGate()` | **can_proceed: true** |
| `measurementReadiness()` (propozycja metryk) | **PARTIAL** (2× READY, 1× PARTIAL — sampling AI niedeterministyczny) |
| `contractGate()` | **NIE URUCHOMIONA** — kontrakt nie może zamrozić się przed SALT i podpisem człowieka (by design) |

Propozycja metryk do przyszłego kontraktu (przeszły `assessMetric`, do rewizji po SALT):
1. **Subskrybenci newslettera:** 0 → ≥300 do 2026-12-15 (panel ESP; owner: przemek; primary outcome z vanity_justification: opt-in = zachowanie, nie zasięg).
2. **Obecność w odpowiedziach AI:** 0/20 → ≥3/20 stałych pytań testowych do 2026-12-15 (protokół samplingu: 3 asystenty, screenshoty, co miesiąc).
3. **Rytm publikacji:** ≥1 jednostka/tydz. przez 12 z 14 tygodni (sitemap + archiwum newslettera) — operacjonalizuje bramkę zdolności.

## Braki do uzupełnienia (przed/w SALT)

1. **`execution_capacity_days`** — ile realnie godzin/tydzień Przemek da temu projektowi przy Benefit 2x. Bez tego PLATE będzie fikcją.
2. **Odbiorca** — dla kogo to jest (badacz/praktyk/początkujący) i jakim językiem mówi — wywiady lub przynajmniej analiza społeczności (r/Hermeticism, komentarze Esoteriki).
3. **Kwestia twarzy** — czy projekt idzie z osobową sygnaturą (pseudonim? Przemek? postać redakcyjna?) — R2 sugeruje, że to nie jest detal.
4. **Nazwa/domena** — poza zakresem routera, po SALT.
5. **Klucz podpisu** — zgody fazowe (foundation, GO) wymagają podpisu Ed25519 Przemka (lib/approval.js); sesja nie umie i nie może go wytworzyć.

## Decyzja startowa (rekomendacja routera)

**GO — wyłącznie na fazę SALT** (researchGate: can_proceed). Realizacja serwisu: **wstrzymana do podpisanego wyniku SALT i zamrożonego Project Contract.** REVISE/STOP nie dotyczy — nie ma jeszcze czego zatrzymywać.

*Raport przygotowany przez sesję; zatwierdza człowiek. Nic z tego raportu nie zostało zapisane do kanonu Genome — zapis wykonuje `ingest.js` po decyzji Przemka.*

---

## Załącznik A — pełne rekordy researchu (kontrakt `validateResearchRecord`, 5/5 valid)

Rekordy w formie wykonywalnej (z pełnymi polami observation/interpretation/limitations/decision_impact) żyją w skrypcie walidacyjnym sesji:
`/private/tmp/claude-501/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/a21d4674-8ccf-47dc-b4f0-214e0778c964/scratchpad/hermetica-router-check.js` (UWAGA: katalog sesyjny — przy zatwierdzaniu pakietu skopiować rekordy do pakietu JSON).

Źródła (dostęp 2026-08-14):
- R1: https://www.businessresearchinsights.com/market-reports/spiritual-products-and-services-market-117617 (Business Research Insights; published n/d)
- R2: https://youtube.fandom.com/wiki/Esoterica (Wikitubia; published n/d)
- R3: https://thestacc.com/blog/google-ai-overview-statistics/ (The Stacc; published n/d)
- R4: https://hermetic.com/texts/index + https://sacred-texts.com/alc/hermmuse/index.htm (published n/d)
- R5: https://www.shutterstock.com/blog/occulture-mystical-design-trend (Shutterstock; published n/d)

Ograniczenie wspólne: wszystkie źródła publiczne bez pewnej daty publikacji (`published_at: n/d`) — żaden rekord nie może służyć jako dowód *aktualności* twierdzenia.

## Załącznik B — sweep konkurentów bezpośrednich (uzupełnienie 2026-08-14, po SALT/PLATE; 3 rekordy, 3/3 valid, kierunki 1/1/1)

| # | Konkurent / claim | Kierunek | Wpływ |
|---|---|---|---|
| R6 | **Hermetic Academy** — subskrypcyjna szkoła misteryjna (34,95→1500 USD/mies.), pozycjonowanie guru/inicjacja, słaba wiarygodność (stock, obietnice „100x") | neutral | zakres: różnicowanie = transparentność źródeł + zero inicjacji/guru + darmowa ścieżka |
| R7 | **Way of Hermes** — kursy + darmowe quick-starty dla początkujących; pozycja „ścieżki wejścia" NIE jest pusta (treści niezweryfikowane — 403) | **contradicts** | O1 przeformułowane: pozycja *słabo obsadzona*, nie *pusta*; różnicowanie doprecyzować przed tygodniem 1; **ręczny przegląd wayofhermes.com — Przemek** |
| R8 | Dystrybucja niszy = długi ogon dziesiątek blogów/podcastów (Feedspot), bez dominującego newslettera-lidera w hermetyzmie | supports | decyzja: newsletter jako główny kanał — potwierdzona luka |

Mapa aren (stan 14.08): **archiwa** (sacred-texts, hermetic.com — zajęte, R4) · **płatna edukacja guru** (Hermetic Academy — słaba wiarygodność, R6) · **ścieżka wejścia** (Way of Hermes — obsadzona częściowo, R7) · **media akademickie** (Esoterica YT — R2) · **newsletter** (długi ogon bez lidera, R8 — NASZ KANAŁ). Nikt nie łączy: darmowej ścieżki + rygoru źródłowego + nowoczesnego UX + machine-readability.
