// Seed script for Club Manager Briefing System
// Run with: npm run db:seed

import { PrismaClient, UserRole, Objective, Priority } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.deliverable.deleteMany()
  await prisma.productionTask.deleteMany()
  await prisma.approval.deleteMany()
  await prisma.brief.deleteMany()
  await prisma.userClub.deleteMany()
  await prisma.club.deleteMany()
  await prisma.requestTemplate.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.region.deleteMany()
  await prisma.user.deleteMany()

  // ============== REGIONS ==============
  console.log('📍 Creating regions...')
  const regions = await Promise.all([
    prisma.region.create({ data: { name: 'Warszawa i okolice', code: 'WAW' } }),
    prisma.region.create({ data: { name: 'Kraków i okolice', code: 'KRK' } }),
    prisma.region.create({ data: { name: 'Wrocław i okolice', code: 'WRO' } }),
    prisma.region.create({ data: { name: 'Trójmiasto', code: 'TRI' } }),
    prisma.region.create({ data: { name: 'Poznań i okolice', code: 'POZ' } }),
    prisma.region.create({ data: { name: 'Śląsk', code: 'SLA' } }),
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
    prisma.brand.create({
      data: {
        name: 'My Fitness Place',
        code: 'MFP',
        primaryColor: '#FF6B00',
        guidelinesUrl: 'https://drive.google.com/drive/folders/mfp-brand-guidelines',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Fabryka Formy',
        code: 'FF',
        primaryColor: '#1E3A8A',
        guidelinesUrl: 'https://drive.google.com/drive/folders/ff-brand-guidelines',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Fit Fabric',
        code: 'FITFAB',
        primaryColor: '#7C3AED',
        guidelinesUrl: 'https://drive.google.com/drive/folders/fitfab-brand-guidelines',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Fitness Academy',
        code: 'FA',
        primaryColor: '#E11D48',
        guidelinesUrl: 'https://drive.google.com/drive/folders/fa-brand-guidelines',
      },
    }),
  ])

  // ============== CLUBS ==============
  console.log('🏢 Creating clubs...')
  const clubs = await Promise.all([
    // Zdrofit clubs - Warsaw
    prisma.club.create({
      data: {
        name: 'Zdrofit Arkadia',
        code: 'ZDF-WAW-ARK',
        city: 'Warszawa',
        address: 'Al. Jana Pawła II 82, Centrum Handlowe Arkadia',
        regionId: regions[0].id,
        brandId: brands[0].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Zdrofit Galeria Mokotów',
        code: 'ZDF-WAW-MOK',
        city: 'Warszawa',
        address: 'ul. Wołoska 12, Galeria Mokotów',
        regionId: regions[0].id,
        brandId: brands[0].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Zdrofit Złote Tarasy',
        code: 'ZDF-WAW-ZLT',
        city: 'Warszawa',
        address: 'ul. Złota 59, Złote Tarasy',
        regionId: regions[0].id,
        brandId: brands[0].id,
      },
    }),
    // Zdrofit clubs - Krakow
    prisma.club.create({
      data: {
        name: 'Zdrofit Bonarka',
        code: 'ZDF-KRK-BON',
        city: 'Kraków',
        address: 'ul. Kamieńskiego 11, Bonarka City Center',
        regionId: regions[1].id,
        brandId: brands[0].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Zdrofit Galeria Krakowska',
        code: 'ZDF-KRK-GAL',
        city: 'Kraków',
        address: 'ul. Pawia 5, Galeria Krakowska',
        regionId: regions[1].id,
        brandId: brands[0].id,
      },
    }),
    // My Fitness Place clubs
    prisma.club.create({
      data: {
        name: 'My Fitness Place Marszałkowska',
        code: 'MFP-WAW-MAR',
        city: 'Warszawa',
        address: 'ul. Marszałkowska 104/122',
        regionId: regions[0].id,
        brandId: brands[1].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'My Fitness Place Wrocław Centrum',
        code: 'MFP-WRO-CEN',
        city: 'Wrocław',
        address: 'ul. Świdnicka 40',
        regionId: regions[2].id,
        brandId: brands[1].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'My Fitness Place Katowice Silesia',
        code: 'MFP-KAT-SIL',
        city: 'Katowice',
        address: 'ul. Chorzowska 107, Silesia City Center',
        regionId: regions[5].id,
        brandId: brands[1].id,
      },
    }),
    // Fabryka Formy clubs
    prisma.club.create({
      data: {
        name: 'Fabryka Formy Gdańsk',
        code: 'FF-GDA-001',
        city: 'Gdańsk',
        address: 'ul. Grunwaldzka 141',
        regionId: regions[3].id,
        brandId: brands[2].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Fabryka Formy Sopot',
        code: 'FF-SOP-001',
        city: 'Sopot',
        address: 'ul. Bohaterów Monte Cassino 49',
        regionId: regions[3].id,
        brandId: brands[2].id,
      },
    }),
    // Fit Fabric
    prisma.club.create({
      data: {
        name: 'Fit Fabric Poznań Stary Browar',
        code: 'FITFAB-POZ-SB',
        city: 'Poznań',
        address: 'ul. Półwiejska 42, Stary Browar',
        regionId: regions[4].id,
        brandId: brands[3].id,
      },
    }),
    // Fitness Academy clubs
    prisma.club.create({
      data: {
        name: 'Fitness Academy Praga',
        code: 'FA-WAW-PRA',
        city: 'Warszawa',
        address: 'ul. Targowa 72, Praga Północ',
        regionId: regions[0].id,
        brandId: brands[4].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Fitness Academy Łódź Manufaktura',
        code: 'FA-LOD-MAN',
        city: 'Łódź',
        address: 'ul. Drewnowska 58, Manufaktura',
        regionId: regions[5].id, // Śląsk - blisko
        brandId: brands[4].id,
      },
    }),
  ])

  // ============== REQUEST TEMPLATES ==============
  console.log('📝 Creating request templates...')
  const templates = await Promise.all([
    // Social Media Post - simplified (formats handled globally in form)
    prisma.requestTemplate.create({
      data: {
        name: 'Post social media (Facebook/Instagram)',
        code: 'SOCIAL_POST',
        description: 'Grafiki na social media klubu w standardowych formatach Benefit Systems.',
        defaultSLADays: 3,
        requiredFields: {
          type: 'object',
          properties: {},
        },
      },
    }),

    // Print Poster/Flyer - simplified (formats handled globally in form)
    prisma.requestTemplate.create({
      data: {
        name: 'Plakat / Ulotka drukowana',
        code: 'PRINT_POSTER',
        description: 'Materiały drukowane do ekspozycji w klubie, okolicy lub dystrybucji bezpośredniej.',
        defaultSLADays: 5,
        requiredFields: {
          type: 'object',
          properties: {},
        },
      },
    }),

    // Event Kit - simplified
    prisma.requestTemplate.create({
      data: {
        name: 'Kit promocyjny wydarzenia lokalnego',
        code: 'EVENT_KIT',
        description: 'Kompletny zestaw materiałów promocyjnych na wydarzenie w klubie (dzień otwarty, maraton, warsztaty itp.).',
        defaultSLADays: 7,
        requiredFields: {
          type: 'object',
          properties: {
            eventName: {
              type: 'string',
              title: 'Nazwa wydarzenia',
              maxLength: 100,
            },
            eventDate: {
              type: 'string',
              title: 'Data wydarzenia',
              format: 'date',
            },
          },
        },
      },
    }),

    // Quick Graphic - simplified
    prisma.requestTemplate.create({
      data: {
        name: 'Szybka grafika informacyjna',
        code: 'QUICK_INFO',
        description: 'Prosta grafika do szybkiej komunikacji (zmiana godzin, awaria, info o trenerze itp.). Ekspresowa realizacja.',
        defaultSLADays: 1,
        requiredFields: {
          type: 'object',
          properties: {},
        },
      },
    }),

    // Seasonal Campaign - simplified (formats handled globally in form)
    prisma.requestTemplate.create({
      data: {
        name: 'Kampania sezonowa / promocyjna',
        code: 'SEASONAL_CAMPAIGN',
        description: 'Rozbudowana kampania promocyjna (Nowy Rok, Lato, Black Friday itp.) - wymaga więcej czasu na realizację.',
        defaultSLADays: 10,
        requiredFields: {
          type: 'object',
          properties: {
            campaignName: {
              type: 'string',
              title: 'Nazwa kampanii',
              maxLength: 100,
            },
          },
        },
      },
    }),
  ])

  // ============== USERS ==============
  console.log('👥 Creating users...')
  const passwordHash = await hash('password123', 12)

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
    prisma.user.create({
      data: {
        email: 'tomasz.zielinski@benefit.pl',
        passwordHash,
        name: 'Tomasz Zieliński',
        role: UserRole.CLUB_MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'magdalena.dabrowska@benefit.pl',
        passwordHash,
        name: 'Magdalena Dąbrowska',
        role: UserRole.CLUB_MANAGER,
      },
    }),
    // Validators (Regional Managers)
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
    prisma.user.create({
      data: {
        email: 'jan.kowalczyk@benefit.pl',
        passwordHash,
        name: 'Jan Kowalczyk',
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
    prisma.user.create({
      data: {
        email: 'grafik1@benefit.pl',
        passwordHash,
        name: 'Marta Nowicka',
        role: UserRole.PRODUCTION,
      },
    }),
    prisma.user.create({
      data: {
        email: 'partner@reszek.pl',
        passwordHash,
        name: 'Reszek Studio',
        role: UserRole.PRODUCTION,
      },
    }),
    // Admin
    prisma.user.create({
      data: {
        email: 'admin@benefit.pl',
        passwordHash,
        name: 'Administrator Systemu',
        role: UserRole.ADMIN,
      },
    }),
  ])

  // ============== USER-CLUB ASSIGNMENTS ==============
  console.log('🔗 Assigning users to clubs...')
  await Promise.all([
    // Manager assignments (isManager = true)
    prisma.userClub.create({ data: { userId: users[0].id, clubId: clubs[0].id, isManager: true } }), // Anna -> Zdrofit Arkadia
    prisma.userClub.create({ data: { userId: users[1].id, clubId: clubs[1].id, isManager: true } }), // Piotr -> Zdrofit Mokotów
    prisma.userClub.create({ data: { userId: users[1].id, clubId: clubs[2].id, isManager: true } }), // Piotr -> also Złote Tarasy
    prisma.userClub.create({ data: { userId: users[2].id, clubId: clubs[5].id, isManager: true } }), // Katarzyna -> S4 Marszałkowska
    prisma.userClub.create({ data: { userId: users[3].id, clubId: clubs[3].id, isManager: true } }), // Tomasz -> Zdrofit Bonarka
    prisma.userClub.create({ data: { userId: users[3].id, clubId: clubs[4].id, isManager: true } }), // Tomasz -> also Galeria Krakowska
    prisma.userClub.create({ data: { userId: users[4].id, clubId: clubs[8].id, isManager: true } }), // Magdalena -> FF Gdańsk

    // Validator assignments (isManager = false) - they oversee but don't manage
    // Michał Adamski -> Warsaw region (all Warsaw clubs)
    prisma.userClub.create({ data: { userId: users[5].id, clubId: clubs[0].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[5].id, clubId: clubs[1].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[5].id, clubId: clubs[2].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[5].id, clubId: clubs[5].id, isManager: false } }),
    // Ewa Mazur -> Krakow region
    prisma.userClub.create({ data: { userId: users[6].id, clubId: clubs[3].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[6].id, clubId: clubs[4].id, isManager: false } }),
    // Jan Kowalczyk -> Other regions (Wrocław, Trójmiasto, Śląsk, Poznań)
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[6].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[7].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[8].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[9].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[10].id, isManager: false } }),
  ])

  // ============== SAMPLE BRIEFS ==============
  console.log('📋 Creating sample briefs...')
  const briefCounter = { value: 1 }
  const generateBriefCode = () => {
    const code = `BRIEF-2024-${String(briefCounter.value).padStart(4, '0')}`
    briefCounter.value++
    return code
  }

  const now = new Date()
  const inDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  const briefs = await Promise.all([
    // Brief 1: Draft - social post
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[0].id,
        clubId: clubs[0].id,
        brandId: brands[0].id,
        templateId: templates[0].id,
        status: 'DRAFT',
        priority: Priority.MEDIUM,
        title: 'Promocja karnetu rocznego - styczeń',
        objective: Objective.ACQUISITION,
        kpiDescription: '50 nowych karnetów rocznych',
        kpiTarget: 50,
        deadline: inDays(10),
        startDate: inDays(2),
        endDate: inDays(30),
        context: 'Sezon noworoczny to najlepszy moment na sprzedaż karnetów rocznych. W zeszłym roku mieliśmy 35 nowych karnetów w styczniu. Chcemy pobić ten wynik.',
        offerDetails: 'Karnet roczny -20%, cena 1599 PLN zamiast 1999 PLN. Możliwość płatności jednorazowej lub w 12 ratach 0%. Dodatkowo torba sportowa gratis.',
        customFields: {
          channels: ['facebook', 'instagram_feed'],
          formats: ['single_image', 'carousel'],
          mainMessage: 'Nowy Rok, Nowy Ty! Karnet roczny -20%',
          callToAction: 'Zapisz się',
        },
        assetLinks: ['https://drive.google.com/drive/folders/zdrofit-arkadia-photos-2024'],
      },
    }),

    // Brief 2: Submitted - waiting for approval
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[1].id,
        clubId: clubs[1].id,
        brandId: brands[0].id,
        templateId: templates[1].id,
        status: 'SUBMITTED',
        priority: Priority.HIGH,
        title: 'Plakaty na Walentynki - trening w parach',
        objective: Objective.ATTENDANCE,
        kpiDescription: '30 par na treningu walentynkowym',
        kpiTarget: 30,
        deadline: inDays(8),
        startDate: inDays(12),
        endDate: inDays(16),
        context: 'Coroczna akcja walentynkowa. W zeszłym roku mieliśmy 20 par, w tym roku chcemy więcej. Mamy nowego instruktora od tańca który poprowadzi część zajęć.',
        offerDetails: 'Trening w parach gratis dla członków klubu + partner (nawet bez karnetu). 14.02 w godzinach 18:00-20:00. W programie: fitness w parach, krótki kurs tańca, smoothie bar.',
        legalCopy: 'Liczba miejsc ograniczona. Wymagana wcześniejsza rejestracja na recepcji lub telefonicznie.',
        customFields: {
          printFormats: ['A3', 'A2'],
          quantity: '11-50',
          mainMessage: 'Trenuj z ukochaną osobą! Walentynkowy trening w parach',
          includeQR: true,
          qrDestination: 'https://zdrofit.pl/walentynki-mokotow',
          distributionLocations: 'Recepcja klubu, tablice informacyjne na każdym piętrze, szatnie',
        },
        assetLinks: [],
        submittedAt: now,
      },
    }),

    // Brief 3: Approved - in production
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[2].id,
        clubId: clubs[5].id,
        brandId: brands[1].id,
        templateId: templates[2].id,
        status: 'APPROVED',
        priority: Priority.CRITICAL,
        title: 'Otwarcie nowej strefy functional - event kit',
        objective: Objective.AWARENESS,
        kpiDescription: '100 uczestników na dniu otwartym',
        kpiTarget: 100,
        deadline: inDays(5),
        startDate: inDays(12),
        endDate: inDays(12),
        context: 'Otwarcie nowej strefy functional training - inwestycja 500k PLN. To największa strefa functional w Warszawie. Mamy umowę z Mateuszem Kowalczykiem (mistrz CrossFit) na prowadzenie pokazów.',
        offerDetails: 'Dzień otwarty. Darmowe treningi pokazowe co godzinę od 10:00 do 18:00. Dla uczestników -30% na pierwszy miesiąc karnetu.',
        legalCopy: 'Liczba miejsc na każdy pokaz ograniczona do 20 osób. Wymagana rejestracja online.',
        customFields: {
          eventName: 'Dzień Otwarty Strefy Functional',
          eventDate: inDays(12).toISOString().split('T')[0],
          eventTime: '10:00-18:00',
          eventType: 'dzien_otwarty',
          materials: ['post_facebook', 'post_instagram', 'stories_set', 'plakat_A2', 'roll_up', 'grafika_TV'],
          specialGuests: 'Mateusz Kowalczyk - mistrz Polski CrossFit 2023',
          maxParticipants: 100,
          registrationRequired: true,
          registrationUrl: 'https://s4fitness.pl/functional-opening',
        },
        assetLinks: [
          'https://drive.google.com/drive/folders/s4-functional-zone-photos',
          'https://drive.google.com/drive/folders/mateusz-kowalczyk-promo',
        ],
        submittedAt: inDays(-2),
      },
    }),

    // Brief 4: Changes requested
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[3].id,
        clubId: clubs[3].id,
        brandId: brands[0].id,
        templateId: templates[3].id,
        status: 'CHANGES_REQUESTED',
        priority: Priority.HIGH,
        title: 'Info o zmianie godzin w weekend',
        objective: Objective.OTHER,
        kpiDescription: 'Poinformowanie wszystkich członków',
        deadline: inDays(2),
        startDate: inDays(4),
        endDate: inDays(6),
        context: 'Remont instalacji elektrycznej w centrum handlowym wymusza zmianę godzin pracy klubu w najbliższy weekend.',
        offerDetails: 'Sobota: 8:00-20:00 (zamiast 6:00-22:00), Niedziela: 9:00-18:00 (zamiast 8:00-21:00)',
        customFields: {
          infoType: 'zmiana_godzin',
          mainMessage: 'Zmiana godzin otwarcia w weekend 20-21.01',
          validFrom: inDays(4).toISOString().split('T')[0],
          validTo: inDays(6).toISOString().split('T')[0],
          displayLocations: ['tv_recepcja', 'facebook', 'instagram_stories'],
        },
        assetLinks: [],
        submittedAt: inDays(-1),
      },
    }),

    // Brief 5: Delivered - pending outcome tagging
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[4].id,
        clubId: clubs[8].id,
        brandId: brands[2].id,
        templateId: templates[4].id,
        status: 'APPROVED',
        priority: Priority.MEDIUM,
        title: 'Kampania Black Friday - karnety prezentowe',
        objective: Objective.ACQUISITION,
        kpiDescription: '25 karnetów prezentowych',
        kpiTarget: 25,
        deadline: inDays(-5),
        startDate: inDays(-10),
        endDate: inDays(-3),
        context: 'Black Friday to świetna okazja na sprzedaż karnetów prezentowych. W zeszłym roku sprzedaliśmy 15, w tym roku celujemy wyżej.',
        offerDetails: 'Karnet prezentowy 3-miesięczny w cenie 2-miesięcznego. Eleganckie pudełko prezentowe gratis.',
        customFields: {
          campaignName: 'Black Friday 2024',
          campaignType: 'black_friday',
          channels: ['facebook', 'instagram', 'mailing'],
          mainMessage: 'Podaruj zdrowie bliskiej osobie! Karnet prezentowy -33%',
          targetAudience: 'Osoby szukające prezentów świątecznych, 25-55 lat',
          budget: '1000_2500',
        },
        assetLinks: [],
        submittedAt: inDays(-12),
      },
    }),
  ])

  // ============== APPROVALS ==============
  console.log('✅ Creating approvals...')
  await Promise.all([
    // Approval for brief 3 (approved)
    prisma.approval.create({
      data: {
        briefId: briefs[2].id,
        validatorId: users[5].id,
        decision: 'APPROVED',
        notes: 'Świetna akcja! Priorytet CRITICAL uzasadniony - to duża inwestycja. Proszę o realizację ASAP. Pamiętajcie o zgodności z brand guidelines My Fitness Place.',
      },
    }),
    // Approval for brief 4 (changes requested)
    prisma.approval.create({
      data: {
        briefId: briefs[3].id,
        validatorId: users[6].id,
        decision: 'CHANGES_REQUESTED',
        notes: 'Proszę dodać informację o tym, że grafik zajęć w te dni pozostaje bez zmian (tylko godziny otwarcia się zmieniają). Członkowie mogą się niepokoić o swoje zajęcia.',
      },
    }),
    // Approval for brief 5 (delivered)
    prisma.approval.create({
      data: {
        briefId: briefs[4].id,
        validatorId: users[7].id,
        decision: 'APPROVED',
        notes: 'OK, akceptuję. Budżet mediowy do dyspozycji.',
      },
    }),
  ])

  // ============== PRODUCTION TASKS ==============
  console.log('🔧 Creating production tasks...')
  const productionTasks = await Promise.all([
    // Task for brief 3 (in progress)
    prisma.productionTask.create({
      data: {
        briefId: briefs[2].id,
        assigneeId: users[8].id,
        status: 'IN_PROGRESS',
        slaDays: 5,
        dueDate: inDays(5),
        notes: 'Kluczowy projekt - otwarcie nowej strefy. Priorytet nad innymi zadaniami.',
      },
    }),
    // Task for brief 5 (delivered)
    prisma.productionTask.create({
      data: {
        briefId: briefs[4].id,
        assigneeId: users[9].id,
        status: 'DELIVERED',
        slaDays: 7,
        dueDate: inDays(-5),
        notes: 'Wszystkie materiały dostarczone zgodnie z briefem.',
      },
    }),
  ])

  // ============== DELIVERABLES ==============
  console.log('📦 Creating deliverables...')
  await Promise.all([
    // Deliverables for brief 5 (delivered)
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[1].id,
        name: 'Post Facebook - Black Friday',
        type: 'social_post',
        fileUrl: 'https://drive.google.com/file/d/bf-fb-post-v2',
        version: 2,
        isApproved: true,
        changeNotes: 'v2 - poprawiona wielkość tekstu zgodnie z uwagami',
      },
    }),
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[1].id,
        name: 'Post Instagram - Black Friday',
        type: 'social_post',
        fileUrl: 'https://drive.google.com/file/d/bf-ig-post-v1',
        version: 1,
        isApproved: true,
      },
    }),
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[1].id,
        name: 'Grafika do mailingu',
        type: 'mailing',
        fileUrl: 'https://drive.google.com/file/d/bf-mailing-v1',
        version: 1,
        isApproved: true,
      },
    }),
  ])

  // ============== NOTIFICATIONS ==============
  console.log('🔔 Creating sample notifications...')
  await Promise.all([
    // Notification for validator about submitted brief
    prisma.notification.create({
      data: {
        userId: users[5].id,
        type: 'BRIEF_SUBMITTED',
        title: 'Nowy brief do zatwierdzenia',
        message: 'Brief "Plakaty na Walentynki - trening w parach" czeka na Twoją decyzję.',
        linkUrl: `/briefs/${briefs[1].id}`,
        isRead: false,
      },
    }),
    // Notification for club manager about changes requested
    prisma.notification.create({
      data: {
        userId: users[3].id,
        type: 'CHANGES_REQUESTED',
        title: 'Wymagane poprawki',
        message: 'Twój brief "Info o zmianie godzin w weekend" wymaga poprawek.',
        linkUrl: `/briefs/${briefs[3].id}`,
        isRead: false,
      },
    }),
    // Notification for production about new task
    prisma.notification.create({
      data: {
        userId: users[8].id,
        type: 'NEW_TASK',
        title: 'Nowe zlecenie w kolejce',
        message: 'Brief "Otwarcie nowej strefy functional - event kit" jest gotowy do realizacji.',
        linkUrl: `/production/${productionTasks[0].id}`,
        isRead: true,
      },
    }),
  ])

  // ============== AUDIT LOGS ==============
  console.log('📝 Creating audit logs...')
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: users[2].id,
        briefId: briefs[2].id,
        action: 'BRIEF_CREATED',
        details: { title: briefs[2].title },
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: users[2].id,
        briefId: briefs[2].id,
        action: 'BRIEF_SUBMITTED',
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: users[5].id,
        briefId: briefs[2].id,
        action: 'APPROVAL_APPROVED',
        details: { priority: 'CRITICAL' },
      },
    }),
  ])

  // ============== SUMMARY ==============
  console.log('')
  console.log('✅ Seed completed successfully!')
  console.log('')
  console.log('📊 Created:')
  console.log(`   - ${regions.length} regions`)
  console.log(`   - ${brands.length} brands`)
  console.log(`   - ${clubs.length} clubs`)
  console.log(`   - ${templates.length} request templates`)
  console.log(`   - ${users.length} users`)
  console.log(`   - ${briefs.length} sample briefs`)
  console.log(`   - ${productionTasks.length} production tasks`)
  console.log('')
  console.log('🔐 Test accounts (password: password123):')
  console.log('')
  console.log('   Club Managers:')
  console.log('   - anna.kowalska@benefit.pl (Zdrofit Arkadia)')
  console.log('   - piotr.nowak@benefit.pl (Zdrofit Mokotów, Złote Tarasy)')
  console.log('   - katarzyna.wiszniewska@benefit.pl (My Fitness Place Marszałkowska)')
  console.log('')
  console.log('   Validators:')
  console.log('   - michal.adamski@benefit.pl (Warsaw region)')
  console.log('   - ewa.mazur@benefit.pl (Krakow region)')
  console.log('')
  console.log('   Production:')
  console.log('   - studio@benefit.pl')
  console.log('   - partner@reszek.pl')
  console.log('')
  console.log('   Admin:')
  console.log('   - admin@benefit.pl')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
