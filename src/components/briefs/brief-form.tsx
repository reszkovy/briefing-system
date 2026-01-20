'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  ObjectiveLabels,
  BusinessObjectiveLabels,
  DecisionContextLabels,
} from '@/lib/validations/brief'

// Local type definition for template fields
interface TemplateFieldLocal {
  type: string
  title: string
  description?: string
  required?: boolean
  enum?: string[]
  enumNames?: string[]
  items?: {
    type: string
    enum?: string[]
    enumNames?: string[]
  }
  minItems?: number
  maxLength?: number
  default?: unknown
  format?: string
}

interface Club {
  id: string
  name: string
  city: string
  brand: {
    id: string
    name: string
    primaryColor: string | null
  }
}

interface Template {
  id: string
  name: string
  code: string
  description: string | null
  defaultSLADays: number
  requiredFields: {
    type: 'object'
    required?: string[]
    properties: Record<string, unknown>
  }
}

interface StrategyDocument {
  id: string
  title: string
  type: string
  scope: string
  content: string
  brandId: string | null
  brandName: string | null
}

interface BriefFormProps {
  clubs: Club[]
  templates: Template[]
  strategyDocuments?: StrategyDocument[]
  initialData?: Partial<FormData>
  briefId?: string
  mode?: 'create' | 'edit'
}

interface FormData {
  clubId: string
  brandId: string
  templateIds: string[]
  title: string
  // Decision Layer fields (CORE MODULE 1)
  businessObjective: string
  kpiDescription: string
  kpiTarget: string
  decisionContext: string
  // Legacy field
  objective: string
  deadline: string
  startDate: string
  endDate: string
  context: string
  offerDetails: string
  legalCopy: string
  customFields: Record<string, unknown>
  assetLinks: string[]
  formats: string[]
  customFormats: string[]
  // Policy engine fields
  confidenceLevel: string
  estimatedCost: string
  isCrisisCommunication: boolean
}

// Standard Benefit Systems graphic formats - organized by category
const FORMAT_CATEGORIES = {
  digital: {
    label: 'Digital / Social Media',
    formats: [
      { id: 'fb_post_1080x1320', label: 'Post FB (1080x1320)' },
      { id: 'ig_post_1080x1440', label: 'Post IG (1080x1440)' },
      { id: 'stories_1080x1920', label: 'Stories (1080x1920)' },
      { id: 'www_square_360x360', label: 'WWW kwadrat (360x360)' },
      { id: 'www_rect_832x416', label: 'WWW prostokat (832x416)' },
      { id: 'google_400x300', label: 'Wizytowka Google (400x300)' },
    ],
  },
  print: {
    label: 'Druk',
    formats: [
      { id: 'plakat_a4', label: 'Plakat A4' },
      { id: 'plakat_a3', label: 'Plakat A3' },
      { id: 'plakat_a2', label: 'Plakat A2' },
      { id: 'ulotka_dl', label: 'Ulotka DL' },
      { id: 'ulotka_a5', label: 'Ulotka A5' },
      { id: 'rollup', label: 'Roll-up (85x200)' },
    ],
  },
}

// Confidence level labels
const ConfidenceLevelLabels: Record<string, string> = {
  LOW: 'Niski (eksperyment)',
  MEDIUM: 'Sredni',
  HIGH: 'Wysoki (pewny ruch)',
}

const initialFormData: FormData = {
  clubId: '',
  brandId: '',
  templateIds: [],
  title: '',
  // Decision Layer fields (CORE MODULE 1)
  businessObjective: '',
  kpiDescription: '',
  kpiTarget: '',
  decisionContext: '',
  // Legacy field
  objective: '',
  deadline: '',
  startDate: '',
  endDate: '',
  context: '',
  offerDetails: '',
  legalCopy: '',
  customFields: {},
  assetLinks: [],
  formats: [],
  customFormats: [],
  // Policy engine fields
  confidenceLevel: '',
  estimatedCost: '',
  isCrisisCommunication: false,
}

export function BriefForm({ clubs, templates, strategyDocuments = [], initialData, briefId, mode = 'create' }: BriefFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({ ...initialFormData, ...initialData })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assetLinkInput, setAssetLinkInput] = useState('')
  const [customFormatInput, setCustomFormatInput] = useState('')

  const selectedClub = clubs.find((c) => c.id === formData.clubId)
  const selectedTemplates = templates.filter((t) => formData.templateIds.includes(t.id))

  // Get relevant strategy documents for selected brand
  const getRelevantStrategy = () => {
    if (!selectedClub) return null
    const brandName = selectedClub.brand.name

    // Find global strategy document
    const globalStrategy = strategyDocuments.find(doc => doc.scope === 'GLOBAL')
    if (!globalStrategy) return null

    // Parse brand-specific section from content
    const content = globalStrategy.content
    const brandPatterns = [
      new RegExp(`##\\s*\\d*\\.?\\s*${brandName}[\\s\\S]*?(?=##\\s*\\d|$)`, 'i'),
      new RegExp(`#\\s*${brandName}[\\s\\S]*?(?=#\\s|$)`, 'i'),
    ]

    for (const pattern of brandPatterns) {
      const match = content.match(pattern)
      if (match) {
        return {
          brandName,
          content: match[0].trim(),
          documentTitle: globalStrategy.title,
        }
      }
    }

    return null
  }

  const relevantStrategy = getRelevantStrategy()

  const handleTemplateToggle = (templateId: string) => {
    setFormData((prev) => ({
      ...prev,
      templateIds: prev.templateIds.includes(templateId)
        ? prev.templateIds.filter((id) => id !== templateId)
        : [...prev.templateIds, templateId],
    }))
  }

  // Auto-set brandId when club is selected
  useEffect(() => {
    if (selectedClub) {
      setFormData((prev) => ({ ...prev, brandId: selectedClub.brand.id }))
    }
  }, [selectedClub])

  // Auto-set deadline based on first selected template SLA (use the longest SLA)
  useEffect(() => {
    if (selectedTemplates.length > 0 && !formData.deadline) {
      const maxSLA = Math.max(...selectedTemplates.map((t) => t.defaultSLADays))
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + maxSLA + 1)
      setFormData((prev) => ({
        ...prev,
        deadline: deadline.toISOString().split('T')[0],
      }))
    }
  }, [selectedTemplates, formData.deadline])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomFieldChange = (fieldName: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      customFields: { ...prev.customFields, [fieldName]: value },
    }))
  }

  const handleAddAssetLink = () => {
    if (assetLinkInput && isValidUrl(assetLinkInput)) {
      setFormData((prev) => ({
        ...prev,
        assetLinks: [...prev.assetLinks, assetLinkInput],
      }))
      setAssetLinkInput('')
    }
  }

  const handleRemoveAssetLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assetLinks: prev.assetLinks.filter((_, i) => i !== index),
    }))
  }

  const handleFormatToggle = (formatId: string) => {
    setFormData((prev) => ({
      ...prev,
      formats: prev.formats.includes(formatId)
        ? prev.formats.filter((f) => f !== formatId)
        : [...prev.formats, formatId],
    }))
  }

  const handleAddCustomFormat = () => {
    if (customFormatInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        customFormats: [...prev.customFormats, customFormatInput.trim()],
      }))
      setCustomFormatInput('')
    }
  }

  const handleRemoveCustomFormat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFormats: prev.customFormats.filter((_, i) => i !== index),
    }))
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  // Check if Decision Layer is complete (CORE MODULE 1)
  const isDecisionLayerComplete = (): boolean => {
    return !!(
      formData.businessObjective &&
      formData.kpiDescription &&
      formData.kpiTarget &&
      formData.decisionContext
    )
  }

  const validateForm = (): boolean => {
    // Basic required fields: klub, typ (at least one), tytuł, opis, deadline
    if (!formData.clubId || formData.templateIds.length === 0) return false
    if (!formData.title || !formData.context || !formData.deadline) return false
    // CORE MODULE 1: Decision Layer validation for submission
    if (!isDecisionLayerComplete()) return false
    return true
  }

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !validateForm()) {
      setError('Wypelnij wszystkie wymagane pola przed wyslaniem')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        // Decision Layer fields
        businessObjective: formData.businessObjective || null,
        decisionContext: formData.decisionContext || null,
        kpiTarget: formData.kpiTarget ? parseFloat(formData.kpiTarget) : null,
        // Policy fields
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
        confidenceLevel: formData.confidenceLevel || null,
        action,
      }

      const url = briefId ? `/api/briefs/${briefId}` : '/api/briefs'
      const method = briefId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Wystapil blad podczas zapisywania briefu')
      }

      router.push('/briefs')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystapil nieznany blad')
    } finally {
      setLoading(false)
    }
  }

  const renderCustomField = (fieldName: string, field: TemplateFieldLocal) => {
    const value = formData.customFields[fieldName]

    if (field.type === 'array' && field.items?.enum) {
      const selectedValues = (value as string[]) || []
      return (
        <div key={fieldName} className="space-y-2">
          <Label>{field.title}</Label>
          {field.description && (
            <p className="text-xs text-gray-500">{field.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {field.items.enum.map((option, idx) => {
              const isSelected = selectedValues.includes(option)
              const label = field.items?.enumNames?.[idx] || option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const newValues = isSelected
                      ? selectedValues.filter((v) => v !== option)
                      : [...selectedValues, option]
                    handleCustomFieldChange(fieldName, newValues)
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    isSelected
                      ? 'bg-[#2b3b82] text-white border-[#2b3b82]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#2b3b82]'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (field.type === 'string' && field.enum) {
      // Use chips instead of dropdown for enum fields
      return (
        <div key={fieldName} className="space-y-2 md:col-span-2">
          <Label>{field.title}</Label>
          {field.description && (
            <p className="text-xs text-gray-500">{field.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {field.enum.map((option, idx) => {
              const isSelected = value === option
              const label = field.enumNames?.[idx] || option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleCustomFieldChange(fieldName, isSelected ? '' : option)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    isSelected
                      ? 'bg-[#2b3b82] text-white border-[#2b3b82]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#2b3b82]'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (field.type === 'boolean') {
      return (
        <div key={fieldName} className="flex items-center gap-2">
          <input
            type="checkbox"
            id={fieldName}
            checked={Boolean(value)}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#2b3b82] focus:ring-[#2b3b82]"
          />
          <Label htmlFor={fieldName}>{field.title}</Label>
        </div>
      )
    }

    if (field.type === 'number') {
      return (
        <div key={fieldName} className="space-y-2">
          <Label htmlFor={fieldName}>{field.title}</Label>
          {field.description && (
            <p className="text-xs text-gray-500">{field.description}</p>
          )}
          <Input
            type="number"
            id={fieldName}
            value={(value as number) || ''}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      )
    }

    if (field.format === 'date') {
      return (
        <div key={fieldName} className="space-y-2">
          <Label htmlFor={fieldName}>{field.title}</Label>
          {field.description && (
            <p className="text-xs text-gray-500">{field.description}</p>
          )}
          <Input
            type="date"
            id={fieldName}
            value={(value as string) || ''}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
          />
        </div>
      )
    }

    // Default: text input or textarea based on maxLength
    const isLongText = field.maxLength && field.maxLength > 200
    return (
      <div key={fieldName} className="space-y-2">
        <Label htmlFor={fieldName}>{field.title}</Label>
        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}
        {isLongText ? (
          <Textarea
            id={fieldName}
            value={(value as string) || ''}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            maxLength={field.maxLength}
            rows={3}
          />
        ) : (
          <Input
            type="text"
            id={fieldName}
            value={(value as string) || ''}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            maxLength={field.maxLength}
          />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#2b3b82] px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            {mode === 'edit' ? 'Edytuj brief' : 'Nowe zlecenie'}
          </h2>
          <p className="text-white/70 text-sm mt-1">Wypelnij podstawowe informacje</p>
        </div>

        {/* Form content - all in one section */}
        <div className="p-6 space-y-6">
          {/* Club selection */}
          <div className="space-y-2">
            <Label htmlFor="clubId">Klub *</Label>
            <Select
              id="clubId"
              name="clubId"
              value={formData.clubId}
              onChange={handleInputChange}
            >
              <option value="">Wybierz klub...</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name} ({club.city})
                </option>
              ))}
            </Select>
          </div>

          {/* Strategy Goals Highlight - shown when club is selected */}
          {relevantStrategy && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <div>
                  <h3 className="font-semibold text-emerald-800 text-sm">
                    Cele strategiczne: {relevantStrategy.brandName}
                  </h3>
                  <p className="text-xs text-emerald-600">
                    Pamietaj o tych priorytetach przy tworzeniu briefu
                  </p>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 text-sm text-gray-700 space-y-2">
                {relevantStrategy.content.split('\n').map((line, idx) => {
                  // Skip the header line (## X. Brand Name)
                  if (line.match(/^##?\s*\d*\.?\s*\w+/)) return null
                  // Empty lines
                  if (!line.trim()) return null
                  // Format bold text
                  const formattedLine = line
                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-emerald-700">$1</strong>')
                    .replace(/^-\s*/, '• ')
                  return (
                    <p
                      key={idx}
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formattedLine }}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tytul zlecenia *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="np. Promocja karnetu - styczen"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Context - the main text field */}
          <div className="space-y-2">
            <Label htmlFor="context">Opis zlecenia *</Label>
            <Textarea
              id="context"
              name="context"
              value={formData.context}
              onChange={handleInputChange}
              placeholder="Opisz czego potrzebujesz, jaki jest kontekst, szczegoly oferty, typ wydarzenia, liczba uczestników, linki do rejestracji..."
              rows={5}
            />
          </div>

          {/* CORE MODULE 1: Decision Layer - MANDATORY for submission */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-[#2b3b82]">Cel biznesowy i miernik sukcesu</h3>
                  <p className="text-xs text-gray-600">Wymagane przed wyslaniem - okresl intencje biznesowa</p>
                </div>
                {isDecisionLayerComplete() ? (
                  <span className="ml-auto px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Kompletne
                  </span>
                ) : (
                  <span className="ml-auto px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    Do uzupelnienia
                  </span>
                )}
              </div>

              {/* Business Objective - required chip selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cel biznesowy *</Label>
                <p className="text-xs text-gray-500">Na jaki wynik biznesowy ma wplynac ta komunikacja?</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(BusinessObjectiveLabels).map(([value, label]) => {
                    const isSelected = formData.businessObjective === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, businessObjective: isSelected ? '' : value }))}
                        className={`px-4 py-2 rounded-lg text-sm border-2 transition-all ${
                          isSelected
                            ? 'bg-[#2b3b82] text-white border-[#2b3b82] shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#2b3b82] hover:shadow-sm'
                        }`}
                      >
                        {value === 'REVENUE_ACQUISITION' && '💰 '}
                        {value === 'RETENTION_ENGAGEMENT' && '🤝 '}
                        {value === 'OPERATIONAL_EFFICIENCY' && '⚙️ '}
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* KPI Description and Target - side by side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="kpiDescription" className="text-sm font-medium">Miernik sukcesu (KPI) *</Label>
                  <p className="text-xs text-gray-500">Po czym poznasz, ze komunikacja zadziala?</p>
                  <Input
                    id="kpiDescription"
                    name="kpiDescription"
                    value={formData.kpiDescription}
                    onChange={handleInputChange}
                    placeholder="np. Liczba zapisow, Sprzedaz karnetow, Udzial w wydarzeniu..."
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kpiTarget" className="text-sm font-medium">Wartosc docelowa *</Label>
                  <p className="text-xs text-gray-500">Ile chcesz osiagnac?</p>
                  <Input
                    type="number"
                    id="kpiTarget"
                    name="kpiTarget"
                    value={formData.kpiTarget}
                    onChange={handleInputChange}
                    placeholder="np. 50"
                    min="0"
                    className="bg-white"
                  />
                </div>
              </div>

              {/* Decision Context - required chip selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Kontekst decyzji *</Label>
                <p className="text-xs text-gray-500">Kto podejmuje decyzje o tej komunikacji?</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(DecisionContextLabels).map(([value, label]) => {
                    const isSelected = formData.decisionContext === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, decisionContext: isSelected ? '' : value }))}
                        className={`px-4 py-2 rounded-lg text-sm border-2 transition-all ${
                          isSelected
                            ? 'bg-[#2b3b82] text-white border-[#2b3b82] shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#2b3b82] hover:shadow-sm'
                        }`}
                      >
                        {value === 'LOCAL' && '📍 '}
                        {value === 'REGIONAL' && '🗺️ '}
                        {value === 'CENTRAL' && '🏢 '}
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Combined: Type of request + Formats - in columns - directly after description */}
          <div className="border-t border-gray-200 pt-6 space-y-6">
            <div>
              <Label className="text-lg">Co potrzebujesz? *</Label>
              <p className="text-xs text-gray-500 mt-1">Wybierz typy zlecen i formaty - mozesz laczyc rozne kategorie w jednym briefie</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Type of request */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-[#2b3b82] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2b3b82] text-white text-xs flex items-center justify-center">1</span>
                  Typ zlecenia *
                </h4>
                <div className="space-y-2">
                  {templates.map((template) => {
                    const isSelected = formData.templateIds.includes(template.id)
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateToggle(template.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                          isSelected
                            ? 'bg-[#2b3b82] text-white border-[#2b3b82]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#2b3b82]'
                        }`}
                      >
                        {template.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Column 2: Digital formats */}
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-[#2b3b82] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2b3b82] text-white text-xs flex items-center justify-center">2</span>
                  {FORMAT_CATEGORIES.digital.label}
                </h4>
                <div className="space-y-2">
                  {FORMAT_CATEGORIES.digital.formats.map((format) => {
                    const isSelected = formData.formats.includes(format.id)
                    return (
                      <button
                        key={format.id}
                        type="button"
                        onClick={() => handleFormatToggle(format.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                          isSelected
                            ? 'bg-[#2b3b82] text-white border-[#2b3b82]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#2b3b82]'
                        }`}
                      >
                        {format.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Column 3: Print formats */}
              <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-sm font-semibold text-[#2b3b82] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2b3b82] text-white text-xs flex items-center justify-center">3</span>
                  {FORMAT_CATEGORIES.print.label}
                </h4>
                <div className="space-y-2">
                  {FORMAT_CATEGORIES.print.formats.map((format) => {
                    const isSelected = formData.formats.includes(format.id)
                    return (
                      <button
                        key={format.id}
                        type="button"
                        onClick={() => handleFormatToggle(format.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                          isSelected
                            ? 'bg-[#2b3b82] text-white border-[#2b3b82]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#2b3b82]'
                        }`}
                      >
                        {format.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Custom formats - below columns */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2b3b82]">Inne formaty</h4>
              <p className="text-xs text-gray-500">Dodaj niestandardowe formaty jesli potrzebujesz</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={customFormatInput}
                  onChange={(e) => setCustomFormatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCustomFormat()
                    }
                  }}
                  placeholder="np. Banner 1200x400, Cover LinkedIn..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddCustomFormat}
                  variant="outline"
                  disabled={!customFormatInput.trim()}
                >
                  Dodaj
                </Button>
              </div>
              {formData.customFormats.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.customFormats.map((format, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-amber-100 text-amber-800 border border-amber-200"
                    >
                      {format}
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomFormat(index)}
                        className="ml-1 text-amber-600 hover:text-amber-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Template-specific fields - shown for all selected templates */}
          {selectedTemplates.length > 0 && (() => {
            // Collect all unique fields from all selected templates
            const allFieldsMap = new Map<string, { field: TemplateFieldLocal; templateNames: string[] }>()
            selectedTemplates.forEach((template) => {
              const properties = template.requiredFields.properties || {}
              Object.entries(properties).forEach(([fieldName, field]) => {
                // Skip format-related fields
                if (['formats', 'materials', 'otherFormats', 'printFormats'].includes(fieldName)) return
                if (allFieldsMap.has(fieldName)) {
                  allFieldsMap.get(fieldName)!.templateNames.push(template.name)
                } else {
                  allFieldsMap.set(fieldName, { field: field as TemplateFieldLocal, templateNames: [template.name] })
                }
              })
            })
            if (allFieldsMap.size === 0) return null
            return (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="font-medium text-gray-600 text-sm">Dodatkowe informacje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from(allFieldsMap.entries()).map(([fieldName, { field }]) => (
                    <div key={fieldName} className={
                      field.type === 'array' ||
                      (field.maxLength && field.maxLength > 200)
                        ? 'md:col-span-2'
                        : ''
                    }>
                      {renderCustomField(fieldName, field)}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Objective - optional, chips */}
          <details className="border-t border-gray-200 pt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-[#2b3b82]">
              + Cel komunikacji (opcjonalne)
            </summary>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(ObjectiveLabels).map(([value, label]) => {
                  const isSelected = formData.objective === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, objective: isSelected ? '' : value }))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        isSelected
                          ? 'bg-[#2b3b82] text-white border-[#2b3b82]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#2b3b82]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </details>

          {/* Policy fields - Confidence Level & Crisis Communication */}
          <details className="border-t border-gray-200 pt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-[#2b3b82]">
              + Ustawienia Policy Enforcer (opcjonalne)
            </summary>
            <div className="mt-4 space-y-4">
              {/* Confidence Level */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Poziom pewnosci co do wplywu</Label>
                <p className="text-xs text-gray-500 mb-2">Jak pewny jestes, ze ta komunikacja przyniesie oczekiwany efekt?</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ConfidenceLevelLabels).map(([value, label]) => {
                    const isSelected = formData.confidenceLevel === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, confidenceLevel: isSelected ? '' : value }))}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          isSelected
                            ? value === 'HIGH' ? 'bg-green-600 text-white border-green-600' :
                              value === 'MEDIUM' ? 'bg-blue-600 text-white border-blue-600' :
                              'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#2b3b82]'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Estimated Cost */}
              <div>
                <Label htmlFor="estimatedCost" className="text-sm font-medium">Szacowany koszt produkcji (PLN)</Label>
                <p className="text-xs text-gray-500 mb-2">Wpisz 0 jezeli nie wiaze sie z dodatkowymi kosztami</p>
                <Input
                  type="number"
                  id="estimatedCost"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-40"
                />
              </div>

              {/* Crisis Communication */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isCrisisCommunication"
                  checked={formData.isCrisisCommunication}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isCrisisCommunication: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div>
                  <Label htmlFor="isCrisisCommunication" className="text-sm font-medium text-red-700">
                    Komunikacja kryzysowa
                  </Label>
                  <p className="text-xs text-gray-500">Zaznacz tylko w przypadku pilnej sytuacji kryzysowej (min. 1 dzien roboczy)</p>
                </div>
              </div>
            </div>
          </details>

          {/* Asset links - collapsed by default */}
          <details className="border-t border-gray-200 pt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-[#2b3b82]">
              + Dodaj linki do materialow (opcjonalne)
            </summary>
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={assetLinkInput}
                  onChange={(e) => setAssetLinkInput(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddAssetLink} variant="outline" size="sm">
                  Dodaj
                </Button>
              </div>
              {formData.assetLinks.length > 0 && (
                <ul className="space-y-1">
                  {formData.assetLinks.map((link, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2b3b82] hover:underline truncate flex-1"
                      >
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveAssetLink(index)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </div>

        {/* Submit buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Anuluj
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={loading}
            >
              Zapisz szkic
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('submit')}
              disabled={loading || !validateForm()}
              className="bg-[#daff47] text-[#2b3b82] hover:bg-[#c5eb3d]"
            >
              {loading ? 'Wysylanie...' : 'Wyslij'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
