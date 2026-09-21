import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAudioLevel } from '../hooks/useAudioLevel'

export default function Waveform({ active = false }) {
  const level = useAudioLevel(active)
  const bars = useMemo(() => {
    if (typeof window === 'undefined') return 20
    return window.innerWidth < 640 ? 16 : 24
  }, [])

  return (
    <div className="flex h-10 w-full max-w-xs items-end justify-center gap-0.5 sm:h-12 sm:gap-1" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const wave = Math.sin(i * 0.55) * 0.5 + 0.5
        const h = active
          ? Math.max(6, 8 + level * 36 * wave + (i % 3) * 4)
          : 6 + (i % 4)
        return (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-[var(--color-teal)]/80"
            animate={{ height: h }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        )
      })}
    </div>
  )
}
