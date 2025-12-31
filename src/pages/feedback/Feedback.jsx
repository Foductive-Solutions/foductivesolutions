import React, { useState } from 'react'
import Modal from '../../components/Modal'
import AddFeedbackForm from '../../components/forms/AddFeedbackForm'

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      customerName: 'Hotel Sai Palace',
      contactPerson: 'Mr. Rajesh Kumar',
      rating: 5,
      date: '05 Feb 2026',
      message: 'Excellent service and product quality. Delivery is always on time.',
      category: 'Service Quality'
    },
    {
      id: 2,
      customerName: 'Green Leaf Cafe',
      contactPerson: 'Ms. Priya Singh',
      rating: 4,
      date: '04 Feb 2026',
      message: 'Good quality bottles, but would appreciate faster delivery times.',
      category: 'Delivery'
    },
    {
      id: 3,
      customerName: 'Royal Mess',
      contactPerson: 'Mr. Vikram Patel',
      rating: 5,
      date: '03 Feb 2026',
      message:
        'Outstanding! The customized bottles are perfect for our brand. Will order more.',
      category: 'Product Quality'
    },
    {
      id: 4,
      customerName: 'Hotel Sai Palace',
      contactPerson: 'Mr. Rajesh Kumar',
      rating: 4,
      date: '01 Feb 2026',
      message: 'Product is great but pricing could be more competitive.',
      category: 'Pricing'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFeedback, setEditingFeedback] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddFeedback = (formData) => {
    const newFeedback = {
      id: feedbacks.length + 1,
      customerName: formData.customerName,
      contactPerson: formData.contactPerson || 'N/A',
      rating: parseInt(formData.rating, 10) || 5,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      message: formData.message,
      category: formData.category
    }

    setFeedbacks([newFeedback, ...feedbacks])
    setIsModalOpen(false)
    alert('Feedback added successfully!')
  }

  const handleDeleteFeedback = () => {
    if (!deleteConfirm) return
    setFeedbacks((prev) => prev.filter((f) => f.id !== deleteConfirm))
    setDeleteConfirm(null)
    alert('Feedback deleted successfully!')
  }

  const handleEditFeedback = (updatedData) => {
    const updatedFeedbacks = feedbacks.map((f) =>
      f.id === editingFeedback.id
        ? { ...f, ...updatedData, rating: parseInt(updatedData.rating, 10) || 5 }
        : f
    )

    setFeedbacks(updatedFeedbacks)
    setEditingFeedback(null)
    setIsModalOpen(false)
    alert('Feedback updated successfully!')
  }

  const filteredFeedbacks = feedbacks.filter((fb) => {
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

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
          feedbacks.length
        ).toFixed(1)
      : '0.0'

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
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
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Add Feedback
        </button>
      </div>

      {/* Summary */}
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
            {averageRating}
            <span className="text-sm">/5</span>
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Positive Reviews</p>
          <h3 className="text-2xl font-semibold text-green-400 mt-1">
            {feedbacks.filter((fb) => fb.rating >= 4).length}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Needs Attention</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            {feedbacks.filter((fb) => fb.rating < 4).length}
          </h3>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-slate-800"
              onClick={() =>
                setExpandedId(
                  expandedId === feedback.id ? null : feedback.id
                )
              }
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-teal-400">
                    {feedback.customerName}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {feedback.contactPerson}
                  </p>
                  <p className="text-xs text-slate-500">{feedback.date}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${getRatingColor(
                      feedback.rating
                    )}`}
                  >
                    {feedback.rating}★
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded text-white ${getRatingBgColor(
                      feedback.rating
                    )}`}
                  >
                    {feedback.category}
                  </span>
                </div>
              </div>
            </div>

            {expandedId === feedback.id && (
              <div className="p-4 border-t border-slate-800 bg-slate-800">
                <p className="text-slate-300 mb-4">
                  "{feedback.message}"
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setEditingFeedback(feedback)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(feedback.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
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

      {/* Edit Modal */}
      <Modal
        isOpen={editingFeedback !== null}
        onClose={() => setEditingFeedback(null)}
        title="Edit Feedback"
      >
        {editingFeedback && (
          <AddFeedbackForm
            initialData={editingFeedback}
            isEdit
            onSubmit={handleEditFeedback}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Feedback"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete feedback{' '}
            <strong className="text-teal-400">
              #{deleteConfirm}
            </strong>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 bg-slate-700 text-slate-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteFeedback}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Feedback
