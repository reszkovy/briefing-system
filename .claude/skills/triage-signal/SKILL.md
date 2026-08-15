---
name: triage-signal
description: Klasyfikuje surowy sygnał z inboxa Genome (mail, notatka, transcript, obserwacja, feedback) i decyduje, czy zasługuje na wejście do kanonu. Produkuje raport i ewentualnie propozycję do pending/ — NIGDY nie zapisuje do Genome. Użyj gdy Reszek mówi „przetriaguj to", „co z tym sygnałem", wskazuje plik z genome/inbox/ albo wkleja surową treść z prośbą o ocenę.
---

# /triage-signal — bramka wejściowa Genome

Dostajesz surowy sygnał: plik z `r352-os/genome/inbox/` albo tekst wklejony w rozmowie.
**Nie zapisujesz nic do kanonu.** Produkujesz raport, a przy werdykcie `PROPOSE` pakiet
w `pending/` z `signature: null`.

Ta warstwa istnieje po to, żeby zmniejszyć ciężar pamięci właściciela — nie żeby dołożyć
administracji. Jeśli Twój raport zwiększa liczbę rzeczy, o których musi pamiętać, to jest zły.

## Zakazy bezwzględne

- **Nie uruchamiasz `ingest.js`.** Ani z `--apply`, ani „żeby sprawdzić".
- **Nie dopisujesz do `signals/`, `records/`, `projects/` ani żadnego katalogu kanonu.**
- **Nie tworzysz Evidence.** Nigdy, z żadnego sygnału. Uzasadnienie niżej.
- **Nie zgadujesz projektu.** Brak pewności = `ASK_OWNER`.
- **Nie zapisujesz do `inbox/` treści prywatnych.** Patrz „Prywatność".

## Kroki

1. **Wczytaj sygnał.** Z pliku albo z tekstu. Jeśli to tekst wklejony w rozmowie, zaproponuj
   plik w `inbox/` wg `_SZABLON.md`, ale go nie twórz bez zgody.

2. **Sprawdź prywatność PRZED wszystkim innym.** Markery: zdrowie, finanse osobiste, rezydencja
   podatkowa, relacje, wątpliwości co do siebie, sprawy rodzinne, treści oznaczone jako poufne
   osobiście. Trafienie → **stop**. Wypisz szablon wskaźnika (`private_ref` + konsekwencja,
   `verbatim: null`) i nic więcej. Nie cytuj treści prywatnej w raporcie.

3. **Sklasyfikuj.** Jedna klasa główna:

   | klasa | gdzie ląduje w Genome |
   |---|---|
   | `fact` | Record w `records/proces/` albo claim w raporcie Routera |
   | `decision` | obiekt `dec:` + zdarzenie `decision.recorded` |
   | `prediction` | `prediction.registered` — wymaga 7 pól payloadu, w tym `resolution_owner` |
   | `lesson` | Record w `postmortems/` → propozycja zmiany karty mechanizmu |
   | `signal` | obiekt `sig:` (`signal.observed`) — TYLKO gdy naprawdę wymaga ZBADANIA |
   | `risk` | **brak domu w ontologii** — pole w karcie projektu albo radar operacyjny |
   | `open loop` | **brak domu w ontologii** — warstwa operacyjna, nie kanon |
   | `trash` | `.archive/` |

   Ontologia JEST rozszerzalna (`rule:rozszerzanie-ontologii`) — ale nie w triage'u i nie
   w locie. Jeśli sygnał nie ma domu, mówisz o tym wprost: nazywasz brakujący typ i wskazujesz,
   który istniejący go nie unosi. To jest wejście do bramki z reguły, nie zgoda na wymyślenie
   typu przy okazji jednego maila. Typ powstaje przez Decision, nie przez klasyfikację sygnału.

   `sig:` powstaje rzadko. Ontologia mówi wprost: *zwykłe powiadomienie NIE jest Signalem —
   jest Eventem*. Signal to rzecz, która wymaga zbadania i ma ścieżkę
   Signal → Hypothesis → Prediction → Evidence.

4. **Policz dystans wnioskowania.**

   ```
   0  cytat, verbatim
   1  parafraza bez dodanego znaczenia
   2  interpretacja — dokładam kontekst spoza sygnału
   3  spekulacja — twierdzę coś, czego w sygnale nie ma
   ```

   **`≥ 2` nie może dać klasy `fact` ani prowadzić do `PROPOSE`.** Wtedy `ASK_OWNER`.

5. **Skonfrontuj z `do_not_infer`.** Przejdź listę pozycja po pozycji i napisz przy każdej,
   czy Twój werdykt jej nie narusza. Naruszenie = `REJECT`.

6. **Ustal target i SPRAWDŹ, że istnieje.** Czytaj `dist/genome-data.js` (`window.GENOME_DATA
   .objects`). Projekt, którego tam nie ma, nie jest targetem. Konflikt między sygnałem
   a kartą (np. sygnał mówi „aktywny", karta ma `archived`) zgłaszasz jawnie i kończysz
   na `ASK_OWNER`.

7. **Sprawdź, czy Genome już to wie.** Przeszukaj Recordy, decyzje i zdarzenia. Jeśli wiedza
   istnieje — `ARCHIVE` z podaniem ID. To jest częsty i dobry wynik, nie porażka.

8. **Wydaj werdykt** i przy `PROPOSE` zbuduj pakiet w `pending/<slug>.json`:
   format `genome-approval/2-ed25519`, `status: "PENDING_OWNER_SIGNATURE"`, `signature: null`,
   `payload_hash` policzony przez `lib/approval.js`, komplet 17 pól Project Contract.
   Wzór: `pending/.applied/2026-08-10-dlugi-po-recovery.json`.

## Dlaczego Evidence nie powstaje z sygnału

Evidence wymaga `mechanism`, `project`, typu ze słownika, `source` i `direction`. Jego
**niezależność liczy się po ID projektu**. Sygnał daje się przypisać do złego projektu bez
żadnego ostrzeżenia, a skutkiem jest zawyżone `independent_sources` i podbite confidence
mechanizmu. To jest awaria, przed którą cały ten system ma chronić.

Evidence wchodzi wyłącznie przez Record backtestu albo postmortemu (`/project-postmortem`),
gdzie ma kontekst całego przebiegu i człowieka nad sobą.

Jeśli sygnał **wygląda** na Evidence, poprawnym wyjściem jest propozycja backtestu, nie skrót.

## Format raportu

```
SYGNAŁ        sig-in:2026-08-10-01 · gmail · 28.07 21:46
KLASA         fact · dystans wnioskowania 0
TARGET        proj:artoffnia-oferta ✓ istnieje
GENOME JUŻ WIE?  nie
PROPOZYCJA    Record records/proces/… + patch zakresu w karcie projektu
EVIDENCE      brak — zamówienie klienta nie jest dowodem na mechanizm
BRAKI         czy „plakat" był ustaleniem z callu czy tylko z maila
do_not_infer  „lista życzeń ≠ zaakceptowany zakres" — nie naruszone
WERDYKT       PROPOSE → pending/artoffnia-zakres-2026-08-10.json
```

Raport ma się mieścić na ekranie. Jeśli nie mieści, znaczy, że sygnał zawiera więcej niż jedną
rzecz — rozbij go na osobne sygnały zamiast pisać dłużej.

## Werdykty

`PROPOSE` — jest co zapisać, pakiet leci do `pending/`.
`ARCHIVE` — system już to wie albo to szum; plik do `.archive/`, podaj ID istniejącej wiedzy.
`ASK_OWNER` — brakuje decyzji, której nie wolno podjąć za właściciela. Zadaj JEDNO konkretne pytanie.
`REJECT` — sygnał narusza własne `do_not_infer` albo jest nie do zweryfikowania.

Po `PROPOSE` kończysz zdaniem: pakiet czeka na podpis, `ingest.js` uruchamia właściciel.
