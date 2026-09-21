/** Deterministic demo scenarios — AI-style UX with reliable results */

export const EXAMPLE_COMMANDS = [
  'حوّل 100 ألف لأحمد',
  'ادفع فاتورة الكهرباء',
  'حوّل فلوس لأحمد',
  'حوّل 50 ألف لعلي',
  'شوف رصيدي',
  'ادفع فاتورة الإنترنت',
]

export const INTENT = {
  TRANSFER: 'TRANSFER',
  BILL_PAYMENT: 'BILL_PAYMENT',
  BALANCE: 'BALANCE',
  UNKNOWN: 'UNKNOWN',
}

export const PARSE_STATUS = {
  SUCCESS: 'success',
  NEEDS_DETAILS: 'needs_details',
  AMBIGUOUS: 'ambiguous',
  INSUFFICIENT: 'insufficient',
  UNKNOWN: 'unknown',
}
