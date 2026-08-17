import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useCustomerAuth } from '../context/CustomerAuthContext'

const ClientProtectedRoute = () => {
  const { customer, loading } = useCustomerAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-cyan-300">
        Loading…
      </div>
    )
  }

  return customer ? <Outlet /> : <Navigate to="/client/login" replace />
}

export default ClientProtectedRoute
