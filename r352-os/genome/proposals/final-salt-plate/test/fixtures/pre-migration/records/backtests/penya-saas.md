---
id: "rec:backtests/penya-saas"
type: "record"
title: "Backtest — penya-saas"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — penya-saas (SaaS onboardingu penyi FC Barcelona)

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji · cel: FALSYFIKACJA
T0 ≈ 25.07.2026 (init repo, decyzja „pełny real"). Horyzont obserwacji: do 08.08.2026 (import CKO, `status: archived`).

**Źródła przebiegu rzeczywistego:** `~/Desktop/penya Public Landing Page` (36 commitów, 25.07–31.07.2026), `SPRINT.md`, `SETUP.md`, `supabase/migrations/0001–0004`, `supabase/functions/{create-checkout,stripe-webhook,p24-create-payment,p24-webhook,send-application-email}`, `src/lib/tenant/registry.ts`, `package.json`, `index.html`; memory `penya-saas.md` (log 25.07–31.07); karta `proj:penya-saas`.

**Uwaga o czystości ślepoty:** przebieg A jawnie oznaczył 3 predykcje flagą `[ryzyko kontaminacji]` (bt-01, bt-02, bt-03) — sekcja „Status przy imporcie" karty projektu była widoczna przed filtrowaniem. Poniżej liczę fit w dwóch wariantach: pełnym i zdyskontowanym (bez predykcji flagowanych).

---

## Pakiet T0 (co Genome mogło wiedzieć)

Penya Blaugrana de Łódź #2327 — oficjalny fanklub FCB, stowarzyszenie prowadzone przez zarząd-wolontariat; kontakt przez właściciela 9campnou (ta sama relacja co campnou-3d). Stan „before": rekrutacja = mail z danymi osobowymi (w tym **numer dowodu**) + ręczny przelew mBank + ręczna księgowość zarządu. Cel: produkt SaaS do onboardingu penyi — samoobsługa, płatności online, panel członka; pilot Łódź jako case study „before/after" i podstawa sprzedaży innym penyom; **architektura multi-tenant od pierwszego dnia**. `domain: produkty` — r352 jest jednocześnie dostawcą i właścicielem produktu. Stack wyjściowy: eksport z Figma Make (Vite + React + Tailwind v4). Znane niewiadome T0: własność kont infrastrukturalnych i płatniczych, istnienie tenanta #2, podstawa prawna zbierania nr dowodu, zdolność zarządu do KYC operatora płatności.

## Przebieg A — skrót Routera T0

**Rekomendowane (6):** M1 `mech:dated-commitment-gates` (bramka nadrzędna, przed mechanizmami wykonawczymi), M2 `mech:location-as-data` (w wariancie zawężonym: izolacja od dnia 1, silnik brandingu dopiero po tenancie #2), M3 `mech:deterministic-spine` (idempotencja + degradacja, nie warstwy LLM), M4 `mech:incident-to-guard` (z datowanym checkpointem), M5 `mech:working-artifact-extraction` (inwentarz realnych zgłoszeń + pełna lista członków), M6 `mech:proof-first-demo-pitch` (z bramką negocjacyjną). Plus bramka stała `mech:seo-aeo-foundation` **zredukowana do minimalnej higieny**.

**Odrzucone:** `mech:single-source-compiler`, `mech:format-dictionary`, `mech:agent-as-runtime` (jako mechanizm produktu; dopuszczony jako narzędzie jednorazowe), `mech:numeric-gates`.

**Workflow:** G0 inwentarz → G1 minimalizacja RODO → G2 własność kont → budowa → G3 guard izolacji → G4 import sandbox→promocja → G5 płatności → G6 GO/STOP → G7 tenant #2.

**Top ryzyka:** (1) blokada na prerekwizytach strony trzeciej, (2) multi-tenant przed drugim tenantem, (3) przeciek między tenantami, (4) darmowa infrastruktura mylona z awarią, (5) brak modelu przychodu.

---

## Przebieg B — porównanie z rzeczywistością

### Predykcje-SYGNAŁ

| ID | p | Werdykt | Dowód |
|---|---|---|---|
| bt-01 | 0.75 | **PARTIAL** | Kierunek trafiony co do joty: Sprint B code-complete (commit `cfcaefd` Stripe + `1f126ec` P24, 31.07), produkcyjnie nieaktywny, blokada = 4 dane z panelu P24 (`MERCHANT_ID/POS_ID/CRC/API_KEY`) i pytanie do Adriana „czy penya MA JUŻ konto P24/Tpay/PayU" (SETUP.md l. 84–98). **Kwantyfikator „≥3 tygodnie" NIEOSIĄGNIĘTY w oknie obserwacji**: 31.07 → 08.08 = 9 dni. Predykcja nierozstrzygalna w horyzoncie, który przebieg A sam sobie wyznaczył. |
| bt-02 | 0.70 | **HIT** | `src/lib/tenant/registry.ts`: dwa wpisy — `lodz` (realny) i `mallorca` (demo, fikcyjne `#1899`, locale `es`, EUR); seed w `0001_init.sql` ten sam. Zero realnych drugich tenantów do 08.08. |
| bt-03 | 0.60 | **HIT (mocny)** | Import 165 rekordów 31.07: SQL editor Supabase niedostępny → bulk INSERT przez **REST anon** + PATCH statusów per-40-maili z **admin JWT wyjętym z localStorage** (`sb-gvdbsntvpgcmjstyibvo-auth-token`) przez Claude w Chrome. Dokładnie „obejście po nieudanej próbie narzędzia oficjalnego". |
| bt-04 | 0.60 | **MISS** | Brak incydentu klasy „limit/uśpienie darmowej infry pomylone z bugiem aplikacji". Wystąpiła klasa sąsiednia, ale inna: awaria **konsoli dostawcy** (SQL Editor) rozpoznana od razu jako zewnętrzna, obchodzona świadomie. Predykcja przeniesiona z r3loop bez sprawdzenia różnicy: r3loop = pauza instancji (runtime), penya = defekt narzędzia (konsola). |
| bt-05 | 0.55 | **MISS (sfalsyfikowana)** | `0002_applications.sql`: kolumny to `first_name,last_name,email,phone,city,about` — **brak nr dowodu, brak daty urodzenia**. SPRINT.md, tabela ryzyk Sprintu A: „nie zbieramy nr dowodu". 31.07: „Data urodzenia z CSV ŚWIADOMIE nieimportowana (minimalizacja RODO)". Minimalizacja zaszła **bez** bramki G1 — to zachowanie domyślne r352, nie luka. |
| bt-06 | 0.50 | **HIT (z zastrzeżeniem)** | SPRINT.md ma pełny kalendarz (28.07 start, 31.07 mid, 02.08 UAT, 03.08 LIVE, 04.08 Sprint B, 11–14.08 cutover) i DoD z quasi-progiem („zarząd samodzielnie obsłużył ≥1 wniosek"). **Nie ma** progu GO/STOP, scenariusza STOP ani automatycznej konsekwencji. Kalendarz się osunął (08.08: Sprint B otwarty), decyzja nie zapadła — projekt trafił do `archived` jako **efekt uboczny importu CKO**, nie aktem woli. |
| bt-07 | 0.45 | **HIT** | `package.json`: skrypty wyłącznie `build`/`dev`, zero frameworka testowego, zero plików testowych w `src/` i `supabase/`. Izolacja istnieje jako **konfiguracja** (`current_penya_id()` w politykach RLS 0002), nigdy jako test. 165 realnych rekordów osobowych zaimportowanych 31.07 bez guarda. |

**Fit predykcji:** pełny 4 HIT + 1 PARTIAL + 2 MISS = **4,5/7 ≈ 64%**. Zdyskontowany (bez flagowanych bt-01/02/03): 2 HIT + 2 MISS = **2/4 = 50%** — to jest uczciwiejsza liczba i ona powinna wchodzić do metryki transzy.

### Mechanizmy — trafienia

- **`mech:location-as-data` — PEŁNE trafienie, w tym prognoza i recepta.** Tenant = rekord danych: `penyas` 1:1 z `TenantConfig`, resolver `?penya=` → subdomena → default, kolory jako tokeny `brand-*` wstrzykiwane na `:root`. Router zalecił rozdzielenie **izolacji** (dzień 1) od **silnika brandingu** (po tenancie #2) — rzeczywistość zbudowała **oba w sprincie 1** (commit `3f580a0`, 25.07: demo `?penya=mallorca` z pełnym rebrandem, EUR, hiszpańskim locale, FAQ po hiszpańsku), a tenant #2 nigdy nie powstał. Recepta routera oszczędziłaby realną pracę.
- **`mech:working-artifact-extraction` — PEŁNE, podręcznikowe.** Stara strona WordPress zbadana 25.07 jako źródło; blog przeniesiony (6 artykułów pod ORYGINALNYMI slugami); fakty zweryfikowane u źródła zamiast z deklaracji (składka 110 zł = uchwała Walnego, 700+ członków, bilety = min. pół roku członkostwa); 4 realne zdjęcia zamiast stocku; CSV Google Forms → dedupe 177→165 z mapowaniem statusów. Element „nazwij rozbieżność" też zadziałał: nr dowodu jawnie wskazany jako wada stanu „before" i wycięty.
- **`mech:deterministic-spine` — PEŁNE, z twardym dowodem w kodzie.** `p24-webhook/index.ts` l. 80–82: `.update({status:'paid'}).eq('id',applicationId).eq('status','applied')` — warunkowy update = idempotencja bez tabeli zdarzeń. Obowiązkowe `/transaction/verify` przed zmianą statusu. Statusy jako enum `applied|paid|activated|rejected`. `src/lib/supabase.ts` — dual-mode: bez env aplikacja działa na mockach (zaprojektowana degradacja). Aktywacja świadomie zostawiona ręczna (bo FCB).
- **Odrzucenie `mech:agent-as-runtime` jako mechanizmu produktu z wyjątkiem na import jednorazowy — trafione idealnie.** Produkt działa bez sesji (edge functions, RLS), a wszystkie akty „agent w przeglądarce" to jednorazówki: provisioning Supabase, nadanie roli admina przez Table Editor, import 165 rekordów, kasowanie 8 rekordów testowych.
- Odrzucenia `single-source-compiler`, `format-dictionary`, `numeric-gates` — bezsporne, żaden nie miał w projekcie czego robić.

### Mechanizmy — błędy Routera

- **`mech:incident-to-guard` — rekomendowany, ZEROWA adopcja.** Nie powstał żaden z trzech guardów, które router sam wymienił jako minimalny zestaw: brak testu izolacji, brak keep-alive/health-checku, brak weryfikacji drift live-vs-repo. Router poprawnie zacytował warunek z bt-beesknees („wyłącznie z datowanym checkpointem") — i mimo to rekomendował bez checkpointu. To trzeci projekt z rzędu w korpusie z tym samym wynikiem.
- **`mech:proof-first-demo-pitch` — rekomendowany, nie zmaterializowany.** Case study „before/after" był **deklarowanym celem projektu** (karta `proj:penya-saas`, DoD w SPRINT.md: „Stara strona zarchiwizowana w `case-study/before/`"). Katalog `case-study/` **nie istnieje**. Instrumentacja lejka powstała (`?krok=` w `RegisterPage.tsx` l. 94, Vercel Analytics), dane nigdy nie zostały obrócone w dowód. Warunek z karty („demo liczy się dopiero z datą i nazwiskiem odbiorcy pokazu") potwierdzony przez brak.
- **`mech:seo-aeo-foundation` — REDUKCJA BYŁA BŁĘDEM.** Router argumentował: „rdzeń produktu jest za logowaniem, dystrybucja biegnie kanałami FCB i social" → minimalna higiena. Rzeczywistość: publiczny landing rekrutacyjny **zastępuje zaindeksowany serwis penyalodz.pl**, więc SEO to nie higiena, tylko **parytet URL przy cutoverze** — 6 artykułów przeniesionych pod oryginalnymi slugami root-level z literalnymi trasami w `App.tsx` (commit `adcd4d4`), `noindex,nofollow` w `index.html` do czasu cutoveru, OG/favicon, a w DoD: „stare URL-e działają, noindex zdjęty", sitemap + GSC. Anti-context karty („strony za hasłem / bez celu akwizycyjnego") wprowadził Router w błąd.
- **`mech:dated-commitment-gates` — diagnoza trafna, karta za szeroka.** Router użył jej jako mechanizmu #1 i przewidział bottleneck poprawnie. Ale karta zlepia dwie różne rzeczy o skrajnie różnej bazowej adopcji: **datowany plan** (SPRINT.md — powstał, jest szczegółowy, ma nawet mitygację kolejnościową „KYC startuje w dniu 1 Sprintu A, żeby nie blokował") i **bramkę z gałęzią STOP** (nie powstała nigdy, w żadnym projekcie korpusu). Rekomendując „bramkę" dostajemy plan i mylimy to z adopcją.

### Mechanizmy użyte, a nierekomendowane (miss rate)

- **`mech:sandbox-promotion` — użyty w pełnej postaci, pominięty przez Router.** Cała dostawa to równoległa budowa na `penyalodz.vercel.app` z `noindex,nofollow` i paskiem „wersja poglądowa" (zdejmowanym dopiero po UAT z zarządem), przy nietkniętym produkcyjnym penyalodz.pl, z jednym aktem promocji = cutover DNS. Router nazwał wzorzec tylko przy imporcie danych (G4) i nie podłączył karty do dominującego zastosowania — podmiany serwisu.
- **Brak w Genome karty dla lejka konwersyjnego.** Największy pojedynczy blok pracy (25.07, commity `1d10d2b`, `aeaf96c`, `daf2b84`) to przebudowa landingu pod konwersję: AIDA w 9 sekcjach, kotwica cenowa „ok. 9 zł/mies.", bilety-first, „jak to działa" w 3 krokach, karta cenowa jak legitymacja, FAQ 7 pytań w configu tenanta, sticky mobile CTA, rejestracja 2-krokowa z draftem w sessionStorage i krokiem w URL pod analitykę. Żadna z 24 kart tego nie opisuje — a to jest powtarzalny, bilowalny rdzeń roboty r352 (penya, FitStyle, DiMedical, LP Zdrofitu).

### Ryzyka — trafienia i pudła

**Trafione:** R1 (blokada na prerekwizytach — trafione, ale tylko dla modułu płatności, nie dla produktu), R2 (multi-tenant przed drugim tenantem — trafione w pełni), R5 (brak modelu przychodu — trafione: pilot darmowy, brak cennika, brak tenanta #2, projekt zamknięty bez bramki komercyjnej).
**Pudła:** R3 (przeciek między tenantami — nie wystąpił), R4 (darmowa infra mylona z awarią — nie wystąpiło).

**Czego ryzyka nie objęły — trzy realne, niepokryte klasy:**

1. **Churn prerekwizytów po WŁASNEJ stronie.** Router modelował wyłącznie powolność strony trzeciej. Rzeczywistość: Sprint B został **napisany dwa razy** — najpierw pod Stripe (`cfcaefd`, z argumentem „jedna integracja zamiast trzech bramek"), a kilka godzin/commitów później przepisany na bezpośrednie Przelewy24 (`1f126ec`) po zmianie decyzji Reszka. Zegar prerekwizytu strony trzeciej wystartował od nowa (nowy operator = nowy zestaw danych i nowe KYC). To failure mode klasy „re-decyzja integracji po code-complete resetuje zależność zewnętrzną" — nieopisany w żadnej karcie.
2. **Rozjazd repo↔baza bez guarda.** Migracja `0004_admin_delete_applications.sql` jest **zacommitowana w repo i nigdy niewykonana na bazie** („DO WYKONANIA gdy SQL editor wstanie"), a hasło do bazy zostało wygenerowane i **niezapisane** → ścieżka CLI (`supabase db push`) zamknięta trwale, jedyna droga to konsola dostawcy. To dokładnie „ciche rozjazdy dwóch prawd" z `mech:incident-to-guard`, w wersji strukturalnej: akt „apply" leży poza pipeline'em, więc nic go nie pilnuje.
3. **Limit planu jako bramka skalowania produktu.** Org Supabase na planie Free: **2/2 projekty zajęte**. Multi-tenantowy SaaS, którego teza sprzedażowa to „kolejne penye", stoi na infrastrukturze, która nie przyjmie drugiego środowiska. Bramka G7 („tenant #2") ma więc twardy warunek infrastrukturalny, którego nikt nie nazwał.

Dodatkowo: sprzątanie danych produkcyjnych (8 rekordów testowych, 31.07) odbyło się **ręcznie w Table Editorze na tabeli produkcyjnej** — sandbox istniał dla kodu i dla treści, nie dla danych.

---

## Raport 10 sekcji (CEO)

1. **Accuracy Routera.** Predykcje-sygnał: 4,5/7 pełnego fitu (64%), 2/4 po zdyskontowaniu predykcji flagowanych ryzykiem kontaminacji (50%) — i ta druga liczba jest właściwa. Ryzyka: 3/5. Bottleneck #1 (płatności zablokowane po stronie zarządu) nazwany trafnie i wcześnie. Główna wada raportu: **wszystkie trzy najmocniejsze predykcje pochodzą z puli skażonej**, a obie predykcje z czystej puli o najwyższej pewności (bt-04, bt-05) są pudłami — obie były transferem wzorca z innego projektu bez sprawdzenia, czy warunek wejścia zachodzi tutaj.

2. **Accuracy Mechanism Selection.** Pełne: 3/6 (`location-as-data`, `working-artifact-extraction`, `deterministic-spine`) — wszystkie trzy realnie nośne, w tym `deterministic-spine` z dowodem w linijce kodu. Częściowe: 1/6 (`dated-commitment-gates` — diagnoza tak, adopcja nie). Nieużyte mimo rekomendacji: 2/6 (`incident-to-guard`, `proof-first-demo-pitch`). Błędnie zredukowany: `seo-aeo-foundation`. Pominięty a użyty: `sandbox-promotion`. Odrzucenia: 4/4 poprawne. **Fit ≈ 55–60%** — najniższy sensowny wynik z dotychczasowych backtestów i najbardziej informatywny.

3. **Największe błędy.** (a) Redukcja `seo-aeo-foundation` na podstawie anti-contextu, który nie rozpoznaje przypadku „podmiana zaindeksowanego serwisu" — Router zszedł do higieny tam, gdzie stawką był parytet URL-i. (b) Rekomendacja `incident-to-guard` bez datowanego checkpointu, wbrew warunkowi zacytowanemu w tym samym akapicie — Router zna regułę i jej nie stosuje do siebie. (c) Predykcja bt-05 zbudowana na założeniu, że bez bramki wady artefaktu przechodzą 1:1 — fałszywe dla r352 przy danych osobowych; minimalizacja RODO jest tu zachowaniem domyślnym. (d) Pominięcie `sandbox-promotion` przy projekcie, który jest podręcznikowym równoległym buildem z pojedynczym cutoverem.

4. **Największe sukcesy.** (a) `mech:location-as-data` zadziałał jako **narzędzie oszczędzania pracy**, nie tylko diagnozy: recepta „izolacja od dnia 1, silnik brandingu po tenancie #2" była dokładnie tym, czego projekt nie zrobił i za co zapłacił. (b) Odrzucenie `agent-as-runtime` jako mechanizmu produktu **z jawnym wyjątkiem** na import jednorazowy — precyzja na poziomie, którego wcześniejsze backtesty nie pokazywały. (c) bt-03 trafione niemal dosłownie (obejście przez REST + admin JWT z localStorage) — dowód, że wzorzec „ostatnia mila bez API" ma realną moc predykcyjną.

5. **Nowe mechanizmy (hipotezy).** Główna: **`mech:dependency-free-first-slice`** — podziel dostawę tak, żeby ścieżka wartości o ZERZE prerekwizytów zewnętrznych szła na produkcję pierwsza, a ścieżka zablokowana była upgrade'em, nie bramką. To jest najważniejsza rzecz, jakiej ten projekt uczy Genome: korpusowy failure mode #1 („zbudowane, zablokowane na stronie trzeciej") został tu **rozbrojony architekturą planu**, a nie bramką datową. Sprint A („przelew, ale cywilizowany") uruchomił realne zapisy, 165 rekordów, panel zarządu i panel członka **bez ani jednego zewnętrznego blokera**, podczas gdy płatności online stały. Kontrprzykłady w korpusie (dailyfruits-consent-gtm, r3loop) to projekty, gdzie całość czekała na ścieżkę zablokowaną. Dodatkowo: **`mech:conversion-landing-anatomy`** (Funnel Mechanics — luka: brak karty dla lejka konwersyjnego landingu) i guard **`repo↔live schema drift`** (kandydat na rozszerzenie `deterministic-spine`/`incident-to-guard`, nie na osobną kartę).

6. **Mechanizmy do usunięcia.** Brak. Do PODZIAŁU: `mech:dated-commitment-gates` (datowany plan vs bramka ze STOP-em — różna baza adopcji, różna falsyfikowalność). Do POSZERZENIA anti-contextu: `mech:seo-aeo-foundation`.

7. **Confidence Changes (PROPOZYCJA — zapisy robi sesja główna).**
   - `mech:location-as-data`: +evidence typu **postmortem** (prognoza i recepta potwierdzone). Podbicie uzasadnione.
   - `mech:working-artifact-extraction`: +**postmortem** (pełne zastosowanie z weryfikacją faktów u źródła). Podbicie uzasadnione.
   - `mech:deterministic-spine`: +**postmortem** (idempotencja warunkowym updatem + zaprojektowana degradacja dual-mode). Podbicie uzasadnione.
   - `mech:sandbox-promotion`: +**postmortem** (użyty w pełni, pominięty przez Router — evidence o luce rekomendacyjnej, nie o mechanizmie). Bez zmiany confidence.
   - `mech:incident-to-guard`: +**postmortem NEGATYWNY**, BEZ podbicia; dopisać `failure_condition` i flagę.
   - `mech:proof-first-demo-pitch`: +**postmortem NEGATYWNY**, BEZ podbicia; potwierdza istniejący warunek „data + nazwisko odbiorcy".
   - `mech:dated-commitment-gates`: +**postmortem częściowy**, BEZ podbicia; flaga too-broad.
   - `mech:seo-aeo-foundation`: +**postmortem**; warunek wejścia „podmiana istniejącego, zaindeksowanego serwisu ⇒ pełna warstwa + parytet URL".

8. **Nowe hipotezy.** (a) `dependency-free-first-slice` jako obowiązkowy krok Routera dla każdego projektu z prerekwizytem po stronie trzeciej — pytanie „co możemy wypuścić, gdy tego nie dostaniemy?" przed pytaniem „kiedy to dostaniemy?". (b) Re-decyzja integracji po code-complete resetuje zegar strony trzeciej — mierzalne w korpusie (Stripe→P24). (c) `archived` w Genome zlepia „zatrzymany decyzją" z „zaimportowany historycznie" — przy penyi status wziął się z importu CKO, nie ze STOP-u; to fałszuje statystykę porzuceń. (d) Bramka skalowania produktu ma warunek infrastrukturalny (plan/limit dostawcy), nie tylko sprzedażowy.

9. **Czego Genome nie wiedział w T0.** Że r352 domyślnie stosuje minimalizację danych osobowych bez bramki (bt-05 sfalsyfikowana — korekta base-rate). Że w repertuarze r352 istnieje wzorzec dwufazowej dostawy odcinającej blokery zewnętrzne — i że nie ma na to karty. Że utrata hasła do bazy zamyka ścieżkę CLI na stałe i czyni konsolę dostawcy jedynym kanałem migracji (klasa ryzyka nieopisana). Że awarie konsoli dostawcy (Supabase Studio) to w tym stacku klasa powtarzalna, różna od pauzy instancji. Że limit planu Free (2/2 projekty) jest twardą bramką dla tezy multi-tenant.

10. **Jak następny projekt byłby lepszy.** Każdy projekt z prerekwizytem po stronie trzeciej dostaje z automatu: (1) jawny podział na plaster bez zależności zewnętrznych i plaster zablokowany — wypuszczamy pierwszy, drugi jest upgrade'em; (2) jedno pytanie w bramce: „czy re-decyzja integracji jest jeszcze możliwa? jeśli tak, zamrażamy operatora PRZED code-complete"; (3) guard rozjazdu repo↔live dla każdej zmiany aplikowanej poza pipeline'em, plus zapisane poświadczenie kanału CLI; (4) przy podmianie istniejącego serwisu — parytet URL-i jako pozycja DoD, nie „higiena SEO"; (5) `sandbox-promotion` rekomendowany zawsze, gdy istnieje żywy zasób produkcyjny do zastąpienia, a nie tylko gdy piszemy do plików klienta.

---

## Evidence (do zapisu w kartach + Ledger)

- **E1** {obserwacja: dostawa dwufazowa odcięła blokera zewnętrznego — Sprint A („przelew, ale cywilizowany") wypuścił realne zapisy, 165 rekordów, panel zarządu i panel członka BEZ żadnego prerekwizytu strony trzeciej, podczas gdy płatności online stały na danych P24; dowód: SPRINT.md („Sprint A uruchamia PRAWDZIWE zapisy bez żadnego zewnętrznego blokera"), commity `ad9c2f9`/`0d450b1` (30–31.07) vs `1f126ec` + SETUP.md l. 84–98; wpływ: korpusowy failure mode #1 rozbrojony architekturą planu, nie bramką datową; zmiana: nowa karta-hipoteza `mech:dependency-free-first-slice` + krok Routera „co wypuszczamy, jeśli tego nie dostaniemy?"; confidence: n/d (nowa hipoteza); mech: dated-commitment-gates, deterministic-spine}
- **E2** {obserwacja: `seo-aeo-foundation` zredukowany przez Router do higieny, a rzeczywistość wymagała pełnego parytetu URL przy podmianie zaindeksowanego serwisu; dowód: 6 artykułów pod oryginalnymi slugami root-level w `src/content/blog.ts` + literalne trasy w `App.tsx` (commit `adcd4d4`, 26.07), `noindex,nofollow` w `index.html` l. 16–17 „until DNS cutover", DoD: „stare URL-e działają, noindex zdjęty"; wpływ: anti-context karty myli „produkt za logowaniem" z „publicznym frontem zastępującym istniejącą domenę"; zmiana: warunek wejścia „podmiana istniejącego, zaindeksowanego serwisu ⇒ pełna warstwa + parytet URL, nie minimalna higiena"; confidence: +postmortem; mech: seo-aeo-foundation}
- **E3** {obserwacja: `incident-to-guard` rekomendowany z jawnym warunkiem „tylko z datowanym checkpointem", rekomendowany BEZ checkpointu i niezaadoptowany w zerowym stopniu; dowód: `package.json` bez frameworka testowego i bez plików testów, zero keep-alive, zero drift-checku, przy 165 realnych rekordach osobowych zaimportowanych 31.07; wpływ: trzeci projekt z rzędu z zerową adopcją — rekomendacja bez egzekutora jest szumem; zmiana: `failure_condition` w karcie + reguła Routera „nie rekomenduj guarda bez daty i właściciela"; confidence: postmortem negatywny, BEZ podbicia; mech: incident-to-guard}
- **E4** {obserwacja: migracja zacommitowana w repo i nigdy niewykonana na bazie, przy trwale zamkniętej ścieżce CLI; dowód: `supabase/migrations/0004_admin_delete_applications.sql` (commit `ce57383`, 31.07) + memory 31.07 „DO WYKONANIA na bazie gdy SQL editor wstanie" + „hasło DB wygenerowane i NIEZAPISANE"; wpływ: klasa „ciche rozjazdy dwóch prawd" w wersji strukturalnej — akt `apply` leży poza pipeline'em, więc nic go nie pilnuje; zmiana: guard `repo↔live schema drift` jako rozszerzenie `deterministic-spine`; + input w karcie: poświadczenie kanału CLI zapisane przed pierwszą migracją; confidence: +postmortem; mech: deterministic-spine, incident-to-guard}
- **E5** {obserwacja: re-decyzja operatora płatności po code-complete zresetowała prerekwizyt strony trzeciej; dowód: `cfcaefd` „BLIK + Przelewy24 via Stripe Checkout — code complete, awaiting KYC" i `1f126ec` „switch to direct Przelewy24 integration" (oba 31.07), SETUP.md pyta o konto P24 od zera; wpływ: karta modeluje wyłącznie powolność strony trzeciej, nie churn po stronie właściciela — a to on tu wydłużył blokadę; zmiana: `failure_condition` w `dated-commitment-gates`: „zamrożenie wyboru dostawcy przed code-complete jest częścią bramki"; confidence: postmortem częściowy, BEZ podbicia; mech: dated-commitment-gates}
- **E6** {obserwacja: pełne zastosowanie `sandbox-promotion` przy podmianie serwisu, pominięte w rekomendacjach; dowód: równoległy build na `penyalodz.vercel.app` z `noindex` do cutoveru, pasek „wersja poglądowa" zdejmowany dopiero po UAT (SPRINT.md, P1), nietknięty produkcyjny penyalodz.pl, cutover DNS jako pojedynczy akt; wpływ: Router czyta kartę wąsko („zapis do zasobu klienta") i gubi wariant „równoległa budowa zastępcy z jednym cutoverem"; zmiana: rozszerzenie triggera karty o podmianę żywego serwisu; confidence: +postmortem; mech: sandbox-promotion}
- **E7** {obserwacja: minimalizacja danych osobowych zaszła bez bramki — predykcja przeciwna sfalsyfikowana; dowód: `0002_applications.sql` (brak nr dowodu i daty urodzenia), SPRINT.md tabela ryzyk „nie zbieramy nr dowodu", memory 31.07 „Data urodzenia z CSV ŚWIADOMIE nieimportowana"; wpływ: korekta base-rate — przy danych osobowych r352 minimalizuje domyślnie, więc bramka G1 była ceremonią; zmiana: usunąć z profilu ryzyk r352 założenie „wady artefaktu przechodzą 1:1 przy danych osobowych"; confidence: +postmortem (pozytywny) dla `working-artifact-extraction`; mech: working-artifact-extraction}
