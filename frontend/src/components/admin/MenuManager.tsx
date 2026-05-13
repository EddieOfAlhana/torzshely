import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import type { MenuCategory, MenuItem } from '../../types'

export default function MenuManager() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [selected, setSelected] = useState<MenuCategory | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null)
  const [loading, setLoading] = useState(false)

  const loadCats = () => api.get<MenuCategory[]>('/menu/categories').then(r => setCategories(r.data))

  useEffect(() => { loadCats() }, [])

  useEffect(() => {
    if (!selected) return
    api.get<MenuItem[]>(`/menu/items/category/${selected.id}`).then(r => setItems(r.data))
  }, [selected])

  const saveItem = async () => {
    if (!editing || !selected) return
    setLoading(true)
    try {
      const payload = { ...editing, category: { id: selected.id } }
      const form = new FormData()
      form.append('item', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
      if (editing.id) await api.put(`/menu/items/${editing.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.post('/menu/items', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Mentve!')
      setEditing(null)
      api.get<MenuItem[]>(`/menu/items/category/${selected.id}`).then(r => setItems(r.data))
    } catch { toast.error('Hiba!') }
    finally { setLoading(false) }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Töröljük?')) return
    await api.delete(`/menu/items/${id}`)
    if (selected) api.get<MenuItem[]>(`/menu/items/category/${selected.id}`).then(r => setItems(r.data))
  }

  return (
    <div>
      <h1 className="font-display text-pub-gold text-2xl tracking-widest mb-8">MENÜ</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category sidebar */}
        <div className="lg:col-span-1">
          <h3 className="font-display text-pub-gold/60 text-xs tracking-[0.3em] uppercase mb-4">Kategóriák</h3>
          <div className="space-y-2">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => { setSelected(cat); setEditing(null) }}
                className={`w-full text-left px-4 py-3 text-sm border transition-all duration-200 ${
                  selected?.id === cat.id
                    ? 'bg-pub-gold text-pub-black border-pub-gold'
                    : 'border-pub-gold/20 text-pub-cream/60 hover:border-pub-gold/40 hover:text-pub-cream'
                }`}>
                <span className="block font-medium">{cat.nameHu}</span>
                <span className="text-[11px] opacity-60">{cat.type === 'food' ? 'Étel' : 'Ital'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Items panel */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="border border-pub-gold/10 p-12 text-center text-pub-cream/30">
              Válassz kategóriát a bal oldali listából
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-pub-gold text-sm tracking-widest uppercase">
                  {selected.nameHu}
                </h3>
                <button onClick={() => setEditing({ nameHu: '', active: true, featured: false, sortOrder: items.length })}
                  className="btn-primary text-xs py-2 px-4">
                  + Hozzáadás
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {items.map(item => (
                  <div key={item.id} className="border border-pub-gold/15 p-4 flex items-center gap-4 hover:border-pub-gold/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-pub-cream text-sm">{item.nameHu}</span>
                        {item.featured && <span className="text-[10px] border border-pub-gold/50 text-pub-gold px-1">★</span>}
                      </div>
                      {item.descriptionHu && <p className="text-pub-cream/40 text-xs mt-0.5 truncate">{item.descriptionHu}</p>}
                    </div>
                    <div className="text-pub-gold text-sm font-display flex-shrink-0">
                      {item.priceHuf ? `${item.priceHuf.toLocaleString('hu-HU')} Ft` : '–'}
                      {item.priceNote && <span className="text-pub-cream/30 text-xs ml-1">/{item.priceNote}</span>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setEditing(item)} className="text-xs px-3 py-1.5 border border-pub-gold/20 text-pub-gold/70 hover:border-pub-gold transition-colors">Szerk.</button>
                      <button onClick={() => deleteItem(item.id)} className="text-xs px-2.5 py-1.5 border border-red-400/20 text-red-400/70 hover:border-red-400 transition-colors">✕</button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-pub-cream/30 text-sm text-center py-8">Még nincsenek tételek ebben a kategóriában.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-pub-dark border border-pub-gold/30 w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-pub-gold text-lg tracking-widest mb-6">
              {editing.id ? 'Tétel szerkesztése' : 'Új tétel'}
            </h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminField label="Név (HU)">
                  <input value={editing.nameHu || ''} onChange={e => setEditing({...editing, nameHu: e.target.value})} className="admin-input w-full" />
                </AdminField>
                <AdminField label="Name (EN)">
                  <input value={editing.nameEn || ''} onChange={e => setEditing({...editing, nameEn: e.target.value})} className="admin-input w-full" />
                </AdminField>
              </div>
              <AdminField label="Leírás (HU)">
                <textarea value={editing.descriptionHu || ''} rows={2} onChange={e => setEditing({...editing, descriptionHu: e.target.value})} className="admin-input w-full resize-none" />
              </AdminField>
              <AdminField label="Description (EN)">
                <textarea value={editing.descriptionEn || ''} rows={2} onChange={e => setEditing({...editing, descriptionEn: e.target.value})} className="admin-input w-full resize-none" />
              </AdminField>
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminField label="Ár (Ft)">
                  <input type="number" value={editing.priceHuf || ''} onChange={e => setEditing({...editing, priceHuf: e.target.value ? Number(e.target.value) : undefined})} className="admin-input w-full" />
                </AdminField>
                <AdminField label="Ármegjelölés (pl. 0,5l)">
                  <input value={editing.priceNote || ''} onChange={e => setEditing({...editing, priceNote: e.target.value})} className="admin-input w-full" />
                </AdminField>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-pub-cream/70 cursor-pointer">
                  <input type="checkbox" checked={editing.featured !== false && !!editing.featured} onChange={e => setEditing({...editing, featured: e.target.checked})} className="accent-pub-gold" />
                  Kiemelt
                </label>
                <label className="flex items-center gap-2 text-sm text-pub-cream/70 cursor-pointer">
                  <input type="checkbox" checked={editing.active !== false} onChange={e => setEditing({...editing, active: e.target.checked})} className="accent-pub-gold" />
                  Aktív
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveItem} disabled={loading} className="btn-primary flex-1 justify-center text-xs">{loading ? 'Mentés...' : 'Mentés'}</button>
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
