import { motion } from 'framer-motion'
import { Pencil, Check } from 'lucide-react'
import { Bi, BiTitle } from './Bi'

function Row({ labelAr, labelEn, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] py-3 last:border-0">
      <span className="min-w-0 text-sm text-[var(--color-mist)]">
        <Bi ar={labelAr} en={labelEn} size="sm" stack={false} />
      </span>
      <span className="shrink-0 text-sm font-semibold text-[var(--color-foam)]">{value}</span>
    </div>
  )
}

export default function TransactionReview({ intent, onConfirm, onEdit, loading }) {
  if (!intent) return null

  const isBill = intent.type === 'BILL_PAYMENT'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 sm:rounded-3xl sm:p-6"
    >
      <div className="mb-1 font-en text-xs tracking-widest text-[var(--color-teal)] uppercase">
        Transfer Review
      </div>
      <h2 className="mb-4 text-lg font-bold text-[var(--color-foam)] sm:text-xl">
        <BiTitle
          ar={isBill ? 'مراجعة دفع الفاتورة' : 'مراجعة التحويل'}
          en={isBill ? 'Bill payment review' : 'Transfer review'}
        />
      </h2>

      <div className="rounded-2xl bg-[var(--color-ink)]/40 px-3 sm:px-4">
        {isBill ? (
          <>
            <Row labelAr="الفاتورة" labelEn="Bill" value={intent.bill?.label} />
            <Row labelAr="المزوّد" labelEn="Provider" value={intent.bill?.provider} />
            <Row labelAr="المرجع" labelEn="Reference" value={intent.bill?.accountRef} />
          </>
        ) : (
          <Row
            labelAr="إلى"
            labelEn="To"
            value={`${intent.recipient?.name} ${intent.recipient?.phone}`}
          />
        )}
        <Row labelAr="المبلغ" labelEn="Amount" value={`${intent.amount?.toLocaleString('en-IQ')} د.ع`} />
        <Row labelAr="العمولة" labelEn="Fee" value={`${intent.fee?.toLocaleString('en-IQ')} د.ع`} />
        <Row labelAr="الإجمالي" labelEn="Total" value={`${intent.total?.toLocaleString('en-IQ')} د.ع`} />
      </div>

      {intent.risk?.flags?.length > 0 && (
        <div className="mt-4 rounded-xl border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/10 px-3 py-2 text-xs text-[var(--color-amber)]">
          <span className="font-ar" dir="rtl">تنبيه مخاطر تجريبي:</span>{' '}
          <span className="font-en" dir="ltr">Demo risk:</span>{' '}
          {intent.risk.flags.join(' · ')}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onEdit}
          disabled={loading}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] px-4 py-3 text-sm text-[var(--color-mist)] transition hover:border-[var(--color-mist)]/40"
        >
          <Pencil className="h-4 w-4" />
          <Bi ar="تعديل" en="Edit" stack={false} size="sm" />
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-teal)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-teal-dim)]"
        >
          <Check className="h-4 w-4" />
          <Bi ar="تأكيد" en="Confirm" stack={false} size="sm" />
        </button>
      </div>
    </motion.div>
  )
}
