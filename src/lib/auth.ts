// NextAuth.js v5 Configuration
// Email + Password authentication

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'
import type { UserRole } from '@prisma/client'

// Demo accounts that can login with "demo" password
const DEMO_EMAILS = [
  'anna.kowalska@benefit.pl',
  'michal.adamski@benefit.pl',
  'studio@benefit.pl',
  'admin@benefit.pl',
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Hasło', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Basic validation
          const email = credentials?.email as string | undefined
          const password = credentials?.password as string | undefined

          if (!email || !password) {
            console.log('[Auth] Missing email or password')
            return null
          }

          const normalizedEmail = email.toLowerCase().trim()
          console.log('[Auth] Attempting login for:', normalizedEmail)

          // Find user
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              passwordHash: true,
            },
          })

          if (!user) {
            console.log('[Auth] User not found:', normalizedEmail)
            return null
          }

          console.log('[Auth] User found:', user.email, user.role)

          // Demo mode: allow "demo" as password for demo accounts
          const isDemoMode = password === 'demo'

          if (isDemoMode && DEMO_EMAILS.includes(normalizedEmail)) {
            console.log('[Auth] Demo login successful for:', normalizedEmail)
            // Allow demo login - return user without password check
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }

          // Verify password normally
          const passwordMatch = await compare(password, user.passwordHash)
          if (!passwordMatch) {
            console.log('[Auth] Password mismatch for:', normalizedEmail)
            return null
          }

          console.log('[Auth] Password login successful for:', normalizedEmail)
          // Return user object (without password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('[Auth] Error in authorize:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, add user data to token
      if (user) {
        token.id = user.id!
        token.role = user.role!
      }
      return token
    },
    async session({ session, token }) {
      // Add user data from token to session
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
})

// Helper function to get current user from server components/actions
export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user) {
    return null
  }
  return session.user
}

// Helper function to require authentication
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

// Helper function to require specific role(s)
export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}
