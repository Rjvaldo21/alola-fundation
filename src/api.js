import axios from 'axios'

const ENV_BASE = (import.meta.env?.VITE_API_BASE_URL || '').trim()

const FALLBACK_PROD = 'https://backend-alola.apps06.tic.gov.tl/api/'

const isDev = import.meta.env.DEV

const BASE_URL = ENV_BASE || (isDev ? '/api/' : FALLBACK_PROD)

const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/'

export const api = axios.create({
  baseURL: normalizedBase,
  timeout: 15000,
})

export function absUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return normalizedBase + String(path).replace(/^\/+/, '')
}
