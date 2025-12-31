import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, currentUser } = useAuth()

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard')
    }
  }, [currentUser, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format')
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password')
      } else {
        setError('Failed to login. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-400 mb-2">
            Foductive
          </h1>
          <p className="text-slate-400">
            Aarich Water Bottles Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Admin Login
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
