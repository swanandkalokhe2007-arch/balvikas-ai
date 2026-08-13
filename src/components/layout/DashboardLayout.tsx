import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Menu, X, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Logo } from '../ui/Logo'
import { ChildSwitcher } from '../ui/ChildSwitcher'
import { ROLE_META } from '../../data/mock'
import type { Role } from '../../types'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

interface Props {
  nav: NavItem[]
  children: ReactNode
  title?: string
}

function isNavActive(pathname: string, to: string) {
  if (pathname === to) return true
  // Nested routes under this item (but not when `to` is only the role root
  // and another nav item is a more specific match)
  if (to !== '/' && pathname.startsWith(to + '/')) return true
  return false
}

function activeLabel(pathname: string, nav: NavItem[]): string {
  let best = nav[0]?.label || 'Dashboard'
  let bestLen = -1
  for (const item of nav) {
    const exact = pathname === item.to
    const nested = item.to !== '/' && pathname.startsWith(item.to + '/')
    if (exact || nested) {
      const len = item.to.length + (exact ? 0.5 : 0)
      if (len > bestLen) {
        bestLen = len
        best = item.label
      }
    }
  }
  return best
}

export function DashboardLayout({ nav, children, title }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const currentLabel = useMemo(
    () => activeLabel(location.pathname, nav),
    [location.pathname, nav],
  )

  const handleLogout = useCallback(() => {
    void logout()
    navigate('/')
  }, [logout, navigate])

  if (!user) return null
  const meta = ROLE_META[user.role as Role]

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-0.5 px-3 pb-4" aria-label="Dashboard">
      {nav.map((item) => {
        // Prefer exact match for role root so Overview doesn't stay active on every page
        const end = item.to.split('/').filter(Boolean).length <= 1
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) => {
              // Also treat nested child routes as active when not the root
              const active = isActive || (!end && isNavActive(location.pathname, item.to))
              return [
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                active
                  ? 'bg-forest text-white font-semibold shadow-sm shadow-forest/15'
                  : 'text-ink/75 hover:bg-forest/8 hover:text-forest font-medium',
              ].join(' ')
            }}
          >
            {({ isActive }) => {
              const active = isActive || (!end && isNavActive(location.pathname, item.to))
              return (
                <>
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      active ? 'bg-white/15 text-white' : 'bg-forest/8 text-forest'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </>
              )
            }}
          </NavLink>
        )
      })}
    </nav>
  )

  const SidebarBody = ({
    mobile = false,
    onClose,
  }: {
    mobile?: boolean
    onClose?: () => void
  }) => (
    <>
      <div className="p-5 pb-3 flex items-start justify-between gap-2 shrink-0">
        <div>
          <Logo size="sm" to={`/${user.role}`} />
          <div
            className="mt-3.5 inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider border border-forest/8"
            style={{ background: meta.bg, color: meta.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            {meta.label}
          </div>
        </div>
        {mobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-forest/8 text-slate"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Normal scrollable menu — every item visible by scrolling */}
      <div className="flex-1 min-h-0 overflow-y-auto dash-nav-scroll">
        <NavList onNavigate={onClose} />
      </div>

      <div className="shrink-0 p-4 border-t border-forest/8 bg-white/50">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
            style={{ background: meta.color }}
          >
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
            <p className="text-[11px] text-slate truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate hover:text-forest hover:bg-forest/8 transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="dash-shell flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="dash-sidebar hidden md:flex flex-col w-[260px] lg:w-[280px] sticky top-0 h-screen shrink-0 border-r border-forest/10 bg-[#f3eee4]">
        <SidebarBody />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-xl border-b border-forest/8 px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="md:hidden p-2 rounded-xl hover:bg-forest/5"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate font-semibold truncate">
                {title || meta.label}
              </p>
              <h1 className="font-display text-base md:text-lg font-semibold text-ink truncate leading-tight">
                {currentLabel}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'parent' && <ChildSwitcher />}
            <button
              type="button"
              className="relative p-2.5 rounded-xl hover:bg-forest/5 text-slate"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral pulse-ring" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-forest/5"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: meta.color }}
                >
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-slate" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-52 glass-card rounded-xl py-2 shadow-xl z-50"
                  >
                    <div className="px-3 py-2 border-b border-mist">
                      <p className="text-xs text-slate">{meta.label}</p>
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-danger/5"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 page-enter dash-main-scroll overflow-y-auto">{children}</main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/25 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 w-[min(100vw-3rem,300px)] z-50 md:hidden flex flex-col shadow-2xl overflow-hidden border-r border-forest/10 bg-[#f3eee4]"
            >
              <SidebarBody mobile onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
