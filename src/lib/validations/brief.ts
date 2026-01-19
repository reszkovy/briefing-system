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

// Learning Loop - outcome enum
export const OutcomeEnum = z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE'])

// Exception vs Escalation
export const EscalationTypeEnum = z.enum(['EXCEPTION', 'ESCALATION'])

// Confidence Level
export const ConfidenceLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'])

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

// Outcome labels (Polish) - Learning Loop
export const OutcomeLabels: Record<string, string> = {
  POSITIVE: 'Pozytywny',
  NEUTRAL: 'Neutralny',
  NEGATIVE: 'Negatywny',
}

// Escalation type labels (Polish)
export const EscalationTypeLabels: Record<string, string> = {
  EXCEPTION: 'Wyjątek (świadoma decyzja)',
  ESCALATION: 'Eskalacja (niepewność)',
}

// Confidence level labels (Polish)
export const ConfidenceLevelLabels: Record<string, string> = {
  LOW: 'Niski (eksperyment)',
  MEDIUM: 'Średni',
  HIGH: 'Wysoki (pewny ruch)',
}

// Helper to handle empty string as null for optional dates
const optionalDateString = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : val),
  z.coerce.date().nullable()
)

// Helper to handle empty string as null for optional strings
const optionalString = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : val),
  z.string().nullable()
)

// Helper to handle empty string as null for optional numbers
const optionalNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : val),
  z.coerce.number().positive().nullable()
)

// Schema for creating a new brief (draft) - simplified validation
export const createBriefSchema = z.object({
  clubId: z.string().min(1, 'Wybierz klub'),
  brandId: z.string().min(1, 'Wybierz markę'),
  templateIds: z.array(z.string().min(1)).min(1, 'Wybierz przynajmniej jeden typ zlecenia'),
  title: z
    .string()
    .min(1, 'Wprowadz tytul')
    .max(200, 'Tytuł może mieć max. 200 znaków'),
  objective: optionalString,
  kpiDescription: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(500).nullable()
  ),
  kpiTarget: optionalNumber,
  deadline: z.coerce.date(),
  startDate: optionalDateString,
  endDate: optionalDateString,
  context: z
    .string()
    .min(1, 'Wprowadz opis')
    .max(2000, 'Kontekst może mieć max. 2000 znaków'),
  offerDetails: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(2000).nullable()
  ),
  legalCopy: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(1000).nullable()
  ),
  customFields: z.record(z.any()).optional().nullable(),
  assetLinks: z.array(z.string().url('Nieprawidłowy URL')).default([]),
  formats: z.array(z.string()).default([]),
  customFormats: z.array(z.string()).default([]),
  // Policy engine fields
  estimatedCost: z.coerce.number().min(0).optional().nullable(),
  isCrisisCommunication: z.boolean().default(false),
  confidenceLevel: ConfidenceLevelEnum.optional().nullable(),
})

// Schema for submitting a brief (same as create for simplified UX)
export const submitBriefSchema = createBriefSchema
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

// Schema for outcome tagging (Learning Loop)
export const tagOutcomeSchema = z.object({
  briefId: z.string().cuid(),
  wasExecuted: z.boolean(),
  perceivedResult: z.coerce.number().int().min(1).max(5).optional().nullable(),
  actualKpiValue: z.coerce.number().optional().nullable(),
  // Learning Loop fields
  outcome: OutcomeEnum.optional().nullable(),
  outcomeNote: z.string().max(500).optional().nullable(),
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
