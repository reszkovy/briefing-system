---
id: "rec:backtests/briefsync"
type: "record"
title: "Backtest #001 — briefsync (pilot)"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 2
owner: "przemek"
relations: {"attached_to":["proj:briefsync"]}
tags: ["walidacja"]
migrated_by: "mig:2026-08-evidence-contract-v1"
---


# Backtest #001 — briefsync (PILOT programu walidacji)

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
T0 ≈ 20.06.2026. Źródła przebiegu rzeczywistego: memory/briefing-tool-system.md (log 06–07.2026), karta proj:briefsync, kod briefsync/.

## Pakiet T0 (co Genome mogło wiedzieć)

Brief: feedback klientów żyje w komentarzach Trello („Przemek NOWY"), produkcja u podwykonawczyni w Figmie, gotowe pliki na Dropboxie; ręczne przenoszenie zjada czas i gubi kontekst; cel = zdjąć z Przemka rolę dyspozytora. Kontekst: solo-operator + podwykonawcy, wiele tablic klienckich w perspektywie, stack: Claude + MCP + lokalna Figma desktop, Trello REST. Stan kart na T0 (leave-one-out: bez evidence z briefsync).

## Przebieg A — Router T0

**Rekomendowane:** machine-narrows-human-picks (klasyfikacja→człowiek waliduje), deterministic-spine (stan+idempotencja jako fundament syncu), session-to-sop (komendy→SOP), incident-to-guard (każdy incydent→guard), format-dictionary (klasyfikacja typów briefów).
**Odrzucone:** proof-first-demo-pitch (projekt wewnętrzny — brak pitchu), open-tool-exchange (brak komponentu wymiany), location-as-data (nie dotyczy).

**Predykcje backtestowe (kwarantanna — bez wpływu na Briera):**
- bt:briefsync-01 (p=0.6): przy >1 źródle/tablicy wystąpi kolizja stanu wymagająca izolacji per źródło. Uzasadnienie: wspólny stan to klasyczna pułapka syncu.
- bt:briefsync-02 (p=0.7): automatyzacja oparta o sesję Claude/desktop Figma okaże się zbyt krucha i wymusi przejście na mechanizm systemowy (cron→launchd/webhook). Uzasadnienie: zależność od otwartej aplikacji.
- bt:briefsync-03 (p=0.5): rate-limity/autoryzacje API będą bottleneckiem (Trello/Figma/Dropbox — trzy różne modele auth).
- bt:briefsync-04 (p=0.4): słownik klasyfikatora będzie dryfował od realnego strumienia bez pętli uczenia.
- bt:briefsync-05 (p=0.6): rezultat = działający sync z człowiekiem w walidacji; najsłabsza gałąź (najmniej używane narzędzie) zostanie niedomknięta.

## Przebieg B — Porównanie z rzeczywistością

**Trafienia:** bt-01 HIT (kolizja „remove" między tablicami → fix BOARD_TAG; do tego druga kolizja stanu Figma/Obsidian → STATE_FILE i trzecia: idempotencja DONE); bt-02 HIT (cron session-only auto-wygasał → launchd plist 8:00); bt-03 HIT (rate-limit uploadów Figma http 000 → sleep 3; Dropbox refresh token nigdy niedostarczony); bt-05 HIT (gałąź Dropbox→Trello niedokończona — dokładnie najsłabsze ogniwo).
**Pudła (czego nie przewidzieliśmy):** (a) klasa błędów KALENDARZA — hardkodowana data strony „22.06" zamiast realnej → przenoszenie sekcji; żadna karta nie zna tej klasy; (b) „dane zgromadzone ≠ wartość" — 39 briefów + metryki lead time nigdy nie obrócone w korpus/raport (negative-knowledge istniało, ale nie jako trigger operacyjny); (c) dwustanowość konsumentów (Figma i Obsidian muszą mieć OSOBNE stany) — przewidzieliśmy kolizję między tablicami, nie między konsumentami.
**Błędne/za szerokie rekomendacje:** format-dictionary — w T0 briefsync potrzebował TYLKO trybu „triage strumienia" (create/feedback/skip/remove); słownik FORMATÓW z masterami to osobny byt, który powstał później (zdrofit-hourly). Karta zlepia dwa mechanizmy.
**bt-04:** nierozstrzygnięte (pętla uczenia nigdy nie powstała — dryf niezmierzony). Zapisane jako niewiedza, nie hit.

## Raport 10 sekcji

1. **Accuracy Routera:** ryzyka/bottlenecki 4/5 hit (80%); rezultat przewidziany trafnie. Zastrzeżenie hindsight: wartość dowodowa ograniczona (wykonawca zna wynik) — patrz PROTOKOL pkt 1; realna wartość = struktura pudeł, nie % trafień.
2. **Accuracy Mechanism Selection:** 4/5 pełne (machine-narrows, deterministic-spine, session-to-sop, incident-to-guard — wszystkie realnie nośne), 1/5 częściowe (format-dictionary — słuszny kierunek, zła granica karty). Fit ≈ 80–90%.
3. **Największe błędy:** karta format-dictionary o złej granicy (triage ≠ słownik formatów); brak klasy „błędy kalendarza/czasu"; nieprzewidziana dwustanowość konsumentów.
4. **Największe sukcesy:** pęk incydentów stanu (BOARD_TAG, DONE-idempotencja, STATE_FILE) przewidywalny JEDNĄ predykcją klasy „izolacja stanu" — deterministic-spine + incident-to-guard to para obowiązkowa dla multi-source.
5. **Nowe mechanizmy (hipotezy):** mech:stream-triage (wydzielony z format-dictionary: klasyfikacja strumienia zadań bez słownika szablonów); mech:calendar-guard (klasa: każda automatyzacja z datą liczy datę z systemu, nigdy z literału — kandydat na guard, nie mechanizm).
6. **Mechanizmy do usunięcia:** brak (pilot; format-dictionary do PODZIAŁU, nie usunięcia).
7. **Confidence Changes:** incident-to-guard + deterministic-spine: evidence typu postmortem z bt:briefsync (retro, wynik rzeczywisty). format-dictionary: ev-001 przeklasyfikowany narracja→postmortem (te same fakty zweryfikowane źródłowo) + flaga „too-broad" — BEZ podbicia confidence (dedupe per projekt: backtest nie sumuje się ze skanem tego samego projektu — inaczej double-counting, niezmiennik 10).
8. **Nowe hipotezy:** patrz 5 + bt-04 (dryf słownika) do zmierzenia na żywym briefsyncu (dane są: daily.log).
9. **Czego Genome nie wiedział w T0:** że konsumenci wyjścia (Figma/Obsidian) to osobne „tablice" z perspektywy stanu; że zgromadzone dane wymagają jawnego triggera „obróć w wartość"; klasy błędów czasu.
10. **Jak następny projekt będzie lepszy:** każdy multi-source/multi-consumer sync dostaje z automatu: izolację stanu per (źródło × konsument), guard kalendarza, checkpoint „co zrobimy z zebranymi danymi" w bramce workflow.

## Evidence (zapisane w kartach + Ledger)

- E1 {obserwacja: format-dictionary zlepia triage strumienia i słownik szablonów; dowód: briefsync.py używał wyłącznie triage (memory 06.2026, kod), słownik+mastery powstały osobno (zdrofit-hourly); wpływ: ryzyko błędnych rekomendacji Routera; zmiana: podział karty (hipoteza stream-triage); confidence: bez zmian + flaga; mech: format-dictionary}
- E2 {obserwacja: 3 niezależne incydenty briefsync to jedna klasa „stan/izolacja/idempotencja"; dowód: BOARD_TAG fix (27.06), DONE-idempotencja (28.06), STATE_FILE (26.06); wpływ: para deterministic-spine×incident-to-guard obowiązkowa dla syncu; zmiana: failure_condition w deterministic-spine; confidence: +postmortem dla obu; mech: deterministic-spine, incident-to-guard}
- E3 {obserwacja metodologiczna: evidence z backtestu projektu X i narracja ze skanu X to TE SAME fakty; dowód: ev:format-dictionary-001 vs niniejszy raport; wpływ: sumowanie = double-counting (niezmiennik 10); zmiana: reguła dedupe per projekt w PROTOKOL; confidence: n/d; mech: wszystkie}
