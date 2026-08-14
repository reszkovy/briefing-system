# The Hermeticum — schemat serwisu, luki i Sprint 01

Stan: 2026-08-14, wieczór dnia launchu (thehermeticum.com LIVE).

## A. Schemat strony — co ISTNIEJE (19 URL-i)

```
/                          home: hero → hooks → path preview → wings → myth-vs-history → #subscribe → FAQ → stopka
/start-here/               landing ścieżki (konwersja)
/path/                     indeks 12 kroków
  /path/01…03/             ✅ pełne artykuły (What is H. / Hermes Trismegistus / Alexandria)
  kroki 04–12              🔒 celowo zamknięte (odblokowuje newsletter)
/texts/                    indeks skrzydła
  corpus-hermeticum/       ✅ hub (+ /poimandres/ ✅)
  emerald-tablet/          ✅ hub        asclepius/  ✅ hub        kybalion/  ✅ strona-różnicownik
  definitions, stobaean, nag-hammadi, picatrix, musaeum   🔒 planned
/figures/                  indeks; ✅ tylko hermes-trismegistus (9 kart planned)
/ideas/                    indeks; ✅ as-above-so-below, nous (7 haseł planned)
/letters/                  archiwum — pusty stan celowo
/about/method/             metodologia (3 warstwy, źródła, korekty)
```

Warstwy działające: AEO na artykułach (canonical, JSON-LD, TL;DR, FAQ, sources) · Index/⌘K z filtrem ·
engagement (reveale, parallax) · grafiki brush-ink na 12 stronach · playery YT (facade) na 6 stronach ·
redirecty http→https i www→apex · deploy powtarzalny (build.py → rsync → vercel --prod).

## B. LUKI — czego NIE MA (audyt techniczny + procesowy)

**Krytyczne (lejek/prawo):**
1. **ESP — formularz to atrapa.** Zero zbieranych adresów przy żywej domenie. Metryka #1 (≥300) stoi.
2. **Polityka prywatności + zgoda** — zbieranie maili w EU bez privacy policy = ryzyko prawne. Strona /privacy/ nie istnieje.
3. **Brak analityki** — nie zmierzymy NICZEGO (wejść, konwersji formularza). Vercel Analytics albo Plausible.

**AEO/SEO (nasza główna gra!):**
4. **Brak sitemap.xml i robots.txt.**
5. **Brak favikony** i ikon (manifest).
6. **Brak obrazów OG** — sharing wygląda pusto (og:image nie ustawione).
7. **RSS: stopka linkuje /rss.xml → 404.** (Wygenerować albo zdjąć link do czasu pierwszego Letter.)
8. Strona 404 — brak (Vercel serwuje surowy default).

**Treść (wg PLATE/QA):**
9. Poprawki źródłowe QA przed promocją hooków: łacina Tablicy wg wydania krytycznego, Kybalion/Who's Who → Deslippe wprost, Goodreads/`search-verified` precz z warstw FACT.
10. Letter #01 nie istnieje (kandydat: „Four things called Hermeticism", hook 20).
11. Dossier Alexandria + Great Work (luki blokujące z INDEX §4).
12. Baseline protokołu AI: pierwszy przebieg 20 pytań (metryka #2 potrzebuje punktu zero).

**Proces:** 13. Podpisy foundation + GO — kontrakt niezamrożony, a projekt już żyje.

## C. Sprint 01 — plan

**Daty:** pon 18.08 → nd 24.08 · **Zespół:** Przemek (solo) + sesje Claude
**Capacity:** 5–8 h realnie → planujemy na **5 h (70%)**
**Sprint Goal:** *Lejek jest prawdziwy: adres e-mail da się realnie zostawić (legalnie i mierzalnie), a pierwszy Letter wychodzi do pierwszych subskrybentów.*

| Prio | Zadanie | Szacunek | Kto | Zależności |
|---|---|---|---|---|
| P0 | ESP: endpoint /api/subscribe (Vercel function) + audiencja w Resend; podpięcie formularza | 2 h | Claude buduje, Przemek: `vercel env add RESEND_API_KEY` | klucz Resend |
| P0 | /privacy/ + checkbox zgody przy formularzu | 1 h | Claude | — |
| P0 | Letter #01 „The Four Things Called Hermeticism" — draft z dossier, dual-publish /letters/01/ | 1,5 h | Claude draft → Przemek redakcja i **wysyłka osobiście** | ESP |
| P1 | Pakiet AEO-tech: sitemap.xml + robots.txt + favicon (ibis) + og:image + strona 404; RSS albo zdjęcie linku | 1 h | Claude | — |
| P1 | Analityka (Vercel Analytics — 15 min) | 0,25 h | Claude + zgoda Przemka | — |
| P2 (stretch) | Poprawki źródłowe QA (pkt 9) | 1 h | Claude | — |
| P2 (stretch) | Baseline: pierwszy przebieg protokołu 20 pytań AI | 0,5 h | Claude | — |

Load: ~5,75 h przy 5 h planowanych → **stretchy tniemy bez żalu.**

**Ryzyka:** (1) klucz Resend — bez niego P0 stoi; mitigacja: Przemek dodaje env var w 5 min, Claude reszta.
(2) Benefit 2x zjada tydzień — mitigacja: P0 mieści się w jednym wieczorze. (3) wysyłka Letter #01 do
małej listy — to OK, archiwum i tak publikuje treść.

**Definition of Done:** formularz zapisuje realny adres do audiencji (test na własnym mailu) · /privacy/ live ·
Letter #01 opublikowany na /letters/01/ i wysłany przez Przemka · sitemap+robots+favicon+og na produkcji ·
analityka liczy wizyty.

**Kluczowe daty:** 18.08 start · 21.08 check (ESP działa?) · 24.08 koniec sprintu / wysyłka Letter #01 · 15.12 pomiar kontraktowy.
