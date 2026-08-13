import { formatAge } from '../../data/mock'
import { Badge } from '../../components/ui/Badge'
import { ChildAvatar } from '../../components/ui/ChildAvatar'
import { FadeIn } from '../../components/motion/FadeIn'
import { useData } from '../../context/DataContext'

export function WorkerChildren({ mode }: { mode: 'all' | 'screening' }) {
  const { children, loading } = useData()
  const list =
    mode === 'screening'
      ? children.filter(
          (c) => !c.lastScreening || c.lastScreening < '2026-07-01' || c.riskLevel === 'high',
        )
      : children

  return (
    <div className="space-y-6 max-w-4xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {mode === 'screening' ? 'Pending screening' : 'Children in the village'}
        </h1>
        <p className="text-sm text-slate mt-1">
          {loading ? 'Loading…' : `${list.length} children · live registry`}
        </p>
      </FadeIn>

      <div className="space-y-3">
        {list.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.03}>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
              <ChildAvatar name={c.name} gender={c.gender} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-ink">{c.name}</p>
                  <Badge status={c.riskLevel} />
                  <Badge status={c.developmentStatus} />
                </div>
                <p className="text-xs text-slate mt-0.5">
                  {formatAge(c.ageMonths)} · {c.village} · Parent: {c.parentName}
                </p>
                <p className="text-xs text-slate">
                  Last screen: {c.lastScreening || 'Never'} · Ht {c.heightCm}cm · Wt {c.weightKg}kg
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
        {!loading && !list.length && (
          <p className="text-sm text-slate text-center py-10">No children yet — register one.</p>
        )}
      </div>
    </div>
  )
}
