import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Lenis from 'lenis'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import AdminLogin from './components/admin/AdminLogin'
import PrivacyPage from './pages/PrivacyPage'
import CookieBanner from './components/ui/CookieBanner'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#3d2010', color: '#f5f0e8', border: '1px solid #c9a84c' }
      }} />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adatkezeles" element={<PrivacyPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
