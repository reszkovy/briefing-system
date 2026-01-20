'use client'

import { useMemo } from 'react'

interface AlignmentBarProps {
  briefContext: string
  briefTitle: string
  strategyContent: string | null
  brandName: string
}

// Keywords and their weights for Zdrofit strategy alignment
const ZDROFIT_POSITIVE_KEYWORDS = {
  // Kluczowe zajęcia (wysokie dopasowanie)
  'yoga': 15,
  'joga': 15,
  'pilates': 15,
  'mobility': 12,
  'stretching': 12,
  'rozciąganie': 12,
  'wellness': 10,
  'mindfulness': 10,
  'medytacja': 10,
  'relaks': 8,
  'regeneracja': 8,

  // Priorytet strategiczny - retencja
  'retencja': 15,
  'lojalność': 12,
  'lojalnościowy': 12,
  'obecni członkowie': 12,
  'obecnych członków': 12,
  'klubowicz': 10,
  'członek': 8,
  'regularność': 10,
  'nawyk': 8,

  // Doświadczenie klubowicza
  'komfort': 8,
  'zdrowie': 8,
  'doświadczenie': 8,
  'jakość': 6,
  'sauna': 6,
  'strefa wellness': 8,
}

const ZDROFIT_NEGATIVE_KEYWORDS = {
  // Akwizycja (nie priorytet dla Zdrofit)
  'akwizycja': -15,
  'akwizycyjn': -12,
  'nowi klienci': -12,
  'nowych klientów': -12,
  'nowych członków': -10,
  'pozyskanie': -10,
  'przyciągnięcie': -8,

  // Promocje cenowe
  'rabat': -8,
  'zniżka': -8,
  'promocja cenowa': -10,
  '-50%': -10,
  '-30%': -8,
  'black friday': -12,
  'first minute': -6,

  // Zajęcia nie w strategii
  'hiit': -10,
  'crossfit': -10,
  'spinning': -5,
  'functional': -3,

  // Open doors / darmowe wejścia
  'darmowe wejścia': -10,
  'open doors': -10,
  'dzień otwarty': -8,
  'bring a friend': -8,
  'viralowy': -8,
}

function calculateAlignmentScore(context: string, title: string): number {
  const text = `${title} ${context}`.toLowerCase()
  let score = 50 // Base score

  // Check positive keywords
  for (const [keyword, weight] of Object.entries(ZDROFIT_POSITIVE_KEYWORDS)) {
    if (text.includes(keyword.toLowerCase())) {
      score += weight
    }
  }

  // Check negative keywords
  for (const [keyword, weight] of Object.entries(ZDROFIT_NEGATIVE_KEYWORDS)) {
    if (text.includes(keyword.toLowerCase())) {
      score += weight // weight is already negative
    }
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score))
}

function getAlignmentLabel(score: number): { label: string; description: string } {
  if (score >= 80) {
    return {
      label: 'Wysoki',
      description: 'Brief doskonale wpisuje się w strategię marki'
    }
  }
  if (score >= 60) {
    return {
      label: 'Dobry',
      description: 'Brief jest zgodny ze strategią marki'
    }
  }
  if (score >= 40) {
    return {
      label: 'Średni',
      description: 'Brief częściowo zgodny ze strategią'
    }
  }
  if (score >= 20) {
    return {
      label: 'Niski',
      description: 'Brief może odbiegać od priorytetów strategicznych'
    }
  }
  return {
    label: 'Bardzo niski',
    description: 'Brief nie jest zgodny ze strategią marki'
  }
}

function getAlignmentColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-green-500'
  if (score >= 40) return 'bg-yellow-500'
  if (score >= 20) return 'bg-orange-500'
  return 'bg-red-500'
}

function getAlignmentBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-50 border-emerald-200'
  if (score >= 60) return 'bg-green-50 border-green-200'
  if (score >= 40) return 'bg-yellow-50 border-yellow-200'
  if (score >= 20) return 'bg-orange-50 border-orange-200'
  return 'bg-red-50 border-red-200'
}

function getAlignmentTextColor(score: number): string {
  if (score >= 80) return 'text-emerald-700'
  if (score >= 60) return 'text-green-700'
  if (score >= 40) return 'text-yellow-700'
  if (score >= 20) return 'text-orange-700'
  return 'text-red-700'
}

export function AlignmentBar({ briefContext, briefTitle, strategyContent, brandName }: AlignmentBarProps) {
  const alignmentData = useMemo(() => {
    // Only calculate for Zdrofit brand (we have strategy for it)
    if (brandName.toLowerCase() !== 'zdrofit' || !strategyContent) {
      return null
    }

    const score = calculateAlignmentScore(briefContext, briefTitle)
    const { label, description } = getAlignmentLabel(score)

    return {
      score,
      label,
      description,
      color: getAlignmentColor(score),
      bgColor: getAlignmentBgColor(score),
      textColor: getAlignmentTextColor(score),
    }
  }, [briefContext, briefTitle, strategyContent, brandName])

  if (!alignmentData) {
    return null
  }

  return (
    <div className={`rounded-lg border p-4 ${alignmentData.bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className={`font-semibold text-sm ${alignmentData.textColor}`}>
            Alignment do strategii
          </span>
        </div>
        <div className={`font-bold text-lg ${alignmentData.textColor}`}>
          {alignmentData.score}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${alignmentData.color}`}
          style={{ width: `${alignmentData.score}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${alignmentData.textColor}`}>
          {alignmentData.label}
        </span>
        <span className="text-xs text-gray-500">
          {alignmentData.description}
        </span>
      </div>

      {/* Strategy reminder for low scores */}
      {alignmentData.score < 40 && (
        <div className="mt-3 pt-3 border-t border-current/10">
          <p className="text-xs text-gray-600">
            <strong>Przypomnienie:</strong> Strategia {brandName} koncentruje się na retencji,
            Yoga/Pilates i doświadczeniu klubowicza.
          </p>
        </div>
      )}
    </div>
  )
}
