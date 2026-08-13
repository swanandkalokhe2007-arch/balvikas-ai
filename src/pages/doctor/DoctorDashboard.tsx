import { Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Calendar,
  ClipboardList,
  LineChart,
  History,
  Sparkles,
  FileSearch,
} from 'lucide-react'
import { DashboardLayout, type NavItem } from '../../components/layout/DashboardLayout'
import { DoctorHome } from './DoctorHome'
import { DoctorPatients } from './DoctorPatients'
import { DoctorChildDetail } from './DoctorChildDetail'
import { DoctorAppointments } from './DoctorAppointments'
import { DoctorReviews } from './DoctorReviews'
import { DoctorGrowth } from './DoctorGrowth'
import { DoctorScreening } from './DoctorScreening'
import { DoctorAI } from './DoctorAI'

const nav: NavItem[] = [
  { to: '/doctor', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { to: '/doctor/patients', label: 'Children examined', icon: <Users size={18} /> },
  { to: '/doctor/high-risk', label: 'High-risk children', icon: <AlertTriangle size={18} /> },
  { to: '/doctor/appointments', label: "Today's appointments", icon: <Calendar size={18} /> },
  { to: '/doctor/reviews', label: 'Pending reviews', icon: <ClipboardList size={18} /> },
  { to: '/doctor/growth', label: 'Growth analytics', icon: <LineChart size={18} /> },
  { to: '/doctor/screening', label: 'Screening history', icon: <History size={18} /> },
  { to: '/doctor/ai', label: 'AI recommendations', icon: <Sparkles size={18} /> },
]

export function DoctorDashboard() {
  return (
    <DashboardLayout nav={nav} title="Doctor">
      <Routes>
        <Route index element={<DoctorHome />} />
        <Route path="patients" element={<DoctorPatients filter="all" />} />
        <Route path="high-risk" element={<DoctorPatients filter="high" />} />
        <Route path="child/:id" element={<DoctorChildDetail />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="reviews" element={<DoctorReviews />} />
        <Route path="growth" element={<DoctorGrowth />} />
        <Route path="screening" element={<DoctorScreening />} />
        <Route path="ai" element={<DoctorAI />} />
        <Route path="*" element={<Navigate to="/doctor" replace />} />
      </Routes>
      <span className="hidden"><FileSearch /></span>
    </DashboardLayout>
  )
}
