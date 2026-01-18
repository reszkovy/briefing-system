'use client'

import { useState } from 'react'

interface Brief {
  title: string
  objective: string
  context: string | null
  offerDetails: string | null
  legalCopy: string | null
  customFields: Record<string, unknown> | null
  assetLinks: string[] | null
  club: {
    name: string
    brand: {
      name: string
    }
  }
  template: {
    name: string
  }
}

interface Task {
  dueDate: Date | string
  brief: Brief
}

interface Props {
  task: Task
}

export function TrelloSummary({ task }: Props) {
  const [copied, setCopied] = useState(false)

  const customFields = task.brief.customFields || {}

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

    // Check for printFormats
    if (customFields.printFormats) {
      const printFormats = customFields.printFormats as string[]
      printFormats.forEach(f => formats.push(f))
    }

    // Check for materials (event kit)
    if (customFields.materials) {
      const materials = customFields.materials as string[]
      materials.forEach(m => formats.push(m))
    }

    // Check for channels
    if (customFields.channels) {
      const channels = customFields.channels as string[]
      channels.forEach(c => formats.push(c))
    }

    return formats.length > 0 ? formats.join('\n') : 'Do ustalenia'
  }

  // Build the Trello summary text
  const buildSummary = (): string => {
    const deadline = new Date(task.dueDate).toLocaleDateString('pl-PL')

    const lines = [
      `_Brief`,
      ``,
      `PROJEKT:`,
      `${task.brief.title} w ${task.brief.club.name}`,
      ``,
      `CEL:`,
      `${task.brief.objective}${task.brief.context ? ` - ${task.brief.context}` : ''}`,
      ``,
      `SZCZEGÓŁY OFERTY:`,
      `${task.brief.offerDetails || 'Brak szczegółów'}`,
      ``,
      `FORMATY I REFORMATY:`,
      buildFormats(),
      ``,
      `WERSJE:`,
      `${task.brief.club.brand.name}`,
      ``,
      `SPECYFIKACJA:`,
      `${task.brief.legalCopy || 'Standard'}`,
      ``,
      `KV:`,
      `${getField('mainMessage') || 'Do ustalenia z grafikiem'}`,
      ``,
      `MATERIAŁY:`,
      (task.brief.assetLinks && task.brief.assetLinks.length > 0)
        ? task.brief.assetLinks.join('\n')
        : 'Brak załączników',
      ``,
      `BENCHMARK:`,
      `${getField('campaignType') || getField('eventType') || 'Do ustalenia'}`,
      ``,
      `COPY NA KREACJĘ:`,
      `${getField('mainMessage') || 'Do ustalenia'}`,
      ``,
      `DODATKOWE INFORMACJE:`,
      buildAdditionalInfo(),
      ``,
      `DDL:`,
      `${deadline}`,
    ]

    return lines.join('\n')
  }

  const buildAdditionalInfo = (): string => {
    const info: string[] = []

    if (customFields.includeQR) {
      info.push(`QR kod: ${getField('qrDestination') || 'Tak'}`)
    }
    if (customFields.quantity) {
      info.push(`Ilość: ${getField('quantity')}`)
    }
    if (customFields.distributionLocations) {
      info.push(`Dystrybucja: ${getField('distributionLocations')}`)
    }
    if (customFields.targetAudience) {
      info.push(`Grupa docelowa: ${getField('targetAudience')}`)
    }
    if (customFields.budget) {
      info.push(`Budżet: ${getField('budget')}`)
    }
    if (customFields.specialGuests) {
      info.push(`Goście specjalni: ${getField('specialGuests')}`)
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

    return info.length > 0 ? info.join('\n') : 'Brak dodatkowych informacji'
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Podsumowanie do Trello</h3>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {copied ? 'Skopiowano!' : 'Kopiuj do schowka'}
        </button>
      </div>

      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
        {summary}
      </pre>
    </div>
  )
}
