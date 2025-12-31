import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition text-center ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
            title="Logout"
          >
            {sidebarOpen ? "🚪 Logout" : "🚪"}
          </NavLink>
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
          <div className="text-slate-400 text-sm">
            Welcome to Foductive Solution
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
