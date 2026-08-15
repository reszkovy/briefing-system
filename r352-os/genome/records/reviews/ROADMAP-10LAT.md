---
id: "rec:reviews/ROADMAP-10LAT"
type: "record"
title: "Roadmapa 10 lat"
status: "created"
created: "2026-08-08"
updated: "2026-08-08"
version: 1
owner: "session"
relations: {}
tags: ["legacy-import"]
---

# Genome OS — roadmapa 10-letniej przewagi

**Data:** 08.08.2026 · Synteza trzech niezależnych źródeł: audyt Cognitive OS (CTO), panel 6 person (Palantir / Cursor / Anthropic / Linear / a16z / Obsidian — pełne głosy: PANEL-6-PERSON.md), feedback konsultanta zewnętrznego.

## Gdzie głosy się zbiegły (to jest sygnał, nie opinia)

Sześć person oceniało NA ŚLEPO (bez audytu CTO) i mimo to 4 tematy wróciły z każdej strony:

1. **Zdarzenie/decyzja jako obiekt pierwszej klasy.** Palantir: prowieniencja każdego dowodu. Linear: decyzja jako jednostka pracy z cyklem życia. Anthropic: rejestr predykcji rozliczanych. Audyt CTO: event log jako keystone. → JEDEN wniosek: system bez niemutowalnego logu zdarzeń jest snapshotem, nie organizmem.
2. **Karty jako dane, build bez AI w pętli.** Palantir: schemat + walidator w CI. Obsidian: YAML frontmatter + głupi `node build.js` (AI pisze karty, NIGDY artefakty pochodne). Wykryty na żywo dryf „12 vs 16 proven" jest dowodem koronnym. → Genome ma dziś 5 reprezentacji tej samej prawdy i człowieka-w-pętli udającego kompilator.
3. **Enforcement zamiast dyscypliny.** Linear: guardy wykonywalne na własnym OS (blokada startu bez raportu routera). Cursor: Genome ma się WTRĄCAĆ samo (hook przy briefie), nie czekać na wywołanie. Konsultant/a16z: bramki z konsekwencją. → System o wymuszaniu bramek nie ma ani jednej działającej bramki na sobie.
4. **Epistemika: pewność musi być zarobiona.** Anthropic: confidence to dziś „miara częstości narracji" — potrzebne rozdzielenie siły dowodu (pomiar vs narracja, wiek, decay) od rekomendacji, rejestr falsyfikowalnych predykcji z Brier score, adwersaryjny krytyk raportów routera. a16z: „sprzedaje się mapę kopalni, w której nie kopnięto łopatą". → Bez tego kora przedczołowa jest generatorem pewności siebie.

Piąty temat (a16z + konsultant, wprost): **dane przed kategorią** — 12 mies. instrumentowanych delt u 2–3 klientów ZANIM publiczna narracja Creative Governance; wyjęcie jednego „Przemek-decyzja" z pętli jako self-serve produkt (alignment score jako endpoint).

## Roadmapa (fazy, nie sprinty)

### FAZA 0 — Fundament danych (NOW, dni)
*Bez tego każda kolejna warstwa buduje na piasku.*

- **0.1 YAML frontmatter na 22 kartach** (id, principle, confidence, evidence[] z typem dowodu {pomiar|postmortem|narracja} i datą, related[], version[]) + proza pod spodem bez zmian. [Obsidian, Palantir]
- **0.2 `build.js` — deterministyczny kompilator** markdown → INDEX.md + genomeos-data.js + graf (+ walidator: każdy mechanizm ma principle, related istnieją, liczniki się zgadzają). Zero AI w buildzie. Kasuje dryf klasy „12 vs 16" strukturalnie. [Obsidian, Palantir]
- **0.3 `events.jsonl` — append-only log zdarzeń poznawczych** (zmiana confidence, nowy dowód, decyzja właściciela, wynik eksperymentu, rekomendacja wykonana/odrzucona; każdy wpis: data, źródło, prowieniencja). [wszyscy]
- **0.4 Prompty routera/postmortemu jako wersjonowane specyfikacje wejście/wyjście w repo** — wykonywalne przez dowolny model lub człowieka z checklistą. Własność procedur, nie wynajem. [Obsidian]

### FAZA 1 — Pętla, która się domyka (NOW→NEXT, tygodnie)

- **1.1 Decyzja jako obiekt z cyklem życia:** brief → raport → akcept → egzekucja → postmortem → delta confidence; stany w danych, nie w folderach. [Linear]
- **1.2 Panel przyjmuje decyzje:** „Czeka na Ciebie" i „Jedna rzecz teraz" z przyciskami zrobione/odkładam/nie zgadzam się (+powód) → zapis do events.jsonl, sesje konsumują. [Cursor, audyt CTO]
- **1.3 Postmortem-zero-friction:** auto-szkic z git log + historii sesji; człowiek zatwierdza w 5 minut. Metryka życia systemu nie może zależeć od najcięższego rytuału. [Cursor]
- **1.4 Guard na własnym OS:** start projektu bez raportu routera = blokada (pre-commit/check w scaffoldzie), zamknięcie bez postmortemu = alarm w tasku CKO. Incident-to-guard na sobie. [Linear]
- **1.5 Trigger Matching:** poranny task dopasowuje sygnały radaru do pól Trigger kart → sekcja „Genome sugeruje" (system wtrąca się sam — namiastka tab-completion do czasu hooka). [Cursor, audyt CTO]
- **1.6 Cięcie ekranów do pętli dziennej:** pierwszoplanowe tylko Dziś (z decyzjami) + Router-inbox + Genome; Graf/Eksperymenty/Klienci/CTO jako widoki na żądanie. [Linear; spójne z decyzją Reszka „kilka wybitnych widoków"]

### FAZA 2 — Epistemika (NEXT, 1–2 miesiące)

- **2.1 Dwupoziomowy confidence + decay:** siła dowodu (n, typ, wiek — dowód niepotwierdzony N miesięcy degraduje się sam) oddzielona od rekomendacji użycia; UI przestaje renderować „✓ sprawdzony" dla narracji i pomiaru tą samą czcionką. [Anthropic, Palantir]
- **2.2 Rejestr predykcji:** każdy raport routera i eksperyment zapisuje z góry falsyfikowalną predykcję (metryka, próg, termin); postmortem MUSI rozliczyć; Brier score systemu obok Δ confidence. [Anthropic]
- **2.3 Adwersaryjny krytyk:** każdy raport routera przechodzi przez niezależną sesję z zadaniem „obal to"; rozbieżności jawne w raporcie. [Anthropic]
- **2.4 Learning Velocity na Dziś** (prawdy/tydzień, dni od ostatniej zmiany z projektu) + Genome Diff („co się zmieniło, odkąd tu byłeś"). [audyt CTO]

### FAZA 3 — Dowód komercyjny przed kategorią (równolegle, kwartał)

- **3.1 Baseline→delta u 2–3 klientów zapisane umownie** (czas brief→akcept, % first-pass, senior-godziny; prawo do anonimizowanej publikacji od dnia 1). Żadnej publicznej narracji kategorii przed 2 niezależnymi case'ami z metrykami (bramka blokująca). [a16z, konsultant]
- **3.2 Self-serve wedge:** alignment score jako endpoint odpalany przez klienta (wyjęcie jednego „Przemek-decyzja" z pętli; korpus 39 briefów jako kalibracja). Pierwszy przychód niezwiązany z godzinami założyciela. [a16z]
- **3.3 Replika pilota poza fitnessem/Benefitem** (Sonova albo Archicom) — dywersyfikacja dowodu przed obietnicą. [a16z]

### LATER (po zebraniu zdarzeń)

Prediction Layer na własnych danych · briefing głosowy · Genome-per-klient jako produkt · Genome MCP server · autonomous experiment runner. (Szczegóły: COGNITIVE-OS-AUDIT.md TOP 25, poz. 21–25.)

## Zasada kontrolna roadmapy

Kolejność jest nienegocjowalna: **dane (F0) przed pętlą (F1) przed epistemiką (F2)** — a dowód komercyjny (F3) biegnie równolegle od pierwszego tygodnia, bo (a16z) „system jest wart więcej niż autor dopiero, gdy zarabia bez jego godzin". Każda pozycja przechodzi filtr pięciu pytań CTO; miarą całości pozostaje: lepsze decyzje po godzinie z Genome, nie szybsze znajdowanie informacji.
