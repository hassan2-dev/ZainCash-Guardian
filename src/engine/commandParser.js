import { INTENT, PARSE_STATUS } from './demoScenarios'

const ARABIC_NUMBERS = {
  'صفر': 0,
  'واحد': 1,
  'اثنين': 2,
  'اثنان': 2,
  'ثلاثة': 3,
  'اربعة': 4,
  'أربعة': 4,
  'خمسة': 5,
  'ستة': 6,
  'سبعة': 7,
  'ثمانية': 8,
  'تسعة': 9,
  'عشرة': 10,
}

function normalize(text) {
  return (text || '')
    .trim()
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
}

function parseAmount(text) {
  const n = normalize(text)

  // "100 ألف" / "100 الف" / "مئة ألف"
  const thousandMatch = n.match(/(\d+(?:[.,]\d+)?)\s*(الف|ألف|الاف|آلاف)/i)
  if (thousandMatch) {
    return Math.round(parseFloat(thousandMatch[1].replace(',', '.')) * 1000)
  }

  if (/مئه\s*(الف|ألف)/.test(n) || /ميه\s*(الف|ألف)/.test(n)) return 100000
  if (/خمسين\s*(الف|ألف)/.test(n)) return 50000
  if (/عشرين\s*(الف|ألف)/.test(n)) return 20000
  if (/عشره\s*(الف|ألف)/.test(n) || /عشرة\s*(الف|ألف)/.test(n)) return 10000
  if (/مائتين\s*(الف|ألف)/.test(n) || /ميتين\s*(الف|ألف)/.test(n)) return 200000

  // plain number
  const plain = n.match(/(\d{4,})/)
  if (plain) return parseInt(plain[1], 10)

  const short = n.match(/(\d+)\s*(دينار|د\.?ع)/)
  if (short) return parseInt(short[1], 10)

  return null
}

function extractRecipientName(text) {
  const n = normalize(text)
  const patterns = [
    /(?:ل|الى|إلي|الى)\s*([اأإآء-ي]+)/,
    /حول(?:ت)?\s+(?:\d+\s*(?:الف|ألف)?\s+)?(?:ل|الى)?\s*([اأإآء-ي]+)/,
    /ارسل\s+(?:فلوس\s+)?(?:ل|الى)\s*([اأإآء-ي]+)/,
  ]

  for (const p of patterns) {
    const m = n.match(p)
    if (m && m[1] && !['فلوس', 'فلس', 'دينار', 'الف', 'الف', 'فاتوره'].includes(m[1])) {
      // restore common names
      const name = m[1]
      if (name.includes('احمد')) return 'أحمد'
      if (name.includes('علي')) return 'علي'
      if (name.includes('ساره') || name.includes('سارة')) return 'سارة'
      if (name.includes('محمد')) return 'محمد'
      return name.charAt(0).toUpperCase() === name.charAt(0) ? name : name
    }
  }

  // direct name hits
  if (n.includes('احمد')) return 'أحمد'
  if (/\bعلي\b/.test(n) || n.includes(' لعلي') || n.includes('علي')) {
    if (n.includes('علي') && !n.includes('عملية')) return 'علي'
  }
  if (n.includes('ساره') || n.includes('سارة')) return 'سارة'
  if (n.includes('محمد')) return 'محمد'

  return null
}

function detectBillType(text) {
  const n = normalize(text)
  if (n.includes('كهرباء') || n.includes('كهربا')) return 'electricity'
  if (n.includes('ماء') || n.includes('مي')) return 'water'
  if (n.includes('انترنت') || n.includes('إنترنت') || n.includes('نت')) return 'internet'
  return null
}

/**
 * Parse Iraqi dialect / Arabic payment commands into structured intents.
 * Deterministic — no external AI API.
 */
export function parseCommand(rawInput) {
  const input = (rawInput || '').trim()
  const n = normalize(input)

  if (!input) {
    return {
      input,
      intent: INTENT.UNKNOWN,
      status: PARSE_STATUS.UNKNOWN,
      confidence: 0,
      amount: null,
      recipient: null,
      billType: null,
      message: 'ما سمعت شي. جرب تقول أمر أو اكتبه.',
    }
  }

  // Balance inquiry
  if (
    n.includes('رصيد') ||
    n.includes('كم عندي') ||
    n.includes('شوف فلوس') ||
    n.includes('شوف رصيد') ||
    n.includes('balance')
  ) {
    return {
      input,
      intent: INTENT.BALANCE,
      status: PARSE_STATUS.SUCCESS,
      confidence: 0.96,
      amount: null,
      recipient: null,
      billType: null,
      message: 'طلب عرض الرصيد.',
    }
  }

  // Bill payment
  if (
    n.includes('فاتوره') ||
    n.includes('فاتورة') ||
    n.includes('ادفع') && (n.includes('كهرباء') || n.includes('ماء') || n.includes('انترنت') || n.includes('نت'))
  ) {
    const billType = detectBillType(n)
    if (!billType) {
      return {
        input,
        intent: INTENT.BILL_PAYMENT,
        status: PARSE_STATUS.NEEDS_DETAILS,
        confidence: 0.78,
        amount: null,
        recipient: null,
        billType: null,
        message: 'فهمت إنك تريد تدفع فاتورة، بس أي فاتورة؟',
      }
    }
    return {
      input,
      intent: INTENT.BILL_PAYMENT,
      status: PARSE_STATUS.SUCCESS,
      confidence: 0.91,
      amount: null,
      recipient: null,
      billType,
      message: `طلب دفع فاتورة ${billType === 'electricity' ? 'الكهرباء' : billType === 'water' ? 'الماء' : 'الإنترنت'}.`,
    }
  }

  // Transfer
  const isTransfer =
    n.includes('حول') ||
    n.includes('حوّل') ||
    n.includes('ارسل') ||
    n.includes('أرسل') ||
    n.includes('حولت') ||
    n.includes('transfer') ||
    n.includes('فلوس ل') ||
    n.includes('فلوس الى')

  if (isTransfer) {
    const amount = parseAmount(n)
    const recipient = extractRecipientName(n)
    const hasVagueMoney = /فلوس|مبلغ|شي/.test(n) && !amount

    if (!recipient && !amount) {
      return {
        input,
        intent: INTENT.TRANSFER,
        status: PARSE_STATUS.NEEDS_DETAILS,
        confidence: 0.55,
        amount: null,
        recipient: null,
        billType: null,
        message: 'فهمت إنك تريد تحويل، بس لمن وكم المبلغ؟',
      }
    }

    if (recipient && (!amount || hasVagueMoney)) {
      return {
        input,
        intent: INTENT.TRANSFER,
        status: PARSE_STATUS.AMBIGUOUS,
        confidence: 0.72,
        amount: null,
        recipient,
        billType: null,
        message: `فهمت التحويل لـ ${recipient}، بس المبلغ مو واضح.`,
      }
    }

    if (amount && !recipient) {
      return {
        input,
        intent: INTENT.TRANSFER,
        status: PARSE_STATUS.NEEDS_DETAILS,
        confidence: 0.7,
        amount,
        recipient: null,
        billType: null,
        message: 'فهمت المبلغ، بس لمن التحويل؟',
      }
    }

    return {
      input,
      intent: INTENT.TRANSFER,
      status: PARSE_STATUS.SUCCESS,
      confidence: 0.94,
      amount,
      recipient,
      billType: null,
      message: `طلب تحويل ${amount.toLocaleString('en-IQ')} د.ع إلى ${recipient}.`,
    }
  }

  return {
    input,
    intent: INTENT.UNKNOWN,
    status: PARSE_STATUS.UNKNOWN,
    confidence: 0.2,
    amount: null,
    recipient: null,
    billType: null,
    message: 'ما قدرت أفهم الطلب. جرب مثل: «حوّل 100 ألف لأحمد»',
  }
}

export { ARABIC_NUMBERS }
