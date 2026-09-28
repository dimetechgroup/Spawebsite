import { useEffect, useState } from 'react'
import {
  loadAnchorFeatures,
  loadArticles,
  loadFaqs,
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
const resolved = new Map<() => Promise<unknown>, unknown>()

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

const useCms = <T>(load: () => Promise<T>): CmsState<T> => {
  const cached = resolved.get(load) as T | undefined
  const [state, setState] = useState<CmsState<T>>({
    data: cached ?? null,
    loading: cached === undefined,
    error: null
  })

  useEffect(() => {
    if (resolved.has(load)) return
    let active = true
    track(load())
      .then(data => {
        resolved.set(load, data)
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Could not load content'
          })
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
