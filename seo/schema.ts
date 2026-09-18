import { articles, contactDetails, faqs, plans } from '@/data'
import type { Article } from '@/types'
import { SITE_NAME, SITE_URL, absoluteUrl } from './routes'

const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`
const SOFTWARE_ID = `${SITE_URL}/#software`

export const organizationSchema = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  legalName: 'Dimetech Group Ltd',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/images/MYSPA.png'),
    width: 877,
    height: 297
  },
  description:
    'All-in-one spa and salon management software built exclusively for spas, serving Kenya and East Africa.',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Dimetech Group Ltd',
    url: 'https://dimetechgroup.com/'
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Karen Office Park, Karen',
    addressLocality: 'Nairobi',
    postalCode: '00502',
    addressCountry: 'KE'
  },
  areaServed: [
    { '@type': 'Country', name: 'Kenya' },
    { '@type': 'Country', name: 'Uganda' },
    { '@type': 'Country', name: 'Tanzania' }
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    // E.164, which is what schema.org expects. Derived from the single number
    // in the CMS rather than written out again, so the number search engines
    // publish can never drift from the one on the page.
    telephone: contactDetails.salesPhoneE164,
    email: contactDetails.salesEmail,
    contactType: 'sales',
    areaServed: 'KE',
    availableLanguage: ['en']
  }
})

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-KE'
})

/** Offers built from the real KES plan prices on /pricing. */
const planOffers = () =>
  plans.map(plan => ({
    '@type': 'Offer',
    name: `${plan.name} Plan`,
    description: plan.tagline,
    price: plan.monthlyPrice,
    priceCurrency: 'KES',
    url: `${SITE_URL}/pricing`,
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: plan.monthlyPrice,
      priceCurrency: 'KES',
      billingDuration: 1,
      billingIncrement: 1,
      unitCode: 'MON'
    }
  }))

export const softwareApplicationSchema = () => ({
  '@type': 'SoftwareApplication',
  '@id': SOFTWARE_ID,
  name: 'MySpa Spa Management Software',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Spa & Salon Management Software',
  operatingSystem: 'Web-based (any modern browser)',
  url: `${SITE_URL}/`,
  description:
    'Cloud-based spa and salon management software covering appointment booking, POS, customer management, inventory, payroll, accounting and reporting.',
  featureList: [
    'Appointment scheduling',
    'Point of sale and invoicing',
    'Customer management (CRM)',
    'Inventory and stock control',
    'Payroll and HR management',
    'Accounting',
    'Gift vouchers and subscriptions',
    'Reports and analytics',
    'Multi-branch management'
  ],
  publisher: { '@id': ORG_ID },
  offers: planOffers()
})

/** Product + Offers for /pricing. */
export const pricingSchema = () => ({
  '@type': 'Product',
  name: 'MySpa Spa Management Software',
  description:
    'Spa and salon management software subscription plans for Kenyan businesses, from KES 3,000 per month with a 15-day free trial.',
  image: absoluteUrl('/images/Dashboard.png'),
  brand: { '@id': ORG_ID },
  offers: planOffers()
})

export const faqPageSchema = () => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
})

export const articleSchema = (article: Article) => ({
  '@type': 'Article',
  headline: article.title.slice(0, 110),
  description: article.metaDescription ?? article.intro,
  image: absoluteUrl(article.image),
  datePublished: article.datePublished,
  dateModified: article.dateModified,
  author: { '@type': 'Organization', name: article.author, '@id': ORG_ID },
  publisher: { '@id': ORG_ID },
  articleSection: article.category,
  inLanguage: 'en-KE',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/resources/${article.slug}`
  }
})

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path)
  }))
})

/** Blog index: an ItemList of every published article. */
export const blogListSchema = () => ({
  '@type': 'Blog',
  '@id': `${SITE_URL}/resources#blog`,
  name: 'MySpa Resources',
  url: `${SITE_URL}/resources`,
  publisher: { '@id': ORG_ID },
  blogPost: articles.map(article => ({
    '@type': 'BlogPosting',
    headline: article.title.slice(0, 110),
    url: `${SITE_URL}/resources/${article.slug}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: absoluteUrl(article.image),
    author: { '@type': 'Organization', name: article.author }
  }))
})

/**
 * Wraps one or more schema objects into a single @graph document, which is the
 * form Google prefers when a page carries several linked entities.
 */
export const graph = (...nodes: object[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes
})
