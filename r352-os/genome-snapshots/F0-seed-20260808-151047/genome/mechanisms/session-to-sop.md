---
id: "mech:session-to-sop"
type: "mechanism"
title: "Session-to-SOP Compounding"
status: "emerging"
created: "2026-08-07"
updated: "2026-08-08"
version: 2
owner: "session"
confidence: {"value": "emerging", "evidence_strength": {"n": 10, "projects": 10, "types": {"measurement": 0, "postmortem": 5, "narracja": 5}, "last_confirmed": "2026-08-09"}, "recommendation": "use-with-care"}
category: "Creative Memory"
relations: {"implements": ["prin:extract-never-invent"], "related": ["mech:negative-knowledge-ledger", "mech:working-artifact-extraction", "mech:incident-to-guard", "mech:agent-as-runtime"]}
trigger: "Klient mówi 'wszystko jest w głowie Kasi', 'jak odeszła agencja, zaczynaliśmy od zera' albo 'za każdym razem odkrywamy to samo'. Sygnał: powtarzalne procedury (publikacje, rozliczenia, kampanie) rekonstruowane od zera po rotacji ludzi/sesji, umowy ustne bez zapisu, wiedza operacyjna bez kanału dystrybucji."
context: "Zespoły marketingowe i operacyjne z rotacją ludzi/wykonawców i powtarzalnymi procedurami; także duety człowiek-AI z pracą sesyjną. Warunek konieczny: automatyczny kanał dystrybucji (pamięć/repo ładowane na start pracy bez decyzji człowieka) dostępny dla wszystkich wykonawców, nie tylko jednej osoby."
anti_context: "Nie stosować dla pracy jednorazowej, która się nie powtórzy — kodyfikacja się nie zwróci. Szkodzi, gdy SOP-y nie są aktualizowane po odchyleniach (martwy SOP gorszy niż brak) albo gdy trafiają do wiki, którą trzeba otworzyć — bez automatycznego kanału compounding nie działa. Pamiętać: SOP przechowuje 'jak', nie odpala 'kiedy' — kadencja wymaga osobnego mechanizmu."
inputs: ["Zidentyfikowane powtarzalne procedury (publikacja, rozliczenie, klasyfikacja) z ich obecnym przebiegiem", "Automatyczny kanał dystrybucji (auto-memory / repo ładowane na start)", "Znane pułapki, timingi i obejścia z dotychczasowych przebiegów", "Lista wykonawców, którzy muszą mieć dostęp (podwykonawcy, nie tylko duet człowiek-AI)", "Backup źródła (repo git dla pamięci)"]
ai_tasks: ["Destylacja ustaleń sesji do wykonawczej procedury (kroki, parametry, zapytania, pułapki — nie streszczenie)", "Wykonywanie kolejnych przebiegów mechanicznie wg SOP", "Aktualizacja SOP po każdym odchyleniu od procedury", "Generowanie kandydata na SOP-deltę na koniec sesji do zatwierdzenia", "Promocja SOP-u użytego ≥3× do artefaktu wykonywalnego (kodu)"]
human_tasks: ["Przemek-decyzja: zatwierdzenie SOP-delty i rozstrzyganie, co jest regułą, a co jednorazowym przypadkiem", "Podwykonawca: praca wg SOP i zgłaszanie dziur (pytania doprecyzowujące = mapa braków)", "Klient: potwierdzenie na piśmie ustaleń krytycznych biznesowo (umowy ustne nie mogą żyć tylko w pamięci)"]
expected_outcome: "Świeża sesja/nowy wykonawca bez kontekstu historycznego wykonuje procedurę z porównywalną jakością (mierzalnie: % zgodności z wykonaniem 'z pamięcią', czas do pierwszej produktywnej akcji, liczba pytań doprecyzowujących bliska zeru), a koszt lekcji jest płacony raz."
evidence: [{"id": "ev:session-to-sop-001", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "medium-publishing-pipeline — 5-krokowa procedura publikacji (import canonical, purge em-dashy przez DOM, tagi klawiaturą, cover przez schowek) z gotchas timingu zamrożona jako SOP; każda publikacja odtwarza ją bez ponown"}, {"id": "ev:session-to-sop-002", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "ada-podwykonawca-ewidencja — metoda rozliczeń (okno pierwsza→ostatnia wiadomość Slack dziennie, dokładne zapytania, kursory, twarde zasady) zakodowana jako niepodważalna umowa; rozliczenie lipca (140h43) wykonane mechani"}, {"id": "ev:session-to-sop-003", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "stock-photo-sources — mapa źródeł stockowych z wynikami weryfikacji zapisana jako pamięć referencyjna po pierwszym case, jawnie oznaczona jako 'komponent wielokrotnego użytku'."}, {"id": "ev:session-to-sop-004", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "meta-verify-first — feedback Reszka skodyfikowany w regułę operacyjną ładowaną do każdej sesji; zmienił domyślny styl pracy całego systemu."}, {"id": "ev:session-to-sop-005", "type": "narracja", "date": "2026-08-07", "source": "rec:reviews/skan-cko-2026-08-07", "note": "fotra-panel — INSTRUKCJA-CHAT-INFAKT.md jako jawny handoff między sesjami AI."}, {"id": "ev:session-to-sop-bt-r3loop-app", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/r3loop-app", "note": "(bt#T1) Nierekomendowany mechanizm zmaterializował się jako playbook workflow ciepły/zimny lead (LIVE) kodyfikujący proces operacyjny wokół narzędzia — miss selekcji Routera | Zmiana: Reguła Routera: 'narzędzie wewnętrzne ⇒ rozważ session-to-sop'; miss, nie evidence do karty"}, {"id": "ev:session-to-sop-bt-geers-centrum-wiedzy", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/geers-centrum-wiedzy", "note": "(bt#T2) Kodyfikacja przekroczyła rekomendowaną 'checklistę compliance': powstał kompletny Brand Operating System dla agentów AI + walidator compliance jako narzędzie | Zmiana: +evidence postmortem w session-to-sop; nowa klasa → new_hypotheses (brand-os-for-agents)"}, {"id": "ev:session-to-sop-bt-osada-orle-brand-system-figma", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/osada-orle-brand-system-figma", "note": "(bt#T2) SOP 'strategia→system→materiał' nigdy nie powstał mimo rekomendacji; procedura żyje implicite w pamięci sesyjnej; brak drugiego klienta tej klasy w horyzoncie projektu | Zmiana: Warunek w karcie: 'drugi projekt tej samej klasy w horyzoncie ≤1 kwartału' jako trigger; flaga wrong-trigger; bez zmiany confidence"}, {"id": "ev:session-to-sop-bt-archicom-tokeny-rebrand-atrium", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/archicom-tokeny-rebrand-atrium", "note": "(bt#T2) Destylat-notatka w auto-memory realnie przeniósł wartość do kolejnego zlecenia Archicom (Reymonta 07-08.2026: fileKeys, fonty, gotchas przez link [[archicom-brand]]), ale paleta wymagała re-ekstrakcji z KV inwestycji — brand okazał się warstwowy (bt-06 PARTIAL | Zmiana: Bramka 'destylat poza sesją' w Routerze rozróżnia: wiedza operacyjna (auto-memory wystarcza) vs tokeny maszynowe per warstwa (biblioteka/repo); eksperyment Reymonta w karcie WAE rozstrzyga spór empiry"}, {"id": "ev:session-to-sop-bt-lemf-deck-figma", "type": "postmortem", "date": "2026-08-09", "source": "rec:backtests/lemf-deck-figma", "note": "(bt#T2) Rekomendowany 'drugorzędnie' nie zaszedł: pipeline został w scratchpadzie sesji, wnioski tylko w pamięci AI, mimo drugiej instancji klasy (deck Osady) | Zmiana: Flaga wrong-trigger; reguła Routera: mechanizm bez bramki w workflow → base-rate, nie rekomendacja"}]
tags: []
---

## Problem

Praca agentowa jest sesyjna: wiedza operacyjna wypracowana w sesji (procedury, obejścia techniczne, ustalenia z klientem, umowy ustne, timing dropdownów Medium) domyślnie umiera z końcem sesji — każda kolejna sesja AI lub osoba płaci ten sam koszt odkrywania od zera.

## Mechanizm działania

Każda sesja, która wypracowała powtarzalną procedurę, kończy się destylacją ustaleń do wpisu w auto-memory jako GOTOWEJ, wykonawczej procedury (SOP: kroki, parametry, zapytania, znane pułapki), nie notatki. Następna sesja startuje z instrukcją zamiast rekonstruować kontekst, bo auto-memory ładuje się automatycznie do każdej sesji — SOP ma gwarantowany kanał dystrybucji, i to kanał czyni compounding (wiki, którą trzeba otworzyć, nie działa). Koszt kodyfikacji (~minuty) jest o rząd wielkości niższy niż koszt ponownego odkrycia. Efekt uboczny: auto-memory stało się de facto systemem operacyjnym firmy — żyją w nim umowy ustne (telefoniczny deadline Archicom), umowy społeczne (rozliczenie Ady 'nie kwestionować') i reguły stylu pracy (verify-first).

## Warunki sukcesu

- Wpis ma formę wykonawczej procedury (kroki, parametry, zapytania, timingi, znane pułapki), nie streszczenia sesji — wykonywalny przez sesję bez kontekstu
- Istnieje automatyczny kanał dystrybucji — pamięć ładuje się do każdej sesji bez decyzji człowieka
- Utrwalane są też wyniki negatywne i granice ('czego nie robić': Trello read-only, nie kwestionować metody Ady)
- SOP jest aktualizowany po każdym odchyleniu od procedury (żywy, nie archiwalny) — martwy SOP jest gorszy niż brak SOP-u

## Warunki porażki

- Pojedynczy punkt awarii: auto-memory poza gitem, bez backupu — firma sprzedająca 'jedno źródło prawdy w repo' trzyma własne źródło prawdy w pamięci sesyjnej AI (meta_insight)
- Brak dostępu dla podwykonawców — SOP-y widzi tylko Claude+Reszek; Natalia i Ada mogą opłacać lekcje, które system już ma
- Wiedza krytyczna biznesowo (umowy ustne, deadline'y) istnieje wyłącznie w pamięci — sporna w razie konfliktu z klientem
- SOP nie egzekwuje kadencji: procedura Medium deterministyczna, ale środowa publikacja zależy od pamięci Przemka — pamięć przechowuje 'jak', nie odpala 'kiedy'

## Potencjał automatyzacji

Wysoki na trzech frontach: (1) hook końca sesji generujący kandydata na SOP-deltę do zatwierdzenia, (2) automatyczny backup auto-memory do prywatnego repo git (usuwa główny failure mode), (3) promocja SOP-ów tekstowych do artefaktów wykonywalnych wg progu użycia — SOP użyty 3× powinien stać się kodem; plus eksport podzbioru SOP-ów do formatu czytelnego dla podwykonawców.

## Transfer

Bardzo wysoki — rdzeń oferty 'Brand Hub / jedno źródło prawdy' przeniesiony na procesy: 'pamięć organizacyjna marketingu' (SOP-y kampanii, gotchas narzędzi, decyzje brandowe przeżywające rotację ludzi i agencji). Warunek transferu: kanał musi być automatyczny i dostępny dla całego zespołu, nie tylko dla jednego duetu człowiek-AI.

## Eksperyment · Benefit/Zdrofit

Test transferu SOP na drugiego wykonawcę: wybrać jedną skodyfikowaną procedurę (SLOWNIK_FORMATOW.md + zasady brand.json Zdrofit), dać ją świeżej sesji AI bez żadnego kontekstu historycznego i zlecić klasyfikację 20 nowych briefów do rodzin formatów. Porównać z klasyfikacją sesji 'z pamięcią' oraz z decyzją Reszka. Zmierzyć: zgodność (%), liczbę pytań doprecyzowujących świeżej sesji (= dziury w SOP), czas od startu do pierwszej produktywnej akcji.

**Czego się dowiemy:** Dowiemy się, czy pamięć organizacyjna r352 jest przenośna (warunek oddania pracy podwykonawcom i sprzedania jej jako produkt), czy działa tylko w symbiozie z kontekstem sesyjnym Przemka — a lista pytań świeżej sesji da konkretną mapę dziur do załatania w SOP-ach.

## Version
- v2 · 2026-08-08 — migracja F0: frontmatter + DOWNGRADE proven→emerging (evt: ontologia validated — cały Evidence typu narracja).
- v1 · 2026-08-07 — destylacja ze skanu CKO (47 projektów).
