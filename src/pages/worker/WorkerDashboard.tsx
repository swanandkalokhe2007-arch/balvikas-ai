import { Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Home,
  Syringe,
  UserPlus,
  LineChart,
  ShieldAlert,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import { DashboardLayout, type NavItem } from '../../components/layout/DashboardLayout'
import { WorkerHome } from './WorkerHome'
import { WorkerChildren } from './WorkerChildren'
import { WorkerVisits } from './WorkerVisits'
import { WorkerVaccination } from './WorkerVaccination'
import { WorkerRegister } from './WorkerRegister'
import { WorkerGrowth } from './WorkerGrowth'
import { WorkerAlerts } from './WorkerAlerts'
import { WorkerEducation } from './WorkerEducation'
import { WorkerMap } from './WorkerMap'

const nav: NavItem[] = [
  { to: '/worker', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { to: '/worker/children', label: 'Children in village', icon: <Users size={18} /> },
  { to: '/worker/screening', label: 'Pending screening', icon: <ClipboardCheck size={18} /> },
  { to: '/worker/visits', label: 'Home visits due', icon: <Home size={18} /> },
  { to: '/worker/map', label: 'Field map', icon: <MapPin size={18} /> },
  { to: '/worker/vaccination', label: 'Vaccination tracker', icon: <Syringe size={18} /> },
  { to: '/worker/register', label: 'Child registration', icon: <UserPlus size={18} /> },
  { to: '/worker/growth', label: 'Growth monitoring', icon: <LineChart size={18} /> },
  { to: '/worker/alerts', label: 'High-risk alerts', icon: <ShieldAlert size={18} /> },
  { to: '/worker/education', label: 'Parent education', icon: <GraduationCap size={18} /> },
]

export function WorkerDashboard() {
  return (
    <DashboardLayout nav={nav} title="Anganwadi">
      <Routes>
        <Route index element={<WorkerHome />} />
        <Route path="children" element={<WorkerChildren mode="all" />} />
        <Route path="screening" element={<WorkerChildren mode="screening" />} />
        <Route path="visits" element={<WorkerVisits />} />
        <Route path="map" element={<WorkerMap />} />
        <Route path="vaccination" element={<WorkerVaccination />} />
        <Route path="register" element={<WorkerRegister />} />
        <Route path="growth" element={<WorkerGrowth />} />
        <Route path="alerts" element={<WorkerAlerts />} />
        <Route path="education" element={<WorkerEducation />} />
        <Route path="*" element={<Navigate to="/worker" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
