# -*- coding: utf-8 -*-
"""Wszystkie zmienne obu umów w jednym miejscu. Uzupełnij i uruchom build.py."""

DANE = {
    # --- Twoje dane rejestrowe (CEIDG) ---------------------------------------
    "{FIRMA}": "Let’s Go Bold Przemysław Reszka",
    "{IMIE_NAZWISKO}": "Przemysław Reszka",
    "{ADRES}": "ul. Widna 15 lok. 1, 93-372 Łódź",
    "{NIP}": "7292646007",
    "{REGON}": "383025397",
    "{EMAIL}": "____________________",          # DO UZUPEŁNIENIA — adres do doręczeń
    "{SAD}": "miejscowo właściwy dla miasta Łodzi",

    # --- Parametry NDA -------------------------------------------------------
    "{OKRES_POUFNOSCI}": "5",                  # lata poufności po zakończeniu współpracy
    "{OKRES_ZAKAZU}": "12",                     # miesiące zakazu obchodzenia
    "{KARA_POUFNOSC}": "20 000",
    "{KARA_POUFNOSC_SLOWNIE}": "dwadzieścia tysięcy",
    "{KARA_OBEJSCIE}": "30 000",
    "{KARA_OBEJSCIE_SLOWNIE}": "trzydzieści tysięcy",

    # --- Parametry umowy ramowej --------------------------------------------
    "{TERMIN_PLATNOSCI}": "14",                 # dni od doręczenia faktury
    "{TERMIN_UWAG}": "5",                       # dni roboczych na uwagi do prac
    "{KARA_ZWLOKA}": "1",                       # % wartości Zamówienia za dzień
    "{KARA_ZWLOKA_MAX}": "20",                  # % — limit kar za zwłokę
    "{WYPOWIEDZENIE}": "14",                    # dni wypowiedzenia umowy ramowej
}
