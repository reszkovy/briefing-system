# Specyfikacja formatów Zdrofit — wyciągnięta z masterów PSD

Źródło: struktura warstw i artboardów odczytana z plików produkcyjnych
(`psd_struct.py`, psd-tools). To nie są moje założenia — to jest to, co realnie
leży w plikach, którymi dziś robicie te zlecenia.

---

## Rodzina „nowe zajęcia" — zestaw formatów

Zweryfikowane na dwóch niezależnych masterach:
`ZDROFIT_nowe zajecia_KV1_all formats_kp2.psd` (331 MB) i
`ZDROFIT_nowe zajecia_KV2_all formats kp 2.psd` (1,8 GB).
**Oba mają identyczny zestaw artboardów** — czyli to jest ustabilizowany standard, nie improwizacja.

| Artboard | Wymiary | Kanał |
|---|---|---|
| `_master` / `_final` | 1620 × 2208 | plik źródłowy / druk |
| `_some_1080x1440 IG` | 1080 × 1440 | Instagram feed |
| `_some_1080x1440 IG 2` | 1080 × 1440 | Instagram feed, wariant |
| `_some_1080x1350 FB` | 1080 × 1350 | Facebook |
| `_some_1080x1920_IG Stories` | 1080 × 1920 | Stories |
| `_some_1080x1920_IG Stories 2` | 1080 × 1920 | Stories, wariant |
| `_www_360x360` | 360 × 360 | strona |
| `_www_823x416` | 832 × 416 | strona, baner |
| `_wizytowka google_400x300` | 400 × 300 | wizytówka Google |
| `_mailing350x650` | 650 × 350 | mailing |

**10–11 artboardów na jedno zlecenie.** Zgadza się ze średnią z Trello (~6,5 formatu
na kartę liczone po polu „Ilość Formatów", które jest wypełnione tylko na 29% kart).

### Powtarzalna struktura warstw

Każdy artboard ma ten sam szkielet:

```
[smartobject] edited                      ← zdjęcie, wstawiane per zlecenie
[curves] / [levels]                       ← korekta tonalna, stała
[smartobject] Vector Smart Object copy N  ← element KV (grafika kampanii)
[type] <headline>                         ← nagłówek, 2 linie
[smartobject] RTZKL_Zdrofit / Zdrofit     ← logo / lockup marki
[shape] Rectangle / margines 250 px       ← siatka i bezpieczne pole
```

### Zmienne — czyli wejście do generatora

Cała różnica między jednym zleceniem a drugim to **cztery pola**:

1. **zdjęcie** (warstwa `edited`)
2. **nagłówek**, dwie linie — np. `Zbuduj siłę / i pewność siebie`
3. **wariant logo / marka**
4. **element KV** (grafika kampanii)

Wszystko inne — kadry, siatki, bezpieczne pola, korekta tonalna, pozycje —
jest stałe i już rozwiązane w pliku.

**To jest kompletna specyfikacja generatora.** Nie trzeba niczego projektować od nowa,
trzeba przenieść istniejące proporcje do szablonu HTML i podpiąć dane.

---

## Rodzina „dni otwarte" — wariantowanie po markach

Katalog `Downloads/PLIKI OTWARTE 2/` zawiera **sześć osobnych plików PSD po ~133 MB**:

```
ZDROFIT_dniotwarte 2k26_KV_final_FA.psd     ← Fitness Academy
ZDROFIT_dniotwarte 2k26_KV_final_FF.psd     ← Fabryka Formy
ZDROFIT_dniotwarte 2k26_KV_final_FIT.psd
ZDROFIT_dniotwarte 2k26_KV_final_MFP.psd    ← My Fitness Place
ZDROFIT_dniotwarte 2k26_KV_final_SF.psd
ZDROFIT_dniotwarte 2k26_KV_final_ZDRO.psd   ← Zdrofit
```

Każdy: jeden artboard 1920 × 1920. Warstwy tekstowe: `26-31 marca`, `SPRAWDŹ`.

**Jeden projekt, dwie zmienne (marka + data), sześć ręcznie zduplikowanych plików
i ~800 MB na dysku.** To jest wprost ta „wszystkie sieci" z tablicy Trello (14 kart).

W generatorze: jeden szablon × tabela sześciu marek = sześć plików, jedno kliknięcie.

---

## Co z tego wynika dla planu

Rodzina „grafik zajęć / nowe zajęcia" to 185 kart i ~37 normogodzin miesięcznie.
Miałem to jako kandydata na pierwszy generator na podstawie samych nazw kart.
Po zajrzeniu do masterów: **jest to kandydat jeszcze lepszy, niż zakładałem**,
bo standard formatów jest już ustabilizowany i udokumentowany w plikach.

Ryzyko budowy: niskie. Nie ma tu decyzji projektowych do podjęcia —
jest przepisanie istniejącego układu na szablon parametryczny.

### Kolejność budowy — zaktualizowana

1. **„nowe zajęcia"** — spec kompletny, 10 formatów, 4 zmienne. Zaczynamy tutaj.
2. **„dni otwarte" / wszystkie sieci** — trywialne wariantowanie po marce, największy efekt „wow".
3. **Reformaty** — najwyższa mediana (5 h), ale spec trzeba dopiero zebrać z rozproszonych plików.

---

## Znane luki

- Pole „Ilość Formatów" w Trello wypełnione na 29% kart — nie wiadomo, czy 10 artboardów
  to standard dla wszystkich zleceń tej rodziny, czy tylko dla kampanijnych.
- Nie znam jeszcze zawartości pliku Figma (`Ada`, `CX6YM7eblILuBvw4a70n9g`) — tam mogą być
  aktualniejsze standardy i specyfikacje dla pozostałych rodzin.
- Fonty i tokeny marki do wyciągnięcia osobno (w PSD są zaszyte w warstwach tekstowych).
