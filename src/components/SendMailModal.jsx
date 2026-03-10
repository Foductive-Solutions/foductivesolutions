import React, { useState } from 'react'
import { sendInvoiceEmail, sendCustomEmail } from '../utils/emailService'

/**
 * SendMailModal
 *
 * Props:
 *  - isOpen       {boolean}   show/hide the modal
 *  - onClose      {function}  close callback
 *  - customer     {object}    customer object (optional – pre-fills name/email)
 *  - order        {object}    order object    (optional – only used in "invoice" mode)
 *  - mode         {string}    "invoice" | "custom" | "both" (default "both")
 */
const SendMailModal = ({ isOpen, onClose, customer = null, order = null, mode = 'both' }) => {
  const hasOrder = order !== null && order !== undefined
  const defaultTab = (mode === 'invoice' && hasOrder) ? 'invoice' : 'custom'
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Shared state
  const [toEmail, setToEmail] = useState(customer?.email || '')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null) // { success, message }

  // Custom message state
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const resetResult = () => setResult(null)

  const handleSendInvoice = async (e) => {
    e.preventDefault()
    if (!toEmail) return
    setSending(true)
    setResult(null)
    const res = await sendInvoiceEmail(toEmail, customer, order)
    setResult(res)
    setSending(false)
  }

  const handleSendCustom = async (e) => {
    e.preventDefault()
    if (!toEmail || !subject || !message) return
    setSending(true)
    setResult(null)
    const res = await sendCustomEmail(
      toEmail,
      customer?.shopName || customer?.billingPerson || '',
      subject,
      message
    )
    setResult(res)
    setSending(false)
  }

  const inputClass =
    'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition text-sm'
  const labelClass = 'block text-sm font-medium text-slate-300 mb-1'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">✉️</span>
            <h2 className="text-lg font-semibold text-white">Send Email</h2>
            {customer && (
              <span className="text-sm text-slate-400 ml-1">— {customer.shopName || customer.billingPerson}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none transition"
          >
            ×
          </button>
        </div>

        {/* Tabs — only show when mode is "both" AND an order exists */}
        {mode === 'both' && hasOrder && (
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => { setActiveTab('invoice'); resetResult() }}
              className={`flex-1 py-3 text-sm font-medium transition ${
                activeTab === 'invoice'
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📄 Send Invoice
            </button>
            <button
              onClick={() => { setActiveTab('custom'); resetResult() }}
              className={`flex-1 py-3 text-sm font-medium transition ${
                activeTab === 'custom'
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💬 Custom Message
            </button>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Recipient Email — shared */}
          <div>
            <label className={labelClass}>Recipient Email *</label>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => { setToEmail(e.target.value); resetResult() }}
              className={inputClass}
              placeholder="customer@example.com"
              required
            />
          </div>

          {/* ── INVOICE TAB ─────────────────────────────── */}
          {hasOrder && (activeTab === 'invoice' || mode === 'invoice') && (
            <form onSubmit={handleSendInvoice} className="space-y-4">
              {/* Order summary preview */}
              {order && (
                <div className="bg-slate-800 rounded-lg p-4 text-sm space-y-1 border border-slate-700">
                  <p className="text-slate-400 text-xs font-semibold uppercase mb-2 tracking-wide">Invoice Preview</p>
                  <div className="flex justify-between text-slate-300">
                    <span>Order ID</span>
                    <span className="font-medium text-teal-400">{order.orderId || order.id}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Date</span>
                    <span>{order.date}</span>
                  </div>
                  {(order.qty1000ml || 0) > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>1000ml × {order.qty1000ml}</span>
                      <span>₹ {(order.qty1000ml || 0) * (order.rate1000ml || 0)}</span>
                    </div>
                  )}
                  {(order.qty500ml || 0) > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>500ml × {order.qty500ml}</span>
                      <span>₹ {(order.qty500ml || 0) * (order.rate500ml || 0)}</span>
                    </div>
                  )}
                  {(order.qty200ml || 0) > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>200ml × {order.qty200ml}</span>
                      <span>₹ {(order.qty200ml || 0) * (order.rate200ml || 0)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-700 mt-2 pt-2 flex justify-between font-semibold">
                    <span className="text-white">Total Bill</span>
                    <span className="text-yellow-400">₹ {order.totalBill}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Paid</span>
                    <span>₹ {order.paid || 0}</span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>Balance Due</span>
                    <span>₹ {order.remaining || 0}</span>
                  </div>
                </div>
              )}

              {/* Status / Error */}
              {result && (
                <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
                  result.success ? 'bg-green-900/40 border border-green-700 text-green-300' : 'bg-red-900/40 border border-red-700 text-red-300'
                }`}>
                  {result.success ? '✅' : '❌'} {result.message}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={sending || !toEmail}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <><span className="animate-spin">⏳</span> Sending...</>
                  ) : (
                    <><span>📧</span> Send Invoice</>
                  )}
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ── CUSTOM MESSAGE TAB ─────────────────────── */}
          {(activeTab === 'custom' || mode === 'custom') && (
            <form onSubmit={handleSendCustom} className="space-y-4">
              <div>
                <label className={labelClass}>Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => { setSubject(e.target.value); resetResult() }}
                  className={inputClass}
                  placeholder="e.g. Special Offer for You!"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); resetResult() }}
                  className={`${inputClass} resize-none`}
                  rows={5}
                  placeholder="Write your message here..."
                  required
                />
              </div>

              {/* Quick message templates */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Quick Templates:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '🎉 Special Offer', sub: 'Exclusive Offer for You!', msg: 'Dear Customer,\n\nWe have a special offer just for you! Enjoy discounted rates on your next order.\n\nPlease contact us for more details.\n\nThank you,\nAARICH Team' },
                    { label: '💰 Payment Reminder', sub: 'Payment Due Reminder', msg: 'Dear Customer,\n\nThis is a friendly reminder that your payment is due. Please clear the outstanding balance at your earliest convenience.\n\nThank you for your continued business.\n\nAARICH Team' },
                    { label: '📦 Order Confirmation', sub: 'Your Order Has Been Dispatched', msg: 'Dear Customer,\n\nYour order has been confirmed and is on its way. Thank you for choosing AARICH Water Bottle Distribution.\n\nBest regards,\nAARICH Team' },
                  ].map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => { setSubject(tpl.sub); setMessage(tpl.msg); resetResult() }}
                      className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status / Error */}
              {result && (
                <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
                  result.success ? 'bg-green-900/40 border border-green-700 text-green-300' : 'bg-red-900/40 border border-red-700 text-red-300'
                }`}>
                  {result.success ? '✅' : '❌'} {result.message}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={sending || !toEmail || !subject || !message}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <><span className="animate-spin">⏳</span> Sending...</>
                  ) : (
                    <><span>💬</span> Send Message</>
                  )}
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default SendMailModal
