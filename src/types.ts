export type Role = 'parent' | 'doctor' | 'worker' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  village?: string
  specialty?: string
  phone?: string
}

export interface Child {
  id: string
  name: string
  ageMonths: number
  gender: 'male' | 'female'
  photo?: string
  heightCm: number
  weightKg: number
  parentId: string
  parentName: string
  village: string
  district: string
  lat?: number
  lng?: number
  dob: string
  allergies: string[]
  medicalConditions: string[]
  developmentStatus: 'normal' | 'slow' | 'delayed' | 'advanced'
  riskLevel: 'low' | 'medium' | 'high'
  lastScreening?: string
  vaccinations: Vaccination[]
  growthHistory: GrowthPoint[]
  screenings: Screening[]
  notes?: string
  summary?: string
}

export interface Vaccination {
  id: string
  name: string
  dueDate: string
  givenDate?: string
  status: 'completed' | 'due' | 'overdue' | 'upcoming'
}

export interface GrowthPoint {
  date: string
  heightCm: number
  weightKg: number
  ageMonths: number
}

export interface Screening {
  id: string
  date: string
  type: string
  result: 'normal' | 'monitor' | 'refer'
  score: number
  notes: string
  conductedBy: string
}

export interface Appointment {
  id: string
  childId: string
  childName: string
  doctorId: string
  date: string
  time: string
  type: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending'
}

export interface MediaUpload {
  id: string
  childId: string
  type: 'photo' | 'video'
  name: string
  url: string
  uploadedAt: string
  analysisStatus: 'pending' | 'analyzing' | 'complete'
  analysis?: string
  findings?: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface HomeVisit {
  id: string
  childId: string
  childName: string
  village: string
  dueDate: string
  status: 'due' | 'completed' | 'overdue'
  purpose: string
  lat?: number
  lng?: number
}

export interface DistrictStat {
  id?: string
  district: string
  registered: number
  screened: number
  highRisk: number
  lat: number
  lng: number
  liveRegistered?: number
  liveScreened?: number
  liveHighRisk?: number
}
