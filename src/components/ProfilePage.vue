<template>
  <main class="profile-shell page-shell">
    <section class="profile-card">
      <div class="profile-header">
        <p class="eyebrow">Your Account</p>
        <h1>{{ isLoggedIn ? 'Profile details' : 'Profile access' }}</h1>
      </div>

      <div v-if="isLoggedIn" class="profile-content">
        <div class="profile-summary">
          <article class="profile-detail-card">
            <div class="profile-detail-head">
              <span class="detail-icon">👤</span>
              <p class="detail-label">Name</p>
            </div>
            <p class="detail-value">{{ currentUser.name }}</p>
          </article>
          <article class="profile-detail-card">
            <div class="profile-detail-head">
              <span class="detail-icon">✉️</span>
              <p class="detail-label">Email</p>
            </div>
            <p class="detail-value">{{ currentUser.email }}</p>
          </article>
          <article class="profile-detail-card">
            <div class="profile-detail-head">
              <span class="detail-icon">📍</span>
              <p class="detail-label">Address</p>
            </div>
            <p class="detail-value">{{ currentUser.address || 'Not added yet' }}</p>
          </article>
          <article class="profile-detail-card">
            <div class="profile-detail-head">
              <span class="detail-icon">🕒</span>
              <p class="detail-label">Joined</p>
            </div>
            <p class="detail-value">{{ joinedAtText }}</p>
          </article>
        </div>

        <div v-if="!editing" class="profile-actions">
          <button type="button" class="btn primary" @click="startEditing">Edit profile</button>
          <button type="button" class="btn secondary" @click="logout">Sign out</button>
        </div>

        <section v-if="isLoggedIn && !editing" class="profile-activity">
          <div class="activity-head">
            <p class="eyebrow">Personal activity</p>
            <h2>Review and order timeline</h2>
          </div>

          <div class="activity-summary">
            <div class="stat-card">
              <div class="stat-icon">📦</div>
              <div>
                <span>{{ currentUser.order_count ?? displayOrders.length }}</span>
                <small>Total orders</small>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🌟</div>
              <div>
                <span>{{ currentUser.review_count ?? displayReviews.length }}</span>
                <small>Total reviews</small>
              </div>
            </div>
          </div>

          <p v-if="syncingProfile" class="status">Refreshing your latest activity...</p>
          <div class="history-grid">
            <section class="history-panel">
              <div class="history-heading">
                <h3>Latest reviews</h3>
                <p>{{ displayReviews.length ? 'Your most recent product feedback.' : 'You have not submitted any reviews yet.' }}</p>
              </div>
              <div v-if="displayReviews.length" class="history-list">
                <article v-for="review in displayReviews" :key="review.id" class="history-item card-review">
                  <div class="history-card-head">
                    <p class="history-title">{{ review.product_title || review.product_slug }}</p>
                    <p class="history-meta">{{ formatDate(review.created_at) }}</p>
                  </div>
                  <div class="rating-dots">
                    <span v-for="star in 5" :key="star" class="star">{{ star <= review.rating ? '★' : '☆' }}</span>
                  </div>
                  <p class="history-copy">{{ review.message || 'No review message provided.' }}</p>
                </article>
              </div>
            </section>

            <section class="history-panel">
              <div class="history-heading">
                <h3>Recent orders</h3>
                <p>{{ displayOrders.length ? 'Track your latest purchases and order status.' : 'No recent orders found in your account.' }}</p>
              </div>
              <div v-if="displayOrders.length" class="history-list">
                <article v-for="order in displayOrders" :key="order.order_id || order.id" class="history-item card-order">
                  <div class="history-card-head">
                    <p class="history-title">Order {{ order.order_ref }}</p>
                    <p class="history-meta">{{ formatDate(order.created_at) }}</p>
                  </div>
                  <p class="history-copy">Status: <strong>{{ order.status || 'pending' }}</strong></p>
                  <p class="history-copy">Total: {{ formatInr(order.total_amount) }}</p>
                  <a :href="buildOrderPath(order.order_id || order.id)" class="history-link">Track order</a>
                </article>
              </div>
            </section>
          </div>
        </section>

        <form v-if="editing" class="profile-form" @submit.prevent="updateProfile">
          <label class="profile-field">
            <span>Name</span>
            <input v-model.trim="profileForm.name" type="text" placeholder="Your name" />
          </label>
          <label class="profile-field">
            <span>Email</span>
            <input v-model.trim="profileForm.email" type="email" placeholder="you@example.com" />
          </label>
          <label class="profile-field">
            <span>Address</span>
            <input v-model.trim="profileForm.address" type="text" placeholder="123 Heritage Lane, City" />
          </label>

          <p v-if="authError" class="status error">{{ authError }}</p>
          <p v-if="successMessage" class="status success">{{ successMessage }}</p>

          <div class="profile-actions">
            <button type="submit" class="btn primary">Save changes</button>
            <button type="button" class="btn secondary" @click="cancelEditing">Cancel</button>
          </div>
        </form>

        <div class="profile-note">
          <p>Visit any product page to leave reviews and keep your profile active.</p>
        </div>
      </div>

      <div v-else class="login-card">
        <p class="login-copy">Sign in with your name and email to access your profile and submit reviews.</p>

        <label class="login-field">
          <span>Name</span>
          <input v-model.trim="profileForm.name" type="text" placeholder="Your name" />
        </label>
        <label class="login-field">
          <span>Email</span>
          <input v-model.trim="profileForm.email" type="email" placeholder="you@example.com" />
        </label>

        <p v-if="authError" class="status error">{{ authError }}</p>
        <p v-if="successMessage" class="status success">{{ successMessage }}</p>

        <div class="profile-actions">
          <button type="button" class="btn primary" @click="login">Continue</button>
          <a :href="homePath" class="btn secondary">Back to store</a>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useSeo } from '../seo'
import { buildHomePath, buildOrderPath } from '../utils/routes'
import SiteFooter from './SiteFooter.vue'
import { createUser } from '../api/products'

const currentUser = ref(null)
const userReviews = ref([])
const userOrders = ref([])
const authError = ref('')
const successMessage = ref('')
const editing = ref(false)
const syncingProfile = ref(false)
const profileForm = reactive({ name: '', email: '', address: '' })
const homePath = buildHomePath()

useSeo({
  title: 'Your Profile',
  path: '/profile',
  description: 'Manage your Heritage Hues profile, review history, and recent orders.',
})

const isLoggedIn = computed(() => Boolean(currentUser.value))
const displayReviews = computed(() => (Array.isArray(userReviews.value) ? userReviews.value.slice(0, 5) : []))
const displayOrders = computed(() => (Array.isArray(userOrders.value) ? userOrders.value.slice(0, 5) : []))

const formatDate = (value) => {
  if (!value) return 'Recently'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const loadCurrentUser = () => {
  if (typeof window === 'undefined') return
  const stored = window.localStorage.getItem('heritage_hues_user')
  if (!stored) return
  try {
    currentUser.value = JSON.parse(stored)
  } catch {
    currentUser.value = null
  }
  if (currentUser.value) {
    syncUserToServer(currentUser.value)
  }
}

const syncUserToServer = async (user) => {
  if (typeof window === 'undefined' || !user?.email) return
  syncingProfile.value = true
  try {
    const response = await createUser({
      name: user.name || '',
      email: user.email || '',
      address: user.address || '',
    })
    const normalizedUser = {
      ...user,
      id: String(response?.id || user.id || `user_${Date.now()}`),
      name: String(response?.name || user.name || '').trim(),
      email: String(response?.email || user.email || '').trim().toLowerCase(),
      address: String(response?.address || user.address || '').trim(),
      joined_at: response?.joined_at || user.joined_at || new Date().toISOString(),
      last_seen_at: response?.last_seen_at || user.last_seen_at || '',
      updated_at: response?.updated_at || user.updated_at || '',
      review_count: Number(response?.review_count || 0),
      order_count: Number(response?.order_count || 0),
    }
    currentUser.value = normalizedUser
    userReviews.value = Array.isArray(response?.reviews) ? response.reviews : []
    userOrders.value = Array.isArray(response?.orders) ? response.orders : []
    window.localStorage.setItem('heritage_hues_user', JSON.stringify(normalizedUser))
  } catch {
    // ignore backend sync failures for local profile behavior
  } finally {
    syncingProfile.value = false
  }
}

const saveCurrentUser = async (user) => {
  if (typeof window === 'undefined') return
  const safeUser = {
    id: String(user.id || `user_${Date.now()}`),
    name: String(user.name || '').trim(),
    email: String(user.email || '').trim().toLowerCase(),
    address: String(user.address || '').trim(),
    joined_at: user.joined_at || new Date().toISOString(),
  }
  window.localStorage.setItem('heritage_hues_user', JSON.stringify(safeUser))
  currentUser.value = safeUser
  userReviews.value = []
  userOrders.value = []
  await syncUserToServer(safeUser)
}

const login = async () => {
  authError.value = ''
  successMessage.value = ''
  const name = String(profileForm.name || '').trim()
  const email = String(profileForm.email || '').trim().toLowerCase()

  if (!name) {
    authError.value = 'Please enter your name.'
    return
  }
  if (!email || !email.includes('@')) {
    authError.value = 'Please enter a valid email address.'
    return
  }

  await saveCurrentUser({ id: `user_${Date.now()}`, name, email, address: profileForm.address || '' })
  successMessage.value = 'Signed in successfully.'
  profileForm.name = ''
  profileForm.email = ''
  profileForm.address = ''
}

const logout = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('heritage_hues_user')
  }
  currentUser.value = null
  userReviews.value = []
  userOrders.value = []
  editing.value = false
  authError.value = ''
  successMessage.value = 'Signed out successfully.'
}

const startEditing = () => {
  if (!currentUser.value) return
  profileForm.name = currentUser.value.name || ''
  profileForm.email = currentUser.value.email || ''
  profileForm.address = currentUser.value.address || ''
  editing.value = true
  authError.value = ''
  successMessage.value = ''
}

const cancelEditing = () => {
  editing.value = false
  authError.value = ''
  successMessage.value = ''
}

const updateProfile = async () => {
  if (!currentUser.value) return
  authError.value = ''
  successMessage.value = ''

  const name = String(profileForm.name || '').trim()
  const email = String(profileForm.email || '').trim().toLowerCase()

  if (!name) {
    authError.value = 'Please enter your name.'
    return
  }
  if (!email || !email.includes('@')) {
    authError.value = 'Please enter a valid email address.'
    return
  }

  await saveCurrentUser({
    id: currentUser.value.id,
    name,
    email,
    address: profileForm.address || currentUser.value.address || '',
    joined_at: currentUser.value.joined_at,
  })
  editing.value = false
  successMessage.value = 'Profile updated successfully.'
}

const joinedAtText = computed(() => {
  if (!currentUser.value?.joined_at) return 'Just now'
  const date = new Date(currentUser.value.joined_at)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

onMounted(() => {
  loadCurrentUser()
})
</script>

<style scoped>
.profile-shell {
  min-height: 100vh;
  padding: 8rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: radial-gradient(circle at top left, rgba(255, 247, 234, 0.95), rgba(236, 212, 177, 0.85) 40%, rgba(218, 171, 105, 0.12) 100%);
}
.profile-card {
  width: 100%;
  max-width: 1120px;
  box-sizing: border-box;
  background: rgba(255, 250, 241, 0.96);
  border: 1px solid rgba(179, 132, 88, 0.18);
  border-radius: 36px;
  padding: 2.6rem;
  box-shadow: 0 35px 80px rgba(107, 72, 45, 0.12);
}
.profile-header {
  margin-bottom: 1.8rem;
}
.profile-header .eyebrow {
  margin: 0 0 0.5rem;
  color: #8f5034;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.85rem;
}
.profile-header h1 {
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  color: #3b1f12;
}
.profile-summary {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.8rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.profile-detail-card {
  background: #fff;
  border-radius: 28px;
  padding: 1.3rem 1.4rem;
  border: 1px solid rgba(183, 134, 91, 0.12);
  box-shadow: 0 16px 30px rgba(121, 83, 49, 0.08);
}
.profile-detail-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}
.detail-icon {
  display: inline-flex;
  width: 2.2rem;
  height: 2.2rem;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #fdeedd;
  color: #9d6f44;
}
.detail-label {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #af8a67;
}
.detail-value {
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: #4e3827;
}
.profile-text {
  margin: 0;
  line-height: 1.75;
  color: #4f3121;
}
.profile-text strong {
  display: inline-block;
  width: 100px;
  color: #3b1f12;
}
.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.profile-actions .btn {
  min-width: 140px;
  padding: 0.95rem 1.6rem;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
.profile-actions .btn.primary {
  background: #8f6642;
  color: #fff;
  border: 1px solid transparent;
  box-shadow: 0 15px 30px rgba(143, 102, 66, 0.18);
}
.profile-actions .btn.primary:hover {
  transform: translateY(-1px);
  background: #7f5b3a;
}
.profile-actions .btn.secondary {
  background: rgba(255, 255, 255, 0.92);
  color: #5f422f;
  border: 1px solid rgba(143, 102, 66, 0.18);
}
.profile-actions .btn.secondary:hover {
  transform: translateY(-1px);
  background: #fff;
}
.profile-form {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.profile-field,
.login-field {
  display: grid;
  gap: 0.5rem;
}
.profile-field span,
.login-field span {
  color: #6f3a24;
  font-size: 0.95rem;
}
.profile-field input,
.login-field input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(139, 84, 48, 0.2);
  border-radius: 16px;
  background: #fff;
  color: #3b1f12;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.profile-field input:focus,
.login-field input:focus {
  border-color: #d4a76d;
  box-shadow: 0 0 0 4px rgba(212, 167, 109, 0.15);
}
.login-copy {
  margin: 0 0 1.5rem;
  color: #4f3121;
  line-height: 1.8;
}
.profile-note {
  margin-top: 1.8rem;
  color: #5d3f29;
  line-height: 1.85;
}
.profile-activity {
  margin-top: 2rem;
  padding: 1.8rem;
  background: rgba(248, 233, 212, 0.95);
  border: 1px solid rgba(174, 125, 80, 0.22);
  border-radius: 24px;
}
.activity-head {
  margin-bottom: 1rem;
}
.activity-head .eyebrow {
  margin: 0 0 0.35rem;
  color: #8f5034;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.78rem;
}
.activity-head h2 {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.7rem);
  color: #3b1f12;
}
.activity-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 1.25rem 1.4rem;
  border-radius: 24px;
  background: #fff;
  border: 1px solid rgba(179, 132, 88, 0.12);
  box-shadow: 0 18px 40px rgba(118, 81, 50, 0.08);
}
.stat-icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 16px;
  background: #f6e6d2;
  color: #a47c4e;
  font-size: 1.2rem;
}
.stat-card span {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #3c2a1f;
}
.stat-card small {
  color: #8f694b;
}
.history-grid {
  display: grid;
  gap: 1.25rem;
}
.history-panel {
  background: #fff;
  border: 1px solid rgba(174, 125, 80, 0.18);
  border-radius: 24px;
  padding: 1.6rem;
}
.history-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.history-heading h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #3b1f12;
}
.history-heading p {
  margin: 0;
  color: #6b4030;
  line-height: 1.6;
}
.history-list {
  display: grid;
  gap: 1rem;
}
.history-item {
  padding: 1.4rem;
  background: #fffdf9;
  border: 1px solid rgba(187, 141, 96, 0.18);
  border-radius: 22px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 50px rgba(116, 78, 47, 0.12);
}
.history-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.history-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #3b281d;
}
.history-meta {
  margin: 0;
  font-size: 0.88rem;
  color: #9a7a5a;
}
.rating-dots {
  margin-top: 0.85rem;
  color: #c5944c;
  letter-spacing: 0.06em;
}
.history-copy {
  margin: 1rem 0 0;
  color: #5d4332;
  line-height: 1.85;
}
.history-link {
  display: inline-block;
  margin-top: 1rem;
  color: #7d2e1a;
  text-decoration: underline;
}
.status {
  margin: 0.75rem 0 0;
}
.status.success {
  color: #2f6b39;
}
.status.error {
  color: #a7391d;
}
</style>
