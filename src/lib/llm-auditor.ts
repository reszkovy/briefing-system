/**
 * LLM Auditor — semantic alignment scoring + flag reasoning
 *
 * Two functions, two Claude models:
 *   1. computeAlignmentScore() — Sonnet, semantic match brief ↔ strategy
 *   2. explainFlag()           — Haiku, human-readable explanation per rule violation
 *
 * Falls back to null on any error (UI then uses rule engine result).
 * This is intentional: a failed LLM call MUST NOT break the product.
 *
 * Costs (approximate):
 *   - Alignment scoring: ~$0.012 per brief
 *   - Flag reasoning:    ~$0.002 per flag
 *
 * USAGE:
 *   const alignment = await getOrComputeAlignment(briefId)
 *   const reasoning = await explainFlag(brief, { rule, message })
 */

import type { Brief } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './prisma'
import { LLM_CONFIG, calculateCost, isLlmAvailable } from './llm-config'
import { embedQuery, findSimilarChunks } from './embeddings'

// =============================================================================
// TYPES
// =============================================================================

export type AlignmentResult = {
  score: number              // 0-100
  rationale: string          // 1-zdaniowy PL
  model: string
  cost: number               // USD
  timestamp: string          // ISO datetime
  topChunks: Array<{
    content: string
    similarity: number
    strategyDocumentTitle: string
  }>
}

export type FlagReasoning = {
  flagId: string
  humanExplanation: string   // 1-2 zdania PL, contextual
  model: string
  cost: number
  timestamp: string          // ISO datetime
}

export type BriefForAlignment = Pick<
  Brief,
  'id' | 'title' | 'context' | 'brandId' | 'kpiDescription'
>

// =============================================================================
// ANTHROPIC CLIENT (lazy init)
// =============================================================================

let anthropicClient: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (anthropicClient) return anthropicClient
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment')
  }
  anthropicClient = new Anthropic({ apiKey })
  return anthropicClient
}

// =============================================================================
// 1. SEMANTIC ALIGNMENT SCORING (Claude Sonnet)
// =============================================================================

const ALIGNMENT_SYSTEM_PROMPT = `Jesteś auditorem strategicznej spójności w marketingu wielo-lokalizacyjnym.

Twoja rola: ocenić, na ile brief lokalnego managera jest spójny ze strategią marki.

Zasady:
- Skala 0-100 (0 = całkowicie niespójny, 50 = neutralny, 100 = idealnie zgodny)
- Score 70+ = aligned, 50-69 = needs review, <50 = misaligned
- Rationale w 1 krótkim zdaniu po polsku, bez ozdobników, bez emoji
- Nie sugerujesz zmian, tylko oceniasz
- Bazujesz WYŁĄCZNIE na dostarczonych fragmentach strategii. Nie zgaduj.
- Jeśli fragmenty strategii nie pokrywają tematu briefu — score = 50, rationale = "Brak danych strategicznych dla tego tematu"`

/**
 * Compute semantic alignment score for a brief.
 * Returns null on any error (LLM unavailable, network, parsing, etc).
 */
export async function computeAlignmentScore(
  brief: BriefForAlignment
): Promise<AlignmentResult | null> {
  // Pre-checks
  if (!isLlmAvailable()) return null
  if (!brief.context || brief.context.length < 50) return null

  try {
    // 1. Embed brief (title + context as query)
    const briefText = `${brief.title}\n\n${brief.context}`.slice(
      0,
      LLM_CONFIG.limits.maxBriefContextChars
    )
    const briefEmbedding = await embedQuery(briefText)

    // 2. Retrieve top-N strategy chunks scoped to brand
    const topChunks = await findSimilarChunks(briefEmbedding, brief.brandId)

    if (topChunks.length === 0) {
      return {
        score: 50,
        rationale: 'Brak dokumentów strategicznych dla tej marki — wymagana decyzja manualna.',
        model: 'fallback',
        cost: 0,
        timestamp: new Date().toISOString(),
        topChunks: [],
      }
    }

    // 3. Build user prompt with retrieved context
    const strategyContext = topChunks
      .map(
        (c, i) =>
          `[Fragment ${i + 1} z "${c.strategyDocumentTitle}", podobieństwo ${c.similarity.toFixed(2)}]\n${c.content}`
      )
      .join('\n\n---\n\n')

    const userPrompt = `# STRATEGIA MARKI (najistotniejsze fragmenty)

${strategyContext}

---

# BRIEF DO OCENY

**Tytuł**: ${brief.title}

**Kontekst**:
${brief.context}

${brief.kpiDescription ? `**KPI**: ${brief.kpiDescription}\n` : ''}
---

Zwróć WYŁĄCZNIE JSON w formacie:
{"score": <0-100>, "rationale": "<1 zdanie po polsku>"}`

    // 4. Call Claude Sonnet
    const client = getAnthropicClient()
    const response = await client.messages.create({
      model: LLM_CONFIG.models.scoring,
      max_tokens: 200,
      system: ALIGNMENT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    // 5. Parse response
    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[llm-auditor] No JSON in alignment response:', text)
      return null
    }

    const parsed = JSON.parse(jsonMatch[0])
    const cost = calculateCost(
      LLM_CONFIG.models.scoring,
      response.usage.input_tokens,
      response.usage.output_tokens
    )

    return {
      score: Math.max(0, Math.min(100, Math.round(Number(parsed.score)))),
      rationale: String(parsed.rationale).slice(0, 300),
      model: LLM_CONFIG.models.scoring,
      cost,
      timestamp: new Date().toISOString(),
      topChunks: topChunks.map((c) => ({
        content: c.content.slice(0, 200) + (c.content.length > 200 ? '...' : ''),
        similarity: Number(c.similarity.toFixed(3)),
        strategyDocumentTitle: c.strategyDocumentTitle,
      })),
    }
  } catch (error) {
    console.error('[llm-auditor] Alignment scoring failed:', error)
    // TODO(week 1): Sentry.captureException(error)
    return null
  }
}

// =============================================================================
// 2. FLAG REASONING (Claude Haiku)
// =============================================================================

const REASONING_SYSTEM_PROMPT = `Jesteś asystentem walidatora marketingu. Wyjaśniasz, dlaczego konkretny flag policy engine jest istotny dla TEGO konkretnego briefu.

Zasady:
- 1-2 zdania po polsku
- Konkretnie do briefu, nie generycznie
- Bez ozdobników, bez emocji, bez emoji
- Jeśli flag jest minor → powiedz to wprost ("Mało istotne, ale ...")
- Jeśli flag jest krytyczny → uzasadnij dlaczego ("Krytyczne, ponieważ ...")`

export async function explainFlag(
  brief: BriefForAlignment,
  flag: { rule: string; message: string }
): Promise<FlagReasoning | null> {
  if (!isLlmAvailable()) return null

  try {
    const userPrompt = `# BRIEF
**Tytuł**: ${brief.title}
**Kontekst**: ${brief.context.slice(0, 500)}

# FLAG Z POLICY ENGINE
- Rule: ${flag.rule}
- Domyślny komunikat: ${flag.message}

# ZADANIE
Wyjaśnij w 1-2 zdaniach po polsku, dlaczego ten flag jest istotny dla TEGO briefu. Konkretnie, nie generycznie.`

    const client = getAnthropicClient()
    const response = await client.messages.create({
      model: LLM_CONFIG.models.reasoning,
      max_tokens: 150,
      system: REASONING_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    const cost = calculateCost(
      LLM_CONFIG.models.reasoning,
      response.usage.input_tokens,
      response.usage.output_tokens
    )

    return {
      flagId: flag.rule,
      humanExplanation: text.trim().slice(0, 400),
      model: LLM_CONFIG.models.reasoning,
      cost,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[llm-auditor] Flag reasoning failed:', error)
    return null
  }
}

// =============================================================================
// 3. CACHE LAYER (DB-backed, 24h TTL)
// =============================================================================

/**
 * Get alignment from cache or compute fresh.
 * Cache lives in Brief.aiAuditResult JSON, keyed by 'alignment'.
 * TTL: 24h, OR force recompute when brief title/context changes.
 */
export async function getOrComputeAlignment(
  briefId: string,
  options: { force?: boolean } = {}
): Promise<AlignmentResult | null> {
  const brief = await prisma.brief.findUnique({ where: { id: briefId } })
  if (!brief) return null

  // Check cache
  if (!options.force && brief.aiAuditResult) {
    const audit = brief.aiAuditResult as { alignment?: AlignmentResult }
    const cached = audit.alignment
    if (cached?.timestamp) {
      const age = Date.now() - new Date(cached.timestamp).getTime()
      if (age < LLM_CONFIG.cacheTtlMs) {
        return cached
      }
    }
  }

  // Compute fresh
  const result = await computeAlignmentScore({
    id: brief.id,
    title: brief.title,
    context: brief.context,
    brandId: brief.brandId,
    kpiDescription: brief.kpiDescription,
  })
  if (!result) return null

  // Save to cache
  const existing = (brief.aiAuditResult as Record<string, unknown>) || {}
  await prisma.brief.update({
    where: { id: briefId },
    data: {
      aiAuditResult: { ...existing, alignment: result },
      aiAuditedAt: new Date(),
    },
  })

  return result
}

// =============================================================================
// 4. UI HELPERS
// =============================================================================

/**
 * Returns badge color class based on alignment score thresholds.
 * Use in Tailwind classes for badges.
 */
export function getAlignmentBadgeColor(score: number | null | undefined): {
  bg: string
  text: string
  border: string
  label: string
} {
  if (score === null || score === undefined) {
    return {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      label: 'Niedostępny',
    }
  }
  if (score >= LLM_CONFIG.alignmentThresholds.aligned) {
    return {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      label: 'Aligned',
    }
  }
  if (score >= LLM_CONFIG.alignmentThresholds.needsReview) {
    return {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      label: 'Do przeglądu',
    }
  }
  return {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    label: 'Misaligned',
  }
}
