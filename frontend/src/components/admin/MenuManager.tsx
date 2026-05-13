import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import type { MenuCategory, MenuItem } from '../../types'
import { BEER_COLORS } from '../sections/BeerSection'

export default function MenuManager() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [selected, setSelected] = useState<MenuCategory | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null)
  const [loading, setLoading] = useState(false)

  const loadCats = () => api.get<MenuCategory[]>('/menu/categories').then(r => setCategories(r.data))
  const loadItems = (cat: MenuCategory) => api.get<MenuItem[]>(`/menu/items/category/${cat.id}/all`).then(r => setItems(r.data))

  useEffect(() => { loadCats() }, [])
  useEffect(() => { if (selected) loadItems(selected) }, [selected])

  const isDraftBeer = selected?.nameHu === 'Csapolt sörök'

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
      loadItems(selected)
    } catch { toast.error('Hiba!') }
    finally { setLoading(false) }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Töröljük?')) return
    await api.delete(`/menu/items/${id}`)
    if (selected) loadItems(selected)
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
                <h3 className="font-display text-pub-gold text-sm tracking-widest uppercase flex items-center gap-2">
                  {selected.nameHu}
                  {isDraftBeer && (
                    <span className="text-[10px] border border-pub-gold/30 text-pub-gold/50 px-1.5 py-0.5 normal-case tracking-normal">
                      🍺 sörszín szerkeszthető
                    </span>
                  )}
                </h3>
                <button onClick={() => setEditing({ nameHu: '', active: true, featured: false, sortOrder: items.length })}
                  className="btn-primary text-xs py-2 px-4">
                  + Hozzáadás
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {items.map(item => {
                  const inactive = item.active === false
                  const swatchColor = item.color
                    ? (item.color.startsWith('#')
                        ? `linear-gradient(to bottom, ${item.color}cc, ${item.color}88)`
                        : BEER_COLORS[item.color]?.gradient)
                    : undefined
                  return (
                    <div key={item.id}
                      className={`border p-4 flex items-center gap-4 transition-colors
                        ${inactive
                          ? 'border-white/5 opacity-40 hover:opacity-60'
                          : 'border-pub-gold/15 hover:border-pub-gold/30'
                        }`}>
                      {/* Color swatch for draft beers */}
                      {isDraftBeer && swatchColor && (
                        <div className="w-5 h-8 rounded flex-shrink-0 border border-pub-gold/20"
                             style={{ background: swatchColor }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-pub-cream text-sm">{item.nameHu}</span>
                          {item.featured && <span className="text-[10px] border border-pub-gold/50 text-pub-gold px-1">★</span>}
                          {inactive && <span className="text-[10px] border border-white/20 text-white/40 px-1">inaktív</span>}
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
                  )
                })}
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
                <AdminField label="Kiszerelés (pl. 0,4l)">
                  <input value={editing.priceNote || ''} onChange={e => setEditing({...editing, priceNote: e.target.value})} className="admin-input w-full" />
                </AdminField>
              </div>

              {/* ABV and color – only for draught beers */}
              {isDraftBeer && (
                <>
                  <AdminField label="Alkoholtartalom (pl. 5,2%)">
                    <input
                      value={editing.abv || ''}
                      onChange={e => setEditing({ ...editing, abv: e.target.value })}
                      placeholder="pl. 4,9%"
                      className="admin-input w-full"
                    />
                  </AdminField>

                  <AdminField label="Sör színe">
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {Object.entries(BEER_COLORS).map(([key, val]) => {
                        const isSelected = !!(editing.color && !editing.color.startsWith('#') && editing.color === key)
                        return (
                          <button key={key} type="button"
                            onClick={() => setEditing({ ...editing, color: key })}
                            className={`flex items-center gap-2 px-3 py-2 border text-left transition-all text-xs
                              ${isSelected
                                ? 'border-pub-gold bg-pub-gold/10 text-pub-gold'
                                : 'border-pub-gold/15 text-pub-cream/50 hover:border-pub-gold/40 hover:text-pub-cream'
                              }`}>
                            <span className="inline-block w-5 h-5 rounded-sm flex-shrink-0 border border-white/10"
                                  style={{ background: val.gradient }} />
                            <span>{val.label}</span>
                            {isSelected && <span className="ml-auto text-pub-gold">✓</span>}
                          </button>
                        )
                      })}

                      {/* Custom RGB option */}
                      <label className={`flex items-center gap-2 px-3 py-2 border cursor-pointer transition-all text-xs
                        ${editing.color?.startsWith('#')
                          ? 'border-pub-gold bg-pub-gold/10 text-pub-gold'
                          : 'border-pub-gold/15 text-pub-cream/50 hover:border-pub-gold/40 hover:text-pub-cream'
                        }`}>
                        <input
                          type="color"
                          className="w-5 h-5 rounded-sm border-0 bg-transparent cursor-pointer flex-shrink-0"
                          value={editing.color?.startsWith('#') ? editing.color : '#ff9900'}
                          onChange={e => setEditing({ ...editing, color: e.target.value })}
                        />
                        <span>Egyedi</span>
                        {editing.color?.startsWith('#') && <span className="ml-auto text-pub-gold">✓</span>}
                      </label>
                    </div>

                    {/* Live preview */}
                    {editing.color && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="w-12 h-14 rounded relative overflow-hidden border border-pub-gold/20 flex-shrink-0"
                             style={{ background: editing.color.startsWith('#')
                               ? `linear-gradient(to bottom, ${editing.color}cc, ${editing.color}, ${editing.color}88)`
                               : BEER_COLORS[editing.color]?.gradient }}>
                          <div className="absolute top-0 left-0 right-0 h-3 rounded-b-full bg-white/75" />
                        </div>
                        <span className="text-pub-cream/40 text-xs">Előnézet – így fog kinézni a weboldalon</span>
                      </div>
                    )}
                  </AdminField>
                </>
              )}

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
