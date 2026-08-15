# INCYDENT: mój test zapisał do kanonicznego Genome

Data wykrycia: 2026-08-09, w trakcie pierwszego dry-runu wdrożeniowego (krok 8 `deploy.sh`).
Zgłaszam sam, bo dry-run porównał stan kanonu przed i po pracy i nie zgodził się z deklaracją.

## Co się stało

Test `9c` w `run-migration-tests.js` sprawdzał, czy tryb symulacji migracji jest odrzucany na kanonicznym Genome:

```js
M.applyPlan(G, M.buildPlan(G), { simulation: true })   // G = REALNY r352-os/genome
```

Dopóki moduł `migrate.js` był ładowany z kanonu, jego wewnętrzny guard (porównanie korzenia z `__dirname`) faktycznie odrzucał wywołanie. **Gdy przełączyłem test na zamrożony fixture, moduł zaczął być ładowany z fixture'a — więc „kanonem" stał się dla niego fixture, a realny kanon przestał być chroniony.** `applyPlan` wykonał się na produkcyjnych danych.

Uruchomiło się to **dwukrotnie**, o 06:17:00 i 06:17:13 UTC.

## Zakres szkody — ustalony, nie oszacowany

| Artefakt | Stan przed | Stan po | Odwracalne? |
|---|---|---|---|
| `ledger/events-2026-08.jsonl` | 204 zdarzenia | **206** — dopisane `evt:2026-08-09-0226` i `-0227` | tylko przez zdarzenie korygujące (Ledger jest append-only) |
| `ledger/.archive/…pre-mig….jsonl` | 179 linii = **prawdziwy Ledger sprzed migracji** | **205 linii = Ledger POmigracyjny** — oryginał nadpisany | **TAK** — treść ocalała w fixture |
| `records/.snapshots/mig-…-records.json` | 32 Recordy z `content_before` | **`"records": []`** (219 B) — snapshot wyzerowany | **TAK** — 32 Recordy w stanie `before` ocalały jako pliki w fixture |
| `rec:F0-SEED-FREEZE` | `seed_event_count: 203`, tail sprzed | `seed_event_count: 205`, `seed_tail_hash: 3eafbaef9cb6e223` | do skorygowania po przywróceniu |

Oba dopisane zdarzenia to **migracje no-op**: `„0 Recordów, 0 mechanizmów, 0 korekt ID. Kolejność zdarzeń niezmieniona."` Nie zmieniły ani jednej karty wiedzy.

**Stan integralności po incydencie:** hash-chain spójny (0 zerwań, 206 zdarzeń), `build.js --check` → 197 obiektów, **0 błędów**, 244 ostrzeżenia — tyle samo co przed. Żadna karta mechanizmu, projektu ani Recordu nie została zmieniona.

## Dlaczego dane są odzyskiwalne

Zamrożony fixture `test/fixtures/pre-migration/` powstał **przed** incydentem, ze zniszczonych później źródeł:

- `fixtures/pre-migration/ledger/events-2026-08.jsonl` = **179 linii, sha256 `4806dd3d…`** — prawdziwy Ledger sprzed migracji, ten sam, który został nadpisany w `ledger/.archive/`,
- 32 Recordy w `fixtures/pre-migration/records/**` = zawartość `content_before` ze zniszczonego snapshotu.

Przypadkiem — fixture powstał, bo audyt zażądał testów migracji na zamrożonym stanie. Gdyby nie ten wymóg, oryginały przepadłyby bezpowrotnie.

## Czego NIE zrobiłem

Nie przywróciłem niczego. Ledger jest append-only, a katalogi `.archive`/`.snapshots` są jego prowieniencją — ich odtworzenie to zmiana kanonu, a mam zakaz. Nie usunąłem też dwóch zdarzeń: zgodnie z zasadą Genome błędny fakt koryguje się **nowym faktem**, nie kasowaniem.

## Propozycja naprawy (do decyzji właściciela, nie wykonana)

1. **Przywrócić prowieniencję z fixture'a** — skopiować `fixtures/pre-migration/ledger/events-2026-08.jsonl` z powrotem do `ledger/.archive/events-2026-08.pre-mig-mig-2026-08-evidence-contract-v1.jsonl` oraz odtworzyć snapshot 32 Recordów z plików fixture'a. To przywraca możliwość audytu migracji.
2. **Dopisać zdarzenie korygujące** `knowledge.corrected` na `rec:F0-SEED-FREEZE` z jawnym opisem: dwa zdarzenia `0226`/`0227` powstały w wyniku błędu testowego, są no-op, prowieniencja przywrócona z fixture'a.
3. **Zaktualizować `rec:F0-SEED-FREEZE`** — `seed_event_count` i `seed_tail_hash` do stanu po korekcie.
4. **Rozważyć, czy 2 zdarzenia no-op zostają.** Zostawienie ich jest zgodne z zasadą append-only i jest uczciwsze niż przepisanie historii; koszt to dwa mylące wpisy w Ledgerze, które zdarzenie korygujące wyjaśnia.

## Co już naprawione w propozycji

`migrate.js` dostał **twardy guard piaskownicy** (`assertSandbox`): `simulation: true` wolno uruchomić **wyłącznie** na korzeniu leżącym w systemowym katalogu tymczasowym. Porównanie z `__dirname` zostało uznane za niewystarczające — bo zależy od tego, skąd załadowano moduł, a to jest zmienna, na którą test ma wpływ.

Test regresji: **`9c0. GUARD PIASKOWNICY`** wywołuje `applyPlan` z korzeniem realnego repo i wymaga odmowy. Uruchomiony na kanonie: Ledger pozostał na 206 zdarzeniach.

## Wniosek dla systemu

Guard oparty na `__dirname` chroni przed pomyłką, nie przed konfiguracją. Warstwa zapisu musi weryfikować **właściwość celu** (czy to piaskownica), a nie **relację do samej siebie**. Ta sama zasada stoi za przeniesieniem weryfikacji HMAC do `ingest.js`: bramka ma żyć tam, gdzie następuje zapis, a nie tam, gdzie ktoś obiecuje, że go nie zrobi.
