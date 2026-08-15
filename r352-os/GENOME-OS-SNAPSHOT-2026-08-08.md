# r352 Genome OS — pełny snapshot

**Stan:** 8 sierpnia 2026, wieczór · eksport 1:1 ze źródeł Genome (`r352-os/genome/`) — tej samej prawdy, z której kompilowany jest viewer.

---

## ☀️ Pulse

**AZYMUT:** System buduje szybciej, niż wysyłasz. Produkcja przestała być wąskim gardłem — jest nim wysyłka: najcenniejsze artefakty firmy są gotowe i czekają wyłącznie na Twój klik, więc każda godzina włożona w „ship” bije każdą godzinę włożoną w „build”.

_Framework 7200/10000 bez pierwszej sprzedaży · demo ARToffNIA niewysłane · wtyczka Caterelo poza CWS (brakowały 2 zrzuty) · wegobold niewypuszczony · Camp Nou bez linku afiliacyjnego_

### Priorytety największej dźwigni

1. **Dowieźć prezenter Przystań Reymonta na poniedziałek 10.08 metodą 'szkielet najpierw, materiały na końcu': dziś zbudować kompletny prezenter 8 sekcji na tokenach archicom-brand z placeholderami na brakujące materiały (mapa, wizki, karty mieszkań) i równolegle wyegzekwować braki od klientki**
   Pierwszy krok: W godzinę: zinwentaryzować, co realnie jest lokalnie z transferów SwissTransfer (linki wygasają po ~30 dniach — pobrać wszystko natychmiast), i wysłać do Marty (wraca 8.08) precyzyjny mail: lista 3-4 brakujących materiałów, deadline dosyłki 'do piątku 17:00, inaczej wersja z placeholderami', plus przypomnienie o FV.

2. **Wykonać pierwszą rozmowę sprzedażową frameworku Brand Hub OS: ustalić cenę kotwiczną (decyzja, nie research) i wysłać case Mała Palarnia z konkretną ofertą do 1-3 najcieplejszych kontaktów**
   Pierwszy krok: W godzinę: wpisać jedną liczbę do PRODUKT.md (kotwica z widełek 30-60k PLN dla done-for-you F1-F2), otworzyć case Małej Palarni i wysłać go mailem z tą ceną do jednego konkretnego prospekta — mail wg wzorca dwufunkcyjnego 'portfolio + otwarcie rozmowy walidacyjnej', który jest już opisany w reusable_assets frameworku.

3. **Wysłać demo ARToffNIA z wyceną do fundacji i umówić prezentację — zakończyć fazę budowania, zacząć fazę sprzedaży**
   Pierwszy krok: W godzinę: wystawić demo pod stabilny URL (ten sam wzorzec co Camp Nou: kopia do public/ w repo r352, push, auto-deploy ~2,5 min), napisać krótki mail do fundacji z linkiem, jednym akapitem pitchu i propozycją 30-minutowej rozmowy w przyszłym tygodniu — bez załączania pełnej wyceny (ta na rozmowę).

### Radar komunikacji (Gmail + Slack + Trello)

- **ARToffNIA** [gmail/czeka] — Katarzyna Grabińska ponowiła 4.08 („czy miałeś chwilę się odnieść”) — obiecałeś propozycję „w tym tygodniu”, czyli do piątku 8.08. Równolegle Monika czeka z decyzjami kampanii. → _Wyślij demo + wycenę i umów rozmowę (Priorytet 3 — wszystko jest gotowe)._
- **Kubota** [gmail/czeka] — Draft umowy ramowej od K. Misiaszka czeka na Twoją odpowiedź od 24.07 (2 tygodnie). Uwaga: w Slacku równolegle obiecany raport dla Kuboty z pomocą Ady — domknij oba naraz. → _Przeczytaj draft i odpowiedz — jedna sesja czytania, zero produkcji._
- **Archicom** [gmail/czeka] — Michalina: seria poprawek katalogu 30.07–4.08 (część nieprzeczytana, „wysłałam mailem plik”). Marta wraca 8.08 — prezenter Reymonta na poniedziałek 10.08. → _Priorytet 1: dziś szkielet 8 sekcji + mail egzekwujący brakujące materiały._
- **BW / DailyFruits** [gmail/czeka] — Łukasz prosi o linię kreacji „Dostawy do firmowej kuchni” (5 formatów) — komentarz z 28.07 wciąż nieprzeczytany. 4.08: packshoty za małe, czeka na wnioski z konsultacji. → _Potwierdź przyjęcie briefu i podaj termin._
- **Sonova** [gmail/czeka] — Filip: prośba o wersję z ikonami z lewej strony (24.07, nieprzeczytane) + animacja całości „później”. → _Potwierdź zakres i termin — dwie krótkie odpowiedzi w Figmie._
- **Osada Orle** [gmail/aktywne] — Jan Rogala: ~14 nowych komentarzy w decku wczoraj wieczorem (m.in. mapa odległości do 5 miast, logo partnera). → _Zaciągnij komentarze przez API Figmy i zaplanuj jeden sprint poprawek._
- **Benefit / Zdrofit** [gmail/ok] — Rozliczenie lipca wysłane i przyjęte 4.08. J. Lach: bieżące poprawki (KV z 1 zł, adres Przybyszewskiego) + udostępniony doc „Content 2025 2026”. → _Bieżąca produkcja — pipeline działa normalnie._
- **Ada (podwykonawczyni)** [slack/czeka] — Wczoraj 16:50 obiecałeś: „założę ci task, możesz od tego zacząć jutro” (= dziś) + zapowiedziałeś prośbę o pomoc z raportem dla Kuboty. Ada dopasowała zdjęcia po numerkach (reformaty Geers), stocki zebrane. → _Załóż Adzie task na dziś rano — bez niego jej dzień startuje pusty, a płacisz za okno czasu._
- **Łukasz Pietrowski** [slack/czeka] — Dziś 8:36: „od rana / a młyn”. Wczoraj: problem z animacjami — potrzebuje dostępów do konta Google (czeka na Ciebie), pyta czy widziałeś jego komentarz nt. iHubu; obiecałeś „jutro będę to patrzył” (= dziś). → _Wyślij dostępy do konta Google + odpowiedz ws. iHubu — dwa kliki, odblokowują mu dzień._
- **BW video (Coghen + Pietrowski)** [slack/aktywne] — Kampania video BW w trybie ASAP (Coghen: „to akurat jest asap”). Loop do 10 s zrobiony; Coghen zgłasza dziwny ruch w połowie klipu (uzgodnione: niski priorytet, „z boku”). Materiały w Dropboxie. → _Domknij paczkę ASAP; poprawkę ruchu trzymaj w backlogu, nie w sprincie._
- **Benefit / Zdrofit — produkcja** [trello/aktywne] — Dziś rano nowe wrzutki koordynatorek: ZDROFIT Fabryka Wody — wspinaczka (A. Wiese, z komentarzami) i Karuzela Brynowska (K. Makowska). Stan tablicy: 2 w produkcji / 6 to do / 12 w Feedback — kolejka feedbacku rośnie. → _Przejrzyj 12 kart w Feedback — część to sygnały czekające na Twoją reakcję._
- **Geers / Sonova — produkcja** [trello/czeka] — TO DO FILIP = 12 kart, a Filip dziś rano (7:10–7:14) dorzuca kolejne filmy („Jesteś z tego miasta”, „Film morze”). W produkcji 4, Feedback 8. → _Rozstrzygnij, co z TO DO FILIP jest na Ciebie, a co na niego — 12 kart to zator na wejściu._
- **BW — kampanie wrzesień** [trello/aktywne] — Dziś 6:59–7:00 założyłeś 4 karty „Kampanie wrzesień” (BW / DF / TB / inne) w W PRODUKCJI — wrześniowy sprint kampanijny właśnie wystartował. → _Zbriefuj Adę i Pietrowskiego, żeby produkcja kampanii szła bez Ciebie._
- **Hanoi (Pietrowski)** [trello/aktywne] — Dziś rano ruch: MUSA Karuzela 2 → TO DO, IHub — baner (to jest karta, o którą Pietrowski pyta na Slacku!), Profichem rolka → Done. → _Odpowiedz ws. IHub — jedna karta łączy jego pinga ze Slacka z tablicą._

# Genome — tablica 4 wskaźników (GENEROWANE)

Stan: 2026-08-08T19:00:00+02:00 · źródło: Ledger (40 zdarzeń). Definicje: dec:2026-08-08-plan-90-dni.

| Wskaźnik | Wartość | Cel |
|---|---|---|
| Triale zakończone | **0** / 3 | 3 |
| Mechanizmy zweryfikowane Evidence (measurement/postmortem) | **0** / 22 | rośnie |
| Śr. iteracji na projekt | **n/d** (pomiar od Trial #001: eventy project.iteration) | maleje |
| Czas brief→decyzja | **n/d** (pomiar: ts routed → ts decyzji klienta per trial) | maleje |

Uczciwość: n/d znaczy n/d — wartości pojawią się wyłącznie z realnych zdarzeń, nigdy z ręki.


---

## 🧬 Aksjomaty (8)

**AI automatyzuje decyzje o niskiej wartości poznawczej** — Maszyna zawęża, człowiek wybiera. Decyzje odwagi i finalna promocja do produkcji są celowo ludzkie.

**Dowód wyprzedza obietnicę** — Działający artefakt na realnych danych bije deck; próg liczbowy bije opinię; data z konsekwencją bije gotowość.

**Prawda ma jedno źródło** — Wszystko inne jest widokiem skompilowanym. Rozjazd dwóch prawd to najdroższa klasa błędów.

**Za każdą lekcję płacimy raz** — Wynik negatywny jest aktywem; incydent staje się guardem, procedura SOP-em.

**Mechanizm jest ważniejszy niż artefakt** — Artefakty się starzeją; generatory rezultatów kompoundują.

**Każdy projekt ujawnia mechanizmy** — Projekt, który nie zostawił wiedzy w Genome, został wykonany źle — niezależnie od zachwytu klienta.

**Największą przewagą jest tempo uczenia się** — Technologię i prompty skopiuje każdy. Korpusu decyzji i porażek nie skopiuje nikt.

**Organizacje uczą się przez decyzje, nie dokumenty** — Miarą życia Genome są rozliczone zdarzenia decyzyjne, nie liczba stron.

## Zasady — Principles (7)

**Design for Machine Readers** — Marka i oferta czytelne dla agentów AI tak samo jak dla ludzi.
  ↳ mechanizmy: Agent-Facing Distribution

**Extract, Never Invent** — Szablony i systemy powstają przez ekstrakcję z działającej rzeczywistości, nigdy od zera.
  ↳ mechanizmy: Format Dictionary · Session-to-SOP Compounding · Working-Artifact Extraction

**Pay for Every Lesson Once** — Wiedza (także negatywna) dostaje kanał, którym wraca do pracy automatycznie.
  ↳ mechanizmy: Compounding Channel · Incident-to-Guard Codification · Negative Knowledge Ledger

**Proof Before Promise** — Dowód wyprzedza obietnicę i inwestycję.
  ↳ mechanizmy: Dated Commitment Gates · Open Tool Exchange · Presale Demand Ledger · Proof-First Demo Pitch · Storefront QR Bridge

**Reduce Subjectivity** — Decyzje jakościowe zamieniamy na policzalne progi i reguły.
  ↳ mechanizmy: Deterministic Spine · Machine Narrows, Human Picks · Numeric Gates

**Single Source of Truth** — Jedna maszynowa prawda, wszystkie widoki generowane.
  ↳ mechanizmy: Design-as-Code · Location-as-Data Funnels · Location-as-Data · Single-Source Compiler · Split URL Architecture

**Trust Through Boundaries** — Autonomia AI rośnie proporcjonalnie do twardości granic.
  ↳ mechanizmy: Agent-as-Runtime · Sandbox Promotion

---

## Mechanizmy (22 karty — pełna treść)

### Agent-as-Runtime  `mech:agent-as-runtime`
**Status:** emerging · **Kategoria:** AI Collaboration · **Dowody:** 4 (measurement: 0, postmortem: 0, narracja: 4) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi: 'tego systemu nie da się zautomatyzować, nie ma API', 'wszystko robimy ręcznie w panelu', albo brief opisuje pipeline, który urywa się na ostatniej mili (publikacja w CMS bez API, legacy panel, system rezerwacyjny, narzędzie SaaS bez integracji). Sygnał w rozmowie: 'ktoś u nas musi to codziennie wyklikać'.

**Anti-context:** Nie stosować, gdy istnieje oficjalne API pokrywające cały proces (wtedy klasyczna automatyzacja jest tańsza i trwalsza), gdy klient oczekuje bezobsługowej automatyzacji 24/7 bez okna żywej sesji, albo gdy proces jest krytyczny czasowo i nie toleruje niedeterministycznych błędów timingu. Nie sprzedawać jako 'automatyzacji' tego, co jest usługą asystowaną.

## Problem

Krytyczne systemy nie mają API tam, gdzie kończy się pipeline: Medium nie ma API publikacji, oficjalny MCP Figmy nie czyta komentarzy, use_figma pisze tylko do aktywnego pliku desktop, SQL editor Supabase leżał w kluczowym momencie. Klasyczna automatyzacja urywa się na ostatniej mili.

## Mechanizm działania

Agent AI w żywej sesji staje się brakującym runtime'em API: steruje DOM (TreeWalker+InputEvent w contenteditable Medium), woła wewnętrzne API z zalogowanej sesji Chrome (fetch komentarzy Figmy), operuje panelami przez przeglądarkę użytkownika (import 165 rekordów do Supabase przez REST+admin JWT). Działa, bo agent ma to, czego nie ma skrypt: kontekst zalogowanej sesji, adaptację do zmiennego UI i tolerancję na timing. Dojrzała wersja (briefsync) świadomie dzieli: Python+launchd tam, gdzie jest API; agent WYŁĄCZNIE na ostatnią milę. To trzecia noga modelu 'AI = mózg, podwykonawcy = ręce'.

## Warunki sukcesu

- Procedura utrwalona jako SOP w pamięci (5 kroków Medium, gotchas submit-URL Figmy) — inaczej każda sesja odkrywa timing i pułapki od nowa
- Weryfikacja po każdej operacji (reload i sprawdzenie DOM po czystce) — runtime bez API nie zwraca kodów błędów, więc weryfikację trzeba dobudować samemu
- Świadoma granica: deterministyczna część pipeline'u poza sesją (launchd/cron), agent tylko tam, gdzie API naprawdę nie ma

## Warunki porażki

- Pipeline żyje wyłącznie w oknie żywej sesji — kadencja Medium i reformaty Zdrofit zależą od pamięci Przemka, bo nie są odpalanym narzędziem
- Tokeny krótkożyciowe zabijają gałęzie: Dropbox→Trello martwe od czerwca (token 4h zamiast refresh tokena) — runtime agentowy maskował brak trwałej autoryzacji
- Syntetyczne kliki i za krótkie czekanie na dropdown = niedeterministyczne błędy; timing jest częścią niezawodności i łatwo go zgubić
- use_figma pisze do AKTYWNEGO pliku desktop, nie do fileKey — realny bug budowania na wczorajszej stronie Figmy

## Potencjał automatyzacji

Średni z natury: sedno mechanizmu to obsługa tego, czego NIE da się w pełni zautomatyzować. Realny kierunek: (1) migracja deterministycznych odcinków na oficjalne API (Figma REST z PAT dla briefsync — nazwana, niewykonana szansa), (2) pakowanie procedur agentowych w skille/runbooki odpalane komendą zamiast rekonstruowane z pamięci.

## Transfer

Wysoki jako kompetencja sprzedażowa: 'zautomatyzujemy także to, co nie ma API' to oferta, której klasyczne software house'y nie składają. Przenośne na każdego klienta z legacy panelami (CMS-y, systemy rezerwacyjne, panele sieci fitness).

## Eksperyment · Benefit/Zdrofit

Rozciąć pipeline briefsync Trello→Figma na dwie warstwy i zmierzyć granicę: przenieść wszystko, co się da, na Figma REST API z PAT (tworzenie plików/stron, upload obrazów), zostawiając agenta wyłącznie dla operacji niedostępnych w REST. Przez 2 tygodnie logować: ile operacji/tydzień wykonała warstwa bez sesji vs agentowa, ile transferów przepadło, bo sesja nie żyła, czas odtworzenia po uśpieniu.

**Czego się dowiemy:** Dowiemy się, jaki procent 'trzeciej nogi' jest nią naprawdę, a jaki jest tylko długiem migracyjnym — czyli czy hourly pipeline Zdrofit może działać bezobsługowo, czy strukturalnie wymaga okna żywej sesji. To określa, czy mechanizm wolno sprzedawać jako 'automatyzację', czy jako 'usługę asystowaną'.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Agent-Facing Distribution  `mech:agent-facing-distribution`
**Status:** hypothesis · **Kategoria:** Workflow Architecture · **Dowody:** 2 (measurement: 0, postmortem: 0, narracja: 2) · **Rekomendacja:** test-first

**Trigger:** Klient pyta: 'jak nas znajdzie ChatGPT/AI?', 'czemu asystenci AI polecają konkurencję?', albo brief dotyczy widoczności przy rosnącym udziale odkrywania ofert przez agentów AI. Sygnał: klient ma katalog oferty/produktów w danych strukturalnych (lub da się go wygenerować) i zatłoczone klasyczne kanały (SEO, ads) z rosnącym CAC.

**Anti-context:** Nie stosować, gdy oferta nie ma jednego źródła prawdy (rozjazd cen maszynowych vs ludzkich to najdroższa klasa błędów), gdy klient oczekuje szybkich, gwarantowanych efektów (kanał na poziomie hipotezy, bez danych o efekcie), ani jako substytutu podstaw SEO/oferty — to warstwa dodatkowa, nie fundament.

## Problem

Klasyczne kanały dotarcia (SEO, ads, cold outreach) są zatłoczone i drogie, a rosnąca część odkrywania ofert dzieje się przez agentów AI, które czytają maszynowe źródła, nie landing page'e. Nikt w segmencie r352 nie publikuje jeszcze oferty w formatach natywnych dla agentów.

## Mechanizm działania

Oferta i dane produktu są wystawiane w kanałach, których pierwszym czytelnikiem jest agent AI, nie człowiek: llms.txt z ofertą i cenami na r352.com (ceny jawne dla maszyn, ukryte na kartach usług dla ludzi — nieprzypadkowa asymetria), serwer MCP Caterelo na produkcji jako maszynowy kanał dostępu do danych produktu. Hipoteza: agent, który potrafi odpytać ofertę wprost, cytuje ją i rekomenduje częściej niż stronę wymagającą scrapowania, a bycie pierwszym w niszowym katalogu MCP daje nieproporcjonalną widoczność przy zerowej konkurencji. Komplementarny do zwalidowanego wzorca 'treść otwarta + narzędzia' — dla agentów 'otwartość' oznacza format maszynowy. Generacja treści maszynowej z tego samego źródła co strona (wzorzec single-source) jest warunkiem spójności.

## Warunki sukcesu

- Kanał jest zarejestrowany tam, gdzie agenci szukają (katalogi MCP, konwencje llms.txt) — sama obecność endpointu bez rejestracji = zero widoczności
- Treść maszynowa jest spójna ze stroną ludzką (jedno źródło prawdy) — niespójność cen llms.txt vs karty usług już odnotowana jako problem
- Istnieje pomiar ruchu agentowego (logi endpointu, atrybucja zapytań) — bez tego kanał nie przejdzie testu 'czy wiemy więcej'

## Warunki porażki

- Kanał zbudowany, niedystrybuowany: MCP Caterelo 'niezarejestrowany w żadnym katalogu — unikalny kanał bez żadnej widoczności' (klasyczny błąd ostatniej mili)
- Detale protokołu cicho ubijają dostępność: redirect 308 bez trailing slash odcinał klientów MCP zanim ktokolwiek to zauważył
- Rozjazd dwóch prawd (ceny w llms.txt vs strona) — najdroższa klasa błędów systemu przeniesiona na nowy kanał

## Potencjał automatyzacji

Wysoki: generacja llms.txt i manifestów MCP z tego samego źródła danych co strona (wzorzec 'jedno źródło → wiele widoków' pasuje 1:1), monitoring ruchu agentowego w logach, auto-rejestracja w katalogach.

## Transfer

Wysoki i wcześnie: usługa 'przygotujemy Twoją markę na odkrywanie przez agentów AI' (llms.txt, dane strukturalne, MCP dla katalogu produktów) to naturalne rozszerzenie Brand Hub OS i potencjalny wyróżnik ofertowy, zanim rynek to skopiuje. Pasuje do klientów z katalogami ofert (DailyFruits, Zdrofit, FitStyle).

## Eksperyment · BetterWorkplace/DailyFruits

Opublikować na dailyfruits.pl llms.txt + maszynowy indeks oferty (katalog CATS/programy w JSON, generowany przez istniejący build.js z tego samego źródła co strona — zero duplikacji danych). Przez 6–8 tygodni mierzyć w logach Vercela ruch po user-agentach AI (GPTBot, ClaudeBot, PerplexityBot itd.) na tych ścieżkach vs reszta serwisu, oraz cotygodniowy sondaż odpowiedzi 3 głównych asystentów AI na zapytania typu 'owoce do biura Warszawa' przed i po publikacji (czy cytują DailyFruits i czy podają poprawne dane oferty).

**Czego się dowiemy:** Dowiemy się, czy kanał agentowy w ogóle generuje mierzalny ruch/cytowania dla polskiej marki B2B w 2026 — tanie, odwracalne wdrożenie da pierwszą twardą liczbę zamiast intuicji i rozstrzygnie, czy 'AI-readiness marki' dodać jako moduł Brand Hub OS oraz czy warto dokończyć rejestrację MCP Caterelo.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Compounding Channel  `mech:compounding-channel`
**Status:** emerging · **Kategoria:** Knowledge Compounding · **Dowody:** 4 (measurement: 0, postmortem: 0, narracja: 4) · **Rekomendacja:** test-first

**Trigger:** Sygnały wewnętrzne lub u klienta: 'przecież to już kiedyś robiliśmy', 'gdzie jest ten szablon z tamtej kampanii?', te same wzorce przepisywane od zera w kolejnych projektach, wiedza i assety żyjące na dyskach/w skrzynkach pojedynczych osób. Brief typu: 'chcemy przestać wymyślać koło na nowo przy każdej kampanii'.

**Anti-context:** Nie stosować przy pierwszym lub drugim wystąpieniu wzorca (przedwczesna generalizacja = utrzymanie frameworku bez użytkowników), ani w organizacjach bez żadnego naturalnego kanału startu pracy — sam komponent bez kanału dystrybucji nie skompounduje. Nie budować rejestru dla zespołu, który go nie otworzy.

## Problem

Mimo zasady 'Every Project Compounds' kod nie kompounduje: ten sam wzorzec (mini-SSG ~7 razy, bramka hasłowa 4 razy, dwa silniki oceny briefów, które się nie widzą) jest przepisywany od zera, a działające pipeline'y (renderery LEMF, pipeline Wayback, harness testowy CMS) giną w scratchpadach sesji — kolejna sesja 'wie JAK, ale musi zbudować CZYM'.

## Mechanizm działania

Diagnoza-mechanizm z jasną receptą: kompounduje wyłącznie to, co ma AUTOMATYCZNY kanał dystrybucji do przyszłej pracy. Wiedza tekstowa kompounduje, bo auto-memory ładuje się do każdej sesji; kod nie kompounduje, bo nie ma analogicznego kanału. Compounding podąża za kanałem dystrybucji, nie za wartością artefaktu — chcesz, żeby kod kompoundował, daj mu kanał o sile auto-memory: jedno kanoniczne repo komponentów + wpis pamięci wskazujący ścieżkę + ekstrakcja jako element definition-of-done. Kontrprzykład potwierdzający regułę: CMS bees-knees skompoundował, bo miał kanał (kanoniczne repo DailyFruits + wpis pamięci) — port zajął ułamek kosztu budowy.

## Warunki sukcesu

- Istnieje jedno kanoniczne miejsce komponentów (repo) + wpis w auto-memory wskazujący ścieżkę — kod dostaje kanał dystrybucji o sile pamięci
- Ekstrakcja do repo jest częścią definition-of-done projektu, nie osobnym zadaniem 'kiedyś'
- Komponent ma minimalny interfejs i README — koszt użycia niższy niż koszt przepisania

## Warunki porażki

- Scratchpad sesji jako domyślne miejsce pracy — wszystko w nim ginie z końcem sesji (realne straty: renderery LEMF, pipeline Wayback, harness CMS)
- Komponent wyjęty, ale bez wpisu pamięci — kolejna sesja go nie znajdzie, bo szuka tylko tam, gdzie ładuje się kontekst
- Zbyt wczesna generalizacja: kanoniczny komponent budowany zanim wzorzec wystąpił ≥3 razy zamienia się w utrzymanie frameworku bez użytkowników

## Potencjał automatyzacji

Wysoki: skaner końca sesji wykrywający skrypty-kandydatów w scratchpadzie ('ten plik działał ≥1 raz i pasuje do znanej rodziny wzorców — wyekstrahować?'); rejestr komponentów jako plik pamięci generowany z repo; miernik reuse-rate (ile projektów użyło komponentu vs przepisało).

## Transfer

Wysoki, z twistem: dla klientów to lekcja o asset management w marketingu (szablony kampanii giną w skrzynkach i na dyskach osób — kompounduje tylko to, co jest w kanale, którym zespół naturalnie zaczyna pracę). Dla samego r352 to warunek skalowalności frameworku Brand Hub.

## Eksperyment · BetterWorkplace/DailyFruits

Wyekstrahować jeden kanoniczny mini-SSG (najczęściej przepisywany wzorzec: źródło danych → wiele widoków HTML) do repo r352-framework + wpis w auto-memory ze ścieżką i minimalnym README. Następny projekt generatywny w ekosystemie BW (np. kolejne narzędzie sprzedażowe typu katalog/kalkulator) prowadzić bez podpowiedzi wprost — test binarny: czy sesja sama znalazła i użyła komponentu, czy przepisała od zera; dodatkowo czas do pierwszego działającego buildu vs mediana z 7 historycznych przepisań.

**Czego się dowiemy:** Dowiemy się, czy wpis pamięci + kanoniczne repo wystarczą jako kanał dystrybucji kodu (czy compounding wykonywalny da się uruchomić tym samym mechanizmem, który napędza compounding tekstowy) oraz jaki jest realny mnożnik czasowy — to rozstrzyga, czy budować rejestr komponentów jako organ systemu na równi z auto-memory.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Dated Commitment Gates  `mech:dated-commitment-gates`
**Status:** emerging · **Kategoria:** Decision Velocity · **Dowody:** 4 (measurement: 0, postmortem: 0, narracja: 4) · **Rekomendacja:** test-first

**Trigger:** Sygnały: 'wystartujemy, jak będziemy gotowi', projekt rozbudowywany miesiącami bez żadnej metryki popytu, gotowe materiały czekające na wysyłkę ('kampania leży, bo nie było kiedy'), decyzje inwestycyjne podejmowane na entuzjazmie bez zdefiniowanego warunku 'tak'. Klient nie umie powiedzieć, co musiałoby być prawdą, żeby zrobić GO albo STOP.

**Anti-context:** Nie stosować, gdy konsekwencja bramki i tak wymaga aktu woli w dniu deadline'u (to nie bramka, tylko intencja), gdy próg nie da się wyrazić liczbą, ani w organizacjach, gdzie deadline'y są rutynowo renegocjowane przez komitet — bramka bez egzekucji uczy, że bramki się obchodzi. Nie zastępuje pracy nad produktem, gdy brak dowodu popytu wynika z braku artefaktu do pokazania.

## Problem

Dwie strony tego samego korka: (1) decyzje o związaniu kapitału i mocy produkcyjnej zapadają na entuzjazmie, nie dowodzie popytu, i ciągną się miesiącami, bo nikt nie zdefiniował, co musiałoby być prawdą, żeby powiedzieć 'tak'; (2) AI zdjęło wąskie gardło z produkcji, więc przeniosło się ono na akty odwagi i kontaktu człowieka — framework w ~72% bez pierwszej sprzedaży, demo ARToffNIA niepokazane, wtyczka Caterelo niezłożona do CWS przez brak 2 zrzutów (zdiagnozowane 03.08 jako korek systemu).

## Mechanizm działania

Zastąpienie 'ship-when-ready' i 'zdecydujemy, jak poczujemy gotowość' twardą, datowaną bramką z liczbowym progiem i konsekwencją, która zadziała BEZ udziału człowieka: GO ma jasny warunek (≥8 depozytów do 6.11), STOP jest z góry zaplanowanym, honorowym wyjściem (przewidziany wpis 'Abandoned' w Logu), a do bramki dochodzi się najtańszym artefaktem dowodowym (klikalne demo, MVP, pilot) zamiast pełnym produktem. Mechanizm przenosi decyzję z bieżącej siły woli (najdroższy zasób, powiązany z rocznym celem sprawczości) na mechanizm ustawiony raz, w momencie niskiego kosztu emocjonalnego. Kontrast z korpusu jest ostry: rzeczy z automatyczną konsekwencją datową się dzieją (BETA_DEADLINE wygasi betę sama), rzeczy zależne od pamięci/odwagi stoją mimo gotowych procedur.

## Warunki sukcesu

- Próg i data ustalone na piśmie ZANIM zacznie się budowa; próg liczbowy, nie 'zobaczymy zainteresowanie'
- Konsekwencja bramki jest zautomatyzowana lub zewnętrzna (kod ją wykona / ktoś inny czeka) — bramka wymagająca aktu woli w dniu deadline'u to nie bramka
- Artefakt dowodowy jest najtańszą rzeczą testującą popyt (demo, MVP, pilot); kanał zbierania dowodu działa technicznie zanim ruszy test
- Porażka ma z góry nazwany, godny scenariusz (wpis 'Abandoned') — obniża koszt emocjonalny egzekucji, co jest sednem przy założycielu, którego wąskim gardłem jest strach

## Warunki porażki

- Budowa zamiast walidacji: Caterelo rozbudowywane bez żadnej metryki popytu — energia produkcyjna maskuje brak decyzji
- Bramka jako intencja, nie mechanizm: kadencja Medium bez schedulera, re-oceny scoreboardów zależne od pamięci Przemka mimo deterministycznych procedur
- Ostatnia mila poza bramką: dowód dowieziony, ale nie doręczony (demo ARToffNIA niepokazane, landing frameworku niezdeployowany, case Sonova niewysłany) — bramka musi obejmować kontakt/publikację, nie tylko artefakt
- Kanał dowodowy dziurawy: formularz human-commons na mailto = ryzyko utraty leadów przed bramką; gated content z lewymi adresami (wzorzec odrzucony po teście)

## Potencjał automatyzacji

Wysoki i tani: wzorce już istnieją w kodzie (BETA_DEADLINE, bramki datowane frameworku). Do zrobienia: scheduler kadencji (Medium, re-oceny), bramki datowe z auto-konsekwencją w FOTRA/CKO (codzienny przegląd 7:30 już istnieje jako nośnik), licznik dowodów jako żywy element strony, auto-publikacja draftów po terminie jako opcja nuklearna. Sam akt GO/STOP zostaje ludzki — i o to chodzi.

## Transfer

Średni-wysoki: przenośny na klientów z tym samym failure mode (kampanie gotowe, niewysłane; decyzje produktowe na entuzjazmie) — jako element governance w Brand Hub OS: bramki F1–F5 z datami i automatyczną konsekwencją zamiast samych progów jakości; Benefit (pilot przed rolloutem) już ma tę strukturę. Ograniczenie: mechanizm nie naprawia korka 'shipping do człowieka' sam z siebie — wymaga sparowania z zewnętrznym wymuszeniem doręczenia.

## Eksperyment · BetterWorkplace (TeamBudget)

Domknąć pętlę, której dziś brakuje: MVP istnieje, ale nie ma bramki popytowej. Ustawić na najbliższym kroku sprzedażowym pełną bramkę datową na piśmie: data + liczbowy warunek wykonania (np. wysyłka do 30 decydentów; GO = ≥5 umówionych demo, STOP = archiwizacja) + automatyczna konsekwencja w kodzie huba (po dacie hub sam przełącza banner na 'wersja archiwalna — projekt wstrzymany' i wysyła powiadomienie) + z góry napisany wpis 'Abandoned'. Równolegle zostawić drugi otwarty wątek (np. case Sonova) bez bramki jako kontrolę. Zmierzyć: czy akt kontaktu nastąpił przed datą, ile dni przed, vs wątek kontrolny.

**Czego się dowiemy:** Dwie rzeczy naraz: (1) czy istnieje popyt na wdrożenie TeamBudget (twarda liczba demo zamiast przeczucia), (2) czy automatyczna konsekwencja datowa realnie wypycha akty odwagi u tego konkretnego założyciela (n=1, ale właściwe n — cały system ma jedno gardło), czy tylko przesuwa prokrastynację na obchodzenie bramki. Wynik decyduje, czy bramki datowe wpisać na stałe do CKO/FOTRA i playbooka F1–F5 oraz czy Dated Commitment Gates można sprzedawać jako mechanizm.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Design-as-Code  `mech:design-as-code`
**Status:** emerging · **Kategoria:** Production Scaling · **Dowody:** 4 (measurement: 0, postmortem: 0, narracja: 4) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'każda zmiana wymiaru to przerysowanie od nowa', 'drukarnia odesłała pliki z błędami' albo brief dotyczy powtarzalnej produkcji fizycznej (oklejenia kolejnych lokali, standy, boardy) z twardymi wymogami (wymiary, linie cięcia, działające QR).

**Anti-context:** Nie stosować do one-off kreacji wizerunkowej, gdzie dominuje eksploracja estetyczna — setup parametryczny się nie zwróci, a kod spowalnia iterację stylu. Ryzyko przy assetach żyjących poza repo (drift plików źródłowych) i przy braku kroku weryfikacji finalnego pliku — narzędzia potrafią cicho psuć output ('wygląda ok').

## Problem

Produkcja graficzna w narzędziach DTP nie skaluje się i nie jest weryfikowalna: zmiana wymiaru witryny lub treści oznacza ręczne przerysowanie, a błędy (niedziałający QR, złe linie cięcia) wykrywa dopiero drukarnia albo klient.

## Mechanizm działania

Projekt graficzny jest programem: HTML+CSS z jawną, zadeklarowaną skalą jednostkową (1 cm = 10 px; 10 j. = 1 cm) renderowanym headless Chrome do plików produkcyjnych. Bo artefakt jest kodem, dostaje trzy własności niedostępne w DTP: parametryczność (zmiana configu przelicza cały projekt), weryfikację programową (QR czytany moduł po module przez segno na FINALNYM pliku) i diffowalność w gicie. Rezultat: produkcja wielkoformatowa/3D z gwarancjami jakości zamiast czujności.

## Warunki sukcesu

- Jawna skala jednostkowa zadeklarowana raz, na początku — bez niej render do druku jest loterią
- Weryfikacja odbywa się na finalnym wyrenderowanym pliku, nie na źródle (lekcja QR)
- Rodzina artefaktów jest powtarzalna (kolejne kluby, kolejne standy) — jednorazowy artefakt nie zwraca kosztu setupu

## Warunki porażki

- Fonty niedostępne w środowisku renderu — bloker rozwiązywany za każdym razem inaczej (Aptly→fontTools→SVG, base64 przeciw CSP, mapy substytutów) zamiast raz
- Drift plików źródłowych: przeterminowany tyl.svg na Desktopie w kubota — 'projekt jako kod' nie chroni, gdy assety żyją poza repo
- Narzędzia cicho psujące output (PIL zabija alpha, minifikator psuje JS) — bez kroku weryfikacji failure mode to 'wygląda ok'

## Potencjał automatyzacji

Wysoki: wspólny toolkit render (headless Chrome + skala + linie cięcia + weryfikator QR/kolorów) jako pakiet; pipeline 'config nowej lokalizacji → komplet plików do drukarni' bez sesji projektowej; font-resolver (mapa substytutów + base64) jako jednorazowo rozwiązany komponent.

## Transfer

Wysoki dla klientów sieciowych i produktowych (retail, fitness, deweloperzy — każdy z powtarzalnym formatem fizycznym); definiuje produkt 'oklejenia sieciowe jako usługa parametryczna'. Słaby dla one-off kreacji wizerunkowej, gdzie dominuje eksploracja.

## Eksperyment · Benefit/Zdrofit

Przy najbliższym otwarciu klubu wykonać oklejenie witryn WYŁĄCZNIE przez zmianę configu (BOARDS + COPY + wymiary witryn nowej lokalizacji) w kodzie z Łodygowej, bez otwierania narzędzia graficznego. Zmierzyć: czas od otrzymania wymiarów do plików produkcyjnych, liczbę poprawek drukarni, wynik programowej weryfikacji QR.

**Czego się dowiemy:** Dowiemy się, czy 'nowy klub w godzinę' jest realny na drugiej lokalizacji (pierwsza replikacja = prawdziwy test parametryczności) i co w configu było jednak przybite do Łodygowej — to wprost definiuje produkt parametrycznych oklejeń sieciowych.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Deterministic Spine  `mech:deterministic-spine`
**Status:** emerging · **Kategoria:** Human-AI Decision Systems · **Dowody:** 4 (measurement: 0, postmortem: 0, narracja: 4) · **Rekomendacja:** use-with-care

**Trigger:** Klient pyta 'ile to będzie kosztować per operacja?', 'co się stanie, jak API padnie?' albo procurement/IT wymaga audytowalności i SLA. Sygnał: planowany system decyzyjny 'wszystko przez LLM' przy dużym wolumenie, albo odwrotnie — czysto regułowy system ślepy na semantykę treści.

**Anti-context:** Nie stosować tam, gdzie zadanie jest w całości kreatywno-semantyczne i nie da się wydzielić pełnowartościowej ścieżki zero-LLM — kręgosłup deterministyczny byłby atrapą. Nie zaczynać od warstwy LLM 'bo łatwiej' — kolejność musi iść od reguł; unikać też budowy drugiego silnika scoringu obok istniejącego (duplikacja to znany failure mode).

## Problem

Systemy decyzyjne zbudowane w całości na LLM są drogie, niedeterministyczne i padają razem z API (a najmocniejszy model do wszystkiego wyczerpuje limity i budżet) — a systemy czysto regułowe nie rozumieją semantyki. Organizacje wybierają jedno albo drugie i płacą albo kosztem/awariami, albo ślepotą na treść; w korpusie realne awarie środowiska (pauza free-tier Supabase, 429 CoinGecko, ucięty JSON przy max_tokens) były wielokrotnie mylone z bugami własnego kodu.

## Mechanizm działania

Architektura warstwowa wg wymaganej inteligencji: deterministyczny kręgosłup (rule engine, jawne wagi, twarde kryteria) podejmuje wszystkie decyzje policzalne bez modelu — za darmo, natychmiast, odtwarzalnie — i działa bez LLM; tani model (Haiku) robi uzasadnienia i klasyfikacje wolumenowe; średni (Sonnet) generuje i ekstrahuje; najdroższy ocenia i krytykuje. Każda warstwa LLM ma twardy cost cap wpisany w kod ($0.05/brief hard stop) i zdefiniowany deterministyczny fallback. Skutek: produkt działa przy padzie API (degraduje się do reguł zamiast umierać), koszt jednostkowy jest policzony z góry, każda decyzja ma audytowalną ścieżkę, a LLM jest wymienialnym komponentem, nie fundamentem — warunek sprzedaży organizacjom z procurementem.

## Warunki sukcesu

- Ścieżka zero-LLM istnieje NAJPIERW i jest domyślna oraz pełnowartościowa — model dokłada wartość, nie warunkuje działania
- Cost cap i fallback zdefiniowane w kodzie PRZED włączeniem warstwy LLM, nie po pierwszym rachunku; koszt per operacja znany przed sprzedażą
- Cache wyników z recompute tylko przy zmianie wejścia — inaczej koszty i latencja rosną bez wartości
- Kryteria oceny liczbowe (Critic 750/1000, Brand Lock 85/100) — inaczej tańszy model nie ma jak być rozliczony z jakości; kolejność implementacji wg user value, nie łatwości technicznej

## Warunki porażki

- Duplikacja silników zamiast jednego komponentu: readiness.ts+MACS vs policy-engine+llm-auditor — dwie implementacje scoringu briefów, które się nie widzą
- Limity infrastruktury mylone z bugami kodu (pauza Supabase jako 'awaria auth', max_tokens 8k ucinający JSON) — bez zaprojektowanej degradacji każdy limit wygląda jak awaria produktu
- Brak monitoringu cichych failów generacji — pierwszy pilot kliencki r3loop może paść bez alertu; fallback bez alertowania maskuje degradację
- Automatyzacja tylko w komentarzach: UI miesiącami odsyłał do przycisku 'Generuj strategię', który nie istniał — warstwa deklarowana, nie zbudowana

## Potencjał automatyzacji

To JEST wzorzec architektury automatyzacji — rdzeń działa pod cronem/launchd bez agenta. Największa dźwignia: konsolidacja w jeden 'brief scoring engine' wystawiony obu produktom (r3loop + Narzędzie), monitoring failów generacji, zamiana walidatorów-promptów w walidatory-skrypty. Wzorzec spisany jako reużywalny spec (LLM_INTEGRATION_SPEC.md).

## Transfer

Wysoki i bezpośrednio ofertowy: 'wasza automatyzacja nie umrze razem z API i ma policzony koszt per decyzja' to argument, którego agencje nie składają — warunek każdej oferty produktowej z SLA cenowym (Narzędzie 50–100k PLN) i przepustka przez procurement/IT u klientów typu Benefit czy Sonova. Przenosi się na każdy system oceny treści.

## Eksperyment · Benefit/Zdrofit (Narzędzie do briefowania)

Wykorzystać nieużyty korpus 39 realnych briefów z briefsync: przepuścić każdy brief przez trzy konfiguracje (sam policy-engine / +Haiku reasoning / +Sonnet semantic alignment), a wyniki ocenić w ślepym teście przez Reszka i Natalię (użyteczność dla walidatora, skala 1–5). Zmierzyć deltę jakości między warstwami oraz realny koszt per brief w każdej konfiguracji vs cap.

**Czego się dowiemy:** Dowiemy się, gdzie leży punkt nasycenia jakości (czy Haiku wystarcza do reasoning; ile realnej wartości decyzyjnej dokłada warstwa semantyczna ponad darmowe reguły — czyli czy $0.05/brief kupuje mierzalnie lepsze decyzje). To ustawia pricing pilotażu 20 lokalizacji na twardych kosztach jednostkowych i rozstrzyga architekturę przed skalowaniem; przy okazji pierwsza walidacja alignment score na realnych danych.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Format Dictionary  `mech:format-dictionary`
**Status:** emerging · **Kategoria:** Brief Compression · **Dowody:** 3 (measurement: 0, postmortem: 0, narracja: 3) · **Rekomendacja:** test-first

**Trigger:** Klient mówi: 'mamy dziesiątki briefów miesięcznie', 'każdy grafik robi to po swojemu', 'większość zadań to w sumie te same formaty'. Cechy problemu: wolumen ≥kilkadziesiąt zadań/mies. od wielu osób briefujących, powtarzalny miks formatów (posty, plakaty, rollupy), ręczne przenoszenie między narzędziami jako główny koszt.

**Anti-context:** Nie stosować przy niskim wolumenie (kilka unikalnych projektów/mies. — słownik się nie zamortyzuje), przy pracy czysto koncepcyjnej/kampanijnej, gdzie każdy projekt jest naprawdę inny, ani zanim istnieje zwalidowana biblioteka masterów — automat bez masterów produkuje śmieci do poprawiania.

## Problem

Przy wolumenie ~100 briefów/mies. od 12–15 osób briefujących każdy brief jest traktowany jak unikalny projekt: ręczne przenoszenie między narzędziami i odtwarzanie layoutów od zera to główny pożeracz czasu produkcji, a wiedza 'co to za typ zadania' żyje tylko w głowie wykonawcy.

## Mechanizm działania

Strumień briefów jest kompresowany przez słownik: brief = rekord danych, klasyfikator mapuje go na skończony słownik typów (marka/typ/formaty; create/feedback/skip/remove), a rodziny szablonowe mają przygotowane mastery, z których automat generuje wstępne kreacje. Kompresja działa, bo w wolumenowej produkcji rozkład typów jest gruboogonowy — mała liczba rodzin pokrywa większość wolumenu; wszystko spoza słownika świadomie dostaje TYLKO klasyfikację, nie obietnicę automatu. Człowiek przestaje czytać briefy, a zaczyna walidować sklasyfikowane rekordy. Od strony wejścia ta sama kompresja: wizard wymusza strukturę briefu u źródła (brief rodzi się jako rekord, nie mail).

## Warunki sukcesu

- Słownik jest wyprowadzony z realnego korpusu briefów (rozkład typów zmierzony, nie założony)
- Kolejność wdrożenia: najpierw zwalidowana biblioteka masterów, dopiero potem pętla — 'inaczej automat produkuje śmieci do poprawiania'
- Granica słownika jest jawna: nietypowe zadania dostają klasyfikację + ramkę, nigdy udawaną automatyzację

## Warunki porażki

- Klasyfikator bez pętli uczenia — słownik zamrożony w dniu startu dryfuje od realnego strumienia
- Zgromadzone dane nieobrócone w wartość — 39 briefów i metryki lead time z briefsync nie zasilają ani korpusu testowego alignment score, ani raportu sprzedającego automatyzację klientowi
- Multi-source bez izolacji stanu — tablice nawzajem oznaczały sobie briefy jako done, dopóki nie wprowadzono BOARD_TAG

## Potencjał automatyzacji

Bardzo wysoki — klasyfikacja już działa autonomicznie (Python+launchd), generacja z masterów zaprojektowana. Otwarte: przejście gałęzi Figma na REST API oraz pętla uczenia słownika z decyzji walidatora. Docelowo człowiek zostaje tylko w walidacji (sprzężenie z Sandbox Promotion).

## Transfer

Przenośny na każdego klienta wolumenowego z powtarzalnym miksem formatów — briefsync już obsługuje 8 tablic różnych klientów tym samym kodem z deklaratywnym boards.json. Rdzeń wartości produktu 'Narzędzie do briefowania' (pilot 20 lokalizacji, pricing 50–100k PLN); test transferu słownika FORMATÓW na drugą markę to naturalny następny krok.

## Eksperyment · Sonova/Geers

Test transferu słownika na drugiego klienta wolumenowego: wziąć historyczne karty z tablicy Geers/Sonova w briefsync (dane już zebrane), zbudować z nich słownik formatów metodą ze Zdrofitu i zmierzyć: (a) jaki % briefów Geers klasyfikuje się do skończonych rodzin szablonowych, (b) ile rodzin pokrywa 80% wolumenu, (c) które rodziny pokrywają się ze słownikiem Zdrofit (część wspólna = kandydat na słownik bazowy produktu).

**Czego się dowiemy:** Dowiemy się, czy kompresja przez słownik jest własnością KLIENTA (Zdrofit ma nietypowo szablonowy miks) czy MECHANIZMU (rozkład gruboogonowy powtarza się u drugiego klienta wolumenowego). Jeśli drugie — mamy zmierzony argument, że Narzędzie do briefowania z rodzinami szablonowymi jest produktem multi-klienckim, i wiemy, jaki % słownika jest uniwersalny vs per-brand, zanim zbudujemy multi-tenant.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Incident-to-Guard Codification  `mech:incident-to-guard`
**Status:** emerging · **Kategoria:** Organizational Learning · **Dowody:** 5 (measurement: 0, postmortem: 0, narracja: 5) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'to już trzeci raz ta sama wpadka', 'wysłaliśmy do druku z błędem i nikt nie zauważył' albo po incydencie planuje 'szkolenie i większą czujność zespołu'. Sygnał: powtarzające się klasy błędów, ciche rozjazdy wersji (repo vs live, źródło vs kopia) i kontrola oparta na pamięci ludzi.

**Anti-context:** Nie stosować jako guardów opcjonalnych/wywoływanych ręcznie — to nie są guardy i dają fałszywe poczucie bezpieczeństwa. Nie kodyfikować lekcji wyłącznie jako promptów/notatek (pozostają miękkie). Uwaga na wiarygodność: nie sprzedawać mechanizmu, łamiąc go u siebie (asymetria klient/własne).

## Problem

Organizacje 'uczą się' z błędów przez apele o czujność ('sprawdzajcie dokładniej'), która eroduje w tygodnie — więc ta sama klasa błędu wraca. Najdroższa klasa to nie crashe, lecz ciche rozjazdy dwóch prawd (repo vs live, źródło vs kopia, 'wygląda ok, ale to nieaktualna/zepsuta wersja'), której czujność z definicji nie łapie.

## Mechanizm działania

Każdy incydent jest generalizowany do klasy błędu i zamieniany w mechaniczny guard stojący na przymusowym przejściu (build/CI/deploy/cron) zamiast w apel o uwagę: node --check z auto-rollbackiem po minifikacji, brand:check porównujący kod z brand guidem, CI blokujące validate+htmlhint+build --check, curl weryfikujący prerender po deployu, segno czytający QR z finalnego pliku. Lekcja przestaje zależeć od pamięci i dyscypliny człowieka, bo guard wykonuje się automatycznie przy każdym przebiegu, a jego koszt jest jednorazowy. Genealogia z korpusu: zasada verify-first powstała z klasy wpadek 'ciche rozjazdy dwóch prawd', a skuteczną obroną okazały się guardy w buildzie, nie czujność w sesji.

## Warunki sukcesu

- Guard jest blokujący i stoi na przymusowym przejściu (build/CI/deploy/cron) — guard opcjonalny lub wywoływany ręcznie nie jest guardem
- Guard weryfikuje artefakt FINALNY (po minifikacji, po renderze, po deployu), nie źródło
- Incydent jest generalizowany do klasy błędu, nie do pojedynczego przypadku (izolacja stanu per konsument, nie 'fix tego jednego boarda')
- Guard powstaje natychmiast po incydencie, póki koszt błędu jest świeży i policzalny — 'incydent → guard' jako bramka zamknięcia każdej naprawy

## Warunki porażki

- Asymetria klient/własne: u klientów CI blokujące, u siebie dyscyplina sesyjna (pilot frameworku nieskommitowany, betterguide poza gitem, Caterelo miesiącami bez remote)
- Lekcje kodyfikowane jako prompt/pamięć zamiast skryptu pozostają miękkie (walidatorzy frameworku to prompty, bramka F2 ręczna)
- Projekty deployowane poza rurą nie mają żadnego guarda; kopie synchronizowane ręcznie cp (sentiment-tracker w FOTRA) — rozjazd gwarantowany konstrukcyjnie
- Każde nowe narzędzie w rurze bez guarda to nowy wektor cichego rozjazdu (importer Medium: 145 em-dashy; PIL zabija alpha; Resend ignoruje reply_to)

## Potencjał automatyzacji

Bardzo wysoki i tani: katalog guardów jako reużywalne moduły w scaffoldzie (brand-check, syntax-check+rollback, verify-po-deployu, weryfikator QR/asset); sesja po każdym incydencie proponuje guard-kandydata zamiast wpisu 'uważać na X'. Największa luka: guard 'repo==live' (hash deployu vs HEAD) — zaadresowałby najczęstszy błąd systemowy jednym mechanizmem.

## Transfer

Bardzo wysoki — najbardziej uniwersalny mechanizm uczenia się: 'wasza organizacja nie uczy się przez szkolenia, tylko przez zamianę każdej wpadki w automatyczną bramkę'. Dla klientów wolumenowych wprost przekładalne na spadającą stopę błędów bez wzrostu kontroli ręcznej; 'spójność marki sprawdzana maszynowo przy każdej zmianie' to obietnica, której agencje nie składają. U klientów bez rury build/deploy wymaga najpierw jej zbudowania (co samo jest ofertą).

## Eksperyment · Benefit/Zdrofit

W przygotowywanym hourly pipeline wprowadzić pętlę: każda kreacja odrzucona przez Reszka w walidacji dostaje przyczynę z zamkniętej listy, a każda przyczyna występująca ≥2 razy MUSI zostać zamieniona w regułę klasyfikatora/pre-check przed generacją (guard). Mierzyć tygodniowo: odsetek odrzuceń per przyczyna, liczbę dodanych reguł, oraz czy odrzucenia z przyczyn 'zguardowanych' spadają do ~0 i nie wracają.

**Czego się dowiemy:** Dowiemy się, jaka część feedbacku walidatora w ogóle daje się skompilować do reguł (granica automatyzowalności uczenia się na wolumenie ~100 briefów/mies.) i jak szybko pipeline osiąga plateau jakości — to wprost krzywa uczenia się organizacji, którą można pokazać buyerowi Benefit jako produkt. Bonus: to jest jednocześnie brakująca w całym systemie pętla feedbacku człowiek→maszyna.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Location-as-Data Funnels  `mech:location-as-data-funnels`
**Status:** emerging · **Kategoria:** Funnel Mechanics · **Dowody:** 3 (measurement: 0, postmortem: 0, narracja: 3) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi: 'mamy 30 lokalizacji i jedną stronę', 'każde miasto/zajęcia wymagałoby osobnego landingu, ale nie mamy na to budżetu', 'reklamy prowadzą na stronę główną'. Cechy problemu: kampanie lokalne/segmentowe, dziesiątki potrzebnych wariantów, ruch płatny lądujący na jednej ogólnej stronie.

**Anti-context:** Nie stosować przy kilku segmentach, które taniej zrobić ręcznie, gdy dane klienta są nieuporządkowane i nikt nie utrzyma ich zgodności z rzeczywistością (landing z błędnymi godzinami/cenami pali kampanię), ani gdy klient będzie ręcznie poprawiał wygenerowane widoki zamiast źródła danych.

## Problem

Kampanie lokalne i segmentowe potrzebują dziesiątek trafnych landingów (per miasto, per zajęcia, per grupa docelowa), a ręczna produkcja każdego z nich jest za droga — więc ruch z reklam ląduje na jednej ogólnej stronie i konwersja przepada.

## Mechanizm działania

Cała zmienność lejka zamknięta w danych, nie w stronach: jeden szablon + plik danych per segment (JSON per miasto z polami fleksji cityGen/cityLoc, baza zajęć jako jedyne źródło) generuje kompletny landing pod każdą kreację. Każda reklama dostaje URL trafiający 1:1 w intencję (miasto, konkretne zajęcia, grupa wiekowa), a koszt kolejnego landingu spada do kosztu wpisu w danych. Ścieżka kampanii jest mierzalna per krok, bo każdy segment ma własny adres.

## Warunki sukcesu

- Jedno źródło danych — widoki wyłącznie generowane (reguła frameworku r352: jedno źródło → generowane widoki)
- Dane obejmują też język (fleksja polskich nazw miast: pola cityGen/cityLoc), nie tylko liczby
- Każda kreacja reklamowa ma swój deep-link w segment, z eventem analitycznym per krok
- Twarde ograniczenia platformy sprzedażowej znane z góry (GymManager bez API = tylko link/redirect do buy-pass)

## Warunki porażki

- Dane rozjeżdżają się z rzeczywistością klienta — katalog ARToffNIA wymagał dosypania 9 brakujących grup Pryzmatu, zanim był 1:1 z cennikiem; landing z błędnymi godzinami/cenami pali kampanię
- Segmentowe URL-e bez konsolidacji canonical zaczynają kanibalizować strony SEO (przerabiane na DailyFruits)
- Ręczne poprawki w wygenerowanych widokach zamiast w źródle danych — po pierwszym rebuildzie znikają

## Potencjał automatyzacji

Bardzo wysoki — to wprost produkt: silnik FitStyle ma być powtarzalnym produktem dla sieci na GymManagerze; generacja landingu z pliku danych jest już zautomatyzowana, do domknięcia automatyczne spinanie z kampanią (UTM/eventy per segment).

## Transfer

Każdy klient multi-location z ICP r352 (30–300+ lokalizacji: fitness, hearing-care, deweloperzy) — to jest dokładnie beachhead z operating strategy; także katalogi usług (ARToffNIA) i kategorie ofertowe (DailyFruits).

## Eksperyment · FitStyle

Uruchomić kampanię lokalną w 3 miastach z listy przedsprzedażowej jednocześnie, wyłącznie kosztem dodania plików JSON (bez pracy projektowej). Zmierzyć: czas uruchomienia miasta (cel: <1 dzień), rozrzut konwersji zapisy/sesje między miastami przy identycznym szablonie, oraz które pola danych (data otwarcia vs adres vs zdjęcie lokalizacji) różnicują wynik.

**Czego się dowiemy:** Czy konwersja jest własnością szablonu (mała wariancja między miastami = mechanizm skalowalny jako produkt), czy lokalnego kontekstu (duża wariancja = silnik potrzebuje warstwy lokalnych dowodów); to rozstrzyga model cenowy silnika jako produktu dla sieci.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Location-as-Data  `mech:location-as-data`
**Status:** emerging · **Kategoria:** Multi-location Operations · **Dowody:** 5 (measurement: 0, postmortem: 0, narracja: 5) · **Rekomendacja:** use-with-care

**Trigger:** Klient sieciowy mówi 'każdy klub/lokal robimy osobno', 'otwieramy nowe lokalizacje i marketing nie nadąża' albo w briefie widać, że duża część wolumenu to warianty tej samej kreacji per lokalizacja (adres, godziny, nazwa miasta — z odmianą 'w Rybniku').

**Anti-context:** Nie stosować przy 1-2 lokalizacjach bez planu skali — silnik się nie zwróci. Nie obiecywać skali przed walidacją na ≥2 lokalizacjach (pierwsza replikacja ujawnia, co było przybite). Czerwona flaga: 'dorobię ręcznie po generacji' — niekompletny config łamie mechanizm; podobnie współdzielony stan między tenantami (znany bug).

## Problem

Klienci wielolokalizacyjni (sieci klubów, penye, sieci fitness) potrzebują artefaktów per lokalizacja; robienie ich ręcznie oznacza koszt liniowy i chaos wersji, a w językach fleksyjnych dodatkowo błędy gramatyczne ('w Rybnik').

## Mechanizm działania

Lokalizacja/tenant jest rekordem danych, nie projektem: deklaratywny config (JSON/py) z KOMPLETNYM opisem lokalizacji — łącznie z polską fleksją (cityGen/cityLoc) i brandem — zasila wspólny silnik, a stan każdego konsumenta jest twardo izolowany (BOARD_TAG, TenantProvider, RLS). Nowa lokalizacja = nowy rekord, nie nowy projekt: koszt krańcowy spada do godzin, bo cała praca projektowa została wykonana raz na poziomie silnika. Izolacja stanu per tenant jest częścią mechanizmu, wykutą na realnym bugu.

## Warunki sukcesu

- Config opisuje lokalizację KOMPLETNIE, łącznie z językiem (fleksja) i brandem — każde 'dorobię ręcznie po generacji' łamie mechanizm
- Stan per tenant/konsument fizycznie odizolowany od pierwszego dnia
- Silnik zwalidowany na ≥2 lokalizacjach zanim obieca się skalę — pierwsza replikacja ujawnia, co było przybite

## Warunki porażki

- Współdzielony stan między konsumentami — bug briefsync (tablice oznaczały sobie nawzajem briefy jako done) kosztował realną naprawę
- Semantyczne wyszukiwanie bez progu pewności podstawia INNE miasta zamiast pustki — dane per lokalizacja wymagają walidacji per lokalizacja
- Infrastruktura multi-tenant czeka na konta/sekrety właściciela (Penya: Supabase+Stripe na kontach Reszka) — mechanizm techniczny gotowy, blokada operacyjna

## Potencjał automatyzacji

Bardzo wysoki: scaffold 'nowa lokalizacja' (walidacja configu + generacja + smoke-test per lokalizacja); docelowo panel, w którym klient sam dodaje lokalizację. To wprost architektura produktu 'Narzędzie do briefowania' (pilot 20 lokalizacji).

## Transfer

Rdzeń oferty dla całego segmentu klientów sieciowych (Benefit ~100 briefów/mies. to w dużej mierze warianty per klub). Przenosi się na każdy rynek fleksyjny — fleksja w configu to realna bariera wejścia dla zachodnich narzędzi, czyli przewaga lokalna r352.

## Eksperyment · Benefit/Zdrofit (pilot Narzędzia do briefowania, 20 lokalizacji)

Zbudować rejestr 20 klubów pilotażowych jako klub-config (nazwa+fleksja, adres, godziny, brand assety, kanały) i przepuścić przez niego jeden realny cykl kampanii lokalnej. Zmierzyć: ile pól configu wystarczyło (kompletność schematu), ile briefów z cyklu dało się w pełni zasilić configiem, czas na klub vs obecny proces.

**Czego się dowiemy:** Dostaniemy zwalidowany schemat 'club-as-data' — brakujące pola wykryte na realnych briefach zamiast zgadywane — oraz twardy procent wolumenu obsługiwalny per-lokalizacyjnie, co jest bezpośrednim inputem do pricingu pilotu 50–100k PLN.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Machine Narrows, Human Picks  `mech:machine-narrows-human-picks`
**Status:** emerging · **Kategoria:** Human-AI Decision Systems · **Dowody:** 5 (measurement: 0, postmortem: 0, narracja: 5) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'nie mamy kiedy tego wszystkiego przejrzeć', 'decyzja wisi od tygodni, bo kandydatów są setki' albo 'nie oddamy wyboru maszynie, to kwestia gustu'. Sygnał: decyzja wyboru o dużym wolumenie (setki zdjęć, ~100 briefów/mies., dziesiątki leadów), gdzie 90% to oczywisty odsiew, a finał wymaga kontekstu.

**Anti-context:** Nie stosować, gdy kryteria zawężania nie są uzgodnione z decydentem — praca roju idzie do kosza (case galerii IK). Szkodzi przy wyszukiwaniu semantycznym bez twardego progu — system podstawia przekonujące śmieci zamiast pustki. Nie opłaca się przy małych wolumenach, gdzie człowiek i tak widzi wszystko na raz.

## Problem

Decyzje wyboru o dużym wolumenie (zdjęcie z 400 kandydatów, klasyfikacja ~100 kart briefów/mies., 109 zdjęć galerii, triage leadów, dziesiątki benchmarków) blokują się na ludzkiej przepustowości: 90% pracy to odsiew oczywistych odrzutów, a pełna automatyzacja wyboru jest nieakceptowalna, bo ostatnie 10% wymaga gustu i kontekstu — więc decyzja albo nie zapada, albo zapada losowo.

## Mechanizm działania

Podział decyzji na dwie fazy o różnej naturze: rój tanich, równoległych agentów + deterministyczny scoring (twarde reguły licencyjne, słowa-klucze, confidence, jawne wagi) wykonuje harvest i klasyfikację i zawęża przestrzeń z setek do kilku-kilkunastu kandydatów, a człowiek dostaje skompresowany, porównywalny, jednoekranowy artefakt decyzyjny (statyczna galeria HTML, posortowany inbox, karty w Figmie, scoreboard) i podejmuje wyłącznie finalny wybór. Koszt ludzkiej decyzji spada ~10× bez utraty kontroli, maszynowy odsiew jest audytowalny (confidence + uzasadnienie per obiekt), a człowiek widzi 100% przestrzeni w formie porównywalnej zamiast próbki. Kluczowy element to artefakt pośredni zbudowany pod JEDNĄ decyzję, nie sam rój.

## Warunki sukcesu

- Reguły odsiwu są jawne i audytowalne (listy słów, progi, reguły licencyjne w kodzie), klasyfikacja niesie confidence/uzasadnienie per obiekt — inaczej człowiek i tak musi wszystko sprawdzić
- Warstwa deterministycznego odsiewu działa PRZED pokazaniem człowiekowi — rój bez filtra przenosi śmieci dalej
- Widok decyzyjny jest porównawczy i jednoekranowy (galeria, posortowany inbox) — decyzja możliwa w jednym posiedzeniu
- Wyszukiwarki semantyczne filtrowane twardą regułą (nazwa w tytule) — bez tego podstawiają 'podobne' zamiast pustki; kryteria zawężania uzgodnione z decydentem

## Warunki porażki

- Brak pętli uczenia: decyzje walidacyjne Reszka nigdzie nie wracają do klasyfikatora (jawnie w missed_opportunities zdrofit-hourly) — maszyna zawęża tak samo źle za każdym razem
- Pipeline ginie w scratchpadzie zamiast stać się narzędziem — stocki-miasta trzeba będzie adaptować ręcznie przy następnym zadaniu
- Zawężenie bez progu jakości podstawia przekonujące śmieci zamiast pustki — Adobe Stock zwracał INNE miasta
- Kuratorska propozycja roju odrzucona przez klienta (galeria modułowa IK) — jeśli kryteria nie są uzgodnione z decydentem, praca idzie do kosza

## Potencjał automatyzacji

Faza 'narrow' w pełni automatyzowalna i już działa bezobsługowo (briefsync przez launchd 8:00). Największa dźwignia: dopisanie pętli uczenia (decyzje człowieka → korekta reguł/przykładów klasyfikatora) oraz spakowanie wzorca harvest→score→gallery jako jednego kanonicznego 'triage-tool' zamiast przepisywania per projekt. Decyzja człowieka celowo pozostaje ręczna.

## Transfer

Bardzo wysoki — mechanizm agnostyczny wobec domeny (zdjęcia, briefy, benchmarki, persony, leady). Dla klientów wolumenowych (Benefit ~100 briefów/mies.) bezpośrednio sprzedawalny jako pierwszy tani dowód wartości: automat nie zastępuje ich decydentów, tylko kompresuje czas decyzji (triage briefów, audyt asset library, selekcja UGC, shortlisty).

## Eksperyment · Benefit/Zdrofit

Wziąć 1 miesiąc realnych briefów z tablicy 'Przemek NOWY' (korpus briefsync), puścić rój 8–10 agentów klasyfikujących każdy brief do rodziny formatów wg SLOWNIK_FORMATOW.md z confidence i uzasadnieniem, wygenerować galerię triage i dać Reszkowi/Natalii do walidacji. Zmierzyć: (a) zgodność klasyfikacji roju z decyzją człowieka (%), (b) czas walidacji miesiąca briefów przez galerię vs dotychczasowy przegląd Trello, (c) odsetek briefów 'nietypowych' odsianych do ręcznej ścieżki, (d) czas decyzji człowieka per karta.

**Czego się dowiemy:** Trzy liczby, których dziś nie ma: accuracy klasyfikatora na realnym strumieniu, realny poziom automatyzowalności wolumenu Zdrofit i czas decyzji per karta — razem policzalny business case automatyzacji do sprzedania klientowi 49% przychodu oraz brakująca bramka wejściowa hourly pipeline.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Negative Knowledge Ledger  `mech:negative-knowledge-ledger`
**Status:** emerging · **Kategoria:** Knowledge Compounding · **Dowody:** 4 (measurement: 0, postmortem: 0, narracja: 4) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'tego nie robimy, bo kiedyś nie wyszło — ale nikt nie pamięta czemu', 'znowu spaliliśmy tydzień na coś, co już testowaliśmy' albo zespół diagnozuje od zera problemy, które są znanymi limitami narzędzi. Sygnał: folklor zakazów bez zapisu i recydywa znanych ślepych zaułków u różnych osób.

**Anti-context:** Nie stosować dla przypuszczeń — do ledgera trafiają tylko wyniki realnych testów, inaczej blokuje rzeczy, które mogłyby działać. Szkodzi bez dat/kontekstu: wpisy twardnieją w dogmat, choć limity środowisk są warunkowe i się zmieniają. Bez automatycznego kanału konsultacji (przed próbą, nie po porażce) ledger jest martwy.

## Problem

Organizacje zapisują to, co zadziałało, a wyniki negatywne (droga donikąd, limit środowiska, wzorzec który nie konwertuje) wyparowują — więc ten sam ślepy zaułek jest opłacany wielokrotnie, często przez różne osoby/sesje. Failure mode systemu to nie crash, lecz cicha strata czasu na znany problem.

## Mechanizm działania

Negatywny wynik testu jest traktowany jak aktywo i zapisywany z taką samą starannością jak sukces — zawsze jako para: co przetestowano i dlaczego nie działa + jaki wzorzec stosować ZAMIAST. Ledger jest konsultowany przed podjęciem próby (kanał automatyczny — auto-memory), więc koszt lekcji jest płacony raz, a zapis blokuje ponowną diagnozę od zera. Kluczowe: zapis zawiera wzorzec zastępczy, nie samo 'nie działa' — dzięki temu jest generatywny, nie tylko blokujący.

## Warunki sukcesu

- Zapis zawiera parę: negatywny wynik + wzorzec zastępczy (co robić zamiast)
- Ledger jest przeszukiwany PRZED podjęciem próby (kanał automatyczny — auto-memory), nie po porażce
- Wynik negatywny pochodzi z realnego testu, nie z przypuszczenia — inaczej ledger blokuje rzeczy, które mogłyby działać

## Warunki porażki

- Wynik negatywny bez daty/kontekstu twardnieje w dogmat — limity środowisk się zmieniają (CoinGecko 429 tylko z IP sandboxa, token Dropbox 4h — warunkowe, nie wieczne)
- Ledger nie konsultowany na początku diagnozy: limity darmowych tierów mylone z bugami własnego kodu, diagnoza 'za każdym razem od kodu zamiast od środowiska' (common_errors)
- Wiedza negatywna nietransferowana do podwykonawców — Natalia/Ada mogą opłacać lekcje, które system już ma

## Potencjał automatyzacji

Średni-wysoki: automatyczny prompt diagnozy 'najpierw sprawdź ledger środowiska' (odwraca kolejność kod→środowisko); tagowanie wpisów datą ważności i triggerem re-testu; ekstrakcja negatywnych wyników z logów sesji jako kandydatów do ledgera.

## Transfer

Bardzo wysoki i tani we wdrożeniu — każdy zespół marketingowy ma folklor 'tego nie robimy, bo kiedyś nie wyszło' bez zapisu dlaczego; sformalizowany ledger z wzorcami zastępczymi to natychmiastowa wartość. Dobrze pakuje się jako moduł Brand Hub ('co wiemy, że nie działa w naszej marce/kanałach').

## Eksperyment · BetterWorkplace/DailyFruits

Założyć jawny ledger negatywny dla ekosystemu DailyFruits/betterguide (znane pułapki: Vercel scope, GTM/Usercentrics, drift klonów repo, limity formularzy) jako plik w repo + wpis pamięci. Przez 6 tygodni logować każdy przypadek, gdy diagnoza problemu zaczęła się od trafienia w ledger vs od ponownego odkrywania. Metryka: hit-rate ledgera i szacowany czas zaoszczędzony per trafienie; dodatkowo test transferu — czy wpis w repo (nie w auto-memory) zostaje znaleziony przez świeżą sesję.

**Czego się dowiemy:** Dowiemy się, jaki odsetek incydentów na dojrzałym kliencie to recydywa znanych problemów oraz czy ledger w repo (dostępny podwykonawcom) działa równie dobrze jak auto-memory — to rozstrzyga, gdzie powinna mieszkać wiedza negatywna sprzedawana klientom.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Numeric Gates  `mech:numeric-gates`
**Status:** emerging · **Kategoria:** Decision Velocity · **Dowody:** 5 (measurement: 0, postmortem: 0, narracja: 5) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'wszystko musi przejść przeze mnie / przez naszego dyrektora kreatywnego', 'jakość zależy od tego, kto akurat sprawdza' albo 'nie wiemy, kiedy materiał jest wystarczająco dobry, żeby go wysłać'. W briefie widać wąskie gardło seniora przy akceptach, falującą jakość między kampaniami lub spory 'dobre/niedobre' bez kryteriów.

**Anti-context:** Nie stosować przy pracy czysto eksploracyjnej/one-off wizerunkowej, gdzie kryteria jakości nie są definiowalne z góry, ani gdy nie ma jak skalibrować skali na realnych przypadkach — próg na niezwalidowanej skali daje fałszywą pewność. Nie wdrażać, jeśli klient nie zgodzi się na konsekwencję bramki (blokowanie przejścia) — score bez konsumenta eroduje.

## Problem

Decyzje jakościowe w marketingu ('czy to jest dobre?', 'czy można wysłać?') są subiektywne, wolne i niedelegowalne — każda wymaga oka seniora, więc senior staje się wąskim gardłem, jakość faluje z jego dostępnością, a klient nie widzi, za co płaci. Bez progu maszyna generuje dalej mimo złej jakości, a złe leady przechodzą do wyceny.

## Mechanizm działania

Zamiana oceny 'wygląda dobrze' na twardy próg liczbowy na zdefiniowanej skali, wpięty PRZED przejściem do następnego etapu (faza, proposal, publikacja). Decyzja 'dalej/wróć' zapada automatycznie i natychmiast, bo kryterium jest policzalne, nie negocjowalne: artefakt poniżej progu nie ma prawa iść dalej, pętla poprawek kręci się bez człowieka (generator+Critic), człowiek widzi tylko rzeczy powyżej progu. Działa podwójnie: operacyjnie — jakość staje się właściwością systemu, nie sesji; handlowo — bramka z checklistą jest pokazywalna klientowi i broni value-based pricing. Wariant behawioralny: scoreboardy 1–10000 z zasadą 'oceny rosną tylko za dowiezione akcje'. Najmocniejszy wariant: Brand Lock — marka jest 'skończona' dopiero, gdy AI generuje z .brand/ materiał on-brand ≥85/100.

## Warunki sukcesu

- Skala i próg zdefiniowane PRZED generacją, skalibrowane na realnych przypadkach (Critic strojony na prawdziwym briefie TeamBudget), nie wymyślone
- Walidator jest skryptem/endpointem/pętlą — wynik jest odtwarzalny i może odpalić go ktokolwiek, nie tylko autor
- Bramka jest wpięta strukturalnie w przepływ i ma konsekwencję (blokuje przejście), nie jest raportem do przeczytania
- Edge case'y mają zdefiniowany wynik z góry (brief <50 znaków → score null z powodem)

## Warunki porażki

- Walidator istnieje tylko jako prompt/praktyka sesyjna — bramka F2 frameworku wciąż ręczna: 'governance przez metrykę istnieje jako praktyka, nie jako maszyna'; próg bez egzekucji eroduje
- Score bez konsumenta — re-oceny scoreboardów (TeamBudget, wegobold, Caterelo) zależą od pamięci Przemka zamiast automatu czasowego
- Zero walidacji samej skali — cała kwalifikacja MACS oparta na założeniach, nie danych; próg liczbowy na niezwalidowanej skali daje fałszywą pewność
- Dwa silniki scoringu briefów, które się nie widzą (readiness.ts vs llm-auditor) — próg przestaje być jednym źródłem prawdy o jakości

## Potencjał automatyzacji

Bardzo wysoki i częściowo zrealizowany: pętla Critica w r3loop działa E2E na produkcji, alignment score liczy się przy submit z cache. Brakujące kroki: zamiana bramki F2 (Brand Lock) z promptu na skrypt CI (wzorzec istnieje — brand-check.mjs w FitStyle) oraz cron re-ocen scoreboardów, żeby odpiąć bramki od pamięci Przemka.

## Transfer

Rdzeń oferty r352 i najgłębsze IP systemu wg meta_insights — odróżnia firmę od agencji bardziej niż deliverables. Każda organizacja z przepływem brief→kreacja→akcept może dostać progi zamiast opinii (alignment score dla Benefit, Brand Lock dla każdego Brand Huba). Warunek: dla każdej nowej domeny trzeba zaprojektować rubrykę deterministyczną, inaczej gate degeneruje do 'LLM oceń'.

## Eksperyment · Benefit/Zdrofit (Narzędzie do briefowania)

Back-test alignment score na nieużytym korpusie 39 realnych briefów z 8 tablic briefsync: policzyć score dla każdego historycznego briefu i zestawić z faktycznym przebiegiem (ile rund feedbacku w Trello, czy był odsyłany, lead time do akceptu). Policzyć korelację score ↔ liczba rund poprawek; próg skalibrować tak, by bramka 'wymaga poprawy' łapała briefy, które realnie wróciły.

**Czego się dowiemy:** Dowiemy się, czy alignment score przewiduje realny koszt obsługi briefu ZANIM walidator go zobaczy (twardy dowód sprzedażowy dla pilota 20 lokalizacji i pricingu 50–100k PLN: 'score poniżej X = średnio N dodatkowych rund'), czy tylko dubluje intuicję walidatora. W obu wypadkach kończy się stan 'próg na niezwalidowanej skali' i dostajemy skalibrowany próg zamiast wymyślonego.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Open Tool Exchange  `mech:open-tool-exchange`
**Status:** emerging · **Kategoria:** Funnel Mechanics · **Dowody:** 4 (measurement: 0, postmortem: 0, narracja: 4) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi: 'zbieramy leady przez raport za formularz i nic z nich nie ma', 'mamy dużo pobrań, zero rozmów handlowych', albo planuje gated content. Sygnał: KPI ustawione na liczbę leadów zamiast na pipeline; oferta da się przełożyć na kalkulator/audyt z natychmiastowym wynikiem.

**Anti-context:** Nie stosować, gdy jedyną akceptowaną metryką klienta jest liczba leadów (mechanizm celowo ją obniża na rzecz jakości), gdy oferta nie daje się przełożyć na natychmiastowy, konkretny wynik (narzędzie-wydmuszka niszczy zaufanie), ani gdy nie ma czym personalizować — personalizacja za kontakt musi być realnie cenniejsza niż wynik ogólny.

## Problem

Bramkowanie treści za e-mail (gated PDF, raporty za formularz) daje niską jakość kontaktów, lewe adresy i zero pipeline'u — przetestowane empirycznie w kampaniach, to wynik, nie hipoteza. Jednocześnie firma nadal potrzebuje mechanizmu zamiany zainteresowania w kontakt.

## Mechanizm działania

Odwrócenie wymiany wartości: treść jest w pełni otwarta (dystrybucja > capture, pixel retargetingu od dnia pierwszego), a obok stoi narzędzie interaktywne, które daje wynik NATYCHMIAST i bez formularza (kalkulator, audyt online, katalog z filtrami). Kontakt zbierany jest wyłącznie w zamian za personalizację wyniku (np. spersonalizowany benchmark), więc zostawia go tylko ktoś realnie zaangażowany. Rozliczenie kosztem kontaktu zakwalifikowanego do sprzedaży, nie liczbą leadów.

## Warunki sukcesu

- Narzędzie daje kompletny, użyteczny wynik bez podawania jakichkolwiek danych
- Personalizacja za kontakt jest realnie cenniejsza niż wynik ogólny (inaczej nikt nie zostawi adresu)
- Retargeting pixel od dnia 1 na otwartej treści — capture przenosi się z formularza na audiencję
- KPI = koszt kontaktu zakwalifikowanego, nie liczba leadów

## Warunki porażki

- Powrót do bramki 'bo mało leadów' — liczba leadów rośnie, pipeline dalej zero (dokładnie ten wynik już zmierzono)
- Narzędzie-wydmuszka: wynik zbyt ogólny, żeby był wart użycia, więc nie buduje ani zaufania, ani audiencji
- Materiały pisane żargonem (ABM, MQL/SQL) zamiast po polsku — feedback Reszka: rozpisywać 'dotarcie celowane', 'kontakt zakwalifikowany'

## Potencjał automatyzacji

Wysoki: kalkulatory i audyty online to komponenty wielokrotnego użytku na wspólnych tokenach; generowanie spersonalizowanego benchmarku (strona wyniku, nie PDF) da się zautomatyzować z jednego szablonu + dane wejściowe użytkownika.

## Transfer

Uniwersalny dla wszystkich klientów-laboratoriów B2B i B2C-do-niszy: TeamBudget (kalkulator → audyt), r352 (Diagnostic jako płatna wersja tego samego ruchu), DailyFruits (kalkulatory ofertowe), FitStyle (dobór karnetu).

## Eksperyment · FitStyle

Zbudować na silniku narzędzie 'Dobierz karnet w 30 sekund' (3 pytania: jak często / które strefy / jedno miasto czy sieć) z wynikiem i ceną od razu, bez formularza; opcjonalny krok 'wyślij mi moje porównanie + kod na darmową wizytę' za e-mail. Porównać z obecną ścieżką /kup: udział sesji docierających do buy-pass oraz jakość kontaktów (ile e-maili konwertuje na wizytę/karnet) vs historyczne wyniki formularzy.

**Czego się dowiemy:** Czy 'wynik najpierw, kontakt za personalizację' działa też w B2C low-ticket (dotąd dowód jest z B2B) — oraz jaka część użytkowników narzędzia w ogóle chce personalizacji, co kalibruje, gdzie stawiać próg kontaktu w innych wdrożeniach.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Presale Demand Ledger  `mech:presale-demand-ledger`
**Status:** emerging · **Kategoria:** Funnel Mechanics · **Dowody:** 2 (measurement: 0, postmortem: 0, narracja: 2) · **Rekomendacja:** test-first

**Trigger:** Klient mówi: 'otwieramy nowy klub/lokalizację za X miesięcy', 'produkt będzie gotowy na jesień', 'marketing odpalimy na otwarcie'. Cechy problemu: produkt/lokalizacja jeszcze nie istnieje, a lokalny popyt przepada; decyzje o kolejności otwarć/skali premiery podejmowane bez danych.

**Anti-context:** Nie stosować, gdy data otwarcia jest wysoce niepewna (obietnica pierwszeństwa bez daty pali zaufanie), gdy nie ma backendu do zbierania zapisów (formularz bez endpointu = front bez księgi), ani gdy klient chce mieszać CTA nieistniejącego produktu z istniejącym — uczciwość obietnicy jest sednem mechanizmu.

## Problem

Produkt lub lokalizacja jeszcze nie istnieje (klub w budowie, produkt przed premierą), a popyt w tym czasie przepada — marketing rusza dopiero na otwarcie, gdy koszt pozyskania jest najwyższy, a pierwszeństwo nie ma już wartości.

## Mechanizm działania

Zanim istnieje produkt, stawiasz dedykowany landing przechwytujący popyt na obietnicę pierwszeństwa, nie zniżki (motywacja persony Marcin z FitStyle: '48 godzin przed resztą miasta', data otwarcia, nazwa miasta w nagłówku). Lista zapisów staje się księgą popytu: mierzalnym dowodem zainteresowania per lokalizacja, który steruje decyzjami (kolejność otwarć, skala premiery). Kluczowa uczciwość mechanizmu: nie obiecywać niczego, czego nie ma (na landingu przedsprzedażowym FitStyle celowo NIE ma CTA darmowej wizyty, bo klubu jeszcze nie ma). Domknięcie = tiery founding members i countdown otwierające okno sprzedaży przed otwarciem fizycznym.

## Warunki sukcesu

- Obietnica oparta o pierwszeństwo i konkret (data, nazwa miasta w H1), nie o rabat
- Landing nie obiecuje niczego, co nie istnieje — brak CTA produktowych z 'normalnego' lejka
- Zapisy/sesje mierzone per lokalizacja i traktowane jako dane decyzyjne (gdzie otwierać, jak skalować premierę)
- Zdefiniowane domknięcie: co dostaje lista, gdy produkt startuje (okno 48h, tier founding)

## Warunki porażki

- Formularz bez wpiętego endpointu — front gotowy, ale zapisy nie trafiają nigdzie (stan FitStyle przed wpięciem backendu: ENDPOINT pusty = tryb prototypu)
- Mieszanie CTA nieistniejącego produktu z istniejącym (obiecanie darmowej wizyty w klubie, którego nie ma) — pali zaufanie na starcie relacji
- Lista zebrana, ale brak zaprojektowanego momentu konwersji listy → sprzedaż; zapis zostaje martwym kontaktem jak leady z gated contentu

## Potencjał automatyzacji

Wysoki: nowe miasto = nowy plik JSON w silniku location-as-data; countdown i tiery jako komponenty szablonu; automatyczne raportowanie zapisy/sesje per miasto do decyzji o otwarciach.

## Transfer

Każdy klient z fizyczną ekspansją lub premierą produktu: sieci fitness na GymManagerze (produkt powtarzalny), Archicom (przedsprzedaż inwestycji deweloperskiej to ten sam mechanizm), premiery produktowe BetterWorkplace.

## Eksperyment · FitStyle

Wpiąć backend leadów (GetResponse) i uruchomić fazę B na Rybniku: dwa warianty landingu — A: sama lista zapisów, B: lista + tiery founding z countdownem do otwarcia. Ruch z lokalnej reklamy dzielony 50/50, po otwarciu klubu mierzymy konwersję listy na karnet w oknie 48h pierwszeństwa.

**Czego się dowiemy:** Czy pierwszeństwo (tier + countdown) realnie podnosi zapisy/sesje i — ważniejsze — konwersję listy na płacących w dniu otwarcia; jaki procent księgi popytu monetyzuje się w karnety, czyli ile naprawdę warta jest jedna pozycja na liście.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Proof-First Demo Pitch  `mech:proof-first-demo-pitch`
**Status:** emerging · **Kategoria:** Funnel Mechanics · **Dowody:** 4 (measurement: 0, postmortem: 0, narracja: 4) · **Rekomendacja:** use-with-care

**Trigger:** Sytuacja sprzedażowa: prospekt ze słabą istniejącą obecnością online (fundacja, klinika, sieć lokalna), sceptyczny wobec obietnic ('agencje już nam obiecywały'), albo rozmowa schodzi na cenę zamiast wartości. Sygnał: klient ma publiczne dane (strona, cennik, katalog), z których da się tanio zbudować działające demo przed jakąkolwiek umową.

**Anti-context:** Nie stosować, gdy koszt demo wymyka się proporcji (lekcja: nie odpalać wielkich workflowów do drobiazgów), gdy nie ma realnych danych klienta do postawienia demo (generyczne demo nie dowodzi niczego), ani gdy demo prowadziłoby do one-offa zamiast systemu — demo ma sprzedawać mechanizm. Ryzyko: klient traktuje pokaz jako darmową przysługę, jeśli nie towarzyszy mu wycena.

## Problem

Sprzedaż usługi/systemu na obietnicę (deck, oferta PDF) wymaga od klienta wyobrażenia sobie rezultatu i zaufania na kredyt — a przy sprzedaży mechanizmów (nie rezultatów) to najsłabszy możliwy dowód. Cykl decyzyjny się wydłuża, rozmowa schodzi na cenę zamiast na wartość.

## Mechanizm działania

Zamiast oferty klient dostaje działający artefakt zbudowany na jego realnych danych PRZED zakupem: demo, w które można kliknąć, z jego treścią, jego problemami rozwiązanymi. Pitch zmienia się z 'zrobimy' na 'zrobiliśmy — kupujesz produkcjonizację'. Demo pełni podwójną rolę: dowód kompetencji i specyfikacja zakresu (wycena odnosi się do konkretu, który klient już widział, remanent demo→produkcja zamiast estymaty z powietrza). Kluczowy detal percepcyjny: usunąć z demo wszystko, co sygnalizuje 'wersję pokazową' (belka demo ARToffNII usunięta — zastrzeżenia mówić ustnie).

## Warunki sukcesu

- Demo stoi na REALNYCH danych klienta (scraping, mirror, audyt) — generyczne demo nie dowodzi niczego
- Zakres demo świadomie ucięty i nazwany: co celowo NIE jest zrobione (wysyłka formularzy, analityka) trafia do wyceny jako delta demo→produkcja
- Demo obudowane liczbami do pitchu (waga strony, liczba stron, pokrycie katalogu 1:1)
- Koszt produkcji demo drastycznie obniżony przez własne silniki (location-as-data, jedno źródło → generowane widoki) — inaczej ekonomia spec worku się nie spina

## Warunki porażki

- **[z Trial #001, decyzja właściciela 08.08.2026]** Pokazanie pełnego demo PRZED wyceną osłabia negocjację cenową: klient widzi artefakt „gotowy" i wycenia domknięcie zamiast wartości. Moment ujawnienia demo musi być decyzją negocjacyjną właściciela (rozłożenie w czasie, tradycyjna wycena etapów najpierw) — nie automatycznym krokiem procesu.
- Demo bez ścieżki do decyzji: artefakt zachwyca, ale nie ma przy nim wyceny i remanentu — klient traktuje pokaz jako darmową przysługę
- Spalanie zasobów na spec work poza wszelką proporcją (lekcja campnou: 3,3 mln tokenów na drobiazgi; 'nie odpalać wielkich workflowów do drobiazgów')
- Demo na nieaktualnych/niepełnych danych — u ARToffNII audyt person wykrył braki (9 grup Pryzmatu), które przed pokazem trzeba było łatać; błąd w danych klienta na jego własnym demo niszczy cały efekt
- Kolizja z anty-wzorcem z operating strategy: one-off, który nie prowadzi do systemu — demo musi sprzedawać mechanizm, nie pojedynczą stronę

## Potencjał automatyzacji

Wysoki i rosnący: mirror/scraping starej strony agentem w tle, baza danych z ekstrakcji, generacja widoków z jednego źródła — realny koszt demo spada do 1–2 dni, co zmienia spec work z hazardu w powtarzalny kanał sprzedaży.

## Transfer

Główny mechanizm otwierania nowych klientów r352 (front door obok płatnego Diagnostic): każda sprzedaż systemu do organizacji z istniejącą, słabą obecnością online (fundacje, kliniki, sieci lokalne); wariant partnerski = widget dla właściciela audiencji (9campnou).

## Eksperyment · ARToffNIA (żywy pitch w toku) + FitStyle jako replika

Domknąć pomiar na ARToffNII: wynik pitchu (zamknięcie, pakiet, negocjacja od WYCENA.md) + godziny spalone na demo = realny CAC spec worku. Równolegle replika mechanizmu: użyć prototypu Rybnika jako demo w rozmowie z drugą siecią na GymManagerze ('to działa dla FitStyle, wasza wersja = podmiana danych') i zmierzyć, czy demo cudzej sieci skraca cykl decyzyjny.

**Czego się dowiemy:** Ekonomia jednostkowa demo-as-pitch (koszt demo vs wartość i konwersja pitchu) oraz czy demo zbudowane dla klienta A działa jako dowód dla klienta B z tej samej kategorii — jeśli tak, silnik location-as-data zamienia spec work jednorazowy w odnawialny aktyw sprzedażowy.

## Version
- v3 · 2026-08-08 — nowy warunek porażki z Trial #001 (decyzja właściciela: demo-przed-wyceną zbija wycenę); confidence BEZ zmiany (to korekta wiedzy, nie postmortem).
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Sandbox Promotion  `mech:sandbox-promotion`
**Status:** emerging · **Kategoria:** AI Governance · **Dowody:** 5 (measurement: 0, postmortem: 0, narracja: 5) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'boimy się wpuścić AI/automat do naszych plików', 'kto odpowiada, jak automat coś zepsuje na produkcji?' albo wymaga, żeby każda zmiana szła przez ludzki nadzór. Sygnał w briefie: automatyzacja ma dotykać żywych zasobów klienta (Trello, Figma, live site), a zaufanie jest krytycznym aktywem relacji.

**Anti-context:** Nie stosować, gdy istnieją lub muszą istnieć boczne drzwi do produkcji (ręczne deploye obok gita) — druga ścieżka unieważnia bramkę. Nie ma sensu przy trywialnych, odwracalnych zmianach, gdzie narzut sandboxa spowalnia bez redukcji ryzyka. Uwaga: sandbox bez działającego kanału promocji staje się cmentarzem wersji i zabija throughput.

## Problem

AI i automaty pracujące bezpośrednio w produkcyjnych zasobach klienta (tablice Trello, pliki Figma, live site) mogą jednym błędem zniszczyć zaufanie, które jest realnym aktywem (Benefit = 49% przychodu). Organizacje reagują spowalnianiem wszystkiego do tempa ludzkiego nadzoru — albo ryzykują incydent zabijający zaufanie do automatyzacji. Zakaz 'nie ruszaj produkcji' trzymany w pamięci sesyjnej nie przetrwa rotacji sesji.

## Mechanizm działania

Governance jest wpisane w STRUKTURĘ przestrzeni roboczej, nie w pamięć, prompt ani dyscyplinę: generacja i eksperymenty dzieją się wyłącznie w jawnie nazwanej, strukturalnie oddzielonej przestrzeni (plik 'DO WALIDACJI', osobna strona REBRAND, kopia robocza, /index2 z noindex, osobna gałąź), zasoby klienta są twardo read-only zakodowane w skryptach, a jedyną ścieżką do produkcji jest osobny, wyłącznie ludzki akt promocji. To rozdziela prędkość od ryzyka: AI może iterować agresywnie i tanio, bo nieodwracalność została skoncentrowana w jednym tanim akcie decyzji człowieka — odwaga automatyzacji jest kupowana architekturą, nie ostrożnością. Skutek uboczny: feedback klienta przychodzi na kompletny, działający draft, nie na opis — pętla jest szybsza i konkretniejsza.

## Warunki sukcesu

- Granica sandbox/produkcja jest fizyczna i widoczna w nazwie i strukturze (inny plik, inna strona, inny URL, noindex, flaga) — nowa sesja AI ani podwykonawca nie mogą jej nie zauważyć
- Read-only wobec własności klienta zakodowane w skrypcie, nie zapamiętane
- Jedna jawna, tania ścieżka promocji (akcept → git push / rename / przełącznik), bez bocznych drzwi — inaczej sandbox staje się cmentarzem wersji
- Draft jest kompletny i klikalny — feedback dotyczy rzeczy, nie wyobrażenia rzeczy

## Warunki porażki

- Boczne drzwi deployu łamią bramkę: vercel --prod z lokalnego drzewa cofany przez auto-deploy (bees-knees), betterguide deployowany poza gitem — dwie ścieżki do produkcji unieważniają bramkę (najczęstszy błąd systemowy wg common_errors)
- Sandbox bez kanału promocji zabija throughput — hourly pipeline miesiąc po zdefiniowaniu celu nie wystartował nawet w trybie ręcznego batcha: bezpieczeństwo jest, przepływu nie ma
- Dwa klony/podobne pliki bez wskazania kanonu (przeterminowany klon DailyFruits, stary tyl.svg kuboty, plik design-system Osady) — sandbox bez jasnego 'który jest prawdziwy' produkuje pracę na złej wersji
- Mechanizm trzyma się tylko tam, gdzie jest strukturalny, pada tam, gdzie jest dyscypliną (pilot frameworku nieskommitowany mimo 'git od dnia 1')

## Potencjał automatyzacji

Wysoki po stronie generacji (cała może być automatyczna, bo błąd nic nie kosztuje) i egzekucji granicy (linter/hook odrzucający zapis poza sandboxem, scaffold sandboxa jednym poleceniem w bin/nowy-klient.sh, drift guard live-vs-repo). Akt promocji celowo NIE do automatyzacji — to punkt, w którym człowiek sprzedaje odpowiedzialność.

## Transfer

Uniwersalna odpowiedź na główny lęk każdej organizacji przed wpuszczeniem AI do produkcji: 'wasze narzędzia pozostają nietknięte, automat pracuje w strefie walidacji, promujecie jednym kliknięciem'. Warunek wejścia automatyzacji do korporacji typu Benefit czy Sonova; działa w Figmie, repo, CMS i Trello — niezależnie od stacku.

## Eksperyment · Benefit/Zdrofit (hourly pipeline)

Uruchomić pipeline w trybie pilotażu ręcznego (batch 1×/dzień — świadomie poniżej ambicji 'hourly', bo pętla miesiąc po definicji nie wystartowała): przez 10 dni roboczych automat klasyfikuje nowe karty i generuje wstępne kreacje WYŁĄCZNIE dla rodzin szablonowych w pliku 'DO WALIDACJI'. Mierzyć dziennie: % briefów zaklasyfikowanych do rodzin, % kreacji zaakceptowanych bez zmian / z drobnymi zmianami / odrzuconych, czas walidacji per kreacja, liczbę prób dotknięcia produkcji (musi być 0).

**Czego się dowiemy:** Dowiemy się, jaki realny odsetek wolumenu ~100 briefów/mies. automat obsługuje na akceptowalnym poziomie (dziś czysta hipoteza — pętla nigdy nie wystartowała), czy wąskim gardłem staje się przepustowość walidacji człowieka, i czy bramka strukturalna wytrzymuje realny wolumen — to wprost wycenia wartość automatyzacji przed rozmową o skalowaniu.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Session-to-SOP Compounding  `mech:session-to-sop`
**Status:** emerging · **Kategoria:** Creative Memory · **Dowody:** 5 (measurement: 0, postmortem: 0, narracja: 5) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'wszystko jest w głowie Kasi', 'jak odeszła agencja, zaczynaliśmy od zera' albo 'za każdym razem odkrywamy to samo'. Sygnał: powtarzalne procedury (publikacje, rozliczenia, kampanie) rekonstruowane od zera po rotacji ludzi/sesji, umowy ustne bez zapisu, wiedza operacyjna bez kanału dystrybucji.

**Anti-context:** Nie stosować dla pracy jednorazowej, która się nie powtórzy — kodyfikacja się nie zwróci. Szkodzi, gdy SOP-y nie są aktualizowane po odchyleniach (martwy SOP gorszy niż brak) albo gdy trafiają do wiki, którą trzeba otworzyć — bez automatycznego kanału compounding nie działa. Pamiętać: SOP przechowuje 'jak', nie odpala 'kiedy' — kadencja wymaga osobnego mechanizmu.

## Problem

Praca agentowa jest sesyjna: wiedza operacyjna wypracowana w sesji (procedury, obejścia techniczne, ustalenia z klientem, umowy ustne, timing dropdownów Medium) domyślnie umiera z końcem sesji — każda kolejna sesja AI lub osoba płaci ten sam koszt odkrywania od zera.

## Mechanizm działania

Każda sesja, która wypracowała powtarzalną procedurę, kończy się destylacją ustaleń do wpisu w auto-memory jako GOTOWEJ, wykonawczej procedury (SOP: kroki, parametry, zapytania, znane pułapki), nie notatki. Następna sesja startuje z instrukcją zamiast rekonstruować kontekst, bo auto-memory ładuje się automatycznie do każdej sesji — SOP ma gwarantowany kanał dystrybucji, i to kanał czyni compounding (wiki, którą trzeba otworzyć, nie działa). Koszt kodyfikacji (~minuty) jest o rząd wielkości niższy niż koszt ponownego odkrycia. Efekt uboczny: auto-memory stało się de facto systemem operacyjnym firmy — żyją w nim umowy ustne (telefoniczny deadline Archicom), umowy społeczne (rozliczenie Ady 'nie kwestionować') i reguły stylu pracy (verify-first).

## Warunki sukcesu

- Wpis ma formę wykonawczej procedury (kroki, parametry, zapytania, timingi, znane pułapki), nie streszczenia sesji — wykonywalny przez sesję bez kontekstu
- Istnieje automatyczny kanał dystrybucji — pamięć ładuje się do każdej sesji bez decyzji człowieka
- Utrwalane są też wyniki negatywne i granice ('czego nie robić': Trello read-only, nie kwestionować metody Ady)
- SOP jest aktualizowany po każdym odchyleniu od procedury (żywy, nie archiwalny) — martwy SOP jest gorszy niż brak SOP-u

## Warunki porażki

- Pojedynczy punkt awarii: auto-memory poza gitem, bez backupu — firma sprzedająca 'jedno źródło prawdy w repo' trzyma własne źródło prawdy w pamięci sesyjnej AI (meta_insight)
- Brak dostępu dla podwykonawców — SOP-y widzi tylko Claude+Reszek; Natalia i Ada mogą opłacać lekcje, które system już ma
- Wiedza krytyczna biznesowo (umowy ustne, deadline'y) istnieje wyłącznie w pamięci — sporna w razie konfliktu z klientem
- SOP nie egzekwuje kadencji: procedura Medium deterministyczna, ale środowa publikacja zależy od pamięci Przemka — pamięć przechowuje 'jak', nie odpala 'kiedy'

## Potencjał automatyzacji

Wysoki na trzech frontach: (1) hook końca sesji generujący kandydata na SOP-deltę do zatwierdzenia, (2) automatyczny backup auto-memory do prywatnego repo git (usuwa główny failure mode), (3) promocja SOP-ów tekstowych do artefaktów wykonywalnych wg progu użycia — SOP użyty 3× powinien stać się kodem; plus eksport podzbioru SOP-ów do formatu czytelnego dla podwykonawców.

## Transfer

Bardzo wysoki — rdzeń oferty 'Brand Hub / jedno źródło prawdy' przeniesiony na procesy: 'pamięć organizacyjna marketingu' (SOP-y kampanii, gotchas narzędzi, decyzje brandowe przeżywające rotację ludzi i agencji). Warunek transferu: kanał musi być automatyczny i dostępny dla całego zespołu, nie tylko dla jednego duetu człowiek-AI.

## Eksperyment · Benefit/Zdrofit

Test transferu SOP na drugiego wykonawcę: wybrać jedną skodyfikowaną procedurę (SLOWNIK_FORMATOW.md + zasady brand.json Zdrofit), dać ją świeżej sesji AI bez żadnego kontekstu historycznego i zlecić klasyfikację 20 nowych briefów do rodzin formatów. Porównać z klasyfikacją sesji 'z pamięcią' oraz z decyzją Reszka. Zmierzyć: zgodność (%), liczbę pytań doprecyzowujących świeżej sesji (= dziury w SOP), czas od startu do pierwszej produktywnej akcji.

**Czego się dowiemy:** Dowiemy się, czy pamięć organizacyjna r352 jest przenośna (warunek oddania pracy podwykonawcom i sprzedania jej jako produkt), czy działa tylko w symbiozie z kontekstem sesyjnym Przemka — a lista pytań świeżej sesji da konkretną mapę dziur do załatania w SOP-ach.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Single-Source Compiler  `mech:single-source-compiler`
**Status:** emerging · **Kategoria:** Brand Consistency · **Dowody:** 7 (measurement: 0, postmortem: 0, narracja: 7) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'mamy trzy wersje brandbooka i każda inna', 'zmiana ceny/logo to tydzień poprawek we wszystkich materiałach' albo 'agencja robi po swojemu, strona po swojemu'. W briefie widać tę samą treść/zasady żyjące w wielu artefaktach naraz (brand book, strona, oferta, katalog) i błędy spójności wykrywane dopiero u odbiorcy.

**Anti-context:** Nie stosować dla jednorazowych kreacji bez powtórzeń — setup generatora się nie zwróci. Szkodzi, gdy zespół klienta będzie i tak ręcznie edytował outputy (regeneracja musi być tańsza niż ręczna poprawka, inaczej źródło przestaje być jedyne) albo gdy nie ma nikogo, kto utrzyma generator po wdrożeniu.

## Problem

Ta sama treść i te same zasady marki żyją w wielu artefaktach naraz (brand book, CSS, dokument dla AI, oferta, deck, katalog, umowa) i dryfują niezależnie przy każdej zmianie — koszt aktualizacji rośnie liniowo z liczbą widoków, a błędy typu 'trzy niezharmonizowane limonki' czy ceny CATS w trzech miejscach są niewidoczne do momentu wpadki u klienta.

## Mechanizm działania

Jedno maszynowo-czytelne źródło (tokens.json / JSON danych / plik treści) + mini-generator (~100 linii build.py/build.js/generate-tokens.mjs) kompilujący z niego WSZYSTKIE widoki naraz: CSS dla strony, YAML w AGENT.md dla AI, design-system.html dla ludzi, komplet dokumentów, komplet formatów. Spójność jest produktem kompilacji, nie czujności: zmiana parametru przelicza cały zestaw, koszt zmiany spada z O(liczba widoków) do O(1), a rozjazd danych staje się strukturalnie niemożliwy. Kluczowe: widok dla AI jest równoprawnym targetem kompilacji — AI produkuje z tego samego źródła co CSS.

## Warunki sukcesu

- Źródło jest naprawdę jedyne — żadna wartość nie jest zdublowana ręcznie w widoku, żaden widok (w tym dla ludzi i dla AI) nie jest edytowany ręcznie
- Generacja jest wpięta w normalny workflow (auto przed dev/build), więc nie da się o niej zapomnieć; drift guard w buildzie/CI, nie w prośbie w prompcie
- Generator jest trywialnie mały i trzymany w repo projektu, nie w scratchpadzie sesji
- Regeneracja jest tańsza niż ręczna poprawka jednego widoku — inaczej ludzie edytują output

## Warunki porażki

- Widok utrzymywany ręcznie obok źródła — brand-centre.html vs tokens.json (dwie reprezentacje równolegle, jawnie nazwany gap); ceny CATS w katalogu i 2 kalkulatorach
- Konfiguracja zduplikowana między plikami — MODULES niespójne między cms.html a _config.js we frameworku
- Wzorzec przepisywany od zera ~7 razy zamiast jednego kanonicznego mini-SSG (nazwane w DNA jako 'kandydat nr 1'); generatory giną w scratchpadach
- Guard istnieje u klientów, ale nie u siebie — 'u klientów CI blokujące, u siebie dyscyplina sesyjna'

## Potencjał automatyzacji

Bardzo wysoki — mechanizm z natury automatyczny, praktycznie zerowy udział człowieka po wdrożeniu. Brakujące elementy: ekstrakcja jednego kanonicznego mini-SSG r352 (dane→widoki, --check, lista widoków w configu) + scaffold w bin/nowy-klient.sh, domknięcie pętli u siebie (brand-centre.html generowany z tokens.json), CI regenerujące widoki przy commicie źródła.

## Transfer

Rdzeń oferty Brand Hub, sprzedawalny każdemu klientowi z wieloma wykonawcami/kanałami: 'twoje materiały są kompilowane, nie rysowane'. Transfer zwalidowany daleko poza designem: geometria druku (Zdrofit Łodygowa), umowy (dane.py→3 umowy), treść (build.js DailyFruits) — to generalny wzorzec 'źródło→widoki'.

## Eksperyment · Benefit/Zdrofit

Wziąć jedną rodzinę szablonową briefów z wolumenu ~100/mies. (np. grafiki otwarcia klubu / oferty lokalne), zbudować jedno źródło danych kampanii (JSON: klub, daty, ceny, CTA) i compiler generujący komplet formatów ze słownika formatów briefsync. Zmierzyć na 10 kolejnych realnych briefach: czas brief→komplet kreacji do walidacji oraz liczbę błędów spójności (data/cena/nazwa klubu) vs baseline ręczny. Równolegle: brand-check na 'BS Fitness — Biblioteka Produkcyjna v1' raportujący wartości spoza brand.json (baseline dryfu).

**Czego się dowiemy:** Dowiemy się, jaki procent wolumenu Benefit jest 'kompilowany' (szablonowy) vs wymaga kreacji, ile realnego dryfu jest w produkcji ręcznej, i czy compiler redukuje czas o rząd wielkości — twarde dane do wyceny pilotażu narzędzia do briefowania i decyzji o budowie kanonicznego mini-SSG.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Split URL Architecture  `mech:split-url-architecture`
**Status:** emerging · **Kategoria:** Funnel Mechanics · **Dowody:** 3 (measurement: 0, postmortem: 0, narracja: 3) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi: 'nasze strony kategorii spadły po dodaniu filtrów/parametrów', 'chcemy linkować reklamy prosto w konkretny stan strony', 'ktoś przy sprzątaniu skasował stare URL-e i spadł organic'. Cechy problemu: serwis obsługuje jednocześnie katalog (SEO) i kampanie (deep-linki), a jeden system adresów próbuje robić obie rzeczy.

**Anti-context:** Nie stosować w małych serwisach bez kampanii segmentowych (jeden system adresów wystarcza), ani tam, gdzie nikt nie będzie egzekwował spisanej granicy między systemami — niedokumentowany rozdział prowadzi wprost do failure mode 'skasowano właściwe strony kategorii'. Ostrożnie, gdy brak dostępu do konfiguracji redirectów platformy.

## Problem

Jeden system adresów URL próbuje obsłużyć dwa sprzeczne cele: pozycjonowanie (wymaga stron unikalnych, indeksowalnych, stabilnych) i wygodę użytkownika/kampanii (wymaga głębokich linków w dowolny stan interfejsu). Skutek: deep-linki kanibalizują strony SEO albo strony SEO usztywniają UX — a przy sprzątaniu ktoś kasuje 'martwe URL-e', które były właściwymi stronami kategorii.

## Mechanizm działania

Dwa jawnie rozdzielone systemy adresów o różnych rolach: (A) strony standalone SEO — unikalna treść, self-canonical, w sitemapie, podlinkowane sitewide, nigdy nie usuwane; (B) deep-linki UX/kampanijne — parametry lub rewrite do wspólnego huba, canonical skonsolidowany do huba, NIGDY w sitemapie. Ruch płatny i nawigacyjny lata deep-linkami (idealne trafienie w intencję), organic wchodzi stronami standalone; granica między systemami jest udokumentowana, więc nikt ich nie myli przy utrzymaniu.

## Warunki sukcesu

- Granica systemów spisana i egzekwowana: co jest w sitemapie, a co nigdy; co ma self-canonical, a co konsoliduje do huba
- Deep-linki są tanie w tworzeniu (parametr, nie strona) — każda kreacja kampanii może dostać własny
- Zmiany odwracalne i zlokalizowane (konsolidacja canonical DailyFruits = 1 linia)
- Weryfikacja redirectów właściwym narzędziem (curl -L, bo urllib nie podąża za 308 — fałszywe alarmy)

## Warunki porażki

- Uznanie stron standalone za martwe URL-e i próba ich usunięcia/przekierowania (omal wydarzyło się na DailyFruits — strony zwracały 200 i niosły organic)
- Deep-linki z self-canonical trafiają do indeksu i kanibalizują strony kategorii (stan DailyFruits przed commitem f41dccf)
- Segment kampanijny bez indeksowalnego domu: 5 kategorii net-new DailyFruits ma tylko deep-linki, więc po konsolidacji canonical nie ma żadnej strony zbierającej organic
- Kolejność reguł platformy ignorowana (redirecty Vercela biegną PRZED filesystemem; trailingSlash zdejmowany PRZED customowymi redirectami) — lejek psuje się na poziomie infrastruktury, nie treści

## Potencjał automatyzacji

Wysoki: strony standalone generowane z tego samego źródła danych co deep-linki (build.js / silnik Astro) — decyzja 'segment dostaje stronę SEO czy tylko deep-link' staje się flagą w danych; audyt spójności (sitemap vs canonical vs rewrite) skryptowalny.

## Transfer

Każdy serwis z katalogiem i kampaniami jednocześnie: FitStyle (zajęcia i miasta), DailyFruits (kategorie oferty), ARToffNIA (zajęcia/grupy), docelowo standardowy rozdział w każdym wdrożeniu silnika LP.

## Eksperyment · DailyFruits

Zbudować 5 brakujących stron standalone (kawa, kanapki, salatki, catering, integracyjne) na szablonie istniejących 11, zostawiając deep-linki UX bez zmian. Mierzyć w GSC per para (standalone vs deep-link tej samej kategorii): indeksację, wejścia organic i brak ponownej kanibalizacji; porównać kategorie 'z domem' vs okres, gdy miały tylko deep-link.

**Czego się dowiemy:** Ile organicznego popytu traci kategoria pozbawiona strony standalone (delta wejść po dodaniu domu) — czyli twarda wycena reguły 'każdy segment kampanijny musi mieć indeksowalny dom', którą można przenosić do FitStyle i kolejnych wdrożeń jako standard architektury.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Storefront QR Bridge  `mech:storefront-qr-bridge`
**Status:** emerging · **Kategoria:** Funnel Mechanics · **Dowody:** 2 (measurement: 0, postmortem: 0, narracja: 2) · **Rekomendacja:** test-first

**Trigger:** Klient mówi: 'oklejamy witrynę nowego klubu', 'robimy event w mieście', 'ludzie przechodzą obok, ale nic z tego nie mamy'. Cechy problemu: fizyczny punkt styku generujący lokalną uwagę (witryna w budowie, event, biuro sprzedaży) bez żadnego śladu mierzalnego.

**Anti-context:** Nie stosować, gdy QR miałby prowadzić na ogólną stronę główną bez kontekstu lokalizacji (skan niemierzalny i nietrafiony), gdy nie ma wpływu na finalny wydruk i montaż (fizyka skanowania: wysokość, bryty — offline nie wybacza błędów), ani gdy nośnik nie może obiecać niczego spójnego z tym, co landing daje.

## Problem

Fizyczne punkty styku (witryna klubu w budowie, event w parku) generują realną lokalną uwagę, ale ta uwaga nie zostawia śladu — przechodzień zobaczył i poszedł, popyt jest niemierzalny i nieprzechwycony.

## Mechanizm działania

Nośnik offline dostaje jedno zadanie konwersyjne: przenieść przechodnia do mierzalnego lejka online przez QR prowadzący do dedykowanej strony (nie home). Mechanizm ma twarde rzemiosło wykonania, bo offline nie wybacza błędów: QR generowany z korekcją H i weryfikowany moduł po module na finalnym renderze, środek kodu ~110–120 cm nad podłogą (70 cm = za nisko do skanowania), kod nigdy na styku brytów wydruku. Komunikat na nośniku = zapowiedź + pierwszeństwo ('tu powstaje nowy klub'), czyli offline'owa wersja przedsprzedaży.

## Warunki sukcesu

- QR celuje w dedykowany landing z parametrem źródła, nie w stronę główną — inaczej skan jest niemierzalny i nietrafiony
- Fizyka skanowania sprawdzona na finalnym wydruku (wysokość, rozmiar, ciągłość kodu), nie w makiecie
- Treść nośnika obiecuje pierwszeństwo/zapowiedź spójną z tym, co landing faktycznie daje

## Warunki porażki

- QR umieszczony za nisko (pierwsza wersja Łodygowej: 70 cm — poniżej wygodnej wysokości skanowania) lub przecięty na styku brytów — zero skanów mimo poprawnego projektu
- Wymiary z wiadomości klienta różne od rysunku technicznego (na Łodygowej ~2 mm na dwóch szybach) — projekt bez weryfikacji z rysunkiem nie domyka się na montażu
- QR prowadzi do ogólnej strony bez kontekstu lokalizacji — przechodzień z Targówka ląduje na home sieci i wypada

## Potencjał automatyzacji

Średnio-wysoki: artboardy generowane z HTML (obiekt COPY + BOARDS, skala 1 cm = 10 px, render.sh → PNG 1:1, potnij.py na bryty) — nowa lokalizacja to podmiana danych; generacja i weryfikacja QR skryptowa (segno + porównanie moduł po module).

## Transfer

Sieci otwierające fizyczne lokalizacje: FitStyle (6 klubów w pipeline = 6 witryn do oklejenia z QR→/przedsprzedaz/{miasto}), Zdrofit/Benefit (wzorzec już powtórzony Poznań→Warszawa), Archicom (biura sprzedaży inwestycji).

## Eksperyment · FitStyle

Przy najbliższym klubie z pipeline'u: oklejenie witryny wg zasad Zdrofit (QR z korekcją H, środek 110–120 cm, weryfikacja na renderze) prowadzące do /przedsprzedaz/{miasto}?src=witryna. Mierzymy skany (wejścia z parametrem), konwersję skan→zapis oraz udział witryny w całej liście przedsprzedażowej vs reklama online w tym samym mieście.

**Czego się dowiemy:** Jaki procent księgi popytu przedsprzedażowego generuje sama witryna (medium darmowe, bo i tak trzeba ją zakleić) vs płatna reklama lokalna — czyli czy most offline→online powinien być standardowym elementem pakietu otwarcia każdej lokalizacji.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + bez zmiany confidence.
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

### Working-Artifact Extraction  `mech:working-artifact-extraction`
**Status:** emerging · **Kategoria:** Asset Reuse · **Dowody:** 6 (measurement: 0, postmortem: 0, narracja: 6) · **Rekomendacja:** use-with-care

**Trigger:** Klient mówi 'mamy brandbook, ale nikt go nie używa / materiały i tak wychodzą off-brand', 'ta kampania zadziałała, chcemy więcej takich' albo planuje warsztaty brandowe od zera mimo istniejących, zaakceptowanych realizacji. Sygnał: formalne wytyczne rozjeżdżają się z tym, co realnie przeszło akceptację.

**Anti-context:** Nie stosować dla marek od zera — nie ma artefaktu do ekstrakcji, tam najpierw spec work wytwarza pierwszy artefakt. Ryzykowne, gdy nie wiadomo, który artefakt jest kanoniczny (przeterminowane klony) — ekstrakcja z niewłaściwej wersji utrwala błąd. Nie kończyć na notatce: destylat, który nie ląduje w repo/bibliotece, umiera.

## Problem

Szablony, brandbooki i systemy projektowane 'od zera na sucho' (z deklaracji, teorii, warsztatów) rozjeżdżają się z rzeczywistością produkcyjną: nie przewidują realnych przypadków, produkują materiały formalnie zgodne, ale odbierane jako off-brand, i wymagają kosztownych iteracji — a jednocześnie praca już raz wykonana i zweryfikowana jest marnowana przy każdym nowym wdrożeniu.

## Mechanizm działania

Źródłem szablonu/systemu/destylatu marki jest ZAWSZE działający, zaakceptowany artefakt — nigdy czysta kartka. System destyluje wzorzec z wdrożenia, które przeszło akceptację klienta lub rynku (konkretna kreacja, żywa strona, funkcjonujące umowy), destylat kończy się maszynowym formatem (tokens.json, szablon w repo, scaffold typu bin/nowy-klient.sh), a wnioski z każdego kolejnego użycia wracają commitem do źródła. Szablon jest poprawny w dniu narodzin, bo każda jego decyzja została już raz obroniona w produkcji — ekstrakcja przenosi akceptację na wszystkie pochodne i eliminuje negocjacje estetyczne. Deklaracje (formalne zmienne Figmy, brandbooki) są hipotezą do zweryfikowania wobec artefaktu, nie odwrotnie.

## Warunki sukcesu

- Artefakt źródłowy przeszedł realną akceptację (klient, rynek, produkcja) zanim zaczęła się ekstrakcja
- Ekstrakcja kończy się maszynowym destylatem (tokens.json / szablon w repo / .brand), nie obserwacją w głowie ani notatką
- Destylacja oddziela rdzeń od konfiguracji (co jest wzorcem, co parametrem per klient); drugi deployment traktowany jako test przenośności z budżetem na uogólnienie
- Istnieje pętla powrotna: wnioski z kolejnego użycia wracają commitem do źródła; rozbieżność deklaracje vs artefakt jest jawnie nazwana klientowi — to samo w sobie jest wartością sprzedażową

## Warunki porażki

- Destylat ląduje tylko w pamięci sesyjnej AI zamiast w repo/bibliotece — tokeny Archicom istnieją jako notatka w auto-memory, nie jako opublikowana biblioteka Figma
- Destylat utrzymywany ręcznie obok źródła dryfuje (brand-centre.html obok tokens.json); artefakt źródłowy sam jest przeterminowany — ekstrakcja z niewłaściwego klonu utrwala błąd
- Artefakt referencyjny ginie (źródłowe dokumenty Osady Orle na nieistniejącym już Desktopie) — ekstrakcja bez archiwizacji wejść jest jednorazowa
- Wzorce używane ≥4 razy nigdy nie wyekstrahowane (bramka hasłowa client-side — 4 niezależne implementacje); własne projekty łamią zasadę narzucaną klientom (pilot frameworku nieskommitowany)

## Potencjał automatyzacji

Wysoki dla warstwy technicznej: subagenty ekstrakcyjne przetestowane we frameworku (Sonnet do szablonów P0), agent może zdejmować palety/typografię/spacing z URL-a lub Figmy do tokens.json. Do zbudowania: trigger 'projekt zakończony+zaakceptowany → uruchom ekstrakcję kandydatów' jako bramka zamknięcia projektu + drift guard destylat-vs-źródło. Nieautomatyzowalny pozostaje wybór artefaktu referencyjnego — osąd 'co klient naprawdę zaakceptował'.

## Transfer

To mechanizm-matka Brand Hub OS: sprzedawany deliverable 'repo per klient' jest dokładnie wynikiem ekstrakcji. Działa dla dewelopera (Archicom), sieci fitness (FitStyle), kawiarni (Lumo) i własnej marki. Sprzedawalne jako proces: 'wasz brandbook to destylat najlepszych zaakceptowanych kampanii, odświeżany po każdej realizacji', zamiast dokumentu-deklaracji co 3 lata. Ograniczenie: dla marek od zera mechanizm nie startuje — tam wchodzi spec work jako wytworzenie pierwszego artefaktu.

## Eksperyment · Archicom

Prezenter Przystań Reymonta (deadline 10.08): przed produkcją wykonać formalną ekstrakcję brandu z KV inwestycji (3 linie z KV jako artefakt referencyjny) do mini-tokens.json opublikowanego jako biblioteka w pliku Figma — zamiast pracy z notatki pamięci. Po dowiezieniu: ekstrakcja szablonu prezentera inwestycji (struktura 8 sekcji, motyw z KV, tokeny) jako reużywalnego komponentu. Przy następnej inwestycji zbudować prezenter z szablonu. Zmierzyć: liczbę uwag brandowych Marty w 1. rundzie vs projekty z pamięci, czas produkcji vs Reymonta, ile elementów szablonu wymagało zmiany (rdzeń vs konfiguracja).

**Czego się dowiemy:** Dowiemy się, czy sformalizowanie destylatu (biblioteka zamiast notatki) redukuje rundy poprawek u wymagającego klienta korporacyjnego, jaki jest realny mnożnik czasowy ekstrakcji na powtarzalnym deliverable'u i gdzie przebiega granica rdzeń/parametr — bezpośredni materiał dowodowy do sprzedaży Brand Hub jako procesu, nie repozytorium.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).

---

## 🔬 Eksperymenty (proposed)

- **Test: Agent-as-Runtime** [Benefit/Zdrofit] — Rozciąć pipeline briefsync Trello→Figma na dwie warstwy i zmierzyć granicę: przenieść wszystko, co się da, na Figma REST API z PAT (tworzenie plików/stron, upload obrazów), zostawiając agenta wyłącznie dla operacji niedostępnych w REST. Przez 2 tygod…
- **Test: Agent-Facing Distribution** [BetterWorkplace/DailyFruits] — Opublikować na dailyfruits.pl llms.txt + maszynowy indeks oferty (katalog CATS/programy w JSON, generowany przez istniejący build.js z tego samego źródła co strona — zero duplikacji danych). Przez 6–8 tygodni mierzyć w logach Vercela ruch po user-age…
- **Test: Compounding Channel** [BetterWorkplace/DailyFruits] — Wyekstrahować jeden kanoniczny mini-SSG (najczęściej przepisywany wzorzec: źródło danych → wiele widoków HTML) do repo r352-framework + wpis w auto-memory ze ścieżką i minimalnym README. Następny projekt generatywny w ekosystemie BW (np. kolejne narz…
- **Test: Dated Commitment Gates** [BetterWorkplace (TeamBudget)] — Domknąć pętlę, której dziś brakuje: MVP istnieje, ale nie ma bramki popytowej. Ustawić na najbliższym kroku sprzedażowym pełną bramkę datową na piśmie: data + liczbowy warunek wykonania (np. wysyłka do 30 decydentów; GO = ≥5 umówionych demo, STOP = a…
- **Test: Design-as-Code** [Benefit/Zdrofit] — Przy najbliższym otwarciu klubu wykonać oklejenie witryn WYŁĄCZNIE przez zmianę configu (BOARDS + COPY + wymiary witryn nowej lokalizacji) w kodzie z Łodygowej, bez otwierania narzędzia graficznego. Zmierzyć: czas od otrzymania wymiarów do plików pro…
- **Test: Deterministic Spine** [Benefit/Zdrofit (Narzędzie do briefowania)] — Wykorzystać nieużyty korpus 39 realnych briefów z briefsync: przepuścić każdy brief przez trzy konfiguracje (sam policy-engine / +Haiku reasoning / +Sonnet semantic alignment), a wyniki ocenić w ślepym teście przez Reszka i Natalię (użyteczność dla w…
- **Test: Format Dictionary** [Sonova/Geers] — Test transferu słownika na drugiego klienta wolumenowego: wziąć historyczne karty z tablicy Geers/Sonova w briefsync (dane już zebrane), zbudować z nich słownik formatów metodą ze Zdrofitu i zmierzyć: (a) jaki % briefów Geers klasyfikuje się do skońc…
- **Test: Incident-to-Guard Codification** [Benefit/Zdrofit] — W przygotowywanym hourly pipeline wprowadzić pętlę: każda kreacja odrzucona przez Reszka w walidacji dostaje przyczynę z zamkniętej listy, a każda przyczyna występująca ≥2 razy MUSI zostać zamieniona w regułę klasyfikatora/pre-check przed generacją (…
- **Test: Location-as-Data Funnels** [FitStyle] — Uruchomić kampanię lokalną w 3 miastach z listy przedsprzedażowej jednocześnie, wyłącznie kosztem dodania plików JSON (bez pracy projektowej). Zmierzyć: czas uruchomienia miasta (cel: <1 dzień), rozrzut konwersji zapisy/sesje między miastami przy ide…
- **Test: Location-as-Data** [Benefit/Zdrofit (pilot Narzędzia do briefowania, 20 lokalizacji)] — Zbudować rejestr 20 klubów pilotażowych jako klub-config (nazwa+fleksja, adres, godziny, brand assety, kanały) i przepuścić przez niego jeden realny cykl kampanii lokalnej. Zmierzyć: ile pól configu wystarczyło (kompletność schematu), ile briefów z c…
- **Test: Machine Narrows, Human Picks** [Benefit/Zdrofit] — Wziąć 1 miesiąc realnych briefów z tablicy 'Przemek NOWY' (korpus briefsync), puścić rój 8–10 agentów klasyfikujących każdy brief do rodziny formatów wg SLOWNIK_FORMATOW.md z confidence i uzasadnieniem, wygenerować galerię triage i dać Reszkowi/Natal…
- **Test: Negative Knowledge Ledger** [BetterWorkplace/DailyFruits] — Założyć jawny ledger negatywny dla ekosystemu DailyFruits/betterguide (znane pułapki: Vercel scope, GTM/Usercentrics, drift klonów repo, limity formularzy) jako plik w repo + wpis pamięci. Przez 6 tygodni logować każdy przypadek, gdy diagnoza problem…
- **Test: Numeric Gates** [Benefit/Zdrofit (Narzędzie do briefowania)] — Back-test alignment score na nieużytym korpusie 39 realnych briefów z 8 tablic briefsync: policzyć score dla każdego historycznego briefu i zestawić z faktycznym przebiegiem (ile rund feedbacku w Trello, czy był odsyłany, lead time do akceptu). Polic…
- **Test: Open Tool Exchange** [FitStyle] — Zbudować na silniku narzędzie 'Dobierz karnet w 30 sekund' (3 pytania: jak często / które strefy / jedno miasto czy sieć) z wynikiem i ceną od razu, bez formularza; opcjonalny krok 'wyślij mi moje porównanie + kod na darmową wizytę' za e-mail. Porówn…
- **Test: Presale Demand Ledger** [FitStyle] — Wpiąć backend leadów (GetResponse) i uruchomić fazę B na Rybniku: dwa warianty landingu — A: sama lista zapisów, B: lista + tiery founding z countdownem do otwarcia. Ruch z lokalnej reklamy dzielony 50/50, po otwarciu klubu mierzymy konwersję listy n…
- **Test: Proof-First Demo Pitch** [ARToffNIA (żywy pitch w toku) + FitStyle jako replika] — Domknąć pomiar na ARToffNII: wynik pitchu (zamknięcie, pakiet, negocjacja od WYCENA.md) + godziny spalone na demo = realny CAC spec worku. Równolegle replika mechanizmu: użyć prototypu Rybnika jako demo w rozmowie z drugą siecią na GymManagerze ('to …
- **Test: Sandbox Promotion** [Benefit/Zdrofit (hourly pipeline)] — Uruchomić pipeline w trybie pilotażu ręcznego (batch 1×/dzień — świadomie poniżej ambicji 'hourly', bo pętla miesiąc po definicji nie wystartowała): przez 10 dni roboczych automat klasyfikuje nowe karty i generuje wstępne kreacje WYŁĄCZNIE dla rodzin…
- **Test: Session-to-SOP Compounding** [Benefit/Zdrofit] — Test transferu SOP na drugiego wykonawcę: wybrać jedną skodyfikowaną procedurę (SLOWNIK_FORMATOW.md + zasady brand.json Zdrofit), dać ją świeżej sesji AI bez żadnego kontekstu historycznego i zlecić klasyfikację 20 nowych briefów do rodzin formatów. …
- **Test: Single-Source Compiler** [Benefit/Zdrofit] — Wziąć jedną rodzinę szablonową briefów z wolumenu ~100/mies. (np. grafiki otwarcia klubu / oferty lokalne), zbudować jedno źródło danych kampanii (JSON: klub, daty, ceny, CTA) i compiler generujący komplet formatów ze słownika formatów briefsync. Zmi…
- **Test: Split URL Architecture** [DailyFruits] — Zbudować 5 brakujących stron standalone (kawa, kanapki, salatki, catering, integracyjne) na szablonie istniejących 11, zostawiając deep-linki UX bez zmian. Mierzyć w GSC per para (standalone vs deep-link tej samej kategorii): indeksację, wejścia orga…
- **Test: Storefront QR Bridge** [FitStyle] — Przy najbliższym klubie z pipeline'u: oklejenie witryny wg zasad Zdrofit (QR z korekcją H, środek 110–120 cm, weryfikacja na renderze) prowadzące do /przedsprzedaz/{miasto}?src=witryna. Mierzymy skany (wejścia z parametrem), konwersję skan→zapis oraz…
- **Test: Working-Artifact Extraction** [Archicom] — Prezenter Przystań Reymonta (deadline 10.08): przed produkcją wykonać formalną ekstrakcję brandu z KV inwestycji (3 linie z KV jako artefakt referencyjny) do mini-tokens.json opublikowanego jako biblioteka w pliku Figma — zamiast pracy z notatki pami…

## Decyzje (Ledger of record)

### Wysyłka oferty ARToffNIA (demo + propozycja rozmowy)  `dec:2026-08-08-artoffnia-send`
**Status:** decided · **Wybór:** nie wysyłaj w tej formie — etapowa wycena tradycyjna najpierw

## Rozstrzygnięcie (Przemek, 08.08)

**NIE wysyłamy w tej formie.** Powód: pokazanie pełnego demo przed wyceną WPŁYWA NA WYCENĘ — klient widzi rzecz „gotową" i wycenia domknięcie, nie wartość. Plan zmieniony: wysyłka rozłożona w czasie; najpierw tradycyjna wycena poszczególnych etapów, ujawnianie demo później, w kontrolowanym momencie negocjacji.

**Czego system nie wiedział przed startem:** kontekstu negocjacyjnego wyceny — Router dobrał proof-first-demo-pitch poprawnie wobec swojej karty, ale karta nie znała tego warunku porażki. To jest pierwsza realna lekcja Trial #001.

choice: nie wysyłaj w tej formie; etapowa wycena tradycyjna najpierw

### Akceptacja ontologii Data Foundation (z 4 korektami) + downgrade proven  `dec:2026-08-08-data-foundation`
**Status:** decided · **Wybór:** przyjąć z korektami

## Uzasadnienie (CEO)

„To jest właściwy koszt epistemiczny. Nie chronimy wcześniejszych ocen systemu.”

## Korekty

1. `proven` → `validated` (proven sugeruje prawdę zamkniętą; przy decay nic nie jest udowodnione na zawsze).
2. Fakt obejmuje zdarzenia wewnętrzne: `knowledge.corrected` / `knowledge.reclassified` / `ontology.changed` — nikt nie poprawia rzeczywistości po cichu.
3. Signal first-class tylko z cyklem życia observed→investigated→linked|dismissed; powiadomienie = Event.
4. +3 niezmienniki: no evidence without provenance · no prediction without resolution · no confidence double-counting.

## Konsekwencja

Downgrade 16 kart proven→emerging (cały Evidence = narracja ze skanu; brak measurement/postmortem). Freeze obowiązuje: żadnych nowych obiektów ani silników bez potrzeby wykazanej danymi.

## Następny test systemu

Pierwszy realny przebieg: Decision → Event → Evidence → Knowledge Update.

### Integracja Genome×FOTRA: dane tak, interfejsy nie  `dec:2026-08-08-genome-fotra-integracja`
**Status:** decided · **Wybór:** integracja na poziomie danych; fuzja interfejsów bez sensu

## Uzasadnienie

FOTRA = kokpit dnia, Genome OS = mózg firmy — różne pytania, różne rytmy. Fuzja UI odtworzyłaby chorobę „magazynu widoków" (audyt FOTRA). Zasada 10 lat: interfejsy tanieją, dane drożeją.

## Zakres (pierwsze pozycje F1, wejście PO werdykcie z 3 triali)

1. **Jedno źródło danych:** build.js emituje jedno `genome-data.js`; FOTRA System czyta graf z niego; w `fotra-kg-data.js` zostaje tylko warstwa operacyjna (radar, azymut). Likwiduje 3. i 4. kopię prawdy (aksjomat 5).
2. **Tablica 4 wskaźników w FOTRA Daily** (build już liczy — `dist/METRICS.md`).
3. **Most nawigacyjny:** zakładka System = podgląd (azymut+radar+tablica) + przycisk „otwórz Genome OS".

## Warunek

Freeze obowiązuje — realizacja po 3 trialach, chyba że CEO jawnie wyjmie pojedynczy szew (najtańszy: tablica w Daily).

### Plan 90 dni: dowody przed architekturą  `dec:2026-08-08-plan-90-dni`
**Status:** decided · **Wybór:** dowody: 3 triale → 2 klientów baseline→delta → 1 produkt → dopiero F1

## Plan (dyspozycja CEO 08.08.2026)

**Etap 1 (2–4 tyg.):** 3 pełne Triale na realnych projektach. Po każdym trzy pytania: czy Router przewidział właściwe mechanizmy? czy Genome zmienił wiedzę na podstawie Evidence? czy kolejny projekt był dzięki temu lepszy? Do 3 przebiegów — zero rozwoju architektury.

**Etap 2 (1–2 mies.):** 2 klientów-laboratoriów z baseline→delta. Sprzedajemy REZULTAT, nie Genome.

**Etap 3:** jeden produkt, jedna cena, jedna obietnica (kandydaci: Router Assessment / Governance Audit / Mechanism Report / Creative Decision Audit) — sprzedawalny niezależnie od czasu Przemka.

**Etap 4:** powrót do F1 dopiero po: 3 trialach + 2 klientach z wynikami + pierwszych zmianach confidence z Evidence + pierwszych benchmarkach.

**Tablica 4 wskaźników** (liczona przez build z Ledgera, dist/METRICS.md): triale zakończone → 3 · mechanizmy zweryfikowane Evidence → rośnie · śr. iteracji/projekt → maleje · czas brief→decyzja → maleje.

**Pytanie dnia (zastępuje „co jeszcze mogę zbudować?"):** jaki jest najmniejszy eksperyment, który zwiększy nasze zaufanie do Genome? Walutą są DOWODY.

---

## 🧪 Projekty (49)

- **Współpraca z Adą (podwykonawca kreacji) + ewidencja czasu ze Slacka** [archived] — Rzetelne, akceptowane przez obie strony rozliczanie godzin podwykonawcy bez dedykowanego narzędzia; ręczne liczenie ze Slacka jest żmudne i podatne na błędy (za…
- **Prezenter inwestycji Przystań Reymonta** [archived] — Klientka potrzebuje prezenterа 'dokładnie takiego samego jak dla Bulwaru': minimalistycznego, w 100% w brandingu, z motywem 3 linii z KV — przy czym część mater…
- **System tokenów Archicom + rebrand folderu atrium NOWY SZCZEPIN** [archived] — Folder miał starą stylistykę (zieleń/earthy + Montserrat), a formalny zestaw zmiennych Figmy nie odpowiadał realnej palecie marki — prawdziwy styl trzeba było w…
- **ARToffNIA — demo serwisu z katalogiem zajęć (oferta sprzedażowa)** [archived] — Obecna strona (Squarespace): nawigacja 27 linkami tekstowymi, martwy grafik PDF z 2022, zapisy w trybie 'odezwiemy się', rabaty (−20%/−50%) zakopane w cenniku —…
- **Oferta ARToffNIA (Genome Trial #001)** [routed] — 
- **Bartech — animacje (3 warianty 1080p)** [archived] — Nieznany — brak briefu i notatek w źródłach.…
- **bees-knees.pl — serwis + CMS + panel leadów (klient produkcyjny)** [archived] — Klient zgłaszał 'brak konwersji' (realnie: formularz nie strzelał żadnym eventem) i chciał przeglądać leady jak WPForms Entries — na statycznym hostingu bez baz…
- **betterguide.pl — hub ekosystemu BetterWorkplace** [archived] — Materiały strategiczne dla klienta były rozproszone — potrzebne było jedno miejsce z bramką na wejściu i publicznymi podstronami do podsyłania konkretnych dokum…
- **briefsync — router feedbacku Trello↔Figma↔Dropbox + most do Obsidiana** [archived] — Feedback klientów żyje w komentarzach Trello, produkcja w Figmie, gotowe pliki na Dropboxie — ręczne przenoszenie briefów, komentarzy i załączników między trzem…
- **Dashboard cykli halvingowych BTC** [archived] — Każde pytanie o cykle halvingowe wymagało ręcznej rekonstrukcji modelu (mnożniki, mediany dni, drawdowny); brak jednego miejsca z jawnymi założeniami.…
- **Tracker sentymentu BTC/ETH** [archived] — Sygnały rynkowe (Fear & Greed, ceny, funding, long/short, trending) rozproszone po wielu serwisach — sprawdzanie ich ręcznie było powtarzalną, czasochłonną czyn…
- **Camp Nou 3D — experience every seat** [archived] — Kupujący bilety nie wiedzą, jak wygląda widok z konkretnego sektora; istniejący koncept (StadiView) ma licencję PolyForm Noncommercial, więc kodu nie wolno było…
- **Caterelo — relocation engine + Deal Radar** [archived] — Osoby rozważające relokację nie mają narzędzia porównującego dziesiątki regionów w wielu krajach na spójnych danych; dodatkowo w trakcie przeglądania portali ni…
- **CMS v6 — panel /admin (git jako backend)** [archived] — Strona statyczna nie miała żadnego CMS, a stary panel parsował strukturę HTML sprzed ~389 commitów i pokazywał puste treści; klient potrzebował edycji tekstów, …
- **Consent / GTM — architektura zgód i analityki** [archived] — Strona miała zdublowany consent (własny banner + Usercentrics przez GTM), DWA kontenery GTM, trackery (LinkedIn, Amplitude, Matomo) strzelające przed zgodą i ni…
- **Katalog handlowy + kalkulatory programów (narzędzia sprzedażowe)** [archived] — Handlowcy nie mieli cyfrowego narzędzia do pracy z ofertą — istniał tylko drukowy katalog PPTX/PDF, bez możliwości interaktywnej wyceny per liczba pracowników.…
- **Relaunch dailyfruits.pl (WordPress → statyczny + Vercel)** [archived] — Stary WordPress był wolny i nieelastyczny, a migracja groziła utratą SEO — 291 starych URL-i wymagało obsłużenia; ~95 stron HTML bez systemu współdzielenia komp…
- **Architektura SEO /oferta + archiwum blogowe + performance** [archived] — Deep-linki UX kanibalizowały strony kategorii SEO, migracja omyłkowo ustawiła www jako primary (spadki w GSC/Senuto), 205 starych URL-i blogowych z arkusza SAMO…
- **DiMedical — redesign serwisu (case sprzedażowy)** [archived] — Oryginalny serwis ciężki (867 KB CSS+JS vs ~110 KB w redesignie, assety 11 MB vs 1,4 MB) i przestarzały wizualnie; potrzebny namacalny dowód jakości zamiast sla…
- **FitStyle — silnik LP przedsprzedażowych (Astro, tokens-first)** [archived] — Sieć otwiera kolejne kluby i potrzebuje szybkich, spójnych LP przedsprzedaży; twarde ograniczenie: GymManager nie ma API (tylko link/redirect do checkoutu).…
- **FOTRA — osobisty panel operacyjny (CRM + przychody + mapa potencjału)** [archived] — Dane o przychodach, relacjach i potencjale rozproszone między inFakt, Gmail i głową właściciela — brak twardego widoku, gdzie skalować, gdzie jest ryzyko i któr…
- **Geers Campaign Hub — landingi + brand voice + aplikacja** [archived] — 
- **The Post-AI Society (d. Human Commons) — wspólnota ery AI** [archived] — Teza inwestycyjna wymaga dowodu popytu: wszyscy porównywalni gracze, którzy kupili lub wzięli długi leasing nieruchomości przed walidacją (Roam, WeLive, Common,…
- **Stand KUBOTA×Baltona — wizualizacja 3D z dielinów** [archived] — Klient dostaje dieliny 2D (SVG), z których trudno ocenić bryłę standu; klasyczne rendery 3D są wolne i drogie, a generacja AI z samego tekstu halucynuje konstru…
- **LEMF 2027 — pitch deck (pipeline PPTX→Figma) + assety wizualne** [archived] — Deck istniał tylko jako PPTX (wcześniej 13 płaskich PNG w Figmie) — nieedytowalny zespołowo i niemożliwy do iterowania w narzędziu projektowym.…
- **Lumo — brand kawiarni + wizytówka opinii Google** [archived] — Pierwsza wersja karty oceniona jako 'ultra tanio' (płaskie tło, wycentrowany layout); dodatkowo logo nie da się wyciągnąć z brand boardu przez API (exportAsync …
- **Pipeline publikacji Medium (r352 Journal → Medium)** [archived] — Ręczne wklejanie artykułów na Medium gubi canonical (kara SEO za duplicate content), importer Medium psuje tekst (145 samowolnych em-dashy w jednym artykule, do…
- **META: Context vault w Obsidianie (pakiet kontekstu dla AI)** [archived] — Kontekst rozproszony po sesjach i głowie właściciela: AI bez niego proponowało rzeczy sprzeczne ze strategią (np. pozycjonowanie freelancerskie, "więcej leadów"…
- **META: Styl pracy "verify-first" (zasada operacyjna systemu)** [archived] — Audyty i zapewnienia AI bez realnej weryfikacji przeszacowywały lub myliły fakty (wadliwy algorytm konsolidacji CSS, przeoczony split hostingu .pl vs vercel.app…
- **Narzędzie do briefowania (regional.fit / Club Manager Briefing System)** [archived] — W sieciach typu Benefit/Zdrofit briefy z klubów są niekompletne, niezgodne ze strategią marki i przechodzą przez chaotyczny mailowy obieg akceptacji; walidator …
- **Brand system Osada Orle w Figmie (tryby Dzień/Noc)** [archived] — Klient miał esencję marki tylko w dokumentach strategicznych ('Karmimy ciało i duszę na izerskim szlaku', archetyp Opiekun 65%/Twórca 35%, ton na 'Ty'), ale zer…
- **Deck sponsorski Osada Orle ('Morisson') — 3 wersje + obsługa feedbacku przez API Figmy** [archived] — 46 komentarzy klienta (24 rozwiązane, 22 otwarte) rozproszonych w ciężkim pliku Figma, którego oficjalne MCP nie potrafi obsłużyć: brak czytnika komentarzy, nak…
- **Penya SaaS — onboarding penyi FC Barcelona** [archived] — Stara rekrutacja penyi = mail z danymi osobowymi (w tym numerem dowodu) + ręczny przelew i ręczna księgowość zarządu; brak samoobsługi, automatyki statusów, pan…
- **Profichem24 — rolka produktowa IG 15 s (Rigips Airless)** [archived] — Sklep potrzebuje wideo produktowego bez sesji zdjęciowej i planu filmowego — jedyne wejście to zdjęcia produktów (og:image) ze sklepu.…
- **Brand centre r352 (r352.com/brand)** [archived] — Marka rosła iteracyjnie (trzy różne limonki, maskotka, shader hero) bez jednego źródła prawdy — kod strony i decyzje wizualne dryfowały względem niespisanych za…
- **Case studies r352.com/work** [archived] — Pozycjonowanie było ostrzejsze niż publiczny dowód za nim ('the site is ahead of the proof') — case'y istniały w NDA lub bez metryk, a klienci różnie reagują na…
- **Framework produkcyjny r352 — Brand Hub OS** [archived] — Każda realizacja kliencka robiona od zera, wiedza się nie kumulowała, czas Reszka był wąskim gardłem, a klient kupował pojedyncze artefakty (logo, stronę) zamia…
- **Strategia operacyjna r352 (living doc)** [archived] — Ostre pozycjonowanie rozmywane 'agencyjnymi' zachowaniami (one-off projekty, polerowanie strony zamiast dowodu, founder jako wąskie gardło delivery) — strategia…
- **Strona r352.com** [archived] — Solo-operator sprzedający systemy premium musi wyglądać jak system: potrzebne SEO od zera (kolizja brandu 'r352' z głośnikami Monitor Audio w SERP), pełny prere…
- **r3loop.app (Briefly) — automatyzacja strategia + proposal** [archived] — 3 z 7 etapów lejka (Strategy v1, Strategy v2, Proposal) wymagały ręcznego pisania i wstrzykiwania JSON-ów do bazy przez REST; brak automatycznego generatora ozn…
- **Wiedza o źródłach stockowych (komponent infrastruktury researchu obrazów)** [archived] — Automatyczny research zdjęć rozbija się o niejawne ograniczenia źródeł: semantyczne wyszukiwarki zwracają złe miasta zamiast pustki, CDN-y blokują hotlinki (403…
- **Harvester stocków — zdjęcia 33 polskich miast** [archived] — Małe polskie miasta (Ełk, Kętrzyn, Lidzbark Warmiński...) mają uboge pokrycie w stockach, wyszukiwarki podstawiają inne miasta zamiast pustki, a część serwisów …
- **TeamBudget — strategia GTM + MVP** [archived] — TeamBudget potrzebował pełnej strategii wejścia na rynek (kategoria, persony, lejki, pozycjonowanie przez CFO zamiast benefitu) oraz materiałów zrozumiałych dla…
- **Twoje Menu — case study portfolio (plan + boardy UI)** [archived] — Case musi sprzedawać ambicję bez zmyślonych wyników: wszystko, czego nie wiemy, jawnie oznaczane jako Hipoteza — wiarygodność zamiast pustych KPI.…
- **Pakiet umów podwykonawczych (NDA + ramowa + o dzieło) jako kod** [archived] — Brak własnych wzorów umów przy rosnącej delegacji; realne ryzyka: nieważne przeniesienie praw (forma pisemna z art. 53 pr. aut.), odbiór PNG bez plików źródłowy…
- **wegobold.com — marka produktowa (repositioning + restyle)** [archived] — Dwie marki o celowo podobnych usługach trzeba rozdzielić po grupie docelowej i problemie (JTBD), nie po liście usług — tak, by właściwy kupujący sam się selekcj…
- **Kampania „Ćwicz w zieleni" — Pilates o zachodzie (Kopiec Krakusa)** [archived] — Jeden master FB 1080×1320 trzeba rozmnożyć na 10 formatów o różnych proporcjach i regułach (część bez logo, część bez napisów, newsletter z zaokrąglonymi rogami…
- **Hourly pipeline Trello→Figma (automatyzacja briefów Benefit/Zdrofit)** [archived] — 12–15 osób briefujących, mediana lead time 1 dzień; ręczne przenoszenie briefów z Trello i odtwarzanie layoutów od zera przy każdym zadaniu to główny pożeracz c…
- **Oklejenie witryn nowego klubu Zdrofit — CH Łodygowa (Warszawa Targówek)** [archived] — Nośnik wielkoformatowy z twardymi ograniczeniami fizycznymi: druk cięty na bryty wg podziału szyb (QR ani kluczowe elementy nie mogą wypaść na styku), QR musi b…

## 🤝 Klienci

- **Archicom** — —
- **Benefit Systems / Zdrofit** — 49% przychodu — ryzyko koncentracji
- **BetterWorkplace / DailyFruits** — —
- **Osada Orle / Izera** — —
- **Właściciel 9campnou.com** — Jeden kontakt = dwa projekty (Camp Nou 3D + Penya SaaS)

## Komponenty

- **CMS git-as-backend** [active] — Rodzina lekkich CMS-ów bez bazy danych: treść, kosz i historia = commity przez GitHub Git Data API (atomic multi-file commit), auth HMAC, moduły włączane flagami MODULES.
- **Dashboard starter (FOTRA-style)** [active] — Szkielet client-only dashboardów: nav-tabs + dispatch + moduły features + window.*_DATA + docs. Wyekstrahowany z FOTRA; użyty przez genome-os. Żyje jako skill `dashboard-starter` z
- **Silnik grafu wiedzy (canvas force-layout)** [active] — Interaktywny graf: symulacja sił, warstwy typów (klik = ukryj), szukajka, fit-view, klikalne relacje. Wdrożenia: artefakt Knowledge Graph → FOTRA zakładka System → genome-os. Gotch

## Reguły

- **Claude NIGDY nie wysyła niczego samodzielnie** [active] — ZAOSTRZONA 08.08.2026 (dyspozycja Przemka: „nie wysyłaj nigdy nic samemu"): Claude NIGDY nie wykonuje aktu wysyłki — maila, wiadomości, publikacji — nawet po akceptacji treści. Cla
- **Zmiana wiedzy wyłącznie przez zdarzenie** [active] — Żadna zmiana confidence/statusu bez wpisu w Ledgerze. Nawet administrator nie poprawia rzeczywistości po cichu.
- **Trello Benefit/Zdrofit wyłącznie do odczytu** [active] — Zapis wyłącznie za wyraźną zgodą Przemka w żywej sesji. Dotyczy wszystkich tablic klienckich.
- **Marka wegobold zawsze małą literą** [active] — Reguła brandowa klienta.

## Guardy

- **build.js --check jako bramka** [proposed] — Deterministyczna walidacja całego Genome (schematy, relacje, niezmienniki 1–10, hash-łańcuch Ledgera). Docelowo: pre-commit + krok w porannym tasku CKO. Status `proposed` do czasu 

## Benchmarki

- **Brand Lock ≥85/100** [active] — Bramka F2 frameworku: marka locked, gdy AI generuje on-brand z .brand/.
- **Strategy Critic ≥750/1000** [active] — Pętla generator+Critic w r3loop; poniżej progu proposal nie wychodzi.
- **Lighthouse 100/100/100/100** [active] — Zewnętrzny, niedyskutowalny benchmark techniczny (DiMedical).

## Zdolności (capabilities)

- **Skill dashboard-starter** [available] — Scaffold client-only dashboardów (init.sh).
- **Gmail MCP (read-only w automatyzacjach)** [available] — search_threads/get_thread; wysyłka tylko za zgodą.
- **Skill /mechanism-router** [available] — Raport 8 sekcji przed każdym projektem.
- **Phantom-Browser** [available] — Serverless headless browser: URL → bounding-boxy + treść (JSON).
- **Skill /project-postmortem** [available] — Learning Engine: aktualizacja Genome po projekcie.
- **Slack MCP (read-only w automatyzacjach)** [available] — search_public_and_private i odczyty.
- **Trello REST (GET-only)** [available] — Klucze w briefsync/.env; tablice w boards.json.
- **Skill /ux-domain-audit** [available] — Audyt domenowy strony (18 typów × 5 plików wiedzy).
- **Skill /ux-reverse-wireframing** [available] — Istniejąca strona → wireframy przez Phantom-Browser.
- **Skill /ux-wireframing** [available] — Lo-fi wireframy HTML od zera wg schematu.

## Agenci

- **Poranny przegląd CKO (~7:30)** [active] — Codzienny scheduled task: zmiany od wczoraj + radar Gmail/Slack/Trello + regeneracja danych FOTRA + raport 8/9 sekcji. Prompt: ~/.claude/scheduled-tasks/r352-cko-daily/SKILL.md.

---

## ⚡ Ledger — wszystkie zdarzenia

- `evt:2026-08-08-0001` **decision.decided** → dec:2026-08-08-data-foundation — Ontologia APPROVED WITH CHANGES; 4 korekty; downgrade proven bez wyjątków.
- `evt:2026-08-08-0002` **ontology.changed** → ontology/DATA-FOUNDATION-SPEC.md — proven→validated; knowledge.* events; Signal lifecycle; niezmienniki 8-10.
- `evt:2026-08-08-0003` **knowledge.reclassified** → genome — Migracja F0: karty→frontmatter, Evidence z prowieniencją (wszystkie typu narracja, źródło rec:reviews/skan-cko-2026-08-07), obiekty ontologii utworzone.
- `evt:2026-08-08-0004` **confidence.changed** → mech:numeric-gates — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0005` **confidence.changed** → mech:single-source-compiler — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0006` **confidence.changed** → mech:working-artifact-extraction — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0007` **confidence.changed** → mech:sandbox-promotion — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0008` **confidence.changed** → mech:deterministic-spine — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0009` **confidence.changed** → mech:machine-narrows-human-picks — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0010` **confidence.changed** → mech:incident-to-guard — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0011` **confidence.changed** → mech:session-to-sop — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0012` **confidence.changed** → mech:negative-knowledge-ledger — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0013` **confidence.changed** → mech:location-as-data — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0014` **confidence.changed** → mech:design-as-code — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0015` **confidence.changed** → mech:agent-as-runtime — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0016` **confidence.changed** → mech:open-tool-exchange — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0017` **confidence.changed** → mech:location-as-data-funnels — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0018` **confidence.changed** → mech:proof-first-demo-pitch — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0019` **confidence.changed** → mech:split-url-architecture — Reguła validated: brak Evidence typu measurement/postmortem.
- `evt:2026-08-08-0020` **knowledge.corrected** → proj:geers-centrum-wiedzy — Kuracja luki skanu: foldery SONOVA_BRAND_LANDINGS (geers.vercel.app: 2 LP + brand voice guide v1.0 + app flow + mailing + video rebrand).
- `evt:2026-08-08-0021` **project.routed** → proj:artoffnia-oferta — Trial #001: 4 mechanizmy dobrane, 2 odrzucone przez anti-context.
- `evt:2026-08-08-0022` **prediction.registered** → proj:artoffnia-oferta — Odpowiedź Katarzyny w wątku oferty
- `evt:2026-08-08-0023` **prediction.registered** → proj:artoffnia-oferta — Umówiona rozmowa (konkretny termin)
- `evt:2026-08-08-0024` **prediction.registered** → proj:artoffnia-oferta — Akceptacja pakietu ≥22 000 zł netto
- `evt:2026-08-08-0025` **decision.opened** → dec:2026-08-08-artoffnia-send — Draft oferty przygotowany; czeka na wybór Przemka.
- `evt:2026-08-08-0026` **knowledge.corrected** → genome — Kuracja source_path 4 projektów z folderów wskazanych przez Przemka (penya LP, kubota asset, ARToffNIA, dimedical; ~/Dimedical pusty). Bez nowych mechanizmów — freeze.
- `evt:2026-08-08-0027` **knowledge.corrected** → rule:comms-read-only — Reguła zaostrzona do formy absolutnej: Claude nigdy nie wysyła samodzielnie; wysyłka zawsze ręką Przemka.
- `evt:2026-08-08-0028` **decision.decided** → dec:2026-08-08-plan-90-dni — 90 dni: 3 triale → 2 klientów baseline→delta → 1 produkt → dopiero F1. Waluta = dowody.
- `evt:2026-08-08-0029` **decision.decided** → dec:2026-08-08-artoffnia-send — NIE wysyłamy demo-first: wpływa na wycenę. Nowy plan: etapowa, tradycyjna wycena najpierw; ujawnienie demo w kontrolowanym momencie.
- `evt:2026-08-08-0030` **knowledge.corrected** → mech:proof-first-demo-pitch — Nowy failure_condition: demo-przed-wyceną osłabia negocjację (v3 karty). Confidence bez zmiany.
- `evt:2026-08-08-0031` **prediction.resolved** → proj:artoffnia-oferta — Plan wysyłki zmienił kształt przed startem pomiaru — predykcje unieważnione (void, poza Brier). Nowe predykcje przy nowym routingu.
- `evt:2026-08-08-0032` **prediction.resolved** → proj:artoffnia-oferta — Plan wysyłki zmienił kształt przed startem pomiaru — predykcje unieważnione (void, poza Brier). Nowe predykcje przy nowym routingu.
- `evt:2026-08-08-0033` **prediction.resolved** → proj:artoffnia-oferta — Plan wysyłki zmienił kształt przed startem pomiaru — predykcje unieważnione (void, poza Brier). Nowe predykcje przy nowym routingu.
- `evt:2026-08-08-0034` **object.updated** → proj:artoffnia-oferta — Nowa ścieżka po decyzji: demo UNPUBLISHED z r352.com (commit cbc4535, źródło lokalnie); teaser kierunkowy koncepcja-kierunkowa.html (znak+kolor+głos marki+etapy, bez ujawniania got
- `evt:2026-08-08-0035` **knowledge.corrected** → proj:artoffnia-oferta — Korekta z lektury maili: watek Katarzyny = prywatny projekt (marka tlumacza, czeka na WYCENE); fundacja = Monika Sobota (call 24.07). Draft przepiety to:Monika cc:Katarzyna. Plakat
- `evt:2026-08-08-0036` **signal.observed** → proj:artoffnia-oferta — Odnaleziony pisemny zakres kampanii (mail Moniki 28.07): rolki/relacje, posty, PLAKAT A4/A3, grafiki grup na strone + kotwica cenowa 50-250 zl/szt (lokalny grafik). Monika wraca 10
- `evt:2026-08-08-0037` **prediction.registered** → proj:artoffnia-oferta — Monika odpowiada i wskazuje termin rozmowy
- `evt:2026-08-08-0038` **prediction.registered** → proj:artoffnia-oferta — Rozmowa o wycenie ODBYTA
- `evt:2026-08-08-0039` **prediction.registered** → proj:artoffnia-oferta — Akcept pakietu materiałów kampanijnych ≥4000 zł brutto
- `evt:2026-08-08-0040` **object.updated** → proj:artoffnia-oferta — Plan oferty ustabilizowany: teaser LIVE r352.com/artoffnia, finalny draft (ton pomagającego, narracja ryzyka bez gratisu, strategia-cover), wycena = Reszek w tygodniu 11-15.08. Tri
- `evt:2026-08-08-0041` **decision.decided** → dec:2026-08-08-genome-fotra-integracja — Integracja Genome x FOTRA wylacznie na poziomie danych (3 szwy do F1); fuzja interfejsow odrzucona.