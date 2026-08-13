import { useData } from '../../context/DataContext'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  AlertTriangle,
  Ruler,
  Weight,
  Pill,
  HeartPulse,
  Syringe,
  Sparkles,
  Brain,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatAge } from '../../data/mock'
import { Badge } from '../../components/ui/Badge'
import { ChildAvatar } from '../../components/ui/ChildAvatar'
import { FadeIn } from '../../components/motion/FadeIn'

export function DoctorChildDetail() {
  const { children: CHILDREN, media: MEDIA_UPLOADS } = useData()
  const { id } = useParams()
  const child = CHILDREN.find((c) => c.id === id)

  if (!child) {
    return (
      <div className="text-center py-20">
        <p className="text-slate">Child not found.</p>
        <Link to="/doctor/patients" className="text-leaf font-semibold text-sm mt-2 inline-block">
          ← Back
        </Link>
      </div>
    )
  }

  const media = MEDIA_UPLOADS.filter((m) => m.childId === child.id)
  const growth = child.growthHistory.map((g) => ({ ...g, label: formatAge(g.ageMonths) }))

  return (
    <div className="space-y-6 max-w-5xl">
      <FadeIn>
        <Link to="/doctor/patients" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-forest mb-4">
          <ArrowLeft size={14} /> Caseload
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <ChildAvatar name={child.name} gender={child.gender} size={64} />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-3xl font-semibold text-ink">{child.name}</h1>
              <Badge status={child.riskLevel} />
              <Badge status={child.developmentStatus} />
            </div>
            <p className="text-sm text-slate mt-1">
              {formatAge(child.ageMonths)} · {child.gender} · DOB {child.dob} · {child.village}, {child.district}
            </p>
            <p className="text-sm text-slate">Parent: {child.parentName}</p>
          </div>
        </div>
      </FadeIn>

      {/* THE KEY FEATURE: Clinical summary in least words */}
      <FadeIn delay={0.08}>
        <div className="rounded-3xl bg-gradient-to-br from-ink to-forest p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-leaf/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">
                Clinical summary · least words
              </p>
            </div>
            <p className="font-display text-xl md:text-2xl font-medium leading-snug text-cream max-w-3xl">
              {child.summary}
            </p>
            <p className="text-xs text-foam/50 mt-4">
              Designed so new doctors never re-read the whole file while medicating.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Vitals strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: <Ruler size={18} />, l: 'Height', v: `${child.heightCm} cm`, c: '#5b9bd5' },
          { icon: <Weight size={18} />, l: 'Weight', v: `${child.weightKg} kg`, c: '#2d8a64' },
          {
            icon: <AlertTriangle size={18} />,
            l: 'Allergies',
            v: child.allergies.length ? child.allergies.join(', ') : 'None',
            c: '#e07a5f',
          },
          {
            icon: <HeartPulse size={18} />,
            l: 'Conditions',
            v: child.medicalConditions.length ? child.medicalConditions.join(', ') : 'None',
            c: '#9b8ec4',
          },
        ].map((item, i) => (
          <FadeIn key={item.l} delay={0.1 + i * 0.05}>
            <div className="glass-card rounded-2xl p-4 h-full">
              <div className="flex items-center gap-2 mb-2" style={{ color: item.c }}>
                {item.icon}
                <span className="text-[11px] font-bold uppercase tracking-wider">{item.l}</span>
              </div>
              <p className="font-semibold text-ink text-sm leading-snug">{item.v}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <FadeIn delay={0.2}>
          <div className="glass-card rounded-3xl p-6 h-full">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Syringe size={18} className="text-leaf" /> Vaccinations
            </h2>
            <div className="space-y-2">
              {child.vaccinations.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-2 border-b border-mist last:border-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{v.name}</p>
                    <p className="text-[11px] text-slate">
                      Due {v.dueDate}
                      {v.givenDate ? ` · Given ${v.givenDate}` : ''}
                    </p>
                  </div>
                  <Badge status={v.status} />
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="glass-card rounded-3xl p-6 h-full">
            <h2 className="font-display text-lg font-semibold mb-4">Screening history</h2>
            <div className="space-y-3">
              {child.screenings.map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-mist/50">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-ink">{s.type}</p>
                    <span className="font-display text-lg font-semibold text-forest">{s.score}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge status={s.result} />
                    <span className="text-[11px] text-slate">{s.date}</span>
                  </div>
                  <p className="text-xs text-slate leading-relaxed">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.3}>
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Growth trajectory</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8efe9" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#5a6b62' }} />
                <YAxis tick={{ fontSize: 12, fill: '#5a6b62' }} />
                <Tooltip />
                <Line type="monotone" dataKey="heightCm" name="Height" stroke="#2d8a64" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="weightKg" name="Weight" stroke="#e8b84a" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      {media.length > 0 && (
        <FadeIn delay={0.35}>
          <div className="glass-card rounded-3xl p-6">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain size={18} className="text-lavender" /> Parent media analysis
            </h2>
            {media.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-lavender/8 border border-lavender/20 mb-3 last:mb-0">
                <p className="text-sm font-semibold text-ink mb-1">{m.name}</p>
                <p className="text-sm text-ink/80 leading-relaxed">{m.analysis}</p>
                {m.findings && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {m.findings.map((f) => (
                      <span key={f} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-lavender border border-lavender/20">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.4}>
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
            <Pill size={18} className="text-coral" /> Medicating checklist
          </h2>
          <ul className="text-sm text-slate space-y-1.5">
            <li>• Confirm allergies: <strong className="text-ink">{child.allergies.join(', ') || 'None documented'}</strong></li>
            <li>• Active conditions: <strong className="text-ink">{child.medicalConditions.join(', ') || 'None'}</strong></li>
            <li>• Last weight for dosing: <strong className="text-ink">{child.weightKg} kg</strong> ({child.lastScreening})</li>
            <li>• Risk context: <strong className="text-ink capitalize">{child.riskLevel}</strong> — review summary above before Rx</li>
          </ul>
        </div>
      </FadeIn>
    </div>
  )
}
