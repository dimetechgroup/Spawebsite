const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/+$/, '')

const API_BASE_URL =
  configuredBaseUrl || (import.meta.env.DEV ? 'http://localhost:8000/api' : '')

export const isApiConfigured = (): boolean => API_BASE_URL !== ''

/**
 * Runtime overrides returned by GET /config. All fields are optional.
 *
 * `contact_email` used to be here and was applied by Footer.tsx after mount.
 * The address now comes from the CMS at build time, so it is prerendered and
 * visible to crawlers; keeping the runtime override would have let a stale
 * value from this endpoint silently replace the CMS one for visitors only.
 * The backend may still send the field, it is simply no longer read.
 */
export interface AppConfig {
  /** Plan id (see `plans` in data/index.ts) to monthly price. */
  pricing?: Record<string, number>
}

/** Guard for user-initiated submissions, so the UI shows a real message. */
function requireApi (): void {
  if (!isApiConfigured()) {
    throw new Error(
      'This service is not available right now. Please email or call us instead.'
    )
  }
}

export async function submitContact (data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  requireApi()
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed to send message')
  }
  return res.json()
}

export async function submitInquiry (data: {
  name: string
  email: string
  phone: string
  company_name: string
  plan: string
  duration: string
}) {
  requireApi()
  const res = await fetch(`${API_BASE_URL}/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed to send inquiry')
  }
  return res.json()
}

export async function fetchConfig (): Promise<AppConfig | null> {
  if (!isApiConfigured()) return null
  try {
    const res = await fetch(`${API_BASE_URL}/config`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

const NEWSLETTER_URL =
  (import.meta.env.VITE_NEWSLETTER_URL ?? '').trim() ||
  'https://api.myspa.co.ke/newsletter/subscribe'

export async function subscribeNewsletter (data: {
  firstname: string
  email: string
}) {
  const res = await fetch(NEWSLETTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed to subscribe')
  }
  return res.json()
}
