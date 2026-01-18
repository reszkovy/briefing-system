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

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const clubs = await prisma.club.findMany({
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
        _count: {
          select: {
            briefs: true,
          },
        },
      },
      orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
    })

    return NextResponse.json(clubs)
  } catch (error) {
    console.error('Error fetching clubs:', error)
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

    // Check if code is unique
    const existingClub = await prisma.club.findUnique({
      where: { code },
    })

    if (existingClub) {
      return NextResponse.json(
        { error: 'Klub o takim kodzie już istnieje' },
        { status: 400 }
      )
    }

    const club = await prisma.club.create({
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

    return NextResponse.json(club, { status: 201 })
  } catch (error) {
    console.error('Error creating club:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
