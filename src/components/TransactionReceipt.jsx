import { motion } from 'framer-motion'
import { Receipt, RotateCcw, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Bi, BiTitle, useT } from './Bi'

export default function TransactionReceipt({ result, onAgain, onShowHistory }) {
  const [copied, setCopied] = useState(false)
  const t = useT()
  const tx = result?.transaction
  const isBalance = result?.kind === 'balance'

  if (isBalance) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-5 text-center sm:rounded-3xl sm:p-8"
      >
        <h2 className="text-lg font-bold sm:text-xl">
          <BiTitle ar="رصيدك التجريبي" en="Your demo balance" />
        </h2>
        <p className="font-en mt-4 text-3xl font-bold text-[var(--color-brand)] sm:text-4xl">
          {result.balance?.toLocaleString('en-IQ')}
          <span className="mr-2 text-base text-[var(--color-mist)]">IQD</span>
        </p>
        <button
          type="button"
          onClick={onAgain}
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white"
        >
          <RotateCcw className="h-4 w-4" />
          <Bi ar="عملية أخرى" en="Ask another" />
        </button>
      </motion.div>
    )
  }

  if (!tx && result?.status !== 'duplicate_blocked') {
    return null
  }

  const displayTx = tx
  const titleAr =
    result?.status === 'duplicate_blocked' ? 'تم منع التكرار' : 'تم تنفيذ العملية بنجاح'
  const titleEn =
    result?.status === 'duplicate_blocked' ? 'Duplicate blocked' : 'Transaction completed'

  const copyId = async () => {
    if (!displayTx?.id) return
    try {
      await navigator.clipboard.writeText(displayTx.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-5 sm:rounded-3xl sm:p-8"
    >
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-ok)]/15 text-[var(--color-ok)]">
          <Receipt className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-[var(--color-foam)] sm:text-xl">
          <BiTitle ar={titleAr} en={titleEn} />
        </h2>
        {result?.status === 'duplicate_blocked' && (
          <p className="mt-2 text-sm text-[var(--color-amber)]">{result.message}</p>
        )}
      </div>

      {displayTx && (
        <div className="mt-6 rounded-2xl bg-[var(--color-ink)]/40 p-4 text-center">
          <p className="font-en text-2xl font-bold text-[var(--color-brand)] sm:text-3xl">
            {displayTx.amount?.toLocaleString('en-IQ')}
            <span className="mr-2 text-sm text-[var(--color-mist)]">IQD</span>
          </p>
          {displayTx.recipient && (
            <p className="mt-2 text-sm text-[var(--color-foam)]">
              {t(
                `إلى ${displayTx.recipient.name} ${displayTx.recipient.phone}`,
                `To ${displayTx.recipient.name} ${displayTx.recipient.phone}`,
              )}
            </p>
          )}
          {displayTx.bill && (
            <p className="mt-2 text-sm text-[var(--color-foam)]">
              {displayTx.bill.label} · {displayTx.bill.provider}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--color-mist)]">
            <span>{t('رقم العملية:', 'Transaction ID:')}</span>
            <code className="rounded bg-[var(--color-panel)] px-2 py-1 text-[var(--color-foam)]" dir="ltr">
              {displayTx.id}
            </code>
            <button type="button" onClick={copyId} className="text-[var(--color-brand)]" aria-label="Copy">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          {displayTx.fee != null && (
            <p className="mt-2 text-xs text-[var(--color-mist)]">
              {t('العمولة:', 'Fee:')} {displayTx.fee.toLocaleString('en-IQ')} IQD
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onShowHistory}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] px-4 py-3 text-sm"
        >
          <Receipt className="h-4 w-4" />
          <Bi ar="السجل" en="Receipt / History" />
        </button>
        <button
          type="button"
          onClick={onAgain}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white"
        >
          <RotateCcw className="h-4 w-4" />
          <Bi ar="عملية أخرى" en="Ask another" />
        </button>
      </div>
    </motion.div>
  )
}
