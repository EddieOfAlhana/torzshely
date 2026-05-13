import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CountUp from 'react-countup'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import api from '../../services/api'
import type { Review } from '../../types'

const STATIC_REVIEWS: Review[] = [
  { id: 1, authorName: 'Kovács Péter', textHu: 'Kedves kiszolgálás, hangulatos hely. Sokat fogunk még itt járni! A sörkínálat egyszerűen páratlan a kerületben.', textEn: 'Friendly service, cozy atmosphere. We will definitely be back! The beer selection is simply unmatched in the district.', rating: 5, source: 'google', featured: true, active: true },
  { id: 2, authorName: 'Varga Eszter', textHu: 'Törzshely lett a mi törzshelyünk is! Remek kvízestek, jó sörök, barátságos személyzet. Mindenkinek ajánlom!', textEn: 'This place has become our regular spot! Great quiz nights, good beers, friendly staff. Highly recommended!', rating: 5, source: 'facebook', featured: true, active: true },
  { id: 3, authorName: 'Tóth László', textHu: 'Nagyon jó hely, barátságos személyzet, finom italok, kellemes légkör. A Whisky Kóstoló egyszerűen fantasztikus volt!', textEn: 'Great place, friendly staff, delicious drinks, pleasant atmosphere. The Whisky Tasting was simply fantastic!', rating: 5, source: 'google', featured: true, active: true },
  { id: 4, authorName: 'Szabó Kinga', textHu: 'A XVI. kerület legbarátságosabb sörözője! Heti rendszerességgel járunk kvízestre, mindig tele, mindig hangulatos.', rating: 5, source: 'facebook', featured: true, active: true },
  { id: 5, authorName: 'Molnár Gábor', textHu: 'Páratlan hangulat, igazi közösségi hely. A csapoltsör-kínálat kerületben egyedülálló. Örömmel ajánlom mindenkinek!', rating: 5, source: 'google', featured: true, active: true },
]

export default function ReviewsSection() {
  const { t, i18n } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>(STATIC_REVIEWS)
  const [active, setActive] = useState(0)
  const titleRef = useScrollAnimation()
  const statsRef = useScrollAnimation()
  const isHu = i18n.language === 'hu'

  useEffect(() => {
    api.get<Review[]>('/reviews').then(r => {
      if (r.data.length > 0) setReviews(r.data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % reviews.length), 5000)
    return () => clearInterval(timer)
  }, [reviews.length])

  const text = (r: Review) => isHu ? r.textHu : (r.textEn || r.textHu)

  return (
    <section id="reviews" className="py-24 md:py-32 bg-pub-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-3"
           style={{ backgroundImage: 'radial-gradient(circle, #5e909c 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="section-title">{t('reviews.title')}</h2>
          <p className="section-subtitle">{t('reviews.subtitle')}</p>
          <div className="gold-divider" />
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="flex flex-wrap justify-center gap-12 mb-16 py-10 border-y border-pub-teal/20">
          <StatItem value={4.9} decimals={1} suffix=" ★" label={t('reviews.google_rating')} />
          <StatItem value={25} decimals={0} suffix="+" label={t('reviews.reviews_count')} />
          <StatItem value={100} decimals={0} suffix="%" label={isHu ? 'Elégedett vendég' : 'Satisfied guests'} />
        </div>

        {/* Review carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[200px]">
            {reviews.map((r, i) => (
              <div key={r.id}
                   className={`transition-all duration-700 ${i === active
                     ? 'opacity-100 translate-x-0'
                     : i < active ? 'opacity-0 -translate-x-8 absolute inset-0' : 'opacity-0 translate-x-8 absolute inset-0'
                   }`}>
                <div className="text-pub-teal text-4xl mb-4 font-serif leading-none">"</div>
                <p className="text-pub-cream text-lg md:text-xl font-serif italic leading-relaxed mb-8">
                  {text(r)}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pub-teal/20 border border-pub-teal/40 flex items-center justify-center
                                  font-display text-pub-teal text-sm">
                    {r.authorName[0]}
                  </div>
                  <div>
                    <div className="text-pub-cream font-medium">{r.authorName}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-pub-gold text-xs" aria-label={`${r.rating} csillag`}>{'★'.repeat(r.rating)}</span>
                      <span className="text-pub-cream/40 text-xs">
                        {r.source === 'google' ? t('reviews.source_google') : t('reviews.source_facebook')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === active ? 'bg-pub-teal scale-125' : 'bg-pub-cream/20 hover:bg-pub-cream/40'
                }`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, decimals, suffix, label }: {
  value: number; decimals: number; suffix: string; label: string
}) {
  return (
    <div className="text-center">
      <div className="font-display text-4xl md:text-5xl text-pub-teal">
        <CountUp end={value} decimals={decimals} duration={2.5} separator="," />
        {suffix}
      </div>
      <div className="text-pub-cream/50 text-sm tracking-widest uppercase mt-2">{label}</div>
    </div>
  )
}
