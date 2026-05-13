import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookies_accepted')) {
      setTimeout(() => setVisible(true), 2000)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookies_accepted', 'true')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('cookies_accepted', 'false')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50
                    bg-pub-dark border border-pub-teal/40 shadow-2xl shadow-black/60 p-6
                    animate-[fadeUp_0.5s_ease_forwards]">
      <h3 className="font-serif text-pub-teal text-lg mb-2">{t('cookie.title')}</h3>
      <p className="text-pub-cream/70 text-sm mb-5 leading-relaxed">{t('cookie.text')}</p>
      <div className="flex gap-3">
        <button onClick={accept} className="btn-primary text-xs py-2.5 px-6 flex-1 justify-center">
          {t('cookie.accept')}
        </button>
        <button onClick={reject}
          className="text-pub-cream/40 hover:text-pub-cream/70 text-xs px-4 transition-colors">
          {t('cookie.reject')}
        </button>
      </div>
    </div>
  )
}
