import { defineStore } from 'pinia'
import i18n from '../i18n'

const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const readLocale = () => (canUseStorage ? localStorage.getItem('user-locale') || 'vi' : 'vi')

export const useLanguageStore = defineStore('language', {
  state: () => ({
    locale: readLocale(),
    availableLanguages: [
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'jp', name: '日本語', flag: '🇯🇵' }
    ]
  }),
  actions: {
    setLanguage(newLocale) {
      this.locale = newLocale
      i18n.global.locale.value = newLocale
      if (canUseStorage) {
        localStorage.setItem('user-locale', newLocale)
      }
      
      // Update HTML lang attribute for SEO/Accessibility
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', newLocale)
      }
    }
  },
  getters: {
    currentLanguage: (state) => state.availableLanguages.find(l => l.code === state.locale)
  }
})
