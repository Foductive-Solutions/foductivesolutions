import React, { useState } from 'react'
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/forms/AddExpenseForm'

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: 'Petrol',
      amount: 5000,
      date: '05 Feb 2026',
      paymentMode: 'Cash',
      category: 'Transport',
      paid: true
    },
    {
      id: 2,
      name: 'Driver Salary',
      amount: 25000,
      date: '01 Feb 2026',
      paymentMode: 'Bank Transfer',
      category: 'Salary',
      paid: true
    },
    {
      id: 3,
      name: 'Vehicle Maintenance',
      amount: 3500,
      date: '04 Feb 2026',
      paymentMode: 'Cash',
      category: 'Maintenance',
      paid: true
    },
    {
      id: 4,
      name: 'Rent',
      amount: 15000,
      date: '01 Feb 2026',
      paymentMode: 'Check',
      category: 'Rent',
      paid: true
    },
    {
      id: 5,
      name: 'Labour Charges',
      amount: 8000,
      date: '05 Feb 2026',
      paymentMode: 'Cash',
      category: 'Labour',
      paid: true
    },
    {
      id: 6,
      name: 'Miscellaneous',
      amount: 2500,
      date: '03 Feb 2026',
      paymentMode: 'UPI',
      category: 'Other',
      paid: true
    }
  ])

  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [settleModal, setSettleModal] = useState({ isOpen: false, expenseId: null })
  const [editingExpense, setEditingExpense] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddExpense = (formData) => {
    const newExpense = {
      id: expenses.length + 1,
      name: formData.name,
      amount: parseInt(formData.amount, 10) || 0,
      date: formData.date,
      paymentMode: formData.paymentMode,
      category: formData.category,
      paid: true
    }

    setExpenses([newExpense, ...expenses])
    setIsModalOpen(false)
    alert('Expense added successfully!')
  }

  const handleDeleteExpense = () => {
    if (!deleteConfirm) return
    setExpenses((prev) => prev.filter((e) => e.id !== deleteConfirm))
    setDeleteConfirm(null)
    alert('Expense deleted successfully!')
  }

  const handleEditExpense = (updatedData) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === editingExpense.id
          ? { ...e, ...updatedData, amount: parseInt(updatedData.amount, 10) || 0 }
          : e
      )
    )
    setEditingExpense(null)
    setIsModalOpen(false)
    alert('Expense updated successfully!')
  }

  const openSettleModal = (expenseId) => {
    setSettleModal({ isOpen: true, expenseId })
  }

  const handleSettleExpense = () => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === settleModal.expenseId ? { ...e, paid: true } : e
      )
    )
    setSettleModal({ isOpen: false, expenseId: null })
    alert('Expense marked as settled!')
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
    return expense.name.toLowerCase() === filter.toLowerCase()
  })

  const totalExpenses = filteredExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  )

  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0) || 1

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
            ₹ {expenses.filter((e) => e.category === 'Salary').reduce((s, e) => s + e.amount, 0)}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Transport & Maintenance</p>
          <h3 className="text-2xl font-semibold text-orange-400 mt-1">
            ₹ {expenses.filter((e) => ['Transport', 'Maintenance'].includes(e.category)).reduce((s, e) => s + e.amount, 0)}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Rent</p>
          <h3 className="text-2xl font-semibold text-blue-400 mt-1">
            ₹ {expenses.filter((e) => e.category === 'Rent').reduce((s, e) => s + e.amount, 0)}
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
            {filteredExpenses.map((expense) => (
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
            ))}
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
