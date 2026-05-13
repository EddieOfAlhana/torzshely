import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, reservations: 0, pending: 0, gallery: 0 })

  useEffect(() => {
    Promise.allSettled([
      api.get('/events/all'),
      api.get('/reservations'),
      api.get('/reservations/pending'),
      api.get('/gallery'),
    ]).then(([ev, res, pend, gal]) => {
      setStats({
        events: ev.status === 'fulfilled' ? ev.value.data.length : 0,
        reservations: res.status === 'fulfilled' ? res.value.data.length : 0,
        pending: pend.status === 'fulfilled' ? pend.value.data.length : 0,
        gallery: gal.status === 'fulfilled' ? gal.value.data.length : 0,
      })
    })
  }, [])

  return (
    <div>
      <h1 className="font-display text-pub-gold text-2xl tracking-widest mb-8">ÁTTEKINTÉS</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon="📅" label="Aktív programok" value={stats.events} />
        <StatCard icon="📋" label="Összes foglalás" value={stats.reservations} />
        <StatCard icon="⏳" label="Várakozó foglalás" value={stats.pending} accent={stats.pending > 0} />
        <StatCard icon="🖼️" label="Galéria fotó" value={stats.gallery} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="border border-pub-gold/20 p-6">
          <h2 className="font-display text-pub-gold text-sm tracking-widest uppercase mb-6">Gyors műveletek</h2>
          <div className="space-y-3">
            <QuickLink to="/admin/events" icon="📅" label="Új program hozzáadása" />
            <QuickLink to="/admin/reservations" icon="📋" label="Foglalások kezelése" />
            <QuickLink to="/admin/gallery" icon="🖼️" label="Fotó feltöltése" />
            <QuickLink to="/admin/hours" icon="🕐" label="Nyitvatartás szerkesztése" />
          </div>
        </div>

        {/* Info */}
        <div className="border border-pub-gold/20 p-6">
          <h2 className="font-display text-pub-gold text-sm tracking-widest uppercase mb-6">Törzshely 16</h2>
          <div className="space-y-3 text-sm text-pub-cream/60">
            <div className="flex items-center gap-2">📍 <span>Thököly út 7/b, 1163 Budapest</span></div>
            <div className="flex items-center gap-2">📞 <span>+36 30 383 9818</span></div>
            <div className="flex items-center gap-2">✉️ <span>torzshely16@gmail.com</span></div>
            <div className="flex items-center gap-2">⭐ <span>4,9 / 5 – Google értékelés</span></div>
          </div>
          <div className="mt-6 pt-6 border-t border-pub-gold/10">
            <a href="/" target="_blank" className="text-pub-gold hover:text-pub-gold-light text-sm transition-colors">
              🌐 Weboldal megtekintése →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, accent }: {
  icon: string; label: string; value: number; accent?: boolean
}) {
  return (
    <div className={`border p-6 ${accent ? 'border-pub-gold bg-pub-gold/5' : 'border-pub-gold/20'}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <div className={`font-display text-4xl ${accent ? 'text-pub-gold' : 'text-pub-cream'}`}>{value}</div>
      <div className="text-pub-cream/50 text-xs mt-1 tracking-wide">{label}</div>
    </div>
  )
}

function QuickLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <a href={to} className="flex items-center gap-3 p-3 border border-pub-gold/10 hover:border-pub-gold/40
                             hover:bg-pub-gold/5 transition-all duration-200 text-pub-cream/70 hover:text-pub-cream text-sm">
      <span>{icon}</span>
      <span>{label}</span>
      <span className="ml-auto text-pub-gold/40">→</span>
    </a>
  )
}
