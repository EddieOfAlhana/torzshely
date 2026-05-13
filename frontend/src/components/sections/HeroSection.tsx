import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import CountUp from 'react-countup'

export default function HeroSection() {
  const { t } = useTranslation()
  const bgRef = useRef<HTMLDivElement>(null)

  // Parallax scroll for hero background
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform"
           style={{ top: '-20%', height: '140%' }}>
        <img src="/generated/hero-bg.jpg" alt="Törzshely 16 bár belső"
             className="w-full h-full object-cover" />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-pub-black/60 via-pub-black/40 to-pub-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-pub-black/60 via-transparent to-pub-black/30" />
      </div>

      {/* Animated golden particles */}
      <GoldenParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <img src="/logo.png" alt="Törzshely logó" className="h-40 md:h-48 w-auto" />
        </div>

        <div className="overflow-hidden mb-4">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-pub-gold tracking-widest uppercase
                        animate-[fadeUp_1s_0.2s_ease_forwards] opacity-0">
            TÖRZSHELY 16
          </h1>
        </div>

        <div className="overflow-hidden mb-6">
          <p className="font-serif text-xl md:text-2xl lg:text-3xl text-pub-cream italic
                       animate-[fadeUp_1s_0.4s_ease_forwards] opacity-0">
            {t('hero.tagline')}
          </p>
        </div>

        <div className="overflow-hidden mb-12">
          <p className="text-pub-cream/60 text-base md:text-lg max-w-xl mx-auto
                       animate-[fadeUp_1s_0.6s_ease_forwards] opacity-0">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeUp_1s_0.8s_ease_forwards] opacity-0">
          <button onClick={() => scrollTo('#reservation')} className="btn-primary text-sm">
            {t('hero.cta_reservation')}
          </button>
          <button onClick={() => scrollTo('#events')} className="btn-teal text-sm">
            {t('hero.cta_events')}
          </button>
        </div>

        {/* Rating badge */}
        <div className="mt-12 flex justify-center animate-[fadeIn_1s_1.2s_ease_forwards] opacity-0">
          <div className="flex items-center gap-3 border border-pub-gold/30 px-6 py-3 bg-pub-black/40 backdrop-blur-sm">
            <span className="text-pub-gold text-xl">★★★★★</span>
            <div className="text-left">
              <div className="font-display text-pub-gold text-lg">
                <CountUp end={4.9} decimals={1} duration={2} delay={1.2} />
              </div>
              <div className="text-pub-cream/50 text-xs tracking-widest">{t('hero.rating')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-16 bg-gradient-to-b from-pub-gold to-transparent mx-auto" />
        <div className="w-1.5 h-1.5 rounded-full bg-pub-gold mx-auto mt-1" />
      </div>
    </section>
  )
}


function GoldenParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div key={p.id}
          className="absolute rounded-full bg-pub-gold/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }} />
      ))}
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px) scale(1); opacity: 0.3; }
          100% { transform: translateY(-30px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
