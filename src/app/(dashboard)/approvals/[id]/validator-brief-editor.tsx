'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ObjectiveLabels,
  BusinessObjectiveLabels,
  DecisionContextLabels,
} from '@/lib/validations/brief'

// Standard Benefit Systems graphic formats
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

interface BriefData {
  id: string
  title: string
  context: string
  deadline: string
  startDate: string | null
  endDate: string | null
  offerDetails: string | null
  legalCopy: string | null
  customFields: Record<string, unknown> | null
  assetLinks: string[]
  // Decision Layer fields
  businessObjective: string | null
  kpiDescription: string | null
  kpiTarget: number | null
  decisionContext: string | null
  objective: string | null
  // Policy engine fields
  estimatedCost: number | null
  isCrisisCommunication: boolean
  confidenceLevel: string | null
  // Related IDs
  clubId: string
  brandId: string
  templateId: string
  templateRequiredFields: unknown
}

interface ValidatorBriefEditorProps {
  brief: BriefData
  onSave: () => void
  onCancel: () => void
}

export function ValidatorBriefEditor({ brief, onSave, onCancel }: ValidatorBriefEditorProps) {
  const router = useRouter()
  const customFields = brief.customFields || {}
  const existingFormats = Array.isArray(customFields.formats) ? customFields.formats as string[] : []
  const existingCustomFormats = Array.isArray(customFields.customFormats) ? customFields.customFormats as string[] : []

  const [formData, setFormData] = useState({
    title: brief.title,
    context: brief.context,
    deadline: brief.deadline.split('T')[0],
    startDate: brief.startDate ? brief.startDate.split('T')[0] : '',
    endDate: brief.endDate ? brief.endDate.split('T')[0] : '',
    offerDetails: brief.offerDetails || '',
    legalCopy: brief.legalCopy || '',
    formats: existingFormats,
    customFormats: existingCustomFormats,
    assetLinks: brief.assetLinks || [],
    // Decision Layer fields
    businessObjective: brief.businessObjective || '',
    kpiDescription: brief.kpiDescription || '',
    kpiTarget: brief.kpiTarget?.toString() || '',
    decisionContext: brief.decisionContext || '',
    objective: brief.objective || '',
    // Policy engine fields
    estimatedCost: brief.estimatedCost?.toString() || '',
    isCrisisCommunication: brief.isCrisisCommunication || false,
    confidenceLevel: brief.confidenceLevel || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customFormatInput, setCustomFormatInput] = useState('')
  const [assetLinkInput, setAssetLinkInput] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  // Check if Decision Layer is complete
  const isDecisionLayerComplete = (): boolean => {
    return !!(
      formData.businessObjective &&
      formData.kpiDescription &&
      formData.kpiTarget &&
      formData.decisionContext
    )
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/briefs/${brief.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          kpiTarget: formData.kpiTarget ? parseFloat(formData.kpiTarget) : null,
          estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          businessObjective: formData.businessObjective || null,
          decisionContext: formData.decisionContext || null,
          objective: formData.objective || null,
          confidenceLevel: formData.confidenceLevel || null,
          validatorEdit: true,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Wystapil blad')
      }

      router.refresh()
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystapil blad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edycja briefu
            </h2>
            <p className="text-sm text-amber-700">
              Jako walidator mozesz edytowac wszystkie pola briefu, w tym uzupelnic formaty graficzne
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 border border-amber-200">
            Tryb walidatora
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Basic fields */}
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tytul zlecenia *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Data rozpoczecia</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data zakonczenia</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Context */}
          <div className="space-y-2">
            <Label htmlFor="context">Opis zlecenia *</Label>
            <Textarea
              id="context"
              name="context"
              value={formData.context}
              onChange={handleInputChange}
              rows={5}
            />
          </div>

          {/* Offer details */}
          <div className="space-y-2">
            <Label htmlFor="offerDetails">Szczegoly oferty</Label>
            <Textarea
              id="offerDetails"
              name="offerDetails"
              value={formData.offerDetails}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {/* Legal copy */}
          <div className="space-y-2">
            <Label htmlFor="legalCopy">Tekst prawny</Label>
            <Textarea
              id="legalCopy"
              name="legalCopy"
              value={formData.legalCopy}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
        </div>

        {/* CORE MODULE 1: Decision Layer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-semibold text-[#2b3b82]">Cel biznesowy i miernik sukcesu</h3>
                <p className="text-xs text-gray-600">Mozesz uzupelnic lub zmodyfikowac te pola</p>
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

            {/* Business Objective */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cel biznesowy</Label>
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

            {/* KPI Description and Target */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="kpiDescription" className="text-sm font-medium">Miernik sukcesu (KPI)</Label>
                <Input
                  id="kpiDescription"
                  name="kpiDescription"
                  value={formData.kpiDescription}
                  onChange={handleInputChange}
                  placeholder="np. Liczba zapisow, Sprzedaz karnetow..."
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kpiTarget" className="text-sm font-medium">Wartosc docelowa</Label>
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

            {/* Decision Context */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kontekst decyzji</Label>
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

        {/* Formats section - IMPORTANT for validator to fill */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📐</span>
              <div>
                <h3 className="font-semibold text-[#2b3b82]">Formaty graficzne</h3>
                <p className="text-xs text-gray-600">
                  Manager lokalny moze nie znac wymaganych formatow - uzupelnij je jako walidator
                </p>
              </div>
              {(formData.formats.length > 0 || formData.customFormats.length > 0) ? (
                <span className="ml-auto px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  {formData.formats.length + formData.customFormats.length} formatow
                </span>
              ) : (
                <span className="ml-auto px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  Brak formatow
                </span>
              )}
            </div>

            {/* Digital formats */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{FORMAT_CATEGORIES.digital.label}</p>
              <div className="flex flex-wrap gap-2">
                {FORMAT_CATEGORIES.digital.formats.map((format) => {
                  const isSelected = formData.formats.includes(format.id)
                  return (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() => handleFormatToggle(format.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
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

            {/* Print formats */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{FORMAT_CATEGORIES.print.label}</p>
              <div className="flex flex-wrap gap-2">
                {FORMAT_CATEGORIES.print.formats.map((format) => {
                  const isSelected = formData.formats.includes(format.id)
                  return (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() => handleFormatToggle(format.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
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

            {/* Custom formats */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Inne formaty</p>
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
                  placeholder="np. Banner 1200x400..."
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
                <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Legacy Objective - optional */}
        <details className="border-t border-gray-200 pt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-[#2b3b82]">
            + Cel komunikacji (legacy, opcjonalne)
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

        {/* Policy fields */}
        <details className="border-t border-gray-200 pt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-[#2b3b82]">
            + Ustawienia Policy Enforcer (opcjonalne)
          </summary>
          <div className="mt-4 space-y-4">
            {/* Confidence Level */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Poziom pewnosci</Label>
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
              <Label htmlFor="estimatedCost" className="text-sm font-medium">Szacowany koszt (PLN)</Label>
              <Input
                type="number"
                id="estimatedCost"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-40 mt-1"
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
              <Label htmlFor="isCrisisCommunication" className="text-sm font-medium text-red-700">
                Komunikacja kryzysowa
              </Label>
            </div>
          </div>
        </details>

        {/* Asset links */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <Label>Linki do materialow</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              value={assetLinkInput}
              onChange={(e) => setAssetLinkInput(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddAssetLink}
              variant="outline"
              disabled={!assetLinkInput || !isValidUrl(assetLinkInput)}
            >
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
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Anuluj
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-[#2b3b82] hover:bg-[#1e2d5f]"
        >
          {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </div>
    </div>
  )
}
