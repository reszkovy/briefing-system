#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DiMedical — generator serwisu.
Skleja współdzielony shell (_head/_nav/_foot) z treścią z pages/*.html.

Uruchomienie:  python3 build.py
"""
import re
from pathlib import Path

from i18n import SLUGI, KANON, UI, kontekst

ROOT = Path(__file__).parent

HEAD = (ROOT / '_head.html').read_text(encoding='utf-8')
NAV  = (ROOT / '_nav.html').read_text(encoding='utf-8')
FOOT = (ROOT / '_foot.html').read_text(encoding='utf-8')

# Adres, pod którym serwis faktycznie stoi — z niego biorą się canonical,
# hreflang i sitemapa. Przy przekazaniu klientowi zmienić na https://dimedical.pl
SITE = 'https://dimedical.vercel.app'

# False = wersja pokazowa: noindex + Disallow, nie wchodzi do wyszukiwarek.
# True  = wersja docelowa: pełne indeksowanie (tego wymaga ocena SEO 100/100).
INDEKSOWANIE = True

PAGES = [
    dict(slug='index', nav='',
         file='_content_index.html',
         title_en='DiMedical Clinical Medicine Centre — diagnostics, microbiology, R&D',
         desc_en='DiMedical — an innovative biomedical company from Łódź, Poland. Laboratory diagnostics based on mass spectrometry, molecular biology, genetics and microbiology.',
         title='Centrum Medycyny Klinicznej DiMedical — diagnostyka, mikrobiologia, badania B+R',
         desc='DiMedical — innowacyjna spółka biomedyczna z Łodzi. Diagnostyka laboratoryjna '
              'oparta na spektrometrii mas, biologii molekularnej, genetyce i mikrobiologii.'),
    dict(slug='m-typer', nav='m-typer',
         title_en='M-Typer — rapid mycobacteria diagnostics by FIA-MS/MS | DiMedical',
         desc_en='M-Typer is an innovative diagnostic technology by DiMedical using tandem mass spectrometry (FIA-MS/MS) and mycolic acid analysis to identify and differentiate Mycobacterium (MTBC and NTM).',
         title='M-Typer — szybka diagnostyka prątków metodą FIA-MS/MS | DiMedical',
         desc='M-Typer to innowacyjna technologia diagnostyczna DiMedical wykorzystująca tandemową '
              'spektrometrię mas (FIA-MS/MS) i analizę kwasów mikolowych do identyfikacji '
              'i różnicowania prątków z rodzaju Mycobacterium (MTBC i NTM).'),
    dict(slug='o-nas', nav='o-nas',
         title_en='About us — team and experience | DiMedical',
         desc_en='The DiMedical team consists of specialists in microbiological and molecular diagnostics, laboratory diagnosticians, microbiologists and biotechnologists.',
         title='O nas — zespół i doświadczenie | DiMedical',
         desc='Kadrę DiMedical tworzą specjaliści diagnostyki mikrobiologicznej i molekularnej, '
              'diagności laboratoryjni, mikrobiolodzy i biotechnolodzy.'),
    dict(slug='aktualnosci', nav='aktualnosci',
         title_en='News | DiMedical',
         desc_en='Partnerships, awards, research projects and initiatives supported by DiMedical Clinical Medicine Centre.',
         title='Aktualności | DiMedical',
         desc='Współprace, nagrody, projekty badawcze i inicjatywy wspierane przez '
              'Centrum Medycyny Klinicznej DiMedical.'),
    dict(slug='gruzlica', nav='gruzlica',
         title_en='Tuberculosis — innovative diagnostics | DiMedical',
         desc_en='DiMedical has developed and patented an innovative method of diagnosing tuberculosis: a simpler process, shorter time and reduced cost.',
         title='Gruźlica — innowacyjna diagnostyka | DiMedical',
         desc='DiMedical opracowało i opatentowało innowacyjną metodę diagnostyczną gruźlicy: '
              'uproszczenie procesu, skrócenie czasu i redukcja kosztów.'),
    dict(slug='mikrobiologia', nav='mikrobiologia',
         title_en='Microbiology — Salmonella / Shigella stool culture | DiMedical',
         desc_en='Diagnostics of bacterial gastrointestinal infections. Stool culture for Salmonella and Shigella at the DiMedical laboratory in Łódź.',
         title='Mikrobiologia — posiew w kierunku Salmonella / Shigella | DiMedical',
         desc='Diagnostyka zakażeń bakteryjnych przewodu pokarmowego. Posiew kału w kierunku '
              'pałeczek Salmonella i Shigella w laboratorium DiMedical w Łodzi.'),
    dict(slug='badania-br', nav='badania-br',
         title_en='R&D — tuberculosis and mycobacteriosis diagnostics | DiMedical',
         desc_en='R&D project POIR.01.01.01-00-0798/16: a high-throughput, sensitive and rapid diagnostic method based on mycolic acid profiling.',
         title='Badania B+R — diagnostyka gruźlicy i mykobakterioz | DiMedical',
         desc='Projekt badawczo-rozwojowy POIR.01.01.01-00-0798/16: wysokoprzepustowa, czuła '
              'i szybka metoda diagnostyczna oparta o analizę profili kwasów mykolowych.'),
    dict(slug='cennik', nav='cennik',
         title_en='Pricing | DiMedical',
         desc_en='DiMedical test pricing — microbiology, tuberculosis diagnostics and research projects.',
         title='Cennik badań | DiMedical',
         desc='Cennik badań DiMedical — mikrobiologia, diagnostyka gruźlicy oraz projekty '
              'badawczo-rozwojowe.'),
    dict(slug='kontakt', nav='kontakt',
         title_en='Contact | DiMedical Łódź, Żeromskiego 52',
         desc_en='Contact DiMedical Clinical Medicine Centre: Żeromskiego 52, 90-626 Łódź, Poland, +48 502 660 480, kontakt@dimedical.pl.',
         title='Kontakt | DiMedical Łódź, ul. Żeromskiego 52',
         desc='Skontaktuj się z Centrum Medycyny Klinicznej DiMedical: ul. Żeromskiego 52, '
              '90-626 Łódź, +48 502 660 480, kontakt@dimedical.pl.'),
    dict(slug='nagrody', nav='',
         title='Nagrody i certyfikaty | DiMedical',
         desc='Polska Nagroda Inteligentnego Rozwoju, Fundament 2020 i 2021, Polska Nagroda '
              'Innowacyjności, QCMD, MADE IN POLAND, INSTAND, POLMICRO i Polska Nagroda Jakości.',
         title_en='Awards and certificates | DiMedical',
         desc_en='Polish Intelligent Development Award, Fundament 2020 and 2021, Polish Innovation '
                 'Award, QCMD, MADE IN POLAND, INSTAND, POLMICRO and the Polish Quality Award.'),
    dict(slug='404', nav='',
         title='Nie znaleziono strony | DiMedical',
         desc='Tej strony nie ma pod wskazanym adresem.',
         title_en='Page not found | DiMedical',
         desc_en='This page does not exist at the given address.'),
    # ── dokumenty ──
    dict(slug='polityka-jakosci', nav='',
         title='Deklaracja polityki jakości | DiMedical',
         desc='Fundamentem działalności DiMedical jest realizowanie świadczeń zdrowotnych w zakresie diagnostyki laboratoryjnej oraz działalność badawczo-rozwojowa.',
         title_en='Declaration of quality policy | DiMedical',
         desc_en='The foundation of DiMedical is providing health services in laboratory diagnostics and conducting research and development.'),
    dict(slug='polityka-bezstronnosci', nav='',
         title='Deklaracja polityki bezstronności i poufności | DiMedical',
         desc='Laboratorium DiMedical prowadzi działania w sposób bezstronny, uczciwy i niezależny, z zachowaniem poufności powierzonych informacji.',
         title_en='Declaration of impartiality and confidentiality policy | DiMedical',
         desc_en='The DiMedical laboratory operates impartially, fairly and independently, maintaining the confidentiality of entrusted information.'),
    dict(slug='polityka-prywatnosci', nav='',
         title='Polityka prywatności | DiMedical',
         desc='Zasady przetwarzania danych osobowych w serwisie dimedical.pl — zakres, cele, podstawy prawne, odbiorcy danych i prawa osób, których dane dotyczą.',
         title_en='Privacy policy | DiMedical',
         desc_en='Rules for processing personal data on dimedical.pl — scope, purposes, legal bases, recipients and the rights of data subjects.'),
    # ── podstrony pojedynczych badań ──
    dict(slug='badanie-ziehl-neelsen', nav='gruzlica',
         title='Rozmaz Ziehl-Neelsena — Gruźlica | DiMedical',
         desc='Badanie barwione metodą Ziehl-Neelsena jest kluczowym narzędziem diagnostycznym w wykrywaniu prątków kwasoopornych, w tym Mycobacterium tuberculosis –…',
         title_en='Ziehl-Neelsen stained smear — Tuberculosis | DiMedical',
         desc_en='The Ziehl-Neelsen staining test is a key diagnostic tool for detecting acid-fast bacilli, including Mycobacterium tuberculosis—the primary causative agent…'),
    dict(slug='badanie-lowenstein-jensen', nav='gruzlica',
         title='Hodowla Löwensteina-Jensena — Gruźlica | DiMedical',
         desc='Hodowla na podłożu Löwensteina-Jensena jest standardowym badaniem mikrobiologicznym stosowanym do izolacji i identyfikacji prątków kwasoopornych, w tym…',
         title_en='Culture on Löwenstein-Jensen medium — Tuberculosis | DiMedical',
         desc_en='The culture on Löwenstein-Jensen medium is a standard microbiological test used for the isolation and identification of acid-fast bacilli, including…'),
    dict(slug='badanie-middlebrook', nav='gruzlica',
         title='Hodowla Middlebrooka — Gruźlica | DiMedical',
         desc='Hodowla na podłożu płynnym Middlebrooka (7H9) w systemie automatycznym BACTEC MGIT jest stosowana w celu izolacji i identyfikacji prątków kwasoopornych, w…',
         title_en='Culture on Middlebrook medium — Tuberculosis | DiMedical',
         desc_en='Liquid culture using Middlebrook 7H9 medium in the automated BACTEC MGIT system is employed for the isolation and identification of acid-fast bacilli,…'),
    dict(slug='badanie-test-mgit-tbc', nav='gruzlica',
         title='Test identyfikacyjny MGIT TBc — Gruźlica | DiMedical',
         desc='Identyfikacyjny test immunochromatograficzny jest stosowany do jakościowego wykrywania antygenu MPT64, wydzielanego przez prątki Mycobacterium…',
         title_en='Immunochromatographic identification test — Tuberculosis | DiMedical',
         desc_en='The immunochromatographic identification test is used for the qualitative detection of the MPT64 antigen, secreted by Mycobacterium tuberculosis complex…'),
    dict(slug='badanie-test-niacynowy', nav='gruzlica',
         title='Test niacynowy — Gruźlica | DiMedical',
         desc='Test niacynowy jest stosowany w celu identyfikacji Mycobacterium tuberculosis poprzez ocenę zdolności prątków do metabolizowania kwasu nikotynowego.…',
         title_en='Niacin test — Tuberculosis | DiMedical',
         desc_en='The niacin test is used to identify Mycobacterium tuberculosis by assessing the bacilli’s ability to metabolize nicotinic acid (niacin). Indications for…'),
    dict(slug='badanie-bactec-sire', nav='gruzlica',
         title='BACTEC MGIT 960 SIRE — Gruźlica | DiMedical',
         desc='BACTEC MGIT 960 SIRE to jakościowa metoda oceny wrażliwości prątków Mycobacterium tuberculosis na podstawowe leki przeciwgruźlicze pierwszego rzutu. Test…',
         title_en='BACTEC MGIT 960 SIRE — Tuberculosis | DiMedical',
         desc_en='BACTEC MGIT 960 SIRE is a qualitative method for assessing the susceptibility of Mycobacterium tuberculosis to first-line anti-tuberculosis drugs. The…'),
    dict(slug='badanie-bactec-pza', nav='gruzlica',
         title='BACTEC MGIT 960 PZA — Gruźlica | DiMedical',
         desc='BACTEC MGIT 960 PZA to jakościowa metoda oceny lekowrażliwości prątków Mycobacterium tuberculosis na pyrazynamid (PZA), jeden z kluczowych leków…',
         title_en='BACTEC MGIT 960 PZA — Tuberculosis | DiMedical',
         desc_en='BACTEC MGIT 960 PZA is a qualitative method for assessing the susceptibility of Mycobacterium tuberculosis to pyrazinamide (PZA), one of the key…'),
    dict(slug='badanie-bactec-dodatkowe', nav='gruzlica',
         title='BACTEC MGIT 960 — leki dodatkowe — Gruźlica | DiMedical',
         desc='BACTEC MGIT 960 to jakościowa metoda oceny lekowrażliwości prątków Mycobacterium tuberculosis na dodatkowe leki przeciwgruźlicze stosowane w terapii…',
         title_en='BACTEC MGIT 960 — second-line drugs — Tuberculosis | DiMedical',
         desc_en='BACTEC MGIT 960 is a qualitative method for assessing the susceptibility of Mycobacterium tuberculosis to additional anti-tuberculosis drugs used in the…'),
    dict(slug='badanie-genexpert-rif', nav='gruzlica',
         title='GeneXpert MTB/RIF — Gruźlica | DiMedical',
         desc='GeneXpert MTB/RIF to zaawansowana, zautomatyzowana metoda diagnostyczna oparta na technologii PCR. Jest stosowana w celu szybkiego wykrycia prątków…',
         title_en='GeneXpert MTB/RIF — Tuberculosis | DiMedical',
         desc_en='GeneXpert MTB/RIF is an advanced, automated diagnostic method based on PCR technology. It is used for the rapid detection of Mycobacterium tuberculosis…'),
    dict(slug='badanie-genexpert-xdr', nav='gruzlica',
         title='GeneXpert MTB/XDR — Gruźlica | DiMedical',
         desc='GeneXpert MTB/XDR to zaawansowana, zautomatyzowana metoda diagnostyczna oparta na technologii PCR, umożliwiająca szybkie wykrycie prątków Mycobacterium…',
         title_en='GeneXpert MTB/XDR — Tuberculosis | DiMedical',
         desc_en='GeneXpert MTB/XDR is an advanced, automated diagnostic method based on PCR technology, enabling the rapid detection of Mycobacterium tuberculosis and its…'),
    dict(slug='badanie-quantiferon', nav='gruzlica',
         title='Quantiferon-TB Gold Plus — Gruźlica | DiMedical',
         desc='Quantiferon-TB Gold Plus to zaawansowany, czuły i specyficzny test pośredni służący do wykrywania utajonego zakażenia Mycobacterium tuberculosis.…',
         title_en='Quantiferon-TB Gold Plus — Tuberculosis | DiMedical',
         desc_en='Quantiferon-TB Gold Plus is an advanced, sensitive, and specific indirect test used to detect latent Mycobacterium tuberculosis infection. Indications for…'),
    dict(slug='badanie-lc-ms-ms', nav='gruzlica',
         title='LC-MS/MS — M-Typer — Gruźlica | DiMedical',
         desc='LC-MS/MS – M-Typer to innowacyjna metoda diagnostyczna, wykorzystująca wysokosprawną chromatografię cieczową sprzężoną z tandemową spektrometrią mas…',
         title_en='LC-MS/MS — M-Typer — Tuberculosis | DiMedical',
         desc_en='LC-MS/MS – M-Typer is an innovative diagnostic method that uses high-performance liquid chromatography coupled with tandem mass spectrometry (LC-MS/MS) to…'),
    dict(slug='badanie-posiew-kalu', nav='mikrobiologia',
         title='Posiew kału — Salmonella / Shigella — Mikrobiologia | DiMedical',
         desc='Największym wskazaniem do wykonania badania jest ostry przebieg choroby, w tym obecność krwi lub śluzu w kale. Do najczęstszych objawów występujących w…',
         title_en='Stool culture — Salmonella / Shigella — Microbiology | DiMedical',
         desc_en='The greatest indication for the examination is the acute course of the disease, including the presence of blood or mucus in the stool. The most common…'),
    dict(slug='wpis-dimedical-nawiazalo-wspolprace-z-siecia-laboratoriow-diagnostyka', nav='aktualnosci',
         title_en='DiMedical has established a partnership with the Diagnostyka laboratory network | DiMedical',
         desc_en='We are pleased to announce that we have begun cooperation with Diagnostyka, the largest provider of laboratory diagnostic services in Poland. As a res...',
         title='DiMedical nawiązało współpracę z siecią laboratoriów Diagnostyka | DiMedical',
         desc='Z przyjemnością informujemy, że rozpoczęliśmy współpracę z siecią laboratoriów Diagnostyka, największym dostawcą usług diagnostyki laboratoryjnej w Po...'),
    dict(slug='wpis-polska-nagroda-jakosci-2022', nav='aktualnosci',
         title_en='Polish Quality Award 2022 | DiMedical',
         desc_en='The Polish Quality Award is an economic award granted to companies that demonstrate high management standards in their working environment and offer c...',
         title='Polska Nagroda Jakości 2022 | DiMedical',
         desc='Polska Nagroda Jakości jest nagrodą gospodarczą przyznawaną firmom, które prezentują wysokie standardy zarządzania w swoim środowisku pracy, a także o...'),
    dict(slug='wpis-swiadectwa-uznania-iso', nav='aktualnosci',
         title_en='ISO certificates of recognition | DiMedical',
         desc_en='We place great emphasis on quality and working standards in our laboratory. Thanks to the commitment of the DiMedical team, we obtained two laboratory...',
         title='Świadectwa uznania ISO | DiMedical',
         desc='Przykładamy ogromną wagę do jakości i standardów pracy w naszym laboratorium. Dzięki zaangażowaniu pracowników Centrum Medycyny Klinicznej DiMedical u...'),
    dict(slug='wpis-mamy-to', nav='aktualnosci',
         title_en='We did it! | DiMedical',
         desc_en='Based on the latest advances in analytical chemistry (mass spectrometry), the DiMedical laboratory has developed an innovative method that detects tub...',
         title='Mamy to! | DiMedical',
         desc='Laboratorium DiMedical, w oparciu o najnowsze osiągnięcia z zakresu chemii analitycznej (spektrometrii mas), opracowało innowacyjną metodę wykrywająca...'),
    dict(slug='wpis-razem-w-ekstraklasie', nav='aktualnosci',
         title_en='Together in the top league! | DiMedical',
         desc_en='DiMedical Clinical Medicine Centre has extended its cooperation with Widzew Łódź and in the 2022/23 season will remain the club\'s Strategic Sponsor....',
         title='Razem w ekstraklasie! | DiMedical',
         desc='Centrum Medycyny Klinicznej DiMedical przedłużyło współpracę z Widzewem Łódź i w sezonie 2022/23 pozostanie Sponsorem Strategicznym Klubu z alei Piłsu...'),
    dict(slug='wpis-zawsze-w-13', nav='aktualnosci',
         title_en='Always in 13! | DiMedical',
         desc_en='Last week, at the invitation of RTS Widzew Łódź, we took part in the „Always in 13” gala held in the Heart of Łódź. The President of DiMedical Clinica...',
         title='Zawsze w 13! | DiMedical',
         desc='W ubiegłym tygodniu na zaproszenie RTS Widzew Łódź wzięliśmy udział w Gali „Zawsze w 13”, która odbyła się w Sercu Łodzi🇦🇹 Prezes Centrum Medycyny Kli...'),
    dict(slug='wpis-wspieramy-fundacje-fun-and-drive', nav='aktualnosci',
         title_en='Supporting the Fun and Drive foundation | DiMedical',
         desc_en='We love supporting initiatives like this. DiMedical Clinical Medicine Centre donated funds to the FUN and DRIVE Foundation. Thanks to the support and ...',
         title='Wspieramy fundację Fun and Drive | DiMedical',
         desc='Kochamy wspierać takie inicjatywy! Centrum Medycyny Klinicznej DiMedical przekazało środki finansowe Fundacji FUN and DRIVE. Dzięki wsparciu i zaangaż...'),
    dict(slug='wpis-iii-kongres-sbp-polska', nav='aktualnosci',
         title_en='3rd SBP Poland Congress | DiMedical',
         desc_en='On 15 March the third edition of the Sport Business Poland Congress took place in Warsaw. As a partner of the event we can safely say that the develop...',
         title='III Kongres SBP Polska | DiMedical',
         desc='15 marca w Warszawie odbyła się trzecia edycja Kongresu Sport Biznes Polska. Jako partner wydarzenia możemy śmiało powiedzieć, że rozwój polskiego spo...'),
    dict(slug='wpis-zlote-serduszko-wylicytowane', nav='aktualnosci',
         title_en='Golden heart won at auction! | DiMedical',
         desc_en='During Sunday\'s finale held at the Culture Centre, the WOŚP Golden Heart was won at auction by our company. We are delighted with the winning bid and ...',
         title='Złote serduszko wylicytowane! | DiMedical',
         desc='Podczas niedzielnego finału organizowanego w Centrum Kultury Złote Serduszko WOŚP zostało wylicytowane przez naszą firmę! Cieszymy się ze zwycięskiej ...'),

    # ── wpisy uzupełnione z archiwum dimedical.pl ──
    dict(slug='wpis-kamien-milowy', nav='aktualnosci',
         title='Kamień milowy osiągnięty | DiMedical',
         desc='Po ponad roku pracy można powiedzieć – mamy to! Jesteśmy w stanie identyfikować drobnoustroje odpowiedzialne za rozwój gruźlicy i innych mykobakterioz u…',
         title_en='Milestone achieved | DiMedical',
         desc_en='After more than a year of work, you can say – we have it! We are able to identify microorganisms responsible for the development of tuberculosis and other…'),
    dict(slug='wpis-czlowiek-roku-2020', nav='aktualnosci',
         title='Człowiek roku 2020! | DiMedical',
         desc='Doktor n. med. Karol Majewski został wybrany jednogłośnie CZŁOWIEKIEM ROKU 2020 redakcji Panorama Gospodarcza.',
         title_en='Man of the year 2020! | DiMedical',
         desc_en='Karol Majewski, MD, PhD was unanimously elected THE MAN OF THE YEAR 2020 by the editorial office of Panorama Gospodarcza.'),
    dict(slug='wpis-pionier-diagnostyki', nav='aktualnosci',
         title='Pionier diagnostyki | DiMedical',
         desc='Centrum Medycyny Klinicznej DiMedical Sp. z o.o. jest dziełem jednego człowieka – doktora nauk medycznych Karola Majewskiego, diagnosty laboratoryjnego,…',
         title_en='Diagnostics pioneer | DiMedical',
         desc_en='Centrum Medycyny Klinycznej DiMedical Sp. z o.o. is the work of one man – MD, PhD. Karol Majewski, laboratory diagnostician, microbiologist specializing…'),
    dict(slug='wpis-biznes-boxing-night', nav='aktualnosci',
         title='Biznes Boxing Night | DiMedical',
         desc='W dniu wczorajszym w łódzkim klubie Teatr odbyła się kolejna edycja Gali Biznes Boxing Night organizowanej przez Biznes Boxing Polska. Biznes Boxing…',
         title_en='Business Boxing Night | DiMedical',
         desc_en='Yesterday, another edition of the Biznes Boxing Night Gala organized by Biznes Boxing Polska took place in the Teatr club in Lodz. Biznes Boxing Polska is…'),
    dict(slug='wpis-biznes-z-pasji-do-nauki', nav='aktualnosci',
         title='Biznes z pasji do nauki | DiMedical',
         desc='W najnowszym numerze magazynu Forbes ukazała się publikacja, w której Doktor n. med. Karol Majewski opowiada o tym jak pogodzić rolę diagnosty…',
         title_en='Business with a passion for science | DiMedical',
         desc_en='In the latest issue of Forbes magazine there is a publication in which MD, PhD. Karol Majewski talks about how to reconcile the roles of a microbiologist,…'),
    dict(slug='wpis-diagnostyka-praca-u-podstaw', nav='aktualnosci',
         title='Diagnostyka pracą u podstaw! | DiMedical',
         desc='Zapraszamy do krótkiej lektury, gdzie dr n.med. Karol Majewski miał okazję porozmawiać z Panią Dorotą Solczak na temat walki z pandemią i zmian, które się…',
         title_en='Diagnostics work at the grass roots! | DiMedical',
         desc_en='We invite you to a short read, where MD, PhD. Karol Majewski had the opportunity to talk to Ms Dorota Solczak about the fight against the pandemic and the…'),
    dict(slug='wpis-ewolucja-sukcesu', nav='aktualnosci',
         title='Ewolucja sukcesu | DiMedical',
         desc='O pasji i wielu latach badań zwieńczonych sukcesem w postaci Polskiej Nagrody Innowacyjności 2019 mówi prezes i właściciel firmy dr n. med. Karol…',
         title_en='The evolution of success | DiMedical',
         desc_en='About passion and many years of research crowned with success in the form of the Polish Innovation Award 2019, says the president and owner of the…'),
    dict(slug='wpis-sponsorujemy-widzew', nav='aktualnosci',
         title='Sponsorujemy Łódzki Widzew! | DiMedical',
         desc='Firma DiMedical dołączyła do grona partnerów Widzewa Łódź z początkiem bieżącego sezonu, a w październiku 2021 r. była Sponsorem Strategicznym Widzewa…',
         title_en='We sponsor the Lodz Widzew! | DiMedical',
         desc_en='DiMedical joined the group of Widzew Lodz partners at the beginning of the current season, and in October 2021 it was the Strategic Sponsor of Widzew Lodz…'),
    dict(slug='wpis-29-final-wosp', nav='aktualnosci',
         title='29 Finał WOŚP | DiMedical',
         desc='Zostajemy sponsorem głównym 29. Finału WOŚP w Błaszkach !',
         title_en='29th Final of the Great Orchestra of Christmas Charity | DiMedical',
         desc_en='We are becoming the main sponsor of the 29th Grand Finale of the Great Orchestra of Christmas Charity in Błaszki!'),
    dict(slug='wpis-wspieramy-sekcje-futsalu', nav='aktualnosci',
         title_en='Supporting the futsal section! | DiMedical',
         desc_en='A day after announcing the sponsorship agreement with the football section, we have more news for you. DiMedical Clinical Medicine Centre has become a...',
         title='Wspieramy sekcję Futsalu! | DiMedical',
         desc='Dzień po ogłoszeniu umowy sponsorskiej z sekcją piłki nożnej mamy dla Was kolejną informacje! Centrum medycyny klinicznej DiMedical zostało sponsorem ...'),
]

ORG_LD = """{"@context":"https://schema.org","@type":"MedicalOrganization",
"name":"Centrum Medycyny Klinicznej DiMedical Sp. z o.o.","url":"%s/",
"email":"kontakt@dimedical.pl","telephone":"+48502660480","foundingDate":"2016",
"address":{"@type":"PostalAddress","streetAddress":"ul. Żeromskiego 52",
"postalCode":"90-626","addressLocality":"Łódź","addressCountry":"PL"},
"geo":{"@type":"GeoCoordinates","latitude":51.7663738,"longitude":19.4477804},
"medicalSpecialty":["Microbiology","Pathology"]}""" % SITE
ORG_LD = re.sub(r'\s*\n\s*', '', ORG_LD)

TPL = """<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{site}/{canon}">
{hreflang}
<meta property="og:type" content="website">
<meta property="og:site_name" content="DiMedical">
<meta property="og:locale" content="{locale}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{site}/{canon}">
<meta property="og:image" content="{site}/assets/og-dimedical.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Laboratorium diagnostyczne DiMedical">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{site}/assets/og-dimedical.jpg">
<script type="application/ld+json">{ld}</script>
{head}
<style>{krytycznyCss}</style>
<link rel="preload" href="{a}styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{a}styles.css"></noscript>
</head>
<body{bodyclass}>

{nav}

<main id="tresc">
{content}
</main>

{foot}

<script src="{a}site.js" defer></script>
</body>
</html>
"""


# Selektory widoczne przed przewinięciem — ich style wchodzą wprost do <head>,
# reszta arkusza dociąga się asynchronicznie i nie blokuje pierwszego renderu.
KRYTYCZNE = (
    ':root', '*', 'html', 'body', '::selection', '::-webkit',
    '.skip', '.progress', '.atmos', '.blob', '.pole', '.grid-overlay', '.grain',
    '.topbar', '.lang', '.top-right', '.sep', '.soc', '.ico', '.hide-sm',
    '.nav-shell', '.nav', '.logo', '.menu', '.has-sub', '.mtrig', '.caret',
    '.submenu', '.burger', '.mnav',
    '.wrap', '.btn', '.eyebrow', '.lead', '.accent', '.gat',
    'h1', 'h2', 'h3', 'p', 'a', 'img', 'svg', 'ul', 'li', 'button',
    '.hero', '.float', '.eu', '.subhero', '.crumbs', '.cover', '.rv',
    '.svc-tabs', '.switch', '.swi', '.kotwice', '.kot', '.price-tabs',
)


def podziel_css(tekst):
    """Rozdziela arkusz na część krytyczną i resztę, zachowując @font-face
    i reguły @media powiązane z selektorami krytycznymi."""
    reguly, i, n = [], 0, len(tekst)
    while i < n:
        if tekst[i] == '@':
            j = tekst.find('{', i)
            if j < 0:
                break
            nazwa = tekst[i:j]
            if nazwa.strip().startswith(('@font-face', '@keyframes', '@media', '@supports')):
                glebokosc, k = 1, j + 1
                while k < n and glebokosc:
                    if tekst[k] == '{': glebokosc += 1
                    elif tekst[k] == '}': glebokosc -= 1
                    k += 1
                reguly.append((nazwa.strip(), tekst[i:k]))
                i = k
                continue
        j = tekst.find('{', i)
        if j < 0:
            break
        k = tekst.find('}', j)
        if k < 0:
            break
        reguly.append((tekst[i:j].strip(), tekst[i:k + 1]))
        i = k + 1

    def wazny(sel):
        return any(cz.strip().startswith(KRYTYCZNE) or cz.strip().split(':')[0].split('.')[0] in ('html','body')
                   for cz in sel.replace('\n', ' ').split(','))

    krytyczne, reszta = [], []
    for sel, tresc in reguly:
        if sel.startswith('@font-face') or sel.startswith('@keyframes'):
            krytyczne.append(tresc)
        elif sel.startswith('@media'):
            (krytyczne if any(k in tresc for k in
                ('.nav', '.hero', '.topbar', '.wrap', '.btn', '.mnav', '.subhero', 'body', ':root'))
             else reszta).append(tresc)
        elif wazny(sel):
            krytyczne.append(tresc)
        else:
            reszta.append(tresc)
    return ''.join(krytyczne), ''.join(reszta)


def zbuduj_zasoby():
    """styles.src.css / site.src.js to źródła do edycji.
    Wersje bez rozszerzenia .src są generowane — nie edytować ręcznie."""
    def mini_css(t):
        t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
        t = re.sub(r'\s*\n\s*', '\n', t)
        t = re.sub(r'\s*([{}:;,>~+])\s*', r'\1', t)
        t = re.sub(r';\}', '}', t)
        t = re.sub(r'\n+', '', t)
        t = re.sub(r'\s{2,}', ' ', t)
        t = re.sub(r'(?<=[:\s,(])0\.(\d)', r'.\1', t)
        return t.strip()

    def mini_js(t):
        """Najpierw komentarze blokowe w całości — kasowanie po liniach
        zostawiało ich środek jako kod. Potem dopiero całe linie z //."""
        t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
        linie = [l for l in t.split('\n')
                 if l.strip() and not l.strip().startswith('//')]
        return '\n'.join(linie)

    wynik = []
    for zrodlo, cel, fn_mini in (('styles.src.css', 'styles.css', mini_css),
                                 ('site.src.js', 'site.js', mini_js)):
        z = Path(zrodlo)
        if not z.exists():
            continue
        tekst = z.read_text(encoding='utf-8')
        maly = fn_mini(tekst)
        Path(cel).write_text(maly, encoding='utf-8')
        if cel.endswith('.js'):
            import subprocess
            spr = subprocess.run(['node', '--check', cel], capture_output=True, text=True)
            if spr.returncode:
                Path(cel).write_text(tekst, encoding='utf-8')   # ratunek: wersja źródłowa
                raise SystemExit(f'BŁĄD SKŁADNI po minifikacji {cel}:\n{spr.stderr}')
        wynik.append(f'{cel} {len(tekst)//1024}→{len(maly)//1024} KB')
        if cel == 'styles.css':
            # Krytyczny CSS jest NADMIAROWY względem pełnego arkusza, nie zamiast niego.
            # Rozdzielanie reguł między dwa pliki rozbija kolejność kaskady: reguła
            # @media potrafi trafić do <head>, a nadpisywana przez nią reguła bazowa
            # do pliku ładowanego później — i wtedy wygrywa ta niewłaściwa.
            kryt, _ = podziel_css(maly)
            globals()['KRYT_CSS'] = kryt
            wynik.append(f'  └ krytyczny w <head> {len(kryt)//1024} KB (pełny arkusz doczytywany osobno)')
    return wynik


def odroczone_obrazy(html: str) -> str:
    """Obrazy poniżej zgięcia ładujemy leniwie. Wyjątkiem są te oznaczone
    fetchpriority="high" — to kadry w nagłówku, które mają wejść od razu;
    lazy na nich opóźniłoby największy element strony."""
    def popraw(m):
        tag = m.group(0)
        if 'fetchpriority="high"' in tag:
            return tag                                  # nagłówek — ładuj natychmiast
        if 'loading=' not in tag:
            tag = tag[:-1].rstrip() + ' loading="lazy">'
        if 'decoding=' not in tag:
            tag = tag[:-1].rstrip() + ' decoding="async">'
        return tag
    return re.sub(r'<img\b[^>]*>', popraw, html)


def set_active(nav_html: str, slug: str) -> str:
    """Zaznacza aktywną pozycję menu (+ rodzica „Oferta")."""
    if not slug:
        return nav_html
    out = nav_html.replace(
        f'data-nav="{slug}"', f'data-nav="{slug}" class="active"', 1)
    if slug in ('gruzlica', 'mikrobiologia', 'badania-br'):
        out = out.replace('class="mtrig"', 'class="mtrig active"', 1)
    return out


def podstaw(tekst: str, ctx: dict) -> str:
    """Wstawia {{klucz}} ze słownika interfejsu."""
    return re.sub(r'\{\{(\w+)\}\}', lambda m: str(ctx.get(m.group(1), m.group(0))), tekst)


def build():
    made = []
    for lang in ('pl', 'en'):
        katalog = ROOT if lang == 'pl' else ROOT / 'en'
        katalog.mkdir(exist_ok=True)
        for p in PAGES:
            slug = p['slug']
            zrodlo = (ROOT / f'pages/en/{slug}.html') if lang == 'en' else \
                     (ROOT / p.get('file', f'pages/{slug}.html'))
            if not zrodlo.exists():
                continue

            ctx = kontekst(lang, slug)
            # największy element strony wskazujemy przeglądarce wprost
            ctx['robots'] = ('' if INDEKSOWANIE
                             else '<meta name="robots" content="noindex, nofollow">\n')
            ctx['preloadHero'] = (
                f'<link rel="preload" href="{ctx["a"]}assets/molekula.webp" as="image" '
                f'type="image/webp" fetchpriority="high">\n' if slug == 'index' else '')
            tytul = p.get(f'title_{lang}', p['title'])
            opis = p.get(f'desc_{lang}', p['desc'])
            canon = KANON[lang].get(slug, f'{slug}/' if lang == 'pl' else f'en/{slug}/')

            hl = []
            if slug in KANON['pl']:
                hl.append(f'<link rel="alternate" hreflang="pl" href="{SITE}/{KANON["pl"][slug]}">')
                hl.append(f'<link rel="alternate" hreflang="en" href="{SITE}/{KANON["en"][slug]}">')
                hl.append(f'<link rel="alternate" hreflang="x-default" href="{SITE}/{KANON["pl"][slug]}">')

            html = TPL.format(
                title=tytul, desc=opis, site=SITE, canon=canon,
                ld=ORG_LD, head=podstaw(HEAD.strip(), ctx),
                nav=podstaw(set_active(NAV, p['nav']).strip(), ctx),
                content=podstaw(zrodlo.read_text(encoding='utf-8').strip(), ctx),
                foot=podstaw(FOOT.strip(), ctx),
                bodyclass='' if slug == 'index' else f' class="page-{slug}"',
                krytycznyCss=globals().get('KRYT_CSS', ''),
                lang=ctx['lang'], locale=ctx['locale'], a=ctx['a'],
                hreflang='\n'.join(hl),
            )
            html = odroczone_obrazy(html)
            nazwa = SLUGI[lang].get(slug, f'{slug}.html')
            out = katalog / nazwa
            out.write_text(html, encoding='utf-8')
            made.append((f'{lang}/{nazwa}' if lang == 'en' else nazwa, len(html)))
    return made



def zapisz_robots():
    if INDEKSOWANIE:
        tresc = f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n"
    else:
        tresc = "User-agent: *\nDisallow: /\n"
    Path('robots.txt').write_text(tresc, encoding='utf-8')
    return 'indeksowanie włączone' if INDEKSOWANIE else 'indeksowanie zablokowane'


def zapisz_sitemap(baza=None):
    baza = baza or (SITE.rstrip('/') + '/')
    """Sitemapa z faktycznie zbudowanych stron — ręczna lista rozjeżdżała się
    z serwisem przy każdej nowej podstronie."""
    wpisy = []
    for lang in ('pl', 'en'):
        for slug, plik in SLUGI[lang].items():
            if slug == '404':
                continue          # strona błędu nie należy do mapy serwisu
            adres = baza + KANON[lang][slug]
            # strona główna i sekcje nadrzędne wyżej w hierarchii
            if slug == 'index':
                prio = '1.0'
            elif slug in ('m-typer', 'gruzlica', 'mikrobiologia', 'badania-br', 'cennik', 'kontakt'):
                prio = '0.9'
            elif slug.startswith('badanie-'):
                prio = '0.7'
            elif slug.startswith('wpis-'):
                prio = '0.5'
            else:
                prio = '0.6'
            alt = ''.join(
                f'\n    <xhtml:link rel="alternate" hreflang="{j}" href="{baza + KANON[j][slug]}"/>'
                for j in ('pl', 'en') if slug in KANON[j])
            wpisy.append(
                f'  <url>\n    <loc>{adres}</loc>{alt}\n'
                f'    <priority>{prio}</priority>\n  </url>')
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
           '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
           + '\n'.join(wpisy) + '\n</urlset>\n')
    Path('sitemap.xml').write_text(xml, encoding='utf-8')
    return len(wpisy)

if __name__ == '__main__':
    # zasoby najpierw — z nich bierze się krytyczny CSS wstawiany do stron
    for w in zbuduj_zasoby():
        print(f'   {w}')
    for name, size in build():
        print(f'  {name:<22} {size:>7,} znaków')
    print(f'\nGotowe — {len(PAGES)} stron.')
    print(f'   sitemap.xml — {zapisz_sitemap()} adresów')
    print(f'   robots.txt — {zapisz_robots()}')
