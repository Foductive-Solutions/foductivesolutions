import React from 'react'
import { COMPANY_INFO } from '../../config/companyInfo'

const formatMoney = (n) => `Rs. ${(n || 0).toLocaleString('en-IN')}`
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const LINE_ITEMS = [
  { qtyKey: 'qty1000ml', rateKey: 'rate1000ml', label: '1000ml Water Bottle' },
  { qtyKey: 'qty500ml', rateKey: 'rate500ml', label: '500ml Water Bottle' },
  { qtyKey: 'qty200ml', rateKey: 'rate200ml', label: '200ml Water Bottle' },
]

// Print-only view for a single, fully-paid order. Uses a scoped @media print
// rule (visibility toggling) rather than replacing document.body — the DOM and
// the rest of the app are left completely untouched, so nothing needs a reload.
const OrderReceipt = ({ order, customer, onClose }) => {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm print:static print:bg-transparent print:p-0 print:backdrop-blur-none">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #client-receipt, #client-receipt * { visibility: visible; }
          #client-receipt { position: fixed; inset: 0; padding: 24px; }
        }
      `}</style>

      <div className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/10 bg-white text-slate-900 shadow-2xl print:max-h-none print:w-full print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
        <div id="client-receipt" className="p-6">
          <div className="flex items-center gap-2.5">
            <img src="/aarich_logo_mark.png" alt="AARICH" className="h-9 w-9 object-contain" />
            <div>
              <p className="font-bold leading-none">{COMPANY_INFO.name}</p>
              <p className="text-[11px] text-slate-500">{COMPANY_INFO.legalName}</p>
            </div>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-slate-500">{COMPANY_INFO.registeredAddress}</p>

          <div className="mt-4 flex items-center justify-between border-y border-slate-200 py-2 text-xs">
            <span className="font-semibold uppercase tracking-wide text-emerald-600">Payment Receipt</span>
            <span className="text-slate-500">{order.orderId || order.id}</span>
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-600">
            <div>
              <p className="font-semibold text-slate-900">{customer.shopName}</p>
              {customer.billingPerson && <p>{customer.billingPerson}</p>}
              {customer.mobile && <p>{customer.mobile}</p>}
            </div>
            <p>{formatDate(order.date)}</p>
          </div>

          <table className="mt-4 w-full text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-left text-slate-500">
                <th className="py-1.5 font-medium">Item</th>
                <th className="py-1.5 text-right font-medium">Qty</th>
                <th className="py-1.5 text-right font-medium">Rate</th>
                <th className="py-1.5 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {LINE_ITEMS.filter((li) => order[li.qtyKey] > 0).map((li) => (
                <tr key={li.qtyKey} className="border-b border-slate-100">
                  <td className="py-1.5">{li.label}</td>
                  <td className="py-1.5 text-right">{order[li.qtyKey]}</td>
                  <td className="py-1.5 text-right">{order[li.rateKey]}</td>
                  <td className="py-1.5 text-right">{order[li.qtyKey] * order[li.rateKey]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 space-y-1 border-t border-slate-300 pt-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Amount</span>
              <span>{formatMoney(order.totalBill)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid ({order.paymentMode || 'Cash'})</span>
              <span>{formatMoney(order.paid)}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-600">
              <span>Balance Due</span>
              <span>Rs. 0</span>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-400">Thank you for your business — {COMPANY_INFO.name}</p>
        </div>

        <div className="flex gap-3 border-t border-slate-200 p-4 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-600"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderReceipt
