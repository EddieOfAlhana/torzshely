import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import toast from 'react-hot-toast'
import api from '../../services/api'
import type { Event } from '../../types'

const EMPTY: Partial<Event> = {
  titleHu: '', titleEn: '', descriptionHu: '', descriptionEn: '',
  eventDate: '', category: 'quiz', priceHuf: undefined, registrationInfo: '', featured: false, active: true
}

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [editing, setEditing] = useState<Partial<Event> | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const load = () => api.get<Event[]>('/events/all').then(r => setEvents(r.data)).catch(() => {})

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('event', new Blob([JSON.stringify(editing)], { type: 'application/json' }))
      if (imageFile) form.append('image', imageFile)

      if (editing.id) {
        await api.put(`/events/${editing.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/events', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      toast.success('Mentve!')
      setEditing(null)
      setImageFile(null)
      load()
    } catch { toast.error('Hiba történt!') }
    finally { setLoading(false) }
  }

  const remove = async (id: number) => {
    if (!confirm('Törölni szeretnéd ezt a programot?')) return
    await api.delete(`/events/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-pub-gold text-2xl tracking-widest">PROGRAMOK</h1>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary text-xs py-2.5 px-5">
          + Új program
        </button>
      </div>

      {/* List */}
      <div className="space-y-3 mb-8">
        {events.map(ev => (
          <div key={ev.id} className="border border-pub-gold/20 p-4 flex items-center gap-4 hover:border-pub-gold/40 transition-colors">
            {ev.imageUrl && (
              <img src={ev.imageUrl} alt="" className="w-16 h-16 object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-pub-cream font-medium truncate">{ev.titleHu}</span>
                {ev.featured && <span className="text-[10px] border border-pub-gold text-pub-gold px-1">★</span>}
                {!ev.active && <span className="text-[10px] border border-red-400/50 text-red-400 px-1">Inaktív</span>}
              </div>
              <div className="text-pub-cream/40 text-xs mt-1">
                {format(new Date(ev.eventDate), 'yyyy. MMM d. HH:mm', { locale: hu })} · {ev.category}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setEditing(ev)} className="text-pub-gold/70 hover:text-pub-gold text-xs px-3 py-1.5 border border-pub-gold/20 hover:border-pub-gold transition-colors">
                Szerkeszt
              </button>
              <button onClick={() => remove(ev.id)} className="text-red-400/70 hover:text-red-400 text-xs px-3 py-1.5 border border-red-400/20 hover:border-red-400 transition-colors">
                Töröl
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-pub-dark border border-pub-gold/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="font-display text-pub-gold text-lg tracking-widest mb-6">
              {editing.id ? 'Program szerkesztése' : 'Új program'}
            </h2>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminField label="Cím (HU)">
                  <input value={editing.titleHu || ''} onChange={e => setEditing({...editing, titleHu: e.target.value})}
                         className="admin-input" placeholder="Program neve magyarul" />
                </AdminField>
                <AdminField label="Title (EN)">
                  <input value={editing.titleEn || ''} onChange={e => setEditing({...editing, titleEn: e.target.value})}
                         className="admin-input" placeholder="Event name in English" />
                </AdminField>
              </div>

              <AdminField label="Időpont">
                <input type="datetime-local" value={editing.eventDate ? editing.eventDate.slice(0,16) : ''}
                       onChange={e => setEditing({...editing, eventDate: e.target.value})}
                       className="admin-input" />
              </AdminField>

              <div className="grid sm:grid-cols-2 gap-4">
                <AdminField label="Kategória">
                  <select value={editing.category || 'quiz'}
                          onChange={e => setEditing({...editing, category: e.target.value})}
                          className="admin-input">
                    <option value="quiz">Kvíz</option>
                    <option value="karaoke">Karaoke</option>
                    <option value="tasting">Kóstoló</option>
                    <option value="disco">Disco / DJ</option>
                    <option value="other">Egyéb</option>
                  </select>
                </AdminField>
                <AdminField label="Ár (Ft/fő, 0 = ingyenes)">
                  <input type="number" value={editing.priceHuf || ''}
                         onChange={e => setEditing({...editing, priceHuf: e.target.value ? Number(e.target.value) : undefined})}
                         className="admin-input" placeholder="pl. 15000" />
                </AdminField>
              </div>

              <AdminField label="Leírás (HU)">
                <textarea value={editing.descriptionHu || ''} rows={4}
                          onChange={e => setEditing({...editing, descriptionHu: e.target.value})}
                          className="admin-input resize-none" placeholder="Program leírása magyarul..." />
              </AdminField>
              <AdminField label="Description (EN)">
                <textarea value={editing.descriptionEn || ''} rows={4}
                          onChange={e => setEditing({...editing, descriptionEn: e.target.value})}
                          className="admin-input resize-none" placeholder="Event description in English..." />
              </AdminField>

              <AdminField label="Jelentkezési info">
                <input value={editing.registrationInfo || ''}
                       onChange={e => setEditing({...editing, registrationInfo: e.target.value})}
                       className="admin-input" placeholder="pl. Telefonon vagy Messengeren" />
              </AdminField>

              <AdminField label="Borítókép">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)}
                       className="text-pub-cream/60 text-sm" />
                {editing.imageUrl && (
                  <img src={editing.imageUrl} alt="" className="mt-2 h-24 object-contain" />
                )}
              </AdminField>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-pub-cream/70 cursor-pointer">
                  <input type="checkbox" checked={editing.featured || false}
                         onChange={e => setEditing({...editing, featured: e.target.checked})}
                         className="accent-pub-gold" />
                  Kiemelt program
                </label>
                <label className="flex items-center gap-2 text-sm text-pub-cream/70 cursor-pointer">
                  <input type="checkbox" checked={editing.active !== false}
                         onChange={e => setEditing({...editing, active: e.target.checked})}
                         className="accent-pub-gold" />
                  Aktív
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={save} disabled={loading} className="btn-primary flex-1 justify-center text-xs">
                {loading ? 'Mentés...' : 'Mentés'}
              </button>
              <button onClick={() => { setEditing(null); setImageFile(null) }}
                className="btn-outline text-xs px-6">
                Mégse
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,168,76,0.3); color: #f5f0e8;
          padding: 0.625rem 0.875rem; font-size: 0.875rem;
          transition: border-color 0.2s; outline: none;
        }
        .admin-input:focus { border-color: #c9a84c; }
        .admin-input option { background: #1c0f07; }
      `}</style>
    </div>
  )
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-pub-cream/50 text-xs tracking-widest uppercase mb-1.5">{label}</label>
      {children}
    </div>
  )
}
