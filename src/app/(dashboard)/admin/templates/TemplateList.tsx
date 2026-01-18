'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Brand {
  id: string
  name: string
  code: string
  primaryColor: string | null
  guidelinesUrl: string | null
  logoUrl: string | null
  createdAt: Date | string
}

interface Template {
  id: string
  name: string
  code: string
  description: string | null
  brandId: string | null
  brand: Brand | null
  requiredFields: Record<string, unknown> | null
  defaultSLADays: number
  isActive: boolean
  createdAt: Date | string
}

interface Props {
  initialTemplates: Template[]
  brands: Brand[]
}

export function TemplateList({ initialTemplates, brands }: Props) {
  const router = useRouter()
  const [templates, setTemplates] = useState(initialTemplates)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    brandId: '',
    defaultSLADays: 5,
    isActive: true,
    requiredFieldsJson: '',
  })

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      brandId: '',
      defaultSLADays: 5,
      isActive: true,
      requiredFieldsJson: '',
    })
    setEditingTemplate(null)
    setError(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      code: template.code,
      description: template.description || '',
      brandId: template.brandId || '',
      defaultSLADays: template.defaultSLADays,
      isActive: template.isActive,
      requiredFieldsJson: template.requiredFields
        ? JSON.stringify(template.requiredFields, null, 2)
        : '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate JSON if provided
      let requiredFields = null
      if (formData.requiredFieldsJson.trim()) {
        try {
          requiredFields = JSON.parse(formData.requiredFieldsJson)
        } catch {
          throw new Error('Nieprawidłowy format JSON w polach wymaganych')
        }
      }

      const url = editingTemplate
        ? `/api/admin/templates/${editingTemplate.id}`
        : '/api/admin/templates'

      const method = editingTemplate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          description: formData.description || null,
          brandId: formData.brandId || null,
          defaultSLADays: formData.defaultSLADays,
          isActive: formData.isActive,
          requiredFields,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas zapisywania')
      }

      setShowForm(false)
      resetForm()
      router.refresh()

      // Refresh templates list
      const templatesResponse = await fetch('/api/admin/templates')
      if (templatesResponse.ok) {
        const updatedTemplates = await templatesResponse.json()
        setTemplates(updatedTemplates)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten szablon?')) return

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas usuwania')
      }

      setTemplates(templates.filter(t => t.id !== templateId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const toggleActive = async (template: Template) => {
    try {
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...template,
          isActive: !template.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Błąd podczas aktualizacji')
      }

      setTemplates(templates.map(t =>
        t.id === template.id ? { ...t, isActive: !t.isActive } : t
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  return (
    <div>
      {/* Header with add button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Szablony briefów ({templates.length})</h2>
          <p className="text-sm text-gray-500">Zarządzaj szablonami formularzy briefów</p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          + Dodaj szablon
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingTemplate ? 'Edytuj szablon' : 'Nowy szablon'}
                </h3>
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nazwa szablonu *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="np. Plakat / Ulotka drukowana"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kod szablonu *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 font-mono"
                      placeholder="np. PRINT_POSTER"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opis
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Krótki opis szablonu..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ograniczenie do sieci
                    </label>
                    <select
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Wszystkie sieci</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Domyślne SLA (dni) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={60}
                      value={formData.defaultSLADays}
                      onChange={(e) => setFormData({ ...formData, defaultSLADays: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Aktywny</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pola wymagane (JSON Schema)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Opcjonalnie - definiuje dodatkowe pola formularza specyficzne dla tego typu briefu
                  </p>
                  <textarea
                    value={formData.requiredFieldsJson}
                    onChange={(e) => setFormData({ ...formData, requiredFieldsJson: e.target.value })}
                    rows={10}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder='{"type": "object", "properties": {...}}'
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {isSubmitting ? 'Zapisuję...' : (editingTemplate ? 'Zapisz zmiany' : 'Utwórz szablon')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Templates list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Szablon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sieć
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SLA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    {template.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{template.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{template.code}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {template.brand ? (
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: (template.brand.primaryColor || '#888') + '20',
                        color: template.brand.primaryColor || '#888',
                      }}
                    >
                      {template.brand.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Wszystkie</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {template.defaultSLADays} dni
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(template)}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      template.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {template.isActive ? 'Aktywny' : 'Nieaktywny'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditForm(template)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
