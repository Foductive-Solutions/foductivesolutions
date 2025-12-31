import React, { useState } from 'react'
import Modal from '../../components/Modal'
import AddOrderForm from '../../components/forms/AddOrderForm'

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD-1023',
      customer: 'Hotel Sai Palace',
      date: '05 Feb 2026',
      qty1000ml: 50,
      qty500ml: 30,
      qty100ml: 100,
      rate1000ml: 45,
      rate500ml: 25,
      rate100ml: 8,
      totalBill: 3200,
      paid: 2000,
      remaining: 1200,
      paymentMode: 'Cash',
      status: 'Pending'
    },
    {
      orderId: 'ORD-1022',
      customer: 'Green Leaf Cafe',
      date: '05 Feb 2026',
      qty1000ml: 30,
      qty500ml: 20,
      qty100ml: 50,
      rate1000ml: 42,
      rate500ml: 23,
      rate100ml: 7,
      totalBill: 1850,
      paid: 1850,
      remaining: 0,
      paymentMode: 'UPI',
      status: 'Completed'
    },
    {
      orderId: 'ORD-1021',
      customer: 'Royal Mess',
      date: '04 Feb 2026',
      qty1000ml: 40,
      qty500ml: 25,
      qty100ml: 80,
      rate1000ml: 48,
      rate500ml: 26,
      rate100ml: 9,
      totalBill: 2100,
      paid: 1500,
      remaining: 600,
      paymentMode: 'Check',
      status: 'Partial'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [settleModal, setSettleModal] = useState({ isOpen: false, orderId: null })
  const [settlementAmount, setSettlementAmount] = useState('')
  const [editingOrder, setEditingOrder] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddOrder = (formData) => {
    const q1 = parseInt(formData.qty1000ml, 10) || 0
    const q2 = parseInt(formData.qty500ml, 10) || 0
    const q3 = parseInt(formData.qty100ml, 10) || 0
    const r1 = parseInt(formData.rate1000ml, 10) || 0
    const r2 = parseInt(formData.rate500ml, 10) || 0
    const r3 = parseInt(formData.rate100ml, 10) || 0

    const totalBill = q1 * r1 + q2 * r2 + q3 * r3
    const paid = parseInt(formData.paid, 10) || 0

    const newOrder = {
      orderId: `ORD-${1024 + orders.length}`,
      customer: formData.customer,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      qty1000ml: q1,
      qty500ml: q2,
      qty100ml: q3,
      rate1000ml: r1,
      rate500ml: r2,
      rate100ml: r3,
      totalBill,
      paid,
      remaining: totalBill - paid,
      paymentMode: formData.paymentMode,
      status: paid >= totalBill ? 'Completed' : 'Pending'
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
    const order = orders.find((o) => o.orderId === settleModal.orderId)
    if (!order) return

    const additionalPayment = parseInt(settlementAmount, 10) || 0
    if (additionalPayment <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === settleModal.orderId) {
          const newPaid = o.paid + additionalPayment
          const newRemaining = Math.max(0, o.totalBill - newPaid)
          return {
            ...o,
            paid: newPaid,
            remaining: newRemaining,
            status: newRemaining === 0 ? 'Completed' : o.status
          }
        }
        return o
      })
    )

    setSettleModal({ isOpen: false, orderId: null })
    setSettlementAmount('')
    alert('Payment recorded successfully!')
  }

  const handleDeleteOrder = () => {
    if (!deleteConfirm) return
    setOrders((prev) => prev.filter((o) => o.orderId !== deleteConfirm))
    setDeleteConfirm(null)
    alert('Order deleted successfully!')
  }

  const handleEditOrder = (updatedData) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === editingOrder.orderId ? { ...o, ...updatedData } : o
      )
    )
    setEditingOrder(null)
    setIsModalOpen(false)
    alert('Order updated successfully!')
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    return order.status.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Orders</h1>
          <p className="text-sm text-slate-400">
            View and manage all customer orders
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + New Order
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        {['all', 'completed', 'pending', 'partial'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-3 text-sm border-b-2 ${
              filter === tab
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Remaining</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td className="px-4 py-3 text-teal-400">{order.orderId}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3 text-right text-yellow-400">
                  ₹ {order.totalBill}
                </td>
                <td className="px-4 py-3 text-right text-green-400">
                  ₹ {order.paid}
                </td>
                <td className="px-4 py-3 text-right text-red-400">
                  ₹ {order.remaining}
                </td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  {order.remaining > 0 && (
                    <button
                      onClick={() => openSettleModal(order.orderId)}
                      className="text-green-400"
                    >
                      Pay
                    </button>
                  )}
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(order.orderId)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <input
            type="number"
            value={settlementAmount}
            onChange={(e) => setSettlementAmount(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
            placeholder="Enter amount"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSettleModal({ isOpen: false, orderId: null })}
              className="px-4 py-2 bg-slate-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSettlePayment}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Record Payment
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingOrder !== null}
        onClose={() => setEditingOrder(null)}
        title="Edit Order"
      >
        {editingOrder && (
          <AddOrderForm
            initialData={editingOrder}
            isEdit
            onSubmit={handleEditOrder}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Order"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete order #{deleteConfirm}?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 bg-slate-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteOrder}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Orders
