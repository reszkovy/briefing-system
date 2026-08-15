# Oferta dla DiMedical — wdrożenie za case

Cel: oddać serwis za darmo, w zamian za prawo pokazywania go jako realizacji
w branży diagnostycznej.

---

## Wiadomość (gotowa do wysłania)

**Temat:** Przebudowałem stronę DiMedical — jest online, chcę Wam ją oddać

Dzień dobry,

nazywam się Przemek Reszke, projektuję serwisy internetowe. Przebudowałem stronę
DiMedical w całości — nie jako propozycję do wyceny, tylko jako gotowe wdrożenie,
które chcę Wam przekazać.

**Podgląd:** https://dimedical.vercel.app

Zanim zaczniecie klikać, jedna rzecz, którą warto sprawdzić u siebie. Na obecnej
stronie polski i angielski tekst są sklejone w jednym miejscu — wyszukiwarki
i czytniki ekranu widzą to jako jeden ciąg. Wystarczy wejść na dimedical.pl,
zjechać do stopki i spojrzeć na nagłówek nad logotypami partnerów:

> WSPÓŁPRACUJEMY ZWE WORK WITH

To samo dzieje się na wszystkich 46 podstronach. Google indeksuje to dokładnie
w tej postaci.

Przy okazji przebudowy zmierzyłem resztę:

| | obecna strona | nowa |
|---|---|---|
| waga strony głównej | 1022 KB | **125 KB** |
| czas pełnego załadowania | 1190 ms | **404 ms** |
| strony z poprawnym nagłówkiem H1 | 25 z 46 | **wszystkie** |
| strony z opisem w wynikach Google | 2 z 46 | **wszystkie** |
| obrazy z zadeklarowanym rozmiarem | 5% | **100%** |
| oznaczenie wersji językowych (hreflang) | brak | **na każdej stronie** |

Ostatni wiersz z tabeli to powód, dla którego strona „skacze" podczas ładowania —
Google liczy to jako jeden z trzech głównych wskaźników jakości.

Cała treść jest przeniesiona 1:1 — sprawdzałem to blok po bloku, wyszło 356 z 357
fragmentów. Ten jeden to literówka („O potencjalne rozwojowym"), którą poprawiłem.
Doszły podstrony, których wcześniej nie było w nawigacji: każde badanie z listy
gruźliczej ma teraz własną stronę z opisem, wskazaniami i czasem oczekiwania.

**Warunki: przekazuję to bez wynagrodzenia.** Proszę w zamian o jedno — zgodę na
pokazywanie tej realizacji jako mojego portfolio, z nazwą DiMedical. Buduję
doświadczenie w diagnostyce laboratoryjnej i potrzebuję w tej branży punktu
odniesienia.

Jeśli chcecie to obejrzeć na spokojnie — mogę wpaść i przejść przez to razem,
albo odpowiedzieć na pytania mailem.

Pozdrawiam,
Przemek

---

## Wariant otwarcia, gdy chcesz powołać się na wcześniejszą współpracę

Powyższa wersja jest neutralna — przedstawiasz się jak ktoś z zewnątrz. Jeżeli
wolisz oprzeć się na tym, że projektowałeś pierwotny serwis, podmień pierwszy
akapit na:

> Dzień dobry,
>
> odzywam się w sprawie strony DiMedical — projektowałem jej pierwszą wersję.
> Wróciłem do niej po latach i przebudowałem ją w całości, nie jako propozycję
> do wyceny, tylko jako gotowe wdrożenie, które chcę Wam przekazać.

**Kiedy nie używać tej wersji:** jeśli tamta realizacja szła przez podmiot,
z którym nie chcesz być dziś kojarzony. Powołanie się na historię naturalnie
prowadzi do pytania „czyli pracowaliście wtedy jako…" — i rozmowa schodzi
na tory, na których nie chcesz jej prowadzić. Wersja neutralna omija to bez
tłumaczenia się.

---

## Do ustalenia na piśmie (choćby w mailu)

Nie potrzeba umowy, wystarczy potwierdzenie w korespondencji:

1. **Zakres tego, co darmowe** — przekazanie plików i jedna runda poprawek.
   Bez tego „za darmo" zamienia się w bezterminowe utrzymanie.
2. **Prawo do case'u** — nazwa DiMedical, zrzuty, opis zakresu, publikacja
   w portfolio i materiałach handlowych. To jest cena, więc musi paść wprost.
3. **Kto przejmuje hosting i domenę** — jeśli oni, to po ich stronie jest też
   utrzymanie; jeśli ty, to ustal, na jak długo.
4. **Referencja** — dwa zdania od dr. Majewskiego są warte więcej niż same zrzuty.
   Poprosić od razu, przy przekazaniu, kiedy wrażenie jest świeże.

---

## Do naprawienia przed wysłaniem

Dwie rzeczy, które przy ofercie „bierzcie, jest gotowe" zadziałają przeciwko.

### 1. Formularz kontaktowy nie wysyła
Waliduje pola i nic nie robi. To pierwsza rzecz, którą klika ktoś, kto ocenia
stronę własnej firmy. Do podpięcia backend (Formspree, Resend albo funkcja
na Vercelu).

### 2. Zdjęcia laboratorium są generowane
Wszystkie kadry z ludźmi w pracowni pochodzą z generatora — powstały jako
zapełniacz na czas budowy. Jeżeli DiMedical to wdroży, będzie publikować
zmyślone zdjęcia własnego laboratorium i własnego zespołu. Przed przekazaniem
trzeba je podmienić na prawdziwe albo poprosić o sesję.

To drugie warto powiedzieć im wprost przy przekazaniu — sami by to w końcu
zauważyli, a usłyszane od Ciebie brzmi jak rzetelność, nie jak wpadka.
