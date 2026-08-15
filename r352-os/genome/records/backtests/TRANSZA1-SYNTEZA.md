---
id: "rec:backtests/TRANSZA1-SYNTEZA"
type: "record"
title: "Program walidacji — synteza transzy 1 (11 backtestów)"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Synteza transzy 1 (pilot briefsync + 10 workflow)

## Fit selekcji mechanizmów per projekt

- **dailyfruits-relaunch**: 3 pełne / 3 częściowe / 1 błędne / przeoczone-a-użyte: 0 (—)
- **dailyfruits-cms-v6**: 2 pełne / 1 częściowe / 2 błędne / przeoczone-a-użyte: 1 (mech:deterministic-spine)
- **dailyfruits-seo-oferta**: 3 pełne / 3 częściowe / 0 błędne / przeoczone-a-użyte: 3 (content-resurrection z Wayback Machine (147 stron 1:1, commit 097d464) — brak mechanizmu w Genome, lab-vs-field jako problem walidacji miary (baner zgody = LCP w lab, realni userzy go nie widzą) — ryzyko #5 Routera źle sformułowane jako lag GSC, bramka własności nasze-vs-klient (GA4/GTM Łukasza, consent-gating BW, formularz Huberta) — wszystkie otwarte punkty klasy 'ludzie klienta')
- **zdrofit-hourly-pipeline**: 1 pełne / 2 częściowe / 3 błędne / przeoczone-a-użyte: 0 (—)
- **narzedzie-do-briefowania**: 2 pełne / 3 częściowe / 1 błędne / przeoczone-a-użyte: 1 (mech:dated-commitment-gates)
- **r3loop-app**: 3 pełne / 3 częściowe / 0 błędne / przeoczone-a-użyte: 2 (mech:session-to-sop, mech:single-source-compiler)
- **beesknees-site**: 2 pełne / 3 częściowe / 1 błędne / przeoczone-a-użyte: 1 (mech:machine-narrows-human-picks)
- **r352-website**: 3 pełne / 2 częściowe / 1 błędne / przeoczone-a-użyte: 2 (mech:incident-to-guard, mech:agent-facing-distribution)
- **r352-case-studies-work**: 2 pełne / 2 częściowe / 2 błędne / przeoczone-a-użyte: 0 (—)
- **fitstyle-platform**: 3 pełne / 1 częściowe / 2 błędne / przeoczone-a-użyte: 1 (mech:prototype-mode-guard (hipoteza — klasa guardów 'jawny tryb niekompletny': ENDPOINT-warning, globalny noindex roboczy, TBC w danych; brak istniejącej karty))

**Zbiorczo:** rekomendacji 60; pełne trafienia 24 (40%), częściowe 23, błędne 13 (21%), przeoczone 11.

## Flagi kart (do decyzji w analizie końcowej)

- `mech:single-source-compiler` ← **too-broad** (dailyfruits-relaunch): Zlepia 'współdzielone fragmenty + check spójności' z 'kompilacją źródło→widoki'; DailyFruits zrealizował tylko słabszy wariant, a koszt edycji treści rozwiązał CMS — kandydat do po
- `mech:working-artifact-extraction` ← **too-narrow** (dailyfruits-relaunch): Brak failure mode 'ekstrakcja niekompletna + źródło umiera po cutoverze' (4 incydenty odzyskiwane przez Wayback do 4 tygodni po wdrożeniu)
- `mech:incident-to-guard` ← **too-narrow** (dailyfruits-relaunch): Opisuje powstawanie guardów, nie ich podtrzymywanie — po cutoverze incydenty produkcyjne wracały jako fixy, audyt redirectów nigdy nie wszedł do CI
- `mech:competitive-benchmarking` ← **wrong-trigger** (dailyfruits-relaunch): Rekomendowany w wersji minimalnej ≤2h, zero śladu wykonania w git/pamięci; n=1 — jeśli wzorzec powtórzy się w kolejnych backtestach migracji, zawęzić trigger do projektów repozycjo
- `mech:single-source-compiler` ← **too-broad** (dailyfruits-cms-v6): Karta zakłada istnienie rozróżnienia source/output; w statycznych serwisach (HTML w repo = źródło) generuje fałszywy zakaz 'nie edytuj wyrenderowanego HTML', który zwycięska archit
- `mech:sandbox-promotion` ← **too-broad** (dailyfruits-cms-v6): Brak anti-contextu dla operatorów wymagających natychmiastowej publikacji — realna alternatywa (direct-publish + stos odwracalności) nie jest zmapowana, więc Router rekomenduje san
- `mech:deterministic-spine` ← **wrong-trigger** (dailyfruits-cms-v6): Trigger karty nie objął klasy 'panel z zapisem do współdzielonego repo' (optimistic-lock, atomowe commity) — mechanizm realnie użyty, a niewyselekcjonowany
- `mech:negative-knowledge-ledger` ← **wrong-trigger** (dailyfruits-cms-v6): Karta nie precyzuje POZIOMU generalizacji wpisu; wpis 'zakaz techniki' zamiast 'mechanizm awarii' doprowadził Router do błędnej predykcji z najwyższym p (bt-05, 0.80)
- `mech:incident-to-guard` ← **too-narrow** (dailyfruits-seo-oferta): Definicja kodyfikacji uznaje tylko blokujący guard; praktyka projektu (4 incydenty → 4 wpisy w pamięci, 0 guardów w CI) pokazuje, że kodyfikacja realnie kończy w negative-knowledge
- `mech:single-source-compiler` ← **too-broad** (dailyfruits-seo-oferta): Trigger obejmuje jednorazowe migracje danych historycznych, gdzie realny wzorzec to skrypt jednorazowy + człowiek-kurator, nie kompilator utrzymywany w buildzie (archiwum 205 URL-i
- `mech:seo-aeo-foundation` ← **wrong-trigger** (dailyfruits-seo-oferta): Rekomendacja 'pełna warstwa w v1' trafiła w projekt, gdzie warstwa stron kategorii w większości istniała przed T0; realny wkład (llms.txt do spec, JSON-LD archiwum) był inkremental
- `mech:sandbox-promotion` ← **too-broad** (zdrofit-hourly-pipeline): Karta przyjmuje intencje projektowe (plan 'DO WALIDACJI' z memory) jako instancje mechanizmu — ev-001 cytuje projekt, w którym zero generacji kiedykolwiek zaszło; granica karty mus
- `mech:format-dictionary` ← **too-broad** (zdrofit-hourly-pipeline): Drugi niezależny dowód (po bt#001) sklejenia dwóch bytów: triage strumienia (żyje, briefsync) i słownik formatów z masterami (zamarł, zdrofit) — różne profile ryzyka i losy; do pod
- `mech:dated-commitment-gates` ← **wrong-trigger** (zdrofit-hourly-pipeline): Nie odpala się jako mechanizm pierwszoplanowy przy profilu 'otwarte prerekwizyty + jedyny walidator + brak daty startu', mimo że dokładnie ten profil Router nazwał ryzykiem #1 — uż
- `mech:incident-to-guard` ← **wrong-trigger** (zdrofit-hourly-pipeline): Rekomendowany projektowi w fazie prerekwizytów bez działającej rury — pętla incydent→guard wymaga powierzchni styku (wykonań produkujących incydenty); trigger powinien wymagać uruc
- `mech:sandbox-promotion` ← **too-broad** (narzedzie-do-briefowania): Rekomendowany bez sprawdzenia, czy architektura w ogóle dotyka produkcyjnych zasobów klienta; potrzebny anti-context 'wymaga istnienia zapisu do zasobu klienta'.
- `mech:numeric-gates` ← **wrong-trigger** (narzedzie-do-briefowania): Karta nie rozróżnia bramki (automatyczna konsekwencja poniżej progu) od badge'a (doradcza etykieta) — Router przewidział bramkę, powstał badge; warunek kalibracji jest miękki i zos
- `mech:format-dictionary` ← **too-broad** (narzedzie-do-briefowania): Druga flaga graniczna po bt#001: tu słownik formatów dostał furtkę 'custom format field' wbrew zasadzie 'spoza słownika tylko klasyfikacja' — karta nie definiuje, czy furtka uniewa
- `mech:dated-commitment-gates` ← **too-narrow** (narzedzie-do-briefowania): Karta nie zawiera warunku zewnętrznego kontrahenta bramki — samonarzucona bramka datowa (PLAN_10_TYG) nie zadziałała; bez tego warunku mechanizm daje fałszywe poczucie zabezpieczen
- `mech:proof-first-demo-pitch` ← **too-broad** (narzedzie-do-briefowania): Karta nie rozróżnia 'artefakt dowodowy istnieje' od 'artefakt doręczony odbiorcy' — demo + pitch deck powstały i nie zrealizowały mechanizmu, bo akt pokazu nie nastąpił.
- `mech:format-dictionary` ← **too-broad** (r3loop-app): Druga niezależna instancja (po briefsync): structured intake wizarda ≠ słownik formatów z masterami; karta zlepia 2-3 mechanizmy — do podziału
- `mech:numeric-gates` ← **too-narrow** (r3loop-app): Brak failure mode 'gate mierzy niewłaściwy wymiar' — bramka jakości przepuściła proposal 2× ponad budżet klienta (105k vs 50k)
- `mech:dated-commitment-gates` ← **too-narrow** (r3loop-app): Karta identyfikuje ryzyko, ale nie zawiera mechaniki egzekwowania (egzekutor/blokada) — zarekomendowana i trafna, a mimo to nieprzyjęta; sama data na papierze nie działa
- `mech:deterministic-spine` ← **too-broad** (r3loop-app): Przepisana bramka 'cost cap per brief przed użyciem' zignorowana bez konsekwencji — element kosztowy karty może być balastem albo wymaga własnego egzekutora; do obserwacji
- `mech:single-source-compiler` ← **wrong-trigger** (beesknees-site): Brak anti-contextu dla serwisów, gdzie CMS edytuje pliki wynikowe in-place — tam kompilator jest niemożliwy; Router zarekomendował go w kolizji z comp:cms-git-backend
- `mech:incident-to-guard` ← **wrong-trigger** (beesknees-site): Karta opisuje jak guardy powstają, ale nie wymusza ich powstania: 4 incydenty, 0 guardów mimo rekomendacji i bramki w workflow; potrzebny datowany checkpoint egzekucji jako warunek
- `mech:machine-narrows-human-picks` ← **too-narrow** (beesknees-site): Trigger obejmuje tylko strumienie zadań; realne użycie (klasyfikacja 109 zdjęć z ludzką walidacją) było poza triggerem i Router go przegapił
- `mech:seo-aeo-foundation` ← **too-broad** (beesknees-site): Jako 'stała bramka na każdej promocji' nie odpowiada rzeczywistości projektów utrzymaniowych, gdzie SEO przychodzi batchem od zewnętrznej agencji; rdzeń wartości = dyscyplina noind
- `mech:single-source-compiler` ← **too-narrow** (r352-website): Nie obejmuje odwróconego kierunku extract-then-guard (artefakt=źródło, dokumenty=widoki z guardem CI), który rzeczywistość wybrała zamiast kompilacji
- `mech:working-artifact-extraction` ← **too-broad** (r352-website): Claim 'brand nie może powstać na sucho' ma kontrprzykład: brand r352 powstał generatywnie z Figma Make i się przyjął; ekstrakcja zadziałała tylko dla warstwy proof
- `mech:competitive-benchmarking` ← **wrong-trigger** (r352-website): Bramka 'przed pierwszym szkicem' martwa, gdy szkic istnieje przed T0 — trigger musi wykrywać istniejący artefakt i przesuwać bramkę na kolejną iterację
- `mech:incident-to-guard` ← **too-narrow** (r352-website): Trigger karty nie objął projektu z pipeline'em deployu, a mechanizm i tak zadziałał spontanicznie (3 guardy) — rozszerzyć na każdy projekt z deployem
- `mech:competitive-benchmarking` ← **wrong-trigger** (r352-case-studies-work): Strzela do każdego publicznego artefaktu; realny trigger to 'nieznana nisza bez własnego standardu' — tu standard był własny i dojrzały od 05.2026, rekomendacja bez przedmiotu (dru
- `mech:seo-aeo-foundation` ← **too-broad** (r352-case-studies-work): Brak warunku wejścia 'czy warstwa już istnieje' — rekomendowana jako bramka dla artefaktu, który miał komplet SEO/AEO od 2 miesięcy; produkuje szum i fałszywe predykcje powtórki wy
- `mech:dated-commitment-gates` ← **too-narrow** (r352-case-studies-work): Failure_condition zna 'zbudowane, niewysłane/niezdeployowane', ale nie zna odwrotności: 'zdeployowane, niezacommitowane' (praca LIVE poza źródłem prawdy przy auto-deployu) — najgro
- `mech:proof-first-demo-pitch` ← **candidate-merge** (r352-case-studies-work): Wariant shadow-proof wyrósł na samodzielną strukturę (case-as-record z polem zgody isShadow) — rozważyć wydzielenie/scalenie z nową kartą case-as-record zamiast trzymania jako 'rol
- `mech:split-url-architecture` ← **wrong-trigger** (fitstyle-platform): Trigger 'od pierwszego dnia jawny rozdział' nie sprawdza, czy dla encji współistnieją dwa typy URL; gdy presale LP jest jedyną stroną miasta, musi być kanoniczna i indeksowana — bu
- `mech:dated-commitment-gates` ← **too-narrow** (fitstyle-platform): Karta zna tylko bramkę datowaną; gdy odblokowanie zależy od aktora zewnętrznego (decyzja klienta), właściwa jest bramka zdarzeniowa z przygotowanym ostatnim krokiem ('wpięcie backe
- `mech:location-as-data` ← **too-broad** (fitstyle-platform): Warunek walidacji '≥2 lokalizacje zanim obieca się skalę' mierzy replikację techniczną, która przy danych-first jest darmowa (6 miast od razu); powinien mierzyć walidację rynkową (
- `mech:presale-demand-ledger` ← **too-broad** (fitstyle-platform): Karta uznaje mechanizm za zastosowany, gdy wdrożono copy/strukturę pierwszeństwa — ale bez trwałego magazynu zapisów 'księga popytu' nie istnieje; potrzebny jawny warunek minimalny

## Hipotezy nowych mechanizmów (surowe, do klastrowania po 30 backtestach)

- (dailyfruits-relaunch) mech:client-edit-layer — gdy właścicielem treści jest klient bez IT a deploy = git, warstwa edycji (CMS nad repo, commit jako API) jest przewidywalnym workstreamem, nie dodatkiem; n≥2 już dziś (DailyFruits CMS v6 + linia beesknees→betterguide)
- (dailyfruits-relaunch) mech:source-decommission-sweep (kandydat guard/checklist) — przed wyłączeniem starego origin pełny sweep zależności (hotlinki, og:image, uploads) + lokalna kopia całości; klasa '4 incydenty martwych hotlinków po śmierci źródła'
- (dailyfruits-relaunch) Potwierdzona hipoteza Routera 'migracja-jako-mechanizm': playbook WP→statyczny złożył się niemal 1:1 wg przewidzianej sekwencji — do spisania jako karta z inwentarzem z 4 źródeł (crawl+sitemap+GSC+Wayback)
- (dailyfruits-relaunch) Hipoteza kalibracyjna: predykcje klasy 'dług u siebie' i 'guard po wpadce' to quasi-pewniki r352 — Router powinien raportować je jako base rate, a moc predykcyjną wydawać na klasy specyficzne dla projektu
- (dailyfruits-relaunch) Checklist-item consent/GTM dla każdego przejęcia serwisu z istniejącym kontenerem GTM (Usercentrics/2×GTM/Clarity — wykrywalne w T0 z kodu strony)
- (dailyfruits-relaunch) bt-07 do rozstrzygnięcia prospektywnie: czy CMS/generator z DailyFruits zostanie przeniesiony do innego projektu do 12.2026
- (dailyfruits-cms-v6) mech:reversibility-stack — direct-publish z warstwową odwracalnością (undo-w-sesji → kosz → historia/revert) jako świadoma alternatywa sandbox-promotion, gdy operator wymaga natychmiastowej publikacji
- (dailyfruits-cms-v6) mech:canonical-writer — zapis nigdy nie patchuje fragmentu in-place, buduje całą kanoniczną sekcję i podmienia atomowo (buildSklad/buildCard; klon-wpisu-jako-szkielet = ta sama zasada); kandydat na failure_condition w istniejących kartach, nie osobną
- (dailyfruits-cms-v6) Guard 'optimistic-lock na artefakcie' (sha+old) jako standard każdego panelu piszącego do współdzielonego źródła
- (dailyfruits-cms-v6) Meta: ledger negatywny musi przechowywać pary przyczyna→mechanizm awarii, nie technika→zakaz — błędna generalizacja szkodzi bardziej niż brak wpisu
- (dailyfruits-cms-v6) Dla narzędzi wewnętrznych na gotowej rurze predykcje iteracyjne formułować w LICZBIE wersji, nie w czasie (v2–v6 w jeden dzień)
- (dailyfruits-cms-v6) Bramka oddania powinna wymagać dowodu użycia przez realnego operatora — 'panel kompletny' ≠ 'klient publikuje' (pętla wciąż otwarta)
- (dailyfruits-seo-oferta) mech:content-resurrection — odzysk kapitału organicznego po migracji przez odtworzenie treści (Wayback/archiwa) jako żywych stron-sierot z self-canonical + sitemap-only, z człowiekiem-kuratorem (żywy/redirect/kasacja); hierarchia: strona 200 > 301 se
- (dailyfruits-seo-oferta) guard lab-field-split: każda praca performance z bannerem zgody/third-party jawnie rozdziela miarę lab od field i deklaruje to przed pracami
- (dailyfruits-seo-oferta) guard 'granica architektury spisana W REPO, nie w pamięci AI' + CI na jej niezmienniki (deep-link nie w sitemapie, standalone self-canonical, źródła redirectów bez slasha) — jako bramka zamknięcia projektów SEO-architektonicznych
- (dailyfruits-seo-oferta) checkpoint własności nasze-vs-klient na starcie workflow Routera — otwarte punkty klasy 'czeka na człowieka klienta' planowane, nie odkrywane
- (dailyfruits-seo-oferta) do zmierzenia na danych GSC ~10.2026: czy 134 strony archiwum 1:1 odzyskają widoczność lepiej niż redirecty — rozstrzygnie hierarchię content-resurrection
- (zdrofit-hourly-pipeline) mech:launch-forcing-batch — dla profilu 'zbudowane, niewypuszczone' pierwszą bramką jest zawsze datowany minimalny pierwszy batch (np. 5 briefów ręcznie w tydzień 1); prerekwizyty doskonalone NA batchu, nie przed nim (alternatywnie: rozszerzenie mech
- (zdrofit-hourly-pipeline) Reguła protokolarna 'vacuous-hit': predykcja backtestowa liczona jako HIT tylko gdy zaobserwowano ścieżkę przyczynową claimu, nie sam wynik (bt-04/05 tego projektu jako kontrprzykład)
- (zdrofit-hourly-pipeline) Hipoteza profilowa: prawdopodobieństwo nie-startu rośnie z liczbą bramek-prerekwizytów przed pierwszym kontaktem z realnym wolumenem — do zmierzenia na kolejnych backtestach (framework, Caterelo, ARToffNIA vs projekty które wystartowały)
- (zdrofit-hourly-pipeline) bt-06 (≤8 rodzin pokrywa ≥70% wolumenu) pozostaje żywą, testowalną hipotezą — dane leżą na dysku (korpus 2843 kart + SLOWNIK_FORMATOW.md), test możliwy bez uruchamiania pipeline'u
- (zdrofit-hourly-pipeline) Reguła evidence: wpisy z projektów bez egzekucji dostają typ 'intencja' i zerową wagę confidence
- (narzedzie-do-briefowania) mech:wire-or-delete (klasa 'napisane, niewpięte'): żaden moduł nie wchodzi na main bez co najmniej jednego produkcyjnego wywołania w ścieżce użytkownika — węższa, wcześniejsza postać 'zbudowane, niewysłane' wykrywalna grepem callerów; do zmierzenia s
- (narzedzie-do-briefowania) mech:external-gate-counterparty: bramka datowa wiąże tylko z odbiorcą spoza systemu właściciela; falsyfikacja = znaleźć w portfelu choć jeden przypadek, gdzie samonarzucona bramka datowa bez zewnętrznego odbiorcy zadziałała.
- (narzedzie-do-briefowania) Guard protokołu backtestów: T0 datowany z 'git log --reverse' / najstarszego artefaktu, nigdy z daty utworzenia/importu karty — inaczej pakiet T0 przemyca wiedzę z przyszłości (jak tutaj: briefsync/r3loop w 'stanie wiedzy' na styczeń 2026).
- (narzedzie-do-briefowania) Wzorzec 'burst–pauza–burst–porzucenie' jako mierzalny sygnał ryzyka: >2 miesiące ciszy w repo po intensywnym burście + brak aktu kontaktu z odbiorcą = predyktor archiwizacji; do zbadania na pozostałych projektach backtestu.
- (narzedzie-do-briefowania) Scoring semantyczny bez pliku korpusu kalibracyjnego w repo (≥30 realnych przypadków + oczekiwane wyniki) degeneruje do badge'a — kandydat na twardy anti-context numeric-gates zamiast miękkiego 'warunku'.
- (r3loop-app) mech:presentation-sink — w narzędziach z interfejsem klienckim warstwa prezentacji/brandu pochłania większość iteracji po-MVP (rebrand, dark-theme-remap, portal = większość commitów po LIVE); planować jako osobny budżet, nie 'poprawki'
- (r3loop-app) mech:constraint-gate — bramka zgodności z twardymi ograniczeniami klienta (budżet/termin), ortogonalna do bramki jakości; wprost z case 105k/50k
- (r3loop-app) mech:schema-parity-guard — guard parytetu prod-schema vs migracje przy ręcznych operacjach SQL (klasa z commitu 75fd179 i migracji 009 'czeka na run usera')
- (r3loop-app) 'Machine refuses' zmaterializowało się jako SOP (playbook NO-GO→odmowa 24h), nie kod — odmowa leadom to mechanizm procesowy, nie techniczny; koryguje hipotezę Routera z T0
- (r3loop-app) 'Critic-as-a-product' wzmocnione: Critic działa od 1. iteracji na realnym briefie — kandydat na wydzielenie i sprzedaż
- (r3loop-app) Meta: rekomendacja bez egzekutora nie zmienia zachowania — każda karta typu 'dyscyplina' potrzebuje pola 'kto/co wymusza'
- (beesknees-site) mech:sink-verification — klasa 'cichy sukces': dowód skutku na UJŚCIU (mail delivered z nagłówkiem, event widoczny w narzędziu, lead w panelu), nie przy wywołaniu; spina 3 niezależne incydenty beesknees (handler, Reply-To, eventy-nieoznaczone) wykryt
- (beesknees-site) guard:canonical-workdir — jedna kanoniczna kopia robocza, stale klony w kwarantannie; klasa potwierdzona w ≥2 projektach (dailyfruits-repo-clones + 'PINY PATRYK copy')
- (beesknees-site) Hipoteza sekwencji 'własność przed pomiarem' — w relacji utrzymaniowej klient najpierw dostaje kontrolę (CMS), pomiar jest drugim dowodem; falsyfikuje założenie Routera 'najtańszy dowód wartości = pomiar najpierw'
- (beesknees-site) failure_condition dla przyszłej karty pomiaru: instrumentacja ma granicę własności — strzelający event ≠ policzona konwersja (oznaczenie Key Event/conversion po stronie marketera)
- (beesknees-site) Krok 'test spójności zestawu' w ROUTER.md — Router musi sprawdzać kolizje między rekomendowanymi mechanizmami/komponentami (compiler × cms-in-place), nie oceniać kart pojedynczo
- (r352-website) mech:extract-then-guard — wariant/rozszczepienie single-source-compiler: gdy artefakt poprzedza system, źródłem jest artefakt, a dokumenty są widokami pilnowanymi guardem CI (dowód: brand-check.mjs)
- (r352-website) Category Naming Loop — iteracyjne testowanie nazwy kategorii z pomiarem frazy (wzmocniona z T0: H1 iterowany 3x bez żadnego pomiaru rynkowego)
- (r352-website) mech:aesthetic-timebox — eksploracja estetyczna na własnym brandzie za flagą trialową z tanim revertem (zaobserwowany wzorzec HERO_WEBGL: 41456f0 trial -> 004eb07 revert)
- (r352-website) Pytanie T0 Routera 'czy artefakt już istnieje?' jako obowiązkowe pole pakietu — zmienia aplikowalność wszystkich bramek 'przed pierwszym szkicem'
- (r352-website) Brak mechanizmu dla decyzji pozycjonowania solo-vs-team (pivot 'growing operator team, not a solo shop') — kandydat na rozszerzenie Category Naming Loop lub osobną kartę
- (r352-website) bt-02/bt-04 rozstrzygalne pomiarowo we wrześniu 2026 (GSC + GTM po >=8 tyg. od funnel sprintu 18.07) — zaplanować dopisanie wyniku
- (r352-case-studies-work) mech:deploy-source-of-truth-guard — produkcja deployowana wyłącznie ze stanu zacommitowanego; guard wykrywający dirty-deploy przy dwutorowym deployu (evidence: working tree R352 WEBSITE 09.08)
- (r352-case-studies-work) mech:baseline-lock — po akcepcie klienta artefakt dostaje status LOCKED z zakazem reworków bez explicit ask; kończy pętle gustu (evidence: IK 02.08)
- (r352-case-studies-work) mech:proof-provenance — dowód w case wymaga zweryfikowanej własnej roli, nie tylko prawdziwych liczb (evidence: Pampelle)
- (r352-case-studies-work) Promocja case-as-record na kartę: warianty zgody okazały się głównym driverem struktury (isShadow), warunek routera spełniony
- (r352-case-studies-work) Odwrócona heurystyka zgody: publikowalność koreluje z dojrzałością relacji, nie odwrotnie proporcjonalnie do rozmiaru organizacji (Sonova jawna, mali klienci shadow)
- (r352-case-studies-work) bt-06 (rytm kwartalny bez bramki) → przenieść na żywą predykcję z horyzontem 01.11.2026
- (fitstyle-platform) mech:prototype-mode-guard — klasa guardów 'jawny tryb niekompletny': kod deklaruje własną niekompletność zamiast ją maskować (pusty ENDPOINT krzyczy w konsoli, globalny noindex w trybie roboczym, TBC w danych); użyta 3× w fitstyle bez rekomendacji Ro
- (fitstyle-platform) mech:event-gate — bramka zdarzeniowa na decyzję zewnętrzną jako świadoma alternatywa dla bramki datowanej, z przygotowanym ostatnim krokiem ('wpięcie backendu = 1 linia', deklarowane ~2 dni do startu kampanii); mierzalne na tym projekcie: data 'tak' 
- (fitstyle-platform) Rozróżnienie replikacja-techniczna vs walidacja-rynkowa jako jawne pole w kartach klasy location-as-data
- (fitstyle-platform) LP przedsprzedaży jako primary SEO surface miasta bez klubu (first-mover w SERP) — do zmierzenia po zdjęciu globalnego noindex
- (fitstyle-platform) Klasa pułapek ekstrakcji brandu ze stron z widgetami (kolor wtyczki ≠ brand) — kandydat na guard w procesie tokens-first

## Zastosowane evidence

Dopisane wpisy postmortem: 35 (dedupe pominął 21 — projekt już w karcie). Szczegóły per karta: agent-as-runtime +1, competitive-benchmarking +2, dated-commitment-gates +5, deterministic-spine +1, format-dictionary +1, incident-to-guard +4, negative-knowledge-ledger +2, numeric-gates +2, proof-first-demo-pitch +2, sandbox-promotion +3, seo-aeo-foundation +2, session-to-sop +1, single-source-compiler +4, split-url-architecture +2, working-artifact-extraction +3
