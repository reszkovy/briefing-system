#!/usr/bin/env python3
"""
Tnie gotowe artboardy na pojedyncze bryty wg podziału szyb.

    python3 potnij.py            # cięcie styk w styk (0 cm zakładki)
    python3 potnij.py 2          # 2 cm zakładki z każdej strony

Zakładka poszerza bryt o podany zapas z obu stron (poza skrajnymi krawędziami
planszy) — zapas obcinamy dopiero przy klejeniu. Wynik: out/bryty/
"""
import sys, os
from PIL import Image

CM = 10  # 1 cm = 10 px

BOARDS = {
    'A': [122, 123, 123, 123, 123.5, 122],
    'B': [123, 124, 123.5],
    'C': [123],
}

def main():
    zaklad_cm = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
    z = round(zaklad_cm * CM)
    here = os.path.dirname(os.path.abspath(__file__))
    dst = os.path.join(here, 'out', 'bryty')
    os.makedirs(dst, exist_ok=True)

    for key, panes in BOARDS.items():
        src = os.path.join(here, 'out', f'zdrofit-lodygowa-{key}.png')
        if not os.path.exists(src):
            print(f'{key}: brak {src} — najpierw ./render.sh'); continue
        im = Image.open(src)
        W, H = im.size
        acc = 0
        for i, p in enumerate(panes, 1):
            x0 = round(acc * CM); acc += p; x1 = round(acc * CM)
            cx0 = max(0, x0 - z); cx1 = min(W, x1 + z)
            out = im.crop((cx0, 0, cx1, H))
            name = f'{key}{i}_{str(p).replace(".", ",")}cm.png'
            out.save(os.path.join(dst, name))
            print(f'  {name:24s} {out.size[0]} × {out.size[1]} px'
                  f'  (netto {x1-x0} px = {p} cm, zakładka {z} px)')
        if round(acc * CM) != W:
            print(f'  UWAGA {key}: suma szyb {acc} cm = {round(acc*CM)} px ≠ szerokość planszy {W} px')
    print(f'\nGotowe → {dst}')

if __name__ == '__main__':
    main()
