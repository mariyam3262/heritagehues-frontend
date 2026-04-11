<template>
  <main class="product-page">
    <div v-if="showToast" class="toast" role="status" aria-live="polite">{{ toastMessage }}</div>

    <header class="top-row">
      <a class="back-link" :href="explorePath">Back to Explore</a>
      <div class="top-right">
        <p class="brand">Heritage Hues</p>
        <a class="header-profile" :href="profilePath" aria-label="Open profile">
          <span class="profile-icon" aria-hidden="true">👤</span>
        </a>
        <a class="header-cart" :href="cartPath" aria-label="Open cart">
          <span class="cart-icon" aria-hidden="true">🛒</span>
          <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
        </a>
      </div>
    </header>

    <p v-if="loading" class="status-line">Loading product...</p>
    <p v-else-if="error" class="status-line error">{{ error }}</p>

    <section v-else-if="selectedProduct" class="product-hero">
      <div
        class="visual-slider"
        :class="{ multi: selectedProduct.photos.length > 1 }"
        aria-label="Product image gallery"
      >
        <div v-if="selectedProduct.photos.length > 1" class="slider-topbar">
          <span class="media-count">
            {{ String(activePhotoIndex + 1).padStart(2, '0') }} /
            {{ String(selectedProduct.photos.length).padStart(2, '0') }}
          </span>
          <div class="media-progress" aria-hidden="true">
            <span
              :style="{ width: `${((activePhotoIndex + 1) / selectedProduct.photos.length) * 100}%` }"
            ></span>
          </div>
        </div>

        <div class="visual-window">
          <div
            class="visual-track"
            :style="{ transform: `translateX(-${activePhotoIndex * 100}%)` }"
          >
            <template
              v-for="(photo, index) in selectedProduct.photos"
              :key="`${selectedProduct.slug}-${index}`"
            >
              <div class="visual-slide">
                <img
                  v-if="isUrl(photo) && !hasPhotoFailed(index)"
                  class="product-visual product-image"
                  :src="getPhotoSrc(photo, index)"
                  :alt="`${selectedProduct.title} image ${index + 1}`"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                  @error="handleProductImageError(index, $event)"
                />
                <!-- Fallback: CSS gradient swatch when photo failed or not a URL -->
                <div
                  v-else
                  class="product-visual"
                  :style="selectedProduct.visualStyles[index]"
                  role="img"
                  :aria-label="`${selectedProduct.title} image ${index + 1}`"
                ></div>
                <div v-if="hasPhotoFailed(index) && isUrl(photo)" class="image-recovery-actions">
                  <button
                    type="button"
                    class="retry-btn"
                    @click="retryPhoto(index)"
                  >
                    Retry Image
                  </button>
                  <button
                    type="button"
                    class="offline-download-btn"
                    @click="downloadPhoto(photo, index)"
                  >
                    Download Offline
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>

        <button
          v-if="selectedProduct.photos.length > 1"
          class="gallery-btn prev"
          type="button"
          aria-label="Previous product image"
          @click="prevPhoto"
        >
          &#8249;
        </button>
        <button
          v-if="selectedProduct.photos.length > 1"
          class="gallery-btn next"
          type="button"
          aria-label="Next product image"
          @click="nextPhoto"
        >
          &#8250;
        </button>

        <div
          v-if="selectedProduct.photos.length > 1"
          class="gallery-thumbs"
          aria-label="Product image thumbnails"
        >
          <button
            v-for="(photo, index) in selectedProduct.photos"
            :key="`thumb-${index}`"
            type="button"
            class="gallery-thumb"
            :class="{ active: activePhotoIndex === index }"
            :aria-label="`Go to image ${index + 1}`"
            @click="activePhotoIndex = index"
          >
            <img
              v-if="isUrl(photo) && !hasPhotoFailed(index)"
              class="gallery-thumb-image"
              :src="getPhotoSrc(photo, index)"
              :alt="`${selectedProduct.title} thumbnail ${index + 1}`"
              loading="lazy"
              decoding="async"
              @error="handleThumbError(index, $event)"
            />
            <span
              v-else
              class="gallery-thumb-image"
              :style="selectedProduct.visualStyles[index]"
            ></span>
          </button>
        </div>
      </div>

      <article class="product-content">
        <p class="category">{{ selectedProduct.category }}</p>
        <h1>{{ selectedProduct.title }}</h1>

        <div class="attention-row">
          <span v-if="selectedProduct.hasDiscount" class="attention-pill subtle">
            {{ selectedProduct.discountPercent }}% off
          </span>
          <span
            v-if="!selectedProduct.isOutOfStock && selectedProduct.stockCount <= 3"
            class="attention-pill scarce"
          >
            Limited design drop
          </span>
        </div>

        <div class="price-block">
          <div class="main-price">
            <p v-if="selectedProduct.hasDiscount" class="price-headline">
              <span class="discount-chip">{{ selectedProduct.discountPercent }}% OFF</span>
              <span class="price">{{ selectedProduct.price }}</span>
            </p>
            <p v-else class="price-headline">
              <span class="price">{{ selectedProduct.price }}</span>
            </p>
            <p v-if="selectedProduct.hasDiscount" class="mrp-line">
              <span class="mrp-label">M.R.P.</span>
              <span class="prev-price">{{ selectedProduct.mrp }}</span>
            </p>
            <div class="price-notes">
              <small>Inclusive of all taxes</small>
              <small>Free Delivery</small>
              <small>Premium Packaging Included</small>
            </div>
          </div>
        </div>

        <p
          v-if="selectedProduct.isOutOfStock || selectedProduct.stockCount <= 3"
          class="stock-state"
          :class="{
            sold: selectedProduct.isOutOfStock,
            scarce: !selectedProduct.isOutOfStock && selectedProduct.stockCount === 1,
          }"
        >
          {{
            selectedProduct.isOutOfStock
              ? 'Out of stock'
              : selectedProduct.stockCount === 1
                ? 'Only 1 left in stock'
                : `${selectedProduct.stockCount} left in stock`
          }}
        </p>
        <p
          v-if="!selectedProduct.isOutOfStock && selectedProduct.stockCount <= 3"
          class="scarcity-copy"
        >
          {{
            selectedProduct.stockCount === 1
              ? 'This Bandhani design is nearly sold out and may not be restocked in the same pattern.'
              : `This Bandhani design is part of a limited batch. Only ${selectedProduct.stockCount} pieces remain in this drop.`
          }}
        </p>

        <ul class="points inline-points" v-if="descriptionPoints.length">
          <li v-for="(point, index) in descriptionPoints" :key="index">
            <span class="bullet-icon" aria-hidden="true">✦</span>
            {{ point }}
          </li>
        </ul>

        <section class="detail-card heritage-card" aria-labelledby="bandhani-story-title">
          <h2 id="bandhani-story-title">About Bandhani</h2>
          <p>
            Bandhani is a traditional tie-dye textile art from Gujarat and Rajasthan, created by
            carefully tying tiny points on fabric before dyeing to reveal intricate dotted patterns.
          </p>
          <p>
            Each piece carries the quiet character of handcrafted work, with subtle variations that
            make every drape feel personal and refined.
          </p>
        </section>

        <div class="cta-row">
          <button
            type="button"
            class="btn add"
            :disabled="selectedProduct.isOutOfStock"
            @click="handleAddToCart"
          >
            Add to Cart
          </button>
          <button
            type="button"
            class="btn buy"
            :disabled="isBuyingNow || selectedProduct.isOutOfStock"
            @click="handleBuyNow"
          >
            {{ isBuyingNow ? 'Opening...' : 'Buy Now' }}
          </button>
        </div>
      </article>
    </section>

    <ProductReviews v-if="selectedProduct" :productSlug="selectedProduct.slug" />

    <section v-if="relatedProducts.length" class="related" aria-labelledby="related-title">
      <h2 id="related-title">You May Also Like</h2>
      <div class="related-row">
        <article v-for="item in relatedProducts" :key="item.slug" class="related-card">
          <img
            v-if="item.primaryPhoto"
            class="mini-image"
            :src="withFallbackImage(item.primaryPhoto)"
            :alt="`${item.title} by Heritage Hues`"
            loading="lazy"
            decoding="async"
            @error="applyImageFallback"
          />
          <div
            v-else
            class="mini-swatch"
            :style="item.visualStyles[0] || { background: item.gradient }"
            aria-hidden="true"
          ></div>
          <p>{{ item.title }}</p>
          <strong>{{ item.price }}</strong>
          <span v-if="item.hasDiscount" class="related-prev-price">{{ item.basePrice }}</span>
          <a :href="buildProductPath(item.slug)">View</a>
        </article>
      </div>
    </section>

    <section v-if="!loading && !selectedProduct" class="empty-product">
      <h2>Product Not Found</h2>
      <p>
        This product is not available or the link is invalid. Explore our collection to discover
        handcrafted Bandhani pieces.
      </p>
      <a :href="explorePath">Go to Explore Collection</a>
    </section>

    <div
      v-if="paymentSheet"
      class="payment-sheet-backdrop"
      @click.self="closePaymentSheet"
    >
      <section class="payment-sheet">
        <h2>
          {{ paymentSheet.mobileDevice ? 'Complete UPI Payment' : 'UPI App Not Configured' }}
        </h2>
        <p class="payment-copy">
          {{
            paymentSheet.mobileDevice
              ? 'If your UPI app did not open, use these details manually.'
              : 'No UPI payment app is configured on this device. Configure a UPI app first, or use these details in any UPI app on your phone.'
          }}
        </p>
        <p class="payment-row">
          <span>UPI ID</span><strong>{{ paymentSheet.upiId }}</strong>
        </p>
        <p class="payment-row">
          <span>Amount</span><strong>{{ formatInr(paymentSheet.amount) }}</strong>
        </p>
        <p class="payment-row">
          <span>Order Ref</span><strong>{{ paymentSheet.orderRef }}</strong>
        </p>
        <div class="payment-actions">
          <button type="button" class="btn buy" @click="copyPaymentDetails">Copy Details</button>
          <button
            v-if="paymentSheet.mobileDevice"
            type="button"
            class="btn add"
            @click="openUpiApp"
          >
            Try Opening App Again
          </button>
          <button type="button" class="btn add" @click="closePaymentSheet">Close</button>
        </div>
      </section>
    </div>

    <SiteFooter />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { addCartItem, buyNow, fetchCart, fetchProductBySlug, fetchProducts } from '../api/products'
import { applyImageFallback, DEFAULT_PRODUCT_IMAGE, withFallbackImage } from '../utils/imageFallback'
import { setCartCount } from '../utils/cartStore'
import {
  buildCartPath,
  buildExplorePath,
  buildProductPath,
  buildProfilePath,
  getCurrentProductSlug,
  replaceWithPath,
} from '../utils/routes'
import ProductReviews from './ProductReviews.vue'
import SiteFooter from './SiteFooter.vue'

// ─── State ───────────────────────────────────────────────────────────────────
const activePhotoIndex = ref(0)
const cartCount = ref(0)
const explorePath = buildExplorePath()
const profilePath = buildProfilePath()
const cartPath = buildCartPath()
const showToast = ref(false)
const toastMessage = ref('')
const loading = ref(true)
const error = ref('')
const selectedProduct = ref(null)
const allProducts = ref([])
const isBuyingNow = ref(false)
const paymentSheet = ref(null)

// failedPhotoIndexes: { [index]: true }
const failedPhotoIndexes = ref({})

// photoSrcOverrides: { [index]: freshUrl } — used after a successful refresh
const photoSrcOverrides = ref({})

let toastTimer = null
let imageRefreshTimer = null
// Track ongoing refresh to avoid duplicate calls
let isRefreshing = false

const selectedSlug = getCurrentProductSlug()

// ─── Route guards ─────────────────────────────────────────────────────────────
if (!selectedSlug) {
  window.location.href = '/'
}

if (
  typeof window !== 'undefined' &&
  window.location.pathname.toLowerCase() === '/product' &&
  selectedSlug
) {
  replaceWithPath(buildProductPath(selectedSlug))
}

// ─── SEO ─────────────────────────────────────────────────────────────────────
useHead(() => {
  const product = selectedProduct.value
  const title = product?.title
    ? `${product.title} | Heritage Hues`
    : 'Bandhani Product | Heritage Hues'
  const description = product?.description
    ? `${product.description}`.slice(0, 160)
    : 'Discover premium handcrafted Bandhani sarees with secure checkout, inclusive pricing, and artisan-led design.'
  const canonicalPath = product?.slug
    ? buildProductPath(product.slug)
    : `/product/${encodeURIComponent(selectedSlug || '')}`
  const image = new URL(
    withFallbackImage(product?.primaryPhoto || DEFAULT_PRODUCT_IMAGE),
    window.location.origin,
  ).toString()

  return {
    title,
    link: [{ rel: 'canonical', href: `${window.location.origin}${canonicalPath}` }],
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'product' },
      { property: 'og:url', content: `${window.location.origin}${canonicalPath}` },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
  }
})

// ─── Computed ─────────────────────────────────────────────────────────────────
const relatedProducts = computed(() => {
  if (!selectedProduct.value) return []
  return allProducts.value
    .filter((item) => item.slug !== selectedProduct.value.slug)
    .slice(0, 4)
})

const descriptionPoints = computed(() => {
  if (!selectedProduct.value) return []
  const description = String(selectedProduct.value.description || '').trim()
  const bullets = Array.isArray(selectedProduct.value.bullets)
    ? selectedProduct.value.bullets
    : []
  return [description, ...bullets].filter(Boolean)
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Check karo ki value ek URL hai */
const isUrl = (val) => /^https?:\/\//i.test(String(val || ''))

/** Photo src return karo — override (fresh URL) hai toh woh, warna original */
const getPhotoSrc = (photo, index) => {
  const override = photoSrcOverrides.value[index]
  return override || withFallbackImage(photo)
}

const hasPhotoFailed = (index) => Boolean(failedPhotoIndexes.value[index])

const showToastMessage = (message, duration = 1500) => {
  toastMessage.value = message
  showToast.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, duration)
}

// ─── Image Refresh Logic ──────────────────────────────────────────────────────
/**
 * Jab bhi koi image fail ho, backend se fresh product data fetch karo.
 * Yeh CDN/Cloudinary/S3 signed URLs ki expiry problem solve karta hai.
 * Multiple images ek saath fail ho sakti hain — sirf ek fetch enough hai.
 */
const refreshProductImages = async () => {
  if (isRefreshing) return
  isRefreshing = true

  try {
    const [freshProduct, freshProducts] = await Promise.all([
      fetchProductBySlug(selectedSlug),
      fetchProducts(),
    ])
    if (!freshProduct || !selectedProduct.value) return

    const newOverrides = {}
    freshProduct.photos.forEach((photo, i) => {
      if (isUrl(photo)) {
        newOverrides[i] = photo
      }
    })
    photoSrcOverrides.value = newOverrides
    failedPhotoIndexes.value = {}

    selectedProduct.value = {
      ...selectedProduct.value,
      photos: freshProduct.photos,
      visualStyles: freshProduct.visualStyles,
      primaryPhoto: freshProduct.primaryPhoto,
    }

    allProducts.value = freshProducts
  } catch {
    showToastMessage('Unable to refresh image right now')
  } finally {
    isRefreshing = false
  }
}

const handleProductImageError = (index) => {
  failedPhotoIndexes.value = { ...failedPhotoIndexes.value, [index]: true }
}

const handleThumbError = (index) => {
  failedPhotoIndexes.value = { ...failedPhotoIndexes.value, [index]: true }
}

const retryPhoto = (index) => {
  const newOverrides = { ...photoSrcOverrides.value }
  delete newOverrides[index]
  photoSrcOverrides.value = newOverrides

  const newFailed = { ...failedPhotoIndexes.value }
  delete newFailed[index]
  failedPhotoIndexes.value = newFailed

  refreshProductImages()
}

const buildPhotoDownloadName = (index, source) => {
  const slug = selectedProduct.value?.slug || 'heritage-hues-product'
  const match = String(source || '').match(/\.([a-z0-9]+)(?:[?#].*)?$/i)
  const extension = match?.[1] || 'jpg'
  return `${slug}-image-${index + 1}.${extension}`
}

const triggerBrowserDownload = (href, filename) => {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadPhoto = async (photo, index) => {
  const source = getPhotoSrc(photo, index)
  if (!source || !isUrl(source)) return

  try {
    const response = await fetch(source, { cache: 'no-store' })
    if (!response.ok) throw new Error('Download request failed')
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    triggerBrowserDownload(objectUrl, buildPhotoDownloadName(index, source))
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
    showToastMessage('Image download started')
  } catch {
    window.open(source, '_blank', 'noopener')
    showToastMessage('Opened image in a new tab for manual download')
  }
}

const prevPhoto = () => {
  if (!selectedProduct.value) return
  const total = selectedProduct.value.photos.length
  activePhotoIndex.value = (activePhotoIndex.value - 1 + total) % total
}

const nextPhoto = () => {
  if (!selectedProduct.value) return
  const total = selectedProduct.value.photos.length
  activePhotoIndex.value = (activePhotoIndex.value + 1) % total
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
const handleAddToCart = () => {
  if (!selectedProduct.value) return
  if (selectedProduct.value.isOutOfStock) {
    showToastMessage(`${selectedProduct.value.title} is out of stock`)
    return
  }
  addCartItem({ slug: selectedProduct.value.slug, quantity: 1 })
    .then((cart) => {
      const count = Array.isArray(cart.items)
        ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0
      setCartCount(count)
      cartCount.value = count
      showToastMessage(`${selectedProduct.value.title} added to cart`, 1400)
    })
    .catch((err) => {
      error.value = err.message || 'Unable to add product to cart'
    })
}

const syncCartCount = () => {
  fetchCart()
    .then((cart) => {
      const count = Array.isArray(cart.items)
        ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0
      setCartCount(count)
      cartCount.value = count
    })
    .catch(() => {
      cartCount.value = 0
    })
}

// ─── Payment / Buy Now ────────────────────────────────────────────────────────
const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

const closePaymentSheet = () => {
  paymentSheet.value = null
}

const copyPaymentDetails = async () => {
  if (!paymentSheet.value) return
  const text = [
    `UPI ID: ${paymentSheet.value.upiId}`,
    `Amount: ${formatInr(paymentSheet.value.amount)}`,
    `Order Ref: ${paymentSheet.value.orderRef}`,
    `UPI Link: ${paymentSheet.value.upiUrl}`,
  ].join('\n')
  try {
    await navigator.clipboard.writeText(text)
    showToastMessage('Payment details copied')
  } catch {
    showToastMessage('Unable to copy payment details')
  }
}

const openUpiApp = () => {
  if (!paymentSheet.value?.upiUrl) return
  window.location.href = paymentSheet.value.upiUrl
}

const handleBuyNow = async () => {
  if (!selectedProduct.value) return
  if (selectedProduct.value.isOutOfStock) {
    error.value = `${selectedProduct.value.title} is out of stock`
    return
  }
  isBuyingNow.value = true
  error.value = ''
  try {
    const response = await buyNow({ slug: selectedProduct.value.slug, quantity: 1 })
    if (!response?.checkout_url) throw new Error('Checkout could not be started')
    window.location.href = response.checkout_url
  } catch (err) {
    error.value = err.message || 'Unable to start checkout'
  } finally {
    isBuyingNow.value = false
  }
}

// ─── Load Product ─────────────────────────────────────────────────────────────
const loadProduct = async () => {
  loading.value = true
  error.value = ''
  failedPhotoIndexes.value = {}
  photoSrcOverrides.value = {}
  activePhotoIndex.value = 0
  try {
    const [product, products] = await Promise.all([
      fetchProductBySlug(selectedSlug),
      fetchProducts(),
    ])
    allProducts.value = products
    selectedProduct.value =
      product || allProducts.value.find((item) => item.slug === selectedSlug) || null
    if (!selectedProduct.value) {
      window.location.replace('/')
      return
    }
  } catch (err) {
    error.value = err.message || 'Failed to load product'
  } finally {
    loading.value = false
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  syncCartCount()
  loadProduct()
  window.addEventListener('cart-updated', syncCartCount)
})

onBeforeUnmount(() => {
  window.removeEventListener('cart-updated', syncCartCount)
  clearTimeout(toastTimer)
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap");

/* ── Base ─────────────────────────────────────────────────────────────────── */
.product-page {
  min-height: 100svh;
  padding: clamp(1rem, 2.6vw, 2rem) clamp(1rem, 4vw, 3rem) clamp(2rem, 6vw, 4rem);
  background: #dcc39a;
  color: #2a1813;
  position: relative;
  display: flex;
  flex-direction: column;
}

.status-line {
  margin-top: 1rem;
  color: #5f2215;
}

.status-line.error {
  color: #8f2519;
}

/* ── Toast ───────────────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 40;
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(150, 84, 49, 0.45);
  background: rgba(255, 244, 224, 0.95);
  color: #682617;
  box-shadow: 0 10px 18px rgba(25, 11, 7, 0.2);
  font-family: "Cinzel", serif;
  font-size: 0.82rem;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.top-right {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.back-link {
  text-decoration: none;
  color: #6f2a1d;
  font-family: "Cinzel", serif;
  font-size: 0.86rem;
}

.brand {
  margin: 0;
  font-family: "Cinzel", serif;
  letter-spacing: 0.08em;
  color: #6a251a;
}

.header-cart,
.header-profile {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  border: 1px solid rgba(151, 76, 45, 0.5);
  background: rgba(255, 241, 215, 0.88);
  display: grid;
  place-items: center;
  text-decoration: none;
  position: relative;
}

.cart-icon,
.profile-icon {
  font-size: 1rem;
}

.cart-count {
  position: absolute;
  top: -0.2rem;
  right: -0.25rem;
  min-width: 0.95rem;
  height: 0.95rem;
  border-radius: 999px;
  background: #a63e2e;
  color: #fff2dc;
  font-size: 0.68rem;
  display: grid;
  place-items: center;
}

/* ── Product Hero Grid ───────────────────────────────────────────────────── */
.product-hero {
  margin-top: 0.9rem;
  border-radius: 20px;
  border: 1px solid rgba(139, 71, 44, 0.28);
  background:
    linear-gradient(135deg, rgba(255, 243, 223, 0.95), rgba(248, 228, 195, 0.9)),
    repeating-linear-gradient(
      -45deg,
      rgba(171, 93, 54, 0.04) 0,
      rgba(171, 93, 54, 0.04) 2px,
      transparent 2px,
      transparent 10px
    );
  box-shadow: 0 22px 36px rgba(33, 14, 10, 0.18);
  padding: clamp(1rem, 3vw, 1.8rem);
  display: grid;
  grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.2fr);
  gap: clamp(0.9rem, 2.4vw, 1.6rem);
}

/* ── Gallery / Slider ────────────────────────────────────────────────────── */
.visual-slider {
  position: relative;
  border-radius: 16px;
}

.slider-topbar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.65rem;
}

.media-count {
  min-width: 3.5rem;
  color: #6b2a1d;
  font-family: "Cinzel", serif;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

.media-progress {
  flex: 1;
  height: 0.32rem;
  border-radius: 999px;
  background: rgba(149, 83, 50, 0.15);
  overflow: hidden;
}

.media-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, #b24935, #7b271d);
  transition: width 220ms ease;
}

.visual-window {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 247, 234, 0.82), rgba(244, 226, 196, 0.5));
  padding: 0.55rem;
  box-shadow: inset 0 0 0 1px rgba(160, 94, 57, 0.12);
}

.visual-track {
  display: flex;
  transition: transform 320ms ease;
}

.visual-slide {
  position: relative;
  min-width: 100%;
}

.product-visual {
  width: 100%;
  min-width: 100%;
  border-radius: 16px;
  min-height: 340px;
  border: 1px solid rgba(181, 121, 76, 0.35);
}

.product-image {
  object-fit: cover;
  display: block;
}

/* ── Retry Button (replaces offline-download-btn) ────────────────────────── */
.image-recovery-actions {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.55rem;
}

.offline-download-btn,
.retry-btn {
  border: 0;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  background: rgba(44, 16, 14, 0.88);
  color: #fff3df;
  font-family: "Cinzel", serif;
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(32, 9, 11, 0.28);
  transition: background 180ms ease;
}

.offline-download-btn:hover,
.retry-btn:hover {
  background: rgba(72, 24, 20, 0.96);
}

/* ── Gallery Controls ────────────────────────────────────────────────────── */
.gallery-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: 1px solid rgba(180, 121, 77, 0.5);
  background: rgba(255, 244, 224, 0.88);
  color: #6d2a1c;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.gallery-btn.prev {
  left: 0.5rem;
}

.gallery-btn.next {
  right: 0.5rem;
}

.gallery-thumbs {
  margin-top: 0.7rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
  gap: 0.45rem;
}

.gallery-thumb {
  border: 1px solid rgba(161, 95, 58, 0.22);
  background: rgba(255, 248, 234, 0.8);
  padding: 0.18rem;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.gallery-thumb.active {
  border-color: rgba(166, 64, 42, 0.72);
  box-shadow: 0 10px 18px rgba(109, 39, 27, 0.16);
  transform: translateY(-1px);
}

.gallery-thumb-image {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  object-fit: cover;
}

/* ── Product Content ──────────────────────────────────────────────────────── */
.product-content {
  display: grid;
  gap: 0.9rem;
  align-content: start;
}

.category {
  margin: 0;
  font-family: "Cinzel", serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a3a24;
  font-size: 0.83rem;
}

h1 {
  margin: 0.45rem 0 0;
  font-family: "Cinzel", serif;
  color: #2c1813;
  font-size: clamp(1.8rem, 3.8vw, 2.7rem);
}

h2 {
  margin: 0;
  font-family: "Cinzel", serif;
  color: #5f2215;
}

/* ── Attention Pills ─────────────────────────────────────────────────────── */
.attention-row {
  margin-top: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.attention-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-family: "Cinzel", serif;
  font-size: 0.76rem;
  letter-spacing: 0.03em;
  border: 1px solid rgba(133, 62, 40, 0.18);
}

.attention-pill.subtle {
  background: rgba(255, 248, 236, 0.82);
  color: #7a3d2a;
  border-color: rgba(145, 88, 61, 0.22);
}

.attention-pill.scarce {
  background: rgba(124, 46, 27, 0.08);
  color: #6d2d20;
  border-color: rgba(124, 46, 27, 0.2);
}

/* ── Price Block ─────────────────────────────────────────────────────────── */
.price-block {
  border-radius: 18px;
  padding: 1rem 1.05rem;
  background:
    linear-gradient(145deg, rgba(71, 16, 18, 0.96), rgba(43, 10, 14, 0.94)),
    radial-gradient(circle at top right, rgba(207, 159, 100, 0.18), transparent 44%);
  border: 1px solid rgba(207, 159, 100, 0.28);
  box-shadow: 0 16px 28px rgba(32, 9, 11, 0.22);
}

.main-price {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.main-price small {
  font-size: 0.88rem;
  color: rgba(255, 234, 201, 0.88);
  font-style: normal;
  letter-spacing: 0.02em;
}

.price-headline {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.price {
  margin: 0;
  color: #fff4de;
  font-family: "Cinzel", serif;
  font-size: clamp(1.95rem, 4vw, 2.4rem);
  font-weight: 700;
  line-height: 1;
}

.discount-chip {
  color: #f5b9c2;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.18rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.mrp-line {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  color: rgba(255, 232, 199, 0.78);
}

.mrp-label {
  font-size: 0.9rem;
  color: rgba(255, 232, 199, 0.72);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.prev-price {
  color: rgba(255, 226, 188, 0.72);
  text-decoration: line-through;
  font-size: 1.02rem;
}

.price-notes {
  display: grid;
  gap: 0.14rem;
}

/* ── Stock ───────────────────────────────────────────────────────────────── */
.stock-state {
  margin: 0.45rem 0 0;
  color: #7a2f1e;
  font-family: "Cinzel", serif;
}

.stock-state.sold {
  color: #a63e2e;
}

.stock-state.scarce {
  color: #7a160c;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.scarcity-copy {
  margin: 0.18rem 0 0;
  color: #6d2d20;
  font-weight: 700;
  line-height: 1.4;
}

/* ── Description Points ──────────────────────────────────────────────────── */
.bullet-icon {
  color: #cf9f64;
  margin-right: 0.5rem;
  font-size: 0.9em;
  flex-shrink: 0;
}

.inline-points {
  margin: 0.4rem 0 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
}

.inline-points li {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  color: #4f3026;
  line-height: 1.6;
}

/* ── Heritage / Detail Cards ─────────────────────────────────────────────── */
.detail-card {
  margin-top: 0.85rem;
  border-radius: 16px;
  padding: 0.95rem 1rem;
  background: rgba(255, 250, 242, 0.56);
  border: 1px solid rgba(153, 85, 52, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.detail-card h2 {
  font-size: 1rem;
  color: #5f2215;
}

.detail-card p {
  margin: 0.45rem 0 0;
  color: #5c3d34;
  line-height: 1.7;
}

.heritage-card {
  background: rgba(255, 252, 246, 0.5);
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */
.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.btn {
  min-height: 2.5rem;
  border-radius: 999px;
  border: 1px solid rgba(151, 76, 45, 0.55);
  font-family: "Cinzel", serif;
  padding: 0.45rem 1rem;
  cursor: pointer;
  transition: opacity 180ms ease;
}

.btn.add {
  background: rgba(255, 239, 213, 0.9);
  color: #682617;
}

.btn.buy {
  background: linear-gradient(120deg, #a74030, #6f251b);
  color: #fff1db;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ── Related ─────────────────────────────────────────────────────────────── */
.related {
  margin-top: 1.3rem;
}

.related-row {
  margin-top: 0.65rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}

.related-card {
  border-radius: 14px;
  border: 1px solid rgba(144, 75, 46, 0.28);
  background: rgba(255, 244, 226, 0.86);
  padding: 0.65rem;
}

.mini-swatch {
  height: 100px;
  border-radius: 10px;
}

.mini-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.related-card p {
  margin: 0.5rem 0 0;
  color: #43251d;
}

.related-card strong {
  display: block;
  margin-top: 0.25rem;
  color: #702b1b;
}

.related-prev-price {
  display: block;
  margin-top: 0.18rem;
  color: #9f786a;
  text-decoration: line-through;
  font-size: 0.86rem;
}

.related-card a {
  margin-top: 0.35rem;
  display: inline-flex;
  color: #7a2f1e;
  text-decoration: none;
}

/* ── Empty State ─────────────────────────────────────────────────────────── */
.empty-product {
  flex: 1;
  display: grid;
  place-content: center;
  justify-items: start;
  gap: 0.5rem;
}

.empty-product h2 {
  margin: 0;
  color: #5f2215;
}

.empty-product p {
  margin: 0;
  max-width: 62ch;
  color: #482820;
}

.empty-product a {
  margin-top: 0.2rem;
  color: #6f2a1d;
  text-decoration: none;
  font-family: "Cinzel", serif;
}

/* ── Payment Sheet ───────────────────────────────────────────────────────── */
.payment-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(44, 24, 19, 0.45);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 50;
}

.payment-sheet {
  width: min(100%, 430px);
  border-radius: 16px;
  border: 1px solid rgba(147, 76, 44, 0.28);
  background: rgba(255, 245, 229, 0.98);
  padding: 1rem;
  box-shadow: 0 18px 30px rgba(33, 14, 10, 0.22);
}

.payment-copy {
  margin: 0.7rem 0 0;
  color: #4a2a21;
  line-height: 1.45;
}

.payment-row {
  margin: 0.75rem 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.payment-row span {
  color: #7b3925;
}

.payment-row strong {
  text-align: right;
  word-break: break-word;
}

.payment-actions {
  margin-top: 1rem;
  display: grid;
  gap: 0.6rem;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .product-hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .related-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .product-content {
    gap: 0.75rem;
  }

  .price-block {
    padding: 0.9rem;
  }

  .related-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
