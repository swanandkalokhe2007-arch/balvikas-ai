import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  Camera,
  Shield,
  Users,
  Activity,
  Baby,
  Stethoscope,
  HeartHandshake,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Play,
  Upload,
  MessageCircle,
  MousePointer2,
  FileText,
} from 'lucide-react'
import { Aurora } from '../components/motion/Aurora'
import { ElasticMeshCanvas } from '../components/motion/ElasticMeshCanvas'
import { FoldText } from '../components/motion/FoldText'
import { MaskedHeading } from '../components/motion/MaskedHeading'
import { FadeIn } from '../components/motion/FadeIn'
import { SpecularButton } from '../components/motion/SpecularButton'
import { Logo } from '../components/ui/Logo'
import { ROLE_META } from '../data/mock'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

const FEATURES = [
  {
    title: 'Video & photo analysis',
    body: 'Parents upload clips of play, speech, and movement. Behaviour models surface patterns; doctors co-sign before guidance reaches the family.',
    accent: '#5b9bd5',
    icon: Camera,
  },
  {
    title: 'AI developmental insights',
    body: 'Milestone scoring, risk flags, and plain-language summaries so every caregiver knows what matters.',
    accent: '#9b8ec4',
    icon: Brain,
  },
  {
    title: 'Growth & vaccination',
    body: 'WHO-aligned height/weight trajectories, due reminders, and immunization history across roles.',
    accent: '#2d8a64',
    icon: Activity,
  },
  {
    title: 'Doctor clinical summary',
    body: 'One-glance history — allergies, conditions, screens — so new doctors never re-read the whole file.',
    accent: '#e07a5f',
    icon: Stethoscope,
  },
  {
    title: 'Anganwadi field tools',
    body: 'Home visits, pending screens, village rosters, and high-risk alerts built for Sevikas on the move.',
    accent: '#d4920a',
    icon: HeartHandshake,
  },
  {
    title: 'District intelligence',
    body: 'Admin maps, predictive load, and resource planning across regions that need more attention.',
    accent: '#0b3d2e',
    icon: BarChart3,
  },
  {
    title: 'Parent AI assistant',
    body: 'Calm chat for diet, sleep, vaccines, and “what does this score mean?” — grounded in the child’s record.',
    accent: '#5b9bd5',
    icon: MessageCircle,
  },
  {
    title: 'Downloadable reports',
    body: 'Clinic-ready summaries parents can save or share — growth, screens, vaccines, and AI snapshot.',
    accent: '#2d8a64',
    icon: FileText,
  },
] as const

const STEPS = [
  {
    n: '01',
    title: 'Create your role',
    body: 'Parent, doctor, Anganwadi worker, or health admin — one secure login, four purpose-built surfaces.',
  },
  {
    n: '02',
    title: 'Capture & screen',
    body: 'Upload media, log growth, run ASQ-style checks, or schedule home visits from the field.',
  },
  {
    n: '03',
    title: 'Act on insight',
    body: 'AI recommendations, clinical summaries, and parent-friendly next steps — before delay becomes destiny.',
  },
]

export function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, user, loginAs } = useAuth()

  const goRole = (role: Role) => {
    if (isAuthenticated && user?.role === role) navigate(`/${role}`)
    else navigate('/auth', { state: { role } })
  }

  const quickDemo = async (role: Role) => {
    try {
      const u = await loginAs(role)
      navigate(`/${u?.role || role}`)
    } catch {
      navigate('/auth', { state: { role } })
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream">
      <nav className="relative z-30 flex items-center justify-between px-5 md:px-10 py-5 max-w-7xl mx-auto">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate">
          <a href="#features" className="hover:text-forest transition-colors">
            Features
          </a>
          <a href="#roles" className="hover:text-forest transition-colors">
            Roles
          </a>
          <a href="#how" className="hover:text-forest transition-colors">
            How it works
          </a>
          <a href="#media" className="hover:text-forest transition-colors">
            Media AI
          </a>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <SpecularButton size="sm" onClick={() => navigate(`/${user.role}`)}>
              Open dashboard <ArrowRight size={16} />
            </SpecularButton>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-semibold text-forest hover:text-leaf transition-colors hidden sm:block"
              >
                Sign in
              </Link>
              <SpecularButton size="sm" onClick={() => navigate('/auth')}>
                Get started <ArrowRight size={16} />
              </SpecularButton>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[min(92vh,920px)] flex items-center noise">
        <Aurora />
        <div className="absolute inset-0 z-[1]">
          <ElasticMeshCanvas spacing={38} influence={150} />
        </div>
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 35% 45%, rgba(247,243,235,0.82) 0%, rgba(247,243,235,0.35) 55%, transparent 75%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-6 pb-20 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-forest/10 text-xs font-semibold text-forest mb-6 shadow-sm">
                  <Sparkles size={13} className="text-gold" />
                  AI childhood development screening · India-first
                </div>
              </FadeIn>

              <FoldText
                text="See every child clearly. Act before delay becomes destiny."
                className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] xl:text-[3.75rem] font-semibold leading-[1.06] tracking-tight text-ink max-w-2xl"
              />

              <FadeIn delay={0.35}>
                <p className="mt-6 text-lg text-slate max-w-xl leading-relaxed">
                  BalVikas AI connects parents, pediatricians, Anganwadi Sevikas, and health admins —
                  with growth charts, behaviour video analysis, clinical summaries, and district-level
                  risk maps.
                </p>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <SpecularButton size="lg" onClick={() => navigate('/auth')}>
                    Start free screening <ArrowRight size={18} />
                  </SpecularButton>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-forest font-semibold text-base hover:bg-white/70 transition-colors"
                  >
                    <Play size={16} className="fill-forest" /> Explore roles
                  </button>
                </div>
              </FadeIn>

              <FadeIn delay={0.65}>
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate">
                  {[
                    'Responsive web · iOS & Android ready',
                    'Secure role-based access',
                    'Downloadable reports',
                  ].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-leaf" /> {t}
                    </span>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.75}>
                <p className="mt-8 text-[11px] uppercase tracking-[0.16em] text-slate/70 font-semibold flex items-center gap-2">
                  <MousePointer2 size={12} /> Move cursor — elastic mesh responds
                </p>
              </FadeIn>
            </div>

            <div className="lg:col-span-5 relative">
              <FadeIn delay={0.28} direction="left">
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute -inset-3 rounded-[1.75rem] opacity-90"
                    style={{
                      background:
                        'linear-gradient(145deg, rgba(11,61,46,0.09), rgba(244,201,95,0.12) 50%, rgba(91,155,213,0.08))',
                      transform: 'rotate(1.5deg)',
                    }}
                  />

                  <div className="relative rounded-[1.6rem] bg-[#0f241c] text-cream overflow-hidden shadow-[0_28px_60px_-20px_rgba(12,26,20,0.55)]">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-white/[0.03]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-mint/90">
                          live · screening
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-white/40">BV-2841</span>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-3 mb-6">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-medium">
                            Child profile
                          </p>
                          <p className="font-display text-2xl font-semibold text-white mt-0.5">
                            Aarav Sharma
                          </p>
                          <p className="text-sm text-white/50 mt-0.5">2y 4m · Male · Sinnar</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-ok/20 text-mint text-[10px] font-bold uppercase tracking-wider border border-ok/30">
                          Low risk
                        </span>
                      </div>

                      <div className="space-y-3.5 mb-5">
                        {[
                          { label: 'Gross motor', v: 92 },
                          { label: 'Language', v: 88 },
                          { label: 'Social-emotional', v: 95 },
                          { label: 'Fine motor', v: 90 },
                        ].map((row, i) => (
                          <div key={row.label}>
                            <div className="flex justify-between text-[12px] mb-1.5">
                              <span className="text-white/55 font-medium">{row.label}</span>
                              <span className="font-mono text-mint tabular-nums">{row.v}</span>
                            </div>
                            <div className="h-[3px] rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: 'linear-gradient(90deg, #2d8a64, #7ec8a3)',
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${row.v}%` }}
                                transition={{
                                  duration: 1.1,
                                  delay: 0.55 + i * 0.08,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-mint/15 flex items-center justify-center shrink-0">
                            <Brain size={15} className="text-mint" />
                          </div>
                          <p className="text-[13px] leading-relaxed text-white/75">
                            Age-appropriate across domains. Peanut allergy noted. Vaccines current.
                            Continue play-based language exposure.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="absolute -left-3 sm:-left-6 bottom-10 rounded-2xl bg-white px-3.5 py-3 shadow-[0_12px_40px_-8px_rgba(12,26,20,0.25)] border border-forest/8 flex items-center gap-3 max-w-[220px]"
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#e8f2fb] text-sky flex items-center justify-center shrink-0">
                      <Upload size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate font-semibold">
                        Media analyzed
                      </p>
                      <p className="text-sm font-semibold text-ink truncate">playtime_01.mp4</p>
                    </div>
                  </motion.div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="relative z-10 border-y border-forest/8 bg-[#fbf9f4]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-9 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: '12k+', l: 'Children screened' },
            { v: '840+', l: 'Clinicians & Sevikas' },
            { v: '28', l: 'Districts covered' },
            { v: '94%', l: 'Parent satisfaction' },
          ].map((s, i) => (
            <FadeIn key={s.l} delay={i * 0.06} className="text-center md:text-left">
              <p className="font-display text-3xl md:text-4xl font-semibold masked-heading">{s.v}</p>
              <p className="text-sm text-slate mt-1.5">{s.l}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="relative py-24 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf mb-3">Platform</p>
          </FadeIn>
          <MaskedHeading className="font-display text-3xl md:text-5xl font-semibold leading-tight">
            Built for the whole care circle
          </MaskedHeading>
          <FadeIn delay={0.12}>
            <p className="mt-4 text-slate text-lg leading-relaxed">
              After login, use the simple scrollable menu on the left to open every module. Below is what
              each surface unlocks.
            </p>
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <FadeIn key={f.title} delay={i * 0.05}>
                <article className="group h-full relative rounded-3xl bg-white border border-forest/8 p-6 overflow-hidden shadow-[0_10px_28px_-18px_rgba(12,26,20,0.18)] hover:shadow-[0_18px_40px_-16px_rgba(12,26,20,0.22)] transition-shadow duration-300">
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-[0.12] transition-opacity group-hover:opacity-20"
                    style={{ background: f.accent }}
                    aria-hidden
                  />
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-black/[0.04]"
                    style={{ background: `${f.accent}16`, color: f.accent }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-slate text-sm leading-relaxed">{f.body}</p>
                </article>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="relative py-24 overflow-hidden bg-[#0f241c]">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div
            className="absolute w-[50vw] h-[50vw] rounded-full blur-[100px] -top-1/4 -left-10"
            style={{ background: 'radial-gradient(circle, #2d8a64, transparent 70%)' }}
          />
          <div
            className="absolute w-[40vw] h-[40vw] rounded-full blur-[90px] bottom-0 right-0"
            style={{ background: 'radial-gradient(circle, #f4c95f55, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint mb-3">Four dashboards</p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-white">
              Most focused on parents & doctors — field & admin fully equipped
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(ROLE_META) as Role[]).map((role, i) => {
              const m = ROLE_META[role]
              const icons = {
                parent: Baby,
                doctor: Stethoscope,
                worker: Users,
                admin: Shield,
              }
              const Icon = icons[role]
              const soft =
                m.color === '#d4920a'
                  ? '#f4c95f'
                  : m.color === '#9b8ec4'
                    ? '#c4b8e8'
                    : m.color === '#5b9bd5'
                      ? '#8fc4f0'
                      : '#7ec8a3'

              return (
                <FadeIn key={role} delay={i * 0.08}>
                  <button
                    type="button"
                    onClick={() => goRole(role)}
                    className="relative w-full text-left rounded-[1.3rem] p-6 bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 h-full flex flex-col backdrop-blur-sm group"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                      style={{
                        background: `linear-gradient(145deg, ${m.color}, ${m.color}cc)`,
                        color: '#fff',
                        boxShadow: `0 8px 24px ${m.color}40`,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-1.5 text-white">{m.label}</h3>
                    <p className="text-sm text-white/55 leading-relaxed flex-1 mb-6">{m.description}</p>
                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/8">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: soft }}>
                        Enter →
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          void quickDemo(role)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation()
                            void quickDemo(role)
                          }
                        }}
                        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/16 text-white/80 transition-colors"
                      >
                        Demo login
                      </span>
                    </div>
                  </button>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* Media AI */}
      <section id="media" className="relative py-24 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf mb-3">
                Behaviour intelligence
              </p>
            </FadeIn>
            <MaskedHeading className="font-display text-3xl md:text-4xl font-semibold leading-tight">
              Upload a moment. Get a clinical-grade read.
            </MaskedHeading>
            <FadeIn delay={0.15}>
              <p className="mt-4 text-slate text-lg leading-relaxed">
                Parents capture everyday play, speech samples, or mealtime. Models flag social engagement,
                motor patterns, and language cues — then route findings to the assigned doctor with clear
                parent guidance.
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <ul className="mt-6 space-y-3">
                {[
                  'Video & photo secure upload from any phone',
                  'AI findings + doctor co-sign workflow',
                  'Plain-language solutions pushed to parents',
                  'Chat assistant for follow-up questions',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-ink">
                    <CheckCircle2 size={18} className="text-leaf shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} direction="left">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-[2rem] opacity-70"
                style={{
                  background:
                    'conic-gradient(from 210deg at 50% 50%, #7ec8a333, #f4c95f22, #9b8ec422, #7ec8a333)',
                  filter: 'blur(2px)',
                }}
              />
              <div className="relative rounded-[1.5rem] bg-white border border-forest/8 shadow-[0_24px_50px_-24px_rgba(12,26,20,0.35)] overflow-hidden">
                <div className="px-5 py-3 border-b border-mist flex items-center justify-between bg-[#f7f3eb]/60">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate">
                    media pipeline
                  </span>
                  <span className="text-[11px] font-semibold text-leaf">3 steps</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-leaf/35 bg-foam/40">
                    <div className="w-11 h-11 rounded-xl bg-white border border-mist flex items-center justify-center text-leaf shadow-sm">
                      <Camera size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">Drop video or photo</p>
                      <p className="text-xs text-slate">MP4, MOV, JPG · max 100MB</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0f241c] text-white">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-mint">
                        Analysis complete
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/80 mb-3">
                      Strong joint attention and turn-taking. Eye contact consistent. No repetitive motor
                      patterns. Fine-motor grasp age-appropriate.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Social ✓', 'Motor ✓', 'No red flags'].map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/10 text-mint border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sand/80 border border-gold/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-warn mb-1.5">
                      For parents
                    </p>
                    <p className="text-sm leading-relaxed text-ink/80">
                      Keep 15-minute floor-time play daily. Narrate routines to grow vocabulary. Next screen
                      in 6 months unless new concerns arise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-[#efe6d5]/55">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <MaskedHeading className="font-display text-3xl md:text-4xl font-semibold">
              Three steps to clarity
            </MaskedHeading>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.1}>
                <div className="relative h-full rounded-3xl bg-white border border-forest/8 p-7 shadow-[0_8px_30px_-18px_rgba(12,26,20,0.2)] overflow-hidden">
                  <span className="font-display text-6xl font-semibold text-forest/[0.07] absolute -top-1 right-4 leading-none select-none">
                    {s.n}
                  </span>
                  <div className="relative pt-2">
                    <div className="w-8 h-1 rounded-full bg-leaf mb-5" />
                    <h3 className="font-display text-xl font-semibold text-ink mb-2">{s.title}</h3>
                    <p className="text-slate text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 md:px-10">
        <FadeIn>
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] bg-[#0b3d2e] p-10 md:p-16 text-center text-white">
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 80% at 20% 0%, #2d8a64, transparent), radial-gradient(ellipse 50% 60% at 90% 100%, #f4c95f44, transparent)',
              }}
            />
            <div className="absolute inset-0 elastic-mesh opacity-15 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight max-w-2xl mx-auto">
                Every delayed milestone is a conversation we can start earlier.
              </h2>
              <p className="mt-4 text-foam/75 max-w-lg mx-auto">
                Join BalVikas AI — free demo access for parents, clinicians, Anganwadi workers, and admins.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <SpecularButton size="lg" variant="gold" onClick={() => navigate('/auth')} className="!text-ink">
                  Create account <ArrowRight size={18} />
                </SpecularButton>
                <button
                  type="button"
                  onClick={() => void quickDemo('parent')}
                  className="px-8 py-4 rounded-2xl border border-white/25 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Try parent demo
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <footer className="border-t border-forest/10 py-10 px-5 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-slate text-center">
            BalVikas AI · Childhood Development Screening · Demo product · Not a substitute for emergency care
          </p>
          <p className="text-xs text-slate">© 2026 BalVikas Health</p>
        </div>
      </footer>
    </div>
  )
}
