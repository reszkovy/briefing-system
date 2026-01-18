'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut({
        callbackUrl: '/login',
        redirect: true
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: redirect manually
      window.location.href = '/login'
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-[#daff47] hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? 'Wylogowywanie...' : 'Wyloguj'}
    </button>
  )
}
