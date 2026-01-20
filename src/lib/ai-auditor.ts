/**
 * ============================================
 * CORE MODULE 3: AI as an Auditor (NOT a Generator)
 * ============================================
 *
 * AI acts as a quality and compliance auditor, not a creator.
 *
 * AI Responsibilities:
 * 1. Completeness - Are all required decision fields filled?
 * 2. Consistency - Does the brief align with the declared objective?
 * 3. Feasibility - Is the deadline realistic given SLA and capacity?
 * 4. Policy Compliance - Is this request allowed under current rules?
 *
 * Explicit AI Limitations:
 * - AI does NOT write briefs
 * - AI does NOT decide priorities
 * - AI does NOT override human decisions
 * - AI only flags issues and enforces rules
 */

import type { Brief, RequestTemplate, ProductionCapacity } from '@prisma/client'

export type AuditCheckStatus = 'PASS' | 'FAIL' | 'WARNING'

export interface CompletenessCheck {
  status: AuditCheckStatus
  missingFields: string[]
  message?: string
}

export interface ConsistencyCheck {
  status: AuditCheckStatus
  issues: string[]
  message?: string
}

export interface FeasibilityCheck {
  status: AuditCheckStatus
  deadlineRealistic: boolean
  capacityAvailable?: boolean
  estimatedCompletionDate?: Date
  message?: string
}

export interface PolicyComplianceCheck {
  status: AuditCheckStatus
  violations: string[]
  requiresEscalation: boolean
  escalationReason?: string
  message?: string
}

export interface AIAuditResult {
  completeness: CompletenessCheck
  consistency: ConsistencyCheck
  feasibility: FeasibilityCheck
  policyCompliance: PolicyComplianceCheck
  overallStatus: AuditCheckStatus
  auditedAt: Date
}

/**
 * Audits brief completeness - checks if all Decision Layer fields are filled
 */
export function auditCompleteness(brief: Partial<Brief>): CompletenessCheck {
  const missingFields: string[] = []

  // Decision Layer mandatory fields
  if (!brief.businessObjective) {
    missingFields.push('businessObjective')
  }
  if (!brief.kpiDescription || brief.kpiDescription.trim() === '') {
    missingFields.push('kpiDescription')
  }
  if (brief.kpiTarget === null || brief.kpiTarget === undefined) {
    missingFields.push('kpiTarget')
  }
  if (!brief.decisionContext) {
    missingFields.push('decisionContext')
  }

  // Other required fields
  if (!brief.title || brief.title.trim() === '') {
    missingFields.push('title')
  }
  if (!brief.context || brief.context.trim() === '') {
    missingFields.push('context')
  }
  if (!brief.deadline) {
    missingFields.push('deadline')
  }

  if (missingFields.length === 0) {
    return {
      status: 'PASS',
      missingFields: [],
      message: 'Wszystkie wymagane pola są wypełnione',
    }
  }

  return {
    status: 'FAIL',
    missingFields,
    message: `Brakujące pola: ${missingFields.join(', ')}`,
  }
}

/**
 * Audits brief consistency - checks if KPIs align with business objective
 */
export function auditConsistency(brief: Partial<Brief>): ConsistencyCheck {
  const issues: string[] = []

  // Check if KPI description aligns with business objective
  if (brief.businessObjective && brief.kpiDescription) {
    const kpiLower = brief.kpiDescription.toLowerCase()

    switch (brief.businessObjective) {
      case 'REVENUE_ACQUISITION':
        // Expected KPIs: leads, conversions, new members, revenue
        const revenueKeywords = ['lead', 'konwersj', 'sprzedaż', 'przychód', 'nowy', 'klient', 'członk']
        if (!revenueKeywords.some(kw => kpiLower.includes(kw))) {
          issues.push('KPI może nie odpowiadać celowi przychodu/pozyskania')
        }
        break

      case 'RETENTION_ENGAGEMENT':
        // Expected KPIs: retention rate, engagement, visits, active users
        const retentionKeywords = ['retencj', 'utrzym', 'zaangażow', 'wizyt', 'aktywn', 'powrot']
        if (!retentionKeywords.some(kw => kpiLower.includes(kw))) {
          issues.push('KPI może nie odpowiadać celowi retencji/zaangażowania')
        }
        break

      case 'OPERATIONAL_EFFICIENCY':
        // Expected KPIs: time saved, cost reduction, process improvement
        const efficiencyKeywords = ['czas', 'koszt', 'efektywn', 'proces', 'automatyz', 'oszczędn']
        if (!efficiencyKeywords.some(kw => kpiLower.includes(kw))) {
          issues.push('KPI może nie odpowiadać celowi efektywności operacyjnej')
        }
        break
    }
  }

  // Check if KPI target is reasonable
  if (brief.kpiTarget !== null && brief.kpiTarget !== undefined) {
    if (brief.kpiTarget <= 0) {
      issues.push('Wartość docelowa KPI musi być dodatnia')
    }
    if (brief.kpiTarget > 1000000) {
      issues.push('Wartość docelowa KPI wydaje się nierealnie wysoka')
    }
  }

  // Check date consistency
  if (brief.startDate && brief.endDate) {
    if (brief.endDate < brief.startDate) {
      issues.push('Data końcowa jest przed datą początkową')
    }
  }

  if (issues.length === 0) {
    return {
      status: 'PASS',
      issues: [],
      message: 'Brief jest spójny wewnętrznie',
    }
  }

  return {
    status: issues.some(i => i.includes('musi być')) ? 'FAIL' : 'WARNING',
    issues,
    message: `Wykryto ${issues.length} potencjalnych niespójności`,
  }
}

/**
 * Audits brief feasibility - checks if deadline is realistic
 */
export function auditFeasibility(
  brief: Partial<Brief>,
  template?: RequestTemplate | null,
  capacity?: ProductionCapacity | null
): FeasibilityCheck {
  const now = new Date()
  const deadline = brief.deadline ? new Date(brief.deadline) : null

  if (!deadline) {
    return {
      status: 'FAIL',
      deadlineRealistic: false,
      message: 'Brak określonego deadline\'u',
    }
  }

  const daysUntilDeadline = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Check against template SLA
  const requiredSLADays = template?.defaultSLADays ?? 5
  const isDeadlineRealistic = daysUntilDeadline >= requiredSLADays

  // Check capacity if available
  let capacityAvailable = true
  if (capacity) {
    // Simplified capacity check - in production, this would check actual slot availability
    capacityAvailable = capacity.isActive
  }

  if (daysUntilDeadline < 1) {
    return {
      status: 'FAIL',
      deadlineRealistic: false,
      capacityAvailable,
      message: 'Deadline jest w przeszłości lub dzisiaj',
    }
  }

  if (daysUntilDeadline < requiredSLADays) {
    return {
      status: 'WARNING',
      deadlineRealistic: false,
      capacityAvailable,
      estimatedCompletionDate: new Date(now.getTime() + requiredSLADays * 24 * 60 * 60 * 1000),
      message: `Deadline (${daysUntilDeadline} dni) jest krótszy niż wymagane SLA (${requiredSLADays} dni)`,
    }
  }

  return {
    status: 'PASS',
    deadlineRealistic: true,
    capacityAvailable,
    message: 'Deadline jest realny do wykonania',
  }
}

/**
 * Audits policy compliance - checks if request follows business rules
 */
export function auditPolicyCompliance(
  brief: Partial<Brief>,
  template?: RequestTemplate | null
): PolicyComplianceCheck {
  const violations: string[] = []
  let requiresEscalation = false
  let escalationReason: string | undefined

  // Check if template is blacklisted
  if (template?.isBlacklisted) {
    violations.push(`Szablon "${template.name}" jest na czarnej liście: ${template.blacklistReason || 'brak powodu'}`)
    requiresEscalation = true
    escalationReason = 'Użycie zablokowanego szablonu'
  }

  // Check estimated cost limits (example thresholds)
  if (brief.estimatedCost) {
    const cost = Number(brief.estimatedCost)
    if (cost > 10000) {
      violations.push('Szacowany koszt przekracza 10,000 PLN')
      requiresEscalation = true
      escalationReason = 'Wysoki koszt wymaga dodatkowej akceptacji'
    }
  }

  // Check if crisis communication needs escalation
  if (brief.isCrisisCommunication) {
    requiresEscalation = true
    escalationReason = 'Komunikacja kryzysowa wymaga natychmiastowej uwagi'
  }

  // Check decision context alignment
  if (brief.decisionContext === 'CENTRAL' && !brief.requiresOwnerApproval) {
    violations.push('Decyzje centralne wymagają zatwierdzenia właściciela')
    requiresEscalation = true
  }

  if (violations.length === 0 && !requiresEscalation) {
    return {
      status: 'PASS',
      violations: [],
      requiresEscalation: false,
      message: 'Brief jest zgodny z polityką',
    }
  }

  return {
    status: violations.length > 0 ? 'FAIL' : 'WARNING',
    violations,
    requiresEscalation,
    escalationReason,
    message: requiresEscalation
      ? `Wymaga eskalacji: ${escalationReason}`
      : `Wykryto ${violations.length} naruszeń polityki`,
  }
}

/**
 * Performs full AI audit on a brief
 * Returns comprehensive audit results without making any decisions
 */
export function performAudit(
  brief: Partial<Brief>,
  template?: RequestTemplate | null,
  capacity?: ProductionCapacity | null
): AIAuditResult {
  const completeness = auditCompleteness(brief)
  const consistency = auditConsistency(brief)
  const feasibility = auditFeasibility(brief, template, capacity)
  const policyCompliance = auditPolicyCompliance(brief, template)

  // Calculate overall status
  const statuses = [
    completeness.status,
    consistency.status,
    feasibility.status,
    policyCompliance.status,
  ]

  let overallStatus: AuditCheckStatus = 'PASS'
  if (statuses.includes('FAIL')) {
    overallStatus = 'FAIL'
  } else if (statuses.includes('WARNING')) {
    overallStatus = 'WARNING'
  }

  return {
    completeness,
    consistency,
    feasibility,
    policyCompliance,
    overallStatus,
    auditedAt: new Date(),
  }
}

/**
 * Checks if brief can be submitted based on audit results
 * Returns true only if completeness check passes (Decision Layer is complete)
 */
export function canSubmit(auditResult: AIAuditResult): boolean {
  // Core rule: No business intent = no brief
  return auditResult.completeness.status === 'PASS'
}

/**
 * Gets human-readable summary of audit results
 */
export function getAuditSummary(auditResult: AIAuditResult): string {
  const parts: string[] = []

  if (auditResult.completeness.status !== 'PASS') {
    parts.push(`⚠️ Kompletność: ${auditResult.completeness.message}`)
  }
  if (auditResult.consistency.status !== 'PASS') {
    parts.push(`⚠️ Spójność: ${auditResult.consistency.message}`)
  }
  if (auditResult.feasibility.status !== 'PASS') {
    parts.push(`⚠️ Wykonalność: ${auditResult.feasibility.message}`)
  }
  if (auditResult.policyCompliance.status !== 'PASS') {
    parts.push(`⚠️ Polityka: ${auditResult.policyCompliance.message}`)
  }

  if (parts.length === 0) {
    return '✅ Brief przeszedł wszystkie kontrole'
  }

  return parts.join('\n')
}
