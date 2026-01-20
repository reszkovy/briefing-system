import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StrategyDocumentList } from './StrategyDocumentList'

// Roles that can access strategy documents
const STRATEGY_ROLES = ['ADMIN', 'REGIONAL_DIRECTOR', 'CMO']

export default async function StrategyPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Check role permissions
  if (!STRATEGY_ROLES.includes(session.user.role)) {
    redirect('/dashboard')
  }

  // Get all data needed for the page
  const [documents, brands, regions] = await Promise.all([
    prisma.strategyDocument.findMany({
      include: {
        brand: { select: { id: true, name: true } },
        region: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
    }),
    prisma.brand.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.region.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  const formattedDocuments = documents.map((doc) => ({
    ...doc,
    validFrom: doc.validFrom.toISOString(),
    validUntil: doc.validUntil?.toISOString() || null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-white/70 hover:text-white">
                ← Panel admina
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Dokumenty strategiczne</h1>
                <p className="text-white/70 text-sm">Zarządzaj kontekstem strategicznym dla systemu</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StrategyDocumentList
          initialDocuments={formattedDocuments}
          brands={brands}
          regions={regions}
          userRole={session.user.role}
        />
      </main>
    </div>
  )
}
