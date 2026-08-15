---
id: "mech:citation-integrity-guard"
type: "mechanism"
title: "Guard integralności cytowań w treści pisanej przez model"
status: "proposed"
created: "2026-08-15"
updated: "2026-08-15"
version: 1
owner: "session"
confidence: {"value":"emerging","evidence_strength":{"n":2,"projects":1,"independent_sources":1,"types":{"narrative":2},"last_confirmed":"2026-08-15"},"recommendation":"use"}
category: "AI Operations"
relations: {"implements":["mech:incident-to-guard"],"related":["mech:agent-as-runtime","mech:negative-knowledge-ledger","mech:numeric-gates"]}
trigger: "Model pisze treść, która powołuje się na źródła: artykuły encyklopedyczne, raporty, materiały z przypisami, dokumentacja z odwołaniami do plików wewnętrznych. Sygnał: 'napisz to na podstawie naszego researchu'."
context: "Projekty, w których wiarygodność jest produktem — serwisy wiedzy, raporty dla klienta, materiały edukacyjne. Im mocniej marka obiecuje sprawdzalność, tym większa szkoda z jednego zmyślonego przypisu."
anti_context: "Nadmiar przy tekstach marketingowych bez aparatu źródłowego. Nie zastępuje weryfikacji merytorycznej — sprawdza istnienie adresu, nie prawdziwość twierdzenia."
inputs: ["Treść z sekcją źródeł", "Katalog realnych dossier/plików badawczych", "Lista stron serwisu do sprawdzenia linków"]
ai_tasks: ["Wypisanie wszystkich cytowanych plików i odnośników wewnętrznych", "Sprawdzenie, czy każdy istnieje na dysku i czy każdy link prowadzi do istniejącej strony", "Zestawienie twierdzeń z tym, co serwis już mówi gdzie indziej, i zgłoszenie sprzeczności"]
human_tasks: ["Przemek-decyzja: co zrobić ze sprzecznością — poprawić nowy tekst czy stary"]
expected_outcome: "Zero przypisów prowadzących do nieistniejących plików i zero twierdzeń sprzecznych z resztą serwisu. Sprawdzenie trwa sekundy i wychwytuje to, czego korekta językowa nie widzi."
evidence: [{"id":"ev:citation-integrity-guard-001","type":"narrative","date":"2026-08-15","source":"proj:thehermeticum","note":"Model (ta sesja) napisał osiem artykułów i w sekcjach źródeł podał PIĘĆ nieistniejących nazw dossier: alchemy.md, kybalion.md, renaissance-revival.md, reception-modern.md, figures.md. Nazwy brzmiały jak prawdziwe, bo były utworzone przez analogię do realnych. Wykryte wyłącznie przez skrypt sprawdzający istnienie plików — trzy wcześniejsze przejścia korektorskie (rzeczowe i językowe) tego nie zobaczyły. Realne pliki: great-work.md, modern-occult.md, renaissance.md, scholarship.md.","mechanism":"mech:citation-integrity-guard","project":"proj:thehermeticum","independence_key":"proj:thehermeticum::sesja-2026-08-15-a"},{"id":"ev:citation-integrity-guard-002","type":"narrative","date":"2026-08-15","source":"proj:thehermeticum","note":"Zestawienie nowego tekstu z istniejącą stroną o Ficinie wykazało dwie rozbieżności: nowy artykuł podawał 'szesnaście wydań przed 1500' (liczba bez pokrycia; strona serwisu mówi 'dziesiątki wydań do 1600') oraz opisywał polecenie Kosmy Medyceusza jako fakt, podczas gdy własna strona serwisu flaguje, że relacja pochodzi z przedmowy Ficina i jest przedmiotem sporu. Oba błędy to zmyślona precyzja i pominięte zastrzeżenie — dokładnie te wady, które serwis wytyka innym.","mechanism":"mech:citation-integrity-guard","project":"proj:thehermeticum","independence_key":"proj:thehermeticum::sesja-2026-08-15-b"}]
tags: ["ai","quality","content"]
---

## Problem

Model piszący z pamięci nie zmyśla treści — zmyśla **adresy**. Nazwa pliku, sygnatura rękopisu, numer sekcji: rzeczy, które wyglądają jak przypis i których nikt nie sprawdza, bo brzmią prawidłowo. Korekta merytoryczna czyta twierdzenia, korekta językowa czyta zdania; żadna nie otwiera cytowanego pliku.

Szkoda jest niesymetryczna. Treść może być poprawna w stu procentach, a jeden fałszywy przypis podważa całą obietnicę sprawdzalności — zwłaszcza w projekcie, którego cała propozycja wartości brzmi „źródła stoją przy każdym haśle".

## Mechanizm działania

Trzy sprawdzenia uruchamiane na treści, zanim pójdzie dalej:

1. **Każdy cytowany plik wewnętrzny musi istnieć** — proste zestawienie z katalogiem.
2. **Każdy link wewnętrzny musi prowadzić do istniejącej strony** — w obu wersjach językowych.
3. **Twierdzenia zestawione z tym, co serwis już mówi** — sprzeczność jest sygnałem, że jedno z dwóch jest błędne, i wymaga decyzji człowieka, które.

Punkty 1 i 2 są mechaniczne i powinny być guardem buildu. Punkt 3 wymaga modelu, ale daje się zawęzić: wystarczy porównać nowy tekst ze stronami o tych samych bytach.

## Dlaczego to nie jest oczywiste

Bo błąd nie wygląda na błąd. `renaissance-revival.md` i `renaissance.md` różnią się jednym członem, a pierwszy brzmi bardziej precyzyjnie. Model wybiera nazwę, która najlepiej opisuje zawartość — nie tę, która istnieje.

## Warunki porażki

Mechanizm **nie zadziała**, gdy źródła są wyłącznie zewnętrzne i nieweryfikowalne programowo (książka papierowa, rozmowa) — wtedy guard sprawdza tylko to, czy przypis ma komplet pól, nie czy istnieje. Nie zadziała też, gdy treść powstaje poza repo (edytor CMS bez buildu) — trzeba wtedy uruchamiać sprawdzenie w pipeline publikacji, a nie w buildzie.

**Fałszywe poczucie bezpieczeństwa** to główne ryzyko: guard potwierdza istnienie adresu, nie prawdziwość twierdzenia. Poprawnie sformatowany przypis do istniejącego pliku, w którym danego zdania nie ma, przejdzie. Dlatego mechanizm jest warunkiem koniecznym, nie wystarczającym.

## Jak zmierzyć, że działa

Liczba przypisów prowadzących do nieistniejących plików i liczba martwych linków wewnętrznych — obie muszą wynosić zero przy każdym buildzie. Wskaźnik wtórny: liczba sprzeczności między nowym tekstem a istniejącymi stronami wykrytych przed publikacją, a nie po.
