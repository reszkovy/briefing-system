---
id: "rec:routing/genome-os-interface-2026-08-07"
type: "record"
title: "Raport routera: Genome OS Interface"
status: "created"
created: "2026-08-07"
updated: "2026-08-07"
version: 1
owner: "session"
relations: {}
tags: ["legacy-import"]
---

# Raport routera: r352 Genome OS Interface

**Data:** 07.08.2026 · **Brief:** interfejs systemu operacyjnego wiedzy i decyzji („mózg r352") · **Status:** pierwszy żywy przebieg Mechanism Routera (dogfooding na projekcie wewnętrznym)

## 1. Problem biznesowy
Genome (22 mechanizmy, graf, radar, eksperymenty) żyje w plikach md/JSON — wiedza jest, ale nie ma powierzchni, na której Przemek ROZMAWIA z nią przy decyzjach. Prawdziwy problem: koszt dostępu do własnej wiedzy jest wyższy niż koszt zignorowania jej.

## 2. Typ organizacji
r352 sama (solo-founder, AI-native, dane w plikach window.* + localStorage, zero backendu). Użytkownik = 1 osoba + sesje Claude jako pisarze danych.

## 3. Typ projektu
Wewnętrzny viewer wiedzy (klasa: KG viewer / decision cockpit). NIE produkt kliencki (jeszcze) — ale zbudowany tak, żeby mógł stać się demem kategorii Creative Governance.

## 4. Rekomendowane mechanizmy
- **single-source-compiler** (proven) — interfejs w 100% kompilowany z danych Genome (mechanisms JSON, graf, scan); zero treści wpisanej w UI ręcznie. Dowody: framework, FitStyle, TeamBudget.
- **working-artifact-extraction** (proven) — start ze szkieletu `dashboard-starter` (wyekstrahowanego z FOTRA) + port istniejącego modułu grafu; zero kodu od zera. Dowody: CMS bees-knees←DailyFruits, szablony frameworku.
- **design-as-code** (proven) — design language jako tokeny CSS (grafit/granat/błękit/limonka), spójność = kompilacja.
- **agent-as-runtime** (proven) — Router w UI nie liczy sam (statyczny HTML bez LLM): ekran Routera = kolejka briefów + raporty z sesji Claude; sesja jest silnikiem.
- **sandbox-promotion** (proven) — build w osobnym katalogu, FOTRA nietknięta; promocja do ekosystemu po akceptacji.

**Odrzucone przez anti-context:** numeric-gates (nie ma tu przepływu wymagającego bramki), presale-demand-ledger i reszta Funnel Mechanics (to nie jest lejek).

## 5. Agenci
Użyć: sesja główna (build), 2 agenty wzbogacające karty (już biegną). NIE używać: wielkich workflowów (lekcja campnou: „nie odpalać wielkich workflowów do drobiazgów").

## 6. Workflow
scaffold ze skeletonu → tokeny designu → generator danych (genome JSON → js/data/*.js) → moduły ekranów (Home/Genome/Detail/Graph/Projects/Clients/Experiments/Router/CTO) → weryfikacja w przeglądarce → wpis do Genome.

## 7. Ryzyka
- Zakres briefu (9 modułów) > realna zawartość danych (Agents/CTO cienkie) → v1 stubuje cienkie moduły z uczciwym „brak danych" zamiast udawać.
- Ryzyko meta-pułapki: kolejny interfejs zamiast wysyłek (azymut!) — v1 ma twardy timebox jednej sesji.
- Zasada 10 lat: UI jest wymienialne — wartość ma zostać w warstwie danych (genome/), nie w HTML.

## 8. Hipotezy do przetestowania
- **genome-as-interface** (hypothesis): czy „rozmowa z mózgiem firmy" realnie skraca czas decyzji Przemka vs pliki md? Miara: czy Genome OS jest otwierany codziennie po 2 tygodniach.
- Czy Mechanism Detail jako „dokumentacja produktu" nadaje się 1:1 jako materiał sprzedażowy kategorii Creative Governance (pokazywalny klientowi)?
