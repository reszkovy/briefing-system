# Zdarzenia Ledgera wymagane przy wdrożeniu

**Żadne z nich nie zostało utworzone.** Kolejność ma znaczenie: obiekt nie może powstać przed obiektem, do którego się odwołuje.

| # | `kind` | `on` | Wymagany payload / uwaga |
|---|---|---|---|
| 1 | `object.created` | `wf:salt` | pierwszy obiekt typu `workflow` w Genome |
| 2 | `object.created` | `wf:plate` | po `wf:salt` — karta odwołuje się do niego w `related` |
| 3 | `object.created` | `mech:strategy-before-execution` | `confidence.value: emerging` od startu |
| 4 | `object.created` | `rec:backtests/betterworkplace-salt-plate` | Record immutable |
| 5 | `object.created` | `rec:backtests/marka-tlumacz-salt-gap` | Record immutable |
| 6 | `evidence.added` | `mech:strategy-before-execution` | `evidence_id: ev:strategy-before-execution-bw` · `evidence_type: backtest` · **`direction: neutral`** · `project: proj:betterguide-hub` · `source: rec:backtests/betterworkplace-salt-plate` |
| 7 | `evidence.added` | `mech:strategy-before-execution` | `evidence_id: ev:strategy-before-execution-tlumacz` · `evidence_type: backtest` · **`direction: limits`** · `project: proj:marka-tlumacz` · `source: rec:backtests/marka-tlumacz-salt-gap` |
| 8 | `object.updated` | proces Routera | zmiana `ROUTER.md`: szablon 9 → 10 sekcji, bramki fazowe, zgoda podpisem |
| 9 | `decision.decided` | nowa `dec:…` | zatwierdzenie wdrożenia; `prepared_by` = sesja, `decided_by` = człowiek |

**Kierunki Evidence są jawne i celowo zaniżone.** Backtest BW jest `neutral` wobec claimu o poprawie wyniku — dowodzi wykonalności procedury, nie jej skuteczności. Trial tłumacza jest `limits` — wyznacza granicę claimu (koszt pominięcia warstwy w jednym projekcie małej skali), nie potwierdza go.

**Czego NIE ma na tej liście:** `ontology.changed`. Poprzednia wersja propozycji wymagała dopisania `requires` do `RELATION_KEYS`; ta wersja **nie zmienia słownika relacji**, bo krawędź `wf:plate --requires--> wf:salt` fałszowała alternatywę (fundamentem może być też istniejąca strategia). Zależność żyje w polu `requires_input` i w bramce `PLATE_REQUIRES_FOUNDATION`.

**Osobno — patrz `INCYDENT-KANON.md`:** przywrócenie prowieniencji migracji i zdarzenie korygujące na `rec:F0-SEED-FREEZE` to odrębna decyzja, niezwiązana z tym wdrożeniem.
