import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-pub-dark border-t border-pub-gold/20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo + tagline */}
          <div>
            <div className="font-display text-pub-gold text-2xl tracking-widest mb-2">TÖRZSHELY 16</div>
            <p className="text-pub-cream/50 text-sm italic font-serif">{t('footer.tagline')}</p>
            <div className="w-12 h-px bg-pub-gold/40 my-4" />
            <p className="text-pub-cream/40 text-xs">
              Thököly út 7/b, 1163 Budapest
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-pub-gold/60 text-xs tracking-[0.4em] uppercase mb-6">Menü</h4>
            <div className="space-y-3">
              {['#about', '#menu', '#events', '#gallery', '#reservation', '#contact'].map(href => (
                <a key={href} href={href}
                   className="block text-pub-cream/50 hover:text-pub-gold text-sm transition-colors">
                  {href.replace('#', '').charAt(0).toUpperCase() + href.slice(2)}
                </a>
              ))}
            </div>
          </div>

          {/* Contact quick */}
          <div>
            <h4 className="font-display text-pub-gold/60 text-xs tracking-[0.4em] uppercase mb-6">Kapcsolat</h4>
            <div className="space-y-3 text-pub-cream/50 text-sm">
              <div>📞 +36 30 383 9818</div>
              <div>✉️ torzshely16@gmail.com</div>
              <div className="flex gap-3 mt-6">
                <a href="https://facebook.com/torzshely16" target="_blank" rel="noopener noreferrer"
                   className="text-pub-cream/40 hover:text-pub-gold transition-colors text-xs font-display tracking-widest uppercase">
                  Facebook
                </a>
                <span className="text-pub-cream/20">|</span>
                <a href="https://instagram.com/torzshely16" target="_blank" rel="noopener noreferrer"
                   className="text-pub-cream/40 hover:text-pub-gold transition-colors text-xs font-display tracking-widest uppercase">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-pub-cream/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-pub-cream/30 text-xs">{t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <a href="/adatkezeles" className="text-pub-teal/50 hover:text-pub-teal text-xs transition-colors">
              Adatkezelési tájékoztató
            </a>
            <span className="text-pub-cream/10">|</span>
            <a href="/admin/login" className="text-pub-cream/20 hover:text-pub-cream/40 text-xs transition-colors">
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
