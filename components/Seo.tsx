import { useEffect } from 'react'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  routeMetaFor
} from '@/seo/routes'

export interface SeoProps {
  /** Route path used to look up defaults and build the canonical URL. */
  path: string
  /** Overrides the title from seo/routes.ts. */
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  /** JSON-LD object, or several. Replaces any previously injected blocks. */
  jsonLd?: object | object[]
  /** ISO-8601. Emitted as article:published_time when type is 'article'. */
  publishedTime?: string
  /** ISO-8601. Emitted as article:modified_time when type is 'article'. */
  modifiedTime?: string
}

const JSONLD_MARK = 'data-seo-jsonld'

/** Finds a head tag by selector, or creates it. Never duplicates. */
const upsert = (selector: string, create: () => HTMLElement): HTMLElement => {
  const existing = document.head.querySelector<HTMLElement>(selector)
  if (existing) return existing
  const created = create()
  document.head.appendChild(created)
  return created
}

const setMeta = (
  keyAttr: 'name' | 'property',
  key: string,
  content: string
) => {
  const el = upsert(`meta[${keyAttr}="${key}"]`, () => {
    const meta = document.createElement('meta')
    meta.setAttribute(keyAttr, key)
    return meta
  })
  el.setAttribute('content', content)
}

const removeMeta = (keyAttr: 'name' | 'property', key: string) => {
  document.head.querySelector(`meta[${keyAttr}="${key}"]`)?.remove()
}

const Seo: React.FC<SeoProps> = ({
  path,
  title,
  description,
  image,
  type,
  noindex,
  jsonLd,
  publishedTime,
  modifiedTime
}) => {
  const route = routeMetaFor(path)

  const resolvedTitle = title ?? route?.title ?? SITE_NAME
  const resolvedDescription = description ?? route?.description ?? ''
  const resolvedImage = absoluteUrl(image ?? route?.ogImage ?? DEFAULT_OG_IMAGE)
  const resolvedType = type ?? route?.ogType ?? 'website'
  const resolvedNoindex = noindex ?? route?.noindex ?? false
  const canonical = absoluteUrl(path)
  const serialisedJsonLd = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    document.title = resolvedTitle

    setMeta('name', 'description', resolvedDescription)
    setMeta(
      'name',
      'robots',
      resolvedNoindex ? 'noindex, follow' : 'index, follow'
    )

    const canonicalEl = upsert('link[rel="canonical"]', () => {
      const link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      return link
    })
    canonicalEl.setAttribute('href', canonical)

    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:locale', 'en_KE')
    setMeta('property', 'og:type', resolvedType)
    setMeta('property', 'og:title', resolvedTitle)
    setMeta('property', 'og:description', resolvedDescription)
    setMeta('property', 'og:image', resolvedImage)
    setMeta('property', 'og:url', canonical)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', resolvedTitle)
    setMeta('name', 'twitter:description', resolvedDescription)
    setMeta('name', 'twitter:image', resolvedImage)

    if (resolvedType === 'article' && publishedTime) {
      setMeta('property', 'article:published_time', publishedTime)
      setMeta(
        'property',
        'article:modified_time',
        modifiedTime ?? publishedTime
      )
    } else {
      removeMeta('property', 'article:published_time')
      removeMeta('property', 'article:modified_time')
    }

    document.head
      .querySelectorAll(`script[${JSONLD_MARK}]`)
      .forEach(node => node.remove())

    if (serialisedJsonLd) {
      const script = document.createElement('script')
      script.setAttribute('type', 'application/ld+json')
      script.setAttribute(JSONLD_MARK, '')
      script.textContent = serialisedJsonLd
      document.head.appendChild(script)
    }
  }, [
    resolvedTitle,
    resolvedDescription,
    resolvedImage,
    resolvedType,
    resolvedNoindex,
    canonical,
    serialisedJsonLd,
    publishedTime,
    modifiedTime
  ])

  return null
}

export default Seo
