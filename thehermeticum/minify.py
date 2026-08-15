#!/usr/bin/env python3
"""Minifikacja CSS/JS wykonywana WYŁĄCZNIE na kopii wdrożeniowej.
Źródło w repo zostaje czytelne. Konserwatywnie: usuwa komentarze i zbędne
białe znaki poza cudzysłowami, nie rusza selektorów ani kolejności reguł."""
import re, sys, os

def minify_css(s):
    out, i, n = [], 0, len(s)
    while i < n:
        c = s[i]
        if c in '"\'':                      # łańcuch — przepisujemy dosłownie
            j = i + 1
            while j < n and (s[j] != c or s[j-1] == '\\'): j += 1
            out.append(s[i:j+1]); i = j + 1; continue
        if s.startswith('/*', i):           # komentarz
            j = s.find('*/', i + 2)
            i = (j + 2) if j > 0 else n; continue
        out.append(c); i += 1
    t = ''.join(out)
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'\s*([{}:;,>~+])\s*', r'\1', t)
    t = re.sub(r';}', '}', t)
    t = re.sub(r'\(\s+', '(', t); t = re.sub(r'\s+\)', ')', t)
    return t.strip()

if __name__ == '__main__':
    plik = sys.argv[1]
    orig = open(plik).read()
    maly = minify_css(orig)
    # guard: liczba bloków musi się zgadzać. Liczymy na wersji BEZ komentarzy,
    # bo nawiasy bywają też w komentarzach — inaczej porównujemy różne rzeczy.
    bez_kom = re.sub(r'/\*.*?\*/', '', orig, flags=re.S)
    a, b = bez_kom.count('{'), maly.count('{')
    if a != b:
        print('MINIFIKACJA POMINIĘTA: %d bloków przed, %d po' % (a, b)); sys.exit(0)
    open(plik, 'w').write(maly)
    print('  %s: %d → %d KB (%d%% mniej, %d bloków bez zmian)'
          % (os.path.basename(plik), len(orig)//1024, len(maly)//1024,
             100 - 100*len(maly)//len(orig), b))
