import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import type { GalleryPhoto } from '../../types'

const CATEGORIES = ['general', 'interior', 'terrace', 'drinks', 'food', 'events']
const CAT_LABELS: Record<string, string> = {
  general: 'Általános', interior: 'Belső tér', terrace: 'Terasz',
  drinks: 'Italok', food: 'Ételek', events: 'Programok'
}

export default function GalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('general')
  const [captionHu, setCaptionHu] = useState('')
  const [captionEn, setCaptionEn] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => api.get<GalleryPhoto[]>('/gallery').then(r => setPhotos(r.data)).catch(() => {})

  useEffect(() => { load() }, [])

  const upload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) { toast.error('Válassz fájlt!'); return }
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('category', category)
      if (captionHu) form.append('captionHu', captionHu)
      if (captionEn) form.append('captionEn', captionEn)
      await api.post('/gallery', form)
      toast.success('Feltöltve!')
      if (fileRef.current) fileRef.current.value = ''
      setCaptionHu(''); setCaptionEn('')
      load()
    } catch { toast.error('Hiba!') }
    finally { setUploading(false) }
  }

  const deletePhoto = async (id: number) => {
    if (!confirm('Törölni szeretnéd ezt a fotót?')) return
    await api.delete(`/gallery/${id}`)
    load()
  }

  const toggleFeatured = async (photo: GalleryPhoto) => {
    await api.put(`/gallery/${photo.id}`, { ...photo, featured: !photo.featured })
    load()
  }

  return (
    <div>
      <h1 className="font-display text-pub-gold text-2xl tracking-widest mb-8">GALÉRIA</h1>

      {/* Upload section */}
      <div className="border border-pub-gold/20 p-6 mb-8">
        <h3 className="font-display text-pub-gold text-sm tracking-widest uppercase mb-6">Fotó feltöltése</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Kategória</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
                    className="admin-input w-full">
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Felirat (HU)</label>
            <input value={captionHu} onChange={e => setCaptionHu(e.target.value)}
                   className="admin-input w-full" placeholder="Felirat magyarul" />
          </div>
          <div>
            <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Caption (EN)</label>
            <input value={captionEn} onChange={e => setCaptionEn(e.target.value)}
                   className="admin-input w-full" placeholder="Caption in English" />
          </div>
          <div>
            <label className="block text-pub-cream/50 text-xs uppercase tracking-widest mb-1">Fájl</label>
            <input type="file" accept="image/*" ref={fileRef}
                   className="text-pub-cream/60 text-sm w-full" />
          </div>
        </div>
        <button onClick={upload} disabled={uploading} className="btn-primary text-xs py-2.5 px-8">
          {uploading ? 'Feltöltés...' : '↑ Feltöltés'}
        </button>
      </div>

      {/* Photo grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {photos.map(photo => (
          <div key={photo.id} className="break-inside-avoid mb-3 relative group">
            <img src={photo.imageUrl} alt={photo.captionHu || ''}
                 className="w-full h-auto" loading="lazy" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-pub-black/70 opacity-0 group-hover:opacity-100 transition-opacity
                            flex flex-col items-center justify-center gap-2 p-2">
              <span className="text-pub-cream/80 text-xs text-center">{photo.captionHu || CAT_LABELS[photo.category || 'general']}</span>
              <div className="flex gap-2">
                <button onClick={() => toggleFeatured(photo)}
                  className={`text-xs px-2 py-1 border ${photo.featured ? 'border-pub-gold text-pub-gold' : 'border-pub-cream/30 text-pub-cream/50'} hover:border-pub-gold hover:text-pub-gold transition-colors`}>
                  ★
                </button>
                <button onClick={() => deletePhoto(photo.id)}
                  className="text-xs px-2 py-1 border border-red-400/30 text-red-400/70 hover:border-red-400 hover:text-red-400 transition-colors">
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
