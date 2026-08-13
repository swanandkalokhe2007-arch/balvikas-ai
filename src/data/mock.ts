import type {
  User,
  Child,
  Appointment,
  MediaUpload,
  HomeVisit,
  DistrictStat,
} from '../types'

export const DEMO_USERS: User[] = [
  {
    id: 'u-parent-1',
    name: 'Priya Sharma',
    email: 'parent@demo.com',
    role: 'parent',
    phone: '+91 98765 43210',
    village: 'Sinnar',
  },
  {
    id: 'u-doctor-1',
    name: 'Dr. Ananya Mehta',
    email: 'doctor@demo.com',
    role: 'doctor',
    specialty: 'Pediatrics & Developmental Medicine',
    phone: '+91 98200 11223',
  },
  {
    id: 'u-worker-1',
    name: 'Sunita Patil',
    email: 'worker@demo.com',
    role: 'worker',
    village: 'Sinnar',
    phone: '+91 97654 32109',
  },
  {
    id: 'u-admin-1',
    name: 'Rajesh Kulkarni',
    email: 'admin@demo.com',
    role: 'admin',
    specialty: 'District Health Officer',
    phone: '+91 99001 22334',
  },
]

export const CHILDREN: Child[] = [
  {
    id: 'c1',
    name: 'Aarav Sharma',
    ageMonths: 28,
    gender: 'male',
    heightCm: 88,
    weightKg: 12.4,
    parentId: 'u-parent-1',
    parentName: 'Priya Sharma',
    village: 'Sinnar',
    district: 'Nashik',
    dob: '2023-04-12',
    allergies: ['Peanuts'],
    medicalConditions: [],
    developmentStatus: 'normal',
    riskLevel: 'low',
    lastScreening: '2026-07-15',
    summary:
      'Aarav, 2y4m · Ht 88cm (P55) Wt 12.4kg (P48) · Dev: age-appropriate · Allergies: peanuts · Vax: up to date · Last screen normal. No red flags. Continue routine milestones & diet.',
    vaccinations: [
      { id: 'v1', name: 'BCG', dueDate: '2023-04-12', givenDate: '2023-04-13', status: 'completed' },
      { id: 'v2', name: 'OPV-0', dueDate: '2023-04-12', givenDate: '2023-04-13', status: 'completed' },
      { id: 'v3', name: 'Pentavalent-1', dueDate: '2023-05-24', givenDate: '2023-05-26', status: 'completed' },
      { id: 'v4', name: 'MMR-1', dueDate: '2024-04-12', givenDate: '2024-04-15', status: 'completed' },
      { id: 'v5', name: 'DPT Booster', dueDate: '2026-04-12', givenDate: '2026-04-20', status: 'completed' },
      { id: 'v6', name: 'Typhoid', dueDate: '2026-10-12', status: 'upcoming' },
    ],
    growthHistory: [
      { date: '2024-04-12', heightCm: 74, weightKg: 9.2, ageMonths: 12 },
      { date: '2024-10-12', heightCm: 80, weightKg: 10.5, ageMonths: 18 },
      { date: '2025-04-12', heightCm: 84, weightKg: 11.4, ageMonths: 24 },
      { date: '2025-10-12', heightCm: 86, weightKg: 11.9, ageMonths: 30 },
      { date: '2026-07-15', heightCm: 88, weightKg: 12.4, ageMonths: 28 },
    ],
    screenings: [
      {
        id: 's1',
        date: '2026-07-15',
        type: 'ASQ-3 Developmental',
        result: 'normal',
        score: 92,
        notes: 'All domains within normal range. Strong fine-motor skills.',
        conductedBy: 'Dr. Ananya Mehta',
      },
      {
        id: 's2',
        date: '2026-01-10',
        type: 'Growth Assessment',
        result: 'normal',
        score: 88,
        notes: 'Steady growth trajectory along 50th percentile.',
        conductedBy: 'Sunita Patil',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Anaya Deshmukh',
    ageMonths: 18,
    gender: 'female',
    heightCm: 78,
    weightKg: 9.1,
    parentId: 'u-p2',
    parentName: 'Meera Deshmukh',
    village: 'Igatpuri',
    district: 'Nashik',
    dob: '2025-02-01',
    allergies: [],
    medicalConditions: ['Mild anemia'],
    developmentStatus: 'slow',
    riskLevel: 'high',
    lastScreening: '2026-08-01',
    summary:
      'Anaya, 1y6m · Ht 78cm (P25) Wt 9.1kg (P15) · Dev: delayed speech & social · Anemia (mild) · Vax: 1 overdue · HIGH RISK — speech referral + nutrition plan + 2-week follow-up.',
    vaccinations: [
      { id: 'v1', name: 'BCG', dueDate: '2025-02-01', givenDate: '2025-02-02', status: 'completed' },
      { id: 'v2', name: 'Pentavalent-3', dueDate: '2025-06-01', givenDate: '2025-06-05', status: 'completed' },
      { id: 'v3', name: 'MMR-1', dueDate: '2026-02-01', status: 'overdue' },
      { id: 'v4', name: 'Hepatitis A', dueDate: '2026-08-01', status: 'due' },
    ],
    growthHistory: [
      { date: '2025-08-01', heightCm: 66, weightKg: 7.0, ageMonths: 6 },
      { date: '2026-02-01', heightCm: 73, weightKg: 8.2, ageMonths: 12 },
      { date: '2026-08-01', heightCm: 78, weightKg: 9.1, ageMonths: 18 },
    ],
    screenings: [
      {
        id: 's1',
        date: '2026-08-01',
        type: 'ASQ-3 Developmental',
        result: 'refer',
        score: 54,
        notes: 'Speech & social domains below cutoff. Recommend ENT + speech therapy eval.',
        conductedBy: 'Dr. Ananya Mehta',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Vihaan Patil',
    ageMonths: 36,
    gender: 'male',
    heightCm: 94,
    weightKg: 13.8,
    parentId: 'u-p3',
    parentName: 'Suresh Patil',
    village: 'Sinnar',
    district: 'Nashik',
    dob: '2023-08-09',
    allergies: ['Dust mites'],
    medicalConditions: ['Recurrent wheeze'],
    developmentStatus: 'normal',
    riskLevel: 'medium',
    lastScreening: '2026-06-20',
    summary:
      'Vihaan, 3y · Ht 94cm (P45) Wt 13.8kg (P40) · Dev: normal · Allergies: dust · Wheeze history · Monitor respiratory; review inhaler technique next visit.',
    vaccinations: [
      { id: 'v1', name: 'BCG', dueDate: '2023-08-09', givenDate: '2023-08-09', status: 'completed' },
      { id: 'v2', name: 'MMR-1', dueDate: '2024-08-09', givenDate: '2024-08-12', status: 'completed' },
      { id: 'v3', name: 'DPT Booster', dueDate: '2026-08-09', status: 'due' },
    ],
    growthHistory: [
      { date: '2024-08-09', heightCm: 76, weightKg: 10.0, ageMonths: 12 },
      { date: '2025-08-09', heightCm: 86, weightKg: 12.1, ageMonths: 24 },
      { date: '2026-06-20', heightCm: 94, weightKg: 13.8, ageMonths: 36 },
    ],
    screenings: [
      {
        id: 's1',
        date: '2026-06-20',
        type: 'ASQ-3 Developmental',
        result: 'normal',
        score: 85,
        notes: 'Age-appropriate. Slight attention variability — observe at preschool.',
        conductedBy: 'Dr. Ananya Mehta',
      },
    ],
  },
  {
    id: 'c4',
    name: 'Myra Joshi',
    ageMonths: 12,
    gender: 'female',
    heightCm: 72,
    weightKg: 8.5,
    parentId: 'u-p4',
    parentName: 'Kavita Joshi',
    village: 'Trimbak',
    district: 'Nashik',
    dob: '2025-08-01',
    allergies: [],
    medicalConditions: [],
    developmentStatus: 'advanced',
    riskLevel: 'low',
    lastScreening: '2026-07-28',
    summary:
      'Myra, 1y · Ht 72cm (P60) Wt 8.5kg (P55) · Dev: advanced motor · No allergies · Vax current · Encourage varied play & language exposure.',
    vaccinations: [
      { id: 'v1', name: 'BCG', dueDate: '2025-08-01', givenDate: '2025-08-01', status: 'completed' },
      { id: 'v2', name: 'Pentavalent-3', dueDate: '2026-02-01', givenDate: '2026-02-03', status: 'completed' },
      { id: 'v3', name: 'MMR-1', dueDate: '2026-08-01', status: 'due' },
    ],
    growthHistory: [
      { date: '2026-02-01', heightCm: 66, weightKg: 7.2, ageMonths: 6 },
      { date: '2026-07-28', heightCm: 72, weightKg: 8.5, ageMonths: 12 },
    ],
    screenings: [
      {
        id: 's1',
        date: '2026-07-28',
        type: 'Growth Assessment',
        result: 'normal',
        score: 95,
        notes: 'Excellent growth. Early walking observed.',
        conductedBy: 'Sunita Patil',
      },
    ],
  },
  {
    id: 'c5',
    name: 'Reyansh Kulkarni',
    ageMonths: 42,
    gender: 'male',
    heightCm: 98,
    weightKg: 14.2,
    parentId: 'u-p5',
    parentName: 'Amit Kulkarni',
    village: 'Niphad',
    district: 'Nashik',
    dob: '2023-02-15',
    allergies: [],
    medicalConditions: ['Otitis media (recurrent)'],
    developmentStatus: 'slow',
    riskLevel: 'high',
    lastScreening: '2026-07-02',
    summary:
      'Reyansh, 3y6m · Ht 98cm Wt 14.2kg · Dev: language delay linked to recurrent ear infections · HIGH RISK — audiology + ENT priority. Hearing screen ASAP.',
    vaccinations: [
      { id: 'v1', name: 'BCG', dueDate: '2023-02-15', givenDate: '2023-02-15', status: 'completed' },
      { id: 'v2', name: 'MMR-2', dueDate: '2026-02-15', givenDate: '2026-02-20', status: 'completed' },
    ],
    growthHistory: [
      { date: '2024-02-15', heightCm: 75, weightKg: 9.8, ageMonths: 12 },
      { date: '2025-02-15', heightCm: 87, weightKg: 12.0, ageMonths: 24 },
      { date: '2026-07-02', heightCm: 98, weightKg: 14.2, ageMonths: 42 },
    ],
    screenings: [
      {
        id: 's1',
        date: '2026-07-02',
        type: 'ASQ-3 Developmental',
        result: 'refer',
        score: 48,
        notes: 'Language domain critical. Possible conductive hearing loss.',
        conductedBy: 'Dr. Ananya Mehta',
      },
    ],
  },
  {
    id: 'c6',
    name: 'Sara Pawar',
    ageMonths: 24,
    gender: 'female',
    heightCm: 84,
    weightKg: 11.0,
    parentId: 'u-p6',
    parentName: 'Nisha Pawar',
    village: 'Igatpuri',
    district: 'Nashik',
    dob: '2024-08-09',
    allergies: ['Lactose (mild)'],
    medicalConditions: [],
    developmentStatus: 'normal',
    riskLevel: 'low',
    lastScreening: '2026-05-18',
    summary:
      'Sara, 2y · Ht 84cm Wt 11kg · Dev: normal · Mild lactose intolerance — dairy alternatives OK · Next screen in 6 months.',
    vaccinations: [
      { id: 'v1', name: 'BCG', dueDate: '2024-08-09', givenDate: '2024-08-09', status: 'completed' },
      { id: 'v2', name: 'MMR-1', dueDate: '2025-08-09', givenDate: '2025-08-11', status: 'completed' },
    ],
    growthHistory: [
      { date: '2025-08-09', heightCm: 74, weightKg: 9.0, ageMonths: 12 },
      { date: '2026-05-18', heightCm: 84, weightKg: 11.0, ageMonths: 24 },
    ],
    screenings: [
      {
        id: 's1',
        date: '2026-05-18',
        type: 'ASQ-3 Developmental',
        result: 'normal',
        score: 90,
        notes: 'Thriving. Good social engagement.',
        conductedBy: 'Sunita Patil',
      },
    ],
  },
]

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    childId: 'c2',
    childName: 'Anaya Deshmukh',
    doctorId: 'u-doctor-1',
    date: '2026-08-09',
    time: '10:30',
    type: 'Developmental Follow-up',
    status: 'scheduled',
  },
  {
    id: 'a2',
    childId: 'c5',
    childName: 'Reyansh Kulkarni',
    doctorId: 'u-doctor-1',
    date: '2026-08-09',
    time: '11:15',
    type: 'ENT Referral Review',
    status: 'scheduled',
  },
  {
    id: 'a3',
    childId: 'c3',
    childName: 'Vihaan Patil',
    doctorId: 'u-doctor-1',
    date: '2026-08-09',
    time: '14:00',
    type: 'Respiratory Check',
    status: 'scheduled',
  },
  {
    id: 'a4',
    childId: 'c1',
    childName: 'Aarav Sharma',
    doctorId: 'u-doctor-1',
    date: '2026-08-12',
    time: '09:45',
    type: 'Routine Screening',
    status: 'pending',
  },
  {
    id: 'a5',
    childId: 'c4',
    childName: 'Myra Joshi',
    doctorId: 'u-doctor-1',
    date: '2026-08-05',
    time: '16:00',
    type: 'Growth Review',
    status: 'completed',
  },
]

export const MEDIA_UPLOADS: MediaUpload[] = [
  {
    id: 'm1',
    childId: 'c1',
    type: 'video',
    name: 'playtime_interaction.mp4',
    url: '',
    uploadedAt: '2026-08-07T14:22:00',
    analysisStatus: 'complete',
    analysis:
      'Aarav shows strong joint attention and turn-taking during play. Eye contact is consistent. Fine-motor grasp of blocks is age-appropriate. No repetitive motor patterns observed.',
    findings: [
      'Age-appropriate social engagement',
      'Good joint attention',
      'Normal fine-motor patterning',
      'No red-flag stereotypies',
    ],
  },
  {
    id: 'm2',
    childId: 'c2',
    type: 'video',
    name: 'speech_sample.mp4',
    url: '',
    uploadedAt: '2026-08-06T09:10:00',
    analysisStatus: 'complete',
    analysis:
      'Limited spontaneous vocalizations for age. Responds to name inconsistently. Prefers gestural communication. Recommend formal speech-language evaluation within 2 weeks.',
    findings: [
      'Reduced spontaneous speech',
      'Inconsistent name response',
      'Gesture-dominant communication',
      'Priority speech referral',
    ],
  },
]

export const HOME_VISITS: HomeVisit[] = [
  {
    id: 'hv1',
    childId: 'c2',
    childName: 'Anaya Deshmukh',
    village: 'Igatpuri',
    dueDate: '2026-08-10',
    status: 'due',
    purpose: 'Nutrition counselling & anemia follow-up',
  },
  {
    id: 'hv2',
    childId: 'c5',
    childName: 'Reyansh Kulkarni',
    village: 'Niphad',
    dueDate: '2026-08-08',
    status: 'overdue',
    purpose: 'Hearing screen coordination',
  },
  {
    id: 'hv3',
    childId: 'c4',
    childName: 'Myra Joshi',
    village: 'Trimbak',
    dueDate: '2026-08-11',
    status: 'due',
    purpose: 'MMR vaccination reminder',
  },
  {
    id: 'hv4',
    childId: 'c6',
    childName: 'Sara Pawar',
    village: 'Igatpuri',
    dueDate: '2026-08-15',
    status: 'due',
    purpose: 'Routine growth monitoring',
  },
]

export const DISTRICT_STATS: DistrictStat[] = [
  { district: 'Nashik', registered: 4280, screened: 3610, highRisk: 312, lat: 19.9975, lng: 73.7898 },
  { district: 'Ahmednagar', registered: 3120, screened: 2480, highRisk: 265, lat: 19.0948, lng: 74.748 },
  { district: 'Pune', registered: 6850, screened: 5920, highRisk: 418, lat: 18.5204, lng: 73.8567 },
  { district: 'Aurangabad', registered: 2940, screened: 2210, highRisk: 198, lat: 19.8762, lng: 75.3433 },
  { district: 'Jalgaon', registered: 2180, screened: 1740, highRisk: 156, lat: 21.0077, lng: 75.5626 },
  { district: 'Dhule', registered: 1650, screened: 1280, highRisk: 142, lat: 20.9042, lng: 74.7749 },
]

export const DIET_PLAN = [
  { meal: 'Breakfast', time: '8:00 AM', items: 'Ragi porridge with mashed banana, ½ boiled egg' },
  { meal: 'Mid-morning', time: '10:30 AM', items: 'Seasonal fruit (papaya / apple) + water' },
  { meal: 'Lunch', time: '1:00 PM', items: 'Soft rice, dal, mashed vegetables, curd (if tolerated)' },
  { meal: 'Snack', time: '4:00 PM', items: 'Roasted chana / homemade laddoo, milk alternative' },
  { meal: 'Dinner', time: '7:30 PM', items: 'Khichdi with ghee, steamed veggies, small roti piece' },
]

export const PARENT_TIPS = [
  {
    title: 'Talk through the day',
    body: 'Narrate routines — “We’re washing hands” builds vocabulary faster than flashcards.',
    tag: 'Language',
  },
  {
    title: 'Floor time, 15 minutes',
    body: 'Get down to their level and follow their lead in play. Joint attention thrives here.',
    tag: 'Social',
  },
  {
    title: 'One new texture a week',
    body: 'Introduce finger foods with different textures to support oral-motor skills.',
    tag: 'Feeding',
  },
  {
    title: 'Sleep anchors',
    body: 'Same bath → story → lights-out sequence trains circadian rhythm by age 2.',
    tag: 'Sleep',
  },
]

export const AI_CHAT_SEED = [
  {
    id: 'cm1',
    role: 'assistant' as const,
    content:
      'Namaste! I’m BalVikas AI. I can help with milestones, diet ideas, vaccination schedules, and what your screening results mean. What would you like to know about Aarav?',
    timestamp: new Date().toISOString(),
  },
]

export function formatAge(months: number): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} mo`
  if (m === 0) return `${y}y`
  return `${y}y ${m}m`
}

export const ROLE_META = {
  parent: {
    label: 'Parent',
    description: 'Track your child’s growth, screenings & daily care',
    color: '#5b9bd5',
    bg: '#e8f2fb',
  },
  doctor: {
    label: 'Doctor',
    description: 'Examine children, review history & AI insights',
    color: '#2d8a64',
    bg: '#e4f5ec',
  },
  worker: {
    label: 'Anganwadi Sevika',
    description: 'Village screening, visits & vaccination tracking',
    color: '#d4920a',
    bg: '#fdf6e3',
  },
  admin: {
    label: 'Health Admin',
    description: 'District analytics, resources & risk mapping',
    color: '#9b8ec4',
    bg: '#f0edf8',
  },
} as const
