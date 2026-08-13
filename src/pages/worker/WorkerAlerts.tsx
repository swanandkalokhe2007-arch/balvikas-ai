import { formatAge } from '../../data/mock'
import { FadeIn } from '../../components/motion/FadeIn'
import { Badge } from '../../components/ui/Badge'
import { ShieldAlert } from 'lucide-react'
import { useData } from '../../context/DataContext'

export function WorkerAlerts() {
  const { children } = useData()
  const alerts = children.filter((c) => c.riskLevel !== 'low')

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <ShieldAlert size={22} className="text-danger" /> High-risk alerts
        </h1>
      </FadeIn>

      <div className="space-y-3">
        {alerts.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.05}>
            <div
              className={`rounded-2xl p-5 border ${
                c.riskLevel === 'high'
                  ? 'bg-danger/5 border-danger/20'
                  : 'glass-card border-warn/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-ink">{c.name}</h3>
                <Badge status={c.riskLevel} />
                <span className="text-xs text-slate">{formatAge(c.ageMonths)}</span>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">{c.summary}</p>
              <p className="text-xs text-slate mt-2">
                {c.village} · Parent {c.parentName} · Last screen {c.lastScreening || '—'}
              </p>
            </div>
          </FadeIn>
        ))}
        {!alerts.length && (
          <p className="text-sm text-slate text-center py-10">No elevated-risk children right now.</p>
        )}
      </div>
    </div>
  )
}
