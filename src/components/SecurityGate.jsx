import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import { Bi } from './Bi'

const CHECKS = [
  { key: 'understood', ar: 'تم فهم الطلب', en: 'Request understood' },
  { key: 'recipient', ar: 'تم التحقق من المستلم', en: 'Recipient verified' },
  { key: 'amount', ar: 'تمت مراجعة المبلغ', en: 'Amount reviewed' },
  { key: 'confirm', ar: 'تم تأكيد المستخدم', en: 'User confirmation received' },
]

export default function SecurityGate() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass relative overflow-hidden rounded-2xl p-5 text-center sm:rounded-3xl sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,0,114,0.16),transparent_55%)]" />
      <div className="relative">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10">
          <Lock className="h-6 w-6 text-[var(--color-brand)]" />
        </div>
        <h2 className="font-en text-lg font-bold text-[var(--color-foam)] sm:text-xl">
          Guardian Security Layer
        </h2>
        <p className="mt-1 text-sm text-[var(--color-mist)]">
          <Bi ar="طبقة الحماية قبل التنفيذ" en="Security layer before execution" />
        </p>

        <ul className="mx-auto mt-6 max-w-sm space-y-3 text-start">
          {CHECKS.map((c, i) => (
            <motion.li
              key={c.key}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.25 }}
              className="flex items-center gap-3 rounded-xl bg-[var(--color-ink)]/35 px-3 py-2.5 text-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ok)]/15 text-[var(--color-ok)]">
                <Check className="h-3.5 w-3.5" />
              </span>
              <Bi ar={c.ar} en={c.en} />
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-6 text-sm text-[var(--color-amber)]"
        >
          <Bi ar="بانتظار المصادقة الآمنة" en="Awaiting secure authentication" />
        </motion.div>
      </div>
    </motion.div>
  )
}
