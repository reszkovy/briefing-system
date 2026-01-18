import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { approvalActionSchema } from '@/lib/validations/brief'

// POST /api/approvals - Create approval decision
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'VALIDATOR') {
      return NextResponse.json(
        { error: 'Tylko walidator może zatwierdzać briefy' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validated = approvalActionSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.errors },
        { status: 400 }
      )
    }

    const { briefId, decision, notes, priority, slaDays } = validated.data

    // Get the brief
    const brief = await prisma.brief.findUnique({
      where: { id: briefId },
      include: {
        template: true,
        createdBy: true,
      },
    })

    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    // Check if validator has access to this club
    const hasAccess = await prisma.userClub.findFirst({
      where: {
        userId: session.user.id,
        clubId: brief.clubId,
      },
    })

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Nie masz dostępu do tego klubu' },
        { status: 403 }
      )
    }

    // Check if brief is in correct status
    if (brief.status !== 'SUBMITTED') {
      return NextResponse.json(
        { error: 'Brief nie oczekuje na zatwierdzenie' },
        { status: 400 }
      )
    }

    // Create approval record
    const approval = await prisma.approval.create({
      data: {
        briefId,
        validatorId: session.user.id,
        decision,
        notes: notes || null,
      },
    })

    // Update brief status based on decision
    let newStatus: 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED'
    if (decision === 'APPROVED') {
      newStatus = 'APPROVED'
    } else if (decision === 'CHANGES_REQUESTED') {
      newStatus = 'CHANGES_REQUESTED'
    } else {
      newStatus = 'REJECTED'
    }

    await prisma.brief.update({
      where: { id: briefId },
      data: {
        status: newStatus,
        priority: priority || brief.priority,
      },
    })

    // If approved, create production task
    if (decision === 'APPROVED') {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + (slaDays || brief.template.defaultSLADays))

      await prisma.productionTask.create({
        data: {
          briefId,
          status: 'QUEUED',
          slaDays: slaDays || brief.template.defaultSLADays,
          dueDate,
        },
      })

      // Notify production team
      const productionUsers = await prisma.user.findMany({
        where: { role: 'PRODUCTION' },
      })

      await prisma.notification.createMany({
        data: productionUsers.map((u) => ({
          userId: u.id,
          type: 'NEW_TASK',
          title: 'Nowe zlecenie w kolejce',
          message: `Brief "${brief.title}" został zatwierdzony i czeka na realizację.`,
          linkUrl: `/production`,
        })),
      })
    }

    // Notify the brief author
    await prisma.notification.create({
      data: {
        userId: brief.createdById,
        type:
          decision === 'APPROVED'
            ? 'BRIEF_APPROVED'
            : decision === 'CHANGES_REQUESTED'
            ? 'CHANGES_REQUESTED'
            : 'BRIEF_REJECTED',
        title:
          decision === 'APPROVED'
            ? 'Brief zatwierdzony'
            : decision === 'CHANGES_REQUESTED'
            ? 'Wymagane poprawki'
            : 'Brief odrzucony',
        message:
          decision === 'APPROVED'
            ? `Twój brief "${brief.title}" został zatwierdzony i przekazany do realizacji.`
            : decision === 'CHANGES_REQUESTED'
            ? `Twój brief "${brief.title}" wymaga poprawek: ${notes || ''}`
            : `Twój brief "${brief.title}" został odrzucony: ${notes || ''}`,
        linkUrl: `/briefs/${briefId}`,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        briefId,
        action: `APPROVAL_${decision}`,
        details: { decision, notes, priority, slaDays },
      },
    })

    return NextResponse.json({ success: true, data: approval }, { status: 201 })
  } catch (error) {
    console.error('Error creating approval:', error)
    return NextResponse.json(
      { error: 'Failed to create approval' },
      { status: 500 }
    )
  }
}
