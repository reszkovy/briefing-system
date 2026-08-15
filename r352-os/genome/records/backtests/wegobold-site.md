---
id: "rec:backtests/wegobold-site"
type: "record"
title: "Backtest — wegobold-site"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:wegobold-site"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — wegobold-site (proj:wegobold-site)

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji · PRZEBIEG B (falsyfikacja)
T0 ≈ 21.06.2026 (pierwszy commit repo `0d43a46`, 2026-06-21). Okno prac: 06.2026 – 26.07.2026.

**Źródła przebiegu rzeczywistego (weryfikowane 2026-08-08/09):**
- repo `/Users/reszek/Desktop/inleadia_111/wegobold-site` — `git log`, `git status`, `git rev-parse`, kod (`index.html`, `src/styles/theme.css`, `src/app/data/work.ts`, `src/app/pages/*`, `vercel.json`, `.vercel/project.json`)
- pamięć: `memory/wegobold-site.md` (log 06–07.2026), `memory/r352-case-studies.md`, `memory/r352-website.md`, `memory/r352-brand-centre.md`
- karta `genome/projects/wegobold-site.md`
- stan produkcji: `curl -sI https://www.wegobold.com` (2026-08-08 12:55 UTC)

---

## 1. Pakiet T0 (skrót)

Własne zlecenie: wegobold = siostrzana marka produktowa r352 dla MŚP. Rozdzielić dwie marki po grupie docelowej i JTBD (nie po liście usług), tak by kupujący sam się selekcjonował. Cel: druga brama modelu hub-and-spoke (wegobold = produkty/wdrożenia MŚP od ~30k; r352 = proces/retainery korpo od ~20k; spoki inleadia + hanoi dowożą leady z atrybucją per źródło). Mikro-organizacja, jeden decydent = autor i akceptant, zero zewnętrznego egzekutora terminów. Aktywa: domena wegobold.com, repo (Vite 6 + React 18 + Tailwind v4, wouter, origin = Figma Make export), r352.com jako artefakt zaakceptowany rynkowo, cały portfel dowodów przypisany do r352.

## 2. Skrót raportu Routera T0

**Rekomendowane (6):** `mech:working-artifact-extraction` (rdzeń), `mech:competitive-benchmarking` (test-first, bramka: delta-lista jako plik ≤2 h), `mech:seo-aeo-foundation` (bramka stała), `mech:split-url-architecture` (wariant cross-domain), `mech:proof-first-demo-pitch` (wariant inwentarza dowodów), `mech:numeric-gates` (warunkowo, z ostrzeżeniem).
**Odrzucone:** `mech:single-source-compiler`, `mech:sandbox-promotion` (z zachowaniem jednego guarda: jedna ścieżka deployu = git), `mech:location-as-data-funnels`, `mech:presale-demand-ledger`, `mech:design-as-code`.
**Ryzyka top 5:** (1) różnicowanie kosmetyczne, (2) kanibalizacja cross-domain, (3) pustka dowodowa nowej marki, (4) brak egzekutora bramek, (5) atrybucja jako deklaracja.
**Predykcje SYGNAŁ:** bt:wegobold-site-01…07.

---

## 3. Przebieg B — co się faktycznie stało

### 3.1 Oś czasu (fakty)

| Data | Fakt | Dowód |
|---|---|---|
| 2026-06-21 | baseline repo; lowercase brandu; repozycjonowanie product+industries; strona `/industries`, 4 wertykały | `git log` `0d43a46`…`8f16ec0` |
| 2026-06-22 | oferta przeramowana na DESIGN (bez dev/deploy); Realizacje najpierw usunięte, potem za hasłem, potem usunięte całkiem; perf mobile (kill GPU effects) | `9ffdc65`, `040e530`, `04f8c90`, `43ed718`, `3bdfe24` |
| 2026-06-23 | **wegobold.com → 307 → r352.com** („temporarily") | `435620e` = HEAD do dziś |
| 2026-07-07 | restyle „benchmark": ciemna zieleń leśna `#16231E` + mint `#6FD98A` + lila `#E0BAD7`, radius 0→1.25rem, sygnet przemalowany; `vercel.json` redirect → SPA rewrite; master komunikat „Brand. Produkt. Przychód."; oś narracyjna Budujemy→Wskazujemy→Wdrażamy→Wynik | `theme.css` (mtime 07-07), `vercel.json`, memory 07-07 |
| 2026-07-26 | `/work` + `/work/:slug`: `src/app/data/work.ts` (12 case'ów, opisy jakościowe), `Work.tsx`, `CaseStudy.tsx`; build do `dist/` | mtime plików, `dist/` 07-26 15:23 |
| 2026-08-08 | PROD nadal 307 → r352.com; całość prac od 06-23 **niezacommitowana** | `curl -sI`, `git status` |

### 3.2 Twardy stan na 2026-08-08 (najważniejsze ustalenie)

```
HEAD        = 435620e (2026-06-23, "temporarily redirect wegobold.com -> r352.com")
origin/main = 040e530 (2026-06-22)      → GitHub jest 2 commity ZA lokalnym repo
git status  = 21 plików zmodyfikowanych + 3 nieśledzone (src/app/data/, Work.tsx, CaseStudy.tsx)
git diff    = 328 insertions, 193 deletions
curl -sI https://www.wegobold.com → HTTP/2 307, location: https://r352.com
```

Cały restyle (07-07) i cała warstwa dowodowa (07-26) istnieją **wyłącznie w working tree**. Nie ma ich w commicie, nie ma ich na origin, nie ma ich na produkcji. `git checkout .` skasowałby ~1,5 miesiąca pracy. Ścieżka podglądu (`vercel deploy` z folderu) wysyła working tree, więc **maskuje** brak wersjonowania — artefakt „działa" w preview, mimo że w repozytorium nie istnieje.

### 3.3 Co powstało merytorycznie

- **Warstwa wizualna:** własne tokeny w `src/styles/theme.css` (`--color-background:#16231E`, `--color-accent:#6FD98A`, `--color-pink:#E0BAD7`, radiusy 0,5/0,75/1,25rem), font Satoshi/Tanker. Komentarz w kodzie: „paleta akcentów z boardu" — destylat z **zewnętrznej tablicy referencyjnej**, nie z marki-matki (r352 = grafit + limonka `#D4FF00`/`#DAFF45`) i nie z poprzedniego wegobolda (kremowa jasna baza + limonka, ostre rogi).
- **Oferta:** trzy sprinty ze **stałymi cenami** — od 6 000 zł / 9 000 zł / 14 000 zł (`Services.tsx:52,63,73`) + FAQ obiekcyjne (4 pytania, `Services.tsx:81`) + „Projekty, nie bezterminowe retainery" (`i18n.tsx:62`) + „Dla rozwijających się firm, nie korporacji."
- **Dowody:** `work.ts` — 12 case'ów (bees-knees, 9-camp-nou, artoffnia, protetyka, musa-studio, r352, qot, dailyfruits, pampelle, instytut-kawy, twoje-menu + 1) z polami challenge/approach/result i **jawną regułą w nagłówku pliku: „Bez zmyslonych metryk"**. Brak kolumny „rola zweryfikowana (źródło)".
- **Higiena:** komponent `Testimonials` z 3 zmyślonymi cytatami (Sarah Chen / Marcus Weber / Alex Rodriguez) istnieje w `Home.tsx:171-235`, ale **nie jest renderowany** (`grep "<Testimonials"` = brak trafień). Fałszywy dowód nie wszedł na artefakt.
- **SEO:** `index.html` ma title, description, OG, Twitter card i JSON-LD `Organization`. Brak: sitemap.xml, robots.txt, JSON-LD `Service`/`FAQPage`, meta per route (zero `document.title`/helmet w `src/`), SSR/prerenderu.
- **Atrybucja:** `Brief.tsx:60,84` — `source: "wegobold_brief"` (istniało już na T0). Zero UTM/`document.referrer`/parametru spoka w całym `src/`.

---

## 4. Porównanie predykcji SYGNAŁ z rzeczywistością

| ID | p | Werdykt | Dowód |
|---|---|---|---|
| bt:wegobold-site-01 | 0.75 | **MISS** | Przewidywano dziedziczenie szkieletu i systemu wizualnego r352, różnicowanie tylko w copy + akcent koloru. Rzeczywistość odwrotna: własna paleta (`#16231E`/`#6FD98A`/`#E0BAD7`) bez pokrycia z r352 (`#D4FF00`/grafit), własna typografia, zmiana geometrii (radius 0→1,25rem). Destylat wzięty z zewnętrznej tablicy („paleta akcentów z boardu", `theme.css:20`), nie z marki-matki. Trafna została tylko druga część: nie powstał osobny dokument delty „co jest inne wobec r352 i dlaczego". |
| bt:wegobold-site-02 | 0.70 | **HIT** | Brak SSR/prerenderu, brak sitemap.xml i robots.txt (`find` = 0 trafień), brak JSON-LD `Service`/`FAQPage`, brak meta per route. Jest tylko `Organization` w `index.html`. FAQ istnieje jako akordeon Reacta (`Services.tsx:231`) — niewidoczny bez JS. Warstwa SEO to najsłabszy element (memory 07-07: content/SEO ~3200/10000). |
| bt:wegobold-site-03 | 0.65 | **HIT** | Nie istnieje żaden plik benchmarku ani delta-lista (przeszukane repo i `inleadia_111/`). Funkcję punktu odniesienia przejęły: (a) własny artefakt r352 („index produktu ~6850 vs r352 ~8030"), (b) tablica moodboardowa. Zero benchmarku realizacji z niszy MŚP. |
| bt:wegobold-site-04 | 0.60 | **HIT (obie gałęzie)** | 12 case'ów przeniesionych z portfela r352 bez zapisanej weryfikacji roli; **Pampelle** — ten sam case, o którym `memory/r352-case-studies.md` mówi wprost „r352's role there is unverified" — trafił na wegobold bez adnotacji. Równolegle luka nazwana i nienaprawiona: social proof ~4400/10000 jako najsłabszy podwynik. |
| bt:wegobold-site-05 | 0.55 | **HIT** | Powstał indeks liczbowy zestawiający wegobold z r352 jako referencją (6850 vs 8030 + podwyniki: social proof 4400, content/SEO 3200, tech/perf 5800). Skala 0–10000 zamiast przewidywanych 0–1000/0–100 (szczegół ilustracyjny, nie claim). Zero automatu re-ocen, zero konsekwencji blokującej — score istnieje **wyłącznie w pliku pamięci**, nie w repo. |
| bt:wegobold-site-06 | 0.50 | **HIT** | Brak konwencji parametrów źródła i miejsca zbierania: `grep "utm_\|referrer"` w `src/` = 0 trafień merytorycznych. Jedyny tag `source: "wegobold_brief"` istniał przed T0 (memory 06-21) i rozróżnia markę, nie spoka. Model hub-and-spoke pozostał deklaracją. |
| bt:wegobold-site-07 | 0.40 | **HIT z zastrzeżeniem** | Nie powstała mapa fraz per domena ani decyzja o canonicalach; brak canonicali w `index.html`, brak sitemapy. Nakładanie się jest realne i mierzalne: Instytut Kawy, Twoje Menu i Pampelle są jednocześnie w `work.ts` wegobolda i na r352.com. **Zastrzeżenie:** kanibalizacja nie zmaterializowała się w SERP-ach, bo wegobold.com nadal nie serwuje treści (307). Ryzyko zamrożone, nie usunięte. |

**Fit SYGNAŁ: 6/7 (86%).** Jedyny miss — bt-01 — jest missem *kierunkowym*: Router pilnował złej osi (kosmetyka wizualna), a rozjazd nastąpił na osi handlowej (patrz §5.1).

### Ryzyka

| Ryzyko | Werdykt | Dowód |
|---|---|---|
| R1 różnicowanie kosmetyczne | **MISS** | Różnicowanie wizualne wykonane rzetelnie (własne tokeny, własna geometria, własny zestaw case'ów celowo inny niż logotypy korpo na r352). |
| R2 kanibalizacja cross-domain | **CZĘŚCIOWY** | Struktura ryzyka obecna (te same case'y, brak mapy fraz i canonicali), efekt zablokowany przez 307. |
| R3 pustka dowodowa | **HIT** | 12/12 case'ów pożyczonych, 0 własnych, 0 zweryfikowanych ról, Pampelle z niepotwierdzoną rolą przeniesiony dalej. |
| R4 brak egzekutora bramek | **HIT (silny)** | Prace niezacommitowane od 06-23, PROD niezmieniony od 06-23, sprawdzone 08-08. |
| R5 atrybucja jako deklaracja | **HIT** | Zero parametrów źródła w kodzie. |

**Ryzyka: 3 HIT, 1 częściowe, 1 miss.**

---

## 5. Raport 10 sekcji (CEO)

### 5.1 Accuracy Routera

6/7 predykcji sygnałowych trafionych, 3/5 ryzyk trafionych + 1 częściowe. Wysoka trafność **na osiach, które Router już znał** (egzekucja, SEO, dowody, atrybucja, bramka liczbowa) i zero widzenia na osi, która okazała się najważniejsza merytorycznie: **próg budżetowy rozjechał się z artefaktem**. T0 mówiło „wegobold = projekty od ~30k, r352 = retainery od ~20k". Artefakt sprzedaje sprinty **od 6 000 zł**. Rozdział po budżecie — jeden z trzech filarów modelu hub-and-spoke — nie przetrwał kontaktu ze stroną cennika, a Router nie miał ani mechanizmu, ani bramki, która by to złapała. Router opisywał lejek, którego cenowo nie umiał zweryfikować.

Drugie ograniczenie: raport miał 7 bramek (G0–G6), z których **żadna nie dotyczyła stanu wersjonowania między G3 a G6**. Guard „jedna ścieżka deployu (git)" był umieszczony dopiero w G6 (cutover). Rzeczywista awaria wydarzyła się w połowie — praca powstała, ale nigdy nie weszła do repozytorium — i przeszła pod wszystkimi bramkami.

### 5.2 Accuracy Mechanism Selection

**Pełne trafienia (3):**
- `mech:proof-first-demo-pitch` (wariant inwentarza) — realnie wykonany: `work.ts` to plik-inwentarz z jawną regułą „bez zmyślonych metryk" wpisaną w nagłówek kodu. Brakująca kolumna weryfikacji roli = dokładnie ta luka, którą Router nazwał w bramce G5.
- `mech:numeric-gates` — wykonany dokładnie tak, jak ostrzegała karta: score powstał, konsumenta nie było. Bonus: score nie trafił nawet do repo, tylko do pamięci sesyjnej.
- `mech:seo-aeo-foundation` — trafnie wskazany jako najsłabsze ogniwo; niewykonany, i to niewykonany mimo że **gotowe rozwiązanie leży w repo siostrzanej marki** (r352 ma `SEO.tsx` per route, `prerender.mjs` na 35 tras z fixem `@sparticuz/chromium`, sitemap ~40 URL, robots + llms.txt).

**Częściowe (2):**
- `mech:working-artifact-extraction` — ekstrakcja nastąpiła, ale ze **źródła, którego karta nie przewiduje**: zewnętrznej tablicy benchmarkowej, nie z zaakceptowanego artefaktu własnego ani z instancji. Bramka „destylat jako maszynowy plik w repo" formalnie spełniona (`theme.css` to plik tokenów), ale plik nie jest zacommitowany — czyli powstał **nowy tryb awarii, którego karta nie zna: destylat w repo, ale poza kontrolą wersji**.
- `mech:split-url-architecture` (wariant cross-domain) — mapa fraz nie powstała, ale decyzja URL-owa cross-domain *została podjęta i jest poprawna technicznie*: `307` (tymczasowy), nie `301`, co zachowuje opcjonalność SEO przy odpauzowaniu marki. Karta nie ma języka na „stan pauzy marki".

**Nietrafione / niewykonane (1):**
- `mech:competitive-benchmarking` — delta-lista jako plik nie powstała (piąty projekt z rzędu z tym samym wynikiem). **Ale**: efekty, które miała zabezpieczyć, pojawiły się bez niej — jawne widełki cenowe, stała cena za ustalony zakres, FAQ obiekcyjne, jasne „dla kogo NIE". To pierwszy backtest, w którym da się pokazać, że **deliverable mechanizmu jest zbędny, gdy operator zna standard niszy intuicyjnie**. Flaga: `too-broad` + kandydat na degradację z bramki do checklisty.

**Odrzucenia — wszystkie poprawne**, przy czym jedno zasługuje na odwrócenie:
- `mech:sandbox-promotion` odrzucony jako mechanizm, ale Router przeniósł z niego jeden guard: „jedna ścieżka deployu (git)". **To był najważniejszy element całego raportu i został zwalidowany przez naruszenie.** Praca dostarczana przez `vercel deploy` z folderu ominęła git całkowicie. Guard był trafny; zabrakło mu miejsca w workflow (siedział w G6, potrzebny był po G3).

### 5.3 Największe błędy

1. **Router nie miał mechanizmu na ofertę/cennik.** Największa realna zmiana artefaktu (produktyzacja w trzy sprinty ze stałą ceną) przeszła całkowicie poza routingiem, i to ona złamała założenie segmentacji budżetowej z T0 (6k vs deklarowane 30k).
2. **Bramka wersjonowania w złym miejscu.** Guard git-only w G6 zamiast po G3. Konsekwencja realna: 328 linii zmian i 3 nowe pliki żyją poza repozytorium od ~6 tygodni, a origin jest 2 commity za lokalnym HEAD-em.
3. **Zła oś w ryzyku #1.** Router bał się „r352 w innym kolorze". Rzeczywistość: wizualnie odrębna marka z rozjechanym progiem handlowym. Karta `working-artifact-extraction` pilnuje warstwy wizualnej i nie ma języka na dziedziczenie/rozjazd **oferty**.
4. **Ślepota na rodzinę repozytoriów.** Router polecił `seo-aeo-foundation` jako budowę od zera, nie widząc, że identyczny problem jest rozwiązany produkcyjnie w bratnim repo tej samej rodziny stacku. Rekomendacja „zbuduj" zamiast „przenieś" to najdroższy wariant.

### 5.4 Największe sukcesy

1. **Predykcja o dowodach (bt-04) trafiła co do konkretnego case'a** — Pampelle, jedyny case z jawnie niezweryfikowaną rolą w Genome, został przeniesiony na drugą markę bez adnotacji. To dowód, że powiązanie karty `proof-first-demo-pitch` z evidence z `bt-r352-case-studies-work` działa operacyjnie, a nie tylko narracyjnie.
2. **Ostrzeżenie z `numeric-gates` sprawdziło się w mocniejszej wersji niż zapisane** — score nie tylko nie miał konsumenta, ale nie miał nawet nośnika (żył w pamięci sesji). To zaostrza `failure_condition` karty.
3. **Guard „jedna ścieżka deployu" zwalidowany przez naruszenie** — najczystszy dowód wartości w całej transzy: guard był poprawny, jego brak w egzekucji dał policzalną szkodę (praca poza wersjonowaniem).
4. **Higiena dowodowa operatora okazała się lepsza niż zakładał Router**: fałszywe testimoniale istniały w kodzie i **nie zostały wyrenderowane**, a `work.ts` ma wpisaną w komentarz regułę „bez zmyślonych metryk". `ax:dowod-przed-obietnica` działa nawet bez mechanizmu.

### 5.5 Nowe mechanizmy (kandydaci)

- **`mech:offer-ladder-integrity`** — próg cenowy/segmentowy z pozycjonowania musi mieć dokładnie jedno miejsce prawdy i być weryfikowany wobec artefaktu przed publikacją. Trigger: wielomarkowa architektura z rozdziałem po budżecie. Bramka: cennik na stronie ≡ próg z pozycjonowania, rozjazd = decyzja świadoma i zapisana (tu: 6k vs 30k, rozjazd niezauważony).
- **`mech:sibling-solution-transfer`** — zanim zbudujesz warstwę techniczną (SEO, i18n, deploy, guardy) w projekcie z rodziny, sprawdź, czy rodzeństwo nie ma jej rozwiązanej produkcyjnie; przenieś moduł, nie problem. Trigger: ≥2 repo na tym samym stacku pod jednym właścicielem. Dowód klasy: `prerender.mjs` + `SEO.tsx` + sitemap gotowe w r352, wegobold ma zero.
- **`mech:narrative-spine`** — jedna oś narracyjna powtórzona we wszystkich widokach (tu: Budujemy→Wskazujemy→Wdrażamy→Wynik → 4 karty Home = 4 kroki Process = CTA stopki). Realnie wykonana, wymusiła osobny commit naprawczy `bdfd462 "fix(coherence): align all tabs to one consistent story"`. Bramka: każda sekcja mapuje się na takt osi albo wypada.
- **`mech:claim-credibility-audit`** — przegląd twierdzeń pod kątem możliwości ich obronienia, z prawem do amputacji zakresu. Dowód: `590e546 "fix(brand-review): retail honesty"`, całkowite usunięcie wertykału retail („not credible"), `dbb381f "remove photo/video — out of scope"`, `9ffdc65` (usunięcie języka dev/deploy). To operacyjna wykładnia `ax:dowod-przed-obietnica`.
- **`guard:work-in-version-control`** — nie mechanizm, guard: żaden krok „done" nie jest done, jeśli `git status` nie jest czysty, a `origin` nie jest zsynchronizowany. Wzmocnienie guarda z `sandbox-promotion` i jego przesunięcie z bramki cutoveru do każdej bramki dostarczenia.

### 5.6 Mechanizmy do usunięcia

Żadnego do usunięcia. Jeden do **degradacji**: `mech:competitive-benchmarking` — utrzymać jako mechanizm, ale zdjąć status twardej bramki („delta-lista jako plik przed pierwszym szkicem"). Pięć projektów, zero wykonań, a w tym projekcie efekty docelowe osiągnięte bez niego. Bramka, która nigdy nie została przekroczona i której nieprzekroczenie nie zaszkodziło, jest teatrem procesu.

Jeden do **rozszerzenia zakresu, nie usunięcia**: `mech:split-url-architecture` — potrzebuje wariantu cross-domain oraz języka na „stan pauzy marki" (307 jako świadoma decyzja architektury URL, nie jako dług).

### 5.7 Confidence Changes (PROPOZYCJE — zapisu dokonuje sesja główna)

| Karta | Propozycja | Uzasadnienie |
|---|---|---|
| `mech:proof-first-demo-pitch` | **+1 evidence typu postmortem**, confidence w górę | Wariant inwentarza dowodów realnie wykonany; przewidziana luka (weryfikacja roli) zmaterializowała się na konkretnym case'ie (Pampelle). Drugi projekt potwierdzający tę samą klasę. |
| `mech:numeric-gates` | **+1 evidence postmortem**, confidence bez zmian, **zaostrzenie `failure_condition`** | Dopisać: „score bez nośnika — istnieje wyłącznie w pamięci sesyjnej, nie w repo". Silniejszy wariant znanej wady, nie nowa. |
| `mech:seo-aeo-foundation` | **+1 evidence postmortem**, confidence w górę | Trafnie wskazana jako najsłabsze ogniwo, niewykonana, koszt policzalny (0 sitemap, 0 robots, 0 prerender, FAQ niewidoczne bez JS). |
| `mech:working-artifact-extraction` | **+1 evidence**, confidence bez zmian, **nowy `failure_condition`** | Dopisać: „destylat w repo, ale poza kontrolą wersji" oraz „ekstrakcja z zewnętrznej tablicy referencyjnej ≠ z zaakceptowanego artefaktu — karta nie rozróżnia tych źródeł". |
| `mech:competitive-benchmarking` | **flaga `too-broad`**, confidence **w dół**, degradacja bramki do checklisty | Piąte niewykonanie; pierwszy dowód, że deliverable jest zbędny, gdy operator zna standard niszy (widełki, FAQ, stały zakres pojawiły się bez benchmarku). |
| `mech:split-url-architecture` | **+1 evidence**, confidence bez zmian, flaga `too-narrow` | Karta zwalidowana wyłącznie wewnątrz jednej domeny; wariant cross-domain i „stan pauzy" (307) poza zakresem. |
| `mech:sandbox-promotion` | **+1 evidence** do guarda „jedna ścieżka deployu", bez zmiany statusu karty | Guard zwalidowany przez naruszenie (21 plików poza commitem, origin 2 commity w tyle, dostarczanie przez `vercel deploy` z folderu). |

Dedupe: ten backtest dotyczy tego samego projektu, co import ze skanu CKO 07.08 — evidence z obu źródeł **nie sumuje się** (niezmiennik 10, reguła z bt:briefsync E3).

### 5.8 Nowe hipotezy

- **H1 (do testu na następnym projekcie wielomarkowym):** rozdział marek po budżecie nie przeżywa kontaktu z cennikiem, jeśli cennik nie ma jednego źródła prawdy. Miara: zgodność progu z pozycjonowania z najniższą ceną na stronie.
- **H2:** w rodzinie repozytoriów jednego właściciela koszt warstwy technicznej jest funkcją *transferu*, nie *budowy* — projekty, które nie sprawdzają rodzeństwa, płacą pełną cenę albo nie robią nic. Miara: czy w projekcie N+1 warstwa SEO powstała z modułu przeniesionego.
- **H3:** dla operatora solo najostrzejszym predyktorem „nie dowiezione" nie jest brak deployu, lecz **stan working tree** — `git status` jest wcześniejszym i tańszym sygnałem niż `curl` produkcji. Do zmierzenia na kolejnych backtestach: ile projektów „zbudowane, niezdeployowane" ma równocześnie brudne repo.
- **H4:** `mech:agent-facing-distribution` (z T0) pozostaje niezweryfikowana i zyskała warunek blokujący: przy rozjeździe cen 6k vs 30k publikacja cen maszynowych pogłębiłaby niespójność. Najpierw H1, potem llms.txt.

### 5.9 Czego Genome nie wiedział w T0

1. **Że „nie dowiezione" ma dwa różne stany**, i ten gorszy jest niewidoczny: nie tylko „zbudowane, niezdeployowane", ale „zbudowane, niezacommitowane". Deploy z folderu maskuje ten stan, bo artefakt działa w preview mimo że nie istnieje w repozytorium. Genome miał język tylko na pierwszy stan.
2. **Że ekstrakcja może iść z zewnętrznej tablicy referencyjnej** — trzecie źródło destylatu obok „artefakt zaakceptowany" i „marka-matka", nieopisane w karcie, a tu użyte i skuteczne (różnicowanie wizualne wyszło).
3. **Że próg budżetowy jest najsłabszym elementem pozycjonowania wielomarkowego** — łatwiej rozjeżdża się niż język, kolor czy zestaw usług, bo mieszka w jednym pliku cennika i nikt go nie porównuje z tezą.
4. **Że rodzeństwo repozytoriów to niewykorzystane aktywo** — r352 ma produkcyjny prerender z rozwiązanym gotchą Chromium na Vercelu; wegobold na identycznym stacku nie ma nic.
5. **Że 307 może być decyzją, nie długiem** — świadoma pauza marki na krawędzi (zamiast 301) zachowuje odwracalność. Genome nie ma pojęcia „marka w stanie pauzy".

### 5.10 Jak następny projekt byłby lepszy

Każdy projekt wielomarkowy / z rodziny repozytoriów dostaje z automatu:
1. **Bramkę `git status` czysty + `origin` zsynchronizowany po KAŻDYM kroku dostarczenia** (nie tylko przy cutoverze). Definicja „done" = commit na origin, nie plik na dysku.
2. **Test integralności drabiny ofertowej**: najniższa cena na stronie zestawiona z progiem z pozycjonowania; rozjazd = jawna decyzja z datą, nie odkrycie po fakcie.
3. **Krok „inwentarz rodzeństwa" w G0**: czy któreś repo rodziny ma już rozwiązaną warstwę, którą zamierzamy budować (SEO/prerender/i18n/guardy). Wynik: lista modułów do przeniesienia zamiast listy rzeczy do zbudowania.
4. **Inwentarz dowodów z obowiązkową kolumną „rola zweryfikowana (źródło)"**, a case'y oznaczone jako niezweryfikowane w innym projekcie Genome nie przechodzą dalej bez decyzji.
5. **Benchmark niszy jako checklista 20-minutowa, nie bramka z plikiem** — z jawnym zwolnieniem, gdy operator deklaruje znajomość standardu niszy.

---

## 6. Evidence (do zapisania w kartach + Ledger)

**E1** {observation: „zbudowane, niezacommitowane" to osobna klasa awarii ostatniej mili, gorsza od „zbudowane, niezdeployowane", bo maskowana przez deploy z folderu; proof: `git status` = 21 M + 3 ?? , `git rev-parse HEAD origin/main` = 435620e vs 040e530, `git diff --stat` = 328/193, HEAD z 2026-06-23, praca z 07-07 i 07-26 (mtime plików), weryfikacja 2026-08-08; impact: ~1,5 miesiąca pracy poza kontrolą wersji, `git checkout .` = utrata; proposed_change: guard `work-in-version-control` przy każdej bramce dostarczenia, nie tylko przy cutoverze; confidence_effect: +postmortem dla guarda z sandbox-promotion; mechanisms: `mech:sandbox-promotion`, `mech:working-artifact-extraction`}

**E2** {observation: próg budżetowy z pozycjonowania (projekty od ~30k) rozjechał się z artefaktem (sprinty od 6 000 zł) i rozjazd nie został zauważony; proof: `src/app/pages/Services.tsx:52,63,73` (6 000 / 9 000 / 14 000 zł), `i18n.tsx:62`, karta `proj:wegobold-site` (Cel: „projekty od ~30k"), memory 06-21; impact: filar segmentacji hub-and-spoke nie istnieje na artefakcie — wegobold stał się tańszym wejściem, nie większym ticketem; proposed_change: nowa karta `mech:offer-ladder-integrity` + bramka „cennik ≡ próg z pozycjonowania"; confidence_effect: n/d (nowa hipoteza); mechanisms: nowy}

**E3** {observation: gotowa, produkcyjna warstwa SEO istnieje w bratnim repo tej samej rodziny i nie została przeniesiona; proof: `memory/r352-website.md` (prerender 35 tras, fix `@sparticuz/chromium`, `SEO.tsx` per route, sitemap ~40 URL, robots + llms.txt) vs wegobold: brak sitemap/robots (`find` = 0), brak meta per route (`grep document.title|helmet` = 0), JSON-LD tylko `Organization` w `index.html`; impact: rekomendacja „zbuduj" zamiast „przenieś" = najdroższy wariant, wykonany jako zero; proposed_change: krok „inwentarz rodzeństwa" w G0 + kandydat `mech:sibling-solution-transfer`; confidence_effect: +postmortem dla `mech:seo-aeo-foundation`; mechanisms: `mech:seo-aeo-foundation`}

**E4** {observation: case z jawnie niezweryfikowaną rolą został przeniesiony na drugą markę bez adnotacji; proof: `src/app/data/work.ts` slug `pampelle` obok `instytut-kawy` i `twoje-menu`; `memory/r352-case-studies.md`: „pampelle.pl footer credits only distributor Crimston Spirits — r352's role there is unverified"; impact: rozdział marek powiela niezweryfikowany kredyt na drugiej domenie; proposed_change: obowiązkowa kolumna „rola zweryfikowana (źródło)" + reguła: case oznaczony jako niezweryfikowany w Genome nie przechodzi do innego projektu; confidence_effect: +postmortem dla `mech:proof-first-demo-pitch`; mechanisms: `mech:proof-first-demo-pitch`}

**E5** {observation: ocena liczbowa powstała bez konsumenta i bez nośnika — istnieje wyłącznie w pliku pamięci; proof: `memory/wegobold-site.md` („product index ~6850/10000, r352 benchmark ~8030, social proof ~4400, content/SEO ~3200, tech/perf ~5800"); brak jakiegokolwiek pliku ze score w repo (przeszukane `inleadia_111/`); impact: score nie mógł zablokować niczego, bo nie był dostępny poza sesją; proposed_change: zaostrzyć `failure_condition` karty o wariant „score bez nośnika"; confidence_effect: +postmortem, confidence bez zmian; mechanisms: `mech:numeric-gates`}

**E6** {observation: deliverable `competitive-benchmarking` (delta-lista jako plik) nie powstał po raz piąty, a efekty docelowe mechanizmu pojawiły się bez niego; proof: brak pliku benchmarku w repo; jednocześnie `Services.tsx` ma jawne widełki, stałą cenę za ustalony zakres, FAQ obiekcyjne (`Services.tsx:81-83`) i jawne „dla kogo NIE" (`i18n.tsx:62`); impact: bramka, której nieprzekroczenie nie szkodzi, degraduje wiarygodność całego workflow; proposed_change: flaga `too-broad`, degradacja z bramki do checklisty ze zwolnieniem „operator zna standard niszy"; confidence_effect: confidence w dół; mechanisms: `mech:competitive-benchmarking`}

**E7** {observation: destylat marki wyszedł z zewnętrznej tablicy referencyjnej, nie z marki-matki ani z zaakceptowanego artefaktu własnego — i różnicowanie wizualne udało się; proof: `src/styles/theme.css:20` komentarz „paleta akcentów z boardu"; tokeny `#16231E`/`#6FD98A`/`#E0BAD7` bez pokrycia z paletą r352 (`#D4FF00`/`#DAFF45`, `memory/r352-brand-centre.md`); zmiana geometrii radius 0 → 0,5/0,75/1,25rem; impact: karta nie rozróżnia trzech źródeł ekstrakcji, więc Router przewidział złą oś ryzyka (bt-01 MISS); proposed_change: dopisać do karty trzecie źródło („zewnętrzna tablica referencyjna") z warunkiem: dopuszczalne dla warstwy wizualnej, niedopuszczalne dla warstwy dowodowej i ofertowej; confidence_effect: bez zmian + flaga; mechanisms: `mech:working-artifact-extraction`}

**E8** {observation: świadoma pauza marki na krawędzi (307, nie 301) to decyzja architektury URL, której Genome nie nazywa; proof: commit `435620e` „chore: temporarily redirect wegobold.com -> r352.com (307)"; `curl -sI https://www.wegobold.com` (2026-08-08) → `HTTP/2 307, location: https://r352.com`; `vercel.json` w working tree ma już SPA rewrite (redirect zdjęty lokalnie, nieopublikowany); impact: ryzyko kanibalizacji cross-domain zamrożone, nie usunięte; odwracalność zachowana świadomie; proposed_change: dodać do `split-url-architecture` wariant cross-domain + pojęcie „stan pauzy marki" (307 = decyzja, 301 = zamknięcie); confidence_effect: bez zmian + flaga `too-narrow`; mechanisms: `mech:split-url-architecture`}
