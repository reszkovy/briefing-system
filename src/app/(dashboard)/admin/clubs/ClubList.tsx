'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClubContextForm } from '@/components/clubs/ClubContextForm'
import { ClubContextDisplay } from '@/components/clubs/ClubContextDisplay'
import type { TopActivity, ActivityReasonsData } from '@/types/club-context'

interface ClubContext {
  clubCharacter?: string | null
  customCharacter?: string | null
  keyMemberGroups?: string[] | null
  localConstraints?: string[] | null
  topActivities?: TopActivity[] | null
  activityReasons?: ActivityReasonsData | null
  localDecisionBrief?: string | null
  contextUpdatedAt?: string | null
}

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

interface ClubUser {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface Club {
  id: string
  name: string
  code: string
  city: string
  address: string | null
  regionId: string
  brandId: string
  region: Region
  brand: Brand
  users: ClubUser[]
  _count: {
    briefs: number
  }
  createdAt: Date | string
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Props {
  initialClubs: Club[]
  regions: Region[]
  brands: Brand[]
  users: User[]
}

const roleLabels: Record<string, string> = {
  CLUB_MANAGER: 'Manager',
  VALIDATOR: 'Walidator',
}

export function ClubList({ initialClubs, regions, brands, users }: Props) {
  const router = useRouter()
  const [clubs, setClubs] = useState(initialClubs)
  const [showForm, setShowForm] = useState(false)
  const [editingClub, setEditingClub] = useState<Club | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterBrand, setFilterBrand] = useState<string>('')
  const [filterRegion, setFilterRegion] = useState<string>('')

  // Club Context Modal state
  const [showContextModal, setShowContextModal] = useState(false)
  const [contextClub, setContextClub] = useState<Club | null>(null)
  const [clubContext, setClubContext] = useState<ClubContext | null>(null)
  const [loadingContext, setLoadingContext] = useState(false)
  const [contextMode, setContextMode] = useState<'view' | 'edit'>('view')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    regionId: '',
    brandId: '',
  })

  const filteredClubs = clubs.filter(club => {
    if (filterBrand && club.brandId !== filterBrand) return false
    if (filterRegion && club.regionId !== filterRegion) return false
    return true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      city: '',
      address: '',
      regionId: '',
      brandId: '',
    })
    setEditingClub(null)
    setError(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (club: Club) => {
    setEditingClub(club)
    setFormData({
      name: club.name,
      code: club.code,
      city: club.city,
      address: club.address || '',
      regionId: club.regionId,
      brandId: club.brandId,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingClub
        ? `/api/admin/clubs/${editingClub.id}`
        : '/api/admin/clubs'

      const method = editingClub ? 'PUT' : 'POST'

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

      // Refresh clubs list
      const clubsResponse = await fetch('/api/admin/clubs')
      if (clubsResponse.ok) {
        const updatedClubs = await clubsResponse.json()
        setClubs(updatedClubs)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (clubId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten klub?')) return

    try {
      const response = await fetch(`/api/admin/clubs/${clubId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas usuwania')
      }

      setClubs(clubs.filter(c => c.id !== clubId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  // Club Context handlers
  const openContextModal = async (club: Club) => {
    setContextClub(club)
    setShowContextModal(true)
    setLoadingContext(true)
    setContextMode('view')

    try {
      const response = await fetch(`/api/clubs/${club.id}/context`)
      if (response.ok) {
        const data = await response.json()
        setClubContext(data)
      }
    } catch (err) {
      console.error('Error loading context:', err)
    } finally {
      setLoadingContext(false)
    }
  }

  const handleContextSaved = async () => {
    if (contextClub) {
      // Reload context after save
      const response = await fetch(`/api/clubs/${contextClub.id}/context`)
      if (response.ok) {
        const data = await response.json()
        setClubContext(data)
      }
    }
    setContextMode('view')
  }

  const closeContextModal = () => {
    setShowContextModal(false)
    setContextClub(null)
    setClubContext(null)
    setContextMode('view')
  }

  return (
    <div>
      {/* Header with filters and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Kluby ({filteredClubs.length})</h2>
          <p className="text-sm text-gray-500">Zarządzaj klubami i ich przypisaniami</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters */}
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
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wszystkie regiony</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            + Dodaj klub
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
                  {editingClub ? 'Edytuj klub' : 'Nowy klub'}
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
                      Nazwa klubu *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="np. Fitness Club Centrum"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kod klubu *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 font-mono"
                      placeholder="np. WAW001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Miasto *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="np. Warszawa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="np. ul. Marszałkowska 1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sieć *
                    </label>
                    <select
                      required
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Wybierz sieć...</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region *
                    </label>
                    <select
                      required
                      value={formData.regionId}
                      onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Wybierz region...</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </div>
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
                    {isSubmitting ? 'Zapisuję...' : (editingClub ? 'Zapisz zmiany' : 'Utwórz klub')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Club Context Modal */}
      {showContextModal && contextClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              {loadingContext ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#2b3b82] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : contextMode === 'edit' ? (
                <ClubContextForm
                  clubId={contextClub.id}
                  clubName={contextClub.name}
                  initialData={clubContext || undefined}
                  onSave={handleContextSaved}
                  onCancel={() => setContextMode('view')}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#2b3b82]">
                      Kontekst lokalny
                    </h2>
                    <button
                      onClick={closeContextModal}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <ClubContextDisplay
                    clubName={contextClub.name}
                    context={clubContext || {}}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={closeContextModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Zamknij
                    </button>
                    <button
                      onClick={() => setContextMode('edit')}
                      className="px-4 py-2 bg-[#2b3b82] text-white rounded-lg hover:bg-[#1e2a5e] font-medium"
                    >
                      Edytuj kontekst
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clubs list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klub
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sieć
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Przypisani użytkownicy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Briefy
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClubs.map((club) => (
              <tr key={club.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{club.name}</div>
                    <div className="text-sm text-gray-500">{club.city}{club.address && `, ${club.address}`}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{club.code}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: (club.brand.primaryColor || '#888') + '20',
                      color: club.brand.primaryColor || '#888',
                    }}
                  >
                    {club.brand.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{club.region.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {club.users.slice(0, 2).map((uc) => (
                      <span
                        key={uc.user.id}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                        title={`${uc.user.email} (${roleLabels[uc.user.role] || uc.user.role})`}
                      >
                        {uc.user.name}
                      </span>
                    ))}
                    {club.users.length > 2 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        +{club.users.length - 2}
                      </span>
                    )}
                    {club.users.length === 0 && (
                      <span className="text-xs text-gray-400">Brak</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {club._count.briefs}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openContextModal(club)}
                    className="text-[#2b3b82] hover:text-[#1e2a5e] mr-4"
                  >
                    Kontekst
                  </button>
                  <button
                    onClick={() => openEditForm(club)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(club.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
            {filteredClubs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  {clubs.length === 0
                    ? 'Brak klubów. Dodaj pierwszy klub klikając przycisk powyżej.'
                    : 'Brak klubów spełniających kryteria filtrowania.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
