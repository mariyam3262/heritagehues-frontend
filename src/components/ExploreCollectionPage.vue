<template>
  <main class="explore-page">
    <header class="explore-hero">
      <div class="hero-top">
        <a class="back-link" href="/">Back to Home</a>
        <a class="header-cart" href="/cart" aria-label="Open cart">
          <span class="cart-icon" aria-hidden="true">🛒</span>
          <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
        </a>
      </div>
      <p class="eyebrow">Heritage Hues Collection</p>
      <h1>Explore the Bandhani Collection</h1>
      <p>
        Discover hand-tied artistry curated for everyday elegance, festive moments, and meaningful gifting.
      </p>
    </header>

    <section class="filter-strip" aria-label="Collection categories">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="filter-pill"
        :class="{ active: activeFilter === filter }"
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </section>

    <p v-if="loading" class="status-line">Loading products...</p>
    <p v-else-if="error" class="status-line error">{{ error }}</p>

    <section v-else class="collection-grid" aria-label="Bandhani products">
      <article v-for="item in filteredItems" :key="item.slug" class="collection-card">
        <img
          v-if="item.primaryPhoto"
          class="card-image"
          :src="item.primaryPhoto"
          :alt="`${item.title} by Heritage Hues`"
          loading="lazy"
          decoding="async"
        />
        <div v-else class="card-swatch" :style="item.visualStyles[0] || { background: item.gradient }" aria-hidden="true"></div>
        <p class="card-tag">{{ item.category }}</p>
        <h2>{{ item.title }}</h2>
        <p class="card-copy">{{ item.description }}</p>
        <p class="stock-note" :class="{ sold: item.isOutOfStock, scarce: !item.isOutOfStock && item.stockCount === 1 }">
          {{
            item.isOutOfStock
              ? 'Out of stock'
              : item.stockCount === 1
                ? 'Only 1 left in stock'
                : `${item.stockCount} left in stock`
          }}
        </p>
        <div class="card-foot">
          <div class="price-stack">
            <strong class="final-price">{{ item.price }}</strong>
            <small class="gst-note">{{ item.gstLabel }}</small>
            <span v-if="item.hasDiscount" class="prev-price">{{ item.basePrice }}</span>
            <span v-if="item.hasDiscount" class="discount-chip">{{ item.discountPercent }}% off</span>
          </div>
          <a class="details-link" :class="{ disabled: item.isOutOfStock }" :href="buildProductPath(item.slug)">View Details</a>
        </div>
      </article>
    </section>
    <SiteFooter />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { fetchCart, fetchProducts } from '../api/products'
import { useSeo } from '../seo'
import { buildProductPath } from '../utils/routes'
import { setCartCount } from '../utils/cartStore'
import SiteFooter from './SiteFooter.vue'

const activeFilter = ref('All')
const cartCount = ref(0)
const items = ref([])
const loading = ref(true)
const error = ref('')

useSeo({
  title: 'Explore Bandhani Collection',
  path: '/explore',
  description: 'Browse Heritage Hues Bandhani sarees and handcrafted drops with clean pricing, stock visibility, and artisan-led design.',
  keywords: [
    'Bandhani collection',
    'explore sarees',
    'handcrafted Bandhani',
    'Heritage Hues collection',
  ],
})

const filters = computed(() => {
  const categories = Array.from(new Set(items.value.map((item) => item.category).filter(Boolean)))
  return ['All', ...categories]
})

const filteredItems = computed(() =>
  activeFilter.value === 'All'
    ? items.value
    : items.value.filter((item) => item.category === activeFilter.value)
)

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

const loadProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    items.value = await fetchProducts()
  } catch (err) {
    error.value = err.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  syncCartCount()
  loadProducts()
  window.addEventListener('cart-updated', syncCartCount)
})

onBeforeUnmount(() => {
  window.removeEventListener('cart-updated', syncCartCount)
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap");

.explore-page {
  min-height: 100svh;
  padding: clamp(1rem, 2.6vw, 2rem) clamp(1rem, 4vw, 3rem) clamp(2rem, 5vw, 3.5rem);
  background: #dcc39a;
  color: #f7e2c2;
  display: flex;
  flex-direction: column;
}

.explore-hero {
  border-radius: 20px;
  border: 1px solid rgba(198, 154, 89, 0.38);
  padding: clamp(1rem, 2.8vw, 1.8rem);
  background:
    linear-gradient(130deg, rgba(50, 24, 19, 0.93), rgba(24, 12, 9, 0.95)),
    repeating-linear-gradient(
      45deg,
      rgba(202, 159, 94, 0.05) 0,
      rgba(202, 159, 94, 0.05) 2px,
      transparent 2px,
      transparent 10px
    );
  box-shadow: 0 20px 34px rgba(5, 2, 1, 0.35);
}

.back-link {
  display: inline-flex;
  text-decoration: none;
  color: #ffd89f;
  margin-bottom: 0.65rem;
}

.hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.header-cart,
.header-profile {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  border: 1px solid rgba(200, 157, 92, 0.52);
  background: rgba(37, 18, 14, 0.78);
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
  top: -0.22rem;
  right: -0.22rem;
  min-width: 0.95rem;
  height: 0.95rem;
  border-radius: 999px;
  background: #b54a36;
  color: #fff2db;
  font-size: 0.67rem;
  display: grid;
  place-items: center;
}

.eyebrow {
  margin: 0;
  font-family: "Cinzel", serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ecb86f;
  font-size: 0.88rem;
}

h1 {
  margin: 0.5rem 0 0;
  font-family: "Cinzel", serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: #ffebca;
}

.explore-hero p {
  margin: 0.65rem 0 0;
  font-size: clamp(1.05rem, 2.1vw, 1.3rem);
  line-height: 1.5;
  color: #f4dfbf;
}

.filter-strip {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  min-height: 2.2rem;
  border-radius: 999px;
  border: 1px solid rgba(201, 158, 92, 0.45);
  background: rgba(56, 27, 21, 0.76);
  color: #fce7c5;
  padding: 0.35rem 0.8rem;
  font-family: "Cinzel", serif;
  cursor: pointer;
}

.filter-pill.active {
  background: linear-gradient(120deg, #a34031, #6b231b);
  color: #fff2db;
}

.status-line {
  margin-top: 1rem;
  color: #5f2215;
}

.status-line.error {
  color: #8f2519;
}

.collection-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.collection-card {
  border-radius: 16px;
  border: 1px solid rgba(201, 158, 92, 0.34);
  background: linear-gradient(130deg, rgba(53, 25, 19, 0.9), rgba(24, 12, 9, 0.95));
  padding: 0.8rem;
  box-shadow: 0 12px 20px rgba(8, 3, 2, 0.32);
}

.card-image,
.card-swatch {
  width: 100%;
  min-height: 240px;
  border-radius: 12px;
}

.card-image {
  object-fit: cover;
  display: block;
}

.card-swatch {
  height: 132px;
  border-radius: 12px;
  border: 1px solid rgba(226, 185, 125, 0.35);
}

.card-tag {
  margin: 0.65rem 0 0;
  color: #efbf79;
  font-family: "Cinzel", serif;
  font-size: 0.78rem;
  letter-spacing: 0.07em;
}

h2 {
  margin: 0.35rem 0 0;
  font-family: "Cinzel", serif;
  color: #ffebca;
  font-size: 1.15rem;
}

.card-copy {
  margin: 0.45rem 0 0;
  color: #f0d7b3;
  line-height: 1.45;
}

.stock-note {
  margin: 0.5rem 0 0;
  color: #f9d7a4;
  font-size: 0.9rem;
}

.stock-note.sold {
  color: #ffb2a4;
}

.stock-note.scarce {
  color: #ffe7b8;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.card-foot {
  margin-top: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.price-stack {
  display: grid;
  gap: 0.12rem;
}

.card-foot strong.final-price {
  color: #cf9f64;
  font-size: 1.03rem;
  text-shadow: 0 1px 1px rgba(0,0,0,0.1);
}

.gst-note {
  font-size: 0.75em;
  color: #caa88f;
  font-style: italic;
}

.prev-price {
  color: #caa88f;
  font-size: 0.86rem;
  text-decoration: line-through;
}

.discount-chip {
  color: #ffd89f;
  font-size: 0.8rem;
}

.details-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  border-radius: 999px;
  border: 1px solid rgba(200, 157, 92, 0.52);
  background: linear-gradient(120deg, #8b3025, #5f1d17);
  color: #fff3dd;
  font-family: "Cinzel", serif;
  padding: 0.3rem 0.75rem;
  text-decoration: none;
}

.details-link.disabled {
  opacity: 0.75;
}

@media (max-width: 1024px) {
  .collection-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .collection-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
