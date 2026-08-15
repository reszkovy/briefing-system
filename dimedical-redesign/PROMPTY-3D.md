# Prompty 3D — DiMedical (wersja do wycięcia z tła)

Trzy obiekty odpowiadające temu, czym firma faktycznie się zajmuje:
metoda (FIA-MS/MS), marker (kwasy mikolowe), test kliniczny.

**Paleta marki:** granat `#17225C` · lawenda `#7161BC` · mięta `#2FCB9E`

## Zasady, na których stoją te prompty

Obiekt ma dać się wyciąć, więc:

- **zero cienia i podłoża** — cień przykleja się do obiektu przy wycinaniu
- **jednolite, płaskie tło** — bez gradientu, bez winiety, bez mgły
- **kontrowe światło** — oddziela krawędź od tła, inaczej ciemny obiekt zlewa się z tłem
- **obiekt w całości w kadrze**, z zapasem — nic nie może dotykać krawędzi
- **`--ar 1:1`** — najłatwiej potem osadzić w dowolnym miejscu

Midjourney nie zapisuje przezroczystości. Renderujesz na płaskim tle i wycinasz
osobno (Photoshop „Usuń tło", remove.bg albo mogę to zrobić narzędziami z sesji).

---

## 1. Źródło jonów — metoda FIA-MS/MS

> isolated 3D product render of an abstract mass spectrometer ion source, polished
> stainless steel capillary needles descending into a chrome nebulizer cone, a suspended
> plume of tiny glass spheres frozen mid-flight representing ionised droplets, matte
> navy #17225C body, violet #7161BC rim light along the edges, single mint #2FCB9E
> accent glow inside the cone, centred object with generous margin, flat uniform light
> grey background, even diffuse studio lighting, sharp clean silhouette, no ground
> plane, octane render, premium medical technology, minimal
> `--ar 1:1 --style raw --v 7 --no shadow, floor, reflection, gradient, vignette, text, logos, people`

**Tło:** jasnoszare, nie białe — polerowana stal na bieli gubi krawędzie.

---

## 2. Kwas mikolowy — marker, na którym opiera się patent

> isolated 3D render of a long-chain mycolic acid molecule, elegant curved carbon
> backbone with a characteristic long alkyl tail and short branch, matte navy #17225C
> spheres connected by slim brushed-metal bonds, one branch highlighted in mint
> #2FCB9E, soft violet #7161BC rim light, molecule floating and gently coiling,
> centred with generous margin, flat uniform white background, even diffuse lighting,
> everything in focus, sharp clean silhouette, no ground plane, scientific accuracy,
> editorial 3D illustration, minimal
> `--ar 1:1 --style raw --v 7 --no shadow, floor, depth of field, blur, gradient, DNA helix, generic ball cluster, text, people`

**Tło:** białe — matowe kule odcinają się czysto.
**Uwaga:** `--no depth of field` jest tu celowo. Rozmyty tył molekuły nie da się
czysto wyciąć. Odcinamy się też od podwójnej helisy — to lipid ściany komórkowej,
nie DNA.

---

## 3. Fiolka z próbką — test kliniczny

> isolated 3D render of a single clinical sample vial with a matte navy #17225C
> septum cap, frosted glass body with opaque pale mint #2FCB9E liquid inside filling
> the lower third, standing upright, bright violet #7161BC rim light down both edges
> of the glass, centred with generous margin, flat uniform mid grey background, even
> diffuse studio lighting, sharp clean silhouette, no ground plane, macro product
> render, premium laboratory equipment, minimal
> `--ar 1:1 --style raw --v 7 --no shadow, floor, reflection, tray, caustics, transparency, gradient, text, labels, barcode, blood, syringe, people`

**Tło:** średnia szarość — przezroczyste szkło na bieli praktycznie nie ma krawędzi.
**Dlatego szkło jest matowe, a płyn nieprzezroczysty:** czyste przezroczyste szkło
to najtrudniejszy przypadek do wycięcia — po odjęciu tła zostaje po nim brudna
poświata. Matowa fiolka wygląda równie dobrze, a wycina się bez problemu.

---

## Po wygenerowaniu

1. **Sprawdź krawędzie przy 200%** — jeśli obiekt zlewa się z tłem w którymś
   miejscu, wygeneruj ponownie z mocniejszym kontrem, nie ratuj tego w edytorze.
2. **Wytnij tło**, zapisz jako PNG z przezroczystością.
3. **Do serwisu:** przeskaluj do ~1200 px i przekonwertuj na WebP — reszta assetów
   jest w WebP, PNG-i z alfą ważą wielokrotnie więcej.
4. **Cień dodaj dopiero w CSS** (`filter: drop-shadow(...)`) — dostosuje się wtedy
   do tła, na którym obiekt faktycznie leży, jasnego i ciemnego.

## Spójna seria

- generuj wszystkie trzy w jednej sesji, z tym samym opisem światła
- gdy trafisz dobry render, dopisz `--seed <numer>` i zmieniaj tylko obiekt
- `--no people` jest w każdym celowo: zdjęcia zespołu mamy osobno
