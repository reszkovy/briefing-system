# -*- coding: utf-8 -*-
"""Wariant TYLKO PLATNE: Adobe / Freepik / Envato. Zero Creative Commons.

Prawa: kazde ujecie pochodzi z licencji wykupionej w ramach planu — bez obowiazku
atrybucji i bez ograniczen NC/ND. Miasta bez pokrycia w platnych katalogach
zostaja jawnie puste, zamiast byc podmieniane na cokolwiek.
"""
import json, os, re, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
PLATNE = ("adobe", "freepik", "envato")


def bez_ogonkow(s):
    return "".join(c for c in unicodedata.normalize("NFD", s or "")
                   if unicodedata.category(c) != "Mn").lower()


def rdzenie(nazwa):
    out = set()
    for czlon in re.split(r"[\s-]+", nazwa):
        c = bez_ogonkow(czlon)
        if len(c) < 4:
            continue
        out.add(c); out.add(c[:-1])
        if c[-1] in "aoeiy":
            out.add(c[:-2])
    return {r for r in out if len(r) >= 4}


TRESC_DOBRA = ("panoram", "rynek", "ratusz", "stare miasto", "starowka", "old town",
               "market square", "aerial", "z lotu", "drone", "skyline", "cityscape",
               "rooftops", "zamek", "castle", "katedra", "cathedral", "bazylik", "basilica",
               "kosciol", "church", "deptak", "centrum", "city center", "city centre",
               "widok", "view of", "palac", "palace", "miasto", "town")
TRESC_SLABA = ("forest", "pathway", "swamp", "stadion", "stadium", "dworzec", "station",
               "skansen", "open-air museum", "amphitheater", "amfiteatr", "fence",
               "concentration", "auschwitz", "birkenau", "death camp", "airport",
               "seamless panorama 360", "equirectangular", "festival", "balloon")

# kadry "obok miasta" — dopuszczalne tylko awaryjnie, zawsze z etykieta
OBOK = re.compile(r"\bnear\b|\bokolice\b|\bk\.\s|\bpobliz")

# "elk" po angielsku to los/wapiti — stocki podstawiaja zwierze pod miasto Elk
ZWIERZE = ("bull elk", "elk in the", "elk stand", "majestic elk", "wapiti", "antler",
           "wildlife", "deer", "moose", "grand teton", "yellowstone", "herd", "bugling",
           "meadow", "rutting", "elk cow", "elk calf", "elk grazing", "national park")


def ocena(s, rdz, luzno=False):
    t = bez_ogonkow(s["title"])
    if "uwaga:" in t or "[uwaga" in t:
        return None
    if any(k in t for k in ZWIERZE):
        return None
    obok = bool(OBOK.search(t))
    if obok and not luzno:
        return None
    pkt = {"adobe": 0, "freepik": 1, "envato": 2}[s["src"]]
    if not any(r in t for r in rdz):
        pkt += 6
    if any(k in t for k in TRESC_SLABA):
        pkt += 5
    if any(k in t for k in TRESC_DOBRA):
        pkt -= 2
    if s.get("ai"):
        pkt += 3
    if obok:
        pkt += 8
    return pkt


def etykieta(s, rdz):
    """Zwraca ostrzezenie, jesli kadr nie przedstawia wprost samego miasta."""
    t = bez_ogonkow(s["title"])
    if OBOK.search(t):
        return "kadr z okolicy miasta, nie z samego centrum"
    if any(k in t for k in ("auschwitz", "birkenau", "concentration", "death camp")):
        return "miejsce pamieci, nie miasto"
    if "wilczy szaniec" in t or "wolfsschanze" in t:
        return "Wilczy Szaniec w Gierlozy, ok. 8 km od miasta"
    if "skansen" in t or "open-air museum" in t:
        return "skansen, nie centrum miasta"
    if not any(r in t for r in rdz):
        return "nazwa miasta nie wystepuje w opisie — do weryfikacji wzrokowej"
    return ""


def main():
    dane = json.load(open(os.path.join(HERE, "dane.json")))
    wynik, braki, niepelne = [], [], []

    for c in dane:
        rdz = rdzenie(c["name"]) | rdzenie(c["query"])
        platne = [s for s in c["shots"] if s["src"] in PLATNE]

        def zbierz(luzno):
            o = [(p, s) for p, s in ((ocena(s, rdz, luzno), s) for s in platne) if p is not None]
            o.sort(key=lambda x: x[0])
            return o

        oceny = zbierz(False) or zbierz(True)      # awaryjnie dopuszczamy kadry z okolicy

        wybrane, uzyte = [], set()
        for p, s in oceny:
            k = bez_ogonkow(s["title"])[:38]
            if k in uzyte:
                continue
            uzyte.add(k)
            s = dict(s)
            s["ostrzezenie"] = etykieta(s, rdz)
            wybrane.append(s)
            if len(wybrane) >= c["need"]:
                break

        if not wybrane:
            braki.append(c["name"])
        elif len(wybrane) < c["need"]:
            niepelne.append(f"{c['name']} ({len(wybrane)}/{c['need']})")

        wynik.append({"name": c["name"], "slug": c["slug"], "need": c["need"],
                      "listy": c["listy"], "wybor": wybrane})

    json.dump(wynik, open(os.path.join(HERE, "final_platne.json"), "w"),
              ensure_ascii=False, indent=1)

    n = sum(len(w["wybor"]) for w in wynik)
    zrod = {}
    for w in wynik:
        for s in w["wybor"]:
            zrod[s["src"]] = zrod.get(s["src"], 0) + 1
    print(f"ujec {n} (bylo 44) · zrodla {zrod}")
    print(f"miast pokrytych {sum(1 for w in wynik if w['wybor'])}/33")
    print("BRAK POKRYCIA:", ", ".join(braki) or "—")
    print("NIEPELNE:", ", ".join(niepelne) or "—")
    print("\nz zastrzezeniem:")
    for w in wynik:
        for s in w["wybor"]:
            if s["ostrzezenie"]:
                print(f"  {w['name']:20s} {s['title'][:46]:48s} -> {s['ostrzezenie']}")


if __name__ == "__main__":
    main()
