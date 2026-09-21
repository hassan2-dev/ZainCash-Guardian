import { demoContacts } from '../data/contacts'
import { demoBills } from '../data/bills'
import { seedTransactions } from '../data/transactions'
import { parseCommand } from './commandParser'

export { parseCommand }
import { assessTransactionRisk } from './riskEngine'
import { INTENT, PARSE_STATUS } from './demoScenarios'

const STORAGE_KEY = 'zaincash-guardian-demo-v1'
const FEE_RATE = 0.005 // 0.5%
const MIN_FEE = 250
const MAX_FEE = 2500

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      balance: state.balance,
      transactions: state.transactions,
      txCounter: state.txCounter,
      usedKeys: [...state.usedKeys],
    }))
  } catch {
    /* ignore quota */
  }
}

function createInitialState() {
  const saved = loadState()
  return {
    balance: saved?.balance ?? 350000,
    contacts: demoContacts,
    bills: demoBills.map((b) => ({ ...b })),
    transactions: saved?.transactions ?? [...seedTransactions],
    txCounter: saved?.txCounter ?? 124,
    usedKeys: new Set(saved?.usedKeys ?? []),
  }
}

let state = createInitialState()

export function calculateFees(amount) {
  if (!amount || amount <= 0) return 0
  const fee = Math.round(amount * FEE_RATE)
  return Math.max(MIN_FEE, Math.min(MAX_FEE, fee))
}

export function lookupRecipient(name) {
  if (!name) return []
  const q = name.trim()
  return state.contacts.filter(
    (c) => c.name === q || c.name.includes(q) || q.includes(c.name),
  )
}

export function lookupBill(billType) {
  return state.bills.find((b) => b.type === billType && b.status === 'unpaid') || null
}

export function getBalance() {
  return state.balance
}

export function getContacts() {
  return state.contacts
}

export function getBills() {
  return state.bills
}

export function getTransactionHistory() {
  return [...state.transactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )
}

export function createIdempotencyKey(payload) {
  const base = JSON.stringify(payload)
  let hash = 0
  for (let i = 0; i < base.length; i++) {
    hash = ((hash << 5) - hash + base.charCodeAt(i)) | 0
  }
  return `idem-${Math.abs(hash)}-${payload.amount || 0}-${payload.recipientId || payload.billId || 'x'}`
}

/**
 * Build a payment intent from a parsed command + optional user selections.
 */
export function createPaymentIntent(parsed, selections = {}) {
  const steps = [
    { id: 'understood', label: 'فهم الطلب', done: true },
    { id: 'validate', label: 'التحقق من البيانات', done: false },
    { id: 'ambiguity', label: 'اكتشاف الغموض', done: false },
    { id: 'summary', label: 'ملخص العملية', done: false },
    { id: 'confirm', label: 'تأكيد المستخدم', done: false },
    { id: 'auth', label: 'المصادقة', done: false },
    { id: 'execute', label: 'تنفيذ وهمي', done: false },
    { id: 'receipt', label: 'الإيصال', done: false },
  ]

  if (parsed.intent === INTENT.BALANCE) {
    return {
      type: 'BALANCE',
      status: 'ready',
      balance: state.balance,
      steps: steps.map((s, i) => ({ ...s, done: i <= 1 })),
      message: `رصيدك التجريبي: ${state.balance.toLocaleString('en-IQ')} د.ع`,
    }
  }

  if (parsed.intent === INTENT.UNKNOWN) {
    return {
      type: 'UNKNOWN',
      status: 'blocked',
      steps,
      message: parsed.message,
    }
  }

  if (parsed.intent === INTENT.BILL_PAYMENT) {
    if (parsed.status === PARSE_STATUS.NEEDS_DETAILS || !parsed.billType) {
      return {
        type: 'BILL_PAYMENT',
        status: 'needs_bill',
        bills: state.bills.filter((b) => b.status === 'unpaid'),
        steps: steps.map((s, i) => ({ ...s, done: i === 0 })),
        message: 'أي فاتورة تريد تدفعها؟',
      }
    }

    const bill = selections.bill || lookupBill(parsed.billType)
    if (!bill) {
      return {
        type: 'BILL_PAYMENT',
        status: 'blocked',
        steps,
        message: 'ما لكيت فاتورة غير مدفوعة من هذا النوع.',
      }
    }

    const fee = 0
    const total = bill.amount + fee
    const risk = assessTransactionRisk({
      amount: bill.amount,
      recipientCount: 1,
      balance: state.balance,
    })

    if (total > state.balance) {
      return {
        type: 'BILL_PAYMENT',
        status: 'insufficient',
        bill,
        amount: bill.amount,
        fee,
        total,
        risk,
        steps: steps.map((s, i) => ({ ...s, done: i <= 2 })),
        message: 'الرصيد التجريبي غير كافٍ لدفع هذه الفاتورة.',
      }
    }

    const idempotencyKey = createIdempotencyKey({
      type: 'BILL',
      billId: bill.id,
      amount: bill.amount,
    })

    return {
      type: 'BILL_PAYMENT',
      status: 'review',
      bill,
      amount: bill.amount,
      fee,
      total,
      risk,
      idempotencyKey,
      steps: steps.map((s, i) => ({ ...s, done: i <= 3 })),
      message: `دفع ${bill.label} — ${bill.amount.toLocaleString('en-IQ')} د.ع`,
    }
  }

  // TRANSFER
  let recipients = []
  if (selections.recipient) {
    recipients = [selections.recipient]
  } else if (parsed.recipient) {
    recipients = lookupRecipient(parsed.recipient)
  }

  const amount = selections.amount ?? parsed.amount

  if (parsed.status === PARSE_STATUS.AMBIGUOUS || (!amount && parsed.recipient)) {
    return {
      type: 'TRANSFER',
      status: 'needs_amount',
      recipientName: parsed.recipient,
      recipients: lookupRecipient(parsed.recipient),
      steps: steps.map((s, i) => ({ ...s, done: i <= 2 })),
      message: parsed.message || 'المبلغ مو واضح. شگد تريد تحوّل؟',
      suggestedAmounts: [25000, 50000, 100000],
    }
  }

  if (!parsed.recipient && !selections.recipient) {
    return {
      type: 'TRANSFER',
      status: 'needs_recipient',
      amount,
      contacts: state.contacts,
      steps: steps.map((s, i) => ({ ...s, done: i <= 1 })),
      message: 'لمن التحويل؟',
    }
  }

  if (recipients.length > 1) {
    return {
      type: 'TRANSFER',
      status: 'ambiguous_recipient',
      amount,
      recipientName: parsed.recipient,
      recipients,
      risk: assessTransactionRisk({
        amount: amount || 0,
        recipientCount: recipients.length,
        balance: state.balance,
      }),
      steps: steps.map((s, i) => ({ ...s, done: i <= 2 })),
      message: `لقيت أكثر من شخص باسم ${parsed.recipient}. أي واحد تقصد؟`,
    }
  }

  if (recipients.length === 0) {
    return {
      type: 'TRANSFER',
      status: 'blocked',
      amount,
      steps: steps.map((s, i) => ({ ...s, done: i <= 1 })),
      message: `ما لكيت مستلم باسم «${parsed.recipient}» في جهات الاتصال التجريبية.`,
    }
  }

  const recipient = recipients[0]
  const fee = calculateFees(amount)
  const total = amount + fee
  const risk = assessTransactionRisk({
    amount,
    recipientCount: 1,
    balance: state.balance,
  })

  if (total > state.balance) {
    return {
      type: 'TRANSFER',
      status: 'insufficient',
      recipient,
      amount,
      fee,
      total,
      risk,
      steps: steps.map((s, i) => ({ ...s, done: i <= 2 })),
      message: 'الرصيد التجريبي غير كافٍ لإتمام التحويل.',
    }
  }

  const idempotencyKey = createIdempotencyKey({
    type: 'TRANSFER',
    recipientId: recipient.id,
    amount,
  })

  return {
    type: 'TRANSFER',
    status: 'review',
    recipient,
    amount,
    fee,
    total,
    risk,
    idempotencyKey,
    steps: steps.map((s, i) => ({ ...s, done: i <= 3 })),
    message: `تحويل ${amount.toLocaleString('en-IQ')} د.ع إلى ${recipient.name} ${recipient.phone}`,
  }
}

export function confirmTransaction(intent) {
  if (!intent || intent.status !== 'review') {
    return { ok: false, message: 'لا توجد عملية جاهزة للتأكيد.' }
  }
  return {
    ok: true,
    intent: {
      ...intent,
      status: 'awaiting_auth',
      steps: intent.steps.map((s, i) => ({
        ...s,
        done: i <= 4,
      })),
    },
  }
}

/**
 * Execute a demo transaction with idempotency protection.
 */
export function executeTransaction(intent, { authResult = 'success' } = {}) {
  if (!intent || intent.status !== 'awaiting_auth') {
    return { ok: false, status: 'rejected', message: 'المصادقة مطلوبة قبل التنفيذ.' }
  }

  if (authResult !== 'success') {
    return {
      ok: false,
      status: 'auth_failed',
      message: 'فشلت المصادقة التجريبية. لم تُنفَّذ أي عملية.',
      intent: {
        ...intent,
        status: 'auth_failed',
      },
    }
  }

  if (intent.idempotencyKey && state.usedKeys.has(intent.idempotencyKey)) {
    const existing = state.transactions.find((t) => t.idempotencyKey === intent.idempotencyKey)
    return {
      ok: true,
      status: 'duplicate_blocked',
      message: 'تم اكتشاف تكرار العملية — أُعيد الإيصال السابق دون خصم إضافي (Idempotency).',
      transaction: existing,
      intent: {
        ...intent,
        status: 'duplicate',
        steps: intent.steps.map((s) => ({ ...s, done: true })),
      },
    }
  }

  state.txCounter += 1
  const id = `ZG-DEMO-${String(state.txCounter).padStart(6, '0')}`

  const transaction = {
    id,
    type: intent.type,
    amount: intent.amount,
    fee: intent.fee,
    total: intent.total,
    recipient: intent.recipient
      ? { name: intent.recipient.name, phone: intent.recipient.phone, id: intent.recipient.id }
      : null,
    bill: intent.bill
      ? { label: intent.bill.label, provider: intent.bill.provider, id: intent.bill.id }
      : null,
    status: 'completed',
    createdAt: new Date().toISOString(),
    idempotencyKey: intent.idempotencyKey,
    demo: true,
  }

  state.balance -= intent.total
  state.transactions.unshift(transaction)
  state.usedKeys.add(intent.idempotencyKey)

  if (intent.bill) {
    state.bills = state.bills.map((b) =>
      b.id === intent.bill.id ? { ...b, status: 'paid' } : b,
    )
  }

  saveState(state)

  return {
    ok: true,
    status: 'completed',
    message: 'تم تنفيذ العملية بنجاح (تجريبي).',
    transaction,
    balance: state.balance,
    intent: {
      ...intent,
      status: 'completed',
      steps: intent.steps.map((s) => ({ ...s, done: true })),
    },
  }
}

export function resetDemoWallet() {
  localStorage.removeItem(STORAGE_KEY)
  state = createInitialState()
  state.balance = 350000
  state.transactions = [...seedTransactions]
  state.txCounter = 124
  state.usedKeys = new Set()
  state.bills = demoBills.map((b) => ({ ...b }))
  saveState(state)
  return getSnapshot()
}

export function getSnapshot() {
  return {
    balance: state.balance,
    contacts: state.contacts,
    bills: state.bills,
    transactions: getTransactionHistory(),
  }
}

export const walletEngine = {
  parseCommand,
  lookupRecipient,
  calculateFees,
  createPaymentIntent,
  confirmTransaction,
  executeTransaction,
  getTransactionHistory,
  getBalance,
  getContacts,
  getBills,
  getSnapshot,
  resetDemoWallet,
  createIdempotencyKey,
}

export default walletEngine
