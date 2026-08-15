# r352 — Raport Systemowy (pełny skan ekosystemu)

**Data skanu:** 7 sierpnia 2026 · **Zakres:** 47 projektów w 8 domenach · **Źródła:** 60 plików pamięci trwałej + foldery projektowe (`Narzedzie do briefowania/`, `Claude_zadania/`, `FrameWorkProdukty/r352-framework`, `~/Fruityyyy`)

**Metoda:** 8 równoległych agentów analitycznych (po jednym na domenę) + 3 agentów syntezy (DNA, graf wiedzy, asymetrie). Filtr każdej obserwacji: zasada *Every Project Compounds* — czy projekt zostawił wiedzę / komponent / agenta / SOP / automatyzację.

---

## 1. Meta-wnioski — jak ten system naprawdę działa

**1.** System ma dwie prędkości i jeden korek: produkcja jest tania i szybka (rama frameworku, 38 stron DiMedical, 21 slajdów LEMF, misa 55k miejsc — wszystko w dniach), ale wszystko co wymaga aktu odwagi lub kontaktu Przemka staje: cena i wysyłka case'u (zdiagnozowane wprost 03.08), demo ARToffNIA niepokazane, wtyczka bez CWS przez brak 2 zrzutów, BOOKING_URL bez affila. Prawdziwym bottleneckiem nie jest delivery tylko 'shipping do drugiego człowieka' — i żadna automatyzacja w korpusie tego nie adresuje.

**2.** 'Every Project Compounds' działa asymetrycznie: kompounduje WIEDZA (memory jako organ firmy — stock-sources, medium-pipeline, gotchas Vercela), ale nie kompounduje KOD. Skrypty giną w scratchpadach sesji (renderery LEMF, pipeline Wayback, harness testowy CMS), a ten sam wzorzec 'źródło→widoki' czy 'bramka hasłowa' jest przepisywany od zera 4–8 razy. Compounding jest tekstowy, nie wykonywalny — kolejna sesja wie JAK, ale musi zbudować CZYM.

**3.** Auto-memory Claude jest de facto systemem operacyjnym firmy: żyją w nim umowy ustne (telefoniczny deadline Archicom nieistniejący w mailach), umowa społeczna z Adą ('nie kwestionować'), SOP-y i mapy ryzyk. To pojedynczy punkt awarii poza gitem, bez backupu i bez dostępu dla podwykonawców — firma sprzedająca 'jedno źródło prawdy w repo' trzyma własne źródło prawdy w pamięci sesyjnej AI.

**4.** Dogfooding jest realną strategią produktową, ale z odwróconą dyscypliną: brand centre = żywe demo Brand Hub, vault+FOTRA = demo tezy HubForBrands, FitStyle jawnie prowadzony przez F1–F5. Jednocześnie własne projekty łamią zasady narzucane klientom: pilot frameworku nieskommitowany ('git od dnia 1'), betterguide deployowany poza gitem, Caterelo miesiącami bez remote. U klientów CI blokujące, u siebie — dyscyplina sesyjna.

**5.** Najgłębsze IP systemu to zamiana 'wygląda dobrze' na progi liczbowe: Critic 750/1000, Brand Lock 85/100, alignment score, Lighthouse 100, scoreboardy 1–10000 z bramkami datowymi, GO/STOP ≥8 depozytów. To odróżnia r352 od agencji bardziej niż jakikolwiek deliverable. Ale walidatorzy są w większości promptami, nie skryptami (bramka F2 wciąż ręczna) — governance przez metrykę istnieje jako praktyka, nie jako maszyna.

**6.** Model 'AI = mózg, podwykonawcy = ręce' ma w praktyce trzecią, przemilczaną nogę: Claude-as-runtime dla brakujących API (Medium przez DOM, komentarze Figmy przez internal API, use_figma tylko z żywym desktopem). Te pipeline'y działają wyłącznie w oknie żywej sesji — briefsync pokazuje dojrzały podział (Python+launchd tam gdzie się da, agent tylko dla Figmy), ale Medium, reformaty Zdrofit i rozliczenie Ady utknęły po agentowej stronie mimo pełnej determinizacji procedur.

**7.** Automatyzacja podąża za wolumenem, nie za strategią: najbardziej rozwinięte pipeline'y (briefsync 8 tablic, słownik formatów, hourly pipeline, ewidencja Ady) obsługują Benefit/Zdrofit — klienta stanowiącego zmierzone 49% przychodu i nazwane ryzyko koncentracji w FOTRA. System inwestuje w pogłębienie zależności, którą sam flaguje jako główne ryzyko, podczas gdy kanały dywersyfikacji (white-label w stopce, /pl hreflang, content operator-POV) stoją od miesięcy jako 'missed opportunities'.

**8.** Najdroższe błędy systemu to nie bugi, tylko ciche rozjazdy dwóch prawd: repo vs live (betterguide, DailyFruits klony), plik źródłowy vs kopia (sentiment w FOTRA), tokens.json vs ręczny HTML brand centre, MODULES w dwóch plikach, ceny CATS w trzech. Zasada verify-first powstała dokładnie z tej klasy wpadek — system nauczył się, że jego failure mode to nie crash, lecz 'wygląda ok, ale to nieaktualna wersja', i dlatego jedyną skuteczną obroną są drift guardy w buildzie (brand:check), a nie czujność w sesji.

---

## 2. Wspólne DNA projektów

### Wspólne procesy

- Ekstrakcja brandu z realnego artefaktu zamiast deklaracji → destylat tokenów → produkcja: Archicom (paleta wzięta z node'a 108:79 'bulwar północny', nie ze zmiennych Figmy), Osada Orle (PDF strategii → plik tXqtp37...), FitStyle (strona klienta → tokens.json), Lumo (brand board → hexy+mapy substytutów fontów), r352 brand centre (.brand/design-system.md). Zawsze ten sam ruch: 'źródłem prawdy o marce jest działający wzorzec, nie deklarowany system'.
- Jedno źródło danych → wiele generowanych widoków: TeamBudget (tb-body.html → build_sprint/site/mvp/board.py), ARToffNIA (zajecia.js zasila katalog+kalendarz+landingi+formularz+menu), DailyFruits (_includes + build.js na ~95 stron), umowy-podwykonawcy (dane.py+pola.py → 3 umowy w 2 formatach), zdrofit-lodygowa (COPY+BOARDS+CM=10 przelicza cały projekt), kubota (build.py z dielinów), r352-framework (tokens.json → tokens.css+YAML+design-system.html).
- Bramka jakości z twardym progiem liczbowym przed przejściem dalej: Critic ≥750/1000 blokuje proposal (r3loop), Brand Lock = test AI ≥85/100 (F2 frameworku), alignment score sortuje inbox walidatora (Narzędzie do briefowania), Lighthouse 100/100/100/100 jako benchmark sprzedażowy (DiMedical), scoreboardy 1–10000 z zasadą 'oceny rosną tylko za dowiezione akcje' (TeamBudget, wegobold, Caterelo).
- Reverse-engineering cudzego działającego rozwiązania jako punkt startu własnego: umowy podwykonawcze z 4 wzorców kontrahentów (OSOM, East Events, Walk, Kubota S.A.) z poprawionymi wadami, consent DailyFruits z konfiguracji betterworkplace.pl, CMS bees-knees jako port z DailyFruits, strategia operacyjna r352 wyprowadzona agentem Z ISTNIEJĄCEJ strony i potem korygowana faktami.
- Kopia robocza / sandbox → akceptacja człowieka → produkcja: bees-knees (/index2, /realizacje2 z noindex), Osada Orle (Morisson Copy + strona '★ NOWE SLAJDY (draft)'), Zdrofit hourly pipeline (generacja tylko w pliku 'DO WALIDACJI', nigdy w produkcyjnych), Archicom (osobna strona REBRAND, oryginał nietknięty), r352-case-studies (locked baseline IK — zmiany tylko na konkretną prośbę). Governance wpisane w strukturę plików, nie w pamięć.
- Demo/spec work budowane PRZED sprzedażą jako narzędzie ofertowe: DiMedical (38 stron, Lighthouse 100), ARToffNIA (19 stron + 52 zajęcia + wycena), TeamBudget (klikalny MVP w ramach strategii), Osada Orle design system (spec work, który skompoundował w deck Morisson), Camp Nou (widget zanim padła umowa afiliacyjna). Pitch = działający artefakt, nie prezentacja.
- Harvest → scoring/odsiew → statyczna galeria HTML do decyzji człowieka: stocki-miasta (harvest_free.py → dane.json → final_pick.py → finalna-lista.html), briefsync (klasyfikator create/feedback/skip/remove → karty w Figmie), bees-knees (10 agentów klasyfikujących 109 zdjęć z confidence). Maszyna zawęża, człowiek wybiera.
- Utrwalanie wiedzy sesyjnej jako SOP w auto-memory zamiast powtarzania ustaleń: medium-publishing-pipeline (5 kroków), ada-ewidencja-slack (zamrożona metoda rozliczeń), stock-photo-sources (mapa źródeł z negatywnymi wynikami), INSTRUKCJA-CHAT-INFAKT.md (handoff między sesjami AI), working-style-verify-first (feedback skodyfikowany w regułę), trello-read-only (zasada zakodowana jako pamięć).

### Wspólne komponenty (istniejące i do wyodrębnienia)

- Rodzina CMS 'git jako backend' — najbardziej dojrzały komponent systemu: DailyFruits /admin (v6), bees-knees (port potwierdzający przenośność na 2. markę), betterguide (najprostszy subset), szablon cms/ w r352-framework z flagami MODULES. Wspólne DNA: HMAC auth, atomic multi-file commit przez GitHub Git Data API, historia/revert za darmo, zero bazy danych.
- Rodzina mini-generatorów statycznych pisanych od zera per projekt: build.js (DailyFruits, ~100 linii), build.py (DiMedical 38 KB, kubota, umowy-podwykonawcy), build_*.py (TeamBudget), blog_generate.py (archiwum Wayback), build_final_html.py (stocki). Ten sam wzorzec przepisany ~7 razy — kandydat nr 1 na jeden kanoniczny mini-SSG r352.
- Wzorzec tokens-first: tokens.json jako jedyne źródło designu → generacja CSS/YAML/HTML (r352-framework generate-tokens.mjs, FitStyle npm run tokens przed każdym dev/build, brand-check.mjs jako drift guard). Zwalidowany na 3 projektach, sprzedawany jako rdzeń Brand Hub.
- Bramka hasłowa client-side + noindex jako standard 'nie dla przypadkowych oczu': staticrypt (brand centre), sessionStorage katalog_auth (katalog handlowy), hasło 'longtable' + sessionStorage (human-commons /investors), bramka na index betterguide. Cztery niezależne implementacje tego samego — powinna być jednym komponentem z jawnym trade-offem bezpieczeństwa.
- DWA osobne silniki oceny briefów, które się nie widzą: readiness.ts + MACS (r3loop, deterministyczne) vs policy-engine + llm-auditor z RAG na pgvector (Narzędzie do briefowania). Do tego 39 realnych briefów z briefsync jako nieużyty korpus testowy alignment score. Komponent 'brief scoring engine' powinien być jeden, wystawiony obu produktom.
- briefsync jako generyczny router Trello: klasyfikator (briefsync.py), deklaratywny boards.json z mapowaniem klientów, wzorzec 'osobny stan per konsument' (sync_state.json vs obsidian_index.json), launchd daily z nadrabianiem po uśpieniu — gotowy komponent dla każdego klienta wolumenowego, już zasila plan hourly pipeline Zdrofit.
- Nieopakowane techniki Figmowe rozproszone po sesjach: fontTools→SVG→createNodeFromSvg (arc.py, obejście braku Aptly), fetch('/api/file/<key>/comments') z zalogowanej sesji (Osada Orle — obejście braku czytnika komentarzy w MCP), upload obrazków placeholder→submitUrl→fills (briefsync), pipeline PPTX→JSON→use_figma (LEMF, 2 pełne przebiegi). Każda użyta ≥1 raz z sukcesem, żadna nie jest narzędziem.
- Wzorce frontendowe współdzielone nieformalnie: design system dashboardów krypto (sentiment-tracker ↔ btc-cyclicality — reużycie skróciło budowę drugiego), Promise.allSettled z fallbackiem 'n/d nigdy crash', wzorzec ?static=1 do screenshotów (human-commons), pills/toggle UI (campnou ↔ kubota), fonty base64 przeciw CSP artefaktów (TeamBudget, brand centre).
- Komponent 'Eksport do analizy AI' (FOTRA: stan aplikacji → .md do Downloads + schowek → sesja LLM → decyzje wracają do CRM) — zaprojektowana pętla człowiek→eksport→AI→decyzja, przenośna na każde narzędzie localStorage bez dostępu do MCP.

### Wspólne wzorce architektoniczne

- Single-file HTML bez zależności jako natywny format deliverable'u r352: campnou (~55k miejsc w jednym pliku), kubota (CSS 3D bez bibliotek), sentiment-tracker i btc-cyclicality (vanilla JS+SVG), human-commons (11 sekcji), TeamBudget hub, brand centre (font Tanker w base64), katalog handlowy, artboardy zdrofit. Świadoma architektura: zero buildu, zero utrzymania, pełna przenośność i inspektowalność dla klienta.
- 'Projekt graficzny jako kod': HTML+CSS+headless Chrome zamiast narzędzi DTP — zdrofit-lodygowa (artboardy.html + render.sh + potnij.py, druk wielkoformatowy z liniami cięcia), kubota (?plate= do renderów i2i), twojemenu (boardy 1440×1080 składane CSS-em), TeamBudget (widoki sklejane pythonem). Parametryczność (zmiana BOARDS przelicza wszystko) + weryfikacja programowa (QR moduł po module przez segno) jako przewaga nad ręcznym DTP.
- Git jako baza danych i warstwa audytu: CMS-y (treść, kosz, historia = commity), leady bees-knees na niedeployowanej gałęzi 'data' (zero PII w buildzie), Brand Hub = repo per klient jako sprzedawany deliverable, umowy jako kod z build pipeline, bramki frameworku commitowane. Wersjonowanie, diff i revert dostawane 'za darmo' zamiast budowy infrastruktury.
- Deterministyczny silnik + LLM tylko jako warstwa semantyczna z fallbackiem: Narzędzie do briefowania (policy-engine bez kosztu → ai-auditor → llm-auditor z RAG, hard cap $0.05/brief), r3loop (readiness 12 kryteriów i MACS bez LLM, generator z pętlą Critica), sentiment-tracker (regułowy klasyfikator z jawnymi wagami zamiast czarnej skrzynki). Produkt działa przy padzie API, koszty policzone z góry.
- Deklaratywna konfiguracja + jawna skala jednostkowa: BOARDS/COPY/CM=10 (zdrofit), 10 j.=1 cm (kubota), boards.json (briefsync), location-as-data z polską fleksją cityGen/cityLoc (FitStyle), cities.py ze słowami-kluczami walidacji (stocki), dane.py/pola.py (umowy). Zmiana parametru przelicza artefakt — nigdy 'przybite do pikseli'.
- Flagi jako mechanizm bezpiecznych zmian: HERO_WEBGL z opisaną ścieżką revertu (r352.com), isShadow zamiast usuwania case'ów, MODULES w CMS, migracje flagowane localStorage (fotra_people_*_20260710, idempotentne seedy), .vercelignore jako przełącznik publikacji katalogu jednym commitem. Trial/wycofanie zawsze tańsze niż rework.
- Izolacja stanu per konsument/tenant — wzorzec wykuty na realnych bugach: sync_state.json vs obsidian_index.json + BOARD_TAG po tym, jak tablice nawzajem oznaczały sobie briefy jako done (briefsync), TenantProvider z tokenami brand-* per penya (Penya SaaS), client_share_scope + RLS master-only (r3loop), rozdzielenie plik roboczy vs produkcyjny (Zdrofit).
- Claude jako runtime brakującego API: Medium bez API publikacji (TreeWalker+InputEvent w contenteditable), komentarze Figmy przez wewnętrzne API z sesji Chrome (Osada Orle), use_figma piszący tylko do aktywnego pliku desktop (briefsync — cloud świadomie odrzucony), import danych Supabase przez REST gdy SQL editor leży (Penya), sterowanie Chrome Reszka do paneli. Świadomy podział: co musi być agentowe vs co jest Pythonem pod launchd.

### Powtarzalne decyzje projektowe

- Twarda uczciwość danych jako powtarzalna decyzja projektowa: zero fabrykowanych metryk w case'ach (copy jakościowe gdy brak liczb), trendy jawnie 'modelled' z zakazem powoływania się na nieistniejące źródło OMI (Caterelo), 'social proof tylko fakty' (Penya), Hipotezy jawnie oznaczane (TwojeMenu), sekcja Log z zaplanowanym wpisem 'Abandoned' (human-commons), 'nie zmyślać liczb — puste pola = —' (FOTRA/vault, wykryty błąd Anna Kowalska).
- Read-only i non-destruktywność wobec własności klienta: Trello twardo read-only zakodowane w skryptach (Benefit/Zdrofit), rebrand na osobnej stronie z nietkniętym oryginałem (Archicom), ciężki oryginał jako read-only źródło feedbacku + kopia robocza (Morisson), locked baseline bez 'ulepszania' (case IK), generacja tylko w pliku 'DO WALIDACJI' (hourly pipeline).
- Świadome cięcie zakresu pod sprzedaż zamiast kompletności: single-tenant v1, multi-tenant po pilocie (Narzędzie do briefowania), feature freeze do pierwszej sprzedaży z jednym wyjątkiem na wnioski z realizacji (framework), docx→AI→blog odłożony na wyraźną prośbę (DailyFruits), automat tylko dla rodzin szablonowych — nietypowe dostają samą klasyfikację (Zdrofit), 'treść tak, struktura nie' w CMS.
- Deploy ręczny CLI vs auto-deploy z main — decyzja podejmowana per projekt i generująca koszty: świadomie ręczny (r3loop, Caterelo — naprawy z 07.08 czekają na deploy, human-commons, DiMedical) vs push=produkcja (DailyFruits, bees-knees, campnou); do tego twarde reguły środowiskowe: bees-knees WYŁĄCZNIE git push, betterguide WYŁĄCZNIE Reszek (scope), alias set obowiązkowy (FitStyle).
- Gated content odrzucony po teście empirycznym (lewe adresy, zero pipeline'u) → wzorzec 'treść otwarta + narzędzia z natychmiastowym wynikiem, kontakt tylko za personalizację' stosowany w TeamBudget, strategii r352 i human-commons (formularz zamiast bramki na treści).
- Hasło client-side jako świadomy, nazwany trade-off dla treści niewrażliwych: katalog handlowy (sessionStorage + noindex), betterguide (bramka tylko na spisie treści, deliverables celowo publiczne), human-commons (miękka bramka 'longtable'), brand centre (staticrypt z committed saltem). Za każdym razem ta sama kalkulacja: próg 'nie dla przypadkowych oczu', nie zabezpieczenie.
- Walidacja popytu przed wiązaniem kapitału/mocy: human-commons (bramka GO/STOP 6.11 z progami ≥8 depozytów zanim jakakolwiek nieruchomość — wbrew pierwotnemu planowi zakupu), pilot Mała Palarnia przed sprzedażą frameworku, demo ARToffNIA przed pitch'em, TeamBudget MVP jako dowód przed sprzedażą wdrożenia; kontrprzykład jawnie nazwany: Caterelo rozbudowywane bez walidacji (zero przychodu i metryk).

### Powtarzalne błędy systemowe

- Drift repo vs live / dwa klony — najczęstszy błąd systemowy: DailyFruits (2 klony, przeterminowany na Desktopie), betterguide (deploy całego folderu poza gitem — 'git kłamie'), Caterelo (git tylko lokalny + placeholder TWOJ-USER w remote do 07.08), FitStyle (repo poza gitem w katalogu rozliczeń), pilot frameworku w ~/Klienci nieskommitowany (łamie własną zasadę 'git od dnia 1'), bees-knees (vercel --prod z lokalnego drzewa cofany przez auto-deploy), kubota (przeterminowany tyl.svg na Desktopie).
- Fonty niedostępne w środowisku wykonania — ten sam bloker rozwiązywany za każdym razem inaczej: Aptly w Figma MCP (loadFontAsync fail → fontTools→SVG), Georgia/Arial w LEMF (mapa zamienników PT Serif/Inter), Pretty Var w pliku Archicom (spadek do Inter), TT Commons/SF Mono w Lumo (Hanken Grotesk/Space Mono, mono bez polskich znaków), CDN fontów blokowany przez CSP artefaktów (TeamBudget/brand centre → base64).
- Uprawnienia/scope/sekrety odkrywane po fakcie zamiast sprawdzane przed obietnicą: personal_scope_not_allowed blokuje deploy betterguide (znane od 20.07, nierozwiązane), token Trello MCP wygasa (fallback na REST z .env), Dropbox token 4h zamiast refresh tokena (gałąź martwa od czerwca), brakujący GITHUB_TOKEN objawiał się jako 'CMS w ogóle nie działa', Resend bez weryfikacji domeny przed pilotem r3loop.
- Rodzina bugów 'ukryty viewport': IntersectionObserver zostawia treść na opacity:0 (DiMedical, human-commons), rAF nie tyka a GSAP nie startuje w ukrytej karcie (campnou — ensureTweenEnds), panel podglądu Claude zamraża tranzycje i ma document.hidden=true (bees-knees, DiMedical — QA przez pomiary DOM), screenshot nie zrzuca przewiniętej strony (TeamBudget), strony >32k px czarne poniżej folda (brand centre). Ten sam mechanizm gryzie w ≥5 projektach.
- Limity darmowych tierów i infrastruktury mylone z bugami własnego kodu: pauza free-tier Supabase wyglądała jak awaria auth (r3loop — stąd keep-alive cron), Vercel 12/12 funkcji wywala deploy (Caterelo), CoinGecko 429 tylko z IP sandboxa (sentiment-tracker), Openverse page_size>12 timeoutuje, max_tokens 8k ucinał JSON strategii. Diagnoza za każdym razem od kodu zamiast od środowiska.
- Duplikacja danych bez jednego źródła prawdy: ceny CATS zdublowane w katalogu i 2 kalkulatorach DailyFruits, sentiment-tracker jako 2 kopie pliku (źródło + FOTRA, sync ręczny cp), brand-centre.html utrzymywany ręcznie obok tokens.json, MODULES niespójne między cms.html a _config.js (znany gap frameworku), trzy niezharmonizowane limonki wykryte dopiero przy kodyfikacji.
- Narzędzia zewnętrzne cicho psujące dane zamiast rzucać błąd: importer Medium wstrzykuje 145 em-dashy i sufiks tytułu, Adobe Stock podstawia INNE miasta zamiast pustki (semantyka bez progu), minifikator wypuszcza zepsuty JS (DiMedical — stąd node --check + rollback), PIL convert('RGB') zabija kanał alpha, eksport PDF/InDesign dubluje glify jako outline'y (Archicom), Resend SDK po cichu ignoruje reply_to. Wniosek systemowy: verify-first, bo failure mode to 'wygląda ok'.
- Błąd 'ostatniej mili' — praca dowieziona technicznie, ale nie wypuszczona do świata: framework gotowy ~7200/10000 bez pierwszej sprzedaży, wtyczka Caterelo niezłożona do CWS (brakowały zrzuty 1280×800), BOOKING_URL campnou wciąż bez linku afiliacyjnego (widget nie zarabia), wegobold.com nadal przekierowuje do r352, demo ARToffNIA niepokazane klientowi, landing frameworku niezdeployowany, case Sonova z placeholderem roli w testimonialu.

### Powtarzalne automatyzacje

- Scaffold 'nowy X jednym poleceniem': bin/nowy-klient.sh (repo Brand Hub z git init), build.py/build.js w ~7 projektach, npm run tokens auto przed dev/build (FitStyle), klon najnowszego wpisu jako szkielet nowego (CMS DailyFruits). Wspólna zasada: szablon powstaje przez ekstrakcję z działającego wdrożenia, nigdy od zera.
- Automatyzacje czasowe utrzymujące system przy życiu: launchd 8:00 z nadrabianiem po uśpieniu (briefsync daily.sh + daily.log), keep-alive cron 06:00 UTC przeciw pauzowaniu Supabase (r3loop), BETA_DEADLINE 31.08 zadziała bez człowieka (Caterelo). Kontrast: kadencja Medium, rozliczenie Ady i re-oceny TeamBudget wciąż zależą od pamięci Przemka mimo deterministycznych procedur.
- Drift guardy i walidacje w buildzie/CI: npm run brand:check (kod vs brand guide z allowlistą), node --check z auto-rollbackiem po minifikacji (DiMedical), CI blokujące validate.py+htmlhint+build --check (DailyFruits), weryfikacja curl-em prerenderu po deployu (r352.com), programowa weryfikacja QR na finalnym pliku (zdrofit-lodygowa).
- Atomic multi-file commit przez GitHub Git Data API (commitFiles) jako wspólny silnik całej rodziny CMS — zapis wielu plików jednym commitem, auto-sync kart bloga i sitemap przy publikacji, wskaźnik deployu z GitHub deployments API.
- Pipeline'y odzysku i migracji danych: wayback_fetch.py + blog_generate.py (147 wpisów z Wayback, 100% pokrycia 205 URL-i), import 165 rekordów przez REST anon + PATCH z admin JWT z dedupe (Penya), ekstrakcja 43 opisów i 20 biogramów z mirrora (ARToffNIA), parser XML PPTX → 21 slajdów Figmy (LEMF). Wszystkie działały, żaden nie trafił do repo jako trwałe narzędzie.
- Automatyzacja klasyfikacji przez roje agentów tam, gdzie reguły nie wystarczą: 10 agentów klasyfikujących 109 zdjęć z confidence (bees-knees), 4 agenty researchu do planu 90 dni (human-commons), 3 agenty benchmarku globalnego (FitStyle), audyt 5 person z punktacją (ARToffNIA), subagenty Sonnet do ekstrakcji szablonów (framework — świadoma decyzja modelowa przy limicie Fable 5).

---

## 3. Asymetrie — nieoczywiste przewagi konkurencyjne

### Sprzedajesz repo git jako 'system operacyjny marki' — i sam nim żyjesz (pełny dogfooding chain)

**Dlaczego trudne do skopiowania:** Konkurencja może skopiować pitch, ale nie łańcuch dowodowy: r352 używa na sobie dokładnie tego, co sprzedaje — brand centre r352.com/brand to pilot wzorca .brand/, context vault w Obsidianie to osobisty Brand Hub OS, brand-check.mjs egzekwuje guide w CI, a bramka F2 = test AI ≥85/100 zamiast 'wygląda dobrze'. Do tego zasada 'szablon powstaje przez ekstrakcję z działającego wdrożenia, nigdy od zera' — szablony CMS z bees-knees, kanon strategii z betterguide.pl/strategia, consent/SEO z DailyFruits. Tego nie da się odtworzyć bez lat realnych wdrożeń, z których się ekstrahuje.

**Efekt 10x:** Godziny Reszka na pakiet F1-F2 z ~40h do ≤12h przy równoległości 1→4 projektów = 10x przepustowości bez zatrudniania; a 'AI-testowalna marka' to kategoria-of-one, której żadna agencja w PL nie ramuje.

**Jak wykorzystać:** Domknąć pierwszą sprzedaż pakietu F1-F2 (rama LOCKED, pilot Mała Palarnia 90/100 zaliczony — brakuje tylko decyzji cenowej i wysyłki case'u, zdiagnozowane wprost 03.08 w PRODUKT.md). Każdą kolejną realizację kliencką prowadzić przez scaffold bin/nowy-klient.sh, żeby dowód 'godziny/pakiet spadają' był mierzalny.

### Trzy niezależne silniki mierzalnej jakości LLM + jedyny w PL korpus 39 realnych briefów do kalibracji

**Dlaczego trudne do skopiowania:** Strategy Critic 0-1000 z twardym progiem 750 (r3loop, realny wynik 930/1000 na TeamBudget), alignment score RAG brief-vs-strategia marki z cost caps $0.014/brief (llm-auditor.ts w narzędziu do briefowania) i walidator bramki F2 — to trzy działające implementacje tej samej rzadkiej kompetencji: 'maszyna, która mówi NIE'. Do tego briefsync zebrał 39 realnych briefów z 8 tablic klienckich (Benefit, Geers, Archicom...) — korpus kalibracyjny, którego żaden konkurent budujący 'narzędzie briefowania' nie ma i nie zdobędzie bez lat obsługi tych klientów.

**Efekt 10x:** Pilot Benefit 50-100k PLN sprzedawany na dowodzie 'nasz scoring jest skalibrowany na Waszych realnych briefach' — argument nie do przebicia; a bramki liczbowe (MACS NO-GO blokuje proposal) pozwalają delegować kwalifikację leadów maszynie w 100%.

**Jak wykorzystać:** Zasilić alignment score realnym korpusem briefsync jako zbiorem testowym (missed opportunity nazwana wprost w korpusie), a scoring wystawić jako jeden współdzielony komponent dla r3loop i narzędzia briefowania zamiast dwóch osobnych implementacji (readiness.ts vs llm-auditor.ts).

### Kompetencja 'pipeline tam, gdzie nie ma API' — inżynieria zachowań cudzych platform

**Dlaczego trudne do skopiowania:** Wzorzec powtórzony niezależnie 4+ razy: Medium (odkrycie, że edytor serializuje DOM — TreeWalker+InputEvent przeżywa reload, publikacja = 1 klik człowieka), Figma (odczyt 46 komentarzy przez wewnętrzne API fetch z sesji Chrome, czego oficjalne MCP nie umie — deck Osada Orle), Envato (scrape SSR bez API), GymManager (checkout przez redirect bez API — FitStyle). To nie pojedyncze triki, tylko metodyka: zbadaj zachowanie platformy, znajdź deterministyczną ścieżkę, zweryfikuj (verify-first), skodyfikuj gotchas w pamięci. Konkurent musi każde z tych odkryć zapłacić od nowa.

**Efekt 10x:** Każda platforma klienta staje się automatyzowalnym kanałem produkcyjnym — oferta 'zautomatyzujemy Wasz workflow niezależnie od tego, czy narzędzie ma API' to moat, bo 90% realnych stacków klientów NIE ma API.

**Jak wykorzystać:** Spakować 3 najcenniejsze obejścia jako skrypty/SOP-y zamiast wiedzy proceduralnej w pamięci (Medium pipeline i czytnik komentarzy Figmy nazwane w korpusie jako niespakowane) — wtedy wykonuje je dowolna sesja lub podwykonawca, nie 'sesja z Reszkiem obok'.

### Kod jako narzędzie produkcji fizycznej i DTP — parametryczne projekty do druku i 3D bez studia

**Dlaczego trudne do skopiowania:** zdrofit-lodygowa: witryny wielkoformatowe w HTML (1cm=10px), cięcie na bryty z zakładką w PIL, QR weryfikowany programowo moduł po module na finalnym pliku — kontrola jakości, której drukarnie i agencje nie robią. Kubota: stand POS w czystym CSS 3D z dielinów produkcyjnych, z twardą bramką 'zero kredytów AI przed zatwierdzeniem index.html'. Camp Nou: ~55k interaktywnych miejsc w jednym pliku. Wszystko odtwarzalne jedną komendą i wersjonowane w git. Agencje mają ludzi od DTP albo od kodu — prawie nikt nie ma obu w jednym przepływie.

**Efekt 10x:** Nośnik fizyczny przestaje być projektem, a staje się generacją z configu — koszt krańcowy kolejnej lokalizacji Zdrofit spada z dni pracy grafika do godziny walidacji; przy ~100 briefach/mies. od Benefitu to bezpośrednia dźwignia na największym kliencie (49% przychodu).

**Jak wykorzystać:** Podnieść zdrofit-lodygowa do rangi produktu 'otwarcie klubu' (config JSON per lokalizacja — to już DRUGA realizacja wzorca po Poznaniu) i sprzedać Benefitowi jako powtarzalny SOP; analogicznie build.py Kuboty jako usługa 'wizualizacja standu z dielinów w 24h'.

### Skumulowana wiedza negatywna + dystrybucja pod agentów AI, zanim rynek zauważył tę kategorię

**Dlaczego trudne do skopiowania:** System pamięci kumuluje także porażki jako aktywa: stock-photo-sources (Unsplash/Pexels zablokowane, Adobe myli miasta — zapisane, żeby nikt nie płacił za to drugi raz), gated-content-nie-dziala (empirycznie: lewe adresy, zero pipeline'u), verify-first z zapisanym 'why'. Równolegle: llms.txt na r352.com i dailyfruits.pl (wynik Agentic Browsing 3/3), robots otwarte dla crawlerów LLM, serwer MCP Caterelo na produkcji jako maszynowy kanał produktu. Konkurencja optymalizuje pod Google — Reszek już pozycjonuje się pod wyszukiwanie przez agentów.

**Efekt 10x:** Jeśli teza 'klienci będą kupować przez agentów' się zmaterializuje, r352 ma 12-18 miesięcy przewagi first-movera z działającymi wdrożeniami i benchmarkiem (3/3), a nie slajdem o trendzie.

**Jak wykorzystać:** Zarejestrować MCP Caterelo w katalogach (dziś zero dystrybucji tego kanału — nazwane w korpusie) i dodać llms.txt/MCP jako standardowy deliverable fazy F3 frameworku — 'Twoja marka czytelna dla agentów AI' jako linia w ofercie.

---

## 4. Wąskie gardła — gdzie Przemek nadal jest ograniczeniem

### Decyzje odwagi: wycena i wysyłka — gotowe produkty nie wychodzą w świat bez osobistego 'GO' Przemka

**Dowody:** Framework: gotowość ~7200/10000, zero przychodu, diagnoza z 03.08 wprost: 'wąskim gardłem nie jest budowa, tylko decyzje odwagi: cena i wysyłka case'u'; landing sprzedażowy niezdeployowany. ARToffNIA: demo 19 stron + wycena WYCENA.md (22/29/38k) kompletne, klient wciąż go nie widział (ryzyko przeinwestowania nazwane w korpusie). wegobold: restyle zrobiony, produkcja niewypuszczona (wegobold.com nadal przekierowuje do r352). Caterelo: wtyczka niezłożona do Chrome Web Store, bo 'brakowały tylko zrzuty 1280x800'. Camp Nou: BOOKING_URL wciąż bez linku afiliacyjnego — widget nie zarabia.

**Fix:** Zasada 'ship-by-date' zamiast 'ship-when-ready': każdy gotowy artefakt dostaje datę wysyłki w kalendarzu w momencie ukończenia, a cotygodniowy 'chess block' (już zaproponowany w r352-operating-strategy, niewdrożony) zaczyna się od listy rzeczy czekających wyłącznie na klik Przemka.

### Deploy i dostępy do kont — automatyzacja kończy się tam, gdzie zaczyna się osobisty scope Vercela/GoDaddy/KYC

**Dowody:** betterguide.pl: Claude ma personal_scope_not_allowed, deploy robi wyłącznie Reszek — bloker znany od 20.07, nieprzeniesiony. Caterelo: naprawy z 07.08 (commit 6f40af6) czekają na ręczny vercel --prod. r3loop: notyfikacje mailowe czekają na 3 rekordy DNS w GoDaddy (weryfikacja domeny w Resend). Penya: cały Sprint B (płatności) zakodowany, stoi na danych konta P24/KYC.

**Fix:** Jedna sesja porządkowa: migracja projektów z osobistego konta do team scope reszkovys-projects, włączenie auto-deploy z gita tam, gdzie świadomie nie jest wyłączony, wpisanie rekordów DNS Resend — po tym deploy przestaje wymagać obecności Przemka.

### Reszek/sesja Claude jako runtime pipeline'ów — automatyzacje działają tylko, gdy jego laptop i sesja żyją

**Dowody:** briefsync: gałąź Trello→Figma wymaga otwartego desktopu i żywej sesji Claude (use_figma pisze do aktywnego pliku), a gałąź Dropbox→Trello wisi niedokończona od czerwca na braku refresh tokena. Medium: pipeline żyje jako wiedza proceduralna w pamięci, nie skrypt — każda publikacja to sesja agentowa. Zdrofit hourly pipeline: miesiąc po zdefiniowaniu celu (04.07) pętla nie wystartowała nawet jako ręczny batch dzienny. Ada: rozliczenie miesięczne w pełni deterministyczne, ale odpalane ręcznie w sesji.

**Fix:** Przenieść Trello→Figma na Figma REST API z PAT (nazwane w korpusie jako brakujący krok), dokończyć token Dropbox, a deterministyczne procedury (Ada, Medium pre-flight) zamienić w skrypty odpalane cronem/launchd — wzorzec już działa w daily.sh.

### Relacje klienckie i eskalacje — tylko Przemek pilnuje materiałów wejściowych i formalizacji zakresu

**Dowody:** Archicom/Reymonta: deadline poniedziałek 10.08, część materiałów (mapa, wizki, karty mieszkań) wciąż nie dotarła, a mimo znanego ryzyka urlopu Marty (3-7.08) nie było proaktywnej eskalacji przed 3.08; brak formalnej akceptacji wyceny przed startem prac (missed opportunity w korpusie). Case Sonova: testimonial z placeholderem roli blokuje użycie sprzedażowe od 07.2026 — jedna prośba mailowa, niewysłana. FOTRA: brak FV Archicom od maja — nikt poza Przemkiem tego nie ściga.

**Fix:** SOP ofertowo-materiałowy jako checklist w frameworku: potwierdzenie zakresu mailem przed produkcją + lista materiałów z datami i automatyczna eskalacja (agent monitorujący skrzynkę pod materiały od klienta jest już nazwany jako agents_possible w projekcie Reymonta).

---

## 5. Priorytety — 3 działania o największej dźwigni (7–10 sierpnia 2026)

### Priorytet 1: Dowieźć prezenter Przystań Reymonta na poniedziałek 10.08 metodą 'szkielet najpierw, materiały na końcu': dziś zbudować kompletny prezenter 8 sekcji na tokenach archicom-brand z placeholderami na brakujące materiały (mapa, wizki, karty mieszkań) i równolegle wyegzekwować braki od klientki

**Dźwignia:** Jedyny twardy płatny deadline w oknie 3 dni (100-200 PLN/strona) u powracającego klienta z polecenia — Archicom to niespodziewany #2 przychodowy wg inFakt (76,3k). Szkielet z placeholderami zamienia najgorszy scenariusz 'materiały w dniu deadline'u' z katastrofy w godzinę podmiany plików; przy okazji zamyka wiszący temat braku FV od maja.

**Pierwszy krok (≤1 h):** W godzinę: zinwentaryzować, co realnie jest lokalnie z transferów SwissTransfer (linki wygasają po ~30 dniach — pobrać wszystko natychmiast), i wysłać do Marty (wraca 8.08) precyzyjny mail: lista 3-4 brakujących materiałów, deadline dosyłki 'do piątku 17:00, inaczej wersja z placeholderami', plus przypomnienie o FV.

### Priorytet 2: Wykonać pierwszą rozmowę sprzedażową frameworku Brand Hub OS: ustalić cenę kotwiczną (decyzja, nie research) i wysłać case Mała Palarnia z konkretną ofertą do 1-3 najcieplejszych kontaktów

**Dźwignia:** Największa pojedyncza dźwignia roku wg własnej diagnozy z 03.08 — rama LOCKED, pilot zaliczony (test AI 90/100, 8/8 bramek), gotowość ~7200/10000, a blokerem jest wyłącznie decyzja odwagi. Pierwszy przychód odblokowuje feature freeze, urealnia KPI godzin/pakiet i zamienia kluczowy projekt roku z kosztu w strumień. Bez tego cały framework pozostaje najdroższym nieopłaconym artefaktem w firmie.

**Pierwszy krok (≤1 h):** W godzinę: wpisać jedną liczbę do PRODUKT.md (kotwica z widełek 30-60k PLN dla done-for-you F1-F2), otworzyć case Małej Palarni i wysłać go mailem z tą ceną do jednego konkretnego prospekta — mail wg wzorca dwufunkcyjnego 'portfolio + otwarcie rozmowy walidacyjnej', który jest już opisany w reusable_assets frameworku.

### Priorytet 3: Wysłać demo ARToffNIA z wyceną do fundacji i umówić prezentację — zakończyć fazę budowania, zacząć fazę sprzedaży

**Dźwignia:** Wszystko gotowe: 19 stron, 52 zajęcia w bazie, audyt 5 person z naprawami, kampania wizualna i WYCENA.md z trzema pakietami 22/29/38k netto + opieka 600/mies. Każdy dzień zwłoki to czyste ryzyko przeinwestowania nazwane w korpusie ('demo wciąż niepokazane klientowi'). To najkrótsza ścieżka do nowego przychodu w całym portfelu — deliverable i pitch ('porządkujemy system, nie malujemy stronę') już istnieją, brakuje wyłącznie wysyłki.

**Pierwszy krok (≤1 h):** W godzinę: wystawić demo pod stabilny URL (ten sam wzorzec co Camp Nou: kopia do public/ w repo r352, push, auto-deploy ~2,5 min), napisać krótki mail do fundacji z linkiem, jednym akapitem pitchu i propozycją 30-minutowej rozmowy w przyszłym tygodniu — bez załączania pełnej wyceny (ta na rozmowę).

---

## 6. Ryzyka na najbliższy kwartał

- Syndrom 'gotowe, niewysłane' skaluje się szybciej niż sprzedaż: framework (0 przychodu przy 7200/10000), ARToffNIA (demo niepokazane), wegobold (prod niewypuszczony), Caterelo (wtyczka poza CWS, MCP niezarejestrowany), Twoje Menu (case w shadow bez scen), Camp Nou (brak linku afiliacyjnego) — jeśli kwartał znów pójdzie w budowanie, system będzie miał 10 kolejnych perfekcyjnych artefaktów i dalej zero dowodu komercyjnego.
- Koncentracja przychodu: Benefit = 49% (twarde dane z inFakt w FOTRA), a jednocześnie hourly pipeline dla tego klienta nie wystartował miesiąc po zdefiniowaniu i brak FV Archicom (#2 przychodowy) od maja — utrata lub redukcja jednego klienta przy niedomkniętych alternatywach zatrzymuje finansowanie całego rozwoju systemu.
- Pierwszy pilot kliencki r3loop może paść na cichym failu: brak monitoringu błędów generacji, testowe briefy nieskasowane, Resend niezweryfikowany, znany bug statusów ('completed' zamiast 'draft') — nieudany pilot u realnego klienta spali najlepszy dowód automatyzacji, jaki firma ma.
- Infrastrukturalne pojedyncze punkty awarii łamiące własną zasadę 'git od dnia 1': FitStyle poza gitem w katalogu rozliczeń, pilot frameworku w ~/Klienci nieskommitowany, betterguide live ≠ repo (deploy z folderu), FOTRA/CRM w całości w localStorage jednej przeglądarki — jedna awaria dysku lub wyczyszczenie przeglądarki cofa miesiące pracy i danych decyzyjnych.
- Free-tier i limity zewnętrzne jako miny pod demo: Supabase pauzuje się po tygodniu ciszy (wyglądało jak awaria auth), Resend w trybie testowym, twardy sufit 12/12 funkcji Vercela w Caterelo, beta Caterelo wygasa automatycznie 31.08 — każda z tych rzeczy może wywrócić prezentację lub pilot dokładnie w momencie, gdy pojawi się kupujący.
- Rozproszenie przepustowości właściciela: równolegle framework, r3loop, narzędzie briefowania (plan zakłada realne 10h/tydz), Human Commons z bramką GO/STOP 6.11 i rekonesansem 22.09-8.10, Wave Turyn 7-9.10, TeamBudget na Better Minds X.2026 — trzy tygodnie fizycznej nieobecności w Q4 przy pipeline'ach wymagających żywej sesji Claude i laptopa oznaczają, że nieprzeniesione na cron/REST automatyzacje po prostu staną.
- Delegacja bez domkniętych fundamentów prawnych: pakiet umów podwykonawczych gotowy, ale bez rekomendowanego przeglądu prawnika, bez e-maila do doręczeń i bez procesu podpisu kwalifikowanego (forma pisemna pod rygorem nieważności przeniesienia praw) — skalowanie 'rąk' na łańcuchu praw, który może okazać się dziurawy dokładnie przy największym kliencie.

---

## 7. Knowledge Graph — węzły i zależności

Graf: **81 węzłów**, **155 krawędzi**. Interaktywna wersja: artefakt „r352 Knowledge Graph”. Dane źródłowe: `r352-os/knowledge-graph.json`.

**Projekty (44):** Brand Hub OS — framework F1–F5, Strona r352.com, Brand centre r352 (/brand), Case studies r352.com/work, betterguide.pl — hub BetterWorkplace, Strategia operacyjna r352 (living doc), r3loop.app (Briefly) — automat strategia+proposal, Club Manager Briefing System (regional.fit), briefsync — router Trello↔Figma↔Obsidian, Pipeline publikacji Medium, Relaunch dailyfruits.pl (WP→static), DailyFruits CMS v6 /admin, DailyFruits SEO /oferta + archiwum Wayback, Katalog handlowy + kalkulatory, Consent / GTM DailyFruits, Hourly pipeline Trello→Figma (Zdrofit), Ćwicz w zieleni — 10 formatów z mastera, Witryny CH Łodygowa (wielki format), Ada — podwykonawca + ewidencja Slack, Archicom — tokeny + rebrand atrium, Archicom — prezenter Przystań Reymonta, Osada Orle — brand system Figma (Dzień/Noc), Osada Orle — deck sponsorski Morisson (3 wersje), TeamBudget — strategia GTM + MVP, Caterelo — relocation engine + Deal Radar, Penya SaaS — onboarding penyi FCB, Camp Nou 3D — every seat, Stand KUBOTA×Baltona 3D z dielinów, The Post-AI Society (Human Commons), DiMedical — redesign spekulacyjny, ARToffNIA — demo katalogu zajęć, LEMF 2027 — pipeline PPTX→Figma, Profichem24 — rolka IG 15 s (Rigips), Lumo — brand + wizytówka opinii, FitStyle — silnik LP przedsprzedażowych, wegobold.com — marka produktowa, bees-knees.pl — serwis + CMS + leady, Twoje Menu — case study (plan + boardy), Bartech — 3 animacje MP4, Harvester stocków — 33 miasta, Tracker sentymentu BTC/ETH, Dashboard cykli halvingowych BTC, FOTRA — panel operacyjny (CRM+przychody), Umowy podwykonawcze jako kod

**Wzorce (11):** Wzorzec tokens-first (tokens.json → CSS/YAML/HTML), Wzorzec .brand/ — marka jako repo, Bramka jakości LLM z twardym progiem, HTML+headless Chrome jako narzędzie DTP/3D, Jedno źródło danych → wiele widoków, Szablon przez ekstrakcję z działającego wdrożenia, Tania bramka dostępu (hasło client-side + noindex), Research/klasyfikacja wieloagentowa, Programowa produkcja w Figmie (use_figma/API), Every Project Compounds (meta-zasada), Generatywna produkcja wizualna Higgsfield (i2i, de-slop)

**Komponenty (8):** Rodzina CMS: git jako backend, Prerender SPA na Vercelu (sparticuz fix), MACS — framework kwalifikacji, Mapa źródeł stockowych (co da się automatyzować), Design system dashboardów krypto, Odczyt komentarzy Figmy przez wewn. API, STRATEGIA-WZORZEC.md (kanon D01–D06), Context vault Obsidian (pakiet kontekstu AI)

**Klienci (5):** Benefit Systems / Zdrofit, BetterWorkplace / DailyFruits, Archicom, Osada Orle / Izera, Właściciel 9campnou.com

**Agenci (4):** Agent: generator strategii + Critic (pętla), Agent: LLM-auditor briefów (RAG/pgvector), Agent: Claude jako runtime pipeline'u (PRZENIEŚ), Agent: Claude jako operator przeglądarki

**SOP-y (3):** SOP verify-first (dowód przed twierdzeniem), SOP Trello read-only wobec narzędzi klienta, SOP handoff dla sesji AI (runbooki)

**Lekcje (3):** Nauczka: gated content nie działa, Nauczka: ukryte karty zamrażają rAF/IO/tranzycje, Nauczka: pipeline w sesji ginie — pakować w narzędzie

**Problemy (2):** Problem: czas Reszka = wąskie gardło, Problem: dowód w tyle za pozycjonowaniem

**Automatyzacje (1):** brand-check.mjs — drift guard marka↔kod

---

## 8. Analiza projektów — pełny szablon (47 projektów)

## Rdzeń firmy — r352

### Framework produkcyjny r352 — Brand Hub OS

**Klient:** r352 (produkt własny, kluczowy projekt roku — decyzja 12.07.2026)  
**Status:** Aktywny; rama LOCKED (feature freeze do pierwszej sprzedaży), pilot Mała Palarnia zaliczony (test AI 90/100, 8/8 bramek), dowód 55%; na stole: decyzja cenowa + pierwsza rozmowa sprzedażowa.

**Cel biznesowy:** Zamienić usługi w produkt z trzema strumieniami dźwigni: done-for-you (kotwica Strategia+Brand Hub 30–60k PLN), Playbook self-serve (€1,5–2k), licencja white-label. Cel roczny: godziny Reszka na pakiet F1–F2 z ~40h do ≤12h przy równoległości 1→4 projekty.

**Problem:** Każda realizacja kliencka robiona od zera, wiedza się nie kumulowała, czas Reszka był wąskim gardłem, a klient kupował pojedyncze artefakty (logo, stronę) zamiast systemu, z którego korzysta każdy kolejny wykonawca i każde AI.

**Proces:** 5 faz na osi r3loop: F1 Strategia (SALT) → F2 Brand (PLATE, gate: Brand Lock) → F3 Web (tokens-first) → F4 CMS+Handoff (klient publikuje sam) → F5 Audyt+Retainer. Każda faza kończy się bramką z checklistą pokazywalną klientowi (obrona value-based pricing). Zasada: każdy krok actionable — AI lub inna osoba powtórzy go bez pytania autora.

**Workflow:** Nowy klient = ./bin/nowy-klient.sh <slug> → scaffold repo Brand Hub (.brand/, system/*.json, hub/, www/, cms, docs) z git init → fazy wg proces/F1–F5 z użyciem promptów z playbook/ → bramki commitowane → wnioski z każdej realizacji wracają do frameworku commitem (DiMedical→F3/F5, ArtoffNIA→F3/SPEC, DailyFruits→F3 consent/SEO).

**Architektura:** Jedno repo git per klient = Brand Hub. Jedno źródło prawdy: tokens.json → generate-tokens.mjs → tokens.css (strona) + YAML w AGENT.md (AI) + design-system.html (ludzie). Hub gated HTML z walidatorem ≥85/100 i monitorem procesu (status.mjs + panel.html). CMS serverless jednej rodziny kodu (HMAC auth, Git Data API atomic commits), baza z bees-knees, moduły Blog/Produkty/Galeria/Leady włączane flagami MODULES. Playbook = prompty F1–F5 o budowie ROLA/WEJŚCIE/ZADANIE/WYJŚCIE/BRAMKA.

**Narzędzia:** git, Claude Code (subagenty Sonnet do ekstrakcji), Node.js (mjs: generate-tokens, status, walidacje node --check), bash (scaffold nowy-klient.sh), Vercel (serverless api/), HTML/CSS (landing, hub, design-system)

**Agenci użyci:**
- Subagenty Sonnet do ekstrakcji szablonów P0 z działających wdrożeń (Fable 5 miał limit — celowa decyzja modelowa).
- AI jako egzaminator bramki F2 — test generacji on-brand z .brand/ (pilot: 90/100).
- Prompty playbooka F1–F5 jako agent prowadzący fazę z zapisem wyników do repo klienta.

**Agenci możliwi:**
- Walidator hub/validate.mjs — skrypt wołający API z .brand/ + checklistą, zwraca wynik /100 (bramka F2 w 10 min zamiast godziny).
- Agent teardown-pipeline: URL → fakty → salt.md → strategia light → szkic landingu (jednocześnie lejek marketingowy).
- Delegacja per faza: AI wykonuje kroki procesu, Reszek podejmuje tylko decyzje bramkowe (największa pojedyncza dźwignia wg PRODUKT.md).

**Automatyzacje zrobione:**
- Scaffold bin/nowy-klient.sh: szablony → gotowe repo klienta z git init (przetestowany).
- generate-tokens.mjs: tokens.json → tokens.css + tokens.yaml jednym przebiegiem.
- Monitor procesu status.mjs + panel.html kopiowany scaffoldem do hub/ każdego klienta.
- CMS template z modułami przełączanymi flagami i konfigurowalnym MIRROR (baza bees-knees, 9 plików API).

**Automatyzacje możliwe:**
- Auto-konfiguracja CMS flagami scaffoldu (--blog --galeria --leady → wygenerowany _config.js).
- Timelog z timestampów commitów zapisywany do status.json (pomiar godzin/faza za darmo).
- Półautomatyczny teardown (cel: 2h → 30 min → 10 min).
- Automatyczna synchronizacja MODULES między cms.html a _config.js (dziś ręczna — znany gap).

**Reusable assets:**
- Całe repo r352-framework jest assetem: szablony .brand/ (6 MD), system/ (7 JSON), SALT/PLATE, CMS, web, bramki, landing.
- Playbook promptów F1–F5 = rdzeń Formy 2 (produkt cyfrowy).
- Case study pilota Mała Palarnia (dwufunkcyjny: portfolio + otwarcie rozmowy walidacyjnej).
- Kanon deliverable'u strategii = spec/STRATEGIA-WZORZEC.md (D01–D06) wzorowany na betterguide.pl/strategia.

**Unique elements (czego standardowa agencja nie robi):**
- Klient kupuje repo git jako 'system operacyjny marki', nie logo czy stronę — żadna standardowa agencja tak nie ramuje deliverable'u.
- Bramka F2 = test AI: marka jest 'locked' dopiero, gdy AI generuje z .brand/ materiał on-brand ≥85/100.
- Zasada 'szablon powstaje przez ekstrakcję z działającego wdrożenia, nigdy przez pisanie od zera'.
- Feature freeze z jednym wyjątkiem: wnioski z realnych projektów klienckich wracają commitem.
- Metryka nadrzędna rozwoju = godziny właściciela na pakiet, nie liczba feature'ów — każda zmiana narzędziowa musi obniżać godziny/pakiet albo czeka w backlogu.

**Lessons learned:**
- Pilot na sucho ujawnił 10 zgrzytów (PILOT-NOTES) — realny przebieg > przegląd teoretyczny; poprawki wróciły commitem.
- Wąskim gardłem nie jest budowa (rama gotowa), tylko decyzje odwagi: cena i wysyłka case'u — zdiagnozowane wprost 03.08.
- Framework oceniony: brand ~8.5/10, strategia produktu ~5/10 — świadomie nazwana luka zamiast udawania kompletności.
- Pilot bez pomiaru czasu = brak baseline'u; KPI urealni dopiero drugi przebieg z timelogiem.
- Duże ekstrakcje wymagają subagentów na tańszym modelu (limit Fable 5).

**Missed opportunities:**
- Zero przychodu i dowodu komercyjnego mimo gotowości ~7200/10000 — sprint monetyzacyjny 10–23.07 nie domknął sprzedaży.
- Walidator bramki F2 wciąż ręczny (prompt zamiast skryptu).
- 2–3 anonimizowane przykłady do Playbooka nie powstały, choć materiał z pilota istnieje.
- Landing sprzedażowy nie zdeployowany na realny URL i niezlinkowany z r352.com/process.
- Praca pilota w ~/Klienci/pilot-nazwa nieskommitowana poza scaffoldem — łamie własną zasadę 'git od dnia 1'.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-framework-produkcyjny.md
- /Users/reszek/Desktop/Claude_zadania/FrameWorkProdukty/r352-framework/README.md
- /Users/reszek/Desktop/Claude_zadania/FrameWorkProdukty/r352-framework/PRODUKT.md
- /Users/reszek/Desktop/Claude_zadania/FrameWorkProdukty/r352-framework/BACKLOG.md

</details>

---

### Strona r352.com

**Klient:** r352 (własna witryna firmowa)  
**Status:** LIVE (Vite+React na Vercel, 35/35 tras prerenderowanych); roadmapa 5 przyrostów w toku, GSC zweryfikowane, indeksacja rozpędza się od 07.2026.

**Cel biznesowy:** Pozycjonować r352 jako 'operating layer' dla design-ops (nie agencję), kierować ruch ICP do Diagnostic i budować kategorię-of-one przez treść, proof i brand vibe (electro-breakdance x futuryzm).

**Problem:** Solo-operator sprzedający systemy premium musi wyglądać jak system: potrzebne SEO od zera (kolizja brandu 'r352' z głośnikami Monitor Audio w SERP), pełny prerender SPA dla crawlerów i spójna warstwa brandowa.

**Proces:** Rozwój iteracyjny w repo reszkovy/r352-website; build = vite build + inject-meta.mjs + prerender.mjs (Puppeteer, ~35 tras do statycznych index.html); deploy przez push na main (GitHub integracja) lub npx vercel deploy --prod; weryfikacja po deployu przez curl treści case study.

**Workflow:** Zmiana w kodzie → npm run brand:check (drift guard vs brand guide) → build z prerenderem → deploy → curl-owa weryfikacja, że trasy nie są 5.9 kB shellem.

**Architektura:** SPA Vite+React z prerenderem per trasa; SEO.tsx (per-route meta), JSON-LD, sitemap ~40 URL, permissive robots.txt dla LLM crawlerów + llms.txt. Hero home: WebGL '808 logo-glyph field' za flagą HERO_WEBGL (tylko dark, revert jedną flagą). /webgl = galeria 8 audio-reaktywnych shaderów (detekcja kicków u_kick, energia u_energy). Na Vercelu prerender przez @sparticuz/chromium z wymuszonym AWS_LAMBDA_JS_RUNTIME.

**Narzędzia:** Vite + React + TypeScript, Puppeteer / @sparticuz/chromium (prerender), Vercel (CLI + GitHub integracja), WebGL/GLSL + Web Audio API, Google Search Console

**Agenci użyci:**
- Agent strategiczny syntetyzujący strategię operacyjną z treści live strony (07.2026).
- Sesje Claude kierowane przez repo CLAUDE.md do .brand/ przed każdą pracą UI/copy.

**Agenci możliwi:**
- Agent SEO-monitor: cykliczny odczyt GSC + curl prerenderowanych tras po każdym deployu.
- Agent tłumaczący trasy na /pl z hreflang (największa otwarta szansa SEO, przygotowana w kodzie).

**Automatyzacje zrobione:**
- Pipeline prerenderu ~35 tras z fixem środowiska Vercel (sparticuz + env var przed importem).
- inject-meta.mjs — meta per trasa w buildzie.
- npm run brand:check — automatyczny drift guard hexów/cytatów/zasady dashy względem brand guide'u.

**Automatyzacje możliwe:**
- Automatyczna weryfikacja po-deployowa (curl case'ów jako krok CI zamiast ręcznego sprawdzenia).
- Zdarzenia GTM na lejek Diagnostic.
- Automatyczny prerender tras /pl po ich powstaniu.

**Reusable assets:**
- Wzorzec prerenderu SPA na Vercelu (rozwiązany problem chromium/lambda) — przenośny do każdego projektu SPA.
- Wzorzec SEO-kompletu: per-route meta + JSON-LD + sitemap + llms.txt.
- Biblioteka shaderów WebGL (Flow/Aurora/Scope/Warp/808/Cymatics/Peak/R3loop) do reużycia w brandingu.
- Flaga-mechanizm HERO_WEBGL jako wzorzec bezpiecznych trialów wizualnych.

**Unique elements (czego standardowa agencja nie robi):**
- llms.txt + robots otwarte dla crawlerów LLM — pozycjonowanie także pod wyszukiwanie przez AI.
- Audio-reaktywna galeria WebGL jako przestrzeń artystyczna foundera wpięta w brand (nie feature strony).
- Skrypt brand-check pilnujący zgodności kodu z brand guide'em — strona sama się audytuje.
- Kod kulturowy electro/b-boy (muzyka Planet Rock, maskotka R080, rytm sekwencera w motion) jako 'gramatyka, nie kostium'.

**Lessons learned:**
- Prerender cicho pomijany na Vercelu (cache node_modules blokował postinstall; brak libnss3) — diagnoza i fix udokumentowane, weryfikować curl-em po każdym deployu.
- Przemek odrzuca LinkedIn-owy styl pipe-separated headlines — spokojna proza pełnozdaniowa.
- Trial wizualny zawsze za flagą z opisaną ścieżką revertu (HERO_WEBGL) — tanie eksperymenty bez ryzyka.

**Missed opportunities:**
- Trasy /pl + hreflang wciąż niewdrożone — nazwana 'największa szansa SEO' od 07.2026.
- Niespójność cen: publiczne w llms.txt, ukryte na kartach usług.
- reszek.studio nadal żywe i zaindeksowane bez 301 na r352.com.
- Niespójność ICP 5-300+ vs 30-300+ w kodzie Hero (TODO).

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-website.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/home-hero-webgl-trial.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-brand-vibe-electro.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-robot-mascot.md

</details>

---

### Brand centre r352 (r352.com/brand)

**Klient:** r352 (wewnętrzny standard marki)  
**Status:** LIVE v1.1 (od 12.07.2026) za hasłem (staticrypt, noindex); nowe standardy oznaczone jako propozycje do zatwierdzenia przez Reszka.

**Cel biznesowy:** Skodyfikować markę r352 w jednym gated artefakcie i jednocześnie zwalidować wzorzec .brand/ — brand centre jest pilotem tego samego produktu (Brand Hub), który r352 sprzedaje klientom.

**Problem:** Marka rosła iteracyjnie (trzy różne limonki, maskotka, shader hero) bez jednego źródła prawdy — kod strony i decyzje wizualne dryfowały względem niespisanych zasad.

**Proces:** Źródło prawdy = .brand/design-system.md (13 sekcji: system strony + logo, maskotka, zastosowania off-site, boilerplate, pytania otwarte) + .brand/brand-centre.html; aktualizacja: edycja HTML → staticrypt z hasłem → rename do public/brand/index.html → wstrzyknięcie noindex → vercel --prod.

**Workflow:** Każda sesja AI w repo zaczyna od .brand/ (wymuszone przez CLAUDE.md) → zmiany wizualne konfrontowane z guide'em → npm run brand:check wykrywa drift → re-encrypt i deploy.

**Architektura:** Samowystarczalny HTML (font Tanker w base64, Peak shader jako hero, scrollspy TOC); szyfrowanie client-side AES (staticrypt) z remember-me 30 dni i committed saltem; równolegle .brand/tokens.json jako maszynowa wersja tokenów.

**Narzędzia:** staticrypt (AES client-side), Vercel CLI, Node.js (scripts/brand-check.mjs), WebGL (Peak shader hero), base64 embedding fontów

**Agenci użyci:**
- Sesje Claude jako egzekutor standardów — CLAUDE.md kieruje każdą sesję do .brand/ przed pracą nad UI/copy.

**Agenci możliwi:**
- Agent generujący sekcje brand centre bezpośrednio z tokens.json (dziś HTML utrzymywany ręcznie obok źródła prawdy).
- Agent audytu off-site (checklist z sekcji 11) sprawdzający materiały zewnętrzne przed publikacją.

**Automatyzacje zrobione:**
- npm run brand:check — drift guard weryfikujący cytaty z guide'u, hexy i zasadę dashy względem kodu (z jawną allowlistą wyjątków).
- Committed .staticrypt.json (salt), żeby remember-me przetrwał kolejne szyfrowania.

**Automatyzacje możliwe:**
- Jeden skrypt update-flow (edycja → encrypt → noindex → deploy) zamiast 4 ręcznych kroków.
- Automatyczny screenshot-regression brand centre po zmianach (z obejściem limitu 32k px).

**Reusable assets:**
- Wzorzec .brand/ zwalidowany na własnej marce — bezpośredni prototyp szablonu w r352-framework.
- Mechanizm staticrypt+noindex+salt jako standard gated stron statycznych.
- brand-check.mjs jako przenośny wzorzec drift-guardu marka↔kod.
- Zasada 'three limes' (trzy odcienie z jawnie przypisanymi rolami: UI #D4FF00, logo #DAFF45, visor maskotki render-only).

**Unique elements (czego standardowa agencja nie robi):**
- Dogfooding: firma buduje dla siebie dokładnie ten artefakt, który sprzedaje — brand centre = żywe demo produktu Brand Hub.
- Drift guard w CI zamiast PDF-owego brand booka — guide jest egzekwowalny skryptem.
- Nowe standardy jawnie etykietowane 'proposed by this guide' — governance z rozdzieleniem propozycji od decyzji właściciela.
- Maskotka z kolorem render-only, celowo NIE będącym tokenem — świadoma granica systemu.

**Lessons learned:**
- Screenshoty Chromium stron >32k px wychodzą czarne poniżej folda — artefakt capture, nie renderu.
- Salt szyfrowania musi być w repo, inaczej każda re-encrypcja wylogowuje wszystkich.
- Trzy niezharmonizowane limonki wykryte dopiero przy kodyfikacji — spisanie systemu ujawnia dryf.

**Missed opportunities:**
- Update flow pozostaje 4-krokowy ręczny — nieautomatyzowany mimo powtarzalności.
- Brand centre nie generuje się z tokens.json — dwie reprezentacje utrzymywane równolegle.
- Sekcja 13 'open questions' bez domkniętych decyzji.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-brand-centre.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-robot-mascot.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-brand-vibe-electro.md

</details>

---

### Case studies r352.com/work

**Klient:** r352 (portfolio; materiały od klientów: Instytut Kawy, Twoje Menu, Pampelle, Benefit Systems, Sonova/Geers)  
**Status:** LIVE, iterowane (ostatnia duża sesja 02.08.2026); baseline Instytutu Kawy LOCKED i w trybie shadow na prośbę klienta; 2 shadow cases (Twoje Menu, Pampelle); Benefit rozszerzony o 2 landingi Zdrofit.

**Cel biznesowy:** Dostarczyć publiczny dowód na wysokości, na której r352 sprzedaje (flagowy proof: Sonova/Geers — 250+ lokalizacji na r3loop od 2022) i utrzymać rytm 1 referencyjnego case'u na kwartał.

**Problem:** Pozycjonowanie było ostrzejsze niż publiczny dowód za nim ('the site is ahead of the proof') — case'y istniały w NDA lub bez metryk, a klienci różnie reagują na publiczne listowanie.

**Proces:** Klient dostarcza screeny do ~/Desktop/R352 WEBSITE/Screeny Case/<Case>/ → konwersja do webp → obiekt Project w projects.tsx → galeria + ewentualny embed żywego prototypu → prerender do statycznego HTML → deploy; zmiany w locked case'ach tylko na wyraźną, konkretną prośbę.

**Workflow:** Iteracja z klientem na żywej stronie (klient akceptuje/odrzuca reworki), flagowanie isShadow zamiast usuwania, copy jakościowe bez fabrykowanych metryk dla case'ów bez zweryfikowanych liczb.

**Architektura:** Flaga isShadow w obiektach Project wyklucza case z trzech filtrów listingu w Work.tsx, ale /work/:id nadal działa w SPA (nieprerenderowany i poza sitemap = praktycznie niezaindeksowany). Galeria: object-contain na ciemnej ramie (bez cropu), cover: object-cover 21/9. Embed prototypu = statyczny plik w public/ z obowiązkowym trailing slashem.

**Narzędzia:** React/TypeScript (projects.tsx, Work.tsx, ProjectDetails), webp (konwersja screenów), Vercel + prerender pipeline, iframe embed statycznych prototypów

**Agenci użyci:**
- Agent kuratorski do prób galerii modułowej Instytutu Kawy (spec/opis/przepis/recenzje) — ostatecznie odrzuconej przez klienta.

**Agenci możliwi:**
- Agent generujący szkic case'u z F5 frameworku (szablon case-study.html z BACKLOG-u) na bazie repo klienta.
- Agent dystrybucji: case → seria LinkedIn + PDF sprzedażowy + opener outreach.

**Automatyzacje zrobione:**
- Prerender case'ów do statycznego HTML (pełna treść w źródle dla SEO).

**Automatyzacje możliwe:**
- Automatyczna konwersja i kadrowanie dostarczonych screenów do webp pod wymogi galerii/covera.
- Walidacja embedów (trailing slash, dostępność) jako krok buildu.

**Reusable assets:**
- Mechanizm shadow cases (isShadow) — wzorzec 'URL do sprzedaży 1:1 bez publicznego listingu'.
- Wzorzec galerii bez cropu (object-contain na ciemnej ramie) dla materiałów o różnych proporcjach.
- Struktura case'u z żywym embedem prototypu.

**Unique elements (czego standardowa agencja nie robi):**
- Shadow cases: case żyje pod URL-em dla rozmów sprzedażowych, ale nie istnieje publicznie — respektuje wrażliwość klientów bez utraty materiału.
- Twarda zasada uczciwości: żadnych fabrykowanych metryk — copy jakościowe, gdy liczb brak.
- Embed działającego prototypu w case study zamiast samych screenów.
- Klient nazywa metodologię (Geers/Sonova na r3loop) — proof kategorii, nie tylko realizacji.

**Lessons learned:**
- Klient IK odrzucił KAŻDY wariant reworku jednego dnia — locked baseline szanować, nie 'ulepszać' bez konkretnej prośby.
- Embed statyczny w SPA wymaga trailing slasha — bez niego router SPA połyka ścieżkę i renderuje 404 w iframe.
- Cover 21/9 upscaluje źródła poniżej ~1920px — wymagania na materiał wejściowy trzeba znać przed prośbą do klienta.
- Rola w projekcie osadzonym u dystrybutora (Pampelle) bywa nieweryfikowalna — oznaczać założenia.

**Missed opportunities:**
- Testimonial Sonova z placeholderem roli — bez realnego nazwiska/tytułu case nie jest referencyjny (znane od 07.2026).
- Flagowy case żyje tylko na stronie — brak dystrybucji (seria LinkedIn, PDF, opener) mimo zaplanowania.
- Osierocone nieużywane webp z odrzuconych reworków zalegają w repo.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-case-studies.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-operating-strategy.md

</details>

---

### betterguide.pl — hub ekosystemu BetterWorkplace

**Klient:** BetterWorkplace / DailyFruits (r352 jako doradca strategiczny)  
**Status:** LIVE; deploy wykonuje wyłącznie Reszek (projekt pod osobistym kontem Vercel 'r352' — Claude ma personal_scope_not_allowed).

**Cel biznesowy:** Jeden hub prezentacyjny 'Przewodnik po ekosystemie BetterWorkplace' (strategie, sekcja TeamBudget) jako narzędzie doradczo-sprzedażowe; podstrona /strategia została kanonem deliverable'u strategii w całym frameworku r352.

**Problem:** Materiały strategiczne dla klienta były rozproszone — potrzebne było jedno miejsce z bramką na wejściu i publicznymi podstronami do podsyłania konkretnych dokumentów.

**Proces:** Statyczny folder ~/Desktop/Claude_zadania/BetterWorkplace/r352-deploy/ deployowany w całości przez vercel --prod (NIE z gita) — live zawiera lokalne niezacommitowane zmiany; karty hub włącza się i wyłącza komentowaniem bloków <a class="hub-card">.

**Workflow:** Claude przygotowuje zmiany w folderze → Reszek deployuje ze swojego kontekstu Vercela (dashboard/CLI) → weryfikacja na live.

**Architektura:** Root index.html z client-side bramką hasłową; podstrony publiczne bez bramki (cleanUrls: betterguide.pl/tb-strategia = tb-strategia.html); non-www → 308 na www; w tym samym folderze CMS (cms.html + api/cms-*.js) — najprostszy subset rodziny CMS r352 z grupami regex i chat.js; mieszka tu też CMS TeamBudget.

**Narzędzia:** Vercel CLI (cleanUrls, redirects), statyczny HTML/CSS/JS, serverless api/ (CMS, HMAC auth), git (tylko częściowo — live ≠ repo)

**Agenci możliwi:**
- Agent aktualizacji treści hubu przez istniejący CMS (api/cms-*) zamiast ręcznej edycji plików.

**Automatyzacje zrobione:**
- CMS z HMAC auth i grupami regex (ta sama rodzina kodu co dailyfruits/bees-knees).
- Redirect non-www → www (308) i cleanUrls na poziomie konfiguracji Vercel.

**Automatyzacje możliwe:**
- Migracja projektu do team scope Vercela, żeby Claude mógł deployować (dziś twardy bloker).
- Deploy z gita zamiast z folderu — eliminacja dryfu live vs repo.

**Reusable assets:**
- Wzorzec hubu klienckiego: bramka na index + publiczne podstrony-deliverables do podsyłania linkiem.
- Podstrona /strategia jako wzorzec przeniesiony do spec/STRATEGIA-WZORZEC.md frameworku.
- Subset CMS jako baza wcześniejszej ekstrakcji szablonu cms/ we frameworku.

**Unique elements (czego standardowa agencja nie robi):**
- Deliverable strategii jako żywa strona WWW, nie PDF — Reszek: 'niech ta strategia będzie wyznacznikiem'.
- Selektywna prywatność: bramka tylko na spisie treści, poszczególne dokumenty celowo publiczne pod czystymi URL-ami.
- Hub jako warstwa nad wieloma projektami klienta (strategie + TeamBudget) zamiast osobnych wysyłek.

**Lessons learned:**
- Projekt pod osobistym kontem Vercel = automatyzacja deployu niemożliwa (personal_scope_not_allowed) — scope konta trzeba sprawdzać przed obietnicą automatyzacji.
- Deploy całego folderu poza gitem oznacza, że folder ~= live, a git kłamie — ryzyko przy każdej pracy w repo.
- Client-side bramka nie chroni podstron — świadomie akceptowany model, ale trzeba o nim pamiętać przy wrażliwych treściach.

**Missed opportunities:**
- Brak wersjonowania stanu live w git (niezacommitowane zmiany na produkcji).
- Deploy nieprzeniesiony do dostępnego scope'u mimo znanego blokera od 20.07.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/betterguide-deploy.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-framework-produkcyjny.md

</details>

---

### Strategia operacyjna r352 (living doc)

**Klient:** r352 (dokument zarządczy właściciela)  
**Status:** Żywy dokument (synteza 09.07.2026, korekty 10–11.07); część decyzji domknięta (ICP, brand vibe), część otwarta (kompas ZYSK proponowany, decyzja SaaS, pytania killing-the-company).

**Cel biznesowy:** Jeden spójny kompas operacyjny: sprzedawać warstwę operacyjną (nie output), ICP = multi-lokalizacyjne operacje marketingowe, drabina ofert Diagnostic €2k → Sprint → Retainer/Operating Partner, metryka nadrzędna = % przychodu recurring.

**Problem:** Ostre pozycjonowanie rozmywane 'agencyjnymi' zachowaniami (one-off projekty, polerowanie strony zamiast dowodu, founder jako wąskie gardło delivery) — strategia istniała w praktyce, ale nie była spisana i egzekwowalna.

**Proces:** Agent strategiczny zsyntetyzował strategię z treści żywej strony → korekta faktów przez Reszka (np. case Sonova z metrykami JUŻ istnieje — luka to dystrybucja, nie treść) → dołożenie ram z Drzewieckiego (kompas, weekly chess block, pelican risk) → aktualizacje wracają do dokumentu; priorytety w cyklu 90 dni.

**Workflow:** Dokument w pamięci Claude sprzężony linkami [[...]] z siecią notatek (framework, website, brand vibe) — każda sesja strategiczna czyta i aktualizuje ten sam plik.

**Architektura:** Warstwa dokumentowa: teza → ICP/beachhead → wedge → drabina ofert → AI defensibility ('govern AI, not just use AI') → GTM (kanał white-label dla agencji, operator-POV LinkedIn, referrale) → metryki → frame renunciacji (czego NIE robić).

**Narzędzia:** System pamięci Claude (living doc), analiza treści live site, ramy Drzewieckiego (Architektura Skuteczności)

**Agenci użyci:**
- Agent strategiczny, który wyprowadził pełną strategię z live strony (odwrócony kierunek: strona → strategia).

**Agenci możliwi:**
- Agent metryk: cykliczny przegląd Diagnostic→paid conversion i % recurring z przypomnieniem priorytetów 90-dniowych.
- Agent contentowy operator-POV: cotygodniowy szkic LinkedIn z języka strategii (pelican management, marathon vs chess) kierujący do Diagnostic.

**Automatyzacje zrobione:**
- _brak danych_

**Automatyzacje możliwe:**
- Zablokowany kalendarzowo 'weekly chess block' jako scheduled task z przygotowaną agendą.
- Automatyczne przypomnienie deadline'u weryfikacji rynkowej dla SaaS (Caterelo/regional.fit), gdy decyzja zapadnie.

**Reusable assets:**
- Sama struktura dokumentu (teza→ICP→wedge→drabina→GTM→metryki→renunciacja) jako szablon strategii dla klientów.
- Język contentowy do reużycia (pelican management, marathon vs chess, moat) dopasowany do lektur ICP.
- Frame 'presence 90%→15%' jako uniwersalny wykres sprzedażowy.

**Unique elements (czego standardowa agencja nie robi):**
- Strategia wyprowadzona przez agenta Z ISTNIEJĄCEJ strony, potem korygowana faktami — odwrotność klasycznego procesu.
- Jawna sekcja renunciacji: czego NIE robić (one-offy, konkurowanie ceną, polerowanie strony) równie ważna jak plan.
- Autobiograficzny kod kulturowy (b-boy ~2000) wpięty strategicznie w GTM jako kategoria-of-one, z regułą 'gramatyka, nie kostium'.
- Wprost nazwana asymetria: 'site is ahead of the proof' — rzadka samoświadomość w dokumentach strategicznych.

**Lessons learned:**
- Gated content empirycznie nie działa (testowane kampanie: lewe adresy, zero pipeline'u) — wzorzec: treść otwarta + narzędzia z wynikiem od razu, kontakt tylko za personalizację.
- Case bez nazwiska w testimonialu nie jest referencyjny — placeholder roli blokuje użycie sprzedażowe.
- Materiały dla Reszka bez żargonu branżowego (ABM, MQL/SQL) — rozpisywać po polsku.
- Największa luka to dystrybucja istniejącego dowodu, nie jego tworzenie.

**Missed opportunities:**
- Kanał white-label dla agencji wciąż tylko linkiem w stopce zamiast realnego motion BD (priorytet od 07.2026).
- Decyzja SaaS (Caterelo vs regional.fit — któremu deadline weryfikacji rynkowej) nadal otwarta.
- Kompas ZYSK zaproponowany, ale niezatwierdzony — bez niego metryki nie są wiążące.
- Cotygodniowy content operator-POV niewystartowany mimo statusu GTM #2.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-operating-strategy.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/gated-content-nie-dziala.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r352-brand-vibe-electro.md

</details>

---

## Infrastruktura automatyzacji

### r3loop.app (Briefly) — automatyzacja strategia + proposal

**Klient:** wewnętrzny (r352/Inleadia; pierwszy realny case: TeamBudget/BetterWorkplace, umówiony pilot kliencki)  
**Status:** LIVE na produkcji od 12.07.2026; ocena własna ~8050/10000; przed pilotem do domknięcia: weryfikacja domeny w Resend, kasowanie testowych briefów, przejście pełnej ścieżki

**Cel biznesowy:** Internal operating system agencji: klient sam wypełnia brief, maszyna generuje strategię i wycenę, a Przemek zostaje tylko jako QA i decydent — skrócenie cyklu ofertowego z dni do godzin i zdjęcie z niego pisania strategii ręcznie.

**Problem:** 3 z 7 etapów lejka (Strategy v1, Strategy v2, Proposal) wymagały ręcznego pisania i wstrzykiwania JSON-ów do bazy przez REST; brak automatycznego generatora oznaczał, że każdy nowy lead kosztował godziny pracy stratega.

**Proces:** Mechanika: Brief (wizard public link) → Readiness Score 0-100 → MACS auto-suggest → Strategy v1 → Critic 0-1000 → Strategy v2 (jeśli <750) → Proposal z bramkami (Critic≥750, MACS≠NO-GO). Klient dostaje 4 linki per engagement: wizard, /strategia, /materialy, /wycena z accept flow.

**Workflow:** Lead trafia na wizard przez public token → po submit generator LLM tworzy strategię w pętli z Criticiem (test: 845/1000 w 1 iteracji, realny case TeamBudget: 930/1000) → seeder proposala buduje SoW z pricingiem → Reszek decyduje o fazowaniu/trymowaniu → ClientShareCard udostępnia linki klienckie bramkowane client_share_scope. Osobny playbook rozróżnia lead ciepły (osobisty intake, pełne materiały, cykl 3-5 dni) i zimny (triage po MACS, NO-GO→odmowa 24h, HOLD→Diagnostic €2k).

**Architektura:** Next.js 14 + Supabase (projekt iicpeynpxpnuxzjmwcsh), Vercel (deploy ręcznie przez CLI `vercel --prod`, auto-deploy z GitHuba wyłączony), Anthropic claude-sonnet-5 jako generator z pętlą Critica, Resend do notyfikacji (env-gated), keep-alive cron /api/cron/keepalive przeciw pauzowaniu free-tier Supabase.

**Narzędzia:** Next.js 14 (repo reszkovy/briefly, lokalnie ~/Desktop/Claude_zadania/BRIEFER/briefing-app), Supabase (Postgres + RLS master-only na qualifications), Anthropic API (claude-sonnet-5, max_tokens 24k), Vercel CLI (scope reszkovys-projects), Resend (notyfikacje mailowe, konto w trybie testowym), Deterministyczne silniki własne: readiness.ts, macs.ts, strategy-critic.ts

**Agenci użyci:**
- Generator strategii LLM z pętlą samokrytyki (Sonnet generuje → Critic ocenia → iteracja przy <750)
- Seeder proposala z bramkami jakości (Critic≥750, MACS≠NO-GO)
- Claude w sesji jako operator ręcznego trybu wg runbooka (komendy 'Przepuść brief X', 'Wycena dla X, premium Y')

**Agenci możliwi:**
- Agent triage zimnych leadów: automatyczna klasyfikacja MACS + wysyłka odpowiedzi NO-GO/HOLD wg playbooka bez udziału Przemka
- Agent monitoringu jakości generacji: alert gdy Critic score spada lub JSON się nie waliduje (obecnie brak monitoringu błędów)
- Agent follow-upów posprzedażowych wg trackingu otwarć linków klienckich

**Automatyzacje zrobione:**
- Generator strategii E2E po submit briefu (845-930/1000 w 1 iteracji, koszt znikomy)
- Seeder proposala budujący pełny SoW z pricingiem z danych wizardu
- Deterministyczny Readiness Score (12 kryteriów) i MACS auto-suggest bez LLM
- Keep-alive cron na Vercelu (06:00 UTC) zapobiegający pauzowaniu Supabase free-tier
- Model 4 linków klienckich z bramkowaniem zakresu (client_share_scope) i accept flow wyceny

**Automatyzacje możliwe:**
- Notyfikacje mailowe na hello@r352.com po weryfikacji domeny r352.com w Resend (3 rekordy DNS w GoDaddy)
- Auto-kasowanie/oznaczanie testowych briefów i monitoring statusów (bug: świeży intake pokazywał 'completed' zamiast 'draft')
- Miesięczny model pricingu retainer/OP w silniku wyceny (dziś deliverables OP-owe pomijane bez wyceny)
- Auto-deploy GitHub→Vercel po ustabilizowaniu (dziś świadomie ręczny)

**Reusable assets:**
- Framework MACS jako własne IP kwalifikacyjne (auto-suggest + master-only RLS)
- Strategy Critic 0-1000 (10 deterministycznych checków) — wzorzec bramki jakości LLM wielokrotnego użytku
- 9-sekcyjny szablon JSON strategii (brand_architecture, role_cards, communication_matrix, journey_map itd.)
- Runbook operacyjny briefly-runbook.md z komendami i checklistą per brief
- Playbook lead ciepły/zimny (r3loop-playbook.vercel.app)
- Wzorzec keep-alive cron dla darmowych projektów Supabase

**Unique elements (czego standardowa agencja nie robi):**
- Pętla generator+Critic z twardym progiem liczbowym (750/1000) zamiast 'wygląda dobrze' — jakość strategii mierzona, nie oceniana na oko
- Bramki biznesowe wpięte w automatyzację (MACS NO-GO blokuje proposal) — maszyna odmawia złym leadom
- Conditional wizard skracający ścieżkę klienta z prostym scope z 8 do 3-4 kroków
- Read-only linki klienckie z rozdzieleniem tego co widzi klient/agent/master na poziomie RLS w bazie

**Lessons learned:**
- Free-tier Supabase pauzuje się po ~tygodniu bez ruchu i wygląda jak awaria auth — przyczyną obu 'bugów' był uśpiony projekt, nie kod
- Schema drift prod vs migracje (brak kolumny generated_by) — nie pisać do kolumn niezweryfikowanych na prod
- max_tokens 8k ucinał JSON strategii — generacja strukturalna wymaga 24k
- Hardcodowany data-theme='dark' + remap !important w globals.css psuje każdą nową rodzinę kolorów Tailwinda — theming globalny to dług
- Sekrety bootstrapowe (MASTER_BOOTSTRAP_SECRET) trzeba usuwać z env natychmiast po użyciu

**Missed opportunities:**
- Przez miesiące UI odsyłał do przycisku 'Generuj strategię', który nie istniał — audyt kodu ujawnił, że automatyzacja była tylko w komentarzach
- Brak monitoringu błędów generacji — pierwszy pilot kliencki może paść na cichym failu bez alertu
- Wizard niespójny z ofertą r352.com (brak ścieżki agency/white-label, project_type nie mapuje na produkty ze strony) — leady z witryny trafiają w niedopasowany intake
- Zero user testingu logiki MACS — cała kwalifikacja oparta na założeniach, nie walidacji (wskazane już w audycie 04.2026)

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/r3loop-briefly-app.md
- /Users/reszek/Desktop/Claude_zadania/BRIEFER/briefly-runbook.md
- /Users/reszek/Desktop/Claude_zadania/BRIEFER/AUDYT-GLOBALNY-2026-04-28.md
- /Users/reszek/Desktop/Claude_zadania/r3loop-os (statyczny prototyp: index/brief/guard.html)

</details>

---

### Narzędzie do briefowania (regional.fit / Club Manager Briefing System)

**Klient:** produkt pod Benefit Systems (buyer: Group Marketing Manager; pilot 20 lokalizacji, pricing 50-100k PLN)  
**Status:** MVP zbudowany (kod z pełną strukturą wg BUILD_SPEC, w src/lib są już pliki llm-auditor/embeddings/llm-config); plan 10-tygodniowy do pilot-ready spisany; ostatnie commity dot. approvals, delay costs i compact mode — projekt aktywny

**Cel biznesowy:** SaaS-owe narzędzie briefowania dla sieci fitness multi-location: club manager składa brief, walidator ocenia zgodność ze strategią marki, produkcja dostaje kolejkę zadań — sprzedawane jako pilot 50-100k PLN.

**Problem:** W sieciach typu Benefit/Zdrofit briefy z klubów są niekompletne, niezgodne ze strategią marki i przechodzą przez chaotyczny mailowy obieg akceptacji; walidator nie ma narzędzia do oceny jakości i zgodności briefu na skalę 20+ lokalizacji.

**Proces:** Ról-based workflow: CLUB_MANAGER tworzy brief w wizardzie → SUBMITTED → VALIDATOR w inboxie akceptuje/odsyła (CHANGES_REQUESTED) z pomocą alignment score → APPROVED tworzy ProductionTask w kanbanie → deliverables jako linki → DELIVERED/CLOSED. Statusy, priorytety i audit log w bazie.

**Workflow:** Warstwa AI audytu briefu przy submit: policy-engine (reguły, zero cost fallback) + ai-auditor (completeness/consistency) + llm-auditor (semantic alignment: brief → embedding → cosine similarity z chunkami StrategyDocument marki → score 0-100 + rationale po polsku); flag reasoning przez Haiku tłumaczy każde naruszenie reguły; wyniki cache'owane w Brief.aiAuditResult.

**Architektura:** Next.js 14 App Router (Server Components + Server Actions), PostgreSQL na Neon + Prisma, NextAuth v5, shadcn/ui + Tailwind, React Hook Form + Zod; warstwa LLM: Anthropic (Sonnet scoring, Haiku reasoning) + Voyage embeddings + pgvector z indeksem HNSW; deploy Vercel.

**Narzędzia:** Next.js 14 + Prisma + Neon Postgres (pgvector), NextAuth v5 (credentials), shadcn/ui, Zod, dnd-kit (kanban), Anthropic API (Sonnet + Haiku) i Voyage embeddings wg LLM_INTEGRATION_SPEC, Sentry (plan tygodnia 1) do monitoringu błędów, Vercel

**Agenci użyci:**
- llm-auditor: semantic alignment score briefu vs dokumenty strategii marki (RAG na pgvector)
- Flag reasoning: Haiku generuje po polsku 'dlaczego to problem dla tej marki' per naruszenie reguły
- ai-auditor + policy-engine jako deterministyczni 'agenci' completeness/consistency (fallback bez LLM)

**Agenci możliwi:**
- Brief quality check LLM (rozmyty cel, KPI nieliczalne, brak konkretu lokalnego) — zaplanowany jako 3. funkcja LLM, wynika wprost ze specu
- Agent auto-poprawy briefu: sugestie przeredagowania sekcji podnoszące alignment score przed submit
- Agent tygodniowego raportu dla Group Marketing Managera z alignmentu briefów per region/klub

**Automatyzacje zrobione:**
- Trójwarstwowy audyt briefu przy submit (rules + completeness + semantic) zapisywany do Brief.aiAuditResult z cache i recompute tylko przy zmianie treści
- Sortowanie inboxu walidatora po alignment score (najsłabsze briefy na wierzch)
- Cost caps zaszyte w llm-config.ts (hard stop $0.05/brief, $50/tenant/mc) z kalkulatorem kosztów per model
- Automatyczne liczenie kosztów opóźnień (delay costs 10 PLN/dzień) i badge'y alignmentu w UI (ostatnie commity)

**Automatyzacje możliwe:**
- E-maile transakcyjne o zmianach statusu (tydzień 4 planu — in-app notifications to MVP, mail zaplanowany)
- Automatyczny embedding nowych dokumentów strategii przy uploadzie (dziś skrypt ręczny scripts/embed-strategy-docs.ts)
- Multi-tenant po pilocie #1 (świadomie odłożony 2-tygodniowy sprint)
- Eskalacje SLA: auto-podbicie priorytetu/notyfikacja gdy brief wisi w SUBMITTED ponad X dni

**Reusable assets:**
- BUILD_SPEC.md (56 KB) — kompletny, gotowy do reużycia spec aplikacji ról-based briefing z pełną schemą Prisma
- LLM_INTEGRATION_SPEC.md z ready-to-paste skeletonami (llm-config, embeddings, llm-auditor) — wzorzec wpinania RAG-owego scoringu w dowolny produkt
- PLAN_10_TYG.md — szablon planu sprintu solo-foundera (10h/tydz, bramki tygodniowe, anti-abandonment retro)
- Wzorzec architektury 'deterministyczny rule engine + LLM jako warstwa semantyczna z fallbackiem'
- Policy engine + strategy alignment jako komponenty przenośne do innych narzędzi brand governance

**Unique elements (czego standardowa agencja nie robi):**
- Alignment score briefu liczony semantycznie względem realnych dokumentów strategii marki (RAG per brand), nie checklistą — tego nie robi żadne narzędzie briefowania na rynku PL
- Koszt LLM policzony i ograniczony z góry (~$0.014/brief, hard caps w kodzie) — inżynieria kosztowa jako feature
- Plan produktu zaprojektowany pod realne 10h/tygodnia z bramkami i triggerem anty-porzuceniowym
- Deterministyczny fallback dla każdej funkcji LLM (produkt działa przy padzie API)

**Lessons learned:**
- Kolejność implementacji funkcji LLM wg user value (alignment → reasoning → quality check), nie wg łatwości technicznej
- Cache wyników audytu z recompute tylko przy zmianie treści briefu — inaczej koszty i latencja rosną bez wartości
- Single-tenant w v1, multi-tenant dopiero po pierwszym pilocie — świadome cięcie zakresu pod sprzedaż
- Edge case'y zdefiniowane z góry (brief bez strategy docs, brief <50 znaków → score null z powodem) zamiast udawania wyniku

**Missed opportunities:**
- Silnik audytu briefów nie jest wystawiony jako komponent dla r3loop.app, mimo że oba produkty oceniają briefy — dwie osobne implementacje scoringu (readiness.ts vs llm-auditor.ts)
- Brak informacji o realnym demo z buyerem Benefit Systems — nieznane, czy plan 10-tygodniowy został dowieziony do go-live
- Wiedza o briefach z briefsync (39 realnych briefów z 8 tablic Trello) nie zasila korpusu testowego/treningowego alignment score

<details><summary>Źródła</summary>

- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/BUILD_SPEC.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/PLAN_10_TYG.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/LLM_INTEGRATION_SPEC.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/src/ (app, lib, components) + package.json
- git log repo (commity: approvals stats, delay costs, ClubContextPanel)

</details>

---

### briefsync — router feedbacku Trello↔Figma↔Dropbox + most do Obsidiana

**Klient:** wewnętrzny (obsługa podwykonawczyni Natalii Baranieckiej i 8 tablic klienckich: Benefit/Zdrofit, Geers/Sonova, Archicom, Daily Fruits, Hanoi, Ada, WALK, Personal)  
**Status:** DZIAŁA produkcyjnie: codzienny sync launchd 8:00 (daily.log żywy do 07.08), tryb wielotablicowy 8 tablic → 39+ briefów w Obsidianie; gałąź Dropbox→Trello niedokończona (brak access/refresh tokena)

**Cel biznesowy:** Zdjąć z Przemka rolę dyspozytora feedbacku między klientami (Trello), podwykonawcami (Figma) i plikami (Dropbox) — zadania i komentarze mają same trafiać tam, gdzie pracuje wykonawca, a stan projektów sam lądować w 'Personal OS' w Obsidianie.

**Problem:** Feedback klientów żyje w komentarzach Trello, produkcja w Figmie, gotowe pliki na Dropboxie — ręczne przenoszenie briefów, komentarzy i załączników między trzema narzędziami pochłaniało czas i gubiło kontekst (co nowe, co zaktualizowane, co zamknięte).

**Proces:** Komenda PRZENIEŚ = przyrostowy sync: klasyfikator dzieli karty na create (nowy brief) / feedback (nowy komentarz) / skip (bez zmian) / helper (pomijane) / remove (wykonane); w Figmie na stronie z dzisiejszą datą DD.MM budowane są karty-briefy (brief + załączniki jako realne obrazki + wątek komentarzy z highlightem najnowszego); równolegle obsidian_sync odzwierciedla stan w vaulcie (notatki briefów, feedback log, status done).

**Workflow:** sync_all.py iteruje po boards.json (8 tablic z mapowaniem klienta i wariantami nazw list) → briefsync.py plan pobiera karty przez Trello REST i klasyfikuje względem stanu (lastActionId) → obsidian_sync.py tworzy/aktualizuje notatki w Briefy/<klient>/ → daily_note.py buduje notatkę dnia (Przeterminowane/Pilne/Feedback/Nowe/Aktywne per klient/Zamknięte wczoraj) framowaną linkami do decision-framework; całość odpala launchd codziennie o 8:00, ręcznie ./update.sh.

**Architektura:** Czyste skrypty Python bez zależności chmurowych: briefsync.py (klasyfikator) + sync_all.py (runner wielotablicowy) + obsidian_sync.py (most do vaultu) + daily_note.py (notatka dnia) + daily.sh pod launchd; stan w JSON-ach (sync_state.json dla Figmy, obsidian_index.json dla Obsidiana — celowo rozdzielone); sekrety w gitignorowanym .env; gałąź Figma wykonywana przez agenta Claude (use_figma + upload_assets), bo pisze do aktywnego pliku desktop.

**Narzędzia:** Trello REST API (curl, key+token z env), Python 3 (briefsync.py, sync_all.py, obsidian_sync.py, daily_note.py), launchd (~/Library/LaunchAgents/com.reszek.briefsync.daily.plist, 8:00, nadrabia po uśpieniu), Figma przez use_figma MCP + upload_assets (obrazki: placeholder→submitUrl→imageHash→fills), Obsidian vault jako baza wiedzy (Dataview po tags: brief + status), Dropbox app 'ClaudeBriefBot' (utworzona, token niedokończony)

**Agenci użyci:**
- Claude jako agent-dyspozytor wykonujący PRZENIEŚ: pobiera załączniki z Trello, buduje karty w Figmie, podmienia fills obrazków, zapisuje stan
- Cron sesyjny (Tryb A, co godzinę :07) odpalający PRZENIEŚ póki sesja Claude żyje

**Agenci możliwi:**
- Domknięcie gałęzi Dropbox→Trello: agent wklejający linki gotowych plików Natalii na właściwe karty (app istnieje, brakuje refresh tokena)
- Natywne komentarze Trello→Figma przez Figma PAT/REST (use_figma nie umie komentarzy) — feedback klienta ląduje jako komentarz przy właściwej grafice
- Agent podsumowujący notatkę dnia głosowo/mailowo zamiast tylko pliku w vaulcie

**Automatyzacje zrobione:**
- Codzienny bezobsługowy sync 8 tablic Trello do Obsidiana przez launchd (działa niezależnie od Claude, żywy log)
- Przyrostowa klasyfikacja z anty-duplikacją po lastActionId i osobnym stanem per cel (Figma vs Obsidian)
- Automatyczne domykanie: karta znikająca z aktywnych list = status done w Obsidianie + usunięcie ze stanu (idempotentnie)
- Notatka dnia z priorytetyzacją (przeterminowane/pilne ≤2 dni) budowana z frontmatter briefów
- Pipeline obrazków Trello→Figma z rate-limit sleep 3s (uploader w Pythonie)

**Automatyzacje możliwe:**
- Webhook Trello (Tryb C always-on) zamiast codziennego pollingu — feedback w Figmie w minuty, nie doby
- Dropbox→Trello auto-link po dostarczeniu refresh tokena (jedyny brakujący element architektury 3-stronnej)
- Rozszerzenie na tablicę Inleadia (id znane 68732c2a85b2f877124e25e4, świadomie niedodana)
- Auto-alert na Slack/mail gdy daily run w daily.log kończy się błędem

**Reusable assets:**
- briefsync.py — generyczny klasyfikator sync Trello (create/feedback/skip/helper/remove) konfigurowany env, przenośny na dowolną tablicę
- Wzorzec 'osobny stan per konsument' (sync_state.json vs obsidian_index.json) dla wielu odbiorców jednego źródła
- boards.json — deklaratywna konfiguracja wielotablicowa z mapowaniem klientów i wariantów nazw list
- Technika upload obrazków do Figmy (placeholder→upload_assets→fills) z obejściem rate-limitów
- Wzorzec launchd daily z logiem i nadrabianiem po uśpieniu laptopa
- Szablon briefu Obsidian (Systems/Brief Template.md) + dashboard Dataview

**Unique elements (czego standardowa agencja nie robi):**
- Trello = egzekucja, Obsidian = strategia: sync briefów zasila 'Personal OS', a notatka dnia framuje zadania wiedzą o właścicielu ([[decision-framework]]/[[soul]]) — to nie jest zwykła integracja, to warstwa decyzyjna
- Claude jako runtime części pipeline'u (Figma) przy w pełni autonomicznej reszcie (Python+launchd) — świadomy podział na to, co musi być agentowe, i to, co nie
- Reguła BOARD_TAG izolująca 'remove' per tablica — wielotenantowość stanu przemyślana po realnym bugu
- Kasowanie kart wykonanych z Figmy przy zachowaniu archiwum done w Obsidianie

**Lessons learned:**
- Bez izolacji stanu per tablica tablice nawzajem oznaczały sobie briefy jako done — multi-source sync wymaga tagowania pochodzenia
- Idempotencja domykania: status done musi usuwać wpis ze stanu i mieć guard, inaczej odpala się co uruchomienie
- Nie hardkodować daty — realny błąd budowania na wczorajszej stronie Figmy; zawsze `date` z systemu
- use_figma pisze do AKTYWNEGO pliku desktop, nie do fileKey — cloud automation nie dosięgnie lokalnej wtyczki (dlatego cloud świadomie odrzucony)
- Submit URL-e uploadów Figmy są single-use i wygasają po 10 min; >7 POST-ów w serii zrywa połączenia

**Missed opportunities:**
- Gałąź Dropbox→Trello wisi niedokończona od czerwca (token ~4h zamiast refresh tokena) — trzecia noga architektury nigdy nie ruszyła
- Trello→Figma nadal wymaga otwartego desktopu i żywej sesji Claude — brak przejścia na Figma REST API z PAT, które uniezależniłoby sync
- 39 realnych briefów z 8 klientów to gotowy korpus do testowania alignment score 'Narzędzia do briefowania' — nieużyty

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/briefing-tool-system.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/briefsync/ (briefsync.py, sync_all.py, obsidian_sync.py, daily_note.py, daily.sh, update.sh, boards.json, daily.log)

</details>

---

### Pipeline publikacji Medium (r352 Journal → Medium)

**Klient:** wewnętrzny (content marketing r352)  
**Status:** DZIAŁA — sprawdzony na 2 draftach (07.2026); sezon publikacji zaplanowany w PUBLISHING-PLAN.md, kadencja środa 9:00 CET + LinkedIn companion

**Cel biznesowy:** Syndykacja artykułów z r352.com/journal na Medium bez utraty SEO (canonical) i bez ręcznej, błędogennej roboty formatowania — budowa zasięgu treści przy minimalnym udziale Przemka (jego klik = tylko Publish).

**Problem:** Ręczne wklejanie artykułów na Medium gubi canonical (kara SEO za duplicate content), importer Medium psuje tekst (145 samowolnych em-dashy w jednym artykule, doklejany sufiks tytułu), a tagowanie i cover przez UI są zawodne przy klikaniu syntetycznym.

**Proces:** Pięć kroków: (1) import przez medium.com/p/import z URL r352.com/journal/N (ustawia rel=canonical, warunek: strona live z 200), (2) czystka em-dashy przez JS w edytorze, (3) tagi w dialogu publish klawiaturą (type→wait 3-4s→Down→Return, weryfikacja chipów zoomem), (4) cover przez schowek (sips webp→jpeg, osascript clipboard, cmd+V na początku artykułu — pierwszy obrazek = featured), (5) Publish klika Reszek.

**Workflow:** Sterowanie przeglądarką przez claude-in-chrome: kluczowy trik to TreeWalker po text nodes w div[contenteditable] + dispatch InputEvent — edytor Medium serializuje DOM, więc bezpośrednie edycje tekstu PRZETRWAJĄ reload (weryfikacja: reload draftu i ponowne zliczenie). Tytuł czyszczony tą samą techniką (h3.graf--title, strip sufiksu ' - r352 Journal'). Kolejność sezonu i tagi/covery per post w ~/Downloads/medium/PUBLISHING-PLAN.md.

**Architektura:** Browser automation bez API (Medium nie daje sensownego API do publikacji): claude-in-chrome (javascript_tool + klawiatura + screenshoty weryfikacyjne) + narzędzia macOS (sips do konwersji, osascript do schowka); źródło prawdy treści = r352.com/journal (posty flipowane published:true przed importem).

**Narzędzia:** claude-in-chrome (javascript_tool, keyboard input, zoom screenshot), Importer Medium (medium.com/p/import) dla canonical, sips (konwersja webp→jpeg) + osascript (clipboard jako JPEG picture), PUBLISHING-PLAN.md jako plan sezonu (kolejność, tagi, covery, hooki LinkedIn)

**Agenci użyci:**
- Claude jako operator przeglądarki wykonujący cały import+cleanup+tagowanie+cover; człowiek tylko klika Publish

**Agenci możliwi:**
- Agent kadencji: cotygodniowe przypomnienie/przygotowanie kolejnego draftu ze środowej kolejki wg PUBLISHING-PLAN.md
- Agent LinkedIn companion: publikacja posta towarzyszącego 1-2h po Medium z hookiem z planu
- Pre-flight checker: automatyczna weryfikacja że journal/N zwraca 200 (nie 301) i ma published:true przed importem

**Automatyzacje zrobione:**
- Masowa czystka artefaktów importera przez DOM (145 em-dashy naraz) z weryfikacją przez reload
- Niezawodne tagowanie klawiaturą zamiast zawodnych syntetycznych klików w dropdown
- Wstawianie cover image przez schowek systemowy (jedyna działająca droga bez uploadu plikiem)
- Udokumentowana powtarzalna procedura 5 kroków — każdy kolejny artykuł to odtworzenie, nie odkrywanie

**Automatyzacje możliwe:**
- Pełny cykl tygodniowy jako zaplanowane zadanie (przygotowanie draftu w środę rano, Reszkowi zostaje 1 klik)
- Automatyczne flipy published:true dla Journal 9 i 10 przed ich importami (znany warunek wstępny)
- Walidator draftu: zliczenie em-dashy i sprawdzenie sufiksu tytułu przed pokazaniem do publikacji

**Reusable assets:**
- Technika 'DOM edit persists': TreeWalker + InputEvent w edytorach contenteditable serializujących DOM — przenośna na inne edytory webowe bez API
- Wzorzec tagowania klawiaturą w dropdownach z opóźnieniem — do każdego zawodnego autocomplete
- Trik clipboard-paste obrazka przez osascript — uniwersalny dla uploadów bez pola file
- PUBLISHING-PLAN.md jako szablon planu sezonu contentowego z kadencją i companion postami

**Unique elements (czego standardowa agencja nie robi):**
- Publikacja na platformie bez API zautomatyzowana do poziomu 'człowiek = 1 klik' przez inżynierię zachowań edytora (odkrycie, że Medium serializuje DOM)
- Import-first zamiast paste — SEO (canonical) wbudowane w proces od pierwszego kroku, nie naprawiane po fakcie
- Weryfikacja każdego kroku (reload i re-count, zoom na chipy tagów) zgodna z zasadą verify-first

**Lessons learned:**
- Importer Medium cicho psuje treść (' - ' → em-dash, sufiks tytułu z <title>) — każdy import wymaga czystki
- Syntetyczne kliki w dropdowny Medium są zawodne; klawiatura z odczekaniem 3-4s działa deterministycznie
- Za krótkie czekanie na dropdown = wybór złej opcji — timing jest częścią niezawodności automatyzacji UI
- Warunek wstępny importu: strona kanoniczna musi zwracać 200, nie 301

**Missed opportunities:**
- Pipeline żyje jako wiedza proceduralna w pamięci/planie, nie jako skrypt — każde uruchomienie to sesja agentowa zamiast odpalanego narzędzia
- Brak spiętej automatyzacji LinkedIn companion, mimo że hooki są już napisane w planie
- Kadencja środowa nie ma przypomnienia/schedulera — zależy od pamięci Przemka

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/medium-publishing-pipeline.md

</details>

---

### Wiedza o źródłach stockowych (komponent infrastruktury researchu obrazów)

**Klient:** wewnętrzny (komponent wielokrotnego użytku; pierwszy case: zdjęcia 33 polskich miast w stocki-miasta/)  
**Status:** Zmapowane i zweryfikowane 08.2026, zapisane jako pamięć referencyjna + działający pipeline harvest→scoring→galeria w stocki-miasta/

**Cel biznesowy:** Jednorazowo zmapować, które stocki da się przeszukiwać automatycznie z Claude Code i jak, żeby każdy kolejny projekt wymagający zdjęć (landingi, decki, case studies) korzystał z gotowej ścieżki zamiast ręcznego przeklikiwania stocków.

**Problem:** Automatyczny research zdjęć rozbija się o niejawne ograniczenia źródeł: semantyczne wyszukiwarki zwracają złe miasta zamiast pustki, CDN-y blokują hotlinki (403), popularne API odrzucają ruch ze środowiska agenta (401/307), a limity i niestabilne endpointy timeoutują — bez tej wiedzy każdy projekt odkrywa to od zera.

**Proces:** Per źródło ustalono: kanał dostępu (MCP/scrape/API), format wyników, pułapki i obejścia. Adobe Stock przez MCP asset_search (StockAsset, miniatury ftcdn.net) z filtrowaniem po nazwie w tytule; Freepik/Magnific przez stock_search ze składaniem linku z previewUrl+id; Envato tylko scrape SSR bez podglądów; Unsplash/Pexels zablokowane; Openverse jako najlepsze otwarte źródło z resizerem Wikimedia Special:FilePath.

**Workflow:** W projekcie stocki-miasta: harvest_free.py zbiera kandydatów → dane.json → final_pick.py/scoring odsiewa śmieci (mapy, herby, tabor) → build_final_html.py generuje galerię przeglądową (finalna-lista.html/index.html) do decyzji człowieka.

**Architektura:** Warstwa wiedzy (memory stock-photo-sources.md) + skrypty Python per case (harvest, scoring, build HTML); dostęp przez MCP Adobe/Freepik tam gdzie jest, REST Openverse bez klucza, scrape SSR dla Envato; wyniki materializowane w JSON i statycznym HTML.

**Narzędzia:** Adobe MCP asset_search (entityScope StockAsset, renditionURL z ftcdn.net), Freepik/Magnific MCP stock_search + stock_get, Openverse API (api.openverse.org/v1/images, bez klucza) + resizer commons.wikimedia.org Special:FilePath?width=500, Scrape SSR elements.envato.com (data-testid=item-link), Python (harvest_free.py, final_pick.py, build_final_html.py w stocki-miasta/)

**Agenci użyci:**
- Claude jako researcher wykonujący harvest wieloźródłowy i scoring trafności wyników per miasto

**Agenci możliwi:**
- Generyczny agent 'znajdź mi zdjęcia X' reużywający tę mapę źródeł dla dowolnego briefu wizualnego (nie tylko miast)
- Agent walidacji trafności: automatyczne odrzucanie wyników, których tytuł nie zawiera szukanej frazy (obejście semantycznych wyszukiwarek)
- Wpięcie researchu stockowego jako kroku w pipeline Foundation Pack / materiałów klienckich r3loop

**Automatyzacje zrobione:**
- Zautomatyzowany harvest z 4 typów źródeł z obejściami ich ograniczeń (paginacja Openverse ≤12, filtrowanie po tytule, składanie linków Magnific)
- Scoring/odsiew śmieci z Openverse (mapy administracyjne, flagi, herby) przed pokazaniem człowiekowi
- Generacja statycznej galerii HTML do szybkiej decyzji wizualnej

**Automatyzacje możliwe:**
- Opakowanie całości w jeden skrypt/skill 'stock-search <fraza>' zamiast wiedzy rozproszonej memory+skrypty per case
- Cache wyników per fraza, żeby kolejne projekty nie odpytywały źródeł ponownie
- Automatyczne licencjonowanie i pobranie wybranych pozycji Adobe przez asset_license_and_download_stock po akceptacji człowieka

**Reusable assets:**
- Memory stock-photo-sources.md — kompletna mapa 'co działa, co nie i jak' dla 5 rodzin źródeł
- Wzorzec resizera Wikimedia (Special:FilePath?width=) jako stabilna alternatywa dla łamliwych endpointów /thumb/
- Skrypty harvest+scoring+galeria HTML jako szablon researchu wizualnego
- Reguła filtrowania wyników semantycznych wyszukiwarek po nazwie w tytule

**Unique elements (czego standardowa agencja nie robi):**
- Traktowanie negatywnych ustaleń (Unsplash/Pexels zablokowane, Envato bez podglądów) jako aktywów — zapisane, żeby nikt nie tracił na to czasu ponownie
- Odkrycie, że Adobe Stock jest wyszukiwarką semantyczną, która przy braku trafień podstawia inne miasta — i procedura obrony przed tym
- Openverse jako niedoceniane najlepsze źródło dla małych polskich miast — przewaga wiedzy lokalnej nad domyślnym sięganiem po duże stocki

**Lessons learned:**
- Wyszukiwarki semantyczne nie zwracają pustki — brak trafienia wygląda jak trafienie i wymaga filtra po tytule
- Blokady CDN/API są per środowisko (403 dla hotlinków Envato, 401/307 Unsplash z sandboxa) — testować z realnego runtime'u, nie zakładać
- Małe limity bywają twarde: page_size >12 w Openverse timeoutuje; polskie znaki w zapytaniu potrafią decydować o trafieniu
- Ręcznie sklejane ścieżki (thumb Wikimedia) są łamliwe — szukać oficjalnego resizera zamiast reverse-engineeringu URL-i

**Missed opportunities:**
- Wiedza nie jest jeszcze opakowana w reużywalny skill/komendę — kolejny projekt musi wiedzieć, że ta pamięć istnieje
- Brak spięcia z procesami klienckimi (moodboardy briefsync/Figma, materiały r3loop), gdzie research zdjęć powtarza się przy każdym projekcie

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/stock-photo-sources.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/stocki-miasta/ (harvest_free.py, final_pick.py, build_final_html.py, dane.json, finalna-lista.html)
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/preview-server-sandbox-scratchpad.md (kontekst ograniczeń sandboxa)

</details>

---

## Klient: DailyFruits / Better Workplace

### Relaunch dailyfruits.pl (WordPress → statyczny + Vercel)

**Klient:** DailyFruits / Better Workplace  
**Status:** LIVE — cutover wykonany 03.07.2026, każdy push na main = produkcja; odłożone: a11y na życzenie, odchudzenie repo 2.4 GB

**Cel biznesowy:** Zastąpienie starej strony nginx/WordPress szybką stroną statyczną z pełną kontrolą nad kodem, SEO i deployem, bez utraty ruchu organicznego przy migracji.

**Problem:** Stary WordPress był wolny i nieelastyczny, a migracja groziła utratą SEO — 291 starych URL-i wymagało obsłużenia; ~95 stron HTML bez systemu współdzielenia komponentów groziło rozjazdem treści.

**Proces:** Audyt i konsolidacja CSS do shared.css v2.0 → własny system includes (_includes/ + scripts/build.js) → CI blokujące (validate.py, build --check, htmlhint; Lighthouse informacyjnie) → audyt 291 starych URL-i do 0×404 (redirecty w vercel.json) → testy formularza i cross-browser → cutover DNS 03.07.2026.

**Workflow:** Zmiany wyłącznie w klonie ~/Fruityyyy na gałęzi main → push na GitHub (reszkovy/dailyfruits-website) → CI w .github/workflows/ci.yml → automatyczny deploy Vercel na produkcję dailyfruits.pl.

**Architektura:** ~95 statycznych stron HTML + shared.css + _includes (gtm/footer/mobile-menu) wstrzykiwane przez scripts/build.js (znaczniki <!--#include:NAZWA-->); vercel.json = redirecty, headery, rewrite'y; api/ = funkcje serverless CMS; hosting Vercel z auto-deployem z main.

**Narzędzia:** HTML/CSS/JS statyczny (bez frameworka), Node.js scripts/build.js (mini-SSG), GitHub Actions CI (htmlhint, validate.py, Lighthouse), Vercel (hosting + redirecty), git / GitHub

**Agenci użyci:**
- Claude Code jako developer, architekt i QA w sesjach prowadzonych przez Przemka (brak autonomicznych agentów)

**Agenci możliwi:**
- Agent monitorujący produkcję: cykliczny check kluczowych URL-i, formularzy i statusów 200/301 z raportem odchyleń
- Agent release: samodzielne przejście checklisty przed-deployowej (build --check, htmlhint, diff z produkcją) przed każdym pushem

**Automatyzacje zrobione:**
- build.js propaguje zmianę w jednym include na ~95 stron jednym poleceniem
- CI blokujące odrzuca commity z błędami HTML lub niezbudowanymi includami
- Push na main = automatyczna publikacja przez Vercel (zero ręcznego deployu)

**Automatyzacje możliwe:**
- Automatyczny audyt redirectów i 404 (skrypt curl -L po pełnej mapie 291+144 URL-i) jako krok CI
- Cron/monitoring produkcji wykrywający regresje (formularz, sitemap, canonicale)
- Automatyczne odchudzanie/LFS dla assetów (repo 2.4 GB) po wyraźnej zgodzie

**Reusable assets:**
- System includes + build.js = minimalistyczny SSG do przeniesienia na każdego klienta ze statyczną stroną
- Wzorzec migracji WP→static ze 100% pokryciem starych URL-i (audyt → mapa redirectów → weryfikacja curl)
- Szablon CI dla stron statycznych (validate + build check + htmlhint + Lighthouse)

**Unique elements (czego standardowa agencja nie robi):**
- Własny build system ~100 linii zamiast frameworka — zero zależności, pełna przejrzystość dla klienta
- Pełny audyt 291 historycznych URL-i do 0×404 przed cutoverem — agencje zwykle robią wyrywkową mapę 301
- Model commit-na-main z blokującym CI zamiast procesu PR — szybkość bez utraty bezpieczeństwa

**Lessons learned:**
- Dwa klony repo na jednej maszynie = realne ryzyko pracy na przeterminowanej wersji; weryfikować git rev-list --left-right --count origin/main...HEAD (produkcyjny = 0 0) i porównywać z żywym HTML przez curl
- Catch-all trailing-slash w vercel.json potrafi cieniować poprawne redirecty — testować całą mapę URL-i, nie próbki
- Zasada verify-first: przed twierdzeniem 'działa' sprawdzić na produkcji, nie w klonie

**Missed opportunities:**
- Brak środowiska staging — push na main to od razu produkcja, bez siatki bezpieczeństwa poza CI
- Audyt redirectów zrobiony ręcznie/sesyjnie zamiast jako trwały, powtarzalny check w CI
- Repo 2.4 GB nieodchudzone — spowalnia klony i CI

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-relaunch.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-repo-clones.md
- /Users/reszek/Fruityyyy (struktura katalogu)

</details>

---

### CMS v6 — panel /admin (git jako backend)

**Klient:** DailyFruits / Better Workplace  
**Status:** LIVE na dailyfruits.pl/admin (v6 kompletny: Blog/Strony/Produkty/Menu/Kosz/Historia); pipeline docx→AI→blog świadomie odłożony na wyraźną prośbę klienta

**Cel biznesowy:** Umożliwić nietechnicznej osobie u klienta samodzielną publikację wpisów i edycję treści strony statycznej — bez developera, bez tradycyjnego CMS i bez ryzyka rozjechania strony.

**Problem:** Strona statyczna nie miała żadnego CMS, a stary panel parsował strukturę HTML sprzed ~389 commitów i pokazywał puste treści; klient potrzebował edycji tekstów, zdjęć, 53 kart produktów, menu i bloga.

**Proces:** Iteracje v2→v6 w serii PR #1–#10 (03.07.2026): przebudowa admin.html + api/posts.js → api/content.js z zakładkami Strony/Produkty/Menu (62 strony, 482 pola, 53 produkty) → belka zapisu z undo, Kosz, wskaźnik deployu → edytor wizualny w iframe → branding Achiko + Historia/Revert; testy harness 88 OK; potem poprawki bugów (duplikaty składników, reset hasła, GITHUB_TOKEN).

**Workflow:** Edytor loguje się hasłem (token = HMAC hasła) → edycja treści w panelu (lista pól albo tryb wizualny na kopii strony) → zapis = commit wielu plików JEDNYM commitem przez GitHub Git Data API → Vercel publikuje; bezpieczeństwo edytora: Cofnij → Kosz → Historia (revert = nowy commit).

**Architektura:** admin.html (SPA client-side) + funkcje serverless Vercel (api/posts.js, api/content.js, api/_config.js); GitHub pełni rolę bazy danych — treść, historia wersji i kosz to commity; inwentarz tekstów offsetowy (title/meta/nagłówki/akapity/alty) weryfikowany sha+old; edytor wizualny = iframe srcdoc z wyciętymi skryptami i parowaniem text node'ów po kolejności; env: CMS_PASSWORD + GITHUB_TOKEN.

**Narzędzia:** Vercel serverless functions, GitHub Git Data API (multi-file commit, historia, revert), WYSIWYG z sanityzacją do dozwolonych tagów, Vercel CLI (env vars), harness testowy Node (test-cms/test-content/test-products.cjs)

**Agenci użyci:**
- Claude Code jako jedyny wykonawca (kod, testy, debug) pod nadzorem Przemka

**Agenci możliwi:**
- Agent redakcyjny: docx z Google Drive → sformatowany on-brand wpis → PR do jednorazowej akceptacji (pipeline już zaprojektowany w pamięci, czeka na zgodę)
- Agent QA: po każdym deployu przechodzi CMS end-to-end (login, edycja, zapis, revert) i raportuje regresje

**Automatyzacje zrobione:**
- Auto-sync kart wpisów i liczników filtrów w blog.html + sitemap.xml przy każdej publikacji
- Zapis wielu plików jednym atomowym commitem (commitFiles przez Git Data API)
- Nowy wpis = klon najnowszego jako szkielet — zawsze zgodny z aktualnymi _includes
- Wskaźnik statusu publikacji na żywo z GitHub deployments API

**Automatyzacje możliwe:**
- Pipeline docx→AI→blog z bramką PR (Vercel Cron lub GitHub Actions, reużywa istniejący GITHUB_TOKEN) — zaprojektowany, niewdrożony
- Rate-limit na API panelu (znana, nienaprawiona słabość)
- Trwałe testy CMS w CI zamiast sesyjnego harnessa

**Reusable assets:**
- Pakiet reużywalny README-CMS.md + api/_config.js z miejscami markup-specyficznymi oznaczonymi // MARKUP: — gotowy do przeniesienia na innego klienta
- Wzorzec architektury 'GitHub jako baza CMS' (zero infrastruktury bazodanowej, darmowa historia wersji)
- Sprawdzony przepis ręcznego dodania wpisu przez kod (szablon kroków w pamięci)
- Zaprojektowany, gotowy do wdrożenia pipeline docx→AI→blog z bramką review

**Unique elements (czego standardowa agencja nie robi):**
- CMS bez bazy danych — git jest backendem, więc każda zmiana ma commit, diff i revert za darmo
- Edytor wizualny na iframe srcdoc z parowaniem tekstów po kolejności node'ów — działa na dowolnym HTML bez atrybutów data-*
- Świadoma decyzja produktowa scope: 'treść tak, struktura nie' — panel z założenia nie pozwala rozjechać layoutu
- Trzystopniowy model bezpieczeństwa edytora (Cofnij → Kosz → Historia) w narzędziu klasy wewnętrznej

**Lessons learned:**
- Brakujący env (GITHUB_TOKEN) objawiał się jako 'CMS w ogóle nie działa' — diagnozę zaczynać od env vars, nie od kodu
- Parser treści musi śledzić AKTUALNĄ strukturę HTML — stary panel umarł, bo struktura odjechała o ~389 commitów
- Non-greedy regex podmieniał tylko pierwszą <ul class=skladniki> → duplikaty; budować jeden kanoniczny kształt sekcji (buildSklad) zamiast łatać fragmenty
- CMS commituje wprost na origin/main — lokalny klon bywa w tyle, git pull --ff-only PRZED każdą pracą na plikach treści

**Missed opportunities:**
- Brak rate-limitu na API — znana słabość bezpieczeństwa
- Testy harness pozostały sesyjne (scratchpad) zamiast trafić do repo/CI
- GITHUB_TOKEN z gh CLI usera zamiast fine-grained PAT o minimalnych uprawnieniach
- Pipeline blogowy zaprojektowany, ale niewdrożony nawet jako prototyp na jednym docx

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-blog-pipeline.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-cms-scope.md

</details>

---

### Architektura SEO /oferta + archiwum blogowe + performance

**Klient:** DailyFruits / Better Workplace  
**Status:** Wdrożone — audyt zaleceń SEO 37/37 PASS (30.07.2026), performance desktop 52→94, archiwum 100% pokrycia starych URL-i; otwarte: 5 kategorii net-new bez stron standalone, walidacja formularza po stronie klienta

**Cel biznesowy:** Ochrona i odbudowa widoczności organicznej po migracji: uporządkowanie architektury URL, likwidacja kanibalizacji, pełne pokrycie historycznych adresów i poprawa Core Web Vitals.

**Problem:** Deep-linki UX kanibalizowały strony kategorii SEO, migracja omyłkowo ustawiła www jako primary (spadki w GSC/Senuto), 205 starych URL-i blogowych z arkusza SAMOSEO nie miało domu, a lab performance wynosił 52.

**Proces:** Rozpoznanie dwóch równoległych systemów URL → konsolidacja canonical deep-linków do /oferta (koniec kanibalizacji) → fix www/non-www (Primary Domain + przywrócenie wszystkich self-URL, commit 07b33d7) → audyt 18 zaleceń zewnętrznego SEO (Michał Pawelec, samoseo.pl) do 37/37 PASS → odtworzenie 147 wpisów z Wayback Machine (pełne pokrycie 205 URL-i: 134 strony 1:1 + 301-ki) → optymalizacja performance 52→94 (lenis self-host, srcset, CSS keyframes zamiast JS-gated animacji, lazy-start analytics).

**Workflow:** Mail + publicznie czytelny arkusz Google od zewnętrznego SEO → audyt i wdrożenie przez Claude'a commitami na main → potrójna weryfikacja na produkcji przez curl → raport zwrotny; dane z arkusza SAMOSEO pobierane bezpośrednio (bez czekania na człowieka).

**Architektura:** Dwa systemy URL: (A) 11 stron standalone oferta/<slug>.html — self canonical, w sitemap, linkowane sitewide; (B) 9 deep-linków UX = rewrite w vercel.json do oferta.html z canonical skonsolidowanym do /oferta, poza sitemap; 144 redirecty w vercel.json (biegną PRZED filesystemem); archiwum blog/<slug>.html jako celowe strony-sieroty (self-canonical, w sitemap 227 URL); llms.txt wg spec llmstxt.org.

**Narzędzia:** vercel.json (redirects/rewrites/trailingSlash), Wayback Machine + pipeline Python (wayback_fetch.py, blog_generate.py), arkusz Google SAMOSEO (eksport xlsx), PageSpeed Insights / Lighthouse, curl -L do weryfikacji redirectów, GSC/Senuto (po stronie zewnętrznego SEO)

**Agenci użyci:**
- Claude Code jako wykonawca audytu i wdrożeń; zewnętrzny konsultant SEO (człowiek) jako źródło zaleceń i danych

**Agenci możliwi:**
- Agent SEO-watchdog: cykliczny przebieg checklisty 37 punktów + pełnej mapy redirectów z alertem przy regresji
- Agent generujący strony standalone dla 5 kategorii net-new z szablonu istniejących 11 (treść ~1200 słów do akceptacji)

**Automatyzacje zrobione:**
- Pipeline wayback_fetch.py + blog_generate.py automatycznie odtworzył 147 archiwalnych wpisów ze starego WordPressa
- build.js rozszerzony o przetwarzanie root + oferta/ + blog/
- updateOfferMeta w oferta.html automatycznie konsoliduje canonical/og:url deep-linków

**Automatyzacje możliwe:**
- Stały automatyczny audyt SEO (canonicale, sitemap, 404, wielkość grafik <100KB) jako krok CI
- Automatyczna kompresja obrazów z zachowaniem kanału alpha przy dodawaniu assetów
- Monitoring pozycji/CrUX z arkusza SAMOSEO bez udziału konsultanta

**Reusable assets:**
- Parser Wayback→statyczna strona wpisu (h1.title, div.date, pierwszy div.content po h1) — do każdej migracji z WP
- Checklista audytu SEO 37 punktów po migracji
- Wzorzec architektury 'strony standalone SEO vs deep-linki UX z konsolidowanym canonical'
- Udokumentowane gotchy Vercela (redirecty przed filesystemem, trailingSlash:false zdejmuje slash przed custom redirectami)

**Unique elements (czego standardowa agencja nie robi):**
- 100% pokrycie WSZYSTKICH 205+ historycznych URL-i, w tym odtworzenie 147 pełnych treści z Wayback — standardowa agencja robi co najwyżej mapę 301
- llms.txt przepisany pod spec llmstxt.org → wynik Agentic Browsing 3/3 (pozycjonowanie pod boty AI, nie tylko Google)
- Celowe strony-sieroty: archiwum żyje dla botów przez sitemap, ale nie zaśmieca nawigacji (decyzja biznesowa Przemka)
- Dwa nowe wpisy napisane od zera pod konkretne frazy z danych o klikach

**Lessons learned:**
- Redirecty Vercela wykonują się PRZED filesystemem — catch-all potrafi cieniować istniejące pliki
- urllib Pythona nie podąża za 308 — do testów redirectów używać curl -L, inaczej fałszywe alarmy
- Lab LCP mierzy render banera consent (świeży user bez zgody); realni userzy mają zgodę cross-domain — patrzeć na CrUX/field data, nie na lab
- PIL convert('RGB') zabija kanał alpha (czarne tła) — kompresować webp w RGBA
- Twarde spacje \xa0 w plikach źródłowych psują exact-match przy edycjach — matchować nbsp-tolerancyjnie

**Missed opportunities:**
- 5 kategorii net-new (kawa, kanapki, sałatki, catering, integracyjne) wciąż bez indeksowalnych stron standalone mimo gotowego szablonu 11 istniejących
- Audyt 37 punktów wykonany ręcznie w sesji — nie utrwalony jako skrypt w CI
- Pipeline Wayback pozostał w sesyjnym scratchpadzie zamiast w repo jako narzędzie

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-oferta-seo-architecture.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-relaunch.md

</details>

---

### Katalog handlowy + kalkulatory programów (narzędzia sprzedażowe)

**Klient:** DailyFruits / Better Workplace  
**Status:** LIVE od 16.07.2026 — /katalog-produktow za hasłem (noindex), /kalkulator-programu bez hasła (noindex), publiczny /kalkulator; nielinkowane z nawigacji

**Cel biznesowy:** Dać zespołowi handlowemu Better Workplace jedno miejsce online do przeglądania pełnej oferty i szybkiej wyceny programu dla firmy o zadanej liczbie osób — jako wsparcie procesu sprzedaży.

**Problem:** Handlowcy nie mieli cyfrowego narzędzia do pracy z ofertą — istniał tylko drukowy katalog PPTX/PDF, bez możliwości interaktywnej wyceny per liczba pracowników.

**Proces:** katalog-produktow.html zbudowany w repo DailyFruits i trzymany za .vercelignore → decyzja o publikacji 16.07 (commit 2481524): wyjęcie z .vercelignore + bramka hasła + X-Robots-Tag: noindex → tego samego dnia moduł kalkulatora wyodrębniony skryptem (zakresy linii: style, calc-inner, CATS + funkcje) jako standalone kalkulator-programu.html.

**Workflow:** Handlowiec wchodzi na dailyfruits.pl/katalog-produktow → hasło Katalog2026 (sessionStorage) → przegląda 9 kategorii z licznikami → moduł 'Dobierz program do zespołu': liczba osób → kategorie → wariant (eko/std/premium) → wycena (PLN/os/tydz, miesiąc ×4.33, zakres ±15%); wariant bez hasła pod /kalkulator-programu.

**Architektura:** Pojedyncze samowystarczalne pliki HTML w repo strony publicznej: bramka hasła client-side (sessionStorage katalog_auth), dane cenowe w obiekcie JS CATS (8 kategorii cenowych, 3 warianty), 9 kategorii data-cat, ciemny motyw w brandzie Better Workplace; ukrywanie = wpis w .vercelignore, ochrona przed indeksacją = noindex + robots Disallow.

**Narzędzia:** statyczny HTML/CSS/JS (zero backendu), .vercelignore jako przełącznik publikacji, vercel.json (headery X-Robots-Tag, redirecty), sessionStorage (bramka hasła client-side)

**Agenci użyci:**
- Claude Code jako wykonawca (budowa katalogu, skryptowa ekstrakcja kalkulatora)

**Agenci możliwi:**
- Agent ofertowy: z wyniku kalkulatora generuje spersonalizowany PDF/stronę oferty dla konkretnego prospekta
- Agent synchronizacji: pilnuje spójności danych produktowych między oferta.html (CMS), katalogiem i CATS w kalkulatorach

**Automatyzacje zrobione:**
- Skryptowa ekstrakcja modułu kalkulatora z katalogu do standalone strony (po zakresach linii, z pominięciem logiki modala)

**Automatyzacje możliwe:**
- Jedno źródło prawdy dla cen/produktów (CATS generowany z danych CMS zamiast ręcznej duplikacji)
- Logowanie użyć kalkulatora (liczba osób, wybrane kategorie) jako sygnał sprzedażowy dla zespołu
- Generowanie oferty PDF wprost z wyniku wyceny

**Reusable assets:**
- 4-krokowy kreator wyceny (osoby → kategorie → wariant → wycena) jako komponent do adaptacji u innych klientów abonamentowych
- Wzorzec 'ukryta strona w repo za .vercelignore → publikacja jednym commitem' dla narzędzi wewnętrznych
- Wzorzec taniej bramki dostępu: hasło client-side + noindex + brak linkowania dla treści 'nie dla publiki, ale bez wrażliwych danych'

**Unique elements (czego standardowa agencja nie robi):**
- Wewnętrzne narzędzie sprzedażowe hostowane w repo publicznej strony klienta — zero dodatkowej infrastruktury, kosztów i logowania do osobnego systemu
- Trzy warianty tego samego silnika wyceny dla trzech odbiorców: publiczny /kalkulator (lead-gen), handlowy /kalkulator-programu (bez hasła, szybki dostęp), pełny katalog za hasłem
- Publikacja katalogu przy okazji naprawiła 4 martwe redirecty (/katalog itd.)

**Lessons learned:**
- Hasło client-side (porównanie w JS) wystarcza jako próg 'nie dla przypadkowych oczu', ale nie jest zabezpieczeniem — świadomy trade-off dla narzędzia bez wrażliwych danych
- W ekosystemie klienta istnieją trzy podobne artefakty (katalog online, 2 kalkulatory, katalog drukowy PPTX/PDF) — bez notatki rozróżniającej łatwo je pomylić
- Ekstrakcja modułu po zakresach linii działa, ale jest krucha — lepszy byłby moduł współdzielony

**Missed opportunities:**
- Dane cenowe zdublowane w kilku plikach — ryzyko rozjazdu przy zmianie cennika (brak jednego źródła prawdy)
- Zero analytics na narzędziach handlowych — tracona wiedza, jak zespół faktycznie z nich korzysta
- Hasło w plaintext w kodzie strony publicznie dostępnej pod URL

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-katalog-handlowy.md

</details>

---

### Consent / GTM — architektura zgód i analityki

**Klient:** DailyFruits / Better Workplace  
**Status:** Wdrożone po stronie kodu (custom banner usunięty, lazy-start analytics, UC-early loader); otwarte po stronie klienta: decyzja o kontenerze GTM-5B7HN67B, allowlist domen w Usercentrics, consent-gating tagów FB/LinkedIn w GTM

**Cel biznesowy:** Zgodny z RODO mechanizm zgód spójny z resztą marek Better Workplace oraz uporządkowana, niezdublowana analityka — bez zabijania wyników Core Web Vitals.

**Problem:** Strona miała zdublowany consent (własny banner + Usercentrics przez GTM), DWA kontenery GTM, trackery (LinkedIn, Amplitude, Matomo) strzelające przed zgodą i niejasną architekturę GA4 w rodzinie marek BW; baner consent psuł też lab LCP.

**Proces:** Reverse-engineering konfiguracji betterworkplace.pl jako wzorca → usunięcie własnego bannera (#cookieBanner, commit beabe12) z zachowaniem gtag consent default denied jako siatki → rozpoznanie architektury GA4 (3 property: zbiorcza rodziny BW, marki Daily, leadów innej marki) → identyfikacja GTM-5B7HN67B jako pustego balastu 397KB → optymalizacje: lazy-start GTM/gtag (pierwsza interakcja lub 2.5s) i wczesny osobny loader Usercentrics pod stabilny LCP.

**Workflow:** Zmiany consent wyłącznie w _includes/gtm-head.html i gtm-noscript.html → node scripts/build.js propaguje na ~95 stron → push na main → weryfikacja na produkcji; decyzje konfiguracyjne (UC dashboard, GTM klienta) eskalowane do ludzi po stronie BW (Łukasz).

**Architektura:** Usercentrics CMP w trybie TCF ładowany przez współdzielony z betterworkplace.pl kontener GTM-FVTBKWW + natychmiastowy osobny loader UC (preconnect, fetchpriority=high, guard po id); gtag('consent','default', denied) jako floor inline PRZED analytics; GTM x2 + gtag startują lazy (interakcja lub 2.5s, dataLayer kolejkuje); GA4: G-RTN340K8P7 (zbiorcza BW), G-G9SCYSFC36 (marka Daily: gtag=pageviews, GTM=generate_lead), G-7JDGT7D6VK (inna marka).

**Narzędzia:** Google Tag Manager (GTM-FVTBKWW współdzielony + GTM-5B7HN67B balast), Usercentrics CMP (TCF, WebSDK), GA4 (3 property), _includes/gtm-head.html + scripts/build.js, PageSpeed Insights (wpływ consent na LCP)

**Agenci użyci:**
- Claude Code jako analityk i wykonawca; konfiguracja GTM/UC po stronie ludzi z Better Workplace

**Agenci możliwi:**
- Agent compliance: automatyczny skan requestów sieciowych przed wyrażeniem zgody z raportem trackerów strzelających pre-consent

**Automatyzacje zrobione:**
- Zmiana consent w jednym include propaguje się przez build.js na ~95 stron
- Lazy-start analytics z kolejkowaniem dataLayer (automatyczne odroczenie ciężkich skryptów bez utraty eventów)

**Automatyzacje możliwe:**
- Test w CI wykrywający nowe trackery ładowane przed zgodą (regresja compliance)
- Automatyczna weryfikacja, że oba pliki include (head + noscript) pozostają spójne

**Reusable assets:**
- Wzorzec lazy-start GTM/gtag (interakcja lub 2.5s + consent default denied inline + kolejkowanie dataLayer) do każdej strony z ciężką analityką
- Wzorzec UC-early: wczesny render banera consent jako stabilizacja LCP w lab
- Udokumentowana mapa architektury GA4 rodziny marek BW (które property czym jest — chroni przed 'sprzątaniem' nie-dubli)

**Unique elements (czego standardowa agencja nie robi):**
- Reverse-engineering realnej konfiguracji consent grupy marek klienta i dopasowanie się do niej, zamiast wdrażania własnego rozwiązania od zera
- Optymalizacja consent pod Core Web Vitals (baner jako kandydat LCP) — styk compliance i performance, który agencje traktują osobno
- Jawne wyznaczenie granicy odpowiedzialności: kod po stronie r352, gating tagów i allowlist po stronie klienta

**Lessons learned:**
- Baner consent = duży element = kandydat LCP w lab; realni userzy mają zgodę zapisaną cross-domain i banera nie widzą — decyzje podejmować na CrUX/field data
- Nie każdy 'duplikat' analityki jest duplikatem — własny gtag to osobna property marki (pageviews) obok GTM (leady); przed usuwaniem zmapować architekturę
- Współdzielony kontener GTM z siecią marek = zmiany konfiguracji poza kontrolą r352; kod może tylko dawać floor (consent default denied)

**Missed opportunities:**
- GTM-5B7HN67B (pusty balast 397KB) wciąż ładowany — decyzja wisi na człowieku po stronie klienta bez procesu follow-up
- FB/LinkedIn nadal strzelają przed zgodą — consent-gating w GTM klienta nie doprowadzony do końca
- Allowlist domen w dashboardzie Usercentrics (krok user-only) nieuzupełniony — na vercel.app brak UI zgód
- Brak automatycznego testu pre-consent — compliance sprawdzane tylko ręcznie

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-consent-gtm.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dailyfruits-oferta-seo-architecture.md

</details>

---

## Klient: Benefit Systems / Zdrofit

### Hourly pipeline Trello→Figma (automatyzacja briefów Benefit/Zdrofit)

**Klient:** Benefit Systems / Zdrofit  
**Status:** Cel zdefiniowany 04.07.2026, przed uruchomieniem — prerekwizyty (biblioteka masterów, walidacja) w toku, pętla cron dopiero po pilotażu wakacyjnym i akcepcie Reszka.

**Cel biznesowy:** Zdjąć z Reszka główny koszt operacyjny obsługi ~100 briefów/mies.: automat co godzinę czyta nowe karty Trello, klasyfikuje i generuje wstępne kreacje on-brand w Figmie, a Reszek tylko waliduje spójność przed dalszą produkcją.

**Problem:** 12–15 osób briefujących, mediana lead time 1 dzień; ręczne przenoszenie briefów z Trello i odtwarzanie layoutów od zera przy każdym zadaniu to główny pożeracz czasu produkcji.

**Proces:** Cykl godzinowy: odczyt nowych kart z tablic „Przemek NOWY" i „PRZEDSPRZEDAŻE OTWARCIA" (wyłącznie read-only) → klasyfikacja marka/typ/formaty → generacja wstępnych kreacji z masterów biblioteki „BS Fitness — Biblioteka Produkcyjna v1" → walidacja Reszka. Zadania nietypowe dostają tylko klasyfikację + przygotowaną ramkę.

**Workflow:** Trello REST GET (klucze z briefsync/.env, token MCP wygasły) → klasyfikator wg SLOWNIK_FORMATOW.md → generacja w OSOBNYM pliku roboczym na stronie „DO WALIDACJI" (nigdy w plikach produkcyjnych klienta) → akcept Reszka → produkcja właściwa.

**Architektura:** Pętla schedule/cron wywołująca odczyt Trello przez REST API; klasyfikacja oparta o słownik formatów; generacja w Figmie przez plugin API z masterów rodzin szablonowych (wydarzenia FB, plakat stoiska, rollup, potykacz B1, KV belkowe, LP przedsprzedaży); brand-hub (brand.json) jako maszynowo czytelne źródło zasad marki; twarda separacja plik roboczy vs produkcyjny jako governance.

**Narzędzia:** Trello REST API (read-only, klucze w briefsync/.env), Figma MCP (use_figma, biblioteka BS Fitness — Biblioteka Produkcyjna v1), briefsync (skrypty Python: briefsync.py, sync_all.py, daily.sh, obsidian_sync.py), SLOWNIK_FORMATOW.md jako słownik klasyfikacji, brand-hub (brand.json, fonty Aptly, logotypy), schedule/cron (planowany po pilotażu)

**Agenci użyci:**
- Brak stałego agenta — analizy briefów i przygotowanie pipeline'u robione dotąd w sesjach Claude ad hoc.

**Agenci możliwi:**
- Agent-klasyfikator briefów (karta Trello → marka/typ/formaty wg słownika).
- Agent-generator kreacji per rodzina szablonowa z masterów biblioteki.
- Agent QA sprawdzający spójność brandową partii przed pokazaniem Reszkowi.
- Agent godzinowej pętli cron spinający całość po pilotażu.

**Automatyzacje zrobione:**
- briefsync: synchronizacja i analiza tablic Trello do lokalnych JSON + notatki dzienne (sync_all.py, daily.sh, sync do Obsidiana).
- SLOWNIK_FORMATOW.md — skodyfikowane mapowanie brief→formaty.
- brand-hub z brand.json — zasady marki w formie czytelnej dla automatu.
- PLAN_AUTOMATYZACJI.html — udokumentowany plan całego pipeline'u.

**Automatyzacje możliwe:**
- Uruchomienie właściwej pętli godzinowej przez schedule/cron po walidacji biblioteki masterów.
- Automatyczne powiadomienie Reszka o gotowej partii „DO WALIDACJI".
- Feedback loop: decyzje walidacyjne Reszka poprawiające klasyfikator.
- Dashboard SLA/lead time z danych briefsync jako wartość dodana dla klienta.

**Reusable assets:**
- SLOWNIK_FORMATOW.md — słownik formatów przenośny na innych klientów wolumenowych.
- brand-hub jako wzorzec maszynowo czytelnego brand-packu (brand.json + fonty + loga).
- Skrypty briefsync (sync Trello→JSON→Obsidian) reużywalne dla każdego klienta na Trello.
- Biblioteka Figma „BS Fitness — Biblioteka Produkcyjna v1" z masterami rodzin.

**Unique elements (czego standardowa agencja nie robi):**
- Produkcja graficzna potraktowana jak pipeline danych: brief = rekord, format = słownik, kreacja = wygenerowany artefakt do walidacji.
- Governance wpisane w architekturę: Trello twardo read-only i generacja tylko w pliku roboczym „DO WALIDACJI" — ochrona workflow i zaufania klienta.
- Świadome zawężenie automatu do rodzin szablonowych, nietypowe zadania dostają tylko klasyfikację — zamiast obiecywać automatyzację wszystkiego.

**Lessons learned:**
- Token Trello MCP wygasa — stabilniejszy jest czysty REST GET z kluczami w .env.
- Kolejność ma znaczenie: najpierw zwalidowana biblioteka komponentów i mastery, dopiero potem pętla — inaczej automat produkuje śmieci do poprawiania.
- Zasada read-only wobec narzędzi klienta („nie możesz nic zmieniać na Trello") musi być zakodowana w każdym skrypcie, nie tylko zapamiętana.

**Missed opportunities:**
- Miesiąc po zdefiniowaniu celu pętla nadal nie wystartowała nawet w trybie pilotażu ręcznego (batch raz dziennie).
- Dane briefsync (~100 kart/mies., lead time) nie zostały jeszcze obrócone w raport/dashboard sprzedający wartość automatyzacji klientowi.
- Brak zdefiniowanego mechanizmu uczenia klasyfikatora na decyzjach walidacyjnych Reszka.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/zdrofit-hourly-pipeline-goal.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/trello-read-only.md
- /Users/reszek/Desktop/Claude_zadania/BENEFITSYSTEMS_ZDROFIT (struktura: SLOWNIK_FORMATOW.md, PLAN_AUTOMATYZACJI.html, brand-hub/, NOTATKI_SYNTEZA.md)
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/briefsync (struktura skryptów)

</details>

---

### Kampania „Ćwicz w zieleni" — Pilates o zachodzie (Kopiec Krakusa)

**Klient:** Benefit Systems / Zdrofit (wersja ZDRO, event z miastem Kraków)  
**Status:** W toku (stan 02.08.2026): master od Reszka dostarczony, reformaty na wszystkie 10 formatów wykonane; czeka m.in. na logotypy miasta Kraków; event 21.08.2026.

**Cel biznesowy:** Dostarczyć komplet 10 spójnych formatów promujących event „Pilates o zachodzie słońca" (21.08, 18:30, Kopiec Krakusa) — od FB posta po plakat A4 do druku 300 dpi — z jednego mastera, szybko i w pełni on-brand.

**Problem:** Jeden master FB 1080×1320 trzeba rozmnożyć na 10 formatów o różnych proporcjach i regułach (część bez logo, część bez napisów, newsletter z zaokrąglonymi rogami), a brandowy font Aptly jest niedostępny w chmurowym środowisku Figma MCP (loadFontAsync rzuca błąd).

**Proces:** Brief z Trello „Przemek NOWY" → plik Figma z 10 podpisanymi ramkami formatów rozstawionymi w rzędzie → master od Reszka (zdjęcie pilates złota godzina + 4 logotypy + headline w Aptly Bold) → reformaty: piony (FB/IG/A4) przez clone+rescale+center-crop, poziomy/Stories/Newsletter budowane od zera (zdjęcie na całe tło + scrim + sklonowane logo/headline/data per format).

**Workflow:** Trello (brief, read-only) → Figma plik tmBVy2Co1BlQtnJ9iuilDC → master ręczny Reszka → programowe reformaty przez plugin API → napisy w Aptly generowane lokalnie: fontTools (OTF→SVGPathPen+TransformPen, glify po łuku + blob) → figma.createNodeFromSvg → walidacja Reszka.

**Architektura:** Plik Figma jako siatka szablonów formatowych z podpisami; generacja przez use_figma; obejście fontowe: render kształtów z lokalnego OTF przez fontTools do SVG <50 KB (współrzędne zaokrąglone do 1 miejsca), wklejenie jako wektor — prawdziwy Aptly 1:1 mimo braku fontu w chmurze; assety z brand-hub.

**Narzędzia:** Figma MCP (use_figma, plik tmBVy2Co1BlQtnJ9iuilDC), Trello (źródło briefu, read-only), Python fontTools (SVGPathPen, TransformPen) — skrypt arc.py w scratchpadzie, brand-hub: fonty Aptly OTF (~/Library/Fonts + BENEFITSYSTEMS_ZDROFIT/brand-hub/fonts)

**Agenci użyci:**
- Brak wydzielonego agenta — reformaty wykonane w sesji Claude przez plugin API Figmy.

**Agenci możliwi:**
- Agent-reformater „1 master → N formatów" sterowany słownikiem formatów (SLOWNIK_FORMATOW.md) — dokładnie ta praca powtarza się w każdej kampanii.
- Agent walidacji reguł per format (bez logo / bez napisów / zaokrąglone rogi / dpi druku) przed oddaniem do walidacji Reszka.

**Automatyzacje zrobione:**
- Skrypt arc.py: programowy render napisów w Aptly po łuku z blobem jako SVG wklejany do Figmy.
- Półautomatyczne reformaty przez plugin API (clone+rescale+center-crop dla pionów, kompozycja od zera dla pozostałych).

**Automatyzacje możliwe:**
- Sparametryzowanie reformatów w generyczny skrypt use_figma „master→10 formatów" dla dowolnej kampanii eventowej Zdrofit.
- Auto-zaciąganie danych eventu (data/godzina/miejsce) z karty Trello do ramek formatów — naturalny kawałek hourly pipeline'u.

**Reusable assets:**
- Plik Figma z 10 opisanymi ramkami formatów — gotowy szablon kompletu kanałów dla każdego kolejnego eventu.
- Skrypt arc.py + udokumentowane obejście fontu Aptly (fontTools→SVG→createNodeFromSvg).
- Skodyfikowane reguły per format (które bez logo, które bez napisów, newsletter z rogami) zapisane w pamięci projektu.

**Unique elements (czego standardowa agencja nie robi):**
- Render prawdziwego brandowego kroju jako wektorów z OTF zamiast podmiany na font systemowy — wygląd 1:1 z księgą znaku mimo twardego ograniczenia środowiska.
- Programowe napisy „po łuku z blobem" — efekt layoutowy zwykle robiony ręcznie przez grafika, tu odtwarzalny skryptem.
- Reformaty robione kodem w pliku klienckim wg jawnych reguł formatów, nie „na oko".

**Lessons learned:**
- Fontów niestandardowych nie da się ładować w chmurowym Figma MCP — tekst w Aptly tylko klonować albo renderować z OTF jako SVG.
- SVG dla createNodeFromSvg trzymać poniżej 50 KB (zaokrąglanie współrzędnych), inaczej wklejka pada.
- Formaty pionowe wychodzą z clone+crop mastera, poziome trzeba komponować od zera — jedna transformacja nie obsłuży wszystkich proporcji.

**Missed opportunities:**
- Reformaty wykonane per format ręcznie w sesji — nie spakowane od razu w reużywalny, sparametryzowany skrypt, choć to modelowy przypadek „Every Project Compounds".
- Bloker zewnętrzny (logotypy miasta Kraków) nie został wychwycony na starcie jako checklist-item briefu.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/zdrofit-cwicz-w-zieleni.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/trello-read-only.md

</details>

---

### Oklejenie witryn nowego klubu Zdrofit — CH Łodygowa (Warszawa Targówek)

**Klient:** Benefit Systems / Zdrofit  
**Status:** Zakończony 29.07.2026 — pliki produkcyjne (3 plansze + bryty z zakładką + warstwy kontrolne) wyrenderowane i zweryfikowane.

**Cel biznesowy:** Kampania przedotwarciowa „tu powstaje nowy klub fitness Zdrofit": oklejenie 3 ciągów witryn (łącznie ~12,3 m szerokości) z QR prowadzącym do formularza leadowego przedsprzedaży — powtórka sprawdzonego wzorca z Poznania.

**Problem:** Nośnik wielkoformatowy z twardymi ograniczeniami fizycznymi: druk cięty na bryty wg podziału szyb (QR ani kluczowe elementy nie mogą wypaść na styku), QR musi być skanowalny z wysokości ~110–120 cm, a wymiary z wiadomości klienta różnią się od rysunku technicznego o ~2 mm.

**Proces:** Projekt zbudowany jako kod: artboardy.html (cała treść w obiekcie COPY, geometria szyb w BOARDS, skala CM=10) → render.sh (Chrome headless, screenshot 1:1 per plansza, tryb guides z liniami cięcia i strefą bezpieczną 8 cm) → potnij.py (cięcie na bryty z parametryczną zakładką 2 cm) → weryfikacja QR moduł po module wobec wzorca.

**Workflow:** Wymiary od klienta + rysunek techniczny → BOARDS w HTML → render A 7365×2845 / B 3705×2845 / C 1230×2845 px → kontrola linii cięcia (twarz postaci 17 cm od cięcia, hasło i QR w całości wewnątrz szyb) → bryty do druku → out/.

**Architektura:** Deklaratywne źródło HTML/CSS z trzema stałymi (COPY, BOARDS, CM) — zmiana dowolnego wymiaru przelicza cały projekt; render przez Chrome headless z --window-size i --force-device-scale-factor=1; cięcie przez PIL; QR generowany biblioteką segno (wersja 8, korekcja H, 49×49 modułów) i weryfikowany programowo na wyrenderowanym PNG.

**Narzędzia:** HTML/CSS jako narzędzie projektowe (artboardy.html), Chrome headless (render.sh — screenshot 1:1), Python: PIL (potnij.py) i segno (QR + weryfikacja), brand-hub: brand.json, logo SVG/PNG, fonty Aptly woff2, paleta Pantone (#009CDE / #FF5B19 / #3B3F42), Sesja studyjna Zdrofit ~6000×9000 px (kadry w assets/)

**Agenci użyci:**
- Brak — projekt wykonany w sesji Claude jako kod + skrypty.

**Agenci możliwi:**
- Agent „otwarcie klubu": z briefu (adres, podział szyb, URL leadowy) generuje komplet plansz wg tego wzorca dla każdej kolejnej lokalizacji Zdrofit.
- Agent-walidator ergonomii nośnika (wysokość QR, odległości od linii cięcia, strefy bezpieczne) uruchamiany po każdym renderze.

**Automatyzacje zrobione:**
- Pełny pipeline render+cięcie sterowany kodem: edycja tablicy BOARDS przelicza plansze, bryty i warstwy kontrolne automatycznie.
- Programowa weryfikacja QR moduł po module wobec wzorca — łapie błędy skalowania i przycięcia.
- Tryb guides: automatyczna warstwa kontrolna z liniami cięcia, wymiarami szyb i strefą bezpieczną 8 cm.

**Automatyzacje możliwe:**
- Uogólnienie folderu do parametrycznego szablonu „witryny nowego klubu" (config JSON zamiast edycji HTML) — to już druga realizacja wzorca po Poznaniu.
- Wbudowanie walidacji ergonomii (QR 110–120 cm, elementy vs styki brytów) jako asercje w potnij.py/render.sh.
- Podpięcie pod hourly pipeline: karta Trello typu „otwarcie klubu" → automatyczny draft plansz.

**Reusable assets:**
- Cały folder zdrofit-lodygowa (artboardy.html + render.sh + potnij.py + README) jako odtwarzalny wzorzec projektów wielkoformatowych.
- Konwencja skali 1 cm = 10 px uzgodniona z Reszkiem — wspólny język dla kolejnych nośników fizycznych.
- Metoda QR: segno z korekcją H + programowa weryfikacja na renderze.
- README z pełną dokumentacją decyzji (wymiary, rozjazd z rysunkiem technicznym, rozmieszczenie vs cięcia).

**Unique elements (czego standardowa agencja nie robi):**
- Projekt wielkoformatowy do druku zrobiony w HTML+headless Chrome zamiast w narzędziu DTP — w pełni parametryczny, wersjonowalny i odtwarzalny jedną komendą.
- Weryfikacja skanowalności QR moduł po module na finalnym pliku produkcyjnym — kontrola jakości, której standardowa agencja nie robi.
- Świadome projektowanie względem linii cięcia brytów (twarz, hasło, QR, panel adresowy) udokumentowane w README.
- Jawne rozliczenie rozbieżności wymiarów wiadomość vs rysunek techniczny z gotową ścieżką przeliczenia.

**Lessons learned:**
- Środek QR musi być ~110–120 cm nad podłogą — pierwsza wersja na 70 cm była za nisko do skanowania.
- QR nie może wypadać na styku brytów — to ograniczenie trzeba planować od początku layoutu.
- Wymiary od klienta i rysunek techniczny potrafią się różnić o mm — projekt musi być przeliczalny z jednej tablicy, nie „przybity" do pikseli.
- Zakładka cięcia jako parametr (nie zaszyta w plikach) upraszcza dogadanie z drukarnią.

**Missed opportunities:**
- Mimo że to druga realizacja tego samego konceptu (Poznań→Łodygowa), wzorzec nie został jeszcze podniesiony do rangi produktu/SOP „otwarcie klubu" z configiem per lokalizacja.
- Walidacje ergonomiczne wyciągnięte jako wiedza w README, ale nie zakodowane jako automatyczne asercje.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/zdrofit-lodygowa-witryny.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/zdrofit-lodygowa/README.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/zdrofit-lodygowa/potnij.py
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/zdrofit-lodygowa/render.sh

</details>

---

### Współpraca z Adą (podwykonawca kreacji) + ewidencja czasu ze Slacka

**Klient:** r352 wewnętrznie (praca dla Benefit/Zdrofit, Archicom, Instytut Kawy)  
**Status:** Aktywna; rozliczenie za lipiec 2026 zamknięte (140h43 w 23 dniach roboczych, 76% etatu).

**Cel biznesowy:** Skalowanie mocy produkcyjnej kreacji przez podwykonawcę (model r352: AI = mózg, podwykonawcy = ręce) przy minimalnym narzucie administracyjnym — rozliczenie czasu bez wdrażania time-trackera.

**Problem:** Rzetelne, akceptowane przez obie strony rozliczanie godzin podwykonawcy bez dedykowanego narzędzia; ręczne liczenie ze Slacka jest żmudne i podatne na błędy (zakotwiczenie na dacie ostatniej wiadomości, kursory idące wstecz).

**Proces:** Ada pracuje przez Trello (m.in. tablica „Ada C tablica", read-only dla automatów), Figmę i Dropboxa; czas = suma dziennych okien „pierwsza wiadomość → ostatnia wiadomość" w DM na Slacku, bez odejmowania ciszy, weekendy i dni bez wiadomości = 0; miesięcznie raport: suma, średnia dzienna, mediana, % etatu, analiza przerw.

**Workflow:** Dla każdego dnia miesiąca: slack_search_public_and_private z from:<@U097U5RS5HR> on:YYYY-MM-DD, sort=timestamp asc/desc, limit=1, channel_types=im → różnica pierwsza/ostatnia → suma miesięczna → raport z odniesieniem do etatu (dni robocze × 8h).

**Architektura:** Slack MCP jako jedyne źródło prawdy o czasie (metadane komunikacji zamiast time-trackera); metoda i jej twarde zasady interpretacyjne spisane w pamięci jako niekwestionowalna umowa; separacja od narzędzi klienta (Trello read-only).

**Narzędzia:** Slack MCP (search_public_and_private, read_channel), Trello (przydział pracy, read-only), Figma i Dropbox (kanały dostarczania kreacji), Wzorce umów podwykonawczych w umowy-podwykonawcy/ (NDA, ramowa, o dzieło)

**Agenci użyci:**
- Brak wydzielonego agenta — rozliczenie liczone w sesjach Claude wg utrwalonej w pamięci procedury.

**Agenci możliwi:**
- Agent miesięcznego rozliczenia: cron 1. dnia miesiąca liczy godziny Ady i oddaje gotowy raport do akceptu Reszka.
- Agent korelujący okna czasu ze Slacka z kartami Trello (koszt godzinowy per projekt/klient) — wyłącznie po zgodzie Reszka.

**Automatyzacje zrobione:**
- Procedura liczenia w pełni skodyfikowana w pamięci (dokładne zapytania, sortowanie, obsługa kursorów, twarde zasady) — powtarzalna bez ponownego ustalania metody z Adą.

**Automatyzacje możliwe:**
- Zautomatyzowany raport miesięczny przez schedule/cron zamiast ręcznego odpalania sesji.
- Automatyczne metryki pomocnicze (przerwy ≥1h/≥1,5h, aktywność per dzień) generowane skryptem z jednego przebiegu.

**Reusable assets:**
- SOP ewidencji czasu ze Slacka (memory ada-ewidencja-slack) z gotowymi zapytaniami i gotchas — przenośny na każdego kolejnego podwykonawcę rozliczanego komunikatorem.
- Wzorzec metryk raportu miesięcznego: suma / średnia / mediana / % etatu / analiza przerw.
- Komplet wzorów umów podwykonawczych (NDA + ramowa + o dzieło) w umowy-podwykonawcy/.

**Unique elements (czego standardowa agencja nie robi):**
- Ewidencja czasu oparta o metadane komunikatora zamiast time-trackera — zero narzutu i kontroli wobec podwykonawcy, działa na mocy jawnej umowy społecznej.
- Twarde spisanie zasad interpretacyjnych (cisza się liczy, deklaracje nie korygują, „nie kwestionować") — eliminuje comiesięczne renegocjacje metody.
- Reguła „NAJPIERW sprawdź dzisiejszą datę" wbudowana w SOP jako ochrona przed znanym błędem poznawczym.

**Lessons learned:**
- Przy liczeniu miesiąca łatwo o błąd zakotwiczenia na dacie ostatniej znalezionej wiadomości — zawsze najpierw ustalić pełny zakres dat.
- Kursor slack_read_channel idzie wstecz — do przewijania do przodu ustawiać oldest na ostatni widziany timestamp.
- channel_types=im łapie wszystkie DM-y — przy filtrowaniu dokładać in:<@user>, inaczej wyniki się mieszają.
- Raz uzgodnioną metodę rozliczeń trzeba zamrozić i nie wracać do odrzuconych zastrzeżeń — stabilność umowy > precyzja pomiaru.

**Missed opportunities:**
- Raport wciąż odpalany ręcznie — brak crona mimo w pełni deterministycznej procedury.
- Godziny nie są łączone z wolumenem/wartością dostarczonych kreacji (koszt na kreację), co pomogłoby wyceniać usługi i mierzyć efekt automatyzacji pipeline'u.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/ada-ewidencja-slack.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/trello-read-only.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/MEMORY.md (umowy-podwykonawcy)

</details>

---

## Klienci: Archicom + Osada Orle

### System tokenów Archicom + rebrand folderu atrium NOWY SZCZEPIN

**Klient:** Archicom (deweloper, Wrocław)  
**Status:** Zakończony — rebrand wykonany non-destruktywnie, tokeny zdestylowane do pamięci systemu

**Cel biznesowy:** Dostarczyć Archicomowi rebranding istniejącego 16-stronicowego folderu inwestycji atrium NOWY SZCZEPIN do aktualnej identyfikacji, a przy okazji zbudować trwały, wielokrotnego użytku destylat tokenów marki na kolejne zlecenia.

**Problem:** Folder miał starą stylistykę (zieleń/earthy + Montserrat), a formalny zestaw zmiennych Figmy nie odpowiadał realnej palecie marki — prawdziwy styl trzeba było wyodrębnić z konkretnego elementu referencyjnego ('bulwar północny', node 108:79), nie z deklarowanych tokenów.

**Proces:** Ekstrakcja zmiennych z pliku landing (fileKey tIW0sVhhlVzICeDEBGiPVP, node 5:544) → identyfikacja realnej palety z elementu referencyjnego → rebrand decku na osobnej stronie 'atrium – REBRAND (Archicom)' + dodanie strony '🎨 Design System (Archicom)', oryginalna Page 1 nietknięta.

**Workflow:** Plik landing jako źródło prawdy o marce → destylat tokenów zapisany w pamięci (hexy, fonty, gotchas) → programowa podmiana stylów w pliku folderu → fix artefaktów importu (zdublowane glify) → praca oddana bez naruszenia oryginału klienta.

**Architektura:** Dwa pliki Figma: landing (źródło tokenów) i folder atrium (fileKey hlWsYrPNcqrGOKP5zhVukh, cel rebrandu); operacje programowo przez Figma MCP; wiedza utrwalona jako plik pamięci archicom-brand.md zamiast dokumentu u klienta.

**Narzędzia:** Figma (MCP, use_figma), System pamięci Claude (memory/archicom-brand.md)

**Agenci użyci:**
- Claude jako operator Figma MCP wykonujący ekstrakcję tokenów i rebrand programowo.

**Agenci możliwi:**
- Agent 'brand-token-extractor' wyciągający z dowolnego pliku klienta realną paletę użycia (nie deklarowane zmienne) i zapisujący destylat do pamięci.
- Agent QA porównujący screenshoty stron przed/po rebrandzie i raportujący rozjazdy.

**Automatyzacje zrobione:**
- Programowy fix doublingu tekstu: ukrywanie wektorowych outline'ów glifów, które wpadają w bbox żywego TEXT node'a (artefakt eksportu PDF/InDesign).

**Automatyzacje możliwe:**
- Sparametryzowany skrypt 'rebrand decku' (mapa starych stylów → nowe tokeny) do re-użycia przy kolejnych materiałach Archicomu.
- Automatyczna publikacja tokenów jako biblioteki Figma podpinanej do plików produkcyjnych.

**Reusable assets:**
- Destylat brandu Archicom w pamięci: paleta (Deep Navy #051F59, IKB #0626A9, Spindle, Wild Strawberry), fonty (Pretty Var + Inter) i file keys.
- Wzorzec non-destruktywnego rebrandu w pliku klienta (osobna strona REBRAND + strona Design System, oryginał nietknięty).
- Technika naprawy zdublowanych glifów po imporcie PDF/InDesign.

**Unique elements (czego standardowa agencja nie robi):**
- Rozpoznanie, że deklarowany zestaw zmiennych ≠ realna paleta marki — styl wzięty z elementu referencyjnego, czego standardowa agencja by nie zauważyła.
- Rebrand wykonany programowo w pliku Figmy klienta zamiast ręcznego przerysowywania.
- Diagnoza i obsługa artefaktu importu (tekst jako TEXT node + duplikat wektorowy) zamiast walki z 'dziwnym plikiem'.

**Lessons learned:**
- Pliki z eksportu PDF/InDesign mają tekst zdublowany jako outline'y wektorowe — swap fontów ujawnia doubling, trzeba go czyścić po bboxach.
- Środowisko fontów pliku ma znaczenie: 'Pretty Var' niedostępny w pliku folderu (loadFontAsync fail) → nagłówki spadły do Inter; font-env sprawdzać przed obietnicą wierności.
- Źródłem prawdy o marce bywa konkretny wzorcowy element, nie system zmiennych.

**Missed opportunities:**
- Fix glifów i mapa rebrandu nie zostały spakowane jako reużywalny skrypt/SOP — przy prezenterze Reymonta trzeba będzie odtwarzać ręcznie.
- Tokeny Archicom nie istnieją jako opublikowana biblioteka Figma, tylko jako notatka w pamięci.
- Brak case study / benchmarku 'rebrand 16 stron w X godzin' do wykorzystania sprzedażowo przez r352.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/archicom-brand.md

</details>

---

### Prezenter inwestycji Przystań Reymonta

**Klient:** Archicom (Marta Niwińska, koordynatorka marketingu)  
**Status:** W toku — deadline poniedziałek 10.08.2026 (3 dni), krytyczne ryzyko braku materiałów od klientki

**Cel biznesowy:** Płatne zlecenie (widełki 100–200 PLN/strona) na prezenter inwestycji w konwencji wcześniejszego prezentera Bulwaru; utrzymanie Archicomu jako powracającego klienta pozyskanego z polecenia (Michalina Piątkowska).

**Problem:** Klientka potrzebuje prezenterа 'dokładnie takiego samego jak dla Bulwaru': minimalistycznego, w 100% w brandingu, z motywem 3 linii z KV — przy czym część materiałów wejściowych (mapa, wizki, plan zagospodarowania, karty mieszkań) wciąż nie dotarła.

**Proces:** Ustalenia mailowe (struktura i kierunek graficzny, mail 08.06.2026) + telefoniczne (deadline 31.07.2026, nieobecny w mailach, utrwalony w pamięci systemu); struktura 8 sekcji od Marty: okładka, hasło 'Budujemy przestrzeń dobrego życia', mapa, wizualizacje 4–6, plan zagospodarowania, karty, wizka wnętrza, karty mieszkań.

**Workflow:** Materiały od klientki (KV i pliki otwarte przez SwissTransfer, 01.06.2026) → skład prezentera wg 8-sekcyjnej struktury na tokenach z archicom-brand → akceptacja Marty; w oknie 3–7.08 zastępstwo Ewelina Woźniak.

**Architektura:** Nieznana na tym etapie (produkcja nieopisana w źródłach); fundament = destylat brandu z archicom-brand.md (Deep Navy, IKB, motyw 3 linii z KV) + materiały z SwissTransfer.

**Narzędzia:** E-mail + telefon (ustalenia z klientką), SwissTransfer (transfer KV i plików otwartych), Branding Archicom z Figmy (tokeny z archicom-brand)

**Agenci użyci:**
- Brak odnotowanych — na tym etapie projekt to głównie ustalenia i zarządzanie ryzykiem materiałów.

**Agenci możliwi:**
- Agent monitorujący skrzynkę pod kątem materiałów od Marty/Eweliny i alertujący natychmiast po ich wpłynięciu (deadline = dzień dosyłki w najgorszym scenariuszu).
- Agent składający pierwszy szkic prezentera z kart PDF i tokenów brandu do walidacji Reszka.

**Automatyzacje zrobione:**
- Brak — jedyną 'automatyzacją' jest utrwalenie ustaleń telefonicznych i ryzyk w pamięci systemu.

**Automatyzacje możliwe:**
- Automat pobierający i archiwizujący lokalnie każdy link transferowy od klienta w dniu otrzymania (SwissTransfer wygasa ~30 dni).
- Szablon 'prezenter dewelopera' budowany parametrycznie z tokenów marki + struktura 8 sekcji, żeby kolejne inwestycje (i klienci) były składane w godziny, nie dni.

**Reusable assets:**
- Struktura 8 sekcji prezentera inwestycji deweloperskiej jako szablon powtarzalny między inwestycjami.
- Plik pamięci projektu z pełną mapą ryzyk, kontaktów i ustaleń pozamailowych.

**Unique elements (czego standardowa agencja nie robi):**
- Ustalenia telefoniczne (deadline) natychmiast utrwalone w systemie — r352 ma źródło prawdy, którego nie ma nawet w korespondencji klienta.
- Ryzyko urlopowe klientki zmapowane z wyprzedzeniem, z osobą zastępującą i scenariuszem najgorszego przypadku (materiały w dniu deadline'u).

**Lessons learned:**
- Linki SwissTransfer wygasają po ~30 dniach — materiały klienta pobierać lokalnie w dniu otrzymania.
- Deadline ustalony telefonicznie nie istnieje w mailach — każde ustalenie głosowe musi być od razu zapisane w systemie.
- Projekt wspomniany przy przedstawieniu (Południk 17) nigdy nie ruszył — wzmianka klienta ≠ pipeline, nie planować pod nią mocy.

**Missed opportunities:**
- Brak formalnej akceptacji wyceny i liczby stron przed startem prac — potrzebny SOP ofertowy (potwierdzenie zakresu mailem przed produkcją).
- Materiały nie zostały domknięte przed urlopem Marty (3–7.08) mimo znanego ryzyka — zabrakło proaktywnej eskalacji przed 3.08.
- Prezenter Bulwaru, wzorzec całego zlecenia, nie został opisany w systemie jako szablon — konwencję trzeba odtwarzać z pamięci ludzkiej.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/archicom-prezenter-reymonta.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/archicom-brand.md

</details>

---

### Brand system Osada Orle w Figmie (tryby Dzień/Noc)

**Klient:** Osada Orle / Izera Sp. z o.o. (górska osada gastronomiczno-rekreacyjna, Góry Izerskie)  
**Status:** Zakończony jako działający system referencyjny — aktywnie zasila deck sponsorski Morisson

**Cel biznesowy:** Przełożyć strategię marki (dokumenty: 1-pager, strategia marketingowa 15 str., warsztat pozycjonowania) na operacyjny design system w Figmie, który realnie produkuje materiały — w pierwszej kolejności deck sponsorski.

**Problem:** Klient miał esencję marki tylko w dokumentach strategicznych ('Karmimy ciało i duszę na izerskim szlaku', archetyp Opiekun 65%/Twórca 35%, ton na 'Ty'), ale zero systemu wizualnego zdatnego do spójnej produkcji materiałów.

**Proces:** Destylacja esencji marki z PDF/docx → budowa pliku Figma o 4 stronach (01 Okładka, 02 Fundamenty, 03 Komponenty: Button/Tag/Card, 04 Przykład użycia) z pełnymi prymitywami kolorów i warstwą semantyczną.

**Workflow:** Dokumenty strategiczne → esencja marki w pamięci systemu → design system w Figmie (zespół 'reszek') → konsumpcja tokenów i fontów w kolejnych projektach (deck Morisson używa Fraunces+Work Sans i palety granat/mosiądz/las/papier).

**Architektura:** Plik Figma tXqtp37NOWPGchjsKCvf8d: prymitywy 50–900 dla 4 rodzin kolorów (Granat izerski #2E4565, Mosiądz #B0863B, Las #5E7547, Papier #FBF8F1) + tryby semantyczne Dzień/Noc + komponenty bazowe; fonty Fraunces (nagłówki) i Work Sans (UI/treść).

**Narzędzia:** Figma (use_figma, zespół 'reszek'), Dokumenty źródłowe klienta (PDF strategia, docx warsztat, logo jpeg), System pamięci Claude (osada-orle-brand.md)

**Agenci użyci:**
- Claude budujący design system programowo w Figmie w ramach sesji (zmienne, tryby, komponenty).

**Agenci możliwi:**
- Agent generujący materiały operacyjne osady (menu, plakaty eventowe, posty) bezpośrednio z tokenów Dzień/Noc.
- Agent audytujący nowe materiały pod zgodność z paletą, fontami i tonem marki.

**Automatyzacje zrobione:**
- Programowa budowa systemu (prymitywy 50–900, tryby semantyczne, komponenty) zamiast ręcznego klikania w Figmie.

**Automatyzacje możliwe:**
- Publikacja pliku jako biblioteki Figma i podpięcie do decku Morisson, żeby zmiany tokenów propagowały się automatycznie.
- Generator brand booka PDF z pliku Figma jako deliverable dla klienta.

**Reusable assets:**
- Struktura 4-stronicowego design systemu (Okładka/Fundamenty/Komponenty/Przykład) jako szablon dla kolejnych klientów HORECA.
- Wzorzec 'prymitywy 50–900 + warstwa semantyczna z trybami' przenośny na każdą markę.
- Destylat esencji marki w pamięci (obietnica, archetypy, grupy docelowe, figura Gospodarza) zasilający każdy kolejny materiał.

**Unique elements (czego standardowa agencja nie robi):**
- Tryb 'Noc' jako decyzja tokenowa zakorzeniona w strategii (Park Ciemnego Nieba) — system wizualny wynika z pozycjonowania, nie z estetyki.
- Design system zbudowany wyprzedzająco jako 'przykładowy' — spec work, który natychmiast skompoundował w realny projekt (deck sponsorski).
- Archetypy i ton marki trzymane obok tokenów w jednym systemie wiedzy, więc AI może produkować materiały spójne słowem i obrazem.

**Lessons learned:**
- Rozdzielenie pliku design-system od pliku produkcyjnego (Morisson) działa, ale wymaga dyscypliny — pamięć musi jawnie ostrzegać, żeby ich nie mylić.
- Konsekwentne fonty i paleta zdefiniowane raz w systemie eliminują dyskusje brandowe w projektach pochodnych (w decku 'Fonty Fraunces+Work Sans OK').

**Missed opportunities:**
- System nie jest opublikowaną biblioteką Figma podpiętą do decku — spójność między plikami utrzymywana ręcznie/przez pamięć.
- Źródłowe dokumenty klienta leżały na Desktopie (folder 'OSADA ORLE' już nie istnieje pod zapisaną ścieżką) — brak trwałej archiwizacji wejść projektu.
- Brak deliverable'u brand book dla klienta, który mógłby być osobno wyceniony i sprzedany.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/osada-orle-brand.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/osada-orle-deck-sponsorski.md

</details>

---

### Deck sponsorski Osada Orle ('Morisson') — 3 wersje + obsługa feedbacku przez API Figmy

**Klient:** Osada Orle / Izera Sp. z o.o. (kontakt: Jan Rogala; dzierżawa Polana Jakuszycka, kontrakt 30 lat)  
**Status:** W toku — sprint 07/08.2026: 22 otwarte komentarze klienta w 6 strumieniach, 11 nowych slajdów draft zbudowanych w kopii roboczej

**Cel biznesowy:** Pozyskanie sponsorów i inwestorów dla Osady Orle przez deck w 3 targetowanych wersjach: ogólna (inwestor), Pilsner Urquell ('Noc z Pilsnerem', wyłączność gastro, footfall) i Castorama (CSR: noclegi dla dzieci z pieczy zastępczej, wolontariat pracowniczy).

**Problem:** 46 komentarzy klienta (24 rozwiązane, 22 otwarte) rozproszonych w ciężkim pliku Figma, którego oficjalne MCP nie potrafi obsłużyć: brak czytnika komentarzy, nakładające się piny, timeouty odczytu strony z 61 dziećmi — feedback był praktycznie nieprzetwarzalny standardowymi narzędziami.

**Proces:** Odczyt wszystkich komentarzy wewnętrznym API Figmy z zalogowanej sesji Chrome → deduplikacja (C18=C37, C19=C38) i klasteryzacja do 6 strumieni roboczych WS1–WS6 → budowa 11 nowych slajdów z treści komentarzy na czystej stronie kopii pliku → plan sprintu (projektant, 5 dni, wszystko P0/P1, load ~100%).

**Workflow:** Komentarze Jana w pliku 'Morisson' (mRIPaIu7UzaQSKMqmtVR14) → fetch('/api/file/<key>/comments', {credentials:'include'}) → strumienie robocze → drafty slajdów w 'Morisson (Copy)' (gxAepLF92YHvCe5Od8PXJt), strona '★ NOWE SLAJDY (draft)' w 3 kolumnach wg wersji → walidacja Reszka/projektanta → wdrożenie do oryginału.

**Architektura:** Oryginał (ciężki, tylko źródło feedbacku) + kopia robocza z czystą stroną draftów; slajdy jako ramki 'Page NN' 1920×1080; kodowanie wersji kolorem z brand systemu: Pilsner = granat+mosiądz, Castorama = papier+las, ogólna = las; fonty Fraunces+Work Sans z design systemu Osady.

**Narzędzia:** Figma (use_figma do budowy slajdów), Chrome + wewnętrzne API Figmy (odczyt komentarzy z sesji zalogowanej), Brand system Osada Orle (tokeny i fonty z pliku tXqtp37NOWPGchjsKCvf8d), System pamięci Claude (stan komentarzy, strumienie, plan sprintu)

**Agenci użyci:**
- Claude jako parser/inwentaryzator komentarzy klienta i klasteryzator do strumieni roboczych.
- Claude jako budowniczy 11 slajdów draft z treści komentarzy (programowo w Figmie).

**Agenci możliwi:**
- Agent 'feedback router': cykliczny odczyt komentarzy Figmy → automatyczny backlog P0/P1 z deduplikacją i statusami dla projektanta.
- Agent spójności 3 wersji decku: diff treści master slajdów między wariantami i raport rozjazdów.

**Automatyzacje zrobione:**
- Automatyczny odczyt i inwentaryzacja 46 komentarzy przez wewnętrzne API Figmy — obejście braku czytnika komentarzy w oficjalnym MCP.
- Programowa budowa 11 slajdów draft z treści komentarzy w 3 kolumnach wg wersji decku.

**Automatyzacje możliwe:**
- Cykliczny sync komentarzy Figma → lista zadań z alertem o nowych/rozwiązanych (dziś stan trzeba odpytywać ręcznie).
- Generator wariantów decku: wspólne master slajdy + nakładki per sponsor, zamiast utrzymywania 3 kopii ręcznie.
- Automatyczny raport statusu prac dla klienta (co rozwiązane, co w toku) generowany ze stanu komentarzy.

**Reusable assets:**
- Technika odczytu komentarzy Figmy: fetch('/api/file/<key>/comments', {credentials:'include'}) z zalogowanej sesji — działa dla każdego klienta.
- Wzorzec 'kopia robocza + czysta strona draft' dla ciężkich plików Figmy, które timeout'ują odczyty MCP.
- Struktura decku sponsorskiego w 3 targetowanych wariantach z jednej podstawy brandowej.
- Metoda klasteryzacji feedbacku klienta w strumienie robocze z deduplikacją przed wyceną pracy.

**Unique elements (czego standardowa agencja nie robi):**
- Obejście twardego limitu oficjalnego MCP Figmy wewnętrznym API — standardowa agencja klikałaby po 46 nakładających się pinach ręcznie.
- Feedback klienta przetworzony systemowo (deduplikacja, strumienie, priorytety) zamiast liniowego odpowiadania komentarz po komentarzu.
- Trzy wersje decku pod trzech różnych sponsorów (inwestor/piwo/CSR) zasilane jednym design systemem klienta.
- Rozbicie jednego komentarza (disc golf, C28) na 3 slajdy zgodnie z intencją klienta odczytaną z treści, nie z liczby pinów.

**Lessons learned:**
- Ciężkie strony Figmy (61 dzieci) timeout'ują odczyty use_figma — nowe rzeczy budować na czystych stronach, oryginał traktować jako read-only.
- Realne nazwiska w cytatach (C14/C15) = ryzyko zgód wizerunkowych, do wyłapania przed publikacją decku.
- Komentarze klienta bywają duplikatami (C18=C37, C19=C38) — deduplikować przed planowaniem sprintu, inaczej zawyża się zakres.
- Spójność 3 wersji to główne ryzyko utrzymaniowe — wskazane wspólne master slajdy.

**Missed opportunities:**
- Technika czytania komentarzy przez API nie została spakowana jako narzędzie/SOP r352 (skrypt + instrukcja) mimo oczywistej reużywalności u każdego klienta Figmowego.
- Master slajdy wspólne dla 3 wersji zidentyfikowane jako potrzeba, ale niewdrożone jako komponenty Figmy — każda zmiana globalna kosztuje 3×.
- Brak automatycznego raportu postępu dla Jana Rogali — status prac komunikowany ręcznie zamiast generowany ze stanu komentarzy.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/osada-orle-deck-sponsorski.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/osada-orle-brand.md

</details>

---

## Produkty własne

### TeamBudget — strategia GTM + MVP

**Klient:** BetterWorkplace (cel komercyjny: sprzedaż wdrożenia przez r352)  
**Status:** Aktywny; zestaw roboczy skonsolidowany 19.07.2026 do 3 plików (lejki-zakres, MVP, strategia md), reszta widoków w archiwum-TeamBudget/; premiera planowana na Better Minds HR X.2026.

**Cel biznesowy:** Sprzedać BetterWorkplace wdrożenie TeamBudget w 4 pakietach (Strona / Demo / Wideo / Kampania); strategia GTM i interaktywny hub to narracja prowadząca do tej sprzedaży, a prototyp MVP i projekt strony to gotowe dowody kompetencji w pitchu.

**Problem:** TeamBudget potrzebował pełnej strategii wejścia na rynek (kategoria, persony, lejki, pozycjonowanie przez CFO zamiast benefitu) oraz materiałów zrozumiałych dla nietechnicznego zarządu — bez tego brak podstawy do decyzji i sprzedaży wdrożenia.

**Proces:** Brief Reszka (23 sekcje) → pełny dokument md → interaktywne widoki HTML (hub, sprint, strona produktowa, MVP, one-pager zarządu) generowane skryptami python z jednego źródła → ocena „Droga do 9000" w 10 kategoriach z bramkami re-ocen → konsolidacja do 3 plików po decyzji „za dużo tego".

**Workflow:** Jedno źródło danych (tb-body.html w scratchpadzie z markerem /*__FONTS__*/) → skrypty build_sprint.py / build_site.py / build_mvp.py / build_board.py wycinają i sklejają widoki → publikacja jako artefakty Claude z republish na tych samych URL-ach.

**Architektura:** Statyczne single-file HTML z własnym design systemem TB (paleta Pale White/ink/Blue Sky/Orange, fonty DM Sans/DM Mono wbudowane base64, bo CSP artefaktów blokuje CDN); klikalny prototyp MVP na localStorage (kreator 3 kroki, rytuały z serią #N); hosting = artefakty Claude.

**Narzędzia:** Claude Code, Python (skrypty build_*.py), Artefakty Claude (hosting + republish), HTML/CSS/JS + localStorage

**Agenci użyci:**
- Praca w sesjach Claude Code bez wyodrębnionych nazwanych agentów (wg dostępnych źródeł).

**Agenci możliwi:**
- Agent re-oceny strategii wg scoreboardu 1–10000, uruchamiany po dowiezionych akcjach/danych (terminy R1–R3 już zdefiniowane).
- Agent aktualizujący wszystkie widoki HTML po edycji źródłowego md, z republishem artefaktów.

**Automatyzacje zrobione:**
- Skrypty build_*.py generujące 4 widoki z jednego źródła danych (persony/lejki mają jedno źródło dla widoku sprintowego i huba).
- Powtarzalny mechanizm republishu artefaktów pod stałymi URL-ami.

**Automatyzacje możliwe:**
- Jeden pipeline md → wszystkie widoki HTML → republish, odpalany po każdej zmianie strategii.
- Generator wariantów materiału per odbiorca (zarząd / zespół sprzedaży / CMO) z automatycznym filtrowaniem liczb poza zakresem Reszka.

**Reusable assets:**
- Design system TB z fontami base64 jako obejście CSP artefaktów (wzorzec przenośny na inne huby).
- Wzorzec „jedno źródło → wiele widoków" sklejanych pythonem.
- Framework oceny strategii 1–10000 z bramkami datowymi i zasadą „oceny rosną tylko za dowiezione akcje".
- Koncepcja „raport = strona, nie PDF" jako element oferty pakietu Strona.

**Unique elements (czego standardowa agencja nie robi):**
- Strategia oddana jako interaktywny hub z klikalnymi lejkami i scoreboardem zamiast prezentacji/PDF.
- Prototyp MVP zbudowany w ramach strategii jako dowód kompetencji przed sprzedażą wdrożenia.
- Twarde rozdzielenie zakresów: materiały Reszka oczyszczone z pricingu i KPI konwersji (liczby żyją tylko w sekcjach dla zespołu sprzedaży).
- Optyka „B2C do wąskiej policzalnej niszy": imienna lista decydentów, KPI = penetracja grupy, frequency cap.

**Lessons learned:**
- Za dużo równoległych widoków = chaos; konsolidacja do rdzenia + archiwum i zasada „nowe elementy do rdzenia, nie nowe widoki".
- CSP artefaktów blokuje CDN — fonty trzeba wbudować base64.
- Panel przeglądarki nie zrzuca ekranu przewiniętej strony — weryfikować przez chowanie sekcji przy scrollY=0.
- Bramkowane raporty (gated content) nie działają — wzorzec: treść otwarta + kontakt za personalizację.

**Missed opportunities:**
- Pipeline md→HTML nie został sparametryzowany jako produkt wielokrotnego użytku dla kolejnych strategii klienckich.
- Scoreboard „Droga do 9000" nie istnieje jako generyczne narzędzie oceny strategii (potencjalny asset sprzedażowy r352).
- Brak komponentu listy decydentów/CRM, mimo że strategia wskazuje policzalną pulę kilku tysięcy osób.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/teambudget-gtm-hub.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/archiwum-TeamBudget/
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/TeamBudget-MVP.html (nie czytany — opisany w pamięci)
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/TeamBudget-strategia-GTM.md (nie czytany — opisany w pamięci)

</details>

---

### Caterelo — relocation engine + Deal Radar

**Klient:** Produkt własny r352 (Reszek)  
**Status:** LIVE na caterelo.com (MCP na produkcji); beta wygasa automatycznie 31.08.2026; naprawy z 07.08 (commit 6f40af6) czekają na deploy; wtyczka nie jest jeszcze w Chrome Web Store; zero przychodu i wiarygodnych metryk.

**Cel biznesowy:** Silnik decyzji relokacyjnych dla Płd. Europy (90 regionów, 6 krajów) z warstwą premium; narracja „data/AI infrastructure" z wariantem traction bez przychodu na Wave by Vento (Turyn, 7–9.10.2026).

**Problem:** Osoby rozważające relokację nie mają narzędzia porównującego dziesiątki regionów w wielu krajach na spójnych danych; dodatkowo w trakcie przeglądania portali nieruchomości brakuje natychmiastowej oceny okazji (rolę tę pełni wtyczka Deal Radar).

**Proces:** Rozwój web appki (React MPA, 90 stron regionów) → patch integralności danych (trendy oznaczone „modelled") odblokowujący ścieżkę B2B → audyt 07.08 i naprawy parsera wtyczki → przygotowanie paczki do CWS → plan Wave 10.2026.

**Workflow:** Kod w repo prywatnym github.com/reszkovy/caterelo (branch v1.5-mentor-feedback) → deploy `npx vercel --prod` na caterelo.com; wtyczka pakowana osobno do zipa na sklep; MCP wystawiony jako endpoint produkcyjny /api/mcp/.

**Architektura:** Web app React18+Vite MPA (proptrend-deploy) na Vercelu (limit 12/12 funkcji, bundle 636 kB); wtyczka Chrome „Deal Radar" v1.2.0 z parserem cen na portalach (m.in. Njuškalo, SeLoger); serwer MCP z 5 narzędziami na produkcji; GA4 (G-EQH8VFXZDX) z otagowanym lejkiem; premium przez kody po płatności Stripe.

**Narzędzia:** React 18 + Vite (MPA), Vercel CLI (deploy + serverless functions), Chrome Extension (Manifest v3), MCP server (5 narzędzi na produkcji), GA4, Stripe (strona sukcesu + kody premium), GitHub (repo prywatne)

**Agenci użyci:**
- Osobny agent Claude, któremu Reszek zlecił implementację warstwy „community fabric / cammini" (07.2026; stan do weryfikacji przed ruszaniem repo).
- Sesje audytowe Claude Code (pełny audyt stanu 07.08.2026).

**Agenci możliwi:**
- Agent QA parsera wtyczki: cykliczne testy na próbkach ogłoszeń z obsługiwanych portali (regresje typu „sklejanie ceny z metrażem" wykryto dopiero ręcznie).
- Agent odświeżania danych regionów przy nowych cyklach danych źródłowych (ISTAT/INE/INSEE/DZS/ELSTAT).

**Automatyzacje zrobione:**
- Serwer MCP na produkcji jako maszynowy kanał dostępu do danych produktu.
- Automatyczne wygaśnięcie bety 31.08.2026 (BETA_DEADLINE zadziała bez udziału człowieka).
- Porządnie otagowane zdarzenia lejka w GA4.
- Systemowe oznaczenie trendów „modelled" w appce, metodologii i na 90 stronach regionów.

**Automatyzacje możliwe:**
- Rejestracja MCP w katalogach (dziś nigdzie nie jest zarejestrowany — zero dystrybucji tego kanału).
- Kody premium per transakcja zamiast jednego wspólnego (wymaga decyzji infrastrukturalnej przez limit 12/12 funkcji).
- Krok buildu czyszczący dateModified, żeby build nie brudził drzewa 219 plików.
- Automatyczny deploy po merge zamiast ręcznego vercel --prod (naprawy potrafią czekać na deploy).

**Reusable assets:**
- Serwer MCP jako wzorzec dystrybucji danych produktu do agentów AI (przenośny na inne produkty r352).
- Parser cen z portali nieruchomości we wtyczce (wraz z wiedzą o edge case'ach).
- Metodologia uczciwego etykietowania danych modelowanych z kalibracją do źródeł statystycznych.

**Unique elements (czego standardowa agencja nie robi):**
- MCP jako natywny kanał produktu — standardowa agencja/produktownia tego nie robi.
- Wtyczka oceniająca okazje bezpośrednio na stronach portali zamiast kolejnego portalu-agregatora.
- Rygor integralności danych: zamiast udawać dane OMI, jawne „modelled" + zakaz powoływania się na źródło, którego nie ma.
- Pomysł warstwy „community fabric / cammini" łączący produkt z prywatną tezą inwestycyjną (italy-property-plan).

**Lessons learned:**
- Kanoniczny URL MCP wymaga końcowego slasha — bez niego 308, za którym wielu klientów MCP nie podąża.
- Jeden wspólny kod premium (TREN7) jest trywialny do obejścia i był wydawany każdemu — bramkować i projektować kody per transakcja od początku.
- Build przepisujący dateModified w 219 plikach brudzi drzewo — stage'ować tylko swoje pliki i robić git checkout -- .
- Limit 12/12 funkcji Vercela to twardy sufit — dodanie trasy API wywala deploy.
- Placeholder w remote (TWOJ-USER) i git tylko lokalny to realne ryzyko utraty pracy — repo wypchnięte dopiero 07.08.

**Missed opportunities:**
- Wtyczka wciąż niezłożona do Chrome Web Store (brakowały tylko zrzuty 1280×800) — zero dystrybucji mimo gotowej paczki.
- MCP niezarejestrowany w żadnym katalogu — unikalny kanał bez żadnej widoczności.
- Brak walidacji popytu (zero przychodu, zero metryk) przed dalszą rozbudową funkcji.
- Fałszywe zdarzenia purchase w GA4 psuły dane analityczne aż do audytu 07.08.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/caterelo-product.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/italy-property-plan.md

</details>

---

### Penya SaaS — onboarding penyi FC Barcelona

**Klient:** Pilot: Penya Blaugrana de Łódź #2327 (realny klient, kontakt przez właściciela 9campnou); docelowo SaaS dla penyi na świecie  
**Status:** LIVE na penyalodz.vercel.app; Supabase podłączony, realne dane 165 rekordów sezonu 25/26 zaimportowane, panel admina produkcyjny; Sprint B (płatności online) zakodowany — czeka na dane konta P24/KYC od zarządu penyi; cutover DNS po UAT.

**Cel biznesowy:** Produkt SaaS do onboardingu członków fanklubów FC Barcelona: samoobsługowa rekrutacja, płatności i panel członka; pilot Łódź jako case study „before/after" i podstawa sprzedaży innym penyom (architektura multi-tenant od pierwszego dnia).

**Problem:** Stara rekrutacja penyi = mail z danymi osobowymi (w tym numerem dowodu) + ręczny przelew i ręczna księgowość zarządu; brak samoobsługi, automatyki statusów, panelu członka i zgodnego z RODO przepływu danych.

**Proces:** Eksport z Figma Make → refaktor na multi-tenant → migracje Supabase z RLS → plan dwufazowy: Sprint A (realne zapisy bez płatności online, przelew + ręczne „opłacone") → import realnych danych z CSV Google Forms → Sprint B (płatności online, zmiana wariantu ze Stripe na Przelewy24) → cutover DNS.

**Workflow:** Zgłoszenie bez konta auth (anon INSERT, RLS) → ekran przelewu z tytułem generowanym z configu tenanta → admin zmienia statusy (applied→paid→activated, aktywacja ręczna bo FCB) → panel członka z timeline i cyfrową legitymacją PNG; deploy przez Vercel CLI.

**Architektura:** Vite+React+Tailwind v4; multi-tenant: src/lib/tenant/ (types+registry+TenantProvider), tokeny brand-* wstrzykiwane na :root per tenant, resolver query param → subdomena → default; Supabase (penyas/profiles/memberships/payments/applications + RLS member/admin/superadmin); edge functions płatności (p24-create-payment z sha384 i obowiązkowym /transaction/verify, p24-webhook; Stripe w repo jako wariant pod przyszły Connect); dual-mode frontend (bez .env demo, z kluczami live).

**Narzędzia:** Figma Make (eksport startowy), Vite + React + Tailwind v4, Supabase (Postgres + RLS + edge functions + auth magic link), Przelewy24 (wariant docelowy) / Stripe (wariant SaaS), Resend (maile — czeka na klucz), Vercel CLI + Vercel Analytics

**Agenci użyci:**
- Sesje Claude Code + Claude sterujący Chrome Reszka do operacji w panelach (podłączenie Supabase, import danych przez REST+admin JWT, nadawanie ról przez Table Editor).

**Agenci możliwi:**
- Agent onboardingu nowego tenanta: config + kolory + seed bazy + deploy dla kolejnej penyi (dziś wymaga zmian w kodzie/registry).
- Agent obsługi zgłoszeń: przypomnienia o płatności, raport tygodniowy dla zarządu, flagowanie duplikatów.

**Automatyzacje zrobione:**
- Webhook płatności zmieniający status applied→paid idempotentnie (kwota brana z DB, nie z klienta).
- Import 165 realnych rekordów przez REST anon (bulk INSERT) + PATCH statusów z admin JWT, z dedupe ze 177 wierszy CSV.
- Magic link auth + RLS zamiast ręcznego zarządzania dostępami.
- Eksport CSV i live-statystyki w panelu admina.

**Automatyzacje możliwe:**
- Maile transakcyjne Resend po zgłoszeniu/wpłacie (klucz gotowy, czeka na wklejenie sekretu).
- Samoobsługowy provisioning tenantów jako rdzeń modelu SaaS.
- Automatyczna rotacja sezonów i archiwizacja rekordów wg polityki RODO.

**Reusable assets:**
- Architektura multi-tenant z tokenami brandu per tenant (demo ?penya=mallorca przebranowuje całą apkę) — szkielet pod każdy SaaS r352.
- Schemat Supabase + RLS dla organizacji członkowskich (zgłoszenia/składki/role).
- Edge functions P24 z poprawnym flow weryfikacji podpisu.
- SETUP.md i SPRINT.md jako runbooki oddzielające gestię Reszka (konta) od kodu.
- Wzorzec awaryjnego importu danych przez REST, gdy SQL editor Supabase leży.

**Unique elements (czego standardowa agencja nie robi):**
- Multi-tenant zbudowany już na etapie pilota jednego klienta — od razu produkt, nie strona.
- Świadoma minimalizacja RODO: dat urodzenia z CSV celowo nie zaimportowano.
- Zasada „social proof tylko fakty" — zero zmyślonych opinii i liczb, składka i liczba członków potwierdzone u źródła.
- SEO parity przy migracji bloga: oryginalne slugi root-level zachowane 1:1.
- Kwota płatności zawsze z bazy, nigdy z klienta.

**Lessons learned:**
- SQL editor Supabase bywa niedostępny — mieć zapasową ścieżkę REST/Table Editor na każdą operację.
- Anon RLS bez SELECT łamie RETURNING — uuid generować po stronie klienta.
- IntersectionObserver stalluje w ukrytych kartach — sticky CTA na pasywnym scroll-listenerze.
- javascript_tool w Chrome: async IIFE zwraca {} — używać top-level await.
- KYC bramki płatności to ryzyko krytyczne — startować pierwszego dnia sprintu, nie na końcu.
- Copy bez patosu — konkret lokalny („Barça w Łodzi") wygrywa z frazesami.

**Missed opportunities:**
- Brak automatyzacji dodawania tenantów — skalowanie SaaS wymaga dziś pracy dewelopera.
- i18n szkieletu UI na sztywno PL — bariera dla sprzedaży penyom poza Polską (mimo demo ES dla Mallorki).
- Case study „before/after" jeszcze nieopublikowane, choć dane wejściowe (stary proces z nr dowodu) są udokumentowane.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/penya-saas.md

</details>

---

### Camp Nou 3D — experience every seat

**Klient:** Właściciel 9campnou.com (kumpel Reszka; ten sam kontakt co pilot Penya SaaS); publikacja pod marką r352  
**Status:** LIVE na r352.com/9campnou (v6 z naprawami mobile); czeka na podmianę BOOKING_URL na link afiliacyjny właściciela; drobne bugi odłożone do spokojnej sesji.

**Cel biznesowy:** Widget afiliacyjny dla 9campnou: użytkownik ogląda widok z dowolnego z ~55k miejsc Spotify Camp Nou i przechodzi przez „BOOK TICKETS" do zakupu biletów z linku afiliacyjnego.

**Problem:** Kupujący bilety nie wiedzą, jak wygląda widok z konkretnego sektora; istniejący koncept (StadiView) ma licencję PolyForm Noncommercial, więc kodu nie wolno było użyć komercyjnie — całość napisana od zera.

**Proces:** Analiza oryginału i licencji → budowa od zera w stylistyce 9campnou (18.07.2026) → iteracje v2–v6 tego samego dnia i kolejnych (logo, mozaiki, fasada, realny układ sektorów wg oficjalnej mapy 2026, check-my-seat, naprawy mobile) → publikacja przez repo r352.

**Workflow:** Edycja campnou-3d/index.html → kopia do scratchpada (sandbox nie czyta Desktopu) → podgląd na porcie 8877 → po akceptacji kopia do ~/Desktop/R352 WEBSITE/public/9campnou/ → commit+push na main → auto-deploy Vercel (~2,5 min).

**Architektura:** Single-file Three.js r128 + GSAP z CDN (~1100 linii własnego kodu): superelipsa n=3 jako geometria misy, 3 trybuny, ~55k krzesełek InstancedMesh + setColorAt, mozaiki z samplowania canvasu po łuku w metrach, picking raycasterem (hover throttled 90 ms), flyToSeat/exitSeat na GSAP z zabezpieczeniami, warstwowa fasada z 16 bramami, realne pierścienie sektorów 0xx–5xx (4xx/5xx „EN OBRES" preview-only).

**Narzędzia:** Three.js r128 (InstancedMesh, raycaster), GSAP (animacje kamery), Canvas API (mozaiki, etykiety sprite), Preview server z launch.json (port 8877, kopia w scratchpadzie), Repo r352 + Vercel (auto-deploy)

**Agenci użyci:**
- Sesje Claude Code bez wyodrębnionych nazwanych agentów (wg dostępnych źródeł).

**Agenci możliwi:**
- Agent parametryzujący silnik pod inny stadion na podstawie mapy sektorów (powtórzenie modelu widgetu afiliacyjnego dla innych obiektów).
- Agent smoke-testów po każdej edycji (random seat, check-my-seat, mobile viewport) zamiast ręcznego przeklikiwania.

**Automatyzacje zrobione:**
- Deploy przez wzorzec kopia+push=auto-deploy Vercel (bez ręcznej publikacji).
- Proceduralne generowanie całej misy (krzesełka, sektory, mozaiki, etykiety) z danych, nie z modeli 3D.

**Automatyzacje możliwe:**
- Jeden skrypt „publish": cp do repo r352 + commit + push (dziś kroki ręczne).
- Automatyczna kopia do scratchpada po każdej edycji (łatwo o rozjazd wersji podglądu).

**Reusable assets:**
- Silnik stadionu (superelipsa + InstancedMesh + picking + flyToSeat) możliwy do sparametryzowania dla innych stadionów/aren.
- Wzorzec pills/toggle UI współdzielony z kubota-stand-3d.
- Udokumentowane gotchas rAF/GSAP w ukrytych kartach (ensureTweenEnds z progress()<1).
- Wzorzec publikacji public/<projekt>/index.html w repo r352.

**Unique elements (czego standardowa agencja nie robi):**
- Świadoma decyzja licencyjna: kod od zera zamiast kopiowania z deployu na licencji Noncommercial, z creditem dla inspiracji.
- Realny układ sektorów Spotify Camp Nou 2026 z nierówną numeracją per trybuna i strefami „OPENS 2027".
- Model biznesowy widget afiliacyjny osadzony w cudzej marce (9campnou) zamiast sprzedaży strony.
- ~55k interaktywnych miejsc w jednym pliku HTML bez buildu i zależności poza CDN.

**Lessons learned:**
- Elipsa nie mieści prostokąta boiska w narożach — superelipsa n=3.
- W ukrytej karcie rAF nie tyka, a tweeny GSAP w ogóle nie startują — setTimeout do rozmieszczania i bezpiecznik dokończenia tweenów.
- Preview trzyma stary dokument mimo force i cp — nawigacja z cache-busterem.
- Losować miejsca tylko z wypełnionych slotów (tablice mają dziury (0,0,0)).
- Nie odpalać wielkich workflowów do drobiazgów — spalone 3,3 mln tokenów.
- Odwrócony winding przy y1>y2 wymaga DoubleSide.

**Missed opportunities:**
- BOOKING_URL wciąż wskazuje fcbarcelona.com zamiast linku afiliacyjnego — widget nie zarabia.
- Silnik nie został sparametryzowany pod kolejne stadiony, choć to naturalna produktyzacja.
- Brak jakichkolwiek metryk użycia widgetu (nie wiadomo, czy ktoś z niego korzysta).

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/campnou-3d.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/campnou-3d/ (index.html 80 KB — nie czytany, opisany w pamięci)

</details>

---

### Stand KUBOTA×Baltona — wizualizacja 3D z dielinów

**Klient:** Baltona (kontakt: Bartosz Mossakowski); brand KUBOTA  
**Status:** LIVE na r352.com/kubotabaltona; konstrukcja dwustronna zatwierdzona po feedbacku Baltony (17.07.2026); rendery Higgsfield 4K (front/34/bok/tył) zrobione i2i z plate'ów; build.py aktualizowany jeszcze 04.08.

**Cel biznesowy:** Pokazać klientowi kartonowy stand na klapki w 3D bezpośrednio z dielinów produkcyjnych — akceptacja konstrukcji i grafik przed drukiem, bez kosztów klasycznego studia renderowego.

**Problem:** Klient dostaje dieliny 2D (SVG), z których trudno ocenić bryłę standu; klasyczne rendery 3D są wolne i drogie, a generacja AI z samego tekstu halucynuje konstrukcję.

**Proces:** Dieliny SVG klienta skopiowane do projektu (źródło prawdy) → build.py generuje index.html z geometrią w skali 10 j. = 1 cm → iteracje po feedbacku (przejście na konstrukcję dwustronną wg szkicu Bartosza) → zatwierdzenie wizualizacji → plate'y przez ?plate= → rendery Higgsfield i2i → publikacja na r352.com.

**Workflow:** Twarda bramka jakości: najpierw zatwierdzony index.html, dopiero potem generacja AI; rendery zawsze image-to-image z plate'ów (media_upload → curl PUT → media_confirm → nano_banana_pro), nigdy z tekstu.

**Architektura:** build.py (python) składa czysty HTML+CSS 3D bez żadnych zależności; panele z transform-origin 0 0; tryb renderu ?plate=front|34|side|back|top&dims=1&zoom= (ukrywa UI, jasne tło) + headless Chrome z --allow-file-access-from-files do zrzutów.

**Narzędzia:** Python (build.py), HTML + CSS 3D (bez bibliotek), Headless Chrome (zrzuty plate'ów), Higgsfield / nano_banana_pro (rendery i2i), Repo r352 + Vercel (publikacja)

**Agenci użyci:**
- Sesje Claude Code bez wyodrębnionych nazwanych agentów (wg dostępnych źródeł).

**Agenci możliwi:**
- Agent „dieliny → draft wizualizacji": przyjmuje SVG, uruchamia build, generuje plate'y i oddaje do QA Reszka.
- Agent pilnujący spójności wersji dielinów (Desktop vs folder projektu) przed każdym buildem.

**Automatyzacje zrobione:**
- build.py jako powtarzalny pipeline dieliny→wizualizacja (regeneracja index.html po każdej zmianie).
- Tryb ?plate= automatyzujący produkcję ujęć pod rendery AI.

**Automatyzacje możliwe:**
- Jeden skrypt end-to-end: build → zrzuty plate'ów headless Chrome → upload i rendery i2i.
- Parametryzacja build.py (wymiary, kolory, dieliny jako argumenty) pod produktyzację usługi wizualizacji standów POS.

**Reusable assets:**
- build.py jako silnik wizualizacji standów kartonowych z dielinów.
- Konwencja skali 10 jednostek = 1 cm i transform-origin 0 0.
- SOP „zero renderów AI przed zatwierdzeniem index.html" (ochrona kredytów).
- Wzorzec renderów i2i z plate'ów zamiast text-to-image.
- Wzorzec publikacji public/<projekt>/index.html w repo r352 (ten sam co Camp Nou).

**Unique elements (czego standardowa agencja nie robi):**
- Wizualizacja POS w czystym CSS 3D bez silnika 3D i bez zależności — jeden plik dla klienta.
- Twarda bramka jakości przed wydaniem kredytów na generację AI — odwrotność typowego „wygenerujmy i zobaczymy".
- Pipeline programistyczny (python z dielinów) tam, gdzie agencje robią ręczne rendery w studiu.

**Lessons learned:**
- Panele 3D wymagają transform-origin 0 0 — domyślne 50% przesuwa panel przy rotateY(±90).
- Pliki na Desktopie bywają przeterminowane — źródłem prawdy są kopie w folderze projektu.
- Lockup logo z białymi elementami jest niewidoczny na białym tle — nie dorabiać własnego znaku, użyć całego PNG.
- Generacja AI z samego tekstu halucynuje konstrukcję — zawsze i2i z zatwierdzonego źródła.

**Missed opportunities:**
- Pipeline nie został sparametryzowany jako produkt — kolejny stand wymaga edycji kodu zamiast podania dielinów.
- Brak spakowanej oferty typu „wizualizacja standu z dielinów w 24h" mimo gotowego procesu i live'owego dowodu.
- Brak automatycznego wykrywania nieaktualnych dielinów (problem wystąpił realnie z tyl.svg).

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/kubota-stand-3d.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/kubota-stand-3d/ (build.py, dieliny SVG, index.html — struktura zweryfikowana ls)

</details>

---

### The Post-AI Society (d. Human Commons) — wspólnota ery AI

**Klient:** Projekt własny Reszka (koncept inwestycyjno-społecznościowy, spięty z planem zakupu nieruchomości we Włoszech)  
**Status:** LIVE: humancommons.vercel.app (+ /scouting, /numbers, /investors za hasłem); IG @postaisociety działa z 3 postami; plan 90 dni z bramkami — kluczowa bramka GO/STOP 6.11.2026 (≥8 depozytów po 250 € + ≥4 zapraszających = GO); rekonesans Włochy 22.09–8.10.

**Cel biznesowy:** Zebrać pierwszą kohortę 20 osób na dwutygodniową rezydencję testową we Włoszech (wiosna 2027, ~1800 € all-in) i zwalidować tezę „AI → ludzie szukają wspólnot" przy kapitale na ryzyku ~30–40k €, zanim padnie jakakolwiek decyzja o nieruchomości.

**Problem:** Teza inwestycyjna wymaga dowodu popytu: wszyscy porównywalni gracze, którzy kupili lub wzięli długi leasing nieruchomości przed walidacją (Roam, WeLive, Common, The Assemblage), stracili; trzeba zbudować markę, ruch i kohortę bez fejków i bez wiązania kapitału.

**Proces:** Teza z italy-property-plan → strona-manifest single-file wg briefu (editorial, zero startupowych klisz) → rebrand na The Post-AI Society (08.2026) → research 4 agentów → plan 90 dni z bramkami → strony scouting/numbers/investors za hasłem → formularz „The first twenty" + IG worldbuilding → kompresja strony i sekcja Log.

**Workflow:** Edycja single-file HTML w human-commons/ → deploy `vercel deploy --prod --yes` (projekt postai); weryfikacja wizualna przez ?static=1; treści IG: plansze Higgsfield → Reszek przeciąga do okna IG, Claude robi caption i publikację.

**Architektura:** Zestaw statycznych single-file stron (index 11 sekcji, scouting, numbers z kalkulatorem break-even, investors 12 slajdów scroll-snap) na Vercelu; miękkie bramki hasłem `longtable` (JS + sessionStorage, noindex); formularz przez prefilled mailto z checkboxem „one of the twenty vs following along" (podmiana na Tally jedną linijką); plansze fotograficzne Higgsfield, logo SVG przerysowane 1:1 z konceptu Midjourney.

**Narzędzia:** HTML/CSS single-file (Newsreader + Plus Jakarta Sans, paleta linen/charcoal/stone/forest), Vercel CLI (projekt postai), Higgsfield (soul_2 — plansze Plate I–VI), Midjourney (koncept logo), nano banana (mapa rekonesansu), Instagram @postaisociety

**Agenci użyci:**
- Research 4 agentów do planu 90 dni (00-PLAN, 01-audience, 02-playbooks, 03-conversion w human-commons/plan/) — źródło kluczowych wniosków: model albergo diffuso, mechanizm 6 zapraszających × 3 osoby, przesunięcie rekonesansu pod Edge City India.

**Agenci możliwi:**
- Agent pilnujący bramek planu 90 dni (4.09 / 9.10 / 6.11) z przypomnieniami o zaległych akcjach.
- Agent researchu i przygotowania pierwszych kontaktów (Casa Netural, Jon Hillis, Phil Levin, Paul Millerd, Kai Brach) — drafty w stylu Reszka do jego akceptacji.

**Automatyzacje zrobione:**
- Praktycznie brak — świadomie statyczne strony, deploy ręczny przez CLI, formularz na prefilled mailto; jedyna „automatyka" to miękka bramka hasłem i licznik miejsc w HTML.

**Automatyzacje możliwe:**
- Podmiana mailto na Tally/Formspree + realna lista kontaktów (dziś leady zależą od klienta pocztowego użytkownika).
- Licznik „Twenty seats" zasilany z formularza zamiast ręcznej edycji.
- Pipeline plansza→post IG (dziś ręczne przeciąganie plików przez Reszka).

**Reusable assets:**
- Editorial design system (typografia, paleta linen, grain, plansze full-bleed) przenośny na inne strony-manifesty.
- Wzorzec ?static=1 wyłączający animacje do screenshotów/weryfikacji.
- Wzorzec reveal z fallback sweep (IO + scroll listener + rAF loop).
- Wzorzec miękkiej bramki hasłem (JS + sessionStorage + noindex).
- Metodologia planu 90 dni z datowanymi bramkami GO/STOP wyprowadzona z researchu wieloagentowego.

**Unique elements (czego standardowa agencja nie robi):**
- Zasada „worldbuilding in public, jawnie konceptowy" — zero fejkowych mieszkańców i udawania, że wspólnota istnieje.
- Sekcja Log (datowany rejestr faktów, także porażek) zamiast fikcyjnego Journala; z góry zaplanowany wpis „Abandoned" z liczbami przy STOP.
- Anonimowość założyciela jako świadomy zabieg narracyjny (portret ze szkła, „my name is not on this page yet").
- Wniosek strategiczny wbrew pierwotnemu planowi: NIE kupować nieruchomości — model albergo diffuso z wynajmem 20 łóżek poza sezonem.
- Ask do inwestorów = partnerzy strategiczni, nie runda.

**Lessons learned:**
- Walidacja przed kapitałem: cała kategoria dowodzi, że zakup nieruchomości przed dowodem popytu kończy się stratą.
- Pierwszej kohorty nie rekrutuje się z ulicy — mechanizm to zapraszający (6×3), nie marketing masowy.
- Mapy Włoch z generatorów wymagają korekty geografii (trasy przez morze).
- IntersectionObserver bez fallbacku zostawia treść na opacity 0 przy anchor-linkach.
- Feedback typograficzny: za dużo szeryfów — Newsreader tylko display, body na Plus Jakarta Sans.
- Terminy zewnętrzne (Edge City India) potrafią przestawić własny harmonogram — planować wokół skupisk kandydatów.

**Missed opportunities:**
- Formularz wciąż na mailto — realne ryzyko utraty leadów przed bramką 4.09 (60 maili / 15 deklaracji).
- Domeny (humancommons.it, postai.society, thepostaisociety.com) nieodkupione mimo decyzji.
- Brak newslettera/listy mailowej, choć cały plan 90 dni opiera się na relacjach 1:1 i seriach kontaktów.

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/human-commons-concept.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/italy-property-plan.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/human-commons/ (index.html, plan/, scouting/, numbers/, investors/, ig/ — struktura zweryfikowana ls)

</details>

---

## Case'y sprzedażowe i realizacje kreatywne

### DiMedical — redesign serwisu (case sprzedażowy)

**Klient:** DiMedical / Centrum Medycyny Klinicznej, Łódź (projekt spekulacyjny, bez zlecenia — Reszek projektował oryginał, więc ma prawa do assetów)  
**Status:** LIVE na dimedical.vercel.app (Lighthouse desktop 100/100/100/100, mobile 95/100/96/100); 38 stron (19 PL + 19 EN), pokrycie merytoryki 86%; zostało: backend formularza, strona case przed/po, podmiana zdjęć AI na realne.

**Cel biznesowy:** Case do sprzedaży podobnej usługi redesignu serwisów medycznych — ścieżka: publikacja jako własny koncept, potem pitch do DiMedical.

**Problem:** Oryginalny serwis ciężki (867 KB CSS+JS vs ~110 KB w redesignie, assety 11 MB vs 1,4 MB) i przestarzały wizualnie; potrzebny namacalny dowód jakości zamiast slajdów ofertowych.

**Proces:** Pełna inwentaryzacja oryginału (46 adresów z sitemap), pomiar pokrycia treści blok po bloku (28% → 86%), budowa własnego generatora statycznego, dwujęzyczność z tłumaczeń oryginału, optymalizacja do Lighthouse 100, deploy na Vercel.

**Workflow:** Edycja wyłącznie pages/*.html + partiali (_head/_nav/_foot) i plików .src → python3 build.py generuje 38 stron, minifikuje, dzieli CSS na krytyczny/odroczony, generuje sitemap i lazy-loading → deploy przez Vercel CLI z jawnym --scope + alias.

**Architektura:** Statyczny generator w Pythonie (build.py ~38 KB) + i18n.py (słownik UI, mapy SLUGI/KANON, hreflang); fonty lokalne w subsetach latin-ext; walidacja node --check z auto-rollbackiem po minifikacji; api/ pod przyszły formularz.

**Narzędzia:** Python (build.py, i18n.py, PIL do konwersji obrazów), Vercel CLI (scope reszkovys-projects), Lighthouse, Higgsfield (generowane zdjęcia laboratorium), node --check jako bramka jakości buildu

**Agenci możliwi:**
- Agent QA porównujący pokrycie treści redesignu z sitemap oryginału (normalizacja diakrytyków wbudowana)
- Agent generujący srcset/warianty obrazów pod mobile

**Automatyzacje zrobione:**
- Pipeline build.py: sklejanie partiali, minifikacja, split CSS krytyczny/odroczony, generacja sitemap i robots, lazy-loading obrazów
- Automatyczny rollback JS przy błędzie minifikacji (node --check)
- Skrypt wiszących spójników (&nbsp; w 360 miejscach, operuje tylko poza znacznikami)
- Generacja wersji EN z szablonów {{klucz}} + mapy slugów

**Automatyzacje możliwe:**
- Generator srcset domykający ostatnie punkty Lighthouse mobile
- Reusable test pokrycia merytoryki (sitemapa → bloki → raport %) dla każdego kolejnego redesignu
- Jednopoleceniowy deploy+alias+weryfikacja jako skrypt

**Reusable assets:**
- build.py + i18n.py jako szablon generatora statycznego dla kolejnych redesignów
- Checklist gotchas frontendowych (sticky, [hidden] vs flex, env() fallback, :has(), bilans klamer CSS, img height:auto)
- OFERTA-DIMEDICAL.md jako szablon maila/oferty
- SPRINT.md i PROMPTY-3D.md jako wzorce planowania
- Metoda QA w panelu podglądu Claude (pomiary DOM zamiast screenshotów)

**Unique elements (czego standardowa agencja nie robi):**
- Redesign spekulacyjny doprowadzony do jakości nieodróżnialnej od oficjalnego serwisu, z pomiarem pokrycia treści 1:1 wobec pełnej sitemapy
- Lighthouse 100/100/100/100 na desktopie jako twardy benchmark sprzedażowy
- Świadoma decyzja anty-AI-slop: dividery zamiast siatek kart, zero kursywy, ikony rysowane pod treść (spektrometr, nie mikroskop)
- Interaktywna ścieżka atutów (tor + iskra) zamiast standardowej listy USP

**Lessons learned:**
- Pomiar pokrycia treści na próbce stron jest mylący — liczyć wobec pełnej sitemapy (87% pozorne vs 28% realne)
- Stan ukryty (opacity:0) nigdy jako domyślny — przy uśpionym IntersectionObserver treść znika na zawsze
- Minifikator potrafi wypuścić zepsuty plik — walidacja składni i rollback muszą być w buildzie
- Panel podglądu Claude jest niewiarygodny (document.hidden=true) — QA przez pomiary DOM, nie 'na oko'
- Blokada indeksowania kosztuje punkty SEO w Lighthouse w trzech osobnych sygnałach

**Missed opportunities:**
- Strona case przed/po nie powstała, a to ona faktycznie sprzedaje usługę
- Formularz kontaktowy bez backendu
- Zdjęcia laboratorium generowane AI — przed pitch'em wymagają podmiany lub jawnego oznaczenia
- Brak srcset (świadomie odpuszczone punkty mobile)

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/dimedical-redesign.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/dimedical-redesign

</details>

---

### ARToffNIA — demo serwisu z katalogiem zajęć (oferta sprzedażowa)

**Klient:** Fundacja Tańca i Sztuki ARToffNIA, Olsztyn (sprzedaż w toku — demo budowane przed pokazaniem klientowi)  
**Status:** Demo kompletne: 19 stron HTML, 52 zajęcia w bazie (16 grup Pryzmatu 1:1 z cennikiem), kampania wizualna, wycena gotowa (WYCENA.md: 22k/29k/38k netto + opieka 600/mies.); czeka na prezentację klientowi.

**Cel biznesowy:** Sprzedaż nowej strony fundacji z pitch'em 'porządkujemy system, nie malujemy stronę' — mini-case wzorca jedno źródło danych → generowane widoki z frameworku r352.

**Problem:** Obecna strona (Squarespace): nawigacja 27 linkami tekstowymi, martwy grafik PDF z 2022, zapisy w trybie 'odezwiemy się', rabaty (−20%/−50%) zakopane w cenniku — realna oferta 43+ zajęć jest nieczytelna.

**Proces:** Scraping 33 podstron + cennika → baza zajęć z taksonomią (wiek/kategoria/klimat/miejsce/pora) → katalog z filtrami → pełny serwis 19 stron z mirrora starej strony → kampania Higgsfield per grupa wiekowa → audyt 5 person z punktacją → 5 napraw UX → wycena i remanent zakresu.

**Workflow:** zajecia.js = jedyne źródło danych (window.AFF_Z) konsumowane przez katalog, kalendarz tygodnia, landingi zajęć/grup, formularz zapisów i mega menu; edycje na Desktopie → rsync do scratchpada → podgląd na :8951 (sandbox nie czyta Desktopu).

**Architektura:** Statyczny serwis HTML + vanilla JS: szablony parametryzowane URL-em (zajecie.html?id=, grupa.html?g=, deep-linki ?kto/?kat/?zaj), współdzielony komponent menu.js wstrzykujący CSS+markup, kalkulator rabatów, kalendarz generowany z parsera terminów; design system 'muzeum sztuki nowoczesnej' (monochrom + kolory grup tylko funkcjonalnie).

**Narzędzia:** Scraping + agent-mirror starej strony (95+ podstron, 86 MB), Vanilla HTML/CSS/JS, Higgsfield (kreacje kampanijne soul_2), Figma (Reszek składał finalne kreacje), launch.json + serwer podglądu :8951

**Agenci użyci:**
- Agent-mirror całej starej strony do materialy-stara-strona/ (źródło treści, opisów i 70 zdjęć)
- Audyt 5 person z punktacją ścieżek (rodzic/dorosły/nastolatek/senior/opiekun seniora)

**Agenci możliwi:**
- Agent aktualizujący bazę zajęć z danych sezonowych klienta (godziny/ceny)
- Agent QA person uruchamiany po każdej większej zmianie serwisu

**Automatyzacje zrobione:**
- Wszystkie widoki (liczniki, kalendarz tygodnia, alternatywy przy grupach zamkniętych, preselekcja formularza, kalkulator rabatu −20/−50) generowane z jednej bazy zajecia.js
- Ekstrakcja 43 opisów zajęć i 20 biogramów kadry z mirrora
- Programowe usuwanie tła spotów kampanijnych (PNG z alfą)

**Automatyzacje możliwe:**
- Grafik i strony wiekowe generowane z tej samej bazy na produkcji (zaplanowane P1)
- Wysyłka formularzy + GA4/GTM (świadomie odłożone do produkcji)
- Automatyczna podmiana danych po otrzymaniu aktualnego cennika od klienta

**Reusable assets:**
- Wzorzec 'katalog-z-bazy': jedno źródło danych → katalog/kalendarz/landingi/formularz (bezpośrednio z frameworku r352)
- Przepis promptowy na realizm fotograficzny w Higgsfield (Portra 400, anty-retusz, anty-tekst)
- Szablon audytu person z punktacją
- WYCENA.md jako szablon wyceny dla NGO (3 pakiety + harmonogram pod granty)
- Kody kolorów grup wiekowych + zasada użycia koloru tylko funkcjonalnie

**Unique elements (czego standardowa agencja nie robi):**
- Pełny, działający serwis 19 stron zbudowany PRZED sprzedażą jako narzędzie ofertowe — nie makieta
- Kalendarz tygodnia z klastrami nakładek (Gmail-style) zastępujący martwy PDF grafiku
- Audyt 5 person z liczbową punktacją i naprawami przed pokazaniem klientowi
- Ocena nowego logo klienta z argumentacją do pitchu ('porządkujemy, nie wyrzucamy')
- Kampania AI z landingami per grupa wiekowa i mierzalną ścieżką kreacja→grupa→zajęcie→rezerwacja

**Lessons learned:**
- Dla grupy docelowej rodzice/seniorzy: lista zamiast siatki kart i filtry z jawnym stanem zaznaczenia
- Kreacja z 4 pasami kolorów wycofana (niechciane skojarzenie z flagą) — testować konotacje symboliki
- Filtr NSFW blokuje 'child+leotard' — dzieci opisywać w zwykłych ubraniach
- Sandbox podglądu nie czyta Desktopu — workflow rsync do scratchpada
- Podgląd wymaga cache-bustingu ?v= po podmianie plików graficznych

**Missed opportunities:**
- Demo (per pamięć z 26.07) wciąż niepokazane klientowi — ryzyko przeinwestowania przed walidacją
- Wysyłka formularzy i analityka niezrobione (świadomie, ale bez tego brak pomiaru demo)
- Brak zautomatyzowanego procesu aktualizacji danych sezonowych — na razie ręczny

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/artoffnia-oferta.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/artoffnia-demo

</details>

---

### LEMF 2027 — pitch deck (pipeline PPTX→Figma) + assety wizualne

**Klient:** Łódź Electronic Music Forum — propozycja dla Miasta Łodzi  
**Status:** FINAL 23.07: 21 slajdów wyrenderowanych na stronie Figma 'LEMF 2027 — FINAL' z natywnymi fontami; zdjęcia wgrane do storage, ale niepodpięte (ręczne edycje w trakcie renderu); folder lemf-assety z 31 świeżymi grafikami (06.08) wskazuje, że produkcja assetów trwa.

**Cel biznesowy:** Edytowalny pitch deck wydarzenia muzyki elektronicznej dla Miasta Łodzi — z PPTX klienta do w pełni edytowalnej Figmy.

**Problem:** Deck istniał tylko jako PPTX (wcześniej 13 płaskich PNG w Figmie) — nieedytowalny zespołowo i niemożliwy do iterowania w narzędziu projektowym.

**Proces:** Parser Pythona czyta XML PPTX → elements.json (per slajd: prostokąty, runy tekstu z pozycją/rozmiarem/kolorem/interlinią) → renderery batch{1..4}.js → use_figma buduje 21 frame'ów w siatce; wersja 2.0 z redesignem (Anton/Space Mono/Archivo, czerń+kość+limonka+róż) i 7 zdjęciami.

**Workflow:** PPTX → JSON → batch JS → Figma MCP (use_figma); mapowanie fontów w rendererze (Georgia→PT Serif, Arial→Inter w v1; v2 na fontach natywnych bez zamienników).

**Architektura:** Pipeline konwersji dokumentów: ekstrakcja geometrii i typografii z XML (pt→px ×4/3, alpha, anchor, spcPct) + renderer JS odtwarzający slajdy jako natywne obiekty Figmy.

**Narzędzia:** Python (parser XML PPTX), Figma MCP (use_figma, batch-skrypty), PPTX jako źródło prawdy

**Agenci możliwi:**
- Agent-konwerter PPTX→Figma jako usługa dla każdego decku klienckiego
- Agent podpinający obrazy ze storage Figmy do właściwych slotów po renderze

**Automatyzacje zrobione:**
- Automatyczna rekonstrukcja 21 slajdów z XML PPTX do edytowalnych frame'ów Figmy (2 pełne przebiegi: v1 i redesign v2)

**Automatyzacje możliwe:**
- Uogólnienie pipeline'u w reusable narzędzie/SOP (dziś skrypty żyją w scratchpadzie sesji)
- Automatyczne wykrywanie i dogrywanie brakujących fontów zamiast ręcznej mapy zamienników

**Reusable assets:**
- Pipeline PPTX→JSON→use_figma (parser + renderer batch)
- Mapa zamienników fontów dla środowiska Figma
- System wizualny decku (paleta, Anton/Space Mono/Archivo)
- 31 grafik w lemf-assety/ (Piotrkowska, EC1, sygnety, plakaty, tła mono) jako bank assetów wydarzenia

**Unique elements (czego standardowa agencja nie robi):**
- Programowa rekonstrukcja decku 1:1 z XML zamiast ręcznego przerysowywania — standardowa agencja wkleja PNG albo przerysowuje slajdy dniami
- Dwa pełne przebiegi (v1 wierny + v2 redesign) z tego samego pipeline'u

**Lessons learned:**
- Georgia/Arial niedostępne w środowisku Figma — zamienniki trzeba mapować w rendererze albo dograć fonty
- Równoległa ręczna edycja pliku podczas renderu batchy psuje wynik (zdjęcia zostały niepodpięte)
- Skrypty w scratchpadzie sesji giną — pipeline trzeba utrwalić poza sesją

**Missed opportunities:**
- Zdjęcia wgrane do storage Figmy, ale niepodpięte do slajdów
- Pipeline nie spakowany w trwałe, reużywalne narzędzie mimo dwóch udanych przebiegów

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/lemf-deck-figma.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/lemf-assety

</details>

---

### Profichem24 — rolka produktowa IG 15 s (Rigips Airless)

**Klient:** profichem24.pl (sklep budowlany); produkt: Rigips Airless PROF i UNIQ; materiał docelowo także dla dystrybutora Rigips  
**Status:** Wersja robocza dostarczona 31.07.2026 (finalny miks + wersja bez lektora + ścieżka lektora w profichem24-rigips/); znany błąd wordmarków do naprawy w postprodukcji; napisy i plansza końcowa do zrobienia.

**Cel biznesowy:** Pierwsza testowa rolka produktowa — walidacja usługi wideo AI dla e-commerce budowlanego (potencjalny powtarzalny format).

**Problem:** Sklep potrzebuje wideo produktowego bez sesji zdjęciowej i planu filmowego — jedyne wejście to zdjęcia produktów (og:image) ze sklepu.

**Proces:** Zaakceptowany scenariusz → import zdjęć produktów z og:image → board 4-slotowy 16:9 → obowiązkowy de-slop → klip 15 s 9:16 1080p (4 hard cuts: natrysk, wiadra przy agregacie, wąż ssący, paca) → lektor ElevenLabs skrócony do timeboxa → miks.

**Workflow:** Higgsfield MCP, workflow ugc-product-flow: media_import_url → gpt_image_2 (board 2k) → seedream_v5_pro (de-slop) → seedance_2_0 (klip, 135 kredytów/szt.) → text2speech_v2 elevenlabs głos Harrison → montaż finalny.

**Architektura:** W pełni generatywny pipeline w Higgsfield MCP; typografia (napisy, plansza końcowa) świadomie wyniesiona do postprodukcji poza modele.

**Narzędzia:** Higgsfield MCP (gpt_image_2, seedream_v5_pro, seedance_2_0), ElevenLabs via text2speech_v2 (głos Harrison), og:image sklepu jako źródło produktów

**Agenci możliwi:**
- Agent seryjnej produkcji rolek dla kolejnych produktów sklepu z tego samego workflow
- Agent QA klatek (wykrywanie zdeformowanych wordmarków/geometrii przed dostawą)

**Automatyzacje zrobione:**
- Cała generacja obraz→wideo→lektor w jednym workflow ugc-product-flow przez MCP

**Automatyzacje możliwe:**
- Szablonizacja formatu 15 s jako powtarzalnego produktu (scenariusz + ujęcia + lektor per produkt)
- Półautomatyczna postprodukcja napisów i planszy końcowej

**Reusable assets:**
- Workflow ugc-product-flow jako SOP rolek produktowych
- Wybrany głos lektorski Harrison (ID zapisane)
- Skatalogowana wiedza o limitach modeli (wordmarki, typografia, fonetyka)

**Unique elements (czego standardowa agencja nie robi):**
- Rolka produktowa w całości z AI, z realnych og:image sklepu — bez sesji, planu i stocków
- Obowiązkowy krok de-slop w pipeline (świadoma walka z estetyką AI)
- Lektor skrócony z ~40 słów (19,1 s) do 14,4 s z zachowaniem komunikatu klienta

**Lessons learned:**
- Seedance nie utrzymuje dwóch różnych wordmarków w jednym kadrze (kopiuje nazwę między produktami) — takie ujęcia budować w postprodukcji z realnych zdjęć
- Tekst lektora musi zaczynać się polskim słowem, inaczej ElevenLabs przełącza się na angielską fonetykę
- Typografii nigdy nie promptować — napisy i plansze zawsze wypalane w postprodukcji
- Zerwany konektor Higgsfield wymaga odłączenia/podłączenia i NOWEJ sesji

**Missed opportunities:**
- Ujęcie z dwoma wiadrami wciąż z błędnymi etykietami — warunek konieczny dla dystrybutora Rigips niedomknięty
- Napisy i plansza końcowa nie powstały
- Format nie spisany jeszcze jako oferta/cennik powtarzalnego produktu wideo

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/profichem24-rolka-rigips.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/profichem24-rigips

</details>

---

### Lumo — brand kawiarni + wizytówka opinii Google

**Klient:** Lumo (niewielki niezależny lokal: kawa + jedzenie + koktajle 'tance')  
**Status:** Wizytówka 90×50 mm przeprojektowana po feedbacku (2 dwustronne karty PL/EN w Figmie); do dokończenia: realny link do opinii Google (prawdziwy QR) i logo SVG od Reszka.

**Cel biznesowy:** Materiały brandowe dla lokalu — wizytówka-podziękowanie zachęcająca gości do zostawienia opinii w Google.

**Problem:** Pierwsza wersja karty oceniona jako 'ultra tanio' (płaskie tło, wycentrowany layout); dodatkowo logo nie da się wyciągnąć z brand boardu przez API (exportAsync zwraca błąd).

**Proces:** Ekstrakcja brandu z tablicy Figma (paleta, fonty, logo) → pierwsza wersja karty → twardy feedback → redesign 'jak najlepsi': awers-hero z gradientem mesh + rewers-cisza na ciepłym papierze.

**Workflow:** Praca w Figmie przez API/use_figma: programowe budowanie kart (mesh gradient z 5 rozmytych plam radialnych, corner ticks, gwiazdki createStar, deterministyczny wzór modułów QR bez Math.random).

**Architektura:** Brand board (file cT8VW3OE3zxvBERLIWZJzO) jako źródło tożsamości + osobny plik wizytówki (RsWI1Lgnndsm2KhegZ9gWw) z siatką 2×2 kart PL/EN.

**Narzędzia:** Figma MCP/API, Substytuty fontów: Hanken Grotesk (za TT Commons) i Space Mono (za .SF NS Mono)

**Agenci możliwi:**
- Agent generujący warianty wizytówki (inne języki/lokale) z tego samego przepisu programowego

**Automatyzacje zrobione:**
- Programowe generowanie kompletnych kart w Figmie, łącznie z deterministycznym pseudo-QR i gradientem mesh

**Automatyzacje możliwe:**
- Generator realnego QR po otrzymaniu linku do wizytówki Google
- Szablonizacja 'karty opinii' jako powtarzalnego mikro-produktu dla lokali gastronomicznych

**Reusable assets:**
- Destylat brandu Lumo (hexy palety, mapy substytutów fontów, zasada mono tylko dla EN)
- Przepis na kartę premium: jeden mocny element brandowy + grid redakcyjny + QR-chip z głębią + corner ticks
- Wzór deterministycznego pseudo-QR ((i*j+i*5+j*3)%4)

**Unique elements (czego standardowa agencja nie robi):**
- Wizytówka zbudowana w całości programowo przez API Figmy, nie ręcznie
- Skodyfikowana zasada anty-tanio: grid zamiast centrowania, kontrast skali typografii, rzemieślnicze detale

**Lessons learned:**
- exportAsync na wektorach tego pliku nie działa ('no visible layers') — logo trzeba pozyskać ręcznie od właściciela
- Space Mono nie ma polskich znaków — mono wyłącznie dla linii EN
- Płaski, wycentrowany szablon czyta się jako tani — nie wracać do tego wzorca

**Missed opportunities:**
- QR wciąż sztuczny — bez realnego linku karta nie jest produkcyjna
- Logo nie pozyskane od klienta
- Wzorzec karty nie sprzedany szerzej jako pakiet dla innych lokali

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/lumo-brand.md

</details>

---

### FitStyle — silnik LP przedsprzedażowych (Astro, tokens-first)

**Klient:** Sieć fitness FitStyle (fitstyle.com.pl, 6 klubów + 6 w pipeline)  
**Status:** Prototyp LIVE (fitstyle-presale.vercel.app/przedsprzedaz/rybnik); po rundach mobile/CRO/copy z 06.08; otwarte: faza B okien sprzedaży (tiery founding + countdown), backend leadów GetResponse, LP klubów, repo wciąż poza gitem.

**Cel biznesowy:** Powtarzalny silnik landing page'y przedsprzedażowych dla sieci na GymManagerze — produkt do replikacji przy każdym nowym klubie, nie jednorazowa strona.

**Problem:** Sieć otwiera kolejne kluby i potrzebuje szybkich, spójnych LP przedsprzedaży; twarde ograniczenie: GymManager nie ma API (tylko link/redirect do checkoutu).

**Proces:** Proces wg frameworku r352 (F1–F5): ekstrakcja brandu ze strony klienta → tokens.json → scaffold Astro → benchmark globalny (3 agenty webowe) → architektura informacji → silnik LP → prototyp Rybnik → rundy mobilna, CRO i copy.

**Workflow:** system/tokens.json → npm run tokens generuje CSS (auto przed dev/build); nowe miasto = nowy JSON w src/data/locations; deploy: vercel deploy --prod --scope reszkovys-projects + obowiązkowy alias set.

**Architektura:** Astro 5, tokens-first (tokens.json jako jedyne źródło designu wg BRAND-HUB-SPEC), location-as-data z polską fleksją (cityGen/cityLoc), szablon przedsprzedaz/[slug].astro, wspólna warstwa formularzy wyslij.ts (ENDPOINT, honeypot, blokada podwójnej wysyłki), węzeł zakupu /kup → {tenant}.gymmanager.io/public/buy-pass, pamięć klubu w sessionStorage.

**Narzędzia:** Astro 5, Vercel CLI, GymManager (checkout przez redirect), npm run tokens (generator CSS z tokenów)

**Agenci użyci:**
- 3 agenty webowe do benchmarku globalnego (docs/04-benchmark-global.md + aneksy research)

**Agenci możliwi:**
- Agent onboardingu nowego klubu: dane miasta → JSON lokalizacji → build → deploy
- Agent audytu CRO po każdej rundzie zmian

**Automatyzacje zrobione:**
- Automatyczna generacja CSS z tokens.json przed każdym dev/build
- Silnik generuje LP per miasto z pliku JSON (prototyp Rybnik działa e2e)
- Sterowanie usługami punktowymi z jednego pola (gdzie.kluby → pigułki, sekcje, listy naraz)
- Pamięć wyboru klubu (sessionStorage) spinająca cennik i grafik

**Automatyzacje możliwe:**
- Backend leadów (GetResponse) — wpięcie to jedna linia dzięki warstwie wyslij.ts
- GTM przez support GymManagera (mail wciąż do wysłania)
- Automatyczne generowanie LP dla 6 klubów z pipeline'u

**Reusable assets:**
- Silnik LP przedsprzedażowych jako produkt dla każdej sieci na GymManagerze
- Wzorzec tokens-first + location-as-data z fleksją
- docs/01-05 + benchmark globalny + IA jako baza wiedzy
- Warstwa formularzy wyslij.ts (honeypot, tryb prototypu)
- Zmierzona doktryna koloru (terakota = akcja, kontrasty 3,46:1/5,44:1)

**Unique elements (czego standardowa agencja nie robi):**
- Location-as-data z polami fleksji polskiej (cityGen/cityLoc) — poprawne 'w Rybniku' generowane, nie klejone
- Doktryna koloru oparta na zmierzonym kontraście, nie na guście
- Sygnet marki działający przez rzadkość (3 miejsca, złoty podział w hero)
- Projekt jawnie prowadzony frameworkiem F1–F5 jako mini-case samego frameworku

**Lessons learned:**
- Blok przywracania stanu musi stać na końcu skryptu (TDZ na const niżej, try/catch połykał błąd)
- <picture> ma display:contents — pozycjonowanie wymaga jawnego display:block
- Jedna nazwa oferty wszędzie ('Darmowa wizyta', 84× w buildzie) zamiast wariantów
- Checkout GymManagera wymaga pełnej ścieżki /public/buy-pass — samo tenant-URL to strona resellera

**Missed opportunities:**
- Repo niezainicjowane w git i wciąż w katalogu rozliczeń — ryzyko utraty i bałaganu
- Formularze bez backendu (leady prototypowe nigdzie nie trafiają)
- Mail do supportu GymManagera o GTM niewysłany — analityka stoi

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/fitstyle-platform.md

</details>

---

### wegobold.com — marka produktowa (repositioning + restyle)

**Klient:** Własny (wegobold = siostrzana marka produktowa r352 dla MŚP)  
**Status:** Repositioning i restyle 'benchmark' zrobione (index produktu ~6850/10000 vs r352 ~8030); PROD wegobold.com wciąż przekierowuje do r352 do czasu vercel deploy --prod; najsłabsze: social proof, SEO (SPA bez SSR).

**Cel biznesowy:** Druga brama modelu hub-and-spoke: wegobold = produkty i wdrożenia dla MŚP (projekty od ~30k), r352 = proces i retainery korpo (od ~20k); spoki (inleadia, hanoi) dowożą leady z atrybucją per źródło.

**Problem:** Dwie marki o celowo podobnych usługach trzeba rozdzielić po grupie docelowej i problemie (JTBD), nie po liście usług — tak, by właściwy kupujący sam się selekcjonował.

**Proces:** Iteracyjne doprecyzowanie pozycjonowania (3 osie: output vs proces, model komercyjny, wegobold jako ramię wdrożeniowe r352) → purge copy cross-page przez workflow wieloagentowy → restyle (ciemna zieleń + mięta + lilak) → strony /work (11 kart) i /industries (4 wertykale z realnymi klientami) → scoring benchmarkowy.

**Workflow:** Vite dev przez Bash run_in_background (procesy z & giną po zwrocie); deploy Vercel: preview z katalogu, prod = świadome vercel deploy --prod (odłożone).

**Architektura:** Vite 6 + React 18 + Tailwind v4, router wouter, animacje motion, i18n PL/EN w src/app/lib/i18n.tsx, tokeny w theme.css; origin = eksport z Figma Make; brief taguje source: wegobold_brief pod atrybucję.

**Narzędzia:** Vite 6 + React 18 + Tailwind v4, Vercel, Figma Make (origin), motion (framer)

**Agenci użyci:**
- Workflow wieloagentowy do wyczyszczenia copy z framingu strategy/consulting na wszystkich stronach

**Agenci możliwi:**
- Agent atrybucji leadów per spoke (inleadia vs wegobold vs r352)
- Agent pilnujący spójności językowej marki (lowercase, value language) przy każdej edycji

**Automatyzacje zrobione:**
- Wieloagentowy purge copy cross-page
- Klienci na stronie Industries ciągnięci żywo z case'ów po industryKey (bez duplikacji danych)

**Automatyzacje możliwe:**
- SSR/blog pod SEO (dziś SPA bez treści indeksowalnej)
- Automatyczny scoring benchmarkowy po każdej większej zmianie
- Pipeline realnych testimoniali zamiast nierenderowanych placeholderów

**Reusable assets:**
- Udokumentowany model hub-and-spoke (hub = wykonanie+proces, spoki = marki-agenci od popytu)
- Reguła różnicowania marek po JTBD zamiast po usługach
- Język wartości decydenta (3 warstwy: value lead → outcome → deliverables)
- Metodyka scoringu produktu względem benchmarku (10000 pkt)

**Unique elements (czego standardowa agencja nie robi):**
- Celowe pokrywanie się usług dwóch marek jako lejek operacyjny (jedna pula kompetencji, dwie bramy), nie ryzyko do 'rozparcelowania'
- Wertykale z realnymi klientami z case'ów zamiast generycznych ikon (lucide odrzucone jako zbyt generyczne)
- Świadoma architektura 3 warstw: lead-gen (inleadia) → wykonanie (wegobold) → proces (r352)

**Lessons learned:**
- Różnicować marki po grupie docelowej i problemie, nigdy po liście usług
- Wąskim gardłem modelu przestaje być delivery (AI-leveraged), a staje się dopływ zadań — priorytet to spoki i atrybucja
- Serwery dev przez Bash muszą iść run_in_background, inaczej giną
- Backendowych pozostałości inleadia (source tag, pliki wideo) nie ruszać — ryzykowne

**Missed opportunities:**
- Produkcja niewypuszczona — wegobold.com nadal przekierowuje do r352
- Fałszywe testimoniale w kodzie (nierenderowane) zamiast zebranych prawdziwych
- Brak SSR/bloga = brak kanału SEO
- Długi preloader ciągnie w dół perf

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/wegobold-site.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/wegobold-lowercase.md
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/wegobold-value-language.md

</details>

---

### bees-knees.pl — serwis + CMS + panel leadów (klient produkcyjny)

**Klient:** Bee's Knees (polski producent metalowych pinów/breloków/packagingu; klienci: Adidas, Coca-Cola, Red Bull, Reebok, CD Projekt Red)  
**Status:** LIVE na www.bees-knees.pl; CMS działa e2e od 14.07, panel zgłoszeń i eventy konwersji od 19.07, brief 18 punktów Patryka wdrożony; wersje strukturalne (dropdown, podstrony /oferta/*) czekają w sandboxie na akceptację; EN wyłączone.

**Cel biznesowy:** Utrzymanie i rozwój serwisu produkcyjnego klienta: samodzielna edycja treści przez CMS, mierzalne konwersje leadów i wdrażanie briefu klienta bez przestojów produkcji.

**Problem:** Klient zgłaszał 'brak konwersji' (realnie: formularz nie strzelał żadnym eventem) i chciał przeglądać leady jak WPForms Entries — na statycznym hostingu bez bazy danych.

**Proces:** Naprawa krytycznego buga kurtyny → port CMS z DailyFruits (dowiedziona przenośność) → panel leadów na osobnej gałęzi git → eventy konwersji GA4/Meta → wdrożenie wytycznych SEO agencji → brief 18 punktów → klasyfikacja wizualna 109 zdjęć przez 10 agentów → sandbox wersji roboczych dla zmian strukturalnych.

**Workflow:** Zapis w CMS = commit przez GitHub Contents API → auto-deploy z origin/main; zmiany strukturalne najpierw na kopie robocze (/index2, /realizacje2, noindex), produkcja po akceptacji klienta; deploy WYŁĄCZNIE przez git push (nie vercel --prod).

**Architektura:** Statyczne HTML + Vercel serverless api/: content.js (edycja tekstów/obrazów/menu po offsetach, historia/revert, galeria z add/replace/delete przez git blob API), quote.js (mail Resend + append leada do leads.json na niedeployowanej gałęzi 'data', bez PII w buildzie), auth.js (HMAC), leads.js (panel Zgłoszenia).

**Narzędzia:** Vercel (git-connected), GitHub Contents/blob API, Resend (maile formularza, replyTo), GTM + GA4 + Meta Pixel, własny CMS /admin (port z DailyFruits)

**Agenci użyci:**
- 10 agentów do wizualnej klasyfikacji 109 zdjęć galerii (pinsy/opakowania/breloki/patyna, z confidence i uzasadnieniem)

**Agenci możliwi:**
- Agent pilnujący ścieżki akceptacji sandbox→produkcja (promocja zmian po zgodzie klienta)
- Agent raportujący leady/konwersje klientowi cyklicznie

**Automatyzacje zrobione:**
- CMS: edycja → commit → auto-deploy bez udziału developera
- Zapis leadów do leads.json na gałęzi data bez redeployu i bez PII w publicznym buildzie
- Eventy konwersji generate_lead/Lead na sukces wysyłki
- Zarządzanie galerią (kategorie, dodawanie, podmiana, usuwanie) z panelu, z przegenerowaniem paska filtrów
- Liczniki filtrów realizacji liczone dynamicznie

**Automatyzacje możliwe:**
- Naprawa podwójnego kodowania encji nazwanych w decode() CMS
- Migracja nadawcy maili na domenę klienta (płatny Resend albo zwolnienie slotu proptren.com)
- git filter-repo na bloat 54/76 MB w historii

**Reusable assets:**
- CMS wielostronowy potwierdzony na 2 markach (DailyFruits → bees-knees) — gotowy produkt do portowania
- Wzorzec 'leady na niedeployowanej gałęzi git' zamiast bazy danych
- Wzorzec sandboxa wersji roboczych do akceptacji klienta
- Metoda klasyfikacji wizualnej galerii agentami (photo-mapping.json z confidence)

**Unique elements (czego standardowa agencja nie robi):**
- CMS edytujący strony po offsetach — bez tagowania szablonów i bez zmiany struktury plików klienta
- Panel leadów bez backendu bazodanowego (gałąź git jako storage, deploy wyłączony)
- Diagnoza 'braku konwersji' jako braku eventów, nie braku leadów — naprawa u źródła pomiaru
- Sandbox /index2 jako narzędzie procesowe: klient akceptuje na kopii, produkcja nietknięta

**Lessons learned:**
- Resend SDK v4 po cichu ignoruje nieznane klucze — zawsze camelCase (reply_to → replyTo)
- Eventy konwersji muszą zostać OZNACZONE jako konwersje w każdej platformie — samo strzelanie nie liczy
- Przy projekcie git-connected vercel --prod z lokalnego drzewa zostaje cofnięty przez następny auto-deploy
- Panel przeglądarki zamraża wszystkie tranzycje CSS w tle — QA z transition:none
- bfcache wymaga handlera pageshow — kurtyny/preloadery bez tego zostawiają pusty ekran

**Missed opportunities:**
- Wersja EN wyłączona (rynek eksportowy klienta z logotypami globalnymi!)
- Bug encji nazwanych w CMS nienaprawiony
- Darmowy plan Resend blokuje wysyłkę z domeny klienta
- Bloat w historii git nieusunięty

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/beesknees-site.md

</details>

---

### Twoje Menu — case study portfolio (plan + boardy UI)

**Klient:** Twoje Menu (catering dietetyczny, Łódź) — case do portfolio r352 (wg pamięci r352-case-studies: shadow case na r352.com/work)  
**Status:** Plan narracyjny kompletny (plan-case-study.md: 6 aktów, 28 sekcji, lista assetów i kolejność produkcji); boardy HTML z realnymi elementami UI gotowe (components/mockups/components-live + 75 plików w shots/); sceny Higgsfield i pełna publikacja przed nami.

**Cel biznesowy:** Flagowy case study klasy Instrument/Work & Co pokazujący rolę Product & Brand Design Partner end-to-end — narzędzie sprzedaży podobnych projektów (catering/food).

**Problem:** Case musi sprzedawać ambicję bez zmyślonych wyników: wszystko, czego nie wiemy, jawnie oznaczane jako Hipoteza — wiarygodność zamiast pustych KPI.

**Proces:** Najpierw teza i narracja (jedna teza na całość, trzy akty Zrozumieć→Zdecydować→Dowieźć), potem kolejność produkcji: teksty-kręgosłup (sekcje 03/08/09/11) → UI finalne mobile→desktop → plansze procesowe → sceny Higgsfield → skład i pass redakcyjny.

**Workflow:** plan-case-study.md jako scenariusz (każda sekcja ma treść + gotowy prompt sceny Higgsfield); boardy HTML 1440×1080 komponują realne shoty UI w plansze do zrzutów.

**Architektura:** Samowystarczalne boardy HTML/CSS (components-live.html i in.) pozycjonujące elementy z shots/ absolutnie na kanwie z etykietami — skład plansz kodem zamiast DTP; kierunek artystyczny zapisany globalnie (ciepłe studio, UI jak martwa natura kulinarna).

**Narzędzia:** HTML/CSS jako narzędzie składu plansz, Higgsfield (sceny 3D wg promptów z planu — do produkcji), Fonty Bricolage Grotesque / Instrument Sans / Caveat

**Agenci możliwi:**
- Agent produkcji scen Higgsfield sekcja po sekcji z gotowych promptów w planie
- Agent board→screenshot→sekcja składający case z plansz

**Automatyzacje zrobione:**
- Boardy HTML jako powtarzalny, kodowy sposób składania plansz case study (pozycje, cienie, etykiety w CSS zamiast ręcznego DTP)

**Automatyzacje możliwe:**
- Pipeline automatycznych zrzutów boardów do assetów case'u
- Szablonizacja struktury 28 sekcji jako generator planów case study dla kolejnych projektów

**Reusable assets:**
- Szablon narracji case study (6 aktów, zasady: jedna teza, rytm ciężka scena→oddech, dane tylko prawdziwe)
- Lista assetów produkcyjnych i rekomendowana kolejność produkcji
- Gotowe prompty scen Higgsfield per sekcja
- Boardy komponentowe z 75 realnymi shotami UI

**Unique elements (czego standardowa agencja nie robi):**
- Case pisany jak scenariusz filmowy — każda sekcja ma zaprojektowaną scenę (sygnaturowe ujęcie dolly 'journey po blacie')
- Kierunek 'produkt cyfrowy sfotografowany jak martwa natura kulinarna' zamiast standardowych mockupów
- Jawne oznaczanie hipotez jako świadomy budulec wiarygodności
- Sekcja 'What we said no to' — pokazywanie odrzuconych decyzji

**Lessons learned:**
- Zapisana reguła produkcji: najpierw teksty-kręgosłup (teza, insighty, decyzje), bez nich wizuale są dekoracją
- Nigdy dwie 'ciężkie' sekcje wizualne pod rząd — rytm plansz zaplanowany z góry

**Missed opportunities:**
- Case nie doprowadzony do publikacji (na /work wisi jako shadow case) — plan i boardy istnieją, scen Higgsfield brak
- Brak danych/badań od klienta — duża część case'u pozostanie hipotezami

<details><summary>Źródła</summary>

- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/twojemenu-case-study/plan-case-study.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/twojemenu-case-study
- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/MEMORY.md (wpis r352 case studies: shadow case Twoje Menu)

</details>

---

### Bartech — animacje (3 warianty 1080p)

**Klient:** Bartech (szerszy kontekst klienta nieznany — brak pliku pamięci i dokumentacji)  
**Status:** W folderze bartech-animacje/ leżą 3 gotowe animacje MP4 1080p z 20.07.2026 (street-graffiti, summer-green, summer-pink), każda z towarzyszącą klatką PNG; dalszy los (dostarczenie, akceptacja) nieznany.

**Cel biznesowy:** Nieznany wprost; z plików wynika produkcja animowanych kreacji wideo w 3 wariantach stylistycznych dla marki Bartech.

**Problem:** Nieznany — brak briefu i notatek w źródłach.

**Proces:** Szczegóły nieznane; układ plików (para statyczna klatka frame.png + animacja mp4 dla każdego wariantu) wskazuje na generację image-to-video z przygotowanych kadrów — niepotwierdzone dokumentacją.

**Workflow:** Nieznany.

**Architektura:** Brak — folder zawiera wyłącznie pliki wynikowe (3× mp4 + 3× png, ~120 MB), bez kodu, briefów i SOP.

**Narzędzia:** Nieznane (brak dokumentacji; prawdopodobny pipeline image-to-video — inferencja z par plików, niepotwierdzona)

**Agenci możliwi:**
- Jeśli format się przyjął: agent seryjnej produkcji wariantów sezonowych/kolorystycznych z jednej klatki bazowej (nazwy summer-green/summer-pink sugerują serię)

**Automatyzacje zrobione:**
- Nieznane

**Automatyzacje możliwe:**
- Szablonizacja wariantowania kolorystycznego jednej kreacji (wzorzec widoczny w plikach: ten sam motyw 'summer' w 2 kolorach)

**Reusable assets:**
- 3 finalne animacje + 3 klatki źródłowe w bartech-animacje/ (jedyne artefakty projektu)

**Unique elements (czego standardowa agencja nie robi):**
- Nieznane — brak materiału do oceny ponad pliki wynikowe

**Lessons learned:**
- Jedyny projekt z tej grupy bez pliku pamięci, briefu ani SOP — nie wiadomo jak powstał, czym był i czy się udał

**Missed opportunities:**
- Projekt łamie zasadę Every Project Compounds: nie zostawił żadnej wiedzy, promptów, workflow ani notatki — same pliki wynikowe
- Brak zapisanego pipeline'u uniemożliwia tanie powtórzenie formatu dla tego lub innego klienta

<details><summary>Źródła</summary>

- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/bartech-animacje

</details>

---

## Narzędzia poboczne i meta-wiedza

### Tracker sentymentu BTC/ETH

**Klient:** Wewnętrzny (Reszek / r352)  
**Status:** v1 działa lokalnie, wpięty do panelu FOTRA jako zakładka Krypto; v2 (Vercel + backend) świadomie odłożona

**Cel biznesowy:** Własne, darmowe narzędzie do monitorowania sentymentu i zainteresowania rynkiem BTC/ETH w jednym miejscu, wspierające prywatne decyzje bez płatnych subskrypcji.

**Problem:** Sygnały rynkowe (Fear & Greed, ceny, funding, long/short, trending) rozproszone po wielu serwisach — sprawdzanie ich ręcznie było powtarzalną, czasochłonną czynnością.

**Proces:** Jedna sesja 14.07.2026: dobór darmowych API bez klucza, budowa standalone HTML, realna weryfikacja każdego źródła w sandboxie (zgodnie z verify-first), potem osadzenie w FOTRA przez iframe z przeładowaniem przy wejściu na zakładkę.

**Workflow:** Otwarcie dashboardu → klient-side fetch 10 sygnałów → indeks złożony 0-100 (F&G 40% + momentum7d 30% + funding 15% + long/short 15%) → karta mechanicznego sygnału kontrariańskiego (100 - indeks) z listą powodów i disclaimerem → auto-odświeżanie co 60 s.

**Architektura:** Standalone sentiment-tracker/index.html (vanilla JS + SVG, ciemny motyw, PL, zero zależności); fetch do alternative.me, CoinGecko public i Binance Futures przez Promise.allSettled z fallbackiem per źródło (brak danych = "n/d", nigdy crash, status X/10 źródeł); duplikat pliku osadzony w FOTRA jako crypto-sentiment.html.

**Narzędzia:** vanilla JS + SVG (bez frameworków), alternative.me API (Fear & Greed), CoinGecko public API, Binance Futures API, python3 -m http.server (podgląd przez scratchpad)

**Agenci użyci:**
- Brak — całość zbudowana i zweryfikowana w jednej sesji Claude Code

**Agenci możliwi:**
- Cykliczny agent zapisujący odczyt indeksu do historii (localStorage/DB) i raportujący zmiany trendu
- Agent v2 na backendzie Vercel dokładający Google Trends / X / Reddit jako sygnały social interest

**Automatyzacje zrobione:**
- Auto-odświeżanie danych co 60 s + reload iframe przy każdym wejściu na zakładkę Krypto w FOTRA
- Indeks złożony liczony automatycznie z wagami przeważanymi wg realnie dostępnych sygnałów

**Automatyzacje możliwe:**
- Migracja na Vercel z backendem trzymającym klucz CoinGecko (obejście rate-limitów 429)
- Zapis historii indeksu w czasie — bez tego każdy odczyt przepada
- Automatyczna synchronizacja duplikatu w FOTRA (dziś ręczne cp przy każdej zmianie)
- Alerty progowe przy skrajnych odczytach indeksu

**Reusable assets:**
- Design system dashboardów krypto (ciemny motyw, vanilla JS + SVG) współdzielony z btc-cyclicality
- Wzorzec odporności Promise.allSettled: brak źródła = n/d, nigdy crash
- Regułowy klasyfikator stanu rynku z jawnym disclaimerem — rama do trzymania przy dalszych zmianach
- Wiedza o limitach darmowych API krypto (rate-limity, geo-blokady) zapisana w pamięci

**Unique elements (czego standardowa agencja nie robi):**
- Świadoma odmowa porady inwestycyjnej przerobiona na produkt: mechaniczny klasyfikator kontrariański z disclaimerem zamiast "kupuj/sprzedawaj"
- Zero zależności i zero kluczy API — narzędzie działa z pliku, bez kosztów utrzymania
- Jawne, policzalne wagi indeksu zamiast czarnej skrzynki

**Lessons learned:**
- Sandbox preview nie czyta ~/Desktop — serwować kopię ze scratchpada przez http.server
- CoinGecko rate-limituje współdzielone IP sandboxa (429), choć w przeglądarce usera działa — weryfikować środowisko docelowe, nie tylko własne
- Binance Futures ma geo-blokady w części regionów
- Duplikat pliku (źródło vs kopia w FOTRA) to dług: każda zmiana wymaga ręcznej synchronizacji obu

**Missed opportunities:**
- Historia indeksu nieodkładana od v1 — miesiąc danych bezpowrotnie stracony
- Brak automatyzacji synchronizacji dwóch kopii pliku
- Niewykorzystany jako publiczny mini-produkt / dowód kompetencji r352 w budowie narzędzi na żywych danych

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/btc-sentiment-tracker.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/sentiment-tracker/index.html (struktura folderu)

</details>

---

### Dashboard cykli halvingowych BTC

**Klient:** Wewnętrzny (Reszek / r352)  
**Status:** Gotowy standalone (08.07.2026), nie zmieniany od budowy; kohorty na sztywno, bez API on-chain

**Cel biznesowy:** Stały punkt odniesienia do pytań o cykl BTC (pozycja w cyklu, projekcja szczytu) oparty o dane historyczne, zamiast liczenia tego samego w kolejnych rozmowach.

**Problem:** Każde pytanie o cykle halvingowe wymagało ręcznej rekonstrukcji modelu (mnożniki, mediany dni, drawdowny); brak jednego miejsca z jawnymi założeniami.

**Proces:** Zbudowany w tej samej linii co sentiment-tracker (wspólny design system), z wpisanym modelem: mnożniki halving→szczyt ~96×/30×/8× (malejące ~3-4× co cykl), mediana 526 dni do szczytu, drawdown 75-85%, trzy warianty projekcji cyklu 4 z oceną realności.

**Workflow:** Otwarcie dashboardu → pobranie ceny live (z fallbackiem) → nakładka cykli w skali log znormalizowana do 100 w dniu halvingu → tabela cykli i pozycja w bieżącym cyklu (halving 2024-04-20) → projekcje szczytu wg mediany / min mnożnika / ekstrapolacji spadku mnożnika → kohorty portfeli wg salda.

**Architektura:** Standalone btc-cyclicality/index.html (42 KB, vanilla JS + SVG, ciemny motyw PL); ceny live + FALLBACK_PRICE; kohorty adresów (≥1/≥10/≥100/≥1000 BTC) wpisane na sztywno i jawnie oznaczone jako przybliżenia.

**Narzędzia:** vanilla JS + SVG, API cen (live z fallbackiem), wspólny design system z sentiment-tracker

**Agenci użyci:**
- Brak — zbudowany w sesji Claude Code

**Agenci możliwi:**
- Agent okresowo aktualizujący projekcje i alarmujący przy zbliżaniu się do medianowego okna szczytu (~526 dni po halvingu)

**Automatyzacje zrobione:**
- Pobieranie ceny live z automatycznym fallbackiem
- Automatyczne wyliczanie pozycji w bieżącym cyklu i projekcji z modelu

**Automatyzacje możliwe:**
- Podpięcie API on-chain dla realnych kohort zamiast wartości hardcoded
- Wpięcie do FOTRA obok sentiment-trackera (dziś wpięty jest tylko sentiment)
- Wspólny moduł danych cenowych dla obu dashboardów krypto

**Reusable assets:**
- Skodyfikowany model cykli (mnożniki, mediany, drawdowny) jako baza do rozmów decyzyjnych
- Wzorzec nakładki cykli log-normalizowanej do dnia zdarzenia — przenośny na inne analizy cykliczne
- Współdzielony design system dashboardów

**Unique elements (czego standardowa agencja nie robi):**
- Trzy warianty projekcji z jawną oceną realności (mediana ~$1,9M jako nierealny sufit, ekstrapolacja ~$130-200k jako najrealniejsza) zamiast jednej hype'owej liczby
- Uczciwe oznaczenie, które dane są live, a które wpisane na sztywno

**Lessons learned:**
- Reużycie design systemu z sentiment-trackera radykalnie skróciło budowę — potwierdzenie zasady Every Project Compounds w praktyce
- Dane hardcoded muszą być jawnie oznaczone, inaczej udają dane live i psują zaufanie do narzędzia

**Missed opportunities:**
- Kohorty statyczne — bez API on-chain sekcja starzeje się bezgłośnie
- Niewpięty do FOTRA mimo gotowego wzorca iframe z sentiment-trackera
- Dwa dashboardy krypto nie dzielą kodu (osobne pliki) mimo wspólnego design systemu

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/btc-cyclicality.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/btc-cyclicality/index.html (struktura folderu)

</details>

---

### FOTRA — osobisty panel operacyjny (CRM + przychody + mapa potencjału)

**Klient:** Wewnętrzny (osobisty dashboard Reszka; kandydat do produktyzacji)  
**Status:** Aktywnie rozwijany (ostatnie zmiany 08.2026); dane realne zasiane z inFakt (540 149 zł netto YTD, 58 FV); otwarte: potencjały kart, Gmail re-auth, brak FV Archicom od maja

**Cel biznesowy:** Jedno miejsce zarządzania przychodami, relacjami i priorytetami skalowania — wsparcie celu 1M PLN/rok przy malejącym operacyjnym udziale Przemka i widoczności ryzyka koncentracji (Benefit = 49% przychodu).

**Problem:** Dane o przychodach, relacjach i potencjale rozproszone między inFakt, Gmail i głową właściciela — brak twardego widoku, gdzie skalować, gdzie jest ryzyko i które relacje mają niewyceniony potencjał.

**Proces:** Iteracyjny rozwój modułowy w sesjach Claude Code: nowe zakładki przez wzorzec data-tab + switchMainTab, dane realne wchodzą jednorazowymi migracjami z flagami (v1-v6), twarde liczby importowane z inFakt przez MCP, korekty dyktowane przez Reszka; handoff dla kolejnych sesji w docs/INSTRUKCJA-CHAT-INFAKT.md.

**Workflow:** Kluczowa pętla decyzyjna: Reszek uzupełnia dane na Mapie potencjału → przycisk "Eksport do analizy AI" (plik .md do Downloads + schowek) → wrzucenie do czatu → analiza kierunków skalowania → decyzje wracają do CRM (dźwignia, rola, potencjał).

**Architektura:** Statyczny index3.html + modularne JS w js/core|features|modules (nawigacja, CRM, mapa potencjału, delegacja, revenue-intel itd.); dane w localStorage (klucz lgb_people_v3: minValue/maxValue/potential, 8-wymiarowy MACS, revenueList, billingEntities, relatedTo; klucz fotra_infakt_sync dla statusu synchronizacji); Chart.js na bubble chart mapy; tracker krypto przez iframe; bramka desktop-only.

**Narzędzia:** HTML + vanilla JS (modularny), Chart.js, localStorage jako baza danych, inFakt MCP (infakt_*), python3 -m http.server (podgląd)

**Agenci użyci:**
- inFakt MCP jako źródło twardych danych (58 FV, 540k netto YTD; odpowiedzi >200k znaków agregowane przez plik + python)
- Sesje Claude Code jako operator aktualizacji wg SOP INSTRUKCJA-CHAT-INFAKT.md

**Agenci możliwi:**
- Agent Gmail dopisujący "ostatni kontakt" do kart CRM (zaplanowany, czeka na re-auth; statyczny HTML sam nie połączy się z MCP)
- Cykliczny agent synchronizacji inFakt aktualizujący przychody i klucz fotra_infakt_sync
- Agent konsumujący eksport mapy potencjału i zwracający rekomendacje skalowania bez ręcznego wklejania

**Automatyzacje zrobione:**
- Eksport kontekstu do analizy AI jednym przyciskiem (md + schowek)
- Jednorazowe migracje danych z flagami localStorage (wzorzec fotra_people_*_20260710) — idempotentne seedy
- Auto-wnioski panelu "Kierunki rozwoju" (koncentracja Benefit 49%, huby geograficzne)
- Ranking priorytetów liczony z luki × skalowalności × jakości relacji
- Pasek statusu integracji inFakt czytający fotra_infakt_sync

**Automatyzacje możliwe:**
- Stała, harmonogramowa synchronizacja inFakt zamiast ręcznych seedów per sesja
- Backup/backend zamiast localStorage — dziś całe CRM żyje w jednej przeglądarce
- Automatyczna pętla Gmail→CRM dla świeżości relacji
- Domknięcie pętli: eksport mapy → analiza → automatyczny zapis rekomendacji do kart

**Reusable assets:**
- 8-wymiarowy model scoringu MACS osób/zaangażowań (rozszerzenie kanonicznego 4-wym.)
- Wzorzec migracji flagowanych dla danych w localStorage
- INSTRUKCJA-CHAT-INFAKT.md — SOP handoffu między sesjami AI (mapowanie podmiotów fakturowych→karty, procedura, zasady)
- Wzorzec bubble chart wartość × potencjał × MACS z kwadrantami Skaluj/Utrzymuj/Rozwijaj/Obserwuj
- Wzorzec "Eksport do analizy AI" — komponent do przenoszenia stanu aplikacji do sesji LLM
- FOTRA_PRODUCTIZATION.md — istniejący zalążek produktyzacji

**Unique elements (czego standardowa agencja nie robi):**
- CRM zbudowany pod własny model operacyjny (dźwignia, bottleneck, MACS, struktura relacji strumień→podmiot fakturowy→człowiek) zamiast generycznego CRM
- Świadoma pętla człowiek→eksport→AI→decyzja→CRM jako zaprojektowany workflow, nie przypadek
- Kategoria "Wyceń potencjał" — jawne oznaczanie danych niewycenionych zamiast zmyślania liczb
- Pisemny SOP dla innych sesji AI (handoff doc) — traktowanie agentów jak zespołu z onboardingiem

**Lessons learned:**
- localStorage jako baza = szybki start, ale wymusza dyscyplinę migracji flagowanych i grozi utratą danych
- Duże odpowiedzi MCP (>200k znaków) trzeba agregować przez plik + python, nie w kontekście
- Statyczny HTML nie połączy się z MCP — sesja AI musi być pośrednikiem, stąd SOP handoffu
- Nie zmyślać danych biznesowych: puste pola zostawiać do wyceny przez właściciela (Anna Kowalska = wykryty błąd zmyślonej karty)
- Dane twarde z inFakt korygują intuicję (Archicom niespodziewanie #2 z 76,3k)

**Missed opportunities:**
- Wszystkie karty mają potential=0 — mapa potencjału (główna wartość narzędzia) nie w pełni działa do czasu wyceny
- Brak automatycznej synchronizacji inFakt mimo działającego MCP
- Znane quirki (błąd null przy idea-card, białe tło przy scrollu) niesprzątnięte od miesięcy
- Produktyzacja FOTRA (istnieje FOTRA_PRODUCTIZATION.md) niedomknięta, mimo że panel jest żywym demo podejścia r352

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/fotra-panel-index3.md
- /Users/reszek/Desktop/Claude_zadania/FOTRA (struktura folderu i js/core|features|modules)

</details>

---

### Pakiet umów podwykonawczych (NDA + ramowa + o dzieło) jako kod

**Klient:** Wewnętrzny (Let's Go Bold Przemysław Reszka, NIP 7292646007; fundament modelu operacyjnego r352)  
**Status:** Komplet gotowy po przeglądzie prawnym 06.08.2026; do uzupełnienia tylko e-mail do doręczeń w dane.py; rekomendowany jednorazowy przegląd przez prawnika niewykonany

**Cel biznesowy:** Prawne domknięcie modelu "podwykonawcy = ręce": szczelny łańcuch praw autorskich od freelancera przez Let's Go Bold do klienta końcowego, z ochroną przed obchodzeniem i wyciekiem poufności.

**Problem:** Brak własnych wzorów umów przy rosnącej delegacji; realne ryzyka: nieważne przeniesienie praw (forma pisemna z art. 53 pr. aut.), odbiór PNG bez plików źródłowych, materiały AI bez ochrony prawnoautorskiej, druga firma o identycznej nazwie "Let's go bold" (Ł. Strzelczyk, Warszawa).

**Proces:** Reverse-engineering czterech umów otrzymanych od kontrahentów (NDA: OSOM Studio, East Events, Walk Creative; ramowa: Kubota S.A.) → własne wzory z poprawionymi wadami wzorców → przegląd prawny 06.08 z listą poprawek (forma pisemna, zamknięty katalog pól, wyłączenie art. 45, background IP) → wbudowanie z góry ustępstw negocjacyjnych.

**Workflow:** Stała współpraca: NDA (mailem, forma dokumentowa) → umowa ramowa (podpis odręczny/kwalifikowany — pod rygorem nieważności) → Zamówienia mailem wg Załącznika nr 1. Jednorazówka: sama umowa o dzieło ze skróconą poufnością. Zmiana parametrów: edycja dane.py → python3 build.py → 3 umowy w .docx i .md.

**Architektura:** Umowy jako kod: treść w nda.py / umowa_ramowa.py / umowa_dzielo.py, wszystkie zmienne w dane.py, wspólne pola eksploatacji w pola.py (żeby ramowa i o dzieło nie rozjechały się w czasie), render.py + build.py generują .docx i .md; README = pełna dokumentacja decyzji prawnych.

**Narzędzia:** Python (generator .docx/.md), wzorce umów kontrahentów jako materiał źródłowy

**Agenci użyci:**
- Sesje Claude Code do analizy wzorców, redakcji umów i przeglądu prawnego

**Agenci możliwi:**
- Agent generujący wypełnione Zamówienia (Załącznik nr 1) z danych projektu
- Agent pobierający dane rejestrowe podwykonawcy z CEIDG/wyszukiwarki NIP do dane.py

**Automatyzacje zrobione:**
- build.py — jedna komenda przebudowuje trzy umowy w dwóch formatach ze wspólnego źródła zmiennych
- pola.py jako single source of truth pól eksploatacji dla obu umów przenoszących prawa

**Automatyzacje możliwe:**
- Generator Zamówień per projekt/podwykonawca
- Rejestr podpisanych umów per podwykonawca (kto ma NDA, kto ramową, jaka forma podpisu)
- Automatyczne wersjonowanie przy zmianach parametrów w dane.py

**Reusable assets:**
- Cały pakiet = asset wielokrotnego użytku przy każdym nowym podwykonawcy
- Gotowy mail wysyłkowy z uprzedzeniem typowych pytań (AI, portfolio)
- README jako skodyfikowana wiedza prawna (formy podpisu, klauzula AI, background IP, wąski zakaz obchodzenia)
- Wzorzec "dokumenty jako kod z build pipeline" przenośny na inne dokumenty firmowe

**Unique elements (czego standardowa agencja nie robi):**
- Umowy trzymane jako kod z generatorem zamiast wersjonowanych docx-ów — zmiana parametru propaguje się do wszystkich dokumentów
- Klauzula ujawnienia użycia AI zamiast zakazu + zabezpieczenie, że warunki narzędzia nie blokują przeniesienia praw
- Materiały Źródłowe jako warunek odbioru (luka wykryta we wzorcu Kuboty)
- Celowo wąski zakaz obchodzenia — łatwiejszy do wyegzekwowania niż szeroki
- Ustępstwa wbudowane z góry (limit odpowiedzialności 200%, doprecyzowane indemnity), żeby skrócić negocjacje
- Rozdzielenie przeniesienia praw (pod warunkiem zapłaty) od licencji przejściowej — naprawa wady prawnej wzorca Kuboty

**Lessons learned:**
- Przeniesienie autorskich praw majątkowych wymaga formy pisemnej pod rygorem nieważności — mail i podpis zaufany nie wystarczą, kwalifikowany podpis tak (art. 78¹ § 2 k.c.); wcześniejsza wersja dopuszczała mail i unieważniała § 6
- Katalog pól eksploatacji musi być zamknięty — "w szczególności" daje złudzenie szerszego nabycia (art. 41 ust. 2)
- Zawsze podawać NIP i "wpisaną do CEIDG" w komparycji — istnieje druga firma o tej samej nazwie
- Adres CEIDG (Łódź), nie majorkański — od niego zależy sąd właściwy
- Materiał w całości wygenerowany przez AI może nie mieć ochrony prawnoautorskiej, więc nie da się go skutecznie przenieść
- Poufność 10 lat + bezterminowo dla tajemnicy przedsiębiorstwa zamiast "bezterminowo" (wypowiadalne z art. 365¹ k.c.)

**Missed opportunities:**
- Brak jednorazowego przeglądu przez prawnika (README sam to rekomenduje, zwłaszcza § 6 ramowej i § 8 NDA)
- E-mail do doręczeń wciąż niewypełniony — pakiet formalnie niekompletny
- Brak zaprojektowanego procesu podpisu kwalifikowanego po stronie podwykonawców (praktyczna bariera egzekwowania formy pisemnej)

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/umowy-podwykonawcy.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/umowy-podwykonawcy/README.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/umowy-podwykonawcy (struktura folderu)

</details>

---

### Harvester stocków — zdjęcia 33 polskich miast

**Klient:** Wewnętrzny (zaplecze produkcyjne; klient końcowy zadania nieznany ze źródeł)  
**Status:** Zakończony (05-06.08.2026): finalna-lista.html z 1-2 ujęciami per miasto; wiedza o źródłach utrwalona w pamięci

**Cel biznesowy:** Automatyczne znalezienie kandydatów zdjęć dla 33 polskich miast (w tym małych, słabo pokrytych) z jasnym statusem licencyjnym, zamiast wielogodzinnego ręcznego przeszukiwania stocków.

**Problem:** Małe polskie miasta (Ełk, Kętrzyn, Lidzbark Warmiński...) mają uboge pokrycie w stockach, wyszukiwarki podstawiają inne miasta zamiast pustki, a część serwisów blokuje ruch automatyczny — ręczna selekcja nie skaluje się.

**Proces:** Najpierw zmapowanie, które źródła w ogóle da się automatyzować (Adobe/Freepik przez MCP, Envato scrape, Openverse API; Unsplash/Pexels zablokowane) → harvest do dane.json → scoring i twarde reguły licencyjne → wybór finalny 1 ujęcia per miasto → jednostronicowy HTML do przeglądu.

**Workflow:** cities.py (miasto, slug, zapytanie ASCII, liczba ujęć, słowa-klucze walidacji) → harvest_free.py (Envato przez regex na server-rendered HTML + Openverse API, przez curl z UA i retry) + wyniki MCP Adobe/Freepik → dane.json (428 KB) → final_pick.py (rdzenie nazw łapiące odmianę, listy TRESC_DOBRA/TRESC_SLABA, reguły licencyjne) → final.json → build_final_html.py → finalna-lista.html.

**Architektura:** Pipeline Python w stocki-miasta/: osobne etapy harvest → scoring → wybór → render HTML, dane pośrednie w JSON; walidacja trafień słownikowa (tytuł + slug) jako korekta semantycznych wyszukiwarek; wynik jako statyczna strona z etykietami źródeł i licencji.

**Narzędzia:** Python + curl (scrape/API), Adobe Stock MCP (asset_search, entityScope StockAsset), Freepik/Magnific MCP (stock_search), Openverse API (Wikimedia Commons + Flickr, CC), Envato Elements (scrape server-rendered HTML)

**Agenci użyci:**
- Sesja Claude Code orkiestrująca MCP Adobe/Freepik i skrypty harvestera

**Agenci możliwi:**
- Agent "znajdź zdjęcia X" dla dowolnej listy tematów, reużywający pipeline i wiedzę o źródłach
- Agent domykający pętlę: wybór → licencjonowanie i pobranie przez asset_license_and_download_stock

**Automatyzacje zrobione:**
- Pełny harvest z 4 źródeł z retry i walidacją słownikową trafień
- Scoring treści odsiewający śmieci (mapy administracyjne, herby, dworce, skanseny, treści wrażliwe) i preferujący panoramy/rynki/zabytki
- Twarde reguły licencyjne w wyborze finalnym
- Automatyczna budowa przeglądowego HTML z etykietami źródeł

**Automatyzacje możliwe:**
- Uogólnienie na dowolny temat jako stałe narzędzie researchu stocków dla projektów klienckich
- Automatyczne pobieranie wybranych plików CC w docelowej rozdzielczości przez resizer Commons
- Cache wyników per zapytanie, żeby nie odpytywać źródeł ponownie

**Reusable assets:**
- Memory stock-photo-sources.md — mapa które stocki da się automatyzować i jak (najwyższej wartości wiedza operacyjna z tego zadania)
- Komplet skryptów pipeline (harvest/scoring/wybór/render) gotowy do adaptacji
- Wzorzec walidacji trafień: rdzenie nazw łapiące polską odmianę + listy dobrej/słabej treści
- Przepis na link do strony pozycji Freepik/Magnific składany z previewUrl + id

**Unique elements (czego standardowa agencja nie robi):**
- Obejście braku API Envato przez scrape server-rendered HTML z regexami na karty
- Wykrycie, że Adobe MCP jest wyszukiwarką semantyczną, która myli miasta — i naprawienie tego walidacją słownikową
- Twarde reguły licencyjne wbudowane w selekcję zamiast ręcznego sprawdzania po fakcie
- Systematyczne przetestowanie 6 źródeł i udokumentowanie także negatywnych wyników (co NIE działa)

**Lessons learned:**
- Unsplash i Pexels blokują ruch z tego środowiska (307/401) — nieautomatyzowalne
- Podglądów Envato nie da się hotlinkować ani pobrać (CDN 403 niezależnie od nagłówków)
- Openverse: page_size >12 timeoutuje; endpoint /thumb/ niestabilny (424) — dla Commons używać oficjalnego resizera Special:FilePath?width=500
- Wyszukiwarki semantyczne przy braku trafień podstawiają podobne miasta zamiast pustki — zawsze filtrować po nazwie w tytule
- Openverse ma najlepsze pokrycie małych polskich miast ze wszystkich źródeł, ale wyniki wymagają scoringu

**Missed opportunities:**
- Pipeline nie spakowany jako reużywalny skill/tool — przy następnym zadaniu stockowym trzeba będzie go adaptować ręcznie
- Niewykorzystane licencjonowanie i pobieranie przez istniejące MCP (asset_license_and_download_stock)
- Brak automatycznego pobrania finalnych plików CC — wynik to linki, nie gotowe assety

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/stock-photo-sources.md
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/stocki-miasta/cities.py
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/stocki-miasta/harvest_free.py
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/stocki-miasta/final_pick.py
- /Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/stocki-miasta/build_final_html.py

</details>

---

### META: Styl pracy "verify-first" (zasada operacyjna systemu)

**Klient:** Wewnętrzny (system operacyjny r352 — warstwa governance pracy AI)  
**Status:** Aktywna, utrwalona zasada; ładuje się do każdej sesji przez auto-memory

**Cel biznesowy:** Podnieść wiarygodność pracy AI tak, by QA Przemka (jego najdroższy, niedelegowalny zasób) kosztowało mniej — twierdzenie poparte dowodem nie wymaga ponownego sprawdzania.

**Problem:** Audyty i zapewnienia AI bez realnej weryfikacji przeszacowywały lub myliły fakty (wadliwy algorytm konsolidacji CSS, przeoczony split hostingu .pl vs vercel.app) — każde takie potknięcie wracało jako koszt czasu właściciela.

**Proces:** Feedback z wielu sesji ("jesteś pewien?") skodyfikowany w jedną regułę: sprawdź realnie (curl/render/test/status HTTP) zanim stwierdzisz; dowoź dowód (liczby, screenshot); jawnie oznaczaj, czego NIE sprawdziłeś; przy masowych zmianach pilotaż-przed-rolloutem; nie powtarzaj weryfikacji po "stop".

**Workflow:** Każda sesja: twierdzenie → dowód → oznaczenie luk weryfikacji; zmiany masowe → wariant bezpieczny, najpierw 1 element pilotażowo → rollout po potwierdzeniu; oceny na skalach (1-10000) z największymi skokami w najsłabszych obszarach.

**Architektura:** Memory typu feedback (working-style-verify-first.md) w auto-memory projektu — wchodzi do kontekstu każdej sesji automatycznie i jest linkowana z innych notatek jako zasada nadrzędna.

**Narzędzia:** System auto-memory Claude Code, curl / render / testy / statusy HTTP jako narzędzia dowodowe

**Agenci użyci:**
- Wszystkie sesje AI w projektach Reszka — zasada jest warstwą poziomą, nie pojedynczym agentem

**Agenci możliwi:**
- Agent-weryfikator jako osobny krok workflow: po każdym "gotowe" innego agenta sprawdza dowody przed raportem do właściciela

**Automatyzacje zrobione:**
- Utrwalenie w auto-memory — zasada egzekwuje się bez przypominania w każdej nowej sesji

**Automatyzacje możliwe:**
- Hooki w harness wymuszające dowód przed komunikatem o ukończeniu (np. status HTTP po deployu)
- Szablon raportu "co sprawdziłem / czego nie sprawdziłem" jako standardowy format zakończenia zadań

**Reusable assets:**
- Sama reguła jako element SOP przenośny na podwykonawców i przyszłych agentów
- Format ocen skalowych z największymi skokami w najsłabszych obszarach
- Wzorzec pilotaż-przed-rolloutem dla zmian masowych

**Unique elements (czego standardowa agencja nie robi):**
- Feedback dla AI skodyfikowany jako trwały artefakt zamiast powtarzania uwag w każdej sesji — governance pracy AI potraktowane jak proces, nie rozmowa
- Zasada ma zapisane "why" (konkretne wpadki), więc nie eroduje jako pusty rytuał

**Lessons learned:**
- Realna weryfikacja wielokrotnie wyłapała błędy, których audyt "na oko" nie widział
- Równie ważna jest granica: nie powtarzać tej samej weryfikacji w kółko, gdy właściciel prosi stop

**Missed opportunities:**
- Zasada żyje tylko w pamięci AI — nie jest częścią formalnego playbooka r352 ani onboardingu podwykonawców, choć dotyczy każdego wykonawcy, nie tylko agentów
- Brak technicznego wymuszenia (hook) — zgodność zależy od dyscypliny modelu w sesji

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/working-style-verify-first.md

</details>

---

### META: Context vault w Obsidianie (pakiet kontekstu dla AI)

**Klient:** Wewnętrzny (system operacyjny r352 — warstwa wiedzy; żywy dowód tezy "HubForBrands")  
**Status:** Działający, utrzymywany (integracja i deduplikacja 06.2026: 0 złamanych linków, 0 pustych plików); LinkedIn About/Experience niezassane w pełni

**Cel biznesowy:** Jedno źródło prawdy o firmie, klientach, zasadach i sposobie pracy, żeby każda sesja AI startowała z pełnym kontekstem i oddawała rekomendacje zgodne z modelem operacyjnym — zamiast generycznych odpowiedzi wymagających korekt.

**Problem:** Kontekst rozproszony po sesjach i głowie właściciela: AI bez niego proponowało rzeczy sprzeczne ze strategią (np. pozycjonowanie freelancerskie, "więcej leadów" bez pytania o przepustowość), a duplikaty źródeł (Master Context vs pakiet) groziły dryfem prawdy.

**Proces:** Budowa 16 powiązanych notatek z hubem user.md → integracja 06.2026 (Master Context scalony i usunięty, MACS rozstrzygnięty: kanoniczny 4-wym. + rozszerzony 8-wym. FOTRA, Clients/ uzupełnione o 5 notatek) → dołożenie web-presence z renderu Chrome i LinkedIn → twarda zasada: nie zmyślać budżetów/decision-makerów/liczb, puste pola = "—".

**Workflow:** Sesja AI zaczyna od user.md (source of truth), dalej po linkach [[...]]; do-not-do jest obowiązkowe; rekomendacje w formacie: 1) rekomendacja jednym zdaniem z oceną 1-100, 2) dlaczego (wpływ na metrykę), 3) pierwsze 3 kroki; każda decyzja przez filtr: przychód / czas / jakość / chaos / delegowalność / bottleneck / rodzina.

**Architektura:** Vault Obsidian: Desktop/Claude_zadania/Obsydian/reszek/AI Context/ — hub user.md + notatki identity, soul, do-not-do, decision-framework, macs-scoring, services-positioning, clients-projects, partners, products, bottleneck-delegation, fotra-system, current-decisions, writing-style, web-presence i inne, spięte linkami wiki; obok Systems/ (kanoniczny MACS) i Clients/.

**Narzędzia:** Obsidian (markdown + linki wiki), render Chrome / browser MCP do zasysania web-presence (WebFetch na LinkedIn zwraca 999)

**Agenci użyci:**
- Każda sesja AI pracująca dla Reszka konsumuje pakiet jako warstwę startową
- Sesje utrzymaniowe: integracja, deduplikacja, uzupełnianie Clients/

**Agenci możliwi:**
- Agent okresowo odświeżający web-presence.md (strona, LinkedIn) i zgłaszający zmiany
- Agent synchronizujący Clients/ i przychody z FOTRA/inFakt, żeby vault nie dryfował od twardych danych
- Walidator vaulta (złamane linki, puste pola, duplikaty) jako zadanie cykliczne

**Automatyzacje zrobione:**
- Brak stałej automatyzacji — aktualizacje robione sesyjnie, z weryfikacją spójności (0 złamanych linków po integracji)

**Automatyzacje możliwe:**
- Cykliczne odświeżanie web-presence i wykrywanie dryfu vault↔rzeczywistość
- Dwukierunkowy most vault↔FOTRA (klienci, przychody, MACS)
- Automatyczny lint vaulta po każdej edycji

**Reusable assets:**
- Format pakietu kontekstu (user/identity/soul/do-not-do/decision-framework/writing-style) jako produkt wdrażalny u klientów — dokładnie teza posta "HubForBrands 2026": system jako jedno źródło prawdy dla ludzi i agentów AI
- Format rekomendacji z ocenami skalowymi i "wybrałbym X, bo..."
- Filtr decyzyjny 7 pytań jako szablon governance

**Unique elements (czego standardowa agencja nie robi):**
- Plik do-not-do jako obowiązkowe anty-instrukcje dla AI (czego nie proponować) — rzadkość nawet w zaawansowanych setupach
- Twarda zasada "nie zmyślać liczb — zostawiać —" wpisana w strukturę wiedzy
- Rozstrzyganie kanonu przy duplikatach (Master Context scalony i usunięty, dwa MACS-y jawnie rozdzielone) zamiast tolerowania dwóch wersji prawdy
- Właściciel stosuje na sobie to, co sprzedaje klientom jako tezę (system jako źródło prawdy)

**Lessons learned:**
- Bez scalania duplikatów i rozstrzygania kanonu kontekst dryfuje i AI dostaje sprzeczne prawdy
- WebFetch na LinkedIn zwraca 999 — działa tylko zalogowany browser MCP
- Pakiet kontekstu + do-not-do realnie zmienia jakość rekomendacji (eliminuje klasy błędów pozycjonowania)

**Missed opportunities:**
- Format vaulta nie zproduktyzowany jako oferta, choć jest gotowym, przetestowanym na sobie wzorcem "Brand Hub OS"
- Brak automatycznej synchronizacji z FOTRA/inFakt — dwa systemy wiedzy (vault i panel) utrzymywane osobno, ręcznie
- LinkedIn About/Experience wciąż niezassane w pełni do web-presence

<details><summary>Źródła</summary>

- /Users/reszek/.claude/projects/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/memory/reszek-context-vault.md

</details>

---
