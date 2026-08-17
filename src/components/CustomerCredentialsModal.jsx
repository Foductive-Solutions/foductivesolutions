import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { setCustomerCredentials, revokeCustomerCredentials } from '../firebase/services'
import { hashPassword, suggestUsername, generatePassword } from '../utils/customerAuth'

const CustomerCredentialsModal = ({ customer, onClose, onSaved }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (customer) {
      setUsername(customer.loginUsername || suggestUsername(customer.shopName))
      setPassword('')
      setError('')
    }
  }, [customer])

  const hasAccess = Boolean(customer?.loginUsername)

  const handleGeneratePassword = () => setPassword(generatePassword())

  const handleSave = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Enter a username and password.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const passwordHash = await hashPassword(password)
      await setCustomerCredentials(customer.id, { username: username.trim(), passwordHash })
      onSaved()
    } catch (err) {
      console.error('Error saving customer credentials:', err)
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleRevoke = async () => {
    setSaving(true)
    try {
      await revokeCustomerCredentials(customer.id)
      onSaved()
    } catch (err) {
      console.error('Error revoking customer credentials:', err)
      setError('Failed to revoke access. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={customer !== null} onClose={onClose} title="Customer Portal Access">
      {customer && (
        <form onSubmit={handleSave} className="space-y-4">
          <p className="text-sm text-slate-400">
            Set the username and password this customer uses to sign in at{' '}
            <span className="text-teal-400">/client/login</span> to place orders and view their history.
            Only you can set or change these.
          </p>

          {hasAccess && (
            <p className="rounded-lg border border-emerald-800 bg-emerald-950/50 px-3 py-2 text-sm text-emerald-300">
              Portal access is active for username <strong>{customer.loginUsername}</strong>.
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-300">{error}</p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none focus:border-teal-500"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              {hasAccess ? 'New Password' : 'Password'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={hasAccess ? 'Set a new password' : 'Set a password'}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none focus:border-teal-500"
                disabled={saving}
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                disabled={saving}
                className="shrink-0 rounded-lg border border-slate-700 px-3 text-sm text-slate-300 hover:border-teal-500"
              >
                Generate
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">Share this password with the customer directly — it isn&apos;t stored in readable form.</p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {hasAccess ? (
              <button
                type="button"
                onClick={handleRevoke}
                disabled={saving}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Revoke Access
              </button>
            ) : <span />}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-slate-300">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {saving ? 'Saving…' : hasAccess ? 'Update Access' : 'Grant Access'}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default CustomerCredentialsModal
