'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Region {
  id: string
  name: string
  code: string
}

interface Brand {
  id: string
  name: string
  code: string
  primaryColor: string | null
}

interface SalesFocus {
  id: string
  title: string
  description: string | null
  period: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  startDate: string
  endDate: string
  brandId: string | null
  regionId: string | null
  brand: Brand | null
  region: Region | null
  createdBy: {
    id: string
    name: string
    email: string
  }
  isActive: boolean
  createdAt: string
}

interface Props {
  initialFocuses: SalesFocus[]
  regions: Region[]
  brands: Brand[]
}

const periodLabels: Record<string, string> = {
  MONTHLY: 'Miesięczny',
  QUARTERLY: 'Kwartalny',
  YEARLY: 'Roczny',
}

const periodColors: Record<string, string> = {
  MONTHLY: 'bg-blue-100 text-blue-800',
  QUARTERLY: 'bg-purple-100 text-purple-800',
  YEARLY: 'bg-amber-100 text-amber-800',
}

export function FocusList({ initialFocuses, regions, brands }: Props) {
  const router = useRouter()
  const [focuses, setFocuses] = useState(initialFocuses)
  const [showForm, setShowForm] = useState(false)
  const [editingFocus, setEditingFocus] = useState<SalesFocus | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterPeriod, setFilterPeriod] = useState<string>('')
  const [filterBrand, setFilterBrand] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    period: 'MONTHLY' as 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    startDate: '',
    endDate: '',
    brandId: '',
    regionId: '',
    isActive: true,
  })

  const filteredFocuses = focuses.filter(focus => {
    if (filterPeriod && focus.period !== filterPeriod) return false
    if (filterBrand && focus.brandId !== filterBrand) return false
    return true
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      period: 'MONTHLY',
      startDate: '',
      endDate: '',
      brandId: '',
      regionId: '',
      isActive: true,
    })
    setEditingFocus(null)
    setError(null)
  }

  const openCreateForm = () => {
    resetForm()
    // Set default dates based on current month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    setFormData(prev => ({
      ...prev,
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
    }))
    setShowForm(true)
  }

  const openEditForm = (focus: SalesFocus) => {
    setEditingFocus(focus)
    setFormData({
      title: focus.title,
      description: focus.description || '',
      period: focus.period,
      startDate: focus.startDate.split('T')[0],
      endDate: focus.endDate.split('T')[0],
      brandId: focus.brandId || '',
      regionId: focus.regionId || '',
      isActive: focus.isActive,
    })
    setShowForm(true)
  }

  const handlePeriodChange = (period: 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (period) {
      case 'MONTHLY':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'QUARTERLY':
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1)
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0)
        break
      case 'YEARLY':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
    }

    setFormData(prev => ({
      ...prev,
      period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingFocus
        ? `/api/admin/focus/${editingFocus.id}`
        : '/api/admin/focus'

      const method = editingFocus ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brandId: formData.brandId || null,
          regionId: formData.regionId || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas zapisywania')
      }

      setShowForm(false)
      resetForm()
      router.refresh()

      // Refresh focuses list
      const focusesResponse = await fetch('/api/admin/focus')
      if (focusesResponse.ok) {
        const updatedFocuses = await focusesResponse.json()
        setFocuses(updatedFocuses)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (focusId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten cel?')) return

    try {
      const response = await fetch(`/api/admin/focus/${focusId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas usuwania')
      }

      setFocuses(focuses.filter(f => f.id !== focusId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const toggleActive = async (focus: SalesFocus) => {
    try {
      const response = await fetch(`/api/admin/focus/${focus.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...focus,
          isActive: !focus.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Błąd podczas aktualizacji')
      }

      setFocuses(focuses.map(f =>
        f.id === focus.id ? { ...f, isActive: !f.isActive } : f
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const isCurrentlyActive = (focus: SalesFocus) => {
    const now = new Date()
    const start = new Date(focus.startDate)
    const end = new Date(focus.endDate)
    return focus.isActive && now >= start && now <= end
  }

  return (
    <div>
      {/* Header with filters and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Cele sprzedażowe ({filteredFocuses.length})</h2>
          <p className="text-sm text-gray-500">Zarządzaj celami miesięcznymi, kwartalnymi i rocznymi</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters */}
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wszystkie okresy</option>
            <option value="MONTHLY">Miesięczne</option>
            <option value="QUARTERLY">Kwartalne</option>
            <option value="YEARLY">Roczne</option>
          </select>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wszystkie sieci</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            + Dodaj cel
          </button>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingFocus ? 'Edytuj cel' : 'Nowy cel sprzedażowy'}
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
                    Tytuł celu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="np. Zwiększenie zapisów na zajęcia jogi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opis (opcjonalnie)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Szczegółowy opis celu i wytyczne..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Okres *
                  </label>
                  <div className="flex gap-3">
                    {(['MONTHLY', 'QUARTERLY', 'YEARLY'] as const).map(period => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => handlePeriodChange(period)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.period === period
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {periodLabels[period]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data rozpoczęcia *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data zakończenia *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sieć (opcjonalnie)
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
                    <p className="text-xs text-gray-500 mt-1">Pozostaw puste dla wszystkich sieci</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region (opcjonalnie)
                    </label>
                    <select
                      value={formData.regionId}
                      onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Wszystkie regiony</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Pozostaw puste dla wszystkich regionów</p>
                  </div>
                </div>

                <div className="flex items-center">
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
                    {isSubmitting ? 'Zapisuję...' : (editingFocus ? 'Zapisz zmiany' : 'Utwórz cel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Focuses list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Okres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zakres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Daty
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
            {filteredFocuses.map((focus) => (
              <tr key={focus.id} className={`hover:bg-gray-50 ${isCurrentlyActive(focus) ? 'bg-green-50' : ''}`}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      {focus.title}
                      {isCurrentlyActive(focus) && (
                        <span className="px-1.5 py-0.5 text-xs bg-green-500 text-white rounded">
                          TERAZ
                        </span>
                      )}
                    </div>
                    {focus.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{focus.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${periodColors[focus.period]}`}>
                    {periodLabels[focus.period]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {focus.brand ? (
                      <span
                        className="px-2 py-0.5 text-xs rounded inline-block w-fit"
                        style={{
                          backgroundColor: (focus.brand.primaryColor || '#888') + '20',
                          color: focus.brand.primaryColor || '#888',
                        }}
                      >
                        {focus.brand.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Wszystkie sieci</span>
                    )}
                    {focus.region ? (
                      <span className="text-xs text-gray-600">{focus.region.name}</span>
                    ) : (
                      <span className="text-xs text-gray-400">Wszystkie regiony</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(focus.startDate)} - {formatDate(focus.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(focus)}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      focus.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {focus.isActive ? 'Aktywny' : 'Nieaktywny'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditForm(focus)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(focus.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
            {filteredFocuses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {focuses.length === 0
                    ? 'Brak celów. Dodaj pierwszy cel klikając przycisk powyżej.'
                    : 'Brak celów spełniających kryteria filtrowania.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
