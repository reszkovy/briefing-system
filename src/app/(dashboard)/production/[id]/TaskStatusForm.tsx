'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  status: string
  assigneeId: string | null
  notes: string | null
}

interface Props {
  task: Task
  currentUserId: string
}

const statusOptions = [
  { value: 'QUEUED', label: 'W kolejce' },
  { value: 'IN_PROGRESS', label: 'W realizacji' },
  { value: 'IN_REVIEW', label: 'Do sprawdzenia' },
  { value: 'DELIVERED', label: 'Dostarczone' },
  { value: 'ON_HOLD', label: 'Wstrzymane' },
]

const statusColors: Record<string, string> = {
  QUEUED: 'bg-gray-100 text-gray-800 border-gray-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-300',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  ON_HOLD: 'bg-red-100 text-red-800 border-red-300',
}

export function TaskStatusForm({ task, currentUserId }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(task.status)
  const [notes, setNotes] = useState(task.notes || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/production/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
          assigneeId: status === 'IN_PROGRESS' ? currentUserId : task.assigneeId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas aktualizacji')
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTakeTask = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/production/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'IN_PROGRESS',
          assigneeId: currentUserId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd podczas przypisania')
      }

      setStatus('IN_PROGRESS')
      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Current status */}
      <div className={`p-3 rounded-lg border ${statusColors[task.status]}`}>
        <span className="text-sm font-medium">
          Aktualny status: {statusOptions.find(s => s.value === task.status)?.label}
        </span>
      </div>

      {/* Take task button */}
      {task.status === 'QUEUED' && !task.assigneeId && (
        <button
          onClick={handleTakeTask}
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Przypisuję...' : 'Weź zadanie'}
        </button>
      )}

      {/* Status form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zmień status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notatki
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Dodaj notatki do zadania..."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Zapisano zmiany!
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Zapisuję...' : 'Zapisz zmiany'}
        </button>
      </form>
    </div>
  )
}
