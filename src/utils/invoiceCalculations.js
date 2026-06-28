const CGST_RATE = 0.025
const SGST_RATE = 0.025
const GST_MULTIPLIER = 1 + CGST_RATE + SGST_RATE

const PRODUCT_LINES = [
  { qtyKey: 'qty1000ml', rateKey: 'rate1000ml', description: '1000 ML WATER BOTTLE BOX' },
  { qtyKey: 'qty500ml', rateKey: 'rate500ml', description: '500 ML WATER BOTTLE BOX' },
  { qtyKey: 'qty200ml', rateKey: 'rate200ml', description: '200 ML WATER BOTTLE BOX' },
]

export const CGST_PERCENT = CGST_RATE * 100
export const SGST_PERCENT = SGST_RATE * 100

const round2 = (value) => Math.round(value * 100) / 100

export function buildTaxInvoiceLineItems(order) {
  const items = []

  PRODUCT_LINES.forEach(({ qtyKey, rateKey, description }) => {
    const qty = parseInt(order[qtyKey], 10) || 0
    const inclusiveRate = parseFloat(order[rateKey]) || 0
    if (qty <= 0) return

    const grossAmount = qty * inclusiveRate
    const netAmount = grossAmount / GST_MULTIPLIER
    const exclusiveRate = inclusiveRate / GST_MULTIPLIER

    items.push({
      description,
      cgstPercent: CGST_PERCENT,
      sgstPercent: SGST_PERCENT,
      quantity: qty,
      unit: 'Box',
      inclusiveRate,
      exclusiveRate: round2(exclusiveRate),
      netAmount: round2(netAmount),
      grossAmount: round2(grossAmount),
    })
  })

  return items
}

export function calculateTaxInvoiceTotals(lineItems) {
  const netTotal = round2(lineItems.reduce((sum, item) => sum + item.netAmount, 0))
  const cgst = round2(netTotal * CGST_RATE)
  const sgst = round2(netTotal * SGST_RATE)
  const beforeRoundOff = round2(netTotal + cgst + sgst)
  const grossTotal = Math.round(beforeRoundOff)
  const roundOff = round2(grossTotal - beforeRoundOff)

  return { netTotal, cgst, sgst, roundOff, grossTotal, beforeRoundOff }
}

export function calculateTaxInvoice(order) {
  const lineItems = buildTaxInvoiceLineItems(order)
  const totals = calculateTaxInvoiceTotals(lineItems)
  return { lineItems, ...totals }
}

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function twoDigitWords(n) {
  if (n < 10) return ones[n]
  if (n < 20) return teens[n - 10]
  return `${tens[Math.floor(n / 10)]}${ones[n % 10] ? ` ${ones[n % 10]}` : ''}`
}

function threeDigitWords(n) {
  if (n === 0) return ''
  if (n < 100) return twoDigitWords(n)
  return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${twoDigitWords(n % 100)}` : ''}`
}

function convertIndianNumber(num) {
  if (num === 0) return 'Zero'

  const crore = Math.floor(num / 10000000)
  const lakh = Math.floor((num % 10000000) / 100000)
  const thousand = Math.floor((num % 100000) / 1000)
  const hundred = num % 1000

  const parts = []
  if (crore) parts.push(`${twoDigitWords(crore)} Crore`)
  if (lakh) parts.push(`${twoDigitWords(lakh)} Lakh`)
  if (thousand) parts.push(`${twoDigitWords(thousand)} Thousand`)
  if (hundred) parts.push(threeDigitWords(hundred))

  return parts.join(' ').trim()
}

export function amountInWords(amount) {
  const rupees = Math.floor(Math.abs(amount))
  const words = convertIndianNumber(rupees)
  return `Rs: ${words} Only`
}

export function formatInvoiceDate(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date()
  if (Number.isNaN(date.getTime())) return dateStr || ''
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatCurrency(value) {
  return round2(value).toFixed(2)
}
