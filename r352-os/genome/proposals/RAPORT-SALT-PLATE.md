# Warstwa strategiczna SALT/PLATE — propozycja (NIE w kanonie)

Data: 2026-08-09 · Autor: sesja A · Status: **PROPOSED — REQUIRES HUMAN APPROVAL**
Kanon nietknięty: `workflows/` w Genome pozostaje pusty, Ledger 204 linie `fc0228f9…`, zero `--apply`.

## ⚠️ KOLIZJA DWÓCH SESJI — do rozstrzygnięcia PRZED czymkolwiek innym

Dwie sesje niezależnie zbudowały tę samą warstwę w tym samym czasie:

| | sesja A (ta) | sesja B (równoległa) |
|---|---|---|
| karty frameworków | `genome/workflows/salt.md`, `plate.md` (id `wf:salt`, `wf:plate`) | `workflows/salt-strategic-diagnosis.md`, `plate-communication-plan.md` (id `wf:salt-strategic-diagnosis`, `wf:plate-communication-plan`) |
| mechanizm-claim + confidence | ✅ `mech:strategy-before-execution` (emerging, 2× backtest) | ❌ brak |
| Recordy backtestów (prowieniencja evidence) | ✅ 2 (`rec:backtests/betterworkplace-salt-plate`, `…marka-tlumacz-salt-gap`) | ❌ brak |
| lib rozpoznawania | `lib/strategy-frameworks.js` (169 linii) | `lib/framework-router.js` (104 linie) |
| testy | ✅ `test/run-strategy-tests.js` — 26 PASS | ❌ brak testów do framework-router |
| diff Routera (wymóg 5 cz. 1) | ❌ brak | ✅ `skills/mechanism-router/SKILL.md` |
| walidacja na kopii Genome | ✅ 0 błędów, 0 nowych ostrzeżeń | nieznana |

**Zbieżność, która jest sygnałem:** obie sesje niezależnie wybrały ten sam typ ontologiczny (`workflow`, nie `mechanism`) i ten sam status (`draft`). Dwie niezależne derywacje dały ten sam model — to najmocniejsza przesłanka, że model jest trafny.

**Ryzyko, jeśli wdroży się oba:** cztery karty zamiast dwóch, dwa różne zestawy ID dla tego samego frameworka, dwie kopie logiki rozpoznawania — czyli dokładnie to, przed czym chroni `prin:single-source-of-truth`. **Nie wolno zaaplikować obu.**

**Rekomendacja scalenia** (uzupełniają się, nie konkurują): karty + mechanizm-claim + Recordy + testy z sesji A, skill Routera z sesji B, jeden lib (do wyboru po diffie). ID: krótkie `wf:salt`/`wf:plate` (spójne z konwencją `mech:`/`prin:` — bez opisowych sufiksów).

## 1. Model ontologiczny (wymóg 1)

Sprawdzono ontologię przed decyzją. `workflow` (dir `workflows/`, prefiks `wf:`, statusy draft/active/deprecated) **istnieje i jest pusty**; w odróżnieniu od `mechanism` nie wymaga `implements`/`confidence`/`evidence`. SALT i PLATE to **uporządkowane procedury rozumowania produkujące artefakty**, nie falsyfikowalne twierdzenia przyczynowe — więc `workflow` jest typem właściwym.

Minimalny model = **3 obiekty** (nie 2, nie 5):
- `wf:salt` — procedura diagnostyczna (pełna treść domenowa)
- `wf:plate` — procedura planu komunikacji (pełna treść domenowa)
- `mech:strategy-before-execution` — **jedyne miejsce, gdzie żyje confidence i evidence**; falsyfikowalny claim „diagnoza przed produkcją zmienia decyzje zakresowe"

Dzięki temu procedura nie udaje dowodu, a dowód nie powiela procedury.

## 2. Kierunkowość (wymóg 2)

`mech:competitive-benchmarking` → **`wf:salt`** (`uses`) → **`wf:plate`** (`derives`) → egzekucja (`wf:plate related mech:format-dictionary`).
Zweryfikowane w skompilowanym grafie: 19 krawędzi warstwy, w tym `wf:plate --derives--> wf:salt` i `wf:salt --uses--> mech:competitive-benchmarking`.

## 3. Rozpoznawanie w Routerze (wymóg 3)

`assessStrategyNeed(brief)` → `SALT` | `PLATE` | `SALT_THEN_PLATE` | `NONE`, z powodami i bramkami. Zero LLM, zero zapisu.

## 4-5. Bramka wejścia PLATE (wymogi 4-5)

`PLATE_REQUIRES_FOUNDATION` ma trzy stany: **OK** (jest zatwierdzony fundament), **SEQUENCED** (SALT w tym samym przebiegu — kolejność wymuszona), **BLOCKED** (żądanie planu bez fundamentu i bez przesłanek do diagnozy → PLATE nie startuje). PLATE nie wymyśla strategii — to jest egzekwowane kodem, nie zaleceniem w prozie.

## 6. Kontrakt kart (wymóg 6)

Obie karty mają komplet 10 pól: `trigger`, `inputs`, `outputs`, `success_conditions`, `failure_conditions`, `anti_context`, `guards`, `provenance`, `next_use`, `postmortem_settlement`. Zweryfikowane testem 18.

## 7. Status dowodowy (wymóg 7)

`mech:strategy-before-execution`: **`emerging`**, evidence **wyłącznie typu `backtest`** (2 wpisy), zero `measurement`/`postmortem`, zero `validated`. Karta zawiera jawną sekcję „Status dowodowy — uczciwie": backtesty pokazują **wykonalność procedury i koszt jej pominięcia — NIE poprawę wyników**. W Recordzie `marka-tlumacz-salt-gap` zapisana jest alternatywna hipoteza, której nie odrzucono: *braki wychwycił benchmark, nie SALT — być może sam benchmark wystarcza*.

## 8. Jedno źródło prawdy (wymóg 8)

Treść frameworków żyje **wyłącznie w kartach**. `lib/strategy-frameworks.js` odpowiada tylko na pytanie „który framework i dlaczego" oraz pilnuje bramek — i eksponuje `content_source` wskazujące karty. Test 11 sprawdza maszynowo, że moduł **nie zawiera** treści warstw (S/A/L/T, P/L/A/T/E). Skill ma czytać karty, nie powielać.

## 9. Próby na sucho

| Przypadek | Werdykt | Bramki |
|---|---|---|
| BetterWorkplace / TeamBudget | `SALT_THEN_PLATE` | FOUNDATION:SEQUENCED, CAPACITY:LIMIT |
| Marka tłumacza (Trial #002) — tylko diagnoza | `SALT` | — |
| Kampania na świeżej strategii klienta | `PLATE` | FOUNDATION:OK |
| Migracja WP→statyczny (techniczny) | `NONE` | — (oba odrzucone) |

## 10. Co te frameworki realnie zmieniają (wymóg 10)

Nie „powstaje dokument". SALT zmienia: **zakres**, **odbiorcę komunikacji**, **oś pozycjonowania**, **cenę i model współpracy**, **decyzję GO/NO-GO**. PLATE zmienia: **kolejność produkcji**, **dobór kanałów**, **treść przekazu**, **definicję sukcesu**, **wielkość zamówienia**.
Egzekwowane funkcją `assessFrameworkPayoff()`: **0 zmienionych decyzji → `payoff: NONE`** z komunikatem „framework był kosztem bez zwrotu". Dokument bez konsekwencji jest w tym modelu porażką, nie sukcesem.

## Testy

`node r352-os/genome/proposals/test/run-strategy-tests.js` → **26 PASS · 0 FAIL** (10 rozpoznawania, 2 jednego źródła prawdy, 4 rozliczenia, 4 próby na sucho, 3 kontraktu kart, 3 adwersaryjne).

## Walidacja na kopii Genome

Sandbox = kopia kanonu + 5 kart propozycji. Baseline: 197 obiektów, 0 błędów, 244 ostrzeżenia. Z propozycją: **202 obiekty, 0 błędów, 244 ostrzeżenia** — zero nowych błędów, **zero nowych ostrzeżeń**.

## Ryzyka i świadome ograniczenia

1. **Kolizja dwóch sesji** — patrz góra. Największe ryzyko w tej dostawie.
2. **Zero żywych dowodów.** Cała warstwa stoi na dwóch backtestach. Do `validated` brakuje ≥1 żywego pomiaru z ≥2 projektów.
3. **Nieodrzucona alternatywa:** możliwe, że `mech:competitive-benchmarking` wystarcza i SALT jest nadmiarowy dla mniejszych projektów. Rozstrzygnie pierwsze żywe użycie.
4. **Ryzyko potwierdzenia:** rekonstrukcję BW robi ta sama firma, która framework stosowała.
5. **Klasyfikator jest tak dobry, jak wejście.** `assessStrategyNeed` operuje na faktach z briefu; jeśli sesja źle oceni `can_state_positioning`, werdykt będzie zły. Kod tego nie wyłapie.
6. **Brak skilla operacyjnego SALT/PLATE** — karty opisują procedurę, ale nie ma jeszcze skilla prowadzącego przez warstwy. Świadomie: najpierw model i bramki, potem interfejs.

## Werdykt (osobny dla tej warstwy)

**READY_FOR_HUMAN_REVIEW — z blokadą.** Model ontologiczny, bramki, testy i walidacja są kompletne, ale **wdrożenia nie wolno wykonać przed rozstrzygnięciem kolizji z sesją B**. Zaaplikowanie obu propozycji naruszyłoby `prin:single-source-of-truth` w tym samym akcie, w którym ten pryncypał wpisujemy do warstwy strategicznej.
