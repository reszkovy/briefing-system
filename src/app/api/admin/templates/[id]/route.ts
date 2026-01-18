import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const { name, code, description, brandId, defaultSLADays, isActive, requiredFields } = body

    // Check if template exists
    const existingTemplate = await prisma.requestTemplate.findUnique({
      where: { id: params.id },
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Szablon nie istnieje' },
        { status: 404 }
      )
    }

    // Check if code is taken by another template
    if (code && code !== existingTemplate.code) {
      const codeTaken = await prisma.requestTemplate.findUnique({
        where: { code },
      })
      if (codeTaken) {
        return NextResponse.json(
          { error: 'Ten kod jest już zajęty' },
          { status: 400 }
        )
      }
    }

    const template = await prisma.requestTemplate.update({
      where: { id: params.id },
      data: {
        name: name ?? existingTemplate.name,
        code: code ?? existingTemplate.code,
        description: description !== undefined ? description : existingTemplate.description,
        brandId: brandId !== undefined ? (brandId || null) : existingTemplate.brandId,
        defaultSLADays: defaultSLADays ?? existingTemplate.defaultSLADays,
        isActive: isActive !== undefined ? isActive : existingTemplate.isActive,
        requiredFields: requiredFields !== undefined ? requiredFields : existingTemplate.requiredFields,
      },
      include: {
        brand: true,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error updating template:', error)
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

    // Check if template is used by any briefs
    const briefsCount = await prisma.brief.count({
      where: { templateId: params.id },
    })

    if (briefsCount > 0) {
      return NextResponse.json(
        { error: `Nie można usunąć szablonu - jest używany przez ${briefsCount} brief(ów)` },
        { status: 400 }
      )
    }

    await prisma.requestTemplate.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
