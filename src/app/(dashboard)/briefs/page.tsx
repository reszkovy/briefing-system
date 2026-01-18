import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BriefCard } from '@/components/briefs/brief-card'
import { Button } from '@/components/ui/button'
import { BriefStatusLabels } from '@/lib/validations/brief'

export default async function BriefsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await auth()

  if (!session) {
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
        club: true,
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

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/70 hover:text-white">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Moje briefy</h1>
          </div>
          {session.user.role === 'CLUB_MANAGER' && (
            <Link href="/briefs/new">
              <Button>+ Nowy brief</Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <p className="text-gray-500 mb-4">
              {statusFilter === 'all'
                ? 'Nie masz jeszcze zadnych briefow.'
                : `Brak briefow o statusie "${BriefStatusLabels[statusFilter]}".`}
            </p>
            {session.user.role === 'CLUB_MANAGER' && (
              <Link href="/briefs/new">
                <Button>Utworz pierwszy brief</Button>
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
      </main>
    </div>
  )
}
