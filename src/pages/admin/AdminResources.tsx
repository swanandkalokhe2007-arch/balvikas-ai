import { FadeIn } from '../../components/motion/FadeIn'
import { Boxes, Users, Stethoscope, Truck } from 'lucide-react'

const RESOURCES = [
  {
    icon: <Stethoscope size={20} />,
    title: 'Pediatric slots',
    need: 'Critical',
    detail: 'Add 6 tele-consult hours/week for Niphad & Igatpuri high-risk queue.',
    color: '#c44b4b',
  },
  {
    icon: <Users size={20} />,
    title: 'Anganwadi capacity',
    need: 'Moderate',
    detail: 'Two Sevika vacancies in Trimbak block delaying home-visit cadence.',
    color: '#d4920a',
  },
  {
    icon: <Truck size={20} />,
    title: 'Mobile screening van',
    need: 'Plan Q3',
    detail: 'Route optimization suggests biweekly Sinnar–Niphad loop covers 840 children.',
    color: '#5b9bd5',
  },
  {
    icon: <Boxes size={20} />,
    title: 'Growth kit stock',
    need: 'OK',
    detail: 'MUAC tapes and scales sufficient through October at current burn rate.',
    color: '#2d8a64',
  },
]

const BUDGET = [
  { item: 'SLP tele-clinic pilot', est: '₹4.2L', impact: 'Language backlog −30%' },
  { item: 'Sevika hiring (2)', est: '₹6.8L/yr', impact: 'Visit compliance +22%' },
  { item: 'Parent education kits', est: '₹1.1L', impact: 'Session reach ×1.5' },
  { item: 'Hearing screen devices', est: '₹3.5L', impact: 'ENT wait −3 weeks' },
]

export function AdminResources() {
  return (
    <div className="space-y-8 max-w-4xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Resource planning</h1>
        <p className="text-sm text-slate mt-1">Allocate people, kits, and budget where risk is rising</p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 gap-4">
        {RESOURCES.map((r, i) => (
          <FadeIn key={r.title} delay={i * 0.07}>
            <div className="glass-card rounded-3xl p-5 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${r.color}18`, color: r.color }}
                >
                  {r.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{r.title}</h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: r.color }}>
                    {r.need}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate leading-relaxed">{r.detail}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.25}>
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Investment options</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate border-b border-mist">
                  <th className="pb-3 font-semibold">Initiative</th>
                  <th className="pb-3 font-semibold">Estimate</th>
                  <th className="pb-3 font-semibold">Expected impact</th>
                </tr>
              </thead>
              <tbody>
                {BUDGET.map((b) => (
                  <tr key={b.item} className="border-b border-mist/60">
                    <td className="py-3 font-medium text-ink">{b.item}</td>
                    <td className="py-3 tabular-nums text-forest font-semibold">{b.est}</td>
                    <td className="py-3 text-slate">{b.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
