#!/usr/bin/env python3
"""Generuje mapa-data.js: ścieżki SVG województw + współrzędne miast w px."""
import json, math, os

DIR = os.path.dirname(os.path.abspath(__file__))
W, H, PAD = 1000, 940, 20

with open(os.path.join(DIR, "wojewodztwa.geojson")) as f:
    gj = json.load(f)

# zbierz zakres współrzędnych
lons, lats = [], []
def walk(coords):
    if isinstance(coords[0], (int, float)):
        lons.append(coords[0]); lats.append(coords[1])
    else:
        for c in coords: walk(c)
for feat in gj["features"]:
    walk(feat["geometry"]["coordinates"])

lon0, lon1 = min(lons), max(lons)
lat0, lat1 = min(lats), max(lats)
mid_lat = math.radians((lat0 + lat1) / 2)
kx = math.cos(mid_lat)  # korekcja szerokości geograficznej

span_x = (lon1 - lon0) * kx
span_y = (lat1 - lat0)
scale = min((W - 2*PAD) / span_x, (H - 2*PAD) / span_y)
off_x = (W - span_x * scale) / 2
off_y = (H - span_y * scale) / 2

def proj(lon, lat):
    x = off_x + (lon - lon0) * kx * scale
    y = off_y + (lat1 - lat) * scale
    return round(x, 1), round(y, 1)

def ring_to_path(ring):
    pts = [proj(lon, lat) for lon, lat in ring]
    d = f"M{pts[0][0]} {pts[0][1]}"
    for x, y in pts[1:]:
        d += f"L{x} {y}"
    return d + "Z"

regions = []
for feat in gj["features"]:
    name = feat["properties"].get("nazwa") or feat["properties"].get("name")
    geom = feat["geometry"]
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    d = "".join(ring_to_path(ring) for poly in polys for ring in poly)
    regions.append({"name": name, "d": d})

CITIES = [
    # (nazwa, lat, lon, wojewodztwo)
    ("Biała Podlaska", 52.032, 23.117, "lubelskie"),
    ("Chełm", 51.133, 23.472, "lubelskie"),
    ("Kielce", 50.866, 20.628, "świętokrzyskie"),
    ("Kozienice", 51.585, 21.549, "mazowieckie"),
    ("Lublin", 51.246, 22.568, "lubelskie"),
    ("Ostrowiec Świętokrzyski", 50.929, 21.385, "świętokrzyskie"),
    ("Pionki", 51.476, 21.451, "mazowieckie"),
    ("Puławy", 51.417, 21.969, "lubelskie"),
    ("Radom", 51.403, 21.147, "mazowieckie"),
    ("Siedlce", 52.168, 22.290, "mazowieckie"),
    ("Zamość", 50.723, 23.252, "lubelskie"),
    ("Starachowice", 51.038, 21.070, "świętokrzyskie"),
    ("Świdnik", 51.219, 22.696, "lubelskie"),
    ("Łuków", 51.930, 22.379, "lubelskie"),
    ("Hrubieszów", 50.805, 23.892, "lubelskie"),
    ("Skarżysko-Kamienna", 51.113, 20.870, "świętokrzyskie"),
    ("Kraków", 50.062, 19.937, "małopolskie"),
    ("Wrocław", 51.108, 17.033, "dolnośląskie"),
    ("Łódź", 51.760, 19.457, "łódzkie"),
    ("Bydgoszcz", 53.123, 18.008, "kujawsko-pomorskie"),
    ("Katowice", 50.259, 19.021, "śląskie"),
    ("Gdynia", 54.519, 18.531, "pomorskie"),
    ("Częstochowa", 50.812, 19.120, "śląskie"),
    ("Rzeszów", 50.041, 22.004, "podkarpackie"),
    ("Toruń", 53.014, 18.598, "kujawsko-pomorskie"),
]

cities = []
for name, lat, lon, woj in CITIES:
    x, y = proj(lon, lat)
    cities.append({"name": name, "x": x, "y": y, "woj": woj})

km_per_px = 111.13 / scale  # 1 stopień szer. geogr. ~ 111.13 km
out = "const MAP_W=%d,MAP_H=%d,KM_PER_PX=%.4f;\nconst REGIONS=%s;\nconst CITIES=%s;\n" % (
    W, H, km_per_px,
    json.dumps(regions, ensure_ascii=False),
    json.dumps(cities, ensure_ascii=False),
)
with open(os.path.join(DIR, "mapa-data.js"), "w") as f:
    f.write(out)

print(f"OK: {len(regions)} województw, {len(cities)} miast")
print("Regiony:", ", ".join(r["name"] for r in regions))
