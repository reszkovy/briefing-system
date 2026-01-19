import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Dashboard now redirects to role-specific views
export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user) {
    redirect('/login')
  }

  // Redirect based on role
  switch (user.role) {
    case 'VALIDATOR':
      redirect('/approvals')
    case 'PRODUCTION':
      redirect('/production')
    case 'CLUB_MANAGER':
      redirect('/briefs')
    case 'ADMIN':
      redirect('/admin')
    default:
      redirect('/login')
  }
}
