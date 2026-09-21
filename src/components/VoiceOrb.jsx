import { motion } from 'framer-motion'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useAudioLevel } from '../hooks/useAudioLevel'
import { Bi } from './Bi'

export default function VoiceOrb({
  listening = false,
  analyzing = false,
  onToggle,
  disabled = false,
  size = 'lg',
}) {
  const level = useAudioLevel(listening)
  const dim = size === 'lg' ? undefined : 112
  const scale = listening ? 1 + level * 0.35 : analyzing ? 1.05 : 1

  return (
    <div className="relative flex flex-col items-center gap-3 sm:gap-4">
      <motion.button
        type="button"
        disabled={disabled || analyzing}
        onClick={onToggle}
        aria-label={listening ? 'Stop listening / إيقاف' : 'Start recording / تسجيل'}
        className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] sm:h-[160px] sm:w-[160px]"
        style={dim ? { width: dim, height: dim } : undefined}
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      >
        <span
          className={`absolute inset-0 rounded-full ${
            listening
              ? 'bg-[var(--color-teal)]/20 glow-teal'
              : analyzing
                ? 'bg-[var(--color-amber)]/15'
                : 'bg-[var(--color-panel-2)]'
          }`}
        />
        {listening && (
          <>
            <motion.span
              className="absolute inset-[-8px] rounded-full border border-[var(--color-teal)]/40 sm:inset-[-10px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <motion.span
              className="absolute inset-[-16px] rounded-full border border-[var(--color-teal)]/20 sm:inset-[-22px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.05, 0.4] }}
              transition={{ duration: 2.1, repeat: Infinity, delay: 0.2 }}
            />
          </>
        )}
        <span
          className={`relative z-10 flex h-[72%] w-[72%] items-center justify-center rounded-full border ${
            listening
              ? 'border-[var(--color-teal)] bg-[var(--color-teal)] text-[var(--color-ink)]'
              : analyzing
                ? 'border-[var(--color-amber)]/50 bg-[var(--color-panel)] text-[var(--color-amber)]'
                : 'border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-foam)] hover:border-[var(--color-teal)]/50'
          } transition`}
        >
          {analyzing ? (
            <Loader2 className="h-7 w-7 animate-spin sm:h-8 sm:w-8" />
          ) : listening ? (
            <Mic className="h-7 w-7 sm:h-8 sm:w-8" />
          ) : disabled ? (
            <MicOff className="h-7 w-7 opacity-50 sm:h-8 sm:w-8" />
          ) : (
            <Mic className="h-7 w-7 sm:h-8 sm:w-8" />
          )}
        </span>
      </motion.button>

      <div className="min-h-10 max-w-[280px] text-center text-sm text-[var(--color-mist)] sm:min-h-12">
        {analyzing && (
          <Bi ar="أحلل طلبك…" en="Analyzing your request…" size="sm" />
        )}
        {listening && !analyzing && (
          <Bi ar="أستمع إليك…" en="Listening…" size="sm" />
        )}
        {!listening && !analyzing && (
          <Bi ar="اضغط وتكلم باللهجة العراقية" en="Tap & speak in Iraqi dialect" size="sm" />
        )}
      </div>
    </div>
  )
}
