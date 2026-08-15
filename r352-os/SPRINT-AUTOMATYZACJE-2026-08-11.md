# Sprint Plan: „Odłączyć Przemka od pętli"

**Daty:** pon 11.08 — pt 15.08.2026 (5 dni) | **Zespół:** Przemek (decyzje + dostępy) + Claude (wykonanie) | Ada poza sprintem (produkcja kliencka)

**Cel sprintu (jedno zdanie):** Po sprincie żadna rutynowa pętla systemu — radar/przegląd CKO, deploye, backupy, rozliczenia — nie wymaga żywej sesji ani obecności Przemka, a dwa najczęściej przepisywane wzorce (mini-SSG, walidator F2) stają się komponentami w repo.

**Zasada doboru:** sprint NIE buduje nowych feature'ów. Każda pozycja albo usuwa Przemka z pętli, albo zamienia wiedzę sesyjną w wykonywalny, skommitowany kod. Filtr azymutu: nic, co opóźnia wysyłki z Planu 3 dni.

---

## Capacity

| Osoba | Dostępność | Alokacja na system | Uwagi |
|---|---|---|---|
| Przemek | 5 dni roboczych | **~7 h łącznie** (~1,5 h/dzień) | Pon 10.08 = deadline Reymonta (zerowa dostępność); klienci mają pierwszeństwo |
| Claude | sesje na żądanie | wykonuje ~80% roboty | koszt liczony w godzinach nadzoru Przemka |
| **Razem** | | **~7 h uwagi właściciela** | plan na ~70% = **5 h** commitment, reszta bufor |

Waluta estymat = **godziny uwagi Przemka** (zgodnie z KPI frameworku: godziny właściciela/pakiet), nie godziny pracy Claude.

---

## Sprint Backlog

| Prio | Pozycja | Est. (h Przemka) | Kto | Zależności |
|---|---|---|---|---|
| **P0-1** | **Sesja odblokowania deployów:** migracja projektów Vercel z konta osobistego do team scope (betterguide `personal_scope_not_allowed`, Caterelo), włączenie auto-deploy z gita tam gdzie ma być, 3 rekordy DNS Resend w GoDaddy (r3loop), deploy zaległych napraw Caterelo | 1,5 | Przemek przy klawiaturze, Claude prowadzi | tylko dostępy Przemka — dlatego P0 |
| **P0-2** | **Backup pojedynczych punktów awarii:** memory CKO → git init + launchd daily push; eksport localStorage FOTRA (lgb_people_v3 + fotra_infakt_sync) → plik w repo FOTRA daily; commit zmian FOTRA (zakładka System) | 0,5 (zgoda + 1 klik) | Claude | zgoda Przemka na commit |
| **P0-3** | **Przegląd CKO na cronie co 3 dni:** scheduled task → diff pamięci + git log + sweep Gmail/Slack → regeneracja `fotra-kg-data.js` + raport 8 sekcji; pierwszy automatyczny bieg 13.08 | 0,5 (zgoda + odbiór raportu) | Claude | zgoda na trwałą konfigurację |
| **P1-4** | **Walidator bramki F2 jako skrypt** (`hub/validate.mjs`: .brand/ → API → wynik /100) — z prompta do maszyny; bramka w 10 min zamiast godziny | 1 (review + test na pilocie Mała Palarnia) | Claude | repo r352-framework |
| **P1-5** | **Timelog z commitów → status.json** w scaffoldzie frameworku — baseline KPI godzin/faza za darmo przy drugim przebiegu | 0,5 | Claude | żadne |
| **P1-6** | **Mini-SSG r352, faza 1:** ekstrakcja wspólnego rdzenia z 3 działających buildów (DailyFruits build.js, DiMedical build.py, umowy build.py) do `r352-framework/tools/` — wzorzec przepisywany ~7× staje się komponentem | 1 (review API) | Claude | zasada „ekstrakcja z działającego, nie od zera" |
| **P2-7** (stretch) | **briefsync: gałąź Trello→Figma na Figma REST API z PAT** — pipeline przestaje wymagać otwartego desktopa i żywej sesji | 0,5 | Claude | PAT od Przemka |
| **P2-8** (stretch) | **Korpus 39 briefów briefsync → zbiór testowy alignment score** (pierwszy krok unifikacji dwóch silników oceny briefów) | 0,5 | Claude | żadne |

**Planowana pojemność: 5 h | Obciążenie P0+P1: 5 h (100% commitmentu, P2 tylko z bufora)**

---

## Ryzyka

| Ryzyko | Skutek | Mitygacja |
|---|---|---|
| Reymonta zjada wtorek (materiały spóźnione) | P0-1 przesuwa się o dzień | P0-1 nie wymaga bloku — da się zrobić w 3×30 min; szkielet z placeholderami wg Planu 3 dni |
| Sprint staje się wymówką od wysyłek (anty-azymut) | 10 kolejnych perfekcyjnych narzędzi, zero przychodu | twarda reguła: wysyłki z Planu 3 dni (ARToffNIA, Kubota, framework-cena) mają pierwszeństwo przed każdą pozycją sprintu |
| Wolumen Benefit / komentarze Osady Orle | bufor znika | dlatego commitment = 5 h przy 7 h dostępności; P2 wypada pierwsze |
| Dostępy/konta (GoDaddy, Vercel, PAT) odkładane | P0-1 i P2-7 wiszą — znany wzorzec „bloker znany od 20.07, nierozwiązany" | P0-1 zaplanowany jako JEDNA sesja z Przemkiem przy klawiaturze, wtorek rano, kalendarzowo |

---

## Definition of Done (dopasowane do lekcji ze skanu)

- [ ] Kod w **repo z commitem** — nie w scratchpadzie sesji (lekcja: „kompounduje wiedza, nie kod")
- [ ] Działa **bez żywej sesji Claude** (cron/launchd/CI) albo jawnie oznaczone „wymaga sesji"
- [ ] Wpis w auto-memory z procedurą odświeżenia/odpalenia
- [ ] Zero regresji w wysyłkach Planu 3 dni

## Kluczowe daty

| Data | Wydarzenie |
|---|---|
| pon 10.08 | (przed sprintem) deadline Reymonta + przegląd CKO #2 |
| wt 11.08 rano | Start: sesja P0-1 (deploye) z Przemkiem przy klawiaturze |
| czw 13.08 | Mid-check = pierwszy automatyczny przegląd CKO (P0-3 działa lub nie) |
| pt 15.08 | Koniec sprintu: demo (co działa bez Przemka) + retro do memory |
