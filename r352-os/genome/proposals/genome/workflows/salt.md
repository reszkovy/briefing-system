---
id: "wf:salt"
type: "workflow"
title: "SALT — diagnoza strategiczna (Sytuacja · Odbiorcy · Przewaga · Zmiana)"
status: "draft"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {"uses": ["mech:competitive-benchmarking"], "related": ["mech:strategy-before-execution", "prin:extract-never-invent"]}
trigger: "Klient mówi: 'wzrost się zatrzymał', 'konkurenci wyglądają tak samo, zostaje cena', 'polecenia przestały wystarczać', 'mamy kilka marek i nikt nie widzi związku'. Albo: brief prosi o egzekucję (strona/kampania/materiały), ale nikt nie potrafi jednym zdaniem powiedzieć, KOMU i CZYM ta firma wygrywa."
inputs: ["Dane sprzedażowe/liczby, które spadają lub stoją (przychód, konwersja, retencja, koszyk)", "Kto dziś kupuje i kto POWINIEN kupować (rola, budżet, LTV)", "Obecna komunikacja marki + komunikacja kategorii (benchmark z mech:competitive-benchmarking)", "Lista marek/bytów w obiegu i ich wzajemne relacje", "Dostęp do klientów klienta (wywiady) LUB jawna deklaracja, że go nie ma"]
outputs: ["WNIOSEK S — jedno zdanie: co się dzieje i co nie działa", "KLASYFIKACJA PROBLEMU: dominujący + wtórny (percepcyjny | produktowy | cenowy | dystrybucyjny)", "WNIOSEK A — jedno zdanie: odbiorca dzisiejszy vs docelowy i różnica wartości", "WNIOSEK L — jedno zdanie: przewaga strukturalna + areny konkurencji + wolna pozycja", "WNIOSEK T — jedno zdanie: transformacja percepcji z X na Y + dowód behawioralny", "ODKRYCIA KLUCZOWE (2-4), każde falsyfikowalne, ze statusem ZWALIDOWANE|HIPOTEZA i planem walidacji", "Rejestr założeń, alternatyw odrzuconych i ryzyk"]
anti_context: "NIE uruchamiać, gdy: (a) problem dominujący jest produktowy, cenowy lub dystrybucyjny — branding tego nie naprawi i SALT ma to POWIEDZIEĆ, nie obejść; (b) istnieje świeża, zaakceptowana strategia (<12 mies.) i brief jej nie kwestionuje — wtedy wchodzi od razu PLATE; (c) projekt jest czysto techniczny/infrastrukturalny bez odbiorcy zewnętrznego (migracja, refactor, narzędzie wewnętrzne); (d) zlecenie jest jednorazowym artefaktem bez konsekwencji pozycjonujących (jeden baner, jedna poprawka)."
guards: ["BRAMKA UCZCIWOŚCI: jeśli dominujący problem ≠ percepcyjny — powiedzieć to klientowi na diagnozie, ZANIM wyda budżet; dla każdego zaznaczonego typu napisać wprost co rozwiązuje branding, a czego NIE", "Każde odkrycie ma status ZWALIDOWANE albo HIPOTEZA — hipoteza podana jako fakt jest naruszeniem prin:extract-never-invent", "Wniosek warstwy = JEDNO zdanie. Akapit oznacza, że warstwa nie została domknięta", "Przewaga potwierdzona przez klientów klienta, nie przez samego klienta (deklaracja właściciela to intention, nie evidence)"]
success_conditions: ["Cztery wnioski (S/A/L/T) mieszczą się w jednym zdaniu każdy i nie są wymienne między klientami", "Klasyfikacja problemu jest jawna i ma konsekwencję zakresową (co robimy / czego NIE robimy)", "Każde odkrycie ma status i plan walidacji", "Alternatywne pozycjonowania zostały nazwane i odrzucone Z POWODEM, nie pominięte"]
failure_conditions: ["Wnioski brzmią jak mogłyby dotyczyć dowolnej firmy w kategorii — to znak, że warstwa L (przewaga) nie została wykonana", "Hipotezy prezentowane jako ustalenia (brak kolumny status)", "Diagnoza dostosowana do zakresu, który klient już kupił — SALT ma prawo zakwestionować zamówienie", "SALT kończy się dokumentem, ale żadna decyzja zakresowa się nie zmienia (patrz: rozliczenie w postmortemie)"]
provenance: ["BetterWorkplace Faza 1 (kwiecień-maj 2026) — 6 deliverables, metodologia SALT; źródło: ~/Desktop/Claude_zadania/BetterWorkplace/BW_Strategia_Klient.html", "Szablon operacyjny: FrameWorkProdukty/r352-framework/szablony/strategia/SALT.md (F1 krok 3)", "Wzorzec dokumentu: r352-framework/spec/STRATEGIA-WZORZEC.md"]
next_use: "Wynik SALT jest WEJŚCIEM do wf:plate (relacja kierunkowa). Bez zatwierdzonego SALT albo równoważnego istniejącego fundamentu strategicznego PLATE nie startuje."
postmortem_settlement: "W postmortemie rozliczyć: (1) które ODKRYCIA-HIPOTEZY zostały zwalidowane, a które upadły — po tym poznaje się jakość diagnozy, nie po ładności dokumentu; (2) czy klasyfikacja problemu okazała się trafna (czy branding realnie ruszył wskaźnik, czy problem był produktowy/cenowy); (3) KTÓRE DECYZJE ZAKRESOWE zmieniły się dzięki SALT — jeśli żadna, SALT był kosztem; (4) czy transformacja T ma dowód behawioralny, czy tylko deklaratywny."
tags: ["strategia", "bw-origin"]
---

## Problem

Egzekucja bez diagnozy produkuje ładne artefakty, które nie zmieniają pozycji rynkowej. Klient przychodzi po stronę/kampanię, a realny problem leży w tym, że nikt — łącznie z zarządem — nie potrafi jednym zdaniem powiedzieć, komu i czym ta firma wygrywa. Genome do tej pory pamiętał, że strategia POWSTAŁA, ale nie potrafił odtworzyć SPOSOBU ROZUMOWANIA, który ją stworzył.

## Procedura (4 warstwy, każda buduje na poprzedniej)

Nie zaczynamy od pomysłów kreatywnych. Zaczynamy od zrozumienia problemu. Wynik każdej warstwy: JEDEN twardy, jednozdaniowy wniosek.

**S — SYTUACJA · co się dzieje i co nie działa?**
Co klient sprzedaje, komu i za ile — a co MYŚLI, że sprzedaje. Które liczby spadają lub stoją. Co dziś komunikuje marka i jak to brzmi na tle kategorii. Ile bytów/marek jest w obiegu i czy klient końcowy widzi między nimi związek.
→ Bramka uczciwości: klasyfikacja problemu na dominujący i wtórny (percepcyjny / produktowy / cenowy / dystrybucyjny). Percepcyjny → framework to rozwiązuje. Produktowy → to praca produktowa, nie branding. Cenowy → branding wspiera, nie naprawi. Dystrybucyjny → poza zakresem.

**A — ODBIORCY · do kogo mówimy i co ich motywuje?**
Kto dziś podejmuje decyzję zakupową, a kto POWINIEN (gdzie większy budżet i dłuższa relacja). Jak każda z tych osób nazywa problem SWOIMI słowami. Różnica wartości między odbiorcą dzisiejszym a docelowym. Kto wpływa na decyzję, choć nie kupuje.

**L — PRZEWAGA · czym się wyróżniamy, czego konkurencja nie ma?**
Co klient robi naprawdę dobrze — potwierdzone przez JEGO klientów. Które przewagi są kopiowalne w 6 miesięcy, a które strukturalne. Na jakich arenach naprawdę konkurujemy. Czego NIE mówi nikt w kategorii — jaka pozycja jest wolna.

**T — ZMIANA · co chcemy zmienić w głowie odbiorcy?**
Jak odbiorca myśli o marce DZIŚ i jak ma myśleć PO. Co jest dowodem, że transformacja zaszła — zachowanie, nie deklaracja. Archetyp: z „dostawcy X" na „partnera od Y".

**ODKRYCIA KLUCZOWE (2-4)** — z czterech wniosków wyprowadzamy odkrycia determinujące wszystkie decyzje dalej. Każde: jedno zdanie, falsyfikowalne, ze statusem ZWALIDOWANE (czym: wywiady n=…, CRM, ankieta) albo HIPOTEZA (jak i kiedy zwalidujemy), zmapowane na deliverables.

## Decyzje, które SALT realnie zmienia

Nie „powstaje dokument", tylko: **zakres** (co wchodzi, a co wypada z oferty), **odbiorca komunikacji** (do kogo w ogóle mówimy — często zmiana persony zmienia cały brief), **oś pozycjonowania** (która przewaga jest kręgosłupem), **cena i model współpracy** (problem produktowy → inna oferta niż branding), **decyzja GO/NO-GO** (kiedy uczciwie powiedzieć, że branding nie pomoże).

## Version
- v1 · 2026-08-09 — ekstrakcja z BetterWorkplace Faza 1 + szablonu r352-framework. Status `draft` (propozycja, nie kanon).
