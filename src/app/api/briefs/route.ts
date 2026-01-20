import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createBriefSchema, submitBriefSchema } from '@/lib/validations/brief'
import { checkBriefPolicy, type BriefInput } from '@/lib/policy-engine'

// GET /api/briefs - Get briefs for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}

    // Filter by role
    if (session.user.role === 'CLUB_MANAGER') {
      where.createdById = session.user.id
    } else if (session.user.role === 'VALIDATOR') {
      // Get clubs this validator oversees
      const userClubs = await prisma.userClub.findMany({
        where: { userId: session.user.id },
        select: { clubId: true },
      })
      where.clubId = { in: userClubs.map((uc) => uc.clubId) }
    }

    if (status) {
      where.status = status
    }

    const [briefs, total] = await Promise.all([
      prisma.brief.findMany({
        where,
        include: {
          club: true,
          brand: true,
          template: true,
          productionTask: {
            select: { status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.brief.count({ where }),
    ])

    return NextResponse.json({
      items: briefs,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching briefs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch briefs' },
      { status: 500 }
    )
  }
}

// POST /api/briefs - Create a new brief
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CLUB_MANAGER') {
      return NextResponse.json(
        { error: 'Tylko manager klubu moze tworzyc briefy' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, ...data } = body

    // Verify user has access to this club
    const userClub = await prisma.userClub.findFirst({
      where: {
        userId: session.user.id,
        clubId: data.clubId,
        isManager: true,
      },
    })

    if (!userClub) {
      return NextResponse.json(
        { error: 'Nie masz uprawnien do tworzenia briefow dla tego klubu' },
        { status: 403 }
      )
    }

    // Validate based on action
    const schema = action === 'submit' ? submitBriefSchema : createBriefSchema
    const validated = schema.safeParse(data)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.errors },
        { status: 400 }
      )
    }

    // Get all templates that were selected
    const templates = await prisma.requestTemplate.findMany({
      where: { id: { in: validated.data.templateIds } },
    })

    // Get club info for policy check
    const club = await prisma.club.findUnique({
      where: { id: validated.data.clubId },
    })

    // Generate brief codes for all briefs
    const year = new Date().getFullYear()
    const lastBrief = await prisma.brief.findFirst({
      where: {
        code: { startsWith: `BRIEF-${year}-` },
      },
      orderBy: { code: 'desc' },
    })

    let nextNumber = 1
    if (lastBrief) {
      const lastNumber = parseInt(lastBrief.code.split('-')[2])
      nextNumber = lastNumber + 1
    }

    // Store formats and customFormats in customFields
    const customFieldsWithFormats = {
      ...(validated.data.customFields || {}),
      formats: validated.data.formats || [],
      customFormats: validated.data.customFormats || [],
    }

    // Create briefs for each selected template
    const createdBriefs = []
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i]
      const code = `BRIEF-${year}-${String(nextNumber + i).padStart(4, '0')}`

      // Add template code suffix to title if multiple templates
      const briefTitle = templates.length > 1
        ? `${validated.data.title} [${template.code}]`
        : validated.data.title

      // Run policy check
      const policyInput: BriefInput = {
        objective: validated.data.objective,
        deadline: new Date(validated.data.deadline),
        estimatedCost: validated.data.estimatedCost || 0,
        isCrisisCommunication: validated.data.isCrisisCommunication || false,
        formats: validated.data.formats || [],
        customFormats: validated.data.customFormats || [],
        templateCode: template.code,
        templateIsInternal: template.isInternal,
        templateIsBlacklisted: template.isBlacklisted,
        templateBlacklistReason: template.blacklistReason,
        clubTier: club?.tier || 'STANDARD',
        context: validated.data.context,
        title: briefTitle,
      }

      const policyResult = checkBriefPolicy(policyInput)

      // If auto-reject, return error
      if (action === 'submit' && policyResult.autoRejectReasons.length > 0) {
        return NextResponse.json({
          error: 'Brief odrzucony przez policy engine',
          reasons: policyResult.autoRejectReasons,
          policyResult,
        }, { status: 400 })
      }

      // If cannot submit, return error
      if (action === 'submit' && !policyResult.canSubmit) {
        return NextResponse.json({
          error: 'Brief nie moze byc wyslany',
          reasons: policyResult.rules.filter(r => !r.passed).map(r => r.message),
          policyResult,
        }, { status: 400 })
      }

      const brief = await prisma.brief.create({
        data: {
          code,
          createdById: session.user.id,
          clubId: validated.data.clubId,
          brandId: validated.data.brandId,
          templateId: template.id,
          title: briefTitle,
          // Decision Layer fields (CORE MODULE 1)
          businessObjective: validated.data.businessObjective || null,
          decisionContext: validated.data.decisionContext || null,
          kpiDescription: validated.data.kpiDescription || null,
          kpiTarget: validated.data.kpiTarget || null,
          // Legacy field
          objective: validated.data.objective || null,
          deadline: new Date(validated.data.deadline),
          startDate: validated.data.startDate ? new Date(validated.data.startDate) : null,
          endDate: validated.data.endDate ? new Date(validated.data.endDate) : null,
          context: validated.data.context,
          offerDetails: validated.data.offerDetails || null,
          legalCopy: validated.data.legalCopy || null,
          customFields: customFieldsWithFormats,
          assetLinks: validated.data.assetLinks || [],
          status: action === 'submit' ? 'SUBMITTED' : 'DRAFT',
          submittedAt: action === 'submit' ? new Date() : null,
          // Policy engine fields
          estimatedCost: validated.data.estimatedCost || null,
          isCrisisCommunication: validated.data.isCrisisCommunication || false,
          confidenceLevel: validated.data.confidenceLevel || null,
          policyCheckResult: policyResult,
          requiresOwnerApproval: policyResult.requiresOwnerApproval,
          ownerApprovalReason: policyResult.ownerApprovalReasons.join('; ') || null,
          priority: policyResult.suggestedPriority,
        },
        include: {
          club: true,
          brand: true,
          template: true,
        },
      })

      createdBriefs.push(brief)

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          briefId: brief.id,
          action: action === 'submit' ? 'BRIEF_SUBMITTED' : 'BRIEF_CREATED',
          details: { title: brief.title, code: brief.code },
        },
      })

      // If submitted, create notification for validators
      if (action === 'submit') {
        const validators = await prisma.userClub.findMany({
          where: {
            clubId: brief.clubId,
            isManager: false,
            user: { role: 'VALIDATOR' },
          },
          include: { user: true },
        })

        await prisma.notification.createMany({
          data: validators.map((v) => ({
            userId: v.userId,
            type: 'BRIEF_SUBMITTED',
            title: 'Nowy brief do zatwierdzenia',
            message: `Brief "${brief.title}" czeka na Twoja decyzje.`,
            linkUrl: `/briefs/${brief.id}`,
          })),
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: createdBriefs.length === 1 ? createdBriefs[0] : createdBriefs,
      count: createdBriefs.length,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating brief:', error)
    return NextResponse.json(
      { error: 'Failed to create brief' },
      { status: 500 }
    )
  }
}
