import { useData } from '../../context/DataContext'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

import { FadeIn } from '../../components/motion/FadeIn'

export function DoctorGrowth() {
  const { children: CHILDREN } = useData()
  const data = CHILDREN.map((c) => ({
    name: c.name.split(' ')[0],
    height: c.heightCm,
    weight: c.weightKg,
    risk: c.riskLevel,
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Growth analytics</h1>
        <p className="text-sm text-slate mt-1">Caseload height & weight comparison</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="glass-card rounded-3xl p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8efe9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5a6b62' }} />
                <YAxis tick={{ fontSize: 12, fill: '#5a6b62' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="height" name="Height (cm)" fill="#2d8a64" radius={[6, 6, 0, 0]} />
                <Bar dataKey="weight" name="Weight (kg)" fill="#e8b84a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
