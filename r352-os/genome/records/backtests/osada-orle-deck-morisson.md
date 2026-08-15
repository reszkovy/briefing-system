---
id: "rec:backtests/osada-orle-deck-morisson"
type: "record"
title: "Backtest — osada-orle-deck-morisson"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:osada-orle-deck-morisson"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest — osada-orle-deck-morisson

Data: 2026-08-09 · Protokół: PROTOKOL.md · Przebieg B (audyt falsyfikacyjny)
T0 ≈ 20.07.2026. Źródła przebiegu rzeczywistego: memory/osada-orle-deck-sponsorski.md (stan 02.08.2026), karta proj:osada-orle-deck-morisson (import CKO 07.08, status archived), evidence w kartach agent-as-runtime / sandbox-promotion / working-artifact-extraction (skan CKO 07.08). Brak katalogu kodu — projekt żył w Figmie i pamięci.

## Pakiet T0 (skrót)

Deck sponsorski Osady Orle w ciężkim pliku Figma "Morisson" (61 dzieci strony, timeouty), 46 komentarzy Jana Rogali (22 otwarte, nakładające się piny), oficjalne MCP bez czytnika komentarzy. Zadanie: przetworzyć feedback + dowieźć 3 targetowane wersje decka (ogólna / Pilsner / Castorama). Istnieje zaakceptowany brand system (Fraunces+Work Sans, Granat/Mosiądz/Las/Papier).

## Skrót raportu Routera (przebieg A — nie poprawiany)

Rekomendowane: agent-as-runtime, machine-narrows-human-picks, working-artifact-extraction, single-source-compiler (light), session-to-sop. Odrzucone: design-as-code, competitive-benchmarking, format-dictionary/deterministic-spine, dated-commitment-gates (zdegradowane do "ryzyka ostatniej mili"). Workflow 5 bramek kończący się "Jan potwierdza zamknięcie strumieni; deck w 3 wersjach gotowy". 6 predykcji bt:.

## Rzeczywisty przebieg (fakty z dowodami)

- Komentarze odczytane przez wewnętrzne API Figmy: `fetch('/api/file/<key>/comments', {credentials:'include'})` z zalogowanej sesji Chrome (memory 02.08).
- Inwentaryzacja: 22 otwarte komentarze zmapowane na 6 strumieni WS1–WS6 z ID komentarzy; wykryte duplikaty C18=C37, C19=C38; pełne treści C17–C19, C28, C37, C39 wyciągnięte (memory 02.08).
- Praca przeniesiona do kopii: zduplikowany plik "Morisson (Copy)" `gxAepLF92YHvCe5Od8PXJt` + osobna strona "★ NOWE SLAJDY (draft)" (node 2007:2) — oryginał jako read-only źródło feedbacku (memory 02.08; ev:sandbox-promotion-004).
- 11 nowych slajdów draft zbudowanych programowo w 3 kolumnach per target, w tokenach brandu (granat+mosiądz / papier+las / las; Fraunces+Work Sans OK) (memory 02.08).
- Gotcha utrwalona: "oryginalny plik jest CIĘŻKI — odczyty use_figma na stronie 'Osada Orle' (61 dzieci) timeout'ują; buduj na czystej stronie" (memory 02.08).
- Sprint zaplanowany (5 dni, P0/P1, load ~100%), ryzyka nazwane (zgody wizerunkowe C14/C15, spójność 3 wersji) — ale projekt wszedł do Genome 07.08 jako `archived` ze statusem "W toku: 22 otwarte komentarze, 11 slajdów draft". Brak śladu: dyspozycji per komentarz zatwierdzonych przez Przemka, 3 zmaterializowanych wersji decka, odpowiedzi odesłanych Janowi, domknięcia pętli.

## Porównanie — predykcje SYGNAŁ

| ID | p | Werdykt | Uzasadnienie |
|---|---|---|---|
| bt-01 (odczyt przez wewnętrzne API, nie MCP/ręcznie) | 0.85 | **HIT (osłabiony)** | Dokładnie ten mechanizm: fetch z zalogowanej sesji. ALE kontaminacja T0: pakiet T0 zrekonstruowano z pamięci, w której metoda fetch figuruje już przy stanie 20.07 — odkrycie obejścia mogło poprzedzać T0, więc predykcja jest częściowo opisem stanu zastanego, nie prognozą. |
| bt-02 (pośredni maszynowy artefakt inwentaryzacyjny, na którym zapadną dyspozycje) | 0.70 | **PARTIAL (słaby)** | Inwentaryzacja i grupowanie nastąpiły (WS1–WS6, mapowanie ID→strumień, duplikaty) — ale utrwalone jako wpis pamięci/plan sprintu, nie jako jednoekranowy artefakt decyzyjny (JSON/tabela/HTML); brak śladu formalnych dyspozycji per komentarz. Trafiona funkcja, nietrafiona forma i akt decyzji. |
| bt-03 (≥1 incydent timeout/zły plik/częściowy zapis → obejście: kopia robocza lub per-node) | 0.65 | **HIT (osłabiony)** | Timeouty use_figma na stronie 61 dzieci potwierdzone + obejście dokładnie w przewidzianej formie (kopia robocza + budowa na czystej stronie). Osłabienie: timeouty odczytu były już w pakiecie T0, więc częścią claimu jest quasi-pewnik; nowa jest tylko forma obejścia. |
| bt-04 (3 wersje jako osobne kopie, ręczna propagacja, ≥1 rozjazd) | 0.55 | **NIEROZSTRZYGNIĘTE** | 3 wersje nigdy nie zostały zmaterializowane jako osobne decki — projekt stanął na 11 slajdach draft w 3 kolumnach. Ryzyko "spójność 3 wersji" nazwane w planie sprintu, ale dryf nie mógł wystąpić, bo faza utrzymania wariantów nie nadeszła. |
| bt-05 (procedura odczytu komentarzy → SOP/wpis pamięci, przywoływana poza projektem) | 0.60 | **PARTIAL** | Utrwalona w auto-memory z gotchas (endpoint, timeouty, "buduj na czystej stronie") — tak. Przywołanie poza projektem: brak dowodu użycia na innym kliencie; jedyne "przywołanie" to cytowanie w kartach Genome, co nie jest użyciem operacyjnym. Druga połowa claimu niepotwierdzona. |
| bt-06 (sprint NIE zamknie wszystkich 22 komentarzy; ≥1 strumień otwarty) | 0.55 | **HIT (mocniejszy niż claim)** | Rzeczywistość gorsza: zamknięto ZERO z 22 — projekt zarchiwizowany w toku, wszystkie strumienie otwarte. Claim trafiony kierunkowo, ale skala niedoszacowana: Router przewidywał częściowe domknięcie, nastąpiło zatrzymanie całej pętli. |

Bilans SYGNAŁ: 2 HIT (oba osłabione kontaminacją T0), 2 PARTIAL, 1 nierozstrzygnięte, 1 HIT-niedoszacowany. Żaden hit nie jest "czysty" — struktura pudeł ważniejsza niż procent.

## Porównanie — mechanizmy

- **mech:agent-as-runtime — FULL HIT.** Rdzeń rzeczywistego przebiegu: wewnętrzne API + programowa budowa slajdów. Warunek z karty (weryfikacja po operacji) realizowany pośrednio przez pracę na kopii.
- **mech:working-artifact-extraction — FULL HIT.** Nowe slajdy wyprowadzone z brand systemu (tokeny palet per target, Fraunces+Work Sans), zero kreacji od zera. Bramka "zero stylów spoza destylatu" de facto spełniona.
- **mech:machine-narrows-human-picks — PARTIAL.** Maszyna zawęziła (strumienie, duplikaty, ekstrakcja treści), ale brak śladu drugiej połowy mechanizmu: człowiek-rozstrzyga na artefakcie decyzyjnym. Dyspozycje per komentarz nie zostały nigdzie zatwierdzone — mechanizm wykonany w połowie.
- **mech:single-source-compiler (light) — NIEUŻYTY / nierozstrzygnięty.** Podział rdzeń/warianty i checklista propagacji nie powstały; slajdy budowane od razu per target w 3 kolumnach. Projekt nie doszedł do fazy, w której mechanizm by się rozstrzygnął — ale nawet w draft nie ma śladu przygotowania pod ten podział, co sugeruje rekomendację przedwczesną wobec realnego horyzontu sprintu.
- **mech:session-to-sop — PARTIAL.** Wiedza utrwalona wyłącznie w auto-memory (nie repo/SOP), reużycie nieudowodnione. To dokładnie base-rate Routera ("procedura zostanie w pamięci sesyjnej") — czyli mechanizm zadziałał w trybie, który sam Router wykluczył z fitu; liczenie tego jako pełny hit byłoby autopromocją.
- **MISS (użyty, nierekomendowany): mech:sandbox-promotion.** Najważniejszy ruch bezpieczeństwa rzeczywistego przebiegu — kopia "Morisson (Copy)" + osobna strona draft, oryginał read-only — to podręcznikowy sandbox-promotion; karta mechanizmu SAMA cytuje ten projekt jako ev:sandbox-promotion-004. Router przemycił go jako krok workflow 4 ("budowa w kopii roboczej") bez nazwania mechanizmu — klasyczny błąd "mechanizm ukryty w kroku workflow", przez co selekcja nie dostaje kredytu ani karta evidence.

**Mechanizmy odrzucone — weryfikacja:** design-as-code odrzucony słusznie (praca została w Figmie). competitive-benchmarking, format-dictionary/deterministic-spine — słusznie, brak śladu potrzeby. **dated-commitment-gates — odrzucenie BŁĘDNE w uzasadnieniu:** Router uznał, że "zewnętrzny odbiorca = naturalna forcing function", po czym projekt z zewnętrznym odbiorcą stanął w miejscu na etapie draftu. Fakt, że feedback wisiał miesiącami (46 komentarzy) był w T0 i już wtedy falsyfikował tezę o naturalnej forcing function.

## Ryzyka Routera vs rzeczywistość

- R2 (timeouty/ciche błędy na ciężkim pliku): HIT — potwierdzone + obejście (osłabione: częściowo znane w T0).
- R5 (ostatnia mila — "dowiezione, niedoręczone"): HIT — zmaterializowane w pełni; projekt zarchiwizowany bez domknięcia pętli.
- R1 (use_figma pisze do aktywnego pliku): brak śladu incydentu — nierozstrzygnięte.
- R3 (dryf 3 wersji): nierozstrzygnięte (faza nie nadeszła).
- R4 (błędne mapowanie pin→slajd): brak śladu; wykrycie duplikatów C18=C37/C19=C38 sugeruje wręcz, że mapowanie działało dobrze — prawdopodobny fałszywy alarm.

## Raport 10 sekcji (CEO)

1. **Accuracy Routera:** predykcje SYGNAŁ ~2/6 czystych hitów po odjęciu kontaminacji T0 (bt-01 i bt-03 częściowo opisują stan zastany z pakietu T0 — słabość rekonstrukcji, nie prognozy). Ryzyka 2/5 hit, 1 prawdopodobny fałszywy alarm. Najcenniejsze trafienie: R5/bt-06 (stall ostatniej mili) — ale Router sam zdegradował mechanizm, który by to adresował.
2. **Accuracy Mechanism Selection:** 2/5 full (agent-as-runtime, working-artifact-extraction), 2/5 partial (machine-narrows, session-to-sop), 1/5 nieużyty (single-source-compiler). Miss: sandbox-promotion (użyty, nierekomendowany — mimo że karta cytuje ten projekt). Fit ≈ 50–60% po uczciwym liczeniu.
3. **Największe błędy:** (a) sandbox-promotion przemycony jako krok workflow zamiast nazwany jako mechanizm — Router nie rozpoznaje mechanizmu we własnym planie; (b) błędne uzasadnienie odrzucenia dated-commitment-gates ("naturalna forcing function") sfalsyfikowane przez sam T0 (feedback wiszący miesiącami) i przez wynik (stall); (c) przewidywany rezultat ("pętla domknięta, 3 wersje gotowe") zbyt optymistyczny — Router przewidział ryzyko ostatniej mili i nie przełożył go na przewidywany rezultat; (d) kontaminacja pakietu T0 rozwiązaniami już odkrytymi (fetch, timeouty) zawyża p i wartość dowodową bt-01/bt-03.
4. **Największe sukcesy:** para agent-as-runtime × working-artifact-extraction opisała 100% tego, co realnie powstało (inwentarz komentarzy + 11 slajdów w tokenach brandu); bt-06 trafnie wskazał, że pętla się nie domknie — wbrew własnemu workflow Routera.
5. **Nowe mechanizmy (hipotezy):** mech:comment-stream-inventory (kandydat Routera) częściowo potwierdzony — inwentarz strumieni powstał i był nośny; do potwierdzenia na drugim kliencie. Reguła-para: "agent-as-runtime w cudzym/produkcyjnym pliku ⇒ sandbox-promotion obowiązkowo w pakiecie" (analogia do pary deterministic-spine×incident-to-guard z briefsync).
6. **Mechanizmy do usunięcia:** brak. single-source-compiler (light) — nie usuwać, ale doprecyzować anti-context: rekomendacja kompilatora w narzędziu bez natywnej kompilacji (Figma) bez wskazania konkretnej implementacji = rekomendacja pusta, nieegzekwowalna bramką.
7. **Confidence Changes (PROPOZYCJE — zapis robi sesja główna):** (a) agent-as-runtime: przeklasyfikować ev:agent-as-runtime-002 narracja→postmortem (te same fakty zweryfikowane źródłowo), BEZ podbicia confidence — dedupe per projekt (niezmiennik 10, wzorzec E3 briefsync); (b) sandbox-promotion: analogicznie ev:sandbox-promotion-004 narracja→postmortem bez podbicia + nowy trigger w karcie: "praca programowa w cudzym ciężkim pliku Figma"; (c) dated-commitment-gates: flaga wrong-trigger — do warunków dodać "projekt, którego feedback już raz utknął na tygodnie, NIE ma naturalnej forcing function mimo zewnętrznego odbiorcy"; (d) machine-narrows-human-picks: nota w failure_conditions — "połówkowe wykonanie: maszyna zawęża, ale akt ludzkiego rozstrzygnięcia nigdy nie następuje" (bez zmiany confidence); (e) single-source-compiler: anti-context jw., bez zmiany confidence.
8. **Nowe hipotezy:** (i) "draft zbudowany ≠ pętla domknięta" — sprint kończący się artefaktem draft bez aktu doręczenia to odrębna klasa stallu, słabo pokryta kartami; (ii) połówkowe machine-narrows (zawężenie bez rozstrzygnięcia) może być systematycznym failure mode, nie jednostkowym — sprawdzić w kolejnych backtestach; (iii) comment-stream-inventory jako sprzedawalny mechanizm — czeka na drugi projekt Figmowy z feedbackiem klienta.
9. **Czego Genome nie wiedziało w T0:** że projekt w ogóle się zatrzyma (przyczyna stallu — priorytety? decyzje Jana? — nieznana do dziś, żaden mechanizm jej nie modeluje); że mapowanie pin→slajd okaże się bezproblemowe (duplikaty wykryte poprawnie) — Genome przeszacowuje ryzyko techniczne, niedoszacowuje ryzyka decyzyjno-priorytetowego; że rekonstrukcja T0 z pamięci pisanej PO odkryciach zanieczyszcza pakiet T0 rozwiązaniami (problem metodologiczny protokołu, nie kart).
10. **Jak następny projekt będzie lepszy:** każda rekomendacja agent-as-runtime na cudzym zasobie automatycznie dokłada sandbox-promotion jako nazwany mechanizm z bramką; każdy krok workflow Routera jest sprawdzany pytaniem "czy to jest istniejąca karta?"; projekt z historią zamrożonego feedbacku dostaje dated-commitment-gates zamiast założenia o naturalnej forcing function; przewidywany rezultat musi być spójny z własnym ryzykiem #1 Routera (jeśli top-ryzyko = stall ostatniej mili, rezultat nie może zakładać domkniętej pętli bez bramki, która to wymusza).

## Evidence (propozycje zapisu — JSON do kart robi sesja główna)

- E1 {observation: "Router nie rozpoznał sandbox-promotion we własnym planie — 'budowa w kopii roboczej' to krok workflow 4, podczas gdy rzeczywisty przebieg ('Morisson (Copy)' + strona draft, oryginał read-only) jest cytowany w karcie jako ev:sandbox-promotion-004"; proof: "memory/osada-orle-deck-sponsorski.md (stan 02.08.2026) + mechanisms/sandbox-promotion.md ev-004 (skan 07.08.2026)"; impact: "miss selekcji klasy 'mechanizm ukryty w kroku workflow' — karta nie dostaje evidence, pary mechanizmów się nie utrwalają"; proposed_change: "checklista Routera: każdy krok workflow mapowany na kartę lub jawnie oznaczony 'poza Genome'; trigger sandbox-promotion += 'praca programowa w cudzym ciężkim pliku'"; mechanisms: [sandbox-promotion]}
- E2 {observation: "Odrzucenie dated-commitment-gates uzasadnione 'naturalną forcing function zewnętrznego odbiorcy' — sfalsyfikowane: projekt z czekającym Janem stanął na 11 slajdach draft, 0/22 komentarzy zamkniętych, import do Genome jako archived-w-toku"; proof: "proj:osada-orle-deck-morisson.md (status przy imporcie, 07.08.2026) vs memory 02.08.2026 (plan sprintu P0/P1)"; impact: "błędny warunek odrzucenia: istnienie odbiorcy nie tworzy forcing function, gdy feedback już raz utknął na tygodnie"; proposed_change: "wrong-trigger w karcie dated-commitment-gates: historia zamrożonego feedbacku = wskazanie ZA bramką datową, nie przeciw"; mechanisms: [dated-commitment-gates]}
- E3 {observation: "machine-narrows wykonany połówkowo: zawężenie maszynowe pełne (6 strumieni, duplikaty C18=C37/C19=C38, ekstrakcja treści), akt ludzkiego rozstrzygnięcia (dyspozycje per komentarz) bez śladu"; proof: "memory/osada-orle-deck-sponsorski.md 02.08.2026 (strumienie WS1–WS6, brak zapisu decyzji)"; impact: "mechanizm może 'działać' w połowie i nie dowozić wartości decyzyjnej — fit liczony po samym zawężeniu jest zawyżony"; proposed_change: "failure_condition w machine-narrows: 'zawężenie bez zaplanowanego aktu rozstrzygnięcia = mechanizm niedokończony'"; mechanisms: [machine-narrows-human-picks]}
- E4 {observation: "Kontaminacja pakietu T0: metoda fetch wewnętrznego API i timeouty 61-dzieci figurują w pamięci przy stanie 20.07, czyli prawdopodobnie były znane przed/na T0 — bt-01 (p=0.85) i bt-03 (p=0.65) częściowo opisują stan zastany"; proof: "memory/osada-orle-deck-sponsorski.md ('Stan na 2026-07-20: ... Komentarze czytane przez wewnętrzne API') vs pakiet T0 przebiegu A"; impact: "zawyżona accuracy predykcji rekonstruowanych z pamięci pisanej po odkryciach"; proposed_change: "PROTOKOL: przy rekonstrukcji T0 z pamięci oznaczać fakty 'odkrycie przed T0?' i degradować hity oparte o nie do 'osłabionych'"; mechanisms: []}
- E5 {observation: "Realny przebieg = pełne pokrycie przez parę agent-as-runtime × working-artifact-extraction (inwentarz przez wewnętrzne API + 11 slajdów wyłącznie z tokenów brandu: granat+mosiądz / papier+las, Fraunces+Work Sans)"; proof: "memory/osada-orle-deck-sponsorski.md 02.08.2026"; impact: "potwierdzenie retro (typ postmortem) dla obu mechanizmów — z zastrzeżeniem dedupe wobec evidence ze skanu CKO tego samego projektu"; proposed_change: "przeklasyfikować ev:agent-as-runtime-002 i ev:sandbox-promotion-004 narracja→postmortem, bez podwójnego podbicia confidence"; mechanisms: [agent-as-runtime, working-artifact-extraction]}
