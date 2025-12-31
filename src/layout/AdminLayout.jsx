import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCustomers, getOrders } from "../firebase/services";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      
      // Fetch all data
      const [customers, orders] = await Promise.all([
        getCustomers(),
        getOrders()
      ]);

      // Generate customer report with order statistics
      const reportData = customers.map(customer => {
        // Find all orders for this customer
        const customerOrders = orders.filter(o => 
          o.customer === customer.shopName || o.customerId === customer.id
        );

        // Calculate statistics
        const totalOrders = customerOrders.length;
        const totalBottles = customerOrders.reduce((sum, o) => 
          sum + (o.qty1000ml || 0) + (o.qty500ml || 0) + (o.qty100ml || 0), 0
        );
        const totalBilled = customerOrders.reduce((sum, o) => 
          sum + (o.totalBill || o.billingAmount || 0), 0
        );
        const totalPaid = customerOrders.reduce((sum, o) => sum + (o.paid || 0), 0);
        const totalPending = customerOrders.reduce((sum, o) => sum + (o.remaining || 0), 0);
        
        // Get first and last order dates
        const orderDates = customerOrders.map(o => o.date || o.orderDate).filter(Boolean);
        const firstOrder = orderDates.length > 0 ? orderDates[orderDates.length - 1] : 'N/A';
        const lastOrder = orderDates.length > 0 ? orderDates[0] : 'N/A';

        return {
          shopName: customer.shopName || '',
          billingPerson: customer.billingPerson || '',
          mobile: customer.mobile || '',
          location: customer.location || '',
          frequency: customer.frequency || '',
          totalOrders,
          totalBottles,
          totalBilled,
          totalPaid,
          totalPending,
          firstOrder,
          lastOrder
        };
      });

      // Generate CSV
      const headers = [
        'Shop Name',
        'Billing Person',
        'Mobile',
        'Location',
        'Frequency',
        'Total Orders',
        'Total Bottles',
        'Total Billed (₹)',
        'Total Paid (₹)',
        'Pending (₹)',
        'First Order',
        'Last Order'
      ];

      const csvContent = [
        headers.join(','),
        ...reportData.map(row => [
          `"${row.shopName}"`,
          `"${row.billingPerson}"`,
          `"${row.mobile}"`,
          `"${row.location}"`,
          `"${row.frequency}"`,
          row.totalOrders,
          row.totalBottles,
          row.totalBilled,
          row.totalPaid,
          row.totalPending,
          `"${row.firstOrder}"`,
          `"${row.lastOrder}"`
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Foductive_Customer_Report_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* LEFT SIDE – VERTICAL NAVBAR */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-800">
          <h1 className={`font-bold text-teal-400 ${sidebarOpen ? "text-lg" : "text-xs text-center"}`}>
            {sidebarOpen ? "Foductive" : "FD"}
          </h1>
          <p className={`text-xs text-slate-500 ${sidebarOpen ? "block" : "hidden"}`}>
            Aarich Water Bottles
          </p>
        </div>

        <nav className={`p-4 space-y-2 flex-1 ${sidebarOpen ? "" : "flex flex-col items-center"}`}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              } ${sidebarOpen ? "" : "text-center w-full"}`
            }
            title="Dashboard"
          >
            {sidebarOpen ? "📊 Dashboard" : "📊"}
          </NavLink>

          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              } ${sidebarOpen ? "" : "text-center w-full"}`
            }
            title="Customers"
          >
            {sidebarOpen ? "👥 Customers" : "👥"}
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              } ${sidebarOpen ? "" : "text-center w-full"}`
            }
            title="Orders"
          >
            {sidebarOpen ? "📦 Orders" : "📦"}
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              } ${sidebarOpen ? "" : "text-center w-full"}`
            }
            title="Expenses"
          >
            {sidebarOpen ? "💰 Expenses" : "💰"}
          </NavLink>

          <NavLink
            to="/purchase"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              } ${sidebarOpen ? "" : "text-center w-full"}`
            }
            title="Purchase"
          >
            {sidebarOpen ? "🛒 Purchase" : "🛒"}
          </NavLink>

          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              } ${sidebarOpen ? "" : "text-center w-full"}`
            }
            title="Feedback"
          >
            {sidebarOpen ? "⭐ Feedback" : "⭐"}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className={`block w-full px-3 py-2 rounded transition text-center text-slate-400 hover:bg-red-600 hover:text-white`}
            title="Logout"
          >
            {sidebarOpen ? "🚪 Logout" : "🚪"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE – PAGE CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-slate-200 transition"
            title="Toggle Sidebar"
          >
            ☰
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadReport}
              disabled={downloading}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              title="Download Customer Report"
            >
              {downloading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  📥 Download Report
                </>
              )}
            </button>
            <div className="text-slate-400 text-sm">
              {currentUser?.email || 'Welcome to Foductive Solution'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default AdminLayout;
