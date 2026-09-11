/**
 * Build-time content fetch.
 *
 * Pulls published articles out of Directus and writes data/generated/articles.json,
 * which data/index.ts imports. The site itself never talks to Directus: by the
 * time `vite build` runs, the content is a plain JSON file in the repo. That
 * keeps SEO intact (seo/routes.ts still derives article routes synchronously at
 * module init, so scripts/prerender.mjs can read window.__SEO_ROUTES__ and the
 * sitemap can never list a page that was not prerendered) and means a visitor's
 * browser has no dependency on the CMS being up.
 *
 * Hero images are downloaded into public/images/articles/, so the live site
 * serves its own images and the Article JSON-LD keeps pointing at myspa.co.ke.
 *
 * The generated JSON and the downloaded images are BOTH committed. That makes
 * the build hermetic: a teammate or CI can build the site with no access to
 * Directus at all. If Directus is unreachable, this script falls back to the
 * committed JSON with a loud warning rather than failing the build.
 *
 * Validation is deliberately strict and fails the build, matching the spirit of
 * scripts/prerender.mjs. A bad CMS edit should break the build rather than
 * quietly ship a broken article.
 *
 * Usage: node scripts/fetch-content.mjs   (runs automatically via `pnpm build`)
 *        --require-cms   fail instead of falling back to the committed JSON
 */
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_FILE = join(ROOT, 'data/generated/articles.json')
const IMAGE_DIR = join(ROOT, 'public/images/articles')
/** Public URL prefix matching IMAGE_DIR, as served from public/. */
const IMAGE_URL_BASE = '/images/articles'

const WPM = 220
const REQUIRE_CMS = process.argv.includes('--require-cms')

/**
 * Minimum characters of article prose (intro, headings, bodies, bullets).
 *
 * scripts/prerender.mjs refuses to snapshot any page rendering under
 * DEFAULT_MIN_TEXT (1000) characters of text, as a guard against capturing a
 * spinner instead of content. An article page's own chrome (category pill, read
 * time, back link, CTA block, the More Insights cards) contributes roughly 460
 * characters on top of the prose, measured on a 311-character test article that
 * rendered at 771.
 *
 * Catching a thin article here rather than there matters operationally: the
 * prerenderer fails 45 seconds into the build with a message aimed at whoever
 * runs the deploy, whereas this fails in seconds and can name the article and
 * say what to do about it. Either way the deploy is correctly blocked, because
 * silently dropping an article someone chose to publish would be worse.
 */
const MIN_ARTICLE_TEXT = 700

const log = (...args) => console.log('[content]', ...args)

// Node reads .env natively; absent file is fine since env vars may come from CI.
try {
  process.loadEnvFile(join(ROOT, '.env'))
} catch {
  /* no .env, rely on the ambient environment */
}

const DIRECTUS_URL = (process.env.DIRECTUS_URL ?? '').trim().replace(/\/+$/, '')
const DIRECTUS_TOKEN = (process.env.DIRECTUS_TOKEN ?? '').trim()

/**
 * The eight static routes, used to check every internal link resolves.
 * seo/routes.ts is the source of truth but imports through Vite's '@/' alias,
 * which plain Node cannot resolve, so the paths are mirrored here and the
 * mirror is asserted against the source file below.
 */
const STATIC_PATHS = [
  '/',
  '/features',
  '/pricing',
  '/faq',
  '/resources',
  '/contact',
  '/about',
  '/404'
]

const assertRouteMirror = async () => {
  const src = await readFile(join(ROOT, 'seo/routes.ts'), 'utf8')
  const declared = [...src.matchAll(/^    path: '([^']+)'/gm)].map(m => m[1])
  const missing = declared.filter(p => !STATIC_PATHS.includes(p))
  if (missing.length) {
    throw new Error(
      `seo/routes.ts declares routes this script does not know about: ` +
        `${missing.join(', ')}. Add them to STATIC_PATHS.`
    )
  }
}

// ── Directus ─────────────────────────────────────────────────────

const FIELDS = [
  'slug',
  'title',
  'intro',
  'author',
  'preview',
  'meta_title',
  'meta_description',
  'date_published',
  'date_modified',
  'read_time_override',
  'category.name',
  'category.color_bg',
  'category.color_text',
  'image.id',
  'image.filename_download',
  'sections.heading',
  'sections.body',
  'sections.bullets',
  'sections.links'
].join(',')

const QUERY =
  `/items/articles?filter[status][_eq]=published&limit=-1` +
  `&fields=${FIELDS}&sort=-date_published&deep[sections][_sort]=sort`

const directus = async path => {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Directus ${res.status} on ${path}: ${body.slice(0, 300)}`)
  }
  return (await res.json()).data
}

// ── Derived fields ───────────────────────────────────────────────

/** 'Aug 17, 2026'. UTC-pinned so the build machine's timezone cannot shift it. */
const formatDate = iso => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

const wordCount = (intro, sections) => {
  const parts = [intro]
  for (const s of sections) {
    if (s.heading) parts.push(s.heading)
    if (s.body) parts.push(s.body)
    if (s.bullets) parts.push(...s.bullets.map(b => b.text))
  }
  return parts.join(' ').trim().split(/\s+/).length
}

// ── Mapping ──────────────────────────────────────────────────────

/** Drops null/undefined so the JSON matches the optional fields on `Article`. */
const compact = obj => {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v
  }
  return out
}

const extensionFor = filename => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext && /^[a-z0-9]{2,5}$/.test(ext) ? ext : 'png'
}

const mapArticle = row => {
  const sections = (row.sections ?? []).map(s =>
    compact({
      heading: s.heading,
      body: s.body,
      bullets: s.bullets?.length ? s.bullets.map(b => b.text) : undefined,
      links: s.links?.length
        ? s.links.map(l => ({ text: l.text, to: l.to }))
        : undefined
    })
  )

  const words = wordCount(row.intro, row.sections ?? [])
  const minutes = row.read_time_override ?? Math.max(1, Math.round(words / WPM))

  return compact({
    slug: row.slug,
    category: row.category?.name,
    title: row.title,
    date: formatDate(row.date_published),
    datePublished: row.date_published,
    dateModified: row.date_modified ?? row.date_published,
    author: row.author,
    readTime: `${minutes} min read`,
    image: `${IMAGE_URL_BASE}/${row.slug}.${extensionFor(row.image.filename_download)}`,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    preview: row.preview,
    intro: row.intro,
    sections
  })
}

// ── Validation ───────────────────────────────────────────────────

const validate = articles => {
  const errors = []
  const warnings = []
  const seen = new Set()

  if (!articles.length) {
    errors.push('no published articles were returned')
  }

  const validPaths = new Set([
    ...STATIC_PATHS,
    ...articles.map(a => `/resources/${a.slug}`)
  ])

  for (const a of articles) {
    const where = a.slug || '(missing slug)'

    if (!a.slug) errors.push('an article has no slug')
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug)) {
      errors.push(`${where}: slug must be lowercase words separated by single dashes`)
    }
    if (seen.has(a.slug)) errors.push(`${where}: duplicate slug`)
    seen.add(a.slug)

    if (!a.title) errors.push(`${where}: no title`)
    if (!a.category) errors.push(`${where}: no category (the relation may be empty)`)
    if (!a.intro) errors.push(`${where}: no intro`)
    if (!a.author) warnings.push(`${where}: no author, Article schema will be incomplete`)
    if (!a.datePublished) errors.push(`${where}: no date_published`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(a.datePublished ?? '')) {
      errors.push(`${where}: date_published is not ISO yyyy-mm-dd`)
    }
    if (a.dateModified < a.datePublished) {
      errors.push(`${where}: date_modified (${a.dateModified}) precedes date_published`)
    }
    if (!a.sections?.length) errors.push(`${where}: no sections, the page would be empty`)

    // Thin articles are blocked here so the failure is fast and legible. See
    // MIN_ARTICLE_TEXT: the prerenderer would reject the page anyway, later and
    // more cryptically, and one thin article blocks every other pending change.
    const prose = [
      a.intro ?? '',
      ...(a.sections ?? []).flatMap(s => [s.heading ?? '', s.body ?? '', ...(s.bullets ?? [])])
    ]
      .join(' ')
      .trim()
    if (a.sections?.length && prose.length < MIN_ARTICLE_TEXT) {
      errors.push(
        `${where}: only ${prose.length} characters of text, at least ` +
          `${MIN_ARTICLE_TEXT} are needed (roughly ${Math.ceil(MIN_ARTICLE_TEXT / 6)} words). ` +
          `Short pages are treated as thin content and the prerenderer refuses ` +
          `to publish them. Expand the article, or set it back to draft.`
      )
    }

    for (const [i, s] of (a.sections ?? []).entries()) {
      if (!s.heading && !s.body && !s.bullets) {
        errors.push(`${where} section ${i + 1}: entirely empty`)
      }
      for (const link of s.links ?? []) {
        // SectionBody splits the body on this exact text; a mismatch silently
        // drops the link, so it has to be an error rather than a warning.
        if (!s.body?.includes(link.text)) {
          errors.push(
            `${where} section ${i + 1}: link text "${link.text}" does not appear ` +
              `in the section body, so it would render as plain text`
          )
        }
        if (!validPaths.has(link.to)) {
          errors.push(
            `${where} section ${i + 1}: link target "${link.to}" is not a route ` +
              `on this site`
          )
        }
      }
    }

    // Soft SEO limits: worth knowing, not worth blocking a deploy.
    const metaTitle = a.metaTitle ?? a.title ?? ''
    if (metaTitle.length > 60) {
      warnings.push(`${where}: title is ${metaTitle.length} chars, Google truncates near 60`)
    }
    const metaDesc = a.metaDescription ?? a.intro ?? ''
    if (metaDesc.length > 165) {
      warnings.push(`${where}: meta description is ${metaDesc.length} chars, aim for 140 to 160`)
    }
    if (!a.metaDescription && (a.intro ?? '').length < 100) {
      warnings.push(`${where}: no meta description and the intro is short`)
    }
  }

  return { errors, warnings }
}

// ── Images ───────────────────────────────────────────────────────

const downloadImages = async rows => {
  await mkdir(IMAGE_DIR, { recursive: true })
  const wanted = new Set()

  for (const row of rows) {
    const name = `${row.slug}.${extensionFor(row.image.filename_download)}`
    wanted.add(name)
    const dest = join(IMAGE_DIR, name)

    const res = await fetch(`${DIRECTUS_URL}/assets/${row.image.id}`, {
      headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
    })
    if (!res.ok) {
      throw new Error(`failed to download hero image for ${row.slug}: HTTP ${res.status}`)
    }
    const bytes = Buffer.from(await res.arrayBuffer())
    if (bytes.length === 0) {
      throw new Error(`hero image for ${row.slug} downloaded as 0 bytes`)
    }

    // Skip the write when unchanged, so a rebuild does not churn git.
    let unchanged = false
    try {
      unchanged = Buffer.compare(await readFile(dest), bytes) === 0
    } catch {
      /* not present yet */
    }
    if (!unchanged) await writeFile(dest, bytes)
    log(
      `image ${name.padEnd(52)} ${(bytes.length / 1024).toFixed(0).padStart(5)} KB` +
        (unchanged ? '  (unchanged)' : '')
    )
  }

  // Remove images belonging to articles that are no longer published, so
  // archiving a post does not leave an orphan file in git forever.
  for (const name of await readdir(IMAGE_DIR)) {
    if (name === '.gitkeep' || wanted.has(name)) continue
    await unlink(join(IMAGE_DIR, name))
    log(`removed orphan image ${name}`)
  }
}

// ── Main ─────────────────────────────────────────────────────────

const fallbackToCommitted = async reason => {
  if (REQUIRE_CMS) {
    console.error(`[content] ${reason}`)
    console.error('[content] --require-cms was passed, so this is fatal.')
    process.exit(1)
  }
  try {
    const cached = JSON.parse(await readFile(OUT_FILE, 'utf8'))
    console.warn('')
    console.warn('[content] ================================================')
    console.warn(`[content] ${reason}`)
    console.warn('[content] Falling back to the committed content:')
    console.warn(`[content]   ${cached.articles.length} articles, generated ${cached.generatedAt}`)
    console.warn('[content] Any newer CMS edits are NOT in this build.')
    console.warn('[content] ================================================')
    console.warn('')
    return
  } catch {
    console.error(`[content] ${reason}`)
    console.error(`[content] and no committed fallback exists at ${OUT_FILE}.`)
    console.error('[content] Start the CMS (cd directus && docker compose up -d) or')
    console.error('[content] set DIRECTUS_URL and DIRECTUS_TOKEN in .env.')
    process.exit(1)
  }
}

const main = async () => {
  await assertRouteMirror()

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return fallbackToCommitted('DIRECTUS_URL or DIRECTUS_TOKEN is not set.')
  }

  let rows
  try {
    rows = await directus(QUERY)
  } catch (err) {
    return fallbackToCommitted(`Could not reach Directus: ${err.message}`)
  }

  log(`fetched ${rows.length} published articles from ${DIRECTUS_URL}`)

  const missingImage = rows.filter(r => !r.image?.id)
  if (missingImage.length) {
    console.error('[content] these published articles have no hero image:')
    missingImage.forEach(r => console.error(`  - ${r.slug}`))
    process.exit(1)
  }

  const articles = rows.map(mapArticle)
  const { errors, warnings } = validate(articles)

  if (warnings.length) {
    console.warn('[content] warnings:')
    warnings.forEach(w => console.warn(`  - ${w}`))
  }

  if (errors.length) {
    console.error('\n[content] FAILED, content did not validate:')
    errors.forEach(e => console.error(`  - ${e}`))
    console.error('\n[content] Nothing was written. Fix the content in Directus and rerun.')
    process.exit(1)
  }

  await downloadImages(rows)

  const categories = await directus(
    '/items/article_categories?fields=name,sort,color_bg,color_text&sort=sort&limit=-1'
  )

  const payload = {
    // Regenerating must not produce a spurious git diff, so no timestamp that
    // changes on every run. This is the newest content date instead.
    generatedAt: articles.reduce(
      (latest, a) => (a.dateModified > latest ? a.dateModified : latest),
      articles[0].dateModified
    ),
    categories: categories.map(c => ({
      name: c.name,
      colorBg: c.color_bg,
      colorText: c.color_text
    })),
    articles
  }

  await mkdir(dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

  const words = articles.reduce(
    (n, a) => n + wordCount(a.intro, a.sections.map(s => ({ ...s, bullets: s.bullets?.map(t => ({ text: t })) }))),
    0
  )
  log(`wrote data/generated/articles.json`)
  log(
    `${articles.length} articles, ${articles.reduce((n, a) => n + a.sections.length, 0)} sections, ` +
      `${words} words, ${payload.categories.length} categories`
  )
}

await main()
