export function readCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    return []
  }
}

export function writeCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}