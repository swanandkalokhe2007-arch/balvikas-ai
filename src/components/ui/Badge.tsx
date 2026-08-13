const styles: Record<string, string> = {
  low: 'bg-ok/10 text-ok',
  medium: 'bg-warn/10 text-warn',
  high: 'bg-danger/10 text-danger',
  normal: 'bg-ok/10 text-ok',
  slow: 'bg-warn/10 text-warn',
  delayed: 'bg-danger/10 text-danger',
  advanced: 'bg-sky/10 text-sky',
  completed: 'bg-ok/10 text-ok',
  due: 'bg-warn/10 text-warn',
  overdue: 'bg-danger/10 text-danger',
  upcoming: 'bg-sky/10 text-sky',
  scheduled: 'bg-sky/10 text-sky',
  pending: 'bg-lavender/15 text-lavender',
  cancelled: 'bg-slate/10 text-slate',
  refer: 'bg-danger/10 text-danger',
  monitor: 'bg-warn/10 text-warn',
  analyzing: 'bg-gold/15 text-warn',
  complete: 'bg-ok/10 text-ok',
}

export function Badge({
  status,
  children,
  className = '',
}: {
  status: string
  children?: React.ReactNode
  className?: string
}) {
  const s = styles[status.toLowerCase()] || 'bg-mist text-slate'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${s} ${className}`}
    >
      {children ?? status}
    </span>
  )
}
