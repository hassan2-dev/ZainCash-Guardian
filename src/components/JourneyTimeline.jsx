import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import { Bi } from './Bi'

const LABELS = {
  understood: { ar: 'فهم الطلب', en: 'Understood' },
  validate: { ar: 'التحقق من البيانات', en: 'Data validated' },
  ambiguity: { ar: 'اكتشاف الغموض', en: 'Ambiguity check' },
  summary: { ar: 'ملخص العملية', en: 'Summary' },
  confirm: { ar: 'تأكيد المستخدم', en: 'User confirm' },
  auth: { ar: 'المصادقة', en: 'Authentication' },
  execute: { ar: 'تنفيذ وهمي', en: 'Demo execute' },
  receipt: { ar: 'الإيصال', en: 'Receipt' },
}

export default function JourneyTimeline({ steps = [] }) {
  if (!steps.length) {
    return (
      <div className="glass hidden rounded-2xl p-4 lg:block">
        <Bi
          ar="مسار الرحلة"
          en="Journey Timeline"
          className="font-en text-xs font-semibold tracking-wide uppercase"
          size="sm"
        />
        <p className="font-ar mt-3 text-xs text-[var(--color-mist)]" dir="rtl">
          سيظهر هنا تقدم العملية خطوة بخطوة.
        </p>
        <p className="font-en mt-1 text-xs text-[var(--color-mist)]/75" dir="ltr">
          Step-by-step progress will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-3.5 sm:p-4">
      <Bi
        ar="مسار الرحلة"
        en="Journey Timeline"
        className="mb-3 font-en text-xs font-semibold tracking-wide uppercase"
        size="sm"
      />

      {/* Mobile: horizontal chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {steps.map((step) => {
          const label = LABELS[step.id]
          return (
            <div
              key={step.id}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] ${
                step.done
                  ? 'border-[var(--color-teal)]/40 bg-[var(--color-teal)]/10 text-[var(--color-foam)]'
                  : 'border-[var(--color-line)] text-[var(--color-mist)]'
              }`}
            >
              {step.done ? (
                <Check className="h-3 w-3 text-[var(--color-teal)]" />
              ) : (
                <Circle className="h-3 w-3 opacity-40" />
              )}
              <span className="font-ar whitespace-nowrap">{label?.ar || step.label}</span>
            </div>
          )
        })}
      </div>

      {/* Desktop: vertical list */}
      <ol className="hidden space-y-2.5 lg:block">
        {steps.map((step, i) => {
          const label = LABELS[step.id]
          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2.5 text-sm"
            >
              {step.done ? (
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-teal)]/20 text-[var(--color-teal)]">
                  <Check className="h-3 w-3" />
                </span>
              ) : (
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[var(--color-mist)]/50">
                  <Circle className="h-3 w-3" />
                </span>
              )}
              <span className={step.done ? 'text-[var(--color-foam)]' : 'text-[var(--color-mist)]'}>
                {label ? (
                  <Bi ar={label.ar} en={label.en} size="sm" stack={false} />
                ) : (
                  step.label
                )}
              </span>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
