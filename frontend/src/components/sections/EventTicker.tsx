import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import api from '../../services/api'
import type { Event } from '../../types'

export default function EventTicker() {
  const { t, i18n } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const isHu = i18n.language === 'hu'

  useEffect(() => {
    api.get<Event[]>('/events').then(r => setEvents(r.data)).catch(() => {})
  }, [])

  if (events.length === 0) return null

  const items = [...events, ...events] // duplicate for seamless loop

  return (
    <div className="bg-pub-gold py-3 overflow-hidden relative">
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 bg-pub-dark flex items-center px-4 border-r border-pub-gold/50">
        <span className="font-display text-pub-gold text-xs tracking-widest uppercase whitespace-nowrap">
          {t('ticker.label')}
        </span>
      </div>

      <div className="pl-36">
        <div className="marquee-track">
          {items.map((event, idx) => (
            <span key={`${event.id}-${idx}`} className="inline-flex items-center gap-2 mx-8 text-pub-black font-medium text-sm">
              <span className="font-display tracking-wider">
                {format(new Date(event.eventDate), 'MMM d.', { locale: isHu ? hu : undefined }).toUpperCase()}
              </span>
              <span className="text-pub-dark/60">–</span>
              <span>{isHu ? event.titleHu : (event.titleEn || event.titleHu)}</span>
              <span className="text-pub-dark/30 mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
