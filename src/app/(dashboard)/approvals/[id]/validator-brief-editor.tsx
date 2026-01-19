'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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

interface BriefData {
  id: string
  title: string
  context: string
  deadline: string
  offerDetails: string | null
  legalCopy: string | null
  customFields: Record<string, unknown> | null
  assetLinks: string[]
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
    offerDetails: brief.offerDetails || '',
    legalCopy: brief.legalCopy || '',
    formats: existingFormats,
    customFormats: existingCustomFormats,
    assetLinks: brief.assetLinks || [],
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

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/briefs/${brief.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
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
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Edycja briefu
        </h2>
        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
          Tryb walidatora
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Tytul zlecenia</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
          />
        </div>

        {/* Context */}
        <div className="space-y-2">
          <Label htmlFor="context">Opis zlecenia</Label>
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

        {/* Formats section */}
        <div className="border-t pt-4 space-y-4">
          <Label className="text-base">Formaty graficzne</Label>

          {/* Digital formats */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{FORMAT_CATEGORIES.digital.label}</p>
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
            <p className="text-sm font-medium text-gray-600">{FORMAT_CATEGORIES.print.label}</p>
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
            <p className="text-sm font-medium text-gray-600">Inne formaty</p>
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
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Asset links */}
        <div className="border-t pt-4 space-y-2">
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
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
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
