/**
 * Microcopy — additional Polish labels not covered by validations/brief.ts
 *
 * This file complements the labels already in src/lib/validations/brief.ts:
 *   - BusinessObjectiveLabels, DecisionContextLabels, ObjectiveLabels
 *   - PriorityLabels, BriefStatusLabels, OutcomeLabels
 *   - EscalationTypeLabels, ConfidenceLevelLabels
 *
 * Add labels HERE for enums/codes not already in validations.
 */

// =============================================================================
// USER ROLES
// =============================================================================

export const UserRoleLabels: Record<string, string> = {
  CLUB_MANAGER: 'Manager lokalny',
  VALIDATOR: 'Walidator',
  PRODUCTION: 'Zespół produkcji',
  REGIONAL_DIRECTOR: 'Dyrektor regionalny',
  CMO: 'Dyrektor marketingu',
  ADMIN: 'Administrator',
}

export const UserRoleDescriptions: Record<string, string> = {
  CLUB_MANAGER: 'Sygnalizuje popyt i dostarcza kontekst lokalny',
  VALIDATOR: 'Waliduje i akceptuje briefy regionalnie',
  PRODUCTION: 'Realizuje zatwierdzone briefy',
  REGIONAL_DIRECTOR: 'Nadzoruje region, definiuje cele regionalne',
  CMO: 'Strategia marketingowa, polityka, kierunek',
  ADMIN: 'Konfiguracja systemu, użytkownicy, integracje',
}

// =============================================================================
// PRODUCTION TASK STATUSES
// =============================================================================

export const TaskStatusLabels: Record<string, string> = {
  QUEUED: 'W kolejce',
  IN_PROGRESS: 'W realizacji',
  IN_REVIEW: 'Do sprawdzenia',
  NEEDS_CHANGES: 'Wymaga poprawek',
  APPROVED: 'Zatwierdzone',
  DELIVERED: 'Dostarczone',
  CLOSED: 'Zamknięte',
  ON_HOLD: 'Wstrzymane',
}

// =============================================================================
// CLUB TIER
// =============================================================================

export const ClubTierLabels: Record<string, string> = {
  STANDARD: 'Standardowy',
  VIP: 'VIP (top 10% przychodu)',
  FLAGSHIP: 'Flagowy',
}

// =============================================================================
// STRATEGY DOCUMENT
// =============================================================================

export const StrategyDocumentTypeLabels: Record<string, string> = {
  BRAND_GUIDELINES: 'Wytyczne marki',
  COMMUNICATION_STRATEGY: 'Strategia komunikacji',
  QUARTERLY_GOALS: 'Cele kwartalne',
  ANNUAL_PLAN: 'Plan roczny',
  POLICY: 'Polityka / regulamin',
  OTHER: 'Inny dokument',
}

export const StrategyDocumentScopeLabels: Record<string, string> = {
  GLOBAL: 'Cała organizacja',
  BRAND: 'Konkretna marka',
  REGION: 'Konkretny region',
}

// =============================================================================
// FOCUS PERIOD
// =============================================================================

export const FocusPeriodLabels: Record<string, string> = {
  MONTHLY: 'Miesięczny',
  QUARTERLY: 'Kwartalny',
  YEARLY: 'Roczny',
}

// =============================================================================
// APPROVAL DECISIONS (extended)
// =============================================================================

export const ApprovalDecisionLabels: Record<string, string> = {
  APPROVED: 'Zatwierdzone',
  CHANGES_REQUESTED: 'Wymaga poprawek',
  REJECTED: 'Odrzucone',
}

// =============================================================================
// FORMATS (digital + print) — currently hardcoded in brief-form.tsx
// Centralized here so admin UI can manage them per tenant later.
// =============================================================================

export type FormatDefinition = {
  id: string
  label: string
  category: 'digital' | 'print'
  dimensions?: string
}

export const STANDARD_FORMATS: FormatDefinition[] = [
  // Digital
  { id: 'fb_post_1080x1320', label: 'Post FB', category: 'digital', dimensions: '1080×1320' },
  { id: 'ig_post_1080x1440', label: 'Post IG', category: 'digital', dimensions: '1080×1440' },
  { id: 'stories_1080x1920', label: 'Stories', category: 'digital', dimensions: '1080×1920' },
  { id: 'www_square_360x360', label: 'WWW kwadrat', category: 'digital', dimensions: '360×360' },
  { id: 'www_rect_832x416', label: 'WWW prostokąt', category: 'digital', dimensions: '832×416' },
  { id: 'google_400x300', label: 'Wizytówka Google', category: 'digital', dimensions: '400×300' },
  // Print
  { id: 'plakat_a4', label: 'Plakat A4', category: 'print' },
  { id: 'plakat_a3', label: 'Plakat A3', category: 'print' },
  { id: 'plakat_a2', label: 'Plakat A2', category: 'print' },
  { id: 'ulotka_dl', label: 'Ulotka DL', category: 'print' },
  { id: 'ulotka_a5', label: 'Ulotka A5', category: 'print' },
  { id: 'rollup', label: 'Roll-up', category: 'print', dimensions: '85×200' },
]

export const FORMAT_LABELS: Record<string, string> = Object.fromEntries(
  STANDARD_FORMATS.map((f) => [f.id, f.dimensions ? `${f.label} (${f.dimensions})` : f.label])
)

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Safe label lookup with fallback.
 * Use instead of direct dict access to avoid undefined in UI.
 */
export function getLabel(dict: Record<string, string>, key: string | null | undefined): string {
  if (!key) return ''
  return dict[key] || key
}

/**
 * Get all formats grouped by category (for select/grouped UI)
 */
export function getFormatsGrouped(): Record<'digital' | 'print', FormatDefinition[]> {
  return {
    digital: STANDARD_FORMATS.filter((f) => f.category === 'digital'),
    print: STANDARD_FORMATS.filter((f) => f.category === 'print'),
  }
}
