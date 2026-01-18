import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { TaskStatusForm } from './TaskStatusForm'
import { TrelloSummary } from './TrelloSummary'

interface Props {
  params: { id: string }
}

export default async function ProductionTaskPage({ params }: Props) {
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

  const task = await prisma.productionTask.findUnique({
    where: { id: params.id },
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
          approvals: {
            include: {
              validator: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      assignee: true,
    },
  })

  if (!task) {
    notFound()
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

  const statusLabels: Record<string, string> = {
    QUEUED: 'W kolejce',
    IN_PROGRESS: 'W realizacji',
    IN_REVIEW: 'Do sprawdzenia',
    DELIVERED: 'Dostarczone',
    ON_HOLD: 'Wstrzymane',
  }

  const customFields = task.brief.customFields as Record<string, unknown> | null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/production" className="text-gray-500 hover:text-gray-700">
              ← Kolejka
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              Zadanie: {task.brief.code}
            </h1>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-sm text-red-600 hover:text-red-800">
              Wyloguj
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brief info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: (task.brief.club.brand.primaryColor || '#888') + '20',
                        color: task.brief.club.brand.primaryColor || '#888'
                      }}
                    >
                      {task.brief.club.brand.name}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[task.brief.priority]}`}>
                      {priorityLabels[task.brief.priority]}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{task.brief.title}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <span className="text-gray-500">Klub:</span>
                  <p className="font-medium">{task.brief.club.name}</p>
                  <p className="text-gray-500">{task.brief.club.city}</p>
                </div>
                <div>
                  <span className="text-gray-500">Szablon:</span>
                  <p className="font-medium">{task.brief.template.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Zlecający:</span>
                  <p className="font-medium">{task.brief.createdBy.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Region:</span>
                  <p className="font-medium">{task.brief.club.region.name}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Cel kampanii</h3>
                <p className="text-gray-700">{task.brief.objective}</p>
                {task.brief.kpiDescription && (
                  <p className="text-sm text-gray-600 mt-1">
                    KPI: {task.brief.kpiDescription} (cel: {task.brief.kpiTarget})
                  </p>
                )}
              </div>
            </div>

            {/* Context & Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Szczegóły briefu</h3>

              {task.brief.context && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Kontekst</h4>
                  <p className="text-gray-600">{task.brief.context}</p>
                </div>
              )}

              {task.brief.offerDetails && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Szczegóły oferty</h4>
                  <p className="text-gray-600">{task.brief.offerDetails}</p>
                </div>
              )}

              {task.brief.legalCopy && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Tekst prawny</h4>
                  <p className="text-gray-600 text-sm">{task.brief.legalCopy}</p>
                </div>
              )}
            </div>

            {/* Custom Fields */}
            {customFields && Object.keys(customFields).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pola specyficzne dla szablonu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(customFields).map(([key, value]) => (
                    <div key={key} className="border rounded p-3">
                      <span className="text-sm text-gray-500 block">{key}</span>
                      <span className="font-medium">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assets */}
            {task.brief.assetLinks && (task.brief.assetLinks as string[]).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Załączniki / Linki</h3>
                <ul className="space-y-2">
                  {(task.brief.assetLinks as string[]).map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Approval history */}
            {task.brief.approvals.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia zatwierdzeń</h3>
                <div className="space-y-3">
                  {task.brief.approvals.map((approval) => (
                    <div key={approval.id} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{approval.validator.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(approval.createdAt).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                      {approval.comment && (
                        <p className="text-sm text-gray-600 mt-1">{approval.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trello Summary */}
            <TrelloSummary task={{
              dueDate: task.dueDate,
              brief: {
                title: task.brief.title,
                objective: task.brief.objective,
                context: task.brief.context,
                offerDetails: task.brief.offerDetails,
                legalCopy: task.brief.legalCopy,
                customFields: customFields,
                assetLinks: task.brief.assetLinks as string[] | null,
                club: {
                  name: task.brief.club.name,
                  brand: {
                    name: task.brief.club.brand.name,
                  },
                },
                template: {
                  name: task.brief.template.name,
                },
              },
            }} />
          </div>

          {/* Sidebar - Task management */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status zadania</h3>
              <TaskStatusForm task={task} currentUserId={user.id} />
            </div>

            {/* Dates */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Terminy</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Termin realizacji:</span>
                  <span className="font-medium">{new Date(task.dueDate).toLocaleDateString('pl-PL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SLA:</span>
                  <span>{task.slaDays} dni</span>
                </div>
                {task.brief.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start kampanii:</span>
                    <span>{new Date(task.brief.startDate).toLocaleDateString('pl-PL')}</span>
                  </div>
                )}
                {task.brief.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Koniec kampanii:</span>
                    <span>{new Date(task.brief.endDate).toLocaleDateString('pl-PL')}</span>
                  </div>
                )}
              </div>
              {new Date(task.dueDate) < new Date() && task.status !== 'DELIVERED' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  Zadanie jest po terminie!
                </div>
              )}
            </div>

            {/* Brand guidelines */}
            {task.brief.club.brand.guidelinesUrl && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand guidelines</h3>
                <a
                  href={task.brief.club.brand.guidelinesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:underline"
                >
                  Otwórz guidelines →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
