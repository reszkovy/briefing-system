# Build Spec — Club Manager Briefing System

## 1. Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 14+ (App Router) | Server Components + Server Actions |
| Database | PostgreSQL (Neon) | Managed, serverless-friendly |
| ORM | Prisma | Type-safe, migrations, seeding |
| Auth | NextAuth.js v5 | Credentials provider (email+password) |
| UI | shadcn/ui + Tailwind CSS | Accessible, customizable components |
| Forms | React Hook Form + Zod | Validation, dynamic schemas |
| State | Zustand (minimal) | Only for client-side UI state |
| Files | External links (Drive/SharePoint) | MVP: no file upload, only URLs |
| Notifications | In-app only (MVP) | Database-driven, polling |
| Deployment | Vercel | Auto-deploy from GitHub |

---

## 2. Project Structure

```
/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Dashboard
│   │   │   ├── briefs/
│   │   │   │   ├── page.tsx                # List my briefs
│   │   │   │   ├── new/page.tsx            # Create brief wizard
│   │   │   │   └── [id]/page.tsx           # Brief detail
│   │   │   ├── approvals/
│   │   │   │   └── page.tsx                # Validator inbox
│   │   │   ├── production/
│   │   │   │   ├── page.tsx                # Production queue
│   │   │   │   └── [taskId]/page.tsx       # Task detail
│   │   │   ├── deliverables/
│   │   │   │   └── [taskId]/page.tsx       # Deliverables view
│   │   │   └── admin/
│   │   │       ├── templates/page.tsx
│   │   │       ├── users/page.tsx
│   │   │       ├── clubs/page.tsx
│   │   │       └── brands/page.tsx
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                             # shadcn components
│   │   ├── briefs/
│   │   │   ├── brief-form.tsx
│   │   │   ├── brief-card.tsx
│   │   │   ├── brief-timeline.tsx
│   │   │   └── brief-status-badge.tsx
│   │   ├── approvals/
│   │   │   └── approval-actions.tsx
│   │   ├── production/
│   │   │   ├── task-card.tsx
│   │   │   ├── task-kanban.tsx
│   │   │   └── deliverable-upload.tsx
│   │   └── layout/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── notifications-dropdown.tsx
│   ├── lib/
│   │   ├── prisma.ts                       # Prisma client singleton
│   │   ├── auth.ts                         # NextAuth config
│   │   ├── validations/
│   │   │   ├── brief.ts                    # Zod schemas
│   │   │   └── user.ts
│   │   └── utils.ts
│   ├── actions/
│   │   ├── briefs.ts                       # Server actions
│   │   ├── approvals.ts
│   │   ├── production.ts
│   │   ├── deliverables.ts
│   │   └── admin.ts
│   └── types/
│       └── index.ts
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 3. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============== ENUMS ==============

enum UserRole {
  CLUB_MANAGER
  VALIDATOR
  PRODUCTION
  ADMIN
}

enum BriefStatus {
  DRAFT
  SUBMITTED
  CHANGES_REQUESTED
  APPROVED
  REJECTED
  CANCELLED
}

enum TaskStatus {
  QUEUED
  IN_PROGRESS
  IN_REVIEW
  NEEDS_CHANGES
  APPROVED
  DELIVERED
  CLOSED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum Objective {
  ACQUISITION
  RETENTION
  ATTENDANCE
  UPSELL
  AWARENESS
  OTHER
}

enum ApprovalDecision {
  APPROVED
  CHANGES_REQUESTED
  REJECTED
}

// ============== MODELS ==============

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  passwordHash   String
  name           String
  role           UserRole
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relations
  clubs          UserClub[]
  briefs         Brief[]           @relation("CreatedBy")
  approvals      Approval[]
  assignedTasks  ProductionTask[]  @relation("AssignedTo")
  notifications  Notification[]
  auditLogs      AuditLog[]
}

model Region {
  id        String   @id @default(cuid())
  name      String
  code      String   @unique
  createdAt DateTime @default(now())

  clubs     Club[]
}

model Brand {
  id              String   @id @default(cuid())
  name            String
  code            String   @unique
  guidelinesUrl   String?
  logoUrl         String?
  primaryColor    String?  // hex color
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  clubs           Club[]
  templates       RequestTemplate[]
  briefs          Brief[]
}

model Club {
  id        String   @id @default(cuid())
  name      String
  code      String   @unique
  city      String
  address   String?
  regionId  String
  brandId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  region    Region     @relation(fields: [regionId], references: [id])
  brand     Brand      @relation(fields: [brandId], references: [id])
  users     UserClub[]
  briefs    Brief[]
}

model UserClub {
  userId    String
  clubId    String
  isManager Boolean  @default(false)  // true = manages this club
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  club      Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)

  @@id([userId, clubId])
}

model RequestTemplate {
  id                String   @id @default(cuid())
  name              String
  code              String   @unique
  description       String?
  brandId           String?  // null = available for all brands
  requiredFields    Json     // JSON Schema for dynamic form fields
  defaultSLADays    Int      @default(5)
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  brand             Brand?   @relation(fields: [brandId], references: [id])
  briefs            Brief[]
}

model Brief {
  id              String      @id @default(cuid())
  code            String      @unique  // auto-generated: BRIEF-2024-0001

  // Relations
  createdById     String
  clubId          String
  brandId         String
  templateId      String

  // Core fields
  status          BriefStatus @default(DRAFT)
  priority        Priority    @default(MEDIUM)

  // Business context
  title           String
  objective       Objective
  kpiDescription  String      // e.g., "100 trial signups"
  kpiTarget       Float?      // numeric target if applicable
  deadline        DateTime
  startDate       DateTime?   // campaign start date
  endDate         DateTime?   // campaign end date

  // Content
  context         String      @db.Text  // why now, local context
  offerDetails    String?     @db.Text  // price, duration, conditions
  legalCopy       String?     @db.Text  // required legal text

  // Dynamic fields from template
  customFields    Json?       // values matching template schema

  // Assets
  assetLinks      String[]    // URLs to Drive/SharePoint

  // Outcome tracking (post-delivery)
  wasExecuted     Boolean?
  perceivedResult Int?        // 1-5 scale
  actualKpiValue  Float?

  // Timestamps
  submittedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  createdBy       User        @relation("CreatedBy", fields: [createdById], references: [id])
  club            Club        @relation(fields: [clubId], references: [id])
  brand           Brand       @relation(fields: [brandId], references: [id])
  template        RequestTemplate @relation(fields: [templateId], references: [id])

  approvals       Approval[]
  productionTask  ProductionTask?
  comments        Comment[]
  auditLogs       AuditLog[]

  @@index([status])
  @@index([createdById])
  @@index([clubId])
  @@index([deadline])
}

model Approval {
  id          String           @id @default(cuid())
  briefId     String
  validatorId String
  decision    ApprovalDecision
  notes       String?          @db.Text
  createdAt   DateTime         @default(now())

  brief       Brief            @relation(fields: [briefId], references: [id], onDelete: Cascade)
  validator   User             @relation(fields: [validatorId], references: [id])

  @@index([briefId])
}

model ProductionTask {
  id            String     @id @default(cuid())
  briefId       String     @unique
  assigneeId    String?
  status        TaskStatus @default(QUEUED)
  slaDays       Int
  dueDate       DateTime
  notes         String?    @db.Text
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  brief         Brief        @relation(fields: [briefId], references: [id], onDelete: Cascade)
  assignee      User?        @relation("AssignedTo", fields: [assigneeId], references: [id])
  deliverables  Deliverable[]
  comments      Comment[]

  @@index([status])
  @@index([dueDate])
}

model Deliverable {
  id              String         @id @default(cuid())
  taskId          String
  name            String
  type            String         // e.g., "social_post", "poster", "banner"
  fileUrl         String
  version         Int            @default(1)
  isApproved      Boolean        @default(false)
  approvedById    String?
  changeNotes     String?        @db.Text
  createdAt       DateTime       @default(now())

  task            ProductionTask @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
}

model Comment {
  id          String          @id @default(cuid())
  content     String          @db.Text
  authorId    String
  briefId     String?
  taskId      String?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  brief       Brief?          @relation(fields: [briefId], references: [id], onDelete: Cascade)
  task        ProductionTask? @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([briefId])
  @@index([taskId])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // e.g., "BRIEF_SUBMITTED", "APPROVAL_NEEDED", "TASK_DELIVERED"
  title     String
  message   String
  linkUrl   String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  briefId     String?
  action      String   // e.g., "BRIEF_CREATED", "STATUS_CHANGED", "APPROVAL_ADDED"
  details     Json?    // { oldValue, newValue, field }
  ipAddress   String?
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  brief       Brief?   @relation(fields: [briefId], references: [id], onDelete: SetNull)

  @@index([briefId])
  @@index([createdAt])
}
```

---

## 4. Seed Data

```typescript
// prisma/seed.ts

import { PrismaClient, UserRole, Objective, Priority } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean up
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
  const regions = await Promise.all([
    prisma.region.create({ data: { name: 'Warszawa i okolice', code: 'WAW' } }),
    prisma.region.create({ data: { name: 'Kraków i okolice', code: 'KRK' } }),
    prisma.region.create({ data: { name: 'Wrocław i okolice', code: 'WRO' } }),
    prisma.region.create({ data: { name: 'Trójmiasto', code: 'TRI' } }),
  ])

  // ============== BRANDS ==============
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Zdrofit',
        code: 'ZDROFIT',
        primaryColor: '#00A651',
        guidelinesUrl: 'https://drive.google.com/zdrofit-brand',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'S4 Fitness',
        code: 'S4',
        primaryColor: '#FF6B00',
        guidelinesUrl: 'https://drive.google.com/s4-brand',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Fabryka Formy',
        code: 'FF',
        primaryColor: '#1E3A8A',
        guidelinesUrl: 'https://drive.google.com/ff-brand',
      },
    }),
  ])

  // ============== CLUBS ==============
  const clubs = await Promise.all([
    // Zdrofit clubs
    prisma.club.create({
      data: {
        name: 'Zdrofit Arkadia',
        code: 'ZDF-WAW-ARK',
        city: 'Warszawa',
        address: 'Al. Jana Pawła II 82',
        regionId: regions[0].id,
        brandId: brands[0].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Zdrofit Galeria Mokotów',
        code: 'ZDF-WAW-MOK',
        city: 'Warszawa',
        address: 'ul. Wołoska 12',
        regionId: regions[0].id,
        brandId: brands[0].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Zdrofit Bonarka',
        code: 'ZDF-KRK-BON',
        city: 'Kraków',
        address: 'ul. Kamieńskiego 11',
        regionId: regions[1].id,
        brandId: brands[0].id,
      },
    }),
    // S4 clubs
    prisma.club.create({
      data: {
        name: 'S4 Marszałkowska',
        code: 'S4-WAW-MAR',
        city: 'Warszawa',
        address: 'ul. Marszałkowska 104',
        regionId: regions[0].id,
        brandId: brands[1].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'S4 Wrocław Centrum',
        code: 'S4-WRO-CEN',
        city: 'Wrocław',
        address: 'ul. Świdnicka 40',
        regionId: regions[2].id,
        brandId: brands[1].id,
      },
    }),
    // Fabryka Formy
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
  ])

  // ============== REQUEST TEMPLATES ==============
  const templates = await Promise.all([
    prisma.requestTemplate.create({
      data: {
        name: 'Post social media (Facebook/Instagram)',
        code: 'SOCIAL_POST',
        description: 'Pojedynczy post lub karuzela na social media klubu',
        defaultSLADays: 3,
        requiredFields: {
          type: 'object',
          required: ['channels', 'formats', 'mainMessage'],
          properties: {
            channels: {
              type: 'array',
              title: 'Kanały',
              items: {
                type: 'string',
                enum: ['facebook', 'instagram_feed', 'instagram_stories', 'instagram_reels'],
              },
              minItems: 1,
            },
            formats: {
              type: 'array',
              title: 'Formaty',
              items: {
                type: 'string',
                enum: ['single_image', 'carousel', 'video', 'story_set'],
              },
              minItems: 1,
            },
            mainMessage: {
              type: 'string',
              title: 'Główny przekaz',
              maxLength: 500,
            },
            hashtags: {
              type: 'string',
              title: 'Sugerowane hashtagi',
            },
            callToAction: {
              type: 'string',
              title: 'Call to Action',
              enum: ['Zapisz się', 'Sprawdź', 'Zadzwoń', 'Przyjdź', 'Kup teraz', 'Inne'],
            },
          },
        },
      },
    }),
    prisma.requestTemplate.create({
      data: {
        name: 'Plakat / Ulotka drukowana',
        code: 'PRINT_POSTER',
        description: 'Materiały drukowane do ekspozycji w klubie lub dystrybucji',
        defaultSLADays: 5,
        requiredFields: {
          type: 'object',
          required: ['printFormats', 'quantity', 'mainMessage'],
          properties: {
            printFormats: {
              type: 'array',
              title: 'Formaty druku',
              items: {
                type: 'string',
                enum: ['A4', 'A3', 'A2', 'A1', 'DL_ulotka', 'A5_ulotka', 'roll_up'],
              },
              minItems: 1,
            },
            quantity: {
              type: 'string',
              title: 'Szacowana ilość',
              enum: ['1-10', '11-50', '51-100', '100+'],
            },
            mainMessage: {
              type: 'string',
              title: 'Główny przekaz',
              maxLength: 200,
            },
            includeQR: {
              type: 'boolean',
              title: 'Dodać kod QR?',
              default: false,
            },
            qrDestination: {
              type: 'string',
              title: 'Dokąd kieruje QR?',
            },
          },
        },
      },
    }),
    prisma.requestTemplate.create({
      data: {
        name: 'Kit promocyjny wydarzenia lokalnego',
        code: 'EVENT_KIT',
        description: 'Kompletny zestaw materiałów na wydarzenie w klubie',
        defaultSLADays: 7,
        requiredFields: {
          type: 'object',
          required: ['eventName', 'eventDate', 'eventType', 'materials'],
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
            eventTime: {
              type: 'string',
              title: 'Godzina',
            },
            eventType: {
              type: 'string',
              title: 'Typ wydarzenia',
              enum: [
                'dzien_otwarty',
                'maraton_fitness',
                'warsztaty',
                'urodziny_klubu',
                'promocja_sezonowa',
                'inne',
              ],
            },
            materials: {
              type: 'array',
              title: 'Potrzebne materiały',
              items: {
                type: 'string',
                enum: [
                  'post_facebook',
                  'post_instagram',
                  'stories',
                  'plakat_A3',
                  'plakat_A2',
                  'ulotka_A5',
                  'roll_up',
                  'grafika_TV',
                  'mailing',
                ],
              },
              minItems: 1,
            },
            specialGuests: {
              type: 'string',
              title: 'Specjalni goście / trenerzy',
            },
            maxParticipants: {
              type: 'number',
              title: 'Max liczba uczestników',
            },
          },
        },
      },
    }),
  ])

  // ============== USERS ==============
  const passwordHash = await hash('password123', 12)

  const users = await Promise.all([
    // Club Managers
    prisma.user.create({
      data: {
        email: 'manager.arkadia@benefit.pl',
        passwordHash,
        name: 'Anna Kowalska',
        role: UserRole.CLUB_MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager.mokotow@benefit.pl',
        passwordHash,
        name: 'Piotr Nowak',
        role: UserRole.CLUB_MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager.s4marszalkowska@benefit.pl',
        passwordHash,
        name: 'Katarzyna Wiśniewska',
        role: UserRole.CLUB_MANAGER,
      },
    }),
    // Validators
    prisma.user.create({
      data: {
        email: 'validator.warszawa@benefit.pl',
        passwordHash,
        name: 'Michał Adamski',
        role: UserRole.VALIDATOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'validator.krakow@benefit.pl',
        passwordHash,
        name: 'Ewa Mazur',
        role: UserRole.VALIDATOR,
      },
    }),
    // Production
    prisma.user.create({
      data: {
        email: 'production@benefit.pl',
        passwordHash,
        name: 'Studio Kreacji',
        role: UserRole.PRODUCTION,
      },
    }),
    prisma.user.create({
      data: {
        email: 'designer@reszek.pl',
        passwordHash,
        name: 'Reszek Design',
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
  await Promise.all([
    // Manager Arkadia -> manages Arkadia
    prisma.userClub.create({
      data: { userId: users[0].id, clubId: clubs[0].id, isManager: true },
    }),
    // Manager Mokotów -> manages Mokotów
    prisma.userClub.create({
      data: { userId: users[1].id, clubId: clubs[1].id, isManager: true },
    }),
    // Manager S4 -> manages S4 Marszałkowska
    prisma.userClub.create({
      data: { userId: users[2].id, clubId: clubs[3].id, isManager: true },
    }),
    // Validator Warszawa -> sees all Warsaw clubs
    prisma.userClub.create({
      data: { userId: users[3].id, clubId: clubs[0].id, isManager: false },
    }),
    prisma.userClub.create({
      data: { userId: users[3].id, clubId: clubs[1].id, isManager: false },
    }),
    prisma.userClub.create({
      data: { userId: users[3].id, clubId: clubs[3].id, isManager: false },
    }),
    // Validator Kraków -> sees Kraków clubs
    prisma.userClub.create({
      data: { userId: users[4].id, clubId: clubs[2].id, isManager: false },
    }),
  ])

  // ============== SAMPLE BRIEFS ==============
  const briefCounter = { value: 1 }
  const generateBriefCode = () => {
    const code = `BRIEF-2024-${String(briefCounter.value).padStart(4, '0')}`
    briefCounter.value++
    return code
  }

  const briefs = await Promise.all([
    // Draft brief
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
        deadline: new Date('2024-01-20'),
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-31'),
        context: 'Sezon noworoczny, duże zainteresowanie nowymi karnetami.',
        offerDetails: 'Karnet roczny -20%, cena 1599 PLN zamiast 1999 PLN. Płatność jednorazowa lub 12 rat.',
        customFields: {
          channels: ['facebook', 'instagram_feed'],
          formats: ['single_image', 'carousel'],
          mainMessage: 'Nowy Rok, Nowy Ty! Karnet roczny -20%',
          callToAction: 'Zapisz się',
        },
        assetLinks: ['https://drive.google.com/zdrofit-arkadia-photos'],
      },
    }),
    // Submitted brief (waiting for approval)
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
        deadline: new Date('2024-02-08'),
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-02-14'),
        context: 'Coroczna akcja walentynkowa, w zeszłym roku 20 par.',
        offerDetails: 'Trening w parach gratis dla członków + partner. 14.02 godz. 18:00.',
        customFields: {
          printFormats: ['A3', 'A2'],
          quantity: '11-50',
          mainMessage: 'Trenuj z ukochaną osobą! Walentynkowy trening w parach',
          includeQR: true,
          qrDestination: 'https://zdrofit.pl/walentynki-mokotow',
        },
        assetLinks: [],
        submittedAt: new Date(),
      },
    }),
    // Approved brief (in production)
    prisma.brief.create({
      data: {
        code: generateBriefCode(),
        createdById: users[2].id,
        clubId: clubs[3].id,
        brandId: brands[1].id,
        templateId: templates[2].id,
        status: 'APPROVED',
        priority: Priority.CRITICAL,
        title: 'Otwarcie nowej strefy functional - event kit',
        objective: Objective.AWARENESS,
        kpiDescription: '100 uczestników na dniu otwartym',
        kpiTarget: 100,
        deadline: new Date('2024-01-25'),
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-01'),
        context: 'Otwarcie nowej strefy functional training. Inwestycja 500k PLN.',
        offerDetails: 'Dzień otwarty 1.02. Darmowe treningi pokazowe co godzinę 10:00-18:00.',
        legalCopy: 'Liczba miejsc ograniczona. Wymagana rejestracja.',
        customFields: {
          eventName: 'Dzień Otwarty Strefy Functional',
          eventDate: '2024-02-01',
          eventTime: '10:00-18:00',
          eventType: 'dzien_otwarty',
          materials: ['post_facebook', 'post_instagram', 'stories', 'plakat_A2', 'roll_up'],
          specialGuests: 'Mateusz Kowalczyk - mistrz CrossFit',
          maxParticipants: 100,
        },
        assetLinks: [
          'https://drive.google.com/s4-functional-zone-photos',
          'https://drive.google.com/mateusz-kowalczyk-bio',
        ],
        submittedAt: new Date('2024-01-15'),
      },
    }),
  ])

  // Approval for the approved brief
  await prisma.approval.create({
    data: {
      briefId: briefs[2].id,
      validatorId: users[3].id,
      decision: 'APPROVED',
      notes: 'Świetna akcja! Priorytet CRITICAL uzasadniony. Proszę o realizację ASAP.',
    },
  })

  // Production task for approved brief
  await prisma.productionTask.create({
    data: {
      briefId: briefs[2].id,
      assigneeId: users[5].id,
      status: 'IN_PROGRESS',
      slaDays: 5,
      dueDate: new Date('2024-01-25'),
      notes: 'Kluczowy projekt - otwarcie nowej strefy.',
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log(`
📊 Created:
   - ${regions.length} regions
   - ${brands.length} brands
   - ${clubs.length} clubs
   - ${templates.length} request templates
   - ${users.length} users
   - ${briefs.length} sample briefs
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 5. Validation Schemas (Zod)

```typescript
// src/lib/validations/brief.ts

import { z } from 'zod'

export const ObjectiveEnum = z.enum([
  'ACQUISITION',
  'RETENTION',
  'ATTENDANCE',
  'UPSELL',
  'AWARENESS',
  'OTHER',
])

export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

export const BriefStatusEnum = z.enum([
  'DRAFT',
  'SUBMITTED',
  'CHANGES_REQUESTED',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
])

// Schema for creating a new brief (draft)
export const createBriefSchema = z.object({
  clubId: z.string().cuid('Wybierz klub'),
  brandId: z.string().cuid('Wybierz markę'),
  templateId: z.string().cuid('Wybierz typ zlecenia'),
  title: z
    .string()
    .min(5, 'Tytuł musi mieć min. 5 znaków')
    .max(200, 'Tytuł może mieć max. 200 znaków'),
  objective: ObjectiveEnum,
  kpiDescription: z
    .string()
    .min(10, 'Opisz KPI (min. 10 znaków)')
    .max(500, 'Opis KPI może mieć max. 500 znaków'),
  kpiTarget: z.number().positive().optional(),
  deadline: z.coerce.date().refine(
    (date) => date > new Date(),
    'Deadline musi być w przyszłości'
  ),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  context: z
    .string()
    .min(20, 'Opisz kontekst (min. 20 znaków)')
    .max(2000, 'Kontekst może mieć max. 2000 znaków'),
  offerDetails: z.string().max(2000).optional(),
  legalCopy: z.string().max(1000).optional(),
  customFields: z.record(z.any()).optional(),
  assetLinks: z.array(z.string().url('Nieprawidłowy URL')).default([]),
})

// Schema for submitting a brief (stricter validation)
export const submitBriefSchema = createBriefSchema.extend({
  // These become required on submit
  context: z
    .string()
    .min(20, 'Opisz kontekst (min. 20 znaków)'),
  customFields: z.record(z.any()), // Must have custom fields filled
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate
    }
    return true
  },
  {
    message: 'Data końcowa musi być po dacie początkowej',
    path: ['endDate'],
  }
)

// Schema for validator approval actions
export const approvalActionSchema = z.object({
  briefId: z.string().cuid(),
  decision: z.enum(['APPROVED', 'CHANGES_REQUESTED', 'REJECTED']),
  notes: z.string().max(2000).optional(),
  priority: PriorityEnum.optional(),
  slaDays: z.number().int().min(1).max(30).optional(),
})

// Schema for updating brief status
export const updateBriefStatusSchema = z.object({
  briefId: z.string().cuid(),
  status: BriefStatusEnum,
})

// Schema for outcome tagging
export const tagOutcomeSchema = z.object({
  briefId: z.string().cuid(),
  wasExecuted: z.boolean(),
  perceivedResult: z.number().int().min(1).max(5).optional(),
  actualKpiValue: z.number().optional(),
})

export type CreateBriefInput = z.infer<typeof createBriefSchema>
export type SubmitBriefInput = z.infer<typeof submitBriefSchema>
export type ApprovalActionInput = z.infer<typeof approvalActionSchema>
export type TagOutcomeInput = z.infer<typeof tagOutcomeSchema>
```

```typescript
// src/lib/validations/production.ts

import { z } from 'zod'

export const TaskStatusEnum = z.enum([
  'QUEUED',
  'IN_PROGRESS',
  'IN_REVIEW',
  'NEEDS_CHANGES',
  'APPROVED',
  'DELIVERED',
  'CLOSED',
])

export const updateTaskStatusSchema = z.object({
  taskId: z.string().cuid(),
  status: TaskStatusEnum,
  notes: z.string().max(2000).optional(),
})

export const assignTaskSchema = z.object({
  taskId: z.string().cuid(),
  assigneeId: z.string().cuid(),
})

export const addDeliverableSchema = z.object({
  taskId: z.string().cuid(),
  name: z.string().min(1).max(200),
  type: z.string().min(1).max(50),
  fileUrl: z.string().url('Podaj prawidłowy URL do pliku'),
  changeNotes: z.string().max(1000).optional(),
})

export const approveDeliverableSchema = z.object({
  deliverableId: z.string().cuid(),
  isApproved: z.boolean(),
})

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>
export type AssignTaskInput = z.infer<typeof assignTaskSchema>
export type AddDeliverableInput = z.infer<typeof addDeliverableSchema>
```

```typescript
// src/lib/validations/user.ts

import { z } from 'zod'

export const UserRoleEnum = z.enum([
  'CLUB_MANAGER',
  'VALIDATOR',
  'PRODUCTION',
  'ADMIN',
])

export const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi mieć min. 6 znaków'),
})

export const createUserSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  name: z.string().min(2, 'Imię musi mieć min. 2 znaki').max(100),
  password: z.string().min(8, 'Hasło musi mieć min. 8 znaków'),
  role: UserRoleEnum,
  clubIds: z.array(z.string().cuid()).optional(),
})

export const updateUserSchema = z.object({
  userId: z.string().cuid(),
  name: z.string().min(2).max(100).optional(),
  role: UserRoleEnum.optional(),
  clubIds: z.array(z.string().cuid()).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
```

---

## 6. Server Actions

```typescript
// src/actions/briefs.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  createBriefSchema,
  submitBriefSchema,
  tagOutcomeSchema,
  type CreateBriefInput,
  type SubmitBriefInput,
} from '@/lib/validations/brief'

// Generate unique brief code
async function generateBriefCode(): Promise<string> {
  const year = new Date().getFullYear()
  const lastBrief = await prisma.brief.findFirst({
    where: { code: { startsWith: `BRIEF-${year}-` } },
    orderBy: { code: 'desc' },
  })

  const nextNumber = lastBrief
    ? parseInt(lastBrief.code.split('-')[2]) + 1
    : 1

  return `BRIEF-${year}-${String(nextNumber).padStart(4, '0')}`
}

// Create audit log
async function createAuditLog(
  userId: string,
  briefId: string,
  action: string,
  details?: object
) {
  await prisma.auditLog.create({
    data: { userId, briefId, action, details },
  })
}

// Create notification
async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  linkUrl?: string
) {
  await prisma.notification.create({
    data: { userId, type, title, message, linkUrl },
  })
}

export async function createBrief(data: CreateBriefInput) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = createBriefSchema.parse(data)
  const code = await generateBriefCode()

  const brief = await prisma.brief.create({
    data: {
      ...validated,
      code,
      createdById: session.user.id,
      status: 'DRAFT',
    },
  })

  await createAuditLog(session.user.id, brief.id, 'BRIEF_CREATED')

  revalidatePath('/briefs')
  return brief
}

export async function updateBrief(briefId: string, data: Partial<CreateBriefInput>) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const brief = await prisma.brief.findUnique({ where: { id: briefId } })
  if (!brief) throw new Error('Brief not found')
  if (brief.createdById !== session.user.id) throw new Error('Unauthorized')
  if (!['DRAFT', 'CHANGES_REQUESTED'].includes(brief.status)) {
    throw new Error('Cannot edit brief in current status')
  }

  const updated = await prisma.brief.update({
    where: { id: briefId },
    data,
  })

  await createAuditLog(session.user.id, briefId, 'BRIEF_UPDATED', data)

  revalidatePath(`/briefs/${briefId}`)
  return updated
}

export async function submitBrief(briefId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const brief = await prisma.brief.findUnique({
    where: { id: briefId },
    include: { template: true },
  })

  if (!brief) throw new Error('Brief not found')
  if (brief.createdById !== session.user.id) throw new Error('Unauthorized')
  if (!['DRAFT', 'CHANGES_REQUESTED'].includes(brief.status)) {
    throw new Error('Cannot submit brief in current status')
  }

  // Validate all required fields
  submitBriefSchema.parse({
    clubId: brief.clubId,
    brandId: brief.brandId,
    templateId: brief.templateId,
    title: brief.title,
    objective: brief.objective,
    kpiDescription: brief.kpiDescription,
    kpiTarget: brief.kpiTarget,
    deadline: brief.deadline,
    startDate: brief.startDate,
    endDate: brief.endDate,
    context: brief.context,
    offerDetails: brief.offerDetails,
    legalCopy: brief.legalCopy,
    customFields: brief.customFields,
    assetLinks: brief.assetLinks,
  })

  const updated = await prisma.brief.update({
    where: { id: briefId },
    data: {
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  })

  await createAuditLog(session.user.id, briefId, 'BRIEF_SUBMITTED')

  // Notify validators for this club
  const validators = await prisma.userClub.findMany({
    where: {
      clubId: brief.clubId,
      user: { role: 'VALIDATOR' },
    },
    include: { user: true },
  })

  for (const uc of validators) {
    await createNotification(
      uc.userId,
      'BRIEF_SUBMITTED',
      'Nowy brief do zatwierdzenia',
      `Brief "${brief.title}" czeka na Twoją decyzję.`,
      `/briefs/${briefId}`
    )
  }

  revalidatePath(`/briefs/${briefId}`)
  revalidatePath('/approvals')
  return updated
}

export async function cancelBrief(briefId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const brief = await prisma.brief.findUnique({ where: { id: briefId } })
  if (!brief) throw new Error('Brief not found')
  if (brief.createdById !== session.user.id) throw new Error('Unauthorized')
  if (['APPROVED', 'CANCELLED'].includes(brief.status)) {
    throw new Error('Cannot cancel brief in current status')
  }

  const updated = await prisma.brief.update({
    where: { id: briefId },
    data: { status: 'CANCELLED' },
  })

  await createAuditLog(session.user.id, briefId, 'BRIEF_CANCELLED')

  revalidatePath(`/briefs/${briefId}`)
  return updated
}

export async function tagBriefOutcome(data: {
  briefId: string
  wasExecuted: boolean
  perceivedResult?: number
  actualKpiValue?: number
}) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const validated = tagOutcomeSchema.parse(data)

  const brief = await prisma.brief.findUnique({
    where: { id: validated.briefId },
    include: { productionTask: true },
  })

  if (!brief) throw new Error('Brief not found')
  if (brief.productionTask?.status !== 'DELIVERED') {
    throw new Error('Can only tag outcomes for delivered briefs')
  }

  const updated = await prisma.brief.update({
    where: { id: validated.briefId },
    data: {
      wasExecuted: validated.wasExecuted,
      perceivedResult: validated.perceivedResult,
      actualKpiValue: validated.actualKpiValue,
    },
  })

  // Close the production task
  if (brief.productionTask) {
    await prisma.productionTask.update({
      where: { id: brief.productionTask.id },
      data: { status: 'CLOSED' },
    })
  }

  await createAuditLog(session.user.id, validated.briefId, 'OUTCOME_TAGGED', validated)

  revalidatePath(`/briefs/${validated.briefId}`)
  return updated
}

export async function getBriefsByUser() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  return prisma.brief.findMany({
    where: { createdById: session.user.id },
    include: {
      club: true,
      brand: true,
      template: true,
      productionTask: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getBriefById(briefId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const brief = await prisma.brief.findUnique({
    where: { id: briefId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      club: true,
      brand: true,
      template: true,
      approvals: {
        include: { validator: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
      productionTask: {
        include: {
          assignee: { select: { id: true, name: true } },
          deliverables: { orderBy: { createdAt: 'desc' } },
        },
      },
      comments: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!brief) throw new Error('Brief not found')

  // Check access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { clubs: true },
  })

  const canAccess =
    user?.role === 'ADMIN' ||
    user?.role === 'PRODUCTION' ||
    brief.createdById === session.user.id ||
    user?.clubs.some((uc) => uc.clubId === brief.clubId)

  if (!canAccess) throw new Error('Unauthorized')

  return brief
}
```

```typescript
// src/actions/approvals.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { approvalActionSchema, type ApprovalActionInput } from '@/lib/validations/brief'

async function createAuditLog(
  userId: string,
  briefId: string,
  action: string,
  details?: object
) {
  await prisma.auditLog.create({
    data: { userId, briefId, action, details },
  })
}

async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  linkUrl?: string
) {
  await prisma.notification.create({
    data: { userId, type, title, message, linkUrl },
  })
}

export async function processApproval(data: ApprovalActionInput) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { clubs: true },
  })

  if (user?.role !== 'VALIDATOR' && user?.role !== 'ADMIN') {
    throw new Error('Only validators can approve briefs')
  }

  const validated = approvalActionSchema.parse(data)

  const brief = await prisma.brief.findUnique({
    where: { id: validated.briefId },
    include: { template: true },
  })

  if (!brief) throw new Error('Brief not found')
  if (brief.status !== 'SUBMITTED') {
    throw new Error('Brief is not in SUBMITTED status')
  }

  // Check validator has access to this club
  const hasAccess = user.role === 'ADMIN' || user.clubs.some((uc) => uc.clubId === brief.clubId)
  if (!hasAccess) throw new Error('No access to this club')

  // Create approval record
  const approval = await prisma.approval.create({
    data: {
      briefId: validated.briefId,
      validatorId: session.user.id,
      decision: validated.decision,
      notes: validated.notes,
    },
  })

  // Update brief status based on decision
  let newStatus: 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED'
  let notificationType: string
  let notificationTitle: string

  switch (validated.decision) {
    case 'APPROVED':
      newStatus = 'APPROVED'
      notificationType = 'BRIEF_APPROVED'
      notificationTitle = 'Brief zatwierdzony!'

      // Create production task
      const slaDays = validated.slaDays ?? brief.template.defaultSLADays
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + slaDays)

      await prisma.productionTask.create({
        data: {
          briefId: brief.id,
          status: 'QUEUED',
          slaDays,
          dueDate,
        },
      })

      // Notify production team
      const productionUsers = await prisma.user.findMany({
        where: { role: 'PRODUCTION' },
      })
      for (const prodUser of productionUsers) {
        await createNotification(
          prodUser.id,
          'NEW_TASK',
          'Nowe zlecenie w kolejce',
          `Brief "${brief.title}" jest gotowy do realizacji.`,
          `/production`
        )
      }
      break

    case 'CHANGES_REQUESTED':
      newStatus = 'CHANGES_REQUESTED'
      notificationType = 'CHANGES_REQUESTED'
      notificationTitle = 'Wymagane poprawki'
      break

    case 'REJECTED':
      newStatus = 'REJECTED'
      notificationType = 'BRIEF_REJECTED'
      notificationTitle = 'Brief odrzucony'
      break
  }

  await prisma.brief.update({
    where: { id: validated.briefId },
    data: {
      status: newStatus,
      priority: validated.priority ?? brief.priority,
    },
  })

  // Notify brief creator
  await createNotification(
    brief.createdById,
    notificationType,
    notificationTitle,
    validated.notes ?? `Twój brief "${brief.title}" został przetworzony.`,
    `/briefs/${brief.id}`
  )

  await createAuditLog(session.user.id, brief.id, `APPROVAL_${validated.decision}`, {
    notes: validated.notes,
    priority: validated.priority,
  })

  revalidatePath(`/briefs/${validated.briefId}`)
  revalidatePath('/approvals')
  revalidatePath('/production')

  return approval
}

export async function getBriefsForApproval() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { clubs: true },
  })

  if (user?.role !== 'VALIDATOR' && user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const clubIds = user.role === 'ADMIN'
    ? undefined
    : user.clubs.map((uc) => uc.clubId)

  return prisma.brief.findMany({
    where: {
      status: 'SUBMITTED',
      ...(clubIds && { clubId: { in: clubIds } }),
    },
    include: {
      createdBy: { select: { id: true, name: true } },
      club: true,
      brand: true,
      template: true,
    },
    orderBy: [
      { priority: 'desc' },
      { deadline: 'asc' },
    ],
  })
}
```

```typescript
// src/actions/production.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  updateTaskStatusSchema,
  assignTaskSchema,
  addDeliverableSchema,
  type UpdateTaskStatusInput,
  type AssignTaskInput,
  type AddDeliverableInput,
} from '@/lib/validations/production'

async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  linkUrl?: string
) {
  await prisma.notification.create({
    data: { userId, type, title, message, linkUrl },
  })
}

export async function updateTaskStatus(data: UpdateTaskStatusInput) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'PRODUCTION' && user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const validated = updateTaskStatusSchema.parse(data)

  const task = await prisma.productionTask.findUnique({
    where: { id: validated.taskId },
    include: { brief: true },
  })

  if (!task) throw new Error('Task not found')

  const updated = await prisma.productionTask.update({
    where: { id: validated.taskId },
    data: {
      status: validated.status,
      notes: validated.notes ?? task.notes,
    },
  })

  // Notify brief creator on status changes
  if (validated.status === 'DELIVERED') {
    await createNotification(
      task.brief.createdById,
      'TASK_DELIVERED',
      'Materiały gotowe!',
      `Materiały dla "${task.brief.title}" są gotowe do odbioru.`,
      `/deliverables/${task.id}`
    )
  }

  revalidatePath('/production')
  revalidatePath(`/production/${validated.taskId}`)
  revalidatePath(`/briefs/${task.briefId}`)

  return updated
}

export async function assignTask(data: AssignTaskInput) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'PRODUCTION' && user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const validated = assignTaskSchema.parse(data)

  const updated = await prisma.productionTask.update({
    where: { id: validated.taskId },
    data: { assigneeId: validated.assigneeId },
  })

  // Notify assignee
  const task = await prisma.productionTask.findUnique({
    where: { id: validated.taskId },
    include: { brief: true },
  })

  if (task) {
    await createNotification(
      validated.assigneeId,
      'TASK_ASSIGNED',
      'Nowe zlecenie przypisane',
      `Zlecenie "${task.brief.title}" zostało do Ciebie przypisane.`,
      `/production/${task.id}`
    )
  }

  revalidatePath('/production')
  return updated
}

export async function addDeliverable(data: AddDeliverableInput) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'PRODUCTION' && user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const validated = addDeliverableSchema.parse(data)

  // Get current max version
  const existing = await prisma.deliverable.findMany({
    where: { taskId: validated.taskId, name: validated.name },
    orderBy: { version: 'desc' },
    take: 1,
  })

  const version = existing.length > 0 ? existing[0].version + 1 : 1

  const deliverable = await prisma.deliverable.create({
    data: {
      ...validated,
      version,
    },
  })

  revalidatePath(`/production/${validated.taskId}`)
  return deliverable
}

export async function getProductionQueue() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'PRODUCTION' && user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  return prisma.productionTask.findMany({
    where: {
      status: { notIn: ['CLOSED'] },
    },
    include: {
      brief: {
        include: {
          club: true,
          brand: true,
          template: true,
          createdBy: { select: { id: true, name: true } },
        },
      },
      assignee: { select: { id: true, name: true } },
      deliverables: true,
    },
    orderBy: [
      { brief: { priority: 'desc' } },
      { dueDate: 'asc' },
    ],
  })
}

export async function getTaskById(taskId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  return prisma.productionTask.findUnique({
    where: { id: taskId },
    include: {
      brief: {
        include: {
          club: true,
          brand: true,
          template: true,
          createdBy: { select: { id: true, name: true, email: true } },
          approvals: {
            include: { validator: { select: { id: true, name: true } } },
          },
        },
      },
      assignee: { select: { id: true, name: true } },
      deliverables: { orderBy: { createdAt: 'desc' } },
      comments: { orderBy: { createdAt: 'asc' } },
    },
  })
}
```

---

## 7. Auth Configuration

```typescript
// src/lib/auth.ts

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'
import { loginSchema } from './validations/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Hasło', type: 'password' },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) return null

        const { email, password } = validated.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) return null

        const passwordMatch = await compare(password, user.passwordHash)
        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})
```

```typescript
// src/types/next-auth.d.ts

import { UserRole } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: UserRole
  }

  interface Session {
    user: User & {
      id: string
      role: UserRole
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}
```

---

## 8. Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@host:5432/briefing_system?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# Optional: Vercel specific
VERCEL_URL=
```

---

## 9. API Routes Summary

Since we're using Server Actions (not REST API), here's the action → route mapping:

| Action | File | Access |
|--------|------|--------|
| `createBrief` | `actions/briefs.ts` | CLUB_MANAGER |
| `updateBrief` | `actions/briefs.ts` | CLUB_MANAGER (own) |
| `submitBrief` | `actions/briefs.ts` | CLUB_MANAGER (own) |
| `cancelBrief` | `actions/briefs.ts` | CLUB_MANAGER (own) |
| `tagBriefOutcome` | `actions/briefs.ts` | CLUB_MANAGER, VALIDATOR |
| `getBriefsByUser` | `actions/briefs.ts` | Authenticated |
| `getBriefById` | `actions/briefs.ts` | Scoped by role |
| `processApproval` | `actions/approvals.ts` | VALIDATOR, ADMIN |
| `getBriefsForApproval` | `actions/approvals.ts` | VALIDATOR, ADMIN |
| `updateTaskStatus` | `actions/production.ts` | PRODUCTION, ADMIN |
| `assignTask` | `actions/production.ts` | PRODUCTION, ADMIN |
| `addDeliverable` | `actions/production.ts` | PRODUCTION, ADMIN |
| `getProductionQueue` | `actions/production.ts` | PRODUCTION, ADMIN |
| `getTaskById` | `actions/production.ts` | Scoped |

---

## 10. Implementation Order

### Phase 1: Foundation (Week 1)
1. Project setup (Next.js, Prisma, shadcn/ui)
2. Database schema + migrations
3. Seed data
4. Auth (NextAuth)
5. Basic layout (sidebar, header)

### Phase 2: Core Flows (Week 2)
6. Brief creation wizard
7. Brief list + detail view
8. Validator inbox + approval actions
9. Status transitions + notifications (in-app)

### Phase 3: Production (Week 3)
10. Production queue (list/kanban)
11. Task detail + deliverables
12. Deliverables view for managers
13. Outcome tagging

### Phase 4: Polish (Week 4)
14. Dashboard widgets
15. Audit log viewer
16. Admin: templates, users, clubs
17. Testing + bug fixes

---

## 11. Commands Cheatsheet

```bash
# Setup
npx create-next-app@latest briefing-system --typescript --tailwind --eslint --app
cd briefing-system
npm install prisma @prisma/client next-auth@beta bcryptjs zod react-hook-form @hookform/resolvers zustand
npm install -D @types/bcryptjs tsx
npx prisma init

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label select textarea badge dialog dropdown-menu table tabs toast

# Database
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio

# Development
npm run dev

# Deployment
vercel
```

---

## 12. Notes for Implementation

1. **Dynamic form schema**: The `requiredFields` JSON in `RequestTemplate` uses JSON Schema format. Use a library like `@rjsf/core` or build a custom renderer.

2. **Notifications polling**: MVP uses simple polling (every 30s) via `useEffect` + `setInterval`. Later: WebSockets or Vercel KV pub/sub.

3. **File handling**: MVP stores only URLs (Google Drive, SharePoint). No file upload. Users paste links.

4. **Audit trail**: Every mutation creates an `AuditLog` entry. Consider adding IP tracking via headers.

5. **SLA calculation**: `dueDate = approvalDate + slaDays`. Weekends not excluded in MVP.

6. **Brief code generation**: `BRIEF-YYYY-NNNN` format, auto-incremented per year.

7. **Role-based UI**: Use `session.user.role` to conditionally render navigation items and actions.

---

*Build Spec v1.0 — Ready for implementation*
