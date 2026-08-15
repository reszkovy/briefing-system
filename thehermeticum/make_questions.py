#!/usr/bin/env python3
"""Strona pytań i odpowiedzi — treść czytana Z site.js (te same pary, co asystent).

Powód istnienia: odpowiedzi asystenta żyją tylko w JavaScripcie, więc nie widzi
ich ani wyszukiwarka, ani model odpowiadający na pytania. Ta strona wystawia je
w HTML razem ze schematem FAQPage. Jedno źródło prawdy: jeśli ktoś zmieni parę
w site.js, strona zmieni się przy najbliższym buildzie.
"""
import os, re, json, html as H

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://thehermeticum.com"
V = "102"
JS = open(os.path.join(ROOT, 'assets', 'site.js')).read()
IDX = open(os.path.join(ROOT, 'index.html')).read()
IDXPL = open(os.path.join(ROOT, 'index-pl.html')).read()


def _slice(src, start, end):
    i = src.find(start); j = src.find(end, i)
    return src[i:j + len(end)] if i >= 0 else ''


HDR = {'en': _slice(IDX, '<header class="hdr"', '</header>'),
       'pl': _slice(IDXPL, '<header class="hdr"', '</header>')}
FTR = {'en': _slice(IDX, '<footer class="foot">', '</footer>'),
       'pl': _slice(IDXPL, '<footer class="foot">', '</footer>')}


def pary(js, po_polsku):
    """Wyciąga listę [pytanie, odpowiedź] z bloku qa:[...] w site.js."""
    bloki = re.findall(r'qa:\s*\[(.*?)\n    \]', js, re.S)
    if len(bloki) < 2:
        raise SystemExit('BUILD FAIL: nie znalazłem dwóch bloków qa w site.js (jest %d)' % len(bloki))
    blok = bloki[0] if po_polsku else bloki[1]
    out = []
    for m in re.finditer(r"\['((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'\]", blok):
        q = m.group(1).replace("\\'", "'")
        a = m.group(2).replace("\\'", "'")
        out.append((q, a))
    if len(out) < 6:
        raise SystemExit('BUILD FAIL: za mało par pytanie/odpowiedź (%d)' % len(out))
    return out


T = {
 'pl': dict(url='/pl/pytania/', alt='/questions/', kicker='Pytania',
            h1='Pytania i odpowiedzi',
            title='Pytania i odpowiedzi — The Hermeticum',
            desc='Czym jest The Hermeticum, co dostajesz w cotygodniowym liście, gdzie trafiają Twoje dane, co jest darmowe i od czego zacząć.',
            lead='To samo, co odpowiada asystent na dole ekranu — tylko w jednym miejscu i do przeczytania bez klikania. Jeśli brakuje tu Twojego pytania, odpowiedź na list dochodzi do redakcji.',
            cta='Zapisz się na list', cta_href='/pl/subscribe/',
            more='Metoda i pełna bibliografia', more_href='/pl/about/method/'),
 'en': dict(url='/questions/', alt='/pl/pytania/', kicker='Questions',
            h1='Questions and answers',
            title='Questions and answers — The Hermeticum',
            desc='What The Hermeticum is, what lands in your inbox each week, where your data goes, what is free and where to start.',
            lead='The same answers the assistant gives at the bottom of the screen — in one place, readable without clicking. If your question is missing, replies to the letter reach the editors.',
            cta='Join the letter', cta_href='/subscribe/',
            more='Method and full bibliography', more_href='/about/method/'),
}


def build(lang):
    t = T[lang]
    qa = pary(JS, lang == 'pl')
    ld = json.dumps({
        "@context": "https://schema.org", "@type": "FAQPage",
        "inLanguage": lang, "url": SITE + t['url'],
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in qa],
    }, ensure_ascii=False)
    breadcrumb = json.dumps({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "The Hermeticum",
             "item": SITE + ('/pl/' if lang == 'pl' else '/')},
            {"@type": "ListItem", "position": 2, "name": t['h1'], "item": SITE + t['url']}]},
        ensure_ascii=False)

    items = ''.join(
        '<div class="qa__item"><h2 class="qa__q"><i>%02d</i>%s</h2><p class="qa__a">%s</p></div>'
        % (i, H.escape(q), H.escape(a)) for i, (q, a) in enumerate(qa, 1))

    html = f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(t['title'])}</title>
<meta name="description" content="{H.escape(t['desc'])}">
<link rel="canonical" href="{SITE}{t['url']}">
<link rel="alternate" hreflang="{'pl' if lang == 'pl' else 'en'}" href="{SITE}{t['url']}">
<link rel="alternate" hreflang="{'en' if lang == 'pl' else 'pl'}" href="{SITE}{t['alt']}">
<link rel="alternate" hreflang="x-default" href="{SITE}/questions/">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="{H.escape(t['title'])}">
<meta property="og:description" content="{H.escape(t['desc'])}">
<meta property="og:url" content="{SITE}{t['url']}">
<meta property="og:image" content="{SITE}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v={V}"><script src="/assets/site.js?v={V}" defer></script>
<script type="application/ld+json">{ld}</script>
<script type="application/ld+json">{breadcrumb}</script>
</head><body>
{HDR[lang]}
<main>
  <section class="qa">
    <div class="container qa__in">
      <p class="kicker">{t['kicker']}</p>
      <h1 class="qa__h1">{t['h1']}</h1>
      <p class="lead">{t['lead']}</p>
      {items}
      <p class="qa__foot"><a class="btn" href="{t['cta_href']}">{t['cta']}</a>
        <a class="hero__alt" href="{t['more_href']}">{t['more']} &rarr;</a></p>
    </div>
  </section>
</main>
{FTR[lang]}
</body></html>'''

    out = os.path.join(ROOT, t['url'].strip('/'))
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w').write(html)
    return len(qa)


n_pl = build('pl')
n_en = build('en')
print('pytania: /questions/ (%d) i /pl/pytania/ (%d) — FAQPage + BreadcrumbList' % (n_en, n_pl))
