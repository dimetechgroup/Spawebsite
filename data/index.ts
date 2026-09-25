import {
  Activity,
  BarChart2,
  BarChart3,
  Box,
  CreditCard,
  Droplets,
  Gem,
  Gift,
  Globe,
  Heart,
  LayoutGrid,
  Landmark,
  Lightbulb,
  Megaphone,
  MessageSquare,
  Package,
  Receipt,
  Rocket,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
  Users2,
  Wallet,
  Zap
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Buildings } from '@phosphor-icons/react'


import type {
  FeatureGroup,
  Testimonial,
  Partner,
  Value,
  BlogPost,
  AnchorFeature,
  UtilityFeature,
  FeaturesPageMarqueeItem,
  Plan,
  FAQ,
  FAQCategoryColorMap,
  Module,
  Article,
  ArticleCategoryColorMap,
  CmsImage,
  ModulesImage,
  DemoVideo,
  ContactDetails
} from '../types'

import contentJson from './generated/articles.json'
import homeHeroImageJson from './generated/home-hero-image.json'
import modulesImageJson from './generated/modules-image.json'
import testimonialsJson from './generated/testimonials.json'
import modulesMarqueeJson from './generated/modules-marquee.json'
import featuresHeroImageJson from './generated/features-hero-image.json'
import demoVideoJson from './generated/demo-video.json'
import anchorFeaturesJson from './generated/anchor-features.json'
import faqsJson from './generated/faqs.json'
import contactDetailsJson from './generated/contact-details.json'

/** Shape of generated/articles.json, written by scripts/fetch-content.mjs. */
interface GeneratedContent {
  /** Newest dateModified across all articles, not a build timestamp. */
  generatedAt: string
  categories: { name: string; colorBg: string; colorText: string }[]
  articles: Article[]
}

/**
 * The cast is needed because TypeScript infers a structural union from the JSON
 * literal rather than the `Article` interface. scripts/fetch-content.mjs
 * validates the shape before writing the file, so this is checked at build time
 * rather than merely asserted.
 */
const content = contentJson as unknown as GeneratedContent

// ── ContactPage.tsx, Footer.tsx, seo/schema.ts ──────────────────

/**
 * The sales phone number and email. Edited in Directus under "Contact Details",
 * and the single source for all three places they appear: the cards on
 * /contact, the footer of every page, and the Organization contactPoint in the
 * structured data. The phone and mail icons beside them stay in the components.
 */
export const contactDetails: ContactDetails = contactDetailsJson

// ── Hero.tsx ────────────────────────────────────────────────────

/**
 * The product screenshot beside the hero headline. Edited in Directus under
 * "Home Hero Image"; the headline and buttons around it are still hardcoded.
 */
export const homeHeroImage: CmsImage = homeHeroImageJson

// ── Features.tsx ────────────────────────────────────────────────

export const featureGroups: FeatureGroup[] = [
  {
    number: '01',
    title: 'Business Intelligence & Financial Control',
    description:
      'The core engine powering every decision from daily cash flow to long-term growth analytics.',
    accent: '#2E8B35',
    accentLight: '#A8C5A0',
    items: [
      {
        name: 'Dashboard',
        icon: BarChart2,
        description: 'Real-time KPIs at a glance'
      },
      {
        name: 'Orders & Invoices',
        icon: Receipt,
        description: 'Automated billing & receipts'
      },
      {
        name: 'Accounting',
        icon: CreditCard,
        description: 'Full P&L visibility'
      }
    ]
  },
  {
    number: '02',
    title: 'Customer Experience & Sales Growth',
    description:
      'Build lasting relationships and unlock new revenue streams with smarter client management tools.',
    accent: '#F5A800',
    accentLight: '#F9D98C',
    items: [
      { name: 'CRM', icon: Users, description: 'Client profiles & history' },
      {
        name: 'Gift / Vouchers',
        icon: Gift,
        description: 'Digital gift cards & promos'
      },
      { name: 'Reports', icon: Globe, description: 'Centralized brand control' }
    ],
    featured: true
  },
  {
    number: '03',
    title: 'Operational & Workforce Management',
    description:
      'Streamline every aspect of your day-to-day from staff scheduling to supply chain precision.',
    accent: '#C084A0',
    accentLight: '#E8C5D5',
    items: [
      {
        name: 'HR Management',
        icon: UserCheck,
        description: 'Shifts, payroll & performance'
      },
      { name: 'Inventory', icon: Package, description: 'Smart stock tracking' },
      {
        name: 'Settings',
        icon: Settings,
        description: 'Custom workflows & roles'
      }
    ]
  }
]

/**
 * The scrolling capability strip under the feature grid. Edited in Directus
 * under "Modules Marquee".
 *
 * The list is doubled here rather than in the CMS. Features.tsx animates it
 * from 0% to -50%, so the loop is only seamless if the second half repeats the
 * first exactly, and asking an editor to type every label twice would make a
 * missed one look like a rendering bug. The dot colours alternate on index in
 * the component, so they stay correct at any length.
 */
export const featuresMarqueeItems: string[] = [
  ...modulesMarqueeJson.labels,
  ...modulesMarqueeJson.labels
]

// ── Testimonials.tsx ────────────────────────────────────────────

/**
 * Quote carousel on the home page. Edited in Directus under "Testimonials",
 * ordered by its sort field, and only rows set to published are built in.
 *
 * Testimonials.tsx wraps the quote in its own quotation marks, so the stored
 * text must not carry any; scripts/fetch-content.mjs fails the build if it does.
 */
export const testimonials: Testimonial[] = testimonialsJson.testimonials

// ── PartnerSection.tsx ──────────────────────────────────────────

export const partners: Partner[] = [
  {
    title: 'Uplift You',
    description:
      'A spa software platform built to grow with you and help you scale effortlessly in a competitive market.',
    icon: TrendingUp,
    accent: '#267546',
    tag: 'Growth Engine'
  },
  {
    title: '24/7 Support',
    description:
      'Get elite assistance anytime, anywhere. Our dedicated team is always on standby for your peace of mind.',
    icon: ShieldCheck,
    accent: '#FFA912',
    tag: 'Always On',
    featured: true
  },
  {
    title: 'Personalized Experience',
    description:
      'Easy ways to create the bespoke, personalized experience your high-end guests truly deserve.',
    icon: Gem,
    accent: '#267546',
    tag: 'Bespoke'
  }
]

// ── AboutPage.tsx ───────────────────────────────────────────────

export const values: Value[] = [
  {
    title: 'Innovation',
    desc: 'Pushing boundaries with cutting-edge ERP logic to future-proof your business in an evolving market.',
    icon: Lightbulb,
    bgColor: 'bg-white'
  },
  {
    title: 'Reliability',
    desc: '99.9% uptime guaranteed for your business continuity, ensuring your spa never stops serving.',
    icon: Shield,
    bgColor: 'bg-[#F0FDF4]'
  },
  {
    title: 'Customer Success',
    desc: 'Your growth is our ultimate metric. We succeed only when your revenue and efficiency hit new heights.',
    icon: Target,
    bgColor: 'bg-white'
  },
  {
    title: 'Simplicity',
    desc: 'Complex backend logic delivered through an effortlessly intuitive interface for your staff.',
    icon: Zap,
    bgColor: 'bg-white'
  },
  {
    title: 'Long-term Partnerships',
    desc: "We don't just sell software; we invest in your journey with persistent local support and upgrades.",
    icon: Heart,
    bgColor: 'bg-white'
  }
]

// ── ResourcesPage.tsx ───────────────────────────────────────────

// `blogPosts` (the /resources cards) is derived from `articles` at the bottom
// of this file. One source of truth, so a card can never drift from the
// article it links to.

/**
 * Filter row on /resources. Comes from the CMS category list, in the sort order
 * set there, and lists only categories that actually have a published article,
 * so archiving the last post in a category removes its tab rather than leaving
 * a filter that yields an empty grid.
 */
export const blogCategories: string[] = [
  'All',
  ...content.categories
    .map(category => category.name)
    .filter(name => content.articles.some(article => article.category === name))
]

// ── FeaturesPage.tsx ────────────────────────────────────────────

/**
 * The screenshot at the top of /features. Edited in Directus under "Features
 * Hero Image"; the headline and the Request a Demo button stay here in code.
 */
export const featuresHeroImage: CmsImage = featuresHeroImageJson

/**
 * The product demo, shown in the "One Unified Ecosystem" section and in the
 * home page hero pop-up. One record in Directus feeds both.
 */
export const demoVideo: DemoVideo = demoVideoJson

/**
 * Icon, colour and grid size for each module card, keyed by the `key` field on
 * the matching row in Directus.
 *
 * None of these three can live in the CMS. `icon` is a live Lucide component
 * reference, and `color` is a Tailwind class: Tailwind builds its stylesheet by
 * scanning source files, so `bg-[#207D40]` arriving from Postgres would appear
 * in no source file, compile to no CSS rule, and leave the card unstyled with
 * no error anywhere. `size` is layout, not content.
 *
 * scripts/fetch-content.mjs parses the keys out of this object and fails the
 * build if Directus holds a published card whose key is missing here, so a new
 * module can never be published before the code that styles it exists.
 */
const anchorFeatureStyles: Record<
  string,
  { icon: LucideIcon; color: string; size?: string }
> = {
  dashboard: { icon: LayoutGrid, color: 'bg-[#207D40]', size: 'lg' },
  crm: { icon: Users, color: 'bg-[#F7A300]', size: 'sm' },
  'orders-invoices': { icon: Receipt, color: 'bg-[#207D40]', size: 'sm' },
  accounting: { icon: Wallet, color: 'bg-[#F7A300]', size: 'md' },
  'stock-inventory': { icon: Package, color: 'bg-[#207D40]' },
  'reports-analytics': { icon: BarChart3, color: 'bg-[#F7A300]' },
  'hr-management': { icon: UserCheck, color: 'bg-[#207D40]' }
}

/**
 * Module cards on /features, in CMS sort order. The first four that are not
 * hidden fill the four fixed positions in the bento grid, so their order is
 * load-bearing; the rest appear behind "See the List".
 */
export const anchorFeatures: AnchorFeature[] = anchorFeaturesJson.features.map(
  feature => ({ ...feature, ...anchorFeatureStyles[feature.key] })
) as AnchorFeature[]

export const utilityFeatures: UtilityFeature[] = [
  {
    name: 'Gift / Vouchers',
    icon: Gift,
    desc: 'Boost sales with customizable gift cards and vouchers. Perfect for promotions and rewards.'
  },
  {
    name: 'HR Management',
    icon: Users,
    desc: 'Manage staff schedules, attendance, payroll, and performance tailored for spa operations.'
  },
  {
    name: 'Stock & Inventory',
    icon: Package,
    desc: 'Track product usage, supplier orders, and stock levels in real time to optimize costs.'
  },
  {
    name: 'Point of Sale',
    icon: CreditCard,
    desc: 'Seamless integrated payments and retail checkouts.'
  },
  {
    name: 'Online Booking',
    icon: Globe,
    desc: '24/7 confirmations via web and mobile interfaces.'
  },
  {
    name: 'Marketing Campaigns',
    icon: Megaphone,
    desc: 'Hyper-targeted SMS and email outreach tools.'
  },
  {
    name: 'Product Consumption',
    icon: Droplets,
    desc: 'Track back-bar usage during treatments automatically.'
  },
  {
    name: 'Discount Coupons',
    icon: Ticket,
    desc: 'Custom codes for seasonal and influencer promotions.'
  },
  {
    name: 'Reports & Analytics',
    icon: Star,
    desc: 'Turn raw data into actionable insights.'
  },
  {
    name: 'Automated Feedback',
    icon: MessageSquare,
    desc: 'Instant customer surveys and reputation management.'
  },
  {
    name: 'Incentive Management',
    icon: TrendingUp,
    desc: 'Performance-based reward automation for therapists.'
  },
  {
    name: 'Data Security',
    icon: ShieldCheck,
    desc: 'Enterprise-grade encryption and automated backups.'
  }
]

export const featuresPageMarqueeItems: FeaturesPageMarqueeItem[] = [
  { text: 'REAL-TIME METRICS', icon: Activity },
  { text: 'MOBILE-FIRST UI', icon: Smartphone },
  { text: 'GDPR COMPLIANT', icon: Shield },
  { text: 'SETUP IN MINUTES', icon: Zap }
]

// ── PricingPage.tsx ─────────────────────────────────────────────

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Rocket,
    monthlyPrice: 3000,
    tagline: 'Perfect for small businesses starting out.',
    features: [
      '1–3 Users Management',
      'Unlimited Appointment Scheduling',
      'Lead Management',
      'Vouchers Management',
      'Subscription Management',
      'Unlimited Inventory/Service Management',
      'Payroll Management',
      'Reports & Analytics',
      'Payment Gateway',
      'Stock & Inventory Management',
      'Unlimited Scheduling'
    ],
    buttonText: 'Start Free Trial',
    theme: 'light'
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: Buildings,
    monthlyPrice: 5000,
    tagline: 'Designed for growing medium to high-end businesses.',
    features: [
      '4–20 Users Management',
      'Unlimited Appointment Scheduling',
      'Lead Management',
      'Vouchers Management',
      'Subscription Management',
      'Unlimited Inventory/Service Management',
      'Payroll Management',
      'Reports & Analytics',
      'Payment Gateway',
      'Stock & Inventory Management',
      'Unlimited Scheduling'
    ],
    buttonText: 'Join the Standard Plan',
    theme: 'dark',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Landmark,
    monthlyPrice: 10000,
    tagline: 'Built for high-end spa businesses at scale.',
    features: [
      'Unlimited Users Management',
      'Unlimited Appointment Scheduling',
      'Lead Management',
      'Vouchers Management',
      'Subscription Management',
      'Unlimited Inventory/Service Management',
      'Payroll Management',
      'Reports & Analytics',
      'Payment Gateway',
      'Stock & Inventory Management',
      'Unlimited Scheduling'
    ],
    buttonText: 'Request Premium Access',
    theme: 'green'
  }
]

// ── FAQPage.tsx ─────────────────────────────────────────────────

/**
 * Questions on /faq, in CMS sort order. Edited in Directus under "FAQs".
 *
 * These feed faqPageSchema() in seo/schema.ts as well as the page itself, so
 * every published question also becomes a schema.org Question that Google can
 * show as a rich result. scripts/fetch-content.mjs enforces the rules that
 * follow from that, including that a question ends in a question mark and that
 * an answer is long enough to stand on its own.
 */
export const faqs: FAQ[] = faqsJson.faqs

/**
 * Pill colours, keyed by category name and sourced from the CMS, so adding a
 * category no longer needs a code change.
 *
 * These are hex values rather than Tailwind class names, which is the only
 * reason they can live in a database at all: a class that appears in no source
 * file is never compiled, and the pill would render unstyled.
 */
export const faqCategoryColors: FAQCategoryColorMap = Object.fromEntries(
  faqsJson.categories.map(category => [
    category.name,
    { bg: category.colorBg, color: category.colorText, border: category.colorBorder }
  ])
)

// ── AboutSection.tsx ────────────────────────────────────────────

/**
 * The photo in the left panel of the modules section, and the text of the badge
 * over it. Edited in Directus under "Modules Image". The badge's icon and the
 * module tiles below stay hardcoded, because both carry Lucide components.
 */
export const modulesImage: ModulesImage = modulesImageJson

export const modules: Module[] = [
  {
    name: 'Dashboard',
    desc: "Your spa's command center with real-time revenue and analytics.",
    icon: BarChart3,
    accent: '#2E8B35'
  },
  {
    name: 'CRM',
    desc: 'Comprehensive CRM with profiles, history, and loyalty programs.',
    icon: Users,
    accent: '#F5A800'
  },
  {
    name: 'Orders & Invoices',
    desc: 'Automated billing and payment integration.',
    icon: Receipt,
    accent: '#2E8B35'
  },
  {
    name: 'Accounting',
    desc: 'Integrated financial tools to track expenses.',
    icon: Wallet,
    accent: '#F5A800'
  },
  {
    name: 'Gift / Vouchers',
    desc: 'Customizable gift cards and vouchers.',
    icon: Gift,
    accent: '#2E8B35'
  },
  {
    name: 'HR Management',
    desc: 'Staff schedules and performance tracking.',
    icon: Users2,
    accent: '#F5A800'
  },
  {
    name: 'Stock & Inventory',
    desc: 'Real-time tracking of product usage.',
    icon: Box,
    accent: '#2E8B35'
  },
  {
    name: 'System Insights',
    desc: 'Advanced reporting for smarter decisions.',
    icon: Sparkles,
    accent: '#F5A800'
  }
]

// ── ArticlePage.tsx ─────────────────────────────────────────────

/**
 * Articles are authored in Directus and pulled in at build time by
 * scripts/fetch-content.mjs, which writes generated/articles.json. That file is
 * committed, so the build never depends on the CMS being reachable, and the
 * article list is available synchronously at module init, which is what
 * seo/routes.ts and scripts/prerender.mjs both require.
 *
 * Do not edit generated/articles.json by hand. Edit the article in Directus and
 * run `pnpm content`. See directus/README.md.
 */
export const articles: Article[] = content.articles

/**
 * Category pill colours, keyed by category name. Sourced from the CMS so adding
 * a category no longer needs a code change.
 */
export const articleCategoryColors: ArticleCategoryColorMap = Object.fromEntries(
  content.categories.map(category => [
    category.name,
    { bg: category.colorBg, color: category.colorText }
  ])
)

// ── ResourcesPage.tsx ───────────────────────────────────────────

/**
 * Cards for the /resources grid, derived from `articles` so slug, title, date
 * and image can never diverge from the article they link to. Newest first.
 */
export const blogPosts: BlogPost[] = [...articles]
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
  .map((article, i) => ({
    id: i + 1,
    slug: article.slug,
    category: article.category,
    title: article.title,
    preview: article.preview ?? article.intro,
    image: article.image,
    date: article.date,
    readTime: article.readTime
  }))
