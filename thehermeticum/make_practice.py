#!/usr/bin/env python3
"""The Practice — generator stron (EN + PL). Nie dotyka adresów Path/Archive/Book."""
import os, html as H

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://thehermeticum.com"
V = "39"

def _slice(s, a, b):
    i = s.index(a); j = s.index(b, i) + len(b); return s[i:j]

IDX = {'en': open(os.path.join(ROOT, 'index.html')).read(),
       'pl': open(os.path.join(ROOT, 'index-pl.html')).read()}
HDR = {k: _slice(v, '<header class="hdr" data-hdr>', '</header>') for k, v in IDX.items()}
FTR = {k: _slice(v, '<footer class="foot">', '</footer>') for k, v in IDX.items()}

L = {
 'en': dict(
   name='The Practice', pre='',
   promise='Five minutes of reflection. One clear record. Yours to keep, or to use with the AI of your choice.',
   diff='<b>The Path</b> carries the method. <b>The Archive</b> holds the sources. <b>The Practice</b> applies it to one concrete day.',
   privacy='Your entries remain in this browser. Nothing is sent to The Hermeticum or to any AI unless you export it yourself.',
   rules='No account · Local data · No AI required',
   archive_link='Open the archive', cta_default='Begin today’s practice',
   today_h='Today’s practice', today_s='Read → Align → Act → Transmute. Every question can be skipped; answers save themselves.',
   beginH='Begin', beginS='Two or three minutes. Any question can be skipped.',
   q_state='What is your current state?', q_matters='What matters most today?', q_not='What will you deliberately not do today?',
   energy='Energy (optional)', energyNote='Not a score for a good or bad day — just a reference point.',
   midH='During the day', midS='Optional protocols. Use them when you need them; each one is stamped with the time.',
   addReset='Add attention reset', addAi='Add pre-AI orientation',
   closeH='Close', closeS='About five minutes, in the evening.',
   c_happened='What actually happened?', c_energy='What changed your energy?', c_pattern='What pattern did you notice?',
   c_change='What will you continue, change or end?', c_unsolved='What does not need to be solved tonight?', c_next='What is the next action?',
   finish='Close the day', download='Download daily record (.md)', copyAI='Copy for AI',
   doneH='The day is recorded', doneS='Keep it, export it, or hand it to a model with instructions that keep the judgement yours.',
   arch_h='Archive', arch_s='Every day you have recorded, newest first. Records live only in this browser — export what you want to keep.',
   exportAll='Export everything', deleteAll='Delete all data',
   warn='Clearing your browser data will remove these records. Export from time to time.',
   backTitle='The Practice'),
 'pl': dict(
   name='The Practice', pre='/pl',
   promise='Pięć minut refleksji. Jeden czytelny zapis. Twój — do zachowania albo do pracy z wybranym AI.',
   diff='<b>Ścieżka</b> niesie metodę. <b>Archiwum</b> trzyma źródła. <b>The Practice</b> stosuje ją do jednego konkretnego dnia.',
   privacy='Twoje wpisy pozostają w tej przeglądarce. Nic nie jest wysyłane do The Hermeticum ani do AI, dopóki sam tego nie wyeksportujesz.',
   rules='Bez konta · Dane lokalnie · AI niewymagane',
   archive_link='Otwórz archiwum', cta_default='Zacznij dzisiejszą praktykę',
   today_h='Dzisiejsza praktyka', today_s='Czytaj → Ustaw → Działaj → Przekształcaj. Każde pytanie możesz pominąć; odpowiedzi zapisują się same.',
   beginH='Początek', beginS='Dwie, trzy minuty. Każde pytanie możesz pominąć.',
   q_state='Jaki jest teraz Twój stan?', q_matters='Co ma dziś największe znaczenie?', q_not='Czego świadomie dziś nie zrobisz?',
   energy='Energia (opcjonalnie)', energyNote='To nie jest ocena dobrego ani złego dnia — tylko punkt odniesienia.',
   midH='W ciągu dnia', midS='Protokoły opcjonalne. Uruchamiaj, kiedy są potrzebne; każdy zapisuje się z godziną.',
   addReset='Dodaj reset uwagi', addAi='Dodaj orientację przed AI',
   closeH='Zamknięcie', closeS='Około pięciu minut, wieczorem.',
   c_happened='Co faktycznie się wydarzyło?', c_energy='Co zmieniło Twoją energię?', c_pattern='Jaki wzór zauważyłeś?',
   c_change='Co będziesz kontynuować, zmieniać albo kończyć?', c_unsolved='Czego nie trzeba rozwiązywać dziś wieczorem?', c_next='Jaki jest następny ruch?',
   finish='Zamknij dzień', download='Pobierz zapis dnia (.md)', copyAI='Skopiuj dla AI',
   doneH='Dzień zapisany', doneS='Zachowaj go, wyeksportuj albo oddaj modelowi razem z instrukcją, która zostawia osąd przy Tobie.',
   arch_h='Archiwum', arch_s='Wszystkie zapisane dni, od najnowszego. Zapisy żyją tylko w tej przeglądarce — eksportuj to, co chcesz zachować.',
   exportAll='Eksportuj wszystko', deleteAll='Usuń wszystkie dane',
   warn='Wyczyszczenie danych przeglądarki usunie te zapisy. Eksportuj je od czasu do czasu.',
   backTitle='The Practice'),
}

def head(lang, title, desc, url, extra=''):
    return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(title)} — The Hermeticum</title>
<meta name="description" content="{H.escape(desc)}">
<link rel="canonical" href="{SITE}{url}">
<meta name="robots" content="{extra or 'index, follow'}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v={V}">
<script src="/assets/site.js?v={V}" defer></script>
<script src="/assets/practice.js?v={V}" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-P0HHD2HX20"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}
gtag('consent','default',{{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'}});
gtag('js',new Date());gtag('config','G-P0HHD2HX20',{{anonymize_ip:true}});
</script>
</head><body>'''

def field(fid, label, rows=3):
    return (f'<div class="pr__f"><label for="{fid}">{label}</label>'
            f'<textarea id="{fid}" rows="{rows}"></textarea></div>')

def build(lang):
    t = L[lang]; pre = t['pre']
    out = []

    # ── /practice ──
    p = head(lang, t['name'], t['promise'], f'{pre}/practice/') + HDR[lang] + f'''
<main class="pr pr--landing">
  <div class="container pr__in">
    <p class="kicker">{t['name']}</p>
    <h1 class="pr__h1">{t['promise']}</h1>
    <p class="pr__diff">{t['diff']}</p>
    <p class="pr__rules">{t['rules']}</p>
    <div class="hero__cta">
      <a class="btn" href="{pre}/practice/today/" data-practice-cta>{t['cta_default']}</a>
      <a class="hero__alt" href="{pre}/practice/archive/">{t['archive_link']} &rarr;</a>
    </div>
    <a class="pr__yesterday" href="#" data-yesterday hidden></a>
    <p class="pr__privacy">{t['privacy']}</p>
  </div>
</main>''' + FTR[lang] + '</body></html>'
    out.append((f'{"pl/" if lang=="pl" else ""}practice/index.html', p))

    # ── /practice/today ──
    body = head(lang, t['today_h'], t['promise'], f'{pre}/practice/today/', 'noindex, follow') + HDR[lang] + f'''
<main class="pr" data-practice-today>
  <div class="container pr__in">
    <p class="kicker"><a href="{pre}/practice/">{t['name']}</a></p>
    <h1 class="pr__h1">{t['today_h']}</h1>
    <p class="pr__sub">{t['today_s']}</p>
    <p class="pr__editing" data-editing hidden><span></span> · <a href="{pre}/practice/today/">{'Wróć do dzisiaj' if lang=='pl' else 'Back to today'}</a></p>
    <p class="pr__status" data-status aria-live="polite"></p>

    <section class="pr__sec">
      <h2>{t['beginH']}</h2><p class="pr__secS">{t['beginS']}</p>
      {field('q-state', t['q_state'])}
      {field('q-matters', t['q_matters'])}
      {field('q-not', t['q_not'])}
      <div class="pr__f pr__f--energy">
        <label for="q-energy">{t['energy']} <output data-energy-val></output></label>
        <input id="q-energy" type="range" min="1" max="10" step="1">
        <p class="pr__hint">{t['energyNote']}</p>
      </div>
    </section>

    <section class="pr__sec">
      <h2>{t['midH']}</h2><p class="pr__secS">{t['midS']}</p>
      <div data-protocols></div>
      <div class="pr__adds">
        <button class="pr__add" type="button" data-add="attention-reset">+ {t['addReset']}</button>
        <button class="pr__add" type="button" data-add="pre-ai">+ {t['addAi']}</button>
      </div>
    </section>

    <section class="pr__sec">
      <h2>{t['closeH']}</h2><p class="pr__secS">{t['closeS']}</p>
      {field('c-happened', t['c_happened'])}
      {field('c-energy', t['c_energy'])}
      {field('c-pattern', t['c_pattern'])}
      {field('c-change', t['c_change'])}
      {field('c-unsolved', t['c_unsolved'], 2)}
      {field('c-next', t['c_next'], 2)}
      <button class="btn" type="button" data-finish>{t['finish']}</button>
    </section>

    <section class="pr__done" data-done hidden>
      <h2>{t['doneH']}</h2>
      <p>{t['doneS']}</p>
      <div class="pr__adds">
        <button class="btn" type="button" data-download>{t['download']}</button>
        <button class="pr__add" type="button" data-copy>{t['copyAI']}</button>
        <a class="hero__alt" href="{pre}/practice/archive/">{t['archive_link']} &rarr;</a>
      </div>
    </section>
    <p class="pr__privacy">{t['privacy']}</p>
  </div>
</main>''' + FTR[lang] + '</body></html>'
    out.append((f'{"pl/" if lang=="pl" else ""}practice/today/index.html', body))

    # ── /practice/archive ──
    arch = head(lang, t['arch_h'], t['arch_s'], f'{pre}/practice/archive/', 'noindex, follow') + HDR[lang] + f'''
<main class="pr" data-practice-archive>
  <div class="container pr__in">
    <p class="kicker"><a href="{pre}/practice/">{t['name']}</a></p>
    <h1 class="pr__h1">{t['arch_h']}</h1>
    <p class="pr__sub">{t['arch_s']}</p>
    <div class="pr__list" data-list></div>
    <div class="pr__adds pr__adds--arch">
      <button class="pr__add" type="button" data-export-all>{t['exportAll']}</button>
      <button class="pr__add pr__mini--warn" type="button" data-delete-all>{t['deleteAll']}</button>
    </div>
    <p class="pr__privacy">{t['warn']}</p>
  </div>
</main>''' + FTR[lang] + '</body></html>'
    out.append((f'{"pl/" if lang=="pl" else ""}practice/archive/index.html', arch))
    return out

n = 0
for lang in ('en', 'pl'):
    for path, html in build(lang):
        full = os.path.join(ROOT, path)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        open(full, 'w').write(html)
        n += 1
print(f'The Practice: {n} stron (EN + PL)')
