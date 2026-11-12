import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { SITE_URL, absoluteUrl, allRoutes } from './seo/routes'
import { loadArticles } from './cms/content'
import { cmsSnapshot, seedCms } from './cms/hooks'
import { initClarity } from './analytics/clarity'
import './index.css'

initClarity()

/**
 * Set by scripts/prerender.mjs in the browser it drives. navigator.webdriver is
 * no test for that: it is also true for Lighthouse and other automated visits,
 * which must get the page exactly as people do.
 */
const prerendering = (window as unknown as Record<string, unknown>).__PRERENDERING__ === true

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
 * Only the prerender needs this, so visitors are spared downloading every
 * article on every page.
 */
const publishRoutes = (articles: Parameters<typeof allRoutes>[0], cmsError?: string) => {
  ;(window as unknown as Record<string, unknown>).__SEO_ROUTES__ = {
    siteUrl: SITE_URL,
    routes: allRoutes(articles).map(route => ({ ...route, url: absoluteUrl(route.path) })),
    cmsError
  }
}
if (prerendering) {
  loadArticles()
    .then(content => publishRoutes(content.articles))
    .catch((err: unknown) => publishRoutes([], err instanceof Error ? err.message : String(err)))
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Could not find root element to mount to')
}

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

if (prerendering) {
  // The prerender renders live so it can wait for content, then saves the HTML
  // React produces for the same tree. A snapshot of the live DOM would not do:
  // it lacks the markers hydrateRoot needs and carries whatever effects changed.
  ReactDOM.createRoot(rootElement).render(app)
  ;(window as unknown as Record<string, unknown>).__PRERENDER__ = async () => {
    const { renderToString } = await import('react-dom/server')
    const html = renderToString(app)
    return { html, cms: cmsSnapshot() }
  }
} else {
  // Prerendered pages (scripts/prerender.mjs) carry the CMS responses they were
  // built from. Starting from those, the first render matches the HTML already
  // on screen, so React adopts it instead of replacing it. The dev server's
  // empty shell has nothing to adopt.
  const snapshot = document.getElementById('cms-snapshot')?.textContent
  if (snapshot) seedCms(JSON.parse(snapshot))
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootElement, app)
  } else {
    ReactDOM.createRoot(rootElement).render(app)
  }
}
