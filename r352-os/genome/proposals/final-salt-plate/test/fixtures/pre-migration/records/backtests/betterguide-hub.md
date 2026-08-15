---
id: "rec:backtests/betterguide-hub"
type: "record"
title: "Backtest — betterguide-hub"
status: "created"
created: "2026-08-09"
updated: "2026-08-09"
version: 1
owner: "przemek"
relations: {}
tags: ["walidacja"]
---

# Backtest — betterguide-hub (proj:betterguide-hub)

Data: 2026-08-09 · Protokół: PROTOKOL.md · Przebieg B (przebieg A = raport Routera T0, nie poprawiany)
Źródła przebiegu rzeczywistego: karta proj:betterguide-hub, memory/betterguide-deploy.md (~21.07), kod+git `~/Desktop/Claude_zadania/BetterWorkplace/r352-deploy/` (38 commitów, 13.04–15.06.2026 + duży stan uncommitted z lipca), repo `~/Desktop/Claude_zadania/FrameWorkProdukty/r352-framework` (commity 02.08).

## Pakiet T0 (skrót — pełny w raporcie Routera)

Rozproszone materiały strategiczne BW/DailyFruits → jeden hub "Przewodnik po ekosystemie BetterWorkplace": bramka na wejściu + publiczne podstrony; narzędzie doradczo-sprzedażowe dla istniejącego klienta; /strategia z ambicją kanonu deliverable'u r352.

## Skrót raportu Routera T0 (przebieg A)

Rekomendowane: single-source-compiler, working-artifact-extraction, proof-first-demo-pitch (wariant doradczy), compounding-channel. Odrzucone: seo-aeo-foundation, split-url-architecture, format-dictionary, deterministic-spine, competitive-benchmarking. Ryzyka top-5: dryf hub-vs-źródło; bramka client-side; granica public/gated nieudokumentowana; wąskie gardło deployu; hub bez pętli zasilania. Predykcje SYGNAŁ bt-01…06 (silnik projekt-specyficzny; bramka client-side; sekcja = ręczna kopia z dryfem; deploy ręczny Reszka; /strategia użyta ponownie ≤2 mies.; brak warstwy SEO).

## Przebieg B — Porównanie z rzeczywistością

### Predykcje SYGNAŁ

- **bt-01 (p=0.75) HIT.** Hub = ręcznie pisane pliki HTML, ZERO silnika buildowego (brak build.py/build.js w r352-deploy; 65 plików luzem). Nawet "mniej" niż predykcja: nie skopiowany mini-SSG, tylko czysta ręczna edycja index.html ("wyłączenie karty = zakomentowanie" — memory 21.07). Żadnego reużycia kanonicznego komponentu.
- **bt-02 (p=0.70) HIT.** Bramka = client-side hash JS w index.html (funkcja `checkPw()`, porównanie z `-1422286391`, sessionStorage `bw_auth`) — kolejna niezależna implementacja, nie staticrypt, nie reużycie. Kawat: dla CMS-a powstał później mały backend auth (api/cms-auth.js) — ale wejściowa bramka hubu została client-side, zgodnie z claimem.
- **bt-03 (p=0.65) HIT (słaby).** Cały hub jest utrzymywany ręcznie; sekcja TeamBudget to ręcznie kuratorowane karty + ręcznie pisane strony tb-*.html równolegle do artefaktów źródłowych. Dryf wykazywalny: artefakty TeamBudget w "Narzedzie do briefowania" zaktualizowane 19–20.07 (strategia-expanded, lejki), a hubowy tb-strategia.html ostatni raz tknięty 14.07 (i to uncommitted) — rozszerzona strategia nigdy nie stała się widokiem w hubie. Słabość hita: to nie literalna KOPIA jednego artefaktu, tylko równoległa ręczna treść z dryfem przez pominięcie; mechanizm (ręczne utrzymanie zamiast widoku ze źródła) potwierdzony, litera claimu częściowo.
- **bt-04 (p=0.65) HIT (mocny).** Memory 20–21.07: projekt pod osobistym kontem Vercel "r352", CLI Claude'a w zespole bez dostępu, `personal_scope_not_allowed` → deploy wyłącznie Reszek, `vercel --prod` z całego folderu, NIE z gita; live zawiera niezacommitowane lokalne zmiany. Wąskie gardło potwierdzone wprost (drugi dryf: git-vs-live).
- **bt-05 (p=0.55) HIT.** Jawna ekstrakcja z commitem: repo r352-framework v1 (commit 1619504, 02.08.2026) zawiera `spec/STRATEGIA-WZORZEC.md` — wzorzec dokumentu strategii "interaktywny HTML, panel klienta, gated hasłem", a `spec/BRAND-HUB-SPEC.md` wskazuje betterguide.pl jako źródło wzorca hubu; format użyty w pilocie Mała Palarnia (commit 91adf63 "wdrożenie poprawek z pilota", 02.08). Kawat: szkielet HTML `szablony/strategia/strategia-doc.html` wg BACKLOG.md "jeszcze nie wyekstrahowany" — spec tak, kod nie (klasyczny "destylat częściowy").
- **bt-06 (p=0.60) HIT (słaby/generyczny).** Zero sitemap/robots/JSON-LD w r352-deploy; noindex na cms (header X-Robots-Tag w vercel.json) i na tb-strategia-komunikacji.html (meta). Hit przez domyślną nieobecność — niska wartość dowodowa.

**Wynik: 6/6, w tym 2 słabe (bt-03, bt-06).** Zastrzeżenie hindsight jak w pilocie: wykonawca zna wynik; realna wartość = struktura pudeł ryzyk i luka CMS, nie % trafień.

### Mechanizmy

- **working-artifact-extraction — PEŁNY HIT.** Dokładnie przewidziany przebieg: /strategia → spec w frameworku przez ekstrakcję (BACKLOG zasada 41: "szablon przez ekstrakcję, nigdy od zera"), plus druga, nieprzewidziana ekstrakcja: CMS z r352-deploy → `szablony/cms/` frameworku.
- **compounding-channel — CZĘŚCIOWY.** Połowa "kanał" zadziałała: hub był realnie zasilany kwiecień→lipiec (karty Dropbox/Figma/Google Drive 14.06, TB landing V0/V1 15.06, tb-hasla/tb-kalkulator/kampanie-performance w lipcu — uncommitted). Połowa "kanoniczny silnik" NIE: zero reużycia komponentu, bramka przepisana. Karta zlepia dwie rzeczy (analogicznie do format-dictionary z pilota).
- **single-source-compiler — REKOMENDOWANY, NIEUŻYTY (wrong wg metryki).** Hub nigdy nie był widokiem ze źródeł; failure mode karty ("widok ręcznie obok źródła") zmaterializował się podwójnie (hub-vs-artefakty TB, git-vs-live). Rekomendacja słuszna normatywnie, ale jako predykcja doboru — pudło: projekt poszedł dokładnie w anty-wzorzec i MIMO TO dowiózł cel (hub LIVE, klient obsłużony). Koszt dryfu realny, lecz nie zabił projektu.
- **proof-first-demo-pitch — CZĘŚCIOWY/NIEROZSTRZYGNIĘTY.** Hub pełni rolę powierzchni doradczo-sprzedażowej (karty TB landing z pillami DDL, kalkulator, badge "Hipoteza"), ale w śladzie nie ma dowodu warunku karty (ścieżka do decyzji/wycena przy pokazie) ani domkniętej sprzedaży wdrożenia. Nie da się orzec, czy mechanizm niósł wynik.
- **Odrzucenia — 5/5 poprawne.** seo-aeo (potwierdzone bt-06), split-url (jeden system adresów, cleanUrls), format-dictionary (kilka unikalnych dokumentów), deterministic-spine (statyczny serwis; drobny wyjątek: api/cms-*.js to backend treści, nie system decyzyjny — odrzucenie broni się), competitive-benchmarking (zero śladu potrzeby).

### Ryzyka Routera

- R1 dryf hub-vs-źródło — **HIT** (jak bt-03 + git-vs-live).
- R2 bramka client-side = pozorna poufność — **HIT**, z zaostrzeniem nieprzewidzianym: wewnątrz hubu karta wyświetla jawnie hasło do INNEGO zasobu ("Hasło: Katalog2026" w index.html linia ~561) — secret-sprawl między systemami o różnej klasie ochrony.
- R3 granica public/gated nieudokumentowana — **CZĘŚCIOWY**: granica istnieje tylko implicite (bramka wyłącznie na index; podstrony ze strategią TB publicznie osiągalne po URL, cleanUrls ułatwia zgadywanie); brak spisanej listy; incydentu brak w śladzie.
- R4 wąskie gardło deploy — **HIT** (bt-04).
- R5 hub bez pętli zasilania / zamarznięcie — **PUDŁO (fałszywy alarm)**: hub żył i rósł 4 miesiące, wykształcił nawet CMS. Rzeczywisty problem był odwrotny: hub rósł SZYBCIEJ niż dyscyplina repo (uncommitted backlog).

### Czego nikt nie przewidział

1. **Emergencja CMS.** Największa ewolucja projektu: hub prezentacyjny wyrósł w edytowalny produkt (cms.html + api/cms-auth/content/chat.js), który stał się bazą szablonu CMS całego frameworku (README frameworku: "CMS (baza) | betterguide.pl/cms"). Żaden mechanizm ani ryzyko Routera tego nie dotykały.
2. **Anachronizm pakietu T0.** Git dowodzi: projekt zaczął się 13.04.2026 jako hosting brand-voice guide'ów BW/DF, a "hub ekosystemu" wykrystalizował się 09–15.06; artefakty TeamBudget GTM cytowane w T0 jako "gotowe" (tb-body.html → widoki) mają mtime 19–20.07 (miesiąc PO fazie hubowej), a tb-body.html w ogóle nie istnieje na dysku. Pakiet T0 był skażony hindsightem/kompresją chronologii — obniża to wartość dowodową evidence w rekomendacji nr 1.

## Raport 10 sekcji (CEO)

1. **Accuracy Routera:** predykcje SYGNAŁ 6/6 (2 słabe), ryzyka 3/5 pełne + 1 częściowe + 1 fałszywy alarm. Zastrzeżenie: hindsight wykonawcy + wadliwie zrekonstruowany T0 (anachronizm) — nominalny wynik zawyżony; wartość = R5-pudło i luka CMS.
2. **Accuracy Mechanism Selection:** 1/4 pełny (working-artifact-extraction), 2/4 częściowe (compounding-channel, proof-first-demo-pitch), 1/4 nieużyty-a-rekomendowany (single-source-compiler). Odrzucenia 5/5. Fit ≈ 50–60% pełnych, ~85% kierunkowo.
3. **Największe błędy:** (a) brak jakiejkolwiek anteny na klasę "hub przeradza się w produkt z warstwą edycji (CMS)"; (b) anachronizm T0 — rekonstrukcja cytowała artefakty późniejsze niż realny start; (c) R5 na odwrót — problemem nie było zamarznięcie, tylko wzrost bez dyscypliny repo; (d) compounding-channel zlepia "dyscyplinę kanału" z "reużyciem kanonicznego komponentu" — w tym projekcie pierwsza zaszła, druga nie.
4. **Największe sukcesy:** bt-04 (deploy-bottleneck przewidziany co do mechanizmu konta Vercel); bt-05 (ekstrakcja /strategia z commitem + realne drugie użycie w pilocie Mała Palarnia — rzadki przypadek, gdzie "destylat NIE został notatką"); pełna trafność odrzuceń, zwłaszcza seo-aeo.
5. **Nowe mechanizmy (hipotezy):** mech:living-hub-cms — "żywy hub kliencki wykształca potrzebę ścieżki edycji; bez zaplanowanego CMS-a powstanie ad hoc" (evidence: betterguide cms.html+api, bees-knees CMS, Fruityyyy CMS v6 — rodzina już 3-elementowa); guard:secret-sprawl — hasła do zasobów o wyższej/innej klasie ochrony nie mogą być treścią w zasobie o niższej klasie.
6. **Mechanizmy do usunięcia:** brak. compounding-channel — kandydat do PODZIAŁU (channel-discipline vs canonical-component-reuse), nie usunięcia.
7. **Confidence Changes (PROPOZYCJE — zapisy robi sesja główna):** working-artifact-extraction: +evidence typu postmortem (ekstrakcja /strategia i CMS, drugie użycie w pilocie). single-source-compiler: +evidence failure-mode (podwójny dryf) BEZ podbicia confidence skuteczności — projekt dowiózł mimo złamania zasady; doprecyzować failure_condition o "dryf przez pominięcie" i "git-vs-live przy deployu z folderu". compounding-channel: flaga too-broad + evidence częściowy. proof-first-demo-pitch: bez zmian (nierozstrzygnięte, wariant doradczy niezdefiniowany w karcie — flaga). Dedupe per projekt: nie sumować z ewentualną narracją skanu CKO tego samego projektu.
8. **Nowe hipotezy:** living-hub-cms i secret-sprawl (pkt 5); dodatkowo hipoteza procesowa: "deploy z folderu zamiast z gita ⇒ nieunikniony dryf repo-vs-live" — kandydat na failure_condition w przyszłej karcie deploy/ops.
9. **Czego Genome nie wiedziało w T0:** że projekt narodzi się jako hosting brand-guide'ów i DOPIERO ewoluuje w hub (typ projektu na T0 był inny niż w rekonstrukcji); że hub wykształci CMS i że to CMS (nie /strategia sam) stanie się drugim aktywem ekstrahowanym do frameworku; klasa blokerów "scope konta Vercel" (personal_scope_not_allowed); wzorzec secret-sprawl.
10. **Jak następny projekt będzie lepszy:** (a) każdy T0-pack backtestu przechodzi guard chronologii: daty cytowanych artefaktów weryfikowane mtime/git PRZED napisaniem raportu Routera; (b) każdy "żywy hub" dostaje w workflow jawną decyzję "jak będzie edytowany" (CMS/rebuild/ręcznie) zamiast odkrywać to w miesiącu 3; (c) rekomendacja single-source dla projektów solo-własnych zawsze z fallbackiem minimalnym ("jeśli nie budujesz kompilatora, przynajmniej deployuj z gita"); (d) audyt bramek: żadne hasło innego systemu w treści strony.

## Evidence (propozycje do kart — zapis przez sesję główną + Ledger)

- E1 {observation: hub zbudowany ręcznie bez silnika i bez reużycia komponentu; bramka = 4. niezależna implementacja client-side (hash JS); proof: r352-deploy/index.html (checkPw, hash -1422286391), brak build-skryptów w repo, git log 13.04–15.06.2026; impact: potwierdzony failure mode compounding-channel (połowa "silnik"); proposed_change: podział karty na channel-discipline vs canonical-component-reuse; mechanisms: [compounding-channel]}
- E2 {observation: podwójny dryf — hubowe strony TB nie odzwierciedlają artefaktów z 19–20.07, a live zawiera uncommitted zmiany (deploy z folderu, nie z gita); proof: mtime TeamBudget-strategia-expanded.html 2026-07-20 vs tb-strategia.html 2026-07-14 (uncommitted M), memory/betterguide-deploy.md (~21.07), git status r352-deploy 09.08; impact: failure mode single-source potwierdzony w dwóch płaszczyznach, ale projekt dowiózł cel mimo to; proposed_change: failure_condition += "dryf przez pominięcie" i "deploy z folderu ⇒ dryf repo-vs-live"; mechanisms: [single-source-compiler]}
- E3 {observation: /strategia realnie wyekstrahowana do frameworku (spec + użycie w pilocie), ale szkielet HTML wciąż nie; proof: commit 1619504 (02.08.2026) spec/STRATEGIA-WZORZEC.md + commit 91adf63 (pilot Mała Palarnia), BACKLOG.md poz. "strategia-doc.html — jeszcze nie wyekstrahowany"; impact: potwierdzenie mechanizmu typu postmortem + wzorzec "destylat częściowy: spec tak, kod nie"; proposed_change: +evidence postmortem, failure_condition o częściowej ekstrakcji; mechanisms: [working-artifact-extraction]}
- E4 {observation: hub wykształcił CMS (cms.html + api/cms-*.js + chat.js), który stał się bazą szablonu CMS frameworku — klasa zdarzeń nieobecna w Genome; proof: git status r352-deploy (A cms.html, A api/cms-*.js), r352-framework/README.md linia "CMS (baza) | betterguide.pl/cms", spec/CMS-SPEC.md (02.08.2026); impact: luka pokrycia — Router nie ma mechanizmu "żywy hub → warstwa edycji"; proposed_change: hipoteza mech:living-hub-cms; mechanisms: []}
- E5 {observation: hasło do katalogu handlowego DailyFruits wyświetlone jawnie w treści hubu za słabszą bramką; proof: r352-deploy/index.html linia ~561 "Hasło: Katalog2026" (stan 09.08.2026); impact: nowa klasa ryzyka secret-sprawl, zaostrza znany problem bramek client-side; proposed_change: guard:secret-sprawl (kandydat); mechanisms: []}
- E6 {observation metodologiczna: pakiet T0 anachroniczny — cytował artefakty TeamBudget (tb-body.html→widoki) nieistniejące/późniejsze względem realnego startu projektu (13.04) i fazy hubowej (06); proof: git log r352-deploy (pierwsze commity 2026-04-13), mtime artefaktów TB 2026-07-19/20, mdfind: tb-body.html nie istnieje; impact: zawyżona wiarygodność evidence w rekomendacji single-source; obniża wagę nominalnego 6/6; proposed_change: guard chronologii T0 w PROTOKOL (weryfikacja dat źródeł przed przebiegiem A); mechanisms: [wszystkie]}
