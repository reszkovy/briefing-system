# Polityka Prywatności — regional.fit

**Wersja**: 1.0
**Obowiązuje od**: [DATA WDROŻENIA]
**Operator**: [NAZWA FIRMY], NIP [NIP], z siedzibą w [ADRES]

---

> ⚠️ **Template do uzupełnienia**. Skonsultuj z prawnikiem przed publikacją.
> Przed wdrożeniem uzupełnij: dane operatora, dane kontaktowe IOD, datę wdrożenia, listę podprocesorów (Anthropic, Voyage, Resend, Vercel, Neon, Sentry), retencję per typ danych.

---

## 1. Administrator danych

Administratorem Twoich danych osobowych jest **[NAZWA FIRMY]**, z siedzibą w [ADRES], wpisana do [REJESTR], NIP [NIP], REGON [REGON] (dalej: „Administrator").

**Kontakt**: [EMAIL]
**Inspektor Ochrony Danych (jeśli powołany)**: [EMAIL IOD]

## 2. Zakres przetwarzania

W ramach świadczenia usługi regional.fit (system briefowania i alignmentu strategicznego) przetwarzamy następujące kategorie danych osobowych:

- **Dane konta**: imię, nazwisko, adres email, hasło (zaszyfrowane bcrypt), rola w organizacji
- **Dane operacyjne**: treść briefów, komentarzy, decyzji walidacyjnych, plików/linków załączonych do briefów
- **Dane techniczne**: adres IP, typ przeglądarki, czas dostępu, logi błędów (Sentry)
- **Dane analityczne (opcjonalne)**: ścieżki nawigacji w aplikacji (PostHog, tylko po wyrażeniu zgody)

## 3. Cele i podstawy prawne

| Cel przetwarzania | Podstawa prawna (RODO) |
|---|---|
| Świadczenie usługi (logowanie, briefy, decyzje) | Art. 6(1)(b) — wykonanie umowy |
| Bezpieczeństwo (audit log, Sentry) | Art. 6(1)(f) — uzasadniony interes |
| Komunikacja transakcyjna (email o briefach) | Art. 6(1)(b) — wykonanie umowy |
| Analityka produktowa (opcjonalna) | Art. 6(1)(a) — zgoda |
| Wypełnienie obowiązków księgowych/podatkowych | Art. 6(1)(c) — obowiązek prawny |

## 4. Okres przechowywania

- **Dane konta**: przez czas obowiązywania umowy + 12 miesięcy
- **Dane operacyjne** (briefy, decyzje): zgodnie z polityką klienta, domyślnie 5 lat dla audytu
- **Logi techniczne**: 90 dni (Sentry), 30 dni (logi aplikacyjne)
- **Dane analityczne**: do momentu cofnięcia zgody

## 5. Odbiorcy danych (podprocesorzy)

W celu świadczenia usługi korzystamy z poniższych podmiotów (procesorów):

| Podmiot | Cel | Lokalizacja | DPA |
|---|---|---|---|
| **Vercel Inc.** | Hosting aplikacji | USA / EU | [link DPA] |
| **Neon Inc.** | Baza danych | EU (Frankfurt) | [link DPA] |
| **Anthropic PBC** | AI: alignment scoring | USA | [link DPA] |
| **Voyage AI** | AI: embeddings | USA | [link DPA] |
| **Resend Inc.** | Email transakcyjny | USA / EU | [link DPA] |
| **Sentry / Functional Software** | Error monitoring | USA | [link DPA] |

⚠️ Niektóre podmioty mają siedzibę w USA. Stosujemy Standardowe Klauzule Umowne (SCC) zgodnie z decyzją KE 2021/914 oraz dodatkowe środki ochrony zgodnie z wyrokiem Schrems II.

## 6. Twoje prawa

Zgodnie z RODO przysługują Ci następujące prawa:

- **Prawo dostępu** (art. 15) — możesz pobrać kopię swoich danych przez `/api/account/export`
- **Prawo do sprostowania** (art. 16) — możesz edytować dane konta w ustawieniach
- **Prawo do usunięcia** (art. 17) — możesz usunąć konto przez `/api/account/delete`
- **Prawo do ograniczenia przetwarzania** (art. 18)
- **Prawo do przenoszenia danych** (art. 20) — eksport w formacie JSON i CSV
- **Prawo sprzeciwu** (art. 21)
- **Prawo skargi do PUODO** (Prezes Urzędu Ochrony Danych Osobowych, [puodo.gov.pl](https://uodo.gov.pl))

W celu realizacji praw skontaktuj się: [EMAIL]

## 7. Bezpieczeństwo

Stosujemy następujące środki techniczne i organizacyjne:

- Szyfrowanie haseł (bcrypt, 12 rounds)
- HTTPS/TLS dla całej komunikacji
- Szyfrowanie danych w spoczynku (Neon)
- Kontrola dostępu rolą (CLUB_MANAGER / VALIDATOR / PRODUCTION / REGIONAL_DIRECTOR / CMO / ADMIN)
- Audit log każdej operacji modyfikującej dane
- Regularne backupy (codziennie, retencja 30 dni)
- Monitoring błędów (Sentry) i dostępności (UptimeRobot)
- Polityka silnych haseł (min. 8 znaków)

## 8. Cookies

Aplikacja korzysta z następujących plików cookies:

- **Niezbędne** (zawsze aktywne): sesja logowania (NextAuth)
- **Funkcjonalne** (opcjonalne): zapamiętywanie ustawień motywu (dark/light)
- **Analityczne** (po zgodzie): PostHog — tylko jeśli wyrazisz zgodę w banerze

## 9. Zmiany polityki

Zastrzegamy prawo do zmian niniejszej polityki. O istotnych zmianach poinformujemy mailowo z 30-dniowym wyprzedzeniem.

## 10. Kontakt

W sprawach związanych z ochroną danych:
- Email: [EMAIL]
- Pisemnie: [ADRES POCZTOWY]

---

**Ostatnia aktualizacja**: [DATA]
