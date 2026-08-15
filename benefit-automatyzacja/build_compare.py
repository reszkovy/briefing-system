import base64, io, json, os
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
GEN  = f"{ROOT}/generator/out/trening-silowy-dla-mezczyzn"
ORIG = "/private/tmp/claude-501/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania/4d360621-fa51-404f-8ecc-79940c39d317/scratchpad/benefit/preview"
spec = json.load(open(f"{ROOT}/generator/formats.json", encoding="utf-8"))

ORIG_NAME = {
 "master":"ZDROFIT_nowe_zajecia_KV1_master.png",
 "some_1080x1440_IG":"ZDROFIT_nowe_zajecia_KV1_some_1080x1440_IG.png",
 "some_1080x1440_IG_2":"ZDROFIT_nowe_zajecia_KV1_some_1080x1440_IG_2.png",
 "some_1080x1350_FB":"ZDROFIT_nowe_zajecia_KV1_some_1080x1350_FB.png",
 "some_1080x1920_IG_Stories":"ZDROFIT_nowe_zajecia_KV1_some_1080x1920_IG_Stories.png",
 "some_1080x1920_IG_Stories_2":"ZDROFIT_nowe_zajecia_KV1_some_1080x1920_IG_Stories_2.png",
 "www_360x360":"ZDROFIT_nowe_zajecia_KV1_www_360x360.png",
 "wizytowka_google_400x300":"ZDROFIT_nowe_zajecia_KV1_wizytowka_google_400x300.png",
 "mailing_650x350":"ZDROFIT_nowe_zajecia_KV1_mailing350x650.png",
 "www_823x416":"ZDROFIT_nowe_zajecia_KV1_www_823x416.png",
}

def duri(path, long_side=560):
    im = Image.open(path).convert("RGB")
    r = long_side / max(im.size)
    if r < 1:
        im = im.resize((max(1,round(im.width*r)), max(1,round(im.height*r))), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "JPEG", quality=78, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()

cards, total = [], 0
for f in spec["formats"]:
    o = f"{ORIG}/{ORIG_NAME[f['id']]}"
    g = f"{GEN}/ZDROFIT_trening-silowy-dla-mezczyzn_{f['id']}.png"
    if not (os.path.exists(o) and os.path.exists(g)):
        print("BRAK:", f["id"]); continue
    do, dg = duri(o), duri(g)
    total += len(do) + len(dg)
    wide = f["w"] / f["h"] > 1.2
    cards.append(f"""<article class="fmt{' wide' if wide else ''}">
<header class="fmt-head">
<h2>{f['label']}</h2>
<span class="dim">{f['w']} × {f['h']}</span>
</header>
<div class="pair">
<figure><div class="tag t-orig">Oryginał · PSD</div><img src="{do}" alt="{f['label']} — oryginał"></figure>
<figure><div class="tag t-gen">Generator</div><img src="{dg}" alt="{f['label']} — generator"></figure>
</div>
<p class="fid">{f['id']}</p>
</article>""")

print(f"kart: {len(cards)}, obrazy ~{total/1024/1024:.1f} MB (base64)")
open(f"{ROOT}/_cards.html","w",encoding="utf-8").write("\n".join(cards))
