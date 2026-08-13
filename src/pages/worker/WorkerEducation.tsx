import { PARENT_TIPS } from '../../data/mock'
import { FadeIn } from '../../components/motion/FadeIn'
import { GraduationCap } from 'lucide-react'

const SESSIONS = [
  { title: 'Complementary feeding after 6 months', when: 'Weekly · Mondays', attendees: 12 },
  { title: 'Recognizing developmental red flags', when: 'Fortnightly', attendees: 8 },
  { title: 'Handwashing & diarrhea prevention', when: 'Monthly camp', attendees: 24 },
  { title: 'Importance of full immunization', when: 'Before Vax day', attendees: 18 },
]

export function WorkerEducation() {
  return (
    <div className="space-y-8 max-w-4xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <GraduationCap size={22} className="text-gold" /> Parent education
        </h1>
        <p className="text-sm text-slate mt-1">Session plans & talking points for community meetings</p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 gap-4">
        {SESSIONS.map((s, i) => (
          <FadeIn key={s.title} delay={i * 0.06}>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-ink mb-1">{s.title}</h3>
              <p className="text-xs text-slate">
                {s.when} · ~{s.attendees} parents
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Talking points</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {PARENT_TIPS.map((t, i) => (
            <FadeIn key={t.title} delay={0.2 + i * 0.05}>
              <div className="rounded-2xl p-4 bg-sand/80 border border-gold/20">
                <p className="text-[11px] font-bold uppercase tracking-wider text-warn mb-1">{t.tag}</p>
                <p className="font-semibold text-sm text-ink">{t.title}</p>
                <p className="text-xs text-slate mt-1 leading-relaxed">{t.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  )
}
