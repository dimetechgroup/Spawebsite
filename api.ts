/**
 * The site's two forms. Neither needs a backend of our own beyond one PHP file:
 *
 * - Contact posts to /api/contact, public/api/contact.php on the same host, which
 *   emails the message to the sales inbox.
 * - Newsletter signups go straight from the browser to HubSpot.
 */

/**
 * HubSpot form that collects newsletter signups. Both IDs are public (they appear
 * in every embedded HubSpot form) and this endpoint needs no token. HubSpot
 * allows browser calls from myspa.co.ke, so no server of ours is involved.
 */
const HUBSPOT_PORTAL_ID = '148419234'
const HUBSPOT_NEWSLETTER_FORM_ID = '976c43ef-def8-4e2c-9903-5915a936f952'
const NEWSLETTER_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_NEWSLETTER_FORM_ID}`

/** POSTs JSON and returns the JSON reply, throwing a readable error on failure. */
async function postJson (url: string, body: unknown, fallbackError: string) {
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    })
  } catch {
    // Offline, DNS failure, blocked request: the browser's own message is not
    // something to show a visitor.
    throw new Error(fallbackError)
  }
  // Both endpoints answer errors with JSON carrying a `message`, but an outage
  // or a misconfigured server can answer with HTML, so a parse failure must not
  // replace the real error.
  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(payload?.message || fallbackError)
  }
  return payload
}

export async function submitContact (data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  /** Honeypot: hidden from people, so anything in it marks a bot. */
  website: string
}) {
  return postJson(
    '/api/contact',
    data,
    'We could not send your message. Please try again, or email us directly.'
  )
}

export async function subscribeNewsletter (data: {
  firstname: string
  email: string
}) {
  return postJson(
    NEWSLETTER_URL,
    {
      fields: [
        { name: 'firstname', value: data.firstname },
        { name: 'email', value: data.email }
      ],
      // Lets HubSpot record which page the signup came from.
      context: { pageUri: window.location.href, pageName: document.title }
    },
    'Failed to subscribe'
  )
}
