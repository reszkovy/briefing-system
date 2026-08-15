---
id: "mech:split-url-architecture"
type: "mechanism"
title: "Split URL Architecture"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-08"
version: 2
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":8,"projects":6,"types":{"measurement":0,"postmortem":5,"narracja":3},"last_confirmed":"2026-08-08"},"recommendation":"use-with-care"}
category: "Funnel Mechanics"
relations: {"implements": ["prin:single-source-of-truth"], "related": ["mech:location-as-data-funnels", "mech:single-source-compiler", "mech:agent-facing-distribution", "mech:incident-to-guard"]}
trigger: "Klient mówi: 'nasze strony kategorii spadły po dodaniu filtrów/parametrów', 'chcemy linkować reklamy prosto w konkretny stan strony', 'ktoś przy sprzątaniu skasował stare URL-e i spadł organic'. Cechy problemu: serwis obsługuje jednocześnie katalog (SEO) i kampanie (deep-linki), a jeden system adresów próbuje robić obie rzeczy."
context: "Każdy serwis z katalogiem i kampaniami jednocześnie (kategorie ofertowe, zajęcia, miasta): sieci multi-location, e-commerce ofertowy, katalogi usług. Wymaga kontroli nad buildem/infrastrukturą (canonical, sitemap, rewrite'y, kolejność reguł platformy hostingowej)."
anti_context: "Nie stosować w małych serwisach bez kampanii segmentowych (jeden system adresów wystarcza), ani tam, gdzie nikt nie będzie egzekwował spisanej granicy między systemami — niedokumentowany rozdział prowadzi wprost do failure mode 'skasowano właściwe strony kategorii'. Ostrożnie, gdy brak dostępu do konfiguracji redirectów platformy."
inputs: ["Inwentarz obecnych URL-i z danymi GSC (co niesie organic, co jest deep-linkiem)", "Lista segmentów kampanijnych i ich intencji", "Dostęp do build systemu i konfiguracji platformy (canonical, sitemap, rewrite, redirecty)", "Decyzja per segment: strona standalone SEO czy tylko deep-link (flaga w danych)"]
ai_tasks: ["Audyt i klasyfikacja URL-i: standalone SEO vs deep-link UX (z danymi GSC, nie na oko)", "Implementacja rozdziału: self-canonical + sitemap dla standalone, canonical do huba + brak w sitemapie dla deep-linków", "Generacja stron standalone z tego samego źródła danych co deep-linki", "Skryptowy audyt spójności (sitemap vs canonical vs rewrite) i weryfikacja redirectów właściwym narzędziem (curl -L)", "Dokumentacja granicy systemów (co wolno usuwać, a czego nigdy)"]
human_tasks: ["Przemek-decyzja: które segmenty dostają indeksowalny dom, a które tylko deep-link", "Klient: akceptacja architektury i zobowiązanie do nieusuwania stron standalone przy utrzymaniu"]
expected_outcome: "Koniec kanibalizacji: deep-linki znikają z indeksu (canonical skonsolidowany), strony standalone utrzymują/odzyskują wejścia organic mierzalne w GSC per para standalone/deep-link, a kampanie dostają tanie deep-linki 1:1 w intencję bez ryzyka dla SEO."
evidence: [{"id":"ev:split-url-architecture-001","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"dailyfruits-oferta-seo-architecture: 11 stron standalone SEO (self-canonical, sitemap, ~1200 słów) + 9 deep-linków UX rewrite'owanych do oferta.html z canonical skonsolidowanym do /oferta — koniec kanibalizacji, odwracal"},{"id":"ev:split-url-architecture-002","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"fitstyle-platform: lejek 3 — kampanie na nazwy zajęć celują w /grafik?z={slug} (deep-link otwierający dymek z detalami + pasek konwersji), podczas gdy struktura stron klubów/cennika pozostaje kanoniczna"},{"id":"ev:split-url-architecture-003","type":"narracja","date":"2026-08-07","source":"rec:reviews/skan-cko-2026-08-07","note":"artoffnia-oferta: katalog obsługuje ?kto= ?kat= ?zaj= (deep-linki z mega menu i kampanii) obok dedykowanych stron zajecie.html?id= i grupa.html?g= — z jawnym planem podmiany pozycji menu na podstrony, gdy SEO tego wymaga"},{"id":"ev:split-url-architecture-bt-dailyfruits-relaunch","type":"postmortem","date":"2026-08-09","source":"rec:backtests/dailyfruits-relaunch","note":"(bt#T1) Karta pełny hit (144 redirecty, rewrites, architektura /oferta), ale bramka inwentarza przeszła na crawlu mimo dziur: +80 URL z sitemapy Yoast i ~45 z SAMOSEO po cutoverze | Zmiana: Wymóg inwentarza z 4 źródeł: crawl + sitemap CMS + GSC + Wayback; +evidence postmortem (pełny hit, wynik rzeczywisty)"},{"id":"ev:split-url-architecture-bt-dailyfruits-seo-oferta","type":"postmortem","date":"2026-08-09","source":"rec:backtests/dailyfruits-seo-oferta","note":"(bt#T1) Wzorzec wdrożony 1:1 z claimem karty (11 standalone self-canonical+sitemap / 9 deep-linków rewrite z canonical→hub /oferta, poza sitemapą), a 3 failure_conditions karty zmaterializowały się jako realne wpadki projektu | Zmiana: +evidence typu postmortem, propozycja podbicia confidence"},{"id":"ev:split-url-architecture-bt-dailyfruits-katalog-handlowy","type":"postmortem","date":"2026-08-09","source":"rec:backtests/dailyfruits-katalog-handlowy","note":"(bt#T2) Guard niewidoczności zrealizowany 1:1 (hasło client-side, X-Robots-Tag noindex, poza sitemapą/nawigacją) + dwa wzorce spoza karty: deploy-gate przez .vercelignore i skutek publikacji na routing (ożywienie 4 martwych redirectów) | Zmiana: Dopisać wzorzec deploy-gate i check 'wpływ publikacji na istniejące redirecty'; confidence: +postmortem"},{"id":"ev:split-url-architecture-medium-publishing-pipeline","type":"postmortem","date":"2026-08-08","source":"rec:backtests/medium-publishing-pipeline","note":"public/sitemap.xml:230 zglasza https://www.r352.com/journal/9, podczas gdy journalArticles.ts:1727 ma published: false, URL nie jest w liscie prerenderu (prerender.mjs: 1,4,5,6,7,8,11), a live zwraca HTTP 200 / 246 KB ze <title> strony glownej zamiast tresci artykulu. To jednoczesnie URL zrodlowy dla planowanego posta #8. Prerekwizyt 'flip published:true dla journal 9 i 10 w tygodniu 1' nie wykonany przez 4 tygodnie. | Zmiana: Rozszerzyc karte o weryfikacje obustronna: URL, na ktory wskazuje canonical, musi serwowac tresc (200 z tytulem artykulu, nie skorupa) i zgadzac sie z sitemapa; dodac failure_mode 'wlasna sitemapa zglasza skorupe'. [dowód: curl https://www.r352.com/journal/9 (2026-08-09, final=200, title=r352 - Design operations...) + public/sitemap.xml:230 + src/app/data/journalArticles.ts:1727 + scripts/prerender.mjs + PUBLISHING-PLAN.md:75]"},{"id":"ev:split-url-architecture-wegobold-site","type":"postmortem","date":"2026-08-08","source":"rec:backtests/wegobold-site","note":"Decyzja URL cross-domain zostala podjeta (307, nie 301) i jest poprawna technicznie, ale mapa fraz per domena nie powstala; karta nie ma jezyka na 'stan pauzy marki'. | Zmiana: +1 evidence, confidence bez zmian, flaga too-narrow (karta zwalidowana wylacznie wewnatrz jednej domeny). Dodac wariant cross-domain + pojecie 'stan pauzy marki' (307 = decyzja odwracalna, 301 = zamkniecie). [dowód: 2026-08-09: commit 435620e (2026-06-23) 'chore: temporarily redirect wegobold.com -> r352.com (307)'; curl -sI https://www.wegobold.com (2026-08-08 12:55 UTC) -> HTTP/2 307, location: https://r352.com; vercel.json w working tree ma juz SPA rewrite (redirect zdjety lokalnie, nieopublikowany); brak canonicali w index.html, brak sitemapy; te same case'y (instytut-kawy, twoje-menu, pampelle) na obu domenach.]"}]
tags: []
---

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
