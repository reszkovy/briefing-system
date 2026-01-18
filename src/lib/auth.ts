// NextAuth.js v5 Configuration
// Email + Password authentication

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'
import { loginSchema } from './validations/user'
import type { UserRole } from '@prisma/client'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Hasło', type: 'password' },
      },
      async authorize(credentials) {
        // Validate input
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) {
          return null
        }

        const { email, password } = validated.data

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
          },
        })

        if (!user) {
          return null
        }

        // Demo mode: allow "demo" as password for demo accounts
        const isDemoMode = password === 'demo'
        const demoEmails = [
          'anna.kowalska@benefit.pl',
          'michal.adamski@benefit.pl',
          'studio@benefit.pl',
          'admin@benefit.pl',
        ]

        if (isDemoMode && demoEmails.includes(email.toLowerCase())) {
          // Allow demo login
        } else {
          // Verify password normally
          const passwordMatch = await compare(password, user.passwordHash)
          if (!passwordMatch) {
            return null
          }
        }

        // Return user object (without password)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
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
