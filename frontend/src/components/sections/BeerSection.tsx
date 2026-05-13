import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const BEERS = [
  {
    name: 'Bakalár Prémium',
    abv: '4,9%',
    style: 'Czech Lager',
    description: 'Aranyszínű, hagyományos recept szerint főzött lager. Krémes habkorona, Saaz komló fűszeres keserűsége.',
    descriptionEn: 'Golden, traditionally brewed lager. Creamy white head, spicy Saaz hop bitterness.',
    color: 'from-amber-600 to-yellow-400',
    price: '900 Ft / 0,5l',
  },
  {
    name: 'Bernard Celebration',
    abv: '5,0%',
    style: 'Unpasteurized Lager',
    description: 'Pasztőrizálatlan, kézműves jellegű lager. Kenyeres, enyhe karamellás jegyekkel – szinte kézműves sör.',
    descriptionEn: 'Unpasteurized, craft-style lager. Bready, with subtle caramel notes – almost artisan.',
    color: 'from-amber-700 to-amber-400',
    price: '950 Ft / 0,5l',
  },
  {
    name: 'Különleges vendégcsap',
    abv: '–',
    style: 'Rotáló vendégcsap',
    description: 'Rendszeresen változó különleges sörök. Kérdezd a csapost a mai ajánlatról!',
    descriptionEn: 'Rotating guest tap with special beers. Ask the bartender for today\'s offering!',
    color: 'from-pub-brown to-pub-gold',
    price: 'Aktuális ártól',
  },
]

export default function BeerSection() {
  const titleRef = useScrollAnimation()

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Parallax background */}
      <div className="parallax-bg absolute inset-0"
           style={{ backgroundImage: 'url(/generated/beer-bg.jpg)' }}>
        <div className="absolute inset-0 bg-pub-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <div className="font-display text-pub-gold/50 text-sm tracking-[0.5em] uppercase mb-3">
            Sör kisokos
          </div>
          <h2 className="section-title">Csapolt söreink</h2>
          <p className="section-subtitle">A kerületben egyedülálló kínálat</p>
          <div className="gold-divider" />
        </div>

        {/* Beer cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {BEERS.map((beer, i) => (
            <BeerCard key={beer.name} beer={beer} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BeerCard({ beer, delay }: { beer: typeof BEERS[0], delay: number }) {
  const ref = useScrollAnimation()

  return (
    <div ref={ref} className="group relative overflow-hidden border border-pub-gold/20 hover:border-pub-gold/60
                              transition-all duration-500 hover:shadow-2xl hover:shadow-pub-gold/20"
         style={{ transitionDelay: `${delay}s` }}>
      {/* Beer glass visual */}
      <div className={`h-48 bg-gradient-to-b ${beer.color} flex items-end justify-center pb-4 relative overflow-hidden`}>
        <div className="absolute top-0 left-0 right-0 h-8 bg-white/20 rounded-b-full" />
        {/* Bubbles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute bottom-0 w-1 h-1 rounded-full bg-white/40"
               style={{
                 left: `${20 + i * 13}%`,
                 animation: `rise ${1 + i * 0.3}s ${i * 0.2}s ease-in infinite`,
               }} />
        ))}
        <div className="text-center">
          <div className="font-display text-pub-black text-3xl font-bold">{beer.abv}</div>
          <div className="text-pub-black/70 text-xs uppercase tracking-widest">{beer.style}</div>
        </div>
      </div>

      <div className="p-6 bg-pub-dark">
        <h3 className="font-serif text-pub-gold text-xl mb-3">{beer.name}</h3>
        <p className="text-pub-cream/60 text-sm leading-relaxed mb-4">{beer.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-pub-gold/20">
          <span className="font-display text-pub-gold-light text-sm tracking-wider">{beer.price}</span>
          <span className="text-pub-cream/40 text-xs">csapolt</span>
        </div>
      </div>

      <style>{`
        @keyframes rise {
          0%   { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(-180px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
