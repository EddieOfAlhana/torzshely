import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import type { Review } from '../../types'

const EMPTY: Partial<Review> = {
  authorName: '', textHu: '', textEn: '', rating: 5, source: 'manual', featured: true, active: true
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [editing, setEditing] = useState<Partial<Review> | null>(null)
  const [loading, setLoading] = useState(false)

  const load = () => api.get<Review[]>('/reviews/all').then(r => setReviews(r.data)).catch(() => {})

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    setLoading(true)
    try {
      if (editing.id) await api.put(`/reviews/${editing.id}`, editing)
      else await api.post('/reviews', editing)
      toast.success('Mentve!')
      setEditing(null)
      load()
    } catch { toast.error('Hiba!') }
    finally { setLoading(false) }
  }

  const remove = async (id: number) => {
    if (!confirm('Törlöd ezt a véleményt?')) return
    await api.delete(`/reviews/${id}`)
    load()
  }

  const toggleFeatured = async (r: Review) => {
    await api.put(`/reviews/${r.id}`, { ...r, featured: !r.featured })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-pub-gold text-2xl tracking-widest">VÉLEMÉNYEK</h1>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary text-xs py-2.5 px-5">
          + Új vélemény
        </button>
      </div>

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="border border-pub-gold/15 p-5 hover:border-pub-gold/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-pub-gold/15 border border-pub-gold/30
                              flex items-center justify-center font-display text-pub-gold">
                {r.authorName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-pub-cream font-medium">{r.authorName}</span>
                  <span className="text-pub-gold text-xs">{'★'.repeat(r.rating)}</span>
                  <span className="text-pub-cream/30 text-xs">{r.source}</span>
                  {r.featured && <span className="text-[10px] border border-pub-gold text-pub-gold px-1">Kiemelt</span>}
                </div>
                <p className="text-pub-cream/60 text-sm line-clamp-2">{r.textHu}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleFeatured(r)}
                  className={`text-xs px-2.5 py-1.5 border transition-colors ${
                    r.featured ? 'border-pub-gold text-pub-gold' : 'border-pub-cream/20 text-pub-cream/40 hover:border-pub-gold hover:text-pub-gold'
                  }`}>★</button>
                <button onClick={() => setEditing(r)}
                  className="text-pub-gold/70 hover:text-pub-gold text-xs px-3 py-1.5 border border-pub-gold/20 hover:border-pub-gold transition-colors">
                  Szerkeszt
                </button>
                <button onClick={() => remove(r.id)}
                  className="text-red-400/70 hover:text-red-400 text-xs px-3 py-1.5 border border-red-400/20 hover:border-red-400 transition-colors">
                  Töröl
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-pub-dark border border-pub-gold/30 w-full max-w-lg p-8">
            <h2 className="font-display text-pub-gold text-lg tracking-widest mb-6">
              {editing.id ? 'Vélemény szerkesztése' : 'Új vélemény'}
            </h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Szerző neve</label>
                  <input value={editing.authorName || ''} onChange={e => setEditing({...editing, authorName: e.target.value})}
                         className="admin-input w-full" />
                </div>
                <div>
                  <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Értékelés</label>
                  <select value={editing.rating || 5} onChange={e => setEditing({...editing, rating: Number(e.target.value)})}
                          className="admin-input w-full">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Vélemény (HU)</label>
                <textarea value={editing.textHu || ''} rows={4}
                          onChange={e => setEditing({...editing, textHu: e.target.value})}
                          className="admin-input w-full resize-none" />
              </div>
              <div>
                <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Review (EN)</label>
                <textarea value={editing.textEn || ''} rows={4}
                          onChange={e => setEditing({...editing, textEn: e.target.value})}
                          className="admin-input w-full resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Forrás</label>
                  <select value={editing.source || 'manual'} onChange={e => setEditing({...editing, source: e.target.value})}
                          className="admin-input w-full">
                    <option value="google">Google</option>
                    <option value="facebook">Facebook</option>
                    <option value="manual">Manuális</option>
                  </select>
                </div>
                <div>
                  <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Dátum</label>
                  <input type="date" value={editing.reviewDate || ''}
                         onChange={e => setEditing({...editing, reviewDate: e.target.value})}
                         className="admin-input w-full" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-pub-cream/70 cursor-pointer">
                  <input type="checkbox" checked={editing.featured !== false}
                         onChange={e => setEditing({...editing, featured: e.target.checked})}
                         className="accent-pub-gold" />
                  Kiemelt
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={loading} className="btn-primary flex-1 justify-center text-xs">
                {loading ? 'Mentés...' : 'Mentés'}
              </button>
              <button onClick={() => setEditing(null)} className="btn-outline text-xs px-6">Mégse</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input {
          background: rgba(255,255,255,0.05);
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
