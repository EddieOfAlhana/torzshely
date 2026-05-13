import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      navigate('/admin')
    } catch {
      setError('Hibás felhasználónév vagy jelszó.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pub-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="font-display text-pub-gold text-3xl tracking-widest">TÖRZSHELY 16</div>
          <div className="text-pub-cream/40 text-xs tracking-widest mt-1">ADMIN FELÜLET</div>
        </div>

        <form onSubmit={handleSubmit} className="border border-pub-gold/20 p-8 space-y-6">
          <div>
            <label className="block text-pub-cream/60 text-xs tracking-widest uppercase mb-2">
              Felhasználónév
            </label>
            <input value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-transparent border border-pub-gold/30 text-pub-cream px-4 py-3
                         focus:border-pub-gold outline-none transition-colors"
              autoComplete="username" />
          </div>
          <div>
            <label className="block text-pub-cream/60 text-xs tracking-widest uppercase mb-2">
              Jelszó
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border border-pub-gold/30 text-pub-cream px-4 py-3
                         focus:border-pub-gold outline-none transition-colors"
              autoComplete="current-password" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Belépés...' : 'Belépés'}
          </button>
        </form>

        <div className="text-center mt-8">
          <a href="/" className="text-pub-cream/30 hover:text-pub-gold text-xs transition-colors">
            ← Vissza a weboldalra
          </a>
        </div>
      </div>
    </div>
  )
}
