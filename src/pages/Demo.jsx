import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Wallet, RotateCcw, History } from 'lucide-react'
import { toast } from 'sonner'
import VoiceOrb from '../components/VoiceOrb'
import Waveform from '../components/Waveform'
import ChatMessage from '../components/ChatMessage'
import JourneyTimeline from '../components/JourneyTimeline'
import TransactionReview from '../components/TransactionReview'
import SecurityGate from '../components/SecurityGate'
import FaceIdSimulation from '../components/FaceIdSimulation'
import TransactionReceipt from '../components/TransactionReceipt'
import VoiceConfidence from '../components/VoiceConfidence'
import { Bi, BiTitle, useT } from '../components/Bi'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useGuardianStore, PHASE } from '../store/guardianStore'
import { EXAMPLE_COMMANDS } from '../engine/demoScenarios'

export default function Demo() {
  const location = useLocation()
  const chatEndRef = useRef(null)
  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const t = useT()

  const {
    phase,
    balance,
    transactions,
    messages,
    transcript,
    intent,
    voiceConfidence,
    lastResult,
    journeySteps,
    isProcessing,
    submitCommand,
    selectRecipient,
    selectAmount,
    selectBill,
    confirmIntent,
    simulateAuth,
    editIntent,
    clearChat,
    resetAll,
    setPhase,
  } = useGuardianStore()

  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    lang: 'ar-IQ',
    onResult: (text) => {
      submitCommand(text, { fromSpeech: true })
    },
    onError: (err) => {
      if (err === 'not-allowed') {
        toast.error(t('اسمح بالميكروفون أو اكتب الأمر', 'Allow mic access or type instead'))
      } else if (err !== 'aborted' && err !== 'no-speech') {
        toast.message(t('تعذّر الصوت — اكتب الأمر', 'Speech failed — please type'))
      }
    },
  })

  useEffect(() => {
    const preset = location.state?.preset
    if (preset) setInput(preset)
  }, [location.state])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, phase])

  const handleMic = () => {
    if (!supported) {
      toast.message(t('الصوت غير مدعوم — اكتب الأمر', 'Speech unsupported — type instead'))
      return
    }
    if (listening) stop()
    else {
      setPhase(PHASE.LISTENING)
      start()
    }
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    const text = input.trim() || transcript
    if (!text) return
    setInput('')
    submitCommand(text, { fromSpeech: false })
  }

  const handleAgain = () => {
    clearChat()
    setShowHistory(false)
  }

  const showInput =
    phase === PHASE.IDLE ||
    phase === PHASE.LISTENING ||
    phase === PHASE.ANALYZING ||
    phase === PHASE.CHAT ||
    phase === PHASE.VOICE_CHECK

  return (
    <div className="mx-auto max-w-6xl section-pad pb-14 sm:pb-16">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
            <BiTitle ar="عِش تجربة الدفع الآمن" en="Experience the Safe Payment" />
          </h1>
          <p className="mt-1.5 text-xs text-[var(--color-mist)] sm:text-sm">
            {t('رحلة بصرية لعملية مالية تجريبية', 'A visual journey of a demo payment')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm">
            <Wallet className="h-4 w-4 shrink-0 text-[var(--color-amber)]" />
            <span className="font-en tabular-nums">{balance.toLocaleString('en-IQ')}</span>
            <span className="font-ar text-xs text-[var(--color-mist)]">د.ع</span>
          </div>
          <button
            type="button"
            onClick={() => {
              resetAll()
              toast.success(t('أُعيد ضبط المحفظة التجريبية', 'Demo wallet reset'))
            }}
            className="glass min-h-10 min-w-10 rounded-xl p-2.5 text-[var(--color-mist)] hover:text-[var(--color-foam)]"
            title="Reset / إعادة ضبط"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className="glass min-h-10 min-w-10 rounded-xl p-2.5 text-[var(--color-mist)] hover:text-[var(--color-foam)]"
            title="History / السجل"
          >
            <History className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-4">
          {showInput && (
            <div className="glass rounded-2xl p-4 sm:rounded-3xl sm:p-6">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <VoiceOrb
                  listening={listening}
                  analyzing={phase === PHASE.ANALYZING}
                  onToggle={handleMic}
                  disabled={isProcessing && phase === PHASE.ANALYZING}
                />
                <Waveform active={listening} />
                {(interim || (listening && !interim)) && (
                  <p className="font-ar min-h-6 text-center text-sm text-[var(--color-teal)]">
                    {interim || '…'}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-5 flex gap-2 sm:mt-6">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t(
                    'اكتب الأمر… مثل: حوّل 100 ألف لأحمد',
                    'Type a command… e.g. transfer 100k to Ahmed',
                  )}
                  className="font-ar min-h-12 min-w-0 flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)]/50 px-3 py-3 text-sm outline-none placeholder:text-[var(--color-mist)]/55 focus:border-[var(--color-teal)]/50 sm:px-4"
                  disabled={isProcessing && phase === PHASE.ANALYZING}
                />
                <button
                  type="submit"
                  disabled={isProcessing && phase === PHASE.ANALYZING}
                  className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-teal)] text-[var(--color-ink)] disabled:opacity-50"
                  aria-label="Send / إرسال"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                {EXAMPLE_COMMANDS.slice(0, 4).map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => submitCommand(cmd)}
                    className="font-ar rounded-full border border-[var(--color-line)] px-3 py-1.5 text-[11px] text-[var(--color-mist)] transition hover:border-[var(--color-teal)]/40 hover:text-[var(--color-foam)] sm:text-xs"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === PHASE.VOICE_CHECK && voiceConfidence && (
              <VoiceConfidence key="voice" data={voiceConfidence} />
            )}

            {phase === PHASE.REVIEW && (
              <TransactionReview
                key="review"
                intent={intent}
                onConfirm={confirmIntent}
                onEdit={editIntent}
                loading={isProcessing}
              />
            )}

            {phase === PHASE.SECURITY && <SecurityGate key="security" />}

            {phase === PHASE.FACE_ID && (
              <FaceIdSimulation
                key="face"
                loading={isProcessing}
                onSuccess={() => simulateAuth(true)}
                onFailure={() => simulateAuth(false)}
              />
            )}

            {phase === PHASE.RESULT && lastResult && (
              <TransactionReceipt
                key="receipt"
                result={lastResult}
                onAgain={handleAgain}
                onShowHistory={() => setShowHistory(true)}
              />
            )}
          </AnimatePresence>

          {messages.length > 0 && (
            <div className="glass rounded-2xl p-4 sm:rounded-3xl sm:p-5">
              <h3 className="mb-3">
                <Bi ar="المحادثة" en="Conversation" className="font-en text-xs tracking-widest uppercase" size="sm" />
              </h3>
              <div className="max-h-[min(420px,55vh)] space-y-3 overflow-y-auto pe-1">
                {messages.map((m) => (
                  <ChatMessage
                    key={m.id}
                    message={m}
                    onSelectRecipient={selectRecipient}
                    onSelectAmount={selectAmount}
                    onSelectBill={selectBill}
                    onSelectContact={selectRecipient}
                  />
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}

          {showHistory && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 sm:rounded-3xl sm:p-5"
            >
              <h3 className="mb-3 font-semibold">
                <Bi ar="سجل العمليات التجريبية" en="Demo transaction history" size="sm" />
              </h3>
              <ul className="space-y-2">
                {transactions.map((tx) => (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-ink)]/35 px-3 py-2.5 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="font-ar truncate font-medium">
                        {tx.type === 'BILL_PAYMENT'
                          ? tx.bill?.label
                          : `إلى ${tx.recipient?.name} ${tx.recipient?.phone || ''}`}
                      </div>
                      <div className="font-en text-xs text-[var(--color-mist)]">{tx.id}</div>
                    </div>
                    <div className="shrink-0 text-left" dir="ltr">
                      <div className="font-en font-semibold tabular-nums text-[var(--color-teal)]">
                        {tx.amount?.toLocaleString('en-IQ')} IQD
                      </div>
                      <div className="font-en text-[10px] text-[var(--color-mist)]">{tx.status}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        <aside className="order-first space-y-4 lg:order-none lg:sticky lg:top-20 lg:self-start">
          <JourneyTimeline steps={journeySteps} />
          {intent?.idempotencyKey && (
            <div className="glass rounded-2xl p-4 text-xs text-[var(--color-mist)]">
              <div className="mb-1 font-en tracking-wide text-[var(--color-foam)] uppercase">
                Idempotency
              </div>
              <code className="font-en break-all text-[10px] text-[var(--color-brand)]" dir="ltr">
                {intent.idempotencyKey}
              </code>
              <p className="mt-2 leading-relaxed">
                {t(
                  'يمنع تنفيذ نفس العملية مرتين عند إعادة الإرسال.',
                  'Blocks duplicate execution if the same request is resent.',
                )}
              </p>
            </div>
          )}
          {!supported && (
            <div className="rounded-2xl border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/10 p-3 text-xs text-[var(--color-amber)]">
              {t(
                'المتصفح لا يدعم Web Speech API. استخدم الكتابة.',
                'Browser lacks Web Speech API. Please type.',
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
