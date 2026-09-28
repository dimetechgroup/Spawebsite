/**
 * The Cockpit client. Every page reads its content from cms.myspa.co.ke in the
 * browser at runtime, so an edit in Cockpit shows on the site on the next page
 * load with no rebuild.
 *
 * The API key ships in the JavaScript bundle, so anyone can read it. It MUST
 * belong to a Cockpit role with read-only access to the content models;
 * a key that can create or update would let any visitor edit the site.
 */
const COCKPIT_URL = (import.meta.env.VITE_COCKPIT_URL ?? 'https://cms.myspa.co.ke').replace(/\/+$/, '')
const COCKPIT_API_KEY = import.meta.env.VITE_COCKPIT_API_KEY ?? ''

/** Cockpit's asset record, as stored in an Asset field. */
export interface CockpitAsset {
  _id: string
  path: string
  title?: string
  mime?: string
}

export const cmsGet = async <T>(path: string, query: Record<string, unknown> = {}): Promise<T> => {
  const qs = new URLSearchParams(
    Object.entries(query).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)])
  ).toString()
  const res = await fetch(`${COCKPIT_URL}/api${path}${qs ? `?${qs}` : ''}`, {
    headers: { 'api-key': COCKPIT_API_KEY, Accept: 'application/json' }
  })
  if (!res.ok) throw new Error(`CMS ${res.status} on ${path}`)
  return res.json() as Promise<T>
}

/** Published items of a collection, oldest first, so Cockpit's creation order is the site's order. */
export const cmsItems = <T>(model: string, sort: Record<string, 1 | -1> = { _created: 1 }) =>
  cmsGet<T[]>(`/content/items/${model}`, { filter: { _state: 1 }, sort })

export const cmsSingleton = <T>(model: string) => cmsGet<T>(`/content/item/${model}`)

/** Public URL of an uploaded asset, or '' when the field is empty. */
export const assetUrl = (asset?: CockpitAsset | null): string =>
  asset?.path ? `${COCKPIT_URL}/storage/uploads${asset.path}` : ''
