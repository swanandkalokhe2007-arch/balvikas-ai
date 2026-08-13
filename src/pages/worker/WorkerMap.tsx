import { lazy, Suspense, useEffect, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { FadeIn } from '../../components/motion/FadeIn'
import { MapAPI } from '../../lib/api'
import { useData } from '../../context/DataContext'

const LiveMap = lazy(() =>
  import('../../components/maps/LiveMap').then((m) => ({ default: m.LiveMap })),
)

export function WorkerMap() {
  const { children, visits } = useData()
  const [points, setPoints] = useState<Awaited<ReturnType<typeof MapAPI.points>> | null>(null)

  useEffect(() => {
    void MapAPI.points()
      .then(setPoints)
      .catch(() => null)
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

  return (
    <div className="space-y-6 max-w-5xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <MapPinned size={22} className="text-gold" /> Field map
        </h1>
        <p className="text-sm text-slate mt-1">
          Children and pending home visits on a live street map — plan your route for the day
        </p>
      </FadeIn>

      <Suspense
        fallback={
          <div className="h-[440px] rounded-3xl bg-mist/50 animate-pulse flex items-center justify-center text-slate text-sm">
            Loading map…
          </div>
        }
      >
        <LiveMap
          title="Village & visit locations"
          subtitle="Blue rings = open visits · coloured dots = child risk"
          height={460}
          childrenPts={childrenPts}
          visits={visitPts}
          districts={points?.districts?.filter((d) => d.name === 'Nashik') || []}
        />
      </Suspense>
    </div>
  )
}
