import { Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  LineChart,
  Syringe,
  Utensils,
  Lightbulb,
  MessageCircle,
  Upload,
  FileText,
  Moon,
  UserPlus,
} from 'lucide-react'
import { DashboardLayout, type NavItem } from '../../components/layout/DashboardLayout'
import { ParentHome } from './ParentHome'
import { ParentGrowth } from './ParentGrowth'
import { ParentVaccination } from './ParentVaccination'
import { ParentDiet } from './ParentDiet'
import { ParentTips } from './ParentTips'
import { ParentChat } from './ParentChat'
import { ParentMedia } from './ParentMedia'
import { ParentReport } from './ParentReport'
import { ParentSleep } from './ParentSleep'
import { ParentRegister } from './ParentRegister'

const nav: NavItem[] = [
  { to: '/parent', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { to: '/parent/register', label: 'Register child', icon: <UserPlus size={18} /> },
  { to: '/parent/growth', label: 'Growth chart', icon: <LineChart size={18} /> },
  { to: '/parent/vaccination', label: 'Vaccinations', icon: <Syringe size={18} /> },
  { to: '/parent/diet', label: 'Diet plan', icon: <Utensils size={18} /> },
  { to: '/parent/media', label: 'Media upload', icon: <Upload size={18} /> },
  { to: '/parent/chat', label: 'AI assistant', icon: <MessageCircle size={18} /> },
  { to: '/parent/tips', label: 'Tips & tricks', icon: <Lightbulb size={18} /> },
  { to: '/parent/sleep', label: 'Sleep & meals', icon: <Moon size={18} /> },
  { to: '/parent/report', label: 'Download report', icon: <FileText size={18} /> },
]

export function ParentDashboard() {
  return (
    <DashboardLayout nav={nav} title="Parent">
      <Routes>
        <Route index element={<ParentHome />} />
        <Route path="register" element={<ParentRegister />} />
        <Route path="growth" element={<ParentGrowth />} />
        <Route path="vaccination" element={<ParentVaccination />} />
        <Route path="diet" element={<ParentDiet />} />
        <Route path="media" element={<ParentMedia />} />
        <Route path="chat" element={<ParentChat />} />
        <Route path="tips" element={<ParentTips />} />
        <Route path="sleep" element={<ParentSleep />} />
        <Route path="report" element={<ParentReport />} />
        <Route path="profile" element={<ParentHome />} />
        <Route path="*" element={<Navigate to="/parent" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
