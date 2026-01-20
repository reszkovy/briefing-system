'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  CLUB_CHARACTERS,
  KEY_MEMBER_GROUPS,
  LOCAL_CONSTRAINTS,
  ACTIVITY_REASONS,
  POPULARITY_LEVELS,
  COMMON_ACTIVITIES,
  type ClubCharacterKey,
  type KeyMemberGroupKey,
  type LocalConstraintKey,
  type ActivityReasonKey,
  type PopularityLevelKey,
} from '@/lib/constants/club-context'
import type { TopActivity, ActivityReasonsData } from '@/types/club-context'

interface ClubContextFormProps {
  clubId: string
  clubName: string
  initialData?: {
    clubCharacter?: string | null
    customCharacter?: string | null
    keyMemberGroups?: string[] | null
    localConstraints?: string[] | null
    topActivities?: TopActivity[] | null
    activityReasons?: ActivityReasonsData | null
    localDecisionBrief?: string | null
  }
  onSave: () => void
  onCancel: () => void
}

export function ClubContextForm({
  clubId,
  clubName,
  initialData,
  onSave,
  onCancel,
}: ClubContextFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state - Static Profile
  const [clubCharacter, setClubCharacter] = useState<string | null>(
    initialData?.clubCharacter || null
  )
  const [customCharacter, setCustomCharacter] = useState(
    initialData?.customCharacter || ''
  )
  const [keyMemberGroups, setKeyMemberGroups] = useState<string[]>(
    (initialData?.keyMemberGroups as string[]) || []
  )
  const [customMemberGroup, setCustomMemberGroup] = useState('')
  const [localConstraints, setLocalConstraints] = useState<string[]>(
    (initialData?.localConstraints as string[]) || []
  )
  const [customConstraint, setCustomConstraint] = useState('')

  // Form state - Dynamic Context
  const [topActivities, setTopActivities] = useState<TopActivity[]>(
    (initialData?.topActivities as TopActivity[]) || []
  )
  const [activityReasons, setActivityReasons] = useState<ActivityReasonsData>(
    (initialData?.activityReasons as ActivityReasonsData) || { selected: [] }
  )

  // Form state - Local Decision Brief
  const [localDecisionBrief, setLocalDecisionBrief] = useState(
    initialData?.localDecisionBrief || ''
  )

  // Handlers
  const handleMemberGroupToggle = (key: string) => {
    const standardGroups = keyMemberGroups.filter((g) => !g.startsWith('custom:'))
    const customGroups = keyMemberGroups.filter((g) => g.startsWith('custom:'))

    if (keyMemberGroups.includes(key)) {
      setKeyMemberGroups((prev) => prev.filter((g) => g !== key))
    } else if (standardGroups.length + customGroups.length < 3) {
      setKeyMemberGroups((prev) => [...prev, key])
    }
  }

  const handleAddCustomMemberGroup = () => {
    if (customMemberGroup.trim() && keyMemberGroups.length < 3) {
      setKeyMemberGroups((prev) => [...prev, `custom:${customMemberGroup.trim()}`])
      setCustomMemberGroup('')
    }
  }

  const handleConstraintToggle = (key: string) => {
    if (localConstraints.includes(key)) {
      setLocalConstraints((prev) => prev.filter((c) => c !== key))
    } else {
      setLocalConstraints((prev) => [...prev, key])
    }
  }

  const handleAddCustomConstraint = () => {
    if (customConstraint.trim()) {
      setLocalConstraints((prev) => [...prev, `custom:${customConstraint.trim()}`])
      setCustomConstraint('')
    }
  }

  const handleAddActivity = () => {
    if (topActivities.length < 3) {
      setTopActivities((prev) => [...prev, { name: '', popularity: 'MEDIUM' }])
    }
  }

  const handleUpdateActivity = (
    index: number,
    field: 'name' | 'popularity',
    value: string
  ) => {
    setTopActivities((prev) =>
      prev.map((act, i) => (i === index ? { ...act, [field]: value } : act))
    )
  }

  const handleRemoveActivity = (index: number) => {
    setTopActivities((prev) => prev.filter((_, i) => i !== index))
  }

  const handleReasonToggle = (key: string) => {
    setActivityReasons((prev) => ({
      ...prev,
      selected: prev.selected.includes(key)
        ? prev.selected.filter((r) => r !== key)
        : [...prev.selected, key],
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/clubs/${clubId}/context`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubCharacter,
          customCharacter: clubCharacter === 'CUSTOM' ? customCharacter : null,
          keyMemberGroups,
          localConstraints,
          topActivities: topActivities.filter((a) => a.name.trim()),
          activityReasons,
          localDecisionBrief: localDecisionBrief.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd zapisywania')
      }

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-[#2b3b82]">
          Kontekst lokalny: {clubName}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Informacje pomagające w podejmowaniu lepszych decyzji dla tego klubu
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ============================================ */}
      {/* SECTION 1: CLUB PROFILE - Static Context */}
      {/* ============================================ */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏢</span>
          <h3 className="font-semibold text-[#2b3b82]">Profil klubu</h3>
          <span className="text-xs text-gray-400">(dane rzadko zmieniane)</span>
        </div>

        {/* Club Character */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Charakter klubu</Label>
          <p className="text-xs text-gray-500">
            Jak najlepiej opisać profil Twojego klubu?
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CLUB_CHARACTERS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setClubCharacter(key)
                  if (key !== 'CUSTOM') setCustomCharacter('')
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${
                  clubCharacter === key
                    ? 'bg-[#2b3b82] text-white border-[#2b3b82]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#2b3b82]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {clubCharacter === 'CUSTOM' && (
            <Input
              value={customCharacter}
              onChange={(e) => setCustomCharacter(e.target.value.slice(0, 50))}
              placeholder="Opisz charakter klubu (max 50 znaków)"
              maxLength={50}
              className="mt-2"
            />
          )}
        </div>

        {/* Key Member Groups */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Kluczowe grupy członków</Label>
            <span className="text-xs text-gray-500">{keyMemberGroups.length}/3</span>
          </div>
          <p className="text-xs text-gray-500">
            Wybierz do 3 grup, które najlepiej opisują Twoich członków
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(KEY_MEMBER_GROUPS).map(([key, label]) => {
              const isSelected = keyMemberGroups.includes(key)
              const canSelect = isSelected || keyMemberGroups.length < 3
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!canSelect && !isSelected}
                  onClick={() => handleMemberGroupToggle(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${
                    isSelected
                      ? 'bg-[#2b3b82] text-white border-[#2b3b82]'
                      : canSelect
                        ? 'bg-white text-gray-700 border-gray-200 hover:border-[#2b3b82]'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          {/* Custom groups */}
          <div className="flex gap-2 mt-2">
            <Input
              value={customMemberGroup}
              onChange={(e) => setCustomMemberGroup(e.target.value.slice(0, 50))}
              placeholder="Dodaj własną grupę..."
              maxLength={50}
              className="flex-1"
              disabled={keyMemberGroups.length >= 3}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomMemberGroup}
              disabled={!customMemberGroup.trim() || keyMemberGroups.length >= 3}
            >
              Dodaj
            </Button>
          </div>
          {/* Display custom groups */}
          <div className="flex flex-wrap gap-2">
            {keyMemberGroups
              .filter((g) => g.startsWith('custom:'))
              .map((group, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-[#daff47] text-[#2b3b82] border border-[#2b3b82]/20"
                >
                  {group.slice(7)}
                  <button
                    type="button"
                    onClick={() =>
                      setKeyMemberGroups((prev) => prev.filter((g) => g !== group))
                    }
                    className="ml-1 hover:text-red-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
          </div>
        </div>

        {/* Local Constraints */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Lokalne ograniczenia{' '}
            <span className="text-gray-400 font-normal">(opcjonalne)</span>
          </Label>
          <p className="text-xs text-gray-500">
            Czynniki, które należy brać pod uwagę przy decyzjach
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LOCAL_CONSTRAINTS).map(([key, label]) => {
              const isSelected = localConstraints.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleConstraintToggle(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${
                    isSelected
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          {/* Custom constraint */}
          <div className="flex gap-2 mt-2">
            <Input
              value={customConstraint}
              onChange={(e) => setCustomConstraint(e.target.value.slice(0, 50))}
              placeholder="Dodaj własne ograniczenie..."
              maxLength={50}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomConstraint}
              disabled={!customConstraint.trim()}
            >
              Dodaj
            </Button>
          </div>
          {/* Display custom constraints */}
          <div className="flex flex-wrap gap-2">
            {localConstraints
              .filter((c) => c.startsWith('custom:'))
              .map((constraint, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-amber-50 text-amber-800 border border-amber-200"
                >
                  {constraint.slice(7)}
                  <button
                    type="button"
                    onClick={() =>
                      setLocalConstraints((prev) =>
                        prev.filter((c) => c !== constraint)
                      )
                    }
                    className="ml-1 hover:text-red-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 2: POPULAR ACTIVITIES - Dynamic Context */}
      {/* ============================================ */}
      <div className="space-y-5 border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="font-semibold text-[#2b3b82]">Popularne aktywności</h3>
          <span className="text-xs text-gray-400">
            (aktualizuj gdy zmieniają się wzorce)
          </span>
        </div>

        {/* Top Activities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Co najlepiej działa w Twoim klubie?
            </Label>
            <span className="text-xs text-gray-500">
              {topActivities.length}/3 aktywności
            </span>
          </div>

          {topActivities.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
            >
              <div className="flex-1">
                <Input
                  value={activity.name}
                  onChange={(e) => handleUpdateActivity(idx, 'name', e.target.value)}
                  placeholder="Nazwa aktywności"
                  list="common-activities"
                />
              </div>
              <div className="flex gap-1">
                {(Object.keys(POPULARITY_LEVELS) as PopularityLevelKey[]).map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleUpdateActivity(idx, 'popularity', level)}
                      className={`px-2 py-1 text-xs rounded transition-all ${
                        activity.popularity === level
                          ? level === 'HIGH'
                            ? 'bg-green-600 text-white'
                            : level === 'MEDIUM'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-400 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {POPULARITY_LEVELS[level]}
                    </button>
                  )
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveActivity(idx)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                ✕
              </button>
            </div>
          ))}

          {topActivities.length < 3 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddActivity}
              className="w-full border-dashed"
            >
              + Dodaj aktywność
            </Button>
          )}

          <datalist id="common-activities">
            {COMMON_ACTIVITIES.map((act) => (
              <option key={act} value={act} />
            ))}
          </datalist>
        </div>

        {/* Activity Reasons */}
        {topActivities.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Dlaczego te aktywności działają?
            </Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ACTIVITY_REASONS).map(([key, label]) => {
                const isSelected = activityReasons.selected.includes(key)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleReasonToggle(key)}
                    className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${
                      isSelected
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <Textarea
              value={activityReasons.note || ''}
              onChange={(e) =>
                setActivityReasons((prev) => ({
                  ...prev,
                  note: e.target.value.slice(0, 120),
                }))
              }
              placeholder="Opcjonalnie: jedno zdanie wyjaśnienia (max 120 znaków)"
              maxLength={120}
              rows={2}
              className="mt-2"
            />
            <p className="text-xs text-gray-400 text-right">
              {activityReasons.note?.length || 0}/120
            </p>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* SECTION 3: LOCAL DECISION BRIEF */}
      {/* ============================================ */}
      <div className="space-y-3 border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h3 className="font-semibold text-[#2b3b82]">Brief decyzyjny</h3>
          <span className="text-xs text-gray-400">(opcjonalny)</span>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Co obecnie ma największe znaczenie przy podejmowaniu decyzji w Twoim
            klubie?
          </Label>
          <p className="text-xs text-gray-500">
            Np. sezonowość, zmiany w frekwencji, zmiany kadrowe
          </p>
          <Textarea
            value={localDecisionBrief}
            onChange={(e) =>
              setLocalDecisionBrief(e.target.value.slice(0, 400))
            }
            placeholder="Opisz aktualną sytuację decyzyjną..."
            maxLength={400}
            rows={3}
          />
          <p className="text-xs text-gray-400 text-right">
            {localDecisionBrief.length}/400
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* ACTIONS */}
      {/* ============================================ */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Anuluj
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#2b3b82] hover:bg-[#1e2a5e]"
        >
          {loading ? 'Zapisywanie...' : 'Zapisz kontekst'}
        </Button>
      </div>
    </div>
  )
}
