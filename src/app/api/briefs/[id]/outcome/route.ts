import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OutcomeEnum } from '@/lib/validations/brief'
import { z } from 'zod'

const outcomeSchema = z.object({
  outcome: OutcomeEnum,
  outcomeNote: z.string().max(500).optional().nullable(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only PRODUCTION users can tag outcomes
    if (session.user.role !== 'PRODUCTION' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Brak uprawnien do oznaczania wynikow' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = outcomeSchema.parse(body)

    // Check if brief exists and has a delivered production task
    const brief = await prisma.brief.findUnique({
      where: { id },
      include: {
        productionTask: true,
      },
    })

    if (!brief) {
      return NextResponse.json({ error: 'Brief nie znaleziony' }, { status: 404 })
    }

    if (!brief.productionTask || brief.productionTask.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Wynik mozna oznaczac tylko dla dostarczonych zadan' },
        { status: 400 }
      )
    }

    // Update brief with outcome
    const updatedBrief = await prisma.brief.update({
      where: { id },
      data: {
        outcome: validatedData.outcome,
        outcomeNote: validatedData.outcomeNote || null,
        wasExecuted: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        briefId: id,
        action: 'OUTCOME_TAGGED',
        details: {
          outcome: validatedData.outcome,
          outcomeNote: validatedData.outcomeNote,
        },
      },
    })

    return NextResponse.json({
      success: true,
      outcome: updatedBrief.outcome,
    })
  } catch (error) {
    console.error('Error tagging outcome:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Nieprawidlowe dane', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Wystapil blad podczas zapisywania wyniku' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const brief = await prisma.brief.findUnique({
      where: { id },
      select: {
        outcome: true,
        outcomeNote: true,
        wasExecuted: true,
      },
    })

    if (!brief) {
      return NextResponse.json({ error: 'Brief nie znaleziony' }, { status: 404 })
    }

    return NextResponse.json(brief)
  } catch (error) {
    console.error('Error fetching outcome:', error)
    return NextResponse.json(
      { error: 'Wystapil blad podczas pobierania wyniku' },
      { status: 500 }
    )
  }
}
