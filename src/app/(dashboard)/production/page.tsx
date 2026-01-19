import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/LogoutButton'
import { KanbanBoard } from './kanban-board'

export default async function ProductionPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || user.role !== 'PRODUCTION') {
    redirect('/')
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

  // Group tasks by status for stats
  const queuedTasks = tasks.filter(t => t.status === 'QUEUED')
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const inReviewTasks = tasks.filter(t => t.status === 'IN_REVIEW')
  const deliveredTasks = tasks.filter(t => t.status === 'DELIVERED')

  // Kanban column config with regional.fit-style colors
  const columns = [
    {
      id: 'QUEUED',
      title: 'W kolejce',
      headerBg: 'bg-slate-600',
      cardBorder: 'border-l-slate-500',
      countBg: 'bg-slate-100 text-slate-700',
      icon: '📋',
    },
    {
      id: 'IN_PROGRESS',
      title: 'W realizacji',
      headerBg: 'bg-[#2b3b82]',
      cardBorder: 'border-l-[#2b3b82]',
      countBg: 'bg-blue-100 text-blue-700',
      icon: '⚡',
    },
    {
      id: 'IN_REVIEW',
      title: 'Do sprawdzenia',
      headerBg: 'bg-amber-500',
      cardBorder: 'border-l-amber-500',
      countBg: 'bg-amber-100 text-amber-700',
      icon: '👀',
    },
    {
      id: 'ON_HOLD',
      title: 'Wstrzymane',
      headerBg: 'bg-red-500',
      cardBorder: 'border-l-red-500',
      countBg: 'bg-red-100 text-red-700',
      icon: '⏸️',
    },
    {
      id: 'DELIVERED',
      title: 'Dostarczone',
      headerBg: 'bg-emerald-500',
      cardBorder: 'border-l-emerald-500',
      countBg: 'bg-emerald-100 text-emerald-700',
      icon: '✅',
    },
  ]

  // Serialize tasks for client component
  const serializedTasks = tasks.map(task => ({
    id: task.id,
    status: task.status,
    dueDate: task.dueDate.toISOString(),
    assignee: task.assignee ? {
      id: task.assignee.id,
      name: task.assignee.name,
    } : null,
    brief: {
      id: task.brief.id,
      title: task.brief.title,
      priority: task.brief.priority,
      club: {
        name: task.brief.club.name,
        brand: {
          name: task.brief.club.brand.name,
          primaryColor: task.brief.club.brand.primaryColor,
        },
      },
      template: {
        name: task.brief.template.name,
      },
    },
  }))

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-[#2b3b82] shadow">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/logo-white.svg"
                alt="regional.fit"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <span className="text-white/50">|</span>
            <h1 className="text-xl font-semibold text-white">Studio Graficzne</h1>
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
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-gray-400">
                Przeciagnij karty aby zmienic status
              </span>
              <span className="px-3 py-1 rounded-full bg-[#daff47] text-[#2b3b82] font-semibold text-xs">
                {tasks.length} zadan lacznie
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak zadan w kolejce</h2>
            <p className="text-gray-500">Nowe zadania pojawia sie tutaj po zatwierdzeniu briefow.</p>
          </div>
        ) : (
          <KanbanBoard initialTasks={serializedTasks} columns={columns} />
        )}
      </main>
    </div>
  )
}
