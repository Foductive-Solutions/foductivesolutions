import React, { useState, useEffect } from 'react'
import { 
  getOrders, 
  getCustomers, 
  getPurchases, 
  getExpenses,
  getVehicleStock,
  getVehicleStockSummary,
  getGodownStockSummary
} from '../../firebase/services'

// Helper function to format date for display
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr // Return as-is if invalid
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const Reports = () => {
  const [loading, setLoading] = useState(false)
  const [activeReport, setActiveReport] = useState('stock')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of month
    endDate: new Date().toISOString().split('T')[0] // Today
  })
  const [reportData, setReportData] = useState(null)

  const reportTypes = [
    { id: 'stock', name: 'Stock Summary', icon: '📦', description: 'Vehicle & Godown stock levels' },
    { id: 'sales', name: 'Sales Report', icon: '💰', description: 'Orders and revenue analysis' },
    { id: 'customer', name: 'Customer Report', icon: '👥', description: 'Customer-wise order summary' },
    { id: 'vehicle', name: 'Vehicle Loading', icon: '🚚', description: 'Vehicle stock loading history' },
    { id: 'purchase', name: 'Purchase Report', icon: '🛒', description: 'Purchase and payment summary' },
    { id: 'expense', name: 'Expense Report', icon: '📊', description: 'Expense tracking and analysis' }
  ]

  useEffect(() => {
    const generateStockReportInner = async () => {
      const [vehicleSummary, godownSummary] = await Promise.all([
        getVehicleStockSummary(),
        getGodownStockSummary()
      ])
      setReportData({ vehicleSummary, godownSummary })
    }

    const generateSalesReportInner = async () => {
      const orders = await getOrders()
      const filteredOrders = orders.filter(order => {
        // Parse the order date which is in format "08 Mar 2026" or similar
        let orderDateStr = order.date
        if (orderDateStr) {
          // Convert "08 Mar 2026" to ISO date for comparison
          const parsedDate = new Date(orderDateStr)
          if (!isNaN(parsedDate.getTime())) {
            orderDateStr = parsedDate.toISOString().split('T')[0]
          }
        } else if (order.createdAt?.toDate) {
          orderDateStr = order.createdAt.toDate().toISOString().split('T')[0]
        }
        return orderDateStr >= dateRange.startDate && orderDateStr <= dateRange.endDate
      })

      const summary = {
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.totalBill || o.billingAmount || 0), 0),
        totalPaid: filteredOrders.reduce((sum, o) => sum + (o.paid || 0), 0),
        totalPending: filteredOrders.reduce((sum, o) => sum + (o.remaining || 0), 0),
        totalBottles: {
          qty1000ml: filteredOrders.reduce((sum, o) => sum + (o.qty1000ml || 0), 0),
          qty500ml: filteredOrders.reduce((sum, o) => sum + (o.qty500ml || 0), 0),
          qty200ml: filteredOrders.reduce((sum, o) => sum + (o.qty200ml || 0), 0)
        },
        bySource: {
          vehicle: filteredOrders.filter(o => o.orderSource === 'vehicle').length,
          godown: filteredOrders.filter(o => o.orderSource === 'godown').length,
          unknown: filteredOrders.filter(o => !o.orderSource).length
        },
        byPaymentMode: {}
      }

      filteredOrders.forEach(order => {
        const mode = order.paymentMode || 'Unknown'
        if (!summary.byPaymentMode[mode]) {
          summary.byPaymentMode[mode] = { count: 0, amount: 0 }
        }
        summary.byPaymentMode[mode].count++
        summary.byPaymentMode[mode].amount += order.paid || 0
      })

      setReportData({ orders: filteredOrders, summary })
    }

    const generateCustomerReportInner = async () => {
      const [customers, orders] = await Promise.all([
        getCustomers(),
        getOrders()
      ])

      const customerData = customers.map(customer => {
        const customerOrders = orders.filter(o => 
          o.customer === customer.shopName || o.customerId === customer.id
        )
        return {
          ...customer,
          totalOrders: customerOrders.length,
          totalRevenue: customerOrders.reduce((sum, o) => sum + (o.totalBill || o.billingAmount || 0), 0),
          totalPaid: customerOrders.reduce((sum, o) => sum + (o.paid || 0), 0),
          totalPending: customerOrders.reduce((sum, o) => sum + (o.remaining || 0), 0)
        }
      }).sort((a, b) => b.totalRevenue - a.totalRevenue)

      setReportData({ customers: customerData })
    }

    const generateVehicleReportInner = async () => {
      const stocks = await getVehicleStock()
      const filteredStocks = stocks.filter(stock => {
        return stock.date >= dateRange.startDate && stock.date <= dateRange.endDate
      })

      const summary = {
        totalEntries: filteredStocks.length,
        totalLoaded: {
          qty1000ml: filteredStocks.reduce((sum, s) => sum + (s.qty1000ml || 0), 0),
          qty500ml: filteredStocks.reduce((sum, s) => sum + (s.qty500ml || 0), 0),
          qty200ml: filteredStocks.reduce((sum, s) => sum + (s.qty200ml || 0), 0)
        }
      }

      setReportData({ stocks: filteredStocks, summary })
    }

    const generatePurchaseReportInner = async () => {
      const purchases = await getPurchases()
      const filteredPurchases = purchases.filter(purchase => {
        const purchaseDate = purchase.orderDate || purchase.createdAt?.toDate?.()?.toISOString?.().split('T')[0]
        return purchaseDate >= dateRange.startDate && purchaseDate <= dateRange.endDate
      })

      const summary = {
        totalPurchases: filteredPurchases.length,
        totalAmount: filteredPurchases.reduce((sum, p) => sum + (p.billingAmount || 0), 0),
        totalPaid: filteredPurchases.reduce((sum, p) => sum + (p.paid || 0), 0),
        totalPending: filteredPurchases.reduce((sum, p) => sum + (p.remaining || 0), 0),
        totalBottles: {
          qty1000ml: filteredPurchases.reduce((sum, p) => sum + (p.qty1000ml || 0), 0),
          qty500ml: filteredPurchases.reduce((sum, p) => sum + (p.qty500ml || 0), 0),
          qty200ml: filteredPurchases.reduce((sum, p) => sum + (p.qty200ml || 0), 0)
        }
      }

      setReportData({ purchases: filteredPurchases, summary })
    }

    const generateExpenseReportInner = async () => {
      const expenses = await getExpenses()
      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = expense.date || expense.createdAt?.toDate?.()?.toISOString?.().split('T')[0]
        return expenseDate >= dateRange.startDate && expenseDate <= dateRange.endDate
      })

      const summary = {
        totalExpenses: filteredExpenses.length,
        totalAmount: filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
        byCategory: {}
      }

      filteredExpenses.forEach(expense => {
        const category = expense.category || 'Other'
        if (!summary.byCategory[category]) {
          summary.byCategory[category] = { count: 0, amount: 0 }
        }
        summary.byCategory[category].count++
        summary.byCategory[category].amount += expense.amount || 0
      })

      setReportData({ expenses: filteredExpenses, summary })
    }

    const runReport = async () => {
      setLoading(true)
      try {
        switch (activeReport) {
          case 'stock':
            await generateStockReportInner()
            break
          case 'sales':
            await generateSalesReportInner()
            break
          case 'customer':
            await generateCustomerReportInner()
            break
          case 'vehicle':
            await generateVehicleReportInner()
            break
          case 'purchase':
            await generatePurchaseReportInner()
            break
          case 'expense':
            await generateExpenseReportInner()
            break
          default:
            break
        }
      } catch (error) {
        console.error('Error generating report:', error)
        alert('Error generating report. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    runReport()
  }, [activeReport, dateRange])

  const downloadCSV = () => {
    if (!reportData) return

    let csvContent = ''
    let filename = ''

    switch (activeReport) {
      case 'stock':
        csvContent = generateStockCSV()
        filename = 'stock_report'
        break
      case 'sales':
        csvContent = generateSalesCSV()
        filename = 'sales_report'
        break
      case 'customer':
        csvContent = generateCustomerCSV()
        filename = 'customer_report'
        break
      case 'vehicle':
        csvContent = generateVehicleCSV()
        filename = 'vehicle_loading_report'
        break
      case 'purchase':
        csvContent = generatePurchaseCSV()
        filename = 'purchase_report'
        break
      case 'expense':
        csvContent = generateExpenseCSV()
        filename = 'expense_report'
        break
      default:
        return
    }

    // Add UTF-8 BOM for proper Excel encoding
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_${dateRange.startDate}_to_${dateRange.endDate}.csv`
    link.click()
  }

  const generateStockCSV = () => {
    const { vehicleSummary, godownSummary } = reportData
    return `Stock Summary Report\n\nVehicle Stock\nProduct,Loaded,Sold,Remaining\n1000ml,${vehicleSummary.totalLoaded.qty1000ml},${vehicleSummary.totalSold.qty1000ml},${vehicleSummary.remaining.qty1000ml}\n500ml,${vehicleSummary.totalLoaded.qty500ml},${vehicleSummary.totalSold.qty500ml},${vehicleSummary.remaining.qty500ml}\n200ml,${vehicleSummary.totalLoaded.qty200ml},${vehicleSummary.totalSold.qty200ml},${vehicleSummary.remaining.qty200ml}\n\nGodown Stock\nProduct,Purchased,Loaded to Vehicle,Sold from Godown,Remaining\n1000ml,${godownSummary.totalPurchased.qty1000ml},${godownSummary.totalLoadedToVehicle.qty1000ml},${godownSummary.soldFromGodown.qty1000ml},${godownSummary.remaining.qty1000ml}\n500ml,${godownSummary.totalPurchased.qty500ml},${godownSummary.totalLoadedToVehicle.qty500ml},${godownSummary.soldFromGodown.qty500ml},${godownSummary.remaining.qty500ml}\n200ml,${godownSummary.totalPurchased.qty200ml},${godownSummary.totalLoadedToVehicle.qty200ml},${godownSummary.soldFromGodown.qty200ml},${godownSummary.remaining.qty200ml}`
  }

  const generateSalesCSV = () => {
    const { orders, summary } = reportData
    let csv = `Sales Report (${dateRange.startDate} to ${dateRange.endDate})\n\nSummary\nTotal Orders,${summary.totalOrders}\nTotal Revenue (Rs),${summary.totalRevenue}\nTotal Paid (Rs),${summary.totalPaid}\nTotal Pending (Rs),${summary.totalPending}\n\nOrders\nDate,Customer,Source,1000ml,500ml,200ml,Total Bill (Rs),Paid (Rs),Remaining (Rs),Payment Mode\n`
    orders.forEach(o => {
      csv += `${o.date || 'N/A'},"${o.customer || 'N/A'}",${o.orderSource || 'N/A'},${o.qty1000ml || 0},${o.qty500ml || 0},${o.qty200ml || 0},${o.totalBill || o.billingAmount || 0},${o.paid || 0},${o.remaining || 0},${o.paymentMode || 'N/A'}\n`
    })
    return csv
  }

  const generateCustomerCSV = () => {
    const { customers } = reportData
    let csv = `Customer Report\n\nShop Name,Billing Person,Mobile,Location,Total Orders,Total Revenue (Rs),Total Paid (Rs),Pending (Rs)\n`
    customers.forEach(c => {
      csv += `"${c.shopName || ''}","${c.billingPerson || ''}","${c.mobile || ''}","${c.location || ''}",${c.totalOrders},${c.totalRevenue},${c.totalPaid},${c.totalPending}\n`
    })
    return csv
  }

  const generateVehicleCSV = () => {
    const { stocks, summary } = reportData
    let csv = `Vehicle Loading Report (${dateRange.startDate} to ${dateRange.endDate})\n\nSummary\nTotal Entries,${summary.totalEntries}\n1000ml Loaded,${summary.totalLoaded.qty1000ml}\n500ml Loaded,${summary.totalLoaded.qty500ml}\n200ml Loaded,${summary.totalLoaded.qty200ml}\n\nEntries\nDate,1000ml,500ml,200ml,Total,Notes\n`
    stocks.forEach(s => {
      csv += `${s.date || 'N/A'},${s.qty1000ml || 0},${s.qty500ml || 0},${s.qty200ml || 0},${s.totalBoxes || 0},"${s.notes || ''}"\n`
    })
    return csv
  }

  const generatePurchaseCSV = () => {
    const { purchases, summary } = reportData
    let csv = `Purchase Report (${dateRange.startDate} to ${dateRange.endDate})\n\nSummary\nTotal Purchases,${summary.totalPurchases}\nTotal Amount (Rs),${summary.totalAmount}\nTotal Paid (Rs),${summary.totalPaid}\nTotal Pending (Rs),${summary.totalPending}\n\nPurchases\nDate,Vendor,1000ml,500ml,200ml,Amount (Rs),Paid (Rs),Remaining (Rs),Status\n`
    purchases.forEach(p => {
      csv += `${p.orderDate || 'N/A'},"${p.vendorName || ''}",${p.qty1000ml || 0},${p.qty500ml || 0},${p.qty200ml || 0},${p.billingAmount || 0},${p.paid || 0},${p.remaining || 0},${p.status || 'N/A'}\n`
    })
    return csv
  }

  const generateExpenseCSV = () => {
    const { expenses, summary } = reportData
    let csv = `Expense Report (${dateRange.startDate} to ${dateRange.endDate})\n\nSummary\nTotal Expenses,${summary.totalExpenses}\nTotal Amount (Rs),${summary.totalAmount}\n\nBy Category\nCategory,Count,Amount (Rs)\n`
    Object.entries(summary.byCategory).forEach(([category, data]) => {
      csv += `${category},${data.count},${data.amount}\n`
    })
    csv += `\nExpenses\nDate,Name,Category,Amount (Rs),Description\n`
    expenses.forEach(e => {
      csv += `${e.date || 'N/A'},"${e.name || ''}",${e.category || 'N/A'},${e.amount || 0},"${e.description || ''}"\n`
    })
    return csv
  }

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-teal-400 text-lg">Generating report...</div>
        </div>
      )
    }

    if (!reportData) {
      return (
        <div className="text-center text-slate-400 py-8">
          Select a report type to view data
        </div>
      )
    }

    switch (activeReport) {
      case 'stock':
        return renderStockReport()
      case 'sales':
        return renderSalesReport()
      case 'customer':
        return renderCustomerReport()
      case 'vehicle':
        return renderVehicleReport()
      case 'purchase':
        return renderPurchaseReport()
      case 'expense':
        return renderExpenseReport()
      default:
        return null
    }
  }

  const renderStockReport = () => {
    if (!reportData?.vehicleSummary || !reportData?.godownSummary) {
      return <div className="text-center text-slate-400 py-8">Loading stock data...</div>
    }
    const { vehicleSummary, godownSummary } = reportData
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Stock */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-teal-400 mb-4">🚚 Vehicle Stock</h3>
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-sm">
                <th className="text-left pb-2">Product</th>
                <th className="text-right pb-2">Loaded</th>
                <th className="text-right pb-2">Sold</th>
                <th className="text-right pb-2">Remaining</th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr>
                <td className="py-2">1000ml</td>
                <td className="text-right">{vehicleSummary.totalLoaded.qty1000ml}</td>
                <td className="text-right">{vehicleSummary.totalSold.qty1000ml}</td>
                <td className="text-right font-semibold text-teal-400">{vehicleSummary.remaining.qty1000ml}</td>
              </tr>
              <tr>
                <td className="py-2">500ml</td>
                <td className="text-right">{vehicleSummary.totalLoaded.qty500ml}</td>
                <td className="text-right">{vehicleSummary.totalSold.qty500ml}</td>
                <td className="text-right font-semibold text-teal-400">{vehicleSummary.remaining.qty500ml}</td>
              </tr>
              <tr>
                <td className="py-2">200ml</td>
                <td className="text-right">{vehicleSummary.totalLoaded.qty200ml}</td>
                <td className="text-right">{vehicleSummary.totalSold.qty200ml}</td>
                <td className="text-right font-semibold text-teal-400">{vehicleSummary.remaining.qty200ml}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Godown Stock */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">🏭 Godown Stock</h3>
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-sm">
                <th className="text-left pb-2">Product</th>
                <th className="text-right pb-2">Purchased</th>
                <th className="text-right pb-2">To Vehicle</th>
                <th className="text-right pb-2">Remaining</th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr>
                <td className="py-2">1000ml</td>
                <td className="text-right">{godownSummary.totalPurchased.qty1000ml}</td>
                <td className="text-right">{godownSummary.totalLoadedToVehicle.qty1000ml}</td>
                <td className="text-right font-semibold text-blue-400">{godownSummary.remaining.qty1000ml}</td>
              </tr>
              <tr>
                <td className="py-2">500ml</td>
                <td className="text-right">{godownSummary.totalPurchased.qty500ml}</td>
                <td className="text-right">{godownSummary.totalLoadedToVehicle.qty500ml}</td>
                <td className="text-right font-semibold text-blue-400">{godownSummary.remaining.qty500ml}</td>
              </tr>
              <tr>
                <td className="py-2">200ml</td>
                <td className="text-right">{godownSummary.totalPurchased.qty200ml}</td>
                <td className="text-right">{godownSummary.totalLoadedToVehicle.qty200ml}</td>
                <td className="text-right font-semibold text-blue-400">{godownSummary.remaining.qty200ml}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderSalesReport = () => {
    if (!reportData?.orders || !reportData?.summary) {
      return <div className="text-center text-slate-400 py-8">Loading sales data...</div>
    }
    const { orders, summary } = reportData
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Orders</div>
            <div className="text-2xl font-bold text-white">{summary.totalOrders}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Revenue</div>
            <div className="text-2xl font-bold text-green-400">₹{summary.totalRevenue}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Paid</div>
            <div className="text-2xl font-bold text-teal-400">₹{summary.totalPaid}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Pending</div>
            <div className="text-2xl font-bold text-red-400">₹{summary.totalPending}</div>
          </div>
        </div>

        {/* By Source */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h4 className="text-slate-300 font-medium mb-3">Orders by Source</h4>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚚</span>
              <span className="text-white">Vehicle: {summary.bySource.vehicle}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🏭</span>
              <span className="text-white">Godown: {summary.bySource.godown}</span>
            </div>
            {summary.bySource.unknown > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Unknown: {summary.bySource.unknown}</span>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Source</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Total</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Paid</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {orders.slice(0, 10).map((order, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-white">{formatDisplayDate(order.date)}</td>
                    <td className="px-4 py-3 text-white">{order.customer || 'N/A'}</td>
                    <td className="px-4 py-3 text-center">
                      {order.orderSource === 'vehicle' ? '🚚' : order.orderSource === 'godown' ? '🏭' : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-white">₹{order.totalBill || order.billingAmount || 0}</td>
                    <td className="px-4 py-3 text-right text-teal-400">₹{order.paid || 0}</td>
                    <td className="px-4 py-3 text-right text-red-400">₹{order.remaining || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length > 10 && (
            <div className="p-4 text-center text-slate-400 text-sm">
              Showing 10 of {orders.length} orders. Download CSV for complete data.
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCustomerReport = () => {
    if (!reportData?.customers) {
      return <div className="text-center text-slate-400 py-8">Loading customer data...</div>
    }
    const { customers } = reportData
    return (
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Shop Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Contact</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Orders</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Paid</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {customers.map((customer, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-white">{customer.shopName || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-400">{customer.mobile || 'N/A'}</td>
                  <td className="px-4 py-3 text-center text-white">{customer.totalOrders}</td>
                  <td className="px-4 py-3 text-right text-green-400">₹{customer.totalRevenue}</td>
                  <td className="px-4 py-3 text-right text-teal-400">₹{customer.totalPaid}</td>
                  <td className="px-4 py-3 text-right text-red-400">₹{customer.totalPending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderVehicleReport = () => {
    if (!reportData?.stocks || !reportData?.summary) {
      return <div className="text-center text-slate-400 py-8">Loading vehicle data...</div>
    }
    const { stocks, summary } = reportData
    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Entries</div>
            <div className="text-2xl font-bold text-white">{summary.totalEntries}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">1000ml Loaded</div>
            <div className="text-2xl font-bold text-teal-400">{summary.totalLoaded.qty1000ml}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">500ml Loaded</div>
            <div className="text-2xl font-bold text-teal-400">{summary.totalLoaded.qty500ml}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">200ml Loaded</div>
            <div className="text-2xl font-bold text-teal-400">{summary.totalLoaded.qty200ml}</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">1000ml</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">500ml</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">200ml</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {stocks.map((stock, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-white">{stock.date || 'N/A'}</td>
                    <td className="px-4 py-3 text-center text-white">{stock.qty1000ml || 0}</td>
                    <td className="px-4 py-3 text-center text-white">{stock.qty500ml || 0}</td>
                    <td className="px-4 py-3 text-center text-white">{stock.qty200ml || 0}</td>
                    <td className="px-4 py-3 text-center text-teal-400 font-semibold">{stock.totalBoxes || 0}</td>
                    <td className="px-4 py-3 text-slate-400">{stock.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderPurchaseReport = () => {
    if (!reportData?.purchases || !reportData?.summary) {
      return <div className="text-center text-slate-400 py-8">Loading purchase data...</div>
    }
    const { purchases, summary } = reportData
    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Purchases</div>
            <div className="text-2xl font-bold text-white">{summary.totalPurchases}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Amount</div>
            <div className="text-2xl font-bold text-yellow-400">₹{summary.totalAmount}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Paid</div>
            <div className="text-2xl font-bold text-teal-400">₹{summary.totalPaid}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Pending</div>
            <div className="text-2xl font-bold text-red-400">₹{summary.totalPending}</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Vendor</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Paid</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Pending</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {purchases.map((purchase, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-white">{purchase.orderDate || 'N/A'}</td>
                    <td className="px-4 py-3 text-white">{purchase.vendorName || 'N/A'}</td>
                    <td className="px-4 py-3 text-right text-white">₹{purchase.billingAmount || 0}</td>
                    <td className="px-4 py-3 text-right text-teal-400">₹{purchase.paid || 0}</td>
                    <td className="px-4 py-3 text-right text-red-400">₹{purchase.remaining || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        purchase.status === 'Paid' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {purchase.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderExpenseReport = () => {
    if (!reportData?.expenses || !reportData?.summary) {
      return <div className="text-center text-slate-400 py-8">Loading expense data...</div>
    }
    const { expenses, summary } = reportData
    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Expenses</div>
            <div className="text-2xl font-bold text-white">{summary.totalExpenses}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-slate-400 text-sm">Total Amount</div>
            <div className="text-2xl font-bold text-red-400">₹{summary.totalAmount}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 md:col-span-1">
            <div className="text-slate-400 text-sm mb-2">By Category</div>
            <div className="space-y-1">
              {Object.entries(summary.byCategory).map(([category, data]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-slate-300">{category}</span>
                  <span className="text-white">₹{data.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {expenses.map((expense, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-white">{expense.date || 'N/A'}</td>
                    <td className="px-4 py-3 text-white">{expense.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-400">{expense.category || 'N/A'}</td>
                    <td className="px-4 py-3 text-right text-red-400">₹{expense.amount || 0}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{expense.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">📈 Reports</h1>
          <p className="text-slate-400 text-sm">Generate and download various reports</p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={!reportData || loading}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition font-medium flex items-center gap-2"
        >
          <span>📥</span> Download CSV
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`p-4 rounded-lg border transition text-left ${
              activeReport === report.id
                ? 'bg-teal-600/20 border-teal-500 text-teal-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-2xl mb-2">{report.icon}</div>
            <div className="font-medium text-white text-sm">{report.name}</div>
            <div className="text-xs text-slate-500 mt-1 hidden md:block">{report.description}</div>
          </button>
        ))}
      </div>

      {/* Date Range Filter (for applicable reports) */}
      {['sales', 'vehicle', 'purchase', 'expense'].includes(activeReport) && (
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-slate-300 text-sm">Date Range:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
            />
          </div>
        </div>
      )}

      {/* Report Content */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        {renderReportContent()}
      </div>
    </div>
  )
}

export default Reports
