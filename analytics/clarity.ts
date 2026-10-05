/**
 * Microsoft Clarity (session recordings and heatmaps).
 *
 * Loaded from the bundle rather than index.html because scripts/prerender.mjs
 * snapshots each page's live DOM: a tag in index.html would run in the
 * prerender browser, inject its <script src> into every saved page, and then
 * load twice for real visitors. The prerender browser (navigator.webdriver) and
 * local dev are skipped so neither records fake sessions.
 *
 * Set VITE_CLARITY_ID to an empty string to switch it off.
 */
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID ?? 'ysuyh7vwtx'

type ClarityQueue = ((...args: unknown[]) => void) & { q?: unknown[][] }

export const initClarity = () => {
  if (!CLARITY_ID || !import.meta.env.PROD || navigator.webdriver) return

  const w = window as unknown as { clarity?: ClarityQueue }
  // Queue calls made before the tag finishes loading, as Clarity's own snippet does
  w.clarity =
    w.clarity ||
    function (...args: unknown[]) {
      ;(w.clarity!.q = w.clarity!.q || []).push(args)
    }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
  document.head.appendChild(script)
}
