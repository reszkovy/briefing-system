/**
 * Script: Embed all active StrategyDocuments into vector chunks
 *
 * Usage:
 *   npx tsx scripts/embed-strategy-docs.ts
 *
 * Run when:
 *   - First setup (after pgvector migration)
 *   - You add new strategy documents
 *   - You change embedding model
 *
 * Idempotent: re-running deletes old chunks for each doc and re-embeds.
 */

import { embedStrategyDocument } from '../src/lib/embeddings'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 Finding active strategy documents...')
  const docs = await prisma.strategyDocument.findMany({
    where: { isActive: true },
    select: { id: true, title: true, type: true, scope: true, brand: { select: { name: true } } },
  })

  console.log(`Found ${docs.length} active document(s)\n`)

  if (docs.length === 0) {
    console.log('⚠️  No active strategy documents to embed.')
    console.log('   Create at least one via /admin/strategy before running this script.')
    return
  }

  let totalChunks = 0
  let totalTokens = 0
  const startTime = Date.now()

  for (const doc of docs) {
    const brandTag = doc.brand?.name ? ` [${doc.brand.name}]` : ''
    process.stdout.write(`📄 ${doc.title}${brandTag} ... `)
    const t0 = Date.now()

    try {
      const result = await embedStrategyDocument(doc.id)
      totalChunks += result.chunkCount
      totalTokens += result.totalTokens
      const elapsed = Date.now() - t0
      console.log(`✅ ${result.chunkCount} chunks, ~${result.totalTokens} tokens (${elapsed}ms)`)
    } catch (error) {
      console.log(`❌ FAILED`)
      console.error('   Error:', error instanceof Error ? error.message : error)
    }
  }

  const totalElapsed = Date.now() - startTime
  console.log('\n' + '═'.repeat(60))
  console.log(`✅ Done in ${(totalElapsed / 1000).toFixed(1)}s`)
  console.log(`   ${totalChunks} chunks total`)
  console.log(`   ~${totalTokens} tokens total`)
  console.log(`   Voyage cost (voyage-3 @ $0.06/M): ~$${((totalTokens / 1_000_000) * 0.06).toFixed(4)}`)
}

main()
  .catch((e) => {
    console.error('\n❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
