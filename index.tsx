import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { SITE_URL, absoluteUrl, allRoutes } from './seo/routes'
import { loadArticles } from './cms/content'
import './index.css'

/**
 * scripts/prerender.mjs reads this to learn which URLs to snapshot and to build
 * sitemap.xml. Exposing it here keeps seo/routes.ts the single source of truth:
 * the build script never has to re-declare or parse the route list, and the
 * canonical origin is resolved by the same code the <Seo> tags use.
 *
 * Article routes come from the CMS, so the list is published once they have
 * loaded. If the CMS is unreachable it is published without them, and the
 * prerender reports the missing articles rather than hanging.
 *
 * Only the prerender's automated browser (navigator.webdriver) needs this, so
 * visitors are spared downloading every article on every page.
 */
const publishRoutes = (articles: Parameters<typeof allRoutes>[0], cmsError?: string) => {
  ;(window as unknown as Record<string, unknown>).__SEO_ROUTES__ = {
    siteUrl: SITE_URL,
    routes: allRoutes(articles).map(route => ({ ...route, url: absoluteUrl(route.path) })),
    cmsError
  }
}
if (navigator.webdriver) {
  loadArticles()
    .then(content => publishRoutes(content.articles))
    .catch((err: unknown) => publishRoutes([], err instanceof Error ? err.message : String(err)))
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
