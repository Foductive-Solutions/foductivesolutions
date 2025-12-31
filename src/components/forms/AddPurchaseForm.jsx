import React, { useState, useMemo } from 'react'

const AddPurchaseForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isEdit = false
}) => {
  const [formData, setFormData] = useState(
    initialData
      ? {
          vendorName: initialData.vendorName || '',
          qty1000ml: initialData.qty1000ml || '',
          qty500ml: initialData.qty500ml || '',
          qty100ml: initialData.qty100ml || '',
          rate1000ml: initialData.rate1000ml || '',
          rate500ml: initialData.rate500ml || '',
          rate100ml: initialData.rate100ml || '',
          orderDate:
            initialData.orderDate ||
            new Date().toISOString().split('T')[0],
          deliveryDate: initialData.deliveryDate || '',
          paid: initialData.paid || '',
          paymentMode: initialData.paymentMode || 'Cash'
        }
      : {
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
        }
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const totalAmount = useMemo(() => {
    const q1 = parseInt(formData.qty1000ml) || 0
    const q2 = parseInt(formData.qty500ml) || 0
    const q3 = parseInt(formData.qty100ml) || 0
    const r1 = parseInt(formData.rate1000ml) || 0
    const r2 = parseInt(formData.rate500ml) || 0
    const r3 = parseInt(formData.rate100ml) || 0

    return q1 * r1 + q2 * r2 + q3 * r3
  }, [
    formData.qty1000ml,
    formData.qty500ml,
    formData.qty100ml,
    formData.rate1000ml,
    formData.rate500ml,
    formData.rate100ml
  ])

  const paidAmount = parseInt(formData.paid) || 0
  const remainingAmount = totalAmount - paidAmount

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.vendorName) {
      alert('Please fill all required fields')
      return
    }

    onSubmit(formData)

    if (!isEdit) {
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
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Quantities */}
        {['1000ml', '500ml', '100ml'].map((size) => (
          <div key={size}>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Qty {size}
            </label>
            <input
              type="number"
              name={`qty${size}`}
              value={formData[`qty${size}`]}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>
        ))}

        {/* Rates */}
        {['1000ml', '500ml', '100ml'].map((size) => (
          <div key={`rate-${size}`}>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Rate {size} (₹)
            </label>
            <input
              type="number"
              name={`rate${size}`}
              value={formData[`rate${size}`]}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>
        ))}

        {/* Dates */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Order Date
          </label>
          <input
            type="date"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Expected Delivery Date
          </label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
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
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Amounts */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-3">
          <strong>Total:</strong>{' '}
          <span className="text-yellow-400 font-semibold">₹ {totalAmount}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Amount Paid (₹)
          </label>
          <input
            type="number"
            name="paid"
            value={formData.paid}
            onChange={handleChange}
            min="0"
            max={totalAmount}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center">
          <strong>Remaining:</strong>{' '}
          <span
            className={`ml-2 font-semibold ${
              remainingAmount === 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            ₹ {remainingAmount}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium"
        >
          {isEdit ? 'Update PO' : 'Create PO'}
        </button>
      </div>
    </form>
  )
}

export default AddPurchaseForm
