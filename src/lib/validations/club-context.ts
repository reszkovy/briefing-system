import { z } from 'zod'

// ============================================
// LOCAL CLUB CONTEXT - Zod Validation Schema
// ============================================

// Top Activity schema
const topActivitySchema = z.object({
  name: z.string().min(1, 'Nazwa aktywności jest wymagana').max(100),
  popularity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

// Activity Reasons schema
const activityReasonsSchema = z.object({
  selected: z.array(z.string()).default([]),
  note: z
    .string()
    .max(120, 'Notatka może mieć max 120 znaków')
    .optional()
    .nullable(),
})

// Main Club Context schema
export const clubContextSchema = z
  .object({
    // Static Profile
    clubCharacter: z
      .enum([
        'PREMIUM_LIFESTYLE',
        'MASS_MARKET',
        'PERFORMANCE_FOCUSED',
        'COMMUNITY_DRIVEN',
        'FUNCTIONAL_COMPACT',
        'CUSTOM',
      ])
      .nullable(),

    customCharacter: z
      .string()
      .max(50, 'Własny charakter może mieć max 50 znaków')
      .optional()
      .nullable(),

    keyMemberGroups: z
      .array(z.string().max(60))
      .max(3, 'Możesz wybrać max 3 grupy członków')
      .default([]),

    localConstraints: z.array(z.string().max(60)).default([]),

    // Dynamic Context
    topActivities: z
      .array(topActivitySchema)
      .max(3, 'Możesz dodać max 3 aktywności')
      .default([]),

    activityReasons: activityReasonsSchema.default({ selected: [] }),

    // Local Decision Brief
    localDecisionBrief: z
      .string()
      .max(400, 'Brief może mieć max 400 znaków')
      .optional()
      .nullable(),
  })
  // Validate custom character is provided when clubCharacter is CUSTOM
  .refine(
    (data) =>
      data.clubCharacter !== 'CUSTOM' ||
      (data.customCharacter && data.customCharacter.trim().length > 0),
    {
      message: 'Podaj własny charakter klubu',
      path: ['customCharacter'],
    }
  )

export type ClubContextInput = z.infer<typeof clubContextSchema>
