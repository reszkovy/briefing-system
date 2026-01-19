'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ApprovalFormProps {
  briefId: string
  defaultSLA: number
}

export function ApprovalForm({ briefId, defaultSLA }: ApprovalFormProps) {
  const router = useRouter()
  const [decision, setDecision] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [slaDays, setSlaDays] = useState(defaultSLA.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!decision) {
      setError('Wybierz decyzję')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Map APPROVED_WITH_CHANGES to APPROVED for the API
      const apiDecision = decision === 'APPROVED_WITH_CHANGES' ? 'APPROVED' : decision
      const isApproving = decision === 'APPROVED' || decision === 'APPROVED_WITH_CHANGES'

      const response = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefId,
          decision: apiDecision,
          notes: decision === 'APPROVED_WITH_CHANGES'
            ? (notes ? `[Zatwierdzono ze zmianami walidatora] ${notes}` : '[Zatwierdzono ze zmianami walidatora]')
            : (notes || null),
          priority: isApproving ? priority : undefined,
          slaDays: isApproving ? parseInt(slaDays) : undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Wystąpił błąd')
      }

      router.push('/approvals')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Decision buttons */}
      <div className="space-y-2">
        <Label>Decyzja *</Label>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => setDecision('APPROVED')}
            className={`p-3 rounded-lg border-2 text-left transition-colors ${
              decision === 'APPROVED'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <span className="font-medium text-green-700">✓ Zatwierdz</span>
            <p className="text-xs text-gray-500 mt-1">
              Brief zostanie przekazany do realizacji
            </p>
          </button>

          <button
            type="button"
            onClick={() => setDecision('APPROVED_WITH_CHANGES')}
            className={`p-3 rounded-lg border-2 text-left transition-colors ${
              decision === 'APPROVED_WITH_CHANGES'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <span className="font-medium text-blue-700">✓ Zatwierdz ze zmianami</span>
            <p className="text-xs text-gray-500 mt-1">
              Zapisano zmiany - brief idzie do realizacji
            </p>
          </button>

          <button
            type="button"
            onClick={() => setDecision('CHANGES_REQUESTED')}
            className={`p-3 rounded-lg border-2 text-left transition-colors ${
              decision === 'CHANGES_REQUESTED'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-yellow-300'
            }`}
          >
            <span className="font-medium text-yellow-700">↻ Popros o poprawki</span>
            <p className="text-xs text-gray-500 mt-1">
              Manager bedzie musial wprowadzic zmiany
            </p>
          </button>

          <button
            type="button"
            onClick={() => setDecision('REJECTED')}
            className={`p-3 rounded-lg border-2 text-left transition-colors ${
              decision === 'REJECTED'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <span className="font-medium text-red-700">✕ Odrzuc</span>
            <p className="text-xs text-gray-500 mt-1">
              Brief zostanie zamkniety bez realizacji
            </p>
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          Uwagi {decision !== 'APPROVED' && '*'}
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            decision === 'CHANGES_REQUESTED'
              ? 'Opisz jakie zmiany są potrzebne...'
              : decision === 'REJECTED'
              ? 'Podaj powód odrzucenia...'
              : 'Opcjonalne uwagi...'
          }
          rows={4}
        />
      </div>

      {/* Priority and SLA (only for approval) */}
      {(decision === 'APPROVED' || decision === 'APPROVED_WITH_CHANGES') && (
        <>
          <div className="space-y-2">
            <Label htmlFor="priority">Priorytet realizacji</Label>
            <Select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Niski</option>
              <option value="MEDIUM">Średni</option>
              <option value="HIGH">Wysoki</option>
              <option value="CRITICAL">Krytyczny</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slaDays">SLA (dni robocze)</Label>
            <Select
              id="slaDays"
              value={slaDays}
              onChange={(e) => setSlaDays(e.target.value)}
            >
              {[1, 2, 3, 5, 7, 10, 14].map((days) => (
                <option key={days} value={days}>
                  {days} {days === 1 ? 'dzień' : 'dni'}
                </option>
              ))}
            </Select>
          </div>
        </>
      )}

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={loading || !decision || (decision !== 'APPROVED' && decision !== 'APPROVED_WITH_CHANGES' && !notes)}
        className="w-full"
      >
        {loading ? 'Zapisywanie...' : 'Zatwierdz decyzje'}
      </Button>
    </div>
  )
}
