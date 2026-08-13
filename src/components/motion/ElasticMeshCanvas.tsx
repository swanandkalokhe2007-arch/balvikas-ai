import { useEffect, useRef } from 'react'

type Pt = { x: number; y: number; ox: number; oy: number; vx: number; vy: number }

/**
 * Interactive elastic mesh.
 * - Canvas is pointer-events: none so it never blocks UI
 * - Pointer is tracked on the host container (and window while inside)
 * - ResizeObserver keeps the grid sized correctly
 * - Soft idle wave so the mesh feels alive without input
 */
export function ElasticMeshCanvas({
  className = '',
  color = '11, 61, 46',
  spacing = 36,
  influence = 140,
}: {
  className?: string
  color?: string
  spacing?: number
  influence?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let raf = 0
    let cols = 0
    let rows = 0
    let w = 0
    let h = 0
    let dpr = 1
    let points: Pt[] = []
    let running = true
    let t0 = performance.now()

    const mouse = { x: -9999, y: -9999, active: false }
    const spring = 0.055
    const damp = 0.78
    const push = 22

    const build = () => {
      const rect = host.getBoundingClientRect()
      w = Math.max(1, Math.floor(rect.width))
      h = Math.max(1, Math.floor(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cols = Math.ceil(w / spacing) + 1
      rows = Math.ceil(h / spacing) + 1
      const next: Pt[] = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * spacing
          const py = y * spacing
          next.push({ x: px, y: py, ox: px, oy: py, vx: 0, vy: 0 })
        }
      }
      points = next
    }

    const toLocal = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect()
      return { x: clientX - rect.left, y: clientY - rect.top }
    }

    const onPointerMove = (e: PointerEvent) => {
      const p = toLocal(e.clientX, e.clientY)
      if (p.x < -40 || p.y < -40 || p.x > w + 40 || p.y > h + 40) {
        mouse.active = false
        mouse.x = -9999
        mouse.y = -9999
        return
      }
      mouse.x = p.x
      mouse.y = p.y
      mouse.active = true
    }

    const onPointerLeave = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    const draw = (now: number) => {
      if (!running) return
      const elapsed = (now - t0) / 1000
      ctx.clearRect(0, 0, w, h)

      const mx = mouse.x
      const my = mouse.y
      const inv = 1 / Math.max(influence, 1)

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        // idle breathing wave
        const wave =
          Math.sin(elapsed * 0.9 + p.ox * 0.018 + p.oy * 0.014) * 1.6 +
          Math.cos(elapsed * 0.55 + p.oy * 0.02) * 1.1

        let fx = (p.ox - p.x) * spring
        let fy = (p.oy + wave - p.y) * spring

        if (mouse.active) {
          const dx = p.x - mx
          const dy = p.y - my
          const dist = Math.hypot(dx, dy)
          if (dist < influence && dist > 0.001) {
            const t = 1 - dist * inv
            const force = t * t * push
            fx += (dx / dist) * force
            fy += (dy / dist) * force
          }
        }

        p.vx = (p.vx + fx) * damp
        p.vy = (p.vy + fy) * damp
        p.x += p.vx
        p.y += p.vy
      }

      // lines
      ctx.lineWidth = 1
      ctx.strokeStyle = `rgba(${color}, 0.16)`
      ctx.beginPath()
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const c = i % cols
        if (c < cols - 1) {
          const r = points[i + 1]
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(r.x, r.y)
        }
        if (i + cols < points.length) {
          const b = points[i + cols]
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(b.x, b.y)
        }
      }
      ctx.stroke()

      // nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        let glow = 0
        if (mouse.active) {
          const dist = Math.hypot(p.x - mx, p.y - my)
          if (dist < influence) glow = 1 - dist * inv
        }
        const r = 1.1 + glow * 2.4
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(45, 138, 100, ${0.22 + glow * 0.65})`
        ctx.fill()
      }

      // soft spotlight near cursor
      if (mouse.active) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, influence)
        g.addColorStop(0, 'rgba(126, 200, 163, 0.12)')
        g.addColorStop(1, 'rgba(126, 200, 163, 0)')
        ctx.fillStyle = g
        ctx.fillRect(mx - influence, my - influence, influence * 2, influence * 2)
      }

      raf = requestAnimationFrame(draw)
    }

    build()
    const ro = new ResizeObserver(() => build())
    ro.observe(host)

    // Track pointer on host + document so mesh reacts under text/cards
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)
    host.addEventListener('pointerdown', onPointerMove)
    window.addEventListener('pointermove', onPointerMove)

    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      host.removeEventListener('pointerdown', onPointerMove)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [color, spacing, influence])

  return (
    <div ref={hostRef} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
    </div>
  )
}
