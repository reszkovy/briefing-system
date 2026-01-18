import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createBriefSchema, submitBriefSchema } from '@/lib/validations/brief'

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

    // Generate brief code
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
    const code = `BRIEF-${year}-${String(nextNumber).padStart(4, '0')}`

    // Create the brief
    const brief = await prisma.brief.create({
      data: {
        code,
        createdById: session.user.id,
        clubId: validated.data.clubId,
        brandId: validated.data.brandId,
        templateId: validated.data.templateId,
        title: validated.data.title,
        objective: validated.data.objective,
        kpiDescription: validated.data.kpiDescription,
        kpiTarget: validated.data.kpiTarget || null,
        deadline: new Date(validated.data.deadline),
        startDate: validated.data.startDate ? new Date(validated.data.startDate) : null,
        endDate: validated.data.endDate ? new Date(validated.data.endDate) : null,
        context: validated.data.context,
        offerDetails: validated.data.offerDetails || null,
        legalCopy: validated.data.legalCopy || null,
        customFields: validated.data.customFields || {},
        assetLinks: validated.data.assetLinks || [],
        status: action === 'submit' ? 'SUBMITTED' : 'DRAFT',
        submittedAt: action === 'submit' ? new Date() : null,
      },
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
        action: action === 'submit' ? 'BRIEF_SUBMITTED' : 'BRIEF_CREATED',
        details: { title: brief.title, code: brief.code },
      },
    })

    // If submitted, create notification for validators
    if (action === 'submit') {
      // Find validators for this club
      const validators = await prisma.userClub.findMany({
        where: {
          clubId: brief.clubId,
          isManager: false,
          user: { role: 'VALIDATOR' },
        },
        include: { user: true },
      })

      // Create notifications
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

    return NextResponse.json({ success: true, data: brief }, { status: 201 })
  } catch (error) {
    console.error('Error creating brief:', error)
    return NextResponse.json(
      { error: 'Failed to create brief' },
      { status: 500 }
    )
  }
}
