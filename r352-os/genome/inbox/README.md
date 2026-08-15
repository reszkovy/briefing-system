# inbox — brudne wejście do Genome

To **nie jest** baza notatek ani kolejka zadań. To jedno miejsce, do którego wrzucasz surowy
sygnał, żeby nie trzymać go w głowie — zanim ktokolwiek zdecyduje, czy w ogóle zasługuje na
wejście do systemu.

```
inbox/  →  /triage-signal  →  pending/  →  Twój podpis  →  ingest.js  →  kanon
```

Etapy od `pending/` w prawo już istniały. Nowy jest tylko ten katalog i klasyfikacja.

## Czym ten katalog NIE jest

**Nie jest częścią kanonu.** `build.js` skanuje listę 17 dozwolonych katalogów (`TYPES`);
`inbox` nie występuje w nim ani razu. Sprawdzone empirycznie i utrwalone testem `C25–C27`
w `run-canon-tests.js`: karta wyglądająca 1:1 jak kanoniczna, położona tutaj, nie zmienia
licznika obiektów, danych viewera ani rewizji.

**Nie wymaga sprzątania.** Nieprzetriagowany sygnał starzeje się bez konsekwencji. Nie ma
dziennego rytuału, nie ma zera do wyzerowania. Jeśli po miesiącu leży tu 200 plików i nie
powstała ani jedna propozycja — to dowód, że warstwa jest zbędna, i wtedy się ją kasuje.
Koszt wyjścia wynosi zero, bo nic stąd nie weszło do kanonu.

**Nie jest miejscem na rzeczy prywatne.** Patrz niżej — to nie jest zalecenie, tylko reguła
egzekwowana testem.

## Format sygnału

Plik `RRRR-MM-DD-krotki-slug.md`. Markdown + YAML, ta sama konwencja co karty Genome.
Szablon: `_SZABLON.md`.

```yaml
---
id: "sig-in:2026-08-10-01"     # prefiks INNY niż kanoniczne sig: — to jeszcze nie Signal
captured: "2026-08-10T09:14:00+02:00"
source: "gmail"                 # gmail|slack|trello|figma|rozmowa|obserwacja|dokument
source_ref: "thread:198f2c…"    # prowieniencja; bez niej Evidence nie ma prawa powstać
project: null                   # null = NIE WIEM. Zgadywanie jest zabronione.
client: "cli:artoffnia"         # albo null
privacy: "klienckie"            # firmowe | klienckie — TYLKO te dwie wartości
status: "raw"                   # raw | triaged | archived
do_not_infer:
  - "że zakres jest zaakceptowany — to lista życzeń, nie zamówienie"
---

## Verbatim

[surowa treść, nietknięta — cytat, nie streszczenie]

## Kontekst

[jedno zdanie, tylko jeśli bez niego treść jest niezrozumiała]
```

Trzy pola robią tu całą robotę.

**`project: null`** znaczy „nie wiem" i jest wartością pełnoprawną. Triage z nieustalonym
projektem kończy się `ASK_OWNER`, nigdy dopasowaniem po nazwie klienta. Błędne przypisanie
projektu zawyżyłoby `independent_sources` i po cichu podbiło confidence mechanizmu — czyli
sfałszowało dokładnie tę liczbę, dla której Genome istnieje.

**`do_not_infer`** to lista wniosków, których z tego sygnału wyciągać NIE WOLNO. Kopiuje się
do propozycji, a `/triage-signal` ma obowiązek skonfrontować z nią swój werdykt, zanim go wyda.
Najtańszy guard przeciw halucynacji, jaki tu jest.

**`privacy`** przyjmuje wyłącznie `firmowe` albo `klienckie`.

## Rzeczy prywatne: zakaz, nie zalecenie

**Wartość `privacy: "prywatne"` w tym katalogu nie istnieje.** Test `C27` przeszukuje `inbox/`
i wywala się, jeśli ją znajdzie. Ochrona oparta na dyscyplinie („pamiętaj, żeby uważać") nie
jest ochroną.

Sygnał prywatny ma dwie legalne drogi:

1. **Prywatny inbox poza tym repozytorium** — katalog auto-pamięci, gdzie i tak leżą rzeczy
   osobiste. Nic nowego nie trzeba zakładać.
2. **Wskaźnik bez treści**, gdy rzecz prywatna ma firmową konsekwencję:

```yaml
privacy: "firmowe"
private_ref: "memory/tax-residency-pl-es"   # wskaźnik, nie treść
verbatim: null                               # świadomie puste
konsekwencja: "faktury poza PL wymagają sprawdzenia przed wrześniem"
```

Do repo wchodzi decyzja do podjęcia, nie powód.

## Co się dzieje po triage

`/triage-signal` zawsze wypisuje raport. Przy werdykcie `PROPOSE` dokłada pakiet do `pending/`
z `signature: null`. **Nigdy nie uruchamia `ingest.js`** i nigdy nie dopisuje niczego do
`signals/` — kanoniczny obiekt `sig:` powstaje dopiero po Twoim podpisie.

Cztery werdykty: `PROPOSE` (jest co zapisać) · `ARCHIVE` (system już to wie albo to szum;
plik idzie do `.archive/`) · `ASK_OWNER` (brakuje decyzji, której nie wolno podjąć za Ciebie) ·
`REJECT` (sygnał narusza własne `do_not_infer` albo jest nie do zweryfikowania).

## Twarda granica: Evidence

**Z pojedynczego sygnału Evidence nie powstaje. Nigdy.**

Evidence wymaga `mechanism` + `project` + typu ze słownika + `source` + `direction`, a jego
niezależność liczy się po ID projektu. Sygnał daje się przypisać do złego projektu bez żadnego
sygnału ostrzegawczego, a skutkiem jest zawyżone confidence — dokładnie ta awaria, przed którą
cały ten system ma chronić. Evidence wchodzi wyłącznie przez Record backtestu albo postmortemu,
gdzie ma kontekst i człowieka nad sobą.
