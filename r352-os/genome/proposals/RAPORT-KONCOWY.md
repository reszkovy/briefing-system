# Raport końcowy — blokery Research/Measurement + warstwa SALT/PLATE

Data: 2026-08-09 · Status: **przed wdrożeniem, zero `--apply`, kanon nietknięty**

---

## 0. Kolizja dwóch sesji — do rozstrzygnięcia PRZED czymkolwiek

W `proposals/` leżą **dwa niezależne zestawy SALT/PLATE**, zbudowane równolegle. Nie usunąłem cudzej pracy i nie połączyłem ich samodzielnie — to jest decyzja właściciela.

| | ten zestaw | zestaw równoległy |
|---|---|---|
| karty | `workflows/salt-strategic-diagnosis.md`, `plate-communication-plan.md` | `genome/workflows/salt.md`, `plate.md` (`wf:salt`, `wf:plate`) |
| relacja kierunkowa | `requires` — **wymaga 1 słowa w `RELATION_KEYS`** | `derives` — bez zmiany kompilatora |
| mechanizm-claim z confidence | ✗ | ✓ `mech:strategy-before-execution` (emerging, 2× backtest) |
| Recordy backtestów (prowieniencja) | ✗ | ✓ 2 |
| moduł rozpoznania | `lib/framework-router.js` (104 l.) | `lib/strategy-frameworks.js` (169 l.) |
| testy warstwy strategicznej | ✓ D1–D8 w `run-research-tests.js` | ✓ `run-strategy-tests.js` — 26 PASS |
| 8 blokerów Research/Measurement | ✓ zamknięte | nie dotyczy |
| diff `mechanism-router/SKILL.md` | ✓ | ✗ |
| walidacja na kopii Genome | ✓ 199 obiektów, 0 błędów | ✓ 202 obiekty, 0 błędów |

**Zweryfikowałem oba zestawy sam, nie z opisu.** Oba kompilują się czysto osobno. **Wdrożenie obu naraz daje 2× SALT i 2× PLATE** o różnych ID — build tego nie zablokuje (ID są unikalne), a baza wiedzy dostanie dwie konkurencyjne definicje tego samego procesu. Sprawdzone: 204 obiekty, duplikat tytułu SALT.

**Rekomendacja scalenia** (nie wykonana):
- karty SALT/PLATE: **ten zestaw** — pełne pola z wymogu 6 (`guards`, `provenance`, `next_use`, `postmortem_accounting`, `failure_conditions`) i cztery źródła prowieniencji;
- **dobrać z zestawu równoległego**: `mech:strategy-before-execution` + 2 Recordy backtestów. To jest lepszy model niż mój: **claim** („diagnoza przed produkcją poprawia wynik") jest mechanizmem i nosi confidence/Evidence, a **procedury** są workflowami. Mój zestaw wsadził confidence na kartę workflow, gdzie build.js jej nie waliduje — słabsze;
- relacja: `requires` zamiast `derives`. `derives` w tej ontologii znaczy „abstrahuje z" (Principle → Axiom), nie „nie startuje bez". Koszt: jedno słowo w kompilatorze;
- moduł: `framework-router.js` jako baza, dobrać z `strategy-frameworks.js` to, czego u mnie nie ma (przejrzałem: bramka wejścia PLATE jest w obu).

Do czasu decyzji **żaden z zestawów nie jest gotowy do wdrożenia**.

---

## 1. Lista plików — do dodania i do zmiany

### Nowe pliki

| Docelowa ścieżka | Źródło w `proposals/` | Rola |
|---|---|---|
| `r352-os/genome/lib/research-contract.js` | `lib/research-contract.js` (372 l.) | kontrakt researchu, gotowość pomiaru, Doublecheck, ślad akceptacji, `contractGate` |
| `r352-os/genome/lib/framework-router.js` | `lib/framework-router.js` (104 l.) | rozpoznanie SALT/PLATE/oba/żadne |
| `r352-os/genome/test/run-research-tests.js` | `test/run-research-tests.js` (333 l.) | 44 testy, w tym adwersaryjne i pełny przebieg |
| `r352-os/genome/workflows/salt-strategic-diagnosis.md` | `workflows/salt-strategic-diagnosis.md` | karta SALT |
| `r352-os/genome/workflows/plate-communication-plan.md` | `workflows/plate-communication-plan.md` | karta PLATE |
| `.claude/skills/research-benchmark/SKILL.md` | `skills/research-benchmark/SKILL.md` | protokół researchu |
| `r352-os/genome/records/audits/AUDYT-ZRODEL.md` | `AUDYT-ZRODEL.md` | audyt bezpieczeństwa źródeł zewnętrznych (skill go cytuje) |
| `.agents/skills/research-benchmark/SKILL.md` | — | **generowany** przez `sync-skills.js`, nie kopiowany ręcznie |

### Zmiany w istniejących plikach

| Plik | Zmiana | Diff |
|---|---|---|
| `.claude/skills/mechanism-router/SKILL.md` | 9 → 10 sekcji raportu; krok `/research-benchmark`; krok `routeFrameworks()`; bramka Doublecheck; `contractGate` | `DIFF-mechanism-router.patch` (89 l.) |
| `r352-os/genome/build.js` | **jedno słowo**: `requires` w `RELATION_KEYS` | `DIFF-build-relation-key.patch` |
| `r352-os/genome/ROUTER.md` | szablon raportu 9 → 10 sekcji (spójność z Routerem) | **do dopisania przy wdrożeniu — nie przygotowany** |

### Czego NIE ruszałem
Ledger (204 zdarzenia), `records/`, karty mechanizmów, `migrate.js`, `ingest.js`, `.claude/skills/` w obecnej postaci.

---

## 2. Dokładne zachowanie przed i po

### Osiem blokerów

| # | Przed | Po |
|---|---|---|
| 1 | `measurementReadiness([])` → **`READY`** — projekt bez ani jednej metryki uchodził za gotowy do zamrożenia predykcji | `BLOCKED` + „nie zdefiniowano ŻADNEJ metryki" |
| 2 | niezależność = `author !== reviewer`; agent wpisywał `reviewer: "przemek"` i dostawał `PASS` | `verifyHumanReview()`: HMAC odciskiem raportu kluczem `~/.genome/approval.key`, którego agent nie tworzy. Werdykt treści i stan review to **dwie osobne rzeczy**; `contractGate` wymaga `verified`. Podmiana treści po podpisie → `invalid` + `REVISE`. Bez klucza: `unverifiable` i **jawny komunikat, że niezależność nie jest zagwarantowana** — zamiast udawania |
| 3 | „ozdobnik" = research niezmieniający listy **mechanizmów**; zmiana zakresu/metryki liczyła się jako zero | `decision_impact: {changes:[…], targets:[…]}` ze słownika `mechanism\|scope\|workflow\|guard\|prediction\|metric\|decision\|none`. Ozdobnik = **żaden poprawny rekord nie zmienił niczego** |
| 4 | `impactful` liczone ze wszystkich rekordów — nieważny rekord podnosił statystykę | liczone wyłącznie z poprawnych; `invalid > 0` daje osobny `REVISE` |
| 5 | opis planowanej zmiany Routera | `skills/mechanism-router/SKILL.md` + `DIFF-mechanism-router.patch`; test B5 pilnuje, żeby plik istniał i różnił się od obecnego |
| 6 | `source_url` wymagany zawsze; `raport-branzowy`/`artykul`/`social` = zawsze secondary | źródła publiczne → URL; `rozmowa`/`dokument-wewnetrzny`/`pomiar-wlasny` → `source_ref` + `verification_path`. `primary` przy raporcie/artykule/socialu wymaga `primary_basis` uzasadniającego pierwotność **dla tego claimu** |
| 7 | sprawdzana obecność klucza; `Date.parse` przepuszczał `"2026"` | treść (puste pole odpada), typ (tablica ≠ tekst), realność daty (`2026-02-30` odpada), dostęp z przyszłości odpada, `published_at > accessed_at` odpada |
| 8 | skill wskazywał `proposals/lib/…` | wyłącznie `r352-os/genome/lib/…`; test B8 pilnuje |

### Warstwa strategiczna

**Przed:** katalog `workflows/` **pusty**. Genome pamiętało, że strategia BW powstała, ale nie umiało odtworzyć rozumowania. SALT/PLATE żyły w HTML-u klienckim i w szablonach `r352-framework`. Router nie miał kroku strategicznego — pomijał go w milczeniu.

**Po:** dwie karty workflow w grafie (+2 węzły, +13 krawędzi, w tym `wf:plate --requires--> wf:salt`), deterministyczne rozpoznanie `SALT | PLATE | BOTH | NONE` z powodami, i **zapisana odmowa** tam, gdzie warstwa jest zbędna.

---

## 3. Wyniki testów

```
proposals/test/run-research-tests.js          44 PASS · 0 FAIL
  A1–A11   kontrakty bazowe (w tym zestawy zastane: bramka 14/14, graf, writer)
  B1–B9    adwersaryjne, po jednym na bloker
  C1–C5    pełny przebieg Router → Research → Measurement → Doublecheck → Project Contract
  D1–D8    routing SALT/PLATE
proposals/test/run-strategy-tests.js          26 PASS · 0 FAIL   (zestaw równoległy)
build.js --check (kanon)                      197 obiektów · 204 zdarzenia · 0 błędów
build.js --check (kopia + ten zestaw)         199 obiektów · 0 błędów · 244 ostrzeżenia (bez przyrostu)
build.js --check (kopia + zestaw równoległy)  202 obiekty · 0 błędów · 244 ostrzeżenia
build.js --check (kopia + OBA)                204 obiekty · 1 błąd · duplikat SALT ⚠
```

Najważniejsze testy adwersaryjne: **B2c** — poprawny podpis daje `verified`, a dopisanie mechanizmu po akceptacji unieważnia podpis i wywala `REVISE`. **B6b** — rozmowa bez `verification_path` nie przechodzi (ślad musi istnieć, choć URL nie musi). **B7e** — źródło opublikowane po dacie dostępu odpada.

---

## 4. Próby na sucho — co to realnie zmienia

| Projekt | Przed | Po | Realna zmiana decyzji |
|---|---|---|---|
| `proj:teambudget` (BW) | brak warstwy strategicznej jako obiektu | **BOTH** → SALT → PLATE | S wyrzuca pracę produktową i cenową z zakresu (problem percepcyjny) · A wymusza liczbę: OM x1 → HR Director x10, co przepisuje komunikację na inny budżet · L zmienia strategię z „wymyśl przewagę" na „przejmij Owocowe Czwartki" · PLATE nie rusza przed zatwierdzeniem SALT |
| `proj:marka-tlumacz` | pozycjonowanie powstawało w trakcie projektowania | **SALT** | A wymusza rozstrzygnięcie agencja vs zamawiający końcowy (przebudowuje hierarchię treści) · T wymusza nazwanie zmiany percepcji przed copy · PLATE odrzucony: jednorazowa strona, kalendarz byłby narzutem |
| `proj:osada-orle-deck-morisson` | fundament istniał, ale nie był wejściem formalnym | **PLATE** | SALT odrzucony z powodem (oszczędność pełnej diagnozy) · PLATE żąda **dowodu blokady** — bez niego trzy wersje decku są zgadywaniem · bramka zdolności (25 dni < 30) ostrzega, że pełny kalendarz będzie fikcją |
| `proj:zdrofit-cwicz-w-zieleni` | brak warstwy | **NONE** | wartość jest w **odmowie**: 10 formatów jednego eventu w istniejącym systemie marki nie potrzebuje diagnozy. Bez tej reguły warstwa doklejałaby się do każdego zlecenia produkcyjnego |
| `proj:briefsync` | brak warstwy, słusznie, ale bez powodu | **NONE** | odrzucenie jest **zapisane** („odbiorcą jest system, nie rynek") zamiast być milczącym pominięciem |

Dwa z pięciu przebiegów kończą się odmową. To jest cecha, nie brak — framework, który pasuje do wszystkiego, nie rozstrzyga niczego.

---

## 5. Ryzyka i świadome ograniczenia

**Kontrakt sprawdza sprawdzalność, nie prawdę.** Poprawnie wypełniony rekord z wymyślonym cytatem przejdzie. Ochroną jest to, że człowiek może pójść pod wskazany adres — nie walidator. To ograniczenie jest zapisane w skillu, żeby nie stało się cichym założeniem.

**Podpis akceptacji zabezpiecza integralność, nie tożsamość.** HMAC dowodzi, że ktoś z dostępem do klucza zaakceptował **tę treść**. Nie dowodzi, że był to Przemek, i nie działa, jeśli klucz wycieknie do środowiska agenta. Klucz musi zostać poza repo.

**`PARTIAL` może się stać parkingiem.** Wygodny stan końcowy, w którym łatwo osiąść zamiast dociągnąć instrumentację. Do obserwacji po 5 projektach: rozkład READY/PARTIAL/BLOCKED.

**Brief strukturalny jest wypełniany przez sesję.** `routeFrameworks()` jest deterministyczny, ale karmi go agent. Zamiana `needs_ongoing_communication` na `false` wycina PLATE bez śladu. Częściowa ochrona: `null` jest legalny i produkuje ostrzeżenie, `undefined` odrzuca cały brief. Pełnej ochrony nie ma — pola briefu powinny trafić do raportu Routera jako jawna tabela, żeby człowiek widział, na czym decyzja stanęła.

**SALT/PLATE nie mają żywego dowodu skuteczności.** Dwa Evidence typu `backtest`, `confidence: emerging`, `status: draft`. Nie wiemy, czy zmiana kategorii BW przyniosła wynik sprzedażowy — znamy tylko artefakt. `draft` jest świadomie zaniżone: metoda jest realnie używana w `r352-framework`, ale karta opisuje obiekt w Genome, a ten nie przeszedł jeszcze ani jednego żywego przebiegu. Właściciel może to nadpisać.

**Ryzyko cyrkularności.** SALT/PLATE pochodzą z materiałów r352, a oceniam je narzędziami r352 na projektach r352. Zewnętrznej walidacji nie ma i backtesty jej nie zastąpią.

**Zmiana ontologii wymaga zdarzenia.** Dopisanie `requires` to zmiana słownika relacji; A.0 wymaga `ontology.changed` w Ledgerze. Zdarzenie **nie zostało utworzone**.

**ROUTER.md nie został zaktualizowany.** Skill mówi o 10 sekcjach, szablon w ROUTER.md ma 9. Do domknięcia przed wdrożeniem — inaczej wchodzi rozjazd, przed którym sam ten system ma chronić.

---

## 6. Werdykty

**Research / Measurement / Doublecheck → WDRAŻAĆ.**
Osiem blokerów zamkniętych, każdy z testem adwersaryjnym, który przed poprawką by przechodził. Najmocniejszy dowód wartości to bloker 1: `measurementReadiness([])` zwracał `READY`, czyli bramka pomiaru przepuszczała projekt bez ani jednej metryki — dokładnie ten przypadek, przed którym miała chronić. Bloker 2 zmienia charakter całej warstwy: przestaje udawać, że kontroluje niezależność, i zaczyna ją realnie egzekwować albo uczciwie deklarować, że jej nie ma.

**SALT / PLATE → POPRAWIĆ przed wdrożeniem.**
Model jest trafny (dwie niezależne sesje wybrały ten sam typ ontologiczny i ten sam status), próby na sucho pokazują realne zmiany decyzji i realne odmowy, karty kompilują się czysto. Ale **nie wdrażać, dopóki kolizja z §0 nie jest rozstrzygnięta** — wdrożenie obu zestawów wprowadza dwie konkurencyjne definicje tego samego procesu, czyli dokładnie tę awarię, przed którą stoi wymóg jednego kanonicznego źródła. Do domknięcia także: rozstrzygnięcie `requires` vs `derives`, dobranie mechanizmu-claimu z Recordami, aktualizacja ROUTER.md.

---

## 7. Potwierdzenie: kanoniczne Genome nietknięte

```
git status  →  zero modyfikacji śledzonych plików w:
               ledger/ · records/ · mechanisms/ · build.js · migrate.js · ingest.js · .claude/skills/
build.js --check  →  197 obiektów · 204 zdarzenia · 0 błędów   (identycznie jak przed pracą)
workflows/  →  nadal PUSTY
--apply     →  nie uruchomiony ani razu
```

Kopie Genome używane do walidacji leżały w katalogu scratchpad i zostały usunięte. Cała praca żyje w `r352-os/genome/proposals/`.
