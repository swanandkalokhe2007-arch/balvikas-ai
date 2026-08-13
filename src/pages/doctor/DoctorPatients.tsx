import { useData } from '../../context/DataContext'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { formatAge } from '../../data/mock'
import { Badge } from '../../components/ui/Badge'
import { ChildAvatar } from '../../components/ui/ChildAvatar'
import { FadeIn } from '../../components/motion/FadeIn'

export function DoctorPatients({ filter }: { filter: 'all' | 'high' }) {
  const { children } = useData()
  const [q, setQ] = useState('')
  const list = children.filter((c) => {
    if (filter === 'high' && c.riskLevel !== 'high') return false
    if (
      q &&
      !c.name.toLowerCase().includes(q.toLowerCase()) &&
      !c.village.toLowerCase().includes(q.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="space-y-6 max-w-5xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {filter === 'high' ? 'High-risk children' : 'Children examined'}
        </h1>
        <p className="text-sm text-slate mt-1">{list.length} records · live</p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or village…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-mist bg-white text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30"
          />
        </div>
      </FadeIn>

      <div className="grid sm:grid-cols-2 gap-4">
        {list.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.04}>
            <Link
              to={`/doctor/child/${c.id}`}
              className="block glass-card rounded-3xl p-5 hover:shadow-lg transition-shadow h-full"
            >
              <div className="flex items-start gap-3 mb-3">
                <ChildAvatar name={c.name} gender={c.gender} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-ink">{c.name}</h3>
                    <Badge status={c.riskLevel} />
                  </div>
                  <p className="text-xs text-slate mt-0.5">
                    {formatAge(c.ageMonths)} · {c.village} · {c.parentName}
                  </p>
                </div>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed line-clamp-3 bg-mist/40 rounded-xl p-3 font-medium">
                {c.summary}
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Badge status={c.developmentStatus} />
                {c.allergies.map((a) => (
                  <span
                    key={a}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-coral/10 text-coral"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
