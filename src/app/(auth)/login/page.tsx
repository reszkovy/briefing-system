'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Presentation } from 'lucide-react'

interface DemoUser {
  email: string
  name: string
  role: string
  description: string
  color: string
}

// MVP roles - fully implemented
const mvpUsers: DemoUser[] = [
  {
    email: 'anna.kowalska@benefit.pl',
    name: 'Anna Kowalska',
    role: 'CLUB_MANAGER',
    description: 'Manager lokalny - Zgłasza lokalne potrzeby i inicjatywy w oparciu o kontekst, cele i realia operacyjne.',
    color: 'bg-green-500',
  },
  {
    email: 'michal.adamski@benefit.pl',
    name: 'Michał Adamski',
    role: 'VALIDATOR',
    description: 'Manager regionalny - Weryfikuje zgłoszenia pod kątem strategii, priorytetów i dostępnych zasobów.',
    color: 'bg-orange-500',
  },
  {
    email: 'admin@benefit.pl',
    name: 'Administrator',
    role: 'ADMIN',
    description: 'Administrator systemu - Zarządza strukturą organizacji, rolami użytkowników oraz regułami systemowymi.',
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
    <div className="min-h-screen flex items-center justify-center bg-[#1a2654] p-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="regional.fit"
            width={200}
            height={150}
            priority
          />
          <p className="mt-4 text-center text-[#2b3b82]">
            System zarządzania lokalnym popytem w organizacjach rozproszonych
          </p>
          <div className="mt-4 text-center text-sm text-[#2b3b82] bg-[#daff47]/20 px-4 py-3 rounded-lg border border-[#daff47]/40">
            <p className="font-semibold">Tryb demonstracyjny</p>
            <p className="mt-1 text-[#2b3b82]/70">Wybierz rolę, aby zobaczyć, jak system wspiera podejmowanie decyzji na różnych poziomach organizacji.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* MVP Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <span className="px-3 py-1 bg-[#daff47] text-[#2b3b82] text-xs font-bold rounded-full">
              ZAKRES MVP
            </span>
          </div>

          {mvpUsers.map((user) => (
            <button
              key={user.email}
              onClick={() => handleDemoLogin(user)}
              disabled={loading !== null}
              className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                loading === user.email
                  ? 'border-[#2b3b82]/30 bg-[#2b3b82]/5'
                  : 'border-[#2b3b82]/20 hover:border-[#daff47] hover:shadow-md hover:bg-[#daff47]/5'
              } disabled:opacity-60`}
            >
              <div className={`w-12 h-12 bg-[#2b3b82] rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-[#2b3b82]">{user.name}</p>
                <p className="text-sm text-[#2b3b82]/60">{user.description}</p>
              </div>
              {loading === user.email ? (
                <div className="w-6 h-6 border-2 border-[#2b3b82] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6 text-[#2b3b82]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Future Phase Section - Zespół produkcyjny */}
        <div className="space-y-3 pt-4 border-t border-[#2b3b82]/10">
          <div className="flex items-center gap-2 justify-center">
            <span className="px-3 py-1 bg-gray-200 text-gray-500 text-xs font-bold rounded-full">
              KOLEJNY ETAP ROZWOJU
            </span>
          </div>

          <div className="w-full flex items-center gap-4 p-4 border-2 rounded-xl opacity-50 border-gray-200 bg-gray-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
              Z
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-500">Zespół produkcyjny</p>
              <p className="text-sm text-gray-400">Realizacja - Wykonuje zatwierdzone decyzje zgodnie z ustalonym zakresem i priorytetami.</p>
              <p className="text-xs text-gray-400 mt-1 italic">(funkcja niedostępna w MVP)</p>
            </div>
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.374-9.373a9 9 0 11-12.728 0" />
            </svg>
          </div>
        </div>

        {/* Pitch deck link */}
        <div className="pt-4 border-t border-[#2b3b82]/10">
          <Link
            href="/pitch"
            className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-gradient-to-r from-[#1a2654] to-[#2b3b82] text-white hover:from-[#2b3b82] hover:to-[#3c4d9e] transition-all group"
          >
            <Presentation className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Zobacz pitch deck</span>
            <span className="text-white/60 text-sm">— jaki problem rozwiązujemy?</span>
          </Link>
        </div>

        <p className="text-xs text-[#2b3b82]/40 text-center pt-4 border-t border-[#2b3b82]/10">
          To jest wersja demonstracyjna systemu.<br />Wszystkie dane i scenariusze są przykładowe.
        </p>
      </div>
    </div>
  )
}
