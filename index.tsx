import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { SITE_URL, absoluteUrl, allRoutes } from './seo/routes'
import './index.css'

/**
 * scripts/prerender.mjs reads this to learn which URLs to snapshot and to build
 * sitemap.xml. Exposing it here keeps seo/routes.ts the single source of truth:
 * the build script never has to re-declare or parse the route list, and the
 * canonical origin is resolved by the same code the <Seo> tags use.
 */
;(window as unknown as Record<string, unknown>).__SEO_ROUTES__ = {
  siteUrl: SITE_URL,
  routes: allRoutes().map(route => ({ ...route, url: absoluteUrl(route.path) }))
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Could not find root element to mount to')
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
