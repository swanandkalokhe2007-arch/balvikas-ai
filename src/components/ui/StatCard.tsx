import type { ReactNode } from 'react'
import { FadeIn } from '../motion/FadeIn'

interface Props {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: string
  accent?: string
  delay?: number
  onClick?: () => void
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  accent = '#2d8a64',
  delay = 0,
  onClick,
}: Props) {
  return (
    <FadeIn delay={delay}>
      <button
        type="button"
        onClick={onClick}
        className="stat-card w-full text-left p-5 rounded-2xl bg-white border border-forest/8 relative overflow-hidden group"
        style={{
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: '0 10px 28px -18px rgba(12,26,20,0.16)',
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full opacity-90 transition-all duration-300 group-hover:w-1"
          style={{ background: accent }}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3 pl-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate mb-2">
              {label}
            </p>
            <p className="text-3xl font-display font-semibold text-ink tabular-nums tracking-tight">
              {value}
            </p>
            {trend && (
              <p className="text-xs mt-2 font-medium leading-snug" style={{ color: accent }}>
                {trend}
              </p>
            )}
          </div>
          {icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-black/[0.04]"
              style={{ background: `${accent}14`, color: accent }}
            >
              {icon}
            </div>
          )}
        </div>
      </button>
    </FadeIn>
  )
}
