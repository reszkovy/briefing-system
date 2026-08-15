#!/usr/bin/env python3
"""
sync_all — backfill/sync briefów z WIELU tablic Trello do Obsidiana.

Czyta listę tablic z boards.json, dla każdej odpala `briefsync.py plan`
(ze stanem Obsidiana = obsidian_index.json) i przepuszcza wynik przez
`obsidian_sync.py`, ustawiając klienta i nazwę tablicy w briefie.

Stan Obsidiana jest WSPÓLNY dla wszystkich tablic (cardId w Trello są globalnie
unikalne), więc anty-duplikacja działa między tablicami.

Użycie:
  TRELLO_KEY=.. TRELLO_TOKEN=.. python3 sync_all.py            # zapis
  TRELLO_KEY=.. TRELLO_TOKEN=.. python3 sync_all.py --dry-run  # podgląd
"""
import os, sys, json, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
DRY = "--dry-run" in sys.argv or "-n" in sys.argv
INDEX = os.path.join(HERE, "obsidian_index.json")


def load_env():
    """Wczytaj briefsync/.env (KEY=VALUE) jeśli istnieje. Nie nadpisuje już ustawionych."""
    p = os.path.join(HERE, ".env")
    if not os.path.exists(p):
        return
    for line in open(p, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def main():
    load_env()
    if not (os.environ.get("TRELLO_KEY") and os.environ.get("TRELLO_TOKEN")):
        sys.exit("Brak TRELLO_KEY / TRELLO_TOKEN (ustaw w briefsync/.env lub w środowisku).")
    boards = json.load(open(os.path.join(HERE, "boards.json"), encoding="utf-8"))
    total = 0
    for b in boards:
        env = os.environ.copy()
        env["BOARD_ID"] = b["id"]
        env["SOURCE_LISTS"] = ",".join(b["lists"])
        env["STATE_FILE"] = INDEX
        env["OBSIDIAN_KLIENT"] = b.get("klient", "")
        env["OBSIDIAN_BOARD"] = b["name"]
        env["BOARD_TAG"] = b["name"]  # ogranicza "remove" do tej tablicy

        plan = subprocess.run([sys.executable, "briefsync.py", "plan"],
                              cwd=HERE, env=env, capture_output=True, text=True)
        if plan.returncode != 0 or not plan.stdout.strip():
            print(f"── {b['name']} ── BŁĄD plan: {plan.stderr.strip() or 'brak outputu'}")
            continue

        args = [sys.executable, "obsidian_sync.py"] + (["--dry-run"] if DRY else [])
        out = subprocess.run(args, cwd=HERE, env=env, input=plan.stdout,
                             capture_output=True, text=True)
        res = (out.stdout.strip() or out.stderr.strip())
        lines = [l for l in res.splitlines() if l and "Brak zmian" not in l]
        total += len(lines)
        print(f"── {b['name']}  ({b.get('klient','')}) ──")
        print(res or "(brak)")
        print()
    print(f"{'[dry-run] ' if DRY else ''}RAZEM zmian: {total}")


if __name__ == "__main__":
    main()
