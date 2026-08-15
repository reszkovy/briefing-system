---
name: genome-council
description: Uruchamia Genome Council — pięć niezależnych modeli jednej decyzji, peer critique, syntezę Chairmana, scorecard 10×5 i obowiązkową predykcję. Produkuje Record + propozycję Decision do pending/ — NIGDY nie podejmuje decyzji za właściciela i NIGDY nie zapisuje do kanonu. Użyj gdy Reszek mówi „zwołaj council", „przepuść to przez council", „to jest duża decyzja" albo stoi decyzja droga/nieodwracalna/strategiczna.
---

# /genome-council — pięć konkurencyjnych modeli jednej decyzji

Karta mechanizmu: `r352-os/genome/workflows/council.md` (`wf:council`, status `draft`).
**Kartę czytasz na starcie i to ona jest źródłem prawdy** dla kategorii, wag i progów.
Jeśli ten plik kiedykolwiek rozejdzie się z kartą, wygrywa karta.

Mechanizm jest w **ręcznej próbie na 5 decyzjach** (`dec:2026-08-14-council-proba`).
Po piątej decyzji rozstrzygnięcie jest obowiązkowe.

## Zakazy bezwzględne

- **Nie podejmujesz decyzji.** Council produkuje rekomendację. Decyzja jest osobnym obiektem
  i należy do właściciela. Nigdy nie zapisujesz jednego jako drugiego.
- **Nie uruchamiasz `ingest.js`.** Produkujesz Record i pakiet w `pending/`.
- **Nie uruchamiasz Councilu do decyzji już podjętej.** Jeśli właściciel opisuje decyzję
  w czasie przeszłym albo prosi o „uzasadnienie", zatrzymujesz się i mówisz to wprost.
  Predykcja rejestrowana po fakcie nie testuje niczego i zatruwa track record.
- **Nie zamykasz Councilu bez predykcji.** Council bez `prediction.registered` nie liczy się
  do próby.

## Krok 0 — bramka wejścia

Sprawdzasz PRZED czymkolwiek innym. Musi być spełniony co najmniej jeden warunek jakościowy
(koszt błędu, niepewność, nieodwracalność, zmiana strategii, duże zaangażowanie, konflikt opcji)
**oraz** próg ilościowy: ≥1 tydzień pracy albo ≥5 000 zł, albo odwrócenie droższe niż podjęcie.

Poniżej progu odpowiadasz jednym akapitem: to jest decyzja na test, nie na naradę — i proponujesz
najtańszy test. To jest poprawny wynik skilla, nie porażka.

## Krok 1 — Context Pack

Budujesz jeden pakiet i **zamrażasz go**. Wszyscy advisorzy dostaną identyczny.

```
DECISION        Co dokładnie rozstrzygamy? Jedno zdanie, forma pytania rozstrzygalnego.
OPTIONS         A / B / C. Jeśli są tylko dwie, napisz dlaczego nie ma trzeciej.
OBJECTIVE       Co realnie optymalizujemy? Nie „sukces" — konkretna wielkość.
CONSTRAINTS     Czas, kapitał, godziny właściciela, rodzina, zobowiązania klienckie.
KNOWN FACTS     Fakty z prowieniencją: skąd, z kiedy, jak sprawdzalne.
CURRENT BELIEFS Karty Genome dotyczące tej decyzji + ich confidence + ich anti_context.
UNKNOWNS        Czego naprawdę nie wiemy. NIE MOŻE BYĆ PUSTE.
BASELINE        Co się stanie, jeśli nie zrobimy nic. Osobno, zawsze.
DEADLINE        Do kiedy decyzja musi zapaść i co wymusza ten termin.
```

Faktów nie zmyślasz — obowiązuje `prin:extract-never-invent`. Luki oznaczasz jako luki
i lądują w UNKNOWNS. Pusta sekcja UNKNOWNS znaczy, że pakiet jest propagandą decyzji.

Liczysz `sha256` pakietu i zapisujesz pierwsze 16 znaków jako `context_hash`.

## Krok 2 — pięciu advisorów, każdy w izolacji

**Każdy advisor leci jako osobny subagent.** To nie jest optymalizacja, tylko warunek sensu:
advisor, który widzi cztery poprzednie analizy, nie produkuje piątego modelu, tylko wariant
tamtych. Uruchamiasz je równolegle, jednym blokiem.

Każdy dostaje: Context Pack (verbatim), swoje pytanie kierujące, definicję 10 kategorii
z karty i format wyjścia. **Żaden nie dostaje odpowiedzi pozostałych.**

| | rola | pytanie kierujące |
|---|---|---|
| A | Contrarian | Dlaczego to zły pomysł? Co sprawi, że to nie zadziała? |
| B | First Principles | Jaki problem naprawdę rozwiązujemy? Czy opcje są dobrze postawione? |
| C | Expansionist | Jakiego maksymalnego upside'u nie widzimy? |
| D | Outsider | Co zauważyłby ktoś mądry bez przywiązania do tego systemu? |
| E | Executor | Czy to da się dowieźć i jaki jest najszybszy sposób, żeby się przekonać? |

Instrukcje ról, które łatwo zgubić:
- **Contrarian nie jest pesymistą.** Ma próbować OBALIĆ decyzję: fatal flaw, ukryte założenie,
  efekt drugiego rzędu, dowód przeciw tezie, powód, żeby nie robić nic.
- **First Principles ma prawo odrzucić postawienie pytania**: „ani A, ani B — problem jest
  źle postawiony". To jest pełnoprawna odpowiedź, nie unik.
- **Outsider ignoruje wewnętrzny język.** Sprawdza klątwę wiedzy, zbędną złożoność i to,
  czy klient w ogóle widzi ten problem. Ta rola istnieje, bo ten system jest intelektualnie
  atrakcyjny dla swojego autora.
- **Executor** powinien często kończyć na „nie buduj tego, przetestuj najpierw jedną rzecz".

Wyjście każdego advisora: analiza (proza, bez limitu długości) **plus** scorecard.

## Krok 3 — scorecard

Dziesięć kategorii, skala 1–100 000, wszystkie w tę samą stronę: **więcej = lepiej**.
Przy Downside Profile wysoki wynik znaczy dobry profil ryzyka, nie duże ryzyko.

Problem Strength · Strategic Alignment · Evidence Strength · Expected Upside ·
Downside Profile · Reversibility · Execution Feasibility · Leverage · Defensibility · Timing

```yaml
evidence_strength:
  score: 42000
  reason: >
    Architektura istnieje i jest używana wewnętrznie, ale nie ma jeszcze dowodu
    prospektywnego wiążącego decyzje prowadzone przez Genome z lepszym wynikiem.
  confidence: 0.82
```

**Score bez `reason` jest nieważny** — odsyłasz advisora po uzasadnienie.

Progi: ≥90k wyjątkowo mocne · 80–90k bardzo mocne · 70–80k dobre · 60–70k umiarkowanie
pozytywne · 50–60k nierozstrzygnięte · 40–50k słabe · 30–40k poważne problemy · <30k brak podstaw.

W każdym tekście dla człowieka podajesz wartość zaokrągloną do 0,1k (`82,4k`) razem z pasmem.
Nigdy `82 437` — ta rozdzielczość jest do porównywania decyzji, nie do udawania pomiaru.

## Krok 4 — peer critique

Anonimizujesz pięć odpowiedzi (Advisor A–E, bez nazw ról) i rozdajesz wszystkim.
**Nikt nie może zmienić swojej pierwszej odpowiedzi.** Każdy odpowiada tylko na pięć pytań:

1. Najmocniejszy argument postawiony przez kogoś innego.
2. Największy ślepy punkt w cudzych analizach.
3. Czego mogła nie zauważyć cała piątka.
4. Czyje rozumowanie jest najmocniejsze i dlaczego.
5. Jaka nowa informacja zmieniłaby twoją rekomendację.

## Krok 5 — liczenie

- **Wynik kategorii = mediana** pięciu ocen. Nie średnia. Expansionist 98k i Contrarian 25k
  dają średnią 61k, która nie opisuje niczyjego poglądu.
- **Rozrzut = max − min.** Zapisujesz przy każdej kategorii. Duży rozrzut oznacza sprzeczne
  modele świata i jest ważniejszym materiałem niż sam wynik.
- **Wynik globalny** wagami z karty: Problem Strength 15 · Strategic Alignment 15 ·
  Evidence Strength 15 · Expected Upside 10 · Downside Profile 10 · Execution Feasibility 10 ·
  Leverage 10 · Reversibility 5 · Defensibility 5 · Timing 5.

Sprawdzasz warunek sukcesu z karty: **rozrzut w co najmniej jednej kategorii > 30k**.
Jeśli wszystkie rozrzuty są poniżej 10k, mówisz to wprost: nie było pięciu modeli, był jeden
powtórzony pięć razy — i to jest wynik Councilu, nie usterka do zamiecenia.

## Krok 6 — Chairman

Chairman **nie głosuje większością**. Szuka struktury konfliktu.

```
GDZIE COUNCIL JEST ZGODNY    co pojawiło się niezależnie u kilku advisorów
GDZIE SIĘ ROZJEŻDŻA          realnie sprzeczne modele świata, nie różnice tonu
ŚLEPE PUNKTY                 co przeoczyli wszyscy albo większość
ASYMETRIE                    gdzie downside jest mały, a upside duży
REKOMENDACJA                 GO / NO-GO / TEST / DEFER + rozumowanie
JEDNA RZECZ DO ZROBIENIA     jedno konkretne działanie, wykonalne w poniedziałek rano
```

## Krok 7 — predykcja

Bez tego Council nie jest zamknięty.

```yaml
prediction_id: pred:<slug>
p: 0.68
claim: >
  Konkretne, obserwowalne zdarzenie.
deadline: 2026-10-23
criterion: >
  HIT: ... / MISS: ... / VOID: ...
measurement_source: >
  Skąd weźmiemy odpowiedź. Musi istnieć dziś.
resolution_owner: przemek
```

Siedem pól, komplet — `ingest.js` odrzuci zdarzenie bez któregokolwiek.
Warunki muszą być rozstrzygalne przez kogoś, kto nie brał udziału w naradzie.

## Krok 8 — zapis

Trzy artefakty, w tej kolejności:

1. **`council:<slug>`** (katalog `council/`, plik `RRRR-MM-DD-<slug>.md`) — narada:
   Context Pack (verbatim + hash), pięć analiz, macierz 10×5 z medianami i rozrzutami,
   peer critique, synteza Chairmana, rekomendacja i wynik globalny.
   Status na wyjściu: **`analyzed`**. `relations.attached_to` wskazuje projekt,
   `relations.related` wskazuje Decision.
2. **`dec:<slug>`** — Decision w statusie `open`. Pole decyzji właściciela zostaje **puste**.
   Wypełnia je właściciel, nie Ty.
3. **`prediction.registered`** — zdarzenie, `on` wskazuje Decision.

Cykl życia narady: `analyzed` → `decided` (właściciel zdecydował) → `resolved` (predykcja
rozliczona) albo `void`. Te przejścia są jedynym powodem, dla którego Council ma własny typ
zamiast być Recordem — bez nich pytanie „ile narad doczekało się rozstrzygnięcia" jest
niepoliczalne, a track record Councilu nie istnieje.

Pakiet ląduje w `pending/` z `signature: null`. `ingest.js` uruchamia właściciel.

## Format meldunku w rozmowie

Mieści się na ekranie. Pełna treść jest w Recordzie.

```
COUNCIL      <pytanie decyzyjne>
BRAMKA       przeszła · próg: <co go spełnia>
ROZRZUT      największy: <kategoria> <min>–<max> (<rozrzut>k)
NAJSŁABSZE   <kategoria> <mediana>k — <jednozdaniowy powód>
ZGODA        <co powiedziało niezależnie ≥3 advisorów>
KONFLIKT     <gdzie modele świata są sprzeczne>
ŚLEPY PUNKT  <czego nie widział nikt>
REKOMENDACJA TEST · globalnie 78,4k
NAJPIERW     <jedna rzecz>
PREDYKCJA    pred:<slug> · p=0.68 · <deadline> · rozlicza: <kto>
DECYZJA      czeka na Ciebie — Council jej nie podejmuje
```

Kończysz zdaniem, ile decyzji zostało do końca próby (`N/5`).

## Rzecz, którą masz powiedzieć głośno, jeśli jest prawdziwa

Sprawdź stan predykcji: `node r352-os/genome/proposals/tools/learning-loop.js --preds`.

Jeśli w Genome dalej jest **zero predykcji rozstrzygniętych jako HIT albo MISS**, powiedz to
przy meldunku. Council dokłada zakłady do systemu, który jeszcze żadnego nie zamknął
rzeczywistością — a to jest dokładnie ten warunek, od którego karta uzależnia jego życie.
