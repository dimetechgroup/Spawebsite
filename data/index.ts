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
  Partner,
  Value,
  UtilityFeature,
  FeaturesPageMarqueeItem,
  Plan,
  Module
} from '../types'

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

// ── FeaturesPage.tsx ────────────────────────────────────────────

/**
 * Icon, colour and grid size for each module card, keyed by the `key` field on
 * the matching item in Cockpit. cms/content.ts joins these onto the cards.
 *
 * None of these three can live in the CMS. `icon` is a live Lucide component
 * reference, and `color` is a Tailwind class: Tailwind builds its stylesheet by
 * scanning source files, so `bg-[#207D40]` arriving from the CMS would appear
 * in no source file, compile to no CSS rule, and leave the card unstyled with
 * no error anywhere. `size` is layout, not content.
 *
 * A card published in Cockpit with a key missing here is left off the page, so
 * add its entry before publishing a new module.
 */
export const anchorFeatureStyles: Record<
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
