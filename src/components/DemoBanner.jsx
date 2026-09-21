import { Shield } from 'lucide-react'
import { useT } from './Bi'

export default function DemoBanner() {
  const t = useT()

  return (
    <div className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(18,6,24,0.94)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-3 py-2 text-center sm:px-4">
        <Shield className="hidden h-3.5 w-3.5 shrink-0 text-[var(--color-amber)] sm:block" />
        <p className="text-[10px] leading-snug text-[var(--color-mist)] sm:text-xs">
          {t(
            'نموذج تفاعلي — بيانات وهمية — بدون معاملات حقيقية',
            'Interactive Prototype — Synthetic Data — No Real Transactions',
          )}
        </p>
      </div>
    </div>
  )
}
