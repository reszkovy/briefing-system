#!/usr/bin/env python3
"""
obsidian_sync — mostek briefsync -> Obsidian.

Konsumuje wynik `briefsync.py plan` (JSON na stdin) i odzwierciedla go w vaulcie:
  - NOWE / create   -> tworzy notatkę briefu w  Briefy/  wg `Systems/Brief Template.md`
  - FEEDBACK        -> dopisuje komentarz z Trello do "Feedback log" w notatce
  - remove          -> ustawia status: done (zniknęło z aktywnych list Trello)

Mapowanie cardId -> ścieżka notatki trzymane w  obsidian_index.json  (obok skryptu).
Vault wykrywany automatycznie; można nadpisać zmienną OBSIDIAN_VAULT.

Użycie:
  TRELLO_KEY=.. TRELLO_TOKEN=.. python3 briefsync.py plan | python3 obsidian_sync.py
  python3 obsidian_sync.py --dry-run < plan.json      # podgląd, nic nie zapisuje
"""
import os, sys, json, re, datetime

VAULT = os.environ.get(
    "OBSIDIAN_VAULT",
    "/Users/reszek/Desktop/Claude_zadania/Obsydian/reszek",
)
BRIEFS_DIR = os.environ.get("OBSIDIAN_BRIEFS_DIR", "Briefy")
KLIENT = os.environ.get("OBSIDIAN_KLIENT", "").strip()
BOARD = os.environ.get("OBSIDIAN_BOARD", "").strip()
HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(HERE, "obsidian_index.json")
TODAY = datetime.date.today().isoformat()
DRY = "--dry-run" in sys.argv or "-n" in sys.argv

FEEDBACK_HEADER = "## 📋 Feedback log"


def load_index():
    try:
        with open(INDEX, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_index(ix):
    if DRY:
        return
    with open(INDEX, "w", encoding="utf-8") as f:
        json.dump(ix, f, indent=1, ensure_ascii=False)


def slug(name):
    s = re.sub(r'[\\/:*?"<>|#^\[\]]', "", name or "").strip()
    s = re.sub(r"\s+", " ", s)
    return (s[:80] or "brief").strip()


def trello_url(cid):
    return f"https://trello.com/c/{cid}"


def card_created(cid):
    """Data założenia karty — pierwsze 8 znaków ID Trello to unixowy timestamp."""
    try:
        ts = int(cid[:8], 16)
        return datetime.datetime.fromtimestamp(ts).date().isoformat()
    except (ValueError, TypeError, OSError):
        return ""


def template_body():
    """Treść Brief Template od pierwszego nagłówka '## ' (bez frontmattera i tytułu)."""
    p = os.path.join(VAULT, "Systems", "Brief Template.md")
    try:
        text = open(p, encoding="utf-8").read()
    except FileNotFoundError:
        return "## BRIEF\n\n_(Brief Template.md nie znaleziony w vaulcie)_\n"
    out, started = [], False
    for ln in text.splitlines():
        if not started and ln.startswith("## "):
            started = True
        if started:
            out.append(ln)
    return "\n".join(out).strip() + "\n"


def new_note(item):
    name = item["name"]
    due = item.get("due") or ""
    deadline = due.split("T")[0] if due else ""
    desc = (item.get("desc") or "").strip() or "_(brak opisu w karcie Trello)_"
    fm = [
        "---",
        "tags:",
        "  - brief",
        "  - trello",
        "  - auto",
        f'klient: "{KLIENT}"',
        f'tablica: "{BOARD}"',
        f'projekt: "{name}"',
        "status: nowy",
        'priorytet: ""',
        f'deadline: "{deadline}"',
        f'trello: "{trello_url(item["id"])}"',
        f'lista: "{item.get("list", "")}"',
        'brief-od: ""',
        f'karta_utworzona: "{card_created(item["id"])}"',
        f'ostatni_ruch: "{item.get("lastActivity", "")}"',
        f"created: {TODAY}",
        "source: briefsync",
        "---",
        "",
    ]
    src = " · ".join(filter(None, [
        f"**{KLIENT}**" if KLIENT else "",
        f"tablica **{BOARD}**" if BOARD else "",
        f"lista **{item.get('list','')}**",
        f"typ **{item.get('kind','')}**",
    ]))
    body = [
        f"# Brief — {name}",
        "",
        f"> [!info] Auto-import z Trello — {src}",
        f"> [Otwórz kartę w Trello]({trello_url(item['id'])})",
        "",
        "## Opis z Trello",
        "",
        desc,
        "",
        "---",
        "",
        template_body(),
        "",
        "---",
        "",
        FEEDBACK_HEADER,
        "",
        "<!-- briefsync dopisuje tu nowe komentarze z Trello -->",
        "",
    ]
    return "\n".join(fm + body)


def set_fm(text, key, value, quote=False):
    """Podmienia (lub dopisuje) pole we frontmatterze."""
    if not text.startswith("---"):
        return text
    end = text.find("\n---", 3)
    if end == -1:
        return text
    head, rest = text[:end], text[end:]
    val = f'"{value}"' if quote else value
    if re.search(rf"(?m)^{re.escape(key)}:", head):
        head = re.sub(rf"(?m)^{re.escape(key)}:.*$", f"{key}: {val}", head, count=1)
    else:
        head = head.rstrip() + f"\n{key}: {val}"
    return head + rest


def set_status(text, status):
    return set_fm(text, "status", status)


def append_feedback(text, line):
    if FEEDBACK_HEADER in text:
        idx = text.index(FEEDBACK_HEADER) + len(FEEDBACK_HEADER)
        # wstaw zaraz pod nagłówkiem (po ewentualnym komentarzu HTML)
        tail = text[idx:]
        tail = re.sub(r"^\s*\n(<!--.*?-->\n)?", lambda m: m.group(0).rstrip("\n") + "\n", tail, count=1)
        return text[:idx] + "\n\n" + line + text[idx:]
    return text.rstrip() + f"\n\n{FEEDBACK_HEADER}\n\n{line}\n"


def write(rel, text):
    path = os.path.join(VAULT, rel)
    if DRY:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def read(rel):
    with open(os.path.join(VAULT, rel), encoding="utf-8") as f:
        return f.read()


def exists(rel):
    return os.path.exists(os.path.join(VAULT, rel))


def briefs_dir():
    if not KLIENT:
        return BRIEFS_DIR
    safe = re.sub(r'[\\/:*?"<>|#^\[\]]', "-", KLIENT).strip()
    return f"{BRIEFS_DIR}/{safe}"


def unique_rel(name, cid):
    base = slug(name)
    d = briefs_dir()
    rel = f"{d}/{base}.md"
    if exists(rel):
        rel = f"{d}/{base} ({cid[:6]}).md"
    return rel


def main():
    if sys.stdin.isatty():
        sys.exit("Podaj plan na stdin:  briefsync.py plan | obsidian_sync.py")
    plan = json.load(sys.stdin)
    ix = load_index()
    log = []

    for item in plan.get("create", []):
        cid = item["id"]
        rel = ix.get(cid, {}).get("path") or unique_rel(item["name"], cid)
        write(rel, new_note(item))
        ix[cid] = {"path": rel, "lastActionId": item.get("lastActionId"), "board": BOARD}
        log.append(f"NOWY  → {rel}")

    for item in plan.get("feedback", []):
        cid = item["id"]
        rel = ix.get(cid, {}).get("path")
        who = item.get("who") or "?"
        txt = (item.get("text") or "").strip()
        line = f"- **{TODAY} — {who}:** {txt}"
        if rel and exists(rel):
            text = read(rel)
            text = append_feedback(set_status(text, "feedback"), line)
            text = set_fm(text, "ostatni_ruch", item.get("lastActivity", ""), quote=True)
            text = set_fm(text, "lista", item.get("list", ""), quote=True)
            write(rel, text)
            log.append(f"FEEDBACK → {rel}")
        else:
            rel = unique_rel(item["name"], cid)
            write(rel, new_note({**item, "list": item.get("list", "")}))
            text = append_feedback(set_status(read(rel) if exists(rel) and not DRY else new_note(item), "feedback"), line)
            write(rel, text)
            log.append(f"FEEDBACK (nowa notatka) → {rel}")
        ix.setdefault(cid, {})["path"] = rel
        ix[cid]["lastActionId"] = item.get("lastActionId")
        ix[cid]["board"] = BOARD

    # odśwież ruch/listę dla kart bez zmian — bez tego „bez ruchu >N dni" kłamie
    for item in plan.get("touch", []):
        cid = item["id"]
        rel = ix.get(cid, {}).get("path")
        if not (rel and exists(rel)) or DRY:
            continue
        text = read(rel)
        new = set_fm(text, "ostatni_ruch", item.get("lastActivity", ""), quote=True)
        new = set_fm(new, "lista", item.get("list", ""), quote=True)
        if new != text:
            write(rel, new)

    for item in plan.get("remove", []):
        cid = item["id"]
        rel = ix.get(cid, {}).get("path")
        if rel and exists(rel):
            text = read(rel)
            m = re.search(r"(?m)^status:\s*(\S+)", text)
            already_done = bool(m) and m.group(1).strip('"') == "done"
            if not already_done:
                text = set_status(text, "done")
                text = append_feedback(text, f"- **{TODAY}** — ✅ Zamknięte (zniknęło z aktywnych list Trello)")
                write(rel, text)
                log.append(f"DONE  → {rel}")
        # przestań śledzić zamkniętą kartę — DONE odpala się raz (idempotencja)
        ix.pop(cid, None)

    save_index(ix)
    prefix = "[dry-run] " if DRY else ""
    print(prefix + (("\n" + prefix).join(log) if log else "Brak zmian."))


if __name__ == "__main__":
    main()
