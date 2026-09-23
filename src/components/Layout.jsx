import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, ShieldCheck, X } from 'lucide-react'
import DemoBanner from './DemoBanner'
import LanguageToggle from './LanguageToggle'
import { Bi, useT } from './Bi'
import { useLangStore } from '../store/langStore'

const NAV = [
  { to: '/', end: true, ar: 'الرئيسية', en: 'Home' },
  { to: '/demo', ar: 'التجربة', en: 'Demo' },
  { to: '/journey', ar: 'الرحلة', en: 'Journey' },
  { to: '/about', ar: 'عن المشروع', en: 'About' },
]

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const lang = useLangStore((s) => s.lang)
  const setLang = useLangStore((s) => s.setLang)
  const t = useT()

  useEffect(() => {
    setLang(lang)
  }, [lang, setLang])

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm transition sm:px-0 sm:py-0 ${
      isActive
        ? 'text-[var(--color-brand)]'
        : 'text-[var(--color-mist)] hover:text-[var(--color-foam)]'
    }`

  return (
    <div className="bg-atmosphere min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <DemoBanner />
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 section-pad py-4 sm:py-5">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="zain-mark flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(207,0,114,0.35)]">
            <ShieldCheck className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="font-en truncate text-sm font-bold tracking-wide text-[var(--color-foam)] sm:text-base">
              ZainCash <span className="text-[var(--color-brand)]">Guardian</span>
            </div>
            <div className="truncate text-[10px] text-[var(--color-mist)] sm:text-[11px]">
              {t('تجربة الدفع الآمن', 'Safe Payment Experience')}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle className="hidden sm:inline-flex" />

          <nav className="hidden items-center gap-5 md:flex lg:gap-6">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                <Bi ar={item.ar} en={item.en} />
              </NavLink>
            ))}
          </nav>

          <LanguageToggle className="sm:hidden" />

          <button
            type="button"
            className="glass flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-foam)] md:hidden"
            aria-label={open ? t('إغلاق القائمة', 'Close menu') : t('فتح القائمة', 'Open menu')}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="glass mx-4 mb-4 rounded-2xl p-2 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <Bi ar={item.ar} en={item.en} />
            </NavLink>
          ))}
        </nav>
      )}

      <main className="w-full">{children}</main>

      <footer className="mx-auto max-w-6xl section-pad py-8 text-center text-xs text-[var(--color-mist)] sm:py-10">
        <p>
          {t(
            'ZainCash Guardian · نموذج تجريبي · بدون معاملات حقيقية',
            'ZainCash Guardian Demo · Frontend-only · No real transactions',
          )}
        </p>
      </footer>
    </div>
  )
}
