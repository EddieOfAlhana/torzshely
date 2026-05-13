import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addDays, startOfToday } from 'date-fns'
import { hu } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import api from '../../services/api'
import type { ReservationSlot } from '../../types'

type SeatingArea = 'INDOOR' | 'OUTDOOR'

const schema = z.object({
  guestName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().or(z.literal('')).optional(),
  partySize: z.number().min(1).max(30),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const AREA_CONFIG = {
  INDOOR: { labelHu: 'Belső terem', labelEn: 'Indoor', icon: '🏠', capacity: 28, descHu: '28 férőhely', descEn: '28 seats' },
  OUTDOOR: { labelHu: 'Kültéri terasz', labelEn: 'Outdoor terrace', icon: '🌿', capacity: 15, descHu: '15 férőhely', descEn: '15 seats' },
}

export default function ReservationSection() {
  const { t, i18n } = useTranslation()
  const [selectedArea, setSelectedArea] = useState<SeatingArea | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [slots, setSlots] = useState<ReservationSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<ReservationSlot | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const titleRef = useScrollAnimation()
  const isHu = i18n.language === 'hu'

  const today = startOfToday()
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(today, i + 1)
    return { value: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE, MMM d', { locale: isHu ? hu : undefined }) }
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { partySize: 2 }
  })

  useEffect(() => {
    if (!selectedDate) return
    api.get<ReservationSlot[]>(`/reservations/slots/${selectedDate}`)
      .then(r => { setSlots(r.data); setSelectedSlot(null) })
      .catch(() => setSlots([]))
  }, [selectedDate])

  const getAvailable = (slot: ReservationSlot, area: SeatingArea) =>
    area === 'INDOOR'
      ? (slot.indoorCapacity ?? 28) - (slot.bookedIndoor ?? 0)
      : (slot.outdoorCapacity ?? 15) - (slot.bookedOutdoor ?? 0)

  const onSubmit = async (data: FormData) => {
    if (!selectedSlot || !selectedArea) { toast.error(isHu ? 'Kérlek válassz időpontot!' : 'Please select a time slot!'); return }
    setLoading(true)
    try {
      await api.post('/reservations', { ...data, slotId: selectedSlot.id, seatingArea: selectedArea })
      setSuccess(true)
      reset()
      setSelectedDate('')
      setSelectedSlot(null)
      setSelectedArea(null)
      toast.success(t('reservation.success'))
    } catch {
      toast.error(t('reservation.error'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section id="reservation" className="py-24 bg-pub-dark">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-pub-teal text-6xl mb-6">✓</div>
          <h2 className="section-title mb-4">{isHu ? 'Foglalás elküldve!' : 'Reservation sent!'}</h2>
          <p className="text-pub-cream/70 mb-8">{t('reservation.success')}</p>
          <button onClick={() => setSuccess(false)} className="btn-outline">
            {isHu ? 'Új foglalás' : 'New reservation'}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="reservation" className="py-24 md:py-32 bg-pub-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="section-title">{t('reservation.title')}</h2>
          <p className="section-subtitle">{t('reservation.subtitle')}</p>
          <div className="gold-divider" />
        </div>

        <div className="border border-pub-teal/20 p-8 md:p-12">

          {/* Step 1: Seating area */}
          <div className="mb-10">
            <StepLabel n={1} label={isHu ? 'Helyszín választás' : 'Choose seating area'} />
            <div className="grid grid-cols-2 gap-4 mt-4">
              {(Object.entries(AREA_CONFIG) as [SeatingArea, typeof AREA_CONFIG.INDOOR][]).map(([key, cfg]) => {
                const isSelected = selectedArea === key
                return (
                  <button key={key} onClick={() => { setSelectedArea(key); setSelectedSlot(null) }}
                    className={`p-5 text-left border transition-all duration-200 ${
                      isSelected
                        ? 'bg-pub-teal/10 border-pub-teal text-pub-cream'
                        : 'border-pub-teal/20 text-pub-cream/60 hover:border-pub-teal/50 hover:text-pub-cream'
                    }`}>
                    <div className="text-2xl mb-2">{cfg.icon}</div>
                    <div className="font-display tracking-wider text-sm mb-1">
                      {isHu ? cfg.labelHu : cfg.labelEn}
                    </div>
                    <div className="text-xs opacity-60">
                      {isHu ? cfg.descHu : cfg.descEn}
                    </div>
                    {isSelected && (
                      <div className="text-xs mt-2 font-display tracking-widest text-pub-teal">
                        ✓ KIVÁLASZTVA
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Date */}
          {selectedArea && (
            <div className="mb-10">
              <StepLabel n={2} label={t('reservation.pick_date')} />
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mt-4">
                {dates.map(d => (
                  <button key={d.value} onClick={() => setSelectedDate(d.value)}
                    className={`p-3 text-center text-xs border transition-all duration-200 ${
                      selectedDate === d.value
                        ? 'bg-pub-teal text-pub-black border-pub-teal font-medium'
                        : 'border-pub-teal/20 text-pub-cream/60 hover:border-pub-teal/50 hover:text-pub-cream'
                    }`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Time */}
          {selectedDate && selectedArea && (
            <div className="mb-10">
              <StepLabel n={3} label={t('reservation.pick_time')} />
              {slots.length === 0 ? (
                <p className="text-pub-cream/40 text-sm mt-4">{t('reservation.no_slots')}</p>
              ) : (
                <div className="flex flex-wrap gap-3 mt-4">
                  {slots.map(slot => {
                    const avail = getAvailable(slot, selectedArea)
                    const isFull = avail <= 0
                    const isSelected = selectedSlot?.id === slot.id
                    return (
                      <button key={slot.id} disabled={isFull}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-6 py-3 text-sm border transition-all duration-200 ${
                          isSelected ? 'bg-pub-teal text-pub-black border-pub-teal'
                          : isFull ? 'border-pub-cream/10 text-pub-cream/20 cursor-not-allowed'
                          : 'border-pub-teal/30 text-pub-cream hover:border-pub-teal'
                        }`}>
                        <div className="font-display tracking-wider">{slot.slotTime.slice(0,5)}</div>
                        <div className="text-[10px] mt-0.5 opacity-70">
                          {isFull ? t('reservation.full') : `${avail} ${t('reservation.available')}`}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Guest info */}
          {selectedSlot && selectedArea && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <StepLabel n={4} label={isHu ? 'Személyes adatok' : 'Your details'} />
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <Field label={t('reservation.guest_name')} error={errors.guestName?.message}>
                  <input {...register('guestName')} placeholder={isHu ? 'Kovács János' : 'John Smith'}
                         className="form-input" />
                </Field>
                <Field label={t('reservation.phone')} error={errors.phone?.message}>
                  <input {...register('phone')} placeholder="+36 30 xxx xxxx" className="form-input" />
                </Field>
                <Field label={t('reservation.email')} error={errors.email?.message}>
                  <input {...register('email')} type="email" placeholder="email@example.com" className="form-input" />
                </Field>
                <Field label={t('reservation.pick_size')} error={errors.partySize?.message}>
                  <input {...register('partySize', { valueAsNumber: true })} type="number" min={1}
                         max={selectedArea === 'INDOOR' ? 28 : 15}
                         className="form-input" />
                </Field>
              </div>
              <Field label={t('reservation.notes')}>
                <textarea {...register('notes')} rows={3} placeholder={isHu ? 'Bármilyen különleges kérés...' : 'Any special requests...'}
                           className="form-input resize-none" />
              </Field>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? '...' : t('reservation.submit')}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(94,144,156,0.3);
          color: #f5f0e8;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
          outline: none;
        }
        .form-input:focus { border-color: #5e909c; }
        .form-input::placeholder { color: rgba(245,240,232,0.3); }
      `}</style>
    </section>
  )
}

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-7 h-7 rounded-full border border-pub-teal text-pub-teal flex items-center justify-center
                      text-xs font-display">{n}</div>
      <span className="font-display text-pub-teal text-sm tracking-widest uppercase">{label}</span>
    </div>
  )
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-pub-cream/60 text-xs tracking-widest uppercase mb-2">{label}</label>
      {children}
      {error && <span className="text-red-400 text-xs mt-1 block">{error}</span>}
    </div>
  )
}
