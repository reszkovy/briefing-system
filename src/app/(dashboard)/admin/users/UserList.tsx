'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Club {
  id: string
  name: string
  city: string
  brand: {
    id: string
    name: string
    primaryColor: string | null
  }
  region: {
    id: string
    name: string
  }
}

interface Brand {
  id: string
  name: string
  primaryColor: string | null
}

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: Date | string
  clubs: {
    clubId: string
    club: Club
  }[]
}

interface Props {
  initialUsers: User[]
  clubs: Club[]
  brands: Brand[]
}

const roleLabels: Record<string, string> = {
  CLUB_MANAGER: 'Manager Klubu',
  VALIDATOR: 'Walidator Regionalny',
  PRODUCTION: 'Zespół Produkcji',
  ADMIN: 'Administrator',
}

const roleColors: Record<string, string> = {
  CLUB_MANAGER: 'bg-green-100 text-green-800',
  VALIDATOR: 'bg-orange-100 text-orange-800',
  PRODUCTION: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-purple-100 text-purple-800',
}

export function UserList({ initialUsers, clubs, brands }: Props) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'CLUB_MANAGER',
    selectedClubs: [] as string[],
    selectedBrand: '',
  })

  // Filter clubs by brand for PRODUCTION role
  const filteredClubs = formData.role === 'PRODUCTION' && formData.selectedBrand
    ? clubs.filter(c => c.brand.id === formData.selectedBrand)
    : clubs

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'CLUB_MANAGER',
      selectedClubs: [],
      selectedBrand: '',
    })
    setEditingUser(null)
    setError(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      password: '',
      role: user.role,
      selectedClubs: user.clubs.map(uc => uc.clubId),
      selectedBrand: user.clubs[0]?.club.brand.id || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'

      const method = editingUser ? 'PUT' : 'POST'

      const body: Record<string, unknown> = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        clubIds: formData.selectedClubs,
      }

      if (formData.password) {
        body.password = formData.password
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas zapisywania')
      }

      setShowForm(false)
      resetForm()
      router.refresh()

      // Refresh users list
      const usersResponse = await fetch('/api/admin/users')
      if (usersResponse.ok) {
        const updatedUsers = await usersResponse.json()
        setUsers(updatedUsers)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas usuwania')
      }

      setUsers(users.filter(u => u.id !== userId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const handleClubToggle = (clubId: string) => {
    if (formData.role === 'CLUB_MANAGER') {
      // Single club for manager
      setFormData({ ...formData, selectedClubs: [clubId] })
    } else {
      // Multiple clubs for validator/production
      const newClubs = formData.selectedClubs.includes(clubId)
        ? formData.selectedClubs.filter(id => id !== clubId)
        : [...formData.selectedClubs, clubId]
      setFormData({ ...formData, selectedClubs: newClubs })
    }
  }

  const selectAllClubsForBrand = (brandId: string) => {
    const brandClubs = clubs.filter(c => c.brand.id === brandId).map(c => c.id)
    setFormData({ ...formData, selectedClubs: brandClubs, selectedBrand: brandId })
  }

  return (
    <div>
      {/* Header with add button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Użytkownicy ({users.length})</h2>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          + Dodaj użytkownika
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingUser ? 'Edytuj użytkownika' : 'Nowy użytkownik'}
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
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hasło {editingUser ? '(zostaw puste aby nie zmieniać)' : '*'}
                    </label>
                    <input
                      type="password"
                      required={!editingUser}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rola *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({
                        ...formData,
                        role: e.target.value,
                        selectedClubs: [],
                        selectedBrand: '',
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="CLUB_MANAGER">Manager Klubu (1 klub)</option>
                      <option value="VALIDATOR">Walidator Regionalny (wiele klubów)</option>
                      <option value="PRODUCTION">Zespół Produkcji (kluby wg sieci)</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>

                {/* Club selection */}
                {formData.role !== 'ADMIN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Przypisane kluby *
                    </label>

                    {/* Quick select by brand for PRODUCTION */}
                    {formData.role === 'PRODUCTION' && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Szybki wybór - wszystkie kluby sieci:</p>
                        <div className="flex flex-wrap gap-2">
                          {brands.map(brand => (
                            <button
                              key={brand.id}
                              type="button"
                              onClick={() => selectAllClubsForBrand(brand.id)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                formData.selectedBrand === brand.id
                                  ? 'ring-2 ring-offset-2 ring-blue-500'
                                  : ''
                              }`}
                              style={{
                                backgroundColor: (brand.primaryColor || '#888') + '20',
                                color: brand.primaryColor || '#888',
                              }}
                            >
                              {brand.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Role description */}
                    <p className="text-sm text-gray-500 mb-3">
                      {formData.role === 'CLUB_MANAGER' && 'Manager może mieć przypisany tylko 1 klub.'}
                      {formData.role === 'VALIDATOR' && 'Walidator może mieć przypisanych wiele klubów z różnych sieci.'}
                      {formData.role === 'PRODUCTION' && 'Zespół produkcji może być przypisany do wybranych klubów (np. dla jednej sieci).'}
                    </p>

                    {/* Clubs grid */}
                    <div className="border rounded-lg max-h-64 overflow-y-auto p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filteredClubs.map(club => (
                          <label
                            key={club.id}
                            className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                              formData.selectedClubs.includes(club.id)
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <input
                              type={formData.role === 'CLUB_MANAGER' ? 'radio' : 'checkbox'}
                              name="club"
                              checked={formData.selectedClubs.includes(club.id)}
                              onChange={() => handleClubToggle(club.id)}
                              className="mr-3"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {club.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span
                                  className="px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: (club.brand.primaryColor || '#888') + '20',
                                    color: club.brand.primaryColor || '#888',
                                  }}
                                >
                                  {club.brand.name}
                                </span>
                                <span>{club.city}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {formData.selectedClubs.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Wybrano: {formData.selectedClubs.length} klub(ów)
                      </p>
                    )}
                  </div>
                )}

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
                    disabled={isSubmitting || (formData.role !== 'ADMIN' && formData.selectedClubs.length === 0)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {isSubmitting ? 'Zapisuję...' : (editingUser ? 'Zapisz zmiany' : 'Utwórz użytkownika')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Użytkownik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rola
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Przypisane kluby
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data utworzenia
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {user.clubs.slice(0, 3).map((uc) => (
                      <span
                        key={uc.clubId}
                        className="px-2 py-0.5 text-xs rounded"
                        style={{
                          backgroundColor: (uc.club.brand.primaryColor || '#888') + '20',
                          color: uc.club.brand.primaryColor || '#888',
                        }}
                      >
                        {uc.club.name}
                      </span>
                    ))}
                    {user.clubs.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        +{user.clubs.length - 3} więcej
                      </span>
                    )}
                    {user.clubs.length === 0 && user.role !== 'ADMIN' && (
                      <span className="text-xs text-gray-400">Brak</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditForm(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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
