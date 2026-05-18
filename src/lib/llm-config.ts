/**
 * LLM Configuration — Anthropic + Voyage
 *
 * Models, cost caps, timeouts, retry policy.
 * Centralized config so we can switch providers/models without touching call sites.
 *
 * ENV VARS REQUIRED:
 *   ANTHROPIC_API_KEY=sk-ant-...
 *   VOYAGE_API_KEY=pa-...
 */

export const LLM_CONFIG = {
  // Models
  models: {
    scoring: 'claude-sonnet-4-6',           // Alignment scoring (semantic, smart)
    reasoning: 'claude-haiku-4-5-20251001', // Flag explanations (fast, cheap)
    embedding: 'voyage-3',                  // 1536 dims, multilingual (PL+EN)
  },

  // Cost caps (hard stop — function returns null + warns)
  costCaps: {
    perBriefUSD: 0.05,        // Per single brief
    perTenantMonthUSD: 50,    // Per tenant per month
  },

  // Limits
  limits: {
    maxBriefContextChars: 4000,
    maxStrategyChunksRetrieved: 5,
    embeddingTokenLimit: 8000,
    chunkSizeChars: 2000,
  },

  // Timeouts (ms)
  timeouts: {
    scoring: 5000,
    reasoning: 3000,
    embedding: 10000,
  },

  // Retry policy
  retry: {
    maxAttempts: 3,
    backoffMs: [1000, 2000, 4000],
  },

  // Alignment score thresholds (used in UI badges)
  alignmentThresholds: {
    aligned: 70,      // score >= 70 → green badge
    needsReview: 50,  // 50-69 → yellow badge
    // <50 → red badge
  },

  // Cache TTL (alignment recomputed if brief edited or older than this)
  cacheTtlMs: 24 * 60 * 60 * 1000, // 24h
} as const

// Approximate cost per 1M tokens (USD) — keep in sync with Anthropic/Voyage pricing
export const PRICING = {
  'claude-sonnet-4-6': { input: 3.00, output: 15.00 },
  'claude-haiku-4-5-20251001': { input: 0.80, output: 4.00 },
  'voyage-3': { input: 0.06, output: 0 },
} as const

export function calculateCost(
  model: keyof typeof PRICING,
  inputTokens: number,
  outputTokens: number = 0
): number {
  const pricing = PRICING[model]
  if (!pricing) return 0
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  )
}

/**
 * Helper to check whether LLM is configured.
 * Allows the app to fall back to rule engine gracefully when env vars are missing.
 */
export function isLlmAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY) && Boolean(process.env.VOYAGE_API_KEY)
}
