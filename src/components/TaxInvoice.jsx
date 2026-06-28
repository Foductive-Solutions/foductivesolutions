import React, { useRef, useState } from 'react'
import { COMPANY_INFO } from '../config/companyInfo'
import {
  calculateTaxInvoice,
  amountInWords,
  formatInvoiceDate,
  formatCurrency,
  CGST_PERCENT,
  SGST_PERCENT,
} from '../utils/invoiceCalculations'
import { sendTaxInvoiceEmail } from '../utils/emailService'
import SendMailModal from './SendMailModal'

const PRINT_STYLES = `
  <style>
    @page { size: A4; margin: 10mm; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      color: #000;
      background: #fff;
      padding: 0;
      margin: 0;
    }
    .no-print { display: none !important; }
    .tax-invoice { max-width: 800px; margin: 0 auto; padding: 8px; }
    .tax-invoice table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .tax-invoice th, .tax-invoice td {
      border: 1px solid #000;
      padding: 5px 6px;
      vertical-align: top;
    }
    .tax-invoice .section-label {
      background: #e8e8e8;
      font-weight: bold;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .tax-invoice .header-title {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 1px;
    }
    .tax-invoice .doc-title {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      background: #e0e0e0;
      border: 1px solid #000;
      padding: 4px 12px;
      display: inline-block;
      margin: 8px auto;
    }
    .tax-invoice .text-center { text-align: center; }
    .tax-invoice .text-right { text-align: right; }
    .tax-invoice .font-bold { font-weight: bold; }
    .tax-invoice .gross-highlight {
      background: #00bcd4;
      color: #000;
      font-weight: bold;
    }
    .tax-invoice .meta-label {
      background: #f3f3f3;
      font-weight: bold;
      width: 42%;
    }
    .tax-invoice .items-table th {
      font-size: 9px;
      text-align: center;
      background: #e8e8e8;
      font-weight: bold;
    }
    .tax-invoice .items-table td { font-size: 10px; }
    .tax-invoice .empty-row td { height: 22px; }
    .tax-invoice .footer-section { font-size: 10px; }
  </style>
`

const TaxInvoice = ({ order, customer, onClose }) => {
  const printRef = useRef()
  const [mailOpen, setMailOpen] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailResult, setEmailResult] = useState(null)

  const { lineItems, netTotal, cgst, sgst, roundOff, grossTotal } = calculateTaxInvoice(order)

  const handlePrint = () => {
    const printContent = printRef.current
    const originalContents = document.body.innerHTML

    document.body.innerHTML = PRINT_STYLES + printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  const handleSendToCustomer = async () => {
    const customerEmail = customer?.email?.trim()
    if (!customerEmail) {
      setEmailResult({ success: false, message: 'No email on file for this customer. Use Send Email to enter one.' })
      return
    }

    setSendingEmail(true)
    setEmailResult(null)
    const res = await sendTaxInvoiceEmail(customerEmail, customer, order)
    setEmailResult(res)
    setSendingEmail(false)
  }

  const invoiceDate = formatInvoiceDate(order.date)
  const invoiceNo = order.orderId || order.id
  const customerName = order.customer || customer?.shopName || 'Customer'
  const customerGstin = customer?.gstin || '—'
  const customerPan = customer?.pan || (customerGstin !== '—' ? customerGstin.slice(2, 12) : '—')
  const customerState = customer?.state || '27-Maharashtra'
  const customerAddress = customer?.location || '—'
  const customerEmail = customer?.email || ''

  const emptyRowCount = Math.max(0, 3 - lineItems.length)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-auto shadow-2xl">
        {/* Toolbar */}
        <div className="sticky top-0 bg-slate-800 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 no-print z-10">
          <h2 className="text-lg font-semibold text-white">Tax Invoice Preview</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              🖨️ Print
            </button>
            <button
              onClick={handleSendToCustomer}
              disabled={sendingEmail}
              title={customerEmail ? `Send to ${customerEmail}` : 'Customer has no email on file'}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              {sendingEmail ? '⏳ Sending…' : '📧 Send to Customer'}
            </button>
            <button
              onClick={() => { setMailOpen(true); setEmailResult(null) }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              ✉️ Send Email
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {emailResult && (
          <div
            className={`no-print mx-4 mt-3 rounded-lg px-4 py-2.5 text-sm font-medium ${
              emailResult.success
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {emailResult.success ? '✅' : '❌'} {emailResult.message}
          </div>
        )}

        {/* Invoice Document */}
        <div ref={printRef} className="tax-invoice p-5 text-black bg-white text-[11px] leading-snug">
          <table className="w-full border-collapse border-2 border-black table-fixed">
            {/* Company Header */}
            <thead>
              <tr>
                <th colSpan={10} className="border border-black p-3 bg-white relative">
                  <span className="absolute top-2 right-3 text-[10px] italic font-normal text-gray-600">
                    Original for Recipient
                  </span>
                  <p className="header-title text-xl font-bold tracking-wide">{COMPANY_INFO.name}</p>
                  <p className="text-center text-[11px] mt-1">{COMPANY_INFO.registeredAddress}</p>
                  {/* <p className="text-center text-[11px] mt-1">
                    GSTIN: {COMPANY_INFO.gstin} &nbsp;|&nbsp; PAN: {COMPANY_INFO.pan} &nbsp;|&nbsp; State: {COMPANY_INFO.state}
                  </p> */}
                  <div className="text-center mt-2">
                    <span className="doc-title inline-block text-sm font-bold bg-gray-200 border border-black px-4 py-1">
                      TAX INVOICE
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Bill To + Invoice Meta */}
              <tr>
                <td colSpan={6} className="border border-black p-0 align-top">
                  <div className="section-label bg-gray-200 border-b border-black px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
                    Details of Receiver (Bill To)
                  </div>
                  <div className="px-3 py-2 space-y-0.5">
                    <p className="font-bold text-[12px]">{customerName}</p>
                    <p>{customerAddress}</p>
                    {customer?.mobile && <p>Mobile: {customer.mobile}</p>}
                    {customerEmail && <p>Email: {customerEmail}</p>}
                    <p>State: {customerState}</p>
                    <p>GSTIN: {customerGstin}</p>
                    <p>PAN: {customerPan}</p>
                  </div>
                </td>
                <td colSpan={4} className="border border-black p-0 align-top">
                  <div className="section-label bg-gray-200 border-b border-black px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
                    Invoice Details
                  </div>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="meta-label border border-black px-2 py-1.5 bg-gray-100 font-semibold w-[42%]">Tax Inv. No.</td>
                        <td className="border border-black px-2 py-1.5">{invoiceNo}</td>
                      </tr>
                      <tr>
                        <td className="meta-label border border-black px-2 py-1.5 bg-gray-100 font-semibold">Date</td>
                        <td className="border border-black px-2 py-1.5">{invoiceDate}</td>
                      </tr>
                      {/* <tr>
                        <td className="meta-label border border-black px-2 py-1.5 bg-gray-100 font-semibold">Broker Name</td>
                        <td className="border border-black px-2 py-1.5">&nbsp;</td>
                      </tr> */}
                      <tr>
                        <td className="meta-label border border-black px-2 py-1.5 bg-gray-100 font-semibold">Payment Term</td>
                        <td className="border border-black px-2 py-1.5">{COMPANY_INFO.paymentTerm}</td>
                      </tr>
                      <tr>
                        <td className="meta-label border border-black px-2 py-1.5 bg-gray-100 font-semibold">Due On</td>
                        <td className="border border-black px-2 py-1.5">{invoiceDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Line Items Header */}
              <tr className="bg-gray-200">
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[4%]">Sno</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold">Description of Goods</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[7%]">CGST%</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[7%]">SGST%</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[10%]">Quantity</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[7%]">Scheme</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[9%]">Rate</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[6%]">Dis%</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[6%]">Per</th>
                <th className="border border-black px-1 py-1.5 text-center text-[9px] font-bold w-[11%]">Amount</th>
              </tr>

              {/* Line Items */}
              {lineItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-black px-1 py-1.5 text-center">{idx + 1}</td>
                  <td className="border border-black px-2 py-1.5">{item.description}</td>
                  <td className="border border-black px-1 py-1.5 text-center">{item.cgstPercent.toFixed(2)}</td>
                  <td className="border border-black px-1 py-1.5 text-center">{item.sgstPercent.toFixed(2)}</td>
                  <td className="border border-black px-1 py-1.5 text-center">{item.quantity} {item.unit}</td>
                  <td className="border border-black px-1 py-1.5 text-center">&nbsp;</td>
                  <td className="border border-black px-1 py-1.5 text-right">{formatCurrency(item.exclusiveRate)}</td>
                  <td className="border border-black px-1 py-1.5 text-center">&nbsp;</td>
                  <td className="border border-black px-1 py-1.5 text-center">{item.unit}</td>
                  <td className="border border-black px-1 py-1.5 text-right">{formatCurrency(item.netAmount)}</td>
                </tr>
              ))}

              {Array.from({ length: emptyRowCount }).map((_, i) => (
                <tr key={`empty-${i}`} className="empty-row">
                  {Array.from({ length: 10 }).map((__, j) => (
                    <td key={j} className="border border-black px-1 py-1.5">&nbsp;</td>
                  ))}
                </tr>
              ))}

              {/* Totals */}
              <tr>
                <td colSpan={9} className="border border-black px-2 py-1.5 text-right font-bold bg-gray-50">
                  Net Amount
                </td>
                <td className="border border-black px-2 py-1.5 text-right font-bold bg-gray-50">
                  {formatCurrency(netTotal)}
                </td>
              </tr>
              <tr>
                <td colSpan={9} className="border border-black px-2 py-1.5 text-right">
                  CGST @ {CGST_PERCENT}% on Rs. {formatCurrency(netTotal)}
                </td>
                <td className="border border-black px-2 py-1.5 text-right">{formatCurrency(cgst)}</td>
              </tr>
              <tr>
                <td colSpan={9} className="border border-black px-2 py-1.5 text-right">
                  SGST @ {SGST_PERCENT}% on Rs. {formatCurrency(netTotal)}
                </td>
                <td className="border border-black px-2 py-1.5 text-right">{formatCurrency(sgst)}</td>
              </tr>
              <tr>
                <td colSpan={9} className="border border-black px-2 py-1.5 text-right">Round Off</td>
                <td className="border border-black px-2 py-1.5 text-right">{formatCurrency(roundOff)}</td>
              </tr>
              <tr>
                <td colSpan={9} className="border border-black px-2 py-1.5 text-right font-bold">
                  Gross Amount
                </td>
                <td className="border border-black px-2 py-1.5 text-right font-bold gross-highlight bg-cyan-400">
                  {formatCurrency(grossTotal)}
                </td>
              </tr>

              {/* Footer */}
              <tr>
                <td colSpan={10} className="border border-black p-3 footer-section">
                  <p className="font-bold mb-2 border-b border-gray-300 pb-2">{amountInWords(grossTotal)}</p>
                  <div className="flex justify-between items-end gap-4">
                    <div className="space-y-0.5">
                      <p><span className="font-semibold">GSTIN:</span> {COMPANY_INFO.gstin}</p>
                      <p><span className="font-semibold">PAN:</span> {COMPANY_INFO.pan}</p>
                      <p className="mt-2 text-[10px]">{COMPANY_INFO.termsNote}</p>
                      <p className="mt-2 italic text-[10px]">
                        Certified that the particulars given above are true and correct.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold">For {COMPANY_INFO.name}</p>
                      <div className="mt-10 border-t border-gray-400 w-40 ml-auto" />
                      <p className="mt-1 text-[10px]">Authorised Signatory</p>
                      <p className="mt-2 text-[10px] italic">E. &amp; O. E.</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <SendMailModal
        isOpen={mailOpen}
        onClose={() => setMailOpen(false)}
        customer={customer}
        order={order}
        mode="invoice"
        invoiceVariant="tax"
      />
    </div>
  )
}

export default TaxInvoice
