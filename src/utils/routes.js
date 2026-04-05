const normalizeSegment = (value = '') =>
  String(value || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')

export const buildProductPath = (slug = '') => `/product/${encodeURIComponent(normalizeSegment(slug))}`

export const buildOrderPath = (orderId = '') => `/order/${encodeURIComponent(normalizeSegment(orderId))}`

export const buildCheckoutPath = (sessionId = '') => {
  const clean = normalizeSegment(sessionId)
  return clean ? `/checkout/${encodeURIComponent(clean)}` : '/checkout'
}

export const buildCheckoutSuccessPath = (orderId = '') => {
  const clean = normalizeSegment(orderId)
  return clean ? `/checkout/success/${encodeURIComponent(clean)}` : '/checkout/success'
}

export const getPathSegments = (pathname) => {
  const source = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
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
