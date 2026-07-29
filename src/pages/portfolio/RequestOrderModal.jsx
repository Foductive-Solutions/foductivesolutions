import React, { useEffect, useState } from 'react'

const INITIAL_FORM = { name: '', mobile: '', address: '' }

/**
 * Mounted by the parent only while open (`{requestOpen && <RequestOrderModal .../>}`),
 * so every open is a fresh mount with clean form state — no reset-on-prop-change effect needed.
 */
const RequestOrderModal = ({ onClose, counts }) => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | sent
  const [error, setError] = useState('')

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.mobile.trim() || !form.address.trim()) {
      setError('Please fill in your name, mobile number and address.')
      return
    }
    setError('')
    setStatus('submitting')

    // TODO: wire this up to a real order-request notification (e.g. utils/emailService's
    // sendCustomEmail) so the team gets an email with `form` + the selected `counts` crate mix.
    // Left as a UI-only stub for now, per request — no email is actually sent yet.
    await new Promise((resolve) => setTimeout(resolve, 600))
    setStatus('sent')
  }

  const totalCrates = counts ? counts.sm + counts.md + counts.lg : 0

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Request this order"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-display text-lg font-bold text-white">Request This Order</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-slate-400 transition hover:text-slate-200"
          >
            ×
          </button>
        </div>

        {status === 'sent' ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-4 font-display font-semibold text-white">Request received</p>
            <p className="mt-2 text-sm text-slate-400">Our team will reach out shortly to confirm your order.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-lg border border-white/10 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/25"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {totalCrates > 0 && (
              <p className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs text-cyan-200">
                Sending your mix: {counts.sm} × 200ml, {counts.md} × 500ml, {counts.lg} × 1000ml ({totalCrates} crates total)
              </p>
            )}

            <div>
              <label htmlFor="req-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Full Name
              </label>
              <input
                id="req-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label htmlFor="req-mobile" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Mobile Number
              </label>
              <input
                id="req-mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label htmlFor="req-address" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Current Address
              </label>
              <textarea
                id="req-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Shop / delivery address"
                className="w-full resize-none rounded-lg border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-lg bg-linear-to-r from-cyan-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40 disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending…' : 'Send Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RequestOrderModal
