'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  const [currentStep, setCurrentStep] = useState(1)
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(formData.clubId && formData.templateId)
      case 2:
        return Boolean(
          formData.title &&
          formData.objective &&
          formData.kpiDescription &&
          formData.deadline &&
          formData.context
        )
      case 3:
        if (!selectedTemplate) return true
        const schema = selectedTemplate.requiredFields
        const required = schema.required || []
        return required.every((field) => {
          const value = formData.customFields[field]
          if (Array.isArray(value)) return value.length > 0
          return Boolean(value)
        })
      default:
        return true
    }
  }

  const handleSubmit = async (action: 'draft' | 'submit') => {
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
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
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
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
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
            rows={4}
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

  const steps = [
    { number: 1, title: 'Klub i typ zlecenia' },
    { number: 2, title: 'Szczegoly briefu' },
    { number: 3, title: 'Pola szablonu' },
    { number: 4, title: 'Podsumowanie' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.number
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`ml-2 text-sm hidden sm:inline ${
                  currentStep >= step.number ? 'text-green-600 font-medium' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-24 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Club and Template Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Wybierz klub i typ zlecenia</CardTitle>
            <CardDescription>
              Wybierz dla którego klubu tworzysz brief i jakiego typu materialy potrzebujesz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              {selectedClub && (
                <p className="text-sm text-gray-500">
                  Marka:{' '}
                  <span style={{ color: selectedClub.brand.primaryColor || undefined }}>
                    {selectedClub.brand.name}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateId">Typ zlecenia *</Label>
              <Select
                id="templateId"
                name="templateId"
                value={formData.templateId}
                onChange={handleInputChange}
              >
                <option value="">Wybierz typ zlecenia...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} (SLA: {template.defaultSLADays} dni)
                  </option>
                ))}
              </Select>
              {selectedTemplate?.description && (
                <p className="text-sm text-gray-500">{selectedTemplate.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Brief Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Szczegoly briefu</CardTitle>
            <CardDescription>
              Opisz cel i kontekst swojego zlecenia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tytul briefu *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="np. Promocja karnetu rocznego - styczen"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Cel komunikacji *</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kpiDescription">Opis KPI *</Label>
                <Textarea
                  id="kpiDescription"
                  name="kpiDescription"
                  value={formData.kpiDescription}
                  onChange={handleInputChange}
                  placeholder="np. 50 nowych karnetow rocznych"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kpiTarget">Cel liczbowy (opcjonalnie)</Label>
                <Input
                  type="number"
                  id="kpiTarget"
                  name="kpiTarget"
                  value={formData.kpiTarget}
                  onChange={handleInputChange}
                  placeholder="np. 50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="startDate">Data startu kampanii</Label>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data konca kampanii</Label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Kontekst i uzasadnienie *</Label>
              <Textarea
                id="context"
                name="context"
                value={formData.context}
                onChange={handleInputChange}
                placeholder="Dlaczego teraz? Jaki jest lokalny kontekst? Co chcesz osiagnac?"
                rows={4}
              />
              <p className="text-xs text-gray-500">Min. 20 znakow</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerDetails">Szczegoly oferty</Label>
              <Textarea
                id="offerDetails"
                name="offerDetails"
                value={formData.offerDetails}
                onChange={handleInputChange}
                placeholder="Cena, warunki, czas trwania promocji..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalCopy">Tekst prawny (regulamin)</Label>
              <Textarea
                id="legalCopy"
                name="legalCopy"
                value={formData.legalCopy}
                onChange={handleInputChange}
                placeholder="Jesli wymagany..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Template-specific fields */}
      {currentStep === 3 && selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTemplate.name}</CardTitle>
            <CardDescription>
              Wypelnij pola specyficzne dla tego typu zlecenia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(selectedTemplate.requiredFields.properties || {}).map(
              ([fieldName, field]) => renderCustomField(fieldName, field as TemplateFieldLocal)
            )}

            <div className="space-y-2 pt-4 border-t">
              <Label>Linki do materialow (zdjecia, inspiracje)</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={assetLinkInput}
                  onChange={(e) => setAssetLinkInput(e.target.value)}
                  placeholder="https://drive.google.com/..."
                />
                <Button type="button" onClick={handleAddAssetLink} variant="outline">
                  Dodaj
                </Button>
              </div>
              {formData.assetLinks.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {formData.assetLinks.map((link, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline truncate flex-1"
                      >
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveAssetLink(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Usun
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Summary */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Podsumowanie briefu</CardTitle>
            <CardDescription>
              Sprawdz wszystkie dane przed zapisaniem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Podstawowe informacje</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Klub:</dt>
                    <dd className="font-medium">{selectedClub?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Marka:</dt>
                    <dd className="font-medium">{selectedClub?.brand.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Typ zlecenia:</dt>
                    <dd className="font-medium">{selectedTemplate?.name}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Terminy</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Deadline:</dt>
                    <dd className="font-medium">{formData.deadline}</dd>
                  </div>
                  {formData.startDate && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Start kampanii:</dt>
                      <dd className="font-medium">{formData.startDate}</dd>
                    </div>
                  )}
                  {formData.endDate && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Koniec kampanii:</dt>
                      <dd className="font-medium">{formData.endDate}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tytul</h4>
              <p className="text-gray-700">{formData.title}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cel</h4>
              <p className="text-gray-700">
                {ObjectiveLabels[formData.objective]} - {formData.kpiDescription}
                {formData.kpiTarget && ` (cel: ${formData.kpiTarget})`}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Kontekst</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{formData.context}</p>
            </div>

            {formData.offerDetails && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Szczegoly oferty</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.offerDetails}</p>
              </div>
            )}

            {Object.keys(formData.customFields).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pola szablonu</h4>
                <dl className="space-y-1 text-sm">
                  {Object.entries(formData.customFields).map(([key, value]) => {
                    const field = selectedTemplate?.requiredFields.properties?.[key]
                    const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
                    return (
                      <div key={key} className="flex justify-between">
                        <dt className="text-gray-500">{(field as TemplateFieldLocal)?.title || key}:</dt>
                        <dd className="font-medium text-right max-w-[60%] truncate">
                          {displayValue}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            )}

            {formData.assetLinks.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Zalaczone linki</h4>
                <ul className="text-sm space-y-1">
                  {formData.assetLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <div>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Wstecz
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!validateStep(currentStep)}
            >
              Dalej
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit('draft')}
                disabled={loading}
              >
                {loading ? 'Zapisywanie...' : 'Zapisz jako szkic'}
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit('submit')}
                disabled={loading}
              >
                {loading ? 'Wysylanie...' : 'Wyslij do zatwierdzenia'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
