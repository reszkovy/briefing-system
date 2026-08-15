---
id: "rec:reviews/COGNITIVE-OS-AUDIT"
type: "record"
title: "Audyt Cognitive OS"
status: "created"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "session"
relations: {}
tags: ["legacy-import"]
---

# Genome OS → Cognitive OS: audyt architektury poznawczej

**Data:** 08.08.2026 · **Autor:** Chief Product Architect / CTO · **Rama:** system ma być zewnętrzną korą przedczołową właściciela. Jeśli po godzinie pracy z Genome decyzje strategiczne są lepsze — działa. Jeśli tylko szybciej znajduje informacje — poniósł porażkę.

## Werdykt otwierający

Dzisiejszy Genome OS to **doskonała pamięć zewnętrzna, ale jeszcze nie kora przedczołowa**. Wie dużo, wyjaśnia mało, nie myśli między sesjami i nie mierzy własnego uczenia się. Trzy strukturalne braki generują 80% dystansu do Cognitive OS:

1. **Brak osi czasu.** Wszystko jest snapshotem „stan na dziś". Nie ma zapisu ZDARZEŃ (zmiana confidence, decyzja, wynik eksperymentu z datą), więc system nie może pokazać trajektorii, tempa uczenia się ani niczego przewidzieć. To blokuje 8 z 10 najcenniejszych warstw.
2. **Wiedza nie spotyka się z sygnałem.** Radar (co się dzieje) i Genome (co wiemy) leżą obok siebie na tych samych ekranach i NIE rozmawiają. Karty mają pola Trigger, radar ma sygnały — nikt ich nie dopasowuje. System, który myśli, mówi sam: „ten mail od Kuboty to trigger mechanizmu proof-first-demo-pitch".
3. **Rekomendacje bez „dlaczego" i bez pętli.** Priorytet #1 nie pokazuje dowodów ani kosztu zaniechania; system nie wie, czy właściciel go wykonał, zignorował czy odrzucił — więc nie kalibruje się nigdy.

---

## Audyt ekranów (8 pytań, esencja)

### Dziś (Pulse)
**Po co istnieje:** odpowiedzieć „co teraz". **Czy zwiększa inteligencję:** połowicznie — wskazuje, nie wyjaśnia. **Lepsze decyzje:** dopiero gdy #1 będzie miał uzasadnienie z dowodami i koszt zaniechania. **Usunąć 50%:** tak — „ostatnie zmiany" i połowa paska health to dekoracja. **Mniej informacji, więcej wartości:** jeden #1 z pełnym „dlaczego" > 3 priorytety bez niczego. **Prawdziwe pytanie użytkownika:** „co dziś najbardziej przesunie firmę i skąd to wiadomo?". **Jak AI ma pomagać:** uzasadniać, przewidywać konsekwencje zaniechania, uczyć się z tego, co właściciel faktycznie zrobił. **Za 5 lat:** poranna rozmowa z systemem, nie ekran; ekran zostaje jako protokół rozmowy.

### Router
**Po co:** dobór mechanizmów przed egzekucją. **Inteligencja:** wysoka koncepcyjnie, zerowa zwrotnie — router nigdy nie dowiaduje się, czy dobrał dobrze. **Usunąć 50%:** ekran jest już minimalny; problemem jest brak pętli, nie nadmiar. **Prawdziwe pytanie:** „czy już to rozwiązywaliśmy i co wtedy zadziałało?". **AI:** po każdym postmortem oceniać trafność własnego doboru (accuracy routera jako metryka). **Za 5 lat:** router niewidzialny — każdy brief przechodzi przez niego automatycznie, człowiek widzi tylko odstępstwa.

### Genome (biblioteka)
**Po co:** przeglądanie wiedzy. **I tu jest problem:** przeglądanie to czynność Wikipedii. Nikt nie „przegląda" własnej kory przedczołowej. **Prawdziwe pytanie:** „co wiemy o X? czego jesteśmy pewni? gdzie się mylimy?" — to są ZAPYTANIA, nie nawigacja. **Usunąć 50%:** listę kart można zdegradować do indeksu; wartością jest odpowiedź na pytanie, nie katalog. **AI:** warstwa Ask Genome — pytanie → odpowiedź skomponowana z kart z cytowaniami dowodów. **Za 5 lat:** biblioteka jest niewidoczną bazą; interfejsem jest rozmowa i wykrywanie sprzeczności.

### Mechanism Detail
**Po co:** pełna prawda o mechanizmie. Najlepszy ekran systemu — i wciąż martwy. **Braki:** confidence bez historii (sparkline trajektorii), Evidence bez dat, Trigger bez połączenia z żywym radarem („ten mechanizm MA TERAZ aktywny trigger u 2 klientów"). **Prawdziwe pytanie:** „czy mogę na tym polegać i czy to jest moment, żeby go użyć?".

### Projekty
**Po co:** projekt jako eksperyment. Pipeline dobry, ale ostatnia sekcja („Zmiana Genome") jest pusta obietnicą — bo nie ma event logu. **Prawdziwe pytanie:** „czego ten projekt nas nauczył i co by było, gdybyśmy go robili dziś?".

### Graf
**Po co:** eksploracja relacji. **Brutalna prawda:** eksploracja bez pytania to rozrywka. **Prawdziwe pytanie:** „gdzie są białe plamy i przeciążenia?" — kategorie bez mechanizmów, mechanizmy z 1 dowodem a wysokim degree, klienci bez eksperymentów. Graf powinien SAM zgłaszać te obserwacje, nie czekać na klik.

### Klienci
**Po co:** genom per klient. Dziś: agregacja projektów. **Brak:** prawdziwy Client Genome = jak ten klient PODEJMUJE DECYZJE (preferencje, historia akceptów, styl feedbacku — te dane SĄ w auto-memory, nieskompilowane). **Prawdziwe pytanie:** „jak wygrać następną rozmowę z tym klientem?".

### CTO
**Po co:** warstwa strategiczna. Dziś: statyczne kafle. **Brak:** log decyzji technologicznych z uzasadnieniami, realne wpisy radaru, dług techniczny liczony, nie deklarowany.

---

## Brakujące warstwy (checklist z dyrektywy)

| Warstwa | Status | Werdykt |
|---|---|---|
| Axiom Layer | ✅ jest (AKSJOMATY.md, KOMPAS) | rozwijać dowodami |
| Principle Layer | ✅ jest (PRINCIPLES.md) | wpiąć w UI kart |
| Theory Layer | ◐ zalążek (obserwacja konsultanta) | NEXT: Theory v0 |
| Memory Layer | ◐ auto-memory istnieje, poza OS | NEXT: kompilacja do Client Genome |
| **Timeline / Confidence Evolution** | ❌ **BRAK — keystone** | NOW: event log |
| **Intelligence Layer (trigger matching)** | ❌ BRAK | NOW |
| **Query Layer (Ask Genome)** | ❌ BRAK | NOW |
| Explainability Layer | ❌ BRAK | NOW (tanie) |
| Learning Velocity | ❌ BRAK | NOW (pochodna event logu) |
| Decision Engine / CTO Notes | ❌ BRAK | NEXT |
| Recommendation Layer | ◐ priorytety bez pętli | NOW: feedback #1 |
| Prediction Layer | ❌ BRAK | LATER (wymaga ~50 zdarzeń) |
| Market Intelligence | ◐ zaprojektowane (poniedziałki) | NEXT: archiwum strukturalne |
| AI Reflections | ❌ BRAK | NEXT (sekcja w raporcie CKO) |
| Organization Health | ◐ health = liczby statyczne | NOW: przepiąć na velocity |

---

## TOP 25 — ranking Impact × Defensibility × Compounding ÷ Difficulty

### Pełne karty: TOP 10

**1. Genome Event Log** — append-only `genome/events.jsonl`: każde zdarzenie poznawcze (zmiana confidence, nowy dowód, decyzja właściciela, wynik eksperymentu, wykonanie/odrzucenie rekomendacji) z datą i źródłem. *Dlaczego przewaga:* zamienia snapshot w trajektorię — odblokowuje timeline, velocity, predykcję, kalibrację. *Defensywność:* korpus datowanych zdarzeń decyzyjnych jednej firmy jest niekopiowalny z definicji. *Mniej pracy człowieka:* zero — piszą go sesje i taski. *Jakość decyzji:* każda przyszła rekomendacja cytuje zdarzenia. *Zasada 10 lat:* to jest DOKŁADNIE warstwa, która drożeje z każdym modelem. *Dane:* istniejące operacje (postmortem, task CKO) dopisują linijkę. **NOW — keystone, warunek 8 innych pozycji.**

**2. Trigger Matching Engine (Intelligence Layer)** — poranny task CKO dopasowuje sygnały radaru do pól Trigger kart; na Dziś sekcja „Genome sugeruje": „sygnał Kubota=umowa → mechanizm dated-commitment-gates (✓ sprawdzony, 4 dowody)". *Przewaga:* biblioteka staje się aktywnym doradcą — system pierwszy raz MYŚLI bez pytania. *Defensywność:* jakość dopasowań rośnie z korpusem triggerów i feedbackiem. *10 lat:* lepszy model = lepsze dopasowania za darmo. *Dane:* radar + karty (są). **NOW.**

**3. Ask Genome (Query Layer)** — komenda `/ask-genome <pytanie>` + ekran: odpowiedź skomponowana z kart/aksjomatów/dowodów Z CYTOWANIAMI, zapisywana (pytania właściciela = dane o tym, czego Genome nie umie). *Przewaga:* z Wikipedii robi się rozmowa z organizacyjną inteligencją — sedno briefu. *Defensywność:* odpowiedzi z własnego korpusu, nie z internetu. **NOW.**

**4. Explainable #1 + pętla wykonania** — „Jedna rzecz teraz" dostaje: dowody (linki do zdarzeń/kart), koszt zaniechania, oraz przyciski zrobione / odkładam / nie zgadzam się → wpis do event logu. *Przewaga:* system zaczyna się KALIBROWAĆ do właściciela; po 30 dniach wie, które rekomendacje są wykonywane, a które ignorowane i dlaczego. *To jest wprost brakujący feedback na bottleneck „decyzje odwagi".* **NOW.**

**5. Learning Velocity (Organization Health v2)** — na Dziś: prawdy/tydzień (nowe evidence + zmiany confidence + nowe mechanizmy), trend, oraz „dni od ostatniej zmiany Genome z realnego projektu" (licznik wstydu). *Przewaga:* aksjomat 8 („przewagą jest tempo uczenia się") dostaje SWOJĄ metrykę — bez niej jest sloganem. *Dane:* event log. **NOW.**

**6. Router Accuracy Loop** — postmortem ocenia trafność raportu routera (dobrane vs faktycznie użyteczne mechanizmy); router pokazuje własną skuteczność historyczną per typ projektu. *Przewaga:* jedyny znany mi mechanizm, w którym firma mierzy jakość WŁASNEGO procesu doboru metod — to jest twierdzenie sprzedażowe kategorii Creative Governance („nasz router ma 85% trafności na 40 projektach"). **NEXT (wymaga 3-5 postmortemów).**

**7. Contradiction Detector** — cykliczny przebieg (task CKO): pary kart/lekcji/aksjomatów w napięciu („incident-to-guard mówi X, praktyka w projekcie Y łamie X") → sekcja „Napięcia do rozstrzygnięcia". *Przewaga:* organizacja, która ZAUWAŻA własne sprzeczności, myśli; rozstrzygnięcia właściciela = najcenniejsze zdarzenia w logu. **NEXT.**

**8. Client Genome kompilowany z pamięci** — auto-memory per klient destylowana do karty: jak decyduje, co akceptuje od razu, czego nie ruszać, historia obietnic. *Przewaga:* „system pamięta klienta lepiej niż klient sam siebie"; wprost sprzedawalne jako moduł Creative Governance. *Uwaga:* wymaga filtra prywatności. **NEXT.**

**9. White Space Map** — graf analizowany automatycznie: kategorie bez mechanizmów, mechanizmy o wysokim degree z 1 dowodem, klienci bez eksperymentów → generowane hipotezy do laboratorium. *Przewaga:* system sam wskazuje, czego się uczyć — zamyka pętlę badawczą. **NEXT.**

**10. Genome Diff („co się zmieniło, odkąd tu byłeś")** — wejście do OS pokazuje deltę od ostatniej wizyty, nie stan. *Przewaga:* czytanie zmian zamiast stanu to różnica między gazetą a encyklopedią; przy codziennym tasku CKO delta zawsze istnieje. *Dane:* event log + localStorage last-visit. **NOW (tanie po #1).**

### Kompakt: 11–25

| # | Zmiana | Esencja | Kiedy |
|---|---|---|---|
| 11 | Theory v0 | spisana teoria działania org. marketingowych w erze AI (aksjomaty→zasady→mechanizmy jako dowody) | NEXT |
| 12 | Confidence sparklines | trajektoria confidence na karcie (z event logu) | NEXT |
| 13 | Experiment Tracker | statusy proposed→running→resolved; wynik pisze do logu i karty | NEXT |
| 14 | Promise Ledger | obietnice z radaru jako obiekty z terminem i stanem done/snooze (z audytu FOTRA — tu jest ich dom) | NEXT |
| 15 | Pre-mortem generator | przy routingu: automatyczny pre-mortem z failure_conditions dobranych mechanizmów | NEXT |
| 16 | Market Intelligence archiwum | poniedziałkowe radary jako strukturalne wpisy z werdyktami na ekranie CTO | NEXT |
| 17 | AI Reflections | sekcja w raporcie CKO: „co system sądzi o własnych rekomendacjach z wczoraj" | NEXT |
| 18 | Session Handoff Protocol | każda sesja Claude kończy się delta-wpisem do event logu (spójność multi-sesyjna) | NOW (zasada, nie kod) |
| 19 | Anti-pattern cards first-class | disproven z pełnymi kartami (gated-content jako pierwsza) | NOW (1h) |
| 20 | Cost-of-delay na kolejce | „wisi X dni · szacowany koszt" przy obietnicach | NEXT |
| 21 | Prediction Layer | prognozy skutków (wymaga ~50 zdarzeń w logu) | LATER |
| 22 | Poranny briefing głosowy/rozmowa | raport CKO jako dialog, ekran jako protokół | LATER |
| 23 | Genome-per-klient jako produkt | multi-tenant: klient dostaje własny Genome (infrastruktura Creative Governance) | LATER |
| 24 | Genome MCP server | agenci (własni i klientów) odpytują Genome przez MCP — agent-facing-distribution na sobie | LATER |
| 25 | Autonomous experiment runner | eksperymenty low-risk odpalane taskiem bez sesji | LATER |

## Sekwencja NOW (kolejność wdrożenia)

1 → 18 → 4 → 2 → 5 → 10 → 3 → 19. Wszystko poza #3 to praca sesji Claude bez udziału właściciela; #1 jest warunkiem reszty i kosztuje pół dnia.

**Zasada kontrolna:** żadna z pozycji nie jest „ładniejsza". Każda zmienia to, CZY system myśli — nie jak wygląda. Miarą sukcesu pozostaje: lepsze decyzje po godzinie z Genome, nie szybsze znajdowanie informacji.
