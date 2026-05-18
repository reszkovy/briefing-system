-- ============================================================================
-- pgvector setup for regional.fit (run manually in Neon SQL Editor)
-- ============================================================================
-- This file is a REFERENCE, not a Prisma migration. Run these statements
-- manually in your Neon dashboard SQL Editor, in order, before running
-- the Prisma migration that adds StrategyDocumentChunk.
--
-- Order of operations:
--   1. Run this file (step 1: enable extension)
--   2. Add StrategyDocumentChunk model to prisma/schema.prisma
--      (Unsupported("vector(1536)") for embedding column)
--   3. Run `npx prisma migrate dev --name add_strategy_chunks`
--   4. Run this file (step 2: create HNSW index)
--   5. Run `npx tsx scripts/embed-strategy-docs.ts` to populate
-- ============================================================================


-- STEP 1: Enable pgvector extension
-- (run once, before any vector columns are added)
CREATE EXTENSION IF NOT EXISTS vector;


-- STEP 2: Create HNSW index for fast cosine similarity queries
-- (run AFTER Prisma migration that creates StrategyDocumentChunk table)
CREATE INDEX IF NOT EXISTS strategy_chunk_embedding_idx
  ON "StrategyDocumentChunk"
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);


-- STEP 3 (optional): verify setup
-- Should return 1 row with extname='vector'
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Should show the HNSW index
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'StrategyDocumentChunk';


-- ============================================================================
-- PRISMA SCHEMA SNIPPET (add to schema.prisma)
-- ============================================================================
-- model StrategyDocumentChunk {
--   id                   String   @id @default(cuid())
--   strategyDocumentId   String
--   chunkIndex           Int
--   content              String   @db.Text
--   embedding            Unsupported("vector(1536)")?
--   tokenCount           Int
--   createdAt            DateTime @default(now())
--
--   strategyDocument     StrategyDocument @relation(fields: [strategyDocumentId], references: [id], onDelete: Cascade)
--
--   @@index([strategyDocumentId])
-- }
--
-- And add to StrategyDocument model:
--   chunks               StrategyDocumentChunk[]
-- ============================================================================


-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
-- Q: "extension vector does not exist"
-- A: Neon has pgvector pre-installed. Just run CREATE EXTENSION.
--    If on local Postgres, install pgvector first:
--    https://github.com/pgvector/pgvector#installation
--
-- Q: "type vector does not exist"
-- A: Connect to the correct database. pgvector is per-database.
--
-- Q: Index too slow?
-- A: Tune HNSW params. m=16 ef_construction=64 is reasonable for <100k vectors.
--    For 1M+, consider IVFFlat: USING ivfflat (embedding vector_cosine_ops)
-- ============================================================================
