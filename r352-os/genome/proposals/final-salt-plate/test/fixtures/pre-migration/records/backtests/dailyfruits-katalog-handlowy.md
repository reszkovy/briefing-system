---
id: "rec:backtests/dailyfruits-katalog-handlowy"
type: "record"
title: "Backtest — dailyfruits-katalog-handlowy"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — dailyfruits-katalog-handlowy

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
Źródła przebiegu rzeczywistego: memory/dailyfruits-katalog-handlowy.md (16.07.2026), karta proj:dailyfruits-katalog-handlowy, git repo ~/Fruityyyy (log per plik + diff danych).

## Pakiet T0 (zrekonstruowany — przebieg A)

DailyFruits / Better Workplace zgłasza brak cyfrowego narzędzia handlowego: oferta tylko w drukowym PPTX/PDF, bez interaktywnej wyceny per liczba pracowników. Cel: jedno miejsce online (katalog + kalkulator) dla zespołu handlowego, na produkcyjnej domenie dailyfruits.pl z pieczołowitą architekturą SEO. Założenia T0: treść wyłącznie w artefakcie klienta (ekstrakcja, nie wymyślanie), logika wyceny w głowach handlowców.

**UWAGA (ustalone w przebiegu B): sam pakiet T0 był błędnie zrekonstruowany** — patrz sekcja „Czego Genome nie wiedziało w T0". Nie poprawia to przebiegu A; obniża wartość dowodową predykcji opartych o fałszywą premisę (bt-04, częściowo bt-03).

## Skrót raportu Routera T0 (przebieg A — bez zmian)

- Rekomendowane: mech:single-source-compiler (rdzeń: oferta.json → katalog+kalkulator), mech:working-artifact-extraction (PPTX→destylat), mech:deterministic-spine (kalkulator = rule engine), mech:split-url-architecture (guard: noindex/poza sitemapą), mech:competitive-benchmarking (light, test-first).
- Odrzucone: rój agentów/LLM w produkcie, Phantom-Browser/ux-domain-audit.
- Workflow: ekstrakcja→Bramka 1 (klient potwierdza dane)→benchmark→generacja→Bramka 2 (drift guard skryptowy)→Bramka 3 (checklist niewidoczności)→Bramka 4 (walidacja wycen z handlowcem).
- Top ryzyka: rozjazd cen między widokami; wyciek cennika; logika wymyślona zamiast wyekstrahowana; martwe źródło; brak adopcji.
- Predykcje SYGNAŁ: bt-01..bt-06 (pełne brzmienia w raporcie routera T0).

## Przebieg B — rzeczywistość (fakty źródłowe)

- `katalog-produktow.html` istnieje w repo od **22.05.2026** (commit 83e68d8 „nowa strona + packshoty", 31fc16b „Przywróć kalkulator OBLICZ", ef0ef99 „BW default + price ranges in calculator" — wszystkie 22.05).
- Publiczny `/kalkulator` (kalkulator.html) istnieje od **20.05.2026** (commit 9e70c79) — DWA MIESIĄCE PRZED „projektem".
- 29.06 (486cbc7): strony wewnętrzne wykluczone z deployu przez `.vercelignore` — katalog żył w repo, ale nie na produkcji.
- **16.07.2026**: publikacja — 2481524 (wyjęcie z .vercelignore → LIVE /katalog-produktow, hasło client-side, X-Robots-Tag noindex, poza nawigacją/sitemapą; przy okazji naprawa 4 martwych redirectów), c2da6a0 (zmiana hasła Katalog2026→BetterW2026 tego samego dnia), 5b2c0c7 (skryptowe wyodrębnienie modułu kalkulatora do standalone `/kalkulator-programu` — noindex + robots Disallow, **BEZ hasła**).
- Dane cen: `const CATS` zduplikowany w dwóch plikach (katalog-produktow.html:1033, kalkulator-programu.html:536); diff bloków na 08.08.2026 = **identyczne** (kopia skryptowa 1:1, zero rozjazdu po ~3 tygodniach). Żaden `oferta.json` nie powstał.
- Brak śladu: benchmarku, ekstrakcji z PPTX klienta, rundy pytań do klienta o logikę wyceny, skryptu audytu spójności, walidacji wycen z handlowcem.

## Porównanie predykcji SYGNAŁ

| ID | Werdykt | Uzasadnienie |
|---|---|---|
| bt-01 (p=0.85) statyczne strony w repo Fruityyyy, bez backendu | **HIT** | katalog-produktow.html + kalkulator-programu.html w repo, Vercel, kalkulator w czystym JS client-side. Trafienie specyficzne, choć o niskiej śmiałości (infrastruktura wymuszała ten wynik). |
| bt-02 (p=0.70) hasło client-side + noindex + poza sitemapą; brak prawdziwego auth | **HIT (z zastrzeżeniem)** | Dokładnie tak dla katalogu (`if(inp.value==='BetterW2026')`, sessionStorage, X-Robots-Tag). Zastrzeżenie: /kalkulator-programu opublikowany ŚWIADOMIE BEZ hasła — jedna trzecia narzędzia ma ochronę słabszą niż przewidziana; router nie przewidział trójwarstwowości dostępu. |
| bt-03 (p=0.55) wystąpi realna niespójność cen między widokami | **MISS** | Diff CATS katalog vs kalkulator-programu = identyczne (08.08). Kopia skryptowa 1:1 + zamrożone dane = zero rozjazdu przez ~3 tygodnie. Struktura podatności istnieje (duplikacja), ale claim wymagał ZDARZENIA — nie wystąpiło. |
| bt-04 (p=0.60) ekstrakcja ujawni braki logiki wyceny → runda pytań do klienta | **MISS / premisa fałszywa** | Żadna ekstrakcja z PPTX się nie odbyła — ceny wpisane w stronę już 22.05 (ef0ef99). Brak śladu jakiejkolwiek rundy dopytania klienta. Predykcja zbudowana na błędnej rekonstrukcji T0. |
| bt-05 (p=0.45) powstanie/zostanie zaplanowany publiczny wariant kalkulatora jako lead-gen | **MISS (odwrócona przyczynowość)** | Publiczny /kalkulator istniał od 20.05 — PRZED narzędziem handlowym, jako osobny, prostszy artefakt (inne dane, inny brand). Nic nie wywiedziono z silnika wewnętrznego. |
| bt-06 (p=0.75) klient nie dostanie panelu edycji danych katalogu w v1 | **HIT (słaby/generyczny)** | Brak panelu dla CATS; CMS /admin edytuje produkty serwisu publicznego, nie dane narzędzia handlowego. Trafienie blisko base-rate („nikt nie zamówił CMS-a, więc nie powstał"). |

**Bilans SYGNAŁ: 3/6 (w tym 1 słaby). Kalibracja: dwie najpewniejsze predykcje (0.85, 0.75) trafione, środek rozkładu (0.55–0.70) w połowie chybiony — ale bt-04 i bt-05 to pudła STRUKTURALNE (zła premisa), nie pechowe.**

## Porównanie ryzyk

- Ryzyko 2 (wyciek cennika) — **HIT co do mitigacji** (noindex+hasło+poza nawigacją zrealizowane 1:1), ale częściowo zaakceptowane w praktyce (kalkulator bez hasła).
- Ryzyko 1 (rozjazd widoków) — **nie zmaterializowane** (jak bt-03); struktura podatna, koszt zerowy do dziś.
- Ryzyko 3 (logika wymyślona) — **nierozstrzygnięte i NADAL OTWARTE**: brak jakiegokolwiek śladu potwierdzenia cen CATS przez klienta; to jedyne ryzyko, które może dziś realnie tykać.
- Ryzyka 4 (martwe źródło) i 5 (adopcja) — **nierozstrzygnięte** (brak danych o użyciu i aktualizacjach po 16.07).
- **Ryzyko nieprzewidziane, które WYSTĄPIŁO:** publikacja ukrytej strony zmieniła routing produkcji (4 martwe redirecty /katalog* nagle ożyły — akurat na plus, ale to czysty przypadek, że skutek uboczny był korzystny).

## Raport 10 sekcji (CEO)

1. **Accuracy Routera:** predykcje 3/6 (1 słabe); ryzyka: 1 hit mitigacyjny, 1 fałszywy alarm (rozjazd), 3 nierozstrzygnięte, 1 klasa nieprzewidziana (routing przy publikacji). Najgłębszy problem NIE jest w liczbach: router opisał projekt, który się nie wydarzył (greenfield ekstrakcja PPTX→JSON→generacja), podczas gdy realny projekt to „opublikuj istniejącą ukrytą stronę + wytnij skryptem wariant standalone". Wartość raportu T0 dla wykonawcy byłaby mieszana: bramka niewidoczności bezcenna, reszta workflow fikcyjna.
2. **Accuracy Mechanism Selection:** 2/5 pełne (split-url-architecture — zrealizowany wzorcowo, z dyscypliną lepszą niż karta zna, tj. deploy-gate przez .vercelignore; deterministic-spine — kalkulator to czysty rule engine, trafienie poprawne ale mało śmiałe), 0/5 częściowe, **3/5 nietrafione/nieużyte** (single-source-compiler — „rdzeń projektu" NIGDY nie powstał, dane zduplikowane i nic złego się nie stało; working-artifact-extraction — treść nie pochodziła z artefaktu klienta; competitive-benchmarking — zero śladu). Fit ≈ 40%. Do tego 2 realnie użyte wzorce bez kart (sekcja 5).
3. **Największe błędy:** (a) błędna rekonstrukcja T0 — Genome nie wiedziało, że katalog istnieje w repo od 22.05, a publiczny kalkulator od 20.05, więc router wymyślił projekt ekstrakcyjny; (b) SSC rekomendowany jako rdzeń tam, gdzie jednorazowa kopia skryptowa zamrożonych danych wystarczyła — router nadużywa swojego ulubionego mechanizmu; (c) bt-05 z odwróconą przyczynowością (publiczny kalkulator był przodkiem, nie potomkiem); (d) nieprzewidziana trójwarstwowość dostępu (hasło / noindex-bez-hasła / publiczny) — realna decyzja produktowa, której model „wewnętrzne vs publiczne" nie mieści.
4. **Największe sukcesy:** (a) bramka niewidoczności (Bramka 3) przewidziana niemal 1:1 z rzeczywistą checklistą publikacji (hasło, noindex, poza sitemapą/nawigacją) — split-url-architecture jako guard graniczny działa; (b) bt-01 i bt-06 trafione — router dobrze czyta przymusy infrastrukturalne klienta (statyczny Vercel, brak zamówienia na CMS); (c) odrzucenia (LLM w produkcie, Phantom-Browser) trafne — nic takiego nie powstało i nie było potrzebne.
5. **Nowe mechanizmy (hipotezy, NIE zakładać kart bez sesji głównej):** (a) **module-extraction-by-script** — wyodrębnienie modułu z istniejącej strony skryptem tnącym zakresy linii (style+markup+dane+funkcje) do standalone artefaktu, ze świadomą akceptacją duplikacji danych; realnie użyte (5b2c0c7), żadna karta tego nie opisuje; (b) **deploy-gate przez .vercelignore** — artefakt commitowany w repo, ale wycięty z deployu do jawnej decyzji publikacji (486cbc7→2481524); kandydat na guard, spina się z split-url-architecture.
6. **Mechanizmy do usunięcia:** brak twardych kandydatów. mech:competitive-benchmarking dostaje drugi z rzędu wynik „rekomendowany, nieużyty" w backteście — jeśli powtórzy się w kolejnych transzach, kandydat do degradacji z domyślnej rotacji lekkich rekomendacji.
7. **Confidence Changes (PROPOZYCJE — zapis robi sesja główna):** (a) mech:split-url-architecture: +evidence typu postmortem (E2), zasłużone podbicie; (b) mech:deterministic-spine: +evidence postmortem słabe (trafienie mało dyskryminujące) — proponuję evidence bez podbicia confidence; (c) mech:single-source-compiler: BEZ podbicia + flaga warunku brzegowego (E1): SSC jest rdzeniem tylko gdy dane ŻYJĄ (częste zmiany); przy danych zamrożonych kopia skryptowa ma lepszy stosunek kosztu do ryzyka; (d) mech:working-artifact-extraction: BEZ zmian confidence + flaga wrong-trigger (E3): karta odpala się na deklarację „treść jest w artefakcie klienta" bez weryfikacji, gdzie treść naprawdę żyje.
8. **Nowe hipotezy:** (a) router potrzebuje kroku zero „inwentaryzacja istniejących artefaktów" (git log/glob po domenie klienta) PRZED doborem mechanizmów — połowa błędów tego backtestu znika, gdy router wie, co już istnieje; (b) klasa ryzyka „publikacja zmienia routing": każde wyjęcie strony spod ukrycia na żywej domenie musi mieć sprawdzenie wpływu na istniejące redirecty/URL-e; (c) bramki workflow bez mechanizmu egzekucji nie istnieją — żadna z 4 bramek routera nie ma śladu wykonania w projekcie pre-Genome; wartość bramek zależy od tego, czy Genome umie je wymusić, nie tylko zalecić.
9. **Czego Genome nie wiedziało w T0:** że katalog-produktow.html istniał i ewoluował w repo od 22.05 (z kalkulatorem i cenami!); że publiczny /kalkulator istniał od 20.05; że drukowy katalog PPTX nie był źródłem treści (treść rosła w serwisie); że ceny CATS zostały wpisane 22.05 bez udokumentowanego potwierdzenia klienta — ta luka trwa DO DZIŚ i jest jedynym żywym ryzykiem projektu.
10. **Jak następny projekt będzie lepszy:** przed raportem routera obowiązkowy skan „co już istnieje" (repo + memory + żywe URL-e domeny); rekomendacja SSC warunkowana pytaniem „jak często te dane się zmieniają"; przy publikacji ukrytych artefaktów checklist rozszerzony o wpływ na routing; do każdej bramki przypisany artefakt-dowód wykonania (commit/plik/notatka), inaczej bramka liczy się jako niewykonana.

## Evidence (do zapisania przez sesję główną)

- **E1** {observation: SSC rekomendowany jako rdzeń, nie powstał; dane zduplikowane (const CATS w katalog-produktow.html:1033 i kalkulator-programu.html:536), diff = identyczne po ~3 tyg., zero kosztu rozjazdu; proof: git 5b2c0c7 (16.07.2026, skryptowa kopia 1:1) + diff plików 08.08.2026; impact: router nadużywa SSC — brak warunku brzegowego zmienności danych; proposed_change: dodać do karty SSC warunek „rdzeń tylko przy danych żywych; dane zamrożone → kopia skryptowa + data-stamp"; confidence_effect: bez zmian + flaga; mechanisms: [mech:single-source-compiler]}
- **E2** {observation: guard niewidoczności zrealizowany 1:1 z rekomendacją (hasło client-side, X-Robots-Tag noindex, poza sitemapą/nawigacją) + dwa wzorce spoza karty: deploy-gate przez .vercelignore i skutek uboczny publikacji na routing (ożywienie 4 martwych redirectów); proof: git 486cbc7 (29.06.2026), 2481524 + c2da6a0 (16.07.2026), memory 16.07.2026; impact: potwierdzenie karty + materiał do jej rozszerzenia; proposed_change: dopisać do split-url-architecture wzorzec deploy-gate i check „wpływ publikacji na istniejące redirecty"; confidence_effect: +postmortem; mechanisms: [mech:split-url-architecture]}
- **E3** {observation: working-artifact-extraction odpalony na fałszywej premisie — treść i ceny żyły w repo od 22.05.2026, nie w PPTX klienta; realna ekstrakcja = kod z własnej strony, nie dane z artefaktu klienta; proof: git 83e68d8, 31fc16b, ef0ef99 (wszystkie 22.05.2026), 9e70c79 (20.05.2026, publiczny kalkulator); impact: rekomendacje i 2 predykcje (bt-04, bt-05) zbudowane na złej mapie stanu zastanego; proposed_change: trigger karty uzupełnić o warunek weryfikacji „gdzie naprawdę żyje treść" + krok zero inwentaryzacji w ROUTER.md; confidence_effect: bez zmian + flaga wrong-trigger; mechanisms: [mech:working-artifact-extraction]}
- **E4** {observation: żadna z 4 bramek workflow routera nie ma śladu wykonania; w szczególności Bramka 1 (klient potwierdza ceny) — ceny CATS wpisane 22.05 bez udokumentowanej akceptacji, ryzyko 3 otwarte do dziś; proof: git ef0ef99 (22.05.2026) + brak jakiegokolwiek śladu rundy z klientem w memory/git (stan 08.08.2026); impact: bramki bez egzekucji = teatr; jedyne żywe ryzyko projektu jest niezaadresowane; proposed_change: reguła „bramka = artefakt-dowód" w ROUTER.md; akcja operacyjna poza backtestem: potwierdzić z klientem aktualność cen CATS; confidence_effect: n/d; mechanisms: [mech:deterministic-spine, mech:working-artifact-extraction]}
