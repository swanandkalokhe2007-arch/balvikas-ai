import { useData } from '../../context/DataContext'
import { Link } from 'react-router-dom'

import { Badge } from '../../components/ui/Badge'
import { ChildAvatar } from '../../components/ui/ChildAvatar'
import { FadeIn } from '../../components/motion/FadeIn'
import { Calendar } from 'lucide-react'

export function DoctorAppointments() {
  const { children: CHILDREN, appointments: APPOINTMENTS } = useData()
  const sorted = [...APPOINTMENTS].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <Calendar size={22} className="text-leaf" /> Appointments
        </h1>
        <p className="text-sm text-slate mt-1">Scheduled visits and pending bookings</p>
      </FadeIn>

      <div className="space-y-3">
        {sorted.map((a, i) => {
          const child = CHILDREN.find((c) => c.id === a.childId)
          return (
            <FadeIn key={a.id} delay={i * 0.05}>
              <Link
                to={`/doctor/child/${a.childId}`}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow block"
              >
                <div className="text-center shrink-0 w-16">
                  <p className="text-[10px] uppercase tracking-wider text-slate font-semibold">
                    {a.date.slice(5)}
                  </p>
                  <p className="font-mono font-bold text-forest text-sm">{a.time}</p>
                </div>
                <ChildAvatar name={a.childName} gender={child?.gender} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink">{a.childName}</p>
                  <p className="text-xs text-slate">{a.type}</p>
                </div>
                <Badge status={a.status} />
              </Link>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}
