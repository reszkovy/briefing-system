import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatusBadge, PriorityBadge } from '@/components/briefs/status-badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime, formatRelativeTime, getSLAIndicator } from '@/lib/utils'
import { ObjectiveLabels, BriefStatusLabels } from '@/lib/validations/brief'
import type { TemplateSchema, TemplateField } from '@/types'

export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const { id } = await params

  const brief = await prisma.brief.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      club: {
        include: {
          brand: true,
          region: true,
        },
      },
      brand: true,
      template: true,
      approvals: {
        include: {
          validator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      productionTask: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          deliverables: true,
        },
      },
    },
  })

  if (!brief) {
    notFound()
  }

  // Check access
  const hasAccess =
    brief.createdById === session.user.id ||
    session.user.role === 'ADMIN' ||
    session.user.role === 'PRODUCTION' ||
    (session.user.role === 'VALIDATOR' &&
      (await prisma.userClub.findFirst({
        where: { userId: session.user.id, clubId: brief.clubId },
      })))

  if (!hasAccess) {
    redirect('/dashboard')
  }

  const sla = getSLAIndicator(brief.deadline)
  const canEdit =
    brief.createdById === session.user.id &&
    ['DRAFT', 'CHANGES_REQUESTED'].includes(brief.status)

  const customFields = brief.customFields as Record<string, unknown> | null
  const templateSchema = brief.template.requiredFields as unknown as TemplateSchema

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/briefs" className="text-white/70 hover:text-white">
                ← Moje briefy
              </Link>
              <div>
                <p className="text-sm text-gray-500">{brief.code}</p>
                <h1 className="text-xl font-bold text-gray-900">{brief.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={brief.status} />
              <PriorityBadge priority={brief.priority} />
              {canEdit && (
                <Link href={`/briefs/${brief.id}/edit`}>
                  <Button variant="outline">Edytuj</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Podstawowe informacje
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Klub</dt>
                  <dd className="font-medium">{brief.club.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Marka</dt>
                  <dd className="font-medium" style={{ color: brief.brand.primaryColor || undefined }}>
                    {brief.brand.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Typ zlecenia</dt>
                  <dd className="font-medium">{brief.template.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Cel komunikacji</dt>
                  <dd className="font-medium">{ObjectiveLabels[brief.objective]}</dd>
                </div>
              </dl>
            </div>

            {/* Formats section */}
            {(customFields?.formats || customFields?.customFormats) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Zamawiane formaty
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(customFields.formats) && (customFields.formats as string[]).map((format: string) => (
                    <span key={format} className="px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                      {format}
                    </span>
                  ))}
                  {Array.isArray(customFields.customFormats) && (customFields.customFormats as string[]).map((format: string) => (
                    <span key={format} className="px-3 py-1.5 rounded-full text-sm bg-amber-100 text-amber-800 border border-amber-200">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Context */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Kontekst i uzasadnienie
              </h2>
              <p className="whitespace-pre-wrap text-gray-700">{brief.context}</p>

              {brief.offerDetails && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium text-gray-900 mb-2">Szczegoly oferty</h3>
                  <p className="whitespace-pre-wrap text-gray-700">{brief.offerDetails}</p>
                </div>
              )}

              {brief.legalCopy && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium text-gray-900 mb-2">Tekst prawny</h3>
                  <p className="whitespace-pre-wrap text-gray-600 text-sm">{brief.legalCopy}</p>
                </div>
              )}
            </div>

            {/* Formats section */}
            {customFields && (Array.isArray(customFields.formats) && customFields.formats.length > 0 || Array.isArray(customFields.customFormats) && customFields.customFormats.length > 0) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Zamawiane formaty
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(customFields.formats) && customFields.formats.map((format: string) => (
                    <span key={format} className="px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                      {format}
                    </span>
                  ))}
                  {Array.isArray(customFields.customFormats) && customFields.customFormats.map((format: string) => (
                    <span key={format} className="px-3 py-1.5 rounded-full text-sm bg-amber-100 text-amber-800 border border-amber-200">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom fields - excluding formats */}
            {customFields && Object.keys(customFields).filter(k => !['formats', 'customFormats'].includes(k)).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Pola specyficzne dla zlecenia
                </h2>
                <dl className="space-y-4">
                  {Object.entries(customFields).filter(([key]) => !['formats', 'customFormats'].includes(key)).map(([key, value]) => {
                    const fieldSchema = templateSchema.properties?.[key] as TemplateField | undefined
                    let displayValue: string
                    if (Array.isArray(value)) {
                      displayValue = value.map((v) => {
                        const enumIdx = fieldSchema?.items?.enum?.indexOf(v as string)
                        return enumIdx !== undefined && enumIdx >= 0
                          ? fieldSchema?.items?.enumNames?.[enumIdx] || String(v)
                          : String(v)
                      }).join(', ')
                    } else if (fieldSchema?.enum) {
                      const enumIdx = fieldSchema.enum.indexOf(value as string)
                      displayValue = (enumIdx >= 0 ? fieldSchema.enumNames?.[enumIdx] : null) || String(value)
                    } else if (typeof value === 'boolean') {
                      displayValue = value ? 'Tak' : 'Nie'
                    } else {
                      displayValue = String(value)
                    }

                    return (
                      <div key={key}>
                        <dt className="text-sm text-gray-500">
                          {fieldSchema?.title || key}
                        </dt>
                        <dd className="mt-1 font-medium">{displayValue}</dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            )}

            {/* Asset links */}
            {brief.assetLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Zalaczone materialy
                </h2>
                <ul className="space-y-2">
                  {brief.assetLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2b3b82] hover:underline flex items-center gap-2"
                      >
                        <span>📎</span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Autor
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                  {brief.createdBy.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{brief.createdBy.name}</p>
                  <p className="text-sm text-gray-500">{brief.createdBy.email}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                <p>Utworzono: {formatDateTime(brief.createdAt)}</p>
                {brief.submittedAt && (
                  <p>Wyslano: {formatDateTime(brief.submittedAt)}</p>
                )}
                <p>Ostatnia zmiana: {formatRelativeTime(brief.updatedAt)}</p>
              </div>
            </div>

            {/* Approvals history */}
            {brief.approvals.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Historia zatwierdzen
                </h2>
                <div className="space-y-4">
                  {brief.approvals.map((approval) => (
                    <div key={approval.id} className="border-l-4 pl-3 py-1" style={{
                      borderColor:
                        approval.decision === 'APPROVED' ? '#22c55e' :
                        approval.decision === 'REJECTED' ? '#ef4444' : '#f59e0b'
                    }}>
                      <p className="font-medium text-sm">
                        {approval.decision === 'APPROVED' && 'Zatwierdzono'}
                        {approval.decision === 'REJECTED' && 'Odrzucono'}
                        {approval.decision === 'CHANGES_REQUESTED' && 'Wymagane poprawki'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {approval.validator.name} • {formatRelativeTime(approval.createdAt)}
                      </p>
                      {approval.notes && (
                        <p className="text-sm text-gray-600 mt-1">{approval.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production task */}
            {brief.productionTask && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Realizacja
                </h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status:</dt>
                    <dd>
                      <StatusBadge status={brief.productionTask.status} />
                    </dd>
                  </div>
                  {brief.productionTask.assignee && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Przypisano:</dt>
                      <dd className="font-medium">{brief.productionTask.assignee.name}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Termin:</dt>
                    <dd className="font-medium">{formatDate(brief.productionTask.dueDate)}</dd>
                  </div>
                </dl>

                {brief.productionTask.deliverables.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium text-gray-900 mb-2">Dostarczone materialy</h3>
                    <ul className="space-y-2">
                      {brief.productionTask.deliverables.map((d) => (
                        <li key={d.id} className="flex items-center gap-2">
                          <span className={d.isApproved ? 'text-green-500' : 'text-gray-400'}>
                            {d.isApproved ? '✓' : '○'}
                          </span>
                          <a
                            href={d.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#2b3b82] hover:underline"
                          >
                            {d.name} (v{d.version})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Status actions for different states */}
            {brief.status === 'CHANGES_REQUESTED' && brief.createdById === session.user.id && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Wymagane poprawki</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  {brief.approvals[0]?.notes || 'Walidator poprosil o wprowadzenie poprawek.'}
                </p>
                <Link href={`/briefs/${brief.id}/edit`}>
                  <Button className="w-full">Wprowadz poprawki</Button>
                </Link>
              </div>
            )}

            {brief.status === 'DRAFT' && brief.createdById === session.user.id && (
              <div className="bg-[#f5f7fa] border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Szkic</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Ten brief nie zostal jeszcze wyslany do zatwierdzenia.
                </p>
                <Link href={`/briefs/${brief.id}/edit`}>
                  <Button className="w-full">Kontynuuj edycje</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
