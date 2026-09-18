import type { LucideIcon } from 'lucide-react'

// ── CMS-managed images ──────────────────────────────────────────

/**
 * An image authored in Directus. `src` points at a copy that
 * scripts/fetch-content.mjs downloaded into public/images/cms/ at build time,
 * never at the CMS itself, so the live site has no runtime dependency on it.
 *
 * `alt` is required rather than optional: the fetch script refuses to build
 * without it, and an image that reaches this type has already been checked.
 */
export interface CmsImage {
  src: string
  alt: string
}

/** The AboutSection.tsx photo, plus the badge that sits on top of it. */
export interface ModulesImage extends CmsImage {
  /** Short label in the green pill. Its icon stays hardcoded. */
  badge: string
}

/**
 * The product demo, used by both FeaturesPage.tsx and the Hero.tsx pop-up.
 *
 * Unlike every other CMS asset the video file is NOT committed, because each
 * version would add its full size to git permanently. It is downloaded on the
 * machine that builds, so a build with no CMS access renders the player with
 * no source rather than failing.
 */
export interface DemoVideo {
  src: string
  poster: CmsImage
}

/**
 * The sales phone number and email, edited in Directus as one record and used
 * in three places: the cards on /contact, the footer of every page, and the
 * Organization contactPoint in seo/schema.ts.
 *
 * The two phone fields come from one CMS field. `salesPhone` is what a person
 * reads; `salesPhoneE164` is the same number stripped to a plus and digits,
 * which is what schema.org's `telephone` and a `tel:` link both need. They are
 * derived together at build time so they cannot drift apart.
 */
export interface ContactDetails {
  salesPhone: string
  salesPhoneE164: string
  salesEmail: string
}

// ── Features.tsx ────────────────────────────────────────────────
export interface FeatureItem {
  name: string
  icon: LucideIcon
  description: string
}

export interface FeatureGroup {
  number: string
  title: string
  description: string
  accent: string
  accentLight: string
  items: FeatureItem[]
  featured?: boolean
}

// ── Testimonials.tsx ────────────────────────────────────────────
export interface Testimonial {
  name: string
  role: string
  location: string
  content: string
  img: string
  stat: { value: string; label: string }
}

// ── PartnerSection.tsx ──────────────────────────────────────────
export interface Partner {
  title: string
  description: string
  icon: LucideIcon
  accent: string
  tag: string
  featured?: boolean
}

// ── AboutPage.tsx ───────────────────────────────────────────────
export interface Value {
  title: string
  desc: string
  icon: LucideIcon
  bgColor: string
}

// ── ResourcesPage.tsx ───────────────────────────────────────────
export interface BlogPost {
  id: number
  slug: string
  category: string
  title: string
  preview: string
  image: string
  date: string
  readTime: string
}

// ── FeaturesPage.tsx ────────────────────────────────────────────
/**
 * One module card in the /features grid.
 *
 * Split across two sources on purpose. `name`, `desc`, `img`, `imgAlt` and
 * `hidden` are authored in Directus; `icon`, `color` and `size` come from the
 * hardcoded map in data/index.ts, joined on `key`. An icon is a live component
 * reference and `color` is a Tailwind class, and a Tailwind class loaded from a
 * database is never compiled, so neither can be stored as content.
 */
export interface AnchorFeature {
  /** Immutable join key into the icon and colour map. Never edited by an author. */
  key: string
  name: string
  icon: LucideIcon
  desc: string
  size?: string
  color: string
  img: string
  imgAlt: string
  hidden?: boolean
}

export interface UtilityFeature {
  name: string
  icon: LucideIcon
  desc: string
}

export interface FeaturesPageMarqueeItem {
  text: string
  icon: LucideIcon
}

// ── PricingPage.tsx ─────────────────────────────────────────────
export interface Plan {
  id: string
  name: string
  icon: LucideIcon
  monthlyPrice: number
  tagline: string
  features: string[]
  buttonText: string
  theme: string
  popular?: boolean
}

// ── FAQPage.tsx ─────────────────────────────────────────────────
/**
 * One question on /faq, authored in Directus.
 *
 * No icon: the leading icon was removed from the design so this could be pure
 * content, which is what lets an editor add a question without a developer.
 * Every other collection with an icon needs a join key and a lookup map; this
 * one needs neither.
 *
 * These also become the FAQPage structured data in seo/schema.ts, so `answer`
 * has to read as a complete answer with no page around it.
 */
export interface FAQ {
  question: string
  answer: string
  category: string
  youtubeUrl?: string
}

export type FAQCategoryColorMap = Record<
  string,
  { bg: string; color: string; border: string }
>

// ── AboutSection.tsx ────────────────────────────────────────────
export interface Module {
  name: string
  desc: string
  icon: LucideIcon
  accent: string
}

// ── ArticlePage.tsx ─────────────────────────────────────────────

/**
 * Internal links to weave into a section's `body`. Each `text` must appear
 * verbatim in the body; the renderer swaps that run of text for a <Link>.
 */
export interface ArticleLink {
  text: string
  to: string
}

export interface ArticleSection {
  heading?: string
  body?: string
  bullets?: string[]
  links?: ArticleLink[]
}

export interface Article {
  slug: string
  category: string
  title: string
  /** Human-readable date shown in the UI, e.g. 'Oct 12, 2024'. */
  date: string
  /** ISO-8601 date, required by Article structured data and sitemap lastmod. */
  datePublished: string
  /** ISO-8601 date of the last meaningful edit. */
  dateModified: string
  author: string
  readTime: string
  image: string
  /** Overrides the <title> tag. Falls back to `title` when omitted. */
  metaTitle?: string
  /** Meta description / OG description. Falls back to `intro` when omitted. */
  metaDescription?: string
  /** Short card copy for the /resources grid. Falls back to `intro`. */
  preview?: string
  intro: string
  sections: ArticleSection[]
}

export type ArticleCategoryColorMap = Record<
  string,
  { bg: string; color: string }
>
