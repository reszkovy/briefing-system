import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
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

  const priorityLabels: Record<string, string> = {
    LOW: 'Niski',
    MEDIUM: 'Średni',
    HIGH: 'Wysoki',
    CRITICAL: 'Krytyczny',
  }

  // Group tasks by status
  const queuedTasks = tasks.filter(t => t.status === 'QUEUED')
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const inReviewTasks = tasks.filter(t => t.status === 'IN_REVIEW')
  const deliveredTasks = tasks.filter(t => t.status === 'DELIVERED')
  const onHoldTasks = tasks.filter(t => t.status === 'ON_HOLD')

  // Kanban column config with regional.fit-style colors
  const columns = [
    {
      id: 'QUEUED',
      title: 'W kolejce',
      tasks: queuedTasks,
      headerBg: 'bg-slate-600',
      cardBorder: 'border-l-slate-500',
      countBg: 'bg-slate-100 text-slate-700',
      icon: '📋',
    },
    {
      id: 'IN_PROGRESS',
      title: 'W realizacji',
      tasks: inProgressTasks,
      headerBg: 'bg-[#2b3b82]',
      cardBorder: 'border-l-[#2b3b82]',
      countBg: 'bg-blue-100 text-blue-700',
      icon: '⚡',
    },
    {
      id: 'IN_REVIEW',
      title: 'Do sprawdzenia',
      tasks: inReviewTasks,
      headerBg: 'bg-amber-500',
      cardBorder: 'border-l-amber-500',
      countBg: 'bg-amber-100 text-amber-700',
      icon: '👀',
    },
    {
      id: 'ON_HOLD',
      title: 'Wstrzymane',
      tasks: onHoldTasks,
      headerBg: 'bg-red-500',
      cardBorder: 'border-l-red-500',
      countBg: 'bg-red-100 text-red-700',
      icon: '⏸️',
    },
    {
      id: 'DELIVERED',
      title: 'Dostarczone',
      tasks: deliveredTasks,
      headerBg: 'bg-emerald-500',
      cardBorder: 'border-l-emerald-500',
      countBg: 'bg-emerald-100 text-emerald-700',
      icon: '✅',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Regional.fit"
                width={120}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <div className="h-6 w-px bg-white/30" />
            <h1 className="text-xl font-bold text-white">
              Kolejka Produkcji
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Summary stats bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500">Podsumowanie:</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="font-medium">{queuedTasks.length}</span>
                <span className="text-gray-500">w kolejce</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2b3b82]" />
                <span className="font-medium">{inProgressTasks.length}</span>
                <span className="text-gray-500">w realizacji</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-medium">{inReviewTasks.length}</span>
                <span className="text-gray-500">do sprawdzenia</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-medium">{deliveredTasks.length}</span>
                <span className="text-gray-500">dostarczonych</span>
              </span>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 rounded-full bg-[#daff47] text-[#2b3b82] font-semibold text-xs">
                {tasks.length} zadań łącznie
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <main className="p-4 sm:p-6 lg:p-8">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak zadań w kolejce</h2>
            <p className="text-gray-500">Nowe zadania pojawią się tutaj po zatwierdzeniu briefów.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                {/* Column header */}
                <div className={`${column.headerBg} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{column.icon}</span>
                    <h3 className="font-semibold text-white">{column.title}</h3>
                  </div>
                  <span className={`${column.countBg} px-2.5 py-0.5 rounded-full text-sm font-bold`}>
                    {column.tasks.length}
                  </span>
                </div>

                {/* Column content */}
                <div className="bg-gray-100 rounded-b-xl p-3 min-h-[calc(100vh-280px)] space-y-3">
                  {column.tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Brak zadań
                    </div>
                  ) : (
                    column.tasks.map((task) => {
                      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'DELIVERED'
                      return (
                        <Link
                          key={task.id}
                          href={`/production/${task.id}`}
                          className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 ${column.cardBorder} overflow-hidden`}
                        >
                          <div className="p-4">
                            {/* Priority & Brand badges */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  task.brief.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                  task.brief.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                  task.brief.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {priorityLabels[task.brief.priority]}
                              </span>
                              <span
                                className="px-2 py-0.5 text-xs rounded-full font-medium"
                                style={{
                                  backgroundColor: (task.brief.club.brand.primaryColor || '#888') + '20',
                                  color: task.brief.club.brand.primaryColor || '#888'
                                }}
                              >
                                {task.brief.club.brand.name}
                              </span>
                            </div>

                            {/* Title */}
                            <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                              {task.brief.title}
                            </h4>

                            {/* Meta info */}
                            <div className="text-xs text-gray-500 space-y-1">
                              <div className="flex items-center gap-1">
                                <span>📍</span>
                                <span className="truncate">{task.brief.club.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>📄</span>
                                <span>{task.brief.template.name}</span>
                              </div>
                              {task.assignee && (
                                <div className="flex items-center gap-1">
                                  <span>👤</span>
                                  <span>{task.assignee.name}</span>
                                </div>
                              )}
                            </div>

                            {/* Deadline */}
                            <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${
                              isOverdue ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              <span className="flex items-center gap-1">
                                <span>📅</span>
                                <span>{new Date(task.dueDate).toLocaleDateString('pl-PL')}</span>
                              </span>
                              {isOverdue && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold animate-pulse">
                                  Po terminie!
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
