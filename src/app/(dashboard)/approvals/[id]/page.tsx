import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { TemplateSchema } from '@/types'
import { ApprovalDetailClient } from './approval-detail-client'

export default async function ApprovalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'VALIDATOR') {
    redirect('/dashboard')
  }

  const { id } = await params

  // Get clubs the validator has access to
  const userClubs = await prisma.userClub.findMany({
    where: { userId: session.user.id },
    select: { clubId: true },
  })
  const clubIds = userClubs.map((uc) => uc.clubId)

  const brief = await prisma.brief.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      club: {
        select: {
          id: true,
          name: true,
          city: true,
          tier: true,
          brand: true,
          region: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          primaryColor: true,
        },
      },
      template: {
        select: {
          id: true,
          name: true,
          code: true,
          defaultSLADays: true,
          requiredFields: true,
        },
      },
      approvals: {
        include: {
          validator: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!brief) {
    notFound()
  }

  // Check if validator has access to this club
  const hasAccess = await prisma.userClub.findFirst({
    where: {
      userId: session.user.id,
      clubId: brief.clubId,
    },
  })

  if (!hasAccess) {
    redirect('/approvals')
  }

  const canApprove = brief.status === 'SUBMITTED'
  const customFields = brief.customFields as Record<string, unknown> | null
  const templateSchema = brief.template.requiredFields as unknown as TemplateSchema

  // Get all pending briefs for keyboard navigation
  const pendingBriefs = await prisma.brief.findMany({
    where: {
      status: 'SUBMITTED',
      clubId: { in: clubIds },
    },
    select: {
      id: true,
      code: true,
      title: true,
    },
    orderBy: { submittedAt: 'desc' },
  })

  // Find current index and adjacent briefs
  const currentIndex = pendingBriefs.findIndex((b) => b.id === id)
  const navigationData = {
    currentIndex,
    total: pendingBriefs.length,
    prevBriefId: currentIndex > 0 ? pendingBriefs[currentIndex - 1].id : null,
    nextBriefId: currentIndex < pendingBriefs.length - 1 ? pendingBriefs[currentIndex + 1].id : null,
    allBriefs: pendingBriefs.map((b) => ({ id: b.id, code: b.code, title: b.title })),
  }

  // Get active strategy documents for alignment check
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

  // Serialize the brief data for client component
  const briefData = {
    ...brief,
    deadline: brief.deadline.toISOString(),
    createdAt: brief.createdAt.toISOString(),
    updatedAt: brief.updatedAt.toISOString(),
    submittedAt: brief.submittedAt?.toISOString() || null,
    startDate: brief.startDate?.toISOString() || null,
    endDate: brief.endDate?.toISOString() || null,
    estimatedCost: brief.estimatedCost ? Number(brief.estimatedCost) : null,
    kpiTarget: brief.kpiTarget ? Number(brief.kpiTarget) : null,
    approvals: brief.approvals.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  }

  return (
    <ApprovalDetailClient
      brief={briefData}
      canApprove={canApprove}
      customFields={customFields}
      templateSchema={templateSchema}
      strategyDocuments={formattedStrategy}
      navigation={navigationData}
    />
  )
}
