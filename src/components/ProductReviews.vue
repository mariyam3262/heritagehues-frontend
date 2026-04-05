<template>
  <section class="review-panel">
    <div class="review-header">
      <div>
        <p class="eyebrow">Customer Reviews</p>
        <h2>What people are saying</h2>
      </div>
      <p v-if="reviews.length" class="review-count">{{ reviews.length }} review{{ reviews.length === 1 ? '' : 's' }}</p>
    </div>

    <div v-if="loading" class="status">Loading reviews...</div>
    <div v-else>
      <div v-if="reviews.length" class="review-list">
        <article v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-card-top">
            <div>
              <p class="review-author">{{ review.name || 'Anonymous' }}</p>
              <div class="review-stars" aria-label="Rating: {{ review.rating }} out of 5">
                <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= review.rating }">★</span>
              </div>
            </div>
          </div>

          <p class="review-comment">{{ review.message }}</p>
          <p class="review-date">{{ formatDate(review.created_at) }}</p>
        </article>
      </div>
      <div v-else class="empty-state">
        <p>No reviews yet for this product.</p>
      </div>
    </div>

    <div class="review-form-card">
      <div class="form-heading">
        <p class="eyebrow">Write a review</p>
        <h3>{{ isLoggedIn ? 'Share your experience' : 'Sign in to review' }}</h3>
      </div>

      <template v-if="isLoggedIn">
        <div class="logged-in-status">
          <p>Signed in as <strong>{{ currentUser.name }}</strong> (<small>{{ currentUser.email }}</small>)</p>
          <button type="button" class="btn secondary" @click="logout">Sign out</button>
        </div>

        <div class="rating-input">
          <label>Rating</label>
          <div class="rating-stars">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="star-input"
              :class="{ selected: star <= form.rating }"
              @click="setRating(star)"
              :aria-label="`Set rating to ${star}`"
            >
              ★
            </button>
          </div>
        </div>

        <label class="attachment-field">
          Upload an image
          <input type="file" accept="image/*" @change="handleAttachmentChange" />
        </label>
        <p v-if="attachmentName" class="attachment-name">Selected: {{ attachmentName }}</p>
        <p v-if="uploadingAttachment" class="status">Uploading image...</p>
        <p v-if="uploadError" class="status error">{{ uploadError }}</p>
        <div v-if="attachmentUrl" class="attachment-preview">
          <img :src="attachmentUrl" alt="Review attachment preview" />
        </div>

        <label class="comment-field">
          Comment
          <textarea v-model.trim="form.comment" rows="4" placeholder="Tell us what you liked about this product"></textarea>
        </label>

        <p v-if="formError" class="status error">{{ formError }}</p>
        <p v-if="submitSuccess" class="status success">{{ submitSuccess }}</p>

        <div class="form-actions">
          <button type="button" class="btn primary" @click="submitReview" :disabled="submitting">
            Submit Review
          </button>
        </div>
      </template>

      <template v-else>
        <div class="login-card">
          <div class="login-card-header">
            <p class="login-card-eyebrow">Sign in</p>
            <h4 class="login-card-title">Start with a quick identity</h4>
          </div>
          <p class="login-card-copy">
            Provide your name and email so your review appears with a real profile. No password is needed.
          </p>

          <div class="login-inputs">
            <label class="login-field">
              <span>Name</span>
              <input v-model.trim="loginForm.name" type="text" placeholder="Your name" />
            </label>

            <label class="login-field">
              <span>Email</span>
              <input v-model.trim="loginForm.email" type="email" placeholder="you@example.com" />
            </label>
          </div>

          <p v-if="authError" class="status error">{{ authError }}</p>

          <div class="form-actions">
            <button type="button" class="btn primary" @click="login" :disabled="loggingIn">
              {{ loggingIn ? 'Signing in...' : 'Continue' }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  createUser,
  createProductReview,
  fetchProductReviews,
  uploadReviewAttachment,
} from '../api/products'

const props = defineProps({
  productSlug: {
    type: String,
    required: true,
  },
})

const reviews = ref([])
const loading = ref(false)
const submitting = ref(false)
const formError = ref('')
const submitSuccess = ref('')
const authError = ref('')
const uploadingAttachment = ref(false)
const uploadError = ref('')
const attachmentUrl = ref('')
const attachmentName = ref('')
const loggingIn = ref(false)
const loginForm = ref({ name: '', email: '' })
const form = reactive({ rating: 0, comment: '' })
const currentUser = ref(null)

const isLoggedIn = computed(() => Boolean(currentUser.value))

const loadCurrentUser = () => {
  if (typeof window === 'undefined') return
  const stored = window.localStorage.getItem('heritage_hues_user')
  if (!stored) return
  try {
    currentUser.value = JSON.parse(stored)
  } catch {
    currentUser.value = null
  }
}

const saveCurrentUser = async (user) => {
  if (typeof window === 'undefined') return
  const response = await createUser({
    name: user.name || '',
    email: user.email || '',
    address: user.address || '',
  })
  const safeUser = {
    id: String(response?.id || user.id || `user_${Date.now()}`),
    name: String(response?.name || user.name || '').trim(),
    email: String(response?.email || user.email || '').trim().toLowerCase(),
    address: String(response?.address || user.address || '').trim(),
    joined_at: response?.joined_at || user.joined_at || new Date().toISOString(),
  }
  window.localStorage.setItem('heritage_hues_user', JSON.stringify(safeUser))
  currentUser.value = safeUser
}

const login = async () => {
  authError.value = ''
  submitSuccess.value = ''

  const name = String(loginForm.value.name || '').trim()
  const email = String(loginForm.value.email || '').trim().toLowerCase()

  if (!name) {
    authError.value = 'Please enter your name.'
    return
  }
  if (!email || !email.includes('@')) {
    authError.value = 'Please enter a valid email address.'
    return
  }

  loggingIn.value = true
  try {
    await saveCurrentUser({
      id: `user_${Date.now()}`,
      name,
      email,
    })
    loginForm.value.name = ''
    loginForm.value.email = ''
    authError.value = ''
  } catch (err) {
    authError.value = err.message || 'Unable to sign in.'
  } finally {
    loggingIn.value = false
  }
}

const logout = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('heritage_hues_user')
  }
  currentUser.value = null
}

const refreshReviews = async () => {
  loading.value = true
  formError.value = ''
  try {
    reviews.value = await fetchProductReviews(props.productSlug)
  } catch (err) {
    formError.value = err.message || 'Unable to load reviews.'
  } finally {
    loading.value = false
  }
}

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const setRating = (value) => {
  form.rating = value
}

const handleAttachmentChange = async (event) => {
  uploadError.value = ''
  attachmentUrl.value = ''
  attachmentName.value = ''
  const file = event.target.files?.[0]
  if (!file) return

  attachmentName.value = file.name
  uploadingAttachment.value = true

  try {
    const result = await uploadReviewAttachment(file)
    attachmentUrl.value = result.url || ''
  } catch (err) {
    uploadError.value = err.message || 'Unable to upload image.'
    attachmentName.value = ''
  } finally {
    uploadingAttachment.value = false
  }
}

const submitReview = async () => {
  if (!form.rating || form.rating < 1 || form.rating > 5) {
    formError.value = 'Please choose a rating between 1 and 5.'
    return
  }
  if (!form.comment) {
    formError.value = 'Please enter your comment.'
    return
  }
  if (!isLoggedIn.value) {
    formError.value = 'You must be logged in to submit a review.'
    return
  }

  submitting.value = true
  formError.value = ''
  submitSuccess.value = ''

  try {
    const payload = {
      name: currentUser.value.name,
      email: currentUser.value.email,
      message: form.comment,
      rating: form.rating,
      attachments: attachmentUrl.value ? [attachmentUrl.value] : [],
    }
    await createProductReview(props.productSlug, payload)
    submitSuccess.value = 'Review submitted successfully.'
    form.comment = ''
    form.rating = 0
    attachmentUrl.value = ''
    attachmentName.value = ''
    uploadError.value = ''
    await refreshReviews()
  } catch (err) {
    formError.value = err.message || 'Unable to submit review.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCurrentUser()
  refreshReviews()
})

watch(
  () => props.productSlug,
  async () => {
    await refreshReviews()
  }
)
</script>

<style scoped>
.review-panel {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 247, 233, 0.94);
  border: 1px solid rgba(174, 125, 80, 0.28);
  border-radius: 24px;
  box-shadow: 0 20px 45px rgba(79, 36, 22, 0.08);
}
.review-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.6rem;
}
.review-header .eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6f3a24;
}
.review-header h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2vw, 1.75rem);
  color: #3b1f12;
}
.review-count {
  color: #8f5034;
  font-weight: 600;
}
.review-list {
  display: grid;
  gap: 1.2rem;
}
.review-card {
  padding: 1.4rem;
  background: #fff;
  border: 1px solid rgba(206, 173, 127, 0.35);
  border-radius: 18px;
}
.review-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}
.review-author {
  margin: 0 0 0.35rem;
  font-weight: 700;
  color: #3b1f12;
}
.review-stars {
  font-size: 0.95rem;
  color: #d6a25a;
}
.review-stars .star {
  margin-right: 0.12rem;
  opacity: 0.35;
}
.review-stars .active {
  opacity: 1;
}
.verified-badge {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(228, 172, 96, 0.18);
  color: #8d551f;
  font-size: 0.78rem;
  font-weight: 600;
}
.review-comment {
  margin: 0 0 0.8rem;
  color: #4f3121;
  line-height: 1.7;
}
.review-date {
  margin: 0;
  color: #7a5a45;
  font-size: 0.92rem;
}
.review-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
.action-btn {
  border: 1px solid rgba(139, 84, 48, 0.18);
  background: transparent;
  color: #6f3a24;
  padding: 0.6rem 0.95rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.88rem;
}
.action-btn.edit {
  background: rgba(236, 189, 132, 0.2);
}
.action-btn.delete {
  background: rgba(222, 116, 84, 0.16);
}
.empty-state {
  padding: 1.4rem 1rem;
  background: rgba(253, 240, 221, 0.8);
  border-radius: 18px;
  color: #7b512e;
}
.review-form-card {
  margin-top: 2rem;
  padding: 1.8rem;
  background: rgba(61, 18, 5, 0.03);
  border: 1px solid rgba(174, 117, 76, 0.18);
  border-radius: 22px;
}
.login-card {
  background: #fff;
  border: 1px solid rgba(174, 117, 76, 0.22);
  border-radius: 22px;
  padding: 1.5rem;
  margin-bottom: 1.2rem;
}
.login-card-header {
  margin-bottom: 0.9rem;
}
.login-card-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #8b4818;
}
.login-card-title {
  margin: 0;
  color: #2f1a0f;
  font-size: 1.1rem;
}
.login-card-copy {
  margin: 0 0 1.2rem;
  color: #6a4a37;
  line-height: 1.6;
}
.login-inputs {
  display: grid;
  gap: 1rem;
}
.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #5f3a23;
  font-weight: 600;
}
.login-field input {
  width: 100%;
  border: 1px solid rgba(174, 117, 76, 0.24);
  border-radius: 14px;
  padding: 0.95rem 1rem;
  background: #fff;
  color: #3b2314;
}
.login-note {
  color: #7a5a45;
  margin-bottom: 1rem;
}
.logged-in-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1rem 1.1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(174, 117, 76, 0.18);
  border-radius: 18px;
  background: rgba(255, 250, 246, 0.9);
}
.logged-in-status p {
  margin: 0;
  color: #4e2f1d;
  line-height: 1.5;
}
.btn.secondary {
  background: transparent;
  color: #6f3a24;
  border: 1px solid rgba(139, 84, 48, 0.2);
}
.form-heading {
  margin-bottom: 1rem;
}
.form-heading .eyebrow {
  margin: 0 0 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #6f3a24;
  font-size: 0.82rem;
}
.form-heading h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #3b1f12;
}
.rating-input {
  margin-bottom: 1.1rem;
}
.rating-input label {
  display: block;
  margin-bottom: 0.5rem;
  color: #7b4f30;
}
.rating-stars {
  display: flex;
  gap: 0.4rem;
}
.star-input {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  border: 1px solid rgba(173, 101, 49, 0.22);
  background: rgba(255, 250, 240, 0.95);
  color: #d6a25a;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.star-input.selected {
  background: rgba(214, 162, 90, 0.17);
  transform: translateY(-1px);
}
.comment-field {
  display: block;
  margin-bottom: 1rem;
}
.comment-field textarea {
  width: 100%;
  min-height: 120px;
  border: 1px solid rgba(174, 117, 76, 0.24);
  border-radius: 16px;
  padding: 1rem;
  background: white;
  resize: vertical;
  color: #4e2f1d;
  font-family: inherit;
}
.attachment-field {
  display: block;
  margin-bottom: 1rem;
  color: #5f3a23;
  font-weight: 600;
}
.attachment-field input {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(174, 117, 76, 0.24);
  border-radius: 14px;
  background: #fff;
}
.attachment-name {
  margin: 0.4rem 0 0.8rem;
  color: #6f3a24;
  font-size: 0.95rem;
}
.attachment-preview {
  margin-bottom: 1rem;
}
.attachment-preview img {
  max-width: 160px;
  border-radius: 16px;
  border: 1px solid rgba(174, 117, 76, 0.2);
}
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 0.5rem;
}
.btn {
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.4rem;
  cursor: pointer;
  font-weight: 700;
}
.btn.primary {
  background: #a55f2e;
  color: white;
}
.btn.secondary {
  background: transparent;
  color: #6f3a24;
  border: 1px solid rgba(139, 84, 48, 0.2);
}
.login-prompt {
  color: #7a5a45;
  font-weight: 600;
  padding: 1rem 0;
}
.status {
  margin-top: 0.85rem;
  font-size: 0.95rem;
}
.status.error {
  color: #9a2b20;
}
.status.success {
  color: #3f6d34;
}
</style>
