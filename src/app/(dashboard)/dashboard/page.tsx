import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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

  const roleLabels: Record<string, string> = {
    CLUB_MANAGER: 'Manager Klubu',
    VALIDATOR: 'Walidator Regionalny',
    PRODUCTION: 'Zespół Produkcji',
    ADMIN: 'Administrator',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            regional.fit
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name} ({roleLabels[user.role]})
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm text-red-600 hover:text-red-800"
              >
                Wyloguj
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Witaj, {user.name}!
          </h2>
          <p className="text-gray-600">
            Twoja rola: {roleLabels[user.role]}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {user.role === 'CLUB_MANAGER' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Twoje briefy</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.briefs}</p>
            </div>
          )}

          {user.role === 'VALIDATOR' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Do zatwierdzenia</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingApprovals}</p>
            </div>
          )}

          {user.role === 'PRODUCTION' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Zadania w toku</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.tasksInProgress}</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h3>
          <div className="flex flex-wrap gap-4">
            {user.role === 'CLUB_MANAGER' && (
              <Link
                href="/briefs/new"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Nowy brief
              </Link>
            )}

            {user.role === 'VALIDATOR' && (
              <Link
                href="/approvals"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Przejdź do zatwierdzeń
              </Link>
            )}

            {user.role === 'PRODUCTION' && (
              <Link
                href="/production"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Przejdź do kolejki
              </Link>
            )}

            {user.role === 'ADMIN' && (
              <>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Zarządzaj użytkownikami
                </Link>
                <Link
                  href="/admin/templates"
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Zarządzaj szablonami
                </Link>
              </>
            )}
          </div>
        </div>

        {/* User's clubs */}
        {user.clubs.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {user.role === 'CLUB_MANAGER' ? 'Twoje kluby' : 'Przypisane kluby'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.clubs.map((uc) => (
                <div
                  key={uc.clubId}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <h4 className="font-medium text-gray-900">{uc.club.name}</h4>
                  <p className="text-sm text-gray-500">{uc.club.city}</p>
                  <div className="mt-2 flex gap-2">
                    <span
                      className="inline-block px-2 py-1 text-xs rounded"
                      style={{ backgroundColor: (uc.club.brand.primaryColor || '#888') + '20', color: uc.club.brand.primaryColor || '#888' }}
                    >
                      {uc.club.brand.name}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
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
