import axios from 'axios'

// Gunakan env Vite kalau ada, default ke http://localhost:8000
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
export const api = axios.create({ baseURL: `${API_BASE}/api/` })

// Resolve URL file/media dari Django (relatif "/media/...") jadi absolut
export function absUrl(u) {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/')) return `${API_BASE}${u}`
  return `${API_BASE}/${u}`
}
