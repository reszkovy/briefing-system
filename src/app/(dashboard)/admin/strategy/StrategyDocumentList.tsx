'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

interface Brand {
  id: string
  name: string
}

interface Region {
  id: string
  name: string
}

interface StrategyDocument {
  id: string
  title: string
  description: string | null
  type: string
  scope: string
  brandId: string | null
  regionId: string | null
  content: string
  fileUrl: string | null
  validFrom: string
  validUntil: string | null
  version: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  brand: { id: string; name: string } | null
  region: { id: string; name: string } | null
  createdBy: { id: string; name: string }
}

interface StrategyDocumentListProps {
  initialDocuments: StrategyDocument[]
  brands: Brand[]
  regions: Region[]
  userRole: string
}

const TYPE_LABELS: Record<string, string> = {
  BRAND_GUIDELINES: 'Wytyczne marki',
  COMMUNICATION_STRATEGY: 'Strategia komunikacji',
  QUARTERLY_GOALS: 'Cele kwartalne',
  ANNUAL_PLAN: 'Plan roczny',
  POLICY: 'Polityka / regulamin',
  OTHER: 'Inny dokument',
}

const SCOPE_LABELS: Record<string, string> = {
  GLOBAL: 'Globalne',
  BRAND: 'Dla marki',
  REGION: 'Dla regionu',
}

const initialFormData = {
  title: '',
  description: '',
  type: 'COMMUNICATION_STRATEGY',
  scope: 'GLOBAL',
  brandId: '',
  regionId: '',
  content: '',
  fileUrl: '',
  validUntil: '',
  isActive: true,
}

export function StrategyDocumentList({
  initialDocuments,
  brands,
  regions,
  userRole,
}: StrategyDocumentListProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState<StrategyDocument[]>(initialDocuments)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canDelete = ['ADMIN', 'CMO'].includes(userRole)
  const canCreate = ['ADMIN', 'CMO', 'REGIONAL_DIRECTOR'].includes(userRole)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleEdit = (doc: StrategyDocument) => {
    setFormData({
      title: doc.title,
      description: doc.description || '',
      type: doc.type,
      scope: doc.scope,
      brandId: doc.brandId || '',
      regionId: doc.regionId || '',
      content: doc.content,
      fileUrl: doc.fileUrl || '',
      validUntil: doc.validUntil ? doc.validUntil.split('T')[0] : '',
      isActive: doc.isActive,
    })
    setEditingId(doc.id)
    setShowForm(true)
    setViewingId(null)
  }

  const handleView = (doc: StrategyDocument) => {
    setViewingId(viewingId === doc.id ? null : doc.id)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(initialFormData)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingId
        ? `/api/admin/strategy/${editingId}`
        : '/api/admin/strategy'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brandId: formData.scope === 'BRAND' ? formData.brandId : null,
          regionId: formData.scope === 'REGION' ? formData.regionId : null,
          validUntil: formData.validUntil || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Wystąpił błąd')
      }

      router.refresh()
      handleCancel()

      // Update local state
      if (editingId) {
        setDocuments((prev) =>
          prev.map((d) => (d.id === editingId ? result : d))
        )
      } else {
        setDocuments((prev) => [result, ...prev])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten dokument?')) return

    try {
      const response = await fetch(`/api/admin/strategy/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Nie udało się usunąć dokumentu')
      }

      setDocuments((prev) => prev.filter((d) => d.id !== id))
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Add button */}
      {canCreate && !showForm && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#2b3b82] hover:bg-[#1e2d5f]"
          >
            + Dodaj dokument strategiczny
          </Button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edytuj dokument' : 'Nowy dokument strategiczny'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tytuł *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Typ dokumentu *</Label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Zakres *</Label>
                <Select
                  id="scope"
                  name="scope"
                  value={formData.scope}
                  onChange={handleInputChange}
                  disabled={userRole === 'REGIONAL_DIRECTOR'}
                >
                  {Object.entries(SCOPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              {formData.scope === 'BRAND' && (
                <div className="space-y-2">
                  <Label htmlFor="brandId">Marka *</Label>
                  <Select
                    id="brandId"
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Wybierz markę...</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {formData.scope === 'REGION' && (
                <div className="space-y-2">
                  <Label htmlFor="regionId">Region *</Label>
                  <Select
                    id="regionId"
                    name="regionId"
                    value={formData.regionId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Wybierz region...</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="validUntil">Ważny do (opcjonalne)</Label>
                <Input
                  type="date"
                  id="validUntil"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Krótki opis</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Opcjonalny opis dokumentu"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="content">Treść dokumentu * (Markdown)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={15}
                  required
                  placeholder="Wprowadź treść dokumentu w formacie Markdown..."
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUrl">Link do pliku (opcjonalnie)</Label>
                <Input
                  type="url"
                  id="fileUrl"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#2b3b82] focus:ring-[#2b3b82]"
                />
                <Label htmlFor="isActive">Dokument aktywny</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Anuluj
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2b3b82] hover:bg-[#1e2d5f]"
              >
                {isSubmitting ? 'Zapisywanie...' : editingId ? 'Zapisz zmiany' : 'Utwórz dokument'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Documents list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Dokumenty strategiczne ({documents.length})
          </h2>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">Brak dokumentów strategicznych</p>
            <p className="text-sm mt-1">Dodaj pierwszy dokument, aby określić kontekst strategiczny</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div key={doc.id}>
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {doc.title}
                        </h3>
                        {!doc.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                            Nieaktywny
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {TYPE_LABELS[doc.type]}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          {SCOPE_LABELS[doc.scope]}
                          {doc.brand && `: ${doc.brand.name}`}
                          {doc.region && `: ${doc.region.name}`}
                        </span>
                        <span className="text-gray-500">
                          v{doc.version} • {formatDate(doc.updatedAt)}
                        </span>
                      </div>
                      {doc.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(doc)}
                      >
                        {viewingId === doc.id ? 'Zwiń' : 'Podgląd'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                      >
                        Edytuj
                      </Button>
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Usuń
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content preview */}
                {viewingId === doc.id && (
                  <div className="px-4 pb-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {doc.content}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
