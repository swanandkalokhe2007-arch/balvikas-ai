import { Link } from 'react-router-dom'
import {
  Users,
  AlertTriangle,
  Calendar,
  ClipboardList,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { ChildAvatar } from '../../components/ui/ChildAvatar'
import { FadeIn } from '../../components/motion/FadeIn'
import { formatAge } from '../../data/mock'

export function DoctorHome() {
  const { children: CHILDREN, appointments: APPOINTMENTS } = useData()
  const { user } = useAuth()
  const highRisk = CHILDREN.filter((c) => c.riskLevel === 'high')
  const todayAppts = APPOINTMENTS.filter((a) => a.date === new Date().toISOString().slice(0, 10) && a.status === 'scheduled')
  const pendingReviews = APPOINTMENTS.filter((a) => a.status === 'pending')

  return (
    <div className="space-y-8 max-w-6xl">
      <FadeIn>
        <p className="text-sm text-slate mb-1">Clinical workspace</p>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Welcome, {user?.name}
        </h1>
        <p className="text-slate text-sm mt-1">{user?.specialty}</p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Children examined" value={CHILDREN.length} icon={<Users size={20} />} trend="Active caseload" accent="#2d8a64" delay={0.05} />
        <StatCard label="High risk" value={highRisk.length} icon={<AlertTriangle size={20} />} trend="Needs attention" accent="#c44b4b" delay={0.1} />
        <StatCard label="Today's appointments" value={todayAppts.length} icon={<Calendar size={20} />} trend="9 Aug 2026" accent="#5b9bd5" delay={0.15} />
        <StatCard label="Pending reviews" value={pendingReviews.length + 2} icon={<ClipboardList size={20} />} trend="Media + visits" accent="#d4920a" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <FadeIn delay={0.15} className="lg:col-span-3">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Today&apos;s schedule</h2>
              <Link to="/doctor/appointments" className="text-xs font-semibold text-leaf hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {todayAppts.map((a) => {
                const child = CHILDREN.find((c) => c.id === a.childId)
                return (
                  <Link
                    key={a.id}
                    to={`/doctor/child/${a.childId}`}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-mist/70 transition-colors group"
                  >
                    <div className="text-sm font-mono font-semibold text-forest w-14">{a.time}</div>
                    <ChildAvatar name={a.childName} gender={child?.gender} size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-ink">{a.childName}</p>
                      <p className="text-xs text-slate truncate">{a.type}</p>
                    </div>
                    {child && <Badge status={child.riskLevel}>{child.riskLevel}</Badge>}
                    <ArrowRight size={14} className="text-slate opacity-0 group-hover:opacity-100" />
                  </Link>
                )
              })}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-danger" />
              <h2 className="font-display text-lg font-semibold">High-risk queue</h2>
            </div>
            <div className="space-y-3">
              {highRisk.map((c) => (
                <Link
                  key={c.id}
                  to={`/doctor/child/${c.id}`}
                  className="block p-3 rounded-2xl border border-danger/15 bg-danger/5 hover:bg-danger/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-ink">{c.name}</p>
                    <Badge status="high">high</Badge>
                  </div>
                  <p className="text-xs text-slate line-clamp-2">{c.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <div className="rounded-3xl bg-gradient-to-r from-forest to-leaf p-6 md:p-8 text-white flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Sparkles size={22} className="text-amber" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-semibold mb-1">Clinical summary feature</h3>
            <p className="text-foam/85 text-sm leading-relaxed">
              Open any child file for a least-words summary — height, weight, allergies, conditions, vaccines —
              so you never re-read the whole chart while medicating. Built for new and experienced doctors alike.
            </p>
          </div>
          <Link
            to="/doctor/patients"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-white text-forest text-sm font-semibold hover:bg-foam transition-colors"
          >
            Open caseload
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Recent caseload</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate border-b border-mist">
                  <th className="pb-3 font-semibold">Child</th>
                  <th className="pb-3 font-semibold">Age</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Risk</th>
                  <th className="pb-3 font-semibold">Last screen</th>
                  <th className="pb-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {CHILDREN.map((c) => (
                  <tr key={c.id} className="border-b border-mist/60 hover:bg-mist/30">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <ChildAvatar name={c.name} gender={c.gender} size={32} />
                        <span className="font-medium text-ink">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate">{formatAge(c.ageMonths)}</td>
                    <td className="py-3"><Badge status={c.developmentStatus} /></td>
                    <td className="py-3"><Badge status={c.riskLevel} /></td>
                    <td className="py-3 text-slate">{c.lastScreening || '—'}</td>
                    <td className="py-3 text-right">
                      <Link to={`/doctor/child/${c.id}`} className="text-leaf font-semibold text-xs hover:underline">
                        Open summary →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
