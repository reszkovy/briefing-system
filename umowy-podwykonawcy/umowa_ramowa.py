# -*- coding: utf-8 -*-
"""Treść umowy ramowej o współpracy podwykonawczej (z przeniesieniem praw autorskich)."""

from pola import POLA

BLOKI = [
("h1", "UMOWA RAMOWA O WSPÓŁPRACY PODWYKONAWCZEJ"),
("sub", "(zlecanie prac i przeniesienie praw autorskich)"),

("p", "zawarta w dniu ____________________ pomiędzy:"),

("p", "**{IMIE_NAZWISKO}**, prowadzącym działalność gospodarczą pod firmą **{FIRMA}**, wpisaną do "
      "Centralnej Ewidencji i Informacji o Działalności Gospodarczej, adres: {ADRES}, NIP: {NIP}, "
      "REGON: {REGON}, adres e-mail do doręczeń: {EMAIL},"),
("p", "zwanym dalej **Zamawiającym**,"),
("p", "a"),
("p", "____________________________________________, prowadzącym działalność gospodarczą pod firmą "
      "____________________________________________, adres: ____________________________________________, "
      "NIP: ____________________, adres e-mail do doręczeń: ____________________,"),
("p", "zwanym dalej **Wykonawcą**,"),
("p", "zwanymi łącznie **Stronami**, a każda z osobna **Stroną**."),

("h2", "§ 1. PRZEDMIOT UMOWY"),
("li", "Na mocy Umowy Zamawiający może zlecać Wykonawcy, a Wykonawca przyjmować do realizacji wykonanie prac "
       "z zakresu projektowania graficznego, animacji i materiałów wideo oraz projektowania i wdrażania rozwiązań "
       "cyfrowych (dalej: **Prace**), określanych każdorazowo w zamówieniach (dalej: **Zamówienia**) składanych "
       "zgodnie z § 2."),
("li", "Umowa ma charakter ramowy. Jej postanowienia stanowią treść stosunków prawnych powstałych w związku "
       "z przyjęciem przez Wykonawcę poszczególnych Zamówień. Umowa nie zobowiązuje Zamawiającego do złożenia "
       "określonej liczby Zamówień ani Zamówień o określonej wartości."),
("li", "Przedmiotem Umowy jest również przeniesienie przez Wykonawcę na Zamawiającego autorskich praw majątkowych do "
       "utworów powstałych w wykonaniu Zamówień, na zasadach określonych w § 6."),
("li", "Wykonawca oświadcza, że prowadzi działalność gospodarczą w zakresie objętym Umową oraz posiada wiedzę, "
       "doświadczenie, uprawnienia i narzędzia niezbędne do wykonania Prac, a także że nie istnieją przeszkody "
       "faktyczne ani prawne uniemożliwiające ich wykonanie."),
("li", "Umowa nie tworzy pomiędzy Stronami stosunku pracy, spółki ani przedstawicielstwa. Wykonawca wykonuje Prace "
       "samodzielnie, w wybranym przez siebie miejscu i czasie, na własny rachunek i ryzyko, przy użyciu własnych "
       "narzędzi, ponosząc odpowiedzialność wobec osób trzecich za rezultat swoich prac."),
("li", "Użyte w Umowie pojęcie **Klient** oznacza podmiot, na rzecz którego Zamawiający realizuje prace objęte danym "
       "Zamówieniem, a pojęcie **Materiały Źródłowe** – zasoby wskazane w § 7 ust. 1."),
("li", "**Materiały Własne Wykonawcy** to utwory i zasoby, do których prawa przysługują Wykonawcy, powstałe "
       "przed przyjęciem danego Zamówienia lub niezależnie od niego, a wykorzystane przez niego w efektach Prac – "
       "w szczególności własne biblioteki i komponenty kodu, szablony projektowe, presety, rigi, modele oraz "
       "narzędzia i skrypty pomocnicze."),

("h2", "§ 2. ZAMÓWIENIA"),
("li", "Zamówienia składane są w formie dokumentowej – wiadomością e-mail na adres Wykonawcy wskazany w komparycji "
       "albo za pośrednictwem narzędzia do zarządzania projektami wskazanego przez Zamawiającego. Za datę złożenia "
       "Zamówienia uznaje się datę wysłania wiadomości albo przypisania zadania Wykonawcy w tym narzędziu."),
("li", "Zamówienie określa co najmniej: zakres i specyfikację Prac, termin wykonania, wynagrodzenie lub sposób jego "
       "ustalenia, liczbę rund poprawek objętych wynagrodzeniem oraz wymagane Materiały Źródłowe i formaty plików. "
       "Wzór Zamówienia stanowi Załącznik nr 1 do Umowy."),
("li", "Wykonawca potwierdza przyjęcie Zamówienia albo zgłasza do niego zastrzeżenia w terminie 2 dni roboczych od "
       "jego złożenia. Brak potwierdzenia w tym terminie oznacza, że Zamówienie nie zostało przyjęte."),
("li", "Wykonawca ma prawo odmówić przyjęcia Zamówienia bez podania przyczyny, co nie stanowi naruszenia Umowy."),
("li", "Termin wykonania Prac biegnie od dnia potwierdzenia przyjęcia Zamówienia, chyba że Zamówienie stanowi "
       "inaczej. Jeżeli wykonanie Prac zależy od materiałów lub decyzji Zamawiającego, termin ulega przedłużeniu "
       "o czas opóźnienia w ich dostarczeniu."),
("li", "Zamawiający może odstąpić od Zamówienia w każdym czasie przed jego wykonaniem, składając oświadczenie "
       "w formie dokumentowej. W takim przypadku zapłaci Wykonawcy wynagrodzenie odpowiadające zakresowi prac "
       "wykonanych do dnia odstąpienia, a Wykonawca przekaże ich rezultat wraz z Materiałami Źródłowymi."),
("li", "Strony wyznaczają osoby do kontaktu: po stronie Zamawiającego ____________________, po stronie Wykonawcy "
       "____________________. Zmiana osoby do kontaktu wymaga powiadomienia drugiej Strony i nie stanowi zmiany "
       "Umowy."),

("h2", "§ 3. WYKONANIE PRAC I DALSI PODWYKONAWCY"),
("li", "Wykonawca wykonuje Prace z należytą starannością wynikającą z zawodowego charakteru swojej działalności, "
       "zgodnie ze specyfikacją z Zamówienia oraz przekazanymi wytycznymi i standardami marki."),
("li", "Powierzenie wykonania Prac lub ich części osobie trzeciej wymaga uprzedniej zgody Zamawiającego wyrażonej "
       "w formie dokumentowej. Wykonawca zapewni, że osoba taka będzie związana obowiązkami poufności nie mniej "
       "rygorystycznymi niż wynikające z umowy o zachowaniu poufności oraz że prawa autorskie do efektów jej prac "
       "zostaną skutecznie przeniesione na Wykonawcę w zakresie umożliwiającym ich dalsze przeniesienie zgodnie "
       "z § 6. Za działania i zaniechania takiej osoby Wykonawca odpowiada jak za własne."),
("li", "Wykonawca niezwłocznie informuje Zamawiającego o okolicznościach mogących opóźnić wykonanie Prac lub "
       "wpłynąć na ich zgodność z Zamówieniem."),

("h2", "§ 4. OŚWIADCZENIA I GWARANCJE WYKONAWCY"),
("li", "Wykonawca oświadcza i gwarantuje, że efekty Prac będą wynikiem jego własnej działalności twórczej, "
       "nie będą naruszać praw osób trzecich, w szczególności praw autorskich, praw do znaków towarowych, wzorów "
       "przemysłowych, patentów, dóbr osobistych i prawa do wizerunku, oraz nie będą obciążone prawami osób trzecich."),
("li", "Wykonawca zapewnia, że do wszystkich elementów wykorzystanych w efektach Prac, których nie jest autorem – "
       "w szczególności krojów pism, zdjęć i materiałów stockowych, ikon, modeli 3D, nagrań dźwiękowych i muzyki, "
       "materiałów wideo oraz bibliotek i komponentów kodu – posiada licencje pozwalające na korzystanie przez "
       "Zamawiającego i Klienta w zakresie odpowiadającym polom eksploatacji z § 6 oraz na dalsze przeniesienie "
       "uprawnień. Wraz z efektami Prac Wykonawca przekaże wykaz takich elementów wraz ze wskazaniem licencji "
       "i dowodami ich nabycia."),
("li", "W odniesieniu do kodu źródłowego Wykonawca zapewnia, że nie zawiera on komponentów objętych licencjami "
       "typu copyleft (w szczególności GPL, AGPL, SSPL) ani innymi licencjami nakładającymi obowiązek ujawnienia "
       "kodu lub ograniczającymi komercyjne wykorzystanie – bez uprzedniej zgody Zamawiającego. Wykonawca przekaże "
       "wykaz zależności wraz z ich licencjami."),
("li", "Jeżeli w efektach Prac Wykonawca wykorzystuje Materiały Własne Wykonawcy, wskaże je w wykazie "
       "przekazywanym wraz z efektami Prac, określając, których elementów dotyczą. Wykonawca nie wprowadzi "
       "do efektów Prac zasobów, co do których nie może udzielić licencji, o której mowa w § 6 ust. 4."),
("li", "Jeżeli przy wykonywaniu Prac Wykonawca korzystał z narzędzi sztucznej inteligencji, poinformuje o tym "
       "Zamawiającego, wskazując narzędzia i zakres ich wykorzystania. Wykonawca zapewnia, że warunki korzystania "
       "z tych narzędzi nie wyłączają komercyjnego wykorzystania rezultatów ani nie stoją na przeszkodzie "
       "przeniesieniu praw zgodnie z § 6, oraz że efekty Prac zawierają jego własny wkład twórczy."),
("li", "Jeżeli w efektach Prac wykorzystywany jest wizerunek lub głos osoby fizycznej, Wykonawca zapewni "
       "i przekaże Zamawiającemu zgody na ich rozpowszechnianie w zakresie odpowiadającym polom eksploatacji z § 6."),
("li", "Jeżeli osoba trzecia zgłosi wobec Zamawiającego lub Klienta roszczenie wynikające z naruszenia "
       "oświadczeń Wykonawcy złożonych w ust. 1–6, Zamawiający zawiadomi o tym Wykonawcę niezwłocznie i nie "
       "uzna roszczenia bez jego zgody, a Wykonawca – na swój koszt – wesprze obronę, podejmie działania "
       "zmierzające do zwolnienia Zamawiającego i Klienta z odpowiedzialności oraz pokryje uzasadnione koszty "
       "obrony i świadczenia zasądzone lub uzgodnione za jego zgodą. Uchybienie obowiązkowi zawiadomienia "
       "zwalnia Wykonawcę w zakresie, w jakim zwiększyło to rozmiar szkody."),

("h2", "§ 5. ODBIÓR PRAC I POPRAWKI"),
("li", "Wykonawca przekazuje efekty Prac wraz z Materiałami Źródłowymi kanałem wskazanym przez Zamawiającego "
       "i zgłasza je do odbioru w formie dokumentowej. Przekazanie bez Materiałów Źródłowych nie stanowi zgłoszenia "
       "do odbioru."),
("li", "Zamawiający dokona odbioru albo zgłosi uwagi w terminie {TERMIN_UWAG} dni roboczych od zgłoszenia do "
       "odbioru. Brak reakcji w tym terminie oznacza odbiór bez zastrzeżeń."),
("li", "W razie zgłoszenia uwag Wykonawca wykona poprawki w liczbie rund wskazanej w Zamówieniu, a w razie braku "
       "takiego wskazania – w liczbie trzech rund, bez dodatkowego wynagrodzenia, w terminie uzgodnionym przez "
       "Strony. Kolejne zmiany rozliczane są według stawki uzgodnionej przez Strony."),
("li", "Usunięcie wad efektów Prac, w tym niezgodności ze specyfikacją Zamówienia oraz błędów w działaniu wdrożonych "
       "rozwiązań, następuje w ramach wynagrodzenia i nie jest liczone jako runda poprawek. Wykonawca usunie takie "
       "wady zgłoszone w terminie 60 dni od odbioru. Postanowienie to nie ogranicza uprawnień Zamawiającego "
       "z tytułu rękojmi za wady."),

("h2", "§ 6. PRZENIESIENIE AUTORSKICH PRAW MAJĄTKOWYCH"),
("li", "Z chwilą odbioru efektów Prac Wykonawca przenosi na Zamawiającego, w ramach wynagrodzenia za dane "
       "Zamówienie, całość autorskich praw majątkowych do wszystkich utworów w rozumieniu ustawy z dnia 4 lutego "
       "1994 r. o prawie autorskim i prawach pokrewnych, powstałych w wykonaniu tego Zamówienia (dalej: **Utwory**), "
       "bez ograniczeń czasowych i terytorialnych, na następujących polach eksploatacji, znanych w chwili zawarcia "
       "Umowy:"),
] + POLA + [
("li", "Wykonawca zezwala Zamawiającemu na wykonywanie praw zależnych do Utworów oraz upoważnia go do zezwalania na "
       "ich wykonywanie osobom trzecim, na polach eksploatacji wskazanych w ust. 1."),
("li", "Zamawiającemu przysługuje prawo dalszego rozporządzania nabytymi prawami – w całości lub w części, na rzecz "
       "wybranych przez siebie osób trzecich, w szczególności Klienta – bez konieczności uzyskiwania odrębnej zgody "
       "Wykonawcy i bez dodatkowego wynagrodzenia."),
("li", "W zakresie, w jakim efekty Prac zawierają Materiały Własne Wykonawcy, Wykonawca udziela Zamawiającemu "
       "– w ramach wynagrodzenia za dane Zamówienie – niewyłącznej licencji na korzystanie z nich, nieograniczonej czasowo "
       "ani terytorialnie, na polach eksploatacji wskazanych w ust. 1, wraz z prawem udzielania sublicencji "
       "Klientowi oraz przeniesienia licencji na osobę trzecią. Licencja nie może zostać wypowiedziana."),
("li", "Wykonawca zapewnia, że jest uprawniony do udzielenia licencji, o której mowa w ust. 4, oraz że "
       "korzystanie z Materiałów Własnych Wykonawcy nie ogranicza możliwości korzystania z Utworów ani "
       "rozporządzania nimi zgodnie z Umową. Materiały Własne Wykonawcy niewskazane w wykazie, o którym mowa "
       "w § 4 ust. 4, objęte są licencją na warunkach określonych w ust. 4."),
("li", "Przeniesienie praw następuje pod warunkiem zawieszającym zapłaty całości wynagrodzenia za dane Zamówienie. "
       "Do czasu zapłaty Zamawiający uprawniony jest do korzystania z Utworów na polach eksploatacji wskazanych "
       "w ust. 1 na podstawie niewyłącznej, nieodpłatnej licencji, udzielonej z chwilą odbioru."),
("li", "Przeniesienie obejmuje również wersje robocze, warianty i koncepcje odrzucone, powstałe w wykonaniu danego "
       "Zamówienia, o ile zostały objęte wynagrodzeniem."),
("li", "Z chwilą odbioru Wykonawca przenosi na Zamawiającego własność egzemplarzy i nośników, na których utrwalono "
       "Utwory, oraz przekazuje Materiały Źródłowe zgodnie z § 7."),
("li", "Wykonawca zobowiązuje się do niewykonywania wobec Zamawiającego i Klienta autorskich praw osobistych do "
       "Utworów, upoważnia Zamawiającego do decydowania o pierwszym udostępnieniu Utworów, do ich rozpowszechniania "
       "bez oznaczania autorstwa oraz do wprowadzania zmian, o których mowa w ust. 1 lit. h. Nie uchybia to "
       "uprawnieniu Wykonawcy do umieszczenia efektów Prac w portfolio na zasadach określonych w umowie "
       "o zachowaniu poufności."),

("h2", "§ 7. MATERIAŁY ŹRÓDŁOWE I DOSTĘPY"),
("li", "**Materiały Źródłowe** to otwarte, edytowalne pliki i zasoby pozwalające na samodzielne dalsze korzystanie "
       "z efektów Prac i ich modyfikowanie, w szczególności: pliki projektowe wraz z warstwami i zależnościami, "
       "projekty animacji wraz z użytymi zasobami i czcionkami, pliki montażowe, modele i sceny 3D, kod źródłowy "
       "wraz z historią repozytorium, konfiguracją i dokumentacją uruchomienia, a także wykaz elementów licencjonowanych."),
("li", "Wykonawca przekazuje Materiały Źródłowe najpóźniej wraz ze zgłoszeniem efektów Prac do odbioru, kanałem "
       "wskazanym przez Zamawiającego."),
("li", "Po zakończeniu Prac Wykonawca przekaże Zamawiającemu wszystkie dostępy, konta i uprawnienia utworzone na "
       "potrzeby realizacji Zamówienia i nie zachowa dostępu do systemów Zamawiającego ani Klienta bez jego zgody."),

("h2", "§ 8. WYNAGRODZENIE"),
("li", "Za wykonanie Prac Zamawiający zapłaci Wykonawcy wynagrodzenie określone w Zamówieniu albo na podstawie "
       "wyceny przedstawionej przez Wykonawcę i zaakceptowanej przez Zamawiającego przed przystąpieniem do Prac."),
("li", "Wynagrodzenie obejmuje wszelkie koszty związane z wykonaniem Prac, w tym wynagrodzenie za przeniesienie "
       "autorskich praw majątkowych i zezwolenie na wykonywanie praw zależnych na wszystkich polach eksploatacji "
       "wskazanych w § 6, a także koszty licencji elementów, o których mowa w § 4 ust. 2 – chyba że Zamówienie "
       "stanowi inaczej."),
("li", "Wynagrodzenie ma charakter ryczałtowy i obejmuje korzystanie z Utworów na każdym z pól eksploatacji "
       "wskazanych w § 6 ust. 1. Strony wyłączają zastosowanie art. 45 ustawy o prawie autorskim i prawach "
       "pokrewnych."),
("li", "Podstawą wystawienia faktury jest odbiór efektów Prac zgodnie z § 5. Wynagrodzenie płatne jest przelewem "
       "w terminie {TERMIN_PLATNOSCI} dni od dnia doręczenia prawidłowo wystawionej faktury."),
("li", "Faktury wystawiane i doręczane są zgodnie z obowiązującymi przepisami, w tym za pośrednictwem Krajowego "
       "Systemu e-Faktur (KSeF), a poza jego zakresem – w formie elektronicznej na adres e-mail Zamawiającego "
       "wskazany w komparycji, na co Zamawiający wyraża zgodę."),

("h2", "§ 9. TERMINY I ODPOWIEDZIALNOŚĆ"),
("li", "W razie zwłoki w wykonaniu Prac Zamawiający może żądać kary umownej w wysokości {KARA_ZWLOKA}% wynagrodzenia "
       "netto z danego Zamówienia za każdy dzień zwłoki, nie więcej niż {KARA_ZWLOKA_MAX}% tego wynagrodzenia."),
("li", "Jeżeli zwłoka przekroczy 14 dni, Zamawiający może odstąpić od Zamówienia po bezskutecznym wyznaczeniu "
       "dodatkowego terminu. W takim przypadku Wykonawca przekaże rezultat prac wykonanych do dnia odstąpienia wraz "
       "z Materiałami Źródłowymi, a przeniesienie praw zgodnie z § 6 obejmuje tę część, za którą przysługuje mu "
       "wynagrodzenie."),
("li", "Kary umowne naliczone do dnia odstąpienia od Zamówienia pozostają należne również po odstąpieniu."),
("li", "Zapłata kar umownych nie wyłącza prawa do dochodzenia odszkodowania przewyższającego ich wysokość na "
       "zasadach ogólnych."),
("li", "Wykonawca odpowiada za szkody wyrządzone Zamawiającemu lub Klientowi wskutek niewykonania lub nienależytego "
       "wykonania Umowy, w tym wskutek naruszenia praw osób trzecich."),
("li", "Łączna odpowiedzialność Wykonawcy z tytułu niewykonania lub nienależytego wykonania danego Zamówienia, "
       "w tym z tytułu kar umownych za zwłokę, ograniczona jest do 200% wynagrodzenia netto z tego Zamówienia. "
       "Ograniczenie nie obejmuje: naruszenia obowiązków poufności, naruszenia praw osób trzecich i obowiązku "
       "z § 4 ust. 7, naruszenia § 6 oraz szkody wyrządzonej umyślnie."),

("h2", "§ 10. POUFNOŚĆ, PORTFOLIO I ZAKAZ OBCHODZENIA"),
("li", "Zasady zachowania poufności, publikacji efektów Prac w portfolio oraz zakazu obchodzenia i pozyskiwania "
       "określa zawarta pomiędzy Stronami umowa o zachowaniu poufności, która obowiązuje równolegle z Umową."),
("li", "Zawarcie umowy o zachowaniu poufności jest warunkiem złożenia pierwszego Zamówienia."),

("h2", "§ 11. CZAS TRWANIA"),
("li", "Umowa zostaje zawarta na czas nieoznaczony."),
("li", "Każda ze Stron może wypowiedzieć Umowę z zachowaniem {WYPOWIEDZENIE}-dniowego okresu wypowiedzenia, "
       "w formie dokumentowej. Wypowiedzenie nie wpływa na Zamówienia przyjęte do realizacji przed jego złożeniem, "
       "które Strony wykonają na dotychczasowych zasadach."),
("li", "Postanowienia § 4, § 6, § 9 i § 10 pozostają w mocy po rozwiązaniu Umowy."),

("h2", "§ 12. POSTANOWIENIA KOŃCOWE"),
("li", "Umowa wymaga formy pisemnej pod rygorem nieważności, zgodnie z art. 53 ustawy o prawie autorskim "
       "i prawach pokrewnych. Wymóg ten spełnia dokument opatrzony własnoręcznymi podpisami obu Stron albo "
       "kwalifikowanym podpisem elektronicznym każdej ze Stron (art. 78¹ § 2 Kodeksu cywilnego). Wiadomość "
       "e-mail ani podpis zaufany nie spełniają tego wymogu."),
("li", "Zmiany Umowy wymagają formy pisemnej pod rygorem nieważności. Nie dotyczy to zmiany osób do kontaktu "
       "i danych adresowych, składania i przyjmowania Zamówień, zgód, odbiorów oraz oświadczeń o odstąpieniu "
       "i wypowiedzeniu – dla nich Strony zastrzegają formę dokumentową."),
("li", "Strony udostępniają sobie wzajemnie dane osobowe osób odpowiedzialnych za realizację Umowy; każda ze Stron "
       "staje się administratorem otrzymanych danych i przetwarza je zgodnie z RODO. Strony potwierdzają, że "
       "posiadają podstawę prawną do ich udostępnienia."),
("li", "Żadna ze Stron nie może przenieść praw ani obowiązków wynikających z Umowy na osobę trzecią bez uprzedniej "
       "zgody drugiej Strony wyrażonej w formie dokumentowej. Nie dotyczy to rozporządzania przez Zamawiającego "
       "prawami nabytymi na podstawie § 6."),
("li", "Jeżeli którekolwiek postanowienie Umowy okaże się nieważne lub bezskuteczne, pozostałe postanowienia "
       "pozostają w mocy, a Strony zastąpią je postanowieniem o zbliżonym skutku gospodarczym."),
("li", "W sprawach nieuregulowanych Umową stosuje się prawo polskie, w szczególności Kodeks cywilny oraz ustawę "
       "o prawie autorskim i prawach pokrewnych."),
("li", "Spory wynikające z Umowy rozstrzyga sąd {SAD}."),
("li", "Załącznik nr 1 (wzór Zamówienia) stanowi integralną część Umowy."),
("li", "Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze Stron, albo w postaci "
       "jednego dokumentu elektronicznego podpisanego przez obie Strony."),

("sig", ""),

("break", ""),
("h1", "ZAŁĄCZNIK NR 1 — WZÓR ZAMÓWIENIA"),
("sub", "do umowy ramowej o współpracy podwykonawczej"),
("note", "Zamówienie składane jest w formie dokumentowej (e-mail lub narzędzie do zarządzania projektami). "
         "Poniższy zakres informacji stanowi minimum; Zamówienie nie wymaga podpisu."),
("table", (["Pole", "Treść"], [
    ["Numer i data Zamówienia", ""],
    ["Klient / projekt", ""],
    ["Zakres i specyfikacja Prac", ""],
    ["Wymagane formaty plików i Materiały Źródłowe", ""],
    ["Termin wykonania", ""],
    ["Liczba rund poprawek w ramach wynagrodzenia", "3, o ile nie wskazano inaczej"],
    ["Wynagrodzenie netto", ""],
    ["Koszty licencji (fonty, stocki, biblioteki)", "w wynagrodzeniu / rozliczane odrębnie"],
    ["Uwagi", ""],
])),
("note", "Przyjęcie Zamówienia: potwierdzenie w terminie 2 dni roboczych. Brak potwierdzenia oznacza, "
         "że Zamówienie nie zostało przyjęte."),
]
