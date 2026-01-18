import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/LogoutButton'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      clubs: {
        include: {
          club: {
            include: {
              brand: true,
              region: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  // Get stats based on role
  let stats = {
    briefs: 0,
    pendingApprovals: 0,
    tasksInProgress: 0,
  }

  if (user.role === 'CLUB_MANAGER') {
    stats.briefs = await prisma.brief.count({
      where: { createdById: user.id },
    })
  } else if (user.role === 'VALIDATOR') {
    const clubIds = user.clubs.map((uc) => uc.clubId)
    stats.pendingApprovals = await prisma.brief.count({
      where: {
        status: 'SUBMITTED',
        clubId: { in: clubIds },
      },
    })
  } else if (user.role === 'PRODUCTION') {
    stats.tasksInProgress = await prisma.productionTask.count({
      where: {
        status: { in: ['QUEUED', 'IN_PROGRESS', 'IN_REVIEW'] },
      },
    })
  }

  // Get active sales focuses for manager's brands and regions
  const now = new Date()
  const userBrandIds = user.clubs.map((uc) => uc.club.brandId)
  const userRegionIds = user.clubs.map((uc) => uc.club.regionId)

  const activeFocuses = await prisma.salesFocus.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
      OR: [
        // Global focuses (no brand/region restriction)
        { brandId: null, regionId: null },
        // Brand-specific focuses
        { brandId: { in: userBrandIds }, regionId: null },
        // Region-specific focuses
        { regionId: { in: userRegionIds }, brandId: null },
        // Brand AND region specific focuses
        { brandId: { in: userBrandIds }, regionId: { in: userRegionIds } },
      ],
    },
    include: {
      brand: true,
      region: true,
    },
    orderBy: [{ period: 'asc' }, { startDate: 'desc' }],
  })

  const periodLabels: Record<string, string> = {
    MONTHLY: 'Miesięczny',
    QUARTERLY: 'Kwartalny',
    YEARLY: 'Roczny',
  }

  const periodIcons: Record<string, string> = {
    MONTHLY: '📅',
    QUARTERLY: '📊',
    YEARLY: '🎯',
  }

  const roleLabels: Record<string, string> = {
    CLUB_MANAGER: 'Manager Klubu',
    VALIDATOR: 'Walidator Regionalny',
    PRODUCTION: 'Zespół Produkcji',
    ADMIN: 'Administrator',
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/dashboard">
            <Image
              src="/logo.svg"
              alt="regional.fit"
              width={120}
              height={40}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">
              {user.name} ({roleLabels[user.role]})
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Sales Focuses - shown prominently at the top */}
        {activeFocuses.length > 0 && (user.role === 'CLUB_MANAGER' || user.role === 'VALIDATOR') && (
          <div className="mb-8 space-y-3">
            {activeFocuses.map((focus) => (
              <div
                key={focus.id}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{periodIcons[focus.period]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 bg-amber-200 text-amber-800 rounded">
                        Focus {periodLabels[focus.period]}
                      </span>
                      {focus.brand && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: (focus.brand.primaryColor || '#888') + '20',
                            color: focus.brand.primaryColor || '#888',
                          }}
                        >
                          {focus.brand.name}
                        </span>
                      )}
                      {focus.region && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {focus.region.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {focus.title}
                    </h3>
                    {focus.description && (
                      <p className="text-sm text-gray-600 mt-1">{focus.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#2b3b82] mb-2">
            Witaj, {user.name}!
          </h2>
          <p className="text-[#2b3b82]/70">
            Twoja rola: {roleLabels[user.role]}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {user.role === 'CLUB_MANAGER' && (
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#daff47]">
              <h3 className="text-sm font-medium text-[#2b3b82]/60">Twoje briefy</h3>
              <p className="text-3xl font-bold text-[#2b3b82] mt-2">{stats.briefs}</p>
            </div>
          )}

          {user.role === 'VALIDATOR' && (
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#daff47]">
              <h3 className="text-sm font-medium text-[#2b3b82]/60">Do zatwierdzenia</h3>
              <p className="text-3xl font-bold text-[#2b3b82] mt-2">{stats.pendingApprovals}</p>
            </div>
          )}

          {user.role === 'PRODUCTION' && (
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#daff47]">
              <h3 className="text-sm font-medium text-[#2b3b82]/60">Zadania w toku</h3>
              <p className="text-3xl font-bold text-[#2b3b82] mt-2">{stats.tasksInProgress}</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-[#2b3b82] mb-4">Szybkie akcje</h3>
          <div className="flex flex-wrap gap-4">
            {user.role === 'CLUB_MANAGER' && (
              <Link
                href="/briefs/new"
                className="inline-flex items-center px-4 py-2 bg-[#daff47] text-[#2b3b82] font-semibold rounded-lg hover:bg-[#c5eb3d] transition-colors"
              >
                + Nowy brief
              </Link>
            )}

            {user.role === 'VALIDATOR' && (
              <Link
                href="/approvals"
                className="inline-flex items-center px-4 py-2 bg-[#daff47] text-[#2b3b82] font-semibold rounded-lg hover:bg-[#c5eb3d] transition-colors"
              >
                Przejdz do zatwierdzen
              </Link>
            )}

            {user.role === 'PRODUCTION' && (
              <Link
                href="/production"
                className="inline-flex items-center px-4 py-2 bg-[#daff47] text-[#2b3b82] font-semibold rounded-lg hover:bg-[#c5eb3d] transition-colors"
              >
                Przejdz do kolejki
              </Link>
            )}

            {user.role === 'ADMIN' && (
              <>
                <Link
                  href="/admin/clubs"
                  className="inline-flex items-center px-4 py-2 bg-[#2b3b82] text-white rounded-lg hover:bg-[#1a2654] transition-colors"
                >
                  Zarzadzaj klubami
                </Link>
                <Link
                  href="/admin/regions"
                  className="inline-flex items-center px-4 py-2 bg-[#2b3b82] text-white rounded-lg hover:bg-[#1a2654] transition-colors"
                >
                  Zarzadzaj regionami
                </Link>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center px-4 py-2 bg-[#2b3b82] text-white rounded-lg hover:bg-[#1a2654] transition-colors"
                >
                  Zarzadzaj uzytkownikami
                </Link>
                <Link
                  href="/admin/templates"
                  className="inline-flex items-center px-4 py-2 bg-[#2b3b82] text-white rounded-lg hover:bg-[#1a2654] transition-colors"
                >
                  Zarzadzaj szablonami
                </Link>
                <Link
                  href="/admin/focus"
                  className="inline-flex items-center px-4 py-2 bg-[#daff47] text-[#2b3b82] font-semibold rounded-lg hover:bg-[#c5eb3d] transition-colors"
                >
                  Cele sprzedazowe
                </Link>
              </>
            )}

            {user.role === 'VALIDATOR' && (
              <Link
                href="/admin/focus"
                className="inline-flex items-center px-4 py-2 bg-[#2b3b82] text-white rounded-lg hover:bg-[#1a2654] transition-colors"
              >
                Zarzadzaj celami
              </Link>
            )}
          </div>
        </div>

        {/* User's clubs */}
        {user.clubs.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-[#2b3b82] mb-4">
              {user.role === 'CLUB_MANAGER' ? 'Twoje kluby' : 'Przypisane kluby'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.clubs.map((uc) => (
                <div
                  key={uc.clubId}
                  className="border border-[#2b3b82]/10 rounded-lg p-4 hover:bg-[#2b3b82]/5 transition-colors"
                >
                  <h4 className="font-medium text-[#2b3b82]">{uc.club.name}</h4>
                  <p className="text-sm text-[#2b3b82]/60">{uc.club.city}</p>
                  <div className="mt-2 flex gap-2">
                    <span
                      className="inline-block px-2 py-1 text-xs rounded"
                      style={{ backgroundColor: (uc.club.brand.primaryColor || '#888') + '20', color: uc.club.brand.primaryColor || '#888' }}
                    >
                      {uc.club.brand.name}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs bg-[#2b3b82]/10 text-[#2b3b82]/70 rounded">
                      {uc.club.region.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
