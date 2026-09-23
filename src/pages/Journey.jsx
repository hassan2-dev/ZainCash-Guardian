import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Play } from 'lucide-react'
import JourneyFlowchart from '../components/JourneyFlowchart'
import { BiTitle, useT } from '../components/Bi'
import { useLangStore } from '../store/langStore'

export default function Journey() {
  const t = useT()
  const lang = useLangStore((s) => s.lang)
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <div className="mx-auto max-w-6xl section-pad pb-16 sm:pb-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <BiTitle ar="خريطة رحلة Guardian" en="Guardian Journey Map" />
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-mist)] sm:text-base">
          {t(
            'فلو تشارت تفاعلي يوضح أين يدخل الذكاء الاصطناعي وأين تدخل طبقة الحماية — جاهز لعرض اللجنة.',
            'An interactive flowchart showing where AI understands intent and where the security gate decides — built for the jury.',
          )}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/demo"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-sm font-bold text-white"
          >
            <Play className="h-4 w-4" />
            {t('جرّب الرحلة', 'Try the demo')}
            <Arrow className="h-4 w-4" />
          </Link>
          <Link
            to="/about"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm text-[var(--color-mist)]"
          >
            {t('عن المشروع', 'About')}
          </Link>
        </div>
      </motion.div>

      <JourneyFlowchart />
    </div>
  )
}
