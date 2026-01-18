import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const templates = await prisma.requestTemplate.findMany({
      include: {
        brand: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, code, description, brandId, defaultSLADays, isActive, requiredFields } = body

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Nazwa i kod są wymagane' },
        { status: 400 }
      )
    }

    // Check if code exists
    const existingTemplate = await prisma.requestTemplate.findUnique({
      where: { code },
    })

    if (existingTemplate) {
      return NextResponse.json(
        { error: 'Szablon z tym kodem już istnieje' },
        { status: 400 }
      )
    }

    const template = await prisma.requestTemplate.create({
      data: {
        name,
        code,
        description,
        brandId: brandId || null,
        defaultSLADays: defaultSLADays || 5,
        isActive: isActive ?? true,
        requiredFields: requiredFields || null,
      },
      include: {
        brand: true,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
