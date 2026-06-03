import { memo, useEffect, useRef } from 'react'
import type { AtmosphereRegion, FogDensity, FogVariant } from '@/data/sceneAtmosphere'

interface SceneFogProps {
  density?: FogDensity
  variant?: FogVariant
  region?: AtmosphereRegion
  tint?: string
  windAngle?: number
  strength?: number
  zIndex?: number
}

interface DepthFogPatch {
  nx: number
  ny: number
  nw: number
  nh: number
  opacity: number
  depth: 1 | 2 | 3
  vx: number
  vy: number
  phase: number
}

const DENSITY_MULT: Record<FogDensity, number> = {
  none:       0,
  light:      0.55,
  medium:     0.75,
  dense:      0.95,
  industrial: 0.85,
}

function parseGray(tint: string): number {
  const p = tint.split(',').map(Number)
  const r = p[0] ?? 44
  const g = p[1] ?? r
  const b = p[2] ?? r
  return Math.round((r + g + b) / 3)
}

/** Niebla de profundidad — bolsas localizadas en suelo, esquinas y callejones */
export default memo(function SceneFog({
  density = 'light',
  variant = 'urban',
  region = 'gotham',
  tint = '44,44,46',
  windAngle = 0.22,
  strength = 1,
  zIndex = 4,
}: SceneFogProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (density === 'none') return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const gray = parseGray(tint)
    const mult = Math.min(1.35, DENSITY_MULT[density] * strength)
    if (mult <= 0) return

    const alley = region === 'crime-alley' || region === 'narrows'
    const patches: DepthFogPatch[] = []
    const windX = Math.sin(windAngle) * 0.05

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      patches.length = 0
      initPatches()
    }

    const pushPatch = (p: Omit<DepthFogPatch, 'vx' | 'vy' | 'phase'>) => {
      patches.push({
        ...p,
        vx: windX * (p.depth === 1 ? 0.35 : p.depth === 2 ? 0.55 : 0.75),
        vy: (Math.random() - 0.5) * 0.004,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const initPatches = () => {
      const groundCount = alley ? 5 : 3
      const sideCount = alley ? 4 : 2
      const cornerCount = alley ? 4 : 2

      for (let i = 0; i < groundCount; i++) {
        pushPatch({
          nx: 0.08 + Math.random() * 0.84,
          ny: 0.68 + Math.random() * 0.22,
          nw: 0.12 + Math.random() * 0.22,
          nh: 0.06 + Math.random() * 0.1,
          opacity: (0.014 + Math.random() * 0.012) * mult,
          depth: 1,
        })
      }

      for (let i = 0; i < sideCount; i++) {
        const left = Math.random() < 0.5
        pushPatch({
          nx: left ? 0.02 + Math.random() * 0.1 : 0.88 + Math.random() * 0.08,
          ny: 0.35 + Math.random() * 0.38,
          nw: 0.08 + Math.random() * 0.14,
          nh: 0.18 + Math.random() * 0.22,
          opacity: (0.01 + Math.random() * 0.01) * mult,
          depth: 2,
        })
      }

      for (let i = 0; i < cornerCount; i++) {
        const left = i % 2 === 0
        pushPatch({
          nx: left ? 0.01 + Math.random() * 0.12 : 0.82 + Math.random() * 0.12,
          ny: 0.55 + Math.random() * 0.28,
          nw: 0.1 + Math.random() * 0.16,
          nh: 0.12 + Math.random() * 0.16,
          opacity: (0.012 + Math.random() * 0.011) * mult,
          depth: 3,
        })
      }

      if (variant === 'industrial' && alley) {
        pushPatch({
          nx: 0.25 + Math.random() * 0.5,
          ny: 0.72 + Math.random() * 0.15,
          nw: 0.2 + Math.random() * 0.25,
          nh: 0.08 + Math.random() * 0.08,
          opacity: 0.016 * mult,
          depth: 2,
        })
      }
    }

    resize()

    const drawPatch = (p: DepthFogPatch, frame: number) => {
      const w = canvas.width
      const h = canvas.height
      const breathe = 0.88 + Math.sin(frame * 0.002 + p.phase) * 0.12
      const a = p.opacity * breathe
      const x = p.nx * w
      const y = p.ny * h
      const pw = p.nw * w
      const ph = p.nh * h
      const blur = p.depth === 1 ? 14 : p.depth === 2 ? 18 : 22

      const g = ctx.createRadialGradient(
        x + pw * 0.5, y + ph * 0.5, 0,
        x + pw * 0.5, y + ph * 0.5, Math.max(pw, ph) * 0.52,
      )
      g.addColorStop(0, `rgba(${gray},${gray},${gray},${a})`)
      g.addColorStop(0.5, `rgba(${gray - 4},${gray - 4},${gray - 4},${a * 0.42})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.filter = `blur(${blur}px)`
      ctx.fillStyle = g
      ctx.fillRect(x - pw * 0.15, y - ph * 0.2, pw * 1.3, ph * 1.35)
      ctx.filter = 'none'
    }

    let frame = 0
    const draw = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const layer of [1, 2, 3] as const) {
        for (const p of patches) {
          if (p.depth !== layer) continue
          p.nx += p.vx / canvas.width
          if (p.nx < -0.08) p.nx = 1.02
          if (p.nx > 1.08) p.nx = -0.02
          drawPatch(p, frame)
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('resize', resize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density, variant, region, tint, windAngle, strength])

  if (density === 'none') return null

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
    />
  )
})
