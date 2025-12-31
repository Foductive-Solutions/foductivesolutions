import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../components/Modal'
import AddCustomerForm from '../../components/forms/AddCustomerForm'
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../firebase/services'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Fetch customers from Firebase on mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
      alert('Error loading customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile?.includes(searchTerm)
  )

  const handleAddCustomer = async (formData) => {
    try {
      const customerData = {
        shopName: formData.shopName,
        billingPerson: formData.billingPerson,
        mobile: formData.mobile,
        location: formData.location,
        customized: formData.customized || 'No',
        rate1000ml: formData.rate1000ml ? `₹ ${formData.rate1000ml}` : '₹ 0',
        rate500ml: formData.rate500ml ? `₹ ${formData.rate500ml}` : '₹ 0',
        rate100ml: formData.rate100ml ? `₹ ${formData.rate100ml}` : '₹ 0',
        frequency: formData.frequency || 'Weekly'
      }
      
      await addCustomer(customerData)
      await fetchCustomers() // Refresh the list
      setIsModalOpen(false)
      alert('Customer added successfully!')
    } catch (error) {
      console.error('Error adding customer:', error)
      alert('Error adding customer. Please try again.')
    }
  }

  const handleDeleteCustomer = async () => {
    if (!deleteConfirm) return
    try {
      await deleteCustomer(deleteConfirm)
      await fetchCustomers() // Refresh the list
      setDeleteConfirm(null)
      alert('Customer deleted successfully!')
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Error deleting customer. Please try again.')
    }
  }

  const handleEditCustomer = async (updatedData) => {
    try {
      const customerData = {
        shopName: updatedData.shopName,
        billingPerson: updatedData.billingPerson,
        mobile: updatedData.mobile,
        location: updatedData.location,
        customized: updatedData.customized || 'No',
        rate1000ml: updatedData.rate1000ml ? `₹ ${updatedData.rate1000ml}` : '₹ 0',
        rate500ml: updatedData.rate500ml ? `₹ ${updatedData.rate500ml}` : '₹ 0',
        rate100ml: updatedData.rate100ml ? `₹ ${updatedData.rate100ml}` : '₹ 0',
        frequency: updatedData.frequency || 'Weekly'
      }
      
      await updateCustomer(editingCustomer.id, customerData)
      await fetchCustomers() // Refresh the list
      setEditingCustomer(null)
      setIsModalOpen(false)
      alert('Customer updated successfully!')
    } catch (error) {
      console.error('Error updating customer:', error)
      alert('Error updating customer. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-teal-400 text-lg">Loading customers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Customers</h1>
          <p className="text-sm text-slate-400">
            Manage all customer accounts and details
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <input
          type="text"
          placeholder="Search by shop name or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">Shop Name</th>
              <th className="px-4 py-3 text-left">Billing Person</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Customized</th>
              <th className="px-4 py-3 text-left">Frequency</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                  No customers found. Add your first customer!
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-800">
                <td className="px-4 py-3 text-teal-400 font-medium">
                  {customer.shopName}
                </td>
                <td className="px-4 py-3">{customer.billingPerson}</td>
                <td className="px-4 py-3">{customer.mobile}</td>
                <td className="px-4 py-3">{customer.location}</td>
                <td className="px-4 py-3">{customer.customized}</td>
                <td className="px-4 py-3">{customer.frequency}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <Link
                    to={`/customer/${customer.id}`}
                    className="text-teal-400"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => setEditingCustomer(customer)}
                    className="text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(customer.id)}
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
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Customer"
      >
        <AddCustomerForm
          onSubmit={handleAddCustomer}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingCustomer !== null}
        onClose={() => setEditingCustomer(null)}
        title="Edit Customer"
      >
        {editingCustomer && (
          <AddCustomerForm
            initialData={editingCustomer}
            isEdit
            onSubmit={handleEditCustomer}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Customer"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete this customer?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 bg-slate-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCustomer}
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

export default Customers
