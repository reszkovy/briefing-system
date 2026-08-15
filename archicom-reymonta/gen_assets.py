#!/usr/bin/env python3
"""Rozcina karty kondygnacji na osobne rysunki WR3 i WR1.

Uwaga: nazwy plików źródłowych NIE zgadzają się z zawartością — mapowanie poniżej
pochodzi z odczytu bloków tytułowych na samych rysunkach (audyt 09.08.2026).
"""
from PIL import Image, ImageDraw
import numpy as np, os, subprocess, base64, json, pathlib
from scipy import ndimage

ROOT = pathlib.Path(__file__).parent
D = os.path.expanduser("~/Downloads/Reymonta_2026-08-03/")
CUT = 924   # punkt wyjścia; realne cięcie liczone per karta w ciecie()
BAND = (380, 1620)          # karty pięter i garaży
BAND_PARTER = (238, 1184)   # parter ma inny układ arkusza
XMAX_PARTER = 2340          # odetnij mapkę orientacyjną i legendę ogródków

# (plik, strona) -> etykieta kondygnacji ; WR3 istnieje tylko do 7 piętra
# Parter przyszedł jako załącznik maila z 31.07, nie w paczce swisstransfer.
KARTY = [
    (os.path.expanduser("~/Downloads/KARTA KONDYGNACJI PARTERU_ogródki lokali usługowych.pdf"),
     1, "parter", True),
    ("KARTA KONDYGNACJI GARAŻU  -2.pdf", 2, "garaz-2",  False),
    ("KARTA KONDYGNACJI GARAŻU  -1-2.pdf", 1, "garaz-1", False),
    ("KARTA KONDYGNACJI 10 PIĘTRA.pdf", 1, "p1",  True),
    ("KARTA KONDYGNACJI 3 PIĘTRA.pdf",  1, "p2",  True),
    ("KARTA KONDYGNACJI 4 PIĘTRA.pdf",  1, "p3",  True),
    ("KARTA KONDYGNACJI 5 PIĘTRA.pdf",  1, "p4",  True),
    ("KARTA KONDYGNACJI 6 PIĘTRA.pdf",  1, "p5",  True),
    ("KARTA KONDYGNACJI 7 PIĘTRA.pdf",  1, "p6",  True),
    ("KARTA KONDYGNACJI 8 PIĘTRA.pdf",  1, "p7",  True),
    ("KARTA KONDYGNACJI 9 PIĘTRA.pdf",  1, "p8",  False),
    ("KARTA KONDYGNACJI GARAŻU  -1.pdf", 1, "p9",  False),
    ("KARTA KONDYGNACJI 2 PIĘTRA.pdf",  1, "p10", False),
]


# Paleta wypełnień zdjęta z oryginalnego prezentera Przystani (str. 10, 200 dpi).
# Nowe karty od architekta przychodzą w zieleni i żółci — przekładamy je na stonowaną
# gamę z pierwotnego pliku, zachowując kolejność od najmniejszych do największych.
PALETA = [
    ("#afc7a9", "#ecf4f0"),   # 1-pokojowe  → bardzo jasna mięta
    ("#e2f3a5", "#d4e0e0"),   # 2-pokojowe  → błękitna szarość
    ("#f5f3b3", "#d4d0cc"),   # 3-pokojowe  → ciepła szarość
    ("#ffdf9f", "#ece0c8"),   # 4-pokojowe  → krem
    ("#dcbb79", "#e4c8b4"),   # 5-pokojowe  → przygaszony łosoś
    ("#adadad", "#c8c8c8"),   # komunikacja
]


def hx(s):
    return np.array([int(s[i:i + 2], 16) for i in (1, 3, 5)])


def przemaluj(im, tol=20):
    """Zamienia paletę nowych kart na tę z pierwotnego prezentera."""
    a = np.array(im.convert("RGB")).astype(int)
    wynik = a.copy()
    for zrod, cel in PALETA:
        z, c = hx(zrod), hx(cel)
        m = (np.abs(a - z) <= tol).all(axis=2)
        wynik[m] = c
    return Image.fromarray(wynik.astype("uint8"))


def trim(im, pad=14):
    a = np.array(im.convert("L")); ink = a < 235
    rs = np.nonzero(ink.sum(axis=1) > 0)[0]; cs = np.nonzero(ink.sum(axis=0) > 0)[0]
    if not len(rs): return im
    return im.crop((max(0, cs.min() - pad), max(0, rs.min() - pad),
                    min(im.width, cs.max() + pad), min(im.height, rs.max() + pad)))


def ciecie(band, wokol=(900, 1000)):
    """Najczystsza kolumna w strefie styku — tam, gdzie cięcie zniszczy najmniej opisów."""
    ink = (np.array(band.convert("L")) < 220).sum(axis=0)
    okno = [(int(ink[x:x + 10].sum()), x) for x in range(*wokol)]
    return min(okno)[1]


def opisy_przy_ciecie(band, cut, zasieg=520):
    """Znajduje ramki opisów lokali, które leżą okrakiem na linii cięcia.

    Każdą przypisuje do budynku, po którego stronie leży jej środek — dzięki temu
    opis zostaje w całości na swojej stronie, zamiast zostać przecięty na pół.
    Zwraca dwie listy prostokątów (dla WR3 i dla WR1) we współrzędnych pasma.
    """
    ink = np.array(band.convert("L")) < 200
    lo, hi = max(0, cut - zasieg), min(band.width, cut + zasieg)

    # poziome krawędzie ramek: długie ciągi tuszu w jednym wierszu
    krawedzie = {}
    for y in range(ink.shape[0]):
        x = lo
        row = ink[y]
        while x < hi:
            if not row[x]:
                x += 1; continue
            p = x
            while x < hi and row[x]:
                x += 1
            if 45 <= x - p <= 900:
                krawedzie.setdefault(y, []).append((p, x))

    # ramka = dwie takie krawędzie o zbliżonym zakresie x, oddalone o 12–62 px
    prostokaty = []
    for y, gora in krawedzie.items():
        for dy in range(12, 63):
            for a in gora:
                for b in krawedzie.get(y + dy, []):
                    if abs(a[0] - b[0]) <= 6 and abs(a[1] - b[1]) <= 6:
                        prostokaty.append((a[0], y, a[1], y + dy))

    wr3, wr1 = [], []
    for L, T, R, B in prostokaty:
        if not (L < cut < R):
            continue
        r = (L - 4, T - 4, R + 4, B + 4)
        if R - L > 300:          # nagłówek klatki — przynależność niejednoznaczna,
            wr3.append(r); wr1.append(r)   # zostaje w całości po obu stronach
        else:
            (wr3 if (L + R) / 2 < cut else wr1).append(r)
    return wr3, wr1


def polowa(band, cut, strona, boxy_moje, boxy_obce, pad=18):
    """Wycina połowę: rysunek urwany dokładnie na dylatacji, opisy w całości."""
    src = np.array(band.convert("RGB"))
    if strona == "r":                              # WR3 — lewa część
        koniec = max([cut] + [b[2] for b in boxy_moje]) + pad
        a = src[:, :koniec].copy()
        a[:, cut:] = 255                           # za dylatacją tylko biel…
        for L, T, R, B in boxy_obce:               # …bez resztek cudzych opisów…
            if L < koniec:
                a[max(0, T):B, max(0, L):min(koniec, R)] = 255
        for L, T, R, B in boxy_moje:               # …i z własnymi w całości
            a[max(0, T):B, max(0, L):min(koniec, R)] = src[max(0, T):B,
                                                           max(0, L):min(koniec, R)]
        return Image.fromarray(a), cut

    start = max(0, min([cut] + [b[0] for b in boxy_moje]) - pad)
    a = src[:, start:].copy()
    a[:, :cut - start] = 255
    for L, T, R, B in boxy_obce:
        l, r = max(start, L), R
        if r > l:
            a[max(0, T):B, l - start:r - start] = 255
    for L, T, R, B in boxy_moje:
        l, r = max(start, L), R
        if r > l:
            a[max(0, T):B, l - start:r - start] = src[max(0, T):B, l:r]
    return Image.fromarray(a), cut - start


def dylatacja(im, x):
    """Linia przerywana w miejscu dylatacji — tak jak w starym prezenterze."""
    d = ImageDraw.Draw(im)
    y = int(im.height * 0.16)
    while y < im.height * 0.90:
        d.line([(x, y), (x, y + 13)], fill=(150, 150, 150), width=2)
        y += 25
    return im


def main():
    (ROOT / "assets").mkdir(exist_ok=True)
    for plik, strona, tag, ma_wr3 in KARTY:
        tmp = ROOT / f"src/raw-{tag}"
        zrodlo = plik if plik.startswith("/") else D + plik
        if not tmp.with_suffix(".png").exists():
            subprocess.run(["pdftoppm", "-r", "200", "-png", "-singlefile",
                            "-f", str(strona), "-l", str(strona), zrodlo, str(tmp)], check=True)
        im = Image.open(str(tmp) + ".png").convert("RGB")
        y0, y1 = BAND_PARTER if tag == "parter" else BAND
        xmax = XMAX_PARTER if tag == "parter" else 2450
        band = przemaluj(im.crop((0, y0, xmax, y1)))
        if ma_wr3:
            x = ciecie(band)
            b3, b1 = opisy_przy_ciecie(band, x)
            im3, lx3 = polowa(band, x, "r", b3, b1)
            im1, lx1 = polowa(band, x, "l", b1, b3)
            trim(dylatacja(im3, lx3)).save(ROOT / f"assets/rzut-{tag}-wr3.png")
            trim(dylatacja(im1, lx1)).save(ROOT / f"assets/rzut-{tag}-wr1.png")
            print(f"{tag:8} WR3 + WR1   (dylatacja przy x={x})")
        else:
            trim(band).save(ROOT / f"assets/rzut-{tag}-full.png")
            print(f"{tag:8} pełny rysunek")

    out = {}
    A = ROOT / "assets"
    for f in sorted(os.listdir(A)):
        mt = {"jpg": "image/jpeg", "png": "image/png",
              "svg": "image/svg+xml", "ttf": "font/ttf"}.get(f.rsplit(".", 1)[-1])
        if mt:
            out[f] = f"data:{mt};base64," + base64.b64encode((A / f).read_bytes()).decode()
    json.dump(out, open(ROOT / "src/assets.json", "w"))
    print(f"\n{len(out)} assetów zakodowanych")


if __name__ == "__main__":
    main()
