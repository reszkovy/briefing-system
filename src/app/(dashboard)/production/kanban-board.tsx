'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Task {
  id: string
  status: string
  dueDate: string
  assignee: {
    id: string
    name: string | null
  } | null
  brief: {
    id: string
    title: string
    priority: string
    club: {
      name: string
      brand: {
        name: string
        primaryColor: string | null
      }
    }
    template: {
      name: string
    }
  }
}

interface Column {
  id: string
  title: string
  headerBg: string
  cardBorder: string
  countBg: string
  icon: string
}

interface KanbanBoardProps {
  initialTasks: Task[]
  columns: Column[]
}

const priorityLabels: Record<string, string> = {
  LOW: 'Niski',
  MEDIUM: 'Sredni',
  HIGH: 'Wysoki',
  CRITICAL: 'Krytyczny',
}

// Task card component
function TaskCard({ task, column, isDragging }: { task: Task; column: Column; isDragging?: boolean }) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'DELIVERED'

  return (
    <div
      className={`block bg-white rounded-lg shadow-sm border-l-4 ${column.cardBorder} overflow-hidden ${
        isDragging ? 'shadow-xl ring-2 ring-[#2b3b82] opacity-90' : 'hover:shadow-md'
      } transition-all`}
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
    </div>
  )
}

// Sortable task card wrapper
function SortableTaskCard({ task, column }: { task: Task; column: Column }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link href={`/production/${task.id}`} onClick={(e) => isDragging && e.preventDefault()}>
        <TaskCard task={task} column={column} />
      </Link>
    </div>
  )
}

// Droppable column component
function DroppableColumn({
  column,
  tasks,
}: {
  column: Column
  tasks: Task[]
}) {
  return (
    <div className="flex-shrink-0 w-80">
      {/* Column header */}
      <div className={`${column.headerBg} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{column.icon}</span>
          <h3 className="font-semibold text-white">{column.title}</h3>
        </div>
        <span className={`${column.countBg} px-2.5 py-0.5 rounded-full text-sm font-bold`}>
          {tasks.length}
        </span>
      </div>

      {/* Column content */}
      <div className="bg-gray-100 rounded-b-xl p-3 min-h-[calc(100vh-280px)]">
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg">
                Przeciagnij tutaj
              </div>
            ) : (
              tasks.map((task) => (
                <SortableTaskCard key={task.id} task={task} column={column} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export function KanbanBoard({ initialTasks, columns }: KanbanBoardProps) {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const getTasksByStatus = (status: string) => {
    return tasks.filter(t => t.status === status)
  }

  const findColumnByTaskId = (taskId: string): string | null => {
    const task = tasks.find(t => t.id === taskId)
    return task ? task.status : null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeStatus = findColumnByTaskId(activeId)
    let overStatus = findColumnByTaskId(overId)

    // If dragging over a column (not a task)
    if (!overStatus && columns.find(c => c.id === overId)) {
      overStatus = overId
    }

    if (!activeStatus || !overStatus || activeStatus === overStatus) return

    // Move task to new column (optimistic update)
    setTasks(prev => prev.map(t =>
      t.id === activeId ? { ...t, status: overStatus! } : t
    ))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const task = tasks.find(t => t.id === activeId)

    if (!task) return

    // Determine the target status
    let targetStatus = findColumnByTaskId(over.id as string)
    if (!targetStatus && columns.find(c => c.id === over.id)) {
      targetStatus = over.id as string
    }

    if (!targetStatus) return

    // If status actually changed, update on server
    const originalTask = initialTasks.find(t => t.id === activeId)
    if (originalTask && originalTask.status !== task.status) {
      setIsUpdating(true)
      try {
        const response = await fetch(`/api/production/${activeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: task.status }),
        })

        if (!response.ok) {
          // Revert on error
          setTasks(prev => prev.map(t =>
            t.id === activeId ? { ...t, status: originalTask.status } : t
          ))
          console.error('Failed to update task status')
        } else {
          // Refresh to get updated data
          router.refresh()
        }
      } catch (error) {
        // Revert on error
        setTasks(prev => prev.map(t =>
          t.id === activeId ? { ...t, status: originalTask.status } : t
        ))
        console.error('Error updating task:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const activeColumn = activeTask ? columns.find(c => c.id === activeTask.status) : null

  return (
    <div className="relative">
      {isUpdating && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-[#2b3b82] text-white text-center py-2 text-sm">
          Zapisywanie zmian...
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && activeColumn && (
            <div className="w-80">
              <TaskCard task={activeTask} column={activeColumn} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
