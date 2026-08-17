// Lightweight credential helpers for the customer portal login.
// Passwords are never stored in plain text — only a SHA-256 hex digest.

export const hashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Suggest a username from the shop name (admin can still edit it).
export const suggestUsername = (shopName = '') =>
  shopName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 16) || 'customer'

// Generates a short, easy-to-read random password (no ambiguous characters).
export const generatePassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}
