import { Users, ClipboardCheck, AlertTriangle, MapPin } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { DISTRICT_STATS as FALLBACK_DISTRICTS } from '../../data/mock'
import { useData } from '../../context/DataContext'
import { StatCard } from '../../components/ui/StatCard'
import { FadeIn } from '../../components/motion/FadeIn'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const PIE = [
  { name: 'Normal', value: 68, color: '#2d8a64' },
  { name: 'Monitor', value: 22, color: '#e8b84a' },
  { name: 'High risk', value: 10, color: '#c44b4b' },
]

export function AdminHome() {
  const { user } = useAuth()
  const { districts: liveDistricts } = useData()
  const DISTRICT_STATS = liveDistricts.length ? liveDistricts : FALLBACK_DISTRICTS
  const totalReg = DISTRICT_STATS.reduce((s, d) => s + d.registered, 0)
  const totalScreen = DISTRICT_STATS.reduce((s, d) => s + d.screened, 0)
  const totalRisk = DISTRICT_STATS.reduce((s, d) => s + d.highRisk, 0)

  return (
    <div className="space-y-8 max-w-6xl">
      <FadeIn>
        <p className="text-sm text-slate mb-1">{user?.specialty || 'Health Department'}</p>
        <h1 className="font-display text-3xl font-semibold text-ink">District command center</h1>
        <p className="text-sm text-slate mt-1">Registered children, screening coverage & resource signals</p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total registered children" value={totalReg.toLocaleString()} icon={<Users size={20} />} accent="#9b8ec4" delay={0.05} />
        <StatCard label="Screenings completed" value={totalScreen.toLocaleString()} icon={<ClipboardCheck size={20} />} trend={`${Math.round((totalScreen / totalReg) * 100)}% coverage`} accent="#2d8a64" delay={0.1} />
        <StatCard label="High-risk cases" value={totalRisk.toLocaleString()} icon={<AlertTriangle size={20} />} accent="#c44b4b" delay={0.15} />
        <StatCard label="Districts monitored" value={DISTRICT_STATS.length} icon={<MapPin size={20} />} accent="#5b9bd5" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <FadeIn delay={0.15} className="lg:col-span-3">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">District-wise registered vs screened</h2>
              <Link to="/admin/districts" className="text-xs font-semibold text-leaf hover:underline">
                Details
              </Link>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DISTRICT_STATS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8efe9" />
                  <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#5a6b62' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#5a6b62' }} />
                  <Tooltip />
                  <Bar dataKey="registered" name="Registered" fill="#9b8ec4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="screened" name="Screened" fill="#2d8a64" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-6 h-full">
            <h2 className="font-display text-lg font-semibold mb-4">Risk distribution</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {PIE.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {PIE.map((p) => (
                <span key={p.name} className="text-xs font-medium flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  {p.name} {p.value}%
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Regions requiring more attention</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[...DISTRICT_STATS]
              .map((d) => ({
                ...d,
                gap: d.registered - d.screened,
                riskRate: d.highRisk / d.registered,
              }))
              .sort((a, b) => b.riskRate - a.riskRate)
              .slice(0, 3)
              .map((d) => (
                <div key={d.district} className="p-4 rounded-2xl bg-danger/5 border border-danger/15">
                  <p className="font-semibold text-ink">{d.district}</p>
                  <p className="text-xs text-slate mt-1">
                    {d.highRisk} high-risk · {d.gap.toLocaleString()} unscreened
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-mist overflow-hidden">
                    <div
                      className="h-full rounded-full bg-danger"
                      style={{ width: `${Math.round(d.riskRate * 1000) / 2}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <Link to="/admin/map" className="inline-block mt-4 text-xs font-semibold text-leaf hover:underline">
            Open attention map →
          </Link>
        </div>
      </FadeIn>
    </div>
  )
}
