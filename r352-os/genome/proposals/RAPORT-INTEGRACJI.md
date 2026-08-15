# Kontrolowana integracja wzorców zewnętrznych z Genome OS — raport końcowy

Data: 2026-08-09 · Status: **przed wdrożeniem, kanon nietknięty** · Wszystko żyje w `r352-os/genome/proposals/`

---

## 1. Co zostało przeczytane i jak

Trzy karty ze Skillta odczytane przez przeglądarkę (WebFetch zwracał pustą powłokę SPA). Treść traktowana **wyłącznie jako dane**. Zero instalacji, zero uruchomienia komend, zero skopiowanego kodu, zero obcego writera i obcej pamięci.

## 2. Provenance i licencje

| Skill | Repozytorium | Licencja |
|---|---|---|
| Analytics Tracking | nie podane | nie podana |
| Source Verification | nie podane | nie podana |
| Doublecheck | **sprzeczne**: `coreyhaines31/marketingskills` vs `github/awesome-copilot` | nie podana |

Żaden nie deklaruje licencji. Doublecheck podaje dwa różne repozytoria w jednej karcie — nie da się ustalić, co realnie zostałoby pobrane.

## 3. Wektory ryzyka

Wysokie: „the skill files will be downloaded and configured automatically" (instalacja modyfikuje `.claude/skills` bez podglądu) oraz „Copy prompt → paste into Claude Code" (nieprzejrzana instrukcja dla agenta). Średnie: sprzeczne provenance, brak licencji, niewidoczna komenda instalacyjna. Etykieta „TRUSTED SKILL 4.8 (26 reviews)" to sygnał marketplace'u, nie wynik audytu.

**Wniosek:** wartość leży w metodologii, nie w plikach. Metodologia jest odtworzona własnym kodem.

## 4. Decyzje: ADOPT 11 · ADAPT 5 · REJECT 11

Pełna macierz: [AUDYT-ZRODEL.md](AUDYT-ZRODEL.md). Najważniejsze odrzucenia:

- **scoring 0–100 z sześcioma wagami** → zastąpiony przez `READY / PARTIAL / BLOCKED`. Liczba sugeruje precyzję, której nie ma, i zachęca do optymalizowania wskaźnika zamiast pomiaru.
- **forensyka social media** (wiek konta, boty, reverse image search) → warsztat dziennikarski, nieadekwatny do decyzji projektowych.
- **tryb „active mode (persistent)"** → bramka ma być jawnym krokiem, nie tłem palącym tokeny przy każdej odpowiedzi.
- **wszystkie trzy instalacje.**

## 5. Co realnie wchodzi

| Plik | Rola |
|---|---|
| `proposals/lib/research-contract.js` | 3 deterministyczne walidatory, zero LLM, zero praw zapisu |
| `proposals/skills/research-benchmark/SKILL.md` | protokół researchu jako sekcja 4 Routera |
| `proposals/test/run-research-tests.js` | 17 testów kontraktowych |

Trzy mechanizmy: **kontrakt rekordu researchu** (14 pól, fakt oddzielony od interpretacji), **Measurement Readiness** (READY/PARTIAL/BLOCKED przed zamrożeniem predykcji), **Doublecheck** (3 warstwy → PASS / PASS_WITH_LIMITATIONS / REVISE; REVISE blokuje kontrakt).

## 6. Testy

```
17 PASS · 0 FAIL
```
W tym: brak rozjazdu `.claude/skills` ↔ `.agents/skills`, wtórne nie udaje pierwotnego, data nigdy zgadywana, źródło przeciwne wymusza ograniczenie, metryka bez decyzji blokuje, REVISE blokuje finalizację, **agent nie może zatwierdzić własnego raportu**, moduł nie zawiera żadnej operacji zapisu. Plus zielone zestawy istniejące (bramka 14/14, graf, writer).

## 7. Próba na sucho — trzy historyczne briefy

| | Stary Router | Po warstwie | Realna zmiana decyzji |
|---|---|---|---|
| **A. marka tłumacza** (strona) | 4 mechanizmy, benchmark jako lista linków, zero metryk, brak kontraktu | 4 rekordy poprawne, 3 z wpływem, 1 → `NO_DECISION_IMPACT`; **MEASUREMENT: BLOCKED** | **TAK.** „Wyświetlenia" jako metryka główna wylatuje — nie wspiera żadnej decyzji. Brak baseline zapisany jawnie zamiast wyjść po fakcie. Projekt nie mógłby zamrozić predykcji bez rozmowy o pomiarze |
| **B. Zdrofit „Ćwicz w zieleni"** (kampania) | 3 mechanizmy, zero benchmarku, zero metryk | 2 rekordy, oba z wpływem; **PARTIAL** | **CZĘŚCIOWO.** Kampania i tak by ruszyła, ale „FB zawyża zainteresowani" trafia do `known_limitations` — Evidence nie zostanie później przecenione |
| **C. briefsync** (automatyzacja) | 5 mechanizmów, benchmark odrzucony jako wewnętrzny, zero metryk | 1 rekord z wpływem; **PARTIAL** | **SŁABO.** Backoff i tak wynikał z `deterministic-spine`. Wartość: lead time dostał właściciela i termin zamiast zostać odczuciem |

Twierdzenia zakwestionowane przez Doublecheck: patrz §8 — pierwszy przebieg wykrył wadę w samej bramce, nie w projektach.

## 8. Co próba na sucho wykryła w NAS

Pierwszy przebieg dał `PASS_WITH_LIMITATIONS` w **3/3 przypadkach**, za każdym razem z tego samego powodu: „mechanizm rekomendowany bez powiązania z rekordem researchu (confirmation bias?)".

Sygnał odpalający zawsze nie niesie informacji. Reguła karała zachowanie **poprawne** — mechanizmy legalnie pochodzą z historii Genome (Evidence), a nie z benchmarku rynkowego. To był generator fałszywych alarmów, który po tygodniu nauczyłby mnie ignorować całą bramkę.

Zawężone do dwóch reguł, które dyskryminują:
- mechanizm bez oparcia **ani** w researchu **ani** w Evidence z Genome → `LIMIT`
- zebrano research, ale **żaden** rekord nie wpłynął na dobór mechanizmów → `REVISE` („research jako ozdoba, nie przesłanka")

Po poprawce: 3/3 `PASS`, a sztuczny przypadek research-ozdobnika prawidłowo dostaje `REVISE`. Testy dalej 17/17.

## 9. Koszt

Research: +15–25 min na projekt (14 pól × 3–5 rekordów) i wyraźnie więcej tokenów w sekcji 4 Routera — regułą anty-objętościową (`NO_DECISION_IMPACT` nie jest rozwijany) ograniczone do rekordów zmieniających decyzję. Measurement Readiness i Doublecheck: sekundy, zero LLM, koszt pomijalny. Realny koszt to **rozmowa o pomiarze przed startem**, której dziś nie ma — i to jest cena, nie strata.

## 10. Ryzyka, które zostają

Kontrakt sprawdza **kompletność i rozdzielność pól, nie prawdę** — poprawnie wypełniony rekord z wymyślonym cytatem przejdzie. Ochroną jest wymóg linku możliwego do sprawdzenia przez człowieka, nie walidator. Drugie: `PARTIAL` jest wygodnym stanem końcowym i może się stać domyślnym parkingiem zamiast etapem przejściowym — warto obserwować rozkład stanów po 5 projektach.

## 11. Czego to NIE zmienia

Zero zapisu do kanonicznego Genome. Zero migracji. Ledger nietknięty. `.claude/skills` bez zmian. Żaden zewnętrzny skill nie ma i nie dostanie praw zapisu. Bramka nie zatwierdza raportu, który sama analizuje.

## 12. Werdykt

**WDRAŻAĆ** — po poprawce z §8, która jest już w `proposals/`.

Uzasadnienie wprost z dyrektywy („jeżeli nowa warstwa nie zmienia decyzji ani jakości Evidence, uznaj ją za zbędną"): warstwa zmieniła decyzję w 1 przypadku na 3 twardo (A: metryka główna odrzucona, predykcja zablokowana), w 1 poprawiła jakość Evidence (B: ograniczenie instrumentacji zapisane przed pomiarem, nie po), w 1 dała mało (C). To wystarcza, bo koszt dwóch tańszych warstw jest bliski zera, a kosztowna jest tylko trzecia — research — i ta ma wbudowany hamulec objętościowy.

**Ale**: wdrożenie ma sens **z poprawką**, nie bez niej. Wersja z pierwszego przebiegu — odpalająca alarm w 100% przypadków — byłaby gorsza niż brak bramki, bo uczy ignorowania ostrzeżeń.
