# Sprint: DiMedical — z redesignu w case sprzedażowy

**Daty:** 11–21.08.2026 (9 dni roboczych) · **Sprint 0:** 04–07.08 (ograniczony)
**Zespół:** Reszek solo + Claude. Ada niedostępna (Zdrofit / Benefit / Archicom).

**Cel sprintu (jedno zdanie):**
> Zamienić redesign DiMedical w gotowy do pokazania case sprzedażowy i przy okazji
> przeprowadzić go przez framework Brand Hub OS — żeby dowieść jednocześnie jakość
> wykonania i powtarzalność procesu.

Dlaczego razem: framework ma dziś ocenę „produkt do sprzedaży ~6/10 do pierwszego
przejścia", a jego blokerem jest **dry-run na realnej marce**. DiMedical to gotowy
kandydat — jeden sprint domyka dwa dowody zamiast jednego.

---

## Decyzje (zamknięte 01.08.2026)

**Ścieżka: C — case własny, potem pitch.**
Publikujemy pod `dimedical.r352.com` jako **własny koncept przeprojektowania**
(jawnie oznaczony, nie jako zrealizowane zlecenie). Równolegle Reszek pokazuje to
DiMedical jako propozycję odświeżenia. Asset powstaje niezależnie od ich decyzji,
więc nic nie blokuje sprintu.

**Wersja angielska: zostaje w P2.**
Polski wystarcza, żeby sprzedać usługę na rynku krajowym. M-Typer EN jest już
zakodowany (72 KB), więc przy wolnym czasie to głównie przekład reszty.
Przełącznik PL/EN zostaje w nawigacji — architektura 1:1 z oryginałem.

> **Warunek uczciwości (obowiązuje w ścieżce C):** to strona realnej firmy.
> Materiał musi jednoznacznie mówić, że to własny koncept, a nie wdrożenie.
> To samo dotyczy zdjęć laboratorium — są generowane, więc albo oznaczamy je jako
> wizualizację kierunku, albo podmieniamy przed pokazaniem komukolwiek.

---

## Pojemność

| Kto | Dni w sprincie | Realnie na DiMedical | Uwagi |
|---|---|---|---|
| Reszek | 9 | **5,0 d** | Archicom domyka się 10.08; równolegle Zdrofit Łodygowa, Profichem, Osada Orle |
| Ada | — | 0 | Zajęta kreacjami dla innych klientów |
| Claude | — | wspiera | Wykonawstwo kodu, QA, treści |

**Planowana pojemność: 5,0 d** · **Obciążenie P0: 4,0 d (80%)** — bufor 1,0 d zgodnie z zasadą 70–80%.

### Sprint 0 (04–07.08) — tylko to, co odblokowuje
Archicom ma pierwszeństwo (deadline 10.08, materiały od Marty zagrożone jej urlopem 3–7.08).
Na DiMedical zostaje **~1,0 d rozproszony**: decyzja o ścieżce + przygotowanie miejsca pod deploy.

---

## Backlog

### P0 — musi wyjść (4,0 d)

| # | Zadanie | Est. | Zależności |
|---|---|---|---|
| 1 | Decyzja o ścieżce (A/B/C) + oznaczenie statusu materiału | 0,5 d | **Reszek** |
| 2 | QA wizualne: 9 stron × 3 szerokości (1440 / 768 / 375), naprawy | 1,0 d | brak |
| 3 | Obrazek do social (OG) — dziś leci favicon 270×270, w podglądach link wygląda ubogo | 0,5 d | brak |
| 4 | Deploy pod adresem testowym + `noindex` / hasło | 0,5 d | **Reszek wdraża** (patrz ryzyka) |
| 5 | Strona case'u: przed/po, 3 liczby dowodowe, co i dlaczego zmienione | 1,5 d | #1 |

### P1 — powinno wyjść (2,0 d)

| # | Zadanie | Est. | Zależności |
|---|---|---|---|
| 6 | Scaffold Brand Hub (`bin/nowy-klient.sh dimedical`), `tokens.json` jako jedyne źródło prawdy → `tokens.css` | 1,0 d | brak |
| 7 | Test AI na `.brand/` — próg ≥85/100 | 0,5 d | #6 |
| 8 | Formularz kontaktowy → realny odbiór wiadomości | 0,5 d | konto usługi |

### P2 — jeśli zostanie czas

| # | Zadanie | Est. | Uwaga |
|---|---|---|---|
| 9 | Wersja angielska | 1,5 d | M-Typer EN masz już zakodowany (72 KB) — reszta do przełożenia |
| 10 | Podstrony 3 najważniejszych wpisów | 1,0 d | dziś linki prowadzą do `#` |
| 11 | Etykiety odczynników jako wizual Reagent Kitu | 0,5 d | pliki są w `porzadki/dimedical/` |

### Poza sprintem (czeka na klienta)
- Karty SDS / instrukcja używania do sekcji „Do pobrania" — **nie mamy tych plików**
- Podmiana zdjęć laboratorium (dziś generowane) na realne
- Treści i tłumaczenia EN zatwierdzone przez DiMedical

---

## Ryzyka

| Ryzyko | Co się stanie | Co robimy |
|---|---|---|
| Materiały Archicom wpadną dopiero 10.08 | Zjada 11–12.08, sprint traci 2 z 9 dni | Bufor 1,0 d już wliczony; przy poślizgu tniemy P1 |
| Claude nie ma dostępu do Twojego konta Vercel | Deploy stanie (tak było przy betterguide — `personal_scope_not_allowed`) | Ja przygotowuję repo i konfigurację, **wdrożenie klikasz Ty** |
| Publikacja case'u bez wiedzy DiMedical | Niezręczna rozmowa, ryzyko relacji | Oznaczyć jako własny koncept albo najpierw pokazać klientowi (ścieżka B) |
| Zdjęcia z generatora w materiale sprzedażowym | Podważa wiarygodność, jeśli ktoś rozpozna | Albo oznaczyć jako wizualizacja kierunku, albo podmienić przed pokazaniem |
| Panel podglądu w Claude zawieszał się przy QA | Fałszywe „pusto" zamiast błędu | QA robić w realnej przeglądarce, nie w panelu |

---

## Definicja ukończenia

- [ ] 9 stron przechodzi QA na 1440 / 768 / 375 px
- [ ] Zero błędów w konsoli, wszystkie odwołania rozwiązane (dziś 427/427)
- [ ] Kontrast WCAG AA, widoczny focus klawiatury, menu mobilne działa
- [ ] Serwis dostępny pod adresem testowym, z `noindex` lub hasłem
- [ ] Case ma sekcję przed/po i 3 liczby dowodowe
- [ ] Status materiału (koncept vs wdrożenie) oznaczony jednoznacznie
- [ ] Twoja akceptacja

---

## Kalendarz

| Data | Wydarzenie |
|---|---|
| 04–07.08 | Sprint 0 — decyzja o ścieżce; Archicom ma pierwszeństwo |
| **10.08 (pon)** | **Deadline Archicom Reymonta** — dzień poza sprintem |
| 11.08 (wt) | Start sprintu |
| 14.08 (pt) | Kontrola półmetka — czy P0 domknięte w 60%? |
| 21.08 (pt) | Koniec sprintu + przegląd |
| 22.08 | Retro: czy framework skrócił robotę, czy ją wydłużył |

---

## Stan wyjściowy (co już jest)

9 stron, architektura 1:1 z oryginałem, wspólne `styles.css` + `site.js` + `build.py`,
assety 1,3 MB (było 11 MB), 427/427 odwołań poprawnych, kontrast AA, sitemap i robots.

Ocena własna w 10 kategoriach: 8600–9400. Najsłabsze: responsywność (8600) i SEO (8700)
— bo brak wersji EN i pełnego przejścia QA na wszystkich szerokościach. To dokładnie
to, co domyka P0-2 i P2-9.
