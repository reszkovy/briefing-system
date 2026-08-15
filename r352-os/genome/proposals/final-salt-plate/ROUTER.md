# r352 Mechanism Router

Warstwa decyzyjna między briefem a egzekucją. **Żaden projekt nie zaczyna się od projektowania — zaczyna się od diagnozy i doboru mechanizmów.**

## Proces

```
Brief → Research/Benchmark ──[researchGate]──→ SALT (projekt diagnozy)
      → ZATWIERDZENIE FUNDAMENTU ──[foundationGate + podpis fazy „foundation"]──→ PLATE
      → dobór mechanizmów → Doublecheck → Measurement Readiness
      → Project Contract ──[contractGate + PODPIS GO]──→ GO | REVISE | STOP
      → Realizacja → Outcome → Postmortem → Genome Delta
```

**Bramki są fazowe, nie jedna.** `contractGate()` obowiązuje DOPIERO przed GO. Wymaganie go przed SALT
było cyrkularne: kontrakt potrzebuje metryk i predykcji, a te powstają po diagnozie. Przed SALT
obowiązuje wyłącznie `researchGate()` — jakość źródeł, zero metryk, zero podpisu.

**Fundament dla PLATE to alternatywa.** Albo podpisany wynik SALT (zgoda fazy `foundation`), albo świeże
(≤12 mies.), sprawdzalne odniesienie do istniejącej strategii. Dlatego w grafie **nie ma** krawędzi
`wf:plate --requires--> wf:salt`: twierdziłaby, że SALT jest jedyną drogą, co jest nieprawdą. Zależność
żyje w polu `requires_input` karty PLATE i w bramce `PLATE_REQUIRES_FOUNDATION`, która zna obie drogi.

Kolejność jest kierunkowa i nieodwracalna. **Warstwę wolno pominąć wyłącznie z zapisanym powodem** — milczące przeskoczenie jest błędem procesu.

**Twarda bramka (invariant 11):** zaakceptowany raport Routera NIE wystarcza do startu. Przed realizacją
musi powstać **Project Contract** — zamrożony stan wiedzy sprzed poznania wyniku (`records/CONTRACT-TEMPLATE.md`).
Projekt bez `contract`, `outcome_owner`, `measurement_date` i decyzji `GO` nie może mieć statusu `active` — build to blokuje.
`REVISE` i `STOP` nie uruchamiają niczego. Agent przygotowuje kontrakt, **zatwierdza człowiek**;
ten sam podmiot nie może zrobić obu (`prepared_by ≠ decided_by`).

**Zgoda jest podpisem weryfikowanym przez warstwę zapisu.** Pole `reviewer: "przemek"` — i tak samo
`approval.status`, `approved_by`, `proposal_hash` — to dane, które sesja umie wpisać sama. Wiążący jest
podpis HMAC odciskiem **całego pakietu decyzyjnego**: claims, pełne rekordy researchu, routing z powodami
i bramkami, mechanizmy, frameworki, metryki, **pełny Project Contract (17 pól: klient, problem biznesowy,
start, zakres, NON-SCOPE, baseline, mechanizmy, frameworki, plan walidacji, właściciel wyniku, data pomiaru,
GO/REVISE/STOP, uzasadnienie, prepared_by, decided_by, wersja raportu, wersja kontraktu)**, predykcje,
wersja schematu, nonce i termin ważności.

`ingest.js` weryfikuje ten podpis **pod wspólną blokadą zapisu, przed pierwszym zapisem**, i pod tą samą
blokadą **atomowo zużywa nonce** w rejestrze `.approval-nonces.jsonl`. Powtórne użycie tego samego podpisu
jest odrzucane. Zmiana dowolnego pola pakietu po akceptacji unieważnia zgodę.

W praktyce: w sesji Claude wywołaj **`/mechanism-router <brief lub ścieżka do briefu>`**. Po zakończeniu projektu: **`/project-postmortem <projekt>`**.

## Warstwa strategiczna — SALT i PLATE

Dwie procedury z zależnością wejściową, którą świadomie NIE wyrażamy jako krawędź grafu (patrz wyżej):

- **`wf:salt`** — diagnoza: Sytuacja · Odbiorcy · Przewaga · Zmiana. Kończy się klasyfikacją dominującego typu problemu i 2–4 odkryciami ze statusem ZWALIDOWANE/HIPOTEZA.
- **`wf:plate`** — operacjonalizacja: Ścieżka · Blokady · Cele · Tematy · Wykonanie. Startuje **wyłącznie** na zatwierdzonym fundamencie, którym może być wynik `wf:salt` ALBO świeża istniejąca strategia.

Falsyfikowalny claim stojący za obiema — `mech:strategy-before-execution` (`emerging`, wyłącznie backtesty).
**Confidence i Evidence żyją tylko tam.** Karty workflow ich nie mają: build ich dla typu `workflow` nie waliduje, więc byłyby drugim, niekontrolowanym stanem wiedzy.

Decyzję `SALT | PLATE | BOTH | NONE | UNRESOLVED` podejmuje **wyłącznie** `routeFrameworks()` z `r352-os/genome/lib/strategy-frameworks.js`. Treść domenowa żyje **wyłącznie** w kartach `workflows/salt.md` i `workflows/plate.md`. Ani Router, ani skille nie odtwarzają tych reguł.

`UNRESOLVED` oznacza, że pole krytyczne briefu jest nierozstrzygnięte. **Brak wiedzy nie jest decyzją o braku potrzeby** — nierozstrzygnięte `needs_ongoing_communication` nie wyłącza PLATE po cichu, tylko blokuje kontrakt do czasu ustalenia.

## Szablon raportu routera (10 sekcji)

1. **Problem biznesowy** — jaki problem NAPRAWDĘ próbuje rozwiązać klient (nie: co zamówił).
2. **Typ organizacji** — skala, struktura decyzyjna, dojrzałość, kto jest realnym decydentem.
3. **Typ projektu** — klasa problemu (np. multi-location launch, brand system, lejek przedsprzedażowy, katalog+kampanie, automatyzacja produkcji).
4. **Research i benchmark** (`/research-benchmark`, `mech:competitive-benchmarking`) — rekordy spełniające kontrakt `validateResearchRecord()`, każdy z `direction` (supports | contradicts | neutral) i strukturalnym `decision_impact` → **delta-lista**: standardy do przyjęcia / świadome odstępstwa (zapisane) / słabości rynku = szanse. Rekord niespełniający kontraktu nie wchodzi do raportu.
5. **Warstwa strategiczna** — werdykt `routeFrameworks()` z powodami, bramkami i kolejnością. Tabela briefu strukturalnego (wszystkie pola, w tym `null`) wchodzi do raportu, żeby człowiek widział, na czym decyzja stanęła. Przy `SALT`/`BOTH` — SALT wykonywany PRZED doborem mechanizmów. Przy `PLATE` — wskazane sprawdzalne odniesienie do fundamentu. Przy `NONE` — powód odrzucenia.
6. **Rekomendowane mechanizmy (3–7)** — dla każdego: nazwa, confidence, uzasadnienie *dlaczego ten*, projekty-dowody z Evidence. Mechanizmy z Anti-context pasującym do klienta = jawnie odrzucone z powodem.
7. **Rekomendowani agenci** — których użyć (per AI Tasks z kart) i których NIE (z powodem).
8. **Workflow realizacji** — sklejony z Workflow wybranych mechanizmów + bramki jakości. **Bramka stała:** publiczny artefakt akwizycyjny nie jest „done" bez warstwy SEO/AEO (`mech:seo-aeo-foundation`).
9. **Ryzyka** — z `failure_conditions` wybranych mechanizmów i workflowów + specyfiki klienta.
10. **Hipotezy** — jakie NOWE mechanizmy warto przetestować na tym projekcie (projekt = laboratorium).

Po raporcie: `doublecheck()` → `measurementReadiness()` → `contractGate()` → podpis GO → `ingest.js` (weryfikacja HMAC i zużycie nonce pod blokadą). `REVISE` na którymkolwiek etapie zatrzymuje proces.

## Postmortem (Learning Engine v2) — analityk, nie writer

Postmortem **nie aktualizuje Genome samodzielnie**. Obowiązuje przepływ:

```
ANALYZE → PROPOSE → HUMAN APPROVAL → DETERMINISTIC INGEST → BUILD → AUDIT
```

`/project-postmortem` produkuje: analizę, Draft Postmortem (`status: proposed`, do `records/postmortems/<projekt>-<data>.md`), **Proposed Genome Delta** i **Proposed Event Bundle** (bez `id`, `ts`, `prev_hash`). Wszystko oznaczone `PROPOSED — REQUIRES HUMAN APPROVAL`. Zapis wykonuje `node ingest.js <pakiet.json>` dopiero po zatwierdzeniu przez człowieka.

Postmortem odpowiada na pięć pytań: (1) co przewidzieliśmy, (2) co się wydarzyło, (3) gdzie się pomyliliśmy, (4) czego nauczył się system, (5) gdzie ta lekcja zostanie użyta ponownie.

**Jeśli w projekcie uruchomiono SALT lub PLATE**, postmortem uruchamia dodatkowo `assessFrameworkPayoff()`: framework, po którym żadna decyzja się nie zmieniła, jest kosztem bez zwrotu i tak ma zostać zapisany (`payoff: NONE`). Pytania rozliczeniowe — w polach `postmortem_accounting` obu kart.

Rozstrzygnięcia obowiązkowe: predykcje `HIT | MISS | VOID | UNRESOLVED` wg pierwotnego kryterium (brak danych ≠ VOID) oraz **osobno** `causal_attribution` — sam HIT nigdy nie potwierdza mechanizmu. Router oceniany w 5 wymiarach (useful / wrong / noise / missed / anti-context). Maksymalnie **3 lekcje**; zero lekcji to poprawny wynik (`NO_GENOME_DELTA`).

Czego postmortem NIE robi: nie zmienia confidence ani statusów, nie tworzy aktywnych Rule/Guard/SOP/Mechanism, nie zamyka projektu, nie dopisuje do Ledgera, nie aktualizuje grafu ręcznie (graf kompiluje `build.js` z danych kanonicznych).

Progi: `validated` wymaga ≥3 Evidence z ≥2 różnych projektów, w tym ≥1 **żywego** `measurement`/`postmortem` — retro-`backtest`, `narrative` i `intention` progu nie spełniają. Słownik Evidence: `measurement | postmortem | narrative | backtest | intention`.

## Reguły twarde

- Raport routera POWSTAJE PRZED pierwszą linią projektu — także dla projektów wewnętrznych r352.
- Jeśli Genome nie ma mechanizmu dla problemu → to jest sygnał wartości: projekt dostaje sekcję Hipotezy i obowiązek zostawienia nowej karty.
- Router czyta zawsze aktualny `mechanisms/INDEX.md` i katalog `workflows/` — nie pamięć sesji.
- Logika decyzyjna żyje w `lib/`, treść domenowa w kartach. Warunek dopisany do skilla albo do tego pliku zamiast do modułu jest błędem architektury.
