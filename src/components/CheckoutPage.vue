<template>
  <main class="checkout-page">
    <header class="checkout-header">
      <a :href="cartPath">Back to Cart</a>
      <h1>Checkout</h1>
    </header>

    <nav class="payment-steps" aria-label="Payment process">
      <span class="step done">1</span>
      <span class="step active">2</span>
      <span class="step" :class="{ active: activeUpiOrder }">3</span>
      <span class="step">4</span>
    </nav>

    <p v-if="error" class="status error">{{ error }}</p>
    <p v-if="success" class="status success">{{ success }}</p>

    <section class="checkout-layout">
      <form class="address-panel" @submit.prevent="refreshSummary">
        <h2>Step 1: Address</h2>
        <div class="field-grid">
          <label>Name<input v-model.trim="address.name" required /></label>
          <label>Phone<input v-model.trim="address.phone" required /></label>
          <label class="full">Address<textarea v-model.trim="address.address" rows="3" required></textarea></label>
          <label>City<input v-model.trim="address.city" required /></label>
          <label>State<input v-model.trim="address.state" required /></label>
          <label>Pincode<input v-model.trim="address.pincode" required /></label>
        </div>
        <button type="submit" class="secondary icon-action" aria-label="Update summary" title="Update summary">
          <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 4v6h-6" />
          </svg>
        </button>
      </form>

      <aside class="summary-panel">
        <h2>Step 2: Order Summary</h2>
        <div v-if="loading" class="summary-state">Loading checkout...</div>
        <template v-else>
          <div v-for="item in summary.items" :key="item.product_id || item.slug" class="summary-item">
            <p>{{ item.title }}</p>
            <small>{{ item.quantity }} x {{ formatInr(item.unit_price) }}</small>
            <strong>{{ formatInr(item.line_total) }}</strong>
          </div>
          <div class="summary-notes">
            <p v-for="note in summary.notes" :key="note">{{ note }}</p>
          </div>
          <p class="total-line"><span>Total</span><strong>{{ formatInr(summary.total_amount) }}</strong></p>

          <section class="upi-panel">
            <p class="upi-kicker">Secure UPI Payment</p>
            <div class="upi-icons" aria-label="Supported UPI apps">
              <span>GPay</span>
              <span>PhonePe</span>
              <span>Paytm</span>
            </div>
            <p class="upi-amount">{{ formatInr(summary.total_amount) }}</p>
            <button
              type="button"
              class="pay icon-action"
              :disabled="paying || loading || confirming"
              :aria-label="paying ? 'Preparing UPI payment' : 'Pay via UPI'"
              :title="paying ? 'Preparing UPI payment' : 'Pay via UPI'"
              @click="startUpiPayment"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
              </svg>
            </button>
            <p class="upi-copy">After payment, enter transaction ID to confirm your order</p>
            <p class="policy-note"><strong>No Return Policy:</strong> Orders placed on this payment page are non-returnable.</p>
          </section>
        </template>
      </aside>
    </section>

    <section v-if="activeUpiOrder" class="payment-panel">
      <div class="payment-panel-head">
        <div>
          <p class="upi-kicker">Step 3: Payment</p>
          <h2>Complete your UPI payment</h2>
        </div>
        <strong>{{ formatInr(activeUpiOrder.amount) }}</strong>
      </div>

      <div class="payment-layout">
        <div class="payment-card">
          <p class="payment-text">Use your preferred UPI app to pay securely.</p>
          <p class="policy-note"><strong>No Return Policy:</strong> Orders placed on this payment page are non-returnable.</p>
          <div class="payment-meta">
            <p><span>Order</span><strong>{{ activeUpiOrder.order_ref }}</strong></p>
          </div>
          <button type="button" class="pay icon-action" aria-label="Open UPI app" title="Open UPI app" @click="openUpiAgain">
            <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </button>
          <button type="button" class="secondary subtle icon-action" aria-label="Copy payment details" title="Copy payment details" @click="copyUpiDetails">
            <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 8h11v11H8z" />
              <path d="M5 15H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1" />
            </svg>
          </button>
        </div>

        <div class="payment-card qr-card">
          <template v-if="isMobile">
            <p class="payment-text">Your UPI app should open automatically on this device.</p>
          </template>
          <template v-else>
            <p class="payment-text">Desktop detected. Scan this QR code on your phone to pay.</p>
            <img class="qr-image" :src="qrImageSrc" alt="UPI payment QR code" />
          </template>
        </div>
      </div>

      <div class="confirm-card">
        <button type="button" class="pay icon-action" :disabled="confirming" aria-label="I have completed payment" title="I have completed payment" @click="showTransactionForm = true">
          <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>

        <form v-if="showTransactionForm" class="transaction-form" @submit.prevent="submitTransactionId">
          <label>
            Transaction ID
            <input v-model.trim="transactionId" placeholder="Enter UPI transaction ID" required />
          </label>
          <button
            type="submit"
            class="pay icon-action"
            :disabled="confirming"
            :aria-label="confirming ? 'Submitting transaction ID' : 'Confirm order'"
            :title="confirming ? 'Submitting transaction ID' : 'Confirm order'"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </button>
        </form>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { clearCart, setCartCount } from '../utils/cartStore'
import { confirmUpiPayment, createUpiOrder, fetchCheckoutSummary, fetchUpiLink, getSessionId } from '../api/products'
import { useSeo } from '../seo'
import { buildCartPath, buildCheckoutSuccessPath, getCurrentCheckoutSessionId } from '../utils/routes'
import SiteFooter from './SiteFooter.vue'

const getLocalCurrentUser = () => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem('heritage_hues_user')
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

const currentUser = getLocalCurrentUser()

const sessionId = getCurrentCheckoutSessionId() || getSessionId()
const cartPath = buildCartPath()

const address = ref({
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  email: currentUser?.email || '',
})

const summary = ref({ items: [], total_amount: 0, notes: [] })
const loading = ref(true)
const paying = ref(false)
const confirming = ref(false)
const error = ref('')
const success = ref('')
const activeUpiOrder = ref(null)
const showTransactionForm = ref(false)
const transactionId = ref('')
const isMobile = /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent || '')

useSeo({
  title: 'Checkout',
  path: sessionId ? `/checkout/${encodeURIComponent(sessionId)}` : '/checkout',
  description: 'Complete your Heritage Hues order with secure UPI payment, free delivery, and premium packaging included.',
})

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

const qrImageSrc = ref('')
const buildQrImageSrc = (upiUrl) =>
  upiUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`
    : ''

const refreshSummary = async () => {
  loading.value = true
  error.value = ''
  try {
    summary.value = await fetchCheckoutSummary(sessionId, address.value)
    setCartCount(Array.isArray(summary.value.items) ? summary.value.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0)
  } catch (err) {
    error.value = err.message || 'Failed to load checkout summary'
  } finally {
    loading.value = false
  }
}

const redirectToSuccess = (orderRef, status = 'submitted', orderId = '') => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('heritage_hues_checkout_success', JSON.stringify({
      order_ref: orderRef,
      status,
      order_id: orderId,
    }))
  }
  window.location.href = buildCheckoutSuccessPath(orderId)
}

const launchUpi = (upiUrl) => {
  if (!upiUrl) return
  window.location.href = upiUrl
}

const copyUpiDetails = async () => {
  if (!activeUpiOrder.value) return
  const text = [
    `Amount: ${formatInr(activeUpiOrder.value.amount)}`,
    `Order Ref: ${activeUpiOrder.value.order_ref}`,
    `UPI Link: ${activeUpiOrder.value.upi_url}`,
  ].join('\n')
  try {
    await navigator.clipboard.writeText(text)
    success.value = 'UPI payment details copied.'
  } catch {
    error.value = 'Unable to copy payment details'
  }
}

const openUpiAgain = () => {
  if (!activeUpiOrder.value?.upi_url) return
  launchUpi(activeUpiOrder.value.upi_url)
}

const startUpiPayment = async () => {
  if (paying.value) return
  paying.value = true
  error.value = ''
  success.value = ''
  try {
    const order = await createUpiOrder(sessionId, address.value, currentUser)
    const linkResponse = await fetchUpiLink(order.order_id)
    activeUpiOrder.value = {
      order_id: order.order_id,
      order_ref: order.order_ref,
      amount: order.total_amount,
      status: 'pending',
      upi_url: linkResponse.upi_link,
      created_at: new Date().toISOString(),
    }
    qrImageSrc.value = buildQrImageSrc(activeUpiOrder.value.upi_url)
    showTransactionForm.value = false
    transactionId.value = ''
    success.value = isMobile ? 'Opening your UPI app...' : 'Scan the QR code or copy the UPI details to pay.'
    if (isMobile) {
      launchUpi(activeUpiOrder.value.upi_url)
    }
  } catch (err) {
    error.value = err.message || 'Unable to start UPI payment'
  } finally {
    paying.value = false
  }
}

const submitTransactionId = async () => {
  if (!activeUpiOrder.value) return
  confirming.value = true
  error.value = ''
  success.value = ''
  try {
    const response = await confirmUpiPayment({
      order_id: activeUpiOrder.value.order_id,
      transaction_id: transactionId.value,
    })
    clearCart()
    setCartCount(0)
    success.value = response.message || 'Payment submitted for verification.'
    redirectToSuccess(response.order_ref, response.status || 'submitted', response.order_id)
  } catch (err) {
    error.value = err.message || 'Unable to submit transaction ID'
  } finally {
    confirming.value = false
  }
}

onMounted(() => {
  refreshSummary()
})
</script>

<style scoped>
.checkout-page {
  min-height: 100svh;
  padding: clamp(1rem, 2.5vw, 2rem) clamp(1rem, 4vw, 3rem);
  background:
    radial-gradient(circle at top, rgba(124, 38, 28, 0.16), transparent 34%),
    #dcc39a;
  color: #2d1813;
  display: flex;
  flex-direction: column;
}

.checkout-header {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.checkout-header a {
  color: #6f2a1d;
  text-decoration: none;
}

.payment-steps {
  width: 100%;
  max-width: 1280px;
  margin: 0.85rem auto 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
}

.step {
  min-height: 0.42rem;
  border-radius: 999px;
  background: rgba(119, 53, 31, 0.22);
  color: transparent;
}

.step.done,
.step.active {
  background: linear-gradient(120deg, #a53a2e, #7d231e);
}

.checkout-layout {
  width: 100%;
  max-width: 1280px;
  margin: 1rem auto 0;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.9fr);
  gap: 1rem;
}

.address-panel,
.summary-panel,
.payment-panel {
  border-radius: 18px;
  border: 1px solid rgba(147, 76, 44, 0.28);
  background: rgba(255, 245, 229, 0.92);
  padding: 1rem;
  box-shadow: 0 16px 28px rgba(39, 16, 12, 0.08);
}

.payment-panel {
  width: 100%;
  max-width: 1280px;
  margin: 1rem auto 0;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.field-grid .full {
  grid-column: 1 / -1;
}

label {
  display: grid;
  gap: 0.3rem;
}

input,
textarea {
  width: 100%;
  border: 1px solid #dfc199;
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  font: inherit;
  background: rgba(255, 250, 241, 0.95);
}

.summary-item {
  display: grid;
  gap: 0.12rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(147, 76, 44, 0.12);
}

.summary-item p,
.summary-item small,
.total-line,
.summary-notes p,
.payment-text,
.policy-note,
.upi-copy,
.upi-kicker,
.upi-amount {
  margin: 0;
}

.summary-notes {
  margin-top: 0.8rem;
  display: grid;
  gap: 0.2rem;
  color: #6d3b2c;
}

.total-line {
  margin-top: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.upi-panel {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 16px;
  background: linear-gradient(145deg, #5c1f18, #3f140f);
  color: #fff1df;
}

.upi-kicker {
  color: #efc885;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
}

.upi-icons {
  margin-top: 0.65rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.upi-icons span {
  border-radius: 999px;
  padding: 0.32rem 0.7rem;
  border: 1px solid rgba(240, 201, 135, 0.3);
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.9rem;
}

.upi-amount {
  margin-top: 0.75rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
}

.payment-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.payment-layout {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.payment-card,
.confirm-card {
  border-radius: 16px;
  border: 1px solid rgba(147, 76, 44, 0.18);
  background: rgba(255, 250, 241, 0.9);
  padding: 1rem;
}

.payment-meta {
  margin: 0.8rem 0 1rem;
  display: grid;
  gap: 0.5rem;
}

.payment-meta p {
  margin: 0;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.payment-meta span {
  color: #7a4a3c;
}

.policy-note {
  margin-top: 0.9rem;
  font-weight: 700;
  color: #ffe2b8;
  line-height: 1.5;
}

.payment-card .policy-note {
  color: #8a2d1d;
}

.qr-card {
  text-align: center;
}

.qr-image {
  width: min(100%, 240px);
  margin-top: 0.9rem;
  border-radius: 14px;
  border: 1px solid rgba(147, 76, 44, 0.2);
  background: #fff;
  padding: 0.75rem;
}

.confirm-card {
  margin-top: 1rem;
}

.transaction-form {
  margin-top: 1rem;
  display: grid;
  gap: 0.8rem;
}

.status {
  margin-top: 0.75rem;
}

.status.error {
  color: #8a2d1d;
}

.status.success {
  color: #246b2a;
}

.secondary,
.pay {
  margin-top: 0.9rem;
  border: 0;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  cursor: pointer;
  color: #fff6e7;
  background: linear-gradient(120deg, #a53a2e, #7d231e);
}

.icon-action {
  width: 2.65rem;
  min-width: 2.65rem;
  min-height: 2.45rem;
  padding: 0;
  display: inline-grid;
  place-items: center;
}

.btn-icon {
  width: 1.12rem;
  height: 1.12rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.secondary.subtle {
  background: transparent;
  color: #7d231e;
  border: 1px solid rgba(125, 35, 30, 0.28);
}

@media (max-width: 860px) {
  .checkout-layout,
  .field-grid,
  .payment-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
