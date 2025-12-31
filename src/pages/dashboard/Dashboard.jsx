import React from "react";

const Dashboard = () => {
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
          value="₹ 4,85,000"
          subtitle="Total till date"
          color="teal"
        />
        <StatCard
          title="Today's Sales"
          value="₹ 12,500"
          subtitle="Today"
          color="green"
        />
        <StatCard
          title="Bill to Receive (Today)"
          value="₹ 6,200"
          subtitle="Pending today"
          color="yellow"
        />
        <StatCard
          title="Total Pending Bill"
          value="₹ 78,300"
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
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <RecentOrderRow
                  id="ORD-1023"
                  customer="Hotel Sai Palace"
                  date="05 Feb 2026"
                  amount="₹ 3,200"
                />
                <RecentOrderRow
                  id="ORD-1022"
                  customer="Green Leaf Cafe"
                  date="05 Feb 2026"
                  amount="₹ 1,850"
                />
                <RecentOrderRow
                  id="ORD-1021"
                  customer="Royal Mess"
                  date="04 Feb 2026"
                  amount="₹ 2,100"
                />
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
              value="1,250"
              status="ok"
            />
            <StockRow
              label="500 ml Bottles"
              value="420"
              status="warning"
            />
            <StockRow
              label="100 ml Bottles"
              value="90"
              status="danger"
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
            12
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Customers with orders this month
          </p>
        </div>

        {/* Pending Payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Pending Payments</p>
          <h3 className="text-2xl font-semibold text-red-400 mt-1">
            8
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Outstanding bills from customers
          </p>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Monthly Expenses</p>
          <h3 className="text-2xl font-semibold text-orange-400 mt-1">
            ₹ 62,000
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Total expenses for February
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

const RecentOrderRow = ({ id, customer, date, amount }) => {
  return (
    <tr className="hover:bg-slate-800 transition">
      <td className="px-4 py-2 text-teal-400 font-medium">{id}</td>
      <td className="px-4 py-2 text-slate-300">{customer}</td>
      <td className="px-4 py-2 text-slate-400">{date}</td>
      <td className="px-4 py-2 text-right font-medium text-yellow-400">
        {amount}
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
