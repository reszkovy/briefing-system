---
id: "rec:CONTRACT-TEMPLATE"
type: "record"
title: "Project Contract — kontrakt danych i szablon"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["governance", "kontrakt"]
---

# Project Contract

Zamrożony stan wiedzy **sprzed poznania wyniku**. Powstaje po raporcie Routera, przed realizacją.
Bez niego projekt nie dostaje `GO` (invariant 11). Postmortem czyta ten dokument, nie rekonstruuje go z pamięci.

## Gdzie żyje

Kontrakt to **Record** (`rec:contracts/<projekt>-<data>`), nie nowy typ obiektu. Karta projektu wskazuje go polem `contract`.
Zero równoległej ontologii: Project · Record · Decision · Ledger events — wszystko istniejące.

## Kontrakt danych — karta projektu (frontmatter)

| Pole | Wymagane gdy | Znaczenie |
|---|---|---|
| `routing` | status `routed`+ | Record raportu Routera (`rec:routing/…`) |
| `contract` | status `active`/`closed` | Record kontraktu (`rec:contracts/…`) |
| `outcome_owner` | status `active`/`closed` | kto odpowiada za wynik (człowiek, nie „r352") |
| `measurement_date` | status `active`/`closed` | kiedy mierzymy wynik (ISO date) |
| `go_decision` | status `active`/`closed` | Decision z `choice: "GO"`, `status: "decided"` |
| `postmortem` | status `closed` | Record postmortemu |

## Kontrakt danych — Decision (bramka)

| Pole | Wartość |
|---|---|
| `choice` | `GO` \| `REVISE` \| `STOP` — realizację uruchamia wyłącznie `GO` |
| `status` | `decided` |
| `prepared_by` | kto przygotował kontrakt (zwykle `session:router`) |
| `decided_by` | **człowiek**; wartość zaczynająca się od `session/agent/migration/ingest` jest odrzucana |
| `relations.attached_to` | `[proj:…]` |

Agent nie może zatwierdzić własnego kontraktu: `prepared_by === decided_by` = błąd walidacji.

## Kontrakt danych — Prediction (event `prediction.registered`)

| Pole | Znaczenie |
|---|---|
| `prediction_id` | unikalne, **immutable** — ponowna rejestracja tego samego ID = błąd (invariant 12) |
| `p` | prawdopodobieństwo |
| `claim` | falsyfikowalne twierdzenie |
| `criterion` | obserwowalne kryterium rozstrzygnięcia |
| `deadline` | termin rozliczenia |
| `measurement_source` | **skąd** wezmą się dane (mail, GA4, faktura, Ledger) |
| `resolution_owner` | **kto** rozliczy |

Korekta predykcji = `prediction.voided` + nowa z nowym ID. Nigdy nadpisanie.

## Sekcje treści kontraktu (body Recordu)

```markdown
## 1. Projekt
klient/właściciel · problem biznesowy · zakres · **non-scope (jawnie)** · outcome_owner · start · measurement_date

## 2. Baseline (stan przed startem)
metryki wejściowe · źródła danych · `n/d` tam, gdzie danych NIE MA
> `n/d` jest poprawną wartością. Zakaz zastępowania braku założeniem.

## 3. Mechanizmy
wybrane (rola w projekcie · confidence w chwili startu · Evidence uzasadniające)
odrzucone przez anti-context (z powodem)

## 4. Predykcje (3–5)
tabela: id · claim · p · kryterium · deadline · źródło pomiaru · właściciel

## 5. Plan walidacji
co mierzymy · kiedy · skąd dane · kto dostarcza Outcome · kiedy rusza postmortem

## 6. Decyzja startowa
GO / REVISE / STOP · kto · kiedy · uzasadnienie · wersja raportu Routera i kontraktu
```

## Zmiana zakresu po GO

Nowa Decision z `relations.supersedes: [dec:…]` + event `decision.recorded`. Kontrakt pierwotny zostaje nietknięty —
ślad audytowy pokazuje, co zmieniono i kiedy. Zakazane: ciche edytowanie zamrożonego kontraktu.

## Granica obowiązywania

Bramka jest **opt-in**: aktywuje ją karta `rec:PROJECT-GATE` z polem `gate_since`. Projekty utworzone
przed tą datą są grandfathered (ostrzeżenie zamiast błędu) — historii nie przepisujemy.
