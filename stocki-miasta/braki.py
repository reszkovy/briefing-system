# -*- coding: utf-8 -*-
"""Lista brakow: czego jeszcze nie mamy wobec obu list."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from final_pick_platne import ocena, rdzenie, etykieta, bez_ogonkow, PLATNE

HERE = os.path.dirname(os.path.abspath(__file__))

A = ["bialystok","elk","ketrzyn","lidzbark","lomza","mragowo","olsztyn","suwalki","ostroleka",
     "ciechanow","augustow","ilawa","lublin","radomsko","warszawa","grodzisk","krakow",
     "wroclaw","lodz","bydgoszcz","katowice","gdynia","czestochowa","kielce","rzeszow","torun"]
B = ["bielsko","krakow","nowysacz","nowytarg","oswiecim","zywiec","zakopane","lublin","kielce",
     "katowice","bydgoszcz","gdansk","wroclaw","rzeszow","czestochowa","torun","krakow",
     "wroclaw","lodz","bydgoszcz","katowice","gdynia","czestochowa","kielce","rzeszow","torun"]

ZRODLO = {"adobe": "Adobe Stock", "freepik": "Freepik", "envato": "Envato Elements"}


def main():
    wyst = {}
    for s in A + B:
        wyst[s] = wyst.get(s, 0) + 1
    potrzeba = {s: (2 if n > 1 else 1) for s, n in wyst.items()}

    dane = {c["slug"]: c for c in json.load(open(os.path.join(HERE, "dane.json")))}
    nazwa = {s: dane[s]["name"] for s in potrzeba}

    # co juz wykupione (Lista B) — zapamietujemy tytuly, zeby nie proponowac drugi raz
    mam, wziete = {}, {}
    for w in json.load(open(os.path.join(HERE, "lista_b.json"))):
        for s, n in nazwa.items():
            if n == w["name"]:
                mam[s] = len(w["wybor"])
                wziete[s] = {bez_ogonkow(x["title"])[:38] for x in w["wybor"]}

    do_kupienia, niemozliwe = [], []
    for s in sorted(potrzeba, key=lambda x: nazwa[x]):
        brak = potrzeba[s] - mam.get(s, 0)
        if brak <= 0:
            continue
        c = dane[s]
        rdz = rdzenie(c["name"]) | rdzenie(c["query"])
        platne = [x for x in c["shots"] if x["src"] in PLATNE]

        def zbierz(luzno):
            o = [(p, x) for p, x in ((ocena(x, rdz, luzno), x) for x in platne) if p is not None]
            o.sort(key=lambda t: t[0])
            return o

        oceny = zbierz(False) or zbierz(True)
        juz = set(wziete.get(s, ()))
        nowe = []
        for p, x in oceny:
            k = bez_ogonkow(x["title"])[:38]
            if k in juz:
                continue
            juz.add(k)
            x = dict(x)
            x["ostrzezenie"] = etykieta(x, rdz)
            nowe.append(x)
            if len(nowe) >= brak:
                break

        if nowe:
            do_kupienia.append((nazwa[s], nowe, brak))
        if len(nowe) < brak:
            cc = [x for x in c["shots"] if x["src"] == "openverse"][:2]
            niemozliwe.append((nazwa[s], brak - len(nowe), cc))

    # ---------- raport ----------
    L = ["CZEGO NAM BRAKUJE", "=" * 66, ""]
    L += [f"Cel (obie listy):  {sum(potrzeba.values())} ujec / {len(potrzeba)} miast",
          f"Wykupione:         {sum(mam.values())} ujec / {len(mam)} miast",
          f"Do dokupienia:     {sum(len(n) for _, n, _ in do_kupienia)} ujec",
          f"Nieosiagalne:      {sum(b for _, b, _ in niemozliwe)} ujec", "", ""]

    L += ["CZESC 1 — DO DOKUPIENIA (wybor gotowy, wystarczy licencja)", "-" * 66, ""]
    for n, shots, _ in do_kupienia:
        L.append(n)
        for x in shots:
            L += [f"   {x['title']}",
                  f"   {ZRODLO[x['src']]} · {x['license']}"
                  + (f" · {x['meta']}" if x.get("meta") else ""),
                  f"   {x['link']}"]
            if x["ostrzezenie"]:
                L.append(f"   ! {x['ostrzezenie']}")
            L.append("")
    L.append("")

    L += ["CZESC 2 — NIE DA SIE KUPIC (brak w katalogach platnych)", "-" * 66, ""]
    for n, b, cc in niemozliwe:
        L.append(f"{n} — brakuje {b}")
        L.append("   Adobe / Freepik / Envato: zero trafien.")
        if cc:
            L.append("   Dostepne na CC (wymaga podania autora):")
            for x in cc:
                L.append(f"      {x['title']}  ·  {x['license']}")
                L.append(f"      {x['link']}")
        L.append("")
    L += ["", "Opcje dla Czesci 2: fotograf lokalny, polskie agencje (East News, Forum),",
          "albo powrot do licencji CC z atrybucja."]

    open(os.path.join(HERE, "braki.txt"), "w").write("\n".join(L))
    print("\n".join(L[:8]))
    print(f"...\nzapisano braki.txt ({sum(len(n) for _, n, _ in do_kupienia)} do kupienia, "
          f"{sum(b for _, b, _ in niemozliwe)} nieosiagalnych)")


if __name__ == "__main__":
    main()
