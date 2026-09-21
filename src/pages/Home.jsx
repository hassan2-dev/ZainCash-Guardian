import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Mic, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import { useGuardianStore } from '../store/guardianStore'
import { useLangStore } from '../store/langStore'
import { EXAMPLE_COMMANDS } from '../engine/demoScenarios'
import { Bi, useT } from '../components/Bi'

export default function Home() {
  const balance = useGuardianStore((s) => s.balance)
  const lang = useLangStore((s) => s.lang)
  const t = useT()
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <div>
      <section className="relative mx-auto flex min-h-[calc(100dvh-7rem)] max-w-6xl flex-col justify-center section-pad pb-12 pt-4 sm:min-h-[calc(100vh-8rem)] sm:pb-16 sm:pt-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] overflow-hidden" aria-hidden>
          <motion.div
            className="absolute left-1/2 top-4 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(207,0,114,0.35),transparent_65%)] sm:top-8 sm:h-[420px] sm:w-[420px]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 text-[var(--color-brand)] sm:mb-5"
          >
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span className="font-en text-xs font-semibold tracking-[0.16em] uppercase sm:text-sm">
              ZainCash Guardian
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`hero-title font-extrabold text-[var(--color-foam)] ${lang === 'en' ? 'font-en' : 'font-ar'}`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            lang={lang}
          >
            {lang === 'ar' ? (
              <>
                فلوسك تستحق
                <br />
                لحظة تحقق.
              </>
            ) : (
              <>
                Your money deserves
                <br />
                a second thought.
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-3 text-lg font-semibold text-[var(--color-brand)] sm:mt-4 sm:text-2xl"
          >
            {lang === 'ar' ? 'Your money deserves a second thought.' : 'فلوسك تستحق لحظة تحقق.'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-mist)] sm:text-base"
          >
            {t(
              'تجربة تفاعلية: تكلم أو اكتب باللهجة العراقية، وشاهد رحلة الدفع الآمن من الفهم حتى الإيصال — بدون معاملات حقيقية.',
              'An interactive demo: speak or type in Iraqi dialect, then watch the safe-payment journey — from understanding to receipt — with no real money.',
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
          >
            <Link
              to="/demo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--color-brand-hover)]"
            >
              {t('ابدأ التجربة', 'Start Demo')}
              <Arrow className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] px-5 py-3.5 text-sm text-[var(--color-mist)] transition hover:border-[var(--color-brand)]/40"
            >
              {t('كيف يعمل؟', 'How it works')}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="relative z-10 mt-10 grid gap-3 sm:mt-14 sm:grid-cols-3"
        >
          <div className="glass flex items-center gap-3 rounded-2xl p-3.5 sm:p-4">
            <Wallet className="h-5 w-5 shrink-0 text-[var(--color-amber)]" />
            <div className="min-w-0">
              <div className="text-xs text-[var(--color-mist)]">
                <Bi ar="رصيد تجريبي" en="Demo balance" />
              </div>
              <div className="font-en mt-0.5 font-semibold tabular-nums">
                {balance.toLocaleString('en-IQ')} <span className="text-sm">IQD</span>
              </div>
            </div>
          </div>
          <div className="glass flex items-center gap-3 rounded-2xl p-3.5 sm:p-4">
            <Mic className="h-5 w-5 shrink-0 text-[var(--color-brand)]" />
            <div>
              <div className="text-xs text-[var(--color-mist)]">
                <Bi ar="الصوت" en="Voice" />
              </div>
              <div className="font-en mt-0.5 font-semibold">Web Speech API</div>
            </div>
          </div>
          <div className="glass flex items-center gap-3 rounded-2xl p-3.5 sm:p-4">
            <Sparkles className="h-5 w-5 shrink-0 text-[var(--color-brand-purple)]" />
            <div>
              <div className="text-xs text-[var(--color-mist)]">
                <Bi ar="المحرك" en="Engine" />
              </div>
              <div className="font-en mt-0.5 font-semibold">Deterministic Demo AI</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl section-pad pb-16 sm:pb-20">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-mist)]">
          <Bi ar="أمثلة أوامر" en="Example commands" />
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_COMMANDS.map((cmd) => (
            <Link
              key={cmd}
              to="/demo"
              state={{ preset: cmd }}
              className="font-ar rounded-full border border-[var(--color-line)] bg-[var(--color-panel)]/60 px-3.5 py-2 text-xs text-[var(--color-foam)] transition hover:border-[var(--color-brand)]/50 sm:px-4 sm:text-sm"
            >
              «{cmd}»
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
