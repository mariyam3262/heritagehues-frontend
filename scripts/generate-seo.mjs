import fs from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')
const siteUrl = String(process.env.SEO_SITE_URL || process.env.VITE_SITE_URL || 'https://heritagehues.net').replace(/\/+$/, '')
const apiUrl = String(process.env.SEO_PRODUCTS_API_URL || process.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

const staticRoutes = [
  '/',
  '/explore',
  '/cart',
  '/checkout',
  '/profile',
]

const ensurePublicDir = async () => {
  await fs.mkdir(publicDir, { recursive: true })
}

const resolveProducts = async () => {
  if (!apiUrl) return []

  try {
    const response = await fetch(`${apiUrl}/api/products`)
    if (!response.ok) return []
    const data = await response.json()
    if (!Array.isArray(data)) return []
    return data
      .map((item) => String(item?.slug || '').trim())
      .filter(Boolean)
      .slice(0, 5000)
      .map((slug) => `/product/${encodeURIComponent(slug)}`)
  } catch {
    return []
  }
}

const buildSitemap = (routes) => {
  const urls = routes.map((route) => {
    const href = new URL(route, `${siteUrl}/`).toString()
    return `  <url>\n    <loc>${href}</loc>\n  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

const buildRobots = () => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

await ensurePublicDir()
const dynamicProductRoutes = await resolveProducts()
const allRoutes = [...new Set([...staticRoutes, ...dynamicProductRoutes])]

await fs.writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemap(allRoutes), 'utf8')
await fs.writeFile(path.join(publicDir, 'robots.txt'), buildRobots(), 'utf8')

console.log(`SEO assets generated for ${allRoutes.length} route(s).`)
