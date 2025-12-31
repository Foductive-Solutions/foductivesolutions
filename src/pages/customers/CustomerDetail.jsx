import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const CustomerDetail = () => {
  const { id } = useParams()

  const [customerData] = useState({
    id: 1,
    shopName: "Hotel Sai Palace",
    billingPerson: "Mr. Rajesh Kumar",
    mobile: "+91 98765 43210",
    location: "Sector 5, Downtown",
    customized: "Yes",
    rate1000ml: 45,
    rate500ml: 25,
    rate100ml: 8,
    frequency: "Bi-weekly",
    overallSales: "₹ 1,85,000",
    todaySales: "₹ 3,200",
    orders: [
      {
        orderId: "ORD-1023",
        date: "05 Feb 2026",
        qty1000ml: 50,
        qty500ml: 30,
        qty100ml: 100,
        rate1000ml: 45,
        rate500ml: 25,
        rate100ml: 8,
        totalBill: "₹ 3,200",
        paid: "₹ 2,000",
        remaining: "₹ 1,200",
        paymentMode: "Cash"
      },
      {
        orderId: "ORD-1020",
        date: "03 Feb 2026",
        qty1000ml: 40,
        qty500ml: 25,
        qty100ml: 80,
        rate1000ml: 45,
        rate500ml: 25,
        rate100ml: 8,
        totalBill: "₹ 2,600",
        paid: "₹ 2,600",
        remaining: "₹ 0",
        paymentMode: "Check"
      },
      {
        orderId: "ORD-1018",
        date: "01 Feb 2026",
        qty1000ml: 35,
        qty500ml: 20,
        qty100ml: 60,
        rate1000ml: 45,
        rate500ml: 25,
        rate100ml: 8,
        totalBill: "₹ 2,200",
        paid: "₹ 1,500",
        remaining: "₹ 700",
        paymentMode: "UPI"
      },
    ]
  })

  const [stockData] = useState([
    { size: "1000ml", sold: 500, current: 250, value: "₹ 11,250" },
    { size: "500ml", sold: 800, current: 450, value: "₹ 11,250" },
    { size: "100ml", sold: 1200, current: 300, value: "₹ 2,400" },
  ])

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
            {customerData.overallSales}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Today's Sales</p>
          <h3 className="text-2xl font-semibold text-green-400 mt-1">
            {customerData.todaySales}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Rates</p>
          <div className="mt-2 text-sm">
            <p className="text-teal-400">1000ml: ₹{customerData.rate1000ml}</p>
            <p className="text-teal-400">500ml: ₹{customerData.rate500ml}</p>
            <p className="text-teal-400">100ml: ₹{customerData.rate100ml}</p>
          </div>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-medium text-white">
            Stock Summary
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stockData.map((stock) => (
              <div key={stock.size} className="border border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-400">{stock.size}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-slate-300">
                    Total Sold: <span className="text-teal-400 font-semibold">{stock.sold}</span>
                  </p>
                  <p className="text-slate-300">
                    Current Stock: <span className="text-yellow-400 font-semibold">{stock.current}</span>
                  </p>
                  <p className="text-slate-300">
                    Value: <span className="text-green-400 font-semibold">{stock.value}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
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
              {customerData.orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-slate-800 transition">
                  <td className="px-3 py-2 text-teal-400 font-medium">{order.orderId}</td>
                  <td className="px-3 py-2 text-slate-300">{order.date}</td>
                  <td className="px-3 py-2 text-center text-slate-300">{order.qty1000ml}</td>
                  <td className="px-3 py-2 text-center text-slate-300">{order.qty500ml}</td>
                  <td className="px-3 py-2 text-center text-slate-300">{order.qty100ml}</td>
                  <td className="px-3 py-2 text-right text-yellow-400 font-medium">{order.totalBill}</td>
                  <td className="px-3 py-2 text-right text-green-400">{order.paid}</td>
                  <td className="px-3 py-2 text-right text-red-400">{order.remaining}</td>
                  <td className="px-3 py-2 text-slate-300">{order.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bills Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Bill Amount</p>
          <h3 className="text-2xl font-semibold text-yellow-400 mt-1">
            ₹ 8,000
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Paid</p>
          <h3 className="text-2xl font-semibold text-green-400 mt-1">
            ₹ 6,100
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Pending</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            ₹ 1,900
          </h3>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail
