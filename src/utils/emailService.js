/**
 * Email Service using EmailJS
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://www.emailjs.com/ and create a free account
 * 2. Add an Email Service (Gmail, Outlook, etc.) → get SERVICE_ID
 * 3. Create two Email Templates:
 *    a) Invoice Template (variables: to_email, to_name, from_name, order_id,
 *       order_date, items_summary, total_bill, paid_amount, balance_due,
 *       payment_mode, order_status)
 *    b) Custom Message Template (variables: to_email, to_name, from_name,
 *       subject, message)
 * 4. Go to Account → General → Public Key
 * 5. Add your keys to .env file (see below)
 *
 * .env keys to add:
 *   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *   VITE_EMAILJS_INVOICE_TEMPLATE_ID=template_xxxxxxx
 *   VITE_EMAILJS_CUSTOM_TEMPLATE_ID=template_xxxxxxx
 *   VITE_EMAILJS_PUBLIC_KEY=your_public_key
 */

import emailjs from '@emailjs/browser'
import { calculateTaxInvoice, formatCurrency } from './invoiceCalculations'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const INVOICE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_INVOICE_TEMPLATE_ID
const CUSTOM_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CUSTOM_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const isConfigured = () => {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.warn('[EmailService] EmailJS is not configured. Add VITE_EMAILJS_* keys to .env')
    return false
  }
  return true
}

/**
 * Builds a plain-text summary of the order items for the invoice email.
 */
const buildItemsSummary = (order) => {
  const lines = []
  if ((order.qty1000ml || 0) > 0)
    lines.push(`1000ml Water Bottle — ${order.qty1000ml} boxes × ₹${order.rate1000ml || 0} = ₹${(order.qty1000ml || 0) * (order.rate1000ml || 0)}`)
  if ((order.qty500ml || 0) > 0)
    lines.push(`500ml Water Bottle  — ${order.qty500ml} boxes × ₹${order.rate500ml || 0} = ₹${(order.qty500ml || 0) * (order.rate500ml || 0)}`)
  if ((order.qty200ml || 0) > 0)
    lines.push(`200ml Water Bottle  — ${order.qty200ml} boxes × ₹${order.rate200ml || 0} = ₹${(order.qty200ml || 0) * (order.rate200ml || 0)}`)
  return lines.length ? lines.join('\n') : 'No items'
}

const buildTaxItemsSummary = (order) => {
  const { lineItems, netTotal, cgst, sgst, roundOff, grossTotal } = calculateTaxInvoice(order)
  if (!lineItems.length) return 'No items'

  const lines = lineItems.map(
    (item) =>
      `${item.description} — ${item.quantity} ${item.unit} × ₹${formatCurrency(item.exclusiveRate)} = ₹${formatCurrency(item.netAmount)}`
  )
  lines.push(
    '',
    `Net Amount: ₹${formatCurrency(netTotal)}`,
    `CGST @ 9%: ₹${formatCurrency(cgst)}`,
    `SGST @ 9%: ₹${formatCurrency(sgst)}`,
    `Round Off: ₹${formatCurrency(roundOff)}`,
    `Gross Amount: ₹${formatCurrency(grossTotal)}`
  )
  return lines.join('\n')
}

/**
 * Sends an invoice email to the customer.
 *
 * @param {string} toEmail  - Recipient email address
 * @param {object} customer - Customer object (shopName, billingPerson, mobile, location)
 * @param {object} order    - Order object
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendInvoiceEmail = async (toEmail, customer, order) => {
  if (!isConfigured()) {
    return { success: false, message: 'Email service is not configured. Please add EmailJS keys to .env' }
  }
  if (!INVOICE_TEMPLATE_ID) {
    return { success: false, message: 'Invoice template ID is not set (VITE_EMAILJS_INVOICE_TEMPLATE_ID)' }
  }
  if (!order) {
    return { success: false, message: 'No order selected to send invoice for.' }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString('en-IN')
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const templateParams = {
    to_email: toEmail,
    to_name: customer?.shopName || customer?.billingPerson || 'Customer',
    from_name: 'AARICH Water Bottle Distribution',
    title: `Invoice #${order.orderId || order.id || 'N/A'}`,
    order_id: order.orderId || order.id || 'N/A',
    order_date: formatDate(order.date),
    items_summary: buildItemsSummary(order),
    total_bill: `₹ ${order.totalBill || 0}`,
    paid_amount: `₹ ${order.paid || 0}`,
    balance_due: `₹ ${order.remaining || 0}`,
    payment_mode: order.paymentMode || 'Cash',
    order_status: order.status || 'Pending',
    customer_mobile: customer?.mobile || '',
    customer_location: customer?.location || '',
  }

  try {
    await emailjs.send(SERVICE_ID, INVOICE_TEMPLATE_ID, templateParams, PUBLIC_KEY)
    return { success: true, message: `Invoice sent successfully to ${toEmail}` }
  } catch (error) {
    console.error('[EmailService] Failed to send invoice email:', error)
    return { success: false, message: error?.text || 'Failed to send email. Please try again.' }
  }
}

/**
 * Sends a GST tax invoice email to the customer.
 *
 * @param {string} toEmail  - Recipient email address
 * @param {object} customer - Customer object
 * @param {object} order    - Order object
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendTaxInvoiceEmail = async (toEmail, customer, order) => {
  if (!isConfigured()) {
    return { success: false, message: 'Email service is not configured. Please add EmailJS keys to .env' }
  }
  if (!INVOICE_TEMPLATE_ID) {
    return { success: false, message: 'Invoice template ID is not set (VITE_EMAILJS_INVOICE_TEMPLATE_ID)' }
  }
  if (!order) {
    return { success: false, message: 'No order selected to send tax invoice for.' }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString('en-IN')
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const { grossTotal } = calculateTaxInvoice(order)
  const invoiceNo = order.orderId || order.id || 'N/A'

  const templateParams = {
    to_email: toEmail,
    to_name: customer?.shopName || customer?.billingPerson || 'Customer',
    from_name: 'AARICH Water Bottle Distribution',
    title: `Tax Invoice #${invoiceNo}`,
    order_id: invoiceNo,
    order_date: formatDate(order.date),
    items_summary: buildTaxItemsSummary(order),
    total_bill: `₹ ${formatCurrency(grossTotal)}`,
    paid_amount: `₹ ${order.paid || 0}`,
    balance_due: `₹ ${order.remaining || 0}`,
    payment_mode: order.paymentMode || 'Cash',
    order_status: order.status || 'Pending',
    customer_mobile: customer?.mobile || '',
    customer_location: customer?.location || '',
  }

  try {
    await emailjs.send(SERVICE_ID, INVOICE_TEMPLATE_ID, templateParams, PUBLIC_KEY)
    return { success: true, message: `Tax invoice sent successfully to ${toEmail}` }
  } catch (error) {
    console.error('[EmailService] Failed to send tax invoice email:', error)
    return { success: false, message: error?.text || 'Failed to send email. Please try again.' }
  }
}

/**
 * Sends a custom / special message email to any recipient.
 *
 * @param {string} toEmail    - Recipient email address
 * @param {string} toName     - Recipient name
 * @param {string} subject    - Email subject line
 * @param {string} message    - Custom message body
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendCustomEmail = async (toEmail, toName, subject, message) => {
  if (!isConfigured()) {
    return { success: false, message: 'Email service is not configured. Please add EmailJS keys to .env' }
  }
  if (!CUSTOM_TEMPLATE_ID) {
    return { success: false, message: 'Custom template ID is not set (VITE_EMAILJS_CUSTOM_TEMPLATE_ID)' }
  }

  const templateParams = {
    to_email: toEmail,
    to_name: toName || 'Customer',
    from_name: 'AARICH Team',
    title: subject,
    subject,
    message,
  }

  try {
    await emailjs.send(SERVICE_ID, CUSTOM_TEMPLATE_ID, templateParams, PUBLIC_KEY)
    return { success: true, message: `Message sent successfully to ${toEmail}` }
  } catch (error) {
    console.error('[EmailService] Failed to send custom email:', error)
    return { success: false, message: error?.text || 'Failed to send email. Please try again.' }
  }
}
