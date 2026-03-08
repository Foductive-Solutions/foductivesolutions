import React, { useState, useMemo } from 'react'

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
            1000ml Boxes
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
            500ml Boxes
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
            200ml Boxes
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
