import React, { useState } from 'react'

const AddCustomerForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    shopName: '',
    billingPerson: '',
    mobile: '',
    location: '',
    customized: 'No',
    rate1000ml: '',
    rate500ml: '',
    rate100ml: '',
    frequency: 'Weekly'
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
    if (!formData.shopName || !formData.billingPerson || !formData.mobile) {
      alert('Please fill all required fields')
      return
    }
    onSubmit(formData)
    setFormData({
      shopName: '',
      billingPerson: '',
      mobile: '',
      location: '',
      customized: 'No',
      rate1000ml: '',
      rate500ml: '',
      rate100ml: '',
      frequency: 'Weekly'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Shop Name *
          </label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="Enter shop/hotel name"
            required
          />
        </div>

        {/* Billing Person */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Billing Person *
          </label>
          <input
            type="text"
            name="billingPerson"
            value={formData.billingPerson}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="Enter name"
            required
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Mobile Number *
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="+91 98765 43210"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="Enter location"
          />
        </div>

        {/* Customized */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Customized Orders
          </label>
          <select
            name="customized"
            value={formData.customized}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Order Frequency
          </label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
          >
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Tri-weekly">Tri-weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
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
            placeholder="8"
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
          Add Customer
        </button>
      </div>
    </form>
  )
}

export default AddCustomerForm
