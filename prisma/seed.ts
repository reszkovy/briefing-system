// Seed script for Club Manager Briefing System - Demo Data with Real Zdrofit Clubs
// Run with: npm run db:seed

import { PrismaClient, UserRole, Objective, Priority, TaskStatus, BriefStatus, FocusPeriod, Outcome, ConfidenceLevel, StrategyDocumentType, StrategyDocumentScope } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting demo seed with real Zdrofit clubs...')

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.deliverable.deleteMany()
  await prisma.productionTask.deleteMany()
  await prisma.approval.deleteMany()
  await prisma.brief.deleteMany()
  await prisma.salesFocus.deleteMany()
  await prisma.strategyDocument.deleteMany()
  await prisma.userClub.deleteMany()
  await prisma.club.deleteMany()
  await prisma.requestTemplate.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.region.deleteMany()
  await prisma.user.deleteMany()

  // ============== REGIONS ==============
  console.log('📍 Creating regions...')
  const regions = await Promise.all([
    prisma.region.create({ data: { name: 'Warszawa', code: 'WAW' } }),
    prisma.region.create({ data: { name: 'Trójmiasto', code: 'TRI' } }),
    prisma.region.create({ data: { name: 'Pomorze Zachodnie', code: 'POM' } }),
    prisma.region.create({ data: { name: 'Kujawsko-Pomorskie', code: 'KUJ' } }),
    prisma.region.create({ data: { name: 'Lubelskie', code: 'LUB' } }),
    prisma.region.create({ data: { name: 'Świętokrzyskie', code: 'SWI' } }),
    prisma.region.create({ data: { name: 'Warmińsko-Mazurskie', code: 'WAR' } }),
    prisma.region.create({ data: { name: 'Podlaskie', code: 'POD' } }),
    prisma.region.create({ data: { name: 'Mazowieckie (poza Warszawą)', code: 'MAZ' } }),
    prisma.region.create({ data: { name: 'Śląskie', code: 'SLA' } }),
  ])

  // ============== BRANDS ==============
  console.log('🏷️ Creating brands...')
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Zdrofit',
        code: 'ZDROFIT',
        primaryColor: '#00A651',
        guidelinesUrl: 'https://drive.google.com/drive/folders/zdrofit-brand-guidelines',
      },
    }),
  ])

  const zdrofitBrand = brands[0]

  // ============== REAL ZDROFIT CLUBS ==============
  console.log('🏢 Creating real Zdrofit clubs with GPS coordinates...')

  // Warsaw clubs (Region 0)
  const warsawClubs = [
    { name: 'Zdrofit Arkadia', code: 'ZDF-WAW-ARK', address: 'Al. Jana Pawła II 82', lat: 52.2567, lng: 20.9847, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Krucza', code: 'ZDF-WAW-KRU', address: 'ul. Krucza 50', lat: 52.2282, lng: 21.0165, tier: 'VIP' as const },
    { name: 'Zdrofit Westfield Mokotów', code: 'ZDF-WAW-WMO', address: 'ul. Wołoska 12', lat: 52.1801, lng: 21.0007, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Rondo ONZ', code: 'ZDF-WAW-ONZ', address: 'Rondo ONZ 1', lat: 52.2325, lng: 20.9967, tier: 'VIP' as const },
    { name: 'Zdrofit Warsaw Spire', code: 'ZDF-WAW-SPI', address: 'Plac Europejski 1', lat: 52.2328, lng: 20.9847, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit The Warsaw HUB', code: 'ZDF-WAW-HUB', address: 'Rondo Daszyńskiego 2', lat: 52.2301, lng: 20.9842, tier: 'VIP' as const },
    { name: 'Zdrofit Mennica Towers', code: 'ZDF-WAW-MEN', address: 'ul. Prosta 18', lat: 52.2317, lng: 20.9925, tier: 'VIP' as const },
    { name: 'Zdrofit Varso', code: 'ZDF-WAW-VAR', address: 'ul. Chmielna 71', lat: 52.2301, lng: 21.0012, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Metro Świętokrzyska', code: 'ZDF-WAW-SWI', address: 'ul. Marszałkowska 126/134', lat: 52.2353, lng: 21.0089, tier: 'VIP' as const },
    { name: 'Zdrofit Metro Politechnika', code: 'ZDF-WAW-POL', address: 'ul. Polna 11', lat: 52.2198, lng: 21.0142, tier: 'STANDARD' as const },
    { name: 'Zdrofit Wola Park', code: 'ZDF-WAW-WPA', address: 'ul. Górczewska 124', lat: 52.2321, lng: 20.9357, tier: 'VIP' as const },
    { name: 'Zdrofit Fort Wola', code: 'ZDF-WAW-FWO', address: 'ul. Połczyńska 4', lat: 52.2417, lng: 20.9289, tier: 'STANDARD' as const },
    { name: 'Zdrofit Galeria Północna', code: 'ZDF-WAW-PON', address: 'ul. Światowida 17', lat: 52.2967, lng: 20.9687, tier: 'VIP' as const },
    { name: 'Zdrofit G City Targówek', code: 'ZDF-WAW-GCT', address: 'ul. Głębocka 150', lat: 52.2889, lng: 21.0645, tier: 'STANDARD' as const },
    { name: 'Zdrofit Koneser', code: 'ZDF-WAW-KON', address: 'Plac Konesera 5', lat: 52.2523, lng: 21.0456, tier: 'VIP' as const },
    { name: 'Zdrofit Gocław', code: 'ZDF-WAW-GOC', address: 'ul. Ostrobramska 101', lat: 52.2401, lng: 21.0876, tier: 'STANDARD' as const },
    { name: 'Zdrofit G City Promenada', code: 'ZDF-WAW-GCP', address: 'ul. Ostrobramska 75c', lat: 52.2367, lng: 21.0723, tier: 'STANDARD' as const },
    { name: 'Zdrofit Bemowo Lazurowa', code: 'ZDF-WAW-LAZ', address: 'ul. Lazurowa 71A', lat: 52.2412, lng: 20.9012, tier: 'STANDARD' as const },
    { name: 'Zdrofit Bemowo Świetlików', code: 'ZDF-WAW-SWT', address: 'ul. Świetlików 3', lat: 52.2289, lng: 20.8967, tier: 'STANDARD' as const },
    { name: 'Zdrofit Białołęka Modlińska', code: 'ZDF-WAW-BIA', address: 'ul. Modlińska 256', lat: 52.3123, lng: 20.9534, tier: 'STANDARD' as const },
    { name: 'Zdrofit Bielany Marymoncka', code: 'ZDF-WAW-BIE', address: 'ul. Marymoncka 34', lat: 52.2912, lng: 20.9312, tier: 'STANDARD' as const },
    { name: 'Zdrofit Bielany Dąbrowskiej', code: 'ZDF-WAW-DAB', address: 'ul. Marii Dąbrowskiej 15', lat: 52.2834, lng: 20.9156, tier: 'STANDARD' as const },
    { name: 'Zdrofit Żoliborz Hubnera', code: 'ZDF-WAW-ZOL', address: 'ul. Hübnera 3', lat: 52.2723, lng: 20.9789, tier: 'VIP' as const },
    { name: 'Zdrofit Ochota Adgar', code: 'ZDF-WAW-ADG', address: 'Al. Jerozolimskie 181B', lat: 52.2012, lng: 20.9423, tier: 'VIP' as const },
    { name: 'Zdrofit Ochota Grójecka', code: 'ZDF-WAW-GRO', address: 'ul. Grójecka 208', lat: 52.2089, lng: 20.9123, tier: 'STANDARD' as const },
    { name: 'Zdrofit Mokotów Puławska', code: 'ZDF-WAW-PUL', address: 'ul. Puławska 39', lat: 52.2112, lng: 21.0234, tier: 'STANDARD' as const },
    { name: 'Zdrofit Mokotów Europlex', code: 'ZDF-WAW-EUR', address: 'ul. Puławska 170', lat: 52.1923, lng: 21.0312, tier: 'STANDARD' as const },
    { name: 'Zdrofit Mokotów Konstruktorska', code: 'ZDF-WAW-KST', address: 'ul. Konstruktorska 13', lat: 52.1789, lng: 21.0123, tier: 'VIP' as const },
    { name: 'Zdrofit Wilanów Rzeczypospolitej', code: 'ZDF-WAW-WIL', address: 'al. Rzeczypospolitej 10', lat: 52.1567, lng: 21.0645, tier: 'VIP' as const },
    { name: 'Zdrofit Sadyba Nałęczowska', code: 'ZDF-WAW-SAD', address: 'ul. Nałęczowska 19', lat: 52.1789, lng: 21.0567, tier: 'STANDARD' as const },
    { name: 'Zdrofit Ursynów Koński Jar', code: 'ZDF-WAW-URS', address: 'ul. Koński Jar 6', lat: 52.1456, lng: 21.0423, tier: 'STANDARD' as const },
    { name: 'Zdrofit Ursus Pużaka', code: 'ZDF-WAW-PUZ', address: 'ul. Pużaka 10', lat: 52.1823, lng: 20.8789, tier: 'STANDARD' as const },
    { name: 'Zdrofit Włochy Krakowiaków', code: 'ZDF-WAW-KRA', address: 'ul. Krakowiaków 46', lat: 52.1912, lng: 20.9312, tier: 'STANDARD' as const },
    { name: 'Zdrofit Ferio Wawer', code: 'ZDF-WAW-FER', address: 'ul. Szpotańskiego 40', lat: 52.2234, lng: 21.1789, tier: 'STANDARD' as const },
    { name: 'Zdrofit Dworzec Gdański', code: 'ZDF-WAW-DWO', address: 'ul. Inflancka 4c', lat: 52.2578, lng: 20.9912, tier: 'VIP' as const },
  ]

  // Trójmiasto clubs (Region 1)
  const trojmiastoClubs = [
    { name: 'Zdrofit Gdańsk Alchemia', code: 'ZDF-GDA-ALC', address: 'al. Grunwaldzka 411', lat: 54.3853, lng: 18.5912, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Gdańsk Madison', code: 'ZDF-GDA-MAD', address: 'ul. Rajska 10', lat: 54.3517, lng: 18.6467, tier: 'VIP' as const },
    { name: 'Zdrofit Gdańsk Manhattan', code: 'ZDF-GDA-MAN', address: 'al. Grunwaldzka 82', lat: 54.3789, lng: 18.6012, tier: 'VIP' as const },
    { name: 'Zdrofit Gdańsk Galeria Przymorze', code: 'ZDF-GDA-PRZ', address: 'ul. Obrońców Wybrzeża 1', lat: 54.4012, lng: 18.5789, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdańsk Garnizon', code: 'ZDF-GDA-GAR', address: 'ul. Słonimskiego 8', lat: 54.3867, lng: 18.5634, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdańsk Morena', code: 'ZDF-GDA-MOR', address: 'ul. Schuberta 102A', lat: 54.3534, lng: 18.5534, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdańsk Kowale', code: 'ZDF-GDA-KOW', address: 'ul. Staropolska 32', lat: 54.3212, lng: 18.5367, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdańsk Chełm', code: 'ZDF-GDA-CHE', address: 'ul. Cieszyńskiego 1B', lat: 54.3312, lng: 18.5912, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdańsk Zaspa', code: 'ZDF-GDA-ZAS', address: 'al. Rzeczypospolitej 33', lat: 54.4067, lng: 18.6012, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdańsk Suchanino', code: 'ZDF-GDA-SUC', address: 'ul. Noskowskiego 1', lat: 54.3789, lng: 18.5534, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdańsk Rental Park', code: 'ZDF-GDA-REN', address: 'ul. Przywidzka 9', lat: 54.3423, lng: 18.5234, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdańsk Nieborowska', code: 'ZDF-GDA-NIE', address: 'ul. Nieborowska 10', lat: 54.3534, lng: 18.6423, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdynia Riviera', code: 'ZDF-GDY-RIV', address: 'ul. Kazimierza Górskiego 28', lat: 54.5189, lng: 18.5467, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Gdynia Klif', code: 'ZDF-GDY-KLI', address: 'al. Zwycięstwa 256', lat: 54.4912, lng: 18.5312, tier: 'VIP' as const },
    { name: 'Zdrofit Gdynia Plac Kaszubski', code: 'ZDF-GDY-KAS', address: 'Plac Kaszubski 17', lat: 54.5178, lng: 18.5389, tier: 'VIP' as const },
    { name: 'Zdrofit Gdynia Chwarzno', code: 'ZDF-GDY-CHW', address: 'ul. Czesława Niemena 28', lat: 54.4734, lng: 18.4912, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdynia Karwiny', code: 'ZDF-GDY-KAR', address: 'ul. Nowowiczlińska 35', lat: 54.4589, lng: 18.4789, tier: 'STANDARD' as const },
    { name: 'Zdrofit Gdynia Witawa', code: 'ZDF-GDY-WIT', address: 'ul. Wielkokacka 28', lat: 54.4612, lng: 18.5012, tier: 'STANDARD' as const },
    { name: 'Zdrofit Sopot Centrum', code: 'ZDF-SOP-CEN', address: 'ul. Dworcowa 7', lat: 54.4412, lng: 18.5612, tier: 'VIP' as const },
    { name: 'Zdrofit Pruszcz Gdański Domeyki', code: 'ZDF-PRU-DOM', address: 'ul. Domeyki 38', lat: 54.2612, lng: 18.6412, tier: 'STANDARD' as const },
    { name: 'Zdrofit Pruszcz Gdański Kasprowicza', code: 'ZDF-PRU-KAS', address: 'ul. Kasprowicza 52', lat: 54.2534, lng: 18.6234, tier: 'STANDARD' as const },
  ]

  // Szczecin clubs (Region 2)
  const szczecinClubs = [
    { name: 'Zdrofit Szczecin Galaxy', code: 'ZDF-SZC-GAL', address: 'al. Wyzwolenia 18/20', lat: 53.4289, lng: 14.5512, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Szczecin Kaskada', code: 'ZDF-SZC-KAS', address: 'al. Niepodległości 36', lat: 53.4312, lng: 14.5412, tier: 'VIP' as const },
    { name: 'Zdrofit Szczecin Outlet Park', code: 'ZDF-SZC-OUT', address: 'ul. Andrzeja Struga 42', lat: 53.4134, lng: 14.5234, tier: 'STANDARD' as const },
    { name: 'Zdrofit Szczecin Piastów', code: 'ZDF-SZC-PIA', address: 'al. Piastów 30', lat: 53.4234, lng: 14.5134, tier: 'STANDARD' as const },
    { name: 'Zdrofit Stargard Starówka', code: 'ZDF-STA-STA', address: 'ul. B. Chrobrego 87', lat: 53.3367, lng: 15.0512, tier: 'STANDARD' as const },
    { name: 'Zdrofit Stargard Zodiak', code: 'ZDF-STA-ZOD', address: 'ul. Wyszyńskiego 12-15a', lat: 53.3289, lng: 15.0412, tier: 'STANDARD' as const },
    { name: 'Zdrofit Koszalin Forum', code: 'ZDF-KOS-FOR', address: 'ul. Paderewskiego 17', lat: 54.1912, lng: 16.1712, tier: 'VIP' as const },
    { name: 'Zdrofit Koszalin Kosmos', code: 'ZDF-KOS-KOS', address: 'ul. Stefana Okrzei 3', lat: 54.1856, lng: 16.1834, tier: 'STANDARD' as const },
  ]

  // Bydgoszcz/Toruń clubs (Region 3)
  const kujawskoClubs = [
    { name: 'Zdrofit Bydgoszcz Focus', code: 'ZDF-BYD-FOC', address: 'ul. Jagiellońska 39', lat: 53.1234, lng: 18.0012, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Bydgoszcz Balaton', code: 'ZDF-BYD-BAL', address: 'ul. M. Skłodowskiej Curie 33', lat: 53.1089, lng: 18.0534, tier: 'VIP' as const },
    { name: 'Zdrofit Bydgoszcz Immobile K3', code: 'ZDF-BYD-K3', address: 'Plac Kościeleckich 3', lat: 53.1212, lng: 18.0112, tier: 'VIP' as const },
    { name: 'Zdrofit Toruń Copernicus', code: 'ZDF-TOR-COP', address: 'ul. Żółkiewskiego 15', lat: 53.0134, lng: 18.6034, tier: 'VIP' as const },
    { name: 'Zdrofit Toruń Rydygiera', code: 'ZDF-TOR-RYD', address: 'ul. Rydygiera 30/32', lat: 53.0034, lng: 18.5912, tier: 'STANDARD' as const },
    { name: 'Zdrofit Włocławek Wzorcownia', code: 'ZDF-WLO-WZO', address: 'ul. Kilińskiego 38', lat: 52.6534, lng: 19.0634, tier: 'STANDARD' as const },
  ]

  // Lublin clubs (Region 4)
  const lublinClubs = [
    { name: 'Zdrofit Lublin Galeria Olimp', code: 'ZDF-LUB-OLI', address: 'al. Spółdzielczości Pracy 34', lat: 51.2312, lng: 22.5534, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Lublin Batory', code: 'ZDF-LUB-BAT', address: 'al. Kraśnicka 31', lat: 51.2234, lng: 22.5012, tier: 'VIP' as const },
    { name: 'Zdrofit Lublin Galeria Gala', code: 'ZDF-LUB-GAL', address: 'ul. Fabryczna 22', lat: 51.2456, lng: 22.5634, tier: 'VIP' as const },
  ]

  // Kielce clubs (Region 5)
  const kielceClubs = [
    { name: 'Zdrofit Kielce Galeria Echo', code: 'ZDF-KIE-ECH', address: 'ul. Świętokrzyska 20', lat: 50.8689, lng: 20.6312, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Kielce Galeria Korona', code: 'ZDF-KIE-KOR', address: 'ul. Warszawska 26', lat: 50.8734, lng: 20.6234, tier: 'VIP' as const },
  ]

  // Olsztyn/Elbląg clubs (Region 6)
  const warmiaClubs = [
    { name: 'Zdrofit Olsztyn Wilczyńskiego', code: 'ZDF-OLS-WIL', address: 'Bp. T. Wilczyńskiego 29', lat: 53.7734, lng: 20.4712, tier: 'FLAGSHIP' as const },
    { name: 'Zdrofit Elbląg Nowowiejska', code: 'ZDF-ELB-NOW', address: 'ul. Nowowiejska 1a', lat: 54.1567, lng: 19.4012, tier: 'VIP' as const },
  ]

  // Białystok clubs (Region 7)
  const podlaskieClubs = [
    { name: 'Zdrofit Białystok Wrocławska', code: 'ZDF-BIA-WRO', address: 'ul. Wrocławska 51b', lat: 53.1312, lng: 23.1512, tier: 'FLAGSHIP' as const },
  ]

  // Mazowieckie (outside Warsaw) clubs (Region 8)
  const mazowieckieClubs = [
    { name: 'Zdrofit Legionowo', code: 'ZDF-LEG-CEN', address: 'ul. Siwińskiego 20', lat: 52.4012, lng: 20.9234, tier: 'VIP' as const },
    { name: 'Zdrofit Legionowo Zegrzyńska', code: 'ZDF-LEG-ZEG', address: 'ul. Zegrzyńska 1D', lat: 52.4089, lng: 20.9312, tier: 'STANDARD' as const },
    { name: 'Zdrofit Pruszków Nowa Stacja', code: 'ZDF-PRU-NOW', address: 'ul. Sienkiewicza 19', lat: 52.1712, lng: 20.8112, tier: 'VIP' as const },
    { name: 'Zdrofit Pruszków Zimińskiej', code: 'ZDF-PRU-ZIM', address: 'ul. Miry Zimińskiej Sygietyńskiej 10', lat: 52.1634, lng: 20.8034, tier: 'STANDARD' as const },
    { name: 'Zdrofit Piaseczno Pawia', code: 'ZDF-PIA-PAW', address: 'ul. Pawia 110', lat: 52.0712, lng: 21.0234, tier: 'STANDARD' as const },
    { name: 'Zdrofit Piaseczno Puławska', code: 'ZDF-PIA-PUL', address: 'ul. Puławska 44D', lat: 52.0789, lng: 21.0312, tier: 'STANDARD' as const },
    { name: 'Zdrofit Piastów Pasaż', code: 'ZDF-PIA-PAS', address: 'ul. Warszawska 43', lat: 52.1834, lng: 20.8334, tier: 'STANDARD' as const },
    { name: 'Zdrofit Otwock', code: 'ZDF-OTW-CEN', address: 'ul. Kołłątaja 40', lat: 52.1034, lng: 21.2634, tier: 'STANDARD' as const },
    { name: 'Zdrofit Wołomin', code: 'ZDF-WOL-CEN', address: 'ul. Geodetów 20', lat: 52.3512, lng: 21.2412, tier: 'STANDARD' as const },
    { name: 'Zdrofit Płock Galeria Mazovia', code: 'ZDF-PLO-MAZ', address: 'ul. Wyszogrodzka 127', lat: 52.5467, lng: 19.6834, tier: 'VIP' as const },
    { name: 'Zdrofit Radom', code: 'ZDF-RAD-CEN', address: 'ul. Wernera 102', lat: 51.4034, lng: 21.1634, tier: 'STANDARD' as const },
    { name: 'Zdrofit Homepark Janki', code: 'ZDF-JAN-HOM', address: 'Plac Szwedzki 30', lat: 52.1012, lng: 20.8512, tier: 'STANDARD' as const },
    { name: 'Zdrofit NPark Stara Iwiczna', code: 'ZDF-IWI-NPA', address: 'ul. Nowa 40', lat: 52.0512, lng: 20.9612, tier: 'STANDARD' as const },
    { name: 'Zdrofit Dawidy Bankowe', code: 'ZDF-DAW-CEN', address: 'ul. Długa 150', lat: 52.1234, lng: 20.9112, tier: 'STANDARD' as const },
    { name: 'Zdrofit Banino', code: 'ZDF-BAN-CEN', address: 'ul. Północna 3', lat: 54.3912, lng: 18.4234, tier: 'STANDARD' as const },
  ]

  // Śląskie (Częstochowa) clubs (Region 9)
  const slaskieClubs = [
    { name: 'Zdrofit Częstochowa Piastowska', code: 'ZDF-CZE-PIA', address: 'ul. Piastowska 225', lat: 50.8134, lng: 19.1234, tier: 'VIP' as const },
  ]

  // Create all clubs
  const allClubsData = [
    ...warsawClubs.map(c => ({ ...c, regionId: regions[0].id, brandId: zdrofitBrand.id, city: 'Warszawa' })),
    ...trojmiastoClubs.map(c => ({ ...c, regionId: regions[1].id, brandId: zdrofitBrand.id, city: c.name.includes('Gdynia') ? 'Gdynia' : c.name.includes('Sopot') ? 'Sopot' : c.name.includes('Pruszcz') ? 'Pruszcz Gdański' : 'Gdańsk' })),
    ...szczecinClubs.map(c => ({ ...c, regionId: regions[2].id, brandId: zdrofitBrand.id, city: c.name.includes('Stargard') ? 'Stargard' : c.name.includes('Koszalin') ? 'Koszalin' : 'Szczecin' })),
    ...kujawskoClubs.map(c => ({ ...c, regionId: regions[3].id, brandId: zdrofitBrand.id, city: c.name.includes('Toruń') ? 'Toruń' : c.name.includes('Włocławek') ? 'Włocławek' : 'Bydgoszcz' })),
    ...lublinClubs.map(c => ({ ...c, regionId: regions[4].id, brandId: zdrofitBrand.id, city: 'Lublin' })),
    ...kielceClubs.map(c => ({ ...c, regionId: regions[5].id, brandId: zdrofitBrand.id, city: 'Kielce' })),
    ...warmiaClubs.map(c => ({ ...c, regionId: regions[6].id, brandId: zdrofitBrand.id, city: c.name.includes('Elbląg') ? 'Elbląg' : 'Olsztyn' })),
    ...podlaskieClubs.map(c => ({ ...c, regionId: regions[7].id, brandId: zdrofitBrand.id, city: 'Białystok' })),
    ...mazowieckieClubs.map(c => ({ ...c, regionId: regions[8].id, brandId: zdrofitBrand.id, city: c.name.split(' ')[1] || 'Mazowieckie' })),
    ...slaskieClubs.map(c => ({ ...c, regionId: regions[9].id, brandId: zdrofitBrand.id, city: 'Częstochowa' })),
  ]

  const clubs = await Promise.all(
    allClubsData.map(club =>
      prisma.club.create({
        data: {
          name: club.name,
          code: club.code,
          city: club.city,
          address: club.address,
          latitude: club.lat,
          longitude: club.lng,
          regionId: club.regionId,
          brandId: club.brandId,
          tier: club.tier,
        },
      })
    )
  )

  console.log(`✅ Created ${clubs.length} real Zdrofit clubs`)

  // ============== CLUB CONTEXTS ==============
  console.log('🏢 Adding club contexts for demo...')

  // Context data for different club types
  const clubContexts = [
    // FLAGSHIP clubs - premium/lifestyle
    {
      filter: (c: typeof clubs[0]) => c.tier === 'FLAGSHIP',
      context: {
        clubCharacter: 'PREMIUM_LIFESTYLE',
        keyMemberGroups: ['regular_members', 'lifestyle_wellbeing', 'advanced_users'],
        localConstraints: [],
        topActivities: [
          { name: 'Yoga', popularity: 'HIGH' },
          { name: 'Pilates Reformer', popularity: 'HIGH' },
          { name: 'Fitness grupowy', popularity: 'MEDIUM' },
        ],
        activityReasons: {
          selected: ['matches_local_demographics', 'strong_trainer_presence', 'wellbeing_health_focus'],
          note: 'Klienci premium cenią jakość i komfort, mniej wrażliwi na cenę.',
        },
        localDecisionBrief: 'Klub o profilu premium w prestiżowej lokalizacji. Kluczowa jest jakość obsługi i doświadczenia, nie promocje cenowe. Skupiamy się na retencji przez wartość dodaną.',
      },
    },
    // VIP clubs - community-driven, mixed
    {
      filter: (c: typeof clubs[0]) => c.tier === 'VIP',
      context: {
        clubCharacter: 'COMMUNITY_DRIVEN',
        keyMemberGroups: ['regular_members', 'seniors_40_plus', 'lifestyle_wellbeing'],
        localConstraints: ['limited_trainer_availability'],
        topActivities: [
          { name: 'Fitness grupowy', popularity: 'HIGH' },
          { name: 'Stretching', popularity: 'MEDIUM' },
          { name: 'Siłownia', popularity: 'HIGH' },
        ],
        activityReasons: {
          selected: ['convenient_schedule', 'low_entry_barrier', 'matches_local_demographics'],
          note: 'Silna społeczność stałych bywalców, wielu członków 40+.',
        },
        localDecisionBrief: 'Klub z lojalnymi członkami i silnym poczuciem społeczności. Warto inwestować w wydarzenia integracyjne i programy lojalnościowe.',
      },
    },
    // STANDARD clubs - mass-market or functional
    {
      filter: (c: typeof clubs[0]) => c.tier === 'STANDARD' && c.name.includes('Bemowo'),
      context: {
        clubCharacter: 'MASS_MARKET',
        keyMemberGroups: ['beginners', 'regular_members', 'custom:Rodziny z dziećmi'],
        localConstraints: ['limited_space', 'high_seasonality'],
        topActivities: [
          { name: 'Siłownia', popularity: 'HIGH' },
          { name: 'HIIT', popularity: 'MEDIUM' },
          { name: 'Zumba', popularity: 'MEDIUM' },
        ],
        activityReasons: {
          selected: ['low_entry_barrier', 'convenient_schedule'],
          note: 'Dzielnica mieszkalna, dużo rodzin. Sezonowość - lato słabsze.',
        },
        localDecisionBrief: 'Typowy klub osiedlowy. Klienci wrażliwi na cenę, ale lojalni gdy znajdą swoje miejsce. Wyzwanie: zatrzymać ich po okresie próbnym.',
      },
    },
    {
      filter: (c: typeof clubs[0]) => c.tier === 'STANDARD' && c.name.includes('Mokotów'),
      context: {
        clubCharacter: 'FUNCTIONAL_COMPACT',
        keyMemberGroups: ['regular_members', 'performance_sport', 'advanced_users'],
        localConstraints: ['limited_space', 'limited_opening_hours'],
        topActivities: [
          { name: 'Siłownia', popularity: 'HIGH' },
          { name: 'Trening funkcjonalny', popularity: 'HIGH' },
          { name: 'Cycling / Spinning', popularity: 'MEDIUM' },
        ],
        activityReasons: {
          selected: ['intensity_performance_effect', 'convenient_schedule', 'strong_trainer_presence'],
          note: 'Kompaktowa lokalizacja, ale świetni trenerzy. Klienci cenią efektywność.',
        },
        localDecisionBrief: 'Mniejsza powierzchnia wymusza kreatywność. Skupiamy się na jakości treningów personalnych i małych grupach.',
      },
    },
    {
      filter: (c: typeof clubs[0]) => c.tier === 'STANDARD' && !c.name.includes('Bemowo') && !c.name.includes('Mokotów'),
      context: {
        clubCharacter: 'COMMUNITY_DRIVEN',
        keyMemberGroups: ['beginners', 'regular_members', 'seniors_40_plus'],
        localConstraints: ['specific_local_demographics'],
        topActivities: [
          { name: 'Fitness grupowy', popularity: 'HIGH' },
          { name: 'Aqua fitness', popularity: 'MEDIUM' },
          { name: 'Stretching', popularity: 'MEDIUM' },
        ],
        activityReasons: {
          selected: ['low_entry_barrier', 'matches_local_demographics', 'wellbeing_health_focus'],
          note: 'Dużo emerytów w okolicy, cenią spokojne zajęcia i atmosferę.',
        },
        localDecisionBrief: 'Zróżnicowana grupa wiekowa z przewagą 40+. Komunikacja powinna być inkluzywna i skupiona na zdrowiu, nie na wynikach sportowych.',
      },
    },
  ]

  // Apply contexts to clubs
  for (const contextDef of clubContexts) {
    const matchingClubs = clubs.filter(contextDef.filter).slice(0, 10) // Limit to first 10 per category
    for (const club of matchingClubs) {
      await prisma.club.update({
        where: { id: club.id },
        data: {
          clubCharacter: contextDef.context.clubCharacter,
          keyMemberGroups: contextDef.context.keyMemberGroups,
          localConstraints: contextDef.context.localConstraints,
          topActivities: contextDef.context.topActivities,
          activityReasons: contextDef.context.activityReasons,
          localDecisionBrief: contextDef.context.localDecisionBrief,
          contextUpdatedAt: new Date(),
        },
      })
    }
  }

  console.log('✅ Added club contexts')

  // ============== REQUEST TEMPLATES ==============
  console.log('📝 Creating request templates...')
  const templates = await Promise.all([
    prisma.requestTemplate.create({
      data: {
        name: 'Post social media (Facebook/Instagram)',
        code: 'SOCIAL_POST',
        description: 'Grafiki na social media klubu w standardowych formatach.',
        defaultSLADays: 3,
        baseCost: 150,
        requiredFields: { type: 'object', properties: {} },
      },
    }),
    prisma.requestTemplate.create({
      data: {
        name: 'Plakat / Ulotka drukowana',
        code: 'PRINT_POSTER',
        description: 'Materiały drukowane do ekspozycji w klubie.',
        defaultSLADays: 5,
        baseCost: 300,
        requiredFields: { type: 'object', properties: {} },
      },
    }),
    prisma.requestTemplate.create({
      data: {
        name: 'Kit promocyjny wydarzenia',
        code: 'EVENT_KIT',
        description: 'Kompletny zestaw materiałów na wydarzenie w klubie.',
        defaultSLADays: 7,
        baseCost: 800,
        requiredFields: { type: 'object', properties: {} },
      },
    }),
    prisma.requestTemplate.create({
      data: {
        name: 'Szybka grafika informacyjna',
        code: 'QUICK_INFO',
        description: 'Prosta grafika do szybkiej komunikacji. Ekspresowa realizacja.',
        defaultSLADays: 1,
        baseCost: 75,
        requiredFields: { type: 'object', properties: {} },
      },
    }),
    prisma.requestTemplate.create({
      data: {
        name: 'Kampania sezonowa / promocyjna',
        code: 'SEASONAL_CAMPAIGN',
        description: 'Rozbudowana kampania promocyjna - wymaga więcej czasu.',
        defaultSLADays: 10,
        baseCost: 1500,
        requiredFields: { type: 'object', properties: {} },
      },
    }),
  ])

  // ============== USERS ==============
  console.log('👥 Creating users...')
  const passwordHash = await hash('demo123', 12)

  const users = await Promise.all([
    // Club Managers
    prisma.user.create({
      data: {
        email: 'anna.kowalska@benefit.pl',
        passwordHash,
        name: 'Anna Kowalska',
        role: UserRole.CLUB_MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'piotr.nowak@benefit.pl',
        passwordHash,
        name: 'Piotr Nowak',
        role: UserRole.CLUB_MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'katarzyna.wiszniewska@benefit.pl',
        passwordHash,
        name: 'Katarzyna Wiśniewska',
        role: UserRole.CLUB_MANAGER,
      },
    }),
    // Validators
    prisma.user.create({
      data: {
        email: 'michal.adamski@benefit.pl',
        passwordHash,
        name: 'Michał Adamski',
        role: UserRole.VALIDATOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'ewa.mazur@benefit.pl',
        passwordHash,
        name: 'Ewa Mazur',
        role: UserRole.VALIDATOR,
      },
    }),
    // Production Team
    prisma.user.create({
      data: {
        email: 'studio@benefit.pl',
        passwordHash,
        name: 'Studio Kreacji BS',
        role: UserRole.PRODUCTION,
      },
    }),
    // Admin
    prisma.user.create({
      data: {
        email: 'admin@benefit.pl',
        passwordHash,
        name: 'Administrator',
        role: UserRole.ADMIN,
      },
    }),
  ])

  // ============== USER-CLUB ASSIGNMENTS ==============
  console.log('🔗 Assigning users to clubs...')

  // Anna manages Warsaw clubs
  const warsawClubsList = clubs.filter(c => c.city === 'Warszawa').slice(0, 5)
  for (const club of warsawClubsList) {
    await prisma.userClub.create({
      data: { userId: users[0].id, clubId: club.id, isManager: true },
    })
  }

  // Piotr manages Trójmiasto clubs
  const trojmiastoClubsList = clubs.filter(c => ['Gdańsk', 'Gdynia', 'Sopot'].includes(c.city)).slice(0, 5)
  for (const club of trojmiastoClubsList) {
    await prisma.userClub.create({
      data: { userId: users[1].id, clubId: club.id, isManager: true },
    })
  }

  // Katarzyna manages other clubs
  const otherClubs = clubs.filter(c => !['Warszawa', 'Gdańsk', 'Gdynia', 'Sopot'].includes(c.city)).slice(0, 5)
  for (const club of otherClubs) {
    await prisma.userClub.create({
      data: { userId: users[2].id, clubId: club.id, isManager: true },
    })
  }

  // Validators have access to all clubs in their regions
  const warsawRegionClubs = clubs.filter(c => c.regionId === regions[0].id)
  for (const club of warsawRegionClubs) {
    await prisma.userClub.create({
      data: { userId: users[3].id, clubId: club.id, isManager: false },
    })
  }

  const trojmiastoRegionClubs = clubs.filter(c => c.regionId === regions[1].id)
  for (const club of trojmiastoRegionClubs) {
    await prisma.userClub.create({
      data: { userId: users[4].id, clubId: club.id, isManager: false },
    })
  }

  // ============== SAMPLE BRIEFS (Q4 2025 - Q1 2026 activity simulation) ==============
  console.log('📋 Creating sample briefs to simulate quarterly activity...')

  // Generate briefs for activity simulation
  const briefsToCreate = []
  const now = new Date()

  // Brief descriptions - varied to show alignment differences
  const briefVariants = [
    // DOBRZE DOPASOWANE do strategii Zdrofit (retencja, yoga/pilates, wellness)
    { title: 'Warsztaty Yoga dla Początkujących', context: 'Seria warsztatów wprowadzających do jogi dla nowych członków. Cel: budowanie nawyku regularnych wizyt i integracja z społecznością klubu.', alignment: 'high' },
    { title: 'Program Pilates Reformer - Nowa Grupa', context: 'Promocja nowych zajęć Pilates Reformer. Komunikacja skierowana do obecnych członków z zachętą do rozszerzenia karnetu.', alignment: 'high' },
    { title: 'Tydzień Mobility & Stretching', context: 'Event promujący zajęcia regeneracyjne. Cel: zwiększenie frekwencji na zajęciach wellness i budowanie świadomości ich wartości.', alignment: 'high' },
    { title: 'Cykl Mindfulness & Medytacja', context: 'Wprowadzenie nowych zajęć łączących elementy wellness z medytacją. Dla obecnych klubowiczów szukających holistycznego podejścia do zdrowia.', alignment: 'high' },
    { title: 'Program Lojalnościowy - Komunikacja', context: 'Materiały informujące o korzyściach programu lojalnościowego. Cel: zwiększenie retencji przez nagradzanie regularności.', alignment: 'high' },

    // ŚREDNIO DOPASOWANE (fitness ogólny, nie akwizycja)
    { title: 'Nowy Grafik Zajęć Grupowych', context: 'Informacja o zmianach w grafiku zajęć. Prośba o grafikę informacyjną do wywieszenia w klubie i na social media.', alignment: 'medium' },
    { title: 'Trening Funkcjonalny - Nowy Trener', context: 'Przedstawienie nowego trenera prowadzącego zajęcia functional training. Komunikacja do obecnych członków.', alignment: 'medium' },
    { title: 'Wakacyjne Godziny Otwarcia', context: 'Informacja o zmienionych godzinach pracy klubu w okresie wakacyjnym. Grafika informacyjna.', alignment: 'medium' },
    { title: 'Strefa Saun - Nowe Zasady', context: 'Komunikat o zaktualizowanych zasadach korzystania ze strefy saun i wellness. Cel: poprawa doświadczenia klubowiczów.', alignment: 'medium' },
    { title: 'Event Charytatywny w Klubie', context: 'Organizujemy zbiórkę charytatywną podczas zajęć fitness. Potrzebne materiały promocyjne dla obecnych członków.', alignment: 'medium' },

    // SŁABO DOPASOWANE (akwizycja, promocje cenowe, HIIT - nie pasuje do strategii Zdrofit)
    { title: 'Black Friday - Karnet Roczny -50%', context: 'Agresywna promocja akwizycyjna. Cel: pozyskanie maksymalnej liczby nowych członków z rabatem 50% na karnet roczny.', alignment: 'low' },
    { title: 'Challenge CrossFit - Open Doors', context: 'Event otwarty dla osób spoza klubu. Zawody CrossFit z nagrodami. Cel: pokazanie klubu potencjalnym nowym członkom.', alignment: 'low' },
    { title: 'Bring a Friend Week', context: 'Tydzień darmowych wejść dla znajomych członków. Promocja akwizycyjna z bonusem dla przyprowadzającego.', alignment: 'low' },
    { title: 'Karnet Studencki - Promocja', context: 'Specjalna oferta dla studentów - karnet miesięczny za 99 zł. Kampania skierowana na pozyskanie młodych klientów.', alignment: 'low' },
    { title: 'HIIT Marathon - Zapisy Otwarte', context: 'Intensywny maraton HIIT otwarty dla wszystkich. Promocja klubu w mediach społecznościowych, cel: viralowy zasięg i nowi klienci.', alignment: 'low' },

    // NEUTRALNE (informacyjne, bez wyraźnego kierunku)
    { title: 'Remont Szatni - Informacja', context: 'Komunikat o tymczasowym zamknięciu części szatni z powodu remontu. Grafika informacyjna.', alignment: 'neutral' },
    { title: 'Nowe Maszyny Cardio', context: 'Informacja o dostawie nowych bieżni i orbitreki. Grafika do social media i plakatów w klubie.', alignment: 'neutral' },
    { title: 'Zmiana Recepcjonistów', context: 'Powitanie nowych pracowników recepcji. Grafika przedstawiająca zespół.', alignment: 'neutral' },
    { title: 'Parking - Nowe Zasady', context: 'Informacja o zmianie zasad parkowania dla członków klubu. Plakat i ulotka.', alignment: 'neutral' },
    { title: 'Aplikacja Mobilna - Update', context: 'Komunikat o nowej wersji aplikacji mobilnej klubu z nowymi funkcjami rezerwacji zajęć.', alignment: 'neutral' },
  ]

  // Warsaw region - VERY HIGH activity (green)
  const warsawBriefClubs = clubs.filter(c => c.regionId === regions[0].id).slice(0, 15)
  for (let i = 0; i < 45; i++) {
    const club = warsawBriefClubs[i % warsawBriefClubs.length]
    const daysAgo = Math.floor(Math.random() * 90)
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const variant = briefVariants[i % briefVariants.length]
    briefsToCreate.push({
      code: `BRIEF-2025-${String(1000 + i).padStart(4, '0')}`,
      title: `${variant.title} - ${club.name}`,
      context: variant.context,
      deadline: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: ['APPROVED', 'APPROVED', 'APPROVED', 'SUBMITTED', 'DRAFT'][i % 5] as BriefStatus,
      priority: ['HIGH', 'MEDIUM', 'LOW'][i % 3] as Priority,
      createdById: users[0].id,
      clubId: club.id,
      brandId: zdrofitBrand.id,
      templateId: templates[i % templates.length].id,
      createdAt,
      submittedAt: createdAt,
    })
  }

  // Trójmiasto region - HIGH activity (light green)
  const trojmiastoBriefClubs = clubs.filter(c => c.regionId === regions[1].id).slice(0, 10)
  for (let i = 0; i < 28; i++) {
    const club = trojmiastoBriefClubs[i % trojmiastoBriefClubs.length]
    const daysAgo = Math.floor(Math.random() * 90)
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const variant = briefVariants[(i + 3) % briefVariants.length] // offset to get different mix
    briefsToCreate.push({
      code: `BRIEF-2025-${String(2000 + i).padStart(4, '0')}`,
      title: `${variant.title} - ${club.name}`,
      context: variant.context,
      deadline: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: ['APPROVED', 'APPROVED', 'SUBMITTED', 'DRAFT'][i % 4] as BriefStatus,
      priority: ['HIGH', 'MEDIUM', 'LOW'][i % 3] as Priority,
      createdById: users[1].id,
      clubId: club.id,
      brandId: zdrofitBrand.id,
      templateId: templates[i % templates.length].id,
      createdAt,
      submittedAt: createdAt,
    })
  }

  // Pomorze Zachodnie - MEDIUM activity (blue)
  const pomorzeClubs = clubs.filter(c => c.regionId === regions[2].id)
  for (let i = 0; i < 12; i++) {
    const club = pomorzeClubs[i % pomorzeClubs.length]
    const daysAgo = Math.floor(Math.random() * 90)
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const variant = briefVariants[(i + 7) % briefVariants.length] // different offset
    briefsToCreate.push({
      code: `BRIEF-2025-${String(3000 + i).padStart(4, '0')}`,
      title: `${variant.title} - ${club.name}`,
      context: variant.context,
      deadline: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: ['APPROVED', 'SUBMITTED', 'DRAFT'][i % 3] as BriefStatus,
      priority: ['MEDIUM', 'LOW'][i % 2] as Priority,
      createdById: users[2].id,
      clubId: club.id,
      brandId: zdrofitBrand.id,
      templateId: templates[i % templates.length].id,
      createdAt,
      submittedAt: createdAt,
    })
  }

  // Kujawsko-Pomorskie - LOW activity (orange)
  const kujawskoClubsList = clubs.filter(c => c.regionId === regions[3].id)
  for (let i = 0; i < 5; i++) {
    const club = kujawskoClubsList[i % kujawskoClubsList.length]
    const daysAgo = Math.floor(Math.random() * 90)
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const variant = briefVariants[(i + 10) % briefVariants.length] // starts from low alignment
    briefsToCreate.push({
      code: `BRIEF-2025-${String(4000 + i).padStart(4, '0')}`,
      title: `${variant.title} - ${club.name}`,
      context: variant.context,
      deadline: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: ['SUBMITTED', 'DRAFT'][i % 2] as BriefStatus,
      priority: 'LOW' as Priority,
      createdById: users[2].id,
      clubId: club.id,
      brandId: zdrofitBrand.id,
      templateId: templates[i % templates.length].id,
      createdAt,
      submittedAt: createdAt,
    })
  }

  // Lubelskie - VERY LOW activity (red)
  const lublinClubsList = clubs.filter(c => c.regionId === regions[4].id)
  for (let i = 0; i < 2; i++) {
    const club = lublinClubsList[i % lublinClubsList.length]
    const daysAgo = Math.floor(Math.random() * 90)
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const variant = briefVariants[(i + 15) % briefVariants.length] // neutral variants
    briefsToCreate.push({
      code: `BRIEF-2025-${String(5000 + i).padStart(4, '0')}`,
      title: `${variant.title} - ${club.name}`,
      context: variant.context,
      deadline: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: 'DRAFT' as BriefStatus,
      priority: 'LOW' as Priority,
      createdById: users[2].id,
      clubId: club.id,
      brandId: zdrofitBrand.id,
      templateId: templates[0].id,
      createdAt,
      submittedAt: createdAt,
    })
  }

  // Other regions - minimal activity with varied content
  const otherRegionVariants = [
    { title: 'Yoga Nidra - Nowe Zajęcia', context: 'Wprowadzenie zajęć relaksacyjnych Yoga Nidra. Komunikacja dla obecnych członków szukających głębokiego odprężenia.' },
    { title: 'Spinning Marathon Charytatywny', context: 'Event spinningowy na rzecz lokalnej fundacji. Cel: integracja społeczności klubowej i działania CSR.' },
    { title: 'Promocja First Minute Lato', context: 'Wczesna promocja letnich karnetów. Kampania akwizycyjna z rabatem 30% dla nowych członków zapisujących się do końca maja.' },
    { title: 'Dzień Otwarty - Open Gym', context: 'Dzień bezpłatnych wejść do klubu dla wszystkich. Cel: pozyskanie nowych klientów przez demonstrację oferty.' },
    { title: 'Stretching po Pracy', context: 'Nowy cykl zajęć rozciągających o 18:00 dla osób pracujących. Komunikacja do obecnych członków o stresującym trybie życia.' },
  ]

  const otherRegions = [regions[5], regions[6], regions[7], regions[8], regions[9]]
  for (const region of otherRegions) {
    const regionClubs = clubs.filter(c => c.regionId === region.id)
    if (regionClubs.length > 0) {
      const club = regionClubs[0]
      const daysAgo = Math.floor(Math.random() * 90)
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      const variant = otherRegionVariants[otherRegions.indexOf(region)]
      briefsToCreate.push({
        code: `BRIEF-2025-${String(6000 + otherRegions.indexOf(region)).padStart(4, '0')}`,
        title: `${variant.title} - ${club.name}`,
        context: variant.context,
        deadline: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
        status: 'DRAFT' as BriefStatus,
        priority: 'LOW' as Priority,
        createdById: users[2].id,
        clubId: club.id,
        brandId: zdrofitBrand.id,
        templateId: templates[0].id,
        createdAt,
        submittedAt: createdAt,
      })
    }
  }

  // Create all briefs
  for (const briefData of briefsToCreate) {
    await prisma.brief.create({ data: briefData })
  }

  console.log(`✅ Created ${briefsToCreate.length} sample briefs`)

  // ============== SALES FOCUS ==============
  console.log('🎯 Creating sales focus...')
  await prisma.salesFocus.create({
    data: {
      title: 'Akwizycja Q1 2026 - Noworoczne postanowienia',
      description: 'Główny cel na Q1: maksymalizacja nowych zapisów wykorzystując sezon noworoczny. Focus na karnety roczne i półroczne z atrakcyjnymi warunkami.',
      period: FocusPeriod.QUARTERLY,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
      brandId: zdrofitBrand.id,
      createdById: users[3].id,
    },
  })

  // ============== STRATEGY DOCUMENT ==============
  console.log('📜 Creating strategy document...')
  await prisma.strategyDocument.create({
    data: {
      title: 'Wytyczne strategiczne marek 2026',
      description: 'Główne kierunki strategiczne dla wszystkich marek na rok 2026',
      type: StrategyDocumentType.BRAND_GUIDELINES,
      scope: StrategyDocumentScope.GLOBAL,
      content: `# Wytyczne strategiczne marek 2026

## 1. Zdrofit

**Priorytet strategiczny:**
- retencja i LTV,
- wysoka jakość doświadczenia klubowicza.

**Kluczowe zajęcia (rdzeń oferty):**
- Yoga / Pilates
- Mobility / Stretching

**Jak myśleć decyzyjnie:**
- decyzje mają wzmacniać komfort, zdrowie i regularność,
- zajęcia są argumentem utrzymaniowym, nie promocyjnym.

---

## 2. My Fitness Place

**Priorytet strategiczny:**
- akwizycja młodych profesjonalistów (25-40 lat),
- pozycjonowanie premium w segmencie corporate wellness.

**Kluczowe zajęcia:**
- HIIT / Functional Training
- Spinning / Indoor Cycling

**Jak myśleć decyzyjnie:**
- komunikacja aspiracyjna, lifestyle-oriented,
- partnerstwa z firmami technologicznymi i startupami.`,
      version: 1,
      isActive: true,
      validFrom: new Date('2026-01-01'),
      createdById: users[6].id,
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log(`
📊 Summary:
- Regions: ${regions.length}
- Brands: ${brands.length}
- Clubs: ${clubs.length} (real Zdrofit locations)
- Users: ${users.length}
- Templates: ${templates.length}
- Briefs: ${briefsToCreate.length}
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
