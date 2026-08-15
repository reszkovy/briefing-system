#!/usr/bin/env python3
"""Składa książkę do jednego pliku HTML do druku i renderuje PDF przez Chrome headless."""
import json, glob, os, re, html as H, subprocess, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

META = {
 'pl': dict(dir='book-pl', title='Hermetyzm operacyjny',
            sub='Współczesna szkoła uwagi, energii i sprawczości',
            parts={'opening':'Otwarcie','read':'Czytaj','align':'Ustaw','build':'Buduj','transmute':'Przekształcaj'},
            toc='Spis treści', chapter='Rozdział', site='thehermeticum.com',
            note='Wydanie robocze. Tekst powstaje z pomocą narzędzi AI na podstawie opublikowanych badań; '
                 'źródła stoją przy stronach, do których należą. Anonimowy autor. Jawne źródła. Sprawdzalna praktyka.',
            out='hermetyzm-operacyjny.pdf'),
 'en': dict(dir='book-en', title='Operational Hermeticism',
            sub='A modern school of attention, energy and agency',
            parts={'opening':'Opening','read':'Read','align':'Align','build':'Build','transmute':'Transmute'},
            toc='Contents', chapter='Chapter', site='thehermeticum.com',
            note='Working edition. The text is assembled with AI research tools from published scholarship; '
                 'sources sit on the pages they belong to. Anonymous author. Visible sources. Testable practice.',
            out='operational-hermeticism.pdf'),
}
ORDER = ['opening', 'read', 'align', 'build', 'transmute']

CSS = '''
@page { size: 148mm 210mm; margin: 18mm 16mm 20mm; }
@page :first { margin: 0; }
* { box-sizing: border-box; }
body { margin:0; font-family:"EB Garamond","Iowan Old Style",Georgia,serif; font-size:10.5pt; line-height:1.62;
       color:#240B36; background:#fff; -webkit-font-smoothing:antialiased; }
h1,h2,h3,.ui { font-family:"Plus Jakarta Sans",-apple-system,Helvetica,sans-serif; }
.cover { height:210mm; padding:26mm 20mm; background:#FAF5E4; display:flex; flex-direction:column; justify-content:space-between;
         page-break-after:always; }
.cover__mark { font-family:"Plus Jakarta Sans",sans-serif; font-size:11pt; font-weight:600; letter-spacing:-.04em; }
.cover h1 { font-family:"EB Garamond",Georgia,serif; font-size:34pt; line-height:1.04; font-weight:500; margin:0 0 6mm; }
.cover p { margin:0; font-size:12pt; color:#6B5B72; }
.cover__foot { font-family:"Plus Jakarta Sans",sans-serif; font-size:8pt; letter-spacing:.14em; text-transform:uppercase; color:#a87f22; }
.toc { page-break-after:always; }
.toc h2, .part h2 { font-size:15pt; font-weight:600; margin:0 0 6mm; }
.toc__part { font-family:"Plus Jakarta Sans",sans-serif; font-size:7.5pt; letter-spacing:.18em; text-transform:uppercase;
             color:#a87f22; margin:6mm 0 2mm; }
.toc ol { list-style:none; margin:0; padding:0; }
.toc li { display:flex; gap:4mm; padding:1.1mm 0; font-size:10pt; }
.toc li i { font-style:normal; font-family:"Plus Jakarta Sans",sans-serif; font-size:8pt; color:#a87f22; min-width:8mm; }
.partpage { page-break-before:always; height:150mm; display:flex; flex-direction:column; justify-content:center; }
.partpage span { font-family:"Plus Jakarta Sans",sans-serif; font-size:8pt; letter-spacing:.24em; color:#a87f22; }
.partpage h2 { font-family:"EB Garamond",Georgia,serif; font-size:26pt; font-weight:500; margin:2mm 0 0; }
.ch { page-break-before:always; }
.ch__meta { font-family:"Plus Jakarta Sans",sans-serif; font-size:7.5pt; letter-spacing:.16em; text-transform:uppercase;
            color:#6B5B72; margin:0 0 2mm; }
.ch h1 { font-family:"EB Garamond",Georgia,serif; font-size:22pt; font-weight:500; line-height:1.12; margin:0 0 3mm; }
.ch__sub { font-style:italic; color:#6B5B72; margin:0 0 6mm; font-size:11pt; }
.sec { margin-bottom:5mm; }
.sec__lbl { font-family:"Plus Jakarta Sans",sans-serif; font-size:7pt; font-weight:600; letter-spacing:.2em;
            text-transform:uppercase; color:#a87f22; margin:0 0 1.5mm; padding-bottom:1mm; border-bottom:.3pt solid #E4DCC8; }
p { margin:0 0 3.2mm; orphans:2; widows:2; }
h3 { font-family:"EB Garamond",Georgia,serif; font-size:11.5pt; font-weight:600; margin:4mm 0 1.5mm; }
ul { margin:0 0 3.2mm; padding-left:5mm; } li { margin-bottom:1.2mm; }
.rule { border-left:1.5pt solid #F2DC5D; padding-left:3.5mm; font-family:"Plus Jakarta Sans",sans-serif;
        font-size:9.5pt; line-height:1.55; }
.closing { margin-top:5mm; padding:3.5mm 4mm; background:#FAF5E4; border-left:2pt solid #A4031F;
           font-family:"EB Garamond",Georgia,serif; font-size:12pt; }
.note { page-break-before:always; font-size:9pt; color:#6B5B72; }
img { max-width:100%; }
'''

def build(lang):
    m = META[lang]
    chs = []
    for f in sorted(glob.glob(os.path.join(ROOT, m['dir'], '*.json'))):
        try: chs.append(json.load(open(f)))
        except Exception as e: print('pominięte:', f, e)
    chs.sort(key=lambda c: c['n'])
    byp = {}
    for c in chs: byp.setdefault(c.get('part', 'read'), []).append(c)

    toc = ''
    for p in ORDER:
        if p not in byp: continue
        toc += f'<p class="toc__part">{m["parts"][p]}</p><ol>'
        for c in byp[p]:
            num = '—' if c['n'] == 0 else f"{c['n']:02d}"
            toc += f'<li><i>{num}</i><span>{H.escape(c["title"])}</span></li>'
        toc += '</ol>'

    body = ''
    for p in ORDER:
        if p not in byp: continue
        if p != 'opening':
            body += f'<section class="partpage"><span>{m["parts"][p].upper()}</span><h2>{m["parts"][p]}</h2></section>'
        for c in byp[p]:
            meta = m['title'] if c['n'] == 0 else f"{m['chapter']} {c['n']:02d}"
            body += f'<section class="ch"><p class="ch__meta">{meta}</p><h1>{H.escape(c["title"])}</h1>'
            if c.get('subtitle'): body += f'<p class="ch__sub">{H.escape(c["subtitle"])}</p>'
            for s in c['sections']:
                lbl = s.get('label') or ''
                body += ('<div class="sec">' + (f'<p class="sec__lbl">{H.escape(lbl)}</p>' if lbl else '') + s['html'] + '</div>')
            if c.get('closing_line'): body += f'<p class="closing">{H.escape(c["closing_line"])}</p>'
            body += '</section>'

    html = f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<title>{m['title']}</title>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
<section class="cover">
  <p class="cover__mark">theHermeticum</p>
  <div><h1>{m['title']}</h1><p>{m['sub']}</p></div>
  <p class="cover__foot">{m['site']}</p>
</section>
<section class="toc"><h2>{m['toc']}</h2>{toc}</section>
{body}
<section class="note"><p>{m['note']}</p><p>{m['site']}</p></section>
</body></html>'''
    src = os.path.join(ROOT, f'_print-{lang}.html')
    open(src, 'w').write(html)

    outdir = os.path.join(ROOT, 'assets', 'pdf', 'private-7f3a91')
    os.makedirs(outdir, exist_ok=True)
    out = os.path.join(outdir, m['out'])
    subprocess.run([CHROME, '--headless', '--disable-gpu', '--no-pdf-header-footer',
                    f'--print-to-pdf={out}', '--virtual-time-budget=20000', 'file://' + src],
                   capture_output=True, timeout=300)
    ok = os.path.exists(out)
    print(f"{lang}: {m['out']} — {'OK ' + str(os.path.getsize(out) // 1024) + ' KB' if ok else 'BŁĄD'} ({len(chs)} tekstów)")
    os.remove(src)
    return out if ok else None

for l in ('pl', 'en'):
    build(l)
