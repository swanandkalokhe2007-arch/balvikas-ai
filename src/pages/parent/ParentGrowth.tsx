import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatAge } from '../../data/mock'
import { useData } from '../../context/DataContext'
import { useActiveChild } from '../../context/ChildSelectionContext'
import { FadeIn } from '../../components/motion/FadeIn'
import { ChildAvatar } from '../../components/ui/ChildAvatar'

export function ParentGrowth() {
  const { myChildren, children: allChildren } = useData()
  const { activeChild } = useActiveChild()
  const child = activeChild || myChildren[0] || allChildren[0]
  if (!child) return <p className="text-slate text-sm">No child data yet.</p>
  const data = child.growthHistory.map((g) => ({
    ...g,
    label: formatAge(g.ageMonths),
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <FadeIn>
        <div className="flex items-center gap-4 mb-2">
          <ChildAvatar name={child.name} gender={child.gender} size={48} />
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Growth chart</h1>
            <p className="text-sm text-slate">Height & weight trajectory for {child.name}</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="glass-card rounded-3xl p-6">
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8efe9" />
                <XAxis dataKey="label" tick={{ fill: '#5a6b62', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="h" tick={{ fill: '#5a6b62', fontSize: 12 }} axisLine={false} tickLine={false} unit="cm" />
                <YAxis yAxisId="w" orientation="right" tick={{ fill: '#5a6b62', fontSize: 12 }} axisLine={false} tickLine={false} unit="kg" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e8efe9',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="h"
                  type="monotone"
                  dataKey="heightCm"
                  name="Height (cm)"
                  stroke="#2d8a64"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2d8a64' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  yAxisId="w"
                  type="monotone"
                  dataKey="weightKg"
                  name="Weight (kg)"
                  stroke="#e8b84a"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#e8b84a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      <div className="grid sm:grid-cols-3 gap-4">
        {data
          .slice()
          .reverse()
          .map((g, i) => (
            <FadeIn key={g.date} delay={0.15 + i * 0.05}>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs text-slate font-medium">{g.date}</p>
                <p className="font-display text-lg font-semibold text-ink mt-1">{g.label}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-leaf font-semibold">{g.heightCm} cm</span>
                  <span className="text-gold font-semibold">{g.weightKg} kg</span>
                </div>
              </div>
            </FadeIn>
          ))}
      </div>
    </div>
  )
}
