import React, { useState } from 'react'
import { sendCustomEmail } from '../utils/emailService'

const BOTTLE_TYPES = [
  { id: 'aarich',     label: 'AARICH Bottle',          emoji: '🔵' },
  { id: 'nosticker',  label: 'No-Sticker Bottle',       emoji: '⚪' },
  { id: 'realoxy',    label: 'Real-Oxy Sticker Bottle', emoji: '🟢' },
  { id: 'premium',    label: 'Premium Bottle',          emoji: '🟡' },
]

const SIZES = ['1000ml', '500ml', '200ml']

// qty structure: { aarich: { '1000ml': '', '500ml': '', '200ml': '' }, ... }
const makeEmptyQty = () =>
  Object.fromEntries(BOTTLE_TYPES.map(bt => [bt.id, Object.fromEntries(SIZES.map(s => [s, '']))]))

const VendorOrderRequestModal = ({ isOpen, onClose }) => {
  const [vendorName, setVendorName]     = useState('')
  const [vendorEmail, setVendorEmail]   = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [quantities, setQuantities]     = useState(makeEmptyQty())
  const [reqDate, setReqDate]           = useState(new Date().toISOString().split('T')[0])
  const [deliveryDate, setDeliveryDate] = useState('')
  const [extraNote, setExtraNote]       = useState('')
  const [sending, setSending]           = useState(false)
  const [result, setResult]             = useState(null)

  if (!isOpen) return null

  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
    setResult(null)
  }

  const setQty = (typeId, size, value) => {
    setQuantities(prev => ({
      ...prev,
      [typeId]: { ...prev[typeId], [size]: value }
    }))
    setResult(null)
  }

  const buildMessage = () => {
    const dateStr  = new Date(reqDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const delivStr = deliveryDate
      ? new Date(deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'As soon as possible'

    const itemLines = BOTTLE_TYPES
      .filter(bt => selectedTypes.includes(bt.id))
      .map(bt => {
        const sizeLines = SIZES
          .filter(s => quantities[bt.id][s])
          .map(s => `      ${s.padEnd(7)} — ${quantities[bt.id][s]} boxes`)
          .join('\n')
        return `  • ${bt.label}:\n${sizeLines || '      (qty not specified)'}`
      }).join('\n')

    return `Dear ${vendorName || 'Vendor'},

We would like to place a stock request order. Kindly confirm availability and delivery schedule.

Order Request Date : ${dateStr}
Expected Delivery  : ${delivStr}

Items Required:
${itemLines || '  (No items specified)'}
${extraNote ? `\nAdditional Notes:\n${extraNote}` : ''}

Please confirm receipt of this order request and provide a delivery confirmation at the earliest.

Thank you,
AARICH Water Bottle Distribution`
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!vendorEmail || selectedTypes.length === 0) return
    setSending(true)
    setResult(null)
    const res = await sendCustomEmail(
      vendorEmail,
      vendorName || 'Vendor',
      `Stock Order Request — AARICH (${new Date(reqDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })})`,
      buildMessage()
    )
    setResult(res)
    setSending(false)
  }

  const inputClass = 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition text-sm'
  const labelClass = 'block text-sm font-medium text-slate-300 mb-1'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <h2 className="text-lg font-semibold text-white">Request Order to Vendor</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none transition">×</button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-5">

          {/* Vendor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Vendor Name *</label>
              <input type="text" value={vendorName}
                onChange={e => { setVendorName(e.target.value); setResult(null) }}
                className={inputClass} placeholder="e.g. Aqua Supplies Co." required />
            </div>
            <div>
              <label className={labelClass}>Vendor Email *</label>
              <input type="email" value={vendorEmail}
                onChange={e => { setVendorEmail(e.target.value); setResult(null) }}
                className={inputClass} placeholder="vendor@example.com" required />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Request Date</label>
              <input type="date" value={reqDate} onChange={e => setReqDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Expected Delivery</label>
              <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Bottle Types + per-size quantities */}
          <div>
            <label className={labelClass}>Bottle Types & Quantities * <span className="text-slate-500 font-normal">(select type then fill qty per size)</span></label>
            <div className="space-y-3">
              {BOTTLE_TYPES.map(bt => {
                const active = selectedTypes.includes(bt.id)
                return (
                  <div key={bt.id} className={`rounded-lg border transition ${active ? 'border-teal-500 bg-teal-900/20' : 'border-slate-700 bg-slate-800'}`}>
                    {/* Type header — click to toggle */}
                    <div
                      onClick={() => toggleType(bt.id)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                      <span className="text-lg">{bt.emoji}</span>
                      <span className={`text-sm font-medium flex-1 ${active ? 'text-white' : 'text-slate-400'}`}>{bt.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        {active ? 'Selected ✓' : 'Select'}
                      </span>
                    </div>

                    {/* Per-size qty inputs — shown when selected */}
                    {active && (
                      <div className="px-4 pb-4 grid grid-cols-3 gap-3" onClick={e => e.stopPropagation()}>
                        {SIZES.map(size => (
                          <div key={size}>
                            <label className="block text-xs text-slate-400 mb-1">{size} (boxes)</label>
                            <input
                              type="number"
                              min="0"
                              value={quantities[bt.id][size]}
                              onChange={e => setQty(bt.id, size, e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-teal-400 transition"
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Extra Note */}
          <div>
            <label className={labelClass}>Additional Notes (optional)</label>
            <textarea
              value={extraNote}
              onChange={e => { setExtraNote(e.target.value); setResult(null) }}
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Any special instructions, packaging requirements, etc."
            />
          </div>

          {/* Email Preview */}
          {selectedTypes.length > 0 && vendorName && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Email Preview</p>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{buildMessage()}</pre>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
              result.success ? 'bg-green-900/40 border border-green-700 text-green-300' : 'bg-red-900/40 border border-red-700 text-red-300'
            }`}>
              {result.success ? '✅' : '❌'} {result.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={sending || !vendorEmail || !vendorName || selectedTypes.length === 0}
              className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              {sending ? <><span className="animate-spin">⏳</span> Sending...</> : <><span>📧</span> Send Request to Vendor</>}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VendorOrderRequestModal
