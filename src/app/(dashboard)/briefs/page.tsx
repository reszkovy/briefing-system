import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/LogoutButton'
import { BriefCard } from '@/components/briefs/brief-card'
import { Button } from '@/components/ui/button'
import { BriefStatusLabels } from '@/lib/validations/brief'
import { formatDate } from '@/lib/utils'

export default async function BriefsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
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
            include: { brand: true, region: true },
          },
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const resolvedParams = await searchParams
  const statusFilter = resolvedParams.status || 'all'
  const page = parseInt(resolvedParams.page || '1')
  const limit = 12

  // Build query based on user role
  const where: Record<string, unknown> = {}

  if (session.user.role === 'CLUB_MANAGER') {
    where.createdById = session.user.id
  } else if (session.user.role === 'VALIDATOR') {
    const userClubs = await prisma.userClub.findMany({
      where: { userId: session.user.id },
      select: { clubId: true },
    })
    where.clubId = { in: userClubs.map((uc) => uc.clubId) }
  }

  if (statusFilter !== 'all') {
    where.status = statusFilter
  }

  const [briefs, total] = await Promise.all([
    prisma.brief.findMany({
      where,
      include: {
        club: { include: { brand: true } },
        brand: true,
        template: true,
        productionTask: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.brief.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  // Get counts for each status
  const statusCounts = await prisma.brief.groupBy({
    by: ['status'],
    where: session.user.role === 'CLUB_MANAGER'
      ? { createdById: session.user.id }
      : session.user.role === 'VALIDATOR'
      ? { clubId: { in: (await prisma.userClub.findMany({
          where: { userId: session.user.id },
          select: { clubId: true },
        })).map(uc => uc.clubId) } }
      : {},
    _count: { status: true },
  })

  const counts = statusCounts.reduce((acc, item) => {
    acc[item.status] = item._count.status
    return acc
  }, {} as Record<string, number>)

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0)

  // Get active sales focuses for manager's clubs
  const now = new Date()
  const userBrandIds = user.clubs.map((uc) => uc.club.brandId)
  const userRegionIds = user.clubs.map((uc) => uc.club.regionId)

  const activeFocuses = await prisma.salesFocus.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
      OR: [
        { brandId: null, regionId: null },
        { brandId: { in: userBrandIds }, regionId: null },
        { regionId: { in: userRegionIds }, brandId: null },
        { brandId: { in: userBrandIds }, regionId: { in: userRegionIds } },
      ],
    },
    include: { brand: true, region: true },
    orderBy: [{ period: 'asc' }, { startDate: 'desc' }],
  })

  // Categorize focuses by tier
  const strategicFocuses = activeFocuses.filter(f => !f.brandId && !f.regionId)
  const regionalFocuses = activeFocuses.filter(f => f.regionId && !f.brandId)
  const brandFocuses = activeFocuses.filter(f => f.brandId)

  const tierConfig = {
    strategic: { label: 'Cel Strategiczny', bg: 'from-purple-50 to-indigo-50', border: 'border-purple-200', badge: 'bg-purple-200 text-purple-800', icon: '🎯' },
    regional: { label: 'Cel Regionalny', bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', badge: 'bg-blue-200 text-blue-800', icon: '🗺️' },
    brand: { label: 'Cel Marki', bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', badge: 'bg-amber-200 text-amber-800', icon: '⭐' },
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
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
            <h1 className="text-xl font-semibold text-white">Moje briefy</h1>
          </div>
          <div className="flex items-center gap-4">
            {session.user.role === 'CLUB_MANAGER' && (
              <Link href="/briefs/new">
                <Button className="bg-[#daff47] text-[#2b3b82] hover:bg-[#c5eb3d]">
                  + Nowy brief
                </Button>
              </Link>
            )}
            <span className="text-white/30">|</span>
            <span className="text-sm text-white/80">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Sales Focuses - Tiered display */}
        {activeFocuses.length > 0 && (
          <div className="mb-6 space-y-3">
            {/* Strategic (Global) Focuses */}
            {strategicFocuses.map((focus) => (
              <div
                key={focus.id}
                className={`bg-gradient-to-r ${tierConfig.strategic.bg} border ${tierConfig.strategic.border} rounded-lg p-4 shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tierConfig.strategic.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${tierConfig.strategic.badge}`}>
                        {tierConfig.strategic.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(focus.startDate)} - {formatDate(focus.endDate)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{focus.title}</h3>
                    {focus.description && (
                      <p className="text-sm text-gray-600 mt-1">{focus.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Regional Focuses */}
            {regionalFocuses.map((focus) => (
              <div
                key={focus.id}
                className={`bg-gradient-to-r ${tierConfig.regional.bg} border ${tierConfig.regional.border} rounded-lg p-4 shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tierConfig.regional.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${tierConfig.regional.badge}`}>
                        {tierConfig.regional.label}
                      </span>
                      {focus.region && (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {focus.region.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(focus.startDate)} - {formatDate(focus.endDate)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{focus.title}</h3>
                    {focus.description && (
                      <p className="text-sm text-gray-600 mt-1">{focus.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Brand Focuses */}
            {brandFocuses.map((focus) => (
              <div
                key={focus.id}
                className={`bg-gradient-to-r ${tierConfig.brand.bg} border ${tierConfig.brand.border} rounded-lg p-4 shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tierConfig.brand.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${tierConfig.brand.badge}`}>
                        {tierConfig.brand.label}
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
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {focus.region.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(focus.startDate)} - {formatDate(focus.endDate)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{focus.title}</h3>
                    {focus.description && (
                      <p className="text-sm text-gray-600 mt-1">{focus.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Status filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/briefs"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#daff47] text-[#2b3b82] font-semibold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Wszystkie ({totalCount})
            </Link>
            {Object.entries(BriefStatusLabels).map(([status, label]) => {
              const count = counts[status] || 0
              if (count === 0) return null
              return (
                <Link
                  key={status}
                  href={`/briefs?status=${status}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-[#daff47] text-[#2b3b82] font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </Link>
              )
            })}
          </div>
        </div>

        {/* Brief list */}
        {briefs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak briefow</h2>
            <p className="text-gray-500 mb-4">
              {statusFilter === 'all'
                ? 'Nie masz jeszcze zadnych briefow.'
                : `Brak briefow o statusie "${BriefStatusLabels[statusFilter]}".`}
            </p>
            {session.user.role === 'CLUB_MANAGER' && (
              <Link href="/briefs/new">
                <Button className="bg-[#daff47] text-[#2b3b82] hover:bg-[#c5eb3d]">
                  + Utworz pierwszy brief
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {briefs.map((brief) => (
                <BriefCard key={brief.id} brief={brief} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/briefs?${statusFilter !== 'all' ? `status=${statusFilter}&` : ''}page=${page - 1}`}
                    className="px-4 py-2 bg-white border rounded-lg hover:bg-[#f5f7fa]"
                  >
                    Poprzednia
                  </Link>
                )}
                <span className="px-4 py-2 text-gray-600">
                  Strona {page} z {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/briefs?${statusFilter !== 'all' ? `status=${statusFilter}&` : ''}page=${page + 1}`}
                    className="px-4 py-2 bg-white border rounded-lg hover:bg-[#f5f7fa]"
                  >
                    Nastepna
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        {session.user.role === 'CLUB_MANAGER' && (
          <div className="mt-8 flex justify-center">
            <Link href="/briefs/new">
              <Button className="bg-[#daff47] text-[#2b3b82] hover:bg-[#c5eb3d] px-8 py-3 text-lg">
                + Nowy brief
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
