---
id: "rec:backtests/kubota-stand-3d"
type: "record"
title: "Backtest — kubota-stand-3d"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:kubota-stand-3d"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — kubota-stand-3d (Stand KUBOTA×Baltona, wizualizacja 3D z dielinów)

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
T0 ≈ 17.07.2026 (data dostarczenia dielinów: pliki `01-02.svg`, `lewa1/prawa1.svg`, `tyl.svg` mają mtime 17.07 12:42–13:15).
Źródła przebiegu rzeczywistego: kod `/Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/kubota-stand-3d/` (build.py 32,5 KB, index.html 190,8 KB, 7 plików źródłowych), `memory/kubota-stand-3d.md` (mod. 2026-08-04), karta `proj:kubota-stand-3d`, deploy `/Users/reszek/Desktop/R352 WEBSITE/public/kubotabaltona/index.html`.
Brak historii gita — projekt nigdy nie był wersjonowany (katalog untracked w repo nadrzędnym).

## Pakiet T0 (co Genome mogło wiedzieć)

Baltona (kontakt operacyjny: Bartosz Mossakowski), marka na standzie: KUBOTA. Klient dostarcza dieliny 2D w SVG (rozkrój kartonowego standu na klapki) + asset graficzny `Group 637722.png` na Desktopie. Z płaskiego rozkroju nie da się ocenić bryły. Akceptacja konstrukcji i grafik musi zapaść przed drukiem; render studyjny jest wolny i drogi wobec wagi zlecenia, generacja AI z opisu tekstowego halucynuje konstrukcję. Cel: 3D wyprowadzone bezpośrednio z dielinów produkcyjnych. Ograniczenia: artefakt fizyczny z twardymi wymiarami, źródła prawdy poza repo (Desktop), brak zdefiniowanego wolumenu kolejnych standów, nieodwracalność druku, nieznany podział akceptacji konstrukcja-vs-grafika. Nierozstrzygnięte w T0: one-off czy pierwszy z rodziny; czy dieliny są finalne; czy artefakt będzie publiczny.

## Przebieg A — skrót raportu Routera T0

**Rekomendowane (5):** `mech:working-artifact-extraction` (pierwszy, ekstrakcja geometrii z dielinu zamiast modelowania), `mech:design-as-code` (rdzeń wykonawczy, bramka: jawna skala jednostkowa przed pierwszą ścianką), `mech:incident-to-guard` (wariant geometry-check na finalnym renderze, z datowanym checkpointem), `mech:sandbox-promotion` (wyłącznie warstwa „który plik jest kanoniczny"), `mech:negative-knowledge-ledger` (wsparcie, niski koszt).
**Odrzucone (5):** `mech:format-dictionary`, `mech:machine-narrows-human-picks`, `mech:numeric-gates` (zastąpiony bramką binarną), `mech:competitive-benchmarking`, `mech:proof-first-demo-pitch`.
**Workflow:** 7 kroków, 5 bramek (kanon+inwentarz paneli → skala → budowa → weryfikacja geometrii → akcept i promocja → runda feedbacku → zamknięcie). Bramka SEO/AEO oznaczona jako warunkowa: uruchamia się, jeśli artefakt trafi na publiczny URL r352.com.
**Ryzyka top-5:** (1) praca na nieaktualnym dielinie, (2) cichy rozjazd render↔dielin „wygląda ok", (3) rozjazd akceptacji konstrukcja vs grafika, (4) przeskalowanie mechanizmu do one-offa, (5) pułapki środowiska renderowego.
**Predykcje-SYGNAŁ:** bt-01…bt-07 (p od 0,82 do 0,28).

## USTALENIE METODOLOGICZNE — kontaminacja leave-one-out

**Trzy z siedmiu predykcji-sygnał są bezwartościowe predykcyjnie, bo odpowiedź była wydrukowana w karcie, którą Router czytał.**

Karta `mech:design-as-code` (v2, updated 2026-08-08) zawiera:
- `ev:design-as-code-002`: *„kubota-stand-3d — build.py składający stand 3D z dielinów w CSS, ?plate= do renderów; zero bibliotek"* → to jest dosłownie treść **bt-01** (CSS, bez biblioteki 3D) i **bt-04** (tryb `?plate=`).
- Warunki porażki (proza karty, nie evidence[]): *„Drift plików źródłowych: przeterminowany tyl.svg na Desktopie w kubota"* → to jest dosłownie treść **bt-03** i ryzyka nr 1.
- Sekcja „Mechanizm działania": *„jawną, zadeklarowaną skalą jednostkową (1 cm = 10 px; **10 j. = 1 cm**)"* → drugi zapis to notacja kubota, wprost odpowiedź na **bt-02**.

Leave-one-out (PROTOKOL pkt 2) był egzekwowany na poziomie `evidence[]` — a kontaminacja siedzi w **prozie karty**: w warunkach porażki, w opisie mechanizmu, w triggerze. Evidence z kubota nie zostało pominięte także dlatego, że karta wymienia projekt z nazwy w polu tekstowym, którego żadne filtrowanie po `source` nie usunie.

Konsekwencja dla oceny: bt-01, bt-02, bt-03, bt-04 raportuję jako **HIT-skażony** (claim prawdziwy, wartość dowodowa zerowa). Realny materiał dowodowy tego backtestu to **bt-05, bt-06, bt-07** oraz obserwacje z kodu, których żadna karta nie znała.

## Przebieg B — porównanie z rzeczywistością

### Predykcje-SYGNAŁ

| ID | p | Werdykt | Dowód |
|---|---|---|---|
| bt-01 (CSS 3D, zero bibliotek) | 0,82 | HIT-skażony | `grep -c "three\|webgl\|getContext" index.html` = **0**; bryła na `transform-style:preserve-3d`, `rotateY`, `translate3d` (index.html:111–119) |
| bt-02 (jawna stała skali) | 0,70 | HIT-skażony | build.py:210–211 `const K = 10;` (jednostki dielinu na cm) + `const U = 3.5; // px ekranu na 1 cm` — **dwustopniowy** łańcuch skali, oba jako parametry |
| bt-03 (incydent nieaktualnego źródła) | 0,62 | HIT-skażony | memory: „tyl.svg na Desktopie ≠ aktualny", „wcześniejszy tyl.svg był zły" → zastąpiony `plecy.svg`; po redesignie 17.07 również `lewa1/prawa1/plecy` stały się nieaktualne |
| bt-04 (tryb renderu wielu ujęć) | 0,55 | HIT-skażony | build.py:569–583 `?plate=front\|34\|side\|back\|top [&dims=1] [&zoom=…]` — 5 ujęć z jednego źródła |
| **bt-05** (zmiana konstrukcyjna po pokazie, wprowadzona kodem) | 0,50 | **HIT (czysty)** | Feedback Baltony 17.07 → konstrukcja DWUSTRONNA; docstring build.py:3–5 dokumentuje zmianę: „pionowa płyta przeniesiona na środek podstawy, BEZ ścian bocznych, pegboard BIAŁY dwustronny". Druga runda: `bok.svg` od Bartosza (mtime 04.08) → pylony. Zero przerysowania — obie rundy przez edycję build.py |
| **bt-06** (AI generatywne sterowane geometrią, i2i z plate'ów) | 0,42 | **HIT (czysty, najmocniejszy)** | memory: „Rendery robić image-to-image z plate'ów (media_upload → curl PUT → media_confirm → nano_banana_pro), nigdy z samego tekstu"; karta projektu: „rendery Higgsfield 4K (front/34/bok/tył) zrobione i2i z plate'ów" |
| **bt-07** (automatyczna weryfikacja renderu wobec dielinu) | 0,28 | **NIE ZISZCZONE — kalibracja poprawna** | Inwentarz katalogu: 7 plików, żaden nie jest skryptem weryfikacyjnym. Jedyny kod to `build.py`. Brak inwentarza paneli, brak porównania wymiarów |

**Wynik na predykcjach czystych: 2/3 zrealizowane zgodnie z claimem, trzecia (bt-07) poprawnie oznaczona jako mało prawdopodobna.** Router był uczciwy wobec własnego workflow — przewidział, że jego własna Bramka 3 nie powstanie, i miał rację.

### Cena nieistniejącej Bramki 3 — wykryta rozbieżność wymiarowa

Weryfikacja, której nikt nie wykonał, wykonana teraz ręcznie na finalnym pliku, znajduje kandydata na dokładnie tę klasę błędu, którą Router opisał jako ryzyko nr 2 („wygląda ok"):

- `bok.svg` (finalny plik konstrukcyjny Bartosza, mtime 04.08): `viewBox="0 0 98 436"`, proporcja 98:436 = 0,2248.
- build.py:270–277: pylon renderowany jako panel `w:SIDE_W, h:PYL_H`, gdzie `PYL_H = Y_BASE_TOP − PYL_TOP = 89,93 − 9,93 = 80,0` cm — zgodne z komentarzem.
- Przy wysokości 80 cm proporcja źródła implikuje szerokość **17,98 cm**. Kod ustawia `const SIDE_W = 20;` (build.py:260) i renderuje SVG z `preserveAspectRatio="none"` (build.py:264) → **artwork rozciągnięty o ~11% w poziomie**.
- Kod sam siebie dementuje: komentarze w build.py:28 i :256 mówią *„pylon 18×80 cm, finalny plik Bartosza"*. Memory mówi *„pylony 18 cm głębokości"*. Render mówi 20.

To nie jest przesądzony błąd produkcyjny (SIDE_W mogło być świadomym zaokrągleniem), ale jest to **dokładnie ten typ rozbieżności, którego wykrycie było celem Bramki 3, i którego wizualnie nie widać**. Wymaga potwierdzenia u Bartosza przed ewentualnym drukiem. Wartość backtestu: ryzyko nr 2 nie jest teoretyczne — materializuje się w pliku, który od 17.07 stoi publicznie jako materiał akceptacyjny.

### Dodatkowa rozbieżność: skala nie jest globalna

`01-02.svg` ma skalę 10 jednostek = 1 cm (rect 600 j. = 60 cm szerokości podstawy — potwierdzone: `<rect width="600" ... translate(423.926 99.334)>`). `bok.svg` przy wysokości 80 cm ma ~5,45 jednostki na cm. **Drugie źródło przyszło w innym układzie jednostek niż zadeklarowany kanon** — i nic tego nie wychwyciło, bo `K = 10` jest zadeklarowane raz, globalnie, jako właściwość projektu, a nie właściwość pliku.

To jest bezpośrednia falsyfikacja warunku sukcesu karty `design-as-code`: *„Jawna skala jednostkowa zadeklarowana raz, na początku"*. Warunek jest **niewystarczający** dla wielu źródeł. Poprawna forma: skala deklarowana **per plik źródłowy**, z uzgodnieniem przy każdym nowym wejściu.

### Ekstrakcja: wykonana lepiej, niż karta opisuje — i z jedną luką

Router trafnie postawił `working-artifact-extraction` na pierwszym miejscu, ale rzeczywistość zrealizowała **mocniejszy wariant, którego karta nie opisuje**:

- Dielin jest **wklejony w całości** do wyjścia jako `<g id="dl">` w `<defs>`, a każdy panel bryły to `<svg viewBox="…"><use href="#dl"></svg>` — czyli **okno kadrujące na źródle**, nie kopia grafiki (build.py:200, :233–234, :251–255, :283–290). Grafika strukturalnie **nie może** rozjechać się z dielinem, bo nie istnieje jej druga instancja.
- Stałe wymiarowe są transkrybowane jako **surowe współrzędne dielinu z jawnym przeliczeniem**: `Y_WING_TOP = 99.334/K`, `Y_HDR_BOT = 284.403/K`, `Y_BASE_TOP = 899.334/K`, `Y_FLOOR = 1299.334/K` (build.py:215–218). Wartości są audytowalne — `99.334` i `185.069` znajduje się wprost w `01-02.svg` (`translate(423.926 99.334)`, `height="185.069"`; ich suma = 284,403). To ekstrakcja ręczna, ale **niezrywalnie zakotwiczona w źródle**.
- **Luka:** sylwetka pylonu została przepisana do kodu jako literał ścieżki (`BOK_SIL`, build.py:263) zamiast referencji do `bok.svg`. Jedyny element odrysowany zamiast wykadrowany jest jednocześnie jedynym elementem z rozbieżnością wymiarową. Korelacja nie jest przypadkowa.

### Kanon źródeł: skopiowany, ale nieoznaczony

Rekomendacja `sandbox-promotion` (wariant „wskaż kanon") została wykonana **w połowie**:
- ✅ Kopia do repo projektu wykonana; memory zapisuje regułę: „źródłem prawdy są kopie w folderze projektu".
- ✅ Jawny akt promocji do publikacji: `index.html` skopiowany do `R352 WEBSITE/public/kubotabaltona/` (pliki bajt w bajt identyczne, `diff` czysty), push = deploy.
- ❌ **Deprecjacja nie istnieje.** W katalogu kanonicznym leży 7 plików źródłowych, z których build.py używa **trzech** (`01-02.svg`, `bok.svg`, `baltona.png`). `lewa1.svg`, `prawa1.svg`, `tyl.svg`, `plecy.svg` są martwe (memory 04.08: „Stare ścianki lewa1/prawa1 i plecy.svg NIEAKTUALNE (archiwum)") — ale nie ma katalogu `archiwum/`, nie ma sufiksu, nie ma daty. Nieodróżnialne od żywych.
- ❌ Manifest w kodzie **sam zdryfował**: docstring build.py:8–10 wymienia jako źródła tylko `01-02.svg` i `baltona.png`; `bok.svg` jest ładowany w linii 28 i nie figuruje w manifeście.

Wniosek: „skopiuj do repo i wskaż kanon" chroni przed importem złej wersji **na wejściu**, ale nie chroni przed **starzeniem się wejść w trakcie projektu**. Brakującym krokiem jest deprecjacja/archiwizacja plików wypartych przez feedback.

### Bramka SEO/AEO: warunek się spełnił, bramka nie zadziałała

Router zapisał: bramka nieaplikowalna w T0, *„uruchamia się warunkowo: jeśli artefakt trafi na publiczny URL r352.com"*. Warunek **się spełnił** — `r352.com/kubotabaltona` LIVE od 17.07. Stan faktyczny strony:
- `grep -c "noindex\|robots"` = **0** — brak jakiejkolwiek kontroli indeksowania,
- brak jakiegokolwiek odwołania do `kubotabaltona` w całym repo strony (`grep -rl` = brak trafień) — nie ma linku, nie ma wpisu w sitemapie, nie ma pozycji w `robots.txt`,
- jest `<title>` („KUBOTA × Baltona — stand ekspozycyjny 60×40×130 · wizualizacja 3D"), brak meta description.

Czyli: **publiczny, indeksowalny, osierocony materiał klientowski**. Ani zabezpieczony jak wewnętrzny (noindex/hasło — wzorzec z `dailyfruits-katalog-handlowy`), ani potraktowany jak case akwizycyjny (`seo-aeo-foundation`, linkowanie z /work). Bramka warunkowa bez właściciela i daty nie uruchamia się sama — to ten sam wzorzec, co „guard powstanie kiedyś".

### Ryzyka Routera — rozliczenie

| # | Ryzyko | Werdykt |
|---|---|---|
| 1 | Praca na nieaktualnym dielinie | **HIT** (tyl.svg → plecy.svg; potem cała trójka lewa1/prawa1/plecy wyparta), ale skażony — ryzyko przepisane z karty nazywającej kubota |
| 2 | Cichy rozjazd render↔dielin „wygląda ok" | **HIT** — SIDE_W 20 vs 17,98 cm implikowane przez bok.svg; niewykryte przez ~4 dni na żywej stronie |
| 3 | Rozjazd akceptacji konstrukcja vs grafika | **PUDŁO** — akceptacja szła jednym kanałem (Bartosz), a feedback dotyczył wyłącznie konstrukcji (dwustronność, pylony); żadnej rundy grafiki. Model „dwóch ośrodków decyzyjnych" nie zmaterializował się |
| 4 | Przeskalowanie mechanizmu do one-offa | **PUDŁO (odwrotnie)** — amortyzacja przyszła z trzech stron naraz: 5 ujęć `?plate=`, 2 rundy przebudowy konstrukcji, plate'y jako wsad i2i dla Higgsfield. Setup zwrócił się mimo braku „rodziny standów". Anti-context karty design-as-code jest w tej klasie zbyt ostrożny |
| 5 | Pułapki środowiska renderowego | **HIT** — `transform-origin: 0 0` (bez tego panel przesuwa się o pół szerokości przy rotateY ±90; komentarz w kodzie index.html:114–116), headless Chrome wymaga `--allow-file-access-from-files`, białe litery KUBOTA w lockupie niewidoczne na białym podglądzie |

## Raport 10 sekcji

**1. Accuracy Routera.** Ryzyka: 3/5 hit (1, 2, 5), 2/5 pudło (3 — fikcyjny drugi ośrodek decyzyjny; 4 — obawa o nieamortyzowany setup odwrócona przez rzeczywistość). Predykcje-sygnał: 4 skażone (bezwartościowe), 2/3 czyste HIT, 1 poprawnie skalibrowany negatyw. Workflow: bramki 1–2 wykonane częściowo (kanon skopiowany, skala zadeklarowana; inwentarz paneli nie powstał), bramka 3 niewykonana, bramka 4 wykonana (akcept Przemka przed pokazem — potwierdza to twarda reguła „żadnych renderów przed zatwierdzeniem index.html"), bramka 5 wykonana de facto. **Realna accuracy po odjęciu kontaminacji: dobra na strukturze ryzyk, słaba na modelu decyzyjnym klienta.**

**2. Accuracy Mechanism Selection.** Rekomendowanych 5. Pełne trafienia 2 (`working-artifact-extraction` — wykonany w mocniejszym wariancie niż karta opisuje; `design-as-code` — wykonany w pełni, z parametrycznością i renderem headless). Częściowe 2 (`sandbox-promotion` — kopia i promocja tak, deprecjacja nie; `negative-knowledge-ledger` — pary „nie działa bo X → rób Y" powstały co do jednej, ale wylądowały w auto-memory, nie w ledgerze). Nieużyty 1 (`incident-to-guard` — zero śladu). Odrzucenia: wszystkie 5 poprawne, żaden odrzucony mechanizm nie okazał się potrzebny. **Fit ≈ 60% pełny, 40% częściowy/nieużyty; zero rekomendacji szkodliwych.**

**3. Największe błędy.** (a) **Kontaminacja leave-one-out przez prozę karty** — 4 z 7 predykcji odpowiadały na pytania, na które karta `design-as-code` już zawierała odpowiedź, łącznie z nazwą projektu w warunkach porażki; protokół filtruje `evidence[]`, a nie treść. (b) Ryzyko nr 3 zmyślone — Router wydedukował „dwa ośrodki decyzyjne (produkcja vs marka)" z typologii klienta, a nie z faktów; kosztowałoby to rekomendację rozbicia pokazu na dwa pytania bez potrzeby. (c) Warunek sukcesu `design-as-code` „skala zadeklarowana raz" przyjęty bezkrytycznie — okazał się niewystarczający przy drugim źródle w innym układzie jednostek. (d) Bramka SEO oznaczona jako warunkowa bez właściciela i daty → warunek się spełnił, bramka nie zadziałała, artefakt klientowski stoi publicznie i indeksowalnie.

**4. Największe sukcesy.** (a) **bt-06 to najlepsza predykcja tego backtestu**: p=0,42, nieskażona, precyzyjna co do mechanizmu (i2i z plate'ów, nie t2i) — i trafiona co do joty, łącznie z uzasadnieniem kosztowym. (b) bt-07 — Router przewidział, że jego własna bramka blokująca nie powstanie, i podał p=0,28 wbrew własnej rekomendacji; to jest właściwy wzorzec uczciwości i należy go utrzymać. (c) Postawienie `working-artifact-extraction` PRZED produkcją było trafne i zrealizowane w wariancie silniejszym niż zapisany w karcie. (d) Odrzucenie `numeric-gates` na rzecz bramki binarnej — poprawne; nic w tym projekcie nie było rubrykowalne.

**5. Nowe mechanizmy (hipotezy).** Trzy kandydatury, wszystkie użyte realnie i żadna nierekomendowana w T0 — patrz sekcja 8.

**6. Mechanizmy do usunięcia.** Brak kandydatów do usunięcia. `mech:incident-to-guard` zebrał kolejne (piąte w transzy) „rekomendowany → niewykonany" — to nie jest wada mechanizmu, tylko wada jego formy: karta opisuje guard jako krok procesu, a proces w małych zleceniach nie ma gdzie go zawiesić. Kandydat na **przeformułowanie**, nie usunięcie (patrz hipoteza guard-by-construction).

**7. Confidence Changes (PROPOZYCJE — zapisy robi sesja główna).**
- `mech:design-as-code`: +evidence typu postmortem (retro, wynik rzeczywisty: LIVE, zaakceptowany przez klienta, dwie rundy zmian przez kod). **UWAGA dedupe:** karta ma już `ev:design-as-code-002` (narracja) dotyczący tego samego projektu ze skanu CKO 07.08 — zgodnie z niezmiennikiem 10 i regułą dedupe z bt#001, evidence backtestu powinno **przeklasyfikować** ev-002 narracja→postmortem, a nie dołożyć drugiego wpisu. **Bez podbicia confidence.** Dodatkowo: korekta warunku sukcesu (skala per plik źródłowy) + flaga.
- `mech:working-artifact-extraction`: +evidence typu postmortem (wariant „źródło osadzone w całości + panele jako okna viewBox"). Projekt nie figuruje jeszcze w evidence[] tej karty → wpis nowy, dedupe czysty. **Bez podbicia confidence** (n=15 przy 0 measurement; potrzeba pomiaru, nie kolejnej narracji).
- `mech:sandbox-promotion`: +evidence typu postmortem, kierunek: **too-narrow** — brak kroku deprecjacji wejść wypartych w trakcie projektu. Bez podbicia confidence.
- `mech:incident-to-guard`: +evidence typu postmortem, kierunek negatywny (rekomendowany, niewykonany, koszt zmaterializowany jako niezweryfikowana rozbieżność 20 vs 17,98 cm). **Bez podbicia confidence** — to piąte z rzędu potwierdzenie niewykonalności w obecnej formie.
- `mech:negative-knowledge-ledger`: +evidence typu postmortem, kierunek: pary powstały (4 sztuki, wszystkie użyteczne), nośnik zawiódł (auto-memory zamiast ledgera). Bez podbicia confidence.
- `mech:seo-aeo-foundation`: bez evidence z tego projektu; osobna obserwacja procesowa o bramkach warunkowych bez daty (do Ledgera, nie do karty).

**8. Nowe hipotezy.**
- **`mech:truth-before-polish-gate`** (hipoteza) — twarda reguła kolejności: artefakt ustalający prawdę (geometria z pliku produkcyjnego) musi być **zaakceptowany** przed uruchomieniem jakiejkolwiek generacji wizualnej; generacja wyłącznie i2i z zatwierdzonych plate'ów. Dowód: reguła Reszka zapisana w memory („ŻADNYCH renderów Higgsfield/AI dopóki index.html nie jest zatwierdzony — renderowanie z błędnego źródła to przepalanie kredytów"). Uzasadnienie ma **dwa niezależne ramiona** — antyhalucynacyjne i kosztowe — i to drugie jest w Genome nienazwane. Kandydat na regułę firmową (`rule:`), nie tylko mechanizm.
- **`mech:guard-by-construction`** (hipoteza) — tam, gdzie się da, projektować tak, żeby błędny stan był **niereprezentowalny**, zamiast dokładać krok weryfikacji. Dowód z tego projektu jest kontrolowanym eksperymentem naturalnym: grafika osadzona jako `<use href="#dl">` na kadrowanym źródle **nie mogła** zdryfować i nie zdryfowała; jedyny element odrysowany do kodu (`BOK_SIL`) jest jedynym elementem z rozbieżnością wymiarową. Predykcja falsyfikowalna: w projektach klasy design-as-code błędy skupią się dokładnie w tych miejscach, gdzie źródło zostało skopiowane zamiast zreferencjonowane. To jest bezpośrednia odpowiedź na chroniczne „guard rekomendowany → guard niewykonany".
- **`mech:input-manifest` / rozszerzenie sandbox-promotion** — plik-manifest wejść (żywe / wyparte / data / skala per plik), aktualizowany przy każdym nowym wejściu od klienta. Adresuje trzy zaobserwowane usterki naraz: martwe SVG w katalogu kanonicznym, zdryfowany docstring, drugie źródło w innej skali.
- **Poprawka PROTOKOŁU (poziom programu):** leave-one-out musi usuwać wzmianki o backtestowanym projekcie z **całej karty** — triggera, kontekstu, warunków sukcesu/porażki, sekcji „Mechanizm działania" — a nie tylko z `evidence[]`. Praktycznie: `grep -i <nazwa-projektu>` po karcie przed przebiegiem A; każde trafienie maskowane. Bez tego przebieg A mierzy pamięć, nie predykcję.

**9. Czego Genome nie wiedział w T0.**
- Że skala jednostkowa jest właściwością **pliku**, a nie projektu — i że kolejne wejścia od klienta przychodzą w innych układach (98×436 vs 1447×1300).
- Że ekstrakcja ma silniejszą formę niż „zdejmij wartości ze źródła": **osadź źródło i kadruj oknami** — po czym cała klasa driftu przestaje istnieć.
- Że amortyzacja design-as-code na one-offie idzie nie przez „rodzinę artefaktów", tylko przez **liczbę ujęć × liczbę rund przebudowy × rolę plate'ów jako wsadu dla generacji**. Anti-context karty zbyt szeroko odstrasza od one-offów z twardą geometrią.
- Że w tym typie zlecenia decydent jest **jeden** (kontakt operacyjny), a feedback dotyczy **konstrukcji, nie grafiki** — grafika jest dana przez dielin i nie podlega negocjacji.
- Że artefakt akceptacyjny dla klienta trafia na publiczną domenę r352 **bez decyzji o jego statusie** — to nie jest wyjątek, to domyślne zachowanie (ten sam wzorzec co katalog handlowy DailyFruits, tam rozwiązany hasłem + noindex).

**10. Jak następny projekt tej klasy będzie lepszy.** Każde zlecenie „plik produkcyjny → wizualizacja/artefakt fizyczny" dostaje z automatu: (a) manifest wejść z **datą i skalą per plik**, uzupełniany przy każdej dostawie od klienta, z jawnym oznaczaniem plików wypartych; (b) regułę „referencja zamiast kopii" — każde odrysowanie elementu do kodu wymaga uzasadnienia, bo tam wylądują błędy; (c) reguła kolejności prawda-przed-polerem jako standard przy każdym pipeline z generatywką; (d) jedno pytanie w T0: „kto akceptuje?" — zamiast dedukowania ośrodków decyzyjnych z typologii klienta; (e) decyzja o statusie deliverable'u (prywatny z noindex / publiczny jako case) podejmowana **przy pierwszej publikacji**, nie warunkowo „kiedyś".

## Evidence (propozycje wpisów do kart + Ledger)

- **E1** {obserwacja: warunek sukcesu `design-as-code` „jawna skala zadeklarowana raz" jest niewystarczający — drugie źródło od klienta przyszło w innym układzie jednostek (bok.svg ~5,45 j./cm vs kanoniczne 10 j./cm w 01-02.svg) i nic tego nie wychwyciło; dowód: build.py:210 `const K = 10` jako stała globalna, bok.svg `viewBox="0 0 98 436"` przy zadeklarowanej wysokości 80 cm; wpływ: rozbieżność szerokości pylonu 20 cm w renderze vs 17,98 cm implikowane przez plik Bartosza, na żywej stronie akceptacyjnej; zmiana: warunek sukcesu → „skala deklarowana per plik źródłowy + uzgodnienie przy każdym nowym wejściu"; confidence: bez zmian, flaga too-narrow; mech: design-as-code}
- **E2** {obserwacja: ekstrakcja w wariancie „źródło osadzone w całości + panele jako okna viewBox" czyni drift grafiki **niereprezentowalnym**, a jedyny element odrysowany do kodu jest jedynym z rozbieżnością; dowód: build.py:200 `<g id="dl">__DIELINE__</g>`, :233 `tile()` = `<svg viewBox><use href="#dl">`, vs :263 `BOK_SIL` jako literał ścieżki → :260 `SIDE_W = 20` sprzeczne z komentarzem „18×80 cm"; wpływ: sugeruje przewagę guard-by-construction nad guard-by-check w klasie design-as-code; zmiana: opisać wariant w karcie WAE + hipoteza `mech:guard-by-construction`; confidence: +postmortem bez podbicia; mech: working-artifact-extraction, incident-to-guard}
- **E3** {obserwacja: „skopiuj do repo i wskaż kanon" nie chroni przed starzeniem się wejść W TRAKCIE projektu — w katalogu kanonicznym leżą 4 martwe SVG nieodróżnialne od żywych, a manifest w docstringu build.py pomija faktycznie używane bok.svg; dowód: katalog kubota-stand-3d/ (7 plików źródłowych, build.py używa 3), memory 04.08 „lewa1/prawa1 i plecy.svg NIEAKTUALNE (archiwum)" przy braku katalogu archiwum, docstring build.py:8–10 vs linia 28; wpływ: powtórzenie klasy „praca na złej wersji" mimo wykonania rekomendacji; zmiana: dodać krok deprecjacji/manifestu wejść do karty; confidence: bez zmian, flaga too-narrow; mech: sandbox-promotion}
- **E4** {obserwacja: reguła kolejności „zero generacji AI przed zatwierdzeniem artefaktu prawdy; potem wyłącznie i2i z plate'ów" była realnie egzekwowana i ma podwójne uzasadnienie — antyhalucynacyjne i kosztowe — a Genome nie ma dla niej karty; dowód: memory kubota-stand-3d („ŻADNYCH renderów Higgsfield/AI dopóki index.html nie jest zatwierdzony… renderowanie z błędnego źródła to przepalanie kredytów"), karta projektu („rendery Higgsfield 4K zrobione i2i z plate'ów"), build.py:569–583 tryb `?plate=` jako producent wsadu; wpływ: brakująca karta dla powtarzalnego wzorca w każdym projekcie z generatywką; zmiana: nowa hipoteza `mech:truth-before-polish-gate` (kandydat także na `rule:`); confidence: n/d — nowy byt; mech: (nowy)}
- **E5** {obserwacja metodologiczna: leave-one-out egzekwowany na `evidence[]` przecieka przez prozę karty — `mech:design-as-code` wymienia kubota z nazwy w warunkach porażki („przeterminowany tyl.svg na Desktopie w kubota") i opisuje jego rozwiązanie w `ev:design-as-code-002` („build.py… w CSS, ?plate=… zero bibliotek"), przez co bt-01/02/03/04 odpowiadały na pytania z wydrukowaną odpowiedzią; dowód: treść karty design-as-code v2 vs predykcje bt-01…04; wpływ: zawyżona accuracy przebiegu A w każdym backteście, gdzie projekt zdążył zasilić karty skanem CKO 07.08; zmiana: PROTOKOL pkt 2 → maskowanie nazwy projektu w CAŁEJ karcie przed przebiegiem A + odnotowanie „karta zawiera projekt X" w raporcie; confidence: n/d; mech: wszystkie}
- **E6** {obserwacja: bramka warunkowa bez właściciela i daty nie uruchamia się — warunek „artefakt trafia na publiczny URL r352.com" spełnił się 17.07, a deliverable stoi indeksowalny, bez noindex, bez linku i bez wpisu w sitemapie; dowód: `r352.com/kubotabaltona` (plik w R352 WEBSITE/public/kubotabaltona/index.html), `grep -c "noindex|robots"` = 0, `grep -rl kubotabaltona` w repo strony = brak trafień; wpływ: materiał klientowski w stanie pośrednim — ani zabezpieczony, ani wykorzystany akwizycyjnie; zmiana: decyzja o statusie deliverable'u przy pierwszej publikacji jako bramka stała w ROUTER.md (wzorzec z dailyfruits-katalog-handlowy: hasło + noindex); confidence: n/d; mech: sandbox-promotion, seo-aeo-foundation}
