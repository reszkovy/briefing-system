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

interface Material {
  name: string
  description?: string
  fileUrl?: string
}

interface Campaign {
  id: string
  title: string
  description: string | null
  objective: string
  startDate: string
  endDate: string
  materials: Material[] | null
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
  initialCampaigns: Campaign[]
  regions: Region[]
  brands: Brand[]
}

export function CampaignList({ initialCampaigns, regions, brands }: Props) {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [showForm, setShowForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterBrand, setFilterBrand] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objective: '',
    startDate: '',
    endDate: '',
    brandId: '',
    regionId: '',
    isActive: true,
    materials: [] as Material[],
  })

  // New material form
  const [newMaterial, setNewMaterial] = useState({ name: '', description: '', fileUrl: '' })

  const now = new Date()

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filterBrand && campaign.brandId !== filterBrand) return false
    if (filterStatus === 'active') {
      const start = new Date(campaign.startDate)
      const end = new Date(campaign.endDate)
      if (!(campaign.isActive && now >= start && now <= end)) return false
    }
    if (filterStatus === 'upcoming') {
      const start = new Date(campaign.startDate)
      if (!(campaign.isActive && now < start)) return false
    }
    if (filterStatus === 'ended') {
      const end = new Date(campaign.endDate)
      if (!(now > end)) return false
    }
    if (filterStatus === 'inactive' && campaign.isActive) return false
    return true
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      objective: '',
      startDate: '',
      endDate: '',
      brandId: '',
      regionId: '',
      isActive: true,
      materials: [],
    })
    setNewMaterial({ name: '', description: '', fileUrl: '' })
    setEditingCampaign(null)
    setError(null)
  }

  const openCreateForm = () => {
    resetForm()
    // Set default dates
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    setFormData(prev => ({
      ...prev,
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0],
    }))
    setShowForm(true)
  }

  const openEditForm = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      title: campaign.title,
      description: campaign.description || '',
      objective: campaign.objective,
      startDate: campaign.startDate.split('T')[0],
      endDate: campaign.endDate.split('T')[0],
      brandId: campaign.brandId || '',
      regionId: campaign.regionId || '',
      isActive: campaign.isActive,
      materials: campaign.materials || [],
    })
    setShowForm(true)
  }

  const addMaterial = () => {
    if (!newMaterial.name.trim()) return
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { ...newMaterial }],
    }))
    setNewMaterial({ name: '', description: '', fileUrl: '' })
  }

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingCampaign
        ? `/api/admin/campaigns/${editingCampaign.id}`
        : '/api/admin/campaigns'

      const method = editingCampaign ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brandId: formData.brandId || null,
          regionId: formData.regionId || null,
          materials: formData.materials.length > 0 ? formData.materials : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas zapisywania')
      }

      setShowForm(false)
      resetForm()
      router.refresh()

      // Refresh campaigns list
      const campaignsResponse = await fetch('/api/admin/campaigns')
      if (campaignsResponse.ok) {
        const updatedCampaigns = await campaignsResponse.json()
        setCampaigns(updatedCampaigns)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę kampanię?')) return

    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas usuwania')
      }

      setCampaigns(campaigns.filter(c => c.id !== campaignId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const toggleActive = async (campaign: Campaign) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaign,
          isActive: !campaign.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Błąd podczas aktualizacji')
      }

      setCampaigns(campaigns.map(c =>
        c.id === campaign.id ? { ...c, isActive: !c.isActive } : c
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

  const getCampaignStatus = (campaign: Campaign) => {
    const start = new Date(campaign.startDate)
    const end = new Date(campaign.endDate)

    if (!campaign.isActive) return { label: 'Nieaktywna', color: 'bg-gray-100 text-gray-800' }
    if (now < start) return { label: 'Zaplanowana', color: 'bg-blue-100 text-blue-800' }
    if (now > end) return { label: 'Zakończona', color: 'bg-gray-100 text-gray-600' }
    return { label: 'Aktywna', color: 'bg-green-100 text-green-800' }
  }

  return (
    <div>
      {/* Header with filters and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Kampanie globalne ({filteredCampaigns.length})</h2>
          <p className="text-sm text-gray-500">Zarządzaj kampaniami i aktywacjami dla klubów</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wszystkie statusy</option>
            <option value="active">Aktywne teraz</option>
            <option value="upcoming">Zaplanowane</option>
            <option value="ended">Zakończone</option>
            <option value="inactive">Nieaktywne</option>
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
            className="px-4 py-2 bg-[#daff47] text-[#2b3b82] rounded-lg hover:bg-[#c5eb3d] font-medium"
          >
            + Nowa kampania
          </button>
        </div>
      </div>

      {/* Timeline view of active campaigns */}
      {filteredCampaigns.filter(c => {
        const start = new Date(c.startDate)
        const end = new Date(c.endDate)
        return c.isActive && now >= start && now <= end
      }).length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span className="text-lg">📢</span> Aktywne kampanie
          </h3>
          <div className="space-y-2">
            {filteredCampaigns.filter(c => {
              const start = new Date(c.startDate)
              const end = new Date(c.endDate)
              return c.isActive && now >= start && now <= end
            }).map(campaign => (
              <div key={campaign.id} className="flex items-center gap-3 p-2 bg-white/70 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">{campaign.title}</span>
                <span className="text-sm text-gray-500">
                  do {formatDate(campaign.endDate)}
                </span>
                {campaign.brand && (
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: (campaign.brand.primaryColor || '#888') + '20',
                      color: campaign.brand.primaryColor || '#888',
                    }}
                  >
                    {campaign.brand.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingCampaign ? 'Edytuj kampanię' : 'Nowa kampania globalna'}
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
                    Nazwa kampanii *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="np. Kampania Wiosenna 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cel kampanii *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="np. Zwiększenie retencji członków o 10%"
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
                    placeholder="Szczegółowy opis kampanii i wytyczne..."
                  />
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

                {/* Materials section */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Materiały dla klubów
                  </label>

                  {/* Existing materials */}
                  {formData.materials.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.materials.map((material, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium text-sm">{material.name}</span>
                            {material.description && (
                              <span className="text-gray-500 text-sm ml-2">- {material.description}</span>
                            )}
                            {material.fileUrl && (
                              <a
                                href={material.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-sm ml-2 hover:underline"
                              >
                                [Link]
                              </a>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMaterial(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new material */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Nazwa materiału"
                    />
                    <input
                      type="text"
                      value={newMaterial.description}
                      onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Opis (opcjonalnie)"
                    />
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newMaterial.fileUrl}
                        onChange={(e) => setNewMaterial({ ...newMaterial, fileUrl: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="URL (opcjonalnie)"
                      />
                      <button
                        type="button"
                        onClick={addMaterial}
                        disabled={!newMaterial.name.trim()}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
                      >
                        + Dodaj
                      </button>
                    </div>
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
                    <span className="text-sm font-medium text-gray-700">Aktywna</span>
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
                    className="px-4 py-2 bg-[#2b3b82] text-white rounded-lg hover:bg-[#1e2a5e] disabled:opacity-50 font-medium"
                  >
                    {isSubmitting ? 'Zapisuję...' : (editingCampaign ? 'Zapisz zmiany' : 'Utwórz kampanię')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kampania
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zakres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Daty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Materiały
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
            {filteredCampaigns.map((campaign) => {
              const status = getCampaignStatus(campaign)
              return (
                <tr key={campaign.id} className={`hover:bg-gray-50 ${status.label === 'Aktywna' ? 'bg-green-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {campaign.title}
                        {status.label === 'Aktywna' && (
                          <span className="px-1.5 py-0.5 text-xs bg-green-500 text-white rounded">
                            TERAZ
                          </span>
                        )}
                      </div>
                      {campaign.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{campaign.objective}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {campaign.brand ? (
                        <span
                          className="px-2 py-0.5 text-xs rounded inline-block w-fit"
                          style={{
                            backgroundColor: (campaign.brand.primaryColor || '#888') + '20',
                            color: campaign.brand.primaryColor || '#888',
                          }}
                        >
                          {campaign.brand.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Wszystkie sieci</span>
                      )}
                      {campaign.region ? (
                        <span className="text-xs text-gray-600">{campaign.region.name}</span>
                      ) : (
                        <span className="text-xs text-gray-400">Wszystkie regiony</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    {campaign.materials && campaign.materials.length > 0 ? (
                      <span className="text-sm text-gray-600">
                        {campaign.materials.length} {campaign.materials.length === 1 ? 'materiał' : 'materiały'}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Brak</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(campaign)}
                      className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}
                    >
                      {status.label}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditForm(campaign)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              )
            })}
            {filteredCampaigns.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  {campaigns.length === 0
                    ? 'Brak kampanii. Dodaj pierwszą kampanię klikając przycisk powyżej.'
                    : 'Brak kampanii spełniających kryteria filtrowania.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
