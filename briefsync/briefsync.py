#!/usr/bin/env python3
"""
briefsync — logika synchronizacji Trello -> Figma dla narzędzia do briefowania.

Klasyfikuje karty z wybranych list tablicy Trello na:
  - NOWE      : zadanie bez komentarzy zwrotnych  -> pełny brief + załączniki
  - FEEDBACK  : zadanie z komentarzami            -> najnowszy komentarz + miniatura pliku
  - SKIP      : już przeniesione, brak nowego komentarza (anty-duplikacja)
  - HELPER    : task pomocniczy (pomijany)

Stan trzymany w sync_state.json:  { cardId: {figmaSectionId, lastActionId} }
Sekrety czytane ze środowiska (TRELLO_KEY / TRELLO_TOKEN) — NIE są zapisywane w pliku.

Użycie:
  TRELLO_KEY=.. TRELLO_TOKEN=.. python3 briefsync.py plan
  python3 briefsync.py record <cardId> <figmaSectionId> <lastActionId>
"""
import os, sys, json, urllib.request, urllib.parse

K = os.environ.get("TRELLO_KEY")
T = os.environ.get("TRELLO_TOKEN")
BOARD = os.environ.get("BOARD_ID", "664c4a37c17667a4c9907f7f")  # Przemek NOWY
SOURCE_LISTS = [s.strip() for s in os.environ.get("SOURCE_LISTS", "Feedback,to do,w produkcji").split(",") if s.strip()]
STATE = os.environ.get("STATE_FILE") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "sync_state.json")


def api(path, params=None):
    p = dict(params or {}); p["key"] = K; p["token"] = T
    url = "https://api.trello.com/1/" + path + "?" + urllib.parse.urlencode(p)
    with urllib.request.urlopen(url) as r:
        return json.load(r)


def load_state():
    try:
        with open(STATE) as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_state(s):
    with open(STATE, "w") as f:
        json.dump(s, f, indent=1, ensure_ascii=False)


def is_helper(card):
    n = card["name"].lower()
    if any(k in n for k in ("organizacyjn", "pomocnicz", "porządk", "porzadk")):
        return True
    # bez opisu i bez deadline -> traktujemy jako pomocniczy/śmieciowy
    if not (card.get("desc") or "").strip() and not card.get("due"):
        return True
    return False


def latest_comment(card_id):
    acts = api(f"cards/{card_id}/actions", {"filter": "commentCard", "limit": 1})
    if acts:
        a = acts[0]
        return a["id"], a["date"], a["memberCreator"].get("fullName"), a["data"]["text"]
    return None, None, None, None


def plan():
    if not (K and T):
        sys.exit("Brak TRELLO_KEY / TRELLO_TOKEN w środowisku.")
    state = load_state()
    lists = api(f"boards/{BOARD}/lists", {"fields": "name"})
    lid = {l["name"].strip().lower(): l["id"] for l in lists}
    out = {"create": [], "feedback": [], "skip": [], "helper": [], "remove": [], "touch": []}
    active_ids = set()
    for name in SOURCE_LISTS:
        key = name.strip().lower()
        if key not in lid:
            continue
        cards = api(f"lists/{lid[key]}/cards", {"fields": "name,desc,due,dateLastActivity"})
        for c in cards:
            active_ids.add(c["id"])
            if is_helper(c):
                out["helper"].append(c["name"]); continue
            cid = c["id"]
            act = (c.get("dateLastActivity") or "")[:10]
            aid, adate, who, text = latest_comment(cid)
            kind = "FEEDBACK" if aid else "NOWE"
            st = state.get(cid)
            if not st:
                out["create"].append({"id": cid, "name": c["name"], "kind": kind,
                                       "list": name, "lastActionId": aid,
                                       "desc": c.get("desc", ""), "due": c.get("due"),
                                       "lastActivity": act})
            elif aid and aid != st.get("lastActionId"):
                out["feedback"].append({"id": cid, "name": c["name"],
                                        "figmaSectionId": st.get("figmaSectionId"),
                                        "lastActionId": aid, "who": who,
                                        "text": (text or "")[:160],
                                        "list": name, "lastActivity": act})
            else:
                out["skip"].append(c["name"])
            # odśwież metadane ruchu także dla kart bez zmian (inaczej „bez ruchu" kłamie)
            if st:
                out["touch"].append({"id": cid, "list": name, "lastActivity": act})
    # taski, które zniknęły ze wszystkich aktywnych list = wykonane -> do usunięcia
    # BOARD_TAG: w trybie wielu tablic ograniczamy "remove" do kart z TEJ tablicy
    # (inaczej karty z innej tablicy, których nie ma na tej, fałszywie = wykonane)
    scope = os.environ.get("BOARD_TAG")
    for cid, st in state.items():
        if cid not in active_ids:
            if scope is not None and st.get("board") != scope:
                continue
            out["remove"].append({"id": cid, "figmaSectionId": st.get("figmaSectionId")})
    print(json.dumps(out, indent=1, ensure_ascii=False))


def forget():
    s = load_state()
    for cid in sys.argv[2:]:
        s.pop(cid, None)
    save_state(s)
    print("forgot", sys.argv[2:])


def record():
    cid, fig = sys.argv[2], sys.argv[3]
    aid = sys.argv[4] if len(sys.argv) > 4 else None
    s = load_state()
    s[cid] = {"figmaSectionId": fig, "lastActionId": aid}
    save_state(s)
    print("recorded", cid, "->", fig, "aid", aid)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "plan"
    {"plan": plan, "record": record, "forget": forget}.get(cmd, plan)()
