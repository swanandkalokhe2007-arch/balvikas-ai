import { lazy, Suspense, useEffect, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { FadeIn } from '../../components/motion/FadeIn'
import { MapAPI } from '../../lib/api'
import { useData } from '../../context/DataContext'

const LiveMap = lazy(() =>
  import('../../components/maps/LiveMap').then((m) => ({ default: m.LiveMap })),
)

export function AdminMap() {
  const { districts: ctxDistricts, children, visits } = useData()
  const [loading, setLoading] = useState(true)
  const [points, setPoints] = useState<Awaited<ReturnType<typeof MapAPI.points>> | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const p = await MapAPI.points()
        if (!cancelled) setPoints(p)
      } catch {
        /* fall back to context */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const childrenPts =
    points?.children ||
    children
      .filter((c) => c.lat != null && c.lng != null)
      .map((c) => ({
        id: c.id,
        name: c.name,
        village: c.village,
        district: c.district,
        riskLevel: c.riskLevel,
        lat: c.lat as number,
        lng: c.lng as number,
      }))

  const visitPts =
    points?.visits ||
    visits
      .filter((v) => v.lat != null && v.lng != null)
      .map((v) => ({
        id: v.id,
        name: v.childName,
        village: v.village,
        purpose: v.purpose,
        status: v.status,
        lat: v.lat as number,
        lng: v.lng as number,
      }))

  const districtPts =
    points?.districts ||
    ctxDistricts.map((d) => ({
      id: d.district,
      name: d.district,
      lat: d.lat,
      lng: d.lng,
      highRisk: d.highRisk,
      registered: d.registered,
      screened: d.screened,
    }))

  return (
    <div className="space-y-6 max-w-6xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <MapPinned size={22} className="text-lavender" /> Live attention map
        </h1>
        <p className="text-sm text-slate mt-1">
          Real OpenStreetMap basemap · district hubs, child risk points, and open home visits
        </p>
      </FadeIn>

      {loading && !points ? (
        <div className="h-[440px] rounded-3xl bg-mist/50 animate-pulse flex items-center justify-center text-slate text-sm">
          Loading map tiles…
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="h-[440px] rounded-3xl bg-mist/50 animate-pulse flex items-center justify-center text-slate text-sm">
              Loading map…
            </div>
          }
        >
          <LiveMap
            title="Maharashtra programme map"
            subtitle="Pan, zoom, and click markers — same data as your live registry"
            height={480}
            childrenPts={childrenPts}
            visits={visitPts}
            districts={districtPts}
          />
        </Suspense>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...districtPts]
          .sort((a, b) => (b.highRisk || 0) - (a.highRisk || 0))
          .map((d, i) => (
            <FadeIn key={d.id || d.name} delay={0.05 + i * 0.03}>
              <div className="glass-card rounded-2xl p-4">
                <p className="font-semibold text-ink">{d.name}</p>
                <p className="text-xs text-slate mt-1">
                  {(d.registered || 0).toLocaleString()} registered ·{' '}
                  {(d.screened || 0).toLocaleString()} screened
                </p>
                <p className="text-sm font-semibold text-danger mt-2">
                  {d.highRisk || 0} high-risk cases
                </p>
              </div>
            </FadeIn>
          ))}
      </div>
    </div>
  )
}
