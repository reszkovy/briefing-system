// Production task validation schemas (Zod)

import { z } from 'zod'

// Task status enum
export const TaskStatusEnum = z.enum([
  'QUEUED',
  'IN_PROGRESS',
  'IN_REVIEW',
  'NEEDS_CHANGES',
  'APPROVED',
  'DELIVERED',
  'CLOSED',
])

// Task status labels (Polish)
export const TaskStatusLabels: Record<string, string> = {
  QUEUED: 'W kolejce',
  IN_PROGRESS: 'W realizacji',
  IN_REVIEW: 'Do przeglądu',
  NEEDS_CHANGES: 'Wymaga poprawek',
  APPROVED: 'Zaakceptowane',
  DELIVERED: 'Dostarczone',
  CLOSED: 'Zamknięte',
}

// Allowed status transitions
export const AllowedStatusTransitions: Record<string, string[]> = {
  QUEUED: ['IN_PROGRESS'],
  IN_PROGRESS: ['IN_REVIEW', 'NEEDS_CHANGES'],
  IN_REVIEW: ['APPROVED', 'NEEDS_CHANGES'],
  NEEDS_CHANGES: ['IN_PROGRESS'],
  APPROVED: ['DELIVERED'],
  DELIVERED: ['CLOSED', 'NEEDS_CHANGES'],
  CLOSED: [],
}

// Update task status schema
export const updateTaskStatusSchema = z.object({
  taskId: z.string().cuid(),
  status: TaskStatusEnum,
  notes: z.string().max(2000).optional(),
})

// Assign task schema
export const assignTaskSchema = z.object({
  taskId: z.string().cuid(),
  assigneeId: z.string().cuid(),
})

// Unassign task schema
export const unassignTaskSchema = z.object({
  taskId: z.string().cuid(),
})

// Add deliverable schema
export const addDeliverableSchema = z.object({
  taskId: z.string().cuid(),
  name: z
    .string()
    .min(1, 'Nazwa jest wymagana')
    .max(200, 'Nazwa może mieć max. 200 znaków'),
  type: z
    .string()
    .min(1, 'Typ jest wymagany')
    .max(50, 'Typ może mieć max. 50 znaków'),
  fileUrl: z.string().url('Podaj prawidłowy URL do pliku'),
  changeNotes: z.string().max(1000).optional(),
})

// Update deliverable schema
export const updateDeliverableSchema = z.object({
  deliverableId: z.string().cuid(),
  name: z.string().min(1).max(200).optional(),
  fileUrl: z.string().url().optional(),
  changeNotes: z.string().max(1000).optional(),
})

// Approve deliverable schema
export const approveDeliverableSchema = z.object({
  deliverableId: z.string().cuid(),
  isApproved: z.boolean(),
})

// Delete deliverable schema
export const deleteDeliverableSchema = z.object({
  deliverableId: z.string().cuid(),
})

// Update task notes schema
export const updateTaskNotesSchema = z.object({
  taskId: z.string().cuid(),
  notes: z.string().max(2000),
})

// Type exports
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>
export type AssignTaskInput = z.infer<typeof assignTaskSchema>
export type UnassignTaskInput = z.infer<typeof unassignTaskSchema>
export type AddDeliverableInput = z.infer<typeof addDeliverableSchema>
export type UpdateDeliverableInput = z.infer<typeof updateDeliverableSchema>
export type ApproveDeliverableInput = z.infer<typeof approveDeliverableSchema>
export type DeleteDeliverableInput = z.infer<typeof deleteDeliverableSchema>
export type UpdateTaskNotesInput = z.infer<typeof updateTaskNotesSchema>

// Helper function to check if status transition is allowed
export function isStatusTransitionAllowed(
  currentStatus: string,
  newStatus: string
): boolean {
  const allowed = AllowedStatusTransitions[currentStatus]
  return allowed?.includes(newStatus) ?? false
}
