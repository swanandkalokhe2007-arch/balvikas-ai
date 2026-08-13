import { useData } from '../../context/DataContext'
import { useActiveChild } from '../../context/ChildSelectionContext'
import { Badge } from '../../components/ui/Badge'
import { FadeIn } from '../../components/motion/FadeIn'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export function ParentVaccination() {
  const { myChildren, children: allChildren } = useData()
  const { activeChild } = useActiveChild()
  const child = activeChild || myChildren[0] || allChildren[0]
  if (!child) return <p className="text-slate text-sm">No child data yet.</p>

  const icon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 size={18} className="text-ok" />
    if (status === 'overdue') return <AlertCircle size={18} className="text-danger" />
    return <Clock size={18} className="text-warn" />
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Vaccination schedule</h1>
        <p className="text-sm text-slate mt-1">National immunization schedule for {child.name}</p>
      </FadeIn>

      <div className="space-y-3">
        {child.vaccinations.map((v, i) => (
          <FadeIn key={v.id} delay={i * 0.05}>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center shrink-0">
                {icon(v.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-ink">{v.name}</p>
                  <Badge status={v.status} />
                </div>
                <p className="text-xs text-slate mt-0.5">
                  Due {v.dueDate}
                  {v.givenDate ? ` · Given ${v.givenDate}` : ''}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
