import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ScanFace, Check, X } from 'lucide-react'
import { Bi, useT } from './Bi'

export default function FaceIdSimulation({ onSuccess, onFailure, loading }) {
  const [scanning, setScanning] = useState(true)
  const t = useT()

  useEffect(() => {
    const tmr = setTimeout(() => setScanning(false), 1800)
    return () => clearTimeout(tmr)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 text-center sm:rounded-3xl sm:p-8"
    >
      <div className="mb-1 font-en text-xs tracking-widest text-[var(--color-mist)] uppercase">
        Confirm Your Identity
      </div>
      <h2 className="text-lg font-bold text-[var(--color-foam)] sm:text-xl">
        <Bi ar="مصادقة آمنة" en="Secure Authentication" />
      </h2>
      <p className="mt-2 text-xs text-[var(--color-mist)]">
        {t(
          'محاكاة Face ID — المتصفح لا يوفّر Face ID حقيقيًا',
          'Face ID simulation — browsers don’t expose real Face ID',
        )}
      </p>

      <div className="relative mx-auto mt-6 flex h-28 w-28 items-center justify-center sm:mt-8 sm:h-36 sm:w-36">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[var(--color-brand)]/30"
          animate={scanning ? { scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
          transition={{ duration: 1.4, repeat: scanning ? Infinity : 0 }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border border-dashed border-[var(--color-brand-purple)]/50"
          animate={scanning ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 4, ease: 'linear', repeat: scanning ? Infinity : 0 }}
        />
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-panel)] sm:h-20 sm:w-20">
          {scanning ? (
            <ScanFace className="h-8 w-8 text-[var(--color-brand)] sm:h-10 sm:w-10" />
          ) : (
            <Check className="h-8 w-8 text-[var(--color-ok)] sm:h-10 sm:w-10" />
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-[var(--color-mist)]">
        {scanning ? (
          <Bi ar="جارٍ التحقق من هويتك…" en="Verifying your identity…" />
        ) : (
          <Bi ar="جاهز للمحاكاة — اختر النتيجة" en="Ready — choose a simulation result" />
        )}
      </div>

      {!scanning && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={loading}
            onClick={onSuccess}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-ok)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            <Check className="h-4 w-4" />
            <Bi ar="نجاح" en="Simulate Success" />
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onFailure}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-rose)]/40 bg-[var(--color-rose)]/10 px-4 py-3 text-sm font-semibold text-[var(--color-rose)]"
          >
            <X className="h-4 w-4" />
            <Bi ar="فشل" en="Simulate Failure" />
          </button>
        </div>
      )}
    </motion.div>
  )
}
