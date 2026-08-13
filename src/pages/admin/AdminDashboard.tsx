import { Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  AlertTriangle,
  Map,
  TrendingUp,
  BarChart3,
  Boxes,
  MapPinned,
} from 'lucide-react'
import { DashboardLayout, type NavItem } from '../../components/layout/DashboardLayout'
import { AdminHome } from './AdminHome'
import { AdminDistricts } from './AdminDistricts'
import { AdminPredictive } from './AdminPredictive'
import { AdminAnalytics } from './AdminAnalytics'
import { AdminResources } from './AdminResources'
import { AdminMap } from './AdminMap'

const nav: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/districts', label: 'District statistics', icon: <Map size={18} /> },
  { to: '/admin/map', label: 'Attention map', icon: <MapPinned size={18} /> },
  { to: '/admin/predictive', label: 'Predictive analysis', icon: <TrendingUp size={18} /> },
  { to: '/admin/analytics', label: 'Analytics charts', icon: <BarChart3 size={18} /> },
  { to: '/admin/resources', label: 'Resource planning', icon: <Boxes size={18} /> },
]

export function AdminDashboard() {
  return (
    <DashboardLayout nav={nav} title="Health Admin">
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="districts" element={<AdminDistricts />} />
        <Route path="map" element={<AdminMap />} />
        <Route path="predictive" element={<AdminPredictive />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
      <span className="hidden">
        <Users />
        <ClipboardCheck />
        <AlertTriangle />
      </span>
    </DashboardLayout>
  )
}
