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

const SIZES = [
  { id: 'qty200ml', rateKey: 'rate200ml', label: '200ml Bottle', image: '/bottle-200ml.png' },
  { id: 'qty500ml', rateKey: 'rate500ml', label: '500ml Bottle', image: '/bottle-500ml.png' },
  { id: 'qty1000ml', rateKey: 'rate1000ml', label: '1000ml (1L) Bottle', image: '/bottle-1000ml.png' },
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
// TAB 1: ORDER TAB (Clean, simple mobile-first UI)
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
      setMessage('Order placed! Our team will confirm delivery shortly.')
      onOrderPlaced()
    } catch (err) {
      console.error('Error placing order:', err)
      setMessage('Something went wrong placing your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5 pb-28 pt-4">
      {/* Top Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Hi, {customer.billingPerson || customer.shopName}</h1>
          <p className="text-sm text-slate-400">{customer.shopName}</p>
        </div>
        <button
          type="button"
          onClick={onOrderPlaced}
          disabled={refreshing}
          aria-label="Refresh"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
          title="Refresh"
        >
          <IconRefresh className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Outstanding Balance Banner */}
      {outstanding > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
          <span className="text-sm text-amber-200">Outstanding balance</span>
          <span className="font-semibold text-amber-300">{formatMoney(outstanding)}</span>
        </div>
      )}

      {/* New Order Bottle List */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">New Order</h2>
        <div className="space-y-3">
          {SIZES.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 shadow-sm transition hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 p-1">
                  <img
                    src={s.image}
                    alt={s.label}
                    className="h-9 w-auto max-w-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm sm:text-base">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatMoney(parseRate(customer[s.rateKey]))} <span className="text-slate-500">/ box</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => adjust(s.id, -1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-lg font-bold text-slate-200 hover:bg-slate-700 transition active:scale-95"
                  aria-label={`Decrease ${s.label}`}
                >
                  −
                </button>
                <span className="w-8 text-center text-base font-bold tabular-nums text-white">
                  {qty[s.id]}
                </span>
                <button
                  type="button"
                  onClick={() => adjust(s.id, 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-lg font-bold text-slate-200 hover:bg-slate-700 transition active:scale-95"
                  aria-label={`Increase ${s.label}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation / Notification Message */}
      {message && (
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-200 flex items-center gap-2">
          <IconCheck className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Floating Bottom Bar (Sticky Order Total & Place Order Button) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur shadow-2xl">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Estimated total</p>
            <p className="text-lg font-extrabold text-white">{formatMoney(total)}</p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={totalUnits === 0 || submitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-teal-500 active:scale-[0.98] disabled:opacity-40"
          >
            {submitting ? 'Placing…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------
// TAB 2: HISTORY TAB (Order History & Receipts)
// ----------------------------------------------------
const HistoryTab = ({ orders, loading, customer, onRefresh, refreshing }) => {
  const [receiptOrder, setReceiptOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL') // ALL | PAID | DUE

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
    <div className="space-y-4 pb-28 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Order History</h1>
          <p className="text-xs text-slate-400">View past orders and download payment receipts</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
        >
          <IconRefresh className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Filter */}
      {orders.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID or date…"
              className="w-full rounded-xl border border-white/10 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900 p-1">
            {['ALL', 'PAID', 'DUE'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  filterStatus === status ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {status === 'ALL' ? 'All' : status === 'PAID' ? 'Paid' : 'Due'}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-center text-sm text-slate-400">
          <IconRefresh className="mx-auto h-5 w-5 animate-spin text-cyan-400 mb-2" />
          Loading orders…
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-center text-sm text-slate-400">
          {orders.length === 0 ? 'No orders yet — place your first order from the Order tab.' : 'No matching orders found.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((o) => {
            const isPaid = !(o.remaining > 0)
            return (
              <div key={o.id} className="rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white font-mono">{o.orderId || o.id}</p>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[o.status] || 'border-slate-700 text-slate-400'}`}>
                    {o.status || 'Pending'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{formatDate(o.date)}</p>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                  {o.qty200ml > 0 && <span className="rounded-lg bg-slate-800 px-2 py-0.5 border border-white/5">{o.qty200ml} × 200ml</span>}
                  {o.qty500ml > 0 && <span className="rounded-lg bg-slate-800 px-2 py-0.5 border border-white/5">{o.qty500ml} × 500ml</span>}
                  {o.qty1000ml > 0 && <span className="rounded-lg bg-slate-800 px-2 py-0.5 border border-white/5">{o.qty1000ml} × 1000ml</span>}
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-sm">
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
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 active:scale-[0.98]"
                  >
                    <IconPrinter className="h-3.5 w-3.5" />
                    Download / Share Receipt
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Receipt View Modal */}
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
// TAB 3: ACCOUNT TAB (Client Details & Feedback)
// ----------------------------------------------------
const AccountTab = ({ customer, onLogout }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <div className="space-y-5 pb-28 pt-4">
      <div>
        <h1 className="text-xl font-bold text-white">Account</h1>
        <p className="text-xs text-slate-400">Customer account details and support info</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900 divide-y divide-white/5 shadow-sm">
        {[
          ['Shop Name', customer.shopName],
          ['Billing Person', customer.billingPerson],
          ['Contact Mobile', customer.mobile],
          ['Delivery Location', customer.location],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between px-4 py-3.5">
            <span className="text-xs text-slate-400 font-medium">{label}</span>
            <span className="text-xs font-semibold text-white">{value || '—'}</span>
          </div>
        ))}
      </div>

      {/* Leave Feedback Button */}
      <button
        type="button"
        onClick={() => setFeedbackOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 active:scale-[0.98]"
      >
        ★ Leave Feedback & Suggestions
      </button>

      {/* Sign Out Button: HIDDEN ON MOBILE (visible only on desktop md: screens) */}
      <button
        type="button"
        onClick={onLogout}
        className="hidden md:flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/60 bg-red-950/40 py-3 text-xs font-bold text-red-300 transition hover:bg-red-900/40 active:scale-[0.98]"
      >
        <IconLogout className="h-4 w-4" />
        Sign Out of Customer Portal
      </button>

      {/* Company Info Box */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-xs text-slate-400">
        <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
        <div>
          <p className="font-bold text-slate-200">{COMPANY_INFO.name} — {COMPANY_INFO.legalName}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">{COMPANY_INFO.registeredAddress}</p>
          <p className="mt-1.5 text-[11px] text-slate-500">Need a custom rate, order inquiry or address change? Contact AARICH directly.</p>
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
// MAIN CLIENT HOME CONTAINER
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
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-md md:max-w-2xl px-4 flex items-center justify-between py-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <img src="/aarich_logo_mark.png" alt="AARICH" className="h-8 w-8 object-contain" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base">AARICH</span>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
                Customer Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900 p-1">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = activeTab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Desktop Only: Sign Out Button (Completely HIDDEN on Mobile UI) */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{customer.shopName}</span>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-slate-400 hover:bg-red-950/40 hover:border-red-900 hover:text-red-300 transition active:scale-95"
            >
              <IconLogout className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-md md:max-w-2xl px-4">
        {activeTab === 'order' && (
          <OrderTab customer={customer} orders={orders} onOrderPlaced={handleRefresh} refreshing={refreshing} />
        )}
        {activeTab === 'history' && (
          <HistoryTab orders={orders} loading={ordersLoading} customer={customer} onRefresh={handleRefresh} refreshing={refreshing} />
        )}
        {activeTab === 'account' && <AccountTab customer={customer} onLogout={logout} />}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop >= md) */}
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
