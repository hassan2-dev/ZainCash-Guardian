import { motion } from 'framer-motion'
import { Check, AlertTriangle, Shield } from 'lucide-react'
import { Bi } from './Bi'

export default function ChatMessage({ message, onSelectRecipient, onSelectAmount, onSelectBill, onSelectContact }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[95%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed sm:max-w-[80%] sm:px-4 ${
          isUser
            ? 'rounded-br-md bg-[var(--color-teal)]/15 text-[var(--color-foam)]'
            : isSystem
              ? 'rounded-bl-md border border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-mist)]'
              : 'rounded-bl-md bg-[var(--color-panel-2)] text-[var(--color-foam)]'
        }`}
      >
        <div className="mb-1 text-[10px] uppercase tracking-wider text-[var(--color-mist)]">
          {isUser ? (
            <Bi ar="أنت" en="You" stack={false} size="sm" />
          ) : isSystem ? (
            <Bi ar="تحليل" en="Analysis" stack={false} size="sm" />
          ) : (
            <span className="font-en">Guardian</span>
          )}
        </div>
        <p className="font-ar break-words" dir="rtl">
          {message.text}
        </p>

        {message.meta?.kind === 'choose_recipient' && (
          <div className="mt-3 flex flex-col gap-2">
            {message.meta.recipients.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRecipient?.(r)}
                className="min-h-11 rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)]/40 px-3 py-2.5 text-right transition hover:border-[var(--color-teal)]/50"
              >
                <span className="font-ar font-semibold">{r.name}</span>
                <span className="font-en mr-2 text-[var(--color-mist)]" dir="ltr">
                  {r.phone}
                </span>
              </button>
            ))}
          </div>
        )}

        {message.meta?.kind === 'choose_amount' && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.meta.amounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => onSelectAmount?.(a)}
                className="font-en min-h-10 rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)]/40 px-3 py-2 transition hover:border-[var(--color-teal)]/50"
              >
                {a.toLocaleString('en-IQ')} <span className="font-ar">د.ع</span>
              </button>
            ))}
          </div>
        )}

        {message.meta?.kind === 'choose_bill' && (
          <div className="mt-3 flex flex-col gap-2">
            {message.meta.bills.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectBill?.(b)}
                className="min-h-11 rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)]/40 px-3 py-2.5 text-right transition hover:border-[var(--color-teal)]/50"
              >
                <div className="font-ar font-semibold">{b.label}</div>
                <div className="text-xs text-[var(--color-mist)]">
                  {b.provider} · {b.amount.toLocaleString('en-IQ')} د.ع
                </div>
              </button>
            ))}
          </div>
        )}

        {message.meta?.kind === 'choose_contact' && (
          <div className="mt-3 flex flex-col gap-2">
            {message.meta.contacts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectContact?.(c)}
                className="min-h-11 rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)]/40 px-3 py-2.5 text-right transition hover:border-[var(--color-teal)]/50"
              >
                <span className="font-ar">{c.name}</span>{' '}
                <span className="font-en text-[var(--color-mist)]" dir="ltr">
                  {c.phone}
                </span>
              </button>
            ))}
          </div>
        )}

        {message.meta?.kind === 'error' && (
          <div className="mt-2 flex items-center gap-1.5 text-[var(--color-rose)]">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <Bi ar="تم إيقاف المسار الآمن" en="Safe path stopped" size="sm" stack={false} />
          </div>
        )}

        {message.meta?.kind === 'success' && (
          <div className="mt-2 flex items-center gap-1.5 text-[var(--color-ok)]">
            <Check className="h-3.5 w-3.5 shrink-0" />
            <Bi ar="عملية تجريبية مكتملة" en="Demo transaction complete" size="sm" stack={false} />
          </div>
        )}

        {message.meta?.kind === 'idempotency' && (
          <div className="mt-2 flex items-center gap-1.5 text-[var(--color-amber)]">
            <Shield className="h-3.5 w-3.5 shrink-0" />
            <Bi ar="حماية من التكرار" en="Idempotency protection" size="sm" stack={false} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
