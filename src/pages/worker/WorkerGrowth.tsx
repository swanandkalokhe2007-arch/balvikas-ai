import { formatAge } from '../../data/mock'
import { FadeIn } from '../../components/motion/FadeIn'
import { ChildAvatar } from '../../components/ui/ChildAvatar'
import { useData } from '../../context/DataContext'

export function WorkerGrowth() {
  const { children } = useData()

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Growth monitoring</h1>
        <p className="text-sm text-slate mt-1">Latest anthropometry · live registry</p>
      </FadeIn>

      <div className="space-y-3">
        {children.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.03}>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
              <ChildAvatar name={c.name} gender={c.gender} size={40} />
              <div className="flex-1">
                <p className="font-semibold text-ink">{c.name}</p>
                <p className="text-xs text-slate">
                  {formatAge(c.ageMonths)} · {c.village}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-leaf">{c.heightCm} cm</p>
                <p className="font-semibold text-gold">{c.weightKg} kg</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
