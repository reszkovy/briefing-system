// ============================================
// LOCAL CLUB CONTEXT - Constants & Labels
// ============================================

// Club Character - defines default decision logic
export const CLUB_CHARACTERS = {
  PREMIUM_LIFESTYLE: 'Premium / Lifestyle',
  MASS_MARKET: 'Mass-market',
  PERFORMANCE_FOCUSED: 'Performance-focused',
  COMMUNITY_DRIVEN: 'Community-driven',
  FUNCTIONAL_COMPACT: 'Funkcjonalny / Kompaktowy',
  CUSTOM: 'Inny...',
} as const

export type ClubCharacterKey = keyof typeof CLUB_CHARACTERS

// Key Member Groups - max 3 selections
export const KEY_MEMBER_GROUPS = {
  beginners: 'Początkujący',
  regular_members: 'Regularni członkowie',
  advanced_users: 'Zaawansowani',
  seniors_40_plus: '40+ / Seniorzy',
  lifestyle_wellbeing: 'Lifestyle / Wellbeing',
  performance_sport: 'Performance / Sport',
} as const

export type KeyMemberGroupKey = keyof typeof KEY_MEMBER_GROUPS

// Local Constraints - multi-select + custom
export const LOCAL_CONSTRAINTS = {
  limited_space: 'Ograniczona przestrzeń',
  limited_trainer_availability: 'Ograniczona dostępność trenerów',
  limited_opening_hours: 'Ograniczone godziny otwarcia',
  high_seasonality: 'Wysoka sezonowość',
  specific_local_demographics: 'Specyficzna demografia lokalna',
} as const

export type LocalConstraintKey = keyof typeof LOCAL_CONSTRAINTS

// Activity Reasons - why activities work locally
export const ACTIVITY_REASONS = {
  matches_local_demographics: 'Pasuje do lokalnej demografii',
  low_entry_barrier: 'Niski próg wejścia',
  strong_trainer_presence: 'Silna obecność trenera',
  convenient_schedule: 'Wygodny harmonogram',
  wellbeing_health_focus: 'Focus na wellbeing / zdrowie',
  intensity_performance_effect: 'Efekt intensywności / wydajności',
} as const

export type ActivityReasonKey = keyof typeof ACTIVITY_REASONS

// Popularity Levels
export const POPULARITY_LEVELS = {
  LOW: 'Niska',
  MEDIUM: 'Średnia',
  HIGH: 'Wysoka',
} as const

export type PopularityLevelKey = keyof typeof POPULARITY_LEVELS

// Common Activities - predefined list for autocomplete
export const COMMON_ACTIVITIES = [
  'Fitness grupowy',
  'Siłownia',
  'Joga',
  'Pilates',
  'Cycling / Spinning',
  'Crossfit',
  'Zajęcia taneczne',
  'Aqua fitness',
  'TRX',
  'Stretching',
  'HIIT',
  'Boks / Kickboxing',
  'Funkcjonalny trening',
  'Zumba',
  'Body Pump',
  'Core / Abs',
  'Mobilność',
  'Rehabilitacja ruchowa',
] as const

// Helper to get label from key (handles custom: prefix)
export function getKeyMemberGroupLabel(key: string): string {
  if (key.startsWith('custom:')) {
    return key.slice(7)
  }
  return KEY_MEMBER_GROUPS[key as KeyMemberGroupKey] || key
}

export function getLocalConstraintLabel(key: string): string {
  if (key.startsWith('custom:')) {
    return key.slice(7)
  }
  return LOCAL_CONSTRAINTS[key as LocalConstraintKey] || key
}

export function getActivityReasonLabel(key: string): string {
  if (key.startsWith('custom:')) {
    return key.slice(7)
  }
  return ACTIVITY_REASONS[key as ActivityReasonKey] || key
}

export function getClubCharacterLabel(character: string | null, customCharacter?: string | null): string {
  if (!character) return ''
  if (character === 'CUSTOM' && customCharacter) {
    return customCharacter
  }
  return CLUB_CHARACTERS[character as ClubCharacterKey] || character
}
