# -*- coding: utf-8 -*-
"""Buduje finalna liste sugestii jako jednostronicowy HTML."""
import json, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "finalna-lista.html")

ETYKIETY = {"adobe": "Adobe Stock", "freepik": "Freepik", "envato": "Envato", "openverse": "CC"}

CSS = """
*{box-sizing:border-box}
:root{--bg:#f6f6f4;--panel:#fff;--ink:#16161a;--muted:#6b6b76;--line:#e3e3de;
 --accent:#1a4fd6;--pick:#c8f13a;--adobe:#e0342b;--freepik:#0d70ea;--envato:#149c5a;--openverse:#7b3fc4}
@media (prefers-color-scheme:dark){:root{--bg:#111114;--panel:#1a1a1f;--ink:#f0f0ee;
 --muted:#9a9aa6;--line:#2b2b33;--accent:#7ea2ff}}
html,body{margin:0}
body{background:var(--bg);color:var(--ink);font:15px/1.55 ui-sans-serif,-apple-system,"Segoe UI",Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:34px 24px 70px}
h1{font-size:27px;margin:0 0 6px;letter-spacing:-.025em}
.lead{color:var(--muted);font-size:14px;margin:0 0 4px}
.stats{display:flex;gap:8px;flex-wrap:wrap;margin:20px 0 26px}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:9px 14px;font-size:13px}
.stat b{font-size:17px;display:block;letter-spacing:-.02em}
.box{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px 19px;
 margin:0 0 26px;font-size:13.5px;color:var(--muted);line-height:1.7}
.box b{color:var(--ink)}
.row{display:flex;gap:15px;padding:15px 0;border-top:1px solid var(--line);align-items:flex-start}
.row:last-child{border-bottom:1px solid var(--line)}
.n{width:26px;flex:none;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums;padding-top:3px}
.th{width:132px;height:99px;flex:none;border-radius:8px;overflow:hidden;background:var(--bg);
 border:1px solid var(--line);position:relative}
.th img{width:100%;height:100%;object-fit:cover;display:block}
.th .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 font-size:10px;color:var(--muted);text-align:center;padding:8px}
.info{flex:1;min-width:0}
.city{font-size:17px;font-weight:700;letter-spacing:-.015em;display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.dbl{background:var(--pick);color:#16161a;font-size:10px;font-weight:800;padding:2px 7px;
 border-radius:4px;letter-spacing:.04em;text-transform:uppercase}
.ttl{font-size:13.5px;margin:4px 0 6px;color:var(--ink)}
.meta{font-size:12px;color:var(--muted);display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.src{font-size:10px;font-weight:800;color:#fff;padding:2px 7px;border-radius:4px;letter-spacing:.04em;text-transform:uppercase}
.src.adobe{background:var(--adobe)}.src.freepik{background:var(--freepik)}
.src.envato{background:var(--envato)}.src.openverse{background:var(--openverse)}
.meta a{color:var(--accent)}
.warn{font-size:12px;color:#9a3412;background:#fde2d3;border:1px solid #f5b48a;
 border-radius:6px;padding:5px 9px;margin-top:7px;display:inline-block}
@media (prefers-color-scheme:dark){.warn{background:#3a1e10;border-color:#7c3a12;color:#fbbf8a}}
h2{font-size:18px;margin:38px 0 12px;letter-spacing:-.02em}
table{width:100%;border-collapse:collapse;font-size:12.5px}
td,th{text-align:left;padding:7px 9px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--muted);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
@media print{.th{width:88px;height:66px}body{background:#fff}.row{break-inside:avoid}}
"""


def main():
    fin = json.load(open(os.path.join(HERE, "final.json")))
    rows, cc, n = [], [], 0

    for w in fin:
        for j, s in enumerate(w["wybor"]):
            n += 1
            dbl = '<span class="dbl">ujęcie %d z 2</span>' % (j + 1) if w["need"] == 2 else ""
            miasto = html.escape(w["name"]) if j == 0 else \
                f'<span style="opacity:.45">{html.escape(w["name"])}</span>'
            thumb = html.escape(s["thumb"], quote=True)
            img = (f'<img loading="lazy" referrerpolicy="no-referrer" src="{thumb}" alt="" '
                   f'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
                   f'<div class="ph" style="display:none">podgląd<br>w źródle</div>')
            ostrz = ""
            if s["src"] == "openverse":
                ostrz = '<div class="warn">wymaga podania autora i licencji przy publikacji</div>'
                cc.append((w["name"], s))
            rows.append(f"""<div class="row">
 <div class="n">{n}</div>
 <div class="th">{img}</div>
 <div class="info">
  <div class="city">{miasto} {dbl}</div>
  <div class="ttl">{html.escape(s['title'])}</div>
  <div class="meta"><span class="src {s['src']}">{ETYKIETY[s['src']]}</span>
   <span>{html.escape(s['license'])}</span>
   {'<span>· ' + html.escape(s['meta']) + '</span>' if s.get('meta') else ''}
   <span>·</span><a href="{html.escape(s['link'], quote=True)}" target="_blank" rel="noopener">otwórz ↗</a></div>
  {ostrz}
 </div></div>""")

    zrod = {}
    for w in fin:
        for s in w["wybor"]:
            zrod[s["src"]] = zrod.get(s["src"], 0) + 1

    atryb = "".join(
        f"<tr><td>{html.escape(m)}</td><td>{html.escape(s['title'][:64])}</td>"
        f"<td>{html.escape(s['meta'].replace('aut. ', '') or '—')}</td>"
        f"<td>{html.escape(s['license'])}</td></tr>" for m, s in cc)

    doc = f"""<!doctype html>
<html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Finalna lista sugestii — zdjęcia polskich miast</title>
<style>{CSS}</style></head><body><div class="wrap">
<h1>Finalna lista sugestii</h1>
<p class="lead">Po jednym ujęciu na miasto, po dwa dla miast powtarzających się na obu listach.
Wybór po odrzuceniu kadrów spoza miasta i licencji zakazujących użytku komercyjnego.</p>

<div class="stats">
 <div class="stat"><b>33</b>miasta</div>
 <div class="stat"><b>{n}</b>ujęcia</div>
 <div class="stat"><b>11</b>powtórek (×2)</div>
 <div class="stat"><b>{zrod.get('adobe',0)}</b>Adobe Stock</div>
 <div class="stat"><b>{zrod.get('freepik',0)}</b>Freepik</div>
 <div class="stat"><b>{zrod.get('openverse',0)}</b>darmowe CC</div>
</div>

<div class="box">
<b>Jak powstał ten wybór.</b> Priorytet: stocki płatne (czysta licencja) przed CC; ujęcia z nazwą
miasta w tytule przed anonimowymi; kadry miejskie (rynek, ratusz, starówka, panorama) przed
krajobrazem i infrastrukturą.<br><br>
<b>Co odrzuciłem.</b> Kadry opisane jako „near / w okolicy" — pokazują sąsiednią miejscowość, nie
miasto z listy (marina w Siemianach zamiast Iławy, Szymbark zamiast Iławy, most na Dunajcu zamiast
Nowego Sącza, panorama Tatr zamiast Nowego Targu). Zamek w Olsztynie pod Częstochową, który
podszywał się pod stolicę Warmii. Oraz wszystkie zdjęcia CC na licencjach <b>NC</b> (zakaz użytku
komercyjnego) i <b>ND</b> (zakaz przeróbek, czyli też kadrowania) — przez to zmienił się m.in.
Lidzbark Warmiński.<br><br>
<b>Zanim to wykorzystasz.</b> {zrod.get('adobe',0)} ujęć wymaga licencji z planu Adobe Stock,
{zrod.get('freepik',0)} pobrania z Freepika, a {zrod.get('openverse',0)} jest darmowe, ale wymaga
podania autora — pełna lista atrybucji na dole strony.
</div>

{"".join(rows)}

<h2>Atrybucja dla ujęć CC ({len(cc)})</h2>
<p class="lead">Te podpisy muszą znaleźć się przy publikacji. Reszta ujęć pochodzi z płatnych
stocków i nie wymaga atrybucji.</p>
<table><thead><tr><th>Miasto</th><th>Plik</th><th>Autor</th><th>Licencja</th></tr></thead>
<tbody>{atryb}</tbody></table>
</div></body></html>"""

    open(OUT, "w").write(doc)
    print("OK ->", OUT)
    print(f"ujec {n}, w tym CC {len(cc)}; zrodla {zrod}")


if __name__ == "__main__":
    main()
