import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, UserPlus } from 'lucide-react'
import { FadeIn } from './motion/FadeIn'
import { SpecularButton } from './motion/SpecularButton'
import { useAuth } from '../context/AuthContext'
import { ChildrenAPI, getToken, loginAndStore } from '../lib/api'
import type { Child } from '../types'

const LOCAL_EXTRA_KEY = 'balvikas_local_children'

interface Props {
  successPath: string
  title?: string
  subtitle?: string
  lockParentName?: boolean
}

function ageMonths(dob: string) {
  const d = new Date(dob)
  const n = new Date()
  return Math.max(0, (n.getFullYear() - d.getFullYear()) * 12 + (n.getMonth() - d.getMonth()))
}

export function ChildRegisterForm({
  successPath,
  title = 'Register child',
  subtitle = 'Adds to your prototype dashboard immediately',
  lockParentName = false,
}: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    gender: 'female' as 'female' | 'male',
    dob: '',
    parent: lockParentName ? user?.name || 'Neha Verma' : '',
    village: user?.village || 'Sinnar',
    phone: user?.phone || '',
    heightCm: '',
    weightKg: '',
  })

  const saveLocal = (child: Child) => {
    try {
      const prev = JSON.parse(localStorage.getItem(LOCAL_EXTRA_KEY) || '[]') as Child[]
      localStorage.setItem(LOCAL_EXTRA_KEY, JSON.stringify([child, ...prev]))
      window.dispatchEvent(new Event('balvikas-children-updated'))
    } catch {
      /* ignore */
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const localChild: Child = {
      id: `local_${Date.now()}`,
      name: form.name.trim(),
      dob: form.dob,
      ageMonths: ageMonths(form.dob),
      gender: form.gender,
      heightCm: form.heightCm ? Number(form.heightCm) : 0,
      weightKg: form.weightKg ? Number(form.weightKg) : 0,
      parentId: user?.id || 'u_parent_1',
      parentName: form.parent.trim() || user?.name || 'Neha Verma',
      village: form.village.trim() || 'Sinnar',
      district: 'Nashik',
      allergies: [],
      medicalConditions: [],
      developmentStatus: 'normal',
      riskLevel: 'low',
      lastScreening: undefined,
      summary: `${form.name.trim()} — newly registered. Complete first screening.`,
      vaccinations: [],
      growthHistory:
        form.heightCm && form.weightKg
          ? [
              {
                date: new Date().toISOString().slice(0, 10),
                heightCm: Number(form.heightCm),
                weightKg: Number(form.weightKg),
                ageMonths: ageMonths(form.dob),
              },
            ]
          : [],
      screenings: [],
    }

    // Always save locally first so UI never fails
    saveLocal(localChild)

    try {
      if (!getToken()) await loginAndStore('parent@demo.com', 'demo1234')
      await ChildrenAPI.create({
        name: localChild.name,
        gender: localChild.gender,
        dob: localChild.dob,
        parentName: localChild.parentName,
        village: localChild.village,
        phone: form.phone.trim(),
        heightCm: localChild.heightCm || undefined,
        weightKg: localChild.weightKg || undefined,
        district: 'Nashik',
      })
    } catch {
      // Local save already succeeded — ignore API errors in prototype
    }

    setDone(true)
    setLoading(false)
    setTimeout(() => navigate(successPath), 500)
  }

  return (
    <div className="space-y-6 max-w-lg">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <UserPlus size={22} className="text-leaf" /> {title}
        </h1>
        <p className="text-sm text-slate mt-1">{subtitle}</p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form onSubmit={(e) => void submit(e)} className="glass-card rounded-3xl p-6 space-y-4">
          {[
            { key: 'name', label: 'Child name', type: 'text', required: true },
            { key: 'dob', label: 'Date of birth', type: 'date', required: true },
            {
              key: 'parent',
              label: 'Parent / guardian',
              type: 'text',
              required: true,
              disabled: lockParentName,
            },
            { key: 'phone', label: 'Phone', type: 'tel', required: false },
            { key: 'village', label: 'Village', type: 'text', required: true },
            { key: 'heightCm', label: 'Height (cm)', type: 'number', required: false },
            { key: 'weightKg', label: 'Weight (kg)', type: 'number', required: false },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-1.5">
                {f.label}
              </label>
              <input
                required={f.required}
                disabled={!!f.disabled}
                type={f.type}
                step={f.type === 'number' ? '0.1' : undefined}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-mist bg-white text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 disabled:bg-mist/40"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-1.5">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value as 'female' | 'male' })}
              className="w-full px-4 py-2.5 rounded-xl border border-mist bg-white text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          {error && <p className="text-sm text-danger bg-danger/10 px-3 py-2 rounded-xl">{error}</p>}
          <SpecularButton type="submit" className="w-full" disabled={loading || done}>
            {done ? (
              <>
                <Check size={16} /> Saved
              </>
            ) : loading ? (
              'Saving…'
            ) : (
              'Register child'
            )}
          </SpecularButton>
        </form>
      </FadeIn>
    </div>
  )
}
