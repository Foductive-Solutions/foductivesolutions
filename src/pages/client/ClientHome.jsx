import React, { useEffect, useMemo, useState } from 'react'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { addOrder, getOrdersByCustomer } from '../../firebase/services'
import { sendCustomEmail } from '../../utils/emailService'
import { COMPANY_INFO } from '../../config/companyInfo'
import OrderReceipt from './OrderReceipt'
import FeedbackModal from './FeedbackModal'

const ADMIN_NOTIFY_EMAIL = import.meta.env.VITE_ADMIN_NOTIFICATION_EMAIL

// Best-effort email to the admin's inbox when a customer places an order via portal
const notifyAdminOfNewOrder = (order, customer) => {
  if (!ADMIN_NOTIFY_EMAIL) {
    console.warn('[ClientHome] VITE_ADMIN_NOTIFICATION_EMAIL not set — skipping new-order email')
    return
  }
  const items = []
  if (order.qty200ml > 0) items.push(`${order.qty200ml} × 200ml`)
  if (order.qty500ml > 0) items.push(`${order.qty500ml} × 500ml`)
  if (order.qty1000ml > 0) items.push(`${order.qty1000ml} × 1000ml`)

  const body = [
    'New order placed via the customer portal.',
    '',
    `Shop: ${customer.shopName}`,
    `Contact: ${customer.billingPerson || '—'} · ${customer.mobile || '—'}`,
    `Location: ${customer.location || '—'}`,
    `Order ID: ${order.orderId}`,
    `Items: ${items.join(', ') || 'None'}`,
    `Estimated Total: ₹${(order.totalBill || 0).toLocaleString('en-IN')}`,
  ].join('\n')

  sendCustomEmail(ADMIN_NOTIFY_EMAIL, 'Admin', `New Order — ${customer.shopName} (${order.orderId})`, body).catch(
    (err) => console.error('[ClientHome] Failed to send new-order admin notification:', err)
  )
}

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
const IconDroplet = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2.7s7.2 8.2 7.2 13.1A7.2 7.2 0 1 1 4.8 15.8C4.8 10.9 12 2.7 12 2.7Z" /></svg>)
const IconHistory = (p) => (<svg {...icon} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.2v5l3.5 2" /></svg>)
const IconUser = (p) => (<svg {...icon} {...p}><circle cx="12" cy="8.5" r="3.4" /><path d="M4.8 19.5c0-3.6 3.2-6.2 7.2-6.2s7.2 2.6 7.2 6.2" /></svg>)
const IconLogout = (p) => (<svg {...icon} {...p}><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" /><path d="M15 16l4-4-4-4" /><path d="M19 12H9" /></svg>)
const IconPrinter = (p) => (<svg {...icon} {...p}><path d="M6 8.5V3.5h12v5" /><rect x="4" y="8.5" width="16" height="8" rx="1.4" /><path d="M6 15h12v5.5H6z" /></svg>)
const IconRefresh = (p) => (<svg {...icon} {...p}><path d="M20 11a8 8 0 0 0-14.6-4.6M4 5v5h5" /><path d="M4 13a8 8 0 0 0 14.6 4.6M20 19v-5h-5" /></svg>)
const IconPin = (p) => (<svg {...icon} {...p}><path d="M12 21s7-6.1 7-11.4A7 7 0 1 0 5 9.6C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.3" /></svg>)
const IconSearch = (p) => (<svg {...icon} {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>)
const IconCheck = (p) => (<svg {...icon} {...p}><polyline points="20 6 9 17 4 12" /></svg>)
const IconBox = (p) => (<svg {...icon} {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>)
const IconDownload = (p) => (<svg {...icon} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>)

const SIZES = [
  { id: 'qty200ml', rateKey: 'rate200ml', label: '200ml Pocket Bottle', shortLabel: '200ml', image: '/bottle-200ml.png', desc: '48 bottles / case' },
  { id: 'qty500ml', rateKey: 'rate500ml', label: '500ml Regular Bottle', shortLabel: '500ml', image: '/bottle-500ml.png', desc: '24 bottles / case' },
  { id: 'qty1000ml', rateKey: 'rate1000ml', label: '1000ml (1L) Large Bottle', shortLabel: '1000ml', image: '/bottle-1000ml.png', desc: '12 bottles / case' },
]

const parseRate = (rate) => parseInt(String(rate ?? '').replace(/[^0-9]/g, ''), 10) || 0
const formatMoney = (n) => `₹${(n || 0).toLocaleString('en-IN')}`
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_STYLES = {
  Completed: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  Pending: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
}

// ----------------------------------------------------
// TAB 1: ORDER TAB (PC + Mobile Responsive)
// ----------------------------------------------------
const OrderTab = ({ customer, orders, onOrderPlaced, refreshing }) => {
  const [qty, setQty] = useState({ qty200ml: 0, qty500ml: 0, qty1000ml: 0 })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const outstanding = useMemo(() => orders.reduce((sum, o) => sum + (o.remaining || 0), 0), [orders])

  const total = useMemo(
    () => SIZES.reduce((sum, s) => sum + qty[s.id] * parseRate(customer[s.rateKey]), 0),
    [qty, customer]
  )
  const totalUnits = qty.qty200ml + qty.qty500ml + qty.qty1000ml

  const adjust = (id, delta) => setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(500, q[id] + delta)) }))
  const setExact = (id, val) => {
    const num = Math.max(0, Math.min(500, parseInt(val, 10) || 0))
    setQty((q) => ({ ...q, [id]: num }))
  }

  const handlePlaceOrder = async () => {
    if (totalUnits === 0) return
    setSubmitting(true)
    setMessage('')
    try {
      const newOrder = {
        orderId: `ORD-${Date.now().toString().slice(-4)}`,
        customer: customer.shopName,
        customerId: customer.id,
        orderSource: 'godown',
        source: 'customer-portal',
        date: new Date().toISOString().split('T')[0],
        qty1000ml: qty.qty1000ml,
        qty500ml: qty.qty500ml,
        qty200ml: qty.qty200ml,
        rate1000ml: parseRate(customer.rate1000ml),
        rate500ml: parseRate(customer.rate500ml),
        rate200ml: parseRate(customer.rate200ml),
        totalBill: total,
        paid: 0,
        remaining: total,
        paymentMode: 'Cash',
        status: 'Pending',
      }
      await addOrder(newOrder)
      notifyAdminOfNewOrder(newOrder, customer)
      setQty({ qty200ml: 0, qty500ml: 0, qty1000ml: 0 })
      setMessage('Order placed successfully! Our delivery team has been notified.')
      onOrderPlaced()
    } catch (err) {
      console.error('Error placing order:', err)
      setMessage('Something went wrong placing your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-28 md:pb-12 pt-2 md:pt-4">
      {/* Welcome & Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 p-5 md:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Hi, {customer.billingPerson || customer.shopName}
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {customer.shopName} {customer.location ? `· ${customer.location}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {outstanding > 0 ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5">
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">Pending Dues</p>
                <p className="text-base font-bold text-amber-200">{formatMoney(outstanding)}</p>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-2 text-xs font-semibold text-emerald-300">
              <IconCheck className="h-4 w-4" /> All dues cleared
            </div>
          )}

          <button
            type="button"
            onClick={onOrderPlaced}
            disabled={refreshing}
            aria-label="Refresh orders"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-slate-300 transition hover:bg-slate-700 active:scale-95 disabled:opacity-50"
            title="Refresh order data"
          >
            <IconRefresh className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Products (Left) + Order Summary (Right on PC) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Cards */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-300">
              Select Drinking Water Bottles
            </h2>
            <span className="text-xs text-slate-500">Cases / Boxes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {SIZES.map((s) => {
              const rate = parseRate(customer[s.rateKey])
              const itemQty = qty[s.id]
              const itemSubtotal = itemQty * rate
              const isSelected = itemQty > 0

              return (
                <div
                  key={s.id}
                  className={`flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition ${
                    isSelected
                      ? 'border-cyan-500/50 bg-slate-900/90 shadow-lg shadow-cyan-500/5'
                      : 'border-white/10 bg-slate-900/50 hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Bottle Image & Rate */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800/60 p-1">
                        <img
                          src={s.image}
                          alt={s.label}
                          className="h-12 w-auto object-contain drop-shadow"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/20">
                          {formatMoney(rate)}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">per box</p>
                      </div>
                    </div>

                    <h3 className="font-bold text-white text-base">{s.label}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    {/* Quick Add Pills */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <span className="text-[10px] text-slate-500 mr-1">Quick:</span>
                      {[5, 10, 25].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => adjust(s.id, val)}
                          className="rounded-md border border-white/10 bg-slate-800/90 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                          +{val}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => adjust(s.id, -1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-lg font-bold text-slate-200 transition hover:bg-slate-700 active:scale-95"
                        aria-label={`Decrease ${s.label}`}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={itemQty || ''}
                        placeholder="0"
                        onChange={(e) => setExact(s.id, e.target.value)}
                        className="w-16 rounded-lg border border-slate-700 bg-slate-950 py-1.5 text-center font-mono text-base font-bold text-white outline-none focus:border-cyan-500"
                      />

                      <button
                        type="button"
                        onClick={() => adjust(s.id, 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-lg font-bold text-slate-200 transition hover:bg-slate-700 active:scale-95"
                        aria-label={`Increase ${s.label}`}
                      >
                        +
                      </button>
                    </div>

                    {itemQty > 0 && (
                      <div className="mt-2.5 flex justify-between text-xs text-slate-400">
                        <span>Subtotal:</span>
                        <span className="font-mono font-bold text-cyan-300">{formatMoney(itemSubtotal)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {message && (
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm font-medium text-cyan-200 flex items-center gap-2">
              <IconCheck className="h-5 w-5 shrink-0 text-cyan-400" />
              <span>{message}</span>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-20 rounded-2xl border border-white/10 bg-slate-900/90 p-5 md:p-6 shadow-xl backdrop-blur space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <IconBox className="h-5 w-5 text-cyan-400" />
                Order Summary
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {totalUnits} {totalUnits === 1 ? 'case' : 'cases'}
              </span>
            </div>

            {/* Selected Items List */}
            {totalUnits === 0 ? (
              <div className="py-6 text-center text-slate-500 text-sm">
                <p>No bottle quantities added yet.</p>
                <p className="text-xs text-slate-600 mt-1">Select cases from the list to preview total.</p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {SIZES.filter((s) => qty[s.id] > 0).map((s) => {
                  const rate = parseRate(customer[s.rateKey])
                  return (
                    <div key={s.id} className="flex justify-between items-center py-1 border-b border-white/5">
                      <div>
                        <p className="font-semibold text-slate-200">{s.shortLabel} Water Bottle</p>
                        <p className="text-[11px] text-slate-500">{qty[s.id]} boxes × {formatMoney(rate)}</p>
                      </div>
                      <span className="font-mono font-bold text-white">{formatMoney(qty[s.id] * rate)}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Delivery Info */}
            <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <IconPin className="h-3.5 w-3.5 text-cyan-400" /> Delivery Address
              </div>
              <p className="text-[11px] text-slate-400 pl-5">
                {customer.shopName}, {customer.location || 'Pune Godown Supply'}
              </p>
            </div>

            {/* Total Calculation */}
            <div className="border-t border-white/10 pt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Cases</span>
                <span className="font-bold text-white">{totalUnits}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-slate-300">Estimated Total</span>
                <span className="text-2xl font-black text-cyan-300">{formatMoney(total)}</span>
              </div>
            </div>

            {/* Place Order Button (Desktop PC View) */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={totalUnits === 0 || submitting}
              className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-teal-500 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Placing Order…' : `Place Order (${formatMoney(total)})`}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Bottom Bar for Ordering (< lg screens) */}
      <div className="lg:hidden fixed inset-x-0 bottom-16 z-30 border-t border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur shadow-2xl">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-slate-500">{totalUnits} {totalUnits === 1 ? 'case' : 'cases'}</p>
            <p className="text-lg font-extrabold text-white">{formatMoney(total)}</p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={totalUnits === 0 || submitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 disabled:opacity-40"
          >
            {submitting ? 'Placing…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------
// TAB 2: HISTORY TAB (PC + Mobile Responsive & Receipt Download)
// ----------------------------------------------------
const HistoryTab = ({ orders, loading, customer, onRefresh, refreshing }) => {
  const [receiptOrder, setReceiptOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL') // ALL | PAID | DUE

  // Metrics
  const totalOrders = orders.length
  const totalPaidOrders = orders.filter((o) => !(o.remaining > 0)).length
  const totalPendingDues = orders.reduce((sum, o) => sum + (o.remaining || 0), 0)

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const orderCode = String(o.orderId || o.id || '').toLowerCase()
      const dateStr = String(o.date || '').toLowerCase()
      const matchesSearch = !searchTerm || orderCode.includes(searchTerm.toLowerCase()) || dateStr.includes(searchTerm.toLowerCase())

      const isPaid = !(o.remaining > 0)
      if (filterStatus === 'PAID') return matchesSearch && isPaid
      if (filterStatus === 'DUE') return matchesSearch && !isPaid
      return matchesSearch
    })
  }, [orders, searchTerm, filterStatus])

  return (
    <div className="space-y-6 pb-28 md:pb-12 pt-2 md:pt-4">
      {/* Header & KPI Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Order History</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Track all your past drinking water orders, payment status, and download receipts.
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh orders"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-slate-300 transition hover:bg-slate-700 active:scale-95 disabled:opacity-50"
            title="Refresh list"
          >
            <IconRefresh className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 3 Metric Cards on PC & Tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders Placed</p>
            <p className="mt-1 text-2xl font-black text-white">{totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paid in Full</p>
            <p className="mt-1 text-2xl font-black text-emerald-400">{totalPaidOrders}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Outstanding Balance</p>
            <p className={`mt-1 text-2xl font-black ${totalPendingDues > 0 ? 'text-amber-300' : 'text-slate-300'}`}>
              {formatMoney(totalPendingDues)}
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID or Date…"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-white/10 bg-slate-900/90 p-1">
            {[
              { id: 'ALL', label: `All (${totalOrders})` },
              { id: 'PAID', label: `Paid (${totalPaidOrders})` },
              { id: 'DUE', label: `Due (${totalOrders - totalPaidOrders})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterStatus(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  filterStatus === f.id
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400">
          <IconRefresh className="mx-auto h-6 w-6 animate-spin text-cyan-400 mb-2" />
          <p className="text-sm font-medium">Loading your order history…</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-base font-semibold text-white">No orders found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || filterStatus !== 'ALL'
              ? 'Try changing your search keyword or filters.'
              : 'You have not placed any orders yet. Click on the Order tab to get started!'}
          </p>
        </div>
      ) : (
        <>
          {/* PC / Tablet Desktop Table View (hidden on small mobile) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Items Breakdown</th>
                  <th className="py-3.5 px-4 text-right">Total Bill</th>
                  <th className="py-3.5 px-4 text-center">Payment Status</th>
                  <th className="py-3.5 px-4 text-right">Receipt / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((o) => {
                  const isPaid = !(o.remaining > 0)
                  return (
                    <tr key={o.id} className="transition hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white font-mono">{o.orderId || o.id}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(o.date)}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {o.qty200ml > 0 && (
                            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-white/5">
                              {o.qty200ml} × 200ml
                            </span>
                          )}
                          {o.qty500ml > 0 && (
                            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-white/5">
                              {o.qty500ml} × 500ml
                            </span>
                          )}
                          {o.qty1000ml > 0 && (
                            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-white/5">
                              {o.qty1000ml} × 1000ml
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                        {formatMoney(o.totalBill)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                            <IconCheck className="h-3 w-3" /> Paid in full
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                            Due {formatMoney(o.remaining)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => setReceiptOrder(o)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20 active:scale-95 shadow-sm"
                          >
                            <IconPrinter className="h-3.5 w-3.5" />
                            <span>Receipt / PDF</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Receipt on payment</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (shown on mobile screens < md) */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((o) => {
              const isPaid = !(o.remaining > 0)
              return (
                <div key={o.id} className="rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white font-mono">{o.orderId || o.id}</p>
                      <p className="text-xs text-slate-500">{formatDate(o.date)}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[o.status] || 'border-slate-700 text-slate-400'}`}>
                      {o.status || 'Pending'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                    {o.qty200ml > 0 && <span className="rounded bg-slate-800 px-2 py-0.5">{o.qty200ml} × 200ml</span>}
                    {o.qty500ml > 0 && <span className="rounded bg-slate-800 px-2 py-0.5">{o.qty500ml} × 500ml</span>}
                    {o.qty1000ml > 0 && <span className="rounded bg-slate-800 px-2 py-0.5">{o.qty1000ml} × 1000ml</span>}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-2 text-sm">
                    <span className="text-slate-400">Total {formatMoney(o.totalBill)}</span>
                    {isPaid ? (
                      <span className="font-bold text-emerald-400">Paid in full</span>
                    ) : (
                      <span className="font-bold text-amber-300">Due {formatMoney(o.remaining)}</span>
                    )}
                  </div>

                  {isPaid && (
                    <button
                      type="button"
                      onClick={() => setReceiptOrder(o)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-xs font-bold text-cyan-300 active:bg-cyan-500/20"
                    >
                      <IconPrinter className="h-4 w-4" />
                      View & Download Receipt
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Full Receipt Modal */}
      {receiptOrder && (
        <OrderReceipt
          order={receiptOrder}
          customer={customer}
          onClose={() => setReceiptOrder(null)}
        />
      )}
    </div>
  )
}

// ----------------------------------------------------
// TAB 3: ACCOUNT TAB (PC + Mobile Responsive)
// ----------------------------------------------------
const AccountTab = ({ customer, onLogout }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <div className="space-y-6 pb-28 md:pb-12 pt-2 md:pt-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Account & Profile</h1>
        <p className="text-xs md:text-sm text-slate-400">
          Manage your customer account details and business support info.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Customer Details */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <IconUser className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">{customer.shopName}</h2>
              <p className="text-xs text-slate-400">Verified Customer Profile</p>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {[
              ['Shop Name', customer.shopName],
              ['Billing Person', customer.billingPerson],
              ['Contact Mobile', customer.mobile],
              ['Delivery Location', customer.location],
              ['Username / ID', customer.loginUsername || customer.id],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="text-xs font-medium text-slate-400">{label}</span>
                <span className="text-xs font-semibold text-white">{value || '—'}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/60 bg-red-950/40 py-3 text-xs font-bold text-red-300 transition hover:bg-red-900/40 active:scale-[0.98]"
            >
              <IconLogout className="h-4 w-4" />
              Sign Out of Customer Portal
            </button>
          </div>
        </div>

        {/* Right Cards: Support & Feedback */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 md:p-6 shadow-xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <IconPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{COMPANY_INFO.name} — {COMPANY_INFO.legalName}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{COMPANY_INFO.registeredAddress}</p>
                {COMPANY_INFO.gstin && (
                  <p className="text-[11px] font-mono text-slate-500 mt-1.5">
                    GSTIN: {COMPANY_INFO.gstin} · State: {COMPANY_INFO.state}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  Need a custom rate, order inquiry or address change? Contact AARICH management directly.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 md:p-6 shadow-xl space-y-3">
            <h3 className="font-bold text-white text-sm">Have Feedback or Suggestions?</h3>
            <p className="text-xs text-slate-400">
              Let us know about your water supply delivery experience, bottle quality or any suggestions to help us serve you better.
            </p>
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 active:scale-[0.98]"
            >
              ★ Leave Customer Feedback
            </button>
          </div>
        </div>
      </div>

      {feedbackOpen && <FeedbackModal customer={customer} onClose={() => setFeedbackOpen(false)} />}
    </div>
  )
}

const TABS = [
  { id: 'order', label: 'Order', icon: IconDroplet },
  { id: 'history', label: 'History', icon: IconHistory },
  { id: 'account', label: 'Account', icon: IconUser },
]

// ----------------------------------------------------
// MAIN CLIENT HOME (PC + Mobile Responsive Shell)
// ----------------------------------------------------
const ClientHome = () => {
  const { customer, logout } = useCustomerAuth()
  const [activeTab, setActiveTab] = useState('order')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrders = async () => {
    if (!customer) return
    const data = await getOrdersByCustomer(customer.id)
    setOrders(data)
  }

  useEffect(() => {
    setOrdersLoading(true)
    fetchOrders()
      .catch((err) => console.error('Error loading order history:', err))
      .finally(() => setOrdersLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchOrders()
    } catch (err) {
      console.error('Error refreshing orders:', err)
    } finally {
      setRefreshing(false)
    }
  }

  if (!customer) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header Bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between py-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img src="/aarich_logo_mark.png" alt="AARICH" className="h-8 w-8 object-contain" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">AARICH</span>
              <span className="hidden sm:inline-block rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
                Customer Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Center on PC) */}
          <nav className="hidden md:flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-inner">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = activeTab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.label}</span>
                  {t.id === 'history' && orders.length > 0 && (
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {orders.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* User Shop Badge & Quick Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{customer.shopName}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{customer.billingPerson || 'Verified Account'}</p>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400 hover:bg-red-950/40 hover:border-red-900 hover:text-red-300 transition active:scale-95"
            >
              <IconLogout className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area: Responsive Width */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {activeTab === 'order' && (
          <OrderTab customer={customer} orders={orders} onOrderPlaced={handleRefresh} refreshing={refreshing} />
        )}
        {activeTab === 'history' && (
          <HistoryTab orders={orders} loading={ordersLoading} customer={customer} onRefresh={handleRefresh} refreshing={refreshing} />
        )}
        {activeTab === 'account' && <AccountTab customer={customer} onLogout={logout} />}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop PC >= md) */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/95 backdrop-blur shadow-2xl">
        <div className="mx-auto flex max-w-md">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold transition ${
                  active ? 'text-cyan-300 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default ClientHome

