---
name: mechanism-router
description: r352 Mechanism Router — warstwa decyzyjna między briefem a egzekucją. Użyj ZAWSZE przed rozpoczęciem nowego projektu/zlecenia klienckiego (nowy brief, "zróbmy stronę/lejek/brand dla X"). Produkuje raport doboru mechanizmów z Genome PRZED jakimkolwiek projektowaniem.
---

# r352 Mechanism Router

Dostajesz brief (tekst w argumencie, plik albo opis w rozmowie). **NIE zaczynaj projektować.** Najpierw raport routera.

Kolejność jest kierunkowa i nieodwracalna:

```
Brief → Research ─[researchGate]→ SALT draft ─[foundationGate + podpis]→ PLATE
      → mechanizmy → Doublecheck → Measurement Readiness
      → Project Contract ─[contractGate + podpis GO]→ GO | REVISE | STOP
```
Bramki są **fazowe**. `contractGate()` obowiązuje dopiero przed GO — przed SALT wystarcza `researchGate()`.
Nie żądaj metryk ani podpisu przed diagnozą: one z niej wynikają.

Warstwę wolno pominąć **wyłącznie z zapisanym powodem**. Milczące przeskoczenie jest błędem procesu.

## Kroki

1. Przeczytaj Genome:
   - `r352-os/genome/README.md` (standard) i `r352-os/genome/ROUTER.md` (proces),
   - `r352-os/genome/mechanisms/INDEX.md` — pełną listę mechanizmów z confidence,
   - `r352-os/genome/workflows/` — karty `wf:salt` i `wf:plate` (treść domenowa frameworków),
   - karty, które wstępnie pasują do problemu (po polach Trigger/Context).
2. Jeśli brief dotyczy istniejącego klienta — doczytaj jego pliki pamięci (indeks: MEMORY.md w katalogu auto-memory).
3. **Research i benchmark wg kontraktu.** Wywołaj `/research-benchmark`. Każdy rekord przechodzi przez
   `validateResearchRecord()` z `r352-os/genome/lib/research-contract.js`. Rekord niespełniający kontraktu
   **nie wchodzi do raportu** — nie jest „słabszym dowodem", tylko go nie ma. Każdy rekord ma `direction`
   (`supports | contradicts | neutral`) niezależnie od `decision_impact`: kierunek dowodowy i wpływ na decyzję
   to dwie różne rzeczy, a rekord `contradicts`, który zmienia zakres, jest dowodem uczciwości.
4. **Rozpoznanie warstwy strategicznej.** Zbuduj brief strukturalny (pola: `BRIEF_FIELDS`) i wywołaj
   `routeFrameworks()` z `r352-os/genome/lib/strategy-frameworks.js`. Zwraca `SALT | PLATE | BOTH | NONE |
   UNRESOLVED` z powodami, bramkami i kolejnością.
   **Nie odtwarzaj tych reguł w rozumowaniu ani w raporcie** — decyzja pochodzi z modułu, raport ją cytuje.
   Czego nie wiesz, wpisz jako `null`; pominięcie pola odrzuca cały brief. `UNRESOLVED` **nie jest zgodą na
   pominięcie frameworku** — jest poleceniem, żeby ustalić brakujące pole.
5. Wyprodukuj **raport routera w 10 sekcjach** wg szablonu z ROUTER.md. Sekcja 5 (Warstwa strategiczna)
   zawiera **tabelę briefu strukturalnego ze wszystkimi polami, łącznie z `null`** — człowiek ma widzieć,
   na czym decyzja stanęła. Przy `SALT`/`BOTH` wykonaj SALT przed doborem mechanizmów.
6. **Bramka Doublecheck.** Wywołaj `doublecheck()` na gotowym raporcie. `REVISE` blokuje przejście dalej.
   Bramka ocenia **jakość treści**; niezależność review to osobny stan (`independent_review`) i nie wolno
   go mylić z werdyktem.
7. **Przygotuj propozycję Project Contract** (`r352-os/genome/records/CONTRACT-TEMPLATE.md`) — sześć sekcji:
   Projekt (z jawnym NON-SCOPE) · Baseline (`n/d` gdzie danych brak, ZERO uzupełniania założeniami) ·
   Mechanizmy (rola + confidence w chwili startu + Evidence) · **3–5 predykcji** (każda: claim, p, kryterium,
   deadline, `measurement_source`, `resolution_owner`) · Plan walidacji · Decyzja startowa.
   Komplet pól sprawdza `validateProjectContract()` — 17 pól, w tym klient, problem biznesowy, start,
   `go_decision`, `go_rationale`, `prepared_by`, `decided_by`, wersja raportu i wersja kontraktu.
   Każdą metrykę przepuść przez `measurementReadiness()`.
8. **Złóż pakiet do zatwierdzenia.** `buildApprovalPackage()` zwraca dokładnie to, co człowiek podpisuje.
   Przekaż mu odcisk z `approvalFingerprint()`. **Nie masz funkcji generującej podpis i nie próbuj jej pisać** —
   klucz jest poza repo, a weryfikacja jest read-only.
9. **Wypisz braki**: czego nie da się dziś wypełnić i co trzeba zdobyć od klienta/właściciela.
10. **Zakończ bramką `GO / REVISE / STOP`** — i na tym się ZATRZYMAJ. Nie zaczynasz realizacji, nie zapisujesz
    nic do Genome. Zapis wykonuje `node r352-os/genome/ingest.js <pakiet.json>` PO decyzji człowieka.

## Bramki twarde

**Kontrakt startu.** Zamrożenie predykcji wymaga, żeby `contractGate()` zwrócił `can_freeze: true`. Warunki
żyją w jednym miejscu w `lib/research-contract.js` — nie powtarzaj ich tutaj ani w raporcie:
Doublecheck ≠ `REVISE` · Measurement Readiness ≠ `BLOCKED` · routing ≠ `UNRESOLVED`/`INVALID_BRIEF`/`blocked` ·
zweryfikowana zgoda człowieka.

**Zgoda obejmuje cały pakiet.** Podpis pokrywa claims, pełne rekordy researchu, routing, mechanizmy, frameworki,
metryki, Project Contract, predykcje, baseline, zakres i NON-SCOPE, wersję schematu, nonce i termin ważności.
Zmiana **czegokolwiek** z tego po akceptacji unieważnia zgodę i wywala `REVISE`. Nigdy nie pisz, że raport
został niezależnie zweryfikowany, jeśli `independent_review` ≠ `verified`.

**Invariant 11.** Projekt bez `contract`, `outcome_owner`, `measurement_date` i decyzji `GO` nie dostaje statusu
`active` — build to zablokuje. Predykcje po rejestracji są immutable (korekta = `prediction.voided` + nowe ID).
Ty przygotowujesz (`prepared_by`), zatwierdza Przemek (`decided_by`) — ten sam podmiot nie może zrobić obu.

**PLATE nie startuje bez fundamentu — ale fundament ma dwie drogi.** Legalne jest (a) świeże (≤12 mies.),
sprawdzalne odniesienie do zatwierdzonej strategii albo (b) podpisany wynik SALT. Bez żadnej z nich właściwym
werdyktem jest `BOTH` w kolejności SALT → PLATE, a przy braku przesłanek do SALT — `blocked`.
Nie pisz, że PLATE „wymaga SALT" — wymaga fundamentu.

**Podpis weryfikuje warstwa zapisu, nie Ty.** `ingest.js` sprawdza HMAC pełnego pakietu pod blokadą, przed
pierwszym zapisem, i zużywa nonce. Twoje `approval.status: "approved"` bez podpisu zostanie odrzucone.

## Reguły

- Nigdy nie rozwiązujemy tego samego problemu dwa razy — jeśli Genome zna rozwiązanie, raport MUSI je wskazać.
- Brak pasującego mechanizmu = sekcja Hipotezy + obowiązek nowej karty po projekcie.
- Raport zapisz też do `r352-os/genome/records/routing/<klient-projekt>-<data>.md` (kanoniczna ścieżka —
  NIE `genome/routing/`, ten katalog nie istnieje).
- Logika decyzyjna żyje w `r352-os/genome/lib/`, treść frameworków w `r352-os/genome/workflows/`. Jeśli kusi Cię,
  żeby dopisać tu warunek — to znak, że warunek należy do modułu.
