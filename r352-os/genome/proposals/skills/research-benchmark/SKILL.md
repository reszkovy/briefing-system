---
name: research-benchmark
description: Research i benchmark rynkowy z kontraktem jakości źródeł — sekcja 4 raportu Routera. Użyj przed doborem mechanizmów i przed warstwą strategiczną, gdy projekt konkuruje o uwagę w istniejącej niszy. Produkuje ustrukturyzowane rekordy (fakt oddzielony od interpretacji, źródło z datą dostępu, strukturalny wpływ na decyzję), nie listę linków.
---

# Research Benchmark Protocol

Wywoływany przez `/mechanism-router` jako **sekcja 4**, albo samodzielnie. Zastępuje „listę konkurentów" materiałem, na którym da się oprzeć decyzję — i który da się później sfalsyfikować.

**Nie zapisujesz nic do Genome.** Zwracasz rekordy; zapis wykonuje `ingest.js` po zatwierdzeniu przez człowieka.

## Metoda: SIFT przed każdym rekordem

**S**top — nie używaj twierdzenia, którego nie sprawdziłeś. **I**nvestigate — kto za tym stoi i czy ma interes w tezie. **F**ind better coverage — czy inne wiarygodne źródła mówią to samo. **T**race — dojdź do źródła pierwotnego, nie cytuj cytatu.

## Kontrakt rekordu

Walidatorem jest `validateResearchRecord()` z `r352-os/genome/lib/research-contract.js`. **To jest jedyne źródło reguł** — poniżej opis, nie druga implementacja. Jeśli opis rozjedzie się z modułem, prawdę ma moduł.

```yaml
claim:                 # jedno weryfikowalne twierdzenie
source_type:           # strona-firmy | dokumentacja | raport-branzowy | artykul | social
                       # | rozmowa | dokument-wewnetrzny | pomiar-wlasny | inne
source_title:
publisher:             # kto publikuje (i czy ma interes w tezie)
source_url:            # WYMAGANY dla źródeł publicznych
source_ref:            # dla niepublicznych: kto/co/kiedy ("rozmowa z M.K. 2026-08-05, notatka rec:…")
verification_path:     # dla niepublicznych: jak INNA osoba to sprawdzi (kogo zapytać, gdzie leży plik)
published_at:          # realna data YYYY-MM-DD albo dokładnie "n/d" — NIGDY zgadywana
accessed_at:           # realna data dostępu, nie z przyszłości
primary_or_secondary:  # relacja źródła DO TEGO CLAIMU, nie właściwość typu
primary_basis:         # wymagane, gdy primary a typ to raport/artykuł/social/inne — dlaczego pierwotne
observation:           # CO WIDAĆ — cytat, liczba, zrzut. Zero oceny.
interpretation:        # CO Z TEGO WYNIKA — nigdy identyczne z observation
confidence:            # high | medium | low
contradicting_sources: []   # jeśli niepuste, confidence NIE MOŻE być high, a limitations nie może być puste
decision_impact:            # STRUKTURALNIE, nie wolnym tekstem:
  changes: [mechanism|scope|workflow|guard|prediction|metric|decision|none]
  targets: ["mech:…", "zakres: kalkulator refundacji", "pred:…"]
  note: "…"
limitations:           # czego z tego NIE można wywnioskować
```

### Trzy pułapki, które kontrakt wyłapuje

**Źródło bez publicznego URL to nie jest gorsze źródło.** Rozmowa z klientem, dokument wewnętrzny i pomiar własny bywają najmocniejsze, jakie masz. Wymóg jest inny: `source_ref` (kto/co/kiedy) i `verification_path` (jak ktoś inny to sprawdzi). Link „bo musi być link" jest gorszy niż uczciwa notatka z rozmowy.

**Pierwotność to relacja, nie etykieta typu.** Raport branżowy z własnym badaniem *jest* pierwotny dla claimu o wynikach tego badania — i wtórny dla wszystkiego, co cytuje. Wpis na LinkedInie *jest* pierwotny dla claimu „firma X ogłosiła Y". Dlatego przy raporcie/artykule/socialu `primary` wymaga `primary_basis` z uzasadnieniem **dla tego konkretnego claimu**.

**Research zmienia więcej niż listę mechanizmów.** Może zmienić zakres, workflow, guard, predykcję, metrykę albo decyzję. Wpisanie `changes: ["none"]` tam, gdzie realnie coś się zmieniło, zaniża wartość researchu; deklaracja zmiany bez `targets` jest pusta i kontrakt ją odrzuci.

## Dla każdego benchmarkowanego przypadku

1. **Co zaobserwowaliśmy** — fakt, nie wrażenie.
2. **Jaki mamy na to dowód** — źródło + data dostępu (albo ścieżka weryfikacji).
3. **Czego z tego NIE możemy wywnioskować** — jawnie.
4. **Co przyjmujemy** — element standardu niszy wchodzi do zakresu.
5. **Od czego świadomie odstępujemy** — z powodem (odstępstwo = decyzja pozycjonująca).
6. **Co to zmienia** — strukturalnie, w polu `decision_impact`.

## Reguła anty-objętościowa

Rekord z `changes: ["none"]` **nie jest rozwijany w raporcie**. Trzy rekordy zmieniające decyzję są warte więcej niż dwanaście robiących wrażenie rzetelności. Research, który niczego nie zmienia, jest kosztem, nie dowodem — a `doublecheck()` uzna cały zestaw za ozdobnik, jeśli żaden poprawny rekord niczego nie zmienił.

## Czego ten skill NIE robi

Nie prowadzi śledztwa dziennikarskiego (forensyka kont, reverse image search — poza zakresem decyzji projektowych). Nie ocenia prawdy w ogóle: kontrakt sprawdza **kompletność, rozdzielność i sprawdzalność**, nie prawdziwość. Poprawnie wypełniony rekord z wymyślonym cytatem przejdzie — ochroną jest to, że człowiek może pójść pod wskazany adres, nie walidator. Nie zapisuje do Genome. Nie zatwierdza własnego wyniku.

---
_Metodologia odtworzona własnym kodem na podstawie audytu wzorców zewnętrznych (SIFT, primary/secondary, corroboration) — patrz `r352-os/genome/records/audits/AUDYT-ZRODEL.md`. Żaden zewnętrzny skill nie został zainstalowany ani nie ma praw zapisu._
