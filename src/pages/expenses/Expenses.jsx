import React, { useState, useEffect } from 'react'
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/forms/AddExpenseForm'
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../../firebase/services'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [settleModal, setSettleModal] = useState({ isOpen: false, expenseId: null })
  const [editingExpense, setEditingExpense] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const data = await getExpenses()
      setExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      alert('Error loading expenses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (formData) => {
    try {
      const newExpense = {
        name: formData.name,
        amount: parseInt(formData.amount, 10) || 0,
        date: formData.date || new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        paymentMode: formData.paymentMode,
        category: formData.category,
        paid: true
      }

      await addExpense(newExpense)
      await fetchExpenses()
      setIsModalOpen(false)
      alert('Expense added successfully!')
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('Error adding expense. Please try again.')
    }
  }

  const handleDeleteExpense = async () => {
    if (!deleteConfirm) return
    try {
      await deleteExpense(deleteConfirm)
      await fetchExpenses()
      setDeleteConfirm(null)
      alert('Expense deleted successfully!')
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Error deleting expense. Please try again.')
    }
  }

  const handleEditExpense = async (updatedData) => {
    try {
      await updateExpense(editingExpense.id, {
        ...updatedData,
        amount: parseInt(updatedData.amount, 10) || 0
      })
      await fetchExpenses()
      setEditingExpense(null)
      setIsModalOpen(false)
      alert('Expense updated successfully!')
    } catch (error) {
      console.error('Error updating expense:', error)
      alert('Error updating expense. Please try again.')
    }
  }

  const openSettleModal = (expenseId) => {
    setSettleModal({ isOpen: true, expenseId })
  }

  const handleSettleExpense = async () => {
    try {
      await updateExpense(settleModal.expenseId, { paid: true })
      await fetchExpenses()
      setSettleModal({ isOpen: false, expenseId: null })
      alert('Expense marked as settled!')
    } catch (error) {
      console.error('Error settling expense:', error)
      alert('Error settling expense. Please try again.')
    }
  }

  const categories = [
    'Petrol',
    'Driver Salary',
    'Vehicle Maintenance',
    'Rent',
    'Labour Charges',
    'Miscellaneous'
  ]

  const filteredExpenses = expenses.filter((expense) => {
    if (filter === 'all') return true
    return expense.name?.toLowerCase() === filter.toLowerCase()
  })

  const totalExpenses = filteredExpenses.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0
  )

  const grandTotal = expenses.reduce((sum, e) => sum + (e.amount || 0), 0) || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-teal-400 text-lg">Loading expenses...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Expenses</h1>
          <p className="text-sm text-slate-400">
            Track and manage company expenses
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Add Expense
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Expenses</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            ₹ {grandTotal}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Salary Expenses</p>
          <h3 className="text-2xl font-semibold text-yellow-400 mt-1">
            ₹ {expenses.filter((e) => e.category === 'Salary').reduce((s, e) => s + (e.amount || 0), 0)}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Transport & Maintenance</p>
          <h3 className="text-2xl font-semibold text-orange-400 mt-1">
            ₹ {expenses.filter((e) => ['Transport', 'Maintenance'].includes(e.category)).reduce((s, e) => s + (e.amount || 0), 0)}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Rent</p>
          <h3 className="text-2xl font-semibold text-blue-400 mt-1">
            ₹ {expenses.filter((e) => e.category === 'Rent').reduce((s, e) => s + (e.amount || 0), 0)}
          </h3>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Mode</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                  No expenses found. Add your first expense!
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-800">
                <td className="px-4 py-3">{expense.name}</td>
                <td className="px-4 py-3">{expense.category}</td>
                <td className="px-4 py-3">{expense.date}</td>
                <td className="px-4 py-3 text-right text-red-400 font-semibold">
                  - ₹ {expense.amount}
                </td>
                <td className="px-4 py-3">{expense.paymentMode}</td>
                <td className="px-4 py-3 text-center">
                  {expense.paid ? '✓ Settled' : 'Pending'}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  {!expense.paid && (
                    <button
                      onClick={() => openSettleModal(expense.id)}
                      className="text-green-400"
                    >
                      Settle
                    </button>
                  )}
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(expense.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>

        <div className="bg-slate-800 px-4 py-3 text-right">
          <strong>
            Total: <span className="text-red-400">₹ {totalExpenses}</span>
          </strong>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
      >
        <AddExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingExpense !== null}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        {editingExpense && (
          <AddExpenseForm
            initialData={editingExpense}
            isEdit
            onSubmit={handleEditExpense}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Expense"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete expense #{deleteConfirm}?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 bg-slate-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteExpense}
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

export default Expenses
