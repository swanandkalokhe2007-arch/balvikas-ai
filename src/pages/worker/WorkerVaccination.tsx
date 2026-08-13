import { Badge } from '../../components/ui/Badge'
import { FadeIn } from '../../components/motion/FadeIn'
import { useData } from '../../context/DataContext'

export function WorkerVaccination() {
  const { children } = useData()
  const rows = children.flatMap((c) =>
    c.vaccinations
      .filter((v) => v.status !== 'completed')
      .map((v) => ({ ...v, childName: c.name, village: c.village })),
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Vaccination tracking</h1>
        <p className="text-sm text-slate mt-1">Due & overdue immunizations · live</p>
      </FadeIn>

      <div className="space-y-3">
        {rows.map((r, i) => (
          <FadeIn key={r.id + r.childName} delay={i * 0.03}>
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{r.childName}</p>
                <p className="text-sm text-slate">
                  {r.name} · {r.village} · Due {r.dueDate}
                </p>
              </div>
              <Badge status={r.status} />
            </div>
          </FadeIn>
        ))}
        {!rows.length && (
          <p className="text-sm text-slate text-center py-10">All tracked vaccines completed.</p>
        )}
      </div>
    </div>
  )
}
