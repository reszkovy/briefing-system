# Caterelo: audyt UX pod Wave by Vento

Data audytu: 12 sierpnia 2026  
Zakres: landing Caterelo, aplikacja Caterelo, strona Deal Radar, panel wtyczki i proponowany tryb eventowy  
Cel: efekt wow podczas rozmowy 1:1 lub krótkiego demo bez utraty wiarygodności danych  
Poza zakresem: implementacja, redesign całej platformy, Web Summit, nowe kraje i nowe modele scoringowe

## 0. Metoda i ograniczenia

Audyt powstał na podstawie:

- inspekcji działającego caterelo.com,
- przejścia przez landing, aplikację i stronę Deal Radar,
- analizy architektury informacji oraz tekstów interfejsu,
- analizy panelu i logiki prezentacyjnej wtyczki,
- porównania obietnic marketingowych z widocznymi opisami źródeł i confidence,
- oceny ścieżki w warunkach eventowych: krótka uwaga, hałas, ekran laptopa, słaby internet i rozmowa 1:1.

To jest audyt ekspercki, nie badanie użytkowników. Oceny dotyczące zrozumienia i konwersji są hipotezami do potwierdzenia testem pięciu osób opisanym w sekcji 14. Nie wykonano zmian w produkcie.

## 1. Werdykt

Caterelo ma materiał na bardzo dobre demo, ale obecnie nie ma jednej eventowej historii.

Landing sprzedaje szeroką platformę relokacyjną. Aplikacja zaczyna od mapy i eksploracji 90 regionów. Deal Radar obiecuje natychmiastową ocenę konkretnego ogłoszenia. Każda z tych powierzchni ma sens oddzielnie, ale razem wymagają od prowadzącego zbyt wielu wyjaśnień.

Najmocniejszym produktem eventowym jest nie dashboard i nie sam score. Jest nim krótka sekwencja:

> Mam ogłoszenie, którego nie potrafię ocenić -> podaję trzy fakty -> dostaję zrozumiałe porównanie -> wiem, co sprawdzić dalej.

Rekomendacja: przygotować oddzielny tryb eventowy oparty na istniejącej logice. Nie przebudowywać przed Turynem całej aplikacji.

### Ocena obecna

| Obszar | Ocena | Komentarz |
|---|---:|---|
| Siła problemu | 91/100 | Zagraniczne ogłoszenie i brak lokalnego punktu odniesienia to czytelny problem wysokiej stawki. |
| Pierwsze 10 sekund | 54/100 | Landing mówi o relokacji, aplikacja o regionach, a Deal Radar o ogłoszeniu. Brakuje jednego wejścia. |
| Moment wow | 73/100 | Kolorowy werdykt i porównanie ceny mają potencjał, lecz panel jest zbyt gęsty i mały do prezentacji. |
| Zrozumiałość wyniku | 63/100 | Score przyciąga uwagę, ale nie odpowiada od razu: jaka cena, jaki benchmark, jaka różnica i dlaczego. |
| Wiarygodność | 48/100 | Interfejs ma disclaimery, lecz marketing używa szerszych obietnic niż pozwala obecny poziom danych. |
| Płynność demo | 46/100 | Portal, wtyczka, onboarding i internet tworzą za dużo punktów awarii. |
| Konwersja po demo | 57/100 | Obecne CTA prowadzą do early access, premium lub aplikacji. Brakuje naturalnego "wyślij mi ten raport". |
| Czytelność na ekranie eventowym | 51/100 | Panel wtyczki ma 320 px szerokości i tekst 9-12 px. Z dwóch metrów będzie nieczytelny. |
| Gotowość na Turyn | 58/100 | Produkt ma dobry rdzeń, ale wymaga osobnego scenariusza i zamrożonych danych demo. |

Po wdrożeniu P0 realny cel to 82-88/100 gotowości eventowej.

## 2. Co już działa

### Problem jest natychmiast rozpoznawalny

Pytanie "Is this listing overpriced?" jest mocniejsze eventowo niż ogólne "Where should I relocate?". Jest konkretne, dotyczy decyzji wartej setki tysięcy euro i nie wymaga znajomości kategorii produktu.

### Deal Radar daje wizualny kontrast

Werdykty STRONG DEAL, GOOD PRICE, MARKET PRICE i OVERPRICED tworzą szybkie rozpoznanie. Cena za metr, benchmark oraz procentowa różnica są dobrymi składnikami raportu.

### Warstwa ostrożności już istnieje

Panel ma confidence, wykrywa coarse benchmark, pokazuje źródło, datę benchmarku i zastrzeżenie "not a valuation". To dobra baza. Problemem jest hierarchia i marketing, nie całkowity brak mechanizmów zaufania.

### Styl wizualny jest charakterystyczny

Ciemny granat, limonkowy akcent i mocna typografia odróżniają Caterelo od portali ogłoszeniowych. Nie jest potrzebny rebranding przed eventem.

## 3. Krytyczne problemy

### P0.1: Trzy różne obietnice produktu

Landing obiecuje znalezienie miejsca do życia i porównanie 90 regionów. Aplikacja otwiera się mapą Europy, rankingiem krajów i wskaźnikami. Deal Radar obiecuje werdykt dla ogłoszenia w sekundę.

Skutek: po prezentacji uczestnik może pamiętać mapę lub liczbę 90 regionów, ale nie umieć powiedzieć, do czego Caterelo służy dziś.

Rekomendacja: eventowa obietnica nadrzędna:

> Caterelo helps you check whether a foreign property listing looks fairly priced, how reliable that comparison is, and what to verify next.

Dashboard należy przedstawić dopiero jako szerszy kontekst decyzji.

### P0.2: Pierwszy ekran aplikacji opóźnia wartość

Nowy użytkownik widzi jednocześnie:

- pasek bety z licznikiem,
- logo i wybór kontynentu,
- kraje "soon",
- Enter Code,
- mapę,
- przełączniki 1Y/5Y/10Y,
- Market Trends/Living Index,
- ranking krajów,
- dwa CTA,
- trzyetapowy onboarding na wierzchu.

To jest poprawne dla narzędzia eksploracyjnego, ale złe dla demo. Prowadzący musi najpierw zamknąć onboarding lub go tłumaczyć, a dopiero później szukać wartości.

Rekomendacja: osobny adres lub parametr eventowy, który pomija onboarding i wszystkie globalne elementy aplikacji.

### P0.3: Score jest ważniejszy niż dowód

Panel wtyczki zaczyna od dużej liczby 0-100, etykiety i confidence. Cena za metr, oczekiwana cena i różnica są niżej.

Skutek: uczestnik widzi "84", lecz nie wie, co dokładnie oznacza i dlaczego ma temu ufać. Dodatkowo score może być odbierany jako precyzyjna wycena.

Rekomendowana hierarchia:

1. werdykt słowny,
2. cena ofertowa za m2,
3. przedział benchmarku,
4. różnica procentowa,
5. confidence i jego przyczyny,
6. score jako drugorzędny sygnał albo całkowicie poza głównym demo.

### P0.4: Obietnice marketingowe są szersze niż dowody

Ryzykowne obecne sformułowania:

- "Know in one second",
- "on every listing",
- "What you get on every listing",
- kalibracja do urzędów wymieniona tak, jakby każdy lokalny benchmark był bezpośrednio urzędowy,
- "Real numbers, not vibes" przy części benchmarków opisanych w produkcie jako approximate.

Landing Caterelo dodatkowo deklaruje "No listings", podczas gdy Deal Radar jest produktem działającym na listingach. Formalnie można to obronić jako brak marketplace, ale komunikacyjnie tworzy sprzeczność.

Rekomendacja: obietnica powinna dotyczyć detekcji anomalii i dostępnych benchmarków, nie pewnej wyceny.

### P0.5: Główny przykład jest włoski

Pierwsza przykładowa karta na stronie Deal Radar pokazuje Mediolan jako STRONG DEAL. Event odbywa się we Włoszech, a włoskie dane są najsłabszym elementem obecnej narracji o regionalnych benchmarkach.

Skutek: lokalny odbiorca może zacząć dyskusję od liczb dla własnego rynku. Całe demo zostaje sprowadzone do obrony benchmarku.

Rekomendacja: zastąpić trzy publiczne przykłady przykładami hiszpańskimi o zweryfikowanej spójności. Główny przykład: Madryt. Rezerwa: Andalucía, Cataluña, Canarias.

### P0.6: Panel wtyczki jest nieczytelny podczas prezentacji

Panel ma szerokość 320 px. Istotne elementy używają tekstu 9-12 px. W jednej powierzchni mieszczą się wynik, werdykt, cztery liczby, wykres, flagi, persony, insighty, paywall, kod dostępu i stopka.

Skutek: działa jako narzędzie osobiste na laptopie, ale nie jako ekran pokazywany rozmówcy lub grupie.

Rekomendacja: główny moment wow realizować w Mini Deal Report. Wtyczkę pokazywać przez maksymalnie 10 sekund jako dowód dystrybucji tej samej logiki.

### P0.7: Brakuje końca historii

Obecne CTA to m.in. Explore Regions, Personalize, Enter Code, Get early access, Unlock Pro i Add to Chrome. Żadne nie domyka sytuacji "właśnie zobaczyłem wynik mojego ogłoszenia".

Rekomendacja: główna konwersja eventowa:

> Send me this report

Email powinien pojawić się dopiero po uzyskaniu wartości. Prośba o raport jest jednocześnie najlepszą metryką eventu.

## 4. Problemy wysokiego priorytetu

### P1.1: Confidence jest etykietą bez uzasadnienia

"Confidence: medium" nie mówi użytkownikowi, co jest pewne, a czego brakuje.

Rekomendacja: obok poziomu pokazać 2-3 przyczyny, na przykład:

- region confirmed,
- neighbourhood not confirmed,
- condition provided manually,
- regional rather than street-level benchmark.

### P1.2: Język popycha do działania zbyt mocno

Przykłady "book a viewing this week" i "move fast" wykraczają poza neutralne wykrywanie anomalii. Przy ograniczonej pewności danych brzmią jak rekomendacja inwestycyjna.

Rekomendacja:

- zamiast "book a viewing this week": "worth a closer check",
- zamiast "move fast": "compare the full terms before deciding",
- zamiast "strong deal": rozważyć "priced below benchmark" w raporcie zewnętrznym.

Etykiety emocjonalne mogą zostać we wtyczce, ale raport musi mówić językiem dowodów.

### P1.3: Za dużo person i funkcji w jednym momencie

Buyer, Investor i Renter zmieniają priorytety insightów. Jest to wartościowe później, lecz podczas demo poszerza rozmowę.

Rekomendacja: demo tylko dla home buyer. Inwestor i renter poza ścieżką eventową.

### P1.4: Paywall przecina wyjaśnienie wyniku

Wtyczka pokazuje listę zablokowanych funkcji, cenę, okres 90 dni i pole na kod przed stopką źródłową.

Skutek: zaufanie i zrozumienie konkurują z monetyzacją.

Rekomendacja: event mode bez paywalla. Dopiero po wysłaniu raportu można pokazać informację o rozszerzeniu lub dostępie.

### P1.5: Globalne dane dominują nad lokalną decyzją

Liczby "6 countries", "90 regions", "13 signals" i "60+ sources" są wielokrotnie powtarzane. Budują skalę, ale nie dowodzą poprawności konkretnego raportu.

Rekomendacja: w demo zastąpić skalę śladem dowodowym dla konkretnego wyniku. Skala pojawia się dopiero na końcu jako zdanie: "The same decision layer extends across Caterelo's regional platform."

## 5. Docelowa architektura eventowa

### Zasada

Jeden ekran, jedna decyzja, jeden raport.

### Przepływ

```text
[Start]
Is this property fairly priced?
Paste URL or open prepared example
        |
        v
[Confirm]
Portal and country recognised
Confirm: price, size, location
Optional: improve accuracy
        |
        v
[Report]
Verdict + price position
Evidence confidence
What could change the result
Questions for the agent
        |
        v
[Conversion]
Send me this report
```

### Czego przepływ nie robi

- nie pobiera strony portalu po stronie serwera,
- nie udaje automatycznego odczytu danych,
- nie wymaga instalacji wtyczki,
- nie wymaga konta,
- nie otwiera dashboardu przed raportem,
- nie sprzedaje score jako wyceny.

## 6. Wireframe 1: wejście

```text
+--------------------------------------------------------------+
| CATERELO                                      Evidence-based |
|                                                              |
| Is this property fairly priced?                              |
|                                                              |
| Paste a Southern European listing. Confirm the key details.  |
| Get an evidence-based price check in under a minute.         |
|                                                              |
| [ https://idealista.com/...                              ]    |
| [ Check this listing ]   [ Try a Madrid example ]            |
|                                                              |
| No scraping. You confirm the listing details before analysis.|
+--------------------------------------------------------------+
```

Zasady:

- brak głównej nawigacji,
- brak paska bety i licznika,
- brak cennika,
- jeden dominujący przycisk,
- przygotowany przykład zawsze dostępny,
- całość widoczna bez przewijania na 1366 x 768.

## 7. Wireframe 2: potwierdzenie danych

```text
+--------------------------------------------------------------+
| Idealista | Spain | Listing recognised                       |
|                                                              |
| Confirm what the listing says                                |
|                                                              |
| Asking price        [ EUR 348,000 ]                           |
| Property size       [ 80 m2       ]                           |
| City or region      [ Madrid      v]                          |
|                                                              |
| [ Improve accuracy v ]                                       |
|                                                              |
| [ Generate Deal Report ]                                     |
|                                                              |
| We analyse the details you confirm. We do not fetch the page.|
+--------------------------------------------------------------+
```

Po rozwinięciu "Improve accuracy": neighbourhood, condition, floor, elevator.

Nie używać etykiety "AI extracted" ani animacji sugerującej analizę treści strony.

## 8. Wireframe 3: Mini Deal Report

```text
+--------------------------------------------------------------+
| MADRID | HOME BUYER                         Updated: 2025 Q4  |
|                                                              |
| WORTH A CLOSER CHECK                                         |
|                                                              |
| EUR 4,350/m2             Benchmark: EUR 4,700-5,100/m2        |
| Asking price is about 9% below the benchmark midpoint.       |
|                                                              |
| PRICE POSITION                  EVIDENCE CONFIDENCE: MEDIUM   |
| |----benchmark range----|       + Region confirmed           |
|        ^ asking                 + Size and price confirmed    |
|                                 - Neighbourhood unconfirmed   |
|                                                              |
| WHAT COULD CHANGE THIS RESULT   ASK THE AGENT NEXT            |
| 1. Exact neighbourhood          1. Last renovation date?      |
| 2. Property condition           2. Community charges?         |
| 3. Legal/occupancy status       3. Registered usable area?    |
|                                                              |
| Detects pricing anomalies. Does not certify market value.    |
| [ Send me this report ]       [ See sources ]                 |
+--------------------------------------------------------------+
```

Wynik nie może wymagać przewijania. Pełna metodologia może otworzyć się w panelu bocznym lub nowym widoku.

## 9. Rekomendowane copy

### Ekran wejściowy

Nagłówek:

> Is this property fairly priced?

Opis:

> Paste a Southern European listing. Confirm the key details. Get an evidence-based price check in under a minute.

CTA:

> Check this listing

Demo CTA:

> Try a Madrid example

Nota:

> No scraping. You confirm the listing details before analysis.

### Potwierdzenie

Nagłówek:

> Confirm what the listing says

Status:

> Idealista · Spain · Listing recognised

CTA:

> Generate Deal Report

### Raport

Preferowane werdykty:

- Priced below benchmark
- Within benchmark range
- Priced above benchmark
- Insufficient local evidence

Można dodać bardziej ludzką linię drugorzędną:

- Worth a closer check
- Price looks broadly typical
- The premium needs an explanation
- Add a more precise location to continue

### Confidence

- High evidence confidence
- Medium evidence confidence
- Low evidence confidence
- Insufficient data

Nie stosować procentowego confidence ani kolejnego score.

### Zastrzeżenie

> Detects pricing anomalies. Does not certify market value. Verify the property, legal status and local comparable sales before deciding.

### Konwersja

> Send me this report

Po wysyłce:

> Report sent. It includes the benchmark, evidence notes and questions for the agent.

## 10. Scenariusz prezentacji

### Wersja 90 sekund

**0-10 sekund**

> Have you ever found a foreign property and had no idea whether the asking price made sense?

**10-25 sekund**

> Caterelo compares the listing with the market evidence we actually have. It also shows when that evidence is not precise enough.

Wklejenie przygotowanego linku lub użycie przykładu madryckiego.

**25-40 sekund**

Potwierdzenie ceny, metrażu i lokalizacji.

> We do not scrape the portal. You confirm the three facts that drive the comparison.

**40-55 sekund**

Generowanie raportu. Status pokazuje tylko prawdziwe kroki:

- Recognising portal
- Matching region
- Comparing available benchmark

**55-75 sekund**

> This listing asks EUR 4,350 per square metre. The available benchmark is EUR 4,700 to 5,100. That makes it worth checking, but not automatically a bargain.

**75-90 sekund**

> Confidence is medium because we know the region, price and size, but not the exact neighbourhood. Caterelo tells you what could change the answer and what to ask the agent next.

CTA:

> Want me to send you this report?

### Drugi akt: wtyczka, 10 sekund

> The same decision layer can appear directly while you browse.

Pokazać panel dla dokładnie tego samego ogłoszenia. Wartości muszą być identyczne z raportem.

## 11. Dane demonstracyjne

### Główny przykład

- kraj: Spain,
- region: Madrid,
- tryb: home buyer,
- ogłoszenie: przygotowane i zarchiwizowane,
- wynik: interesujący, ale bez ekstremalnej różnicy,
- confidence: Medium lub High,
- minimum dwa sensowne pytania do agenta.

### Rezerwy

- Andalucía,
- Cataluña,
- Canarias.

### Zakazane w głównym demo

- Włochy,
- Comunidad Valenciana,
- ogłoszenie znalezione spontanicznie podczas eventu,
- wynik oparty wyłącznie na szerokim regionalnym zakresie,
- przykład ze score zależnym od niepotwierdzonego stanu nieruchomości.

## 12. Macierz spójności

Dla każdego przykładu przygotować tabelę odbiorczą:

| Pole | Event report | Aplikacja | Wtyczka | Status |
|---|---:|---:|---:|---|
| Asking EUR/m2 | identyczne | identyczne | identyczne | PASS/FAIL |
| Benchmark min | identyczne | identyczne | identyczne | PASS/FAIL |
| Benchmark max | identyczne | identyczne | identyczne | PASS/FAIL |
| Różnica % | identyczna reguła | identyczna reguła | identyczna reguła | PASS/FAIL |
| Werdykt | ten sam sens | ten sam sens | ten sam sens | PASS/FAIL |
| Confidence | ten sam poziom | ten sam poziom | ten sam poziom | PASS/FAIL |
| Źródło i data | zgodne | zgodne | zgodne | PASS/FAIL |

Jakikolwiek FAIL blokuje użycie przykładu na scenie.

## 13. Plan awaryjny

Demo nie może zależeć od portalu ani dobrego Wi-Fi.

Potrzebne są cztery poziomy:

1. działający tryb online,
2. przygotowany przykład dostępny lokalnie w aplikacji,
3. zapisany wynik raportu dostępny jednym kliknięciem,
4. 20-sekundowy film pokazujący wtyczkę na tym samym ogłoszeniu.

Prowadzący nigdy nie powinien czekać na zewnętrzny portal. Po dwóch sekundach bez odpowiedzi przechodzi do przygotowanego przykładu.

## 14. Test pięciu osób

Testować na osobach, które nie znają Caterelo. Bez wcześniejszego tłumaczenia produktu.

### Zadanie

> You found this apartment while considering a move to Madrid. Use Caterelo to decide what you should check before contacting the agent.

### Pytania po teście

1. What does Caterelo do?
2. Is the listing definitely worth buying?
3. Why is the confidence Medium?
4. What should you ask the agent?
5. Where did the benchmark come from?

### Warunki zaliczenia

- 4/5 osób rozumie produkt w 10 sekund,
- 4/5 potrafi wygenerować raport bez pomocy,
- 4/5 nie interpretuje wyniku jako certyfikowanej wyceny,
- 4/5 potrafi wyjaśnić confidence,
- 3/5 spontanicznie deklaruje chęć zachowania lub wysłania raportu,
- mediana czasu do raportu jest poniżej 60 sekund.

## 15. Priorytety dla Claude'a

### P0: blokery eventu

1. Oddzielny tryb eventowy bez dashboardu i onboardingu.
2. Flow URL -> potwierdzenie trzech danych -> Mini Deal Report.
3. Hierarchia wyniku oparta na cenie, benchmarku, różnicy i confidence.
4. Jasne przyczyny confidence.
5. Zamrożony przykład madrycki oraz trzy rezerwy.
6. Pełna spójność event report, aplikacja i wtyczka.
7. Usunięcie ryzykownych obietnic "one second" i "every listing".
8. Usunięcie włoskiego przykładu z głównej strony Deal Radar.
9. Tryb awaryjny bez portalu i bez internetu.
10. CTA "Send me this report" po wyniku.

### P1: mocne podniesienie jakości

1. Responsywny raport na telefonie.
2. Panel źródeł i dat dla raportu.
3. Pięć pytań do agenta zależnych od danych ogłoszenia.
4. Krótki zapis działania wtyczki.
5. Pomiar wygenerowania i wysłania raportu.
6. Test pięciu osób i poprawki po obserwacji.

### P2: po Turynie

1. Włączenie flow do głównego landingu.
2. Przebudowa relacji między Deal Radar a dashboardem.
3. Rozszerzenie przykładów i krajów po przejściu bramki danych.
4. Monetyzacja raportów i analiza retencji.
5. Plan Web Summit oparty na obserwacjach z Wave.

## 16. Lista zamrożeń

Do eventu nie rozwijać:

- Decision Confidence Score,
- nowego LifeTrend lub Match Score,
- Local Solvers marketplace,
- płatnych pakietów lokalnej walidacji,
- nowych krajów,
- nowych modułów AI,
- API i MCP jako części demo,
- pełnego automatycznego pobierania ogłoszeń,
- rozbudowy Chrome Web Store jako blokera,
- redesignu całego dashboardu,
- planu Web Summit.

## 17. Kryteria odbioru końcowego

Tryb eventowy można uznać za gotowy tylko wtedy, gdy:

- pierwsza wartość pojawia się bez logowania,
- nowa osoba rozumie ofertę w 10 sekund,
- raport powstaje w mniej niż 60 sekund,
- wynik mieści się na ekranie 1366 x 768 bez przewijania,
- wszystkie istotne teksty mają co najmniej 14 px podczas demo,
- nie ma zależności od działającej strony portalu,
- przygotowany przykład działa offline lub z lokalnego snapshotu,
- aplikacja, raport i wtyczka pokazują identyczne liczby,
- confidence ma konkretne uzasadnienie,
- źródło i data są widoczne bez szukania w metodologii,
- użytkownik nie może pomylić wyniku z wyceną,
- po wyniku istnieje jedno dominujące CTA: wysłanie raportu,
- przeprowadzono test pięciu osób,
- prowadzący ma gotowy scenariusz i wersję awaryjną.

## 18. Ostateczna rekomendacja

Nie próbować wygrać eventu liczbą funkcji. Wygrać momentem, w którym uczestnik widzi własny problem opisany prostą różnicą:

> Asking: EUR X/m2. Available benchmark: EUR Y-Z/m2. Evidence confidence: Medium. Here is what could change the answer.

To jest efekt wow właściwy dla Caterelo: nie magia i nie fałszywa pewność, tylko szybkie przejście od zagranicznego ogłoszenia do lepszej decyzji.
