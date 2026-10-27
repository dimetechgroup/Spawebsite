import { useEffect, useState } from 'react'
import {
  type CmsLoader,
  loadAnchorFeatures,
  loadArticles,
  loadFaqs,
  loadPlans,
  loadSiteSettings,
  loadTestimonials
} from './content'

export interface CmsState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Results already fetched this page load, so navigating back to a page renders
 * its content immediately instead of flashing the loading state again.
 */
const resolved = new Map<CmsLoader<unknown>, unknown>()

/**
 * The raw responses a prerendered page was built from, by loader key. With them
 * the first render reproduces the static HTML exactly, so index.tsx can hydrate
 * it instead of starting over. They are only a starting point: each loader still
 * fetches once the page is up, so an edit in Cockpit shows on the next page load
 * without a rebuild.
 */
let snapshot: Record<string, unknown> = {}
const fromSnapshot = new Map<CmsLoader<unknown>, unknown>()

export const seedCms = (raw: Record<string, unknown>) => {
  snapshot = raw
}

const snapshotData = <T>(load: CmsLoader<T>): T | undefined => {
  if (!(load.key in snapshot)) return undefined
  if (!fromSnapshot.has(load)) fromSnapshot.set(load, load.map(snapshot[load.key]))
  return fromSnapshot.get(load) as T
}

/** Loaders rendered this page load, recorded during render so a render to HTML counts too. */
const used = new Set<CmsLoader<unknown>>()

/** What scripts/prerender.mjs embeds in a page: the raw responses it rendered with. */
export const cmsSnapshot = () =>
  Object.fromEntries([...used].filter(load => load.raw() !== undefined).map(load => [load.key, load.raw()]))

/**
 * Marks the document while CMS requests are in flight, and when one fails, so
 * scripts/prerender.mjs can wait for real content instead of guessing from
 * network activity, and refuse to snapshot a page whose content never came.
 */
let pending = 0
const track = <T>(promise: Promise<T>): Promise<T> => {
  const root = document.documentElement
  pending += 1
  root.setAttribute('data-cms-pending', '')
  return promise
    .catch(err => {
      root.setAttribute('data-cms-error', err instanceof Error ? err.message : String(err))
      throw err
    })
    .finally(() => {
      pending -= 1
      if (pending === 0) root.removeAttribute('data-cms-pending')
    })
}

const useCms = <T>(load: CmsLoader<T>): CmsState<T> => {
  used.add(load)
  const initial = (resolved.get(load) as T | undefined) ?? snapshotData(load)
  const [state, setState] = useState<CmsState<T>>({
    data: initial ?? null,
    loading: initial === undefined,
    error: null
  })

  useEffect(() => {
    let active = true
    const show = (data: T) => {
      if (active) setState(prev => (prev.data === data ? prev : { data, loading: false, error: null }))
    }
    if (resolved.has(load)) {
      // Fresh content may have landed between this render and now.
      show(resolved.get(load) as T)
      return
    }
    track(load())
      .then(fresh => {
        // Unchanged since the prerender: keep the content already on screen, so nothing re-renders.
        const unchanged = JSON.stringify(load.raw()) === JSON.stringify(snapshot[load.key])
        const data = (unchanged && snapshotData(load)) || fresh
        resolved.set(load, data)
        show(data)
      })
      .catch((err: unknown) => {
        // Content from the snapshot stays up: slightly stale beats an error.
        if (active) {
          setState(prev =>
            prev.data !== null
              ? prev
              : { data: null, loading: false, error: err instanceof Error ? err.message : 'Could not load content' }
          )
        }
      })
    return () => {
      active = false
    }
  }, [load])

  return state
}

export const useSiteSettings = () => useCms(loadSiteSettings)
export const useArticles = () => useCms(loadArticles)
export const useTestimonials = () => useCms(loadTestimonials)
export const useAnchorFeatures = () => useCms(loadAnchorFeatures)
export const useFaqs = () => useCms(loadFaqs)
export const usePlans = () => useCms(loadPlans)
