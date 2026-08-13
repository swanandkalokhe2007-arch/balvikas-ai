import { ChevronDown } from 'lucide-react'
import { useActiveChild } from '../../context/ChildSelectionContext'

/** Compact selector when a parent has multiple children */
export function ChildSwitcher() {
  const { activeChild, children, setActiveChildId } = useActiveChild()
  if (!children.length || children.length < 2) return null

  return (
    <label className="hidden sm:flex items-center gap-2 text-sm mr-1">
      <span className="text-[10px] uppercase tracking-wider text-slate font-semibold">Child</span>
      <div className="relative">
        <select
          value={activeChild?.id || ''}
          onChange={(e) => setActiveChildId(e.target.value)}
          className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-forest/15 bg-white text-ink text-sm font-medium focus:outline-none focus:ring-2 focus:ring-leaf/30 cursor-pointer max-w-[160px]"
        >
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate pointer-events-none"
        />
      </div>
    </label>
  )
}
