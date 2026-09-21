export const seedTransactions = [
  {
    id: 'ZG-DEMO-000118',
    type: 'TRANSFER',
    amount: 50000,
    fee: 250,
    recipient: { name: 'علي', phone: '••••4421' },
    status: 'completed',
    createdAt: '2026-09-18T14:22:00Z',
    idempotencyKey: 'seed-118',
  },
  {
    id: 'ZG-DEMO-000119',
    type: 'BILL_PAYMENT',
    amount: 45000,
    fee: 0,
    bill: { label: 'فاتورة الإنترنت', provider: 'Zain Fiber' },
    status: 'completed',
    createdAt: '2026-09-19T09:10:00Z',
    idempotencyKey: 'seed-119',
  },
]
