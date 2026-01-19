import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/LogoutButton'
import { formatDate, formatRelativeTime, getSLAIndicator } from '@/lib/utils'

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

  // Get data based on role
  let pendingBriefs: any[] = []
  let productionTasks: any[] = []
  let userBriefs: any[] = []

  const clubIds = user.clubs.map((uc) => uc.clubId)

  if (user.role === 'VALIDATOR') {
    // Get all briefs pending approval for validator's clubs
    pendingBriefs = await prisma.brief.findMany({
      where: {
        status: 'SUBMITTED',
        clubId: { in: clubIds },
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        club: {
          include: { brand: true },
        },
        template: true,
      },
      orderBy: [{ priority: 'desc' }, { submittedAt: 'asc' }],
    })
  } else if (user.role === 'PRODUCTION') {
    // Get all production tasks
    productionTasks = await prisma.productionTask.findMany({
      where: {
        status: { in: ['QUEUED', 'IN_PROGRESS', 'IN_REVIEW', 'ON_HOLD'] },
      },
      include: {
        brief: {
          include: {
            club: { include: { brand: true } },
            template: true,
            createdBy: { select: { name: true } },
          },
        },
        assignee: { select: { name: true } },
      },
      orderBy: [{ brief: { priority: 'desc' } }, { dueDate: 'asc' }],
    })
  } else if (user.role === 'CLUB_MANAGER') {
    // Get all briefs created by this manager
    userBriefs = await prisma.brief.findMany({
      where: { createdById: user.id },
      include: {
        club: { include: { brand: true } },
        template: true,
      },
      orderBy: [{ updatedAt: 'desc' }],
    })
  }

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

  const roleLabels: Record<string, string> = {
    CLUB_MANAGER: 'Manager Klubu',
    VALIDATOR: 'Walidator Regionalny',
    PRODUCTION: 'Studio Graficzne',
    ADMIN: 'Administrator',
  }

  const statusLabels: Record<string, string> = {
    DRAFT: 'Szkic',
    SUBMITTED: 'Wysłany',
    CHANGES_REQUESTED: 'Do poprawy',
    APPROVED: 'Zatwierdzony',
    REJECTED: 'Odrzucony',
    QUEUED: 'W kolejce',
    IN_PROGRESS: 'W realizacji',
    IN_REVIEW: 'Do sprawdzenia',
    ON_HOLD: 'Wstrzymany',
    DELIVERED: 'Dostarczony',
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    CHANGES_REQUESTED: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
    QUEUED: 'bg-slate-100 text-slate-600',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    IN_REVIEW: 'bg-amber-100 text-amber-700',
    ON_HOLD: 'bg-red-100 text-red-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
  }

  const priorityLabels: Record<string, string> = {
    LOW: 'Niski',
    MEDIUM: 'Średni',
    HIGH: 'Wysoki',
    CRITICAL: 'Krytyczny',
  }

  const priorityColors: Record<string, string> = {
    LOW: 'bg-slate-100 text-slate-600',
    MEDIUM: 'bg-blue-100 text-blue-700',
    HIGH: 'bg-orange-100 text-orange-700',
    CRITICAL: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/dashboard">
            <Image
              src="/logo-white.svg"
              alt="regional.fit"
              width={120}
              height={40}
              className="h-10 w-auto"
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
        {/* Active Sales Focuses */}
        {activeFocuses.length > 0 && (user.role === 'CLUB_MANAGER' || user.role === 'VALIDATOR') && (
          <div className="mb-6 space-y-2">
            {activeFocuses.map((focus) => (
              <div
                key={focus.id}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎯</span>
                  <div className="flex-1">
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
              </div>
            ))}
          </div>
        )}

        {/* Quick actions bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2b3b82]">
            {user.role === 'VALIDATOR' && 'Briefy do zatwierdzenia'}
            {user.role === 'PRODUCTION' && 'Kolejka produkcji'}
            {user.role === 'CLUB_MANAGER' && 'Twoje briefy'}
            {user.role === 'ADMIN' && 'Panel administracyjny'}
          </h1>
          <div className="flex items-center gap-3">
            {user.role === 'CLUB_MANAGER' && (
              <Link
                href="/briefs/new"
                className="inline-flex items-center px-4 py-2 bg-[#daff47] text-[#2b3b82] font-semibold rounded-lg hover:bg-[#c5eb3d] transition-colors"
              >
                + Nowy brief
              </Link>
            )}
            {user.role === 'VALIDATOR' && (
              <>
                <Link
                  href="/admin/focus"
                  className="inline-flex items-center px-3 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  🎯 Cele sprzedażowe
                </Link>
                <Link
                  href="/statistics"
                  className="inline-flex items-center px-3 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  📊 Statystyki
                </Link>
              </>
            )}
            {user.role === 'PRODUCTION' && (
              <Link
                href="/production"
                className="inline-flex items-center px-3 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                📋 Widok Kanban
              </Link>
            )}
          </div>
        </div>

        {/* VALIDATOR: Pending briefs list */}
        {user.role === 'VALIDATOR' && (
          <div className="space-y-3">
            {pendingBriefs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Wszystko zatwierdzone!</h2>
                <p className="text-gray-500">Nie ma briefów oczekujących na Twoją decyzję.</p>
              </div>
            ) : (
              pendingBriefs.map((brief) => {
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
                            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[brief.priority]}`}>
                              {priorityLabels[brief.priority]}
                            </span>
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
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {brief.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {brief.context || 'Brak opisu'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Szablon: {brief.template.name}</span>
                            <span>•</span>
                            <span>Autor: {brief.createdBy.name}</span>
                            <span>•</span>
                            <span>Wysłano: {formatRelativeTime(brief.submittedAt || brief.createdAt)}</span>
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
              })
            )}
          </div>
        )}

        {/* PRODUCTION: Tasks list */}
        {user.role === 'PRODUCTION' && (
          <div className="space-y-3">
            {productionTasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak zadań w kolejce</h2>
                <p className="text-gray-500">Nowe zadania pojawią się po zatwierdzeniu briefów.</p>
              </div>
            ) : (
              productionTasks.map((task) => {
                const sla = getSLAIndicator(task.dueDate)
                return (
                  <Link
                    key={task.id}
                    href={`/production/${task.id}`}
                    className={`block bg-white rounded-lg shadow hover:shadow-md transition-all border-l-4 ${
                      task.status === 'IN_PROGRESS' ? 'border-[#2b3b82]' :
                      task.status === 'IN_REVIEW' ? 'border-amber-500' :
                      task.status === 'ON_HOLD' ? 'border-red-500' :
                      'border-slate-400'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
                              {statusLabels[task.status]}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.brief.priority]}`}>
                              {priorityLabels[task.brief.priority]}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: (task.brief.club.brand.primaryColor || '#888') + '20',
                                color: task.brief.club.brand.primaryColor || '#888',
                              }}
                            >
                              {task.brief.club.brand.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              {task.brief.club.name}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {task.brief.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Szablon: {task.brief.template.name}</span>
                            {task.assignee && (
                              <>
                                <span>•</span>
                                <span>Przypisany: {task.assignee.name}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>Zlecający: {task.brief.createdBy.name}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-medium ${sla.color}`}>
                            {formatDate(task.dueDate)}
                          </p>
                          <p className={`text-xs ${sla.color}`}>{sla.text}</p>
                          <span className="inline-block mt-2 px-3 py-1 bg-[#2b3b82] text-white font-medium rounded text-sm">
                            Otwórz →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}

        {/* CLUB_MANAGER: User's briefs */}
        {user.role === 'CLUB_MANAGER' && (
          <div className="space-y-3">
            {userBriefs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-5xl mb-4">📝</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak briefów</h2>
                <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych briefów.</p>
                <Link
                  href="/briefs/new"
                  className="inline-flex items-center px-4 py-2 bg-[#daff47] text-[#2b3b82] font-semibold rounded-lg hover:bg-[#c5eb3d] transition-colors"
                >
                  + Utwórz pierwszy brief
                </Link>
              </div>
            ) : (
              userBriefs.map((brief) => {
                const sla = getSLAIndicator(brief.deadline)
                return (
                  <Link
                    key={brief.id}
                    href={`/briefs/${brief.id}`}
                    className={`block bg-white rounded-lg shadow hover:shadow-md transition-all border-l-4 ${
                      brief.status === 'APPROVED' ? 'border-emerald-500' :
                      brief.status === 'REJECTED' ? 'border-red-500' :
                      brief.status === 'CHANGES_REQUESTED' ? 'border-amber-500' :
                      brief.status === 'SUBMITTED' ? 'border-[#2b3b82]' :
                      'border-slate-300'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs text-gray-500 font-mono">{brief.code}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[brief.status]}`}>
                              {statusLabels[brief.status]}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[brief.priority]}`}>
                              {priorityLabels[brief.priority]}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: (brief.club.brand.primaryColor || '#888') + '20',
                                color: brief.club.brand.primaryColor || '#888',
                              }}
                            >
                              {brief.club.brand.name}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {brief.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {brief.context || 'Brak opisu'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Szablon: {brief.template.name}</span>
                            <span>•</span>
                            <span>Klub: {brief.club.name}</span>
                            <span>•</span>
                            <span>Aktualizacja: {formatRelativeTime(brief.updatedAt)}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-medium ${sla.color}`}>
                            {formatDate(brief.deadline)}
                          </p>
                          <p className={`text-xs ${sla.color}`}>{sla.text}</p>
                          <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded text-sm">
                            Szczegóły →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}

        {/* ADMIN: Quick links */}
        {user.role === 'ADMIN' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/clubs"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#2b3b82]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🏢 Kluby</h3>
              <p className="text-sm text-gray-500">Zarządzaj klubami i przypisaniami</p>
            </Link>
            <Link
              href="/admin/regions"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#2b3b82]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🗺️ Regiony</h3>
              <p className="text-sm text-gray-500">Zarządzaj regionami</p>
            </Link>
            <Link
              href="/admin/users"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#2b3b82]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">👥 Użytkownicy</h3>
              <p className="text-sm text-gray-500">Zarządzaj użytkownikami i rolami</p>
            </Link>
            <Link
              href="/admin/templates"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#2b3b82]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Szablony</h3>
              <p className="text-sm text-gray-500">Zarządzaj szablonami briefów</p>
            </Link>
            <Link
              href="/admin/focus"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#daff47]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Cele sprzedażowe</h3>
              <p className="text-sm text-gray-500">Definiuj focusy i priorytety</p>
            </Link>
            <Link
              href="/statistics"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-emerald-500"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Statystyki</h3>
              <p className="text-sm text-gray-500">Przeglądaj raporty i metryki</p>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
