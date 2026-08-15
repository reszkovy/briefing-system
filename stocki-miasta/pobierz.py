# -*- coding: utf-8 -*-
"""Pobiera kompy (podglady) dla Listy B i nazywa pliki wg miasta.

Kompy = wersje ze znakiem wodnym, dostepne bez licencji. Nie zuzywaja
ani licencji Adobe Stock, ani kredytow Freepika.
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DOCEL = os.path.join(HERE, "pobrane")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")


def komp_url(s):
    """Najwiekszy dostepny podglad bez licencji."""
    u = s["thumb"]
    if s["src"] == "adobe":
        return [u.replace("/240_F_", "/1000_F_"),
                u.replace("/240_F_", "/500_F_"), u]
    if s["src"] == "freepik":
        # domyslny podglad to tylko 626 px; parametr w= daje wieksza wersje
        return [u + "?w=1380", u + "?w=996", u]
    return [u]


def pobierz(urls, cel):
    for u in urls:
        p = subprocess.run(["curl", "-sL", "-m", "60", "-A", UA, "-o", cel, u],
                           capture_output=True)
        if p.returncode == 0 and os.path.exists(cel) and os.path.getsize(cel) > 8000:
            return os.path.getsize(cel)
        if os.path.exists(cel):
            os.remove(cel)
    return 0


def main():
    lista = json.load(open(os.path.join(HERE, "lista_b.json")))
    os.makedirs(DOCEL, exist_ok=True)

    manifest, ok, blad = [], 0, []
    for w in lista:
        wiele = len(w["wybor"]) > 1
        for i, s in enumerate(w["wybor"], 1):
            baza = w["name"].replace(" ", "-")
            nazwa = f"{baza}-{i}.jpg" if wiele else f"{baza}.jpg"
            cel = os.path.join(DOCEL, nazwa)
            rozm = pobierz(komp_url(s), cel)
            if not rozm:
                blad.append(nazwa)
                continue
            ok += 1
            print(f"  {nazwa:24s} {rozm//1024:5d} kB   {s['src']}", flush=True)
            manifest.append({
                "plik": nazwa, "miasto": w["name"], "pozycje": w["pozycje"],
                "zrodlo": s["src"], "tytul": s["title"], "licencja": s["license"],
                "link": s["link"], "id": (s.get("meta") or "").replace("ID ", ""),
                "uwaga": s.get("ostrzezenie", ""),
            })

    json.dump(manifest, open(os.path.join(DOCEL, "_spis.json"), "w"),
              ensure_ascii=False, indent=1)

    # czytelny spis obok plikow
    txt = ["SPIS POBRANYCH PLIKOW — kompy ze znakiem wodnym (bez licencji)", "=" * 62, ""]
    for m in manifest:
        txt += [f"{m['plik']}",
                f"   {m['miasto']}  [poz. {m['pozycje']}]",
                f"   {m['tytul']}",
                f"   {m['licencja']}",
                f"   {m['link']}"]
        if m["uwaga"]:
            txt.append(f"   ! {m['uwaga']}")
        txt.append("")
    open(os.path.join(DOCEL, "_spis.txt"), "w").write("\n".join(txt))

    print(f"\npobrano {ok}/{sum(len(w['wybor']) for w in lista)}")
    if blad:
        print("NIEUDANE:", blad)


if __name__ == "__main__":
    main()
