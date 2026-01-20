import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Roles that can access strategy documents
const STRATEGY_ROLES = ['ADMIN', 'REGIONAL_DIRECTOR', 'CMO']

// Validation schema for creating/updating strategy documents
const strategyDocumentSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany').max(200),
  description: z.string().max(1000).nullable().optional(),
  type: z.enum([
    'BRAND_GUIDELINES',
    'COMMUNICATION_STRATEGY',
    'QUARTERLY_GOALS',
    'ANNUAL_PLAN',
    'POLICY',
    'OTHER',
  ]),
  scope: z.enum(['GLOBAL', 'BRAND', 'REGION']).default('GLOBAL'),
  brandId: z.string().nullable().optional(),
  regionId: z.string().nullable().optional(),
  content: z.string().min(1, 'Treść dokumentu jest wymagana'),
  fileUrl: z.string().url().nullable().optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().nullable().optional(),
  isActive: z.boolean().default(true),
})

// GET /api/admin/strategy - List all strategy documents
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role permissions
    if (!STRATEGY_ROLES.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Brak uprawnień do zarządzania dokumentami strategicznymi' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const scope = searchParams.get('scope')
    const brandId = searchParams.get('brandId')
    const regionId = searchParams.get('regionId')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: Record<string, unknown> = {}

    if (type) where.type = type
    if (scope) where.scope = scope
    if (brandId) where.brandId = brandId
    if (regionId) where.regionId = regionId
    if (activeOnly) where.isActive = true

    // Regional Directors can only see documents for their regions
    if (session.user.role === 'REGIONAL_DIRECTOR') {
      const userClubs = await prisma.userClub.findMany({
        where: { userId: session.user.id },
        include: { club: { select: { regionId: true } } },
      })
      const regionIds = [...new Set(userClubs.map(uc => uc.club.regionId))]

      where.OR = [
        { scope: 'GLOBAL' },
        { scope: 'REGION', regionId: { in: regionIds } },
        { scope: 'BRAND' }, // Brand docs are visible to all
      ]
    }

    const documents = await prisma.strategyDocument.findMany({
      where,
      include: {
        brand: { select: { id: true, name: true } },
        region: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching strategy documents:', error)
    return NextResponse.json(
      { error: 'Nie udało się pobrać dokumentów strategicznych' },
      { status: 500 }
    )
  }
}

// POST /api/admin/strategy - Create a new strategy document
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role permissions
    if (!STRATEGY_ROLES.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Brak uprawnień do tworzenia dokumentów strategicznych' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validated = strategyDocumentSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Błąd walidacji', details: validated.error.errors },
        { status: 400 }
      )
    }

    const data = validated.data

    // Validate scope references
    if (data.scope === 'BRAND' && !data.brandId) {
      return NextResponse.json(
        { error: 'Dla zakresu BRAND należy wybrać markę' },
        { status: 400 }
      )
    }
    if (data.scope === 'REGION' && !data.regionId) {
      return NextResponse.json(
        { error: 'Dla zakresu REGION należy wybrać region' },
        { status: 400 }
      )
    }

    // Regional Directors can only create docs for their regions
    if (session.user.role === 'REGIONAL_DIRECTOR' && data.scope !== 'REGION') {
      return NextResponse.json(
        { error: 'Dyrektorzy regionalni mogą tworzyć tylko dokumenty regionalne' },
        { status: 403 }
      )
    }

    const document = await prisma.strategyDocument.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        scope: data.scope,
        brandId: data.scope === 'BRAND' ? data.brandId : null,
        regionId: data.scope === 'REGION' ? data.regionId : null,
        content: data.content,
        fileUrl: data.fileUrl || null,
        validFrom: data.validFrom || new Date(),
        validUntil: data.validUntil || null,
        isActive: data.isActive,
        createdById: session.user.id,
      },
      include: {
        brand: { select: { id: true, name: true } },
        region: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'STRATEGY_DOCUMENT_CREATED',
        details: { documentId: document.id, title: document.title, type: document.type },
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating strategy document:', error)
    return NextResponse.json(
      { error: 'Nie udało się utworzyć dokumentu strategicznego' },
      { status: 500 }
    )
  }
}
