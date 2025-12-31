import React from 'react'

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-teal-400 mb-4">
          Foductive Solution
        </h1>
        <p className="text-2xl text-slate-300 mb-2">
          Aarich Water Bottles
        </p>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Premium water bottle distribution and management system for hotels, cafes, and restaurants
        </p>
        <a
          href="/login"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition"
        >
          Admin Dashboard
        </a>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Customer Management
            </h3>
            <p className="text-slate-400">
              Manage all your customer details including billing information, locations, and customization preferences.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Sales Analytics
            </h3>
            <p className="text-slate-400">
              Track overall sales, daily sales, pending bills, and customer purchase history in real-time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Order Management
            </h3>
            <p className="text-slate-400">
              Create and track orders with different bottle sizes and rates, manage delivery and payments.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Stock Management
            </h3>
            <p className="text-slate-400">
              Monitor inventory levels for 1000ml, 500ml, and 100ml bottles and track sales for each customer.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Expense Tracking
            </h3>
            <p className="text-slate-400">
              Record business expenses including petrol, salaries, maintenance, rent, and miscellaneous costs.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Vendor Purchases
            </h3>
            <p className="text-slate-400">
              Manage purchase orders from vendors with quantity tracking, rates, and payment status.
            </p>
          </div>
        </div>
      </div>

      {/* Bottle Types Section */}
      <div className="bg-slate-900 border-y border-slate-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1000ml */}
            <div className="text-center">
              <div className="text-6xl mb-4">🧴</div>
              <h3 className="text-2xl font-semibold text-teal-400 mb-2">
                1000 ml Bottle
              </h3>
              <p className="text-slate-400">
                Large capacity bottles for high-volume customers
              </p>
            </div>

            {/* 500ml */}
            <div className="text-center">
              <div className="text-6xl mb-4">🍶</div>
              <h3 className="text-2xl font-semibold text-teal-400 mb-2">
                500 ml Bottle
              </h3>
              <p className="text-slate-400">
                Medium capacity for standard use
              </p>
            </div>

            {/* 100ml */}
            <div className="text-center">
              <div className="text-6xl mb-4">🥤</div>
              <h3 className="text-2xl font-semibold text-teal-400 mb-2">
                100 ml Bottle
              </h3>
              <p className="text-slate-400">
                Small convenient size for personal use
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-950 border-t border-slate-800 py-8 px-4 text-center text-slate-400">
        <p>&copy; 2024-2025 Foductive Solution. All rights reserved.</p>
        <p className="mt-2 text-sm">Aarich Water Bottles - Premium Quality</p>
      </div>
    </div>
  )
}

export default Portfolio
