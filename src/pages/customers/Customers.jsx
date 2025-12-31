import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../components/Modal'
import AddCustomerForm from '../../components/forms/AddCustomerForm'

const Customers = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      shopName: "Hotel Sai Palace",
      billingPerson: "Mr. Rajesh Kumar",
      mobile: "+91 98765 43210",
      location: "Sector 5, Downtown",
      customized: "Yes",
      rate1000ml: "₹ 45",
      rate500ml: "₹ 25",
      rate100ml: "₹ 8",
      frequency: "Bi-weekly"
    },
    {
      id: 2,
      shopName: "Green Leaf Cafe",
      billingPerson: "Ms. Priya Singh",
      mobile: "+91 98765 43211",
      location: "Market Road, City Center",
      customized: "No",
      rate1000ml: "₹ 42",
      rate500ml: "₹ 23",
      rate100ml: "₹ 7",
      frequency: "Weekly"
    },
    {
      id: 3,
      shopName: "Royal Mess",
      billingPerson: "Mr. Vikram Patel",
      mobile: "+91 98765 43212",
      location: "JP Road, East Wing",
      customized: "Yes",
      rate1000ml: "₹ 48",
      rate500ml: "₹ 26",
      rate100ml: "₹ 9",
      frequency: "Tri-weekly"
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredCustomers = customers.filter(customer =>
    customer.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm)
  )

  const handleAddCustomer = (formData) => {
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
      rate1000ml: formData.rate1000ml ? `₹ ${formData.rate1000ml}` : '₹ 0',
      rate500ml: formData.rate500ml ? `₹ ${formData.rate500ml}` : '₹ 0',
      rate100ml: formData.rate100ml ? `₹ ${formData.rate100ml}` : '₹ 0'
    }
    setCustomers([...customers, newCustomer])
    setIsModalOpen(false)
    alert('Customer added successfully!')
  }

  return (
    <div className="space-y-6 text-slate-200">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Customers
          </h1>
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

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <input
          type="text"
          placeholder="Search by shop name or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-800 transition">
                  <td className="px-4 py-3 font-medium text-teal-400">
                    {customer.shopName}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {customer.billingPerson}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {customer.mobile}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {customer.location}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      customer.customized === "Yes"
                        ? "bg-green-900 text-green-200"
                        : "bg-gray-700 text-gray-200"
                    }`}>
                      {customer.customized}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {customer.frequency}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      to={`/customer/${customer.id}`}
                      className="text-teal-400 hover:text-teal-300 font-medium transition"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-1">Total Customers</p>
          <h3 className="text-2xl font-semibold text-teal-400">
            {customers.length}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-1">Active This Week</p>
          <h3 className="text-2xl font-semibold text-green-400">
            {customers.filter(c => c.frequency === "Weekly").length}
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-1">Customized Orders</p>
          <h3 className="text-2xl font-semibold text-yellow-400">
            {customers.filter(c => c.customized === "Yes").length}
          </h3>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
      >
        <AddCustomerForm
          onSubmit={handleAddCustomer}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Customers
