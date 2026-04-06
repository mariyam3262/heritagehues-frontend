const normalizeSegment = (value = '') =>
  String(value || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')

const getEntryPath = () => {
  if (typeof window === 'undefined') return '/'
  const pathname = String(window.location.pathname || '/')
  return pathname.toLowerCase().endsWith('.html') ? pathname : '/'
}

const buildQueryPath = (page = '', params = {}) => {
  const search = new URLSearchParams()
  if (page) search.set('page', normalizeSegment(page).toLowerCase())
  Object.entries(params).forEach(([key, value]) => {
    const normalized = normalizeSegment(value)
    if (normalized) search.set(key, normalized)
  })
  const query = search.toString()
  return query ? `${getEntryPath()}?${query}` : getEntryPath()
}

export const getCurrentPage = () => {
  if (typeof window === 'undefined') return '/'
  const params = new URLSearchParams(window.location.search)
  const page = normalizeSegment(params.get('page')).toLowerCase()
  if (page === 'checkout-success') return '/checkout/success'
  if (page) return `/${page}`

  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/'
  if (pathname === '/index.html') return '/'
  return pathname
}

export const buildHomePath = () => buildQueryPath('')

export const buildExplorePath = () => buildQueryPath('explore')

export const buildCartPath = () => buildQueryPath('cart')

export const buildProfilePath = () => buildQueryPath('profile')

export const buildProductPath = (slug = '') => buildQueryPath('product', { item: slug })

export const buildOrderPath = (orderId = '') => buildQueryPath('order', { id: orderId })

export const buildCheckoutPath = (sessionId = '') => {
  const clean = normalizeSegment(sessionId)
  return buildQueryPath('checkout', clean ? { session_id: clean } : {})
}

export const buildCheckoutSuccessPath = (orderId = '') => {
  const clean = normalizeSegment(orderId)
  return buildQueryPath('checkout-success', clean ? { order_id: clean } : {})
}

export const getPathSegments = (pathname) => {
  const source = pathname ?? getCurrentPage()
  return String(source || '/')
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
}

export const getCurrentProductSlug = () => {
  const segments = getPathSegments()
  if (segments[0] === 'product' && segments[1]) {
    return decodeURIComponent(segments[1])
  }
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('item') || ''
}

export const getCurrentOrderId = () => {
  const segments = getPathSegments()
  if (segments[0] === 'order' && segments[1]) {
    return decodeURIComponent(segments[1])
  }
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('id')
    || new URLSearchParams(window.location.search).get('order_id')
    || ''
}

export const getCurrentCheckoutSessionId = () => {
  const segments = getPathSegments()
  if (segments[0] === 'checkout' && segments[1] && segments[1] !== 'success') {
    return decodeURIComponent(segments[1])
  }
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('session_id') || ''
}

export const getCurrentCheckoutSuccessOrderId = () => {
  const segments = getPathSegments()
  if (segments[0] === 'checkout' && segments[1] === 'success' && segments[2]) {
    return decodeURIComponent(segments[2])
  }
  return getCurrentOrderId()
}

export const replaceWithPath = (path) => {
  if (typeof window === 'undefined' || !path) return
  const current = `${window.location.pathname}${window.location.search}`
  if (current !== path) {
    window.location.replace(path)
  }
}
