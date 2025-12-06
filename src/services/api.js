import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  || 'https://backend-alola.apps06.tic.gov.tl/admin/'

export const api = axios.create({
  baseURL: BASE_URL.replace(/\/+$/, '') + '/',
  timeout: 15000,
})

export function absUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return BASE_URL.replace(/\/+$/, '') + '/' + String(path).replace(/^\/+/, '')
}