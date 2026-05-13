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
           className="flex items-center gap-3 group">
          <LogoMark />
          <div className="hidden sm:block">
            <div className="font-display text-pub-gold text-xl tracking-widest leading-none group-hover:text-pub-gold-light transition-colors">
              TÖRZSHELY
            </div>
            <div className="font-display text-pub-cream/60 text-xs tracking-[0.4em]">XVI</div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <button key={link.key} onClick={() => handleNav(link.href)}
              className="text-pub-cream/70 hover:text-pub-gold transition-colors duration-300 text-xs uppercase tracking-widest font-medium">
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

function LogoMark() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0">
      <circle cx="22" cy="22" r="20" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
      <circle cx="22" cy="22" r="17" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
      <text x="22" y="20" textAnchor="middle" fontFamily="Cinzel, serif"
            fontSize="7" fill="#c9a84c" letterSpacing="2">TÖRZS</text>
      <text x="22" y="29" textAnchor="middle" fontFamily="Cinzel, serif"
            fontSize="6" fill="#c9a84c" letterSpacing="2">HELY 16</text>
      {/* Decorative wheat on sides */}
      <line x1="4" y1="22" x2="10" y2="22" stroke="#c9a84c" strokeWidth="0.5" />
      <line x1="34" y1="22" x2="40" y2="22" stroke="#c9a84c" strokeWidth="0.5" />
    </svg>
  )
}
