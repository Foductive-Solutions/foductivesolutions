import React, { useRef, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { COMPANY_INFO } from '../../config/companyInfo'

const formatMoney = (n) => `Rs. ${(n || 0).toLocaleString('en-IN')}`
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const LINE_ITEMS = [
  { qtyKey: 'qty1000ml', rateKey: 'rate1000ml', label: '1000ml Water Bottle Case' },
  { qtyKey: 'qty500ml', rateKey: 'rate500ml', label: '500ml Water Bottle Case' },
  { qtyKey: 'qty200ml', rateKey: 'rate200ml', label: '200ml Water Bottle Case' },
]

const IconDownload = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const IconPrinter = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 8.5V3.5h12v5" />
    <rect x="4" y="8.5" width="16" height="8" rx="1.4" />
    <path d="M6 15h12v5.5H6z" />
  </svg>
)

const IconShare = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const OrderReceipt = ({ order, customer, onClose }) => {
  const receiptRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [feedback, setFeedback] = useState('')

  if (!order) return null

  const orderId = order.orderId || order.id || 'RECEIPT'

  // Helper to capture the receipt element as a high-resolution canvas without tainting
  const captureReceiptCanvas = async () => {
    if (!receiptRef.current) return null
    return await html2canvas(receiptRef.current, {
      scale: 2.5,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
    })
  }

  // Helper for safe mobile & desktop file downloads via Blob
  const triggerBlobDownload = (blob, fileName) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 1500)
  }

  // Notify React Native / Expo WebView if running inside an app container
  const postToReactNativeWebView = (payload) => {
    if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
      try {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload))
      } catch (err) {
        console.warn('Could not postMessage to ReactNativeWebView:', err)
      }
    }
  }

  // 1. Download as PDF
  const handleDownloadPdf = async () => {
    try {
      setDownloading(true)
      setFeedback('Generating PDF…')
      const canvas = await captureReceiptCanvas()
      if (!canvas) throw new Error('Could not render receipt')

      const imgData = canvas.toDataURL('image/png')
      const pdfWidth = 100 // 100mm width receipt format
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, Math.max(120, pdfHeight + 10)],
      })

      pdf.addImage(imgData, 'PNG', 0, 5, pdfWidth, pdfHeight)
      const pdfFileName = `Receipt_${orderId}.pdf`

      // Save PDF via jsPDF
      pdf.save(pdfFileName)

      // Also post to React Native WebView for native handling
      try {
        postToReactNativeWebView({
          type: 'DOWNLOAD_RECEIPT',
          format: 'pdf',
          fileName: pdfFileName,
          orderId,
          dataUrl: pdf.output('datauristring'),
        })
      } catch (e) {
        console.warn('WebView event note:', e)
      }

      setFeedback('PDF downloaded successfully!')
      setTimeout(() => setFeedback(''), 3000)
    } catch (err) {
      console.error('Failed to download PDF receipt:', err)
      setFeedback('Failed to generate PDF. Using print view…')
      setTimeout(() => setFeedback(''), 3000)
      window.print()
    } finally {
      setDownloading(false)
    }
  }

  // 2. Download as Image (PNG)
  const handleDownloadImage = async () => {
    try {
      setDownloading(true)
      setFeedback('Saving image…')
      const canvas = await captureReceiptCanvas()
      if (!canvas) throw new Error('Could not render receipt')

      const fileName = `Receipt_${orderId}.png`

      canvas.toBlob((blob) => {
        if (!blob) {
          try {
            const imgData = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.href = imgData
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } catch (e) {
            console.error('DataURL download fallback failed:', e)
          }
        } else {
          triggerBlobDownload(blob, fileName)
        }

        try {
          const imgData = canvas.toDataURL('image/png')
          postToReactNativeWebView({
            type: 'DOWNLOAD_RECEIPT',
            format: 'image',
            fileName,
            orderId,
            dataUrl: imgData,
          })
        } catch (e) {
          console.warn('WebView event note:', e)
        }

        setFeedback('Receipt image saved!')
        setTimeout(() => setFeedback(''), 3000)
      }, 'image/png')
    } catch (err) {
      console.error('Failed to download receipt image:', err)
      setFeedback('Could not save image.')
      setTimeout(() => setFeedback(''), 3000)
    } finally {
      setDownloading(false)
    }
  }

  // 3. Native Share (for mobile & Expo WebViews)
  const handleShare = async () => {
    try {
      setDownloading(true)
      setFeedback('Preparing share…')
      const canvas = await captureReceiptCanvas()
      if (!canvas) throw new Error('Could not render receipt')

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setFeedback('Could not create share file.')
          return
        }
        const file = new File([blob], `Receipt_${orderId}.png`, { type: 'image/png' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `AARICH Payment Receipt (${orderId})`,
              text: `Payment Receipt for order ${orderId} - Total: ${formatMoney(order.totalBill)}`,
            })
            setFeedback('Shared successfully!')
          } catch (shareErr) {
            if (shareErr.name !== 'AbortError') {
              console.warn('Share error:', shareErr)
              handleDownloadImage()
            }
          }
        } else if (navigator.share) {
          try {
            await navigator.share({
              title: `AARICH Receipt - ${orderId}`,
              text: `AARICH Payment Receipt for ${customer?.shopName || 'Customer'}\nOrder: ${orderId}\nTotal Paid: ${formatMoney(order.totalBill)} (Paid in Full)\nDate: ${formatDate(order.date)}`,
            })
            setFeedback('Shared!')
          } catch (shareErr) {
            if (shareErr.name !== 'AbortError') handleDownloadImage()
          }
        } else {
          // Fallback to image download
          handleDownloadImage()
        }
        setTimeout(() => setFeedback(''), 3000)
      }, 'image/png')
    } catch (err) {
      console.error('Share failed:', err)
      handleDownloadImage()
    } finally {
      setDownloading(false)
    }
  }

  // 4. Native Print (calls window.print + sends bridge event)
  const handlePrint = () => {
    postToReactNativeWebView({
      type: 'PRINT_RECEIPT',
      orderId,
      order,
      customer,
    })
    window.print()
  }

  const activeLineItems = LINE_ITEMS.filter((li) => (order[li.qtyKey] || 0) > 0)

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-3 sm:p-4 backdrop-blur-sm print:static print:bg-transparent print:p-0 print:backdrop-blur-none">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #client-receipt-print-area, #client-receipt-print-area * { visibility: visible; }
          #client-receipt-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="relative my-auto flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl print:max-h-none print:w-full print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-5 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <IconCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Payment Receipt</h3>
              <p className="text-[11px] text-slate-400">Order {orderId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="border-b border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-center text-xs font-medium text-cyan-300 print:hidden">
            {feedback}
          </div>
        )}

        {/* Scrollable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div
            id="client-receipt-print-area"
            ref={receiptRef}
            className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm"
          >
            {/* Header & Logo */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/aarich_logo_mark.png"
                  alt="AARICH"
                  className="h-11 w-11 object-contain"
                />
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">{COMPANY_INFO.name}</h2>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {COMPANY_INFO.legalName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <IconCheck className="h-3 w-3" /> PAID IN FULL
                </span>
                <p className="mt-1 text-xs font-mono font-bold text-slate-700">{orderId}</p>
              </div>
            </div>

            {/* Address & Meta */}
            <div className="mt-3 text-[11px] leading-relaxed text-slate-500">
              <p>{COMPANY_INFO.registeredAddress}</p>
              {COMPANY_INFO.gstin && (
                <p className="font-mono text-[10px]">GSTIN: {COMPANY_INFO.gstin} {COMPANY_INFO.state && `· ${COMPANY_INFO.state}`}</p>
              )}
            </div>

            {/* Bill To Info */}
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer Details</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">{customer?.shopName || order.customer || 'Customer'}</p>
                  {customer?.billingPerson && (
                    <p className="text-slate-600 font-medium">{customer.billingPerson}</p>
                  )}
                  {customer?.mobile && (
                    <p className="text-slate-500 font-mono text-[11px]">Ph: {customer.mobile}</p>
                  )}
                  {customer?.location && (
                    <p className="text-slate-500 text-[11px]">Location: {customer.location}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date</p>
                  <p className="mt-0.5 font-semibold text-slate-800">{formatDate(order.date)}</p>
                  <p className="text-[11px] text-slate-500">Mode: {order.paymentMode || 'Cash'}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeLineItems.length > 0 ? (
                    activeLineItems.map((li) => {
                      const itemQty = order[li.qtyKey] || 0
                      const itemRate = order[li.rateKey] || 0
                      const itemTotal = itemQty * itemRate
                      return (
                        <tr key={li.qtyKey}>
                          <td className="py-2.5 font-medium text-slate-800">{li.label}</td>
                          <td className="py-2.5 text-right font-mono font-medium">{itemQty}</td>
                          <td className="py-2.5 text-right font-mono text-slate-600">Rs. {itemRate}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                            {formatMoney(itemTotal)}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-3 text-center text-slate-400">
                        Packaged Drinking Water Supply
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="mt-4 space-y-1.5 border-t-2 border-slate-200 pt-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Bill Amount</span>
                <span className="font-mono font-semibold text-slate-900">{formatMoney(order.totalBill)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid ({order.paymentMode || 'Cash'})</span>
                <span className="font-mono font-semibold text-emerald-600">{formatMoney(order.paid || order.totalBill)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 font-bold text-slate-900">
                <span className="text-emerald-700">Balance Due</span>
                <span className="font-mono text-emerald-700">Rs. 0 (Fully Paid)</span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-6 border-t border-slate-100 pt-3 text-center text-[10px] text-slate-400">
              <p>Thank you for your business! This is a computer-generated receipt from {COMPANY_INFO.name}.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="border-t border-white/10 bg-slate-900/90 p-4 print:hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-teal-500 active:scale-[0.98] disabled:opacity-50"
            >
              <IconDownload className="h-4 w-4" />
              <span>{downloading ? 'Saving…' : 'PDF Receipt'}</span>
            </button>

            {/* Download Image Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-[0.98] disabled:opacity-50"
            >
              <IconDownload className="h-4 w-4 text-teal-400" />
              <span>Image (PNG)</span>
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              disabled={downloading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-[0.98] disabled:opacity-50"
            >
              <IconShare className="h-4 w-4 text-cyan-400" />
              <span>Share</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-[0.98]"
            >
              <IconPrinter className="h-4 w-4 text-amber-400" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderReceipt
