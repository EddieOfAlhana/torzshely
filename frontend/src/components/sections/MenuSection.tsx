import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import api from '../../services/api'
import type { MenuCategory } from '../../types'

export default function MenuSection() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [activeTab, setActiveTab] = useState<'food' | 'drink'>('food')
  const titleRef = useScrollAnimation()
  const isHu = i18n.language === 'hu'

  useEffect(() => {
    api.get<MenuCategory[]>('/menu/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  const filtered = categories.filter(c => c.type === activeTab)

  return (
    <section id="menu" className="py-24 md:py-32 bg-pub-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="section-title">{t('menu.title')}</h2>
          <p className="section-subtitle">{t('menu.subtitle')}</p>
          <div className="gold-divider" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex border border-pub-teal/30">
            <button onClick={() => setActiveTab('food')}
              className={`px-8 py-3 text-sm font-display tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'food'
                  ? 'bg-pub-teal text-pub-black'
                  : 'text-pub-cream/60 hover:text-pub-teal'
              }`}>
              {t('menu.food')}
            </button>
            <button onClick={() => setActiveTab('drink')}
              className={`px-8 py-3 text-sm font-display tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'drink'
                  ? 'bg-pub-teal text-pub-black'
                  : 'text-pub-cream/60 hover:text-pub-teal'
              }`}>
              {t('menu.drinks')}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map(cat => (
            <MenuCategoryBlock key={cat.id} category={cat} isHu={isHu} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MenuCategoryBlock({ category, isHu }: { category: MenuCategory; isHu: boolean }) {
  const { t } = useTranslation()
  const ref = useScrollAnimation()

  return (
    <div ref={ref} className="border border-pub-teal/10 p-6 hover:border-pub-teal/30 transition-colors duration-500">
      <h3 className="font-display text-pub-teal text-sm tracking-[0.3em] uppercase mb-6 pb-3 border-b border-pub-teal/20">
        {isHu ? category.nameHu : (category.nameEn || category.nameHu)}
      </h3>
      <div className="space-y-4">
        {category.items?.map(item => (
          <div key={item.id}
               className="group flex items-start justify-between gap-4 py-3 border-b border-pub-cream/5
                          hover:border-pub-teal/20 transition-colors duration-300">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-pub-cream font-medium group-hover:text-pub-teal transition-colors duration-300">
                  {isHu ? item.nameHu : (item.nameEn || item.nameHu)}
                </span>
                {item.featured && (
                  <span className="text-[10px] text-pub-gold border border-pub-teal/40 px-1.5 py-0.5 tracking-wider">★</span>
                )}
              </div>
              {(isHu ? item.descriptionHu : item.descriptionEn) && (
                <p className="text-pub-cream/40 text-xs mt-1 leading-relaxed">
                  {isHu ? item.descriptionHu : item.descriptionEn}
                </p>
              )}
            </div>
            {item.priceHuf && (
              <div className="text-right flex-shrink-0">
                <span className="font-display text-pub-teal text-sm whitespace-nowrap">
                  {item.priceHuf.toLocaleString('hu-HU')} {t('menu.huf')}
                </span>
                {item.priceNote && (
                  <div className="text-pub-cream/30 text-xs">{item.priceNote}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
