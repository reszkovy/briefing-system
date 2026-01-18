import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatusBadge, PriorityBadge } from '@/components/briefs/status-badge'
import { formatDate, formatRelativeTime, getSLAIndicator } from '@/lib/utils'
import { ObjectiveLabels } from '@/lib/validations/brief'

export default async function ApprovalsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Only VALIDATOR can access this page
  if (session.user.role !== 'VALIDATOR') {
    redirect('/dashboard')
  }

  // Get clubs this validator oversees
  const userClubs = await prisma.userClub.findMany({
    where: { userId: session.user.id },
    select: { clubId: true },
  })

  const clubIds = userClubs.map((uc) => uc.clubId)

  // Get briefs pending approval (SUBMITTED status)
  const pendingBriefs = await prisma.brief.findMany({
    where: {
      status: 'SUBMITTED',
      clubId: { in: clubIds },
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      club: true,
      brand: true,
      template: true,
    },
    orderBy: { submittedAt: 'asc' },
  })

  // Get recently processed briefs
  const recentApprovals = await prisma.approval.findMany({
    where: {
      validatorId: session.user.id,
    },
    include: {
      brief: {
        include: {
          club: true,
          brand: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/70 hover:text-white">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Zatwierdzenia</h1>
          </div>
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
            {pendingBriefs.length} oczekujących
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending approvals */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Oczekujące na zatwierdzenie
          </h2>

          {pendingBriefs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Brak briefów oczekujących na zatwierdzenie.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBriefs.map((brief) => {
                const sla = getSLAIndicator(brief.deadline)
                return (
                  <div
                    key={brief.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-500">{brief.code}</span>
                          <PriorityBadge priority={brief.priority} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {brief.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span
                            className="inline-flex items-center rounded px-2 py-0.5 text-xs"
                            style={{
                              backgroundColor: (brief.brand.primaryColor || '#888') + '20',
                              color: brief.brand.primaryColor || '#888',
                            }}
                          >
                            {brief.brand.name}
                          </span>
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs bg-gray-100 text-gray-600">
                            {brief.club.name}
                          </span>
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs bg-gray-100 text-gray-600">
                            {brief.template.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Cel:</strong> {ObjectiveLabels[brief.objective]} - {brief.kpiDescription}
                        </p>
                        <p className="text-sm text-gray-500">
                          Autor: {brief.createdBy.name} • Wysłano: {formatRelativeTime(brief.submittedAt || brief.createdAt)}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className={`text-sm font-medium ${sla.color}`}>
                          Deadline: {formatDate(brief.deadline)}
                        </p>
                        <p className={`text-xs ${sla.color}`}>{sla.text}</p>
                        <Link
                          href={`/approvals/${brief.id}`}
                          className="mt-3 inline-block px-4 py-2 bg-[#daff47] text-[#2b3b82] font-semibold rounded-lg hover:bg-[#c5eb3d] text-sm"
                        >
                          Rozpatrz
                        </Link>
                      </div>
                    </div>
                  </div>
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
