/**
 * Build-time prerenderer.
 *
 * The site is a client-rendered SPA, so crawlers would otherwise receive an
 * empty <div id="root">. After `vite build`, this script serves dist/, drives a
 * real browser over every route, and writes the fully-rendered DOM back to disk
 * as static HTML, one file per URL. It then emits sitemap.xml from the same
 * route list, so the sitemap can never list a page that was not prerendered.
 *
 * Route list comes from window.__SEO_ROUTES__ (see index.tsx), which is built
 * from seo/routes.ts. There is no second copy of the routes to keep in sync.
 *
 * Usage: node scripts/prerender.mjs      (runs automatically via `pnpm build`)
 */
import { createServer } from 'node:http'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sirv from 'sirv'
import puppeteer from 'puppeteer'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

/**
 * Sanity floor for rendered text, per route. A page far below its floor almost
 * certainly captured a spinner or an empty shell instead of real content.
 * Content pages carry prose; /contact is mostly a form and /404 is deliberately
 * terse, so they get their own lower floors rather than weakening the default.
 */
const DEFAULT_MIN_TEXT = 1000
const MIN_TEXT_BY_PATH = {
  '/contact': 400,
  '/404': 150
}
const minTextFor = path => MIN_TEXT_BY_PATH[path] ?? DEFAULT_MIN_TEXT

const NAV_TIMEOUT = 60_000

const log = (...args) => console.log('[prerender]', ...args)

/** Serves dist/ with an SPA fallback so client-side routes resolve. */
const startServer = async () => {
  const handler = sirv(DIST, { dev: true, single: true })
  const server = createServer((req, res) =>
    handler(req, res, () => {
      res.statusCode = 404
      res.end('not found')
    })
  )
  await new Promise((res, rej) => {
    server.once('error', rej)
    server.listen(0, '127.0.0.1', res)
  })
  return { server, origin: `http://127.0.0.1:${server.address().port}` }
}

/**
 * Framer-motion sections start at opacity:0 and only animate in via
 * whileInView. Snapshotting immediately would bake that hidden state into the
 * static HTML, so scroll the whole page first to trigger every animation.
 */
const revealAllSections = async page => {
  await page.evaluate(async () => {
    const step = Math.floor(window.innerHeight * 0.8)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 120))
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise(r => setTimeout(r, 250))
    window.scrollTo(0, 0)
  })
  await new Promise(r => setTimeout(r, 400))
}

/** Where a route's HTML file belongs: '/' -> index.html, '/x' -> x/index.html. */
const outputPathFor = routePath => {
  if (routePath === '/') return join(DIST, 'index.html')
  // /404 becomes dist/404.html so Apache's ErrorDocument can serve it directly.
  if (routePath === '/404') return join(DIST, '404.html')
  return join(DIST, routePath.replace(/^\//, ''), 'index.html')
}

const isIndexable = route => route.inSitemap !== false && !route.noindex

const buildSitemap = routes => {
  const entries = routes.filter(isIndexable).map(route => {
    const lastmod = route.lastmod
      ? `\n    <lastmod>${route.lastmod}</lastmod>`
      : ''
    return [
      '  <url>',
      `    <loc>${route.url}</loc>${lastmod}`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority.toFixed(1)}</priority>`,
      '  </url>'
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    ''
  ].join('\n')
}

const main = async () => {
  const { server, origin } = await startServer()
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  })

  const failures = []

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    page.setDefaultNavigationTimeout(NAV_TIMEOUT)

    // Boot once to read the authoritative route list off the app itself.
    await page.goto(`${origin}/`, { waitUntil: 'networkidle2' })
    const manifest = await page.evaluate(() => window.__SEO_ROUTES__)
    const routes = manifest?.routes

    if (!Array.isArray(routes) || routes.length === 0) {
      throw new Error(
        'window.__SEO_ROUTES__ was empty. Is it still assigned in index.tsx?'
      )
    }
    log(`${routes.length} routes to render, canonical origin ${manifest.siteUrl}`)

    for (const route of routes) {
      const url = `${origin}${route.path}`
      await page.goto(url, { waitUntil: 'networkidle2' })

      // Confirm the lazy route chunk actually mounted before snapshotting.
      try {
        await page.waitForSelector('h1', { timeout: 15_000 })
      } catch {
        failures.push(`${route.path}: no <h1> rendered`)
        continue
      }

      await revealAllSections(page)

      const { html, textLength, title, sawSpinner } = await page.evaluate(
        () => {
          const main = document.querySelector('main')
          const text = main?.innerText ?? ''
          return {
            html: document.documentElement.outerHTML,
            textLength: text.length,
            title: document.title,
            // The Suspense fallback in App.tsx. If it is still on screen the
            // lazy chunk never resolved and we would snapshot a spinner.
            sawSpinner: text.includes('Loading...')
          }
        }
      )

      if (sawSpinner) {
        failures.push(`${route.path}: captured the Suspense spinner`)
        continue
      }

      const floor = minTextFor(route.path)
      if (textLength < floor) {
        failures.push(
          `${route.path}: only ${textLength} chars of text (expected >= ${floor})`
        )
        continue
      }

      const outPath = outputPathFor(route.path)
      await mkdir(dirname(outPath), { recursive: true })
      await writeFile(outPath, `<!DOCTYPE html>\n${html}\n`, 'utf8')

      log(
        `${route.path.padEnd(52)} ${String(textLength).padStart(6)} chars  "${title}"`
      )
    }

    await writeFile(join(DIST, 'sitemap.xml'), buildSitemap(routes), 'utf8')
    log(`sitemap.xml written (${routes.filter(isIndexable).length} urls)`)
  } finally {
    await browser.close()
    server.close()
  }

  if (failures.length) {
    console.error('\n[prerender] FAILED: these routes did not render:')
    failures.forEach(f => console.error(`  - ${f}`))
    process.exit(1)
  }

  log('all routes prerendered')
}

await main()
