'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface OutcomeTaggingFormProps {
  briefId: string
  currentOutcome?: string | null
  currentOutcomeNote?: string | null
  taskStatus: string
}

const OutcomeOptions = [
  { value: 'POSITIVE', label: 'Pozytywny', emoji: '✅', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'NEUTRAL', label: 'Neutralny', emoji: '➖', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: 'NEGATIVE', label: 'Negatywny', emoji: '❌', color: 'bg-red-100 text-red-800 border-red-300' },
]

export function OutcomeTaggingForm({
  briefId,
  currentOutcome,
  currentOutcomeNote,
  taskStatus,
}: OutcomeTaggingFormProps) {
  const router = useRouter()
  const [outcome, setOutcome] = useState<string | null>(currentOutcome || null)
  const [outcomeNote, setOutcomeNote] = useState(currentOutcomeNote || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Only show for delivered tasks
  if (taskStatus !== 'DELIVERED') {
    return null
  }

  const handleSubmit = async () => {
    if (!outcome) {
      setError('Wybierz wynik realizacji')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/briefs/${briefId}/outcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome,
          outcomeNote: outcomeNote.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Nie udalo sie zapisac wyniku')
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystapil blad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow p-6 border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔄</span>
        <h3 className="text-lg font-semibold text-gray-900">Learning Loop</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Jak oceniasz wynik tej realizacji? Ta informacja pomoze systemowi uczyc sie i lepiej wspierac przyszle decyzje.
      </p>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          Dziekujemy za feedback! Wynik zostal zapisany.
        </div>
      ) : (
        <>
          {/* Outcome selection */}
          <div className="flex flex-wrap gap-2 mb-4">
            {OutcomeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setOutcome(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  outcome === option.value
                    ? `${option.color} border-current ring-2 ring-offset-1 ring-current`
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{option.emoji}</span>
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Optional note */}
          <div className="mb-4">
            <label htmlFor="outcomeNote" className="block text-sm font-medium text-gray-700 mb-1">
              Notatka (opcjonalnie)
            </label>
            <textarea
              id="outcomeNote"
              value={outcomeNote}
              onChange={(e) => setOutcomeNote(e.target.value)}
              placeholder="Krotki komentarz o wyniku (max 1 zdanie)"
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || !outcome}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? 'Zapisywanie...' : 'Zapisz wynik'}
          </Button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            To jest pamiec systemowa - pomaga w kalibracji progow i lepszych decyzjach w przyszlosci.
          </p>
        </>
      )}
    </div>
  )
}
