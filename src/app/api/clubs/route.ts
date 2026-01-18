import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/clubs - Get clubs for current user
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get clubs based on role
    let clubs

    if (session.user.role === 'ADMIN') {
      // Admin sees all clubs
      clubs = await prisma.club.findMany({
        include: {
          brand: true,
          region: true,
        },
        orderBy: { name: 'asc' },
      })
    } else {
      // Other users see only their assigned clubs
      const userClubs = await prisma.userClub.findMany({
        where: {
          userId: session.user.id,
          // For CLUB_MANAGER, only show clubs they manage
          ...(session.user.role === 'CLUB_MANAGER' ? { isManager: true } : {}),
        },
        include: {
          club: {
            include: {
              brand: true,
              region: true,
            },
          },
        },
      })
      clubs = userClubs.map((uc) => uc.club)
    }

    return NextResponse.json(clubs)
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clubs' },
      { status: 500 }
    )
  }
}
