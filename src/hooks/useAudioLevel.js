import { useEffect, useRef, useState } from 'react'

/**
 * Simple Web Audio API level meter while mic is active.
 */
export function useAudioLevel(active) {
  const [level, setLevel] = useState(0)
  const rafRef = useRef(0)
  const streamRef = useRef(null)
  const ctxRef = useRef(null)

  useEffect(() => {
    if (!active) {
      setLevel(0)
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      ctxRef.current?.close().catch(() => {})
      ctxRef.current = null
      return
    }

    let cancelled = false

    async function run() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const ctx = new AudioContext()
        ctxRef.current = ctx
        const source = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)

        const tick = () => {
          analyser.getByteFrequencyData(data)
          let sum = 0
          for (let i = 0; i < data.length; i++) sum += data[i]
          const avg = sum / data.length / 255
          setLevel(avg)
          rafRef.current = requestAnimationFrame(tick)
        }
        tick()
      } catch {
        setLevel(0.35)
      }
    }

    run()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      ctxRef.current?.close().catch(() => {})
      ctxRef.current = null
    }
  }, [active])

  return level
}
