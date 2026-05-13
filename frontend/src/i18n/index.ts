import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import hu from './hu'
import en from './en'

i18n.use(initReactI18next).init({
  resources: {
    hu: { translation: hu },
    en: { translation: en },
  },
  lng: localStorage.getItem('lang') || 'hu',
  fallbackLng: 'hu',
  interpolation: { escapeValue: false },
})

export default i18n
