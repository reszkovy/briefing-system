# PLAN MIGRACJI mig:2026-08-evidence-contract-v1

Wygenerowany z: `/Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/r352-os/genome`
Hash planu: `20a278113b32a0e0fce242f88aa832a8d099c5ecaf23f45a8880c99214c06663`

## 1. Ledger

- Zdarzeń: **204**
- Oryginał sha256: `fc0228f90d3c52ca7ff008cd72a881e90a4295d237f5a94dda27af04781f3494`
- **Zmiana ID: 0** (wyłącznie zdarzenia zduplikowane)
- **Przestawionych zdarzeń: 0**
- Hash-chain przeliczony od linii — (0 zdarzeń) — konsekwencja korekty ID, treść nietknięta

### Naruszenia chronologii — NIE naprawiane (defekt seeda, objęty kartą freeze)

- L40 `evt:2026-08-08-0040` ts 2026-08-08T19:00:00+02:00 < poprzedni 2026-08-08T19:57:00+02:00
- L109 `evt:2026-08-08-0056` ts 2026-08-08T12:54:11.509+00:00 < poprzedni 2026-08-09T03:01:00+02:00

## 2. Karta freeze

- `rec:F0-SEED-FREEZE` → `records/F0-SEED-FREEZE.md`
- Partycja: `events-2026-08.jsonl` · pierwsze 204 zdarzeń · tail hash `e612466d691856ff`
- Pokrywa 38 braków payloadu i 2 defektów chronologii

## 3. Recordy — attached_to (0)

| # | Record | → Project | wersja |
|---|---|---|---|

### Recordy programowe bez projektu (4)

- `rec:backtests/ANALIZA-KONCOWA` — brak projektu proj:ANALIZA-KONCOWA — dokument programowy
- `rec:backtests/LISTA` — brak projektu proj:LISTA — dokument programowy
- `rec:backtests/PROTOKOL` — brak projektu proj:PROTOKOL — dokument programowy
- `rec:backtests/TRANSZA1-SYNTEZA` — brak projektu proj:TRANSZA1-SYNTEZA — dokument programowy

## 4. Mechanizmy — Evidence (0 kart)

- narracja → narrative: **0**
- postmortem(źródło backtestowe) → backtest: **0**
- project uzupełniony: **0**
- independence_key nadany: **0**
- bez project (wieloprojektowe): **88**
- direction: **nie nadawany** (brak decyzji = brak pola)

| karta | wersja | n | projekty | typy |
|---|---|---|---|---|

## 5. Wymagana zgoda

Commit wymaga pliku zgody:

```json
{
  "migration_id": "mig:2026-08-evidence-contract-v1",
  "plan_hash": "20a278113b32a0e0fce242f88aa832a8d099c5ecaf23f45a8880c99214c06663",
  "approved_by": "<imię>",
  "approved_at": "<ISO8601>"
}
```

Agent nie może wygenerować tego pliku samodzielnie — hash musi zgadzać się z planem w chwili commitu.
