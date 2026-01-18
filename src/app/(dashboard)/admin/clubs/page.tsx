import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ClubList } from './ClubList'
import { LogoutButton } from '@/components/LogoutButton'

export default async function AdminClubsPage() {
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

  const clubs = await prisma.club.findMany({
    include: {
      brand: true,
      region: true,
      users: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      _count: {
        select: {
          briefs: true,
        },
      },
    },
    orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
  })

  const regions = await prisma.region.findMany({
    orderBy: { name: 'asc' },
  })

  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  })

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ['CLUB_MANAGER', 'VALIDATOR'],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: 'asc' },
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
            <h1 className="text-2xl font-bold text-white">
              Zarządzanie klubami
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/regions"
              className="text-sm text-white/70 hover:text-white"
            >
              Regiony
            </Link>
            <Link
              href="/admin/users"
              className="text-sm text-white/70 hover:text-white"
            >
              Użytkownicy
            </Link>
            <Link
              href="/admin/templates"
              className="text-sm text-white/70 hover:text-white"
            >
              Szablony
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClubList
          initialClubs={JSON.parse(JSON.stringify(clubs))}
          regions={JSON.parse(JSON.stringify(regions))}
          brands={JSON.parse(JSON.stringify(brands))}
          users={JSON.parse(JSON.stringify(users))}
        />
      </main>
    </div>
  )
}
