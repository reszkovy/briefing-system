'use client'

import { useState } from 'react'

interface BriefCopyTemplateProps {
  brief: {
    code: string
    title: string
    context: string
    deadline: string
    priority: string
    offerDetails?: string | null
    legalCopy?: string | null
    assetLinks?: string[]
    startDate?: string | null
    endDate?: string | null
    businessObjective?: string | null
    kpiDescription?: string | null
    customFields?: Record<string, unknown> | null
    club: {
      name: string
      city: string
    }
    brand: {
      name: string
    }
    template: {
      name: string
    }
    createdBy: {
      name: string | null
    }
  }
}

export function BriefCopyTemplate({ brief }: BriefCopyTemplateProps) {
  const [copied, setCopied] = useState(false)

  const customFields = brief.customFields || {}

  // Helper to get custom field value
  const getField = (key: string): string => {
    const value = customFields[key]
    if (value === undefined || value === null) return ''
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'boolean') return value ? 'Tak' : 'Nie'
    return String(value)
  }

  // Build formats string from custom fields
  const buildFormats = (): string => {
    const formats: string[] = []

    // Standard formats
    if (customFields.formats) {
      const f = customFields.formats as string[]
      f.forEach(format => formats.push(format))
    }

    // Custom formats
    if (customFields.customFormats) {
      const f = customFields.customFormats as string[]
      f.forEach(format => formats.push(`[Custom] ${format}`))
    }

    // Print formats
    if (customFields.printFormats) {
      const f = customFields.printFormats as string[]
      f.forEach(format => formats.push(format))
    }

    // Materials (event kit)
    if (customFields.materials) {
      const f = customFields.materials as string[]
      f.forEach(format => formats.push(format))
    }

    // Channels
    if (customFields.channels) {
      const f = customFields.channels as string[]
      f.forEach(format => formats.push(format))
    }

    return formats.length > 0 ? formats.join('\n') : 'Do ustalenia'
  }

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('pl-PL')
  }

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'HIGH': return 'WYSOKI'
      case 'MEDIUM': return 'SREDNI'
      case 'LOW': return 'NISKI'
      default: return priority
    }
  }

  // Build the copy-ready summary text
  const buildSummary = (): string => {
    const lines = [
      `_Brief ${brief.code}`,
      ``,
      `PROJEKT:`,
      `${brief.title}`,
      ``,
      `KLUB:`,
      `${brief.club.name}, ${brief.club.city}`,
      ``,
      `MARKA:`,
      `${brief.brand.name}`,
      ``,
      `TYP ZLECENIA:`,
      `${brief.template.name}`,
      ``,
      `PRIORYTET:`,
      `${getPriorityLabel(brief.priority)}`,
      ``,
      `KONTEKST I CEL:`,
      `${brief.context}`,
    ]

    if (brief.businessObjective) {
      lines.push(``, `CEL BIZNESOWY:`, brief.businessObjective)
    }

    if (brief.kpiDescription) {
      lines.push(``, `KPI:`, brief.kpiDescription)
    }

    if (brief.offerDetails) {
      lines.push(``, `SZCZEGOLY OFERTY:`, brief.offerDetails)
    }

    const formats = buildFormats()
    lines.push(``, `FORMATY:`, formats)

    if (brief.legalCopy) {
      lines.push(``, `TEKST PRAWNY:`, brief.legalCopy)
    }

    // Additional info from custom fields
    const additionalInfo = buildAdditionalInfo()
    if (additionalInfo) {
      lines.push(``, `DODATKOWE INFORMACJE:`, additionalInfo)
    }

    if (brief.assetLinks && brief.assetLinks.length > 0) {
      lines.push(``, `MATERIALY:`, brief.assetLinks.join('\n'))
    }

    // Dates
    if (brief.startDate || brief.endDate) {
      const dateRange = brief.startDate && brief.endDate
        ? `${formatDate(brief.startDate)} - ${formatDate(brief.endDate)}`
        : formatDate(brief.startDate) || formatDate(brief.endDate)
      lines.push(``, `OKRES KAMPANII:`, dateRange)
    }

    lines.push(
      ``,
      `DEADLINE:`,
      formatDate(brief.deadline),
      ``,
      `AUTOR:`,
      brief.createdBy.name || 'Nieznany'
    )

    return lines.join('\n')
  }

  const buildAdditionalInfo = (): string => {
    const info: string[] = []

    if (customFields.includeQR) {
      info.push(`QR kod: ${getField('qrDestination') || 'Tak'}`)
    }
    if (customFields.quantity) {
      info.push(`Ilosc: ${getField('quantity')}`)
    }
    if (customFields.distributionLocations) {
      info.push(`Dystrybucja: ${getField('distributionLocations')}`)
    }
    if (customFields.targetAudience) {
      info.push(`Grupa docelowa: ${getField('targetAudience')}`)
    }
    if (customFields.budget) {
      info.push(`Budzet: ${getField('budget')}`)
    }
    if (customFields.specialGuests) {
      info.push(`Goscie specjalni: ${getField('specialGuests')}`)
    }
    if (customFields.eventDate) {
      info.push(`Data wydarzenia: ${getField('eventDate')}`)
    }
    if (customFields.eventTime) {
      info.push(`Godziny: ${getField('eventTime')}`)
    }
    if (customFields.registrationRequired) {
      info.push(`Wymagana rejestracja: ${getField('registrationUrl') || 'Tak'}`)
    }
    if (customFields.mainMessage) {
      info.push(`Glowny przekaz: ${getField('mainMessage')}`)
    }
    if (customFields.campaignType) {
      info.push(`Typ kampanii: ${getField('campaignType')}`)
    }
    if (customFields.eventType) {
      info.push(`Typ wydarzenia: ${getField('eventType')}`)
    }

    return info.join('\n')
  }

  const handleCopy = async () => {
    const summary = buildSummary()
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const summary = buildSummary()

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="font-semibold text-gray-900 text-sm">Szablon do Trello</h3>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            copied
              ? 'bg-green-600 text-white scale-105'
              : 'bg-[#2b3b82] text-white hover:bg-[#1e2d66]'
          }`}
        >
          {copied ? 'Skopiowano!' : 'Kopiuj'}
        </button>
      </div>

      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 whitespace-pre-wrap font-mono overflow-x-auto max-h-64 overflow-y-auto">
        {summary}
      </pre>
    </div>
  )
}
