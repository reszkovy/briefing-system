# Procedura publikacji kroku Ścieżki (dual-publish)

Szkice w tym katalogu NIE są ładowane przez build.py (ładuje tylko `content/`).
Publikacja kroku w jego niedzielę = 4 ruchy (~10 min, robi Claude na hasło „publikuj krok NN"):

1. `mv drafts/path-NN-….json content/path-NN-….json`
2. Aktywacja linków: w `build.py` (indeks /path/: hub__soon → <a>) i w `index.html`
   (Codex: is-planned → href; home: chip z sekcji path__locked → wiersz .step albo zostaje).
   Usunąć datę przy odblokowanym kroku.
3. `python3 build.py` → rsync do hermeticum-deploy → `vercel deploy --prod` → alias www.
4. List: wziąć `drafts/letter-NN-….md`, wkleić korpus artykułu w oznaczone miejsce,
   wysyłka przez Resend Broadcast do audiencji — **wysyła Przemek osobiście** (rule:comms-read-only).

Harmonogram: 04→Aug 24 · 05→Aug 31 · 06→Sep 7 · 07→Sep 14 · 08→Sep 21 · 09→Sep 28
· 10→Oct 5 · 11→Oct 12 · 12→Oct 19.

Status szkiców:
- [x] 04 Reading Poimandres — KOMPLETNY (artykuł + list #01)
- [x] 05 The key ideas in one map — KOMPLETNY (list: adaptacja intro/outro w tygodniu wysyłki)
- [x] 06 As above, so below — KOMPLETNY (list: jw.)
- [ ] 07–12 — do napisania (materiał: research/INDEX.md sekcja 2)
