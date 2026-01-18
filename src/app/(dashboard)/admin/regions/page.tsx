import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { RegionList } from './RegionList'
import { LogoutButton } from '@/components/LogoutButton'

export default async function AdminRegionsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!currentUser || currentUser.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const regions = await prisma.region.findMany({
    include: {
      _count: {
        select: {
          clubs: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Zarządzanie regionami
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/clubs"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Kluby
            </Link>
            <Link
              href="/admin/users"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Użytkownicy
            </Link>
            <Link
              href="/admin/templates"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Szablony
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RegionList
          initialRegions={JSON.parse(JSON.stringify(regions))}
        />
      </main>
    </div>
  )
}
