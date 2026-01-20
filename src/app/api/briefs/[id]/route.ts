import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateBriefSchema, submitBriefSchema } from '@/lib/validations/brief'

// GET /api/briefs/[id] - Get single brief
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
            role: true,
          },
        },
        club: {
          include: {
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
                email: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        productionTask: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            deliverables: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    // Check access
    const hasAccess =
      brief.createdById === session.user.id ||
      session.user.role === 'ADMIN' ||
      session.user.role === 'PRODUCTION' ||
      (session.user.role === 'VALIDATOR' &&
        (await prisma.userClub.findFirst({
          where: { userId: session.user.id, clubId: brief.clubId },
        })))

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(brief)
  } catch (error) {
    console.error('Error fetching brief:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brief' },
      { status: 500 }
    )
  }
}

// PUT /api/briefs/[id] - Update brief
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, validatorEdit, ...data } = body

    // Find existing brief
    const existingBrief = await prisma.brief.findUnique({
      where: { id },
      include: {
        club: true,
      },
    })

    if (!existingBrief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    // Check permissions - validator can edit briefs in SUBMITTED status for their clubs
    const isAuthor = existingBrief.createdById === session.user.id
    let isValidatorForClub = false

    if (session.user.role === 'VALIDATOR') {
      const validatorAccess = await prisma.userClub.findFirst({
        where: {
          userId: session.user.id,
          clubId: existingBrief.clubId,
        },
      })
      isValidatorForClub = !!validatorAccess
    }

    // Determine if this is a validator edit
    const isValidatorEditing = validatorEdit && isValidatorForClub && existingBrief.status === 'SUBMITTED'

    // Check ownership for non-validator edits
    if (!isValidatorEditing && !isAuthor) {
      return NextResponse.json(
        { error: 'Tylko autor moze edytowac brief' },
        { status: 403 }
      )
    }

    // Check if brief can be edited
    // Validators can edit SUBMITTED briefs, authors can edit DRAFT or CHANGES_REQUESTED
    if (isValidatorEditing) {
      if (existingBrief.status !== 'SUBMITTED') {
        return NextResponse.json(
          { error: 'Walidator moze edytowac tylko briefy ze statusem SUBMITTED' },
          { status: 400 }
        )
      }
    } else {
      if (!['DRAFT', 'CHANGES_REQUESTED'].includes(existingBrief.status)) {
        return NextResponse.json(
          { error: 'Brief nie moze byc edytowany w obecnym statusie' },
          { status: 400 }
        )
      }
    }

    // Validate based on action
    const schema = action === 'submit' ? submitBriefSchema : updateBriefSchema
    const validated = schema.safeParse(data)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.errors },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {}

    if (validated.data.title !== undefined) updateData.title = validated.data.title
    if (validated.data.objective !== undefined) updateData.objective = validated.data.objective
    if (validated.data.deadline !== undefined) updateData.deadline = new Date(validated.data.deadline)
    if (validated.data.startDate !== undefined) updateData.startDate = validated.data.startDate ? new Date(validated.data.startDate) : null
    if (validated.data.endDate !== undefined) updateData.endDate = validated.data.endDate ? new Date(validated.data.endDate) : null
    if (validated.data.context !== undefined) updateData.context = validated.data.context
    if (validated.data.offerDetails !== undefined) updateData.offerDetails = validated.data.offerDetails
    if (validated.data.legalCopy !== undefined) updateData.legalCopy = validated.data.legalCopy
    if (validated.data.assetLinks !== undefined) updateData.assetLinks = validated.data.assetLinks

    // Decision Layer fields (CORE MODULE 1)
    if (validated.data.businessObjective !== undefined) updateData.businessObjective = validated.data.businessObjective
    if (validated.data.decisionContext !== undefined) updateData.decisionContext = validated.data.decisionContext
    if (validated.data.kpiDescription !== undefined) updateData.kpiDescription = validated.data.kpiDescription
    if (validated.data.kpiTarget !== undefined) updateData.kpiTarget = validated.data.kpiTarget

    // Policy engine fields
    if (validated.data.estimatedCost !== undefined) updateData.estimatedCost = validated.data.estimatedCost
    if (validated.data.isCrisisCommunication !== undefined) updateData.isCrisisCommunication = validated.data.isCrisisCommunication
    if (validated.data.confidenceLevel !== undefined) updateData.confidenceLevel = validated.data.confidenceLevel

    // Store formats and customFormats in customFields
    const customFieldsWithFormats = {
      ...(validated.data.customFields || {}),
      formats: validated.data.formats || [],
      customFormats: validated.data.customFormats || [],
    }
    updateData.customFields = customFieldsWithFormats

    // Update status if submitting
    if (action === 'submit') {
      updateData.status = 'SUBMITTED'
      updateData.submittedAt = new Date()
    }

    // Update the brief
    const brief = await prisma.brief.update({
      where: { id },
      data: updateData,
      include: {
        club: true,
        brand: true,
        template: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        briefId: brief.id,
        action: isValidatorEditing
          ? 'BRIEF_EDITED_BY_VALIDATOR'
          : action === 'submit'
            ? 'BRIEF_RESUBMITTED'
            : 'BRIEF_UPDATED',
        details: {
          title: brief.title,
          editedBy: isValidatorEditing ? 'validator' : 'author',
        },
      },
    })

    // If validator edited the brief, notify the author
    if (isValidatorEditing) {
      await prisma.notification.create({
        data: {
          userId: existingBrief.createdById,
          type: 'BRIEF_EDITED_BY_VALIDATOR',
          title: 'Brief zmodyfikowany przez walidatora',
          message: `Walidator wprowadzil zmiany w briefie "${brief.title}".`,
          linkUrl: `/briefs/${brief.id}`,
        },
      })
    }

    // If resubmitted, create notification for validators
    if (action === 'submit') {
      const validators = await prisma.userClub.findMany({
        where: {
          clubId: brief.clubId,
          isManager: false,
          user: { role: 'VALIDATOR' },
        },
      })

      await prisma.notification.createMany({
        data: validators.map((v) => ({
          userId: v.userId,
          type: 'BRIEF_RESUBMITTED',
          title: 'Brief po poprawkach',
          message: `Brief "${brief.title}" zostal ponownie wyslany do zatwierdzenia.`,
          linkUrl: `/briefs/${brief.id}`,
        })),
      })
    }

    return NextResponse.json({ success: true, data: brief })
  } catch (error) {
    console.error('Error updating brief:', error)
    return NextResponse.json(
      { error: 'Failed to update brief' },
      { status: 500 }
    )
  }
}

// DELETE /api/briefs/[id] - Delete/cancel brief
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const brief = await prisma.brief.findUnique({
      where: { id },
    })

    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    // Check ownership or admin
    if (brief.createdById !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only draft briefs can be deleted, others should be cancelled
    if (brief.status === 'DRAFT') {
      await prisma.brief.delete({ where: { id } })
    } else {
      await prisma.brief.update({
        where: { id },
        data: { status: 'CANCELLED' },
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        briefId: brief.status === 'DRAFT' ? null : brief.id,
        action: brief.status === 'DRAFT' ? 'BRIEF_DELETED' : 'BRIEF_CANCELLED',
        details: { title: brief.title, code: brief.code },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting brief:', error)
    return NextResponse.json(
      { error: 'Failed to delete brief' },
      { status: 500 }
    )
  }
}
