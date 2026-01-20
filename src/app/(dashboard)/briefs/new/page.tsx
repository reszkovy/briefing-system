import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BriefForm } from '@/components/briefs/brief-form'

export default async function NewBriefPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Only CLUB_MANAGER can create briefs
  if (session.user.role !== 'CLUB_MANAGER') {
    redirect('/dashboard')
  }

  // Get user's clubs (only clubs they manage)
  const userClubs = await prisma.userClub.findMany({
    where: {
      userId: session.user.id,
      isManager: true,
    },
    include: {
      club: {
        include: {
          brand: true,
        },
      },
    },
  })

  const clubs = userClubs.map((uc) => ({
    id: uc.club.id,
    name: uc.club.name,
    city: uc.club.city,
    brand: {
      id: uc.club.brand.id,
      name: uc.club.brand.name,
      primaryColor: uc.club.brand.primaryColor,
    },
  }))

  // Get all active templates
  const templates = await prisma.requestTemplate.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  // Get active strategy documents for highlighting goals
  const strategyDocuments = await prisma.strategyDocument.findMany({
    where: { isActive: true },
    include: {
      brand: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const formattedStrategy = strategyDocuments.map((doc) => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    scope: doc.scope,
    content: doc.content,
    brandId: doc.brandId,
    brandName: doc.brand?.name || null,
  }))

  const formattedTemplates = templates.map((t) => ({
    id: t.id,
    name: t.name,
    code: t.code,
    description: t.description,
    defaultSLADays: t.defaultSLADays,
    requiredFields: t.requiredFields as {
      type: 'object'
      required?: string[]
      properties: Record<string, unknown>
    },
  }))

  if (clubs.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f7fa]">
        <header className="bg-[#2b3b82] shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/dashboard" className="text-white/70 hover:text-white">
              ← Dashboard
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Brak przypisanych klubow
            </h2>
            <p className="text-gray-500">
              Nie masz przypisanych klubow do zarzadzania. Skontaktuj sie z administratorem.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/briefs" className="text-white/70 hover:text-white">
              ← Moje briefy
            </Link>
            <h1 className="text-2xl font-bold text-white">Nowy brief</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BriefForm clubs={clubs} templates={formattedTemplates} strategyDocuments={formattedStrategy} />
      </main>
    </div>
  )
}
