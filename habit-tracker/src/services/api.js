import { useAuthStore } from '../stores/auth.js'

async function request(path, options = {}) {
  const authStore = useAuthStore()
  const token = authStore.token

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(path, { ...options, headers })

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!res.ok) {
    const body = isJson
      ? await res.json().catch(() => ({ error: res.statusText }))
      : { error: `Server error ${res.status}: API route not found or function failed` }
    throw Object.assign(new Error(body.error || 'Request failed'), { status: res.status })
  }

  if (!isJson) {
    throw new Error(`Expected JSON but got ${contentType || 'HTML'} — check that the API server is running`)
  }

  return res.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
