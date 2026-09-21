import { useLangStore } from '../store/langStore'

/**
 * Shows Arabic OR English based on the language toggle.
 */
export function Bi({ ar, en, className = '', stack = true, size = 'md' }) {
  const lang = useLangStore((s) => s.lang)
  void stack
  void size

  if (lang === 'en') {
    return (
      <span className={`font-en leading-snug ${className}`} dir="ltr" lang="en">
        {en}
      </span>
    )
  }

  return (
    <span className={`font-ar leading-snug ${className}`} dir="rtl" lang="ar">
      {ar}
    </span>
  )
}

export function BiTitle({ ar, en, className = '' }) {
  const lang = useLangStore((s) => s.lang)

  if (lang === 'en') {
    return (
      <div className={`font-en text-balance leading-tight ${className}`} dir="ltr" lang="en">
        {en}
      </div>
    )
  }

  return (
    <div className={`font-ar text-balance leading-tight ${className}`} dir="rtl" lang="ar">
      {ar}
    </div>
  )
}

/** Hook helper for inline strings */
export function useT() {
  const lang = useLangStore((s) => s.lang)
  return (ar, en) => (lang === 'ar' ? ar : en)
}
