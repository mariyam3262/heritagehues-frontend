const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE_URL || API_BASE || ''
const API_ENCRYPTION_KEY = import.meta.env.VITE_API_ENCRYPTION_KEY || ''

const SESSION_KEY = 'heritage_hues_session_id'

const getSessionId = () => {
  if (typeof window === 'undefined') return ''
  let sessionId = window.localStorage.getItem(SESSION_KEY) || ''
  if (!sessionId) {
    sessionId = `hh_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    window.localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

const useApiEncryption = Boolean(API_ENCRYPTION_KEY)
let apiCryptoKeyPromise = null

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  const padded = padding ? normalized + '='.repeat(4 - padding) : normalized
  const raw = atob(padded)
  return Uint8Array.from(raw, (char) => char.charCodeAt(0))
}

const getCryptoKey = async () => {
  if (!useApiEncryption) return null
  if (!apiCryptoKeyPromise) {
    apiCryptoKeyPromise = (async () => {
      const secretBytes = new TextEncoder().encode(API_ENCRYPTION_KEY)
      const hash = await crypto.subtle.digest('SHA-256', secretBytes)
      return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['decrypt'])
    })()
  }
  return apiCryptoKeyPromise
}

const decryptApiPayload = async (encrypted) => {
  const cipherBytes = decodeBase64Url(encrypted)
  if (cipherBytes.length < 13) {
    throw new Error('Invalid encrypted payload')
  }
  const iv = cipherBytes.slice(0, 12)
  const ciphertext = cipherBytes.slice(12)
  const cryptoKey = await getCryptoKey()
  if (!cryptoKey) {
    throw new Error('Missing API encryption key')
  }
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext)
  return JSON.parse(new TextDecoder().decode(plaintext))
}

const toPriceLabel = (value, currency = 'INR') => {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency,
  }).format(amount)
}

// Legacy - no longer used with backend calculation

const isAbsoluteUrl = (value = '') => /^https?:\/\//i.test(String(value || ''))

const isUploadPath = (value = '') => String(value || '').startsWith('/api/uploads/')

const SIGNED_QUERY_KEYS = new Set([
  'token',
  'signature',
  'sig',
  'expires',
  'x-amz-algorithm',
  'x-amz-credential',
  'x-amz-date',
  'x-amz-expires',
  'x-amz-security-token',
  'x-amz-signature',
  'x-amz-signedheaders',
  'awsaccesskeyid',
])

const normalizeSignedAssetUrl = (value = '') => {
  const source = String(value || '').trim()
  if (!source || !isAbsoluteUrl(source)) return source

  try {
    const url = new URL(source)

    if (url.pathname.includes('/storage/v1/object/sign/')) {
      url.pathname = url.pathname.replace('/storage/v1/object/sign/', '/storage/v1/object/public/')
      url.search = ''
      return url.toString()
    }

    url.pathname = url.pathname.replace(/\/s--[^/]+--\//, '/')

    for (const key of [...url.searchParams.keys()]) {
      if (SIGNED_QUERY_KEYS.has(key.toLowerCase())) {
        url.searchParams.delete(key)
      }
    }

    return url.toString()
  } catch {
    return source
  }
}

const resolveAssetUrl = (value = '') => {
  const source = String(value || '').trim()
  if (!source) return ''
  if (isAbsoluteUrl(source)) return normalizeSignedAssetUrl(source)
  if (isUploadPath(source)) {
    if (!IMAGE_BASE) return source
    return new URL(source, `${IMAGE_BASE.replace(/\/+$/, '')}/`).toString()
  }
  return source
}

const toVisualStyle = (value, fallback) => {
  if (!value) {
    return { background: fallback }
  }
  const resolvedUrl = resolveAssetUrl(value)
  if (resolvedUrl && (isUploadPath(value) || isAbsoluteUrl(resolvedUrl))) {
    return {
      backgroundColor: '#f7ead7',
      backgroundImage: `url(${resolvedUrl})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }
  }
  return { background: value }
}

const mapProduct = (item = {}) => {
  const product = item || {}
  const gradient = product.gradient || 'linear-gradient(135deg, #772920, #cf9f64)'
  const photos = Array.isArray(product.photos) ? product.photos : []
  const rawPhotos = photos.length ? photos.slice(0, 10) : [gradient]
  const resolvedPhotos = rawPhotos.map((photo) => (typeof photo === 'string' ? resolveAssetUrl(photo) : photo))
  const imagePhotos = resolvedPhotos.filter((photo) => typeof photo === 'string' && /^https?:\/\//i.test(photo))
  const mrp = Number(product.mrp || product.price || 0)
  const finalPrice = Number(product.final_price || product.price || 0)
  const discountPercent = Math.max(0, Number(product.discount_percentage || product.discount || 0))
  const stockCount = Math.max(0, Number(product.stock_count || 0))
  const isOutOfStock = Boolean(product.is_out_of_stock) || stockCount <= 0
  const bullets = Array.isArray(product.description_points) ? product.description_points.sort((a, b) => (a.order || 0) - (b.order || 0)).map((p) => p.point) : []
  return {
    id: product.id || product._id || product.slug || '',
    slug: product.slug || '',
    category: product.category || 'General',
    title: product.title || 'Unknown Product',
    description: product.description || '',
    bullets,
    mrpValue: mrp,
    mrp: toPriceLabel(mrp, item.currency),
    basePriceValue: mrp,
    basePrice: toPriceLabel(mrp, item.currency),
    discountPercent,
    hasDiscount: discountPercent > 0,
    priceValue: finalPrice,
    price: toPriceLabel(finalPrice, item.currency),
    stockCount,
    isOutOfStock,
    gradient,
    photos: resolvedPhotos,
    imagePhotos,
    primaryPhoto: imagePhotos[0] || '',
    hasImagePhoto: imagePhotos.length > 0,
    visualStyles: rawPhotos.map((photo) => toVisualStyle(photo, gradient)),
  }
}

const request = async (path, options = {}) => {
  const { headers: customHeaders = {}, cache = 'no-store', ...restOptions } = options
  const headers = {
    'Content-Type': 'application/json',
    'X-Session-Id': getSessionId(),
    ...customHeaders,
  }
  if (useApiEncryption) {
    headers['X-Use-Encryption'] = '1'
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    cache,
    headers,
  })

  const text = await response.text()
  let data = {}
  if (text) {
    try {
      data = JSON.parse(text)
    } catch (err) {
      throw new Error('Invalid JSON response')
    }
  }

  if (useApiEncryption && data && typeof data === 'object' && data.encrypted) {
    data = await decryptApiPayload(data.encrypted)
  }

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const fetchProducts = async () => {
  const data = await request('/api/products')
  return Array.isArray(data) ? data.map(mapProduct) : []
}

export const fetchProductBySlug = async (slug) => {
  const data = await request(`/api/products/${encodeURIComponent(slug)}`)
  return mapProduct(data)
}

export const createUpiIntent = async (items) =>
  request('/api/checkout/upi-intent', {
    method: 'POST',
    body: JSON.stringify({ items }),
  })

export const fetchCart = () => request('/api/cart')

export const addCartItem = (payload) =>
  request('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateCartItem = (itemRef, quantity) =>
  request(`/api/cart/items/${encodeURIComponent(itemRef)}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  })

export const removeCartItem = (itemRef) =>
  request(`/api/cart/items/${encodeURIComponent(itemRef)}`, {
    method: 'DELETE',
    body: JSON.stringify({}),
  })

export const buyNow = (payload) =>
  request('/api/buy-now', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const fetchCheckoutSummary = (sessionId, address) =>
  request('/api/checkout/summary', {
    method: 'POST',
    headers: {
      'X-Session-Id': sessionId,
    },
    body: JSON.stringify({ session_id: sessionId, address }),
  })

export const createOrder = (sessionId, address, user = null) =>
  request('/api/orders', {
    method: 'POST',
    headers: {
      'X-Session-Id': sessionId,
    },
    body: JSON.stringify({ session_id: sessionId, address, user }),
  })

export const createUser = (payload) =>
  request('/api/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const createUpiOrder = (sessionId, address, user = null) =>
  request('/api/orders/upi', {
    method: 'POST',
    headers: {
      'X-Session-Id': sessionId,
    },
    body: JSON.stringify({ session_id: sessionId, address, user }),
  })

export const fetchUpiLink = (orderId) =>
  request(`/api/payment/upi-link/${encodeURIComponent(orderId)}`)

export const confirmUpiPayment = (payload) =>
  request('/api/orders/confirm-upi', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const fetchOrderDetails = (orderId) =>
  request(`/api/order/${encodeURIComponent(orderId)}`)

export const verifyRazorpayPayment = (payload) =>
  request('/api/orders/verify-payment', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const fetchProductReviews = (slug) =>
  request(`/api/products/${encodeURIComponent(slug)}/reviews`)

export const createProductReview = (slug, payload) =>
  request(`/api/products/${encodeURIComponent(slug)}/reviews`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const uploadReviewAttachment = async (file) => {
  const formData = new FormData()
  formData.append('attachment', file)

  const response = await fetch(`${API_BASE}/api/uploads/review-images`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed')
  }
  return data
}

export const updateReview = (reviewId, payload) =>
  request(`/api/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteReview = (reviewId) =>
  request(`/api/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'DELETE',
  })

export { getSessionId }
