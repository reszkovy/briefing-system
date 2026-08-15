# r352 Mechanism Router

Warstwa decyzyjna między briefem a egzekucją. **Żaden projekt nie zaczyna się od projektowania — zaczyna się od doboru mechanizmów.**

## Proces

```
Brief → Analiza problemu → Klasyfikacja → BENCHMARK RYNKOWY → Dobór mechanizmów → Dobór agentów
     → Dobór workflow → Plan egzekucji → Projekt (+ warstwa SEO/AEO dla artefaktów publicznych)
     → Wyniki → Nowa wiedza → Aktualizacja Genome
```

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

## Szablon postmortem (Learning Engine)

Po projekcie odpowiedz i zapisz do `postmortems/<projekt>-<data>.md`:

- Które mechanizmy **zadziałały** (→ confidence w górę, nowy wpis w Evidence + Version)?
- Które **nie zadziałały** i dlaczego (→ dopisz failure_condition albo obniż confidence)?
- Które wymagają **poprawy** karty (trigger był mylący? inputs niekompletne?)?
- Czy któryś należy **usunąć/oznaczyć disproven**?
- Czy odkryto **nowy mechanizm** (→ nowa karta, choćby hypothesis)?
- Czy stworzyć **nowego agenta / SOP / benchmark / automatyzację**?
- Aktualizacja grafu: nowe krawędzie projekt↔mechanizmy.

## Reguły twarde

- Raport routera POWSTAJE PRZED pierwszą linią projektu — także dla projektów wewnętrznych r352.
- Jeśli Genome nie ma mechanizmu dla problemu → to jest sygnał wartości: projekt dostaje sekcję Hipotezy i obowiązek zostawienia nowej karty.
- Router czyta zawsze aktualny `mechanisms/INDEX.md` — nie pamięć sesji.
