import { Shield } from 'lucide-react'

export default function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(7,11,20,0.92)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-0.5 px-3 py-2 text-center sm:flex-row sm:gap-2 sm:px-4">
        <Shield className="hidden h-3.5 w-3.5 shrink-0 text-[var(--color-amber)] sm:block" />
        <p className="font-en text-[10px] leading-snug text-[var(--color-mist)] sm:text-xs" dir="ltr">
          Interactive Prototype — Synthetic Data — No Real Transactions
        </p>
        <span className="hidden opacity-30 sm:inline" aria-hidden>
          |
        </span>
        <p className="font-ar text-[10px] leading-snug text-[var(--color-mist)] sm:text-xs" dir="rtl">
          نموذج تفاعلي — بيانات وهمية — بدون معاملات حقيقية
        </p>
      </div>
    </div>
  )
}
