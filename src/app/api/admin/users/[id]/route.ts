import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
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
    const { email, name, password, role, clubIds } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik nie istnieje' },
        { status: 404 }
      )
    }

    // Check if email is taken by another user
    if (email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      })
      if (emailTaken) {
        return NextResponse.json(
          { error: 'Ten email jest już zajęty' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      email,
      name,
      role,
    }

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12)
    }

    // Update user
    await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    })

    // Update club assignments
    if (role !== 'ADMIN') {
      // Remove existing assignments
      await prisma.userClub.deleteMany({
        where: { userId: params.id },
      })

      // Add new assignments
      if (clubIds && clubIds.length > 0) {
        await prisma.userClub.createMany({
          data: clubIds.map((clubId: string) => ({
            userId: params.id,
            clubId,
          })),
        })
      }
    } else {
      // Admin - remove all club assignments
      await prisma.userClub.deleteMany({
        where: { userId: params.id },
      })
    }

    // Fetch updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id: params.id },
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

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
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

    // Prevent self-deletion
    if (params.id === currentUser.id) {
      return NextResponse.json(
        { error: 'Nie możesz usunąć własnego konta' },
        { status: 400 }
      )
    }

    // Delete user (cascade will handle related records)
    await prisma.userClub.deleteMany({
      where: { userId: params.id },
    })

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
