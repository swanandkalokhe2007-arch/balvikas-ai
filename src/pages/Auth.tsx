import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Baby, Eye, EyeOff, Lock, Mail, Shield, Stethoscope, Users } from 'lucide-react'
import { Logo } from '../components/ui/Logo'
import { SpecularButton } from '../components/motion/SpecularButton'
import { useAuth } from '../context/AuthContext'
import { ROLE_META } from '../data/mock'
import type { Role } from '../types'

const ICONS: Record<Role, React.ReactNode> = {
  parent: <Baby size={18} />,
  doctor: <Stethoscope size={18} />,
  worker: <Users size={18} />,
  admin: <Shield size={18} />,
}

const DEMO_EMAIL: Record<Role, string> = {
  parent: 'parent@demo.com',
  doctor: 'doctor@demo.com',
  worker: 'worker@demo.com',
  admin: 'admin@demo.com',
}

export function Auth() {
  const navigate = useNavigate()
  const { login, loginAs, signup } = useAuth()
  const [role, setRole] = useState<Role>('parent')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('parent@demo.com')
  const [password, setPassword] = useState('demo1234')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const go = (u: { role: string }) => navigate(`/${u.role}`, { replace: true })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') {
        const u = await login(email, password)
        if (!u) {
          setError('Login failed. Use parent@demo.com / demo1234')
          return
        }
        go(u)
      } else {
        if (!name.trim()) {
          setError('Enter your name')
          return
        }
        const u = await signup(name, email, password, role)
        if (!u) {
          setError('Signup failed')
          return
        }
        go(u)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const demo = async (r: Role) => {
    setBusy(true)
    setError('')
    setRole(r)
    setEmail(DEMO_EMAIL[r])
    try {
      const u = await loginAs(r)
      if (u) go(u)
      else setError('Demo login failed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      <div className="lg:w-[42%] bg-forest text-white p-8 md:p-12 flex flex-col justify-between">
        <Logo dark />
        <div className="py-10">
          <h1 className="font-display text-4xl font-semibold leading-tight">BalVikas AI</h1>
          <p className="mt-4 text-foam/80 max-w-sm text-sm leading-relaxed">
            Prototype demo — parent account includes Ayaan, Diya, Vivaan & Saanvi.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2 max-w-sm">
            {(Object.keys(ROLE_META) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r)
                  setEmail(DEMO_EMAIL[r])
                }}
                className={`text-left p-3 rounded-xl border text-sm ${
                  role === r ? 'bg-white/15 border-white/40' : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  {ICONS[r]} {ROLE_META[r].label}
                </span>
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-foam/40">parent@demo.com · demo1234</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="flex gap-2 mb-6">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${
                  mode === m ? 'bg-forest text-white' : 'bg-white border border-mist'
                }`}
              >
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => void onSubmit(e)} className="glass-card rounded-3xl p-6 space-y-4">
            {mode === 'signup' && (
              <input
                className="w-full px-4 py-3 rounded-xl border border-mist"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                required
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-mist"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                required
                type={show ? 'text' : 'password'}
                minLength={6}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-mist"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate"
                onClick={() => setShow((v) => !v)}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-sm text-danger bg-danger/10 px-3 py-2 rounded-xl">{error}</p>}
            <SpecularButton type="submit" className="w-full" disabled={busy}>
              {busy ? 'Please wait…' : 'Continue'} <ArrowRight size={16} />
            </SpecularButton>
          </form>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate mb-2">
            One-click demo
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROLE_META) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                disabled={busy}
                onClick={() => void demo(r)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-mist text-xs font-semibold disabled:opacity-50"
              >
                <span style={{ color: ROLE_META[r].color }}>{ICONS[r]}</span>
                {ROLE_META[r].label}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm">
            <Link to="/" className="text-forest font-medium">
              ← Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
