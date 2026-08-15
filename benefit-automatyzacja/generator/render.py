#!/usr/bin/env python3
"""
Generator formatów Zdrofit — rodzina "nowe zajęcia".

Wejście:  jobs/<nazwa>.json  (zdjęcie, artwork KV, podpis)
Wyjście:  out/<nazwa>/*.png  — wszystkie formaty + podglad.html

Użycie:
    python3 render.py jobs/przyklad.json
    python3 render.py jobs/przyklad.json --formaty some_1080x1350_FB,www_360x360

Zależności: tylko Chrome (headless). Zero bibliotek Pythona.
"""
import json, os, subprocess, sys, shutil, html

ROOT = os.path.dirname(os.path.abspath(__file__))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

FONT_DISPLAY = os.path.join(ROOT, "assets/fonts/Aptly-BoldItalic.otf")


def uri(path):
    """Ścieżka lokalna -> file:// URI (spacje i diakrytyki bezpiecznie)."""
    from urllib.request import pathname2url
    return "file://" + pathname2url(os.path.abspath(path))


def build_html(fmt, job, brand):
    W, H = fmt["w"], fmt["h"]
    photo = job["zdjecie"]
    # kadr: domyślny z formatu, nadpisywalny per zlecenie
    p = {"focusX": 50, "focusY": 50, "zoom": 1.0}
    p.update(fmt.get("photo", {}))
    p.update(job.get("kadr", {}).get(fmt["id"], {}))
    fx, fy, zoom = p["focusX"], p["focusY"], p["zoom"]

    parts = []

    # --- zdjęcie: cover + punkt ostrości + przybliżenie ponad cover ---
    parts.append(
        f'<img class="photo" src="{uri(photo)}" style="'
        f'object-position:{fx}% {fy}%;'
        f'transform:scale({zoom});transform-origin:{fx}% {fy}%">'
    )

    # --- cieniowanie od dołu (scrim) — poprawia czytelność jasnego tekstu na jasnym tle ---
    sc = dict(brand.get("scrim_default", {}))
    sc.update(fmt.get("scrim") or {})
    sc.update(job.get("cieniowanie", {}).get(fmt["id"], {}))
    if sc.get("h") and sc.get("alpha"):
        a, rgb = sc["alpha"], sc.get("rgb", "10,22,32")
        # wielostopniowy spadek — pojedynczy gradient liniowy daje widoczne pasmowanie
        stops = [(0, 1.00), (12, 0.86), (28, 0.62), (48, 0.36), (70, 0.16), (100, 0.0)]
        grad = ",".join(f"rgba({rgb},{round(a*m, 3)}) {p}%" for p, m in stops)
        parts.append(
            f'<div style="position:absolute;left:0;right:0;bottom:0;height:{sc["h"]}%;'
            f'background:linear-gradient(to top,{grad});pointer-events:none"></div>'
        )

    # --- pasek marki ---
    if fmt.get("bar"):
        b = fmt["bar"]
        parts.append(
            f'<div style="position:absolute;left:0;right:0;top:{b["y"]}px;'
            f'height:{b["h"]}px;background:{brand["blue"]}"></div>'
        )

    # --- artwork KV (nagłówek kampanii) ---
    if fmt.get("kv"):
        k = fmt["kv"]
        src = job.get("kv_artwork") or os.path.join(ROOT, "assets", k["asset"])
        parts.append(
            f'<img src="{uri(src)}" style="position:absolute;'
            f'left:{k["x"]}px;top:{k["y"]}px;width:{k["w"]}px;height:auto">'
        )

    # --- lockup RUCH TO Z KIM LUBISZ ---
    if fmt.get("rtzkl"):
        r = fmt["rtzkl"]
        parts.append(
            f'<img src="{uri(os.path.join(ROOT, "assets/rtzkl.png"))}" style="position:absolute;'
            f'left:{r["x"]}px;top:{r["y"]}px;width:{r["w"]}px;height:auto">'
        )

    # --- logo ---
    if fmt.get("logo"):
        g = fmt["logo"]
        parts.append(
            f'<img src="{uri(os.path.join(ROOT, "assets", g["asset"]))}" style="position:absolute;'
            f'left:{g["x"]}px;top:{g["y"]}px;width:{g["w"]}px;height:auto">'
        )

    # --- nagłówek składany na żywo (tryb szkicu, gdy nie ma artworku kampanii) ---
    if fmt.get("headline") and (job.get("naglowek") or job.get("payoff")):
        hl = fmt["headline"]
        lead = html.escape(job.get("naglowek", "")).replace("\n", "<br>")
        payoff = html.escape(job.get("payoff", ""))
        blocks = ""
        if lead:
            blocks += (f'<div class="hl-lead" style="font-size:{hl["lead"]}px">{lead}</div>')
        if payoff:
            blocks += (f'<div class="hl-pill" style="font-size:{hl["payoff"]}px;'
                       f'background:{brand["orange"]}">{payoff}</div>')
        parts.append(
            f'<div class="hl" style="left:{hl["x"]}px;top:{hl["y"]}px;'
            f'width:{hl["w"]}px">{blocks}</div>'
        )

    # --- podpis (żywy tekst) ---
    if fmt.get("subline") and job.get("podpis"):
        s = fmt["subline"]
        txt = html.escape(job["podpis"]).replace("\n", "<br>")
        parts.append(
            f'<div class="subline" style="right:{s["right"]}px;bottom:{s["bottom"]}px;'
            f'font-size:{s["size"]}px">{txt}</div>'
        )

    body = "\n".join(parts)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family:"AptlyBI"; src:url("{uri(FONT_DISPLAY)}"); }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ width:{W}px; height:{H}px; overflow:hidden; background:#fff; }}
.stage {{ position:relative; width:{W}px; height:{H}px; overflow:hidden; }}
.photo {{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }}
.subline {{ position:absolute; font-family:"AptlyBI"; color:#fff;
           text-transform:uppercase; text-align:right; line-height:0.98;
           letter-spacing:0.01em; white-space:nowrap; }}
/* nagłówek szkicu — przybliżenie łuku obrotem; w finale wchodzi artwork kampanii */
.hl {{ position:absolute; font-family:"AptlyBI"; text-transform:uppercase; color:#fff; }}
.hl-lead {{ line-height:0.9; transform:rotate(-4deg); transform-origin:0 100%;
            text-shadow:0 2px 18px rgba(10,22,32,.28); }}
.hl-pill {{ display:inline-block; margin-top:0.34em; padding:0.1em 0.42em 0.16em;
            border-radius:999px; line-height:1.0; transform:rotate(-2.5deg);
            transform-origin:0 50%; box-shadow:0 6px 26px rgba(10,22,32,.22); }}
</style></head><body><div class="stage">{body}</div></body></html>"""


def shoot(html_path, out_png, w, h):
    subprocess.run([
        CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
        "--force-device-scale-factor=1", "--default-background-color=00000000",
        "--virtual-time-budget=4000",
        f"--screenshot={out_png}", f"--window-size={w},{h}", uri(html_path),
    ], check=True, capture_output=True)


def main():
    job_path = sys.argv[1]
    only = None
    if "--formaty" in sys.argv:
        only = set(sys.argv[sys.argv.index("--formaty") + 1].split(","))
    spec_name = "formats.json"
    if "--spec" in sys.argv:
        spec_name = sys.argv[sys.argv.index("--spec") + 1]

    job = json.load(open(job_path, encoding="utf-8"))
    if job.get("zestaw") and "--spec" not in sys.argv:
        spec_name = job["zestaw"]
    spec = json.load(open(os.path.join(ROOT, spec_name), encoding="utf-8"))
    brand = spec["brand"]

    # ścieżki w zleceniu liczone względem katalogu generatora
    for key in ("zdjecie", "kv_artwork"):
        if job.get(key) and not os.path.isabs(job[key]):
            job[key] = os.path.join(ROOT, job[key])

    name = job.get("nazwa") or os.path.splitext(os.path.basename(job_path))[0]
    outdir = os.path.join(ROOT, "out", name)
    tmpdir = os.path.join(outdir, "_html")
    shutil.rmtree(outdir, ignore_errors=True)
    os.makedirs(tmpdir, exist_ok=True)

    made = []
    for fmt in spec["formats"]:
        if only and fmt["id"] not in only:
            continue
        hp = os.path.join(tmpdir, fmt["id"] + ".html")
        open(hp, "w", encoding="utf-8").write(build_html(fmt, job, brand))
        png = os.path.join(outdir, f"ZDROFIT_{name}_{fmt['id']}.png")
        shoot(hp, png, fmt["w"], fmt["h"])
        made.append((fmt, os.path.basename(png)))
        print(f"  ✓ {fmt['id']:32s} {fmt['w']}x{fmt['h']}")

    # arkusz podglądowy — wszystkie formaty na jednej stronie
    cards = "\n".join(
        f'<figure><img src="{f}"><figcaption>{x["label"]}<br>'
        f'<code>{x["w"]}×{x["h"]}</code></figcaption></figure>'
        for x, f in made
    )
    open(os.path.join(outdir, "podglad.html"), "w", encoding="utf-8").write(
        f"""<!doctype html><meta charset="utf-8"><title>{name}</title><style>
body{{font:14px -apple-system,sans-serif;background:#1a1a1a;color:#eee;padding:32px}}
h1{{font-size:18px;margin-bottom:24px;font-weight:600}}
.grid{{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start}}
figure{{background:#262626;padding:12px;border-radius:8px}}
img{{max-width:260px;max-height:340px;display:block;background:#333}}
figcaption{{margin-top:8px;font-size:12px;color:#aaa;line-height:1.5}}
code{{color:#777}}
</style><h1>{name} — {len(made)} formatów</h1><div class="grid">{cards}</div>"""
    )
    print(f"\n{len(made)} formatów -> {outdir}")
    print(f"podgląd: {os.path.join(outdir, 'podglad.html')}")


if __name__ == "__main__":
    main()
