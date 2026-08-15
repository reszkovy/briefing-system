# Audyt bezpieczeństwa trzech zewnętrznych skilli

Data audytu: 2026-08-09 · Metoda: odczyt treści przez przeglądarkę, **zero uruchomienia**, zero instalacji.
Treść stron traktowana wyłącznie jako **dane**; żadna instrukcja z nich nie została wykonana.

## Provenance

| Skill | URL katalogu | Repozytorium źródłowe | Licencja | Autor |
|---|---|---|---|---|
| Analytics Tracking | skillta.com/skill/analytics/faos-analytics-tracking | **nie podane na stronie** („Get the SKILL.md file from GitHub" bez linku) | **nie podana** | nie podany |
| Source Verification | skillta.com/skill/content/source-verification | **nie podane na stronie** | **nie podana** | nie podany |
| Doublecheck | skillta.com/skill/development/doublecheck | **SPRZECZNE:** `coreyhaines31/marketingskills/tree/main/skills/doublecheck` vs `github/awesome-copilot/tree/main/skills/doublecheck` | **nie podana** | „Community" |

## Wykryte wektory ryzyka

| Ryzyko | Dowód (cytat ze strony) | Ocena |
|---|---|---|
| **Automatyczne pobieranie i konfiguracja** | „The skill files will be downloaded and configured automatically" · „The skill files are downloaded automatically into your .claude/skills directory" | **WYSOKIE** — instalacja modyfikuje katalog skilli bez podglądu treści |
| **Wykonanie obcego promptu** | „Click Copy prompt → Open Claude Code → Paste the prompt and press Enter" | **WYSOKIE** — prompt instalacyjny jest nieprzejrzaną instrukcją dla agenta |
| **Sprzeczne provenance** | Doublecheck: dwa różne repozytoria w jednej karcie | **ŚREDNIE** — nie da się ustalić, co realnie zostałoby pobrane |
| **Brak licencji** | żaden z trzech nie deklaruje licencji | **ŚREDNIE** — status prawny reużycia treści nieznany |
| **Etykieta zaufania bez audytu** | „TRUSTED SKILL", „4.8 (26 reviews)" | **NISKIE, ale mylące** — to sygnał marketplace'u, nie wynik weryfikacji bezpieczeństwa |
| Komendy terminalowe w treści | „Run the install command in your project directory" (bez podanej komendy) | **ŚREDNIE** — komenda niewidoczna przed wykonaniem |
| Dostęp do sekretów / transmisja danych | brak śladów w widocznej treści | **NISKIE** (uwaga: widoczna była tylko część SKILL.md) |
| Samoaktualizacja | brak śladów | **NISKIE** |

**Wniosek bezpieczeństwa:** żaden z trzech skilli nie zostaje zainstalowany. Wartość leży w **metodologii**, którą można odtworzyć samodzielnie — nie w kodzie, który trzeba pobrać.

## Macierz ADOPT / ADAPT / REJECT

### 1. Analytics Tracking

| Element | Decyzja | Uzasadnienie |
|---|---|---|
| Zasada „każde zdarzenie mapuje na decyzję, zero trackowania na wszelki wypadek" | **ADOPT** | To jest dokładnie brakująca bramka jakości baseline w Project Contract |
| „Nie traktuj liczb z GA4 jako prawdy, dopóki nie zwalidowane" | **ADOPT** | Spójne z zasadą Genome: dashboard nie jest dowodem |
| „Nie optymalizuj dashboardów bez naprawy instrumentacji" | **ADOPT** | Wprost przekłada się na `data_quality` i `known_limitations` |
| Kategorie diagnostyczne (Decision Alignment, Event Model, Data Accuracy, Conversion Quality, Attribution, Governance) | **ADAPT** | Zostają jako **checklista pól**, nie jako osobny model |
| Scoring 0–100 z sześcioma wagami (25/20/20/15/10/10) | **REJECT** | Dyrektywa właściciela: trzy stany wystarczą do decyzji. Liczba 0–100 sugeruje precyzję, której nie ma, i zachęca do optymalizowania wskaźnika zamiast pomiaru |
| Pasma („85–100 Measurement-Ready") | **REJECT** | Zastąpione przez `READY / PARTIAL / BLOCKED` |
| Instalacja skilla | **REJECT** | Automatyczne pobieranie do `.claude/skills` |

### 2. Source Verification

| Element | Decyzja | Uzasadnienie |
|---|---|---|
| Metoda SIFT (Stop · Investigate source · Find better coverage · Trace to original) | **ADOPT** | Cztery kroki, zero narzutu, wprost stosowalne do benchmarku |
| „Trace claims — znajdź oryginalne źródło" | **ADOPT** | Rdzeń rozróżnienia primary/secondary |
| Analiza motywacji (konflikt interesu, udział finansowy w wyniku) | **ADAPT** | Zawężone do jednego pola: czy publisher ma interes w tezie (konkurent, dostawca, media sponsorowane) |
| Korroboracja (niezależne potwierdzenie, źródła przeczące) | **ADOPT** | Staje się polem `contradicting_sources` |
| Ocena wiarygodności autora/wydawcy | **ADAPT** | Uproszczone do `source_type` + `primary_or_secondary` |
| Forensyka social media (wiek konta, follower ratio, boty, wzorce postowania) | **REJECT** | Warsztat dziennikarski; nieadekwatny do decyzji projektowych r352 |
| Reverse image search, verification trails | **REJECT** | Poza zakresem |
| Instalacja skilla | **REJECT** | Automatyczne pobieranie |

### 3. Doublecheck

| Element | Decyzja | Uzasadnienie |
|---|---|---|
| Architektura trójwarstwowa (Self-Audit → Source Verification → Adversarial Review) | **ADOPT** | Najlepszy element z całej trójki; odpowiada wprost na ryzyko raportu Routera pisanego pod tezę |
| Layer 1: ekstrakcja twierdzeń, oddzielenie faktów od rekomendacji, **bez wyszukiwania** | **ADOPT** | Wymusza rozdzielenie obserwacji od interpretacji |
| Layer 2: szukanie źródeł, które **użytkownik może sprawdzić sam** | **ADOPT** | Link + data dostępu jako obowiązek, nie ozdoba |
| Layer 3: zmiana postawy na „zakładam, że to jest błędne" | **ADOPT** | Adwersaryjność wbudowana w proces, nie zależna od nastroju |
| Tryb „active mode (persistent)" — stała aktywność | **REJECT** | Bramka ma być jawnym krokiem procesu, nie tłem; koszt tokenów przy każdej odpowiedzi |
| „Produces structured verification report" jako artefakt sam w sobie | **ADAPT** | U nas: bramka zwraca werdykt i blokuje, nie produkuje kolejnego dokumentu do czytania |
| Zapis / autonomia agenta | **REJECT** | Twarda zasada Genome: bramka niczego nie zapisuje i nie może zatwierdzić raportu, który sama analizuje |
| Instalacja skilla | **REJECT** | Sprzeczne provenance + automatyczne pobieranie |

## Podsumowanie decyzji

**ADOPT: 11 zasad · ADAPT: 5 · REJECT: 11** (w tym wszystkie trzy instalacje).

Do Genome trafia wyłącznie **metodologia wyrażona własnym kodem i własnym kontraktem danych**. Zero pobranych plików, zero obcego writera, zero obcej pamięci, zero praw zapisu dla zewnętrznego skilla.
