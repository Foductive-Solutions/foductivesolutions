import React, { useState } from 'react'
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/forms/AddExpenseForm'

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: "Petrol",
      amount: 5000,
      date: "05 Feb 2026",
      paymentMode: "Cash",
      category: "Transport"
    },
    {
      id: 2,
      name: "Driver Salary",
      amount: 25000,
      date: "01 Feb 2026",
      paymentMode: "Bank Transfer",
      category: "Salary"
    },
    {
      id: 3,
      name: "Vehicle Maintenance",
      amount: 3500,
      date: "04 Feb 2026",
      paymentMode: "Cash",
      category: "Maintenance"
    },
    {
      id: 4,
      name: "Rent",
      amount: 15000,
      date: "01 Feb 2026",
      paymentMode: "Check",
      category: "Rent"
    },
    {
      id: 5,
      name: "Labour Charges",
      amount: 8000,
      date: "05 Feb 2026",
      paymentMode: "Cash",
      category: "Labour"
    },
    {
      id: 6,
      name: "Miscellaneous",
      amount: 2500,
      date: "03 Feb 2026",
      paymentMode: "UPI",
      category: "Other"
    },
  ])

  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [settleModal, setSettleModal] = useState({ isOpen: false, expenseId: null })

  const handleAddExpense = (formData) => {
    const newExpense = {
      id: expenses.length + 1,
      name: formData.name,
      amount: parseInt(formData.amount) || 0,
      date: formData.date,
      paymentMode: formData.paymentMode,
      category: formData.category,
      paid: true // Expenses are typically marked as paid when added
    }
    setExpenses([newExpense, ...expenses])
    setIsModalOpen(false)
    alert('Expense added successfully!')
  }

  const openSettleModal = (expenseId) => {
    setSettleModal({ isOpen: true, expenseId })
  }

  const handleSettleExpense = () => {
    const updatedExpenses = expenses.map(e => {
      if (e.id === settleModal.expenseId) {
        return {
          ...e,
          paid: true
        }
      }
      return e
    })
    setExpenses(updatedExpenses)
    setSettleModal({ isOpen: false, expenseId: null })
    alert('Expense marked as settled!')
  }

  const categories = ['Petrol', 'Driver Salary', 'Vehicle Maintenance', 'Rent', 'Labour Charges', 'Miscellaneous']

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true
    return expense.name.toLowerCase() === filter.toLowerCase()
  })

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-6 text-slate-200">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Expenses
          </h1>
          <p className="text-sm text-slate-400">
            Track and manage company expenses
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Expenses (Feb)</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            ₹ {expenses.reduce((sum, exp) => sum + exp.amount, 0)}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Salary Expenses</p>
          <h3 className="text-2xl font-semibold text-yellow-400 mt-1">
            ₹ {expenses.filter(e => e.category === 'Salary').reduce((sum, e) => sum + e.amount, 0)}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Transport & Maintenance</p>
          <h3 className="text-2xl font-semibold text-orange-400 mt-1">
            ₹ {expenses.filter(e => ['Transport', 'Maintenance'].includes(e.category)).reduce((sum, e) => sum + e.amount, 0)}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Fixed Costs (Rent)</p>
          <h3 className="text-2xl font-semibold text-blue-400 mt-1">
            ₹ {expenses.filter(e => e.category === 'Rent').reduce((sum, e) => sum + e.amount, 0)}
          </h3>
        </div>
      </div>

      {/* Filter by Category */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <p className="text-sm text-slate-400 mb-3">Filter by Expense Type:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">Expense Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Payment Mode</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-800 transition">
                  <td className="px-4 py-3 text-slate-300 font-medium">
                    {expense.name}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    <span className="px-2 py-1 bg-slate-800 rounded text-xs">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {expense.date}
                  </td>
                  <td className="px-4 py-3 text-right text-red-400 font-semibold">
                    - ₹ {expense.amount}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {expense.paymentMode}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      expense.paid
                        ? 'bg-green-900 text-green-200'
                        : 'bg-yellow-900 text-yellow-200'
                    }`}>
                      {expense.paid ? '✓ Settled' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!expense.paid && (
                      <button
                        onClick={() => openSettleModal(expense.id)}
                        className="text-green-400 hover:text-green-300 text-sm font-medium transition"
                      >
                        💳 Settle
                      </button>
                    )}
                    {expense.paid && (
                      <span className="text-green-400 text-sm">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredExpenses.length > 0 && (
          <div className="bg-slate-800 px-4 py-3 text-right border-t border-slate-700">
            <p className="text-white font-semibold">
              Total: <span className="text-red-400">₹ {totalExpenses}</span>
            </p>
          </div>
        )}
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Breakdown by Category
          </h3>
          <div className="space-y-3">
            {Array.from(new Set(expenses.map(e => e.category))).map((category) => {
              const categoryTotal = expenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + e.amount, 0)
              const percentage = ((categoryTotal / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)
              
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-300">{category}</span>
                    <span className="text-sm text-teal-400 font-medium">
                      ₹ {categoryTotal} ({percentage}%)
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

        {/* By Payment Mode */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Breakdown by Payment Mode
          </h3>
          <div className="space-y-3">
            {Array.from(new Set(expenses.map(e => e.paymentMode))).map((mode) => {
              const modeTotal = expenses
                .filter(e => e.paymentMode === mode)
                .reduce((sum, e) => sum + e.amount, 0)
              const percentage = ((modeTotal / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)
              
              return (
                <div key={mode}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-300">{mode}</span>
                    <span className="text-sm text-teal-400 font-medium">
                      ₹ {modeTotal} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
      >
        <AddExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      {/* Settle Expense Modal */}
      <Modal
        isOpen={settleModal.isOpen}
        onClose={() => setSettleModal({ isOpen: false, expenseId: null })}
        title="Settle Expense"
      >
        <div className="space-y-4">
          {settleModal.expenseId && expenses.find(e => e.id === settleModal.expenseId) && (
            <>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-2">
                <p className="text-slate-300">
                  <strong>Expense:</strong> {expenses.find(e => e.id === settleModal.expenseId)?.name}
                </p>
                <p className="text-slate-300">
                  <strong>Category:</strong> {expenses.find(e => e.id === settleModal.expenseId)?.category}
                </p>
                <p className="text-slate-300">
                  <strong>Amount:</strong> <span className="text-red-400 font-semibold">₹ {expenses.find(e => e.id === settleModal.expenseId)?.amount}</span>
                </p>
                <p className="text-slate-300">
                  <strong>Payment Mode:</strong> {expenses.find(e => e.id === settleModal.expenseId)?.paymentMode}
                </p>
              </div>

              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-3">
                <p className="text-yellow-200 text-sm">
                  <strong>Confirm settlement of this expense?</strong> This will mark the transaction as complete.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setSettleModal({ isOpen: false, expenseId: null })}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSettleExpense}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                >
                  Confirm Settlement
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>    </div>
  )
}

export default Expenses
