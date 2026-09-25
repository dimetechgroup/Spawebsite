/**
 * Build-time content fetch.
 *
 * Pulls editable content out of Directus and writes one file per collection
 * into data/generated/, which data/index.ts imports. The site itself never
 * talks to Directus: by the time `vite build` runs, the content is plain JSON
 * in the repo. That keeps SEO intact (seo/routes.ts still derives article
 * routes synchronously at module init, so scripts/prerender.mjs can read
 * window.__SEO_ROUTES__ and the sitemap can never list a page that was not
 * prerendered) and means a visitor's browser has no dependency on the CMS.
 *
 * What is in the CMS, and what is deliberately not:
 *
 *   articles             long-form posts at /resources/:slug
 *   home_hero_image      the product screenshot in the home page hero
 *   modules_image        the photo and badge in the home page modules section
 *   testimonials         the home page quote carousel
 *   modules_marquee      the scrolling capability strip under the feature grid
 *   features_hero_image  the screenshot at the top of /features
 *   demo_video           the demo, shared by /features and the home hero pop-up
 *   anchor_features      the module cards on /features
 *   faq_categories       the coloured pills on /faq
 *   faqs                 the questions on /faq, and their FAQPage JSON-LD
 *   contact_details      the sales phone and email, used in three places
 *
 * Icons stay hardcoded. A Lucide icon is a live component reference, not data.
 * So are colours: a Tailwind class name loaded from a database is never
 * compiled, because Tailwind generates CSS by scanning source files at build
 * time, so a class that exists only in Postgres silently produces no styling at
 * all. Accents, gradients and theme tokens therefore live in the components.
 *
 * anchor_features is the one collection that carries both. Its editable half
 * lives in Directus and joins to the `anchorFeatureStyles` map in data/index.ts
 * on an immutable `key`, and a published card whose key is missing from that
 * map fails the build rather than rendering blank.
 *
 * Images are downloaded into public/images/, so the live site serves its own
 * copies and the Article JSON-LD keeps pointing at myspa.co.ke.
 *
 * The generated JSON and the downloaded images are BOTH committed. That makes
 * the build hermetic: a teammate or CI can build the site with no access to
 * Directus at all. If Directus is unreachable, this script falls back to the
 * committed files with a loud warning rather than failing the build.
 *
 * The demo video is the single exception: at roughly 100 MB it is downloaded
 * into public/video/ and gitignored, because every version would otherwise sit
 * in git history forever. A build with no CMS access renders an empty player.
 *
 * Validation is deliberately strict and fails the build, matching the spirit of
 * scripts/prerender.mjs. A bad CMS edit should break the build rather than
 * quietly ship a broken page.
 *
 * Usage: node scripts/fetch-content.mjs   (runs automatically via `pnpm build`)
 *        --require-cms   fail instead of falling back to the committed JSON
 */
import {
  mkdir,
  readFile,
  readdir,
  stat,
  unlink,
  utimes,
  writeFile
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'data/generated')

/**
 * One generated file per collection, rather than one blob for the whole home
 * page. An edit to a testimonial then produces a diff that touches only
 * testimonials.json, and a collection can be added or dropped without
 * rewriting a file that other collections share.
 */
const OUT_FILES = {
  articles: join(OUT_DIR, 'articles.json'),
  homeHeroImage: join(OUT_DIR, 'home-hero-image.json'),
  modulesImage: join(OUT_DIR, 'modules-image.json'),
  testimonials: join(OUT_DIR, 'testimonials.json'),
  modulesMarquee: join(OUT_DIR, 'modules-marquee.json'),
  featuresHeroImage: join(OUT_DIR, 'features-hero-image.json'),
  demoVideo: join(OUT_DIR, 'demo-video.json'),
  anchorFeatures: join(OUT_DIR, 'anchor-features.json'),
  faqs: join(OUT_DIR, 'faqs.json'),
  contactDetails: join(OUT_DIR, 'contact-details.json')
}

const IMAGE_DIR = join(ROOT, 'public/images/articles')
/** Public URL prefix matching IMAGE_DIR, as served from public/. */
const IMAGE_URL_BASE = '/images/articles'

/** Everything that is CMS-managed but not an article hero. */
const CMS_IMAGE_DIR = join(ROOT, 'public/images/cms')
const CMS_IMAGE_URL_BASE = '/images/cms'

/**
 * The demo video, which is the one CMS asset deliberately NOT committed: at
 * roughly 100 MB, every version would sit in git history permanently and could
 * only be removed by rewriting it. This directory is gitignored and rebuilt on
 * whichever machine runs the build, so the repository stays the size it is.
 *
 * The trade-off: a build with no CMS access renders the player with no source.
 * That degrades to a blank frame rather than a build failure, which is why the
 * video is the right asset to make this exception for.
 */
const VIDEO_DIR = join(ROOT, 'public/video')
const VIDEO_URL_BASE = '/video'
const VIDEO_NAME = 'demo-video'

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

/**
 * Alt text shorter than this is almost always a placeholder like "image" or
 * "logo". Every image on this site is CMS-managed now, and the whole point of
 * the prerender pipeline is that crawlers see real markup, so an empty or
 * useless alt attribute is a content bug worth blocking.
 */
const MIN_ALT_TEXT = 10

/**
 * The quote card is sized for a paragraph. Much less and the card looks broken;
 * much more and it overflows on a phone, which is a warning rather than an
 * error because only the author can judge whether the quote is worth the space.
 */
const MIN_TESTIMONIAL_TEXT = 80
const MAX_TESTIMONIAL_TEXT = 320

/**
 * Features.tsx animates the strip from 0% to -50% across a list it doubles, so
 * the loop is seamless only if the labels fill more than half the viewport.
 * Below four the strip visibly stutters with a gap of empty space.
 */
const MIN_MARQUEE_ITEMS = 4
/** Rendered uppercase with 0.18em tracking, so long labels blow out the row. */
const MAX_MARQUEE_LABEL = 30

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

/**
 * The module card keys the code knows how to style, read straight out of the
 * `anchorFeatureStyles` map in data/index.ts.
 *
 * Read rather than mirrored, because a mirror of a list this small would drift
 * silently. If the parse ever finds nothing, that is thrown rather than treated
 * as "no keys", so a refactor of that object fails the build loudly instead of
 * quietly validating nothing.
 */
const readAnchorFeatureKeys = async () => {
  const src = await readFile(join(ROOT, 'data/index.ts'), 'utf8')
  const block = src.match(/const anchorFeatureStyles[\s\S]*?\n\}/)
  if (!block) {
    throw new Error(
      'could not find the anchorFeatureStyles map in data/index.ts. If it was ' +
        'renamed or reformatted, update readAnchorFeatureKeys to match.'
    )
  }
  const keys = [...block[0].matchAll(/^\s*'?([a-z0-9-]+)'?:\s*\{\s*icon:/gm)].map(m => m[1])
  if (!keys.length) {
    throw new Error(
      'the anchorFeatureStyles map in data/index.ts parsed to zero keys, so ' +
        'every CMS card would fail validation. Update readAnchorFeatureKeys.'
    )
  }
  return new Set(keys)
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

const IMAGE_FIELDS = 'image.id,image.filename_download'

const HOME_HERO_IMAGE_QUERY = `/items/home_hero_image?fields=alt,${IMAGE_FIELDS}`

const MODULES_IMAGE_QUERY = `/items/modules_image?fields=alt,badge,${IMAGE_FIELDS}`

const TESTIMONIALS_QUERY =
  `/items/testimonials?filter[status][_eq]=published&limit=-1&sort=sort` +
  `&fields=name,role,location,content,stat_value,stat_label,${IMAGE_FIELDS}`

const MODULES_MARQUEE_QUERY =
  `/items/modules_marquee?filter[status][_eq]=published&limit=-1&sort=sort&fields=label`

const FEATURES_HERO_IMAGE_QUERY = `/items/features_hero_image?fields=alt,${IMAGE_FIELDS}`

// filesize and modified_on are what let downloadVideo skip an unchanged
// hundred-megabyte transfer without trusting anything it cannot verify on disk.
const DEMO_VIDEO_QUERY =
  `/items/demo_video?fields=poster_alt,video.id,video.filename_download,` +
  `video.filesize,video.modified_on,video.uploaded_on,` +
  `poster.id,poster.filename_download`

const ANCHOR_FEATURES_QUERY =
  `/items/anchor_features?filter[status][_eq]=published&limit=-1&sort=sort` +
  `&fields=key,name,description,image_alt,hidden,${IMAGE_FIELDS}`

const CONTACT_DETAILS_QUERY = `/items/contact_details?fields=sales_phone,sales_email`

const FAQS_QUERY =
  `/items/faqs?filter[status][_eq]=published&limit=-1&sort=sort` +
  `&fields=question,answer,youtube_url,category.name,category.color_bg,` +
  `category.color_text,category.color_border`

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

/**
 * Testimonials carry no slug field, because asking an editor to invent one for
 * a headshot would be busywork. The filename is derived from the person's name
 * instead; renaming them renames the file and the old one is pruned as an
 * orphan. Uniqueness is asserted in validateTestimonials, since two people
 * whose names slugify identically would otherwise overwrite each other.
 */
const slugify = value =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

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

/**
 * Stable filenames for the two singleton images. They do not come from the CMS,
 * so swapping the image in Directus changes the file's bytes but not its path,
 * and no HTML has to change for the new image to appear.
 */
const HERO_IMAGE_NAME = 'home-hero-image'
const MODULES_IMAGE_NAME = 'modules-image'
const FEATURES_HERO_IMAGE_NAME = 'features-hero-image'

/** Public path for a CMS image, given the stable name it is saved under. */
const cmsImagePath = (name, row) =>
  `${CMS_IMAGE_URL_BASE}/${name}.${extensionFor(row.image.filename_download)}`

const mapImageSingleton = (row, name, extra = () => ({})) => ({
  src: cmsImagePath(name, row),
  alt: row.alt,
  ...extra(row)
})

const mapTestimonial = row => ({
  name: row.name,
  role: row.role,
  location: row.location,
  content: row.content,
  img: cmsImagePath(`testimonial-${slugify(row.name)}`, row),
  stat: { value: row.stat_value, label: row.stat_label }
})

/** Only the CMS half of a card. data/index.ts joins the icon and colour on. */
const mapAnchorFeature = row =>
  compact({
    key: row.key,
    name: row.name,
    desc: row.description,
    img: cmsImagePath(`anchor-${row.key}`, row),
    imgAlt: row.image_alt,
    hidden: row.hidden || undefined
  })

/**
 * One phone number in, two out.
 *
 * The page shows it spaced for a human to read, while schema.org's `telephone`
 * and a `tel:` link both want E.164 with nothing but a plus and digits. Storing
 * both in the CMS would mean two fields to keep in step and one number that is
 * silently wrong when someone updates only the other, so the strict form is
 * derived here and validated below.
 */
const toE164 = phone => phone.replace(/[^\d+]/g, '')

const mapContactDetails = row => ({
  salesPhone: row.sales_phone.trim(),
  salesPhoneE164: toE164(row.sales_phone),
  salesEmail: row.sales_email.trim()
})

const mapFaq = row =>
  compact({
    question: row.question,
    answer: row.answer,
    category: row.category?.name,
    youtubeUrl: row.youtube_url || undefined
  })

const mapDemoVideo = row => ({
  src: `${VIDEO_URL_BASE}/${VIDEO_NAME}.${extensionFor(row.video.filename_download)}`,
  poster: {
    src: cmsImagePath(`${VIDEO_NAME}-poster`, { image: row.poster }),
    alt: row.poster_alt
  }
})

// ── Validation ───────────────────────────────────────────────────

/**
 * Shared checks for the two image singletons. Directus returns a singleton as
 * an object even when nothing has ever been saved into it, so every field has
 * to be checked rather than trusting the row's existence.
 */
const validateImageSingleton = (label, row, errors) => {
  if (!row) {
    errors.push(`${label}: the collection returned no row at all`)
    return
  }
  if (!row.image?.id) {
    errors.push(`${label}: no image is set, the page would render a broken img`)
  }
  const alt = (row.alt ?? '').trim()
  if (!alt) {
    errors.push(`${label}: no alt text`)
  } else if (alt.length < MIN_ALT_TEXT) {
    errors.push(
      `${label}: alt text "${alt}" is only ${alt.length} characters. Describe ` +
        `what is actually in the image, not what it is for.`
    )
  }
}

const validateTestimonials = rows => {
  const errors = []
  const warnings = []
  const seen = new Map()

  if (!rows.length) {
    errors.push('testimonials: nothing is published, the carousel would be empty')
  }

  for (const row of rows) {
    const where = `testimonial "${row.name || '(no name)'}"`

    for (const field of ['name', 'role', 'location', 'content', 'stat_value', 'stat_label']) {
      if (!(row[field] ?? '').toString().trim()) errors.push(`${where}: no ${field}`)
    }
    if (!row.image?.id) errors.push(`${where}: no photo`)

    if (row.name) {
      const slug = slugify(row.name)
      if (!slug) {
        errors.push(`${where}: the name contains no letters or digits to build a filename from`)
      } else if (seen.has(slug)) {
        errors.push(
          `${where}: its name resolves to the same image filename as ` +
            `"${seen.get(slug)}". Distinguish the two names.`
        )
      } else {
        seen.set(slug, row.name)
      }
    }

    const content = (row.content ?? '').trim()
    if (content && content.length < MIN_TESTIMONIAL_TEXT) {
      errors.push(
        `${where}: the quote is only ${content.length} characters, at least ` +
          `${MIN_TESTIMONIAL_TEXT} are needed to fill the card`
      )
    }
    if (content.length > MAX_TESTIMONIAL_TEXT) {
      warnings.push(
        `${where}: the quote is ${content.length} characters, over ` +
          `${MAX_TESTIMONIAL_TEXT} it starts to overflow the card on a phone`
      )
    }
    // Testimonials.tsx renders {"} around the quote, so stored quote marks
    // would double up on screen.
    if (/^["'“‘]|["'”’]$/.test(content)) {
      errors.push(
        `${where}: the quote starts or ends with a quotation mark. The card ` +
          `adds its own, so this would render as ""like this"".`
      )
    }
  }

  return { errors, warnings }
}

/**
 * FeaturesPage.tsx builds the grid from anchorFeatures[0] through [3] as four
 * hand-written layout blocks rather than a loop, so the visible cards are
 * positional: a fifth would never render and a fourth missing would crash the
 * page on an undefined read. Hence the exact count rather than a minimum.
 */
const VISIBLE_ANCHOR_FEATURES = 4
/** The overflow list is a three-column grid, so a partial row looks unbalanced. */
const HIDDEN_ANCHOR_COLUMNS = 3
const MIN_ANCHOR_DESC = 60
const MAX_ANCHOR_DESC = 220

const validateAnchorFeatures = (rows, knownKeys) => {
  const errors = []
  const warnings = []
  const seen = new Set()

  const visible = rows.filter(r => !r.hidden)
  const hidden = rows.filter(r => r.hidden)

  if (visible.length !== VISIBLE_ANCHOR_FEATURES) {
    errors.push(
      `anchor_features: ${visible.length} published cards are not hidden, but the ` +
        `grid has exactly ${VISIBLE_ANCHOR_FEATURES} fixed positions. Mark the ` +
        `extras as Hidden so they show under "See the List", or publish another.`
    )
  }
  if (!hidden.length) {
    errors.push(
      'anchor_features: nothing is marked Hidden, so the "See the List" button ' +
        'would open an empty panel'
    )
  } else if (hidden.length % HIDDEN_ANCHOR_COLUMNS !== 0) {
    warnings.push(
      `anchor_features: ${hidden.length} hidden cards do not fill whole rows of ` +
        `${HIDDEN_ANCHOR_COLUMNS}, so the last row will be short`
    )
  }

  for (const row of rows) {
    const where = `anchor feature "${row.name || row.key || '(unnamed)'}"`

    if (!row.key) {
      errors.push(`${where}: no key, so it cannot find an icon or a colour`)
    } else {
      if (!knownKeys.has(row.key)) {
        errors.push(
          `${where}: key "${row.key}" has no entry in the anchorFeatureStyles map ` +
            `in data/index.ts, so the card would render with no icon and no ` +
            `colour. Add one there before publishing this card.`
        )
      }
      if (seen.has(row.key)) {
        errors.push(`${where}: key "${row.key}" is used by more than one card`)
      }
      seen.add(row.key)
    }

    for (const field of ['name', 'description', 'image_alt']) {
      if (!(row[field] ?? '').toString().trim()) errors.push(`${where}: no ${field}`)
    }
    if (!row.image?.id) errors.push(`${where}: no image`)

    const alt = (row.image_alt ?? '').trim()
    if (alt && alt.length < MIN_ALT_TEXT) {
      errors.push(
        `${where}: alt text "${alt}" is only ${alt.length} characters. Describe ` +
          `what the screenshot shows.`
      )
    }

    const desc = (row.description ?? '').trim()
    if (desc && desc.length < MIN_ANCHOR_DESC) {
      errors.push(
        `${where}: the description is only ${desc.length} characters, at least ` +
          `${MIN_ANCHOR_DESC} are needed to fill the card`
      )
    }
    if (desc.length > MAX_ANCHOR_DESC) {
      warnings.push(
        `${where}: the description is ${desc.length} characters, over ` +
          `${MAX_ANCHOR_DESC} it starts to cover the screenshot behind it`
      )
    }
  }

  return { errors, warnings }
}

/**
 * Google reads an FAQ answer on its own, with no page around it, so a stub or
 * a cross-reference to something further up the page reads as broken.
 */
const MIN_FAQ_ANSWER = 80
/** Rich results are truncated well before this; a wall of text is a warning. */
const MAX_FAQ_ANSWER = 1200
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

const validateFaqs = rows => {
  const errors = []
  const warnings = []
  const seen = new Set()

  if (!rows.length) {
    errors.push('faqs: nothing is published, /faq would be an empty page')
  }

  for (const row of rows) {
    const question = (row.question ?? '').trim()
    const answer = (row.answer ?? '').trim()
    const where = `faq "${question.slice(0, 48) || '(no question)'}"`

    if (!question) errors.push('faqs: a published row has no question')
    if (!answer) errors.push(`${where}: no answer`)
    if (!row.category?.name) {
      errors.push(`${where}: no category, so its pill would render empty`)
    }

    const key = question.toLowerCase()
    if (key && seen.has(key)) {
      errors.push(
        `${where}: this question is listed twice. Duplicate Questions in ` +
          `FAQPage structured data are a Search Console warning.`
      )
    }
    seen.add(key)

    // seo/schema.ts emits every published FAQ as a schema.org Question, so the
    // text has to behave like one.
    if (question && !question.endsWith('?')) {
      errors.push(
        `${where}: does not end in a question mark. It is published as a ` +
          `schema.org Question, so it has to read as one.`
      )
    }
    if (answer && answer.length < MIN_FAQ_ANSWER) {
      errors.push(
        `${where}: the answer is only ${answer.length} characters, at least ` +
          `${MIN_FAQ_ANSWER} are needed. Google shows it with no page around ` +
          `it, so it has to stand alone.`
      )
    }
    if (answer.length > MAX_FAQ_ANSWER) {
      warnings.push(
        `${where}: the answer is ${answer.length} characters, which is longer ` +
          `than a rich result will show`
      )
    }
    // FAQPage.tsx renders the answer as text, so a tag would appear literally.
    if (/<[a-z/][^>]*>/i.test(answer)) {
      errors.push(
        `${where}: the answer contains HTML, which would be shown to visitors ` +
          `as literal tags. Write it as plain prose.`
      )
    }

    const youtube = (row.youtube_url ?? '').trim()
    if (youtube && !/^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{6,}/.test(youtube)) {
      errors.push(
        `${where}: "${youtube}" is not a YouTube watch link, so the ` +
          `"Watch on YouTube" button would go nowhere useful`
      )
    }

    for (const field of ['color_bg', 'color_text', 'color_border']) {
      const value = row.category?.[field]
      if (value && !HEX_COLOR.test(value)) {
        errors.push(
          `faq category "${row.category.name}": ${field} is "${value}", which ` +
            `is not a six-digit hex colour like #f0fdf4. The pill is styled ` +
            `inline, so anything else silently renders unstyled.`
        )
      }
    }
  }

  return { errors, warnings }
}

/** E.164: a plus, a non-zero country code, then up to fourteen more digits. */
const E164 = /^\+[1-9]\d{7,14}$/
/**
 * Deliberately loose. Anything stricter rejects addresses that are legal, and
 * the only thing worth catching here is a value that is plainly not an address
 * at all, since nothing on the page would reveal the mistake.
 */
const EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/

const validateContactDetails = row => {
  const errors = []
  const warnings = []

  if (!row) {
    errors.push('contact_details: the collection returned no row at all')
    return { errors, warnings }
  }

  const phone = (row.sales_phone ?? '').trim()
  const email = (row.sales_email ?? '').trim()

  if (!phone) {
    errors.push('contact_details: no sales phone number')
  } else if (!E164.test(toE164(phone))) {
    // This number is published as the Organization's sales contactPoint, so a
    // local format like 0708 178 500 is wrong everywhere outside Kenya and
    // wrong in the structured data everywhere.
    errors.push(
      `contact_details: "${phone}" is not a full international number. Write it ` +
        `with the country code, like +254 708 178 500, because it is published ` +
        `as the sales contact in the site's structured data.`
    )
  }

  if (!email) {
    errors.push('contact_details: no sales email address')
  } else if (!EMAIL.test(email)) {
    errors.push(
      `contact_details: "${email}" does not look like an email address, and it ` +
        `is shown on the contact page and in the footer of every page`
    )
  }

  return { errors, warnings }
}

const validateDemoVideo = row => {
  const errors = []

  if (!row) {
    errors.push('demo_video: the collection returned no row at all')
    return { errors, warnings: [] }
  }
  if (!row.video?.id) {
    errors.push('demo_video: no video file is set, both players would be empty')
  } else if (!/^(mp4|webm|ogv|mov)$/.test(extensionFor(row.video.filename_download))) {
    // A browser that cannot decode the file shows an empty black box with no
    // error, so the wrong format is worth catching before it ships.
    errors.push(
      `demo_video: "${row.video.filename_download}" is not a format browsers ` +
        `play inline. Upload MP4 with H.264 video and AAC audio.`
    )
  }
  if (!row.poster?.id) {
    errors.push('demo_video: no poster image, the section would show a blank frame')
  }
  const alt = (row.poster_alt ?? '').trim()
  if (!alt) {
    errors.push('demo_video: no alt text for the poster image')
  } else if (alt.length < MIN_ALT_TEXT) {
    errors.push(
      `demo_video: poster alt text "${alt}" is only ${alt.length} characters`
    )
  }

  return { errors, warnings: [] }
}

const validateMarquee = rows => {
  const errors = []
  const warnings = []
  const seen = new Set()

  if (rows.length < MIN_MARQUEE_ITEMS) {
    errors.push(
      `modules_marquee: only ${rows.length} labels are published, at least ` +
        `${MIN_MARQUEE_ITEMS} are needed for the strip to scroll without a visible gap`
    )
  }

  for (const row of rows) {
    const label = (row.label ?? '').trim()
    if (!label) {
      errors.push('modules_marquee: a published row has an empty label')
      continue
    }
    const key = label.toLowerCase()
    if (seen.has(key)) {
      errors.push(
        `modules_marquee: "${label}" is listed twice. The strip already repeats ` +
          `the whole list, so a duplicate reads as a rendering fault.`
      )
    }
    seen.add(key)
    if (label.length > MAX_MARQUEE_LABEL) {
      warnings.push(
        `modules_marquee: "${label}" is ${label.length} characters, over ` +
          `${MAX_MARQUEE_LABEL} it crowds the strip`
      )
    }
  }

  return { errors, warnings }
}

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

/**
 * Downloads every image in `specs` into `dir` and deletes anything else it
 * finds there.
 *
 * `specs` entries are `{ name, id, label }`: the filename to save under, the
 * Directus file id, and what to call it in an error. The prune at the end is
 * why each directory is owned entirely by one call, so archiving a testimonial
 * or swapping a hero image does not leave a file in git forever.
 */
const downloadImages = async (dir, specs) => {
  await mkdir(dir, { recursive: true })
  const wanted = new Set()

  for (const { name, id, label } of specs) {
    wanted.add(name)
    const dest = join(dir, name)

    const res = await fetch(`${DIRECTUS_URL}/assets/${id}`, {
      headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
    })
    if (!res.ok) {
      throw new Error(`failed to download ${label}: HTTP ${res.status}`)
    }
    const bytes = Buffer.from(await res.arrayBuffer())
    if (bytes.length === 0) {
      throw new Error(`${label} downloaded as 0 bytes`)
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

  await pruneOrphans(dir, wanted)
}

/** Deletes anything in `dir` that no published row points at any more. */
const pruneOrphans = async (dir, wanted) => {
  for (const name of await readdir(dir)) {
    if (name === '.gitkeep' || wanted.has(name)) continue
    await unlink(join(dir, name))
    log(`removed orphan file ${name}`)
  }
}

const articleImageSpecs = rows =>
  rows.map(row => ({
    name: `${row.slug}.${extensionFor(row.image.filename_download)}`,
    id: row.image.id,
    label: `hero image for ${row.slug}`
  }))

/**
 * Turns a public path the mappers already chose back into a download spec, so
 * the file that is written and the path the site asks for cannot drift apart.
 */
const specFor = (publicPath, row, label) => ({
  name: publicPath.split('/').pop(),
  id: row.image.id,
  label
})

/**
 * The demo video, which unlike the images is not fetched just to be compared.
 *
 * It is around 100 MB and content-sync.sh runs every five minutes, so
 * downloading it each time only to find it unchanged would move tens of
 * gigabytes a day for nothing. Instead the local file is stamped with the
 * Directus `modified_on` date after each download, so its own size and mtime
 * identify which version is on disk, and the transfer is skipped when both
 * still match the CMS.
 *
 * The comparison is against the file itself rather than any recorded state,
 * which matters because the video is gitignored: the server's copy and the
 * committed demo-video.json can legitimately disagree, and only the disk knows
 * the truth. Every way this check can be wrong (no file, a copy that lost its
 * mtime, a fresh clone) errs towards downloading again.
 */
const downloadVideo = async (publicPath, row) => {
  await mkdir(VIDEO_DIR, { recursive: true })
  const name = publicPath.split('/').pop()
  const dest = join(VIDEO_DIR, name)
  const stamp = new Date(row.video.modified_on ?? row.video.uploaded_on)
  const size = Number(row.video.filesize)

  if (Number.isFinite(size) && !Number.isNaN(stamp.getTime())) {
    try {
      const local = await stat(dest)
      // A second of slack: not every filesystem stores sub-second mtimes.
      if (local.size === size && Math.abs(local.mtimeMs - stamp.getTime()) < 1000) {
        log(`video ${name.padEnd(52)} ${(size / 1024 / 1024).toFixed(1).padStart(5)} MB  (unchanged)`)
        await pruneOrphans(VIDEO_DIR, new Set([name]))
        return
      }
    } catch {
      /* not present yet */
    }
  }

  const res = await fetch(`${DIRECTUS_URL}/assets/${row.video.id}`, {
    headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
  })
  if (!res.ok) throw new Error(`failed to download the demo video: HTTP ${res.status}`)
  const bytes = Buffer.from(await res.arrayBuffer())
  if (bytes.length === 0) throw new Error('the demo video downloaded as 0 bytes')

  await writeFile(dest, bytes)
  if (!Number.isNaN(stamp.getTime())) await utimes(dest, stamp, stamp)
  log(`video ${name.padEnd(52)} ${(bytes.length / 1024 / 1024).toFixed(1).padStart(5)} MB`)

  await pruneOrphans(VIDEO_DIR, new Set([name]))
}

// ── Main ─────────────────────────────────────────────────────────

const fallbackToCommitted = async reason => {
  if (REQUIRE_CMS) {
    console.error(`[content] ${reason}`)
    console.error('[content] --require-cms was passed, so this is fatal.')
    process.exit(1)
  }
  try {
    // Every generated file has to be present, not just articles.json: a
    // missing one fails later as an unresolved import inside `vite build`,
    // where nothing points back at the CMS being unreachable.
    const cached = Object.fromEntries(
      await Promise.all(
        Object.entries(OUT_FILES).map(async ([key, file]) => [
          key,
          JSON.parse(await readFile(file, 'utf8'))
        ])
      )
    )
    console.warn('')
    console.warn('[content] ================================================')
    console.warn(`[content] ${reason}`)
    console.warn('[content] Falling back to the committed content:')
    console.warn(
      `[content]   ${cached.articles.articles.length} articles, generated ${cached.articles.generatedAt}`
    )
    console.warn(
      `[content]   ${cached.testimonials.testimonials.length} testimonials, ` +
        `${cached.modulesMarquee.labels.length} marquee labels, ` +
        `${cached.anchorFeatures.features.length} module cards`
    )
    console.warn('[content] Any newer CMS edits are NOT in this build.')
    // The video is the one asset with no committed copy, so say so rather than
    // letting someone find a silently empty player.
    console.warn('[content] The demo video is NOT committed, so it will be missing.')
    console.warn('[content] ================================================')
    console.warn('')
    return
  } catch (err) {
    console.error(`[content] ${reason}`)
    console.error(`[content] and the committed fallback in ${OUT_DIR} is not usable:`)
    console.error(`[content]   ${err.message}`)
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

  const anchorFeatureKeys = await readAnchorFeatureKeys()

  let rows, categories, heroRow, modulesImageRow, testimonialRows, marqueeRows
  let featuresHeroRow, demoVideoRow, anchorRows, faqRows, contactRow
  try {
    // One failure means the CMS is down, so they are fetched together and the
    // fallback is taken for all of them or none. Mixing fresh testimonials
    // with stale articles would be worse than being one build behind.
    ;[
      rows,
      categories,
      heroRow,
      modulesImageRow,
      testimonialRows,
      marqueeRows,
      featuresHeroRow,
      demoVideoRow,
      anchorRows,
      faqRows,
      contactRow
    ] = await Promise.all([
      directus(QUERY),
      directus(
        '/items/article_categories?fields=name,sort,color_bg,color_text&sort=sort&limit=-1'
      ),
      directus(HOME_HERO_IMAGE_QUERY),
      directus(MODULES_IMAGE_QUERY),
      directus(TESTIMONIALS_QUERY),
      directus(MODULES_MARQUEE_QUERY),
      directus(FEATURES_HERO_IMAGE_QUERY),
      directus(DEMO_VIDEO_QUERY),
      directus(ANCHOR_FEATURES_QUERY),
      directus(FAQS_QUERY),
      directus(CONTACT_DETAILS_QUERY)
    ])
  } catch (err) {
    return fallbackToCommitted(`Could not reach Directus: ${err.message}`)
  }

  log(
    `fetched ${rows.length} articles, ${testimonialRows.length} testimonials, ` +
      `${marqueeRows.length} marquee labels and ${anchorRows.length} module cards ` +
      `from ${DIRECTUS_URL}`
  )

  const missingImage = rows.filter(r => !r.image?.id)
  if (missingImage.length) {
    console.error('[content] these published articles have no hero image:')
    missingImage.forEach(r => console.error(`  - ${r.slug}`))
    process.exit(1)
  }

  const articles = rows.map(mapArticle)

  const singletonErrors = []
  validateImageSingleton('home_hero_image', heroRow, singletonErrors)
  validateImageSingleton('modules_image', modulesImageRow, singletonErrors)
  validateImageSingleton('features_hero_image', featuresHeroRow, singletonErrors)
  if (modulesImageRow && !(modulesImageRow.badge ?? '').trim()) {
    singletonErrors.push('modules_image: no badge text, the pill would render empty')
  }

  const checks = [
    validate(articles),
    { errors: singletonErrors, warnings: [] },
    validateTestimonials(testimonialRows),
    validateMarquee(marqueeRows),
    validateDemoVideo(demoVideoRow),
    validateAnchorFeatures(anchorRows, anchorFeatureKeys),
    validateFaqs(faqRows),
    validateContactDetails(contactRow)
  ]
  const warnings = checks.flatMap(c => c.warnings)
  const errors = checks.flatMap(c => c.errors)

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

  const hero = mapImageSingleton(heroRow, HERO_IMAGE_NAME)
  const modulesImage = mapImageSingleton(modulesImageRow, MODULES_IMAGE_NAME, row => ({
    badge: row.badge
  }))
  const featuresHero = mapImageSingleton(featuresHeroRow, FEATURES_HERO_IMAGE_NAME)
  const testimonials = testimonialRows.map(mapTestimonial)
  const anchorFeatures = anchorRows.map(mapAnchorFeature)
  const demoVideo = mapDemoVideo(demoVideoRow)

  await downloadImages(IMAGE_DIR, articleImageSpecs(rows))
  await downloadImages(CMS_IMAGE_DIR, [
    specFor(hero.src, heroRow, 'the home hero image'),
    specFor(modulesImage.src, modulesImageRow, 'the modules section image'),
    specFor(featuresHero.src, featuresHeroRow, 'the features hero image'),
    specFor(demoVideo.poster.src, { image: demoVideoRow.poster }, 'the demo video poster'),
    ...testimonials.map((t, i) =>
      specFor(t.img, testimonialRows[i], `the photo for ${t.name}`)
    ),
    ...anchorFeatures.map((f, i) =>
      specFor(f.img, anchorRows[i], `the screenshot for ${f.name}`)
    )
  ])
  await downloadVideo(demoVideo.src, demoVideoRow)

  const articlePayload = {
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

  // The four newer files carry no generatedAt. Their collections have no date
  // to derive one from, and a clock would churn the git diff on every run.
  const payloads = {
    articles: articlePayload,
    homeHeroImage: hero,
    modulesImage,
    testimonials: { testimonials },
    modulesMarquee: { labels: marqueeRows.map(r => r.label) },
    featuresHeroImage: featuresHero,
    demoVideo,
    anchorFeatures: { features: anchorFeatures },
    faqs: {
      // Only the categories actually in use, keyed by name in data/index.ts.
      // An unused category would otherwise ship colours nothing references.
      categories: [
        ...new Map(
          faqRows
            .filter(r => r.category)
            .map(r => [
              r.category.name,
              {
                name: r.category.name,
                colorBg: r.category.color_bg,
                colorText: r.category.color_text,
                colorBorder: r.category.color_border
              }
            ])
        ).values()
      ],
      faqs: faqRows.map(mapFaq)
    },
    contactDetails: mapContactDetails(contactRow)
  }

  await mkdir(OUT_DIR, { recursive: true })
  for (const [key, file] of Object.entries(OUT_FILES)) {
    await writeFile(file, `${JSON.stringify(payloads[key], null, 2)}\n`, 'utf8')
    log(`wrote ${file.slice(ROOT.length + 1)}`)
  }

  const words = articles.reduce(
    (n, a) => n + wordCount(a.intro, a.sections.map(s => ({ ...s, bullets: s.bullets?.map(t => ({ text: t })) }))),
    0
  )
  log(
    `${articles.length} articles, ${articles.reduce((n, a) => n + a.sections.length, 0)} sections, ` +
      `${words} words, ${articlePayload.categories.length} categories`
  )
  log(
    `${testimonials.length} testimonials, ${payloads.modulesMarquee.labels.length} marquee labels, ` +
      `${anchorFeatures.length} module cards, ${faqRows.length} faqs, ` +
      `4 section images, 1 video`
  )
}

await main()
