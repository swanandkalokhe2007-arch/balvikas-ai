import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Ruler,
  Weight,
  Activity,
  AlertTriangle,
  Upload,
  MessageCircle,
  Syringe,
} from 'lucide-react'
import { formatAge } from '../../data/mock'
import { DEMO_PARENT_CHILDREN } from '../../data/demoChildren'
import { useAuth } from '../../context/AuthContext'
import { ChildrenAPI, getToken, loginAndStore } from '../../lib/api'
import type { Child } from '../../types'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { ChildAvatar } from '../../components/ui/ChildAvatar'
import { FadeIn } from '../../components/motion/FadeIn'
import { SpecularButton } from '../../components/motion/SpecularButton'

const LOCAL_EXTRA_KEY = 'balvikas_local_children'

function readLocalExtras(): Child[] {
  try {
    const raw = localStorage.getItem(LOCAL_EXTRA_KEY)
    return raw ? (JSON.parse(raw) as Child[]) : []
  } catch {
    return []
  }
}

export function ParentHome() {
  const { user } = useAuth()
  const [apiKids, setApiKids] = useState<Child[]>([])
  const [localKids, setLocalKids] = useState<Child[]>(() => readLocalExtras())
  const [activeId, setActiveId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        if (!getToken()) {
          await loginAndStore('parent@demo.com', 'demo1234')
        }
        const res = await ChildrenAPI.list()
        if (alive) setApiKids(res.children || [])
      } catch {
        // Prototype fallback — still show demo children
        if (alive) setApiKids([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [user?.id])

  // Merge: API kids + local extras + always ensure demo pack visible for prototype
  const kids = useMemo(() => {
    const map = new Map<string, Child>()
    // Demo pack first
    for (const c of DEMO_PARENT_CHILDREN) map.set(c.id, c)
    // API overwrites/adds
    for (const c of apiKids) map.set(c.id, c)
    // Local registrations
    for (const c of localKids) map.set(c.id, c)
    return Array.from(map.values())
  }, [apiKids, localKids])

  useEffect(() => {
    if (!kids.length) return
    if (!activeId || !kids.some((c) => c.id === activeId)) {
      setActiveId(kids[0].id)
    }
  }, [kids, activeId])

  // Listen for new local registrations from Register page
  useEffect(() => {
    const onStorage = () => setLocalKids(readLocalExtras())
    window.addEventListener('storage', onStorage)
    window.addEventListener('balvikas-children-updated', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('balvikas-children-updated', onStorage)
    }
  }, [])

  const child = kids.find((c) => c.id === activeId) || kids[0] || null

  if (loading && !child) {
    return (
      <div className="p-12 text-center text-slate text-sm">
        <div className="w-8 h-8 border-2 border-leaf border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading children…
      </div>
    )
  }

  if (!child) {
    return (
      <div className="max-w-md mx-auto glass-card rounded-3xl p-8 text-center space-y-4">
        <h1 className="font-display text-xl font-semibold">No children yet</h1>
        <Link
          to="/parent/register"
          className="inline-flex px-5 py-3 rounded-xl bg-forest text-white text-sm font-semibold"
        >
          Register child
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate mb-1">
              {user?.name || 'Neha Verma'} · {kids.length} children
            </p>
            <h1 className="font-display text-3xl font-semibold text-ink">{child.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {kids.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                    c.id === child.id ? 'bg-forest text-white border-forest' : 'bg-white border-mist'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/parent/register">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl border border-forest/15 text-sm font-semibold"
              >
                + Add child
              </button>
            </Link>
            <Link to="/parent/media">
              <SpecularButton size="sm">
                <Upload size={15} /> Upload
              </SpecularButton>
            </Link>
          </div>
        </div>
      </FadeIn>

      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <ChildAvatar name={child.name} gender={child.gender} size={80} />
          <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate font-medium">Child</p>
              <p className="font-display text-xl font-semibold mt-0.5">{child.name}</p>
              <p className="text-sm text-slate capitalize">
                {child.gender} · {formatAge(child.ageMonths)} · {child.dob}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate font-medium">Development</p>
              <div className="mt-1">
                <Badge status={child.developmentStatus}>{child.developmentStatus}</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate font-medium">Risk</p>
              <div className="mt-1">
                <Badge status={child.riskLevel}>{child.riskLevel}</Badge>
              </div>
              {!!child.allergies?.length && (
                <p className="text-sm text-coral mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={12} /> {child.allergies.join(', ')}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate font-medium">Location</p>
              <p className="text-sm font-medium mt-1">
                {child.village}, {child.district}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Height" value={`${child.heightCm} cm`} icon={<Ruler size={20} />} accent="#5b9bd5" />
        <StatCard label="Weight" value={`${child.weightKg} kg`} icon={<Weight size={20} />} accent="#2d8a64" />
        <StatCard
          label="Screen score"
          value={child.screenings?.[0]?.score ?? '—'}
          icon={<Activity size={20} />}
          accent="#9b8ec4"
        />
        <StatCard
          label="Vaccines due"
          value={(child.vaccinations || []).filter((v) => v.status === 'due' || v.status === 'overdue').length}
          icon={<Syringe size={20} />}
          accent="#d4920a"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Screenings</h2>
          <div className="space-y-3">
            {(child.screenings || []).map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-mist/50 flex justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{s.type}</p>
                    <Badge status={s.result}>{s.result}</Badge>
                  </div>
                  <p className="text-xs text-slate">
                    {s.date} · {s.conductedBy}
                  </p>
                  <p className="text-sm mt-1">{s.notes}</p>
                </div>
                <p className="font-display text-2xl font-semibold text-forest">{s.score}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 space-y-2">
          <h2 className="font-display text-lg font-semibold mb-2">Quick actions</h2>
          {[
            { to: '/parent/media', icon: <Upload size={16} />, label: 'Upload media' },
            { to: '/parent/chat', icon: <MessageCircle size={16} />, label: 'AI assistant' },
            { to: '/parent/growth', icon: <Activity size={16} />, label: 'Growth chart' },
            { to: '/parent/report', icon: <ArrowRight size={16} />, label: 'Download report' },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-mist/80 text-sm font-medium"
            >
              {a.icon}
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {child.summary && (
        <div className="rounded-3xl bg-forest text-white p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-mint mb-2">Summary</p>
          <p className="text-foam leading-relaxed">{child.summary}</p>
        </div>
      )}
    </div>
  )
}
