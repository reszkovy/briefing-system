# -*- coding: utf-8 -*-
"""Krótka umowa o dzieło z przeniesieniem praw — do zleceń jednorazowych.

Zastępuje komplet NDA + umowa ramowa tam, gdzie pełny komplet jest przerostem formy.
Uwaga: przeniesienie praw także tutaj wymaga formy pisemnej (art. 53 pr. aut.).
"""

from pola import POLA

BLOKI = [
("h1", "UMOWA O DZIEŁO"),
("sub", "(z przeniesieniem autorskich praw majątkowych)"),

("p", "zawarta w dniu ____________________ pomiędzy:"),
("p", "**{IMIE_NAZWISKO}**, prowadzącym działalność gospodarczą pod firmą **{FIRMA}**, wpisaną do "
      "Centralnej Ewidencji i Informacji o Działalności Gospodarczej, adres: {ADRES}, NIP: {NIP}, "
      "REGON: {REGON}, adres e-mail do doręczeń: {EMAIL}, zwanym dalej **Zamawiającym**,"),
("p", "a ____________________________________________, prowadzącym działalność gospodarczą pod firmą "
      "____________________________________________, adres: ____________________________________________, "
      "NIP: ____________________, adres e-mail do doręczeń: ____________________, "
      "zwanym dalej **Wykonawcą**."),

("h2", "§ 1. PRZEDMIOT I TERMIN"),
("li", "Wykonawca wykona na zamówienie Zamawiającego następujące dzieło (dalej: **Dzieło**):"),
("p", "________________________________________________________________________________"),
("p", "________________________________________________________________________________"),
("li", "Dzieło jest wykonywane na potrzeby projektu realizowanego przez Zamawiającego na rzecz "
       "____________________ (dalej: **Klient**)."),
("li", "Termin wykonania: ____________________."),
("li", "Wykonawca wykonuje Dzieło samodzielnie, w wybranym przez siebie miejscu i czasie, na własny rachunek "
       "i ryzyko, przy użyciu własnych narzędzi. Umowa nie tworzy stosunku pracy. Powierzenie wykonania Dzieła "
       "osobie trzeciej wymaga zgody Zamawiającego wyrażonej w formie dokumentowej."),

("h2", "§ 2. WYNAGRODZENIE"),
("li", "Wynagrodzenie wynosi ____________________ zł netto i obejmuje wszelkie koszty wykonania Dzieła, "
       "wynagrodzenie za przeniesienie autorskich praw majątkowych na wszystkich polach eksploatacji wskazanych "
       "w § 4 ust. 1 oraz za zezwolenie na wykonywanie praw zależnych. Wynagrodzenie ma charakter ryczałtowy; "
       "Strony wyłączają zastosowanie art. 45 ustawy o prawie autorskim i prawach pokrewnych."),
("li", "Podstawą wystawienia faktury jest odbiór Dzieła. Wynagrodzenie płatne jest w terminie "
       "{TERMIN_PLATNOSCI} dni od dnia doręczenia prawidłowo wystawionej faktury."),

("h2", "§ 3. PRZEKAZANIE I ODBIÓR"),
("li", "Wykonawca przekaże Dzieło wraz z plikami źródłowymi – otwartymi, edytowalnymi plikami i zasobami "
       "pozwalającymi na samodzielne dalsze korzystanie z Dzieła i jego modyfikowanie, w tym w odniesieniu do "
       "kodu: repozytorium wraz z historią, konfiguracją i dokumentacją uruchomienia – oraz z wykazem elementów "
       "licencjonowanych, o którym mowa w § 5 ust. 2. Przekazanie bez tych materiałów nie stanowi zgłoszenia "
       "do odbioru."),
("li", "Zamawiający dokona odbioru albo zgłosi uwagi w terminie {TERMIN_UWAG} dni roboczych. Brak reakcji w tym "
       "terminie oznacza odbiór bez zastrzeżeń."),
("li", "W razie uwag Wykonawca wykona dwie rundy poprawek bez dodatkowego wynagrodzenia. Usunięcie wad, w tym "
       "niezgodności z § 1, następuje w ramach wynagrodzenia i nie jest liczone jako runda poprawek."),
("li", "Po zakończeniu prac Wykonawca przekaże wszystkie dostępy utworzone na potrzeby Dzieła i nie zachowa "
       "dostępu do systemów Zamawiającego ani Klienta."),

("h2", "§ 4. PRZENIESIENIE AUTORSKICH PRAW MAJĄTKOWYCH"),
("li", "Z chwilą odbioru Dzieła Wykonawca przenosi na Zamawiającego całość autorskich praw majątkowych do "
       "Dzieła oraz do wszystkich utworów powstałych przy jego wykonaniu, w tym wersji roboczych i koncepcji "
       "odrzuconych (dalej: **Utwory**), bez ograniczeń czasowych i terytorialnych, na następujących polach "
       "eksploatacji, znanych w chwili zawarcia Umowy:"),
] + POLA + [
("li", "Wykonawca zezwala Zamawiającemu na wykonywanie praw zależnych do Utworów oraz upoważnia go do "
       "zezwalania na ich wykonywanie osobom trzecim, na polach wskazanych w ust. 1."),
("li", "Zamawiającemu przysługuje prawo dalszego rozporządzania nabytymi prawami, w szczególności na rzecz "
       "Klienta, bez odrębnej zgody Wykonawcy i bez dodatkowego wynagrodzenia."),
("li", "Jeżeli Dzieło zawiera utwory lub zasoby, do których prawa przysługują Wykonawcy, a które powstały przed "
       "zawarciem Umowy lub niezależnie od niej (własne biblioteki, komponenty kodu, szablony, presety, modele), "
       "Wykonawca wskaże je przy przekazaniu Dzieła i udziela Zamawiającemu – w ramach wynagrodzenia – "
       "niewyłącznej, nieograniczonej czasowo ani terytorialnie i niewypowiadalnej licencji na korzystanie z nich "
       "na polach wskazanych w ust. 1, wraz z prawem sublicencji na rzecz Klienta. Zasoby niewskazane objęte są "
       "licencją na tych samych warunkach."),
("li", "Przeniesienie praw następuje pod warunkiem zawieszającym zapłaty całości wynagrodzenia. Do czasu zapłaty "
       "Zamawiający korzysta z Utworów na podstawie niewyłącznej, nieodpłatnej licencji udzielonej z chwilą "
       "odbioru."),
("li", "Z chwilą odbioru Wykonawca przenosi na Zamawiającego własność nośników, na których utrwalono Utwory."),
("li", "Wykonawca zobowiązuje się do niewykonywania wobec Zamawiającego i Klienta autorskich praw osobistych do "
       "Utworów, upoważnia Zamawiającego do decydowania o pierwszym udostępnieniu Utworów, do ich "
       "rozpowszechniania bez oznaczania autorstwa oraz do wprowadzania zmian, o których mowa w ust. 1 lit. h."),

("h2", "§ 5. OŚWIADCZENIA WYKONAWCY"),
("li", "Wykonawca oświadcza, że Dzieło będzie wynikiem jego własnej działalności twórczej, nie naruszy praw osób "
       "trzecich i nie będzie obciążone ich prawami."),
("li", "Do wszystkich elementów, których nie jest autorem – krojów pism, zdjęć i materiałów stockowych, ikon, "
       "modeli, nagrań, muzyki, bibliotek i komponentów kodu – Wykonawca posiada licencje pozwalające na "
       "korzystanie przez Zamawiającego i Klienta w zakresie odpowiadającym § 4 ust. 1 oraz na dalsze "
       "przeniesienie uprawnień. Wykaz tych elementów wraz ze wskazaniem licencji przekazuje wraz z Dziełem."),
("li", "Kod źródłowy nie zawiera komponentów objętych licencjami typu copyleft (w szczególności GPL, AGPL, SSPL) "
       "ani innymi wymuszającymi ujawnienie kodu – bez uprzedniej zgody Zamawiającego."),
("li", "Jeżeli Wykonawca korzystał z narzędzi sztucznej inteligencji, poinformuje o tym Zamawiającego i zapewnia, "
       "że warunki korzystania z nich nie wyłączają komercyjnego wykorzystania rezultatów ani nie stoją na "
       "przeszkodzie przeniesieniu praw, a Dzieło zawiera jego własny wkład twórczy."),
("li", "Jeżeli osoba trzecia zgłosi wobec Zamawiającego lub Klienta roszczenie wynikające z naruszenia powyższych "
       "oświadczeń, Zamawiający zawiadomi o tym Wykonawcę niezwłocznie i nie uzna roszczenia bez jego zgody, "
       "a Wykonawca wesprze obronę i pokryje uzasadnione koszty oraz świadczenia zasądzone lub uzgodnione za jego "
       "zgodą."),

("h2", "§ 6. POUFNOŚĆ I PUBLIKACJE"),
("li", "Wykonawca zachowa w tajemnicy wszelkie informacje dotyczące Zamawiającego i Klienta uzyskane w związku "
       "z wykonaniem Dzieła, w szczególności briefy, materiały niepublikowane, terminy premier, dane handlowe, "
       "kod źródłowy i dane dostępowe. Obowiązek trwa {OKRES_POUFNOSCI} lat od wykonania Dzieła, a w odniesieniu "
       "do informacji stanowiących tajemnicę przedsiębiorstwa – tak długo, jak zachowują one taki charakter."),
("li", "Wykonawca nie wprowadzi materiałów Klienta ani kodu źródłowego do publicznie dostępnych narzędzi "
       "i systemów sztucznej inteligencji, których warunki dopuszczają wykorzystanie wprowadzonych danych do "
       "trenowania modeli lub ich udostępnianie osobom trzecim."),
("li", "Publikacja Dzieła w portfolio Wykonawcy, posługiwanie się nazwą lub znakami Klienta oraz ujawnienie faktu "
       "współpracy wymagają uprzedniej zgody Zamawiającego w formie dokumentowej. Po publicznej premierze "
       "projektu zgoda nie zostanie bezpodstawnie odmówiona."),
("li", "W razie naruszenia obowiązków z niniejszego paragrafu Zamawiający może żądać kary umownej w wysokości "
       "{KARA_POUFNOSC} zł (słownie: {KARA_POUFNOSC_SLOWNIE} złotych) za każdy przypadek naruszenia, płatnej "
       "w terminie 14 dni od doręczenia wezwania. Zapłata kary nie wyłącza dochodzenia odszkodowania "
       "przewyższającego jej wysokość."),

("h2", "§ 7. POSTANOWIENIA KOŃCOWE"),
("li", "Umowa wymaga formy pisemnej pod rygorem nieważności, zgodnie z art. 53 ustawy o prawie autorskim "
       "i prawach pokrewnych. Wymóg ten spełnia dokument opatrzony własnoręcznymi podpisami obu Stron albo "
       "kwalifikowanym podpisem elektronicznym każdej ze Stron (art. 78¹ § 2 Kodeksu cywilnego). Wiadomość e-mail "
       "ani podpis zaufany nie spełniają tego wymogu. Zmiany Umowy wymagają formy pisemnej."),
("li", "Strony udostępniają sobie dane osobowe osób odpowiedzialnych za realizację Umowy; każda ze Stron staje "
       "się administratorem otrzymanych danych i przetwarza je zgodnie z RODO."),
("li", "W sprawach nieuregulowanych stosuje się prawo polskie, w szczególności Kodeks cywilny oraz ustawę "
       "o prawie autorskim i prawach pokrewnych. Spory rozstrzyga sąd {SAD}."),
("li", "Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze Stron, albo w postaci "
       "jednego dokumentu elektronicznego podpisanego przez obie Strony."),

("sig", ""),
]
