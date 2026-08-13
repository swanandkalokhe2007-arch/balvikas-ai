import { Link } from 'react-router-dom'

export function Logo({
  dark = false,
  size = 'md',
  to = '/',
}: {
  dark?: boolean
  size?: 'sm' | 'md' | 'lg'
  to?: string
}) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const s = sizes[size]
  const text = dark ? 'text-white' : 'text-forest'
  const sub = dark ? 'text-mint/80' : 'text-slate'

  return (
    <Link to={to} className="inline-flex items-center gap-2.5 no-underline group">
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className="shrink-0 transition-transform group-hover:scale-105">
        <rect width="64" height="64" rx="16" fill={dark ? '#145c43' : '#0B3D2E'} />
        <circle cx="32" cy="28" r="12" fill="#F4C95F" />
        <path d="M18 48c2-8 8-12 14-12s12 4 14 12" stroke="#7EC8A3" strokeWidth="4" strokeLinecap="round" />
        <circle cx="28" cy="26" r="1.8" fill="#0B3D2E" />
        <circle cx="36" cy="26" r="1.8" fill="#0B3D2E" />
        <path d="M28 32c1.5 2 6.5 2 8 0" stroke="#0B3D2E" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div className="leading-tight">
        <div className={`font-display font-semibold tracking-tight ${text} ${size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
          BalVikas<span className="text-gold"> AI</span>
        </div>
        {size !== 'sm' && (
          <div className={`text-[10px] uppercase tracking-[0.14em] font-medium ${sub}`}>
            Childhood Screening
          </div>
        )}
      </div>
    </Link>
  )
}
