#!/usr/bin/env python3
"""Generator podstron The Hermeticum.

Źródło prawdy dla headera/stopki: index.html (build wycina je stamtąd, więc zmiana
nawigacji w index automatycznie propaguje się na podstrony po ponownym uruchomieniu).
Treść stron: PAGES niżej — kondensacja dossier z research/ (INDEX.md mapuje pokrycie).
Uruchomienie: python3 build.py  (nadpisuje katalogi podstron w miejscu)
"""
import os, json, html as H

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://thehermeticum.com"

idx = open(os.path.join(ROOT, 'index.html')).read()
def _slice(s, a, b):
    i = s.index(a); j = s.index(b, i) + len(b); return s[i:j]
HEADER = _slice(idx, '<header class="hdr" data-hdr>', '</header>')
FOOTER = _slice(idx, '<footer class="foot">', '</footer>')

CTA = '''
  <aside class="band">
    <div class="container band__in">
      <p><b>As Above</b> — one letter a week walks the whole path. Free, cited, no fortune-telling.</p>
      <a class="btn" href="/#subscribe">Subscribe</a>
    </div>
  </aside>'''

def crumbs_ld(trail):
    items = [{"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(trail)]
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}

def faq_ld(faq):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}

# grafiki kontekstowe (styl ilustracji z home); klucz = path strony
IMGS = {
    "start-here": "art-doorway.jpg",
    "path/01-what-is-hermeticism": "art-four-masks.jpg",
    "path/02-who-was-hermes-trismegistus": "art-ibis-scribe.jpg",
    "path/03-alexandria": "art-lighthouse.jpg",
    "texts/corpus-hermeticum": "wing-texts.jpg",
    "texts/corpus-hermeticum/poimandres": "art-vision.jpg",
    "texts/emerald-tablet": "art-tablet.jpg",
    "texts/asclepius": "art-temple.jpg",
    "texts/kybalion": "art-typewriter.jpg",
    "figures/hermes-trismegistus": "art-ibis-scribe.jpg",
    "ideas/as-above-so-below": "wing-ideas.jpg",
    "ideas/nous": "art-krater.jpg",
    "letters": "art-letters.jpg",
    "path": "art-path.jpg",
    "texts/definitions-of-hermes": "art-definitions.jpg",
    "texts/stobaean-fragments": "art-kore.jpg",
    "texts/nag-hammadi-hermetica": "art-jar.jpg",
    "texts/picatrix": "art-astrolabe.jpg",
    "texts/musaeum-hermeticum": "art-retort.jpg",
    "figures/zosimos-of-panopolis": "art-zosimos.jpg",
    "figures/marsilio-ficino": "art-ficino.jpg",
    "figures/pico-della-mirandola": "art-doors.jpg",
    "figures/lodovico-lazzarelli": "art-rider.jpg",
    "figures/giordano-bruno": "art-infinite.jpg",
    "figures/john-dee": "art-mirror.jpg",
    "figures/frances-yates": "art-memory-theatre.jpg",
    "ideas/gnosis": "art-inner-sun.jpg",
    "ideas/palingenesia": "art-rebirth.jpg",
    "ideas/correspondences": "art-threads.jpg",
    "ideas/prisca-theologia": "art-torch.jpg",
    "ideas/theurgy": "art-ladder.jpg",
    "ideas/the-ogdoad-and-ennead": "art-spheres.jpg",
}

PORTRAITS = {
    "figures/hermes-trismegistus": "portrait-hermes.jpg",
    "figures/thoth": "portrait-thoth.jpg",
    "figures/zosimos-of-panopolis": "portrait-zosimos.jpg",
    "figures/marsilio-ficino": "portrait-ficino.jpg",
    "figures/pico-della-mirandola": "portrait-pico.jpg",
    "figures/lodovico-lazzarelli": "portrait-lazzarelli.jpg",
    "figures/giordano-bruno": "portrait-bruno.jpg",
    "figures/john-dee": "portrait-dee.jpg",
    "figures/frances-yates": "portrait-yates.jpg",
}

def render(p):
    trail = [("Home", "/")] + p.get("trail", []) + [(p["crumb"], p["url"])]
    lds = [crumbs_ld(trail)] + p.get("ld", [])
    if p.get("faq"): lds.append(faq_ld(p["faq"]))
    ld_tags = "\n".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in lds)
    crumbs = " <span>/</span> ".join(f'<a href="{u}">{H.escape(n)}</a>' for n, u in trail[:-1]) + f' <span>/</span> <em>{H.escape(p["crumb"])}</em>'
    img = IMGS.get(p["path"])
    og_img = f"{SITE}/assets/{img}" if img else f"{SITE}/assets/og.png"
    preload = f'<link rel="preload" as="image" href="/assets/{img}" fetchpriority="high">' if img else ""
    port = PORTRAITS.get(p["path"])
    portrait = (f'<figure class="art__portrait"><img src="/assets/{port}" alt="Portrait: {H.escape(p["crumb"])}" '
                f'width="400" height="400" loading="lazy"><figcaption>An imagined likeness, after the historical sources</figcaption></figure>') if port else ""
    fig = f'<figure class="art__fig"><img src="/assets/{img}" alt="" width="1600" height="800" loading="eager" fetchpriority="high"></figure>' if img else ""
    tldr = f'<div class="tldr"><span>TL;DR</span><p>{p["tldr"]}</p></div>' if p.get("tldr") else ""
    facts = ""
    if p.get("facts"):
        rows = "".join(f"<tr><th>{k}</th><td>{v}</td></tr>" for k, v in p["facts"])
        facts = f'<table class="facts"><caption>Key facts</caption>{rows}</table>'
    faq_html = ""
    if p.get("faq"):
        items = "".join(f'<details class="faq__item"><summary>{q}</summary><p>{a}</p></details>' for q, a in p["faq"])
        faq_html = f'<section class="art__faq"><h2>Fair questions</h2>{items}</section>'
    src = ""
    if p.get("sources"):
        li = "".join(f"<li>{s}</li>" for s in p["sources"])
        src = f'<section class="art__src"><h2>Sources &amp; further reading</h2><ul>{li}</ul></section>'
    media = ""
    if p.get("media"):
        import re as _re
        embeds, links = [], []
        for t, u, m in p["media"]:
            yt = _re.search(r'youtube\.com/watch\?v=([\w-]+)', u)
            if yt:
                vid = yt.group(1)
                embeds.append(
                    f'<figure class="yt" data-yt="{vid}" role="button" tabindex="0" aria-label="Play: {H.escape(t)}">'
                    f'<img src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="" loading="lazy">'
                    f'<span class="yt__play" aria-hidden="true"></span>'
                    f'<figcaption><b>{t}</b><span>{m}</span></figcaption></figure>')
            else:
                links.append(f'<li><a href="{u}" rel="noopener">{t}</a><span>{m}</span></li>')
        emb_html = f'<div class="media__grid">{"".join(embeds)}</div>' if embeds else ""
        li_html = f'<ul>{"".join(links)}</ul>' if links else ""
        note = f'<p class="media__note">{p["media_note"]}</p>' if p.get("media_note") else ""
        media = f'<section class="art__media"><h2>Listen &amp; watch</h2>{emb_html}{li_html}{note}</section>'
    nxt = f'<p class="art__next">{p["next"]}</p>' if p.get("next") else ""
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(p["title"])} — The Hermeticum</title>
<meta name="description" content="{H.escape(p["desc"])}">
<link rel="canonical" href="{SITE}{p["url"]}">
<meta property="og:title" content="{H.escape(p["title"])}">
<meta property="og:description" content="{H.escape(p["desc"])}">
<meta property="og:image" content="{og_img}">
<meta property="og:type" content="article">
<meta property="og:url" content="{SITE}{p["url"]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{og_img}">
<meta property="og:locale" content="en_US">
{preload}
<meta name="twitter:title" content="{H.escape(p["title"])}">
<meta name="twitter:description" content="{H.escape(p["desc"])}">
<meta name="robots" content="index, follow">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="The Hermeticum" href="/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=9">
<script src="/assets/site.js?v=9" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-P0HHD2HX20"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}
gtag('consent','default',{{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'}});
gtag('js',new Date());gtag('config','G-P0HHD2HX20',{{anonymize_ip:true}});
</script>
{ld_tags}
</head>
<body>
{HEADER}
<main>
  <article class="art">
    <div class="container art__in">
      <nav class="crumbs" aria-label="Breadcrumb">{crumbs}</nav>
      <p class="kicker">{p["kicker"]}</p>
      <h1 class="art__h1">{p["h1"]}</h1>
      {fig}
      {tldr}
      {portrait}
      {p["body"]}
      {facts}
      {faq_html}
      {media}
      {src}
      {nxt}
    </div>
  </article>
{CTA}
</main>
{FOOTER}
</body>
</html>'''

# ── CSS podstron (dopisywany raz do site.css) ──
ART_CSS = '''
  /* ── PODSTRONY ── */
  .art{padding-block:var(--sp7) var(--sp8)}
  .art__in{max-width:46rem}
  .crumbs{font-family:var(--font-ui);font-size:.68rem;letter-spacing:.06em;color:var(--ink-muted);margin-bottom:var(--sp5)}
  .crumbs a{color:inherit;text-decoration:none}
  .crumbs a:hover{color:var(--vermilion)}
  .crumbs span{opacity:.4;margin-inline:.3em}
  .crumbs em{font-style:normal;color:var(--ink)}
  .art__h1{margin:0 0 var(--sp5);font-family:var(--font-display);font-weight:500;font-size:clamp(2rem,5vw,3.2rem);line-height:1.08;letter-spacing:.005em}
  .art__fig{margin:0 0 var(--sp6);border:1px solid var(--line-soft)}
  .art__fig img{width:100%;height:auto;max-height:17rem;object-fit:cover;object-position:center 35%;display:block}
  .tldr{border:1px solid var(--line-soft);border-left:3px solid var(--gold-bright);background:var(--panel);padding:var(--sp4) var(--sp5);margin-bottom:var(--sp6)}
  .tldr span{display:block;font-family:var(--font-ui);font-size:.6rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:.5em}
  .tldr p{margin:0;font-size:1.04rem}
  .art p{font-size:1.06rem;line-height:1.72}
  .art h2{margin:var(--sp6) 0 var(--sp3);font-family:var(--font-body);font-weight:600;font-size:1.4rem}
  .art blockquote{margin:var(--sp5) 0;padding:var(--sp3) var(--sp5);border-left:2px solid var(--gold-bright);font-style:italic;color:var(--ink-muted)}
  .art a{color:var(--vermilion)}
  .facts{width:100%;border-collapse:collapse;margin:var(--sp6) 0;font-size:.95rem}
  .facts caption{text-align:left;font-family:var(--font-ui);font-size:.6rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);padding-bottom:.7em}
  .facts th{text-align:left;font-family:var(--font-ui);font-weight:500;font-size:.78rem;color:var(--ink-muted);padding:.55em .8em .55em 0;vertical-align:top;white-space:nowrap;border-bottom:1px solid var(--line-soft);width:11rem}
  .facts td{padding:.55em 0;border-bottom:1px solid var(--line-soft)}
  .art__faq h2,.art__src h2{font-family:var(--font-body)}
  .art__src ul{padding-left:1.2em}
  .art__src li{margin-bottom:.5em;font-size:.95rem;color:var(--ink-muted)}
  .art__next{margin-top:var(--sp6);padding-top:var(--sp5);border-top:1px solid var(--line-soft);font-size:1.02rem}
  .band{background:var(--ink);color:#f6ead6;padding-block:var(--sp5)}
  .band__in{display:flex;align-items:center;justify-content:space-between;gap:var(--sp5);flex-wrap:wrap}
  .band p{margin:0;font-size:1rem}
  .band b{color:var(--gold-bright);font-weight:600}
  .hub{list-style:none;margin:var(--sp5) 0 0;padding:0;display:grid;gap:var(--sp3)}
  .hub li{border:1px solid var(--line-soft);border-left:3px solid var(--gold-bright);background:var(--panel)}
  .hub a,.hub .hub__soon{display:block;padding:var(--sp4) var(--sp5);text-decoration:none;color:inherit}
  .hub b{display:block;font-weight:600;font-size:1.08rem;font-family:var(--font-body)}
  .hub span{display:block;font-size:.92rem;color:var(--ink-muted);font-style:italic;margin-top:.2em}
  .hub a:hover b{color:var(--vermilion)}
  .hub .hub__soon{opacity:.55}
  .hub .hub__soon b::after{content:' \\B7';color:var(--gold)}
'''
css_path = os.path.join(ROOT, 'assets/site.css')
css = open(css_path).read()
if '── PODSTRONY ──' not in css:
    open(css_path, 'a').write(ART_CSS)

BOOK = lambda n: {"@context": "https://schema.org", "@type": "Book", "name": n}
PERSON = lambda n: {"@context": "https://schema.org", "@type": "Person", "name": n}
TERM = lambda n, d: {"@context": "https://schema.org", "@type": "DefinedTerm", "name": n, "description": d}
ART = lambda t, d: {"@context": "https://schema.org", "@type": "Article", "headline": t, "description": d, "datePublished": "2026-08-14", "dateModified": "2026-08-14", "author": {"@type": "Organization", "name": "The Hermeticum"}, "publisher": {"@type": "Organization", "name": "The Hermeticum", "url": SITE}}

PAGES = []
def page(path, **kw):
    kw["url"] = "/" + path.strip("/") + "/"
    kw["path"] = path
    PAGES.append(kw)

# ═══ START HERE ═══
page("start-here",
  crumb="Start Here", kicker="Start here", title="Start Here — a clear path into Hermeticism",
  desc="A structured, honest introduction to the Hermetic tradition: what it is, what it isn't, and a twelve-step path from zero to reading the sources.",
  h1="You&rsquo;ve heard the name.<br>Here&rsquo;s the real story.",
  tldr="Hermeticism is a family of ancient Greek-Egyptian texts and the two thousand years of thinking they set in motion. Most of what the internet says about it is wrong in interesting ways. This site walks you from zero to the sources — one short step at a time.",
  ld=[ART("Start Here — a clear path into Hermeticism", "A structured introduction to the Hermetic tradition.")],
  body='''
<p>Somewhere between a TikTok about &ldquo;manifestation&rdquo; and a PhD seminar in Amsterdam sits one of the strangest bodies of writing in Western history: dialogues composed in Roman Egypt under the name of <a href="/figures/hermes-trismegistus/">Hermes Trismegistus</a> — a figure who never existed, and whose books changed the world anyway.</p>
<p>They helped ignite the Renaissance. They shaped how early scientists imagined nature. They gave modern occultism most of its furniture, and pop culture its favourite phrase: <a href="/ideas/as-above-so-below/">as above, so below</a> — which, we should warn you now, doesn&rsquo;t come from where you think.</p>
<h2>How this site works</h2>
<p>One rule: <strong>serious history, real sources, no fortune-telling.</strong> Every claim carries a citation. Where scholars disagree, we name both sides. Where a beloved story is a myth, we say so — and tell you the true story, which is usually better.</p>
<p>The spine of the site is <a href="/path/">The Path</a>: twelve short steps, each readable in about fifteen minutes, from &ldquo;what even is this?&rdquo; to reading the ancient texts yourself in good translations. Around it grow three wings: <a href="/texts/">the Texts</a>, <a href="/figures/">the Figures</a> and <a href="/ideas/">the Ideas</a>.</p>
<h2>Where to begin</h2>
<p>Begin at step one. It answers the question everyone asks and almost no one answers honestly.</p>''',
  next='Begin the path &rarr; <a href="/path/01-what-is-hermeticism/">Step 01: What is Hermeticism?</a>',
  faq=[("Do I need any background?", "None. The Path assumes zero prior knowledge — only curiosity."),
       ("Is this a belief system I'm joining?", "No. This is the history of ideas, read the way a good university seminar would read it — no initiations, no memberships."),
       ("How long does the path take?", "Twelve steps, about fifteen minutes each. New steps are released with every issue of our letter, As Above.")])

# ═══ PATH INDEX ═══
page("path",
  crumb="The Path", kicker="The Path", title="The Path — Hermeticism in twelve steps",
  desc="A twelve-step reading path through the Hermetic tradition: from first definitions to the sources, fifteen minutes at a time.",
  h1="One path. Twelve steps.",
  tldr="Read in order. Each step is short, honest and cited — and each unlocks with a new issue of the letter.",
  body='''
<ul class="hub">
  <li><a href="/path/01-what-is-hermeticism/"><b>01 &middot; What is Hermeticism?</b><span>The five-minute honest answer — and the four different things people mean by the word.</span></a></li>
  <li><a href="/path/02-who-was-hermes-trismegistus/"><b>02 &middot; Who was Hermes Trismegistus?</b><span>A god, a man, a pen name? The strangest author in history.</span></a></li>
  <li><a href="/path/03-alexandria/"><b>03 &middot; Alexandria</b><span>The world that made the Hermetica: Roman Egypt, dying temples, Greek questions.</span></a></li>
  <li><a href="/path/04-reading-poimandres/"><b>04 &middot; Reading Poimandres</b><span>Your first source text, guided line by line.</span></a></li>
  <li><span class="hub__soon"><b>05 &middot; The key ideas in one map<i class="hub__date">Aug 31</i></b><span>Eleven concepts, one diagram.</span></span></li>
  <li><span class="hub__soon"><b>06 &middot; As above, so below — what it actually means<i class="hub__date">Sep 7</i></b><span>The most misquoted line in esotericism.</span></span></li>
  <li><span class="hub__soon"><b>07 &middot; The Emerald Tablet<i class="hub__date">Sep 14</i></b><span>No emerald, no Greek, no Egypt — a better story instead.</span></span></li>
  <li><span class="hub__soon"><b>08 &middot; The Renaissance revival<i class="hub__date">Sep 21</i></b><span>1463: Plato can wait.</span></span></li>
  <li><span class="hub__soon"><b>09 &middot; Alchemy and the Great Work<i class="hub__date">Sep 28</i></b><span>What the alchemists were actually doing.</span></span></li>
  <li><span class="hub__soon"><b>10 &middot; The Kybalion problem<i class="hub__date">Oct 5</i></b><span>The bestseller that isn&rsquo;t what it claims to be.</span></span></li>
  <li><span class="hub__soon"><b>11 &middot; Hermeticism today<i class="hub__date">Oct 12</i></b><span>From the Golden Dawn to your For You page.</span></span></li>
  <li><span class="hub__soon"><b>12 &middot; The reading map<i class="hub__date">Oct 19</i></b><span>Where to go deeper — ten books in the right order.</span></span></li>
</ul>
<p class="art__next">Locked steps unlock with each issue of <a href="/#subscribe">As Above</a>.</p>''')

# ═══ PATH 01 ═══
page("path/01-what-is-hermeticism",
  trail=[("The Path", "/path/")], crumb="01 · What is Hermeticism?", kicker="The Path — step 01",
  title="What is Hermeticism? The honest answer",
  desc="Hermeticism explained honestly: the ancient Greek-Egyptian texts, the Renaissance revival, the occult orders and the 1908 book — four different things hiding under one word.",
  h1="What is Hermeticism?",
  tldr="&ldquo;Hermeticism&rdquo; names at least four different things: ancient Greek-Egyptian wisdom texts (c. 100&ndash;300 CE), their Renaissance revival, the occult systems of the 19th&ndash;20th centuries, and a 1908 American self-help book. Most confusion comes from gluing them into one fake continuum.",
  ld=[ART("What is Hermeticism?", "The four things hiding under one word.")],
  body='''
<p>Ask three people what Hermeticism is and you&rsquo;ll get a mystical religion, a secret society, and a life-hack about &ldquo;vibration&rdquo;. None of these is quite wrong — and that&rsquo;s the problem. The word has been stretched over four different bodies for so long that the first honest step is to pull them apart.</p>
<h2>Thing one: the ancient texts</h2>
<p>Between roughly 100 and 300 CE, Greek-speaking authors in Roman Egypt wrote philosophical dialogues in the voice of <a href="/figures/hermes-trismegistus/">Hermes Trismegistus</a>. The core survivors are the <a href="/texts/corpus-hermeticum/">Corpus Hermeticum</a>, the <a href="/texts/asclepius/">Asclepius</a>, and a scatter of fragments and finds — including ritual texts dug out of the Egyptian sand at Nag Hammadi in 1945. Scholars call this ancient layer <em>Hermetism</em>. Its concerns: God, mind, cosmos, and how a human being comes to <em>know</em> — a transformative knowing the texts call <a href="/ideas/nous/">nous</a>-given gnosis.</p>
<h2>Thing two: the Renaissance revival</h2>
<p>In 1463 the dying Cosimo de&rsquo; Medici ordered his translator to drop Plato and render Hermes first. For the next 150 years Europe&rsquo;s best minds believed these texts were older than Moses — a primordial revelation, the <em>prisca theologia</em>. They were wrong about the dating (a philologist named Isaac Casaubon proved it in 1614), but the error was gloriously productive: it fed Renaissance art, magic, and early visions of a mathematical, harmonious nature.</p>
<h2>Thing three: occult Hermeticism</h2>
<p>The 19th and 20th centuries rebuilt &ldquo;Hermeticism&rdquo; as a practical system: the Hermetic Order of the Golden Dawn, ritual magic, tarot, Franz Bardon&rsquo;s training manuals. Genuine lineages of ideas run through here — but so do invented pedigrees and at least one founding document that was almost certainly forged.</p>
<h2>Thing four: the 1908 book</h2>
<p>The &ldquo;seven hermetic principles&rdquo; your feed quotes come from <a href="/texts/kybalion/">The Kybalion</a> — published in Chicago in 1908 and written not by ancient masters but, as scholarship has established, by New Thought author William Walker Atkinson. It&rsquo;s a fascinating document of its own era. It is not ancient Egypt.</p>
<h2>So what is Hermeticism?</h2>
<p>It&rsquo;s the whole braid: ancient texts, their long afterlife, and the arguments between them. This site keeps the strands separate — because the true, tangled story is far more interesting than the smooth fake one.</p>''',
  facts=[("Ancient core", "Corpus Hermeticum, Asclepius, Definitions, fragments (c. 100–300 CE)"),
         ("Language", "Greek (with Coptic, Latin and Armenian survivals)"),
         ("Scholarly terms", "Hermetism (ancient) vs Hermeticism (later tradition)"),
         ("Modern standard translation", "Copenhaver, <i>Hermetica</i> (Cambridge, 1992); Litwa, <i>Hermetica II</i> (2018)")],
  faq=[("Is Hermeticism a religion?", "The ancient texts imply a lived spiritual practice, and there is evidence of real ritual communities — but there was no church, no canon, no priesthood of 'Hermeticism'. Today it is studied as history of ideas and practised in many reinvented forms."),
       ("Is it Egyptian or Greek?", "Both — and that's a live scholarly debate. The texts are written in Greek with Platonic and Stoic vocabulary, but recent scholarship (Fowden, Bull) argues they grew out of genuinely Egyptian priestly milieus."),
       ("Are the seven hermetic principles ancient?", "No. They were formulated in The Kybalion (1908). The ancient texts contain different — and richer — ideas.")],
  sources=["Brian P. Copenhaver, <i>Hermetica</i> (Cambridge University Press, 1992) — introduction.",
           "Wouter J. Hanegraaff, <i>Esotericism and the Academy</i> (Cambridge, 2012).",
           "Christian H. Bull, <i>The Tradition of Hermes Trismegistus</i> (Brill, 2018).",
           "Research dossiers: scholarship.md, modern-occult.md (this site&rsquo;s source files)."],
  next='Next &rarr; <a href="/path/02-who-was-hermes-trismegistus/">Step 02: Who was Hermes Trismegistus?</a>')

# ═══ PATH 02 ═══
page("path/02-who-was-hermes-trismegistus",
  trail=[("The Path", "/path/")], crumb="02 · Who was Hermes Trismegistus?", kicker="The Path — step 02",
  title="Who was Hermes Trismegistus?",
  desc="Hermes Trismegistus was not a person but a literary persona fusing Greek Hermes and Egyptian Thoth — and the story of how a god became an author.",
  h1="Who was Hermes Trismegistus?",
  tldr="No one — and that&rsquo;s the point. &ldquo;Thrice-greatest Hermes&rdquo; is a literary persona born from the fusion of the Greek god Hermes and the Egyptian god Thoth, later mistaken for an ancient sage, then a prophet, then an author of thousands of books.",
  ld=[PERSON("Hermes Trismegistus"), ART("Who was Hermes Trismegistus?", "How a god became an author.")],
  body='''
<p>Here is a career no human ever had: worshipped in Hermopolis as the ibis-headed scribe of the gods; renamed by Greek settlers who recognised their own Hermes in him; credited with inventing writing, astronomy and law; quoted by Church Fathers; adopted by Islam as the prophet Idris; and finally installed in Renaissance Florence as the most ancient philosopher of all — older than Plato, maybe older than Moses.</p>
<h2>The fusion</h2>
<p>When Greeks settled Egypt after Alexander, they met Thoth: god of writing, reckoning and secret knowledge. They mapped him onto Hermes, their own divine messenger. Egyptian temple inscriptions had long piled up Thoth&rsquo;s epithet &ldquo;great&rdquo; — great, great, great. In Greek this became <em>trismegistos</em>: thrice-greatest. A bilingual god for a bilingual country.</p>
<h2>From god to author</h2>
<p>Late antique Egypt attributed books to Hermes the way we attribute quotes to Einstein. Astrological manuals, alchemical recipes, medical lore — and the philosophical dialogues that became the <a href="/texts/corpus-hermeticum/">Corpus Hermeticum</a>. Ancient authors speak of thousands of books of Hermes. The persona gave scattered authors a shared voice and their teachings a pedigree reaching back before the flood.</p>
<h2>The three Hermeses</h2>
<p>Later tradition, embarrassed by the impossible chronology, multiplied him: the Arabic astrologer Abu Ma&rsquo;shar described three successive Hermeses — one before the Flood (identified with Enoch/Idris), one in Babylon, one in Egypt. It&rsquo;s an elegant medieval patch on a problem that only philology would solve, a millennium later.</p>
<h2>Why it matters</h2>
<p>Because the persona is the tradition. Once you see Hermes as a shared mask rather than a man, the real story appears: generations of writers, in three religions and four languages, choosing the same voice to say <em>this knowledge is older, deeper and more unified than any school</em>. The mask made the claim believable. The claim made history.</p>''',
  facts=[("Identity", "Literary persona: Greek Hermes + Egyptian Thoth"),
         ("Epithet", "Trismegistos — 'thrice-greatest', echoing Egyptian 'great, great, great' for Thoth"),
         ("In Islam", "Identified with the prophet Idris (and Enoch)"),
         ("Attributed works", "Philosophical Hermetica, plus astrological, alchemical and magical corpora")],
  faq=[("So he definitely never existed?", "As a single historical person — no. The texts written in his name are real and datable (c. 100–300 CE for the philosophical core); their 'author' is a persona."),
       ("Why did ancient readers believe in him?", "Antiquity prized old wisdom over new argument. A revelation from Egypt's divine scribe outranked any living philosopher — so that's how you published big ideas."),
       ("Is he related to the ibis on this site?", "Yes — the ibis is Thoth's sacred bird, and our emblem.")],
  sources=["Garth Fowden, <i>The Egyptian Hermes</i> (Cambridge, 1986).",
           "Kevin van Bladel, <i>The Arabic Hermes</i> (Oxford, 2009).",
           "Copenhaver, <i>Hermetica</i> (1992), introduction.",
           "Research dossiers: ancient-texts.md §6.4, emerald-tablet-arabic.md §3.1."],
  next='Next &rarr; <a href="/path/03-alexandria/">Step 03: Alexandria</a>')

# ═══ PATH 03 ═══
page("path/03-alexandria",
  trail=[("The Path", "/path/")], crumb="03 · Alexandria", kicker="The Path — step 03",
  title="Alexandria — the world that made the Hermetica",
  desc="The Hermetic texts were written in Roman Egypt, where Greek philosophy met a temple religion in decline. This is the world that produced them.",
  h1="Alexandria: the world<br>that made the Hermetica",
  tldr="The Hermetica were written in Roman Egypt (c. 100&ndash;300 CE), where Greek was the language of thought, Egyptian temple religion was losing its state support, and priests and philosophers met in the same streets. Recent scholarship reads the texts as a survival strategy: Egyptian religious knowledge repackaged in Greek philosophical dress.",
  ld=[ART("Alexandria — the world that made the Hermetica", "Roman Egypt and the birth of the Hermetic writings.")],
  body='''
<p>Every text has a home. The Hermetica&rsquo;s home was Egypt under Roman rule — and specifically the world radiating from Alexandria, the Mediterranean&rsquo;s great engine of Greek learning, planted on Egyptian soil.</p>
<h2>Two civilisations, one street</h2>
<p>By 100 CE Egypt had lived under Greek-speaking rule for four centuries. Educated Egyptians wrote Greek; Greek settlers consulted Egyptian temples. Platonism and Stoicism supplied the era&rsquo;s intellectual vocabulary — mind, cosmos, matter, fate — while the temples kept an older inheritance: ritual knowledge, sacred writing, the figure of Thoth. The Hermetica speak both languages at once: Greek concepts, Egyptian soul.</p>
<h2>Temples in decline</h2>
<p>Rome taxed the temples, capped their privileges and slowly strangled the priestly economy. A class of learned men watched their world contract. The scholar Christian Bull has argued that the Hermetica are best read against exactly this backdrop: priestly teachers, addressing Greek-speaking seekers, translating what could be saved of Egyptian religion into the era&rsquo;s philosophical idiom. Not nostalgia — adaptation.</p>
<h2>The mood of the texts</h2>
<p>Read with this in mind, the famous &ldquo;apocalypse&rdquo; of the <a href="/texts/asclepius/">Asclepius</a> — Egypt abandoned by its gods, the land of temples become a land of tombs — stops being a generic prophecy and becomes something rawer: a lament written while it was coming true.</p>
<h2>Not a secret society</h2>
<p>Were there real Hermetic circles — teachers and pupils, prayer and practice? For most of the 20th century scholars doubted it. Then the Nag Hammadi finds (1945) yielded a Hermetic ritual text and a communal prayer attested in three languages. The current view: small teaching communities, real practice, no grand secret order. As usual, the modest truth is stranger than the myth.</p>''',
  facts=[("When", "c. 100–300 CE (philosophical Hermetica)"),
         ("Where", "Roman Egypt — Alexandria and the temple towns"),
         ("Intellectual climate", "Middle Platonism, Stoicism, Egyptian temple religion"),
         ("Key modern study", "Christian H. Bull, <i>The Tradition of Hermes Trismegistus</i> (2018)")],
  faq=[("Were the authors Greek or Egyptian?", "Likely bilingual Egyptians and Greek-speaking locals — the debate between 'Greek philosophy in Egyptian dress' (Festugière) and genuinely Egyptian priestly origins (Fowden, Bull) has shifted toward Egypt in recent decades."),
       ("Did the Library of Alexandria hold the Hermetica?", "No evidence of it — and the famous Library was largely gone before most Hermetica were written. Their world was the temple scriptorium more than the Museum."),
       ("Why does the dating matter?", "Because for 150 years Europe believed these texts pre-dated Moses. Placing them in Roman Egypt (as Casaubon did in 1614) rewrote their meaning — from primordial revelation to late-antique synthesis.")],
  sources=["Garth Fowden, <i>The Egyptian Hermes</i> (1986).",
           "Christian H. Bull, <i>The Tradition of Hermes Trismegistus</i> (Brill, 2018).",
           "Research dossiers: ancient-texts.md, scholarship.md. <em>A dedicated Alexandria dossier is in preparation — this step will grow.</em>"],
  next='Next &rarr; <a href="/path/04-reading-poimandres/">Step 04: Reading Poimandres</a>')

# ═══ TEXTS INDEX ═══
page("texts",
  crumb="Texts", kicker="Wing I", title="The Texts — the Hermetic canon, mapped",
  desc="The Hermetic canon mapped: Corpus Hermeticum, Asclepius, Emerald Tablet, the fragments and finds — what each text is and how to read it.",
  h1="The Texts",
  tldr="Nine bodies of text, three languages, seventeen centuries. Start with the Corpus Hermeticum — or with the one &ldquo;hermetic&rdquo; bestseller that isn&rsquo;t ancient at all.",
  body='''
<ul class="hub">
  <li><a href="/texts/corpus-hermeticum/"><b>Corpus Hermeticum</b><span>The seventeen treatises at the heart of the tradition (c. 100&ndash;300 CE).</span></a></li>
  <li><a href="/texts/corpus-hermeticum/poimandres/"><b>&mdash; Poimandres</b><span>The vision that opens the Corpus, guided.</span></a></li>
  <li><a href="/texts/emerald-tablet/"><b>The Emerald Tablet</b><span>&ldquo;As above, so below&rdquo; — the real, Arabic origin.</span></a></li>
  <li><a href="/texts/asclepius/"><b>Asclepius</b><span>The perfect discourse — and the lament for Egypt.</span></a></li>
  <li><a href="/texts/kybalion/"><b>The Kybalion (1908)</b><span>What it gets right, and what it invents.</span></a></li>
  <li><a href="/texts/definitions-of-hermes/"><b>Definitions of Hermes</b><span>The oldest philosophical Hermetic text — in Armenian.</span></a></li>
  <li><a href="/texts/stobaean-fragments/"><b>Stobaean Fragments</b><span>Including the Korē Kosmou.</span></a></li>
  <li><a href="/texts/nag-hammadi-hermetica/"><b>Nag Hammadi Hermetica</b><span>The 1945 desert finds — proof of ritual practice.</span></a></li>
  <li><a href="/texts/picatrix/"><b>Picatrix</b><span>The Arabic handbook of astral magic.</span></a></li>
  <li><a href="/texts/musaeum-hermeticum/"><b>Musaeum Hermeticum</b><span>The Baroque alchemical anthology.</span></a></li>
</ul>''')

# ═══ CORPUS HERMETICUM ═══
page("texts/corpus-hermeticum",
  media=[('ESOTERICA: Introduction to Hermes Trismegistus & Hermetic Philosophy', 'https://www.youtube.com/watch?v=kHHTt6Yiv5U', 'Dr Justin Sledge · 19 min · academic'), ('SHWEP podcast: the Hermetica series (episodes 102+)', 'https://shwep.net/themes/hermetica/', 'Earl Fontainelle · heavily footnoted'), ('Full reading: The Divine Pymander (Everard 1650 translation)', 'https://www.youtube.com/watch?v=a7afy9fnVnc', 'Altrusian Grace · 3 h 27 · public domain'), ('Full reading: Corpus Hermeticum (Mead 1906 translation)', 'https://www.youtube.com/watch?v=P03-unYILuQ', 'Man of Letters · 3 h 10 · public domain')],
  media_note='A caution: the most-viewed Corpus audiobooks on YouTube read modern copyrighted translations without authorization — we don&rsquo;t link them. The readings above use public-domain texts.',
  trail=[("Texts", "/texts/")], crumb="Corpus Hermeticum", kicker="The Texts",
  title="Corpus Hermeticum — what it is and how to read it",
  desc="The Corpus Hermeticum: seventeen Greek treatises from Roman Egypt on God, mind and rebirth. Dating, contents, the missing 'Book XV', and which translation to read.",
  h1="Corpus Hermeticum",
  tldr="Seventeen Greek treatises written in Egypt around 100&ndash;300 CE, compiled into one book in Byzantium, translated in 1463, and misdated for 150 years. There is no lost &ldquo;Book XV&rdquo; — the gap is an early-modern editing artifact.",
  ld=[BOOK("Corpus Hermeticum")],
  body='''
<p>The Corpus Hermeticum is not a book anyone wrote. It&rsquo;s an anthology: seventeen short treatises by different, anonymous authors, composed in Greek in Roman Egypt and gathered — probably in Byzantine hands, first attested with the philosopher Michael Psellos in the 11th century — into the collection that reached Florence in the 1460s.</p>
<h2>What&rsquo;s inside</h2>
<p>Dialogues, sermons and hymns on the big questions: where the cosmos comes from, what mind (<a href="/ideas/nous/">nous</a>) is, how the soul descends and ascends, what it means to be reborn in knowledge. Treatise I (<a href="/texts/corpus-hermeticum/poimandres/">Poimandres</a>) opens with a cosmic vision; treatise XIII stages a mystery of rebirth in which ten divine powers drive out twelve zodiacal torments — liberation from astrology, argued in astrology&rsquo;s own categories.</p>
<h2>The missing Book XV</h2>
<p>Editions number the treatises I&ndash;XIV and XVI&ndash;XVIII. The &ldquo;missing&rdquo; XV is no suppressed secret: an early editor inserted extra material as XV, later editors removed it, and the numbering stuck. Four centuries of conspiracy theories rest on a pagination decision.</p>
<h2>A short history of misreading</h2>
<p>Renaissance Europe believed the Corpus was primordial wisdom older than Plato. In 1614 Isaac Casaubon showed on linguistic grounds that the Greek was late antique. He was right about the dates — and yet the 1945 Nag Hammadi finds proved the texts carry genuinely Egyptian religious material. Both things are true; that double truth is the modern study of Hermetism.</p>
<h2>How to read it</h2>
<p>The scholarly standard in English is Copenhaver&rsquo;s <i>Hermetica</i> (1992), completed by Litwa&rsquo;s <i>Hermetica II</i> (2018). The free translations that dominate the internet — Everard (1650) and Mead (1906) — are historical documents in their own right, made before the modern critical text; read them knowingly, not naively.</p>''',
  facts=[("Contents", "17 Greek treatises (I–XIV, XVI–XVIII)"),
         ("Composed", "c. 100–300 CE, Roman Egypt"),
         ("First attested as a collection", "Michael Psellos, 11th c. Byzantium"),
         ("Latin translation", "Marsilio Ficino, 1463 (printed 1471)"),
         ("Redated", "Isaac Casaubon, 1614"),
         ("Standard English", "Copenhaver 1992 · Litwa 2018")],
  faq=[("Is the Corpus Hermeticum 'the Hermetic bible'?", "No — it was never a canon. It's one surviving anthology among several bodies of Hermetic writing (Asclepius, Definitions, fragments, technical treatises)."),
       ("Is the Emerald Tablet in it?", "No. The Emerald Tablet is a separate, much later text, first attested in Arabic in the 8th–9th century."),
       ("Which treatise should I read first?", "Poimandres (I) — then IV (the mixing-bowl of mind), X, XI and XIII. Our guided reading starts with Poimandres.")],
  sources=["Copenhaver, <i>Hermetica</i> (Cambridge, 1992).",
           "M. David Litwa, <i>Hermetica II</i> (Cambridge, 2018).",
           "Research dossier: ancient-texts.md §1 (full manuscript history and translation table)."],
  next='Read the opening vision &rarr; <a href="/texts/corpus-hermeticum/poimandres/">Poimandres</a>')

# ═══ POIMANDRES ═══
page("texts/corpus-hermeticum/poimandres",
  media=[('SHWEP 103: Corpus Hermeticum I, the Poimandres', 'https://shwep.net/podcast/corpus-hermeticum-i-the-poimandres/', 'close reading, with scholarship'), ('ESOTERICA: Introduction to the Corpus Hermeticum', 'https://www.youtube.com/watch?v=kHHTt6Yiv5U', '19 min · academic')],
  trail=[("Texts", "/texts/"), ("Corpus Hermeticum", "/texts/corpus-hermeticum/")], crumb="Poimandres",
  kicker="The Texts — Corpus Hermeticum I", title="Poimandres — the vision that opens the Corpus",
  desc="Poimandres (Corpus Hermeticum I): the visionary cosmogony that opens the Hermetic corpus — summary, structure and how to read it without Greek.",
  h1="Poimandres",
  tldr="The first treatise of the Corpus: a visionary dialogue in which a cosmic Mind shows the narrator how the world was made, what a human being is, and how the soul climbs home through the planetary spheres.",
  ld=[BOOK("Poimandres (Corpus Hermeticum I)")],
  body='''
<p>A man falls into a state between sleep and waking. A boundless being appears and asks what he wishes to know. &ldquo;I want to learn the things that are,&rdquo; he answers, &ldquo;and to know God.&rdquo; What follows is one of late antiquity&rsquo;s great visionary texts.</p>
<h2>The shape of the vision</h2>
<p>Light without limit; a darkness coiling downward into moist chaos; a holy Word setting the elements in order. The being names itself Poimandres, &ldquo;the <a href="/ideas/nous/">Nous</a> of the sovereign power&rdquo; — Mind itself. It shows the making of the cosmos, then the strangest moment in the text: the heavenly Anthropos, the divine Human, leans through the cosmic frame, falls in love with Nature, and Nature with him. Humanity is born double — mortal in body, immortal in essence.</p>
<h2>The ascent</h2>
<p>Because we fell through the spheres, we can climb back. At death the soul rises through the seven planetary zones, returning to each the passion it once received — deceit to one, ambition to another — until, stripped bare, it enters the eighth sphere and joins the powers singing to God. This ladder — the fall, the stripping, the song — echoes through Western mysticism for two millennia.</p>
<h2>How to read it</h2>
<p>Slowly, twice. First for the images; then for the argument hidden in them: that knowing the cosmos and knowing yourself are one act, because mind in you and Mind in the world are kin. That claim — not any &ldquo;law&rdquo; or &ldquo;principle&rdquo; — is the engine of the whole Hermetic tradition.</p>
<blockquote>A guided, section-by-section reading is coming as Path step 04 — with the letter.</blockquote>''',
  faq=[("What does 'Poimandres' mean?", "Disputed. Traditional Greek reading: 'shepherd of men'; a widely discussed modern proposal derives it from Egyptian 'knowledge of Re'. The debate itself tells you what the text is: Greek on the surface, Egyptian underneath."),
       ("Is it Gnostic?", "It shares the era's furniture — visionary ascent, divine Mind, matter as entanglement — but the Hermetic mood is warmer toward the cosmos than most Gnostic texts."),
       ("Where can I read it now?", "Copenhaver's translation is the standard; Mead's 1906 public-domain version is free online and fine for a first pass, read with its age in mind.")],
  sources=["Copenhaver, <i>Hermetica</i> (1992), CH I with notes.",
           "Research dossiers: ancient-texts.md §1.2–1.3, ideas-glossary.md §1, §8."],
  next='Back to the hub &rarr; <a href="/texts/corpus-hermeticum/">Corpus Hermeticum</a>')

# ═══ EMERALD TABLET ═══
page("texts/emerald-tablet",
  media=[('ESOTERICA: What is the Emerald Tablet of Hermes Trismegistus?', 'https://www.youtube.com/watch?v=5qa4woIz_Ag', 'the real Arabic textual history · ~707K views'), ('The Emerald Tablet — history and three translations', 'https://www.youtube.com/watch?v=uK7hLq8QAc4', 'Altrusian Grace · short')],
  media_note='Avoid audio of Doreal&rsquo;s &ldquo;Emerald Tablets of Thoth&rdquo; — a 1930s channeled work unrelated to the historical Tablet.',
  trail=[("Texts", "/texts/")], crumb="The Emerald Tablet", kicker="The Texts",
  title="The Emerald Tablet — the real origin of “as above, so below”",
  desc="The Emerald Tablet is first attested in an 8th–9th century Arabic text — no Greek original, no emerald. The real history, the Latin text, and Newton's own translation.",
  h1="The Emerald Tablet",
  tldr="No emerald, no Egypt, no Greek original. The most famous &ldquo;ancient&rdquo; text in esotericism is first attested in an Arabic book of the 8th&ndash;9th century — and its most quoted line is a 19th-century paraphrase.",
  ld=[BOOK("Emerald Tablet (Tabula Smaragdina)")],
  body='''
<p>A dozen cryptic sentences, said to be carved on emerald by Hermes himself and found clutched in his mummified hands. That&rsquo;s the legend. The document trail says something better.</p>
<h2>Where it actually comes from</h2>
<p>The Tablet&rsquo;s oldest known appearance is inside an Arabic work, the <i>Kitab sirr al-khaliqa</i> (&ldquo;Book of the Secret of Creation&rdquo;), attributed to pseudo-Apollonius of Tyana — Balinas in Arabic. Scholarly datings of that work cluster in the 8th to early 9th century CE. No Greek original has ever surfaced. From the Arabic world it entered Latin Europe by at least three separate routes in the 12th&ndash;13th centuries and became the founding text of Western alchemy.</p>
<h2>What the famous line really says</h2>
<p>The Latin vulgate does not say &ldquo;as above, so below&rdquo;. It offers a working simile with a purpose clause — that what is below is <em>like</em> what is above, and the reverse, <em>for accomplishing the miracles of the one thing</em>. It&rsquo;s an operative claim about how transformation works, not a cosmic slogan. The tidy epigram we all know was popularised in the era of Blavatsky. (Manuscript tradition varies on the exact Latin wording — our step 06 will print the critical text side by side.)</p>
<h2>Newton&rsquo;s copy</h2>
<p>Among Isaac Newton&rsquo;s alchemical papers survives his own English translation of the Tablet with commentary (Keynes MS 28, King&rsquo;s College, Cambridge — digitised and readable online). For Newton the &ldquo;one thing&rdquo; was philosophical mercury: laboratory language, not mysticism. The father of physics, reading the Tablet as a chemist.</p>
<h2>Why the true story is better</h2>
<p>A fake pedigree gives you a slogan. The real transmission — Egypt remembered in Arabic, translated in Toledo, obsessed over by Newton — gives you a thousand-year relay of people who believed matter had a grammar and meant to learn it.</p>''',
  facts=[("First attested", "Kitab sirr al-khaliqa (pseudo-Apollonius/Balinas), c. 750–833 CE"),
         ("Greek original", "None known"),
         ("Latin transmission", "Three routes, 12th–13th c."),
         ("Newton's manuscript", "Keynes MS 28, King's College Cambridge (1680s–90s, dating per Dobbs)"),
         ("Famous epigram", "19th-century condensation of the Latin simile")],
  faq=[("Did a physical emerald tablet ever exist?", "There is no evidence of one. The 'discovery in a tomb' story is a literary topos — a standard way ancient and medieval texts claimed authority."),
       ("Is it part of the Corpus Hermeticum?", "No. It travels under Hermes' name but belongs to the Arabic-Latin alchemical tradition, centuries later."),
       ("So is 'as above, so below' wrong?", "It's a compression. The idea of correspondence is genuinely Hermetic; the slogan's wording and its Instagram meaning are modern.")],
  sources=["Julius Ruska, <i>Tabula Smaragdina</i> (1926) — foundational study.",
           "Kevin van Bladel, <i>The Arabic Hermes</i> (2009).",
           "The Newton Project / Cambridge Digital Library: Keynes MS 28.",
           "Research dossier: emerald-tablet-arabic.md (full dating debate and transmission map)."],
  next='See also &rarr; <a href="/ideas/as-above-so-below/">As above, so below — the idea</a>')

# ═══ ASCLEPIUS ═══
page("texts/asclepius",
  media=[('Audio reading: The Perfect Sermon / Asclepius (Mead translation)', 'https://www.youtube.com/watch?v=THGJCc5FOZg', 'public domain'), ('SHWEP 105: The Asclepius and Korê Kosmou', 'https://shwep.net/podcast/other-hermetic-worlds-the-asclepius-and-kore-kosmou/', 'scholarly walkthrough')],
  trail=[("Texts", "/texts/")], crumb="Asclepius", kicker="The Texts",
  title="Asclepius — the perfect discourse",
  desc="The Asclepius: the longest Hermetic treatise, surviving in Latin — 'man is a great miracle', the god-making passages, and the lament for Egypt.",
  h1="Asclepius",
  tldr="The longest Hermetic treatise, surviving complete only in a free Latin adaptation of a lost Greek original. Home of the tradition&rsquo;s most famous sentence — &ldquo;man is a great miracle&rdquo; — its most scandalous passages, and its most haunting prophecy.",
  ld=[BOOK("Asclepius (Perfect Discourse)")],
  body='''
<p>Antiquity knew it as the <i>Logos teleios</i> — the Perfect Discourse. The Greek is lost; what survives complete is an old Latin adaptation that circulated among readers who had no idea how strange its journey had been. A Coptic excerpt found at Nag Hammadi lets scholars check the Latin against something closer to the original: the Latin translator, it turns out, took liberties.</p>
<h2>A great miracle</h2>
<p><em>Magnum miraculum est homo</em> — &ldquo;a great miracle is man&rdquo;. The Asclepius&rsquo; declaration that the human being bridges the divine and material worlds became, eleven centuries later, the opening move of Pico della Mirandola&rsquo;s celebrated Oration. Renaissance humanism&rsquo;s signature sentence has a Hermetic pedigree.</p>
<h2>The scandal: making gods</h2>
<p>The text&rsquo;s most notorious passages describe Egyptian temple craft: drawing celestial powers into cult statues so that they become ensouled, prophesying gods. Augustine attacked exactly these lines — which is partly why the Asclepius survived: it was preserved by its enemies as evidence.</p>
<h2>The lament</h2>
<p>And then the prophecy: a time will come when Egypt&rsquo;s gods abandon it, when the most religious of lands is left a land of tombs, its rites mocked, its script forgotten. Written — as we saw in <a href="/path/03-alexandria/">step 03</a> — while the temple world was actually dying, it reads less like prediction than grief in real time.</p>''',
  facts=[("Original", "Greek Logos teleios — lost"),
         ("Survives as", "Latin adaptation (complete) + Coptic excerpt (Nag Hammadi) + Greek fragments"),
         ("Famous line", "Magnum miraculum est homo"),
         ("Hostile witness", "Augustine, City of God (on the statue passages)")],
  faq=[("Why is a pagan text preserved in Latin?", "It circulated in late antique and medieval Latin miscellanies — and its critics quoted it at length. Survival by controversy."),
       ("Is the 'apocalypse' a prophecy?", "It reads as one, but it was written while Egyptian temple religion was collapsing under Roman pressure — a lament dressed as prediction."),
       ("Where should I read it?", "Copenhaver's Hermetica (1992) includes the full Asclepius with notes.")],
  sources=["Copenhaver, <i>Hermetica</i> (1992), Asclepius with notes.",
           "Research dossiers: ancient-texts.md §2, ideas-glossary.md §11."],
  next='Next in the canon &rarr; <a href="/texts/kybalion/">The Kybalion — read with care</a>')

# ═══ KYBALION ═══
page("texts/kybalion",
  media=[('LibriVox audiobook: The Kybalion (public domain)', 'https://archive.org/details/kybalion_1412_librivox', 'read by Andrea Fiore · ~4 h'), ('Most-viewed reading on YouTube', 'https://www.youtube.com/watch?v=aL43l2SFVWQ', 'Master Key Society · ~5M views — listen knowing what it is')],
  media_note='The Kybalion is public domain, so audio versions are legal — the caveat here is content, not copyright: it&rsquo;s 1908 New Thought, not ancient Hermetica.',
  trail=[("Texts", "/texts/")], crumb="The Kybalion (1908)", kicker="The Texts — read with care",
  title="The Kybalion — what it gets right, and what it invents",
  desc="The Kybalion (1908) was written by William Walker Atkinson, not ancient masters. What its seven principles really are, where they come from, and how to read it honestly.",
  h1="The Kybalion:<br>read with care",
  tldr="The internet&rsquo;s favourite &ldquo;ancient Hermetic text&rdquo; was published in Chicago in 1908 by &ldquo;Three Initiates&rdquo; — identified by scholarship as New Thought writer William Walker Atkinson. Its &ldquo;seven hermetic principles&rdquo; are a modern invention. It&rsquo;s still worth understanding — as what it actually is.",
  ld=[BOOK("The Kybalion")],
  body='''
<p>If you&rsquo;ve met &ldquo;Hermeticism&rdquo; online, you&rsquo;ve met the Kybalion: mentalism, correspondence, vibration, polarity, rhythm, cause-and-effect, gender — seven tidy principles, endlessly quoted as timeless Egyptian wisdom. The book itself is real. The pedigree is not.</p>
<h2>Who wrote it</h2>
<p>Published in 1908 by the Yogi Publication Society of Chicago under the pseudonym &ldquo;Three Initiates&rdquo;, the Kybalion has been convincingly attributed by researchers (notably Philip Deslippe&rsquo;s 2011 critical edition) to William Walker Atkinson — lawyer turned prolific New Thought author, who wrote under many pseudonyms. The style, the publishing house, and documentary evidence all point the same way.</p>
<h2>What it invents</h2>
<p>The seven principles as a system appear in no ancient text. &ldquo;Vibration&rdquo; and &ldquo;mental transmutation&rdquo; are the vocabulary of 1900s New Thought — the same Chicago milieu that produced the law of attraction. Where the ancient Hermetica stage a slow transformation of the knower, the Kybalion offers levers: adjust your mental frequency, change your world. That&rsquo;s not a translation of Hermes; it&rsquo;s a modern philosophy wearing his coat.</p>
<h2>What it gets right</h2>
<p>Honesty cuts both ways. The Kybalion&rsquo;s instinct that mind is fundamental, that correspondence links levels of reality, that opposites convert — these do echo genuine Hermetic themes, filtered through the Renaissance and 19th-century occultism. Some scholars of esotericism (Smoley, Horowitz) defend it as a legitimate modern branch of the tradition&rsquo;s reception. Read it as 1908, and it&rsquo;s illuminating. Read it as ancient Egypt, and it will mislead you about everything else on this site.</p>
<h2>The test</h2>
<p>The Kybalion is this site&rsquo;s best litmus: any source that quotes it as ancient hasn&rsquo;t checked its sources. Now you have.</p>''',
  facts=[("Published", "1908, Yogi Publication Society, Chicago"),
         ("Credited to", "'Three Initiates' (pseudonym)"),
         ("Attributed author", "William Walker Atkinson (per Deslippe 2011)"),
         ("Relation to ancient Hermetica", "None direct — New Thought reworking of received themes"),
         ("Free text", "Public domain (Project Gutenberg #14209)")],
  faq=[("So should I skip it?", "No — read it knowingly. It's a key document of modern esotericism and the source of most pop-Hermeticism. Just don't mistake it for the ancient texts."),
       ("Are the seven principles useless, then?", "They're a 1908 synthesis — historically fascinating, philosophically debatable, and genuinely influential. 'Modern' isn't an insult; 'fake ancient' is."),
       ("What should I read instead for the real thing?", "Start with Poimandres in a modern translation — our guided reading, or Copenhaver's Hermetica.")],
  sources=["Philip Deslippe (ed.), <i>The Kybalion: The Definitive Edition</i> (2011).",
           "Research dossiers: modern-occult.md §2, bibliography.md §4.",
           "The Kybalion at Project Gutenberg (#14209) — free, public domain."],
  next='The full story &rarr; Path step 10: <em>The Kybalion problem</em> (unlocks with the letter)')

# ═══ FIGURES INDEX ═══
page("figures",
  crumb="Figures", kicker="Wing II", title="The Figures — the Hermetic lineage",
  desc="The people of the Hermetic tradition: from Thoth and Hermes Trismegistus through the Renaissance magi to the scholars who rebuilt the field.",
  h1="The Figures",
  tldr="Gods, translators, magi, forgers and professors — the tradition is a relay of people. Start with the runner who never existed.",
  body='''
<ul class="hub">
  <li><a href="/figures/hermes-trismegistus/"><b>Hermes Trismegistus</b><span>Thrice-great, never born: how a god became an author.</span></a></li>
  <li><a href="/figures/thoth/"><b>Thoth</b><span>The Egyptian root: scribe of the gods, weigher of hearts.</span></a></li>
  <li><a href="/figures/zosimos-of-panopolis/"><b>Zosimos of Panopolis</b><span>The first historical alchemist.</span></a></li>
  <li><a href="/figures/marsilio-ficino/"><b>Marsilio Ficino</b><span>The translator who lit the Renaissance fuse.</span></a></li>
  <li><a href="/figures/pico-della-mirandola/"><b>Pico della Mirandola</b><span>The undelivered manifesto.</span></a></li>
  <li><a href="/figures/lodovico-lazzarelli/"><b>Lodovico Lazzarelli</b><span>The purest Hermeticist you&rsquo;ve never heard of.</span></a></li>
  <li><a href="/figures/giordano-bruno/"><b>Giordano Bruno</b><span>Burned — but not for what you think.</span></a></li>
  <li><a href="/figures/john-dee/"><b>John Dee</b><span>The queen&rsquo;s magus.</span></a></li>
  <li><a href="/figures/grs-mead/"><b>G.R.S. Mead</b><span>The Victorian who translated Hermes for the occult age.</span></a></li>
  <li><a href="/figures/balinas/"><b>Balinas (pseudo-Apollonius)</b><span>The name on the Emerald Tablet&rsquo;s birth certificate.</span></a></li>
  <li><a href="/figures/frances-yates/"><b>Frances Yates</b><span>The historian who took magic seriously — and overreached.</span></a></li>
</ul>''')

# ═══ HERMES FIGURE ═══
page("figures/hermes-trismegistus",
  media=[('ESOTERICA: Who is Thoth? The Egyptian God who became Hermes Trismegistus', 'https://www.youtube.com/watch?v=CIWq_k2tiYg', '~841K views · academic'), ('Hermes Yesterday and Today — Hanegraaff & Sledge in conversation', 'https://www.youtube.com/watch?v=rgzuj1joXX0', 'Embassy of the Free Mind, Amsterdam')],
  trail=[("Figures", "/figures/")], crumb="Hermes Trismegistus", kicker="The Figures",
  title="Hermes Trismegistus — the author who never lived",
  desc="Hermes Trismegistus: the fusion of Greek Hermes and Egyptian Thoth, the persona behind the Hermetica, prophet in Islam, sage of the Renaissance.",
  h1="Hermes Trismegistus",
  tldr="Not a man but a mask: the Greek-Egyptian persona under whose name late-antique authors wrote the Hermetica — later a prophet in Islam, the oldest sage of the Renaissance, and the reason this site exists.",
  ld=[PERSON("Hermes Trismegistus")],
  body='''
<p>This card condenses <a href="/path/02-who-was-hermes-trismegistus/">Path step 02</a> — read that for the full story.</p>
<h2>The three lives of Hermes</h2>
<p><strong>As a god:</strong> born from the meeting of Greek Hermes and Egyptian Thoth in Ptolemaic Egypt; &ldquo;thrice-greatest&rdquo; echoes Thoth&rsquo;s Egyptian epithets. <strong>As an author:</strong> the shared voice of the philosophical and technical Hermetica — the persona that let scattered writers claim one ancient wisdom. <strong>As a memory:</strong> prophet Idris to Islamic tradition, contemporary-of-Moses to Renaissance Florence, and finally — after Casaubon&rsquo;s 1614 redating — a mask that history removed, revealing the more interesting truth beneath.</p>
<h2>Why he still matters</h2>
<p>Every era got the Hermes it needed: authority for late-antique seekers, a licence for Renaissance magic, a pedigree for modern occultism, and for us — a perfect case study in how traditions actually work: not unbroken chains, but creative reinvention under a borrowed name.</p>''',
  facts=[("Type", "Literary persona (Hermes + Thoth)"),
         ("Sacred animal", "The ibis — this site's emblem"),
         ("In Islam", "The prophet Idris"),
         ("Cult centre of Thoth", "Hermopolis Magna, Egypt")],
  faq=[("Was he ever considered real?", "For most of Western history, yes — Church Fathers, Islamic scholars and Renaissance philosophers all treated him as an ancient sage."),
       ("When did that change?", "1614, when Isaac Casaubon showed the Greek of the Hermetica was late antique, not primordial."),
       ("What should I read about him?", "Fowden's The Egyptian Hermes and van Bladel's The Arabic Hermes are the two scholarly pillars.")],
  sources=["Fowden, <i>The Egyptian Hermes</i> (1986).", "van Bladel, <i>The Arabic Hermes</i> (2009).",
           "Research dossiers: ancient-texts.md §6.4, emerald-tablet-arabic.md §3.1."],
  next='Full story &rarr; <a href="/path/02-who-was-hermes-trismegistus/">Path step 02</a>')

# ═══ IDEAS INDEX ═══
page("ideas",
  crumb="Ideas", kicker="Wing III", title="The Ideas — a working glossary of Hermetic thought",
  desc="The working vocabulary of Hermetic thought, defined plainly and sourced honestly: nous, gnosis, as above so below, correspondences and more.",
  h1="The Ideas",
  tldr="Eleven load-bearing concepts. Each entry: what the sources say, what scholars debate, what the internet gets wrong.",
  body='''
<ul class="hub">
  <li><a href="/ideas/as-above-so-below/"><b>As above, so below</b><span>Everyone quotes it. Few know where it&rsquo;s from.</span></a></li>
  <li><a href="/ideas/nous/"><b>Nous</b><span>The divine Mind — the tradition&rsquo;s central term.</span></a></li>
  <li><a href="/ideas/gnosis/"><b>Gnosis</b><span>Knowledge that transforms the knower.</span></a></li>
  <li><a href="/ideas/palingenesia/"><b>Palingenesia</b><span>The rebirth of CH XIII: ten powers vs twelve torments.</span></a></li>
  <li><a href="/ideas/correspondences/"><b>Correspondences</b><span>The web that links the levels of the world.</span></a></li>
  <li><a href="/ideas/prisca-theologia/"><b>Prisca theologia</b><span>The myth of the first, purest wisdom.</span></a></li>
  <li><a href="/ideas/theurgy/"><b>Theurgy</b><span>Ritual as ascent — Iamblichus and the divine work.</span></a></li>
  <li><a href="/ideas/the-ogdoad-and-ennead/"><b>The Ogdoad and Ennead</b><span>The eighth and ninth spheres of ascent.</span></a></li>
  <li><a href="/ideas/hermeticism-and-its-neighbours/"><b>Hermeticism &amp; its neighbours</b><span>Gnosticism, Platonism, Kabbalah — kinships and look-alikes.</span></a></li>
  <li><span class="hub__soon"><b>The Great Work</b><span>Magnum opus — beyond making gold.</span></span></li>
</ul>''')

# ═══ AS ABOVE ═══
page("ideas/as-above-so-below",
  trail=[("Ideas", "/ideas/")], crumb="As above, so below", kicker="The Ideas",
  title="As above, so below — what it actually means",
  desc="'As above, so below' comes from the Emerald Tablet's Latin — an 8th-9th century Arabic text — and the famous wording is a 19th-century paraphrase. Here's what it really says.",
  h1="As above, so below",
  tldr="The idea of correspondence between levels of reality is genuinely Hermetic. The slogan itself is a 19th-century condensation of a Latin sentence from the Emerald Tablet — an Arabic-era text — and the original says more, and means differently.",
  ld=[TERM("As above, so below", "Popular condensation of the Emerald Tablet's correspondence formula.")],
  body='''
<p>It&rsquo;s on posters, in tattoos, in every second video about &ldquo;hermetic wisdom&rdquo;: <em>as above, so below</em>. Four words doing a lot of unpaid work.</p>
<h2>Where it&rsquo;s from</h2>
<p>Not the Corpus Hermeticum. The line descends from the <a href="/texts/emerald-tablet/">Emerald Tablet</a>, first attested in Arabic in the 8th&ndash;9th century. The Latin vulgate offers a simile with a purpose: what is below is <em>like</em> what is above — and what is above like what is below — <em>to accomplish the miracles of the one thing</em>. It&rsquo;s an operator&rsquo;s sentence: a claim that transformation works because the levels of reality answer each other. The crisp modern epigram was popularised in the age of Blavatsky.</p>
<h2>What the ancients did say</h2>
<p>The underlying idea — sympathy and correspondence between cosmos and human, heaven and earth — runs deep in the Hermetica and in Stoic and Platonic thought around them. The Corpus makes humanity a microcosm; astrological Hermetica map heaven onto body and fate. The intuition is ancient. The bumper sticker is not.</p>
<h2>What it doesn&rsquo;t mean</h2>
<p>It is not a law of attraction, a promise that thoughts summon events, or a licence to read any coincidence as cosmic signature. In its home context it grounds a discipline — alchemy — in a claim about nature&rsquo;s coherence. Correspondence was a working hypothesis, not a comfort blanket.</p>''',
  faq=[("Is the phrase in the Corpus Hermeticum?", "Not in this form. The correspondence idea is present; the famous wording belongs to the Emerald Tablet tradition and its 19th-century paraphrase."),
       ("Who first said 'as above, so below' exactly?", "The condensed English form spread through 19th-century occultism (Blavatsky's era); the Latin behind it is medieval, translating Arabic."),
       ("Is correspondence the same as astrology?", "Astrology is one application of it. The principle is broader: a claim that the world's levels mirror and answer one another.")],
  sources=["Research dossiers: emerald-tablet-arabic.md §2, ideas-glossary.md §4–5.",
           "Copenhaver, <i>Hermetica</i> (1992) — correspondence passages."],
  next='The source text &rarr; <a href="/texts/emerald-tablet/">The Emerald Tablet</a>')

# ═══ NOUS ═══
page("ideas/nous",
  trail=[("Ideas", "/ideas/")], crumb="Nous", kicker="The Ideas",
  title="Nous — the divine Mind",
  desc="Nous in the Hermetica: the divine Mind that is both God's essence and humanity's deepest faculty — definition, sources and common misreadings.",
  h1="Nous",
  tldr="Greek for &ldquo;mind&rdquo; — but in the Hermetica, Nous is the divine Mind itself: the source of reality, the teacher in Poimandres, and the faculty in us that makes knowing God possible. Not &ldquo;intellect&rdquo;, not &ldquo;brain&rdquo;, and not &ldquo;vibration&rdquo;.",
  ld=[TERM("Nous", "The divine Mind in Hermetic thought.")],
  body='''
<p>If the Hermetica have one load-bearing word, it&rsquo;s this one. <em>Nous</em> is what reveals, what creates, and what awakens — sometimes all three in a single page.</p>
<h2>In the sources</h2>
<p>In <a href="/texts/corpus-hermeticum/poimandres/">Poimandres</a>, the revealer names itself &ldquo;the Nous of the sovereign power&rdquo;: Mind is the face God turns toward the seeker. Treatise IV tells of a mixing-bowl (<em>krater</em>) filled with Nous, sent down so that souls who choose may baptise themselves in mind — a startling image of awakening as immersion. Elsewhere Nous is the pilot of the soul: present in the reverent, absent in the mindless crowd.</p>
<h2>Translations and traps</h2>
<p>&ldquo;Mind&rdquo; is the least bad English. &ldquo;Intellect&rdquo; sounds like calculation; &ldquo;consciousness&rdquo; imports modern debates; New Age paraphrases (&ldquo;universal mind&rdquo; as mental Wi-Fi) flatten the term&rsquo;s religious weight. In the Hermetica, receiving Nous is closer to grace than to IQ — it changes what you are, not just what you know.</p>
<h2>Why it matters</h2>
<p>The whole Hermetic promise hangs here: mind in you is kin to Mind in the world, so knowing is homecoming. That single equation powered two thousand years of mysticism, magic and — filtered and secularised — some of the confidence of early modern science that nature is intelligible at all.</p>''',
  faq=[("Is Nous the same as God?", "The texts vary — sometimes Nous is God's essence, sometimes God's first emanation. The corpus is an anthology, not a system; the variation is part of the data."),
       ("Is everyone born with Nous?", "CH IV says pointedly no — reason (logos) is universal, but Nous must be received or chosen. That distinction between having thoughts and having Mind is central."),
       ("Does it survive in later tradition?", "Everywhere: Neoplatonism's Intellect, medieval mysticism's spark of the soul, and — much diluted — every modern claim that 'mind is fundamental'.")],
  sources=["Copenhaver, <i>Hermetica</i> (1992): CH I, IV, X–XII.",
           "Research dossier: ideas-glossary.md §1."],
  next='See it in action &rarr; <a href="/texts/corpus-hermeticum/poimandres/">Poimandres</a>')

# ═══ LETTERS ═══
page("letters",
  crumb="Letters", kicker="As Above", title="Letters — the As Above archive",
  desc="The archive of As Above, The Hermeticum's weekly letter: one step of the path per issue, fifteen minutes, sources cited.",
  h1="The Letters",
  tldr="As Above is our weekly letter: each issue walks one step of the Path and joins this archive as a permanent page. The first letter is being written now.",
  body='''
<p>This archive is empty on purpose. We publish nothing until it&rsquo;s ready to carry sources — and the first issue of <strong>As Above</strong> is in the scriptorium now.</p>
<h2>What each letter is</h2>
<p>One step of <a href="/path/">the Path</a>, in order. Fifteen minutes of serious history in plain English, with every claim cited and every myth labelled. Each issue is published twice: to your inbox, and here — as a permanent, linkable page of the knowledge base.</p>
<h2>Be first</h2>
<p>Subscribers receive each step the moment it exists — the archive fills in behind them.</p>''',
  next='<a href="/#subscribe">Subscribe — and walk the path as it&rsquo;s written &rarr;</a>')

# ═══ ABOUT / METHOD ═══
page("about/method",
  trail=[("About", "/about/method/")], crumb="Method", kicker="About",
  title="About & Method — how The Hermeticum works",
  desc="Our method: three layers (fact, scholarly debate, reception & myth), named sources with dates, honest 'we don't know', and corrections in the open.",
  h1="How this site works",
  tldr="Three layers, always separated: established fact (cited), scholarly debate (both sides named), and reception &amp; myth (labelled as such). Sources under every page. Corrections in the open. No initiations, no products of destiny.",
  body='''
<p>The Hermeticum exists because the internet&rsquo;s most fascinating tradition has the internet&rsquo;s worst signal-to-noise ratio. Our answer isn&rsquo;t gatekeeping — it&rsquo;s method.</p>
<h2>The three layers</h2>
<p><strong>Fact:</strong> what the manuscripts, documents and peer-reviewed scholarship establish — always with a source you can check. <strong>Scholarly debate:</strong> where serious researchers disagree, we name the positions and the people (Festugière vs Fowden on Egyptian origins; the dating of the Sirr al-khaliqa; the Yates thesis and its critics). <strong>Reception &amp; myth:</strong> what popular culture repeats — quoted as reception, never laundered into fact.</p>
<h2>Sources</h2>
<p>Our working standards are the modern critical translations (Copenhaver 1992, Litwa 2018) and the field&rsquo;s core scholarship (Fowden, Hanegraaff, Bull, van Bladel, and others cited per page). Public-domain translations (Everard 1650, Mead 1906) are linked as historical documents with their limitations flagged. We never link pirated copies of in-print scholarship.</p>
<h2>Quotations</h2>
<p>Key lines from the sources appear in our own working translations, always marked as such
(&ldquo;our working translation&rdquo;) and checked against the modern critical editions. For full texts we link
the public-domain translations (Everard 1650, Mead 1906) with a plain note about their age and limits.
In-print scholarly translations (Copenhaver, Litwa) are quoted only briefly, within fair use — buy those books;
they are the field&rsquo;s backbone.</p>
<h2>Honesty rules</h2>
<p>Where evidence ends, we say &ldquo;we don&rsquo;t know&rdquo;. Where we simplify, the fuller story is one link away. Where we err, we correct visibly — corrections are content, not embarrassment.</p>
<h2>Who writes this</h2>
<p>The Hermeticum is an editorial project with a single voice and a public method. It sells no readings, no initiations and no destiny. If it ever recommends a book, the reason will be printed next to it.</p>''',
  faq=[("Why no author names?", "The project speaks with an editorial voice; the method and sources are public, which we consider the stronger accountability."),
       ("Can I suggest a correction?", "Please do — the reply address of every letter reaches the editors, and corrections are published openly."),
       ("Do you make money?", "Not currently. The letter and the knowledge base are free. If that changes, it will be announced plainly.")])

# ═══ ATLAS — mapa świata tradycji (mechanika za Caterelo/FitStyle MapaSieci:
#     mapa = przegląd z licznikami er, lista = szczegół, klik era filtruje,
#     hover wiersz ↔ podświetlenie pinezki) ═══
ERAS = [
    ("antiquity", "Antiquity", "#a87f22"),
    ("islam", "The Islamic World", "#DB9065"),
    ("renaissance", "Renaissance & Early Modern", "#A4031F"),
    ("modern", "The Modern Story", "#240B36"),
]
PLACES = [  # (id, nazwa, era, lat, lon, postać/wątek, lata, opis, link|None)
    ("hermopolis", "Hermopolis", "antiquity", 27.78, 30.80, "Thoth", "‹ antiquity", "Cult centre of Thoth — 'great, great, great', the epithet behind 'Trismegistus'.", None),
    ("alexandria", "Alexandria", "antiquity", 31.20, 29.92, "The Hermetica", "c. 100–300 CE", "Greek questions, Egyptian answers: the world that wrote the Corpus.", "/path/03-alexandria/"),
    ("panopolis", "Panopolis", "antiquity", 26.57, 31.74, "Zosimos", "c. 300 CE", "Home of the first alchemist known by name.", None),
    ("nag-hammadi", "Nag Hammadi", "antiquity", 26.05, 32.24, "The 1945 finds", "buried c. 4th c.", "The jar that held the Hermetic ritual texts for 1,600 years.", None),
    ("harran", "Harran", "islam", 36.87, 39.03, "The Sabians", "8th–10th c.", "Where Hermes was claimed as a prophet — and a famous legend was born (and debunked).", None),
    ("baghdad", "Baghdad", "islam", 33.31, 44.37, "Jabir corpus", "c. 850–950", "Alchemy's Arabic engine room; the Emerald Tablet's first documented home.", "/texts/emerald-tablet/"),
    ("cordoba", "Córdoba", "islam", 37.89, -4.78, "Maslama al-Qurtubi", "d. 964", "Author of the Ghayat al-Hakim — the future Picatrix.", None),
    ("toledo", "Toledo", "islam", 39.86, -4.03, "The translators", "12th–13th c.", "The gate where Arabic Hermes entered Latin Europe.", None),
    ("florence", "Florence", "renaissance", 43.77, 11.26, "Ficino · Pico · the Medici", "1463 →", "Plato told to wait: the translation that lit the Renaissance.", "/path/01-what-is-hermeticism/"),
    ("rome", "Rome", "renaissance", 41.90, 12.50, "Lazzarelli · Bruno's trial", "1484 · 1600", "A street prophet hailed as Hermes reborn — and a heretic burned, though not for science.", None),
    ("london", "London (Mortlake)", "renaissance", 51.47, -0.27, "John Dee", "1527–1608", "The queen's magus and his angel diaries.", None),
    ("prague", "Prague", "renaissance", 50.09, 14.42, "Rudolf II's court", "late 16th c.", "Europe's occult capital under the Habsburg collector-emperor.", None),
    ("frankfurt", "Frankfurt", "renaissance", 50.11, 8.68, "Musaeum Hermeticum", "1625/1678", "The Baroque alchemical anthology.", None),
    ("cambridge", "Cambridge", "renaissance", 52.21, 0.12, "Isaac Newton", "1680s–90s", "Keynes MS 28: Newton's own Emerald Tablet, in his own hand.", "/texts/emerald-tablet/"),
    ("chicago", "Chicago", "modern", 41.88, -87.63, "The Kybalion", "1908", "Where the internet's favourite 'ancient text' was actually written.", "/texts/kybalion/"),
    ("amsterdam", "Amsterdam", "modern", 52.37, 4.90, "HHP · Hanegraaff", "1999 →", "Where Hermeticism became a university discipline.", None),
]
_LON0, _LON1, _LAT0, _LAT1 = -100.0, 52.0, 20.0, 60.0
_W, _H = 1000, 560
def _xy(lat, lon):
    x = (lon - _LON0) / (_LON1 - _LON0) * (_W - 80) + 40
    y = (_LAT1 - lat) / (_LAT1 - _LAT0) * (_H - 90) + 30
    return round(x, 1), round(y, 1)

def _atlas_body():
    land = open(os.path.join(ROOT, 'assets/atlas-land-path.txt')).read()
    pts = {p[0]: _xy(p[3], p[4]) for p in PLACES}
    # rozsunięcie kolizji (wzorzec FitStyle)
    placed = []
    for pid in pts:
        x, y = pts[pid]
        near = sum(1 for q in placed if ((q[0]-x)**2 + (q[1]-y)**2) ** .5 < 26)
        if near: x, y = x + near*20, y - near*14
        pts[pid] = (x, y); placed.append((x, y))
    era_color = {k: c for k, _, c in ERAS}
    route = " ".join(f"{'M' if i==0 else 'L'}{pts[p[0]][0]} {pts[p[0]][1]}" for i, p in enumerate(PLACES))
    grid = "".join(f'<line x1="{40+i*(_W-80)/8}" y1="30" x2="{40+i*(_W-80)/8}" y2="{_H-60}"/>' for i in range(9)) + \
           "".join(f'<line x1="40" y1="{30+i*(_H-90)/5}" x2="{_W-40}" y2="{30+i*(_H-90)/5}"/>' for i in range(6))
    regions = [("EGYPT", 31.5, 23.2), ("MESOPOTAMIA", 39.5, 41.2), ("IBERIA", -5.5, 43.2), ("ITALY", 12, 39.2),
               ("ENGLAND", -9.5, 56.2), ("CENTRAL EUROPE", 13.5, 54.6), ("THE NEW WORLD", -87, 45.5)]
    reg_lbl = "".join(f'<text class="atl__region" x="{_xy(la, lo)[0]}" y="{_xy(la, lo)[1]}">{n}</text>' for n, lo, la in regions)
    # etykiety rozsuwane ręcznie w skupiskach (wzorzec OFFSET z FitStyle/Caterelo)
    LBL = {"cambridge": (-46, -4), "amsterdam": (46, -6), "london": (-52, 8), "frankfurt": (-46, 16),
           "prague": (34, 18), "florence": (-38, 2), "rome": (30, 16), "hermopolis": (-50, 4),
           "panopolis": (50, 2), "nag-hammadi": (14, 28), "alexandria": (-14, -6), "baghdad": (16, -2)}
    pins = ""
    for pid, name, era, lat, lon, who, yrs, desc, link in PLACES:
        x, y = pts[pid]
        dx, dy = LBL.get(pid, (0, 0))
        pins += (f'<g class="atl__pin" data-place="{pid}" data-era="{era}" tabindex="0" role="button" '
                 f'aria-label="{name} — {who}"><circle cx="{x}" cy="{y}" r="7" fill="{era_color[era]}"/>'
                 f'<circle class="atl__halo" cx="{x}" cy="{y}" r="13" fill="none" stroke="{era_color[era]}"/>'
                 f'<text x="{x+dx}" y="{y-14+dy}">{name}</text></g>')
    chips = '<button class="atl__chip is-on" data-filter="all">All <b>{}</b></button>'.format(len(PLACES))
    for k, label, c in ERAS:
        n = sum(1 for p in PLACES if p[2] == k)
        chips += f'<button class="atl__chip" data-filter="{k}" style="--c:{c}">{label} <b>{n}</b></button>'
    rows = ""
    for pid, name, era, lat, lon, who, yrs, desc, link in PLACES:
        head = f'<a href="{link}">{name}</a>' if link else name
        rows += (f'<li class="atl__row" data-place="{pid}" data-era="{era}">'
                 f'<span class="atl__dot" style="--c:{era_color[era]}"></span>'
                 f'<div><b>{head}</b><em>{who} · {yrs}</em><span>{desc}</span></div></li>')
    return f'''
<p>Sixteen places, seventeen centuries, one relay of ideas — from the temples of Egypt to a Chicago
publishing house and back to a university in Amsterdam. Follow the golden line.</p>
<div class="atl">
  <div class="atl__chips">{chips}</div>
  <div class="atl__grid">
    <svg class="atl__map" viewBox="0 0 {_W} {_H}" aria-label="Map of the Hermetic tradition">
      <defs><filter id="brush"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter></defs>
      <path class="atl__land" d="{land}" filter="url(#brush)"/>
      <g class="atl__graticule">{grid}</g>
      {reg_lbl}
      <path class="atl__route" d="{route}" fill="none"/>
      {pins}
    </svg>
    <ol class="atl__list">{rows}</ol>
  </div>
</div>
<script>
(function(){{
  const pins=[...document.querySelectorAll('.atl__pin')], rows=[...document.querySelectorAll('.atl__row')];
  const sync=(pid,on)=>{{
    pins.forEach(p=>p.classList.toggle('is-hot',on&&p.dataset.place===pid));
    rows.forEach(r=>r.classList.toggle('is-hot',on&&r.dataset.place===pid));
  }};
  rows.forEach(r=>{{r.addEventListener('mouseenter',()=>sync(r.dataset.place,true));
    r.addEventListener('mouseleave',()=>sync(null,false));}});
  pins.forEach(p=>{{p.addEventListener('mouseenter',()=>sync(p.dataset.place,true));
    p.addEventListener('mouseleave',()=>sync(null,false));
    p.addEventListener('click',()=>{{const r=rows.find(x=>x.dataset.place===p.dataset.place);
      r?.scrollIntoView({{block:'center',behavior:'smooth'}});sync(p.dataset.place,true);
      setTimeout(()=>sync(null,false),1600);}});}});
  document.querySelectorAll('.atl__chip').forEach(ch=>ch.addEventListener('click',()=>{{
    document.querySelectorAll('.atl__chip').forEach(c=>c.classList.remove('is-on'));
    ch.classList.add('is-on');const f=ch.dataset.filter;
    pins.forEach(p=>p.classList.toggle('is-dim',f!=='all'&&p.dataset.era!==f));
    rows.forEach(r=>{{r.hidden=f!=='all'&&r.dataset.era!==f;}});
  }}));
}})();
</script>'''

page("atlas",
  crumb="Atlas", kicker="The Atlas", title="The Atlas — a world map of the Hermetic tradition",
  desc="An interactive map of Hermeticism: sixteen places from Hermopolis and Alexandria through Baghdad, Toledo and Florence to Chicago and Amsterdam.",
  h1="One idea.<br>Seventeen centuries of addresses.",
  tldr="The Hermetic tradition is a relay across the map: written in Roman Egypt, preserved in Arabic, translated in Toledo, reborn in Florence, reinvented in Chicago, studied in Amsterdam. Hover the line; click an era.",
  ld=[ART("The Atlas — a world map of the Hermetic tradition", "Sixteen places of the Hermetic relay.")],
  body=_atlas_body())


# ── strony z content/*.json (produkcja treści przez agentów; build tylko scala) ──
import glob as _glob
CDIR = os.path.join(ROOT, 'content')
if os.path.isdir(CDIR):
    for _fp in sorted(_glob.glob(CDIR + '/*.json')):
        d = json.load(open(_fp))
        lt = d.pop('ld_type', None); ln = d.pop('ld_name', None)
        ld = [ART(d['title'], d['desc'])]
        if lt == 'Person': ld.append(PERSON(ln or d['crumb']))
        elif lt == 'Book': ld.append(BOOK(ln or d['crumb']))
        elif lt == 'DefinedTerm': ld.append(TERM(ln or d['crumb'], d['desc']))
        d['ld'] = ld
        for k in ('trail', 'facts', 'faq', 'media'):
            if k in d: d[k] = [tuple(x) for x in d[k]]
        img = d.pop('img', None)
        pth = d.pop('path')
        if img: IMGS[pth] = img
        if not any(p['path'] == pth for p in PAGES):
            page(pth, **d)


page("privacy",
  crumb="Privacy", kicker="The fine print", title="Privacy — what we collect and why",
  desc="The Hermeticum privacy policy: your e-mail for the letter, cookieless analytics, no ad tracking, unsubscribe anytime.",
  h1="Privacy, plainly",
  tldr="We collect your e-mail if you subscribe (stored with our mailing provider, Resend), and anonymous cookieless page statistics. No ad trackers, no profiles, no selling anything to anyone.",
  body='''
<h2>What we collect</h2>
<p><strong>Your e-mail address</strong> &mdash; only if you subscribe to As Above. It is stored with our mailing
provider (Resend Inc.) solely to send you the letter. Every letter contains an unsubscribe link; unsubscribing
removes you from the list.</p>
<p><strong>Anonymous usage statistics</strong> &mdash; we use cookieless analytics (Vercel Web Analytics) to count
visits and see which pages are read, plus Google Analytics running in consent-denied mode &mdash; without
consent it sets no cookies and sends only anonymous, aggregated pings. It identifies no one.</p>
<h2>What we don&rsquo;t do</h2>
<p>No advertising trackers. No sale or sharing of your data. No profiling. Embedded videos load only after you
press play (via YouTube&rsquo;s privacy-enhanced mode).</p>
<h2>Your rights</h2>
<p>Ask us at any time to see or delete your data &mdash; reply to any letter, or write to the address in its footer.
This site is operated from the European Union; GDPR applies.</p>''')


# korekty długości title/desc (audyt SEO 14.08; wzorzec DailyFruits)
SEO_PATCH = {
  "atlas": ("The Atlas — map of the Hermetic tradition", None),
  "figures/frances-yates": ("Frances Yates — the thesis and its afterlife", None),
  "figures/giordano-bruno": ("Giordano Bruno — not the martyr you think", None),
  "figures/john-dee": ("John Dee — the queen's mathematician-magus", None),
  "figures/lodovico-lazzarelli": ("Lodovico Lazzarelli — the purest Hermetist", None),
  "figures/marsilio-ficino": ("Marsilio Ficino — the man who lit the fuse", None),
  "figures/pico-della-mirandola": ("Pico della Mirandola — the 900 theses", None),
  "figures/thoth": ("Thoth — the god behind Hermes Trismegistus", None),
  "ideas/hermeticism-and-its-neighbours": ("Hermeticism vs Gnosticism & the rest", None),
  "ideas": ("The Ideas — Hermetic glossary, sourced", None),
  "ideas/prisca-theologia": ("Prisca theologia — the first-wisdom myth", None),
  "texts/corpus-hermeticum": ("Corpus Hermeticum — guide to the treatises",
    "The Corpus Hermeticum: seventeen Greek treatises from Roman Egypt — dating, contents, the 'missing Book XV' myth, and which translation to read."),
  "texts/emerald-tablet": ("The Emerald Tablet — the real origin",
    "The Emerald Tablet is first attested in Arabic (8th-9th c.) — no Greek original, no emerald. The real history, the Latin text, Newton's own copy."),
  "texts/kybalion": ("The Kybalion — 1908, read with care",
    "The Kybalion (1908) was written by W.W. Atkinson, not ancient masters. What its seven principles are, where they come from, how to read it honestly."),
  "texts/musaeum-hermeticum": ("Musaeum Hermeticum — the 1625 anthology", None),
  "texts/stobaean-fragments": ("Stobaean Fragments — the Kore Kosmou", None),
  "about/method": (None,
    "Our method: three layers — fact, scholarly debate, reception and myth — named sources with dates, honest gaps, corrections in the open."),
  "ideas/as-above-so-below": (None,
    "'As above, so below' comes from the Emerald Tablet's Latin — an 8th-9th c. Arabic text — and the famous wording is a 19th-century paraphrase."),
  "path/01-what-is-hermeticism": (None,
    "Hermeticism explained honestly: ancient Greek-Egyptian texts, the Renaissance revival, occult orders and a 1908 book — four things, one word."),
}
for p in PAGES:
    t_d = SEO_PATCH.get(p["path"])
    if t_d:
        if t_d[0]: p["title"] = t_d[0]
        if t_d[1]: p["desc"] = t_d[1]

# llms.txt — mapa serwisu dla silników generatywnych (wzorzec DailyFruits/GEO)
llms = "# The Hermeticum\n\n> A modern gateway to the Hermetic tradition: serious history, real sources, no fortune-telling. Every page separates established fact, scholarly debate, and reception/myth, with citations.\n\n"
llms += "## Core\n- [Start Here](%s/start-here/): orientation for newcomers\n- [The Path](%s/path/): twelve-step guided route from zero to the sources\n- [Method](%s/about/method/): our sourcing and correction rules\n- [The Atlas](%s/atlas/): map of the tradition, Hermopolis to Amsterdam\n\n## Reference\n" % (SITE, SITE, SITE, SITE)
for p in sorted(PAGES, key=lambda x: x["url"]):
    if p["path"].count("/") >= 1 and not p["path"].startswith(("about", "privacy")):
        llms += f"- [{p['title']}]({SITE}{p['url']}): {p['desc']}\n"
open(os.path.join(ROOT, "llms.txt"), "w").write(llms)
print("llms.txt written")

# ── zapis ──
written = []
for p in PAGES:
    d = os.path.join(ROOT, p["path"])
    os.makedirs(d, exist_ok=True)
    out = os.path.join(d, "index.html")
    open(out, "w").write(render(p))
    written.append(p["path"])
print(f"OK: {len(written)} stron:", ", ".join(written))

# ── AEO/SEO: sitemap, robots, rss, 404 ──
today = "2026-08-14"
urls = ["/"] + [p["url"] for p in PAGES]
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for u in urls:
    sm += f"  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod></url>\n"
sm += "</urlset>\n"
open(os.path.join(ROOT, "sitemap.xml"), "w").write(sm)

open(os.path.join(ROOT, "robots.txt"), "w").write(
    "User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % SITE)

items = ""
for p in PAGES:
    if p["path"].count("/") >= 1 or p["path"] in ("start-here",):
        items += (f"<item><title>{H.escape(p['title'])}</title><link>{SITE}{p['url']}</link>"
                  f"<guid>{SITE}{p['url']}</guid><description>{H.escape(p['desc'])}</description></item>\n")
open(os.path.join(ROOT, "rss.xml"), "w").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>'
    f'<title>The Hermeticum</title><link>{SITE}</link>'
    '<description>Serious history of the Hermetic tradition — real sources, no fortune-telling.</description>\n'
    + items + "</channel></rss>\n")

open(os.path.join(ROOT, "404.html"), "w").write(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Not found — The Hermeticum</title><meta name="robots" content="noindex">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital@0;1&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=9"></head><body>
{HEADER}
<main><article class="art"><div class="container art__in">
<p class="kicker">404</p><h1 class="art__h1">This page is hermetically sealed.</h1>
<p>Or, more honestly: it doesn&rsquo;t exist. The knowledge you seek may be elsewhere —
try the <a href="/">home page</a>, <a href="/path/">the Path</a>, or press <b>&#8984;K</b> and search the Index.</p>
</div></article></main>{FOOTER}<script src="/assets/site.js?v=9" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-P0HHD2HX20"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}
gtag('consent','default',{{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'}});
gtag('js',new Date());gtag('config','G-P0HHD2HX20',{{anonymize_ip:true}});
</script></body></html>""")
print("sitemap/robots/rss/404 written")
