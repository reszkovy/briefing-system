# Schemat integracji — warstwa Research + warstwa strategiczna

## Przepływ

```
BRIEF
  │
  ├─▶ /research-benchmark ──▶ validateResearchRecord()      [lib/research-contract.js]
  │        rekord niespełniający kontraktu NIE wchodzi do raportu
  │        rekord z changes:["none"] nie jest rozwijany
  │
  ├─▶ routeFrameworks(brief) ──▶ SALT | PLATE | BOTH | NONE  [lib/framework-router.js]
  │        │
  │        ├─ SALT ──▶ wf:salt-strategic-diagnosis
  │        │            S → klasyfikacja problemu (bramka uczciwości)
  │        │            A → odbiorca dziś vs docelowy + wartość kontraktu
  │        │            L → areny + przewagi strukturalne vs kopiowalne
  │        │            T → zmiana percepcji + zachowanie-dowód
  │        │            ⇒ 2–4 odkrycia ze statusem, założenia, alternatywy, ryzyka
  │        │                    │
  │        │              [G4 podpis akceptacji]
  │        │                    ▼
  │        └─ PLATE ─▶ wf:plate-communication-plan   (requires → SALT)
  │                     P ścieżka · L blokady z dowodem · A cele z metrykami
  │                     T tematy per odbiorca · E kalendarz + szablony
  │
  ├─▶ mechanizmy 3–7 z Genome
  │
  ├─▶ doublecheck(report) ──▶ PASS | PASS_WITH_LIMITATIONS | REVISE
  │        + osobno: independent_review = verified | unverified | unverifiable | invalid
  │
  ├─▶ measurementReadiness(metrics) ──▶ READY | PARTIAL | BLOCKED
  │
  └─▶ contractGate({doublecheck, measurement}) ──▶ can_freeze
           trzy warunki w JEDNYM miejscu:
             • Doublecheck ≠ REVISE
             • Measurement ≠ BLOCKED
             • independent_review === 'verified'
                    │
              GO / REVISE / STOP  ──▶  STOP. Zapis przez ingest.js po decyzji człowieka.
```

## Gdzie mieszka logika (zero duplikacji)

| Reguła | Jedyne miejsce | Kto ją cytuje |
|---|---|---|
| Kontrakt rekordu researchu | `lib/research-contract.js` → `validateResearchRecord` | skill `research-benchmark` (opisowo) |
| Gotowość pomiaru | `lib/research-contract.js` → `assessMetric` / `measurementReadiness` | skill `mechanism-router`, PLATE guard G2 |
| Adwersaryjność raportu | `lib/research-contract.js` → `doublecheck` | skill `mechanism-router` |
| Ślad akceptacji człowieka | `lib/research-contract.js` → `verifyHumanReview` | oba skille, karta SALT guard G4 |
| Trzy warunki zamrożenia | `lib/research-contract.js` → `contractGate` | skill `mechanism-router` |
| Kiedy SALT / PLATE / oba / żadne | `lib/framework-router.js` → `routeFrameworks` | skill `mechanism-router`, karty workflow |
| Treść domenowa SALT/PLATE | karty `workflows/*.md` | skill Routera (przez odczyt katalogu) |

Skille **wołają** moduły i **opisują** ich rolę. Nie odtwarzają warunków. Test **B8** pilnuje, żeby skille nie wskazywały ścieżek roboczych; reguła „logika żyje w `lib/`" jest zapisana w treści skilla Routera.

## Dlaczego Workflow, a nie Mechanism

Ontologia F0, A.1:

- **Mechanism** — „powtarzalny generator rezultatu (X powoduje Y, bo Z)"; nośnik confidence, wejście Routera, jeden `expected_outcome`.
- **Workflow** — „nazwana sekwencja kroków z bramkami, orkiestrująca mechanizmy w konkretnym procesie (np. F1–F5, audyt UX)"; relacje `uses → Mechanism[]`, `gated_by → Benchmark[]`.

SALT i PLATE to sekwencje z bramkami, orkiestrujące inne mechanizmy — druga definicja, dosłownie. Zapis jako `mechanism` wymagałby udawania pojedynczego `expected_outcome` i Evidence-per-użycie, których te obiekty nie mają. Katalog `workflows/` był pusty; SALT i PLATE są jego pierwszymi mieszkańcami, co jest samo w sobie sygnałem, że warstwa procesu nie była do tej pory reprezentowana.

## Status i confidence — dlaczego nie „active"

| Pole | Wartość | Powód |
|---|---|---|
| `status` | `draft` | Słownik typu Workflow to `draft \| active \| deprecated`. Wersja **wykonywalna przez Genome** (z triggerem, guardami, failure conditions, rozliczeniem w postmortemie) nie została jeszcze ani razu uruchomiona przez Router. Istniał deliverable HTML, nie proces w systemie. `active` po pierwszym żywym przebiegu. |
| `confidence.value` | `emerging` | Słownik confidence z kart mechanizmów; `validated` wymaga ≥3 Evidence, ≥2 projektów i ≥1 ŻYWEGO pomiaru/postmortemu — nic z tego nie zachodzi. |
| `evidence[].type` | `backtest` (2×) | Rekonstrukcja z artefaktów historycznych. `backtest` z definicji nie liczy się jako żywy dowód (`isLiveStrong` w build.js). Nie znamy wyniku sprzedażowego zmiany kategorii BW. |

To jest świadome zaniżenie: SALT/PLATE są realnie używane w r352-framework, więc `active` dałoby się obronić. Wybieram `draft`, bo status ma opisywać **obiekt w Genome**, a nie metodę w głowie właściciela. Właściciel może to nadpisać — to jest decyzja, nie fakt.

## Wymagana zmiana ontologii

Jedno słowo: `requires` w `RELATION_KEYS` (patrz `DIFF-build-relation-key.patch`). Zgodnie z A.0 zmiana ontologii wymaga zdarzenia `ontology.changed` przy wdrożeniu — **nie zostało utworzone**, Ledger nietknięty.
