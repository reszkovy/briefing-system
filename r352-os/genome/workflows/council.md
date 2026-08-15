---
id: "wf:council"
type: "workflow"
title: "Council — pięć konkurencyjnych modeli jednej decyzji"
status: "draft"
created: "2026-08-14"
updated: "2026-08-15"
version: 2
owner: "przemek"
category: "Strategy"
relations: {"implements":["prin:reduce-subjectivity"],"related":["wf:salt","wf:plate","mech:dated-commitment-gates","prin:proof-before-promise","rule:rozszerzanie-ontologii"],"born_from":["ax:uczenie-przez-decyzje"]}
requires_input: "Decyzja przechodząca bramkę wejścia (koszt błędu, niepewność, nieodwracalność, zmiana strategii, duże zaangażowanie, konflikt opcji) ORAZ próg ilościowy: ≥1 tydzień pracy lub ≥5 000 zł, albo odwrócenie droższe niż podjęcie. Do tego kompletny Context Pack z niepustą sekcją UNKNOWNS i nazwanym BASELINE."
trigger: "Stoi decyzja droga, trudna do odwrócenia albo strategiczna, a Genome podpowiada jeden model świata i nie ma w sobie nikogo, kto by go atakował. Sygnał: kilka sensownych opcji jednocześnie, brak rozstrzygającego dowodu, a koszt pomyłki przekracza koszt narady."
context: "Decyzje własne r352 i strategiczne decyzje klienckie: czy wchodzić w produkt, czy zamykać kierunek, czy przyjąć zlecenie zmieniające profil firmy, jak pozycjonować się przed wydarzeniem. Wymaga właściciela, który poda Context Pack uczciwie, łącznie z tym, czego nie wie."
anti_context: "NIE stosować gdy: (a) decyzja jest tania i odwracalna — test kosztuje mniej niż narada i daje twardszą odpowiedź; (b) decyzja jest już podjęta, a Council ma dostarczyć uzasadnienia — to produkuje ozdobne potwierdzenie i psuje track record, bo predykcja rejestrowana po fakcie nie testuje niczego; (c) brakuje danych do sekcji KNOWN FACTS i całość byłaby pięcioma spekulacjami na tym samym powietrzu; (d) nie ma nikogo, kto rozliczy predykcję — bez tego Council jest kosztem bez zwrotu."
inputs: ["Context Pack: decyzja, opcje, cel, ograniczenia, fakty z prowieniencją, aktualne przekonania z kart Genome, niewiadome, baseline, deadline","Hash snapshotu — dowód, że wszyscy advisorzy dostali ten sam stan wiedzy","Nazwany resolution_owner predykcji, inny niż uczestnik narady","Definicja HIT / MISS / VOID rozstrzygalna bez interpretacji"]
outputs: ["Record rec:council/<slug>: pięć niezależnych analiz, macierz 10×5, mediany, rozrzuty, peer critique, synteza Chairmana","Rekomendacja GO / NO-GO / TEST / DEFER + wynik globalny + jedna rzecz do zrobienia najpierw","Decision dec:<slug> z decyzją właściciela — osobny obiekt, nigdy nie nadpisuje rekomendacji","Zdarzenie prediction.registered z kompletem siedmiu pól","Zapisany rozjazd rekomendacja↔decyzja, jeśli wystąpił"]
ai_tasks: ["Zebranie Context Packu z kart Genome, Ledgera i materiałów właściciela; jawne oznaczenie luk zamiast ich zasypywania","Pięć niezależnych analiz w izolacji, każda ze scorecardem 10 kategorii i uzasadnieniem przy każdej ocenie","Anonimizacja i rozdanie odpowiedzi do peer critique bez możliwości edycji pierwszej opinii","Synteza Chairmana: zgodność, konflikt, ślepe punkty, asymetrie, rekomendacja","Policzenie median, rozrzutów i wyniku globalnego wagami z tej karty","Zapis Recordu i przygotowanie pakietu do ingestu"]
human_tasks: ["Przemek: uczciwy Context Pack, w szczególności sekcja UNKNOWNS i BASELINE","Przemek: decyzja właściciela jako osobny zapis, z powodem — także (a zwłaszcza) gdy odbiega od rekomendacji","Przemek: wskazanie resolution_owner i pilnowanie terminu rozliczenia predykcji"]
success_conditions: ["Advisorzy dali realnie różne modele, nie pięć wariantów tego samego zdania — rozrzut przynajmniej w jednej kategorii przekracza 30k","Powstała predykcja rozstrzygalna bez interpretacji, z nazwanym właścicielem i źródłem pomiaru","Rekomendacja i decyzja właściciela są zapisane osobno, także gdy są zgodne","Council wskazał co najmniej jedną rzecz, której właściciel nie miał w głowie przed naradą"]
failure_conditions: ["ROZSTRZYGAJĄCY: predykcje z Councilu nie są rozliczane. Bez rozliczeń nie ma kalibracji, bez kalibracji Council jest pięcioma opiniami w ładnym formacie. Stan wyjściowy 14.08.2026: 9 predykcji zarejestrowanych, 3 zamknięte, ZERO skonfrontowanych z rzeczywistością jako HIT albo MISS.","Council uruchamiany do decyzji, które i tak były podjęte — produkuje uzasadnienia i zatruwa track record","Advisorzy zbiegają się do jednego głosu (rozrzuty poniżej 10k w każdej kategorii) — wtedy nie ma pięciu modeli, tylko jeden powtórzony pięć razy","Narada kosztuje więcej niż decyzja, którą rozstrzyga","Wynik globalny zaczyna być cytowany jako liczba bez pasma i rozrzutu — wtedy skala udaje pomiar"]
guards: ["Bramka wejścia: bez progu kosztowego Council nie startuje","Predykcja obowiązkowa: Council bez prediction.registered nie jest zamknięty i nie liczy się do próby","Zakaz nadpisywania: rekomendacja Councilu i decyzja właściciela to dwa obiekty, nigdy jeden"]
provenance: "Specyfikacja właściciela z 14.08.2026, przyjęta w całości co do mechaniki. Zmiany przy zapisie: (1) dołożony próg ilościowy do bramki wejścia, bo lista jakościowa przepuszcza wszystko; (2) dołożony warunek porażki o rozliczaniu predykcji, oparty na stanie faktycznym Ledgera. KOREKTA 15.08: pierwsza wersja mapowała naradę na Record, powołując się na zakaz rozszerzania ontologii; zakaz został zdjęty jako błędny (dec:2026-08-15-rozszerzalna-ontologia) i Council dostał własny typ council:, zgodnie z pierwotną specyfikacją właściciela."
next_use: "Pierwsza decyzja próby. Kandydat wskazany przez właściciela; naturalnym kandydatem jest pozycjonowanie r352 przed Wave Turyn / Web Summit, bo spełnia bramkę i ma deadline."
tags: ["strategy","decision","genome"]
---

## Po co to istnieje

Genome ma jedną wadę wpisaną w konstrukcję: podpowiada jeden model świata. Router czyta karty,
karty niosą confidence, confidence pochodzi z dowodów, które sam system zebrał. To działa dopóki
decyzja mieści się w tym, co system już umie. Przy decyzji drogiej, nieodwracalnej albo
strategicznej ten sam mechanizm staje się pułapką: system potwierdza własny model, bo nie ma
w sobie nikogo, kto by go atakował.

Council jest tym kimś. Nie po to, żeby pięć razy ocenić pomysł, tylko żeby wygenerować
**pięć konkurencyjnych modeli tej samej decyzji**, zapisać różnicę między nimi, rozstrzygnąć
i po czasie sprawdzić, kto miał rację.

## Sekwencja

```
DECYZJA → 5 NIEZALEŻNYCH MODELI → PEER CRITIQUE → SYNTEZA → SCORECARD
        → PREDYKCJA → DECYZJA WŁAŚCICIELA → OUTCOME → KALIBRACJA COUNCILU
```

Dwa ostatnie człony robią różnicę między Councilem a efektownym promptem. Bez nich to jest
pięć opinii bez konsekwencji.

## Bramka wejścia

Council NIE uruchamia się do każdej decyzji. Musi być spełniony co najmniej jeden warunek:
wysoki koszt błędu, duża niepewność, trudna odwracalność, zmiana strategii, duże zaangażowanie
czasu lub kapitału, albo realny konflikt między kilkoma sensownymi opcjami.

Do tego warunek ilościowy, żeby bramka nie była deklaracją: decyzja kosztuje **co najmniej
tydzień pracy albo 5 000 zł**, albo jej odwrócenie kosztuje więcej niż jej podjęcie.
Poniżej tego progu tańszy jest test niż narada.

## Context Pack — ten sam snapshot dla wszystkich

Advisorzy dostają identyczny, zamrożony pakiet i **nie widzą swoich odpowiedzi nawzajem**.
Snapshot ma hash; jeśli w trakcie zmienia się stan faktyczny, Council leci od nowa albo notuje
rozbieżność jawnie.

DECISION · OPTIONS · OBJECTIVE · CONSTRAINTS · KNOWN FACTS (z prowieniencją) ·
CURRENT BELIEFS (karty Genome + ich confidence) · UNKNOWNS · BASELINE (co się stanie,
jeśli nic nie zrobimy) · DEADLINE.

Sekcja UNKNOWNS jest obowiązkowa i nie może być pusta. Pusta znaczy, że pakiet jest
propagandą decyzji, nie jej opisem.

## Pięciu advisorów

| | rola | pytanie kierujące |
|---|---|---|
| A | Contrarian | Dlaczego to zły pomysł? Co sprawi, że to nie zadziała? |
| B | First Principles | Jaki problem naprawdę rozwiązujemy? Czy opcje są dobrze postawione? |
| C | Expansionist | Jakiego maksymalnego upside'u nie widzimy? |
| D | Outsider | Co zauważyłby ktoś mądry bez żadnego przywiązania do tego systemu? |
| E | Executor | Czy to da się dowieźć i jaki jest najszybszy sposób, żeby się przekonać? |

Contrarian nie jest pesymistą — ma **próbować obalić decyzję**. First Principles ma prawo
powiedzieć „ani A, ani B, problem jest źle postawiony". Ulubioną odpowiedzią Executora powinno
być „nie buduj tego, przetestuj najpierw jedną rzecz".

Rola D istnieje, bo ten system jest intelektualnie atrakcyjny dla swojego autora. To jest
udokumentowane ryzyko, nie hipoteza.

## Scorecard: 10 kategorii, skala 1–100 000

Problem Strength · Strategic Alignment · Evidence Strength · Expected Upside ·
Downside Profile · Reversibility · Execution Feasibility · Leverage · Defensibility · Timing

Wszystkie skale idą w tę samą stronę: **więcej = lepiej**. Przy Downside Profile wysoki wynik
oznacza dobry profil ryzyka (mały downside, dobra asymetria), nie duże ryzyko.

Progi: ≥90k wyjątkowo mocne · 80–90k bardzo mocne · 70–80k dobre · 60–70k umiarkowanie
pozytywne · 50–60k nierozstrzygnięte · 40–50k słabe · 30–40k poważne problemy · <30k brak podstaw.

Skala jest wysokiej rozdzielczości, nie precyzyjna. Zapisujemy liczbę całkowitą, ale
**pokazujemy zawsze pasmo i wartość zaokrągloną do 0,1k** (82,4k, nie 82 437). Rozdzielczość
jest po to, żeby dało się porównywać decyzje między sobą, nie żeby udawać pomiar.

**Score bez uzasadnienia jest nieważny.** Każda ocena niesie `reason` i `confidence` autora.
Sama liczba wraca do advisora do poprawy.

## Jak liczy się wynik Councilu

Wynik kategorii to **mediana** pięciu ocen, nie średnia. Expansionist dający 98k i Contrarian
dający 25k wyprodukują średnią 61k, która nie opisuje niczyjego poglądu. Mediana mówi, gdzie
leży centralny osąd.

Obok mediany zapisujemy **rozrzut** (`max − min`). Rozrzut bywa ciekawszy niż sam wynik:
Evidence w paśmie 38–51k znaczy, że wszyscy widzą tę samą słabość; Defensibility w paśmie
29–96k znaczy, że advisorzy mają sprzeczne modele świata i to jest właściwy temat rozmowy.

Wynik globalny liczony wagami: Problem Strength 15% · Strategic Alignment 15% ·
Evidence Strength 15% · Expected Upside 10% · Downside Profile 10% · Execution Feasibility 10% ·
Leverage 10% · Reversibility 5% · Defensibility 5% · Timing 5%.

Evidence dostaje 15% świadomie — jest przeciwwagą dla znanego ryzyka tego systemu:
**bardzo atrakcyjna teoria przy zbyt małej liczbie dowodów.**

## Peer critique

Odpowiedzi zostają zanonimizowane i rozdane wszystkim. Nikt **nie może zmienić swojej pierwszej
odpowiedzi** — to jest cały sens, pierwsza opinia zostaje niezależna. Każdy odpowiada tylko na
pięć pytań: najmocniejszy argument kogoś innego, największy ślepy punkt w cudzych analizach,
czego mogła nie zauważyć cała piątka, czyje rozumowanie jest najmocniejsze i dlaczego, oraz
jaka nowa informacja zmieniłaby jego rekomendację.

## Chairman

Chairman nie głosuje większością — ma znaleźć **strukturę konfliktu**. Wynik:
GDZIE COUNCIL JEST ZGODNY · GDZIE SIĘ ROZJEŻDŻA · ŚLEPE PUNKTY · ASYMETRIE ·
REKOMENDACJA (GO / NO-GO / TEST / DEFER) · JEDNA RZECZ DO ZROBIENIA NAJPIERW.

## Council nie podejmuje decyzji

Rekomendacja Councilu i decyzja właściciela to **dwa osobne zapisy** i nigdy nie wolno nadpisać
pierwszego drugim.

```
Rekomendacja Councilu: TEST      wynik globalny 78,4k
Decyzja właściciela:   GO        powód: wartość opcji strategicznej przewyższa słabość dowodów
```

Rozjazd między tymi dwoma zapisami jest najcenniejszym materiałem, jaki ten mechanizm produkuje.
Po roku pokaże, czy właściciel systematycznie wygrywa z Councilem, czy systematycznie przepłaca
za własne przekonania. Jedno i drugie jest wiedzą.

## Predykcja jest obowiązkowa

Council bez zarejestrowanej predykcji **nie jest zamknięty** i nie liczy się do próby.
Rekomendacja musi odpowiedzieć na pytanie: jeśli mamy rację, co konkretnie powinno się wydarzyć?

Predykcja idzie do Ledgera przez `prediction.registered` z kompletem siedmiu pól, w tym
`measurement_source` i `resolution_owner`. Warunki HIT / MISS / VOID muszą być rozstrzygalne
przez kogoś, kto nie brał udziału w naradzie.

## Gdzie to mieszka w ontologii

Council ma **własny typ** `council:` (katalog `council/`, cykl życia
`analyzed → decided → resolved | void`). Pierwsza wersja tej karty mapowała naradę na Record,
bo obowiązywał zakaz rozszerzania ontologii. Zakaz został zdjęty 15.08 jako błędny
(`dec:2026-08-15-rozszerzalna-ontologia`) i mapowanie poszło za tym.

Powód jest policzalny, nie estetyczny. Narada zapisana jako Record ma cykl życia
`created → superseded`, czyli **nie ma stanu „rozstrzygnięta"**. Track record Councilu —
jedyna rzecz odróżniająca go od dobrego promptu — wymaga pytania „ile narad doczekało się
rozstrzygnięcia predykcji". Na Recordach tego pytania nie da się zadać, bo Record nie wie,
czym się skończył. Na typie `council:` to jest jedno przejście statusu.

- `council:<slug>` — narada: zamrożony Context Pack z hashem, pięć analiz, macierz 10×5,
  rozrzuty, peer critique, synteza Chairmana, rekomendacja i wynik globalny.
  `attached_to` wskazuje projekt, `related` wskazuje Decision.
- `dec:<slug>` — Decision z decyzją właściciela, osobny obiekt o osobnym cyklu życia.
- `prediction.registered` — zdarzenie w Ledgerze, `on` wskazuje Decision.

Rozdział z punktu „Council nie podejmuje decyzji" nadal nie jest konwencją zapisu, tylko
strukturą danych: dwa obiekty, dwa cykle życia, dwóch właścicieli. Zmieniło się tylko to,
że narada przestała udawać notatkę.

## Track record Councilu

Kiedy rozliczonych predykcji będzie dość, da się policzyć kalibrację całości i poszczególnych
ról — czy Expansionist systematycznie przecenia timing, czy Executor najlepiej przewiduje
wykonalność, przy jakich klasach decyzji Contrarian ma rację. Wtedy Council zaczyna uczyć się,
jak dobrze sam doradza.

**To jest cel, nie stan.** Dziś jest niepoliczalny i będzie taki, dopóki predykcje nie zaczną
być rozliczane — patrz warunki porażki.

## Próba: 5 decyzji, ręcznie

Mechanizm wchodzi w statusie `draft` jako **ręczna próba na pięciu prawdziwych decyzjach**.
Zero automatyzacji, zero widoku w tablicy, dopóki nie istnieje pięć Recordów. Widok zbudowany
przed danymi pokazywałby pustą macierz i uczył, że Council to formularz.

Po piątej decyzji rozstrzygnięcie: `active`, przerobienie, albo `deprecated`.
