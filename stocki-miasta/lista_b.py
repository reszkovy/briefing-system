# -*- coding: utf-8 -*-
"""Lista B — 26 pozycji / 18 miast. Tylko licencje platne (Adobe, Freepik, Envato)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from final_pick_platne import ocena, rdzenie, etykieta, bez_ogonkow, PLATNE

HERE = os.path.dirname(os.path.abspath(__file__))

# (pozycje na liscie uzytkownika, slug) — powtorki dostaja 2 ujecia
LISTA = [
    ("1",      "bielsko"),
    ("2, 17",  "krakow"),
    ("3",      "nowysacz"),
    ("4",      "nowytarg"),
    ("5",      "oswiecim"),
    ("6",      "zywiec"),
    ("7",      "zakopane"),
    ("8",      "lublin"),
    ("9, 24",  "kielce"),
    ("10, 21", "katowice"),
    ("11, 20", "bydgoszcz"),
    ("12",     "gdansk"),
    ("13, 18", "wroclaw"),
    ("14, 25", "rzeszow"),
    ("15, 23", "czestochowa"),
    ("16, 26", "torun"),
    ("19",     "lodz"),
    ("22",     "gdynia"),
]

ZRODLO = {"adobe": "Adobe Stock", "freepik": "Freepik", "envato": "Envato Elements"}


def main():
    dane = {c["slug"]: c for c in json.load(open(os.path.join(HERE, "dane.json")))}
    wynik, braki = [], []

    for pozycje, slug in LISTA:
        c = dane[slug]
        ile = 2 if "," in pozycje else 1
        rdz = rdzenie(c["name"]) | rdzenie(c["query"])
        platne = [s for s in c["shots"] if s["src"] in PLATNE]

        def zbierz(luzno):
            o = [(p, s) for p, s in ((ocena(s, rdz, luzno), s) for s in platne) if p is not None]
            o.sort(key=lambda x: x[0])
            return o

        oceny = zbierz(False) or zbierz(True)

        wybrane, uzyte = [], set()
        for p, s in oceny:
            k = bez_ogonkow(s["title"])[:38]
            if k in uzyte:
                continue
            uzyte.add(k)
            s = dict(s)
            s["ostrzezenie"] = etykieta(s, rdz)
            wybrane.append(s)
            if len(wybrane) >= ile:
                break

        if len(wybrane) < ile:
            braki.append(f"{c['name']} ({len(wybrane)}/{ile})")
        wynik.append({"pozycje": pozycje, "name": c["name"], "ile": ile, "wybor": wybrane})

    # --- plik tekstowy do skopiowania ---
    linie = ["LISTA B — zdjecia miast, wylacznie licencje platne", "=" * 58, ""]
    n = 0
    for w in wynik:
        pow_ = "  (powtorka — 2 ujecia)" if w["ile"] == 2 else ""
        linie.append(f"{w['name']}{pow_}   [poz. {w['pozycje']}]")
        for s in w["wybor"]:
            n += 1
            linie.append(f"   {s['title']}")
            linie.append(f"   {ZRODLO[s['src']]} · {s['license']}"
                         + (f" · {s['meta']}" if s.get("meta") else ""))
            linie.append(f"   {s['link']}")
            if s["ostrzezenie"]:
                linie.append(f"   ! {s['ostrzezenie']}")
            linie.append("")
        if len(w["wybor"]) < w["ile"]:
            linie.append(f"   ! BRAK drugiego ujecia — katalogi platne nie maja wiecej\n")
    linie.append("=" * 58)
    linie.append(f"Razem {n} z 26 pozycji · {len(wynik)} miast")
    if braki:
        linie.append("Niepelne: " + ", ".join(braki))

    open(os.path.join(HERE, "lista-b.txt"), "w").write("\n".join(linie))
    json.dump(wynik, open(os.path.join(HERE, "lista_b.json"), "w"), ensure_ascii=False, indent=1)

    print(f"pozycji {n}/26 · miast {len(wynik)}")
    print("niepelne:", ", ".join(braki) or "—")
    print()
    for w in wynik:
        for s in w["wybor"]:
            flag = "  ! " + s["ostrzezenie"] if s["ostrzezenie"] else ""
            print(f"{w['name']:16s} [{s['src'][:4]}] {s['title'][:44]:46s}{flag}")


if __name__ == "__main__":
    main()
