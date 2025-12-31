import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCustomerById, getOrdersByCustomer } from '../../firebase/services'

const CustomerDetail = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [customerData, setCustomerData] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchCustomerData()
  }, [id])

  const fetchCustomerData = async () => {
    try {
      setLoading(true)
      const customer = await getCustomerById(id)
      if (customer) {
        setCustomerData(customer)
        // Try to fetch orders for this customer by ID and by shopName
        try {
          // First try by customer ID
          let customerOrders = await getOrdersByCustomer(id)
          // If no orders found by ID, try by shopName
          if (customerOrders.length === 0 && customer.shopName) {
            customerOrders = await getOrdersByCustomer(customer.shopName)
          }
          setOrders(customerOrders)
        } catch (err) {
          console.log('No orders found for customer')
          setOrders([])
        }
      }
    } catch (error) {
      console.error('Error fetching customer:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals from orders
  const totalBill = orders.reduce((sum, o) => sum + (o.totalBill || 0), 0)
  const totalPaid = orders.reduce((sum, o) => sum + (o.paid || 0), 0)
  const totalRemaining = orders.reduce((sum, o) => sum + (o.remaining || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-teal-400 text-lg">Loading customer details...</div>
      </div>
    )
  }

  if (!customerData) {
    return (
      <div className="space-y-6 text-slate-200">
        <Link to="/customers" className="text-teal-400 hover:text-teal-300 mb-2 inline-block">
          ← Back to Customers
        </Link>
        <div className="text-center text-slate-400 py-8">
          Customer not found.
        </div>
      </div>
    )
  }

  // Parse rates from string format
  const parseRate = (rateStr) => {
    if (typeof rateStr === 'number') return rateStr
    if (typeof rateStr === 'string') {
      return parseInt(rateStr.replace(/[₹\s,]/g, '')) || 0
    }
    return 0
  }

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/customers" className="text-teal-400 hover:text-teal-300 mb-2 inline-block">
            ← Back to Customers
          </Link>
          <h1 className="text-2xl font-semibold text-white">
            {customerData.shopName}
          </h1>
          <p className="text-sm text-slate-400">
            Customer ID: {id}
          </p>
        </div>
      </div>

      {/* Customer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500">Contact Person</p>
          <h3 className="text-lg font-semibold text-white mt-1">
            {customerData.billingPerson}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {customerData.mobile}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500">Location</p>
          <h3 className="text-lg font-semibold text-white mt-1">
            {customerData.location}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500">Order Frequency</p>
          <h3 className="text-lg font-semibold text-teal-400 mt-1">
            {customerData.frequency}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500">Customized</p>
          <h3 className="text-lg font-semibold text-teal-400 mt-1">
            {customerData.customized}
          </h3>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Overall Sales</p>
          <h3 className="text-2xl font-semibold text-white mt-1">
            ₹ {totalBill.toLocaleString()}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Paid</p>
          <h3 className="text-2xl font-semibold text-green-400 mt-1">
            ₹ {totalPaid.toLocaleString()}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Rates</p>
          <div className="mt-2 text-sm">
            <p className="text-teal-400">1000ml: {customerData.rate1000ml}</p>
            <p className="text-teal-400">500ml: {customerData.rate500ml}</p>
            <p className="text-teal-400">100ml: {customerData.rate100ml}</p>
          </div>
        </div>
      </div>

      {/* Bills Summary - Moved to top for visibility */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Bill Amount</p>
          <h3 className="text-2xl font-semibold text-yellow-400 mt-1">
            ₹ {totalBill.toLocaleString('en-IN')}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Paid</p>
          <h3 className="text-2xl font-semibold text-green-400 mt-1">
            ₹ {totalPaid.toLocaleString('en-IN')}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Pending</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            ₹ {totalRemaining.toLocaleString('en-IN')}
          </h3>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-medium text-white">
            Order History (Latest Orders)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
              <tr>
                <th className="px-3 py-2 text-left">Order ID</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-center">1000ml</th>
                <th className="px-3 py-2 text-center">500ml</th>
                <th className="px-3 py-2 text-center">100ml</th>
                <th className="px-3 py-2 text-right">Total Bill</th>
                <th className="px-3 py-2 text-right">Paid</th>
                <th className="px-3 py-2 text-right">Remaining</th>
                <th className="px-3 py-2 text-left">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-3 py-8 text-center text-slate-400">
                    No orders found for this customer.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                <tr key={order.id || order.orderId} className="hover:bg-slate-800 transition">
                  <td className="px-3 py-2 text-teal-400 font-medium">{order.orderId || order.id}</td>
                  <td className="px-3 py-2 text-slate-300">{order.date}</td>
                  <td className="px-3 py-2 text-center text-slate-300">{order.qty1000ml}</td>
                  <td className="px-3 py-2 text-center text-slate-300">{order.qty500ml}</td>
                  <td className="px-3 py-2 text-center text-slate-300">{order.qty100ml}</td>
                  <td className="px-3 py-2 text-right text-yellow-400 font-medium">₹ {order.totalBill}</td>
                  <td className="px-3 py-2 text-right text-green-400">₹ {order.paid}</td>
                  <td className="px-3 py-2 text-right text-red-400">₹ {order.remaining}</td>
                  <td className="px-3 py-2 text-slate-300">{order.paymentMode}</td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail
