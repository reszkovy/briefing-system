# -*- coding: utf-8 -*-
"""
Słownik interfejsu + mapa adresów dla obu wersji językowych.
Treść stron mieszka w pages/ (PL) i pages/en/ (EN) — tu tylko rama serwisu.
"""

# mapa: slug wewnętrzny -> nazwa pliku w danej wersji
SLUGI = {
    'pl': {
        'index': 'index.html',       'm-typer': 'm-typer.html',
        'o-nas': 'o-nas.html',       'aktualnosci': 'aktualnosci.html',
        'gruzlica': 'gruzlica.html', 'mikrobiologia': 'mikrobiologia.html',
        'badania-br': 'badania-br.html', 'cennik': 'cennik.html',
        'kontakt': 'kontakt.html',
        'nagrody': 'nagrody.html',
        '404': '404.html',
        # dokumenty
        'polityka-jakosci': 'polityka-jakosci.html',
        'polityka-bezstronnosci': 'polityka-bezstronnosci.html',
        'polityka-prywatnosci': 'polityka-prywatnosci.html',
        # podstrony pojedynczych badań
        'badanie-ziehl-neelsen': 'badanie-ziehl-neelsen.html',
        'badanie-lowenstein-jensen': 'badanie-lowenstein-jensen.html',
        'badanie-middlebrook': 'badanie-middlebrook.html',
        'badanie-test-mgit-tbc': 'badanie-test-mgit-tbc.html',
        'badanie-test-niacynowy': 'badanie-test-niacynowy.html',
        'badanie-bactec-sire': 'badanie-bactec-sire.html',
        'badanie-bactec-pza': 'badanie-bactec-pza.html',
        'badanie-bactec-dodatkowe': 'badanie-bactec-dodatkowe.html',
        'badanie-genexpert-rif': 'badanie-genexpert-rif.html',
        'badanie-genexpert-xdr': 'badanie-genexpert-xdr.html',
        'badanie-quantiferon': 'badanie-quantiferon.html',
        'badanie-lc-ms-ms': 'badanie-lc-ms-ms.html',
        'badanie-posiew-kalu': 'badanie-posiew-kalu.html',
        'wpis-dimedical-nawiazalo-wspolprace-z-siecia-laboratoriow-diagnostyka': 'wpis-dimedical-nawiazalo-wspolprace-z-siecia-laboratoriow-diagnostyka.html',
        'wpis-iii-kongres-sbp-polska': 'wpis-iii-kongres-sbp-polska.html',
        'wpis-mamy-to': 'wpis-mamy-to.html',
        'wpis-polska-nagroda-jakosci-2022': 'wpis-polska-nagroda-jakosci-2022.html',
        'wpis-razem-w-ekstraklasie': 'wpis-razem-w-ekstraklasie.html',
        'wpis-swiadectwa-uznania-iso': 'wpis-swiadectwa-uznania-iso.html',
        'wpis-wspieramy-fundacje-fun-and-drive': 'wpis-wspieramy-fundacje-fun-and-drive.html',
        'wpis-wspieramy-sekcje-futsalu': 'wpis-wspieramy-sekcje-futsalu.html',
        'wpis-zawsze-w-13': 'wpis-zawsze-w-13.html',
        'wpis-zlote-serduszko-wylicytowane': 'wpis-zlote-serduszko-wylicytowane.html',
        'wpis-kamien-milowy': 'wpis-kamien-milowy.html',
        'wpis-czlowiek-roku-2020': 'wpis-czlowiek-roku-2020.html',
        'wpis-pionier-diagnostyki': 'wpis-pionier-diagnostyki.html',
        'wpis-biznes-boxing-night': 'wpis-biznes-boxing-night.html',
        'wpis-biznes-z-pasji-do-nauki': 'wpis-biznes-z-pasji-do-nauki.html',
        'wpis-diagnostyka-praca-u-podstaw': 'wpis-diagnostyka-praca-u-podstaw.html',
        'wpis-ewolucja-sukcesu': 'wpis-ewolucja-sukcesu.html',
        'wpis-sponsorujemy-widzew': 'wpis-sponsorujemy-widzew.html',
        'wpis-29-final-wosp': 'wpis-29-final-wosp.html',
    },
    'en': {
        'index': 'index.html',       'm-typer': 'm-typer.html',
        'o-nas': 'about-us.html',    'aktualnosci': 'news.html',
        'gruzlica': 'tuberculosis.html', 'mikrobiologia': 'microbiology.html',
        'badania-br': 'research.html',   'cennik': 'pricing.html',
        'kontakt': 'contact.html',
        'nagrody': 'awards-and-certificates.html',
        '404': '404.html',
        # dokumenty
        'polityka-jakosci': 'quality-policy.html',
        'polityka-bezstronnosci': 'impartiality-policy.html',
        'polityka-prywatnosci': 'privacy-policy.html',
        # podstrony pojedynczych badań
        'badanie-ziehl-neelsen': 'test-ziehl-neelsen.html',
        'badanie-lowenstein-jensen': 'test-lowenstein-jensen.html',
        'badanie-middlebrook': 'test-middlebrook.html',
        'badanie-test-mgit-tbc': 'test-mgit-tbc.html',
        'badanie-test-niacynowy': 'test-niacin.html',
        'badanie-bactec-sire': 'test-bactec-sire.html',
        'badanie-bactec-pza': 'test-bactec-pza.html',
        'badanie-bactec-dodatkowe': 'test-bactec-additional-drugs.html',
        'badanie-genexpert-rif': 'test-genexpert-mtb-rif.html',
        'badanie-genexpert-xdr': 'test-genexpert-mtb-xdr.html',
        'badanie-quantiferon': 'test-quantiferon-tb-gold-plus.html',
        'badanie-lc-ms-ms': 'test-lc-ms-ms-m-typer.html',
        'badanie-posiew-kalu': 'test-stool-culture-salmonella-shigella.html',
        'wpis-dimedical-nawiazalo-wspolprace-z-siecia-laboratoriow-diagnostyka': 'post-dimedical-nawiazalo-wspolprace-z-siecia-laboratoriow-diagnostyka.html',
        'wpis-iii-kongres-sbp-polska': 'post-iii-kongres-sbp-polska.html',
        'wpis-mamy-to': 'post-mamy-to.html',
        'wpis-polska-nagroda-jakosci-2022': 'post-polska-nagroda-jakosci-2022.html',
        'wpis-razem-w-ekstraklasie': 'post-razem-w-ekstraklasie.html',
        'wpis-swiadectwa-uznania-iso': 'post-swiadectwa-uznania-iso.html',
        'wpis-wspieramy-fundacje-fun-and-drive': 'post-wspieramy-fundacje-fun-and-drive.html',
        'wpis-wspieramy-sekcje-futsalu': 'post-wspieramy-sekcje-futsalu.html',
        'wpis-zawsze-w-13': 'post-zawsze-w-13.html',
        'wpis-zlote-serduszko-wylicytowane': 'post-zlote-serduszko-wylicytowane.html',
        'wpis-kamien-milowy': 'post-milestone-achieved.html',
        'wpis-czlowiek-roku-2020': 'post-man-of-the-year-2020.html',
        'wpis-pionier-diagnostyki': 'post-diagnostics-pioneer.html',
        'wpis-biznes-boxing-night': 'post-business-boxing-night.html',
        'wpis-biznes-z-pasji-do-nauki': 'post-business-passion-for-science.html',
        'wpis-diagnostyka-praca-u-podstaw': 'post-diagnostics-grass-roots.html',
        'wpis-ewolucja-sukcesu': 'post-evolution-of-success.html',
        'wpis-sponsorujemy-widzew': 'post-we-sponsor-widzew.html',
        'wpis-29-final-wosp': 'post-29th-final-wosp.html',
    },
}

# ścieżki kanoniczne (bez rozszerzenia) do <link rel="canonical"> i hreflang
# Bez końcowego ukośnika — hosting ma trailingSlash:false i przekierowuje
# adresy z ukośnikiem. Canonical wskazujący na przekierowanie to błąd,
# który wyszukiwarki liczą jako osobny problem.
KANON = {
    'pl': {k: ('' if k == 'index' else v.replace('.html', ''))
           for k, v in SLUGI['pl'].items()},
    'en': {k: ('en' if k == 'index' else 'en/' + v.replace('.html', ''))
           for k, v in SLUGI['en'].items()},
}

UI = {
    'pl': dict(
        lang='pl', locale='pl_PL',
        skip='Przejdź do treści', ariaLang='Wybór języka',
        ariaLogo='DiMedical — strona główna', tagline='Centrum Medycyny Klinicznej',
        nOnas='O nas', nNews='Aktualności', nOferta='Oferta',
        nTbc='Gruźlica', nMikro='Mikrobiologia', nBr='Badania B+R',
        oTbc='Diagnostyka prątka metodą FIA-MS/MS',
        oMikro='Posiewy i diagnostyka zakażeń',
        oBr='Projekty rozwojowe i walidacje',
        nCennik='Cennik', nLok='Lokalizacja', nKontakt='Kontakt',
        cta='Umów badanie',
        fOpis='Centrum Medycyny Klinicznej DiMedical — innowacyjna spółka biomedyczna '
              'działająca w obszarze diagnostyki laboratoryjnej i badań B+R.',
        fSerwis='Serwis', fDok='Dokumenty', fNagrody='Nagrody i certyfikaty',
        fPriv='Polityka prywatności', fJakosc='Deklaracja polityki jakości',
        fBezstr='Deklaracja bezstronności i poufności',
        fLab='laboratorium', fSiedziba='siedziba',
        fUe='Projekt dofinansowany ze środków Unii Europejskiej.',
        fCredit='projekt serwisu i wdrożenie',
        ariaTel='Zadzwoń', ariaMail='Napisz do nas',
        mZamknij='Zamknij menu', mMenu='Menu główne',
        cTytul='Ta strona używa plików cookies',
        cOpis='Niezbędne pliki zapewniają działanie serwisu. Pozostałe wykorzystujemy wyłącznie za Twoją zgodą — możesz ją w każdej chwili wycofać. Szczegóły opisuje',
        cAkceptuj='Akceptuję wszystkie', cOdrzuc='Tylko niezbędne',
    ),
    'en': dict(
        lang='en', locale='en_GB',
        skip='Skip to content', ariaLang='Language selection',
        ariaLogo='DiMedical — home', tagline='Clinical Medicine Centre',
        nOnas='About us', nNews='News', nOferta='Services',
        nTbc='Tuberculosis', nMikro='Microbiology', nBr='R&D',
        oTbc='Mycobacteria detection by FIA-MS/MS',
        oMikro='Cultures and infection diagnostics',
        oBr='Development projects and validation',
        nCennik='Pricing', nLok='Location', nKontakt='Contact',
        cta='Book a test',
        fOpis='DiMedical Clinical Medicine Centre — an innovative biomedical company '
              'operating in laboratory diagnostics and R&D.',
        fSerwis='Site', fDok='Documents', fNagrody='Awards and certificates',
        fPriv='Privacy policy', fJakosc='Declaration of quality policy',
        fBezstr='Declaration of impartiality and confidentiality',
        fLab='laboratory', fSiedziba='head office',
        fUe='The project is co-financed by the European Union.',
        fCredit='design and development by',
        ariaTel='Call us', ariaMail='Write to us',
        mZamknij='Close menu', mMenu='Main menu',
        cTytul='This site uses cookies',
        cOpis='Essential cookies keep the site working. We use the rest only with your consent, which you can withdraw at any time. Details are described in our',
        cAkceptuj='Accept all', cOdrzuc='Essential only',
    ),
}


def kontekst(lang: str, slug: str) -> dict:
    """Buduje komplet podstawień dla ramy serwisu."""
    s = SLUGI[lang]
    # z podkatalogu en/ do assetów w katalogu głównym
    a = '../' if lang == 'en' else ''
    drugi = 'en' if lang == 'pl' else 'pl'

    # odpowiednik tej samej strony w drugim języku
    if slug in SLUGI[drugi]:
        alt = SLUGI[drugi][slug]
        alt_href = ('en/' + alt) if drugi == 'en' else ('../' + alt)
    else:
        alt = SLUGI[drugi]['aktualnosci']
        alt_href = ('en/' + alt) if drugi == 'en' else ('../' + alt)

    ctx = dict(UI[lang])
    ctx.update({
        'a': a,
        'home': s['index'], 'mtyper': s['m-typer'], 'onas': s['o-nas'],
        'news': s['aktualnosci'], 'tbc': s['gruzlica'], 'mikro': s['mikrobiologia'],
        'br': s['badania-br'], 'cennik': s['cennik'], 'kontakt': s['kontakt'],
        'nagrody': s['nagrody'],
        'dPriv': s['polityka-prywatnosci'], 'dJakosc': s['polityka-jakosci'],
        'dBezstr': s['polityka-bezstronnosci'],
        'plHref': s['index'] if lang == 'pl' else alt_href,
        'enHref': alt_href if lang == 'pl' else s['index'],
        'plOn': ' class="on"' if lang == 'pl' else '',
        'enOn': ' class="on"' if lang == 'en' else '',
        '_alt': alt_href,
    })
    return ctx
