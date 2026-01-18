'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface DemoUser {
  email: string
  name: string
  role: string
  description: string
  color: string
}

const demoUsers: DemoUser[] = [
  {
    email: 'anna.kowalska@benefit.pl',
    name: 'Anna Kowalska',
    role: 'CLUB_MANAGER',
    description: 'Manager Klubu - tworzy briefy dla swojego klubu',
    color: 'bg-green-500',
  },
  {
    email: 'michal.adamski@benefit.pl',
    name: 'Michał Adamski',
    role: 'VALIDATOR',
    description: 'Walidator Regionalny - zatwierdza briefy i ustala cele',
    color: 'bg-orange-500',
  },
  {
    email: 'studio@benefit.pl',
    name: 'Studio Graficzne',
    role: 'PRODUCTION',
    description: 'Zespół Produkcji - realizuje zatwierdzone briefy',
    color: 'bg-blue-500',
  },
  {
    email: 'admin@benefit.pl',
    name: 'Administrator',
    role: 'ADMIN',
    description: 'Admin - zarządza systemem, klubami i użytkownikami',
    color: 'bg-purple-500',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const handleDemoLogin = async (user: DemoUser) => {
    setError('')
    setLoading(user.email)

    try {
      const result = await signIn('credentials', {
        email: user.email,
        password: 'demo', // Special demo password
        redirect: false,
      })

      if (result?.error) {
        setError('Błąd logowania. Spróbuj ponownie.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Wystąpił błąd podczas logowania')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            regional.fit
          </h1>
          <p className="mt-2 text-center text-gray-600">
            System briefowania dla sieci fitness
          </p>
          <p className="mt-4 text-center text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
            Tryb demonstracyjny - wybierz rolę aby zobaczyć system
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700 text-center">
            Wybierz rolę do zalogowania:
          </p>

          {demoUsers.map((user) => (
            <button
              key={user.email}
              onClick={() => handleDemoLogin(user)}
              disabled={loading !== null}
              className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                loading === user.email
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
              } disabled:opacity-60`}
            >
              <div className={`w-12 h-12 ${user.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.description}</p>
              </div>
              {loading === user.email ? (
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center pt-4 border-t">
          To jest wersja demonstracyjna systemu. Wszystkie dane są przykładowe.
        </p>
      </div>
    </div>
  )
}
