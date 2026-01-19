'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatusBadge, PriorityBadge } from '@/components/briefs/status-badge'
import { formatDate, formatDateTime, getSLAIndicator } from '@/lib/utils'
import { ApprovalForm } from './approval-form'
import { ValidatorBriefEditor } from './validator-brief-editor'
import { PolicyCheckPanel } from '@/components/briefs/policy-check-panel'
import type { TemplateSchema, TemplateField } from '@/types'
import type { PolicyCheckResult } from '@/lib/policy-engine'
import { Button } from '@/components/ui/button'

interface BriefData {
  id: string
  code: string
  title: string
  status: string
  priority: string
  context: string
  deadline: string
  createdAt: string
  submittedAt: string | null
  offerDetails: string | null
  legalCopy: string | null
  assetLinks: string[]
  customFields: Record<string, unknown> | null
  // Policy engine fields
  estimatedCost: number | null
  isCrisisCommunication: boolean
  policyCheckResult: PolicyCheckResult | null
  requiresOwnerApproval: boolean
  ownerApprovalReason: string | null
  createdBy: {
    id: string
    name: string | null
    email: string
  }
  club: {
    name: string
    city: string
    tier?: string
    region: {
      name: string
    }
  }
  brand: {
    name: string
    primaryColor: string | null
  }
  template: {
    name: string
    defaultSLADays: number
  }
  approvals: Array<{
    id: string
    decision: string
    notes: string | null
    createdAt: string
    validator: {
      id: string
      name: string | null
    }
  }>
}

interface ApprovalDetailClientProps {
  brief: BriefData
  canApprove: boolean
  customFields: Record<string, unknown> | null
  templateSchema: TemplateSchema
}

export function ApprovalDetailClient({
  brief,
  canApprove,
  customFields,
  templateSchema,
}: ApprovalDetailClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const sla = getSLAIndicator(brief.deadline)

  const handleEditSave = () => {
    setIsEditing(false)
    router.refresh()
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#f5f7fa]">
        {/* Header */}
        <header className="bg-[#2b3b82] shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-white/70 hover:text-white"
                >
                  ← Powrot do przegladania
                </button>
                <div>
                  <p className="text-sm text-white/70">{brief.code}</p>
                  <h1 className="text-xl font-bold text-white">Edycja briefu</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
                  Tryb edycji
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Editor */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ValidatorBriefEditor
            brief={{
              id: brief.id,
              title: brief.title,
              context: brief.context,
              deadline: brief.deadline,
              offerDetails: brief.offerDetails,
              legalCopy: brief.legalCopy,
              customFields: brief.customFields,
              assetLinks: brief.assetLinks,
            }}
            onSave={handleEditSave}
            onCancel={() => setIsEditing(false)}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/approvals" className="text-white/70 hover:text-white">
                ← Zatwierdzenia
              </Link>
              <div>
                <p className="text-sm text-white/70">{brief.code}</p>
                <h1 className="text-xl font-bold text-white">{brief.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={brief.status} />
              <PriorityBadge priority={brief.priority} />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brief details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit button for validators */}
            {canApprove && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-amber-800">Mozesz edytowac brief przed zatwierdzeniem</p>
                  <p className="text-sm text-amber-600">Wprowadz zmiany jesli to konieczne, a nastepnie zatwierdz lub przekaz dalej.</p>
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  Edytuj brief
                </Button>
              </div>
            )}

            {/* Basic info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informacje podstawowe
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Klub</dt>
                  <dd className="font-medium">{brief.club.name}</dd>
                  <dd className="text-sm text-gray-500">{brief.club.city}, {brief.club.region.name}</dd>
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
                  <dt className="text-sm text-gray-500">Autor</dt>
                  <dd className="font-medium">{brief.createdBy.name}</dd>
                  <dd className="text-sm text-gray-500">{brief.createdBy.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Wyslano</dt>
                  <dd className="font-medium">{formatDateTime(brief.submittedAt || brief.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Deadline</dt>
                  <dd className={`font-medium ${sla.color}`}>
                    {formatDate(brief.deadline)}
                  </dd>
                  <dd className={`text-xs ${sla.color}`}>{sla.text}</dd>
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

            {/* Custom fields */}
            {customFields && Object.keys(customFields).filter(k => !['formats', 'customFormats'].includes(k)).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Pola szablonu
                </h2>
                <dl className="space-y-3">
                  {Object.entries(customFields)
                    .filter(([key]) => !['formats', 'customFormats'].includes(key))
                    .map(([key, value]) => {
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
                          <dt className="text-sm text-gray-500">{fieldSchema?.title || key}</dt>
                          <dd className="font-medium">{displayValue}</dd>
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

          {/* Sidebar with approval form */}
          <div className="space-y-6">
            {/* Policy Check Panel */}
            <PolicyCheckPanel
              policyResult={brief.policyCheckResult}
              requiresOwnerApproval={brief.requiresOwnerApproval}
              ownerApprovalReason={brief.ownerApprovalReason}
              clubTier={brief.club.tier}
              estimatedCost={brief.estimatedCost}
              isCrisisCommunication={brief.isCrisisCommunication}
            />

            {/* Approval form */}
            {canApprove ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Twoja decyzja
                </h2>
                <ApprovalForm
                  briefId={brief.id}
                  defaultSLA={brief.template.defaultSLADays}
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-gray-600 text-center">
                  Ten brief zostal juz rozpatrzony.
                </p>
              </div>
            )}

            {/* Previous approvals */}
            {brief.approvals.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Historia decyzji
                </h2>
                <div className="space-y-4">
                  {brief.approvals.map((approval) => (
                    <div
                      key={approval.id}
                      className="border-l-4 pl-3 py-1"
                      style={{
                        borderColor:
                          approval.decision === 'APPROVED'
                            ? '#22c55e'
                            : approval.decision === 'REJECTED'
                            ? '#ef4444'
                            : '#f59e0b',
                      }}
                    >
                      <p className="font-medium text-sm">
                        {approval.decision === 'APPROVED' && 'Zatwierdzono'}
                        {approval.decision === 'REJECTED' && 'Odrzucono'}
                        {approval.decision === 'CHANGES_REQUESTED' && 'Wymagane poprawki'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {approval.validator.name} • {formatDateTime(approval.createdAt)}
                      </p>
                      {approval.notes && (
                        <p className="text-sm text-gray-600 mt-1">{approval.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
