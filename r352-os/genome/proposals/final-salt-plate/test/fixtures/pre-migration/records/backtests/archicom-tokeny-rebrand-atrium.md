---
id: "rec:backtests/archicom-tokeny-rebrand-atrium"
type: "record"
title: "Backtest — archicom-tokeny-rebrand-atrium"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — archicom-tokeny-rebrand-atrium

Data: 2026-08-09 · Protokół: PROTOKOL.md · Przebieg B (porównanie z rzeczywistością)
T0 ≈ czerwiec 2026 (praca ~24.06 wg wieku pamięci archicom-brand.md: 45 dni na 08.08). Źródła przebiegu rzeczywistego: memory/archicom-brand.md (~24.06.2026), memory/archicom-prezenter-reymonta.md (07.08.2026), karta proj:archicom-tokeny-rebrand-atrium (import CKO 07.08), evidence w kartach sandbox-promotion / working-artifact-extraction (skan CKO 07.08), GENOME-OS-SNAPSHOT-2026-08-08.md. Brak katalogu kodu — praca wykonana w pliku Figmy klienta (fileKey hlWsYrPNcqrGOKP5zhVukh), skrypty sesyjne nie przeżyły (zgodne z base-rate, poza fitem).

## Pakiet T0 (skrót)

Archicom zleca rebrand 16-stronicowego folderu atrium NOWY SZCZEPIN (stara stylistyka zieleń/earthy + Montserrat) do nowej identyfikacji. Znana komplikacja: formalne zmienne Figmy ≠ realna paleta; referencją jest zaakceptowany element „bulwar północny" (node 108:79). Praca w pliku Figmy klienta. Cel podwójny: rebrand + trwały destylat tokenów pod kolejne zlecenia.

## Skrót raportu Routera (przebieg A — nie poprawiany)

Rekomendowane: working-artifact-extraction (rdzeń), sandbox-promotion, single-source-compiler, design-as-code (wariant Figma-programmatic), session-to-sop. Odrzucone: format-dictionary, proof-first-demo-pitch, seo-aeo-foundation, competitive-benchmarking, deterministic-spine/machine-narrows-human-picks. Workflow 5 kroków z 4 bramkami. Top ryzyka: zła referencja, destylat umiera w notatce, incydent w pliku klienta, cicha degradacja przy masowej podmianie (reflow), scope creep. 6 predykcji bt: (sygnał).

## Porównanie predykcji-SYGNAŁ z rzeczywistością

**bt-01 (p=0.85, non-destruktywnie na osobnej nazwanej stronie) — HIT.** Rebrand wykonany na osobnej stronie „atrium – REBRAND (Archicom)", dodatkowo powstała strona „🎨 Design System (Archicom)"; oryginalna „Page 1" nietknięta. Dowód: memory/archicom-brand.md (~24.06.2026); ev:sandbox-promotion-003 (skan 07.08). Trafienie precyzyjne co do formy (jawnie nazwana strona, nie kopia pliku).

**bt-02 (p=0.75, rozbieżność jawnie nazwana; źródło = ekstrakcja z referencji, nie oficjalne tokeny) — HIT.** Pamięć utrwala wprost: „Reference style that matters = bulwar północny (108:79), NOT the broad variable set"; szeroki zestaw zmiennych (node 5:544: Black Pearl, Comet, Aqua Haze) zidentyfikowany i jawnie ODRZUCONY jako nieużywany przez referencję. Dowód: memory/archicom-brand.md (~24.06.2026). Zastrzeżenie: brak śladu, że rozbieżność została nazwana WOBEC KLIENTA (bramka 1 Routera) — nazwanie jest wewnętrzne; klaim predykcji spełniony, bramka workflow niezweryfikowana.

**bt-03 (p=0.65, restyle programowo, nie ręcznie) — HIT.** „Rebrand 16 stron wykonany programowo na osobnej stronie" — dowód: ev:sandbox-promotion-003 (skan CKO 07.08); pośrednio loadFontAsync w pamięci (~24.06) = praca przez Plugin API, nie ręczna.

**bt-04 (p=0.55, destylat NIE jako biblioteka/repo, tylko notatka/pamięć) — HIT.** Karta projektu: „tokeny zdestylowane do pamięci systemu"; failure mode w karcie working-artifact-extraction nazywa to wprost: „tokeny Archicom istnieją jako notatka w auto-memory, nie jako opublikowana biblioteka Figma". Dowód: proj:archicom-tokeny-rebrand-atrium (import 07.08) + karta WAE (07-08.08). Niuans: w pliku klienta powstała strona „Design System (Archicom)" — częściowy artefakt in-file, ale nie biblioteka ani repo. Eksperyment w karcie WAE (08.08) planuje formalizację dopiero przy Reymoncie — potwierdza, że do dziś destylat maszynowy nie istnieje.

**bt-05 (p=0.60, substytucja fontu wymusi ≥1 rundę ręcznych korekt) — HIT (słaby/generyczny w klaimie, pouczający w mechanice).** Runda korekt była, ale klasa błędu INNA niż przewidziana: nie reflow/łamanie tekstu, tylko (a) tekst zdublowany jako wektorowe obrysy glifów (artefakt eksportu PDF/InDesign) — podmiana fontu rozjechała pary TEXT/wektor w widoczne dublowanie, fix = ukrywanie wektorów w bbox żywego tekstu; (b) font docelowy „Pretty Var" niezainstalowany w środowisku pliku folderu (loadFontAsync fail) → cichy fallback nagłówków na Inter. Dowód: gotcha w memory/archicom-brand.md (~24.06.2026). Klaim trafiony, model przyczynowy chybiony — Genome nie zna klasy „artefakty importu" ani „parytet środowiska fontów".

**bt-06 (p=0.55, destylat realnie użyty w kolejnym zleceniu Archicom w 3 mies.) — PARTIAL / nierozstrzygnięte (okno do ~09.2026), na 08.08 lean-HIT z ważnym ALE.** Kolejne zlecenie istnieje (prezenter Przystań Reymonta, deadline 10.08) i notatka-destylat została realnie użyta: link [[archicom-brand]] w karcie Reymonty, fileKeys, fonty, gotchas przeniesione. ALE paleta NIE przeszła 1:1 — brand inwestycji Reymonta ma własne KV („ZERO różu w brandzie inwestycji", okładka #222B43, klein #2E3E90) i kolory zostały ZMIERZONE NA NOWO z PDF/KV (07.08), nie wzięte z destylatu. Dowód: memory/archicom-prezenter-reymonta.md (07.08.2026). Wniosek strukturalny: destylat był na złym poziomie abstrakcji — Archicom to marka-matka + sub-brandy per inwestycja; „jeden destylat marki" nie transferuje bez warstwy inwestycji.

**Ryzyka Routera:** R2 (destylat w notatce) HIT; R3 (incydent w pliku klienta) — nie wystąpił, governance zadziałało (kredyt dla bt-01, nie osobny hit); R4 (cicha degradacja) HIT co do klasy „cicho", pudło co do mechanizmu (reflow vs dublowanie glifów/fallback fontu); R1 (zła referencja) i R5 (scope creep) — brak śladu, nierozstrzygnięte, nie liczone.

**Zastrzeżenie hindsight (PROTOKOL pkt 1):** wykonawca przebiegu A mógł znać wynik; wartość dowodowa % trafień ograniczona — realna wartość = struktura pudeł (klasa błędu fontów, poziomy brandu).

## Raport 10 sekcji (CEO)

1. **Accuracy Routera:** predykcje-sygnał 5/6 HIT (w tym 1 słaby — bt-05 trafiony klaim, chybiona mechanika), 1 PARTIAL/nierozstrzygnięty (bt-06, okno biegnie; użycie destylatu częściowe). Ryzyka: 2 wyraźne HIT (R2, R4-częściowo), 1 nie-zdarzenie zgodne z governance (R3), 2 nierozstrzygnięte. Problem biznesowy i typ projektu nazwane trafnie.

2. **Accuracy Mechanism Selection:** pełne trafienia 3/5 — working-artifact-extraction (rdzeń, ekstrakcja z 108:79 dokładnie tak przebiegła), sandbox-promotion (strona REBRAND + Page 1 nietknięta), design-as-code (restyle programowy; ostrzeżenie karty „cicho psują output" zmaterializowało się literalnie ×2). Częściowe 2/5 — single-source-compiler (mapowanie programowe było, ale żaden trwały „kompilator" nie powstał i nie był potrzebny: restyle jednorazowy, bez cyklu zmian tokenu; karta się nie amortyzuje), session-to-sop (destylat wylądował w auto-memory jako wykonawcza notatka z gotchas i TO ZADZIAŁAŁO przy Reymoncie — ale Router spiął ten mechanizm z bramką „repo/biblioteka", która nie zaszła). Wrong: 0. Missed-used: 0. Odrzucenia wszystkie zasadne. Fit ≈ 80%.

3. **Największe błędy:** (a) zła klasa błędu typograficznego — Router przewidział reflow, rzeczywistość dała dublowanie glifów z artefaktu eksportu PDF/InDesign + cichy fallback niedostępnego fontu; żadna karta nie zna tych klas; (b) destylat na złym poziomie abstrakcji — Genome/Router nie modelują struktury „marka-matka + sub-brand inwestycji" (paleta atrium/bulwar ≠ paleta Reymonty, „zero różu"); bt-06 zbudowane na fałszywym założeniu transferu 1:1; (c) wewnętrzna sprzeczność kart: working-artifact-extraction traktuje „destylat w notatce" jako czysty failure mode, a session-to-sop twierdzi, że auto-memory z auto-loadem to gwarantowany kanał dystrybucji — Reymonta pokazuje, że notatka auto-memory przeniosła realną wartość (fileKeys, fonty, gotchas), choć nie paletę.

4. **Największe sukcesy:** para working-artifact-extraction × sandbox-promotion przewidziała formę wykonania niemal literalnie (osobna nazwana strona, ekstrakcja z 108:79 zamiast zmiennych 5:544); design-as-code z ostrzeżeniem o cichej degradacji trafił w samo sedno (dwa ciche zepsucia wykryte dopiero wizualnie); bt-04 (destylat umrze w notatce) trafiony wbrew deklarowanemu celowi projektu — karta zna własny failure mode lepiej niż plan.

5. **Nowe mechanizmy (hipotezy):** mech:brand-layering — destylat brandu musi mieć jawne warstwy (marka-matka / sub-brand inwestycji-produktu / element), ekstrakcja jednowarstwowa nie transferuje między pochodnymi; guard:font-environment-parity — przed masową substytucją fontów weryfikacja dostępności fontu docelowego w środowisku pliku docelowego (loadFontAsync-check), inaczej cichy fallback; guard:import-artifact-sweep — plik z importu PDF/InDesign skanować pod duplikaty tekst-jako-wektor PRZED restylem (klasa: artefakty konwersji formatów).

6. **Mechanizmy do usunięcia:** brak. single-source-compiler do doprecyzowania anti-contextu: „jednorazowy restyle bez przewidywanego cyklu zmian tokenów = wystarczy programowa mapa substytucji; kompilator się nie amortyzuje" (rekomendacja była nieszkodliwa, ale inflacyjna).

7. **Confidence Changes (PROPOZYCJE — zapis robi sesja główna):** working-artifact-extraction i sandbox-promotion: evidence tego projektu istnieje już jako narracja ze skanu CKO 07.08 — dedupe per projekt (niezmiennik 10): przeklasyfikowanie narracja→postmortem (fakty zweryfikowane źródłowo w pamięci), BEZ podbicia confidence. design-as-code: +failure_condition (klasy: import-artifact, font-environment) — nowe fakty, evidence postmortem bez podbicia (jeden projekt). working-artifact-extraction: doprecyzować failure mode „destylat w notatce" → „notatka BEZ automatycznego kanału dystrybucji; auto-memory z auto-loadem przenosi wiedzę operacyjną, ale nie zastępuje maszynowego destylatu tam, gdzie potrzebna jest paleta/tokeny per warstwa". single-source-compiler: +anti-context jw., flaga too-broad.

8. **Nowe hipotezy:** bt-06 pozostaje żywe do ~09.2026 — eksperyment Reymonta w karcie WAE (mini-tokens.json jako biblioteka vs notatka, pomiar rund poprawek Marty) rozstrzygnie zarówno bt-06, jak i spór notatka-vs-biblioteka; hipoteza brand-layering testowalna od razu na Reymoncie (ile tokenów marki-matki przeżyło do prezentera vs ile było per inwestycja).

9. **Czego Genome nie wiedziało w T0:** że pliki folderów Archicom pochodzą z eksportu PDF/InDesign i niosą tekst zdublowany jako wektory; że środowisko fontów pliku docelowego może nie mieć fontu marki (Pretty Var) i fallback jest cichy; że brand Archicom jest warstwowy (per inwestycja własne KV — paleta nie transferuje między folderami); że notatka auto-memory realnie przenosi wartość operacyjną do następnego zlecenia (częściowa falsyfikacja własnego failure mode).

10. **Jak następny projekt będzie lepszy:** każdy restyle pliku Figma z importu dostaje z automatu: sweep duplikatów tekst/wektor + check dostępności fontów docelowych PRZED masową podmianą; każda ekstrakcja brandu klienta wielo-produktowego (deweloper, sieć) zaczyna od pytania o warstwy (co jest marką-matką, co sub-brandem) i destylat dostaje strukturę warstwową; bramka „destylat poza sesją" rozróżnia dwa poziomy: wiedza operacyjna (auto-memory wystarcza) vs tokeny maszynowe (wymagana biblioteka/repo).

## Evidence (do zapisania w kartach + Ledger przez sesję główną)

- E1 {obserwacja: rebrand wykonany dokładnie wg pary WAE×sandbox-promotion — ekstrakcja z 108:79 zamiast zmiennych 5:544, praca na stronie „atrium – REBRAND (Archicom)", Page 1 nietknięta, restyle programowy; dowód: memory/archicom-brand.md (~24.06.2026) + ev:sandbox-promotion-003 / ev:working-artifact-extraction-001 (skan 07.08); wpływ: potwierdzenie pary mechanizmów dla pracy w zasobie klienta; zmiana: przeklasyfikowanie istniejących ev narracja→postmortem, dedupe per projekt — BEZ podbicia confidence; mech: working-artifact-extraction, sandbox-promotion}
- E2 {obserwacja: masowa substytucja fontów cicho zepsuła output dwiema nieznanymi Genome klasami — dublowanie glifów (tekst zdublowany jako wektory z eksportu PDF/InDesign) i cichy fallback niedostępnego fontu (Pretty Var → Inter, loadFontAsync fail); dowód: gotcha w memory/archicom-brand.md (~24.06.2026); wpływ: predykcja bt-05 trafiła klaim, chybiła mechanizm — luka klas błędów; zmiana: +failure_condition w design-as-code, hipotezy guard:import-artifact-sweep i guard:font-environment-parity; confidence: postmortem bez podbicia; mech: design-as-code}
- E3 {obserwacja: destylat-notatka auto-memory przeniósł realną wartość do kolejnego zlecenia (Reymonta: fileKeys, fonty, gotchas przez [[archicom-brand]]), ale paleta wymagała re-ekstrakcji z KV inwestycji („zero różu", #222B43 vs #051F59) — brand jest warstwowy; dowód: memory/archicom-prezenter-reymonta.md (07.08.2026, szkic Figma z kolorami zmierzonymi z PDF); wpływ: bt-06 częściowe, failure mode „notatka = śmierć destylatu" zbyt absolutny, brak wymiaru warstw brandu; zmiana: doprecyzowanie failure mode WAE + hipoteza mech:brand-layering; confidence: bez zmian; mech: working-artifact-extraction, session-to-sop}
- E4 {obserwacja: single-source-compiler rekomendowany, ale jednorazowy restyle bez cyklu zmian tokenów nie amortyzuje kompilatora — powstała programowa mapa substytucji (dobra), żaden trwały kompilator (i słusznie); dowód: brak katalogu kodu projektu / brak śladu reużywalnego skryptu (stan repo 09.08.2026), karta proj (import 07.08); wpływ: rekomendacja inflacyjna, nieszkodliwa; zmiana: +anti-context w karcie, flaga too-broad; confidence: bez zmian; mech: single-source-compiler}
