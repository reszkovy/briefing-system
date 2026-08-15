# PROPOZYCJA KARTY MECHANIZMU (pending)

id: mech:open-library-paid-structure
nazwa: Ebook jako warstwa monetyzacji wiedzy (biblioteka otwarta, struktura płatna)
status: proposed
confidence: low-medium (1 wdrożenie w toku: thehermeticum; poprzedni dowód negatywny: bramkowane raporty)
data: 2026-08-15
prepared_by: Claude · decided_by: Przemek

## Trigger
Projekt treściowy zgromadził materiał o wartości książkowej i pojawia się pytanie „jak na tym zarabiać",
przy jednoczesnym oporze wobec lejków, presji i bramkowania wiedzy.

## Zasada
> **Wiedza może być otwarta. Przemiana wymaga struktury, obecności i zapłaty.**
> *The Hermeticum keeps knowledge open and charges for structure, tools, and guided practice.*

Monetyzujemy **strukturę, czas, prowadzenie, narzędzia i ciągłość** — nie dostęp do informacji.

## Pięć warstw
1. **Publiczna biblioteka (0)** — manifest, część rozdziałów, glossary, ścieżki lektur, eseje,
   wybrane praktyki. Buduje zaufanie i pokazuje standard rzemiosła.
2. **Płatna pełna ścieżka** — pełna książka, workbook, praktyki, systemy tygodniowe, audio, szablony.
   Naturalny próg zamiast agresywnego paywalla: *the public work is free, the structured path is paid*.
3. **Membership jako patronat + praktyka** — nie „subskrypcja contentu”: utrzymanie niezależności szkoły,
   miesięczne praktyki, archiwum, reading circle, nowe narzędzia. *Membership keeps the school independent.*
4. **Cohorty i warsztaty** — małe grupy, konkretna transformacja; tu leży największa marża, bez masowego ciśnienia.
5. **Pay what you can / patron tier** — stała cena bazowa + opcja wsparcia wyżej, stypendia i darmowe
   dostępy; transparentnie: płatne warstwy utrzymują darmowe archiwum.

## Ebook: forma i technika
- **Czytnik w serwisie**, nie plik do pobrania jako główny nośnik: rozdziały jako strony z bocznym spisem,
  paskiem postępu, nawigacją prev/next i wznawianiem lektury (localStorage, bez cookies).
- **Rozdziały generowane z jednego źródła** (JSON per rozdział) — ta sama treść zasila stronę, książkę,
  PDF i newsletter; zero rozjazdu wersji.
- **Spis w formie indeksu drukarskiego** (numeracja rzymska części, linie wiodące) — nadaje wagę „dzieła”,
  odróżnia od bloga.
- Próg płatny wchodzi PO rozdziale, nie w połowie zdania; podgląd musi się domykać sensownie.

## Uwaga (rozstrzygnięcie sprzeczności z Genome)
Wcześniejszy zapis „bramkowane treści nie działają" dotyczył **lead-magnetów** (raport za e-mail).
Ten mechanizm jest inny: freemium na dziele z realną bramką płatniczą. **Nie stosować bramki mailowej
do treści** — e-mail zbieramy wartością listu, nie blokadą wiedzy.

## decision_impact
changes: [mechanism, decision]
targets: ["mech:open-library-paid-structure (nowa karta)", "model monetyzacji projektów treściowych r352"]
note: "Daje r352 powtarzalny model zarabiania na treści bez lejka; wymaga bramki płatniczej (Stripe) — dopóki jej nie ma, warstwy 2-5 są planem, nie mechanizmem."
