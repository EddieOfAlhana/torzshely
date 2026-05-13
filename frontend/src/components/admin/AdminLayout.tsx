import { useEffect, useState } from 'react'
import { useNavigate, NavLink, Outlet } from 'react-router-dom'
import api from '../../services/api'

const NAV = [
  { path: '/admin', label: 'Áttekintés', icon: '📊', end: true },
  { path: '/admin/events', label: 'Programok', icon: '📅' },
  { path: '/admin/menu', label: 'Menü', icon: '🍽️' },
  { path: '/admin/gallery', label: 'Galéria', icon: '🖼️' },
  { path: '/admin/hours', label: 'Nyitvatartás', icon: '🕐' },
  { path: '/admin/reviews', label: 'Vélemények', icon: '⭐' },
  { path: '/admin/reservations', label: 'Foglalások', icon: '📋' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/admin/login'); return }
    api.get('/auth/me').catch(() => { navigate('/admin/login') })
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
      isActive
        ? 'bg-pub-gold text-pub-black font-medium'
        : 'text-pub-cream/60 hover:text-pub-cream hover:bg-pub-brown/30'
    }`

  return (
    <div className="min-h-screen bg-pub-black flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-pub-dark border-r border-pub-gold/20
                         flex flex-col transition-transform duration-300
                         ${sideOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Header */}
        <div className="p-6 border-b border-pub-gold/20">
          <div className="font-display text-pub-gold text-lg tracking-widest">TÖRZSHELY 16</div>
          <div className="text-pub-cream/30 text-xs tracking-widest mt-1">CRM ADMIN</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV.map(item => (
            <NavLink key={item.path} to={item.path} end={item.end} className={navClass}
                     onClick={() => setSideOpen(false)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-pub-gold/20 space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 text-xs text-pub-cream/40 hover:text-pub-cream/70 transition-colors">
            🌐 Weboldal megnyitása
          </a>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-pub-cream/40 hover:text-red-400 transition-colors">
            🚪 Kilépés
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sideOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-pub-dark border-b border-pub-gold/20 flex items-center px-4 gap-4">
          <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden text-pub-cream/60 hover:text-pub-gold">
            ☰
          </button>
          <div className="flex-1" />
          <span className="text-pub-cream/40 text-xs">Törzshely 16 Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
