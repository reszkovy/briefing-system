#!/usr/bin/env python3
"""Czytnik książki „Hermetyzm operacyjny" wewnątrz serwisu.

Składa rozdziały z istniejących sekcji Instrukcji i Alchemii operacyjnej
(źródło prawdy pozostaje w content/ i content-pl/), i generuje:
  /book/            — okładka + spis treści
  /book/<nn-slug>/  — rozdział z bocznym spisem, paskiem postępu i nawigacją
oraz lustro PL pod /pl/book/. Uruchamiać po build.py.
"""
import json, re, os, html as H

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://thehermeticum.com"

def _slice(s, a, b):
    i = s.index(a); j = s.index(b, i) + len(b); return s[i:j]

IDX = {'en': open(os.path.join(ROOT,'index.html')).read(),
       'pl': open(os.path.join(ROOT,'index-pl.html')).read()}
HDR = {k: _slice(v, '<header class="hdr" data-hdr>', '</header>') for k, v in IDX.items()}
FTR = {k: _slice(v, '<footer class="foot">', '</footer>') for k, v in IDX.items()}

def slugify(t):
    t = re.sub(r'<[^>]+>', '', H.unescape(t)).lower()
    for a,b in (('ą','a'),('ć','c'),('ę','e'),('ł','l'),('ń','n'),('ó','o'),('ś','s'),('ź','z'),('ż','z')):
        t = t.replace(a,b)
    return re.sub(r'[^a-z0-9]+','-',t).strip('-')

def split_sections(path):
    d = json.load(open(os.path.join(ROOT, path)))
    parts = re.split(r'<h2>(.*?)</h2>', d['body'])
    out = []
    for i in range(1, len(parts), 2):
        title = re.sub(r'<[^>]+>','', H.unescape(parts[i]))
        m = re.match(r'^(\d+)\.\s*(.*)$', title)
        if not m: continue
        out.append({'n': int(m.group(1)), 'title': m.group(2), 'html': parts[i+1]})
    return out

# przypisanie do filarów: (klucz, [numery Instrukcji], [numery Alchemii])
PILLARS = [('read',[1,5,6],[4]), ('align',[4,8,9,12,13],[1,3]),
           ('build',[2,14],[2,7,8,9,10,11]), ('transmute',[3,7,10,11,15],[5,6,12])]

L10N = {
 'en': dict(book='Operational Hermeticism', sub='A modern school of attention, energy and agency',
   parts={'read':'Read','align':'Align','build':'Build','transmute':'Transmute'},
   partdesc={'read':'Read yourself, people, systems and symbols.','align':'Align action with values, energy and body.',
             'build':'Turn recurring chaos into systems.','transmute':'Turn knowledge into practice and result.'},
   contents='Contents', chapter='Chapter', prev='Previous', nxt='Next', start='Start reading',
   resume='Resume where you left off', src_i='The Instruction', src_a='Operational Alchemy',
   home='The Hermeticum', of='of', intro='The whole school, arranged as a book: four parts, twelve chapters and an opening. The first three texts are open — the rest travels with the complete edition.',
   note='This book is a compilation of the site’s own formulations, assembled with AI research tools from published scholarship. Nothing here is presented as revelation; sources sit on every page they belong to.'),
 'pl': dict(book='Hermetyzm operacyjny', sub='Współczesna szkoła uwagi, energii i sprawczości',
   parts={'read':'Czytaj','align':'Ustaw','build':'Buduj','transmute':'Przekształcaj'},
   partdesc={'read':'Czytaj siebie, ludzi, systemy i symbole.','align':'Dopasuj działanie do wartości, energii i ciała.',
             'build':'Zamień powtarzalny chaos w systemy.','transmute':'Zamień wiedzę w praktykę i wynik.'},
   contents='Spis treści', chapter='Rozdział', prev='Poprzedni', nxt='Następny', start='Zacznij czytać',
   resume='Wróć tam, gdzie skończyłeś', src_i='Instrukcja', src_a='Alchemia operacyjna',
   home='The Hermeticum', of='z', intro='Cała szkoła ułożona jak książka: cztery części, dwanaście rozdziałów i otwarcie. Trzy pierwsze teksty są otwarte — resztę niesie pełne wydanie.',
   note='Ta książka jest kompilacją własnych sformułowań serwisu, składaną z pomocą narzędzi AI na podstawie opublikowanych badań. Nic nie jest tu podawane jako objawienie; źródła stoją przy stronach, do których należą.'),
}




# ── Trzy poziomy dostępu ──
OPEN_CHAPTERS = {0, 1, 2}          # otwarte bez konta i bez e-maila
PREVIEW_CHAPTERS = {4, 8}          # podgląd: sygnał, źródło, nasze odczytanie, pytanie
# reszta (3, 5, 6, 7, 9, 10, 11, 12) — zamknięta: tytuł, teza i spis części
PROTOCOL = {                        # rozdział → protokół w The Practice
 1: ('attention-reset', 'Attention Reset', 'Reset uwagi'),
 2: ('attention-reset', 'Energy Check', 'Sprawdzenie energii'),
 4: ('attention-reset', 'Pattern Recognition', 'Rozpoznanie wzoru'),
 8: ('pre-ai', 'Pre-AI Orientation', 'Orientacja przed AI'),
 12: ('attention-reset', 'Result Review', 'Przegląd wyniku'),
}
TIER = {
 'en': dict(open_lbl='Open chapter', prev_lbl='Preview',
   prev_note='This chapter is part of the complete edition. What follows is its opening signal, its source and the shape of the practice — enough to judge whether it is for you.',
   in_full='In the complete edition', parts_lbl='What the full chapter contains',
   locked_lbl='Complete edition', cta='Continue in the complete edition', next_lbl='Your next move',
   locked_note='This chapter is part of the complete edition. Below is what it covers — the argument itself travels with the book.',
   next_txt='Run the matching protocol in The Practice — five minutes, in your browser, nothing sent anywhere.',
   q_lbl='One question to carry'),
 'pl': dict(open_lbl='Rozdział otwarty', prev_lbl='Podgląd',
   prev_note='Ten rozdział należy do pełnego wydania. Poniżej jest jego sygnał otwarcia, źródło i kształt praktyki — tyle, żeby ocenić, czy jest dla Ciebie.',
   in_full='W pełnym wydaniu', parts_lbl='Co zawiera pełny rozdział',
   locked_lbl='Pełne wydanie', cta='Czytaj dalej w pełnym wydaniu', next_lbl='Twój następny ruch',
   locked_note='Ten rozdział należy do pełnego wydania. Poniżej jest to, co obejmuje — sam wywód podróżuje razem z książką.',
   next_txt='Uruchom odpowiadający protokół w The Practice — pięć minut, w przeglądarce, nic nie wychodzi na zewnątrz.',
   q_lbl='Jedno pytanie do zabrania'),
}

def _first_p(html):
    import re as _r
    m = _r.search(r'<p[^>]*>.*?</p>', html, _r.S)
    return m.group(0) if m else ''

def _fig(c):
    """Ilustracja rozdziału: najpierw po numerze (wspólna dla języków), potem po slugu."""
    for name in (f"{c['n']:02d}.jpg", c['slug'] + '.jpg'):
        if os.path.exists(os.path.join(ROOT, 'assets', 'book', name)):
            return (f'<figure class="book__fig"><img src="/assets/book/{name}" alt="" '
                    f'width="1400" height="700" loading="eager"></figure>')
    return ''

def _early(lang):
    """Pływająca belka early bird — zapis na wydanie w cenie założycielskiej."""
    L = lang == 'pl'
    return f'''
<aside class="eb" data-eb hidden>
  <div class="eb__in">
    <div class="eb__txt">
      <p class="eb__lbl">{'Early bird' if L else 'Early bird'}</p>
      <p class="eb__line">{'Zapisz się przed wydaniem — dostaniesz pełną książkę w cenie założycielskiej, niższej niż premierowa.' if L else 'Join before publication — you get the complete book at the founding price, below the launch price.'}</p>
    </div>
    <form class="eb__form" data-sub-form data-list="book-waitlist">
      <label class="sr-only" for="eb-mail">{'Twój e-mail' if L else 'Your e-mail'}</label>
      <input class="sub__input" id="eb-mail" type="email" required placeholder="{'ty@praca.pl' if L else 'you@work.com'}">
      <button class="btn" type="submit">{'Rezerwuję cenę' if L else 'Hold my price'}</button>
      <p class="sub__ok" hidden>{'Cena założycielska zarezerwowana. Napiszemy, gdy wydanie będzie gotowe.' if L else 'Founding price reserved. We’ll write when the edition is ready.'}</p>
    </form>
    <button class="eb__x" type="button" data-eb-close aria-label="{'Zamknij' if L else 'Dismiss'}">&times;</button>
  </div>
</aside>'''

def build_from_chapters(chs, lang, t, pre):
    """Czytnik z prawdziwych rozdziałów książki (book-pl/*.json)."""
    L = lang == 'pl'
    chs = sorted(chs, key=lambda c: c['n'])
    body_ch = [c for c in chs if c['n'] > 0]
    opening = next((c for c in chs if c['n'] == 0), None)
    seq = ([opening] if opening else []) + body_ch
    for i, c in enumerate(seq):
        c['pos'] = i + 1
    total = len(seq)
    PARTNAMES = t['parts']

    def toc(active=None):
        out = ''
        cur_part = None
        for c in seq:
            pk = c.get('part', 'read')
            if pk != cur_part:
                cur_part = pk
                lbl = t['book'] if pk == 'opening' else PARTNAMES.get(pk, pk)
                out += f'<p class="btoc__part">{lbl}</p><ol class="btoc__list">'
            cls = ' class="is-active"' if active == c['pos'] else ''
            num = '—' if c['n'] == 0 else f"{c['n']:02d}"
            out += f'<li><a href="{pre}/book/{c["slug"]}/"{cls}><i>{num}</i>{H.escape(c["title"])}</a></li>'
        return out + '</ol>'

    def index_html():
        out, cur_part, rows = '', None, ''
        order = []
        for c in seq:
            pk = c.get('part', 'read')
            if pk != cur_part:
                if cur_part is not None: order.append((cur_part, rows)); rows = ''
                cur_part = pk
            num = '—' if c['n'] == 0 else f"{c['n']:02d}"
            sub = H.escape(c.get('subtitle', '') or '')
            rows += (f'<li><a href="{pre}/book/{c["slug"]}/"><i>{num}</i><b>{H.escape(c["title"])}</b>'
                     f'<span class="bx__dots" aria-hidden="true"></span>'
                     f'<em>{(TIER[lang]["open_lbl"] if c["n"] in OPEN_CHAPTERS else (TIER[lang]["prev_lbl"] if c["n"] in PREVIEW_CHAPTERS else TIER[lang]["locked_lbl"]))}</em></a></li>')
        order.append((cur_part, rows))
        rom = ['I','II','III','IV','V']
        for i, (pk, rws) in enumerate(order):
            lbl = t['book'] if pk == 'opening' else PARTNAMES.get(pk, pk)
            desc = '' if pk == 'opening' else t['partdesc'].get(pk, '')
            out += (f'<section class="bx__part"><header class="bx__head">'
                    f'<span class="bx__roman">{rom[i] if i < len(rom) else ""}</span>'
                    f'<h2>{lbl}</h2><p>{desc}</p></header><ol class="bx__list">{rws}</ol></section>')
        return out

    def head(title, desc, url, extra=''):
        return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(title)} — {t["book"]}</title>
<meta name="description" content="{H.escape(desc)[:180]}">
<link rel="canonical" href="{SITE}{url}"><meta name="robots" content="index, follow">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=86"><script src="/assets/site.js?v=86" defer></script>
{extra}
</head><body class="is-book">'''

    outdir = os.path.join(ROOT, 'pl' if L else '', 'book')
    os.makedirs(outdir, exist_ok=True)
    book_ld = ('<meta property="og:type" content="book">'
    f'<meta property="og:title" content="{H.escape(t["book"])}">'
    f'<meta property="og:description" content="{H.escape(t["sub"])}">'
    f'<meta property="og:url" content="{SITE}{pre}/book/">'
    f'<meta property="og:image" content="{SITE}/assets/book/01.jpg">'
    '<meta name="twitter:card" content="summary_large_image">'
    '<script type="application/ld+json">' + json.dumps({
        "@context": "https://schema.org", "@type": "Book",
        "name": t['book'], "alternativeHeadline": t['sub'],
        "url": f"{SITE}{pre}/book/", "inLanguage": lang,
        "author": {"@type": "Organization", "name": "The Hermeticum"},
        "publisher": {"@type": "Organization", "name": "The Hermeticum", "url": SITE},
        "numberOfPages": 146 if not L else 142,
        "bookFormat": "https://schema.org/EBook",
        "image": f"{SITE}/assets/book/01.jpg",
        "hasPart": [{"@type": "Chapter", "name": c['title'],
                     "position": c['pos'], "url": f"{SITE}{pre}/book/{c['slug']}/"} for c in seq],
    }, ensure_ascii=False) + '</script>')
    cover = head(t['book'], t['sub'], f'{pre}/book/', book_ld) + HDR[lang] + f'''
<main class="bookcover"><div class="container bookcover__in">
  <p class="kicker">{t['home']}</p>
  <h1 class="bookcover__h1">{t['book']}</h1>
  <p class="bookcover__sub">{t['sub']}</p>
  <p class="bookcover__intro">{t['intro']}</p>
  <div class="hero__cta">
    <a class="btn" href="{pre}/book/{seq[0]['slug']}/">{t['start']}</a>
    <a class="hero__alt" href="#contents" data-book-resume hidden>{t['resume']}</a>
  </div>
  <div class="bx" id="contents">{index_html()}</div>
  <section class="tiers">
    <div class="tiers__grid">
      <div class="tier">
        <p class="tier__lbl">{'Otwarte' if L else 'Open'}</p>
        <p class="tier__d">{'Bez konta i bez e-maila: otwarcie, rozdział o uwadze, rozdział o energii, streszczenia wszystkich rozdziałów, bibliografia, słownik i wybrane praktyki.' if L else 'No account, no e-mail: the opening, the chapter on attention, the chapter on energy, summaries of every chapter, the bibliography, the glossary and selected practices.'}</p>
        <p><a class="hero__alt" href="{pre}/book/{seq[1]['slug'] if len(seq)>1 else seq[0]['slug']}/">{'Zacznij od rozdziału Uwaga' if L else 'Start with Attention'} &rarr;</a></p>
      </div>
      <div class="tier">
        <p class="tier__lbl">{'Za zapis' if L else 'For your e-mail'}</p>
        <p class="tier__d">{'Pakiet <b>Jasność przed delegacją</b>: esej wprowadzający, fragment rozdziału o technologii, Orientacja przed AI, siedmiodniowy eksperyment — w Markdownie i w wersji do druku.' if L else 'The <b>Clarity Before Delegation</b> pack: an introductory essay, an excerpt from the technology chapter, Pre-AI Orientation and a seven-day experiment — in Markdown and print-ready.'}</p>
        <p><a class="hero__alt" href="{pre}/#subscribe">{'Odbierz pakiet' if L else 'Get the pack'} &rarr;</a></p>
      </div>
      <div class="tier tier--full">
        <p class="tier__lbl">{'Pełne wydanie' if L else 'Complete edition'}</p>
        <p class="tier__d">{'Wszystkie dwanaście rozdziałów, pełne praktyki, granice i etyka każdej zasady, pytania integracyjne, powiązania między rozdziałami oraz Personal Operating Standard. PDF i EPUB, z przyszłymi aktualizacjami wydania.' if L else 'All twelve chapters, the full practices, the limits and ethics of every principle, integration questions, the links between chapters and the Personal Operating Standard. PDF and EPUB, including future updates of the edition.'}</p>
        <p class="tier__meta">{'Około 30 000 słów · 142 strony w składzie A5 · PDF i EPUB' if L else 'About 37,000 words · 146 pages set in A5 · PDF and EPUB'}</p>
        <form class="sub__form tier__form" data-sub-form data-list="book-waitlist">
          <label class="sub__label" for="book-wait">{'Zapisz się na wydanie' if L else 'Join the edition list'}</label>
          <div class="sub__row">
            <input class="sub__input" id="book-wait" type="email" required placeholder="{'ty@praca.pl' if L else 'you@work.com'}">
            <button class="btn sub__btn" type="submit">{'Zapisz mnie' if L else 'Notify me'}</button>
          </div>
          <p class="sub__note">{'Wydanie jest w przygotowaniu. Piszemy raz — gdy będzie gotowe, i z ceną założycielską dla zapisanych.' if L else 'The edition is in preparation. We write once — when it is ready, with a founding price for the list.'}</p>
          <p class="sub__ok" hidden>{'Jesteś na liście. Odezwiemy się, gdy wydanie będzie gotowe.' if L else 'You’re on the list. We’ll write when the edition is ready.'}</p>
        </form>
      </div>
    </div>
  </section>
  <section class="llmf">
    <div class="llmf__in">
      <p class="kicker">{'Narzędzie' if L else 'Tool'}</p>
      <h2 class="h2">{'Pliki dla Twojego modelu' if L else 'Files for your model'}</h2>
      <p class="llmf__d">{'Dwa pliki Markdown, które wklejasz swojemu modelowi. Nie streszczenia — narzędzia: mówią modelowi, jak ma pracować, czego nie wolno mu robić i kiedy ma przerwać. Bez konta i bez wysyłania czegokolwiek do nas.' if L else 'Two Markdown files you paste into your own model. Not summaries — tools: they tell the model how to work, what it must not do, and when to stop. No account, and nothing is sent to us.'}</p>
      <div class="llmf__grid">
        <div class="llmf__card">
          <p class="llmf__ck">{'Partner roboczy' if L else 'Working partner'}</p>
          <p class="llmf__cd">{'Kontrakt roli, dwanaście modułów i tryby sesji (/decyzja, /wzór, /tydzień, /przed-ai). Do pojedynczych rozmów, gdy masz konkretną sprawę na stole.' if L else 'The role contract, twelve modules and session modes (/decision, /pattern, /week, /before-ai). For single sessions, when you have something concrete on the table.'}</p>
          <a class="btn" href="/assets/downloads/{'hermetyzm-operacyjny-plik-roboczy.md' if L else 'operational-hermeticism-working-file.md'}" download>{'Pobierz plik roboczy' if L else 'Download the working file'}</a>
        </div>
        <div class="llmf__card">
          <p class="llmf__ck">{'Droga, dwanaście tygodni' if L else 'The Path, twelve weeks'}</p>
          <p class="llmf__cd">{'Program z przewodnikiem: jeden moduł na tydzień, obserwacja, pięciominutowa praktyka i Blok Stanu, który nosisz Ty, nie model. Trzy pierwsze tygodnie są diagnostyczne.' if L else 'A guided programme: one module a week, an observation, a five-minute practice and a State Block carried by you, not the model. The first three weeks are diagnostic.'}</p>
          <a class="btn" href="/assets/downloads/{'droga-modern-hermety.md' if L else 'the-modern-hermet-path.md'}" download>{'Pobierz Drogę' if L else 'Download the Path'}</a>
        </div>
      </div>
      <p class="llmf__meta">{'Za darmo · bez zapisu · bez konta · działa w ChatGPT, Claude, Gemini i modelach lokalnych' if L else 'Free · no sign-up · no account · works in ChatGPT, Claude, Gemini and local models'}</p>
    </div>
  </section>
  <p class="bookcover__note">{t['note']}</p>
</div></main>''' + FTR[lang] + '</body></html>'
    open(os.path.join(outdir, 'index.html'), 'w').write(cover)

    for i, c in enumerate(seq):
        prev_c, next_c = (seq[i-1] if i else None), (seq[i+1] if i < total-1 else None)
        tr = TIER[lang]
        is_open = c['n'] in OPEN_CHAPTERS
        secs = ''
        if is_open:
            for s in c['sections']:
                lab = s.get('label', '')
                secs += (f'<section class="bsec"><p class="bsec__lbl">{H.escape(lab)}</p>{s["html"]}</section>'
                         if lab and s.get('key') != 'essay' else s['html'])
            pr = PROTOCOL.get(c['n'])
            if pr:
                pname = pr[2] if L else pr[1]
                purl = f"{pre}/practice/today/"
                secs += (f'<section class="bnext"><p class="bnext__lbl">{tr["next_lbl"]}</p>'
                         f'<p class="bnext__t"><a href="{purl}">{H.escape(pname)}</a></p>'
                         f'<p class="bnext__s">{tr["next_txt"]}</p></section>')
        elif c['n'] not in PREVIEW_CHAPTERS:
            parts = ''.join(f'<li>{H.escape(x.get("label",""))}</li>' for x in c['sections'] if x.get('label'))
            secs = (f'<section class="bgate bgate--locked"><p class="bgate__lbl">{tr["locked_lbl"]}</p>'
                    f'<p class="bgate__note">{tr["locked_note"]}</p>'
                    f'<p class="bgate__parts">{tr["parts_lbl"]}</p><ul class="bgate__list">{parts}</ul>'
                    f'<p><a class="btn" href="{pre}/book/#contents">{tr["cta"]}</a></p></section>')
        else:
            by = {x.get('key'): x for x in c['sections']}
            for k in ('signal', 'source', 'interpretation'):
                if k in by:
                    lab = by[k].get('label', '')
                    frag = by[k]['html'] if k == 'signal' else _first_p(by[k]['html'])
                    secs += f'<section class="bsec"><p class="bsec__lbl">{H.escape(lab)}</p>{frag}</section>'
            q = ''
            if 'ethics' in by:
                q = _first_p(by['ethics']['html'])
            if q:
                secs += f'<section class="bsec"><p class="bsec__lbl">{tr["q_lbl"]}</p>{q}</section>'
            parts = ''.join(f'<li>{H.escape(x.get("label",""))}</li>' for x in c['sections'] if x.get('label'))
            secs += (f'<section class="bgate"><p class="bgate__lbl">{tr["in_full"]}</p>'
                     f'<p class="bgate__note">{tr["prev_note"]}</p>'
                     f'<p class="bgate__parts">{tr["parts_lbl"]}</p><ul class="bgate__list">{parts}</ul>'
                     f'<p><a class="btn" href="{pre}/book/">{tr["cta"]}</a></p></section>')
        closing = f'<p class="bclose">{H.escape(c["closing_line"])}</p>' if c.get('closing_line') else ''
        nav = ''
        nav += (f'<a class="bnav__prev" href="{pre}/book/{prev_c["slug"]}/"><span>{t["prev"]}</span><b>{H.escape(prev_c["title"])}</b></a>'
                if prev_c else '<span></span>')
        if next_c:
            nav += f'<a class="bnav__next" href="{pre}/book/{next_c["slug"]}/"><span>{t["nxt"]}</span><b>{H.escape(next_c["title"])}</b></a>'
        pct = round(c['pos']/total*100)
        num_lbl = t['book'] if c['n'] == 0 else f"{t['chapter']} {c['n']:02d} {t['of']} {len(body_ch)}"
        d = os.path.join(outdir, c['slug']); os.makedirs(d, exist_ok=True)
        art = (f"{SITE}/assets/book/{c['n']:02d}.jpg"
               if os.path.exists(os.path.join(ROOT, 'assets', 'book', f"{c['n']:02d}.jpg"))
               else f"{SITE}/assets/og.png")
        ch_ld = ('<meta property="og:type" content="article">'
            f'<meta property="og:title" content="{H.escape(c["title"])}">'
            f'<meta property="og:description" content="{H.escape((c.get("subtitle") or "")[:180])}">'
            f'<meta property="og:url" content="{SITE}{pre}/book/{c["slug"]}/">'
            f'<meta property="og:image" content="{art}">'
            '<meta name="twitter:card" content="summary_large_image">'
            '<script type="application/ld+json">' + json.dumps({
                "@context": "https://schema.org", "@type": "Chapter",
                "name": c['title'], "headline": c['title'],
                "description": (c.get('subtitle') or '')[:300],
                "position": c['pos'], "inLanguage": lang,
                "url": f"{SITE}{pre}/book/{c['slug']}/", "image": art,
                "isPartOf": {"@type": "Book", "name": t['book'], "url": f"{SITE}{pre}/book/"},
                "author": {"@type": "Organization", "name": "The Hermeticum"},
                "publisher": {"@type": "Organization", "name": "The Hermeticum", "url": SITE},
                "isAccessibleForFree": c['n'] in OPEN_CHAPTERS,
            }, ensure_ascii=False) + '</script>'
            '<script type="application/ld+json">' + json.dumps({
                "@context": "https://schema.org", "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "The Hermeticum", "item": f"{SITE}{pre}/"},
                    {"@type": "ListItem", "position": 2, "name": t['book'], "item": f"{SITE}{pre}/book/"},
                    {"@type": "ListItem", "position": 3, "name": c['title'],
                     "item": f"{SITE}{pre}/book/{c['slug']}/"}]}, ensure_ascii=False) + '</script>')
        page = head(c['title'], c.get('subtitle',''), f'{pre}/book/{c["slug"]}/', ch_ld) + HDR[lang] + f'''
<div class="bprogress" aria-hidden="true"><span style="width:{pct}%"></span></div>
<main class="book" data-book-chapter="{c['pos']}" data-book-url="{pre}/book/{c['slug']}/">
  <div class="container book__grid">
    <aside class="book__side"><p class="btoc__head">{t['contents']}</p>
      <nav class="btoc">{toc(c['pos'])}</nav></aside>
    <article class="book__body">
      <p class="book__meta"><a href="{pre}/book/">{t['book']}</a> &middot; {num_lbl} &middot; <em class="book__tier">{TIER[lang]['open_lbl'] if c['n'] in OPEN_CHAPTERS else (TIER[lang]['prev_lbl'] if c['n'] in PREVIEW_CHAPTERS else TIER[lang]['locked_lbl'])}</em></p>
      <h1 class="book__h1">{H.escape(c['title'])}</h1>
      {_fig(c)}
      {f'<p class="book__sub">{H.escape(c["subtitle"])}</p>' if c.get('subtitle') else ''}
      {secs}
      {closing}
      <nav class="bnav">{nav}</nav>
    </article>
  </div>
</main>''' + _early(lang) + FTR[lang] + '</body></html>'
        open(os.path.join(d, 'index.html'), 'w').write(page)
    print(f'książka {lang}: {total} pozycji (rozdziałów: {len(body_ch)}) → {pre}/book/')
    return [f"{pre}/book/"] + [f"{pre}/book/{c['slug']}/" for c in seq]

def build_lang(lang):
    L = lang == 'pl'
    t = L10N[lang]
    pre = '/pl' if L else ''
    import glob
    book_dir = os.path.join(ROOT, 'book-pl' if L else 'book-en')
    real = []
    if os.path.isdir(book_dir):
        for f in sorted(glob.glob(os.path.join(book_dir, '*.json'))):
            try: real.append(json.load(open(f)))
            except Exception as e: print('POMINIĘTE (JSON):', f, e)
    if real:
        return build_from_chapters(real, lang, t, pre)
    ins = {s['n']: s for s in split_sections('content-pl/guide__instruction.json' if L else 'content/guide-instruction.json')}
    alc = {s['n']: s for s in split_sections('content-pl/guide__operational-alchemy.json' if L else 'content/guide-operational-alchemy.json')}

    chapters = []
    for key, iidx, aidx in PILLARS:
        for n in iidx:
            if n in ins: chapters.append(dict(part=key, src='i', **ins[n]))
        for n in aidx:
            if n in alc: chapters.append(dict(part=key, src='a', **alc[n]))
    for i, c in enumerate(chapters, 1):
        c['num'] = i
        c['slug'] = f"{i:02d}-{slugify(c['title'])}"

    def toc_html(active=None):
        out = ''
        for key, _, _ in PILLARS:
            out += f'<p class="btoc__part">{t["parts"][key]}</p><ol class="btoc__list">'
            for c in chapters:
                if c['part'] != key: continue
                cls = ' class="is-active"' if active == c['num'] else ''
                out += f'<li><a href="{pre}/book/{c["slug"]}/"{cls}><i>{c["num"]:02d}</i>{H.escape(c["title"])}</a></li>'
            out += '</ol>'
        return out

    def index_html():
        out = ''
        for pi, (key, _, _) in enumerate(PILLARS, 1):
            rows = ''
            for c in chapters:
                if c['part'] != key: continue
                tag = t['src_i'] if c['src'] == 'i' else t['src_a']
                rows += (f'<li><a href="{pre}/book/{c["slug"]}/">'
                         f'<i>{c["num"]:02d}</i><b>{H.escape(c["title"])}</b>'
                         f'<span class="bx__dots" aria-hidden="true"></span>'
                         f'<em>{tag}</em></a></li>')
            out += (f'<section class="bx__part"><header class="bx__head">'
                    f'<span class="bx__roman">{"I II III IV".split()[pi-1]}</span>'
                    f'<h2>{t["parts"][key]}</h2><p>{t["partdesc"][key]}</p></header>'
                    f'<ol class="bx__list">{rows}</ol></section>')
        return out

    head = lambda title, desc, url, extra='': f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(title)} — {t["book"]}</title>
<meta name="description" content="{H.escape(desc)}">
<link rel="canonical" href="{SITE}{url}">
<meta name="robots" content="index, follow">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=86">
<script src="/assets/site.js?v=86" defer></script>
{extra}
</head>
<body class="is-book">'''

    outdir = os.path.join(ROOT, 'pl' if L else '', 'book')
    os.makedirs(outdir, exist_ok=True)

    # ── okładka ──
    cover = head(t['book'], t['sub'], f'{pre}/book/') + HDR[lang] + f'''
<main class="bookcover">
  <div class="container bookcover__in">
    <p class="kicker">{t['home']}</p>
    <h1 class="bookcover__h1">{t['book']}</h1>
    <p class="bookcover__sub">{t['sub']}</p>
    <p class="bookcover__intro">{t['intro']}</p>
    <div class="hero__cta">
      <a class="btn" href="{pre}/book/{chapters[0]['slug']}/">{t['start']}</a>
      <a class="hero__alt" href="#contents" data-book-resume hidden>{t['resume']}</a>
    </div>
    <div class="bx" id="contents" aria-label="{t['contents']}">{index_html()}</div>
    <p class="bookcover__note">{t['note']}</p>
  </div>
</main>''' + FTR[lang] + '</body></html>'
    open(os.path.join(outdir, 'index.html'), 'w').write(cover)

    # ── rozdziały ──
    total = len(chapters)
    for i, c in enumerate(chapters):
        prev_c = chapters[i-1] if i else None
        next_c = chapters[i+1] if i < total-1 else None
        src = t['src_i'] if c['src'] == 'i' else t['src_a']
        srcurl = f"{pre}/guide/instruction/" if c['src']=='i' else f"{pre}/guide/operational-alchemy/"
        pct = round(c['num']/total*100)
        nav = ''
        if prev_c:
            nav += f'<a class="bnav__prev" href="{pre}/book/{prev_c["slug"]}/"><span>{t["prev"]}</span><b>{H.escape(prev_c["title"])}</b></a>'
        else:
            nav += '<span></span>'
        if next_c:
            nav += f'<a class="bnav__next" href="{pre}/book/{next_c["slug"]}/"><span>{t["nxt"]}</span><b>{H.escape(next_c["title"])}</b></a>'
        d = os.path.join(outdir, c['slug']); os.makedirs(d, exist_ok=True)
        page = head(c['title'], re.sub(r'<[^>]+>','', c['html'])[:180], f'{pre}/book/{c["slug"]}/',
                    f'<meta name="book-chapter" content="{c["num"]}">') + HDR[lang] + f'''
<div class="bprogress" aria-hidden="true"><span style="width:{pct}%"></span></div>
<main class="book" data-book-chapter="{c['num']}" data-book-url="{pre}/book/{c['slug']}/">
  <div class="container book__grid">
    <aside class="book__side">
      <p class="btoc__head">{t['contents']}</p>
      <nav class="btoc" aria-label="{t['contents']}">{toc_html(c['num'])}</nav>
    </aside>
    <article class="book__body">
      <p class="book__meta"><a href="{pre}/book/">{t['book']}</a> &middot; {t['parts'][c['part']]} &middot; {t['chapter']} {c['num']:02d} {t['of']} {total}</p>
      <h1 class="book__h1">{H.escape(c['title'])}</h1>
      {_fig(c)}
      {c['html']}
      <p class="book__src">{"Źródło" if L else "Source"}: <a href="{srcurl}">{src}</a></p>
      <nav class="bnav">{nav}</nav>
    </article>
  </div>
</main>''' + _early(lang) + FTR[lang] + '</body></html>'
        open(os.path.join(d, 'index.html'), 'w').write(page)
    print(f'książka {lang}: {total} rozdziałów → {pre}/book/')
    return [f"{pre}/book/"] + [f"{pre}/book/{c['slug']}/" for c in chapters]

urls = build_lang('en') + build_lang('pl')
open(os.path.join(ROOT, '.book-urls'), 'w').write("\n".join(urls))
print('adresy zapisane do .book-urls (do sitemapy)')
