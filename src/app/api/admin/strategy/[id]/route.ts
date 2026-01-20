import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Roles that can access strategy documents
const STRATEGY_ROLES = ['ADMIN', 'REGIONAL_DIRECTOR', 'CMO']

// Validation schema for updating strategy documents
const updateStrategySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  type: z.enum([
    'BRAND_GUIDELINES',
    'COMMUNICATION_STRATEGY',
    'QUARTERLY_GOALS',
    'ANNUAL_PLAN',
    'POLICY',
    'OTHER',
  ]).optional(),
  scope: z.enum(['GLOBAL', 'BRAND', 'REGION']).optional(),
  brandId: z.string().nullable().optional(),
  regionId: z.string().nullable().optional(),
  content: z.string().min(1).optional(),
  fileUrl: z.string().url().nullable().optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().nullable().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/admin/strategy/[id] - Get a single strategy document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role permissions
    if (!STRATEGY_ROLES.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Brak uprawnień do dokumentów strategicznych' },
        { status: 403 }
      )
    }

    const { id } = await params

    const document = await prisma.strategyDocument.findUnique({
      where: { id },
      include: {
        brand: { select: { id: true, name: true } },
        region: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Dokument nie został znaleziony' },
        { status: 404 }
      )
    }

    // Regional Directors can only see their region's documents or global/brand docs
    if (session.user.role === 'REGIONAL_DIRECTOR' && document.scope === 'REGION') {
      const userClubs = await prisma.userClub.findMany({
        where: { userId: session.user.id },
        include: { club: { select: { regionId: true } } },
      })
      const regionIds = [...new Set(userClubs.map(uc => uc.club.regionId))]

      if (!regionIds.includes(document.regionId || '')) {
        return NextResponse.json(
          { error: 'Brak dostępu do tego dokumentu' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching strategy document:', error)
    return NextResponse.json(
      { error: 'Nie udało się pobrać dokumentu' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/strategy/[id] - Update a strategy document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role permissions
    if (!STRATEGY_ROLES.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Brak uprawnień do edycji dokumentów strategicznych' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Check if document exists
    const existingDoc = await prisma.strategyDocument.findUnique({
      where: { id },
    })

    if (!existingDoc) {
      return NextResponse.json(
        { error: 'Dokument nie został znaleziony' },
        { status: 404 }
      )
    }

    // Regional Directors can only edit their region's documents
    if (session.user.role === 'REGIONAL_DIRECTOR') {
      if (existingDoc.scope !== 'REGION') {
        return NextResponse.json(
          { error: 'Dyrektorzy regionalni mogą edytować tylko dokumenty regionalne' },
          { status: 403 }
        )
      }

      const userClubs = await prisma.userClub.findMany({
        where: { userId: session.user.id },
        include: { club: { select: { regionId: true } } },
      })
      const regionIds = [...new Set(userClubs.map(uc => uc.club.regionId))]

      if (!regionIds.includes(existingDoc.regionId || '')) {
        return NextResponse.json(
          { error: 'Brak dostępu do tego dokumentu' },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const validated = updateStrategySchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Błąd walidacji', details: validated.error.errors },
        { status: 400 }
      )
    }

    const data = validated.data

    // Validate scope references
    const newScope = data.scope || existingDoc.scope
    if (newScope === 'BRAND' && data.scope && !data.brandId) {
      return NextResponse.json(
        { error: 'Dla zakresu BRAND należy wybrać markę' },
        { status: 400 }
      )
    }
    if (newScope === 'REGION' && data.scope && !data.regionId) {
      return NextResponse.json(
        { error: 'Dla zakresu REGION należy wybrać region' },
        { status: 400 }
      )
    }

    // Increment version if content changed
    const newVersion = data.content && data.content !== existingDoc.content
      ? existingDoc.version + 1
      : existingDoc.version

    const document = await prisma.strategyDocument.update({
      where: { id },
      data: {
        ...data,
        brandId: data.scope === 'BRAND' ? data.brandId : (data.scope === 'GLOBAL' || data.scope === 'REGION' ? null : undefined),
        regionId: data.scope === 'REGION' ? data.regionId : (data.scope === 'GLOBAL' || data.scope === 'BRAND' ? null : undefined),
        version: newVersion,
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
        action: 'STRATEGY_DOCUMENT_UPDATED',
        details: { documentId: document.id, title: document.title, version: newVersion },
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error updating strategy document:', error)
    return NextResponse.json(
      { error: 'Nie udało się zaktualizować dokumentu' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/strategy/[id] - Delete a strategy document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN and CMO can delete documents
    if (!['ADMIN', 'CMO'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Brak uprawnień do usuwania dokumentów strategicznych' },
        { status: 403 }
      )
    }

    const { id } = await params

    const existingDoc = await prisma.strategyDocument.findUnique({
      where: { id },
    })

    if (!existingDoc) {
      return NextResponse.json(
        { error: 'Dokument nie został znaleziony' },
        { status: 404 }
      )
    }

    await prisma.strategyDocument.delete({ where: { id } })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'STRATEGY_DOCUMENT_DELETED',
        details: { documentId: id, title: existingDoc.title },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting strategy document:', error)
    return NextResponse.json(
      { error: 'Nie udało się usunąć dokumentu' },
      { status: 500 }
    )
  }
}
