import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ChildSelectionProvider } from './context/ChildSelectionContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { Landing } from './pages/Landing'
import { Auth } from './pages/Auth'
import { ParentDashboard } from './pages/parent/ParentDashboard'
import { DoctorDashboard } from './pages/doctor/DoctorDashboard'
import { WorkerDashboard } from './pages/worker/WorkerDashboard'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import type { Role } from './types'

function RoleRedirect() {
  const { user, isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-slate text-sm">
        Loading BalVikas…
      </div>
    )
  }
  if (!isAuthenticated || !user) return <Navigate to="/auth" replace />
  return <Navigate to={`/${user.role as Role}`} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ChildSelectionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/app" element={<RoleRedirect />} />

              <Route
                path="/parent/*"
                element={
                  <ProtectedRoute roles={['parent']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/*"
                element={
                  <ProtectedRoute roles={['doctor']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/*"
                element={
                  <ProtectedRoute roles={['worker']}>
                    <WorkerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ChildSelectionProvider>
      </DataProvider>
    </AuthProvider>
  )
}
