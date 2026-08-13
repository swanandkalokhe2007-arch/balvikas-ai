import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const DB_PATH = path.join(DATA_DIR, 'db.json')
const UPLOADS = path.join(__dirname, 'uploads')

for (const dir of [DATA_DIR, UPLOADS]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
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
  if (!fs.existsSync(DB_PATH)) {
    const d = empty()
    write(d)
    return d
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
  } catch {
    return empty()
  }
}

function write(data) {
  data.meta = { ...(data.meta || {}), updatedAt: new Date().toISOString() }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
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
  return UPLOADS
}

export function dbPath() {
  return DB_PATH
}

export { DATA_DIR }
