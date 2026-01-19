import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/LogoutButton'

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  // Get counts for dashboard
  const [clubsCount, usersCount, templatesCount, briefsCount, regionsCount] = await Promise.all([
    prisma.club.count(),
    prisma.user.count(),
    prisma.briefTemplate.count(),
    prisma.brief.count(),
    prisma.region.count(),
  ])

  // Get recent briefs
  const recentBriefs = await prisma.brief.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      club: { include: { brand: true } },
      createdBy: { select: { name: true } },
    },
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
            <h1 className="text-xl font-semibold text-white">Panel Administratora</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2b3b82]">
            <p className="text-2xl font-bold text-[#2b3b82]">{clubsCount}</p>
            <p className="text-sm text-gray-500">Kluby</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2b3b82]">
            <p className="text-2xl font-bold text-[#2b3b82]">{regionsCount}</p>
            <p className="text-sm text-gray-500">Regiony</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2b3b82]">
            <p className="text-2xl font-bold text-[#2b3b82]">{usersCount}</p>
            <p className="text-sm text-gray-500">Uzytkownicy</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#2b3b82]">
            <p className="text-2xl font-bold text-[#2b3b82]">{templatesCount}</p>
            <p className="text-sm text-gray-500">Szablony</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#daff47]">
            <p className="text-2xl font-bold text-[#2b3b82]">{briefsCount}</p>
            <p className="text-sm text-gray-500">Briefy</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/clubs"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#2b3b82] group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🏢</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2b3b82]">Kluby</h3>
                <p className="text-sm text-gray-500">Zarzadzaj klubami i przypisaniami</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/regions"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#2b3b82] group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🗺️</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2b3b82]">Regiony</h3>
                <p className="text-sm text-gray-500">Zarzadzaj regionami</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#2b3b82] group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">👥</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2b3b82]">Uzytkownicy</h3>
                <p className="text-sm text-gray-500">Zarzadzaj uzytkownikami i rolami</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/templates"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#2b3b82] group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">📋</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2b3b82]">Szablony</h3>
                <p className="text-sm text-gray-500">Zarzadzaj szablonami briefow</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/focus"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-[#daff47] group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2b3b82]">Cele sprzedazowe</h3>
                <p className="text-sm text-gray-500">Definiuj focusy i priorytety</p>
              </div>
            </div>
          </Link>
          <Link
            href="/statistics"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border-l-4 border-emerald-500 group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2b3b82]">Statystyki</h3>
                <p className="text-sm text-gray-500">Przegladaj raporty i metryki</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent briefs */}
        {recentBriefs.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Ostatnie briefy</h2>
            </div>
            <div className="divide-y">
              {recentBriefs.map((brief) => (
                <Link
                  key={brief.id}
                  href={`/briefs/${brief.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{brief.title}</p>
                      <p className="text-sm text-gray-500">
                        {brief.club.name} • {brief.createdBy.name}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: (brief.club.brand.primaryColor || '#888') + '20',
                        color: brief.club.brand.primaryColor || '#888',
                      }}
                    >
                      {brief.club.brand.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
