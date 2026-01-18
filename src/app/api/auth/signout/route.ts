import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()

  // Clear all auth-related cookies
  const authCookies = [
    'authjs.session-token',
    'authjs.callback-url',
    'authjs.csrf-token',
    '__Secure-authjs.session-token',
    '__Secure-authjs.callback-url',
    '__Secure-authjs.csrf-token',
    '__Host-authjs.csrf-token',
    'next-auth.session-token',
    'next-auth.callback-url',
    'next-auth.csrf-token',
    '__Secure-next-auth.session-token',
    '__Secure-next-auth.callback-url',
    '__Secure-next-auth.csrf-token',
  ]

  for (const cookieName of authCookies) {
    cookieStore.delete(cookieName)
  }

  // Redirect to login page
  return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'https://briefing-system.vercel.app'))
}

export async function GET() {
  return POST()
}
