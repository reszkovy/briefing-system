---
id: "rec:backtests/lumo-brand"
type: "record"
title: "Backtest — lumo-brand"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — lumo-brand

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
T0 ≈ 20.07.2026 (moment startu drugiego podejścia, po feedbacku „ultra tanio").
Cel przebiegu B: **falsyfikacja**. Oceniam raport Routera T0 (10 predykcji SYGNAŁ, 5 mechanizmów rekomendowanych) — nie poprawiam go.

Źródła przebiegu rzeczywistego:
- `/Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/lumo-brand.md` (zapis sesji ~20.07.2026, poziom szczegółu: konstrukcja per node)
- `/Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/r352-os/genome/projects/lumo-brand.md` (karta, import CKO 07.08.2026, update 08.08.2026, status `archived`)
- `ev:working-artifact-extraction-006` (skan CKO 07.08.2026) — użyte wyłącznie do dedupe confidence
- Weryfikacja negatywna: `grep -ril lumo` po całym Genome + `find` po Desktop/Documents → **brak katalogu kodu projektu, brak commitów**. Jedyny znaleziony folder `/Users/reszek/Desktop/porzadki/LUMO_Pack` (a3/a5/IG, pliki z 26.02.2026) jest sprzed T0 i nie należy do tego zlecenia.

_Uwaga porządkowa: ten plik zastępuje wcześniejszy przebieg B prowadzony przeciw krótszemu raportowi Routera (6 predykcji). Ustalenia tamtego przebiegu, które utrzymały się przy niezależnej weryfikacji (granica `design-as-code`, za szeroki trigger `competitive-benchmarking`, utknięcie na wejściach), są tu zachowane i wzmocnione; reszta przeliczona od zera na nowym raporcie A._

---

## Pakiet T0 (skrót)

Lumo — mikrolokal (kawa + jedzenie + koktajle „tance"), właściciel-operator, zero procesu, zero repo. Deliverable: wizytówka-podziękowanie 90×50 mm zachęcająca gościa do zostawienia opinii w Google. **To nie jest greenfield:** v1 odrzucona jako „ultra tanio" (płaskie tło, wycentrowany layout). Istnieje brand board w Figmie (`cT8VW3OE3zxvBERLIWZJzO`). Twardy bloker: `exportAsync` na logo zwraca błąd. Artefakt fizyczny, drukowany — offline nie wybacza. Ostatnia mila (realny link do opinii, logo w wektorze) leży poza r352.

## Skrót raportu Routera (przebieg A)

**Rekomendowane (5):** `working-artifact-extraction` (destylat brandu), `storefront-qr-bridge` (most offline→online z dedykowanym celem), `design-as-code` **wyłącznie punktowo** (programowa weryfikacja QR na finalnym eksporcie; pełny pipeline HTML→render jawnie przeciwwskazany), `negative-knowledge-ledger` (para: `exportAsync` nie działa → wzorzec zastępczy), `competitive-benchmarking` (3–5 kart z niszy, delta-lista jako PLIK, bramka ≤1 h).

**Odrzucone (4 + 1 z bramki stałej):** `single-source-compiler`, `format-dictionary`, `numeric-gates`, `machine-narrows-human-picks` (z hipotezą `mech:direction-shortlist`), `seo-aeo-foundation` (nie dotyczy — brak artefaktu webowego).

**Workflow:** G0 inwentarz/kanon → G0b bloker logo jako bramka blokująca → G1 benchmark → G2 destylat → v2 → G3 cel QR → G4 weryfikacja finału → G5 preflight druku → G6 pomiar.

**Ryzyka:** R1 logo-stopper, R2 QR z martwym celem do druku, R3 druga odsłona znów odpada na gust, R4 ciche podstawienie fontu, R5 zero pomiaru, R6 destylat umiera w sesji.

---

## Przebieg B — co się faktycznie stało

1. **Jedna sesja, w całości programowo przez Figma plugin API.** Nie ręczne projektowanie, nie HTML. Skryptem powstały: mesh-gradient z 5 rozmytych plam radialnych (coral/lilac/aqua/mint/butter, `LAYER_BLUR ~100`), `createStar` (5 gwiazdek), corner ticks, redakcyjny grid z marginesem 58 px, QR jako biały „chip" (rounded tile + `DROP_SHADOW`) z **deterministycznym** wzorem modułów `(i*j+i*5+j*3)%4` i 3 finder patterns — jawnie bez `Math.random`.
2. **Powstały DWIE osobne dwustronne karty 90×50 mm** — jedna cała PL, jedna cała EN (nodes `31:2`, `32:2`, `33:2`, `34:2` w pliku `RsWI1Lgnndsm2KhegZ9gWw`), nie jedna karta dwujęzyczna.
3. **Anatomia stron:** awers = HERO (pełny gradient, wordmark LUMO top-left, 5 gwiazdek + mono „OPINIA W GOOGLE" top-right, nagłówek Hanken ExtraBold ~52 po lewej, **QR-chip**, mono microcopy). Rewers = „cisza" (ciepły papier `#FBF6E6`, tekst lewostronny, mono-etykiety, linia na wpisanie imienia, „Zespół Lumo / The Lumo Team", opalizujący stempel).
4. **Ekstrakcja z brand boardu wykonana w pełni:** hexy palety (Ink `#160F14`, kremy/mięty/brzoskwinie, teal `#3790A0`, terakota, koral, neon-zieleń), mapa substytutów fontów **TT Commons → Hanken Grotesk**, **.SF NS Mono → Space Mono**.
5. **Odkryty constraint typograficzny:** Space Mono nie ma polskich diakrytyków → reguła „mono tylko dla linii angielskich, polskie w Hanken Grotesk". Nie było jej w żadnej karcie.
6. **`exportAsync` — obejście, nie naprawa.** Zapisany GOTCHA („no visible layers") + wzorzec zastępczy „poprosić Reszka o ręczny eksport SVG/PNG". **Logo nigdy nie trafiło do projektu.**
7. **Akcept w JEDNEJ iteracji:** „przeprojektowane jak najlepsi i to jest kierunek do trzymania". Zero śladu benchmarku niszy. Akceptantem w źródłach jest Reszek (własny standard), nie właściciel Lumo — akcept klienta nieudokumentowany.
8. **Stan końcowy (karta, 08.08.2026, `archived`):** „do dokończenia: realny link do opinii Google (prawdziwy QR) i logo SVG od Reszka". **Karta nie została wydrukowana.** QR w plikach jest ozdobnym placeholderem wyglądającym jak działający kod.
9. **Zero pomiaru** (żadnego baseline opinii Google). **Zero destylatu w repo** — cała wiedza żyje w pliku auto-pamięci.

---

## Predykcje SYGNAŁ — rozstrzygnięcia

Reguła: HIT tylko przy zgodności z **całym** claimem. Predykcje o nieziszczeniu się zdarzenia (niskie p) rozliczam jako *correct-negative* (kalibracja), nie jako HIT.

| id | p | werdykt | uzasadnienie |
|---|---|---|---|
| bt:lumo-brand-01 | 0.78 | **PARTIAL** | QR-chip faktycznie jest głównym elementem konwersyjnym awersu (+ mono „OPINIA W GOOGLE", 5 gwiazdek). Ale człon „prowadzący do opinii Google" jest **fałszywy**: to wzór `(i*j+i*5+j*3)%4`, nie kod celujący gdziekolwiek. Nie istnieje też „finalny artefakt" — nic nie poszło do druku. Dodatkowo claim jest niemal wynikaniem z briefu (brief mówi „karta ma skłaniać do opinii Google") — najwyższe p w raporcie postawione na zdaniu o najmniejszej mocy rozstrzygającej. |
| bt:lumo-brand-02 | 0.72 | **PARTIAL** (HIT na klasie, MISS na domknięciu) | Trafiona ścieżka: obejście, nie forsowanie API — dokładnie jak w `archicom`/`betterguide`. Ale claim mówi wprost „logo **trafi do projektu** jako plik dostarczony ręcznie" — nie trafiło. Na 08.08 wciąż „logo SVG od Reszka". Router założył, że obejście się domknie; rzeczywistość pokazała, że obejście przez człowieka to nie rozwiązanie, tylko **niedomknięte wejście zewnętrzne**. To najbardziej pouczające pudło raportu. |
| bt:lumo-brand-03 | 0.62 | **HIT precyzyjny** | Oba człony trafione osobno: tło niepłaskie (mesh-gradient z 5 plam + LAYER_BLUR) ORAZ koniec centrowania (grid 58 px, nagłówek i tekst lewostronne, corner ticks). Predykcja rozstrzygalna, falsyfikowalna, trafiona w całości. |
| bt:lumo-brand-04 | 0.60 | **PARTIAL** | Dwustronność: TAK, z nadmiarem (2 karty × 2 strony × 2 języki). Ale **anatomia stron odwrotna do claimu**: QR i wezwanie do opinii siedzą na tej samej stronie co nośnik marki (hero), a podziękowanie/warstwa osobista poszła na rewers. Rozumowanie Routera („premium chce powietrza, CTA chce miejsca → rozdzielić na rewers") zostało rozwiązane inaczej: konflikt zdjęto skalą i gradientem, nie separacją stron. |
| bt:lumo-brand-05 | 0.55 | **HIT literalny / MISS pojęciowy** | Literalnie prawda: Figma tak, pipeline HTML+CSS→headless→pliki produkcyjne nie. Ale uzasadnienie („artefakt powstanie **natywnie** w narzędziu wizualnym", „setup parametryczny dla jednej karty się nie zwraca") jest sfalsyfikowane: cała estetyka powstała **skryptem**. Router trafił odpowiedź z błędnego modelu — a to gorsze niż pudło, bo daje karcie fałszywe potwierdzenie. |
| bt:lumo-brand-06 | 0.30 | **correct-negative** | Weryfikacji programowej nie było. Kalibracja dobra, ale z podstępnym powodem: nie było czego weryfikować — nie istniał realny kod. Router przewidział brak weryfikacji z powodu „braku rury", a faktyczną przyczyną był brak celu QR. |
| bt:lumo-brand-07 | 0.25 | **correct-negative, podwójny** | Benchmark nie powstał (zero śladu w bardzo szczegółowej pamięci sesji) — zgodnie z p. ALE nie wystąpił też **koszt** jego braku: v2 przeszła w 1 iteracji. Router poprawnie przewidział nieużycie i jednocześnie uczynił z niego **obowiązkową bramkę G1** — o czym niżej. |
| bt:lumo-brand-08 | 0.20 | **correct-negative z niuansem** | Destylatu w repo/bibliotece nie ma. Ale binarny podział claimu („repo vs notatka/pamięć") gubi stan faktyczny: destylat żyje w **trwałym pliku auto-pamięci**, przetrwał projekt i jest jedynym powodem, dla którego ten backtest jest w ogóle wykonalny. Genome nie modeluje tego stanu pośredniego. |
| bt:lumo-brand-09 | 0.15 | **correct-negative** | Żadnego baseline opinii Google. Zgodnie z p i z brakiem precedensu w korpusie. |
| bt:lumo-brand-10 | **0.30** | **HIT — niedoszacowany** | Drugi bloker klasy „limit narzędzia mylony z błędem własnym" wystąpił dokładnie tam, gdzie Router wskazał palcem (fonty): TT Commons komercyjny/niedostępny w Figmie webowej, `.SF NS Mono` systemowy → wymuszona mapa substytutów. Plus **trzeci**, nieznany żadnej karcie: brak polskich diakrytyków w Space Mono → reguła rozdziału językowego. Jedyna predykcja niosąca realną informację — i wyceniona najniżej z trafionych. |

**Bilans SYGNAŁ:** 2 HIT czyste (bt-03, bt-10) · 1 HIT literalny z obalonym uzasadnieniem (bt-05) · 3 PARTIAL (bt-01, bt-02, bt-04) · 4 correct-negative (bt-06…09) · 0 pudeł twardych.

**Ustalenie kalibracyjne (ważniejsze od bilansu):** predykcje z najwyższym p (0.78 i 0.72) są **najsłabsze** — obie mają obalony człon i obie są parafrazą pakietu T0 (brief mówi „QR do opinii"; T0 mówi „`exportAsync` pada"). Predykcja o realnej wartości informacyjnej (bt-10, nowa klasa blokera) dostała p=0.30. Router jest dobrze skalibrowany na „to się nie wydarzy" i źle na „co powstanie" — przepłaca za pewniki wynikające z briefu.

---

## Fit mechanizmów

**`mech:working-artifact-extraction` — FULL HIT.** Cała praca stanęła na destylacie z brand boardu: hexy, mapa substytutów, ton. Pochodna przeszła akcept w 1 iteracji, zero uwag do tokenów marki — wprost `expected_outcome` karty. **Zastrzeżenie falsyfikacyjne:** warunek wykonawczy postawiony przez Router („rozstrzygnąć KTÓRY artefakt jest kanoniczny — brand board vs realny lokal") okazał się **kosztem bez wartości**. Brand board był świeży, zrobiony w tym samym domu i wystarczył; rozjazd tokeny-vs-rzeczywistość z `archicom` nie przeniósł się. Klauzula ostrzegawcza karty odpala także tam, gdzie źródło formalne jest kanoniczne. DEDUPE: Lumo jest już w `ev:working-artifact-extraction-006` (skan 07.08) — backtest **nie dokłada** confidence (niezmiennik 10).

**`mech:negative-knowledge-ledger` — FULL HIT, potwierdzony dwukrotnie w jednej sesji.** `exportAsync` zapisany dokładnie jako para „nie działa bo X → zamiast tego Y (ręczny eksport)". Drugi wpis tej samej klasy powstał sam z siebie na warstwie fontów (mapa substytutów + reguła diakrytyków). Karta zadziałała jako przewidziana. Kaveat: oba wpisy wylądowały w notatce auto-pamięci, nie w NKL Genome — mechanizm zadziałał jako nawyk operatora, nie jako instytucja.

**`mech:storefront-qr-bridge` — PARTIAL, mechanizm nieuruchomiony.** Rdzeń trafiony (QR = serce artefaktu, chip z głębią, mono-microcopy, obietnica spójna). Ale całe „twarde rzemiosło" karty — dedykowany cel, korekcja H, weryfikacja moduł po module, spójność po skanie, pomiar — **nigdy nie zostało uruchomione**, bo projekt umarł piętro wyżej: na pozyskaniu URL-a. Bramki G3/G4 nie zablokowały niczego, bo nie doszło do momentu, w którym miały działać. **Błąd kolejności w karcie i w workflow:** Router dał `logo` bramkę blokującą w kroku 0 (G0b), a `realny link do opinii` dopiero w G3 — po projektowaniu. Oba są wejściami zewnętrznymi tej samej klasy, oba u klienta, oba zabiły projekt. Asymetria bez uzasadnienia.

**`mech:design-as-code` — WRONG BOUNDARY, obrót o 180°. Najostrzejsza falsyfikacja tego backtestu.** Router zrobił dwa ruchy i oba są odwrotne do rzeczywistości:
- *wykluczył* estetykę z kodu („pełny pipeline przeciwwskazany… jednorazowa kreacja estetyczna, anti-context karty") → rzeczywistość zbudowała **całą estetykę skryptem** (mesh z plam, `createStar`, deterministyczny wzór QR, grid 58 px) i zwróciło się to w jednej iteracji do akceptu;
- *przepisał* jedyny człon, który miał zostać („programowa weryfikacja QR na finalnym eksporcie") → ten człon **nie powstał wcale**.
Przyczyna błędu jest w karcie, nie w Routerze: `anti_context` i `Transfer` mówią „nie stosować do one-off kreacji wizerunkowej… setup parametryczny się nie zwróci", a `evidence` z `archicom-prezenter-reymonta` utrwaliło regułę „print/DTP → narzędzie wizualne". Karta myli **medium** (HTML + headless Chrome + repo) z **właściwością** (deterministyczna, reprodukowalna konstrukcja). Skrypt w Figma plugin API jest tym samym mechanizmem w innym medium i na one-offie się opłaca. Warunek sukcesu karty „rodzina artefaktów jest powtarzalna — jednorazowy artefakt nie zwraca kosztu setupu" ma tu kontrprzykład.

**`mech:competitive-benchmarking` — WRONG: rekomendowany, nieużyty, niepotrzebny.** Formalny benchmark nie powstał, delta-lista nie powstała, a **recydywa „ultra tanio" nie nastąpiła**. Wystarczył wyartykułowany standard wewnętrzny („jak najlepsi" + 5 zasad: jeden mocny element brandowy, grid zamiast centrowania, kontrast skali, QR z głębią, rzemieślnicze detale) + destylat brandu. To już **czwarty backtest z rzędu** z wzorcem „rekomendowany z twardą bramką → zero wykonania" (`r352-website`, `r352-case-studies-work`, `osada-orle-brand-system-figma`, teraz `lumo-brand`) — z tą różnicą, że tutaj po raz drugi (po `r352-case-studies-work` i `dimedical-redesign`) **nie wystąpił też koszt braku**. Do tego **niespójność metodologiczna Routera**: karta dostała status bramki obowiązkowej w G1, a jednocześnie predykcję p=0.25, że nie zostanie wykonana. Rekomendacja, w której nie wierzy się z p=0.75, nie jest rekomendacją — to rytuał.

**Mechanizmy użyte a nierekomendowane:** `mech:design-as-code` w trybie *scripted-canvas* — użyty w warstwie, z której Router go **jawnie wykluczył**. Poza tym brak.

**Odrzucone — weryfikacja:** wszystkie 4 odrzucenia utrzymane.
- `single-source-compiler`: 2 karty × 2 strony × 2 języki zbudowane jednym skryptem to zalążek logiki kompilatora, ale przy N=4 ramek i zerowym konsumencie po wdrożeniu odrzucenie było poprawne. Router przewidział też właściwą alternatywę (kopia + data-stamp).
- `format-dictionary`: poprawnie, wraz z jawnym sprawdzeniem zastrzeżenia z `geers-centrum-wiedzy` (czy wolumen nie leży po stronie klienta) — dobra higiena rozumowania.
- `numeric-gates`: poprawnie; realną bramką gustu okazał się jednorazowy akcept jakościowy.
- `machine-narrows-human-picks`: poprawnie — ale wyprowadzona z niego hipoteza `mech:direction-shortlist` dostaje **kontrdowód**: jeden mocny kierunek + wyartykułowany standard domknął sprawę w jednej rundzie, bez pokazywania N wariantów.
- `seo-aeo-foundation`: poprawnie wyłączony (brak artefaktu webowego).

**Fit:** 2/5 FULL (`working-artifact-extraction`, `negative-knowledge-ledger`) · 1/5 PARTIAL (`storefront-qr-bridge`) · 2/5 WRONG (`design-as-code` — zła granica; `competitive-benchmarking` — zbędny) · 1 użyty-a-wykluczony (`design-as-code` w trybie scripted-canvas). **Fit ≈ 50%.**

---

## Ryzyka — rozstrzygnięcia

- **R1 (bloker logo → stopper) — HIT precyzyjny.** To jest dosłownie stan końcowy projektu na 08.08. Router nazwał ryzyko i postawił właściwą bramkę (G0b), ale bramka nie zadziałała, bo jej wykonanie zależało od tej samej osoby, która była blokerem.
- **R2 (QR z martwym celem do druku) — NIEROZSTRZYGNIĘTE, ryzyko żywe.** Druk nie nastąpił, więc bramka nieprzetestowana. Ale placeholder **istnieje w plikach** i jest wizualnie nieodróżnialny od działającego kodu (finder patterns + deterministyczny wzór). Gdyby ktoś wysłał pliki do drukarni, ryzyko zmaterializowałoby się w 100% i bez ostrzeżenia.
- **R3 (druga wersja znów odpada na gust) — MISS.** Akcept w 1 iteracji, bez mitygacji, którą Router uznał za konieczną (delta-lista). Ryzyko przeszacowane; przeszacowanie wynikało z braku w Genome pojęcia „wyartykułowany standard wewnętrzny".
- **R4 (ciche podstawienie fontu) — HIT z odwróconym failure mode.** Warstwa trafiona (fonty ugryzły), ale nie przez **ciche** podstawienie — podstawienie było świadome i zapisane. Zamiast tego wyszedł problem, którego karta nie zna: substytut ma pełne pokrycie stylistyczne, a **niepełne pokrycie glifów** (brak ż/ę/ś w Space Mono). Cichym błędem byłoby to dopiero w druku.
- **R5 (zero pomiaru) — HIT.** Baseline nie zdjęty, odczyt nieumówiony. Most offline→online pozostał grafiką.
- **R6 (destylat umiera w sesji) — PARTIAL.** Nie umarł: żyje w trwałej auto-pamięci. Ale nie trafił do repo ani do Genome — stan pośredni, którego karta nie przewiduje.

---

## Raport 10 sekcji (CEO)

1. **Accuracy Routera.** SYGNAŁ: 2 HIT czyste + 1 HIT literalny + 3 PARTIAL + 4 correct-negative, 0 pudeł twardych. Ryzyka: 3 HIT (R1, R4, R5) / 1 MISS (R3) / 2 nierozstrzygnięte-lub-częściowe (R2, R6). Rezultat końcowy („prawie gotowe, wisi na dwóch wejściach klienta") przewidziany wprost i precyzyjnie — to najmocniejszy punkt raportu. **Najsłabszy punkt: struktura pewności.** Dwie predykcje o najwyższym p to parafrazy pakietu T0 i obie mają obalony człon; jedyna predykcja odkrywcza (bt-10) dostała p=0.30. Raport jest gęsty i dobrze uargumentowany, ale jego pewność siedzi tam, gdzie nie ma informacji.
2. **Accuracy Mechanism Selection ≈ 50%.** Nośne: `working-artifact-extraction`, `negative-knowledge-ledger`. Częściowy: `storefront-qr-bridge` (nieuruchomiony, nie obalony). Błędne: `design-as-code` (granica odwrotna o 180°), `competitive-benchmarking` (zbędny, trigger za szeroki). Odrzucenia: 4/4 poprawne.
3. **Największe błędy.**
   (a) **Granica `design-as-code` odwrócona o 180°** — Router wykluczył warstwę, która została zrobiona kodem, i przepisał człon, którego nie zrobiono. Wina karty: anti-context myli medium z właściwością.
   (b) **Pewniki z briefu sprzedane jako predykcje SYGNAŁ** — bt-01 (p=0.78) i bt-02 (p=0.72) nie były falsyfikowalnymi prognozami, tylko przepisaniem pakietu T0. Brak reguły: „jeśli claim wynika z briefu, to base-rate, nie sygnał".
   (c) **Rekomendacja, w którą Router nie wierzy** — `competitive-benchmarking` jako bramka obowiązkowa G1 przy równoczesnej predykcji p=0.25 na jej wykonanie. Brak reguły degradacji formy rekomendacji.
   (d) **Zła kolejność bramek wejść zewnętrznych** — logo dostało bramkę blokującą w kroku 0, realny link do opinii dopiero w G3 (po projekcie). Obie klasy identyczne, obie zabiły projekt; asymetria nieuzasadniona.
   (e) **Nadmiarowy transfer wzorca „tokeny formalne ≠ realny brand"** z `archicom` na świeży, własny brand board — krok „rozstrzygnij kanon" był kosztem bez wartości.
   (f) **Workflow modeluje ścieżkę szczęśliwą** — G5 (preflight) i G6 (pomiar) opisane szczegółowo, choć projekt nigdy nie dotarł do kroku 3. Router nie porządkuje bramek według prawdopodobieństwa dotarcia do nich.
4. **Największe sukcesy.**
   (a) bt-03 — predykcja dwuczłonowa, rozstrzygalna, trafiona w całości (niepłaskie tło + koniec centrowania).
   (b) bt-10 — nowa instancja klasy „limit narzędzia mylony z błędem własnym" wystąpiła dokładnie w warstwie wskazanej (fonty/eksport), a w dodatku przyniosła klasę nieznaną Genome.
   (c) R1 nazwane precyzyjnie razem ze ścieżką (ostatnia mila u klienta) — to jest stan terminalny projektu.
   (d) `negative-knowledge-ledger` potwierdzony dwukrotnie w jednej sesji, jako para „co nie działa + wzorzec zastępczy".
   (e) `working-artifact-extraction` — trzecie potwierdzenie `expected_outcome` (Archicom, FitStyle, Lumo): pochodna z destylatu przechodzi bez uwag do tokenów.
   (f) Wszystkie 4 odrzucenia trafione, z jawnym testem zastrzeżenia z `geers-centrum-wiedzy` — dojrzała higiena odrzuceń.
5. **Nowe mechanizmy (hipotezy).**
   - `mech:scripted-canvas` — deterministyczna konstrukcja estetyki skryptem w API narzędzia projektowego (Figma plugin) jako pełnoprawny tryb `design-as-code`; opłacalny na one-offie. Kandydat na **rozszerzenie karty**, nie nową kartę.
   - `mech:inputs-first-gate` — dla artefaktów konwersyjnych zależnych od wejść zewnętrznych (URL, ID, logo wektorowe): komplet wejść jest bramką **STARTU** produkcji, nie finalizacji. Kandydat na regułę workflow ROUTER.md.
   - `mech:internal-standard-as-benchmark` — wyartykułowany standard wewnętrzny (nazwane zasady + referencja jakościowa) zastępuje formalny benchmark niszy na mikro-artefaktach.
   - `guard:placeholder-marker` — każdy świadomy placeholder w pliku produkcyjnym dostaje jawny marker „NIE DRUKOWAĆ" w nazwie node'a/warstwy. Dobry placeholder jest nieodróżnialny od finału.
   - `guard:glyph-coverage-check` — substytut fontu przechodzi kontrolę pokrycia glifów dla języków projektu **przed** użyciem; luka pokrycia staje się regułą rozdziału językowego, nie błędem znalezionym w druku.
6. **Mechanizmy do usunięcia:** brak. `design-as-code` — do **przedefiniowania granicy** (medium ≠ właściwość). `competitive-benchmarking` — do **zawężenia triggera** (wymóg: brak wyartykułowanego standardu wewnętrznego), przy piątym kontrprzykładzie kandydat na degradację. `storefront-qr-bridge` — do **dopisania warunku wejściowego**.
7. **Confidence Changes — PROPOZYCJE (zapis wykonuje sesja główna).**
   - `mech:working-artifact-extraction`: **bez podbicia** — dedupe z `ev:working-artifact-extraction-006` (ten sam projekt, te same fakty, niezmiennik 10). Propozycja: dopisek do klauzuli kanonu („świeży brand board wykonany in-house = kanon; nie uruchamiać kroku rozstrzygania kanonu").
   - `mech:negative-knowledge-ledger`: **+1 evidence typu postmortem** (retro, wynik rzeczywisty) — wzorzec pary zadziałał dwukrotnie. Dopisek: para zapisana w auto-pamięci to nawyk operatora, nie instytucja — warunek instytucjonalizacji.
   - `mech:design-as-code`: **bez zmiany confidence**, flaga `wrong-boundary` + evidence postmortem; wpis kontrprzykładu do `Warunki sukcesu` („jednorazowy artefakt nie zwraca kosztu setupu" — obalone dla trybu scripted-canvas).
   - `mech:competitive-benchmarking`: **bez zmiany confidence**, flaga `too-broad` + drugie evidence kontrprzykładu (rekomendacja + brak wykonania + brak kosztu). Rekomendacja: przy kolejnym kontrprzykładzie **obniżyć**.
   - `mech:storefront-qr-bridge`: **bez zmiany confidence** (mechanizm nieuruchomiony — nie ma czego potwierdzać ani obalać); propozycja nowego `failure_condition`: „wejścia zewnętrzne (realny URL celu, ID, logo wektorowe) pozyskane przed startem produkcji; bez nich artefakt nie wchodzi do projektowania" + zasada markowania placeholderów.
8. **Nowe hipotezy do testu.**
   - Granica opłacalności kodu = **deterministyczność konstrukcji**, nie wolumen artefaktów. Test: następny mikro-artefakt print budowany skryptem vs ręcznie, porównanie liczby iteracji do akceptu.
   - Standard wewnętrzny zakodowany w krótkim feedbacku zastępuje benchmark na artefaktach mikro. Test: następny mały artefakt brandowy po negatywnym feedbacku — czy nazwanie 5 zasad wystarcza.
   - Kontrdowód dla `mech:direction-shortlist` (hipoteza z T0): jeden mocny kierunek + nazwany standard zamknął sprawę w 1 rundzie; shortlist N kierunków byłby kosztem. Hipotezę utrzymać, ale zawęzić do przypadków **bez** wyartykułowanego standardu.
   - Auto-pamięć jako de facto rejestr artefaktów — stan pośredni między sesją a repo, którego Genome nie modeluje. Czy to wystarczające miejsce dla destylatów mikroklientów bez repo?
9. **Czego Genome nie wiedział w T0.**
   - Że wykonanie pójdzie przez **Figma plugin API jako scripting**, nie przez ręczne projektowanie ani HTML — cała warstwa mechanizmowa Routera zakładała binarne „narzędzie wizualne vs kod".
   - Że PL/EN rozdzieli się na **dwie pełne dwustronne karty**, a nie jedną dwujęzyczną.
   - Że substytut fontu może mieć pełne pokrycie stylistyczne i **niepełne pokrycie glifów** (Space Mono bez polskich diakrytyków) → reguła rozdziału językowego.
   - Że **QR-placeholder zostanie świadomie zbudowany tak, by wyglądał jak działający kod** — co czyni ryzyko R2 podstępniejszym niż opisane.
   - Że akcept przyjdzie w **jednej iteracji bez benchmarku**, a rolę standardu niszy przejmie krótki, nazwany standard wewnętrzny.
   - Że akceptantem w śladzie źródłowym jest **Reszek, nie właściciel Lumo** — akcept klienta i wynik biznesowy pozostają nieudokumentowane.
   - Że projekt nie zostawi **żadnego kodu ani repozytorium** — jedynym nośnikiem wiedzy jest plik auto-pamięci.
10. **Jak następny projekt będzie lepszy.**
    - Artefakt konwersyjny zależny od wejść zewnętrznych → **checklist wejść jako bramka startu**, nie finalizacji; wszystkie wejścia tej klasy traktowane symetrycznie (link = logo = ID).
    - Mikro-artefakt po negatywnym feedbacku → najpierw pytanie „czy istnieje wyartykułowany standard wewnętrzny?"; benchmark tylko przy odpowiedzi NIE.
    - Estetykę wolno (i często warto) budować skryptem — kryterium to deterministyczność konstrukcji, nie liczba artefaktów.
    - Każdy świadomy placeholder w pliku produkcyjnym dostaje marker „NIE DRUKOWAĆ" w nazwie node'a.
    - Substytut fontu przechodzi kontrolę pokrycia glifów dla wszystkich języków projektu przed pierwszym użyciem.
    - Reguła dla Routera: **jeśli claim wynika z briefu — to base-rate, nie SYGNAŁ**; jeśli przewidujesz nieużycie rekomendacji z p ≥ 0.6 — zdegraduj jej formę (checklist zamiast bramki) albo jej nie rekomenduj.

---

## Evidence (do zapisania w kartach + Ledger przez sesję główną)

- **E1** {observation: cała estetyka (mesh-gradient z 5 rozmytych plam, `createStar`, corner ticks, grid 58 px, deterministyczny wzór QR `(i*j+i*5+j*3)%4`) zbudowana programowo w Figma plugin API — wbrew zawężeniu Routera „estetyka NIE w kodzie" i wbrew `anti_context` karty; jednocześnie jedyny człon przepisany przez Router (programowa weryfikacja QR na finalnym eksporcie) nie powstał wcale; proof: memory/lumo-brand.md, sesja ~20.07.2026 (spec konstrukcji per node) + proj:lumo-brand 2026-08-08; impact: karta myli medium (HTML+headless+repo) z właściwością (deterministyczna, reprodukowalna konstrukcja) — Router odrzuca mechanizm tam, gdzie działa, i przepisuje tam, gdzie nie dojdzie do wykonania; proposed_change: dopisać tryb `scripted-canvas` (plugin API narzędzia projektowego = design-as-code) i skorygować `Warunki sukcesu`: jednorazowy artefakt ZWRACA koszt setupu, gdy konstrukcja jest deterministyczna; confidence_effect: bez zmiany + flaga wrong-boundary, evidence typu postmortem; mechanisms: [mech:design-as-code]}

- **E2** {observation: rekomendowany jako bramka obowiązkowa benchmark 3–5 kart z niszy nie powstał, delta-lista nie powstała, a przewidziany koszt braku (recydywa „ultra tanio") NIE wystąpił — v2 zaakceptowana w jednej iteracji na podstawie standardu wewnętrznego „jak najlepsi" + 5 nazwanych zasad; dodatkowo Router rekomendował kartę, przewidując jednocześnie jej niewykonanie z p=0.75 (bt-07 p=0.25); proof: memory/lumo-brand.md ~20.07.2026 (zero śladu benchmarku w zapisie o wysokiej ziarnistości; „przeprojektowane jak najlepsi i to jest kierunek do trzymania"); impact: czwarty z rzędu backtest z wzorcem „rekomendowany z twardą bramką → zero wykonania" i drugi bez kosztu braku; trigger karty odpala przy każdym negatywnym feedbacku jakościowym; proposed_change: zawęzić trigger o warunek „nie istnieje wyartykułowany standard wewnętrzny (nazwane zasady + referencja jakościowa)"; do ROUTER.md reguła: predykcja niewykonania ≥0.6 degraduje formę rekomendacji; confidence_effect: bez zmiany + flaga too-broad; przy piątym kontrprzykładzie obniżyć; mechanisms: [mech:competitive-benchmarking]}

- **E3** {observation: projekt zatrzymał się na dwóch wejściach zewnętrznych tej samej klasy (realny URL formularza opinii Google, logo w wektorze) — całe twarde rzemiosło karty (dedykowany cel, korekcja H, weryfikacja moduł po module, pomiar) nigdy nie zostało uruchomione, a w plikach pozostał QR-placeholder z finder patterns, wizualnie nieodróżnialny od działającego kodu; Router dał bramkę blokującą tylko jednemu z dwóch wejść (logo — G0b), drugie umieścił po projektowaniu (G3); proof: proj:lumo-brand „do dokończenia: realny link do opinii Google (prawdziwy QR) i logo SVG od Reszka", status archived, 2026-08-08; memory/lumo-brand.md (opis wzoru modułów); impact: bloker leży PRZED bramką karty — mechanizm niesprawdzalny, a ryzyko druku martwego kodu pozostaje żywe; proposed_change: `failure_condition` „wejścia zewnętrzne (realny URL celu, ID, logo wektorowe) pozyskane jako bramka STARTU produkcji — bez kompletu wejść artefakt nie wchodzi do projektowania" + zasada markowania placeholderów „NIE DRUKOWAĆ" w nazwie node'a; confidence_effect: bez zmiany (mechanizm nieuruchomiony); mechanisms: [mech:storefront-qr-bridge, mech:design-as-code]}

- **E4** {observation: limit narzędzia zapisany jako para „nie działa bo X → zamiast tego Y" zadziałał dwukrotnie w jednej sesji: `exportAsync` („Failed to export node… no visible layers") → ręczny eksport SVG/PNG przez człowieka; TT Commons niedostępny w Figmie webowej i `.SF NS Mono` systemowy → jawna mapa substytutów (Hanken Grotesk / Space Mono); przy czym obejście przez człowieka NIE domknęło się — logo nigdy nie trafiło do projektu; proof: memory/lumo-brand.md GOTCHA + sekcja Typografia, ~20.07.2026; proj:lumo-brand 2026-08-08; impact: wzorzec karty potwierdzony, ale ujawnia rozróżnienie: obejście programowe domyka się, obejście delegowane człowiekowi staje się niedomkniętym wejściem zewnętrznym; oba wpisy żyją w auto-pamięci, nie w NKL Genome; proposed_change: dopisać typ wpisu „obejście delegowane" z wymogiem właściciela i terminu; warunek instytucjonalizacji (para w Genome, nie w notatce); confidence_effect: +1 evidence typu postmortem (retro, wynik rzeczywisty); mechanisms: [mech:negative-knowledge-ledger]}

- **E5** {observation: substytut fontu (Space Mono za `.SF NS Mono`) ma pełne pokrycie stylistyczne i NIEPEŁNE pokrycie glifów — brak polskich diakrytyków wymusił regułę projektową „mono wyłącznie dla linii angielskich, polskie teksty w Hanken Grotesk"; klasa nieobecna w jakiejkolwiek karcie Genome (karty znają ciche podstawienie fontu, nie lukę pokrycia); proof: memory/lumo-brand.md ~20.07.2026 („Mono (Space Mono) tylko dla angielskich linii — brak polskich znaków"); impact: na artefakcie drukowanym luka glifów ujawnia się dopiero w nakładzie; ryzyko R4 Routera opisywało odwrotny failure mode (ciche podstawienie), więc jego mitygacja by tego nie złapała; proposed_change: `guard:glyph-coverage-check` — kontrola pokrycia glifów substytutu dla wszystkich języków projektu przed pierwszym użyciem; wpis do `Warunki porażki` w design-as-code obok istniejącego „fonty niedostępne w środowisku renderu"; confidence_effect: n/d (nowa klasa, kandydat na guard); mechanisms: [mech:design-as-code, mech:negative-knowledge-ledger]}

- **E6** {observation: ekstrakcja z formalnego brand boardu okazała się w pełni wystarczająca — pochodna przeszła akcept w jednej iteracji bez ani jednej uwagi do tokenów marki; rozjazd „tokeny formalne ≠ realny brand" (wzorzec z archicom) NIE wystąpił, a wymuszony przez Router krok „rozstrzygnij, który artefakt jest kanoniczny (brand board vs realny lokal)" był kosztem bez wartości; proof: memory/lumo-brand.md ~20.07.2026 (pełne hexy + mapa fontów wprost z brand boardu, feedback „jak najlepsi"); impact: klauzula ostrzegawcza karty odpala także tam, gdzie źródło formalne jest kanoniczne (świeży brand board wykonany in-house); proposed_change: dopisek do karty — kryterium kanonu: świeżość + autorstwo źródła formalnego; krok rozstrzygania kanonu uruchamiać tylko przy źródle odziedziczonym lub starszym niż bieżąca tożsamość marki; confidence_effect: BEZ podbicia — dedupe z ev:working-artifact-extraction-006 (skan CKO 07.08.2026, ten sam projekt, niezmiennik 10); mechanisms: [mech:working-artifact-extraction]}
