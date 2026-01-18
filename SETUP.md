# Setup Guide — Club Manager Briefing System

## Wymagania

- **Node.js** 18+ (zalecane 20+)
- **npm** 9+ lub **pnpm** 8+
- **PostgreSQL** (lokalnie lub Neon/Supabase)

---

## Szybki start

### 1. Instalacja zależności

```bash
npm install
```

### 2. Konfiguracja środowiska

Skopiuj plik `.env.example` do `.env.local`:

```bash
cp .env.example .env.local
```

Wypełnij zmienne:

```env
# Baza danych PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/briefing_system"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="wygeneruj-tajny-klucz-min-32-znaki"
```

**Generowanie NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 3. Baza danych

#### Opcja A: Lokalna PostgreSQL

```bash
# Utwórz bazę
createdb briefing_system

# Uruchom migracje
npm run db:migrate

# Załaduj dane testowe
npm run db:seed
```

#### Opcja B: Neon (cloud)

1. Utwórz konto na [neon.tech](https://neon.tech)
2. Utwórz nowy projekt
3. Skopiuj connection string do `.env.local`
4. Uruchom migracje i seed:

```bash
npm run db:push
npm run db:seed
```

### 4. Uruchomienie

```bash
npm run dev
```

Aplikacja będzie dostępna pod: **http://localhost:3000**

---

## Konta testowe

Po uruchomieniu seeda dostępne są następujące konta (hasło: `password123`):

### Club Managers
| Email | Kluby |
|-------|-------|
| anna.kowalska@benefit.pl | Zdrofit Arkadia |
| piotr.nowak@benefit.pl | Zdrofit Mokotów, Złote Tarasy |
| katarzyna.wiszniewska@benefit.pl | S4 Marszałkowska |
| tomasz.zielinski@benefit.pl | Zdrofit Bonarka, Galeria Krakowska |
| magdalena.dabrowska@benefit.pl | Fabryka Formy Gdańsk |

### Validators (Regional Managers)
| Email | Region |
|-------|--------|
| michal.adamski@benefit.pl | Warszawa |
| ewa.mazur@benefit.pl | Kraków |
| jan.kowalczyk@benefit.pl | Pozostałe regiony |

### Production
| Email | Opis |
|-------|------|
| studio@benefit.pl | Studio Kreacji BS |
| grafik1@benefit.pl | Marta Nowicka |
| partner@reszek.pl | Reszek Studio |

### Admin
| Email |
|-------|
| admin@benefit.pl |

---

## Komendy

```bash
# Development
npm run dev           # Start dev server

# Database
npm run db:migrate    # Run migrations
npm run db:push       # Push schema (no migrations)
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio
npm run db:reset      # Reset database (CAUTION!)

# Build
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
```

---

## Struktura projektu

```
/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample data
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Auth pages (login)
│   │   ├── (dashboard)/   # Main app pages
│   │   └── api/           # API routes
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   │   ├── auth.ts        # NextAuth config
│   │   ├── prisma.ts      # Prisma client
│   │   └── validations/   # Zod schemas
│   ├── actions/           # Server actions
│   └── types/             # TypeScript types
├── BUILD_SPEC.md          # Technical specification
├── SETUP.md               # This file
└── package.json
```

---

## Deployment (Vercel)

### 1. Połącz repo z Vercel

```bash
vercel
```

### 2. Ustaw zmienne środowiskowe

W Vercel Dashboard → Settings → Environment Variables:

- `DATABASE_URL` — connection string do Neon
- `NEXTAUTH_SECRET` — tajny klucz
- `NEXTAUTH_URL` — URL produkcyjny (np. https://briefing.vercel.app)

### 3. Deploy

```bash
vercel --prod
```

---

## Następne kroki implementacji

Po skonfigurowaniu środowiska, kolejność implementacji:

1. **Strona logowania** (`/login`)
2. **Layout główny** (sidebar, header, notifications)
3. **Dashboard** (różny dla każdej roli)
4. **Kreator briefu** (wizard z dynamicznym formularzem)
5. **Lista briefów** + szczegóły
6. **Inbox validatora** + akcje zatwierdzania
7. **Kolejka produkcji** (lista/kanban)
8. **Widok deliverables**
9. **Panel admina** (templates, users, clubs)

---

## Troubleshooting

### "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### "Invalid `prisma.xxx.findMany()` invocation"

Schema się zmieniła — uruchom migracje:

```bash
npm run db:migrate
```

### "NEXTAUTH_SECRET is not set"

Upewnij się, że `.env.local` istnieje i zawiera `NEXTAUTH_SECRET`.

### Seed nie działa

Sprawdź, czy baza jest dostępna i czy schemat jest aktualny:

```bash
npm run db:push
npm run db:seed
```

---

## Kontakt

W razie problemów: sprawdź `BUILD_SPEC.md` lub zgłoś issue.
