import { memo, useEffect, useRef } from 'react'
import type { AtmosphereRegion } from '@/data/sceneAtmosphere'

interface UrbanAtmosphereProps {
  region?: AtmosphereRegion
  sewerSteam?: boolean
  industrialFog?: boolean
  urbanVapor?: boolean
  windAngle?: number
  zIndex?: number
}

interface Plume {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  kind: 'sewer' | 'vapor' | 'industrial'
}

/** Ground-level industrial fog, sewer steam, urban vapor — no luminous particles */
export default memo(function UrbanAtmosphere({
  region = 'gotham',
  sewerSteam = false,
  industrialFog = false,
  urbanVapor = false,
  windAngle = 0.22,
  zIndex = 5,
}: UrbanAtmosphereProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!sewerSteam && !industrialFog && !urbanVapor) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const plumes: Plume[] = []
    const windX = Math.sin(windAngle) * 0.4
    let vaporTimer = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const gratePositions = () => {
      const w = canvas.width
      const h = canvas.height
      return [
        { x: w * 0.18, y: h * 0.88 },
        { x: w * 0.42, y: h * 0.92 },
        { x: w * 0.68, y: h * 0.86 },
        { x: w * 0.85, y: h * 0.9 },
      ]
    }

    const spawnSewer = (x: number, y: number): Plume => ({
      x: x + (Math.random() - 0.5) * 16,
      y,
      vx: windX * 0.35 + (Math.random() - 0.5) * 0.08,
      vy: -0.12 - Math.random() * 0.18,
      size: 10 + Math.random() * 14,
      life: 1,
      maxLife: 1 + Math.random() * 0.6,
      kind: 'sewer',
    })

    const spawnVapor = (): Plume => ({
      x: Math.random() * canvas.width,
      y: canvas.height * (0.72 + Math.random() * 0.2),
      vx: windX * 0.2,
      vy: -0.08 - Math.random() * 0.12,
      size: 5 + Math.random() * 8,
      life: 1,
      maxLife: 0.7 + Math.random() * 0.4,
      kind: 'vapor',
    })

    const spawnIndustrial = (): Plume => ({
      x: -20 - Math.random() * 40,
      y: canvas.height * (0.72 + Math.random() * 0.22),
      vx: 0.15 + Math.random() * 0.25 + windX,
      vy: (Math.random() - 0.5) * 0.05,
      size: 40 + Math.random() * 60,
      life: 1,
      maxLife: 1.2 + Math.random() * 0.5,
      kind: 'industrial',
    })

    if (industrialFog) {
      for (let i = 0; i < 4; i++) plumes.push(spawnIndustrial())
    }

    const drawPlume = (p: Plume) => {
      const t = p.life / p.maxLife
      const alpha = t * 0.018
      if (p.kind === 'sewer') {
        const g = ctx.createRadialGradient(p.x, p.y - p.size * 0.4, 0, p.x, p.y - p.size * 0.6, p.size * 1.1)
        g.addColorStop(0, `rgba(72,72,74,${alpha})`)
        g.addColorStop(0.55, `rgba(58,58,60,${alpha * 0.45})`)
        g.addColorStop(1, 'rgba(48,48,50,0)')
        ctx.fillStyle = g
        ctx.fillRect(p.x - p.size, p.y - p.size * 1.2, p.size * 2, p.size * 2.2)
      } else if (p.kind === 'vapor') {
        ctx.beginPath()
        ctx.fillStyle = `rgba(68,68,70,${alpha * 0.75})`
        ctx.arc(p.x, p.y, p.size * t, 0, Math.PI * 2)
        ctx.fill()
      } else {
        const g = ctx.createLinearGradient(p.x, p.y, p.x + p.size * 2, p.y)
        g.addColorStop(0, `rgba(62,62,64,${alpha * 0.85})`)
        g.addColorStop(0.5, `rgba(54,54,56,${alpha * 0.4})`)
        g.addColorStop(1, 'rgba(48,48,50,0)')
        ctx.fillStyle = g
        ctx.fillRect(p.x, p.y - p.size * 0.25, p.size * 2.5, p.size * 0.5)
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (sewerSteam) {
        if (Math.random() < 0.02) {
          const grates = gratePositions()
          plumes.push(spawnSewer(grates[Math.floor(Math.random() * grates.length)].x, grates[Math.floor(Math.random() * grates.length)].y))
        }
      }

      vaporTimer++
      if (urbanVapor && vaporTimer > 120 + Math.random() * 180) {
        vaporTimer = 0
        plumes.push(spawnVapor())
      }

      if (industrialFog && plumes.filter(p => p.kind === 'industrial').length < 5 && Math.random() < 0.008) {
        plumes.push(spawnIndustrial())
      }

      for (let i = plumes.length - 1; i >= 0; i--) {
        const p = plumes[i]
        p.x += p.vx
        p.y += p.vy
        if (p.kind === 'sewer') { p.size += 0.06; p.life -= 0.0025 }
        else if (p.kind === 'vapor') { p.life -= 0.0035 }
        else { p.life -= 0.0015 }

        if (p.life <= 0 || p.x > canvas.width + 100) {
          plumes.splice(i, 1)
          continue
        }
        drawPlume(p)
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('resize', resize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [region, sewerSteam, industrialFog, urbanVapor, windAngle])

  if (!sewerSteam && !industrialFog && !urbanVapor) return null

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
    />
  )
})
