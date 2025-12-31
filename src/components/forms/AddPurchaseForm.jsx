import React, { useState, useMemo } from 'react'

const AddPurchaseForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    qty1000ml: '',
    qty500ml: '',
    qty100ml: '',
    rate1000ml: '',
    rate500ml: '',
    rate100ml: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    paid: '',
    paymentMode: 'Cash'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Calculate total billing amount
  const totalAmount = useMemo(() => {
    const q1 = parseInt(formData.qty1000ml) || 0
    const q2 = parseInt(formData.qty500ml) || 0
    const q3 = parseInt(formData.qty100ml) || 0
    const r1 = parseInt(formData.rate1000ml) || 0
    const r2 = parseInt(formData.rate500ml) || 0
    const r3 = parseInt(formData.rate100ml) || 0
    return q1 * r1 + q2 * r2 + q3 * r3
  }, [formData.qty1000ml, formData.qty500ml, formData.qty100ml, formData.rate1000ml, formData.rate500ml, formData.rate100ml])

  const paidAmount = parseInt(formData.paid) || 0
  const remainingAmount = totalAmount - paidAmount

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.vendorName) {
      alert('Please fill all required fields')
      return
    }
    onSubmit(formData)
    setFormData({
      vendorName: '',
      qty1000ml: '',
      qty500ml: '',
      qty100ml: '',
      rate1000ml: '',
      rate500ml: '',
      rate100ml: '',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      paid: '',
      paymentMode: 'Cash'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vendor Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Vendor Name *
          </label>
          <input
            type="text"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="Water Bottle Industries Ltd"
            required
          />
        </div>

        {/* Qty 1000ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Qty 1000ml
          </label>
          <input
            type="number"
            name="qty1000ml"
            value={formData.qty1000ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="200"
          />
        </div>

        {/* Qty 500ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Qty 500ml
          </label>
          <input
            type="number"
            name="qty500ml"
            value={formData.qty500ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="300"
          />
        </div>

        {/* Qty 100ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Qty 100ml
          </label>
          <input
            type="number"
            name="qty100ml"
            value={formData.qty100ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="500"
          />
        </div>

        {/* Rate 1000ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Rate 1000ml (₹)
          </label>
          <input
            type="number"
            name="rate1000ml"
            value={formData.rate1000ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="35"
          />
        </div>

        {/* Rate 500ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Rate 500ml (₹)
          </label>
          <input
            type="number"
            name="rate500ml"
            value={formData.rate500ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="18"
          />
        </div>

        {/* Rate 100ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Rate 100ml (₹)
          </label>
          <input
            type="number"
            name="rate100ml"
            value={formData.rate100ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="5"
          />
        </div>

        {/* Order Date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Order Date
          </label>
          <input
            type="date"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
          />
        </div>

        {/* Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Expected Delivery Date
          </label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
          />
        </div>

        {/* Payment Mode */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Payment Mode
          </label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
          >
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Total Amount Display */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-3">
          <p className="text-sm text-slate-300 mb-2">
            <strong>Total Amount:</strong> <span className="text-yellow-400 text-lg font-semibold">₹ {totalAmount}</span>
          </p>
        </div>

        {/* Paid Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Amount Paid (₹)
          </label>
          <input
            type="number"
            name="paid"
            value={formData.paid}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="0"
            min="0"
            max={totalAmount}
          />
        </div>

        {/* Remaining Amount Display */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex flex-col justify-center">
          <p className="text-sm text-slate-300">
            <strong>Remaining:</strong> <span className={`text-lg font-semibold ${remainingAmount === 0 ? 'text-green-400' : 'text-red-400'}`}>₹ {remainingAmount}</span>
          </p>
        </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition font-medium"
        >
          Create PO
        </button>
      </div>
    </div>
    </form>
  )
}

export default AddPurchaseForm
