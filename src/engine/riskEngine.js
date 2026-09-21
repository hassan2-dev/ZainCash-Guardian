/**
 * Demo risk / voice-confidence simulation — not real biometrics.
 */

export function assessVoiceConfidence(transcript, meta = {}) {
  const length = (transcript || '').trim().length
  const hasDigits = /\d/.test(transcript || '')
  const base = 62 + Math.min(28, length)

  let score = base
  if (hasDigits) score += 6
  if (meta.fromSpeech) score += 4
  if (meta.noiseLevel === 'high') score -= 18
  if (meta.noiseLevel === 'low') score += 8

  // Deterministic jitter from string hash so demos feel alive but stable per phrase
  let hash = 0
  for (let i = 0; i < (transcript || '').length; i++) {
    hash = (hash + transcript.charCodeAt(i) * (i + 1)) % 17
  }
  score += hash - 8

  score = Math.max(28, Math.min(96, Math.round(score)))

  const level = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low'

  return {
    score,
    level,
    signalDetected: length > 0,
    antiSpoofing: 'Demo mode',
    deviceTrust: score >= 50 ? 'Verified' : 'Uncertain',
    canContinueWithVoiceAlone: false, // always false — educational point
    message:
      level === 'high'
        ? 'Voice confidence: High — يمكنك متابعة الطلب، لكن لا يمكن تنفيذ أي عملية مالية بالصوت وحده.'
        : level === 'medium'
          ? 'Voice confidence: Medium — نحتاج تأكيد إضافي قبل المتابعة.'
          : 'Voice confidence: Low — لأمان حسابك، يرجى فتح التطبيق أو إدخال رمز المساعد التجريبي.',
  }
}

export function assessTransactionRisk({ amount, recipientCount, balance }) {
  const flags = []
  let score = 12

  if (amount > 200000) {
    flags.push('مبلغ كبير نسبيًا')
    score += 35
  }
  if (recipientCount > 1) {
    flags.push('مستلمون متشابهون — يحتاج توضيح')
    score += 25
  }
  if (amount > balance) {
    flags.push('الرصيد غير كافٍ')
    score += 50
  }
  if (amount && amount % 1000 !== 0) {
    flags.push('مبلغ غير معتاد')
    score += 8
  }

  const level = score >= 60 ? 'elevated' : score >= 30 ? 'moderate' : 'low'

  return { score: Math.min(100, score), level, flags }
}
