import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Appointment, Child, DistrictStat, HomeVisit, MediaUpload } from '../types'
import {
  AppointmentsAPI,
  ChildrenAPI,
  MapAPI,
  MediaAPI,
  StatsAPI,
  VisitsAPI,
  getToken,
} from '../lib/api'
import { useAuth } from './AuthContext'

type DataCtx = {
  children: Child[]
  appointments: Appointment[]
  visits: HomeVisit[]
  media: MediaUpload[]
  districts: DistrictStat[]
  stats: {
    totalChildren: number
    highRisk: number
    appointmentsToday: number
    pendingVisits: number
    mediaCount: number
  } | null
  loading: boolean
  error: string | null
  myChildren: Child[]
  refresh: () => Promise<void>
  getChild: (id: string) => Child | undefined
  createChild: (body: Record<string, unknown>) => Promise<Child>
  updateVisit: (id: string, body: Record<string, unknown>) => Promise<void>
  uploadMedia: (childId: string, file: File) => Promise<MediaUpload>
  refreshMedia: (childId?: string) => Promise<void>
}

const Ctx = createContext<DataCtx | null>(null)

export function DataProvider({ children: tree }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [visits, setVisits] = useState<HomeVisit[]>([])
  const [media, setMedia] = useState<MediaUpload[]>([])
  const [districts, setDistricts] = useState<DistrictStat[]>([])
  const [stats, setStats] = useState<DataCtx['stats']>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    // Prefer live token — don't depend only on React isAuthenticated flag
    if (!getToken()) return
    setLoading(true)
    setError(null)
    try {
      const kids = await ChildrenAPI.list()
      setChildren(Array.isArray(kids.children) ? kids.children : [])

      const [a, v, d, s, m] = await Promise.all([
        AppointmentsAPI.list().catch(() => ({ appointments: [] as Appointment[] })),
        VisitsAPI.list().catch(() => ({ visits: [] as HomeVisit[] })),
        MapAPI.districts().catch(() => ({ districts: [] as DistrictStat[] })),
        StatsAPI.overview().catch(() => null),
        MediaAPI.list().catch(() => ({ media: [] as MediaUpload[] })),
      ])
      setAppointments(a.appointments || [])
      setVisits(v.visits || [])
      setDistricts(d.districts || [])
      setMedia(m.media || [])
      if (s) {
        setStats({
          totalChildren: s.totalChildren,
          highRisk: s.highRisk,
          appointmentsToday: s.appointmentsToday,
          pendingVisits: s.pendingVisits,
          mediaCount: s.mediaCount,
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated || getToken()) {
      void refresh()
    } else {
      setChildren([])
      setAppointments([])
      setVisits([])
      setMedia([])
      setDistricts([])
      setStats(null)
    }
  }, [isAuthenticated, user?.id, user?.email, refresh])

  useEffect(() => {
    if (!getToken()) return
    if (!media.some((m) => m.analysisStatus === 'analyzing')) return
    const t = setInterval(() => {
      void MediaAPI.list().then((r) => setMedia(r.media || []))
    }, 1500)
    return () => clearInterval(t)
  }, [media])

  // Server already filters children for parents — use list as-is.
  // Extra client filter only as safety net.
  const myChildren = useMemo(() => {
    if (!user) return children
    if (user.role !== 'parent') return children
    const byId = children.filter((c) => c.parentId === user.id)
    if (byId.length) return byId
    // If API already returned only this parent's kids, parentIds may still match
    // or list is already scoped — return full list from last fetch
    return children
  }, [children, user])

  const getChild = useCallback((id: string) => children.find((c) => c.id === id), [children])

  const createChild = useCallback(async (body: Record<string, unknown>) => {
    const { child } = await ChildrenAPI.create(body)
    setChildren((prev) => [child, ...prev])
    return child
  }, [])

  const updateVisit = useCallback(async (id: string, body: Record<string, unknown>) => {
    const { visit } = await VisitsAPI.update(id, body)
    setVisits((prev) => prev.map((v) => (v.id === id ? visit : v)))
  }, [])

  const uploadMedia = useCallback(async (childId: string, file: File) => {
    const { media: m } = await MediaAPI.upload(childId, file)
    setMedia((prev) => [m, ...prev])
    return m
  }, [])

  const refreshMedia = useCallback(async (childId?: string) => {
    const r = await MediaAPI.list(childId)
    setMedia(r.media || [])
  }, [])

  const value = useMemo(
    () => ({
      children,
      appointments,
      visits,
      media,
      districts,
      stats,
      loading,
      error,
      myChildren,
      refresh,
      getChild,
      createChild,
      updateVisit,
      uploadMedia,
      refreshMedia,
    }),
    [
      children,
      appointments,
      visits,
      media,
      districts,
      stats,
      loading,
      error,
      myChildren,
      refresh,
      getChild,
      createChild,
      updateVisit,
      uploadMedia,
      refreshMedia,
    ],
  )

  return <Ctx.Provider value={value}>{tree}</Ctx.Provider>
}

export function useData() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useData outside provider')
  return v
}
