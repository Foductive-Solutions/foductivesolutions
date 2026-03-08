import React, { useState, useMemo, useEffect } from 'react'
import { getGodownStockSummary } from '../../firebase/services'

const AddVehicleStockForm = ({ onSubmit, onCancel, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData ? {
    date: initialData.date || new Date().toISOString().split('T')[0],
    qty1000ml: initialData.qty1000ml || '',
    qty500ml: initialData.qty500ml || '',
    qty200ml: initialData.qty200ml || '',
    notes: initialData.notes || ''
  } : {
    date: new Date().toISOString().split('T')[0],
    qty1000ml: '',
    qty500ml: '',
    qty200ml: '',
    notes: ''
  })

  const [godownStock, setGodownStock] = useState(null)
  const [stockError, setStockError] = useState('')
  const [loadingStock, setLoadingStock] = useState(true)

  // Fetch godown stock on mount
  useEffect(() => {
    const fetchGodownStock = async () => {
      try {
        setLoadingStock(true)
        const summary = await getGodownStockSummary()
        setGodownStock(summary.remaining)
      } catch (error) {
        console.error('Error fetching godown stock:', error)
      } finally {
        setLoadingStock(false)
      }
    }
    fetchGodownStock()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Calculate total boxes
  const totalBoxes = useMemo(() => {
    const q1 = parseInt(formData.qty1000ml) || 0
    const q2 = parseInt(formData.qty500ml) || 0
    const q3 = parseInt(formData.qty200ml) || 0
    return q1 + q2 + q3
  }, [formData.qty1000ml, formData.qty500ml, formData.qty200ml])

  // Validate stock availability
  const validateStock = useMemo(() => {
    if (!godownStock) return { valid: true, errors: [] }
    
    const errors = []
    const q1 = parseInt(formData.qty1000ml) || 0
    const q2 = parseInt(formData.qty500ml) || 0
    const q3 = parseInt(formData.qty200ml) || 0
    
    // For edit mode, we need to consider the original values
    const orig1 = isEdit ? (initialData?.qty1000ml || 0) : 0
    const orig2 = isEdit ? (initialData?.qty500ml || 0) : 0
    const orig3 = isEdit ? (initialData?.qty200ml || 0) : 0
    
    const available1000 = godownStock.qty1000ml + orig1
    const available500 = godownStock.qty500ml + orig2
    const available200 = godownStock.qty200ml + orig3
    
    if (q1 > available1000) {
      errors.push(`1000ml: Trying to load ${q1} but only ${available1000} available in godown`)
    }
    if (q2 > available500) {
      errors.push(`500ml: Trying to load ${q2} but only ${available500} available in godown`)
    }
    if (q3 > available200) {
      errors.push(`200ml: Trying to load ${q3} but only ${available200} available in godown`)
    }
    
    return { valid: errors.length === 0, errors }
  }, [formData, godownStock, isEdit, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.date) {
      alert('Please select a date')
      return
    }
    if (totalBoxes === 0) {
      alert('Please enter at least one quantity')
      return
    }
    
    // Validate stock availability
    if (!validateStock.valid) {
      setStockError(validateStock.errors.join('\n'))
      return
    }
    
    onSubmit(formData)
    if (!isEdit) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        qty1000ml: '',
        qty500ml: '',
        qty200ml: '',
        notes: ''
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Godown Stock Availability Display */}
      {loadingStock ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
          <span className="text-slate-400">Loading godown stock...</span>
        </div>
      ) : godownStock && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <p className="text-sm text-slate-400 mb-2">📦 Available in Godown:</p>
          <div className="flex gap-4 text-sm">
            <span className={`${godownStock.qty1000ml < 10 ? 'text-red-400' : 'text-green-400'}`}>
              1000ml: <strong>{godownStock.qty1000ml}</strong>
            </span>
            <span className={`${godownStock.qty500ml < 10 ? 'text-red-400' : 'text-green-400'}`}>
              500ml: <strong>{godownStock.qty500ml}</strong>
            </span>
            <span className={`${godownStock.qty200ml < 10 ? 'text-red-400' : 'text-green-400'}`}>
              200ml: <strong>{godownStock.qty200ml}</strong>
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
        {/* Date */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Loading Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
            required
          />
        </div>

        {/* Qty 1000ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            1000ml Boxes {godownStock && <span className="text-slate-500">(max: {godownStock.qty1000ml + (isEdit ? initialData?.qty1000ml || 0 : 0)})</span>}
          </label>
          <input
            type="number"
            name="qty1000ml"
            value={formData.qty1000ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Qty 500ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            500ml Boxes {godownStock && <span className="text-slate-500">(max: {godownStock.qty500ml + (isEdit ? initialData?.qty500ml || 0 : 0)})</span>}
          </label>
          <input
            type="number"
            name="qty500ml"
            value={formData.qty500ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Qty 200ml */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            200ml Boxes {godownStock && <span className="text-slate-500">(max: {godownStock.qty200ml + (isEdit ? initialData?.qty200ml || 0 : 0)})</span>}
          </label>
          <input
            type="number"
            name="qty200ml"
            value={formData.qty200ml}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Total Boxes Display */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex flex-col justify-center">
          <p className="text-sm text-slate-300">
            <strong>Total Boxes:</strong> <span className="text-teal-400 text-lg font-semibold">{totalBoxes}</span>
          </p>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition resize-none"
            placeholder="Any additional notes about this loading..."
          />
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
          {isEdit ? 'Update Stock' : 'Add to Vehicle'}
        </button>
      </div>
    </form>
  )
}

export default AddVehicleStockForm
