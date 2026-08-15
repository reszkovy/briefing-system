# LLM Council — Manifest r352/FOTRA v2

Data: 2026-08-12

## Pytanie

Czy zrewidowany Manifest Operacyjny r352 oraz działająca Karta Decyzji i Portfela w FOTRA zasługują na ocenę powyżej 90 000 / 100 000 w kontekście celów właściciela?

## Zmiany oceniane przez Council

- progi: marża 50%, 8 h Przemka na inicjatywę, 24 h aktywnego portfela, wynik +4, maksymalnie jeden eksperyment;
- veto energii, uczciwości i sprawczości;
- owner, handoff, dowód popytu, reuse/produkt/retainer, koszt alternatywny, review do 30 dni i kill criteria;
- OVERDUE pozostaje aktywne, liczy godziny i blokuje nowe GO;
- rozliczenie prognoza–fakt: realna marża, godziny, interwencje, przychód bez delivery Przemka, reuse, handoff i wynik;
- obowiązkowe CONTINUE, REVISE albo KILL;
- dźwignia strategiczna -2..+2, typ aktywa oraz mierzalny dowód;
- historia kolejnych rozliczeń append-only.

## Doradcy — oceny po poprawkach

### Doradca A — 93 000

Próg 90 000 jest zasłużony dzięki działającej pętli sterowania: przeterminowane inicjatywy nadal obciążają portfel, blokada wymusza rozliczenie, a KILL zwalnia przepustowość. Największym ryzykiem pozostaje miękkie klasyfikowanie interwencji, reuse i niezależności od właściciela. Brakuje 30 dni realnych danych oraz kosztownego NO/KILL.

### Doradca B — 96 200

Najmocniejsze jest połączenie OVERDUE → blokada → obowiązkowe rozliczenie → CONTINUE/REVISE/KILL. Dźwignia strategiczna i mierzalny typ aktywa ograniczają puste uzasadnienia eksperymentów. Brakujące punkty wynikają z braku kalibracji i danych o obchodzeniu reguł.

### Doradca C — 96 400

Karta jest działającym mechanizmem zarządzania portfelem. Rozliczenie prognoza–fakt mierzy zależność od Przemka i produkuje dane do kalibracji. Dźwignia strategiczna usuwa nadmierną zachowawczość bez otwierania furtki dla fantazji. Trafność pozostaje do sprawdzenia.

### Doradca D — 97 200

Decyzja nie znika po terminie, a test pionowy potwierdza egzekucję. Do pełnej oceny brakuje dowodu behawioralnego: odrzuconej atrakcyjnej okazji, faktycznego KILL oraz spadku godzin i interwencji właściciela.

### Doradca E — 93 200

Pionowa ciągłość kwalifikacja → zobowiązanie → termin → blokada → rozliczenie → decyzja czyni z Karty system zarządczy. Główny wskazany defekt: kolejne rozliczenia nadpisywały wcześniejsze fakty. Defekt został następnie naprawiony.

## Peer review

Oceny: 92 400, 92 400, 92 400, 92 400, 91 800.

Wszyscy recenzenci uznali próg 90 000 za osiągnięty, ale odrzucili oceny 96–97 tys. jako przedwczesne. Wspólny rdzeń: istnieje egzekwowalna pętla decyzji. Najważniejszy kontrargument: poprawna mechanika nie gwarantuje odporności społecznej. Można łagodnie klasyfikować interwencje, reuse, handoff i statusy.

Wspólnym najwyżej ocenionym zarzutem było nadpisywanie rozliczeń. Po peer review wdrożono tablicę `reviews`, która zachowuje każde rozliczenie wraz z faktami, wariancją, decyzją i datą. Test dwóch kolejnych rozliczeń zachował CONTINUE i KILL.

## Werdykt przewodniczącego

### Where the Council Agrees

Manifest i Karta tworzą spójny system operacyjny zgodny z celem właściciela. Progi portfelowe, veta, koszt alternatywny, dowód, handoff, kill criteria i rozliczenie prognoza–fakt zamieniają ambicje w reguły.

### Where the Council Clashes

Spór dotyczy poziomu zaufania, nie jakości konstrukcji. Oceny 96–97 tys. zakładają niemal dojrzały system. Oceny 92–93 tys. uwzględniają brak działania pod realną presją klienta i pieniędzy.

### Blind Spots the Council Caught

Najważniejszą luką była utrata historii przez nadpisywanie rozliczeń. Została naprawiona. Pozostałe ryzyka są behawioralne: samooszukiwanie, obchodzenie statusów oraz unikanie kosztownego NO/KILL.

### The Recommendation

**94 600 / 100 000. Cel powyżej 90 000 został jednoznacznie osiągnięty.**

Ocena dotyczy jakości konstrukcji i gotowości systemu. Nie jest oceną udowodnionego wpływu na marżę, autonomię firmy ani odzyskany czas.

### The One Thing to Do First

Przeprowadzić 30-dniowy audyt bez wyjątków, obejmujący wszystkie aktywne decyzje. Najważniejszym dowodem będzie kosztowna sytuacja, w której właściciel podporządkuje się werdyktowi NO lub KILL mimo presji klienta albo własnego przywiązania.

## Weryfikacja techniczna

- składnia modułu: poprawna;
- diff: bez błędów whitespace;
- test pionowy: GO → OVERDUE → blokada → KILL → ponowne GO;
- test historii: dwa rozliczenia CONTINUE → KILL, oba zachowane;
- dane testowe działały w odizolowanym profilu przeglądarki i nie trafiły do profilu użytkownika.
