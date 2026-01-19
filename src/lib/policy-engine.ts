/**
 * Brief Policy Engine
 *
 * Framework decyzyjny dla systemu briefow regional.fit
 * Implementuje reguly biznesowe opisane w Policy Document
 */

import { Decimal } from '@prisma/client/runtime/library'

// ============================================
// TYPES
// ============================================

export type PolicyRuleResult = {
  rule: string
  passed: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
  requiresOwnerApproval?: boolean
  autoReject?: boolean
  // Exception vs Escalation - typ eskalacji do Ownera
  escalationType?: 'EXCEPTION' | 'ESCALATION'
}

export type EscalationType = 'EXCEPTION' | 'ESCALATION'

export type PolicyCheckResult = {
  canSubmit: boolean
  canAutoApprove: boolean
  requiresOwnerApproval: boolean
  ownerApprovalReasons: string[]
  autoRejectReasons: string[]
  warnings: string[]
  info: string[]
  rules: PolicyRuleResult[]
  suggestedPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  suggestedSLA: number
  // Exception vs Escalation rozroznienie
  escalationType: EscalationType | null
  escalationDetails: {
    type: EscalationType
    reason: string
  }[]
}

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export type BriefInput = {
  objective?: string | null
  deadline: Date
  estimatedCost?: number | Decimal | null
  isCrisisCommunication?: boolean
  formats?: string[]
  customFormats?: string[]
  templateCode?: string
  templateIsInternal?: boolean
  templateIsBlacklisted?: boolean
  templateBlacklistReason?: string | null
  clubTier?: 'STANDARD' | 'VIP' | 'FLAGSHIP'
  context?: string
  title?: string
  confidenceLevel?: ConfidenceLevel | null
}

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Strategic Focus
  PRIMARY_OBJECTIVES: ['ACQUISITION', 'RETENTION', 'UPSELL'],
  SECONDARY_OBJECTIVES: ['ATTENDANCE'],
  NOT_SUPPORTED_OBJECTIVES: ['AWARENESS', 'OTHER'],

  // Operational Constraints
  MIN_LEAD_TIME_DAYS: 5,
  CRISIS_MIN_LEAD_TIME_DAYS: 1,

  // Standard Formats (A4, social square, social story)
  STANDARD_FORMATS: [
    'plakat_a4',
    'fb_post_1080x1320',    // ~square
    'ig_post_1080x1440',    // ~square
    'stories_1080x1920',    // story
    'www_square_360x360',   // square
  ],

  // Financial Thresholds (in PLN, assuming 1 USD ~ 4 PLN)
  AUTO_APPROVE_MAX_COST: 0,
  VALIDATOR_MAX_COST: 1000,  // ~$250
  OWNER_APPROVAL_THRESHOLD: 1000,

  // Custom Format ROI threshold
  CUSTOM_FORMAT_MIN_ROI: 4000, // ~$1000

  // VIP SLA
  VIP_SLA_HOURS: 24,
  STANDARD_SLA_DAYS: 5,
  VIP_SLA_DAYS: 1,

  // Blacklist keywords
  BLACKLIST_KEYWORDS: [
    'logo redesign',
    'redesign logo',
    'zmiana logo',
    'nowe logo',
    'partnership',
    'partnerstwo',
    'sponsoring',
    'sponsorship',
    'brand exposure',
    'ekspozycja marki',
  ],
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getBusinessDaysUntil(deadline: Date): number {
  const now = new Date()
  const target = new Date(deadline)
  let count = 0
  const current = new Date(now)

  while (current < target) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

function hasBlacklistKeywords(text: string): string | null {
  const lowerText = text.toLowerCase()
  for (const keyword of CONFIG.BLACKLIST_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return keyword
    }
  }
  return null
}

function getCostAsNumber(cost: number | Decimal | null | undefined): number {
  if (cost === null || cost === undefined) return 0
  if (typeof cost === 'number') return cost
  return cost.toNumber()
}

// ============================================
// POLICY RULES
// ============================================

/**
 * Rule 1: Strategic Focus - North Star
 * All requests must support at least one Primary Objective
 */
function checkStrategicFocus(input: BriefInput): PolicyRuleResult {
  const { objective } = input

  if (!objective) {
    // ESCALATION - brak danych, niepewnosc
    return {
      rule: 'strategic_focus',
      passed: false,
      message: 'Brak zdefiniowanego celu. Wymagana akceptacja Ownera.',
      severity: 'warning',
      requiresOwnerApproval: true,
      escalationType: 'ESCALATION', // Niepewnosc - brak danych
    }
  }

  if (CONFIG.PRIMARY_OBJECTIVES.includes(objective)) {
    return {
      rule: 'strategic_focus',
      passed: true,
      message: `Cel podstawowy: ${objective}`,
      severity: 'info',
    }
  }

  if (CONFIG.SECONDARY_OBJECTIVES.includes(objective)) {
    return {
      rule: 'strategic_focus',
      passed: true,
      message: `Cel drugorzedny: ${objective}`,
      severity: 'info',
    }
  }

  if (CONFIG.NOT_SUPPORTED_OBJECTIVES.includes(objective)) {
    // EXCEPTION - swiadoma decyzja, lamie zasade
    return {
      rule: 'strategic_focus',
      passed: false,
      message: `Cel "${objective}" nie jest wspierany domyslnie. Wymagana akceptacja Ownera.`,
      severity: 'warning',
      requiresOwnerApproval: true,
      escalationType: 'EXCEPTION', // Swiadoma decyzja - cel poza standardem
    }
  }

  return {
    rule: 'strategic_focus',
    passed: false,
    message: 'Nieznany cel. Wymagana akceptacja Ownera.',
    severity: 'warning',
    requiresOwnerApproval: true,
    escalationType: 'ESCALATION', // Niepewnosc - nieznany cel
  }
}

/**
 * Rule 2: Operational Constraints - Lead Time
 */
function checkLeadTime(input: BriefInput): PolicyRuleResult {
  const { deadline, isCrisisCommunication } = input
  const businessDays = getBusinessDaysUntil(deadline)

  const minDays = isCrisisCommunication
    ? CONFIG.CRISIS_MIN_LEAD_TIME_DAYS
    : CONFIG.MIN_LEAD_TIME_DAYS

  if (businessDays < minDays) {
    if (isCrisisCommunication) {
      return {
        rule: 'lead_time',
        passed: true,
        message: `Komunikacja kryzysowa - skrocony lead time (${businessDays} dni roboczych)`,
        severity: 'warning',
      }
    }

    return {
      rule: 'lead_time',
      passed: false,
      message: `Za krotki lead time: ${businessDays} dni roboczych (minimum ${minDays}). Oznacz jako komunikacje kryzysowa lub zmien deadline.`,
      severity: 'error',
    }
  }

  return {
    rule: 'lead_time',
    passed: true,
    message: `Lead time OK: ${businessDays} dni roboczych`,
    severity: 'info',
  }
}

/**
 * Rule 2b: Operational Constraints - Standard Formats
 */
function checkFormats(input: BriefInput): PolicyRuleResult {
  const { formats = [], customFormats = [] } = input

  if (customFormats.length > 0) {
    // EXCEPTION - swiadoma decyzja, lamie zasade standardowych formatow
    return {
      rule: 'formats',
      passed: false,
      message: `Niestandardowe formaty (${customFormats.join(', ')}) wymagaja uzasadnienia ROI > 4000 PLN`,
      severity: 'warning',
      requiresOwnerApproval: true,
      escalationType: 'EXCEPTION', // Swiadoma decyzja - niestandardowy format
    }
  }

  const nonStandardFormats = formats.filter(f => !CONFIG.STANDARD_FORMATS.includes(f))
  if (nonStandardFormats.length > 0) {
    return {
      rule: 'formats',
      passed: true,
      message: `Formaty rozszerzone: ${nonStandardFormats.join(', ')}`,
      severity: 'info',
    }
  }

  return {
    rule: 'formats',
    passed: true,
    message: 'Standardowe formaty',
    severity: 'info',
  }
}

/**
 * Rule 3: Financial Logic - The Wallet
 */
function checkFinancialThresholds(input: BriefInput): PolicyRuleResult {
  const cost = getCostAsNumber(input.estimatedCost)
  const { templateIsInternal } = input

  // Auto-approve: $0 cost + internal template
  if (cost === 0 && templateIsInternal) {
    return {
      rule: 'financial',
      passed: true,
      message: 'Auto-approve: koszt 0 PLN + szablon wewnetrzny',
      severity: 'info',
    }
  }

  // Auto-approve: $0 cost
  if (cost === 0) {
    return {
      rule: 'financial',
      passed: true,
      message: 'Koszt produkcji: 0 PLN',
      severity: 'info',
    }
  }

  // Validator can approve up to threshold
  if (cost <= CONFIG.VALIDATOR_MAX_COST) {
    return {
      rule: 'financial',
      passed: true,
      message: `Koszt ${cost} PLN - w zakresie uprawnien walidatora`,
      severity: 'info',
    }
  }

  // Owner approval required - EXCEPTION (swiadomy wybor wyzszego budzetu)
  return {
    rule: 'financial',
    passed: false,
    message: `Koszt ${cost} PLN przekracza limit walidatora (${CONFIG.VALIDATOR_MAX_COST} PLN). Wymagana akceptacja Ownera.`,
    severity: 'warning',
    requiresOwnerApproval: true,
    escalationType: 'EXCEPTION', // Swiadoma decyzja - wysokie koszty
  }
}

/**
 * Rule 4: Blacklist - Hard No
 */
function checkBlacklist(input: BriefInput): PolicyRuleResult {
  const { templateIsBlacklisted, templateBlacklistReason, context, title } = input

  // Check if template is blacklisted
  if (templateIsBlacklisted) {
    return {
      rule: 'blacklist',
      passed: false,
      message: `Typ zlecenia na blackliscie: ${templateBlacklistReason || 'brak powodu'}`,
      severity: 'error',
      autoReject: true,
    }
  }

  // Check for blacklist keywords in content
  const textToCheck = `${title || ''} ${context || ''}`.toLowerCase()
  const foundKeyword = hasBlacklistKeywords(textToCheck)

  if (foundKeyword) {
    return {
      rule: 'blacklist',
      passed: false,
      message: `Wykryto slowo kluczowe z blacklisty: "${foundKeyword}". Zlecenia dotyczace redesignu logo, partnerstw bez umowy i sponsoringu sa odrzucane.`,
      severity: 'error',
      autoReject: true,
    }
  }

  return {
    rule: 'blacklist',
    passed: true,
    message: 'Brak elementow z blacklisty',
    severity: 'info',
  }
}

/**
 * Rule 5: VIP Fast Track
 */
function checkVIPStatus(input: BriefInput): PolicyRuleResult {
  const { clubTier } = input

  if (clubTier === 'FLAGSHIP' || clubTier === 'VIP') {
    return {
      rule: 'vip_status',
      passed: true,
      message: `Klub ${clubTier} - priorytetowa obsluga (SLA 24h)`,
      severity: 'info',
    }
  }

  return {
    rule: 'vip_status',
    passed: true,
    message: 'Standardowy klub',
    severity: 'info',
  }
}

// ============================================
// MAIN POLICY ENGINE
// ============================================

export function checkBriefPolicy(input: BriefInput): PolicyCheckResult {
  const rules: PolicyRuleResult[] = []
  const ownerApprovalReasons: string[] = []
  const autoRejectReasons: string[] = []
  const warnings: string[] = []
  const info: string[] = []
  const escalationDetails: { type: EscalationType; reason: string }[] = []

  // Run all policy checks
  const strategicResult = checkStrategicFocus(input)
  rules.push(strategicResult)

  const leadTimeResult = checkLeadTime(input)
  rules.push(leadTimeResult)

  const formatsResult = checkFormats(input)
  rules.push(formatsResult)

  const financialResult = checkFinancialThresholds(input)
  rules.push(financialResult)

  const blacklistResult = checkBlacklist(input)
  rules.push(blacklistResult)

  const vipResult = checkVIPStatus(input)
  rules.push(vipResult)

  // Aggregate results
  for (const result of rules) {
    if (result.autoReject) {
      autoRejectReasons.push(result.message)
    } else if (result.requiresOwnerApproval) {
      ownerApprovalReasons.push(result.message)
      // Zbierz informacje o typie eskalacji
      if (result.escalationType) {
        escalationDetails.push({
          type: result.escalationType,
          reason: result.message,
        })
      }
    } else if (result.severity === 'warning') {
      warnings.push(result.message)
    } else if (result.severity === 'info') {
      info.push(result.message)
    }
  }

  // Determine if brief can be submitted
  const hasAutoReject = autoRejectReasons.length > 0
  const hasErrors = rules.some(r => r.severity === 'error' && !r.autoReject && !r.requiresOwnerApproval)
  const canSubmit = !hasAutoReject && !hasErrors

  // Determine if can auto-approve
  const cost = getCostAsNumber(input.estimatedCost)
  const canAutoApprove = cost === 0 &&
                         input.templateIsInternal === true &&
                         ownerApprovalReasons.length === 0 &&
                         !hasAutoReject

  // Determine suggested priority and SLA
  let suggestedPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  let suggestedSLA = CONFIG.STANDARD_SLA_DAYS

  if (input.clubTier === 'FLAGSHIP' || input.clubTier === 'VIP') {
    suggestedPriority = 'HIGH'
    suggestedSLA = CONFIG.VIP_SLA_DAYS
  }

  if (input.isCrisisCommunication) {
    suggestedPriority = 'CRITICAL'
    suggestedSLA = CONFIG.VIP_SLA_DAYS
  }

  // Determine primary escalation type (EXCEPTION takes priority over ESCALATION)
  let escalationType: EscalationType | null = null
  if (escalationDetails.length > 0) {
    // Jesli jest jakikolwiek EXCEPTION, to glowny typ to EXCEPTION
    // EXCEPTION = swiadoma decyzja strategiczna
    // ESCALATION = niepewnosc, potrzeba wiecej danych
    escalationType = escalationDetails.some(e => e.type === 'EXCEPTION')
      ? 'EXCEPTION'
      : 'ESCALATION'
  }

  return {
    canSubmit,
    canAutoApprove,
    requiresOwnerApproval: ownerApprovalReasons.length > 0,
    ownerApprovalReasons,
    autoRejectReasons,
    warnings,
    info,
    rules,
    suggestedPriority,
    suggestedSLA,
    escalationType,
    escalationDetails,
  }
}

/**
 * Get human-readable policy summary for UI
 */
export function getPolicySummary(result: PolicyCheckResult): string {
  if (result.autoRejectReasons.length > 0) {
    return `ODRZUCONE: ${result.autoRejectReasons[0]}`
  }

  if (result.requiresOwnerApproval) {
    return `WYMAGA AKCEPTACJI OWNERA: ${result.ownerApprovalReasons.join('; ')}`
  }

  if (result.canAutoApprove) {
    return 'AUTOMATYCZNE ZATWIERDZENIE'
  }

  return 'DO WALIDACJI'
}

/**
 * Export configuration for admin panel
 */
export function getPolicyConfig() {
  return CONFIG
}
