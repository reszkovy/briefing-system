'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Region {
  id: string
  name: string
  code: string
  createdAt: Date | string
  _count: {
    clubs: number
  }
}

interface Props {
  initialRegions: Region[]
}

export function RegionList({ initialRegions }: Props) {
  const router = useRouter()
  const [regions, setRegions] = useState(initialRegions)
  const [showForm, setShowForm] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  })

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
    })
    setEditingRegion(null)
    setError(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (region: Region) => {
    setEditingRegion(region)
    setFormData({
      name: region.name,
      code: region.code,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingRegion
        ? `/api/admin/regions/${editingRegion.id}`
        : '/api/admin/regions'

      const method = editingRegion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas zapisywania')
      }

      setShowForm(false)
      resetForm()
      router.refresh()

      // Refresh regions list
      const regionsResponse = await fetch('/api/admin/regions')
      if (regionsResponse.ok) {
        const updatedRegions = await regionsResponse.json()
        setRegions(updatedRegions)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (regionId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten region?')) return

    try {
      const response = await fetch(`/api/admin/regions/${regionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas usuwania')
      }

      setRegions(regions.filter(r => r.id !== regionId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  return (
    <div>
      {/* Header with add button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Regiony ({regions.length})</h2>
          <p className="text-sm text-gray-500">Zarządzaj regionami dla klubów</p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          + Dodaj region
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingRegion ? 'Edytuj region' : 'Nowy region'}
                </h3>
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa regionu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="np. Mazowsze"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kod regionu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="np. MAZ"
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
                    {isSubmitting ? 'Zapisuję...' : (editingRegion ? 'Zapisz zmiany' : 'Utwórz region')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Regions list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liczba klubów
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {regions.map((region) => (
              <tr key={region.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{region.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{region.code}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {region._count.clubs} klubów
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditForm(region)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(region.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={region._count.clubs > 0}
                    title={region._count.clubs > 0 ? 'Nie można usunąć regionu z przypisanymi klubami' : ''}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
            {regions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Brak regionów. Dodaj pierwszy region klikając przycisk powyżej.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
