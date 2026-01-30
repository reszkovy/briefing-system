import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/LogoutButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { PriorityBadge } from '@/components/briefs/status-badge'
import { formatDate, formatRelativeTime, getSLAIndicator } from '@/lib/utils'
import { RegionHeatmap } from '@/components/admin/RegionHeatmap'

// Cost per day of delay (in PLN)
const DELAY_COST_PER_DAY = 50

// Alignment score calculation (simplified version for list view)
function calculateAlignmentScore(context: string, title: string, brandName: string): number | null {
  if (brandName.toLowerCase() !== 'zdrofit') return null

  const text = `${title} ${context}`.toLowerCase()
  let score = 50

  const positiveKeywords: Record<string, number> = {
    'yoga': 15, 'joga': 15, 'pilates': 15, 'mobility': 12, 'stretching': 12,
    'wellness': 10, 'mindfulness': 10, 'medytacja': 10, 'retencja': 15,
    'lojalność': 12, 'klubowicz': 10, 'członek': 8,
  }

  const negativeKeywords: Record<string, number> = {
    'akwizycja': -15, 'nowi klienci': -12, 'rabat': -8, 'zniżka': -8,
    'promocja cenowa': -10, 'black friday': -12, 'hiit': -10, 'crossfit': -10,
  }

  for (const [keyword, weight] of Object.entries(positiveKeywords)) {
    if (text.includes(keyword)) score += weight
  }
  for (const [keyword, weight] of Object.entries(negativeKeywords)) {
    if (text.includes(keyword)) score += weight
  }

  return Math.max(0, Math.min(100, score))
}

function getAlignmentBadge(score: number): { color: string; bgColor: string; label: string } {
  if (score >= 70) return { color: 'text-green-700', bgColor: 'bg-green-100', label: `${score}%` }
  if (score >= 50) return { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: `${score}%` }
  return { color: 'text-red-700', bgColor: 'bg-red-100', label: `⚠️ ${score}%` }
}

export default async function ApprovalsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Only VALIDATOR can access this page
  if (session.user.role !== 'VALIDATOR') {
    redirect('/')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      clubs: {
        include: {
          club: {
            include: { brand: true },
          },
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const clubIds = user.clubs.map((uc) => uc.clubId)

  // Get validator's clubs with detailed data for statistics
  const validatorClubs = await prisma.club.findMany({
    where: { id: { in: clubIds } },
    include: {
      region: true,
      briefs: {
        where: {
          createdAt: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
          },
        },
      },
    },
  })

  // Calculate region activity data for validator's clubs only
  const regionMap = new Map<string, {
    id: string
    name: string
    code: string
    clubCount: number
    briefCount: number
    approvedCount: number
  }>()

  for (const club of validatorClubs) {
    const regionId = club.region.id
    const existing = regionMap.get(regionId)
    const briefCount = club.briefs.length
    const approvedCount = club.briefs.filter(b => b.status === 'APPROVED').length

    if (existing) {
      existing.clubCount += 1
      existing.briefCount += briefCount
      existing.approvedCount += approvedCount
    } else {
      regionMap.set(regionId, {
        id: regionId,
        name: club.region.name,
        code: club.region.code,
        clubCount: 1,
        briefCount,
        approvedCount,
      })
    }
  }

  const validatorRegionData = Array.from(regionMap.values()).map(region => {
    let activityLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low'
    if (region.briefCount >= 30) activityLevel = 'very_high'
    else if (region.briefCount >= 15) activityLevel = 'high'
    else if (region.briefCount >= 8) activityLevel = 'medium'
    else if (region.briefCount >= 3) activityLevel = 'low'
    else activityLevel = 'very_low'

    return { ...region, activityLevel }
  })

  // Get clubs with coordinates for map (only validator's clubs)
  const validatorClubsWithCoords = validatorClubs
    .filter(club => club.latitude && club.longitude)
    .map(club => ({
      id: club.id,
      name: club.name,
      city: club.city,
      latitude: club.latitude,
      longitude: club.longitude,
      briefCount: club.briefs.length,
      tier: club.tier,
    }))

  // Calculate total stats for validator
  const totalClubs = validatorClubs.length
  const totalBriefs = validatorClubs.reduce((sum, c) => sum + c.briefs.length, 0)
  const approvedBriefs = validatorClubs.reduce(
    (sum, c) => sum + c.briefs.filter(b => b.status === 'APPROVED').length,
    0
  )
  const pendingCount = validatorClubs.reduce(
    (sum, c) => sum + c.briefs.filter(b => b.status === 'SUBMITTED').length,
    0
  )

  // Get briefs pending approval (SUBMITTED status)
  const pendingBriefs = await prisma.brief.findMany({
    where: {
      status: 'SUBMITTED',
      clubId: { in: clubIds },
    },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      club: { include: { brand: true } },
      template: true,
    },
    orderBy: [{ priority: 'desc' }, { submittedAt: 'asc' }],
  })

  // Calculate worst delays (top 10 most overdue briefs)
  const now = new Date()
  const worstDelays = pendingBriefs
    .map(brief => {
      const deadline = new Date(brief.deadline)
      const daysOverdue = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24))
      return { ...brief, daysOverdue, delayCost: Math.max(0, daysOverdue) * DELAY_COST_PER_DAY }
    })
    .filter(brief => brief.daysOverdue > 0)
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .slice(0, 10)

  const totalDelayCost = worstDelays.reduce((sum, b) => sum + b.delayCost, 0)

  // Get recently processed briefs
  const recentApprovals = await prisma.approval.findMany({
    where: { validatorId: session.user.id },
    include: {
      brief: {
        include: {
          club: { include: { brand: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  // Get active sales focuses
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
            <h1 className="text-xl font-semibold text-white">Zatwierdzenia</h1>
            {pendingBriefs.length > 0 && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {pendingBriefs.length} oczekujacych
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/statistics"
              className="text-white/70 hover:text-white text-sm"
            >
              📊 Statystyki
            </Link>
            <span className="text-white/30">|</span>
            <span className="text-sm text-white/80">{user.name}</span>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Pinned Sales Focuses - sticky at top */}
      {activeFocuses.length > 0 && (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-lg flex-shrink-0">🎯</span>
              <span className="text-xs font-medium text-amber-700 flex-shrink-0">Cele:</span>
              {activeFocuses.slice(0, 3).map((focus, idx) => (
                <span
                  key={focus.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 rounded text-sm text-gray-800 whitespace-nowrap flex-shrink-0"
                >
                  {focus.brand && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: focus.brand.primaryColor || '#888' }}
                    />
                  )}
                  {focus.title}
                </span>
              ))}
              {activeFocuses.length > 3 && (
                <span className="text-xs text-amber-600 flex-shrink-0">+{activeFocuses.length - 3} więcej</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick stats bar */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#2b3b82] dark:text-rf-lime font-bold text-lg">{totalClubs}</span>
            <span className="text-gray-500">klubów</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-lg">{approvedBriefs}</span>
            <span className="text-gray-500">zatwierdzonych</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600 font-bold text-lg">{pendingCount}</span>
            <span className="text-gray-500">oczekujących</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/admin/context"
              className="text-xs text-gray-500 hover:text-[#2b3b82] transition-colors"
            >
              🏢 Konteksty klubów
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/admin/focus"
              className="text-xs text-gray-500 hover:text-[#2b3b82] transition-colors"
            >
              🎯 Cele sprzedażowe
            </Link>
          </div>
        </div>

        {/* Worst Delays Alert - only show if there are overdue briefs */}
        {worstDelays.length > 0 && (
          <details className="mb-6 group">
            <summary className="flex items-center gap-3 cursor-pointer bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <span className="text-2xl">🔥</span>
              <div className="flex-1">
                <span className="font-semibold text-red-700 dark:text-red-400">
                  Najgorsze opóźnienia
                </span>
                <span className="text-red-600 dark:text-red-400 text-sm ml-2">
                  ({worstDelays.length} briefów • łączny koszt: {totalDelayCost} zł)
                </span>
              </div>
              <svg className="w-5 h-5 text-red-500 transform transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 bg-white dark:bg-card rounded-lg shadow overflow-hidden border border-red-100 dark:border-red-900">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-border">
                <thead className="bg-red-50 dark:bg-red-900/30">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-red-700 dark:text-red-400 uppercase">Brief</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-red-700 dark:text-red-400 uppercase">Klub</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-red-700 dark:text-red-400 uppercase">Dni opóźnienia</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-red-700 dark:text-red-400 uppercase">Koszt</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-red-700 dark:text-red-400 uppercase">Akcja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-border">
                  {worstDelays.map((brief, idx) => (
                    <tr key={brief.id} className={idx === 0 ? 'bg-red-100/50 dark:bg-red-900/40' : ''}>
                      <td className="px-4 py-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{brief.title}</span>
                        <span className="text-xs text-gray-500 block">{brief.code}</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{brief.club.name}</td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-red-600 dark:text-red-400 font-bold">{brief.daysOverdue} dni</span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-red-600 dark:text-red-400 font-semibold">{brief.delayCost} zł</span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Link
                          href={`/approvals/${brief.id}`}
                          className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          Rozpatrz
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}

        {/* MAIN: Pending approvals - the key element */}
        <section className="mb-10">
          {pendingBriefs.length === 0 ? (
            <div className="bg-white dark:bg-card rounded-lg shadow p-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Wszystko zatwierdzone!</h2>
              <p className="text-gray-500 dark:text-gray-400">Nie ma briefow oczekujacych na Twoja decyzje.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBriefs.map((brief) => {
                const sla = getSLAIndicator(brief.deadline)
                const alignmentScore = calculateAlignmentScore(brief.context || '', brief.title, brief.club.brand.name)
                const alignmentBadge = alignmentScore !== null ? getAlignmentBadge(alignmentScore) : null

                // Calculate delay cost
                const now = new Date()
                const deadline = new Date(brief.deadline)
                const daysOverdue = Math.max(0, Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)))
                const delayCost = daysOverdue > 0 ? daysOverdue * DELAY_COST_PER_DAY : 0

                return (
                  <Link
                    key={brief.id}
                    href={`/approvals/${brief.id}`}
                    className="block bg-white dark:bg-card rounded-lg shadow hover:shadow-md transition-all border-l-4 border-[#2b3b82] dark:border-rf-lime"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{brief.code}</span>
                            <PriorityBadge priority={brief.priority} />
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: (brief.club.brand.primaryColor || '#888') + '20',
                                color: brief.club.brand.primaryColor || '#888',
                              }}
                            >
                              {brief.club.brand.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-muted text-gray-600 dark:text-gray-300">
                              {brief.club.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-muted text-gray-600 dark:text-gray-300">
                              {brief.template.name}
                            </span>
                            {/* Alignment Score Badge */}
                            {alignmentBadge && (
                              <span className={`text-xs px-2 py-0.5 rounded font-medium ${alignmentBadge.bgColor} ${alignmentBadge.color}`}>
                                {alignmentBadge.label} alignment
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                            {brief.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {brief.context || 'Brak opisu'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Autor: {brief.createdBy.name}</span>
                            <span>•</span>
                            <span>Wyslano: {formatRelativeTime(brief.submittedAt || brief.createdAt)}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-medium ${sla.color}`}>
                            {formatDate(brief.deadline)}
                          </p>
                          <p className={`text-xs ${sla.color}`}>
                            {sla.text}
                            {delayCost > 0 && (
                              <span className="ml-1 font-semibold">• {delayCost} zł</span>
                            )}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 bg-[#daff47] text-[#2b3b82] font-semibold rounded text-sm">
                            Rozpatrz →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* Recent approvals - compact list */}
        {recentApprovals.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Ostatnie decyzje
            </h2>
            <div className="bg-white dark:bg-card rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-border">
                <thead className="bg-[#f5f7fa] dark:bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Brief
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Klub
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Decyzja
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-border">
                  {recentApprovals.map((approval) => (
                    <tr key={approval.id} className="hover:bg-[#f5f7fa] dark:hover:bg-muted">
                      <td className="px-6 py-4">
                        <Link
                          href={`/briefs/${approval.briefId}`}
                          className="text-[#2b3b82] dark:text-rf-lime hover:underline"
                        >
                          {approval.brief.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {approval.brief.club.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            approval.decision === 'APPROVED'
                              ? 'bg-green-100 text-green-700'
                              : approval.decision === 'REJECTED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {approval.decision === 'APPROVED' && 'Zatwierdzono'}
                          {approval.decision === 'REJECTED' && 'Odrzucono'}
                          {approval.decision === 'CHANGES_REQUESTED' && 'Poprawki'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(approval.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Region Heatmap - open by default */}
        {validatorClubsWithCoords.length > 0 && (
          <details className="mb-8 group" open>
            <summary className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-[#2b3b82] dark:hover:text-rf-lime mb-4">
              <span className="text-lg">🗺️</span>
              <span className="font-medium">Mapa aktywności klubów</span>
              <span className="text-xs text-gray-400 ml-2">({totalClubs} klubów w {validatorRegionData.length} regionach)</span>
              <svg className="w-4 h-4 ml-auto transform transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <RegionHeatmap regions={validatorRegionData} clubs={validatorClubsWithCoords} />
          </details>
        )}
      </main>
    </div>
  )
}
