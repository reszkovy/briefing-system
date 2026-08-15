# -*- coding: utf-8 -*-
"""Scala wyniki z 4 stockow i buduje interfejs HTML."""
import json, os, re, glob, html, urllib.parse
from cities import CITIES

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = "/Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/stocki-miasta/index.html"

LISTA_A = {"bialystok","elk","ketrzyn","lidzbark","lomza","mragowo","olsztyn","suwalki",
           "ostroleka","ciechanow","augustow","ilawa","lublin","radomsko","warszawa",
           "grodzisk","krakow","wroclaw","lodz","bydgoszcz","katowice","gdynia",
           "czestochowa","kielce","rzeszow","torun"}
LISTA_B = {"bielsko","krakow","nowysacz","nowytarg","oswiecim","zywiec","zakopane",
           "lublin","kielce","katowice","bydgoszcz","gdansk","wroclaw","rzeszow",
           "czestochowa","torun","lodz","gdynia"}


def freepik_link(item):
    """Buduje adres strony pozycji z previewUrl + id."""
    pv = item.get("preview") or ""
    m = re.match(r"https://img\.magnific\.com/([^/]+)/(.+)\.jpg", pv)
    if not m:
        return "https://www.magnific.com/search?format=search&query=" + str(item.get("id", ""))
    folder, fname = m.group(1), m.group(2)
    slug = fname.rsplit("_", 1)[0]
    return f"https://www.magnific.com/{folder}/{slug}_{item['id']}.htm"


# --- ocena jakosci ujec z warstwy CC (Openverse zwraca tez mapy, flagi, tabor) ---
CC_ODPAD = ("flag", "coat of arms", "herb ", "location map", "administrative map",
            "map-pl", " mapa", "mapa ", "logo", "seal of", "voivodship", "voivodeship",
            "county", "gmina ", "okreg", "okręg", "powiat")
CC_SLABE = ("autosan", "scania", "karsan", "solaris", "mercedes", "volvo", "pks ",
            "truck", " bus", "bus ", "autobus", "locomotive", "wagon", "tabor",
            "postcard", "pocztowka", "bitwa", "battle", "airport", "lotnisko",
            "cmentarz", "cemetery", "tablica", "plaque", "pomnik ofiar")
CC_DOBRE = ("panorama", "rynek", "ratusz", "stare miasto", "old town", "market square",
            "aerial", "z lotu", "skyline", "cityscape", "zamek", "castle", "katedra",
            "cathedral", "bazylika", "basilica", "kosciol", "kościół", "church",
            "starowka", "starówka", "deptak", "centrum", "widok", "view of", "palac", "pałac")


# "Elk" po angielsku to los/wapiti — wyrzucamy zwierzeta z wynikow dla Elku
ZWIERZE = ("bull elk", "elk in the", "elk stand", "wapiti", "antler", "wildlife", "deer",
           "moose", "grand teton", "yellowstone", "herd", "bugling", "elk cow", "rutting",
           "elk bull", "national park", "elk calf", "elk grazing")


def to_jest_zwierze(title):
    t = (title or "").lower()
    return any(k in t for k in ZWIERZE)


def cc_score(title):
    t = (title or "").lower()
    if any(k in t for k in CC_ODPAD):
        return None                      # odrzucamy calkiem
    s = 0
    if any(k in t for k in CC_SLABE):
        s += 2
    if any(k in t for k in CC_DOBRE):
        s -= 1
    return s


def wiki_thumb(url, px=500):
    """Wikimedia: oficjalny resizer Special:FilePath (recznie sklejane /thumb/ zwraca 400)."""
    m = re.match(r"https://upload\.wikimedia\.org/wikipedia/commons/[0-9a-f]/[0-9a-f]{2}/(.+)$", url or "")
    if not m:
        return None
    fn = m.group(1)
    if fn.lower().endswith((".svg", ".tif", ".tiff", ".pdf")):
        return None
    return f"https://commons.wikimedia.org/wiki/Special:FilePath/{fn}?width={px}"


def load():
    free = json.load(open(os.path.join(HERE, "free_stocks.json")))
    # podmien miniatury CC na dzialajace (endpoint openverse/thumb czesto zwraca 424)
    for v in free.values():
        for o in v.get("openverse", []):
            wt = wiki_thumb(o.get("big"))
            if wt:
                o["thumb"] = wt
                o["big"] = wiki_thumb(o["big"], 1400) or o["big"]
    paid = {}
    for p in sorted(glob.glob(os.path.join(HERE, "paid_g*.json"))):
        try:
            paid.update(json.load(open(p)))
        except Exception as e:
            print("pomijam", p, e)
    notes = {}
    np_ = os.path.join(HERE, "notes.json")
    if os.path.exists(np_):
        notes = json.load(open(np_))
    return free, paid, notes


def build_city(name, slug, query, need, keys, free, paid):
    shots = []
    pd = paid.get(slug, {}) or {}

    for a in (pd.get("adobe") or []):
        shots.append({
            "src": "adobe", "srcLabel": "Adobe Stock",
            "title": a.get("title") or "(bez tytulu)",
            "thumb": a.get("thumb", ""),
            "big": a.get("thumb", ""),
            "link": f"https://stock.adobe.com/search?k={a.get('id','')}",
            "meta": f"ID {a.get('id','')}" + (f" · {a.get('w','?')}×{a.get('h','?')} px" if a.get("w") else ""),
            "license": "Adobe Stock — licencja płatna" if a.get("pricing") != "free" else "Adobe Stock — pula darmowa",
            "ai": bool(a.get("ai")),
        })

    for f in (pd.get("freepik") or []):
        shots.append({
            "src": "freepik", "srcLabel": "Freepik / Magnific",
            "title": f.get("title") or "(bez tytulu)",
            "thumb": f.get("preview", ""),
            "big": f.get("preview", ""),
            "link": freepik_link(f),
            "meta": f"ID {f.get('id','')}",
            "license": "Freepik — premium" if f.get("premium") else "Freepik — darmowa (z atrybucją)",
            "ai": bool(f.get("ai")),
        })

    fe = free.get(slug, {})
    for e in fe.get("envato", []):
        if not e.get("strict"):
            continue
        shots.append({
            "src": "envato", "srcLabel": "Envato Elements",
            "title": e["title"], "thumb": e["thumb"], "big": e["big"], "link": e["link"],
            "meta": "", "license": e["license"], "ai": False,
        })
    cc = []
    for o in fe.get("openverse", []):
        if not o.get("strict"):
            continue
        sc = cc_score(o["title"])
        if sc is None:
            continue
        cc.append((sc, o))
    cc.sort(key=lambda p: p[0])
    for _, o in cc:
        shots.append({
            "src": "openverse", "srcLabel": "Darmowe / CC",
            "title": o["title"], "thumb": o["thumb"], "big": o["big"], "link": o["link"],
            "meta": ("aut. " + o["author"]) if o.get("author") else "",
            "license": o["license"], "ai": False,
        })

    if slug == "elk":
        shots = [s for s in shots if not to_jest_zwierze(s["title"])]

    # ujecia z nazwa miasta w tytule sa pewniejsze niz sam landmark bez nazwy
    warianty = [k for k in keys if len(k) > 3] + [name.lower(), query.lower().split()[0]]

    def nazwane(s):
        t = s["title"].lower()
        return any(w in t for w in warianty)

    # najpierw ujecia z nazwa miasta w tytule (pewnosc lokalizacji), potem wg stocka
    order = {"adobe": 0, "envato": 1, "freepik": 2, "openverse": 3}
    shots.sort(key=lambda s: (not nazwane(s), order[s["src"]], s["ai"]))
    for s in shots:
        s["nazwane"] = nazwane(s)
    for i, s in enumerate(shots):
        s["pick"] = i < need
        s["idx"] = i

    listy = []
    if slug in LISTA_A:
        listy.append("A")
    if slug in LISTA_B:
        listy.append("B")

    return {
        "name": name, "slug": slug, "query": query, "need": need,
        "listy": listy, "shots": shots,
        "counts": {k: sum(1 for s in shots if s["src"] == k)
                   for k in ("adobe", "freepik", "envato", "openverse")},
    }


CSS = """
*{box-sizing:border-box}
:root{
 --bg:#f6f6f4; --panel:#fff; --ink:#16161a; --muted:#6b6b76; --line:#e3e3de;
 --accent:#1a4fd6; --pick:#c8f13a; --shadow:0 1px 2px rgba(0,0,0,.05),0 8px 24px rgba(0,0,0,.05);
 --adobe:#e0342b; --freepik:#0d70ea; --envato:#149c5a; --openverse:#7b3fc4;
}
@media (prefers-color-scheme:dark){:root{
 --bg:#111114; --panel:#1a1a1f; --ink:#f0f0ee; --muted:#9a9aa6; --line:#2b2b33;
 --accent:#7ea2ff; --shadow:0 1px 2px rgba(0,0,0,.4),0 8px 24px rgba(0,0,0,.35);}}
html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--ink);
 font:15px/1.5 ui-sans-serif,-apple-system,"Segoe UI",Inter,system-ui,sans-serif;
 -webkit-font-smoothing:antialiased}
a{color:inherit}
header.top{position:sticky;top:0;z-index:40;background:var(--panel);
 border-bottom:1px solid var(--line);box-shadow:var(--shadow)}
.wrap{max-width:1520px;margin:0 auto;padding:0 22px}
.hrow{display:flex;gap:18px;align-items:center;flex-wrap:wrap;padding:14px 0}
h1{font-size:19px;margin:0;letter-spacing:-.02em;font-weight:700}
.sub{color:var(--muted);font-size:13px;margin-top:2px}
.grow{flex:1}
input[type=search]{background:var(--bg);border:1px solid var(--line);color:var(--ink);
 border-radius:9px;padding:8px 12px;font-size:14px;min-width:210px;font-family:inherit}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:999px;
 padding:6px 13px;font-size:12.5px;cursor:pointer;font-family:inherit;font-weight:500;
 display:inline-flex;align-items:center;gap:6px;transition:.12s}
.chip:hover{border-color:var(--muted)}
.chip[aria-pressed=true]{background:var(--ink);color:var(--panel);border-color:var(--ink)}
.chip .dot{width:8px;height:8px;border-radius:50%}
.btn{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:9px;
 padding:8px 14px;font-size:13px;cursor:pointer;font-family:inherit;font-weight:600}
.btn.primary{background:var(--ink);color:var(--panel);border-color:var(--ink)}
.btn:disabled{opacity:.4;cursor:default}
nav.jump{border-top:1px solid var(--line);background:var(--panel);max-height:76px;overflow-y:auto}
nav.jump .wrap{display:flex;gap:5px;flex-wrap:wrap;padding:8px 22px}
nav.jump a{font-size:12px;color:var(--muted);text-decoration:none;padding:3px 8px;
 border-radius:6px;border:1px solid transparent;white-space:nowrap}
nav.jump a:hover{color:var(--ink);border-color:var(--line);background:var(--bg)}
nav.jump a.warn{color:#c2410c}
section.city{padding:26px 0 6px;border-bottom:1px solid var(--line);scroll-margin-top:120px}
.chead{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.chead h2{font-size:22px;margin:0;letter-spacing:-.02em}
.badge{font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
 padding:3px 8px;border-radius:5px;border:1px solid var(--line);color:var(--muted)}
.badge.dbl{background:var(--pick);border-color:var(--pick);color:#16161a}
.badge.miss{background:#fde2d3;border-color:#f5b48a;color:#9a3412}
.cnt{font-size:12.5px;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:14px;padding-bottom:22px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden;
 display:flex;flex-direction:column;transition:.14s;position:relative}
.card:hover{transform:translateY(-2px);box-shadow:var(--shadow)}
.card.sel{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent)}
.thumbwrap{position:relative;aspect-ratio:4/3;background:var(--bg);cursor:pointer;overflow:hidden}
.thumbwrap img{width:100%;height:100%;object-fit:cover;display:block}
.thumbwrap .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 color:var(--muted);font-size:11px;text-align:center;padding:12px}
.src{position:absolute;left:8px;top:8px;font-size:10.5px;font-weight:700;letter-spacing:.03em;
 color:#fff;padding:3px 7px;border-radius:5px;text-transform:uppercase}
.src.adobe{background:var(--adobe)}.src.freepik{background:var(--freepik)}
.src.envato{background:var(--envato)}.src.openverse{background:var(--openverse)}
.star{position:absolute;right:8px;top:8px;background:var(--pick);color:#16161a;font-size:10.5px;
 font-weight:800;padding:3px 7px;border-radius:5px;letter-spacing:.03em}
.aitag{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.72);color:#fff;
 font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px}
.body{padding:10px 11px 11px;display:flex;flex-direction:column;gap:5px;flex:1}
.t{font-size:12.5px;line-height:1.35;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;
 -webkit-box-orient:vertical;overflow:hidden}
.m{font-size:11px;color:var(--muted)}
.acts{display:flex;gap:6px;margin-top:auto;padding-top:7px}
.acts a,.acts button{flex:1;text-align:center;font-size:11.5px;font-weight:600;padding:6px 4px;
 border-radius:7px;border:1px solid var(--line);background:var(--bg);color:var(--ink);
 text-decoration:none;cursor:pointer;font-family:inherit}
.acts a:hover,.acts button:hover{border-color:var(--muted)}
.cnote{font-size:12.5px;color:var(--muted);line-height:1.6;margin:0 0 14px;padding:9px 13px;
 background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--accent);
 border-radius:0 8px 8px 0;max-width:1050px}
.cnote b{color:var(--ink)}
.empty{color:var(--muted);font-size:13.5px;padding:14px 16px;background:var(--panel);
 border:1px dashed var(--line);border-radius:10px;margin-bottom:22px}
.empty a{color:var(--accent)}
#lightbox{position:fixed;inset:0;background:rgba(0,0,0,.9);display:none;align-items:center;
 justify-content:center;z-index:100;padding:36px;cursor:zoom-out}
#lightbox img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px}
#lightbox .cap{position:absolute;bottom:16px;left:0;right:0;text-align:center;color:#fff;
 font-size:13px;padding:0 30px}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--ink);
 color:var(--panel);padding:10px 18px;border-radius:9px;font-size:13px;font-weight:600;
 z-index:200;opacity:0;pointer-events:none;transition:.2s}
.toast.on{opacity:1}
.note{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px 18px;
 margin:20px 0;font-size:13px;color:var(--muted);line-height:1.65}
.note b{color:var(--ink)}
.hidden{display:none !important}
@media(max-width:640px){.grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}}
"""

JS = """
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='stocki-miasta-wybor';
let sel=new Set(JSON.parse(localStorage.getItem(KEY)||'[]'));

function syncCards(){
  $$('.card').forEach(c=>c.classList.toggle('sel',sel.has(c.dataset.uid)));
  $('#selcount').textContent=sel.size;
  $('#copy').disabled=sel.size===0; $('#clear').disabled=sel.size===0;
  localStorage.setItem(KEY,JSON.stringify([...sel]));
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');
  clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),1900);}

document.addEventListener('click',e=>{
  const pick=e.target.closest('.js-pick');
  if(pick){const c=pick.closest('.card');const u=c.dataset.uid;
    sel.has(u)?sel.delete(u):sel.add(u);syncCards();return;}
  const th=e.target.closest('.thumbwrap');
  if(th&&th.dataset.big){const lb=$('#lightbox');$('#lbimg').src=th.dataset.big;
    $('#lbcap').textContent=th.dataset.cap;lb.style.display='flex';return;}
});
$('#lightbox').addEventListener('click',()=>{$('#lightbox').style.display='none';$('#lbimg').src='';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#lightbox').style.display='none';}});

// filtry
const state={src:new Set(['adobe','freepik','envato','openverse']),only2:false,q:''};
function applyFilters(){
  $$('section.city').forEach(sec=>{
    const nm=sec.dataset.name.toLowerCase();
    let vis=0;
    $$('.card',sec).forEach(c=>{
      const ok=state.src.has(c.dataset.src);
      c.classList.toggle('hidden',!ok); if(ok)vis++;
    });
    const okQ=!state.q||nm.includes(state.q);
    const ok2=!state.only2||sec.dataset.need==='2';
    sec.classList.toggle('hidden',!(okQ&&ok2));
    const e=$('.empty',sec); if(e) e.classList.toggle('hidden',vis>0&&!e.dataset.always);
  });
}
$$('.chip[data-src]').forEach(b=>b.addEventListener('click',()=>{
  const s=b.dataset.src; state.src.has(s)?state.src.delete(s):state.src.add(s);
  b.setAttribute('aria-pressed',state.src.has(s));applyFilters();
}));
$('#only2').addEventListener('click',e=>{state.only2=!state.only2;
  e.currentTarget.setAttribute('aria-pressed',state.only2);applyFilters();});
$('#q').addEventListener('input',e=>{state.q=e.target.value.trim().toLowerCase();applyFilters();});

$('#copy').addEventListener('click',()=>{
  const rows=[];
  $$('section.city').forEach(sec=>{
    const picked=$$('.card',sec).filter(c=>sel.has(c.dataset.uid));
    if(!picked.length)return;
    rows.push('## '+sec.dataset.name);
    picked.forEach(c=>rows.push(`- [${c.dataset.srclabel}] ${c.dataset.title} — ${c.dataset.link}`));
    rows.push('');
  });
  navigator.clipboard.writeText(rows.join('\\n')).then(()=>toast('Skopiowano '+sel.size+' pozycji'));
});
$('#clear').addEventListener('click',()=>{sel.clear();syncCards();toast('Wyczyszczono wybór');});
$('#pickall').addEventListener('click',()=>{
  $$('.card[data-pick="1"]').forEach(c=>sel.add(c.dataset.uid));syncCards();
  toast('Zaznaczono propozycje');
});
function setScroll(){
  const h=$('header.top').offsetHeight+16;
  $$('section.city').forEach(s=>s.style.scrollMarginTop=h+'px');
}
addEventListener('resize',setScroll); setScroll();
syncCards();
"""


def card(city, s):
    uid = f"{city['slug']}-{s['idx']}"
    thumb = s["thumb"]
    cap = html.escape(f"{city['name']} — {s['title']} ({s['srcLabel']})", quote=True)
    fb = ("Envato nie udostępnia podglądu poza swoim serwisem —<br>kliknij „Otwórz w źródle”"
          if s["src"] == "envato" else "podgląd niedostępny —<br>otwórz w źródle")
    img = (f'<img loading="lazy" referrerpolicy="no-referrer" src="{html.escape(thumb, quote=True)}" alt="" '
           f'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
           f'<div class="ph" style="display:none">{fb}</div>'
           ) if thumb else '<div class="ph" style="display:flex">brak podglądu</div>'
    return f"""<article class="card" data-uid="{uid}" data-src="{s['src']}" data-pick="{1 if s['pick'] else 0}"
 data-srclabel="{html.escape(s['srcLabel'],quote=True)}" data-title="{html.escape(s['title'],quote=True)}"
 data-link="{html.escape(s['link'],quote=True)}">
 <div class="thumbwrap" data-big="{html.escape(s['big'],quote=True)}" data-cap="{cap}">
  {img}
  <span class="src {s['src']}">{html.escape(s['srcLabel'])}</span>
  {'<span class="star">propozycja</span>' if s['pick'] else ''}
  {'<span class="aitag">AI</span>' if s['ai'] else ''}
 </div>
 <div class="body">
  <div class="t">{html.escape(s['title'])}</div>
  <div class="m">{html.escape(s['license'])}{(' · ' + html.escape(s['meta'])) if s['meta'] else ''}</div>
  <div class="acts">
   <a href="{html.escape(s['link'],quote=True)}" target="_blank" rel="noopener">Otwórz w źródle</a>
   <button class="js-pick" type="button">Wybierz</button>
  </div>
 </div>
</article>"""


def main():
    free, paid, notes = load()
    cities = [build_city(n, s, q, need, keys, free, paid) for n, s, q, need, keys in CITIES]
    for c in cities:
        c["note"] = notes.get(c["slug"], "")

    tot = sum(len(c["shots"]) for c in cities)
    per = {k: sum(c["counts"][k] for c in cities) for k in ("adobe", "freepik", "envato", "openverse")}
    braki = [c for c in cities if not c["shots"]]
    slabe = [c for c in cities if 0 < len(c["shots"]) < c["need"]]

    jump = "".join(
        f'<a href="#{c["slug"]}" class="{"warn" if len(c["shots"]) < c["need"] else ""}">'
        f'{html.escape(c["name"])}<span style="opacity:.55"> {len(c["shots"])}</span></a>'
        for c in cities)

    secs = []
    for c in cities:
        dbl = '<span class="badge dbl">×2 — powtórka z obu list</span>' if c["need"] == 2 else ""
        listy = f'<span class="badge">lista {" + ".join(c["listy"])}</span>' if c["listy"] else ""
        miss = '<span class="badge miss">brak trafień</span>' if not c["shots"] else ""
        cnt = " · ".join(f"{k}: {v}" for k, v in c["counts"].items() if v)
        uq = urllib.parse.quote(c["query"])
        empty = ""
        if not c["shots"]:
            empty = (f'<div class="empty" data-always="1">Żaden ze stocków nie zwrócił pewnego ujęcia. '
                     f'Sprawdź ręcznie: '
                     f'<a href="https://stock.adobe.com/search?k={uq}" target="_blank" rel="noopener">Adobe Stock</a> · '
                     f'<a href="https://unsplash.com/s/photos/{uq}" target="_blank" rel="noopener">Unsplash</a> · '
                     f'<a href="https://elements.envato.com/photos/{uq.lower()}" target="_blank" rel="noopener">Envato</a> · '
                     f'<a href="https://commons.wikimedia.org/w/index.php?search={uq}" target="_blank" rel="noopener">Wikimedia Commons</a></div>')
        else:
            empty = ('<div class="empty hidden">Brak pozycji dla wybranych źródeł — '
                     'włącz więcej filtrów u góry.</div>')
        secs.append(f"""<section class="city" id="{c['slug']}" data-name="{html.escape(c['name'],quote=True)}" data-need="{c['need']}">
 <div class="chead"><h2>{html.escape(c['name'])}</h2>{dbl}{listy}{miss}
  <span class="cnt">{len(c['shots'])} ujęć{(' · ' + cnt) if cnt else ''} · potrzeba {c['need']}</span>
  <span class="grow"></span>
  <a class="cnt" style="color:var(--accent)" href="https://stock.adobe.com/search?k={uq}" target="_blank" rel="noopener">szukaj ręcznie ↗</a>
 </div>
 {f'<p class="cnote"><b>Uwaga do wyników:</b> {html.escape(c["note"])}</p>' if c.get("note") else ''}
 {empty}
 <div class="grid">{"".join(card(c, s) for s in c['shots'])}</div>
</section>""")

    note = f"""<div class="note">
<b>Jak to czytać.</b> Miasta oznaczone <span class="badge dbl">×2</span> powtarzają się na obu listach — dla nich zaznaczyłem dwie propozycje zamiast jednej.
Kafle z etykietą <b>propozycja</b> to mój domyślny wybór (priorytet: Adobe Stock → Envato → Freepik → CC). Kliknij miniaturę, żeby powiększyć; „Wybierz" dodaje pozycję do koszyka, a „Kopiuj wybrane" zrzuca listę linków do schowka.<br><br>
<b>Licencje.</b> Adobe Stock i Envato Elements wymagają wykupionej licencji / subskrypcji. Freepik: część darmowa z atrybucją, część premium. Warstwa CC (Wikimedia, Flickr) jest darmowa, ale <b>wymaga podania autora i licencji</b> — sprawdź warunki przy konkretnym pliku.<br><br>
<b>Czego nie udało się pobrać.</b> Unsplash i Pexels blokują automatyczne zapytania z tego środowiska, więc warstwę darmową oparłem na Openverse (agreguje Wikimedia Commons i Flickr na licencjach CC). Przy każdym mieście jest gotowy link „szukaj ręcznie" oraz linki do Unsplasha w sekcjach bez trafień. Envato Elements ma realnie ubogie pokrycie polskich miast regionalnych — dla większości mniejszych ośrodków zwraca zdjęcia zupełnie innych miejsc, więc je odfiltrowałem.
</div>"""

    doc = f"""<!doctype html>
<html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zdjęcia polskich miast — przegląd stocków</title>
<style>{CSS}</style></head><body>
<header class="top"><div class="wrap"><div class="hrow">
 <div><h1>Zdjęcia polskich miast — przegląd stocków</h1>
  <div class="sub">{len(cities)} miast · {tot} ujęć · Adobe {per['adobe']} · Freepik {per['freepik']} · Envato {per['envato']} · CC {per['openverse']}</div></div>
 <span class="grow"></span>
 <input type="search" id="q" placeholder="Filtruj miasto…">
 <div class="chips">
  <button class="chip" data-src="adobe" aria-pressed="true"><span class="dot" style="background:var(--adobe)"></span>Adobe</button>
  <button class="chip" data-src="freepik" aria-pressed="true"><span class="dot" style="background:var(--freepik)"></span>Freepik</button>
  <button class="chip" data-src="envato" aria-pressed="true"><span class="dot" style="background:var(--envato)"></span>Envato</button>
  <button class="chip" data-src="openverse" aria-pressed="true"><span class="dot" style="background:var(--openverse)"></span>CC / darmowe</button>
  <button class="chip" id="only2" aria-pressed="false">tylko ×2</button>
 </div>
 <button class="btn" id="pickall">Zaznacz propozycje</button>
 <button class="btn" id="clear" disabled>Wyczyść</button>
 <button class="btn primary" id="copy" disabled>Kopiuj wybrane (<span id="selcount">0</span>)</button>
</div></div>
<nav class="jump"><div class="wrap">{jump}</div></nav>
</header>
<main class="wrap">{note}{"".join(secs)}</main>
<div id="lightbox"><img id="lbimg" alt=""><div class="cap" id="lbcap"></div></div>
<div class="toast" id="toast"></div>
<script>{JS}</script></body></html>"""

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        f.write(doc)

    print(f"OK -> {OUT}")
    print(f"miast {len(cities)} · ujec {tot} · {per}")
    if braki:
        print("BRAK TRAFIEN:", ", ".join(c["name"] for c in braki))
    if slabe:
        print("PONIZEJ POTRZEB:", ", ".join(f'{c["name"]}({len(c["shots"])}/{c["need"]})' for c in slabe))


if __name__ == "__main__":
    main()
