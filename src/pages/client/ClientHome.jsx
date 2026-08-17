import React, { useEffect, useMemo, useState } from 'react'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { addOrder, getOrdersByCustomer } from '../../firebase/services'
import { sendCustomEmail } from '../../utils/emailService'

const ADMIN_NOTIFY_EMAIL = import.meta.env.VITE_ADMIN_NOTIFICATION_EMAIL

// Best-effort email to the admin's personal inbox when a customer places an order
// via the portal — never blocks or fails the order itself if it can't send.
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
    `Order ID: ${order.orderId}`,
    `Items: ${items.join(', ') || 'None'}`,
    `Estimated Total: ${formatMoney(order.totalBill)}`,
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

const SIZES = [
  { id: 'qty200ml', rateKey: 'rate200ml', label: '200ml' },
  { id: 'qty500ml', rateKey: 'rate500ml', label: '500ml' },
  { id: 'qty1000ml', rateKey: 'rate1000ml', label: '1000ml' },
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

const OrderTab = ({ customer, orders, onOrderPlaced }) => {
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
    <div className="space-y-5 px-4 pb-28 pt-5">
      <div>
        <h1 className="text-xl font-bold text-white">Hi, {customer.billingPerson || customer.shopName}</h1>
        <p className="text-sm text-slate-400">{customer.shopName}</p>
      </div>

      {outstanding > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <span className="text-sm text-amber-200">Outstanding balance</span>
          <span className="font-semibold text-amber-300">{formatMoney(outstanding)}</span>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">New Order</h2>
        <div className="space-y-3">
          {SIZES.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900 px-4 py-3.5">
              <div>
                <p className="font-semibold text-white">{s.label}</p>
                <p className="text-xs text-slate-500">{formatMoney(parseRate(customer[s.rateKey]))} / box</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjust(s.id, -1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-lg text-slate-300 active:bg-slate-800"
                  aria-label={`Decrease ${s.label}`}
                >
                  −
                </button>
                <span className="w-8 text-center text-lg font-bold tabular-nums text-white">{qty[s.id]}</span>
                <button
                  type="button"
                  onClick={() => adjust(s.id, 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-lg text-slate-300 active:bg-slate-800"
                  aria-label={`Increase ${s.label}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {message && (
        <p className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2.5 text-sm text-cyan-200">{message}</p>
      )}

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Estimated total</p>
            <p className="text-lg font-bold text-white">{formatMoney(total)}</p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={totalUnits === 0 || submitting}
            className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 disabled:opacity-40"
          >
            {submitting ? 'Placing…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

const HistoryTab = ({ orders, loading }) => (
  <div className="space-y-3 px-4 pb-24 pt-5">
    <h1 className="text-xl font-bold text-white">Order History</h1>
    {loading ? (
      <p className="text-sm text-slate-400">Loading…</p>
    ) : orders.length === 0 ? (
      <p className="text-sm text-slate-400">No orders yet — place your first order from the Order tab.</p>
    ) : (
      orders.map((o) => (
        <div key={o.id} className="rounded-xl border border-white/10 bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">{o.orderId || o.id}</p>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status] || 'border-slate-700 text-slate-400'}`}>
              {o.status || 'Pending'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{formatDate(o.date)}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            {o.qty200ml > 0 && <span>{o.qty200ml} × 200ml</span>}
            {o.qty500ml > 0 && <span>{o.qty500ml} × 500ml</span>}
            {o.qty1000ml > 0 && <span>{o.qty1000ml} × 1000ml</span>}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-sm">
            <span className="text-slate-400">Total {formatMoney(o.totalBill)}</span>
            {o.remaining > 0 ? (
              <span className="font-semibold text-amber-300">Due {formatMoney(o.remaining)}</span>
            ) : (
              <span className="font-semibold text-emerald-300">Paid in full</span>
            )}
          </div>
        </div>
      ))
    )}
  </div>
)

const AccountTab = ({ customer, onLogout }) => (
  <div className="space-y-5 px-4 pb-24 pt-5">
    <h1 className="text-xl font-bold text-white">Account</h1>
    <div className="rounded-xl border border-white/10 bg-slate-900 divide-y divide-white/5">
      {[
        ['Shop Name', customer.shopName],
        ['Billing Person', customer.billingPerson],
        ['Mobile', customer.mobile],
        ['Location', customer.location],
      ].map(([label, value]) => (
        <div key={label} className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-slate-500">{label}</span>
          <span className="text-sm font-medium text-white">{value || '—'}</span>
        </div>
      ))}
    </div>
    <button
      type="button"
      onClick={onLogout}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-900 bg-red-950/40 py-3 font-semibold text-red-300"
    >
      <IconLogout className="h-4 w-4" />
      Log Out
    </button>
    <p className="text-center text-xs text-slate-600">Need a rate or detail changed? Contact AARICH directly.</p>
  </div>
)

const TABS = [
  { id: 'order', label: 'Order', icon: IconDroplet },
  { id: 'history', label: 'History', icon: IconHistory },
  { id: 'account', label: 'Account', icon: IconUser },
]

const ClientHome = () => {
  const { customer, logout } = useCustomerAuth()
  const [activeTab, setActiveTab] = useState('order')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const loadOrders = async () => {
    if (!customer) return
    try {
      setOrdersLoading(true)
      const data = await getOrdersByCustomer(customer.id)
      setOrders(data)
    } catch (err) {
      console.error('Error loading order history:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id])

  if (!customer) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="sticky top-0 z-20 flex items-center gap-2.5 border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur">
        <img src="/aarich_logo_mark.png" alt="AARICH" className="h-8 w-8 object-contain" />
        <span className="font-bold text-white">AARICH</span>
      </header>

      <main className="mx-auto max-w-md">
        {activeTab === 'order' && <OrderTab customer={customer} orders={orders} onOrderPlaced={loadOrders} />}
        {activeTab === 'history' && <HistoryTab orders={orders} loading={ordersLoading} />}
        {activeTab === 'account' && <AccountTab customer={customer} onLogout={logout} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-md">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition ${active ? 'text-cyan-300' : 'text-slate-500'}`}
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default ClientHome
