import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/LogoutButton'
import { PriorityBadge } from '@/components/briefs/status-badge'
import { formatDate, formatRelativeTime, getSLAIndicator } from '@/lib/utils'

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
            <h1 className="text-xl font-semibold text-white">Zatwierdzenia</h1>
            {pendingBriefs.length > 0 && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {pendingBriefs.length} oczekujacych
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/focus"
              className="text-white/70 hover:text-white text-sm"
            >
              🎯 Cele
            </Link>
            <Link
              href="/statistics"
              className="text-white/70 hover:text-white text-sm"
            >
              📊 Statystyki
            </Link>
            <span className="text-white/30">|</span>
            <span className="text-sm text-white/80">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Sales Focuses */}
        {activeFocuses.length > 0 && (
          <div className="mb-6 space-y-2">
            {activeFocuses.map((focus) => (
              <div
                key={focus.id}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎯</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 bg-amber-200 text-amber-800 rounded">
                      Focus
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
                    <span className="font-medium text-gray-900">{focus.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pending approvals */}
        <section className="mb-10">
          {pendingBriefs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Wszystko zatwierdzone!</h2>
              <p className="text-gray-500">Nie ma briefow oczekujacych na Twoja decyzje.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBriefs.map((brief) => {
                const sla = getSLAIndicator(brief.deadline)
                return (
                  <Link
                    key={brief.id}
                    href={`/approvals/${brief.id}`}
                    className="block bg-white rounded-lg shadow hover:shadow-md transition-all border-l-4 border-[#2b3b82]"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs text-gray-500 font-mono">{brief.code}</span>
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
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              {brief.club.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              {brief.template.name}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 truncate">
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
                          <p className={`text-xs ${sla.color}`}>{sla.text}</p>
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

        {/* Recent approvals */}
        {recentApprovals.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ostatnie decyzje
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f5f7fa]">
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
                <tbody className="divide-y divide-gray-200">
                  {recentApprovals.map((approval) => (
                    <tr key={approval.id} className="hover:bg-[#f5f7fa]">
                      <td className="px-6 py-4">
                        <Link
                          href={`/briefs/${approval.briefId}`}
                          className="text-[#2b3b82] hover:underline"
                        >
                          {approval.brief.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatRelativeTime(approval.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
