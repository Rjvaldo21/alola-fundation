import axios from 'axios'

// Ambil dari env saat build (PROD). Saat dev tanpa env, fallback ke '/api/' (proxy Vite)
const ENV_BASE = (import.meta.env?.VITE_API_BASE_URL || '').trim()
const BASE_URL = ENV_BASE || '/api/'

// Pastikan selalu berakhiran '/'
const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/'

export const api = axios.create({
  baseURL: normalizedBase,
  timeout: 15000,
})

// Helper untuk membuat URL absolut (berguna untuk gambar/file dari API)
export function absUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return normalizedBase + String(path).replace(/^\/+/, '')
}