import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const club = await prisma.club.findUnique({
      where: { id: params.id },
      include: {
        brand: true,
        region: true,
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    })

    if (!club) {
      return NextResponse.json({ error: 'Klub nie znaleziony' }, { status: 404 })
    }

    return NextResponse.json(club)
  } catch (error) {
    console.error('Error fetching club:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { name, code, city, address, regionId, brandId } = body

    if (!name || !code || !city || !regionId || !brandId) {
      return NextResponse.json(
        { error: 'Nazwa, kod, miasto, region i sieć są wymagane' },
        { status: 400 }
      )
    }

    // Check if code is unique (excluding current club)
    const existingClub = await prisma.club.findFirst({
      where: {
        code,
        NOT: { id: params.id },
      },
    })

    if (existingClub) {
      return NextResponse.json(
        { error: 'Klub o takim kodzie już istnieje' },
        { status: 400 }
      )
    }

    const club = await prisma.club.update({
      where: { id: params.id },
      data: {
        name,
        code: code.toUpperCase(),
        city,
        address: address || null,
        regionId,
        brandId,
      },
      include: {
        brand: true,
        region: true,
      },
    })

    return NextResponse.json(club)
  } catch (error) {
    console.error('Error updating club:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if club has briefs
    const briefsCount = await prisma.brief.count({
      where: { clubId: params.id },
    })

    if (briefsCount > 0) {
      return NextResponse.json(
        { error: `Nie można usunąć klubu, który ma przypisane briefy (${briefsCount})` },
        { status: 400 }
      )
    }

    await prisma.club.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting club:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
