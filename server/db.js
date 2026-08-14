import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isVercel = !!process.env.VERCEL

// On Vercel the only writable path is /tmp — use it for prototype persistence
// within a warm instance. Cold starts re-seed from empty + ensureSeed().
const DATA_DIR = isVercel ? path.join('/tmp', 'balvikas-data') : path.join(__dirname, 'data')
const DB_PATH = path.join(DATA_DIR, 'db.json')
const UPLOADS = isVercel ? path.join('/tmp', 'balvikas-uploads') : path.join(__dirname, 'uploads')

// In-memory cache so serverless handlers in the same instance share state
let memoryDb = null

for (const dir of [DATA_DIR, UPLOADS]) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  } catch {
    /* ignore on restricted FS */
  }
}

const empty = () => ({
  users: [],
  children: [],
  appointments: [],
  media: [],
  visits: [],
  districts: [],
  chat: {},
  meta: { version: 1, updatedAt: new Date().toISOString() },
})

function read() {
  if (memoryDb) return structuredClone(memoryDb)
  if (!fs.existsSync(DB_PATH)) {
    const d = empty()
    write(d)
    return structuredClone(d)
  }
  try {
    const d = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    memoryDb = d
    return structuredClone(d)
  } catch {
    return empty()
  }
}

function write(data) {
  data.meta = { ...(data.meta || {}), updatedAt: new Date().toISOString() }
  memoryDb = structuredClone(data)
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch {
    // Memory still holds data for this instance
  }
}

export function id(prefix = 'id') {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`
}

export function getDb() {
  return read()
}

export function saveDb(mutator) {
  const db = read()
  const next = mutator(db) || db
  write(next)
  return next
}

export function uploadsDir() {
  try {
    if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true })
  } catch {
    /* ignore */
  }
  return UPLOADS
}

export function dbPath() {
  return DB_PATH
}

export { DATA_DIR }
