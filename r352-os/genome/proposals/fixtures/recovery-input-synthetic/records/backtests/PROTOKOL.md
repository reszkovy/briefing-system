---
id: "rec:backtests/PROTOKOL"
type: "record"
title: "Protokół backtestu Genome (program walidacji)"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Protokół backtestu Genome (program walidacji — dec:2026-08-09-program-walidacji)

Cel: falsyfikacja. Szukamy błędów Routera i kart, nie potwierdzeń. Każdy projekt = niezależny eksperyment.

## Uczciwość metodologiczna (nienegocjowalne)

1. **T0-pack:** router-backtest widzi WYŁĄCZNIE informacje sprzed startu projektu: brief/zlecenie, kontekst klienta, stan wiedzy r352 na T0. Zero wiedzy o przebiegu i wyniku.
2. **Leave-one-out:** karty mechanizmów czytane z pominięciem evidence pochodzącego z backtestowanego projektu.
3. **Kwarantanna predykcji:** predykcje backtestowe mają ID `bt:<projekt>-<nr>` (NIE `pred:`), nie wchodzą do Briera żywych predykcji ani do METRICS. Metryki backtestu: mechanism-fit accuracy (trafione/rekomendowane), miss rate (użyte-a-nierekomendowane), wrong rate (rekomendowane-a-szkodliwe/nieużyte), listy jakościowe.
4. **Dwa przebiegi:** (A) Router T0 → rekomendacje + predykcje bt:; (B) Porównanie z rzeczywistym przebiegiem (źródła: pamięć, git log, maile, karty projektów) → Evidence. Przebieg B nigdy nie poprawia wyników przebiegu A.
5. **Zmiany kart wyłącznie przez Evidence** (schemat niżej) + event w Ledgerze; confidence zmienia się tylko z evidence typu postmortem/measurement (retro-postmortem = postmortem, bo wynik jest rzeczywisty).

## Przebieg A — Router T0 (na pakiet T0)

Raport routera 9 sekcji (wg ROUTER.md) + predykcje bt: — każda z {id, claim, p, uzasadnienie, data}. Minimum: mechanizmy rekomendowane (3–7) i odrzucone, top-3 ryzyka, przewidywane bottlenecki, przewidywany rezultat.

**Poprawka po transzy 1 (base-rate vs sygnał):** predykcje klasy quasi-pewników r352 („będzie dług techniczny u siebie", „po wpadce powstanie guard", „projekt wewnętrzny bez klienta dryfuje") wypisywane OSOBNO jako base-rate — nie liczą się do oceny trafności. Do fit liczą się wyłącznie predykcje SPECYFICZNE dla projektu (min. 4), rozstrzygalne i falsyfikowalne.

## Przebieg B — Porównanie i Evidence

- Trafienia / pudła / fałszywe alarmy (per mechanizm i per ryzyko).
- „Czego Genome nie wiedział w T0" — luki wiedzy, nie tylko luki kart.
- Evidence (JSON w evidence[] karty + zapis w raporcie): {observation, proof (źródło: plik/mail/commit), impact, proposed_change, confidence_effect, mechanisms[]}.

## Raport per projekt — `records/backtests/<projekt>.md` (10 sekcji CEO)

1. Accuracy Routera · 2. Accuracy Mechanism Selection · 3. Największe błędy · 4. Największe sukcesy · 5. Nowe mechanizmy · 6. Mechanizmy do usunięcia · 7. Confidence Changes · 8. Nowe hipotezy · 9. Czego Genome wcześniej nie wiedział · 10. Jak następny projekt byłby lepszy.

Ledger per backtest: `experiment.started` → `evidence.observed`×N → `experiment.concluded` (+ ewentualne `knowledge.corrected`, `confidence.changed` z uzasadnieniem). Po każdym: `node build.js`, 0 błędów.

## Selekcja (30+ z 50 projektów Genome)

Kryterium wejścia: istnieje realny ślad historyczny (plik pamięci / git / maile) wystarczający do rekonstrukcji T0 ORAZ znanego przebiegu. Wykluczone: triale w toku (artoffnia-oferta, marka-tlumacz — to żywe predykcje), projekty-widma bez śladu.

## Analiza końcowa (po ≥30)

7 pytań CEO: najtrafniejsze / nigdy niedziałające / zbyt ogólne / zbyt szczegółowe / do połączenia / do usunięcia / nowe klasy. Werdykty VALIDATED wg zaostrzonej reguły F0 (≥3 Evidence, ≥2 projekty, ≥1 postmortem/measurement).
