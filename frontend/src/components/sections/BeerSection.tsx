import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import api from '../../services/api'
import type { MenuCategory, MenuItem } from '../../types'

export const BEER_COLORS: Record<string, { gradient: string; foam: string; label: string }> = {
  gold:   { gradient: 'linear-gradient(to bottom, #f59e0b, #fbbf24, #fde68a)', foam: 'rgba(255,255,255,0.85)', label: 'Arany' },
  copper: { gradient: 'linear-gradient(to bottom, #b45309, #d97706, #f59e0b)', foam: 'rgba(255,255,255,0.80)', label: 'Rézes' },
  brown:  { gradient: 'linear-gradient(to bottom, #78350f, #92400e, #b45309)', foam: 'rgba(255,248,220,0.75)', label: 'Barna' },
  dark:   { gradient: 'linear-gradient(to bottom, #1c1917, #292524, #44403c)',  foam: 'rgba(245,245,220,0.65)', label: 'Fekete' },
  cherry: { gradient: 'linear-gradient(to bottom, #7f1d1d, #991b1b, #dc2626)', foam: 'rgba(255,200,200,0.75)', label: 'Meggy' },
  rose:   { gradient: 'linear-gradient(to bottom, #9d174d, #be185d, #ec4899)', foam: 'rgba(255,220,240,0.75)', label: 'Rózsa' },
  wheat:  { gradient: 'linear-gradient(to bottom, #fde68a, #fef3c7, #fffbeb)', foam: 'rgba(255,255,255,0.90)', label: 'Búza' },
  green:  { gradient: 'linear-gradient(to bottom, #14532d, #15803d, #22c55e)', foam: 'rgba(220,255,220,0.75)', label: 'Zöld' },
}

function getColor(colorKey: string | undefined) {
  if (!colorKey) return BEER_COLORS.gold
  if (BEER_COLORS[colorKey]) return BEER_COLORS[colorKey]
  if (colorKey.startsWith('#')) {
    return {
      gradient: `linear-gradient(to bottom, ${colorKey}cc, ${colorKey}, ${colorKey}88)`,
      foam: 'rgba(255,255,255,0.80)',
      label: 'Egyedi',
    }
  }
  return BEER_COLORS.gold
}

export default function BeerSection() {
  const { t } = useTranslation()
  const titleRef = useScrollAnimation()
  const [beers, setBeers] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<MenuCategory[]>('/menu/categories')
      .then(r => {
        const draftCat = r.data.find(c => c.nameHu === 'Csapolt sörök')
        if (draftCat) {
          return api.get<MenuItem[]>(`/menu/items/category/${draftCat.id}`)
        }
      })
      .then(r => { if (r) setBeers(r.data.filter(b => b.active !== false)) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      <div className="parallax-bg absolute inset-0"
           style={{ backgroundImage: 'url(/generated/beer-bg.jpg)' }}>
        <div className="absolute inset-0 bg-pub-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="text-center mb-16">
          <div className="font-display text-pub-teal/50 text-sm tracking-[0.5em] uppercase mb-3">
            Sör kisokos
          </div>
          <h2 className="section-title">{t('beers.title')}</h2>
          <p className="section-subtitle">{t('beers.subtitle')}</p>
          <div className="gold-divider" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-pub-teal/40 border-t-pub-teal rounded-full animate-spin" />
          </div>
        ) : (
          <div className={`grid gap-8 ${beers.length <= 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : beers.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {beers.map((beer, i) => (
              <BeerCard key={beer.id} beer={beer} delay={i * 0.12} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BeerCard({ beer, delay }: { beer: MenuItem; delay: number }) {
  const ref = useScrollAnimation()
  const color = getColor(beer.color)
  const abv = beer.abv ?? null

  return (
    <div ref={ref} className="group relative overflow-hidden border border-pub-teal/20
                              hover:border-pub-teal/60 transition-all duration-500
                              hover:shadow-2xl hover:shadow-pub-teal/20"
         style={{ transitionDelay: `${delay}s` }}>
      {/* Beer visual */}
      <div className="h-48 flex items-end justify-center pb-4 relative overflow-hidden"
           style={{ background: color.gradient }}>
        <div className="absolute top-0 left-0 right-0 h-10 rounded-b-full"
             style={{ backgroundColor: color.foam }} />
        {[...Array(7)].map((_, i) => (
          <div key={i} className="absolute bottom-0 rounded-full"
               style={{
                 width: '4px', height: '4px',
                 left: `${15 + i * 11}%`,
                 backgroundColor: 'rgba(255,255,255,0.45)',
                 animation: `beerRise ${1.2 + i * 0.25}s ${i * 0.18}s ease-in infinite`,
               }} />
        ))}
        <div className="text-center relative z-10">
          {abv && (
            <div className="font-display text-3xl font-bold drop-shadow-md"
                 style={{ color: 'rgba(0,0,0,0.65)' }}>
              {abv}
            </div>
          )}
          {beer.nameEn && (
            <div className="text-xs uppercase tracking-widest drop-shadow"
                 style={{ color: 'rgba(0,0,0,0.55)' }}>
              {beer.nameEn}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-pub-dark">
        <h3 className="font-serif text-pub-teal text-xl mb-3">{beer.nameHu}</h3>
        {beer.descriptionHu && (
          <p className="text-pub-cream/60 text-sm leading-relaxed mb-4">{beer.descriptionHu}</p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-pub-teal/20">
          <span className="font-display text-pub-teal text-sm tracking-wider">
            {beer.priceHuf ? `${beer.priceHuf.toLocaleString('hu-HU')} Ft` : '–'}
            {beer.priceNote && <span className="text-pub-cream/50 text-xs ml-1">/ {beer.priceNote}</span>}
          </span>
          <span className="text-pub-teal text-[10px] font-display tracking-widest border border-pub-teal/40 px-2 py-0.5 uppercase">csapolt</span>
        </div>
      </div>

      <style>{`
        @keyframes beerRise {
          0%   { transform: translateY(0) scaleX(1); opacity: 0.6; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-180px) scaleX(0.7); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
