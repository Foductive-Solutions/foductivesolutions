import React, { createContext, useContext, useEffect, useState } from 'react'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '../firebase/config'
import { findCustomerByUsername, getCustomerById } from '../firebase/services'
import { hashPassword } from '../utils/customerAuth'

const SESSION_KEY = 'aarich_client_session'

const CustomerAuthContext = createContext()

export const useCustomerAuth = () => useContext(CustomerAuthContext)

// Firestore rules on this project require a signed-in request, so the portal
// signs in anonymously first — the actual identity check is the username/password
// match against the customer record below, done entirely client-side.
const ensureAnonymousSession = async () => {
  if (auth.currentUser) return
  try {
    await signInAnonymously(auth)
  } catch (error) {
    // Anonymous sign-in must be turned on in Firebase Console > Authentication >
    // Sign-in method for the portal to work at all — surface that distinctly so it
    // isn't mistaken for a wrong username/password.
    if (error.code === 'auth/admin-restricted-operation' || error.code === 'auth/operation-not-allowed') {
      const configError = new Error('The customer portal is not fully set up yet. Please contact us.')
      configError.code = 'portal-not-configured'
      throw configError
    }
    throw error
  }
}

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restore = async () => {
      const savedId = localStorage.getItem(SESSION_KEY)
      if (!savedId) {
        setLoading(false)
        return
      }
      try {
        await ensureAnonymousSession()
        const record = await getCustomerById(savedId)
        if (record && record.loginUsername) {
          setCustomer(record)
        } else {
          localStorage.removeItem(SESSION_KEY)
        }
      } catch (error) {
        console.error('Error restoring customer session:', error)
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  const login = async (username, password) => {
    await ensureAnonymousSession()
    const record = await findCustomerByUsername(username.trim())
    if (!record || !record.loginPasswordHash) {
      throw new Error('Invalid username or password')
    }
    const hash = await hashPassword(password)
    if (hash !== record.loginPasswordHash) {
      throw new Error('Invalid username or password')
    }
    localStorage.setItem(SESSION_KEY, record.id)
    setCustomer(record)
    return record
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setCustomer(null)
  }

  const refreshCustomer = async () => {
    if (!customer) return
    const record = await getCustomerById(customer.id)
    if (record) setCustomer(record)
  }

  const value = { customer, loading, login, logout, refreshCustomer }

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

export default CustomerAuthContext
