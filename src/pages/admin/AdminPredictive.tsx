import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { FadeIn } from '../../components/motion/FadeIn'
import { TrendingUp } from 'lucide-react'

const FORECAST = [
  { month: 'Mar', actual: 210, predicted: 205 },
  { month: 'Apr', actual: 245, predicted: 240 },
  { month: 'May', actual: 268, predicted: 270 },
  { month: 'Jun', actual: 290, predicted: 295 },
  { month: 'Jul', actual: 312, predicted: 320 },
  { month: 'Aug', actual: null, predicted: 348 },
  { month: 'Sep', actual: null, predicted: 372 },
  { month: 'Oct', actual: null, predicted: 390 },
]

const INSIGHTS = [
  {
    title: 'Monsoon nutrition dip',
    body: 'Model expects +18% growth-faltering flags in Igatpuri & Trimbak through September. Pre-position IFA and counseling kits.',
  },
  {
    title: 'Vaccine catch-up load',
    body: 'MMR backlog in two blocks may peak mid-August. Add one mobile session day per week in Niphad.',
  },
  {
    title: 'Speech referral capacity',
    body: 'High-risk language cases trending up 12% QoQ. Recommend temporary SLP tele-clinic for Nashik rural.',
  },
]

export function AdminPredictive() {
  return (
    <div className="space-y-6 max-w-5xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <TrendingUp size={22} className="text-leaf" /> Predictive analysis
        </h1>
        <p className="text-sm text-slate mt-1">High-risk case volume forecast (next 90 days)</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="glass-card rounded-3xl p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FORECAST}>
                <defs>
                  <linearGradient id="pred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9b8ec4" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#9b8ec4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="act" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2d8a64" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2d8a64" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8efe9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5a6b62' }} />
                <YAxis tick={{ fontSize: 12, fill: '#5a6b62' }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Actual high-risk"
                  stroke="#2d8a64"
                  fill="url(#act)"
                  strokeWidth={2.5}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  name="Predicted"
                  stroke="#9b8ec4"
                  fill="url(#pred)"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-4">
        {INSIGHTS.map((ins, i) => (
          <FadeIn key={ins.title} delay={0.15 + i * 0.08}>
            <article className="glass-card rounded-2xl p-5 h-full">
              <h3 className="font-semibold text-ink mb-2">{ins.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{ins.body}</p>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
