import { motion } from 'framer-motion'
import { Bi, useT } from './Bi'

export default function VoiceConfidence({ data }) {
  const t = useT()
  if (!data) return null

  const pct = data.score
  const color =
    data.level === 'high'
      ? 'var(--color-ok)'
      : data.level === 'medium'
        ? 'var(--color-amber)'
        : 'var(--color-rose)'

  const levelLabel = t(
    data.level === 'high' ? 'عالية' : data.level === 'medium' ? 'متوسطة' : 'منخفضة',
    data.level === 'high' ? 'High' : data.level === 'medium' ? 'Medium' : 'Low',
  )

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
      />
      <div className="mt-3">
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
            {t(
              `إشارة صوتية ${data.signalDetected ? 'مكتشفة' : 'غير موجودة'}`,
              `Voice signal ${data.signalDetected ? 'detected' : 'missing'}`,
            )}
          </span>
          <span className="font-en font-semibold" style={{ color }}>
            {pct}% · {levelLabel}
          </span>
        </div>
      </div>
      <ul className="mt-3 space-y-1 text-xs text-[var(--color-mist)]">
        <li className="font-en" dir="ltr">Anti-spoofing: {data.antiSpoofing}</li>
        <li className="font-en" dir="ltr">Device trust: {data.deviceTrust}</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-foam)]">{data.message}</p>
      <p className="mt-2 text-[11px] text-[var(--color-mist)]/80">
        {t(
          'هذه محاكاة توضيحية وليست نظام تحقق صوتي حقيقيًا.',
          'Illustrative simulation only — not real voice biometrics.',
        )}
      </p>
    </motion.div>
  )
}
