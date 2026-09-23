import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mic,
  Brain,
  Shield,
  ScanFace,
  Receipt,
  ArrowLeft,
  ArrowRight,
  Layers,
  GitBranch,
} from 'lucide-react'
import { Bi, BiTitle, useT } from '../components/Bi'
import { useLangStore } from '../store/langStore'

const STEPS = [
  {
    icon: Mic,
    ar: 'ماذا قال المستخدم؟',
    en: 'What did the user say?',
    arDesc: 'Web Speech API أو كتابة — مع موجات صوتية وحالات استماع.',
    enDesc: 'Web Speech API or typing — with waveforms and listening states.',
  },
  {
    icon: Brain,
    ar: 'ماذا فهم النظام؟',
    en: 'What did the system understand?',
    arDesc: 'محرك أوامر حتمي يحاكي الذكاء الاصطناعي بدون API خارجي.',
    enDesc: 'A deterministic command engine that feels like AI — no external API.',
  },
  {
    icon: Layers,
    ar: 'ماذا تحقق منه؟',
    en: 'What was verified?',
    arDesc: 'المستلم، المبلغ، الفاتورة، الرصيد، والغموض (مثل عدة «أحمد»).',
    enDesc: 'Recipient, amount, bill, balance, and ambiguity (e.g. two Ahmeds).',
  },
  {
    icon: Shield,
    ar: 'متى طلب التأكيد؟',
    en: 'When was confirmation requested?',
    arDesc: 'شاشة مراجعة + طبقة Guardian Security قبل أي تنفيذ.',
    enDesc: 'Review screen + Guardian Security Layer before any execution.',
  },
  {
    icon: ScanFace,
    ar: 'متى طلب المصادقة؟',
    en: 'When was authentication requested?',
    arDesc: 'محاكاة Face ID مع نجاح/فشل — بلا ادعاء بيومتري حقيقي.',
    enDesc: 'Face ID simulation with success/failure — no real biometrics claimed.',
  },
  {
    icon: Receipt,
    ar: 'كيف صدر الإيصال؟',
    en: 'How was the receipt issued?',
    arDesc: 'معاملة وهمية، Idempotency Key، وسجل في localStorage.',
    enDesc: 'Synthetic transaction, idempotency key, and localStorage history.',
  },
]

export default function About() {
  const t = useT()
  const lang = useLangStore((s) => s.lang)
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <div className="mx-auto max-w-3xl section-pad pb-16 sm:pb-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold sm:text-3xl">
          <BiTitle ar="عن المشروع" en="About the project" />
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-mist)] sm:text-base">
          {t(
            'ZainCash Guardian نموذج تفاعلي مبني بـ React فقط — بدون Backend وبدون معاملات مالية حقيقية. الهدف إظهار رحلة الدفع الآمن بالصوت للهجة العراقية بشكل سينمائي وصادق تقنيًا.',
            'ZainCash Guardian is an interactive product demo built with React only — no backend and no real payments. It shows a cinematic, technically honest safe-payment journey for Iraqi dialect voice commands.',
          )}
        </p>
      </motion.div>

      <Link
        to="/journey"
        className="glass mt-8 flex items-center gap-4 rounded-2xl border border-[var(--color-brand)]/30 p-4 transition hover:border-[var(--color-brand)]/60 sm:p-5"
      >
        <span className="zain-mark flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white">
          <GitBranch className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[var(--color-foam)]">
            <Bi ar="فلو تشارت رحلة Guardian" en="Guardian Journey Flowchart" />
          </div>
          <p className="mt-1 text-sm text-[var(--color-mist)]">
            {t(
              '4 طبقات · AI Agent · Security Gate · مسارات الفشل',
              '4 layers · AI Agent · Security Gate · Failure paths',
            )}
          </p>
        </div>
        <Arrow className="h-5 w-5 shrink-0 text-[var(--color-brand)]" />
      </Link>

      <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.en}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i }}
            className="glass flex gap-3 rounded-2xl p-3.5 sm:gap-4 sm:p-4"
          >
            <span className="zain-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
              <s.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-semibold text-[var(--color-foam)]">
                <Bi ar={s.ar} en={s.en} />
              </h2>
              <p className="mt-1.5 text-sm text-[var(--color-mist)]">
                {t(s.arDesc, s.enDesc)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass mt-8 rounded-2xl p-4 text-sm leading-relaxed text-[var(--color-mist)] sm:mt-10 sm:p-5">
        <p className="font-semibold text-[var(--color-foam)]">
          <Bi ar="التقنيات" en="Tech stack" />
        </p>
        <p className="font-en mt-2 text-xs sm:text-sm" dir="ltr">
          React + Vite · Tailwind CSS · Framer Motion · Lucide · Zustand · Web Speech API ·
          Web Audio API · localStorage · Sonner
        </p>
      </div>

      <Link
        to="/demo"
        className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-3 text-sm font-bold text-white"
      >
        {t('ابدأ التجربة', 'Start Demo')}
        <Arrow className="h-4 w-4" />
      </Link>
    </div>
  )
}
