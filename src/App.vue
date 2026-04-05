<template>
  <CartPage v-if="isCartPage" />
  <CheckoutSuccessPage v-else-if="isCheckoutSuccessPage" />
  <CheckoutPage v-else-if="isCheckoutPage" />
  <OrderTrackingPage v-else-if="isOrderPage" />
  <ProductDetailsPage v-else-if="isProductPage" />
  <ProfilePage v-else-if="isProfilePage" />
  <ExploreCollectionPage v-else-if="isExplorePage" />
  <main v-else ref="slidesRoot" class="page-shell">
    <section id="slide-intro" class="slide-window intro-slide">
      <header class="brand-masthead" aria-label="Heritage Hues Brand">
        <div class="brand-left">
          <img
            v-if="!logoLoadFailed"
            class="brand-logo"
            :src="logoSrc"
            alt="Heritage Hues logo"
            @error="logoLoadFailed = true"
          />
          <div v-else class="brand-logo-fallback" aria-hidden="true">HH</div>
        </div>
        <div class="brand-lockup">
          <p class="brand-name">HERITAGE HUES</p>
          <p class="brand-tagline">Tradition meets elegance</p>
        </div>
      </header>

      <section class="hero-shell">
      <section class="hero-panel fade-in-panel">
        <div class="motif motif-top" aria-hidden="true"></div>
        <div class="hero-copy">
          <p class="eyebrow fade-in-up delay-1">Legacy in Every Knot</p>
          <h1 class="fade-in-up delay-2">
            Carry a Living Heritage, Hand-Tied by Women Who Weave Dignity into Every Thread.
          </h1>
          <p class="subheading fade-in-up delay-3">
            Every Bandhani drape you choose protects a fragile craft, strengthens rural women, and keeps India’s cultural memory alive for the next generation.
          </p>
          <p class="living-line fade-in-up delay-3" aria-live="polite">{{ feelMessages[activeFeelIndex] }}</p>
          <a class="cta fade-in-up delay-4" href="/explore">Explore the Collection</a>
        </div>
        <div class="motif motif-bottom" aria-hidden="true"></div>
      </section>
    </section>
    </section>

    <section id="slide-welcome" class="slide-window welcome-shell" aria-labelledby="welcome-heading">
      <article class="welcome-panel">
        <div class="story-slider" role="button" tabindex="0" aria-label="Click to view next story slide" @click="nextStorySlide" @keyup.enter="nextStorySlide" @keyup.space.prevent="nextStorySlide">
          <div class="story-denoter" aria-live="polite">
            <span>{{ String(activeStorySlide + 1).padStart(2, '0') }}</span>
            <small>/ {{ String(totalStorySlides).padStart(2, '0') }}</small>
          </div>
          <div class="story-track" :style="{ transform: `translateX(-${activeStorySlide * 100}%)` }">
            <article class="story-pane">
              <p class="eyebrow">A Story You Can Wear</p>
              <h2 id="welcome-heading">The Hands Behind Every Bandhani Thread Are Women of Courage</h2>
              <p>
                Bandhani survives because rural women wake before sunrise, sit with discipline, and tie every knot by
                hand. Their skill is not ordinary labor. It is inherited wisdom turned into art.
              </p>
              <p>
                Today, many young people leave handcraft due to low incomes and uncertain futures. If we do not support
                this tradition now, we may lose one more proud heritage forever.
              </p>
              <p class="welcome-honor">
                In a world of machines, wear something touched by warm human hands and feel truly honorable.
              </p>
              <div class="welcome-lines">
                <p
                  v-for="(line, index) in welcomeLines"
                  :key="line"
                  class="welcome-line"
                  :style="{ animationDelay: `${index * 140}ms` }"
                >
                  {{ line }}
                </p>
              </div>
            </article>

            <article class="story-pane">
              <h3>Why Bandhani Feels Different</h3>
              <p>
                Bandhani is far more than a garment you wear once and forget. It is a sensory and emotional experience
                shaped by patient handwork, inherited cultural memory, and the quiet intention of the women who tie
                every knot. From touch to movement to mood, each drape carries a living presence that machine-made
                fabric rarely holds.
              </p>
              <ul>
                <li>
                  Breathable comfort:
                  the airy weave and natural fall let your skin breathe through long days, so you stay at ease from
                  busy routines to evening functions without feeling heavy or restricted.
                </li>
                <li>
                  Emotional color depth:
                  layered hand-dyeing creates tones that shift beautifully with light, giving each color a warm,
                  expressive character that feels alive in photographs and in person.
                </li>
                <li>
                  Lightweight elegance:
                  the fabric rests softly on the body and moves with natural grace, creating a refined silhouette
                  without stiffness or weight.
                </li>
                <li>
                  Distinctive identity:
                  tiny hand-tied variations can never be perfectly repeated by machines, which means your Bandhani
                  carries a signature personality that feels truly personal.
                </li>
                <li>
                  Occasion-ready versatility:
                  it transitions effortlessly across moments, from everyday confidence to pooja, family celebrations,
                  weddings, and festive gatherings where tradition and elegance meet.
                </li>
                <li>
                  Heritage value:
                  choosing Bandhani keeps a living craft visible, sustains artisan families, and helps protect a
                  meaningful tradition so it is not lost for future generations.
                </li>
              </ul>
            </article>

            <article class="story-pane">
              <h3>How a Bandhani is Born</h3>
              <p>
                A Bandhani is not made in minutes. It is a slow, mindful process where every stage depends on human
                precision, traditional wisdom, and emotional care.
              </p>
              <ol>
                <li>
                  Design mapping and intention:
                  the artisan first studies the fabric, then maps motif placement by hand so geometry and storytelling stay balanced.
                </li>
                <li>
                  Fabric preparation:
                  cloth is cleaned, dried, and stretched to ensure dye enters evenly and knots hold their shape through repeated handling.
                </li>
                <li>
                  Micro-knot tying:
                  cotton or silk is pinched and tied thousands of times with thread; each tiny tie protects sections from dye and forms the final dot language.
                </li>
                <li>
                  First dye bath:
                  the tied fabric is immersed in carefully prepared color, then lifted and dried with attention to weather and humidity.
                </li>
                <li>
                  Retie and redye cycles:
                  for multi-tone Bandhani, selected areas are retied and dipped again from light to deep shades to build depth and contrast.
                </li>
                <li>
                  Slow drying and setting:
                  the piece rests between cycles so colors mature naturally and the cloth retains softness.
                </li>
                <li>
                  Opening the knots:
                  each thread is gently released by hand to reveal the characteristic constellation of Bandhani dots and motifs.
                </li>
                <li>
                  Finishing and quality care:
                  the final drape is washed, checked for symmetry, softness, and color clarity, then prepared to reach you as a wearable piece of heritage.
                </li>
              </ol>
            </article>

            <article class="story-pane">
              <p class="coming-soon-chip">Coming Soon</p>
              <h3>A Gift with Emotion, Not Just Price</h3>
              <p>
                This gifting experience is currently being prepared with the same care as our handcrafted collection.
              </p>
              <p>
                Check back soon for a more meaningful way to share Bandhani with someone special.
              </p>
            </article>
          </div>
        </div>
      </article>
    </section>

    <section id="slide-features" class="slide-window features-shell" aria-labelledby="features-heading">
      <div class="features-header">
        <p class="eyebrow">Crafted for Comfort and Grace</p>
        <h2 id="features-heading">Woven for Comfort, Culture, and Celebration</h2>
      </div>
      <div class="features-grid">
        <article v-for="feature in features" :key="feature.title" class="feature-card">
          <span class="feature-icon" v-html="feature.icon" aria-hidden="true"></span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>
    </section>

    <section id="slide-customize" class="slide-window customize-shell" aria-labelledby="customize-heading">
      <article class="customize-panel">
        <div class="customize-grid">
          <div class="customize-copy">
            <p class="coming-soon-chip">Coming Soon Feature</p>
            <p class="eyebrow">Make It Uniquely Yours</p>
            <h2 id="customize-heading">Craft Your Exclusive Signature Piece</h2>
            <p class="customize-note">
              Personalize your Bandhani with thoughtful complexity and colors, then receive a handcrafted estimate made with artisan care.
            </p>
            <button class="cta customize-open coming-soon-button" type="button" disabled aria-disabled="true">
              Coming Soon
            </button>
          </div>

          <div class="customize-audio" aria-label="Signature audio player">
            <img class="audio-wallpaper-image" :src="audioWallpaperSrc" alt="Bandhani artisan wallpaper" />
            <audio controls preload="metadata" :src="signatureAudioSrc">
              Your browser does not support audio playback.
            </audio>
          </div>
        </div>
        <p v-if="customizationApplied" class="applied-chip">
          Customization added: {{ formatInr(customizationPriceChange) }} | {{ estimatedDeliveryRange }}
        </p>
      </article>
    </section>

    <section id="slide-contact" class="slide-window contact-shell" aria-labelledby="contact-heading">
      <div class="motif-divider" aria-hidden="true"></div>
      <article class="contact-panel">
        <div class="contact-copy">
          <p class="eyebrow">Connect With Us</p>
          <h2 id="contact-heading">We Are Here to Help You Choose Meaningfully</h2>
          <p class="contact-note">
            Reach out for styling support, customization guidance, or artisan stories behind every Bandhani creation.
          </p>
          <div class="contact-links">
            <a href="https://www.instagram.com/heritagehues09" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <path d="M16.5 7.5h.01" />
                <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
              </svg>
            </a>
            <a href="mailto:care.heritagehues@gmail.com" aria-label="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                <path d="M22 8l-10 7L2 8" />
              </svg>
            </a>
          </div>
          <p v-if="contactError" class="status error" role="alert">{{ contactError }}</p>
          <p v-if="contactSuccess" class="status success" role="status">{{ contactSuccess }}</p>
        </div>

        <form class="contact-form" @submit.prevent="submitContactForm">
          <label for="contact-name">Name</label>
          <input id="contact-name" type="text" placeholder="Your name" v-model="contactName" />

          <label for="contact-email">Email</label>
          <input id="contact-email" type="email" placeholder="you@example.com" v-model="contactEmail" />

          <label for="contact-message">Message</label>
          <textarea id="contact-message" rows="4" placeholder="Write a short message" v-model="contactMessage"></textarea>

          <button type="submit" :disabled="contactLoading">
            {{ contactLoading ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </article>
    </section>

    <nav class="slide-nav" aria-label="Slide navigation">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="slide-dot"
        :class="{ active: index === activeSlideIndex }"
        type="button"
        :aria-label="`Go to ${slide.label}`"
        @click="goToSlide(index)"
      ></button>
    </nav>

    <div
      v-if="showCustomizationModal"
      class="modal-backdrop"
      role="presentation"
      @click.self="showCustomizationModal = false"
    >
      <section class="customize-modal" role="dialog" aria-modal="true" aria-labelledby="customization-modal-title">
        <button
          class="modal-close"
          type="button"
          aria-label="Close customization modal"
          @click="showCustomizationModal = false"
        >
          x
        </button>

        <p class="eyebrow">Exclusive Design Studio</p>
        <h2 id="customization-modal-title">Customize Your Bandhani</h2>

        <div class="modal-group">
          <p class="picker-label">Pattern complexity</p>
          <div class="gift-options">
            <label v-for="option in complexityOptions" :key="option.value" class="gift-pill">
              <input v-model="selectedComplexity" type="radio" name="complexity" :value="option.value" />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="modal-group">
          <label class="picker-label" for="color-combination">Color combinations</label>
          <select id="color-combination" v-model="selectedColorCombo" class="color-select">
            <option v-for="option in colorOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="modal-estimate">
          <p>
            Estimated price change:
            <strong>{{ formatInr(customizationPriceChange) }}</strong>
          </p>
          <p>
            Delivery estimation:
            <strong>{{ estimatedDeliveryRange }}</strong>
          </p>
        </div>

        <p class="exclusivity-note">
          "Your design will belong only to you. We promise exclusivity."
        </p>

        <div class="modal-actions">
          <button class="cta modal-action" type="button" @click="applyCustomization">Apply Customization</button>
          <button class="modal-link" type="button" @click="showCustomizationModal = false">Close</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import logoFile from './logo.png'
import ExploreCollectionPage from './components/ExploreCollectionPage.vue'
import CheckoutPage from './components/CheckoutPage.vue'
import CheckoutSuccessPage from './components/CheckoutSuccessPage.vue'
import OrderTrackingPage from './components/OrderTrackingPage.vue'
import ProductDetailsPage from './components/ProductDetailsPage.vue'
import ProfilePage from './components/ProfilePage.vue'
import CartPage from './components/CartPage.vue'
import SiteFooter from './components/SiteFooter.vue'
import { setCartCount } from './utils/cartStore'
import { fetchCart } from './api/products'
import { useSeo } from './seo'
import signatureAudioFile from './audio.mp3'
import audioWallpaperFile from './audio-wallpaper.png'

const currentPath = typeof window !== 'undefined'
  ? window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/'
  : '/'
const isProductPage = currentPath === '/product' || currentPath.startsWith('/product/')
const isCartPage = currentPath === '/cart' || currentPath.startsWith('/cart/')
const isCheckoutSuccessPage = currentPath === '/checkout/success' || currentPath.startsWith('/checkout/success/')
const isCheckoutPage = !isCheckoutSuccessPage && (currentPath === '/checkout' || currentPath.startsWith('/checkout/'))
const isOrderPage = currentPath === '/order' || currentPath.startsWith('/order/')
const isExplorePage = currentPath === '/explore' || currentPath.startsWith('/explore/')
const isProfilePage = currentPath === '/profile' || currentPath.startsWith('/profile/')
const isDefaultPage = !isExplorePage && !isProductPage && !isCartPage && !isCheckoutPage && !isCheckoutSuccessPage && !isOrderPage && !isProfilePage
const cartCount = ref(0)
const apiBase = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')

if (isDefaultPage) {
  useSeo({
    title: 'Bandhani Sarees',
    path: '/',
    description: 'Shop handcrafted Bandhani sarees, artisan stories, premium packaging, and secure checkout with Heritage Hues.',
    keywords: [
      'Bandhani sarees',
      'buy Bandhani online',
      'Heritage Hues',
      'artisan fashion',
      'traditional Indian sarees',
    ],
  })
}

const baseSubtotal = 3499
const baseDeliveryMinDays = 6
const baseDeliveryMaxDays = 8

const supportEnabled = ref(false)
const selectedGift = ref(50)
const customAmount = ref('')
const showCustomizationModal = ref(false)
const customizationApplied = ref(false)
const selectedComplexity = ref('simple')
const selectedColorCombo = ref('royal-maroon-mustard')
const logoSrc = logoFile
const signatureAudioSrc = signatureAudioFile
const audioWallpaperSrc = audioWallpaperFile
const logoLoadFailed = ref(false)
const couponInput = ref('')
const appliedCouponCode = ref('')
const couponMessage = ref('Apply a coupon to receive a heritage benefit.')
const couponMessageType = ref('info')

const contactName = ref('')
const contactEmail = ref('')
const contactMessage = ref('')
const contactError = ref('')
const contactSuccess = ref('')
const contactLoading = ref(false)

const giftOptions = [
  { label: 'Rs 50', value: 50 },
  { label: 'Rs 100', value: 100 },
  { label: 'Rs 250', value: 250 },
  { label: 'Custom', value: 'custom' },
]
const complexityOptions = [
  { label: 'Simple', value: 'simple', priceChange: 0, extraDays: 0 },
  { label: 'Medium', value: 'medium', priceChange: 350, extraDays: 2 },
  { label: 'Complex', value: 'complex', priceChange: 800, extraDays: 4 },
]
const colorOptions = [
  { label: 'Royal Maroon + Mustard Gold', value: 'royal-maroon-mustard', priceChange: 200, extraDays: 1 },
  { label: 'Indigo + Madder Red', value: 'indigo-madder-red', priceChange: 320, extraDays: 2 },
  { label: 'Forest Green + Antique Gold', value: 'forest-antique-gold', priceChange: 280, extraDays: 1 },
  { label: 'Deep Plum + Rose Beige', value: 'plum-rose-beige', priceChange: 380, extraDays: 2 },
]

const selectedGiftAmount = computed(() => {
  if (!supportEnabled.value) {
    return 0
  }

  if (selectedGift.value === 'custom') {
    const amount = Number(customAmount.value)
    return Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0
  }

  return selectedGift.value
})

const merchandiseSubtotal = computed(() => baseSubtotal + appliedCustomizationPrice.value)

const appliedDiscount = computed(() => {
  const code = appliedCouponCode.value

  if (code === 'HERITAGE10') {
    return Math.min(Math.round(merchandiseSubtotal.value * 0.1), 500)
  }

  if (code === 'ARTISAN200') {
    return merchandiseSubtotal.value >= 2000 ? 200 : 0
  }

  return 0
})

const taxableSubtotal = computed(() => Math.max(merchandiseSubtotal.value - appliedDiscount.value, 0))
const gstAmount = computed(() => Math.round(taxableSubtotal.value * 0.18))
const finalPayableAmount = computed(() => taxableSubtotal.value + gstAmount.value + selectedGiftAmount.value)

const selectedComplexityConfig = computed(
  () => complexityOptions.find((option) => option.value === selectedComplexity.value) ?? complexityOptions[0]
)

const selectedColorConfig = computed(
  () => colorOptions.find((option) => option.value === selectedColorCombo.value) ?? colorOptions[0]
)

const customizationPriceChange = computed(
  () => selectedComplexityConfig.value.priceChange + selectedColorConfig.value.priceChange
)

const estimatedDeliveryRange = computed(() => {
  const extraDays = selectedComplexityConfig.value.extraDays + selectedColorConfig.value.extraDays
  const minDays = baseDeliveryMinDays + extraDays
  const maxDays = baseDeliveryMaxDays + extraDays
  return `${minDays}-${maxDays} days`
})

const appliedCustomizationPrice = computed(() => (customizationApplied.value ? customizationPriceChange.value : 0))

const applyCustomization = () => {
  customizationApplied.value = true
  showCustomizationModal.value = false
}

const applyCoupon = () => {
  const code = couponInput.value.toUpperCase()

  if (!code) {
    appliedCouponCode.value = ''
    couponMessageType.value = 'info'
    couponMessage.value = 'Enter a coupon code to apply discount.'
    return
  }

  if (code === 'HERITAGE10') {
    appliedCouponCode.value = code
    couponMessageType.value = 'success'
    couponMessage.value = 'HERITAGE10 applied: 10% off up to Rs 500.'
    return
  }

  if (code === 'ARTISAN200') {
    if (merchandiseSubtotal.value < 2000) {
      appliedCouponCode.value = ''
      couponMessageType.value = 'info'
      couponMessage.value = 'ARTISAN200 requires Rs 2000 subtotal.'
      return
    }

    appliedCouponCode.value = code
    couponMessageType.value = 'success'
    couponMessage.value = 'ARTISAN200 applied: Rs 200 off.'
    return
  }

  appliedCouponCode.value = ''
  couponMessageType.value = 'info'
  couponMessage.value = 'Coupon not recognized. Try HERITAGE10 or ARTISAN200.'
}

const isEmailValid = (value) => {
  const email = String(value || '').trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const submitContactForm = async () => {
  contactError.value = ''
  contactSuccess.value = ''

  const name = String(contactName.value || '').trim()
  const email = String(contactEmail.value || '').trim()
  const message = String(contactMessage.value || '').trim()

  if (!name) {
    contactError.value = 'Please enter your name.'
    return
  }
  if (!isEmailValid(email)) {
    contactError.value = 'Please enter a valid email address.'
    return
  }
  if (!message) {
    contactError.value = 'Please type your message.'
    return
  }

  contactLoading.value = true
  try {
    const response = await fetch(`${apiBase}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Unable to send message')
    }

    contactSuccess.value = 'Message sent successfully. We will reach out soon.'
    contactName.value = ''
    contactEmail.value = ''
    contactMessage.value = ''
  } catch (err) {
    contactError.value = err.message || 'Unable to send message'
  } finally {
    contactLoading.value = false
  }
}

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

const features = [
  {
    title: 'Breathable Fabric',
    description: 'Soft, airy texture keeps you comfortable from morning rituals to evening gatherings.',
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 13c1.6-3.2 3.2-4.8 8-4.8S18.4 9.8 20 13" />
        <path d="M4 18c1.6-3.2 3.2-4.8 8-4.8s6.4 1.6 8 4.8" />
      </svg>`,
  },
  {
    title: 'Vibrant Colors',
    description: 'Hand-dyed tones glow with festive warmth and express timeless Indian artistry.',
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="8" r="3.2" />
        <circle cx="15.7" cy="8.8" r="2.7" />
        <circle cx="11.8" cy="15.6" r="3.4" />
      </svg>`,
  },
  {
    title: 'Summer Friendly',
    description: 'Lightweight drape helps you stay cool, graceful, and confident in warm weather.',
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3.8" />
        <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </svg>`,
  },
  {
    title: 'Perfect for Occasions',
    description: 'From sacred ceremonies to family celebrations, Bandhani makes each moment memorable.',
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3.5l2.5 4.8 5.3.8-3.9 3.8.9 5.3L12 15.8 7.2 18.2l.9-5.3-3.9-3.8 5.3-.8L12 3.5z" />
      </svg>`,
  },
  {
    title: 'Handcrafted Uniqueness',
    description: 'Every motif is uniquely hand-tied, so no two pieces ever feel exactly the same.',
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 17c1.4-2.3 2.8-3.5 4.6-3.5 2 0 3 1.2 4.2 1.2 1.7 0 2.7-2 5.2-2.7" />
        <path d="M5 12c1.4-2.3 2.8-3.5 4.6-3.5 2 0 3 1.2 4.2 1.2 1.7 0 2.7-2 5.2-2.7" />
      </svg>`,
  },
]

const feelMessages = [
  'Wear the pride of Indian heritage.',
  'Your purchase protects a vanishing art.',
  'Every knot supports a rural woman artisan.',
]

const welcomeLines = [
  'Heritage is not old. It is alive when you wear it.',
  'Bandhani is beauty shaped by patience, not machines.',
  'When artisans rise, traditions survive.',
]

const activeFeelIndex = ref(0)
const activeStorySlide = ref(0)
const slidesRoot = ref(null)
const activeSlideIndex = ref(0)
let feelLineTimer
let slideObserver
const totalStorySlides = 4

const slides = [
  { id: 'slide-intro', label: 'Intro' },
  { id: 'slide-welcome', label: 'Welcome Story' },
  { id: 'slide-features', label: 'Bandhani Benefits' },
  { id: 'slide-customize', label: 'Customization' },
  { id: 'slide-contact', label: 'Contact' },
]

onMounted(() => {
  syncCartCount()
  window.addEventListener('cart-updated', syncCartCount)

  if (isExplorePage || isProductPage || isCartPage || isCheckoutPage || isCheckoutSuccessPage || isOrderPage) return

  feelLineTimer = setInterval(() => {
    activeFeelIndex.value = (activeFeelIndex.value + 1) % feelMessages.length
  }, 2800)

  const root = slidesRoot.value
  if (!root) return

  slideObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const index = slides.findIndex((slide) => slide.id === entry.target.id)
          if (index >= 0) activeSlideIndex.value = index
        }
      }
    },
    { root, threshold: 0.55 }
  )

  for (const slide of slides) {
    const element = document.getElementById(slide.id)
    if (element) slideObserver.observe(element)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('cart-updated', syncCartCount)

  if (isExplorePage || isProductPage || isCartPage || isCheckoutPage || isCheckoutSuccessPage || isOrderPage) return

  clearInterval(feelLineTimer)
  if (slideObserver) slideObserver.disconnect()
})

const syncCartCount = async () => {
  try {
    const cart = await fetchCart()
    const count = Array.isArray(cart?.items) ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0
    setCartCount(count)
    cartCount.value = count
  } catch {
    cartCount.value = 0
  }
}

const goToSlide = (index) => {
  const slide = slides[index]
  if (!slide) return
  const element = document.getElementById(slide.id)
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const nextStorySlide = () => {
  activeStorySlide.value = (activeStorySlide.value + 1) % totalStorySlides
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap");

.page-shell {
  height: 100svh;
  width: 100%;
  padding: 0;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.slide-window {
  min-height: 100svh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
  overflow: hidden;
}

.slide-window + .slide-window {
  margin-top: clamp(0.45rem, 1.1vw, 0.8rem);
}

.intro-slide {
  display: flex;
  flex-direction: column;
}

.brand-masthead {
  min-height: clamp(96px, 18svh, 170px);
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding: clamp(1rem, 2.3vw, 1.6rem) clamp(1rem, 4vw, 3rem);
  background:
    linear-gradient(180deg, rgba(33, 17, 13, 0.96), rgba(24, 12, 9, 0.9)),
    radial-gradient(circle at 50% 0%, rgba(189, 148, 88, 0.22), transparent 55%);
  border-bottom: 1px solid rgba(206, 164, 103, 0.45);
  position: relative;
}

.brand-left {
  justify-self: start;
}

.brand-lockup {
  text-align: right;
  justify-self: end;
}

.brand-logo {
  width: clamp(92px, 13vw, 150px);
  height: auto;
  display: block;
  border-radius: 14px;
  border: 1px solid rgba(209, 167, 106, 0.55);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.34);
  background: rgba(236, 214, 179, 0.8);
}

.brand-logo-fallback {
  width: clamp(92px, 13vw, 150px);
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
  border-radius: 14px;
  border: 1px solid rgba(209, 167, 106, 0.55);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.34);
  background:
    radial-gradient(circle at 30% 28%, rgba(172, 50, 41, 0.85), transparent 45%),
    linear-gradient(145deg, rgba(224, 193, 147, 0.92), rgba(188, 143, 81, 0.92));
  color: #1a0f0b;
  font-family: "Cinzel", serif;
  font-size: clamp(1.15rem, 2.2vw, 1.8rem);
  letter-spacing: 0.08em;
}

.brand-name {
  margin: 0;
  font-family: "Cinzel", serif;
  letter-spacing: 0.12em;
  color: #fff0d6;
  font-size: clamp(1.25rem, 3vw, 2.05rem);
}

.brand-tagline {
  margin: 0.3rem 0 0;
  font-family: "Cinzel", serif;
  color: #efc885;
  letter-spacing: 0.06em;
  font-size: clamp(0.72rem, 1.2vw, 0.88rem);
}

.header-cart {
  position: absolute;
  top: 0.7rem;
  right: clamp(0.7rem, 2.1vw, 1.1rem);
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 999px;
  border: 1px solid rgba(216, 173, 109, 0.6);
  background: rgba(33, 17, 13, 0.72);
  display: grid;
  place-items: center;
  text-decoration: none;
}

.cart-icon {
  font-size: 1.05rem;
}

.cart-count {
  position: absolute;
  top: -0.28rem;
  right: -0.28rem;
  min-width: 1rem;
  height: 1rem;
  border-radius: 999px;
  background: #b94c39;
  color: #fff4de;
  font-size: 0.7rem;
  display: grid;
  place-items: center;
  padding: 0 0.18rem;
}

.hero-shell {
  min-height: 0;
  width: 100%;
  flex: 1;
  padding: clamp(1rem, 2.2vw, 2rem) clamp(1rem, 3.8vw, 3rem);
  display: grid;
  place-items: center;
}

.welcome-shell {
  min-height: 100svh;
  width: 100%;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 3rem);
  display: grid;
  align-content: center;
  justify-items: center;
}

.welcome-panel {
  width: min(1220px, 100%);
  border-radius: 22px;
  border: 1px solid rgba(192, 149, 87, 0.4);
  background:
    linear-gradient(140deg, rgba(34, 17, 13, 0.94), rgba(19, 10, 8, 0.96)),
    repeating-linear-gradient(
      45deg,
      rgba(201, 160, 100, 0.05) 0,
      rgba(201, 160, 100, 0.05) 2px,
      transparent 2px,
      transparent 10px
    );
  box-shadow:
    0 22px 50px rgba(12, 6, 5, 0.42),
    inset 0 0 0 1px rgba(206, 164, 103, 0.28);
  padding: clamp(1.2rem, 3vw, 2rem);
}

.story-slider {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
}

.story-slider:focus-visible {
  outline: 2px solid rgba(231, 190, 123, 0.8);
  outline-offset: 2px;
}

.story-denoter {
  position: absolute;
  top: 0.7rem;
  right: 0.75rem;
  z-index: 2;
  display: inline-flex;
  align-items: baseline;
  gap: 0.18rem;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  border: 1px solid rgba(214, 169, 101, 0.36);
  background: rgba(28, 13, 10, 0.58);
  box-shadow: 0 6px 12px rgba(6, 3, 2, 0.28);
  color: #ffe3bb;
  font-family: "Cinzel", serif;
  letter-spacing: 0.06em;
}

.story-denoter span {
  font-size: 0.84rem;
}

.story-denoter small {
  font-size: 0.68rem;
  opacity: 0.84;
}

.story-track {
  display: flex;
  transition: transform 420ms ease;
}

.story-pane {
  min-width: 100%;
  border-radius: 14px;
  background: linear-gradient(140deg, rgba(46, 22, 17, 0.9), rgba(26, 13, 10, 0.9));
  padding: clamp(1rem, 2.4vw, 1.6rem);
}

.story-pane p {
  margin: 0.7rem 0 0;
  color: #f1dbb9;
  font-size: clamp(1.16rem, 2.15vw, 1.42rem);
  line-height: 1.6;
}

.welcome-honor {
  margin-top: 1rem;
  font-family: "Cinzel", serif;
  color: #ffd8a2;
}

.welcome-lines {
  margin-top: 0.85rem;
  display: grid;
  gap: 0.45rem;
}

.welcome-line {
  margin: 0;
  padding-left: 0.8rem;
  border-left: 2px solid rgba(209, 160, 96, 0.5);
  color: #f5dfbd;
  opacity: 0;
  transform: translateY(8px);
  animation: revealLine 650ms ease forwards;
}

.story-pane h3 {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: clamp(1.36rem, 2.35vw, 1.9rem);
  color: #ffe7c4;
}

.story-pane ul,
.story-pane ol {
  margin: 0.5rem 0 0;
  padding-left: 1.15rem;
  color: #f0d7b3;
  font-size: clamp(1.12rem, 1.95vw, 1.3rem);
  line-height: 1.58;
}

.story-pane li + li {
  margin-top: 0.28rem;
}


.hero-panel {
  width: 100%;
  position: relative;
  border-radius: 22px;
  padding: clamp(2rem, 6vw, 4.75rem);
  background:
    linear-gradient(130deg, rgba(36, 18, 14, 0.94), rgba(19, 10, 8, 0.94)),
    repeating-linear-gradient(
      45deg,
      rgba(186, 144, 84, 0.06) 0,
      rgba(186, 144, 84, 0.06) 2px,
      transparent 2px,
      transparent 9px
    );
  border: 1px solid rgba(192, 149, 87, 0.42);
  box-shadow:
    0 24px 65px rgba(18, 9, 7, 0.45),
    inset 0 0 0 1px rgba(196, 154, 92, 0.38);
}

.hero-copy {
  max-width: 760px;
  text-wrap: balance;
}

.eyebrow {
  margin: 0;
  font-family: "Cinzel", serif;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #e9b66a;
  font-size: clamp(0.9rem, 1.8vw, 1.02rem);
}

h1 {
  margin: 0.75rem 0 1.15rem;
  font-family: "Cinzel", serif;
  color: #fff1d8;
  line-height: 1.12;
  font-size: clamp(2rem, 5.2vw, 4rem);
}

.subheading {
  margin: 0;
  max-width: 65ch;
  font-size: clamp(1.08rem, 2.1vw, 1.38rem);
  line-height: 1.5;
  color: #f4dfbe;
}

.living-line {
  margin: 0.8rem 0 0;
  font-family: "Cinzel", serif;
  color: #ffd59b;
  letter-spacing: 0.02em;
  min-height: 1.4em;
  animation: softGlow 2.2s ease-in-out infinite;
}

.cta {
  margin-top: 1.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 3rem;
  padding: 0.78rem 1.7rem;
  border-radius: 999px;
  text-decoration: none;
  font-family: "Cinzel", serif;
  letter-spacing: 0.05em;
  font-size: 0.97rem;
  color: #fff4e1;
  background: linear-gradient(120deg, #b24a38, #7a2b21);
  border: 1px solid rgba(234, 186, 113, 0.75);
  box-shadow: 0 14px 30px rgba(29, 12, 9, 0.38);
  transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
}

.cta:hover,
.cta:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(95, 30, 12, 0.35);
  filter: saturate(1.08);
}

.cta:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--gold-muted) 70%, #fff);
  outline-offset: 3px;
}

.motif {
  position: absolute;
  left: clamp(1rem, 2.5vw, 2rem);
  right: clamp(1rem, 2.5vw, 2rem);
  height: 14px;
  opacity: 0.7;
  background-image:
    radial-gradient(circle at 10px 7px, rgba(123, 53, 30, 0.34) 0 3px, transparent 3px),
    radial-gradient(circle at 30px 7px, rgba(211, 164, 104, 0.42) 0 2.5px, transparent 2.5px),
    linear-gradient(to right, transparent, rgba(153, 66, 37, 0.4) 20%, rgba(211, 164, 104, 0.55) 50%, rgba(153, 66, 37, 0.4) 80%, transparent);
  background-size: 40px 14px, 40px 14px, 100% 2px;
  background-position: 0 0, 0 0, 0 6px;
  background-repeat: repeat-x;
}

.features-shell {
  min-height: 100svh;
  width: 100%;
  margin: 0;
  padding: clamp(2.3rem, 6vw, 4rem) clamp(1rem, 4vw, 3rem);
  display: grid;
  align-content: center;
  justify-items: center;
}

.customize-shell {
  min-height: 100svh;
  width: 100%;
  margin: 0;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 3rem);
  display: grid;
  align-content: center;
  justify-items: center;
}

.customize-panel {
  width: min(1360px, 100%);
  border-radius: 20px;
  border: 1px solid rgba(141, 63, 36, 0.25);
  background:
    linear-gradient(130deg, rgba(36, 18, 14, 0.94), rgba(20, 10, 8, 0.95)),
    radial-gradient(circle at 90% 10%, rgba(223, 177, 104, 0.2), transparent 46%);
  box-shadow:
    0 14px 30px rgba(17, 8, 6, 0.4),
    inset 0 0 0 1px rgba(231, 196, 143, 0.28);
  padding: clamp(1.3rem, 2.8vw, 2.2rem);
}

.customize-note {
  margin: 0.8rem 0 1.05rem;
  font-size: clamp(1.03rem, 2vw, 1.16rem);
  color: #ead5b5;
  line-height: 1.5;
}

.customize-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.25fr);
  gap: clamp(1.2rem, 2.6vw, 2.1rem);
  align-items: stretch;
}

.customize-copy {
  align-self: center;
}

.coming-soon-chip {
  margin: 0 0 0.5rem;
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(215, 168, 105, 0.52);
  background: rgba(33, 16, 12, 0.72);
  color: #f1cc95;
  font-family: "Cinzel", serif;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.customize-copy .eyebrow {
  font-size: clamp(1rem, 1.7vw, 1.2rem);
}

.customize-copy h2 {
  margin-top: 0.45rem;
  font-size: clamp(2rem, 3.8vw, 3rem);
  line-height: 1.12;
}

.customize-audio {
  width: fit-content;
  max-width: 100%;
  justify-self: end;
  overflow: hidden;
  display: grid;
  border-radius: 14px;
  border: 1px solid rgba(146, 66, 37, 0.32);
  background: #1b0d0a;
  padding: 0;
  box-shadow: inset 0 0 0 1px rgba(226, 190, 137, 0.18);
}

.audio-wallpaper-image {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: clamp(360px, 45vw, 620px);
  object-fit: contain;
}

.customize-audio audio {
  display: block;
  width: 100%;
  margin: 0;
  min-height: 54px;
  border-radius: 0;
  background: transparent;
  accent-color: #b87446;
}

.customize-audio audio::-webkit-media-controls-enclosure {
  border-radius: 0 0 14px 14px;
  background: linear-gradient(120deg, #2c120d, #4a2118);
}

.customize-audio audio::-webkit-media-controls-panel {
  background: linear-gradient(120deg, #2c120d, #4a2118);
}

.customize-audio audio::-webkit-media-controls-current-time-display,
.customize-audio audio::-webkit-media-controls-time-remaining-display {
  color: #f3d2a3;
  text-shadow: none;
}

.customize-audio audio::-webkit-media-controls-play-button,
.customize-audio audio::-webkit-media-controls-mute-button {
  border-radius: 999px;
  background-color: rgba(214, 158, 92, 0.2);
}

.customize-audio audio::-webkit-media-controls-timeline,
.customize-audio audio::-webkit-media-controls-volume-slider {
  filter: sepia(1) saturate(1.35) hue-rotate(-14deg);
}

.customize-open {
  margin-top: 0;
}

.coming-soon-button {
  opacity: 0.85;
  cursor: not-allowed;
  filter: grayscale(0.12);
  pointer-events: none;
}

.applied-chip {
  margin: 1rem 0 0;
  padding-top: 0.8rem;
  border-top: 1px dashed rgba(140, 64, 34, 0.32);
  color: #e0b278;
  font-family: "Cinzel", serif;
}

.support-shell {
  min-height: 100svh;
  width: 100%;
  margin: 0;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 3rem);
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.8fr);
  gap: clamp(1rem, 2.3vw, 1.6rem);
  align-content: center;
}

.contact-shell {
  min-height: 100svh;
  width: 100%;
  margin: 0;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 3rem);
  display: grid;
  align-content: center;
  justify-items: center;
}

.contact-shell :deep(.site-footer) {
  width: min(1220px, 100%);
}

.motif-divider {
  height: 16px;
  margin: 0 auto 1rem;
  max-width: 680px;
  opacity: 0.72;
  background-image:
    radial-gradient(circle at 8px 8px, rgba(131, 56, 33, 0.36) 0 2.6px, transparent 2.6px),
    radial-gradient(circle at 24px 8px, rgba(206, 160, 95, 0.46) 0 2.2px, transparent 2.2px),
    linear-gradient(to right, transparent, rgba(145, 62, 35, 0.38) 24%, rgba(206, 160, 95, 0.6) 50%, rgba(145, 62, 35, 0.38) 76%, transparent);
  background-size: 32px 16px, 32px 16px, 100% 2px;
  background-repeat: repeat-x;
  background-position: 0 0, 0 0, 0 7px;
}

.contact-panel {
  width: min(1220px, 100%);
  border-radius: 20px;
  border: 1px solid rgba(141, 63, 36, 0.24);
  background:
    linear-gradient(140deg, rgba(36, 18, 14, 0.94), rgba(20, 10, 8, 0.95)),
    repeating-linear-gradient(
      45deg,
      rgba(159, 79, 46, 0.03) 0,
      rgba(159, 79, 46, 0.03) 2px,
      transparent 2px,
      transparent 10px
    );
  box-shadow:
    0 16px 32px rgba(17, 8, 6, 0.42),
    inset 0 0 0 1px rgba(226, 186, 127, 0.28);
  padding: clamp(1.2rem, 3vw, 2rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
  gap: clamp(1rem, 2vw, 1.5rem);
}

.contact-note {
  margin: 0.75rem 0 1rem;
  font-size: clamp(1.03rem, 1.9vw, 1.15rem);
  line-height: 1.5;
  color: #ead5b6;
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.contact-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  text-decoration: none;
  border-radius: 50%;
  border: 1px solid rgba(144, 63, 35, 0.35);
  color: #ffebcd;
  background: rgba(39, 20, 16, 0.82);
  transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.contact-links a:hover,
.contact-links a:focus-visible {
  transform: translateY(-1px);
  background: linear-gradient(120deg, rgba(255, 232, 196, 0.9), rgba(242, 205, 141, 0.78));
}

.contact-links a svg {
  width: 1.15rem;
  height: 1.15rem;
  display: block;
}

.contact-form {
  display: grid;
  gap: 1rem;
  max-width: 100%;
}

.contact-form label {
  display: block;
  margin-bottom: 0.3rem;
  font-family: "Cinzel", serif;
  font-size: 0.95rem;
  color: #dfb27a;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  min-height: 3rem;
  border-radius: 14px;
  border: 1px solid rgba(141, 63, 36, 0.33);
  background: rgba(246, 231, 207, 0.95);
  padding: 0.9rem 1rem;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  color: var(--deep-brown);
  box-shadow: inset 0 1px 2px rgba(17, 8, 6, 0.08);
}

.contact-form textarea {
  resize: vertical;
  min-height: 11rem;
}

.contact-form input:focus-visible,
.contact-form textarea:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--gold-muted) 72%, #fff);
  outline-offset: 2px;
}

.contact-form button {
  margin-top: 0.5rem;
  min-height: 3rem;
  border-radius: 12px;
  border: 1px solid rgba(117, 45, 23, 0.65);
  background: linear-gradient(120deg, #8f4124, #6e2a16);
  color: #fff5e8;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  padding: 0 1.4rem;
  width: min-content;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.contact-form button:hover,
.contact-form button:focus-visible {
  transform: translateY(-1px);
  background: linear-gradient(120deg, #a15b33, #7f371c);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.slide-nav {
  position: fixed;
  right: clamp(0.6rem, 1.6vw, 1.2rem);
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  gap: 0.42rem;
  z-index: 20;
}

.slide-dot {
  width: 0.72rem;
  height: 0.72rem;
  border-radius: 999px;
  border: 1px solid rgba(210, 165, 101, 0.7);
  background: rgba(242, 214, 171, 0.28);
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease;
}

.slide-dot.active {
  transform: scale(1.2);
  background: rgba(229, 182, 113, 0.95);
}

.support-panel {
  border-radius: 20px;
  border: 1px solid rgba(141, 63, 36, 0.24);
  background:
    linear-gradient(140deg, rgba(36, 18, 14, 0.94), rgba(20, 10, 8, 0.95)),
    radial-gradient(circle at 90% 12%, rgba(214, 170, 106, 0.2), transparent 44%);
  box-shadow:
    0 18px 36px rgba(17, 8, 6, 0.42),
    inset 0 0 0 1px rgba(223, 188, 136, 0.3);
  padding: clamp(1.25rem, 2.7vw, 2rem);
}

.support-copy h2 {
  margin-top: 0.45rem;
}

.support-note {
  margin: 0.8rem 0 1rem;
  font-size: clamp(1.03rem, 1.9vw, 1.18rem);
  line-height: 1.5;
  color: #f5e1c0;
}

.support-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.02rem;
  color: #ffe6c4;
}

.support-toggle input {
  width: 1.05rem;
  height: 1.05rem;
  accent-color: var(--terracotta);
}

.support-message {
  margin: 0.9rem 0 0;
  font-family: "Cinzel", serif;
  color: #ffcc8b;
  letter-spacing: 0.01em;
}

.support-picker {
  margin-top: 1.2rem;
  border-top: 1px solid rgba(157, 89, 50, 0.28);
  padding-top: 1rem;
  transition: opacity 220ms ease;
}

.support-picker.disabled {
  opacity: 0.55;
}

.picker-label {
  margin: 0;
  font-family: "Cinzel", serif;
  color: #efdbbc;
}

.gift-options {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.gift-pill {
  position: relative;
  display: inline-flex;
}

.gift-pill input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.gift-pill span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.4rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(145, 65, 37, 0.35);
  background: rgba(255, 244, 229, 0.86);
  font-family: "Cinzel", serif;
  color: #73311d;
  transition: all 220ms ease;
}

.gift-pill input:checked + span {
  border-color: rgba(176, 120, 52, 0.92);
  background: linear-gradient(120deg, rgba(243, 215, 170, 0.9), rgba(221, 173, 101, 0.78));
  box-shadow: 0 7px 16px rgba(113, 49, 24, 0.2);
  transform: translateY(-1px);
}

.gift-pill input:focus-visible + span {
  outline: 2px solid color-mix(in srgb, var(--gold-muted) 80%, #fff);
  outline-offset: 2px;
}

.custom-wrap {
  margin-top: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 240px;
}

.custom-wrap span {
  font-size: 0.97rem;
  color: #e4c39a;
}

.custom-wrap input {
  min-height: 2.5rem;
  border-radius: 10px;
  border: 1px solid rgba(139, 62, 35, 0.34);
  background: rgba(255, 249, 240, 0.9);
  padding: 0.45rem 0.65rem;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.03rem;
  color: var(--deep-brown);
}

.custom-wrap input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--gold-muted) 72%, #fff);
  outline-offset: 2px;
}

.cart-summary {
  position: sticky;
  top: 1.2rem;
  align-self: start;
  border-radius: 18px;
  border: 1px solid rgba(141, 63, 36, 0.24);
  background: linear-gradient(145deg, rgba(29, 14, 11, 0.96), rgba(18, 9, 7, 0.96));
  box-shadow:
    0 16px 30px rgba(102, 43, 22, 0.13),
    inset 0 0 0 1px rgba(227, 188, 130, 0.37);
  padding: 1.15rem 1rem 1.2rem;
}

.cart-summary h3 {
  margin: 0 0 0.8rem;
  font-family: "Cinzel", serif;
  color: #feeac8;
}

.policy-banner {
  margin: 0 0 0.9rem;
  padding: 0.5rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(176, 126, 55, 0.42);
  background: linear-gradient(120deg, rgba(249, 232, 204, 0.8), rgba(241, 210, 159, 0.66));
  font-size: 0.95rem;
  color: #402017;
}

.summary-row,
.summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.summary-row {
  padding: 0.5rem 0;
  color: #f6e1c0;
}

.support-line {
  border-top: 1px dashed rgba(149, 79, 45, 0.3);
  border-bottom: 1px dashed rgba(149, 79, 45, 0.3);
}

.summary-total {
  margin-top: 0.7rem;
  padding-top: 0.7rem;
  border-top: 1px solid rgba(149, 79, 45, 0.36);
  font-family: "Cinzel", serif;
  color: #ffeac7;
}

.coupon-box {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed rgba(149, 79, 45, 0.33);
}

.coupon-box label {
  display: block;
  margin-bottom: 0.35rem;
  font-family: "Cinzel", serif;
  font-size: 0.92rem;
  color: #dfb27a;
}

.coupon-actions {
  display: flex;
  gap: 0.45rem;
}

.coupon-actions input {
  flex: 1;
  min-height: 2.35rem;
  border-radius: 10px;
  border: 1px solid rgba(139, 62, 35, 0.34);
  background: rgba(246, 231, 207, 0.94);
  padding: 0.4rem 0.55rem;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  color: var(--deep-brown);
}

.coupon-actions input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--gold-muted) 70%, #fff);
  outline-offset: 2px;
}

.coupon-button {
  min-height: 2.35rem;
  border-radius: 10px;
  border: 1px solid rgba(117, 45, 23, 0.65);
  background: linear-gradient(120deg, #8f4124, #6e2a16);
  color: #fff5e8;
  padding: 0.45rem 0.8rem;
  font-family: "Cinzel", serif;
  cursor: pointer;
}

.coupon-feedback {
  margin: 0.45rem 0 0;
  font-size: 0.94rem;
  color: #f1d3aa;
}

.coupon-feedback.valid {
  color: #ffd89f;
}

.cod-note {
  margin: 0.75rem 0 0;
  padding-top: 0.65rem;
  border-top: 1px dashed rgba(149, 79, 45, 0.33);
  font-size: 0.94rem;
  color: #f3ca96;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(42, 19, 14, 0.52);
  backdrop-filter: blur(2px);
}

.customize-modal {
  position: relative;
  width: min(680px, 100%);
  max-height: min(90vh, 820px);
  overflow: auto;
  border-radius: 20px;
  border: 1px solid rgba(143, 67, 38, 0.28);
  background:
    linear-gradient(145deg, rgba(38, 19, 15, 0.97), rgba(19, 10, 8, 0.97)),
    repeating-linear-gradient(
      -45deg,
      rgba(216, 170, 102, 0.06) 0,
      rgba(216, 170, 102, 0.06) 2px,
      transparent 2px,
      transparent 10px
    );
  padding: clamp(1.2rem, 2.8vw, 2rem);
  box-shadow:
    0 25px 55px rgba(47, 19, 11, 0.34),
    inset 0 0 0 1px rgba(229, 190, 134, 0.5);
}

.modal-close {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  border: 1px solid rgba(138, 57, 29, 0.35);
  background: rgba(245, 225, 194, 0.9);
  color: #4f1c11;
  width: 2.05rem;
  height: 2.05rem;
  border-radius: 999px;
  cursor: pointer;
}

.modal-group {
  margin-top: 1.15rem;
}

.color-select {
  margin-top: 0.6rem;
  width: 100%;
  min-height: 2.7rem;
  border-radius: 11px;
  border: 1px solid rgba(144, 66, 38, 0.35);
  background: rgba(246, 231, 207, 0.94);
  color: var(--deep-brown);
  font-family: "Cormorant Garamond", serif;
  font-size: 1.05rem;
  padding: 0.5rem 0.65rem;
}

.color-select:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--gold-muted) 75%, #fff);
  outline-offset: 2px;
}

.modal-estimate {
  margin-top: 1.25rem;
  border-radius: 12px;
  border: 1px solid rgba(156, 76, 45, 0.24);
  background: rgba(41, 21, 16, 0.75);
  padding: 0.8rem 0.9rem;
}

.modal-estimate p {
  margin: 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.8rem;
  color: #fde6c2;
}

.modal-estimate p + p {
  margin-top: 0.45rem;
}

.exclusivity-note {
  margin: 1rem 0 0;
  font-family: "Cinzel", serif;
  color: #f5c888;
  line-height: 1.4;
}

.modal-actions {
  margin-top: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.modal-action {
  margin-top: 0;
}

.modal-link {
  border: 0;
  background: transparent;
  color: #e6c08b;
  font-family: "Cinzel", serif;
  padding: 0.4rem 0.2rem;
  cursor: pointer;
}

.features-header {
  width: min(1220px, 100%);
  text-align: center;
  margin: 0 auto clamp(1.25rem, 2.6vw, 2rem);
  max-width: 860px;
  color: #f0c78f;
}

h2 {
  margin: 0.55rem 0 0;
  font-family: "Cinzel", serif;
  font-size: clamp(1.6rem, 3.8vw, 2.4rem);
  line-height: 1.2;
  color: #c57a47;
}

.features-grid {
  width: min(1220px, 100%);
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(0.8rem, 1.4vw, 1rem);
}

.feature-card {
  padding: 1.1rem 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid rgba(141, 63, 36, 0.24);
  background:
    linear-gradient(145deg, rgba(36, 18, 14, 0.94), rgba(20, 10, 8, 0.95)),
    repeating-linear-gradient(
      -45deg,
      rgba(214, 170, 106, 0.06) 0,
      rgba(214, 170, 106, 0.06) 2px,
      transparent 2px,
      transparent 10px
    );
  box-shadow:
    0 10px 26px rgba(15, 8, 6, 0.38),
    inset 0 0 0 1px rgba(218, 179, 129, 0.25);
  transition: transform 280ms ease, box-shadow 280ms ease, border-color 280ms ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(168, 107, 50, 0.6);
  box-shadow:
    0 18px 30px rgba(88, 34, 17, 0.2),
    inset 0 0 0 1px rgba(228, 188, 122, 0.55);
}

.feature-icon {
  width: 2.9rem;
  height: 2.9rem;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  color: #5c2214;
  background: linear-gradient(130deg, rgba(244, 218, 176, 0.96), rgba(210, 163, 92, 0.82));
  border: 1px solid rgba(182, 132, 69, 0.6);
  box-shadow: 0 8px 14px rgba(122, 59, 33, 0.14);
  margin-bottom: 0.8rem;
}

.feature-icon :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
}

.feature-card h3 {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: 1.04rem;
  line-height: 1.28;
  color: #ffebca;
}

.feature-card p {
  margin: 0.45rem 0 0;
  font-size: 1.04rem;
  line-height: 1.45;
  color: #f3ddb9;
}

.motif-top {
  top: 1rem;
}

.motif-bottom {
  bottom: 1rem;
  transform: scaleY(-1);
}

.fade-in-panel {
  opacity: 0;
  animation: fadeInPanel 850ms ease forwards;
}

.fade-in-up {
  opacity: 0;
  transform: translateY(16px);
  animation: fadeInUp 700ms ease forwards;
}

.delay-1 {
  animation-delay: 220ms;
}

.delay-2 {
  animation-delay: 420ms;
}

.delay-3 {
  animation-delay: 620ms;
}

.delay-4 {
  animation-delay: 800ms;
}

@keyframes fadeInPanel {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.995);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes revealLine {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes softGlow {
  0%,
  100% {
    text-shadow: 0 0 0 rgba(215, 162, 88, 0);
  }

  50% {
    text-shadow: 0 0 12px rgba(215, 162, 88, 0.25);
  }
}

@media (max-width: 640px) {
  .hero-panel {
    padding-block: 2.6rem;
  }

  .motif {
    opacity: 0.58;
  }

  .cta {
    width: 100%;
  }

  .features-shell {
    padding-top: 0.65rem;
  }
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .support-shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .contact-panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .customize-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .customize-audio {
    max-width: 100%;
    justify-self: center;
  }

  .audio-wallpaper-image {
    max-height: clamp(320px, 62vw, 520px);
  }

  .brand-masthead {
    min-height: 16svh;
  }

  .slide-nav {
    right: 0.45rem;
  }
}

@media (max-width: 680px) {
  .brand-masthead {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: 0.55rem;
  }

  .brand-left,
  .brand-lockup {
    justify-self: center;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .modal-estimate p {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
  }

  .slide-nav {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-panel,
  .fade-in-up {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .cta {
    transition: none;
  }

  .feature-card {
    transition: none;
  }

  .gift-pill span,
  .support-picker,
  .feature-card,
  .customize-modal,
  .customize-panel,
  .contact-links a,
  .welcome-line,
  .living-line,
  .slide-dot,
  .story-track {
    transition: none;
    animation: none;
    opacity: 1;
    transform: none;
  }

  .page-shell {
    scroll-behavior: auto;
  }
}
</style>
