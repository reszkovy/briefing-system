---
id: "wf:plate-communication-plan"
type: "workflow"
title: "PLATE — plan komunikacji (Ścieżka · Blokady · Cele · Tematy · Wykonanie)"
status: "draft"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
confidence: {"value":"emerging","evidence_strength":{"n":2,"projects":2,"independent_sources":2,"types":{"backtest":2},"last_confirmed":"2026-08-09"},"recommendation":"odtworzone z artefaktów historycznych; PLATE dla BW był zapowiedziany w F2, więc dowód wykonania jest słabszy niż dla SALT"}
category: "Strategy"
relations: {"requires":["wf:salt-strategic-diagnosis"],"uses":["mech:format-dictionary","mech:compounding-channel"],"related":["mech:dated-commitment-gates","mech:single-source-compiler"],"born_from":["proj:r352-framework-brand-hub-os"],"for":["cli:betterworkplace"]}
trigger: "Istnieje ZATWIERDZONA diagnoza strategiczna (wynik SALT albo równoważny fundament: aktualne pozycjonowanie + zdefiniowany odbiorca docelowy + nazwana zmiana percepcji), a projekt wymaga rozstrzygnięcia CO, GDZIE i JAK komunikujemy: kalendarz, kanały, tematy per odbiorca, materiały."
context: "Faza wykonawcza po strategii: plan komunikacji, kalendarz 90 dni, matryca komunikacji, szablony treści, kampanie wielokanałowe, ścieżki cross-sell w ekosystemie marek."
anti_context: "NIE stosować, gdy: (a) nie ma zatwierdzonego fundamentu strategicznego — PLATE nie wymyśla strategii i uruchomiony bez SALT produkuje kalendarz bez tezy; (b) projekt to pojedynczy artefakt bez ciągłości komunikacyjnej (jeden format, jeden layout, jedna wizytówka); (c) projekt techniczny — nie ma odbiorcy-człowieka do przeprowadzenia przez ścieżkę; (d) klient nie ma zdolności wykonawczej na 90 dni — wtedy plan jest fikcją i trzeba zejść do quick wins."
inputs: ["ZATWIERDZONY wynik SALT (S/A/L/T + odkrycia ze statusami) albo równoważny udokumentowany fundament strategiczny","Inwentarz kanałów, do których klient ma realny dostęp i zdolność publikacji","Dane o obecnym ruchu/bazie, jeśli istnieją — albo jawne „n/d”","Ograniczenia wykonawcze: kto produkuje treści, ile godzin, jaki budżet mediowy","Metryki możliwe do zmierzenia (przechodzące assessMetric) — nie metryki wymarzone"]
outputs: ["P — ścieżka klienta: etapy × stan głowy odbiorcy × potrzebny komunikat × kanał","L — rejestr blokad: blokada × DOWÓD, że istnieje × przekaz, który ją usuwa","A — cele: działanie × cel jako ZACHOWANIE odbiorcy × metryka × wartość docelowa × horyzont","T — tematy per odbiorca: top 3 tematy × ton × argument koronny (szkielet HOOK → VALUE → CTA)","E — materiały: kalendarz 90 dni (tydzień × kanał × temat × format × cel) + lista szablonów powtarzalnych","Lista tego, czego świadomie NIE robimy w tym horyzoncie, z powodem"]
ai_tasks: ["Rozpisanie ścieżki i kandydatów na blokady z materiału SALT + researchu","Propozycja tematów per odbiorca zgodnych z warstwą A i T z SALT","Wypełnienie szkieletu kalendarza 90 dni z rytmem realnym dla zdolności klienta","Sprawdzenie każdego przekazu pod kontrolę spójności (czy mapuje się na blokadę albo etap)","Walidacja każdej metryki przez assessMetric przed wpisaniem do kolumny „metryka”"]
human_tasks: ["Przemek/klient: potwierdzenie, że blokady są REALNE — każda musi mieć dowód, nie domysł","Klient: potwierdzenie zdolności wykonawczej na zadeklarowany rytm","Przemek: rozstrzygnięcie, które działania wchodzą do 90 dni, a które wypadają","Przemek: podpisany ślad akceptacji planu przed uruchomieniem produkcji materiałów"]
success_conditions: ["Każdy przekaz da się przypisać do blokady (L) albo etapu ścieżki (P) — jeśli nie, wypada","Każde działanie ma metrykę przechodzącą assessMetric, nie „zwiększymy świadomość”","Każda blokada ma dowód istnienia, nie przypuszczenie","Kalendarz mieści się w realnej zdolności wykonawczej klienta","Tematy nie mieszają poziomów marek (master = WHY, endorsed = WHAT, product = CONTROL)"]
failure_conditions: ["PLATE uruchomiony bez fundamentu — kalendarz istnieje, tezy nie ma","Cele opisane jako stany („większa rozpoznawalność”) zamiast zachowań odbiorcy","Blokady wymyślone przy stole zamiast wyprowadzone z danych albo rozmów","Kalendarz na 90 dni przy zdolności produkcyjnej na 20 — plan umiera w tygodniu 3 i psuje zaufanie do całości","Materiały produkowane przed zatwierdzeniem sekcji A (cele) — praca do kosza przy pierwszej korekcie"]
guards: ["G1 — Bramka fundamentu: bez `requires` wskazującego zatwierdzony SALT (albo jawnie zadeklarowanego równoważnego fundamentu z linkiem) PLATE nie startuje. To jest twarda bramka, nie zalecenie.","G2 — Bramka metryk: kolumna „metryka” w sekcji A przechodzi przez assessMetric; metryka BLOCKED nie wchodzi do planu","G3 — Bramka dowodu blokady: blokada bez dowodu jest hipotezą i musi być tak oznaczona","G4 — Bramka zdolności: kalendarz konfrontowany z liczbą godzin produkcyjnych klienta przed zatwierdzeniem","G5 — Ślad akceptacji: produkcja materiałów (E) startuje po podpisanym odcisku planu"]
provenance: ["szablony/brand/PLATE.md w FrameWorkProdukty/r352-framework (szablon operacyjny, F2 krok 11)","spec/STRATEGIA-WZORZEC.md — D05 Journey Map wskazany jako wejście do PLATE (P + L)","BetterWorkplace/BW_Strategia_Klient.html — sekcja PLATE jako zapowiedź Fazy 2 („Faza 1 = kim jesteśmy i do kogo mówimy · Faza 2 = co, gdzie i jak mówimy”)","BetterWorkplace/r352-deploy/framework.html"]
next_use: "Wyjście PLATE zasila wykonanie: system/communication_matrix.json, system/messaging_templates.json, docs/kalendarz-90d.md oraz zakres produkcji formatów. Po 90 dniach wraca do postmortemu."
postmortem_accounting: ["Ile z kalendarza 90 dni zostało faktycznie opublikowane — i co zatrzymało resztę?","Które blokady okazały się realne, a które były domysłem zespołu?","Czy metryki z sekcji A dały się rozliczyć w zadeklarowanych źródłach, czy instrumentacja zawiodła?","Czy któryś przekaz nie mapował się na blokadę ani etap — jak przeszedł kontrolę spójności?","Czy zdolność wykonawcza klienta była oszacowana trafnie (błąd w którą stronę)?"]
evidence: [{"id":"ev:plate-bt-betterworkplace","type":"backtest","date":"2026-08-09","source":"BetterWorkplace/BW_Strategia_Klient.html","note":"PLATE opisany w dokumencie klienckim jako metoda Fazy 2, z pełną sekwencją P/L/A/T/E i podziałem „F1 = kim jesteśmy i do kogo mówimy, F2 = co, gdzie i jak”. Quick winy z F1 (LinkedIn BW do HR Directorów, branding kit Owocowych Czwartków, mail cross-sell DF→BO) mają już strukturę PLATE: kanał, odbiorca, cel, metryka bazowa. SŁABSZE niż SALT: to zapowiedź i zalążek, nie udokumentowany pełny przebieg z rozliczeniem 90 dni.","project":"proj:teambudget","independence_key":"proj:teambudget::PLATE-BW"},{"id":"ev:plate-bt-szablon","type":"backtest","date":"2026-08-09","source":"FrameWorkProdukty/r352-framework/szablony/brand/PLATE.md","note":"Szablon operacyjny z jawnym mapowaniem każdej litery na artefakt maszynowy Brand Hubu (P→communication_matrix.json audience_stage_mapping, L→messaging_templates.json hooki, A→communication_goal+kpis, T→messaging_templates per audience×stage, E→kalendarz-90d.md + PROMPTS.md) oraz z sekcją KONTROLA SPÓJNOŚCI. Dowód skodyfikowania, nie dowód skuteczności.","project":"proj:r352-framework-brand-hub-os","independence_key":"proj:r352-framework-brand-hub-os::PLATE.md"}]
tags: ["strategia","plate","framework","betterworkplace","komunikacja"]
---

## Problem

Plany komunikacji powstają jako kalendarze: siatka tygodni wypełniona tematami. Kalendarz bez tezy przeżywa trzy tygodnie, bo nikt nie umie rozstrzygnąć, co wypada przy pierwszym konflikcie priorytetów. PLATE odwraca kolejność: najpierw ścieżka i blokady, dopiero na końcu materiały.

## Dlaczego workflow i dlaczego osobno od SALT

Ta sama racja co przy SALT: sekwencja kroków z bramkami, nie generator „X powoduje Y". Osobno od SALT, bo **działa na innym wejściu i może być użyty bez nowej diagnozy** — klient z aktualną, zaakceptowaną strategią potrzebuje PLATE, a nie powtórki SALT. Odwrotnie nie działa: PLATE bez fundamentu produkuje kalendarz bez tezy. Stąd relacja kierunkowa `requires: wf:salt-strategic-diagnosis`.

## Sekwencja

- **P — Przygotuj ścieżkę.** Droga od pierwszego kontaktu do zakupu i powrotu. Na każdym etapie: stan głowy odbiorcy, potrzebny komunikat, miejsce.
- **L — Znajdź blokady.** Co powstrzymuje przed kolejnym krokiem (nie wiedzą o pełnej ofercie · nie ufają · nie widzą różnicy · boją się kosztu zmiany). **Każda blokada wymaga dowodu, że istnieje.** Każda zamienia się w konkretny przekaz, który ją usuwa.
- **A — Ustal cele.** Każde działanie dostaje cel opisany jako **zachowanie odbiorcy**, metrykę, wartość docelową i horyzont. Zakaz ogólników.
- **T — Dopasuj tematy.** Decydent chce zwrotu, użytkownik chce prostoty. Inne tematy, inny ton, inny argument koronny per grupa. Szkielet: HOOK → VALUE (funkcjonalna + emocjonalna + dowód) → CTA.
- **E — Przygotuj materiały.** Kalendarz 90 dni i szablony powtarzalne — dopiero tutaj, po zatwierdzeniu celów.

## Co PLATE realnie zmienia

Wycina. Kontrola spójności („każdy przekaz mapuje się na blokadę albo etap") jest maszyną do usuwania tematów, które ktoś wymyślił, bo brzmiały dobrze. Bramka metryk usuwa działania, których nikt nie umie rozliczyć. Bramka zdolności urealnia kalendarz.

Na BW widać to na quick winach: LinkedIn BW do HR Directorów nie jest „bądźmy na LinkedInie" — jest odpowiedzią na odkrycie #3 (decyzja trafia do złej osoby), z baselinem pod KPI „35% zapytań od HR". To jest ta sama teza, przełożona na kanał i liczbę.
