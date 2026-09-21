import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Web Speech API hook — Arabic / Iraqi dialect support varies by browser.
 */
export function useSpeechRecognition({ lang = 'ar-IQ', onResult, onError } = {}) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const recognitionRef = useRef(null)
  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onResultRef.current = onResult
    onErrorRef.current = onError
  }, [onResult, onError])

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setSupported(false)
      return
    }
    setSupported(true)
    const recognition = new SR()
    recognition.lang = lang
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => {
      setListening(false)
      setInterim('')
    }
    recognition.onerror = (e) => {
      setListening(false)
      onErrorRef.current?.(e.error)
    }
    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) finalText += t
        else interimText += t
      }
      if (interimText) setInterim(interimText)
      if (finalText) {
        setInterim('')
        onResultRef.current?.(finalText.trim())
      }
    }

    recognitionRef.current = recognition
    return () => {
      try {
        recognition.abort()
      } catch {
        /* ignore */
      }
    }
  }, [lang])

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return
    try {
      // Prefer ar-IQ, fall back to ar-SA / ar
      recognitionRef.current.lang = lang
      recognitionRef.current.start()
    } catch {
      onErrorRef.current?.('start_failed')
    }
  }, [lang, listening])

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      /* ignore */
    }
  }, [])

  return { supported, listening, interim, start, stop }
}
