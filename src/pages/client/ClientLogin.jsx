import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomerAuth } from '../../context/CustomerAuthContext'

const IconEye = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconEyeOff = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.6A10.7 10.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.4 4.2M6.7 6.7C4 8.4 2.5 12 2.5 12S6 18.5 12 18.5a9.7 9.7 0 0 0 3.9-.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
)

const ClientLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { customer, login } = useCustomerAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (customer) navigate('/client', { replace: true })
  }, [customer, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Enter your username and password.')
      return
    }
    try {
      setLoading(true)
      await login(username, password)
      navigate('/client', { replace: true })
    } catch (err) {
      console.error('Client login error:', err)
      setError(
        err.code === 'portal-not-configured'
          ? err.message
          : 'Invalid username or password. Contact us if you need your login details.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900/90 border border-white/10 p-2 shadow-2xl">
            <img src="/aarich_logo_mark.png" alt="AARICH" className="h-14 w-14 object-contain" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">AARICH</h1>
          <p className="mt-1.5 text-sm text-slate-400">Customer Portal — Order water supply & download receipts</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
        >
          {error && (
            <div className="rounded-xl border border-red-800/80 bg-red-950/70 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Username / Phone
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="Enter your customer username"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-800/90 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-800/90 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-white"
              >
                {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-teal-500 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In to Portal'}
          </button>

          <p className="text-center text-xs text-slate-500 pt-1">
            Need customer portal login credentials? Contact AARICH administration.
          </p>
        </form>

        <a href="/portfolio" className="mt-6 block text-center text-xs font-semibold text-slate-500 hover:text-cyan-400 transition">
          ← Back to Main Website
        </a>
      </div>
    </div>
  )
}

export default ClientLogin
