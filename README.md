# BalVikas AI — Childhood Development Screening

Deployable multi-role web app for AI-assisted early childhood screening:

- **Parents** — growth, vaccines, diet, media upload + AI analysis, chat, reports  
- **Doctors** — caseload, high-risk queue, clinical summaries, appointments  
- **Anganwadi Sevikas** — registration, visits, field **OpenStreetMap**, alerts  
- **Health admins** — district stats, predictive charts, **live map**

Data is stored on the server (JSON file DB by default). Auth uses JWT + bcrypt.

## Quick start (development)

```bash
npm install
npm run dev
```

- Web: http://localhost:5173 (proxies `/api` + `/uploads` → API)  
- API: http://localhost:4000  

### Demo logins (password `demo1234`)

| Role | Email |
|------|-------|
| Parent | parent@demo.com |
| Doctor | doctor@demo.com |
| Worker | worker@demo.com |
| Admin | admin@demo.com |

Or create a real account on **Sign up**.

## Production deploy

### Option A — single Node process (API serves built SPA)

```bash
npm install
npm run build
export JWT_SECRET='long-random-secret'
export PORT=4000
npm start
```

Open http://localhost:4000

### Option B — Docker

```bash
docker compose up --build -d
```

App on port **4000**. Data + uploads persist in named volumes.

### Environment

| Variable | Default | Notes |
|----------|---------|-------|
| `PORT` | `4000` | API / production server |
| `JWT_SECRET` | dev secret | **Change in production** |
| `NODE_ENV` | — | `production` serves `dist/` |
| `CLIENT_ORIGIN` | reflect request | CORS origin if split hosting |

## API surface (realtime)

- `POST /api/auth/signup` · `login` · `logout` · `GET /me`
- `GET/POST/PATCH /api/children` · growth · screenings
- `GET/POST /api/appointments` · `/api/visits`
- `POST /api/media` (multipart) · AI analysis job
- `GET/POST /api/chat/:childId`
- `GET /api/districts` · `/api/map/points` · `/api/stats/overview`

## Maps

Admin **Attention map** and Worker **Field map** use **Leaflet + CARTO Voyager** tiles (OpenStreetMap) with live child / visit / district markers.

## Stack

React 19 · TypeScript · Vite · Tailwind 4 · Framer Motion · Recharts · Leaflet  
Express · JWT · bcrypt · multer · file JSON store
