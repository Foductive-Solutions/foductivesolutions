import React, { useRef, useState } from 'react'
import SendMailModal from './SendMailModal'

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
            padding: 20px;
            color: #000;
            background: #fff;
          }
          .no-print { display: none !important; }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .total-row { background: #f0f0f0; font-weight: bold; }
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

  // Calculate line items
  const lineItems = []
  if (order.qty1000ml > 0) {
    lineItems.push({
      product: '1000ml Water Bottle',
      qty: order.qty1000ml,
      rate: order.rate1000ml || 0,
      amount: (order.qty1000ml || 0) * (order.rate1000ml || 0)
    })
  }
  if (order.qty500ml > 0) {
    lineItems.push({
      product: '500ml Water Bottle',
      qty: order.qty500ml,
      rate: order.rate500ml || 0,
      amount: (order.qty500ml || 0) * (order.rate500ml || 0)
    })
  }
  if (order.qty200ml > 0) {
    lineItems.push({
      product: '200ml Water Bottle',
      qty: order.qty200ml,
      rate: order.rate200ml || 0,
      amount: (order.qty200ml || 0) * (order.rate200ml || 0)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Action Buttons */}
        <div className="sticky top-0 bg-slate-800 p-4 flex justify-between items-center no-print">
          <h2 className="text-lg font-semibold text-white">Invoice Preview</h2>
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
                <h1 className="text-2xl font-bold text-gray-800">AARICH</h1>
                <p className="text-sm text-gray-600">Water Bottle Distribution</p>
                <p className="text-xs text-gray-500 mt-1">Quality Water, Delivered Fresh</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-700">INVOICE</h2>
                <p className="text-sm text-gray-600">#{order.orderId || order.id}</p>
                <p className="text-sm text-gray-600">Date: {formatDate(order.date)}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-1">BILL TO:</h3>
            <p className="font-semibold text-gray-800">{order.customer || customer?.shopName || 'Customer'}</p>
            {customer && (
              <>
                <p className="text-sm text-gray-600">{customer.billingPerson}</p>
                <p className="text-sm text-gray-600">{customer.location}</p>
                <p className="text-sm text-gray-600">Mobile: {customer.mobile}</p>
              </>
            )}
          </div>

          {/* Items Table */}
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700">Item</th>
                <th className="py-2 px-3 text-center text-sm font-semibold text-gray-700">Qty (Boxes)</th>
                <th className="py-2 px-3 text-right text-sm font-semibold text-gray-700">Rate (₹)</th>
                <th className="py-2 px-3 text-right text-sm font-semibold text-gray-700">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-2 px-3 text-sm text-gray-800">{item.product}</td>
                  <td className="py-2 px-3 text-center text-sm text-gray-800">{item.qty}</td>
                  <td className="py-2 px-3 text-right text-sm text-gray-800">{item.rate}</td>
                  <td className="py-2 px-3 text-right text-sm text-gray-800">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-semibold">₹ {order.totalBill || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Paid:</span>
                <span className="text-sm font-semibold text-green-600">₹ {order.paid || 0}</span>
              </div>
              <div className="flex justify-between py-2 bg-gray-100 px-2 rounded">
                <span className="text-sm font-bold">Balance Due:</span>
                <span className="text-sm font-bold text-red-600">₹ {order.remaining || 0}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between text-sm">
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
                <span className="text-gray-500">Source: </span>
                <span className="font-semibold">{order.orderSource === 'vehicle' ? '🚚 Vehicle' : '🏭 Godown'}</span>
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
