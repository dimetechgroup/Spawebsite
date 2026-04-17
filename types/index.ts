import type { LucideIcon } from 'lucide-react'

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
export interface AnchorFeature {
  name: string
  icon: LucideIcon
  desc: string
  size?: string
  color: string
  img: string
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
export interface FAQ {
  question: string
  answer: string
  icon: LucideIcon
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
export interface ArticleSection {
  heading?: string
  body?: string
  bullets?: string[]
}

export interface Article {
  slug: string
  category: string
  title: string
  date: string
  readTime: string
  image: string
  intro: string
  sections: ArticleSection[]
}

export type ArticleCategoryColorMap = Record<
  string,
  { bg: string; color: string }
>
