import { API_BASE } from '../config'

export function getAdminHeaders(token) {
  return { 'X-Admin-Token': token }
}

async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || fallbackMessage)
  }

  return response.json()
}

export function loadAdminSummary(token) {
  return fetch(`${API_BASE}/api/admin/summary`, { headers: getAdminHeaders(token) }).then((response) => parseResponse(response, 'Unable to load admin summary'))
}

export function loadAdminProducts(token) {
  return fetch(`${API_BASE}/api/admin/products`, { headers: getAdminHeaders(token) }).then((response) => parseResponse(response, 'Unable to load products'))
}

export function loadAdminOrders(token) {
  return fetch(`${API_BASE}/api/admin/orders`, { headers: getAdminHeaders(token) }).then((response) => parseResponse(response, 'Unable to load orders'))
}

export function loadAdminOrderDetails(token, orderId) {
  return fetch(`${API_BASE}/api/admin/orders/${orderId}`, { headers: getAdminHeaders(token) }).then((response) => parseResponse(response, 'Unable to load order details'))
}

export async function saveAdminProduct(token, productId, form) {
  const payload = new FormData()
  payload.append('name', form.name)
  payload.append('description', form.description)
  payload.append('price', form.price)
  payload.append('category', form.category)
  payload.append('stock', form.stock)
  payload.append('featured', form.featured ? 'on' : '')
  ;(form.imageFiles || []).forEach((file) => payload.append('images', file))

  const response = await fetch(`${API_BASE}${productId ? `/api/admin/products/${productId}` : '/api/admin/products'}`, {
    method: productId ? 'PUT' : 'POST',
    headers: getAdminHeaders(token),
    body: payload,
  })

  return parseResponse(response, 'Unable to save product')
}

export async function deleteAdminProduct(token, productId) {
  const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
    method: 'DELETE',
    headers: getAdminHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Unable to delete product')
  }
}

export async function updateAdminOrderStatus(token, orderId, status) {
  const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      ...getAdminHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  return parseResponse(response, 'Unable to update order status')
}