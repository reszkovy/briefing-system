# r352 Mechanism Router

Warstwa decyzyjna między briefem a egzekucją. **Żaden projekt nie zaczyna się od projektowania — zaczyna się od doboru mechanizmów.**

## Proces

```
Brief → Research i BENCHMARK RYNKOWY → Router (raport 9 sekcji) → PROJECT CONTRACT → Predykcje
     → BRAMKA GO/REVISE/STOP (człowiek) → Realizacja → Outcome → Postmortem → Genome Delta
```

**Twarda bramka (invariant 11):** zaakceptowany raport Routera NIE wystarcza do startu. Przed realizacją
musi powstać **Project Contract** — zamrożony stan wiedzy sprzed poznania wyniku (kontrakt danych:
`records/CONTRACT-TEMPLATE.md`). Projekt bez `contract`, `outcome_owner`, `measurement_date` i decyzji
`GO` nie może mieć statusu `active` — build to blokuje. `REVISE` i `STOP` nie uruchamiają niczego.
Agent przygotowuje kontrakt, **zatwierdza człowiek**; ten sam podmiot nie może zrobić obu (`prepared_by ≠ decided_by`).

W praktyce: w sesji Claude wywołaj **`/mechanism-router <brief lub ścieżka do briefu>`** — sesja czyta Genome (INDEX + karty) i produkuje raport routera. Dopiero po akceptacji raportu ruszamy z egzekucją. Po zakończeniu projektu: **`/project-postmortem <projekt>`**.

## Szablon raportu routera (9 sekcji)

1. **Problem biznesowy** — jaki problem NAPRAWDĘ próbuje rozwiązać klient (nie: co zamówił).
2. **Typ organizacji** — skala, struktura decyzyjna, dojrzałość, kto jest realnym decydentem.
3. **Typ projektu** — klasa problemu (np. multi-location launch, brand system, lejek przedsprzedażowy, katalog+kampanie, automatyzacja produkcji).
4. **Benchmark rynkowy** (mech:competitive-benchmarking) — 3–5 realnych realizacji z niszy (konkurenci + adjacentne premium), ekstrakcja per stałe kryteria (struktura, zaufanie, dane, CTA, SEO/AEO, wyróżniki) → **delta-lista**: standardy do przyjęcia / świadome odstępstwa (zapisane) / słabości rynku = szanse.
5. **Rekomendowane mechanizmy (3–7)** — dla każdego: nazwa, confidence, uzasadnienie *dlaczego ten*, projekty-dowody z Evidence. Mechanizmy z Anti-context pasującym do klienta = jawnie odrzucone z powodem.
6. **Rekomendowani agenci** — których użyć (per AI Tasks z kart) i których NIE (z powodem).
7. **Workflow realizacji** — sklejony z Workflow wybranych mechanizmów + bramki jakości. **Bramka stała:** publiczny artefakt akwizycyjny nie jest "done" bez warstwy SEO/AEO (mech:seo-aeo-foundation — semantyka, JSON-LD, FAQ pod pytania frazowe).
8. **Ryzyka** — z failure_conditions wybranych mechanizmów + specyfiki klienta.
9. **Hipotezy** — jakie NOWE mechanizmy warto przetestować na tym projekcie (projekt = laboratorium).

## Postmortem (Learning Engine v2) — analityk, nie writer

Postmortem **nie aktualizuje Genome samodzielnie**. Obowiązuje przepływ:

```
ANALYZE → PROPOSE → HUMAN APPROVAL → DETERMINISTIC INGEST → BUILD → AUDIT
```

`/project-postmortem` produkuje: analizę, Draft Postmortem (`status: proposed`, do `records/postmortems/<projekt>-<data>.md`), **Proposed Genome Delta** i **Proposed Event Bundle** (bez `id`, `ts`, `prev_hash`). Wszystko oznaczone `PROPOSED — REQUIRES HUMAN APPROVAL`. Zapis wykonuje `node ingest.js <pakiet.json>` dopiero po zatwierdzeniu przez człowieka.

Postmortem odpowiada na pięć pytań: (1) co przewidzieliśmy, (2) co się wydarzyło, (3) gdzie się pomyliliśmy, (4) czego nauczył się system, (5) gdzie ta lekcja zostanie użyta ponownie.

Rozstrzygnięcia obowiązkowe: predykcje `HIT | MISS | VOID | UNRESOLVED` wg pierwotnego kryterium (brak danych ≠ VOID) oraz **osobno** `causal_attribution` — sam HIT nigdy nie potwierdza mechanizmu. Router oceniany w 5 wymiarach (useful / wrong / noise / missed / anti-context). Maksymalnie **3 lekcje**; zero lekcji to poprawny wynik (`NO_GENOME_DELTA`).

Czego postmortem NIE robi: nie zmienia confidence ani statusów, nie tworzy aktywnych Rule/Guard/SOP/Mechanism, nie zamyka projektu, nie dopisuje do Ledgera, nie aktualizuje grafu ręcznie (graf kompiluje `build.js` z danych kanonicznych).

Progi: `validated` wymaga ≥3 Evidence z ≥2 różnych projektów, w tym ≥1 **żywego** `measurement`/`postmortem` — retro-`backtest`, `narrative` i `intention` progu nie spełniają. Słownik Evidence: `measurement | postmortem | narrative | backtest | intention`.

## Reguły twarde

- Raport routera POWSTAJE PRZED pierwszą linią projektu — także dla projektów wewnętrznych r352.
- Jeśli Genome nie ma mechanizmu dla problemu → to jest sygnał wartości: projekt dostaje sekcję Hipotezy i obowiązek zostawienia nowej karty.
- Router czyta zawsze aktualny `mechanisms/INDEX.md` — nie pamięć sesji.
