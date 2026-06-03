import { memo, useEffect, useRef } from 'react'

export type ParticleMode =
  | 'none'
  | 'crime-alley'
  | 'narrows'
  | 'arkham'
  | 'wayne'
  | 'batcomputer'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  kind: 'smoke' | 'steam' | 'dust' | 'mist' | 'pipe'
}

interface AmbientParticlesProps {
  mode?: ParticleMode
  windAngle?: number
  zIndex?: number
}

/** Partículas atmosféricas cinematográficas — sin brillos sci-fi */
export default memo(function AmbientParticles({
  mode = 'none',
  windAngle = 0.22,
  zIndex = 6,
}: AmbientParticlesProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (mode === 'none') return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const particles: Particle[] = []
    const windX = Math.sin(windAngle) * 0.35
    let spawnTimer = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const spawn = (): Particle => {
      const w = canvas.width
      const h = canvas.height

      if (mode === 'crime-alley') {
        const steam = Math.random() < 0.55
        return {
          x: steam ? w * (0.1 + Math.random() * 0.8) : Math.random() * w,
          y: steam ? h * (0.82 + Math.random() * 0.1) : h * (0.65 + Math.random() * 0.3),
          vx: windX * (steam ? 0.4 : 0.15) + (Math.random() - 0.5) * 0.12,
          vy: steam ? -0.35 - Math.random() * 0.45 : -0.08 - Math.random() * 0.12,
          size: steam ? 14 + Math.random() * 22 : 20 + Math.random() * 35,
          opacity: 0.025 + Math.random() * 0.03,
          life: 1,
          maxLife: steam ? 0.9 + Math.random() * 0.5 : 1.2 + Math.random() * 0.6,
          kind: steam ? 'steam' : 'smoke',
        }
      }

      if (mode === 'narrows') {
        const pipe = Math.random() < 0.35
        return {
          x: pipe ? -20 : Math.random() * w,
          y: h * (0.68 + Math.random() * 0.25),
          vx: pipe ? 0.2 + Math.random() * 0.35 + windX : windX * 0.5 + (Math.random() - 0.5) * 0.08,
          vy: pipe ? (Math.random() - 0.5) * 0.06 : -0.12 - Math.random() * 0.15,
          size: pipe ? 35 + Math.random() * 50 : 18 + Math.random() * 30,
          opacity: 0.03 + Math.random() * 0.035,
          life: 1,
          maxLife: 1.1 + Math.random() * 0.7,
          kind: pipe ? 'pipe' : 'smoke',
        }
      }

      if (mode === 'arkham') {
        const dust = Math.random() < 0.6
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: windX * 0.12 + (Math.random() - 0.5) * 0.06,
          vy: dust ? (Math.random() - 0.5) * 0.04 : -0.06 - Math.random() * 0.08,
          size: dust ? 0.8 + Math.random() * 1.8 : 12 + Math.random() * 18,
          opacity: dust ? 0.03 + Math.random() * 0.04 : 0.02 + Math.random() * 0.025,
          life: 1,
          maxLife: dust ? 2 + Math.random() : 0.8 + Math.random() * 0.5,
          kind: dust ? 'dust' : 'mist',
        }
      }

      if (mode === 'wayne') {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.04,
          vy: -0.02 - Math.random() * 0.04,
          size: 0.4 + Math.random() * 0.8,
          opacity: 0.015 + Math.random() * 0.02,
          life: 1,
          maxLife: 2.5,
          kind: 'dust',
        }
      }

      /* batcomputer — mínimo, tono frío */
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.05,
        vy: -0.04 - Math.random() * 0.06,
        size: 0.5 + Math.random() * 1,
        opacity: 0.012 + Math.random() * 0.018,
        life: 1,
        maxLife: 2,
        kind: 'dust',
      }
    }

    const maxCount = mode === 'wayne' ? 8 : mode === 'batcomputer' ? 6 : mode === 'arkham' ? 22 : 28
    for (let i = 0; i < maxCount; i++) particles.push(spawn())

    const drawParticle = (p: Particle) => {
      const t = p.life / p.maxLife
      const a = p.opacity * t

      if (p.kind === 'dust') {
        ctx.fillStyle = `rgba(95,100,108,${a})`
        ctx.fillRect(p.x, p.y, p.size, p.size * 0.6)
        return
      }

      if (p.kind === 'steam' || p.kind === 'mist') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y - p.size * 0.3, p.size)
        g.addColorStop(0, `rgba(105,110,118,${a * 1.1})`)
        g.addColorStop(0.55, `rgba(85,90,98,${a * 0.5})`)
        g.addColorStop(1, 'rgba(70,75,82,0)')
        ctx.fillStyle = g
        ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2)
        return
      }

      if (p.kind === 'pipe') {
        const g = ctx.createLinearGradient(p.x, p.y, p.x + p.size * 2.5, p.y)
        g.addColorStop(0, `rgba(72,78,86,${a})`)
        g.addColorStop(0.6, `rgba(58,64,72,${a * 0.45})`)
        g.addColorStop(1, 'rgba(48,52,58,0)')
        ctx.fillStyle = g
        ctx.fillRect(p.x, p.y - p.size * 0.25, p.size * 3, p.size * 0.5)
        return
      }

      /* smoke */
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
      g.addColorStop(0, `rgba(88,92,98,${a * 0.7})`)
      g.addColorStop(0.5, `rgba(72,76,82,${a * 0.35})`)
      g.addColorStop(1, 'rgba(58,62,68,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * t, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      spawnTimer++
      const spawnRate = mode === 'wayne' || mode === 'batcomputer' ? 200 : 80
      if (spawnTimer > spawnRate && particles.length < maxCount + 6) {
        spawnTimer = 0
        if (Math.random() < 0.5) particles.push(spawn())
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.kind === 'steam' || p.kind === 'mist') {
          p.size += 0.06
          p.life -= 0.003
        } else if (p.kind === 'smoke' || p.kind === 'pipe') {
          p.life -= 0.002
        } else {
          p.life -= 0.001
        }

        if (
          p.life <= 0 ||
          p.x > canvas.width + 80 ||
          p.y < -40 ||
          p.y > canvas.height + 40
        ) {
          particles.splice(i, 1)
          continue
        }
        drawParticle(p)
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('resize', resize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [mode, windAngle])

  if (mode === 'none') return null

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
    />
  )
})
