// Seed script for Club Manager Briefing System - Demo Data
// Run with: npm run db:seed

import { PrismaClient, UserRole, Objective, Priority, TaskStatus, BriefStatus, FocusPeriod, Outcome, ConfidenceLevel } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting demo seed...')

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
    prisma.region.create({ data: { name: 'Kraków i Małopolska', code: 'KRK' } }),
    prisma.region.create({ data: { name: 'Wrocław i Dolny Śląsk', code: 'WRO' } }),
    prisma.region.create({ data: { name: 'Trójmiasto', code: 'TRI' } }),
    prisma.region.create({ data: { name: 'Poznań i Wielkopolska', code: 'POZ' } }),
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
    // Zdrofit - Warszawa (FLAGSHIP)
    prisma.club.create({
      data: {
        name: 'Zdrofit Arkadia',
        code: 'ZDF-WAW-ARK',
        city: 'Warszawa',
        address: 'Al. Jana Pawła II 82, Centrum Handlowe Arkadia',
        regionId: regions[0].id,
        brandId: brands[0].id,
        tier: 'FLAGSHIP',
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
        tier: 'VIP',
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
        tier: 'VIP',
      },
    }),
    // Zdrofit - Kraków
    prisma.club.create({
      data: {
        name: 'Zdrofit Bonarka',
        code: 'ZDF-KRK-BON',
        city: 'Kraków',
        address: 'ul. Kamieńskiego 11, Bonarka City Center',
        regionId: regions[1].id,
        brandId: brands[0].id,
        tier: 'STANDARD',
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
        tier: 'VIP',
      },
    }),
    // My Fitness Place
    prisma.club.create({
      data: {
        name: 'My Fitness Place Marszałkowska',
        code: 'MFP-WAW-MAR',
        city: 'Warszawa',
        address: 'ul. Marszałkowska 104/122',
        regionId: regions[0].id,
        brandId: brands[1].id,
        tier: 'FLAGSHIP',
      },
    }),
    prisma.club.create({
      data: {
        name: 'My Fitness Place Wrocław',
        code: 'MFP-WRO-CEN',
        city: 'Wrocław',
        address: 'ul. Świdnicka 40',
        regionId: regions[2].id,
        brandId: brands[1].id,
        tier: 'STANDARD',
      },
    }),
    // Fabryka Formy - Trójmiasto
    prisma.club.create({
      data: {
        name: 'Fabryka Formy Gdańsk',
        code: 'FF-GDA-001',
        city: 'Gdańsk',
        address: 'ul. Grunwaldzka 141',
        regionId: regions[3].id,
        brandId: brands[2].id,
        tier: 'FLAGSHIP',
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
        tier: 'VIP',
      },
    }),
    // Fit Fabric - Poznań
    prisma.club.create({
      data: {
        name: 'Fit Fabric Stary Browar',
        code: 'FITFAB-POZ-SB',
        city: 'Poznań',
        address: 'ul. Półwiejska 42, Stary Browar',
        regionId: regions[4].id,
        brandId: brands[3].id,
        tier: 'FLAGSHIP',
      },
    }),
    // Fitness Academy - Śląsk
    prisma.club.create({
      data: {
        name: 'Fitness Academy Katowice',
        code: 'FA-KAT-SIL',
        city: 'Katowice',
        address: 'ul. Chorzowska 107, Silesia City Center',
        regionId: regions[5].id,
        brandId: brands[4].id,
        tier: 'VIP',
      },
    }),
  ])

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
    // Club Managers (0-4)
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
    // Validators (5-7)
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
    // Production Team (8-10)
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
        email: 'marta.grafik@benefit.pl',
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
    // Admin (11)
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
  await Promise.all([
    // Manager assignments
    prisma.userClub.create({ data: { userId: users[0].id, clubId: clubs[0].id, isManager: true } }), // Anna -> Zdrofit Arkadia
    prisma.userClub.create({ data: { userId: users[1].id, clubId: clubs[1].id, isManager: true } }), // Piotr -> Zdrofit Mokotów
    prisma.userClub.create({ data: { userId: users[1].id, clubId: clubs[2].id, isManager: true } }), // Piotr -> Złote Tarasy
    prisma.userClub.create({ data: { userId: users[2].id, clubId: clubs[5].id, isManager: true } }), // Katarzyna -> MFP Marszałkowska
    prisma.userClub.create({ data: { userId: users[3].id, clubId: clubs[3].id, isManager: true } }), // Tomasz -> Zdrofit Bonarka
    prisma.userClub.create({ data: { userId: users[3].id, clubId: clubs[4].id, isManager: true } }), // Tomasz -> Galeria Krakowska
    prisma.userClub.create({ data: { userId: users[4].id, clubId: clubs[7].id, isManager: true } }), // Magdalena -> FF Gdańsk
    prisma.userClub.create({ data: { userId: users[4].id, clubId: clubs[8].id, isManager: true } }), // Magdalena -> FF Sopot

    // Validator assignments - Michał (Warsaw)
    prisma.userClub.create({ data: { userId: users[5].id, clubId: clubs[0].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[5].id, clubId: clubs[1].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[5].id, clubId: clubs[2].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[5].id, clubId: clubs[5].id, isManager: false } }),
    // Validator assignments - Ewa (Krakow)
    prisma.userClub.create({ data: { userId: users[6].id, clubId: clubs[3].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[6].id, clubId: clubs[4].id, isManager: false } }),
    // Validator assignments - Jan (pozostałe)
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[6].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[7].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[8].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[9].id, isManager: false } }),
    prisma.userClub.create({ data: { userId: users[7].id, clubId: clubs[10].id, isManager: false } }),
  ])

  // ============== SALES FOCUSES ==============
  console.log('🎯 Creating sales focuses...')
  const now = new Date()
  const inDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  await Promise.all([
    // Strategic (global) focus
    prisma.salesFocus.create({
      data: {
        title: 'Akwizycja Q1 2025 - Noworoczne postanowienia',
        description: 'Główny cel na Q1: maksymalizacja nowych zapisów wykorzystując sezon noworoczny. Focus na karnety roczne i półroczne z atrakcyjnymi warunkami.',
        period: FocusPeriod.QUARTERLY,
        startDate: daysAgo(10),
        endDate: inDays(80),
        createdById: users[11].id,
        isActive: true,
      },
    }),
    // Regional focus - Warsaw
    prisma.salesFocus.create({
      data: {
        title: 'Promocja Premium w Warszawie',
        description: 'Kampania skierowana do segmentu premium w Warszawie. Podkreślamy jakość sprzętu i trenerów personalnych.',
        period: FocusPeriod.MONTHLY,
        startDate: daysAgo(5),
        endDate: inDays(25),
        regionId: regions[0].id,
        createdById: users[5].id,
        isActive: true,
      },
    }),
    // Regional focus - Krakow
    prisma.salesFocus.create({
      data: {
        title: 'Studenci - Kraków',
        description: 'Promocja dla studentów krakowskich uczelni. Karnet studencki -30% + darmowy personal training na start.',
        period: FocusPeriod.MONTHLY,
        startDate: daysAgo(3),
        endDate: inDays(27),
        regionId: regions[1].id,
        createdById: users[6].id,
        isActive: true,
      },
    }),
    // Brand focus - Zdrofit
    prisma.salesFocus.create({
      data: {
        title: 'Zdrofit Family - rodziny z dziećmi',
        description: 'Promocja karnetów rodzinnych. Dzieci do 14 lat ćwiczą za 50% ceny przy karnecie rodzica.',
        period: FocusPeriod.MONTHLY,
        startDate: daysAgo(7),
        endDate: inDays(23),
        brandId: brands[0].id,
        createdById: users[5].id,
        isActive: true,
      },
    }),
    // Brand focus - My Fitness Place
    prisma.salesFocus.create({
      data: {
        title: 'MFP Corporate Wellness',
        description: 'Pozyskiwanie klientów korporacyjnych. Pakiety firmowe z rabatami grupowymi.',
        period: FocusPeriod.QUARTERLY,
        startDate: daysAgo(15),
        endDate: inDays(75),
        brandId: brands[1].id,
        createdById: users[5].id,
        isActive: true,
      },
    }),
  ])

  // ============== BRIEFS - RÓŻNE STATUSY ==============
  console.log('📋 Creating briefs with various statuses...')
  let briefCounter = 1
  const generateBriefCode = () => {
    const code = `BRIEF-2025-${String(briefCounter).padStart(4, '0')}`
    briefCounter++
    return code
  }

  // ---------- SUBMITTED - do zatwierdzenia przez walidatora ----------
  const submittedBriefs = await Promise.all([
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[0].id,
        clubId: clubs[0].id,
        brandId: brands[0].id,
        templateId: templates[4].id,
        status: BriefStatus.SUBMITTED,
        priority: Priority.HIGH,
        title: 'Kampania Noworoczna - Nowy Ty 2025',
        objective: Objective.ACQUISITION,
        kpiDescription: '80 nowych karnetów rocznych',
        kpiTarget: 80,
        deadline: inDays(7),
        startDate: inDays(10),
        endDate: inDays(45),
        context: 'Największa kampania roku! Sezon noworoczny to nasza główna szansa na pozyskanie nowych członków. Arkadia to flagship, więc musimy dać przykład innym klubom.',
        offerDetails: 'Karnet roczny -25% (1499 PLN zamiast 1999 PLN). Karnet półroczny -20%. Darmowy personal training na start (3 sesje). Torba sportowa premium gratis.',
        legalCopy: 'Promocja ważna do 31.01.2025 lub do wyczerpania puli 100 karnetów.',
        customFields: { campaignName: 'Nowy Ty 2025', channels: ['facebook', 'instagram', 'google_ads', 'plakaty'] },
        confidenceLevel: ConfidenceLevel.HIGH,
        submittedAt: daysAgo(1),
      },
    }),
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[1].id,
        clubId: clubs[1].id,
        brandId: brands[0].id,
        templateId: templates[1].id,
        status: BriefStatus.SUBMITTED,
        priority: Priority.MEDIUM,
        title: 'Plakaty - Walentynkowy Trening w Parach',
        objective: Objective.ATTENDANCE,
        kpiDescription: '40 par na wydarzeniu',
        kpiTarget: 40,
        deadline: inDays(5),
        startDate: inDays(20),
        endDate: inDays(21),
        context: 'Coroczna tradycja - trening walentynkowy. W zeszłym roku mieliśmy 25 par, w tym roku chcemy więcej.',
        offerDetails: 'Trening w parach GRATIS dla członków + partner bez karnetu. 14.02, godz. 18:00-20:00.',
        customFields: { printFormats: ['A3', 'A2'], quantity: '11-50' },
        confidenceLevel: ConfidenceLevel.MEDIUM,
        submittedAt: daysAgo(2),
      },
    }),
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[2].id,
        clubId: clubs[5].id,
        brandId: brands[1].id,
        templateId: templates[0].id,
        status: BriefStatus.SUBMITTED,
        priority: Priority.HIGH,
        title: 'Post FB/IG - Nowy trener personalny',
        objective: Objective.AWARENESS,
        kpiDescription: 'Minimum 50 zapisów na konsultacje',
        kpiTarget: 50,
        deadline: inDays(3),
        startDate: inDays(5),
        endDate: inDays(35),
        context: 'Zatrudniliśmy Marka Kowalskiego - byłego reprezentanta Polski w kulturystyce. To świetna okazja promocyjna!',
        offerDetails: 'Darmowa konsultacja z Markiem dla nowych i obecnych członków. Pakiet 10 treningów personalnych -15%.',
        customFields: { channels: ['facebook', 'instagram_feed', 'instagram_stories'] },
        confidenceLevel: ConfidenceLevel.HIGH,
        submittedAt: now,
      },
    }),
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[3].id,
        clubId: clubs[3].id,
        brandId: brands[0].id,
        templateId: templates[3].id,
        status: BriefStatus.SUBMITTED,
        priority: Priority.CRITICAL,
        title: 'PILNE: Awaria klimatyzacji - info',
        objective: Objective.OTHER,
        kpiDescription: 'Poinformować wszystkich członków',
        deadline: inDays(1),
        startDate: now,
        endDate: inDays(3),
        context: 'Awaria klimatyzacji w strefie cardio. Naprawa potrwa 2-3 dni. Musimy pilnie poinformować członków.',
        offerDetails: 'Strefa cardio tymczasowo nieczynna. Przepraszamy za utrudnienia. Alternatywnie zapraszamy na zajęcia grupowe.',
        isCrisisCommunication: true,
        confidenceLevel: ConfidenceLevel.HIGH,
        submittedAt: now,
      },
    }),
  ])

  // ---------- APPROVED - w produkcji ----------
  const approvedBriefs = await Promise.all([
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[0].id,
        clubId: clubs[0].id,
        brandId: brands[0].id,
        templateId: templates[2].id,
        status: BriefStatus.APPROVED,
        priority: Priority.CRITICAL,
        title: 'Dzień Otwarty - Nowa Strefa Functional',
        objective: Objective.ACQUISITION,
        kpiDescription: '150 uczestników, 30 nowych karnetów',
        kpiTarget: 150,
        deadline: inDays(4),
        startDate: inDays(14),
        endDate: inDays(14),
        context: 'Otwarcie nowej strefy functional training po remoncie za 800k PLN. Największa inwestycja w tym roku!',
        offerDetails: 'Darmowe treningi pokazowe co godzinę 10:00-18:00. Dla uczestników -30% na pierwszy miesiąc.',
        customFields: { eventName: 'Otwarcie Strefy Functional', eventDate: inDays(14).toISOString().split('T')[0] },
        confidenceLevel: ConfidenceLevel.HIGH,
        submittedAt: daysAgo(5),
      },
    }),
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[4].id,
        clubId: clubs[7].id,
        brandId: brands[2].id,
        templateId: templates[0].id,
        status: BriefStatus.APPROVED,
        priority: Priority.MEDIUM,
        title: 'Post - Zimowe treningi na plaży',
        objective: Objective.ATTENDANCE,
        kpiDescription: '25 uczestników na każdym treningu',
        kpiTarget: 25,
        deadline: inDays(6),
        startDate: inDays(10),
        endDate: inDays(60),
        context: 'Organizujemy zimowe treningi outdoor na plaży w Gdańsku. Wyjątkowa atrakcja dla hartownych!',
        offerDetails: 'Soboty 10:00, plaża przy molo. Darmowe dla członków, dla gości 30 PLN.',
        confidenceLevel: ConfidenceLevel.MEDIUM,
        submittedAt: daysAgo(3),
      },
    }),
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[1].id,
        clubId: clubs[2].id,
        brandId: brands[0].id,
        templateId: templates[1].id,
        status: BriefStatus.APPROVED,
        priority: Priority.LOW,
        title: 'Ulotka - Grafik zajęć Q1',
        objective: Objective.AWARENESS,
        kpiDescription: 'Rozdać 500 ulotek',
        deadline: inDays(8),
        startDate: inDays(12),
        endDate: inDays(90),
        context: 'Nowy grafik zajęć grupowych na Q1. Dodaliśmy 5 nowych klas.',
        offerDetails: 'Nowe zajęcia: Pilates Advance, HIIT Extreme, Yoga Flow, Dance Cardio, TRX Intro',
        confidenceLevel: ConfidenceLevel.HIGH,
        submittedAt: daysAgo(4),
      },
    }),
  ])

  // ---------- CHANGES_REQUESTED - do poprawy ----------
  const changesRequestedBriefs = await Promise.all([
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[3].id,
        clubId: clubs[4].id,
        brandId: brands[0].id,
        templateId: templates[0].id,
        status: BriefStatus.CHANGES_REQUESTED,
        priority: Priority.MEDIUM,
        title: 'Post - Promocja na saunę',
        objective: Objective.UPSELL,
        kpiDescription: '20 nowych pakietów SPA',
        kpiTarget: 20,
        deadline: inDays(5),
        startDate: inDays(8),
        endDate: inDays(38),
        context: 'Chcemy promować nasz pakiet SPA z dostępem do sauny.',
        offerDetails: 'Pakiet SPA -20% przy zakupie z karnetem.',
        confidenceLevel: ConfidenceLevel.MEDIUM,
        submittedAt: daysAgo(3),
      },
    }),
  ])

  // ---------- DELIVERED - zrealizowane, do oceny ----------
  const deliveredBriefs = await Promise.all([
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[2].id,
        clubId: clubs[5].id,
        brandId: brands[1].id,
        templateId: templates[4].id,
        status: BriefStatus.APPROVED,
        priority: Priority.HIGH,
        title: 'Kampania Black Week 2024',
        objective: Objective.ACQUISITION,
        kpiDescription: '60 nowych karnetów',
        kpiTarget: 60,
        deadline: daysAgo(10),
        startDate: daysAgo(20),
        endDate: daysAgo(5),
        context: 'Black Week kampania - największa promocja roku.',
        offerDetails: 'Wszystkie karnety -40%. Tylko 5 dni!',
        outcome: Outcome.POSITIVE,
        outcomeNote: 'Przekroczyliśmy cel - 78 nowych karnetów!',
        actualKpiValue: 78,
        confidenceLevel: ConfidenceLevel.HIGH,
        submittedAt: daysAgo(25),
      },
    }),
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[0].id,
        clubId: clubs[0].id,
        brandId: brands[0].id,
        templateId: templates[0].id,
        status: BriefStatus.APPROVED,
        priority: Priority.MEDIUM,
        title: 'Post - Świąteczne życzenia',
        objective: Objective.RETENTION,
        deadline: daysAgo(15),
        startDate: daysAgo(18),
        endDate: daysAgo(14),
        context: 'Świąteczne życzenia dla społeczności.',
        offerDetails: 'Grafika ze świątecznymi życzeniami.',
        outcome: Outcome.NEUTRAL,
        outcomeNote: 'Standardowy engagement.',
        confidenceLevel: ConfidenceLevel.HIGH,
        submittedAt: daysAgo(22),
      },
    }),
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[4].id,
        clubId: clubs[8].id,
        brandId: brands[2].id,
        templateId: templates[2].id,
        status: BriefStatus.APPROVED,
        priority: Priority.HIGH,
        title: 'Event - Maraton Fitness Sopot',
        objective: Objective.AWARENESS,
        kpiDescription: '80 uczestników',
        kpiTarget: 80,
        deadline: daysAgo(8),
        startDate: daysAgo(12),
        endDate: daysAgo(12),
        context: 'Całodniowy maraton fitness w Sopocie.',
        offerDetails: '12 godzin zajęć non-stop! Wstęp 50 PLN, członkowie gratis.',
        outcome: Outcome.POSITIVE,
        outcomeNote: 'Super event! 95 uczestników, świetne opinie.',
        actualKpiValue: 95,
        confidenceLevel: ConfidenceLevel.HIGH,
        submittedAt: daysAgo(18),
      },
    }),
  ])

  // ---------- DRAFT - szkice ----------
  await Promise.all([
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[1].id,
        clubId: clubs[1].id,
        brandId: brands[0].id,
        templateId: templates[0].id,
        status: BriefStatus.DRAFT,
        priority: Priority.LOW,
        title: 'Post - Wiosenna promocja (szkic)',
        objective: Objective.ACQUISITION,
        deadline: inDays(30),
        context: 'Planowana kampania wiosenna...',
      },
    }),
  ])

  // ============== APPROVALS ==============
  console.log('✅ Creating approvals...')
  await Promise.all([
    // Approved briefs
    prisma.approval.create({
      data: {
        briefId: approvedBriefs[0].id,
        validatorId: users[5].id,
        decision: 'APPROVED',
        notes: 'Świetny brief! Priorytet CRITICAL uzasadniony - to nasza największa inwestycja. Realizacja ASAP.',
      },
    }),
    prisma.approval.create({
      data: {
        briefId: approvedBriefs[1].id,
        validatorId: users[7].id,
        decision: 'APPROVED',
        notes: 'Ciekawa inicjatywa. Akceptuję.',
      },
    }),
    prisma.approval.create({
      data: {
        briefId: approvedBriefs[2].id,
        validatorId: users[5].id,
        decision: 'APPROVED',
        notes: 'OK, prosty brief.',
      },
    }),
    // Changes requested
    prisma.approval.create({
      data: {
        briefId: changesRequestedBriefs[0].id,
        validatorId: users[6].id,
        decision: 'CHANGES_REQUESTED',
        notes: 'Proszę doprecyzować: 1) Czy promocja dotyczy nowych klientów czy też obecnych? 2) Dodaj info o dostępności sauny (godziny). 3) Sprawdź czy mamy zdjęcia strefy SPA do wykorzystania.',
      },
    }),
    // Delivered briefs
    prisma.approval.create({
      data: {
        briefId: deliveredBriefs[0].id,
        validatorId: users[5].id,
        decision: 'APPROVED',
        notes: 'Black Week - kluczowa kampania. Zatwierdzam.',
      },
    }),
    prisma.approval.create({
      data: {
        briefId: deliveredBriefs[1].id,
        validatorId: users[5].id,
        decision: 'APPROVED',
        notes: 'OK',
      },
    }),
    prisma.approval.create({
      data: {
        briefId: deliveredBriefs[2].id,
        validatorId: users[7].id,
        decision: 'APPROVED',
        notes: 'Maraton to super pomysł! Powodzenia.',
      },
    }),
  ])

  // ============== PRODUCTION TASKS ==============
  console.log('🔧 Creating production tasks...')
  const productionTasks = await Promise.all([
    // QUEUED
    prisma.productionTask.create({
      data: {
        briefId: approvedBriefs[2].id,
        status: TaskStatus.QUEUED,
        slaDays: 5,
        dueDate: inDays(8),
        notes: 'Prosta ulotka, niski priorytet.',
      },
    }),
    // IN_PROGRESS
    prisma.productionTask.create({
      data: {
        briefId: approvedBriefs[0].id,
        assigneeId: users[8].id,
        status: TaskStatus.IN_PROGRESS,
        slaDays: 5,
        dueDate: inDays(4),
        notes: 'PRIORYTET! Dzień otwarty - wszystkie materiały potrzebne na raz.',
      },
    }),
    prisma.productionTask.create({
      data: {
        briefId: approvedBriefs[1].id,
        assigneeId: users[9].id,
        status: TaskStatus.IN_PROGRESS,
        slaDays: 3,
        dueDate: inDays(6),
        notes: 'Zimowe treningi outdoor.',
      },
    }),
    // IN_REVIEW
    prisma.productionTask.create({
      data: {
        briefId: deliveredBriefs[1].id,
        assigneeId: users[9].id,
        status: TaskStatus.IN_REVIEW,
        slaDays: 2,
        dueDate: daysAgo(15),
        notes: 'Świąteczna grafika - do akceptacji.',
      },
    }),
    // DELIVERED
    prisma.productionTask.create({
      data: {
        briefId: deliveredBriefs[0].id,
        assigneeId: users[8].id,
        status: TaskStatus.DELIVERED,
        slaDays: 7,
        dueDate: daysAgo(10),
        notes: 'Black Week - wszystkie materiały dostarczone.',
      },
    }),
    prisma.productionTask.create({
      data: {
        briefId: deliveredBriefs[2].id,
        assigneeId: users[10].id,
        status: TaskStatus.DELIVERED,
        slaDays: 5,
        dueDate: daysAgo(8),
        notes: 'Maraton Sopot - zrealizowane.',
      },
    }),
  ])

  // ============== DELIVERABLES ==============
  console.log('📦 Creating deliverables...')
  await Promise.all([
    // Black Week deliverables
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[4].id,
        name: 'Post Facebook - Black Week główny',
        type: 'social_post',
        fileUrl: 'https://drive.google.com/file/d/black-week-fb-main',
        version: 2,
        isApproved: true,
        changeNotes: 'v2 - poprawiony CTA',
      },
    }),
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[4].id,
        name: 'Post Instagram - Black Week',
        type: 'social_post',
        fileUrl: 'https://drive.google.com/file/d/black-week-ig',
        version: 1,
        isApproved: true,
      },
    }),
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[4].id,
        name: 'Stories set - Black Week',
        type: 'stories',
        fileUrl: 'https://drive.google.com/file/d/black-week-stories',
        version: 1,
        isApproved: true,
      },
    }),
    // Maraton deliverables
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[5].id,
        name: 'Plakat A2 - Maraton Fitness',
        type: 'print',
        fileUrl: 'https://drive.google.com/file/d/maraton-plakat-a2',
        version: 1,
        isApproved: true,
      },
    }),
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[5].id,
        name: 'Post FB - Maraton',
        type: 'social_post',
        fileUrl: 'https://drive.google.com/file/d/maraton-fb',
        version: 1,
        isApproved: true,
      },
    }),
    // In review deliverable
    prisma.deliverable.create({
      data: {
        taskId: productionTasks[3].id,
        name: 'Post świąteczny',
        type: 'social_post',
        fileUrl: 'https://drive.google.com/file/d/xmas-post',
        version: 1,
        isApproved: false,
        changeNotes: 'Do sprawdzenia przez managera.',
      },
    }),
  ])

  // ============== SUMMARY ==============
  console.log('')
  console.log('✅ Demo seed completed successfully!')
  console.log('')
  console.log('📊 Created:')
  console.log(`   - ${regions.length} regions`)
  console.log(`   - ${brands.length} brands`)
  console.log(`   - ${clubs.length} clubs`)
  console.log(`   - ${templates.length} templates`)
  console.log(`   - ${users.length} users`)
  console.log(`   - 5 sales focuses (targets)`)
  console.log(`   - ${submittedBriefs.length} briefs SUBMITTED (do zatwierdzenia)`)
  console.log(`   - ${approvedBriefs.length} briefs APPROVED (w produkcji)`)
  console.log(`   - ${changesRequestedBriefs.length} briefs CHANGES_REQUESTED`)
  console.log(`   - ${deliveredBriefs.length} briefs DELIVERED (zrealizowane)`)
  console.log(`   - ${productionTasks.length} production tasks`)
  console.log('')
  console.log('🔐 Test accounts (password: demo123):')
  console.log('')
  console.log('   📝 Club Managers:')
  console.log('   - anna.kowalska@benefit.pl (Zdrofit Arkadia - FLAGSHIP)')
  console.log('   - piotr.nowak@benefit.pl (Zdrofit Mokotów, Złote Tarasy)')
  console.log('   - katarzyna.wiszniewska@benefit.pl (MFP Marszałkowska)')
  console.log('   - tomasz.zielinski@benefit.pl (Zdrofit Kraków)')
  console.log('   - magdalena.dabrowska@benefit.pl (FF Gdańsk, Sopot)')
  console.log('')
  console.log('   ✅ Validators:')
  console.log('   - michal.adamski@benefit.pl (Warszawa - 4 briefy do zatwierdzenia)')
  console.log('   - ewa.mazur@benefit.pl (Kraków)')
  console.log('   - jan.kowalczyk@benefit.pl (pozostałe regiony)')
  console.log('')
  console.log('   🎨 Production:')
  console.log('   - studio@benefit.pl (Studio Kreacji BS)')
  console.log('   - marta.grafik@benefit.pl (Marta Nowicka)')
  console.log('   - partner@reszek.pl (Reszek Studio)')
  console.log('')
  console.log('   👑 Admin:')
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
