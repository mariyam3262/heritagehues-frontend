<template>
  <main class="cart-page">
    <header class="cart-header">
      <a :href="explorePath">Back to Explore</a>
      <h1>Your Cart</h1>
    </header>

    <div class="cart-content">
      <section v-if="cartItems.length" class="cart-layout">
        <article class="cart-items">
          <div v-for="item in cartItems" :key="item.slug" class="cart-item">
            <div
              class="thumb"
              :style="item.photos && item.photos[0] ? { backgroundImage: `url(${item.photos[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
              aria-hidden="true"
            ></div>
            <div class="meta">
              <p class="cat">{{ item.category }}</p>
              <h2>{{ item.title }}</h2>
              <div class="price-section">
                <p class="price">{{ formatInr(item.unit_price) }}</p>
                <small class="gst-note">Inclusive of all taxes</small>
              </div>
              <p class="stock-note" :class="{ sold: item.available_stock <= 0, scarce: item.available_stock === 1 }">
                {{
                  item.available_stock <= 0
                    ? 'Out of stock'
                    : item.available_stock === 1
                      ? 'Only 1 left in stock'
                      : `${item.available_stock} left in stock`
                }}
              </p>
              <div class="qty-row">
                <button type="button" @click="decrease(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button type="button" :disabled="item.available_stock <= 0 || item.quantity >= item.available_stock" @click="increase(item)">+</button>
                <button type="button" class="remove" @click="remove(item.product_id || item.slug)">Remove</button>
              </div>
            </div>
          </div>
        </article>

        <aside class="summary">
          <h3>Order Summary</h3>
          <p class="line"><span>Total</span><strong>{{ formatInr(total) }}</strong></p>
          <p class="summary-note">Inclusive of all taxes</p>
          <p class="summary-note">Free Delivery</p>
          <p class="summary-note">Premium Packaging Included</p>
          <p v-if="checkoutError" class="checkout-error">{{ checkoutError }}</p>
          <button type="button" class="checkout" :disabled="isCheckingOut" @click="handleCheckout">
            {{ isCheckingOut ? 'Opening Checkout...' : 'Proceed to Checkout' }}
          </button>
          <button type="button" class="clear" @click="clearCartItems">Clear Cart</button>
        </aside>
      </section>

      <section v-else class="empty">
        <h2>No Products in Cart</h2>
        <p>Your cart is currently empty. Add a Bandhani piece to continue checkout.</p>
        <a :href="explorePath">Explore Collection</a>
      </section>
    </div>
    <SiteFooter />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { fetchCart, removeCartItem, updateCartItem } from '../api/products'
import { useSeo } from '../seo'
import { buildCheckoutPath, buildExplorePath } from '../utils/routes'
import { clearCart, setCartCount } from '../utils/cartStore'
import SiteFooter from './SiteFooter.vue'

const cartItems = ref([])
const isCheckingOut = ref(false)
const checkoutError = ref('')
const explorePath = buildExplorePath()
const total = computed(() =>
  cartItems.value.reduce((sum, item) => sum + Number(item.line_total || 0), 0)
)

useSeo({
  title: 'Your Cart',
  path: '/cart',
  description: 'Review your Heritage Hues cart, inclusive pricing, premium packaging, and a secure checkout path.',
})

const load = async () => {
  const cart = await fetchCart()
  cartItems.value = Array.isArray(cart.items) ? cart.items : []
  const count = cartItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
  setCartCount(count)
}

const increase = (item) => {
  if (item.quantity >= item.available_stock) return
  updateCartItem(item.product_id || item.slug, (item.quantity || 1) + 1).then(syncCart).catch((error) => {
    checkoutError.value = error.message || 'Unable to update quantity'
  })
}
const decrease = (item) => updateCartItem(item.product_id || item.slug, Math.max(1, (item.quantity || 1) - 1)).then(syncCart).catch((error) => {
  checkoutError.value = error.message || 'Unable to update quantity'
})
const remove = (itemRef) => removeCartItem(itemRef).then(syncCart).catch((error) => {
  checkoutError.value = error.message || 'Unable to remove item'
})
const clearCartItems = async () => {
  await Promise.all(cartItems.value.map((item) => removeCartItem(item.product_id || item.slug).catch(() => null)))
  clearCart()
  syncCart()
}

const syncCart = () => {
  checkoutError.value = ''
  load().catch((error) => {
    checkoutError.value = error.message || 'Failed to refresh cart'
  })
}

const handleCheckout = async () => {
  checkoutError.value = ''
  isCheckingOut.value = true

  try {
    const cart = await fetchCart()
    const sessionId = String(cart?.session_id || '').trim()
    window.location.href = buildCheckoutPath(sessionId)
  } catch (error) {
    checkoutError.value = error.message || 'Unable to open checkout'
  } finally {
    isCheckingOut.value = false
  }
}

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

onMounted(() => {
  syncCart()
  window.addEventListener('cart-updated', syncCart)
})

onBeforeUnmount(() => {
  window.removeEventListener('cart-updated', syncCart)
})
</script>

<style scoped>
.cart-page {
  min-height: 100svh;
  padding: clamp(1rem, 2.5vw, 2rem) clamp(1rem, 4vw, 3rem);
  background: #dcc39a;
  color: #2d1813;
  display: flex;
  flex-direction: column;
}

.cart-content {
  flex: 1;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.cart-header a {
  color: #6f2a1d;
  text-decoration: none;
}

.cart-header h1 {
  margin: 0;
}

.cart-layout {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
  gap: 0.8rem;
}

.cart-items {
  display: grid;
  gap: 0.65rem;
}

.cart-item {
  border-radius: 14px;
  border: 1px solid rgba(147, 76, 44, 0.28);
  background: rgba(255, 245, 229, 0.84);
  padding: 0.65rem;
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 0.7rem;
}

.thumb {
  border-radius: 10px;
  min-height: 110px;
}

.meta h2 {
  margin: 0.25rem 0 0;
  font-size: 1.1rem;
}

.cat {
  margin: 0;
  font-size: 0.8rem;
  color: #7b3925;
}

.price {
  margin: 0.3rem 0 0;
  color: #6f2b1c;
}

.price-meta {
  margin: 0.18rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.prev-price {
  color: #9f786a;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.discount-chip {
  color: #8f2519;
  font-size: 0.86rem;
}

.stock-note {
  margin: 0.25rem 0 0;
  color: #7b3925;
}

.stock-note.sold {
  color: #8f2519;
}

.stock-note.scarce {
  color: #7a160c;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.qty-row {
  margin-top: 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.qty-row button {
  border-radius: 999px;
  border: 1px solid rgba(145, 74, 43, 0.45);
  background: #fff0d6;
  min-width: 2rem;
  min-height: 2rem;
  cursor: pointer;
}

.qty-row .remove {
  border-radius: 8px;
  min-width: auto;
  padding: 0 0.55rem;
}

.summary {
  border-radius: 14px;
  border: 1px solid rgba(147, 76, 44, 0.28);
  background: rgba(255, 245, 229, 0.88);
  padding: 0.8rem;
  align-self: start;
}

.summary h3 {
  margin: 0 0 0.6rem;
}

.line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total {
  border-top: 1px solid rgba(147, 76, 44, 0.28);
  padding-top: 0.5rem;
  font-weight: 700;
}

.checkout,
.clear {
  width: 100%;
  min-height: 2.35rem;
  border-radius: 999px;
  border: 1px solid rgba(147, 76, 44, 0.45);
  cursor: pointer;
  margin-top: 0.6rem;
}

.checkout {
  background: linear-gradient(120deg, #a74030, #6f251b);
  color: #fff1db;
}

.checkout:disabled {
  opacity: 0.75;
  cursor: wait;
}

.checkout-error {
  margin: 0.75rem 0 0;
  color: #8f2519;
}

.clear {
  background: rgba(255, 239, 213, 0.9);
}

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

.payment-sheet h2 {
  margin: 0;
  color: #5f2215;
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
}

.empty {
  margin-top: 1.4rem;
  min-height: 46vh;
  display: grid;
  place-content: center;
  justify-items: start;
  gap: 0.4rem;
}

.empty h2 {
  margin: 0;
  color: #5f2215;
}

.empty p {
  margin: 0;
  max-width: 58ch;
  color: #4a2a21;
}

.empty a {
  margin-top: 0.15rem;
  color: #6f2a1d;
  text-decoration: none;
  font-family: "Cinzel", serif;
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
