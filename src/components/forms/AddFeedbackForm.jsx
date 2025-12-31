import React, { useState } from 'react'

const AddFeedbackForm = ({ onSubmit, onCancel, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData ? {
    customerName: initialData.customerName || '',
    contactPerson: initialData.contactPerson || '',
    rating: initialData.rating || 5,
    category: initialData.category || 'Service Quality',
    message: initialData.message || ''
  } : {
    customerName: '',
    contactPerson: '',
    rating: 5,
    category: 'Service Quality',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === 'rating' ? parseInt(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.customerName || !formData.message) {
      alert('Please fill all required fields')
      return
    }
    onSubmit(formData)
    if (!isEdit) {
      setFormData({
        customerName: '',
        contactPerson: '',
        rating: 5,
        category: 'Service Quality',
        message: ''
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="Shop/Hotel name"
            required
          />
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Contact Person
          </label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
            placeholder="Name"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Rating *
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              rating: parseInt(e.target.value)
            }))}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
            required
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
            <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
            <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
            <option value={2}>⭐⭐ (2 Stars - Poor)</option>
            <option value={1}>⭐ (1 Star - Very Poor)</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
          >
            <option value="Service Quality">Service Quality</option>
            <option value="Product Quality">Product Quality</option>
            <option value="Delivery">Delivery</option>
            <option value="Pricing">Pricing</option>
            <option value="Communication">Communication</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Feedback Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition resize-none"
            placeholder="Share your feedback..."
            required
          ></textarea>
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
          {isEdit ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  )
}

export default AddFeedbackForm
