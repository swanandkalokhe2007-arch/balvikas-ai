import { Badge } from '../../components/ui/Badge'
import { FadeIn } from '../../components/motion/FadeIn'
import { MapPin, Check } from 'lucide-react'
import { useData } from '../../context/DataContext'

export function WorkerVisits() {
  const { visits, updateVisit } = useData()

  const complete = async (id: string) => {
    await updateVisit(id, { status: 'completed' })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Home visits due</h1>
        <p className="text-sm text-slate mt-1">Live field schedule — mark done to update the server</p>
      </FadeIn>

      <div className="space-y-3">
        {visits.map((v, i) => (
          <FadeIn key={v.id} delay={i * 0.04}>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink">{v.childName}</h3>
                    <Badge status={v.status} />
                  </div>
                  <p className="text-sm text-slate flex items-center gap-1">
                    <MapPin size={12} /> {v.village} · Due {v.dueDate}
                  </p>
                  <p className="text-sm text-ink mt-2">{v.purpose}</p>
                </div>
                {v.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => void complete(v.id)}
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-ok/10 text-ok hover:bg-ok/20"
                  >
                    <Check size={14} /> Mark done
                  </button>
                )}
              </div>
            </div>
          </FadeIn>
        ))}
        {!visits.length && (
          <p className="text-sm text-slate text-center py-10">No visits scheduled.</p>
        )}
      </div>
    </div>
  )
}
