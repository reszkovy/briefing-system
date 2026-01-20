'use client'

import { useState } from 'react'
import { ClubContextForm } from './ClubContextForm'
import { ClubContextDisplay } from './ClubContextDisplay'
import {
  getClubCharacterLabel,
  type ClubCharacterKey,
} from '@/lib/constants/club-context'
import type { TopActivity, ActivityReasonsData } from '@/types/club-context'

interface ClubWithContext {
  id: string
  name: string
  city: string
  clubCharacter?: string | null
  customCharacter?: string | null
  keyMemberGroups?: string[] | null
  localConstraints?: string[] | null
  topActivities?: TopActivity[] | null
  activityReasons?: ActivityReasonsData | null
  localDecisionBrief?: string | null
  contextUpdatedAt?: string | Date | null
}

interface ClubContextPanelProps {
  clubs: ClubWithContext[]
}

export function ClubContextPanel({ clubs }: ClubContextPanelProps) {
  const [expandedClubId, setExpandedClubId] = useState<string | null>(null)
  const [editingClubId, setEditingClubId] = useState<string | null>(null)
  const [clubContexts, setClubContexts] = useState<Record<string, ClubWithContext>>(
    clubs.reduce((acc, club) => ({ ...acc, [club.id]: club }), {})
  )

  const handleToggleExpand = (clubId: string) => {
    setExpandedClubId(expandedClubId === clubId ? null : clubId)
    setEditingClubId(null)
  }

  const handleEdit = (clubId: string) => {
    setEditingClubId(clubId)
  }

  const handleSave = async (clubId: string) => {
    // Reload context after save
    try {
      const response = await fetch(`/api/clubs/${clubId}/context`)
      if (response.ok) {
        const data = await response.json()
        setClubContexts((prev) => ({
          ...prev,
          [clubId]: { ...prev[clubId], ...data },
        }))
      }
    } catch (err) {
      console.error('Error reloading context:', err)
    }
    setEditingClubId(null)
  }

  const handleCancel = () => {
    setEditingClubId(null)
  }

  const hasContext = (club: ClubWithContext) => {
    return (
      club.clubCharacter ||
      (club.keyMemberGroups && (club.keyMemberGroups as string[]).length > 0) ||
      (club.topActivities && (club.topActivities as TopActivity[]).length > 0) ||
      club.localDecisionBrief
    )
  }

  if (clubs.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🏢</span>
          <h3 className="font-semibold text-indigo-800">Kontekst Twoich klubów</h3>
          <span className="text-xs text-indigo-600 ml-auto">
            {clubs.filter((c) => hasContext(clubContexts[c.id])).length}/{clubs.length} uzupełnione
          </span>
        </div>

        <p className="text-sm text-indigo-700/70 mb-4">
          Uzupełnij informacje o swoich klubach, aby wspierać lepsze decyzje przy tworzeniu briefów.
        </p>

        <div className="space-y-2">
          {clubs.map((club) => {
            const context = clubContexts[club.id]
            const isExpanded = expandedClubId === club.id
            const isEditing = editingClubId === club.id
            const filled = hasContext(context)

            return (
              <div
                key={club.id}
                className="bg-white rounded-lg border border-indigo-100 overflow-hidden"
              >
                {/* Club header - always visible */}
                <button
                  onClick={() => handleToggleExpand(club.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-indigo-50/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        filled ? 'bg-[#2b3b82]' : 'bg-gray-400'
                      }`}
                    >
                      {club.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{club.name}</div>
                      <div className="text-xs text-gray-500">
                        {club.city}
                        {context.clubCharacter && (
                          <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                            {getClubCharacterLabel(
                              context.clubCharacter,
                              context.customCharacter
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {filled ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Uzupełniony
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                        Do uzupełnienia
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-indigo-100 p-4">
                    {isEditing ? (
                      <ClubContextForm
                        clubId={club.id}
                        clubName={club.name}
                        initialData={context}
                        onSave={() => handleSave(club.id)}
                        onCancel={handleCancel}
                      />
                    ) : (
                      <div className="space-y-4">
                        <ClubContextDisplay
                          clubName={club.name}
                          context={context}
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleEdit(club.id)}
                            className="px-4 py-2 bg-[#2b3b82] text-white rounded-lg hover:bg-[#1e2a5e] font-medium text-sm"
                          >
                            {filled ? 'Edytuj kontekst' : 'Uzupełnij kontekst'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
