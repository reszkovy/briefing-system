# QA-REPORT — audyt kompletności i rzetelności researchu The Hermeticum

**Audytor:** krytyk kompletności/rzetelności (sesja 2026-08-14)
**Zakres:** INDEX.md + 7 dossier w `research/`
**Werdykt: BRAKI (niewielkie) — research jest solidny i publikowalny po poprawkach źródłowych; żadna luka nie podważa całości.**

---

## A. Próbka 10 twierdzeń faktograficznych — czy mają źródła z URL

Wylosowane twierdzenia (po ~1–2 z każdego dossier). Wszystkie 10 ma źródło z URL **i datą dostępu** — konwencja jest utrzymana konsekwentnie w całym korpusie.

| # | Twierdzenie | Plik | Źródło z URL? |
|---|---|---|---|
| 1 | Brak traktatu XV w Corpus Hermeticum = artefakt edytorski | ancient-texts §1.1 | ✅ Wikipedia |
| 2 | Kompilacja CH poświadczona najpierw u Psellosa (XI w.) | ancient-texts §1.4 | ✅ Wikipedia + BPhV |
| 3 | Sirr al-khaliqa: datowania Ruska/Kraus/Weisser | emerald §1 | ✅ Wikipedia, Britannica |
| 4 | Newton, Keynes MS 28: przekład + komentarz, chronologia wg Dobbs | emerald §4 | ✅ Newton Project, Cambridge DL |
| 5 | Kybalion 1908, Yogi Publication Society, autorstwo Atkinsona | modern-occult §2 | ✅ Wikipedia, PRH |
| 6 | Golden Dawn: listy Sprengel = fabrykacja (Howe 1972) | modern-occult §3 | ✅ Encyclopedia.com, NWE |
| 7 | Oracja Pico niewygłoszona/niewydana za życia, tytuł pośmiertny | renaissance §3 | ✅ SEP |
| 8 | Casaubon 1614: argument filologiczny | renaissance §8 | ✅ Wikipedia, SciHi + Grafton 1983 |
| 9 | HHP Amsterdam od 1999, Hanegraaff profesorem | scholarship §5.1 | ✅ UvA |
| 10 | CH XIII: 10 mocy vs 12 udręk zodiaku | ideas-glossary §3 | ✅ Copenhaver + Harvard CSWR |

### Weryfikacja online 3 z nich (WebFetch, 2026-08-14)

1. **Tablica Szmaragdowa (emerald §1–2) — POTWIERDZONE z 1 rozbieżnością.** Wikipedia „Emerald Tablet" faktycznie podaje: pierwsze poświadczenie w *Sirr al-khaliqa* (pseudo-Apoloniusz/Balinas); datowania Kraus 813–833, Weisser c. 750–800, Ruska VI–VIII w.; „as above, so below" jako parafrazę spopularyzowaną przez Blavatską. **Rozbieżność:** dossier cytuje wulgatę „ad **perpetranda** miracula rei unius", Wikipedia ma „Ad **preparanda** miracula". Oba warianty występują w tradycji rękopiśmiennej, ale skoro to ma być side-by-side na stronie kroku 06 — przed publikacją ustalić wariant wg wydania krytycznego (Steele & Singer 1928), nie wg Wikipedii.
2. **Kybalion (modern-occult §2) — POTWIERDZONE z 1 luką źródłową.** Wikipedia potwierdza: 1908, Yogi Publication Society, „Three Initiates", atrybucja Atkinsonowi, cytowani Deslippe 2011 / Chapel 2013 / Smoley 2018 / Horowitz 2019. **ALE:** kluczowy dowód „Atkinson sam wpisał książkę do Who's Who in America 1912" **nie występuje w cytowanym źródle** (Wikipedia go nie podaje). Fakt jest niemal na pewno prawdziwy (dokumentuje go Deslippe 2011), ale w dossier wisi na źródle, które tego nie mówi — a to flagowy hook nr 3 w INDEX. Podmienić cytowanie na Deslippe wprost.
3. **Newton / Keynes MS 28 (emerald §4) — POTWIERDZONE w całości.** Rekord Newton Project ALCH00017: Keynes Ms. 28, King's College Cambridge, tekst łaciński + przekład angielski + komentarz do Tabula Smaragdina; chronologia wg Dobbs (kopia łaciny wczesne 1680s, przekład ang. późne 1680s/wczesne 1690s) zgodna z dossier co do joty.

**Wniosek A:** dyscyplina źródłowa jest realna, nie deklaratywna. Problemem nie jest brak źródeł, lecz **jakość części z nich** (patrz C1).

---

## B. Rozdzielenie warstw FACT / DEBATE / MYTH

**Ocena: bardzo dobre.** Wszystkie dossier stosują trójwarstwę konsekwentnie, spory mają nazwiska po obu stronach (Festugière vs Fowden/Bull; Kraus vs Sezgin; Yates vs Westman/Copenhaver/Hanegraaff; Dobbs vs Newman), a mity są aktywnie obalane, nie tylko pomijane. Wzorcowe zabiegi: oznaczanie źródeł bibliofilskich jako „reception-grade" (ancient-texts §4), cytowanie TikToka wyłącznie jako recepcji, uczciwe flagi `[standard scholarly dating]` w renaissance.md.

Naruszenia/zatarcia (drobne):

1. **bibliography.md §1.1 (Scott):** wewnątrz bulletu FACT wpleciony „**SCHOLARLY DEBATE marker**" — warstwa DEBATE wchodzi do FACT zamiast osobnej sekcji. Formalnie najwyraźniejsze naruszenie konwencji.
2. **bibliography.md §5–7:** ścieżka czytelnicza i „czego unikać" nie mają warstw w ogóle — akceptowalne (to kuracja, nie fakty), ale INDEX deklaruje konwencję dla „wszystkich dossier", więc warto to jawnie zaznaczyć w nagłówku pliku.
3. **ideas-glossary.md §11 FACT:** źródło „search-verified via NYRB/Cambridge discussions" — nieweryfikowalny odsyłacz w warstwie FACT (dla twierdzenia, że Pico otwiera Orację cytatem z Asclepiusa; fakt łatwy do podparcia samym tekstem Oracji).
4. **ideas-glossary.md §2 FACT:** teza Fowdena sourcowana do… Goodreads. Fakt prawdziwy, źródło poniżej standardu warstwy FACT.
5. **renaissance.md §6 (Paracelsus):** cały FACT na `[standard scholarly account]` bez URL (brak wpisu SEP odnotowany uczciwie) — flagowane w INDEX, OK, ale to jedyna sekcja bez ani jednego działającego URL w warstwie FACT.

Nie znalazłem przypadku odwrotnego (mit lub spór podany jako fakt) — to najważniejsze.

---

## C. Braki względem pozycjonowania „serious history, real sources"

Testy „czerwonych flag" z brief-u: **krytyka Yates — JEST** (scholarship §2, osobna sekcja z demontażem i tym, co przetrwało); **status Kybalionu — JEST** (modern-occult §2, autorstwo rozstrzygnięte, z niuansem Smoley/Horowitz). Sekcja LUKI w INDEX jest uczciwa i sama wymienia większość braków. Braki realne:

1. **Fundament na Wikipedii dla twierdzeń nośnych.** Trzy flagowe tematy serwisu (Corpus Hermeticum, Tablica Szmaragdowa, Kybalion) opierają najważniejsze fakty na Wikipedii, a nie na cytowanych przez nią pracach (Copenhaver intro, Ruska/Weisser, Deslippe). INDEX odnotowuje to w luce 9, ale traktuje jako „pogłębienie" — dla serwisu, którego całą marką jest „real sources", to warunek publikacji, nie nice-to-have. Konkretne objawy wykryte w audycie: wariant łaciny wulgaty niezgodny z własnym źródłem; Who's Who 1912 bez pokrycia w cytowanym źródle.
2. **Sześć luk blokujących strony ze STRUKTURY** (INDEX §4: Alexandria/Path 03, Musaeum Hermeticum, Great Work, Hermetic vs Hermeneutic, Zosimos, Thoth) — poprawnie zidentyfikowane, ale dwie z nich (Alexandria — krok tygodni 1–2; Great Work — osłabia Path 09) leżą na ścieżce krytycznej produkcji.
3. **Brak dossier o antycznych technical Hermetica jako takich** (astrologiczne Hermetica, greccy alchemicy poza jedną wzmianką o Zosimosie). Serwis obiecuje „no fortune-telling", więc strona wyjaśniająca, czym *była* hermetyczna astrologia/alchemia antyczna, to naturalny brakujący kontrapunkt — obecnie temat rozpuszczony w §9 glosariusza.
4. **Warstwa cytatów i obrazów** (INDEX luki 10–11): bez decyzji o cytowaniu (własne przekłady vs PD Mead z adnotacją) i bez przeglądu ikonografii z prawami strony per-traktat i newsletter nie mają czym mówić i czym ilustrować.
5. Drobne: recepcja patrystyczna (Laktancjusz/Augustyn) tylko przelotnie; brak notki o polityce linkowania do archive.org vs prawa autorskie poza EN/US (site celuje w EN, więc niski priorytet).

---

## D. Konkretność content hooks

**Ocena: bardzo dobra.** ~60 hooków, z czego TOP 20 w INDEX; niemal każdy ma: konkretny fakt-zaczep (data, nazwisko, dokument), twist, wskazanie pliku+numeru hooka źródłowego i mapowanie na krok Ścieżki (dual-publish). Hooki 1–3, 7, 11, 12 są gotowe do pisania od ręki. Jedyna uwaga: hooki 3 (Kybalion/Who's Who) i 2 (łacina wulgaty) opierają się dokładnie na dwóch twierdzeniach z problemami źródłowymi z sekcji A — naprawić źródła zanim pójdą w świat, bo to właśnie te teksty będą najmocniej sprawdzane przez czytelników.

---

## E. Trzy najważniejsze poprawki (w kolejności)

1. **Podbić źródła twierdzeń nośnych z Wikipedii/blogów do literatury akademickiej przed publikacją hubów i hooków 1–3.** Minimum: łacina wulgaty wg Steele & Singer 1928 (rozstrzygnąć „perpetranda/preparanda"), Who's Who 1912 → Deslippe 2011 bezpośrednio, fakty o CH → intro Copenhavera (strony!), datowania Tablicy → Weisser 1980/Kraus via Ebeling 2007. Usunąć Goodreads i „search-verified" z warstw FACT.
2. **Domknąć dwie luki z krytycznej ścieżki produkcji: dossier „Alexandria" (Path 03, tygodnie 1–2) i „The Great Work/Magnum Opus" (Path 09 + strona Ideas)** — reszta luk (Musaeum Hermeticum, Zosimos, Thoth, Hermetic vs Hermeneutic) może iść równolegle z pisaniem wcześniejszych kroków.
3. **Podjąć decyzję redakcyjną o cytatach źródłowych i ikonografii** (własne tłumaczenia vs PD Mead z adnotacją; przegląd skanów PD z Cambridge DL/Internet Archive z prawami) — to jedyny brak, który blokuje jednocześnie strony per-traktat, huby i newsletter.

---
*Metoda audytu: pełna lektura INDEX.md i 7 dossier; próbka 10 twierdzeń; weryfikacja online 3 twierdzeń (Wikipedia „Emerald Tablet", Wikipedia „The Kybalion", Newton Project ALCH00017) 2026-08-14.*
