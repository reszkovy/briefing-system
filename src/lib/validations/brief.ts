// Brief validation schemas (Zod)

import { z } from 'zod'

// Enums
export const ObjectiveEnum = z.enum([
  'ACQUISITION',
  'RETENTION',
  'ATTENDANCE',
  'UPSELL',
  'AWARENESS',
  'OTHER',
])

export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

export const BriefStatusEnum = z.enum([
  'DRAFT',
  'SUBMITTED',
  'CHANGES_REQUESTED',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
])

export const ApprovalDecisionEnum = z.enum([
  'APPROVED',
  'CHANGES_REQUESTED',
  'REJECTED',
])

// Objective labels (Polish)
export const ObjectiveLabels: Record<string, string> = {
  ACQUISITION: 'Pozyskanie nowych klientów',
  RETENTION: 'Utrzymanie obecnych klientów',
  ATTENDANCE: 'Zwiększenie frekwencji',
  UPSELL: 'Sprzedaż dodatkowa',
  AWARENESS: 'Budowanie świadomości',
  OTHER: 'Inny cel',
}

// Priority labels (Polish)
export const PriorityLabels: Record<string, string> = {
  LOW: 'Niski',
  MEDIUM: 'Średni',
  HIGH: 'Wysoki',
  CRITICAL: 'Krytyczny',
}

// Status labels (Polish)
export const BriefStatusLabels: Record<string, string> = {
  DRAFT: 'Szkic',
  SUBMITTED: 'Wysłany',
  CHANGES_REQUESTED: 'Wymaga poprawek',
  APPROVED: 'Zatwierdzony',
  REJECTED: 'Odrzucony',
  CANCELLED: 'Anulowany',
}

// Schema for creating a new brief (draft)
export const createBriefSchema = z.object({
  clubId: z.string().cuid('Wybierz klub'),
  brandId: z.string().cuid('Wybierz markę'),
  templateId: z.string().cuid('Wybierz typ zlecenia'),
  title: z
    .string()
    .min(5, 'Tytuł musi mieć min. 5 znaków')
    .max(200, 'Tytuł może mieć max. 200 znaków'),
  objective: ObjectiveEnum,
  kpiDescription: z
    .string()
    .min(10, 'Opisz KPI (min. 10 znaków)')
    .max(500, 'Opis KPI może mieć max. 500 znaków'),
  kpiTarget: z.coerce.number().positive().optional().nullable(),
  deadline: z.coerce.date().refine(
    (date) => date > new Date(),
    'Deadline musi być w przyszłości'
  ),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  context: z
    .string()
    .min(20, 'Opisz kontekst (min. 20 znaków)')
    .max(2000, 'Kontekst może mieć max. 2000 znaków'),
  offerDetails: z.string().max(2000).optional().nullable(),
  legalCopy: z.string().max(1000).optional().nullable(),
  customFields: z.record(z.any()).optional().nullable(),
  assetLinks: z.array(z.string().url('Nieprawidłowy URL')).default([]),
})

// Schema for submitting a brief (stricter validation)
export const submitBriefSchema = createBriefSchema
  .extend({
    context: z.string().min(20, 'Opisz kontekst (min. 20 znaków)'),
    customFields: z.record(z.any()), // Must have custom fields filled
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate
      }
      return true
    },
    {
      message: 'Data końcowa musi być po dacie początkowej',
      path: ['endDate'],
    }
  )

// Schema for updating a brief (partial)
export const updateBriefSchema = createBriefSchema.partial()

// Schema for validator approval actions
export const approvalActionSchema = z.object({
  briefId: z.string().min(1),
  decision: ApprovalDecisionEnum,
  notes: z.string().max(2000).optional().nullable(),
  priority: PriorityEnum.optional(),
  slaDays: z.coerce.number().int().min(1).max(30).optional(),
})

// Schema for updating brief status
export const updateBriefStatusSchema = z.object({
  briefId: z.string().cuid(),
  status: BriefStatusEnum,
})

// Schema for outcome tagging
export const tagOutcomeSchema = z.object({
  briefId: z.string().cuid(),
  wasExecuted: z.boolean(),
  perceivedResult: z.coerce.number().int().min(1).max(5).optional().nullable(),
  actualKpiValue: z.coerce.number().optional().nullable(),
})

// Schema for adding a comment
export const addCommentSchema = z.object({
  briefId: z.string().cuid().optional(),
  taskId: z.string().cuid().optional(),
  content: z
    .string()
    .min(1, 'Komentarz nie może być pusty')
    .max(2000, 'Komentarz może mieć max. 2000 znaków'),
}).refine(
  (data) => data.briefId || data.taskId,
  'Komentarz musi być przypisany do briefu lub zadania'
)

// Type exports
export type CreateBriefInput = z.infer<typeof createBriefSchema>
export type SubmitBriefInput = z.infer<typeof submitBriefSchema>
export type UpdateBriefInput = z.infer<typeof updateBriefSchema>
export type ApprovalActionInput = z.infer<typeof approvalActionSchema>
export type UpdateBriefStatusInput = z.infer<typeof updateBriefStatusSchema>
export type TagOutcomeInput = z.infer<typeof tagOutcomeSchema>
export type AddCommentInput = z.infer<typeof addCommentSchema>
