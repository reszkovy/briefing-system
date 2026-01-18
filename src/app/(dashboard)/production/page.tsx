import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { LogoutButton } from '@/components/LogoutButton'

export default async function ProductionPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || user.role !== 'PRODUCTION') {
    redirect('/dashboard')
  }

  // Get all production tasks
  const tasks = await prisma.productionTask.findMany({
    include: {
      brief: {
        include: {
          club: {
            include: {
              brand: true,
              region: true,
            },
          },
          template: true,
          createdBy: true,
        },
      },
      assignee: true,
    },
    orderBy: [
      { brief: { priority: 'desc' } },
      { dueDate: 'asc' },
    ],
  })

  const statusLabels: Record<string, string> = {
    QUEUED: 'W kolejce',
    IN_PROGRESS: 'W realizacji',
    IN_REVIEW: 'Do sprawdzenia',
    DELIVERED: 'Dostarczone',
    ON_HOLD: 'Wstrzymane',
  }

  const statusColors: Record<string, string> = {
    QUEUED: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    DELIVERED: 'bg-green-100 text-green-800',
    ON_HOLD: 'bg-red-100 text-red-800',
  }

  const priorityLabels: Record<string, string> = {
    LOW: 'Niski',
    MEDIUM: 'Średni',
    HIGH: 'Wysoki',
    CRITICAL: 'Krytyczny',
  }

  const priorityColors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-blue-100 text-blue-600',
    HIGH: 'bg-orange-100 text-orange-600',
    CRITICAL: 'bg-red-100 text-red-600',
  }

  // Group tasks by status
  const queuedTasks = tasks.filter(t => t.status === 'QUEUED')
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const inReviewTasks = tasks.filter(t => t.status === 'IN_REVIEW')
  const deliveredTasks = tasks.filter(t => t.status === 'DELIVERED')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Kolejka Produkcji
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">W kolejce</h3>
            <p className="text-2xl font-bold text-gray-900">{queuedTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">W realizacji</h3>
            <p className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Do sprawdzenia</h3>
            <p className="text-2xl font-bold text-yellow-600">{inReviewTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Dostarczone</h3>
            <p className="text-2xl font-bold text-green-600">{deliveredTasks.length}</p>
          </div>
        </div>

        {/* Tasks list */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Wszystkie zadania</h2>
          </div>

          {tasks.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Brak zadań w kolejce
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/production/${task.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[task.status]}`}>
                          {statusLabels[task.status]}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[task.brief.priority]}`}>
                          {priorityLabels[task.brief.priority]}
                        </span>
                        <span
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: (task.brief.club.brand.primaryColor || '#888') + '20',
                            color: task.brief.club.brand.primaryColor || '#888'
                          }}
                        >
                          {task.brief.club.brand.name}
                        </span>
                      </div>

                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        {task.brief.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{task.brief.code}</span>
                        <span>•</span>
                        <span>{task.brief.template.name}</span>
                        <span>•</span>
                        <span>{task.brief.club.name}</span>
                      </div>

                      {task.assignee && (
                        <div className="mt-2 text-sm text-gray-600">
                          Przypisane do: {task.assignee.name}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Termin: {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                      </div>
                      <div className="text-sm text-gray-500">
                        SLA: {task.slaDays} dni
                      </div>
                      {new Date(task.dueDate) < new Date() && task.status !== 'DELIVERED' && (
                        <div className="text-sm text-red-600 font-medium mt-1">
                          Po terminie!
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
