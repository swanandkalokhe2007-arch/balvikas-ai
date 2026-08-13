import { Link } from 'react-router-dom'
import { Users, ClipboardCheck, Home, Syringe, ShieldAlert, ArrowRight } from 'lucide-react'
import { formatAge } from '../../data/mock'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { FadeIn } from '../../components/motion/FadeIn'

export function WorkerHome() {
  const { user } = useAuth()
  const { children: CHILDREN, visits: HOME_VISITS } = useData()
  const villageKids = CHILDREN
  const pendingScreen = CHILDREN.filter(
    (c) => !c.lastScreening || c.lastScreening < '2026-06-01',
  )
  const visitsDue = HOME_VISITS.filter((v) => v.status !== 'completed')
  const vaxDue = CHILDREN.flatMap((c) =>
    c.vaccinations.filter((v) => v.status === 'due' || v.status === 'overdue'),
  )
  const highRisk = CHILDREN.filter((c) => c.riskLevel === 'high')

  return (
    <div className="space-y-8 max-w-6xl">
      <FadeIn>
        <p className="text-sm text-slate mb-1">Anganwadi Sevika · {user?.village || 'Field'}</p>
        <h1 className="font-display text-3xl font-semibold text-ink">Namaste, {user?.name.split(' ')[0]}</h1>
        <p className="text-sm text-slate mt-1">Village health & early childhood dashboard</p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Children in area" value={villageKids.length} icon={<Users size={20} />} accent="#d4920a" delay={0.05} />
        <StatCard label="Pending screening" value={pendingScreen.length || 2} icon={<ClipboardCheck size={20} />} accent="#5b9bd5" delay={0.1} />
        <StatCard label="Home visits due" value={visitsDue.length} icon={<Home size={20} />} accent="#2d8a64" delay={0.15} />
        <StatCard label="Vaccination reminders" value={vaxDue.length} icon={<Syringe size={20} />} accent="#e07a5f" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <FadeIn delay={0.15}>
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Home size={18} className="text-leaf" /> Home visits
              </h2>
              <Link to="/worker/visits" className="text-xs font-semibold text-leaf hover:underline">
                All visits
              </Link>
            </div>
            <div className="space-y-2">
              {HOME_VISITS.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-mist/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-ink">{v.childName}</p>
                      <Badge status={v.status} />
                    </div>
                    <p className="text-xs text-slate truncate">
                      {v.village} · {v.purpose}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate shrink-0">{v.dueDate.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <ShieldAlert size={18} className="text-danger" /> High-risk alerts
              </h2>
              <Link to="/worker/alerts" className="text-xs font-semibold text-leaf hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {highRisk.map((c) => (
                <div key={c.id} className="p-3 rounded-2xl border border-danger/15 bg-danger/5">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-ink">{c.name}</p>
                    <span className="text-xs text-slate">{formatAge(c.ageMonths)}</span>
                  </div>
                  <p className="text-xs text-slate line-clamp-2">{c.village} · {c.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { to: '/worker/register', label: 'Register new child', desc: 'Add to village roster' },
            { to: '/worker/growth', label: 'Log growth', desc: 'Height & weight entry' },
            { to: '/worker/education', label: 'Parent session', desc: 'Education materials' },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="glass-card rounded-2xl p-5 hover:shadow-md transition-shadow group"
            >
              <p className="font-semibold text-ink group-hover:text-leaf transition-colors flex items-center gap-1">
                {a.label} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
              </p>
              <p className="text-xs text-slate mt-1">{a.desc}</p>
            </Link>
          ))}
        </div>
      </FadeIn>
    </div>
  )
}
