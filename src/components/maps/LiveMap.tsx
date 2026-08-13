import { useEffect, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FadeIn } from '../motion/FadeIn'

try {
  // Default PNG markers unused (CircleMarker only)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proto = (L as any).Icon?.Default?.prototype
  if (proto) delete proto._getIconUrl
} catch {
  /* ignore */
}

export type MapChildPoint = {
  id: string
  name: string
  village?: string
  district?: string
  riskLevel?: string
  lat: number
  lng: number
}

export type MapVisitPoint = {
  id: string
  name: string
  village?: string
  purpose?: string
  status?: string
  lat: number
  lng: number
}

export type MapDistrictPoint = {
  id: string
  name: string
  lat: number
  lng: number
  highRisk?: number
  registered?: number
  screened?: number
}

function FitBounds({ points }: { points: Array<{ lat: number; lng: number }> }) {
  const map = useMap()
  useEffect(() => {
    if (!points.length) return
    try {
      const b = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]))
      map.fitBounds(b.pad(0.18), { animate: true, maxZoom: 11 })
    } catch {
      /* ignore bad bounds */
    }
  }, [map, points])
  return null
}

const riskColor = (r?: string) => {
  if (r === 'high') return '#c44b4b'
  if (r === 'medium') return '#d4920a'
  return '#2d8a64'
}

interface Props {
  childrenPts?: MapChildPoint[]
  visits?: MapVisitPoint[]
  districts?: MapDistrictPoint[]
  height?: number | string
  className?: string
  showLegend?: boolean
  title?: string
  subtitle?: string
}

export function LiveMap({
  childrenPts = [],
  visits = [],
  districts = [],
  height = 440,
  className = '',
  showLegend = true,
  title,
  subtitle,
}: Props) {
  const all = useMemo(
    () => [
      ...childrenPts.map((p) => ({ lat: p.lat, lng: p.lng })),
      ...visits.map((p) => ({ lat: p.lat, lng: p.lng })),
      ...districts.map((p) => ({ lat: p.lat, lng: p.lng })),
    ],
    [childrenPts, visits, districts],
  )

  const center: [number, number] = all.length
    ? [
        all.reduce((s, p) => s + p.lat, 0) / all.length,
        all.reduce((s, p) => s + p.lng, 0) / all.length,
      ]
    : [19.75, 73.9]

  return (
    <FadeIn className={className}>
      <div className="rounded-3xl overflow-hidden border border-forest/10 bg-white shadow-[0_12px_40px_-20px_rgba(12,26,20,0.2)]">
        {(title || subtitle) && (
          <div className="px-5 py-3.5 border-b border-mist flex items-end justify-between gap-3 bg-[#fbf9f4]">
            <div>
              {title && <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>}
              {subtitle && <p className="text-xs text-slate mt-0.5">{subtitle}</p>}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate/70">
              OpenStreetMap · live
            </span>
          </div>
        )}
        <div style={{ height }} className="relative z-0">
          <MapContainer
            center={center}
            zoom={8}
            scrollWheelZoom
            className="h-full w-full"
            style={{ background: '#e8efe9' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={19}
            />
            <FitBounds points={all} />

            {districts.map((d) => (
              <CircleMarker
                key={`d-${d.id}`}
                center={[d.lat, d.lng]}
                radius={10 + Math.min(18, (d.highRisk || 0) / 40)}
                pathOptions={{
                  color: '#9b8ec4',
                  fillColor: '#9b8ec4',
                  fillOpacity: 0.28,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
                  <span className="font-semibold">{d.name}</span>
                </Tooltip>
                <Popup>
                  <div className="text-sm min-w-[160px]">
                    <p className="font-semibold text-ink mb-1">{d.name}</p>
                    <p className="text-slate text-xs">
                      Registered: {d.registered?.toLocaleString()}
                    </p>
                    <p className="text-slate text-xs">Screened: {d.screened?.toLocaleString()}</p>
                    <p className="text-danger text-xs font-semibold mt-1">
                      High risk: {d.highRisk}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {childrenPts.map((c) => (
              <CircleMarker
                key={`c-${c.id}`}
                center={[c.lat, c.lng]}
                radius={c.riskLevel === 'high' ? 9 : 7}
                pathOptions={{
                  color: riskColor(c.riskLevel),
                  fillColor: riskColor(c.riskLevel),
                  fillOpacity: 0.85,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-slate">
                      {c.village}
                      {c.district ? `, ${c.district}` : ''}
                    </p>
                    <p className="text-xs mt-1 capitalize">
                      Risk:{' '}
                      <strong style={{ color: riskColor(c.riskLevel) }}>{c.riskLevel}</strong>
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {visits.map((v) => (
              <CircleMarker
                key={`v-${v.id}`}
                center={[v.lat, v.lng]}
                radius={8}
                pathOptions={{
                  color: v.status === 'overdue' ? '#c44b4b' : '#5b9bd5',
                  fillColor: '#fff',
                  fillOpacity: 1,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-slate">{v.village}</p>
                    <p className="text-xs mt-1">{v.purpose}</p>
                    <p className="text-xs capitalize mt-0.5">Status: {v.status}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {showLegend && (
          <div className="px-5 py-3 border-t border-mist flex flex-wrap gap-4 text-[11px] font-medium text-slate bg-white">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-ok" /> Child · low risk
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-warn" /> Child · medium
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-danger" /> Child · high risk
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-sky bg-white" /> Home visit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-lavender/50 border border-lavender" />{' '}
              District hub
            </span>
          </div>
        )}
      </div>
    </FadeIn>
  )
}

export default LiveMap
