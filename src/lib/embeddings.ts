/**
 * Voyage embeddings + pgvector cosine similarity
 *
 * Strategy:
 *   1. Chunk StrategyDocument.content into ~2000-char chunks (semantic paragraph split)
 *   2. Embed each chunk via Voyage AI (voyage-3, 1536 dims, multilingual)
 *   3. Store as Postgres vector column with HNSW index
 *   4. Query: embed brief text, find top-N similar chunks scoped to brand
 *
 * SETUP (run once):
 *   - In Neon SQL Editor: CREATE EXTENSION IF NOT EXISTS vector;
 *   - Run Prisma migration to add StrategyDocumentChunk table
 *   - In Neon: CREATE INDEX strategy_chunk_embedding_idx ON "StrategyDocumentChunk"
 *               USING hnsw (embedding vector_cosine_ops);
 *
 * USAGE:
 *   await embedStrategyDocument(docId)        // when a doc is created/updated
 *   const chunks = await findSimilarChunks(...)  // when scoring a brief
 */

import { prisma } from './prisma'
import { LLM_CONFIG } from './llm-config'

// =============================================================================
// VOYAGE CLIENT (lazy init — avoid loading at module load time)
// =============================================================================

let voyageClient: { embed: (params: VoyageEmbedParams) => Promise<VoyageEmbedResponse> } | null = null

interface VoyageEmbedParams {
  input: string | string[]
  model: string
  inputType?: 'query' | 'document'
}

interface VoyageEmbedResponse {
  data: Array<{ embedding: number[] }>
  usage: { totalTokens: number }
}

async function getVoyageClient() {
  if (voyageClient) return voyageClient

  // Dynamic import — keeps Voyage SDK out of edge runtime if not used
  const { VoyageAIClient } = await import('voyageai')
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) {
    throw new Error('VOYAGE_API_KEY is not set in environment')
  }

  voyageClient = new VoyageAIClient({ apiKey }) as typeof voyageClient
  return voyageClient!
}

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Embed a single text → vector (1536 dims for voyage-3)
 * Use for documents (chunks of strategy)
 */
export async function embedText(text: string): Promise<number[]> {
  const client = await getVoyageClient()
  const safeText = text.slice(0, LLM_CONFIG.limits.embeddingTokenLimit * 4)

  const response = await client.embed({
    input: safeText,
    model: LLM_CONFIG.models.embedding,
    inputType: 'document',
  })

  return response.data[0].embedding
}

/**
 * Embed a query (slightly different prompt internally vs document)
 * Use for brief content when searching for matching strategy
 */
export async function embedQuery(text: string): Promise<number[]> {
  const client = await getVoyageClient()

  const response = await client.embed({
    input: text,
    model: LLM_CONFIG.models.embedding,
    inputType: 'query',
  })

  return response.data[0].embedding
}

/**
 * Chunk a long markdown/text document into semantic chunks.
 * Splits by double newline (paragraphs), groups to ~2000 chars per chunk.
 * Preserves paragraph boundaries.
 */
export function chunkDocument(
  content: string,
  maxCharsPerChunk: number = LLM_CONFIG.limits.chunkSizeChars
): string[] {
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  const chunks: string[] = []
  let current = ''

  for (const para of paragraphs) {
    // If single paragraph exceeds limit, split by sentence
    if (para.length > maxCharsPerChunk) {
      if (current) {
        chunks.push(current.trim())
        current = ''
      }
      const sentences = para.split(/(?<=[.!?])\s+/)
      let sentenceBuf = ''
      for (const sentence of sentences) {
        if ((sentenceBuf + sentence).length > maxCharsPerChunk && sentenceBuf) {
          chunks.push(sentenceBuf.trim())
          sentenceBuf = sentence
        } else {
          sentenceBuf += (sentenceBuf ? ' ' : '') + sentence
        }
      }
      if (sentenceBuf) {
        current = sentenceBuf
      }
      continue
    }

    if ((current + para).length > maxCharsPerChunk && current.length > 0) {
      chunks.push(current.trim())
      current = para
    } else {
      current += (current ? '\n\n' : '') + para
    }
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim())
  }

  return chunks
}

/**
 * Embed entire strategy document → store chunks with embeddings in DB.
 * Idempotent: deletes existing chunks for this doc, re-embeds.
 *
 * Run this when:
 *   - A new StrategyDocument is created
 *   - An existing one is updated
 *   - You change the embedding model (rare)
 */
export async function embedStrategyDocument(strategyDocumentId: string): Promise<{
  chunkCount: number
  totalTokens: number
}> {
  const doc = await prisma.strategyDocument.findUnique({
    where: { id: strategyDocumentId },
  })
  if (!doc) {
    throw new Error(`StrategyDocument ${strategyDocumentId} not found`)
  }

  // Delete existing chunks for this doc (re-embed scenario)
  await prisma.$executeRaw`
    DELETE FROM "StrategyDocumentChunk" WHERE "strategyDocumentId" = ${strategyDocumentId}
  `

  const chunks = chunkDocument(doc.content)
  let totalTokens = 0

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i]
    const embedding = await embedText(chunkText)
    const vectorStr = `[${embedding.join(',')}]`
    const tokenCount = Math.round(chunkText.length / 4) // rough approximation
    totalTokens += tokenCount

    await prisma.$executeRaw`
      INSERT INTO "StrategyDocumentChunk" (
        id, "strategyDocumentId", "chunkIndex", content, embedding, "tokenCount", "createdAt"
      ) VALUES (
        ${generateId()},
        ${strategyDocumentId},
        ${i},
        ${chunkText},
        ${vectorStr}::vector,
        ${tokenCount},
        NOW()
      )
    `
  }

  return { chunkCount: chunks.length, totalTokens }
}

/**
 * Find top-N most semantically similar strategy chunks for a brief.
 * Scoped to brand (only chunks from documents tagged with this brand OR GLOBAL).
 *
 * Returns similarity scores (0-1, higher = more similar).
 */
export async function findSimilarChunks(
  queryEmbedding: number[],
  brandId: string,
  topN: number = LLM_CONFIG.limits.maxStrategyChunksRetrieved
): Promise<
  Array<{
    id: string
    content: string
    similarity: number
    strategyDocumentId: string
    strategyDocumentTitle: string
  }>
> {
  const vectorStr = `[${queryEmbedding.join(',')}]`

  const results = await prisma.$queryRaw<
    Array<{
      id: string
      content: string
      similarity: number
      strategyDocumentId: string
      strategyDocumentTitle: string
    }>
  >`
    SELECT
      c.id,
      c.content,
      c."strategyDocumentId",
      sd.title AS "strategyDocumentTitle",
      1 - (c.embedding <=> ${vectorStr}::vector) AS similarity
    FROM "StrategyDocumentChunk" c
    INNER JOIN "StrategyDocument" sd ON sd.id = c."strategyDocumentId"
    WHERE
      sd."isActive" = true
      AND (sd."brandId" = ${brandId} OR sd.scope = 'GLOBAL')
    ORDER BY c.embedding <=> ${vectorStr}::vector ASC
    LIMIT ${topN}
  `

  return results
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate a cuid-compatible ID for raw inserts.
 * Falls back to crypto.randomUUID if @paralleldrive/cuid2 not installed.
 */
function generateId(): string {
  // If you install @paralleldrive/cuid2, swap this for createId()
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  // Fallback: timestamp + random
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`
}
