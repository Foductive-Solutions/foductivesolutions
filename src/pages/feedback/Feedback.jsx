import React, { useState } from 'react'
import Modal from '../../components/Modal'
import AddFeedbackForm from '../../components/forms/AddFeedbackForm'

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      customerName: "Hotel Sai Palace",
      contactPerson: "Mr. Rajesh Kumar",
      rating: 5,
      date: "05 Feb 2026",
      message: "Excellent service and product quality. Delivery is always on time.",
      category: "Service Quality"
    },
    {
      id: 2,
      customerName: "Green Leaf Cafe",
      contactPerson: "Ms. Priya Singh",
      rating: 4,
      date: "04 Feb 2026",
      message: "Good quality bottles, but would appreciate faster delivery times.",
      category: "Delivery"
    },
    {
      id: 3,
      customerName: "Royal Mess",
      contactPerson: "Mr. Vikram Patel",
      rating: 5,
      date: "03 Feb 2026",
      message: "Outstanding! The customized bottles are perfect for our brand. Will order more.",
      category: "Product Quality"
    },
    {
      id: 4,
      customerName: "Hotel Sai Palace",
      contactPerson: "Mr. Rajesh Kumar",
      rating: 4,
      date: "01 Feb 2026",
      message: "Product is great but pricing could be more competitive.",
      category: "Pricing"
    },
  ])

  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddFeedback = (formData) => {
    const newFeedback = {
      id: feedbacks.length + 1,
      customerName: formData.customerName,
      contactPerson: formData.contactPerson || 'N/A',
      rating: parseInt(formData.rating) || 5,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      message: formData.message,
      category: formData.category
    }
    setFeedbacks([newFeedback, ...feedbacks])
    setIsModalOpen(false)
    alert('Feedback added successfully!')
  }

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (filter === 'all') return true
    if (filter === 'positive') return fb.rating >= 4
    if (filter === 'negative') return fb.rating < 4
    return fb.category === filter
  })

  const getRatingColor = (rating) => {
    if (rating === 5) return 'text-green-400'
    if (rating === 4) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRatingBgColor = (rating) => {
    if (rating === 5) return 'bg-green-900'
    if (rating === 4) return 'bg-yellow-900'
    return 'bg-red-900'
  }

  return (
    <div className="space-y-6 text-slate-200">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Customer Feedback
          </h1>
          <p className="text-sm text-slate-400">
            Manage and review customer feedback
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          + Add Feedback
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Feedbacks</p>
          <h3 className="text-2xl font-semibold text-teal-400 mt-1">
            {feedbacks.length}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Average Rating</p>
          <h3 className="text-2xl font-semibold text-yellow-400 mt-1">
            {(feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)}
            <span className="text-sm">/5</span>
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Positive Reviews</p>
          <h3 className="text-2xl font-semibold text-green-400 mt-1">
            {feedbacks.filter(fb => fb.rating >= 4).length}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Needs Attention</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            {feedbacks.filter(fb => fb.rating < 4).length}
          </h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-0 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
            filter === 'all'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('positive')}
          className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
            filter === 'positive'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Positive (4-5)
        </button>
        <button
          onClick={() => setFilter('negative')}
          className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
            filter === 'negative'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Needs Attention
        </button>
        {Array.from(new Set(feedbacks.map(fb => fb.category))).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              filter === cat
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feedback Cards */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition"
          >
            {/* Card Header */}
            <div
              className="p-4 cursor-pointer hover:bg-slate-800 transition"
              onClick={() => setExpandedId(expandedId === feedback.id ? null : feedback.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-teal-400">
                      {feedback.customerName}
                    </h3>
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                      {feedback.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Contact: {feedback.contactPerson}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {feedback.date}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-2xl font-bold ${getRatingColor(feedback.rating)}`}>
                    {feedback.rating}★
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getRatingBgColor(feedback.rating)}`}>
                    {feedback.rating === 5 ? 'Excellent' : feedback.rating === 4 ? 'Good' : 'Needs Work'}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Message */}
            {expandedId === feedback.id && (
              <div className="px-4 py-3 border-t border-slate-800 bg-slate-800 bg-opacity-50">
                <p className="text-slate-300">
                  "{feedback.message}"
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded transition">
                    Reply
                  </button>
                  <button className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition">
                    Archive
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Categories Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Rating */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Feedback by Rating
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = feedbacks.filter(fb => fb.rating === rating).length
              const percentage = ((count / feedbacks.length) * 100).toFixed(1)
              
              return (
                <div key={rating}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-300">
                      {'⭐'.repeat(rating)} {rating} Stars
                    </span>
                    <span className="text-sm text-teal-400 font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* By Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Feedback by Category
          </h3>
          <div className="space-y-3">
            {Array.from(new Set(feedbacks.map(fb => fb.category))).map((category) => {
              const count = feedbacks.filter(fb => fb.category === category).length
              const avgRating = (
                feedbacks
                  .filter(fb => fb.category === category)
                  .reduce((sum, fb) => sum + fb.rating, 0) / count
              ).toFixed(1)
              
              return (
                <div key={category} className="border border-slate-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-slate-300">{category}</p>
                      <p className="text-xs text-slate-500">{count} feedbacks</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-yellow-400">
                        {avgRating}★
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Feedback Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Customer Feedback"
      >
        <AddFeedbackForm
          onSubmit={handleAddFeedback}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Feedback
