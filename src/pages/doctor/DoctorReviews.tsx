import { useData } from '../../context/DataContext'

import { FadeIn } from '../../components/motion/FadeIn'
import { Badge } from '../../components/ui/Badge'
import { Link } from 'react-router-dom'
import { ClipboardList, Video } from 'lucide-react'

export function DoctorReviews() {
  const { children: CHILDREN, appointments: APPOINTMENTS, media: MEDIA_UPLOADS } = useData()
  const pendingAppts = APPOINTMENTS.filter((a) => a.status === 'pending')
  const media = MEDIA_UPLOADS.filter((m) => m.analysisStatus === 'complete')

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <ClipboardList size={22} className="text-warn" /> Pending reviews
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate mb-3">Media for co-sign</h2>
        <div className="space-y-3">
          {media.map((m) => {
            const child = CHILDREN.find((c) => c.id === m.childId)
            return (
              <div key={m.id} className="glass-card rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky/15 text-sky flex items-center justify-center">
                    <Video size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-ink">{child?.name}</p>
                      <Badge status="pending">review</Badge>
                    </div>
                    <p className="text-xs text-slate mb-2">{m.name}</p>
                    <p className="text-sm text-ink/80">{m.analysis}</p>
                    <Link
                      to={`/doctor/child/${m.childId}`}
                      className="inline-block mt-2 text-xs font-semibold text-leaf hover:underline"
                    >
                      Open child summary →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate mb-3">Pending appointments</h2>
        <div className="space-y-2">
          {pendingAppts.map((a) => (
            <div key={a.id} className="glass-card rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm text-ink">{a.childName}</p>
                <p className="text-xs text-slate">
                  {a.date} · {a.time} · {a.type}
                </p>
              </div>
              <Badge status="pending" />
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  )
}
