import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { clubContextSchema } from '@/lib/validations/club-context'

// GET /api/clubs/[id]/context - Get club context
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check access: ADMIN, CMO can see all; CLUB_MANAGER and VALIDATOR can see assigned clubs
    const hasAccess = await checkClubAccess(currentUser, params.id)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const club = await prisma.club.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        clubCharacter: true,
        customCharacter: true,
        keyMemberGroups: true,
        localConstraints: true,
        topActivities: true,
        activityReasons: true,
        localDecisionBrief: true,
        contextUpdatedAt: true,
        contextUpdatedBy: {
          select: { id: true, name: true },
        },
      },
    })

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 })
    }

    return NextResponse.json(club)
  } catch (error) {
    console.error('Error fetching club context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/clubs/[id]/context - Update club context
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only CLUB_MANAGER of this club or ADMIN can edit context
    const canEdit = await checkClubEditAccess(currentUser, params.id)
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = clubContextSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.errors },
        { status: 400 }
      )
    }

    const club = await prisma.club.update({
      where: { id: params.id },
      data: {
        clubCharacter: validated.data.clubCharacter,
        customCharacter: validated.data.customCharacter,
        keyMemberGroups: validated.data.keyMemberGroups,
        localConstraints: validated.data.localConstraints,
        topActivities: validated.data.topActivities,
        activityReasons: validated.data.activityReasons,
        localDecisionBrief: validated.data.localDecisionBrief,
        contextUpdatedAt: new Date(),
        contextUpdatedById: currentUser.id,
      },
      select: {
        id: true,
        name: true,
        clubCharacter: true,
        customCharacter: true,
        keyMemberGroups: true,
        localConstraints: true,
        topActivities: true,
        activityReasons: true,
        localDecisionBrief: true,
        contextUpdatedAt: true,
        contextUpdatedBy: {
          select: { id: true, name: true },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: 'CLUB_CONTEXT_UPDATED',
        details: { clubId: params.id, clubName: club.name },
      },
    })

    return NextResponse.json(club)
  } catch (error) {
    console.error('Error updating club context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper: Check if user can view club context
async function checkClubAccess(
  user: { id: string; role: string },
  clubId: string
): Promise<boolean> {
  // ADMIN and CMO can see all clubs
  if (user.role === 'ADMIN' || user.role === 'CMO') {
    return true
  }

  // VALIDATOR can see clubs in their region
  if (user.role === 'VALIDATOR') {
    // For now, allow VALIDATOR to see all clubs
    // In future, could restrict to assigned regions
    return true
  }

  // CLUB_MANAGER can only see their assigned clubs
  const userClub = await prisma.userClub.findFirst({
    where: { userId: user.id, clubId },
  })

  return !!userClub
}

// Helper: Check if user can edit club context
async function checkClubEditAccess(
  user: { id: string; role: string },
  clubId: string
): Promise<boolean> {
  // ADMIN can edit all clubs
  if (user.role === 'ADMIN') {
    return true
  }

  // CLUB_MANAGER can only edit their managed clubs
  if (user.role === 'CLUB_MANAGER') {
    const userClub = await prisma.userClub.findFirst({
      where: { userId: user.id, clubId, isManager: true },
    })
    return !!userClub
  }

  return false
}
