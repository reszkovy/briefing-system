---
id: "wf:plate"
type: "workflow"
title: "PLATE — operacjonalizacja strategii (Ścieżka · Blokady · Cele · Tematy · Wykonanie)"
status: "draft"
owner: "przemek"
category: "Strategy"
relations: {"uses":["mech:format-dictionary","mech:compounding-channel"],"related":["wf:salt","mech:strategy-before-execution","mech:dated-commitment-gates","mech:single-source-compiler"],"born_from":["proj:r352-framework-brand-hub-os"],"for":["cli:betterworkplace"]}
requires_input: "ZATWIERDZONY FUNDAMENT STRATEGICZNY — alternatywa, nie jedno źródło: (a) podpisany wynik wf:salt albo (b) świeże (≤12 mies.), sprawdzalne odniesienie do istniejącej strategii. Bramka PLATE_REQUIRES_FOUNDATION w lib/strategy-frameworks.js. ŚWIADOMIE NIE jest to relacja grafu requires → wf:salt: taka krawędź twierdziłaby, że SALT jest jedynym możliwym fundamentem, co jest nieprawdą."
trigger: "Istnieje ZATWIERDZONA diagnoza strategiczna (wynik wf:salt albo świeże, sprawdzalne odniesienie do strategii ≤12 mies.), a projekt wymaga rozstrzygnięcia CO, GDZIE i JAK komunikujemy: kalendarz, kanały, tematy per odbiorca, materiały. Także wtedy, gdy brief tego nie nazywa, ale horyzont komunikacji sięga 90 dni."
context: "Faza wykonawcza po strategii: plan komunikacji, kalendarz 90 dni, matryca komunikacji, szablony treści, kampanie wielokanałowe, ścieżki cross-sell w ekosystemie marek."
anti_context: "NIE stosować, gdy: (a) nie ma zatwierdzonego fundamentu strategicznego — PLATE nie wymyśla strategii i uruchomiony bez niej produkuje kalendarz bez tezy; (b) projekt to pojedynczy artefakt bez ciągłości komunikacyjnej (jeden format, jeden layout, jedna wizytówka); (c) projekt techniczny — nie ma odbiorcy-człowieka do przeprowadzenia przez ścieżkę; (d) klient nie ma zdolności wykonawczej na deklarowany rytm — wtedy plan jest fikcją i trzeba zejść do quick winów."
inputs: ["ZATWIERDZONY wynik wf:salt albo świeże, sprawdzalne odniesienie do strategii (ref w formacie Genome + źródło + data zatwierdzenia)","Inwentarz kanałów, do których klient ma realny dostęp i zdolność publikacji","Dane o obecnym ruchu/bazie, jeśli istnieją — albo jawne „n/d”","Ograniczenia wykonawcze: kto produkuje treści, ile godzin, jaki budżet mediowy","Metryki możliwe do zmierzenia (przechodzące assessMetric) — nie metryki wymarzone"]
outputs: ["P — ścieżka klienta: etapy × stan głowy odbiorcy × potrzebny komunikat × kanał","L — rejestr blokad: blokada × DOWÓD, że istnieje × przekaz, który ją usuwa","A — cele: działanie × cel jako ZACHOWANIE odbiorcy × metryka × wartość docelowa × horyzont","T — tematy per odbiorca: top 3 tematy × ton × argument koronny (szkielet HOOK → VALUE → CTA)","E — materiały: kalendarz 90 dni (tydzień × kanał × temat × format × cel) + lista szablonów powtarzalnych","Lista tego, czego świadomie NIE robimy w tym horyzoncie, z powodem"]
ai_tasks: ["Rozpisanie ścieżki i kandydatów na blokady z materiału wf:salt + researchu","Propozycja tematów per odbiorca zgodnych z warstwą A i T diagnozy","Wypełnienie szkieletu kalendarza 90 dni w rytmie realnym dla zdolności klienta","Kontrola spójności: czy każdy przekaz mapuje się na blokadę albo etap","Walidacja każdej metryki przez assessMetric przed wpisaniem do kolumny „metryka”"]
human_tasks: ["Przemek/klient: potwierdzenie, że blokady są REALNE — każda musi mieć dowód, nie domysł","Klient: potwierdzenie zdolności wykonawczej na zadeklarowany rytm","Przemek: rozstrzygnięcie, które działania wchodzą do 90 dni, a które wypadają","Przemek: podpisana zgoda na pakiet przed uruchomieniem produkcji materiałów"]
success_conditions: ["Każdy przekaz da się przypisać do blokady (L) albo etapu ścieżki (P) — jeśli nie, wypada","Każde działanie ma metrykę przechodzącą assessMetric, nie „zwiększymy świadomość”","Każda blokada ma dowód istnienia, nie przypuszczenie","Kalendarz mieści się w realnej zdolności wykonawczej klienta","Tematy nie mieszają poziomów marek (master = WHY, endorsed = WHAT, product = CONTROL)"]
failure_conditions: ["PLATE uruchomiony bez fundamentu — kalendarz istnieje, tezy nie ma","Cele opisane jako stany („większa rozpoznawalność”) zamiast zachowań odbiorcy","Blokady wymyślone przy stole zamiast wyprowadzone z danych albo rozmów","Kalendarz na 90 dni przy zdolności na 20 — plan umiera w tygodniu 3 i psuje zaufanie do całości","Materiały produkowane przed zatwierdzeniem sekcji A (cele) — praca do kosza przy pierwszej korekcie"]
guards: ["G1 — Bramka fundamentu (PLATE_REQUIRES_FOUNDATION w foundationGate): PLATE startuje wyłącznie na (a) podpisanym wyniku wf:salt albo (b) świeżym, sprawdzalnym odniesieniu do istniejącej strategii. Twarda bramka, nie zalecenie. Alternatywa jest realna — dlatego nie ma jej jako relacji grafu.","G2 — Bramka metryk: kolumna „metryka” w sekcji A przechodzi przez assessMetric; metryka BLOCKED nie wchodzi do planu","G3 — Bramka dowodu blokady: blokada bez dowodu jest hipotezą i musi być tak oznaczona","G4 — Bramka zdolności: kalendarz konfrontowany z liczbą dni produkcyjnych klienta przed zatwierdzeniem; < 30 dni w horyzoncie 90 = zejdź do quick winów","G5 — Zgoda: produkcja materiałów (E) startuje po podpisanym odcisku całego pakietu decyzyjnego"]
provenance: ["FrameWorkProdukty/r352-framework/szablony/brand/PLATE.md — szablon operacyjny, F2 krok 11","FrameWorkProdukty/r352-framework/spec/STRATEGIA-WZORZEC.md — D05 Journey Map wskazany jako wejście do PLATE (P + L)","BetterWorkplace/BW_Strategia_Klient.html — sekcja P.L.A.T.E. jako metoda Fazy 2 („Faza 1 = kim jesteśmy i do kogo mówimy · Faza 2 = co, gdzie i jak”)","BetterWorkplace/r352-deploy/framework.html"]
next_use: "Wyjście PLATE zasila wykonanie: system/communication_matrix.json, system/messaging_templates.json, docs/kalendarz-90d.md oraz zakres produkcji formatów. Po 90 dniach wraca do postmortemu przez assessFrameworkPayoff()."
postmortem_accounting: ["Ile z kalendarza 90 dni zostało faktycznie opublikowane — i co zatrzymało resztę?","Które blokady okazały się realne, a które były domysłem zespołu?","Czy metryki z sekcji A dały się rozliczyć w zadeklarowanych źródłach, czy instrumentacja zawiodła?","Czy któryś przekaz nie mapował się na blokadę ani etap — jak przeszedł kontrolę spójności?","Czy zdolność wykonawcza klienta była oszacowana trafnie (błąd w którą stronę)?"]
tags: ["strategia","plate","framework","bw-origin","komunikacja"]
created: "2026-08-09"
updated: "2026-08-09"
version: 1
---


## Problem

Plany komunikacji powstają jako kalendarze: siatka tygodni wypełniona tematami. Kalendarz bez tezy przeżywa trzy tygodnie, bo nikt nie umie rozstrzygnąć, co wypada przy pierwszym konflikcie priorytetów. PLATE odwraca kolejność: najpierw ścieżka i blokady, dopiero na końcu materiały.

## Dlaczego osobno od SALT

Ta sama racja ontologiczna co przy SALT (sekwencja z bramkami, nie generator „X powoduje Y"), a osobno — bo **działa na innym wejściu i bywa potrzebny bez nowej diagnozy**. Klient ze świeżą, zatwierdzoną strategią potrzebuje PLATE, a nie powtórki SALT. Odwrotnie nie działa: PLATE bez fundamentu produkuje kalendarz bez tezy.

**Dlaczego w grafie NIE ma krawędzi `requires → wf:salt`.** Bo to byłaby nieprawda. PLATE wymaga *zatwierdzonego fundamentu*, a SALT jest jednym z dwóch jego źródeł — drugim jest świeża, sprawdzalna strategia klienta. Krawędź skierowana do SALT twierdziłaby, że jest jedynym. Zależność żyje tam, gdzie da się ją wyrazić uczciwie: w polu `requires_input` i w bramce `PLATE_REQUIRES_FOUNDATION`, która akceptuje obie drogi. Graf i router mówią to samo.

**Ta karta nie ma pól `confidence` ani `evidence` — celowo.** Patrz `wf:salt`, ta sama racja: stan wiedzy żyje w `mech:strategy-before-execution`.

## Sekwencja

- **P — Przygotuj ścieżkę.** Droga od pierwszego kontaktu do zakupu i powrotu. Na każdym etapie: stan głowy odbiorcy, potrzebny komunikat, miejsce.
- **L — Znajdź blokady.** Co powstrzymuje przed kolejnym krokiem (nie wiedzą o pełnej ofercie · nie ufają · nie widzą różnicy · boją się kosztu zmiany). **Każda blokada wymaga dowodu, że istnieje.** Każda zamienia się w konkretny przekaz, który ją usuwa.
- **A — Ustal cele.** Każde działanie dostaje cel opisany jako **zachowanie odbiorcy**, metrykę, wartość docelową i horyzont. Zakaz ogólników.
- **T — Dopasuj tematy.** Decydent chce zwrotu, użytkownik chce prostoty. Inne tematy, inny ton, inny argument koronny per grupa. Szkielet: HOOK → VALUE (funkcjonalna + emocjonalna + dowód) → CTA.
- **E — Przygotuj materiały.** Kalendarz 90 dni i szablony powtarzalne — dopiero tutaj, po zatwierdzeniu celów.

## Co PLATE realnie zmienia

Wycina. Kontrola spójności („każdy przekaz mapuje się na blokadę albo etap") jest maszyną do usuwania tematów, które ktoś wymyślił, bo brzmiały dobrze. Bramka metryk usuwa działania, których nikt nie umie rozliczyć. Bramka zdolności urealnia kalendarz.

Na BW widać to na quick winach: LinkedIn BW do HR Directorów nie jest „bądźmy na LinkedInie" — jest odpowiedzią na odkrycie #3 (decyzja trafia do złej osoby), z baselinem pod KPI „35% zapytań od HR". Ta sama teza, przełożona na kanał i liczbę.
