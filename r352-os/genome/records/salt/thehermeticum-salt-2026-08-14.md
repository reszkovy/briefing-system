---
id: "rec:salt/thehermeticum-salt-2026-08-14"
type: "record"
title: "SALT — The Hermeticum (status PROPOSED, czeka na podpis fundamentu)"
status: "created"
created: "2026-08-14"
updated: "2026-08-14"
version: 1
owner: "przemek"
relations: {"attached_to":["proj:thehermeticum"]}
tags: ["salt","side-project"]
---

# SALT — The Hermeticum (thehermeticum.com)

Data: 2026-08-14 · prepared_by: session:claude-fable-5 · decided_by: przemek
Status: **PROPOSED — wnioski wybrane przez Przemka 14.08; CZEKA NA PODPIS FAZY „foundation" (Ed25519, lib/approval.js)**
Wejścia: raport routera `records/routing/hermetica-serwis-2026-08-14.md` (5 rekordów researchu wg kontraktu) · rozstrzygnięcia Przemka z 14.08 · dostęp do klientów końcowych: **BRAK (zadeklarowany)** → wszystkie odkrycia mają status HIPOTEZA.

Doprecyzowanie założyciela (14.08, w trakcie sesji): celem długofalowym jest **społeczność + baza wiedzy** wokół marki.

---

## KLASYFIKACJA PROBLEMU (bramka uczciwości — rozstrzygnięcie Przemka)

**Dominujący: DYSTRYBUCYJNY. Wtórny: percepcyjny.**
Konsekwencja (bramka `HONESTY_PROBLEM_TYPE: WARN`): branding tego nie naprawi — pieniądze i godziny idą NAJPIERW w budowę kanału (newsletter + AEO), nie w polerowanie marki. Warstwa wizualna ma być „wystarczająco dobra", nie flagowa — jej czas przyjdzie, gdy będzie komu ją pokazywać.

## WNIOSKI (po jednym zdaniu na warstwę)

- **S — Sytuacja:** Problemem nie jest brak treści hermetycznych w sieci, tylko brak dystrybucji — nikt nie czeka na nowy serwis i trzeba zbudować kanał, zanim zbuduje się bibliotekę.
- **A — Odbiorcy:** Budujemy dla **ciekawego początkującego** (EN, globalnie), który chce poważnego, ustrukturyzowanego wejścia w hermetyzm bez akademickiego żargonu i bez TikTokowej wróżby — jego językiem jest „where do I start?", nie „hermeneutyka Poimandresa"; docelowo część z nich dojrzewa do praktyków (wyższa wartość relacji: płatne produkty w przyszłości).
- **L — Przewaga:** Przewagą strukturalną jest zdolność produkcji AI-native (szybkość + struktura + machine-readability, warsztat r352), której archiwa z lat 90. nie skopiują — wolna pozycja: **nowoczesna, rygorystyczna ścieżka wejścia**.
- **T — Zmiana:** Percepcja z „wiedza hermetyczna = rozproszone PDF-y i TikTokowe wróżby" na „The Hermeticum = definitywna, nowoczesna brama do tradycji" — dowodem ZACHOWANIA: zapis na newsletter, przechodzenie ścieżki, cytowania przez asystentów AI.

## Rozstrzygnięcia dodatkowe

- **Sygnatura:** postać redakcyjna — serwis mówi jako „The Hermeticum" (instytucja z wyrazistym głosem), bez osoby. Świadome odstępstwo od wzorca Esoteriki (R2) — patrz odkrycie O3.
- **Zdolność wykonawcza:** 5–8 h/tydz. (~12 dni produkcyjnych w horyzoncie 90) → bramka `PLATE_CAPACITY: LIMIT` — PLATE schodzi do **quick winów**, nie pełnego kalendarza.
- **Społeczność i baza wiedzy — SEKWENCJA, nie start:** (1) najpierw kanał (newsletter „As Above" + warstwa AEO), (2) baza wiedzy rośnie przyrostowo jako ustrukturyzowane archiwum newslettera / ścieżka wejścia, (3) społeczność (przestrzeń dyskusji) dopiero po masie krytycznej zaangażowanych czytelników — społeczność uruchomiona za wcześnie przy 5–8 h/tydz. to martwe forum, które psuje percepcję (anty-wzorzec).

## ODKRYCIA KLUCZOWE (wszystkie: HIPOTEZA — brak dostępu do odbiorców końcowych)

| # | Odkrycie (falsyfikowalne) | Status | Plan walidacji | Termin |
|---|---|---|---|---|
| O1 | W niszy istnieje niedoobsadzona pozycja „ustrukturyzowana ścieżka wejścia" i początkujący jej chcą | HIPOTEZA | landing + opt-in „learning path"; kryterium: ≥300 subskrybentów | 2026-12-15 |
| O2 | Dystrybucja agent-facing/AEO zdobywa cytowania szybciej, niż nowy serwis zdobywa pozycje SEO | HIPOTEZA | protokół 20 stałych pytań × 3 asystenty, co miesiąc; kryterium: ≥3/20 cytowań | 2026-12-15 |
| O3 | Postać redakcyjna wystarczy do budowy zaufania (nisza NIE wymaga osobowej twarzy) | HIPOTEZA | jeśli wzrost < 50% celu w połowie okresu → test wariantu z personą autorską | 2026-10-31 |

## Rejestr założeń, odrzuconych alternatyw i ryzyk

**Założenia (czego nie wiemy):** proporcje popytu teoria/praktyka w samej niszy hermetycznej (R5 — niezmierzone); realny language-market fit głosu redakcyjnego po angielsku; czy 5–8 h/tydz. utrzyma się przy szczycie Benefit 2x (IX–X).
**Alternatywy odrzucone z powodem:** archiwum tekstów źródłowych (pozycja zajęta — R4); SEO-portal jako silnik (zero-click — R3); odbiorca „praktyk" na start (mniejsza pula, wyższy próg wiarygodności dla nowej marki); własne nazwisko/persona (decyzja Przemka — do rewizji przez O3); społeczność od dnia 1 (zdolność wykonawcza).
**Ryzyka (co jeśli odkrycie fałszywe):** O1 fałszywe → pivot do praktyków albo STOP (kryterium w kontrakcie); O2 fałszywe → mech:agent-facing-distribution dostaje negatywny Evidence (to też wartość — lekcja do Genome); O3 fałszywe → koszt przełączenia na personę ≈ przepisanie głosu, nie przebudowa serwisu.

## Decyzje zmienione względem pierwotnego briefu (test payoff)

1. Zakres: „portal-kompendium" → **kanał najpierw, baza wiedzy przyrostowo, społeczność po masie krytycznej**.
2. Oś przewagi: dostęp do wiedzy → **ścieżka wejścia + machine-readability**.
3. Budżet uwagi: branding/design zdegradowany poniżej dystrybucji (klasyfikacja problemu).

*(≥1 decyzja zakresowa zmieniona — success_condition wf:salt spełniony.)*

## Co odblokowuje ten dokument

Podpis Przemka fazy „foundation" (Ed25519, klucz poza repo, weryfikacja `lib/approval.js`) → start wf:plate (w trybie quick winów) → Project Contract z predykcjami → podpis GO → produkcja.
