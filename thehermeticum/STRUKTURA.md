# The Hermeticum — architektura informacji v1 (2026-08-14)

Zasada nadrzędna (z SALT/PLATE): baza wiedzy = **trzy skrzydła** (Teksty · Postacie · Idee) spięte **Ścieżką** (The Path).
Wszystko projektowane AEO-first: każda strona odpowiada na konkretne pytanie, które zadaje człowiek albo asystent AI.

## Menu główne (6 pozycji + CTA)

```
START HERE · THE PATH · TEXTS ▾ · FIGURES ▾ · IDEAS ▾ · LETTERS        [ Subscribe — As Above ]
```

- **Start Here** — landing ścieżki: „where do I start?" (blokada B1)
- **The Path** — sekwencja 12 kroków (spis + mapa postępu)
- **Texts / Figures / Ideas** — trzy skrzydła bazy wiedzy (mega-menu z opisami)
- **Letters** — archiwum newslettera „As Above" (każde wydanie = URL)
- Stopka: About / Method (metodologia i źródła — blokady B2/B3), All texts, All figures, Glossary, RSS

## Skrzydło 1 — TEXTS (kanon lektur) `/texts/<slug>/`

Schema: Book/Article + BreadcrumbList. Hub tekstu = czym jest, kiedy i skąd, kluczowe idee, jak czytać, przekłady, FAQ.

1. **Corpus Hermeticum** (traktaty I–XIV, XVI–XVIII; ~II–III w. n.e.) — hub + podstrony per traktat, start: `/texts/corpus-hermeticum/poimandres/`
2. **The Emerald Tablet** (Tabula Smaragdina; pochodzenie arabskie ~VIII w.) — magnes AEO („as above so below origin")
3. **Asclepius** (Perfect Discourse — zachowany po łacinie)
4. **Definitions of Hermes Trismegistus to Asclepius** (tradycja ormiańska)
5. **Stobaean Fragments** (w tym Korē Kosmou / Virgin of the World)
6. **Nag Hammadi Hermetica** (Discourse on the Eighth and Ninth, Prayer of Thanksgiving)
7. **Picatrix** (Ghāyat al-Ḥakīm — magia astralna, most arabski)
8. **Musaeum Hermeticum** (korpus alchemiczny, XVII w.)
9. **The Kybalion (1908)** — strona-różnicownik: uczciwie „co Kybalion mówi dobrze, a co zmyśla" (New Thought, nie starożytność). Najczęściej wyszukiwany „tekst hermetyczny" = największy magnes wejściowy i dowód rygoru.

## Skrzydło 2 — FIGURES (postacie) `/figures/<slug>/`

Schema: Person. Karta postaci = kim był, rola w tradycji, co czytać (linki do Texts), FAQ.

- **Mityczne/starożytność:** Hermes Trismegistus (strona-flagowiec: „czy istniał?"), Thoth, Zosimos z Panopolis
- **Most arabski:** Balinas (pseudo-Apoloniusz — źródło Tablicy Szmaragdowej), Jabir ibn Hayyan
- **Renesans:** Marsilio Ficino, Pico della Mirandola, Lodovico Lazzarelli, Cornelius Agrippa, Paracelsus, Giordano Bruno, John Dee
- **Nowożytność:** G.R.S. Mead, „Three Initiates", Manly P. Hall, Franz Bardon
- **Badacze (wiarygodność!):** Frances Yates, Brian Copenhaver, Wouter Hanegraaff

## Skrzydło 3 — IDEAS (pojęcia) `/ideas/<slug>/`

Schema: DefinedTerm + FAQ. Krótkie, definicyjne strony — złoto AEO (zapytania „what does X mean").

As above, so below · Nous · Gnosis · Prisca theologia · Correspondences · The Great Work (Magnum Opus) · Theurgy · Palingenesia (rebirth) · The Ogdoad and Ennead · Hermetic vs Hermeneutic (popularna mylona para)

## THE PATH `/path/01-…/` — 12 kroków (dual-publish z newsletterem)

01 What is Hermeticism? · 02 Who was Hermes Trismegistus? · 03 Alexandria — the world that made the Hermetica · 04 Reading Poimandres (first source) · 05 The key ideas in one map · 06 As above, so below — what it actually means · 07 The Emerald Tablet · 08 The Renaissance revival · 09 Alchemy and the Great Work · 10 The Kybalion problem · 11 Hermeticism today · 12 The reading map — where to go deeper

## Reguły produkcyjne

1. **Stub-free:** kategoria/strona istnieje dopiero, gdy jest kompletna — żadnych pustych hubów (zaufanie + AEO).
2. **Każda strona:** TL;DR na górze · tabela kluczowych faktów · FAQ (3–5 pytań) · sekcja Sources (przekłady, literatura) · data aktualizacji · schema.org · breadcrumbs.
3. **Hub-and-spoke:** kroki Ścieżki linkują do hubów; huby linkują między skrzydłami (Ficino → Corpus Hermeticum → Nous).
4. **Kolejność wypełniania (tyg. 1–2):** Start Here + kroki 01–03 + huby: Corpus Hermeticum, Emerald Tablet, Hermes Trismegistus + idee: As above so below, Nous. Reszta przyrostowo przez dual-publish.
5. Prototyp menu: `index.html` (ten folder). Produkcyjny stack do decyzji przy tygodniu 1 (rekomendacja: Astro, wzorzec z fitstyle-platform).
