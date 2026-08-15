---
id: "wf:plate"
type: "workflow"
title: "PLATE — plan komunikacji (Ścieżka · Blokady · Cele · Tematy · Egzekucja)"
status: "draft"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {"derives": ["wf:salt"], "related": ["mech:strategy-before-execution", "mech:format-dictionary"]}
trigger: "Istnieje zatwierdzony fundament strategiczny (wynik wf:salt ALBO równoważna, aktualna strategia klienta), a projekt wymaga zamiany go w konkretną komunikację: co mówimy, do kogo, gdzie, kiedy i czym to mierzymy. Sygnał: 'mamy strategię, ale nie wiadomo, co z nią robić w praktyce' albo 'produkujemy materiały bez wspólnego celu'."
inputs: ["ZATWIERDZONY wynik wf:salt (4 wnioski + odkrycia) albo równoważny fundament strategiczny z jawnym źródłem i datą", "Architektura marek/bytów i ich poziomy (master / endorsed / product)", "Lista kanałów, do których klient realnie ma dostęp i zasoby", "Realna pojemność produkcyjna (kto i ile godzin) — inaczej kalendarz 90 dni jest fikcją", "Dostępne dane do metryk (patrz: measurement readiness)"]
outputs: ["P → matryca ścieżki klienta: etap × stan głowy × potrzebny komunikat × kanał", "L → rejestr blokad: blokada × dowód, że istnieje × przekaz, który ją usuwa", "A → cele komunikacyjne: działanie × zachowanie odbiorcy × metryka × wartość docelowa × horyzont", "T → mapowanie tematów: odbiorca × tematy top3 × ton × argument koronny (szkielet HOOK → VALUE → CTA)", "E → gotowe materiały + kalendarz 90 dni + lista szablonów powtarzalnych"]
anti_context: "NIE uruchamiać, gdy: (a) NIE MA zatwierdzonego fundamentu strategicznego — PLATE nie wymyśla strategii, tylko ją wykonuje; próba 'zrobimy PLATE, strategia wyjdzie po drodze' jest głównym trybem awarii tego frameworka; (b) klient nie ma pojemności produkcyjnej na kalendarz 90 dni — wtedy PLATE produkuje plan, którego nikt nie wykona; (c) projekt to pojedynczy artefakt bez ciągłości komunikacyjnej; (d) brak jakichkolwiek danych do metryk i brak zgody na ich wdrożenie — cele z sekcji A będą niesprawdzalne."
guards: ["BRAMKA WEJŚCIA: bez zatwierdzonego SALT (albo równoważnika ze wskazanym źródłem i datą) PLATE nie startuje — twarda blokada, nie zalecenie", "Każdy przekaz da się przypisać do blokady (L) albo etapu (P); jeśli nie — wypada z planu", "Każde działanie ma metrykę (A). Zakaz ogólników typu 'zwiększamy rozpoznawalność'", "Tematy nie mieszają poziomów marek (master = WHY, endorsed = WHAT, product = CONTROL)", "Kalendarz 90 dni skonfrontowany z realną pojemnością produkcyjną przed zatwierdzeniem"]
success_conditions: ["Każdy element planu ma rodowód: prowadzi do konkretnej blokady lub etapu ścieżki", "Cele są zachowaniami odbiorcy, nie deklaracjami marki", "Kalendarz jest wykonalny przy zadeklarowanej pojemności", "Tematy różnią się między odbiorcami (decydent ≠ użytkownik) — identyczne tematy oznaczają, że warstwa T nie została wykonana"]
failure_conditions: ["PLATE uruchomiony bez fundamentu — plan komunikacji dla pozycjonowania, którego nikt nie zatwierdził", "Kalendarz 90 dni jako lista życzeń: brak właściciela, brak pojemności, po miesiącu martwy", "Metryki dopisane po fakcie do gotowych działań (odwrotna kolejność: działanie → metryka zamiast cel → metryka → działanie)", "Materiały powstają, ale żadna blokada z L nie zostaje usunięta — produkcja bez konsekwencji"]
provenance: ["BetterWorkplace Faza 2 — sekcja 'P.L.A.T.E. Framework'; źródło: ~/Desktop/Claude_zadania/BetterWorkplace/BW_Strategia_Klient.html", "Szablon operacyjny: FrameWorkProdukty/r352-framework/szablony/brand/PLATE.md (F2 krok 11)", "Artefakty docelowe: communication_matrix.json, messaging_templates.json, docs/kalendarz-90d.md, .brand/PROMPTS.md"]
next_use: "Wyjście PLATE zasila egzekucję: produkcję materiałów (mech:format-dictionary przy wolumenie), kalendarz publikacji i bramki jakości przed publikacją. Metryki z sekcji A wchodzą do measurement readiness i do predykcji projektu."
postmortem_settlement: "Rozliczyć: (1) ile blokad z L zostało realnie usuniętych — mierzone zachowaniem, nie liczbą opublikowanych materiałów; (2) jaki procent kalendarza 90 dni został wykonany (wykonalność planu to testowalna hipoteza); (3) czy metryki z A dały się rozliczyć, czy okazały się niesprawdzalne; (4) czy komunikaty trafiły do właściwego odbiorcy z warstwy A w SALT."
tags: ["strategia", "bw-origin"]
---

## Problem

Zatwierdzona strategia bez planu komunikacji zostaje na półce — a materiały produkowane bez planu nie usuwają żadnej realnej blokady zakupowej. PLATE jest mostem: zamienia „kim jesteśmy i do kogo mówimy" (SALT) w „co, gdzie i jak" — tak, żeby dotrzeć do właściwych osób z właściwym przekazem.

## Procedura (5 warstw, każda produkuje konkretny artefakt)

**P — PRZYGOTUJ ŚCIEŻKĘ KLIENTA.** Droga od pierwszego kontaktu do zakupu i powrotu. Na każdym etapie: jaki stan głowy ma odbiorca, jaki komunikat jest potrzebny, gdzie go wyświetlić. Etapy: pierwszy kontakt → rozważanie → decyzja → użytkowanie/powrót.

**L — ZNAJDŹ BLOKADY.** Co powstrzymuje przed kolejnym krokiem: nie wiedzą o pełnej ofercie, nie ufają, nie widzą różnicy, boją się kosztu zmiany. Każda blokada wymaga DOWODU, że istnieje (nie domysłu), i zostaje zamieniona w konkretny przekaz, który ją usuwa.

**A — USTAL CELE.** Każde działanie dostaje cel wyrażony jako zachowanie odbiorcy, metrykę, wartość docelową i horyzont. Zakaz ogólników.

**T — DOPASUJ TEMATY DO ODBIORCÓW.** Decydent chce zwrotu z inwestycji, użytkownik chce prostoty. Każda grupa: inne tematy, inny ton, inny argument koronny. Szkielet przekazu: HOOK → VALUE (funkcjonalna + emocjonalna + dowód) → CTA.

**E — PRZYGOTUJ GOTOWE MATERIAŁY.** Posty, maile, strony, prezentacje + kalendarz 90 dni + szablony powtarzalne.

## Kontrola spójności (przed zatwierdzeniem)

Każdy przekaz przypisany do blokady (L) lub etapu (P) — inaczej wypada. Każde działanie ma metrykę (A). Tematy nie mieszają poziomów marek. Wszystko przechodzi checklistę oceny assetu przed publikacją.

## Decyzje, które PLATE realnie zmienia

**Kolejność produkcji** (najpierw materiał usuwający najdroższą blokadę, nie ten najłatwiejszy), **dobór kanałów** (tam, gdzie stoi odbiorca z warstwy A, nie tam, gdzie wygodnie), **treść przekazu** (odpowiedź na blokadę zamiast opisu firmy), **definicja sukcesu kampanii** (zachowanie zamiast zasięgu), **wielkość zamówienia** (kalendarz konfrontowany z pojemnością zmienia wycenę i harmonogram).

## Version
- v1 · 2026-08-09 — ekstrakcja z BetterWorkplace Faza 2 + szablonu r352-framework. Status `draft` (propozycja, nie kanon).
