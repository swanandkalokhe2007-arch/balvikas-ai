import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { FadeIn } from '../../components/motion/FadeIn'

const TREND = [
  { m: 'Jan', screens: 980, referrals: 62 },
  { m: 'Feb', screens: 1120, referrals: 71 },
  { m: 'Mar', screens: 1240, referrals: 68 },
  { m: 'Apr', screens: 1180, referrals: 80 },
  { m: 'May', screens: 1350, referrals: 92 },
  { m: 'Jun', screens: 1420, referrals: 88 },
  { m: 'Jul', screens: 1510, referrals: 95 },
]

const RADAR = [
  { domain: 'Motor', score: 82 },
  { domain: 'Language', score: 68 },
  { domain: 'Social', score: 74 },
  { domain: 'Cognitive', score: 79 },
  { domain: 'Adaptive', score: 76 },
]

export function AdminAnalytics() {
  return (
    <div className="space-y-6 max-w-5xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Analytics charts</h1>
        <p className="text-sm text-slate mt-1">Program performance across screening domains</p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Monthly screens & referrals</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8efe9" />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: '#5a6b62' }} />
                <YAxis tick={{ fontSize: 12, fill: '#5a6b62' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="screens" name="Screens" stroke="#2d8a64" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="referrals" name="Referrals" stroke="#e07a5f" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Domain health (region avg)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR}>
                <PolarGrid stroke="#e8efe9" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#5a6b62', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#9b8ec4" fill="#9b8ec4" fillOpacity={0.35} strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
