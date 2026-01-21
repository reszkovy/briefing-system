import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/LogoutButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ClubContextList } from '@/components/admin/ClubContextList'

export default async function ClubContextPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  // Allow ADMIN, REGIONAL_DIRECTOR, CMO to access
  const allowedRoles = ['ADMIN', 'REGIONAL_DIRECTOR', 'CMO']
  if (!user || !allowedRoles.includes(user.role)) {
    redirect('/')
  }

  // Get all clubs with context and manager info
  const clubs = await prisma.club.findMany({
    include: {
      brand: {
        select: {
          name: true,
          primaryColor: true,
        },
      },
      region: {
        select: {
          name: true,
        },
      },
      users: {
        where: { isManager: true },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        take: 1, // Only get primary manager
      },
    },
    orderBy: [{ region: { name: 'asc' } }, { name: 'asc' }],
  })

  // Transform data for component
  const clubsWithContext = clubs.map(club => ({
    id: club.id,
    name: club.name,
    city: club.city,
    tier: club.tier,
    brandName: club.brand.name,
    brandColor: club.brand.primaryColor,
    regionName: club.region.name,
    context: {
      clubCharacter: club.clubCharacter,
      customCharacter: club.customCharacter,
      keyMemberGroups: club.keyMemberGroups as string[] | null,
      localConstraints: club.localConstraints as string[] | null,
      topActivities: club.topActivities as { name: string; popularity: string }[] | null,
      activityReasons: club.activityReasons as { selected: string[]; note?: string } | null,
      localDecisionBrief: club.localDecisionBrief,
      contextUpdatedAt: club.contextUpdatedAt?.toISOString() || null,
    },
    manager: club.users[0]
      ? {
          name: club.users[0].user.name,
          email: club.users[0].user.email,
          phone: club.users[0].user.phone,
        }
      : null,
  }))

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-background">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/logo-white.svg"
                alt="regional.fit"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <span className="text-white/50">|</span>
            <Link href="/admin" className="text-white/80 hover:text-white">
              Panel Administratora
            </Link>
            <span className="text-white/50">/</span>
            <h1 className="text-xl font-semibold text-white">Kontekst klubów</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">{user.name}</span>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Przegląd kontekstów lokalnych klubów
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Przeglądaj i monitoruj konteksty dostarczane przez menedżerów klubów.
            Kontekst pomaga walidatorom podejmować lepsze decyzje przy akceptacji briefów.
          </p>
        </div>

        <ClubContextList clubs={clubsWithContext} />
      </main>
    </div>
  )
}
