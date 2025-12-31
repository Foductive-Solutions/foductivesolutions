import React, { useState } from 'react'
import Modal from '../../components/Modal'
import AddOrderForm from '../../components/forms/AddOrderForm'

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      orderId: "ORD-1023",
      customer: "Hotel Sai Palace",
      date: "05 Feb 2026",
      qty1000ml: 50,
      qty500ml: 30,
      qty100ml: 100,
      rate1000ml: 45,
      rate500ml: 25,
      rate100ml: 8,
      totalBill: 3200,
      paid: 2000,
      remaining: 1200,
      paymentMode: "Cash",
      status: "Pending"
    },
    {
      orderId: "ORD-1022",
      customer: "Green Leaf Cafe",
      date: "05 Feb 2026",
      qty1000ml: 30,
      qty500ml: 20,
      qty100ml: 50,
      rate1000ml: 42,
      rate500ml: 23,
      rate100ml: 7,
      totalBill: 1850,
      paid: 1850,
      remaining: 0,
      paymentMode: "UPI",
      status: "Completed"
    },
    {
      orderId: "ORD-1021",
      customer: "Royal Mess",
      date: "04 Feb 2026",
      qty1000ml: 40,
      qty500ml: 25,
      qty100ml: 80,
      rate1000ml: 48,
      rate500ml: 26,
      rate100ml: 9,
      totalBill: 2100,
      paid: 1500,
      remaining: 600,
      paymentMode: "Check",
      status: "Partial"
    },
  ])

  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [settleModal, setSettleModal] = useState({ isOpen: false, orderId: null })
  const [settlementAmount, setSettlementAmount] = useState('')

  const handleAddOrder = (formData) => {
    const q1 = parseInt(formData.qty1000ml) || 0
    const q2 = parseInt(formData.qty500ml) || 0
    const q3 = parseInt(formData.qty100ml) || 0
    const r1 = parseInt(formData.rate1000ml) || 0
    const r2 = parseInt(formData.rate500ml) || 0
    const r3 = parseInt(formData.rate100ml) || 0
    const totalBill = q1 * r1 + q2 * r2 + q3 * r3
    const paid = parseInt(formData.paid) || 0

    const newOrder = {
      orderId: `ORD-${1024 + orders.length}`,
      customer: formData.customer,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      qty1000ml: q1,
      qty500ml: q2,
      qty100ml: q3,
      rate1000ml: r1,
      rate500ml: r2,
      rate100ml: r3,
      totalBill: totalBill,
      paid: paid,
      remaining: totalBill - paid,
      paymentMode: formData.paymentMode,
      status: paid >= totalBill ? "Completed" : "Pending"
    }
    setOrders([newOrder, ...orders])
    setIsModalOpen(false)
    alert('Order created successfully!')
  }

  const openSettleModal = (orderId) => {
    setSettleModal({ isOpen: true, orderId })
    setSettlementAmount('')
  }

  const handleSettlePayment = () => {
    const order = orders.find(o => o.orderId === settleModal.orderId)
    if (!order) return
    
    const additionalPayment = parseInt(settlementAmount) || 0
    if (additionalPayment <= 0) {
      alert('Please enter a valid amount')
      return
    }

    const updatedOrders = orders.map(o => {
      if (o.orderId === settleModal.orderId) {
        const newPaid = o.paid + additionalPayment
        const newRemaining = Math.max(0, o.totalBill - newPaid)
        return {
          ...o,
          paid: newPaid,
          remaining: newRemaining,
          status: newRemaining === 0 ? "Completed" : o.status
        }
      }
      return o
    })
    setOrders(updatedOrders)
    setSettleModal({ isOpen: false, orderId: null })
    setSettlementAmount('')
    alert('Payment recorded successfully!')
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="space-y-6 text-slate-200">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Orders
          </h1>
          <p className="text-sm text-slate-400">
            View and manage all customer orders
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          + New Order
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-0">
        {['all', 'completed', 'pending', 'partial'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              filter === tab
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">1000ml</th>
                <th className="px-4 py-3 text-center">500ml</th>
                <th className="px-4 py-3 text-center">100ml</th>
                <th className="px-4 py-3 text-right">Total Bill</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Remaining</th>
                <th className="px-4 py-3 text-left">Payment Mode</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-slate-800 transition">
                  <td className="px-4 py-3 text-teal-400 font-medium">
                    {order.orderId}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {order.date}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300">
                    {order.qty1000ml}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300">
                    {order.qty500ml}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300">
                    {order.qty100ml}
                  </td>
                  <td className="px-4 py-3 text-right text-yellow-400 font-medium">
                    ₹ {order.totalBill}
                  </td>
                  <td className="px-4 py-3 text-right text-green-400">
                    ₹ {order.paid}
                  </td>
                  <td className="px-4 py-3 text-right text-red-400">
                    ₹ {order.remaining}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {order.paymentMode}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === 'Completed'
                        ? 'bg-green-900 text-green-200'
                        : order.status === 'Pending'
                        ? 'bg-yellow-900 text-yellow-200'
                        : 'bg-orange-900 text-orange-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.remaining > 0 && (
                      <button
                        onClick={() => openSettleModal(order.orderId)}
                        className="text-green-400 hover:text-green-300 text-sm font-medium transition"
                      >
                        💳 Pay
                      </button>
                    )}
                    {order.remaining === 0 && (
                      <span className="text-green-400 text-sm">✓ Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Orders</p>
          <h3 className="text-2xl font-semibold text-teal-400 mt-1">
            {orders.length}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Bill Value</p>
          <h3 className="text-2xl font-semibold text-yellow-400 mt-1">
            ₹ {orders.reduce((sum, o) => sum + o.totalBill, 0)}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Received</p>
          <h3 className="text-2xl font-semibold text-green-400 mt-1">
            ₹ {orders.reduce((sum, o) => sum + o.paid, 0)}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Outstanding</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            ₹ {orders.reduce((sum, o) => sum + o.remaining, 0)}
          </h3>
        </div>
      </div>

      {/* Add Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
      >
        <AddOrderForm
          onSubmit={handleAddOrder}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Settle Payment Modal */}
      <Modal
        isOpen={settleModal.isOpen}
        onClose={() => setSettleModal({ isOpen: false, orderId: null })}
        title="Record Payment"
      >
        <div className="space-y-4">
          {settleModal.orderId && orders.find(o => o.orderId === settleModal.orderId) && (
            <>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-2">
                <p className="text-slate-300">
                  <strong>Order ID:</strong> {settleModal.orderId}
                </p>
                <p className="text-slate-300">
                  <strong>Total Bill:</strong> <span className="text-yellow-400 font-semibold">₹ {orders.find(o => o.orderId === settleModal.orderId)?.totalBill}</span>
                </p>
                <p className="text-slate-300">
                  <strong>Already Paid:</strong> <span className="text-green-400 font-semibold">₹ {orders.find(o => o.orderId === settleModal.orderId)?.paid}</span>
                </p>
                <p className="text-slate-300">
                  <strong>Remaining:</strong> <span className="text-red-400 font-semibold">₹ {orders.find(o => o.orderId === settleModal.orderId)?.remaining}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Amount to Pay Now (₹) *
                </label>
                <input
                  type="number"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                  placeholder="Enter amount"
                  min="1"
                  max={orders.find(o => o.orderId === settleModal.orderId)?.remaining || 0}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setSettleModal({ isOpen: false, orderId: null })}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSettlePayment}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                >
                  Record Payment
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Orders
