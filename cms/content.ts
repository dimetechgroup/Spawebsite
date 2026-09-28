import { anchorFeatureStyles } from '@/data'
import type {
  AnchorFeature,
  Article,
  ArticleCategoryColorMap,
  ArticleSection,
  BlogPost,
  CmsImage,
  ContactDetails,
  DemoVideo,
  FAQ,
  FAQCategoryColorMap,
  ModulesImage,
  Testimonial
} from '@/types'
import { assetUrl, cmsItems, cmsSingleton, type CockpitAsset } from './client'

/**
 * Loaders for each kind of CMS content, mapping Cockpit's items onto the
 * shapes the components already use.
 *
 * Each loader runs at most once per page load: the promise is cached, so the
 * footer, the contact page and the structured data all share one request.
 */

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')

const once = <T>(load: () => Promise<T>) => {
  let promise: Promise<T> | null = null
  return () => {
    promise ??= load().catch(err => {
      promise = null // let the next caller retry
      throw err
    })
    return promise
  }
}

// ── Site Settings ────────────────────────────────────────────────

interface CockpitSettings {
  salesPhone?: string
  salesEmail?: string
  homeHeroImage?: CockpitAsset
  homeHeroAlt?: string
  featuresHeroImage?: CockpitAsset
  featuresHeroAlt?: string
  modulesImage?: CockpitAsset
  modulesImageAlt?: string
  modulesBadge?: string
  demoVideoUrl?: string
  demoVideoPoster?: CockpitAsset
  demoVideoPosterAlt?: string
  marqueeLabels?: string[]
}

export interface SiteSettings {
  contactDetails: ContactDetails
  homeHeroImage: CmsImage
  featuresHeroImage: CmsImage
  modulesImage: ModulesImage
  demoVideo: DemoVideo
  /** The capability strip labels, doubled so Features.tsx can loop it seamlessly. */
  marqueeItems: string[]
}

/**
 * schema.org's `telephone` and a `tel:` link want E.164, while the page shows
 * the number spaced for a person to read. Deriving one from the other means an
 * editor only maintains one number.
 */
const toE164 = (phone: string) => phone.replace(/[^\d+]/g, '')

export const loadSiteSettings = once(async (): Promise<SiteSettings> => {
  const s = await cmsSingleton<CockpitSettings>('sitesettings')
  const labels = (s.marqueeLabels ?? []).map(str).filter(Boolean)
  const phone = str(s.salesPhone)
  return {
    contactDetails: { salesPhone: phone, salesPhoneE164: toE164(phone), salesEmail: str(s.salesEmail) },
    homeHeroImage: { src: assetUrl(s.homeHeroImage), alt: str(s.homeHeroAlt) },
    featuresHeroImage: { src: assetUrl(s.featuresHeroImage), alt: str(s.featuresHeroAlt) },
    modulesImage: { src: assetUrl(s.modulesImage), alt: str(s.modulesImageAlt), badge: str(s.modulesBadge) },
    demoVideo: {
      embedUrl: str(s.demoVideoUrl),
      poster: { src: assetUrl(s.demoVideoPoster), alt: str(s.demoVideoPosterAlt) }
    },
    marqueeItems: [...labels, ...labels]
  }
})

// ── Articles ─────────────────────────────────────────────────────

interface CockpitArticle {
  slug?: string
  title?: string
  category?: string
  datePublished?: string
  dateModified?: string
  author?: string
  readTime?: string
  image?: CockpitAsset
  metaTitle?: string
  metaDescription?: string
  preview?: string
  intro?: string
  sections?: { heading?: string; body?: string; bullets?: string[]; links?: { text?: string; to?: string }[] }[]
}

interface CockpitCategory {
  name?: string
  colorBg?: string
  colorText?: string
  colorBorder?: string
}

export interface ArticlesContent {
  articles: Article[]
  categoryColors: ArticleCategoryColorMap
  /** Filter tabs for /resources: 'All', then each category that has an article. */
  blogCategories: string[]
  /** Cards for /resources, newest first. */
  blogPosts: BlogPost[]
}

const WPM = 220

/** 'Aug 17, 2026'. UTC-pinned so the visitor's timezone cannot shift it. */
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

const mapSection = (s: NonNullable<CockpitArticle['sections']>[number]): ArticleSection => {
  const bullets = (s.bullets ?? []).map(str).filter(Boolean)
  const links = (s.links ?? []).filter(l => str(l?.text)).map(l => ({ text: str(l.text), to: str(l.to) }))
  return {
    ...(str(s.heading) && { heading: str(s.heading) }),
    ...(str(s.body) && { body: str(s.body) }),
    ...(bullets.length && { bullets }),
    ...(links.length && { links })
  } as ArticleSection
}

const mapArticle = (row: CockpitArticle): Article => {
  const sections = (row.sections ?? []).map(mapSection)
  const intro = str(row.intro)
  const words = [intro, ...sections.flatMap(s => [s.heading ?? '', s.body ?? '', ...(s.bullets ?? [])])]
    .join(' ')
    .trim()
    .split(/\s+/).length
  const datePublished = str(row.datePublished)
  return {
    slug: str(row.slug),
    category: str(row.category),
    title: str(row.title),
    date: datePublished ? formatDate(datePublished) : '',
    datePublished,
    dateModified: str(row.dateModified) || datePublished,
    author: str(row.author),
    // An editor's read time wins; otherwise it is estimated from the text.
    readTime: str(row.readTime) || `${Math.max(1, Math.round(words / WPM))} min read`,
    image: assetUrl(row.image),
    metaTitle: str(row.metaTitle) || undefined,
    metaDescription: str(row.metaDescription) || undefined,
    preview: str(row.preview) || undefined,
    intro,
    sections
  }
}

export const loadArticles = once(async (): Promise<ArticlesContent> => {
  const [rows, categories] = await Promise.all([
    cmsItems<CockpitArticle>('articles', { datePublished: -1 }),
    cmsItems<CockpitCategory>('articlecategories')
  ])
  const articles = rows.map(mapArticle).filter(a => a.slug && a.title)
  return {
    articles,
    categoryColors: Object.fromEntries(
      categories.map(c => [str(c.name), { bg: str(c.colorBg), color: str(c.colorText) }])
    ),
    blogCategories: [
      'All',
      ...categories.map(c => str(c.name)).filter(name => articles.some(a => a.category === name))
    ],
    blogPosts: articles.map((article, i) => ({
      id: i + 1,
      slug: article.slug,
      category: article.category,
      title: article.title,
      preview: article.preview ?? article.intro,
      image: article.image,
      date: article.date,
      readTime: article.readTime
    }))
  }
})

// ── Testimonials ─────────────────────────────────────────────────

interface CockpitTestimonial {
  name?: string
  role?: string
  location?: string
  content?: string
  img?: CockpitAsset
  statValue?: string
  statLabel?: string
}

export const loadTestimonials = once(async (): Promise<Testimonial[]> =>
  (await cmsItems<CockpitTestimonial>('testimonials')).map(row => ({
    name: str(row.name),
    role: str(row.role),
    location: str(row.location),
    content: str(row.content),
    img: assetUrl(row.img),
    stat: { value: str(row.statValue), label: str(row.statLabel) }
  }))
)

// ── Anchor features ──────────────────────────────────────────────

interface CockpitAnchorFeature {
  key?: string
  name?: string
  desc?: string
  img?: CockpitAsset
  imgAlt?: string
  hidden?: boolean
}

/**
 * Module cards on /features, in Cockpit order. Each joins its icon and colour
 * from `anchorFeatureStyles` on `key`; a card whose key has no entry there is
 * dropped, since it would render with no icon and no colour.
 */
export const loadAnchorFeatures = once(async (): Promise<AnchorFeature[]> =>
  (await cmsItems<CockpitAnchorFeature>('anchorfeatures'))
    .filter(row => anchorFeatureStyles[str(row.key)])
    .map(row => ({
      key: str(row.key),
      name: str(row.name),
      desc: str(row.desc),
      img: assetUrl(row.img),
      imgAlt: str(row.imgAlt),
      ...(row.hidden === true && { hidden: true }),
      ...anchorFeatureStyles[str(row.key)]
    }) as AnchorFeature)
)

// ── FAQs ─────────────────────────────────────────────────────────

interface CockpitFaq {
  question?: string
  answer?: string
  category?: string
  youtubeUrl?: string
}

export interface FaqsContent {
  faqs: FAQ[]
  categoryColors: FAQCategoryColorMap
}

export const loadFaqs = once(async (): Promise<FaqsContent> => {
  const [rows, categories] = await Promise.all([
    cmsItems<CockpitFaq>('faqs'),
    cmsItems<CockpitCategory>('faqcategories')
  ])
  return {
    faqs: rows
      .filter(row => str(row.question) && str(row.answer))
      .map(row => ({
        question: str(row.question),
        answer: str(row.answer),
        category: str(row.category),
        ...(str(row.youtubeUrl) && { youtubeUrl: str(row.youtubeUrl) })
      }) as FAQ),
    categoryColors: Object.fromEntries(
      categories.map(c => [
        str(c.name),
        { bg: str(c.colorBg), color: str(c.colorText), border: str(c.colorBorder) }
      ])
    )
  }
})
