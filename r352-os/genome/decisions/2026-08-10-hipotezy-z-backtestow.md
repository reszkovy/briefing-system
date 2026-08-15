---
id: "dec:2026-08-10-hipotezy-z-backtestow"
type: "decision"
title: "Rozstrzygniecie czterech hipotez zaproponowanych przez backtesty 08-09.08"
status: "decided"
created: "2026-08-10"
updated: "2026-08-14"
version: 1
owner: "przemek"
question: "Ktore z czterech hipotez mechanizmow zaproponowanych przez backtesty wchodza do Genome, a ktore nie?"
options: ["accept — karta powstaje teraz","reject — hipoteza wchlonieta przez istniejaca karte albo odrzucona","defer — decyzja odlozona z jawnym warunkiem powrotu"]
choice: "prototype-mode-guard: ACCEPT · event-gate: REJECT (wchloniete przez dated-commitment-gates) · wire-or-delete: DEFER · case-as-record: DEFER"
decided: "2026-08-10"
relations: {}
tags: ["governance","learning-loop"]
---

## Dlaczego ta decyzja w ogole powstaje

Backtesty z 08–09.08 zaproponowały cztery nowe karty mechanizmów. Żadna nie powstała i żadna nie
została odrzucona — po prostu wypadły. To jest ta sama awaria, którą wykryliśmy przy
`proof-first-demo-pitch`: Genome rejestruje własne wnioski i ich nie wchłania.

Zasada obowiązująca od dziś: **każda propozycja korekty lub nowej karty kończy jako
`ACCEPT`, `REJECT` albo `DEFER` z powodem i datą.** Metryką jest odsetek rozstrzygnięć,
nie odsetek przyjęć — inaczej system optymalizowałby pod łykanie własnych hipotez.

## 1. `mech:prototype-mode-guard` — ACCEPT

Klasa guardów „jawny tryb niekompletny": pusty `ENDPOINT` krzyczy w konsoli, globalny
`noindex` do premiery, dane oznaczone `TBC`. Trzy niezależne wystąpienia w jednym projekcie,
wszystkie prewencyjne — kod deklaruje własną niekompletność, zamiast ją maskować.

Odrębne od `incident-to-guard`, które działa po incydencie. Ten wzorzec działa przed.

Karta powstaje jako `hypothesis` z jednym projektem. **Bez predykcji przy wejściu** — brak
zaplanowanego prototypu w oknie pomiarowym. Predykcja zostaje zarejestrowana przy pierwszym
uruchomieniu nowego prototypu; kryterium: czy deklaruje własną niekompletność bez przypominania.

## 2. `mech:event-gate` — REJECT

Bramka zdarzeniowa na decyzję zewnętrzną jako alternatywa dla datowanej. Sam backtest dopuszczał
dwie drogi: osobna karta albo rozszerzenie `dated-commitment-gates`. Wybieramy rozszerzenie.

Powód: to jest wariant tego samego mechanizmu, nie inny mechanizm. Osobna karta rozmnożyłaby
ontologię o rozróżnienie, które należy do warunków stosowalności jednej karty. Genome ma już
precedens tej pomyłki — `split-url-architecture` był stosowany za szeroko dokładnie dlatego,
że warunek brzegowy nie mieszkał w karcie.

## 3. `mech:wire-or-delete` — DEFER

„Żaden moduł nie wchodzi na main bez co najmniej jednego produkcyjnego wywołania w ścieżce
użytkownika". Jedno wystąpienie (narzedzie-do-briefowania: warstwa LLM scommitowana bez wywołania).

Dwa powody odroczenia. To jest kandydat na **Guard**, nie na Mechanism — dotyczy higieny kodu
wewnętrznego, nie generatora rezultatu u klienta. I ma jedno wystąpienie, więc nie odróżnimy
wzorca od incydentu.

**Warunek powrotu:** drugie niezależne wystąpienie „zbudowane, niewpięte" w dowolnym projekcie.

## 4. `mech:case-as-record` — DEFER

Wariant shadow-proof wyrósł na samodzielną strukturę; backtest oznaczył to jako
`candidate-merge` z `proof-first-demo-pitch`.

Powód odroczenia jest metodologiczny: `proof-first-demo-pitch` dostaje dziś korektę
anti-contextu wraz z predykcją `pred:price-anchor-artoffnia-01`. Druga zmiana tej samej karty
w tym samym dniu uniemożliwiłaby przypisanie skutku którejkolwiek z nich.

**Warunek powrotu:** po rozstrzygnięciu `pred:price-anchor-artoffnia-01` (termin 22.08).

## Bilans

Jedna karta powstaje, jedna propozycja odrzucona, dwie odroczone z jawnym warunkiem powrotu.
Zero propozycji, które po prostu znikają.
