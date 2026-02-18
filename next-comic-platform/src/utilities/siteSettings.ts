import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

import type { Media, SiteSetting } from '@/payload-types'

const DEFAULT_SITE_TITLE = 'Hell Versus You'

const toAbsoluteURL = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${getServerSideURL()}${url}`
}

export const getCachedSiteSettings = () => getCachedGlobal('site-settings', 1)

export const getSiteTitle = (settings?: SiteSetting | null): string => {
  return settings?.siteTitle?.trim() || DEFAULT_SITE_TITLE
}

export const getSiteFaviconURL = (settings?: SiteSetting | null): string | null => {
  const favicon = settings?.favicon
  if (!favicon || typeof favicon !== 'object') return null

  const media = favicon as Media
  return toAbsoluteURL(media.url)
}

export const buildTabTitle = (siteTitle: string, pageTitle?: string | null): string => {
  if (!pageTitle || pageTitle.trim() === '') return siteTitle
  return `${pageTitle} | ${siteTitle}`
}
