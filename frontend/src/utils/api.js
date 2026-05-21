import { API_BASE } from '../config'

export async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Request failed (${response.status})`)
  }

  return response.json()
}

export function resolveMediaUrl(value) {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  const normalized = value.startsWith('/') ? value : `/${value}`
  return API_BASE ? `${API_BASE}${normalized}` : normalized
}

export function getProductImageUrls(product) {
  const values = []
  const rawList = product?.image_urls

  if (Array.isArray(rawList)) {
    values.push(...rawList)
  } else if (typeof rawList === 'string' && rawList.trim()) {
    const trimmed = rawList.trim()
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        values.push(...parsed)
      } else if (parsed) {
        values.push(parsed)
      }
    } catch {
      values.push(trimmed)
    }
  }

  if (!values.length && product?.image_url) {
    values.push(product.image_url)
  }

  const normalized = values.map((value) => String(value).trim()).filter(Boolean)
  return Array.from(new Set(normalized))
}

export function fetchFeaturedProducts(limit = 8) {
  return requestJson(`/api/products/featured?limit=${limit}`)
}

export function fetchBestsellingProducts(limit = 4) {
  return requestJson(`/api/products/bestselling?limit=${limit}`)
}

export function fetchAllProducts() {
  return requestJson('/api/products')
}