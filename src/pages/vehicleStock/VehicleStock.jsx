import React, { useState, useEffect } from 'react'
import Modal from '../../components/Modal'
import AddVehicleStockForm from '../../components/forms/AddVehicleStockForm'
import { 
  getVehicleStock, 
  addVehicleStock, 
  updateVehicleStock, 
  deleteVehicleStock,
  getVehicleStockSummary,
  getGodownStockSummary
} from '../../firebase/services'

const VehicleStock = () => {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStock, setEditingStock] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [vehicleSummary, setVehicleSummary] = useState(null)
  const [godownSummary, setGodownSummary] = useState(null)
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [stockData, vehicleData, godownData] = await Promise.all([
        getVehicleStock(),
        getVehicleStockSummary(),
        getGodownStockSummary()
      ])
      setStocks(stockData)
      setVehicleSummary(vehicleData)
      setGodownSummary(godownData)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error loading vehicle stock. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStock = async (formData) => {
    try {
      const q1 = parseInt(formData.qty1000ml) || 0
      const q2 = parseInt(formData.qty500ml) || 0
      const q3 = parseInt(formData.qty200ml) || 0

      const newStock = {
        date: formData.date,
        qty1000ml: q1,
        qty500ml: q2,
        qty200ml: q3,
        totalBoxes: q1 + q2 + q3,
        notes: formData.notes || ''
      }

      await addVehicleStock(newStock)
      await fetchData()
      setIsModalOpen(false)
      alert('Stock added to vehicle successfully!')
    } catch (error) {
      console.error('Error adding stock:', error)
      alert('Error adding stock. Please try again.')
    }
  }

  const handleEditStock = async (updatedData) => {
    try {
      const q1 = parseInt(updatedData.qty1000ml) || 0
      const q2 = parseInt(updatedData.qty500ml) || 0
      const q3 = parseInt(updatedData.qty200ml) || 0

      await updateVehicleStock(editingStock.id, {
        date: updatedData.date,
        qty1000ml: q1,
        qty500ml: q2,
        qty200ml: q3,
        totalBoxes: q1 + q2 + q3,
        notes: updatedData.notes || ''
      })

      await fetchData()
      setEditingStock(null)
      setIsModalOpen(false)
      alert('Stock updated successfully!')
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Error updating stock. Please try again.')
    }
  }

  const handleDeleteStock = async () => {
    if (!deleteConfirm) return
    try {
      await deleteVehicleStock(deleteConfirm)
      await fetchData()
      setDeleteConfirm(null)
      alert('Stock entry deleted successfully!')
    } catch (error) {
      console.error('Error deleting stock:', error)
      alert('Error deleting stock. Please try again.')
    }
  }

  const openEditModal = (stock) => {
    setEditingStock(stock)
    setIsModalOpen(true)
  }

  const filteredStocks = dateFilter 
    ? stocks.filter(s => s.date === dateFilter)
    : stocks

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-teal-400 text-lg">Loading vehicle stock...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">🚚 Vehicle Stock</h1>
          <p className="text-slate-400 text-sm">Manage products loaded in vehicle</p>
        </div>
        <button
          onClick={() => {
            setEditingStock(null)
            setIsModalOpen(true)
          }}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition font-medium flex items-center gap-2"
        >
          <span>➕</span> Load Stock to Vehicle
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vehicle Current Stock */}
        <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-lg p-4 border border-teal-700">
          <h3 className="text-teal-300 text-sm font-medium mb-3">🚚 Current Vehicle Stock</h3>
          {vehicleSummary && (
            <div className="space-y-2">
              <div className="flex justify-between text-white">
                <span>1000ml:</span>
                <span className="font-semibold">{vehicleSummary.remaining.qty1000ml} boxes</span>
              </div>
              <div className="flex justify-between text-white">
                <span>500ml:</span>
                <span className="font-semibold">{vehicleSummary.remaining.qty500ml} boxes</span>
              </div>
              <div className="flex justify-between text-white">
                <span>200ml:</span>
                <span className="font-semibold">{vehicleSummary.remaining.qty200ml} boxes</span>
              </div>
              <div className="border-t border-teal-600 pt-2 mt-2">
                <div className="flex justify-between text-teal-200">
                  <span>Total:</span>
                  <span className="font-bold text-lg">
                    {vehicleSummary.remaining.qty1000ml + vehicleSummary.remaining.qty500ml + vehicleSummary.remaining.qty200ml} boxes
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Godown Current Stock */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
          <h3 className="text-blue-300 text-sm font-medium mb-3">🏭 Current Godown Stock</h3>
          {godownSummary && (
            <div className="space-y-2">
              <div className="flex justify-between text-white">
                <span>1000ml:</span>
                <span className="font-semibold">{godownSummary.remaining.qty1000ml} boxes</span>
              </div>
              <div className="flex justify-between text-white">
                <span>500ml:</span>
                <span className="font-semibold">{godownSummary.remaining.qty500ml} boxes</span>
              </div>
              <div className="flex justify-between text-white">
                <span>200ml:</span>
                <span className="font-semibold">{godownSummary.remaining.qty200ml} boxes</span>
              </div>
              <div className="border-t border-blue-600 pt-2 mt-2">
                <div className="flex justify-between text-blue-200">
                  <span>Total:</span>
                  <span className="font-bold text-lg">
                    {godownSummary.remaining.qty1000ml + godownSummary.remaining.qty500ml + godownSummary.remaining.qty200ml} boxes
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Today's Loading Summary */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
          <h3 className="text-purple-300 text-sm font-medium mb-3">📊 Total Loaded to Vehicle</h3>
          {vehicleSummary && (
            <div className="space-y-2">
              <div className="flex justify-between text-white">
                <span>1000ml:</span>
                <span className="font-semibold">{vehicleSummary.totalLoaded.qty1000ml} boxes</span>
              </div>
              <div className="flex justify-between text-white">
                <span>500ml:</span>
                <span className="font-semibold">{vehicleSummary.totalLoaded.qty500ml} boxes</span>
              </div>
              <div className="flex justify-between text-white">
                <span>200ml:</span>
                <span className="font-semibold">{vehicleSummary.totalLoaded.qty200ml} boxes</span>
              </div>
              <div className="border-t border-purple-600 pt-2 mt-2">
                <div className="flex justify-between text-purple-200">
                  <span>Sold from Vehicle:</span>
                  <span className="font-bold">
                    {vehicleSummary.totalSold.qty1000ml + vehicleSummary.totalSold.qty500ml + vehicleSummary.totalSold.qty200ml} boxes
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="text-slate-300 text-sm">Filter by Date:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-teal-400 hover:text-teal-300 text-sm"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Stock List */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">1000ml</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">500ml</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">200ml</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    No stock entries found. Click "Load Stock to Vehicle" to add.
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3 text-white">{formatDate(stock.date)}</td>
                    <td className="px-4 py-3 text-center text-white">{stock.qty1000ml || 0}</td>
                    <td className="px-4 py-3 text-center text-white">{stock.qty500ml || 0}</td>
                    <td className="px-4 py-3 text-center text-white">{stock.qty200ml || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-teal-600/20 text-teal-400 rounded-full text-sm font-medium">
                        {stock.totalBoxes || (stock.qty1000ml || 0) + (stock.qty500ml || 0) + (stock.qty200ml || 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm max-w-xs truncate">
                      {stock.notes || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(stock)}
                          className="px-2 py-1 text-blue-400 hover:bg-blue-600/20 rounded transition text-sm"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(stock.id)}
                          className="px-2 py-1 text-red-400 hover:bg-red-600/20 rounded transition text-sm"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStock(null)
        }}
        title={editingStock ? "Edit Stock Entry" : "Load Stock to Vehicle"}
      >
        <AddVehicleStockForm
          onSubmit={editingStock ? handleEditStock : handleAddStock}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingStock(null)
          }}
          initialData={editingStock}
          isEdit={!!editingStock}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete this stock entry? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStock}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default VehicleStock
