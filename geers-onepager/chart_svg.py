#!/usr/bin/env python3
"""Generuje sam wykres liniowy jako samodzielny SVG — do importu w Figmie jako wektory.

Geometria 1:1 z template.html, żeby makieta w Figmie i plik do druku się nie rozjechały.
"""
import pathlib

# dane: dane one pager.xlsx (Trello 5GQC7ys9), kolejność rosnąco wg Geers — jak w oryginale klienta
DATA = [
    ("Zaufanie do marki", 55, 49, 45, 42, 38),
    ("Odpowiedni stosunek ceny do jakości", 55, 49, 53, 47, 46),
    ("Dogodne lokalizacje", 58, 50, 45, 47, 44),
    ("Atrakcyjny wygląd salonu", 59, 51, 52, 48, 44),
    ("Bezpłatne testowanie aparatów w domu", 60, 46, 48, 49, 38),
    ("Szybkie terminy wizyt", 63, 53, 53, 50, 46),
    ("Gwarancja i opieka posprzedażowa", 63, 57, 56, 54, 46),
    ("Jakość obsługi", 68, 60, 57, 59, 52),
    ("Wykwalifikowani audiolodzy", 69, 64, 60, 62, 42),
    ("Najwyższa jakość dźwięku", 69, 63, 60, 61, 46),
    ("Łatwe umawianie wizyt", 71, 62, 55, 57, 50),
    ("Sprawdzona technologia", 74, 63, 64, 66, 60),
]
BRANDS = [
    ("Geers", "#0A6B3D", True),
    ("Amplifon", "#E14D6E", False),
    ("Audika", "#2F62B4", False),
    ("Audiofon", "#3AAFA4", False),
    ("Marmed", "#C07BE0", False),
]
W, H = 640, 330
TOP, RIGHT, BOTTOM, LEFT = 20, 6, 112, 30
PW, PH = W - LEFT - RIGHT, H - TOP - BOTTOM
YMIN, YMAX = 30, 80
WARM = "#FAF5EC"
MUTE = "#5C5C5C"


def y(v: float) -> float:
    return round(TOP + PH - ((v - YMIN) / (YMAX - YMIN)) * PH, 2)


def x(i: int) -> float:
    return round(LEFT + (PW / len(DATA)) * (i + 0.5), 2)


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build() -> str:
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">']
    p.append(f'<rect width="{W}" height="{H}" fill="{WARM}"/>')

    # siatka + oś Y
    for v in range(YMIN, YMAX + 1, 10):
        p.append(f'<line x1="{LEFT}" x2="{W-RIGHT}" y1="{y(v)}" y2="{y(v)}" stroke="#D9D9D4" stroke-width="1"/>')
        p.append(f'<text x="{LEFT-6}" y="{y(v)+2.5}" text-anchor="end" font-family="Inter" '
                 f'font-size="7" fill="{MUTE}">{v}%</text>')
    p.append(f'<line x1="{LEFT}" x2="{LEFT}" y1="{TOP}" y2="{TOP+PH}" stroke="#E2E5E0" stroke-width="1"/>')

    # kolejność rysowania: konkurencja pod spodem, Geers na wierzchu
    order = sorted(range(len(BRANDS)), key=lambda i: BRANDS[i][2])

    for i in order:
        name, color, lead = BRANDS[i]
        pts = " ".join(f"{x(j)},{y(row[i+1])}" for j, row in enumerate(DATA))
        p.append(f'<polyline points="{pts}" fill="none" stroke="{color}" '
                 f'stroke-width="{2.6 if lead else 1.5}" stroke-linejoin="round" stroke-linecap="round"/>')

    for i in order:
        name, color, lead = BRANDS[i]
        for j, row in enumerate(DATA):
            p.append(f'<circle cx="{x(j)}" cy="{y(row[i+1])}" r="{3.6 if lead else 2.6}" '
                     f'fill="{color}" stroke="{WARM}" stroke-width="{1.8 if lead else 1.4}"/>')

    # wartości tylko dla Geers
    for j, row in enumerate(DATA):
        p.append(f'<text x="{x(j)}" y="{y(row[1])-8}" text-anchor="middle" font-family="Inter" '
                 f'font-size="8" font-weight="500" fill="#0A6B3D">{row[1]}%</text>')

    # opisy kategorii, obrócone o 45°
    for j, row in enumerate(DATA):
        p.append(f'<text transform="translate({x(j)-3},{TOP+PH+9}) rotate(-45)" text-anchor="end" '
                 f'font-family="Inter" font-size="7.6" fill="#191919">{esc(row[0])}</text>')

    p.append("</svg>")
    return "\n".join(p)


if __name__ == "__main__":
    out = pathlib.Path(__file__).parent / "wykres.svg"
    out.write_text(build(), encoding="utf-8")
    print(f"zbudowano {out} ({out.stat().st_size // 1024} KB)")
