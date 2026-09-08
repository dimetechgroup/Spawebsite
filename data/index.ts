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
  HelpCircle,
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
  ArticleCategoryColorMap
} from '../types'

import contentJson from './generated/articles.json'

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

export const featuresMarqueeItems: string[] = [
  'Market Intelligence',
  'Branded Solutions',
  'ERP Management',
  'Automated Planning',
  '24/7 Availability',
  'Always-on Analytics',
  'ERP Integration',
  'Market Intelligence',
  'Branded Solutions',
  'ERP Management',
  'Automated Planning',
  '24/7 Availability',
  'Always-on Analytics',
  'ERP Integration'
]

// ── Testimonials.tsx ────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    name: 'Elena Wambui',
    role: 'Founder, Azure Wellness Spa',
    location: 'Uganda',
    content:
      'MySpa has completely transformed the way we manage our multi-location brand. The intuitive ERP modules and real-time analytics have been total game-changers for our bottom line.',
    img: '/images/photo1.jpg',
    stat: { value: '+38%', label: 'Revenue Growth' }
  },
  {
    name: 'Mercy Nyakio',
    role: 'Managing Director, Zenith Retreats',
    location: 'Nairobi, Kenya',
    content:
      'Managing 15 locations across the coast was a nightmare before MySpa. Now I have a unified command center that handles everything from HR to high-precision inventory tracking.',
    img: '/images/photo 2.avif',
    stat: { value: '15×', label: 'Locations Managed' }
  },
  {
    name: 'Dr. Samuel Gitonga',
    role: 'Director, Holistic Medical Spa',
    location: 'Mombasa, Kenya',
    content:
      'The level of detail in the client management system is unparalleled. We track preferences and medical history with the security and precision our clinic demands.',
    img: '/images/photo 3.webp',
    stat: { value: '100%', label: 'Compliance Rate' }
  },
  {
    name: 'Sarah Wahome',
    role: 'CEO, Luminos Day Spa Group',
    location: 'Tanzania',
    content:
      "Switching to MySpa was the best operational decision we've made. Booking rates are up, staff scheduling is seamless, and clients consistently remark on the improved experience.",
    img: '/images/photo 4.webp',
    stat: { value: '+52%', label: 'Booking Rate' }
  }
]

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

export const anchorFeatures: AnchorFeature[] = [
  {
    name: 'Dashboard',
    icon: LayoutGrid,
    desc: "Your spa's command center. Get a real-time overview of revenue, customers, payments, orders and inventory, all in one intuitive dashboard.",
    size: 'lg',
    color: 'bg-[#207D40]',
    img: '/images/Dashboard.png'
  },
  {
    name: 'CRM',
    icon: Users,
    desc: 'Manage client profiles, preferences, and history. Build loyalty programs, track visits, and personalize experiences.',
    size: 'sm',
    color: 'bg-[#F7A300]',
    img: '/images/CRM.png'
  },
  {
    name: 'Orders & Invoices',
    icon: Receipt,
    desc: 'Simplify billing with automated invoices, order tracking, and payment integration for smooth transactions.',
    size: 'sm',
    color: 'bg-[#207D40]',
    img: '/images/Orders.png'
  },
  {
    name: 'Accounting',
    icon: Wallet,
    desc: 'Stay on top of finances with integrated accounting tools. Track expenses, revenue, and profitability with ease. Generate reports for smarter decisions.',
    size: 'md',
    color: 'bg-[#F7A300]',
    img: '/images/Accounts.png'
  },
  {
    name: 'Stock & Inventory',
    icon: Package,
    desc: 'Track product usage, supplier orders, and stock levels in real time to minimize waste and optimize costs.',
    color: 'bg-[#207D40]',
    img: '/images/Stocks.png',
    hidden: true
  },
  {
    name: 'Reports & Analytics',
    icon: BarChart3,
    desc: 'Turn raw data into actionable insight. Generate detailed reports on revenue, staff performance, and client trends.',
    color: 'bg-[#F7A300]',
    img: '/images/Report.png',
    hidden: true
  },
  {
    name: 'HR Management',
    icon: UserCheck,
    desc: 'Manage staff schedules, attendance, payroll, and performance, tailored for the unique rhythms of spa operations.',
    color: 'bg-[#207D40]',
    img: '/images/HR.png',
    hidden: true
  }
]

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
      'One-off Onboarding: KES 30,000',
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
      'One-off Onboarding: KES 40,000',
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
      'One-off Onboarding: KES 50,000',
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

export const faqs: FAQ[] = [
  {
    question: 'What is Myspa ERP System?',
    answer:
      'MySpa ERP System is a cloud-based Spa Management Software designed exclusively for spas. It is a complete Spa ERP solution that integrates bookings, client management, accounting, HR, inventory, billing, reporting, and gift vouchers into one unified platform. Unlike basic booking tools, it provides full operational visibility and business control.',
    icon: Sparkles,
    category: 'General',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    question: 'How do I get started with Myspa?',
    answer:
      'To get started with MySpa ERP System, request a demo, select a suitable subscription plan, and complete onboarding with our support team. Since MySpa is cloud-based, no installation is required. You can access your Spa ERP system securely from any device with internet access.',
    icon: Zap,
    category: 'Getting Started'
  },
  {
    question: 'How much does Myspa ERP System cost?',
    answer:
      "The cost of MySpa ERP System depends on the number of users, branches, and required modules. Pricing is subscription-based and tailored to your spa's size and operational needs. Contact us for a customized quote based on your business structure.",
    icon: CreditCard,
    category: 'Pricing'
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer:
      'Yes, MySpa ERP System operates on a subscription model. You may cancel according to your agreed billing terms. We prioritize flexibility while building long-term partnerships with spa businesses.',
    icon: HelpCircle,
    category: 'Billing'
  },
  {
    question: 'Is Myspa ERP System secure?',
    answer:
      'Yes, MySpa ERP System is built on secure cloud infrastructure with encrypted data storage, role-based access control, secure authentication, and regular system updates. Your client data, financial records, and operational information remain protected at all times.',
    icon: ShieldCheck,
    category: 'Security'
  },
  {
    question: 'How does the Myspa ERP dashboard work?',
    answer:
      'The MySpa ERP dashboard provides real-time visibility into revenue, client visits, payments, inventory levels, staff activity, and profitability. It acts as a centralized command center, helping spa owners make data-driven decisions using live performance analytics.',
    icon: Sparkles,
    category: 'Features'
  },
  {
    question: 'How does the Client Module work?',
    answer:
      'The Client Module helps you manage customer profiles, visit history, preferences, and loyalty information in one place. You get a complete 360° view of every client, enabling personalized service and stronger retention.',
    icon: HelpCircle,
    category: 'Features'
  },
  {
    question: 'How are customer orders created?',
    answer:
      'Customer orders are created, managed, and linked to billing and inventory inside the MySpa ERP system seamlessly. From service selection to payment, the entire order lifecycle is tracked in real time.',
    icon: HelpCircle,
    category: 'Features'
  },
  {
    question: 'How does the Stock & Inventory Module work?',
    answer:
      "MySpa tracks product usage, monitors stock levels, manages suppliers, and prevents shortages through smart inventory control. You'll receive alerts before stock runs out and can generate purchase orders directly from the system.",
    icon: HelpCircle,
    category: 'Features'
  },
  {
    question: 'How do gift cards and vouchers work?',
    answer:
      'You can create, sell, and redeem gift cards and vouchers to increase spa revenue and customer engagement. The system tracks redemption history and balances automatically, making it effortless to run promotions.',
    icon: Gift,
    category: 'Features'
  },
  {
    question: 'How does the HR Management Module work?',
    answer:
      'MySpa manages staff schedules, attendance, payroll tracking, and performance incentives in one integrated HR system. Team leads get full visibility into workforce productivity without juggling spreadsheets.',
    icon: Users,
    category: 'Features'
  },
  {
    question: 'How does Myspa help manage daily spa operations?',
    answer:
      'MySpa ERP System centralizes bookings, billing, HR, inventory, accounting, and reporting into one integrated Spa Operations System. This eliminates disconnected tools and improves workflow efficiency across your entire spa business.',
    icon: Zap,
    category: 'Operations'
  },
  {
    question: 'How does Myspa improve business performance?',
    answer:
      'MySpa improves business performance by providing real-time data, financial visibility, and structured reporting. Spa owners can identify profitable services, reduce inefficiencies, improve staff productivity, and scale confidently using actionable insights.',
    icon: Sparkles,
    category: 'Growth'
  }
]

export const faqCategoryColors: FAQCategoryColorMap = {
  General: { bg: '#f0fdf4', color: '#207D40', border: '#bbf7d0' },
  'Getting Started': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  Pricing: { bg: '#fefce8', color: '#d97706', border: '#fde68a' },
  Billing: { bg: '#fdf4ff', color: '#9333ea', border: '#e9d5ff' },
  Security: { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },
  Features: { bg: '#f0fdf4', color: '#207D40', border: '#bbf7d0' },
  Operations: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  Growth: { bg: '#f0fdf4', color: '#207D40', border: '#bbf7d0' }
}

// ── AboutSection.tsx ────────────────────────────────────────────

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
