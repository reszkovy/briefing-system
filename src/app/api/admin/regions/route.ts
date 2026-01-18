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

    const regions = await prisma.region.findMany({
      include: {
        _count: {
          select: {
            clubs: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(regions)
  } catch (error) {
    console.error('Error fetching regions:', error)
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
    const { name, code } = body

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Nazwa i kod są wymagane' },
        { status: 400 }
      )
    }

    // Check if code is unique
    const existingRegion = await prisma.region.findUnique({
      where: { code },
    })

    if (existingRegion) {
      return NextResponse.json(
        { error: 'Region o takim kodzie już istnieje' },
        { status: 400 }
      )
    }

    const region = await prisma.region.create({
      data: {
        name,
        code: code.toUpperCase(),
      },
    })

    return NextResponse.json(region, { status: 201 })
  } catch (error) {
    console.error('Error creating region:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
