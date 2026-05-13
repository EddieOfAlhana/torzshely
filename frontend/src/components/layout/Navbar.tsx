import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'

const NAV_LINKS = [
  { key: 'about', href: '#about' },
  { key: 'menu', href: '#menu' },
  { key: 'events', href: '#events' },
  { key: 'gallery', href: '#gallery' },
  { key: 'reviews', href: '#reviews' },
  { key: 'reservation', href: '#reservation' },
  { key: 'contact', href: '#contact' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState(i18n.language)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLang = () => {
    const next = lang === 'hu' ? 'en' : 'hu'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
    setLang(next)
  }

  const handleNav = (href: string) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-pub-black/95 backdrop-blur-md shadow-2xl shadow-black/50 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="flex items-center group opacity-85 hover:opacity-100 transition-opacity">
          <img src="/logo.png" alt="Törzshely logó" className="h-16 w-auto" />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <button key={link.key} onClick={() => handleNav(link.href)}
              className="text-pub-cream/70 hover:text-pub-teal transition-colors duration-300 text-xs uppercase tracking-widest font-medium">
              {t(`nav.${link.key}`)}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button onClick={toggleLang}
            className="text-xs font-display tracking-widest text-pub-cream/60 hover:text-pub-gold transition-colors border border-pub-cream/20 px-3 py-1.5 hover:border-pub-gold">
            {lang === 'hu' ? 'EN' : 'HU'}
          </button>

          {/* Reservation CTA */}
          <button onClick={() => handleNav('#reservation')}
            className="hidden md:block btn-primary text-xs py-2.5 px-6">
            {t('nav.reservation')}
          </button>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-pub-gold">
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${open ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="bg-pub-dark/98 backdrop-blur-md border-t border-pub-gold/20 px-4 py-6 space-y-4">
          {NAV_LINKS.map(link => (
            <button key={link.key} onClick={() => handleNav(link.href)}
              className="block w-full text-left text-pub-cream/80 hover:text-pub-gold py-2 text-sm uppercase tracking-widest font-medium transition-colors">
              {t(`nav.${link.key}`)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

