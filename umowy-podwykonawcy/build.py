#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Buduje trzy dokumenty (.docx + .md) z treści w nda.py, umowa_ramowa.py i umowa_dzielo.py."""

import os
import render
from dane import DANE
import nda
import umowa_ramowa
import umowa_dzielo

HERE = os.path.dirname(os.path.abspath(__file__))

DOKUMENTY = [
    (nda.BLOKI, "NDA-podwykonawca", "Zleceniodawca", "Podwykonawca"),
    (umowa_ramowa.BLOKI, "Umowa-ramowa-podwykonawca", "Zamawiający", "Wykonawca"),
    (umowa_dzielo.BLOKI, "Umowa-o-dzielo-jednorazowa", "Zamawiający", "Wykonawca"),
]

if __name__ == "__main__":
    for bloki, nazwa, lewy, prawy in DOKUMENTY:
        render.build_docx(bloki, DANE, os.path.join(HERE, nazwa + ".docx"), lewy, prawy)
        render.build_md(bloki, DANE, os.path.join(HERE, nazwa + ".md"), lewy, prawy)
        print("zbudowano:", nazwa)
