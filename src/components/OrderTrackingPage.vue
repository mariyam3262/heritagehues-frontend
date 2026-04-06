<template>
  <main class="tracking-page">
    <header class="tracking-header">
      <a :href="explorePath">Back to Explore</a>
      <div class="tracking-heading">
        <p class="eyebrow">Heritage Hues</p>
        <h1>Order Tracking</h1>
      </div>
    </header>

    <p v-if="error" class="status error">{{ error }}</p>

    <section v-if="loading" class="tracking-layout skeleton-layout" aria-hidden="true">
      <article class="summary-card skeleton-card">
        <span class="skeleton eyebrow-line"></span>
        <span class="skeleton title-line"></span>
        <div class="summary-grid">
          <span class="skeleton block-line"></span>
          <span class="skeleton block-line"></span>
          <span class="skeleton block-line"></span>
          <span class="skeleton block-line"></span>
        </div>
      </article>

      <article class="timeline-card skeleton-card">
        <span class="skeleton eyebrow-line"></span>
        <div class="timeline">
          <div v-for="step in 6" :key="step" class="timeline-item upcoming">
            <div class="timeline-marker"><span class="skeleton circle-line"></span></div>
            <div class="timeline-content">
              <span class="skeleton timeline-line"></span>
              <span class="skeleton timeline-subline"></span>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section v-else-if="order" class="tracking-layout">
      <article class="summary-card hero-card">
        <div class="hero-top">
          <div>
            <p class="eyebrow">Order Summary</p>
            <h2>{{ order.order_ref }}</h2>
          </div>
          <strong class="status-badge" :class="badgeTone(order.status)">
            {{ statusLabel(order.status) }}
          </strong>
        </div>

        <div class="summary-grid">
          <p><span>Order Date</span><strong>{{ formatDate(order.created_at) }}</strong></p>
          <p><span>Total Amount</span><strong>{{ formatInr(order.total_amount) }}</strong></p>
          <p><span>Order ID</span><strong>{{ order.id || order.order_id || order.order_ref }}</strong></p>
          <p><span>Current Status</span><strong>{{ statusLabel(order.status) }}</strong></p>
        </div>
      </article>

      <article class="timeline-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Status Timeline</p>
            <h3>Your order journey</h3>
          </div>
          <p class="timeline-note">Completed steps are shown in green. The current step is highlighted in gold.</p>
        </div>

        <div class="timeline">
          <div
            v-for="(step, index) in timelineSteps"
            :key="step.value"
            class="timeline-item"
            :class="stepState(index)"
            :style="{ animationDelay: `${index * 90}ms` }"
          >
            <div class="timeline-marker">
              <span class="timeline-icon">{{ stepState(index) === 'completed' ? '✓' : step.icon }}</span>
            </div>
            <div class="timeline-content">
              <p class="timeline-title">{{ step.label }}</p>
              <p class="timeline-copy">
                {{
                  stepTimestamp(step.value)
                    ? formatDate(stepTimestamp(step.value))
                    : stepState(index) === 'active'
                      ? 'Current step'
                      : 'Awaiting update'
                }}
              </p>
            </div>
          </div>
        </div>
      </article>

      <article class="shipment-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Tracking Details</p>
            <h3>Shipment information</h3>
          </div>
        </div>

        <template v-if="order.tracking_id">
          <div class="shipment-grid">
            <p><span>Tracking ID</span><strong>{{ order.tracking_id }}</strong></p>
            <a
              v-if="order.tracking_url"
              class="track-button"
              :href="order.tracking_url"
              target="_blank"
              rel="noreferrer"
            >
              Track Shipment
            </a>
          </div>
        </template>
        <p v-else class="shipment-fallback">
          Your order is being prepared. Tracking will be available soon.
        </p>
      </article>
    </section>

    <section v-else class="empty-state">
      <h2>Order not found</h2>
      <p>The tracking link is invalid or this order is not available in your current session.</p>
      <a :href="explorePath">Continue Shopping</a>
    </section>

    <SiteFooter />
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchOrderDetails } from '../api/products'
import { useSeo } from '../seo'
import { buildExplorePath, getCurrentOrderId, replaceWithPath, buildOrderPath } from '../utils/routes'
import SiteFooter from './SiteFooter.vue'

const orderId = getCurrentOrderId()
const explorePath = buildExplorePath()

if (typeof window !== 'undefined' && window.location.pathname.toLowerCase() === '/order' && orderId) {
  replaceWithPath(buildOrderPath(orderId))
}

const order = ref(null)
const loading = ref(true)
const error = ref('')

useSeo({
  title: 'Track Your Order',
  path: orderId ? `/order/${encodeURIComponent(orderId)}` : '/order',
  description: 'Track your Heritage Hues order status, shipment updates, and delivery progress in one place.',
})

const timelineSteps = [
  { value: 'pending', label: 'Order Placed', icon: '•' },
  { value: 'confirmed', label: 'Confirmed', icon: '◌' },
  { value: 'packed', label: 'Packed', icon: '◌' },
  { value: 'shipped', label: 'Shipped', icon: '◌' },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: '◌' },
  { value: 'delivered', label: 'Delivered', icon: '◌' },
]

const statusOrder = timelineSteps.map((step) => step.value)

const activeStepIndex = computed(() => {
  const current = String(order.value?.status || 'pending')
  if (current === 'cancelled') return 0
  const index = statusOrder.indexOf(current)
  return index >= 0 ? index : 0
})

const statusLabel = (value) => {
  const labels = {
    pending: 'Order Placed',
    confirmed: 'Confirmed',
    packed: 'Packed',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
  }
  return labels[String(value || '')] || String(value || '')
}

const badgeTone = (value) => {
  if (value === 'delivered') return 'green'
  if (value === 'cancelled') return 'red'
  if (value === 'shipped' || value === 'out_for_delivery') return 'gold'
  return 'maroon'
}

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const stepTimestamp = (status) => {
  const history = Array.isArray(order.value?.status_history) ? order.value.status_history : []
  const match = history.find((entry) => entry.status === status)
  return match?.timestamp || ''
}

const stepState = (index) => {
  if (index < activeStepIndex.value) return 'completed'
  if (index === activeStepIndex.value) return 'active'
  return 'inactive'
}

const loadOrder = async () => {
  if (!orderId) {
    error.value = 'Order id is missing from the tracking link.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    order.value = await fetchOrderDetails(orderId)
  } catch (err) {
    error.value = err.message || 'Unable to load tracking details'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrder()
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap");

.tracking-page {
  min-height: 100svh;
  padding: clamp(1rem, 2.6vw, 2rem) clamp(1rem, 4vw, 3rem);
  background:
    radial-gradient(circle at top, rgba(210, 164, 95, 0.22), transparent 24%),
    linear-gradient(180deg, #4b1713 0%, #2a0d0a 44%, #180808 100%);
  color: #f7ebd4;
  display: flex;
  flex-direction: column;
}

.tracking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.tracking-header a {
  color: #e8c07e;
  text-decoration: none;
  font-family: "Cinzel", serif;
  font-size: 0.84rem;
}

.tracking-heading {
  text-align: right;
}

.tracking-layout {
  margin-top: 1.2rem;
  display: grid;
  gap: 1rem;
}

.summary-card,
.timeline-card,
.shipment-card,
.empty-state {
  border-radius: 24px;
  border: 1px solid rgba(224, 183, 117, 0.18);
  background:
    linear-gradient(145deg, rgba(90, 31, 25, 0.92), rgba(42, 13, 10, 0.96));
  padding: clamp(1.05rem, 3vw, 1.5rem);
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.28);
}

.hero-card {
  position: relative;
  overflow: hidden;
}

.hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 90% 10%, rgba(233, 191, 122, 0.16), transparent 28%),
    radial-gradient(circle at 5% 100%, rgba(233, 191, 122, 0.1), transparent 24%);
  pointer-events: none;
}

.hero-top,
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.eyebrow {
  margin: 0;
  color: #efc885;
  font-family: "Cinzel", serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
}

h1,
h2,
h3 {
  margin: 0.4rem 0 0;
  font-family: "Cinzel", serif;
}

h1 {
  font-size: clamp(1.45rem, 4vw, 2.2rem);
}

h2 {
  color: #fff5e3;
  font-size: clamp(1.25rem, 3vw, 1.8rem);
}

h3 {
  color: #fff1dc;
  font-size: 1.15rem;
}

.summary-grid,
.shipment-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.summary-grid p,
.shipment-grid p {
  margin: 0;
  display: grid;
  gap: 0.22rem;
  padding: 0.9rem 0.95rem;
  border-radius: 16px;
  background: rgba(255, 247, 232, 0.07);
  border: 1px solid rgba(232, 192, 126, 0.08);
}

.summary-grid span,
.shipment-grid span,
.timeline-note,
.timeline-copy,
.shipment-fallback {
  color: rgba(248, 234, 208, 0.74);
}

.summary-grid strong,
.shipment-grid strong {
  color: #fff6e6;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  font-family: "Cinzel", serif;
  font-size: 0.8rem;
}

.status-badge.maroon {
  background: rgba(162, 75, 56, 0.22);
  color: #ffd7c4;
}

.status-badge.gold {
  background: rgba(239, 200, 133, 0.18);
  color: #ffd997;
}

.status-badge.green {
  background: rgba(70, 155, 81, 0.16);
  color: #c5f3c6;
}

.status-badge.red {
  background: rgba(188, 77, 61, 0.16);
  color: #ffc7bc;
}

.timeline {
  margin-top: 1rem;
  display: grid;
  gap: 0.95rem;
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 3.25rem minmax(0, 1fr);
  gap: 0.9rem;
  align-items: start;
  opacity: 0;
  transform: translateY(10px);
  animation: timelineRise 420ms ease forwards;
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: 1.58rem;
  top: 2.3rem;
  bottom: -1.05rem;
  width: 2px;
  background: rgba(238, 205, 150, 0.18);
  transition: background 220ms ease, opacity 220ms ease;
}

.timeline-item:last-child::after {
  display: none;
}

.timeline-marker {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(235, 208, 165, 0.16);
  background: rgba(255, 245, 230, 0.06);
  transition: transform 220ms ease, box-shadow 220ms ease, background 220ms ease, border-color 220ms ease, color 220ms ease;
}

.timeline-content {
  padding-top: 0.25rem;
}

.timeline-title,
.timeline-copy {
  margin: 0;
}

.timeline-title {
  font-family: "Cinzel", serif;
  color: #fff2de;
}

.timeline-copy {
  margin-top: 0.28rem;
  font-size: 0.96rem;
}

.timeline-icon {
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  line-height: 1;
}

.timeline-item.completed .timeline-marker {
  background: linear-gradient(145deg, #246b2a, #4f9a53);
  color: #f7fff8;
  box-shadow: 0 12px 20px rgba(17, 59, 22, 0.25);
  border-color: rgba(136, 231, 147, 0.32);
}

.timeline-item.completed::after {
  background: rgba(107, 192, 116, 0.52);
}

.timeline-item.active .timeline-marker {
  background: linear-gradient(145deg, #d4a458, #f0cd8d);
  color: #3a1c15;
  box-shadow:
    0 0 0 6px rgba(221, 174, 93, 0.14),
    0 12px 22px rgba(196, 145, 61, 0.26);
  border-color: rgba(255, 220, 156, 0.42);
  transform: scale(1.06);
}

.timeline-item.active .timeline-title {
  color: #ffdca2;
}

.timeline-item.inactive {
  opacity: 0.58;
}

.timeline-item.inactive .timeline-marker {
  background: rgba(255, 245, 230, 0.04);
  border-color: rgba(216, 198, 167, 0.14);
  color: rgba(247, 235, 212, 0.42);
}

.timeline-item.inactive .timeline-title {
  color: rgba(255, 242, 222, 0.68);
}

.timeline-item.inactive::after {
  opacity: 0.55;
}

.track-button,
.empty-state a {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.82rem 1.1rem;
  background: linear-gradient(120deg, #d3a25a, #f1cf92);
  color: #34150f;
  font-family: "Cinzel", serif;
  box-shadow: 0 12px 20px rgba(155, 112, 37, 0.22);
}

.shipment-fallback {
  margin: 1rem 0 0;
  padding: 1rem 1.05rem;
  border-radius: 16px;
  background: rgba(255, 246, 233, 0.06);
  border: 1px solid rgba(232, 192, 126, 0.1);
}

.status {
  margin-top: 0.8rem;
}

.status.error {
  color: #ffc2b7;
}

.skeleton-layout {
  pointer-events: none;
}

.skeleton {
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 247, 232, 0.08);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 240, 213, 0.18), transparent);
  animation: shimmer 1.35s infinite;
}

.eyebrow-line {
  width: 8rem;
  height: 0.85rem;
}

.title-line {
  width: 14rem;
  height: 2rem;
  margin-top: 0.75rem;
}

.block-line {
  width: 100%;
  height: 4.4rem;
}

.circle-line {
  width: 1.2rem;
  height: 1.2rem;
}

.timeline-line {
  width: 10rem;
  height: 1.1rem;
}

.timeline-subline {
  width: 7rem;
  height: 0.9rem;
  margin-top: 0.45rem;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes timelineRise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 760px) {
  .tracking-header,
  .hero-top,
  .section-head {
    align-items: start;
    flex-direction: column;
  }

  .tracking-heading {
    text-align: left;
  }

  .summary-grid,
  .shipment-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .timeline-item {
    grid-template-columns: 2.8rem minmax(0, 1fr);
    gap: 0.75rem;
  }

  .timeline-marker {
    width: 2.8rem;
    height: 2.8rem;
  }

  .timeline-item::after {
    left: 1.36rem;
    top: 2.02rem;
  }
}
</style>
