import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/LogoutButton'

export default async function StatisticsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Only ADMIN and VALIDATOR can access statistics
  if (!['ADMIN', 'VALIDATOR'].includes(session.user.role)) {
    redirect('/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect('/login')
  }

  // Get date ranges
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Get briefs statistics by club
  const briefsByClub = await prisma.brief.groupBy({
    by: ['clubId'],
    _count: { id: true },
    where: {
      createdAt: { gte: ninetyDaysAgo },
    },
  })

  // Get all clubs with their brief counts
  const clubs = await prisma.club.findMany({
    include: {
      brand: true,
      region: true,
      _count: {
        select: { briefs: true },
      },
    },
    orderBy: {
      briefs: { _count: 'desc' },
    },
  })

  // Map club stats
  const clubStats = clubs.map((club) => {
    const recentCount = briefsByClub.find((b) => b.clubId === club.id)?._count.id || 0
    return {
      ...club,
      recentBriefs: recentCount,
      totalBriefs: club._count.briefs,
    }
  })

  // Get briefs statistics by manager (createdBy)
  const briefsByManager = await prisma.brief.groupBy({
    by: ['createdById'],
    _count: { id: true },
    where: {
      createdAt: { gte: ninetyDaysAgo },
    },
  })

  // Get all club managers
  const managers = await prisma.user.findMany({
    where: { role: 'CLUB_MANAGER' },
    include: {
      _count: {
        select: { briefs: true },
      },
      clubs: {
        include: {
          club: {
            include: { brand: true },
          },
        },
      },
    },
    orderBy: {
      briefs: { _count: 'desc' },
    },
  })

  // Map manager stats
  const managerStats = managers.map((manager) => {
    const recentCount = briefsByManager.find((b) => b.createdById === manager.id)?._count.id || 0
    return {
      ...manager,
      recentBriefs: recentCount,
      totalBriefs: manager._count.briefs,
    }
  })

  // Get brief status distribution
  const briefStatusCounts = await prisma.brief.groupBy({
    by: ['status'],
    _count: { id: true },
  })

  // Get briefs per month (last 6 months)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const monthlyBriefs = await prisma.brief.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo },
    },
    select: {
      createdAt: true,
    },
  })

  // Group by month
  const monthlyStats: Record<string, number> = {}
  monthlyBriefs.forEach((brief) => {
    const monthKey = `${brief.createdAt.getFullYear()}-${String(brief.createdAt.getMonth() + 1).padStart(2, '0')}`
    monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1
  })

  // Get brands statistics
  const briefsByBrand = await prisma.brief.groupBy({
    by: ['brandId'],
    _count: { id: true },
  })

  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: { briefs: true, clubs: true },
      },
    },
  })

  const brandStats = brands.map((brand) => ({
    ...brand,
    briefCount: briefsByBrand.find((b) => b.brandId === brand.id)?._count.id || 0,
    clubCount: brand._count.clubs,
  }))

  // Summary stats
  const totalBriefs = await prisma.brief.count()
  const totalClubs = await prisma.club.count()
  const totalManagers = await prisma.user.count({ where: { role: 'CLUB_MANAGER' } })
  const activeClubs = clubStats.filter((c) => c.recentBriefs > 0).length
  const inactiveClubs = totalClubs - activeClubs

  const statusLabels: Record<string, string> = {
    DRAFT: 'Szkic',
    SUBMITTED: 'Wysłany',
    CHANGES_REQUESTED: 'Do poprawy',
    APPROVED: 'Zatwierdzony',
    REJECTED: 'Odrzucony',
    CANCELLED: 'Anulowany',
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    CHANGES_REQUESTED: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-slate-100 text-slate-700',
  }

  const monthNames = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru']

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Regional.fit"
                width={120}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <div className="h-6 w-px bg-white/30" />
            <h1 className="text-xl font-bold text-white">Statystyki</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wszystkie briefy</p>
                <p className="text-3xl font-bold text-[#2b3b82]">{totalBriefs}</p>
              </div>
              <div className="w-12 h-12 bg-[#daff47] rounded-full flex items-center justify-center text-2xl">
                📋
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Kluby</p>
                <p className="text-3xl font-bold text-[#2b3b82]">{totalClubs}</p>
                <p className="text-xs text-gray-400 mt-1">
                  <span className="text-emerald-600">{activeClubs} aktywnych</span> /{' '}
                  <span className="text-gray-500">{inactiveClubs} nieaktywnych</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-[#2b3b82] rounded-full flex items-center justify-center text-2xl">
                🏋️
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Managerowie</p>
                <p className="text-3xl font-bold text-[#2b3b82]">{totalManagers}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ostatnie 30 dni</p>
                <p className="text-3xl font-bold text-[#2b3b82]">
                  {monthlyBriefs.filter((b) => b.createdAt >= thirtyDaysAgo).length}
                </p>
                <p className="text-xs text-gray-400 mt-1">nowych briefów</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-2xl">
                📈
              </div>
            </div>
          </div>
        </div>

        {/* Status distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statusy briefów</h2>
            <div className="space-y-3">
              {briefStatusCounts.map((status) => {
                const percentage = totalBriefs > 0 ? (status._count.id / totalBriefs) * 100 : 0
                return (
                  <div key={status.status} className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium w-28 text-center ${statusColors[status.status]}`}>
                      {statusLabels[status.status]}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-[#2b3b82] rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-16 text-right">
                      {status._count.id} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Briefy wg marki</h2>
            <div className="space-y-3">
              {brandStats
                .sort((a, b) => b.briefCount - a.briefCount)
                .map((brand) => {
                  const maxBriefs = Math.max(...brandStats.map((b) => b.briefCount), 1)
                  const percentage = (brand.briefCount / maxBriefs) * 100
                  return (
                    <div key={brand.id} className="flex items-center gap-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium w-28 text-center"
                        style={{
                          backgroundColor: (brand.primaryColor || '#888') + '20',
                          color: brand.primaryColor || '#888',
                        }}
                      >
                        {brand.name}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: brand.primaryColor || '#888',
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-16 text-right">
                        {brand.briefCount} briefów
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Monthly trend */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trend miesięczny (ostatnie 6 miesięcy)</h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {Array.from({ length: 6 }, (_, i) => {
              const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
              const count = monthlyStats[monthKey] || 0
              const maxCount = Math.max(...Object.values(monthlyStats), 1)
              const heightPercent = (count / maxCount) * 100 || 5

              return (
                <div key={monthKey} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-semibold text-[#2b3b82]">{count}</span>
                  <div className="w-full bg-gray-100 rounded-t-lg flex-1 relative">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2b3b82] to-[#4a5ba8] rounded-t-lg transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{monthNames[date.getMonth()]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top clubs */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-[#2b3b82] to-[#3d4f9e]">
              <h2 className="text-lg font-semibold text-white">Najaktywniejsze kluby</h2>
              <p className="text-sm text-white/70">Ostatnie 90 dni</p>
            </div>
            <div className="divide-y">
              {clubStats
                .sort((a, b) => b.recentBriefs - a.recentBriefs)
                .slice(0, 10)
                .map((club, index) => (
                  <div key={club.id} className="px-6 py-3 flex items-center gap-4 hover:bg-[#f5f7fa]">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < 3 ? 'bg-[#daff47] text-[#2b3b82]' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{club.name}</p>
                      <p className="text-sm text-gray-500">
                        {club.city} • {club.region.name}
                      </p>
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: (club.brand.primaryColor || '#888') + '20',
                        color: club.brand.primaryColor || '#888',
                      }}
                    >
                      {club.brand.name}
                    </span>
                    <div className="text-right">
                      <p className="font-bold text-[#2b3b82]">{club.recentBriefs}</p>
                      <p className="text-xs text-gray-400">({club.totalBriefs} łącznie)</p>
                    </div>
                  </div>
                ))}
            </div>
            {clubStats.filter((c) => c.recentBriefs === 0).length > 0 && (
              <div className="px-6 py-3 bg-red-50 border-t">
                <p className="text-sm text-red-600">
                  ⚠️ <strong>{clubStats.filter((c) => c.recentBriefs === 0).length}</strong> klubów nie wysłało briefów w ostatnich 90 dniach
                </p>
              </div>
            )}
          </div>

          {/* Top managers */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-emerald-500 to-emerald-600">
              <h2 className="text-lg font-semibold text-white">Najaktywniejsze managerowie</h2>
              <p className="text-sm text-white/70">Ostatnie 90 dni</p>
            </div>
            <div className="divide-y">
              {managerStats
                .sort((a, b) => b.recentBriefs - a.recentBriefs)
                .slice(0, 10)
                .map((manager, index) => (
                  <div key={manager.id} className="px-6 py-3 flex items-center gap-4 hover:bg-[#f5f7fa]">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < 3 ? 'bg-[#daff47] text-[#2b3b82]' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{manager.name}</p>
                      <p className="text-sm text-gray-500">{manager.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {manager.clubs.slice(0, 2).map((uc) => (
                        <span
                          key={uc.clubId}
                          className="px-2 py-0.5 rounded text-xs truncate"
                          style={{
                            backgroundColor: (uc.club.brand.primaryColor || '#888') + '20',
                            color: uc.club.brand.primaryColor || '#888',
                          }}
                        >
                          {uc.club.name}
                        </span>
                      ))}
                      {manager.clubs.length > 2 && (
                        <span className="text-xs text-gray-400">+{manager.clubs.length - 2}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{manager.recentBriefs}</p>
                      <p className="text-xs text-gray-400">({manager.totalBriefs} łącznie)</p>
                    </div>
                  </div>
                ))}
            </div>
            {managerStats.filter((m) => m.recentBriefs === 0).length > 0 && (
              <div className="px-6 py-3 bg-amber-50 border-t">
                <p className="text-sm text-amber-600">
                  💤 <strong>{managerStats.filter((m) => m.recentBriefs === 0).length}</strong> managerów nie wysłało briefów w ostatnich 90 dniach
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Inactive clubs warning */}
        {inactiveClubs > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              Kluby bez aktywności (90 dni)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {clubStats
                .filter((c) => c.recentBriefs === 0)
                .map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: club.brand.primaryColor || '#888' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{club.name}</p>
                      <p className="text-xs text-gray-500">
                        {club.city} • Łącznie: {club.totalBriefs} briefów
                      </p>
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
