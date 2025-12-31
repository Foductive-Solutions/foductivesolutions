import React, { useState, useEffect } from "react";
import { getCustomers, getOrders, getExpenses, getPurchases, getFeedback } from "../../firebase/services";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overallSales: 0,
    todaysSales: 0,
    todaysPending: 0,
    totalPending: 0,
    activeCustomers: 0,
    pendingPayments: 0,
    monthlyExpenses: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [stockOverview, setStockOverview] = useState({
    bottles1000ml: 0,
    bottles500ml: 0,
    bottles100ml: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [customers, orders, expenses, purchases] = await Promise.all([
        getCustomers(),
        getOrders(),
        getExpenses(),
        getPurchases()
      ]);

      // Calculate today's date
      const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Calculate overall sales (sum of all order billing amounts)
      const overallSales = orders.reduce((sum, order) => sum + (order.totalBill || order.billingAmount || 0), 0);

      // Today's sales
      const todaysSales = orders
        .filter(order => order.date === today || order.orderDate === today)
        .reduce((sum, order) => sum + (order.totalBill || order.billingAmount || 0), 0);

      // Today's pending
      const todaysPending = orders
        .filter(order => order.date === today || order.orderDate === today)
        .reduce((sum, order) => sum + (order.remaining || 0), 0);

      // Total pending bills
      const totalPending = orders.reduce((sum, order) => sum + (order.remaining || 0), 0);

      // Active customers (customers with orders)
      const activeCustomers = customers.length;

      // Pending payments (orders with remaining balance)
      const pendingPayments = orders.filter(order => (order.remaining || 0) > 0).length;

      // Current month expenses
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyExpenses = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        })
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);

      // Calculate stock from purchases
      const totalPurchased = {
        bottles1000ml: purchases.reduce((sum, p) => sum + (p.qty1000ml || 0), 0),
        bottles500ml: purchases.reduce((sum, p) => sum + (p.qty500ml || 0), 0),
        bottles100ml: purchases.reduce((sum, p) => sum + (p.qty100ml || 0), 0)
      };

      // Sold from orders
      const totalSold = {
        bottles1000ml: orders.reduce((sum, o) => sum + (o.qty1000ml || 0), 0),
        bottles500ml: orders.reduce((sum, o) => sum + (o.qty500ml || 0), 0),
        bottles100ml: orders.reduce((sum, o) => sum + (o.qty100ml || 0), 0)
      };

      setStats({
        overallSales,
        todaysSales,
        todaysPending,
        totalPending,
        activeCustomers,
        pendingPayments,
        monthlyExpenses
      });

      // Get 5 most recent orders
      const sortedOrders = [...orders].sort((a, b) => {
        // Simple date comparison (for display purposes)
        return -1; // Keep original order (newest first from Firebase)
      }).slice(0, 5);
      setRecentOrders(sortedOrders);

      setStockOverview({
        bottles1000ml: totalPurchased.bottles1000ml - totalSold.bottles1000ml,
        bottles500ml: totalPurchased.bottles500ml - totalSold.bottles500ml,
        bottles100ml: totalPurchased.bottles100ml - totalSold.bottles100ml
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (value) => {
    if (value > 500) return "ok";
    if (value > 100) return "warning";
    return "danger";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-teal-400 text-lg">Loading dashboard...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6 text-slate-200">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Business overview and daily summary
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Sales"
          value={formatCurrency(stats.overallSales)}
          subtitle="Total till date"
          color="teal"
        />
        <StatCard
          title="Today's Sales"
          value={formatCurrency(stats.todaysSales)}
          subtitle="Today"
          color="green"
        />
        <StatCard
          title="Bill to Receive (Today)"
          value={formatCurrency(stats.todaysPending)}
          subtitle="Pending today"
          color="yellow"
        />
        <StatCard
          title="Total Pending Bill"
          value={formatCurrency(stats.totalPending)}
          subtitle="Overall pending"
          color="red"
        />
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="px-4 py-3 border-b border-slate-800">
            <h2 className="text-lg font-medium text-white">
              Recent Orders
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-slate-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <RecentOrderRow
                      key={order.id}
                      customer={order.customer || order.shopName}
                      date={order.date || order.orderDate}
                      amount={formatCurrency(order.totalBill || order.billingAmount || 0)}
                      status={order.status}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="px-4 py-3 border-b border-slate-800">
            <h2 className="text-lg font-medium text-white">
              Stock Overview
            </h2>
          </div>

          <div className="p-4 space-y-4">
            <StockRow
              label="1000 ml Bottles"
              value={stockOverview.bottles1000ml.toLocaleString('en-IN')}
              status={getStockStatus(stockOverview.bottles1000ml)}
            />
            <StockRow
              label="500 ml Bottles"
              value={stockOverview.bottles500ml.toLocaleString('en-IN')}
              status={getStockStatus(stockOverview.bottles500ml)}
            />
            <StockRow
              label="100 ml Bottles"
              value={stockOverview.bottles100ml.toLocaleString('en-IN')}
              status={getStockStatus(stockOverview.bottles100ml)}
            />
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Customers */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Active Customers</p>
          <h3 className="text-2xl font-semibold text-teal-400 mt-1">
            {stats.activeCustomers}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Total registered customers
          </p>
        </div>

        {/* Pending Payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Pending Payments</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            {stats.pendingPayments}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Outstanding bills from customers
          </p>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Monthly Expenses</p>
          <h3 className="text-2xl font-semibold text-orange-400 mt-1">
            {formatCurrency(stats.monthlyExpenses)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Total expenses this month
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------ Reusable Components ------------------ */

const StatCard = ({ title, value, subtitle, color = "teal" }) => {
  const colorClass = {
    teal: "border-teal-800 bg-teal-950",
    green: "border-green-800 bg-green-950",
    yellow: "border-yellow-800 bg-yellow-950",
    red: "border-red-800 bg-red-950"
  }[color];

  const textColor = {
    teal: "text-teal-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400"
  }[color];

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg p-4 ${colorClass}`}>
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className={`text-2xl font-semibold text-white mt-1 ${textColor}`}>
        {value}
      </h3>
      <p className="text-xs text-slate-500 mt-1">
        {subtitle}
      </p>
    </div>
  );
};

const RecentOrderRow = ({ customer, date, amount, status }) => {
  const statusColor = status === "Paid" ? "text-green-400" : "text-yellow-400";
  return (
    <tr className="hover:bg-slate-800 transition">
      <td className="px-4 py-2 text-slate-300">{customer}</td>
      <td className="px-4 py-2 text-slate-400">{date}</td>
      <td className="px-4 py-2 text-right font-medium text-yellow-400">
        {amount}
      </td>
      <td className={`px-4 py-2 text-right font-medium ${statusColor}`}>
        {status}
      </td>
    </tr>
  );
};

const StockRow = ({ label, value, status }) => {
  const statusColor =
    status === "ok"
      ? "text-green-400"
      : status === "warning"
      ? "text-yellow-400"
      : "text-red-400";

  const statusBg =
    status === "ok"
      ? "bg-green-900"
      : status === "warning"
      ? "bg-yellow-900"
      : "bg-red-900";

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${statusBg}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className={`text-sm font-semibold ${statusColor}`}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
