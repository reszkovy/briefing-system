# POSTMORTEM (draft) — DailyFruits, kampania wrześniowa: dwa landingi scroll-scrub

```yaml
id: "rec:postmortems/dailyfruits-kampania-wrzesniowa-2026-08-15"   # PROPONOWANY, ID nadaje ingest
type: "record"
subtype: "postmortem"
status: "proposed"
approval: "required"
created: "2026-08-15"
prepared_by: "Claude (session:project-postmortem)"
decided_by: "TBD — przemek"
project: "proj:dailyfruits-kampania-wrzesniowa (KARTA NIE ISTNIEJE — patrz Genome delta)"
client: "cli:betterworkplace"
contract: null            # brak Project Contract — projekt sprzed bramki (invariant 11)
predictions: []           # brak zarejestrowanych predykcji w ledger/events-2026-08.jsonl
```

> **WSZYSTKO PONIŻEJ TO PROPOZYCJA — `PROPOSED — REQUIRES HUMAN APPROVAL`.**
> Nic nie zostało zapisane do kanonu Genome, Ledgera ani kart. Zapis wykonuje wyłącznie
> `node r352-os/genome/ingest.js <plik.json>` po akceptacji człowieka.

---

## 1. Outcome

**Co powstało (fakt, źródło: repo `/Users/reszek/Fruityyyy`, 102 commity 15.08.2026, 07:37–21:21):**
dwa niepodlinkowane, `noindex, nofollow` landingi kampanii wrześniowej na dailyfruits.pl —
`/powrotdozywych` (97 klatek, sekwencja „monochrom budzi się do koloru") oraz `/syndromwrzesniowy`
(97 klatek, „zdejmowanie akcesoriów plażowych"), oba ze scroll-scrubem w hero, wspólną strukturą
lejkową i osadzonym formularzem BW.

**Czego NIE ma i czego postmortem nie może orzec:** nie istnieje żaden pomiar wyniku biznesowego.
Kampania nie wystartowała, landingi nie są podlinkowane, nie ma leadów przypisanych do adresów,
nie ma zdarzenia `cta_click` na żadnym z landingów. **Outcome biznesowy: `UNRESOLVED` — nie `sukces`,
nie `porażka`.** Wszystko, co poniżej, dotyczy wyłącznie warstwy wykonawczej i procesowej.

---

## 2. Source inventory (kompletność, krok 0b)

### Materiały otrzymane

| # | Materiał | Typ wg hierarchii źródeł | Siła |
|---|---|---|---|
| 1 | Historia commitów 15.08 w `/Users/reszek/Fruityyyy` (102 commity ze znacznikami czasu) | artefakt/commit | wysoka |
| 2 | Stan kodu produkcyjnego: `powrotdozywych.html`, `syndromwrzesniowy.html`, `vercel.json`, `track.js` | artefakt | wysoka |
| 3 | Rozmiary katalogów klatek (`frames-syndrom` 6,7 MB, `frames-zywi` 4,6 MB — zweryfikowane `du -sh`) | measurement | wysoka |
| 4 | Pomiary lejka przed/po (punkty konwersji, najdłuższy odcinek bez CTA, głębokość formularza, liczba słów przed 1. CTA) | measurement | wysoka (patrz limit poniżej) |
| 5 | Pomiary kontrastu (1.48:1 / 3.8:1 / 7.52:1 / 3.63:1 → 5.57:1) | measurement | wysoka |
| 6 | Pomiary defektów mobilnych (605–686 vs 574–625 px; cel dotykowy 43→45 px; `display:none` <768 px) | measurement | wysoka |
| 7 | Log generowania assetów w Higgsfield (2 warianty klatki startowej, seedance_2_0, 8 s, 52 kredyty/szt.) | artefakt + narracja wykonawcy | średnia |
| 8 | Incydent commitu w niewłaściwym repozytorium (commit `1089469`, potwierdzony w `git status` repo briefowania) | artefakt/commit | wysoka |
| 9 | Zgłoszenie „canvas 1x1" + jego obalenie (artefakt panelu podglądu, okno 0x0) | pomiar + późniejsza weryfikacja | wysoka |

### Materiały brakujące (nie uzupełniam domysłem)

- **Project Contract** — nie istnieje. Projekt sprzed bramki, invariant 11 nie był stosowany.
- **Zarejestrowane predykcje** — `grep prediction ledger/events-2026-08.jsonl`: 13 wpisów, żaden nie
  dotyczy DailyFruits. `INSUFFICIENT_EVIDENCE` dla całej sekcji rozliczenia.
- **Raport Routera** — `records/routing/` zawiera 4 raporty (artoffnia, genome-os-interface,
  hermetica, marka-tlumacz). **Dla tej kampanii Routera nie uruchomiono.**
- **Baseline i cel biznesowy** — brak zapisanego „ile leadów / jaki koszt / do kiedy".
- **Dane po stronie klienta** — leady spływają do betterworkplace.pl; nie mamy do nich dostępu
  w tej analizie. Nie wiemy nawet, czy `bwp:info` z `window.location.href` jest po ich stronie
  zapisywane i raportowalne.
- **Brief pisemny** — nie odnaleziono; kierunek kreatywny odtwarzalny wyłącznie z commitów.

### Konflikty źródeł

- **Zgłoszenie vs pomiar (canvas 1x1):** zgłoszono defekt produkcyjny; weryfikacja wykazała artefakt
  narzędzia podglądu renderującego stronę w oknie 0x0. Rozstrzygnięcie na korzyść pomiaru.
  Wprowadzona zmiana (przeliczanie canvasu po resize, commity `4074567`, `338f391`) jest sensowna
  sama w sobie, ale **nie naprawiła zgłoszonego objawu, bo objawu nie było**. To musi zostać
  zapisane wprost, inaczej powstanie fałszywe „naprawiliśmy" w pamięci systemu.
- **Liczby dowodowe:** landing niósł `81%` (nie występujące nigdzie w serwisie) oraz `2000+`
  sprzeczne z `2500+` na stronie głównej — konflikt wykryty i usunięty commitem `ccdaa0a` o 13:33.

### Ograniczenia dowodowe, które trzeba trzymać w głowie

- **Pomiary lejka „przed/po" wykonano w trakcie prac, przez tego samego wykonawcę, który wprowadzał
  zmiany.** To rzetelny pomiar struktury strony, ale **nie jest to pomiar zachowania użytkownika**.
  Zmierzono, że przybyło punktów konwersji — nie zmierzono, że ktokolwiek w nie kliknął.
- **Ryzyko hindsight bias: wysokie.** Nie ma zamrożonego stanu wiedzy sprzed startu, więc każda
  ocena „to była dobra decyzja" jest oceną po fakcie. Dlatego postmortem nie ocenia trafności
  decyzji kreatywnych — tylko fakty wykonawcze.
- **Ryzyko double-countingu: realne.** Wszystkie Evidence pochodzą z JEDNEGO projektu, w jednym dniu.
  Wystąpienie tego samego faktu w kilku commitach nie czyni go niezależnym.

---

## 3. Timeline (tylko zdarzenia istotne dla decyzji, mechanizmów lub wyniku)

| Czas | Zdarzenie | Źródło | Klasa |
|---|---|---|---|
| 07:37 | Pierwszy landing „Powrót do żywych", `noindex`, niepodlinkowany, suwak przed/po | `2e0c445` | fakt |
| 11:50 | Przebudowa na scroll-scrub, 97 klatek na canvasie | `a5813f8` | fakt |
| 11:52 | Scrub nie startował: 1. klatka w cache przez `rel=preload`, `onload` nie odpalał | `276b9a3` | fakt / defekt |
| 12:02–12:44 | Blok eksploracji: twarda blokada scrolla, pasek energii, mini-gra „Obudź pracownika" | `6e5020c`…`8343081` | fakt |
| 12:44 | Cache-bust `?v=2` na klatkach gry — podmienione pliki miały te same nazwy, `immutable` trzymał stare | `947fcf2` | fakt / defekt |
| 12:57–12:59 | Poprawki mobilne: tor paska 0 px na 320, taca ikon, CTA w 1. ekranie, cel dotykowy ≥44 px | `5a1f1ff`, `b7713dd` | measurement → fix |
| 13:01, 13:15 | Kolejne cache-busty `v3`, `v4` przy podmianie tych samych nazw plików | `e95ff1b`, `858dc68` | fakt / **powtórka defektu** |
| 13:27 | **Mini-gra usunięta** — cała gałąź eksploracji (≈45 min pracy) wycofana | `f1b5cb0` | decyzja |
| 13:33 | Liczby dowodowe wyrównane do strony głównej; usunięte `81%` i sprzeczne `2000+` | `ccdaa0a` | fakt / defekt spójności |
| 13:57 | **Przebudowa lejka**: CTA celują w `#formularz` zamiast wyprowadzać ze strony | `f894bef` | decyzja |
| 14:02–14:11 | Pływające CTA; wykryto `display:none` <768 px z `shared.css`; specyficzność podbita; cel dotykowy 43→45 px | `d440fcf`, `0b4937f`, `95cdea9`, `fd053a5` | measurement → fix |
| 15:00 | Adres docelowy `/powrotdozywych`, stary adres przekierowany na stałe (`vercel.json`) | `4c6e1d9` | fakt |
| 15:06 | Drugi landing `/syndromwrzesniowy` — struktura lejkowa skopiowana z pierwszego | `694b0d5` | decyzja |
| 15:18–15:19 | 97 klatek drugiego hero; **po deployu HTML przed assetami przeglądarki zapamiętały 404** → tryb awaryjny; naprawione podbiciem `?v=` | `f1e792e`, `a5923f0` | fakt / **trzecia powtórka klasy defektu** |
| 15:27–15:33 | Iteracje kolorystyczne rozstrzygane liczonym kontrastem (koral/limonka 1.48:1 odrzucone; green-deep 7.52:1 przyjęte) | `8fc5d92`…`c86f2bd` | measurement → decyzja |
| 15:35–15:37 | Zmiany canvasu po zgłoszeniu „1x1" — **zgłoszenie okazało się artefaktem panelu podglądu** | `4074567`, `338f391` | fałszywy alarm |
| 15:40 | Loader zwalnia po 35% klatek, limit 8 s | `e0e6d6d` | fakt |
| 21:14 | **Przyczyna zacinania scrolla #1**: `getBoundingClientRect()` w handlerze paralaksy czytany po zapisie transformów = wymuszony synchroniczny layout w każdej klatce scrolla | `fa84927` | measurement → fix |
| 21:16 | **Przyczyna #2**: nie-pasywne `wheel`/`touchmove` na `window` na stałe — wyłączały szybką ścieżkę scrollowania całej strony; przepięte na czas blokady. Mobile: autoplay zamiast blokady | `529b30f` | measurement → fix |
| 21:21 | Domknięcie: loader czeka na faktyczne namalowanie kadru | `6353501` | fakt |
| (w trakcie) | `git add -A && git commit && git push` wykonany w **niewłaściwym repozytorium** (Narzedzie do briefowania) po resecie katalogu roboczego przez shell; commit `1089469` wypchnął kilkaset nieśledzonych plików | `git status` repo briefowania | **incydent** |

**Interpretacja (oddzielona od faktów):** dzień dzieli się na trzy fazy — eksploracja kreatywna
(07:37–13:30, zakończona wycofaniem mini-gry), przebudowa lejka i dowodów (13:30–15:00), replikacja
na drugi landing + gaszenie defektów wydajnościowych (15:00–21:21). 81 ze 102 commitów dotyczy
jednego pliku; to koszt pracy bez kompilatora, nie miara pracowitości.

---

## 4. Predictions

| Prediction | P | Deadline | Outcome | Causal attribution | Certainty | Source |
|---|---|---|---|---|---|---|
| — brak zarejestrowanych — | — | — | `UNRESOLVED` | `NOT_APPLICABLE` | — | `ledger/events-2026-08.jsonl` (13 predykcji, żadna dla DailyFruits) |

**Wyjaśnienie `UNRESOLVED`:** projekt nie przeszedł przez `contractGate()`. Nie istnieje zamrożony
stan wiedzy sprzed startu, więc **nie ma czego rozliczać**. Zgodnie z krokiem 0a skilla i zasadą
`prin:extract-never-invent` **nie rekonstruuję predykcji retrospektywnie** — dopisanie ich teraz
dałoby 100% trafności i zerową wartość poznawczą. To nie jest `VOID` (plan się nie zmienił),
to brak przedmiotu rozliczenia. **`UNRESOLVED` nie generuje `prediction.resolved`.**

**Konsekwencja systemowa:** to trzeci projekt kliencki w sierpniu realizowany poza bramką. Sam fakt
nie jest lekcją (patrz sekcja 8 — to znany dług procesu, nie odkrycie), ale jest warunkiem, który
czyni całą tę analizę słabszą, niż mogłaby być.

---

## 5. Causal attribution

`causal_attribution: NOT_APPLICABLE` · `attribution_certainty: —`

Brak wyniku biznesowego = brak przedmiotu atrybucji. Nie wolno tu napisać „przebudowa lejka
zadziałała": zmierzono zmianę **struktury** (3 punkty konwersji zamiast 1, 0 px zamiast 2900 px
najdłuższego odcinka bez CTA, głębokość formularza 62% → 50%), a nie zmianę **zachowania**.
Struktura jest hipotezą o zachowaniu, nie jego pomiarem. Ta różnica jest sednem: dopóki nie ma
`cta_click` i atrybucji leadu, mechanizm lejkowy na tych landingach jest **nietestowalny**.

W warstwie technicznej atrybucja jest natomiast mocna i warta zapisania:
`causal_attribution: SUPPORTED`, `attribution_certainty: high` dla twierdzenia
„zacinanie scrolla miało dwie konkretne, mierzalne przyczyny w kodzie" — obie zidentyfikowane
przez pomiar i usunięte punktowo (`fa84927`, `529b30f`), bez zgadywania i bez przepisywania animacji.

---

## 6. Router accuracy (5 wymiarów)

**Router nie został uruchomiony dla tego projektu.** `records/routing/` nie zawiera raportu dla
DailyFruits. Ocena skuteczności Routera jest zatem **niemożliwa, a nie negatywna** — nie wolno
policzyć mu na minus rzeczy, o której nie został zapytany.

| Wymiar | Ocena | Uzasadnienie |
|---|---|---|
| `selected_useful` | `INSUFFICIENT_EVIDENCE` | brak raportu doboru |
| `selected_wrong` | `INSUFFICIENT_EVIDENCE` | brak raportu doboru |
| `selected_noise` | `INSUFFICIENT_EVIDENCE` | brak raportu doboru |
| `missed_useful` | **HIPOTEZA, nie ocena** | patrz niżej |
| `anti_context_accuracy` | `INSUFFICIENT_EVIDENCE` | brak zapisanego anty-kontekstu do sprawdzenia |

**`missed_useful` — wyłącznie jako hipoteza do sprawdzenia przy następnym uruchomieniu Routera**
(oznaczam tak świadomie: to rozumowanie kontrfaktyczne, a nie dowód):

- `mech:single-source-compiler` — liczby dowodowe wpisane ręcznie w HTML rozjechały się z serwisem
  (`81%`, `2000+` vs `2500+`). Kompilator z danych fizycznie by na to nie pozwolił. **To jest
  Evidence wspierające istniejącą kartę** (sekcja 8).
- `mech:split-url-architecture` — realnie zastosowany bez nazwania: `noindex, nofollow` + brak
  linkowania + trwałe przekierowanie starego adresu (`vercel.json`) to dokładnie rozdział systemu
  kampanijnego od katalogowego. Evidence wspierające.
- `cap:landing-craft` — metoda została częściowo odtworzona od zera (pomiar przed opinią, kontrast
  liczony przed decyzją), zamiast wywołana. Punkt 3 karty („Pomiar przed opinią") opisuje dokładnie
  ten sam schemat — łącznie ze zgłoszeniem, które nie potwierdziło się w pomiarze.

---

## 7. Mechanisms — co ten projekt mówi o kartach kanonu

| Karta | Kierunek | Co dokładnie |
|---|---|---|
| `mech:single-source-compiler` (`emerging`) | `supports` | Landing pisany ręcznie w HTML niósł liczbę nieistniejącą w serwisie i liczbę sprzeczną ze stroną główną; wykryte dopiero ręczną kontrolą po ~6 h pracy. |
| `mech:split-url-architecture` (`emerging`) | `supports` (słabo) | Kampania dostała własny system adresów, odcięty od SEO (`noindex`), stary adres przekierowany trwale. Zero szkody dla katalogu. |
| `cap:landing-craft` | `supports` + **wymaga uzupełnienia** | Punkty 2 i 3 metody potwierdzone (guardy z incydentów, pomiar przed opinią). Brakujący punkt: **gotowość pomiarowa lejka przed publikacją** — patrz Genome delta. |
| `mech:incident-to-guard` (`emerging`) | `supports` (warunkowo) | Ta sama klasa defektu (asset o niezmienionej nazwie pod `immutable`) wystąpiła **trzy razy w jednym dniu** i nie została po pierwszym razie zamieniona w guard. Karta mówi dokładnie, że lekcja zapisana miękko pozostaje miękka — i to się potwierdziło na własnym podwórku. |
| `mech:prototype-mode-guard` (`hypothesis`) | `neutral` | Landingi są `noindex` i niepodlinkowane, więc ryzyko „prototyp wygląda na gotowy" zostało obsłużone środkami platformy, nie guardem. Brak nowej wiedzy. |

---

## 8. Problems and attribution

### P1 — Kampania jest nierozliczalna: brak pomiaru kliknięć CTA i brak atrybucji leadu

- **Fakt (zweryfikowany w kodzie):** `track.js` z gotowym zdarzeniem `cta_click` istnieje w repo
  i jest używany m.in. przez `index.html`, `oferta-v2.html`, `blog.html`, `pomagamy.html`.
  **Żaden z dwóch landingów kampanii go nie ładuje.** Dodatkowo selektor ze strony głównej
  (`a[href*="zapytanie"]`) i tak nie objąłby CTA celujących w `#formularz`.
- **Fakt:** formularz to `<iframe>` z betterworkplace.pl; protokół `bwp:info` przekazuje
  `window.location.href`, więc źródło leadu **istnieje po stronie klienta**, ale nie w naszym GA4.
- `primary_cause`: **EXECUTION_ERROR** — pominięty krok „measurement readiness", który w procesie
  Routera jest obowiązkowy przed kontraktem; tu procesu nie uruchomiono.
- `contributing_causes`: **ENVIRONMENT_ERROR** — granica domen (iframe klienta) strukturalnie
  odcina nas od danych konwersji; nawet poprawne otagowanie CTA nie domyka lejka bez uzgodnienia
  raportowania z BW.
- `attribution_certainty`: **high** (evidence z kodu produkcyjnego, nie z relacji).
- `evidence_for`: brak `track.js` w obu plikach; `bwp:info` w `powrotdozywych.html:1033`.
- `evidence_against`: brak.

### P2 — Zacinanie scrolla: dwie niezależne przyczyny, obie systemowe

- **Fakt:** (a) `getBoundingClientRect()` w handlerze paralaksy czytany **po** zapisie transformów →
  wymuszony synchroniczny layout w każdej klatce scrolla, **na całej stronie**; (b) nie-pasywne
  `wheel`/`touchmove` podpięte na stałe na `window` → wyłączona szybka ścieżka scrollowania,
  także wtedy, gdy handler nic nie robił.
- `primary_cause`: **EXECUTION_ERROR** (mechanizm scroll-scruba słuszny, wykonanie nie).
- `attribution_certainty`: **high** — obie przyczyny nazwane, obie usunięte punktowo, obie
  udokumentowane komentarzem w kodzie (`powrotdozywych.html:900`), więc wiedza została w artefakcie.
- **Uwaga przeciw nadprodukcji lekcji:** to są dwa znane, podręcznikowe błędy wydajnościowe
  przeglądarki. **Nie robię z nich lekcji Genome** — należą do warstwy rzemiosła i są już zapisane
  tam, gdzie działają: w kodzie. Lekcją byłyby dopiero wtedy, gdyby powtórzyły się na innym projekcie.

### P3 — Podmieniony asset nie dociera do przeglądarki (3× w jednym dniu)

- **Fakt:** `947fcf2` (`?v=2`, klatki gry), `e95ff1b` (`v3`), `858dc68` (`v4`), a następnie
  `a5923f0` — po wgraniu HTML **przed** assetami przeglądarki zapamiętały **404** klatek i strona
  wpadała w tryb awaryjny mimo poprawnych plików na serwerze.
- **Fakt zewnętrzny wobec projektu:** ta sama klasa defektu jest opisana w
  `pending/mech-step-progress-nav-2026-08-15.md` (thehermeticum, „potknięcie zdarzyło się 2× w jednej
  sesji"). To **drugi projekt** z tą samą przyczyną — ale źródło jest w `pending/`, nie w kanonie.
- `primary_cause`: **EXECUTION_ERROR** (brak wymuszonego kroku), `contributing`: **ENVIRONMENT_ERROR**
  (`Cache-Control: immutable` + niedeterministyczna kolejność propagacji deployu).
- `attribution_certainty`: **high**.
- **Wykrywalny przed szkodą?** Tak — mechanicznie: zmiana bajtów pliku przy niezmienionym
  parametrze `?v` w referencji jest sprawdzalna w buildzie/pre-commicie.

### P4 — Defekty mobilne z kolizji ze współdzielonym arkuszem

- **Fakt:** pływające CTA miało `display:none` poniżej 768 px, bo reguła `.nav-buttons .btn`
  z `shared.css` miała wyższą specyficzność; zachęta nachodziła na CTA w hero (605–686 vs 574–625 px);
  cel dotykowy 43 px → 45 px.
- `primary_cause`: **EXECUTION_ERROR**, `attribution_certainty`: **high**.
- **Istotne dla systemu:** wszystkie trzy wykryto **pomiarem**, nie oglądaniem. To potwierdza
  punkt 3 `cap:landing-craft` i nie wymaga nowej karty.

### P5 — Commit i push w niewłaściwym repozytorium (incydent `1089469`)

- **Fakt:** łańcuch `git add -A && git commit && git push` wykonał się w
  `~/Desktop/Claude_zadania/Narzedzie do briefowania` po tym, jak shell zresetował katalog roboczy;
  commit dodał kilkaset nieśledzonych plików i **został wypchnięty**. Cofnięcie czeka na decyzję człowieka.
- `primary_cause`: **EXECUTION_ERROR** (wykonawca), `contributing_causes`: **ENVIRONMENT_ERROR**
  (w tym środowisku katalog roboczy nie utrzymuje się między wywołaniami powłoki — to
  udokumentowana właściwość, nie awaria) + użycie `git add -A`, które zamienia pomyłkę adresu
  w masowy zapis.
- `attribution_certainty`: **high** co do przebiegu, **n=1** co do częstości.
- **Czy to uzasadnia strukturalną zmianę?** Zgodnie z krokiem 8: problem jest **dotkliwy**
  (publiczny push cudzych plików, nieodwracalny bez interwencji), **wykrywalny przed szkodą**
  (`git rev-parse --show-toplevel` + `git remote get-url origin` przed commitem), **egzekwowalny
  mechanicznie**, ma **ownera** i **moment uruchomienia**. Uzasadnieniem jest **asymetria kosztów,
  nie częstotliwość** — i tak to zapisuję, żeby nie udawać dowodu z jednego zdarzenia.

### P6 — Fałszywy alarm „canvas 1x1"

- **Fakt:** zgłoszono defekt produkcyjny; przyczyną był panel podglądu renderujący stronę w oknie 0x0.
  Zmiana kodu (przeliczanie canvasu po zmianie rozmiaru okna) **została utrzymana jako sensowna sama
  w sobie, ale nie naprawiła zgłoszonego objawu — bo objawu nie było.**
- `primary_cause`: **INSUFFICIENT_EVIDENCE w momencie zgłoszenia** (diagnoza narzędziem pomiarowym
  o innych właściwościach niż środowisko użytkownika).
- **Brak nowej lekcji:** to dokładnie punkt 3 `cap:landing-craft` („Pomiar przed opinią… dotyczy też
  zgłoszeń od ludzi"). Zgodnie z `rule:compression-over-documentation` **proponuję Evidence do
  istniejącej karty, nie nową lekcję.** Jedyne uzupełnienie, którego karta nie ma wprost:
  **narzędzie pomiarowe też bywa źródłem fałszywego objawu** — pomiar trzeba wykonać w środowisku
  o realnych wymiarach okna.

---

## 9. Evidence (propozycje — `PROPOSED`)

Wszystkie poniższe Evidence pochodzą **z jednego projektu i jednego dnia**. Zgodnie z krokiem 6
**nie są wzajemnie niezależne** i wystąpienie tego samego faktu w wielu commitach nie zmienia tego.

```yaml
- temporary_id: "ev:tmp:df-kampania-01"
  mechanism: "mech:single-source-compiler"
  project: "proj:dailyfruits-kampania-wrzesniowa"
  type: "measurement"
  source: "commit ccdaa0a (repo Fruityyyy, 2026-08-15 13:33)"
  source_date: "2026-08-15"
  provenance: "artifact"
  observation: "Landing pisany ręcznie w HTML niósł wskaźnik 81% nieistniejący nigdzie w serwisie oraz 2000+ sprzeczne z 2500+ na stronie głównej. Wykryte ręczną kontrolą po ~6 h pracy nad plikiem."
  implication_for_claim: "Treść liczbowa żyjąca w wielu artefaktach rozjeżdża się także wtedy, gdy autorem wszystkich artefaktów jest jedna osoba w jednym dniu."
  direction: "supports"
  independence: "NIE niezależne od ev:tmp:df-kampania-02..06 — ten sam projekt, ten sam dzień, ten sam wykonawca."
  limitations: "Jeden landing, brak kontrfaktu (nie wiadomo, ile kosztowałby setup kompilatora dla dwóch stron kampanijnych)."
  deduplication_check: "Karta ma n=23/16 projektów; to obserwacja tej samej klasy, więc wnosi potwierdzenie, NIE nowy typ dowodu. Nie podnosi confidence."

- temporary_id: "ev:tmp:df-kampania-02"
  mechanism: "mech:split-url-architecture"
  project: "proj:dailyfruits-kampania-wrzesniowa"
  type: "measurement"
  source: "commit 4c6e1d9 + vercel.json:143 + meta robots w obu landingach"
  source_date: "2026-08-15"
  provenance: "artifact"
  observation: "Landingi kampanijne dostały własne adresy z noindex,nofollow, bez linkowania z serwisu, a adres roboczy /powrot-do-zywych-2 przekierowano na stałe na /powrotdozywych."
  implication_for_claim: "Rozdział systemu kampanijnego od katalogowego dało się utrzymać środkami platformy, bez ingerencji w SEO serwisu."
  direction: "supports"
  independence: "NIE niezależne — ten sam projekt co pozostałe Evidence."
  limitations: "Brak pomiaru skutku (kampania nie wystartowała). To dowód na wykonalność, nie na skuteczność."
  deduplication_check: "Uwaga na kolizję z proj:dailyfruits-seo-oferta (istniejąca karta projektu opisuje rozdział URL-i w tym samym serwisie) — sprawdzić przed zapisem, czy Evidence tej klasy już tam nie wisi."

- temporary_id: "ev:tmp:df-kampania-03"
  mechanism: "mech:incident-to-guard"
  project: "proj:dailyfruits-kampania-wrzesniowa"
  type: "measurement"
  source: "commity 947fcf2, e95ff1b, 858dc68, a5923f0 (2026-08-15, 12:44–15:19)"
  source_date: "2026-08-15"
  provenance: "artifact"
  observation: "Ta sama klasa defektu (podmieniony asset o niezmienionej nazwie pod immutable cache; deploy HTML przed assetami → zapamiętane 404) wystąpiła cztery razy w ciągu jednego dnia. Po pierwszym wystąpieniu nie powstał żaden mechaniczny guard — kolejne naprawiano ręcznie, tą samą metodą."
  implication_for_claim: "Potwierdza claim karty od strony negatywnej: lekcja niezakodyfikowana jako blokujący krok nie zapobiega powtórce nawet u autora, który zna przyczynę i naprawił ją godzinę wcześniej."
  direction: "supports"
  independence: "NIE niezależne wewnętrznie (jeden projekt). Powiązany, ale ODRĘBNY przypadek: pending/mech-step-progress-nav-2026-08-15.md (thehermeticum) — jeśli tamten wejdzie do kanonu, dopiero wtedy powstaje drugi projekt."
  limitations: "Obserwacja z własnej pracy, nie od klienta — ryzyko autoselekcji przy opisie."
  deduplication_check: "Karta ma n=15/11 projektów, typy: narrative 4, backtest 11. To PIERWSZE Evidence typu measurement z bieżącej pracy — wnosi nowy typ, ale nie liczbę projektów wystarczającą do zmiany confidence."

- temporary_id: "ev:tmp:df-kampania-04"
  mechanism: "cap:landing-craft"
  project: "proj:dailyfruits-kampania-wrzesniowa"
  type: "measurement"
  source: "pomiary kontrastu (1.48:1 / 3.8:1 / 7.52:1; etykiety 3.63:1 → 5.57:1) + pomiary mobilne (605-686 vs 574-625 px; 43 → 45 px; display:none <768 px z shared.css) + obalone zgłoszenie canvas 1x1"
  source_date: "2026-08-15"
  provenance: "measurement"
  observation: "Wszystkie decyzje kolorystyczne rozstrzygnięto policzonym kontrastem PRZED wdrożeniem (odrzucono koral na limonce 1.48:1). Trzy defekty mobilne wykryto pomiarem, nie oglądaniem. Jedno zgłoszenie defektu ('canvas 1x1') okazało się artefaktem narzędzia podglądu renderującego stronę w oknie 0x0."
  implication_for_claim: "Punkt 3 metody ('pomiar przed opinią') potwierdzony w praktyce. Uzupełnienie, którego karta nie ma: samo narzędzie pomiarowe bywa źródłem fałszywego objawu — pomiar musi zapadać w środowisku o realnych wymiarach okna."
  direction: "supports"
  independence: "NIE niezależne — ten sam projekt."
  limitations: "Metoda była odtwarzana ad hoc, a nie wywołana jako skill; nie da się orzec, ile z niej zadziałało dzięki karcie, a ile dzięki nawykowi wykonawcy."
  deduplication_check: "Karta cap:landing-craft nie ma sekcji Evidence (typ capability). Propozycja: dopisek do treści karty, nie Evidence do confidence."

- temporary_id: "ev:tmp:df-kampania-05"
  mechanism: "TBD — brak karty dla pomiaru lejka na landingu kampanijnym"
  project: "proj:dailyfruits-kampania-wrzesniowa"
  type: "measurement"
  source: "stan kodu: brak track.js w powrotdozywych.html i syndromwrzesniowy.html; bwp:info w powrotdozywych.html:1033; track.js:13 (cta_click)"
  source_date: "2026-08-15"
  provenance: "artifact"
  observation: "Dwa landingi kampanijne opublikowano z przebudowanym lejkiem (1 → 3 punkty konwersji + pływające CTA; najdłuższy odcinek bez CTA 2900 → 0 px; formularz na 50% zamiast 62% głębokości) i JEDNOCZEŚNIE bez zdarzenia cta_click, przy formularzu w iframe obcej domeny."
  implication_for_claim: "Zmiana struktury lejka bez instrumentacji nie jest testowalna: nie da się jej ani potwierdzić, ani obalić. Optymalizacja bez pomiaru jest opinią o wysokim koszcie."
  direction: "limits"
  independence: "NIE niezależne — ten sam projekt."
  limitations: "Nie wiadomo, czy dane z bwp:info są po stronie BW zapisywane i raportowalne — to trzeba u nich sprawdzić, zanim uzna się lukę za pełną."
  deduplication_check: "Brak karty o tej treści w kanonie (przeszukane mechanisms/, rules/, guards/). Nie duplikuje mech:numeric-gates (tamta dotyczy progów jakości, nie instrumentacji konwersji)."

- temporary_id: "ev:tmp:df-kampania-06"
  mechanism: "TBD — proponowany guard:repo-target-check"
  project: "proj:dailyfruits-kampania-wrzesniowa"
  type: "postmortem"
  source: "commit 1089469 w repo 'Narzedzie do briefowania' (wypchnięty) + git status tego repo"
  source_date: "2026-08-15"
  provenance: "artifact"
  observation: "Łańcuch `git add -A && git commit && git push` wykonał się w niewłaściwym repozytorium po resecie katalogu roboczego przez shell; kilkaset nieśledzonych plików trafiło do publicznego zdalnego repozytorium."
  implication_for_claim: "Pomyłka adresu repozytorium jest w tym środowisku strukturalnie możliwa, a `git add -A` zamienia ją z drobiazgu w zdarzenie nieodwracalne bez interwencji."
  direction: "supports"
  independence: "n=1. JEDNO zdarzenie, jeden projekt. NIE stanowi podstawy do reguły ogólnej."
  limitations: "Brak historii częstości. Uzasadnieniem ewentualnego guardu jest asymetria kosztów, nie dowód powtarzalności."
  deduplication_check: "Brak podobnego guardu w guards/ (jedyny: guard:build-check). Sprawdzić records/incydenty/ przed zapisem."
```

---

## 10. Lessons (3 z 3 — limit `rule:compression-over-documentation`)

### L1 — Landing kampanijny bez instrumentacji konwersji jest nierozliczalny; instrumentacja jest warunkiem publikacji, nie dodatkiem po kampanii

- `born_from`: P1, `ev:tmp:df-kampania-05`
- `changes`: sposób pomiaru · bramka publikacji · resolution contract przyszłych predykcji
- **`trigger`**: budujesz landing kampanijny (własny adres, ruch płatny lub mailingowy) **albo**
  formularz konwersji jest osadzony w iframe na cudzej domenie.
- **`next_use`**: przed pierwszą publikacją landingu sprawdź trzy rzeczy i żadnej nie odkładaj na
  „po starcie": (1) każde CTA emituje `cta_click` (dopięty `track.js` lub własny handler obejmujący
  także linki kotwiczące typu `#formularz` — selektor `a[href*="zapytanie"]` ich NIE łapie);
  (2) źródło ruchu i adres landingu są przekazywane do formularza zewnętrznego **i** po drugiej
  stronie są zapisywane w raportowalnym polu — to trzeba potwierdzić u odbiorcy, nie założyć;
  (3) zapisane jest, kto i kiedy odczyta wynik.
- `owner`: przemek
- `expected_behavior_change`: przy następnym landingu kampanijnym instrumentacja powstaje przed
  warstwą wizualną; brak potwierdzenia z punktu (2) blokuje deklarację „lejek poprawiony".
- `confidence_limitations`: n=1 projekt. Lekcja opiera się na dowodzie **braku** (nie ma pomiaru),
  co jest mocne co do faktu i słabe co do skutku — nie wiemy, ile leadów to kosztowało, i nigdy
  się nie dowiemy.

### L2 — Podmiana assetu pod nazwą, która już istnieje, wymaga podbicia wersji w tym samym commicie; inaczej wraca 3–4 razy dziennie

- `born_from`: P3, `ev:tmp:df-kampania-03`
- `changes`: workflow deployu · kandydat na Guard
- **`trigger`**: nadpisujesz plik binarny (klatki, packshoty, wideo) **pod tą samą nazwą** przy
  `Cache-Control: immutable`, **albo** deployujesz HTML odwołujący się do assetów, których jeszcze
  nie ma na serwerze.
- **`next_use`**: w tym samym commicie, w którym zmienia się zawartość assetu, podbij parametr `?v=`
  w każdej referencji do niego; assety wgraj **przed** HTML-em. Gdy 404 zdążyło się zacache'ować,
  jedynym pewnym lekarstwem jest nowy parametr wersji — nie czekanie i nie odświeżenie.
- `owner`: przemek
- `expected_behavior_change`: zero ręcznych „cache-bust v2/v3/v4" jako osobnych commitów naprawczych.
- `confidence_limitations`: 4 wystąpienia, ale **jeden projekt i jeden dzień** — to nie są niezależne
  obserwacje. Drugi projekt (thehermeticum) leży w `pending/`, nie w kanonie, więc formalnie
  **próg `validated` nie jest osiągnięty** i lekcja wchodzi najwyżej jako `emerging`.

### L3 — Kontrakt ujęcia generatywnego: rezerwację kompozycji i fizykę ruchu zapisuje się w prompcie, a nie naprawia po renderze

- `born_from`: materiał dowodowy #8 (Higgsfield, seedance_2_0, 8 s, 52 kredyty za ujęcie)
- `changes`: sposób wykonania · wycena pracy z wideo generatywnym · wybór mechanizmu przy hero
  opartym o sekwencję klatek
- **`trigger`**: generujesz ujęcie wideo/sekwencję klatek, na którą **zostanie nałożona typografia**,
  albo ujęcie, w którym bohater **manipuluje rekwizytem** (zdejmuje, odkłada, podnosi).
- **`next_use`**: w prompcie zapisz wprost (a) którą część kadru zostawić pustą pod treść
  („lewa połowa kadru celowo pusta pod nagłówek") — zamiast korygować zoomem i przesuwaniem po
  renderze; (b) takty czasowe ruchu wraz z zastrzeżeniami fizycznymi („ręce nie tracą kontaktu,
  przedmiot nie zmienia rozmiaru, nie przenika przez ciało"); (c) **podaj tylko klatkę startową** —
  podanie klatki końcowej powodowało morfowanie tła. Realne zdjęcie jako `start_image` daje poprawne
  etykiety produktów.
- `owner`: przemek
- `expected_behavior_change`: ujęcie użyteczne przy pierwszej generacji zamiast serii prób po
  52 kredyty; kadrowanie przestaje być pracą post-produkcyjną.
- `confidence_limitations`: **n=1 dla punktów (a) i (b)** — jedno udane ujęcie nie dowodzi, że to
  prompt zadziałał, a nie los modelu. Punkt (c) ma dodatkowe potwierdzenie z wcześniejszej sesji
  (inny projekt), więc jest najmocniejszy z trzech. Nie podnosić do reguły przed drugim projektem.

### Lekcje ODRZUCONE (świadomie, z powodem)

- **„Dwie przyczyny zacinania scrolla"** → to rzemiosło frontendowe, nie wiedza operacyjna r352.
  Wiedza została zapisana tam, gdzie działa: w komentarzu w kodzie (`powrotdozywych.html:900`).
  Wróci jako lekcja, jeśli powtórzy się na innym projekcie.
- **„Pomiar przed opinią, także dla zgłoszeń"** (fałszywy alarm canvas 1x1) → już istnieje jako
  punkt 3 `cap:landing-craft`. Duplikat byłby złamaniem `rule:compression-over-documentation`.
  Proponuję **dopisek** do karty, nie nową lekcję.
- **„Nie commituj w cudzym repo"** → obsłużone jako Guard (sekcja 11), nie jako lekcja: to nie
  zmienia decyzji ani wyceny, tylko wymaga mechanicznej blokady.
- **„Trzeba było uruchomić Router"** → to nie jest odkrycie tego projektu, tylko znany dług procesu
  opisany w ROUTER.md (invariant 11). Zapisanie go jako lekcji byłoby udawaniem nauki.

---

## 11. Guard / Rule / SOP

| Propozycja | Powtarzalny / dotkliwy | Wykrywalny przed szkodą | Egzekwowalny mechanicznie | Owner | Moment | Werdykt |
|---|---|---|---|---|---|---|
| `guard:asset-version-bump` — build/pre-commit odrzuca commit, w którym zmieniła się zawartość assetu, a parametr `?v=` w referencjach został ten sam | tak: 4× w jednym dniu (+1 projekt w `pending/`) | tak (porównanie hash pliku vs referencja) | tak | przemek | pre-commit / build | **PROPOSED** |
| `guard:repo-target-check` — przed `git commit`/`git push` weryfikacja `git rev-parse --show-toplevel` i `git remote get-url origin` względem repozytorium zadania; zakaz `git add -A` w łańcuchach automatycznych | dotkliwy (publiczny push, n=1) | tak | tak | przemek | przed commitem | **PROPOSED — uzasadnienie z asymetrii kosztów, nie z częstości** |
| Bramka pomiarowa landingu (L1) | jeden przypadek | tak | częściowo — punkt (2) wymaga potwierdzenia od klienta, więc nie jest w pełni automatyzowalny | przemek | przed publikacją | **NIE Guard — pozycja w `cap:landing-craft` + kontrakt projektu** |
| Cokolwiek z P2 (wydajność scrolla) | n=1 | — | — | — | — | **NO STRUCTURAL CHANGE** |

---

## 12. Proposed Genome delta

> Wszystkie pozycje: `requires_human_approval: true`.

```yaml
- target: "proj:dailyfruits-kampania-wrzesniowa"
  change_type: "create"
  current_state: "Karta nie istnieje. Genome nie wie o dwudniowej pracy produkcyjnej dla klienta cli:betterworkplace (grep po 'dailyfruits' w genome/ nie zwraca kampanii)."
  proposed_state: "Nowa karta projektu, status: archived, tags: [pre-genome, kampania], client_note: DailyFruits / Better Workplace, z jawnym polem contract: null i notą 'projekt sprzed bramki, invariant 11 niestosowany'."
  reason: "Bez karty nie ma do czego podpiąć Evidence ani przyszłego pomiaru kampanii."
  supporting_evidence: ["102 commity 15.08 w repo Fruityyyy", "dwa pliki produkcyjne na dailyfruits.pl"]
  contradicting_evidence: []
  risk_of_change: "niskie — karta opisowa"
  reversibility: "pełna"
  requires_human_approval: true

- target: "cap:landing-craft"
  change_type: "amend-body"
  current_state: "Metoda ma 5 punktów rdzenia; punkt 3 'Pomiar przed opinią' obejmuje kontrast, przepełnienie, liczbę słów i LCP oraz zgłoszenia od ludzi. Brak jakiejkolwiek pozycji o instrumentacji konwersji i o środowisku pomiaru."
  proposed_state: "Dwa dopiski: (a) do punktu 3 — 'pomiar wykonuj w środowisku o realnych wymiarach okna; panel podglądu renderujący stronę w oknie 0x0 potrafi WYTWORZYĆ objaw (canvas 1x1, DailyFruits 15.08)'; (b) nowa pozycja 'Gotowość pomiarowa przed publikacją' z trzema warunkami z lekcji L1."
  reason: "Karta opisuje, jak zbudować landing, ale nie zawiera warunku, bez którego nie da się orzec, czy zadziałał."
  supporting_evidence: ["ev:tmp:df-kampania-04", "ev:tmp:df-kampania-05"]
  contradicting_evidence: []
  risk_of_change: "niskie"
  reversibility: "pełna"
  requires_human_approval: true

- target: "guard:asset-version-bump"
  change_type: "create"
  current_state: "guards/ zawiera wyłącznie guard:build-check (status proposed)."
  proposed_state: "Nowy guard w statusie 'proposed', owner: przemek, moment: pre-commit/build. Zgodnie z cap:landing-craft pkt 2 guard bez testu negatywnego nie jest guardem — do uzbrojenia potrzebny test: przywróć niezmieniony ?v przy zmienionym assecie, build musi być czerwony."
  reason: "Cztery wystąpienia klasy defektu w jednym dniu, każde naprawiane ręcznie; mech:incident-to-guard twierdzi dokładnie, że lekcja miękka nie zapobiega powtórce — potwierdzone na własnej pracy."
  supporting_evidence: ["ev:tmp:df-kampania-03", "pending/mech-step-progress-nav-2026-08-15.md (thehermeticum — drugi projekt, ale poza kanonem)"]
  contradicting_evidence: ["Koszt: guard musi znać mapę referencji asset→HTML; przy ręcznie pisanych plikach HTML to niebanalne."]
  risk_of_change: "średnie — fałszywe alarmy przy assetach niereferowanych z HTML"
  reversibility: "pełna (status proposed, nieuzbrojony)"
  requires_human_approval: true

- target: "guard:repo-target-check"
  change_type: "create"
  current_state: "Brak jakiejkolwiek bariery przed zapisem do niewłaściwego repozytorium; commit 1089469 został wypchnięty."
  proposed_state: "Nowy guard w statusie 'proposed': weryfikacja toplevel + origin przed commitem, zakaz `git add -A` w łańcuchach nieinteraktywnych. NIE jest to reguła ogólna wyprowadzona z jednego zdarzenia — jest to bariera uzasadniona nieodwracalnością skutku."
  reason: "W tym środowisku katalog roboczy nie utrzymuje się między wywołaniami powłoki; pomyłka adresu jest strukturalnie możliwa, a `git add -A` zamienia ją w masowy publiczny zapis."
  supporting_evidence: ["ev:tmp:df-kampania-06"]
  contradicting_evidence: ["n=1; brak historii częstości — możliwe, że jednorazowa nieuwaga."]
  risk_of_change: "niskie"
  reversibility: "pełna"
  requires_human_approval: true

- target: "mech:single-source-compiler"
  change_type: "add-evidence"
  current_state: "confidence: emerging; n=23, projects=16, types: narrative 7 / backtest 16"
  proposed_state: "Dodać ev:tmp:df-kampania-01 (type: measurement). BEZ zmiany confidence — to potwierdzenie tej samej klasy, nie nowy niezależny projekt w rozumieniu progu."
  reason: "Pierwsze Evidence typu measurement z bieżącej pracy dla tej karty."
  supporting_evidence: ["ev:tmp:df-kampania-01"]
  contradicting_evidence: []
  risk_of_change: "niskie"
  reversibility: "pełna"
  requires_human_approval: true

- target: "mech:incident-to-guard"
  change_type: "add-evidence"
  current_state: "confidence: emerging; n=15, projects=11, types: narrative 4 / backtest 11"
  proposed_state: "Dodać ev:tmp:df-kampania-03 (type: measurement, direction: supports). BEZ zmiany confidence."
  reason: "Dowód negatywny na własnej pracy: znana i świeżo naprawiona przyczyna powtórzyła się trzy razy, bo nie została zamieniona w blokujący krok."
  supporting_evidence: ["ev:tmp:df-kampania-03"]
  contradicting_evidence: []
  risk_of_change: "niskie"
  reversibility: "pełna"
  requires_human_approval: true

- target: "mech:split-url-architecture"
  change_type: "add-evidence"
  current_state: "confidence: emerging; n=8, projects=5"
  proposed_state: "Dodać ev:tmp:df-kampania-02 (direction: supports, siła słaba — dowód wykonalności, nie skuteczności). BEZ zmiany confidence."
  reason: "Rozdział adresów kampanijnych od katalogowych utrzymany środkami platformy, bez szkody dla SEO."
  supporting_evidence: ["ev:tmp:df-kampania-02"]
  contradicting_evidence: ["Brak pomiaru skutku — kampania nie wystartowała."]
  risk_of_change: "niskie"
  reversibility: "pełna"
  requires_human_approval: true

- target: "mech:generative-shot-contract (NOWA, hypothesis)"
  change_type: "create"
  current_state: "Brak karty o pracy z wideo generatywnym w kanonie."
  proposed_state: "Karta w statusie 'hypothesis', recommendation: test-first, confidence.evidence_strength.n = 1. Treść = lekcja L3 (rezerwacja strefy kompozycji w prompcie, takty ruchu z zastrzeżeniami fizycznymi, tylko klatka startowa, realne zdjęcie jako start_image). ALTERNATYWA DO ROZWAŻENIA PRZEZ CZŁOWIEKA: nie tworzyć karty, tylko dopisek do cap:landing-craft — jedno udane ujęcie to za mało na własny mechanizm."
  reason: "Zmienia sposób wykonania i koszt (52 kredyty za ujęcie), ma jasny trigger i next_use."
  supporting_evidence: ["materiał dowodowy #8 — Higgsfield/seedance_2_0, ujęcie bez artefaktów za pierwszym razem"]
  contradicting_evidence: ["n=1; nie da się odróżnić skutku promptu od losu modelu.", "Punkt o klatce końcowej pochodzi z innej sesji i nie ma zapisanego artefaktu w tym repo."]
  risk_of_change: "średnie — ryzyko kodyfikacji przypadku jako mechanizmu"
  reversibility: "pełna"
  requires_human_approval: true
```

### Próg `validated` — jawne stwierdzenie

**Żadna z powyższych pozycji nie osiąga progu `validated`** (≥3 niezależne Evidence, z ≥2 projektów,
w tym ≥1 `measurement` lub rozliczony `postmortem`). Wszystkie Evidence pochodzą z **jednego projektu
i jednego dnia**, więc nie są niezależne. Najbliżej progu jest L2 (cache-bust), ale jej drugi projekt
leży w `pending/`, a nie w kanonie — do czasu jego akceptacji **liczy się jako jeden projekt**.
Żadna karta nie dostaje podniesionego confidence. Żadna nie jest `disproven`.

---

## 13. No-change decisions

- **Confidence żadnej karty nie zmieniane** — patrz wyżej.
- **`mech:prototype-mode-guard` bez zmian** — landingi obsłużono `noindex` + brakiem linkowania;
  brak nowej wiedzy dla karty.
- **Brak nowej karty dla wydajności scroll-scruba** — dwa podręcznikowe błędy przeglądarki, n=1.
- **Brak zmian w `anti_context` jakiejkolwiek karty** — nie wystąpiło zdarzenie, które by je podważyło.
- **Brak `prediction.resolved`** — nie było predykcji.
- **Brak zamknięcia projektu** — kampania nie wystartowała, wynik nieznany.

---

## 14. Next reuse

1. **Przed startem kampanii wrześniowej:** ustawić pomiar (L1) i dopiero wtedy zarejestrować
   predykcje — to jest ostatni moment, w którym ta praca da się w ogóle rozliczyć.
2. **Przy następnym landingu kampanijnym dla dowolnego klienta:** wywołać `/landing-craft`
   zamiast odtwarzać metodę z pamięci; uruchomić `/mechanism-router` przed pierwszą linią kodu.
3. **Przy następnym hero opartym o sekwencję klatek:** zastosować L3 i **zanotować wynik**
   (pierwsza generacja użyteczna: tak/nie) — bez tego L3 zostanie hipotezą na zawsze.

---

## 15. Open questions (dla człowieka)

1. **Czy cofać commit `1089469`?** Został wypchnięty do publicznego repo; kilkaset nieśledzonych
   plików. Decyzja o `revert` vs `force-push` należy do Przemka — nie podejmuję jej.
2. **Czy BW zapisuje `bwp:info.url` w polu raportowalnym?** Od tego zależy, czy luka pomiarowa
   jest częściowa, czy pełna. Pytanie do Huberta / zespołu BW.
3. **Czy kampania w ogóle wystartuje?** Jeśli tak — kto i kiedy odczyta wynik (`outcome_owner`,
   `measurement_date`)?
4. **`mech:generative-shot-contract`: karta czy dopisek?** Rekomendacja analityka: dopisek, dopóki
   nie ma drugiego projektu.
5. **Czy praca dla klienta ma od teraz przechodzić przez `contractGate()`?** To trzecia sierpniowa
   realizacja poza bramką. Pytanie o proces, nie o ten projekt.

---

## 16. Human approval required

Ten dokument jest **propozycją**. Do zapisu w kanonie potrzebna jest decyzja człowieka co do:
karty projektu, dwóch guardów, dopisków do `cap:landing-craft`, trzech Evidence do istniejących
mechanizmów, oraz rozstrzygnięcia pytania 4. Zapis wyłącznie przez
`node r352-os/genome/ingest.js <plik.json>`.

---

## 17. Proposed Event Bundle

```yaml
# BEZ id / ts / prev_hash — nadaje je ingest.js
proposed_events:
  - kind: "object.created"
    on: "proj:dailyfruits-kampania-wrzesniowa"
    actor: "przemek"
    provenance: "record"
    version_to: 1
    note: "Kampania wrzesniowa DailyFruits: dwa landingi scroll-scrub (/powrotdozywych, /syndromwrzesniowy), 102 commity 15.08.2026. Projekt sprzed bramki — brak Project Contract i predykcji (invariant 11 niestosowany). Karta powstaje po fakcie, zeby bylo do czego podpiac Evidence."

  - kind: "object.created"
    on: "rec:postmortems/dailyfruits-kampania-wrzesniowa-2026-08-15"
    actor: "przemek"
    provenance: "record"
    version_to: 1
    note: "Postmortem bez rozliczenia predykcji — brak zamrozonego kontraktu. Outcome biznesowy UNRESOLVED: kampania nie wystartowala, brak pomiaru konwersji."

  - kind: "object.created"
    on: "guard:asset-version-bump"
    actor: "przemek"
    provenance: "record"
    version_to: 1
    note: "Status proposed. Cztery wystapienia klasy defektu w jednym dniu (947fcf2, e95ff1b, 858dc68, a5923f0). Do uzbrojenia wymagany test negatywny."

  - kind: "object.created"
    on: "guard:repo-target-check"
    actor: "przemek"
    provenance: "record"
    version_to: 1
    note: "Status proposed. Incydent 1089469 — commit i push w niewlasciwym repozytorium po resecie katalogu roboczego. Uzasadnienie: nieodwracalnosc skutku, nie czestosc (n=1)."

  - kind: "object.patched"
    on: "cap:landing-craft"
    actor: "przemek"
    provenance: "record"
    version_to: 2
    note: "Dwa dopiski: pomiar w srodowisku o realnych wymiarach okna (panel podgladu 0x0 wytworzyl falszywy objaw) oraz pozycja 'Gotowosc pomiarowa przed publikacja' (cta_click, przekazanie zrodla do formularza zewnetrznego, wlasciciel odczytu)."

# Evidence przekazywane w tym samym pakiecie ingest jako {evidence: [...]}:
#   ev:tmp:df-kampania-01 → mech:single-source-compiler
#   ev:tmp:df-kampania-02 → mech:split-url-architecture
#   ev:tmp:df-kampania-03 → mech:incident-to-guard
#   ev:tmp:df-kampania-04 → cap:landing-craft (jako tresc karty, nie confidence)
#   ev:tmp:df-kampania-05 → cap:landing-craft (jako tresc karty)
#   ev:tmp:df-kampania-06 → guard:repo-target-check
# ZADNEGO confidence.changed — prog validated niespelniony.
# ZADNEGO prediction.resolved — brak zarejestrowanych predykcji.
```

---

## 18. Bramka końcowa

```yaml
learning_engine_recommendation:
  postmortem_ready_for_review: true
  evidence_ready_for_review: true
  genome_delta_recommended: true
  confidence_change_recommended: false
  blocking_gaps:
    - "Brak Project Contract i predykcji — rozliczenie trafnosci niemozliwe (invariant 11, projekt sprzed bramki)."
    - "Brak pomiaru konwersji na obu landingach — outcome biznesowy nierozliczalny teraz i wstecz."
    - "Nie wiadomo, czy bwp:info.url jest po stronie BW zapisywane w polu raportowalnym."
  human_decisions_required:
    - "Los commita 1089469 (revert vs pozostawienie)."
    - "mech:generative-shot-contract: osobna karta czy dopisek do cap:landing-craft."
    - "Uzbrojenie guard:asset-version-bump (wymaga testu negatywnego)."
    - "Czy prace dla klientow przechodza od teraz przez contractGate()."
```

**WERDYKT: `READY_FOR_HUMAN_REVIEW`**

Uzasadnienie: dowody wykonawcze są mocne (kod, commity, pomiary), delta jest konserwatywna
(zero zmian confidence, zero `validated`, zero aktywnych guardów), a wszystkie luki są nazwane,
nie zasypane domysłem. Postmortem **nie jest** `NEEDS_MORE_EVIDENCE`, bo nie czeka na dane, które
mogłyby jeszcze przyjść — dane o trafności predykcji nie przyjdą nigdy, bo predykcji nie było.
