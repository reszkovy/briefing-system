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
      brand: true,
      template: true,
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
    />
  )
}
