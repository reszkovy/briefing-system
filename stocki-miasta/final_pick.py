# -*- coding: utf-8 -*-
"""Wybor finalny: 1 ujecie na miasto (2 dla powtorek), z twardymi regulami licencyjnymi."""
import json, os, re, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))


def bez_ogonkow(s):
    return "".join(c for c in unicodedata.normalize("NFD", s or "")
                   if unicodedata.category(c) != "Mn").lower()


def rdzenie(nazwa):
    """Rdzenie nazwy miasta, zeby lapac odmiane: Mragowo -> mragow, Lomza -> lomz."""
    out = set()
    for czlon in re.split(r"[\s-]+", nazwa):
        c = bez_ogonkow(czlon)
        if len(c) < 4:
            continue
        out.add(c)
        out.add(c[:-1])                      # Mragowo -> mragow
        if c[-1] in "aoeiy":
            out.add(c[:-2])                  # Lomza -> lom(z)
    return {r for r in out if len(r) >= 4}


TRESC_DOBRA = ("panoram", "rynek", "ratusz", "stare miasto", "starowka", "old town",
               "market square", "aerial", "z lotu", "drone", "skyline", "cityscape",
               "zamek", "castle", "katedra", "cathedral", "bazylik", "basilica",
               "kosciol", "church", "deptak", "centrum", "city center", "city centre",
               "widok", "view of", "palac", "palace", "most", "bridge", "miasto", "town")
TRESC_SLABA = ("forest", "las ", "pathway", "sciezka", "swamp", "bagno", "stadion",
               "stadium", "dworzec", "station", "perony", "koszary", "muzeum wsi",
               "skansen", "open-air museum", "wiez cisnien", "water tower", "watertower",
               "amphitheater", "amfiteatr", "fence", "concentration", "auschwitz",
               "birkenau", "death camp", "wolfsschanze", "taniere du loup", "airport",
               "lotnisko", "exhibition", "wystaw", "cafe", "workshop", "gallery",
               "vernissage", "piwo", "beer", "porter", "seamless panorama 360",
               "equirectangular", "festival", "piknik", "balloon", "balonow")


def ocena(s, rdz):
    t = bez_ogonkow(s["title"])
    lic = s["license"].upper()
    pkt = 0

    # 0. odpada: agent oznaczyl zla lokalizacje, albo kadr jest "obok" miasta a nie w nim
    if "uwaga:" in t or "[uwaga" in t:
        return None
    if re.search(r"\bnear\b|\bokolice\b|\bk\.\s|\bpobliz", t):
        return None

    # 1. licencja: CC z NC lub ND odpada calkowicie (brak uzytku komercyjnego / przerobek)
    if s["src"] == "openverse" and re.search(r"\bCC\s+BY-[A-Z-]*N[CD]", lic):
        return None

    # 2. zrodlo: platne = czysta licencja, wyzej
    pkt += {"adobe": 0, "freepik": 1, "envato": 3, "openverse": 4}[s["src"]]

    # 3. nazwa miasta w tytule (z odmiana)
    if not any(r in t for r in rdz):
        pkt += 6

    # 4. tresc kadru
    if any(k in t for k in TRESC_SLABA):
        pkt += 5
    if any(k in t for k in TRESC_DOBRA):
        pkt -= 2
    if s.get("ai"):
        pkt += 3
    return pkt


# Reczne nadpisania tam, gdzie automat wybieral kadr "obok miasta" zamiast samego miasta,
# albo gdzie ikona miasta powinna isc pierwsza. Fragment tytulu -> wymuszona kolejnosc.
RECZNE = {
    "ilawa":       ["ilawa kosciol przemienienia"],          # zamiast mariny w Siemianach
    "nowytarg":    ["nowy targ ratusz"],                      # zamiast panoramy Tatr
    "nowysacz":    ["nowy sacz ratusz"],                      # zamiast mostu kolejowego
    "czestochowa": ["jasna góra, częstochowa", "view at the complex of the parish"],
}


def zastosuj_reczne(slug, oceny):
    frag = RECZNE.get(slug)
    if not frag:
        return oceny
    wymuszone = []
    for f in frag:
        for p, s in oceny:
            if f in bez_ogonkow(s["title"]) or f in s["title"].lower():
                if s not in wymuszone:
                    wymuszone.append(s)
                break
    reszta = [(p, s) for p, s in oceny if s not in wymuszone]
    return [(-100 + i, s) for i, s in enumerate(wymuszone)] + reszta


def main():
    dane = json.load(open(os.path.join(HERE, "dane.json")))
    wynik = []
    for c in dane:
        rdz = rdzenie(c["name"]) | rdzenie(c["query"])
        oceny = []
        for s in c["shots"]:
            p = ocena(s, rdz)
            if p is not None:
                oceny.append((p, s))
        oceny.sort(key=lambda x: x[0])
        oceny = zastosuj_reczne(c["slug"], oceny)

        wybrane, uzyte_tytuly = [], set()
        for p, s in oceny:
            klucz = bez_ogonkow(s["title"])[:38]
            if klucz in uzyte_tytuly:        # nie dubluj tego samego kadru
                continue
            uzyte_tytuly.add(klucz)
            wybrane.append(s)
            if len(wybrane) >= c["need"]:
                break

        wynik.append({
            "name": c["name"], "slug": c["slug"], "need": c["need"],
            "listy": c["listy"], "note": c.get("note", ""),
            "wybor": wybrane,
            "rezerwa": [s for _, s in oceny[:6] if s not in wybrane][:3],
        })
    json.dump(wynik, open(os.path.join(HERE, "final.json"), "w"),
              ensure_ascii=False, indent=1)
    for w in wynik:
        print(f"\n{w['name']} ({w['need']}):")
        for s in w["wybor"]:
            print(f"   [{s['src'][:4]}] {s['title'][:70]}")
            print(f"        {s['license'][:46]}")
    return wynik


if __name__ == "__main__":
    main()
