# PROPOZYCJA KARTY MECHANIZMU (pending)

id: mech:step-progress-nav
nazwa: Pasek kroków (stepper) w treściach sekwencyjnych
status: proposed
confidence: medium (2 wdrożenia: DiMedical m-typer 07.2026; thehermeticum Ścieżka 15.08.2026)
data: 2026-08-15
prepared_by: Claude · decided_by: Przemek

## Trigger
Treść ma **narzuconą kolejność** (ścieżka lektury, onboarding, kurs, konfigurator, proces zakupowy)
i użytkownik na dowolnej podstronie musi wiedzieć: gdzie jestem, ile zostało, dokąd mogę skoczyć.
Objaw braku: „nie wiadomo, co się dzieje" — użytkownik czyta pojedynczą stronę bez poczucia całości.

## Mechanizm
1. **Pasek przyklejony pod headerem** (`position:sticky; top:0`), obecny WYŁĄCZNIE na stronach należących
   do sekwencji — nigdy globalnie (globalny pasek = szum na stronach, które nie są krokiem).
2. **Wszystkie kroki widoczne naraz** w poziomym torze z ukrytym scrollbarem; bieżący wyróżniony
   kolorem akcentu i podkreśleniem, kroki niedostępne przygaszone (opacity ~.4), ale **nadal klikalne**,
   jeśli mają stronę zapowiedzi (patrz mech:coming-soon-stub).
3. **Auto-dosunięcie**: JS przewija tor tak, by bieżący krok znalazł się na środku — bez tego przy
   12 krokach użytkownik na kroku 9 widzi tylko początek listy.
4. **Etykieta pozycji** („Ścieżka · krok 04 z 12”) jako pierwszy element paska, z linkiem do huba
   sekwencji; znika na wąskich ekranach, tor zostaje.
5. **Numeracja tabelaryczna** (`font-variant-numeric: tabular-nums`) — inaczej numery skaczą.
6. Źródłem prawdy o krokach jest **jedna tablica w generatorze**, nie ręczne listy na stronach;
   dzięki temu stepper, hub, mega-menu i zapowiedzi nie mogą się rozjechać.

## Evidence
- DiMedical / m-typer: górne menu przesuwające się wraz z krokami procesu — wzorzec wyjściowy.
- thehermeticum: `stepper_html()` w build.py + `.stp*` w site.css + 6 linii JS; wdrożone na 12 krokach
  Ścieżki w dwóch językach, także na stronach zapowiedzi kroków nieopublikowanych.

## Pułapki (z wdrożenia)
- **Cache**: przy `Cache-Control: immutable` dodanie stylów bez podbicia `?v=N` daje pasek bez CSS
  (surowe linki). Wersję assetów podbijać ZAWSZE razem ze stylami — potknięcie zdarzyło się 2× w jednej sesji.
- **f-string + backslash**: warunkowy atrybut `aria-current` budować przed f-stringiem, nie w środku.
- Stepper nie zastępuje breadcrumbów — pokazuje pozycję w sekwencji, nie w hierarchii serwisu.

## decision_impact
changes: [mechanism, workflow]
targets: ["mech:step-progress-nav (nowa karta)", "checklista UX treści sekwencyjnych"]
note: "Rozwiązuje powtarzalny problem 'nie wiadomo, co się dzieje' w treściach wielokrokowych; wcześniej robione ad hoc per projekt."
