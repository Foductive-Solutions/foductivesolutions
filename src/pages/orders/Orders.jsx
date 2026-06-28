import React, { useState, useEffect } from 'react'
import Modal from '../../components/Modal'
import AddOrderForm from '../../components/forms/AddOrderForm'
import Invoice from '../../components/Invoice'
import TaxInvoice from '../../components/TaxInvoice'
import { getOrders, addOrder, updateOrder, deleteOrder, getCustomers } from '../../firebase/services'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [settleModal, setSettleModal] = useState({ isOpen: false, orderId: null })
  const [settlementAmount, setSettlementAmount] = useState('')
  const [editingOrder, setEditingOrder] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  
  // Date filter state
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  })
  
  // Invoice state
  const [invoiceOrder, setInvoiceOrder] = useState(null)
  const [taxInvoiceOrder, setTaxInvoiceOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
    fetchCustomers()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('Error loading orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleAddOrder = async (formData) => {
    try {
      const q1 = parseInt(formData.qty1000ml, 10) || 0
      const q2 = parseInt(formData.qty500ml, 10) || 0
      const q3 = parseInt(formData.qty200ml, 10) || 0
      const r1 = parseInt(formData.rate1000ml, 10) || 0
      const r2 = parseInt(formData.rate500ml, 10) || 0
      const r3 = parseInt(formData.rate200ml, 10) || 0

      const totalBill = q1 * r1 + q2 * r2 + q3 * r3
      const paid = parseInt(formData.paid, 10) || 0

      const newOrder = {
        orderId: `ORD-${Date.now().toString().slice(-4)}`,
        customer: formData.customer,
        customerId: formData.customerId || '',
        orderSource: formData.orderSource || 'vehicle',
        date: new Date().toISOString().split('T')[0],
        qty1000ml: q1,
        qty500ml: q2,
        qty200ml: q3,
        rate1000ml: r1,
        rate500ml: r2,
        rate200ml: r3,
        totalBill,
        paid,
        remaining: totalBill - paid,
        paymentMode: formData.paymentMode,
        status: paid >= totalBill ? 'Completed' : 'Pending'
      }

      await addOrder(newOrder)
      await fetchOrders()
      setIsModalOpen(false)
      alert('Order created successfully!')
    } catch (error) {
      console.error('Error adding order:', error)
      alert('Error creating order. Please try again.')
    }
  }

  const openSettleModal = (orderId) => {
    setSettleModal({ isOpen: true, orderId })
    setSettlementAmount('')
  }

  const handleSettlePayment = async () => {
    const order = orders.find((o) => o.id === settleModal.orderId)
    if (!order) return

    const additionalPayment = parseInt(settlementAmount, 10) || 0
    if (additionalPayment <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      const newPaid = order.paid + additionalPayment
      const newRemaining = Math.max(0, order.totalBill - newPaid)
      
      await updateOrder(settleModal.orderId, {
        paid: newPaid,
        remaining: newRemaining,
        status: newRemaining === 0 ? 'Completed' : order.status
      })
      
      await fetchOrders()
      setSettleModal({ isOpen: false, orderId: null })
      setSettlementAmount('')
      alert('Payment recorded successfully!')
    } catch (error) {
      console.error('Error settling payment:', error)
      alert('Error recording payment. Please try again.')
    }
  }

  const handleDeleteOrder = async () => {
    if (!deleteConfirm) return
    try {
      await deleteOrder(deleteConfirm)
      await fetchOrders()
      setDeleteConfirm(null)
      alert('Order deleted successfully!')
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Error deleting order. Please try again.')
    }
  }

  const handleEditOrder = async (updatedData) => {
    try {
      await updateOrder(editingOrder.id, updatedData)
      await fetchOrders()
      setEditingOrder(null)
      setIsModalOpen(false)
      alert('Order updated successfully!')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order. Please try again.')
    }
  }

  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (filter !== 'all' && order.status?.toLowerCase() !== filter.toLowerCase()) {
      return false
    }
    
    // Date filter
    if (dateFilter.startDate || dateFilter.endDate) {
      let orderDateStr = order.date
      if (orderDateStr) {
        // Parse the order date (could be ISO or localized format)
        const parsedDate = new Date(orderDateStr)
        if (!isNaN(parsedDate.getTime())) {
          orderDateStr = parsedDate.toISOString().split('T')[0]
        }
      }
      
      if (dateFilter.startDate && orderDateStr < dateFilter.startDate) return false
      if (dateFilter.endDate && orderDateStr > dateFilter.endDate) return false
    }
    
    return true
  })

  // Quick date filter helpers
  const setTodayFilter = () => {
    const today = new Date().toISOString().split('T')[0]
    setDateFilter({ startDate: today, endDate: today })
  }

  const setThisWeekFilter = () => {
    const today = new Date()
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
    setDateFilter({ 
      startDate: firstDay.toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    })
  }

  const setThisMonthFilter = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    setDateFilter({ 
      startDate: firstDay.toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    })
  }

  const clearDateFilter = () => {
    setDateFilter({ startDate: '', endDate: '' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-teal-400 text-lg">Loading orders...</div>
      </div>
    )
  }

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
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {['all', 'completed', 'pending', 'partial'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm rounded-lg ${
              filter === tab
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Date Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">📅 From:</span>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">To:</span>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
          
          {/* Quick Filters */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={setTodayFilter}
              className={`px-3 py-1.5 text-xs rounded ${
                dateFilter.startDate === new Date().toISOString().split('T')[0] && dateFilter.endDate === new Date().toISOString().split('T')[0]
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={setThisWeekFilter}
              className="px-3 py-1.5 text-xs bg-slate-800 text-slate-400 hover:bg-slate-700 rounded"
            >
              This Week
            </button>
            <button
              onClick={setThisMonthFilter}
              className="px-3 py-1.5 text-xs bg-slate-800 text-slate-400 hover:bg-slate-700 rounded"
            >
              This Month
            </button>
            {(dateFilter.startDate || dateFilter.endDate) && (
              <button
                onClick={clearDateFilter}
                className="px-3 py-1.5 text-xs bg-red-900/50 text-red-400 hover:bg-red-900 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Summary */}
        {(dateFilter.startDate || dateFilter.endDate) && (
          <div className="mt-2 text-xs text-slate-500">
            Showing {filteredOrders.length} order(s) 
            {dateFilter.startDate && ` from ${dateFilter.startDate}`}
            {dateFilter.endDate && ` to ${dateFilter.endDate}`}
          </div>
        )}
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                  No orders found. Create your first order!
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
              <tr key={order.id}>
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
                  <button
                    onClick={() => setTaxInvoiceOrder(order)}
                    className="text-amber-400 hover:text-amber-300 text-xs font-semibold px-1"
                    title="Tax Invoice"
                  >
                    Invoice
                  </button>
                  <button
                    onClick={() => setInvoiceOrder(order)}
                    className="text-purple-400 hover:text-purple-300"
                    title="Print Receipt"
                  >
                    🖨️
                  </button>
                  {order.remaining > 0 && (
                    <button
                      onClick={() => openSettleModal(order.id)}
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
                    onClick={() => setDeleteConfirm(order.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
            )}
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
          customers={customers}
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
            onCancel={() => setEditingOrder(null)}
            customers={customers}
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

      {/* Receipt Modal */}
      {invoiceOrder && (
        <Invoice
          order={invoiceOrder}
          customer={customers.find(c => c.shopName === invoiceOrder.customer)}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* Tax Invoice Modal */}
      {taxInvoiceOrder && (
        <TaxInvoice
          order={taxInvoiceOrder}
          customer={customers.find(c => c.shopName === taxInvoiceOrder.customer)}
          onClose={() => setTaxInvoiceOrder(null)}
        />
      )}
    </div>
  )
}

export default Orders
