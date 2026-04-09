export const DEFAULT_PRODUCT_IMAGE = '/default-product.svg'

export const withFallbackImage = (value = '') => String(value || '').trim() || DEFAULT_PRODUCT_IMAGE

export const applyImageFallback = (event) => {
  const image = event?.target
  if (!(image instanceof HTMLImageElement)) return
  if (image.dataset.fallbackApplied === 'true') return
  image.dataset.fallbackApplied = 'true'
  image.src = DEFAULT_PRODUCT_IMAGE
}

export const backgroundImageWithFallback = (value = '') => {
  const source = String(value || '').trim()
  const fallback = `url("${DEFAULT_PRODUCT_IMAGE}")`
  if (!source) return fallback
  return `url("${source}"), ${fallback}`
}
