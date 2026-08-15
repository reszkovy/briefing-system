#!/usr/bin/env python3
"""
Buduje kubota-stand-3d/index.html — WERSJA DWUSTRONNA (feedback Baltony 07.2026):
  pionowa płyta przeniesiona na środek podstawy (połowa głębokości),
  BEZ ścian bocznych (z boku widać tylko ściankę cokołu z logo),
  pegboard BIAŁY dwustronny, cokół i header niebieskie z białymi napisami.

Źródła:
  01-02.svg  — dielin frontu (header KUBOTA + cokół), skala 10 j. = 1 cm
  baltona.png — logo klienta (nagłówek strony)
"""
import base64
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "index.html"


def inner(name):
    """Zawartość <svg>…</svg> bez korzenia."""
    s = (ROOT / name).read_text()
    s = re.sub(r"^.*?<svg[^>]*>", "", s, count=1, flags=re.S)
    return re.sub(r"</svg>\s*$", "", s, flags=re.S).strip()


DIELINE = inner("01-02.svg")    # viewBox 0 0 1447 1300
BOK = inner("bok.svg")          # viewBox 0 0 98 436 — pylon 18×80 cm, finalny plik Bartosza
BOK_TXT = BOK[BOK.index("/>") + 2:]   # same litery (bez pierwszej ścieżki = sylwetki z łukiem)
BALTONA = base64.b64encode((ROOT / "baltona.png").read_bytes()).decode()

HTML = r"""<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>KUBOTA × Baltona — stand ekspozycyjny 60×40×130 · wizualizacja 3D</title>
<style>
  :root{
    --blue:#2657D9; --blue-lt:#4F83D9; --blue-dk:#1B3FA8; --blue-dp:#132D7A;
    --txt:#E8EBF2; --muted:#8E96AB; --line:rgba(255,255,255,.16);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    background:radial-gradient(1200px 850px at 50% 42%, #212637 0%, #0B0D12 68%), #0B0D12;
    color:var(--txt); font-family:"Helvetica Neue",Inter,Arial,sans-serif;
    overflow:hidden; -webkit-font-smoothing:antialiased;
  }

  /* ---------- pasek marki ---------- */
  .bar{
    position:fixed;top:0;left:0;right:0;z-index:60;
    display:flex;justify-content:center;align-items:center;
    padding:14px 24px;
    background:linear-gradient(180deg, rgba(11,13,18,.92), rgba(11,13,18,.55) 72%, transparent);
    border-bottom:1px solid rgba(38,87,217,.30);
  }
  /* tylko logo, bez apli, wyśrodkowane — plik klienta to gotowy lockup
     Baltona × KUBOTA (część KUBOTA jest biała, widoczna na ciemnym tle) */
  .logos{display:flex;align-items:center;justify-content:center;margin:0}
  .logos img{height:28px;display:block;max-width:calc(100vw - 44px);object-fit:contain}
  @media (max-width:760px){ .sub{display:none} .client small{display:none} }

  /* ---------- HUD ---------- */
  .hud{position:fixed;z-index:50}
  /* legenda: karta u góry pod paskiem logo — całkowicie poza strefą przycisków */
  .bl{
    top:84px;left:24px;max-width:38vw;
    background:rgba(11,13,18,.55);border:1px solid rgba(255,255,255,.09);
    border-radius:12px;padding:14px 18px;
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  }
  body.light .bl{background:rgba(255,255,255,.65);border-color:rgba(20,30,60,.14)}
  /* przyciski wyśrodkowane; pełny pas (left:50% zawijał rząd — shrink-to-fit
     liczy szerokość z połowy viewportu); pas przepuszcza kliknięcia */
  .br{
    bottom:22px;left:16px;right:16px;
    display:flex;gap:8px;flex-wrap:wrap;justify-content:center;
    pointer-events:none;
  }
  .br button{pointer-events:auto}
  @media (max-width:980px){ .bl{display:none} }
  .spec{font-size:11px;color:var(--muted);letter-spacing:.06em;line-height:1.9}
  .spec b{color:var(--txt);font-weight:700}
  .hint{margin-top:10px;font-size:10.5px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase}
  button{
    font:inherit;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;
    color:var(--txt);background:rgba(255,255,255,.05);border:1px solid var(--line);
    border-radius:999px;padding:8px 14px;cursor:pointer;transition:.18s;
    backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  }
  button:hover{background:rgba(38,87,217,.45);border-color:var(--blue-lt)}
  button.on{background:var(--blue);border-color:var(--blue);color:#fff}
  /* przełączniki (Wymiary/Produkty) — inna funkcja niż wybór ujęcia, inny kolor */
  button.toggle{
    margin-left:10px;background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.4);
  }
  button.toggle:hover{background:rgba(255,255,255,.26);border-color:#fff}
  button.toggle.on{background:#fff;border-color:#fff;color:#132D7A}

  /* ---------- mobile (Safari/iPhone): nic nie może wystawać poza ekran ---------- */
  @media (max-width:760px){
    .bar{padding:10px 14px}
    .logos img{height:19px}
    .br{gap:6px;bottom:calc(10px + env(safe-area-inset-bottom))}
    button{padding:7px 11px;font-size:9.5px}
    button.toggle{margin-left:0}
  }
  html,body{overscroll-behavior:none}

  /* ---------- scena ---------- */
  .stage{position:fixed;inset:0;display:grid;place-items:center;perspective:2800px;cursor:grab;touch-action:none}
  /* miękki spot zza lewego górnego rogu + winieta — tło studyjne */
  .stage::before{
    content:"";position:absolute;inset:0;pointer-events:none;
    background:
      radial-gradient(900px 700px at 38% 30%, rgba(120,160,255,.10), transparent 62%),
      radial-gradient(140% 120% at 50% 50%, transparent 55%, rgba(0,0,0,.42) 100%);
  }
  body.plate .stage::before{display:none}
  /* jasne tło studyjne (przełącznik „Tło") — pasek z logo zostaje ciemny,
     bo część KUBOTA w lockupie klienta jest biała */
  body.light{background:radial-gradient(1200px 850px at 50% 42%, #F4F5F7 0%, #DCDFE5 68%), #DCDFE5}
  body.light .stage::before{background:
    radial-gradient(900px 700px at 38% 30%, rgba(255,255,255,.6), transparent 62%),
    radial-gradient(140% 120% at 50% 50%, transparent 58%, rgba(40,50,70,.16) 100%)}
  body.light .bar{background:#0B0D12;border-bottom-color:rgba(38,87,217,.25)}
  body.light .spec, body.light .hint{color:#5A6170}
  body.light .spec b{color:#1C2230}
  body.light button{color:#2A3040;background:rgba(20,30,60,.05);border-color:rgba(20,30,60,.28);backdrop-filter:none}
  body.light button:hover{background:rgba(38,87,217,.16);border-color:var(--blue);color:#132D7A}
  body.light button.on{background:var(--blue);border-color:var(--blue);color:#fff}
  body.light button.toggle{background:rgba(20,30,60,.10);border-color:rgba(20,30,60,.40)}
  body.light button.toggle.on{background:#132D7A;border-color:#132D7A;color:#fff}
  .stage:active{cursor:grabbing}
  /* satynowy odblask lakieru na płaskich licach — opacity sterowane światłem w JS */
  .specular{
    position:absolute;inset:0;pointer-events:none;opacity:0;
    background:linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.5) 48%, rgba(255,255,255,0) 63%);
  }
  .rig{transform-style:preserve-3d;transition:transform .7s cubic-bezier(.22,1,.36,1)}
  .rig.drag{transition:none}
  .stand{position:relative;width:0;height:0;transform-style:preserve-3d}
  /* transform-origin MUSI być 0 0 — przy domyślnym 50% 50% rotateY obraca panel
     wokół jego środka i przesuwa go o pół szerokości w bok.
     BEZ preserve-3d: dzieci spłaszczają się do płaszczyzny panelu, dzięki czemu
     backface-visibility:hidden obejmuje też wnętrze (SVG) — inaczej Chrome
     pokazuje lustrzane odbicie grafiki od tyłu panelu */
  .n{position:absolute;left:0;top:0;transform-origin:0 0}
  .n > svg{position:absolute;inset:0;width:100%;height:100%;display:block}

  .dim{opacity:0;transition:opacity .3s}
  .dims-on .dim{opacity:1}
  .dim .bar-d{position:absolute;background:rgba(255,255,255,.9)}
  .dim .lbl{
    position:absolute;font-size:11px;font-weight:700;letter-spacing:.06em;color:#fff;
    background:var(--blue);padding:3px 9px;border-radius:4px;white-space:nowrap;
  }
  .hang,.ledge{transition:opacity .3s}
  .products-off .hang,.products-off .ledge{opacity:0}
</style>
</head>
<body>

<header class="bar">
  <div class="logos">
    <img src="data:image/png;base64,__BALTONA__" alt="Baltona × Kubota">
  </div>
</header>

<div class="hud bl">
  <div class="spec" id="spec"></div>
  <div class="hint" data-i="hint"></div>
</div>
<div class="hud br">
  <button data-view="34">3/4</button>
  <button data-view="front" data-i="vFront"></button>
  <button data-view="side" data-i="vSide"></button>
  <button data-view="back" data-i="vBack"></button>
  <button data-view="top" data-i="vTop"></button>
  <button id="dims" class="toggle" data-i="tDims"></button>
  <button id="prods" class="toggle on" data-i="tProd"></button>
  <button id="bg" class="toggle" data-i="tBg"></button>
  <button id="lang" class="toggle" data-i="tLang"></button>
</div>

<div class="stage" id="stage">
  <div class="rig" id="rig"><div class="stand" id="stand"></div></div>
</div>

<!-- ORYGINALNE DIELINY — źródło brandingu i sylwetek -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="shg" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0.28" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#fff" stop-opacity="0.45"/>
      <stop offset="0.72" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <g id="dl">__DIELINE__</g>
    <g id="bok">__BOK__</g>
    <g id="boktxt">__BOKTXT__</g>
  </defs>
</svg>

<script>
/* =======================================================================
   WYMIARY — wprost z dielinów (10 jednostek = 1 cm w 01-02/lewa1/prawa1)
   ======================================================================= */
const K = 10;
const U = 3.5;                      // px ekranu na 1 cm
const cm = n => n * U;

const W = 60, D = 40;               // szerokość / głębokość podstawy
const H = 130;                      // suma wysokości

const Y_WING_TOP  = 99.334  / K;    // 9.93  — góra ścian bocznych (120 cm od podłogi)
const Y_HDR_BOT   = 284.403 / K;    // 28.44 — dół panelu headera
const Y_BASE_TOP  = 899.334 / K;    // 89.93 — blat podstawy (40 cm od podłogi)
const Y_FLOOR     = 1299.334 / K;   // 129.93 — podłoga

const Y = yTop => yTop - H / 2;     // cm-od-góry -> współrzędna sceny (origin = środek bryły)

const parts = [];
/* n = normalna panelu w układzie bryły (do cieniowania kierunkowego w JS) */
function panel({w, h, pos, rot = '', css = '', cls = '', html = '', n = null}){
  const dn = n ? ` data-n="${n.join(',')}"` : '';
  parts.push(`<div class="n ${cls}"${dn} style="
    width:${cm(w)}px;height:${cm(h)}px;
    transform:translate3d(${cm(pos[0])}px,${cm(pos[1])}px,${cm(pos[2])}px) ${rot} translate(-50%,-50%);
    ${css}">${html}</div>`);
}
const tile = (vb, ref) =>
  `<svg viewBox="${vb}" preserveAspectRatio="none"><use href="${ref}"/></svg>`;

/* ================= PŁYTA CENTRALNA (dwustronna, na połowie głębokości) =================
   grubość 1,8 cm (płyta meblowa); góra: niebieski header KUBOTA z wyciętą chmurą,
   niżej BIAŁY pegboard — identycznie z obu stron                                        */
const pegH = Y_BASE_TOP - Y_HDR_BOT;                 // 61.49
const PT = 1.8, PZ = PT / 2;                          // grubość / połowa
const whiteBoard = `
  <div style="position:absolute;inset:0;background:#F5F6F8"></div>
  <div style="position:absolute;inset:0;
    background:radial-gradient(circle at 50% 50%, rgba(15,35,90,.18) 0 ${cm(.45)}px, transparent ${cm(.7)}px);
    background-size:${cm(2.6)}px ${cm(2.6)}px;background-position:${cm(1.3)}px ${cm(2)}px"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,35,90,.10),transparent 14%)"></div>`;

for (const s of [1, -1]) {                            // 1 = przód, -1 = tył
  const rot = s === 1 ? '' : 'rotateY(180deg) ';
  panel({w:W, h:Y_HDR_BOT, pos:[0, Y(Y_HDR_BOT/2), s*PZ], rot, n:[0,0,s],
    css:'backface-visibility:hidden',
    html: tile(`423.926 0 600 ${Y_HDR_BOT*K}`, '#dl')});
  panel({w:W, h:pegH, pos:[0, Y(Y_HDR_BOT + pegH/2), s*PZ], rot, n:[0,0,s],
    css:'backface-visibility:hidden', html: whiteBoard});
}
/* BOKI: pylony maskujące krawędź płyty — finalny plik Bartosza (bok.svg, 18×80 cm):
   symetryczny łuk u góry, liternictwo jak w logotypie KUBOTA (obrysy),
   napis idzie OD DOŁU DO GÓRY; góra pylonu = płaska krawędź pasa KUBOTA (9,93),
   wyżej wystaje już tylko wycięta chmura headera                                  */
const SIDE_W = 20;
const PYL_TOP = Y_WING_TOP, PYL_H = Y_BASE_TOP - PYL_TOP;      // 9.93 → 89.93 (80 cm)
/* flip=true dla prawego pylonu: mapowanie rotY(90) odwraca kierunek czytania
   pionowego tekstu — obrót o 180° przywraca czytanie do góry bez lustrzenia glifów */
const BOK_SIL = `<path d="M0 35.69C0 15.979 15.979 0 35.69 0H61.8263C81.5348 0 97.5116 15.9769 97.5116 35.6854V435.935H0V35.69Z" fill="#2657D9"/>`;
const sidePanel = (withText, flip = false) => `<svg viewBox="0 0 98 436" preserveAspectRatio="none">
  ${withText ? (flip ? `${BOK_SIL}<g transform="rotate(180 49 218)"><use href="#boktxt"/></g>`
                     : `<use href="#bok"/>`)
             : BOK_SIL}
</svg>`;
panel({w:SIDE_W, h:PYL_H, pos:[-W/2, Y(PYL_TOP + PYL_H/2), 0],
  rot:'rotateY(-90deg)', n:[-1,0,0], css:'backface-visibility:hidden', html: sidePanel(true)});
panel({w:SIDE_W, h:PYL_H, pos:[-W/2 + PT, Y(PYL_TOP + PYL_H/2), 0],
  rot:'rotateY(90deg)', n:[1,0,0], css:'backface-visibility:hidden', html: sidePanel(false)});
panel({w:SIDE_W, h:PYL_H, pos:[ W/2, Y(PYL_TOP + PYL_H/2), 0],
  rot:'rotateY(90deg)', n:[1,0,0], css:'backface-visibility:hidden', html: sidePanel(true, true)});
panel({w:SIDE_W, h:PYL_H, pos:[ W/2 - PT, Y(PYL_TOP + PYL_H/2), 0],
  rot:'rotateY(-90deg)', n:[-1,0,0], css:'backface-visibility:hidden', html: sidePanel(false)});

/* ================= podstawa 60 × 40 × 40 (bez ścian bocznych powyżej) ================= */
const baseH = Y_FLOOR - Y_BASE_TOP;                  // 40
const baseFace = tile(`423.453 ${Y_BASE_TOP*K} 600 ${baseH*K}`, '#dl') + `
    <div class="specular"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.16),transparent 9%,transparent 86%,rgba(0,0,0,.2))"></div>`;
/* front i tył cokołu — ten sam artwork (claim + sygnet) */
panel({w:W, h:baseH, pos:[0, Y(Y_BASE_TOP + baseH/2), D/2], n:[0,0,1],
  css:'background:var(--blue);backface-visibility:hidden', html: baseFace});
panel({w:W, h:baseH, pos:[0, Y(Y_BASE_TOP + baseH/2), -D/2], rot:'rotateY(180deg)', n:[0,0,-1],
  css:'background:var(--blue);backface-visibility:hidden', html: baseFace});
/* boki cokołu — niebieskie z białym sygnetem („bok tylko taki") */
const baseSide = `<svg viewBox="0 0 400 400" preserveAspectRatio="none">
  <rect width="400" height="400" fill="#2657D9"/>
  <g fill="#fff" transform="translate(100,148) scale(1.12) translate(-1157.26,-1062.38)">
    <path d="M1230.39 1064.36L1194.43 1136.28H1157.26L1193.22 1064.36H1230.39Z"/>
    <path d="M1262.83 1062.38C1280.82 1062.38 1295.79 1075.24 1299.09 1092.27L1299.12 1092.39L1299.21 1092.32C1303.03 1089.75 1307.03 1088.24 1312.58 1088.25C1325.84 1088.28 1336.59 1099.01 1336.59 1112.27C1336.59 1125.53 1325.84 1136.28 1312.58 1136.28H1262.75V1136.29C1242.38 1136.24 1225.88 1119.72 1225.88 1099.33C1225.88 1078.93 1242.42 1062.38 1262.83 1062.38Z"/>
  </g></svg>`;
panel({w:D, h:baseH, pos:[-W/2, Y(Y_BASE_TOP + baseH/2), 0], rot:'rotateY(-90deg)', n:[-1,0,0],
  css:'backface-visibility:hidden', html: baseSide});
panel({w:D, h:baseH, pos:[ W/2, Y(Y_BASE_TOP + baseH/2), 0], rot:'rotateY(90deg)', n:[1,0,0],
  css:'backface-visibility:hidden', html: baseSide});
/* blat — jasny kobalt, AO pod płytą centralną */
panel({w:W, h:D, pos:[0, Y(Y_BASE_TOP), 0], rot:'rotateX(90deg)', n:[0,-1,0],
  css:'background:linear-gradient(180deg,#3D6BE0,#2450C8)',
  html:`<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 34%,rgba(0,0,0,.32) 49%,rgba(0,0,0,.32) 51%,transparent 66%)"></div>`});
/* spód standu — kobaltowy prostokąt zamykający bryłę od dołu */
panel({w:W, h:D, pos:[0, Y(Y_FLOOR), 0], rot:'rotateX(90deg)',
  css:'background:#2450C8'});

/* ================= klapki (slidery) ================= */
const SW = 9.8, SL = 25, HANG = 5;
const LOGO_G = (lc, tx, s) => `<g fill="${lc}" transform="translate(${tx}) scale(${s}) translate(-1157.26,-1062.38)">
    <path d="M1230.39 1064.36L1194.43 1136.28H1157.26L1193.22 1064.36H1230.39Z"/>
    <path d="M1262.83 1062.38C1280.82 1062.38 1295.79 1075.24 1299.09 1092.27L1299.12 1092.39L1299.21 1092.32C1303.03 1089.75 1307.03 1088.24 1312.58 1088.25C1325.84 1088.28 1336.59 1099.01 1336.59 1112.27C1336.59 1125.53 1325.84 1136.28 1312.58 1136.28H1262.75V1136.29C1242.38 1136.24 1225.88 1119.72 1225.88 1099.33C1225.88 1078.93 1242.42 1062.38 1262.83 1062.38Z"/>
  </g>`;
const slide = (c, d, lc) => `<svg viewBox="0 0 100 260" style="display:block;width:${cm(SW)}px">
  <path d="M50 4 C76 4 90 20 92 52 C95 94 89 132 87 172 C85 218 77 254 50 256
           C23 254 15 218 13 172 C11 132 5 94 8 52 C10 20 24 4 50 4 Z" fill="${d}"/>
  <path d="M50 10 C73 10 85 24 87 53 C90 94 84 132 82 171 C80 214 73 249 50 250
           C27 249 20 214 18 171 C16 132 10 94 13 53 C15 24 27 10 50 10 Z" fill="${c}"/>
  <path d="M10 46 C10 30 24 18 50 18 C76 18 90 30 90 46 L90 92 C90 102 80 108 66 108
           L34 108 C20 108 10 102 10 92 Z" fill="${d}" opacity=".5"/>
  <path d="M12 48 C12 33 25 22 50 22 C75 22 88 33 88 48 L88 90 C88 99 79 104 66 104
           L34 104 C21 104 12 99 12 90 Z" fill="${c}"/>
  ${LOGO_G(lc, '29,58', '0.235')}
</svg>`;
const hanger = () => `<svg viewBox="0 0 40 62" style="display:block;width:${cm(4.4)}px">
  <path d="M20 4 C10 4 6 9 6 14" stroke="#4F83D9" stroke-width="4" fill="none" stroke-linecap="round"/>
  <rect x="6" y="12" width="28" height="48" rx="5" fill="#2657D9"/>
  <rect x="13" y="36" width="14" height="20" rx="4" fill="#132D7A"/>
  ${LOGO_G('#fff', '9,17', '0.125')}
</svg>`;

const C = {
  black:  ['#16181D','#0A0B0F','#fff'],   navy:  ['#23305E','#141D42','#fff'],
  red:    ['#D8362F','#A82520','#fff'],   orange:['#E8621F','#B84711','#fff'],
  pink:   ['#F291B8','#D96E9A','#fff'],   mint:  ['#8FD9B6','#68B995','#fff'],
  beige:  ['#CDB396','#AC9375','#fff'],   yellow:['#F2C63A','#CFA31C','#2657D9'],
  grey:   ['#C2C6CC','#9DA3AC','#2657D9'],white: ['#FFFFFF','#D6DCE8','#2657D9'],
};
/* pegboard 61,5 cm -> 2 rzędy × 4 kolumny */
const grid = [
  ['black','navy','red','orange'],
  ['yellow','mint','grey','white'],
];
const colsX = [-21.5, -7.2, 7.2, 21.5];
const rowsTop = [Y_HDR_BOT + .5, Y_HDR_BOT + 30.5];
const SEP = 3.0;

/* haki 20 cm (pręt) + 3 pary nawleczone wzdłuż haka — z OBU stron płyty,
   jeden kolor (SKU) na hak; przednia para ~18 cm od lica — równo z obrysem podstawy                    */
const HOOK_L = 20;
for (const s of [1, -1]) {
  const rot = s === 1 ? '' : 'rotateY(180deg) ';
  grid.forEach((row, ri) => {
    row.forEach((name, ci) => {
      const [c, d, lc] = C[name];
      /* pręt haka */
      panel({w:HOOK_L, h:1.1, pos:[s*colsX[ci], Y(rowsTop[ri] + .8), s*(PZ + HOOK_L/2)],
        rot:'rotateY(90deg)', cls:'hang',
        css:'background:linear-gradient(180deg,#E3E7EE,#9AA2B1);border-radius:2px'});
      /* pary na haku, od tylnej do przedniej */
      for (const dz of [4, 11, 18]) {
        panel({w:16, h:HANG + SL, pos:[s*colsX[ci], Y(rowsTop[ri] + (HANG + SL)/2), s*(PZ + dz)],
          rot, cls:'hang', n:[0,0,s],
          css:`filter:drop-shadow(0 ${cm(.8)}px ${cm(1.2)}px rgba(0,0,0,.45))`,
          html:`
            <div style="position:absolute;left:50%;top:0;transform:translateX(-50%);z-index:3">${hanger()}</div>
            <div style="position:absolute;left:50%;top:${cm(HANG - 1)}px;transform:translateX(calc(-50% - ${cm(SEP)}px)) rotate(-4deg)">${slide(c,d,lc)}</div>
            <div style="position:absolute;left:50%;top:${cm(HANG - 1)}px;transform:translateX(calc(-50% + ${cm(SEP)}px)) rotate(4deg)">${slide(c,d,lc)}</div>`});
      }
    });
  });
}

/* skarpety leżące płasko na blacie (składana para, ściągacz przy płycie,
   ~16 cm długości — mieści się na 19 cm blatu bez podpierania) */
const sock = (c, d) => `<svg viewBox="0 0 90 160" style="display:block;width:${cm(9)}px">
  <g>
    <path fill="${c}" d="M20 22 H50 V84 C50 93 53 99 59 104 C68 111 72 122 66 133
      C59 145 43 148 33 141 C24 135 20 126 20 115 Z"/>
    <path fill="${d}" d="M59 104 C68 111 72 122 66 133 C62 140 55 144 47 145
      C52 132 55 118 53 106 C55 105 57 105 59 104 Z"/>
    <path fill="${d}" d="M20 96 C24 100 28 102 33 103 L33 116 C27 113 22 107 20 103 Z"/>
    <rect x="16" y="4" width="38" height="20" rx="4" fill="#fff"/>
    <g fill="${c}" transform="translate(22,9) scale(0.145) translate(-1157.26,-1062.38)">
      <path d="M1230.39 1064.36L1194.43 1136.28H1157.26L1193.22 1064.36H1230.39Z"/>
      <path d="M1262.83 1062.38C1280.82 1062.38 1295.79 1075.24 1299.09 1092.27L1299.12 1092.39L1299.21 1092.32C1303.03 1089.75 1307.03 1088.24 1312.58 1088.25C1325.84 1088.28 1336.59 1099.01 1336.59 1112.27C1336.59 1125.53 1325.84 1136.28 1312.58 1136.28H1262.75V1136.29C1242.38 1136.24 1225.88 1119.72 1225.88 1099.33C1225.88 1078.93 1242.42 1062.38 1262.83 1062.38Z"/>
    </g>
  </g>
  <g transform="translate(90,4) scale(-1,1) translate(0,0)" opacity=".92">
    <path fill="${c}" d="M20 22 H50 V84 C50 93 53 99 59 104 C68 111 72 122 66 133
      C59 145 43 148 33 141 C24 135 20 126 20 115 Z" transform="scale(0.82) translate(8,14)"/>
  </g>
</svg>`;

['black','navy','red','orange','pink','mint','beige','white'].forEach((name, i) => {
  const [c, d] = C[name];
  for (const s of [1, -1]) {
    panel({w:9, h:16, pos:[s*(-25.5 + i * 7.3), Y(Y_BASE_TOP) - .15, s*9.2],
      rot:`${s === 1 ? '' : 'rotateY(180deg) '}rotateX(90deg) rotateZ(${i % 2 ? 4 : -4}deg)`,
      cls:'ledge', n:[0,-1,0],
      css:`filter:drop-shadow(2px 2px 2px rgba(0,0,0,.3))`,
      html:sock(c, d)});
  }
});

/* ================= cień — kierunkowy (światło z lewej-góry-przodu) ================= */
parts.push(`<div class="n" style="width:${cm(W*1.9)}px;height:${cm(D*2.0)}px;
  transform:translate3d(${cm(5)}px,${cm(Y(Y_FLOOR))}px,${cm(-3)}px) rotateX(90deg) translate(-50%,-50%);
  background:radial-gradient(ellipse at 42% 46%, rgba(0,0,0,.6), transparent 68%);filter:blur(14px)"></div>`);
parts.push(`<div class="n" style="width:${cm(W*1.12)}px;height:${cm(D*1.2)}px;
  transform:translate3d(${cm(2)}px,${cm(Y(Y_FLOOR))}px,${cm(-1)}px) rotateX(90deg) translate(-50%,-50%);
  background:radial-gradient(ellipse at 46% 48%, rgba(0,0,0,.55), transparent 62%);filter:blur(6px)"></div>`);

/* ================= wymiary (opisy PL) ================= */
const V = (label, yA, yB, side, tier = 0) => {
  const x = side > 0 ? cm(W/2) + 30 + tier : -cm(W/2) - 30 - tier;
  const anchor = side > 0 ? 'left:12px' : 'right:12px';
  return `<div class="n dim" style="width:0;height:0;transform:translate3d(0,0,${cm(D/2)}px)">
    <div style="position:absolute;left:${x}px;top:${cm(Y(yA))}px;height:${cm(yB-yA)}px">
      <div class="bar-d" style="left:0;top:0;height:100%;width:1.5px"></div>
      <div class="bar-d" style="left:-6px;top:0;height:1.5px;width:14px"></div>
      <div class="bar-d" style="left:-6px;bottom:0;height:1.5px;width:14px"></div>
      <div class="lbl" data-i="${label}" style="${anchor};top:50%;transform:translateY(-50%)"></div>
    </div></div>`;
};
parts.push(V('d130', 0, Y_FLOOR, 1));
parts.push(V('d40b', Y_BASE_TOP, Y_FLOOR, -1));
parts.push(V('d90', 0, Y_BASE_TOP, -1, 150));
parts.push(`<div class="n dim" style="width:0;height:0;transform:translate3d(0,0,${cm(D/2)}px)">
  <div style="position:absolute;left:${cm(-W/2)}px;top:${cm(Y(Y_FLOOR))+30}px;width:${cm(W)}px">
    <div class="bar-d" style="left:0;top:0;width:100%;height:1.5px"></div>
    <div class="bar-d" style="left:0;top:-6px;width:1.5px;height:14px"></div>
    <div class="bar-d" style="right:0;top:-6px;width:1.5px;height:14px"></div>
    <div class="lbl" data-i="d60" style="left:50%;top:9px;transform:translateX(-50%)"></div></div></div>`);
parts.push(`<div class="n dim" style="width:0;height:0;
  transform:translate3d(${cm(W/2)+30}px,${cm(Y(Y_FLOOR))}px,0) rotateX(90deg)">
  <div style="position:absolute;left:0;top:${cm(-D/2)}px;height:${cm(D)}px">
    <div class="bar-d" style="left:0;top:0;height:100%;width:1.5px"></div>
    <div class="bar-d" style="left:-6px;top:0;height:1.5px;width:14px"></div>
    <div class="bar-d" style="left:-6px;bottom:0;height:1.5px;width:14px"></div>
    <div class="lbl" data-i="d40d" style="left:12px;top:50%;transform:translateY(-50%)"></div>
  </div></div>`);
/* wymiary dla klienta: głębokość pylonu (nad jego szczytem) i wysięg haka —
   na płaszczyźnie bocznej, widoczne w rzucie Bok przy włączonych Wymiarach */
parts.push(`<div class="n dim" style="width:0;height:0;
  transform:translate3d(${cm(W/2)+30}px,${cm(Y(PYL_TOP))-26}px,0) rotateY(90deg)">
  <div style="position:absolute;left:${cm(-9)}px;top:0;width:${cm(SIDE_W)}px">
    <div class="bar-d" style="left:0;top:0;width:100%;height:1.5px"></div>
    <div class="bar-d" style="left:0;top:-6px;width:1.5px;height:14px"></div>
    <div class="bar-d" style="right:0;top:-6px;width:1.5px;height:14px"></div>
    <div class="lbl" data-i="dPyl" style="left:50%;top:-34px;transform:translateX(-50%);border:1px solid rgba(255,255,255,.7)"></div>
  </div></div>`);
parts.push(`<div class="n dim" style="width:0;height:0;
  transform:translate3d(${cm(W/2)+30}px,${cm(Y(Y_HDR_BOT + 3.5))}px,0) rotateY(90deg)">
  <div style="position:absolute;left:${cm(-(0.9 + 20))}px;top:0;width:${cm(20)}px">
    <div class="bar-d" style="left:0;top:0;width:100%;height:1.5px"></div>
    <div class="bar-d" style="left:0;top:-6px;width:1.5px;height:14px"></div>
    <div class="bar-d" style="right:0;top:-6px;width:1.5px;height:14px"></div>
    <div class="lbl" data-i="dHook" style="left:50%;top:9px;transform:translateX(-50%);border:1px solid rgba(255,255,255,.7)"></div>
  </div></div>`);

document.getElementById('stand').innerHTML = parts.join('');
/* ================= i18n: EN domyślnie, przełącznik PL ================= */
const STR = {
  en: {
    vFront:'Front', vSide:'Side', vBack:'Back', vTop:'Top',
    tDims:'Dimensions', tProd:'Products', tBg:'Background', tLang:'PL',
    hint:'Drag to rotate · scroll to zoom',
    d130:'130 cm — total height', d40b:'40 cm — plinth height', d90:'90 cm — centre panel',
    d60:'60 cm — plinth width', d40d:'40 cm — plinth depth',
    dPyl:'20 cm — side pylon depth', dHook:'20 cm — hook',
    title:'KUBOTA × Baltona — display stand 60×40×130 · 3D visualization',
    spec:`Plinth width <b>60 cm</b> · Plinth depth <b>40 cm</b><br>
      Total height <b>130 cm</b> · Plinth height <b>40 cm</b><br>
      Centre panel <b>60 × 90 cm</b>, double-sided · White pegboard<br>
      Side pylons <b>20 cm</b> deep · Hooks <b>20 cm</b> — 3 pairs per hook<br>
      Hooks <b>2 × 4 × 2 sides</b> × 3 pairs = <b>48 pairs</b> · Socks on the plinth top`,
  },
  pl: {
    vFront:'Przód', vSide:'Bok', vBack:'Tył', vTop:'Góra',
    tDims:'Wymiary', tProd:'Produkty', tBg:'Tło', tLang:'EN',
    hint:'Przeciągnij, aby obrócić · scroll = przybliżenie',
    d130:'130 cm — suma wysokości', d40b:'40 cm — wysokość podstawy', d90:'90 cm — płyta centralna',
    d60:'60 cm — szerokość podstawy', d40d:'40 cm — głębokość podstawy',
    dPyl:'20 cm — głębokość pylonu', dHook:'20 cm — hak',
    title:'KUBOTA × Baltona — stand ekspozycyjny 60×40×130 · wizualizacja 3D',
    spec:`Szerokość podstawy <b>60 cm</b> · Głębokość podstawy <b>40 cm</b><br>
      Suma wysokości <b>130 cm</b> · Wysokość podstawy <b>40 cm</b><br>
      Płyta centralna <b>60 × 90 cm</b>, dwustronna · Pegboard <b>biały</b><br>
      Pylony boczne <b>20 cm</b> gł. · Haki <b>20 cm</b> — 3 pary na haku<br>
      Haki <b>2 × 4 × 2 strony</b> × 3 pary = <b>48 par</b> klapek · Skarpety na blacie`,
  },
};
let lang = 'en';
function setLang(l){
  lang = l;
  const t = STR[l];
  document.documentElement.lang = l;
  document.title = t.title;
  document.querySelectorAll('[data-i]').forEach(el => {
    if (el.dataset.i === 'spec') return;
    el.innerHTML = t[el.dataset.i] ?? el.innerHTML;
  });
  document.getElementById('spec').innerHTML = t.spec;
}

/* ================= światło i cieniowanie =================
   kierunek DO światła (lewa-góra-przód, układ świata; y rośnie w dół) */
const LIGHT = (() => { const v = [-0.5, -0.75, 0.8], m = Math.hypot(...v); return v.map(x => x / m); })();
const shaded = [...document.querySelectorAll('[data-n]')].map(el => ({
  el, n: el.dataset.n.split(',').map(Number), base: el.style.filter || '',
  spec: el.querySelector('.specular') || el.querySelector('.svg-spec'),
}));
function shade(rx, ry){
  const cx = Math.cos(rx*Math.PI/180), sx = Math.sin(rx*Math.PI/180);
  const cy = Math.cos(ry*Math.PI/180), sy = Math.sin(ry*Math.PI/180);
  for (const s of shaded){
    const [x, y, z] = s.n;
    const x1 = x*cy + z*sy, z1 = -x*sy + z*cy;          // rotateY
    const y2 = y*cx - z1*sx, z2 = y*sx + z1*cx;         // rotateX
    const d = Math.max(0, x1*LIGHT[0] + y2*LIGHT[1] + z2*LIGHT[2]);
    s.el.style.filter = `${s.base} brightness(${(0.78 + 0.34*d).toFixed(3)})`.trim();
    if (s.spec){
      const o = (0.24 * Math.pow(d, 5)).toFixed(3);
      if (s.spec.tagName === 'g') s.spec.setAttribute('opacity', o);
      else s.spec.style.opacity = o;
    }
  }
}

/* ================= kamera ================= */
const rig = document.getElementById('rig'), stage = document.getElementById('stage');
const views = {'34':[-6,-26,.62], front:[0,0,.66], side:[-3,-84,.62], back:[-6,196,.62], top:[-62,-22,.54]};
let [rx, ry, zoom] = views['34'], drag = null;
/* na wąskich ekranach bryła skaluje się w dół, żeby zmieściła się w kadrze */
let resp = 1;
const updResp = () => { resp = Math.min(1, innerWidth / 640, innerHeight / 760); };
updResp();
const apply = () => { rig.style.transform = `scale(${zoom * resp}) rotateX(${rx}deg) rotateY(${ry}deg)`; shade(rx, ry); };
addEventListener('resize', () => { updResp(); apply(); });
apply();

stage.addEventListener('pointerdown', e => {
  drag = {x:e.clientX, y:e.clientY, rx, ry};
  rig.classList.add('drag'); stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove', e => {
  if(!drag) return;
  ry = drag.ry + (e.clientX - drag.x) * .38;
  rx = Math.max(-88, Math.min(75, drag.rx - (e.clientY - drag.y) * .3));
  apply();
});
stage.addEventListener('pointerup', () => { drag = null; rig.classList.remove('drag'); });
stage.addEventListener('wheel', e => {
  e.preventDefault();
  zoom = Math.max(.25, Math.min(2.4, zoom * (e.deltaY > 0 ? .92 : 1.08)));
  apply();
}, {passive:false});

document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => {
  [rx, ry, zoom] = views[b.dataset.view]; apply();
});
const dimsBtn = document.getElementById('dims'), prodsBtn = document.getElementById('prods'), bgBtn = document.getElementById('bg');
dimsBtn.onclick  = () => { document.body.classList.toggle('dims-on');      dimsBtn.classList.toggle('on'); };
prodsBtn.onclick = () => { document.body.classList.toggle('products-off'); prodsBtn.classList.toggle('on'); };
bgBtn.onclick    = () => { document.body.classList.toggle('light');        bgBtn.classList.toggle('on'); };
document.getElementById('lang').onclick = () => setLang(lang === 'en' ? 'pl' : 'en');

/* tryb renderu: ?plate=front|34|side|back|top [&dims=1] [&zoom=…] — czysty kadr bez UI
   ?bg=light — start z jasnym tłem (link do udostępniania) */
const q = new URLSearchParams(location.search);
setLang(q.get('lang') === 'pl' ? 'pl' : 'en');
if (q.get('bg') === 'light') { document.body.classList.add('light'); bgBtn.classList.add('on'); }
if (q.has('plate')) {
  document.querySelectorAll('.hud, .bar').forEach(e => e.remove());
  document.body.classList.add('plate');
  document.body.style.background = '#EDEFF3';
  if (q.has('dims')) document.body.classList.add('dims-on');
  const v = views[q.get('plate')] || views['34'];
  [rx, ry] = v;
  if (q.has('rx')) rx = +q.get('rx');
  if (q.has('ry')) ry = +q.get('ry');
  zoom = +(q.get('zoom') || 1.0); apply();
}
</script>
</body>
</html>
"""

HTML = (HTML
        .replace("__DIELINE__", DIELINE)
        .replace("__BOKTXT__", BOK_TXT)
        .replace("__BOK__", BOK)
        .replace("__BALTONA__", BALTONA))
OUT.write_text(HTML)
print(f"OK -> {OUT}  ({len(HTML)/1024:.0f} KB)")
