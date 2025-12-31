import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    // Simple validation - replace with actual auth later
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    // Temporary auth check - replace with real authentication
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username)
      navigate('/dashboard')
    } else {
      setError('Invalid username or password')
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
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                placeholder="Enter your username"
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
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition mt-6"
            >
              Login
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-slate-800 rounded border border-slate-700">
            <p className="text-xs text-slate-400 text-center mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-slate-300 text-center">
              Username: <span className="font-mono text-teal-400">admin</span>
            </p>
            <p className="text-xs text-slate-300 text-center">
              Password: <span className="font-mono text-teal-400">admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
