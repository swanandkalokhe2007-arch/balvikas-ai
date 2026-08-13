import { useData } from '../../context/DataContext'

import { Badge } from '../../components/ui/Badge'
import { FadeIn } from '../../components/motion/FadeIn'
import { Link } from 'react-router-dom'

export function DoctorScreening() {
  const { children: CHILDREN } = useData()
  const rows = CHILDREN.flatMap((c) =>
    c.screenings.map((s) => ({ ...s, childId: c.id, childName: c.name })),
  ).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6 max-w-4xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Screening history</h1>
        <p className="text-sm text-slate mt-1">All ASQ / growth assessments across caseload</p>
      </FadeIn>

      <div className="space-y-3">
        {rows.map((s, i) => (
          <FadeIn key={`${s.childId}-${s.id}`} delay={i * 0.04}>
            <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Link to={`/doctor/child/${s.childId}`} className="font-semibold text-ink hover:text-leaf">
                    {s.childName}
                  </Link>
                  <Badge status={s.result} />
                </div>
                <p className="text-xs text-slate">
                  {s.date} · {s.type} · {s.conductedBy}
                </p>
                <p className="text-sm text-ink/80 mt-1">{s.notes}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-semibold text-forest">{s.score}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
