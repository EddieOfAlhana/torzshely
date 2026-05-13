import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const FEATURES = [
  { icon: '🍺', key: 'beer' },
  { icon: '🎵', key: 'events' },
  { icon: '🌿', key: 'terrace' },
  { icon: '🤝', key: 'community' },
]

export default function AboutSection() {
  const { t } = useTranslation()
  const leftRef = useScrollAnimation()
  const rightRef = useScrollAnimation()

  return (
    <section id="about" className="relative py-24 md:py-32 bg-pub-dark overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
           style={{ backgroundImage: 'radial-gradient(circle, #c9a84c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Image side */}
        <div ref={leftRef} className="relative">
          <div className="relative overflow-hidden group">
            <img src="/generated/about-bg.jpg" alt="Törzshely 16 belső tér"
                 className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-pub-dark/60 to-transparent" />
          </div>
          {/* Gold frame accent */}
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-pub-gold/40" />
          <div className="absolute -top-4 -left-4 w-32 h-32 border border-pub-gold/20" />

          {/* Stats badge */}
          <div className="absolute bottom-8 left-8 bg-pub-black/90 border border-pub-gold/30 px-6 py-4 backdrop-blur-sm">
            <div className="font-display text-pub-gold text-3xl">4,9 ★</div>
            <div className="text-pub-cream/60 text-xs tracking-widest mt-1">GOOGLE ÉRTÉKELÉS</div>
          </div>
        </div>

        {/* Text side */}
        <div ref={rightRef}>
          <div className="mb-2 text-pub-gold/60 font-display text-sm tracking-[0.4em] uppercase">
            Törzshely 16
          </div>
          <h2 className="section-title mb-2">{t('about.title')}</h2>
          <p className="section-subtitle mb-6">{t('about.subtitle')}</p>
          <div className="gold-divider mx-0" />

          <div className="space-y-5 text-pub-cream/75 leading-relaxed">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p className="text-pub-gold font-serif italic text-lg">{t('about.p3')}</p>
          </div>

          {/* Feature list */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(f => (
              <div key={f.key} className="flex items-start gap-3 p-4 border border-pub-gold/10 hover:border-pub-gold/40 transition-colors duration-300">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-pub-cream/70 text-sm leading-snug">{t(`about.features.${f.key}`)}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-4">
            <a href="https://facebook.com/torzshely16" target="_blank" rel="noopener noreferrer"
               className="btn-outline text-xs py-2.5 px-5">
              Facebook
            </a>
            <a href="https://instagram.com/torzshely16" target="_blank" rel="noopener noreferrer"
               className="btn-outline text-xs py-2.5 px-5">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
