import { useState } from 'react'
import { FadeIn } from '../../components/motion/FadeIn'
import { Moon, Sun, Coffee, Clock } from 'lucide-react'

const MEALS = [
  { id: 'b', label: 'Breakfast', time: '08:00', done: true },
  { id: 'm', label: 'Mid-morning', time: '10:30', done: true },
  { id: 'l', label: 'Lunch', time: '13:00', done: false },
  { id: 's', label: 'Snack', time: '16:00', done: false },
  { id: 'd', label: 'Dinner', time: '19:30', done: false },
]

export function ParentSleep() {
  const [meals, setMeals] = useState(MEALS)
  const [bedtime, setBedtime] = useState('20:30')
  const [wake, setWake] = useState('07:00')
  const [nap, setNap] = useState('13:30')

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Sleep & meal reminders</h1>
        <p className="text-sm text-slate mt-1">Gentle anchors for daily rhythm</p>
      </FadeIn>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: <Moon size={18} />, label: 'Bedtime', value: bedtime, set: setBedtime, c: '#9b8ec4' },
          { icon: <Sun size={18} />, label: 'Wake', value: wake, set: setWake, c: '#e8b84a' },
          { icon: <Coffee size={18} />, label: 'Nap', value: nap, set: setNap, c: '#5b9bd5' },
        ].map((item, i) => (
          <FadeIn key={item.label} delay={i * 0.08}>
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2" style={{ color: item.c }}>
                {item.icon}
                <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
              </div>
              <input
                type="time"
                value={item.value}
                onChange={(e) => item.set(e.target.value)}
                className="font-display text-2xl font-semibold text-ink bg-transparent border-none focus:outline-none w-full"
              />
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <Clock size={18} className="text-leaf" /> Today&apos;s meals
          </h2>
          <div className="space-y-2">
            {meals.map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  m.done ? 'bg-ok/8' : 'bg-mist/50 hover:bg-mist'
                }`}
              >
                <input
                  type="checkbox"
                  checked={m.done}
                  onChange={() =>
                    setMeals((prev) => prev.map((x) => (x.id === m.id ? { ...x, done: !x.done } : x)))
                  }
                  className="w-4 h-4 accent-leaf"
                />
                <span className={`flex-1 text-sm font-medium ${m.done ? 'text-slate line-through' : 'text-ink'}`}>
                  {m.label}
                </span>
                <span className="text-xs font-mono text-slate">{m.time}</span>
              </label>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
