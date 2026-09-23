import { motion } from 'framer-motion'
import {
  Mic,
  Brain,
  Shield,
  Wallet,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useT } from './Bi'

function Node({ children, tone = 'default', className = '' }) {
  const tones = {
    default: 'border-[var(--color-line)] bg-[var(--color-panel)]',
    brand: 'border-[var(--color-brand)]/40 bg-[var(--color-brand)]/10',
    ai: 'border-[var(--color-brand-purple)]/45 bg-[var(--color-brand-purple)]/10',
    security: 'border-[var(--color-ok)]/40 bg-[var(--color-ok)]/10',
    gold: 'border-[var(--color-amber)]/40 bg-[var(--color-amber)]/10',
    danger: 'border-[var(--color-rose)]/45 bg-[var(--color-rose)]/10',
    warn: 'border-orange-400/45 bg-orange-400/10',
    success: 'border-[var(--color-ok)]/50 bg-[var(--color-ok)]/15',
    decision: 'border-[var(--color-mist)]/35 bg-[var(--color-panel-2)]',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className={`min-w-[120px] max-w-[160px] rounded-xl border px-3 py-2.5 text-center text-[11px] leading-snug text-[var(--color-foam)] shadow-sm sm:min-w-[140px] sm:max-w-[180px] sm:text-xs ${tones[tone]} ${className}`}
    >
      {children}
    </motion.div>
  )
}

function Arrow() {
  return (
    <span className="hidden shrink-0 text-[var(--color-mist)]/60 sm:inline-flex" aria-hidden>
      <ArrowRight className="h-4 w-4" />
    </span>
  )
}

function BranchLabel({ children }) {
  return (
    <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-ink)]/50 px-2 py-0.5 text-[10px] text-[var(--color-mist)]">
      {children}
    </span>
  )
}

function Layer({
  icon: Icon,
  badge,
  title,
  subtitle,
  accent,
  children,
  delay = 0,
}) {
  const accents = {
    brand: 'border-[var(--color-brand)]/35 from-[var(--color-brand)]/15',
    ai: 'border-[var(--color-brand-purple)]/40 from-[var(--color-brand-purple)]/15',
    security: 'border-[var(--color-ok)]/35 from-[var(--color-ok)]/12',
    gold: 'border-[var(--color-amber)]/35 from-[var(--color-amber)]/12',
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-3 sm:rounded-3xl sm:p-5 ${accents[accent]}`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)]/40 text-[var(--color-foam)]">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-en text-sm font-bold tracking-wide text-[var(--color-foam)] sm:text-base">
              {title}
            </h3>
            {badge && (
              <span className="rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-[var(--color-mist)] sm:text-xs">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="overflow-x-auto pb-1">{children}</div>
    </motion.section>
  )
}

function FlowRow({ children }) {
  return (
    <div className="flex min-w-max items-center gap-2 sm:gap-3">{children}</div>
  )
}

export default function JourneyFlowchart() {
  const t = useT()

  return (
    <div className="space-y-4 sm:space-y-5" dir="ltr">
      <div className="text-center">
        <p className="font-en text-xs font-semibold tracking-[0.2em] text-[var(--color-brand)] uppercase">
          Guardian Transaction Journey
        </p>
        <h2 className="mt-2 text-xl font-bold text-[var(--color-foam)] sm:text-2xl">
          {t('رحلة العملية الآمنة', 'Safe Payment Flowchart')}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-[var(--color-mist)]">
          {t(
            'أربع طبقات: المستخدم · الذكاء الاصطناعي · بوابة الأمان · التنفيذ',
            'Four layers: User · AI Intelligence · Security Gate · Transaction',
          )}
        </p>
      </div>

      {/* USER */}
      <Layer
        icon={Mic}
        accent="brand"
        title="01 · USER LAYER"
        subtitle={t('تحدث ← تحقق صوتي', 'Speak → Voice check')}
        delay={0}
      >
        <FlowRow>
          <Node tone="brand">{t('المستخدم: حوّل 100 ألف لأحمد', 'User: Transfer 100K to Ahmed')}</Node>
          <Arrow />
          <Node tone="brand">01 · Wake ZainCash</Node>
          <Arrow />
          <Node tone="brand">02 · Voice Confidence</Node>
          <Arrow />
          <Node tone="decision" className="max-w-[130px] rounded-2xl">
            {t('ثقة الصوت؟', 'Voice OK?')}
          </Node>
          <div className="flex flex-col items-center gap-1.5">
            <BranchLabel>High / OK</BranchLabel>
            <Node tone="success">Proceed</Node>
            <BranchLabel>Low</BranchLabel>
            <Node tone="warn">{t('تحقق إضافي / رمز المساعد', 'Extra verify / Assistant code')}</Node>
          </div>
        </FlowRow>
      </Layer>

      {/* AI */}
      <Layer
        icon={Brain}
        accent="ai"
        badge="AI AGENT"
        title="02 · INTELLIGENCE LAYER"
        subtitle={t('يفهم المعنى — لا ينفّذ المال', 'Understands meaning — never executes money')}
        delay={0.08}
      >
        <div className="space-y-3">
          <FlowRow>
            <Node tone="ai">03 · Understand Intent + Entities</Node>
            <Arrow />
            <Node tone="ai">04 · Verify Recipient / Amount / Balance / Fees</Node>
            <Arrow />
            <Node tone="decision">{t('غموض؟', 'Ambiguous?')}</Node>
            <div className="flex flex-col items-center gap-1.5">
              <BranchLabel>Yes</BranchLabel>
              <Node tone="ai">05 · Clarify — Which Ahmed? Never guess</Node>
              <BranchLabel>No</BranchLabel>
              <Node tone="success">{t('جاهز للمراجعة', 'Ready for review')}</Node>
            </div>
          </FlowRow>
          <div className="flex flex-wrap gap-2">
            <Node tone="danger">
              <span className="inline-flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {t('فشل: مستلم غامض ← اسأل', 'Fail: Ambiguous recipient → Ask')}
              </span>
            </Node>
            <Node tone="danger">
              <span className="inline-flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {t('فشل: رصيد غير كافٍ ← رفض آمن', 'Fail: Insufficient balance → Safe reject')}
              </span>
            </Node>
          </div>
        </div>
      </Layer>

      {/* SECURITY */}
      <Layer
        icon={Shield}
        accent="security"
        badge="SECURITY GATE"
        title="03 · SECURITY LAYER"
        subtitle={t('يقرر هل تُنفَّذ العملية', 'Decides whether the transaction can happen')}
        delay={0.16}
      >
        <FlowRow>
          <Node tone="security">
            06 · Review
            <div className="mt-1 text-[10px] text-[var(--color-mist)]">
              Ahmed ****1234 · 100,000 · Fee 500 · Total 100,500
            </div>
          </Node>
          <Arrow />
          <Node tone="security">07 · Explicit Confirmation</Node>
          <Arrow />
          <Node tone="security">08 · Face ID / Fingerprint / PIN</Node>
        </FlowRow>
      </Layer>

      {/* TRANSACTION */}
      <Layer
        icon={Wallet}
        accent="gold"
        title="04 · TRANSACTION LAYER"
        subtitle={t('تنفيذ وهمي + منع التكرار', 'Mock execute + idempotency')}
        delay={0.24}
      >
        <div className="space-y-3">
          <FlowRow>
            <Node tone="gold">09 · Execute · Mock Wallet API + Idempotency Key</Node>
            <Arrow />
            <Node tone="decision">{t('النتيجة؟', 'Result?')}</Node>
            <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-1">
                <BranchLabel>SUCCESS</BranchLabel>
                <Node tone="success">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    10 · Receipt
                  </span>
                </Node>
                <Arrow />
                <Node tone="success">{t('سجل العمليات', 'Transaction History')}</Node>
              </div>
              <div className="mx-2 hidden h-16 w-px bg-[var(--color-line)] sm:block" />
              <div className="flex flex-col items-center gap-1">
                <BranchLabel>FAIL</BranchLabel>
                <Node tone="danger">{t('فشل آمن · بلا تكرار', 'Safe failure · no duplicate')}</Node>
              </div>
            </div>
          </FlowRow>
          <Node tone="warn" className="max-w-md min-w-0">
            {t(
              'فشل: طلب مكرر / إعادة إرسال ← حماية Idempotency',
              'Fail: Duplicate request / retry → Idempotency protection',
            )}
          </Node>
        </div>
      </Layer>

      {/* Quote */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass rounded-2xl border border-[var(--color-brand-purple)]/30 p-4 text-center sm:p-6"
      >
        <p className="font-en text-sm font-semibold text-[var(--color-foam)] sm:text-base" dir="ltr">
          AI decides what the user means.
          <br />
          Security decides whether the transaction can happen.
        </p>
        <p className="font-ar mt-3 text-sm text-[var(--color-mist)]" dir="rtl">
          الذكاء الاصطناعي يقرر ماذا يقصد المستخدم.
          <br />
          الأمان يقرر هل تُنفَّذ العملية أم لا.
        </p>
      </motion.blockquote>
    </div>
  )
}
