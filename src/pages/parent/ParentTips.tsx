import { PARENT_TIPS } from '../../data/mock'
import { FadeIn } from '../../components/motion/FadeIn'
import { Lightbulb } from 'lucide-react'

const tagColor: Record<string, string> = {
  Language: '#5b9bd5',
  Social: '#9b8ec4',
  Feeding: '#2d8a64',
  Sleep: '#d4920a',
}

export function ParentTips() {
  return (
    <div className="space-y-6 max-w-4xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Parent-friendly tips</h1>
        <p className="text-sm text-slate mt-1">Small habits with outsized impact on development</p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 gap-4">
        {PARENT_TIPS.map((tip, i) => (
          <FadeIn key={tip.title} delay={i * 0.08}>
            <article className="glass-card rounded-3xl p-6 h-full">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${tagColor[tip.tag] || '#2d8a64'}18`, color: tagColor[tip.tag] }}
                >
                  <Lightbulb size={16} />
                </div>
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: `${tagColor[tip.tag]}18`, color: tagColor[tip.tag] }}
                >
                  {tip.tag}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-ink mb-2">{tip.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{tip.body}</p>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
