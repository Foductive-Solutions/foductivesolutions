import React, { useState } from 'react'

const AddExpenseForm = ({ onSubmit, onCancel, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData ? {
    name: initialData.name || '',
    category: initialData.category || 'Petrol',
    amount: initialData.amount || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    paymentMode: initialData.paymentMode || 'Cash'
  } : {
    name: '',
    category: 'Petrol',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.amount) {
      alert('Please fill all required fields')
      return
    }
    onSubmit(formData)
    if (!isEdit) {
      setFormData({
        name: '',
        category: 'Petrol',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expense Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Expense Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="e.g., Petrol for vehicle"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
            required
          >
            <option value="Petrol">Petrol</option>
            <option value="Driver Salary">Driver Salary</option>
            <option value="Vehicle Maintenance">Vehicle Maintenance</option>
            <option value="Rent">Rent</option>
            <option value="Labour Charges">Labour Charges</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Amount (₹) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="5000"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Date *
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
          {isEdit ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  )
}

export default AddExpenseForm
