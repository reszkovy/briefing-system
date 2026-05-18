/**
 * Script: Benchmark LLM auditor on historical briefs
 *
 * Usage:
 *   npx tsx scripts/test-llm-auditor.ts
 *
 * What it does:
 *   1. Picks 20 historical APPROVED/DELIVERED briefs
 *   2. Computes alignment score for each
 *   3. Reports: avg latency, avg cost, score distribution
 *   4. Pass criteria:
 *      - Avg latency <3000ms
 *      - Avg cost <$0.02/brief
 *      - APPROVED briefs should average >60 (sanity check)
 */

import { computeAlignmentScore } from '../src/lib/llm-auditor'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('📊 Loading historical briefs...')
  const briefs = await prisma.brief.findMany({
    where: {
      status: { in: ['APPROVED', 'DELIVERED'] },
      context: { not: '' },
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
  })

  if (briefs.length === 0) {
    console.log('⚠️  No historical briefs found. Seed some data first.')
    return
  }

  console.log(`Testing ${briefs.length} briefs\n`)

  let totalCost = 0
  let totalLatencyMs = 0
  let successCount = 0
  const scores: number[] = []
  const results: Array<{
    title: string
    score: number | null
    latency: number
    cost: number
    rationale: string
  }> = []

  for (const brief of briefs) {
    const t0 = Date.now()
    const result = await computeAlignmentScore({
      id: brief.id,
      title: brief.title,
      context: brief.context,
      brandId: brief.brandId,
      kpiDescription: brief.kpiDescription,
    })
    const latency = Date.now() - t0

    if (result) {
      totalCost += result.cost
      totalLatencyMs += latency
      successCount++
      scores.push(result.score)
      results.push({
        title: brief.title.slice(0, 50),
        score: result.score,
        latency,
        cost: result.cost,
        rationale: result.rationale.slice(0, 80),
      })
    } else {
      results.push({
        title: brief.title.slice(0, 50),
        score: null,
        latency,
        cost: 0,
        rationale: 'FAILED',
      })
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('RESULTS')
  console.log('═══════════════════════════════════════════════════════════════\n')

  console.table(results)

  if (successCount > 0) {
    const avgLatency = Math.round(totalLatencyMs / successCount)
    const avgCost = totalCost / successCount
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

    console.log('\n📈 SUMMARY')
    console.log(`   Success rate:  ${successCount}/${briefs.length} (${Math.round((successCount / briefs.length) * 100)}%)`)
    console.log(`   Avg latency:   ${avgLatency}ms  ${avgLatency < 3000 ? '✅' : '⚠️  (target <3000ms)'}`)
    console.log(`   Avg cost:      $${avgCost.toFixed(4)}/brief  ${avgCost < 0.02 ? '✅' : '⚠️  (target <$0.02)'}`)
    console.log(`   Avg score:     ${avgScore.toFixed(1)}/100  ${avgScore > 60 ? '✅' : '⚠️  (APPROVED briefs should avg >60)'}`)
    console.log(`   Total cost:    $${totalCost.toFixed(4)}`)

    // Distribution
    const aligned = scores.filter((s) => s >= 70).length
    const review = scores.filter((s) => s >= 50 && s < 70).length
    const misaligned = scores.filter((s) => s < 50).length
    console.log('\n📊 DISTRIBUTION')
    console.log(`   Aligned (≥70):    ${aligned} (${Math.round((aligned / scores.length) * 100)}%)`)
    console.log(`   Needs review:     ${review} (${Math.round((review / scores.length) * 100)}%)`)
    console.log(`   Misaligned (<50): ${misaligned} (${Math.round((misaligned / scores.length) * 100)}%)`)
  } else {
    console.log('\n❌ All calls failed. Check ANTHROPIC_API_KEY and VOYAGE_API_KEY.')
  }
}

main()
  .catch((e) => {
    console.error('\n❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
