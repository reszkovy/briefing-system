'use client'

import { useState } from 'react'
import { ClubContextDisplay } from '@/components/clubs/ClubContextDisplay'
import type { TopActivity, ActivityReasonsData } from '@/types/club-context'

interface ClubWithContext {
  id: string
  name: string
  city: string
  tier: string
  brandName: string
  brandColor?: string | null
  regionName: string
  context: {
    clubCharacter?: string | null
    customCharacter?: string | null
    keyMemberGroups?: string[] | null
    localConstraints?: string[] | null
    topActivities?: TopActivity[] | null
    activityReasons?: ActivityReasonsData | null
    localDecisionBrief?: string | null
    contextUpdatedAt?: string | null
  }
  manager?: {
    name: string
    email: string
    phone?: string | null
  } | null
}

interface ClubContextListProps {
  clubs: ClubWithContext[]
}

export function ClubContextList({ clubs }: ClubContextListProps) {
  const [search, setSearch] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterBrand, setFilterBrand] = useState('all')
  const [filterContext, setFilterContext] = useState<'all' | 'with' | 'without'>('all')

  // Get unique regions and brands
  const regions = Array.from(new Set(clubs.map(c => c.regionName))).sort()
  const brands = Array.from(new Set(clubs.map(c => c.brandName))).sort()

  // Filter clubs
  const filteredClubs = clubs.filter(club => {
    // Search filter
    if (search && !club.name.toLowerCase().includes(search.toLowerCase()) &&
        !club.city.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    // Region filter
    if (filterRegion !== 'all' && club.regionName !== filterRegion) {
      return false
    }
    // Brand filter
    if (filterBrand !== 'all' && club.brandName !== filterBrand) {
      return false
    }
    // Context filter
    const hasContext = club.context.clubCharacter ||
                       (club.context.keyMemberGroups && club.context.keyMemberGroups.length > 0) ||
                       club.context.localDecisionBrief
    if (filterContext === 'with' && !hasContext) return false
    if (filterContext === 'without' && hasContext) return false

    return true
  })

  // Calculate stats
  const withContext = clubs.filter(c =>
    c.context.clubCharacter ||
    (c.context.keyMemberGroups && c.context.keyMemberGroups.length > 0) ||
    c.context.localDecisionBrief
  ).length
  const withoutContext = clubs.length - withContext
  const contextCoverage = Math.round((withContext / clubs.length) * 100)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-card rounded-lg shadow p-4 border-l-4 border-[#2b3b82] dark:border-rf-lime">
          <p className="text-2xl font-bold text-[#2b3b82] dark:text-rf-lime">{clubs.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Wszystkie kluby</p>
        </div>
        <div className="bg-white dark:bg-card rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-2xl font-bold text-green-600">{withContext}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Z kontekstem</p>
        </div>
        <div className="bg-white dark:bg-card rounded-lg shadow p-4 border-l-4 border-amber-500">
          <p className="text-2xl font-bold text-amber-600">{withoutContext}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bez kontekstu</p>
        </div>
        <div className="bg-white dark:bg-card rounded-lg shadow p-4 border-l-4 border-[#daff47]">
          <p className="text-2xl font-bold text-[#2b3b82] dark:text-rf-lime">{contextCoverage}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pokrycie</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-card rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Szukaj klubu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-background text-sm"
            />
          </div>

          {/* Region filter */}
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-background text-sm"
          >
            <option value="all">Wszystkie regiony</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          {/* Brand filter */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-background text-sm"
          >
            <option value="all">Wszystkie marki</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Context filter */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => setFilterContext('all')}
              className={`px-3 py-2 text-sm ${
                filterContext === 'all'
                  ? 'bg-[#2b3b82] text-white'
                  : 'bg-white dark:bg-background hover:bg-gray-50'
              }`}
            >
              Wszystkie
            </button>
            <button
              onClick={() => setFilterContext('with')}
              className={`px-3 py-2 text-sm border-l ${
                filterContext === 'with'
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-background hover:bg-gray-50'
              }`}
            >
              Z kontekstem
            </button>
            <button
              onClick={() => setFilterContext('without')}
              className={`px-3 py-2 text-sm border-l ${
                filterContext === 'without'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-background hover:bg-gray-50'
              }`}
            >
              Bez kontekstu
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Wyświetlono {filteredClubs.length} z {clubs.length} klubów
      </p>

      {/* Club list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredClubs.map(club => (
          <div key={club.id} className="bg-white dark:bg-card rounded-lg shadow overflow-hidden">
            {/* Club header */}
            <div className="px-4 py-3 border-b dark:border-border bg-gray-50 dark:bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{club.name}</h3>
                  <p className="text-sm text-gray-500">
                    {club.city} • {club.regionName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: (club.brandColor || '#888') + '20',
                      color: club.brandColor || '#888',
                    }}
                  >
                    {club.brandName}
                  </span>
                  {club.tier !== 'STANDARD' && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      club.tier === 'FLAGSHIP'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {club.tier === 'FLAGSHIP' ? '⭐ Flagship' : '👑 VIP'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Club context */}
            <div className="p-4">
              <ClubContextDisplay
                clubName={club.name}
                context={club.context}
                manager={club.manager}
                compact
              />
            </div>
          </div>
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="bg-white dark:bg-card rounded-lg shadow p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Brak wyników
          </h2>
          <p className="text-gray-500">
            Nie znaleziono klubów pasujących do kryteriów wyszukiwania.
          </p>
        </div>
      )}
    </div>
  )
}
