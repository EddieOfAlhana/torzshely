import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import api from '../../services/api'
import type { Event } from '../../types'

const CATEGORY_ICONS: Record<string, string> = {
  quiz: '🎯',
  karaoke: '🎤',
  tasting: '🥃',
  disco: '🎧',
  default: '✨',
}

export default function EventsSection() {
  const { t, i18n } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const titleRef = useScrollAnimation()
  const isHu = i18n.language === 'hu'

  useEffect(() => {
    api.get<Event[]>('/events').then(r => setEvents(r.data)).catch(() => {})
  }, [])

  return (
    <section id="events" className="relative py-24 md:py-32 overflow-hidden">
      {/* Parallax background */}
      <div className="parallax-bg absolute inset-0"
           style={{ backgroundImage: 'url(/generated/whisky-bg.jpg)' }}>
        <div className="absolute inset-0 bg-pub-black/88" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="section-title">{t('events.title')}</h2>
          <p className="section-subtitle">{t('events.subtitle')}</p>
          <div className="gold-divider" />
        </div>

        {events.length === 0 ? (
          <p className="text-center text-pub-cream/50">{t('events.no_events')}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, i) => (
              <EventFlipCard key={event.id} event={event} isHu={isHu} delay={i * 0.1} t={t} />
            ))}
          </div>
        )}

        {/* Facebook link */}
        <div className="text-center mt-12">
          <a href="https://facebook.com/torzshely16" target="_blank" rel="noopener noreferrer"
             className="btn-outline">
            {isHu ? 'Összes program Facebookon' : 'All events on Facebook'}
          </a>
        </div>
      </div>
    </section>
  )
}

function EventFlipCard({ event, isHu, delay, t }: {
  event: Event; isHu: boolean; delay: number; t: (key: string) => string
}) {
  const ref = useScrollAnimation()
  const icon = CATEGORY_ICONS[event.category || 'default'] || CATEGORY_ICONS.default
  const dateStr = format(new Date(event.eventDate), isHu ? 'MMM d. EEEE' : 'MMM d, EEEE',
    { locale: isHu ? hu : undefined })
  const timeStr = format(new Date(event.eventDate), 'HH:mm')
  const title = isHu ? event.titleHu : (event.titleEn || event.titleHu)
  const desc = isHu ? event.descriptionHu : (event.descriptionEn || event.descriptionHu)

  return (
    <div ref={ref} className="flip-card h-72" style={{ transitionDelay: `${delay}s` }}>
      <div className="flip-card-inner w-full h-full">
        {/* Front */}
        <div className="flip-card-front w-full h-full bg-pub-dark border border-pub-gold/20 p-6 flex flex-col justify-between
                        hover:border-pub-gold/50 transition-colors">
          {/* Category badge */}
          <div className="flex items-center justify-between">
            <span className="text-3xl">{icon}</span>
            {event.featured && (
              <span className="text-[10px] font-display tracking-wider text-pub-gold border border-pub-gold/40 px-2 py-1">
                KIEMELT
              </span>
            )}
          </div>

          {/* Date */}
          <div>
            <div className="text-pub-gold/60 text-xs font-display tracking-widest uppercase mb-1">{dateStr}</div>
            <div className="font-display text-pub-gold text-sm tracking-widest">{timeStr}</div>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-serif text-pub-cream text-lg leading-snug mb-2">{title}</h3>
            {event.priceHuf ? (
              <div className="text-pub-gold text-sm">
                {event.priceHuf.toLocaleString('hu-HU')} Ft{t('events.per_person')}
              </div>
            ) : (
              <div className="text-pub-cream/40 text-xs">{t('events.free')}</div>
            )}
          </div>

          <div className="text-pub-cream/30 text-xs text-right">{t('events.flip_hint')} →</div>
        </div>

        {/* Back */}
        <div className="flip-card-back w-full h-full bg-pub-gold p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-pub-black text-base tracking-widest uppercase mb-4">{title}</h3>
            <p className="text-pub-dark text-sm leading-relaxed line-clamp-6">{desc}</p>
          </div>
          <div className="space-y-2">
            {event.registrationInfo && (
              <p className="text-pub-dark text-xs italic">{event.registrationInfo}</p>
            )}
            {event.priceHuf && (
              <div className="font-display text-pub-black text-lg">
                {event.priceHuf.toLocaleString('hu-HU')} Ft
              </div>
            )}
            <a href="https://facebook.com/torzshely16" target="_blank" rel="noopener noreferrer"
               className="inline-block bg-pub-black text-pub-gold text-xs py-2 px-4 font-display tracking-widest
                          hover:bg-pub-dark transition-colors mt-2">
              {t('events.register')} →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
