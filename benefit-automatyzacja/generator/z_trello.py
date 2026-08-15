#!/usr/bin/env python3
"""
Karta Trello -> zlecenie dla generatora.

Czyta kartę (nazwa, opis, etykiety, załączniki), rozpoznaje typ, markę, klub i datę,
proponuje nagłówek i payoff, pobiera pierwsze zdjęcie z załączników.

    python3 z_trello.py --lista <listId>            # co jest do wzięcia
    python3 z_trello.py --karta <cardId>            # jedno zlecenie -> jobs/
    python3 z_trello.py --karta <cardId> --generuj  # zlecenie + od razu szkice

NIC nie zapisuje do Trello. Wyłącznie odczyt.
"""
import json, os, re, sys, unicodedata, urllib.parse, urllib.request
from datetime import datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
SLOWNIK = json.load(open(os.path.join(ROOT, "slownik.json"), encoding="utf-8"))

TABLICE = {
    "obsluga": "664c4a37c17667a4c9907f7f",
    "otwarcia": "YddwrLqb",
}


def creds():
    for p in (os.path.join(ROOT, ".env"),
              os.path.expanduser("~/Desktop/Claude_zadania/Narzedzie do briefowania/briefsync/.env")):
        if os.path.exists(p):
            d = {}
            for line in open(p, encoding="utf-8"):
                if "=" in line:
                    k, v = line.strip().split("=", 1)
                    d[k] = v
            if "TRELLO_KEY" in d and "TRELLO_TOKEN" in d:
                return d["TRELLO_KEY"], d["TRELLO_TOKEN"]
    raise SystemExit("Brak TRELLO_KEY / TRELLO_TOKEN (szukam w generator/.env i briefsync/.env)")


KEY, TOKEN = creds()


def api(path, **params):
    params.update(key=KEY, token=TOKEN)
    url = f"https://api.trello.com/1/{path}?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)


def bez_ogonkow(s):
    s = unicodedata.normalize("NFKD", s.lower())
    return "".join(c for c in s if not unicodedata.combining(c))


# ─────────────────────────── rozpoznawanie ───────────────────────────

def marka(tekst):
    t = bez_ogonkow(tekst)
    for nazwa, cfg in SLOWNIK["marki"].items():
        for wz in cfg["wzorce"]:
            if re.search(wz, t):
                return nazwa, cfg
    return "zdrofit", SLOWNIK["marki"]["zdrofit"]


def typ_wydarzenia(tekst):
    t = bez_ogonkow(tekst)
    trafienia = []
    for typ, wzorce in SLOWNIK["typy_wydarzen"].items():
        for wz in wzorce:
            if re.search(wz, t):
                trafienia.append(typ)
                break
    return trafienia[0] if trafienia else "inne", trafienia


def miejsce(tekst):
    t = bez_ogonkow(tekst)
    lok = [x for x in SLOWNIK["lokalizacje"] if x in t]
    mia = [x for x in SLOWNIK["miasta"] if re.search(r"\b" + re.escape(x), t)]
    return (mia[0] if mia else None), (lok[0] if lok else None)


def aktywnosc(tekst):
    t = bez_ogonkow(tekst)
    return [a for a in SLOWNIK["aktywnosci"] if a in t]


def data_wydarzenia(tekst):
    MIES = {"stycznia":1,"lutego":2,"marca":3,"kwietnia":4,"maja":5,"czerwca":6,"lipca":7,
            "sierpnia":8,"wrzesnia":9,"pazdziernika":10,"listopada":11,"grudnia":12}
    t = bez_ogonkow(tekst)
    m = re.search(r"(\d{1,2})[\.\-/](\d{1,2})(?:[\.\-/](\d{2,4}))?", t)
    if m:
        return f"{int(m.group(1))}.{int(m.group(2))}"
    m = re.search(r"(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s+(" + "|".join(MIES) + ")", t)
    if m:
        zakres = f"{m.group(1)}-{m.group(2)}" if m.group(2) else m.group(1)
        return f"{zakres} {m.group(3)}"
    return None


def naglowek_i_payoff(nazwa, mia, lok, akt, data):
    """Rozbija nazwę karty na dwie linie: co się dzieje + gdzie/kiedy."""
    czysta = nazwa
    for wz in (r"\(.*?\)", r"^\s*(ASAP|PILNE|Pilna prośba)\s*[-–:]?\s*", r"\bLP\b"):
        czysta = re.sub(wz, " ", czysta, flags=re.I)
    for cfg in SLOWNIK["marki"].values():
        for wz in cfg["wzorce"]:
            czysta = re.sub(wz, " ", czysta, flags=re.I)
    # słowa pomijane trzymamy bez ogonków — więc porównujemy znormalizowane tokeny
    pomijane = set(SLOWNIK["slowa_pomijane"])
    czysta = " ".join(t for t in czysta.split()
                      if bez_ogonkow(t.strip(".,:;!?")) not in pomijane)
    czysta = re.sub(r"\s{2,}", " ", czysta).strip(" -–—|,:")

    # jawny separator w nazwie zwykle dzieli temat od miejsca
    czesci = [c.strip() for c in re.split(r"\s+[-–—|]{1,2}\s+|\s*\|\|\s*", czysta) if c.strip()]
    if len(czesci) >= 2:
        lead, pay = czesci[0], " ".join(czesci[1:])
    else:
        lead, pay = czysta, ""

    obetnij = lambda s: s.strip(" -–—|,:;.")
    # po wycięciu nośników zostają czasem same przyimki — to nie jest payoff
    SPOJNIKI = {"na", "w", "we", "z", "ze", "do", "od", "po", "dla", "i", "o", "u", "pod", "przy"}
    def sensowne(s):
        s = obetnij(s)
        tokeny = [t for t in s.split() if bez_ogonkow(t) not in SPOJNIKI]
        return obetnij(" ".join(tokeny)) if tokeny else ""
    lead, pay = sensowne(lead), sensowne(pay)

    # payoff musi być krótki — inaczej plamka zalewa kadr
    limit = SLOWNIK.get("payoff_max_znakow", 20)
    if len(pay) > limit:
        lead = (lead + " " + pay).strip()
        pay = ""
    if not pay:
        pay = (lok or mia or "").title()
    if not pay and data:
        pay = str(data)
    if len(pay) > limit:
        pay = ""
    # to samo miejsce nie może stać w obu liniach — sprawdzamy PO podstawieniach
    if pay and lead:
        npay, nlead = bez_ogonkow(pay), bez_ogonkow(lead)
        if npay in nlead:
            bez = [t for t in lead.split() if bez_ogonkow(t) not in npay.split()]
            lead = sensowne(" ".join(bez))
        elif nlead in npay:
            pay = sensowne(re.sub(re.escape(lead), " ", pay, flags=re.I))

    if not lead:
        lead = (akt[0].title() if akt else "Nowość")

    # lead łamiemy na 2-3 linie po długości, nie po liczbie słów
    slowa, linie, biezaca = lead.split(), [], ""
    szer = max(14, min(22, len(lead) // 2 + 2))
    for w in slowa:
        if biezaca and len(biezaca) + 1 + len(w) > szer:
            linie.append(biezaca)
            biezaca = w
        else:
            biezaca = (biezaca + " " + w).strip()
    if biezaca:
        linie.append(biezaca)
    return "\n".join(linie[:3]).strip(), pay.strip()


# ─────────────────────────── budowa zlecenia ───────────────────────────

# nazwy sugerujące gotową kreację, a nie materiał wyjściowy
ODPADY = re.compile(r"screen|zrzut|export|eksport|gotow|final|podglad|preview|klatka|frame|"
                    r"logo|ikon|thumb|kadr z|render", re.I)


def zalaczniki_obrazkowe(card_id):
    """Wszystkie obrazkowe załączniki karty, posortowane: najpierw najlepszy kandydat."""
    try:
        att = api(f"cards/{card_id}/attachments", fields="name,url,mimeType,previews,bytes")
    except Exception:
        return []
    out = []
    for a in att:
        mt = (a.get("mimeType") or "") + " " + (a.get("url") or "")
        if not re.search(r"image/|\.(jpe?g|png|webp)(\?|$)", mt, re.I):
            continue
        prev = sorted(a.get("previews") or [], key=lambda p: -((p.get("width") or 0) * (p.get("height") or 0)))
        best = prev[0] if prev else {}
        w, h = best.get("width") or 0, best.get("height") or 0
        podejrzany = bool(ODPADY.search(a.get("name") or ""))
        out.append({
            "id": a["id"], "nazwa": a.get("name") or "", "url": best.get("url") or a["url"],
            "miniatura": (prev[-1]["url"] if prev else a["url"]),
            "w": w, "h": h, "podejrzany": podejrzany,
            # fotografia zwykle: duża i nie kwadratowa jak grafika eksportowa
            "ocena": (0 if podejrzany else 2) + (1 if w * h > 700000 else 0),
        })
    out.sort(key=lambda x: (-x["ocena"], -(x["w"] * x["h"])))
    return out


def pobierz_zdjecie(card_id, nazwa_pliku, wybrany_id=None):
    """Pobiera wskazany (lub najlepiej oceniony) załącznik do jobs/zdjecia/."""
    lista = zalaczniki_obrazkowe(card_id)
    if not lista:
        return None, "karta nie ma załączonego zdjęcia", []
    wybrany = next((a for a in lista if a["id"] == wybrany_id), lista[0])
    dst_dir = os.path.join(ROOT, "jobs", "zdjecia")
    os.makedirs(dst_dir, exist_ok=True)
    ext = os.path.splitext(wybrany["url"].split("?")[0])[1][:5] or ".jpg"
    dst = os.path.join(dst_dir, nazwa_pliku + ext)
    try:
        req = urllib.request.Request(wybrany["url"], headers={
            "Authorization": f'OAuth oauth_consumer_key="{KEY}", oauth_token="{TOKEN}"'})
        with urllib.request.urlopen(req, timeout=60) as r, open(dst, "wb") as f:
            f.write(r.read())
        uwaga = None if not wybrany["podejrzany"] else \
            f"uwaga: „{wybrany['nazwa']}" + "” wygląda na gotową kreację, nie materiał"
        return dst, uwaga, lista
    except Exception as e:
        return None, f"nie udało się pobrać: {str(e)[:60]}", lista


def zlecenie_z_karty(card_id, pobieraj_zdjecie=True, zdjecie_id=None):
    c = api(f"cards/{card_id}", fields="name,desc,shortUrl,idList,labels,due")
    tekst = c["name"] + " \n " + (c.get("desc") or "")
    mk, mkcfg = marka(tekst)
    typ, wszystkie = typ_wydarzenia(tekst)
    mia, lok = miejsce(tekst)
    akt = aktywnosc(tekst)
    data = data_wydarzenia(tekst)
    lead, pay = naglowek_i_payoff(c["name"], mia, lok, akt, data)

    slug = re.sub(r"[^a-z0-9]+", "-", bez_ogonkow(c["name"]))[:48].strip("-") or card_id
    zdj, uwaga, zalaczniki = None, "pominięte", []
    if pobieraj_zdjecie:
        zdj, uwaga, zalaczniki = pobierz_zdjecie(card_id, slug, zdjecie_id)

    zestaw = SLOWNIK["rodziny_formatow"].get(typ) or SLOWNIK["rodziny_formatow"]["domyslna"]

    return {
        "nazwa": slug,
        "zestaw": zestaw,
        "zdjecie": zdj,
        "naglowek": lead,
        "payoff": pay,
        "_rozpoznanie": {
            "karta": c["name"],
            "link": c.get("shortUrl"),
            "typ": typ,
            "wszystkie_typy": wszystkie,
            "marka": mk,
            "miasto": mia,
            "lokalizacja": lok,
            "aktywnosci": akt,
            "data": data,
            "zdjecie": uwaga or "z załącznika karty",
            "pewnosc": pewnosc(typ, mia or lok, zdj),
            "do_wyboru": [{k: a[k] for k in ("id", "nazwa", "miniatura", "w", "h", "podejrzany")}
                          for a in zalaczniki],
        },
    }


def pewnosc(typ, miejsce_, zdj):
    """Ile z tego, czego potrzebuje szkic, udało się odczytać (0-3)."""
    return int(typ != "inne") + int(bool(miejsce_)) + int(bool(zdj))


def karty_z_listy(list_id, limit=60):
    cards = api(f"lists/{list_id}/cards", fields="name,shortUrl,dateLastActivity,idAttachmentCover,badges")
    out = []
    for c in cards[:limit]:
        tekst = c["name"]
        typ, _ = typ_wydarzenia(tekst)
        mia, lok = miejsce(tekst)
        mk, _ = marka(tekst)
        out.append({
            "id": c["id"], "nazwa": c["name"], "link": c.get("shortUrl"),
            "typ": typ, "marka": mk, "miejsce": lok or mia,
            "data": data_wydarzenia(tekst),
            "zalaczniki": (c.get("badges") or {}).get("attachments", 0),
            "ostatnia_aktywnosc": c.get("dateLastActivity"),
            "pewnosc": pewnosc(typ, lok or mia, (c.get("badges") or {}).get("attachments", 0)),
        })
    return out


def main():
    a = sys.argv[1:]
    if "--lista" in a:
        print(json.dumps(karty_z_listy(a[a.index("--lista") + 1]), ensure_ascii=False, indent=1))
        return
    if "--karta" in a:
        cid = a[a.index("--karta") + 1]
        z = zlecenie_z_karty(cid)
        os.makedirs(os.path.join(ROOT, "jobs"), exist_ok=True)
        p = os.path.join(ROOT, "jobs", z["nazwa"] + ".json")
        json.dump(z, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(json.dumps(z["_rozpoznanie"], ensure_ascii=False, indent=1))
        print("\nzlecenie ->", p)
        if "--generuj" in a:
            if not z["zdjecie"]:
                print("\nBRAK ZDJĘCIA — szkic nie powstanie. Dorzuć załącznik do karty.")
                return
            import subprocess
            subprocess.run([sys.executable, os.path.join(ROOT, "render.py"), p])
        return
    print(__doc__)


if __name__ == "__main__":
    main()
