import { useData } from '../../context/DataContext'

import { FadeIn } from '../../components/motion/FadeIn'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'

const RECS = [
  {
    childId: 'c2',
    title: 'Expedite speech-language referral',
    body: 'ASQ speech domain below cutoff + parent video shows gesture-dominant communication. Book SLP within 14 days; start home language routines now.',
    priority: 'high' as const,
  },
  {
    childId: 'c5',
    title: 'Audiology before further language work',
    body: 'Recurrent otitis + language delay pattern. Rule out conductive loss. Coordinate ENT + hearing screen this week.',
    priority: 'high' as const,
  },
  {
    childId: 'c3',
    title: 'Review inhaler technique',
    body: 'Wheeze history stable but seasonal risk rising. Demo spacer use at next visit; dust-mite allergy counselling for parents.',
    priority: 'medium' as const,
  },
  {
    childId: 'c1',
    title: 'Maintain routine surveillance',
    body: 'All domains normal. Reinforce peanut-avoidance education. Next developmental screen in 6 months.',
    priority: 'low' as const,
  },
]

export function DoctorAI() {
  const { children: CHILDREN } = useData()
  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <Sparkles size={22} className="text-gold" /> AI recommendations
        </h1>
        <p className="text-sm text-slate mt-1">Prioritized clinical actions from screening + media signals</p>
      </FadeIn>

      <div className="space-y-4">
        {RECS.map((r, i) => {
          const child = CHILDREN.find((c) => c.id === r.childId)
          return (
            <FadeIn key={r.childId + r.title} delay={i * 0.08}>
              <div className="glass-card rounded-3xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs font-semibold text-slate">{child?.name}</p>
                    <h3 className="font-display text-lg font-semibold text-ink">{r.title}</h3>
                  </div>
                  <Badge status={r.priority}>{r.priority}</Badge>
                </div>
                <p className="text-sm text-slate leading-relaxed mb-3">{r.body}</p>
                <Link
                  to={`/doctor/child/${r.childId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-leaf hover:underline"
                >
                  Open clinical summary <ArrowRight size={12} />
                </Link>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}
