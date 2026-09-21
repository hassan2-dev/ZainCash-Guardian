import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function applyDocumentLang(lang) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export const useLangStore = create(
  persist(
    (set, get) => ({
      lang: 'ar',
      setLang(lang) {
        applyDocumentLang(lang)
        set({ lang })
      },
      toggleLang() {
        const next = get().lang === 'ar' ? 'en' : 'ar'
        get().setLang(next)
      },
      t(ar, en) {
        return get().lang === 'ar' ? ar : en
      },
    }),
    {
      name: 'zaincash-guardian-lang',
      onRehydrateStorage: () => (state) => {
        if (state?.lang) applyDocumentLang(state.lang)
      },
    },
  ),
)
