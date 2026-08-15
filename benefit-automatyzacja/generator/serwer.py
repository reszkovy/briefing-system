#!/usr/bin/env python3
"""
Most między FOTRA a generatorem.

FOTRA jest statyczna, więc przycisk „Wygeneruj” nie odpali Pythona sam z siebie.
Ten serwer nadstawia trzy rzeczy pod localhost:

    GET  /api/listy                      spis list na obu tablicach
    GET  /api/karty?lista=<id>           karty z listy + rozpoznanie
    GET  /api/karta?id=<cardId>          jedna karta: rozpoznanie + zdjęcia do wyboru
    POST /api/generuj                    {karta, zdjecie?, naglowek?, payoff?} -> szkice
    GET  /szkice/<...>                   podgląd wygenerowanych plików

Uruchomienie:
    python3 serwer.py            # http://127.0.0.1:8899

Do Trello WYŁĄCZNIE odczyt. Nic nie komentuje, nic nie przenosi, nic nie zmienia.
"""
import json, os, re, subprocess, sys, threading, urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "8899"))
sys.path.insert(0, ROOT)
import z_trello as zt  # noqa: E402

_lock = threading.Lock()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        print(f"  {self.command} {self.path.split('?')[0]}")

    # FOTRA bywa otwierana z file:// albo innego portu
    def _naglowki(self, status=200, typ="application/json; charset=utf-8"):
        self.send_response(status)
        self.send_header("Content-Type", typ)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def _json(self, data, status=200):
        self._naglowki(status)
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def do_OPTIONS(self):
        self._naglowki(204, "text/plain")

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        q = urllib.parse.parse_qs(u.query)
        try:
            if u.path == "/api/listy":
                return self._json(self._listy())
            if u.path == "/api/karty":
                lista = q.get("lista", [""])[0]
                if not lista:
                    return self._json({"blad": "brak parametru lista"}, 400)
                return self._json(zt.karty_z_listy(lista))
            if u.path == "/api/karta":
                cid = q.get("id", [""])[0]
                z = zt.zlecenie_z_karty(cid, pobieraj_zdjecie=False)
                z["_rozpoznanie"]["do_wyboru"] = zt.zalaczniki_obrazkowe(cid)
                return self._json(z)
            if u.path == "/api/zdrowie":
                return self._json({"ok": True, "katalog": ROOT})
        except Exception as e:
            return self._json({"blad": str(e)[:200]}, 500)
        return super().do_GET()   # /szkice/... i pliki statyczne

    def do_POST(self):
        if urllib.parse.urlparse(self.path).path != "/api/generuj":
            return self._json({"blad": "nieznana ścieżka"}, 404)
        n = int(self.headers.get("Content-Length") or 0)
        try:
            body = json.loads(self.rfile.read(n) or b"{}")
        except Exception:
            return self._json({"blad": "zły JSON"}, 400)
        cid = body.get("karta")
        if not cid:
            return self._json({"blad": "brak pola 'karta'"}, 400)
        try:
            with _lock:                      # Chrome headless — jeden render naraz
                wynik = self._generuj(body, cid)
            return self._json(wynik)
        except Exception as e:
            return self._json({"blad": str(e)[:300]}, 500)

    # ── logika ──

    def _listy(self):
        out = []
        for etykieta, board in zt.TABLICE.items():
            for l in zt.api(f"boards/{board}/lists", fields="name"):
                out.append({"id": l["id"], "nazwa": l["name"], "tablica": etykieta})
        return out

    def _generuj(self, body, cid):
        z = zt.zlecenie_z_karty(cid, pobieraj_zdjecie=True,
                                zdjecie_id=body.get("zdjecie"))
        # ręczne poprawki z FOTRA mają pierwszeństwo nad rozpoznaniem
        for pole in ("naglowek", "payoff", "zestaw"):
            if body.get(pole):
                z[pole] = body[pole]
        if not z.get("zdjecie"):
            return {"ok": False, "powod": z["_rozpoznanie"]["zdjecie"],
                    "rozpoznanie": z["_rozpoznanie"]}

        os.makedirs(os.path.join(ROOT, "jobs"), exist_ok=True)
        jp = os.path.join(ROOT, "jobs", z["nazwa"] + ".json")
        json.dump(z, open(jp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

        r = subprocess.run([sys.executable, os.path.join(ROOT, "render.py"), jp],
                           capture_output=True, text=True, timeout=240)
        if r.returncode != 0:
            return {"ok": False, "powod": (r.stderr or r.stdout)[-400:]}

        katalog = os.path.join(ROOT, "out", z["nazwa"])
        pliki = sorted(f for f in os.listdir(katalog) if f.endswith(".png"))
        base = f"http://127.0.0.1:{PORT}/out/{urllib.parse.quote(z['nazwa'])}"
        return {
            "ok": True,
            "nazwa": z["nazwa"],
            "naglowek": z["naglowek"], "payoff": z["payoff"],
            "rozpoznanie": z["_rozpoznanie"],
            "podglad": f"{base}/podglad.html",
            "szkice": [{"plik": p, "url": f"{base}/{urllib.parse.quote(p)}"} for p in pliki],
            "katalog": katalog,
        }


if __name__ == "__main__":
    print(f"Generator szkiców — http://127.0.0.1:{PORT}")
    print("Trello: tylko odczyt.  Ctrl+C kończy.\n")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
