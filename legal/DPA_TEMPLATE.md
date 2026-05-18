# Umowa Powierzenia Przetwarzania Danych Osobowych (DPA)

**Wersja**: 1.0
**Data sporządzenia**: [DATA]

---

> ⚠️ **Template do uzupełnienia**. Skonsultuj z prawnikiem przed podpisaniem.
> To jest szablon Data Processing Agreement zgodny z RODO art. 28 dla klienta B2B (np. sieć fitness/retail), który powierza dane swoich pracowników operatorowi regional.fit.

---

## Strony umowy

**Administrator danych** (Klient):
- Nazwa: [NAZWA KLIENTA]
- NIP: [NIP KLIENTA]
- Siedziba: [ADRES KLIENTA]
- Reprezentowany przez: [IMIĘ NAZWISKO, FUNKCJA]

**Podmiot przetwarzający** (Operator regional.fit):
- Nazwa: [NAZWA FIRMY]
- NIP: [NIP]
- Siedziba: [ADRES]
- Reprezentowany przez: [IMIĘ NAZWISKO, FUNKCJA]

---

## 1. Przedmiot powierzenia

Administrator powierza Podmiotowi przetwarzającemu przetwarzanie danych osobowych w zakresie i celu określonym w niniejszej umowie, na podstawie art. 28 RODO.

## 2. Charakter, cel i zakres przetwarzania

**Cel**: świadczenie usługi regional.fit — systemu briefowania i alignmentu strategicznego dla organizacji wielo-lokalizacyjnych.

**Czas trwania**: na czas obowiązywania głównej umowy o świadczenie usługi.

**Charakter operacji**: zbieranie, przechowywanie, modyfikacja, udostępnianie (w ramach organizacji Klienta), eksport, usuwanie.

## 3. Kategorie danych

| Kategoria | Przykłady |
|---|---|
| Dane identyfikacyjne | imię, nazwisko, adres email, rola w organizacji |
| Dane uwierzytelniające | hasło (zaszyfrowane), token sesji |
| Dane operacyjne | treść briefów, decyzji, komentarzy |
| Dane techniczne | adres IP, logi dostępu, audit trail |

## 4. Kategorie osób, których dane dotyczą

Pracownicy, współpracownicy i osoby zaangażowane przez Administratora do korzystania z systemu (w rolach: Club Manager, Validator, Production, Regional Director, CMO, Admin).

## 5. Obowiązki Podmiotu przetwarzającego

Podmiot przetwarzający zobowiązuje się do:

5.1. Przetwarzania danych wyłącznie na udokumentowane polecenie Administratora, chyba że obowiązek prawny stanowi inaczej.

5.2. Zapewnienia, że osoby upoważnione do przetwarzania zobowiązały się do zachowania tajemnicy lub podlegają obowiązkowi tajemnicy ustawowej.

5.3. Wdrożenia odpowiednich środków technicznych i organizacyjnych (art. 32 RODO), w szczególności:
   - Szyfrowanie haseł (bcrypt, 12 rounds)
   - Szyfrowanie komunikacji (TLS 1.2+)
   - Szyfrowanie danych w spoczynku
   - Kontrola dostępu oparta na rolach (RBAC)
   - Audit log operacji modyfikujących dane
   - Regularne backupy (codziennie, retencja 30 dni)
   - Pseudonimizacja gdzie możliwa
   - Regularne testy bezpieczeństwa

5.4. Niezwłocznego (w ciągu 24h) powiadomienia Administratora o naruszeniu ochrony danych osobowych zgodnie z art. 33 RODO.

5.5. Pomocy Administratorowi w wywiązywaniu się z obowiązków:
   - realizacji praw osób, których dane dotyczą (dostęp, sprostowanie, usunięcie, przenoszenie)
   - zgłaszania naruszeń do PUODO
   - oceny skutków dla ochrony danych (DPIA)

5.6. Po zakończeniu świadczenia usługi — usunięcia lub zwrotu wszystkich danych osobowych w ciągu 30 dni, chyba że prawo Unii lub państwa członkowskiego nakazuje przechowywanie.

## 6. Podpowierzenie (podprocesorzy)

Podmiot przetwarzający może korzystać z poniższych podprocesorów:

| Podprocesor | Cel | Lokalizacja | Podstawa transferu (poza EOG) |
|---|---|---|---|
| Vercel Inc. | Hosting | USA / EU | SCC + dodatkowe środki |
| Neon Inc. | Baza danych | EU (Frankfurt) | n/d |
| Anthropic PBC | AI: scoring | USA | SCC + dodatkowe środki |
| Voyage AI | AI: embeddings | USA | SCC + dodatkowe środki |
| Resend Inc. | Email | USA / EU | SCC + dodatkowe środki |
| Sentry | Error monitoring | USA | SCC + dodatkowe środki |

Administrator wyraża zgodę na powyższych podprocesorów. Podmiot przetwarzający poinformuje Administratora z 30-dniowym wyprzedzeniem o zamiarze dodania lub zmiany podprocesora, dając możliwość sprzeciwu.

## 7. Transfer danych poza EOG

Niektórzy podprocesorzy mają siedzibę w USA. Transfer odbywa się w oparciu o:
- Standardowe Klauzule Umowne (SCC) zgodnie z decyzją KE 2021/914
- Dodatkowe środki ochrony (szyfrowanie, kontrola dostępu) zgodnie z wyrokiem Schrems II (C-311/18)

## 8. Audyt

Administrator ma prawo do przeprowadzenia audytu zgodności Podmiotu przetwarzającego z niniejszą umową:
- maksymalnie 1 raz w roku
- po pisemnym uprzedzeniu z 30-dniowym wyprzedzeniem
- na koszt Administratora (chyba że audyt wykaże istotne naruszenia — wtedy na koszt Podmiotu przetwarzającego)

W praktyce audyt może zostać zastąpiony raportami niezależnych audytorów (np. SOC 2, ISO 27001) — gdy będą dostępne.

## 9. Odpowiedzialność

Każda ze stron ponosi odpowiedzialność za szkody wyrządzone na skutek naruszenia obowiązków wynikających z RODO oraz niniejszej umowy, zgodnie z art. 82 RODO.

Łączna odpowiedzialność Podmiotu przetwarzającego ograniczona jest do [KWOTA] PLN za rok kalendarzowy, z wyłączeniem szkód wynikających z winy umyślnej lub rażącego niedbalstwa.

## 10. Postanowienia końcowe

10.1. W sprawach nieuregulowanych zastosowanie mają przepisy RODO, ustawy o ochronie danych osobowych z 10 maja 2018 oraz Kodeksu cywilnego.

10.2. Spory rozstrzyga sąd właściwy dla siedziby Administratora.

10.3. Umowa wchodzi w życie z dniem podpisania przez obie strony.

10.4. Załączniki:
   - Załącznik 1: Środki techniczne i organizacyjne (TOMs)
   - Załącznik 2: Lista podprocesorów (aktualizowana w czasie rzeczywistym pod: regional.fit/legal/subprocessors)

---

**[NAZWA KLIENTA]**

____________________________
[Imię, Nazwisko, Funkcja]
Data: __________________


**[NAZWA OPERATORA]**

____________________________
[Imię, Nazwisko, Funkcja]
Data: __________________
