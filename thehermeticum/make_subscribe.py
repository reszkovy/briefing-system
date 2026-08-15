#!/usr/bin/env python3
"""Osobna strona zapisu: list, książka, narzędzie i etapy — każdy opisany z osobna."""
import os, html as H

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://thehermeticum.com"
V = "102"

def _slice(s, a, b):
    i = s.index(a); j = s.index(b, i) + len(b); return s[i:j]

IDX = {'en': open(os.path.join(ROOT, 'index.html')).read(),
       'pl': open(os.path.join(ROOT, 'index-pl.html')).read()}
HDR = {k: _slice(v, '<header class="hdr" data-hdr>', '</header>') for k, v in IDX.items()}
FTR = {k: _slice(v, '<footer class="foot">', '</footer>') for k, v in IDX.items()}

T = {
 'en': dict(
  title='Subscribe — the letter, the book, the practice',
  desc='One weekly letter, a book you can read in full, and a private practice tool. What each one is, what it costs, and what we will never do with your address.',
  kicker='Subscribe', h1='One letter.<br>One book. One practice.',
  lead='Three separate things, and you can take any of them without the others. Nothing here requires an account, and nothing sends your writing anywhere.',
  l_k='The Letter · weekly', l_h='One pattern, one source, one practice',
  l_d='Every Sunday, one short letter with a fixed shape: a pattern worth noticing, a source you can check yourself, a practice small enough for an ordinary week, and a record worth keeping. It begins with Pre-AI Orientation — five questions before you delegate a problem to a model.',
  l_pts=['Fixed structure, no filler', 'Sources named with dates and editions', 'Fifteen minutes, once a week', 'Unsubscribe in one click'],
  l_lab='Your e-mail', l_btn='Get the first practice', l_ok='You’re in. The first letter carries Pre-AI Orientation.',
  b_k='The Book', b_h='Operational Hermeticism',
  b_d='Twelve chapters and an opening: attention, energy, self-knowledge, pattern, systems, planning, relationships, technology, alignment, transmutation, agency, integration. Each chapter separates what the source says from how we read it, translates it into decisions, checks it against the body, gives a seven-day practice, and names its own limits and ethical cost.',
  b_open='Open to read now: the opening, Attention, Energy — plus every chapter’s shape and its opening signal.',
  b_meta='About 37,000 words · 146 pages set in A5 · PDF and EPUB in preparation',
  b_lab='Send me the edition', b_btn='Notify me', b_ok='You’re on the list. We’ll write when the files are ready.',
  b_note='We write once, when the edition is ready — with a founding price for the list.',
  b_link='Read the open chapters',
  p_k='The Practice · free', p_h='Five minutes, in your browser',
  p_d='A daily practice with three moments: a short orientation in the morning, optional resets during the day, a close in the evening. Entries stay in your browser — no account, no server. Export as Markdown, or hand it to a model with instructions that keep the judgement yours.',
  p_link='Open The Practice',
  s_k='How the parts fit', s_h='Where to start, and what comes after',
  stages=[('01','Read something open','Any open chapter, or the sources in the Archive. Cost: nothing, not even an address.'),
          ('02','Run one practice','Five minutes in The Practice. This is where reading becomes something you can check.'),
          ('03','Take the letter','One pattern, one source, one practice each week — the rhythm that makes it a habit rather than an afternoon.'),
          ('04','Keep the book','The whole method in one file, when the edition is ready.'),
          ('05','Guided practice','Later: workbook, cohorts, practice with feedback. Structure and presence are what we will charge for — never access to the ideas.')],
  pr_k='What we do with your address', pr_h='Very little',
  pr=['We keep it with our mail provider to send the letter, and nothing else.',
      'No profiling, no advertising, no selling or sharing.',
      'Your practice entries never reach us — they stay in your browser.',
      'One click to leave, and no “are you sure” sequence.'],
  pr_link='Privacy in full'),
 'pl': dict(
  title='Zapis — list, książka, praktyka',
  desc='Jeden cotygodniowy list, książka do przeczytania w całości i prywatne narzędzie praktyki. Czym każde z nich jest, ile kosztuje i czego nigdy nie zrobimy z Twoim adresem.',
  kicker='Zapis', h1='Jeden list.<br>Jedna książka. Jedna praktyka.',
  lead='Trzy osobne rzeczy — możesz wziąć każdą z nich bez pozostałych. Nic tu nie wymaga konta i nic nie wysyła Twoich zapisów na zewnątrz.',
  l_k='List · co tydzień', l_h='Jeden wzór, jedno źródło, jedna praktyka',
  l_d='W każdą niedzielę krótki list o stałym kształcie: wzór wart zauważenia, źródło, które możesz sprawdzić sam, praktyka dość mała, żeby zmieścić się w zwykłym tygodniu, i zapis wart zachowania. Zaczyna się od Orientacji przed AI — pięciu pytań, zanim oddasz problem modelowi.',
  l_pts=['Stała struktura, bez zapychaczy', 'Źródła z datą i wydaniem', 'Kwadrans, raz w tygodniu', 'Wypisujesz się jednym kliknięciem'],
  l_lab='Twój e-mail', l_btn='Odbierz pierwszą praktykę', l_ok='Jesteś na liście. Pierwszy list niesie Orientację przed AI.',
  b_k='Książka', b_h='Hermetyzm operacyjny',
  b_d='Dwanaście rozdziałów i otwarcie: uwaga, energia, samoświadomość, wzór, systemy, planowanie, relacje, technologia, zgodność, transmutacja, sprawczość, integracja. Każdy rozdział oddziela to, co mówi źródło, od tego, jak my je czytamy, przekłada to na decyzje, sprawdza w ciele, daje siedmiodniową praktykę i nazywa własne granice oraz koszt etyczny.',
  b_open='Otwarte od razu: otwarcie, Uwaga, Energia — a przy każdym rozdziale jego kształt i sygnał otwarcia.',
  b_meta='Około 30 000 słów · 142 strony w składzie A5 · PDF i EPUB w przygotowaniu',
  b_lab='Wyślijcie mi wydanie', b_btn='Zapisz mnie', b_ok='Jesteś na liście. Napiszemy, gdy pliki będą gotowe.',
  b_note='Piszemy raz, gdy wydanie będzie gotowe — z ceną założycielską dla zapisanych.',
  b_link='Czytaj otwarte rozdziały',
  p_k='The Practice · za darmo', p_h='Pięć minut, w przeglądarce',
  p_d='Codzienna praktyka w trzech momentach: krótka orientacja rano, opcjonalne resety w ciągu dnia, zamknięcie wieczorem. Wpisy zostają w Twojej przeglądarce — bez konta, bez serwera. Eksportuj do Markdown albo oddaj modelowi razem z instrukcją, która zostawia osąd przy Tobie.',
  p_link='Otwórz The Practice',
  s_k='Jak to się składa', s_h='Od czego zacząć i co jest dalej',
  stages=[('01','Przeczytaj coś otwartego','Dowolny otwarty rozdział albo źródła w Archiwum. Koszt: żaden, nawet nie adres.'),
          ('02','Zrób jedną praktykę','Pięć minut w The Practice. Tu lektura staje się czymś, co da się sprawdzić.'),
          ('03','Weź list','Jeden wzór, jedno źródło, jedna praktyka co tydzień — rytm, który robi z tego nawyk, a nie popołudnie.'),
          ('04','Zatrzymaj książkę','Cała metoda w jednym pliku, gdy wydanie będzie gotowe.'),
          ('05','Prowadzona praktyka','Później: workbook, kohorty, praktyka z informacją zwrotną. Płatne będą struktura i obecność — nigdy dostęp do samych idei.')],
  pr_k='Co robimy z Twoim adresem', pr_h='Bardzo niewiele',
  pr=['Trzymamy go u dostawcy poczty, żeby wysłać list — i nic poza tym.',
      'Bez profilowania, bez reklamy, bez sprzedaży i udostępniania.',
      'Twoje wpisy z praktyki nigdy do nas nie trafiają — zostają w przeglądarce.',
      'Wyjście jednym kliknięciem, bez sekwencji „czy na pewno”.'],
  pr_link='Pełna polityka prywatności'),
}

def build(lang):
    t = T[lang]; pre = '/pl' if lang == 'pl' else ''
    L = lang == 'pl'
    ph = 'ty@praca.pl' if L else 'you@work.com'
    rows = [
      (t['l_k'], t['l_h'], ('Co tydzień jeden krótki list o stałym kształcie. Zaczyna się od Orientacji przed AI.' if L
        else 'One short letter a week, always the same shape. It begins with Pre-AI Orientation.')),
      (t['b_k'], t['b_h'], ('Dwanaście rozdziałów i otwarcie. Trzy teksty są otwarte od razu; PDF i EPUB w przygotowaniu.' if L
        else 'Twelve chapters and an opening. Three texts are open now; PDF and EPUB in preparation.')),
      (t['p_k'], t['p_h'], ('Pięć minut dziennie w przeglądarce. Bez konta, bez adresu, bez serwera.' if L
        else 'Five minutes a day in your browser. No account, no address, no server.')),
    ]
    rows_html = ''.join(
      f'<li><p class="sbp__rk">{k}</p><p class="sbp__rh">{h}</p><p class="sbp__rd">{d}</p></li>'
      for k, h, d in rows)
    opts = (('Cotygodniowy list', 'Powiadomienie o wydaniu książki') if L
            else ('The weekly letter', 'Notice when the book edition is ready'))
    html = f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(t['title'])} — The Hermeticum</title>
<meta name="description" content="{H.escape(t['desc'])}">
<link rel="canonical" href="{SITE}{pre}/subscribe/">
<link rel="alternate" hreflang="en" href="{SITE}/subscribe/">
<link rel="alternate" hreflang="pl" href="{SITE}/pl/subscribe/">
<link rel="alternate" hreflang="x-default" href="{SITE}/subscribe/">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="{H.escape(t['title'])}">
<meta property="og:description" content="{H.escape(t['desc'])}">
<meta property="og:url" content="{SITE}{pre}/subscribe/">
<meta property="og:image" content="{SITE}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"WebPage","name":"{H.escape(t['title'])}","description":"{H.escape(t['desc'])}","url":"{SITE}{pre}/subscribe/","inLanguage":"{lang}","isPartOf":{{"@type":"WebSite","name":"The Hermeticum","url":"{SITE}"}}}}</script>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v={V}">
<script src="/assets/site.js?v={V}" defer></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-P0HHD2HX20"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}
gtag('consent','default',{{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'}});
gtag('js',new Date());gtag('config','G-P0HHD2HX20',{{anonymize_ip:true}});
</script>
</head><body>
{HDR[lang]}
<main class="sbp">
  <div class="container sbp__stage">
    <div class="sbp__left">
      <p class="kicker">{t['kicker']}</p>
      <h1 class="sbp__h1">{t['h1']}</h1>
      <p class="sbp__lead">{t['lead']}</p>
      <ol class="sbp__rows">{rows_html}</ol>
      <p class="sbp__foot"><a href="{pre}/practice/">{t['p_link']} &rarr;</a> <span>·</span>
        <a href="{pre}/book/">{t['b_link']} &rarr;</a></p>
    </div>
    <form class="sub__form sbp__form" data-sub-form data-list="letter">
      <p class="sbp__fh">{'Zapisz się' if L else 'Subscribe'}</p>
      <label class="sub__label" for="sbp-mail">{t['l_lab']}</label>
      <input class="sub__input" id="sbp-mail" type="email" required placeholder="{ph}">
      <div class="sbp__opts">
        <label><input type="checkbox" data-list-opt="letter" checked> {opts[0]}</label>
        <label><input type="checkbox" data-list-opt="book"> {opts[1]}</label>
      </div>
      <button class="btn sub__btn" type="submit">{t['l_btn']}</button>
      <p class="sub__note">{'Za darmo · Ze źródłami · Bez hałasu · Wypisujesz się jednym kliknięciem' if L else 'Free · Cited · No noise · Unsubscribe in one click'}</p>
      <p class="sub__ok" hidden>{t['l_ok']}</p>
      <p class="sbp__priv">{'Adres trzymamy u dostawcy poczty i nic poza tym. Wpisy z praktyki nigdy do nas nie trafiają.' if L else 'We keep the address with our mail provider and nothing else. Your practice entries never reach us.'}
        <a href="{pre}/privacy/">{t['pr_link']} &rarr;</a></p>
    </form>
  </div>
</main>
{FTR[lang]}
</body></html>'''
    d = os.path.join(ROOT, 'pl' if lang == 'pl' else '', 'subscribe')
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w').write(html)
    print(f'{lang}: {pre}/subscribe/ (jeden widok)')

for l in ('en', 'pl'):
    build(l)
