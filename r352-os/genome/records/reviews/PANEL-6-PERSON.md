---
id: "rec:reviews/PANEL-6-PERSON"
type: "record"
title: "Panel 6 person"
status: "created"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "session"
relations: {}
tags: ["legacy-import"]
---

# Panel 6 person — niezależne krytyki Genome OS

**Data:** 08.08.2026 · Persony: CTO Palantira, Head of Product Cursor, badacz Anthropic, projektant Linear, partner a16z, twórca Obsidiana. Każda oceniała na świeżo (bez dostępu do audytu Cognitive OS). Synteza: ROADMAP-10LAT.md

---

### CTO Palantira

**Krytyki:**

1. **System łamie własny Aksjomat 5 („Prawda ma jedno źródło") na poziomie danych.** Ta sama wiedza żyje równolegle w co najmniej pięciu reprezentacjach: karty `mechanisms/*.md`, ręcznie utrzymywany `INDEX.md`, `genomeos-data.js`, `knowledge-graph.json` i `FOTRA/js/fotra-kg-data.js`. I już dryfuje: brief mówi „12 proven", INDEX mówi „proven: 16". README deklaruje karty `disproven` (gated content), a w `mechanisms/` nie ma ani jednej takiej karty i skala confidence w README jej nie zawiera. To dokładnie klasa błędu, którą Single-Source Compiler ma eliminować u klientów — u siebie jest „dyscypliną sesyjną", co karta SSC sama nazywa warunkiem porażki.
2. **Brak schematu = brak przyszłości modelu danych.** Karty są free-text markdown bez maszynowego schematu, walidatora ani migracji. Przy 22 kartach Claude jako parser wystarcza; przy 200 kartach po 10 latach ewolucji pól (już teraz ROUTER odwołuje się do `failure_conditions`, którego karta nie ma jako pola — ma prozę „Warunki porażki") każdy konsument (Router, graf, viewer) parsuje po swojemu i cicho gubi dane. Nie ma nawet skryptu `--check` spinającego INDEX z kartami — mechanizm, który firma sprzedaje.
3. **Gdzie system skłamie użytkownikowi: w Evidence.** „Dowody" to jednodniowa destylacja (wszystkie karty: v1 · 2026-08-07) wykonana przez AI z opisów projektów, nie z pomiarów — a viewer renderuje `proven ✓ sprawdzony` z tą samą typograficzną pewnością co przyszłe, prawdziwie zwalidowane wpisy. Przy 10× skali wiedzy nikt nie odróżni dowodu-z-pomiaru od dowodu-z-narracji, bo Evidence nie ma prowieniencji (kto/co/kiedy/na jakiej podstawie dopisał wpis).

**Zmiany 10-letnie:**

1. **Karty jako dane z jawnym schematem (YAML frontmatter + walidator w CI), wszystkie widoki — INDEX, graf, `GENOMEOS_DATA` — kompilowane jednym generatorem.** Defensywność: struktura danych z wersjonowanym schematem przeżyje każdą wymianę interfejsu i modelu AI, a rozjazd „12 vs 16" stanie się strukturalnie niemożliwy — to własny mechanizm firmy zastosowany do siebie, więc jednocześnie demo sprzedażowe.
2. **Prowieniencja jako obywatel pierwszej klasy: każdy wpis Evidence i każda zmiana confidence to osobny, niemutowalny rekord (data, źródło, typ dowodu: pomiar/postmortem/skan-narracyjny, link).** Defensywność: korpus decyzji z prowieniencją to jedyny zasób, którego — jak głosi Aksjomat 8 — nikt nie skopiuje; bez prowieniencji za 10 lat będzie to korpus opinii.
3. **Rozdzielenie ontologii od instancji: typy (Principle, Mechanism, Project, Client, Lesson, Decision) zdefiniowane osobno od danych, z regułami krawędzi.** Defensywność: dziś graf to ~100 węzłów rysowanych na canvasie; ontologia z jawnymi typami relacji pozwoli za 10 lat zadawać pytania („które mechanizmy zawiodły u klientów typu X po zmianie Y") zamiast tylko oglądać kulki.

### Head of Product Cursor

**Krytyki:**

1. **Ten produkt nie ma tab-completion — nie ma żadnej czynności powtarzanej 50×/dzień.** Router odpala się per projekt (kilka razy w miesiącu), postmortem per zakończenie (rzadziej), Puls raz dziennie. Viewer jest read-only muzeum: `home.js` renderuje „Jedna rzecz teraz" i „Czeka na Ciebie", ale nie da się w nim nic odhaczyć, odrzucić ani zdecydować — każda interakcja wymaga otwarcia sesji Claude obok. Pętla nawyku nie istnieje; istnieje pętla ceremonii.
2. **Moment magii jest schowany za dyscypliną, nie przed nią.** Wartość („Genome pamięta, że to już robiliśmy i wie, co nie działa") ujawnia się dopiero PO rzetelnym postmortemie, którego jeszcze nigdy nie było (Δ confidence z projektów = 0, sam scoreboard przyznaje: dyscyplina wysyłki 2100/10000). Produkt, który wymaga cnoty zanim da nagrodę, przegrywa ze starym workflow — a starym workflow jest tu „po prostu zacznij robić projekt w Claude", który jest o jedno polecenie bliżej.
3. **Jednoosobowy user-base maskuje brak przymusu.** Nic nie egzekwuje reguły „żaden projekt nie zaczyna się bez raportu routera" — to postanowienie noworoczne zapisane w markdown. W Cursorze użytkownik nie może „zapomnieć" o autocomplete, bo ono samo przychodzi; tu Router trzeba sobie zadać. Pierwszy tydzień presji klienckiej zabije rytuał i Genome zacznie gnić dokładnie tak, jak gniją firmowe wiki.

**Zmiany 10-letnie:**

1. **Odwrócić kierunek: Genome ma sam wtrącać się do pracy (hook w sesji Claude, który przy każdym nowym briefie/pliku automatycznie podsuwa 2-3 pasujące mechanizmy i anti-contexty, zanim użytkownik poprosi).** Defensywność: nawyk zbudowany na przerwaniu-z-wartością (jak autocomplete) jest nie do porzucenia, a dystrybucja „w miejscu pracy" nie zależy od siły woli founders — to jedyna rzecz, która utrzyma system żywy przez dekadę.
2. **Domknąć pętlę decyzji w panelu: „Czeka na Ciebie" musi przyjmować decyzję (akcept/odrzut/powód) i zapisywać ją jako zdarzenie, które sesje AI konsumują.** Defensywność: strumień mikrodecyzji właściciela to zarazem engagement loop i korpus treningowy — po 10 latach to on, nie karty, będzie najcenniejszym aktywem (INDEX sam nazywa ten brak: „Validation Feedback Loop nie istnieje").
3. **Postmortem-zero-friction: automatyczny szkic postmortemu generowany z historii sesji/commitów projektu, człowiek tylko poprawia i zatwierdza.** Defensywność: system, którego metryka życia (Δ confidence) zależy od najcięższego rytuału, umrze; system, w którym rytuał kosztuje 5 minut zatwierdzenia, kompounduje niezależnie od motywacji właściciela.

### Badacz z Anthropic

**Krytyki:**

1. **Confidence „proven" jest tu miarą częstości narracji, nie skalibrowanym przekonaniem.** Wszystkie 22 karty wydestylował jeden przebieg AI jednego dnia (v1 · 2026-08-07) z opisów projektów, które w dużej mierze pisało to samo AI — „proven ≥3 konteksty" liczy więc korelacje wewnątrz jednego, autokorelacyjnego korpusu jednej firmy. To nie jest kalibracja, to samopotwierdzenie: brak choćby definicji, co byłoby obserwacją falsyfikującą „proven", brak held-out testu (ironicznie, karta numeric-gates sama diagnozuje: „próg na niezwalidowanej skali daje fałszywą pewność" — i cały Genome jest dokładnie tym).
2. **System nie odróżnia „poprawia decyzje" od „racjonalizuje decyzje" i nie ma jak tego zmierzyć.** Router produkuje przekonujący 8-sekcyjny raport z dowodami — ale nie ma baseline'u (co wybrałby Reszek bez Routera?), nie ma pre-rejestracji rekomendacji przed poznaniem preferencji właściciela, nie ma trackingu „Router polecił X, poszliśmy w X, wynik Y". LLM jest znakomity w generowaniu spójnych uzasadnień dla dowolnej konkluzji; bez ślepej próby „zewnętrzna kora przedczołowa" może być zewnętrznym generatorem pewności siebie — szczególnie groźnym dla użytkownika, który (jak sam system wie) walczy z deficytem wiary we własne decyzje.
3. **Halucynacja pewności jest wbudowana w rendering.** `ui.js` mapuje confidence na pigułkę „✓ sprawdzony" bez żadnej reprezentacji niepewności źródła, wieku dowodu ani tego, że licznik `confidence_changes_from_projects` wynosi 0 — czyli że ŻADNA karta nie przeszła jeszcze testu własnej pętli uczenia. Evidence w kartach zawiera precyzyjnie brzmiące liczby („845/1000 w 1 iteracji", „~10× kompresja czasu") bez rozróżnienia zmierzone/oszacowane/wygenerowane — dokładnie format, w którym LLM-owe konfabulacje są najtrudniejsze do wykrycia po latach.

**Zmiany 10-letnie:**

1. **Prospektywny rejestr predykcji: każda rekomendacja Routera i każdy eksperyment zapisuje z góry falsyfikowalną predykcję z liczbą (metryka, próg, termin), a postmortem MUSI ją rozliczyć — Brier score systemu jako metryka nadrzędna obok Δ confidence.** Defensywność: 10-letni track record skalibrowanych, rozliczonych predykcji jest niepodrabialny i nieodtwarzalny przez konkurencję z lepszym modelem — kalibracja to własność korpusu, nie promptu.
2. **Dwupoziomowy confidence: oddzielić „siłę dowodu" (n kontekstów, typ: pomiar vs narracja, wiek) od „rekomendacji użycia", z automatycznym decay — dowód niepotwierdzony przez N miesięcy degraduje się sam.** Defensywność: mechanizm epistemicznej pokory wbudowany w strukturę danych chroni system przed jego największym długoterminowym ryzykiem — cichym gniciem etykiet „proven" — niezależnie od dyscypliny człowieka i zmian modeli.
3. **Adversarial loop jako stały element: każdy raport Routera przechodzi przez niezależną sesję-krytyka z zadaniem „obal te rekomendacje / wskaż, czego ten raport chce, żebyś nie zauważył", a rozbieżności trafiają do raportu.** Defensywność: strukturalna separacja generatora od krytyka to jedyna znana obrona przed racjonalizacją, która skaluje się wraz z modelami — im mocniejsze LLM-y, tym bardziej przekonujące błędy i tym cenniejszy wbudowany przeciwnik.

---

### Projektant Linear

**Krytyki:**
1. **Ten produkt nie ma jednostki pracy.** W Linear jednostką jest issue — wszystko na nim wisi. Tu jednostką powinna być *decyzja* (przebieg Routera → akcept → postmortem → zmiana confidence), ale system jej nie modeluje: raporty routera to markdown „archiwizowany", postmortemy to pliki w folderze, a zmiana confidence to ręczny edit karty. Viewer (genome.js) renderuje piękne karty, ale przycisk „Uruchom w Routerze" to `navigator.clipboard.writeText` z komendą do wklejenia gdzie indziej. Produkt, w którym akcja podstawowa to kopiuj-wklej do innego narzędzia, nie jest narzędziem — jest broszurą o narzędziu.
2. **System sugeruje dyscyplinę, zamiast ją wymuszać — i sam to przyznaje.** Karta numeric-gates mówi wprost: „bramka F2 wciąż ręczna", „re-oceny zależą od pamięci Przemka", „u klientów CI blokujące, u siebie dyscyplina sesyjna". Reguła „raport routera POWSTAJE PRZED pierwszą linią projektu" nie ma żadnego enforcementu — nic nie blokuje startu projektu bez raportu. Scoreboard 6650/10000 z „dyscypliną wysyłki 2100" to nie diagnoza, to akt oskarżenia: zbudowano system o wymuszaniu bramek, który sam nie ma ani jednej działającej bramki na sobie.
3. **8 ekranów dla produktu, którego codzienny użytek to 2.** Pulse, Genome, Router, Graf, Eksperymenty, Projekty, Klienci, CTO — dla jednego użytkownika. Graf ~100 węzłów/380 krawędzi na canvasie z force layout to demo, nie narzędzie: nikt nie wraca codziennie do force-directed grafu. Codzienna pętla to: „mam brief → które mechanizmy" i „skończyłem → co wpisać". Reszta to muzeum.

**Zmiany 10-letnie:**
1. **Decyzja jako first-class obiekt z cyklem życia** (brief → raport → akcept → egzekucja → postmortem → delta confidence), z twardym stanem, nie folderem plików. *Defensywność: struktura danych przeżywa każdą zmianę UI i modelu AI — a 10 lat logów decyzji z domkniętym cyklem to korpus nie do odtworzenia.*
2. **Zamienić reguły-prośby na guardy wykonywalne:** pre-commit/CI, który blokuje start projektu bez raportu routera i zamknięcie bez postmortemu — mechanizm incident-to-guard zastosowany do samego OS-a. *Defensywność: dyscyplina zapisana w maszynie nie eroduje z motywacją właściciela — a to erozja, nie konkurencja, jest głównym zabójcą tego systemu.*
3. **Wyciąć wszystko poza pętlą dzienną:** zostawić Router-inbox i Genome, resztę zdegradować do raportów na żądanie. *Defensywność: narzędzie, w którym się żyje codziennie, akumuluje dane; narzędzie-dashboard odwiedzane raz w tygodniu umiera cicho — przewagą jest kadencja użycia, nie liczba ekranów.*

### Partner a16z

**Krytyki:**
1. **Koszt przebrany za aktywo: sama biblioteka 22 mechanizmów.** 16 z 22 „proven" w jeden dzień (wszystkie karty: „v1 · 2026-08-07, wydestylowany ze skanu"), z dowodami wyłącznie z własnych projektów jednego człowieka, ocenionymi przez to samo AI, które je destylowało. To nie evidence, to autozapłon. Prawdziwe aktywo — zmiany confidence z żywych projektów — ma dziś wartość dokładnie zero (własna metryka CTO: 0 postmortemów, pierwszy przebieg Routera na realnym kliencie „zaplanowany"). Sprzedaje się mapę kopalni, w której jeszcze nie kopnięto łopatą.
2. **Jednoosobowy rynek w kwadracie.** Jedyny użytkownik = autor. Jedyny walidator = autor. Klient dowodowy = Benefit, 49% przychodu i zarazem laboratorium metryk (ryzyko nazwane w KATEGORIA.md, niezmitygowane). Człowiek-wąskie-gardło, którego system ma eliminować u klientów („senior staje się bottleneckiem"), jest architektonicznie wbudowany w środek własnego systemu jako „Przemek-decyzja" w każdej karcie. To nie firma z systemem — to egzoszkielet jednej osoby; przy exicie wart tyle, co ta osoba w pakiecie.
3. **Kategoria „Creative Governance" nie ma kupca z linią budżetową — i dokument to wie, ale strategia tego nie rozwiązuje.** Ryzyka w KATEGORIA.md są znakomicie nazwane (edukacja > przychód o 2 kwartały = śmierć; solo-founder bez kadencji lightning strikes; Adobe/Figma spowszednią frazę w 12–18 mies.), po czym plan i tak zaczyna od nazewnictwa, manifestu i „Creative Governance Index" — czyli od najdroższej i najmniej defensywnej części (język), zamiast od jedynej defensywnej (dane przed/po z ~100 briefów/mies.). Dowód komercyjny: 900/10000, samoocena własna.

**Zmiany 10-letnie:**
1. **Odwrócić kolejność: najpierw 12 miesięcy instrumentowanych deltas u 2–3 klientów, kategoria potem.** Baseline→delta (czas brief→akcept, % first-pass, senior-godziny) zapisane umownie z prawem do anonimizowanej publikacji od dnia 1. *Defensywność: benchmark z realnych wolumenów klienckich jest niekopiowalny — Adobe może zabrać słowo „governance", nie może zabrać trzech lat cudzych danych procesowych.*
2. **Wyjąć jedno „Przemek-decyzja" z pętli i sprzedać to jako produkt** — alignment score jako endpoint, który klient odpala sam (self-serve wedge z briefsync), nie jako usługa z konsultantem w środku. *Defensywność: przychód niezwiązany z godzinami założyciela to jedyna droga, by system był wart więcej niż jego autor — i jedyny test, czy mechanizmy działają bez niego.*
3. **Kontraktowa dywersyfikacja dowodu przed publiczną obietnicą kategorii:** replika pilota poza fitnessem (Sonova/Archicom) jako bramka blokująca — żadnej publikacji „Creative Governance" zanim nie istnieją 2 niezależne case'y z metrykami. *Defensywność: kategoria oparta o jednego klienta umiera z jednym wypowiedzeniem; dwa niezależne dowody to minimalna struktura, której churn nie zeruje.*

### Twórca Obsidiana

**Krytyki:**
1. **Podwójna prawda w systemie, którego aksjomatem nr 5 jest „prawda ma jedno źródło".** Karty żyją w markdownie (`genome/mechanisms/`), ale viewer je czyta z `window.GENOMEOS_DATA` w `genomeos-data.js` — wygenerowanego „przez sesje Claude". To nie kompilator, to człowiek-w-pętli udający build: nie ma `build.js`, którego mogę odpalić za 10 lat; jest rytuał zależny od dostępności konkretnego LLM-a i konkretnych promptów. Gdy Claude zniknie albo zmieni zachowanie, dane w viewerze i markdown zaczną dryfować — dokładnie ta klasa błędu, którą Single-Source Compiler ma eliminować u klientów.
2. **Najcenniejsza warstwa nie jest plikiem.** Router, postmortem, destylacja, Puls — całe rozumowanie systemu żyje w komendach sesyjnych i promptach (`/mechanism-router`), nie w wersjonowanej, przenośnej specyfikacji. Markdown przetrwa 10 lat; „sesja Claude z pamięcią projektu i skillem w .claude/" nie przetrwa nawet zmiany dostawcy. System deklaruje „AI jako runtime" i „interfejsy wymienne", ale to runtime jest niewymienny — a wiedza o TYM, JAK system myśli, jest w nim uwięziona.
3. **Karty są prozą, nie danymi.** „Confidence: **proven**" to pogrubienie w akapicie, Evidence to bullety wolnego tekstu, Version to lista zdań. Za 10 lat nie napiszę skryptu, który policzy zmiany confidence w czasie, zbuduje graf z Related albo zwaliduje, że każdy mechanizm wskazuje Principle — bo nie ma frontmattera, schematu ani jednego pola maszynowego. Graf wiedzy żyje osobno w `knowledge-graph.json` i `fotra-kg-data.js` — trzecia i czwarta reprezentacja tych samych relacji. To jest baza wiedzy przebrana za system; sieć relacji istnieje tylko retorycznie.

**Zmiany 10-letnie:**
1. **YAML frontmatter na każdej karcie** (id, principle, confidence, evidence[], related[], version[] jako dane) + trywialny walidator schematu w CI; proza zostaje jako treść pod spodem. *Defensywność: plain text z jawnym schematem czyta każdy przyszły tool, LLM i grep — struktura w danych, nie w konwencji akapitów, jest jedyną gwarancją maszynowej czytelności w 2036.*
2. **Prawdziwy, głupi kompilator w repo** (~100 linii, jak sami każą klientom): markdown → `genomeos-data.js` + graf, deterministycznie, `node build.js`, bez AI w pętli buildu; AI pisze karty, nigdy artefakty pochodne. *Defensywność: system, którego odtworzenie wymaga tylko gita i node, przeżyje każdego dostawcę AI — system wymagający „sesji z odpowiednim promptem" jest wynajęty, nie posiadany.*
3. **Prompty routera i postmortemu jako wersjonowane pliki specyfikacji w repo, obok kart** — kontrakt wejście/wyjście zapisany tak, że wykona go dowolny model (albo człowiek z checklistą). *Defensywność: aksjomat 8 mówi, że przewagą jest korpus decyzji — ale korpus jest przewagą tylko wtedy, gdy procedura jego zasilania jest własnością w plikach, a nie zachowaniem cudzego modelu.*