import { motion } from 'framer-motion'
import { Bi } from './Bi'

export default function VoiceConfidence({ data }) {
  if (!data) return null

  const pct = data.score
  const color =
    data.level === 'high'
      ? 'var(--color-ok)'
      : data.level === 'medium'
        ? 'var(--color-amber)'
        : 'var(--color-rose)'

  const levelAr =
    data.level === 'high' ? 'عالية' : data.level === 'medium' ? 'متوسطة' : 'منخفضة'
  const levelEn =
    data.level === 'high' ? 'High' : data.level === 'medium' ? 'Medium' : 'Low'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 sm:p-5"
    >
      <Bi
        ar="فحص ثقة الصوت"
        en="Voice Confidence Check"
        className="font-en text-xs tracking-widest uppercase"
        size="sm"
      />
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 h-3 overflow-hidden rounded-full bg-[var(--color-ink)]/50">
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-xs text-[var(--color-mist)]">
            <span>
              <span className="font-ar" dir="rtl">
                إشارة صوتية {data.signalDetected ? 'مكتشفة' : 'غير موجودة'}
              </span>
              <span className="mx-1 opacity-30">/</span>
              <span className="font-en" dir="ltr">
                Voice signal {data.signalDetected ? 'detected' : 'missing'}
              </span>
            </span>
            <span className="font-en font-semibold" style={{ color }}>
              {pct}% · {levelEn} / {levelAr}
            </span>
          </div>
        </div>
      </div>
      <ul className="mt-3 space-y-1 text-xs text-[var(--color-mist)]">
        <li className="font-en" dir="ltr">Anti-spoofing: {data.antiSpoofing}</li>
        <li className="font-en" dir="ltr">Device trust: {data.deviceTrust}</li>
      </ul>
      <p className="font-ar mt-3 text-sm leading-relaxed text-[var(--color-foam)]" dir="rtl">
        {data.message}
      </p>
      <p className="font-en mt-2 text-[11px] text-[var(--color-mist)]/80" dir="ltr">
        Illustrative simulation only — not real voice biometrics.
      </p>
      <p className="font-ar mt-1 text-[11px] text-[var(--color-mist)]/80" dir="rtl">
        هذه محاكاة توضيحية وليست نظام تحقق صوتي حقيقيًا.
      </p>
    </motion.div>
  )
}
