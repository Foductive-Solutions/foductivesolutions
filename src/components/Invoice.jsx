import React, { useRef, useState } from 'react'
import SendMailModal from './SendMailModal'
import { COMPANY_INFO } from '../config/companyInfo'
import {
  calculateTaxInvoice,
  formatCurrency,
  CGST_PERCENT,
  SGST_PERCENT,
} from '../utils/invoiceCalculations'

const Invoice = ({ order, customer, onClose }) => {
  const printRef = useRef()
  const [mailOpen, setMailOpen] = useState(false)

  const handlePrint = () => {
    const printContent = printRef.current
    const originalContents = document.body.innerHTML
    
    // Create print-specific styles
    const printStyles = `
      <style>
        @media print {
          body { 
            font-family: Arial, sans-serif; 
            padding: 10px;
            color: #000;
            background: #fff;
            font-size: 11px;
          }
          .no-print { display: none !important; }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 12px;
          }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          th, td { padding: 6px 8px; text-align: left; border: 1px solid #cbd5e1; }
          th { background: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 10px; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .total-row { background: #f8fafc; font-weight: bold; }
        }
      </style>
    `
    
    document.body.innerHTML = printStyles + printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  // Calculate GST line items and totals
  const { lineItems, netTotal, cgst, sgst, roundOff, grossTotal } = calculateTaxInvoice(order)

  const customerName = order.customer || customer?.shopName || 'Customer'
  const customerGstin = customer?.gstin || order.gstin || 'Unregistered'
  const customerPan = customer?.pan || (customerGstin !== 'Unregistered' ? customerGstin.slice(2, 12) : '—')
  const customerState = customer?.state || '27-Maharashtra'
  const customerAddress = order.address || customer?.location || customer?.address || '—'
  const customerMobile = order.mobile || customer?.mobile || '—'

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[92vh] overflow-auto shadow-2xl">
        {/* Action Buttons */}
        <div className="sticky top-0 bg-slate-800 p-4 flex justify-between items-center no-print z-10">
          <h2 className="text-lg font-semibold text-white">Invoice Preview (with GST Details)</h2>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-2"
            >
              🖨️ Print Invoice
            </button>
            <button
              onClick={() => setMailOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              📧 Send Email
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="invoice-container p-6 text-black bg-white">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{COMPANY_INFO.name}</h1>
                <p className="text-xs font-semibold uppercase text-teal-700">{COMPANY_INFO.legalName}</p>
                <p className="text-xs text-gray-600 mt-0.5">{COMPANY_INFO.registeredAddress}</p>
                <div className="mt-1 text-xs text-gray-700 flex flex-wrap gap-x-4">
                  <span><strong>GSTIN:</strong> {COMPANY_INFO.gstin}</span>
                  <span><strong>PAN:</strong> {COMPANY_INFO.pan}</span>
                  <span><strong>State:</strong> {COMPANY_INFO.state}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <h2 className="text-xl font-black text-gray-800">TAX INVOICE</h2>
                <p className="text-sm font-semibold text-gray-700">#{order.orderId || order.id}</p>
                <p className="text-xs text-gray-600">Date: {formatDate(order.date)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Source: {order.orderSource === 'vehicle' ? '🚚 Delivery Vehicle' : '🏭 Godown'}
                </p>
              </div>
            </div>
          </div>

          {/* Bill To / Receiver Details */}
          <div className="mb-5 bg-gray-50 border border-gray-200 rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">DETAILS OF RECEIVER (BILL TO):</h3>
                <p className="font-bold text-gray-900 text-base">{customerName}</p>
                {customer?.billingPerson && (
                  <p className="text-xs text-gray-700">Contact Person: {customer.billingPerson}</p>
                )}
                <p className="text-xs text-gray-600">{customerAddress}</p>
                <p className="text-xs text-gray-600">Mobile: {customerMobile}</p>
              </div>
              <div className="text-right text-xs space-y-1">
                <p><span className="text-gray-500">GSTIN:</span> <strong>{customerGstin}</strong></p>
                <p><span className="text-gray-500">PAN:</span> <strong>{customerPan}</strong></p>
                <p><span className="text-gray-500">State:</span> <strong>{customerState}</strong></p>
              </div>
            </div>
          </div>

          {/* Items Table with CGST & SGST Columns */}
          <table className="w-full mb-5 border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-800 border-b border-gray-300">
                <th className="py-2.5 px-2 text-left font-bold border border-gray-300">Item Description</th>
                <th className="py-2.5 px-2 text-center font-bold border border-gray-300 w-16">Qty (Boxes)</th>
                <th className="py-2.5 px-2 text-right font-bold border border-gray-300 w-20">Rate (₹)</th>
                <th className="py-2.5 px-2 text-right font-bold border border-gray-300 w-24">Taxable Value (₹)</th>
                <th className="py-2.5 px-2 text-right font-bold border border-gray-300 w-24">CGST ({CGST_PERCENT}%)</th>
                <th className="py-2.5 px-2 text-right font-bold border border-gray-300 w-24">SGST ({SGST_PERCENT}%)</th>
                <th className="py-2.5 px-2 text-right font-bold border border-gray-300 w-24">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-2 px-2 border border-gray-300 text-gray-900 font-medium">
                    {item.description}
                  </td>
                  <td className="py-2 px-2 border border-gray-300 text-center font-semibold">{item.quantity}</td>
                  <td className="py-2 px-2 border border-gray-300 text-right">{formatCurrency(item.inclusiveRate)}</td>
                  <td className="py-2 px-2 border border-gray-300 text-right">{formatCurrency(item.netAmount)}</td>
                  <td className="py-2 px-2 border border-gray-300 text-right text-emerald-800 font-medium">
                    ₹ {formatCurrency(item.cgstAmount)}
                  </td>
                  <td className="py-2 px-2 border border-gray-300 text-right text-emerald-800 font-medium">
                    ₹ {formatCurrency(item.sgstAmount)}
                  </td>
                  <td className="py-2 px-2 border border-gray-300 text-right font-bold text-gray-900">
                    ₹ {formatCurrency(item.grossAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & Tax Summary Breakdown */}
          <div className="flex justify-between items-start gap-4 mb-5">
            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 flex-1">
              <h4 className="font-bold text-gray-700 uppercase mb-1">Tax Summary</h4>
              <p>• CGST Rate: <strong>{CGST_PERCENT}%</strong></p>
              <p>• SGST Rate: <strong>{SGST_PERCENT}%</strong></p>
              <p>• Total GST Rate: <strong>{(CGST_PERCENT + SGST_PERCENT).toFixed(1)}%</strong></p>
              <p className="text-[11px] text-gray-500 mt-1">Rates are inclusive of taxes. Tax calculated by statutory back-calculation.</p>
            </div>

            <div className="w-72 bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-1.5">
              <div className="flex justify-between py-0.5 border-b border-gray-200">
                <span className="text-gray-600">Taxable Value:</span>
                <span className="font-semibold">₹ {formatCurrency(netTotal)}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-200 text-emerald-800">
                <span>CGST ({CGST_PERCENT}%):</span>
                <span className="font-semibold">₹ {formatCurrency(cgst)}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-200 text-emerald-800">
                <span>SGST ({SGST_PERCENT}%):</span>
                <span className="font-semibold">₹ {formatCurrency(sgst)}</span>
              </div>
              {roundOff !== 0 && (
                <div className="flex justify-between py-0.5 border-b border-gray-200 text-gray-500">
                  <span>Round Off:</span>
                  <span>₹ {formatCurrency(roundOff)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b-2 border-gray-800 font-bold text-sm text-gray-900">
                <span>Total Amount:</span>
                <span>₹ {formatCurrency(grossTotal || order.totalBill || 0)}</span>
              </div>
              <div className="flex justify-between py-0.5 text-green-700">
                <span>Paid Amount:</span>
                <span className="font-semibold">₹ {formatCurrency(order.paid || 0)}</span>
              </div>
              <div className="flex justify-between py-0.5 text-red-600 font-bold">
                <span>Balance Due:</span>
                <span>₹ {formatCurrency(order.remaining || 0)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t border-gray-200 pt-3 mb-4">
            <div className="flex justify-between text-xs">
              <div>
                <span className="text-gray-500">Payment Mode: </span>
                <span className="font-semibold">{order.paymentMode || 'Cash'}</span>
              </div>
              <div>
                <span className="text-gray-500">Status: </span>
                <span className={`font-semibold ${order.status === 'Completed' ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Delivery Term: </span>
                <span className="font-semibold">Immediate</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-800 pt-4 mt-6 text-center">
            <p className="text-xs text-gray-500">Thank you for your business!</p>
            <p className="text-xs text-gray-400 mt-1">This is a computer generated invoice.</p>
          </div>
        </div>
      </div>

      {/* Send Mail Modal */}
      <SendMailModal
        isOpen={mailOpen}
        onClose={() => setMailOpen(false)}
        customer={customer}
        order={order}
        mode="invoice"
      />
    </div>
  )
}

export default Invoice
