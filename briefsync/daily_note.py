#!/usr/bin/env python3
"""
daily_note — buduje "Notatkę dnia" w Obsidianie z briefów briefsync.

Czyta frontmatter briefów z Briefy/** i składa dzienny przegląd ułożony wg
priorytetów Reszka (decision-framework): pilne → feedback → nowe → aktywne per
klient → zamknięte. Zapis: OS/Daily/<YYYY-MM-DD>.md (idempotentnie nadpisuje
notatkę z dziś).

Użycie:  python3 daily_note.py
"""
import os, re, glob, json, datetime

VAULT = os.environ.get("OBSIDIAN_VAULT",
                       "/Users/reszek/Desktop/Claude_zadania/Obsydian/reszek")
GENOME_DIST = os.environ.get(
    "GENOME_DIST",
    "/Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/r352-os/genome/dist")
BRIEFS = os.path.join(VAULT, "Briefy")
OUTDIR = os.path.join(VAULT, "OS", "Daily")

TODAY = datetime.date.today()
YESTERDAY = TODAY - datetime.timedelta(days=1)
DNI = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"]


def parse_fm(text):
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    fm = {}
    for line in text[3:end].splitlines():
        m = re.match(r"\s*([\w-]+):\s*(.*)", line)
        if m:
            fm[m.group(1)] = m.group(2).strip().strip('"').strip("'")
    return fm


def rel_to_vault(path):
    return os.path.relpath(path, VAULT)


def load_briefs():
    out = []
    for p in glob.glob(os.path.join(BRIEFS, "**", "*.md"), recursive=True):
        text = open(p, encoding="utf-8").read()
        fm = parse_fm(text)
        if not fm:
            continue
        closed_y = ("Zamknięte" in text and YESTERDAY.isoformat() in text)
        out.append({
            "projekt": fm.get("projekt", os.path.basename(p)[:-3]),
            "klient": fm.get("klient", ""),
            "status": fm.get("status", ""),
            "deadline": fm.get("deadline", ""),
            "lista": fm.get("lista", ""),
            "trello": fm.get("trello", ""),
            "created": fm.get("created", ""),
            "karta_utworzona": fm.get("karta_utworzona", ""),
            "ostatni_ruch": fm.get("ostatni_ruch", ""),
            "path": rel_to_vault(p),
            "closed_yesterday": closed_y,
        })
    return out


def genome_section():
    """Szew #1 z dec:2026-08-08-genome-fotra-integracja — tablica 4 wskaźników
    czytana z genome/dist (GENEROWANE przez build.js). Tylko odczyt, tylko dist."""
    mp = os.path.join(GENOME_DIST, "METRICS.md")
    if not os.path.exists(mp):
        return []
    rows = [l for l in open(mp, encoding="utf-8").read().splitlines()
            if l.startswith("|")]
    if not rows:
        return []

    L = ["## 🧬 Genome — tablica wskaźników", ""]

    # świeżość builda: ostrzeż, gdy dist jest stary względem źródeł
    rev = os.path.join(GENOME_DIST, "REVISION.json")
    if os.path.exists(rev):
        try:
            r = json.load(open(rev, encoding="utf-8"))
            gen = r.get("generated_at", "")[:10]
            age = (TODAY - datetime.date.fromisoformat(gen)).days if gen else None
            info = (f"_Build: {gen} · obiektów {r.get('objects','?')} · "
                    f"zdarzeń {r.get('events','?')} · błędów {r.get('errors','?')}_")
            if age is not None and age > 2:
                info += f"\n\n> [!warning] Build ma {age} dni — odpal `node build.js`, zanim uwierzysz liczbom."
            L += [info, ""]
        except (ValueError, KeyError, OSError):
            pass

    L += rows
    L += ["", "_Źródło: `genome/dist/METRICS.md` (GENEROWANE). Kontekst: [[genome-os]] · "
          "bramka: `dec:2026-08-08-plan-90-dni` — do 3 trialów zero rozwoju architektury._", ""]
    return L


def days_to(deadline):
    try:
        d = datetime.date.fromisoformat(deadline)
        return (d - TODAY).days
    except (ValueError, TypeError):
        return None


def link(b):
    note = b["path"][:-3]  # bez .md
    dl = f" · ⏳ {b['deadline']}" if b["deadline"] else ""
    kl = f" · {b['klient']}" if b["klient"] else ""
    return f"- [[{note}|{b['projekt']}]]{kl} · {b['lista']}{dl}"


def main():
    briefs = load_briefs()
    active = [b for b in briefs if b["status"] in ("nowy", "feedback")]

    overdue = [b for b in active if
               days_to(b["deadline"]) is not None and days_to(b["deadline"]) < 0]
    pilne = [b for b in active if
             (days_to(b["deadline"]) is not None and 0 <= days_to(b["deadline"]) <= 2)
             or "pilne" in b["projekt"].lower()]
    feedback = [b for b in active if b["status"] == "feedback"]
    # data założenia KARTY w Trello, nie notatki (fallback: created notatki)
    nowe = [b for b in active if (b["karta_utworzona"] or b["created"]) == TODAY.isoformat()]

    def stale_days(b):
        d = days_to(b["ostatni_ruch"])
        return -d if d is not None else None

    stale = [b for b in active if (stale_days(b) or 0) > 14]
    zamkniete = [b for b in briefs if b["closed_yesterday"]]

    # aktywne per klient
    per_klient = {}
    for b in active:
        per_klient.setdefault(b["klient"] or "—", []).append(b)

    def sort_dl(items):
        return sorted(items, key=lambda b: (days_to(b["deadline"]) if days_to(b["deadline"]) is not None else 999))

    L = []
    L.append("---")
    L.append("tags:\n  - daily\n  - przeglad")
    L.append(f"data: {TODAY.isoformat()}")
    L.append("source: daily_note")
    L.append("---")
    L.append("")
    L.append(f"# Dzień — {TODAY.isoformat()} ({DNI[TODAY.weekday()]})")
    L.append("")
    L.append("> [!abstract] Fokus dnia (wg [[decision-framework]])")
    L.append("> Rusza **sales / system / product**? Da się **delegować/zautomatyzować**? "
             "Nie robisz z siebie **bottlenecku**? Zob. [[soul]] · [[user]].")
    L.append("")
    L.append(f"**Aktywne briefy:** {len(active)} · **bez ruchu >14 dni:** {len(stale)} · "
             f"**przeterminowane:** {len(overdue)} · **pilne (≤2 dni):** {len(pilne)} · "
             f"**feedback:** {len(feedback)} · **nowe dziś:** {len(nowe)} · "
             f"**zamknięte wczoraj:** {len(zamkniete)}")
    L.append("")

    L += genome_section()

    L.append("## 🧊 Bez ruchu >14 dni — do zamknięcia lub wznowienia")
    L.append("_Definition of done: karta w Feedback >7 dni bez ruchu → Done albo On Hold._")
    L.append("")
    L += [f"{link(b)} · 💤 {stale_days(b)} dni"
          for b in sorted(stale, key=lambda x: -(stale_days(x) or 0))] or ["_brak_"]
    L.append("")
    L.append("## ⏰ Przeterminowane")
    L += [link(b) for b in sort_dl(overdue)] or ["_brak_"]
    L.append("")
    L.append("## 🔴 Pilne (≤ 2 dni / PILNE)")
    L += [link(b) for b in sort_dl(pilne)] or ["_brak_"]
    L.append("")
    L.append("## 💬 Feedback do ogarnięcia")
    L += [link(b) for b in sort_dl(feedback)] or ["_brak_"]
    L.append("")
    L.append("## 🆕 Nowe briefy (dziś)")
    L += [link(b) for b in nowe] or ["_brak_"]
    L.append("")
    L.append("## 📊 Aktywne briefy per klient")
    for kl in sorted(per_klient, key=lambda k: -len(per_klient[k])):
        L.append(f"### {kl} ({len(per_klient[kl])})")
        L += [link(b) for b in sort_dl(per_klient[kl])]
    L.append("")
    L.append("## ✅ Zamknięte (wczoraj)")
    L += [link(b) for b in zamkniete] or ["_brak_"]
    L.append("")

    os.makedirs(OUTDIR, exist_ok=True)
    out = os.path.join(OUTDIR, f"{TODAY.isoformat()}.md")
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(L))
    print(f"daily_note → {rel_to_vault(out)}  (aktywne {len(active)}, pilne {len(pilne)}, feedback {len(feedback)})")


if __name__ == "__main__":
    main()
