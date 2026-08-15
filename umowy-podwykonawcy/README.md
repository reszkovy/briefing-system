# Umowy dla podwykonawców

Komplet dwóch dokumentów dla **polskiej JDG → polscy freelancerzy B2B**, zakres prac:
brand/grafika, motion i wideo (w tym AI), web/development.

Powstały na bazie czterech umów, które dostałeś od kontrahentów — NDA od OSOM Studio,
East Events i Walk Creative oraz umowy ramowej Kubota S.A. z 01.07.2026 (ta ostatnia
jest lustrzanym odbiciem tego, co teraz Ty dajesz podwykonawcom).

## Pliki

| Plik | Do czego |
|---|---|
| `NDA-podwykonawca.docx` | poufność, portfolio, zakaz obchodzenia — podpisujesz jako pierwsze |
| `Umowa-ramowa-podwykonawca.docx` | zlecanie prac + przeniesienie praw autorskich + Załącznik nr 1 (wzór Zamówienia) |
| `Umowa-o-dzielo-jednorazowa.docx` | jedno zlecenie, jeden dokument — zamiast kompletu powyżej |
| `*.md` | te same treści jako tekst — do wklejenia w maila |
| `dane.py` | **wszystkie zmienne trzech umów w jednym miejscu** |
| `nda.py`, `umowa_ramowa.py`, `umowa_dzielo.py` | treść umów |
| `pola.py` | pola eksploatacji — wspólne dla ramowej i o dzieło, żeby nie rozjechały się w czasie |
| `render.py`, `build.py` | generator .docx/.md |

## Który dokument kiedy

**Stała współpraca** (od ~3 zleceń u tej samej osoby): NDA → umowa ramowa → dalej już tylko
Zamówienia mailem. NDA jest warunkiem złożenia pierwszego Zamówienia (§ 10 ust. 2 ramowej).

**Zlecenie jednorazowe**: sama `Umowa-o-dzielo-jednorazowa` — ma w środku skróconą poufność,
te same pola eksploatacji i tę samą licencję na własne biblioteki wykonawcy. Nie potrzebujesz
do niej NDA.

**Praca bez przenoszenia praw** (klient nie żąda przeniesienia): można na szerokiej licencji
niewyłącznej udzielonej mailem — art. 67 ust. 5 wymaga formy pisemnej tylko dla licencji
wyłącznej. Najmniej tarcia, ale nie sprzedasz klientowi wyłączności.

## Jak podpisywać — to nie jest kosmetyka

| Dokument | Wymagana forma | Czym podpisać |
|---|---|---|
| NDA | dokumentowa | mail z adresu z komparycji wystarczy |
| **Umowa ramowa** | **pisemna pod rygorem nieważności** | podpis odręczny **albo kwalifikowany podpis elektroniczny** |
| Zamówienia, zgody, odbiory, wypowiedzenia | dokumentowa | mail |

Umowa ramowa przenosi autorskie prawa majątkowe, a art. 53 ustawy o prawie autorskim
wymaga dla tego formy pisemnej pod rygorem nieważności. Mail jej nie spełnia. Podpis zaufany
też nie — zrównany z podpisem własnoręcznym jest tylko wobec podmiotów publicznych.
Kwalifikowany podpis elektroniczny spełnia (art. 78¹ § 2 k.c.).

Konsekwencja podpisania umowy ramowej mailem: § 6 jest nieważny, czyli płacisz podwykonawcy
i nie nabywasz praw, które sprzedajesz klientowi. Wychodzi zwykle przy due diligence albo
przy zgłaszaniu znaku towarowego.

## Uzupełnienie i przebudowa

Wypełnij `dane.py`, potem:

```bash
python3 "umowy-podwykonawcy/build.py"
```

Do uzupełnienia został tylko e-mail do doręczeń. Reszta danych rejestrowych jest wpisana,
a parametry mają wartości domyślne — kary 20/30 tys., zakaz obchodzenia 12 mies., poufność
10 lat, płatność 14 dni, 3 rundy poprawek, kara za zwłokę 1%/dzień (max 20%),
wypowiedzenie 14 dni.

Adres to ten z CEIDG (Widna 15 lok. 1, Łódź), nie majorkański — od niego wzięty jest też
sąd właściwy w obu umowach.

## Co wzięte z Kubota, a co zmienione

Zachowane, bo działa: struktura ramowa bez zobowiązania do zamówień, składanie Zamówień
mailem/w narzędziu, 2 dni na potwierdzenie, odbiór z terminem na uwagi, wynagrodzenie
obejmujące przeniesienie praw, prawo dalszego rozporządzania prawami bez zgody wykonawcy,
kara 20 tys. za poufność, KSeF.

Zmienione:

- **Milczenie ≠ przyjęcie Zamówienia.** U Kuboty brak odpowiedzi w 2 dni oznacza przyjęcie —
  wygodne dla zamawiającego, ale realnie generuje spory o to, czy ktoś w ogóle widział zlecenie.
  U Ciebie brak potwierdzenia = brak zlecenia.
- **Rozdzielone przeniesienie praw od licencji.** Kubota miesza jedno z drugim w § 5
  (raz „przenosi", raz „licencja, o której mowa powyżej"). Tutaj: przeniesienie pod warunkiem
  zawieszającym zapłaty, a do czasu zapłaty działa licencja — ten sam efekt, bez wady prawnej.
- **Materiały Źródłowe jako warunek odbioru** (§ 5 ust. 1, § 7). U Kuboty tego nie ma i to jest
  realna luka: dostajesz PNG bez pliku otwartego i formalnie wszystko się zgadza.
- **Licencje na assety i kod** (§ 4 ust. 2–3). Wykaz fontów, stocków, bibliotek, zakaz copyleft
  w kodzie. Bez tego przenosisz na klienta prawa, których sam nie masz.
- **Ujawnienie użycia AI** (§ 4 ust. 4). Nie zakaz — obowiązek informacji plus zapewnienie,
  że warunki narzędzia nie blokują komercyjnego użycia i przeniesienia praw. Materiał w całości
  wygenerowany może nie mieć ochrony prawnoautorskiej, więc nie da się go skutecznie przenieść.
- **Indemnity** (§ 4 ust. 6). Jeśli ktoś zgłosi roszczenie do klienta, wykonawca wchodzi w spór
  i pokrywa koszty. W żadnym z Twoich czterech wzorów tego nie ma.
- **Portfolio.** Kubota dała Ci prawo do portfolio po premierze kolekcji — odwzorowane:
  § 4 ust. 2 NDA mówi, że po publicznej premierze zgody nie odmawia się bezpodstawnie.
  Uczciwe i przy projektantach po prostu potrzebne do podpisu.

## Poprawki prawne naniesione po przeglądzie (06.08.2026)

- **Forma pisemna dla umowy ramowej** (art. 53 pr. aut.) — patrz sekcja o podpisywaniu wyżej.
  Wcześniejsza wersja dopuszczała mail, co unieważniało przeniesienie praw.
- **Zamknięty katalog pól eksploatacji** w § 6 ust. 1 — art. 41 ust. 2 przenosi tylko pola
  wyraźnie wymienione, więc formuła „w szczególności" dawała złudzenie szerszego nabycia.
- **Wyłączenie art. 45 pr. aut.** (§ 8 ust. 3) — inaczej podwykonawca mógłby po latach żądać
  odrębnego wynagrodzenia za każde pole eksploatacji.
- **Rękojmia zachowana obok umownego trybu usuwania wad** (§ 5 ust. 4) — ustawowa jest dla
  Ciebie korzystniejsza niż zapisane 60 dni.
- **Kary za zwłokę naliczone do dnia odstąpienia pozostają należne** (§ 9 ust. 3).
- **Poufność 10 lat + bezterminowo dla tajemnicy przedsiębiorstwa** zamiast „bezterminowo"
  (§ 11 ust. 2 NDA) — art. 365¹ k.c. pozwala wypowiedzieć bezterminowe zobowiązanie ciągłe.
- **Materiały Własne Wykonawcy (background IP)** — § 1 ust. 7, § 4 ust. 4, § 6 ust. 4–5.
  Własne biblioteki, komponenty kodu, szablony i presety wniesione do projektu nie powstają
  „w wykonaniu Zamówienia", więc § 6 ich nie przenosił. Teraz: obowiązek oznaczenia ich
  w wykazie + nieodpłatna, wieczysta, niewypowiadalna licencja niewyłączna z prawem
  sublicencji dla Klienta. Elementy nieujawnione w wykazie i tak są objęte licencją.

Czego nie da się wyłączyć umową: art. 44 pr. aut. (klauzula bestsellerowa — żądanie
podwyższenia wynagrodzenia przy rażącej dysproporcji) oraz miarkowanie kar umownych
przez sąd (art. 484 § 2 k.c.).

## Ustępstwa wbudowane w wersję bazową

Dwie rzeczy, których wykonawca (albo jego prawnik) zażądałby i tak — lepiej mieć je od razu
w dokumencie niż oddawać pod presją:

- **Limit odpowiedzialności** (§ 9 ust. 4 ramowej): 200% wynagrodzenia netto z Zamówienia,
  z wyłączeniem poufności, naruszenia praw osób trzecich, § 6 i winy umyślnej. Wyłączenie
  winy umyślnej jest zresztą obowiązkowe — art. 473 § 2 k.c.
- **Indemnity doprecyzowane** (§ 4 ust. 7): dotyczy roszczeń z naruszenia jego oświadczeń,
  zawiadamiasz go niezwłocznie, nie uznajesz roszczenia bez jego zgody. Oddajesz to, co i tak
  byś oddał, a klauzula staje się trudniejsza do podważenia.

Poufność zeszła z 10 do **5 lat** — tyle mają Kubota i Walk Creative, więc nie wyglądasz
na outliera. Tajemnica przedsiębiorstwa i tak jest chroniona bezterminowo osobnym zdaniem.

Karty zostawione do negocjacji, gdyby przycisnął: rękojmia ograniczona do 12 miesięcy dla
kodu, minimum 30% wynagrodzenia przy odstąpieniu od rozpoczętego Zamówienia.

## Mail, którym to wysyłasz

> Cześć, przesyłam dwa dokumenty, które podpisuję ze wszystkimi, z którymi pracuję —
> NDA i umowę ramową. NDA możemy podpisać mailem, umowa ramowa wymaga podpisu odręcznego
> albo kwalifikowanego, bo przenosi prawa autorskie i tak wymaga ustawa (art. 53 pr. aut.).
>
> Dwie rzeczy z góry, bo zwykle o nie pytacie: **narzędzia AI są OK** w wersjach, które nie
> uczą się na kodzie (Copilot Business/Enterprise tak, indywidualny nie), a **portfolio**
> po premierze projektu zawsze puszczam.
>
> To wersja bazowa. Jeśli coś Ci nie pasuje przy odpowiedzialności albo terminach —
> pisz, dogadamy się.

## Co jest tylko w NDA (nie było w żadnym wzorze)

- Zakaz wrzucania materiałów klienta i kodu do narzędzi AI uczących się na danych (§ 3 ust. 7)
- Osobne zasady dla kluczy API, repozytoriów i dostępów produkcyjnych (§ 3 ust. 6)
- Zakaz obchodzenia — celowo wąski: tylko klienci poznani przez Ciebie, tylko zbliżone usługi,
  z wyjątkiem dla klientów, których podwykonawca miał wcześniej, i dla sytuacji, gdy klient sam
  się odezwie. Szeroki, bezpłatny zakaz konkurencji w B2B bywa podważany jako sprzeczny
  z zasadami współżycia społecznego; wąska klauzula jest po prostu łatwiejsza do wyegzekwowania.
- Zgłoszenie incydentu w 24 h

## Zastrzeżenie

To wzory robocze, nie porada prawna. Warto dać je raz prawnikowi do przejrzenia — zwłaszcza
§ 6 umowy ramowej (pola eksploatacji) i § 8 NDA. Jednorazowy koszt przy dokumentach, które
podpiszesz wielokrotnie.
