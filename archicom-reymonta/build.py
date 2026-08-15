#!/usr/bin/env python3
"""Prezenter Przystań Reymonta — etap WR1–3.

Kolejność wprost z maila Marty Niwińskiej (01.06.2026):
  1. Okładka — napis PREZENTER, logo Archicom 40 lat i Reymonta
  2. Okładka II strona — „Budujemy przestrzeń dobrego życia"
  3. Mapa
  4. Wizki (ok. 4–6 sztuk)
  5. Plan zagospodarowania nieruchomości
  6. Karty w tej samej kolejności
  7. Wizka wnętrza (jeśli będzie)
  8. Karty mieszkań

Doprecyzowania z maila 31.07: 3 prezentery po jednym na etap (WR1-3, WR2, WR4);
WR1 = 10 pięter, WR3 = 7, WR2 = 8. Z maila 03.08: „dobrze byłoby uwzględnić
ten podział na WR1 i WR3 — bo teraz tutaj są łączone piętra".

Format: A3 pozioma (420×297 mm), jeden element na stronę.
"""
import json, pathlib, os, sys

# A4 poziome = A3 poziome przeskalowane o 1/√2. Ta sama kompozycja, mniejszy arkusz.
PODGLAD = "--a4" in sys.argv
SKALA = 297 / 420

ROOT = pathlib.Path(__file__).parent
AS = json.load(open(ROOT / "src/assets.json"))

NAVY, NAVY_PAS, KLEIN, PRAZKI, MGLA = "#202c46", "#303653", "#2e3e90", "#8fa5cb", "#f4f7f9"

# paleta przełożona na gamę z pierwotnego prezentera — patrz PALETA w gen_assets.py
LEGENDA = [("#ecf4f0", "1"), ("#d4e0e0", "2"), ("#d4d0cc", "3"),
           ("#ece0c8", "4"), ("#e4c8b4", "5")]

_n = [0]
def nxt():
    _n[0] += 1
    return _n[0]


def css():
    ARKUSZ = "297mm 210mm" if PODGLAD else "420mm 297mm"
    SZER, WYS = (297, 210) if PODGLAD else (420, 297)
    SKALA_CSS = round(SKALA, 6) if PODGLAD else 1
    return f"""
@font-face {{ font-family:'Pretty Var'; src:url('{AS['PrettyVar.ttf']}') format('truetype');
              font-weight:1 1000; font-style:normal; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ background:#8a8a8a; }}
@page {{ size:{ARKUSZ}; margin:0; }}
.ark {{ width:{SZER}mm; height:{WYS}mm; overflow:hidden; position:relative;
        page-break-after:always; background:#fff; }}
.ark:last-child {{ page-break-after:auto; }}
.pg {{ width:420mm; height:297mm; position:relative; overflow:hidden;
       background:#fff; transform:scale({SKALA_CSS}); transform-origin:top left; }}
body {{ font-family:'Pretty Var','Helvetica Neue',sans-serif;
        font-variation-settings:'wght' 70; color:#1a2238; -webkit-font-smoothing:antialiased; }}
.nr {{ position:absolute; bottom:8mm; right:18mm; font-size:7.5pt; color:#9aa7c0;
       font-variation-settings:'wght' 90; z-index:3; }}

/* ── okładka ─────────────────────────────────────────── */
.cover {{ background:{NAVY}; }}
.cover svg.pasy {{ position:absolute; inset:0; width:100%; height:100%; }}
.cover .mark {{ position:absolute; left:50%; top:47%; transform:translate(-50%,-50%);
                width:150mm; }}
.cover .prez {{ position:absolute; left:50%; bottom:44mm; transform:translateX(-50%);
                color:#fff; font-size:22pt; letter-spacing:.36em;
                font-variation-settings:'wght' 40; white-space:nowrap; }}
.cover .etap {{ position:absolute; left:50%; bottom:31mm; transform:translateX(-50%);
                color:{PRAZKI}; font-size:9pt; letter-spacing:.3em;
                font-variation-settings:'wght' 50; white-space:nowrap; }}
.cover .lat {{ position:absolute; left:50%; bottom:18mm; transform:translateX(-50%);
                width:52mm; opacity:.95; }}

/* ── claim ───────────────────────────────────────────── */
.claim {{ background:{NAVY}; color:#fff; height:100%; display:flex; align-items:stretch; }}
.claim .txt {{ width:47%; padding:40mm 30mm 26mm 34mm; display:flex; flex-direction:column; }}
.claim h1 {{ font-size:44pt; line-height:1.14; font-variation-settings:'wght' 35;
             letter-spacing:-.01em; }}
.claim .rule {{ width:38mm; height:2.8mm; background:{PRAZKI}; margin:16mm 0 13mm; }}
.claim p {{ font-size:11.5pt; line-height:1.68; color:#cdd6e6;
            font-variation-settings:'wght' 55; }}
.claim ul {{ list-style:none; margin-top:auto; }}
.claim li {{ font-size:9.5pt; color:#dfe6f2; padding:3.6mm 0;
             border-top:.35mm solid rgba(143,165,203,.34);
             font-variation-settings:'wght' 60; letter-spacing:.07em; }}
.claim .foto {{ flex:1; overflow:hidden; }}
.claim .foto img {{ width:100%; height:100%; object-fit:cover; display:block; }}

/* ── wizualizacja: jedna na stronę, w ramce ──────────── */
.ramka {{ height:100%; padding:16mm 18mm 14mm; display:flex; flex-direction:column; }}
.ramka .kadr {{ flex:1; min-height:0; overflow:hidden; }}
.ramka .kadr img {{ width:100%; height:100%; object-fit:cover; display:block; }}
.ramka .pod {{ padding-top:5mm; font-size:7pt; letter-spacing:.24em; color:#8b98b3;
               font-variation-settings:'wght' 70; }}

/* ── rysunek/plan na całą stronę ─────────────────────── */
.plansza {{ height:100%; padding:14mm 18mm 18mm; display:flex; flex-direction:column; }}
.plansza .top {{ display:flex; justify-content:space-between; align-items:flex-start;
                 min-height:16mm; }}
.plansza .logo {{ width:38mm; opacity:.92; }}
.plansza .tyt {{ text-align:right; font-size:16pt; font-variation-settings:'wght' 110;
                 color:{KLEIN}; }}
.plansza .plot {{ flex:1; display:flex; align-items:center; justify-content:center;
                  padding:6mm 0; min-height:0; }}
.plansza .plot img {{ max-width:100%; max-height:100%; object-fit:contain; }}

/* ── tylna okładka ───────────────────────────────────── */
.tyl {{ position:absolute; inset:0; }}
.tyl img {{ width:100%; height:100%; object-fit:cover; display:block; }}

/* ── karta kondygnacji ───────────────────────────────── */
.karta {{ padding:14mm 18mm 21mm; height:100%; display:flex; flex-direction:column; }}
.karta .top {{ display:flex; justify-content:space-between; align-items:flex-start;
               min-height:16mm; }}
.karta .logo {{ width:38mm; opacity:.92; }}
.karta .tyt {{ text-align:right; }}
.karta .tyt .f {{ font-size:16pt; font-variation-settings:'wght' 110; color:{KLEIN}; }}
.karta .tyt .b {{ font-size:9pt; font-variation-settings:'wght' 50; color:#8b98b3;
                  letter-spacing:.1em; margin-top:1.4mm; }}
.prazki {{ display:flex; flex-direction:column; gap:1.6mm; margin-top:6mm; width:74mm; }}
.prazki span {{ display:block; height:.9mm; background:{PRAZKI}; }}
.karta .rzut {{ flex:1; display:flex; align-items:center; justify-content:center;
                padding:7mm 0; min-height:0; }}
.karta .rzut img {{ max-width:100%; max-height:100%; object-fit:contain; }}
.legenda {{ display:flex; align-items:center; gap:6mm; padding-top:5mm;
            border-top:.25mm solid #e8edf5; }}
.legenda .cap {{ font-size:6.4pt; letter-spacing:.24em; color:#a3aec4;
                 font-variation-settings:'wght' 80; }}
.legenda .chip {{ display:flex; align-items:center; gap:1.8mm; }}
.legenda .chip i {{ width:4.6mm; height:4.6mm; border-radius:.8mm; display:block;
                    box-shadow:inset 0 0 0 .2mm rgba(32,44,70,.14); }}
.legenda .chip b {{ font-size:7.4pt; color:#5b6784; font-variation-settings:'wght' 120; }}
.legenda .chip span {{ font-size:6.4pt; color:#a3aec4; font-variation-settings:'wght' 70;
                       letter-spacing:.08em; }}
.legenda .kom {{ margin-left:auto; display:flex; align-items:center; gap:1.8mm;
                 font-size:6.4pt; color:#a3aec4; letter-spacing:.16em;
                 font-variation-settings:'wght' 80; }}
.legenda .kom i {{ width:4.6mm; height:4.6mm; border-radius:.8mm; background:#c8c8c8;
                   box-shadow:inset 0 0 0 .2mm rgba(32,44,70,.14); }}

/* ── przekładka budynku ──────────────────────────────── */
.dziel {{ background:{NAVY}; height:100%; padding:0 40mm; display:flex; flex-direction:column;
          justify-content:center; color:#fff; }}
.dziel .big {{ font-size:56pt; font-variation-settings:'wght' 35; line-height:1.06; }}
.dziel .rule {{ width:38mm; height:2.8mm; background:{PRAZKI}; margin:14mm 0; }}
.dziel .meta {{ font-size:11pt; color:#cdd6e6; line-height:1.85;
                font-variation-settings:'wght' 55; }}

/* ── placeholder ─────────────────────────────────────── */
.ph {{ height:100%; background:{MGLA}; border:.5mm dashed #b9c5da; margin:12mm;
       display:flex; flex-direction:column; align-items:center; justify-content:center;
       gap:5mm; text-align:center; padding:0 40mm; }}
.ph b {{ font-size:20pt; font-variation-settings:'wght' 120; color:#6d7b98; }}
.ph .st {{ font-size:7.5pt; letter-spacing:.26em; color:#a6362f;
           font-variation-settings:'wght' 120; }}
.ph .op {{ font-size:10pt; color:#8b98b3; line-height:1.65; max-width:170mm;
           font-variation-settings:'wght' 55; }}

/* ── strony robocze ──────────────────────────────────── */
.status {{ padding:24mm 30mm 18mm; height:100%; display:flex; flex-direction:column; }}
.status h2 {{ font-size:24pt; font-variation-settings:'wght' 40; color:{KLEIN};
              margin-bottom:3mm; }}
.status .sub {{ font-size:10pt; color:#5b6784; font-variation-settings:'wght' 55;
                line-height:1.6; max-width:230mm; margin-bottom:9mm; }}
.kol {{ display:flex; gap:22mm; flex:1; min-height:0; }}
.kol > div {{ flex:1; }}
.item {{ display:flex; gap:5mm; padding:3.6mm 0; border-top:.3mm solid #dbe2ee;
         align-items:baseline; }}
.item .k {{ font-size:9.5pt; font-variation-settings:'wght' 130; width:56mm; flex:none; }}
.item .v {{ font-size:8.3pt; color:#5b6784; font-variation-settings:'wght' 55;
            line-height:1.55; }}
.tag {{ display:inline-block; font-size:6.6pt; letter-spacing:.14em; padding:.9mm 2.2mm;
        border-radius:.7mm; font-variation-settings:'wght' 120; margin-left:2mm;
        vertical-align:.4mm; }}
.tag.ok {{ background:#e6f0e4; color:#3f6b39; }}
.tag.no {{ background:#fdeceb; color:#a6362f; }}
h3.sek {{ font-size:11pt; color:{KLEIN}; font-variation-settings:'wght' 130;
          margin-bottom:4mm; letter-spacing:.02em; }}
table.map {{ border-collapse:collapse; width:100%; }}
table.map td {{ font-size:8.2pt; padding:1.9mm 0; border-top:.25mm solid #e4eaf3;
                font-variation-settings:'wght' 90; }}
table.map td.ar {{ color:{PRAZKI}; width:12mm; text-align:center; }}
table.map td.v2 {{ color:{KLEIN}; font-variation-settings:'wght' 130; }}
.uwaga {{ margin-top:7mm; padding:4mm 5mm; background:#fdeceb; border-radius:1mm;
          font-size:8.4pt; color:#a6362f; font-variation-settings:'wght' 90; line-height:1.55; }}
"""


def pasy_svg():
    """Motyw „3 linie" z KV — diagonalne pasy ton-w-ton, jak na okładce Bulwaru."""
    return f"""<svg class="pasy" viewBox="0 0 1323 936" preserveAspectRatio="none">
  <polygon points="0,0 392,0 566,510 262,596 219,936 0,936" fill="{NAVY_PAS}" opacity=".42"/>
  <g fill="{NAVY_PAS}" opacity=".85">
    <polygon points="72,0 124,0 506,936 452,936"/>
    <polygon points="138,0 168,0 550,936 518,936"/>
    <polygon points="182,0 200,0 583,936 564,936"/>
  </g></svg>"""


def prazki():
    return '<div class="prazki">' + '<span></span>' * 3 + '</div>'


def legenda():
    chipy = "".join(f'<div class="chip"><i style="background:{c}"></i>'
                    f'<b>{n}</b><span>POK.</span></div>' for c, n in LEGENDA)
    return ('<div class="legenda"><div class="cap">MIESZKANIA</div>' + chipy
            + '<div class="kom"><i></i>KOMUNIKACJA</div></div>')


def karta(floor, budynek, img):
    return f"""<div class="pg"><div class="karta">
  <div class="top"><img class="logo" src="{AS['logo-reymonta-dark.svg']}">
    <div class="tyt"><div class="f">{floor}</div><div class="b">{budynek}</div></div></div>
  {prazki()}<div class="rzut"><img src="{AS[img]}"></div>{legenda()}</div>
  <div class="nr">{nxt()}</div></div>"""


def placeholder(tytul, opis):
    return f"""<div class="pg"><div class="ph"><b>{tytul}</b>
  <div class="st">MATERIAŁ DO PODMIANY</div><div class="op">{opis}</div></div>
  <div class="nr">{nxt()}</div></div>"""


def dzielnik(budynek, meta):
    return f"""<div class="pg"><div class="dziel">
  <div class="big">Budynek {budynek}</div><div class="rule"></div>
  <div class="meta">{meta}</div></div>
  <div class="nr" style="color:#8494b5">{nxt()}</div></div>"""


def plansza(tytul, img):
    return f"""<div class="pg"><div class="plansza">
  <div class="top"><img class="logo" src="{AS['logo-reymonta-dark.svg']}">
    <div class="tyt">{tytul}</div></div>
  {prazki()}<div class="plot"><img src="{AS[img]}"></div></div>
  <div class="nr">{nxt()}</div></div>"""


def wizka(img, capt):
    return f"""<div class="pg"><div class="ramka">
  <div class="kadr"><img src="{AS[img]}"></div>
  <div class="pod">{capt}</div></div><div class="nr">{nxt()}</div></div>"""


S = []

# 1. Okładka
S.append(f"""<div class="pg cover">{pasy_svg()}
  <img class="mark" src="{AS['logo-reymonta-white.svg']}">
  <div class="prez">PREZENTER</div>
  <div class="etap">BUDYNKI WR1 &nbsp;·&nbsp; WR3</div>
  <img class="lat" src="{AS['logo-40lat.png']}"></div>""")
nxt()

# 2. Budujemy przestrzeń dobrego życia
S.append(f"""<div class="pg"><div class="claim">
  <div class="txt">
    <h1>Budujemy<br>przestrzeń<br>dobrego życia</h1><div class="rule"></div>
    <p>Przystań Reymonta powstaje nad kanałem miejskim, w miejscu, które łączy spokój
       wody z dostępnością centrum Wrocławia. Kameralne budynki, zielone dziedzińce
       i parter otwarty na okolicę.</p>
    <ul><li>WROCŁAW, UL. REYMONTA</li><li>BUDYNKI WR1 &nbsp;·&nbsp; WR3</li>
        <li>ARCHICOM S.A.</li></ul></div>
  <div class="foto"><img src="{AS['patio.jpg']}"></div></div>
  <div class="nr" style="color:#8494b5">{nxt()}</div></div>""")

# 3. Mapa
S.append(plansza("MAPA OKOLICY", "mapa-lotnicza.jpg"))

# 4. Wizki — 6 sztuk, jedna na stronę
for img, capt in [("hero-kanal.jpg", "WIDOK OD KANAŁU MIEJSKIEGO"),
                  ("ulica.jpg", "PARTER USŁUGOWY"),
                  ("wr3-balkon.jpg", "BUDYNEK WR3"),
                  ("wr3-taras.jpg", "TARAS WSPÓLNY"),
                  ("patio.jpg", "DZIEDZINIEC"),
                  ("noc.jpg", "WIDOK WIECZORNY")]:
    S.append(wizka(img, capt))

# 5. Plan zagospodarowania
S.append(plansza("PLAN ZAGOSPODAROWANIA", "plan-zagospodarowania.png"))

# 6. Karty kondygnacji — budynki rozdzielone (mail 03.08)
S.append(dzielnik("WR3", "7 kondygnacji nadziemnych<br>Parter z lokalami usługowymi<br>"
                         "Wrocław, ul. Reymonta"))
S.append(karta("PARTER", "BUDYNEK WR3", "rzut-parter-wr3.png"))
for i in range(1, 8):
    S.append(karta(f"{i} PIĘTRO", "BUDYNEK WR3", f"rzut-p{i}-wr3.png"))

S.append(dzielnik("WR1", "10 kondygnacji nadziemnych<br>2 kondygnacje garażu podziemnego<br>"
                         "Wrocław, ul. Reymonta"))
S.append(karta("GARAŻ −2", "BUDYNKI WR1 i WR3", "rzut-garaz-2-full.png"))
S.append(karta("GARAŻ −1", "BUDYNKI WR1 i WR3", "rzut-garaz-1-full.png"))
S.append(karta("PARTER", "BUDYNEK WR1", "rzut-parter-wr1.png"))
for i in range(1, 8):
    S.append(karta(f"{i} PIĘTRO", "BUDYNEK WR1", f"rzut-p{i}-wr1.png"))
for i in range(8, 11):   # od 8 piętra WR3 się kończy — rysunek obejmuje sam WR1
    S.append(karta(f"{i} PIĘTRO", "BUDYNEK WR1", f"rzut-p{i}-full.png"))

# 7. Wizka wnętrza
S.append(wizka("wnetrze-lobby.jpg", "LOBBY"))
S.append(wizka("wnetrze-zabawy.jpg", "SALA ZABAW"))

# 8. Karty mieszkań
S.append(placeholder("Karty mieszkań",
                     "Liczba stron zależy od liczby mieszkań — nieustalona. "
                     "Stary prezenter Przystani kart nie zawierał."))

# Tylna okładka — jak w starym prezenterze
S.append(f'<div class="pg"><div class="tyl"><img src="{AS["tylna-okladka.png"]}"></div></div>')
nxt()

# ── strony robocze (do usunięcia przed wysyłką klientowi) ────────────────
braki = [
    ("Karty mieszkań", "Brak, i nieustalona liczba mieszkań. Jedyna otwarta pozycja.", "no"),
    ("Mapa okolicy", "Przeniesiona ze starego prezentera. Marta pytała o dopasowanie kolorystyczne do Bulwaru — do potwierdzenia.", "ok"),
    ("Plan zagospodarowania", "Przeniesiony ze starego prezentera (str. 4). Wymaga korekty w zakresach zaznaczonych przez Martę 31.07.", "ok"),
    ("Wizualizacje wnętrz", "Lobby i sala zabaw — przeniesione ze starego prezentera.", "ok"),
    ("Karta parteru", "Jest — jako załącznik maila z 31.07, nie w paczce swisstransfer.", "ok"),
    ("Rzuty 1–10 piętro, garaże", "Komplet. Nazwy plików nie zgadzają się z zawartością.", "ok"),
    ("Wizualizacje", "8 plików, 6 dotyczy WR1/WR3, 2 dotyczą WR2.", "ok"),
]
PYTANIA = [
    ("Jednostka rozliczenia", "Stary prezenter to 34 arkusze A3. Ten, po rozdzieleniu WR1 i WR3, "
     "ma ich {N}. Stawka 100–200 zł dotyczy strony czy arkusza?"),
    ("Kolorystyka mieszkań", "Nowe karty mają paletę zieleń–żółć–ochra, stary prezenter "
     "błękit–beż–pomarańcz. Zostawiamy nową, jak w tym pliku?"),
    ("Rozdzielenie budynków", "WR1 i WR3 to jeden ciągły rysunek połączony dylatacją. "
     "Tniemy go u nas, czy architekt da pliki rozdzielone u źródła?"),
    ("Numeracja pięter", "Nazwy plików są przesunięte o jedną kondygnację — patrz tabela obok. "
     "Prosimy o potwierdzenie, że odczyt z rysunków jest właściwy."),
    ("Materiały przeniesione", "Mapa, plan zagospodarowania i wizki wnętrz pochodzą ze starego "
     "prezentera Przystani. Jeśli są nowsze wersje, prosimy o przesłanie."),
]
MAPOWANIE = [("10 PIĘTRA.pdf", "1 piętro"), ("3 PIĘTRA.pdf", "2 piętro"), ("4 PIĘTRA.pdf", "3 piętro"),
             ("5 PIĘTRA.pdf", "4 piętro"), ("6 PIĘTRA.pdf", "5 piętro"), ("7 PIĘTRA.pdf", "6 piętro"),
             ("8 PIĘTRA.pdf", "7 piętro"), ("9 PIĘTRA.pdf", "8 piętro"), ("GARAŻU −1.pdf", "9 piętro"),
             ("2 PIĘTRA.pdf", "10 piętro"), ("GARAŻU −1-2.pdf", "garaż −1"),
             ("GARAŻU −2.pdf, s. 1", "garaż −1 (duplikat)"), ("GARAŻU −2.pdf, s. 2", "garaż −2"),
             ("PARTERU.pdf", "garaż −2 (duplikat)")]

ARKUSZE = len(S) + 1   # +1 bo strona robocza dochodzi poniżej
items = "".join(f'<div class="item"><div class="k">{k}<span class="tag {t}">'
                f'{"MAMY" if t == "ok" else "BRAK"}</span></div><div class="v">{v}</div></div>'
                for k, v, t in braki)
pytania = "".join(f'<div class="item"><div class="k">{k}</div>'
                  f'<div class="v">{v.replace("{N}", str(ARKUSZE))}</div></div>'
                  for k, v in PYTANIA)
mapowanie = "".join(f'<tr><td>{a}</td><td class="ar">→</td><td class="v2">{b}</td></tr>'
                    for a, b in MAPOWANIE)

S.append(f"""<div class="pg"><div class="status">
  <h2>Status materiałów i pytania otwarte</h2>
  <div class="sub">Stan na 09.08.2026, etap WR1–3. Strona robocza — do usunięcia
    przed wysyłką klientowi.</div>
  <div class="kol">
    <div><h3 class="sek">Materiały</h3>{items}
         <h3 class="sek" style="margin-top:9mm">Do potwierdzenia</h3>{pytania}</div>
    <div><h3 class="sek">Nazwy plików vs zawartość rysunków</h3>
      <table class="map"><tbody>{mapowanie}</tbody></table>
      <div class="uwaga">Parter nie występuje w paczce — przyszedł osobno, załącznikiem
        maila z 31.07. Garaże −1 i −2 dublują się.</div></div>
  </div></div><div class="nr">{nxt()}</div></div>""")

arkusze = "".join(f'<div class="ark">{p}</div>' for p in S)

html = f"""<!doctype html><html lang="pl"><head><meta charset="utf-8">
<title>Przystań Reymonta — prezenter WR1–3</title>
<style>{css()}</style></head><body>{arkusze}</body></html>"""

(ROOT / "out/prezenter-demo.html").write_text(html, encoding="utf-8")
print(f"OK — {len(S)} stron " + ("A4 poziomych (podgląd)" if PODGLAD else "A3 poziomych"))
