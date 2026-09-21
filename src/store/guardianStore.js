import { create } from 'zustand'
import {
  parseCommand,
  createPaymentIntent,
  confirmTransaction,
  executeTransaction,
  getSnapshot,
  resetDemoWallet,
} from '../engine/walletEngine'
import { assessVoiceConfidence } from '../engine/riskEngine'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export const PHASE = {
  IDLE: 'idle',
  LISTENING: 'listening',
  ANALYZING: 'analyzing',
  VOICE_CHECK: 'voice_check',
  CHAT: 'chat',
  REVIEW: 'review',
  SECURITY: 'security',
  FACE_ID: 'face_id',
  RESULT: 'result',
}

export const useGuardianStore = create((set, get) => ({
  phase: PHASE.IDLE,
  balance: getSnapshot().balance,
  transactions: getSnapshot().transactions,
  messages: [],
  transcript: '',
  parsed: null,
  intent: null,
  voiceConfidence: null,
  lastResult: null,
  isProcessing: false,
  journeySteps: [],

  refreshWallet() {
    const snap = getSnapshot()
    set({ balance: snap.balance, transactions: snap.transactions })
  },

  setPhase(phase) {
    set({ phase })
  },

  setTranscript(transcript) {
    set({ transcript })
  },

  addMessage(message) {
    set((s) => ({
      messages: [...s.messages, { id: crypto.randomUUID(), at: Date.now(), ...message }],
    }))
  },

  clearChat() {
    set({
      messages: [],
      transcript: '',
      parsed: null,
      intent: null,
      voiceConfidence: null,
      lastResult: null,
      journeySteps: [],
      phase: PHASE.IDLE,
    })
  },

  resetAll() {
    resetDemoWallet()
    get().refreshWallet()
    get().clearChat()
  },

  async submitCommand(rawText, { fromSpeech = false } = {}) {
    const text = (rawText || '').trim()
    if (!text || get().isProcessing) return

    set({ isProcessing: true, transcript: text, phase: PHASE.ANALYZING })

    get().addMessage({ role: 'user', text })

    await delay(900)

    const parsed = parseCommand(text)
    const voiceConfidence = assessVoiceConfidence(text, { fromSpeech })

    set({ parsed, voiceConfidence, phase: PHASE.VOICE_CHECK })
    await delay(1400)

    get().addMessage({
      role: 'system',
      text: `تحليل الأمر · ثقة الفهم ${(parsed.confidence * 100).toFixed(0)}٪`,
      meta: { kind: 'analysis', parsed },
    })

    let intent = createPaymentIntent(parsed)
    set({ intent, journeySteps: intent.steps || [], phase: PHASE.CHAT })

    await delay(500)

    if (intent.type === 'BALANCE') {
      get().addMessage({ role: 'assistant', text: intent.message })
      set({ isProcessing: false, phase: PHASE.RESULT, lastResult: { kind: 'balance', balance: intent.balance } })
      return
    }

    if (intent.status === 'blocked' || intent.status === 'insufficient') {
      get().addMessage({ role: 'assistant', text: intent.message, meta: { kind: 'error' } })
      set({ isProcessing: false })
      return
    }

    if (intent.status === 'ambiguous_recipient') {
      get().addMessage({
        role: 'assistant',
        text: intent.message,
        meta: { kind: 'choose_recipient', recipients: intent.recipients, amount: intent.amount },
      })
      set({ isProcessing: false })
      return
    }

    if (intent.status === 'needs_amount') {
      get().addMessage({
        role: 'assistant',
        text: intent.message,
        meta: {
          kind: 'choose_amount',
          amounts: intent.suggestedAmounts,
          recipientName: intent.recipientName,
        },
      })
      set({ isProcessing: false })
      return
    }

    if (intent.status === 'needs_bill') {
      get().addMessage({
        role: 'assistant',
        text: intent.message,
        meta: { kind: 'choose_bill', bills: intent.bills },
      })
      set({ isProcessing: false })
      return
    }

    if (intent.status === 'needs_recipient') {
      get().addMessage({
        role: 'assistant',
        text: intent.message,
        meta: { kind: 'choose_contact', contacts: intent.contacts, amount: intent.amount },
      })
      set({ isProcessing: false })
      return
    }

    if (intent.status === 'review') {
      get().addMessage({
        role: 'assistant',
        text: 'راجعت الطلب. تأكد من التفاصيل قبل التأكيد.',
        meta: { kind: 'review_ready' },
      })
      set({ isProcessing: false, phase: PHASE.REVIEW })
      return
    }

    get().addMessage({ role: 'assistant', text: intent.message || parsed.message })
    set({ isProcessing: false })
  },

  async selectRecipient(recipient) {
    const { parsed, intent } = get()
    if (!parsed) return
    get().addMessage({ role: 'user', text: `${recipient.name} ${recipient.phone}` })
    set({ isProcessing: true, phase: PHASE.ANALYZING })
    await delay(700)

    const next = createPaymentIntent(parsed, {
      recipient,
      amount: intent?.amount ?? parsed.amount,
    })
    set({ intent: next, journeySteps: next.steps || [] })

    if (next.status === 'review') {
      get().addMessage({
        role: 'assistant',
        text: 'تم تحديد المستلم. راجع الملخص ثم أكّد.',
      })
      set({ isProcessing: false, phase: PHASE.REVIEW })
    } else {
      get().addMessage({ role: 'assistant', text: next.message })
      set({ isProcessing: false, phase: PHASE.CHAT })
    }
  },

  async selectAmount(amount) {
    const { parsed, intent } = get()
    if (!parsed) return
    get().addMessage({ role: 'user', text: `${amount.toLocaleString('en-IQ')} د.ع` })
    set({ isProcessing: true, phase: PHASE.ANALYZING })
    await delay(700)

    const selections = { amount }
    if (intent?.recipients?.length === 1) selections.recipient = intent.recipients[0]
    else if (intent?.recipient) selections.recipient = intent.recipient

    // Re-parse with amount baked into synthetic input for recipient lookup
    const enriched = {
      ...parsed,
      amount,
      status: 'success',
    }
    const next = createPaymentIntent(enriched, selections)
    set({ intent: next, journeySteps: next.steps || [], parsed: enriched })

    if (next.status === 'ambiguous_recipient') {
      get().addMessage({
        role: 'assistant',
        text: next.message,
        meta: { kind: 'choose_recipient', recipients: next.recipients, amount },
      })
      set({ isProcessing: false, phase: PHASE.CHAT })
      return
    }

    if (next.status === 'review') {
      get().addMessage({ role: 'assistant', text: 'المبلغ واضح الآن. راجع العملية.' })
      set({ isProcessing: false, phase: PHASE.REVIEW })
      return
    }

    get().addMessage({ role: 'assistant', text: next.message })
    set({ isProcessing: false, phase: PHASE.CHAT })
  },

  async selectBill(bill) {
    const { parsed } = get()
    get().addMessage({ role: 'user', text: bill.label })
    set({ isProcessing: true, phase: PHASE.ANALYZING })
    await delay(700)

    const enriched = { ...parsed, billType: bill.type, status: 'success', intent: 'BILL_PAYMENT' }
    const next = createPaymentIntent(enriched, { bill })
    set({ intent: next, journeySteps: next.steps || [], parsed: enriched })

    if (next.status === 'review') {
      get().addMessage({ role: 'assistant', text: 'فاتورة جاهزة للمراجعة.' })
      set({ isProcessing: false, phase: PHASE.REVIEW })
    } else {
      get().addMessage({ role: 'assistant', text: next.message })
      set({ isProcessing: false, phase: PHASE.CHAT })
    }
  },

  async confirmIntent() {
    const { intent } = get()
    const result = confirmTransaction(intent)
    if (!result.ok) return

    get().addMessage({ role: 'user', text: 'أؤكد العملية' })
    set({
      intent: result.intent,
      journeySteps: result.intent.steps,
      phase: PHASE.SECURITY,
      isProcessing: true,
    })
    await delay(1600)
    set({ phase: PHASE.FACE_ID, isProcessing: false })
  },

  async simulateAuth(success) {
    const { intent } = get()
    set({ isProcessing: true })
    await delay(1200)

    const result = executeTransaction(intent, {
      authResult: success ? 'success' : 'failure',
    })

    if (!result.ok && result.status === 'auth_failed') {
      get().addMessage({
        role: 'assistant',
        text: result.message,
        meta: { kind: 'error' },
      })
      set({
        intent: result.intent,
        isProcessing: false,
        phase: PHASE.CHAT,
      })
      return
    }

    get().refreshWallet()
    set({
      lastResult: result,
      intent: result.intent,
      journeySteps: result.intent?.steps || [],
      phase: PHASE.RESULT,
      isProcessing: false,
    })

    if (result.status === 'duplicate_blocked') {
      get().addMessage({
        role: 'assistant',
        text: result.message,
        meta: { kind: 'idempotency' },
      })
    } else {
      get().addMessage({
        role: 'assistant',
        text: result.message,
        meta: { kind: 'success', transaction: result.transaction },
      })
    }
  },

  editIntent() {
    set({ phase: PHASE.CHAT })
    get().addMessage({
      role: 'assistant',
      text: 'تم إيقاف العملية. اكتب أو قل أمرًا جديدًا.',
    })
  },
}))
