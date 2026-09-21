import { Languages } from 'lucide-react'
import { useLangStore } from '../store/langStore'

export default function LanguageToggle({ className = '' }) {
  const lang = useLangStore((s) => s.lang)
  const toggleLang = useLangStore((s) => s.toggleLang)

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`glass inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition hover:border-[var(--color-brand)]/50 ${className}`}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      title={lang === 'ar' ? 'English' : 'العربية'}
    >
      <Languages className="h-4 w-4 text-[var(--color-brand)]" />
      <span className="font-en tracking-wide" dir="ltr">
        {lang === 'ar' ? 'EN' : 'AR'}
      </span>
      <span className="hidden text-[var(--color-mist)] sm:inline">
        {lang === 'ar' ? 'English' : 'عربي'}
      </span>
    </button>
  )
}
