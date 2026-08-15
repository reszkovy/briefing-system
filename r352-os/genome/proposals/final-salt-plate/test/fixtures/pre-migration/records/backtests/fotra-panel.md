---
id: "rec:backtests/fotra-panel"
type: "record"
title: "Backtest — fotra-panel"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — fotra-panel (przebieg B, falsyfikacja)

Data: 2026-08-09 · Protokół: `PROTOKOL.md` · dec:2026-08-09-program-walidacji
Projekt: `proj:fotra-panel` (domena tools-personal, status `archived`, tag `pre-genome`).

**Źródła przebiegu rzeczywistego:** `/Users/reszek/Desktop/Claude_zadania/FOTRA/` (kod: `index3.html`, `js/core|modules|features`, `js/fotra-kg-data.js`, `js/fotra-mail-signals.js`, `trello-sync.js`); `FOTRA/AUDYT-ULTRATOOL-2026-08-07.md` (audyt 5 agentów, 92 KB — najbogatsze źródło); `FOTRA/FOTRA_PRODUCTIZATION.md` (08.04.2026); `FOTRA/docs/` (GMAIL-SWEEP.md, INSTRUKCJA-CHAT-INFAKT.md); `git log` w FOTRA; `memory/fotra-panel-index3.md`; `~/.claude/scheduled-tasks/r352-cko-daily/`.

---

## 0. Ostrzeżenie metodologiczne — T0 był anachroniczny (czytać PRZED wynikami)

Pakiet T0 opisuje projekt tak, jakby startował w okolicy importu CKO (07–08.2026) i miał trzy obszary (CRM + przychody + mapa potencjału). Rzeczywistość: **FOTRA istnieje od lutego 2026** — jedyny commit w repo to `d51c2cc` z **23.02.2026** o tytule „FOTRA v1.0 — Strategic Life Operating System", a w repo leży 12 dokumentów planistyczno-audytowych z lutego–maja, w tym pełna strategia produktyzacji z **08.04.2026** (pricing $39/$79, roadmapa 26 tygodni, ICP, benchmark konkurencji).

Konsekwencja dla oceny: **część predykcji-SYGNAŁ dotyczy faktów rozstrzygniętych PRZED T0** (architektura statyczna, rozrost zakresu, los produktyzacji). To zawyża pozorną trafność. W poniższej ocenie każda taka predykcja jest jawnie oznaczona jako „rozstrzygnięta przed T0" i **nie liczy się do fit** — dokładnie tak, jak base-rate.

Reguła do PROTOKOŁU (propozycja): dla projektów `pre-genome`/`archived` pakiet T0 musi mieć **przypiętą datę T0** i wykluczać wszystko, co istnieje w repo/pamięci po tej dacie. Bez tego backtest projektów historycznych mierzy erudycję rekonstruktora, nie moc Routera.

---

## 1. Pakiet T0 (skrót)

Wewnętrzny panel operacyjny właściciela r352: dane o przychodach (inFakt), relacjach (Gmail + wiedza w głowie) i potencjale rozproszone; cel = jedno miejsce decyzji alokacyjnych przy koncentracji Benefit 49% i celu 1M PLN/rok. Jeden użytkownik = jeden decydent = jeden walidator. Brak klienta, deadline'u i budżetu zewnętrznego. Deklaracja „kandydat do produktyzacji" bez nazwanego odbiorcy.

## 2. Skrót Routera T0

**Rekomendowane (6):** `mech:deterministic-spine` (rdzeń), `mech:machine-narrows-human-picks`, `mech:single-source-compiler` (warunkowo — tylko dla „danych żywych"), `mech:session-to-sop`, `mech:negative-knowledge-ledger`, `mech:dated-commitment-gates` (test-first, wyłącznie w wariancie „automatyczna konsekwencja w kodzie").
**Odrzucone (5):** `mech:seo-aeo-foundation`, `mech:sandbox-promotion`, `mech:competitive-benchmarking`, `mech:proof-first-demo-pitch`, `mech:format-dictionary`.
**Workflow:** K0–K6 z bramkami B0–B6 (B4 „akt decyzji" wskazana jako najważniejsza; B6 „automatyczna konsekwencja przestarzałych danych").
**Ryzyka top 5:** mierzy-ale-nie-zmienia; scoring na niezwalidowanej skali; kruchość gałęzi z żywą autoryzacją; dwie prawdy o tym samym kliencie; brak kontrahenta i daty ⇒ „działa, ale niedokończony".

---

## 3. Porównanie predykcji z rzeczywistością

| ID | p | Werdykt | Rzeczywistość (dowód) |
|---|---|---|---|
| bt-01 statyczny dashboard client-side, bez backendu | 0.72 | **HIT, ale rozstrzygnięty przed T0 — nie liczę do fit** | `index3.html` 5 761 linii, cały stan w localStorage (~150 kluczy z 3 generacji), zero backendu. Ale ta architektura istniała od lutego; audyt: „Porzucone słusznie: SaaS/productization" (Council verdict, 08.04) |
| bt-02 dane finansowe = okresowy zaciąg, snapshot z datą, nie live | 0.62 | **HIT** | `fotra_infakt_sync` = seed v4 z 10.07 (58 FV, 540 149 zł); w dniu audytu 28 dni stęchlizny. Sprostowanie mechanizmu: dostęp BYŁ programowy (inFakt MCP działa), ale statyczny HTML nie może wołać MCP — kanał okazał się „sesja → localStorage", nie „eksport → skrypt" |
| bt-03 scoring potencjału bez kalibracji na historii | 0.58 | **PARTIAL — trafiony wniosek, zła przyczyna** | Scoring istnieje (`fotra-potential-map.js`, ranking luka × skalowalność × jakość relacji, MACS 8 wymiarów), zero back-testu wag. ALE realna awaria jest wcześniejsza: **`potential: 0` na wszystkich kartach** (`fotra-decision.js`), kategoria „🧩 Wyceń potencjał" nigdy nieuzupełniona. Scoring nie zdążył być źle skalibrowany — zabrakło mu wejścia |
| bt-04 gałąź Gmail najbardziej zawodna, incydent autoryzacji, >2 tyg. martwa | 0.55 | **HIT (mocniejszy niż claim)** | `js/fotra-mail-signals.js`: `generated: null`, `threads: []` — audyt: „sekcja martwa od urodzenia". Do tego udokumentowany re-auth Gmail MCP (07.2026) i seria 401 crona figma-brief-push (27.05). Sprostowanie mechanizmu: nie „token wygasł w locie", tylko **OAuth strukturalnie nie działa headless** — `docs/GMAIL-SWEEP.md`: „Gmail MCP wymaga OAuth — nie działa w cronie" |
| bt-05 brak udokumentowanej decyzji dywersyfikacyjnej wobec Benefit 49% | 0.50 | **HIT** | Audyt: domykanie pętli **2/10**, radar „CZEKA NA CIEBIE" to „czysty HTML bez ani jednego listenera"; postulat progu koncentracji (>40%) wisi niewdrożony od kwietnia; `fotra-potential-map.js` nie ma ani jednego zapisu do decision logu (grep = 0), choć `fotra-decision-log.js` (521 linii) istnieje dwa moduły dalej |
| bt-06 zakres wyjdzie poza trzy obszary | 0.45 | **HIT, ale w dużej części rozstrzygnięty przed T0 — nie liczę do fit** | 12 tabów (Daily, Vault, CRM, Mapa, System, Manifest, Settings + „Więcej": Delegation, ROI, Projects, AI Skills, Krypto). Historia: index2 = 15 tabów, index3 w maju = 4, dziś 12 — audyt nazywa to „nawrót tab creep". Rozrost jest realny i trwa, ale nie zaczął się po T0 |
| bt-07 produktyzacja się nie zmaterializuje | 0.35 | **PARTIAL — wynik trafny, uzasadnienie falsyfikowane** | Produkt/pokaz/odbiorca: zero (audyt: „Nic z tego nie powstało"). ALE „wycena" powstała **przed T0**: `FOTRA_PRODUCTIZATION.md` (08.04) ma pricing $39/$79 i model 500 users → 1,2M PLN/rok, a `FOTRA_INDEX3_PLAN.html` wycenia prace na 76 950 PLN. Kluczowe: to nie był dryf „intencji bez nośnika" (uzasadnienie Routera), tylko **świadoma decyzja kill** (Council verdict: „nie buduj SaaS, skup się na consulting") |

**Fit predykcji (po odjęciu rozstrzygniętych przed T0):** liczone bt-02, bt-03, bt-04, bt-05, bt-07 → **3 pełne HIT-y, 2 PARTIAL, 0 pudeł**. Uczciwie: to 5 predykcji, minimum protokołu (4) ledwo spełnione po odsianiu.

---

## 4. Accuracy mechanism selection

**Pełne trafienia (2/6):**
- `mech:deterministic-spine` — **wzorcowe**. Cały panel to reguły bez LLM w ścieżce krytycznej; jedyny moduł zależny od modelu (`fotra-ai-consultant.js`) audyt opisuje jako „od kwietnia framework czekający na API key" — czyli martwy. Karta przewidziała nie tylko wybór, ale i to, co umrze.
- `mech:session-to-sop` — **potwierdzone trzykrotnie**: `docs/INSTRUKCJA-CHAT-INFAKT.md`, `docs/GMAIL-SWEEP.md`, `~/.claude/scheduled-tasks/r352-cko-daily/SKILL.md`. Bramka B5 („świeża sesja odświeża dane bez pytań") jest de facto wdrożona.

**Częściowe (4/6):**
- `mech:machine-narrows-human-picks` — zawężenie zbudowane (kwadranty Skaluj/Utrzymuj/Rozwijaj/Obserwuj, ranking priorytetów), **akt rozstrzygnięcia nie**. Ostrzeżenie Routera („zawężenie bez aktu rozstrzygnięcia = mechanizm niedokończony") trafiło idealnie — i zostało zignorowane przez rzeczywistość, bo nie było bramki z zębami.
- `mech:single-source-compiler` — **mechanizm trafiony, warunek wejścia falsyfikowany**. Router kazał zdegradować kompilator, jeśli dane są zamrożone. Dane SĄ zamrożone — a kompilator okazał się największą niezaspokojoną potrzebą: przychód renderowany w ~6 miejscach, dwa niezależne ręczne źródła prawdy (Revenue Panel vs Vault), a topowa rekomendacja audytu to „**R352_FIN — jedno źródło prawdy o pieniądzach**". Gdyby ktoś wykonał bramkę B1 zgodnie z instrukcją, popełniłby najdroższy błąd projektu.
- `mech:negative-knowledge-ledger` — potrzeba potwierdzona, **realizacja falsyfikuje obietnicę karty**: wiedza negatywna istnieje, ale rozsypana po auto-memory i 92-KB audycie, nie w repo projektu. Efekt: ta sama lekcja („OAuth nie przechodzi przez cron") odkryta co najmniej dwa razy — 27.05 (figma-brief-push, seria 401) i 07.08 (GMAIL-SWEEP). Ledger, który nie mieszka przy kodzie, nie pełni funkcji ledgera.
- `mech:dated-commitment-gates` — **połowa karty potwierdzona, połowa obalona**. Potwierdzone: „reguła bez enforcementu w kodzie umiera" — audyt formułuje to niezależnie i dosłownie: *Dev Time Budget przetrwał, bo jest kodem; „max 7 tabów" umarło, bo było zdaniem w HTML-u* (reguła złamana 8× w 3 miesiące). Obalone: teza Routera, że przy n=1 bez kontrahenta bramka woli nie ma szans — bilans wdrożeń pokazuje **Fala 1 ~100%, Fala 2 ~75% vs Faza 2 ~25%, Faza 3 0%**, a różnicą były kryteria zamknięcia i horyzont, nie obecność kontrahenta.

**Miss selekcji (użyte i nośne, a NIE rekomendowane):**
- `mech:agent-as-runtime` — **najcięższy błąd doboru**. Router użył tej karty wyłącznie jako źródła ryzyka, a to jest realny kręgosłup projektu: wzorzec file-injection `window.*` (`trello-sync.js` → `window.TRELLO_QUESTS`, `js/fotra-kg-data.js` → `window.R352_KG`, `js/fotra-mail-signals.js` → `window.R352_MAIL`) plus codzienny task `r352-cko-daily`. Audyt: „to jest kręgosłup ultratoola… 80% roboty to dopięcie go, nie budowa czegoś nowego".
- `mech:incident-to-guard` — nierekomendowany i nieodrzucony (pojawia się tylko w cytacie ryzyka #4). Projekt wyprodukował podręcznikowy zestaw incydentów bez guardów: rozjazd kluczy backupu (`fotra_backup_meta` vs `fotra_last_backup` — baner ostrzegawczy nigdy nie gaśnie), drugi `window.onerror` w `js/fotra-core.js:64` nadpisujący error boundary (przez co błąd `fotra-dashboard.js:4092` wisiał miesiącami), seed kalendarza z 09.05 renderujący pusty tydzień bez ostrzeżenia. Backtest `briefsync` już orzekł, że deterministic-spine × incident-to-guard to para obowiązkowa dla multi-source — Router jej nie zastosował.

**Odrzucenia — kontrola:** `seo-aeo-foundation`, `proof-first-demo-pitch`, `format-dictionary` odrzucone słusznie. `competitive-benchmarking` odrzucony z odroczeniem „do ewentualnej produktyzacji" — i dokładnie tam się pojawił (skan Bonsai/HoneyBook/Dubsado/Plutio/Moxie w `FOTRA_PRODUCTIZATION.md` dał tezę „MACS to moat"); decyzja poprawna. **`sandbox-promotion` odrzucony błędnie w uzasadnieniu**: Router argumentował „nie ma klienta ani cudzego zasobu, więc granica sandbox/produkcja to narzut". Tymczasem zasób produkcyjny istnieje i jest nieodtwarzalny — cały CRM z danymi 540 149 zł żyje w localStorage jednej przeglądarki, backup nie działa, a repo ma **1 commit w 5,5 miesiąca i 58 nieśledzonych plików**. Audyt: „jedno nadpisanie przez sesję = utrata bez rollbacku".

---

## 5. Dziesięć sekcji CEO

**1. Accuracy Routera.** Ryzyka: 4/5 pełnych trafień (mierzy-ale-nie-zmienia, kruchość autoryzacji, dwie prawdy, zatrzymanie w „działa, ale niedokończony"), 1/5 częściowe (scoring — trafiona konsekwencja, zła przyczyna). Predykcje-sygnał po odsianiu anachronizmów: 3 HIT / 2 PARTIAL / 0 miss. Największa wada nie jest w trafności, tylko w **kalibracji T0** (sekcja 0) i w tym, że najcięższy element architektury nie został w ogóle nazwany.

**2. Accuracy mechanism selection.** 2 pełne / 4 częściowe / 0 szkodliwych z rekomendowanych; 2 missy (`agent-as-runtime`, `incident-to-guard`); 1 błędne uzasadnienie odrzucenia (`sandbox-promotion`). Fit ≈ 55–60% — najsłabszy wynik na tle backtestu `briefsync` (80–90%), i to na projekcie o najbogatszym materiale dowodowym.

**3. Największe błędy.** (a) Warunek „dane żywe" w `single-source-compiler` kazałby zrezygnować z mechanizmu, który w rzeczywistości był potrzebą #1. (b) Pominięcie `agent-as-runtime` — Router opisał ryzyko wzorca, nie rozpoznając, że to wzorzec nośny. (c) Anachroniczny pakiet T0 zawyżył trafność trzech predykcji. (d) Nieuwzględnienie ryzyka nieodtwarzalności stanu (brak wersjonowania + zepsuty backup) w top-5 — obiektywnie najgroźniejsze ryzyko projektu.

**4. Największe sukcesy.** (a) `deterministic-spine` przewidział zarówno rdzeń, jak i to, który moduł umrze (AI Consultant „czeka na API key"). (b) Ryzyko #1 („narzędzie mierzy, ale nie zmienia zachowania") zostało niezależnie potwierdzone werdyktem audytu: *magazyn widoków, nie kokpit decyzji*. (c) Teza „bramka bez automatycznej konsekwencji w kodzie nie jest bramką" znalazła twardy dowód eksperymentalny w parze Dev Time Budget (kod, przeżył) vs „max 7 tabów" (zdanie, złamane 8×). (d) `session-to-sop` — trafienie bezdyskusyjne, mechanizm realnie utrzymuje projekt przy życiu.

**5. Nowe mechanizmy (hipotezy).** `mech:session-injected-data-file`, `mech:self-feeding-data-filter`, `mech:freshness-contract`, `mech:attention-budget-gate`, `mech:audit-to-closure-gate` — opisane w sekcji 8.

**6. Mechanizmy do usunięcia.** Żadnego. Do przecięcia/zawężenia: warunek wejścia `single-source-compiler`; zakres wyzwalacza `sandbox-promotion`; failure_condition `numeric-gates` (patrz Evidence E4).

**7. Confidence Changes (PROPOZYCJA — zapisu dokonuje sesja główna).**
- `mech:deterministic-spine`: +1 evidence typu postmortem (retro-postmortem, wynik rzeczywisty). Uzasadnienie: pełne potwierdzenie w projekcie o innej klasie niż dotychczasowe evidence (narzędzie wewnętrzne, nie dashboard danych rynkowych).
- `mech:session-to-sop`: +1 evidence typu postmortem. Trzy niezależne SOP-y w jednym projekcie.
- `mech:agent-as-runtime`: +1 evidence typu postmortem **pozytywne** (dotąd karta figurowała w Routerze głównie jako źródło failure_condition) + nowy warunek: „OAuth interaktywny nie przechodzi przez runtime bezobsługowy — gałąź z OAuth planować wyłącznie jako sesyjną".
- `mech:single-source-compiler`: **bez podbicia**, flaga `too-narrow` na warunku wejścia + korekta triggera (E1).
- `mech:negative-knowledge-ledger`: bez podbicia, flaga `too-broad` — karta nie rozróżnia „wiedza zapisana" od „wiedza zapisana tam, gdzie wykonawca jej szuka" (E3).
- `mech:dated-commitment-gates`: bez podbicia; korekta anti-contextu (E5) — teza „solo ⇒ bramka woli nie działa" falsyfikowana przez bilans Fal.
- `mech:numeric-gates`: bez podbicia, dopisanie wcześniejszego failure mode (E4).
- `mech:incident-to-guard`: bez zmiany confidence; wpis do reguł Routera (multi-source ⇒ obowiązkowa para z deterministic-spine) — potwierdzenie reguły z bt `briefsync`.

**8. Nowe hipotezy.** Patrz sekcja 8 poniżej (5 hipotez + 2 reguły Routera).

**9. Czego Genome nie wiedział w T0.**
- Że projekt ma 5,5-miesięczną historię i **12 dokumentów planistycznych z wdrożeniem 30–60%** — czyli że główną chorobą nie jest brak diagnozy, tylko brak domknięcia diagnozy.
- Że **AI-dev wyzerował koszt budowy i tym samym skasował jedyny działający hamulec zakresu** („koszt godzinowy zniknął, więc stary argument 900 PLN/h opportunity cost przestał hamować feature creep"). To ma konsekwencje dla całego portfela r352, nie tylko dla FOTRA.
- Że w tym profilu **przeżywa wyłącznie to, czego dane wchodzą same**, a wszystko wymagające ręcznej pielęgnacji umiera w tym samym cyklu (Habits, Journal, OKR, Energy Widget, Strategic Tracker, AI Consultant).
- Że **cicha nieprawda jest droższa od awarii**: kalendarz na seedzie z 09.05 renderował pusty tydzień jako fakt, inFakt świecił zielono przy 28 dniach.
- Że moduł może żyć na zbiorze pustym: zakładka Delegation, **3 225 linii**, działa na rolach CRM, których nie ma (jedyna realna podwykonawczyni — Ada — nie istnieje w defaultach).
- Że drugi globalny `window.onerror` potrafi ukryć błąd na miesiące.

**10. Jak następny projekt byłby lepszy.** Każde wewnętrzne narzędzie danych dostaje z automatu: (a) `agent-as-runtime` w wariancie file-injection jako architekturę wejścia danych, nie jako ryzyko; (b) kontrakt świeżości per źródło (`generated` + próg + widoczna degradacja) zamiast bramki „data-stamp" opisanej w prozie; (c) filtr „dane wchodzą same albo funkcji nie ma"; (d) bramkę wersjonowania stanu nieodtwarzalnego (commit/backup jako warunek uruchomienia, nie jako higiena); (e) budżet uwagi zamiast budżetu godzin; (f) zakaz nowego audytu przed domknięciem poprzedniego.

---

## 6. Ryzyka — bilans

**Trafione:** mierzy-ale-nie-zmienia (audyt: 2/10 domykanie pętli); kruchość gałęzi z żywą autoryzacją (R352_MAIL martwy, cron OAuth 401); dwie prawdy o tym samym obiekcie (dwa systemy prawdy o przychodzie, przychód w 6 miejscach, rozjazd kluczy backupu); zatrzymanie w stanie „działa, ale niedokończony" (Faza 3 = 0%).
**Częściowo:** scoring — trafiona bezużyteczność, chybiona przyczyna (puste wejścia, nie złe wagi).
**Pominięte:** (1) nieodtwarzalność stanu (1 commit / 5,5 mies., 58 untracked, backup nigdy nieuruchomiony, cały biznes w localStorage jednej przeglądarki) — obiektywnie ryzyko #1; (2) cicha nieprawda źródeł renderowana jako treść; (3) ghost-feature na pustym zbiorze danych; (4) inflacja zakresu napędzana zerowym kosztem budowy w erze AI-dev.

---

## 7. Evidence (do zapisu w kartach + Ledger — propozycja)

- **E1** {observation: warunek „tylko dla danych żywych" w `single-source-compiler` odcina mechanizm dokładnie tam, gdzie jest najpotrzebniejszy; proof: `AUDYT-ULTRATOOL-2026-08-07.md` sekcje „Dwa równoległe systemy prawdy o przychodzie" i „Duplikacja informacji przychodowej w 6 miejscach" + rekomendacja M4 „R352_FIN — jedno źródło prawdy o pieniądzach" (07.08.2026), przy `fotra_infakt_sync` zamrożonym od 10.07; impact: Router zdegradowałby mechanizm będący potrzebą #1 projektu; proposed_change: zamienić warunek „dane żywe" na „ta sama wielkość renderowana w ≥2 widokach" — świeżość jest ortogonalna, zamrożony snapshot z datą też wymaga jednego źródła; confidence_effect: bez podbicia + flaga too-narrow; mechanisms: [`mech:single-source-compiler`]}
- **E2** {observation: nośną architekturą narzędzia wewnętrznego okazał się wzorzec „sesja/agent generuje plik danych `window.*`, statyczny front tylko czyta"; proof: `trello-sync.js` (Generated: 2026-08-01), `js/fotra-kg-data.js` (generated 2026-08-07), `js/fotra-mail-signals.js` (scaffold 07.08), task `~/.claude/scheduled-tasks/r352-cko-daily`; audyt: „Wzorzec zwycięski: file-injection przez sesje Claude (window.*)… to jest kręgosłup ultratoola"; impact: Router pominął mechanizm nośny, traktując kartę wyłącznie jako źródło ryzyka; proposed_change: dopisać do `agent-as-runtime` wariant pozytywny (file-injection: pole `generated` + empty-state + badge staleness) albo wydzielić `mech:session-injected-data-file`; confidence_effect: +postmortem (pozytywny) dla agent-as-runtime; mechanisms: [`mech:agent-as-runtime`]}
- **E3** {observation: ledger wiedzy negatywnej przechowywany poza repo projektu nie zapobiega powtórzeniu błędu; proof: lekcja „OAuth nie działa w cronie" odkryta 27.05.2026 (figma-brief-push, seria 401 w `_scheduled-logs`) i ponownie 07.08.2026 (`docs/GMAIL-SWEEP.md`: „Gmail MCP wymaga OAuth — nie działa w cronie"); impact: karta obiecuje oszczędność, której nie dowozi, gdy zapis trafia do auto-memory zamiast do repo; proposed_change: dopisać warunek wykonania — ledger mieszka w repo projektu i jest czytany przez SOP odświeżania; confidence_effect: bez podbicia + flaga too-broad; mechanisms: [`mech:negative-knowledge-ledger`, `mech:session-to-sop`]}
- **E4** {observation: wcześniejszy failure mode bramki liczbowej niż „niezwalidowana skala" — gate, którego wejście wymaga ręcznego uzupełnienia, nigdy nie dostaje danych; proof: `js/modules/fotra-decision.js` → `potential: 0` na wszystkich kartach, kategoria „🧩 Wyceń potencjał" (memory 07.2026: „potencjały roczne — WSZYSTKIE karty mają potential=0"); ranking `fotra-potential-map.js` liczy lukę na zerze; impact: cały mechanizm zawężania dostaje fałszywe wejście, zanim ktokolwiek zapyta o kalibrację wag; proposed_change: failure_condition w `numeric-gates`: „każde wejście gate'u wymagające ręcznego wypełnienia = gate martwy; wejścia wyłącznie z danych, które wchodzą same"; confidence_effect: bez podbicia; mechanisms: [`mech:numeric-gates`, `mech:machine-narrows-human-picks`]}
- **E5** {observation: przy jednym decydencie bramka egzekwowana kodem przeżywa, bramka zapisana prozą jest łamana seryjnie — ale bramka „fala z kryterium zamknięcia" też działa bez kontrahenta zewnętrznego; proof: audyt — Dev Time Budget (3h/tydzień, kod, `index3.html:2814`) wciąż działa, „Nie dodawaj nowych tabów" (zdanie w planie 17.04) złamane 8× w 3 miesiące (15 → 4 → 12 tabów); bilans wdrożeń: Fala 1 ~100%, Fala 2 ~75%, Faza 2 ~25%, Faza 3 0%; impact: anti-context karty („solo bez kontrahenta ⇒ bramka nie zadziała") jest za mocny i blokuje tanie, skuteczne narzędzie; proposed_change: rozdzielić w karcie dwa warianty — „bramka egzekwowana kodem" (zawsze) i „bramka-fala z kryterium zamknięcia" (działa też solo, jeśli horyzont ≤ kilka tygodni i kryterium jest binarne); confidence_effect: bez podbicia + korekta anti-contextu; mechanisms: [`mech:dated-commitment-gates`]}
- **E6** {observation: nieodtwarzalność stanu jest groźniejsza niż wszystkie ryzyka funkcjonalne razem, a `sandbox-promotion` wyklucza ten przypadek przez wyzwalacz oparty na własności zasobu; proof: `git log` w FOTRA = 1 commit `d51c2cc` (23.02.2026) przy codziennych edycjach, `git status` = 58 pozycji nieśledzonych, `fotra-backup.js` nie zapisuje klucza `fotra_last_backup` czytanego przez baner, CRM (540 149 zł danych) wyłącznie w localStorage; impact: Router uznał granicę sandbox/produkcja za „bezprzedmiotowy narzut"; proposed_change: przeformułować trigger z „zapis do produkcyjnego zasobu klienta" na „zapis do zasobu nieodtwarzalnego (cudzego LUB własnego bez kopii)"; confidence_effect: bez podbicia + flaga wrong-trigger; mechanisms: [`mech:sandbox-promotion`, `mech:incident-to-guard`]}
- **E7** {observation: w erze AI-dev koszt budowy przestał hamować zakres, więc mechanizmy limitujące muszą liczyć koszt uwagi użytkownika, nie koszt wytworzenia; proof: audyt, sekcja „Meta-ochrona działa": „koszt godzinowy zniknął, więc stary argument 900 PLN/h opportunity cost przestał hamować feature creep"; 12 tabów, ~2,4 MB parsowane przy każdym otwarciu, 3 225 linii Delegation na pustym zbiorze; impact: cała rodzina limitów zakresu w Genome opiera się na koszcie wytworzenia; proposed_change: nowa karta `mech:attention-budget-gate`; confidence_effect: n/d (hipoteza); mechanisms: [`mech:dated-commitment-gates`, `mech:machine-narrows-human-picks`]}

---

## 8. Nowe hipotezy (kandydaci na karty i reguły Routera)

1. **`mech:session-injected-data-file`** — statyczny front + plik danych generowany przez sesję/agenta (`window.X` z polem `generated`), empty-state gdy pusty, badge wieku gdy stary. Możliwy jako wariant `agent-as-runtime` zamiast osobnej karty — decyzja przy 3. evidence.
2. **`mech:self-feeding-data-filter`** — bramka doboru funkcji: wchodzi wyłącznie funkcja, której dane wchodzą same (z injectu lub z istniejących kluczy). Dowód klasy: wszystkie moduły z ręcznym karmieniem w FOTRA umarły tym samym cyklem.
3. **`mech:freshness-contract`** — każde źródło deklaruje `generated` + próg + **widoczną degradację widoku** po przekroczeniu; zakaz renderowania stęchłych danych jako neutralnych. Wyzwalacz: ≥2 źródła o różnych cyklach odświeżania.
4. **`mech:attention-budget-gate`** — twardy limit powierzchni (np. 6 zakładek), nowy element wypycha stary; koszt liczony w sekundach uwagi użytkownika dziennie, nie w godzinach developmentu (E7).
5. **`mech:audit-to-closure-gate`** — diagnoza wchodzi wyłącznie z listą pozycji o binarnym kryterium zamknięcia; nowy audyt zakazany przed domknięciem poprzedniego. Dowód klasy: ~12 dokumentów, wdrożenie 30–60%, „nowy audyt zamiast domknięcia starego".

**Reguły do ROUTER.md:**
- R1: „projekt multi-source ⇒ para `deterministic-spine` × `incident-to-guard` obowiązkowa" — reguła z bt `briefsync` nie została zastosowana w bt `fotra-panel`; wymaga statusu twardej bramki, nie sugestii.
- R2: „stan nieodtwarzalny (brak wersjonowania/backupu) ⇒ bramka przed pierwszą funkcją" — niezależnie od tego, czyj jest zasób.

---

## 9. Werdykt

Backtest o najniższym fit mechanizmów w dotychczasowej serii (≈55–60%) i największym ładunku poznawczym. Router poprawnie zdiagnozował **charakter** projektu (system decyzyjny, nie integracyjny) i główne ryzyko (mierzy, nie zmienia), ale przegapił **architekturę nośną** (file-injection/agent-as-runtime), zdegradowałby **potrzebę #1** (single-source-compiler przez zły warunek wejścia) i nie zauważył **ryzyka o najwyższej stawce** (nieodtwarzalny stan). Do tego pakiet T0 był anachroniczny, co zawyżyło pozorną trafność predykcji — poprawka metodologiczna dla projektów `pre-genome` jest pilniejsza niż jakakolwiek zmiana pojedynczej karty.
