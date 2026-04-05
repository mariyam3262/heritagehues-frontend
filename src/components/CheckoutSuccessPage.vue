<template>
  <main class="success-page">
    <section class="success-card">
      <p class="eyebrow">{{ isSubmitted ? 'UPI Submitted' : 'Payment Successful' }}</p>
      <h1>{{ isSubmitted ? 'Your order is awaiting payment verification' : 'Your order is confirmed' }}</h1>
      <p class="message">
        {{
          isSubmitted
            ? 'Thank you for shopping with Heritage Hues. We have received your UPI transaction ID and will verify your payment shortly.'
            : 'Thank you for shopping with Heritage Hues. Your payment was verified successfully.'
        }}
      </p>
      <p v-if="orderRef" class="order-ref">Order Ref: <strong>{{ orderRef }}</strong></p>
      <div class="actions">
        <a href="/explore">Continue Shopping</a>
        <a href="/cart">View Cart</a>
        <a v-if="orderId" :href="buildOrderPath(orderId)">Track Order</a>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useSeo } from '../seo'
import { buildOrderPath, getCurrentCheckoutSuccessOrderId } from '../utils/routes'

const stored = typeof window !== 'undefined'
  ? window.sessionStorage.getItem('heritage_hues_checkout_success')
  : ''
let parsed = {}

if (stored) {
  try {
    parsed = JSON.parse(stored)
  } catch {
    parsed = {}
  }
}

const orderRef = parsed.order_ref || ''
const orderId = parsed.order_id || getCurrentCheckoutSuccessOrderId() || ''
const status = parsed.status || ''
const isSubmitted = status === 'submitted' || status === 'payment_submitted' || status === 'verification_pending'

useSeo({
  title: isSubmitted ? 'Payment Submitted' : 'Order Confirmed',
  path: orderId ? `/checkout/success/${encodeURIComponent(orderId)}` : '/checkout/success',
  description: isSubmitted
    ? 'Your Heritage Hues payment details were submitted successfully and are awaiting manual verification.'
    : 'Your Heritage Hues order has been confirmed successfully.',
})
</script>

<style scoped>
.success-page {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: #dcc39a;
}

.success-card {
  width: min(100%, 620px);
  border-radius: 20px;
  border: 1px solid rgba(147, 76, 44, 0.24);
  background: rgba(255, 245, 229, 0.94);
  padding: clamp(1.4rem, 4vw, 2rem);
  box-shadow: 0 18px 34px rgba(39, 16, 12, 0.14);
}

.eyebrow {
  margin: 0;
  color: #8a3a24;
  font-family: "Cinzel", serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.82rem;
}

h1 {
  margin: 0.55rem 0 0;
  color: #3a1c15;
  font-family: "Cinzel", serif;
}

.message,
.order-ref {
  margin: 0.9rem 0 0;
  color: #5b392f;
  line-height: 1.6;
}

.actions {
  margin-top: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.actions a {
  text-decoration: none;
  border-radius: 999px;
  padding: 0.72rem 1rem;
  background: linear-gradient(120deg, #a53a2e, #7d231e);
  color: #fff6e7;
}
</style>
