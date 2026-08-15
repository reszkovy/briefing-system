---
id: "rec:backtests/artoffnia-demo"
type: "record"
title: "Backtest — artoffnia-demo"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:artoffnia-demo"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — proj:artoffnia-demo (przebieg B, falsyfikacja)

Projekt: demo serwisu Fundacji Tańca i Sztuki ARToffNIA (Olsztyn), budowane 26.07.2026 jako artefakt sprzedażowy przed umową; zwrot strategiczny 08.08.2026.
Źródła przebiegu B: `~/Desktop/ARToffNIA` (19 stron HTML + system + dokumenty handlowe), plik pamięci `artoffnia-oferta.md`, karta `proj:artoffnia-demo`, dokumenty `INWENTARYZACJA.md`, `REMANENT-ZAKRES-WEB.md`, `WYCENA.md`, `PRZEKIEROWANIA-301.md`, `AUTORSTWO-TRESCI.json`.

---

## 1. Pakiet T0 (rekonstrukcja, za przebiegiem A)

Fundacja tańca w Olsztynie, strona na Squarespace: nawigacja 27 linkami tekstowymi, martwy grafik PDF z sezonu 2022/23, zapisy w trybie „odezwiemy się", rabaty −20%/−50% zakopane w cenniku, realna oferta 43+ zajęć nieczytelna. Zadanie r352: sprzedać nową stronę pitchem „porządkujemy system, nie malujemy stronę". Warunki brzegowe: spec work bez budżetu, jedyny wykonawca i sprzedawca = Przemek, brak kanału pozyskania danych od klienta (demo przed pokazaniem), decydent o niskiej dojrzałości cyfrowej, brak ustalonego terminu pokazu.

Leave-one-out zastosowany: z kart wykluczone `ev:proof-first-demo-pitch-001`, `ev:single-source-compiler-004`, `ev:split-url-architecture-003`, człony artoffnia w `ev:machine-narrows-human-picks-005` i `ev:dated-commitment-gates-004`, akapity failure_conditions kart `proof-first-demo-pitch` / `working-artifact-extraction` odnoszące się do ARToffNII, oraz warunek porażki z Trial #001 (decyzja 08.08.2026).

## 2. Skrót raportu Routera T0

Rekomendowane (6): `mech:proof-first-demo-pitch` (wiodący), `mech:working-artifact-extraction`, `mech:single-source-compiler`, `mech:machine-narrows-human-picks`, `mech:seo-aeo-foundation` (zawężony do decyzji architektonicznej), `mech:dated-commitment-gates` (guard nadrzędny).
Odrzucone (4): `mech:location-as-data`, `mech:design-as-code`, `mech:numeric-gates`, `mech:competitive-benchmarking` (dopuszczony wąsko, ≤60 min).
Workflow: G-6 bramka datowa → G0 inwentarz → G1 jedno źródło → G2 kompilator → G3 lejek → G4 architektura URL → G5 pakiet handlowy.
Ryzyka: R1 błąd w danych klienta na jego demo · R2 „zbudowane, niepokazane" · R3 demo jako darmowa przysługa / one-off · R4 brak utrzymującego po wdrożeniu · R5 rozdmuchanie spec worku.
Predykcje SYGNAŁ: 9 (bt:artoffnia-demo-01…09).

## 3. Porównanie predykcji z rzeczywistością

| ID | p | Claim (skrót) | Wynik | Dowód |
|---|---|---|---|---|
| bt-01 | 0.82 | Jeden maszynowy plik-baza zasilający ≥3 widoki | **HIT** | `zajecia.js` (41,7 KB, 52 rekordy, `window.AFF_Z/LOK/KATN` + `AFF_SLUG/AFF_BY_ID`) konsumowany przez `index.html`, `grupa.html`, `zajecie.html`, `zapisy.html`, `remanent.html` + `zapisy-config.js` = 5 widoków |
| bt-02 | 0.75 | Baza z ekstrakcji publicznych materiałów klienta, nie z materiałów przekazanych | **HIT** | `INWENTARYZACJA.md`: „33 podstrony zescrapowane + cennik 2025/26"; mirror 95+ podstron w `materialy-stara-strona/`; 43/43 opisów zajęć wlane z mirrora; 70 zdjęć z mirrora |
| bt-03 | 0.65 | Ekstrakcja ujawni rozbieżności wymagające ręcznej decyzji przed pokazem | **HIT (mocny)** | `INWENTARYZACJA.md` sekcja „Luki / do potwierdzenia z klientem" — 5 nazwanych pozycji (brak cen Dinozaury 30+ / Street dance 30+, godziny z martwego grafiku, grupy reprezentacyjne poza katalogiem, joga poranna bez danych, soboty aktorskie). Następnie korekta 43 → **52 zajęcia** (9 dołożonych grup Pryzmatu, 16 grup 1:1 z cennikiem) |
| bt-04 | 0.55 | Architektura deep-linkowa/parametryczna zamiast statycznych podstron per zajęcie | **HIT** | `zajecie.html?id=<slug>` (52 pozycje), `grupa.html?g=`, `projekt.html?id=`, `news.html?id=`, `album.html?id=`, index obsługuje `?kto=` `?kat=` `?zaj=` |
| bt-05 | 0.60 | Rabaty jako widoczna reguła / kalkulator w widoku oferty | **HIT** | `cennik.html` — rabaty −20/−50/−10 jako hero-liczby; `zapisy.html` — multiselekt + kalkulator rabatu na żywo (3 zajęcia: 494 zł zamiast 620, „oszczędzasz 126 zł") |
| bt-06 | 0.65 | Demo NIE będzie miało kompletnej warstwy SEO/AEO (JSON-LD + FAQ) | **HIT co do litery, PUDŁO co do uzasadnienia** | Zero `application/ld+json` w 19 stronach demo (jedyne trafienia w mirrorze cudzej strony); brak FAQ. ALE: canonical na 21 stronach, meta description na 21/22, `sitemap.xml` z **201 URL-i**, `robots.txt` z disallow na strony handlowe, mapa 301 **197/197** w trzech formatach (`_redirects`, `vercel.json` 33 KB, `redirects.htaccess`) |
| bt-07 | 0.30 | Jawny benchmark 3–5 konkurentów jako zapisana delta-lista | **HIT kalibracyjny** (przewidziano jako mało prawdopodobne, nie powstał) | Zero śladu benchmarku w repo. Funkcję zastępczą przejął **audyt 5 person ze scoringiem** |
| bt-08 | 0.45 | Osobny artefakt rozdzielający zakres demo od produkcji | **HIT** | `REMANENT-ZAKRES-WEB.md` (17/17 szablonów, sekcja D estymata 12–17 dni, sekcja E „decyzje blokujące po stronie fundacji") + `remanent.html` + `mapa.html` („Zakres prac") jako strony w serwisie, wyłączone z indeksu w `robots.txt` |
| bt-09 | 0.40 | Wycena wariantowa (≥2 pakiety) zamiast jednej kwoty | **HIT** | `WYCENA.md`: WEB 22 000 / WEB+BRAND 29 000 *(rekomendowany)* / PEŁNY 38 000 *(kotwica)* + opieka 600 zł/mies., harmonogram 30/40/30 pod granty, sekcja „co wyciąć, jeśli budżet nie spina" |

**Wynik SYGNAŁ: 9/9 trafionych** (bt-06 z zastrzeżeniem uzasadnienia, bt-07 jako trafna kalibracja negatywna). Base-rate (nie liczony): dokument wyceny — powstał; niedziałająca wysyłka formularza — potwierdzone (`zapisy.html` i `zajecie.html` bez `action`, brak GA4/GTM, świadomie „na produkcję"); over-delivery — potwierdzony i to skrajnie; luka między ukończeniem a doręczeniem — potwierdzona (13 dni); generator nie wyekstrahowany do kanonicznego mini-SSG — potwierdzone.

Wysoka trafność jest jednak myląca i sama w sobie jest ostrzeżeniem: **wszystkie 9 predykcji dotyczyło warstwy wykonawczej artefaktu, żadna nie dotyczyła tego, czy artefakt trafia w popyt klienta.** Tam Router pomylił się całkowicie (sekcja 5).

## 4. Ryzyka — trafienia i pudła

| Ryzyko | Wynik | Dowód |
|---|---|---|
| R1 błąd w danych klienta na jego demo | **TRAFIONE, mitygacja zadziałała** | Realna luka: pierwsze 43 pozycje to było ~83% inwentarza (brakowało 9 grup Pryzmatu do 52). Nazwana i domknięta przed pokazem, nie zgadywana |
| R2 „zbudowane, niepokazane" | **TRAFIONE, mitygacja NIE zastosowana — najdroższa strata projektu** | Demo kompletne 26.07; mail wysłany 08.08 wieczorem (13 dni). Gorzej: istniał **zewnętrzny, twardy termin** — Monika potrzebowała wyceny brutto **przed 31.07**; w notatce: „NIE POSZŁA — przepadło" |
| R3 demo jako darmowa przysługa / one-off | **TRAFIONE, ale mitygacja Routera była zbyt słaba** | 08.08 właściciel odwrócił mechanizm: pokazanie kompletnego demo przed wyceną **obniża wycenę** (klient wycenia domknięcie, nie wartość). Recepta Routera „demo zawsze z wyceną i remanentem" (G5) okazała się niewystarczająca — potrzebna była **kolejność**, nie wiązka |
| R4 brak utrzymującego po wdrożeniu | **TRAFIONE prospektywnie** | `REMANENT-ZAKRES-WEB.md` sekcja E, decyzja blokująca nr 2: „CMS czy opieka sezonowa?"; `WYCENA.md` wycenia opiekę 600 zł/mies. jako osobną pozycję. Nierozstrzygnięte, bo produkcja niesprzedana |
| R5 rozdmuchanie spec worku | **TRAFIONE, mitygacja całkowicie zawiodła** | Zakres cięcia NIE został nazwany przed budową. Faktyczny wynik: 19 stron HTML, 17/17 szablonów, 52 zajęcia, 78+32 rekordy JSON w `dane/`, 70 zdjęć, mapa 301 na 197 adresów, kalendarz tygodnia z 57 blokami, generacja kampanii, audyt 5 person, skrypty QA. Router szacował „1–2 dni" jako proporcję — realnie wielodniowy sprint plus druga fala 08.08 |

## 5. Największe błędy (Routera i Genome)

**B1. Router rozwiązywał problem, o który klient nie prosił.** Realny popyt fundacji, sformułowany przez Monikę Sobotę w mailu 28.07: (1) rolki/relacje, (2) posty zajęć, (3) **plakat wizerunkowy A4+A3 rozwieszany w punktach**, (4) grafiki zajęć per grupa wiekowa, (5) sugestie materiałów. Wprost: „rebranding NIE teraz", najwyżej „delikatna reorganizacja strony na tym co mamy". Router zaprojektował system-strony i wycenę 22–38k netto, przy kotwicy cenowej klienta **50–250 zł za materiał** od lokalnego grafika. Rozjazd oczekiwań rzędu dwóch rzędów wielkości.

**B2. Błędne typowanie decydenta.** Router: „zarząd/założycielka, 1–2 osoby, niska dojrzałość cyfrowa, kupuje emocją". Realnie: operacyjny właściciel kampanii z gotową, ponumerowaną listą deliverables, twardym terminem i kotwicą cenową. To zupełnie inny profil zakupowy — kupuje pozycje z listy, nie wizję systemu.

**B3. Brak bramki intake'u.** Informacja o zakresie i terminie leżała w mailu z 28.07 i została „przeoczona w snippetach" (własna adnotacja w pamięci). Genome nie ma kroku „przeczytaj pełny wątek korespondencji, nie podglądy" przed uruchomieniem Routera. Koszt: przepadła wycena przed 31.07 i cały tydzień okna decyzyjnego.

**B4. Router odrzucił `mech:numeric-gates` — a mechanizm został użyty i zadziałał.** Uzasadnienie odrzucenia („brak konsumenta progu, klient nie jest jeszcze klientem") pomija najczęstszy realny przypadek: konsumentem progu jest **sam wykonawca oceniający własny artefakt**. Faktycznie powstał audyt 5 person ze scoringiem (rodzic 8300, dorosły 7600, nastolatek 6200, senior 5400, opiekun seniora 4100; śr. 6320) → 5 konkretnych napraw, w tym redukcja odległości do telefonu na landingu seniorów **z 9815 px do 866 px**. Plus `sprawdz.py` („Wyjście: liczby, nie »przeszło«. Kod wyjścia 1 przy błędach krytycznych") i `smoke.js` z kontraktem selektorów.

**B5. Anti-context `mech:seo-aeo-foundation` („nie dla artefaktów niepublicznych") jest zbyt szeroki i zostałby złamany słusznie.** Router z niego zawęził zakres do „higieny", a realnie powstała pełna warstwa migracyjna: 197/197 przekierowań wyprowadzonych z tagów canonical zarchiwizowanej strony (czyli z realnego indeksu Google), sitemap 201 URL-i, canonical na 21 stronach. To była praca sprzedażowo najmocniejsza (dowód „nie stracicie pozycji"), a karta odradzała ją robić.

**B6. Warunek sukcesu `mech:single-source-compiler` nie opisuje wariantu, który zadziałał.** Karta wymaga generatora i „regeneracji jednym poleceniem". Tu nie ma żadnego kroku kompilacji — `zajecia.js` to plik danych renderowany runtime'owo przez przeglądarkę. Mechanizm spełnił swój cel (zero duplikacji cen/godzin, 5 konsumentów), a według litery karty byłby oznaczony jako niespełniony. Karta miesza cel (jedno źródło prawdy) ze środkiem (build).

## 6. Największe sukcesy Routera

**S1.** Trafiony rdzeń techniczny: `single-source-compiler` + `working-artifact-extraction` + `machine-narrows-human-picks` opisały faktyczny przebieg pracy niemal 1:1, łącznie z warunkiem twardym „match po nazwie, nie semantycznie" (zrealizowany: 16 grup Pryzmatu 1:1 z cennikiem, luki wypisane jawnie zamiast zgadnięte).

**S2.** Bramka G0 „pokrycie liczone wobec pełnego inwentarza, nigdy próbki" (lekcja z dimedical) była dokładnie tą bramką, której zabrakło w pierwszym podejściu — 43 z 52 pozycji to 83% udające 100%. Wykryte i naprawione, ale dopiero przy audycie, nie przy ekstrakcji.

**S3.** R2 i wskazanie `dated-commitment-gates` jako guarda nadrzędnego. Rekomendacja była trafna, jej niezastosowanie kosztowało przepadłą wycenę i przesunięcie o 13 dni. To najsilniejsze potwierdzenie tej karty w całym Genome — bo tu istniał zewnętrzny termin, więc bramka nie wymagała aktu woli, tylko zauważenia cudzej daty.

**S4.** Przewidziany profil ekonomiczny artefaktu: wariantowa wycena, remanent demo→produkcja i deep-linkowa architektura — wszystkie trzy trafione bez znajomości wykonania.

## 7. Nowe mechanizmy (kandydaci)

1. **`mech:price-anchor-before-proof` (staged reveal).** Kolejność ma pierwszeństwo przed kompletnością: kotwica cenowa i zakres etapów idą PRZED ujawnieniem gotowego artefaktu. Kompletny dowód pokazany przed wyceną przestawia ramę zakupową z „ile warta jest ta zmiana" na „ile kosztuje domknięcie tego, co już jest". Wywodzi się wprost z decyzji 08.08 (demo unpublished, teaser kierunkowy zamiast demo, „wycenę przejdę na rozmowie"). To nie jest zaprzeczenie proof-first — to brakująca warstwa sekwencjonowania nad nim.
2. **`mech:persona-simulation-audit`.** N syntetycznych person ocenia artefakt liczbowo (skala punktowa per persona) → ranking napraw. Tani substytut testów z użytkownikami na spec worku, mierzalny (9815 px → 866 px). Wypełnia dokładnie tę lukę, którą `competitive-benchmarking` obiecuje i nigdy nie dowozi.
3. **`mech:content-provenance-ledger`.** `AUTORSTWO-TRESCI.json` — rejestr rozdzielający tekst pochodzący z materiałów klienta od tekstu napisanego przez r352, per plik i per element. Obowiązkowy dodatek do `working-artifact-extraction`: rozstrzyga, co klient musi potwierdzić, co jest przedmiotem praw autorskich r352 i gdzie demo mogłoby wprowadzić klienta w błąd co do jego własnych faktów.
4. **`mech:render-contract-smoke-test`.** `smoke.js` z kontraktem „adres → selektory, które MUSZĄ mieć niepustą treść po załadowaniu". Powstał z realnej wpadki opisanej w komentarzu w pliku: kontrola statyczna przechodziła, a strony renderowały się puste. Uogólnia się na każdy serwis renderowany runtime'owo z danych.
5. **`mech:redirect-map-from-canonicals`.** Zbiór tagów canonical ze zmirrorowanej starej strony = ground truth listy adresów, które Google faktycznie ma w indeksie (tu: 197). Zamienia „mapowanie przekierowań" z zadania szacunkowego w zadanie policzalne i domykalne (197/197).

## 8. Mechanizmy do usunięcia / przeglądu

- **`mech:competitive-benchmarking` — kandydat do usunięcia.** Piąty projekt z rzędu z tym samym wzorcem: rekomendowany lub dopuszczony, zero śladu wykonania. Tu Router sam obniżył jego prawdopodobieństwo do 0.30 i miał rację. Funkcję zastępczą pełni audyt person. Propozycja: zwinąć kartę do jednego warunku wewnątrz innego mechanizmu albo usunąć.
- **`mech:design-as-code` — odrzucony na przesłance sfalsyfikowanej przez luki T0.** Router odrzucił go argumentem „brak produkcji fizycznej i brak powtarzalnego formatu". Realny brief klienta zawierał plakat A4+A3 do fizycznego rozwieszania oraz komplety materiałów per grupa wiekowa (4 grupy × foto + pusty szablon + wariant patternowy). To jest definicja powtarzalnej rodziny artefaktów. Karta nie jest zła — zły był wsad. Wzmacnia B3.

## 9. Confidence Changes — PROPOZYCJE (zapis wykonuje sesja główna)

| Karta | Kierunek | Uzasadnienie |
|---|---|---|
| `mech:single-source-compiler` | **↑** | Czwarta niezależna replika wzorca; tu 1 plik → 5 konsumentów, 52 rekordy, zero duplikacji. Warunek do przeredagowania (dialekt runtime), nie do osłabienia |
| `mech:working-artifact-extraction` | **↑** | Najmocniejsza jak dotąd realizacja: 197/197 canonicals, 43/43 opisów, mirror 95+ stron, 70 zdjęć, plus rejestr autorstwa |
| `mech:dated-commitment-gates` | **↑** | Potwierdzenie przez brak: nieużycie kosztowało przepadłą wycenę przed 31.07. Doprecyzować: bramka wiąże się z datą z kalendarza KLIENTA, nie z datą samonarzuconą |
| `mech:machine-narrows-human-picks` | **↑ (lekko)** | Zadziałało; warunek „twardy match, nie semantyczny" dowiedziony (16 grup 1:1) |
| `mech:proof-first-demo-pitch` | **↓ / przeklasyfikować** | Mechanizm wykonalny, ale bez warstwy sekwencjonowania działa przeciw właścicielowi. Wymaga anti-contextu i nadrzędnika `price-anchor-before-proof` |
| `mech:seo-aeo-foundation` | **= (przeredagować anti-context)** | Trzon (301/sitemap/canonical) słusznie wykonany na artefakcie niepublicznym; człon AEO (JSON-LD, FAQ) faktycznie pominięty. Anti-context powinien brzmieć „nie dla artefaktów bez następcy produkcyjnego", nie „nie dla niepublicznych" |
| `mech:numeric-gates` | **↑ (odwrócenie odrzucenia)** | Trigger karty widzi tylko przepływy brief→kreacja→akcept; realny i częstszy konsument progu to autor oceniający własny artefakt |
| `mech:competitive-benchmarking` | **↓↓** | Piąte zero wykonania z rzędu |

## 10. Czego Genome nie wiedział w T0

1. Że popyt klienta dotyczył **kampanii i plakatu**, a nie strony — i że rebranding był przez klienta wprost odłożony.
2. Że **istniał zewnętrzny termin** (wycena brutto przed 31.07) i kalendarz decydenta (urlop 31.07–10.08). Router napisał „brak ustalonego terminu pokazu"; termin istniał, tylko nie został wyczytany.
3. Że decydentem jest Monika Sobota (operacyjny właściciel kampanii), a nie zarząd/założycielka.
4. Że rynek ma **kotwicę cenową 50–250 zł/materiał** od lokalnego grafika.
5. Że sam akt pokazania kompletnego dowodu ma **cenę ujemną** przy nieustalonej kotwicie — Genome traktował „dowieziony dowód" jako jednoznaczne dobro.
6. Że w portfelu r352 istnieje działający substytut badań użytkowników (audyt person ze scoringiem), którego żadna karta nie opisuje.

## 11. Jak następny taki projekt byłby lepszy

1. **Bramka intake przed Routerem:** pełna lektura wątku korespondencji z klientem (nie snippetów) + wypisanie listy deliverables słowami klienta i jego kotwicy cenowej. Bez tego Router optymalizuje fikcję.
2. **Bramka datowa wiązana z kalendarzem klienta:** najbliższa data w kalendarzu drugiej strony (termin, powrót z urlopu, start sezonu) jest terminem projektu. Data samonarzucona nie jest bramką.
3. **Sekwencja ujawniania jako pozycja w workflow:** kotwica cenowa i etapy → teaser kierunkowy → dowód. G5 („nie pokazuj demo bez wyceny") zastąpić przez „nie pokazuj dowodu przed kotwicą".
4. **Twarde nazwanie zakresu cięcia przed pierwszą linią kodu spec worku**, z liczbą (godziny/dni) i listą „czego celowo NIE robimy" — R5 zawiodła dokładnie na braku tego kroku.
5. **Pokrycie inwentarza jako liczba z licznika i mianownikiem ze źródła** (52 z cennika, nie 43 ze scrapa) — zanim cokolwiek trafi do widoku.

---

## Evidence (propozycje do evidence[] kart)

```json
[
 {
  "observation": "Jeden plik danych zasilił 5 widoków bez kroku kompilacji — mechanizm zadziałał w dialekcie runtime, którego karta nie opisuje.",
  "proof": "~/Desktop/ARToffNIA/zajecia.js (52 rekordy, window.AFF_Z/AFF_SLUG/AFF_BY_ID) konsumowany przez index.html, grupa.html, zajecie.html, zapisy.html, remanent.html; brak jakiegokolwiek skryptu buildu w repo (są tylko sprawdz.py=QA i wersjonuj.py=cache-bust), 26.07.2026",
  "impact": "Warunek sukcesu 'regeneracja jednym poleceniem' fałszywie oznaczyłby ten projekt jako niespełniający mechanizmu.",
  "proposed_change": "Rozdzielić kartę na dwa dialekty: single-source→build-time (statyczne strony) i single-source→runtime (dane renderowane w kliencie). Warunek sukcesu wspólny: zero wartości zdublowanej ręcznie w widoku.",
  "confidence_effect": "up",
  "mechanisms": ["mech:single-source-compiler"]
 },
 {
  "observation": "Ekstrakcja z 33 podstron dała 43 pozycje przy realnym inwentarzu 52 — 83% udające komplet; luka wykryta dopiero na etapie audytu, nie ekstrakcji.",
  "proof": "INWENTARYZACJA.md ('43 pozycje', sekcja 'Luki / do potwierdzenia z klientem', 5 pozycji) vs zajecia.js (52 rekordy, 16 grup Pryzmatu 1:1 z cennikiem) — pamięć artoffnia-oferta.md, wpis 'KATALOG 1:1', 26.07.2026",
  "impact": "Potwierdza wzorzec z dimedical: pokrycie liczone wobec zescrapowanej próbki jest systematycznie zawyżone. Tu kosztem byłby błąd na demo klienta.",
  "proposed_change": "Dopisać do karty bramkę: mianownik pokrycia bierze się z dokumentu rozliczeniowego klienta (cennik/faktura/grafik), nigdy z liczby zescrapowanych stron.",
  "confidence_effect": "up",
  "mechanisms": ["mech:working-artifact-extraction", "mech:machine-narrows-human-picks"]
 },
 {
  "observation": "Kompletny dowód gotowy przed ustaleniem kotwicy cenowej działa przeciw wycenie — właściciel wycofał demo z publikacji i zastąpił je teaserem kierunkowym.",
  "proof": "artoffnia-oferta.md, wpis 08.08.2026: 'pokazanie pełnego demo przed wyceną WPŁYWA NA WYCENĘ (klient widzi gotowe i wycenia domknięcie, nie wartość)'; demo unpublished z r352.com/artoffnia (commit cbc4535); koncepcja-kierunkowa.html (175 KB) jako artefakt zastępczy",
  "impact": "Mechanizm proof-first bez warstwy sekwencjonowania obniża wartość własnej pracy dokładnie proporcjonalnie do jej kompletności.",
  "proposed_change": "Dodać anti-context do proof-first-demo-pitch: 'nie ujawniać kompletnego artefaktu, dopóki nie ustalono kotwicy cenowej i podziału na etapy'. Wydzielić nadrzędny mech:price-anchor-before-proof.",
  "confidence_effect": "down",
  "mechanisms": ["mech:proof-first-demo-pitch"]
 },
 {
  "observation": "Zewnętrzny termin klienta istniał i został przepuszczony — wycena brutto miała pójść przed 31.07 i nie poszła; artefakt gotowy 26.07 doręczono 08.08.",
  "proof": "artoffnia-oferta.md, sekcja 'ZAKRES KAMPANII OD MONIKI': 'potrzebowała wyceny BRUTTO pilnie przed 31.07 (NIE POSZŁA — przepadło)'; mail kierunkowy wysłany 08.08 wieczorem",
  "impact": "13 dni luki dowóz→doręczenie plus utrata okna decyzyjnego przed urlopem decydentki. Najdroższy pojedynczy koszt projektu.",
  "proposed_change": "Doprecyzować kartę: bramka datowa wiąże się z najbliższą datą z kalendarza KLIENTA (termin, powrót z urlopu, start sezonu). Samonarzucona data bez odbiorcy nie liczy się jako bramka.",
  "confidence_effect": "up",
  "mechanisms": ["mech:dated-commitment-gates"]
 },
 {
  "observation": "Router odrzucił numeric-gates, a projekt użył dwóch niezależnych bramek liczbowych, z których obie wymusiły zmiany.",
  "proof": "audyt 5 person ze scoringiem (rodzic 8300 / dorosły 7600 / nastolatek 6200 / senior 5400 / opiekun 4100, śr. 6320) → 5 napraw, m.in. skrócenie drogi do telefonu na landingu seniorów z 9815 px do 866 px (artoffnia-oferta.md, 26.07); sprawdz.py: 'Wyjście: liczby, nie przeszło. Kod wyjścia 1 przy błędach krytycznych'",
  "impact": "Trigger karty jest napisany wyłącznie pod przepływy brief→kreacja→akcept, przez co Router odrzuca mechanizm w najczęstszym realnym zastosowaniu: samoocenie własnego artefaktu.",
  "proposed_change": "Poszerzyć trigger numeric-gates o 'autor ocenia własny artefakt przed doręczeniem' i dopisać wariant scoringu person jako konsumenta progu.",
  "confidence_effect": "up",
  "mechanisms": ["mech:numeric-gates"]
 },
 {
  "observation": "Na artefakcie niepublicznym powstała pełna warstwa migracyjna SEO (197/197 przekierowań z canonicals, sitemap 201 URL-i, canonical na 21 stronach) i była to praca sprzedażowo najsilniejsza — mimo anti-contextu karty.",
  "proof": "PRZEKIEROWANIA-301.md ('Źródło: znacznik canonical z 197 stron zarchiwizowanej wersji artoffnia.pl... Zmapowane: 197/197'), sitemap.xml (201 <loc>, w tym 52 zajecie.html?id=), _redirects + vercel.json + redirects.htaccess; zero application/ld+json w 19 stronach demo",
  "impact": "Anti-context 'nie dla artefaktów niepublicznych' odradza pracę, która jest najlepszym argumentem handlowym przy migracji ze starej domeny.",
  "proposed_change": "Zmienić anti-context na 'nie dla artefaktów bez następcy produkcyjnego'; rozdzielić kartę na trzon migracyjny (301/sitemap/canonical — robić zawsze, gdy istnieje stary serwis w indeksie) i warstwę AEO (JSON-LD/FAQ — dopiero na produkcji).",
  "confidence_effect": "same",
  "mechanisms": ["mech:seo-aeo-foundation", "mech:split-url-architecture"]
 },
 {
  "observation": "Powstał rejestr autorstwa treści rozdzielający materiał klienta od tekstu napisanego przez r352 — praktyka nieopisana w żadnej karcie.",
  "proof": "~/Desktop/ARToffNIA/AUTORSTWO-TRESCI.json (10,3 KB, klucz 'z_materialow_fundacji' z wpisami per plik/typ/tekst), 26.07.2026",
  "impact": "Przy ekstrakcji z artefaktu klienta bez takiego rejestru nie da się rozstrzygnąć, co klient musi potwierdzić, ani co jest przedmiotem praw r352 przy braku umowy.",
  "proposed_change": "Dodać jako obowiązkowy artefakt do working-artifact-extraction (i kandydat na osobną kartę mech:content-provenance-ledger).",
  "confidence_effect": "up",
  "mechanisms": ["mech:working-artifact-extraction"]
 },
 {
  "observation": "Serwis renderowany runtime'owo z danych przechodził kontrolę statyczną, renderując się pusto; dopiero kontrakt selektorów wykrył awarię.",
  "proof": "smoke.js, komentarz nagłówkowy: 'Powstał, bo kontrola statyczna nie wykrywała stron, które ładowały się z pustą treścią — składnia była poprawna, a skrypt umierał w przeglądarce'; tablica KONTRAKT: adres → selektory, które muszą być niepuste",
  "impact": "Bezpośrednia konsekwencja dialektu runtime w single-source-compiler: im mniej buildu, tym więcej cichych awarii renderu.",
  "proposed_change": "Nowa karta mech:render-contract-smoke-test, powiązana jako warunek konieczny dialektu runtime single-source-compiler.",
  "confidence_effect": "up",
  "mechanisms": ["mech:single-source-compiler"]
 },
 {
  "observation": "Router zaprojektował ofertę systemu strony (22–38k netto) przeciw popytowi na materiały kampanijne z kotwicą 50–250 zł/materiał, bo pełny wątek mailowy nie wszedł do pakietu T0.",
  "proof": "artoffnia-oferta.md, 'ZAKRES KAMPANII OD MONIKI (mail 28.07 21:46 — kluczowy, wcześniej przeoczony w snippetach)': rolki, posty, plakat A4+A3, grafiki per grupa; 'rebranding NIE teraz'; 'KOTWICA CENOWA: lokalny grafik 50–250 zł/materiał'. Kontra: WYCENA.md z 26.07 (22 000 / 29 000 / 38 000 netto)",
  "impact": "Cały dobór mechanizmów był poprawny wykonawczo i chybiony popytowo. Żadna karta nie zapobiegłaby temu — zabrakło kroku intake'u.",
  "proposed_change": "Wprowadzić bramkę wejściową Routera: pełna lektura wątku korespondencji + wypisanie deliverables słowami klienta, jego terminu i kotwicy cenowej PRZED doborem mechanizmów.",
  "confidence_effect": "same",
  "mechanisms": ["mech:proof-first-demo-pitch", "mech:dated-commitment-gates"]
 }
]
```
