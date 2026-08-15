# -*- coding: utf-8 -*-
"""Zbiera wyniki z Envato Elements (HTML) i Openverse (CC / Wikimedia / Flickr)."""
import json, re, sys, time, html, urllib.parse, subprocess, os
from cities import CITIES

HERE = os.path.dirname(os.path.abspath(__file__))
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")


def fetch(url, tries=3, minlen=400):
    for i in range(tries):
        p = subprocess.run(["curl", "-s", "-m", "45", "-A", UA,
                            "-H", "Accept-Language: en-US,en;q=0.9", url],
                           capture_output=True)
        if p.returncode == 0 and len(p.stdout) > minlen:
            return p.stdout.decode("utf-8", "ignore")
        time.sleep(2 + i * 3)
    return ""


def matches(text, keys):
    t = (text or "").lower()
    return any(k in t for k in keys)


# ---------------- Envato Elements ----------------
CARD_RE = re.compile(
    r'<a title="([^"]{2,160})"[^>]*data-testid="item-link"[^>]*href="/([^"]+)"', re.S)
SRCSET_RE = re.compile(r'srcSet="(https://elements-resized\.envatousercontent\.com/[^"]+)"')


def envato(query, keys, want=10):
    term = urllib.parse.quote_plus(query.lower())
    doc = fetch("https://elements.envato.com/photos/" + term, minlen=5000)
    if not doc:
        return []
    out, seen = [], set()
    for m in CARD_RE.finditer(doc):
        title = html.unescape(m.group(1))
        slug = m.group(2)
        if slug in seen or "/" in slug:
            continue
        seen.add(slug)
        ss = SRCSET_RE.search(doc, m.end(), m.end() + 3000)
        if not ss:
            continue
        first = html.unescape(ss.group(1).split(" ")[0])
        out.append({
            "source": "envato",
            "title": title,
            "thumb": re.sub(r"w=\d+", "w=400", first),
            "big": re.sub(r"w=\d+", "w=900", first),
            "link": "https://elements.envato.com/" + slug,
            "author": "",
            "license": "Envato Elements — subskrypcja",
            "strict": bool(matches(title + " " + slug.replace("-", " "), keys)),
        })
    out.sort(key=lambda x: not x["strict"])
    return out[:want]


# ---------------- Openverse (CC: Wikimedia Commons, Flickr...) ----------------
def openverse(query, keys, want=10):
    url = ("https://api.openverse.org/v1/images/?q=" + urllib.parse.quote(query)
           + "&page_size=12&mature=false")
    raw = fetch(url, minlen=100)
    out = []
    try:
        data = json.loads(raw)
    except Exception:
        return out
    for r in data.get("results", []):
        title = (r.get("title") or "").strip()
        src = r.get("source") or ""
        thumb = r.get("thumbnail") or r.get("url")
        if not thumb:
            continue
        lic = (r.get("license") or "").upper()
        lv = r.get("license_version") or ""
        out.append({
            "source": "openverse",
            "title": title or "(bez tytulu)",
            "thumb": thumb,
            "big": r.get("url") or thumb,
            "link": r.get("foreign_landing_url") or r.get("url"),
            "author": r.get("creator") or "",
            "license": f"CC {lic} {lv} — {src}".strip(),
            "strict": bool(matches(title + " " + (r.get("creator") or ""), keys)),
        })
    out.sort(key=lambda x: not x["strict"])
    return out[:want]


def main():
    res = {}
    for name, slug, query, need, keys in CITIES:
        entry = {"name": name, "slug": slug, "query": query, "need": need,
                 "envato": [], "openverse": []}
        for fn, key in ((envato, "envato"), (openverse, "openverse")):
            try:
                entry[key] = fn(query, keys)
            except Exception as e:
                print(f"{key} FAIL {name}: {e}", file=sys.stderr)
        res[slug] = entry
        e = sum(1 for x in entry["envato"] if x["strict"])
        o = sum(1 for x in entry["openverse"] if x["strict"])
        print(f"{name:22s} envato {e}/{len(entry['envato'])}  openverse {o}/{len(entry['openverse'])}",
              flush=True)
        time.sleep(1.2)
    with open(os.path.join(HERE, "free_stocks.json"), "w") as f:
        json.dump(res, f, ensure_ascii=False, indent=1)
    print("OK -> free_stocks.json")


if __name__ == "__main__":
    main()
