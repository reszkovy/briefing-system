'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle, TrendingDown, Lightbulb, Cog, Trophy } from 'lucide-react'

interface Slide {
  id: number
  title: string
  subtitle: string
  icon: React.ReactNode
  content: React.ReactNode
  bgColor: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Reality check',
    subtitle: 'Twoim problemem nie jest egzekucja. To kontrola decyzji w terenie.',
    icon: <AlertTriangle className="w-12 h-12" />,
    bgColor: 'from-red-500/20 to-orange-500/20',
    content: (
      <ul className="space-y-6 text-lg">
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">1</span>
          <span>Regiony podejmują <strong className="text-white">dziesiątki decyzji tygodniowo</strong> bez wspólnego standardu</span>
        </li>
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">2</span>
          <span><strong className="text-white">„Pilne" wygrywa ze „spójnym"</strong> → rozjazd komunikacji i priorytetów</span>
        </li>
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">3</span>
          <span>Ty odpowiadasz za wynik i spójność, ale <strong className="text-white">nie masz jednolitej warstwy decyzyjnej</strong></span>
        </li>
      </ul>
    ),
  },
  {
    id: 2,
    title: 'Koszt status quo',
    subtitle: 'Strategia umiera w operacji regionalnej.',
    icon: <TrendingDown className="w-12 h-12" />,
    bgColor: 'from-orange-500/20 to-yellow-500/20',
    content: (
      <ul className="space-y-5 text-lg">
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-3"></span>
          <span>Zgłoszenia są <strong className="text-white">nieporównywalne</strong> (różne formaty, brak danych, brak kontekstu)</span>
        </li>
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-3"></span>
          <span><strong className="text-white">Mnóstwo doprecyzowań</strong> + wracanie po poprawki</span>
        </li>
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-3"></span>
          <span><strong className="text-white">Kolizje</strong> w kalendarzu/obszarach, dublowanie działań, niespójne KV/komunikaty</span>
        </li>
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-3"></span>
          <span>Centralne wytyczne są <strong className="text-white">obchodzone „bo lokalnie trzeba"</strong></span>
        </li>
      </ul>
    ),
  },
  {
    id: 3,
    title: 'regional.fit',
    subtitle: 'System, który robi strategiczny alignment zanim coś pójdzie w świat.',
    icon: <Lightbulb className="w-12 h-12" />,
    bgColor: 'from-[#daff47]/20 to-green-500/20',
    content: (
      <ul className="space-y-5 text-lg">
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 bg-[#daff47]/20 rounded-lg flex items-center justify-center text-[#daff47]">✓</span>
          <span><strong className="text-white">Standaryzuje zgłoszenia</strong> regionalne (brief + cel + KPI + kontekst)</span>
        </li>
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 bg-[#daff47]/20 rounded-lg flex items-center justify-center text-[#daff47]">✓</span>
          <span><strong className="text-white">Waliduje alignment:</strong> strategia / brand / kalendarz / ryzyka / overlap</span>
        </li>
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 bg-[#daff47]/20 rounded-lg flex items-center justify-center text-[#daff47]">✓</span>
          <span>Daje <strong className="text-white">rekomendację:</strong> priorytet, zakres, „co robimy", „czego nie robimy"</span>
        </li>
        <li className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 bg-[#daff47]/20 rounded-lg flex items-center justify-center text-[#daff47]">✓</span>
          <span>Ułatwia Ci <strong className="text-white">zarządzanie RM-ami bez mikro-manage'owania</strong></span>
        </li>
      </ul>
    ),
  },
  {
    id: 4,
    title: 'Jak to działa',
    subtitle: 'Jedna kolejka decyzji, jedna logika, jedna odpowiedzialność.',
    icon: <Cog className="w-12 h-12" />,
    bgColor: 'from-blue-500/20 to-indigo-500/20',
    content: (
      <div className="space-y-4">
        {[
          { step: 1, text: 'RM składa zgłoszenie w standardzie' },
          { step: 2, text: 'System wymusza kontekst (cel, metryka, lokalne dane)' },
          { step: 3, text: 'Ty widzisz porównywalne potrzeby w skali regionów + konflikty' },
          { step: 4, text: 'Zatwierdzasz/odrzucasz/kalibrujesz w oparciu o strategię' },
          { step: 5, text: 'Egzekucja idzie „po szynach" (mniej ping-ponga, mniej błędów)' },
        ].map((item, index) => (
          <div key={item.step} className="flex items-center gap-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {item.step}
            </div>
            <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 group-hover:border-blue-400/50 transition-colors">
              <span className="text-white/90">{item.text}</span>
            </div>
            {index < 4 && (
              <div className="absolute left-6 mt-16 w-0.5 h-4 bg-blue-500/30" />
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 5,
    title: 'Wartość',
    subtitle: 'Zamieniasz chaos w przewidywalny system zarządzania regionami.',
    icon: <Trophy className="w-12 h-12" />,
    bgColor: 'from-[#daff47]/30 to-emerald-500/20',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: '🎯', title: 'Spójność marki', desc: 'W terenie bez blokowania tempa' },
          { icon: '⏱️', title: 'Mniej poprawek', desc: 'Oszczędność czasu Twojego i RM-ów' },
          { icon: '📅', title: 'Mniej kolizji', desc: 'Lepsza alokacja budżetu kampanii' },
          { icon: '📊', title: 'Raportowalność', desc: 'Wiesz co, dlaczego i z jakim efektem' },
        ].map((item) => (
          <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#daff47]/50 transition-all hover:bg-white/10">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
            <p className="text-white/60">{item.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
]

export default function PitchPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-[#1a2654] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2654]/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Powrót do logowania</span>
          </Link>
          <Image
            src="/logo.svg"
            alt="regional.fit"
            width={120}
            height={40}
            className="brightness-0 invert"
          />
          <div className="text-white/40 text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Slide content */}
          <div className={`bg-gradient-to-br ${slide.bgColor} rounded-3xl p-8 md:p-12 min-h-[500px] border border-white/10`}>
            {/* Icon and title */}
            <div className="flex items-center gap-4 mb-2">
              <div className="text-[#daff47]">{slide.icon}</div>
              <span className="text-[#daff47] font-mono text-sm">0{slide.id}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {slide.title}
            </h1>

            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-3xl">
              {slide.subtitle}
            </p>

            {/* Content */}
            <div className="text-white/80">
              {slide.content}
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-[#daff47] w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#1a2654]/90 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={prevSlide}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Poprzedni</span>
          </button>

          <Link
            href="/login"
            className="px-8 py-3 rounded-xl bg-[#daff47] text-[#1a2654] font-bold hover:bg-[#c8eb3a] transition-colors"
          >
            Wypróbuj demo
          </Link>

          <button
            onClick={nextSlide}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
          >
            <span className="hidden sm:inline">Następny</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Keyboard navigation hint */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-white/30 text-sm hidden md:block">
        Użyj strzałek ← → do nawigacji
      </div>
    </div>
  )
}
