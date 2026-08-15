# r352 Genome

**Rozdział odpowiedzialności silników** (od 08.08.2026): **Genome** przechowuje wiedzę (zasady, mechanizmy, dowody) · **Router** wybiera mechanizmy pod brief · **Decision Engine** rekomenduje (raporty CKO, priorytety, azymut) · **Learning Engine** uczy się z projektów (postmortemy → confidence) · **Execution Engine** realizuje (sesje Claude + podwykonawcy). Hierarchia wiedzy: **Principle → Mechanism → Workflow → Agent → Project** (zasady: PRINCIPLES.md, fundamenty: AKSJOMATY.md).

Organizacyjny genom r352. NIE baza wiedzy — sieć relacji między elementami, które czynią firmę inteligentniejszą z każdym projektem.

**Nadrzędna zasada:** nigdy nie projektujemy od zera i nigdy nie rozwiązujemy tego samego problemu dwa razy. Każdy projekt zaczyna się od Routera (dobór mechanizmów), kończy postmortem (aktualizacja Genome).

## Struktura

```
genome/
├── README.md            ← ten plik: zasady + standard karty
├── ROUTER.md            ← proces: brief → raport routera → egzekucja → postmortem
├── mechanisms/          ← karty mechanizmów (jedna karta = jeden plik)
│   └── INDEX.md         ← indeks z confidence i kategoriami
└── postmortems/         ← postmortemy projektów (learning engine)
```

Warstwa grafowa Genome żyje w `../knowledge-graph.json` + `FOTRA/js/fotra-kg-data.js` (zakładka System) — mechanizmy są węzłami połączonymi z projektami, klientami, komponentami i lekcjami.

## Standard karty mechanizmu

Każdy mechanizm w `mechanisms/` ma pełną kartę:

| Pole | Treść |
|---|---|
| **ID** | kebab-case, stały (np. `numeric-gates`) |
| **Nazwa** | angielska, 2–4 słowa, brandowalna |
| **Problem** | jaki problem rozwiązuje |
| **Trigger** | po czym poznać w briefie/rozmowie, że go użyć |
| **Context** | dla jakiego typu organizacji działa najlepiej |
| **Anti-context** | kiedy NIE stosować |
| **Inputs** | jakich informacji potrzebuje na wejściu |
| **Workflow** | przebieg krok po kroku |
| **AI Tasks** | co wykonuje AI |
| **Human Tasks** | co wymaga człowieka (Przemek / podwykonawca / klient) |
| **Expected Outcome** | rezultat, po którym poznajemy, że zadziałał |
| **Evidence** | projekty, na których potwierdzony |
| **Confidence** | proven (≥3 konteksty) / emerging (2) / hypothesis (1) |
| **Related** | powiązane mechanizmy |
| **Experiment** | zaprojektowany test na kliencie-laboratorium |
| **Version** | historia zmian karty (data + co się zmieniło) |

## Zasady utrzymania

1. **Kartę zmienia tylko dowód.** Confidence rośnie po potwierdzeniu w nowym kontekście, spada po porażce — obie rzeczy wpisujemy do Version.
2. **Postmortem jest obowiązkowy** po każdym projekcie (szablon w ROUTER.md). Bez wpisu do Genome projekt nie zwiększył wartości firmy — nawet jeśli klient zachwycony.
3. **Anty-wzorce są aktywami.** Mechanizm, który NIE działa (gated content), ma kartę z confidence `disproven` — żeby nikt nie zapłacił za tę lekcję drugi raz.
4. **Graf > foldery.** Każda karta linkuje projekty (Evidence) i mechanizmy (Related); graf w FOTRA/artefakcie jest wizualizacją tych relacji.
5. Klienci-laboratoria eksperymentów: Benefit/Zdrofit, Sonova/Geers, Archicom, BetterWorkplace/DailyFruits, FitStyle.
