'use client'

import { useState } from 'react'

interface RegionData {
  id: string
  name: string
  code: string
  clubCount: number
  briefCount: number
  approvedCount: number
  activityLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low'
}

interface ClubData {
  id: string
  name: string
  city: string
  latitude: number | null
  longitude: number | null
  briefCount: number
  tier: string
}

interface RegionHeatmapProps {
  regions: RegionData[]
  clubs: ClubData[]
}

// Activity level colors
const activityColors = {
  very_high: { bg: '#22c55e', text: 'Bardzo wysoka', description: '30+ briefów' },
  high: { bg: '#86efac', text: 'Wysoka', description: '15-30 briefów' },
  medium: { bg: '#3b82f6', text: 'Średnia', description: '8-15 briefów' },
  low: { bg: '#f97316', text: 'Niska', description: '3-8 briefów' },
  very_low: { bg: '#ef4444', text: 'Bardzo niska', description: '<3 briefy' },
}

// Real Poland voivodeship SVG paths (simplified but accurate shapes)
const voivodeshipPaths: Record<string, { path: string; labelPos: { x: number; y: number }; name: string }> = {
  // Mazowieckie (Warsaw region) - WAW + MAZ combined
  WAW: {
    path: 'M225,150 L270,140 L305,150 L320,175 L315,205 L290,225 L255,230 L230,220 L215,195 L215,170 Z',
    labelPos: { x: 265, y: 185 },
    name: 'Mazowieckie'
  },
  // Pomorskie (Trójmiasto) - TRI
  TRI: {
    path: 'M150,45 L195,35 L220,45 L230,70 L220,95 L190,105 L160,100 L140,85 L145,60 Z',
    labelPos: { x: 185, y: 70 },
    name: 'Pomorskie'
  },
  // Zachodniopomorskie - POM
  POM: {
    path: 'M50,50 L95,40 L130,50 L145,75 L135,100 L105,110 L70,105 L45,90 L40,65 Z',
    labelPos: { x: 90, y: 75 },
    name: 'Zachodniopomorskie'
  },
  // Kujawsko-Pomorskie - KUJ
  KUJ: {
    path: 'M160,100 L200,95 L225,105 L230,130 L215,150 L185,155 L155,145 L150,120 Z',
    labelPos: { x: 190, y: 125 },
    name: 'Kujawsko-Pomorskie'
  },
  // Lubelskie - LUB
  LUB: {
    path: 'M310,185 L350,175 L375,195 L380,235 L365,270 L330,280 L300,265 L295,230 L300,200 Z',
    labelPos: { x: 340, y: 225 },
    name: 'Lubelskie'
  },
  // Świętokrzyskie - SWI
  SWI: {
    path: 'M255,230 L290,225 L305,245 L295,270 L265,280 L245,265 L245,245 Z',
    labelPos: { x: 270, y: 250 },
    name: 'Świętokrzyskie'
  },
  // Warmińsko-Mazurskie - WAR
  WAR: {
    path: 'M230,45 L280,35 L320,45 L335,75 L320,105 L285,115 L250,105 L235,80 L225,60 Z',
    labelPos: { x: 280, y: 75 },
    name: 'Warmińsko-Mazurskie'
  },
  // Podlaskie - POD
  POD: {
    path: 'M320,105 L355,95 L380,115 L385,155 L370,180 L335,185 L310,170 L305,140 L310,115 Z',
    labelPos: { x: 350, y: 140 },
    name: 'Podlaskie'
  },
  // Śląskie - SLA
  SLA: {
    path: 'M175,265 L210,260 L225,280 L215,305 L185,315 L165,300 L165,280 Z',
    labelPos: { x: 195, y: 285 },
    name: 'Śląskie'
  },
  // Wielkopolskie - for display
  WLK: {
    path: 'M105,110 L150,105 L175,120 L185,155 L175,185 L140,195 L105,185 L90,155 L95,130 Z',
    labelPos: { x: 140, y: 150 },
    name: 'Wielkopolskie'
  },
  // Łódzkie
  LDZ: {
    path: 'M185,155 L225,150 L245,170 L245,200 L225,220 L190,220 L175,200 L175,175 Z',
    labelPos: { x: 210, y: 185 },
    name: 'Łódzkie'
  },
  // Dolnośląskie
  DLS: {
    path: 'M70,190 L110,180 L140,195 L145,230 L130,260 L95,270 L65,255 L55,225 L60,200 Z',
    labelPos: { x: 100, y: 225 },
    name: 'Dolnośląskie'
  },
  // Opolskie
  OPO: {
    path: 'M140,230 L175,225 L185,250 L175,275 L145,280 L130,265 L130,245 Z',
    labelPos: { x: 155, y: 255 },
    name: 'Opolskie'
  },
  // Lubuskie
  LBU: {
    path: 'M45,130 L80,120 L105,135 L110,170 L95,195 L60,200 L40,180 L35,155 Z',
    labelPos: { x: 70, y: 160 },
    name: 'Lubuskie'
  },
  // Małopolskie
  MLP: {
    path: 'M215,280 L260,275 L290,290 L295,320 L265,340 L225,335 L205,315 L205,295 Z',
    labelPos: { x: 250, y: 305 },
    name: 'Małopolskie'
  },
  // Podkarpackie
  PKR: {
    path: 'M295,275 L340,265 L370,285 L380,320 L355,350 L310,350 L285,330 L285,300 Z',
    labelPos: { x: 330, y: 310 },
    name: 'Podkarpackie'
  },
}

// Map region codes to voivodeships
const regionToVoivodeship: Record<string, string> = {
  'WAW': 'WAW', // Warszawa -> Mazowieckie
  'MAZ': 'WAW', // Mazowieckie (poza Warszawą) -> Mazowieckie
  'TRI': 'TRI', // Trójmiasto -> Pomorskie
  'POM': 'POM', // Pomorze Zachodnie -> Zachodniopomorskie
  'KUJ': 'KUJ', // Kujawsko-Pomorskie
  'LUB': 'LUB', // Lubelskie
  'SWI': 'SWI', // Świętokrzyskie
  'WAR': 'WAR', // Warmińsko-Mazurskie
  'POD': 'POD', // Podlaskie
  'SLA': 'SLA', // Śląskie
}

export function RegionHeatmap({ regions, clubs }: RegionHeatmapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  // Combine WAW and MAZ data
  const getCombinedRegionData = (voivodeshipCode: string) => {
    if (voivodeshipCode === 'WAW') {
      const waw = regions.find(r => r.code === 'WAW')
      const maz = regions.find(r => r.code === 'MAZ')
      if (waw && maz) {
        return {
          ...waw,
          name: 'Mazowieckie',
          clubCount: waw.clubCount + maz.clubCount,
          briefCount: waw.briefCount + maz.briefCount,
          approvedCount: waw.approvedCount + maz.approvedCount,
          activityLevel: waw.activityLevel, // WAW dominates
        }
      }
      return waw
    }
    return regions.find(r => r.code === voivodeshipCode)
  }

  const getRegionColor = (voivodeshipCode: string) => {
    // Check if any of our regions maps to this voivodeship
    const matchingRegionCode = Object.entries(regionToVoivodeship).find(
      ([, voiv]) => voiv === voivodeshipCode
    )?.[0]

    if (matchingRegionCode) {
      const regionData = getCombinedRegionData(voivodeshipCode)
      if (regionData) {
        return activityColors[regionData.activityLevel].bg
      }
    }
    return '#e2e8f0' // Gray for regions without data
  }

  const getRegionData = (voivodeshipCode: string) => {
    return getCombinedRegionData(voivodeshipCode)
  }

  const selectedRegionData = selectedRegion ? getRegionData(selectedRegion) : null

  // Calculate total stats
  const totalBriefs = regions.reduce((sum, r) => sum + r.briefCount, 0)
  const totalApproved = regions.reduce((sum, r) => sum + r.approvedCount, 0)
  const approvalRate = totalBriefs > 0 ? Math.round((totalApproved / totalBriefs) * 100) : 0

  // Get clubs for selected region
  const getClubsForRegion = (voivodeshipCode: string) => {
    if (voivodeshipCode === 'WAW') {
      // Include both WAW and MAZ clubs
      const wawRegion = regions.find(r => r.code === 'WAW')
      const mazRegion = regions.find(r => r.code === 'MAZ')
      return clubs.filter(c => {
        // Simple check based on coordinates for Warsaw area
        if (c.latitude && c.longitude) {
          return c.latitude > 51.5 && c.latitude < 52.5 && c.longitude > 20.5 && c.longitude < 21.5
        }
        return false
      })
    }
    return []
  }

  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b dark:border-border bg-gradient-to-r from-[#2b3b82] to-[#1e2a5e]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🗺️ Mapa aktywności sieci Zdrofit
            </h2>
            <p className="text-sm text-white/70 mt-1">Aktywność klubów w ostatnim kwartale (Q4 2025 - Q1 2026)</p>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#daff47]">{totalBriefs}</p>
              <p className="text-white/70 text-xs">briefów</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#daff47]">{approvalRate}%</p>
              <p className="text-white/70 text-xs">zatwierdzonych</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#daff47]">{clubs.length}</p>
              <p className="text-white/70 text-xs">klubów</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Map */}
          <div className="xl:col-span-2">
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-blue-200 dark:border-slate-700">
              <svg
                viewBox="0 0 420 380"
                className="w-full h-auto"
                style={{ maxHeight: '500px' }}
              >
                {/* Background - Baltic Sea hint */}
                <defs>
                  <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bfdbfe" />
                    <stop offset="100%" stopColor="#93c5fd" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {/* Sea area (top) */}
                <rect x="0" y="0" width="420" height="60" fill="url(#seaGradient)" opacity="0.5" />
                <text x="100" y="25" className="text-[10px] fill-blue-400 italic">Morze Bałtyckie</text>

                {/* Poland outline shadow */}
                <path
                  d="M40,50 L140,35 L230,40 L320,35 L380,50 L395,120 L385,200 L390,280 L370,350 L280,360 L200,350 L120,340 L60,300 L35,220 L30,140 Z"
                  fill="#cbd5e1"
                  transform="translate(3, 3)"
                  opacity="0.5"
                />

                {/* Poland outline */}
                <path
                  d="M40,50 L140,35 L230,40 L320,35 L380,50 L395,120 L385,200 L390,280 L370,350 L280,360 L200,350 L120,340 L60,300 L35,220 L30,140 Z"
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  filter="url(#shadow)"
                />

                {/* Voivodeships */}
                {Object.entries(voivodeshipPaths).map(([code, { path, labelPos, name }]) => {
                  const regionData = getRegionData(code)
                  const hasData = !!regionData
                  const isHovered = hoveredRegion === code
                  const isSelected = selectedRegion === code

                  return (
                    <g key={code}>
                      <path
                        d={path}
                        fill={getRegionColor(code)}
                        stroke={isSelected ? '#1e3a8a' : isHovered ? '#3b82f6' : '#64748b'}
                        strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                        className={`transition-all duration-200 ${hasData ? 'cursor-pointer' : 'cursor-default'}`}
                        style={{
                          filter: isHovered || isSelected ? 'brightness(1.1)' : 'none',
                        }}
                        onMouseEnter={() => hasData && setHoveredRegion(code)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => hasData && setSelectedRegion(selectedRegion === code ? null : code)}
                      />
                      {/* Voivodeship name */}
                      <text
                        x={labelPos.x}
                        y={labelPos.y - 8}
                        textAnchor="middle"
                        className="pointer-events-none text-[8px] font-medium fill-slate-600 dark:fill-slate-300"
                      >
                        {name}
                      </text>
                      {/* Brief count */}
                      {regionData && (
                        <text
                          x={labelPos.x}
                          y={labelPos.y + 6}
                          textAnchor="middle"
                          className="pointer-events-none text-[11px] font-bold"
                          fill={regionData.activityLevel === 'very_low' || regionData.activityLevel === 'low' ? '#fff' : '#1e293b'}
                        >
                          {regionData.briefCount}
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* Club markers */}
                {clubs.map(club => {
                  if (!club.latitude || !club.longitude) return null
                  // Convert GPS to SVG coordinates
                  // Poland roughly: lat 49-55, lng 14-24
                  const x = ((club.longitude - 14) / (24 - 14)) * 360 + 30
                  const y = ((55 - club.latitude) / (55 - 49)) * 320 + 30

                  const size = club.tier === 'FLAGSHIP' ? 6 : club.tier === 'VIP' ? 5 : 4
                  const color = club.tier === 'FLAGSHIP' ? '#daff47' : club.tier === 'VIP' ? '#fbbf24' : '#94a3b8'

                  return (
                    <circle
                      key={club.id}
                      cx={x}
                      cy={y}
                      r={size}
                      fill={color}
                      stroke="#1e293b"
                      strokeWidth={1}
                      className="cursor-pointer transition-all"
                      opacity={0.9}
                    />
                  )
                })}

                {/* Major cities labels */}
                <text x="270" y="195" className="text-[9px] font-bold fill-slate-700">Warszawa</text>
                <text x="185" y="78" className="text-[9px] font-bold fill-slate-700">Gdańsk</text>
                <text x="90" y="82" className="text-[9px] font-bold fill-slate-700">Szczecin</text>
              </svg>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Legenda aktywności:</p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(activityColors).map(([level, { bg, text, description }]) => (
                    <div key={level} className="flex items-center gap-1.5">
                      <div
                        className="w-4 h-4 rounded shadow-sm"
                        style={{ backgroundColor: bg }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {text}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 ml-4">
                    <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-600 shadow-sm" />
                    <span className="text-xs text-gray-500">Brak danych</span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-3 mb-2">Kluby:</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#daff47] border border-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Flagship</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] border border-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">VIP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#94a3b8] border border-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Standard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Region details panel */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
              {selectedRegionData ? selectedRegionData.name : 'Wybierz województwo'}
            </h3>

            {selectedRegionData ? (
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border border-blue-200 dark:border-slate-600">
                    <p className="text-3xl font-bold text-[#2b3b82] dark:text-rf-lime">{selectedRegionData.clubCount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">klubów w regionie</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border border-blue-200 dark:border-slate-600">
                    <p className="text-3xl font-bold text-[#2b3b82] dark:text-rf-lime">{selectedRegionData.briefCount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">briefów (kwartał)</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{selectedRegionData.approvedCount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">zatwierdzonych</p>
                  </div>
                  <div
                    className="rounded-lg p-4 border"
                    style={{
                      backgroundColor: activityColors[selectedRegionData.activityLevel].bg + '20',
                      borderColor: activityColors[selectedRegionData.activityLevel].bg
                    }}
                  >
                    <p
                      className="text-lg font-bold"
                      style={{ color: activityColors[selectedRegionData.activityLevel].bg }}
                    >
                      {activityColors[selectedRegionData.activityLevel].text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">poziom aktywności</p>
                  </div>
                </div>

                {/* Activity bar */}
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Wykorzystanie potencjału</span>
                    <span className="font-semibold">{Math.min(Math.round((selectedRegionData.briefCount / 45) * 100), 100)}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((selectedRegionData.briefCount / 45) * 100, 100)}%`,
                        backgroundColor: activityColors[selectedRegionData.activityLevel].bg
                      }}
                    />
                  </div>
                </div>

                {/* Recommendation */}
                {(selectedRegionData.activityLevel === 'very_low' || selectedRegionData.activityLevel === 'low') && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                      ⚠️ Wymaga uwagi
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-2">
                      Region wymaga aktywizacji. Rozważ szkolenie dla managerów lub kampanię motywacyjną.
                    </p>
                  </div>
                )}
                {selectedRegionData.activityLevel === 'very_high' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                      ✅ Wzorcowy region
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-2">
                      Region osiąga najlepsze wyniki. Może służyć jako przykład best practices dla innych.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Region list when nothing selected */
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Kliknij na województwo aby zobaczyć szczegóły lub wybierz z listy:
                </p>
                {regions
                  .sort((a, b) => b.briefCount - a.briefCount)
                  .map(region => (
                    <button
                      key={region.id}
                      onClick={() => setSelectedRegion(regionToVoivodeship[region.code] || region.code)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-[#2b3b82] dark:hover:border-rf-lime hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded shadow-sm"
                          style={{ backgroundColor: activityColors[region.activityLevel].bg }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{region.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#2b3b82] dark:text-rf-lime">{region.briefCount}</p>
                        <p className="text-xs text-gray-500">{region.clubCount} klubów</p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
