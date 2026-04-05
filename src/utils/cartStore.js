const isBrowser = typeof window !== 'undefined'
let cartCount = 0

const readCount = () => Math.max(0, Number.parseInt(String(cartCount || 0), 10) || 0)

const writeCount = (count) => {
  if (!isBrowser) return
  const nextCount = Math.max(0, Number.parseInt(String(count || 0), 10) || 0)
  if (cartCount === nextCount) return
  cartCount = nextCount
  window.dispatchEvent(new Event('cart-updated'))
}

export const getCartCount = () => readCount()

export const setCartCount = (count) => writeCount(count)

export const clearCart = () => writeCount(0)
