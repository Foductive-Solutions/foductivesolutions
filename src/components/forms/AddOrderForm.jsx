import React, { useState, useMemo, useEffect } from 'react'
import { getVehicleStockSummary, getGodownStockSummary } from '../../firebase/services'

const AddOrderForm = ({ onSubmit, onCancel, initialData = null, isEdit = false, customers = [] }) => {
  const [formData, setFormData] = useState(initialData ? {
    customer: initialData.customer || '',
    orderSource: initialData.orderSource || 'vehicle',
    qty1000ml: initialData.qty1000ml || '',
    qty500ml: initialData.qty500ml || '',
    qty200ml: initialData.qty200ml || '',
    rate1000ml: initialData.rate1000ml || '',
    rate500ml: initialData.rate500ml || '',
    rate200ml: initialData.rate200ml || '',
    paid: initialData.paid || '',
    paymentMode: initialData.paymentMode || 'Cash'
  } : {
    customer: '',
    orderSource: 'vehicle',
    qty1000ml: '',
    qty500ml: '',
    qty200ml: '',
    rate1000ml: '',
    rate500ml: '',
    rate200ml: '',
    paid: '',
    paymentMode: 'Cash'
  })

  const [vehicleStock, setVehicleStock] = useState(null)
  const [godownStock, setGodownStock] = useState(null)
  const [loadingStock, setLoadingStock] = useState(true)
  const [stockError, setStockError] = useState('')

  // Fetch stock on mount
  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoadingStock(true)
        const [vehicleSummary, godownSummary] = await Promise.all([
          getVehicleStockSummary(),
          getGodownStockSummary()
        ])
        setVehicleStock(vehicleSummary.remaining)
        setGodownStock(godownSummary.remaining)
      } catch (error) {
        console.error('Error fetching stock:', error)
      } finally {
        setLoadingStock(false)
      }
    }
    fetchStock()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Calculate total bill automatically
  const totalBill = useMemo(() => {
    const q1 = parseInt(formData.qty1000ml) || 0
    const q2 = parseInt(formData.qty500ml) || 0
    const q3 = parseInt(formData.qty200ml) || 0
    const r1 = parseInt(formData.rate1000ml) || 0
    const r2 = parseInt(formData.rate500ml) || 0
    const r3 = parseInt(formData.rate200ml) || 0
    return q1 * r1 + q2 * r2 + q3 * r3
  }, [formData.qty1000ml, formData.qty500ml, formData.qty200ml, formData.rate1000ml, formData.rate500ml, formData.rate200ml])

  // Calculate remaining amount
  const paidAmount = parseInt(formData.paid) || 0
  const remainingAmount = totalBill - paidAmount

  // Get current stock based on order source
  const currentStock = useMemo(() => {
    if (formData.orderSource === 'vehicle') return vehicleStock
    return godownStock
  }, [formData.orderSource, vehicleStock, godownStock])

  // Validate stock availability
  const validateStock = useMemo(() => {
    if (!currentStock) return { valid: true, errors: [] }
    
    const errors = []
    const q1 = parseInt(formData.qty1000ml) || 0
    const q2 = parseInt(formData.qty500ml) || 0
    const q3 = parseInt(formData.qty200ml) || 0
    
    // For edit mode, add back the original quantities
    const orig1 = isEdit ? (initialData?.qty1000ml || 0) : 0
    const orig2 = isEdit ? (initialData?.qty500ml || 0) : 0
    const orig3 = isEdit ? (initialData?.qty200ml || 0) : 0
    
    // Only add back original if same order source
    const sameSource = isEdit && initialData?.orderSource === formData.orderSource
    const available1000 = currentStock.qty1000ml + (sameSource ? orig1 : 0)
    const available500 = currentStock.qty500ml + (sameSource ? orig2 : 0)
    const available200 = currentStock.qty200ml + (sameSource ? orig3 : 0)
    
    const sourceName = formData.orderSource === 'vehicle' ? 'Vehicle' : 'Godown'
    
    if (q1 > available1000) {
      errors.push(`1000ml: Ordering ${q1} but only ${available1000} in ${sourceName}`)
    }
    if (q2 > available500) {
      errors.push(`500ml: Ordering ${q2} but only ${available500} in ${sourceName}`)
    }
    if (q3 > available200) {
      errors.push(`200ml: Ordering ${q3} but only ${available200} in ${sourceName}`)
    }
    
    return { valid: errors.length === 0, errors }
  }, [formData, currentStock, isEdit, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.customer) {
      alert('Please select a customer')
      return
    }
    
    // Validate stock
    if (!validateStock.valid) {
      setStockError(validateStock.errors.join('\n'))
      return
    }
    
    onSubmit(formData)
    if (!isEdit) {
      setFormData({
        customer: '',
        orderSource: 'vehicle',
        qty1000ml: '',
        qty500ml: '',
        qty200ml: '',
        rate1000ml: '',
        rate500ml: '',
        rate200ml: '',
        paid: '',
        paymentMode: 'Cash'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stock Availability Display */}
      {loadingStock ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
          <span className="text-slate-400">Loading stock info...</span>
        </div>
      ) : currentStock && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <p className="text-sm text-slate-400 mb-2">
            {formData.orderSource === 'vehicle' ? '🚚 Vehicle Stock:' : '🏭 Godown Stock:'}
          </p>
          <div className="flex gap-4 text-sm">
            <span className={`${currentStock.qty1000ml < 10 ? 'text-red-400' : 'text-green-400'}`}>
              1000ml: <strong>{currentStock.qty1000ml}</strong>
            </span>
            <span className={`${currentStock.qty500ml < 10 ? 'text-red-400' : 'text-green-400'}`}>
              500ml: <strong>{currentStock.qty500ml}</strong>
            </span>
            <span className={`${currentStock.qty200ml < 10 ? 'text-red-400' : 'text-green-400'}`}>
              200ml: <strong>{currentStock.qty200ml}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Stock Error Alert */}
      {stockError && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
          <p className="text-red-400 text-sm font-medium">⚠️ Insufficient Stock:</p>
          <p className="text-red-300 text-sm whitespace-pre-line">{stockError}</p>
        </div>
      )}

      {/* Validation Warnings (real-time) */}
      {!validateStock.valid && !stockError && (
        <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3">
          <p className="text-yellow-400 text-sm font-medium">⚠️ Stock Warning:</p>
          {validateStock.errors.map((err, idx) => (
            <p key={idx} className="text-yellow-300 text-sm">{err}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Customer *
          </label>
          <select
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
            required
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.shopName}>
                {c.shopName} - {c.billingPerson}
              </option>
            ))}
          </select>
        </div>

        {/* Order Source */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Order Source *
          </label>
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition ${
              formData.orderSource === 'vehicle' 
                ? 'bg-teal-600/20 border-teal-500 text-teal-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}>
              <input
                type="radio"
                name="orderSource"
                value="vehicle"
                checked={formData.orderSource === 'vehicle'}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-lg">🚚</span>
              <span>Vehicle</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition ${
              formData.orderSource === 'godown' 
                ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}>
              <input
                type="radio"
                name="orderSource"
                value="godown"
                checked={formData.orderSource === 'godown'}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-lg">🏭</span>
              <span>Godown</span>
            </label>
          </div>
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
            placeholder="50"
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
            placeholder="30"
          />
        </div>

        {/* Qty 200ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Qty 200ml
          </label>
          <input
            type="number"
            name="qty200ml"
            value={formData.qty200ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="100"
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
            placeholder="45"
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
            placeholder="25"
          />
        </div>

        {/* Rate 200ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Rate 200ml (₹)
          </label>
          <input
            type="number"
            name="rate200ml"
            value={formData.rate200ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="8"
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

        {/* Total Bill Display */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-3">
          <p className="text-sm text-slate-300 mb-2">
            <strong>Total Bill:</strong> <span className="text-yellow-400 text-lg font-semibold">₹ {totalBill}</span>
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
            max={totalBill}
          />
        </div>

        {/* Remaining Amount Display */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex flex-col justify-center">
          <p className="text-sm text-slate-300">
            <strong>Remaining:</strong> <span className={`text-lg font-semibold ${remainingAmount === 0 ? 'text-green-400' : 'text-red-400'}`}>₹ {remainingAmount}</span>
          </p>
        </div>
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
          {isEdit ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  )
}

export default AddOrderForm
