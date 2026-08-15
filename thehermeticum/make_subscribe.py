#!/usr/bin/env python3
"""Osobna strona zapisu: list, książka, narzędzie i etapy — każdy opisany z osobna."""
import os, html as H

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://thehermeticum.com"
V = "47"

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
    ph = 'ty@praca.pl' if lang == 'pl' else 'you@work.com'
    pts = ''.join(f'<li>{x}</li>' for x in t['l_pts'])
    prs = ''.join(f'<li>{x}</li>' for x in t['pr'])
    stages = ''.join(f'<li><i>{n}</i><b>{h}</b><span>{d}</span></li>' for n, h, d in t['stages'])
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
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v={V}">
<script src="/assets/site.js?v={V}" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-P0HHD2HX20"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}
gtag('consent','default',{{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'}});
gtag('js',new Date());gtag('config','G-P0HHD2HX20',{{anonymize_ip:true}});
</script>
</head><body>
{HDR[lang]}
<main class="sbp">
  <div class="container sbp__in">
    <p class="kicker">{t['kicker']}</p>
    <h1 class="sbp__h1">{t['h1']}</h1>
    <p class="lead">{t['lead']}</p>
  </div>

  <section class="sbp__block">
    <div class="container sbp__grid">
      <div class="sbp__txt">
        <p class="kicker">{t['l_k']}</p>
        <h2 class="h2">{t['l_h']}</h2>
        <p>{t['l_d']}</p>
        <ul class="sbp__pts">{pts}</ul>
      </div>
      <form class="sub__form sbp__form" data-sub-form data-list="letter">
        <label class="sub__label" for="sbp-letter">{t['l_lab']}</label>
        <div class="sub__row">
          <input class="sub__input" id="sbp-letter" type="email" required placeholder="{ph}">
          <button class="btn sub__btn" type="submit">{t['l_btn']}</button>
        </div>
        <p class="sub__note">{'Za darmo · Ze źródłami · Bez hałasu' if lang=='pl' else 'Free · Cited · No noise'}</p>
        <p class="sub__ok" hidden>{t['l_ok']}</p>
      </form>
    </div>
  </section>

  <section class="sbp__block sbp__block--alt">
    <div class="container sbp__grid">
      <div class="sbp__txt">
        <p class="kicker">{t['b_k']}</p>
        <h2 class="h2">{t['b_h']}</h2>
        <p>{t['b_d']}</p>
        <p class="sbp__open">{t['b_open']}</p>
        <p class="sbp__meta">{t['b_meta']}</p>
        <p><a class="hero__alt" href="{pre}/book/">{t['b_link']} &rarr;</a></p>
      </div>
      <form class="sub__form sbp__form" data-sub-form data-list="book-waitlist">
        <label class="sub__label" for="sbp-book">{t['b_lab']}</label>
        <div class="sub__row">
          <input class="sub__input" id="sbp-book" type="email" required placeholder="{ph}">
          <button class="btn sub__btn" type="submit">{t['b_btn']}</button>
        </div>
        <p class="sub__note">{t['b_note']}</p>
        <p class="sub__ok" hidden>{t['b_ok']}</p>
      </form>
    </div>
  </section>

  <section class="sbp__block">
    <div class="container sbp__grid">
      <div class="sbp__txt">
        <p class="kicker">{t['p_k']}</p>
        <h2 class="h2">{t['p_h']}</h2>
        <p>{t['p_d']}</p>
        <p><a class="btn" href="{pre}/practice/">{t['p_link']}</a></p>
      </div>
      <div></div>
    </div>
  </section>

  <section class="sbp__block sbp__block--alt">
    <div class="container">
      <p class="kicker">{t['s_k']}</p>
      <h2 class="h2">{t['s_h']}</h2>
      <ol class="sbp__stages">{stages}</ol>
    </div>
  </section>

  <section class="sbp__block">
    <div class="container sbp__privacy">
      <p class="kicker">{t['pr_k']}</p>
      <h2 class="h2">{t['pr_h']}</h2>
      <ul class="sbp__pts">{prs}</ul>
      <p><a class="hero__alt" href="{pre}/privacy/">{t['pr_link']} &rarr;</a></p>
    </div>
  </section>
</main>
{FTR[lang]}
</body></html>'''
    d = os.path.join(ROOT, 'pl' if lang == 'pl' else '', 'subscribe')
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w').write(html)
    print(f'{lang}: {pre}/subscribe/')

for l in ('en', 'pl'):
    build(l)
