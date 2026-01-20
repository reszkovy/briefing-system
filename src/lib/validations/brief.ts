// Brief validation schemas (Zod)

import { z } from 'zod'

// ============================================
// CORE MODULE 1: Decision Layer Enums
// ============================================

// Business Objective - REQUIRED, no free-text allowed
export const BusinessObjectiveEnum = z.enum([
  'REVENUE_ACQUISITION',    // Revenue / Acquisition
  'RETENTION_ENGAGEMENT',   // Retention / Engagement
  'OPERATIONAL_EFFICIENCY', // Operational Efficiency
])

// Decision Context - REQUIRED
export const DecisionContextEnum = z.enum([
  'LOCAL',     // Local decision
  'REGIONAL',  // Regional decision
  'CENTRAL',   // Central decision
])

// Legacy Objective Enum (for backwards compatibility)
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

// ============================================
// CORE MODULE 1: Decision Layer Labels
// ============================================

// Business Objective labels (Polish) - REQUIRED
export const BusinessObjectiveLabels: Record<string, string> = {
  REVENUE_ACQUISITION: 'Przychód / Pozyskanie klientów',
  RETENTION_ENGAGEMENT: 'Retencja / Zaangażowanie',
  OPERATIONAL_EFFICIENCY: 'Efektywność operacyjna',
}

// Decision Context labels (Polish) - REQUIRED
export const DecisionContextLabels: Record<string, string> = {
  LOCAL: 'Decyzja lokalna',
  REGIONAL: 'Decyzja regionalna',
  CENTRAL: 'Decyzja centralna',
}

// Legacy Objective labels (Polish) - for backwards compatibility
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

// ============================================
// CORE MODULE 1: Decision Layer Schema
// ============================================
// No business intent = no brief.
// These fields are MANDATORY before submission.

export const decisionLayerSchema = z.object({
  // Business Objective - REQUIRED (no free-text)
  businessObjective: BusinessObjectiveEnum,
  // Success Metric / KPI - REQUIRED (quantifiable)
  kpiDescription: z.string().min(1, 'Określ miernik sukcesu (KPI)').max(500),
  kpiTarget: z.coerce.number().positive('Podaj wartość docelową KPI'),
  // Decision Context - REQUIRED
  decisionContext: DecisionContextEnum,
})

// ============================================
// CORE MODULE 3: AI Auditor Result Schema
// ============================================

export const AuditCheckStatus = z.enum(['PASS', 'FAIL', 'WARNING'])

export const aiAuditResultSchema = z.object({
  completeness: z.object({
    status: AuditCheckStatus,
    missingFields: z.array(z.string()).optional(),
    message: z.string().optional(),
  }),
  consistency: z.object({
    status: AuditCheckStatus,
    issues: z.array(z.string()).optional(),
    message: z.string().optional(),
  }),
  feasibility: z.object({
    status: AuditCheckStatus,
    deadlineRealistic: z.boolean(),
    capacityAvailable: z.boolean().optional(),
    message: z.string().optional(),
  }),
  policyCompliance: z.object({
    status: AuditCheckStatus,
    violations: z.array(z.string()).optional(),
    requiresEscalation: z.boolean(),
    message: z.string().optional(),
  }),
  overallStatus: AuditCheckStatus,
  auditedAt: z.coerce.date(),
})

// Schema for creating a new brief (draft) - with Decision Layer
export const createBriefSchema = z.object({
  clubId: z.string().min(1, 'Wybierz klub'),
  brandId: z.string().min(1, 'Wybierz markę'),
  templateIds: z.array(z.string().min(1)).min(1, 'Wybierz przynajmniej jeden typ zlecenia'),
  title: z
    .string()
    .min(1, 'Wprowadz tytul')
    .max(200, 'Tytuł może mieć max. 200 znaków'),
  // Decision Layer fields - REQUIRED for submission
  businessObjective: BusinessObjectiveEnum.optional(), // Optional in draft
  kpiDescription: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(500).nullable()
  ),
  kpiTarget: optionalNumber,
  decisionContext: DecisionContextEnum.optional(), // Optional in draft
  // Legacy field
  objective: optionalString,
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

// ============================================
// CORE MODULE 1: Submit Schema with Decision Layer ENFORCEMENT
// ============================================
// No business intent = no brief submission allowed.

export const submitBriefSchema = createBriefSchema
  // Decision Layer validation - BLOCKS submission if missing
  .refine(
    (data) => data.businessObjective !== undefined && data.businessObjective !== null,
    {
      message: 'Wybierz cel biznesowy - wymagane przed wysłaniem',
      path: ['businessObjective'],
    }
  )
  .refine(
    (data) => data.kpiDescription !== null && data.kpiDescription !== undefined && data.kpiDescription.trim() !== '',
    {
      message: 'Określ miernik sukcesu (KPI) - wymagane przed wysłaniem',
      path: ['kpiDescription'],
    }
  )
  .refine(
    (data) => data.kpiTarget !== null && data.kpiTarget !== undefined && data.kpiTarget > 0,
    {
      message: 'Podaj wartość docelową KPI - wymagane przed wysłaniem',
      path: ['kpiTarget'],
    }
  )
  .refine(
    (data) => data.decisionContext !== undefined && data.decisionContext !== null,
    {
      message: 'Określ kontekst decyzji - wymagane przed wysłaniem',
      path: ['decisionContext'],
    }
  )
  // Date validation
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
