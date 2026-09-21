import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mic, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import { useGuardianStore } from '../store/guardianStore'
import { EXAMPLE_COMMANDS } from '../engine/demoScenarios'
import { Bi } from '../components/Bi'

export default function Home() {
  const balance = useGuardianStore((s) => s.balance)

  return (
    <div>
      <section className="relative mx-auto flex min-h-[calc(100dvh-7rem)] max-w-6xl flex-col justify-center section-pad pb-12 pt-4 sm:min-h-[calc(100vh-8rem)] sm:pb-16 sm:pt-6">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%] overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="absolute left-1/2 top-4 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.22),transparent_65%)] sm:top-8 sm:h-[420px] sm:w-[420px]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 text-[var(--color-teal)] sm:mb-5"
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
            className="font-en hero-title font-extrabold text-[var(--color-foam)]"
            dir="ltr"
            lang="en"
          >
            Your money deserves
            <br />
            a second thought.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-ar mt-3 text-lg font-semibold text-[var(--color-teal)] sm:mt-4 sm:text-2xl"
            dir="rtl"
            lang="ar"
          >
            فلوسك تستحق لحظة تحقق.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 max-w-xl space-y-2"
          >
            <p className="font-ar text-sm leading-relaxed text-[var(--color-mist)] sm:text-base" dir="rtl">
              تجربة تفاعلية: تكلم أو اكتب باللهجة العراقية، وشاهد رحلة الدفع الآمن من الفهم حتى الإيصال — بدون معاملات حقيقية.
            </p>
            <p className="font-en text-sm leading-relaxed text-[var(--color-mist)]/80 sm:text-[0.95rem]" dir="ltr">
              An interactive demo: speak or type in Iraqi dialect, then watch the safe-payment journey — from understanding to receipt — with no real money.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-7 flex flex-col gap-2.5 xs:flex-row sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
          >
            <Link
              to="/demo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-teal)] px-6 py-3.5 text-sm font-bold text-[var(--color-ink)] transition hover:bg-[var(--color-teal-dim)]"
            >
              <span className="font-ar">ابدأ التجربة</span>
              <span className="opacity-40">/</span>
              <span className="font-en">Start Demo</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] px-5 py-3.5 text-sm text-[var(--color-mist)] transition hover:border-[var(--color-mist)]/40"
            >
              <span className="font-ar">كيف يعمل؟</span>
              <span className="opacity-40">/</span>
              <span className="font-en">How it works</span>
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
              <Bi ar="رصيد تجريبي" en="Demo balance" size="sm" stack={false} className="text-xs text-[var(--color-mist)]" />
              <div className="font-en mt-0.5 font-semibold tabular-nums">
                {balance.toLocaleString('en-IQ')} <span className="font-ar text-sm">د.ع</span>
              </div>
            </div>
          </div>
          <div className="glass flex items-center gap-3 rounded-2xl p-3.5 sm:p-4">
            <Mic className="h-5 w-5 shrink-0 text-[var(--color-teal)]" />
            <div>
              <Bi ar="الصوت" en="Voice" size="sm" stack={false} className="text-xs text-[var(--color-mist)]" />
              <div className="font-en mt-0.5 font-semibold">Web Speech API</div>
            </div>
          </div>
          <div className="glass flex items-center gap-3 rounded-2xl p-3.5 sm:p-4">
            <Sparkles className="h-5 w-5 shrink-0 text-[var(--color-amber)]" />
            <div>
              <Bi ar="المحرك" en="Engine" size="sm" stack={false} className="text-xs text-[var(--color-mist)]" />
              <div className="font-en mt-0.5 font-semibold">Deterministic Demo AI</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl section-pad pb-16 sm:pb-20">
        <Bi ar="أمثلة أوامر" en="Example commands" className="font-display text-sm tracking-wide" size="sm" />
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_COMMANDS.map((cmd) => (
            <Link
              key={cmd}
              to="/demo"
              state={{ preset: cmd }}
              className="font-ar rounded-full border border-[var(--color-line)] bg-[var(--color-panel)]/60 px-3.5 py-2 text-xs text-[var(--color-foam)] transition hover:border-[var(--color-teal)]/40 sm:px-4 sm:text-sm"
            >
              «{cmd}»
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
