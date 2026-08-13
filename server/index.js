import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { getDb, saveDb, id, uploadsDir } from './db.js'
import { ensureSeed, resetDemoData, DEMO_PASSWORD } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 4000)
const JWT_SECRET = process.env.JWT_SECRET || 'balvikas-dev-secret-change-in-production'
const isProd = process.env.NODE_ENV === 'production'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || true

await ensureSeed()

const app = express()
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use('/uploads', express.static(uploadsDir()))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir()),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}_${safe}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('Only image/video uploads allowed'))
  },
})

function publicUser(u) {
  if (!u) return null
  const { passwordHash, ...rest } = u
  return rest
}

function sign(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: '14d',
  })
}

function auth(req, res, next) {
  const header = req.headers.authorization
  const token =
    (header?.startsWith('Bearer ') ? header.slice(7) : null) ||
    req.cookies?.balvikas_token ||
    null
  const db = getDb()
  // Prototype mode: if no/invalid token, fall back to parent demo account
  // so the UI always works for presentations.
  const asParent = () => {
    const u = db.users.find((x) => x.email === 'parent@demo.com') || db.users[0]
    if (!u) return res.status(401).json({ error: 'No users seeded' })
    req.user = u
    return next()
  }
  if (!token) return asParent()
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = db.users.find((u) => u.id === payload.sub)
    if (!user) return asParent()
    req.user = user
    next()
  } catch {
    return asParent()
  }
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

function ageMonthsFromDob(dob) {
  const d = new Date(dob)
  const now = new Date()
  return Math.max(0, (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth()))
}

function recomputeDistricts(db) {
  const map = new Map()
  for (const d of db.districts || []) {
    map.set(d.district, { ...d })
  }
  // Live counts from children override sample registered/screened where we have cases
  const byDistrict = {}
  for (const c of db.children || []) {
    const key = c.district || 'Unknown'
    if (!byDistrict[key]) byDistrict[key] = { registered: 0, screened: 0, highRisk: 0 }
    byDistrict[key].registered += 1
    if (c.lastScreening) byDistrict[key].screened += 1
    if (c.riskLevel === 'high') byDistrict[key].highRisk += 1
  }
  // Merge: keep geo from districts table, bump live high-risk from children
  return (db.districts || []).map((d) => {
    const live = byDistrict[d.district]
    if (!live) return d
    return {
      ...d,
      // Keep large demo population figures; overlay live high-risk floor
      highRisk: Math.max(d.highRisk, live.highRisk),
      liveRegistered: live.registered,
      liveScreened: live.screened,
      liveHighRisk: live.highRisk,
    }
  })
}

// ── Health ──
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), mode: isProd ? 'production' : 'development' })
})

// ── Demo helpers (for presentations) ──
app.get('/api/demo/accounts', (_req, res) => {
  res.json({
    password: DEMO_PASSWORD,
    accounts: [
      { role: 'parent', email: 'parent@demo.com', name: 'Priya Sharma', note: '2 children · full parent tour' },
      { role: 'parent', email: 'parent2@demo.com', name: 'Meera Deshmukh', note: 'High-risk child (Anaya)' },
      { role: 'doctor', email: 'doctor@demo.com', name: 'Dr. Ananya Mehta', note: 'Today’s clinic + high-risk queue' },
      { role: 'doctor', email: 'doctor2@demo.com', name: 'Dr. Rohan Kale', note: 'Secondary clinician' },
      { role: 'worker', email: 'worker@demo.com', name: 'Sunita Patil', note: 'Sinnar field · visits · map' },
      { role: 'worker', email: 'worker2@demo.com', name: 'Lata Jadhav', note: 'Igatpuri field' },
      { role: 'admin', email: 'admin@demo.com', name: 'Rajesh Kulkarni', note: 'District map & analytics' },
    ],
  })
})

/** Reset demo pack — admin only in production; open in dev for smooth demos */
app.post('/api/demo/reset', async (req, res) => {
  try {
    if (isProd) {
      // require admin token in production
      const header = req.headers.authorization
      const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.balvikas_token
      if (!token) return res.status(401).json({ error: 'Admin login required to reset in production' })
      try {
        const payload = jwt.verify(token, JWT_SECRET)
        if (payload.role !== 'admin') return res.status(403).json({ error: 'Admin only' })
      } catch {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }
    const data = await resetDemoData()
    res.json({
      ok: true,
      counts: {
        users: data.users.length,
        children: data.children.length,
        appointments: data.appointments.length,
        visits: data.visits.length,
        media: data.media.length,
        districts: data.districts.length,
      },
      message: 'Demo data restored. Live create/update still works on top of this pack.',
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Reset failed' })
  }
})

// ── Auth ──
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role, phone, village, specialty } = req.body || {}
    if (!name?.trim() || !email?.trim() || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, role required' })
    }
    const allowed = ['parent', 'doctor', 'worker', 'admin']
    if (!allowed.includes(role)) return res.status(400).json({ error: 'Invalid role' })
    if (String(password).length < 6) return res.status(400).json({ error: 'Password min 6 chars' })

    const db = getDb()
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = {
      id: id('u'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      phone: phone || '',
      village: village || (role === 'parent' || role === 'worker' ? 'Sinnar' : undefined),
      district: 'Nashik',
      specialty:
        specialty ||
        (role === 'doctor' ? 'Pediatrics' : role === 'admin' ? 'Health Department' : undefined),
      createdAt: new Date().toISOString(),
    }
    saveDb((d) => {
      d.users.push(user)
      return d
    })
    const token = sign(user)
    res.cookie('balvikas_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 14 * 86400000,
    })
    res.status(201).json({ user: publicUser(user), token })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Signup failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })
    const db = getDb()
    const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = sign(user)
    res.cookie('balvikas_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 14 * 86400000,
    })
    res.json({ user: publicUser(user), token })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('balvikas_token')
  res.json({ ok: true })
})

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

// ── Children ──
app.get('/api/children', auth, (req, res) => {
  const db = getDb()
  let list = [...(db.children || [])]
  const { role, id: uid } = req.user
  if (role === 'parent') list = list.filter((c) => c.parentId === uid)
  // doctor/worker/admin see all (scope later by district if needed)
  const q = (req.query.q || '').toString().toLowerCase()
  const risk = req.query.risk
  if (risk) list = list.filter((c) => c.riskLevel === risk)
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.village?.toLowerCase().includes(q) ||
        c.parentName?.toLowerCase().includes(q),
    )
  }
  res.json({ children: list })
})

app.get('/api/children/:id', auth, (req, res) => {
  const db = getDb()
  const child = db.children.find((c) => c.id === req.params.id)
  if (!child) return res.status(404).json({ error: 'Not found' })
  if (req.user.role === 'parent' && child.parentId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  res.json({ child })
})

app.post('/api/children', auth, (req, res) => {
  const body = req.body || {}
  if (!body.name || !body.dob || !body.gender) {
    return res.status(400).json({ error: 'name, dob, gender required' })
  }
  const parentId = req.user.role === 'parent' ? req.user.id : body.parentId || req.user.id
  const parentName =
    req.user.role === 'parent' ? req.user.name : body.parentName || req.user.name

  const child = {
    id: id('c'),
    name: body.name.trim(),
    dob: body.dob,
    ageMonths: ageMonthsFromDob(body.dob),
    gender: body.gender,
    heightCm: Number(body.heightCm) || 0,
    weightKg: Number(body.weightKg) || 0,
    parentId,
    parentName,
    village: body.village || req.user.village || 'Sinnar',
    district: body.district || req.user.district || 'Nashik',
    lat: body.lat != null ? Number(body.lat) : 19.9975 + (Math.random() - 0.5) * 0.4,
    lng: body.lng != null ? Number(body.lng) : 73.7898 + (Math.random() - 0.5) * 0.4,
    allergies: body.allergies || [],
    medicalConditions: body.medicalConditions || [],
    developmentStatus: body.developmentStatus || 'normal',
    riskLevel: body.riskLevel || 'low',
    lastScreening: body.lastScreening || null,
    summary: body.summary || `${body.name.trim()} — newly registered. Complete first screening.`,
    vaccinations: body.vaccinations || [],
    growthHistory:
      body.heightCm && body.weightKg
        ? [
            {
              date: new Date().toISOString().slice(0, 10),
              heightCm: Number(body.heightCm),
              weightKg: Number(body.weightKg),
              ageMonths: ageMonthsFromDob(body.dob),
            },
          ]
        : [],
    screenings: [],
    phone: body.phone || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: req.user.id,
  }

  saveDb((d) => {
    d.children.push(child)
    return d
  })
  res.status(201).json({ child })
})

app.patch('/api/children/:id', auth, (req, res) => {
  const db = getDb()
  const idx = db.children.findIndex((c) => c.id === req.params.id)
  if (idx < 0) return res.status(404).json({ error: 'Not found' })
  const existing = db.children[idx]
  if (req.user.role === 'parent' && existing.parentId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  const body = req.body || {}
  const next = {
    ...existing,
    ...body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  }
  if (body.dob) next.ageMonths = ageMonthsFromDob(body.dob)
  saveDb((d) => {
    d.children[idx] = next
    return d
  })
  res.json({ child: next })
})

app.post('/api/children/:id/growth', auth, (req, res) => {
  const { heightCm, weightKg, date } = req.body || {}
  if (heightCm == null || weightKg == null) {
    return res.status(400).json({ error: 'heightCm and weightKg required' })
  }
  let updated
  saveDb((d) => {
    const c = d.children.find((x) => x.id === req.params.id)
    if (!c) return d
    if (req.user.role === 'parent' && c.parentId !== req.user.id) return d
    const point = {
      date: date || new Date().toISOString().slice(0, 10),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      ageMonths: c.ageMonths,
    }
    c.growthHistory = [...(c.growthHistory || []), point]
    c.heightCm = Number(heightCm)
    c.weightKg = Number(weightKg)
    c.updatedAt = new Date().toISOString()
    updated = c
    return d
  })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json({ child: updated })
})

app.post('/api/children/:id/screenings', auth, requireRoles('doctor', 'worker', 'admin'), (req, res) => {
  const { type, result, score, notes } = req.body || {}
  let updated
  saveDb((d) => {
    const c = d.children.find((x) => x.id === req.params.id)
    if (!c) return d
    const s = {
      id: id('s'),
      date: new Date().toISOString().slice(0, 10),
      type: type || 'ASQ-3 Developmental',
      result: result || 'normal',
      score: Number(score) || 0,
      notes: notes || '',
      conductedBy: req.user.name,
    }
    c.screenings = [s, ...(c.screenings || [])]
    c.lastScreening = s.date
    if (result === 'refer') c.riskLevel = 'high'
    else if (result === 'monitor' && c.riskLevel === 'low') c.riskLevel = 'medium'
    c.updatedAt = new Date().toISOString()
    updated = c
    return d
  })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.status(201).json({ child: updated })
})

// ── Appointments ──
app.get('/api/appointments', auth, (req, res) => {
  const db = getDb()
  let list = [...(db.appointments || [])]
  if (req.user.role === 'doctor') list = list.filter((a) => a.doctorId === req.user.id || true)
  if (req.user.role === 'parent') {
    const kids = new Set(db.children.filter((c) => c.parentId === req.user.id).map((c) => c.id))
    list = list.filter((a) => kids.has(a.childId))
  }
  list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  res.json({ appointments: list })
})

app.post('/api/appointments', auth, (req, res) => {
  const body = req.body || {}
  if (!body.childId || !body.date || !body.time) {
    return res.status(400).json({ error: 'childId, date, time required' })
  }
  const db = getDb()
  const child = db.children.find((c) => c.id === body.childId)
  const appt = {
    id: id('a'),
    childId: body.childId,
    childName: child?.name || body.childName || 'Child',
    doctorId: body.doctorId || (req.user.role === 'doctor' ? req.user.id : 'u_doctor_1'),
    date: body.date,
    time: body.time,
    type: body.type || 'Consultation',
    status: body.status || 'scheduled',
    createdAt: new Date().toISOString(),
  }
  saveDb((d) => {
    d.appointments.push(appt)
    return d
  })
  res.status(201).json({ appointment: appt })
})

app.patch('/api/appointments/:id', auth, (req, res) => {
  let updated
  saveDb((d) => {
    const a = d.appointments.find((x) => x.id === req.params.id)
    if (!a) return d
    Object.assign(a, req.body || {}, { id: a.id })
    updated = a
    return d
  })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json({ appointment: updated })
})

// ── Home visits ──
app.get('/api/visits', auth, (req, res) => {
  const db = getDb()
  res.json({ visits: db.visits || [] })
})

app.post('/api/visits', auth, requireRoles('worker', 'admin', 'doctor'), (req, res) => {
  const body = req.body || {}
  const db = getDb()
  const child = db.children.find((c) => c.id === body.childId)
  const visit = {
    id: id('hv'),
    childId: body.childId,
    childName: child?.name || body.childName,
    village: body.village || child?.village || '',
    dueDate: body.dueDate || new Date().toISOString().slice(0, 10),
    status: body.status || 'due',
    purpose: body.purpose || 'Home visit',
    lat: body.lat ?? child?.lat,
    lng: body.lng ?? child?.lng,
    createdAt: new Date().toISOString(),
  }
  saveDb((d) => {
    d.visits.push(visit)
    return d
  })
  res.status(201).json({ visit })
})

app.patch('/api/visits/:id', auth, (req, res) => {
  let updated
  saveDb((d) => {
    const v = d.visits.find((x) => x.id === req.params.id)
    if (!v) return d
    Object.assign(v, req.body || {}, { id: v.id })
    updated = v
    return d
  })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json({ visit: updated })
})

// ── Media + AI analysis (rule-based demo analyzer — replace with real model later) ──
function analyzeMedia(fileName, type) {
  const isVideo = type === 'video' || /\.(mp4|mov|webm)$/i.test(fileName)
  if (isVideo) {
    return {
      analysis:
        'Behaviour signals extracted from the clip: joint attention present; motor patterns appear age-typical; no clear repetitive stereotypies in the sampled window. Recommend pairing with a short speech sample for language scoring.',
      findings: [
        'Joint attention observed',
        'Age-appropriate motor patterns',
        'Visual engagement present',
        'Suggest speech sample next',
      ],
    }
  }
  return {
    analysis:
      'Photo reviewed: posture and facial affect look typical for age. Add a 60–120s interaction video for richer behavioural signal.',
    findings: ['Typical posture', 'Facial affect appropriate', 'Add video for depth'],
  }
}

app.get('/api/media', auth, (req, res) => {
  const db = getDb()
  let list = [...(db.media || [])]
  if (req.query.childId) list = list.filter((m) => m.childId === req.query.childId)
  if (req.user.role === 'parent') {
    const kids = new Set(db.children.filter((c) => c.parentId === req.user.id).map((c) => c.id))
    list = list.filter((m) => kids.has(m.childId))
  }
  list.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''))
  res.json({ media: list })
})

app.post('/api/media', auth, upload.single('file'), (req, res) => {
  try {
    const childId = req.body.childId
    if (!childId) return res.status(400).json({ error: 'childId required' })
    const db = getDb()
    const child = db.children.find((c) => c.id === childId)
    if (!child) return res.status(404).json({ error: 'Child not found' })
    if (req.user.role === 'parent' && child.parentId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    if (!req.file) return res.status(400).json({ error: 'file required' })

    const type = req.file.mimetype.startsWith('video') ? 'video' : 'photo'
    const url = `/uploads/${req.file.filename}`
    const record = {
      id: id('m'),
      childId,
      type,
      name: req.file.originalname,
      url,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      analysisStatus: 'analyzing',
      uploadedBy: req.user.id,
    }
    saveDb((d) => {
      d.media.unshift(record)
      return d
    })

    // Simulate async analysis then persist results
    setTimeout(() => {
      const result = analyzeMedia(req.file.originalname, type)
      saveDb((d) => {
        const m = d.media.find((x) => x.id === record.id)
        if (m) {
          m.analysisStatus = 'complete'
          m.analysis = result.analysis
          m.findings = result.findings
          m.solutions =
            'Continue daily interactive play. Capture a short speech sample next week. Share with your doctor at the next visit unless new red flags appear.'
        }
        return d
      })
    }, 1800)

    res.status(201).json({ media: record })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message || 'Upload failed' })
  }
})

app.delete('/api/media/:id', auth, (req, res) => {
  saveDb((d) => {
    const m = d.media.find((x) => x.id === req.params.id)
    if (m?.url?.startsWith('/uploads/')) {
      const fp = path.join(uploadsDir(), path.basename(m.url))
      try {
        if (fs.existsSync(fp)) fs.unlinkSync(fp)
      } catch {
        /* ignore */
      }
    }
    d.media = d.media.filter((x) => x.id !== req.params.id)
    return d
  })
  res.json({ ok: true })
})

// ── Chat ──
app.get('/api/chat/:childId', auth, (req, res) => {
  const db = getDb()
  const key = `${req.user.id}:${req.params.childId}`
  const messages = db.chat[key] || [
    {
      id: id('cm'),
      role: 'assistant',
      content:
        'Namaste! I’m BalVikas AI. Ask about milestones, diet, vaccines, or screening results for this child.',
      timestamp: new Date().toISOString(),
    },
  ]
  res.json({ messages })
})

app.post('/api/chat/:childId', auth, (req, res) => {
  const text = (req.body?.content || '').trim()
  if (!text) return res.status(400).json({ error: 'content required' })
  const db = getDb()
  const child = db.children.find((c) => c.id === req.params.childId)
  const name = child?.name || 'your child'
  const t = text.toLowerCase()
  let reply =
    `Based on ${name}'s record, development is being monitored. Keep daily floor-time play and consistent routines. Ask me about growth, vaccines, diet, sleep, or speech.`
  if (t.includes('vaccin') || t.includes('immun'))
    reply = `${name}'s immunization list is on the Vaccinations page. Overdue items should be completed at the next Anganwadi / clinic day.`
  else if (t.includes('diet') || t.includes('food') || t.includes('eat'))
    reply = `For ${name}, focus on iron-rich dals, ragi, seasonal fruit, and age-appropriate textures. Avoid known allergens: ${(child?.allergies || []).join(', ') || 'none listed'}.`
  else if (t.includes('sleep') || t.includes('nap'))
    reply = 'Aim for consistent bedtime anchors (bath → story → lights out). Toddlers often need 11–14 hours including one nap.'
  else if (t.includes('speech') || t.includes('talk') || t.includes('language'))
    reply = `Language concerns should be paired with a short home video upload. ${child?.riskLevel === 'high' ? 'This child is high-risk — prioritise SLP referral.' : 'Narrate routines and use wait-time after questions.'}`
  else if (t.includes('growth') || t.includes('height') || t.includes('weight'))
    reply = `${name}: height ${child?.heightCm ?? '—'} cm, weight ${child?.weightKg ?? '—'} kg. Log new measurements from Growth so the chart stays current.`

  const key = `${req.user.id}:${req.params.childId}`
  const userMsg = {
    id: id('cm'),
    role: 'user',
    content: text,
    timestamp: new Date().toISOString(),
  }
  const botMsg = {
    id: id('cm'),
    role: 'assistant',
    content: reply,
    timestamp: new Date().toISOString(),
  }
  saveDb((d) => {
    const prev = d.chat[key] || [
      {
        id: id('cm'),
        role: 'assistant',
        content: 'Namaste! I’m BalVikas AI. How can I help?',
        timestamp: new Date().toISOString(),
      },
    ]
    d.chat[key] = [...prev, userMsg, botMsg]
    return d
  })
  res.json({ messages: [userMsg, botMsg] })
})

// ── Districts / map ──
app.get('/api/districts', auth, (req, res) => {
  const db = getDb()
  res.json({ districts: recomputeDistricts(db) })
})

app.get('/api/map/points', auth, (req, res) => {
  const db = getDb()
  const children = (db.children || [])
    .filter((c) => c.lat != null && c.lng != null)
    .map((c) => ({
      id: c.id,
      name: c.name,
      village: c.village,
      district: c.district,
      riskLevel: c.riskLevel,
      lat: c.lat,
      lng: c.lng,
      type: 'child',
    }))
  const visits = (db.visits || [])
    .filter((v) => v.lat != null && v.lng != null && v.status !== 'completed')
    .map((v) => ({
      id: v.id,
      name: v.childName,
      village: v.village,
      purpose: v.purpose,
      status: v.status,
      lat: v.lat,
      lng: v.lng,
      type: 'visit',
    }))
  const districts = recomputeDistricts(db).map((d) => ({
    id: d.id || d.district,
    name: d.district,
    lat: d.lat,
    lng: d.lng,
    highRisk: d.highRisk,
    registered: d.registered,
    screened: d.screened,
    type: 'district',
  }))
  res.json({ children, visits, districts })
})

// ── Stats for dashboards ──
app.get('/api/stats/overview', auth, (req, res) => {
  const db = getDb()
  const children = db.children || []
  const mine =
    req.user.role === 'parent' ? children.filter((c) => c.parentId === req.user.id) : children
  res.json({
    totalChildren: mine.length,
    highRisk: mine.filter((c) => c.riskLevel === 'high').length,
    appointmentsToday: (db.appointments || []).filter(
      (a) => a.date === new Date().toISOString().slice(0, 10),
    ).length,
    pendingVisits: (db.visits || []).filter((v) => v.status !== 'completed').length,
    mediaCount: (db.media || []).length,
    districts: recomputeDistricts(db),
  })
})

// Production: serve built SPA
const dist = path.join(__dirname, '..', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get(/^(?!\/api)(?!\/uploads).*/, (_req, res) => {
    res.sendFile(path.join(dist, 'index.html'))
  })
}

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Server error' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BalVikas API listening on http://0.0.0.0:${PORT}`)
})
