import { DISTRICT_STATS as FALLBACK } from '../../data/mock'
import { useData } from '../../context/DataContext'
import { FadeIn } from '../../components/motion/FadeIn'

export function AdminDistricts() {
  const { districts } = useData()
  const DISTRICT_STATS = districts.length ? districts : FALLBACK
  return (
    <div className="space-y-6 max-w-5xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">District-wise statistics</h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate bg-mist/50">
                  <th className="px-5 py-3 font-semibold">District</th>
                  <th className="px-5 py-3 font-semibold">Registered</th>
                  <th className="px-5 py-3 font-semibold">Screened</th>
                  <th className="px-5 py-3 font-semibold">Coverage</th>
                  <th className="px-5 py-3 font-semibold">High risk</th>
                  <th className="px-5 py-3 font-semibold">Risk rate</th>
                </tr>
              </thead>
              <tbody>
                {DISTRICT_STATS.map((d) => {
                  const cov = Math.round((d.screened / d.registered) * 100)
                  const rate = ((d.highRisk / d.registered) * 100).toFixed(1)
                  return (
                    <tr key={d.district} className="border-t border-mist hover:bg-mist/30">
                      <td className="px-5 py-3.5 font-semibold text-ink">{d.district}</td>
                      <td className="px-5 py-3.5 tabular-nums">{d.registered.toLocaleString()}</td>
                      <td className="px-5 py-3.5 tabular-nums">{d.screened.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-mist overflow-hidden">
                            <div className="h-full bg-leaf rounded-full" style={{ width: `${cov}%` }} />
                          </div>
                          <span className="tabular-nums text-xs font-medium">{cov}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 tabular-nums text-danger font-medium">{d.highRisk}</td>
                      <td className="px-5 py-3.5 tabular-nums text-slate">{rate}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
