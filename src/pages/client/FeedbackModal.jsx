import React, { useState } from 'react'
import { addFeedback } from '../../firebase/services'

const CATEGORIES = ['Service Quality', 'Product Quality', 'Delivery', 'Pricing', 'Communication', 'Other']

const FeedbackModal = ({ customer, onClose }) => {
  const [rating, setRating] = useState(5)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | sent
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Let us know a little about your experience.')
      return
    }
    setError('')
    setStatus('submitting')
    try {
      await addFeedback({
        customerName: customer.shopName,
        contactPerson: customer.billingPerson || 'N/A',
        rating,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        message: message.trim(),
        category,
      })
      setStatus('sent')
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError('Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="font-bold text-white">Leave Feedback</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-slate-400 hover:text-slate-200">
            ×
          </button>
        </div>

        {status === 'sent' ? (
          <div className="px-5 py-10 text-center">
            <p className="text-3xl">🙏</p>
            <p className="mt-3 font-semibold text-white">Thanks for letting us know!</p>
            <p className="mt-1 text-sm text-slate-400">Your feedback helps us do better.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-slate-200"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition ${
                      n <= rating ? 'border-amber-400/40 bg-amber-400/10 text-amber-300' : 'border-white/10 text-slate-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Tell us how we're doing…"
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending…' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default FeedbackModal
