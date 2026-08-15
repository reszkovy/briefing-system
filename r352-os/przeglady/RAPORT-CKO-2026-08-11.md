# RAPORT CKO — wtorek 2026-08-11

**Doctor (deterministycznie):** 206 obiektów · 221 zdarzeń · build 0 błędów (rewizja `8de53a13`, bez zmian od 10.08).
Wymaga uwagi: `proj:artoffnia-oferta` i `proj:marka-tlumacz` stoją (0 zdarzeń w 30 dniach) · 0/25 mechanizmów z żywym dowodem · 4 karty kandydujące do podziału (`single-source-compiler` 7 flag, `competitive-benchmarking` / `format-dictionary` / `sandbox-promotion` po 4).
Terminy: `pred:artoffnia-v2-reply` za 2 dni · `-call` za 5 · `pred:tlumacz-reply` za 10 · `-deal` za 12 · `pred:tlumacz-start` za 21.
Kolejka pending: `instytut-kawy.json` **odrzucona** — brak podpisu. Doszła druga: `2026-08-11-signals-cko.json` (2 zdarzenia, dry-run OK).

## 1. Nowe projekty
Bez zmian. Doctor pokazuje 12 „luk inwentarza" na Desktopie — wszystkie to śmieci robocze (`000`, `kuks`, `paczka_22`, `casasa`), nie projekty. **Do zrobienia: dopisać je do IGNORE w doctor.js**, bo zaśmiecają sekcję i uczą ignorowania ostrzeżeń.

## 2. Nowa wiedza / zmiany Genome
Wczoraj (10.08) domknięto trzy długi po wdrożeniu SALT/PLATE: sprzeczna karta freeze (205 vs 179), pola maszynowe, testy zależne od żywego kanonu — 3 zdarzenia (`evt:2026-08-10-0001..0003`). **Zero zapisów dzisiaj** — patrz sekcja 7.

**Trial #001 (ARToffNIA) — STOI NA WYSYŁCE.** Draft „ARToffNIA - kierunek + wycena materiałów kampanijnych" (do: `monika.sobota@artoffnia.pl` + `sobota.monika@gmail.com`, cc: Katarzyna) leży w Gmailu od **8.08 08:30** i na 11.08 10:43 jest niewysłany. Trzy predykcje **nie ruszyły biegu** — kryterium `pred:artoffnia-v2-reply` zawiera warunek wstępny „mail wysłany 11.08", więc deadline przesuwa się o opóźnienie, a nie rozlicza jako MISS. Żadnej predykcji dziś nie rozliczam.
**Trial #002 (marka tłumacza) — zaparkowany.** Katarzyna: 7 dni ciszy po Twoim „wrócę z propozycją w tym tygodniu" (4.08). Wycena wciąż na Tobie.

| Wskaźnik | Wartość |
|---|---|
| Triale zakończone | **0 / 3** |
| Mechanizmy z ŻYWYM dowodem | **0 / 25** (23/25 dotkniętych backtestem) |
| Śr. iteracji na projekt | n/d |
| Czas brief→decyzja | n/d |

## 3. Nowe komponenty
Bez zmian.

## 4. Nowe automatyzacje
Bez zmian. Radar FOTRA (`fotra-kg-data.js`) przeliczony na 11.08 — 10 wpisów, priorytety odświeżone, azymut **bez zmian** (dziś tylko się potwierdził).

## 5. Wąskie gardła — dowody z radaru
- **Wysyłka, nie produkcja** (azymut z 07.08, potwierdzony czterokrotnie): ARToffNIA draft 3 dni w skrzynce · Archicom Reymonta — deadline minął wczoraj, a w wątku z Martą **zero ruchu od 8.06**, potwierdzenie materiałów z 3.08 niewysłane 8 dni, przy 38 gotowych stronach A3 · Kubota — umowa ramowa bez odpowiedzi 18 dni, raport kwartalny w Asanie 8 dni · Katarzyna — 7 dni.
- **Backlog cudzych komentarzy rośnie szybciej niż reakcja**: Osada Orle — 5 komentarzy Jana 8.08 + 3 nieprzeczytane 10.08.
- **Warstwa wykonawcza działa bez tarcia**: Ada od 11:09 na plakatach opinii Zdrofit, Pietrowski rozliczony („wysłałem Ci kaskę"), dark posty Bytom/Jaworzno/Śląsk krążą produkcja↔feedback. Geers: Filip dziś 8:50 pierwszy feedback do wczorajszego one-pagera („potrzebuję większy wykres, zaznaczyłem w figmie") — poprawka na 30 minut.

## 6. Trzy priorytety
1. **Pytanie dnia — najmniejszy eksperyment zwiększający zaufanie do Genome: wysłać mail do Moniki dziś rano.** Jeden klik zamienia trzy uśpione predykcje w pierwszy żywy pomiar w systemie. Tablica pokazuje 0/25 i 0/3 nie dlatego, że Genome się myli, tylko dlatego, że żaden zegar nie ruszył. Koszt: zero produkcji, zero kodu.
2. **Zamienić listę „NIEPEŁNY BRIEF" w licznik.** Dziś 5:22 przeniosłeś tam 5 kart wrześniowych (BW/DF/TB/inne/motion) — to żywa instancja `intake-gate-before-router`, która w Genome jest tylko hipotezą z 10 backtestów. Wystarczy dopisywać w komentarzu, **czego brakuje**: po tygodniu masz 3 najczęstsze braki i pierwszy baseline→delta z Etapu 2, bez pytania klienta o zgodę.
3. **Blok 45 minut, trzy maile, zero produkcji:** Marta (status + braki + stawka za stronę), Katarzyna (wycena), Misiaszek (umowa albo prośba o tydzień).

## 7. Ryzyka
- **Bramka zapisu blokuje też ruch prawidłowy.** Dwa pakiety czekają na Twój podpis (`instytut-kawy.json`, `2026-08-11-signals-cko.json`). Bramka jest słuszna, ale bez rytuału podpisywania Ledger przestaje rejestrować rzeczywistość — a to on jest keystone'em. Potrzebny stały moment w tygodniu na `--apply`.
- **Predykcje z zaszytą datą wysyłki degradują się cicho.** `pred:artoffnia-v2-reply` ma deadline 12.08 przy założeniu wysyłki 11.08. Każdy dzień zwłoki wymaga ręcznej interpretacji kryterium — to ta sama klasa błędu, którą backtest wykrył w `dated-commitment-gates` (0/10 trafień: bramka wiązana z własną datą zamiast z kalendarzem kontrahenta). **Genome popełnia we własnych predykcjach błąd, który sam zdiagnozował u klientów.**
- Reymonta: minięty deadline bez komunikatu to jedyne realne ryzyko relacyjne w portfelu na dziś.

## 8. Asymetria
**System mierzy wszystko poza sobą.** Zadanie `r352-cko-daily` działa od 07.08 i ma w kroku 5 obowiązek raportu — katalog `przeglady/` był do dzisiaj **pusty**. Cztery dni przeglądów istnieją tylko jako efekty uboczne (zmiany pamięci, commity, wpisy Ledgera), nie jako seria porównywalnych obserwacji. Asymetria: koszt zapisania raportu to jeden plik, a zwrot to jedyny szereg czasowy, w którym widać, czy wąskie gardło się przesuwa. Ten plik jest pierwszym punktem tego szeregu.

## 9. Radar technologiczny
Nie dziś — wtorek. (Poniedziałkowy bieg 10.08 nie zostawił raportu; pierwszy pełny radar w pon. 17.08.)
