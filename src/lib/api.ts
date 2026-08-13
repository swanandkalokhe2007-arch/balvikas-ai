/** Session helpers — memory + localStorage for preview iframes */
let memToken: string | null = null
let memUser: unknown = null

const TOKEN_KEY = 'balvikas_token'
const USER_KEY = 'balvikas_user'

export function getToken(): string | null {
  if (memToken) return memToken
  try {
    memToken = localStorage.getItem(TOKEN_KEY)
    return memToken
  } catch {
    return memToken
  }
}

export function setToken(token: string | null) {
  memToken = token
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* keep memory */
  }
}

export function getStoredUser<T = unknown>(): T | null {
  if (memUser) return memUser as T
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) {
      memUser = JSON.parse(raw)
      return memUser as T
    }
  } catch {
    /* ignore */
  }
  return null
}

export function setStoredUser(user: unknown | null) {
  memUser = user
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch {
    /* keep memory */
  }
}

export function clearSession() {
  memToken = null
  memUser = null
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    /* ignore */
  }
}

type ApiOpts = RequestInit & { json?: unknown; skipAuth?: boolean }

export async function api<T = unknown>(path: string, opts: ApiOpts = {}): Promise<T> {
  const headers = new Headers(opts.headers || {})
  if (!opts.skipAuth) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  let body = opts.body
  if (opts.json !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(opts.json)
  }
  const res = await fetch(path.startsWith('/') ? path : `/${path}`, {
    method: opts.method || (opts.json !== undefined ? 'POST' : 'GET'),
    headers,
    body,
    credentials: 'include',
  })
  const data = await res.json().catch(() => ({} as { error?: string }))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data as T
}

/** Login + save session */
export async function loginAndStore(email: string, password: string) {
  const data = await api<{ user: import('../types').User; token: string }>('/api/auth/login', {
    method: 'POST',
    json: { email, password: password || 'demo1234' },
    skipAuth: true,
  })
  if (!data.token || !data.user) throw new Error('Login failed')
  setToken(data.token)
  setStoredUser(data.user)
  return data
}

export const AuthAPI = {
  me: () => api<{ user: import('../types').User }>('/api/auth/me'),
  login: loginAndStore,
  signup: async (payload: Record<string, unknown>) => {
    const data = await api<{ user: import('../types').User; token: string }>('/api/auth/signup', {
      method: 'POST',
      json: payload,
      skipAuth: true,
    })
    if (!data.token || !data.user) throw new Error('Signup failed')
    setToken(data.token)
    setStoredUser(data.user)
    return data
  },
  logout: async () => {
    try {
      await api('/api/auth/logout', { method: 'POST', skipAuth: true })
    } catch {
      /* ignore */
    }
    clearSession()
  },
}

async function withAuthRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    const msg = e instanceof Error ? e.message : ''
    if (/unauthorized|invalid token|user not found/i.test(msg)) {
      // Prototype: silently re-auth as parent and retry once
      await loginAndStore('parent@demo.com', 'demo1234')
      return await fn()
    }
    throw e
  }
}

export const ChildrenAPI = {
  list: () => withAuthRetry(() => api<{ children: import('../types').Child[] }>('/api/children')),
  create: (body: Record<string, unknown>) =>
    withAuthRetry(() =>
      api<{ child: import('../types').Child }>('/api/children', { method: 'POST', json: body }),
    ),
  update: (id: string, body: Record<string, unknown>) =>
    withAuthRetry(() =>
      api<{ child: import('../types').Child }>(`/api/children/${id}`, {
        method: 'PATCH',
        json: body,
      }),
    ),
}

export const AppointmentsAPI = {
  list: () =>
    withAuthRetry(() => api<{ appointments: import('../types').Appointment[] }>('/api/appointments')),
}

export const VisitsAPI = {
  list: () => withAuthRetry(() => api<{ visits: import('../types').HomeVisit[] }>('/api/visits')),
  update: (id: string, body: Record<string, unknown>) =>
    withAuthRetry(() =>
      api<{ visit: import('../types').HomeVisit }>(`/api/visits/${id}`, {
        method: 'PATCH',
        json: body,
      }),
    ),
}

export const MediaAPI = {
  list: (childId?: string) =>
    withAuthRetry(() =>
      api<{ media: import('../types').MediaUpload[] }>(
        childId ? `/api/media?childId=${encodeURIComponent(childId)}` : '/api/media',
      ),
    ),
  upload: async (childId: string, file: File) => {
    const doUpload = async () => {
      const fd = new FormData()
      fd.append('childId', childId)
      fd.append('file', file)
      const token = getToken()
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      return data as { media: import('../types').MediaUpload }
    }
    return withAuthRetry(doUpload)
  },
  remove: (id: string) => withAuthRetry(() => api(`/api/media/${id}`, { method: 'DELETE' })),
}

export const ChatAPI = {
  list: (childId: string) =>
    withAuthRetry(() =>
      api<{ messages: import('../types').ChatMessage[] }>(`/api/chat/${childId}`),
    ),
  send: (childId: string, content: string) =>
    withAuthRetry(() =>
      api<{ messages: import('../types').ChatMessage[] }>(`/api/chat/${childId}`, {
        method: 'POST',
        json: { content },
      }),
    ),
}

export const MapAPI = {
  districts: () =>
    withAuthRetry(() => api<{ districts: import('../types').DistrictStat[] }>('/api/districts')),
  points: () =>
    withAuthRetry(() =>
      api<{
        children: Array<{
          id: string
          name: string
          village?: string
          district?: string
          riskLevel?: string
          lat: number
          lng: number
        }>
        visits: Array<{
          id: string
          name: string
          village?: string
          purpose?: string
          status?: string
          lat: number
          lng: number
        }>
        districts: Array<{
          id: string
          name: string
          lat: number
          lng: number
          highRisk?: number
          registered?: number
          screened?: number
        }>
      }>('/api/map/points'),
    ),
}

export const StatsAPI = {
  overview: () =>
    withAuthRetry(() =>
      api<{
        totalChildren: number
        highRisk: number
        appointmentsToday: number
        pendingVisits: number
        mediaCount: number
      }>('/api/stats/overview'),
    ),
}
