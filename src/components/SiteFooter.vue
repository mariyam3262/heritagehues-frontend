<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p>Heritage Hues | Tradition meets elegance</p>
      <nav>
        <a :href="homePath">Home</a>
        <a :href="explorePath">Collection</a>
        <a :href="cartPath">Cart</a>
        <a href="mailto:care.heritagehues@gmail.com" aria-label="Email">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
            <path d="M22 8l-10 7L2 8" />
          </svg>
        </a>
      </nav>
      <small>Copyright {{ year }} Heritage Hues. All rights reserved.</small>
    </div>
  </footer>
</template>

<script setup>
import { buildCartPath, buildExplorePath, buildHomePath } from '../utils/routes'

const year = new Date().getFullYear()
const homePath = buildHomePath()
const explorePath = buildExplorePath()
const cartPath = buildCartPath()
</script>

<style scoped>
.site-footer {
  width: 100%;
  margin-top: auto;
  padding-top: clamp(1.25rem, 3vw, 2.25rem);
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.footer-inner {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(171, 113, 67, 0.38);
  border-radius: 0;
  padding: 1rem clamp(1rem, 3vw, 2rem);
  background:
    linear-gradient(135deg, rgba(255, 243, 223, 0.96), rgba(247, 225, 191, 0.92)),
    repeating-linear-gradient(
      -45deg,
      rgba(168, 96, 58, 0.04) 0,
      rgba(168, 96, 58, 0.04) 2px,
      transparent 2px,
      transparent 10px
    );
  box-shadow: 0 14px 28px rgba(24, 9, 6, 0.14);
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.9rem 1.2rem;
}

.site-footer p {
  margin: 0;
  font-family: "Cinzel", serif;
  color: #5a2418;
  font-size: 0.98rem;
  line-height: 1.5;
}

.site-footer nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.45rem 0.75rem;
}

.site-footer nav a {
  text-decoration: none;
  color: #763222;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.site-footer nav a:hover {
  background: rgba(154, 86, 50, 0.1);
  color: #5a2418;
  transform: translateY(-1px);
}

.site-footer small {
  display: block;
  color: #744533;
  text-align: right;
  line-height: 1.5;
}

@media (max-width: 860px) {
  .footer-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .site-footer small {
    text-align: center;
  }
}

@media (max-width: 560px) {
  .site-footer {
    padding-top: 1rem;
  }

  .footer-inner {
    border-radius: 0;
    padding: 0.95rem 0.9rem;
    gap: 0.75rem;
  }

  .site-footer p {
    font-size: 0.92rem;
  }
}
</style>
