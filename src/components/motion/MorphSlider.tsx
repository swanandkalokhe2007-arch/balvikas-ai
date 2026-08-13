import { useRef, useState, useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
}

interface Props {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function MorphSlider({ tabs, active, onChange, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const el = tabRefs.current.get(active)
    const container = containerRef.current
    if (el && container) {
      const cRect = container.getBoundingClientRect()
      const tRect = el.getBoundingClientRect()
      setIndicator({
        left: tRect.left - cRect.left,
        width: tRect.width,
      })
    }
  }, [active, tabs])

  return (
    <div ref={containerRef} className={`morph-track ${className}`}>
      <motion.div
        className="morph-indicator"
        animate={{ left: indicator.left, width: indicator.width }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) tabRefs.current.set(tab.id, el)
          }}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`relative z-10 flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full transition-colors duration-200 ${
            active === tab.id ? 'text-forest' : 'text-slate hover:text-ink'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
