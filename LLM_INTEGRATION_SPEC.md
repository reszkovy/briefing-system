# regional.fit — LLM Integration Spec

**Cel**: Wpięcie semantic alignment + reasoning AI w 3-tygodniowy slice (tyg 1-3 z PLAN_10_TYG.md).

**Stack decyzja**: Anthropic Claude (Sonnet do scoringu, Haiku do reasoning) + pgvector w Neon + Voyage embeddings.

---

## 🏗️ Architektura

```
┌─────────────────────────────────────────────────────────┐
│                     Brief Submitted                     │
└────────────────────────┬────────────────────────────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
    ┌───────────┐  ┌──────────┐  ┌───────────┐
    │  policy-  │  │   ai-    │  │   llm-    │
    │  engine   │  │ auditor  │  │ auditor   │
    │   (rule)  │  │ (complete│  │ (semantic │
    │           │  │  /consist│  │  + reason)│
    │           │  │   ency)  │  │           │
    └─────┬─────┘  └────┬─────┘  └─────┬─────┘
          │             │              │
          └─────────────┼──────────────┘
                        ▼
              ┌──────────────────┐
              │ Brief.aiAuditResult│
              │     (JSON)        │
              └──────────────────┘
```

**Dlaczego ten układ**: policy engine zostaje jako deterministyczny fallback (zero cost, zero latency). LLM dodaje warstwę semantic, której rule engine nie zrobi.

---

## 📦 Zależności (do dodania w tyg 1)

```bash
npm install @anthropic-ai/sdk voyageai
npm install -D @types/pg  # już prawdopodobnie masz
```

**Postgres extension** (w Neon Console → SQL Editor):
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

**Prisma migration** (`prisma/schema.prisma`):
```prisma
model StrategyDocumentChunk {
  id                   String   @id @default(cuid())
  strategyDocumentId   String
  chunkIndex           Int
  content              String   @db.Text
  embedding            Unsupported("vector(1536)")?  // voyage-3 = 1536 dims
  tokenCount           Int
  createdAt            DateTime @default(now())

  strategyDocument     StrategyDocument @relation(fields: [strategyDocumentId], references: [id], onDelete: Cascade)

  @@index([strategyDocumentId])
  @@index([embedding])  // HNSW index — manual w migration SQL
}
```

**Manual SQL po migracji** (HNSW index dla vector):
```sql
CREATE INDEX strategy_chunk_embedding_idx
  ON "StrategyDocumentChunk"
  USING hnsw (embedding vector_cosine_ops);
```

---

## 📁 Pliki kodu (ready to paste)

### `src/lib/llm-config.ts`

```typescript
/**
 * LLM Configuration — Anthropic + Voyage
 * Cost caps + model selection per use case
 */

export const LLM_CONFIG = {
  // Models
  models: {
    scoring: 'claude-sonnet-4-6',     // Smart: alignment scoring
    reasoning: 'claude-haiku-4-5-20251001',  // Fast: flag explanations
    embedding: 'voyage-3',             // Voyage-3 = 1536 dims, multilingual
  },

  // Cost caps (hard stop)
  costCaps: {
    perBriefUSD: 0.05,        // Hard cap per brief
    perTenantMonthUSD: 50,    // Hard cap per tenant per month
  },

  // Limits
  limits: {
    maxBriefContextChars: 4000,
    maxStrategyChunksRetrieved: 5,
    embeddingTokenLimit: 8000,
  },

  // Timeouts (ms)
  timeouts: {
    scoring: 5000,
    reasoning: 3000,
    embedding: 10000,
  },

  // Retry
  retry: {
    maxAttempts: 3,
    backoffMs: [1000, 2000, 4000],
  },
} as const

// Approximate cost per 1M tokens (USD)
export const PRICING = {
  'claude-sonnet-4-6': { input: 3.00, output: 15.00 },
  'claude-haiku-4-5-20251001': { input: 0.80, output: 4.00 },
  'voyage-3': { input: 0.06, output: 0 },  // embedding only
} as const

export function calculateCost(
  model: keyof typeof PRICING,
  inputTokens: number,
  outputTokens: number = 0
): number {
  const pricing = PRICING[model]
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  )
}
```

---

### `src/lib/embeddings.ts`

```typescript
/**
 * Voyage embeddings + pgvector cosine similarity
 */

import { VoyageAIClient } from 'voyageai'
import { prisma } from './prisma'
import { LLM_CONFIG } from './llm-config'

const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY!,
})

/**
 * Embed a single text → vector
 */
export async function embedText(text: string): Promise<number[]> {
  const response = await voyage.embed({
    input: text.slice(0, LLM_CONFIG.limits.embeddingTokenLimit * 4), // ~4 chars/token
    model: LLM_CONFIG.models.embedding,
    inputType: 'document',
  })
  return response.data[0].embedding
}

/**
 * Embed a query (slightly different prompt internally)
 */
export async function embedQuery(text: string): Promise<number[]> {
  const response = await voyage.embed({
    input: text,
    model: LLM_CONFIG.models.embedding,
    inputType: 'query',
  })
  return response.data[0].embedding
}

/**
 * Chunk strategy document into semantic chunks (~500 tokens each)
 * Simple: split by paragraphs, group to ~2000 chars
 */
export function chunkDocument(content: string, maxCharsPerChunk = 2000): string[] {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0)
  const chunks: string[] = []
  let current = ''

  for (const para of paragraphs) {
    if ((current + para).length > maxCharsPerChunk && current.length > 0) {
      chunks.push(current.trim())
      current = para
    } else {
      current += (current ? '\n\n' : '') + para
    }
  }
  if (current.trim().length > 0) chunks.push(current.trim())

  return chunks
}

/**
 * Embed entire strategy document → store chunks with embeddings
 */
export async function embedStrategyDocument(strategyDocumentId: string): Promise<void> {
  const doc = await prisma.strategyDocument.findUnique({
    where: { id: strategyDocumentId },
  })
  if (!doc) throw new Error(`StrategyDocument ${strategyDocumentId} not found`)

  // Delete existing chunks (re-embed)
  await prisma.$executeRaw`
    DELETE FROM "StrategyDocumentChunk" WHERE "strategyDocumentId" = ${strategyDocumentId}
  `

  const chunks = chunkDocument(doc.content)
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i])
    // pgvector format: '[0.1,0.2,...]'
    const vectorStr = `[${embedding.join(',')}]`

    await prisma.$executeRaw`
      INSERT INTO "StrategyDocumentChunk" (id, "strategyDocumentId", "chunkIndex", content, embedding, "tokenCount")
      VALUES (${cuid()}, ${strategyDocumentId}, ${i}, ${chunks[i]}, ${vectorStr}::vector, ${Math.round(chunks[i].length / 4)})
    `
  }
}

/**
 * Find top-N most similar chunks for a query, scoped to brand
 */
export async function findSimilarChunks(
  queryEmbedding: number[],
  brandId: string,
  topN: number = LLM_CONFIG.limits.maxStrategyChunksRetrieved
): Promise<Array<{ id: string; content: string; similarity: number }>> {
  const vectorStr = `[${queryEmbedding.join(',')}]`

  const results = await prisma.$queryRaw<Array<{
    id: string
    content: string
    similarity: number
  }>>`
    SELECT
      c.id,
      c.content,
      1 - (c.embedding <=> ${vectorStr}::vector) AS similarity
    FROM "StrategyDocumentChunk" c
    INNER JOIN "StrategyDocument" sd ON sd.id = c."strategyDocumentId"
    WHERE
      sd."isActive" = true
      AND (sd."brandId" = ${brandId} OR sd.scope = 'GLOBAL')
    ORDER BY c.embedding <=> ${vectorStr}::vector
    LIMIT ${topN}
  `

  return results
}

// Helper: cuid for raw inserts (Prisma normally handles this)
function cuid(): string {
  // Use crypto.randomUUID() or import { createId } from '@paralleldrive/cuid2'
  return crypto.randomUUID()
}
```

---

### `src/lib/llm-auditor.ts`

```typescript
/**
 * LLM Auditor — semantic alignment scoring + flag reasoning
 * Uses Anthropic Claude. Falls back to rule engine on error.
 */

import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './prisma'
import { LLM_CONFIG, calculateCost } from './llm-config'
import { embedQuery, findSimilarChunks } from './embeddings'
import type { Brief } from '@prisma/client'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// ============================================
// TYPES
// ============================================

export type AlignmentResult = {
  score: number              // 0-100
  rationale: string          // 1-zdaniowy PL
  model: string
  cost: number               // USD
  timestamp: Date
  topChunks: Array<{
    content: string
    similarity: number
  }>
}

export type FlagReasoning = {
  flagId: string
  humanExplanation: string   // 1-2 zdania PL, contextual
  model: string
  cost: number
  timestamp: Date
}

// ============================================
// SEMANTIC ALIGNMENT SCORING
// ============================================

const ALIGNMENT_SYSTEM_PROMPT = `Jesteś auditorem strategicznej spójności w marketingu wielo-lokalizacyjnym.

Twoja rola: ocenić, na ile brief lokalnego managera jest spójny ze strategią marki.

Zasady:
- Skala 0-100 (0=całkowicie niespójny, 50=neutralny, 100=idealnie zgodny)
- Score 70+ = aligned, 50-69 = needs review, <50 = misaligned
- Rationale w 1 krótkim zdaniu po polsku, bez ozdobników
- Nie sugerujesz zmian, tylko oceniasz
- Bazujesz WYŁĄCZNIE na dostarczonym kontekście strategii. Nie zgaduj.`

export async function computeAlignmentScore(brief: Brief): Promise<AlignmentResult | null> {
  // Edge cases
  if (!brief.context || brief.context.length < 50) {
    return null
  }

  try {
    // 1. Embed brief content (title + context)
    const briefText = `${brief.title}\n\n${brief.context}`.slice(0, LLM_CONFIG.limits.maxBriefContextChars)
    const briefEmbedding = await embedQuery(briefText)

    // 2. Retrieve top-N strategy chunks for brand
    const topChunks = await findSimilarChunks(briefEmbedding, brief.brandId, 5)

    if (topChunks.length === 0) {
      return {
        score: 50,
        rationale: 'Brak dokumentów strategicznych dla tej marki — wymagana decyzja manualna.',
        model: 'fallback',
        cost: 0,
        timestamp: new Date(),
        topChunks: [],
      }
    }

    // 3. Build user prompt
    const strategyContext = topChunks
      .map((c, i) => `[Fragment ${i + 1}, similarity ${c.similarity.toFixed(2)}]\n${c.content}`)
      .join('\n\n---\n\n')

    const userPrompt = `# STRATEGIA MARKI (najistotniejsze fragmenty)

${strategyContext}

---

# BRIEF DO OCENY

**Tytuł**: ${brief.title}

**Kontekst**:
${brief.context}

${brief.kpiDescription ? `**KPI**: ${brief.kpiDescription}` : ''}

---

Zwróć odpowiedź w formacie JSON:
{
  "score": <0-100>,
  "rationale": "<1 zdanie po polsku>"
}`

    // 4. Call Claude Sonnet
    const response = await anthropic.messages.create({
      model: LLM_CONFIG.models.scoring,
      max_tokens: 200,
      system: ALIGNMENT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    // 5. Parse + cost
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])
    const cost = calculateCost(
      LLM_CONFIG.models.scoring,
      response.usage.input_tokens,
      response.usage.output_tokens
    )

    return {
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      rationale: String(parsed.rationale).slice(0, 300),
      model: LLM_CONFIG.models.scoring,
      cost,
      timestamp: new Date(),
      topChunks: topChunks.map(c => ({
        content: c.content.slice(0, 200) + '...',
        similarity: c.similarity,
      })),
    }
  } catch (error) {
    console.error('[llm-auditor] Alignment scoring failed:', error)
    // Sentry.captureException(error)
    return null
  }
}

// ============================================
// FLAG REASONING (Haiku)
// ============================================

const REASONING_SYSTEM_PROMPT = `Jesteś asystentem walidatora marketingu. Wyjaśniasz, dlaczego konkretny flag policy engine jest istotny dla TEGO konkretnego briefu.

Zasady:
- 1-2 zdania po polsku
- Konkretnie do briefu, nie generycznie
- Bez ozdobników, bez emocji
- Jeśli flag jest minor — powiedz to wprost`

export async function explainFlag(
  brief: Brief,
  flag: { rule: string; message: string }
): Promise<FlagReasoning | null> {
  try {
    const userPrompt = `# BRIEF
**Tytuł**: ${brief.title}
**Kontekst**: ${brief.context.slice(0, 500)}

# FLAG Z POLICY ENGINE
- Rule: ${flag.rule}
- Default message: ${flag.message}

# ZADANIE
Wyjaśnij w 1-2 zdaniach po polsku, dlaczego ten flag jest istotny dla TEGO briefu. Konkretnie, nie generycznie.`

    const response = await anthropic.messages.create({
      model: LLM_CONFIG.models.reasoning,
      max_tokens: 150,
      system: REASONING_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
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
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('[llm-auditor] Flag reasoning failed:', error)
    return null
  }
}

// ============================================
// CACHE + SAVE TO DB
// ============================================

export async function getOrComputeAlignment(briefId: string, force = false): Promise<AlignmentResult | null> {
  const brief = await prisma.brief.findUnique({ where: { id: briefId } })
  if (!brief) return null

  // Check cache
  if (!force && brief.aiAuditResult) {
    const cached = (brief.aiAuditResult as any)?.alignment
    if (cached && new Date(cached.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return cached
    }
  }

  // Compute
  const result = await computeAlignmentScore(brief)
  if (!result) return null

  // Save
  const existing = (brief.aiAuditResult as any) || {}
  await prisma.brief.update({
    where: { id: briefId },
    data: {
      aiAuditResult: { ...existing, alignment: result },
      aiAuditedAt: new Date(),
    },
  })

  return result
}
```

---

## 🧪 Test plan (tyg 2)

```typescript
// scripts/test-llm-auditor.ts

import { embedStrategyDocument } from '../src/lib/embeddings'
import { computeAlignmentScore } from '../src/lib/llm-auditor'
import { prisma } from '../src/lib/prisma'

async function main() {
  // 1. Embed all active strategy docs
  const docs = await prisma.strategyDocument.findMany({ where: { isActive: true } })
  for (const doc of docs) {
    console.log(`Embedding: ${doc.title}`)
    await embedStrategyDocument(doc.id)
  }

  // 2. Test on 20 historical briefs
  const briefs = await prisma.brief.findMany({
    where: { status: { in: ['APPROVED', 'DELIVERED'] } },
    take: 20,
  })

  let totalCost = 0
  let totalLatencyMs = 0
  const results = []

  for (const brief of briefs) {
    const t0 = Date.now()
    const result = await computeAlignmentScore(brief)
    const latency = Date.now() - t0

    if (result) {
      totalCost += result.cost
      totalLatencyMs += latency
      results.push({
        brief: brief.title.slice(0, 40),
        score: result.score,
        rationale: result.rationale,
        latency,
        cost: result.cost,
      })
    }
  }

  console.table(results)
  console.log(`\nAvg latency: ${Math.round(totalLatencyMs / results.length)}ms`)
  console.log(`Total cost: $${totalCost.toFixed(4)} (avg $${(totalCost / results.length).toFixed(4)}/brief)`)
}

main().catch(console.error).finally(() => process.exit(0))
```

**Pass criteria**:
- Avg latency <3000ms
- Avg cost <$0.02/brief
- Score correlates z `outcome` field (APPROVED briefs > 60 average)
- Rationale brzmi sensownie w PL (manual review 20/20)

---

## 💰 Cost monitoring

**Hard cap check** (dodaj do każdej funkcji LLM):
```typescript
async function checkMonthlyCostCap(tenantId: string): Promise<boolean> {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const month = await prisma.$queryRaw<{ total: number }[]>`
    SELECT COALESCE(SUM((ai_audit_result->'alignment'->>'cost')::float), 0) as total
    FROM "Brief"
    WHERE "tenantId" = ${tenantId}
      AND ai_audited_at >= ${startOfMonth}
  `
  return month[0].total < LLM_CONFIG.costCaps.perTenantMonthUSD
}
```

**Alert email** (przy 80% cap): cron job w tyg 6, dorobisz po pilocie.

---

## 🚨 Error handling pattern

Każda funkcja LLM:
1. Try LLM call
2. Catch → log to Sentry
3. Return null (NIE throw — żeby UI miało fallback)
4. UI: jeśli null → pokaż „AI niedostępne, ocena manualna" + rule engine score

To gwarantuje, że awaria Anthropic nie wywala produktu.

---

## 📚 Resources

- Anthropic API: https://docs.anthropic.com/
- Voyage embeddings: https://docs.voyageai.com/
- pgvector: https://github.com/pgvector/pgvector
- Neon + pgvector guide: https://neon.tech/docs/extensions/pgvector

---

**Status**: Ready to implement w tyg 1-3
**Owner**: Reszek
**Last updated**: 2026-05-17
