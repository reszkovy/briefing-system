import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

    const users = await prisma.user.findMany({
      include: {
        clubs: {
          include: {
            club: {
              include: {
                brand: true,
                region: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
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
    const { email, name, password, role, clubIds } = body

    // Validate required fields
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól' },
        { status: 400 }
      )
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik z tym emailem już istnieje' },
        { status: 400 }
      )
    }

    // Validate role-specific requirements
    if (role === 'CLUB_MANAGER' && (!clubIds || clubIds.length !== 1)) {
      return NextResponse.json(
        { error: 'Manager klubu musi mieć przypisany dokładnie 1 klub' },
        { status: 400 }
      )
    }

    if ((role === 'VALIDATOR' || role === 'PRODUCTION') && (!clubIds || clubIds.length === 0)) {
      return NextResponse.json(
        { error: 'Należy przypisać co najmniej 1 klub' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user with club assignments
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        clubs: role !== 'ADMIN' && clubIds?.length > 0
          ? {
              create: clubIds.map((clubId: string) => ({
                clubId,
              })),
            }
          : undefined,
      },
      include: {
        clubs: {
          include: {
            club: {
              include: {
                brand: true,
                region: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
