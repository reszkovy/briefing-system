# r352 Genome OS — opis systemu (handoff dla konsultanta)

Wersja: 1.0 · 07.08.2026 · Autor systemu: Przemysław Reszka (r352) + Claude jako CTO/CKO

## Czym to jest w jednym akapicie

Genome OS to system operacyjny wiedzy i decyzji jednoosobowej firmy kreatywno-systemowej (r352). Zamiast gromadzić projekty, firma gromadzi **mechanizmy**: powtarzalne generatory rezultatów wydestylowane z realnych wdrożeń. Każdy nowy projekt zaczyna się od doboru mechanizmów (Router), a kończy postmortem, który aktualizuje wiedzę (Learning Engine). Interfejsem jest lokalna aplikacja (viewer), silnikiem — sesje AI (Claude), pamięcią — pliki w repo git. Teza biznesowa pod spodem: AI ścięło koszt produkcji kreatywnej o rząd wielkości, więc wąskim gardłem organizacji marketingowych przestała być produkcja, a stał się **governance decyzji** (kto i jak decyduje, że coś jest dobre, on-brand i może wyjść) — r352 buduje wokół tego nową kategorię usług: **Creative Governance** (metodologia: Marketing Mechanism Design).

## Cztery warstwy systemu

**1. Genome (wiedza).** Biblioteka 22 kanonicznych mechanizmów (16 proven) wydestylowanych z pełnego skanu 47 projektów firmy (przeprowadzonego przez zespoły agentów AI). Każdy mechanizm ma ustandaryzowaną kartę: ID, Problem, Trigger (po czym poznać w briefie, że go użyć), Context / Anti-context (kiedy stosować, kiedy NIE), Inputs, Workflow, AI Tasks vs Human Tasks (jawny podział pracy człowiek–maszyna), Expected Outcome, Evidence (projekty-dowody), Confidence (proven ≥3 konteksty / emerging / hypothesis / disproven), Related, zaprojektowany Eksperyment i Version. Przykładowe mechanizmy proven: Numeric Gates (zamiana oceny „wygląda dobrze" na twardy próg liczbowy blokujący przejście dalej), Single-Source Compiler (jedno maszynowe źródło → wszystkie widoki generowane, w tym widok dla AI), Location-as-Data (nowa lokalizacja sieci = rekord w danych, nie nowy projekt), Proof-First Demo Pitch (działające demo na realnych danych klienta zamiast oferty PDF). Ważne: anty-wzorce też mają karty (confidence „disproven") — firma płaci za każdą lekcję tylko raz.

**2. Router (proces wejścia).** Żaden projekt nie zaczyna się od projektowania. Brief przechodzi najpierw przez Mechanism Router: raport 8 sekcji (prawdziwy problem biznesowy → typ organizacji → typ projektu → 3–7 rekomendowanych mechanizmów z confidence i dowodami, z jawnym odrzuceniem tych, które blokuje Anti-context → agenci → workflow → ryzyka → hipotezy do przetestowania). Dopiero po akceptacji raportu rusza egzekucja. Router jest zaimplementowany jako komenda w sesji Claude (`/mechanism-router`), raporty są archiwizowane.

**3. Learning Engine (proces wyjścia).** Po każdym projekcie obowiązkowy postmortem (`/project-postmortem`): które mechanizmy zadziałały (confidence w górę + nowy wpis Evidence), które nie (nowy warunek porażki albo confidence w dół), czy odkryto nowy mechanizm, czy powstał nowy komponent/SOP/guard. Zasada nadrzędna: projekt bez wpisu do Genome został wykonany źle, nawet jeśli klient był zachwycony. Kluczowa metryka systemu (metryka CTO): **liczba zmian confidence wynikających z realnych projektów** — rośnie tylko przez postmortemy, nigdy przez dokumenty.

**4. Puls (świadomość sytuacyjna).** Codzienny automatyczny przegląd (scheduled task ~7:30): skan zmian w pamięci i repozytoriach + radar komunikacji (odczyt Gmail, Slack i Trello przez API — kto czeka na decyzję właściciela, jakie obietnice złożył) + raport dzienny z sekcjami m.in. „nowe mechanizmy", „wąskie gardła z dowodami", „3 priorytety dźwigni". W poniedziałki dodatkowo radar technologiczny (frontier AI/agentic/MCP) z werdyktami w duchu „obserwuj wszystko, adoptuj prawie nic". Nad wszystkim wisi AZYMUT — jedno stabilne zdanie-kompas o stanie systemu (obecnie: „system buduje szybciej, niż wysyła — wąskim gardłem jest wysyłka, nie produkcja").

## Architektura techniczna (świadomie minimalistyczna)

- **Zero backendu.** Interfejs to statyczny HTML+vanilla JS (osiem ekranów: Pulse, Genome, Router, Graf, Eksperymenty, Projekty, Klienci, CTO), serwowany lokalnie. Dane wchodzą jako pliki `window.*_DATA` generowane przez sesje AI (wzorzec „sesja Claude jest jedynym pisarzem, panel jest czystym viewerem").
- **Jedno źródło prawdy.** Karty mechanizmów żyją jako pliki markdown w repo (`r352-os/genome/mechanisms/` + INDEX); interfejs jest w 100% KOMPILOWANY z tych danych generatorem (mechanizm Single-Source Compiler zastosowany do samego siebie — zero treści wpisanej ręcznie w UI).
- **Graf wiedzy.** ~100 węzłów / ~380 krawędzi: projekty, klienci, komponenty, wzorce, lekcje i mechanizmy jako osobna warstwa, z krawędziami typu „potwierdzony w" do projektów-dowodów. Renderowany na canvasie (force layout) z filtrowaniem warstw.
- **AI jako runtime.** Wszystko, co wymaga rozumowania (router, postmortem, radar, destylacja mechanizmów), wykonują sesje Claude — lokalnie, z dostępem do plików i API komunikacyjnych w trybie read-only. Twarde zasady wpisane w prompty: komunikatory tylko odczyt, zero commitów bez zgody, verify-first.
- **Zasada 10 lat.** Inwestycja idzie w warstwy, które drożeją wraz z rozwojem AI (karty mechanizmów, decyzje, relacje, korpusy danych, pamięć) — interfejsy są traktowane jako wymienne.

## Stan na dziś (07.08.2026)

Zrobione: pełny skan 47 projektów, biblioteka 22 mechanizmów (16 proven), projekt kategorii Creative Governance z analizą nazw i klinem wejścia, Router + postmortem jako działające komendy, codzienny przegląd na harmonogramie, interfejs Genome OS działający lokalnie, 22 zaprojektowane eksperymenty na klientach-laboratoriach. Samoocena systemu (scoreboard 1–10000, punkty tylko za dowiezione): **6650** — najsilniejsze: zgodność z zasadą 10 lat (9100) i prawdziwość diagnozy (8600); najsłabsze: dowód komercyjny (900) i dyscyplina wysyłki (2100). System sam diagnozuje, że jego ograniczeniem nie jest architektura, tylko egzekucja komercyjna — pierwsze re-oceny zaplanowane po pierwszym żywym przebiegu Routera na realnym kliencie i pierwszym postmortemie.

## Pytania, w których konsultant może realnie pomóc

1. Kategoria i naming: czy „Creative Governance" komunikuje wartość decydentowi w 5 sekund; jak ją osadzić w polskim rynku.
2. Pricing i pakietyzacja klina (pilot governance briefów u klienta wolumenowego) oraz ścieżka od pilota do retaineru.
3. Ryzyko „solo-founder tworzy kategorię": sekwencja dowodów społecznych przy jednoosobowej skali.
4. Które z 22 mechanizmów mają największy potencjał produktyzacji poza usługą (self-serve / licencja).
