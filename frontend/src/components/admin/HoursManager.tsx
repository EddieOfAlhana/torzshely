import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import type { OpeningHours } from '../../types'

const DAY_NAMES = ['', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap']

const DEFAULT_HOURS: OpeningHours[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1, dayOfWeek: i + 1, closed: i === 0,
  openTime: i === 0 ? undefined : i === 6 ? '14:00' : '16:00',
  closeTime: i === 0 ? undefined : [4, 5].includes(i) ? '01:00' : i === 6 ? '22:00' : '23:00',
}))

export default function HoursManager() {
  const [hours, setHours] = useState<OpeningHours[]>(DEFAULT_HOURS)
  const [saving, setSaving] = useState<number | null>(null)

  useEffect(() => {
    api.get<OpeningHours[]>('/opening-hours').then(r => {
      if (r.data.length > 0) setHours(r.data)
    }).catch(() => {})
  }, [])

  const update = (idx: number, changes: Partial<OpeningHours>) => {
    setHours(h => h.map((item, i) => i === idx ? { ...item, ...changes } : item))
  }

  const save = async (h: OpeningHours) => {
    setSaving(h.dayOfWeek)
    try {
      await api.put(`/opening-hours/${h.dayOfWeek}`, h)
      toast.success(`${DAY_NAMES[h.dayOfWeek]} mentve!`)
    } catch { toast.error('Hiba!') }
    finally { setSaving(null) }
  }

  return (
    <div>
      <h1 className="font-display text-pub-gold text-2xl tracking-widest mb-8">NYITVATARTÁS</h1>
      <p className="text-pub-cream/50 text-sm mb-8">
        Módosítsd az egyes napok nyitvatartását, majd kattints a "Mentés" gombra.
      </p>

      <div className="space-y-4 max-w-2xl">
        {hours.map((h, idx) => (
          <div key={h.dayOfWeek}
               className="border border-pub-gold/20 p-5 hover:border-pub-gold/40 transition-colors">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-28 font-display text-pub-cream text-sm tracking-wider">
                {DAY_NAMES[h.dayOfWeek]}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={h.closed}
                       onChange={e => update(idx, { closed: e.target.checked })}
                       className="accent-pub-gold" />
                <span className="text-pub-cream/60 text-sm">Zárva</span>
              </label>

              {!h.closed && (
                <>
                  <div className="flex items-center gap-2">
                    <input type="time" value={h.openTime || ''}
                           onChange={e => update(idx, { openTime: e.target.value })}
                           className="admin-input w-28 text-sm" />
                    <span className="text-pub-cream/40">–</span>
                    <input type="time" value={h.closeTime || ''}
                           onChange={e => update(idx, { closeTime: e.target.value })}
                           className="admin-input w-28 text-sm" />
                  </div>
                </>
              )}

              <button onClick={() => save(h)} disabled={saving === h.dayOfWeek}
                className="ml-auto btn-primary text-xs py-2 px-5">
                {saving === h.dayOfWeek ? '...' : 'Mentés'}
              </button>
            </div>

            {/* Notes */}
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <input value={h.noteHu || ''} onChange={e => update(idx, { noteHu: e.target.value })}
                     className="admin-input text-xs" placeholder="Megjegyzés (HU)" />
              <input value={h.noteEn || ''} onChange={e => update(idx, { noteEn: e.target.value })}
                     className="admin-input text-xs" placeholder="Note (EN)" />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .admin-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,168,76,0.3); color: #f5f0e8;
          padding: 0.5rem 0.75rem; font-size: 0.875rem;
          transition: border-color 0.2s; outline: none;
        }
        .admin-input:focus { border-color: #c9a84c; }
      `}</style>
    </div>
  )
}
