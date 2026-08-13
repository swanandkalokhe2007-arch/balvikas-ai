import bcrypt from 'bcryptjs'
import fs from 'fs'
import { dbPath } from './db.js'

export const DEMO_PASSWORD = 'demo1234'

function age(dob) {
  const d = new Date(dob)
  const n = new Date()
  return Math.max(0, (n.getFullYear() - d.getFullYear()) * 12 + (n.getMonth() - d.getMonth()))
}
function day(n = 0) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
function nid(p) {
  return `${p}_${Math.random().toString(36).slice(2, 10)}`
}

export async function buildDemoDataset() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10)
  const PARENT = 'u_parent_1'
  const DOCTOR = 'u_doctor_1'
  const WORKER = 'u_worker_1'
  const ADMIN = 'u_admin_1'

  const users = [
    {
      id: PARENT,
      name: 'Neha Verma',
      email: 'parent@demo.com',
      passwordHash: hash,
      role: 'parent',
      phone: '+91 90000 11111',
      village: 'Sinnar',
      district: 'Nashik',
      createdAt: new Date().toISOString(),
    },
    {
      id: DOCTOR,
      name: 'Dr. Karan Joshi',
      email: 'doctor@demo.com',
      passwordHash: hash,
      role: 'doctor',
      specialty: 'Pediatrics',
      phone: '+91 90000 22222',
      district: 'Nashik',
      createdAt: new Date().toISOString(),
    },
    {
      id: WORKER,
      name: 'Savita More',
      email: 'worker@demo.com',
      passwordHash: hash,
      role: 'worker',
      village: 'Sinnar',
      district: 'Nashik',
      phone: '+91 90000 33333',
      createdAt: new Date().toISOString(),
    },
    {
      id: ADMIN,
      name: 'Vikram Desai',
      email: 'admin@demo.com',
      passwordHash: hash,
      role: 'admin',
      specialty: 'District Health Officer',
      phone: '+91 90000 44444',
      district: 'Nashik',
      createdAt: new Date().toISOString(),
    },
  ]

  const children = [
    {
      id: 'c1',
      name: 'Ayaan Verma',
      dob: '2023-03-15',
      ageMonths: age('2023-03-15'),
      gender: 'male',
      heightCm: 89,
      weightKg: 12.6,
      parentId: PARENT,
      parentName: 'Neha Verma',
      village: 'Sinnar',
      district: 'Nashik',
      lat: 19.85,
      lng: 74.0,
      allergies: [],
      medicalConditions: [],
      developmentStatus: 'normal',
      riskLevel: 'low',
      lastScreening: day(-14),
      summary: 'Ayaan is on track. Growth healthy. No red flags on last screening.',
      vaccinations: [
        { id: nid('v'), name: 'BCG', dueDate: '2023-03-15', givenDate: '2023-03-16', status: 'completed' },
        { id: nid('v'), name: 'MMR-1', dueDate: '2024-03-15', givenDate: '2024-03-18', status: 'completed' },
        { id: nid('v'), name: 'DPT Booster', dueDate: day(25), status: 'upcoming' },
      ],
      growthHistory: [
        { date: '2024-03-15', heightCm: 75, weightKg: 9.5, ageMonths: 12 },
        { date: '2025-03-15', heightCm: 84, weightKg: 11.4, ageMonths: 24 },
        { date: day(-14), heightCm: 89, weightKg: 12.6, ageMonths: 36 },
      ],
      screenings: [
        {
          id: nid('s'),
          date: day(-14),
          type: 'ASQ-3 Developmental',
          result: 'normal',
          score: 93,
          notes: 'Age-appropriate across domains.',
          conductedBy: 'Dr. Karan Joshi',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'c2',
      name: 'Diya Verma',
      dob: '2024-01-20',
      ageMonths: age('2024-01-20'),
      gender: 'female',
      heightCm: 82,
      weightKg: 10.8,
      parentId: PARENT,
      parentName: 'Neha Verma',
      village: 'Sinnar',
      district: 'Nashik',
      lat: 19.852,
      lng: 74.008,
      allergies: ['Milk protein'],
      medicalConditions: [],
      developmentStatus: 'normal',
      riskLevel: 'low',
      lastScreening: day(-10),
      summary: 'Diya healthy. Milk protein allergy noted. Fine motor strong.',
      vaccinations: [
        { id: nid('v'), name: 'BCG', dueDate: '2024-01-20', givenDate: '2024-01-20', status: 'completed' },
        { id: nid('v'), name: 'MMR-1', dueDate: '2025-01-20', givenDate: '2025-01-22', status: 'completed' },
        { id: nid('v'), name: 'Typhoid', dueDate: day(12), status: 'due' },
      ],
      growthHistory: [
        { date: '2025-01-20', heightCm: 74, weightKg: 9.2, ageMonths: 12 },
        { date: day(-10), heightCm: 82, weightKg: 10.8, ageMonths: 24 },
      ],
      screenings: [
        {
          id: nid('s'),
          date: day(-10),
          type: 'Growth Assessment',
          result: 'normal',
          score: 91,
          notes: 'Steady growth. Avoid milk protein exposures.',
          conductedBy: 'Savita More',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'c3',
      name: 'Vivaan Verma',
      dob: '2024-11-08',
      ageMonths: age('2024-11-08'),
      gender: 'male',
      heightCm: 78,
      weightKg: 9.3,
      parentId: PARENT,
      parentName: 'Neha Verma',
      village: 'Sinnar',
      district: 'Nashik',
      lat: 19.848,
      lng: 73.998,
      allergies: [],
      medicalConditions: [],
      developmentStatus: 'slow',
      riskLevel: 'medium',
      lastScreening: day(-7),
      summary: 'Vivaan: mild speech delay watch. Social play good. Language games advised.',
      vaccinations: [
        { id: nid('v'), name: 'BCG', dueDate: '2024-11-08', givenDate: '2024-11-09', status: 'completed' },
        { id: nid('v'), name: 'Pentavalent-3', dueDate: '2025-05-08', givenDate: '2025-05-10', status: 'completed' },
        { id: nid('v'), name: 'MMR-1', dueDate: day(-2), status: 'due' },
      ],
      growthHistory: [
        { date: '2025-05-08', heightCm: 67, weightKg: 7.4, ageMonths: 6 },
        { date: day(-7), heightCm: 78, weightKg: 9.3, ageMonths: 18 },
      ],
      screenings: [
        {
          id: nid('s'),
          date: day(-7),
          type: 'ASQ-3 Developmental',
          result: 'monitor',
          score: 70,
          notes: 'Language slightly delayed. Review in 6 weeks.',
          conductedBy: 'Dr. Karan Joshi',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'c4',
      name: 'Saanvi Verma',
      dob: '2025-07-02',
      ageMonths: age('2025-07-02'),
      gender: 'female',
      heightCm: 71,
      weightKg: 8.2,
      parentId: PARENT,
      parentName: 'Neha Verma',
      village: 'Sinnar',
      district: 'Nashik',
      lat: 19.856,
      lng: 74.004,
      allergies: [],
      medicalConditions: [],
      developmentStatus: 'normal',
      riskLevel: 'low',
      lastScreening: day(-3),
      summary: 'Saanvi infant check normal. Feeding well. Next vaccine due soon.',
      vaccinations: [
        { id: nid('v'), name: 'BCG', dueDate: '2025-07-02', givenDate: '2025-07-02', status: 'completed' },
        { id: nid('v'), name: 'Pentavalent-1', dueDate: '2025-09-02', givenDate: '2025-09-04', status: 'completed' },
        { id: nid('v'), name: 'Pentavalent-2', dueDate: day(8), status: 'due' },
      ],
      growthHistory: [
        { date: '2026-01-02', heightCm: 65, weightKg: 7.1, ageMonths: 6 },
        { date: day(-3), heightCm: 71, weightKg: 8.2, ageMonths: 12 },
      ],
      screenings: [
        {
          id: nid('s'),
          date: day(-3),
          type: 'Growth Assessment',
          result: 'normal',
          score: 95,
          notes: 'Healthy infant trajectory.',
          conductedBy: 'Savita More',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'c5',
      name: 'Om Kulkarni',
      dob: '2025-02-14',
      ageMonths: age('2025-02-14'),
      gender: 'male',
      heightCm: 76,
      weightKg: 8.7,
      parentId: 'u_other_1',
      parentName: 'Anita Kulkarni',
      village: 'Igatpuri',
      district: 'Nashik',
      lat: 19.695,
      lng: 73.562,
      allergies: [],
      medicalConditions: ['Mild anemia'],
      developmentStatus: 'slow',
      riskLevel: 'high',
      lastScreening: day(-5),
      summary: 'HIGH RISK — delayed speech + mild anemia. Referral open.',
      vaccinations: [
        { id: nid('v'), name: 'BCG', dueDate: '2025-02-14', givenDate: '2025-02-14', status: 'completed' },
        { id: nid('v'), name: 'MMR-1', dueDate: day(-8), status: 'overdue' },
      ],
      growthHistory: [
        { date: '2025-08-14', heightCm: 66, weightKg: 7.0, ageMonths: 6 },
        { date: day(-5), heightCm: 76, weightKg: 8.7, ageMonths: 18 },
      ],
      screenings: [
        {
          id: nid('s'),
          date: day(-5),
          type: 'ASQ-3 Developmental',
          result: 'refer',
          score: 51,
          notes: 'Speech below cutoff. Nutrition + SLP referral.',
          conductedBy: 'Dr. Karan Joshi',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'c6',
      name: 'Isha Patil',
      dob: '2023-06-01',
      ageMonths: age('2023-06-01'),
      gender: 'female',
      heightCm: 92,
      weightKg: 13.2,
      parentId: 'u_other_2',
      parentName: 'Rahul Patil',
      village: 'Niphad',
      district: 'Nashik',
      lat: 20.079,
      lng: 74.11,
      allergies: [],
      medicalConditions: [],
      developmentStatus: 'normal',
      riskLevel: 'medium',
      lastScreening: day(-18),
      summary: 'Isha overall well. Monitor weight gain next quarter.',
      vaccinations: [
        { id: nid('v'), name: 'BCG', dueDate: '2023-06-01', givenDate: '2023-06-01', status: 'completed' },
        { id: nid('v'), name: 'DPT Booster', dueDate: day(5), status: 'due' },
      ],
      growthHistory: [
        { date: '2024-06-01', heightCm: 76, weightKg: 10.0, ageMonths: 12 },
        { date: day(-18), heightCm: 92, weightKg: 13.2, ageMonths: 36 },
      ],
      screenings: [
        {
          id: nid('s'),
          date: day(-18),
          type: 'Growth Assessment',
          result: 'monitor',
          score: 78,
          notes: 'Slight weight plateau. Diet counselling given.',
          conductedBy: 'Savita More',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  const appointments = [
    {
      id: nid('a'),
      childId: 'c5',
      childName: 'Om Kulkarni',
      doctorId: DOCTOR,
      date: day(0),
      time: '10:30',
      type: 'High-risk follow-up',
      status: 'scheduled',
    },
    {
      id: nid('a'),
      childId: 'c3',
      childName: 'Vivaan Verma',
      doctorId: DOCTOR,
      date: day(0),
      time: '11:45',
      type: 'Speech monitoring',
      status: 'scheduled',
    },
    {
      id: nid('a'),
      childId: 'c1',
      childName: 'Ayaan Verma',
      doctorId: DOCTOR,
      date: day(2),
      time: '09:30',
      type: 'Routine check',
      status: 'pending',
    },
  ]

  const visits = [
    {
      id: nid('hv'),
      childId: 'c5',
      childName: 'Om Kulkarni',
      village: 'Igatpuri',
      dueDate: day(1),
      status: 'due',
      purpose: 'Anemia + speech referral follow-up',
      lat: 19.695,
      lng: 73.562,
    },
    {
      id: nid('hv'),
      childId: 'c4',
      childName: 'Saanvi Verma',
      village: 'Sinnar',
      dueDate: day(2),
      status: 'due',
      purpose: 'Pentavalent-2 reminder',
      lat: 19.856,
      lng: 74.004,
    },
    {
      id: nid('hv'),
      childId: 'c6',
      childName: 'Isha Patil',
      village: 'Niphad',
      dueDate: day(-1),
      status: 'overdue',
      purpose: 'Diet counselling visit',
      lat: 20.079,
      lng: 74.11,
    },
  ]

  const media = [
    {
      id: nid('m'),
      childId: 'c1',
      type: 'video',
      name: 'ayaan_play.mp4',
      url: '',
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      analysisStatus: 'complete',
      analysis: 'Ayaan shows good joint attention and age-typical motor play.',
      findings: ['Social engagement OK', 'Motor typical', 'No red flags'],
      solutions: 'Continue daily play. Next screen in 6 months.',
      uploadedBy: PARENT,
    },
    {
      id: nid('m'),
      childId: 'c3',
      type: 'video',
      name: 'vivaan_speech.mp4',
      url: '',
      uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      analysisStatus: 'complete',
      analysis: 'Limited phrases for age. Gestures present. Continue language games.',
      findings: ['Limited phrases', 'Gestures present', 'Monitor speech'],
      solutions: 'Narrate routines daily. Review speech in 6 weeks.',
      uploadedBy: PARENT,
    },
  ]

  const districts = [
    { id: 'd1', district: 'Nashik', registered: 4200, screened: 3600, highRisk: 14, lat: 19.9975, lng: 73.7898 },
    { id: 'd2', district: 'Pune', registered: 6800, screened: 5900, highRisk: 20, lat: 18.5204, lng: 73.8567 },
    { id: 'd3', district: 'Thane', registered: 5300, screened: 4500, highRisk: 12, lat: 19.2183, lng: 72.9781 },
    { id: 'd4', district: 'Nagpur', registered: 4000, screened: 3400, highRisk: 10, lat: 21.1458, lng: 79.0882 },
    { id: 'd5', district: 'Ahmednagar', registered: 3000, screened: 2400, highRisk: 8, lat: 19.0948, lng: 74.748 },
  ]

  return {
    users,
    children,
    appointments,
    visits,
    media,
    districts,
    chat: {},
    meta: {
      version: 30,
      prototype: true,
      updatedAt: new Date().toISOString(),
      note: 'Prototype demo pack — parent has 4 children ready',
    },
  }
}

export async function ensureSeed() {
  const path = dbPath()
  if (fs.existsSync(path)) {
    try {
      const cur = JSON.parse(fs.readFileSync(path, 'utf8'))
      // Always ensure prototype data if empty children
      if (cur?.users?.length && cur?.children?.length) return cur
    } catch {
      /* rewrite */
    }
  }
  return resetDemoData()
}

export async function resetDemoData() {
  const data = await buildDemoDataset()
  fs.writeFileSync(dbPath(), JSON.stringify(data, null, 2))
  return data
}
