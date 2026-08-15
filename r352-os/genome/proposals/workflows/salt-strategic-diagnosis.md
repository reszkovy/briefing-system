---
id: "wf:salt-strategic-diagnosis"
type: "workflow"
title: "SALT — diagnoza strategiczna (Sytuacja · Odbiorcy · Przewaga · Zmiana)"
status: "draft"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
confidence: {"value":"emerging","evidence_strength":{"n":2,"projects":2,"independent_sources":2,"types":{"backtest":2},"last_confirmed":"2026-08-09"},"recommendation":"odtworzone z artefaktów historycznych; przed pierwszym żywym przebiegiem przez Router traktować jako rekonstrukcję, nie jako dowód skuteczności"}
category: "Strategy"
relations: {"uses":["mech:competitive-benchmarking","mech:machine-narrows-human-picks"],"related":["mech:working-artifact-extraction","mech:proof-first-demo-pitch"],"born_from":["proj:r352-framework-brand-hub-os"],"for":["cli:betterworkplace"]}
trigger: "Klient prosi o markę, komunikację, stronę, kampanię albo „odświeżenie", a NIE MA zapisanej odpowiedzi na pytanie: jaki problem realnie rozwiązujemy, czyją decyzję zmieniamy i czym się wyróżniamy. Sygnał ostrzegawczy: brief zaczyna się od artefaktu („potrzebujemy nowej strony"), nie od problemu."
context: "Projekty, w których wynik zależy od percepcji odbiorcy: pozycjonowanie, architektura marek, komunikacja, oferta, GTM, redesign zmieniający narrację. Także projekty własne r352, gdy zmienia się to, komu sprzedajemy."
anti_context: "NIE stosować, gdy: (a) problem jest dominująco produktowy, cenowy lub dystrybucyjny — SALT to nazwie, ale nie rozwiąże, i trzeba to powiedzieć klientowi przed wydaniem budżetu; (b) istnieje aktualna, zaakceptowana strategia i zadanie jest wykonawcze; (c) projekt jest czysto techniczny (migracja, automatyzacja, refaktor, integracja) — tam odbiorcą jest system, nie rynek; (d) zakres to pojedynczy format w istniejącym systemie marki."
inputs: ["Research/Benchmark spełniający kontrakt (`lib/research-contract.js`) — SALT nie startuje na wrażeniach","Liczby klienta: przychód/konwersja/retencja/koszyk, choćby zgrubne, albo jawne „n/d”","Inwentarz marek, domen i komunikatów w obiegu","Dostęp do 2–3 osób po stronie klienta (kto dziś decyduje o zakupie)","Wypowiedzi klientów końcowych, jeśli istnieją (cytat > opinia właściciela)"]
outputs: ["S: jednozdaniowy wniosek + KLASYFIKACJA PROBLEMU (dominujący + wtórny: percepcyjny | produktowy | cenowy | dystrybucyjny)","A: odbiorca DZIŚ vs DOCELOWY z wartością kontraktu i językiem, jakim każde z nich nazywa problem","L: areny konkurencji + przewagi strukturalne oddzielone od kopiowalnych w 6 miesięcy","T: transformacja percepcji „z X → na Y” + zachowanie, które jest dowodem, że zaszła","2–4 ODKRYCIA KLUCZOWE, każde falsyfikowalne, ze statusem ZWALIDOWANE (czym) albo HIPOTEZA (jak i kiedy walidujemy)","Jawna lista ZAŁOŻEŃ (czego nie wiemy) i ALTERNATYW odrzuconych z powodem","Lista ryzyk: co się stanie, jeśli odkrycie okaże się fałszywe"]
ai_tasks: ["Zebranie i skontraktowanie researchu (rekordy przechodzą validateResearchRecord)","Zestawienie aren konkurencji i kandydatów na przewagi z materiału źródłowego","Wypełnienie szkieletu S/A/L/T propozycjami wniosków — zawsze ≥2 alternatywne sformułowania na warstwę","Wyprowadzenie kandydatów na odkrycia + oznaczenie, które są hipotezami","Zestawienie założeń i ryzyk"]
human_tasks: ["Przemek/klient: KLASYFIKACJA PROBLEMU — to jest bramka uczciwości, nie formalność","Przemek: wybór jednego wniosku na warstwę spośród alternatyw","Klient: potwierdzenie odbiorcy docelowego i różnicy wartości kontraktu","Przemek: zatwierdzenie odkryć i tego, które są hipotezami (podpisany ślad akceptacji — patrz guards)"]
success_conditions: ["Każda warstwa ma JEDEN wniosek, nie akapit","Klasyfikacja problemu wykonana i zakomunikowana klientowi PRZED wydaniem budżetu","Każde odkrycie ma status i, jeśli hipoteza, plan walidacji z datą","Każda późniejsza rekomendacja da się prześledzić do konkretnego odkrycia albo celu biznesowego","Alternatywy odrzucone są zapisane z powodem — nie znikają po cichu"]
failure_conditions: ["Wniosek warstwy dłuższy niż zdanie = warstwa nie została domknięta","Dominujący problem ≠ percepcyjny, a projekt i tak idzie w branding — SALT stał się listkiem figowym","Odkrycia bez statusu: hipoteza sprzedana jako ustalenie","Odbiorca docelowy wybrany bez różnicy wartości kontraktu — „HR Director” bez liczby to życzenie","SALT powstaje po deliverables, żeby je uzasadnić (odwrócona przyczynowość)"]
guards: ["G1 — Research gate: `contractGate()` musi zwrócić can_freeze albo SALT startuje jawnie oznaczony jako oparty na wrażeniach","G2 — Bramka klasyfikacji: bez wypełnionego dominującego problemu SALT nie produkuje odkryć","G3 — Bramka uczciwości hipotez: odkrycie bez statusu blokuje przekazanie wyniku do PLATE","G4 — Ślad akceptacji: wynik SALT idzie dalej wyłącznie z podpisanym odciskiem raportu (verifyHumanReview), nie z napisem „zaakceptowane”"]
provenance: ["szablony/strategia/SALT.md w FrameWorkProdukty/r352-framework (szablon operacyjny, F1 krok 3)","spec/STRATEGIA-WZORZEC.md — wzorzec dokumentu strategii, sekcja 2 METODOLOGIA i sekcja 3 ODKRYCIA","BetterWorkplace/BW_Strategia_Klient.html — pełne, wykonane SALT dla ekosystemu BW (kwiecień–maj 2026)","BetterWorkplace/r352-deploy/framework.html — publiczna prezentacja metody"]
next_use: "Zatwierdzony wynik SALT jest JEDYNYM legalnym wejściem do wf:plate-communication-plan. Bez niego PLATE nie startuje (patrz karta PLATE, guard G1)."
postmortem_accounting: ["Czy klasyfikacja problemu z S okazała się trafna — czy w trakcie projektu ujawnił się problem produktowy/cenowy, którego SALT nie nazwał?","Czy odkrycia-hipotezy zostały zwalidowane w zadeklarowanym terminie — czym i z jakim wynikiem?","Czy transformacja T jest widoczna w ZACHOWANIU (kto pisze zapytania, jakim budżetem), nie w deklaracji?","Czy któraś rekomendacja końcowa NIE dała się prześledzić do odkrycia — jeśli tak, skąd się wzięła?","Które założenie okazało się fałszywe i co to kosztowało?"]
evidence: [{"id":"ev:salt-bt-betterworkplace","type":"backtest","date":"2026-08-09","source":"BetterWorkplace/BW_Strategia_Klient.html","note":"Pełny, wykonany przebieg SALT dla ekosystemu BW (5 marek, 3 domeny). S sklasyfikował problem jako percepcyjny/kategorialny (nie produktowy, nie cenowy). A wskazał zmianę decydenta Office Manager (x1) → HR Director (x10). L nazwał przewagę strukturalną (jedyny gracz łączący wellbeing żywieniowy + zaopatrzenie + platformę benefitów) i asset kulturowy (Owocowe Czwartki). T: z „dostawcy owoców” na „trzeci filar benefitów”. Wyprowadzone 3 odkrycia kluczowe, każde zmapowane na deliverables D01–D06. UWAGA: to rekonstrukcja z artefaktu, NIE żywy pomiar skuteczności — nie znamy wyniku sprzedażowego tej zmiany kategorii.","project":"proj:teambudget","independence_key":"proj:teambudget::BW_Strategia_Klient.html"},{"id":"ev:salt-bt-framework-spec","type":"backtest","date":"2026-08-09","source":"FrameWorkProdukty/r352-framework/spec/STRATEGIA-WZORZEC.md","note":"SALT jest zakodowany jako obowiązkowa sekcja 2 wzorca dokumentu strategii, z regułą nadrzędną „każda decyzja musi być prześledzalna do odkrycia albo celu biznesowego”. Potwierdza, że to proces wielokrotnego użytku, nie jednorazowy artefakt dla BW. Nie jest dowodem skuteczności — jest dowodem, że metoda została skodyfikowana.","project":"proj:r352-framework-brand-hub-os","independence_key":"proj:r352-framework-brand-hub-os::STRATEGIA-WZORZEC.md"}]
tags: ["strategia","salt","framework","betterworkplace"]
---

## Problem

Genome pamięta, że strategia powstała, ale nie potrafi jej **odtworzyć jako rozumowania**. Karta projektu mówi „zrobiliśmy strategię dla BW"; nie mówi, jaką sekwencję pytań trzeba zadać, żeby dojść do wniosku „problem jest kategorialny, nie produktowy". Wiedza operacyjna została w HTML-u dla klienta i w głowie właściciela.

## Dlaczego workflow, a nie mechanizm

Mechanizm w tej ontologii to generator rezultatu w formie „X powoduje Y, bo Z" — jedna dźwignia z dowodami. SALT nie jest dźwignią; jest **nazwaną sekwencją czterech kroków z bramkami**, która orkiestruje inne mechanizmy (benchmark, zawężanie opcji przez maszynę i wybór przez człowieka). To dokładnie definicja obiektu Workflow z ontologii F0. Wciśnięcie SALT do `mechanism` wymagałoby udawania, że ma pojedynczy `expected_outcome` i mierzalne evidence-per-użycie, czego nie ma.

## Sekwencja

Cztery warstwy, każda buduje na poprzedniej, każda kończy się **jednym zdaniem**:

1. **S — Sytuacja.** Co klient sprzedaje, komu, za ile — i co *myśli*, że sprzedaje. Które liczby stoją. Jak brzmi na tle kategorii. Bramka: klasyfikacja problemu (dominujący + wtórny). Jeśli dominujący nie jest percepcyjny, mówimy to klientowi teraz, nie po fakturze.
2. **A — Odbiorcy.** Kto decyduje dziś, a kto powinien. Jak każde z nich *swoimi słowami* nazywa problem. Różnica wartości kontraktu między nimi. Kto wpływa, choć nie kupuje.
3. **L — Przewaga.** Co klient robi dobrze *potwierdzone przez jego klientów*, nie przez niego. Które przewagi są strukturalne, a które kopiowalne w pół roku. Na ilu arenach naprawdę konkurujemy. Jaka pozycja jest wolna.
4. **T — Zmiana.** Percepcja dziś → percepcja docelowa, po jednym zdaniu. I **zachowanie**, które jest dowodem, że zmiana zaszła.

Z czterech wniosków wychodzą 2–4 **odkrycia kluczowe**: jednozdaniowe, falsyfikowalne, każde ze statusem (zwalidowane czym / hipoteza do kiedy) i mapowaniem na deliverables.

## Co SALT realnie zmienia

Nie produkuje dokumentu — produkuje **rozstrzygnięcia, które ucinają zakres**. Na BW: klasyfikacja „percepcyjny" wykluczyła pracę produktową i cenową z zakresu; zmiana decydenta OM→HR przepisała całą komunikację na inny budżet; nazwanie Owocowych Czwartków jako assetu kulturowego zmieniło strategię z „wymyśl przewagę" na „przejmij istniejące skojarzenie". Trzy decyzje, każda zmieniająca zakres i budżet — przed pierwszym projektem graficznym.

Jeśli przebieg SALT nie zmienia zakresu, odbiorcy ani przekazu, był zbędny i to jest wynik do zapisania, nie do ukrycia.
