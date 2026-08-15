#!/usr/bin/env python3
"""Generuje stronę-mapę (spis treści szkoły) z realnych nagłówków Instrukcji i Alchemii.
Uruchamiać PRZED build.py — linki i kotwice nie mogą się rozjechać z treścią."""
import json, re, html as H, os

ROOT = os.path.dirname(os.path.abspath(__file__))

def slugify(t):
    t = re.sub(r'<[^>]+>', '', t)
    t = H.unescape(t).lower()
    for a, b in (('ą','a'),('ć','c'),('ę','e'),('ł','l'),('ń','n'),('ó','o'),('ś','s'),('ź','z'),('ż','z')):
        t = t.replace(a, b)
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-') or 'sekcja'

def sections(path):
    d = json.load(open(os.path.join(ROOT, path)))
    out, used = [], set()
    for m in re.findall(r'<h2>(.*?)</h2>', d['body']):
        s = slugify(m); i = 2
        while s in used:
            s = f"{slugify(m)}-{i}"; i += 1
        used.add(s)
        title = re.sub(r'<[^>]+>', '', H.unescape(m))
        num = re.match(r'^(\d+)\.\s*(.*)$', title)
        out.append((s, num.group(1) if num else None, num.group(2) if num else title))
    return out

def build(lang):
    L = lang == 'pl'
    pre = '/pl' if L else ''
    ins = sections('content-pl/guide__instruction.json' if L else 'content/guide-instruction.json')
    alc = sections('content-pl/guide__operational-alchemy.json' if L else 'content/guide-operational-alchemy.json')
    ins = [x for x in ins if x[1]]
    alc = [x for x in alc if x[1]]

    # cztery filary → które praktyki i zasady do nich należą (numery)
    P = [
      ("READ", "Czytaj" if L else "Read",
       "Czytaj siebie, ludzi, systemy, symbole, napięcia i wzorce. Świat nie jest płaski — trzeba go umieć interpretować." if L else
       "Read yourself, people, systems, symbols, tensions and patterns. The world is not flat; it has to be interpreted.",
       [1,5,6], [4]),
      ("ALIGN", "Ustaw" if L else "Align",
       "Dopasuj działania do wartości, energii, ciała, relacji i długiego horyzontu. To alignment życia, nie tylko maszyn." if L else
       "Align actions with values, energy, body, relationships and the long horizon. Life alignment, not only the machine kind.",
       [4,8,9,12,13], [1,3]),
      ("BUILD", "Buduj" if L else "Build",
       "Zamień powtarzalny chaos w system, rytuał, narzędzie albo aktywo." if L else
       "Turn recurring chaos into a system, a ritual, a tool or an asset.",
       [2,14], [2,7,8,9,10,11]),
      ("TRANSMUTE", "Przekształcaj" if L else "Transmute",
       "Napięcie w decyzję, chaos w formę, wiedzę w praktykę, energię w działanie. Alchemia bez kiczu." if L else
       "Tension into decision, chaos into form, knowledge into practice, energy into action. Alchemy without the kitsch.",
       [3,7,10,11,15], [5,6,12]),
    ]
    ins_by = {int(n): (s, t) for s, n, t in ins}
    alc_by = {int(n): (s, t) for s, n, t in alc}
    iu, au = f"{pre}/guide/instruction/", f"{pre}/guide/operational-alchemy/"

    body = ('<p>Ta strona jest mapą całości. Cztery filary — <em>czytaj, ustaw, buduj, przekształcaj</em> — '
            'porządkują wszystko, co tu jest: piętnaście praktyk Instrukcji, dwanaście zasad Alchemii operacyjnej '
            'oraz tradycję, z której to wyrasta.</p>'
            '<p class="rule">Czytaj wzór. Ustaw system. Działaj z energią. Przekształcaj wynik.</p>'
            if L else
            '<p>This page is the map. Four pillars — <em>read, align, build, transmute</em> — organise everything here: '
            'the fifteen practices of the Instruction, the twelve principles of Operational Alchemy, and the tradition they grow out of.</p>'
            '<p class="rule">Read the pattern. Align the system. Act with energy. Transmute the result.</p>')

    for key, name, desc, iidx, aidx in P:
        body += f'<h2>{key} &mdash; {name}</h2><p>{desc}</p><ul class="map">'
        for n in iidx:
            if n in ins_by:
                s, t = ins_by[n]
                body += f'<li><a href="{iu}#{s}"><i>{n:02d}</i>{t}</a><span>{"Instrukcja" if L else "Instruction"}</span></li>'
        for n in aidx:
            if n in alc_by:
                s, t = alc_by[n]
                body += f'<li><a href="{au}#{s}"><i>{n:02d}</i>{t}</a><span>{"Alchemia" if L else "Alchemy"}</span></li>'
        body += '</ul>'

    body += ('<h2>Tradycja, z której to wyrasta</h2><ul class="map">'
             f'<li><a href="{pre}/start-here/">Zacznij tutaj</a><span>orientacja</span></li>'
             f'<li><a href="{pre}/path/">Ścieżka — 12 kroków</a><span>lektura prowadzona</span></li>'
             f'<li><a href="{pre}/texts/">Teksty</a><span>kanon</span></li>'
             f'<li><a href="{pre}/figures/">Postaci</a><span>linia przekazu</span></li>'
             f'<li><a href="{pre}/ideas/">Idee</a><span>słownik</span></li>'
             f'<li><a href="{pre}/atlas/">Atlas</a><span>miejsca i epoki</span></li>'
             f'<li><a href="{pre}/letters/">Listy</a><span>cotygodniowy rytm</span></li>'
             f'<li><a href="{pre}/about/method/">Metoda</a><span>jak pracujemy</span></li></ul>'
             if L else
             '<h2>The tradition it grows from</h2><ul class="map">'
             f'<li><a href="{pre}/start-here/">Start Here</a><span>orientation</span></li>'
             f'<li><a href="{pre}/path/">The Path — 12 steps</a><span>guided reading</span></li>'
             f'<li><a href="{pre}/texts/">The Texts</a><span>the canon</span></li>'
             f'<li><a href="{pre}/figures/">The Figures</a><span>the lineage</span></li>'
             f'<li><a href="{pre}/ideas/">The Ideas</a><span>the glossary</span></li>'
             f'<li><a href="{pre}/atlas/">The Atlas</a><span>places and eras</span></li>'
             f'<li><a href="{pre}/letters/">The Letters</a><span>the weekly rhythm</span></li>'
             f'<li><a href="{pre}/about/method/">Method</a><span>how we work</span></li></ul>')

    d = {
      "path": "guide/contents",
      "trail": [["Współczesny hermeta" if L else "The Modern Hermet", f"{pre}/guide/"]],
      "crumb": "Mapa" if L else "The Map",
      "kicker": "Przewodnik" if L else "The guide",
      "title": ("Mapa — spis treści szkoły" if L else "The Map — contents of the school"),
      "desc": ("Cała szkoła na jednej stronie: cztery filary, piętnaście praktyk, dwanaście zasad działania i tradycja, z której to wyrasta."
               if L else
               "The whole school on one page: four pillars, fifteen practices, twelve operating principles, and the tradition behind them."),
      "h1": ("Mapa" if L else "The Map"),
      "tldr": ("Wszystko, co tu jest, w jednym widoku — uporządkowane wedle czterech filarów: czytaj, ustaw, buduj, przekształcaj."
               if L else
               "Everything here in one view, arranged by the four pillars: read, align, build, transmute."),
      "body": body,
      "ld_type": "Article",
      "next": (f'Dalej &rarr; <a href="{iu}">Instrukcja</a> &middot; <a href="{au}">Alchemia operacyjna</a>'
               if L else f'Next &rarr; <a href="{iu}">The Instruction</a> &middot; <a href="{au}">Operational Alchemy</a>')
    }
    out = 'content-pl/guide__contents.json' if L else 'content/guide-contents.json'
    json.dump(d, open(os.path.join(ROOT, out), 'w'), indent=2, ensure_ascii=False)
    print('mapa →', out, f'({len(ins)} praktyk, {len(alc)} zasad)')

build('en'); build('pl')
