import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import api from '../../services/api'
import type { OpeningHours } from '../../types'

const GOOGLE_MAPS_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2693.3!2d19.1735!3d47.5080!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dd3d8d9c5a1f%3A0xb0a3c89aef4a6d7a!2sT%C3%B6rzshely+16!5e0!3m2!1shu!2shu!4v1715000000000!5m2!1shu!2shu`

const STATIC_HOURS: OpeningHours[] = [
  { id: 1, dayOfWeek: 1, closed: true, noteHu: 'Hétfőn zárva', noteEn: 'Closed on Mondays' },
  { id: 2, dayOfWeek: 2, openTime: '16:00', closeTime: '23:00', closed: false },
  { id: 3, dayOfWeek: 3, openTime: '16:00', closeTime: '23:00', closed: false },
  { id: 4, dayOfWeek: 4, openTime: '16:00', closeTime: '23:00', closed: false },
  { id: 5, dayOfWeek: 5, openTime: '16:00', closeTime: '01:00', closed: false },
  { id: 6, dayOfWeek: 6, openTime: '16:00', closeTime: '01:00', closed: false },
  { id: 7, dayOfWeek: 7, openTime: '14:00', closeTime: '22:00', closed: false },
]

interface ContactForm { name: string; email: string; phone?: string; message: string }

export default function ContactSection() {
  const { t, i18n } = useTranslation()
  const [hours, setHours] = useState<OpeningHours[]>(STATIC_HOURS)
  const titleRef = useScrollAnimation()
  const isHu = i18n.language === 'hu'

  // Today's day: JS Sunday=0, our system Mon=1..Sun=7
  const todayDow = new Date().getDay() === 0 ? 7 : new Date().getDay()

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactForm>()

  useEffect(() => {
    api.get<OpeningHours[]>('/opening-hours').then(r => {
      if (r.data.length > 0) setHours(r.data)
    }).catch(() => {})
  }, [])

  const onSubmit = async (data: ContactForm) => {
    try {
      await api.post('/contact', data)
      toast.success(t('contact.form_success'))
      reset()
    } catch {
      toast.error(t('contact.form_error'))
    }
  }

  const dayName = (dow: number) => {
    const key = `contact.days.${dow}` as const
    return t(key)
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-pub-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="section-subtitle">{t('contact.subtitle')}</p>
          <div className="gold-divider" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Info + Hours */}
          <div className="space-y-10">
            {/* Contact info */}
            <div className="space-y-4">
              <InfoRow icon="📍" text={t('contact.address')} href={`https://maps.google.com/?q=Thököly+út+7b,+Budapest`} />
              <InfoRow icon="📞" text={t('contact.phone')} href="tel:+36303839818" />
              <InfoRow icon="✉️" text={t('contact.email')} href="mailto:torzshely16@gmail.com" />
            </div>

            {/* Opening hours */}
            <div>
              <h3 className="font-display text-pub-gold text-sm tracking-[0.3em] uppercase mb-6">
                {t('contact.hours_title')}
              </h3>
              <div className="space-y-2">
                {hours.map(h => {
                  const isToday = h.dayOfWeek === todayDow
                  return (
                    <div key={h.dayOfWeek}
                         className={`flex justify-between items-center py-2 border-b transition-colors
                           ${isToday
                             ? 'border-pub-gold/40 bg-pub-gold/5 px-3'
                             : 'border-pub-cream/5'}`}>
                      <span className={`text-sm ${isToday ? 'text-pub-gold font-medium' : 'text-pub-cream/60'}`}>
                        {dayName(h.dayOfWeek)}
                        {isToday && <span className="ml-2 text-[10px] bg-pub-gold text-pub-black px-1.5 py-0.5 tracking-wider">
                          {t('contact.today')}
                        </span>}
                      </span>
                      <span className={`text-sm font-display tracking-wider ${isToday ? 'text-pub-gold' : 'text-pub-cream/50'}`}>
                        {h.closed ? t('contact.closed') : `${h.openTime} – ${h.closeTime}`}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="text-pub-cream/30 text-xs mt-3 italic">
                {isHu ? '* Rendezvényeken a nyitvatartás eltérhet.' : '* Hours may vary during special events.'}
              </p>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-display text-pub-gold text-sm tracking-[0.3em] uppercase mb-4">
                {t('contact.follow')}
              </h3>
              <div className="flex gap-4">
                <a href="https://facebook.com/torzshely16" target="_blank" rel="noopener noreferrer"
                   className="btn-outline text-xs py-2 px-5">Facebook</a>
                <a href="https://instagram.com/torzshely16" target="_blank" rel="noopener noreferrer"
                   className="btn-outline text-xs py-2 px-5">Instagram</a>
              </div>
            </div>
          </div>

          {/* Right: Map + Form */}
          <div className="space-y-8">
            {/* Google Maps */}
            <div className="aspect-video border border-pub-gold/20 overflow-hidden">
              <iframe
                src={GOOGLE_MAPS_EMBED}
                width="100%" height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Törzshely 16 térkép"
              />
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 border border-pub-gold/20 p-8">
              <h3 className="font-display text-pub-gold text-sm tracking-[0.3em] uppercase mb-6">
                {isHu ? 'Írj nekünk' : 'Send us a message'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField>
                  <input {...register('name', { required: true })} placeholder={t('contact.form_name')}
                         className="form-input" />
                </FormField>
                <FormField>
                  <input {...register('email', { required: true })} type="email"
                         placeholder={t('contact.form_email')} className="form-input" />
                </FormField>
              </div>
              <FormField>
                <input {...register('phone')} placeholder={t('contact.form_phone')} className="form-input" />
              </FormField>
              <FormField>
                <textarea {...register('message', { required: true })} rows={4}
                           placeholder={t('contact.form_message')} className="form-input resize-none" />
              </FormField>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                {isSubmitting ? '...' : t('contact.form_submit')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%; background: transparent;
          border: 1px solid rgba(201,168,76,0.3); color: #f5f0e8;
          padding: 0.75rem 1rem; font-size: 0.875rem;
          transition: border-color 0.2s; outline: none;
        }
        .form-input:focus { border-color: #c9a84c; }
        .form-input::placeholder { color: rgba(245,240,232,0.3); }
      `}</style>
    </section>
  )
}

function InfoRow({ icon, text, href }: { icon: string; text: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 group">
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <span className="text-pub-cream/70 group-hover:text-pub-gold transition-colors text-sm">{text}</span>
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content
}

function FormField({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
