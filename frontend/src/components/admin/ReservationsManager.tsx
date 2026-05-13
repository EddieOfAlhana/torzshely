import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import toast from 'react-hot-toast'
import api from '../../services/api'
import type { Reservation, ReservationSlot } from '../../types'
import { addDays, startOfToday } from 'date-fns'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Várakozó',
  APPROVED: 'Jóváhagyva',
  REJECTED: 'Visszautasítva',
  CANCELLED: 'Lemondva',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 border-yellow-400/40',
  APPROVED: 'text-green-400 border-green-400/40',
  REJECTED: 'text-red-400 border-red-400/40',
  CANCELLED: 'text-pub-cream/30 border-pub-cream/20',
}

const AREA_LABELS: Record<string, string> = {
  INDOOR: 'Belső terem',
  OUTDOOR: 'Kültéri terasz',
}

const AREA_ICONS: Record<string, string> = {
  INDOOR: '🏠',
  OUTDOOR: '🌿',
}

export default function ReservationsManager() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [slots, setSlots] = useState<ReservationSlot[]>([])
  const [filter, setFilter] = useState<string>('ALL')
  const [tab, setTab] = useState<'reservations' | 'slots'>('reservations')
  const [newSlot, setNewSlot] = useState({ slotDate: '', slotTime: '18:00', indoorCapacity: 28, outdoorCapacity: 15 })

  const loadAll = () => {
    api.get<Reservation[]>('/reservations').then(r => setReservations(r.data)).catch(() => {})
    const today = format(startOfToday(), 'yyyy-MM-dd')
    const future = format(addDays(startOfToday(), 30), 'yyyy-MM-dd')
    api.get<ReservationSlot[]>(`/reservations/slots/range?from=${today}&to=${future}`)
      .then(r => setSlots(r.data)).catch(() => {})
  }

  useEffect(() => { loadAll() }, [])

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status })
      toast.success('Állapot frissítve!')
      loadAll()
    } catch { toast.error('Hiba!') }
  }

  const addSlot = async () => {
    if (!newSlot.slotDate) { toast.error('Add meg a dátumot!'); return }
    try {
      await api.post('/reservations/slots', newSlot)
      toast.success('Időpont létrehozva!')
      setNewSlot({ slotDate: '', slotTime: '18:00', indoorCapacity: 28, outdoorCapacity: 15 })
      loadAll()
    } catch { toast.error('Hiba!') }
  }

  const deleteSlot = async (id: number) => {
    if (!confirm('Töröljük ezt az időpontot?')) return
    await api.delete(`/reservations/slots/${id}`)
    loadAll()
  }

  const filtered = filter === 'ALL' ? reservations : reservations.filter(r => r.status === filter)

  return (
    <div>
      <h1 className="font-display text-pub-gold text-2xl tracking-widest mb-8">FOGLALÁSOK</h1>

      {/* Tabs */}
      <div className="flex border-b border-pub-gold/20 mb-8">
        {['reservations', 'slots'].map(t => (
          <button key={t} onClick={() => setTab(t as typeof tab)}
            className={`px-6 py-3 text-sm font-display tracking-widest transition-all
              ${tab === t ? 'border-b-2 border-pub-gold text-pub-gold' : 'text-pub-cream/40 hover:text-pub-cream/70'}`}>
            {t === 'reservations' ? 'Foglalások' : 'Időpontok kezelése'}
          </button>
        ))}
      </div>

      {tab === 'reservations' && (
        <>
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-1.5 text-xs font-display tracking-widest border transition-all
                  ${filter === s ? 'bg-pub-gold text-pub-black border-pub-gold' : 'border-pub-gold/20 text-pub-cream/50 hover:border-pub-gold/50'}`}>
                {s === 'ALL' ? 'Összes' : STATUS_LABELS[s]}
                {s !== 'ALL' && (
                  <span className="ml-1 opacity-70">({reservations.filter(r => r.status === s).length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Reservation list */}
          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className="border border-pub-gold/15 p-5 hover:border-pub-gold/30 transition-colors">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-pub-cream font-medium">{r.guestName}</span>
                      <span className={`text-[10px] border px-2 py-0.5 font-display tracking-wider ${STATUS_COLORS[r.status]}`}>
                        {STATUS_LABELS[r.status]}
                      </span>
                      {r.seatingArea && (
                        <span className="text-[10px] border border-pub-gold/30 text-pub-gold/70 px-2 py-0.5 font-display tracking-wider">
                          {AREA_ICONS[r.seatingArea]} {AREA_LABELS[r.seatingArea]}
                        </span>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-1 text-xs text-pub-cream/50">
                      <span>📅 {r.slot?.slotDate} {r.slot?.slotTime?.slice(0,5)}</span>
                      <span>👥 {r.partySize} fő</span>
                      <span>📞 {r.phone}</span>
                      {r.email && <span>✉️ {r.email}</span>}
                      {r.notes && <span className="sm:col-span-2">💬 {r.notes}</span>}
                    </div>
                    <div className="text-pub-cream/25 text-[10px] mt-2">
                      {format(new Date(r.createdAt), 'yyyy. MMM d. HH:mm', { locale: hu })}
                    </div>
                  </div>

                  {/* Actions */}
                  {r.status === 'PENDING' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => updateStatus(r.id, 'APPROVED')}
                        className="text-xs bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5
                                   hover:bg-green-500/20 transition-colors">
                        ✓ Jóváhagyás
                      </button>
                      <button onClick={() => updateStatus(r.id, 'REJECTED')}
                        className="text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5
                                   hover:bg-red-500/20 transition-colors">
                        ✗ Visszautasítás
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-pub-cream/30 text-center py-12">Nincs foglalás ebben a kategóriában.</p>
            )}
          </div>
        </>
      )}

      {tab === 'slots' && (
        <>
          {/* Add slot form */}
          <div className="border border-pub-gold/20 p-6 mb-8">
            <h3 className="font-display text-pub-gold text-sm tracking-widest uppercase mb-4">Új időpont létrehozása</h3>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-pub-cream/50 text-xs mb-1">Dátum</label>
                <input type="date" value={newSlot.slotDate}
                       onChange={e => setNewSlot({...newSlot, slotDate: e.target.value})}
                       className="admin-input w-40" />
              </div>
              <div>
                <label className="block text-pub-cream/50 text-xs mb-1">Időpont</label>
                <input type="time" value={newSlot.slotTime}
                       onChange={e => setNewSlot({...newSlot, slotTime: e.target.value})}
                       className="admin-input w-32" />
              </div>
              <div>
                <label className="block text-pub-cream/50 text-xs mb-1">🏠 Belső (fő)</label>
                <input type="number" value={newSlot.indoorCapacity}
                       onChange={e => setNewSlot({...newSlot, indoorCapacity: Number(e.target.value)})}
                       className="admin-input w-24" min={0} />
              </div>
              <div>
                <label className="block text-pub-cream/50 text-xs mb-1">🌿 Kültéri (fő)</label>
                <input type="number" value={newSlot.outdoorCapacity}
                       onChange={e => setNewSlot({...newSlot, outdoorCapacity: Number(e.target.value)})}
                       className="admin-input w-24" min={0} />
              </div>
              <button onClick={addSlot} className="btn-primary text-xs py-2.5 px-6">
                + Hozzáadás
              </button>
            </div>
          </div>

          {/* Slots list */}
          <div className="space-y-2">
            {slots.map(slot => {
              const totalCap = (slot.indoorCapacity ?? 28) + (slot.outdoorCapacity ?? 15)
              const totalBooked = (slot.bookedIndoor ?? 0) + (slot.bookedOutdoor ?? 0)
              const indoorAvail = (slot.indoorCapacity ?? 28) - (slot.bookedIndoor ?? 0)
              const outdoorAvail = (slot.outdoorCapacity ?? 15) - (slot.bookedOutdoor ?? 0)
              return (
                <div key={slot.id} className="border border-pub-gold/15 p-4 hover:border-pub-gold/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <span className="font-display text-pub-cream text-sm tracking-wider">
                        {slot.slotDate} {slot.slotTime?.slice(0,5)}
                      </span>
                      <div className="flex gap-4 text-xs text-pub-cream/40 mt-1">
                        <span>🏠 {indoorAvail} / {slot.indoorCapacity ?? 28} szabad</span>
                        <span>🌿 {outdoorAvail} / {slot.outdoorCapacity ?? 15} szabad</span>
                      </div>
                    </div>
                    <div className="w-32 bg-pub-black/40 rounded-full h-1.5">
                      <div className="bg-pub-gold h-1.5 rounded-full transition-all"
                           style={{ width: totalCap > 0 ? `${(totalBooked / totalCap) * 100}%` : '0%' }} />
                    </div>
                    <button onClick={() => deleteSlot(slot.id)}
                      className="text-red-400/50 hover:text-red-400 text-xs px-3 py-1.5 border border-red-400/10 hover:border-red-400/40 transition-colors">
                      Töröl
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <style>{`
        .admin-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,168,76,0.3); color: #f5f0e8;
          padding: 0.625rem 0.875rem; font-size: 0.875rem;
          transition: border-color 0.2s; outline: none;
        }
        .admin-input:focus { border-color: #c9a84c; }
      `}</style>
    </div>
  )
}
