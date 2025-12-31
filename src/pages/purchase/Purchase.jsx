import React, { useState } from 'react'

const Purchase = () => {
  const [purchases] = useState([
    {
      id: 1,
      vendorName: "Water Bottle Industries Ltd",
      orderDate: "01 Feb 2026",
      deliveryDate: "05 Feb 2026",
      qty1000ml: 200,
      qty500ml: 300,
      qty100ml: 500,
      rate1000ml: 35,
      rate500ml: 18,
      rate100ml: 5,
      billingAmount: 13650,
      paid: 13650,
      remaining: 0,
      paymentMode: "Bank Transfer",
      status: "Delivered"
    },
    {
      id: 2,
      vendorName: "Premium Plastics Co.",
      orderDate: "03 Feb 2026",
      deliveryDate: "08 Feb 2026",
      qty1000ml: 150,
      qty500ml: 250,
      qty100ml: 400,
      rate1000ml: 34,
      rate500ml: 17,
      rate100ml: 5,
      billingAmount: 11000,
      paid: 6000,
      remaining: 5000,
      paymentMode: "Check",
      status: "Pending"
    },
    {
      id: 3,
      vendorName: "Crystal Clear Bottles",
      orderDate: "02 Feb 2026",
      deliveryDate: "06 Feb 2026",
      qty1000ml: 100,
      qty500ml: 150,
      qty100ml: 250,
      rate1000ml: 36,
      rate500ml: 19,
      rate100ml: 6,
      billingAmount: 7350,
      paid: 7350,
      remaining: 0,
      paymentMode: "Cash",
      status: "Delivered"
    },
  ])

  const [filter, setFilter] = useState('all')

  const filteredPurchases = purchases.filter(p => {
    if (filter === 'all') return true
    return p.status.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="space-y-6 text-slate-200">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Purchase Orders
          </h1>
          <p className="text-sm text-slate-400">
            Manage vendor purchases and inventory
          </p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          + New Purchase Order
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Orders</p>
          <h3 className="text-2xl font-semibold text-teal-400 mt-1">
            {purchases.length}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Spent</p>
          <h3 className="text-2xl font-semibold text-yellow-400 mt-1">
            ₹ {purchases.reduce((sum, p) => sum + p.billingAmount, 0)}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Amount Paid</p>
          <h3 className="text-2xl font-semibold text-green-400 mt-1">
            ₹ {purchases.reduce((sum, p) => sum + p.paid, 0)}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Amount Pending</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            ₹ {purchases.reduce((sum, p) => sum + p.remaining, 0)}
          </h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-0">
        {['all', 'delivered', 'pending'].map((tab) => (
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

      {/* Purchase Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
              <tr>
                <th className="px-3 py-3 text-left">PO ID</th>
                <th className="px-3 py-3 text-left">Vendor Name</th>
                <th className="px-3 py-3 text-left">Order Date</th>
                <th className="px-3 py-3 text-left">Delivery Date</th>
                <th className="px-3 py-3 text-center">1000ml</th>
                <th className="px-3 py-3 text-center">500ml</th>
                <th className="px-3 py-3 text-center">100ml</th>
                <th className="px-3 py-3 text-right">Bill Amount</th>
                <th className="px-3 py-3 text-right">Paid</th>
                <th className="px-3 py-3 text-right">Remaining</th>
                <th className="px-3 py-3 text-left">Mode</th>
                <th className="px-3 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-slate-800 transition">
                  <td className="px-3 py-3 text-teal-400 font-medium">
                    PO-{purchase.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-3 py-3 text-slate-300">
                    {purchase.vendorName}
                  </td>
                  <td className="px-3 py-3 text-slate-400">
                    {purchase.orderDate}
                  </td>
                  <td className="px-3 py-3 text-slate-400">
                    {purchase.deliveryDate}
                  </td>
                  <td className="px-3 py-3 text-center text-slate-300">
                    {purchase.qty1000ml}
                  </td>
                  <td className="px-3 py-3 text-center text-slate-300">
                    {purchase.qty500ml}
                  </td>
                  <td className="px-3 py-3 text-center text-slate-300">
                    {purchase.qty100ml}
                  </td>
                  <td className="px-3 py-3 text-right text-yellow-400 font-medium">
                    ₹ {purchase.billingAmount}
                  </td>
                  <td className="px-3 py-3 text-right text-green-400">
                    ₹ {purchase.paid}
                  </td>
                  <td className="px-3 py-3 text-right text-red-400">
                    ₹ {purchase.remaining}
                  </td>
                  <td className="px-3 py-3 text-slate-300 text-xs">
                    {purchase.paymentMode}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      purchase.status === 'Delivered'
                        ? 'bg-green-900 text-green-200'
                        : 'bg-yellow-900 text-yellow-200'
                    }`}>
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Performance */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Vendor Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(purchases.map(p => p.vendorName))).map((vendor) => {
            const vendorPurchases = purchases.filter(p => p.vendorName === vendor)
            const totalOrders = vendorPurchases.length
            const totalAmount = vendorPurchases.reduce((sum, p) => sum + p.billingAmount, 0)
            const deliveredCount = vendorPurchases.filter(p => p.status === 'Delivered').length
            
            return (
              <div key={vendor} className="border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-teal-400 mb-3">{vendor}</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">
                    Orders: <span className="text-white font-medium">{totalOrders}</span>
                  </p>
                  <p className="text-slate-300">
                    Total Amount: <span className="text-yellow-400 font-medium">₹ {totalAmount}</span>
                  </p>
                  <p className="text-slate-300">
                    Delivered: <span className="text-green-400 font-medium">{deliveredCount}/{totalOrders}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottle Inventory Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Total Bottles Purchased (Delivered)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-400 mb-2">1000ml Bottles</p>
            <h4 className="text-3xl font-bold text-teal-400">
              {purchases.filter(p => p.status === 'Delivered').reduce((sum, p) => sum + p.qty1000ml, 0)}
            </h4>
            <p className="text-xs text-slate-500 mt-1">Units</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-400 mb-2">500ml Bottles</p>
            <h4 className="text-3xl font-bold text-teal-400">
              {purchases.filter(p => p.status === 'Delivered').reduce((sum, p) => sum + p.qty500ml, 0)}
            </h4>
            <p className="text-xs text-slate-500 mt-1">Units</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-400 mb-2">100ml Bottles</p>
            <h4 className="text-3xl font-bold text-teal-400">
              {purchases.filter(p => p.status === 'Delivered').reduce((sum, p) => sum + p.qty100ml, 0)}
            </h4>
            <p className="text-xs text-slate-500 mt-1">Units</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase
