import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BriefForm } from '@/components/briefs/brief-form'

export default async function EditBriefPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const { id } = await params

  // Get the brief
  const brief = await prisma.brief.findUnique({
    where: { id },
    include: {
      club: {
        include: {
          brand: true,
        },
      },
      template: true,
    },
  })

  if (!brief) {
    notFound()
  }

  // Only creator can edit, and only in DRAFT or CHANGES_REQUESTED status
  if (brief.createdById !== session.user.id) {
    redirect('/briefs')
  }

  if (!['DRAFT', 'CHANGES_REQUESTED'].includes(brief.status)) {
    redirect(`/briefs/${id}`)
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

  // Extract formats and customFormats from customFields
  const customFields = brief.customFields as Record<string, unknown> | null
  const formats = (customFields?.formats as string[]) || []
  const customFormats = (customFields?.customFormats as string[]) || []

  // Prepare initial data for the form
  const initialData = {
    clubId: brief.clubId,
    brandId: brief.brandId,
    templateIds: [brief.templateId], // Single template for edit
    title: brief.title,
    objective: brief.objective || '',
    kpiDescription: brief.kpiDescription || '',
    kpiTarget: brief.kpiTarget?.toString() || '',
    deadline: brief.deadline.toISOString().split('T')[0],
    startDate: brief.startDate?.toISOString().split('T')[0] || '',
    endDate: brief.endDate?.toISOString().split('T')[0] || '',
    context: brief.context,
    offerDetails: brief.offerDetails || '',
    legalCopy: brief.legalCopy || '',
    customFields: customFields || {},
    assetLinks: brief.assetLinks || [],
    formats,
    customFormats,
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/briefs/${id}`} className="text-white/70 hover:text-white">
              ← Powrot do briefu
            </Link>
            <div>
              <p className="text-white/70 text-sm">{brief.code}</p>
              <h1 className="text-2xl font-bold text-white">Edytuj brief</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Status info for CHANGES_REQUESTED */}
      {brief.status === 'CHANGES_REQUESTED' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-800 mb-1">Wymagane poprawki</h3>
            <p className="text-sm text-amber-700">
              Wprowadz zmiany zgodnie z uwagami walidatora i wyslij brief ponownie.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BriefForm
          clubs={clubs}
          templates={formattedTemplates}
          initialData={initialData}
          briefId={id}
          mode="edit"
        />
      </main>
    </div>
  )
}
