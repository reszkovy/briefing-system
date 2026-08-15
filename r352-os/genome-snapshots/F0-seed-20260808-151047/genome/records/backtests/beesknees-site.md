---
id: "rec:backtests/beesknees-site"
type: "record"
title: "Backtest — beesknees-site"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — beesknees-site (PRZEBIEG B)

Data: 2026-08-09 · Protokół: PROTOKOL.md · dec:2026-08-09-program-walidacji
T0 ≈ 12.07.2026 (initial commit 74057c9). Źródła przebiegu rzeczywistego: memory/beesknees-site.md (log 07.2026), karta proj:beesknees-site (status 08.08), git log repo `~/Desktop/PINY PATRYK/PINY PATRYK` (56 commitów, 12.07–23.07).

## Pakiet T0 (skrót)

Bee's Knees (producent pinów, portfolio Adidas/Coca-Cola) zgłasza „brak konwersji"; wstępna diagnoza: formularz nie strzela eventem. Klient chce leady „jak WPForms Entries" na statycznym hostingu bez DB. Cel: CMS do samodzielnej edycji, mierzalne konwersje, briefy bez przestojów. Genome na T0 zna wzorzec cms-git-backend (DailyFruits) i praktykę sandboxów; nie ma mechanizmu „lead capture bez backendu".

## Raport Routera T0 (skrót przebiegu A)

Rekomendowane: working-artifact-extraction, sandbox-promotion, incident-to-guard, single-source-compiler, session-to-sop, seo-aeo-foundation. Odrzucone: numeric-gates, design-as-code, dated-commitment-gates, competitive-benchmarking. Ryzyka: boczne drzwi deployu, dziurawy kanał leadów, kolizja edycji klient↔wykonawca, sandbox-cmentarz, regresja instrumentacji. 7 predykcji bt: (pełny raport w treści zlecenia backtestu; przebieg B go nie modyfikuje).

## Przebieg B — Porównanie z rzeczywistością

### Predykcje bt:

- **bt-01 (p=0.85) HIT, mocny** — CMS = port DailyFruits (commit 52002a6 „rebrand admin panel DailyFruits -> Bee's Knees", sesja `df-cms-session-v1`), e2e 14.07 — **2 dni** od initial commit, nie 3 tygodnie. Predykcja trafna co do ścieżki, konserwatywna x10 co do czasu. Port ujawnił dokładnie friction rdzeń/parametr: regexy `[a-z0-9-]` z DailyFruits blokowały `BeesKnees_*.html`, mirror Prototype↔index wymagał dual-write, bug encji nazwanych — „use-with-care" na karcie zasłużony.
- **bt-02 (p=0.75) PARTIAL/MISS** — przyczyna trafiona (eventy nie leciały; fix 8a5790b 19.07 „fix the real 'no conversions' gap"), ale (a) **kolejność błędna**: CMS ruszył pierwszy (14.07), pomiar 5 dni później — pierwszym widocznym rezultatem był CMS + fix kurtyny, nie pomiar; (b) **głębokość błędna**: problem nie był tylko instrumentacyjny — formularz miał NIGDY niepodpięty submit handler (a3ce38e 15.07, „wrong selector"), uploader załączników bez JS (10cd442), Reply-To po cichu gubiony przez SDK (2c5a29e 23.07). Realne leady ginęły, nie tylko pomiar. Plus niewiedziana druga połowa: eventy lecą ≠ konwersje liczone (marketer musi oznaczyć Key Event/conversion action w GA4/Ads/Meta).
- **bt-03 (p=0.70) HIT, mocny i precyzyjny** — `leads.json` na niedeployowanej gałęzi `data` przez GitHub Contents API + `api/leads.js` + zakładka „Zgłoszenia" w /admin (e72e56a, 8a5790b 19.07). Dokładnie architektura plikowo-gitowa, custom r352, bez DB; WPForms jawnie odrzucony (WordPress-only). Najlepsza predykcja zestawu.
- **bt-04 (p=0.60) HIT z korektą aktora** — incydent „dwie ścieżki do produkcji" wystąpił 14.07: `vercel --prod`/deploy.sh z lokalnego drzewa tworzył deployment, który następna edycja CMS cofała (auto-deploy z GitHuba nadpisuje); zakończony twardą regułą „DEPLOY = GitHub push, nie vercel --prod" (memory, KRYTYCZNE). Ale sprawcą był **wykonawca (własny tooling)**, nie klient z ręcznymi wrzutkami, jak zakładało uzasadnienie. Bonus tej samej klasy: dwa klony źródła (folder „copy" przeterminowany) + merge 40346e7 „keep local fixes as source of truth".
- **bt-05 (p=0.65) HIT** — drafty strukturalne (dropdown 3c04ab4→revert 2af03eb, 4 podstrony /oferta/* bc66521, /index2, /realizacje2) powstały 20.07 i wg karty projektu na 08.08 nadal „czekają w sandboxie na akceptację" — **≥2,5 tygodnia**, podczas gdy treściowe/SEO szły na produkcję na bieżąco. Bottleneck = decyzja klienta, dokładnie jak w claimie. Ryzyko #4 (sandbox-cmentarz) zrealizowane.
- **bt-06 (p=0.55) HIT, umiarkowany** — brief Patryka 19.07 = jedna lista **18 punktów** (≥10 ✓), wdrożony w praktyce w 2 turach (19.07 batch niestrukturalny 8ae10af + ogon, 20.07 strukturalne drafty) bez przestoju; konflikt/iteracja skoncentrowane w punktach strukturalnych (dropdown wszedł na produkcję i został cofnięty). Słabość: „1–2 tury" to miękka miara — commitów było ~20; kwalifikuję jako hit na poziomie intencji, nie ostrej metryki.
- **bt-07 (p=0.60) HIT słaby (predykcja dysjunktywna)** — prewencyjny guard na eventy konwersji **nie powstał ani przed, ani po**: żaden ślad (git/memory) nie pokazuje testu/weryfikacji automatycznej po deployu; weryfikacje były ręczne (Resend get-email, panel). Claim „po incydencie lub wcale" trafia w „wcale", ale konstrukcja „A lub nie-A-w-terminie" jest prawie niefalsyfikowalna — trafienie o niskiej wartości informacyjnej. Ważniejsza obserwacja obok: to falsyfikuje incident-to-guard jako REKOMENDACJĘ (niżej).

### Mechanizmy — trafienia / pudła / fałszywe alarmy

**Pełne trafienia (2/6):**
- **working-artifact-extraction** — nośny: cały CMS, panel leadów i podstrony /oferta/* (klon powłoki kontakt.html) powstały przez ekstrakcję/port, nie od zera. Drugie wdrożenie realnie przetestowało granicę rdzeń/parametr (regexy, mirror, encje).
- **sandbox-promotion** — nośny i literalny: /index2, /realizacje2, oferta/* z noindex + czarny banner, produkcja czysta, dropdown cofnięty z produkcji do sandboxa; promocja = jeden akt po akcepcie. Failure mode karty (cmentarz wersji) też się zrealizował.

**Częściowe (3/6):**
- **incident-to-guard** — karta OPISOWO potwierdzona (guardy nie powstały prewencyjnie), ale jako rekomendacja Routera NIE zadziałała: ≥4 incydenty (kurtyna 14.07, submit handler 15.07, lightbox 404 52352da, Reply-To 23.07) i **zero blokujących guardów na rurze deploy**. Nauczki wylądowały w pamięci (session-to-sop), nie w CI. Bramka workflow #5 Routera nigdy nie zaistniała. Rekomendacja bez mechanizmu egzekucji = dekoracja.
- **session-to-sop** — połowicznie: memory/beesknees-site.md to de facto gęsty runbook (deploy, gotchas, env), ale brak SOP dla klienta (instrukcja CMS) i brak sformalizowanej procedury — wiedza przeżyła rotację sesji w auto-memory, nie jako artefakt.
- **seo-aeo-foundation** — SEO zaszło (c94d396 wg wytycznych zewnętrznej agencji, H1 na /realizacje, noindex na draftach, redirecty), ale jako JEDNORAZOWY batch sterowany przez agencję klienta, nie jako stała bramka na każdej promocji. Router źle przewidział formę (bramka vs. zadanie wsadowe).

**Pudło selekcji (1/6):**
- **single-source-compiler** — rekomendowany, NIEUŻYTY, i co gorsza **w konflikcie z inną rekomendacją Routera**: silnik CMS edytuje pliki wynikowe in-place po offsetach, więc krok kompilacji z fragmentów zniszczyłby model edycji klienta. Serwis został przy N osobnych plikach HTML z inline JS — fix kurtyny wymagał ręcznej edycji 13 plików (dokładnie ból, który karta adresuje), a mimo to kompilatora nie wprowadzono, bo nie było jak. Router nie zauważył kolizji dwóch własnych rekomendacji. Zamiast kompilatora powstał anty-wzorzec: mirror `cp Prototype index` + dual-write w CMS.

**Użyte-a-nierekomendowane (miss rate):**
- **machine-narrows-human-picks** — klasyfikacja wizualna 109 zdjęć przez 10 agentów → propozycja na /index2 → człowiek (Patryk) waliduje przed promocją (10cf3d4, photo-mapping.json z confidence/why). Podręcznikowy przebieg mechanizmu, którego Router w ogóle nie rozważył — bo trigger karty jest skalibrowany na strumienie zadań, nie na jednorazową klasyfikację assetów.

**Odrzucenia:** wszystkie 4 zasadne — żaden z odrzuconych mechanizmów nie okazał się potrzebny. Zero fałszywych odrzuceń.

### Ryzyka: 4/5 hit

1. Boczne drzwi deployu — HIT (nauczka vercel --prod 14.07). 2. Dziurawy kanał leadów — HIT potrójny (handler, uploader, Reply-To — trzy niezależne ciche przecieki). 3. Kolizja edycji klient↔wykonawca — HIT słaby (merge 40346e7, jednorazowy). 4. Sandbox-cmentarz — HIT (drafty wiszą od 20.07). 5. Regresja instrumentacji — nie zaobserwowana (brak śladu nawrotu; też brak guarda, więc nieobserwowalna — nierozstrzygnięte).

## Raport 10 sekcji

1. **Accuracy Routera:** predykcje 5 hit / 1 partial / 1 hit-słaby; ryzyka 4/5. Zastrzeżenie hindsight jak w pilocie (PROTOKOL pkt 1). Najcenniejsze nie są procenty, tylko dwa strukturalne pudła: kolejność wartości (CMS przed pomiarem) i klasa „cichy sukces" (kod wygląda OK, skutek nie następuje), której żadna karta nie zna.
2. **Accuracy Mechanism Selection:** 2/6 pełne, 3/6 częściowe, 1/6 pudło (single-source-compiler), 1 miss (machine-narrows-human-picks). Fit ≈ 60–70% — wyraźnie niżej niż pilot briefsync; przyczyna: Router dobiera karty pojedynczo i nie sprawdza ich wzajemnej zgodności (kompilator × CMS-in-place).
3. **Największe błędy:** (a) rekomendacja single-source-compiler sprzeczna z comp:cms-git-backend — brak testu spójności zestawu rekomendacji; (b) incident-to-guard jako rekomendacja nie zmienia zachowania — 4 incydenty, 0 guardów; karta opisuje świat, nie steruje nim; (c) bt-02: Router założył „najtańszy dowód wartości = pomiar najpierw", realna sekwencja odwrotna, a problem głębszy niż instrumentacja (formularz w ogóle nie wysyłał).
4. **Największe sukcesy:** (a) bt-03 — architektura panelu leadów przewidziana co do gałęzi gita; para working-artifact-extraction × sandbox-promotion opisała ~80% realnej pracy; (b) bt-04/ryzyko-1 — incydent dwóch ścieżek deployu przewidziany zanim ktokolwiek zajrzał do historii; (c) ryzyko „dziurawy kanał leadów" trafione potrójnie.
5. **Nowe mechanizmy (hipotezy):** **mech:sink-verification** — klasa „cichy sukces": weryfikacja skutku na UJŚCIU, nie przy wywołaniu (mail delivered z nagłówkiem, event widoczny w GA4, lead w panelu), spina submit-handler, Reply-To (SDK po cichu ignoruje nieznane klucze), „eventy lecą ale nieoznaczone jako konwersje". Trzy niezależne incydenty w jednym projekcie + wykrycie zawsze przez klienta. **guard:canonical-workdir** — jedna kanoniczna kopia robocza, stale klony poddane kwarantannie (klasa potwierdzona w ≥2 projektach: dailyfruits-repo-clones + PINY PATRYK copy).
6. **Mechanizmy do usunięcia:** brak. single-source-compiler NIE do usunięcia — do dopisania anti-contextu (patrz 7).
7. **Confidence Changes (TYLKO propozycje — zapis robi sesja główna):** working-artifact-extraction: +evidence postmortem (drugie wdrożenie, przenośność potwierdzona z frictionem). sandbox-promotion: +evidence postmortem (wzorzec + failure mode oba potwierdzone). single-source-compiler: BEZ podbicia + flaga anti-context „CMS edytujący pliki wynikowe in-place wyklucza krok kompilacji". incident-to-guard: BEZ podbicia + flaga wrong-trigger (opisowa trafność ≠ sprawczość rekomendacji; potrzebny wymuszony checkpoint „guard w ≤N dni" w bramkach). machine-narrows-human-picks: +evidence narracyjny (użycie poza strumieniem zadań — klasyfikacja assetów) + poszerzenie contextu. seo-aeo-foundation: flaga „w projektach utrzymaniowych wchodzi jako batch zewnętrzny, nie stała bramka".
8. **Nowe hipotezy:** patrz 5; plus (a) „pomiar drugi, własność pierwsza" — w relacji utrzymaniowej klient najpierw chce kontroli (CMS), pomiar jest dowodem drugim; (b) instrumentacja ma granicę własności: strzelający event ≠ policzona konwersja (ostatnia mila jest po stronie marketera/platform) — kandydat na failure_condition w przyszłej karcie pomiaru.
9. **Czego Genome nie wiedziało w T0:** że „brak konwersji" może maskować całkowicie martwy formularz (nie tylko martwy pomiar); klasa „SDK po cichu ignoruje nieznane parametry"; że darmowe plany (Resend 1 domena) wymuszają wysyłkę z cudzej domeny; że silnik CMS-in-place i kompilator fragmentów się wykluczają; że klasyfikacja assetów to też teren machine-narrows-human-picks; klasa stale-clone.
10. **Jak następny projekt będzie lepszy:** (a) Router dostaje krok „test spójności zestawu" — czy rekomendowane mechanizmy nie kolidują ze sobą i z komponentami (compiler × cms-in-place); (b) każdy projekt z kanałem lead/mail/event dostaje z automatu bramkę sink-verification: dowód skutku na ujściu przed ogłoszeniem „działa"; (c) incident-to-guard w workflow zawsze z datowanym checkpointem egzekucji, inaczej nie rekomendować; (d) diagnoza „brak konwersji" zaczyna się od testu e2e formularza (czy lead w ogóle dociera), nie od eventów.

## Evidence (propozycje zapisu — wykonuje sesja główna)

- E1 {obserwacja: CMS przeniesiony jako port DailyFruits, e2e w 2 dni; friction rdzeń/parametr realny (regexy nazw plików, mirror index, encje); dowód: commity 52002a6→d7411b9 12–14.07.2026 + memory beesknees-site (CMS e2e 14.07); wpływ: przenośność wzorca potwierdzona na 2. wdrożeniu; zmiana: +postmortem evidence; mech: working-artifact-extraction}
- E2 {obserwacja: pełny cykl sandbox (noindex /index2, /oferta/* drafty, dropdown revert z produkcji 2af03eb) + failure mode cmentarza (drafty 20.07 → nadal pending 08.08 wg karty projektu); dowód: git 20.07.2026 + proj:beesknees-site status 08.08; wpływ: karta potwierdzona wraz z failure mode; zmiana: +postmortem evidence; mech: sandbox-promotion}
- E3 {obserwacja: rekomendacja kompilatora sprzeczna z silnikiem CMS edytującym HTML in-place; fix kurtyny = ręczna edycja 13 plików, kompilator nie powstał, zamiast tego mirror cp+dual-write; dowód: commit 2f1c361 14.07.2026 + memory (silnik offsetowy, mirror Prototype↔index); wpływ: Router rekomenduje kolidujące mechanizmy; zmiana: anti-context w karcie + krok „test spójności zestawu" w ROUTER.md; mech: single-source-compiler}
- E4 {obserwacja: ≥4 incydenty (kurtyna, submit handler, lightbox 404, Reply-To), zero blokujących guardów na deployu — wnioski tylko w pamięci; dowód: commity 2f1c361 (14.07), a3ce38e (15.07), 52352da (20.07), 2c5a29e (23.07) + brak jakiegokolwiek testu w repo; wpływ: karta opisowa, rekomendacja bez egzekucji; zmiana: flaga wrong-trigger + wymóg datowanego checkpointu; mech: incident-to-guard}
- E5 {obserwacja: trzy niezależne przecieki klasy „cichy sukces" w kanale leadów, wszystkie wykryte przez klienta, nie system; dowód: a3ce38e 15.07 (handler never attached), 10cd442 19.07 (uploader bez JS), 2c5a29e 23.07 (reply_to snake_case ignorowany przez resend v4) + memory „eventy LECĄ, ale marketer musi je OZNACZYĆ"; wpływ: luka klasowa w Genome; zmiana: nowa hipoteza mech:sink-verification; mech: (brak karty — hipoteza)}
- E6 {obserwacja: klasyfikacja 109 zdjęć przez 10 agentów z ludzką walidacją przed promocją — mechanizm użyty, nierekomendowany; dowód: commit 10cf3d4 19-20.07.2026 + photo-mapping.json (confidence/why) w memory; wpływ: trigger karty za wąski (tylko strumienie zadań); zmiana: poszerzenie context o klasyfikację assetów; mech: machine-narrows-human-picks}
- E7 {obserwacja: incydent „dwie ścieżki do produkcji" po stronie wykonawcy (vercel --prod vs auto-deploy z GitHuba), zakończony twardą regułą jednej ścieżki; dowód: memory beesknees-site „KRYTYCZNE (nauczka 14.07)"; wpływ: failure mode karty potwierdzony, aktor inny niż zakładany; zmiana: failure_condition rozszerzony o „własny tooling wykonawcy"; mech: sandbox-promotion}
