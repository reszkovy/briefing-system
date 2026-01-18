import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const { name, code } = body

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Nazwa i kod są wymagane' },
        { status: 400 }
      )
    }

    // Check if code is unique (excluding current region)
    const existingRegion = await prisma.region.findFirst({
      where: {
        code,
        NOT: { id: params.id },
      },
    })

    if (existingRegion) {
      return NextResponse.json(
        { error: 'Region o takim kodzie już istnieje' },
        { status: 400 }
      )
    }

    const region = await prisma.region.update({
      where: { id: params.id },
      data: {
        name,
        code: code.toUpperCase(),
      },
    })

    return NextResponse.json(region)
  } catch (error) {
    console.error('Error updating region:', error)
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

    // Check if region has clubs
    const clubsCount = await prisma.club.count({
      where: { regionId: params.id },
    })

    if (clubsCount > 0) {
      return NextResponse.json(
        { error: `Nie można usunąć regionu, który ma przypisane kluby (${clubsCount})` },
        { status: 400 }
      )
    }

    await prisma.region.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting region:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
