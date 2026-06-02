import { useEffect, useRef, memo } from 'react'

interface Flash {
  x: number       // % horizontal origin
  intensity: number // 0-1
  duration: number  // ms
}

/**
 * LightningSystem — occasional white flash bursts.
 * All rendering via Canvas for zero DOM overhead.
 * Flashes every 8-28 seconds, randomised.
 */
const LightningSystem = memo(function LightningSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let nextFlashAt = Date.now() + 8000 + Math.random() * 12000

    // Queue of active flashes
    const flashes: Array<{ startedAt: number } & Flash> = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const scheduleFlash = () => {
      nextFlashAt = Date.now() + 8000 + Math.random() * 20000
    }

    const triggerFlash = () => {
      const main: Flash = { x: 20 + Math.random() * 60, intensity: 0.6 + Math.random() * 0.4, duration: 80 + Math.random() * 60 }
      flashes.push({ ...main, startedAt: Date.now() })
      // double-flash 120ms later (realistic lightning)
      if (Math.random() > 0.4) {
        setTimeout(() => {
          flashes.push({ x: main.x, intensity: main.intensity * 0.55, duration: 60, startedAt: Date.now() })
        }, 120 + Math.random() * 80)
      }
      scheduleFlash()
    }

    const draw = () => {
      rafId = requestAnimationFrame(draw)
      const now = Date.now()

      // Check if we should trigger
      if (now >= nextFlashAt) triggerFlash()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw active flashes
      let i = flashes.length
      while (i--) {
        const f = flashes[i]
        const elapsed = now - f.startedAt
        if (elapsed >= f.duration) { flashes.splice(i, 1); continue }
        // Shape: fast rise then decay
        const t = elapsed / f.duration
        // Triangle envelope: peaks at 15% then falls
        const env = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85
        const alpha = f.intensity * env * 0.18 // max 18% opacity — very subtle

        const grd = ctx.createRadialGradient(
          (f.x / 100) * canvas.width, 0,
          0,
          (f.x / 100) * canvas.width, canvas.height * 0.6,
          canvas.height * 0.9,
        )
        grd.addColorStop(0,   `rgba(220,230,255,${alpha})`)
        grd.addColorStop(0.5, `rgba(180,190,240,${alpha * 0.4})`)
        grd.addColorStop(1,   'rgba(0,0,0,0)')

        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 3, mixBlendMode: 'screen' }}
    />
  )
})

export default LightningSystem
