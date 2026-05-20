export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '/private-admin-7f2d'
export const ADMIN_ROUTE = ADMIN_PATH.startsWith('/') ? ADMIN_PATH : `/${ADMIN_PATH}`