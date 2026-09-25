import { articles } from '@/data'

/**
 * Canonical origin. MUST match the host that public/.htaccess 301-redirects to,
 * otherwise ranking signals split across two hostnames.
 */
export const SITE_URL = 'https://myspa.co.ke'

export const SITE_NAME = 'MySpa'
export const DEFAULT_OG_IMAGE = '/images/Dashboard.png'

export interface RouteMeta {
  path: string
  title: string
  description: string
  /** Root-relative or absolute; absolutised for og:image / twitter:image. */
  ogImage: string
  ogType: 'website' | 'article'
  /** Sitemap priority. */
  priority: number
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  /** ISO date for <lastmod>. */
  lastmod?: string
  noindex?: boolean
  /** Excluded from sitemap.xml when false. */
  inSitemap?: boolean
  /** Label used by the Navbar when present. */
  navLabel?: string
  /** Also listed in the Footer "Explore" column. */
  inFooter?: boolean
}

/**
 * The eight non-article routes, in Navbar display order.
 * Titles stay under ~60 chars and descriptions land in the 140–160 range so
 * Google is unlikely to truncate or rewrite them.
 */
export const staticRoutes: RouteMeta[] = [
  {
    path: '/',
    title: 'Spa Management Software in Kenya | MySpa',
    description:
      'MySpa is all-in-one spa and salon management software for Kenyan businesses. Run bookings, POS, inventory, CRM and reports from one system.',
    ogImage: '/images/Dashboard.png',
    ogType: 'website',
    priority: 1.0,
    changefreq: 'weekly',
    navLabel: 'Home',
    inFooter: true
  },
  {
    path: '/features',
    title: 'Spa Management System Features & Modules | MySpa',
    description:
      'Every MySpa module in one place: appointment scheduling, spa POS, customer management, inventory, payroll, accounting and real-time reports.',
    ogImage: '/images/modules.png',
    ogType: 'website',
    priority: 0.9,
    changefreq: 'monthly',
    navLabel: 'Features',
    inFooter: true
  },
  {
    path: '/pricing',
    title: 'Spa Software Pricing in Kenya from KES 3,000/mo | MySpa',
    description:
      'MySpa spa management software pricing in Kenya: three plans from KES 3,000 per month with a 15-day free trial and no credit card required.',
    ogImage: '/images/Dashboard.png',
    ogType: 'website',
    priority: 0.9,
    changefreq: 'monthly',
    navLabel: 'Pricing',
    inFooter: true
  },
  {
    path: '/faq',
    title: 'Spa Software FAQs: Booking, Pricing & Setup | MySpa',
    description:
      'Answers to common questions about MySpa spa management software: how booking works, pricing, onboarding, data security and multi-branch support.',
    ogImage: '/images/Dashboard.png',
    ogType: 'website',
    priority: 0.8,
    changefreq: 'monthly',
    navLabel: 'FAQ',
    inFooter: true
  },
  {
    path: '/resources',
    title: 'Spa Management Guides & Insights | MySpa Blog',
    description:
      'Practical guides on running a spa: cutting no-shows, managing inventory, tracking the metrics that matter and scaling a multi-branch spa business.',
    ogImage: '/images/Dash.png',
    ogType: 'website',
    priority: 0.8,
    changefreq: 'weekly',
    navLabel: 'Resources'
  },
  {
    path: '/contact',
    title: 'Contact MySpa: Spa Software Support in Nairobi',
    description:
      'Talk to the MySpa team in Nairobi about spa and salon management software. Request a demo, ask about pricing, or get help with onboarding.',
    ogImage: '/images/Dashboard.png',
    ogType: 'website',
    priority: 0.7,
    changefreq: 'yearly',
    navLabel: 'Contact Us',
    inFooter: true
  },
  {
    path: '/about',
    title: 'About MySpa: Spa Software Built in Kenya',
    description:
      'MySpa is built by Dimetech Group, an ERP team with over a decade of delivery experience across Africa, serving spas from Nairobi and beyond.',
    ogImage: '/images/DSC06620.jpg',
    ogType: 'website',
    priority: 0.6,
    changefreq: 'yearly',
    navLabel: 'About Us'
  },
  {
    path: '/404',
    title: 'Page Not Found | MySpa',
    description:
      'The page you are looking for does not exist. Browse MySpa spa management software features, pricing and guides instead.',
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    priority: 0,
    changefreq: 'yearly',
    noindex: true,
    inSitemap: false
  }
]

/** One route per article, derived from `articles` so the two cannot drift. */
export const articleRoutes = (): RouteMeta[] =>
  articles.map(article => ({
    path: `/resources/${article.slug}`,
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.intro.slice(0, 155),
    ogImage: article.image,
    ogType: 'article' as const,
    priority: 0.6,
    changefreq: 'yearly' as const,
    lastmod: article.dateModified
  }))

export const allRoutes = (): RouteMeta[] => [
  ...staticRoutes,
  ...articleRoutes()
]

/** Navbar entries, in declaration order. */
export const navRoutes = (): RouteMeta[] =>
  staticRoutes.filter(route => Boolean(route.navLabel))

/** Footer "Explore" entries. */
export const footerRoutes = (): RouteMeta[] =>
  staticRoutes.filter(route => route.inFooter)

/** Turns a root-relative path into an absolute URL on the canonical origin. */
export const absoluteUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  // Canonicals are trailing-slash-free everywhere except the root.
  return clean === '/' ? `${SITE_URL}/` : `${SITE_URL}${clean.replace(/\/$/, '')}`
}

export const routeMetaFor = (path: string): RouteMeta | undefined =>
  allRoutes().find(route => route.path === path)
