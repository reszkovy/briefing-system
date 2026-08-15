# Zdrofit — Warszawa Targówek, CH Łodygowa · oklejenie witryn

„Tu powstaje nowy klub fitness Zdrofit" — jak w Poznaniu. Postać + logo + kod QR.

**Skala: 1 cm = 10 px.** 123 cm = 1230 px, wysokość 284,5 cm = 2845 px.

## Artboardy

| Plik | Lokalizacja | Wymiar | Piksele | Szyby (cm) |
|---|---|---|---|---|
| `out/zdrofit-lodygowa-A.png` | na lewo od rolety wejściowej | 736,5 × 284,5 cm | **7365 × 2845** | 122 / 123 / 123 / 123 / 123,5 / 122 |
| `out/zdrofit-lodygowa-B.png` | na prawo od wejścia | 370,5 × 284,5 cm | **3705 × 2845** | 123 / 124 / 123,5 |
| `out/zdrofit-lodygowa-C.png` | za rogiem (90°) | 123 × 284,5 cm | **1230 × 2845** | 123 |

Wersje `*-bryty.png` to warstwa kontrolna: linie cięcia, wymiary każdej szyby
i strefa bezpieczna 8 cm — do sprawdzenia, nie do druku.

## Kod QR

`https://zdrofit.pl/kluby-fitness/warszawa-targowek-ch-lodygowa/lead`

Wersja 8, korekcja błędów **H** (30%), 49 × 49 modułów. Zweryfikowany moduł po module
na wyrenderowanych plikach — zero różnic wobec wzorca.

| Plansza | Bok kodu | Moduł | Środek nad podłogą |
|---|---|---|---|
| A | 47 cm | 0,96 cm | 119 cm |
| B | 40 cm | 0,82 cm | 116 cm |
| C | 43 cm | 0,88 cm | 107 cm |

Żaden kod nie wypada na styku brytów.

## Rozmieszczenie a linie cięcia (plansza A)

- szyby 1–2 — fotografia; twarz pierwszej postaci ok. 17 cm od cięcia na 122 cm
- szyby 3–4 — hasło, mieści się w całości między cięciami 245 i 491 cm
- szyba 6 — logo w całości wewnątrz szyby; kwadrat QR również
- niebieski panel adresowy przechodzi przez styk na 614,5 cm — jednolita płaszczyzna, bez ryzyka

## Praca z plikami

```bash
./render.sh
```

Render 1:1 do `out/`. `./render.sh guides` dokłada warstwę kontrolną z liniami cięcia.

```bash
python3 potnij.py 2
```

Cięcie na pojedyncze bryty z 2 cm zakładki z każdej strony → `out/bryty/`.
Bez argumentu tnie styk w styk.

Podgląd wszystkich trzech plansz obok siebie: otwórz `artboardy.html` w przeglądarce.
Tryb renderu pojedynczej planszy: `artboardy.html?b=A` (+ `&g=1` dla linii cięcia).

## Edycja

Cała treść siedzi w jednym obiekcie `COPY` w `artboardy.html` — hasło, adres, podpis
pod kodem. Podział szyb i wymiary: obiekt `BOARDS`. Skala: stała `CM`.

Po każdej zmianie: `./render.sh` (i `./render.sh guides`).

## Marka

Źródło: `BENEFITSYSTEMS_ZDROFIT/brand-hub` (brand.json, logo SVG/PNG, fonty Aptly).

- Niebieski `#009CDE` (Pantone 2925 C) · Pomarańczowy `#FF5B19` (165 C) · Stalowy `#3B3F42` (432 C)
- Typografia: **Aptly** — Black na hasła (wersaliki), Bold na podpisy
- Elastyczna linia: niebieska prowadzi, pomarańczowa wychodzi spod niej (≤ 50% grubości),
  koniec zmierza ku górze — zgodnie z księgą znaku

Fotografia: `20250725_ZdroFit_6772.jpg` (6189 × 9283 px), kadry w `assets/foto-*.jpg`.

## Uwaga do wymiarów

Zbudowane na wymiarach z Twojej wiadomości. Rysunek techniczny
(`assets/rysunek-techniczny.pdf`) podaje w dwóch miejscach inne wartości:

| | Twoja wiadomość | Rysunek |
|---|---|---|
| A — całość | 736,5 cm | 736,7 cm |
| A — szyba 3 | 123 cm | 123,2 cm |
| B — szyba 1 | 123 cm | 122,8 cm |
| B — całość | 370,5 cm | 370,3 cm |

Różnice 2 mm, w praktyce bez znaczenia przy zakładce. Gdyby jednak trzeba było
zejść na rysunek — zmień tablicę `BOARDS` w `artboardy.html` i `BOARDS` w `potnij.py`,
reszta przeliczy się sama.
