import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import Landing from './pages/landing/Landing'
import Portfolio from './pages/portfolio/Portfolio'
import Login from './pages/Auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Customers from './pages/customers/customers'
import CustomerDetail from './pages/customers/CustomerDetail'
import Orders from './pages/orders/Orders'
import Expenses from './pages/expenses/Expenses'
import Purchase from './pages/purchase/Purchase'
import Feedback from './pages/feedback/Feedback'

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<Landing />} />
      <Route path='/portfolio' element={<Portfolio />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes with Layout */}
      <Route element={<AdminLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/customer/:id' element={<CustomerDetail />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/expenses' element={<Expenses />} />
        <Route path='/purchase' element={<Purchase />} />
        <Route path='/feedback' element={<Feedback />} />
      </Route>
    </Routes>
  )
}

export default App
