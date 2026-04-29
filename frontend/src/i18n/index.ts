import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import vi from './locales/vi.json'
import jp from './locales/jp.json'

const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: canUseStorage ? localStorage.getItem('user-locale') || 'vi' : 'vi',
  fallbackLocale: 'en',
  messages: {
    en,
    vi,
    jp
  }
})

export default i18n
