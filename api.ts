const BASE_URL = 'http://127.0.0.1:8000/api'

export async function submitContact (data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const res = await fetch(`${BASE_URL}/contact`, {
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
  const res = await fetch(`${BASE_URL}/inquiry`, {
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

export async function fetchConfig () {
  const res = await fetch(`${BASE_URL}/config`)
  if (!res.ok) {
    throw new Error('Failed to fetch config')
  }
  return res.json()
}
