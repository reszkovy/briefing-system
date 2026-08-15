---
id: "wf:salt"
type: "workflow"
title: "SALT — diagnoza strategiczna (Sytuacja · Odbiorcy · Przewaga · Zmiana)"
status: "draft"
owner: "przemek"
category: "Strategy"
relations: {"uses":["mech:competitive-benchmarking","mech:machine-narrows-human-picks"],"related":["wf:plate","mech:strategy-before-execution","mech:working-artifact-extraction","mech:proof-first-demo-pitch"],"born_from":["proj:r352-framework-brand-hub-os"],"for":["cli:betterworkplace"]}
trigger: "Klient prosi o markę, komunikację, stronę, kampanię albo „odświeżenie\", a NIE MA zapisanej odpowiedzi na pytanie: jaki problem realnie rozwiązujemy, czyją decyzję zmieniamy i czym się wyróżniamy. Albo mówi: „wzrost się zatrzymał\", „konkurenci wyglądają tak samo, zostaje cena\", „polecenia przestały wystarczać\", „mamy kilka marek i nikt nie widzi związku\". Sygnał ostrzegawczy: brief zaczyna się od artefaktu, nie od problemu."
context: "Projekty, w których wynik zależy od percepcji odbiorcy: pozycjonowanie, architektura marek, komunikacja, oferta, GTM, redesign zmieniający narrację, marki osobiste ekspertów. Także projekty własne r352, gdy zmienia się to, komu sprzedajemy."
anti_context: "NIE uruchamiać, gdy: (a) problem dominujący jest produktowy, cenowy lub dystrybucyjny — branding tego nie naprawi i SALT ma to POWIEDZIEĆ, nie obejść; (b) istnieje świeża (≤12 mies.), zatwierdzona strategia ze sprawdzalnym odniesieniem, której brief nie kwestionuje — wtedy wchodzi od razu wf:plate; (c) projekt jest czysto techniczny/infrastrukturalny bez odbiorcy zewnętrznego (migracja, refaktor, narzędzie wewnętrzne); (d) zlecenie jest jednorazowym artefaktem bez konsekwencji pozycjonujących i bez ciągłości (jeden baner, jedna poprawka, jeden format w istniejącym systemie marki)."
inputs: ["Research/Benchmark spełniający kontrakt (lib/research-contract.js) — SALT nie startuje na wrażeniach","Liczby klienta: przychód/konwersja/retencja/koszyk, choćby zgrubne, albo jawne „n/d”","Kto dziś kupuje i kto POWINIEN kupować (rola, budżet, LTV)","Inwentarz marek, domen i komunikatów w obiegu oraz ich wzajemne relacje","Obecna komunikacja marki na tle komunikacji kategorii","Dostęp do 2–3 osób po stronie klienta i do jego klientów końcowych — albo jawna deklaracja, że go nie ma"]
outputs: ["WNIOSEK S — jedno zdanie: co się dzieje i co nie działa","KLASYFIKACJA PROBLEMU: dominujący + wtórny (percepcyjny | produktowy | cenowy | dystrybucyjny)","WNIOSEK A — jedno zdanie: odbiorca dzisiejszy vs docelowy i różnica wartości kontraktu, z językiem każdego z nich","WNIOSEK L — jedno zdanie: przewaga strukturalna, areny konkurencji, wolna pozycja","WNIOSEK T — jedno zdanie: transformacja percepcji z X na Y + ZACHOWANIE będące dowodem","ODKRYCIA KLUCZOWE (2–4), każde falsyfikowalne, ze statusem ZWALIDOWANE|HIPOTEZA i planem walidacji z datą","Rejestr założeń (czego nie wiemy), alternatyw odrzuconych z powodem i ryzyk (co, jeśli odkrycie jest fałszywe)"]
ai_tasks: ["Zebranie i skontraktowanie researchu (rekordy przechodzą validateResearchRecord)","Rekonstrukcja pakietu wejściowego: co wiadomo, czego brakuje, co jest hipotezą podaną jako fakt","Zestawienie aren konkurencji i kandydatów na przewagi z materiału źródłowego","Prowadzenie warstw S/A/L/T z wymuszeniem jednozdaniowych wniosków — zawsze ≥2 alternatywne sformułowania na warstwę","Wyprowadzenie kandydatów na odkrycia z oznaczeniem, które są hipotezami","Zestawienie założeń i ryzyk"]
human_tasks: ["Przemek/klient: KLASYFIKACJA PROBLEMU — bramka uczciwości, nie formalność","Przemek: wybór jednego wniosku na warstwę spośród alternatyw","Klient: potwierdzenie odbiorcy docelowego i różnicy wartości kontraktu","Klient: dostęp do swoich klientów na wywiady albo świadoma zgoda, że odkrycia zostaną hipotezami","Przemek-decyzja: powiedzieć klientowi, gdy dominujący problem nie jest percepcyjny — nawet kosztem mniejszego zlecenia","Przemek: zatwierdzenie wyniku podpisanym pakietem (patrz guards G4)"]
success_conditions: ["Każda warstwa ma JEDEN wniosek, nie akapit","Klasyfikacja problemu wykonana i zakomunikowana klientowi PRZED wydaniem budżetu","Każde odkrycie ma status i, jeśli hipoteza, plan walidacji z datą","Co najmniej jedna decyzja zakresowa lub pozycjonująca zmienia się względem pierwotnego briefu","Każda późniejsza rekomendacja da się prześledzić do konkretnego odkrycia albo celu biznesowego","Alternatywy odrzucone są zapisane z powodem — nie znikają po cichu"]
failure_conditions: ["Wniosek warstwy dłuższy niż zdanie = warstwa nie została domknięta","Dominujący problem ≠ percepcyjny, a projekt i tak idzie w branding — SALT stał się listkiem figowym","Odkrycia bez statusu: hipoteza sprzedana jako ustalenie","Odbiorca docelowy wybrany bez różnicy wartości kontraktu — „HR Director” bez liczby to życzenie","SALT powstaje po deliverables, żeby je uzasadnić (odwrócona przyczynowość)","SALT kończy się dokumentem, ale żadna decyzja się nie zmienia — koszt bez zwrotu, nie „porządkowanie wiedzy”"]
guards: ["G1 — Research gate: researchGate() musi zwrócić can_proceed. UWAGA: to NIE jest contractGate — kontrakt startu wymaga metryk i predykcji, które powstają DOPIERO po diagnozie. Wymaganie go przed SALT było cyrkularne.","G2 — Bramka klasyfikacji: bez wypełnionego dominującego problemu SALT nie produkuje odkryć","G3 — Bramka uczciwości hipotez: odkrycie bez statusu blokuje przekazanie wyniku do wf:plate","G4 — Zgoda fazy foundation: wynik SALT staje się fundamentem dla wf:plate wyłącznie z podpisanym odciskiem pakietu fazy „foundation” (verifyHumanReview), nie z napisem „zaakceptowane”. To osobna, wcześniejsza zgoda niż podpis GO.","G5 — Bramka rozliczenia: assessFrameworkPayoff() w postmortemie; payoff NONE oznacza, że framework w tym projekcie nie zadziałał"]
provenance: ["FrameWorkProdukty/r352-framework/szablony/strategia/SALT.md — szablon operacyjny, F1 krok 3","FrameWorkProdukty/r352-framework/spec/STRATEGIA-WZORZEC.md — sekcja 2 METODOLOGIA i sekcja 3 ODKRYCIA KLUCZOWE","BetterWorkplace/BW_Strategia_Klient.html — pełne, wykonane SALT dla ekosystemu BW (kwiecień–maj 2026)","BetterWorkplace/r352-deploy/framework.html — publiczna prezentacja metody"]
next_use: "Zatwierdzony (podpisany) wynik SALT jest JEDNYM z dwóch dopuszczalnych fundamentów dla wf:plate — drugim jest świeże, sprawdzalne odniesienie do istniejącej strategii klienta. SALT nie jest warunkiem koniecznym PLATE, jest jego producentem tam, gdzie fundamentu nie ma."
postmortem_accounting: ["Czy klasyfikacja problemu z S okazała się trafna — czy w trakcie ujawnił się problem produktowy/cenowy, którego SALT nie nazwał?","Czy odkrycia-hipotezy zostały zwalidowane w zadeklarowanym terminie — czym i z jakim wynikiem?","Czy transformacja T jest widoczna w ZACHOWANIU (kto pisze zapytania, jakim budżetem), nie w deklaracji?","Ile decyzji zakresowych realnie zmieniła diagnoza (assessFrameworkPayoff)?","Czy któraś rekomendacja końcowa NIE dała się prześledzić do odkrycia — skąd się wzięła?","Które założenie okazało się fałszywe i co to kosztowało?"]
tags: ["strategia","salt","framework","bw-origin"]
created: "2026-08-09"
updated: "2026-08-09"
version: 1
---


## Problem

Genome pamiętało, że strategia powstała, ale nie potrafiło jej **odtworzyć jako rozumowania**. Karta projektu mówi „zrobiliśmy strategię dla BW"; nie mówi, jaką sekwencję pytań trzeba zadać, żeby dojść do wniosku „problem jest kategorialny, nie produktowy". Wiedza operacyjna została w HTML-u dla klienta i w głowie właściciela.

## Dlaczego Workflow, a nie Mechanism

Mechanism w tej ontologii to generator rezultatu „X powoduje Y, bo Z" — jedna dźwignia z dowodami i confidence. SALT nie jest dźwignią; jest **nazwaną sekwencją kroków z bramkami**, która orkiestruje inne mechanizmy. To definicja obiektu Workflow z ontologii F0.

**Ta karta nie ma pól `confidence` ani `evidence` — celowo.** Build ich dla typu `workflow` nie waliduje, więc byłyby drugim, niekontrolowanym stanem wiedzy. Falsyfikowalny claim („diagnoza przed produkcją zmienia decyzje") żyje w `mech:strategy-before-execution` i tam nosi confidence oraz Evidence.

## Sekwencja

Cztery warstwy, każda buduje na poprzedniej, każda kończy się **jednym zdaniem**:

1. **S — Sytuacja.** Co klient sprzedaje, komu, za ile — i co *myśli*, że sprzedaje. Które liczby stoją. Jak brzmi na tle kategorii. Bramka: klasyfikacja problemu (dominujący + wtórny). Jeśli dominujący nie jest percepcyjny, mówimy to klientowi teraz, nie po fakturze.
2. **A — Odbiorcy.** Kto decyduje dziś, a kto powinien. Jak każde z nich *swoimi słowami* nazywa problem. Różnica wartości kontraktu. Kto wpływa, choć nie kupuje.
3. **L — Przewaga.** Co klient robi dobrze *potwierdzone przez jego klientów*, nie przez niego. Które przewagi są strukturalne, a które kopiowalne w pół roku. Na ilu arenach naprawdę konkurujemy. Jaka pozycja jest wolna.
4. **T — Zmiana.** Percepcja dziś → percepcja docelowa, po jednym zdaniu. I **zachowanie**, które jest dowodem, że zmiana zaszła.

Z czterech wniosków wychodzą 2–4 **odkrycia kluczowe**: jednozdaniowe, falsyfikowalne, każde ze statusem (zwalidowane czym / hipoteza do kiedy) i mapowaniem na deliverables.

## Co SALT realnie zmienia

Nie produkuje dokumentu — produkuje **rozstrzygnięcia, które ucinają zakres**. Na BW: klasyfikacja „percepcyjny" wykluczyła pracę produktową i cenową; zmiana decydenta OM→HR przepisała komunikację na inny budżet; nazwanie Owocowych Czwartków jako assetu kulturowego zmieniło strategię z „wymyśl przewagę" na „przejmij istniejące skojarzenie". Trzy decyzje zmieniające zakres i budżet — przed pierwszym projektem graficznym.

Jeśli przebieg SALT nie zmienia zakresu, odbiorcy ani przekazu, był zbędny — i to jest wynik do zapisania, nie do ukrycia.
