import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import api from '../../services/api'
import type { GalleryPhoto } from '../../types'

const STATIC_PHOTOS = [
  { imageUrl: '/photos/657748630_122132045445111926_5015930608990045577_n.jpg', category: 'interior' },
  { imageUrl: '/photos/648245398_122129016117111926_4537042826914534387_n.jpg', category: 'terrace' },
  { imageUrl: '/photos/645693343_122128225803111926_4050518629999670733_n.jpg', category: 'drinks' },
  { imageUrl: '/photos/671192556_122135046723111926_1132283216449589304_n.jpg', category: 'drinks' },
  { imageUrl: '/photos/643897434_122128225809111926_8833501543185936125_n.jpg', category: 'terrace' },
  { imageUrl: '/photos/619109643_122120836947111926_4307331769678460120_n.jpg', category: 'interior' },
  { imageUrl: '/photos/599929660_122113973655111926_2568087792070108088_n.jpg', category: 'events' },
  { imageUrl: '/photos/663229870_122133965895111926_3643572408645343999_n.jpg', category: 'events' },
  { imageUrl: '/photos/666592162_122134210233111926_2185519966032846101_n.jpg', category: 'food' },
  { imageUrl: '/photos/685135234_122137843485111926_4657781724645680364_n.jpg', category: 'interior' },
  { imageUrl: '/photos/672675353_122136030957111926_6416734075216765865_n.jpg', category: 'drinks' },
  { imageUrl: '/photos/670316871_122135036253111926_2890664842676837498_n.jpg', category: 'events' },
]

const CATEGORIES = ['all', 'interior', 'terrace', 'drinks', 'food', 'events']

export default function GallerySection() {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [filter, setFilter] = useState('all')
  const [lightboxIdx, setLightboxIdx] = useState(-1)
  const titleRef = useScrollAnimation()

  useEffect(() => {
    api.get<GalleryPhoto[]>('/gallery').then(r => {
      if (r.data.length > 0) setPhotos(r.data)
      else setPhotos(STATIC_PHOTOS.map((p, i) => ({ id: i, ...p, active: true })))
    }).catch(() => {
      setPhotos(STATIC_PHOTOS.map((p, i) => ({ id: i, ...p, active: true })))
    })
  }, [])

  const filtered = useMemo(() =>
    filter === 'all' ? photos : photos.filter(p => p.category === filter),
    [photos, filter]
  )

  const slides = filtered.map(p => ({ src: p.imageUrl }))

  return (
    <section id="gallery" className="py-24 md:py-32 bg-pub-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="section-title">{t('gallery.title')}</h2>
          <p className="section-subtitle">{t('gallery.subtitle')}</p>
          <div className="gold-divider" />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`text-xs font-display tracking-widest uppercase px-5 py-2 transition-all duration-300
                         border ${filter === cat
                          ? 'text-pub-black border-pub-teal'
                          : 'border-pub-teal/30 text-pub-cream/60 hover:border-pub-teal hover:text-pub-teal'}`}
              style={filter === cat ? { backgroundColor: '#5e909c' } : undefined}>
              {t(`gallery.categories.${cat}`)}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((photo, idx) => (
            <GalleryItem key={photo.id} photo={photo} idx={idx}
                         onClick={() => setLightboxIdx(idx)} />
          ))}
        </div>
      </div>

      <Lightbox
        open={lightboxIdx >= 0}
        close={() => setLightboxIdx(-1)}
        slides={slides}
        index={lightboxIdx}
        styles={{ container: { backgroundColor: 'rgba(13,8,4,0.98)' } }}
      />
    </section>
  )
}

function GalleryItem({ photo, idx, onClick }: {
  photo: GalleryPhoto; idx: number; onClick: () => void
}) {
  const ref = useScrollAnimation()

  return (
    <div ref={ref} className="break-inside-avoid mb-3 cursor-pointer group overflow-hidden relative"
         style={{ transitionDelay: `${(idx % 8) * 0.05}s` }}
         onClick={onClick}>
      <img src={photo.imageUrl} alt={photo.captionHu || 'Törzshely 16'}
           className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
           loading="lazy" />
      <div className="absolute inset-0 bg-pub-teal/0 group-hover:bg-pub-teal/25 transition-all duration-500
                      flex items-center justify-center">
        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-3xl">+</span>
      </div>
    </div>
  )
}
