import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Role, User } from '../types'
import { AuthAPI, clearSession, getStoredUser, getToken, setStoredUser } from '../lib/api'

type AuthCtx = {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User | null>
  loginAs: (role: Role) => Promise<User | null>
  signup: (name: string, email: string, password: string, role: Role) => Promise<User | null>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

const DEMO: Record<Role, string> = {
  parent: 'parent@demo.com',
  doctor: 'doctor@demo.com',
  worker: 'worker@demo.com',
  admin: 'admin@demo.com',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser<User>())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const token = getToken()
    const cached = getStoredUser<User>()

    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    // Show cached user immediately so ProtectedRoute doesn't bounce
    if (cached) setUser(cached)

    AuthAPI.me()
      .then(({ user: me }) => {
        if (!alive) return
        setUser(me)
        setStoredUser(me)
      })
      .catch(() => {
        // Keep cached session if /me fails (network). Only wipe on missing cache.
        if (!alive) return
        if (!getStoredUser()) {
          clearSession()
          setUser(null)
        }
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const { user: u } = await AuthAPI.login(email.trim(), password || 'demo1234')
      // token already saved by AuthAPI.login
      setUser(u)
      setLoading(false)
      return u
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed')
      return null
    }
  }, [])

  const loginAs = useCallback(
    async (role: Role) => {
      const u = await login(DEMO[role], 'demo1234')
      if (!u) throw new Error('Login failed')
      return u
    },
    [login],
  )

  const signup = useCallback(async (name: string, email: string, password: string, role: Role) => {
    setError(null)
    try {
      const { user: u } = await AuthAPI.signup({
        name,
        email: email.trim(),
        password: password || 'demo1234',
        role,
      })
      setUser(u)
      setLoading(false)
      return u
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Signup failed')
      return null
    }
  }, [])

  const logout = useCallback(async () => {
    await AuthAPI.logout()
    setUser(null)
  }, [])

  const value = useMemo(() => {
    const token = getToken()
    return {
      user,
      loading,
      error,
      // Token alone is enough to enter protected routes while user hydrates
      isAuthenticated: !!(token && user),
      login,
      loginAs,
      signup,
      logout,
    }
  }, [user, loading, error, login, loginAs, signup, logout])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth outside provider')
  return v
}
