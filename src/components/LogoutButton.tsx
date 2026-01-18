'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-[#daff47] hover:text-white transition-colors"
    >
      Wyloguj
    </button>
  )
}
