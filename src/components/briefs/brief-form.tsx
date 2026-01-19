'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ObjectiveLabels } from '@/lib/validations/brief'

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

interface BriefFormProps {
  clubs: Club[]
  templates: Template[]
  initialData?: Partial<FormData>
  briefId?: string
  mode?: 'create' | 'edit'
}

interface FormData {
  clubId: string
  brandId: string
  templateId: string
  title: string
  objective: string
  kpiDescription: string
  kpiTarget: string
  deadline: string
  startDate: string
  endDate: string
  context: string
  offerDetails: string
  legalCopy: string
  customFields: Record<string, unknown>
  assetLinks: string[]
}

const initialFormData: FormData = {
  clubId: '',
  brandId: '',
  templateId: '',
  title: '',
  objective: '',
  kpiDescription: '',
  kpiTarget: '',
  deadline: '',
  startDate: '',
  endDate: '',
  context: '',
  offerDetails: '',
  legalCopy: '',
  customFields: {},
  assetLinks: [],
}

export function BriefForm({ clubs, templates, initialData, briefId, mode = 'create' }: BriefFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({ ...initialFormData, ...initialData })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assetLinkInput, setAssetLinkInput] = useState('')

  const selectedClub = clubs.find((c) => c.id === formData.clubId)
  const selectedTemplate = templates.find((t) => t.id === formData.templateId)

  // Auto-set brandId when club is selected
  useEffect(() => {
    if (selectedClub) {
      setFormData((prev) => ({ ...prev, brandId: selectedClub.brand.id }))
    }
  }, [selectedClub])

  // Auto-set deadline based on template SLA
  useEffect(() => {
    if (selectedTemplate && !formData.deadline) {
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + selectedTemplate.defaultSLADays + 1)
      setFormData((prev) => ({
        ...prev,
        deadline: deadline.toISOString().split('T')[0],
      }))
    }
  }, [selectedTemplate, formData.deadline])

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

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const validateForm = (): boolean => {
    // Minimum required fields for MVP
    if (!formData.clubId || !formData.templateId) return false
    if (!formData.title || !formData.objective || !formData.context) return false
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
        kpiTarget: formData.kpiTarget ? parseFloat(formData.kpiTarget) : null,
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
          <Label>{field.title}{field.required !== false && ' *'}</Label>
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
      return (
        <div key={fieldName} className="space-y-2">
          <Label htmlFor={fieldName}>{field.title}{field.required !== false && ' *'}</Label>
          {field.description && (
            <p className="text-xs text-gray-500">{field.description}</p>
          )}
          <Select
            id={fieldName}
            value={(value as string) || ''}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
          >
            <option value="">Wybierz...</option>
            {field.enum.map((option, idx) => (
              <option key={option} value={option}>
                {field.enumNames?.[idx] || option}
              </option>
            ))}
          </Select>
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
        <Label htmlFor={fieldName}>{field.title}{field.required !== false && ' *'}</Label>
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
          {/* Row 1: Club & Template */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="templateId">Typ zlecenia *</Label>
              <Select
                id="templateId"
                name="templateId"
                value={formData.templateId}
                onChange={handleInputChange}
              >
                <option value="">Wybierz typ...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

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

          {/* Row 2: Objective & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="objective">Cel *</Label>
              <Select
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleInputChange}
              >
                <option value="">Wybierz cel...</option>
                {Object.entries(ObjectiveLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

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
          </div>

          {/* Context - the main text field */}
          <div className="space-y-2">
            <Label htmlFor="context">Opis zlecenia *</Label>
            <Textarea
              id="context"
              name="context"
              value={formData.context}
              onChange={handleInputChange}
              placeholder="Opisz czego potrzebujesz, jaki jest kontekst, szczegoly oferty..."
              rows={4}
            />
          </div>

          {/* Template-specific fields - only if template selected */}
          {selectedTemplate && Object.keys(selectedTemplate.requiredFields.properties || {}).length > 0 && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="font-medium text-[#2b3b82]">Dodatkowe pola ({selectedTemplate.name})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedTemplate.requiredFields.properties || {}).map(
                  ([fieldName, field]) => (
                    <div key={fieldName} className={
                      (field as TemplateFieldLocal).type === 'array' ||
                      ((field as TemplateFieldLocal).maxLength && (field as TemplateFieldLocal).maxLength! > 200)
                        ? 'md:col-span-2'
                        : ''
                    }>
                      {renderCustomField(fieldName, field as TemplateFieldLocal)}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

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
