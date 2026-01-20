// ============================================
// LOCAL CLUB CONTEXT - TypeScript Types
// ============================================

import type { PopularityLevelKey } from '@/lib/constants/club-context'

// Top Activity - 1-3 items
export interface TopActivity {
  name: string // from list or free text
  popularity: PopularityLevelKey // LOW, MEDIUM, HIGH
}

// Activity Reasons - why activities work locally
export interface ActivityReasonsData {
  selected: string[] // keys from ACTIVITY_REASONS
  note?: string // max 120 chars, optional
}

// Full Club Context Data
export interface ClubContextData {
  // Static Profile
  clubCharacter: string | null // enum value or null
  customCharacter?: string | null // max 50 chars
  keyMemberGroups: string[] // max 3, may contain "custom:..."
  localConstraints: string[] // may contain "custom:..."

  // Dynamic Context
  topActivities: TopActivity[] // 1-3 items
  activityReasons: ActivityReasonsData

  // Local Decision Brief
  localDecisionBrief?: string | null // max 400 chars

  // Metadata
  contextUpdatedAt?: Date | string | null
  contextUpdatedBy?: {
    id: string
    name: string
  } | null
}

// Form input type (for forms/API)
export interface ClubContextInput {
  clubCharacter: string | null
  customCharacter?: string | null
  keyMemberGroups: string[]
  localConstraints: string[]
  topActivities: TopActivity[]
  activityReasons: ActivityReasonsData
  localDecisionBrief?: string | null
}

// API response type (extends with metadata)
export interface ClubContextResponse extends ClubContextData {
  id: string
  name: string
}
