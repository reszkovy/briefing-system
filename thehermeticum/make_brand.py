#!/usr/bin/env python3
"""Design system + brand guide — składany Z TOKENÓW w assets/site.css.

Zasada: żadnej wartości nie wpisujemy tu ręcznie. Strona czyta arkusz, liczy
kontrasty i renderuje próbki. Jeśli ktoś zmieni token w CSS, strona zmieni się
przy najbliższym buildzie; jeśli token zniknie — build padnie.
"""
import os, re, html as H

ROOT = os.path.dirname(os.path.abspath(__file__))
V = "86"
CSS = open(os.path.join(ROOT, 'assets', 'site.css')).read()
IDX = open(os.path.join(ROOT, 'index.html')).read()


def _slice(src, start, end):
    i = src.find(start); j = src.find(end, i)
    return src[i:j + len(end)] if i >= 0 else ''


HDR = _slice(IDX, '<header class="hdr"', '</header>')
FTR = _slice(IDX, '<footer class="foot">', '</footer>')

# ── tokeny ────────────────────────────────────────────────────────────────
TOK = {}
for blok in re.findall(r':root\s*\{([^}]*)\}', CSS, re.S):
    for name, val in re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', blok):
        TOK[name] = val.strip()

WYMAGANE = ['--paper', '--panel', '--ink', '--ink-muted', '--vermilion', '--gold',
            '--gold-bright', '--on-ink', '--line', '--font-display', '--font-body',
            '--font-ui', '--t-2xs', '--t-xs', '--t-sm', '--t-base', '--t-md', '--t-lg',
            '--t-xl', '--t-2xl', '--t-3xl', '--ctl', '--ctl-sm', '--radius', '--ease',
            '--dur', '--gutter', '--secA', '--secB']
brak = [t for t in WYMAGANE if t not in TOK]
if brak:
    raise SystemExit('BUILD FAIL: brak tokenów w site.css: %s' % ', '.join(brak))


# ── kontrast WCAG ─────────────────────────────────────────────────────────
def _rgb(v):
    v = v.strip()
    if v.startswith('#'):
        v = v[1:]
        if len(v) == 3:
            v = ''.join(c * 2 for c in v)
        return tuple(int(v[i:i + 2], 16) for i in (0, 2, 4))
    m = re.findall(r'[\d.]+', v)
    return tuple(int(float(x)) for x in m[:3])


def _lum(c):
    def f(x):
        x /= 255
        return x / 12.92 if x <= 0.03928 else ((x + .055) / 1.055) ** 2.4
    r, g, b = (f(x) for x in c)
    return .2126 * r + .7152 * g + .0722 * b


def kontrast(a, b):
    la, lb = _lum(_rgb(a)), _lum(_rgb(b))
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + .05) / (lo + .05), 2)


PAPER, INK = TOK['--paper'], TOK['--ink']

PARY = [
    ('--ink', '--paper', 'tekst główny na papierze'),
    ('--ink-muted', '--paper', 'tekst drugorzędny na papierze'),
    ('--vermilion', '--paper', 'akcent i kickery na papierze'),
    ('--gold', '--paper', 'etykiety złote na papierze'),
    ('--on-ink', '--ink', 'tekst na atramencie'),
    ('--gold-bright', '--ink', 'akcent na atramencie'),
]
kontrasty = [(f, b, opis, kontrast(TOK[f], TOK[b])) for f, b, opis in PARY]
zle = [(f, b, r) for f, b, _, r in kontrasty if r < 4.5]
if zle:
    raise SystemExit('BUILD FAIL: para poniżej 4.5:1 → %s' % zle)

# ── skala pisma: px przy 16 px bazowych ───────────────────────────────────
SKALA = [('--t-2xs', 'etykiety, meta, noty'), ('--t-xs', 'noty prawne, podpisy'),
         ('--t-sm', 'etykiety UI, kickery'), ('--t-base', 'tekst pomocniczy'),
         ('--t-md', 'tekst w komponentach'), ('--t-lg', 'tekst ciągły'),
         ('--t-xl', 'lead sekcji'), ('--t-2xl', 'nagłówek sekcji'),
         ('--t-3xl', 'nagłówek strony')]


def px(v):
    m = re.match(r'^([\d.]+)rem$', v.strip())
    if m:
        return '%d px' % round(float(m.group(1)) * 16)
    if v.startswith('clamp'):
        cz = re.findall(r'([\d.]+)rem', v)
        if len(cz) >= 2:
            return '%d–%d px' % (round(float(cz[0]) * 16), round(float(cz[-1]) * 16))
    return v


SP = [k for k in TOK if re.match(r'^--sp\d$', k)]
SP.sort(key=lambda k: int(k[-1]))

GLOS = [
    ('Piszemy jak ktoś, kto ma coś do sprawdzenia', 'nie jak ktoś, kto ma coś do sprzedania',
     'Zdanie oznajmujące przed metaforą. Konkret przed obrazem. Jeśli twierdzenie da się sprawdzić, podajemy gdzie.'),
    ('Nazywamy granicę każdej obietnicy', 'nie obiecujemy wyniku',
     'Każda praktyka mówi, czego nie załatwia. Każdy rozdział ma sekcję granic. To jest sygnał rygoru, nie asekuracja.'),
    ('Zero motywacji i zero guru', 'nie „dasz radę", nie „odblokuj potencjał"',
     'Nie oceniamy rozwoju czytelnika, nie mierzymy duchowości, nie prowadzimy do siebie. Tekst znaczy więcej niż twarz.'),
    ('Mówimy „nie wiemy", gdy nie wiemy', 'nie wypełniamy luk prawdopodobnym tekstem',
     'Gdy badacze się różnią, nazywamy obie strony. Gdy twierdzenie jest sporne, oznaczamy je.'),
    ('Rozdzielamy język publiczny i systemowy', 'rygor schodzi warstwę niżej, nie znika',
     'Nagłówki i proza po ludzku. Surowe artefakty — frontmatter, statusy, kontrakt — zostają w języku systemu.'),
    ('Tylko krótki łącznik', 'nigdy pauza w tekście użytkownika',
     'W copy widocznym dla czytelnika stosujemy „-", nie „—".'),
]

NIE = ['przepowiedni, wróżb i „tajemnych praw"', 'punktów, poziomów, serii i odznak',
       'porównań między ludźmi i oceniania postępu', 'obietnic wyniku bez podanej granicy',
       'zdjęć stockowych z ludźmi w pozach „duchowości"', 'gradientów, cieni i zaokrągleń większych niż 2 px',
       'wykrzykników i wielkich liter w prozie', 'liczb bez źródła']


def swatch(t):
    v = TOK[t]
    return ('<div class="sw"><div class="sw__c" style="background:var(%s)"></div>'
            '<p class="sw__n">%s</p><p class="sw__v">%s</p></div>') % (t, t, H.escape(v))


rows_k = ''.join(
    '<tr><td><code>%s</code></td><td><code>%s</code></td><td>%s</td>'
    '<td class="%s">%.2f:1</td></tr>' % (f, b, opis, 'ok' if r >= 4.5 else 'bad', r)
    for f, b, opis, r in kontrasty)

rows_t = ''.join(
    '<tr><td><code>%s</code></td><td>%s</td><td>%s</td>'
    '<td><span style="font-size:var(%s)">Jak w górze, tak i na dole</span></td></tr>'
    % (t, px(TOK[t]), opis, t) for t, opis in SKALA)

rows_sp = ''.join(
    '<tr><td><code>%s</code></td><td>%s</td><td><span class="bar" style="width:var(%s)"></span></td></tr>'
    % (t, px(TOK[t]), t) for t in SP)

glos_html = ''.join(
    '<div class="rule"><p class="rule__y">%s</p><p class="rule__n">%s</p><p class="rule__d">%s</p></div>'
    % (H.escape(a), H.escape(b), H.escape(c)) for a, b, c in GLOS)

HTML = f'''<!doctype html>
<html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>System projektowy — The Hermeticum</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v={V}">
<script src="/assets/site.js?v={V}" defer></script>
<style>
  .ds{{padding-block:var(--secB)}}
  .ds h2{{font-family:var(--font-display);font-size:var(--t-2xl);margin:0 0 var(--sp4)}}
  .ds h3{{font-family:var(--font-ui);font-size:var(--t-sm);font-weight:600;letter-spacing:.16em;
    text-transform:uppercase;color:var(--gold);margin:var(--sp6) 0 var(--sp3)}}
  .ds p{{max-width:44rem;line-height:1.6}}
  .ds table{{width:100%;border-collapse:collapse;margin:var(--sp4) 0 var(--sp6);font-size:var(--t-base)}}
  .ds th,.ds td{{text-align:left;padding:.6rem .75rem;border-bottom:1px solid var(--line-soft);vertical-align:middle}}
  .ds th{{font-family:var(--font-ui);font-size:var(--t-2xs);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-muted)}}
  .ds code{{font-family:ui-monospace,monospace;font-size:var(--t-xs);background:var(--panel);
    padding:.15em .4em;border:1px solid var(--line-soft)}}
  .ok{{color:#1c6b3a;font-weight:600}} .bad{{color:var(--vermilion);font-weight:600}}
  .sws{{display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:var(--sp4);margin:var(--sp4) 0 var(--sp6)}}
  .sw__c{{height:4.5rem;border:1px solid var(--line)}}
  .sw__n{{margin:.5rem 0 0;font-family:ui-monospace,monospace;font-size:var(--t-2xs)}}
  .sw__v{{margin:.1rem 0 0;font-size:var(--t-2xs);color:var(--ink-muted)}}
  .bar{{display:block;height:.6rem;background:var(--gold-bright);border:1px solid var(--gold)}}
  .rule{{border-top:1px solid var(--line);padding-top:var(--sp3);margin-bottom:var(--sp5)}}
  .rule__y{{margin:0;font-weight:600;font-size:var(--t-lg)}}
  .rule__n{{margin:.2rem 0 .5rem;color:var(--vermilion);font-size:var(--t-base)}}
  .rule__d{{margin:0;color:var(--ink-muted);font-size:var(--t-base)}}
  .no{{columns:2;column-gap:var(--sp6);max-width:46rem;margin:var(--sp4) 0 0;padding-left:1.1rem}}
  .no li{{margin-bottom:.4rem;font-size:var(--t-base);color:var(--ink-muted);break-inside:avoid}}
  .demo{{display:flex;gap:var(--sp4);flex-wrap:wrap;align-items:center;margin:var(--sp4) 0 var(--sp6);
    padding:var(--sp5);background:var(--panel);border:1px solid var(--line-soft)}}
  .demo--ink{{background:var(--ink)}}
  @media (max-width:640px){{.no{{columns:1}}}}
</style></head><body>
{HDR}
<main>
  <section class="ds">
    <div class="container">
      <p class="kicker">System projektowy</p>
      <h1 class="hero__title" style="font-size:var(--t-2xl)">The Hermeticum</h1>
      <p class="lead">Ta strona nie jest opisem systemu — jest jego odczytem. Każdy kolor, rozmiar
        i odstęp poniżej pochodzi wprost z <code>assets/site.css</code> i jest renderowany tym samym
        tokenem, którego używa serwis. Jeśli ktoś zmieni token, ta strona zmieni się sama. Jeśli token
        zniknie albo para kolorów spadnie poniżej 4,5:1, build się nie wykona.</p>

      <h2>Fundament</h2>
      <p><b>Anonimowy autor. Jawne źródła. Sprawdzalna praktyka.</b> Marka nie sprzedaje dostępu do osoby,
        tylko metodę, którą da się sprawdzić. Stąd wynika reszta: brak twarzy, obecność źródeł, jawne granice
        każdej obietnicy i brak jakiejkolwiek skali oceniającej czytelnika.</p>

      <h2>Kolor</h2>
      <div class="sws">{''.join(swatch(t) for t in ('--paper','--panel','--paper-deep','--ink','--ink-muted','--vermilion','--gold','--gold-bright','--sandy','--almond','--on-ink'))}</div>
      <h3>Kontrast, sprawdzany przy każdym buildzie</h3>
      <table><thead><tr><th>Tekst</th><th>Tło</th><th>Zastosowanie</th><th>WCAG</th></tr></thead>
      <tbody>{rows_k}</tbody></table>
      <p><b>Reguła:</b> złoto <code>--gold-bright</code> nigdy nie niesie tekstu na papierze — tylko na
        atramencie albo jako element graficzny. Wermilion jest akcentem, nie kolorem tła dla dłuższych partii.</p>

      <h2>Typografia</h2>
      <p>Trzy kroje, każdy z jednym zadaniem. <b>{H.escape(TOK['--font-display'].split(',')[0])}</b> — tylko nagłówki
        i nazwy. <b>{H.escape(TOK['--font-body'].split(',')[0])}</b> — cały tekst ciągły. <b>{H.escape(TOK['--font-ui'].split(',')[0])}</b>
        — etykiety, kickery, przyciski, nawigacja. Czwarty krój pojawia się wyłącznie jako monospace w podglądzie plików.</p>
      <table><thead><tr><th>Token</th><th>Rozmiar</th><th>Rola</th><th>Próbka</th></tr></thead>
      <tbody>{rows_t}</tbody></table>
      <p><b>Podłoga:</b> {px(TOK['--t-2xs'])} — nic mniejszego nie występuje w interfejsie.</p>

      <h2>Odstęp i rytm</h2>
      <table><thead><tr><th>Token</th><th>Wartość</th><th></th></tr></thead><tbody>{rows_sp}</tbody></table>
      <p>Rytm pionowy sekcji ma dwie wartości: <code>--secA</code> ({px(TOK['--secA'])}) dla sekcji nośnych
        i <code>--secB</code> ({px(TOK['--secB'])}) dla wtórnych. Zawsze symetrycznie, góra równa dołowi.
        Rynna strony: <code>--gutter</code> ({px(TOK['--gutter'])}) — ta sama lewa krawędź w każdej sekcji.</p>

      <h2>Kontrolki</h2>
      <p>Jedna wysokość: <code>--ctl</code> = {px(TOK['--ctl'])} dla wszystkiego, co się klika i wpisuje;
        <code>--ctl-sm</code> = {px(TOK['--ctl-sm'])} w nagłówku. Promień <code>--radius</code> = {TOK['--radius']} —
        jeden dla całego serwisu. Przejścia: <code>{TOK['--dur']}</code> i <code>{H.escape(TOK['--ease'])}</code>.</p>
      <div class="demo">
        <a class="btn" href="#">Przycisk główny</a>
        <a class="hero__alt" href="#">Odnośnik w prozie &rarr;</a>
        <input class="sub__input" type="email" placeholder="ty@praca.pl" aria-label="Przykładowe pole">
      </div>
      <div class="demo demo--ink">
        <a class="btn" href="#" style="background:var(--gold-bright);color:var(--ink)">Przycisk na atramencie</a>
        <span style="color:var(--on-ink);font-size:var(--t-base)">Tekst na atramencie</span>
      </div>
      <p><b>Cel dotykowy:</b> minimum 44 px w pionie dla każdego elementu interaktywnego poza odnośnikami
        wewnątrz zdania. Focus: <code>{H.escape(TOK['--focus'])}</code> z odstępem 3 px, widoczny wszędzie.</p>

      <h2>Głos</h2>
      {glos_html}

      <h2>Czego nie robimy</h2>
      <ul class="no">{''.join('<li>%s</li>' % H.escape(x) for x in NIE)}</ul>

      <h2>Sygnet</h2>
      <p>Znak „H" występuje w trzech miejscach: w nagłówku przy znaku słownym, w stopce i jako awatar
        odpowiedzi w asystencie. Zawsze w kolorze <code>currentColor</code> — atrament na papierze,
        złoto na atramencie. Nie obraca się, nie zmienia proporcji i nie występuje w kolorze wermilionu.</p>
    </div>
  </section>
</main>
{FTR}
</body></html>'''

out = os.path.join(ROOT, 'brand')
os.makedirs(out, exist_ok=True)
open(os.path.join(out, 'index.html'), 'w').write(HTML)
print('system projektowy: /brand/ — %d tokenów, %d par kontrastu sprawdzonych, skala %d stopni'
      % (len(TOK), len(kontrasty), len(SKALA)))
