import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getToken, getStoredUser } from '../../lib/api'
import type { Role, User } from '../../types'

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: Role[]
}) {
  const { user, loading } = useAuth()
  const token = getToken()
  const cached = getStoredUser<User>()
  const effectiveUser = user || cached

  // Wait only if we have a token and are still confirming — show spinner, don't bounce
  if (loading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-slate text-sm">
        Loading…
      </div>
    )
  }

  if (!token || !effectiveUser) {
    return <Navigate to="/auth" replace />
  }

  if (roles && !roles.includes(effectiveUser.role)) {
    return <Navigate to={`/${effectiveUser.role}`} replace />
  }

  return <>{children}</>
}
