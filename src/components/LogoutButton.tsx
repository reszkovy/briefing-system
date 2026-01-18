'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:text-red-800"
    >
      Wyloguj
    </button>
  )
}
