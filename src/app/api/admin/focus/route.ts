import { NextResponse } from 'next/server'
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

    if (!currentUser || !['ADMIN', 'VALIDATOR'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const focuses = await prisma.salesFocus.findMany({
      include: {
        brand: true,
        region: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ startDate: 'desc' }],
    })

    return NextResponse.json(focuses)
  } catch (error) {
    console.error('Error fetching focuses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!currentUser || !['ADMIN', 'VALIDATOR'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, period, startDate, endDate, brandId, regionId, isActive } = body

    if (!title || !period || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Tytuł, okres, data początku i końca są wymagane' },
        { status: 400 }
      )
    }

    const focus = await prisma.salesFocus.create({
      data: {
        title,
        description: description || null,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        brandId: brandId || null,
        regionId: regionId || null,
        createdById: currentUser.id,
        isActive: isActive !== false,
      },
      include: {
        brand: true,
        region: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(focus, { status: 201 })
  } catch (error) {
    console.error('Error creating focus:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
