import { DIET_PLAN } from '../../data/mock'
import { useData } from '../../context/DataContext'
import { useActiveChild } from '../../context/ChildSelectionContext'
import { FadeIn } from '../../components/motion/FadeIn'
import { UtensilsCrossed } from 'lucide-react'

export function ParentDiet() {
  const { myChildren, children: allChildren } = useData()
  const { activeChild } = useActiveChild()
  const child = activeChild || myChildren[0] || allChildren[0]
  if (!child) return <p className="text-slate text-sm">No child data yet.</p>

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Diet chart</h1>
        <p className="text-sm text-slate mt-1">
          Age-appropriate daily plan for {child.name}
          {child.allergies.length > 0 && (
            <span className="text-coral font-medium"> · Avoid: {child.allergies.join(', ')}</span>
          )}
        </p>
      </FadeIn>

      <div className="space-y-3">
        {DIET_PLAN.map((meal, i) => (
          <FadeIn key={meal.meal} delay={i * 0.07}>
            <div className="glass-card rounded-2xl p-5 flex gap-4 items-start">
              <div className="w-11 h-11 rounded-xl bg-leaf/10 text-leaf flex items-center justify-center shrink-0">
                <UtensilsCrossed size={18} />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-semibold text-ink">{meal.meal}</h3>
                  <span className="text-xs font-mono text-slate">{meal.time}</span>
                </div>
                <p className="text-sm text-slate mt-1 leading-relaxed">{meal.items}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
