import { useHead } from '@unhead/vue'
import { DEFAULT_PRODUCT_IMAGE } from './utils/imageFallback'

const SITE_NAME = 'Heritage Hues'
const DEFAULT_DESCRIPTION =
  'Heritage Hues brings handcrafted Bandhani sarees and drapes with artisan-led design, premium presentation, and secure checkout.'
const DEFAULT_KEYWORDS = [
  'Bandhani saree',
  'Bandhani online',
  'Heritage Hues',
  'Gujarati tie dye saree',
  'artisan sarees',
  'Indian ethnic wear',
]

const resolveSiteUrl = () => {
  const configured = String(import.meta.env.VITE_SITE_URL || '').trim()
  if (configured) return configured.replace(/\/+$/, '')
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '')
  }
  return 'https://heritagehues.net'
}

const absoluteUrl = (path = '/') => {
  const siteUrl = resolveSiteUrl()
  return new URL(path || '/', `${siteUrl}/`).toString()
}

export const useSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_PRODUCT_IMAGE,
  type = 'website',
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonical = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)
  const keywordContent = Array.isArray(keywords) ? keywords.join(', ') : String(keywords || '')

  useHead({
    title: fullTitle,
    link: [
      { rel: 'canonical', href: canonical },
    ],
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywordContent },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:type', content: type },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
    ],
  })
}

export const defaultSeo = {
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  siteName: SITE_NAME,
}
